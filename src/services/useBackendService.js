import { supabase } from '../supabase'

const useBackendService = () => {
  // Test storage connection
  const testStorageConnection = async () => {
    try {
      console.log('🧪 Testing storage connection...');
      
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      
      const { data, error } = await supabase.storage
        .from('project-images')
        .upload('test-file.txt', file);
      
      if (error) {
        console.error('❌ Storage test failed:', error);
        throw error;
      }
      
      console.log('✅ Storage test passed:', data);
      
      // Clean up
      await supabase.storage
        .from('project-images')
        .remove(['test-file.txt']);
      
      return { success: true, data };
    } catch (error) {
      console.error('💥 Storage test error:', error);
      throw error;
    }
  };

  // Upload file to Supabase Storage
  const uploadFile = async (file, category) => {
    try {
      console.log('🚀 Starting file upload:', file.name, 'Category:', category);
      
      // Validate file
      if (!file || file.size === 0) {
        throw new Error('File is empty or invalid');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${category}/${fileName}`;

      console.log('📁 Uploading to path:', filePath);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (error) {
        console.error('❌ Storage upload error:', error);
        throw new Error('Storage upload failed: ' + error.message);
      }

      console.log('✅ File uploaded successfully:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      console.log('🔗 Public URL:', publicUrl);

      // Save to projects table
      const projectData = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: `Uploaded ${new Date().toLocaleDateString()}`,
        category: category,
        image_url: publicUrl
      };

      console.log('💾 Saving to projects table:', projectData);

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([projectData])
        .select();

      if (projectError) {
        console.error('❌ Project save error:', projectError);
        throw projectError;
      }

      console.log('✅ Project saved to database:', project);

      const result = {
        id: project[0].id,
        supabase_id: project[0].id,
        src: publicUrl,
        category,
        title: projectData.title,
        description: projectData.description,
        uploadDate: new Date().toLocaleDateString(),
        fileName: file.name
      };

      console.log('🎉 Upload completed successfully:', result);
      
      // Update localStorage immediately
      const currentProjects = await loadProjects();
      const updatedProjects = [result, ...currentProjects];
      localStorage.setItem('portfolio_permanent_storage', JSON.stringify(updatedProjects));
      
      return result;

    } catch (error) {
      console.error('💥 Upload failed:', error);
      throw new Error('File upload failed: ' + error.message);
    }
  };

  // Save projects (for bulk operations)
  const saveProjects = async (projects) => {
    try {
      localStorage.setItem('portfolio_permanent_storage', JSON.stringify(projects));
      return { success: true, message: 'Projects saved locally' };
    } catch (error) {
      throw new Error('Failed to save projects: ' + error.message);
    }
  };

  // Load projects from Supabase with cache control
  const loadProjects = async (forceRefresh = false) => {
    try {
      console.log('📥 Loading projects from Supabase...');
      
      // Clear cache if force refresh is requested
      if (forceRefresh) {
        localStorage.removeItem('portfolio_permanent_storage');
        console.log('🧹 Cleared local cache for force refresh');
      }

      // Try to get from localStorage first (unless force refresh)
      if (!forceRefresh) {
        const localData = localStorage.getItem('portfolio_permanent_storage');
        if (localData) {
          const result = JSON.parse(localData);
          console.log('📂 Loaded from localStorage:', result.length, 'projects');
          return result;
        }
      }

      // Fetch from Supabase
      const { data: supabaseProjects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase load error:', error);
        // Fallback to localStorage if available
        const localData = localStorage.getItem('portfolio_permanent_storage');
        const result = localData ? JSON.parse(localData) : [];
        console.log('📂 Fallback to localStorage:', result.length, 'projects');
        return result;
      }

      console.log('✅ Loaded from Supabase:', supabaseProjects?.length, 'projects');

      // Transform data to match expected format
      const projects = (supabaseProjects || []).map(project => ({
        id: project.id,
        supabase_id: project.id,
        title: project.title || 'Untitled Project',
        description: project.description || 'No description available',
        category: project.category || 'graphic-design',
        src: project.image_url,
        uploadDate: project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Recently',
        fileName: project.title
      }));

      // Update localStorage with fresh Supabase data
      localStorage.setItem('portfolio_permanent_storage', JSON.stringify(projects));
      console.log('💾 Updated localStorage with Supabase data');
      
      return projects;

    } catch (error) {
      console.error('💥 Load projects error:', error);
      // Final fallback to localStorage
      const localData = localStorage.getItem('portfolio_permanent_storage');
      return localData ? JSON.parse(localData) : [];
    }
  };

  // Delete project from Supabase and local storage - UPDATED WITH DELETE POLICY FIX
  const deleteProject = async (projectId) => {
    try {
      console.log('🗑️ STARTING DELETE PROCESS FOR:', projectId);
      
      // Get current projects to find the one to delete
      const currentProjects = await loadProjects();
      const projectToDelete = currentProjects.find(p => p.id === projectId);
      
      if (!projectToDelete) {
        throw new Error('Project not found in local storage');
      }

      console.log('📋 PROJECT TO DELETE:', projectToDelete);

      // STEP 1: Verify project exists in database
      console.log('🔍 STEP 1: Verifying project exists in Supabase...');
      const { data: existingProject, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectToDelete.supabase_id)
        .single();

      if (fetchError) {
        console.error('❌ Project not found in Supabase:', fetchError);
        throw new Error('Project not found in database');
      }
      
      console.log('✅ Project exists in Supabase:', existingProject.id);

      // STEP 2: Delete from Supabase projects table WITH DELETE POLICY
      console.log('🗂️ STEP 2: Deleting from Supabase database...');
      const { data: deleteResult, error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete.supabase_id)
        .select();

      if (deleteError) {
        console.error('❌ Supabase delete error:', deleteError);
        console.error('❌ Error details:', deleteError.details, deleteError.hint, deleteError.message);
        
        // Check if it's a policy error
        if (deleteError.message.includes('policy') || deleteError.code === '42501') {
          throw new Error('DELETE policy missing! Run: CREATE POLICY "Anyone can delete projects" ON projects FOR DELETE USING (true);');
        }
        
        throw new Error('Failed to delete from database: ' + deleteError.message);
      }
      
      console.log('✅ Database deletion result:', deleteResult);

      // STEP 3: Verify deletion was successful
      console.log('🔍 STEP 3: Verifying deletion...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: verifyData, error: verifyError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectToDelete.supabase_id)
        .single();

      if (verifyError && verifyError.code === 'PGRST116') {
        console.log('✅ VERIFICATION: Project successfully deleted from database');
      } else if (verifyData) {
        console.error('❌ VERIFICATION FAILED: Project still exists after deletion!', verifyData);
        throw new Error('Project was not deleted from database - check RLS policies');
      }

      // STEP 4: Delete from storage
      if (projectToDelete.src) {
        try {
          const urlParts = projectToDelete.src.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const category = projectToDelete.category || 'graphic-design';
          const storagePath = `${category}/${fileName}`;
          
          console.log('🖼️ STEP 4: Deleting from storage:', storagePath);
          
          const { data: storageData, error: storageError } = await supabase.storage
            .from('project-images')
            .remove([storagePath]);

          if (storageError) {
            console.warn('⚠️ Storage delete warning:', storageError.message);
          } else {
            console.log('✅ Storage deletion result:', storageData);
          }
        } catch (storageError) {
          console.warn('⚠️ Storage deletion attempt failed:', storageError.message);
        }
      }

      // STEP 5: Force clear cache and reload fresh data
      console.log('🧹 STEP 5: Force clearing cache and reloading...');
      localStorage.removeItem('portfolio_permanent_storage');
      
      // Fetch fresh data from Supabase
      console.log('🔄 Fetching fresh data from Supabase...');
      const { data: freshProjects, error: freshError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (freshError) {
        console.error('❌ Error fetching fresh data:', freshError);
        throw freshError;
      }

      console.log('📥 Fresh data from Supabase:', freshProjects?.length, 'projects');
      console.log('📋 Fresh project IDs:', freshProjects?.map(p => p.id));

      // Transform and save fresh data
      const projects = (freshProjects || []).map(project => ({
        id: project.id,
        supabase_id: project.id,
        title: project.title || 'Untitled Project',
        description: project.description || 'No description available',
        category: project.category || 'graphic-design',
        src: project.image_url,
        uploadDate: project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Recently',
        fileName: project.title
      }));

      localStorage.setItem('portfolio_permanent_storage', JSON.stringify(projects));
      
      console.log('✅ BACKEND DELETE COMPLETED. Fresh data loaded:', projects.length);
      return { success: true, message: 'Project deleted successfully' };
      
    } catch (error) {
      console.error('💥 BACKEND DELETE ERROR:', error);
      
      // Clear cache on error
      localStorage.removeItem('portfolio_permanent_storage');
      
      throw new Error('Failed to delete project: ' + error.message);
    }
  };

  // Clear all cache and force fresh load
  const clearAllCache = async () => {
    try {
      console.log('🧹 Clearing all cache...');
      
      // Clear localStorage
      localStorage.removeItem('portfolio_permanent_storage');
      
      // Clear any other related storage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('portfolio') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
      
      console.log('✅ Cache cleared');
      return { success: true, message: 'Cache cleared successfully' };
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
      throw new Error('Failed to clear cache: ' + error.message);
    }
  };

  // Test Supabase policies
  const testPolicies = async () => {
    try {
      console.log('🧪 Testing Supabase policies...');
      
      // Test SELECT policy
      const { data: selectData, error: selectError } = await supabase
        .from('projects')
        .select('count')
        .limit(1);
      
      if (selectError) {
        console.error('❌ SELECT policy test failed:', selectError);
      } else {
        console.log('✅ SELECT policy test passed');
      }

      // Test INSERT policy (create a test record then delete it)
      const testProject = {
        title: 'Test Policy Project',
        description: 'Testing policies',
        category: 'graphic-design',
        image_url: 'https://example.com/test.jpg'
      };

      const { data: insertData, error: insertError } = await supabase
        .from('projects')
        .insert([testProject])
        .select();

      if (insertError) {
        console.error('❌ INSERT policy test failed:', insertError);
      } else {
        console.log('✅ INSERT policy test passed');
        // Clean up test record
        await supabase.from('projects').delete().eq('id', insertData[0].id);
      }

      // Test DELETE policy
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', 999999); // Non-existent ID to test policy without affecting data

      if (deleteError && deleteError.message.includes('policy')) {
        console.error('❌ DELETE policy test failed - Policy missing:', deleteError);
        return { success: false, message: 'DELETE policy missing' };
      } else {
        console.log('✅ DELETE policy test passed');
      }

      return { success: true, message: 'All policy tests completed' };

    } catch (error) {
      console.error('💥 Policy test error:', error);
      return { success: false, message: error.message };
    }
  };

  // Get debug information
  const getDebugInfo = () => {
    const cached = localStorage.getItem('portfolio_permanent_storage');
    const projects = cached ? JSON.parse(cached) : [];
    
    return {
      localStorageCount: projects.length,
      localStorageProjects: projects.map(p => ({ id: p.id, title: p.title, supabase_id: p.supabase_id })),
      allStorageKeys: Object.keys(localStorage)
    };
  };

  return { 
    saveProjects, 
    loadProjects, 
    uploadFile, 
    deleteProject,
    testStorageConnection,
    testPolicies,
    clearAllCache,
    getDebugInfo
  };
};

export default useBackendService;

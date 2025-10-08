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

      // Save to projects table WITHOUT storage_path
      const projectData = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: `Uploaded ${new Date().toLocaleDateString()}`,
        category: category,
        image_url: publicUrl
        // Removed storage_path to avoid the error
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
        // Removed storage_path from result too
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

  // Delete project from Supabase and local storage
  const deleteProject = async (projectId) => {
    try {
      console.log('🗑️ Deleting project:', projectId);
      
      // Get current projects to find the one to delete
      const currentProjects = await loadProjects();
      const projectToDelete = currentProjects.find(p => p.id === projectId);
      
      if (!projectToDelete) {
        throw new Error('Project not found in local storage');
      }

      console.log('📋 Project to delete:', projectToDelete);

      // Delete from Supabase projects table if it has supabase_id
      if (projectToDelete.supabase_id) {
        console.log('🗂️ Deleting from Supabase database...');
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectToDelete.supabase_id);

        if (error) {
          console.error('❌ Supabase delete error:', error);
          throw new Error('Failed to delete from database: ' + error.message);
        }
        console.log('✅ Deleted from Supabase database');
      }

      // Try to delete from storage if we can determine the path
      // Note: We don't have storage_path anymore, but we can try to construct it
      if (projectToDelete.src) {
        try {
          // Extract filename from URL and try to delete
          const urlParts = projectToDelete.src.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const category = projectToDelete.category || 'graphic-design';
          const storagePath = `${category}/${fileName}`;
          
          console.log('🖼️ Attempting to delete from storage:', storagePath);
          
          const { error: storageError } = await supabase.storage
            .from('project-images')
            .remove([storagePath]);

          if (storageError) {
            console.warn('⚠️ Storage delete warning (may not exist):', storageError.message);
          } else {
            console.log('✅ Deleted from storage');
          }
        } catch (storageError) {
          console.warn('⚠️ Storage deletion attempt failed:', storageError.message);
        }
      }

      // Update local storage - remove the deleted project
      const updatedProjects = currentProjects.filter(project => project.id !== projectId);
      await saveProjects(updatedProjects);
      
      console.log('✅ Project deleted successfully. Remaining projects:', updatedProjects.length);
      return { success: true, message: 'Project deleted successfully' };
      
    } catch (error) {
      console.error('💥 Delete project error:', error);
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
    clearAllCache,
    getDebugInfo
  };
};

export default useBackendService;

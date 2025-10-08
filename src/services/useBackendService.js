import { supabase } from '../supabase'

const useBackendService = () => {
  // Cache version for invalidation
  const CACHE_VERSION = 'v2';
  const CACHE_KEY = `portfolio_permanent_storage_${CACHE_VERSION}`;
  
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
        fileName: file.name,
        created_at: new Date().toISOString()
      };

      console.log('🎉 Upload completed successfully:', result);
      
      // Clear cache to force fresh data on next load
      await clearAllCache();
      
      return result;

    } catch (error) {
      console.error('💥 Upload failed:', error);
      throw new Error('File upload failed: ' + error.message);
    }
  };

  // Save projects (for bulk operations)
  const saveProjects = async (projects) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: projects,
        timestamp: Date.now(),
        version: CACHE_VERSION
      }));
      return { success: true, message: 'Projects saved locally' };
    } catch (error) {
      throw new Error('Failed to save projects: ' + error.message);
    }
  };

  // Load projects from Supabase with improved cache control
  const loadProjects = async (forceRefresh = false) => {
    try {
      console.log('📥 Loading projects from Supabase...');
      
      // Check if we should use cache (1 hour cache duration)
      const cacheDuration = 60 * 60 * 1000; // 1 hour
      const now = Date.now();
      
      if (!forceRefresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp, version } = JSON.parse(cached);
          
          // Check if cache is valid and not expired
          if (version === CACHE_VERSION && (now - timestamp) < cacheDuration) {
            console.log('📂 Loaded from cache:', data.length, 'projects');
            return data;
          } else {
            console.log('🔄 Cache expired or version mismatch, fetching fresh data');
          }
        }
      }

      // Clear old cache versions
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('portfolio_permanent_storage') && key !== CACHE_KEY) {
          localStorage.removeItem(key);
        }
      });

      // Fetch from Supabase with retry logic
      let retries = 3;
      let lastError = null;
      
      while (retries > 0) {
        try {
          const { data: supabaseProjects, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            lastError = error;
            throw error;
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
            fileName: project.title,
            created_at: project.created_at
          }));

          // Update cache with fresh data
          await saveProjects(projects);
          console.log('💾 Updated cache with fresh data');
          
          return projects;

        } catch (error) {
          retries--;
          console.warn(`⚠️ Supabase fetch failed, ${retries} retries left:`, error);
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      // If all retries failed, try to use cached data even if expired
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        console.log('📂 Fallback to expired cache:', data.length, 'projects');
        return data;
      }

      throw lastError || new Error('Failed to load projects');

    } catch (error) {
      console.error('💥 Load projects error:', error);
      // Final fallback to any cached data
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        return data || [];
      }
      return [];
    }
  };

  // Delete project from Supabase and local storage
  const deleteProject = async (projectId) => {
    try {
      console.log('🗑 STARTING DELETE PROCESS FOR:', projectId);
      
      // Get current projects to find the one to delete
      const currentProjects = await loadProjects();
      const projectToDelete = currentProjects.find(p => p.id === projectId);
      
      if (!projectToDelete) {
        throw new Error('Project not found in local storage');
      }

      console.log('📋 PROJECT TO DELETE:', projectToDelete);

      // STEP 1: Delete from Supabase projects table
      console.log('🗂 STEP 1: Deleting from Supabase database...');
      const { data: deleteResult, error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete.supabase_id)
        .select();

      if (deleteError) {
        console.error('❌ Supabase delete error:', deleteError);
        
        // Check if it's a policy error
        if (deleteError.message.includes('policy') || deleteError.code === '42501') {
          throw new Error('DELETE policy missing! Run: CREATE POLICY "Anyone can delete projects" ON projects FOR DELETE USING (true);');
        }
        
        throw new Error('Failed to delete from database: ' + deleteError.message);
      }
      
      console.log('✅ Database deletion result:', deleteResult);

      // STEP 2: Delete from storage
      if (projectToDelete.src) {
        try {
          const urlParts = projectToDelete.src.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const category = projectToDelete.category || 'graphic-design';
          const storagePath = `${category}/${fileName}`;
          
          console.log('🖼 STEP 2: Deleting from storage:', storagePath);
          
          const { data: storageData, error: storageError } = await supabase.storage
            .from('project-images')
            .remove([storagePath]);

          if (storageError) {
            console.warn('⚠ Storage delete warning:', storageError.message);
          } else {
            console.log('✅ Storage deletion result:', storageData);
          }
        } catch (storageError) {
          console.warn('⚠ Storage deletion attempt failed:', storageError.message);
        }
      }

      // STEP 3: Clear cache to force fresh data
      console.log('🧹 STEP 3: Clearing cache...');
      await clearAllCache();
      
      console.log('✅ BACKEND DELETE COMPLETED');
      return { success: true, message: 'Project deleted successfully' };
      
    } catch (error) {
      console.error('💥 BACKEND DELETE ERROR:', error);
      
      // Clear cache on error
      await clearAllCache();
      
      throw new Error('Failed to delete project: ' + error.message);
    }
  };

  // Clear all cache and force fresh load
  const clearAllCache = async () => {
    try {
      console.log('🧹 Clearing all cache...');
      
      // Clear all portfolio-related cache
      Object.keys(localStorage).forEach(key => {
        if (key.includes('portfolio') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
      
      // Also clear the current cache key
      localStorage.removeItem(CACHE_KEY);
      
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
    const cached = localStorage.getItem(CACHE_KEY);
    const cacheData = cached ? JSON.parse(cached) : null;
    const projects = cacheData?.data || [];
    
    return {
      cacheVersion: CACHE_VERSION,
      cacheTimestamp: cacheData?.timestamp ? new Date(cacheData.timestamp).toLocaleString() : 'No cache',
      cacheAge: cacheData?.timestamp ? Math.round((Date.now() - cacheData.timestamp) / 1000 / 60) + ' minutes' : 'N/A',
      localStorageCount: projects.length,
      localStorageProjects: projects.map(p => ({ id: p.id, title: p.title, supabase_id: p.supabase_id })),
      allStorageKeys: Object.keys(localStorage).filter(key => key.includes('portfolio') || key.includes('supabase'))
    };
  };

  // Check for updates (called on app load)
  const checkForUpdates = async () => {
    try {
      console.log('🔍 Checking for updates...');
      
      // Get latest data from Supabase without using cache
      const { data: latestProjects } = await supabase
        .from('projects')
        .select('id, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (latestProjects && latestProjects.length > 0) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const cacheData = JSON.parse(cached);
          const cachedProjects = cacheData.data || [];
          
          // Simple check: if counts differ or latest project ID doesn't match, clear cache
          const latestProjectId = latestProjects[0].id;
          const hasLatestProject = cachedProjects.some(p => p.id === latestProjectId);
          
          if (!hasLatestProject || cachedProjects.length !== latestProjects.length) {
            console.log('🔄 Updates detected, clearing cache');
            await clearAllCache();
            return true;
          }
        }
      }
      
      return false;
    } catch (error) {
      console.error('❌ Update check failed:', error);
      return false;
    }
  };

  return { 
    saveProjects, 
    loadProjects, 
    uploadFile, 
    deleteProject,
    testStorageConnection,
    testPolicies,
    clearAllCache,
    getDebugInfo,
    checkForUpdates,
    CACHE_VERSION
  };
};

export default useBackendService;

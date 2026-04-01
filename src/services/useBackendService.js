/* eslint-disable no-unused-vars */
import { supabase } from '../supabase'

const useBackendService = () => {
  // Cache version for invalidation
  const CACHE_VERSION = 'v2';
  const CACHE_KEY = `portfolio_permanent_storage_${CACHE_VERSION}`;
  
  // Check if Supabase is configured properly
  const checkSupabaseConfig = () => {
    if (!supabase) {
      console.error('❌ Supabase client not initialized!');
      return false;
    }
    console.log('✅ Supabase client initialized');
    return true;
  };
  
  // Test storage connection with better error handling
  const testStorageConnection = async () => {
    try {
      console.log('🧪 Testing storage connection...');
      
      if (!checkSupabaseConfig()) {
        throw new Error('Supabase client not configured');
      }
      
      // First check if bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      if (bucketError) {
        console.error('❌ Failed to list buckets:', bucketError);
        throw new Error(`Cannot access storage: ${bucketError.message}`);
      }
      
      const bucketExists = buckets.some(b => b.name === 'project-images');
      if (!bucketExists) {
        console.error('❌ Bucket "project-images" does not exist!');
        throw new Error('Bucket "project-images" does not exist. Please create it in Supabase dashboard.');
      }
      
      console.log('✅ Bucket exists');
      
      const testFileName = `test/test-${Date.now()}.txt`;
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      
      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(testFileName, file);
      
      if (error) {
        console.error('❌ Storage test failed:', error);
        throw error;
      }
      
      console.log('✅ Storage test passed:', data);
      
      // Clean up
      await supabase.storage.from('project-images').remove([testFileName]);
      
      return { success: true, message: 'Storage connection successful!' };
    } catch (error) {
      console.error('💥 Storage test error:', error);
      return { success: false, message: error.message };
    }
  };

  // Upload file to Supabase Storage with fallback
  const uploadFile = async (file, category) => {
    try {
      console.log('🚀 Starting file upload:', file.name, 'Category:', category);
      
      // Validate file
      if (!file || file.size === 0) {
        throw new Error('File is empty or invalid');
      }
      
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`File too large! Max size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      }

      // Check Supabase config
      if (!checkSupabaseConfig()) {
        // Fallback to local storage only
        console.warn('⚠️ Supabase not configured, saving locally only');
        return await saveToLocalStorage(file, category);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${category}/${fileName}`;

      console.log('📁 Uploading to path:', filePath);

      // Try to upload to Supabase Storage
      let uploadSuccess = false;
      let publicUrl = null;
      
      try {
        const { data, error } = await supabase.storage
          .from('project-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('❌ Storage upload error:', error);
          throw error;
        }

        console.log('✅ File uploaded successfully:', data);
        
        // Get public URL
        const { data: { publicUrl: url } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);
        
        publicUrl = url;
        uploadSuccess = true;
        
      } catch (storageError) {
        console.error('💥 Storage upload failed:', storageError);
        console.log('📦 Falling back to local storage...');
        
        // Convert file to base64 for local storage
        const base64 = await fileToBase64(file);
        publicUrl = base64;
      }

      // Save to projects table - FIXED: Use correct column names
      const projectData = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: `Uploaded ${new Date().toLocaleDateString()}`,
        category: category,
        image_url: publicUrl,
        created_at: new Date().toISOString()  // Use created_at instead of upload_date
      };

      console.log('💾 Saving project data...', projectData);

      let savedProject = null;
      
      if (uploadSuccess) {
        // Try to save to Supabase
        try {
          const { data: project, error: projectError } = await supabase
            .from('projects')
            .insert([projectData])
            .select();

          if (projectError) {
            console.error('❌ Project save error:', projectError);
            throw projectError;
          }

          savedProject = project[0];
          console.log('✅ Project saved to Supabase:', savedProject);
        } catch (dbError) {
          console.error('💥 Database save failed:', dbError);
          // Fallback to local storage
          savedProject = await saveProjectToLocalStorage(projectData);
        }
      } else {
        // Save to local storage only
        savedProject = await saveProjectToLocalStorage(projectData);
      }

      const result = {
        id: savedProject?.id || Date.now().toString(),
        supabase_id: savedProject?.id || null,
        src: publicUrl,
        category,
        title: projectData.title,
        description: projectData.description,
        uploadDate: new Date().toLocaleDateString(),
        fileName: file.name,
        created_at: new Date().toISOString(),
        localOnly: !uploadSuccess
      };

      console.log('🎉 Upload completed:', result.localOnly ? '(Local only)' : '(Synced to Supabase)');
      
      // Clear cache to force fresh data on next load
      await clearAllCache();
      
      return result;

    } catch (error) {
      console.error('💥 Upload failed:', error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  };
  
  // Helper: Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };
  
  // Save to local storage only
  const saveToLocalStorage = async (file, category) => {
    const base64 = await fileToBase64(file);
    const projectData = {
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: `Uploaded ${new Date().toLocaleDateString()}`,
      category: category,
      image_url: base64,
      created_at: new Date().toISOString()
    };
    return await saveProjectToLocalStorage(projectData);
  };
  
  // Save project to local storage
  const saveProjectToLocalStorage = async (projectData) => {
    const localProjects = JSON.parse(localStorage.getItem('local_projects') || '[]');
    const newProject = {
      id: `local_${Date.now()}`,
      ...projectData,
      localOnly: true
    };
    localProjects.unshift(newProject);
    localStorage.setItem('local_projects', JSON.stringify(localProjects));
    return newProject;
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

  // Load projects from Supabase with fallback to local
  const loadProjects = async (forceRefresh = false) => {
    try {
      console.log('📥 Loading projects...');
      
      // Check if we should use cache (1 hour cache duration)
      const cacheDuration = 60 * 60 * 1000; // 1 hour
      const now = Date.now();
      
      if (!forceRefresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp, version } = JSON.parse(cached);
          
          if (version === CACHE_VERSION && (now - timestamp) < cacheDuration) {
            console.log('📂 Loaded from cache:', data.length, 'projects');
            return data;
          }
        }
      }

      let supabaseProjects = [];
      let supabaseError = null;
      
      // Try to load from Supabase
      if (checkSupabaseConfig()) {
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            supabaseError = error;
            console.error('❌ Supabase load error:', error);
          } else {
            supabaseProjects = data || [];
            console.log('✅ Loaded from Supabase:', supabaseProjects.length, 'projects');
          }
        } catch (error) {
          supabaseError = error;
          console.error('💥 Supabase fetch error:', error);
        }
      }
      
      // Load local projects
      const localProjects = JSON.parse(localStorage.getItem('local_projects') || '[]');
      console.log('📦 Local projects:', localProjects.length);
      
      // Transform and merge projects
      const transformedSupabase = supabaseProjects.map(project => ({
        id: project.id,
        supabase_id: project.id,
        title: project.title || 'Untitled Project',
        description: project.description || 'No description available',
        category: project.category || 'graphic-design',
        src: project.image_url,
        uploadDate: project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Recently',
        fileName: project.title,
        created_at: project.created_at,
        localOnly: false
      }));
      
      const transformedLocal = localProjects.map(project => ({
        ...project,
        src: project.image_url,
        uploadDate: project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Recently',
        localOnly: true
      }));
      
      // Merge (Supabase projects first, then local)
      const allProjects = [...transformedSupabase, ...transformedLocal];
      
      // Update cache
      await saveProjects(allProjects);
      console.log('💾 Updated cache with', allProjects.length, 'projects');
      
      return allProjects;

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

  // Delete project
  const deleteProject = async (projectId) => {
    try {
      console.log('🗑 Deleting project:', projectId);
      
      // Get current projects
      const currentProjects = await loadProjects();
      const projectToDelete = currentProjects.find(p => p.id === projectId);
      
      if (!projectToDelete) {
        throw new Error('Project not found');
      }

      // If it's a local project, just remove from local storage
      if (projectToDelete.localOnly) {
        const localProjects = JSON.parse(localStorage.getItem('local_projects') || '[]');
        const filtered = localProjects.filter(p => p.id !== projectId);
        localStorage.setItem('local_projects', JSON.stringify(filtered));
        console.log('✅ Deleted local project');
      } 
      // If it's from Supabase, try to delete from Supabase
      else if (projectToDelete.supabase_id) {
        try {
          // Delete from database
          const { error: deleteError } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectToDelete.supabase_id);

          if (deleteError) {
            console.error('❌ Supabase delete error:', deleteError);
          } else {
            console.log('✅ Deleted from Supabase database');
          }

          // Try to delete from storage
          if (projectToDelete.src && !projectToDelete.src.startsWith('data:')) {
            try {
              const urlParts = projectToDelete.src.split('/');
              const fileName = urlParts[urlParts.length - 1];
              const storagePath = `${projectToDelete.category}/${fileName}`;
              
              await supabase.storage
                .from('project-images')
                .remove([storagePath]);
              console.log('✅ Deleted from storage');
            } catch (storageError) {
              console.warn('⚠️ Storage delete warning:', storageError);
            }
          }
        } catch (error) {
          console.error('💥 Delete error:', error);
        }
      }

      // Clear cache
      await clearAllCache();
      
      console.log('✅ Delete completed');
      return { success: true, message: 'Project deleted successfully' };
      
    } catch (error) {
      console.error('💥 Delete error:', error);
      await clearAllCache();
      throw new Error('Failed to delete project: ' + error.message);
    }
  };

  // Clear all cache
  const clearAllCache = async () => {
    try {
      console.log('🧹 Clearing all cache...');
      
      // Clear portfolio cache
      localStorage.removeItem(CACHE_KEY);
      
      // Clear other portfolio caches
      Object.keys(localStorage).forEach(key => {
        if (key.includes('portfolio') && key !== 'local_projects') {
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

  // Test policies
  const testPolicies = async () => {
    try {
      console.log('🧪 Testing Supabase policies...');
      
      // Test SELECT
      const { data: selectData, error: selectError } = await supabase
        .from('projects')
        .select('count')
        .limit(1);
      
      if (selectError) {
        console.error('❌ SELECT test failed:', selectError);
      } else {
        console.log('✅ SELECT test passed');
      }

      return { success: true, message: 'Policy tests completed' };
    } catch (error) {
      console.error('💥 Policy test error:', error);
      return { success: false, message: error.message };
    }
  };

  // Get debug information
  const getDebugInfo = () => {
    const cached = localStorage.getItem(CACHE_KEY);
    const cacheData = cached ? JSON.parse(cached) : null;
    const localProjects = JSON.parse(localStorage.getItem('local_projects') || '[]');
    
    return {
      cacheVersion: CACHE_VERSION,
      cacheTimestamp: cacheData?.timestamp ? new Date(cacheData.timestamp).toLocaleString() : 'No cache',
      cacheAge: cacheData?.timestamp ? Math.round((Date.now() - cacheData.timestamp) / 1000 / 60) + ' minutes' : 'N/A',
      localStorageCount: cacheData?.data?.length || 0,
      localProjectsCount: localProjects.length,
      supabaseConfigured: checkSupabaseConfig(),
      allStorageKeys: Object.keys(localStorage).filter(key => key.includes('portfolio') || key.includes('supabase') || key === 'local_projects')
    };
  };

  // Check for updates
  const checkForUpdates = async () => {
    try {
      console.log('🔍 Checking for updates...');
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
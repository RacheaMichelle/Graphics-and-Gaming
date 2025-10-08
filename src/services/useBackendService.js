import { supabase } from '../supabase'

const useBackendService = () => {
  // Upload file to Supabase Storage
  const uploadFile = async (file, category) => {
    try {
      console.log('Starting file upload:', file.name, 'Category:', category);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${category}/${fileName}`;

      console.log('Uploading to path:', filePath);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      console.log('File uploaded successfully:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      // Save to projects table
      const projectData = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: `Uploaded ${new Date().toLocaleDateString()}`,
        category: category,
        image_url: publicUrl,
        storage_path: filePath
      };

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([projectData])
        .select();

      if (projectError) {
        console.error('Project save error:', projectError);
        throw projectError;
      }

      console.log('Project saved to database:', project);

      return {
        id: project[0].id,
        supabase_id: project[0].id,
        src: publicUrl,
        category,
        title: projectData.title,
        description: projectData.description,
        uploadDate: new Date().toLocaleDateString(),
        fileName: file.name,
        storage_path: filePath
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('File upload failed: ' + error.message);
    }
  };

  // Save projects (for bulk operations)
  const saveProjects = async (projects) => {
    try {
      // Save to localStorage for immediate UI update
      localStorage.setItem('portfolio_permanent_storage', JSON.stringify(projects));
      return { success: true, message: 'Projects saved locally' };
    } catch (error) {
      throw new Error('Failed to save projects: ' + error.message);
    }
  };

  // Load projects from Supabase
  const loadProjects = async () => {
    try {
      console.log('Loading projects from Supabase...');
      
      const { data: supabaseProjects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase load error:', error);
        // Fallback to localStorage
        const localData = localStorage.getItem('portfolio_permanent_storage');
        return localData ? JSON.parse(localData) : [];
      }

      console.log('Loaded from Supabase:', supabaseProjects);

      if (supabaseProjects && supabaseProjects.length > 0) {
        const projects = supabaseProjects.map(project => ({
          id: project.id,
          supabase_id: project.id,
          title: project.title,
          description: project.description,
          category: project.category,
          src: project.image_url,
          uploadDate: new Date(project.created_at).toLocaleDateString(),
          fileName: project.title,
          storage_path: project.storage_path
        }));

        // Update localStorage with Supabase data
        localStorage.setItem('portfolio_permanent_storage', JSON.stringify(projects));
        return projects;
      }

      // Fallback to localStorage if no Supabase data
      const localData = localStorage.getItem('portfolio_permanent_storage');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error('Load projects error:', error);
      const localData = localStorage.getItem('portfolio_permanent_storage');
      return localData ? JSON.parse(localData) : [];
    }
  };

  // Delete project from Supabase
  const deleteProject = async (projectId) => {
    try {
      console.log('Deleting project:', projectId);
      
      // Get project details first
      const projects = await loadProjects();
      const projectToDelete = projects.find(p => p.id === projectId);
      
      if (!projectToDelete) {
        throw new Error('Project not found');
      }

      // Delete from storage if applicable
      if (projectToDelete.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('project-images')
          .remove([projectToDelete.storage_path]);

        if (storageError) {
          console.warn('Storage delete warning:', storageError);
        }
      }

      // Delete from projects table if it has supabase_id
      if (projectToDelete.supabase_id) {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectToDelete.supabase_id);

        if (error) throw error;
      }

      // Update local storage
      const updatedProjects = projects.filter(project => project.id !== projectId);
      await saveProjects(updatedProjects);
      
      return { success: true, message: 'Project deleted successfully' };
    } catch (error) {
      console.error('Delete project error:', error);
      throw new Error('Failed to delete project: ' + error.message);
    }
  };

  return { saveProjects, loadProjects, uploadFile, deleteProject };
};

export default useBackendService;

import { supabase } from '../supabase'

const useBackendService = () => {
  // Upload file to Supabase Storage
  const uploadFile = async (file, category) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      return {
        id: Date.now() + Math.random(),
        src: publicUrl,
        category,
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: `Uploaded ${new Date().toLocaleDateString()}`,
        uploadDate: new Date().toLocaleDateString(),
        fileName: file.name,
        storage_path: filePath // store for deletion
      };
    } catch (error) {
      throw new Error('File upload failed: ' + error.message);
    }
  };

  // Save project to Supabase
  const saveProjects = async (projects) => {
    try {
      // Save to localStorage for immediate UI update
      localStorage.setItem('portfolio_permanent_storage', JSON.stringify(projects));
      
      // Save each project to Supabase
      for (const project of projects) {
        if (!project.supabase_id) { // Only save new projects
          const { data, error } = await supabase
            .from('projects')
            .insert([
              {
                title: project.title,
                description: project.description,
                category: project.category,
                image_url: project.src,
                created_at: new Date().toISOString()
              }
            ])
            .select();
          
          if (error) throw error;
          
          // Update local project with supabase_id
          project.supabase_id = data[0].id;
        }
      }
      
      // Update localStorage with supabase_ids
      localStorage.setItem('portfolio_permanent_storage', JSON.stringify(projects));
      
      return { success: true, message: 'Projects saved to cloud' };
    } catch (error) {
      throw new Error('Failed to save projects: ' + error.message);
    }
  };

  // Load projects from Supabase
  const loadProjects = async () => {
    try {
      // Try to load from Supabase first
      const { data: supabaseProjects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (supabaseProjects && supabaseProjects.length > 0) {
        // Convert Supabase format to your app format
        const projects = supabaseProjects.map(project => ({
          id: project.id,
          supabase_id: project.id,
          title: project.title,
          description: project.description,
          category: project.category,
          src: project.image_url,
          uploadDate: new Date(project.created_at).toLocaleDateString(),
          fileName: project.title
        }));

        // Update localStorage with Supabase data
        localStorage.setItem('portfolio_permanent_storage', JSON.stringify(projects));
        return projects;
      }

      // Fallback to localStorage if no Supabase data
      const localData = localStorage.getItem('portfolio_permanent_storage');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error('Supabase load error:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem('portfolio_permanent_storage');
      return localData ? JSON.parse(localData) : [];
    }
  };

  // Delete project from Supabase
  const deleteProject = async (projectId) => {
    try {
      // Delete from Supabase if it has supabase_id
      const projects = await loadProjects();
      const projectToDelete = projects.find(p => p.id === projectId);
      
      if (projectToDelete?.supabase_id) {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectToDelete.supabase_id);

        if (error) throw error;

        // Delete from storage if applicable
        if (projectToDelete.storage_path) {
          await supabase.storage
            .from('project-images')
            .remove([projectToDelete.storage_path]);
        }
      }

      // Update local storage
      const updatedProjects = projects.filter(project => project.id !== projectId);
      await saveProjects(updatedProjects);
      
      return { success: true, message: 'Project deleted from cloud' };
    } catch (error) {
      throw new Error('Failed to delete project: ' + error.message);
    }
  };

  return { saveProjects, loadProjects, uploadFile, deleteProject };
};

export default useBackendService;
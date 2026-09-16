// Inside your useBackendService hook (or wherever uploadFile is defined)

const uploadFile = async (file, category) => {
  try {
    // Determine file type
    const isVideoFile = file.type.startsWith('video/') ||
                        /\.(mp4|webm|mov|ogg)$/i.test(file.name);
    const isImageFile = file.type.startsWith('image/') ||
                        /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);

    // Validate
    if (!isVideoFile && !isImageFile) {
      throw new Error('Only image and video files are allowed');
    }

    // Size check (10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File must be smaller than 10MB');
    }

    // Create a unique file name
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${category}/${timestamp}_${cleanName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || (isVideoFile ? 'video/mp4' : 'image/jpeg'),
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('portfolio')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Build project object — IMPORTANT: set the type correctly
    const newProject = {
      id: `${timestamp}_${Math.random().toString(36).slice(2, 9)}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      description: isVideoFile ? 'Video project' : 'Image project',
      category: category,
      src: publicUrl,
      type: isVideoFile ? 'video' : 'image',   // <-- KEY LINE
      mediaType: file.type || (isVideoFile ? 'video/mp4' : 'image/jpeg'),
      uploadDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      }),
      timestamp,
    };

    // Save to your DB / localStorage (same as before)
    const existing = await loadProjects();
    const updated = [newProject, ...existing];
    await saveProjects(updated);

    return newProject;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

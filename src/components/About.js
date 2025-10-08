import React, { useState, useRef, useEffect } from 'react';

// SIMPLE Backend Service - No setup needed!
const useBackendService = () => {
  const saveProjects = async (projects) => {
    try {
      localStorage.setItem('portfolio_permanent_storage', JSON.stringify(projects));
      return { success: true, message: 'Projects saved successfully' };
    } catch (error) {
      throw new Error('Failed to save projects: ' + error.message);
    }
  };
  
  const loadProjects = async () => {
    try {
      const data = localStorage.getItem('portfolio_permanent_storage');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      throw new Error('Failed to load projects: ' + error.message);
    }
  };
  
  const uploadFile = async (file, category) => {
    try {
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
      
      return {
        id: Date.now() + Math.random(),
        src: base64String,
        category,
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: `Uploaded ${new Date().toLocaleDateString()}`,
        uploadDate: new Date().toLocaleDateString(),
        fileName: file.name
      };
    } catch (error) {
      throw new Error('File upload failed: ' + error.message);
    }
  };
  
  const deleteProject = async (projectId) => {
    try {
      const projects = await loadProjects();
      const updatedProjects = projects.filter(project => project.id !== projectId);
      await saveProjects(updatedProjects);
      return { success: true, message: 'Project deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete project: ' + error.message);
    }
  };
  
  return { saveProjects, loadProjects, uploadFile, deleteProject };
};

const About = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [uploadCategory, setUploadCategory] = useState('graphic-design');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const backendService = useBackendService();

  // Load projects on component mount
  useEffect(() => {
    loadProjectsFromStorage();
    
    // Check owner status
    const savedOwnerStatus = localStorage.getItem('isOwner');
    if (savedOwnerStatus === 'true') {
      setIsOwner(true);
    }
  }, []);

  const loadProjectsFromStorage = async () => {
    try {
      setIsLoading(true);
      const projects = await backendService.loadProjects();
      setMyProjects(projects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Owner Login
  const handleOwnerLogin = () => {
    // CHANGE THIS PASSWORD!
    if (password === 'owner123') {
      setIsOwner(true);
      setShowLogin(false);
      setPassword('');
      localStorage.setItem('isOwner', 'true');
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  // Owner Logout
  const handleOwnerLogout = () => {
    setIsOwner(false);
    localStorage.removeItem('isOwner');
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    if (!isOwner) return;
    
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsLoading(true);
    
    try {
      const uploadPromises = files.map(file => 
        backendService.uploadFile(file, uploadCategory)
      );

      const newProjects = await Promise.all(uploadPromises);
      const successfulUploads = newProjects.filter(project => project !== undefined);
      
      if (successfulUploads.length > 0) {
        const allProjects = [...myProjects, ...successfulUploads];
        await backendService.saveProjects(allProjects);
        setMyProjects(allProjects);
        alert(`Successfully uploaded ${successfulUploads.length} project(s)!`);
      }
      
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  // Delete project
  const deleteProject = async (projectId, event) => {
    if (!isOwner) return;
    event.stopPropagation();
    
    if (window.confirm('Delete this project?')) {
      try {
        await backendService.deleteProject(projectId);
        setMyProjects(prev => prev.filter(project => project.id !== projectId));
      } catch (error) {
        alert('Failed to delete: ' + error.message);
      }
    }
  };

  const triggerFileInput = () => {
    if (!isOwner) return;
    fileInputRef.current?.click();
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Categories
const categories = [
  { id: 'all', name: 'All Projects', icon: '📁', count: myProjects.length },
  { id: 'graphic-design', name: 'Graphic Design', icon: '🎨', count: myProjects.filter(p => p.category === 'graphic-design').length },
  { id: 'photography', name: 'Photography', icon: '📸', count: myProjects.filter(p => p.category === 'photography').length },
  { id: 'motion-picture', name: 'Motion Picture', icon: '🎬', count: myProjects.filter(p => p.category === 'motion-picture').length },
  { id: 'music', name: 'Music Artworks', icon: '🎵', count: myProjects.filter(p => p.category === 'music').length },
  { id: 'games', name: 'Gaming Zone', icon: '🎮', count: myProjects.filter(p => p.category === 'games').length }
];

  // Filter projects based on category
  const filteredProjects = selectedCategory === 'all' 
    ? myProjects 
    : myProjects.filter(project => project.category === selectedCategory);

  return (
    <section className="about" id="about">
      <div className="container">
        {/* Owner Access Controls */}
        <div className="owner-access-bar">
          {!isOwner ? (
            <div className="viewer-mode">
              <span className="viewer-badge">👀 Viewing Mode</span>
              <button 
                className="owner-login-btn"
                onClick={() => setShowLogin(true)}
              >
                🔧 Owner Login
              </button>
            </div>
          ) : (
            <div className="owner-mode">
              <div className="owner-status">
                <span className="owner-badge">👑 OWNER MODE</span>
                <span className="owner-info">You can manage projects</span>
              </div>
              <button 
                className="logout-btn"
                onClick={handleOwnerLogout}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>

        {/* Login Modal */}
        {showLogin && (
          <div className="login-modal-overlay" onClick={() => setShowLogin(false)}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
              <div className="login-header">
                <h3>Owner Access</h3>
                <button 
                  className="close-login"
                  onClick={() => setShowLogin(false)}
                >
                  ×
                </button>
              </div>
              <div className="login-body">
                <p>Enter the owner password to manage your portfolio</p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter owner password"
                  onKeyPress={(e) => e.key === 'Enter' && handleOwnerLogin()}
                  className="password-input"
                />
                <div className="login-actions">
                  <button 
                    className="login-confirm"
                    onClick={handleOwnerLogin}
                  >
                    🔑 Login as Owner
                  </button>
                  <button 
                    className="login-cancel"
                    onClick={() => setShowLogin(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About Header */}
        <div className="about-header">
          <div className="header-content">
            <h1 className="main-title">About My Creative Work</h1>
            <p className="subtitle">Welcome to my creative studio where ideas come to life through design, photography, and motion pictures</p>
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Projects Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">3+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Client Satisfaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main About Content */}
        <div className="about-content">
          <div className="about-text">
            <div className="section-tag">About Me</div>
            <h2>My Creative Journey</h2>
            <p className="lead-text">
              I'm a passionate creative professional with expertise in graphic design, photography, 
              and video production. Every project is an opportunity to create something extraordinary 
              and bring visions to life.
            </p>
            
            <div className="skills-section">
              <h3>My Expertise</h3>
              <div className="skills-grid">
                <div className="skill-card">
                  <div className="skill-icon">💡</div>
                  <h4>Creative Vision</h4>
                  <p>Transforming ideas into visually stunning realities</p>
                </div>
                <div className="skill-card">
                  <div className="skill-icon">⚡</div>
                  <h4>Fast Delivery</h4>
                  <p>Quick turnaround without compromising quality</p>
                </div>
                <div className="skill-card">
                  <div className="skill-icon">🎯</div>
                  <h4>Precision</h4>
                  <p>Attention to detail in every pixel and frame</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-visual">
            <div className="visual-card">
              <div className="card-glow"></div>
              <div className="profile-display">
                <div className="profile-image">
                  <div className="image-placeholder">
                    <span>My Creative Space</span>
                    <small>Professional Studio Setup</small>
                  </div>
                </div>
                <div className="profile-badges">
                  <span className="badge">🎨 Designer</span>
                  <span className="badge">📸 Photographer</span>
                  <span className="badge">🎬 Videographer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="services-section">
          <div className="section-tag">Services</div>
          <h2 className="section-title">What I Offer</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🎨</div>
              <h3>Graphic Design</h3>
              <ul className="service-features">
                <li>Logo & Brand Identity</li>
                <li>Business Cards & Flyers</li>
                <li>Social Media Graphics</li>
                <li>Posters & Banners</li>
                <li>Book Covers $ Magazines </li>
                <li>Receipts $ Stickers,</li>
              </ul>
             
            </div>

            <div className="service-card featured">
              <div className="service-icon">📸</div>
              <h3>Photography</h3>
              <ul className="service-features">
                <li>Wedding & Events</li>
                <li>Photo shoot Sessions</li>
                <li>Product Photography</li>
                <li>Commercial Shoots</li>
              </ul>
              
            </div>

            <div className="service-card">
              <div className="service-icon">🎬</div>
              <h3>Motion Picture</h3>
              <ul className="service-features">
                <li>Business Advertisements</li>
                <li>Short Films</li>
                <li>Event Coverage</li>
                <li>Social Media Videos</li>
              </ul>

              
             
            </div>
            <div className="service-card featured">
  <div className="service-icon">🎵</div>
  <h3>Music Artworks</h3>
  <ul className="service-features">
    <li>🎨 Cover Art Design</li>
    <li>💿 Album & Single Branding</li>
    <li>📱 Promotional Banners</li>
    <li>🔥 Visual Concepts for Artists</li>
  </ul>
</div>

            <div className="service-card featured">
  <div className="service-icon">🎮</div>
  <h3>Gaming Zone</h3>
  <ul className="service-features">
    <li>🔥 FIFA Tournaments</li>
    <li>⚔️ Mortal Kombat Battles</li>
    <li>🎧 Multiplayer Challenges</li>
    <li>🔥 Car Racing Challenges</li>
    
  </ul>
</div>

          </div>
        </div>

        {/* My Projects Gallery Section */}
        <div className="projects-section">
          <div className="section-header">
            <div className="section-tag">Portfolio</div>
            <h2>Project Gallery</h2>
            <p>
              {isOwner 
                ? "Manage your project gallery - add new work to specific categories" 
                : "Browse through my completed projects across different creative domains"
              }
            </p>
          </div>

          {/* Upload Section - ONLY SHOWS FOR OWNER */}
          {isOwner && (
            <div className="upload-area">
              <div className="upload-card">
                <div className="upload-header">
                  <div className="upload-icon">📁</div>
                  <div>
                    <h3>Add New Projects</h3>
                    <p>Upload your latest work to showcase your skills</p>
                  </div>
                </div>
                
                <div className="category-selection">
  <label>Select Category for Upload:</label>

  <div className="category-options">
    {/* Graphic Design */}
    <button
      className={`category-option ${uploadCategory === 'graphic-design' ? 'active' : ''}`}
      onClick={() => setUploadCategory('graphic-design')}
    >
      <span>🎨</span>
      Graphic Design
    </button>

    {/* Photography */}
    <button
      className={`category-option ${uploadCategory === 'photography' ? 'active' : ''}`}
      onClick={() => setUploadCategory('photography')}
    >
      <span>📸</span>
      Photography
    </button>

    {/* Music Artworks */}
    <button
      className={`category-option ${uploadCategory === 'music' ? 'active' : ''}`}
      onClick={() => setUploadCategory('music')}
    >
      <span>🎵</span>
      Music Artworks
    </button>

    {/* Gaming Zone */}
    <button
      className={`category-option ${uploadCategory === 'games' ? 'active' : ''}`}
      onClick={() => setUploadCategory('games')}
    >
      <span>🎮</span>
      Gaming Zone
    </button>

    {/* Motion Picture */}
    <button
      className={`category-option ${uploadCategory === 'motion-picture' ? 'active' : ''}`}
      onClick={() => setUploadCategory('motion-picture')}
    >
      <span>🎬</span>
      Motion Picture
    </button>
  </div>

  {/* Selected Category Display */}
  <div className="selected-category-info">
    <strong>Currently selected:</strong>
    <span className="category-tag">
      {uploadCategory === 'graphic-design' && '🎨 Graphic Design'}
      {uploadCategory === 'photography' && '📸 Photography'}
      {uploadCategory === 'music' && '🎵 Music Artworks'}
      {uploadCategory === 'games' && '🎮 Gaming Zone'}
      {uploadCategory === 'motion-picture' && '🎬 Motion Picture'}
    </span>
  </div>
</div>

{/* Upload Actions */}
<div className="upload-actions">
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileUpload}
    multiple
    accept="image/*,video/*"
    style={{ display: 'none' }}
  />
  
  <button className="upload-btn" onClick={triggerFileInput}>
    📤 Upload to {
      uploadCategory === 'graphic-design' ? 'Graphic Design' :
      uploadCategory === 'photography' ? 'Photography' :
      uploadCategory === 'music' ? 'Music Artworks' :
      uploadCategory === 'games' ? 'Gaming Zone' :
      uploadCategory === 'motion-picture' ? 'Motion Picture' :
      'Select a Category'
    }
  </button>

  <small>Supported: Images (JPG, PNG, GIF) • Videos (MP4, MOV)</small>
</div>

                {myProjects.length > 0 && (
                  <div className="management-info">
                    <p>💡 <strong>Tip:</strong> Select the category above before uploading</p>
                    <p>🗑️ Click the × button on any project to remove it</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Project Stats */}
          {myProjects.length > 0 && (
            <div className="project-stats">
              <div className="stat-card">
                <span className="number">{myProjects.length}</span>
                <span className="label">Total Projects</span>
              </div>
              {categories.filter(cat => cat.id !== 'all').map(category => (
                <div key={category.id} className="stat-card">
                  <span className="number">{category.count}</span>
                  <span className="label">{category.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Category Filter */}
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
                disabled={category.count === 0 && category.id !== 'all'}
              >
                <span className="filter-icon">{category.icon}</span>
                {category.name}
                <span className="count">({category.count})</span>
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="projects-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <div 
                  key={project.id} 
                  className="project-card"
                  onClick={() => setSelectedImage(project)}
                >
                  <div className="project-image">
                    <img src={project.src} alt={project.title} />
                    
                    {/* Category Badge */}
                    <div className="category-badge">
  {project.category === 'graphic-design' && '🎨 Design'}
  {project.category === 'photography' && '📸 Photo'}
  {project.category === 'music' && '🎵 Music'}
  {project.category === 'games' && '🎮 Game'}
  {project.category === 'motion-picture' && '🎬 Video'}
</div>

                    
                    {/* Delete Button - ONLY SHOWS FOR OWNER */}
                    {isOwner && (
                      <button 
                        className="delete-btn"
                        onClick={(e) => deleteProject(project.id, e)}
                        title="Delete this project"
                      >
                        ×
                      </button>
                    )}
                    
                    <div className="project-overlay">
                      <div className="project-info">
                        <h4>{project.title}</h4>
                        <p>{project.description}</p>
                        <div className="project-meta">
                          <span className="upload-date">{project.uploadDate}</span>
                          {isOwner && (
                            <span className="owner-badge">Your Project</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  {selectedCategory === 'all' ? '📁' : 
                   categories.find(cat => cat.id === selectedCategory)?.icon}
                </div>
                <h3>
                  {selectedCategory === 'all' 
                    ? "No projects in portfolio" 
                    : `No ${categories.find(cat => cat.id === selectedCategory)?.name} projects`
                  }
                </h3>
                <p>
                  {isOwner 
                    ? `Upload some ${selectedCategory === 'all' ? '' : categories.find(cat => cat.id === selectedCategory)?.name} projects to get started` 
                    : "Check back later for new projects"
                  }
                </p>
                {isOwner && selectedCategory !== 'all' && (
                  <button 
                    className="upload-btn"
                    onClick={() => {
                      setUploadCategory(selectedCategory);
                      triggerFileInput();
                    }}
                  >
                    Upload to {categories.find(cat => cat.id === selectedCategory)?.name}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>
              {isOwner ? "Ready to Grow Your Portfolio?" : "Ready to Start Your Project?"}
            </h2>
            <p>
              {isOwner 
                ? "Keep adding amazing projects to showcase your skills and attract more clients" 
                : "Let's work together to bring your creative vision to life with professional design and media services"
              }
            </p>
            <div className="cta-buttons">
              <button 
                className="cta-btn primary" 
                onClick={() => scrollToSection('contact')}
              >
                {isOwner ? "Add More Projects" : "Start Your Project"}
              </button>
              <button 
                className="cta-btn secondary"
                onClick={() => scrollToSection('services')}
              >
                View Services
              </button>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="modal" onClick={() => setSelectedImage(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button 
                className="close-btn"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
              <img src={selectedImage.src} alt={selectedImage.title} />
              <div className="modal-info">
                <h3>{selectedImage.title}</h3>
                <p>{selectedImage.description}</p>
                <div className="modal-meta">
                  <span className="category-tag-large">
                    {selectedImage.category === 'graphic-design' && '🎨 Graphic Design'}
                    {selectedImage.category === 'photography' && '📸 Photography'}
                    {selectedImage.category === 'motion-picture' && '🎬 Motion Picture'}
                    {selectedImage.category === 'music' && '🎵 Music Artworks'}
                    {selectedImage.category === 'games' && '🎮 Gaming Zone'}
                  </span>
                  <span className="upload-date">Uploaded: {selectedImage.uploadDate}</span>
                </div>
                {isOwner && (
                  <button 
                    className="delete-btn-modal"
                    onClick={() => {
                      deleteProject(selectedImage.id, { stopPropagation: () => {} });
                      setSelectedImage(null);
                    }}
                  >
                    🗑️ Delete This Project
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .about {
          padding: 40px 0 80px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Owner Access Bar */
        .owner-access-bar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 25px;
          border-radius: 15px;
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .viewer-mode, .owner-mode {
          display: flex;
          align-items: center;
          gap: 20px;
          width: 100%;
          justify-content: space-between;
        }

        .viewer-badge {
          background: rgba(255, 255, 255, 0.15);
          padding: 8px 16px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          backdrop-filter: blur(10px);
        }

        .owner-status {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .owner-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 0.85rem;
          backdrop-filter: blur(10px);
        }

        .owner-info {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .owner-login-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .owner-login-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
        }

        .logout-btn {
          background: rgba(239, 68, 68, 0.8);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .logout-btn:hover {
          background: rgba(220, 38, 38, 0.9);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        /* Login Modal */
        .login-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(5px);
        }

        .login-modal {
          background: white;
          border-radius: 20px;
          max-width: 450px;
          width: 100%;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .login-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .login-header h3 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 700;
        }

        .close-login {
          background: none;
          border: none;
          color: white;
          font-size: 1.8rem;
          cursor: pointer;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }

        .close-login:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .login-body {
          padding: 35px;
        }

        .login-body p {
          color: #64748b;
          margin-bottom: 25px;
          text-align: center;
          font-size: 1.1rem;
          line-height: 1.5;
        }

        .password-input {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          margin-bottom: 25px;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .password-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .login-actions {
          display: flex;
          gap: 12px;
        }

        .login-confirm {
          flex: 2;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .login-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .login-cancel {
          flex: 1;
          background: #64748b;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .login-cancel:hover {
          background: #475569;
          transform: translateY(-2px);
        }

        /* About Header */
        .about-header {
          text-align: center;
          margin-bottom: 80px;
          padding: 60px 0 40px;
        }

        .header-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .main-title {
          font-size: 3.5rem;
          color: #1e293b;
          margin-bottom: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 1.3rem;
          color: #64748b;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .header-stats {
          display: flex;
          justify-content: center;
          gap: 50px;
          margin-top: 40px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 800;
          color: #667eea;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 1rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Section Tag */
        .section-tag {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* About Content */
        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          margin-bottom: 100px;
        }

        .about-text h2 {
          font-size: 2.5rem;
          color: #1e293b;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .lead-text {
          font-size: 1.2rem;
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 40px;
        }

        .skills-section {
          margin-top: 40px;
        }

        .skills-section h3 {
          font-size: 1.5rem;
          color: #1e293b;
          margin-bottom: 25px;
          font-weight: 600;
        }

        .skills-grid {
          display: grid;
          gap: 20px;
        }

        .skill-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .skill-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .skill-icon {
          font-size: 2rem;
          margin-bottom: 15px;
        }

        .skill-card h4 {
          font-size: 1.2rem;
          color: #1e293b;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .skill-card p {
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        /* About Visual */
        .about-visual {
          position: relative;
        }

        .visual-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
        }

        .card-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
          animation: rotate 10s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .profile-display {
          position: relative;
          z-index: 2;
        }

        .profile-image {
          width: 100%;
          height: 300px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 25px;
        }

        .profile-image span {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .profile-image small {
          font-size: 1rem;
          opacity: 0.9;
        }

        .profile-badges {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        /* Services Section */
        .services-section {
          margin-bottom: 100px;
        }

        .section-title {
          font-size: 2.5rem;
          color: #1e293b;
          text-align: center;
          margin-bottom: 50px;
          font-weight: 700;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .service-card {
          background: white;
          padding: 40px 30px;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          text-align: center;
          position: relative;
        }

        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .service-card.featured {
          border: 2px solid #667eea;
          transform: scale(1.05);
        }

        .service-card.featured:hover {
          transform: scale(1.05) translateY(-10px);
        }

        .service-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .service-card h3 {
          font-size: 1.5rem;
          color: #1e293b;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .service-features {
          list-style: none;
          padding: 0;
          margin: 0 0 25px 0;
          text-align: left;
        }

        .service-features li {
          padding: 8px 0;
          color: #64748b;
          position: relative;
          padding-left: 20px;
        }

        .service-features li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }

        .service-footer {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .price {
          font-size: 1.3rem;
          font-weight: 700;
          color: #667eea;
        }

        /* Projects Section */
        .projects-section {
          margin-bottom: 80px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .section-header h2 {
          font-size: 2.5rem;
          color: #1e293b;
          margin-bottom: 15px;
          font-weight: 700;
        }

        .section-header p {
          font-size: 1.1rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Upload Area */
        .upload-area {
          margin-bottom: 40px;
        }

        .upload-card {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          border: 2px dashed #cbd5e1;
          transition: all 0.3s ease;
        }

        .upload-card:hover {
          border-color: #667eea;
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
        }

        .upload-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }

        .upload-icon {
          font-size: 2.5rem;
        }

        .upload-header h3 {
          font-size: 1.5rem;
          color: #1e293b;
          margin: 0;
          font-weight: 700;
        }

        .upload-header p {
          color: #64748b;
          margin: 5px 0 0 0;
        }

        .category-selection {
          margin-bottom: 25px;
        }

        .category-selection label {
          display: block;
          color: #374151;
          font-weight: 600;
          margin-bottom: 15px;
          font-size: 1.1rem;
        }

        .category-options {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .category-option {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          padding: 12px 20px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #64748b;
        }

        .category-option:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .category-option.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }

        .selected-category-info {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
        }

        .category-tag {
          background: #667eea;
          color: white;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .upload-actions {
          text-align: center;
        }

        .upload-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          margin-bottom: 10px;
        }

        .upload-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .upload-actions small {
          color: #64748b;
          display: block;
        }

        .management-info {
          background: #f0f9ff;
          padding: 15px;
          border-radius: 10px;
          margin-top: 20px;
          border-left: 4px solid #667eea;
        }

        .management-info p {
          margin: 5px 0;
          color: #0369a1;
          font-size: 0.9rem;
        }

        /* Project Stats */
        .project-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .stat-card .number {
          display: block;
          font-size: 2.2rem;
          font-weight: 800;
          color: #667eea;
          margin-bottom: 8px;
        }

        .stat-card .label {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Category Filter */
        .category-filter {
          display: flex;
          gap: 10px;
          margin-bottom: 40px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .filter-btn {
          background: white;
          border: 2px solid #e2e8f0;
          padding: 12px 20px;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #64748b;
        }

        .filter-btn:hover:not(:disabled) {
          border-color: #667eea;
          color: #667eea;
          transform: translateY(-2px);
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }

        .filter-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .filter-icon {
          font-size: 1.1rem;
        }

        .count {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
        }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 50px;
        }

        .project-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .project-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .project-image {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
        }

        .project-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .project-card:hover .project-image img {
          transform: scale(1.1);
        }

        .category-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(255, 255, 255, 0.9);
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .delete-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          opacity: 0;
        }

        .project-card:hover .delete-btn {
          opacity: 1;
        }

        .delete-btn:hover {
          background: rgba(220, 38, 38, 1);
          transform: scale(1.1);
        }

        .project-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          color: white;
          padding: 20px;
          transform: translateY(100%);
          transition: all 0.3s ease;
        }

        .project-card:hover .project-overlay {
          transform: translateY(0);
        }

        .project-info h4 {
          margin: 0 0 8px 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .project-info p {
          margin: 0 0 10px 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .project-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }

        .upload-date {
          opacity: 0.8;
        }

        .owner-badge {
          background: rgba(102, 126, 234, 0.8);
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 0.7rem;
        }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 20px;
          border: 2px dashed #e2e8f0;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #1e293b;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .empty-state p {
          color: #64748b;
          margin-bottom: 25px;
          font-size: 1.1rem;
        }

        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 80px 40px;
          border-radius: 25px;
          text-align: center;
          margin-top: 60px;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .cta-content p {
          font-size: 1.2rem;
          margin-bottom: 35px;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .cta-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-btn {
          padding: 15px 30px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .cta-btn.primary {
          background: white;
          color: #667eea;
        }

        .cta-btn.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
        }

        .cta-btn.secondary {
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .cta-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px);
        }

        /* Modal */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(5px);
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          position: relative;
          animation: modalSlideIn 0.3s ease-out;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.1);
        }

        .modal-content img {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }

        .modal-info {
          padding: 30px;
        }

        .modal-info h3 {
          font-size: 1.5rem;
          color: #1e293b;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .modal-info p {
          color: #64748b;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .modal-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .category-tag-large {
          background: #667eea;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
        }

        .upload-date {
          color: #64748b;
          font-size: 0.9rem;
        }

        .delete-btn-modal {
          background: #ef4444;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .delete-btn-modal:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .about-content {
            gap: 50px;
          }
          
          .main-title {
            font-size: 3rem;
          }
        }

        @media (max-width: 768px) {
          .about {
            padding: 20px 0 60px;
          }

          .owner-access-bar {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .viewer-mode, .owner-mode {
            flex-direction: column;
            gap: 15px;
          }

          .login-actions {
            flex-direction: column;
          }

          .about-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .main-title {
            font-size: 2.5rem;
          }

          .header-stats {
            flex-direction: column;
            gap: 30px;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .service-card.featured {
            transform: none;
          }

          .service-card.featured:hover {
            transform: translateY(-10px);
          }

          .category-options {
            flex-direction: column;
          }

          .category-option {
            justify-content: center;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-btn {
            width: 100%;
            max-width: 300px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 15px;
          }

          .main-title {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1.1rem;
          }

          .about-text h2 {
            font-size: 2rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .project-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .category-filter {
            flex-direction: column;
            align-items: center;
          }

          .filter-btn {
            width: 100%;
            max-width: 250px;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
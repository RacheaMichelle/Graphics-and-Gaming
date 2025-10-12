import React, { useState, useRef, useEffect } from 'react';
import useBackendService from '../services/useBackendService';

const About = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [uploadCategory, setUploadCategory] = useState('graphic-design');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const fileInputRef = useRef(null);

  const backendService = useBackendService();

  // Load projects on component mount with update check
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        // Check for updates first
        await backendService.checkForUpdates();
        
        // Load projects
        await loadProjectsFromStorage();
        
        // Check owner status
        const savedOwnerStatus = localStorage.getItem('isOwner');
        if (savedOwnerStatus === 'true') {
          setIsOwner(true);
        }

        // Load debug info
        updateDebugInfo();
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Set up periodic update check (every 5 minutes)
    const updateInterval = setInterval(() => {
      backendService.checkForUpdates();
    }, 5 * 60 * 1000);

    return () => clearInterval(updateInterval);
  }, []);

  const loadProjectsFromStorage = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading projects...', forceRefresh ? '(force refresh)' : '');
      const projects = await backendService.loadProjects(forceRefresh);
      setMyProjects(projects);
      updateDebugInfo();
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update debug information
  const updateDebugInfo = () => {
    const info = backendService.getDebugInfo();
    setDebugInfo(info);
  };

  // Force refresh from Supabase
  const forceRefreshProjects = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Force refreshing projects from Supabase...');
      
      // Clear cache first
      await backendService.clearAllCache();
      
      // Then load fresh data
      await loadProjectsFromStorage(true);
      alert('Projects refreshed from Supabase!');
      
    } catch (error) {
      console.error('❌ Force refresh failed:', error);
      alert('Refresh failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all cache and reload
  const clearCacheAndReload = async () => {
    if (window.confirm('This will clear all cached data and reload the page. Continue?')) {
      try {
        await backendService.clearAllCache();
        window.location.reload();
      } catch (error) {
        console.error('Error clearing cache:', error);
        alert('Error clearing cache: ' + error.message);
      }
    }
  };

  // Owner Login
  const handleOwnerLogin = () => {
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
        // Reload projects to get the fresh state from Supabase
        await loadProjectsFromStorage(true);
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
    
    if (window.confirm('Are you sure you want to delete this project? This will remove it from both the database and storage.')) {
      try {
        setIsLoading(true);
        
        // Call the backend service to delete
        await backendService.deleteProject(projectId);
        
        // Update state immediately for better UX
        setMyProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
        
        // Also force refresh from Supabase to ensure consistency
        await loadProjectsFromStorage(true);
        
        // Close modal if the deleted image was open
        if (selectedImage && selectedImage.id === projectId) {
          setSelectedImage(null);
        }
        
        console.log('✅ Project deleted successfully from UI');
        
      } catch (error) {
        console.error('❌ Delete failed:', error);
        alert('Failed to delete: ' + error.message);
        
        // Even if there's an error, try to refresh the data
        await loadProjectsFromStorage(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Improved image error handling
  const handleImageError = (e, project) => {
    console.error('🖼 Image failed to load:', project.src);
    
    // Hide the broken image
    e.target.style.display = 'none';
    
    // Try to find and show fallback
    const fallback = e.target.nextElementSibling;
    if (fallback && fallback.classList.contains('image-fallback')) {
      fallback.style.display = 'flex';
    }
  };

  // Improved image load handling
  const handleImageLoad = (e) => {
    console.log('✅ Image loaded successfully');
    e.target.style.opacity = '1';
  };

  // Retry image loading
  const retryImageLoad = (imgElement, src) => {
    console.log('🔄 Retrying image load...');
    imgElement.src = src + '?retry=' + Date.now();
    imgElement.style.display = 'block';
    imgElement.style.opacity = '0';
    
    const fallback = imgElement.nextElementSibling;
    if (fallback && fallback.classList.contains('image-fallback')) {
      fallback.style.display = 'none';
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
    <div className="about-container">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
        <div className="animated-grid"></div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Modern Navigation Bar */}
        <nav className="modern-nav">
          <div className="nav-container">
            <div className="nav-brand">
              <div className="logo-wrapper">
                <span className="logo-icon">🎨</span>
                <span className="brand-text">
                  <span className="brand-main">Creative</span>
                  <span className="brand-sub">Portfolio</span>
                </span>
              </div>
            </div>

            <div className="nav-center">
              <div className="nav-links">
                <button 
                  className="nav-link"
                  onClick={() => scrollToSection('about')}
                >
                  <span className="nav-icon">👤</span>
                  <span className="nav-text">About</span>
                </button>
                <button 
                  className="nav-link"
                  onClick={() => scrollToSection('services')}
                >
                  <span className="nav-icon">🛠️</span>
                  <span className="nav-text">Services</span>
                </button>
                <button 
                  className="nav-link"
                  onClick={() => scrollToSection('portfolio')}
                >
                  <span className="nav-icon">📂</span>
                  <span className="nav-text">Portfolio</span>
                </button>
                <button 
                  className="nav-link"
                  onClick={() => scrollToSection('contact')}
                >
                  <span className="nav-icon">📞</span>
                  <span className="nav-text">Contact</span>
                </button>
              </div>
            </div>

            <div className="nav-actions">
              {!isOwner ? (
                <div className="auth-section">
                  <button 
                    className="login-btn modern"
                    onClick={() => setShowLogin(true)}
                  >
                    <span className="btn-icon">🔐</span>
                    <span className="btn-text">Owner Login</span>
                    <div className="btn-glow"></div>
                  </button>
                </div>
              ) : (
                <div className="owner-section">
                  <div className="owner-indicator">
                    <span className="owner-icon">👑</span>
                    <span className="owner-text">Owner Mode</span>
                  </div>
                  <button 
                    className="logout-btn modern"
                    onClick={handleOwnerLogout}
                    title="Logout"
                  >
                    <span className="btn-icon">🚪</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Owner Controls */}
        {isOwner && (
          <div className="owner-controls">
            <div className="owner-info">
              <span className="owner-status">👑 OWNER MODE - Full management access</span>
            </div>
            <div className="owner-actions">
              <button 
                className="action-btn refresh"
                onClick={forceRefreshProjects}
                disabled={isLoading}
              >
                {isLoading ? '⏳' : '🔄'} Refresh
              </button>
              <button 
                className="action-btn clear"
                onClick={clearCacheAndReload}
              >
                🧹 Clear Cache
              </button>
            </div>
          </div>
        )}

        {/* Debug Panel */}
        {isOwner && debugInfo && (
          <div className="debug-panel">
            <details>
              <summary>
                🔧 Debug Info • Cache: v{debugInfo?.cacheVersion} • Age: {debugInfo?.cacheAge}
              </summary>
              <div className="debug-content">
                <div className="debug-stats">
                  <div className="debug-stat">
                    <label>Last Updated:</label>
                    <span>{debugInfo?.cacheTimestamp}</span>
                  </div>
                  <div className="debug-stat">
                    <label>Local Projects:</label>
                    <span>{debugInfo?.localStorageCount}</span>
                  </div>
                </div>
                <div className="debug-actions">
                  <button onClick={updateDebugInfo} className="debug-btn">
                    Update Info
                  </button>
                  <button onClick={() => loadProjectsFromStorage(true)} className="debug-btn">
                    🔄 Force Reload
                  </button>
                </div>
              </div>
            </details>
          </div>
        )}

        {/* Modern Login Modal */}
        {showLogin && (
          <div className="modern-login-overlay" onClick={() => setShowLogin(false)}>
            <div className="modern-login-modal" onClick={(e) => e.stopPropagation()}>
              <div className="login-header">
                <div className="login-icon">🔐</div>
                <h3>Owner Access</h3>
                <p>Enter your credentials to manage the portfolio</p>
                <button 
                  className="close-login"
                  onClick={() => setShowLogin(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="login-body">
                <div className="input-group">
                  <label htmlFor="password">Owner Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter owner password"
                    onKeyPress={(e) => e.key === 'Enter' && handleOwnerLogin()}
                    className="password-input"
                  />
                </div>
                
                <div className="login-actions">
                  <button 
                    className="login-confirm modern"
                    onClick={handleOwnerLogin}
                  >
                    <span className="btn-icon">🔑</span>
                    <span className="btn-text">Login as Owner</span>
                  </button>
                  <button 
                    className="login-cancel modern"
                    onClick={() => setShowLogin(false)}
                  >
                    <span className="btn-text">Cancel</span>
                  </button>
                </div>
                
                <div className="login-footer">
                  <p>🔒 Secure owner access only</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rest of your content remains exactly the same */}
        {/* About Section */}
        <section id="about" className="section">
          <div className="hero-section">
            <div className="hero-content">
              <div className="hero-badge">Creative Professional</div>
              <h1 className="hero-title">
                Transforming Ideas Into
                <span className="gradient-text"> Visual Masterpieces</span>
              </h1>
              <p className="hero-description">
                Welcome to my creative studio where ideas come to life through design, 
                photography, and motion pictures. With over 3 years of experience and 
                50+ successful projects, I bring visions to reality.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Projects</div>
                </div>
                <div className="stat">
                  <div className="stat-number">3+</div>
                  <div className="stat-label">Years</div>
                </div>
                <div className="stat">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Satisfaction</div>
                </div>
              </div>
              <div className="hero-actions">
                <button 
                  className="btn primary"
                  onClick={() => scrollToSection('portfolio')}
                >
                  View My Work
                </button>
                <button 
                  className="btn secondary"
                  onClick={() => scrollToSection('services')}
                >
                  Explore Services
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="floating-card">
                <div className="card-content">
                  <div className="avatar">🎨</div>
                  <h3>Creative Director</h3>
                  <p>Design • Photography • Motion</p>
                  <div className="skills-tags">
                    <span>UI/UX Design</span>
                    <span>Branding</span>
                    <span>Video Production</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="section">
          <div className="section-header">
            <div className="section-badge">Services</div>
            <h2>What I Offer</h2>
            <p>Comprehensive creative services to bring your vision to life</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🎨</div>
              <h3>Graphic Design</h3>
              <p>Visual identity and branding solutions</p>
              <ul>
                <li>Logo & Brand Identity</li>
                <li>Business Cards & Flyers</li>
                <li>Social Media Graphics</li>
                <li>Posters & Banners</li>
              </ul>
            </div>

            <div className="service-card featured">
              <div className="service-icon">📸</div>
              <h3>Photography</h3>
              <p>Professional photography sessions</p>
              <ul>
                <li>Wedding & Events</li>
                <li>Product Photography</li>
                <li>Commercial Shoots</li>
                <li>Photo Editing</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon">🎬</div>
              <h3>Motion Picture</h3>
              <p>Video production and editing</p>
              <ul>
                <li>Business Advertisements</li>
                <li>Short Films</li>
                <li>Event Coverage</li>
                <li>Social Media Videos</li>
              </ul>
            </div>

            <div className="service-card featured">
              <div className="service-icon">🎮</div>
              <h3>Gaming Zone</h3>
              <p>Interactive gaming experiences</p>
              <ul>
                <li>FIFA Tournaments</li>
                <li>Mortal Kombat Battles</li>
                <li>Multiplayer Challenges</li>
                <li>Car Racing Challenges</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon">🎵</div>
              <h3>Music Artworks</h3>
              <p>Creative designs for artists</p>
              <ul>
                <li>Album Cover Design</li>
                <li>Promotional Materials</li>
                <li>Artist Branding</li>
                <li>Visual Concepts</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="section">
          <div className="section-header">
            <div className="section-badge">Portfolio</div>
            <h2>Project Gallery</h2>
            <p>
              {isOwner 
                ? "Manage your project gallery and showcase your best work" 
                : "Browse through my completed projects across different creative domains"
              }
            </p>
          </div>

          {/* Upload Section for Owner */}
          {isOwner && (
            <div className="upload-section">
              <div className="upload-card">
                <div className="upload-header">
                  <h3>📁 Add New Projects</h3>
                  <p>Upload your latest work to showcase your skills</p>
                </div>
                
                <div className="upload-controls">
                  <div className="category-selector">
                    <label>Select Category:</label>
                    <div className="category-tabs">
                      {categories.filter(cat => cat.id !== 'all').map(category => (
                        <button
                          key={category.id}
                          className={`tab ${uploadCategory === category.id ? 'active' : ''}`}
                          onClick={() => setUploadCategory(category.id)}
                        >
                          <span>{category.icon}</span>
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="upload-actions">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*,video/*"
                      style={{ display: 'none' }}
                    />
                    <button 
                      className="btn primary upload-btn"
                      onClick={triggerFileInput}
                      disabled={isLoading}
                    >
                      {isLoading ? '⏳ Uploading...' : '📤 Upload Files'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Stats */}
          {myProjects.length > 0 && (
            <div className="portfolio-stats">
              {categories.map(category => (
                <div key={category.id} className="stat-card">
                  <div className="stat-icon">{category.icon}</div>
                  <div className="stat-content">
                    <div className="stat-number">{category.count}</div>
                    <div className="stat-label">{category.name}</div>
                  </div>
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
                <span className="count-badge">{category.count}</span>
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
                    <img 
                      src={project.src} 
                      alt={project.title}
                      loading="lazy"
                      onLoad={handleImageLoad}
                      onError={(e) => handleImageError(e, project)}
                    />
                    
                    {/* Image Fallback */}
                    <div className="image-fallback">
                      <span>📷</span>
                      <p>Image not available</p>
                      <button 
                        className="retry-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          const img = e.target.closest('.project-image').querySelector('img');
                          retryImageLoad(img, project.src);
                        }}
                      >
                        🔄 Retry
                      </button>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="category-badge">
                      {project.category === 'graphic-design' && '🎨 Design'}
                      {project.category === 'photography' && '📸 Photo'}
                      {project.category === 'music' && '🎵 Music'}
                      {project.category === 'games' && '🎮 Game'}
                      {project.category === 'motion-picture' && '🎬 Video'}
                    </div>
                    
                    {/* Delete Button for Owner */}
                    {isOwner && (
                      <button 
                        className="delete-btn"
                        onClick={(e) => deleteProject(project.id, e)}
                        title="Delete this project"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  <div className="project-info">
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                    <div className="project-meta">
                      <span className="date">{project.uploadDate}</span>
                      {isOwner && <span className="owner-tag">Your Project</span>}
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
                <h3>No projects found</h3>
                <p>
                  {isOwner 
                    ? `Start by uploading some ${selectedCategory === 'all' ? '' : categories.find(cat => cat.id === selectedCategory)?.name} projects` 
                    : "Check back later for new projects"
                  }
                </p>
                {isOwner && selectedCategory !== 'all' && (
                  <button 
                    className="btn primary"
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
        </section>

        {/* Contact Section */}
        <section id="contact" className="section">
          <div className="cta-section">
            <div className="cta-content">
              <h2>
                {isOwner 
                  ? "Ready to Grow Your Portfolio?" 
                  : "Ready to Start Your Project?"
                }
              </h2>
              <p>
                {isOwner 
                  ? "Keep adding amazing projects to showcase your skills and attract more clients" 
                  : "Let's work together to bring your creative vision to life"
                }
              </p>
              <div className="cta-actions">
                <button className="btn primary large">
                  {isOwner ? "Add More Projects" : "Get Started Today"}
                </button>
                <button className="btn secondary">
                  View All Services
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <div className="modal-image">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title}
                onLoad={(e) => e.target.style.opacity = '1'}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.nextElementSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="modal-fallback">
                <span>📷</span>
                <p>Image not available</p>
              </div>
            </div>
            <div className="modal-content">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.description}</p>
              <div className="modal-meta">
                <span className="category">
                  {selectedImage.category === 'graphic-design' && '🎨 Graphic Design'}
                  {selectedImage.category === 'photography' && '📸 Photography'}
                  {selectedImage.category === 'motion-picture' && '🎬 Motion Picture'}
                  {selectedImage.category === 'music' && '🎵 Music Artworks'}
                  {selectedImage.category === 'games' && '🎮 Gaming Zone'}
                </span>
                <span className="date">{selectedImage.uploadDate}</span>
              </div>
              {isOwner && (
                <button 
                  className="btn danger"
                  onClick={() => {
                    deleteProject(selectedImage.id, { stopPropagation: () => {} });
                    setSelectedImage(null);
                  }}
                >
                  🗑 Delete Project
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .about-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        /* Modern Navigation Styles */
        .modern-nav {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .nav-brand {
          flex: 1;
        }

        .logo-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .brand-main {
          font-size: 1.2rem;
          font-weight: 800;
          color: #1e293b;
        }

        .brand-sub {
          font-size: 0.8rem;
          font-weight: 600;
          color: #667eea;
          opacity: 0.8;
        }

        .nav-center {
          flex: 2;
          display: flex;
          justify-content: center;
        }

        .nav-links {
          display: flex;
          gap: 8px;
          background: rgba(255, 255, 255, 0.8);
          padding: 8px;
          border-radius: 16px;
          border: 1px solid rgba(102, 126, 234, 0.1);
          backdrop-filter: blur(10px);
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: transparent;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #64748b;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .nav-link:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          transform: translateY(-1px);
        }

        .nav-icon {
          font-size: 1.1rem;
        }

        .nav-text {
          white-space: nowrap;
        }

        .nav-actions {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }

        .auth-section, .owner-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .login-btn.modern {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .login-btn.modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .btn-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s ease;
        }

        .login-btn.modern:hover .btn-glow {
          left: 100%;
        }

        .btn-icon {
          font-size: 1.1rem;
        }

        .btn-text {
          white-space: nowrap;
        }

        .owner-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .owner-icon {
          font-size: 1.1rem;
        }

        .logout-btn.modern {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn.modern:hover {
          background: #ef4444;
          color: white;
          transform: scale(1.05);
        }

        /* Modern Login Modal */
        .modern-login-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .modern-login-modal {
          background: white;
          border-radius: 24px;
          max-width: 440px;
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
          padding: 40px 40px 20px;
          text-align: center;
          position: relative;
        }

        .login-icon {
          font-size: 3rem;
          margin-bottom: 16px;
          opacity: 0.9;
        }

        .login-header h3 {
          margin: 0 0 8px 0;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .login-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.95rem;
        }

        .close-login {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .close-login:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .login-body {
          padding: 40px;
        }

        .input-group {
          margin-bottom: 24px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          color: #374151;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .password-input {
          width: 100%;
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
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
          margin-bottom: 20px;
        }

        .login-confirm.modern {
          flex: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .login-confirm.modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .login-cancel.modern {
          flex: 1;
          background: #64748b;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .login-cancel.modern:hover {
          background: #475569;
          transform: translateY(-2px);
        }

        .login-footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .login-footer p {
          margin: 0;
          color: #64748b;
          font-size: 0.85rem;
        }

        /* Rest of your existing styles remain exactly the same */
        .background-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          bottom: 20%;
          left: 15%;
          animation-delay: 4s;
        }

        .shape-4 {
          width: 120px;
          height: 120px;
          top: 30%;
          right: 20%;
          animation-delay: 1s;
        }

        .shape-5 {
          width: 80px;
          height: 80px;
          bottom: 10%;
          right: 15%;
          animation-delay: 3s;
        }

        .animated-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            linear-gradient(90deg, transparent 79px, rgba(255,255,255,0.03) 81px, rgba(255,255,255,0.03) 81px, transparent 83px),
            linear-gradient(rgba(255,255,255,0.03) 79px, transparent 81px, transparent 81px, rgba(255,255,255,0.03) 83px);
          background-size: 85px 85px;
          animation: gridMove 20s linear infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(85px, 85px);
          }
        }

        .main-content {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          min-height: 100vh;
          margin: 0;
        }

        /* Owner Controls */
        .owner-controls {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .owner-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .owner-status {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .owner-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          padding: 8px 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .action-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Debug Panel */
        .debug-panel {
          background: #1e293b;
          color: white;
          padding: 15px 60px;
          font-size: 0.85rem;
        }

        .debug-panel summary {
          cursor: pointer;
          font-weight: 600;
        }

        .debug-content {
          margin-top: 15px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }

        .debug-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 15px;
        }

        .debug-stat {
          display: flex;
          justify-content: space-between;
        }

        .debug-actions {
          display: flex;
          gap: 10px;
        }

        .debug-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        /* Sections */
        .section {
          padding: 80px 60px;
        }

        /* Hero Section */
        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 20px;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.2rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        .hero-stats {
          display: flex;
          gap: 40px;
          margin-bottom: 30px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #667eea;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 600;
        }

        .hero-actions {
          display: flex;
          gap: 15px;
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .floating-card {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          text-align: center;
          max-width: 300px;
          animation: float 6s ease-in-out infinite;
        }

        .avatar {
          font-size: 4rem;
          margin-bottom: 15px;
        }

        .floating-card h3 {
          font-size: 1.3rem;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .floating-card p {
          color: #64748b;
          margin-bottom: 20px;
        }

        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .skills-tags span {
          background: #f1f5f9;
          color: #475569;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        /* Buttons */
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .btn.secondary {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .btn.secondary:hover {
          border-color: #667eea;
          color: #667eea;
          transform: translateY(-2px);
        }

        .btn.large {
          padding: 15px 30px;
          font-size: 1.1rem;
        }

        .btn.danger {
          background: #ef4444;
          color: white;
        }

        .btn.danger:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        /* Section Headers */
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 20px;
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

        /* Services Grid */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .service-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          text-align: center;
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .service-card.featured {
          border: 2px solid #667eea;
          transform: scale(1.05);
        }

        .service-card.featured:hover {
          transform: scale(1.05) translateY(-5px);
        }

        .service-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .service-card h3 {
          font-size: 1.3rem;
          color: #1e293b;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .service-card p {
          color: #64748b;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .service-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: left;
        }

        .service-card li {
          padding: 8px 0;
          color: #64748b;
          position: relative;
          padding-left: 20px;
        }

        .service-card li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }

        /* Upload Section */
        .upload-section {
          margin-bottom: 40px;
        }

        .upload-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 2px dashed #cbd5e1;
        }

        .upload-header h3 {
          font-size: 1.3rem;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .upload-header p {
          color: #64748b;
          margin: 0;
        }

        .upload-controls {
          margin-top: 25px;
        }

        .category-selector label {
          display: block;
          color: #374151;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .category-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .tab {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          padding: 10px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: #64748b;
        }

        .tab:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .tab.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .upload-actions {
          text-align: center;
        }

        .upload-btn {
          font-size: 1rem;
        }

        /* Portfolio Stats */
        .portfolio-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
        }

        .stat-icon {
          font-size: 2.5rem;
        }

        .stat-number {
          font-size: 1.8rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
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
          font-weight: 500;
          color: #64748b;
        }

        .filter-btn:hover:not(:disabled) {
          border-color: #667eea;
          color: #667eea;
          transform: translateY(-2px);
        }

        .filter-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .filter-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .count-badge {
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
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .project-image {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f8fafc;
        }

        .project-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.3s ease;
        }

        .project-card:hover .project-image img {
          transform: scale(1.05);
        }

        .image-fallback {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
          padding: 20px;
        }

        .image-fallback span {
          font-size: 2.5rem;
          margin-bottom: 10px;
          opacity: 0.8;
        }

        .retry-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 10px;
          font-size: 0.8rem;
          transition: all 0.3s ease;
        }

        .retry-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .category-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255, 255, 255, 0.9);
          padding: 5px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .delete-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.1rem;
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
          background: #dc2626;
          transform: scale(1.1);
        }

        .project-info {
          padding: 20px;
        }

        .project-info h4 {
          margin: 0 0 8px 0;
          font-size: 1.1rem;
          color: #1e293b;
          font-weight: 600;
        }

        .project-info p {
          margin: 0 0 12px 0;
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .project-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }

        .date {
          color: #94a3b8;
        }

        .owner-tag {
          background: #667eea;
          color: white;
          padding: 3px 8px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 15px;
          border: 2px dashed #e2e8f0;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          font-size: 1.3rem;
          color: #1e293b;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .empty-state p {
          color: #64748b;
          margin-bottom: 20px;
        }

        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 60px 40px;
          border-radius: 20px;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 2.2rem;
          margin-bottom: 15px;
          font-weight: 700;
        }

        .cta-content p {
          font-size: 1.1rem;
          margin-bottom: 30px;
          opacity: 0.9;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .cta-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .modal-container {
          background: white;
          border-radius: 20px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          position: relative;
          animation: modalSlideIn 0.3s ease-out;
        }

        .modal-close {
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
          z-index: 10;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.1);
        }

        .modal-image {
          width: 100%;
          height: 400px;
          overflow: hidden;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .modal-fallback {
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #64748b;
          text-align: center;
        }

        .modal-fallback span {
          font-size: 3rem;
          margin-bottom: 10px;
        }

        .modal-content {
          padding: 30px;
        }

        .modal-content h3 {
          font-size: 1.4rem;
          color: #1e293b;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .modal-content p {
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

        .modal-meta .category {
          background: #667eea;
          color: white;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .modal-meta .date {
          color: #64748b;
          font-size: 0.9rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-title {
            font-size: 3rem;
          }
          
          .nav-container {
            padding: 0 30px;
          }
          
          .nav-links {
            gap: 4px;
          }
          
          .nav-link {
            padding: 8px 16px;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 768px) {
          .modern-nav {
            height: auto;
            padding: 10px 0;
          }
          
          .nav-container {
            flex-direction: column;
            gap: 15px;
            padding: 0 20px;
            height: auto;
          }
          
          .nav-brand, .nav-center, .nav-actions {
            width: 100%;
            justify-content: center;
          }
          
          .nav-links {
            width: 100%;
            justify-content: center;
          }
          
          .owner-controls {
            padding: 15px 20px;
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .debug-panel {
            padding: 15px 20px;
          }

          .section {
            padding: 40px 20px;
          }

          .hero-section {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-stats {
            justify-content: center;
          }

          .hero-actions {
            justify-content: center;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .service-card.featured {
            transform: none;
          }

          .service-card.featured:hover {
            transform: translateY(-5px);
          }

          .category-tabs {
            flex-direction: column;
          }

          .category-filter {
            flex-direction: column;
            align-items: center;
          }

          .filter-btn {
            width: 200px;
            justify-content: center;
          }

          .cta-actions {
            flex-direction: column;
            align-items: center;
          }

          .modal-container {
            margin: 10px;
          }

          .modal-image {
            height: 300px;
          }

          .login-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }
          
          .modern-login-modal {
            margin: 10px;
          }
          
          .login-body {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
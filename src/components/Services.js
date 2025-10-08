import React, { useState, useEffect } from 'react';
import useBackendService from '../services/useBackendService';

const Services = () => {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const backendService = useBackendService();

  // Load projects from backend service with improved caching
  useEffect(() => {
    const initializeServices = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Loading projects for Services...');
        
        // Check for updates first
        await backendService.checkForUpdates();
        
        // Load projects
        const loadedProjects = await backendService.loadProjects();
        console.log('✅ Projects loaded:', loadedProjects);
        
        // Ensure all projects have valid data
        const validProjects = loadedProjects.filter(project => 
          project && 
          project.src && 
          (project.src.startsWith('http') || project.src.startsWith('data:image'))
        );
        
        setProjects(validProjects);
        console.log('✅ Valid projects:', validProjects.length);
      } catch (error) {
        console.error('❌ Error loading projects:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeServices();
    
    // Set up periodic update check (every 5 minutes)
    const updateInterval = setInterval(() => {
      backendService.checkForUpdates();
    }, 5 * 60 * 1000);

    // Listen for custom storage events (when About page uploads new images)
    const handleCustomStorageChange = () => {
      console.log('📦 Storage changed, reloading projects...');
      initializeServices();
    };
    
    // Listen for both storage events and custom events
    window.addEventListener('storage', handleCustomStorageChange);
    window.addEventListener('portfolioUpdated', handleCustomStorageChange);
    
    return () => {
      clearInterval(updateInterval);
      window.removeEventListener('storage', handleCustomStorageChange);
      window.removeEventListener('portfolioUpdated', handleCustomStorageChange);
    };
  }, []);

  // Force refresh function
  const forceRefresh = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Force refreshing services...');
      
      // Clear cache first
      await backendService.clearAllCache();
      
      // Then load fresh data
      const loadedProjects = await backendService.loadProjects(true);
      const validProjects = loadedProjects.filter(project => 
        project && 
        project.src && 
        (project.src.startsWith('http') || project.src.startsWith('data:image'))
      );
      
      setProjects(validProjects);
      console.log('✅ Services force refreshed:', validProjects.length);
    } catch (error) {
      console.error('❌ Force refresh failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Projects', icon: '📁', count: projects.length },
    { id: 'graphic-design', name: 'Graphic Design', icon: '🎨', count: projects.filter(p => p.category === 'graphic-design').length },
    { id: 'photography', name: 'Photography', icon: '📸', count: projects.filter(p => p.category === 'photography').length },
    { id: 'motion-picture', name: 'Motion Picture', icon: '🎬', count: projects.filter(p => p.category === 'motion-picture').length },
    { id: 'music', name: 'Music Artworks', icon: '🎵', count: projects.filter(p => p.category === 'music').length },
    { id: 'games', name: 'Gaming Zone', icon: '🎮', count: projects.filter(p => p.category === 'games').length }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'graphic-design': return '🎨';
      case 'photography': return '📸';
      case 'motion-picture': return '🎬';
      case 'music': return '🎵';
      case 'games': return '🎮';
      default: return '📁';
    }
  };

  const getCategoryName = (category) => {
    switch(category) {
      case 'graphic-design': return 'Graphic Design';
      case 'photography': return 'Photography';
      case 'motion-picture': return 'Motion Picture';
      case 'music': return 'Music Artworks';
      case 'games': return 'Gaming Zone';
      default: return 'Project';
    }
  };

  // Improved image error handling
  const handleImageError = (e, project) => {
    console.error('🖼️ Image failed to load:', project.src);
    
    // Hide the broken image
    e.target.style.display = 'none';
    
    // Find and show fallback
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

  const handleModalImageError = (e, project) => {
    console.error('🖼️ Modal image failed to load:', project.src);
    e.target.style.display = 'none';
    
    // Create fallback in modal
    const fallback = document.createElement('div');
    fallback.className = 'modal-image-fallback';
    fallback.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #666; background: #f8fafc; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <span style="font-size: 3rem;">📷</span>
        <p style="margin: 10px 0; font-size: 1.1rem;">Image not available</p>
        <p style="margin: 0; font-size: 0.9rem; opacity: 0.7;">${project.title}</p>
      </div>
    `;
    e.target.parentNode.appendChild(fallback);
  };

  // Services data with big icons only
  const services = [
    { 
      id: 'graphic-design', 
      name: 'Graphic Design', 
      icon: '🎨', 
      color: '#667eea'
    },
    { 
      id: 'photography', 
      name: 'Photography', 
      icon: '📸', 
      color: '#764ba2'
    },
    { 
      id: 'motion-picture', 
      name: 'Motion Picture', 
      icon: '🎬', 
      color: '#667eea'
    },
    { 
      id: 'music', 
      name: 'Music Artworks', 
      icon: '🎵', 
      color: '#764ba2'
    },
    { 
      id: 'games', 
      name: 'Gaming Zone', 
      icon: '🎮', 
      color: '#667eea'
    }
  ];

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-header">
          <h2>Our Services</h2>
          <p>Professional creative services to bring your ideas to life</p>
          
          {/* Debug info */}
          <div className="debug-info">
            {isLoading ? '🔄 Loading...' : `Loaded ${projects.length} projects • ${filteredProjects.length} filtered`}
            <button 
              onClick={forceRefresh} 
              className="refresh-small-btn"
              disabled={isLoading}
              title="Force refresh from server"
            >
              {isLoading ? '⏳' : '🔄'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading services...</p>
          </div>
        )}

        {/* Services Icons Grid */}
        {!isLoading && (
          <div className="services-icons-grid">
            {services.map(service => (
              <div 
                key={service.id} 
                className="service-icon-card"
                onClick={() => scrollToSection('contact')}
              >
                <div className="service-icon-large" style={{ backgroundColor: service.color }}>
                  {service.icon}
                </div>
                <h3>{service.name}</h3>
                <div className="service-count">
                  {projects.filter(p => p.category === service.id).length} projects
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Portfolio Preview Section */}
        {!isLoading && projects.length > 0 && (
          <div className="portfolio-preview">
            <div className="preview-header">
              <h3>Recent Work</h3>
              <p>Check out some of our latest projects</p>
            </div>

            {/* Category Filter */}
            <div className="portfolio-filter">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                  disabled={category.count === 0 && category.id !== 'all'}
                >
                  <span className="filter-icon">{category.icon}</span>
                  {category.name}
                  <span className="project-count">({category.count})</span>
                </button>
              ))}
            </div>

            {/* Portfolio Grid */}
            <div className="portfolio-grid">
              {filteredProjects.length > 0 ? (
                filteredProjects.slice(0, 6).map(project => (
                  <div 
                    key={project.id} 
                    className="portfolio-item"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="portfolio-image">
                      <img 
                        src={project.src} 
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        onLoad={handleImageLoad}
                        onError={(e) => handleImageError(e, project)}
                        style={{ 
                          opacity: 0, 
                          transition: 'opacity 0.3s ease',
                          background: '#f8fafc'
                        }}
                      />
                      <div className="image-fallback">
                        <span>📷</span>
                        <p>Image not available</p>
                        <small>{project.title}</small>
                        <button 
                          className="retry-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            const img = e.target.closest('.portfolio-image').querySelector('img');
                            retryImageLoad(img, project.src);
                          }}
                        >
                          🔄 Retry
                        </button>
                      </div>
                      <div className="portfolio-overlay">
                        <div className="portfolio-info">
                          <h4>{project.title}</h4>
                          <p>{project.description}</p>
                          <span className="category-tag">
                            {getCategoryIcon(project.category)} {getCategoryName(project.category)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-portfolio">
                  <div className="empty-icon">
                    {selectedCategory === 'all' ? '📁' : 
                     categories.find(cat => cat.id === selectedCategory)?.icon}
                  </div>
                  <h3>
                    {selectedCategory === 'all' 
                      ? "No Projects to Display" 
                      : `No ${categories.find(cat => cat.id === selectedCategory)?.name} Projects`
                    }
                  </h3>
                  <p>
                    {projects.length > 0 
                      ? `No projects found in "${categories.find(cat => cat.id === selectedCategory)?.name}" category` 
                      : "Check back later for new projects"
                    }
                  </p>
                </div>
              )}
            </div>

            {filteredProjects.length > 6 && (
              <div className="view-more">
                <button 
                  className="btn-primary"
                  onClick={() => scrollToSection('about')}
                >
                  View All Projects
                </button>
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        {!isLoading && (
          <div className="services-cta">
            <h3>Ready to Get Started?</h3>
            <p>Let's discuss your project and bring your creative vision to life with our professional services.</p>
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={() => scrollToSection('contact')}
              >
                Start Your Project
              </button>
              <button 
                className="btn-secondary"
                onClick={() => scrollToSection('about')}
              >
                View Full Portfolio
              </button>
            </div>
          </div>
        )}

        {/* FIXED Project Modal */}
        {selectedProject && (
          <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <button 
                className="modal-close-btn"
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>
              <div className="modal-image-wrapper">
                <img 
                  src={selectedProject.src} 
                  alt={selectedProject.title}
                  onLoad={(e) => {
                    e.target.style.opacity = '1';
                    console.log('✅ Modal image loaded');
                  }}
                  onError={(e) => handleModalImageError(e, selectedProject)}
                  style={{ 
                    opacity: 0, 
                    transition: 'opacity 0.3s ease',
                    background: '#f8fafc'
                  }}
                />
              </div>
              <div className="modal-content">
                <h3>{selectedProject.title}</h3>
                <p>{selectedProject.description}</p>
                <div className="modal-meta">
                  <span className="category-tag-large">
                    {getCategoryIcon(selectedProject.category)} {getCategoryName(selectedProject.category)}
                  </span>
                  <span className="modal-date">Created: {selectedProject.uploadDate || 'Recently'}</span>
                </div>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setSelectedProject(null);
                    scrollToSection('contact');
                  }}
                >
                  Book Similar Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .services {
          padding: 80px 0;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 80vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 3rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-header p {
          font-size: 1.2rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Debug Info */
        .debug-info {
          font-size: 12px;
          color: #666;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .refresh-small-btn {
          background: #667eea;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 10px;
          transition: all 0.3s ease;
        }

        .refresh-small-btn:hover:not(:disabled) {
          background: #5a67d8;
          transform: scale(1.1);
        }

        .refresh-small-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Loading State */
        .loading-state {
          text-align: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-state p {
          color: #64748b;
          font-size: 1.1rem;
        }

        /* Services Icons Grid */
        .services-icons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 30px;
          margin-bottom: 80px;
        }

        .service-icon-card {
          background: white;
          padding: 40px 20px;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          text-align: center;
          cursor: pointer;
          position: relative;
        }

        .service-icon-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .service-icon-large {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          margin: 0 auto 20px auto;
          color: white;
          transition: transform 0.3s ease;
        }

        .service-icon-card:hover .service-icon-large {
          transform: scale(1.1);
        }

        .service-icon-card h3 {
          font-size: 1.3rem;
          color: #1e293b;
          margin: 0 0 8px 0;
          font-weight: 700;
        }

        .service-count {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Portfolio Preview */
        .portfolio-preview {
          margin-bottom: 80px;
        }

        .preview-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .preview-header h3 {
          font-size: 2.2rem;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .preview-header p {
          color: #64748b;
          font-size: 1.1rem;
        }

        /* Portfolio Filter */
        .portfolio-filter {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .filter-btn {
          background: white;
          border: 2px solid #e2e8f0;
          padding: 12px 20px;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .filter-btn:hover:not(.active):not(:disabled) {
          border-color: #667eea;
          color: #667eea;
        }

        .filter-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .project-count {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        /* Portfolio Grid */
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .portfolio-item {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .portfolio-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .portfolio-image {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f8fafc;
        }

        .portfolio-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
          background: #f8fafc;
        }

        .portfolio-item:hover .portfolio-image img {
          transform: scale(1.05);
        }

        /* Image Fallback Styles */
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
          font-size: 2rem;
          text-align: center;
          padding: 20px;
          border-radius: 16px;
        }

        .image-fallback span {
          font-size: 3rem;
          margin-bottom: 10px;
          opacity: 0.8;
        }

        .image-fallback p {
          font-size: 1rem;
          margin: 5px 0;
          opacity: 0.9;
          font-weight: 500;
        }

        .image-fallback small {
          font-size: 0.8rem;
          opacity: 0.7;
          margin-top: 5px;
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
          backdrop-filter: blur(10px);
        }

        .retry-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .portfolio-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(transparent 40%, rgba(0, 0, 0, 0.8));
          display: flex;
          align-items: flex-end;
          padding: 15px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .portfolio-item:hover .portfolio-overlay {
          opacity: 1;
        }

        .portfolio-info h4 {
          color: white;
          margin-bottom: 6px;
          font-size: 1.1rem;
        }

        .portfolio-info p {
          color: #e2e8f0;
          margin: 0 0 10px 0;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .category-tag {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 4px 10px;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        /* Empty State */
        .empty-portfolio {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 16px;
          border: 2px dashed #e2e8f0;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 15px;
          opacity: 0.5;
        }

        .empty-portfolio h3 {
          color: #1e293b;
          margin-bottom: 10px;
          font-size: 1.3rem;
        }

        .empty-portfolio p {
          color: #64748b;
          margin-bottom: 20px;
          font-size: 1rem;
        }

        /* View More */
        .view-more {
          text-align: center;
        }

        /* CTA Section */
        .services-cta {
          background: white;
          padding: 60px 40px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .services-cta h3 {
          font-size: 2rem;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .services-cta p {
          color: #64748b;
          font-size: 1.1rem;
          margin-bottom: 30px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
          padding: 14px 28px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-secondary:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }

        /* FIXED Modal Styles - High z-index and scrollable */
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
          z-index: 9999;
          padding: 20px;
          backdrop-filter: blur(10px);
          overflow-y: auto;
        }

        .modal-container {
          background: white;
          border-radius: 20px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          position: relative;
          animation: modalSlideIn 0.3s ease-out;
          display: flex;
          flex-direction: column;
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

        .modal-close-btn {
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
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .modal-close-btn:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.1);
        }

        .modal-image-wrapper {
          width: 100%;
          max-height: 400px;
          overflow: hidden;
          position: relative;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-image-wrapper img {
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: contain;
        }

        .modal-content {
          padding: 30px;
          overflow-y: auto;
          flex: 1;
        }

        .modal-content h3 {
          font-size: 1.6rem;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .modal-content p {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 20px;
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

        .modal-date {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .services-icons-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
          }

          .service-icon-large {
            width: 80px;
            height: 80px;
            font-size: 2.5rem;
          }

          .service-icon-card {
            padding: 30px 15px;
          }

          .service-icon-card h3 {
            font-size: 1.1rem;
          }

          .portfolio-grid {
            grid-template-columns: 1fr;
          }

          .portfolio-filter {
            flex-direction: column;
            align-items: center;
          }

          .filter-btn {
            width: 200px;
            justify-content: center;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .section-header h2 {
            font-size: 2.5rem;
          }

          .modal-container {
            margin: 10px;
            max-height: 95vh;
          }

          .modal-image-wrapper {
            max-height: 300px;
          }

          .modal-image-wrapper img {
            max-height: 300px;
          }
        }

        @media (max-width: 480px) {
          .services {
            padding: 60px 0;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .services-icons-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }

          .service-icon-large {
            width: 60px;
            height: 60px;
            font-size: 2rem;
          }

          .service-icon-card {
            padding: 20px 10px;
          }

          .service-icon-card h3 {
            font-size: 1rem;
          }

          .modal-content {
            padding: 20px;
          }

          .modal-meta {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
};

export default Services;

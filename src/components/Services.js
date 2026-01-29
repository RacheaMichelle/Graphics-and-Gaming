/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import useBackendService from '../services/useBackendService';
import CreativeProcess from '../components/CreativeProcess';

const Services = () => {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const backendService = useBackendService();

  

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

  // Auto-advance slideshow
  useEffect(() => {
    if (!isAutoPlaying || filteredProjects.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(filteredProjects.length, 6));
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [filteredProjects.length, isAutoPlaying]);

  // Reset slide when category changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedCategory]);

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

  // Navigation functions for slideshow
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.min(filteredProjects.length, 6));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.min(filteredProjects.length, 6)) % Math.min(filteredProjects.length, 6));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
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
    <>
      {/* Creative Process Section */}
      <CreativeProcess />
      
      {/* Main Services Section */}
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

              {/* Full-width Slideshow Container */}
              {filteredProjects.length > 0 ? (
                <div className="fullwidth-slideshow-container">
                  {/* Slideshow Navigation */}
                  {filteredProjects.length > 1 && (
                    <>
                      <button 
                        className="slideshow-nav-btn prev-btn"
                        onClick={prevSlide}
                        aria-label="Previous slide"
                      >
                        ‹
                      </button>
                      <button 
                        className="slideshow-nav-btn next-btn"
                        onClick={nextSlide}
                        aria-label="Next slide"
                      >
                        ›
                      </button>
                      
                      {/* Auto-play toggle */}
                      <div className="slideshow-controls">
                        <button 
                          className={`autoplay-btn ${isAutoPlaying ? 'paused' : 'playing'}`}
                          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                          title={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                        >
                          {isAutoPlaying ? '⏸️' : '▶️'}
                        </button>
                      </div>
                    </>
                  )}

                  {/* Slideshow Track */}
                  <div className="slideshow-track">
                    {filteredProjects.slice(0, 6).map((project, index) => (
                      <div
                        key={project.id}
                        className={`slide ${index === currentSlide ? 'active' : ''} ${
                          index === (currentSlide - 1 + Math.min(filteredProjects.length, 6)) % Math.min(filteredProjects.length, 6) ? 'prev' : ''
                        } ${
                          index === (currentSlide + 1) % Math.min(filteredProjects.length, 6) ? 'next' : ''
                        }`}
                        onClick={() => setSelectedProject(project)}
                      >
                        <div className="slide-image">
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
                                const img = e.target.closest('.slide-image').querySelector('img');
                                retryImageLoad(img, project.src);
                              }}
                            >
                              🔄 Retry
                            </button>
                          </div>
                          <div className="slide-overlay">
                            <div className="slide-info">
                              <h4>{project.title}</h4>
                              <p>{project.description}</p>
                              <div className="slide-meta">
                                <span className="category-tag">
                                  {getCategoryIcon(project.category)} {getCategoryName(project.category)}
                                </span>
                                <span className="upload-date">
                                  Uploaded {project.uploadDate || 'Recently'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Slide Indicators */}
                  {filteredProjects.length > 1 && (
                    <div className="slide-indicators">
                      {filteredProjects.slice(0, 6).map((_, index) => (
                        <button
                          key={index}
                          className={`indicator ${index === currentSlide ? 'active' : ''}`}
                          onClick={() => goToSlide(index)}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Slide Counter */}
                  <div className="slide-counter">
                    {currentSlide + 1} / {Math.min(filteredProjects.length, 6)}
                  </div>
                </div>
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
                    <span className="modal-date">Uploaded: {selectedProject.uploadDate || 'Recently'}</span>
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

          /* Full-width Slideshow Styles */
          .fullwidth-slideshow-container {
            position: relative;
            width: 100vw;
            left: 50%;
            right: 50%;
            margin-left: -50vw;
            margin-right: -50vw;
            margin-bottom: 40px;
            overflow: hidden;
            background: white;
          }

          .slideshow-track {
            position: relative;
            height: 70vh;
            min-height: 500px;
            max-height: 800px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }

          .slide.active {
            opacity: 1;
            transform: translateX(0);
            z-index: 2;
          }

          .slide.prev {
            opacity: 0.3;
            transform: translateX(-100%);
            z-index: 1;
          }

          .slide.next {
            opacity: 0.3;
            transform: translateX(100%);
            z-index: 1;
          }

          .slide-image {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #f8fafc;
          }

          .slide-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.8s ease;
          }

          .slide:hover .slide-image img {
            transform: scale(1.02);
          }

          .slide-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              to bottom,
              transparent 0%,
              transparent 50%,
              rgba(0, 0, 0, 0.8) 100%
            );
            display: flex;
            align-items: flex-end;
            padding: 40px;
            opacity: 1;
            transition: opacity 0.3s ease;
          }

          .slide-info {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            color: white;
          }

          .slide-info h4 {
            font-size: 2rem;
            margin-bottom: 12px;
            font-weight: 700;
          }

          .slide-info p {
            font-size: 1.2rem;
            margin-bottom: 16px;
            opacity: 0.9;
            line-height: 1.5;
          }

          .slide-meta {
            display: flex;
            align-items: center;
            gap: 20px;
            flex-wrap: wrap;
          }

          .category-tag {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            backdrop-filter: blur(10px);
          }

          .upload-date {
            font-size: 0.9rem;
            opacity: 0.8;
            color: white;
          }

          /* Slideshow Navigation */
          .slideshow-nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.9);
            border: none;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 2rem;
            color: #667eea;
            z-index: 3;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          }

          .slideshow-nav-btn:hover {
            background: white;
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
          }

          .prev-btn {
            left: 30px;
          }

          .next-btn {
            right: 30px;
          }

          /* Slideshow Controls */
          .slideshow-controls {
            position: absolute;
            top: 30px;
            right: 30px;
            z-index: 3;
          }

          .autoplay-btn {
            background: rgba(255, 255, 255, 0.9);
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
          }

          .autoplay-btn:hover {
            background: white;
            transform: scale(1.1);
          }

          /* Slide Indicators */
          .slide-indicators {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 12px;
            z-index: 3;
          }

          .indicator {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid white;
            background: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .indicator.active {
            background: white;
            transform: scale(1.3);
          }

          .indicator:hover {
            background: rgba(255, 255, 255, 0.7);
          }

          /* Slide Counter */
          .slide-counter {
            position: absolute;
            bottom: 30px;
            right: 30px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 1rem;
            font-weight: 600;
            z-index: 3;
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
          }

          .image-fallback span {
            font-size: 4rem;
            margin-bottom: 20px;
            opacity: 0.8;
          }

          .image-fallback p {
            font-size: 1.2rem;
            margin: 10px 0;
            opacity: 0.9;
            font-weight: 500;
          }

          .image-fallback small {
            font-size: 1rem;
            opacity: 0.7;
            margin-top: 10px;
          }

          .retry-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 15px;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }

          .retry-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
          }

          /* Empty State */
          .empty-portfolio {
            text-align: center;
            padding: 80px 20px;
            background: white;
            border-radius: 16px;
            border: 2px dashed #e2e8f0;
            margin-bottom: 40px;
          }

          .empty-icon {
            font-size: 4rem;
            margin-bottom: 20px;
            opacity: 0.5;
          }

          .empty-portfolio h3 {
            color: #1e293b;
            margin-bottom: 15px;
            font-size: 1.5rem;
          }

          .empty-portfolio p {
            color: #64748b;
            margin-bottom: 25px;
            font-size: 1.1rem;
          }

          /* View More */
          .view-more {
            text-align: center;
            margin-top: 40px;
          }

          /* CTA Section */
          .services-cta {
            background: white;
            padding: 80px 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
            margin-top: 40px;
          }

          .services-cta h3 {
            font-size: 2.2rem;
            color: #1e293b;
            margin-bottom: 20px;
          }

          .services-cta p {
            color: #64748b;
            font-size: 1.2rem;
            margin-bottom: 40px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.6;
          }

          .cta-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
          }

          .btn-primary, .btn-secondary {
            padding: 16px 32px;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
          }

          .btn-secondary {
            background: white;
            color: #667eea;
            border: 2px solid #667eea;
          }

          .btn-secondary:hover {
            background: #667eea;
            color: white;
            transform: translateY(-3px);
          }

          /* FIXED Modal Styles */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
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
            max-width: 900px;
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
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.8rem;
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
            max-height: 500px;
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
            max-height: 500px;
            object-fit: contain;
          }

          .modal-content {
            padding: 40px;
            overflow-y: auto;
            flex: 1;
          }

          .modal-content h3 {
            font-size: 2rem;
            color: #1e293b;
            margin-bottom: 16px;
          }

          .modal-content p {
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 25px;
            font-size: 1.1rem;
          }

          .modal-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 15px;
          }

          .category-tag-large {
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 1rem;
          }

          .modal-date {
            color: #94a3b8;
            font-size: 1rem;
            font-weight: 500;
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

            .slideshow-track {
              height: 60vh;
              min-height: 400px;
            }

            .slideshow-nav-btn {
              width: 50px;
              height: 50px;
              font-size: 1.5rem;
            }

            .prev-btn {
              left: 15px;
            }

            .next-btn {
              right: 15px;
            }

            .slide-overlay {
              padding: 25px;
            }

            .slide-info h4 {
              font-size: 1.5rem;
            }

            .slide-info p {
              font-size: 1rem;
            }

            .slide-meta {
              gap: 15px;
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

            .modal-content {
              padding: 25px;
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

            .slideshow-track {
              height: 50vh;
              min-height: 300px;
            }

            .slideshow-nav-btn {
              width: 40px;
              height: 40px;
              font-size: 1.2rem;
            }

            .slide-overlay {
              padding: 20px;
            }

            .slide-info h4 {
              font-size: 1.3rem;
            }

            .slide-info p {
              font-size: 0.9rem;
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
    </>
  );
};

export default Services;

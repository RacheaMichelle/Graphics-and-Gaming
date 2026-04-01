import React, { useState, useEffect } from 'react';
import LazyReveal from '../components/LazyReveal';
import LazyImage from '../components/LazyImage';
import useBackendService from '../services/useBackendService';
import CreativeProcess from '../components/CreativeProcess';

const ServicesPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const backendService = useBackendService();

  const categories = [
    { id: 'all', name: 'All Services', icon: '📁' },
    { id: 'graphic-design', name: 'Graphic Design', icon: '🎨' },
    { id: 'photography', name: 'Photography', icon: '📸' },
    { id: 'motion-picture', name: 'Motion Picture', icon: '🎬' },
    { id: 'music', name: 'Music Artworks', icon: '🎵' },
    { id: 'games', name: 'Gaming Zone', icon: '🎮' }
  ];

  const servicesList = [
    { id: 'graphic-design', name: 'Graphic Design', icon: '🎨', description: 'Logo design, branding, print materials, and digital assets', color: '#667eea' },
    { id: 'photography', name: 'Photography', icon: '📸', description: 'Wedding, events, portraits, and product photography', color: '#764ba2' },
    { id: 'motion-picture', name: 'Motion Picture', icon: '🎬', description: 'Video production, editing, and motion graphics', color: '#f59e0b' },
    { id: 'music', name: 'Music Artworks', icon: '🎵', description: 'Album covers, promotional materials, and artist branding', color: '#10b981' },
    { id: 'games', name: 'Gaming Zone', icon: '🎮', description: 'Game art, tournaments, and gaming experiences', color: '#ef4444' }
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const loadedProjects = await backendService.loadProjects();
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

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

  return (
    <>
      <CreativeProcess />
      
      <section className="services-page">
        {/* Hero Section */}
        <div className="page-hero">
          <div className="container">
            <LazyReveal threshold={0.1}>
              <h1>Our Services</h1>
              <p>Professional creative solutions tailored to your needs</p>
            </LazyReveal>
          </div>
        </div>

        {/* Services List */}
        <div className="services-list-section">
          <div className="container">
            <div className="services-grid-large">
              {servicesList.map((service, index) => (
                <LazyReveal key={service.id} threshold={0.3} delay={index * 100}>
                  <div className="service-card-large">
                    <div className="service-icon-large" style={{ background: service.color }}>
                      {service.icon}
                    </div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <div className="service-stats">
                      <span>📊 {projects.filter(p => p.category === service.id).length} Projects</span>
                    </div>
                  </div>
                </LazyReveal>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Gallery */}
        <div className="portfolio-gallery">
          <div className="container">
            <LazyReveal threshold={0.2}>
              <h2 className="section-title">Recent Projects</h2>
              <p className="section-subtitle">Check out our latest work</p>
            </LazyReveal>

            {/* Category Filter */}
            <div className="category-filter">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            {isLoading ? (
              <div className="loading-state">Loading projects...</div>
            ) : filteredProjects.length > 0 ? (
              <div className="projects-grid">
                {filteredProjects.slice(0, 9).map((project, index) => (
                  <LazyReveal key={project.id} threshold={0.3} delay={index * 50}>
                    <div 
                      className="project-card"
                      onClick={() => setSelectedProject(project)}
                    >
                      <LazyImage src={project.src} alt={project.title} />
                      <div className="project-info">
                        <h4>{project.title}</h4>
                        <p>{project.description}</p>
                        <div className="project-category">
                          {getCategoryIcon(project.category)} {getCategoryName(project.category)}
                        </div>
                      </div>
                    </div>
                  </LazyReveal>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No projects found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .services-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .page-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 120px 0 80px;
          text-align: center;
        }

        .page-hero h1 {
          font-size: 3.5rem;
          margin-bottom: 16px;
        }

        .page-hero p {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .services-list-section {
          padding: 80px 0;
        }

        .services-grid-large {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }

        .service-card-large {
          background: white;
          padding: 40px 30px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .service-card-large:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .service-icon-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin: 0 auto 20px;
          color: white;
        }

        .service-card-large h3 {
          font-size: 1.5rem;
          margin-bottom: 12px;
          color: #1e293b;
        }

        .service-card-large p {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .service-stats {
          color: #667eea;
          font-weight: 500;
        }

        .portfolio-gallery {
          padding: 80px 0;
          background: white;
        }

        .section-title {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 16px;
          color: #1e293b;
        }

        .section-subtitle {
          text-align: center;
          color: #64748b;
          font-size: 1.2rem;
          margin-bottom: 60px;
        }

        .category-filter {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .filter-btn {
          background: white;
          border: 2px solid #e2e8f0;
          padding: 12px 24px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .filter-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .filter-btn:hover:not(.active) {
          border-color: #667eea;
          color: #667eea;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }

        .project-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
        }

        .project-card :global(.lazy-image-container) {
          height: 250px;
        }

        .project-info {
          padding: 20px;
        }

        .project-info h4 {
          font-size: 1.2rem;
          margin-bottom: 8px;
          color: #1e293b;
        }

        .project-info p {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .project-category {
          color: #667eea;
          font-weight: 500;
          font-size: 0.85rem;
        }

        .loading-state {
          text-align: center;
          padding: 60px;
          color: #64748b;
        }

        .empty-state {
          text-align: center;
          padding: 60px;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .page-hero {
            padding: 100px 0 60px;
          }

          .page-hero h1 {
            font-size: 2.5rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .services-grid-large,
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default ServicesPage;
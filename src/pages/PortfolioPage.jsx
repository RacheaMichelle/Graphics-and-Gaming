// src/pages/PortfolioPage.jsx
import React, { useState, useEffect } from 'react';
import LazyReveal from '../components/LazyReveal';
import LazyImage from '../components/LazyImage';
import useBackendService from '../services/useBackendService';

const PortfolioPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const backendService = useBackendService();

  const categories = [
    { id: 'all', name: 'All Work', icon: '📁' },
    { id: 'graphic-design', name: 'Graphic Design', icon: '🎨' },
    { id: 'photography', name: 'Photography', icon: '📸' },
    { id: 'motion-picture', name: 'Motion Picture', icon: '🎬' },
    { id: 'music', name: 'Music Artworks', icon: '🎵' },
    { id: 'games', name: 'Gaming Zone', icon: '🎮' }
  ];

  useEffect(() => {
    loadProjects();
    checkOwnerStatus();
  }, []);

  const loadProjects = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      const loadedProjects = await backendService.loadProjects(forceRefresh);
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkOwnerStatus = () => {
    const savedOwnerStatus = localStorage.getItem('isOwner');
    if (savedOwnerStatus === 'true') {
      setIsOwner(true);
    }
  };

  // Owner Login
  const handleOwnerLogin = () => {
    if (password === 'owner123') {
      setIsOwner(true);
      setShowLogin(false);
      setPassword('');
      localStorage.setItem('isOwner', 'true');
      alert('Owner mode activated! You can now delete projects.');
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  // Owner Logout
  const handleOwnerLogout = () => {
    setIsOwner(false);
    localStorage.removeItem('isOwner');
    alert('Logged out of owner mode.');
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    try {
      await backendService.deleteProject(projectId);
      // Reload projects after deletion
      await loadProjects(true);
      setShowDeleteConfirm(null);
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete project: ' + error.message);
    }
  };

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

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

  return (
    <div className="portfolio-page">
      {/* Owner Controls Bar */}
      {!isOwner ? (
        <div className="owner-bar viewer-mode">
          <div className="container">
            <div className="owner-bar-content">
              <span className="viewer-badge">👀 Viewing Mode</span>
              <button 
                className="owner-login-btn"
                onClick={() => setShowLogin(true)}
              >
                🔧 Owner Login
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="owner-bar owner-mode">
          <div className="container">
            <div className="owner-bar-content">
              <div className="owner-status">
                <span className="owner-badge">👑 OWNER MODE</span>
                <span className="owner-info">You can delete projects</span>
              </div>
              <div className="owner-actions">
                <button 
                  className="action-btn refresh"
                  onClick={() => loadProjects(true)}
                  disabled={isLoading}
                >
                  {isLoading ? '⏳' : '🔄'} Refresh
                </button>
                <button 
                  className="action-btn logout"
                  onClick={handleOwnerLogout}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="page-hero">
        <div className="container">
          <LazyReveal threshold={0.1}>
            <h1>Our Portfolio</h1>
            <p>Explore our creative work and successful projects</p>
            {isOwner && (
              <p className="owner-note">✨ Owner Mode Active - Click the delete button (×) on any project to remove it</p>
            )}
          </LazyReveal>
        </div>
      </div>

      <section className="portfolio-section">
        <div className="container">
          {/* Category Filter */}
          <div className="category-filter">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.icon} {cat.name}
                <span className="count">({projects.filter(p => cat.id === 'all' || p.category === cat.id).length})</span>
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="loading-state">Loading portfolio...</div>
          ) : filteredProjects.length > 0 ? (
            <div className="projects-grid">
              {filteredProjects.map((project, index) => (
                <LazyReveal key={project.id} threshold={0.3} delay={index * 50}>
                  <div className="project-card">
                    {/* Delete Button - Only visible to owner */}
                    {isOwner && (
                      <button 
                        className="delete-project-btn"
                        onClick={() => setShowDeleteConfirm(project)}
                        title="Delete this project"
                      >
                        ×
                      </button>
                    )}
                    
                    <div 
                      className="project-image"
                      onClick={() => setSelectedProject(project)}
                    >
                      <LazyImage src={project.src} alt={project.title} />
                      <div className="project-overlay">
                        <button className="view-btn">View Project</button>
                      </div>
                    </div>
                    <div className="project-info">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="project-category">
                        {getCategoryIcon(project.category)} {getCategoryName(project.category)}
                      </div>
                      {project.localOnly && (
                        <span className="local-badge">📱 Local Only</span>
                      )}
                    </div>
                  </div>
                </LazyReveal>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📷</div>
              <h3>No Projects Found</h3>
              <p>Check back later for new projects in this category.</p>
              {isOwner && (
                <button 
                  className="add-project-btn"
                  onClick={() => window.location.href = '/'}
                >
                  Go to Homepage to Add Projects
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="modal" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)}>×</button>
            {isOwner && (
              <button 
                className="modal-delete-btn"
                onClick={() => {
                  setSelectedProject(null);
                  setShowDeleteConfirm(selectedProject);
                }}
              >
                🗑️ Delete Project
              </button>
            )}
            <div className="modal-image">
              <img src={selectedProject.src} alt={selectedProject.title} />
            </div>
            <div className="modal-info">
              <h2>{selectedProject.title}</h2>
              <p>{selectedProject.description}</p>
              <div className="modal-meta">
                <span className="category">{getCategoryIcon(selectedProject.category)} {getCategoryName(selectedProject.category)}</span>
                <span className="date">Uploaded: {selectedProject.uploadDate || 'Recently'}</span>
              </div>
              <button className="contact-btn" onClick={() => window.location.href = '/contact'}>
                Inquire About This Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <h3>Delete Project</h3>
              <button className="delete-modal-close" onClick={() => setShowDeleteConfirm(null)}>×</button>
            </div>
            <div className="delete-modal-body">
              <div className="delete-warning-icon">⚠️</div>
              <p>Are you sure you want to delete "<strong>{showDeleteConfirm.title}</strong>"?</p>
              <p className="delete-warning">This action cannot be undone. The project will be permanently removed from the portfolio and storage.</p>
              {showDeleteConfirm.localOnly && (
                <p className="local-warning">📱 This is a local-only project. It will be removed from your browser storage.</p>
              )}
            </div>
            <div className="delete-modal-footer">
              <button className="cancel-delete-btn" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={() => handleDeleteProject(showDeleteConfirm.id)}>
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="login-modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <div className="login-header">
              <div className="login-icon">🔐</div>
              <h3>Owner Access</h3>
              <p>Enter your credentials to delete projects</p>
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
                  className="login-confirm"
                  onClick={handleOwnerLogin}
                >
                  <span className="btn-icon">🔑</span>
                  <span className="btn-text">Login as Owner</span>
                </button>
                <button 
                  className="login-cancel"
                  onClick={() => setShowLogin(false)}
                >
                  Cancel
                </button>
              </div>
              
              <div className="login-footer">
                <p>🔒 Secure owner access only</p>
                
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .portfolio-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #478dd2 0%, #f1f5f9 100%);
        }

        /* Owner Bar Styles */
        .owner-bar {
          position: relative;
          z-index: 100;
        }

        .owner-bar.viewer-mode {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 12px 0;
        }

        .owner-bar.owner-mode {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 12px 0;
        }

        .owner-bar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .viewer-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 25px;
          font-weight: 600;
          color: white;
        }

        .owner-login-btn {
          background: white;
          color: #667eea;
          border: none;
          padding: 8px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .owner-login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
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
          color: white;
        }

        .owner-info {
          color: white;
          font-size: 0.9rem;
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
          font-weight: 500;
        }

        .action-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .action-btn.logout:hover {
          background: rgba(239, 68, 68, 0.8);
          border-color: #ef4444;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .owner-note {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          padding: 10px 20px;
          border-radius: 25px;
          display: inline-block;
          margin-top: 15px;
          font-size: 0.9rem;
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

        .portfolio-section {
          padding: 80px 0;
        }

        .category-filter {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 60px;
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

        .count {
          margin-left: 8px;
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
        }

        .project-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          position: relative;
        }

        .project-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .delete-project-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
          opacity: 0;
        }

        .project-card:hover .delete-project-btn {
          opacity: 1;
        }

        .delete-project-btn:hover {
          background: #dc2626;
          transform: scale(1.1);
        }

        .project-image {
          position: relative;
          height: 250px;
          overflow: hidden;
          cursor: pointer;
        }

        .project-image :global(.lazy-image-container) {
          height: 100%;
        }

        .project-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(102, 126, 234, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .project-card:hover .project-overlay {
          opacity: 1;
        }

        .view-btn {
          background: white;
          color: #667eea;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .project-info {
          padding: 20px;
        }

        .project-info h3 {
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

        .local-badge {
          display: inline-block;
          margin-top: 8px;
          background: #f59e0b;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 80px;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          margin-bottom: 10px;
          color: #1e293b;
        }

        .add-project-btn {
          margin-top: 20px;
          background: #667eea;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
        }

        /* Modal Styles */
        .modal {
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
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          z-index: 10;
        }

        .modal-delete-btn {
          position: absolute;
          top: 15px;
          right: 60px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          z-index: 10;
          font-weight: 500;
        }

        .modal-delete-btn:hover {
          background: #dc2626;
        }

        .modal-image {
          width: 100%;
          max-height: 500px;
          overflow: hidden;
        }

        .modal-image img {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .modal-info {
          padding: 30px;
        }

        .modal-info h2 {
          margin-bottom: 15px;
          color: #1e293b;
        }

        .modal-info p {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .modal-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
        }

        .category {
          background: #667eea;
          color: white;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.85rem;
        }

        .date {
          color: #94a3b8;
          font-size: 0.85rem;
        }

        .contact-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        /* Delete Confirmation Modal */
        .delete-modal-overlay {
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
        }

        .delete-modal {
          background: white;
          border-radius: 20px;
          max-width: 450px;
          width: 100%;
          overflow: hidden;
          animation: modalSlideIn 0.3s ease-out;
        }

        .delete-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          background: #ef4444;
          color: white;
        }

        .delete-modal-header h3 {
          margin: 0;
          font-size: 1.3rem;
        }

        .delete-modal-close {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-modal-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .delete-modal-body {
          padding: 30px;
          text-align: center;
        }

        .delete-warning-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .delete-modal-body p {
          color: #374151;
          margin-bottom: 15px;
          line-height: 1.5;
        }

        .delete-warning {
          color: #ef4444;
          font-size: 0.9rem;
        }

        .local-warning {
          color: #f59e0b;
          font-size: 0.85rem;
          background: #fef3c7;
          padding: 8px;
          border-radius: 8px;
          margin-top: 10px;
        }

        .delete-modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px 25px;
          background: #f8fafc;
        }

        .cancel-delete-btn {
          flex: 1;
          background: #64748b;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .confirm-delete-btn {
          flex: 1;
          background: #ef4444;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .confirm-delete-btn:hover {
          background: #dc2626;
        }

        /* Login Modal */
        .login-modal-overlay {
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

        .login-modal {
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

        .login-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .login-confirm {
          flex: 2;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
        }

        .login-cancel {
          flex: 1;
          background: #64748b;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
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

        .demo-hint {
          margin-top: 8px;
          color: #667eea;
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
          .page-hero {
            padding: 100px 0 60px;
          }

          .page-hero h1 {
            font-size: 2.5rem;
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .category-filter {
            flex-direction: column;
            align-items: center;
          }

          .filter-btn {
            width: 200px;
            justify-content: center;
          }

          .owner-bar-content {
            flex-direction: column;
            text-align: center;
          }

          .owner-status {
            flex-direction: column;
          }

          .owner-actions {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default PortfolioPage;
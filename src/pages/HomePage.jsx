// src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from 'react'; 
import Hero from '../components/Hero';
import PortfolioSlideshow from '../components/PortfolioSlideshow';
import LazyReveal from '../components/LazyReveal';
import useBackendService from '../services/useBackendService';

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [uploadCategory, setUploadCategory] = useState('graphic-design');
  const [isUploading, setIsUploading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);
  
  const backendService = useBackendService();

  const categories = [
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
      updateDebugInfo();
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

  const updateDebugInfo = () => {
    const info = backendService.getDebugInfo();
    setDebugInfo(info);
  };

  // Owner Login
  const handleOwnerLogin = () => {
    if (password === 'owner123') {
      setIsOwner(true);
      setShowLogin(false);
      setPassword('');
      localStorage.setItem('isOwner', 'true');
      alert('Owner mode activated! You can now upload and delete images.');
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

  // Force refresh from Supabase
  const forceRefreshProjects = async () => {
    try {
      setIsLoading(true);
      await backendService.clearAllCache();
      await loadProjects(true);
      alert('Projects refreshed from database!');
    } catch (error) {
      console.error('Force refresh failed:', error);
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

  // Handle file upload
  const handleFileUpload = async (event) => {
    if (!isOwner) return;
    
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      const uploadPromises = files.map(file => 
        backendService.uploadFile(file, uploadCategory)
      );

      const newProjects = await Promise.all(uploadPromises);
      const successfulUploads = newProjects.filter(project => project !== undefined);
      
      if (successfulUploads.length > 0) {
        await loadProjects(true);
        alert(`Successfully uploaded ${successfulUploads.length} project(s)!`);
      }
      
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  // Handle delete project
  const handleDeleteProject = async (projectId) => {
    try {
      await backendService.deleteProject(projectId);
      await loadProjects(true);
      setShowDeleteConfirm(null);
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete project: ' + error.message);
    }
  };

  const triggerFileInput = () => {
    if (!isOwner) return;
    fileInputRef.current?.click();
  };

  // Get project to delete
  const projectToDelete = showDeleteConfirm ? projects.find(p => p.id === showDeleteConfirm) : null;

  return (
    <>
      <Hero />
      
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
                <span className="owner-info">Full management access (Upload & Delete)</span>
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

      {/* Debug Panel (Owner Only) */}
      {isOwner && debugInfo && (
        <div className="debug-panel">
          <div className="container">
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
                  <button onClick={() => loadProjects(true)} className="debug-btn">
                    🔄 Force Reload
                  </button>
                </div>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Upload Section (Owner Only) */}
      {isOwner && (
        <div className="upload-section">
          <div className="container">
            <div className="upload-card">
              <div className="upload-header">
                <h3>📁 Add New Projects</h3>
                <p>Upload your latest work to showcase on the homepage slideshow</p>
              </div>
              
              <div className="upload-controls">
                <div className="category-selector">
                  <label>Select Category:</label>
                  <div className="category-tabs">
                    {categories.map(category => (
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
                    className="btn-primary upload-btn"
                    onClick={triggerFileInput}
                    disabled={isUploading}
                  >
                    {isUploading ? '⏳ Uploading...' : '📤 Upload Files'}
                  </button>
                  <p className="upload-note">Supported formats: JPG, PNG, GIF, MP4 (Max 10MB)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Width Portfolio Slideshow with Delete Support */}
      {!isLoading && projects.length > 0 && (
        <PortfolioSlideshow 
          projects={projects} 
          autoPlay={true} 
          interval={5000}
          isOwner={isOwner}
          onDeleteProject={handleDeleteProject}
        />
      )}

      {isLoading && (
        <div className="loading-slideshow">
          <div className="loading-spinner"></div>
          <p>Loading portfolio...</p>
        </div>
      )}

      <section className="featured-section">
        <div className="container">
          <LazyReveal threshold={0.2}>
            <h2 className="section-title">Welcome to RAEMOND DVJ</h2>
            <p className="section-subtitle">
              Your premier destination for creative design, gaming experiences, and gadgets
            </p>
          </LazyReveal>
          
          <div className="featured-grid">
            <LazyReveal className="fade-up" threshold={0.3} delay={100}>
              <div className="featured-card">
                <div className="featured-icon">🎨</div>
                <h3>Graphic Design</h3>
                <p>Professional graphic design services for your brand</p>
                {isOwner && <span className="owner-tag">Add Graphic Design Projects</span>}
              </div>
            </LazyReveal>
            
            <LazyReveal className="fade-up" threshold={0.3} delay={200}>
              <div className="featured-card">
                <div className="featured-icon">🎮</div>
                <h3>Gaming</h3>
                <p>Immersive gaming experiences and content</p>
                {isOwner && <span className="owner-tag">Add Gaming Projects</span>}
              </div>
            </LazyReveal>
            
            <LazyReveal className="fade-up" threshold={0.3} delay={300}>
              <div className="featured-card">
                <div className="featured-icon">📱</div>
                <h3>Gadgets</h3>
                <p>Latest gadgets and tech reviews</p>
                {isOwner && <span className="owner-tag">Add Gadget Reviews</span>}
              </div>
            </LazyReveal>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && projectToDelete && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <h3>Delete Project</h3>
              <button className="delete-modal-close" onClick={() => setShowDeleteConfirm(null)}>×</button>
            </div>
            <div className="delete-modal-body">
              <div className="delete-warning-icon">⚠️</div>
              <p>Are you sure you want to delete "<strong>{projectToDelete.title}</strong>"?</p>
              <p className="delete-warning">This action cannot be undone. The project will be permanently removed from the portfolio and storage.</p>
              {projectToDelete.localOnly && (
                <p className="local-warning">📱 This is a local-only project. It will be removed from your browser storage.</p>
              )}
            </div>
            <div className="delete-modal-footer">
              <button className="cancel-delete-btn" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={() => handleDeleteProject(projectToDelete.id)}>
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
                <p className="demo-hint">Demo password: owner123</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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

        /* Debug Panel */
        .debug-panel {
          background: #1e293b;
          color: white;
          padding: 12px 0;
          font-size: 0.85rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .debug-panel details {
          cursor: pointer;
        }

        .debug-panel summary {
          font-weight: 600;
          color: #94a3b8;
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

        /* Upload Section */
        .upload-section {
          padding: 40px 0;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .upload-card {
          background: white;
          padding: 30px;
          border-radius: 20px;
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
          margin: 0 0 20px 0;
        }

        .category-selector {
          margin-bottom: 20px;
        }

        .category-selector label {
          display: block;
          color: #374151;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .category-tabs {
          display: flex;
          gap: 10px;
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

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 28px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .upload-note {
          margin-top: 12px;
          color: #94a3b8;
          font-size: 0.8rem;
        }

        /* Loading State */
        .loading-slideshow {
          width: 100%;
          height: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Featured Section */
        .featured-section {
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
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .featured-card {
          background: white;
          padding: 40px 30px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
          position: relative;
        }

        .featured-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .featured-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .featured-card h3 {
          font-size: 1.5rem;
          margin-bottom: 12px;
          color: #1e293b;
        }

        .featured-card p {
          color: #64748b;
          line-height: 1.6;
        }

        .owner-tag {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.7rem;
          font-weight: 500;
          white-space: nowrap;
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
          backdrop-filter: blur(10px);
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

        .login-confirm {
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

        .login-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .login-cancel {
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

        .login-cancel:hover {
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

        .demo-hint {
          margin-top: 8px;
          color: #667eea;
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
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

          .category-tabs {
            flex-direction: column;
          }

          .tab {
            justify-content: center;
          }

          .featured-section {
            padding: 60px 0;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .featured-grid {
            grid-template-columns: 1fr;
          }

          .login-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};

export default HomePage;
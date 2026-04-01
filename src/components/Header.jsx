// src/components/Header.jsx - Fixed sidebar navigation with debugging
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import servicesPic from '../assets/images/WhatsApp Image 2025-10-07 at 18.22.34_d752a1a7.jpg';
import logoImage from '../assets/images/WhatsApp Image 2025-10-07 at 18.22.31_497db946.jpg';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/services', label: 'Services', icon: '🎨' },
    { path: '/portfolio', label: 'Portfolio', icon: '📁' },
    { path: '/about', label: 'About', icon: '👤' },
    { path: '/contact', label: 'Contact', icon: '📞' },
    { path: '/reviews', label: 'Reviews', icon: '⭐' }
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && headerRef.current && !headerRef.current.contains(event.target)) {
        // Don't close if clicking inside sidebar
        const sidebar = document.querySelector('.mobile-sidebar');
        if (sidebar && sidebar.contains(event.target)) {
          return;
        }
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  // Optimized scroll handler
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation and close menu
  const handleNavigation = (path) => {
    console.log('🔍 Navigating to:', path);
    console.log('📍 Current path:', location.pathname);
    
    // Close menu first
    setMenuOpen(false);
    document.body.style.overflow = 'unset';
    
    // Use setTimeout to ensure menu closes before navigation
    setTimeout(() => {
      navigate(path);
      console.log('✅ Navigation completed to:', path);
    }, 50);
  };

  return (
    <>
      <header 
        className={`modern-header ${scrolled ? 'scrolled' : ''}`}
        ref={headerRef}
      >
        <div className="header-background" aria-hidden="true"></div>
        
        <div className="container header-container">
          {/* Logo Section */}
          <div className="logo-section" onClick={() => handleNavigation('/')}>
            <div className="logo-images">
              <div className="logo-wrapper">
                <img 
                  src={logoImage}
                  alt="RAEMOND Brand Logo" 
                  className="logo-img main-logo"
                  loading="eager"
                  width="auto"
                  height="48"
                  decoding="async"
                />
              </div>
              <div className="logo-wrapper">
                <img 
                  src={servicesPic} 
                  alt="RAEMOND Services" 
                  className="logo-img services-logo"
                  loading="eager"
                  width="auto"
                  height="48"
                  decoding="async"
                />
              </div>
            </div>
            
            <div className="logo-text">
              <h1 className="brand-name">
                <span className="brand-gradient">RAEMOND DVJ</span>
              </h1>
              <div className="tagline" role="text">
                <span className="tagline-word">GRAPHIQS</span>
                <span className="tagline-separator">•</span>
                <span className="tagline-word">GAMES</span>
                <span className="tagline-separator">•</span>
                <span className="tagline-word">GADGETS</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            <ul>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className={`mobile-menu-btn ${menuOpen ? 'active' : ''}`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      <div className={`mobile-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-images">
              <img src={logoImage} alt="Logo" className="sidebar-logo-img" />
              <img src={servicesPic} alt="Services" className="sidebar-logo-img" />
            </div>
            <h3>RAEMOND DVJ</h3>
            <p>Graphiqs • Games • Gadgets</p>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <button 
                  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                  <span className="sidebar-arrow">→</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-contact">
            <p>📞 +256 757660015</p>
            <p>📧 lukwagorj77@gmail.com</p>
          </div>
          <div className="sidebar-social">
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="YouTube">▶️</a>
            <a href="#" aria-label="Facebook">📘</a>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className={`sidebar-overlay ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(false)}></div>

      <style jsx>{`
        /* CSS Variables */
        :root {
          --primary-color: #a303e8;
          --secondary-color: #4ecdc4;
          --dark-bg: rgba(26, 26, 26, 0.98);
          --darker-bg: rgba(10, 10, 10, 0.98);
          --text-color: #fff;
          --transition: 0.3s ease;
          --border-radius: 6px;
          --header-height: 80px;
        }

        .modern-header {
          background: linear-gradient(135deg, var(--dark-bg) 0%, rgba(45, 45, 45, 0.98) 100%);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          border-bottom: 1px solid rgba(100, 9, 218, 0.4);
          transition: all var(--transition);
        }

        .modern-header.scrolled {
          padding: 0.7rem 0;
          background: var(--darker-bg);
          border-bottom-color: rgba(100, 9, 218, 0.6);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .header-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 10% 50%, rgba(100, 9, 218, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 90% 50%, rgba(133, 10, 222, 0.15) 0%, transparent 40%);
          opacity: 0.8;
          pointer-events: none;
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          position: relative;
          z-index: 2;
        }

        /* Logo Section */
        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
          cursor: pointer;
        }

        .logo-images {
          display: flex;
          gap: 0.6rem;
        }

        .logo-wrapper {
          position: relative;
          border-radius: 8px;
        }

        .logo-img {
          height: 48px;
          width: auto;
          border-radius: var(--border-radius);
          object-fit: cover;
          display: block;
        }

        .main-logo {
          border: 2px solid rgba(133, 10, 222, 0.7);
          box-shadow: 0 2px 12px rgba(133, 10, 222, 0.3);
        }

        .services-logo {
          border: 2px solid rgba(78, 205, 196, 0.7);
          box-shadow: 0 2px 12px rgba(78, 205, 196, 0.3);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .brand-name {
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0;
          line-height: 1;
        }

        .brand-gradient {
          background: linear-gradient(135deg, #fff 0%, var(--primary-color) 50%, var(--secondary-color) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tagline {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .tagline-word {
          color: var(--text-color);
        }

        .tagline-separator {
          color: #7e0dd5;
          font-weight: bold;
        }

        /* Desktop Navigation */
        .desktop-nav ul {
          display: flex;
          list-style: none;
          gap: 0.5rem;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          color: var(--text-color);
          text-decoration: none;
          font-weight: 500;
          padding: 0.6rem 1.2rem;
          border-radius: var(--border-radius);
          background: rgba(255, 255, 255, 0.05);
          transition: all var(--transition);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link:hover,
        .nav-link.active {
          background: rgba(163, 3, 232, 0.4);
          box-shadow: 0 2px 12px rgba(163, 3, 232, 0.5);
        }

        .nav-icon {
          font-size: 1.1rem;
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          cursor: pointer;
          padding: 0.6rem;
          gap: 3px;
          transition: all var(--transition);
          min-width: 44px;
          min-height: 44px;
        }

        .mobile-menu-btn span {
          width: 20px;
          height: 2px;
          background: var(--text-color);
          transition: all var(--transition);
          border-radius: 1px;
        }

        .mobile-menu-btn.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
          background: var(--primary-color);
        }

        .mobile-menu-btn.active span:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-btn.active span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
          background: var(--primary-color);
        }

        /* Mobile Sidebar */
        .mobile-sidebar {
          position: fixed;
          top: 0;
          right: -100%;
          width: 85%;
          max-width: 320px;
          height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b2e 100%);
          z-index: 2000;
          transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          box-shadow: -5px 0 30px rgba(0, 0, 0, 0.5);
        }

        .mobile-sidebar.open {
          right: 0;
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .sidebar-logo {
          text-align: center;
          flex: 1;
        }

        .sidebar-logo-images {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .sidebar-logo-img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
        }

        .sidebar-logo h3 {
          color: white;
          margin: 0 0 0.5rem 0;
          font-size: 1.2rem;
        }

        .sidebar-logo p {
          color: #94a3b8;
          font-size: 0.8rem;
          margin: 0;
        }

        .sidebar-close {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          font-size: 1.5rem;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .sidebar-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg);
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
          overflow-y: auto;
        }

        .sidebar-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          cursor: pointer;
          font-size: 1rem;
          font-family: inherit;
          text-align: left;
        }

        .sidebar-link:hover {
          background: rgba(102, 126, 234, 0.1);
          color: white;
          padding-left: 2rem;
        }

        .sidebar-link.active {
          background: linear-gradient(90deg, rgba(102, 126, 234, 0.2), transparent);
          color: #8B5CF6;
          border-left: 3px solid #8B5CF6;
        }

        .sidebar-icon {
          font-size: 1.2rem;
          width: 30px;
        }

        .sidebar-label {
          flex: 1;
          font-weight: 500;
          text-align: left;
        }

        .sidebar-arrow {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .sidebar-link:hover .sidebar-arrow {
          opacity: 1;
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-contact p {
          color: #94a3b8;
          font-size: 0.85rem;
          margin: 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sidebar-social {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          justify-content: center;
        }

        .sidebar-social a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 1.2rem;
          transition: color 0.3s ease;
        }

        .sidebar-social a:hover {
          color: #8B5CF6;
        }

        /* Overlay */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }

          .mobile-menu-btn {
            display: flex;
          }

          .logo-images {
            gap: 0.4rem;
          }

          .logo-img {
            height: 38px;
          }

          .brand-name {
            font-size: 1.3rem;
          }

          .tagline {
            font-size: 0.6rem;
          }
        }

        @media (max-width: 480px) {
          .logo-images {
            display: none;
          }

          .brand-name {
            font-size: 1.4rem;
          }

          .tagline {
            font-size: 0.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
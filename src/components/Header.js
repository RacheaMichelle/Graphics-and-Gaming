import React, { useState, useEffect, useCallback, useRef } from 'react';
import servicesPic from '../assets/images/WhatsApp Image 2025-10-07 at 18.22.34_d752a1a7.jpg';
import logoImage from '../assets/images/WhatsApp Image 2025-10-07 at 18.22.31_497db946.jpg';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const headerRef = useRef(null);
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  // Optimized scroll handler with debouncing
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

    // Use passive scroll listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Memoized scroll function
  const scrollToSection = useCallback((sectionId) => {
    setMenuOpen(false);
    setActiveSection(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = headerRef.current?.offsetHeight || 80;
      const offsetTop = element.offsetTop - headerHeight;
      
      // Use instant scroll for better performance
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: offsetTop,
          behavior: 'instant'
        });
      } else {
        // Fallback for older browsers
        window.scrollTo(0, offsetTop);
      }
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e, sectionId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToSection(sectionId);
    }
  }, [scrollToSection]);

  return (
    <header 
      className={`modern-header ${scrolled ? 'scrolled' : ''}`}
      ref={headerRef}
    >
      <div className="header-background" aria-hidden="true"></div>
      
      <div className="container header-container">
        {/* Logo Section */}
        <div className="logo-section">
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
                alt="RAEMOND Services - Graphic design and gaming preview" 
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
              <span className="tagline-separator" aria-hidden="true">•</span>
              <span className="tagline-word">GAMES</span>
              <span className="tagline-separator" aria-hidden="true">•</span>
              <span className="tagline-word">GADGETS</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav 
          className={`main-nav ${menuOpen ? 'nav-open' : ''}`}
          aria-label="Main Navigation"
        >
          <ul role="menubar">
            {navItems.map((item) => (
              <li key={item.id} role="none">
                <button 
                  onClick={() => scrollToSection(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  role="menuitem"
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  tabIndex={menuOpen ? 0 : undefined}
                >
                  {item.label}
                </button>
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
          aria-controls="main-nav"
          type="button"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <style jsx>{`
        /* CSS Variables for consistent theming */
        :root {
          --primary-color: #a303e8;
          --secondary-color: #4ecdc4;
          --dark-bg: rgba(26, 26, 26, 0.98);
          --darker-bg: rgba(10, 10, 10, 0.98);
          --text-color: #fff;
          --transition-fast: 0.1s ease;
          --border-radius: 6px;
          --header-height: 80px;
        }

        .modern-header {
          background: linear-gradient(135deg, 
            var(--dark-bg) 0%, 
            rgba(45, 45, 45, 0.98) 100%);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          border-bottom: 1px solid rgba(100, 9, 218, 0.4);
          transition: all var(--transition-fast);
          will-change: transform;
          contain: layout style paint;
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
          margin-right: auto;
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
          background-size: 200% auto;
        }

        .tagline {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 1px;
          line-height: 1.2;
        }

        .tagline-word {
          color: var(--text-color);
        }

        .tagline-separator {
          color: #7e0dd5;
          font-weight: bold;
        }

        /* Navigation */
        .main-nav ul {
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
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          border: none;
          font-family: inherit;
          font-size: inherit;
          transition: all var(--transition-fast);
          position: relative;
          min-width: 44px;
          min-height: 44px;
        }

        .nav-link:hover,
        .nav-link:focus {
          color: var(--text-color);
          background: rgba(163, 3, 232, 0.3);
          border-color: rgba(163, 3, 232, 0.6);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(163, 3, 232, 0.4);
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }

        .nav-link.active {
          background: rgba(163, 3, 232, 0.4);
          border-color: rgba(163, 3, 232, 0.8);
          box-shadow: 0 2px 12px rgba(163, 3, 232, 0.5);
          color: var(--text-color);
        }

        .nav-link:active {
          transform: translateY(0px);
          transition: none;
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
          transition: all var(--transition-fast);
          min-width: 44px;
          min-height: 44px;
        }

        .mobile-menu-btn:hover,
        .mobile-menu-btn:focus {
          background: rgba(163, 3, 232, 0.2);
          border-color: rgba(163, 3, 232, 0.4);
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }

        .mobile-menu-btn span {
          width: 20px;
          height: 2px;
          background: var(--text-color);
          transition: all var(--transition-fast);
          border-radius: 1px;
        }

        .mobile-menu-btn.active {
          background: rgba(163, 3, 232, 0.3);
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

        /* Responsive Design */
        @media (max-width: 1024px) {
          .header-container {
            padding: 0 1.2rem;
          }

          .brand-name {
            font-size: 1.5rem;
          }

          .tagline {
            font-size: 0.65rem;
          }

          .logo-img {
            height: 42px;
          }

          .nav-link {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 0 1rem;
          }

          .mobile-menu-btn {
            display: flex;
          }

          .main-nav {
            position: fixed;
            top: var(--header-height);
            left: 0;
            right: 0;
            background: var(--darker-bg);
            backdrop-filter: blur(20px);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all var(--transition-fast);
            border-top: 1px solid rgba(100, 9, 218, 0.4);
            padding: 1rem;
            max-height: calc(100vh - var(--header-height));
            overflow-y: auto;
            z-index: 999;
          }

          .main-nav.nav-open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .main-nav ul {
            flex-direction: column;
            gap: 0.5rem;
          }

          .nav-link {
            text-align: center;
            padding: 0.8rem;
            border-radius: var(--border-radius);
            background: rgba(163, 3, 232, 0.1);
            border: 1px solid rgba(163, 3, 232, 0.3);
            width: 100%;
          }

          .logo-text .brand-name {
            font-size: 1.3rem;
          }

          .logo-text .tagline {
            font-size: 0.6rem;
          }
        }

        @media (max-width: 640px) {
          .logo-section {
            gap: 0.8rem;
          }

          .logo-images {
            gap: 0.4rem;
          }

          .logo-img {
            height: 38px;
          }

          .brand-name {
            font-size: 1.2rem;
            letter-spacing: 1px;
          }

          .tagline {
            font-size: 0.55rem;
            gap: 0.3rem;
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

          .header-container {
            padding: 0 0.8rem;
          }
        }

        /* Accessibility and Performance */
        @media (prefers-reduced-motion: reduce) {
          .modern-header,
          .nav-link,
          .mobile-menu-btn,
          .main-nav {
            transition: none;
          }
          
          .nav-link:hover,
          .nav-link:focus {
            transform: none;
          }
          
          .brand-gradient {
            animation: none;
          }
        }

        /* Focus styles for keyboard navigation */
        .nav-link:focus-visible {
          outline: 3px solid var(--primary-color);
          outline-offset: 3px;
        }

        .mobile-menu-btn:focus-visible {
          outline: 3px solid var(--primary-color);
          outline-offset: 3px;
        }

        /* Print styles */
        @media print {
          .modern-header {
            position: static;
            background: white;
            border-bottom: 1px solid #ccc;
          }
          
          .header-background,
          .mobile-menu-btn {
            display: none;
          }
          
          .brand-gradient {
            -webkit-text-fill-color: black;
            background: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;

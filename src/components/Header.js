import React, { useState, useEffect } from 'react';

import servicesPic from '../assets/images/WhatsApp Image 2025-10-07 at 18.22.34_d752a1a7.jpg';
import logoImage from '../assets/images/WhatsApp Image 2025-10-07 at 18.22.31_497db946.jpg';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setMenuOpen(false);
    setActiveSection(sectionId);
    
    // Instant navigation - no smooth scroll
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed header
      window.scrollTo({
        top: offsetTop,
        behavior: 'instant' // Changed from 'smooth' to 'instant'
      });
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className={`modern-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-background"></div>
      
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
              />
            </div>
            <div className="logo-wrapper">
              <img 
                src={servicesPic} 
                alt="RAEMOND Services" 
                className="logo-img services-logo"
                loading="eager"
              />
            </div>
          </div>
          
          <div className="logo-text">
            <span className="brand-name">
              <span className="brand-gradient">RAEMOND DVJ GRAPHIQS</span>
            </span>
            <span className="tagline">
              <span className="tagline-word">GRAPHICS</span>
              <span className="tagline-separator">•</span>
              <span className="tagline-word">GAMES</span>
              <span className="tagline-separator">•</span>
              <span className="tagline-word">GADGETS</span>
            </span>
          </div>
        </div>

        {/* Navigation - Optimized for Speed */}
        <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`}>
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => scrollToSection(item.id)}
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
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
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <style jsx>{`
        .modern-header {
          background: linear-gradient(135deg, 
            rgba(26, 26, 26, 0.98) 0%, 
            rgba(45, 45, 45, 0.98) 100%);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          border-bottom: 1px solid rgba(100, 9, 218, 0.4);
          transition: all 0.2s ease;
        }

        .modern-header.scrolled {
          padding: 0.7rem 0;
          background: rgba(10, 10, 10, 0.98);
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
          border-radius: 6px;
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
        }

        .brand-gradient {
          background: linear-gradient(135deg, #fff 0%, #a303e8 50%, #4ecdc4 100%);
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
          color: #fff;
        }

        .tagline-separator {
          color: #7e0dd5;
          font-weight: bold;
        }

        /* ULTRA-FAST NAVIGATION */
        .main-nav ul {
          display: flex;
          list-style: none;
          gap: 0.5rem;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          border: none;
          font-family: inherit;
          font-size: inherit;
          transition: all 0.1s ease; /* Reduced from 0.3s to 0.1s */
          position: relative;
        }

        /* Instant hover state - no transition delay */
        .nav-link:hover {
          color: #fff;
          background: rgba(163, 3, 232, 0.3);
          border-color: rgba(163, 3, 232, 0.6);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(163, 3, 232, 0.4);
        }

        .nav-link.active {
          background: rgba(163, 3, 232, 0.4);
          border-color: rgba(163, 3, 232, 0.8);
          box-shadow: 0 2px 12px rgba(163, 3, 232, 0.5);
          color: #fff;
        }

        /* Remove all complex animations for performance */
        .nav-link:active {
          transform: translateY(0px);
          transition: none; /* No transition on active state */
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          cursor: pointer;
          padding: 0.6rem;
          gap: 3px;
          transition: all 0.1s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(163, 3, 232, 0.2);
          border-color: rgba(163, 3, 232, 0.4);
        }

        .mobile-menu-btn span {
          width: 20px;
          height: 2px;
          background: #fff;
          transition: all 0.1s ease;
          border-radius: 1px;
        }

        .mobile-menu-btn.active {
          background: rgba(163, 3, 232, 0.3);
        }

        .mobile-menu-btn.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
          background: #a303e8;
        }

        .mobile-menu-btn.active span:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-btn.active span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
          background: #a303e8;
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
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(10, 10, 10, 0.98);
            backdrop-filter: blur(20px);
            transform: translateY(-10px);
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            border-top: 1px solid rgba(100, 9, 218, 0.4);
          }

          .main-nav.nav-open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .main-nav ul {
            flex-direction: column;
            padding: 1rem;
            gap: 0.5rem;
          }

          .nav-link {
            text-align: center;
            padding: 0.8rem;
            border-radius: 6px;
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

        /* Performance optimizations */
        .modern-header {
          will-change: transform;
          contain: layout style paint;
        }

        /* Disable animations for users who prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .modern-header,
          .nav-link,
          .mobile-menu-btn {
            transition: none;
          }
          
          .nav-link:hover {
            transform: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;

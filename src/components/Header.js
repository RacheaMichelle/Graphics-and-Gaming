import React, { useState } from 'react';

import servicesPic from '../assets/images/WhatsApp Image 2025-10-07 at 18.22.34_d752a1a7.jpg';
import logoImage from '../assets/images/WhatsApp Image 2025-10-07 at 18.22.31_497db946.jpg';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <header className="modern-header">
      <div className="container header-container">
        {/* Logo Section with Images */}
        <div className="logo-section">
          <div className="logo-images">
            <img 
              src={logoImage}
              alt="RAEMOND Brand Logo" 
              className="logo-img main-logo"
            />
            <img 
              src={servicesPic} 
              alt="RAEMOND Services" 
              className="logo-img services-logo"
            />
          </div>
          <div className="logo-text">
            <span className="brand-name">RAEMOND</span>
            <span className="tagline">GRAPHICS.GAMES.GADGETS</span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${menuOpen ? 'active' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`}>
          <ul>
            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
            <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Services</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
          </ul>
        </nav>
      </div>

      <style jsx>{`
        .modern-header {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 1rem 0;
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          box-shadow: 0 2px 20px rgba(0,0,0,0.3);
          border-bottom: 2px solid #6409daff;
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-images {
          display: flex;
          gap: 0.5rem;
        }

        .logo-img {
          height: 50px;
          width: auto;
          border-radius: 8px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .logo-img:hover {
          transform: scale(1.05);
        }

        .main-logo {
          border: 2px solid #850adeff;
        }

        .services-logo {
          border: 2px solid #4ecdc4;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-size: 1.8rem;
          font-weight: bold;
          color: #fff;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .tagline {
          font-size: 0.7rem;
          color: #950fe9ff;
          letter-spacing: 1px;
          font-weight: 500;
        }

        .main-nav ul {
          display: flex;
          list-style: none;
          gap: 2rem;
          margin: 0;
          padding: 0;
        }

        .main-nav a {
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          transition: all 0.3s ease;
          position: relative;
        }

        .main-nav a:hover {
          color: #a303e8ff;
          background: rgba(255, 107, 53, 0.1);
        }

        .main-nav a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          width: 0;
          height: 2px;
          background: #7e0dd5ff;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .main-nav a:hover::after {
          width: 80%;
        }

        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          gap: 4px;
        }

        .mobile-menu-btn span {
          width: 25px;
          height: 3px;
          background: #fff;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .mobile-menu-btn.active span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }

        .mobile-menu-btn.active span:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-btn.active span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
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
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }

          .main-nav.nav-open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .main-nav ul {
            flex-direction: column;
            padding: 2rem;
            gap: 1rem;
          }

          .main-nav a {
            display: block;
            padding: 1rem;
            text-align: center;
            border: 1px solid rgba(255, 107, 53, 0.3);
            border-radius: 10px;
          }

          .logo-text .brand-name {
            font-size: 1.4rem;
          }

          .logo-text .tagline {
            font-size: 0.6rem;
          }

          .logo-img {
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .logo-section {
            gap: 0.5rem;
          }

          .logo-images {
            gap: 0.3rem;
          }

          .logo-img {
            height: 35px;
          }

          .brand-name {
            font-size: 1.2rem;
          }

          .tagline {
            font-size: 0.5rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
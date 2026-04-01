// src/components/Footer.jsx - Updated with working newsletter
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import profilePic from '../assets/images/WhatsApp Image 2025-10-07 at 18.22.34_d752a1a7.jpg';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Social media links
  const socialLinks = {
    instagram: "https://instagram.com/raemond_dvj_graphiqs",
    youtube: "https://youtube.com/@RaemondDvjGraphiqs",
    facebook: "#",
    twitter: "#",
    tiktok: "#"
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus(null), 3000);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus('invalid');
      setTimeout(() => setNewsletterStatus(null), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you can integrate with your email service (Mailchimp, SendGrid, etc.)
      // For now, we'll simulate a successful subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage for demo
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (!subscribers.includes(newsletterEmail)) {
        subscribers.push(newsletterEmail);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      }
      
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus(null), 3000);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer>
      <div className="container">
        {/* Decorative Background Elements */}
        <div className="background-elements">
          <div className="bg-circle circle-1"></div>
          <div className="bg-circle circle-2"></div>
          <div className="bg-circle circle-3"></div>
        </div>

        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Column with Profile */}
          <div className="footer-column brand-column">
            <div className="brand-card">
              <div className="profile-section">
                <div className="profile-container">
                  <div className="profile-image-wrapper">
                    <img 
                      src={profilePic} 
                      alt="RAEMOND DVJ - Creative Director" 
                      className="profile-image"
                      onError={(e) => {
                        console.log('Profile image failed to load');
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="profile-fallback">
                      <span>RD</span>
                    </div>
                    <div className="profile-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="profile-info">
                    <h3 className="brand-name">RAEMOND DVJ</h3>
                    <span className="brand-tagline">GRAPHIQS</span>
                    <p className="brand-subtitle">Creative Director & Designer</p>
                  </div>
                </div>
                
                <p className="brand-description">
                  Transforming visions into stunning visual experiences through creative design, 
                  motion graphics, and innovative digital solutions.
                </p>
              </div>

              <div className="contact-section">
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Email</span>
                    <span className="contact-value">lukwagorj77@gmail.com</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 15.5C18.8 15.5 17.5 15.3 16.4 14.9C16.3 14.9 16.2 14.9 16.1 14.9C15.8 14.9 15.6 15 15.4 15.2L13.2 17.4C10.4 15.9 8 13.6 6.6 10.8L8.8 8.6C9.1 8.3 9.2 7.9 9 7.6C8.7 6.5 8.5 5.2 8.5 4C8.5 3.4 8.1 3 7.5 3H4C3.4 3 3 3.4 3 4C3 13.4 10.6 21 20 21C20.6 21 21 20.6 21 20V16.5C21 15.9 20.6 15.5 20 15.5Z"/>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Call Us</span>
                    <span className="contact-value">+256 757660015</span>
                    <span className="contact-value">+256 763098162</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Location</span>
                    <span className="contact-value">Nansana Municipality Kampala, Uganda</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div className="footer-column">
            <div className="section-header">
              <h4>Our Services</h4>
              <div className="header-line"></div>
            </div>
            <ul className="services-list">
              <li>
                <div className="service-icon">🎬</div>
                <Link to="/services">Motion Picture Production</Link>
              </li>
              <li>
                <div className="service-icon">🎨</div>
                <Link to="/services">Logo & Brand Design</Link>
              </li>
              <li>
                <div className="service-icon">📁</div>
                <Link to="/services">Banners & Stickers</Link>
              </li>
              <li>
                <div className="service-icon">📄</div>
                <Link to="/services">Flyer & Poster Design</Link>
              </li>
              <li>
                <div className="service-icon">📱</div>
                <Link to="/services">Electronic Gadgets</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="footer-column">
            <div className="section-header">
              <h4>Quick Links</h4>
              <div className="header-line"></div>
            </div>
            <ul className="links-list">
              <li>
                <div className="link-arrow">→</div>
                <Link to="/">Home</Link>
              </li>
              <li>
                <div className="link-arrow">→</div>
                <Link to="/about">About</Link>
              </li>
              <li>
                <div className="link-arrow">→</div>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <div className="link-arrow">→</div>
                <Link to="/portfolio">Portfolio</Link>
              </li>
              <li>
                <div className="link-arrow">→</div>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <div className="link-arrow">→</div>
                <Link to="/reviews">Reviews</Link>
              </li>
            </ul>
          </div>

          {/* Social Media Column - Updated with working newsletter */}
          <div className="footer-column">
            <div className="section-header">
              <h4>Connect With Us</h4>
              <div className="header-line"></div>
            </div>
            <p className="social-description">
              Follow our creative journey and stay updated with our latest projects and innovations.
            </p>
            
            <div className="social-grid">
              <a href={socialLinks.instagram} className="social-card instagram" target="_blank" rel="noopener noreferrer">
                <div className="social-icon">📷</div>
                <div className="social-info">
                  <span className="social-name">Instagram</span>
                  <span className="social-handle">@raemond_dvj_graphiqs</span>
                </div>
              </a>

              <a href={socialLinks.youtube} className="social-card youtube" target="_blank" rel="noopener noreferrer">
                <div className="social-icon">▶️</div>
                <div className="social-info">
                  <span className="social-name">YouTube</span>
                  <span className="social-handle">@RaemondDvjGraphiqs</span>
                </div>
              </a>

              <a href={socialLinks.facebook} className="social-card facebook" target="_blank" rel="noopener noreferrer">
                <div className="social-icon">📘</div>
                <div className="social-info">
                  <span className="social-name">Facebook</span>
                  <span className="social-handle">Raemond DVJ</span>
                </div>
              </a>
            </div>

            {/* Updated Newsletter Section */}
            <div className="newsletter-section">
              <h5>Stay Updated</h5>
              <p>Get the latest creative insights and project updates</p>
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? '...' : '→'}
                </button>
              </form>
              
              {/* Status Messages */}
              {newsletterStatus === 'success' && (
                <div className="newsletter-success">
                  ✓ Subscribed successfully!
                </div>
              )}
              {newsletterStatus === 'error' && (
                <div className="newsletter-error">
                  ✗ Please enter an email address
                </div>
              )}
              {newsletterStatus === 'invalid' && (
                <div className="newsletter-error">
                  ✗ Please enter a valid email address
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="copyright-section">
          <div className="copyright-divider"></div>
          <div className="copyright-content">
            <div className="copyright-text">
              <p>&copy; 2024 <strong>RAEMOND DVJ GRAPHIQS</strong>. All rights reserved.</p>
              <span className="copyright-tag">Crafting Digital Excellence</span>
            </div>
            <div className="copyright-links">
              <a href="#">Privacy Policy</a>
              <span className="divider">•</span>
              <a href="#">Terms of Service</a>
              <span className="divider">•</span>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        footer {
          background: linear-gradient(135deg, #231f4f 0%, #1e293b 50%, #334155 100%);
          color: white;
          padding: 80px 0 30px;
          margin-top: auto;
          position: relative;
          overflow: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 2;
        }

        /* Background Elements */
        .background-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: -150px;
          right: -100px;
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          bottom: 100px;
          left: -50px;
        }

        .circle-3 {
          width: 150px;
          height: 150px;
          bottom: -50px;
          right: 20%;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 50px;
          margin-bottom: 60px;
        }

        /* Brand Column */
        .brand-column {
          position: relative;
        }

        .brand-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          height: fit-content;
        }

        .profile-section {
          margin-bottom: 30px;
        }

        .profile-container {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .profile-image-wrapper {
          position: relative;
          width: 100px;
          height: 100px;
          flex-shrink: 0;
        }

        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid transparent;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box;
          padding: 3px;
        }

        .profile-fallback {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: none;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.5rem;
        }

        .profile-badge {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 24px;
          height: 24px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border: 2px solid #1e293b;
        }

        .profile-info {
          flex: 1;
        }

        .brand-name {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 4px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-tagline {
          color: #94a3b8;
          font-weight: 600;
          font-size: 1.1rem;
          font-style: italic;
          display: block;
          margin-bottom: 4px;
        }

        .brand-subtitle {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0;
        }

        .brand-description {
          color: #cbd5e1;
          line-height: 1.6;
          font-size: 0.95rem;
          margin: 0;
        }

        .contact-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .contact-icon {
          width: 36px;
          height: 36px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667eea;
          flex-shrink: 0;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .contact-label {
          color: #94a3b8;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .contact-value {
          color: #e2e8f0;
          font-size: 0.9rem;
        }

        /* Section Headers */
        .section-header {
          margin-bottom: 25px;
        }

        .section-header h4 {
          color: white;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .header-line {
          width: 40px;
          height: 3px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
        }

        /* Lists */
        .services-list,
        .links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .services-list li,
        .links-list li {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .service-icon,
        .link-arrow {
          width: 32px;
          height: 32px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667eea;
          flex-shrink: 0;
        }

        .services-list a,
        .links-list a {
          color: #cbd5e1;
          text-decoration: none;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          flex: 1;
        }

        .services-list a:hover,
        .links-list a:hover {
          color: #667eea;
          transform: translateX(4px);
        }

        /* Social Media */
        .social-description {
          color: #94a3b8;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 25px;
        }

        .social-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 30px;
        }

        .social-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .social-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(102, 126, 234, 0.3);
          transform: translateY(-2px);
        }

        .social-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        .social-card.instagram .social-icon {
          background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D);
        }

        .social-card.youtube .social-icon {
          background: #FF0000;
        }

        .social-card.facebook .social-icon {
          background: #1877F2;
        }

        .social-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .social-name {
          color: white;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .social-handle {
          color: #94a3b8;
          font-size: 0.85rem;
        }

        /* Newsletter Section - Updated */
        .newsletter-section {
          background: rgba(255, 255, 255, 0.03);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .newsletter-section h5 {
          color: white;
          font-size: 1.1rem;
          margin-bottom: 8px;
        }

        .newsletter-section p {
          color: #94a3b8;
          font-size: 0.85rem;
          margin-bottom: 15px;
        }

        .newsletter-form {
          display: flex;
          gap: 8px;
        }

        .newsletter-form input {
          flex: 1;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 0.9rem;
        }

        .newsletter-form input::placeholder {
          color: #94a3b8;
        }

        .newsletter-form input:focus {
          outline: none;
          border-color: #667eea;
        }

        .newsletter-form button {
          padding: 12px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }

        .newsletter-form button:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .newsletter-form button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .newsletter-success {
          margin-top: 10px;
          padding: 8px;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 6px;
          color: #10b981;
          font-size: 0.8rem;
          text-align: center;
          animation: fadeIn 0.3s ease;
        }

        .newsletter-error {
          margin-top: 10px;
          padding: 8px;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 6px;
          color: #ef4444;
          font-size: 0.8rem;
          text-align: center;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Copyright Section */
        .copyright-section {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 30px;
        }

        .copyright-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #667eea 50%, transparent 100%);
          margin-bottom: 20px;
        }

        .copyright-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .copyright-text {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .copyright-text p {
          color: #94a3b8;
          font-size: 0.9rem;
          margin: 0;
        }

        .copyright-text strong {
          color: #e2e8f0;
        }

        .copyright-tag {
          color: #64748b;
          font-size: 0.8rem;
          font-style: italic;
        }

        .copyright-links {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .copyright-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.3s ease;
        }

        .copyright-links a:hover {
          color: #667eea;
        }

        .copyright-links .divider {
          color: #475569;
          font-size: 0.8rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }

          .brand-column {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 768px) {
          footer {
            padding: 60px 0 20px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .profile-container {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }

          .copyright-content {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }

          .copyright-text {
            flex-direction: column;
            gap: 8px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 16px;
          }

          .brand-card {
            padding: 20px;
          }

          .profile-image-wrapper {
            width: 80px;
            height: 80px;
          }

          .brand-name {
            font-size: 1.5rem;
          }

          .social-grid {
            gap: 10px;
          }

          .social-card {
            padding: 12px;
          }

          .social-icon {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
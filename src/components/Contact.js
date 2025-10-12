import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const EMAILJS_CONFIG = {
    serviceID: 'service_3jlgrdr',
    templateID: 'template_1c3qehd',  
    userID: 'aLaT1NmduWWe32HCB'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.service || !formData.message) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceID, 
        EMAILJS_CONFIG.templateID, 
        {
          from_name: formData.name,
          from_email: formData.email,
          service: formData.service,
          message: formData.message,
          timestamp: new Date().toLocaleString()
        }, 
        EMAILJS_CONFIG.userID
      );

      setSubmitStatus('success');
      setFormData({ name: '', email: '', service: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 5000);
      
    } catch (error) {
      console.error('Email failed to send:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      {/* Animated Background Elements with Graphic Design Images */}
      <div className="background-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
        <div className="animated-grid"></div>
        
        {/* Graphic Design Elements - CSS Shapes */}
        <div className="graphic-element graphic-1">
          <div className="paint-brush"></div>
        </div>
        <div className="graphic-element graphic-2">
          <div className="color-palette"></div>
        </div>
        <div className="graphic-element graphic-3">
          <div className="pencil-icon"></div>
        </div>
        <div className="graphic-element graphic-4">
          <div className="ruler-icon"></div>
        </div>
        <div className="graphic-element graphic-5">
          <div className="camera-icon"></div>
        </div>
        
        {/* Floating Design Elements */}
        <div className="design-element design-1">
          <div className="design-inner circle-gradient"></div>
        </div>
        <div className="design-element design-2">
          <div className="design-inner triangle-shape"></div>
        </div>
        <div className="design-element design-3">
          <div className="design-inner square-rotating"></div>
        </div>
        <div className="design-element design-4">
          <div className="design-inner hexagon-shape"></div>
        </div>
        <div className="design-element design-5">
          <div className="design-inner star-shape"></div>
        </div>

        {/* Additional Graphic Elements */}
        <div className="floating-dot dot-1"></div>
        <div className="floating-dot dot-2"></div>
        <div className="floating-dot dot-3"></div>
        <div className="floating-dot dot-4"></div>
        <div className="floating-dot dot-5"></div>
        <div className="floating-dot dot-6"></div>
      </div>

      <main className="main-content">
        <section id="contact" className="section">
          <div className="contact-content">
            {/* Header Section */}
            <div className="contact-header">
              <div className="section-badge">Get In Touch</div>
              <h1 className="contact-title">
                Let's Create Something
                <span className="gradient-text"> Amazing Together</span>
              </h1>
              <p className="contact-subtitle">
                Ready to bring your vision to life? Reach out and let's discuss how we can make your project unforgettable.
              </p>
            </div>

            <div className="contact-grid">
              {/* Contact Information */}
              <div className="contact-info-section">
                <div className="info-card">
                  <div className="card-header">
                    <div className="card-icon">💬</div>
                    <h3>Start Your Project</h3>
                  </div>
                  
                  <p className="card-description">
                    We're here to transform your ideas into reality. Whether it's photography, design, or creative services, let's make it happen.
                  </p>

                  <div className="contact-methods">
                    <div className="contact-method">
                      <div className="method-icon">
                        <span>📍</span>
                      </div>
                      <div className="method-details">
                        <h4>Our Location</h4>
                        <p>Nansana Municipality, Kampala, Uganda</p>
                      </div>
                    </div>

                    <div className="contact-method">
                      <div className="method-icon">
                        <span>📧</span>
                      </div>
                      <div className="method-details">
                        <h4>Email Us</h4>
                        <p>lukwagorj77@gmail.com</p>
                      </div>
                    </div>

                    <div className="contact-method">
                      <div className="method-icon">
                        <span>📞</span>
                      </div>
                      <div className="method-details">
                        <h4>Call Us</h4>
                        <p>0757660015 / 0763098162</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="quick-stats">
                    <div className="stat">
                      <div className="stat-number">50+</div>
                      <div className="stat-label">Projects Done</div>
                    </div>
                    <div className="stat">
                      <div className="stat-number">24h</div>
                      <div className="stat-label">Response Time</div>
                    </div>
                    <div className="stat">
                      <div className="stat-number">100%</div>
                      <div className="stat-label">Satisfaction</div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="social-section">
                    <h4>Follow Our Journey</h4>
                    <div className="social-links">
                      <a href="#" className="social-link" aria-label="Facebook">
                        <span className="social-icon">📘</span>
                        <span>Facebook</span>
                      </a>
                      <a href="#" className="social-link" aria-label="Instagram">
                        <span className="social-icon">📷</span>
                        <span>Instagram</span>
                      </a>
                      <a href="#" className="social-link" aria-label="Twitter">
                        <span className="social-icon">🐦</span>
                        <span>Twitter</span>
                      </a>
                      <a href="#" className="social-link" aria-label="LinkedIn">
                        <span className="social-icon">💼</span>
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="contact-form-section">
                <div className="form-card">
                  <div className="form-header">
                    <h3>Send Your Message</h3>
                    <p>Fill out the form below and we'll get back to you ASAP</p>
                  </div>

                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Enter your full name"
                        className={`form-input ${submitStatus === 'error' && !formData.name ? 'error' : ''}`}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Enter your email address"
                        className={`form-input ${submitStatus === 'error' && !formData.email ? 'error' : ''}`}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="service" className="form-label">
                        Service Interested In *
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className={`form-select ${submitStatus === 'error' && !formData.service ? 'error' : ''}`}
                      >
                        <option value="">Select a service</option>
                        <option value="wedding-photography">🎭 Wedding Photography</option>
                        <option value="birthday-photography">🎂 Birthday Photography</option>
                        <option value="event-photography">🎉 Event/Party Photography</option>
                        <option value="digital-portraits">📸 Photo Shoots</option>
                        <option value="graphic-design">🎨 Graphic Design</option>
                        <option value="motion-picture">🎬 Motion Picture</option>
                        <option value="music">🎵 Music Artworks</option>
                        <option value="gaming">🎮 Gaming Services</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message" className="form-label">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Tell us about your project, event details, or any specific requirements..."
                        rows="5"
                        className={`form-textarea ${submitStatus === 'error' && !formData.message ? 'error' : ''}`}
                      ></textarea>
                    </div>

                    {/* Status Messages */}
                    {submitStatus === 'success' && (
                      <div className="status-message success">
                        <div className="status-icon">🎉</div>
                        <div className="status-content">
                          <strong>Message Sent Successfully!</strong>
                          <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                        </div>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="status-message error">
                        <div className="status-icon">⚠️</div>
                        <div className="status-content">
                          <strong>Unable to Send Message</strong>
                          <p>Please check all fields and try again, or contact us directly.</p>
                        </div>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="spinner"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <span className="btn-icon">🚀</span>
                          Send Message
                        </>
                      )}
                    </button>

                    <p className="form-note">
                      * Required fields. We respect your privacy and won't share your information.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .contact-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        /* Animated Background */
        .background-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          bottom: 20%;
          left: 15%;
          animation-delay: 4s;
        }

        .shape-4 {
          width: 120px;
          height: 120px;
          top: 30%;
          right: 20%;
          animation-delay: 1s;
        }

        .shape-5 {
          width: 80px;
          height: 80px;
          bottom: 10%;
          right: 15%;
          animation-delay: 3s;
        }

        .animated-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            linear-gradient(90deg, transparent 79px, rgba(255,255,255,0.03) 81px, rgba(255,255,255,0.03) 81px, transparent 83px),
            linear-gradient(rgba(255,255,255,0.03) 79px, transparent 81px, transparent 81px, rgba(255,255,255,0.03) 83px);
          background-size: 85px 85px;
          animation: gridMove 20s linear infinite;
        }

        /* Graphic Design Elements - CSS Shapes */
        .graphic-element {
          position: absolute;
          animation: graphicFloat 8s ease-in-out infinite;
          z-index: 1;
        }

        .graphic-1 {
          top: 15%;
          left: 8%;
          animation-delay: 0s;
        }

        .graphic-2 {
          top: 25%;
          right: 12%;
          animation-delay: 1s;
        }

        .graphic-3 {
          bottom: 30%;
          left: 10%;
          animation-delay: 2s;
        }

        .graphic-4 {
          bottom: 20%;
          right: 15%;
          animation-delay: 3s;
        }

        .graphic-5 {
          top: 40%;
          left: 5%;
          animation-delay: 4s;
        }

        /* Paint Brush */
        .paint-brush {
          width: 40px;
          height: 60px;
          background: linear-gradient(45deg, #ff6b6b, #ffa726);
          border-radius: 20px 20px 5px 5px;
          position: relative;
          transform: rotate(-30deg);
        }

        .paint-brush::before {
          content: '';
          position: absolute;
          top: -15px;
          left: 5px;
          width: 30px;
          height: 20px;
          background: #5d4037;
          border-radius: 10px 10px 0 0;
        }

        .paint-brush::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 15px;
          width: 10px;
          height: 15px;
          background: #ffa726;
          border-radius: 0 0 5px 5px;
        }

        /* Color Palette */
        .color-palette {
          width: 50px;
          height: 50px;
          background: #4fc3f7;
          border-radius: 50%;
          position: relative;
        }

        .color-palette::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 10px;
          width: 15px;
          height: 15px;
          background: #ffeb3b;
          border-radius: 50%;
        }

        .color-palette::after {
          content: '';
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 12px;
          height: 12px;
          background: #e91e63;
          border-radius: 50%;
        }

        /* Pencil Icon */
        .pencil-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #ff9800, #ff5722);
          clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
          transform: rotate(45deg);
        }

        /* Ruler Icon */
        .ruler-icon {
          width: 60px;
          height: 20px;
          background: #795548;
          position: relative;
        }

        .ruler-icon::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: repeating-linear-gradient(
            to right,
            white,
            white 4px,
            transparent 4px,
            transparent 8px
          );
        }

        /* Camera Icon */
        .camera-icon {
          width: 50px;
          height: 40px;
          background: #37474f;
          border-radius: 10px;
          position: relative;
        }

        .camera-icon::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 15px;
          width: 20px;
          height: 15px;
          background: #37474f;
          border-radius: 5px 5px 0 0;
        }

        .camera-icon::after {
          content: '';
          position: absolute;
          top: 10px;
          left: 20px;
          width: 10px;
          height: 10px;
          background: #ffd54f;
          border-radius: 50%;
          border: 2px solid #fff;
        }

        /* Design Elements with Complex Animation */
        .design-element {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: designOrbit 20s linear infinite;
          z-index: 2;
        }

        .design-inner {
          animation: designSpin 8s linear infinite reverse;
        }

        .design-1 {
          top: 20%;
          left: 15%;
          animation-delay: 0s;
          animation-duration: 25s;
        }

        .design-2 {
          top: 35%;
          right: 20%;
          animation-delay: 2s;
          animation-duration: 22s;
        }

        .design-3 {
          bottom: 25%;
          left: 25%;
          animation-delay: 4s;
          animation-duration: 28s;
        }

        .design-4 {
          bottom: 40%;
          right: 10%;
          animation-delay: 6s;
          animation-duration: 24s;
        }

        .design-5 {
          top: 50%;
          left: 35%;
          animation-delay: 8s;
          animation-duration: 26s;
        }

        /* Inner Design Shapes */
        .circle-gradient {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(45deg, #667eea, #764ba2);
        }

        .triangle-shape {
          width: 0;
          height: 0;
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-bottom: 25px solid #ff6b6b;
        }

        .square-rotating {
          width: 25px;
          height: 25px;
          background: #4ecdc4;
          transform: rotate(45deg);
        }

        .hexagon-shape {
          width: 25px;
          height: 25px;
          background: #ffd93d;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }

        .star-shape {
          width: 25px;
          height: 25px;
          background: #ff6b6b;
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }

        /* Floating Dots */
        .floating-dot {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          animation: float 4s ease-in-out infinite;
        }

        .dot-1 {
          width: 8px;
          height: 8px;
          top: 70%;
          left: 20%;
          animation-delay: 0s;
        }

        .dot-2 {
          width: 6px;
          height: 6px;
          top: 30%;
          right: 25%;
          animation-delay: 1s;
        }

        .dot-3 {
          width: 10px;
          height: 10px;
          bottom: 40%;
          left: 40%;
          animation-delay: 2s;
        }

        .dot-4 {
          width: 7px;
          height: 7px;
          top: 60%;
          right: 35%;
          animation-delay: 3s;
        }

        .dot-5 {
          width: 5px;
          height: 5px;
          bottom: 20%;
          left: 30%;
          animation-delay: 4s;
        }

        .dot-6 {
          width: 9px;
          height: 9px;
          top: 45%;
          right: 15%;
          animation-delay: 5s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(85px, 85px);
          }
        }

        @keyframes graphicFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg) scale(1.1);
          }
          50% {
            transform: translateY(0px) translateX(20px) rotate(180deg) scale(1);
          }
          75% {
            transform: translateY(20px) translateX(10px) rotate(270deg) scale(0.9);
          }
        }

        @keyframes designOrbit {
          0% {
            transform: rotate(0deg) translateX(100px) rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(90deg) translateX(120px) rotate(-90deg) scale(1.1);
          }
          50% {
            transform: rotate(180deg) translateX(100px) rotate(-180deg) scale(1);
          }
          75% {
            transform: rotate(270deg) translateX(80px) rotate(-270deg) scale(0.9);
          }
          100% {
            transform: rotate(360deg) translateX(100px) rotate(-360deg) scale(1);
          }
        }

        @keyframes designSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Main Content */
        .main-content {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          min-height: 100vh;
        }

        .section {
          padding: 100px 60px;
        }

        /* Contact Header */
        .contact-header {
          text-align: center;
          margin-bottom: 80px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .section-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 10px 24px;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 30px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .contact-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .contact-subtitle {
          font-size: 1.3rem;
          color: #64748b;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Contact Grid */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
          align-items: stretch;
        }

        /* Contact Cards - Same Size */
        .info-card,
        .form-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          height: 100%;
          display: flex;
          flex-direction: column;
          min-height: 650px;
        }

        /* Contact Info Section */
        .card-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .card-icon {
          font-size: 2.5rem;
        }

        .card-header h3 {
          font-size: 1.5rem;
          color: #1e293b;
          margin: 0;
          font-weight: 700;
        }

        .card-description {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 30px;
          font-size: 1.1rem;
        }

        /* Contact Methods */
        .contact-methods {
          margin-bottom: 30px;
          flex: 1;
        }

        .contact-method {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 25px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 15px;
          transition: all 0.3s ease;
        }

        .contact-method:hover {
          background: #f1f5f9;
          transform: translateX(5px);
        }

        .method-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        .method-details h4 {
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 5px;
          font-size: 1.1rem;
        }

        .method-details p {
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        /* Quick Stats */
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 30px;
          padding: 25px 0;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .stat {
          text-align: center;
          padding: 10px;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 800;
          color: #667eea;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Social Section */
        .social-section {
          margin-top: auto;
        }

        .social-section h4 {
          color: #1e293b;
          margin-bottom: 15px;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .social-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: #f8fafc;
          border-radius: 8px;
          color: #64748b;
          text-decoration: none;
          transition: all 0.3s ease;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .social-link:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateY(-2px);
        }

        .social-icon {
          font-size: 1.1rem;
        }

        /* Contact Form Section */
        .form-header {
          margin-bottom: 30px;
        }

        .form-header h3 {
          font-size: 1.5rem;
          color: #1e293b;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .form-header p {
          color: #64748b;
          margin: 0;
          line-height: 1.5;
          font-size: 1rem;
        }

        /* Form Elements */
        .contact-form {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          color: #374151;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          box-sizing: border-box;
          font-family: inherit;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }

        .form-input.error,
        .form-select.error,
        .form-textarea.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
          line-height: 1.5;
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
          background-repeat: no-repeat;
          background-position: right 15px center;
          background-size: 12px;
        }

        /* Submit Button */
        .submit-btn {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 15px;
          margin-top: auto;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .submit-btn.submitting {
          background: #94a3b8;
        }

        .btn-icon {
          font-size: 1.1rem;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .form-note {
          text-align: center;
          color: #94a3b8;
          font-size: 0.85rem;
          margin: 0;
          line-height: 1.4;
        }

        /* Status Messages */
        .status-message {
          padding: 16px;
          border-radius: 12px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 20px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .status-message.success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid #22c55e;
          color: #166534;
        }

        .status-message.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
          color: #991b1b;
        }

        .status-icon {
          font-size: 1.3rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .status-content strong {
          display: block;
          margin-bottom: 4px;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .status-content p {
          margin: 0;
          font-size: 0.85rem;
          opacity: 0.9;
          line-height: 1.4;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .contact-grid {
            gap: 30px;
          }
          
          .contact-title {
            font-size: 3rem;
          }
          
          .info-card,
          .form-card {
            padding: 30px;
            min-height: 600px;
          }

          .graphic-element {
            transform: scale(0.8);
          }

          .design-element {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 768px) {
          .section {
            padding: 60px 20px;
          }

          .contact-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .contact-title {
            font-size: 2.5rem;
          }

          .contact-subtitle {
            font-size: 1.1rem;
          }

          .info-card,
          .form-card {
            padding: 25px;
            min-height: auto;
          }

          .quick-stats {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            padding: 20px 0;
          }

          .social-links {
            grid-template-columns: 1fr 1fr;
          }

          .contact-method {
            flex-direction: row;
            text-align: left;
            gap: 15px;
          }

          .method-icon {
            align-self: flex-start;
          }

          .graphic-element {
            display: none;
          }

          .design-element {
            display: none;
          }

          .floating-dot {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .contact-title {
            font-size: 2rem;
          }

          .info-card,
          .form-card {
            padding: 20px;
          }

          .card-header {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }

          .contact-header {
            margin-bottom: 50px;
          }

          .quick-stats {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .social-links {
            grid-template-columns: 1fr;
          }

          .contact-method {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .method-icon {
            align-self: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
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
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-title">
          <h2>Get In Touch</h2>
          <p>Ready to capture your special moments? Let's create something amazing together</p>
        </div>
        
        <div className="contact-container">
          {/* Contact Information */}
          <div className="contact-info">
            <div className="info-card">
              <h3>Let's Start Your Project</h3>
              <p className="info-description">
                We're here to bring your vision to life. Reach out and let's discuss how we can make your event unforgettable.
              </p>
              
              <div className="contact-items">
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>Our Location</h4>
                    <p>Nansana Municipality, Kampala, Uganda</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>Email Us</h4>
                    <p>lukwagorj77@gmail.com</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 15.5C18.8 15.5 17.5 15.3 16.4 14.9C16.3 14.9 16.2 14.9 16.1 14.9C15.8 14.9 15.6 15 15.4 15.2L13.2 17.4C10.4 15.9 8 13.6 6.6 10.8L8.8 8.6C9.1 8.3 9.2 7.9 9 7.6C8.7 6.5 8.5 5.2 8.5 4C8.5 3.4 8.1 3 7.5 3H4C3.4 3 3 3.4 3 4C3 13.4 10.6 21 20 21C20.6 21 21 20.6 21 20V16.5C21 15.9 20.6 15.5 20 15.5Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>Call Us</h4>
                    <p>0757660015 / 0763098162</p>
                  </div>
                </div>
              </div>

              <div className="social-section">
                <h4>Follow Us</h4>
                <div className="social-links">
                  <a href="#" aria-label="Facebook" className="social-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="Instagram" className="social-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.24 14.815 3.75 13.664 3.75 12.367s.49-2.448 1.376-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.886.875 1.376 2.026 1.376 3.323s-.49 2.448-1.376 3.323c-.875.808-2.026 1.297-3.323 1.297z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="Twitter" className="social-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.543l-.047-.02z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="LinkedIn" className="social-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form">
            <div className="form-card">
              <h3>Send Us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Enter your full name"
                    className={submitStatus === 'error' && !formData.name ? 'error' : ''}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Your Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Enter your email address"
                    className={submitStatus === 'error' && !formData.email ? 'error' : ''}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="service">Service Interested In *</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className={submitStatus === 'error' && !formData.service ? 'error' : ''}
                  >
                    <option value="">Select a service</option>
                    <option value="wedding-photography">Wedding Photography</option>
                    <option value="birthday-photography">Birthday Photography</option>
                    <option value="event-photography">Event/Party Photography</option>
                    <option value="digital-portraits">Photo Shoots</option>
                    <option value="graphic-design">Graphic Design</option>
                    <option value="gadgets">Gadgets & Electronics</option>
                    <option value="gaming">Gaming Services</option>
                    <option value="gaming">Music Services</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Tell us about your project, event details, or any specific requirements..."
                    rows="5"
                    className={submitStatus === 'error' && !formData.message ? 'error' : ''}
                  ></textarea>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="status-message success">
                    <div className="status-icon">✓</div>
                    <div className="status-content">
                      <strong>Message Sent Successfully!</strong>
                      <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="status-message error">
                    <div className="status-icon">!</div>
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
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
                      </svg>
                      Send Message
                    </>
                  )}
                </button>

                <p className="required-note">
                  * Required fields
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact {
          padding: 100px 0;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          position: relative;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-title {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-title h2 {
          font-size: 3rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .section-title p {
          font-size: 1.2rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .contact-container {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 60px;
          align-items: start;
        }

        /* Contact Info Styles */
        .contact-info .info-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }

        .contact-info h3 {
          font-size: 1.8rem;
          color: #1e293b;
          margin-bottom: 16px;
          font-weight: 600;
        }

        .info-description {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 40px;
          font-size: 1.1rem;
        }

        .contact-items {
          space-y: 24px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 32px;
        }

        .contact-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .contact-details h4 {
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 4px;
          font-size: 1.1rem;
        }

        .contact-details p {
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .social-section {
          margin-top: 40px;
          padding-top: 32px;
          border-top: 1px solid #e2e8f0;
        }

        .social-section h4 {
          color: #1e293b;
          margin-bottom: 16px;
          font-weight: 600;
        }

        .social-links {
          display: flex;
          gap: 12px;
        }

        .social-link {
          width: 44px;
          height: 44px;
          background: #f8fafc;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .social-link:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateY(-2px);
        }

        /* Contact Form Styles */
        .contact-form .form-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .contact-form h3 {
          font-size: 1.8rem;
          color: #1e293b;
          margin-bottom: 32px;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #374151;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
          border-color: #ef4444;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
        }

        .submit-btn {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .submit-btn.submitting {
          background: #94a3b8;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .required-note {
          text-align: center;
          color: #94a3b8;
          font-size: 0.9rem;
          margin-top: 16px;
        }

        /* Status Messages */
        .status-message {
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
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
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .status-message.success .status-icon {
          background: #22c55e;
          color: white;
        }

        .status-message.error .status-icon {
          background: #ef4444;
          color: white;
        }

        .status-content strong {
          display: block;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .status-content p {
          margin: 0;
          font-size: 0.95rem;
          opacity: 0.9;
        }

        /* Responsive Design */
        @media (max-width: 968px) {
          .contact-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .section-title h2 {
            font-size: 2.5rem;
          }

          .contact-info .info-card,
          .contact-form .form-card {
            padding: 32px;
          }
        }

        @media (max-width: 640px) {
          .contact {
            padding: 60px 0;
          }

          .section-title h2 {
            font-size: 2rem;
          }

          .section-title p {
            font-size: 1.1rem;
          }

          .contact-info .info-card,
          .contact-form .form-card {
            padding: 24px;
          }

          .contact-item {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .contact-icon {
            align-self: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
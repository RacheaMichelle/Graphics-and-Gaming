import React, { useState } from 'react';
import LazyReveal from '../components/LazyReveal';
import emailjs from 'emailjs-com';

const ContactPage = () => {
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.service || !formData.message) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);

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
    <div className="contact-page">
      <div className="page-hero">
        <div className="container">
          <LazyReveal threshold={0.1}>
            <h1>Get In Touch</h1>
            <p>Let's create something amazing together</p>
          </LazyReveal>
        </div>
      </div>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <LazyReveal className="fade-left" threshold={0.3}>
              <div className="contact-info">
                <h2>Let's Talk</h2>
                <p>Have a project in mind? We'd love to hear about it. Reach out to us and let's discuss how we can bring your vision to life.</p>
                
                <div className="info-items">
                  <div className="info-item">
                    <div className="info-icon">📍</div>
                    <div>
                      <h4>Location</h4>
                      <p>Nansana Municipality, Kampala, Uganda</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-icon">📧</div>
                    <div>
                      <h4>Email</h4>
                      <p>lukwagorj77@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-icon">📞</div>
                    <div>
                      <h4>Phone</h4>
                      <p>0757660015 / 0763098162</p>
                    </div>
                  </div>
                </div>

                <div className="business-hours">
                  <h4>Business Hours</h4>
                  <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                  <p>Saturday: 10:00 AM - 8:00 PM</p>
                  
                </div>
              </div>
            </LazyReveal>
            
            <LazyReveal className="fade-right" threshold={0.3} delay={200}>
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Send a Message</h2>
                
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email *"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a Service *</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Photography">Photography</option>
                    <option value="Motion Picture">Motion Picture</option>
                    <option value="Music Artworks">Music Artworks</option>
                    <option value="Gaming">Gaming Services</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message *"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                {submitStatus === 'success' && (
                  <div className="success-message">✓ Message sent successfully! We'll get back to you soon.</div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="error-message">⚠ Please fill in all required fields.</div>
                )}
                
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </LazyReveal>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #147adf 0%, #f1f5f9 100%);
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

        .contact-section {
          padding: 80px 0;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }

        .contact-info h2,
        .contact-form h2 {
          font-size: 2rem;
          margin-bottom: 20px;
          color: #1e293b;
        }

        .contact-info p {
          color: #000310;
          line-height: 1.8;
          margin-bottom: 30px;
        }

        .info-items {
          margin-bottom: 30px;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .info-item:hover {
          transform: translateX(5px);
          box-shadow: 0 5px 15px rgba(246, 7, 7, 0.08);
        }

        .info-icon {
          width: 45px;
          height: 45px;
          background: #163b61;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }

        .info-item h4 {
          margin: 0 0 5px 0;
          color: #1e293b;
        }

        .info-item p {
          margin: 0;
          color: #64748b;
        }

        .business-hours {
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .business-hours h4 {
          margin-bottom: 12px;
          color: #0a4fbe;
        }

        .business-hours p {
          margin: 8px 0;
          color: #910f6e;
        }

        .contact-form {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #3a80db;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .success-message {
          background: #10b981;
          color: white;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        }

        .error-message {
          background: #ef4444;
          color: white;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .page-hero {
            padding: 100px 0 60px;
          }

          .page-hero h1 {
            font-size: 2.5rem;
          }

          .contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .contact-form {
            padding: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
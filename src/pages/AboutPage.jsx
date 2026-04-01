import React from 'react';
import LazyReveal from '../components/LazyReveal';
import LazyImage from '../components/LazyImage';
import profilePic from '../assets/images/WhatsApp Image 2025-10-07 at 18.22.34_d752a1a7.jpg';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="page-hero">
        <div className="container">
          <LazyReveal threshold={0.1}>
            <h1>About RAEMOND DVJ</h1>
            <p>Creating amazing experiences through design, gaming, and technology</p>
          </LazyReveal>
        </div>
      </div>

      <section className="about-story">
        <div className="container">
          <div className="about-grid">
            <LazyReveal className="fade-left" threshold={0.3}>
              <div className="about-content">
                <h2>Our Story</h2>
                <p>
                  Founded with a passion for creativity and innovation, RAEMOND DVJ has grown 
                  into a premier destination for graphic design, gaming experiences, and gadget reviews.
                </p>
                <p>
                  We believe in pushing boundaries and delivering exceptional quality in everything we do.
                  Our team of creative professionals brings together diverse skills and perspectives to 
                  create unique solutions for our clients.
                </p>
                <div className="mission-vision">
                  <div className="mission">
                    <h3>Our Mission</h3>
                    <p>To inspire and empower through creative excellence and innovative solutions.</p>
                  </div>
                  <div className="vision">
                    <h3>Our Vision</h3>
                    <p>To be the leading creative force in graphic design, gaming, and technology.</p>
                  </div>
                </div>
                <div className="stats">
                  <div className="stat">
                    <div className="stat-number">50+</div>
                    <div className="stat-label">Projects Completed</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">3+</div>
                    <div className="stat-label">Years Experience</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">100%</div>
                    <div className="stat-label">Client Satisfaction</div>
                  </div>
                </div>
              </div>
            </LazyReveal>
            
            <LazyReveal className="fade-right" threshold={0.3} delay={200}>
              <div className="about-image">
                <LazyImage src={profilePic} alt="RAEMOND DVJ" />
                <div className="image-caption">
                  <p>RAEMOND DVJ - Creative Director</p>
                </div>
              </div>
            </LazyReveal>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <LazyReveal threshold={0.2}>
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">What drives us every day</p>
          </LazyReveal>
          
          <div className="values-grid">
            <LazyReveal threshold={0.3} delay={100}>
              <div className="value-card">
                <div className="value-icon">🎨</div>
                <h3>Creativity</h3>
                <p>We push creative boundaries to deliver unique and innovative solutions.</p>
              </div>
            </LazyReveal>
            
            <LazyReveal threshold={0.3} delay={200}>
              <div className="value-card">
                <div className="value-icon">⭐</div>
                <h3>Quality</h3>
                <p>We never compromise on quality, ensuring excellence in every project.</p>
              </div>
            </LazyReveal>
            
            <LazyReveal threshold={0.3} delay={300}>
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>Integrity</h3>
                <p>We build trust through transparency and honest communication.</p>
              </div>
            </LazyReveal>
            
            <LazyReveal threshold={0.3} delay={400}>
              <div className="value-card">
                <div className="value-icon">🚀</div>
                <h3>Innovation</h3>
                <p>We embrace new technologies and stay ahead of industry trends.</p>
              </div>
            </LazyReveal>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
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

        .about-story {
          padding: 80px 0;
          background: white;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .about-content h2 {
          font-size: 2.5rem;
          margin-bottom: 24px;
          color: #1e293b;
        }

        .about-content p {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .mission-vision {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 30px 0;
          padding: 20px;
          background: #f8fafc;
          border-radius: 15px;
        }

        .mission h3, .vision h3 {
          color: #667eea;
          margin-bottom: 8px;
        }

        .mission p, .vision p {
          margin: 0;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 30px;
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #667eea;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.9rem;
        }

        .about-image {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .about-image :global(.lazy-image-container) {
          height: 400px;
        }

        .image-caption {
          text-align: center;
          padding: 12px;
          background: white;
          color: #64748b;
        }

        .values-section {
          padding: 80px 0;
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
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }

        .value-card {
          background: white;
          padding: 40px 30px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .value-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .value-card h3 {
          font-size: 1.3rem;
          margin-bottom: 12px;
          color: #1e293b;
        }

        .value-card p {
          color: #64748b;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .page-hero {
            padding: 100px 0 60px;
          }

          .page-hero h1 {
            font-size: 2.5rem;
          }

          .about-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .mission-vision {
            grid-template-columns: 1fr;
          }

          .stats {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .section-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
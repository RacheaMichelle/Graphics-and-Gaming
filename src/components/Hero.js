import React from 'react';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-background">
        <div className="hero-overlay"></div>
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>
      </div>
      
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span>RAEMOND STUDIOS</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-line">Capture</span>
            <span className="title-line">
              <span className="highlight">Memories</span> & Create
            </span>
            <span className="title-line">Experiences</span>
          </h1>
          
          <p className="hero-description">
            Professional photography, creative designs, premium gadgets, and exciting gaming - 
            all in one place. Your complete solution for memorable moments and digital experiences.
          </p>
          
          <div className="hero-buttons">
            <button 
              className="btn primary-btn" 
              onClick={() => scrollToSection('contact')}
            >
              <span className="btn-text">Book Photography</span>
              <span className="btn-icon">📸</span>
            </button>
            <button 
              className="btn secondary-btn" 
              onClick={() => scrollToSection('about')}
            >
              <span className="btn-text">View All Services</span>
              <span className="btn-icon">🎮</span>
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Projects Completed</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
            <div className="stat">
              <span className="stat-number">5+</span>
              <span className="stat-label">Years Experience</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-cards">
            <div className="card graphic-card">
              <span className="card-icon">🎨</span>
              <span className="card-text">Graphic Design</span>
            </div>
            <div className="card photo-card">
              <span className="card-icon">📷</span>
              <span className="card-text">Photography</span>
            </div>
            <div className="card gadget-card">
              <span className="card-icon">📱</span>
              <span className="card-text">Gadgets</span>
            </div>
            <div className="card game-card">
              <span className="card-icon">🎯</span>
              <span className="card-text">Gaming</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d2d2d 100%);
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 50%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
                     radial-gradient(circle at 70% 20%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
                     radial-gradient(circle at 80% 80%, rgba(155, 81, 224, 0.1) 0%, transparent 50%);
        }

        .hero-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          background: rgba(255, 107, 53, 0.6);
          border-radius: 50%;
          animation: float 6s infinite ease-in-out;
        }

        .particle:nth-child(odd) {
          background: rgba(78, 205, 196, 0.6);
        }

        .particle:nth-child(3n) {
          background: rgba(155, 81, 224, 0.6);
        }

        .hero-container {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .hero-content {
          max-width: 600px;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255, 107, 53, 0.2);
          border: 1px solid rgba(255, 107, 53, 0.5);
          border-radius: 50px;
          padding: 0.5rem 1.5rem;
          margin-bottom: 2rem;
        }

        .hero-badge span {
          color: #7c08d5ff;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          color: #fff;
          margin-bottom: 1.5rem;
        }

        .title-line {
          display: block;
        }

        .highlight {
          background: linear-gradient(135deg, #7610d5ff, #480dc8ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.2rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2.5rem;
          max-width: 500px;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 2rem;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .primary-btn {
          background: linear-gradient(135deg, #7002c9ff, #8603ccff);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.6);
        }

        .secondary-btn {
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .secondary-btn:hover {
          border-color: #5e13d0ff;
          background: rgba(255, 107, 53, 0.1);
          transform: translateY(-2px);
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        .hero-stats {
          display: flex;
          gap: 2rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #5d0cb9ff;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 0.5rem;
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .floating-cards {
          position: relative;
          width: 400px;
          height: 400px;
        }

        .card {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: scale(1.1);
          border-color: rgba(255, 107, 53, 0.5);
        }

        .graphic-card {
          top: 10%;
          left: 10%;
          animation: float 4s ease-in-out infinite;
        }

        .photo-card {
          top: 60%;
          left: 20%;
          animation: float 4s ease-in-out infinite 1s;
        }

        .gadget-card {
          top: 30%;
          right: 10%;
          animation: float 4s ease-in-out infinite 0.5s;
        }

        .game-card {
          top: 70%;
          right: 20%;
          animation: float 4s ease-in-out infinite 1.5s;
        }

        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .card-text {
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @media (max-width: 968px) {
          .hero-container {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }

          .hero-title {
            font-size: 2.8rem;
          }

          .hero-buttons {
            justify-content: center;
          }

          .hero-stats {
            justify-content: center;
          }

          .floating-cards {
            width: 300px;
            height: 300px;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.2rem;
          }

          .hero-description {
            font-size: 1.1rem;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }

          .hero-stats {
            flex-wrap: wrap;
          }

          .floating-cards {
            width: 250px;
            height: 250px;
          }

          .card {
            padding: 1rem;
          }

          .card-icon {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .hero-container {
            padding: 0 1rem;
          }

          .hero-title {
            font-size: 1.8rem;
          }

          .stat-number {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
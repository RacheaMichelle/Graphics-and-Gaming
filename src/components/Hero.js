import React from 'react';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      name: 'Photography',
      icon: '📸',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Design',
      icon: '🎨',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Gaming',
      icon: '🎮',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Music',
      icon: '🎵',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="hero" id="home">
      {/* Modern Background */}
      <div className="hero-background">
        {/* Animated Gradient Mesh */}
        <div className="gradient-mesh">
          <div className="mesh-1"></div>
          <div className="mesh-2"></div>
          <div className="mesh-3"></div>
        </div>

        {/* Floating Particles */}
        <div className="particles-container">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="particle" style={{
              '--delay': `${Math.random() * 5}s`,
              '--duration': `${5 + Math.random() * 10}s`,
              '--size': `${2 + Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `var(--delay)`
            }}></div>
          ))}
        </div>

        {/* Grid Pattern */}
        <div className="grid-pattern"></div>
      </div>

      <div className="container hero-container">
        {/* Main Content */}
        <div className="hero-content">
          {/* Animated Badge */}
          <div className="hero-badge">
            <div className="badge-content">
              <span className="badge-text">RAEMOND STUDIOS</span>
              <div className="badge-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <div className="heading-container">
            <h1 className="hero-title">
              <span className="title-line">
                Create <span className="highlight-text">Digital</span>
              </span>
              <span className="title-line">
                <span className="gradient-text">Experiences</span> That
              </span>
              <span className="title-line">
                Inspire & <span className="accent-text">Connect</span>
              </span>
            </h1>

            {/* Animated Cursor */}
            <div className="animated-cursor">|</div>
          </div>

          {/* Description */}
          <p className="hero-description">
            We blend cutting-edge design with innovative technology to create 
            unforgettable digital experiences. From stunning visuals to immersive 
            interactions, we bring your vision to life.
          </p>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="btn primary-btn"
              onClick={() => scrollToSection('contact')}
            >
              <span className="btn-content">
                <span className="btn-text">Start Project</span>
                <span className="btn-arrow">→</span>
              </span>
              <div className="btn-background"></div>
            </button>

            <button 
              className="btn secondary-btn"
              onClick={() => scrollToSection('about')}
            >
              <span className="btn-content">
                <span className="btn-icon">👁️</span>
                <span className="btn-text">View Work</span>
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Projects</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Success</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5+</div>
              <div className="stat-label">Years</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Clients</div>
            </div>
          </div>
        </div>

        {/* Visual Showcase */}
        <div className="hero-visual">
          {/* Compact Service Icons */}
          <div className="services-showcase">
            {services.map((service, index) => (
              <div 
                key={service.name}
                className="service-icon-compact"
                style={{ '--delay': `${index * 0.2}s` }}
              >
                <div className="icon-wrapper">
                  <div className="icon-circle">
                    <span className="icon">{service.icon}</span>
                  </div>
                  <span className="service-label">{service.name}</span>
                </div>
                <div className="icon-glow"></div>
              </div>
            ))}
          </div>

          {/* Central Orb */}
          <div className="central-orb">
            <div className="orb-core"></div>
            <div className="orb-ring"></div>
            <div className="orb-glow"></div>
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
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Modern Background */
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        /* Gradient Mesh */
        .gradient-mesh {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.4;
        }

        .mesh-1, .mesh-2, .mesh-3 {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
        }

        .mesh-1 {
          width: 600px;
          height: 600px;
          top: -200px;
          left: -200px;
          background: radial-gradient(circle, #8B5CF6 0%, transparent 70%);
          animation: floatMesh 20s ease-in-out infinite;
        }

        .mesh-2 {
          width: 500px;
          height: 500px;
          bottom: -150px;
          right: -150px;
          background: radial-gradient(circle, #06B6D4 0%, transparent 70%);
          animation: floatMesh 25s ease-in-out infinite reverse;
        }

        .mesh-3 {
          width: 400px;
          height: 400px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, #F59E0B 0%, transparent 70%);
          animation: floatMesh 30s ease-in-out infinite;
        }

        /* Particles */
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          background: rgba(139, 92, 246, 0.6);
          border-radius: 50%;
          animation: particleFloat var(--duration) ease-in-out infinite;
          width: var(--size);
          height: var(--size);
        }

        .particle:nth-child(3n) {
          background: rgba(6, 182, 212, 0.6);
        }

        .particle:nth-child(3n+1) {
          background: rgba(245, 158, 11, 0.6);
        }

        /* Grid Pattern */
        .grid-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
        }

        .hero-container {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Hero Badge */
        .hero-badge {
          margin-bottom: 2rem;
        }

        .badge-content {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(36, 244, 192, 0.1);
          border: 1px solid rgba(4, 173, 32, 0.3);
          padding: 8px 16px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .badge-text {
          color: #121212ff;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .badge-dots {
          display: flex;
          gap: 4px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #21b156ff;
          animation: pulse 2s ease-in-out infinite;
        }

        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        /* Heading */
        .heading-container {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          color: #fff;
          margin: 0;
        }

        .title-line {
          display: block;
          margin-bottom: 0.5rem;
        }

        .highlight-text {
          background: linear-gradient(135deg, #8B5CF6, #06B6D4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gradient-text {
          background: linear-gradient(135deg, #F59E0B, #EF4444);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .accent-text {
          color: #F59E0B;
        }

        .animated-cursor {
          position: absolute;
          right: -10px;
          bottom: 0;
          color: #8B5CF6;
          animation: blink 1s infinite;
        }

        /* Description */
        .hero-description {
          font-size: 1.125rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2.5rem;
          max-width: 500px;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .btn {
          position: relative;
          border: none;
          border-radius: 12px;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .primary-btn {
          background: linear-gradient(135deg, #8B5CF6, #7C3AED);
          color: white;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.4);
        }

        .btn-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-background {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .primary-btn:hover .btn-background {
          left: 100%;
        }

        .secondary-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .btn-arrow {
          transition: transform 0.3s ease;
        }

        .primary-btn:hover .btn-arrow {
          transform: translateX(4px);
        }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #8B5CF6;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        /* Hero Visual */
        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        /* Compact Service Icons */
        .services-showcase {
          position: relative;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 2rem;
          place-items: center;
        }

        .service-icon-compact {
          position: relative;
          animation: iconFloat 6s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        .icon-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          min-width: 100px;
        }

        .service-icon-compact:hover .icon-wrapper {
          transform: translateY(-5px) scale(1.05);
          border-color: rgba(139, 92, 246, 0.5);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        }

        .icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6, #7C3AED);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          transition: all 0.3s ease;
        }

        .service-icon-compact:hover .icon-circle {
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
        }

        .service-label {
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
        }

        .service-icon-compact:hover .service-label {
          color: #8B5CF6;
        }

        .icon-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.6s ease;
          border-radius: 16px;
        }

        .service-icon-compact:hover .icon-glow {
          left: 100%;
        }

        /* Central Orb */
        .central-orb {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          z-index: 2;
        }

        .orb-core {
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, #8B5CF6, #7C3AED);
          border-radius: 50%;
          animation: orbPulse 4s ease-in-out infinite;
          position: relative;
          z-index: 2;
        }

        .orb-ring {
          position: absolute;
          top: -15px;
          left: -15px;
          right: -15px;
          bottom: -15px;
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 50%;
          animation: orbRotate 8s linear infinite;
        }

        .orb-glow {
          position: absolute;
          top: -30px;
          left: -30px;
          right: -30px;
          bottom: -30px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 70%);
          border-radius: 50%;
          animation: orbGlow 6s ease-in-out infinite;
        }

        /* Animations */
        @keyframes floatMesh {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 15px) scale(0.9); }
        }

        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-5px); }
          75% { transform: translateY(-20px) translateX(5px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          33% { transform: translateY(-8px); }
          66% { transform: translateY(4px); }
        }

        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        @keyframes orbRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes orbGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }

          .hero-title {
            font-size: 3rem;
          }

          .hero-visual {
            height: 300px;
          }

          .services-showcase {
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .action-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 280px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero-visual {
            height: 250px;
          }

          .services-showcase {
            gap: 1rem;
          }

          .icon-wrapper {
            min-width: 80px;
            padding: 0.75rem;
          }

          .icon-circle {
            width: 50px;
            height: 50px;
            font-size: 1.25rem;
          }

          .service-label {
            font-size: 0.7rem;
          }
        }

        @media (max-width: 480px) {
          .hero-container {
            padding: 0 1rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .services-showcase {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, 1fr);
            gap: 1rem;
          }

          .service-icon-compact {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
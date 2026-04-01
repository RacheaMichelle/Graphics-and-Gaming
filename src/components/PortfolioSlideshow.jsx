// src/components/PortfolioSlideshow.jsx - FIXED
import React, { useState, useEffect } from 'react';

const PortfolioSlideshow = ({ projects, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Filter only projects with valid images
  const validProjects = projects.filter(p => p && p.src && (p.src.startsWith('http') || p.src.startsWith('data:image')));

  const nextSlide = () => {
    if (validProjects.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % validProjects.length);
  };

  const prevSlide = () => {
    if (validProjects.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + validProjects.length) % validProjects.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality - MOVED BEFORE CONDITIONAL RETURN
  useEffect(() => {
    if (!isAutoPlaying || validProjects.length === 0) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, currentIndex, interval, validProjects.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const difference = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    if (Math.abs(difference) > minSwipeDistance) {
      if (difference > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Check if there are valid projects AFTER all hooks are called
  if (validProjects.length === 0) {
    return (
      <div className="slideshow-empty">
        <p>No portfolio images available</p>
        <style jsx>{`
          .slideshow-empty {
            width: 100%;
            height: 500px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 1.2rem;
          }
        `}</style>
      </div>
    );
  }

  const currentProject = validProjects[currentIndex];

  return (
    <div className="fullwidth-slideshow">
      {/* Main Slideshow */}
      <div 
        className="slideshow-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="slide-image">
          <img 
            src={currentProject.src} 
            alt={currentProject.title || 'Portfolio image'}
            loading="eager"
          />
          <div className="slide-overlay">
            <div className="slide-content">
              <h2>{currentProject.title || 'Portfolio Project'}</h2>
              <p>{currentProject.description || 'Check out our amazing work'}</p>
              <div className="slide-meta">
                <span className="category-tag">
                  {currentProject.category === 'graphic-design' && '🎨 Graphic Design'}
                  {currentProject.category === 'photography' && '📸 Photography'}
                  {currentProject.category === 'motion-picture' && '🎬 Motion Picture'}
                  {currentProject.category === 'music' && '🎵 Music Artworks'}
                  {currentProject.category === 'games' && '🎮 Gaming Zone'}
                </span>
                <span className="upload-date">
                  {currentProject.uploadDate || 'Featured Project'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        {validProjects.length > 1 && (
          <>
            <button className="slideshow-nav prev" onClick={prevSlide}>
              ‹
            </button>
            <button className="slideshow-nav next" onClick={nextSlide}>
              ›
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {validProjects.length > 1 && (
          <div className="slideshow-dots">
            {validProjects.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Auto-play Toggle */}
        {validProjects.length > 1 && (
          <button
            className="autoplay-toggle"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isAutoPlaying ? '⏸' : '▶'}
          </button>
        )}

        {/* Counter */}
        {validProjects.length > 1 && (
          <div className="slide-counter">
            {currentIndex + 1} / {validProjects.length}
          </div>
        )}
      </div>

      <style jsx>{`
        .fullwidth-slideshow {
          position: relative;
          width: 100vw;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          overflow: hidden;
          background: #000;
        }

        .slideshow-container {
          position: relative;
          width: 100%;
          height: 85vh;
          min-height: 500px;
          max-height: 800px;
          overflow: hidden;
        }

        .slide-image {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .slide-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: zoomIn 0.5s ease-out;
        }

        @keyframes zoomIn {
          from {
            transform: scale(1.1);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .slide-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.6) 50%,
            rgba(0, 0, 0, 0.8) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .slide-content {
          max-width: 800px;
          padding: 2rem;
          color: white;
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .slide-content h2 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 800;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slide-content p {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          opacity: 0.95;
          line-height: 1.5;
        }

        .slide-meta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .category-tag {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 0.5rem 1.2rem;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .upload-date {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1.2rem;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Navigation Buttons */
        .slideshow-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          color: white;
          border: none;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .slideshow-nav:hover {
          background: rgba(102, 126, 234, 0.8);
          transform: translateY(-50%) scale(1.1);
        }

        .slideshow-nav.prev {
          left: 30px;
        }

        .slideshow-nav.next {
          right: 30px;
        }

        /* Dots */
        .slideshow-dots {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 10;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          background: #8B5CF6;
          transform: scale(1.2);
        }

        .dot:hover {
          background: white;
        }

        /* Auto-play Toggle */
        .autoplay-toggle {
          position: absolute;
          bottom: 30px;
          right: 30px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          color: white;
          border: none;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .autoplay-toggle:hover {
          background: rgba(102, 126, 234, 0.8);
          transform: scale(1.1);
        }

        /* Counter */
        .slide-counter {
          position: absolute;
          bottom: 30px;
          left: 30px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          color: white;
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 600;
          z-index: 10;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .slideshow-container {
            height: 60vh;
            min-height: 400px;
          }

          .slide-content h2 {
            font-size: 1.8rem;
          }

          .slide-content p {
            font-size: 1rem;
          }

          .slideshow-nav {
            width: 45px;
            height: 45px;
            font-size: 1.8rem;
          }

          .slideshow-nav.prev {
            left: 15px;
          }

          .slideshow-nav.next {
            right: 15px;
          }

          .slide-meta {
            flex-direction: column;
            align-items: center;
            gap: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PortfolioSlideshow;
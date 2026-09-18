// src/components/PortfolioSlideshow.jsx - Updated to support videos
import React, { useState, useEffect, useRef } from 'react';

const PortfolioSlideshow = ({ projects, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const videoRef = useRef(null);

  // Helper to detect if a project is a video
  const isVideo = (project) => {
    if (!project || !project.src) return false;
    const src = project.src.toLowerCase();
    return (
      project.type === 'video' ||
      src.includes('.mp4') ||
      src.includes('.webm') ||
      src.includes('.mov') ||
      src.includes('.ogg')
    );
  };

  // Filter only projects with valid media
  const validProjects = projects.filter(p => {
    if (!p || !p.src) return false;
    return (
      p.src.startsWith('http') ||
      p.src.startsWith('data:image') ||
      p.src.startsWith('data:video') ||
      p.src.startsWith('blob:')
    );
  });

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

  // Auto-play (pauses on videos)
  useEffect(() => {
    const current = validProjects[currentIndex];
    if (!isAutoPlaying || validProjects.length === 0) return;
    if (current && isVideo(current)) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, currentIndex, interval, validProjects.length]);

  // Reset video when slide changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isAutoPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentIndex, isAutoPlaying]);

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

  if (validProjects.length === 0) {
    return (
      <div className="slideshow-empty">
        <p>No portfolio media available</p>
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
  const currentIsVideo = isVideo(currentProject);

  return (
    <div className="fullwidth-slideshow">
      <div
        className="slideshow-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="slide-media">
          {currentIsVideo ? (
            <video
              ref={videoRef}
              src={currentProject.src}
              className="slide-video"
              controls
              playsInline
              muted
              loop
              autoPlay={isAutoPlaying}
              onError={(e) => {
                console.error('Video failed to load:', currentProject.src);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <img
              src={currentProject.src}
              alt={currentProject.title || 'Portfolio image'}
              loading="eager"
            />
          )}

          <div className="slide-overlay">
            <div className="slide-content">
              <h2>{currentProject.title || 'Portfolio Project'}</h2>
              <p>{currentProject.description || 'Check out our amazing work'}</p>
              <div className="slide-meta">
                <span className="category-tag">
                  {currentProject.category === 'graphic-design' && '🎨 Graphic Design'}
                  {currentProject.category === 'video-film' && '🎬 Video & Film'}
                  {currentProject.category === 'drone-shots' && '🚁 Drone Shots'}
                  {currentProject.category === 'photography' && '📸 Photography'}
                </span>
                <span className="upload-date">
                  {currentProject.uploadDate || 'Featured Project'}
                </span>
                {currentIsVideo && (
                  <span className="video-badge">▶ Video</span>
                )}
              </div>
            </div>
          </div>
        </div>

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

        {validProjects.length > 1 && (
          <button
            className="autoplay-toggle"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isAutoPlaying ? '⏸' : '▶'}
          </button>
        )}

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
        .slide-media {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }
        .slide-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .slide-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #000;
        }
        .slide-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.75) 100%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          text-align: center;
          pointer-events: none;
        }
        .slide-content {
          max-width: 800px;
          padding: 2rem;
          color: white;
          pointer-events: auto;
        }
        .slide-content h2 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 800;
        }
        .slide-content p {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          opacity: 0.95;
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
          padding: 0.5rem 1.2rem;
          border-radius: 30px;
          font-size: 0.9rem;
        }
        .video-badge {
          background: rgba(239, 68, 68, 0.9);
          padding: 0.5rem 1.2rem;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .slideshow-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
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
          z-index: 10;
        }
        .slideshow-nav.prev { left: 30px; }
        .slideshow-nav.next { right: 30px; }
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
        }
        .dot.active {
          background: #8B5CF6;
          transform: scale(1.2);
        }
        .autoplay-toggle {
          position: absolute;
          bottom: 30px;
          right: 30px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          z-index: 10;
        }
        .slide-counter {
          position: absolute;
          bottom: 30px;
          left: 30px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 600;
          z-index: 10;
        }
        @media (max-width: 768px) {
          .slide-content h2 { font-size: 1.8rem; }
          .slide-content p { font-size: 1rem; }
          .slideshow-nav { width: 45px; height: 45px; font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
};

export default PortfolioSlideshow;

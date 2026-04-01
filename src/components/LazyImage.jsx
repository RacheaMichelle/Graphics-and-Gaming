import React, { useEffect, useRef, useState } from 'react';

const LazyImage = ({ src, alt, className, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(imgRef.current);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <div ref={imgRef} className={`lazy-image-container ${className || ''}`}>
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
      {!isLoaded && isVisible && (
        <div className="image-placeholder shimmer" />
      )}
      
      <style jsx>{`
        .lazy-image-container {
          position: relative;
          min-height: 200px;
          background: #f0f0f0;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        .lazy-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }

        .lazy-image.loaded {
          opacity: 1;
        }

        .image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            #f0f0f0 0%,
            #e0e0e0 50%,
            #f0f0f0 100%
          );
          background-size: 200% 100%;
        }

        .shimmer {
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LazyImage;
"use client";

import { useState, useEffect, useRef } from "react";

export function ImageModal({ images, currentIndex, onClose, onNext, onPrev }) {
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const imageRef = useRef(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onNext) {
      onNext();
    }
    if (isRightSwipe && onPrev) {
      onPrev();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight") {
        onNext();
      } else if (event.key === "ArrowLeft") {
        onPrev();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose, onNext, onPrev]);

  if (currentIndex === null || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      {/* Luxury Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5 opacity-50"></div>
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700] transition-all duration-200 z-10 p-2 rounded-full"
        aria-label="Close modal"
      >
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={onPrev}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700] transition-all duration-200 z-10 p-2 rounded-full"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700] transition-all duration-200 z-10 p-2 rounded-full"
          aria-label="Next image"
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Main Image Container */}
      <div className="relative max-w-full max-h-full w-full sm:max-w-4xl animate-zoom-in">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-white"></div>
            </div>
          )}
          <img
            ref={imageRef}
            src={currentImage.imageUrl}
            alt={currentImage.title}
            className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain mx-auto block select-none"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: 'pan-y pinch-zoom' }}
          />
        </div>
        
        {/* Image Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white p-3 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-1 text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text">{currentImage.title}</h3>
          <p className="text-sm text-white/80">{currentImage.category}</p>
          {images.length > 1 && (
            <p className="text-sm mt-2 text-[#FFD700]/80">
              {currentIndex + 1} of {images.length}
            </p>
          )}
        </div>
      </div>

      {/* Thumbnail Strip (for multiple images) - Hidden on mobile */}
      {images.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 hidden sm:flex space-x-2 max-w-full overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => {
                // This would trigger a change to the current index
                // We'll handle this in the parent component
              }}
              className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-[#FFD700] opacity-100 shadow-lg shadow-[#FFD700]/30'
                  : 'border-[#FFD700]/30 opacity-60 hover:opacity-80 hover:border-[#FFD700]/60'
              }`}
            >
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

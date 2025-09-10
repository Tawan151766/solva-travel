"use client";

import { useState, useEffect } from "react";
import { useGalleryContext } from "@/core/context";

export function GalleryHero() {
  const { getRandomImages, loading } = useGalleryContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heroImages, setHeroImages] = useState([]);

  // Load hero images from database
  useEffect(() => {
    if (!loading && getRandomImages) {
      const randomImages = getRandomImages(3);
      if (randomImages.length > 0) {
        const transformedImages = randomImages.map(img => ({
          id: img.id,
          url: img.imageUrl || img.url,
          title: img.title,
          description: img.description || `Explore ${img.location} - ${img.category}`
        }));
        setHeroImages(transformedImages);
      }
    }
  }, [loading, getRandomImages]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play carousel
  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  // Show loading state if no images yet
  if (loading || heroImages.length === 0) {
    return (
      <div className="@container">
        <div className="px-2 py-2 sm:px-4 sm:py-3">
          <div className="relative w-full min-h-64 sm:min-h-80 md:min-h-96 rounded-lg sm:@[480px]:rounded-xl overflow-hidden border border-[#FFD700]/20 shadow-2xl shadow-black/50 bg-gradient-to-br from-black via-[#0a0804] to-black">
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = heroImages[currentIndex];

  return (
    <div className="@container">
      <div className="px-2 py-2 sm:px-4 sm:py-3">
        <div className="relative w-full min-h-64 sm:min-h-80 md:min-h-96 rounded-lg sm:@[480px]:rounded-xl overflow-hidden group border border-[#FFD700]/20 shadow-2xl shadow-black/50">
          {/* Main Image */}
          <div
            className="w-full h-full bg-center bg-no-repeat bg-cover flex flex-col justify-end bg-gradient-to-br from-black via-[#0a0804] to-black rounded-lg sm:@[480px]:rounded-xl min-h-64 sm:min-h-80 md:min-h-96 transition-all duration-500"
            style={{
              backgroundImage: `url("${currentImage.url}")`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-lg sm:@[480px]:rounded-xl" />
            
            {/* Content */}
            <div className="relative p-4 sm:p-6 text-white z-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text">{currentImage.title}</h2>
              <p className="text-sm sm:text-lg text-white/90">{currentImage.description}</p>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700] p-1.5 sm:p-2 rounded-full transition-all duration-200 opacity-70 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700] p-1.5 sm:p-2 rounded-full transition-all duration-200 opacity-70 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Next image"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-[#FFD700]' 
                      : 'bg-[#FFD700]/50 hover:bg-[#FFD700]/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

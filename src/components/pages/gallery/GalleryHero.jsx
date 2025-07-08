"use client";

import { useState, useEffect } from "react";

const heroImages = [
  {
    id: 1,
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoTOnBRsQvFW8jUzkabot7wsA5KLAfizO33873MigmnJqRi2YIDOM62IlqMXoEY4cBN8rWuZiI58LDlutJsRGj-BAPPBgICDGaOACUEObMA3h0xvJl72Y9EPiQ-pQVQERVHkGEObY0s5vOsLztqJGpN7BjkHa5mFIA_JhBEgv579sYzXuWtunun8Y9XwDiz_7BHxVMu3T5dT4OHGZ0jtPheGdbxl0mOIjBK3HMoh6wXmCjqxuHzWe7jcEQcqWwOsd_ksKqgMFIzUAF",
    title: "Mountain Adventure",
    description: "Discover breathtaking mountain landscapes"
  },
  {
    id: 2,
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG8y_CSV0QJbdsBg5-KbttQO1Zk09vTPnO7YcQw9nRwsmAA_YxpB3fYEIwfdNKGyFJbcGow9SADUQ_x3-FH17g7HMS2TrJptp6kPaR-KK3qq8J__yK7ZVHbYuYdf8SjemvJwgl29R3TANKjJZAC9TYcdMvi-v-yqYOmr5-7mNPGKXm5f87bczFQj7OkzPdJNw7Wmoi10N_Z0LocqbqQZfSGZY9Wbdm5hi-16CpITDyBnXY68FMsH2r91n5NRaAeSuqbe0LpAMFFydl",
    title: "Beach Paradise",
    description: "Relax on pristine tropical beaches"
  },
  {
    id: 3,
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA84t4PXkFyjoU1omDp7hyENjvc86cn28sFw5nrOdXgCHDFhnUb242OQzgDmuuWrXCQswLqm3H4JSO108l3JVY4NmZoEUoyrazaBAI6m-M59SvsxVMAnOnE9b_BHTLRXp0TcKkTU-gZF013GpDu9_9J2SWX1L1f2d0_4H0G1KI14vdTFtQfbZ2TLfxtw9HvIAFaNn4Og19BnjxdOiWDHU5b0CnpimrlR2B-gToZ_5iEKfcUiEcINwFK848knBc9hVr5wSDOWffVxnR8",
    title: "Urban Explorer",
    description: "Experience vibrant city life"
  }
];

export function GalleryHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentImage = heroImages[currentIndex];

  return (
    <div className="@container">
      <div className="@[480px]:px-4 @[480px]:py-3">
        <div className="relative w-full min-h-80 @[480px]:rounded-xl overflow-hidden group">
          {/* Main Image */}
          <div
            className="w-full h-full bg-center bg-no-repeat bg-cover flex flex-col justify-end bg-[#231e10] @[480px]:rounded-xl min-h-80 transition-all duration-500"
            style={{
              backgroundImage: `url("${currentImage.url}")`
            }}
          >
            <div className="absolute inset-0 bg-black/40 @[480px]:rounded-xl" />
            
            {/* Content */}
            <div className="relative p-6 text-white z-10">
              <h2 className="text-2xl font-bold mb-2">{currentImage.title}</h2>
              <p className="text-lg opacity-90">{currentImage.description}</p>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/75'
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

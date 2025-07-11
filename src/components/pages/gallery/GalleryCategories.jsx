"use client";

import { useState, useRef } from "react";
import { GalleryCategoryCard } from "./GalleryCategoryCard";
import { useGalleryContext } from "@/core/context";

export function GalleryCategories() {
  const { allCategories, selectedCategory, setSelectedCategory, loading } = useGalleryContext();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className="p-4">
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-32 h-24 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between px-2 sm:px-4 pb-2 pt-4">
        <h3 className="text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-base sm:text-lg font-bold leading-tight tracking-[-0.015em]">
          Browse Categories
        </h3>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
              canScrollLeft 
                ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700]' 
                : 'bg-[#FFD700]/10 text-[#FFD700]/30 cursor-not-allowed border border-[#FFD700]/10'
            }`}
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
              canScrollRight 
                ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700]' 
                : 'bg-[#FFD700]/10 text-[#FFD700]/30 cursor-not-allowed border border-[#FFD700]/10'
            }`}
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
        >
          <div className="flex items-stretch p-2 sm:p-4 gap-2 sm:gap-4">
            {allCategories.map((category) => (
              <GalleryCategoryCard 
                key={category.id}
                name={category.name}
                imageUrl={category.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCoTOnBRsQvFW8jUzkabot7wsA5KLAfizO33873MigmnJqRi2YIDOM62IlqMXoEY4cBN8rWuZiI58LDlutJsRGj-BAPPBgICDGaOACUEObMA3h0xvJl72Y9EPiQ-pQVQERVHkGEObY0s5vOsLztqJGpN7BjkHa5mFIA_JhBEgv579sYzXuWtunun8Y9XwDiz_7BHxVMu3T5dT4OHGZ0jtPheGdbxl0mOIjBK3HMoh6wXmCjqxuHzWe7jcEQcqWwOsd_ksKqgMFIzUAF"}
                count={category.count}
                onClick={() => handleCategorySelect(category.name)}
                isSelected={selectedCategory === category.name}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { GalleryImageCard } from "./GalleryImageCard";
import { ImageModal } from "./ImageModal";
import { CategoryFilter } from "./CategoryFilter";
import { useGalleryContext } from "@/core/context";

export function GalleryGrid() {
  const { 
    filteredImages, 
    allCategories, 
    selectedCategory, 
    setSelectedCategory,
    loading,
    error
  } = useGalleryContext();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Show loading state
  if (loading) {
    return (
      <section className="p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
          <p className="text-[#FFD700]">Loading gallery...</p>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="p-4">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold">Failed to load gallery</p>
            <p className="text-sm opacity-75">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Get category names for filter (exclude 'All' since it's handled separately)
  const categories = allCategories
    .filter(cat => cat.id !== 'all')
    .map(cat => cat.name);

  const openModal = (imageIndex) => {
    setSelectedImageIndex(imageIndex);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex === filteredImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex === 0 ? filteredImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <section>
      <h3 className="text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-2 pt-4">
        Gallery ({filteredImages.length} images)
      </h3>
      
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      {filteredImages.length === 0 ? (
        <div className="text-center py-8 px-4">
          <p className="text-[#FFD700] opacity-75">No images found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-2 sm:gap-3 p-2 sm:p-4">
          {filteredImages.map((image, index) => (
            <div 
              key={image.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <GalleryImageCard 
                imageUrl={image.url || image.imageUrl}
                title={image.title}
                category={image.category}
                onClick={() => openModal(index)}
              />
            </div>
          ))}
        </div>
      )}

      {selectedImageIndex !== null && (
        <ImageModal
          images={filteredImages}
          currentIndex={selectedImageIndex}
          onClose={closeModal}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </section>
  );
}

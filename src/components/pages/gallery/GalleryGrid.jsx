"use client";

import { useState } from "react";
import { GalleryImageCard } from "./GalleryImageCard";
import { ImageModal } from "./ImageModal";
import { CategoryFilter } from "./CategoryFilter";
import { useGalleryContext } from "@/core/context";
import { galleryImages } from "@/data/galleryData";
export function GalleryGrid() {
  const { selectedCategory, setSelectedCategory } = useGalleryContext();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Get unique categories
  const categories = [...new Set(galleryImages.map(img => img.category))];

  // Filter images based on selected category
  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

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
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-2 sm:gap-3 p-2 sm:p-4">
        {filteredImages.map((image, index) => (
          <div 
            key={image.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <GalleryImageCard 
              imageUrl={image.imageUrl}
              title={image.title}
              category={image.category}
              onClick={() => openModal(index)}
            />
          </div>
        ))}
      </div>

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

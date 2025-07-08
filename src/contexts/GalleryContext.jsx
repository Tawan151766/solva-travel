"use client";

import { createContext, useContext, useState } from "react";

const GalleryContext = createContext();

export function GalleryProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const value = {
    selectedCategory,
    setSelectedCategory,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error("useGallery must be used within a GalleryProvider");
  }
  return context;
}

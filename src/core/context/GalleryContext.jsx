"use client";

import { createContext, useContext, useState, useMemo, useEffect } from "react";

const getCategoryIcon = (category) => {
  const icons = {
    'Beach': '🏖️',
    'Mountain': '🏔️',
    'City': '🏙️',
    'Forest': '🌲',
    'Desert': '🏜️',
    'destinations': '🏛️',
    'experiences': '🎭',
    'accommodations': '🏨',
    'food': '🍽️'
  };
  return icons[category] || '📸';
};

const GalleryContext = createContext();

export function GalleryProvider({ children }) {
  // States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'masonry'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'popular', 'title'
  
  // API data
  const [allGalleryImages, setAllGalleryImages] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  // Fetch gallery data from API
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all images
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          throw new Error(`Failed to fetch gallery data: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Gallery API response:', result);
        
        const data = result.data || result; // Support both nested and flat structures
        console.log('Gallery data:', data);
        console.log('Images count:', data.images?.length);
        console.log('Categories count:', data.categories?.length);
        
        // Transform images to use consistent property names
        const images = (data.images || []).map(img => ({
          ...img,
          url: img.url || img.imageUrl, // Support both url and imageUrl
          alt: img.alt || img.title
        }));
        
        // Create categories with proper structure
        const categories = data.categories || [];
        const allCategories = [
          { 
            id: 'all', 
            name: 'All', 
            count: images.length,
            description: 'All gallery images',
            icon: '🌍'
          },
          ...categories.map(category => ({
            id: category.toLowerCase(),
            name: category,
            count: images.filter(img => img.category === category).length,
            description: `${category} images`,
            icon: getCategoryIcon(category)
          }))
        ];
        
        setAllGalleryImages(images);
        setAllCategories(allCategories);
        
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        setError(err.message);
        setAllGalleryImages([]);
        setAllCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  // Filtered images based on selected category
  const filteredImages = useMemo(() => {
    let filtered = allGalleryImages;
    
    if (selectedCategory !== 'All' && selectedCategory !== 'all') {
      filtered = allGalleryImages.filter(image => 
        image.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort images
    switch (sortBy) {
      case 'newest':
        // Since we don't have dates, use ID as proxy for newest
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.id - b.id);
        break;
      case 'popular':
        // For demo, use ID as popularity proxy
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [selectedCategory, sortBy, allGalleryImages]);

  // Get image by ID - enhanced with API call if needed
  const getImageById = async (id) => {
    // First check if we already have the image in our local state
    const localImage = allGalleryImages.find(image => image.id === parseInt(id));
    if (localImage) {
      return localImage;
    }

    // If not found locally, try to fetch from API
    try {
      const response = await fetch(`/api/gallery/${id}`);
      if (response.ok) {
        const imageData = await response.json();
        return imageData;
      }
    } catch (err) {
      console.error('Error fetching image by ID:', err);
    }
    
    return null;
  };

  // Search images - enhanced with API support
  const searchImages = async (searchTerm, useApi = false) => {
    if (!searchTerm) return allGalleryImages;
    
    if (useApi) {
      try {
        const response = await fetch(`/api/gallery?search=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          return data.images || [];
        }
      } catch (err) {
        console.error('Error searching images via API:', err);
      }
    }
    
    // Fallback to local search
    const term = searchTerm.toLowerCase();
    return allGalleryImages.filter(image =>
      image.title.toLowerCase().includes(term) ||
      image.description.toLowerCase().includes(term) ||
      image.location.toLowerCase().includes(term) ||
      image.tags.some(tag => tag.toLowerCase().includes(term))
    );
  };

  // Get images by location
  const getImagesByLocation = (location) => {
    return allGalleryImages.filter(image =>
      image.location.toLowerCase().includes(location.toLowerCase())
    );
  };

  // Get images by tag
  const getImagesByTag = (tag) => {
    return allGalleryImages.filter(image =>
      image.tags.some(imageTag => 
        imageTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  };

  // Get random images
  const getRandomImages = (count = 6) => {
    const shuffled = [...allGalleryImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Get related images (by category or tags)
  const getRelatedImages = (imageId, count = 4) => {
    const currentImage = getImageById(imageId);
    if (!currentImage) return [];

    // First try to get images from same category
    let related = allGalleryImages.filter(image => 
      image.id !== imageId && 
      image.category === currentImage.category
    );

    // If not enough, add images with similar tags
    if (related.length < count) {
      const tagMatches = allGalleryImages.filter(image => 
        image.id !== imageId && 
        image.category !== currentImage.category &&
        image.tags.some(tag => currentImage.tags.includes(tag))
      );
      related = [...related, ...tagMatches];
    }

    // If still not enough, add random images
    if (related.length < count) {
      const remaining = allGalleryImages.filter(image => 
        image.id !== imageId && 
        !related.includes(image)
      );
      related = [...related, ...remaining];
    }

    return related.slice(0, count);
  };

  // Get category by ID
  const getCategoryById = (id) => {
    return allCategories.find(category => 
      category.id.toLowerCase() === id.toLowerCase()
    );
  };

  // Change category
  const changeCategory = (category) => {
    setSelectedCategory(category);
  };

  // Get gallery stats
  const getGalleryStats = () => {
    const totalImages = allGalleryImages.length;
    const categoriesCount = allCategories.length - 1; // Exclude 'All'
    const locations = [...new Set(allGalleryImages.map(img => img.location))];
    const photographers = [...new Set(allGalleryImages.map(img => img.photographer))];

    return {
      totalImages,
      totalCategories: categoriesCount,
      totalLocations: locations.length,
      totalPhotographers: photographers.length,
      locations,
      photographers
    };
  };

  const value = {
    // Data
    allGalleryImages,
    filteredImages,
    allCategories,
    
    // State
    selectedCategory,
    loading,
    error,
    viewMode,
    sortBy,
    
    // Actions
    setSelectedCategory: changeCategory,
    setLoading,
    setError,
    setViewMode,
    setSortBy,
    
    // Functions
    getImageById,
    searchImages,
    getImagesByLocation,
    getImagesByTag,
    getRandomImages,
    getRelatedImages,
    getCategoryById,
    getGalleryStats,
    
    // Computed
    totalImages: filteredImages.length,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGalleryContext() {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error("useGalleryContext must be used within a GalleryProvider");
  }
  return context;
}

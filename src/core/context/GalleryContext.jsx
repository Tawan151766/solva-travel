"use client";

import { createContext, useContext, useState, useMemo } from "react";

// Mock Gallery Data
const galleryMockData = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop",
    category: "destinations",
    title: "Eiffel Tower, Paris",
    alt: "Iconic Eiffel Tower in Paris",
    description: "The iconic symbol of Paris and France",
    location: "Paris, France",
    photographer: "John Doe",
    tags: ["paris", "france", "tower", "iconic", "landmark"]
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
    category: "experiences",
    title: "Tokyo Night Life",
    alt: "Vibrant Tokyo city at night",
    description: "Experience the bustling nightlife of Tokyo",
    location: "Tokyo, Japan",
    photographer: "Jane Smith",
    tags: ["tokyo", "japan", "night", "city", "lights"]
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    category: "accommodations",
    title: "Luxury Beach Resort",
    alt: "Luxury beachfront hotel room",
    description: "Relax in style at our premium beachfront accommodations",
    location: "Maldives",
    photographer: "Mike Johnson",
    tags: ["luxury", "beach", "resort", "maldives", "tropical"]
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    category: "food",
    title: "Fine Dining Experience",
    alt: "Gourmet dining experience",
    description: "Savor exquisite cuisine from around the world",
    location: "Various",
    photographer: "Sarah Wilson",
    tags: ["fine dining", "gourmet", "cuisine", "restaurant", "food"]
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop",
    category: "destinations",
    title: "Roman Colosseum",
    alt: "Ancient Roman Colosseum",
    description: "Step back in time at the ancient Roman Colosseum",
    location: "Rome, Italy",
    photographer: "Marco Rossi",
    tags: ["rome", "italy", "colosseum", "ancient", "history"]
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop",
    category: "destinations",
    title: "Big Ben, London",
    alt: "Big Ben clock tower in London",
    description: "The famous clock tower and symbol of London",
    location: "London, UK",
    photographer: "Oliver Brown",
    tags: ["london", "uk", "big ben", "clock tower", "parliament"]
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
    category: "destinations",
    title: "New York Skyline",
    alt: "Manhattan skyline at sunset",
    description: "The breathtaking skyline of Manhattan",
    location: "New York, USA",
    photographer: "Alex Rodriguez",
    tags: ["new york", "manhattan", "skyline", "usa", "cityscape"]
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
    category: "experiences",
    title: "Bali Rice Terraces",
    alt: "Beautiful rice terraces in Bali",
    description: "Experience the natural beauty of Bali's rice terraces",
    location: "Bali, Indonesia",
    photographer: "Lisa Chen",
    tags: ["bali", "indonesia", "rice terraces", "nature", "landscape"]
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=800&h=600&fit=crop",
    category: "accommodations",
    title: "Mountain Lodge",
    alt: "Cozy mountain lodge",
    description: "Enjoy mountain views from our cozy lodge",
    location: "Swiss Alps",
    photographer: "Hans Mueller",
    tags: ["mountain", "lodge", "swiss alps", "cozy", "nature"]
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
    category: "food",
    title: "Local Street Food",
    alt: "Authentic street food experience",
    description: "Taste authentic local flavors from street vendors",
    location: "Bangkok, Thailand",
    photographer: "Tom Anderson",
    tags: ["street food", "bangkok", "thailand", "local", "authentic"]
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
    category: "experiences",
    title: "Safari Adventure",
    alt: "Wildlife safari experience",
    description: "Get up close with wildlife on an African safari",
    location: "Kenya",
    photographer: "David Wildlife",
    tags: ["safari", "wildlife", "kenya", "africa", "adventure"]
  },
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1580837119756-563d608dd119?w=800&h=600&fit=crop",
    category: "accommodations",
    title: "Desert Camp",
    alt: "Luxury desert camping experience",
    description: "Sleep under the stars in luxury desert tents",
    location: "Sahara Desert",
    photographer: "Ahmed Hassan",
    tags: ["desert", "camping", "sahara", "luxury", "stars"]
  }
];

// Mock Gallery Categories
const categoriesMockData = [
  { 
    id: 'all', 
    name: 'All', 
    count: galleryMockData.length,
    description: 'All gallery images',
    icon: '🌍'
  },
  { 
    id: 'destinations', 
    name: 'Destinations', 
    count: galleryMockData.filter(img => img.category === 'destinations').length,
    description: 'Beautiful travel destinations around the world',
    icon: '🏛️'
  },
  { 
    id: 'experiences', 
    name: 'Experiences', 
    count: galleryMockData.filter(img => img.category === 'experiences').length,
    description: 'Unique travel experiences and activities',
    icon: '🎭'
  },
  { 
    id: 'accommodations', 
    name: 'Accommodations', 
    count: galleryMockData.filter(img => img.category === 'accommodations').length,
    description: 'Comfortable places to stay during your travels',
    icon: '🏨'
  },
  { 
    id: 'food', 
    name: 'Food & Dining', 
    count: galleryMockData.filter(img => img.category === 'food').length,
    description: 'Delicious cuisine and dining experiences',
    icon: '🍽️'
  }
];

const GalleryContext = createContext();

export function GalleryProvider({ children }) {
  // States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'masonry'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'popular', 'title'

  // All data
  const allGalleryImages = galleryMockData;
  const allCategories = categoriesMockData;

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

  // Get image by ID
  const getImageById = (id) => {
    return allGalleryImages.find(image => image.id === parseInt(id));
  };

  // Search images
  const searchImages = (searchTerm) => {
    if (!searchTerm) return allGalleryImages;
    
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

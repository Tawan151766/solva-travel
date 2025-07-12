"use client";

import React, { createContext, useContext, useState, useMemo } from "react";

// Mock data for travel packages
const travelMockData = [
  {
    id: 1,
    title: "Explore the Wonders of Paris",
    location: "Paris, France",
    price: "$899",
    duration: "5 days",
    imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "Cultural",
    isRecommended: true,
  },
  {
    id: 2,
    title: "Discover the Magic of Tokyo",
    location: "Tokyo, Japan",
    price: "$1,299",
    duration: "7 days",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "Cultural",
    isRecommended: true,
  },
  {
    id: 3,
    title: "Experience the Beauty of Rome",
    location: "Rome, Italy",
    price: "$799",
    duration: "4 days",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "Cultural",
    isRecommended: false,
  },
  {
    id: 4,
    title: "Uncover the Charm of London",
    location: "London, UK",
    price: "$1,099",
    duration: "6 days",
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "Cultural",
    isRecommended: true,
  },
  {
    id: 5,
    title: "Discover the Charm of Hanoi",
    location: "Hanoi, Vietnam",
    price: "$599",
    duration: "4 days",
    imageUrl: "https://images.unsplash.com/photo-1597915439281-e960f7dd14bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "Cultural",
    isRecommended: false,
  },
  {
    id: 6,
    title: "Ancient Beauty of Hoi An",
    location: "Hoi An, Vietnam",
    price: "$549",
    duration: "4 days",
    imageUrl: "https://images.unsplash.com/photo-1585059895521-f0b06004d4ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "Cultural",
    isRecommended: false,
  },
  {
    id: 7,
    title: "Explore Vibrant Ho Chi Minh City",
    location: "Ho Chi Minh City, Vietnam",
    price: "$699",
    duration: "5 days",
    imageUrl: "https://images.unsplash.com/photo-1620374641540-47a7dd6cb221?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "Urban",
    isRecommended: true,
  },
  {
    id: 8,
    title: "Winter Wonderland in Salzburg",
    location: "Salzburg, Austria",
    price: "$1,299",
    duration: "6 days",
    imageUrl: "https://images.unsplash.com/photo-1604665899314-b1b6a748b68c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "Adventure",
    isRecommended: false,
  },
  {
    id: 9,
    title: "Vienna's Art & Architecture Tour",
    location: "Vienna, Austria",
    price: "$1,199",
    duration: "5 days",
    imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "Cultural",
    isRecommended: true,
  },
  {
    id: 10,
    title: "Safari Adventure in Kenya",
    location: "Nairobi, Kenya",
    price: "$2,299",
    duration: "12 days",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "Adventure",
    isRecommended: true,
  }
];

const TravelContext = createContext();

export function TravelProvider({ children }) {
  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    country: "",
    city: "",
    priceRange: [0, 10000],
    isRecommendedOnly: false,
    category: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Use mock data directly
  const allTravelData = travelMockData;

  // Calculate initial price range from data
  const initialPriceStats = useMemo(() => {
    const prices = travelMockData
      .map((item) => {
        const priceStr = item.price.replace(/[$,]/g, "");
        return parseInt(priceStr);
      })
      .filter((price) => !isNaN(price));

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, []);

  // Filter the travel data based on current filters
  const filteredData = useMemo(() => {
    let filtered = [...allTravelData];

    // Filter by country
    if (filters.country) {
      filtered = filtered.filter((item) =>
        item.location.toLowerCase().includes(filters.country.toLowerCase())
      );
    }

    // Filter by city
    if (filters.city) {
      filtered = filtered.filter((item) =>
        item.location.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filter by price range
    const minPrice = filters.priceRange[0];
    const maxPrice = filters.priceRange[1];
    filtered = filtered.filter((item) => {
      // Extract price number from string like "$1,299"
      const priceStr = item.price.replace(/[$,]/g, "");
      const price = parseInt(priceStr);
      return !isNaN(price) && price >= minPrice && price <= maxPrice;
    });

    // Filter by recommended
    if (filters.isRecommendedOnly) {
      filtered = filtered.filter((item) => item.isRecommended);
    }

    return filtered;
  }, [allTravelData, filters]);

  // Calculate pagination for filtered data
  const totalItems = filteredData.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  // Get travel package by ID
  const getTravelPackageById = (id) => {
    return allTravelData.find((item) => item.id === parseInt(id));
  };

  // Get featured packages
  const getFeaturedPackages = (limit = 6) => {
    return allTravelData.filter((item) => item.isRecommended).slice(0, limit);
  };

  // Get packages by category
  const getPackagesByCategory = (category) => {
    return allTravelData.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  };

  // Search packages
  const searchPackages = (searchTerm) => {
    if (!searchTerm) return allTravelData;

    const term = searchTerm.toLowerCase();
    return allTravelData.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
    );
  };

  // Get available categories
  const getCategories = () => {
    const categories = [...new Set(allTravelData.map((item) => item.category))];
    return categories.map((category) => ({
      id: category.toLowerCase(),
      name: category,
      count: allTravelData.filter((item) => item.category === category).length,
    }));
  };

  // Get price range statistics
  const getPriceStats = () => {
    const prices = allTravelData
      .map((item) => {
        const priceStr = item.price.replace(/[$,]/g, "");
        return parseInt(priceStr);
      })
      .filter((price) => !isNaN(price));

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: Math.round(
        prices.reduce((sum, price) => sum + price, 0) / prices.length
      ),
    };
  };

  // Get available countries from location data
  const getCountries = () => {
    const countries = [...new Set(
      allTravelData.map((item) => {
        const parts = item.location.split(', ');
        return parts[parts.length - 1]; // Get the last part as country
      })
    )].sort();
    
    return [
      { label: "All Countries", value: "" },
      ...countries.map((country) => ({
        label: country,
        value: country.toLowerCase(),
      })),
    ];
  };

  // Get available cities from location data
  const getCities = () => {
    const cities = [...new Set(
      allTravelData.map((item) => {
        const parts = item.location.split(', ');
        return parts[0]; // Get the first part as city
      })
    )].sort();

    return [
      { label: "All Cities", value: "" },
      ...cities.map((city) => ({
        label: city,
        value: city.toLowerCase(),
      })),
    ];
  };

  const value = {
    // Data
    allTravelData,
    filteredData,
    currentItems,
    totalItems,

    // State
    loading,
    error,

    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages: Math.ceil(totalItems / itemsPerPage),

    // Filters
    filters,
    updateFilters,

    // Functions
    getTravelPackageById,
    getFeaturedPackages,
    getPackagesByCategory,
    searchPackages,
    getCategories,
    getPriceStats,
    getCountries,
    getCities,

    // Actions
    setLoading,
    setError,
  };

  return (
    <TravelContext.Provider value={value}>{children}</TravelContext.Provider>
  );
}

export function useTravelContext() {
  const context = useContext(TravelContext);
  if (context === undefined) {
    throw new Error("useTravelContext must be used within a TravelProvider");
  }
  return context;
}

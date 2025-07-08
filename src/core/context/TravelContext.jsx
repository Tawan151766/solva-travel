"use client";

import { createContext, useContext, useState, useMemo } from "react";

// Mock Travel Data - ย้ายมาจาก data/travelData.js
const travelMockData = [
  // ประเทศไทย
  {
    id: 1,
    title: "Island Hopping in Krabi",
    location: "Krabi, Thailand",
    price: "$599",
    duration: "5 days",
    imageUrl:
      "https://images.unsplash.com/photo-1600855380728-d17832d16fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 2,
    title: "Cultural Discovery in Chiang Mai",
    location: "Chiang Mai, Thailand",
    price: "$499",
    duration: "4 days",
    imageUrl:
      "https://images.unsplash.com/photo-1589885603410-1240d5c48f04?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 3,
    title: "City Life & Temples in Bangkok",
    location: "Bangkok, Thailand",
    price: "$699",
    duration: "5 days",
    imageUrl:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },

  // เวียดนาม
  {
    id: 4,
    title: "Ha Long Bay Cruise",
    location: "Ha Long, Vietnam",
    price: "$799",
    duration: "3 days",
    imageUrl:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 5,
    title: "Discover the Charm of Hanoi",
    location: "Hanoi, Vietnam",
    price: "$599",
    duration: "4 days",
    imageUrl:
      "https://images.unsplash.com/photo-1597915439281-e960f7dd14bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 6,
    title: "Ancient Beauty of Hoi An",
    location: "Hoi An, Vietnam",
    price: "$549",
    duration: "4 days",
    imageUrl:
      "https://images.unsplash.com/photo-1585059895521-f0b06004d4ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 7,
    title: "Explore Vibrant Ho Chi Minh City",
    location: "Ho Chi Minh City, Vietnam",
    price: "$699",
    duration: "5 days",
    imageUrl:
      "https://images.unsplash.com/photo-1620374641540-47a7dd6cb221?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },

  // ออสเตรีย
  {
    id: 8,
    title: "Winter Wonderland in Salzburg",
    location: "Salzburg, Austria",
    price: "$1,299",
    duration: "6 days",
    imageUrl:
      "https://images.unsplash.com/photo-1604665899314-b1b6a748b68c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 9,
    title: "Vienna's Art & Architecture Tour",
    location: "Vienna, Austria",
    price: "$1,199",
    duration: "5 days",
    imageUrl:
      "https://images.unsplash.com/photo-1618856319140-3fbaed03e7fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 10,
    title: "Alpine Adventure in Innsbruck",
    location: "Innsbruck, Austria",
    price: "$1,099",
    duration: "6 days",
    imageUrl:
      "https://images.unsplash.com/photo-1602261467347-e4b39f152b39?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
];

const TravelContext = createContext();

export function TravelProvider({ children }) {
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

  // States
  const [filters, setFilters] = useState({
    country: "",
    city: "",
    priceRange: [initialPriceStats.min, initialPriceStats.max],
    isRecommendedOnly: false,
    category: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 5;

  // All travel data
  const allTravelData = travelMockData;

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
        item.description.toLowerCase().includes(term) ||
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
  if (!context) {
    throw new Error("useTravelContext must be used within a TravelProvider");
  }
  return context;
}

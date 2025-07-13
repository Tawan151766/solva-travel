"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";

const TravelContext = createContext();

export function TravelProvider({ children }) {
  // States
  const [allTravelData, setAllTravelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate initial price range from data
  const initialPriceStats = useMemo(() => {
    if (allTravelData.length === 0) {
      return { min: 0, max: 5000 };
    }
    
    const prices = allTravelData
      .map((item) => {
        return parseFloat(item.priceNumber || item.price?.replace(/[$,]/g, "") || 0);
      })
      .filter((price) => !isNaN(price) && price > 0);

    if (prices.length === 0) {
      return { min: 0, max: 5000 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [allTravelData]);
  
  // Filter states with dynamic initial price range
  const [filters, setFilters] = useState({
    country: "",
    city: "",
    priceRange: [0, 5000],
    isRecommendedOnly: false,
    category: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch travel packages from database
  useEffect(() => {
    const fetchTravelPackages = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/travel/packages');
        
        if (!response.ok) {
          throw new Error('Failed to fetch travel packages');
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch travel packages');
        }

        setAllTravelData(result.data || []);
        
      } catch (err) {
        console.error('Error fetching travel packages:', err);
        setError(err.message);
        // Fallback to empty array on error
        setAllTravelData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTravelPackages();
  }, []);

  // Update price range when data loads
  useEffect(() => {
    if (allTravelData.length > 0 && filters.priceRange[0] === 0 && filters.priceRange[1] === 5000) {
      setFilters(prev => ({
        ...prev,
        priceRange: [initialPriceStats.min, initialPriceStats.max]
      }));
    }
  }, [allTravelData, initialPriceStats, filters.priceRange]);

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
        (item) => item.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filter by price range
    const minPrice = filters.priceRange[0];
    const maxPrice = filters.priceRange[1];
    filtered = filtered.filter((item) => {
      // Use priceNumber if available, otherwise extract from price string
      const price = parseFloat(item.priceNumber || item.price?.replace(/[$,]/g, "") || 0);
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
    return allTravelData.find((item) => item.id === id);
  };

  // Get available locations
  const getAvailableLocations = () => {
    const locations = allTravelData.map((item) => item.location);
    return [...new Set(locations)];
  };

  // Get available categories
  const getAvailableCategories = () => {
    const categories = allTravelData
      .map((item) => item.category)
      .filter(Boolean);
    return [...new Set(categories)];
  };

  // Navigation functions
  const goToPage = (page) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Calculate price statistics for the current filtered data
  const currentPriceStats = useMemo(() => {
    const prices = filteredData
      .map((item) => {
        const price = parseFloat(item.priceNumber || item.price?.replace(/[$,]/g, "") || 0);
        return isNaN(price) ? 0 : price;
      })
      .filter((price) => price > 0);

    if (prices.length === 0) {
      return { min: 0, max: 0, average: 0 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length),
    };
  }, [filteredData]);

  const value = {
    // Data
    allTravelData,
    currentItems,
    filteredData,
    
    // Pagination
    totalItems,
    currentPage,
    itemsPerPage,
    totalPages: Math.ceil(totalItems / itemsPerPage),
    
    // Loading states
    loading,
    error,
    
    // Filters
    filters,
    updateFilters,
    setFilters,
    
    // Navigation
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage,
    
    // Helper functions
    getTravelPackageById,
    getAvailableLocations,
    getAvailableCategories,
    
    // Statistics
    initialPriceStats,
    currentPriceStats,
  };

  return (
    <TravelContext.Provider value={value}>
      {children}
    </TravelContext.Provider>
  );
}

// Custom hook to use the travel context
export function useTravelContext() {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error("useTravelContext must be used within a TravelProvider");
  }
  return context;
}

export default TravelProvider;

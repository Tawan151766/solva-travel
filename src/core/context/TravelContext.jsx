"use client";

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";

const TravelContext = createContext();

export function TravelProvider({ children }) {
  console.log('🚀 TravelProvider: Component initialized');
  console.log('🚀 TravelProvider: useEffect about to be defined');
  
  // States
  const [allTravelData, setAllTravelData] = useState([]);
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

  console.log('🚀 TravelProvider: About to define useEffect');

  // Direct initialization approach - call immediately
  React.useMemo(() => {
    console.log('🔄 TravelContext useMemo triggered for initialization');
    
    if (allTravelData.length === 0 && !loading) {
      console.log('🔄 TravelContext: Starting immediate data fetch...');
      
      const loadData = async () => {
        console.log('🔄 TravelContext: Starting fetchTravelData...');
        try {
          setLoading(true);
          setError(null);

          // Check if we're on the client side
          const baseURL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
          console.log('🔄 TravelContext: Making API call to /api/travel/packages?limit=100');
          const response = await fetch(`${baseURL}/api/travel/packages?limit=100`);
          console.log('📡 TravelContext: API response status:', response.status, response.statusText);
          
          const result = await response.json();
          console.log('📦 TravelContext: API Response:', result);

          if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch travel data');
          }

          console.log('📦 TravelContext: Setting travel data:', result.data.packages);
          setAllTravelData(result.data.packages);

          console.log('✅ TravelContext: Travel data loaded:', result.data.packages.length, 'packages');
          
        } catch (err) {
          console.error('❌ TravelContext: Error fetching travel data:', err);
          setError(err.message);
        } finally {
          console.log('🏁 TravelContext: fetchTravelData finished, setting loading to false');
          setLoading(false);
        }
      };

      loadData();
    }
    
    return true;
  }, [allTravelData.length, loading]);

  // Load data immediately without useEffect to test
  React.useLayoutEffect(() => {
    console.log('🔄 TravelContext useLayoutEffect triggered!!!');
    
    const loadData = async () => {
      console.log('🔄 TravelContext: Starting fetchTravelData...');        try {
          setLoading(true);
          setError(null);

          // Check if we're on the client side  
          const baseURL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
          console.log('🔄 TravelContext: Making API call to /api/travel/packages?limit=100');
          const response = await fetch(`${baseURL}/api/travel/packages?limit=100`);
        console.log('📡 TravelContext: API response status:', response.status, response.statusText);
        
        const result = await response.json();
        console.log('📦 TravelContext: API Response:', result);

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch travel data');
        }

        console.log('📦 TravelContext: Setting travel data:', result.data.packages);
        setAllTravelData(result.data.packages);

        console.log('✅ TravelContext: Travel data loaded:', result.data.packages.length, 'packages');
        
      } catch (err) {
        console.error('❌ TravelContext: Error fetching travel data:', err);
        setError(err.message);
      } finally {
        console.log('🏁 TravelContext: fetchTravelData finished, setting loading to false');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  console.log('🚀 TravelProvider: useLayoutEffect defined, continuing with rest of component');

  // Get travel package by ID (with API call if needed)
  const getTravelPackageById = useCallback(async (id) => {
    // First check if we have it in local data
    const localPackage = allTravelData.find(pkg => pkg.id === parseInt(id));
    if (localPackage) {
      return localPackage;
    }

    // Fetch from API if not found locally
    try {
      const response = await fetch(`/api/travel/packages/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Package not found');
      }

      return result.data;
    } catch (err) {
      console.error('Error fetching package:', err);
      return null;
    }
  }, [allTravelData]);

  // Filter the travel data based on current filters
  const filteredData = useMemo(() => {
    let filtered = [...allTravelData];
    
    console.log('Filtering data:', {
      totalItems: allTravelData.length,
      filters: filters,
      sampleData: allTravelData[0]
    });

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
      // Handle price strings like "$1599.99" or already numeric values
      const priceValue = typeof item.price === 'string' 
        ? item.price.replace(/[$,]/g, '') 
        : item.price;
      const price = parseFloat(priceValue) || item.priceNumber || 0;
      return !isNaN(price) && price >= minPrice && price <= maxPrice;
    });

    // Filter by recommended
    if (filters.isRecommendedOnly) {
      filtered = filtered.filter((item) => item.isRecommended);
    }

    console.log('Filtered data result:', {
      originalCount: allTravelData.length,
      filteredCount: filtered.length,
      filters: filters
    });

    return filtered;
  }, [allTravelData, filters]);

  // Calculate pagination for filtered data
  const totalItems = filteredData.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  // Get featured packages
  const getFeaturedPackages = useCallback((limit = 6) => {
    return allTravelData
      .filter(pkg => pkg.isRecommended || pkg.featured)
      .slice(0, limit);
  }, [allTravelData]);

  // Get packages by category
  const getPackagesByCategory = useCallback((category, limit = 6) => {
    return allTravelData
      .filter(pkg => pkg.category?.toLowerCase() === category.toLowerCase())
      .slice(0, limit);
  }, [allTravelData]);

  // Search packages
  const searchPackages = useCallback((query, limit = 10) => {
    if (!query) return [];
    
    const lowercaseQuery = query.toLowerCase();
    return allTravelData
      .filter(pkg => 
        pkg.title.toLowerCase().includes(lowercaseQuery) ||
        pkg.location.toLowerCase().includes(lowercaseQuery) ||
        pkg.description?.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, limit);
  }, [allTravelData]);

  // Get categories
  const getCategories = useCallback(() => {
    const categories = [...new Set(
      allTravelData.map(pkg => pkg.category).filter(Boolean)
    )].sort();
    
    return [
      { label: "All Categories", value: "" },
      ...categories.map(category => ({
        label: category,
        value: category.toLowerCase(),
      })),
    ];
  }, [allTravelData]);

  // Get price statistics
  const getPriceStats = useCallback(() => {
    if (allTravelData.length === 0) {
      return { min: 0, max: 30000, average: 0 };
    }

    const prices = allTravelData
      .map(pkg => {
        // Handle price strings like "$1599.99" or already numeric values
        const priceValue = typeof pkg.price === 'string' 
          ? pkg.price.replace(/[$,]/g, '') 
          : pkg.price;
        return parseFloat(priceValue) || pkg.priceNumber || 0;
      })
      .filter(price => !isNaN(price) && price > 0);

    if (prices.length === 0) {
      return { min: 0, max: 30000, average: 0 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length),
    };
  }, [allTravelData]);

  // Get available countries from location data
  const getCountries = useCallback(() => {
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
  }, [allTravelData]);

  // Get available cities from location data
  const getCities = useCallback(() => {
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
  }, [allTravelData]);

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
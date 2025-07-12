"use client";

import { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";

const TravelContext = createContext();

export function TravelProvider({ children }) {
  // States
  const [allTravelData, setAllTravelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    country: "",
    city: "",
    priceRange: [0, 5000],
    isRecommendedOnly: false,
    category: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch all travel packages from API
  const fetchTravelData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/travel/packages?limit=100'); // Get all packages
      const result = await response.json();

      console.log('Travel API Response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch travel data');
      }

      console.log('Setting travel data:', result.data.packages);
      setAllTravelData(result.data.packages);

      // Update price range based on actual data
      if (result.data.packages.length > 0) {
        const prices = result.data.packages
          .map(pkg => parseFloat(pkg.price))
          .filter(price => !isNaN(price));
        
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        setFilters(prev => ({
          ...prev,
          priceRange: [minPrice, maxPrice]
        }));
      }

      console.log('Travel data loaded:', result.data.packages.length, 'packages');
      
    } catch (err) {
      console.error('Error fetching travel data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    console.log('useEffect triggered, calling fetchTravelData');
    fetchTravelData();
  }, [fetchTravelData]);

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
      const price = parseFloat(item.price);
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
      return { min: 0, max: 5000, average: 0 };
    }

    const prices = allTravelData
      .map(pkg => parseFloat(pkg.price))
      .filter(price => !isNaN(price));

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
    fetchTravelData,

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
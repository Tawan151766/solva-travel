"use client";

import { createContext, useContext, useState, useMemo, useEffect } from 'react';

const TravelContext = createContext();

export function TravelProvider({ children }) {
  console.log('🚀 TravelProvider: Component mounted');
  console.log('🚀 TravelProvider: About to set up useState hooks');
  
  const [allTravelData, setAllTravelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log('🚀 TravelProvider: useState hooks set up');
  console.log('🚀 TravelProvider: Current state - loading:', loading, 'data length:', allTravelData.length);
  
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    priceRange: [0, 3000],
    isRecommendedOnly: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  console.log('🚀 TravelProvider: About to set up useEffect');

  // Fetch travel packages from database API
  useEffect(() => {
    console.log('🚀🚀🚀 TravelContext: useEffect triggered - STARTING FETCH!');
    console.log('🚀🚀🚀 TravelContext: useEffect triggered - current loading state:', loading);
    console.log('🚀🚀🚀 TravelContext: useEffect triggered - current data length:', allTravelData.length);
    
    const fetchTravelPackages = async () => {
      try {
        console.log('🚀🚀🚀 TravelContext: Starting fetch...');
        setLoading(true);
        setError(null);

        console.log('🚀🚀🚀 TravelContext: About to call /api/travel/packages');
        const response = await fetch('/api/travel/packages');
        console.log('🚀🚀🚀 TravelContext: Got response:', response);
        
        if (!response.ok) {
          throw new Error('Failed to fetch travel packages');
        }

        const result = await response.json();
        console.log('🚀🚀🚀 TravelContext: Got result:', result);
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch travel packages');
        }

        // Handle the nested data structure from API
        const packages = result.data?.packages || result.data || [];
        console.log('🚀🚀🚀 TravelContext: API result:', result);
        console.log('🚀🚀🚀 TravelContext: Extracted packages:', packages);
        console.log('🚀🚀🚀 TravelContext: Packages count:', packages.length);
        setAllTravelData(packages);
      } catch (err) {
        console.error('🚀🚀🚀 TravelContext: Error fetching travel packages:', err);
        setError(err.message);
      } finally {
        console.log('🚀🚀🚀 TravelContext: Setting loading to false');
        setLoading(false);
      }
    };

    console.log('🚀🚀🚀 TravelContext: About to call fetchTravelPackages');
    fetchTravelPackages();
    console.log('🚀🚀🚀 TravelContext: Called fetchTravelPackages');
  }, []);

  // Filter the travel data based on current filters
  const filteredData = useMemo(() => {
    let filtered = [...allTravelData];

    // Filter by country
    if (filters.country) {
      filtered = filtered.filter(item => 
        item.location?.toLowerCase().includes(filters.country.toLowerCase()) ||
        item.destination?.toLowerCase().includes(filters.country.toLowerCase())
      );
    }

    // Filter by city
    if (filters.city) {
      filtered = filtered.filter(item => 
        item.location?.toLowerCase().includes(filters.city.toLowerCase()) ||
        item.destination?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Filter by price range
    const minPrice = filters.priceRange[0];
    const maxPrice = filters.priceRange[1];
    filtered = filtered.filter(item => {
      // Convert Decimal price to number
      const price = parseFloat(item.price);
      return !isNaN(price) && price >= minPrice && price <= maxPrice;
    });

    // Filter by recommended
    if (filters.isRecommendedOnly) {
      filtered = filtered.filter(item => item.isRecommended === true);
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
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  // Function to get travel package by ID
  const getTravelPackageById = (id) => {
    return allTravelData.find(item => item.id === id);
  };

  // Helper functions for SearchFilters
  const getCountries = () => {
    const countries = [...new Set(allTravelData.map(item => 
      item.destination || item.location || ''
    ).filter(Boolean))];
    return countries.map(country => ({ value: country, label: country }));
  };

  const getCities = () => {
    const cities = [...new Set(allTravelData.map(item => 
      item.destination || item.location || ''
    ).filter(Boolean))];
    return cities.map(city => ({ value: city, label: city }));
  };

  const getPriceStats = () => {
    if (!Array.isArray(allTravelData) || allTravelData.length === 0) {
      return { min: 0, max: 3000 };
    }
    
    const prices = allTravelData
      .map(item => parseFloat(item.price))
      .filter(price => !isNaN(price) && price > 0);
    
    if (prices.length === 0) {
      return { min: 0, max: 3000 };
    }
    
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  };

  const value = {
    // Data
    allTravelData,
    filteredData,
    currentItems,
    totalItems,
    
    // Loading states
    loading,
    error,
    
    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    
    // Filters
    filters,
    updateFilters,
    
    // Helper functions
    getTravelPackageById,
    getCountries,
    getCities,
    getPriceStats,
  };

  return (
    <TravelContext.Provider value={value}>
      {children}
    </TravelContext.Provider>
  );
}

export function useTravelContext() {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravelContext must be used within a TravelProvider');
  }
  return context;
}

"use client";

import { createContext, useContext, useState, useMemo } from 'react';
import { travelData } from '../data/travelData';

const TravelContext = createContext();

export function TravelProvider({ children }) {
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    priceRange: [0, 3000],
    isRecommendedOnly: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter the travel data based on current filters
  const filteredData = useMemo(() => {
    let filtered = [...travelData];

    // Filter by country
    if (filters.country) {
      filtered = filtered.filter(item => 
        item.location.toLowerCase().includes(filters.country.toLowerCase())
      );
    }

    // Filter by city
    if (filters.city) {
      filtered = filtered.filter(item => 
        item.location.toLowerCase().includes(filters.city.toLowerCase())
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

    // Filter by recommended (mock implementation - using price as criteria)
    if (filters.isRecommendedOnly) {
      filtered = filtered.filter(item => {
        const price = parseFloat(item.price);
        return !isNaN(price) && price >= 1000; // Consider packages >= $1000 as recommended
      });
    }

    return filtered;
  }, [filters]);

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

  const value = {
    // Data
    allTravelData: travelData,
    filteredData,
    currentItems,
    totalItems,
    
    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    
    // Filters
    filters,
    updateFilters,
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

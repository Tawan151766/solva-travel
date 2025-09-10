'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [packages, setPackages] = useState([]);
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    priceRange: [549, 2299],
    isRecommendedOnly: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    console.log('🎯 FilterContext: Fetching packages...');
    fetch('/api/travel/packages')
      .then(res => res.json())
      .then(data => {
        console.log('🎯 FilterContext: Got data:', data);
        if (data.success) {
          setPackages(data.data.packages || []);
        } else {
          setError('Failed to load packages');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('🎯 FilterContext: Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter packages based on current filters
  const filteredPackages = packages.filter(pkg => {
    // Country filter
    if (filters.country) {
      const packageLocation = pkg.destination || pkg.location || '';
      if (!packageLocation.toLowerCase().includes(filters.country.toLowerCase())) {
        return false;
      }
    }

    // City filter
    if (filters.city) {
      const packageCity = pkg.city || '';
      if (!packageCity.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }
    }

    // Price range filter
    const packagePrice = pkg.priceNumber || parseFloat(pkg.price?.replace(/[^0-9.]/g, '')) || 0;
    if (packagePrice < filters.priceRange[0] || packagePrice > filters.priceRange[1]) {
      return false;
    }

    // Recommended filter
    if (filters.isRecommendedOnly && !pkg.isRecommended) {
      return false;
    }

    return true;
  });

  // อัพเดต filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const value = {
    packages,
    filteredPackages,
    filters,
    updateFilters,
    loading,
    error
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}

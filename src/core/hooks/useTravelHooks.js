import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing travel packages
 */
export function useTravelPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // This would be replaced with actual API calls
  const loadPackages = useCallback(async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, this would fetch from API
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    packages,
    loading,
    error,
    loadPackages,
    setPackages
  };
}

/**
 * Hook for managing favorite packages
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('travel-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const addToFavorites = (packageId) => {
    const newFavorites = [...favorites, packageId];
    setFavorites(newFavorites);
    localStorage.setItem('travel-favorites', JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (packageId) => {
    const newFavorites = favorites.filter(id => id !== packageId);
    setFavorites(newFavorites);
    localStorage.setItem('travel-favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (packageId) => {
    return favorites.includes(packageId);
  };

  const toggleFavorite = (packageId) => {
    if (isFavorite(packageId)) {
      removeFromFavorites(packageId);
    } else {
      addToFavorites(packageId);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    favoritesCount: favorites.length
  };
}

/**
 * Hook for managing travel filters
 */
export function useTravelFilters() {
  const [filters, setFilters] = useState({
    destination: '',
    priceRange: [0, 5000],
    duration: '',
    category: '',
    rating: 0
  });

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      destination: '',
      priceRange: [0, 5000],
      duration: '',
      category: '',
      rating: 0
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) {
      return value[0] !== 0 || value[1] !== 5000;
    }
    return value !== '' && value !== 0;
  });

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    setFilters
  };
}

/**
 * Hook for price calculations
 */
export function usePriceCalculations() {
  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    return originalPrice - (originalPrice * discountPercentage / 100);
  };

  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const calculateTotalPrice = (basePrice, extras = []) => {
    const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
    return basePrice + extrasTotal;
  };

  return {
    calculateDiscountedPrice,
    formatPrice,
    calculateTotalPrice
  };
}

/**
 * Hook for booking management
 */
export function useBooking() {
  const [bookingData, setBookingData] = useState({
    packageId: null,
    travelers: 1,
    dates: {
      departure: null,
      return: null
    },
    extras: [],
    totalPrice: 0
  });

  const updateBookingData = (updates) => {
    setBookingData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetBooking = () => {
    setBookingData({
      packageId: null,
      travelers: 1,
      dates: {
        departure: null,
        return: null
      },
      extras: [],
      totalPrice: 0
    });
  };

  const addExtra = (extra) => {
    setBookingData(prev => ({
      ...prev,
      extras: [...prev.extras, extra]
    }));
  };

  const removeExtra = (extraId) => {
    setBookingData(prev => ({
      ...prev,
      extras: prev.extras.filter(extra => extra.id !== extraId)
    }));
  };

  return {
    bookingData,
    updateBookingData,
    resetBooking,
    addExtra,
    removeExtra
  };
}

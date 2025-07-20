import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for API calls with loading, error, and data states
 */
export function useApi(apiFunction, dependencies = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      if (result && result.error) {
        setError(result.error);
        setData(null);
      } else {
        setData(result && result.data ? result.data : result);
        setError(null);
      }
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      setData(null);
      return { data: null, error: err.message || 'An error occurred' };
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (immediate && apiFunction) {
      execute();
    }
  }, [immediate, execute, ...dependencies]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute
  };
}

/**
 * Custom hook for paginated data
 */
export function usePagination(data = [], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  const goToFirstPage = () => {
    goToPage(1);
  };

  const goToLastPage = () => {
    goToPage(totalPages);
  };

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  return {
    currentItems,
    currentPage,
    totalPages,
    totalItems: data.length,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    setCurrentPage
  };
}

/**
 * Custom hook for search with debounce
 */
export function useSearch(searchFunction, delay = 500) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const searchResults = await searchFunction(searchTerm);
        setResults(searchResults || []);
      } catch (err) {
        setError(err.message || 'Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, delay, searchFunction]);

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setError(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    clearSearch,
    hasResults: results.length > 0
  };
}

/**
 * Custom hook for local storage
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}

/**
 * Custom hook for filters
 */
export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const clearFilter = (key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const hasActiveFilters = () => {
    return Object.keys(filters).some(key => {
      const value = filters[key];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== '' && value !== null && value !== undefined;
    });
  };

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    clearFilter,
    hasActiveFilters: hasActiveFilters(),
    setFilters
  };
}

/**
 * Custom hook for toggle state
 */
export function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);

  const toggle = () => setState(prev => !prev);
  const setTrue = () => setState(true);
  const setFalse = () => setState(false);

  return [state, { toggle, setTrue, setFalse, setState }];
}

/**
 * Custom hook for async operations
 */
export function useAsync(asyncFunction, immediate = true) {
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return {
    loading,
    error,
    data,
    execute
  };
}

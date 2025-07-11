"use client";

import { createContext, useContext, useState, useMemo, useEffect } from 'react';

const StaffContext = createContext();

export function StaffProvider({ children }) {
  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allStaffData, setAllStaffData] = useState([]);
  const [allReviewsData, setAllReviewsData] = useState([]);
  
  // Review filters
  const [reviewFilters, setReviewFilters] = useState({
    rating: null,
    sortBy: 'newest', // 'newest', 'oldest', 'highest', 'lowest'
    staffId: null,
    tripType: null
  });

  // Fetch all staff data from API
  const fetchStaffData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/staff?limit=100'); // Get all staff
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch staff data');
      }

      setAllStaffData(result.data.staff);
      
      // Flatten all reviews from all staff
      const allReviews = result.data.staff.reduce((acc, staff) => {
        const staffReviews = staff.reviews || [];
        return acc.concat(staffReviews.map(review => ({
          ...review,
          staffId: staff.id
        })));
      }, []);
      
      setAllReviewsData(allReviews);

      console.log('Staff data loaded:', result.data.staff.length, 'staff members');
      
    } catch (err) {
      console.error('Error fetching staff data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single staff member with full details
  const fetchStaffById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/staff/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch staff member');
      }

      return result.data;
      
    } catch (err) {
      console.error('Error fetching staff member:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchStaffData();
  }, []);

  // Get staff member by ID (with API call for full details)
  const getStaffById = async (id) => {
    // First check if we have it in local data
    const localStaff = allStaffData.find(member => member.id === id);
    if (localStaff && localStaff.reviews) {
      return localStaff;
    }

    // Fetch full details from API
    return await fetchStaffById(id);
  };

  // Get staff reviews with filters
  const getStaffReviews = (staffId, filters = reviewFilters) => {
    let filtered = allReviewsData.filter(review => review.staffId === staffId);

    // Apply filters
    if (filters.rating) {
      filtered = filtered.filter(review => review.rating === filters.rating);
    }

    if (filters.tripType) {
      filtered = filtered.filter(review => 
        review.tripType.toLowerCase().includes(filters.tripType.toLowerCase())
      );
    }

    // Sort reviews
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'oldest':
          filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case 'highest':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'lowest':
          filtered.sort((a, b) => a.rating - b.rating);
          break;
        default:
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    }

    return filtered;
  };

  // Get all reviews with filters
  const getAllReviews = (filters = reviewFilters) => {
    let filtered = [...allReviewsData];

    // Apply filters
    if (filters.rating) {
      filtered = filtered.filter(review => review.rating === filters.rating);
    }

    if (filters.staffId) {
      filtered = filtered.filter(review => review.staffId === filters.staffId);
    }

    if (filters.tripType) {
      filtered = filtered.filter(review => 
        review.tripType.toLowerCase().includes(filters.tripType.toLowerCase())
      );
    }

    // Sort reviews
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'oldest':
          filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case 'highest':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'lowest':
          filtered.sort((a, b) => a.rating - b.rating);
          break;
        default:
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    }

    return filtered;
  };

  // Calculate review statistics for a staff member
  const getStaffReviewStats = (staffId) => {
    const staffReviews = allReviewsData.filter(review => review.staffId === staffId);
    
    if (staffReviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const totalReviews = staffReviews.length;
    const averageRating = staffReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    staffReviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution
    };
  };

  // Get overall staff statistics
  const getOverallStats = () => {
    const totalStaff = allStaffData.length;
    const totalReviews = allReviewsData.length;
    const averageRating = totalReviews > 0 
      ? allReviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allReviewsData.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    return {
      totalStaff,
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution
    };
  };

  // Get staff by specialty
  const getStaffBySpecialty = (specialty) => {
    return allStaffData.filter(staff => 
      staff.specialties.some(s => 
        s.toLowerCase().includes(specialty.toLowerCase())
      )
    );
  };

  // Search staff
  const searchStaff = (searchTerm) => {
    if (!searchTerm) return allStaffData;
    
    const term = searchTerm.toLowerCase();
    return allStaffData.filter(staff =>
      staff.name.toLowerCase().includes(term) ||
      staff.title.toLowerCase().includes(term) ||
      staff.bio.toLowerCase().includes(term) ||
      staff.specialties.some(specialty => 
        specialty.toLowerCase().includes(term)
      )
    );
  };

  // Get unique trip types from reviews
  const getTripTypes = () => {
    const tripTypes = [...new Set(allReviewsData.map(review => review.tripType))];
    return tripTypes.map(type => ({
      id: type.toLowerCase().replace(/\s+/g, '-'),
      name: type,
      count: allReviewsData.filter(review => review.tripType === type).length
    }));
  };

  // Update review filters
  const updateReviewFilters = (newFilters) => {
    setReviewFilters(prev => ({ ...prev, ...newFilters }));
  };

  const value = {
    // Data
    allStaffData,
    allReviewsData,
    
    // State
    loading,
    error,
    
    // Filters
    reviewFilters,
    updateReviewFilters,
    
    // Functions
    getStaffById,
    fetchStaffById,
    fetchStaffData,
    getStaffReviews,
    getAllReviews,
    getStaffReviewStats,
    getOverallStats,
    getStaffBySpecialty,
    searchStaff,
    getTripTypes,
    
    // Actions
    setLoading,
    setError,
  };

  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaffContext() {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaffContext must be used within a StaffProvider');
  }
  return context;
}

"use client";

import { createContext, useContext, useState, useMemo } from 'react';

// Mock Staff Data - ย้ายมาจาก data/staffData.js
const staffMockData = [
  {
    id: "1",
    name: "Emily Carter",
    title: "Travel Expert",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face",
    bio: "Experienced travel expert with over 10 years in the industry. Specializes in Asian destinations and adventure travel.",
    rating: 4.6,
    totalReviews: 234,
    specialties: ["Adventure Travel", "Cultural Tours", "Budget Travel"],
    languages: ["English", "Thai", "Japanese"],
    experience: "10 years",
    email: "emily.carter@solvatravel.com",
    phone: "+1-555-0123"
  },
  {
    id: "2", 
    name: "James Wilson",
    title: "Adventure Guide",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: "Professional adventure guide specializing in mountain climbing and outdoor activities.",
    rating: 4.8,
    totalReviews: 156,
    specialties: ["Mountain Climbing", "Hiking", "Outdoor Adventure"],
    languages: ["English", "Spanish", "French"],
    experience: "8 years",
    email: "james.wilson@solvatravel.com",
    phone: "+1-555-0124"
  },
  {
    id: "3",
    name: "Sarah Johnson",
    title: "Luxury Travel Specialist",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    bio: "Luxury travel specialist with expertise in high-end resorts and exclusive experiences.",
    rating: 4.9,
    totalReviews: 189,
    specialties: ["Luxury Travel", "Honeymoon Packages", "Private Tours"],
    languages: ["English", "Italian", "German"],
    experience: "12 years",
    email: "sarah.johnson@solvatravel.com",
    phone: "+1-555-0125"
  },
  {
    id: "4",
    name: "Michael Chen",
    title: "Cultural Tour Guide",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bio: "Cultural expert specializing in historical sites and local traditions across Asia.",
    rating: 4.7,
    totalReviews: 167,
    specialties: ["Cultural Tours", "Historical Sites", "Local Experiences"],
    languages: ["English", "Mandarin", "Korean"],
    experience: "9 years",
    email: "michael.chen@solvatravel.com",
    phone: "+1-555-0126"
  },
  {
    id: "5",
    name: "Lisa Rodriguez",
    title: "Family Travel Coordinator",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
    bio: "Family travel specialist who creates memorable experiences for travelers of all ages.",
    rating: 4.5,
    totalReviews: 203,
    specialties: ["Family Travel", "Kid-Friendly Tours", "Educational Trips"],
    languages: ["English", "Spanish", "Portuguese"],
    experience: "7 years",
    email: "lisa.rodriguez@solvatravel.com",
    phone: "+1-555-0127"
  }
];

// Mock Reviews Data
const reviewsMockData = [
  {
    id: "1",
    staffId: "1",
    reviewerName: "Sophia Clark",
    reviewerImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "2023-09-15",
    comment: "Emily was incredibly helpful and knowledgeable, making our trip to Thailand seamless and enjoyable. Her attention to detail was impressive.",
    likes: 12,
    dislikes: 2,
    tripType: "Cultural Tour",
    destination: "Thailand"
  },
  {
    id: "2",
    staffId: "1",
    reviewerName: "Ethan Miller",
    reviewerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    date: "2023-08-22",
    comment: "Overall, Emily was good, but there were a few minor issues with communication. She was responsive, but some information was unclear.",
    likes: 5,
    dislikes: 1,
    tripType: "Adventure Travel",
    destination: "Nepal"
  },
  {
    id: "3",
    staffId: "1",
    reviewerName: "Olivia Davis",
    reviewerImage: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "2023-10-01",
    comment: "Excellent service! Emily went above and beyond to ensure our honeymoon was perfect. Highly recommend her expertise.",
    likes: 18,
    dislikes: 0,
    tripType: "Honeymoon",
    destination: "Bali"
  },
  {
    id: "4",
    staffId: "2",
    reviewerName: "Alex Thompson",
    reviewerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "2023-09-10",
    comment: "James is an amazing adventure guide! The mountain climbing expedition was challenging but safe. He knows his stuff!",
    likes: 15,
    dislikes: 1,
    tripType: "Mountain Climbing",
    destination: "Swiss Alps"
  },
  {
    id: "5",
    staffId: "2",
    reviewerName: "Emma Wilson",
    reviewerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    date: "2023-07-18",
    comment: "Great hiking experience with James. Very knowledgeable about the terrain and safety protocols.",
    likes: 8,
    dislikes: 0,
    tripType: "Hiking",
    destination: "Rocky Mountains"
  },
  {
    id: "6",
    staffId: "3",
    reviewerName: "David Brown",
    reviewerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "2023-09-25",
    comment: "Sarah planned the most luxurious vacation for us. Every detail was perfect, from the hotels to the dining experiences.",
    likes: 22,
    dislikes: 0,
    tripType: "Luxury Travel",
    destination: "Paris"
  },
  {
    id: "7",
    staffId: "4",
    reviewerName: "Grace Lee",
    reviewerImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "2023-08-14",
    comment: "Michael's cultural knowledge is incredible. He brought history to life during our tour of ancient temples.",
    likes: 19,
    dislikes: 1,
    tripType: "Cultural Tour",
    destination: "Japan"
  },
  {
    id: "8",
    staffId: "5",
    reviewerName: "Robert Taylor",
    reviewerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    date: "2023-10-05",
    comment: "Lisa was great with our kids! She planned activities that kept them engaged throughout the trip.",
    likes: 11,
    dislikes: 2,
    tripType: "Family Travel",
    destination: "Orlando"
  }
];

const StaffContext = createContext();

export function StaffProvider({ children }) {
  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Review filters
  const [reviewFilters, setReviewFilters] = useState({
    rating: null,
    sortBy: 'newest', // 'newest', 'oldest', 'highest', 'lowest'
    staffId: null,
    tripType: null
  });

  // All data
  const allStaffData = staffMockData;
  const allReviewsData = reviewsMockData;

  // Get staff member by ID
  const getStaffById = (id) => {
    return allStaffData.find(member => member.id === id);
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

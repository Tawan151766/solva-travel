"use client";

import { notFound } from "next/navigation";
import { Suspense, use, useState, useEffect, useCallback } from "react";
import { useStaffContext } from "@/core/context";
import { StaffProfile } from "@/components/pages/staff/StaffProfile";
import { ReviewStats } from "@/components/pages/staff/ReviewStats";
import { ReviewsList } from "@/components/pages/staff/ReviewsList";
import { StaffBreadcrumb, StaffNavigation } from "@/components/pages/staff/StaffNavigation";
import { ReviewsErrorWrapper } from "@/components/pages/staff/ReviewsErrorBoundary";
import { ReviewsLoading } from "@/components/pages/staff/ReviewsLoading";

export default function StaffPage({ params }) {
  // Unwrap params Promise using React.use()
  const { id } = use(params);
  const { allStaffData, getStaffById, loading, error } = useStaffContext();
  
  const [staff, setStaff] = useState(null);
  const [staffLoading, setStaffLoading] = useState(true);
  const [staffError, setStaffError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load staff data
  const loadStaff = useCallback(async () => {
    try {
      setStaffLoading(true);
      setStaffError(null);
      
      const staffData = await getStaffById(id);
      if (!staffData) {
        notFound();
        return;
      }
      
      setStaff(staffData);
    } catch (err) {
      console.error('Error loading staff:', err);
      setStaffError(err.message);
    } finally {
      setStaffLoading(false);
    }
  }, [id, getStaffById]);

  // Refresh staff data
  const refreshStaff = useCallback(async () => {
    try {
      setRefreshing(true);
      setStaffError(null);
      
      const response = await fetch(`/api/staff/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to refresh staff data');
      }

      setStaff(result.data);
    } catch (err) {
      console.error('Error refreshing staff:', err);
      setStaffError(err.message);
    } finally {
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]); // Now depend on the memoized loadStaff function

  // Loading state
  if (staffLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black relative px-2 sm:px-4 lg:px-8 py-4 sm:py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading staff member...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (staffError || !staff) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black relative px-2 sm:px-4 lg:px-8 py-4 sm:py-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-bold mb-2">Staff Member Not Found</h2>
          <p className="text-white/70 text-sm mb-6">{staffError || 'This staff member could not be found.'}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadStaff}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] hover:from-[#FFED4E] hover:to-[#FFD700] text-black px-6 py-3 rounded-full font-semibold transition-all"
            >
              Try Again
            </button>
            <a
              href="/staff"
              className="bg-black/60 hover:bg-black/80 text-white border border-[#FFD700]/30 hover:border-[#FFD700] px-6 py-3 rounded-full font-semibold transition-all"
            >
              Back to Staff
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Get reviews for this staff member
  const staffReviews = staff.reviews || [];
  
  // Get rating breakdown for this staff member
  const ratingBreakdown = staff.ratingBreakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black relative px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
      {/* Luxury Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Breadcrumb Navigation */}
        <StaffBreadcrumb staffName={staff.name} />
        
        {/* Staff Navigation */}
        <StaffNavigation 
          currentStaffId={id}
          allStaff={allStaffData}
        />

        {/* Header with Refresh Button */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div className="max-w-4xl">
            <h1 className="text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-2 sm:mb-3">
              Staff Reviews
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-normal leading-normal">
              Read what other travelers have to say about {staff.name} and our staff.
            </p>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={refreshStaff}
            disabled={refreshing}
            className="bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 hover:from-[#FFD700]/30 hover:to-[#FFED4E]/30 border border-[#FFD700]/30 hover:border-[#FFD700] text-[#FFD700] px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
          {/* Reviews Section */}
          <div className="order-2 lg:order-1">
            <ReviewsErrorWrapper>
              <Suspense fallback={<ReviewsLoading />}>
                {/* Review Statistics */}
                <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-xl mb-6 overflow-hidden border border-[#FFD700]/20 shadow-2xl shadow-black/50">
                  <ReviewStats 
                    rating={staff.rating}
                    totalReviews={staff.totalReviews}
                    ratingBreakdown={ratingBreakdown}
                  />
                </div>

                {/* Reviews List */}
                <ReviewsList reviews={staffReviews} />
              </Suspense>
            </ReviewsErrorWrapper>
          </div>

          {/* Staff Profile Sidebar */}
          <div className="order-1 lg:order-2">
            <StaffProfile staff={staff} />
          </div>
        </div>
      </div>
    </div>
  );
}

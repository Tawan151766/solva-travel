"use client";

import { notFound } from "next/navigation";
import { Suspense, use } from "react";
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
  const { allStaffData, allReviewsData, getStaffReviewStats } = useStaffContext();

  // Find staff member
  const staff = allStaffData.find(member => member.id === id);
  
  if (!staff) {
    notFound();
  }

  // Get reviews for this staff member
  const staffReviews = allReviewsData.filter(review => review.staffId === id);
  
  // Get rating breakdown for this staff member
  const ratingBreakdown = getStaffReviewStats(id);

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

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="max-w-4xl">
            <h1 className="text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-2 sm:mb-3">
              Staff Reviews
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-normal leading-normal">
              Read what other travelers have to say about {staff.name} and our staff.
            </p>
          </div>
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

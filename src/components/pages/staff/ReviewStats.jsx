"use client";

import React from "react";
import { StarRating } from "@/components/ui/StarRating";

export function ReviewStats({ rating, totalReviews, ratingBreakdown }) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 p-4 mb-6">
      {/* Overall Rating */}
      <div className="flex flex-col items-center sm:items-start">
        <p className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] mb-2">
          {rating}
        </p>
        <StarRating rating={Math.floor(rating)} size="18" className="mb-2" />
        <p className="text-white text-sm sm:text-base font-normal leading-normal">
          {totalReviews} reviews
        </p>
      </div>

      {/* Rating Breakdown */}
      <div className="grid grid-cols-[20px_1fr_40px] sm:grid-cols-[20px_1fr_60px] items-center gap-y-2 sm:gap-y-3 flex-1 min-w-[200px] max-w-[400px]">
        {[5, 4, 3, 2, 1].map((star) => (
          <React.Fragment key={star}>
            <p className="text-white text-sm font-normal leading-normal">{star}</p>
            <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#5a553f] mx-2">
              <div 
                className="rounded-full bg-[#fcfbf7] transition-all duration-500" 
                style={{ width: `${ratingBreakdown[star] || 0}%` }}
              />
            </div>
            <p className="text-[#bcb69f] text-sm font-normal leading-normal text-right">
              {ratingBreakdown[star] || 0}%
            </p>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";

export function ReviewsLoading() {
  return (
    <div className="space-y-6">
      {/* Stats Loading Skeleton */}
      <div className="bg-[#1e1c15] rounded-xl p-4 sm:p-6 animate-pulse">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          {/* Overall Rating Skeleton */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="h-12 w-16 bg-[#2a2821] rounded mb-2"></div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-5 w-5 bg-[#2a2821] rounded"></div>
              ))}
            </div>
            <div className="h-4 w-20 bg-[#2a2821] rounded"></div>
          </div>

          {/* Rating Breakdown Skeleton */}
          <div className="grid grid-cols-[20px_1fr_40px] sm:grid-cols-[20px_1fr_60px] items-center gap-y-3 flex-1 min-w-[200px] max-w-[400px]">
            {[...Array(5)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="h-4 w-4 bg-[#2a2821] rounded"></div>
                <div className="h-2 bg-[#2a2821] rounded-full mx-2"></div>
                <div className="h-4 w-8 bg-[#2a2821] rounded"></div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List Loading Skeleton */}
      <div className="bg-[#1e1c15] rounded-xl overflow-hidden">
        {/* Header Skeleton */}
        <div className="p-4 border-b border-[#2a2821]">
          <div className="h-6 w-32 bg-[#2a2821] rounded mb-4"></div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="h-10 w-full sm:w-40 bg-[#2a2821] rounded-full"></div>
            <div className="h-10 w-full sm:w-40 bg-[#2a2821] rounded-full"></div>
          </div>
        </div>

        {/* Review Cards Skeleton */}
        <div className="p-4 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border border-[#2a2821] rounded-lg">
              {/* Reviewer Info Skeleton */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#2a2821] rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 w-24 bg-[#2a2821] rounded mb-1"></div>
                  <div className="h-3 w-16 bg-[#2a2821] rounded"></div>
                </div>
              </div>

              {/* Rating Skeleton */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-5 w-5 bg-[#2a2821] rounded"></div>
                ))}
              </div>

              {/* Review Text Skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-[#2a2821] rounded w-full"></div>
                <div className="h-4 bg-[#2a2821] rounded w-3/4"></div>
                <div className="h-4 bg-[#2a2821] rounded w-1/2"></div>
              </div>

              {/* Like/Dislike Skeleton */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-[#2a2821] rounded"></div>
                  <div className="h-4 w-6 bg-[#2a2821] rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-[#2a2821] rounded"></div>
                  <div className="h-4 w-6 bg-[#2a2821] rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

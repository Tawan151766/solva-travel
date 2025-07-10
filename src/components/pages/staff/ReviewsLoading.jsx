"use client";

import React from "react";

export function ReviewsLoading() {
  return (
    <div className="space-y-6">
      {/* Stats Loading Skeleton */}
      <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-xl p-4 sm:p-6 animate-pulse border border-[#FFD700]/20 shadow-2xl shadow-black/50">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          {/* Overall Rating Skeleton */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="h-12 w-16 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded mb-2"></div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-5 w-5 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded"></div>
              ))}
            </div>
            <div className="h-4 w-20 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded"></div>
          </div>

          {/* Rating Breakdown Skeleton */}
          <div className="grid grid-cols-[20px_1fr_40px] sm:grid-cols-[20px_1fr_60px] items-center gap-y-3 flex-1 min-w-[200px] max-w-[400px]">
            {[...Array(5)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="h-4 w-4 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded"></div>
                <div className="h-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded-full mx-2"></div>
                <div className="h-4 w-8 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded"></div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List Loading Skeleton */}
      <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-xl overflow-hidden border border-[#FFD700]/20 shadow-2xl shadow-black/50">
        {/* Header Skeleton */}
        <div className="p-4 border-b border-[#FFD700]/20">
          <div className="h-6 w-32 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded mb-4"></div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="h-10 w-full sm:w-40 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded-full"></div>
            <div className="h-10 w-full sm:w-40 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded-full"></div>
          </div>
        </div>

        {/* Review Cards Skeleton */}
        <div className="p-4 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border border-[#FFD700]/20 rounded-lg bg-gradient-to-br from-black/60 via-[#0a0804]/60 to-black/60 backdrop-blur-md">
              {/* Reviewer Info Skeleton */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded mb-1"></div>
                  <div className="h-3 w-16 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded"></div>
                </div>
              </div>

              {/* Rating Skeleton */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-5 w-5 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded"></div>
                ))}
              </div>

              {/* Review Text Skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded w-full"></div>
                <div className="h-4 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded w-1/2"></div>
              </div>

              {/* Like/Dislike Skeleton */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded"></div>
                  <div className="h-4 w-6 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded"></div>
                  <div className="h-4 w-6 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export function GalleryImageCard({ imageUrl, title, category, onClick }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex flex-col gap-2 sm:gap-3 group cursor-pointer gallery-card" onClick={onClick}>
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl">
        <div
          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-300"
          style={{
            backgroundImage: `url("${imageUrl}")`
          }}
          onLoad={() => setIsLoading(false)}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-lg sm:rounded-xl" />
          )}
        </div>
        
        {/* Overlay with info - Enhanced */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl">
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 text-white">
            <p className="text-xs sm:text-sm font-medium text-[#FFD700]">{title}</p>
            <p className="text-xs text-white/80">{category}</p>
          </div>
          
          {/* Click to view icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 rounded-full p-2 sm:p-3 shadow-lg shadow-[#FFD700]/20">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-[#FFD700]/80 to-[#FFED4E]/80 backdrop-blur-xl text-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-[#FFD700]/30">
          {category}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export function ReviewFilters({ onSortChange, onFilterChange }) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Most Recent");
  const [selectedFilter, setSelectedFilter] = useState("All Staff");

  const sortOptions = [
    "Most Recent",
    "Oldest First", 
    "Highest Rating",
    "Lowest Rating",
    "Most Helpful"
  ];

  const filterOptions = [
    "All Staff",
    "5 Stars",
    "4 Stars", 
    "3 Stars",
    "2 Stars",
    "1 Star"
  ];

  const handleSortSelect = (option) => {
    setSelectedSort(option);
    setShowSortDropdown(false);
    onSortChange?.(option);
  };

  const handleFilterSelect = (option) => {
    setSelectedFilter(option);
    setShowFilterDropdown(false);
    onFilterChange?.(option);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-3 sm:p-4">
      {/* Sort Dropdown */}
      <div className="relative">
        <button 
          className="flex h-9 sm:h-10 items-center justify-center gap-x-2 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 transition-all duration-200 pl-3 sm:pl-4 pr-2 w-full sm:w-auto min-w-[160px]"
          onClick={() => {
            setShowSortDropdown(!showSortDropdown);
            setShowFilterDropdown(false);
          }}
        >
          <p className="text-[#FFD700] text-xs sm:text-sm font-medium leading-normal">
            Sort by: {selectedSort}
          </p>
          <svg
            className="text-[#FFD700] w-4 h-4 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
          </svg>
        </button>
        
        {showSortDropdown && (
          <div className="absolute top-full left-0 mt-1 w-full sm:w-48 bg-gradient-to-br from-black/90 via-[#0a0804]/90 to-black/90 backdrop-blur-xl rounded-lg shadow-2xl shadow-black/50 z-10 border border-[#FFD700]/20">
            {sortOptions.map((option) => (
              <button
                key={option}
                className="w-full text-left px-3 sm:px-4 py-2 text-white text-xs sm:text-sm hover:bg-gradient-to-r hover:from-[#FFD700]/20 hover:to-[#FFED4E]/20 transition-all duration-200 first:rounded-t-lg last:rounded-b-lg"
                onClick={() => handleSortSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Dropdown */}
      <div className="relative">
        <button 
          className="flex h-9 sm:h-10 items-center justify-center gap-x-2 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 transition-all duration-200 pl-3 sm:pl-4 pr-2 w-full sm:w-auto min-w-[160px]"
          onClick={() => {
            setShowFilterDropdown(!showFilterDropdown);
            setShowSortDropdown(false);
          }}
        >
          <p className="text-[#FFD700] text-xs sm:text-sm font-medium leading-normal">
            Filter: {selectedFilter}
          </p>
          <svg
            className="text-[#FFD700] w-4 h-4 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
          </svg>
        </button>
        
        {showFilterDropdown && (
          <div className="absolute top-full left-0 mt-1 w-full sm:w-48 bg-gradient-to-br from-black/90 via-[#0a0804]/90 to-black/90 backdrop-blur-xl rounded-lg shadow-2xl shadow-black/50 z-10 border border-[#FFD700]/20">
            {filterOptions.map((option) => (
              <button
                key={option}
                className="w-full text-left px-3 sm:px-4 py-2 text-white text-xs sm:text-sm hover:bg-gradient-to-r hover:from-[#FFD700]/20 hover:to-[#FFED4E]/20 transition-all duration-200 first:rounded-t-lg last:rounded-b-lg"
                onClick={() => handleFilterSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

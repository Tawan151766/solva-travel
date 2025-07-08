"use client";

import { useState, useMemo } from "react";
import { ReviewCard } from "./ReviewCard";
import { ReviewFilters } from "./ReviewFilters";
import { ReviewPagination } from "./ReviewPagination";

export function ReviewsList({ reviews }) {
  const [sortBy, setSortBy] = useState("Most Recent");
  const [filterBy, setFilterBy] = useState("All Staff");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = [...reviews];

    // Apply filter
    if (filterBy !== "All Staff") {
      const rating = parseInt(filterBy.split(" ")[0]);
      filtered = filtered.filter(review => review.rating === rating);
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Most Recent":
          return new Date(b.date) - new Date(a.date);
        case "Oldest First":
          return new Date(a.date) - new Date(b.date);
        case "Highest Rating":
          return b.rating - a.rating;
        case "Lowest Rating":
          return a.rating - b.rating;
        case "Most Helpful":
          return (b.likes - b.dislikes) - (a.likes - a.dislikes);
        default:
          return 0;
      }
    });

    return filtered;
  }, [reviews, sortBy, filterBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = filteredAndSortedReviews.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter) => {
    setFilterBy(newFilter);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#1e1c15] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#2a2821]">
        <h3 className="text-white text-lg sm:text-xl font-bold leading-tight tracking-[-0.015em] mb-4">
          All Reviews ({filteredAndSortedReviews.length})
        </h3>
        
        {/* Filters */}
        <ReviewFilters 
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Reviews */}
      <div className="p-4">
        {currentReviews.length > 0 ? (
          <div className="flex flex-col gap-4 sm:gap-6">
            {currentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#bcb69f] text-base">
              No reviews found for the selected filter.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredAndSortedReviews.length > itemsPerPage && (
        <ReviewPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndSortedReviews.length}
        />
      )}
    </div>
  );
}

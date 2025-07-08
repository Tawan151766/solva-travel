"use client";

import { useTravelContext } from "@/core/context";

export function FilterDebugPanel() {
  const { filters, totalItems, filteredData } = useTravelContext();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
      <h3 className="text-lg font-bold mb-2">Filter Debug Panel</h3>
      <div className="space-y-2 text-sm">
        <div>
          <strong>Active Filters:</strong>
        </div>
        <div>Country: {filters.country || 'All'}</div>
        <div>City: {filters.city || 'All'}</div>
        <div>Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</div>
        <div>Recommended Only: {filters.isRecommendedOnly ? 'Yes' : 'No'}</div>
        <div className="pt-2 border-t border-gray-600">
          <strong>Results:</strong> {totalItems} destinations found
        </div>
        <div className="text-xs text-gray-300">
          Showing filtered results from {filteredData.length} total matches
        </div>
      </div>
    </div>
  );
}

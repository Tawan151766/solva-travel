import { TravelCard } from "./TravelCard";
import { useTravelContext } from "@/core/context";

export function TravelPackages() {
  const { currentItems, totalItems, currentPage, itemsPerPage, loading, error } = useTravelContext();

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center p-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading travel packages...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center p-12">
          <div className="text-center max-w-md">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-white text-xl font-bold mb-2">Unable to Load Packages</h2>
            <p className="text-white/70 text-sm mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] hover:from-[#FFED4E] hover:to-[#FFD700] text-black px-6 py-3 rounded-full font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="space-y-4">
      {/* Results Info */}
      <div className="flex justify-between items-center p-4">
        <p className="text-[#FFD700]/80 text-sm">
          Showing {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} of{" "}
          {totalItems} destinations
        </p>
        <div className="text-[#FFD700]/80 text-sm">
          Page {currentPage} of {Math.ceil(totalItems / itemsPerPage) || 1}
        </div>
      </div>

      {/* Travel Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
        {currentItems.map((travel) => (
          <TravelCard
            key={travel.id}
            id={travel.id}
            title={travel.name || travel.title}
            location={travel.location}
            price={travel.price}
            duration={travel.duration}
            imageUrl={travel.images?.[0] || '/placeholder-image.jpg'}
            groupPricing={false} // Set based on your business logic
          />
        ))}
      </div>

      {/* No results state */}
      {currentItems.length === 0 && !loading && !error && (
        <div className="flex justify-center items-center p-8">
          <div className="text-[#FFD700] text-lg">No travel packages found</div>
        </div>
      )}
    </div>
  );
}

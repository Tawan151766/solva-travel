import { TravelCard } from "./TravelCard";
import { useTravelContext } from "@/core/context";

export function TravelPackages() {
  const { currentItems, totalItems, currentPage, itemsPerPage } = useTravelContext();
  
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
            title={travel.title}
            location={travel.location}
            price={travel.price}
            duration={travel.duration}
            imageUrl={travel.imageUrl}
          />
        ))}
      </div>

      {/* Loading animation for empty states */}
      {currentItems.length === 0 && (
        <div className="flex justify-center items-center p-8">
          <div className="text-[#FFD700] text-lg">No travel packages found</div>
        </div>
      )}
    </div>
  );
}

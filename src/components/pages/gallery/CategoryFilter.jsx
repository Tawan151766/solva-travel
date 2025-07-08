"use client";

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 px-2 sm:px-4 pb-4">
      <button
        onClick={() => onCategoryChange("All")}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
          selectedCategory === "All"
            ? "bg-[#d4af37] text-black"
            : "bg-[#4a4221] text-white hover:bg-[#5a5230]"
        }`}
      >
        All Images
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
            selectedCategory === category
              ? "bg-[#d4af37] text-black"
              : "bg-[#4a4221] text-white hover:bg-[#5a5230]"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

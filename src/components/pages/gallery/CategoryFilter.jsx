"use client";

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-4">
      <button
        onClick={() => onCategoryChange("All")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
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
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
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

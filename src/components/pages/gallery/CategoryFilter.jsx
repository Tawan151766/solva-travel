export function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 px-2 sm:px-4 pb-4">
      <button
        onClick={() => onCategoryChange("All")}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
          selectedCategory === "All"
            ? "bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black shadow-lg shadow-[#FFD700]/30"
            : "bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 text-[#FFD700] hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40"
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
              ? "bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black shadow-lg shadow-[#FFD700]/30"
              : "bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 text-[#FFD700] hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

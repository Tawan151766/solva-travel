export function GalleryCategoryCard({ name, imageUrl, count, onClick, isSelected }) {
  return (
    <div 
      className="flex h-full flex-1 flex-col gap-2 sm:gap-4 rounded-lg min-w-32 sm:min-w-40 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative">
        <div
          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg sm:rounded-xl flex flex-col group-hover:scale-105 transition-transform duration-200 border border-[#FFD700]/20 shadow-lg shadow-black/50"
          style={{
            backgroundImage: `url("${imageUrl}")`
          }}
        >
          <div className={`absolute inset-0 rounded-lg sm:rounded-xl transition-colors duration-200 ${
            isSelected 
              ? 'bg-[#FFD700]/30 border-2 border-[#FFD700]' 
              : 'bg-black/20 group-hover:bg-black/10'
          }`} />
          
          {/* Count badge */}
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-gradient-to-r from-[#FFD700]/80 to-[#FFED4E]/80 backdrop-blur-xl text-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-bold shadow-lg shadow-[#FFD700]/30">
            {count}
          </div>
        </div>
      </div>
      <p className={`text-sm sm:text-base font-medium leading-normal transition-colors duration-200 text-center ${
        isSelected 
          ? 'text-[#FFD700]' 
          : 'text-white group-hover:text-[#FFD700]'
      }`}>
        {name}
      </p>
    </div>
  );
}

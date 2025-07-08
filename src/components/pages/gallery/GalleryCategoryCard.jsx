export function GalleryCategoryCard({ name, imageUrl, count, onClick, isSelected }) {
  return (
    <div 
      className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative">
        <div
          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col group-hover:scale-105 transition-transform duration-200"
          style={{
            backgroundImage: `url("${imageUrl}")`
          }}
        >
          <div className={`absolute inset-0 rounded-xl transition-colors duration-200 ${
            isSelected 
              ? 'bg-[#d4af37]/30 border-2 border-[#d4af37]' 
              : 'bg-black/20 group-hover:bg-black/10'
          }`} />
          
          {/* Count badge */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
            {count}
          </div>
        </div>
      </div>
      <p className={`text-base font-medium leading-normal transition-colors duration-200 ${
        isSelected 
          ? 'text-[#d4af37]' 
          : 'text-white group-hover:text-[#efc004]'
      }`}>
        {name}
      </p>
    </div>
  );
}

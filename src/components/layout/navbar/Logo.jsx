export function Logo() {
  return (
    <div className="flex items-center gap-3 cursor-pointer">
      {/* Luxury Icon */}
      {/* <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] via-[#FFED4E] to-[#B8860B] rounded-xl flex items-center justify-center shadow-lg shadow-[#FFD700]/30">
        <svg
          className="w-6 h-6 text-black"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div> */}

      {/* Luxury Text */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-black bg-gradient-to-r from-[#FFD700] via-[#FFED4E] to-[#FFD700] bg-clip-text text-transparent tracking-tight">
          BK18 PLUS
        </h2>
        <span className="text-sm text-[#B8860B] font-light tracking-[0.2em] uppercase -mt-1">
          Travel services
        </span>
      </div>
    </div>
  );
}

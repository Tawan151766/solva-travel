export function HamburgerButton({ isOpen, onClick }) {
  return (
    <button
      className={`lg:hidden relative flex items-center justify-center w-12 h-12 rounded-xl z-50 ${
        isOpen
          ? "bg-gradient-to-br from-[#FFD700] to-[#FFED4E] text-black shadow-lg shadow-[#FFD700]/30"
          : "bg-gradient-to-br from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 text-[#FFD700] hover:border-[#FFD700]/40 hover:bg-gradient-to-br hover:from-[#FFD700]/10 hover:to-[#FFED4E]/10"
      }`}
      onClick={onClick}
      aria-label="Toggle mobile menu"
    >
      <svg
        width="20"
        height="20"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        {isOpen ? (
          <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
        ) : (
          <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
        )}
      </svg>
    </button>
  );
}

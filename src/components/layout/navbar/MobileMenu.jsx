import { menuItems } from "../../../data/menuItems";

export function MobileMenu({ isOpen, onClose }) {
  return (
    <div
      className={`absolute top-full left-0 right-0 lg:hidden z-50 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-gradient-to-b from-black/98 via-[#0a0804]/98 to-black/98 backdrop-blur-xl border-t border-[#FFD700]/20 shadow-2xl shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 via-transparent to-[#FFD700]/5"></div>
        
        <nav className="relative flex flex-col p-6 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.name}
              className="flex items-center gap-4 px-6 py-4 rounded-xl hover:bg-gradient-to-r hover:from-[#FFD700]/10 hover:to-[#FFED4E]/10 hover:border hover:border-[#FFD700]/20"
              href={item.href}
              onClick={onClose}
            >
              {/* Icon Container */}
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700]/20 to-[#FFED4E]/20 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-[#FFD700] hover:to-[#FFED4E]">
                <svg
                  className="w-5 h-5 text-[#FFD700] hover:text-black"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d={item.icon} />
                </svg>
              </div>
              
              {/* Text */}
              <div className="flex-1">
                <span className="font-semibold text-[#cdc08e] hover:text-[#FFD700] tracking-wide">
                  {item.name}
                </span>
              </div>
              
              {/* Arrow */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-[#FFD700]"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                </svg>
              </div>
            </a>
          ))}
          
        </nav>
      </div>
    </div>
  );
}

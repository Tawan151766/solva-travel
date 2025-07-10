"use client";

import { usePathname } from "next/navigation";
import { menuItems } from "../../../data/menuItems";

export function MobileMenu({ isOpen, onClose, onOpenAuthModal }) {
  const pathname = usePathname();

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
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <a
                key={item.name}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 border border-[#FFD700]/40"
                    : "hover:bg-gradient-to-r hover:from-[#FFD700]/10 hover:to-[#FFED4E]/10 hover:border hover:border-[#FFD700]/20"
                }`}
                href={item.href}
                onClick={onClose}
              >
                {/* Icon Container */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-br from-[#FFD700] to-[#FFED4E]"
                    : "bg-gradient-to-br from-[#FFD700]/20 to-[#FFED4E]/20 hover:bg-gradient-to-br hover:from-[#FFD700] hover:to-[#FFED4E]"
                }`}>
                  <svg
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isActive
                        ? "text-black"
                        : "text-[#FFD700] hover:text-black"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d={item.icon} />
                  </svg>
                </div>
                
                {/* Text */}
                <div className="flex-1">
                  <span className={`font-semibold tracking-wide transition-colors duration-300 ${
                    isActive
                      ? "text-[#FFD700]"
                      : "text-[#cdc08e] hover:text-[#FFD700]"
                  }`}>
                    {item.name}
                  </span>
                </div>
                
                {/* Arrow */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#FFD700]/40 to-[#FFED4E]/40"
                    : "bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20"
                }`}>
                  <svg
                    className="w-3 h-3 text-[#FFD700]"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                  </svg>
                </div>
              </a>
            );
          })}
          
          {/* Auth Buttons */}
          <div className="pt-4 mt-4 border-t border-[#FFD700]/20 space-y-3">
            <button
              onClick={() => {
                onOpenAuthModal("login");
                onClose();
              }}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-xl border border-[#FFD700]/30 hover:border-[#FFD700] hover:bg-[#FFD700]/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700]/20 to-[#FFED4E]/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
                </svg>
              </div>
              <span className="font-semibold text-[#FFD700] tracking-wide">
                เข้าสู่ระบบ
              </span>
            </button>
            
            <button
              onClick={() => {
                onOpenAuthModal("register");
                onClose();
              }}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFED4E] hover:from-[#FFED4E] hover:to-[#FFD700]"
            >
              <div className="w-10 h-10 bg-black/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"/>
                </svg>
              </div>
              <span className="font-semibold text-black tracking-wide">
                สมัครสมาชิก
              </span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

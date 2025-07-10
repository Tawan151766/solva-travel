"use client";

import { usePathname } from "next/navigation";
import { menuItems } from "../../../data/menuItems";

export function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-8">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <a
            key={item.name}
            className={`relative cursor-pointer px-4 py-2 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 border border-[#FFD700]/40"
                : "hover:bg-gradient-to-r hover:from-[#FFD700]/10 hover:to-[#FFED4E]/10 hover:border hover:border-[#FFD700]/20"
            }`}
            href={item.href}
          >
            <span className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
              isActive
                ? "text-[#FFD700] font-semibold"
                : "text-[#cdc08e] hover:text-[#FFD700]"
            }`}>
              {item.name}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

import { menuItems } from "../../../data/menuItems";

export function DesktopNavigation() {
  return (
    <nav className="hidden lg:flex items-center gap-8">
      {menuItems.map((item) => (
        <a
          key={item.name}
          className="relative cursor-pointer px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-[#FFD700]/10 hover:to-[#FFED4E]/10 hover:border hover:border-[#FFD700]/20"
          href={item.href}
        >
          <span className="text-[#cdc08e] text-sm font-medium hover:text-[#FFD700] tracking-wide">
            {item.name}
          </span>
        </a>
      ))}
    </nav>
  );
}

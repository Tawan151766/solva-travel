import { menuItems } from "../../../data/menuItems";

export function DesktopNavigation() {
  return (
    <nav className="hidden lg:flex items-center gap-8">
      {menuItems.map((item) => (
        <a
          key={item.name}
          className="relative text-slate-300 text-sm font-medium hover:text-white transition-all duration-300 group"
          href={item.href}
        >
          {item.name}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-500 transition-all duration-300 group-hover:w-full"></span>
        </a>
      ))}
    </nav>
  );
}

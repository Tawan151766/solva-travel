import { menuItems } from "../../../data/menuItems";

export function MobileMenu({ isOpen, onClose }) {
  return (
    <div
      className={`absolute top-full left-0 right-0 lg:hidden z-50 transition-all duration-300 ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-gradient-to-b from-slate-900/98 to-slate-800/98 backdrop-blur-xl border-t border-slate-700/50 shadow-2xl">
        <nav className="flex flex-col p-6 space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.name}
              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-slate-800/50 rounded-lg transition-all duration-300 group transform hover:translate-x-1"
              href={item.href}
              onClick={onClose}
            >
              <svg
                className={`w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300`}
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d={item.icon} />
              </svg>
              <span className="font-medium">{item.name}</span>
              <svg
                className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
              </svg>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export function Navbar() {
  const [searchValue, setSearchValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#231f10] flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#4a4221] px-4 sm:px-6 lg:px-10 py-3">
      <div className="flex items-center gap-4 lg:gap-8">
        <div className="flex items-center gap-4 text-white">
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Solva Travel
          </h2>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-9">
          <a
            className="text-white text-sm font-medium leading-normal hover:text-[#efc004] transition-colors"
            href="/"
          >
            Home
          </a>
          <a
            className="text-white text-sm font-medium leading-normal hover:text-[#efc004] transition-colors"
            href="/staff"
          >
            Our Staff
          </a>
          <a
            className="text-white text-sm font-medium leading-normal hover:text-[#efc004] transition-colors"
            href="/gallery"
          >
            Gallery
          </a>
          <a
            className="text-white text-sm font-medium leading-normal hover:text-[#efc004] transition-colors"
            href="#"
          >
            Messages
          </a>
        </nav>
      </div>

      <div className="flex flex-1 justify-end gap-2 sm:gap-4 lg:gap-8">
        {/* Profile */}
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer hover:ring-2 hover:ring-[#efc004] transition-all"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBREmh7K_Z_rhVbgwatlByCCmEGCRN2z2Iq5NR7rIX0JQ8WjiTRtFjmt8rHFpQQnShetucg1bCySYl87qDybdvYrdbBhlWKFGfcMWyMM0eWnuxQ7Jo8n_sCqqxqCujh4cCL6s1qnfMQwGIejytutHUmgE1VT6l110WV7d6oavAPcMtdCmX8KTciXdb91KV2W4Y4MK9dNT_1TjYVXeWIgExN7l-2nlf7xU0EqVEqAMeCEYdLLDhwvMiEGycdXqQyhv8bI22ie_yJueLK")`,
          }}
        />

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-[#4a4221] text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#231f10] border-t border-[#4a4221] lg:hidden z-50">
          <nav className="flex flex-col p-4 space-y-4">
            <a
              className="text-white text-sm font-medium hover:text-[#efc004] transition-colors"
              href="#"
            >
              Home
            </a>
            <a
              className="text-white text-sm font-medium hover:text-[#efc004] transition-colors"
              href="#"
            >
              Explore
            </a>
            <a
              className="text-white text-sm font-medium hover:text-[#efc004] transition-colors"
              href="#"
            >
              Trips
            </a>
            <a
              className="text-white text-sm font-medium hover:text-[#efc004] transition-colors"
              href="#"
            >
              Messages
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

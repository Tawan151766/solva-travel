"use client";

import { useState } from "react";

export function Navbar() {
  const [searchValue, setSearchValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#231f10] flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#4a4221] px-4 sm:px-6 lg:px-10 py-3">
      <div className="flex items-center gap-4 lg:gap-8">
        <div className="flex items-center gap-4 text-white">
          <div className="size-4">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Wanderlust
          </h2>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-9">
          <a
            className="text-white text-sm font-medium leading-normal hover:text-[#efc004] transition-colors"
            href="#"
          >
            Home
          </a>
          <a
            className="text-white text-sm font-medium leading-normal hover:text-[#efc004] transition-colors"
            href="#"
          >
            Explore
          </a>
          <a
            className="text-white text-sm font-medium leading-normal hover:text-[#efc004] transition-colors"
            href="#"
          >
            Trips
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
        {/* Search - Hidden on mobile */}
        <label className="hidden sm:flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-[#cdc08e] flex border-none bg-[#4a4221] items-center justify-center pl-4 rounded-l-lg border-r-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </div>
            <input
              placeholder="Search"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#4a4221] focus:border-none h-full placeholder:text-[#cdc08e] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </label>
        {/* Notifications */}
        <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#4a4221] text-white hover:bg-[#5a5230] transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            height="20px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
          </svg>
        </button>

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
            {/* Mobile Search */}
            <div className="pt-2">
              <input
                placeholder="Search destinations..."
                className="w-full px-4 py-2 rounded-lg bg-[#4a4221] text-white placeholder:text-[#cdc08e] border-none focus:outline-none focus:ring-2 focus:ring-[#efc004]"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

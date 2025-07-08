"use client";

import { useState } from "react";
import { 
  Logo, 
  DesktopNavigation, 
  UserProfile, 
  HamburgerButton, 
  MobileMenu 
} from "./navbar/index";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative">
      <header className="sticky top-0 z-50 bg-[#1e1c15] backdrop-blur-lg border-b border-slate-700/50 shadow-lg px-4 sm:px-6 lg:px-10 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-4">
              <Logo />
            </div>
            <DesktopNavigation />
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <UserProfile />
            <HamburgerButton 
              isOpen={isMobileMenuOpen} 
              onClick={handleMobileMenuToggle} 
            />
          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={handleMobileMenuClose} 
      />
    </div>
  );
}

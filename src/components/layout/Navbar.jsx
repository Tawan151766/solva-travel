"use client";

import { useState } from "react";
import { 
  Logo, 
  DesktopNavigation, 
  UserProfile, 
  HamburgerButton, 
  MobileMenu 
} from "./navbar/index";
import { AuthModal } from "../auth/AuthModal";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleOpenAuthModal = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="relative">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-black/95 via-[#0a0804]/95 to-black/95 border-b border-[#FFD700]/20 shadow-2xl shadow-black/50 px-4 sm:px-6 lg:px-10 py-4">
        {/* Luxury Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 via-transparent to-[#FFD700]/5 opacity-50"></div>
        
        {/* Premium Glow Effect */}
        <div className="absolute inset-0 border-b border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.1)]"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-4">
              <Logo />
            </div>
            <DesktopNavigation />
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <UserProfile onOpenAuthModal={handleOpenAuthModal} />
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
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        initialMode={authMode}
      />
    </div>
  );
}

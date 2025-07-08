"use client";

import { useState } from "react";

export function UserProfile({ onOpenAuthModal }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLoginClick = () => {
    onOpenAuthModal("login");
  };

  const handleRegisterClick = () => {
    onOpenAuthModal("register");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowDropdown(false);
  };

  if (isLoggedIn) {
    return (
      <div className="relative">
        <div
          className="cursor-pointer"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-12 h-12 border-2 border-[#FFD700]/30 hover:border-[#FFD700] shadow-lg shadow-[#FFD700]/20"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBREmh7K_Z_rhVbgwatlByCCmEGCRN2z2Iq5NR7rIX0JQ8WjiTRtFjmt8rHFpQQnShetucg1bCySYl87qDybdvYrdbBhlWKFGfcMWyMM0eWnuxQ7Jo8n_sCqqxqCujh4cCL6s1qnfMQwGIejytutHUmgE1VT6l110WV7d6oavAPcMtdCmX8KTciXdb91KV2W4Y4MK9dNT_1TjYVXeWIgExN7l-2nlf7xU0EqVEqAMeCEYdLLDhwvMiEGycdXqQyhv8bI22ie_yJueLK")`,
            }}
          />
          
          {/* Status Indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-black shadow-lg shadow-green-400/50 flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl shadow-black/50 py-2 z-50">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5 rounded-2xl"></div>
            
            <div className="relative">
              <div className="px-4 py-3 border-b border-[#FFD700]/20">
                <p className="text-white font-medium">John Doe</p>
                <p className="text-white/60 text-sm">john@example.com</p>
              </div>
              
              <div className="py-2">
                <a href="#" className="block px-4 py-2 text-white/80 hover:text-[#FFD700] hover:bg-[#FFD700]/10 transition-all">
                  โปรไฟล์
                </a>
                <a href="#" className="block px-4 py-2 text-white/80 hover:text-[#FFD700] hover:bg-[#FFD700]/10 transition-all">
                  การจองของฉัน
                </a>
                <a href="#" className="block px-4 py-2 text-white/80 hover:text-[#FFD700] hover:bg-[#FFD700]/10 transition-all">
                  ตั้งค่า
                </a>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 max-sm:hidden">
      {/* Login Button */}
      <button
        onClick={handleLoginClick}
        className="px-4 py-2 text-[#FFD700] hover:text-[#FFED4E] border border-[#FFD700]/30 hover:border-[#FFD700] rounded-xl backdrop-blur-sm hover:bg-[#FFD700]/10 transition-all text-sm font-medium"
      >
        เข้าสู่ระบบ
      </button>
      
      {/* Register Button */}
      <button
        onClick={handleRegisterClick}
        className="px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-medium rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] transition-all text-sm shadow-lg shadow-[#FFD700]/30"
      >
        สมัครสมาชิก
      </button>
    </div>
  );
}

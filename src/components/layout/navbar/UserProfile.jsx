"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext-simple";
import Link from "next/link";

export function UserProfile({ onOpenAuthModal }) {
  const { data: session, status } = useSession();
  const { user: authUser, isAuthenticated: authIsAuthenticated, logout: authLogout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Determine which auth system to use
  const isNextAuthUser = status === "authenticated" && session;
  const isLegacyAuthUser = authIsAuthenticated && authUser;
  const isAuthenticated = isNextAuthUser || isLegacyAuthUser;
  
  const user = isNextAuthUser ? {
    firstName: session.user.firstName || session.user.name?.split(' ')[0] || 'User',
    lastName: session.user.lastName || session.user.name?.split(' ').slice(1).join(' ') || '',
    email: session.user.email,
    role: session.user.role || 'USER',
    profileImage: session.user.image
  } : authUser;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLoginClick = () => {
    onOpenAuthModal("login");
  };

  const handleRegisterClick = () => {
    onOpenAuthModal("register");
  };

  const handleLogout = async () => {
    if (isNextAuthUser) {
      await signOut({ redirect: false });
    } else {
      await authLogout();
    }
    setShowDropdown(false);
  };

  if (isAuthenticated && user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <div
          className="cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-12 h-12 border-2 border-[#FFD700]/30 hover:border-[#FFD700] shadow-lg shadow-[#FFD700]/20 flex items-center justify-center text-white font-semibold text-lg bg-gradient-to-br from-[#FFD700] to-[#FFED4E] text-black"
          >
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>
                {user.firstName?.charAt(0)?.toUpperCase()}{user.lastName?.charAt(0)?.toUpperCase()}
              </span>
            )}
          </div>
          
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
                <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-white/60 text-sm">{user.email}</p>
                {user.role && user.role !== 'USER' && (
                  <span className="inline-block px-2 py-1 bg-[#FFD700]/20 text-[#FFD700] text-xs rounded-full mt-1">
                    {user.role.replace('_', ' ')}
                  </span>
                )}
              </div>
              
              <div className="py-2">
                <Link href="/profile" className="flex items-center px-4 py-2 text-white/80 hover:text-[#FFD700] hover:bg-[#FFD700]/10 transition-all">
                  <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  โปรไฟล์
                </Link>
                
                <Link href="/my-bookings" className="flex items-center px-4 py-2 text-white/80 hover:text-[#FFD700] hover:bg-[#FFD700]/10 transition-all">
                  <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  คำขอทัวร์ของฉัน
                </Link>
                
                <Link href="/settings" className="flex items-center px-4 py-2 text-white/80 hover:text-[#FFD700] hover:bg-[#FFD700]/10 transition-all">
                  <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  ตั้งค่า
                </Link>
                
                {(user.role === 'ADMIN' || user.role === 'OPERATOR' || user.role === 'STAFF') && (
                  <Link href="/management" className="flex items-center px-4 py-2 text-white/80 hover:text-[#FFD700] hover:bg-[#FFD700]/10 transition-all">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    จัดการระบบ
                  </Link>
                )}
                
                <div className="border-t border-[#FFD700]/20 my-2"></div>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                  <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
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

"use client";

import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { OTPVerification } from "./OTPVerification";

export function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const [currentView, setCurrentView] = useState(initialMode);
  const [userEmail, setUserEmail] = useState("");

  if (!isOpen) return null;

  const handleSwitchToRegister = () => setCurrentView("register");
  const handleSwitchToLogin = () => setCurrentView("login");
  const handleSwitchToOTP = (email) => {
    setUserEmail(email);
    setCurrentView("otp");
  };
  const handleBackToLogin = () => setCurrentView("login");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Luxury Background */}
        <div className="relative bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl rounded-3xl border border-[#FFD700]/20 shadow-2xl shadow-black/50 overflow-hidden">
          {/* Premium Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5"></div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 bg-gradient-to-br from-[#FFD700]/20 to-[#FFED4E]/20 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 border border-[#FFD700]/30"
          >
            <svg className="w-4 h-4 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
            </svg>
          </button>

          {/* Content */}
          <div className="relative p-8">
            {currentView === "login" && (
              <LoginForm 
                onSwitchToRegister={handleSwitchToRegister}
                onClose={onClose}
              />
            )}
            
            {currentView === "register" && (
              <RegisterForm 
                onSwitchToLogin={handleSwitchToLogin}
                onSwitchToOTP={handleSwitchToOTP}
              />
            )}
            
            {currentView === "otp" && (
              <OTPVerification 
                email={userEmail}
                onBackToLogin={handleBackToLogin}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

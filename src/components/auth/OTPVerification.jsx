"use client";

import { useState, useEffect } from "react";
import { authAPI } from "../../lib/auth";

export function OTPVerification({ email, onBackToLogin, onClose }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          setCanResend(true);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear errors when user types
    if (errors.otp) {
      setErrors({});
    }

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setErrors({ otp: "กรุณากรอกรหัส OTP ให้ครบ 6 หลัก" });
      return;
    }

    setIsLoading(true);
    
    try {
      // Call OTP verification API
      const response = await authAPI.verifyOTP(email, otpValue);
      
      console.log('OTP verification success:', response);
      
      // Success - close modal and optionally show success message
      onClose();
      
      // You might want to trigger a success callback here
      // For example: onVerificationSuccess(response.user);
      
    } catch (error) {
      console.error('OTP verification error:', error);
      setErrors({ otp: error.message || "เกิดข้อผิดพลาดในการยืนยัน กรุณาลองใหม่อีกครั้ง" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    
    try {
      // Call resend OTP API
      const response = await authAPI.resendOTP(email);
      
      console.log('Resend OTP success:', response);
      
      // Reset countdown and form state
      setCountdown(300);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setErrors({});
      
      // Focus first input
      const firstInput = document.getElementById('otp-0');
      if (firstInput) firstInput.focus();
      
    } catch (error) {
      console.error('Resend OTP error:', error);
      setErrors({ submit: error.message || "เกิดข้อผิดพลาดในการส่งรหัส OTP ใหม่" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-2">
          ยืนยันอีเมล
        </h2>
        <p className="text-white/70 text-sm mb-2">
          เราได้ส่งรหัส OTP ไปยังอีเมล
        </p>
        <p className="text-[#FFD700] text-sm font-medium">
          {email}
        </p>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input Fields */}
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-4 text-center">
            กรอกรหัส OTP 6 หลัก
          </label>
          <div className="flex justify-center space-x-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-red-400 text-xs mt-2 text-center">{errors.otp}</p>
          )}
        </div>

        {/* Countdown and Resend */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-white/60 text-sm">
              รหัส OTP จะหมดอายุใน {formatTime(countdown)}
            </p>
          ) : (
            <p className="text-white/60 text-sm">
              รหัส OTP หมดอายุแล้ว
            </p>
          )}
          
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={!canResend || isLoading}
            className="mt-2 text-[#FFD700] hover:text-[#FFED4E] text-sm font-medium underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ส่งรหัส OTP ใหม่
          </button>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
            <p className="text-red-400 text-sm text-center">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              <span>กำลังยืนยัน...</span>
            </div>
          ) : (
            "ยืนยันรหัส OTP"
          )}
        </button>
      </form>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <button
          onClick={onBackToLogin}
          className="text-white/60 hover:text-white text-sm underline"
        >
          กลับไปหน้าเข้าสู่ระบบ
        </button>
      </div>

      {/* Demo Note */}
      <div className="mt-6 p-3 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl">
        <p className="text-[#FFD700] text-xs text-center">
          <strong>Demo:</strong> ตรวจสอบ Console เพื่อดูรหัส OTP ที่ถูกส่ง
        </p>
      </div>
    </div>
  );
}

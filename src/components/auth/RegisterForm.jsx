"use client";

import { useState } from "react";
import { authAPI } from "../../lib/auth";

export function RegisterForm({ onSwitchToLogin, onSwitchToOTP }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "ชื่อจริงไม่สามารถว่างได้";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "นามสกุลไม่สามารถว่างได้";
    }

    if (!formData.email.trim()) {
      newErrors.email = "อีเมลไม่สามารถว่างได้";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    if (!formData.password) {
      newErrors.password = "รหัสผ่านไม่สามารถว่างได้";
    } else if (formData.password.length < 8) {
      newErrors.password = "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "กรุณายอมรับข้อกำหนดและเงื่อนไข";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Call registration API
      const response = await authAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Registration success:', response);
      
      // Switch to OTP verification
      onSwitchToOTP(formData.email);
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-2">
          สมัครสมาชิก
        </h2>
        <p className="text-white/70 text-sm">
          เข้าร่วมกับ Solva Travel เพื่อรับประสบการณ์พิเศษ
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              ชื่อจริง
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              placeholder="ชื่อจริง"
            />
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-[#FFD700] text-sm font-medium mb-2">
              นามสกุล
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
              placeholder="นามสกุล"
            />
            {errors.lastName && (
              <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            อีเมล
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Fields */}
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            รหัสผ่าน
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            placeholder="อย่างน้อย 8 ตัวอักษร"
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            ยืนยันรหัสผ่าน
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
            placeholder="ยืนยันรหัสผ่าน"
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="mt-1 w-4 h-4 text-[#FFD700] bg-black/50 border-[#FFD700]/30 rounded focus:ring-[#FFD700] focus:ring-2"
          />
          <label className="text-white/80 text-sm leading-relaxed">
            ฉันยอมรับ{" "}
            <a href="#" className="text-[#FFD700] hover:text-[#FFED4E] underline">
              ข้อกำหนดและเงื่อนไข
            </a>{" "}
            และ{" "}
            <a href="#" className="text-[#FFD700] hover:text-[#FFED4E] underline">
              นโยบายความเป็นส่วนตัว
            </a>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-red-400 text-xs">{errors.agreeToTerms}</p>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
            <p className="text-red-400 text-sm">{errors.submit}</p>
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
              <span>กำลังสมัครสมาชิก...</span>
            </div>
          ) : (
            "สมัครสมาชิก"
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 text-center">
        <p className="text-white/60 text-sm">
          มีบัญชีแล้ว?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-[#FFD700] hover:text-[#FFED4E] font-medium underline"
          >
            เข้าสู่ระบบ
          </button>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext-simple";

export function LoginForm({ onSwitchToRegister, onClose }) {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "อีเมลไม่สามารถว่างได้";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    if (!formData.password) {
      newErrors.password = "รหัสผ่านไม่สามารถว่างได้";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Use AuthContext login function
      const result = await login(formData.email, formData.password);

      if (result.success) {
        setSuccess("เข้าสู่ระบบสำเร็จ! กำลังนำคุณเข้าสู่หน้าหลัก...");
        
        // Close modal and redirect after 1.5 seconds
        setTimeout(() => {
          onClose();
          router.push('/');
        }, 1500);
      } else {
        setErrors({ submit: result.error || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
      }
      
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: error.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-2">
          เข้าสู่ระบบ
        </h2>
        <p className="text-[#cdc08e] text-sm">
          เข้าสู่ระบบเพื่อใช้บริการระดับ VIP
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-2">
          <label className="block text-[#FFD700] text-sm font-medium">
            อีเมล
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30"
              placeholder="example@email.com"
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-[#FFD700]/60" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"/>
              </svg>
            </div>
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="block text-[#FFD700] text-sm font-medium">
            รหัสผ่าน
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FFD700]/60 hover:text-[#FFD700]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
                {showPassword ? (
                  <path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128,133.15,133.15,0,0,1,48.07,97.25L71.17,122.5A48,48,0,0,0,134.7,189l14.95,16.5A113.59,113.59,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.07-30.75A132.64,132.64,0,0,0,178.33,73.5a8,8,0,0,1,5.33-15.09A148.8,148.8,0,0,1,218.31,83.70c18.83,18.83,27.3,37.62,27.65,38.4A8,8,0,0,1,247.31,131.26Z"/>
                ) : (
                  <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/>
                )}
              </svg>
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs">{errors.password}</p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
            <p className="text-red-400 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-xl">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        {/* Forgot Password */}
        <div className="text-right">
          <button type="button" className="text-[#FFD700]/80 hover:text-[#FFD700] text-sm">
            ลืมรหัสผ่าน?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              <span>กำลังเข้าสู่ระบบ...</span>
            </div>
          ) : (
            "เข้าสู่ระบบ"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent"></div>
        <span className="text-[#B8860B] text-sm">หรือ</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent"></div>
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        <button className="w-full bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 text-[#cdc08e] font-medium py-3 px-6 rounded-xl hover:border-[#FFD700]/40 flex items-center justify-center gap-3">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          เข้าสู่ระบบด้วย Google
        </button>
      </div>

      {/* Switch to Register */}
      <div className="text-center">
        <span className="text-[#cdc08e] text-sm">ยังไม่มีบัญชี? </span>
        <button 
          onClick={onSwitchToRegister}
          className="text-[#FFD700] hover:text-[#FFED4E] text-sm font-medium"
        >
          สมัครสมาชิก
        </button>
      </div>
    </div>
  );
}

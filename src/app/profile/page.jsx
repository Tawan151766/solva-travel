'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext-simple';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, isAuthenticated, logout } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImage: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/auth/login');
      return;
    }
    
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        profileImage: user.profileImage || ''
      });
    }
  }, [isAuthenticated, token, user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว');
        setIsEditing(false);
        
        // Update user context if needed
        // You might want to refresh user data here
      } else {
        setError(data.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
        setShowPasswordForm(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(data.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    
    // Reset form data
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        profileImage: user.profileImage || ''
      });
    }
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordForm(false);
    setError('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      'USER': 'ผู้ใช้งาน',
      'STAFF': 'พนักงาน',
      'OPERATOR': 'ผู้ดำเนินการ',
      'ADMIN': 'ผู้ดูแลระบบ',
      'SUPER_ADMIN': 'ผู้ดูแลระบบสูงสุด'
    };
    return roleLabels[role] || role;
  };

  const getRoleColor = (role) => {
    const roleColors = {
      'USER': 'text-blue-400',
      'STAFF': 'text-green-400',
      'OPERATOR': 'text-purple-400',
      'ADMIN': 'text-orange-400',
      'SUPER_ADMIN': 'text-red-400'
    };
    return roleColors[role] || 'text-gray-400';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">เข้าสู่ระบบเพื่อดูโปรไฟล์</h2>
          <p className="text-[#cdc08e] mb-6">กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูลส่วนตัว</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/30 font-semibold transition-all duration-200"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl mb-8">
          <div className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-8 py-6 rounded-t-2xl">
            <h1 className="text-3xl font-bold">โปรไฟล์ของฉัน</h1>
            <p className="text-black/80 mt-1">จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชี</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
            <p className="text-green-400 text-center">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl p-6">
              {/* Profile Image */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#FFD700] to-[#FFED4E] rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    {profileData.profileImage ? (
                      <img
                        src={profileData.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${profileData.profileImage ? 'hidden' : 'flex'}`}>
                      <User className="w-16 h-16 text-black" />
                    </div>
                  </div>
                  <button className="absolute bottom-2 right-2 w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center hover:bg-[#FFED4E] transition-colors">
                    <Camera className="w-4 h-4 text-black" />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-1">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className={`text-sm font-medium ${getRoleColor(user?.role)}`}>
                  {getRoleLabel(user?.role)}
                </p>
              </div>

              {/* Quick Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#cdc08e]">
                  <Mail className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                
                {user?.phone && (
                  <div className="flex items-center gap-3 text-[#cdc08e]">
                    <Phone className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 text-[#cdc08e]">
                  <Calendar className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-sm">สมาชิกตั้งแต่ {formatDate(user?.createdAt)}</span>
                </div>
                
                <div className="flex items-center gap-3 text-[#cdc08e]">
                  <Shield className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-sm">
                    {user?.isEmailVerified ? 'อีเมลยืนยันแล้ว' : 'อีเมลยังไม่ยืนยัน'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 text-[#FFD700] rounded-xl hover:bg-gradient-to-r hover:from-[#FFD700]/30 hover:to-[#FFED4E]/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  เปลี่ยนรหัสผ่าน
                </button>
                
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-xl border border-red-500/30 text-red-400 rounded-xl hover:bg-gradient-to-r hover:from-red-500/30 hover:to-red-600/30 transition-all duration-200"
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#FFD700]">ข้อมูลส่วนตัว</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 text-[#FFD700] rounded-xl hover:bg-gradient-to-r hover:from-[#FFD700]/30 hover:to-[#FFED4E]/30 transition-all duration-200 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    แก้ไข
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* First Name */}
                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    ชื่อ *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className={`w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all ${
                      !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                    placeholder="ใส่ชื่อของคุณ"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    นามสกุล *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className={`w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all ${
                      !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                    placeholder="ใส่นามสกุลของคุณ"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    อีเมล *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className={`w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all ${
                      !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                    placeholder="ใส่อีเมลของคุณ"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all ${
                      !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                    placeholder="ใส่เบอร์โทรศัพท์ของคุณ"
                  />
                </div>

                {/* Profile Image URL */}
                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    URL รูปโปรไฟล์
                  </label>
                  <input
                    type="url"
                    name="profileImage"
                    value={profileData.profileImage}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all ${
                      !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                    placeholder="https://example.com/profile.jpg"
                  />
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600/20 to-gray-700/20 backdrop-blur-xl border border-gray-500/30 text-gray-400 rounded-xl hover:bg-gradient-to-r hover:from-gray-600/30 hover:to-gray-700/30 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {showPasswordForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-black/90 via-[#0a0804]/90 to-black/90 backdrop-blur-xl rounded-xl border border-[#FFD700]/20 w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#FFD700]">เปลี่ยนรหัสผ่าน</h2>
                  <button
                    onClick={handleCancelPasswordChange}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                      รหัสผ่านปัจจุบัน *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 pr-12 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                        placeholder="ใส่รหัสผ่านปัจจุบัน"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                      รหัสผ่านใหม่ *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 pr-12 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                        placeholder="ใส่รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                      ยืนยันรหัสผ่านใหม่ *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 pr-12 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                        placeholder="ยืนยันรหัสผ่านใหม่"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancelPasswordChange}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600/20 to-gray-700/20 backdrop-blur-xl border border-gray-500/30 text-gray-400 rounded-xl hover:bg-gradient-to-r hover:from-gray-600/30 hover:to-gray-700/30 transition-all duration-200"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'กำลังเปลี่ยน...' : 'เปลี่ยนรหัสผ่าน'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
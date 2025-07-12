"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function TourRequestPage() {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    destination: '',
    startDate: '',
    endDate: '',
    numberOfPeople: '2',
    budget: '',
    accommodation: 'hotel',
    transportation: 'flight',
    activities: '',
    specialRequirements: '',
    description: ''
  });

  // Auto-fill form if user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        contactName: `${user.firstName} ${user.lastName}`,
        contactEmail: user.email,
        contactPhone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'ชื่อผู้ติดต่อจำเป็นต้องกรอก';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'อีเมลจำเป็นต้องกรอก';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'รูปแบบอีเมลไม่ถูกต้อง';
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'หมายเลขโทรศัพท์จำเป็นต้องกรอก';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'จุดหมายปลายทางจำเป็นต้องกรอก';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'วันที่เริ่มต้นจำเป็นต้องกรอก';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'วันที่สิ้นสุดจำเป็นต้องกรอก';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        newErrors.startDate = 'วันที่เริ่มต้นต้องไม่เป็นวันที่ผ่านมาแล้ว';
      }

      if (end <= start) {
        newErrors.endDate = 'วันที่สิ้นสุดต้องหลังจากวันที่เริ่มต้น';
      }
    }

    if (!formData.numberOfPeople) {
      newErrors.numberOfPeople = 'จำนวนผู้เดินทางจำเป็นต้องกรอก';
    } else if (parseInt(formData.numberOfPeople) < 1 || parseInt(formData.numberOfPeople) > 50) {
      newErrors.numberOfPeople = 'จำนวนผู้เดินทางต้องอยู่ระหว่าง 1-50 คน';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccess('');

    try {
      const requestData = {
        ...formData,
        userId: user ? user.id : null,
        numberOfPeople: parseInt(formData.numberOfPeople),
        budget: formData.budget ? parseFloat(formData.budget) : null
      };

      const response = await fetch('/api/custom-tour-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess('คำขอทัวร์แบบกำหนดเองของคุณได้รับการส่งเรียบร้อยแล้ว! ทีมงานจะติดต่อกลับไปในเร็วๆ นี้');
        
        // Store the custom tour request ID for potential booking
        const requestId = result.data?.id || result.request?.id;
        if (requestId) {
          window.customTourRequestId = requestId;
          
          // Navigate to success page with request ID
          setTimeout(() => {
            window.location.href = `/tour-request-success?requestId=${requestId}`;
          }, 2000);
        }
        
        // Reset form
        setFormData({
          contactName: user ? `${user.firstName} ${user.lastName}` : '',
          contactEmail: user ? user.email : '',
          contactPhone: user ? user.phone || '' : '',
          destination: '',
          startDate: '',
          endDate: '',
          numberOfPeople: '',
          budget: '',
          accommodation: '',
          transportation: '',
          activities: '',
          specialRequirements: '',
          description: ''
        });
      } else {
        setErrors({ submit: result.message || 'เกิดข้อผิดพลาดในการส่งคำขอ' });
      }
    } catch (error) {
      console.error('Error submitting tour request:', error);
      setErrors({ submit: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
          <Link href="/" className="text-[#FFD700]/60 hover:text-[#FFD700] transition-colors">
            หน้าหลัก
          </Link>
          <svg className="w-4 h-4 text-[#FFD700]/60" fill="currentColor" viewBox="0 0 256 256">
            <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
          </svg>
          <span className="text-white font-medium">ขอใบเสนอราคาทัวร์</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full mb-6">
            <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,16A88,88,0,1,0,216,104,88.1,88.1,0,0,0,128,16Zm0,160a72,72,0,1,1,72-72A72.08,72.08,0,0,1,128,176ZM164.49,99.51a12,12,0,0,1,0,17l-28,28a12,12,0,0,1-17,0l-14-14a12,12,0,0,1,17-17L128,119l19.51-19.52A12,12,0,0,1,164.49,99.51Z"/>
            </svg>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-4">
            สร้างทัวร์แบบกำหนดเอง
          </h1>
          <p className="text-white/70 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
            บอกเราเกี่ยวกับจุดหมายปลายทางในฝันของคุณ แล้วเราจะสร้างแพ็กเกจการเดินทางที่เหมาะสมเฉพาะสำหรับคุณ
          </p>
          
          {!isAuthenticated && (
            <div className="mt-6 p-4 bg-gradient-to-r from-[#FFD700]/10 to-[#FFED4E]/10 border border-[#FFD700]/20 rounded-xl">
              <p className="text-[#FFD700] text-sm flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/>
                </svg>
                หากคุณมีบัญชีผู้ใช้แล้ว เข้าสู่ระบบเพื่อบันทึกคำขอและติดตามสถานะได้
              </p>
            </div>
          )}

          {isAuthenticated && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-400 text-sm flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/>
                </svg>
                ยินดีต้อนรับ {user?.firstName}! คำขอของคุณจะถูกบันทึกในบัญชีของคุณ
              </p>
            </div>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-green-400 text-center mb-4">{success}</p>
            {window.customTourRequestId && (
              <div className="flex justify-center">
                <Link 
                  href={`/booking?type=custom&customTourRequestId=${window.customTourRequestId}`}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M231.4,44.34s0,0,0,0l-58.25,191.94a15.88,15.88,0,0,1-27.4,5.54L116.35,213.9a4,4,0,0,0-5.65-.27L63.5,235.73a15.86,15.86,0,0,1-22.29-18.08L98.75,28.37a15.88,15.88,0,0,1,27.4-5.54l29.4,27.92a4,4,0,0,0,5.65.27L208.4,28.92A15.86,15.86,0,0,1,231.4,44.34Z"/>
                  </svg>
                  ดำเนินการจองเลย
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-3xl border border-[#FFD700]/20 shadow-2xl shadow-black/50 p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-[#FFD700] mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                ข้อมูลการติดต่อ
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    ชื่อผู้ติดต่อ *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    placeholder="กรอกชื่อ-นามสกุล"
                  />
                  {errors.contactName && <p className="text-red-400 text-xs mt-1">{errors.contactName}</p>}
                </div>

                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    อีเมล *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    placeholder="example@email.com"
                  />
                  {errors.contactEmail && <p className="text-red-400 text-xs mt-1">{errors.contactEmail}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    หมายเลขโทรศัพท์ *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    placeholder="08X-XXX-XXXX"
                  />
                  {errors.contactPhone && <p className="text-red-400 text-xs mt-1">{errors.contactPhone}</p>}
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div>
              <h2 className="text-2xl font-semibold text-[#FFD700] mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                รายละเอียดการเดินทาง
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    จุดหมายปลายทาง *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    placeholder="เช่น ญี่ปุ่น, ยุโรป, เกาหลี"
                  />
                  {errors.destination && <p className="text-red-400 text-xs mt-1">{errors.destination}</p>}
                </div>

                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    วันที่เริ่มต้น *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                  />
                  {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate}</p>}
                </div>

                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    วันที่สิ้นสุด *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                  />
                  {errors.endDate && <p className="text-red-400 text-xs mt-1">{errors.endDate}</p>}
                </div>

                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    จำนวนผู้เดินทาง *
                  </label>
                  <input
                    type="number"
                    name="numberOfPeople"
                    value={formData.numberOfPeople}
                    onChange={handleChange}
                    min="1"
                    max="50"
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    placeholder="จำนวนคน"
                  />
                  {errors.numberOfPeople && <p className="text-red-400 text-xs mt-1">{errors.numberOfPeople}</p>}
                </div>

                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    งบประมาณโดยประมาณ (บาท)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    placeholder="เช่น 50000"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h2 className="text-2xl font-semibold text-[#FFD700] mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ความต้องการเพิ่มเติม
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    ประเภทที่พัก
                  </label>
                  <select
                    name="accommodation"
                    value={formData.accommodation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                  >
                    <option value="hotel">โรงแรม</option>
                    <option value="resort">รีสอร์ท</option>
                    <option value="guesthouse">เกสต์เฮาส์</option>
                    <option value="hostel">โฮสเทล</option>
                    <option value="villa">วิลล่า</option>
                    <option value="apartment">อพาร์ทเมนท์</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    การเดินทาง
                  </label>
                  <select
                    name="transportation"
                    value={formData.transportation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                  >
                    <option value="flight">เครื่องบิน</option>
                    <option value="bus">รถบัส</option>
                    <option value="private_car">รถส่วนตัว</option>
                    <option value="train">รถไฟ</option>
                    <option value="cruise">เรือสำราญ</option>
                    <option value="mixed">ผสมผสาน</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    กิจกรรมที่สนใจ
                  </label>
                  <input
                    type="text"
                    name="activities"
                    value={formData.activities}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    placeholder="เช่น ชมวัฒนธรรม, ผจญภัย, ช้อปปิ้ง"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    ความต้องการพิเศษ
                  </label>
                  <input
                    type="text"
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
                    placeholder="เช่น อาหารมังสวิรัติ, ผู้สูงอายุ, เด็กเล็ก"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    รายละเอียดเพิ่มเติม
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all resize-none"
                    placeholder="บอกเราเพิ่มเติมเกี่ยวกับความต้องการของคุณ..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-center">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] transition-all shadow-lg shadow-[#FFD700]/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังส่งคำขอ...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M231.4,44.34s0,0,0,0l-58.25,191.94a15.88,15.88,0,0,1-27.4,5.54L116.35,213.9a4,4,0,0,0-5.65-.27L63.5,235.73a15.86,15.86,0,0,1-22.29-18.08L98.75,28.37a15.88,15.88,0,0,1,27.4-5.54l29.4,27.92a4,4,0,0,0,5.65.27L208.4,28.92A15.86,15.86,0,0,1,231.4,44.34Z"/>
                    </svg>
                    ส่งคำขอใบเสนอราคา
                  </>
                )}
              </button>
              
              <p className="text-white/60 text-sm mt-4">
                ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง
              </p>
            </div>
          </form>
          
          {/* Additional Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-[#FFD700]/10 to-[#FFED4E]/10 rounded-xl border border-[#FFD700]/20">
              <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V88a12,12,0,0,1,24,0v48h28A12,12,0,0,1,168,148Z"/>
                </svg>
              </div>
              <h3 className="text-[#FFD700] font-semibold mb-2">รวดเร็ว</h3>
              <p className="text-white/70 text-sm">ติดต่อกลับภายใน 24 ชม.</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-[#FFD700]/10 to-[#FFED4E]/10 rounded-xl border border-[#FFD700]/20">
              <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/>
                </svg>
              </div>
              <h3 className="text-[#FFD700] font-semibold mb-2">ฟรี</h3>
              <p className="text-white/70 text-sm">ไม่มีค่าใช้จ่ายในการขอใบเสนอราคา</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-[#FFD700]/10 to-[#FFED4E]/10 rounded-xl border border-[#FFD700]/20">
              <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M176,112H152a8,8,0,0,1,0-16h24a8,8,0,0,1,0,16Zm-24,16h24a8,8,0,0,1,0,16H152a8,8,0,0,1,0-16Zm88-96V224a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V32A16,16,0,0,1,32,16H224A16,16,0,0,1,240,32ZM224,48H32V224H224V48ZM112,80A32,32,0,1,1,80,112,32,32,0,0,1,112,80ZM72,216a8,8,0,0,1-8-8,52,52,0,0,1,104,0,8,8,0,0,1-8,8Z"/>
                </svg>
              </div>
              <h3 className="text-[#FFD700] font-semibold mb-2">ปรับแต่งได้</h3>
              <p className="text-white/70 text-sm">ออกแบบทัวร์ตามความต้องการ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

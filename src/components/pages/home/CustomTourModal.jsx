"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getAllCountries, getCitiesByCountry, getFormattedLocation } from "@/utils/locationUtils";

export default function CustomTourModal({ isOpen, onClose }) {
  const router = useRouter();
  const { user, token } = useAuth();
  
  const [formData, setFormData] = useState({
    destination: '', // ประเทศ
    city: '',        // เมือง
    country: '',     // ประเภททริป
    startDate: '',
    endDate: '',
    numberOfPeople: 2,
    contactEmail: user?.email || '',
    contactPhone: user?.phone || '',
    contactName: user ? `${user.firstName} ${user.lastName}` : '',
    accommodation: '',
    transportation: '',
    specialRequirements: '',
    description: '',
    requireGuide: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactEmail: user.email || '',
        contactPhone: user.phone || '',
        contactName: `${user.firstName} ${user.lastName}`.trim() || ''
      }));
    }
  }, [user]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      // ถ้าเปลี่ยนประเทศ ให้ reset เมือง
      if (name === 'destination') {
        newData.city = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Submitting custom tour request:', formData);

    try {
      // Validate required fields
      if (!formData.destination || !formData.city || !formData.startDate || !formData.endDate || 
          !formData.contactEmail || !formData.contactPhone || !formData.contactName) {
        setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
        return;
      }

      // Validate dates
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();

      if (startDate < today) {
        setError('วันที่เริ่มต้องไม่เป็นวันที่ผ่านมาแล้ว');
        return;
      }

      if (endDate <= startDate) {
        setError('วันที่สิ้นสุดต้องมากกว่าวันที่เริ่ม');
        return;
      }

      const requestData = {
        ...formData,
        numberOfPeople: parseInt(formData.numberOfPeople),
        // รวม destination และ city เป็น location string
        destination: getFormattedLocation(formData.destination, formData.city),
        description: `Custom tour to ${getFormattedLocation(formData.destination, formData.city)}${formData.country ? ` (${formData.country})` : ''}. ${formData.requireGuide ? 'Require tour guide. ' : ''}${formData.description}`.trim()
      };

      console.log('Sending request data:', requestData);

      const response = await fetch('/api/custom-tour-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);
      
      let result;
      try {
        result = await response.json();
        console.log('Response data:', result);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        setError('เกิดข้อผิดพลาดในการประมวลผลข้อมูล');
        return;
      }

      if (response.ok && result.success) {
        console.log('Custom tour request created successfully:', result);
        
        // Close modal first
        onClose();
        
        // Navigate to success page with the request ID
        const requestId = result.data?.id;
        if (requestId) {
          router.push(`/tour-request-success?requestId=${requestId}`);
        } else {
          // Fallback to success page without ID
          console.warn('No request ID found in response, redirecting to general success page');
          router.push('/tour-request-success');
        }
      } else {
        console.error('Request failed:', result);
        setError(result.error || result.message || 'เกิดข้อผิดพลาดในการส่งคำขอ');
      }
    } catch (error) {
      console.error('Custom tour request error:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-gradient-to-br from-black/80 to-[#0a0804]/80 backdrop-blur-xl border border-[#FFD700]/20 rounded-2xl p-8 w-full max-w-4xl text-white relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#cdc08e] hover:text-[#FFD700] text-2xl font-bold transition-colors duration-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFD700]/10"
          disabled={loading}
        >
          ×
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-2">
            Request Custom Tour Package
          </h2>
          <p className="text-[#cdc08e] text-sm">สร้างแพ็คเกจทัวร์ในฝันของคุณ</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
            <div className="flex items-center gap-2">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Location Section */}
          <div className="bg-gradient-to-r from-black/40 to-[#0a0804]/40 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-6">
              ปลายทาง
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">ประเทศ *</label>
                <select
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                  required
                  disabled={loading}
                >
                  <option value="">เลือกประเทศ</option>
                  {getAllCountries().map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {formData.destination && (
                <div className="animate-fadeIn">
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">เมือง *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                    required
                    disabled={loading}
                  >
                    <option value="">เลือกเมือง</option>
                    {getCitiesByCountry(formData.destination).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Trip Details Section */}
          <div className="bg-gradient-to-r from-black/40 to-[#0a0804]/40 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-6">
              รายละเอียดการเดินทาง
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">ประเภททริป</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                  disabled={loading}
                >
                  <option value="">เลือกประเภททริป</option>
                  <option value="honeymoon">ฮันนีมูน</option>
                  <option value="family">ครอบครัว</option>
                  <option value="adventure">ผจญภัย</option>
                  <option value="cultural">วัฒนธรรม</option>
                  <option value="beach">ทะเล-ชายหาด</option>
                  <option value="shopping">ช้อปปิ้ง</option>
                  <option value="business">ธุรกิจ</option>
                  <option value="relaxation">พักผ่อน</option>
                </select>
              </div>

              <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">จำนวนคน *</label>
                <input
                  type="number"
                  name="numberOfPeople"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                  min="1"
                  max="50"
                  required
                  disabled={loading}
                  placeholder="จำนวนผู้เดินทาง"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">วันที่เริ่ม *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">วันที่สิ้นสุด *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                  required
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-gradient-to-r from-black/40 to-[#0a0804]/40 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-6">
              ข้อมูลติดต่อ
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                  placeholder="ชื่อ นามสกุล"
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">อีเมล *</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                      placeholder="example@email.com"
                      required
                      disabled={loading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-[#FFD700]/60" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">เบอร์โทรศัพท์ *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                      placeholder="0812345678"
                      required
                      disabled={loading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-[#FFD700]/60" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accommodation & Transportation Section */}
          <div className="bg-gradient-to-r from-black/40 to-[#0a0804]/40 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-6">
              ที่พักและการเดินทาง
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">ที่พัก</label>
                <select
                  name="accommodation"
                  value={formData.accommodation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                  disabled={loading}
                >
                  <option value="">เลือกประเภทที่พัก</option>
                  <option value="budget">งบประหยัด (2-3 ดาว)</option>
                  <option value="standard">มาตรฐาน (3-4 ดาว)</option>
                  <option value="premium">พรีเมียม (4-5 ดาว)</option>
                  <option value="luxury">หรูหรา (5 ดาว)</option>
                  <option value="resort">รีสอร์ท</option>
                  <option value="boutique">บูติคโรงแรม</option>
                  <option value="hostel">โฮสเทล</option>
                  <option value="apartment">อพาร์ทเมนท์</option>
                  <option value="villa">วิลล่า</option>
                </select>
              </div>

              <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">การเดินทาง</label>
                <select
                  name="transportation"
                  value={formData.transportation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                  disabled={loading}
                >
                  <option value="">เลือกประเภทการเดินทาง</option>
                  <option value="flight">เครื่องบิน</option>
                  <option value="bus">รถโค้ช</option>
                  <option value="train">รถไฟ</option>
                  <option value="private-car">รถส่วนตัว</option>
                  <option value="van">รถตู้</option>
                  <option value="cruise">เรือสำราญ</option>
                  <option value="mixed">หลายรูปแบบ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="bg-gradient-to-r from-black/40 to-[#0a0804]/40 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-6">
              รายละเอียดเพิ่มเติม
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">ความต้องการพิเศษ</label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 resize-none transition-all duration-200"
                  placeholder="เช่น อาหารมังสวิรัติ, ผู้พิการ, เด็กเล็ก"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-[#FFD700] text-sm font-medium mb-2">รายละเอียดเพิ่มเติม</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 resize-none transition-all duration-200"
                  placeholder="บอกเราเพิ่มเติมเกี่ยวกับทริปในฝัน..."
                  disabled={loading}
                />
              </div>

              <div className="flex items-center gap-3 bg-gradient-to-r from-black/40 to-[#0a0804]/40 backdrop-blur-xl border border-[#FFD700]/20 p-4 rounded-xl">
                <input
                  id="requireGuide"
                  type="checkbox"
                  name="requireGuide"
                  checked={formData.requireGuide}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-2 border-[#FFD700]/20 bg-gradient-to-r from-black/60 to-[#0a0804]/60 text-[#FFD700] focus:ring-[#FFD700] focus:ring-2 transition-all duration-200"
                  disabled={loading}
                />
                <label htmlFor="requireGuide" className="text-[#cdc08e] cursor-pointer">
                  ต้องการไกด์นำเที่ยว
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 text-[#cdc08e] font-medium py-4 px-6 rounded-xl hover:border-[#FFD700]/40 transition-all duration-200 disabled:opacity-50"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>กำลังส่ง...</span>
                </div>
              ) : (
                <span>ส่งคำขอ</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

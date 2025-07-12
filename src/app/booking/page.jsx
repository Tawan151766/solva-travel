'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext-simple';

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    startDate: '',
    endDate: '',
    numberOfPeople: 1,
    specialRequirements: '',
    notes: ''
  });

  const [packageData, setPackageData] = useState(null);
  const [customTourData, setCustomTourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get booking parameters from URL
  const bookingType = searchParams.get('type'); // 'package' or 'custom'
  const packageId = searchParams.get('packageId');
  const customTourRequestId = searchParams.get('customTourRequestId');
  const selectedGroupSize = searchParams.get('groupSize'); // For package bookings

  useEffect(() => {
    // Auto-fill user data if logged in
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: `${user.firstName} ${user.lastName}`,
        customerEmail: user.email,
        customerPhone: user.phone || ''
      }));
    }

    // Load package or custom tour data
    loadBookingData();
  }, [user, packageId, customTourRequestId, bookingType]);

  const loadBookingData = async () => {
    try {
      setLoading(true);
      setError('');

      if (bookingType === 'package' && packageId) {
        console.log('Loading package data for ID:', packageId);
        const response = await fetch(`/api/travel/packages/${packageId}`);
        console.log('Package response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Package data received:', data);
          setPackageData(data.data); // แก้จาก data.package เป็น data.data
          
          // Set default dates - packages don't have specific start dates, so use today + 7 days as default
          const today = new Date();
          const defaultStartDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
          const defaultEndDate = new Date(defaultStartDate.getTime() + (data.data.durationDays || 7) * 24 * 60 * 60 * 1000);
          
          setFormData(prev => ({
            ...prev,
            startDate: defaultStartDate.toISOString().split('T')[0],
            endDate: defaultEndDate.toISOString().split('T')[0]
          }));
        } else {
          const errorData = await response.json();
          console.error('Package API error:', errorData);
          setError('Failed to load package information');
        }
      } else if (bookingType === 'custom' && customTourRequestId) {
        console.log('Loading custom tour data for ID:', customTourRequestId);
        const response = await fetch(`/api/custom-tour-requests/${customTourRequestId}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        console.log('Custom tour response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Custom tour data received:', data);
          setCustomTourData(data.request);
          
          // Pre-fill form with custom tour data
          setFormData(prev => ({
            ...prev,
            customerName: data.request.contactName,
            customerEmail: data.request.contactEmail,
            customerPhone: data.request.contactPhone,
            startDate: new Date(data.request.startDate).toISOString().split('T')[0],
            endDate: new Date(data.request.endDate).toISOString().split('T')[0],
            numberOfPeople: data.request.numberOfPeople,
            specialRequirements: data.request.specialRequirements || '',
            notes: data.request.description || ''
          }));
        } else {
          const errorData = await response.json();
          console.error('Custom tour API error:', errorData);
          setError('Failed to load custom tour information');
        }
      } else {
        console.log('Missing booking type or ID:', { bookingType, packageId, customTourRequestId });
        setError('Invalid booking parameters');
      }
    } catch (error) {
      console.error('Error loading booking data:', error);
      setError('Failed to load booking information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalAmount = () => {
    if (bookingType === 'package' && packageData) {
      // Check if package has group pricing and a group size is selected
      if (packageData.groupPricing && selectedGroupSize && packageData.groupPricing[selectedGroupSize]) {
        const groupPricing = packageData.groupPricing[selectedGroupSize];
        return parseFloat(groupPricing.price) * formData.numberOfPeople;
      }
      // Fallback to regular price
      return (packageData.priceNumber || parseFloat(packageData.price || 0)) * formData.numberOfPeople;
    } else if (bookingType === 'custom' && customTourData) {
      return customTourData.estimatedCost || 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const bookingData = {
        bookingType: bookingType.toUpperCase(),
        packageId: bookingType === 'package' ? packageId : null,
        customTourRequestId: bookingType === 'custom' ? customTourRequestId : null,
        selectedGroupSize: bookingType === 'package' && selectedGroupSize ? selectedGroupSize : null,
        ...formData,
        numberOfPeople: parseInt(formData.numberOfPeople)
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/booking-success?bookingNumber=${result.booking.bookingNumber}`);
      } else {
        setError(result.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setError('An error occurred while creating your booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#cdc08e] text-lg">กำลังโหลดข้อมูลการจอง...</p>
        </div>
      </div>
    );
  }

  if (!bookingType || (!packageData && !customTourData)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] flex items-center justify-center">
        <div className="text-center bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 p-8">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-4">ข้อมูลการจองไม่ถูกต้อง</h2>
          <p className="text-[#cdc08e] mb-6">ไม่พบข้อมูลการจองที่ต้องการ</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/30 font-semibold transition-all duration-200"
          >
            กลับไปหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-8 py-6">
            <h1 className="text-3xl font-bold">
              {bookingType === 'package' ? 'จองแพ็คเกจทัวร์' : 'จองทัวร์แบบกำหนดเอง'}
            </h1>
            <p className="text-black/80 mt-1">กรอกข้อมูลการจองของคุณให้ครบถ้วน</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Booking Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-4">
                  {bookingType === 'package' ? 'รายละเอียดแพ็คเกจ' : 'รายละเอียดทัวร์'}
                </h2>
                
                {packageData && (
                  <div className="bg-gradient-to-r from-black/40 to-[#0a0804]/40 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-xl text-white">{packageData.title || packageData.name}</h3>
                    <p className="text-[#cdc08e]">{packageData.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-white">
                        <span className="text-[#FFD700] font-medium">ระยะเวลา:</span> {packageData.duration}
                      </div>
                      <div className="text-white">
                        <span className="text-[#FFD700] font-medium">สถานที่:</span> {packageData.location}
                      </div>
                      {packageData.groupPricing && selectedGroupSize ? (
                        <>
                          <div className="text-white">
                            <span className="text-[#FFD700] font-medium">แพ็คเกจ:</span> {packageData.groupPricing[selectedGroupSize]?.label || `Group of ${selectedGroupSize}`}
                          </div>
                          <div className="text-white">
                            <span className="text-[#FFD700] font-medium">ราคาต่อคน:</span> ${packageData.groupPricing[selectedGroupSize]?.price}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-white">
                            <span className="text-[#FFD700] font-medium">ราคาต่อคน:</span> {packageData.price}
                          </div>
                          <div className="text-white">
                            <span className="text-[#FFD700] font-medium">จำนวนที่รับได้:</span> {packageData.maxCapacity} คน
                          </div>
                        </>
                      )}
                    </div>
                    {packageData.groupPricing && selectedGroupSize && (
                      <div className="mt-4 p-3 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg">
                        <p className="text-sm text-[#FFD700]">
                          คุณเลือกแพ็คเกจกลุ่ม: {packageData.groupPricing[selectedGroupSize]?.label} ในราคา ${packageData.groupPricing[selectedGroupSize]?.price} ต่อคน
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {customTourData && (
                  <div className="bg-gradient-to-r from-black/40 to-[#0a0804]/40 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-xl text-white">ทัวร์แบบกำหนดเอง - {customTourData.destination}</h3>
                    {customTourData.description && (
                      <p className="text-[#cdc08e]">{customTourData.description}</p>
                    )}
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="text-white"><span className="text-[#FFD700] font-medium">จุดหมาย:</span> {customTourData.destination}</div>
                      <div className="text-white"><span className="text-[#FFD700] font-medium">ระยะเวลา:</span> {Math.ceil((new Date(customTourData.endDate) - new Date(customTourData.startDate)) / (1000 * 60 * 60 * 24))} วัน</div>
                      <div className="text-white"><span className="text-[#FFD700] font-medium">จำนวนคน:</span> {customTourData.numberOfPeople} คน</div>
                      {customTourData.accommodation && (
                        <div className="text-white"><span className="text-[#FFD700] font-medium">ที่พัก:</span> {customTourData.accommodation}</div>
                      )}
                      {customTourData.transportation && (
                        <div className="text-white"><span className="text-[#FFD700] font-medium">การเดินทาง:</span> {customTourData.transportation}</div>
                      )}
                      {customTourData.estimatedCost && (
                        <div className="text-white"><span className="text-[#FFD700] font-medium">ราคาประเมิน:</span> ฿{customTourData.estimatedCost.toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFED4E]/10 border border-[#FFD700]/30 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-[#FFD700] mb-4">สรุปราคา</h3>
                <div className="space-y-3 text-sm">
                  {bookingType === 'package' ? (
                    <>
                      <div className="flex justify-between text-white">
                        <span>ราคาต่อคน:</span>
                        <span>
                          {packageData?.groupPricing && selectedGroupSize 
                            ? `$${packageData.groupPricing[selectedGroupSize]?.price}` 
                            : packageData?.price
                          }
                        </span>
                      </div>
                      <div className="flex justify-between text-white">
                        <span>จำนวนคน:</span>
                        <span>{formData.numberOfPeople} คน</span>
                      </div>
                      <hr className="border-[#FFD700]/20" />
                      <div className="flex justify-between font-semibold text-lg text-[#FFD700]">
                        <span>รวมทั้งหมด:</span>
                        <span>${calculateTotalAmount().toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between font-semibold text-lg text-[#FFD700]">
                      <span>ราคาประเมินทั้งหมด:</span>
                      <span>฿{calculateTotalAmount().toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-6">ข้อมูลลูกค้า</h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    ชื่อ-นามสกุล *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                    placeholder="กรอกชื่อ-นามสกุล"
                  />
                </div>

                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    อีเมล *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    หมายเลขโทรศัพท์ *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                    placeholder="08X-XXX-XXXX"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                      วันที่เริ่ม *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                      วันที่สิ้นสุด *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      min={formData.startDate}
                      className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                    />
                  </div>
                </div>

                {bookingType === 'package' && (
                  <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                      จำนวนคน *
                    </label>
                    <select
                      name="numberOfPeople"
                      value={formData.numberOfPeople}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                    >
                      {[...Array(Math.min(packageData?.maxCapacity || 10, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1} className="bg-black text-white">
                          {i + 1} {i === 0 ? 'คน' : 'คน'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {bookingType === 'custom' && (
                  <div>
                    <label className="block text-[#FFD700] text-sm font-medium mb-2">
                      จำนวนคน *
                    </label>
                    <input
                      type="number"
                      name="numberOfPeople"
                      value={formData.numberOfPeople}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="50"
                      className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                      placeholder="จำนวนคน"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    ความต้องการพิเศษ
                  </label>
                  <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="ความต้องการด้านอาหาร, การเข้าถึง, หรือความต้องการพิเศษอื่นๆ..."
                    className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 resize-none transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-[#FFD700] text-sm font-medium mb-2">
                    หมายเหตุเพิ่มเติม
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="ข้อมูลเพิ่มเติมหรือคำขออื่นๆ..."
                    className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 resize-none transition-all duration-200"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 text-[#cdc08e] font-medium py-4 px-6 rounded-xl hover:border-[#FFD700]/40 transition-all duration-200"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        <span>กำลังดำเนินการ...</span>
                      </div>
                    ) : (
                      <span>ยืนยันการจอง</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

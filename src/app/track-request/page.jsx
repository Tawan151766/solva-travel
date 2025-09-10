'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackRequestPage() {
  const router = useRouter();
  const [requestId, setRequestId] = useState('');
  const [request, setRequest] = useState(null);
  const [requestType, setRequestType] = useState(null); // 'booking' or 'custom_tour'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!requestId.trim()) {
      setError('กรุณาใส่หมายเลขติดตาม');
      return;
    }

    setLoading(true);
    setError('');
    setRequest(null);
    setRequestType(null);

    try {
      // Clean the request ID (remove # and convert to uppercase for proper search)
      const cleanRequestId = requestId.replace('#', '').trim();
      
      let foundData = null;
      let foundType = null;

      // Try searching in bookings first (if it looks like a booking number: BK...)
      if (cleanRequestId.toUpperCase().startsWith('BK')) {
        try {
          const bookingResponse = await fetch(`/api/bookings/search?query=${cleanRequestId}`);
          const bookingData = await bookingResponse.json();
          
          if (bookingResponse.ok && bookingData.success) {
            foundData = bookingData.data;
            foundType = 'booking';
            console.log('Found booking:', foundData);
          }
        } catch (bookingError) {
          console.log('No booking found, trying custom tour requests...');
        }
      }

      // If not found in bookings, try custom tour requests (if it looks like CTR... or not found yet)
      if (!foundData) {
        try {
          const tourResponse = await fetch(`/api/custom-tour-requests/search?query=${cleanRequestId}`);
          const tourData = await tourResponse.json();
          
          if (tourResponse.ok && tourData.success) {
            foundData = tourData.data;
            foundType = 'custom_tour';
            console.log('Found custom tour request:', foundData);
          }
        } catch (tourError) {
          console.log('No custom tour request found either');
        }
      }

      if (foundData && foundType) {
        setRequest(foundData);
        setRequestType(foundType);
      } else {
        setError('ไม่พบหมายเลขติดตามที่ท่านระบุ กรุณาตรวจสอบหมายเลขอีกครั้ง');
      }
    } catch (error) {
      console.error('Error searching:', error);
      setError('เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'processing': 
      case 'in_progress': return 'text-blue-400 bg-blue-400/10';
      case 'confirmed': return 'text-green-400 bg-green-400/10';
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      case 'quoted': return 'text-purple-400 bg-purple-400/10';
      case 'paid': return 'text-green-400 bg-green-400/10';
      case 'partial': return 'text-orange-400 bg-orange-400/10';
      case 'refunded': return 'text-gray-400 bg-gray-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusText = (status) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case 'pending': return 'รอดำเนินการ';
      case 'processing': return 'กำลังดำเนินการ';
      case 'in_progress': return 'กำลังดำเนินการ';
      case 'confirmed': return 'ยืนยันแล้ว';
      case 'completed': return 'เสร็จสิ้น';
      case 'cancelled': return 'ยกเลิก';
      case 'quoted': return 'ได้รับใบเสนอราคา';
      case 'paid': return 'ชำระแล้ว';
      case 'partial': return 'ชำระบางส่วน';
      case 'refunded': return 'คืนเงินแล้ว';
      case 'failed': return 'ไม่สำเร็จ';
      default: return status || 'ไม่ทราบสถานะ';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-4">
            ติดตามการจองและคำขอ
          </h1>
          <p className="text-white/70 text-lg">
            ใส่หมายเลขการจองหรือหมายเลขคำขอของคุณเพื่อตรวจสอบสถานะ
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label htmlFor="requestId" className="block text-[#FFD700] text-sm font-medium mb-2">
                หมายเลขติดตาม
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="requestId"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl text-[#cdc08e] placeholder-[#B8860B]/60 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 transition-all duration-200"
                  placeholder="เช่น: BK1734567890123 (การจอง) หรือ CTR-20241212-ABC12 (คำขอ)"
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-[#FFD700]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>กำลังค้นหา...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>ค้นหาคำขอ</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Request/Booking Details */}
        {request && (
          <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {requestType === 'booking' 
                      ? `หมายเลขการจอง: ${request.bookingNumber}` 
                      : `หมายเลขติดตาม: ${request.trackingNumber}`
                    }
                  </h2>
                  <p className="text-black/70">
                    {requestType === 'booking' ? 'การจอง' : 'คำขอทัวร์'} สร้างเมื่อ {new Date(request.createdAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {getStatusText(request.status)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Details */}
              <div>
                <h3 className="text-lg font-semibold text-[#FFD700] mb-4">
                  {requestType === 'booking' ? 'รายละเอียดการจอง' : 'รายละเอียดคำขอ'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">ข้อมูลทั่วไป</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-white/60">จุดหมาย:</span>
                        <span className="text-white ml-2">
                          {requestType === 'booking' 
                            ? (request.package?.location || request.customTourRequest?.destination || 'ไม่ระบุ')
                            : request.destination
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">จำนวนคน:</span>
                        <span className="text-white ml-2">{request.numberOfPeople} คน</span>
                      </div>
                      <div>
                        <span className="text-white/60">วันที่เดินทาง:</span>
                        <span className="text-white ml-2">
                          {new Date(request.startDate).toLocaleDateString('th-TH')} - {new Date(request.endDate).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                      {requestType === 'booking' && request.totalAmount && (
                        <div>
                          <span className="text-white/60">ราคารวม:</span>
                          <span className="text-white ml-2">฿{(parseFloat(request.totalAmount) || 0).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">ข้อมูลติดต่อ</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-white/60">ชื่อ:</span>
                        <span className="text-white ml-2">
                          {requestType === 'booking' ? request.customerName : request.contactName}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">อีเมล:</span>
                        <span className="text-white ml-2">
                          {requestType === 'booking' ? request.customerEmail : request.contactEmail}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">โทรศัพท์:</span>
                        <span className="text-white ml-2">
                          {requestType === 'booking' ? request.customerPhone : request.contactPhone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package/Tour Details */}
              {requestType === 'booking' && request.package && (
                <div>
                  <h3 className="text-lg font-semibold text-[#FFD700] mb-4">รายละเอียดแพ็คเกจ</h3>
                  <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">{request.package.name}</h4>
                    <p className="text-white/70 text-sm mb-2">{request.package.description}</p>
                    <div className="text-sm">
                      <span className="text-white/60">ระยะเวลา:</span>
                      <span className="text-white ml-2">{request.package.duration} วัน</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Details for Custom Tour Requests */}
              {requestType === 'custom_tour' && (request.accommodation || request.transportation || request.budget) && (
                <div>
                  <h3 className="text-lg font-semibold text-[#FFD700] mb-4">รายละเอียดเพิ่มเติม</h3>
                  <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {request.accommodation && (
                        <div>
                          <span className="text-white/60">ที่พัก:</span>
                          <span className="text-white ml-2">{request.accommodation}</span>
                        </div>
                      )}
                      {request.transportation && (
                        <div>
                          <span className="text-white/60">การเดินทาง:</span>
                          <span className="text-white ml-2">{request.transportation}</span>
                        </div>
                      )}
                      {request.budget && (
                        <div>
                          <span className="text-white/60">งบประมาณ:</span>
                          <span className="text-white ml-2">฿{(parseFloat(request.budget) || 0).toLocaleString()}</span>
                        </div>
                      )}
                      {request.activities && (
                        <div>
                          <span className="text-white/60">กิจกรรม:</span>
                          <span className="text-white ml-2">{request.activities}</span>
                        </div>
                      )}
                    </div>
                    {request.specialRequirements && (
                      <div className="mt-4">
                        <span className="text-white/60">ความต้องการพิเศษ:</span>
                        <p className="text-white mt-1">{request.specialRequirements}</p>
                      </div>
                    )}
                    {request.description && (
                      <div className="mt-4">
                        <span className="text-white/60">รายละเอียดเพิ่มเติม:</span>
                        <p className="text-white mt-1">{request.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Status for Bookings */}
              {requestType === 'booking' && request.paymentStatus && (
                <div>
                  <h3 className="text-lg font-semibold text-[#FFD700] mb-4">สถานะการชำระเงิน</h3>
                  <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-lg p-4">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.paymentStatus)}`}>
                      {getStatusText(request.paymentStatus)}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-[#FFD700]/20">
                {requestType === 'booking' && (
                  <button
                    onClick={() => router.push(`/booking-details/${request.id}`)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black py-2 px-4 rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/30 transition-all duration-200 text-sm font-semibold"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216V152H200V88a16,16,0,0,0-16-16H72ZM184,200H40V88H184Z"/>
                    </svg>
                    ดูรายละเอียดการจอง
                  </button>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 bg-[#FFD700]/20 border border-[#FFD700]/40 text-[#FFD700] py-2 px-4 rounded-lg hover:bg-[#FFD700]/30 transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  รีเฟรชสถานะ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="bg-black/50 border border-[#FFD700]/30 text-[#FFD700] py-3 px-6 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
          >
            กลับไปหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
}

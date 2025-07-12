'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackRequestPage() {
  const router = useRouter();
  const [requestId, setRequestId] = useState('');
  const [request, setRequest] = useState(null);
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

    try {
      // Clean the request ID (remove # and convert to lowercase)
      const cleanRequestId = requestId.replace('#', '').toLowerCase();
      
      const response = await fetch(`/api/custom-tour-requests/search?query=${cleanRequestId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setRequest(data.data);
      } else {
        setError(data.error || 'ไม่พบคำขอที่ต้องการ');
      }
    } catch (error) {
      console.error('Error searching request:', error);
      setError('เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'processing': return 'text-blue-400 bg-blue-400/10';
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'รอดำเนินการ';
      case 'processing': return 'กำลังดำเนินการ';
      case 'completed': return 'เสร็จสิ้น';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-4">
            ติดตามคำขอ Custom Tour
          </h1>
          <p className="text-white/70 text-lg">
            ใส่หมายเลขคำขอของคุณเพื่อตรวจสอบสถานะ
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
                  placeholder="เช่น: CTR-20241212-ABC12 หรือ #CTR-20241212-ABC12"
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

        {/* Request Details */}
        {request && (
          <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">หมายเลขติดตาม: {request.trackingNumber}</h2>
                  <p className="text-black/70">สร้างเมื่อ {new Date(request.createdAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {getStatusText(request.status)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Request Details */}
              <div>
                <h3 className="text-lg font-semibold text-[#FFD700] mb-4">รายละเอียดคำขอ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">ข้อมูลทั่วไป</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-white/60">จุดหมาย:</span>
                        <span className="text-white ml-2">{request.destination}</span>
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
                    </div>
                  </div>

                  <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">ข้อมูลติดต่อ</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-white/60">ชื่อ:</span>
                        <span className="text-white ml-2">{request.contactName}</span>
                      </div>
                      <div>
                        <span className="text-white/60">อีเมล:</span>
                        <span className="text-white ml-2">{request.contactEmail}</span>
                      </div>
                      <div>
                        <span className="text-white/60">โทรศัพท์:</span>
                        <span className="text-white ml-2">{request.contactPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {(request.accommodation || request.transportation) && (
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

              {/* Status Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-[#FFD700] mb-4">สถานะคำขอ</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      request.status === 'pending' ? 'bg-yellow-400 text-black' : 'bg-yellow-400/20 text-yellow-400'
                    }`}>
                      <span className="text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">คำขอได้รับการส่ง</h4>
                      <p className="text-white/70 text-sm">
                        เมื่อ {new Date(request.createdAt).toLocaleDateString('th-TH', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      ['processing', 'completed'].includes(request.status) ? 'bg-blue-400 text-black' : 'bg-gray-400/20 text-gray-400'
                    }`}>
                      <span className="text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">กำลังดำเนินการ</h4>
                      <p className="text-white/70 text-sm">
                        {['processing', 'completed'].includes(request.status) 
                          ? 'ทีมงานกำลังจัดเตรียมโปรแกรมให้คุณ' 
                          : 'รอการดำเนินการ'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      request.status === 'completed' ? 'bg-green-400 text-black' : 'bg-gray-400/20 text-gray-400'
                    }`}>
                      <span className="text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">เสร็จสิ้น</h4>
                      <p className="text-white/70 text-sm">
                        {request.status === 'completed' 
                          ? 'คำขอเสร็จสิ้นแล้ว' 
                          : 'รอการดำเนินการ'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t border-[#FFD700]/20 pt-6">
                <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">ต้องการความช่วยเหลือ?</h4>
                  <p className="text-white/80 text-sm mb-2">
                    หากมีคำถามเพิ่มเติม กรุณาติดต่อเรา:
                  </p>
                  <div className="space-y-1 text-sm text-white/70">
                    <p>📧 custom@solvatravel.com</p>
                    <p>📞 +66 2-123-4567</p>
                    <p>💬 Line: @solvatravel</p>
                  </div>
                </div>
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

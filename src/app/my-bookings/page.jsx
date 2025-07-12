'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext-simple';
import Link from 'next/link';

export default function MyBookingsPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Status filter options
  const statusOptions = [
    { value: 'ALL', label: 'ทั้งหมด', color: 'text-[#FFD700]' },
    { value: 'PENDING', label: 'รอดำเนินการ', color: 'text-yellow-400' },
    { value: 'CONFIRMED', label: 'ยืนยันแล้ว', color: 'text-green-400' },
    { value: 'CANCELLED', label: 'ยกเลิกแล้ว', color: 'text-red-400' },
    { value: 'COMPLETED', label: 'เสร็จสิ้น', color: 'text-blue-400' }
  ];

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/auth/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, token, selectedStatus, currentPage]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      if (selectedStatus !== 'ALL') {
        params.append('status', selectedStatus);
      }

      const response = await fetch(`/api/bookings?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
        setPagination(data.pagination);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || 'text-gray-400';
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.label || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">เข้าสู่ระบบเพื่อดูการจอง</h2>
          <p className="text-[#cdc08e] mb-6">กรุณาเข้าสู่ระบบเพื่อดูรายการการจองของคุณ</p>
          <Link href="/auth/login">
            <button className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/30 font-semibold transition-all duration-200">
              เข้าสู่ระบบ
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl mb-8">
          <div className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-8 py-6 rounded-t-2xl">
            <h1 className="text-3xl font-bold">การจองของฉัน</h1>
            <p className="text-black/80 mt-1">รายการการจองทัวร์ทั้งหมด</p>
          </div>

          {/* Filter Section */}
          <div className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedStatus(option.value);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      selectedStatus === option.value
                        ? 'bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black shadow-lg shadow-[#FFD700]/30'
                        : 'bg-gradient-to-r from-black/40 to-[#0a0804]/40 backdrop-blur-xl border border-[#FFD700]/20 text-[#cdc08e] hover:border-[#FFD700]/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="text-sm text-[#cdc08e]">
                {pagination && (
                  <span>
                    แสดง {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} 
                    จาก {pagination.total} รายการ
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl p-12 text-center">
            <div className="text-6xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-[#FFD700] mb-4">ไม่พบการจอง</h3>
            <p className="text-[#cdc08e] mb-8">
              {selectedStatus === 'ALL' 
                ? 'คุณยังไม่มีการจองใดๆ' 
                : `ไม่พบการจองที่มีสถานะ "${getStatusLabel(selectedStatus)}"`
              }
            </p>
            <Link href="/">
              <button className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/30 font-semibold transition-all duration-200">
                เริ่มจองทัวร์
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl overflow-hidden hover:shadow-[#FFD700]/10 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-3 py-1 rounded-lg text-sm font-semibold">
                          {booking.bookingNumber}
                        </div>
                        <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(booking.status)} bg-current/10`}>
                          {getStatusLabel(booking.status)}
                        </div>
                        <div className="text-sm text-[#cdc08e]">
                          {booking.bookingType === 'PACKAGE' ? 'แพ็คเกจทัวร์' : 'ทัวร์แบบกำหนดเอง'}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-2">
                        {booking.bookingType === 'PACKAGE' 
                          ? booking.package?.title || booking.package?.name || 'แพ็คเกจทัวร์'
                          : `ทัวร์แบบกำหนดเอง - ${booking.customTourRequest?.destination || 'ไม่ระบุ'}`
                        }
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-[#cdc08e]">
                          <span className="text-[#FFD700] font-medium">วันเริ่มต้น:</span><br />
                          {formatDate(booking.startDate)}
                        </div>
                        <div className="text-[#cdc08e]">
                          <span className="text-[#FFD700] font-medium">วันสิ้นสุด:</span><br />
                          {formatDate(booking.endDate)}
                        </div>
                        <div className="text-[#cdc08e]">
                          <span className="text-[#FFD700] font-medium">จำนวนคน:</span><br />
                          {booking.numberOfPeople} คน
                        </div>
                      </div>

                      {booking.selectedGroupSize && booking.package?.groupPricing && (
                        <div className="mt-3 p-3 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg">
                          <p className="text-sm text-[#FFD700]">
                            แพ็คเกจกลุ่ม: {JSON.parse(booking.package.groupPricing)[booking.selectedGroupSize]?.label || `Group of ${booking.selectedGroupSize}`}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#FFD700]">
                          {formatAmount(booking.totalAmount)}
                        </div>
                        <div className="text-sm text-[#cdc08e]">
                          ราคารวมทั้งหมด
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link href={`/booking-details/${booking.id}`}>
                          <button className="px-4 py-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 text-[#FFD700] rounded-lg hover:bg-gradient-to-r hover:from-[#FFD700]/30 hover:to-[#FFED4E]/30 transition-all duration-200">
                            ดูรายละเอียด
                          </button>
                        </Link>
                        
                        {booking.status === 'PENDING' && (
                          <button className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-xl border border-red-500/30 text-red-400 rounded-lg hover:bg-gradient-to-r hover:from-red-500/30 hover:to-red-600/30 transition-all duration-200">
                            ยกเลิก
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(booking.specialRequirements || booking.notes) && (
                    <div className="mt-6 pt-6 border-t border-[#FFD700]/20">
                      {booking.specialRequirements && (
                        <div className="mb-3">
                          <span className="text-[#FFD700] font-medium text-sm">ความต้องการพิเศษ:</span>
                          <p className="text-[#cdc08e] text-sm mt-1">{booking.specialRequirements}</p>
                        </div>
                      )}
                      {booking.notes && (
                        <div>
                          <span className="text-[#FFD700] font-medium text-sm">หมายเหตุ:</span>
                          <p className="text-[#cdc08e] text-sm mt-1">{booking.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gradient-to-r from-black/40 to-[#0a0804]/40 backdrop-blur-xl border border-[#FFD700]/20 text-[#cdc08e] rounded-lg hover:border-[#FFD700]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ก่อนหน้า
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold'
                        : 'bg-gradient-to-r from-black/40 to-[#0a0804]/40 backdrop-blur-xl border border-[#FFD700]/20 text-[#cdc08e] hover:border-[#FFD700]/50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                  disabled={currentPage === pagination.pages}
                  className="px-4 py-2 bg-gradient-to-r from-black/40 to-[#0a0804]/40 backdrop-blur-xl border border-[#FFD700]/20 text-[#cdc08e] rounded-lg hover:border-[#FFD700]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ถัดไป
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

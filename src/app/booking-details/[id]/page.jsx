'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function BookingDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user, token, isAuthenticated } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/auth/login');
      return;
    }
    
    if (id) {
      fetchBookingDetails();
    }
  }, [isAuthenticated, token, id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/bookings/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch booking details');
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'CONFIRMED': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'CANCELLED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'COMPLETED': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'รอดำเนินการ';
      case 'CONFIRMED': return 'ยืนยันแล้ว';
      case 'CANCELLED': return 'ยกเลิกแล้ว';
      case 'COMPLETED': return 'เสร็จสิ้น';
      default: return status;
    }
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
          <p className="text-[#cdc08e] text-lg">กำลังโหลดรายละเอียดการจอง...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-4">เข้าสู่ระบบเพื่อดูรายละเอียด</h2>
          <p className="text-[#cdc08e] mb-6">กรุณาเข้าสู่ระบบเพื่อดูรายละเอียดการจอง</p>
          <Link href="/auth/login">
            <button className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/30 font-semibold transition-all duration-200">
              เข้าสู่ระบบ
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">ไม่พบข้อมูลการจอง</h2>
          <p className="text-[#cdc08e] mb-6">{error || 'ไม่พบรายละเอียดการจองที่ต้องการ'}</p>
          <Link href="/my-bookings">
            <button className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/30 font-semibold transition-all duration-200">
              กลับไปหน้าการจอง
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link href="/" className="text-[#FFD700] hover:text-[#FFED4E] transition-colors">
            หน้าหลัก
          </Link>
          <span className="text-[#FFD700]/50">/</span>
          <Link href="/my-bookings" className="text-[#FFD700] hover:text-[#FFED4E] transition-colors">
            การจองของฉัน
          </Link>
          <span className="text-[#FFD700]/50">/</span>
          <span className="text-white font-medium">
            รายละเอียดการจอง
          </span>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl mb-8">
          <div className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-8 py-6 rounded-t-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">{booking.bookingNumber}</h1>
                <p className="text-black/80 mt-1">รายละเอียดการจอง</p>
              </div>
              <div className={`mt-4 md:mt-0 px-4 py-2 rounded-xl border-2 font-semibold ${getStatusColor(booking.status)}`}>
                {getStatusLabel(booking.status)}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FFD700]">{formatAmount(booking.totalAmount)}</div>
                <div className="text-sm text-[#cdc08e]">ราคารวม</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FFD700]">{booking.numberOfPeople}</div>
                <div className="text-sm text-[#cdc08e]">จำนวนคน</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#FFD700]">{formatDate(booking.startDate)}</div>
                <div className="text-sm text-[#cdc08e]">วันเริ่มต้น</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#FFD700]">{formatDate(booking.endDate)}</div>
                <div className="text-sm text-[#cdc08e]">วันสิ้นสุด</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Package/Tour Details */}
          <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl p-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-6">
              {booking.bookingType === 'PACKAGE' ? 'รายละเอียดแพ็คเกจ' : 'รายละเอียดทัวร์'}
            </h2>
            
            {booking.bookingType === 'PACKAGE' && booking.package && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">{booking.package.title || booking.package.name}</h3>
                <p className="text-[#cdc08e]">{booking.package.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#FFD700] font-medium">ระยะเวลา:</span>
                    <div className="text-white">{booking.package.duration}</div>
                  </div>
                  <div>
                    <span className="text-[#FFD700] font-medium">สถานที่:</span>
                    <div className="text-white">{booking.package.location}</div>
                  </div>
                </div>

                {booking.selectedGroupSize && booking.package.groupPricing && (
                  <div className="mt-4 p-3 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg">
                    <span className="text-[#FFD700] font-medium text-sm">แพ็คเกจกลุ่ม:</span>
                    <p className="text-white text-sm">
                      {JSON.parse(booking.package.groupPricing)[booking.selectedGroupSize]?.label || `Group of ${booking.selectedGroupSize}`}
                    </p>
                  </div>
                )}
              </div>
            )}

            {booking.bookingType === 'CUSTOM' && booking.customTourRequest && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">ทัวร์แบบกำหนดเอง - {booking.customTourRequest.destination}</h3>
                {booking.customTourRequest.description && (
                  <p className="text-[#cdc08e]">{booking.customTourRequest.description}</p>
                )}
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[#FFD700] font-medium">จุดหมาย:</span>
                    <div className="text-white">{booking.customTourRequest.destination}</div>
                  </div>
                  {booking.customTourRequest.accommodation && (
                    <div>
                      <span className="text-[#FFD700] font-medium">ที่พัก:</span>
                      <div className="text-white">{booking.customTourRequest.accommodation}</div>
                    </div>
                  )}
                  {booking.customTourRequest.transportation && (
                    <div>
                      <span className="text-[#FFD700] font-medium">การเดินทาง:</span>
                      <div className="text-white">{booking.customTourRequest.transportation}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Customer Details */}
          <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl p-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-6">
              ข้อมูลลูกค้า
            </h2>
            
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-[#FFD700] font-medium">ชื่อ-นามสกุล:</span>
                <div className="text-white">{booking.customerName}</div>
              </div>
              <div>
                <span className="text-[#FFD700] font-medium">อีเมล:</span>
                <div className="text-white">{booking.customerEmail}</div>
              </div>
              <div>
                <span className="text-[#FFD700] font-medium">โทรศัพท์:</span>
                <div className="text-white">{booking.customerPhone}</div>
              </div>
              
              {booking.specialRequirements && (
                <div>
                  <span className="text-[#FFD700] font-medium">ความต้องการพิเศษ:</span>
                  <div className="text-white mt-1">{booking.specialRequirements}</div>
                </div>
              )}
              
              {booking.notes && (
                <div>
                  <span className="text-[#FFD700] font-medium">หมายเหตุ:</span>
                  <div className="text-white mt-1">{booking.notes}</div>
                </div>
              )}
            </div>

            {/* Booking Info */}
            <div className="mt-6 pt-6 border-t border-[#FFD700]/20">
              <h3 className="text-lg font-semibold text-[#FFD700] mb-4">ข้อมูลการจอง</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-[#FFD700] font-medium">วันที่จอง:</span>
                  <div className="text-white">{formatDate(booking.createdAt)}</div>
                </div>
                <div>
                  <span className="text-[#FFD700] font-medium">สถานะการชำระเงิน:</span>
                  <div className="text-white">{booking.paymentStatus}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/my-bookings">
            <button className="px-6 py-3 bg-gradient-to-r from-black/40 to-[#0a0804]/40 backdrop-blur-xl border border-[#FFD700]/20 text-[#cdc08e] rounded-xl hover:border-[#FFD700]/50 transition-all duration-200">
              กลับไปหน้าการจอง
            </button>
          </Link>
          
          {booking.status === 'PENDING' && (
            <button className="px-6 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-xl border border-red-500/30 text-red-400 rounded-xl hover:bg-gradient-to-r hover:from-red-500/30 hover:to-red-600/30 transition-all duration-200">
              ยกเลิกการจอง
            </button>
          )}
          
          <button className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/30 font-semibold transition-all duration-200">
            พิมพ์ใบจอง
          </button>
        </div>
      </div>
    </div>
  );
}

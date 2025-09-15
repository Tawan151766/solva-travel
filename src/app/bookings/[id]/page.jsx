'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext-simple';
import Link from 'next/link';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchBookingDetail();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token, params.id]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
      } else if (response.status === 404) {
        setError('ไม่พบการจองนี้');
      } else if (response.status === 403) {
        setError('คุณไม่มีสิทธิ์ดูการจองนี้');
      } else {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      }
    } catch (error) {
      console.error('Error fetching booking detail:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-orange-400';
      case 'PAID': return 'text-green-400';
      case 'PARTIAL': return 'text-yellow-400';
      case 'REFUNDED': return 'text-blue-400';
      case 'FAILED': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-4">เข้าสู่ระบบเพื่อดูการจอง</h2>
          <p className="text-white/70 mb-6">กรุณาเข้าสู่ระบบเพื่อดูรายละเอียดการจอง</p>
          <Link 
            href="/auth/login"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] transition-all"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">กำลังโหลดข้อมูลการจอง...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-red-400 mb-4">{error}</h2>
          <Link 
            href="/my-bookings"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] transition-all"
          >
            กลับไปหน้าการจอง
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">ไม่พบข้อมูลการจอง</h2>
          <Link 
            href="/my-bookings"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] transition-all"
          >
            กลับไปหน้าการจอง
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
            <Link href="/" className="text-[#FFD700]/60 hover:text-[#FFD700] transition-colors">
              หน้าหลัก
            </Link>
            <svg className="w-4 h-4 text-[#FFD700]/60" fill="currentColor" viewBox="0 0 256 256">
              <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
            </svg>
            <Link href="/my-bookings" className="text-[#FFD700]/60 hover:text-[#FFD700] transition-colors">
              การจองของฉัน
            </Link>
            <svg className="w-4 h-4 text-[#FFD700]/60" fill="currentColor" viewBox="0 0 256 256">
              <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
            </svg>
            <span className="text-white font-medium">รายละเอียดการจอง</span>
          </nav>
          
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-2">
              รายละเอียดการจอง
            </h1>
            <p className="text-white/70">
              หมายเลขการจอง: <span className="text-[#FFD700] font-mono font-semibold">#{booking.bookingNumber}</span>
            </p>
          </div>
        </div>

        {/* Booking Status */}
        <div className="mb-8 p-6 bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                {booking.status === 'PENDING' && 'รอดำเนินการ'}
                {booking.status === 'CONFIRMED' && 'ยืนยันแล้ว'}
                {booking.status === 'CANCELLED' && 'ยกเลิกแล้ว'}
                {booking.status === 'COMPLETED' && 'เสร็จสิ้น'}
              </span>
              <span className={`text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                {booking.paymentStatus === 'PENDING' && 'รอชำระเงิน'}
                {booking.paymentStatus === 'PAID' && 'ชำระแล้ว'}
                {booking.paymentStatus === 'PARTIAL' && 'ชำระบางส่วน'}
                {booking.paymentStatus === 'REFUNDED' && 'คืนเงินแล้ว'}
                {booking.paymentStatus === 'FAILED' && 'ชำระล้มเหลว'}
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#FFD700]">
                ฿{(parseFloat(booking.totalAmount) || 0).toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">
                ยอดรวมทั้งหมด
              </div>
            </div>
          </div>
        </div>

        {/* Tour Information */}
        <div className="mb-8 p-6 bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20">
          <h2 className="text-xl font-bold text-white mb-4">ข้อมูลทัวร์</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#FFD700] mb-2">
                {booking.bookingType === 'PACKAGE' ? booking.package?.name : `Custom Tour to ${booking.customTourRequest?.destination}`}
              </h3>
              
              {booking.bookingType === 'PACKAGE' && booking.package?.description && (
                <p className="text-white/70 mb-4">{booking.package.description}</p>
              )}
              
              {booking.bookingType === 'CUSTOM' && booking.customTourRequest?.description && (
                <p className="text-white/70 mb-4">{booking.customTourRequest.description}</p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-white/80">
                  <svg className="w-4 h-4 mr-2 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"/>
                  </svg>
                  <span>
                    จุดหมาย: {booking.bookingType === 'PACKAGE' ? booking.package?.location : booking.customTourRequest?.destination}
                  </span>
                </div>
                
                <div className="flex items-center text-white/80">
                  <svg className="w-4 h-4 mr-2 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"/>
                  </svg>
                  <span>
                    วันที่เดินทาง: {new Date(booking.startDate).toLocaleDateString('th-TH')} - {new Date(booking.endDate).toLocaleDateString('th-TH')}
                  </span>
                </div>
                
                <div className="flex items-center text-white/80">
                  <svg className="w-4 h-4 mr-2 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"/>
                  </svg>
                  <span>จำนวนผู้เดินทาง: {booking.numberOfPeople} คน</span>
                </div>

                {booking.bookingType === 'PACKAGE' && (
                  <div className="flex items-center text-white/80">
                    <svg className="w-4 h-4 mr-2 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M24,64a8,8,0,0,1,8-8H224a8,8,0,0,1,0,16H32A8,8,0,0,1,24,64Zm8,80H224a8,8,0,0,1,0,16H32a8,8,0,0,1,0-16Zm0,48H224a8,8,0,0,1,0,16H32a8,8,0,0,1,0-16Z"/>
                    </svg>
                    <span>ระยะเวลา: {booking.package?.durationDays || 'ไม่ระบุ'} วัน</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">ข้อมูลการจอง</h4>
              <div className="space-y-2 text-sm text-white/80">
                <div>วันที่จอง: {new Date(booking.createdAt).toLocaleDateString('th-TH')}</div>
                <div>วันที่อัปเดตล่าสุด: {new Date(booking.updatedAt).toLocaleDateString('th-TH')}</div>
                {booking.bookingType === 'PACKAGE' && (
                  <div>ราคาต่อคน: ฿{(parseFloat(booking.package?.price) || 0).toLocaleString()}</div>
                )}
                {booking.bookingType === 'CUSTOM' && (
                  <div>ราคาประมาณการ: ฿{(parseFloat(booking.customTourRequest?.estimatedCost) || 0).toLocaleString()}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8 p-6 bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20">
          <h2 className="text-xl font-bold text-white mb-4">ข้อมูลผู้จอง</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-white/60">ชื่อ-นามสกุล:</span>
                <span className="text-white ml-2">{booking.customerName}</span>
              </div>
              <div>
                <span className="text-white/60">อีเมล:</span>
                <span className="text-white ml-2">{booking.customerEmail}</span>
              </div>
              <div>
                <span className="text-white/60">เบอร์โทรศัพท์:</span>
                <span className="text-white ml-2">{booking.customerPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Special Requirements & Notes */}
        {(booking.specialRequirements || booking.notes) && (
          <div className="mb-8 p-6 bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20">
            <h2 className="text-xl font-bold text-white mb-4">ความต้องการพิเศษและหมายเหตุ</h2>
            
            {booking.specialRequirements && (
              <div className="mb-4">
                <h4 className="font-semibold text-[#FFD700] mb-2">ความต้องการพิเศษ:</h4>
                <p className="text-white/80 text-sm">{booking.specialRequirements}</p>
              </div>
            )}
            
            {booking.notes && (
              <div>
                <h4 className="font-semibold text-[#FFD700] mb-2">หมายเหตุเพิ่มเติม:</h4>
                <p className="text-white/80 text-sm">{booking.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/my-bookings"
            className="flex-1 bg-black/50 border border-[#FFD700]/30 text-[#FFD700] font-semibold py-3 px-6 rounded-xl hover:bg-[#FFD700]/10 transition-all text-center"
          >
            กลับไปหน้าการจอง
          </Link>
          
          {booking.status === 'PENDING' && (
            <button className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 font-semibold py-3 px-6 rounded-xl hover:bg-red-500/30 transition-all">
              ยกเลิกการจอง
            </button>
          )}
          
          {booking.status === 'CONFIRMED' && booking.paymentStatus === 'PENDING' && (
            <button className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold py-3 px-6 rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] transition-all">
              ชำระเงิน
            </button>
          )}
          
          <button className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 font-semibold py-3 px-6 rounded-xl hover:bg-blue-500/30 transition-all">
            ติดต่อเจ้าหน้าที่
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function MyBookingsPage() {
  const { user, token, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('An error occurred while fetching your bookings');
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
          <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">เข้าสู่ระบบเพื่อดูการจอง</h2>
          <p className="text-white/70 mb-6">กรุณาเข้าสู่ระบบเพื่อดูรายการการจองของคุณ</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
            <Link href="/" className="text-[#FFD700]/60 hover:text-[#FFD700] transition-colors">
              หน้าหลัก
            </Link>
            <svg className="w-4 h-4 text-[#FFD700]/60" fill="currentColor" viewBox="0 0 256 256">
              <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
            </svg>
            <span className="text-white font-medium">การจองของฉัน</span>
          </nav>
          
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-4">
              การจองของฉัน
            </h1>
            <p className="text-white/70 text-lg">
              ติดตามและจัดการการจองทัวร์ทั้งหมดของคุณ
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM32,64H224V88H32ZM32,192V104H224v88Z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">ยังไม่มีการจอง</h3>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              คุณยังไม่มีการจองใดๆ เริ่มต้นการผจญภัยของคุณเลย!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] transition-all"
              >
                ดูแพ็กเกจทัวร์
              </Link>
              <Link 
                href="/tour-request"
                className="inline-flex items-center px-6 py-3 bg-black/50 border border-[#FFD700]/30 text-[#FFD700] font-semibold rounded-xl hover:bg-[#FFD700]/10 transition-all"
              >
                สร้างทัวร์แบบกำหนดเอง
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div 
                key={booking.id}
                className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl shadow-black/50 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {booking.bookingType === 'PACKAGE' ? booking.package?.name : `Custom Tour to ${booking.customTourRequest?.destination}`}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-[#FFD700] font-mono font-semibold">
                        #{booking.bookingNumber}
                      </p>
                    </div>
                    <div className="text-right mt-4 lg:mt-0">
                      <div className="text-2xl font-bold text-[#FFD700]">
                        ฿{parseFloat(booking.totalAmount).toLocaleString()}
                      </div>
                      <div className={`text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus === 'PENDING' && 'รอชำระเงิน'}
                        {booking.paymentStatus === 'PAID' && 'ชำระแล้ว'}
                        {booking.paymentStatus === 'PARTIAL' && 'ชำระบางส่วน'}
                        {booking.paymentStatus === 'REFUNDED' && 'คืนเงินแล้ว'}
                        {booking.paymentStatus === 'FAILED' && 'ชำระล้มเหลว'}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center text-white/80">
                      <svg className="w-4 h-4 mr-2 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"/>
                      </svg>
                      <span className="text-sm">
                        {new Date(booking.startDate).toLocaleDateString('th-TH')} - {new Date(booking.endDate).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-white/80">
                      <svg className="w-4 h-4 mr-2 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"/>
                      </svg>
                      <span className="text-sm">
                        {booking.numberOfPeople} คน
                      </span>
                    </div>

                    <div className="flex items-center text-white/80">
                      <svg className="w-4 h-4 mr-2 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"/>
                      </svg>
                      <span className="text-sm">
                        {booking.bookingType === 'PACKAGE' ? booking.package?.location : booking.customTourRequest?.destination}
                      </span>
                    </div>

                    <div className="flex items-center text-white/80">
                      <svg className="w-4 h-4 mr-2 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V88a12,12,0,0,1,24,0v48h28A12,12,0,0,1,168,148Z"/>
                      </svg>
                      <span className="text-sm">
                        จองเมื่อ {new Date(booking.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {booking.bookingType === 'PACKAGE' && booking.package?.description && (
                    <p className="text-white/70 text-sm mb-4">
                      {booking.package.description}
                    </p>
                  )}

                  {booking.bookingType === 'CUSTOM' && booking.customTourRequest?.description && (
                    <p className="text-white/70 text-sm mb-4">
                      {booking.customTourRequest.description}
                    </p>
                  )}

                  {/* Special Requirements */}
                  {booking.specialRequirements && (
                    <div className="mb-4 p-3 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-lg">
                      <h4 className="text-[#FFD700] text-sm font-semibold mb-1">ความต้องการพิเศษ:</h4>
                      <p className="text-white/80 text-sm">{booking.specialRequirements}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-[#FFD700]/20">
                    <Link 
                      href={`/bookings/${booking.id}`}
                      className="flex-1 min-w-[120px] bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold py-2 px-4 rounded-lg hover:from-[#FFED4E] hover:to-[#FFD700] transition-all text-center"
                    >
                      ดูรายละเอียด
                    </Link>
                    
                    {booking.status === 'PENDING' && (
                      <button className="flex-1 min-w-[120px] bg-red-500/20 border border-red-500/30 text-red-400 font-semibold py-2 px-4 rounded-lg hover:bg-red-500/30 transition-all">
                        ยกเลิกการจอง
                      </button>
                    )}
                    
                    {booking.status === 'CONFIRMED' && booking.paymentStatus === 'PENDING' && (
                      <button className="flex-1 min-w-[120px] bg-green-500/20 border border-green-500/30 text-green-400 font-semibold py-2 px-4 rounded-lg hover:bg-green-500/30 transition-all">
                        ชำระเงิน
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

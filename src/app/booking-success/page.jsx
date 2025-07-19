'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function BookingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const bookingNumber = searchParams.get('bookingNumber');
  const bookingId = searchParams.get('bookingId');
  const type = searchParams.get('type'); // 'custom' for custom bookings

  useEffect(() => {
    if (bookingNumber || bookingId) {
      // You could fetch booking details here if needed
      // For now, we'll just show the booking number/ID
      setLoading(false);
    } else {
      // Redirect to home if no booking info
      router.push('/');
    }
  }, [bookingNumber, bookingId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-600 text-white px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {type === 'custom' ? 'ข้อเสนอถูกส่งแล้ว!' : 'Booking Confirmed!'}
            </h1>
            <p className="text-green-100">
              {type === 'custom' ? 'ขอบคุณที่เลือกใช้บริการ Solva Travel' : 'Thank you for choosing Solva Travel'}
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {type === 'custom' ? 'รหัสข้อเสนอของคุณ' : 'Your Booking Number'}
              </h2>
              <div className="bg-gray-100 rounded-lg py-4 px-6 inline-block">
                <span className="text-2xl font-mono font-bold text-blue-600">
                  {bookingNumber || bookingId || 'CB-PENDING'}
                </span>
              </div>
              <p className="text-gray-600 mt-2">
                {type === 'custom' 
                  ? 'กรุณาเก็บรหัสนี้ไว้เพื่อติดตามสถานะ' 
                  : 'Please save this booking number for your records'
                }
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {type === 'custom' ? 'ขั้นตอนต่อไป?' : 'What happens next?'}
              </h3>
              <div className="space-y-4">
                {type === 'custom' ? (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-blue-600">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">การตรวจสอบข้อเสนอ</h4>
                        <p className="text-gray-600 text-sm">ทีมงานจะตรวจสอบข้อเสนอของคุณและติดต่อกลับภายใน 24 ชั่วโมง</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-blue-600">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">ใบเสนอราคา</h4>
                        <p className="text-gray-600 text-sm">เราจะส่งใบเสนอราคาและรายละเอียดแพ็คเกจที่ปรับแต่งให้คุณ</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-blue-600">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">การยืนยันและชำระเงิน</h4>
                        <p className="text-gray-600 text-sm">เมื่อคุณพอใจกับข้อเสนอ เราจะดำเนินการจองและแจ้งวิธีชำระเงิน</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-blue-600">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Confirmation Email</h4>
                        <p className="text-gray-600 text-sm">You will receive a confirmation email with all booking details within the next few minutes.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-blue-600">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Staff Review</h4>
                        <p className="text-gray-600 text-sm">Our travel specialists will review your booking and contact you within 24 hours to confirm details.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-blue-600">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Payment Instructions</h4>
                        <p className="text-gray-600 text-sm">We will send you secure payment instructions and finalize your travel arrangements.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-800 mb-2">
                  If you have any questions about your booking, please don't hesitate to contact us:
                </p>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>📧 Email: bookings@solvatravel.com</p>
                  <p>📞 Phone: +66 2-123-4567</p>
                  <p>💬 Live Chat: Available 24/7 on our website</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link 
                href="/"
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors text-center"
              >
                Back to Home
              </Link>
              <Link 
                href="/contact"
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#cdc08e] text-lg">กำลังโหลด...</p>
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}

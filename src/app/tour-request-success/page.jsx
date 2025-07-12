'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function TourRequestSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const requestId = searchParams.get('requestId');

  useEffect(() => {
    if (requestId) {
      fetchRequestDetails();
    } else {
      setLoading(false);
    }
  }, [requestId]);

  const fetchRequestDetails = async () => {
    try {
      const response = await fetch(`/api/custom-tour-requests/${requestId}`);
      if (response.ok) {
        const data = await response.json();
        // API returns data.request or just data based on structure
        setRequest(data.request || data.data || data);
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFD700]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0804] via-[#1a1611] to-[#0a0804] py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/90 to-black/80 backdrop-blur-xl rounded-2xl border border-[#FFD700]/20 shadow-2xl shadow-black/50 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-6 py-8 text-center">
            <div className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">คำขอได้รับการส่งแล้ว!</h1>
            <p className="text-black/80">ขอบคุณที่เลือกใช้บริการ Solva Travel</p>
          </div>

          {/* Request Details */}
          <div className="p-6 space-y-6">
            {request && (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-2">หมายเลขติดตามของคุณ</h2>
                <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg py-4 px-6 inline-block">
                  <span className="text-2xl font-mono font-bold text-[#FFD700]">{request.trackingNumber}</span>
                </div>
                <p className="text-white/70 mt-2">
                  กรุณาเก็บหมายเลขนี้ไว้เพื่อติดตามสถานะ
                </p>
                <div className="mt-4">
                  <Link 
                    href="/track-request"
                    className="inline-flex items-center gap-2 bg-[#FFD700]/20 border border-[#FFD700]/40 text-[#FFD700] py-2 px-4 rounded-lg hover:bg-[#FFD700]/30 transition-colors text-sm mr-4"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    ติดตามสถานะคำขอ
                  </Link>
                  <Link 
                    href={`/booking?type=custom&customTourRequestId=${request.id}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black py-2 px-4 rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/30 transition-all duration-200 text-sm font-semibold"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M231.4,44.34s0,0,0,0l-58.25,191.94a15.88,15.88,0,0,1-27.4,5.54L116.35,213.9a4,4,0,0,0-5.65-.27L63.5,235.73a15.86,15.86,0,0,1-22.29-18.08L98.75,28.37a15.88,15.88,0,0,1,27.4-5.54l29.4,27.92a4,4,0,0,0,5.65.27L208.4,28.92A15.86,15.86,0,0,1,231.4,44.34Z"/>
                    </svg>
                    ดำเนินการจองทันที
                  </Link>
                </div>
              </div>
            )}

            {request && (
              <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#FFD700] mb-3">รายละเอียดคำขอ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                  <div>
                    <span className="text-white/60">ผู้ติดต่อ:</span>
                    <span className="text-white ml-2">{request.contactName}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-[#FFD700]/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">ขั้นตอนต่อไป</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#FFD700]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-semibold text-[#FFD700]">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">การรับคำขอ</h4>
                    <p className="text-white/70 text-sm">ทีมงานจะตรวจสอบคำขอของคุณและติดต่อกลับภายใน 2-4 ชั่วโมง</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#FFD700]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-semibold text-[#FFD700]">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">การวางแผน</h4>
                    <p className="text-white/70 text-sm">ทีมผู้เชี่ยวชาญจะร่วมออกแบบโปรแกรมทัวร์ที่เหมาะสมกับความต้องการของคุณ</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#FFD700]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-semibold text-[#FFD700]">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">การยืนยัน</h4>
                    <p className="text-white/70 text-sm">เมื่อคุณพึงพอใจกับโปรแกรม เราจะส่งใบเสนอราคาและเอกสารการจอง</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#FFD700]/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">ต้องการความช่วยเหลือ?</h3>
              <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-4">
                <p className="text-white mb-2">
                  หากมีคำถามเพิ่มเติม กรุณาติดต่อเรา:
                </p>
                <div className="space-y-1 text-sm text-white/80">
                  <p>📧 Email: custom@solvatravel.com</p>
                  <p>📞 Phone: +66 2-123-4567</p>
                  <p>💬 Line: @solvatravel</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link 
                href="/"
                className="flex-1 bg-black/50 border border-[#FFD700]/30 text-[#FFD700] py-3 px-4 rounded-lg hover:bg-[#FFD700]/10 transition-colors text-center"
              >
                กลับไปหน้าหลัก
              </Link>
              <Link 
                href="/tour-request"
                className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black py-3 px-4 rounded-lg hover:from-[#FFED4E] hover:to-[#FFD700] transition-all text-center font-semibold"
              >
                ส่งคำขออื่น
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, Users, MapPin, Phone, Mail, Copy, ExternalLink } from 'lucide-react';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const trackingId = searchParams.get('trackingId');
  const bookingNumber = searchParams.get('bookingNumber');

  useEffect(() => {
    if (trackingId) {
      fetchBookingDetails();
    } else {
      setError('No tracking ID provided');
      setLoading(false);
    }
  }, [trackingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/track/${trackingId}`);
      
      if (!response.ok) {
        // Handle different HTTP status codes
        if (response.status === 404) {
          throw new Error('Booking not found with this tracking ID');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Error ${response.status}: Unable to fetch booking details`);
        }
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch booking details');
      }

      setBookingData(result.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-bold mb-2">Error Loading Booking</h2>
          <p className="text-white/70 text-sm mb-6">{error}</p>
          <Link 
            href="/"
            className="inline-block bg-[#FFD700] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#FFED4E] transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-white/80 text-lg">
            Your travel booking has been successfully submitted
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-8 border border-[#FFD700]/20 shadow-2xl shadow-black/50 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Booking Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text mb-4">
                  Booking Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-black/30 p-4 rounded-lg">
                    <span className="text-white/80">Booking Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#FFD700] font-mono font-bold">
                        {bookingData?.bookingNumber}
                      </span>
                      <button
                        onClick={() => copyToClipboard(bookingData?.bookingNumber)}
                        className="text-[#FFD700] hover:text-[#FFED4E] transition-colors"
                        title="Copy booking number"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-black/30 p-4 rounded-lg">
                    <span className="text-white/80">Tracking ID:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#FFD700] font-mono font-bold">
                        {bookingData?.trackingId}
                      </span>
                      <button
                        onClick={() => copyToClipboard(bookingData?.trackingId)}
                        className="text-[#FFD700] hover:text-[#FFED4E] transition-colors"
                        title="Copy tracking ID"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {copied && (
                    <p className="text-green-400 text-sm text-center">
                      Copied to clipboard!
                    </p>
                  )}

                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white/80">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bookingData?.status === 'PENDING' 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : bookingData?.status === 'CONFIRMED'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {bookingData?.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/80">Payment:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bookingData?.paymentStatus === 'PENDING' 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : bookingData?.paymentStatus === 'PAID'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {bookingData?.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Customer Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#FFD700]" />
                    <span className="text-white">{bookingData?.customerName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#FFD700]" />
                    <span className="text-white">{bookingData?.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#FFD700]" />
                    <span className="text-white">{bookingData?.customerPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Trip Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Trip Details</h3>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h4 className="text-[#FFD700] font-semibold text-lg mb-2">
                      {bookingData?.packageName}
                    </h4>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="w-4 h-4" />
                      <span>{bookingData?.packageLocation}</span>
                    </div>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-[#FFD700]" />
                      <span className="text-white font-medium">Travel Dates</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-white/60">Start:</span>
                        <span className="text-white ml-2">
                          {formatDate(bookingData?.startDate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">End:</span>
                        <span className="text-white ml-2">
                          {formatDate(bookingData?.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">People:</span>
                        <span className="text-white ml-2">{bookingData?.numberOfPeople}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Per Person:</span>
                        <span className="text-[#FFD700] ml-2 font-semibold">
                          ${bookingData?.pricePerPerson}
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-white/10 mt-3 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">Total Amount:</span>
                        <span className="text-[#FFD700] text-xl font-bold">
                          ${bookingData?.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {bookingData?.assignedStaff && (
                    <div className="bg-black/30 p-4 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Assigned Staff</h4>
                      <div className="text-sm">
                        <div className="text-[#FFD700]">{bookingData.assignedStaff.name}</div>
                        <div className="text-white/80">{bookingData.assignedStaff.email}</div>
                        {bookingData.assignedStaff.phone && (
                          <div className="text-white/80">{bookingData.assignedStaff.phone}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          {bookingData?.specialRequirements && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Special Requirements</h3>
              <div className="bg-black/30 p-4 rounded-lg">
                <p className="text-white/80">{bookingData.specialRequirements}</p>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {bookingData?.notes && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Additional Notes</h3>
              <div className="bg-black/30 p-4 rounded-lg">
                <p className="text-white/80">{bookingData.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-8 border border-[#FFD700]/20 shadow-2xl shadow-black/50 mb-8">
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text mb-6">
            What's Next?
          </h2>
          <div className="space-y-4 text-white/80">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#FFD700] text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-white">Confirmation Email</p>
                <p className="text-sm">You'll receive a detailed confirmation email within 15 minutes.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#FFD700] text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-white">Staff Contact</p>
                <p className="text-sm">Our team will contact you within 24 hours to finalize details.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#FFD700] text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-white">Payment Instructions</p>
                <p className="text-sm">Payment details and instructions will be provided by our staff.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/my-bookings"
            className="bg-[#FFD700] text-black px-8 py-3 rounded-lg font-medium hover:bg-[#FFED4E] transition-colors text-center flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            View My Bookings
          </Link>
          <Link
            href="/packages"
            className="bg-transparent border-2 border-[#FFD700] text-[#FFD700] px-8 py-3 rounded-lg font-medium hover:bg-[#FFD700]/10 transition-colors text-center"
          >
            Browse More Packages
          </Link>
          <Link
            href="/"
            className="bg-transparent border-2 border-white/30 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors text-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading booking details...</p>
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}

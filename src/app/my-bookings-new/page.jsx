'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Users, DollarSign, Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/api/auth/signin');
      return;
    }

    fetchBookings();
  }, [session, status, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch bookings');
      }

      setBookings(result.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-bold mb-2">Error Loading Bookings</h2>
          <p className="text-white/70 text-sm mb-6">{error}</p>
          <button 
            onClick={fetchBookings}
            className="bg-[#FFD700] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#FFED4E] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text mb-4">
            My Bookings
          </h1>
          <p className="text-white/80 text-lg">
            Track and manage your travel bookings
          </p>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📋</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Bookings Found</h2>
            <p className="text-white/70 mb-8">You haven't made any bookings yet.</p>
            <Link
              href="/packages"
              className="inline-block bg-[#FFD700] text-black px-8 py-3 rounded-lg font-medium hover:bg-[#FFED4E] transition-colors"
            >
              Browse Packages
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-[#FFD700]/20 shadow-2xl shadow-black/50"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Booking Info */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-[#FFD700] mb-2">
                          {booking.packageName || booking.package?.name}
                        </h3>
                        <div className="flex items-center gap-2 text-white/80 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.packageLocation || booking.package?.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#FFD700] text-sm">
                          <span>#{booking.bookingNumber}</span>
                          <span>•</span>
                          <span>Tracking: {booking.trackingId}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="text-sm font-medium">{booking.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#FFD700]" />
                        <div>
                          <div className="text-white/60">Start Date</div>
                          <div className="text-white">{formatDate(booking.startDate)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#FFD700]" />
                        <div>
                          <div className="text-white/60">End Date</div>
                          <div className="text-white">{formatDate(booking.endDate)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-white/60 text-sm mb-1">Trip Details</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white">
                          <Users className="w-4 h-4 text-[#FFD700]" />
                          <span>{booking.numberOfPeople} people</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          <DollarSign className="w-4 h-4 text-[#FFD700]" />
                          <span>${booking.pricePerPerson}/person</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 p-3 rounded-lg">
                      <div className="text-white/60 text-sm">Total Amount</div>
                      <div className="text-[#FFD700] text-xl font-bold">
                        ${booking.totalAmount}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/booking-details/${booking.id}`}
                      className="flex items-center justify-center gap-2 bg-[#FFD700] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#FFED4E] transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                    
                    {booking.status === 'PENDING' && (
                      <button className="bg-transparent border border-red-500 text-red-400 px-4 py-2 rounded-lg font-medium hover:bg-red-500/10 transition-colors text-sm">
                        Cancel Booking
                      </button>
                    )}

                    <div className="text-center text-xs text-white/60 mt-2">
                      Created: {formatDate(booking.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Customer:</span>
                      <span className="text-white ml-2">{booking.customerName}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Email:</span>
                      <span className="text-white ml-2">{booking.customerEmail}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Phone:</span>
                      <span className="text-white ml-2">{booking.customerPhone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="text-center mt-12">
          <Link
            href="/packages"
            className="inline-block bg-transparent border-2 border-[#FFD700] text-[#FFD700] px-8 py-3 rounded-lg font-medium hover:bg-[#FFD700]/10 transition-colors mr-4"
          >
            Book Another Trip
          </Link>
          <Link
            href="/"
            className="inline-block bg-transparent border-2 border-white/30 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

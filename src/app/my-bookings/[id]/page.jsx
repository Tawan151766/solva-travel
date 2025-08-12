"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Phone,
  Mail,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  Download,
  MessageSquare,
  MapIcon,
  Camera,
  Star,
} from "lucide-react";

export default function BookingDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/api/auth/signin");
      return;
    }

    if (bookingId) {
      fetchBookingDetail();
    }
  }, [session, status, router, bookingId]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}`);
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setError("Booking not found");
        } else if (response.status === 403) {
          setError("You are not authorized to view this booking");
        } else {
          setError(result.error || "Failed to fetch booking details");
        }
        return;
      }

      setBooking(result.data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case "CANCELLED":
        return <XCircle className="w-6 h-6 text-red-400" />;
      case "PENDING":
        return <Clock className="w-6 h-6 text-yellow-400" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (status === "loading" || loading) {
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
          <h2 className="text-white text-xl font-bold mb-2">
            Error Loading Booking
          </h2>
          <p className="text-white/70 text-sm mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchBookingDetail}
              className="bg-[#FFD700] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#FFED4E] transition-colors w-full"
            >
              Try Again
            </button>
            <Link
              href="/my-bookings"
              className="block bg-transparent border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Back to My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Booking not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/my-bookings"
            className="inline-flex items-center gap-2 text-[#FFD700] hover:text-[#FFED4E] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to My Bookings
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text mb-2">
                Booking Details
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[#FFD700]">#{booking.bookingNumber}</span>
                <span className="text-white/60">•</span>
                <span className="text-white/80">
                  Tracking: {booking.trackingId}
                </span>
                <button
                  onClick={() => copyToClipboard(booking.trackingId)}
                  className="text-[#FFD700] hover:text-[#FFED4E] transition-colors"
                  title="Copy tracking ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-full border ${getStatusColor(
                booking.status
              )}`}
            >
              {getStatusIcon(booking.status)}
              <span className="font-medium">{booking.status}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Package & Trip Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Information */}
            <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
              <div className="flex items-start gap-4">
                {booking.package?.imageUrl && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={booking.package.imageUrl}
                      alt={booking.package.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#FFD700] mb-2">
                    {booking.packageName || booking.package?.name}
                  </h2>
                  <div className="flex items-center gap-2 text-white/80 mb-3">
                    <MapPin className="w-5 h-5 text-[#FFD700]" />
                    <span>
                      {booking.packageLocation || booking.package?.location}
                    </span>
                  </div>
                  {booking.package?.description && (
                    <p className="text-white/70 text-sm leading-relaxed">
                      {booking.package.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Trip Schedule */}
            <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
              <h3 className="text-xl font-bold text-[#FFD700] mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Trip Schedule
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/30 p-4 rounded-xl">
                  <div className="text-white/60 text-sm mb-1">Departure</div>
                  <div className="text-white text-lg font-medium">
                    {formatDate(booking.startDate)}
                  </div>
                  <div className="text-[#FFD700] text-sm">
                    {formatDateShort(booking.startDate)}
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-xl">
                  <div className="text-white/60 text-sm mb-1">Return</div>
                  <div className="text-white text-lg font-medium">
                    {formatDate(booking.endDate)}
                  </div>
                  <div className="text-[#FFD700] text-sm">
                    {formatDateShort(booking.endDate)}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
                <div className="text-center">
                  <div className="text-[#FFD700] text-2xl font-bold">
                    {calculateDuration(booking.startDate, booking.endDate)} Days
                  </div>
                  <div className="text-white/60 text-sm">Total Duration</div>
                </div>
              </div>
            </div>

            {/* Participants & Pricing */}
            <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
              <h3 className="text-xl font-bold text-[#FFD700] mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Pricing Details
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#FFD700]" />
                    <span className="text-white">Number of People</span>
                  </div>
                  <span className="text-[#FFD700] font-bold">
                    {booking.numberOfPeople}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                  <span className="text-white">Price per Person</span>
                  <span className="text-white font-medium">
                    ${booking.pricePerPerson}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 rounded-xl border border-[#FFD700]/30">
                  <span className="text-white font-bold">Total Amount</span>
                  <span className="text-[#FFD700] text-2xl font-bold">
                    ${booking.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Package Includes & Excludes */}
            {(booking.package?.includes || booking.package?.excludes) && (
              <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
                <h3 className="text-xl font-bold text-[#FFD700] mb-4">
                  Package Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {booking.package?.includes && (
                    <div>
                      <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Includes
                      </h4>
                      <ul className="space-y-2">
                        {booking.package.includes.map((item, index) => (
                          <li
                            key={index}
                            className="text-white/80 text-sm flex items-start gap-2"
                          >
                            <span className="text-green-400 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {booking.package?.excludes && (
                    <div>
                      <h4 className="text-red-400 font-medium mb-3 flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        Excludes
                      </h4>
                      <ul className="space-y-2">
                        {booking.package.excludes.map((item, index) => (
                          <li
                            key={index}
                            className="text-white/80 text-sm flex items-start gap-2"
                          >
                            <span className="text-red-400 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Customer Info & Actions */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
              <h3 className="text-xl font-bold text-[#FFD700] mb-4 flex items-center gap-2">
                <User className="w-6 h-6" />
                Customer Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
                  <User className="w-5 h-5 text-[#FFD700]" />
                  <div>
                    <div className="text-white/60 text-xs">Full Name</div>
                    <div className="text-white">{booking.customerName}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
                  <Mail className="w-5 h-5 text-[#FFD700]" />
                  <div>
                    <div className="text-white/60 text-xs">Email</div>
                    <div className="text-white">{booking.customerEmail}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
                  <Phone className="w-5 h-5 text-[#FFD700]" />
                  <div>
                    <div className="text-white/60 text-xs">Phone</div>
                    <div className="text-white">{booking.customerPhone}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
              <h3 className="text-xl font-bold text-[#FFD700] mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Booking Timeline
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <div>
                    <div className="text-white text-sm">Booking Created</div>
                    <div className="text-white/60 text-xs">
                      {formatDateShort(booking.createdAt)}
                    </div>
                  </div>
                </div>

                {booking.updatedAt !== booking.createdAt && (
                  <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div>
                      <div className="text-white text-sm">Last Updated</div>
                      <div className="text-white/60 text-xs">
                        {formatDateShort(booking.updatedAt)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Staff (if any) */}
            {booking.assignedStaff && (
              <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
                <h3 className="text-xl font-bold text-[#FFD700] mb-4">
                  Assigned Guide
                </h3>

                <div className="space-y-3">
                  <div className="text-white font-medium">
                    {booking.assignedStaff.name}
                  </div>
                  <div className="text-white/70 text-sm">
                    {booking.assignedStaff.email}
                  </div>
                  {booking.assignedStaff.phone && (
                    <div className="text-white/70 text-sm">
                      {booking.assignedStaff.phone}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/my-bookings"
              className="bg-[#FFD700] text-black px-8 py-3 rounded-lg font-medium hover:bg-[#FFED4E] transition-colors"
            >
              Back to My Bookings
            </Link>
            <Link
              href="/packages"
              className="bg-transparent border-2 border-[#FFD700] text-[#FFD700] px-8 py-3 rounded-lg font-medium hover:bg-[#FFD700]/10 transition-colors"
            >
              Book Another Trip
            </Link>
            <Link
              href="/"
              className="bg-transparent border-2 border-white/30 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

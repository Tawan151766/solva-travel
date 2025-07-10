"use client";

import Link from "next/link";
import { useStaffContext } from "@/core/context";
import { StarRating } from "@/components/ui/StarRating";

function StaffCard({ staff }) {
  return (
    <Link href={`/staff/${staff.id}`}>
      <div className="bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 mt-3 rounded-xl p-4 sm:p-6 hover:bg-gradient-to-r hover:from-black/80 hover:to-[#0a0804]/80 hover:border-[#FFD700]/40 transition-all cursor-pointer group shadow-lg shadow-black/50">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Profile Image */}
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-20 h-20 sm:w-24 sm:h-24 mx-auto sm:mx-0 flex-shrink-0 border-2 border-[#FFD700]/30 group-hover:border-[#FFD700] transition-all shadow-lg shadow-[#FFD700]/20"
            style={{
              backgroundImage: `url("${staff.image}")`,
            }}
          />

          {/* Staff Info */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white text-lg sm:text-xl font-bold leading-tight mb-1 group-hover:text-[#FFD700] transition-colors">
              {staff.name}
            </h3>
            <p className="text-[#FFD700]/80 text-sm sm:text-base font-normal mb-3">
              {staff.title}
            </p>

            {/* Rating */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
              <StarRating rating={Math.floor(staff.rating)} size="16" />
              <span className="text-white text-sm font-semibold">
                {staff.rating}
              </span>
              <span className="text-[#FFD700]/60 text-sm">
                ({staff.totalReviews} reviews)
              </span>
            </div>

            {/* Bio */}
            {staff.bio && (
              <p className="text-white/80 text-sm leading-relaxed mb-3 line-clamp-2">
                {staff.bio}
              </p>
            )}

            {/* Specialties */}
            {staff.specialties && staff.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {staff.specialties.slice(0, 3).map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 border border-[#FFD700]/30 text-[#FFD700] px-2 py-1 rounded-full text-xs backdrop-blur-sm"
                  >
                    {specialty}
                  </span>
                ))}
                {staff.specialties.length > 3 && (
                  <span className="text-[#FFD700]/60 text-xs px-2 py-1">
                    +{staff.specialties.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Arrow Icon */}
          <div className="flex items-center justify-center sm:justify-end">
            <svg
              className="w-5 h-5 text-[#FFD700]/60 group-hover:text-[#FFD700] transition-colors"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function StaffPage() {
  const { allStaffData } = useStaffContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black px-2 sm:px-4 lg:px-8 py-4 sm:py-6 relative">
      {/* Luxury Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5 opacity-50"></div>
      
      <div className="max-w-4xl mx-auto relative">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-sm mb-4 sm:mb-6"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="text-[#FFD700]/80 hover:text-[#FFD700] transition-colors"
          >
            Home
          </Link>
          <svg
            className="w-4 h-4 text-[#FFD700]/60"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
          </svg>
          <span className="text-[#FFD700] font-medium">Our Team</span>
        </nav>

        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3 sm:mb-4">
            Meet the Solva Travel Team
          </h1>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-3xl">
            Our talented team of professionals is dedicated to creating extraordinary travel experiences. Each member brings unique skills and passion to help you discover the world's most amazing destinations.
          </p>
        </div>

        {/* Staff Grid */}
        <div className="space-y-6">
          {allStaffData.map((staff) => (
            <StaffCard key={staff.id} staff={staff} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl p-6 sm:p-8 shadow-2xl shadow-black/50 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 via-transparent to-[#FFD700]/5 rounded-xl"></div>
          <div className="relative">
            <h2 className="text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-xl sm:text-2xl font-bold mb-3">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/80 text-base mb-6">
              Contact our Solva Travel experts and let us help you create unforgettable memories. We're here to make your travel dreams come true.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-[#FFD700] to-[#FFED4E] hover:from-[#FFED4E] hover:to-[#FFD700] text-black px-6 sm:px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-[#FFD700]/30 hover:shadow-[#FFD700]/50 transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { StarRating } from "@/components/ui/StarRating";

export function StaffProfile({ staff }) {
  if (!staff) return null;

  return (
    <div className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-xl p-4 sm:p-6 lg:sticky lg:top-24 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
      <div className="flex flex-col items-center text-center">
        {/* Profile Image */}
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-24 h-24 sm:w-32 sm:h-32 mb-4 ring-4 ring-[#FFD700]/30 shadow-lg shadow-[#FFD700]/20"
          style={{
            backgroundImage: `url("${staff.image}")`
          }}
        />
        
        {/* Name and Title */}
        <div className="mb-4">
          <h2 className="text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-lg sm:text-xl lg:text-2xl font-bold leading-tight tracking-[-0.015em] mb-1">
            {staff.name}
          </h2>
          <p className="text-white/80 text-sm sm:text-base font-normal leading-normal">
            {staff.title}
          </p>
        </div>

        {/* Rating */}
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-2xl sm:text-3xl font-black leading-tight tracking-[-0.033em]">
              {staff.rating}
            </span>
            <StarRating rating={Math.floor(staff.rating)} size="20" />
          </div>
          <p className="text-white/80 text-sm">
            {staff.totalReviews} reviews
          </p>
        </div>

        {/* Bio */}
        {staff.bio && (
          <div className="mb-4">
            <p className="text-white/90 text-sm leading-relaxed">
              {staff.bio}
            </p>
          </div>
        )}

        {/* Specialties */}
        {staff.specialties && staff.specialties.length > 0 && (
          <div className="w-full">
            <h3 className="text-[#FFD700] text-sm font-semibold mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {staff.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-md text-[#FFD700] border border-[#FFD700]/30 px-2 py-1 rounded-full text-xs shadow-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

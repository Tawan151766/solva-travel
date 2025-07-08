"use client";

import { StarRating } from "@/components/ui/StarRating";

export function StaffProfile({ staff }) {
  if (!staff) return null;

  return (
    <div className="bg-[#1e1c15] rounded-xl p-4 sm:p-6 lg:sticky lg:top-24">
      <div className="flex flex-col items-center text-center">
        {/* Profile Image */}
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-24 h-24 sm:w-32 sm:h-32 mb-4"
          style={{
            backgroundImage: `url("${staff.image}")`
          }}
        />
        
        {/* Name and Title */}
        <div className="mb-4">
          <h2 className="text-white text-lg sm:text-xl lg:text-2xl font-bold leading-tight tracking-[-0.015em] mb-1">
            {staff.name}
          </h2>
          <p className="text-[#bcb69f] text-sm sm:text-base font-normal leading-normal">
            {staff.title}
          </p>
        </div>

        {/* Rating */}
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white text-2xl sm:text-3xl font-black leading-tight tracking-[-0.033em]">
              {staff.rating}
            </span>
            <StarRating rating={Math.floor(staff.rating)} size="20" />
          </div>
          <p className="text-[#bcb69f] text-sm">
            {staff.totalReviews} reviews
          </p>
        </div>

        {/* Bio */}
        {staff.bio && (
          <div className="mb-4">
            <p className="text-white text-sm leading-relaxed">
              {staff.bio}
            </p>
          </div>
        )}

        {/* Specialties */}
        {staff.specialties && staff.specialties.length > 0 && (
          <div className="w-full">
            <h3 className="text-white text-sm font-semibold mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {staff.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="bg-[#4a4221] text-white px-2 py-1 rounded-full text-xs"
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

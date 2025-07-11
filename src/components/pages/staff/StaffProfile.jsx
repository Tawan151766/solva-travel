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
            backgroundImage: `url("${staff.profileImage || staff.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'}")`
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
          {staff.department && (
            <p className="text-[#FFD700]/60 text-xs sm:text-sm mt-1">
              {staff.department} Department
            </p>
          )}
        </div>

        {/* Rating */}
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-2xl sm:text-3xl font-black leading-tight tracking-[-0.033em]">
              {staff.rating || 0}
            </span>
            <StarRating rating={Math.floor(staff.rating || 0)} size="20" />
          </div>
          <p className="text-white/80 text-sm">
            {staff.totalReviews || 0} reviews
          </p>
        </div>

        {/* Contact Info */}
        {(staff.email || staff.phone) && (
          <div className="w-full mb-4 p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-[#FFD700]/10">
            <h3 className="text-[#FFD700] text-sm font-semibold mb-2">Contact</h3>
            {staff.email && (
              <p className="text-white/70 text-xs mb-1">
                📧 {staff.email}
              </p>
            )}
            {staff.phone && (
              <p className="text-white/70 text-xs">
                📞 {staff.phone}
              </p>
            )}
          </div>
        )}

        {/* Bio */}
        {staff.bio && (
          <div className="mb-4 w-full">
            <h3 className="text-[#FFD700] text-sm font-semibold mb-2">About</h3>
            <p className="text-white/90 text-sm leading-relaxed text-left">
              {staff.bio}
            </p>
          </div>
        )}

        {/* Experience */}
        {staff.experience && (
          <div className="w-full mb-4">
            <h3 className="text-[#FFD700] text-sm font-semibold mb-2">Experience</h3>
            <p className="text-white/80 text-sm">
              {staff.experience}
            </p>
          </div>
        )}

        {/* Languages */}
        {staff.languages && staff.languages.length > 0 && (
          <div className="w-full mb-4">
            <h3 className="text-[#FFD700] text-sm font-semibold mb-2">Languages</h3>
            <div className="flex flex-wrap gap-1">
              {staff.languages.map((language, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFED4E]/10 backdrop-blur-sm text-[#FFD700] border border-[#FFD700]/20 px-2 py-1 rounded text-xs"
                >
                  {language}
                </span>
              ))}
            </div>
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

        {/* Member Since */}
        {staff.createdAt && (
          <div className="w-full mt-4 pt-4 border-t border-[#FFD700]/10">
            <p className="text-white/50 text-xs text-center">
              Team Member Since {new Date(staff.createdAt).getFullYear()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

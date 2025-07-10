"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function StaffBreadcrumb({ staffName }) {
  const router = useRouter();

  return (
    <nav className="flex items-center gap-2 text-sm mb-4 sm:mb-6" aria-label="Breadcrumb">
      <Link 
        href="/"
        className="text-[#FFD700] hover:text-[#FFED4E] transition-colors"
      >
        Home
      </Link>
      <svg className="w-4 h-4 text-[#FFD700]/50" fill="currentColor" viewBox="0 0 256 256">
        <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
      </svg>
      <Link 
        href="/staff"
        className="text-[#FFD700] hover:text-[#FFED4E] transition-colors"
      >
        Our Staff
      </Link>
      <svg className="w-4 h-4 text-[#FFD700]/50" fill="currentColor" viewBox="0 0 256 256">
        <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
      </svg>
      <span className="text-white font-medium truncate">
        {staffName}
      </span>
    </nav>
  );
}

export function StaffNavigation({ currentStaffId, allStaff }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const currentIndex = allStaff.findIndex(staff => staff.id === currentStaffId);
  const prevStaff = currentIndex > 0 ? allStaff[currentIndex - 1] : null;
  const nextStaff = currentIndex < allStaff.length - 1 ? allStaff[currentIndex + 1] : null;

  const handleStaffChange = (staffId) => {
    router.push(`/staff/${staffId}`);
    setShowDropdown(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Navigation Arrows */}
      <div className="flex items-center gap-2">
        {prevStaff ? (
          <Link
            href={`/staff/${prevStaff.id}`}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700] px-3 py-2 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
              <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2 bg-[#FFD700]/10 text-[#FFD700]/30 px-3 py-2 rounded-lg cursor-not-allowed border border-[#FFD700]/10">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
              <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </div>
        )}

        {nextStaff ? (
          <Link
            href={`/staff/${nextStaff.id}`}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700] px-3 py-2 rounded-lg transition-all duration-200"
          >
            <span className="hidden sm:inline">Next</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
              <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
            </svg>
          </Link>
        ) : (
          <div className="flex items-center gap-2 bg-[#FFD700]/10 text-[#FFD700]/30 px-3 py-2 rounded-lg cursor-not-allowed border border-[#FFD700]/10">
            <span className="hidden sm:inline">Next</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
              <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
            </svg>
          </div>
        )}
      </div>

      {/* Staff Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700] px-4 py-2 rounded-lg transition-all duration-200 min-w-[200px] justify-between"
        >
          <span className="truncate">
            {allStaff.find(staff => staff.id === currentStaffId)?.name || 'Select Staff'}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
            fill="currentColor" 
            viewBox="0 0 256 256"
          >
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-gradient-to-br from-black/90 via-[#0a0804]/90 to-black/90 backdrop-blur-xl rounded-lg shadow-2xl shadow-black/50 z-20 border border-[#FFD700]/20 max-h-64 overflow-y-auto">
            {allStaff.map((staff) => (
              <button
                key={staff.id}
                onClick={() => handleStaffChange(staff.id)}
                className={`w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-[#FFD700]/20 hover:to-[#FFED4E]/20 transition-all duration-200 first:rounded-t-lg last:rounded-b-lg ${
                  staff.id === currentStaffId ? 'bg-gradient-to-r from-[#FFD700]/30 to-[#FFED4E]/30 text-[#FFD700]' : 'text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0 ring-2 ring-[#FFD700]/30"
                    style={{ backgroundImage: `url("${staff.image}")` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{staff.name}</div>
                    <div className="text-xs text-white/70 truncate">{staff.title}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <svg className="w-3 h-3 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z" />
                    </svg>
                    <span className="text-[#FFD700]">{staff.rating}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

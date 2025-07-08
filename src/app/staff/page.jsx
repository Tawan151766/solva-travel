"use client";

import Link from "next/link";
import { useStaffContext } from "@/core/context";
import { StarRating } from "@/components/ui/StarRating";

export const metadata = {
  title: "Our Travel Staff - Solva Travel",
  description:
    "Meet our experienced travel experts and adventure guides. View reviews and ratings for our professional staff members.",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
};

function StaffCard({ staff }) {
  return (
    <Link href={`/staff/${staff.id}`}>
      <div className="bg-[#1e1c15] mt-3 rounded-xl p-4 sm:p-6 hover:bg-[#252116] transition-colors cursor-pointer group">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Profile Image */}
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-20 h-20 sm:w-24 sm:h-24 mx-auto sm:mx-0 flex-shrink-0"
            style={{
              backgroundImage: `url("${staff.image}")`,
            }}
          />

          {/* Staff Info */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white text-lg sm:text-xl font-bold leading-tight mb-1 group-hover:text-[#d4af37] transition-colors">
              {staff.name}
            </h3>
            <p className="text-[#bcb69f] text-sm sm:text-base font-normal mb-3">
              {staff.title}
            </p>

            {/* Rating */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
              <StarRating rating={Math.floor(staff.rating)} size="16" />
              <span className="text-white text-sm font-semibold">
                {staff.rating}
              </span>
              <span className="text-[#bcb69f] text-sm">
                ({staff.totalReviews} reviews)
              </span>
            </div>

            {/* Bio */}
            {staff.bio && (
              <p className="text-white text-sm leading-relaxed mb-3 line-clamp-2">
                {staff.bio}
              </p>
            )}

            {/* Specialties */}
            {staff.specialties && staff.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {staff.specialties.slice(0, 3).map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-[#4a4221] text-white px-2 py-1 rounded-full text-xs"
                  >
                    {specialty}
                  </span>
                ))}
                {staff.specialties.length > 3 && (
                  <span className="text-[#bcb69f] text-xs px-2 py-1">
                    +{staff.specialties.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Arrow Icon */}
          <div className="flex items-center justify-center sm:justify-end">
            <svg
              className="w-5 h-5 text-[#bcb69f] group-hover:text-[#d4af37] transition-colors"
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
  const { staffData } = useStaffContext();

  return (
    <div className="min-h-screen bg-[#231f10] px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-sm mb-4 sm:mb-6"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="text-[#bcb69f] hover:text-white transition-colors"
          >
            Home
          </Link>
          <svg
            className="w-4 h-4 text-[#bcb69f]"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
          </svg>
          <span className="text-white font-medium">Our Team</span>
        </nav>

        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3 sm:mb-4">
            Meet the Zelo App Team
          </h1>
          <p className="text-[#bcb69f] text-base sm:text-lg leading-relaxed max-w-3xl">
            Our talented team of professionals is dedicated to building seamless
            digital experiences with Zelo App. Each member brings unique skills
            and passion to help you achieve more.
          </p>
        </div>

        {/* Staff Grid */}
        <div className="space-y-6">
          {staffData.map((staff) => (
            <StaffCard key={staff.id} staff={staff} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-[#1e1c15] rounded-xl p-6 sm:p-8">
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-3">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-[#bcb69f] text-base mb-6">
            Contact our Zelo App experts directly via{" "}
            <a
              href="https://zalo.me/1234567890" // ใส่ลิงก์ Zalo จริงของคุณที่นี่
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d4af37] underline hover:text-[#c49e2a]"
            >
              Zalo
            </a>{" "}
            and we’ll help you get started and make the most of our platform.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#d4af37] hover:bg-[#c49e2a] text-[#231f10] px-6 sm:px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

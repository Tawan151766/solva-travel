"use client";

import { useState, useEffect } from "react";

export function AboutUsServices() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const services = [
    {
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      title: "Logistics",
      subtitle: "จองรถและแพ็คเกจทัวร์",
      description: "การเดินทางระดับทุกระดับด้วยรถยนต์ส่วนตัวพร้อมบริการ",
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm6 16H8a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h2v1a1 1 0 0 0 2 0V9h2v12a1 1 0 0 1-1 1z" />
        </svg>
      ),
      title: "ทัวร์สัมผัสประสบการณ์ สำรวจวัฒนธรรม",
      subtitle: "สำรวจวัฒนธรรมและอาหารท้องถิ่นทั่วภูมิภาค",
      description:
        "ท่องเที่ยวแบบสุดประทับใจ พร้อมไกด์ส่วนตัวและการเข้าถึงสถานที่พิเศษ",
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      ),
      title: "สนามเด็กเล่น",
      subtitle: "ค่าเข้าใช้และโปรโมโมชันพิเศษ",
      description:
        "เข้าถึงสนามเด็กเล่นระดับพรีเมียม พร้อมสิทธิพิเศษและโปรโมชัน",
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      title: "ไกด์ท่องเที่ยวมืออาชีพ",
      subtitle: "ไกด์ท่องเที่ยวและแนะนำสถานที่",
      description:
        "ไกด์ท่องเที่ยวมืออาชีพที่มีความรู้ลึกซึ้งเกี่ยวกับวัฒนธรรมและประวัติศาสตร์",
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      ),
      title: "Cosmetic and health Packages",
      subtitle: "แพ็กเกจสุขภาพและความงาม",
      description: " การดูแลสุขภาพและความงาม พร้อมบริการสุดประทับใจ",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0804] to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>

        {/* Floating Particles */}
        {mounted &&
          [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#FFD700] rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          {/* Premium Badge */}

          {/* Main Title */}
          <h2 className="relative mb-8">
            <span className="block text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-[#FFD700] via-[#FFED4E] to-[#FFD700] bg-clip-text text-transparent leading-none mb-4">
              บริการสุดพิเศษ
            </span>
            <span className="block text-2xl md:text-3xl font-light text-[#cdc08e] tracking-[0.1em] uppercase">
              Ultra-Premium Experience
            </span>
          </h2>

          {/* Premium Divider */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent w-32"></div>
            <div className="mx-4 w-3 h-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full shadow-lg shadow-[#FFD700]/50"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent w-32"></div>
          </div>

          <p className="text-xl md:text-2xl text-[#cdc08e] max-w-4xl mx-auto leading-relaxed font-light">
            สัมผัสบริการระดับพรีเมียมที่ออกแบบมาเฉพาะสำหรับผู้ที่ต้องการความเป็นเลิศ
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Premium Card Background */}
              <div className="relative h-full backdrop-blur-xl bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 rounded-3xl p-8 border border-[#FFD700]/20 transition-all duration-700 hover:border-[#FFD700]/60 hover:shadow-2xl hover:shadow-[#FFD700]/20 transform hover:scale-105 hover:-translate-y-2">
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFED4E]/5 opacity-0 transition-opacity duration-700 ${
                    hoveredIndex === index ? "opacity-100" : ""
                  }`}
                ></div>

                {/* Service Icon */}
                <div className="relative mb-8">
                  <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-[#FFD700] via-[#FFED4E] to-[#B8860B] rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-[#FFD700]/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                    <div className="text-black transform group-hover:scale-110 transition-transform duration-700">
                      {service.icon}
                    </div>
                  </div>

                  {/* Glow Behind Icon */}
                  <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FFED4E] rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-700"></div>
                </div>

                {/* Service Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-500">
                    {service.title}
                  </h3>

                  <h4 className="text-lg text-[#cdc08e] mb-4 font-light">
                    {service.subtitle}
                  </h4>

                  <p className="text-[#B8860B] leading-relaxed mb-6 text-base">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <div className="mt-8 pt-6 border-t border-[#FFD700]/20">
                    <button className="group/btn w-full bg-gradient-to-r from-[#FFD700]/10 to-[#FFED4E]/10 border border-[#FFD700]/30 text-[#FFD700] font-semibold py-3 px-6 rounded-xl transition-all duration-500 hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFED4E] hover:text-black hover:border-[#FFD700] hover:shadow-lg hover:shadow-[#FFD700]/30">
                      <span className="text-sm tracking-wide">
                        เรียนรู้เพิ่มเติม
                      </span>
                    </button>
                  </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-gradient-to-br from-[#FFD700] to-[#FFED4E] rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-5px) rotate(2deg);
          }
          66% {
            transform: translateY(2px) rotate(-1deg);
          }
        }
      `}</style>
    </section>
  );
}

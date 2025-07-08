"use client";

import { useEffect, useState } from "react";

export function AboutUsHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0804] to-[#1a1408] opacity-95"></div>
        <div className="absolute inset-0 bg-[url('/robin-noguier-sydwCr54rf0-unsplash.jpg')] bg-cover bg-center opacity-25"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-radial from-[#FFD700]/5 via-transparent to-black/80"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Gold Orbs */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-gradient-to-r from-[#FFD700] to-[#B8860B] rounded-full opacity-40 animate-pulse shadow-2xl shadow-[#FFD700]/50"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-gradient-to-r from-[#e3b602] to-[#FFD700] rounded-full opacity-30 animate-ping shadow-2xl shadow-[#e3b602]/40"></div>
        <div className="absolute bottom-32 left-40 w-5 h-5 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full opacity-50 animate-pulse shadow-2xl shadow-[#FFD700]/60"></div>
        <div className="absolute top-60 right-20 w-3 h-3 bg-gradient-to-r from-[#cdc08e] to-[#FFD700] rounded-full opacity-60 animate-ping shadow-xl shadow-[#cdc08e]/50"></div>

        {/* Floating Particles */}
        {mounted &&
          [...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-gradient-to-r from-[#FFD700] to-[#e3b602] rounded-full opacity-30 animate-float shadow-lg shadow-[#FFD700]/30`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Typography */}
        <div className="mb-12">
          {/* Brand Title */}
          <h1 className="relative">
            {/* Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFED4E] to-[#FFD700] bg-clip-text text-transparent blur-sm opacity-50"></div>

            {/* Main Title */}
            <span className="relative block text-7xl md:text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-[#FFD700] via-[#FFED4E] via-[#FFD700] to-[#B8860B] bg-clip-text text-transparent leading-none mb-6 tracking-tight">
              BK 18 PLUS
            </span>
          </h1>

          {/* Subtitle */}
          <div className="relative">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-transparent bg-gradient-to-r from-[#cdc08e] via-[#F5F5DC] to-[#cdc08e] bg-clip-text tracking-[0.15em] uppercase mb-4">
              Eazy Travel
            </h2>
            <div className="text-2xl md:text-3xl font-thin text-[#B8860B] tracking-[0.2em] uppercase">
              Experience
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700] to-[#FFED4E] w-32 opacity-60"></div>
          <div className="mx-6 relative">
            <div className="w-4 h-4 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full shadow-lg shadow-[#FFD700]/50"></div>
            <div className="absolute inset-0 w-4 h-4 bg-[#FFD700] rounded-full animate-ping opacity-30"></div>
          </div>
          <div className="h-px bg-gradient-to-r from-[#FFED4E] via-[#FFD700] to-transparent w-32 opacity-60"></div>
        </div>

        {/* Description */}
        <p className="text-2xl md:text-3xl lg:text-4xl text-transparent bg-gradient-to-r from-[#cdc08e] via-[#F5F5DC] to-[#cdc08e] bg-clip-text max-w-5xl mx-auto leading-relaxed mb-16 font-light tracking-wide">
          เดินทางสู่มิติใหม่แห่งความหรูหรา
          <br />
          <span className="text-xl md:text-2xl lg:text-3xl text-[#B8860B] font-thin">
            ที่ผสานความสมบูรณ์แบบของการบริการระดับเวิลด์คลาส
          </span>
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {[
            { number: "10+", label: "ปีแห่งความเป็นเลิศ", delay: "0s" },
            { number: "5K+", label: "ลูกค้าระดับเอลิต", delay: "0.2s" },
            { number: "500+", label: "เส้นทางสุดพิเศษ", delay: "0.4s" },
            { number: "50+", label: "พันธมิตรหรูหรา", delay: "0.6s" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-105"
              style={{ animationDelay: stat.delay }}
            >
              <div className="relative mb-4">
                {/* Number Glow */}
                <div className="absolute inset-0 text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-b from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent blur-sm opacity-30"></div>

                {/* Main Number */}
                <div className="relative text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-b from-[#FFD700] via-[#FFED4E] to-[#B8860B] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500">
                  {stat.number}
                </div>

                {/* Underline */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full group-hover:w-16 transition-all duration-500"></div>
              </div>

              <div className="text-[#cdc08e] text-sm md:text-base uppercase tracking-[0.15em] font-light group-hover:text-[#FFD700] transition-colors duration-500">
                {stat.label}
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
            transform: translateY(-10px) rotate(120deg);
          }
          66% {
            transform: translateY(5px) rotate(240deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";

export function AboutUsStory() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const milestones = [
    {
      year: "2016",
      title: "การก่อตั้งบริษัท",
      description:
        "เริ่มต้นด้วยวิสัยทัศน์ในการสร้างประสบการณ์การท่องเที่ยวระดับพรีเมียม",
    },
    {
      year: "2018",
      title: "ขยายสู่ตลาดสากล",
      description: "เปิดบริการทัวร์หรูหราไปยังออสเตรเลียและนิวซีแลนด์",
    },
    {
      year: "2020",
      title: "นวัตกรรมดิจิทัล",
      description: "พัฒนาแพลตฟอร์มการจองออนไลน์และบริการแบบ Virtual Concierge",
    },
    {
      year: "2024",
      title: "ผู้นำด้าน Luxury Travel",
      description:
        "ได้รับการยอมรับเป็นหนึ่งในผู้นำด้านการท่องเที่ยวหรูหราในภูมิภาค",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0804] to-[#1a1408]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>

        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-[#FFD700] rotate-45"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 border border-[#FFED4E] rotate-12"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-[#B8860B] -rotate-12"></div>
        </div>

        {/* Floating Particles */}
        {mounted &&
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-[#FFD700] rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-[#FFD700] via-[#FFED4E] to-[#FFD700] bg-clip-text text-transparent leading-none mb-8">
            เรื่องราวของเรา
          </h2>

          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent w-32"></div>
            <div className="mx-4 w-3 h-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full shadow-lg shadow-[#FFD700]/50"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent w-32"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Story Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="space-y-8">
              <div className="relative">
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-6">
                  Journey to Excellence
                </h3>

                <div className="space-y-6 text-lg md:text-xl text-[#cdc08e] leading-relaxed">
                  <p>
                    <span className="text-[#FFD700] font-semibold">
                      BANGKOK 18 PLUS
                    </span>{" "}
                    คือบริษัทนำเที่ยวมืออาชีพที่ให้บริการท่องเที่ยวหลากหลายในประเทศไทยและออสเตรเลีย
                    ด้วยพันธกิจในการมอบ
                    <span className="text-[#FFED4E]">
                      {" "}
                      ประสบการณ์ที่ไม่เหมือนใครและน่าจดจำ
                    </span>
                    ให้กับนักท่องเที่ยวทุกคน
                  </p>

                  <p>
                    เรามุ่งมั่นที่จะพาทุกคนไปสำรวจ
                    <span className="text-[#FFED4E]">
                      {" "}
                      จุดหมายปลายทางที่โดดเด่น
                    </span>
                    ไม่ว่าจะเป็นธรรมชาติอันงดงามหรือวัฒนธรรมที่เป็นเอกลักษณ์
                    พร้อมด้วยทีมงานมืออาชีพที่มีความเชี่ยวชาญในการดูแลตลอดการเดินทาง
                  </p>

                  <p>
                    เราภูมิใจในทีมมัคคุเทศก์ บริการคุณภาพ และให้ความสำคัญกับ
                    <span className="text-[#FFD700] font-semibold">
                      {" "}
                      ความพึงพอใจของลูกค้า
                    </span>{" "}
                    มาเป็นอันดับแรกเสมอ
                    เพื่อให้ทุกการเดินทางเต็มไปด้วยความประทับใจ
                  </p>
                </div>

                {/* Premium Quote */}
                <div className="mt-8 relative">
                  <div className="absolute left-0 top-0 text-6xl text-[#FFD700]/20 font-serif">
                    "
                  </div>
                  <blockquote className="pl-12 text-xl md:text-2xl font-light text-[#FFED4E] italic leading-relaxed">
                    เราเชื่อว่าทุกการเดินทางคือการค้นพบใหม่
                    ที่จะเติมเต็มความทรงจำและสร้างแรงบันดาลใจ
                  </blockquote>
                  <div className="text-right mt-4">
                    <span className="text-[#FFD700] font-semibold">
                      BANGKOK 18 PLUS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";

export function Contact() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const contactMethods = [
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      ),
      title: "เบอร์โทร",
      subtitle: "สำนักงานไทย",
      contact: "0933-986-888",
      description: "ติดต่อสอบถามข้อมูลเพิ่มเติม",
      action: "tel:+66933986888",
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
      title: "Email",
      subtitle: "สำนักงานออสเตรเลีย",
      contact: "info@ausintertravel.com",
      description: "ติดต่อสอบถามข้อมูลเพิ่มเติม",
      action: "mailto:info@ausintertravel.com",
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
      title: "Email",
      subtitle: "สำนักงานไทย",
      contact: "info@bk18plustravel.com",
      description: "ติดต่อสอบถามข้อมูลเพิ่มเติม",
      action: "mailto:info@bk18plustravel.com",
    },
  ];

  const offices = [
    {
      country: "Thailand",
      city: "Bangkok",
      address:
        "55/146 Golden Neo 2 King Kaew soi 31/1, 55/146 ถ. กิ่งแก้ว ตำบล บางพลีใหญ่ อำเภอบางพลี สมุทรปราการ 10540",
      phone: "0933-986-888",
    },
    {
      country: "Australia",
      city: "รัฐวิกตอเรีย",
      address: "Sunshine, รัฐวิกตอเรีย 3020 ออสเตรเลีย",
      phone: "0933-986-888",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
      <section className="relative py-32">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0804] to-black"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-[#FFD700] via-[#FFED4E] to-[#FFD700] bg-clip-text text-transparent leading-none mb-8">
              ติดต่อเรา
            </h1>

            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent w-32"></div>
              <div className="mx-4 w-3 h-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent w-32"></div>
            </div>

            <p className="text-xl md:text-2xl text-[#cdc08e] max-w-4xl mx-auto leading-relaxed font-light">
              เรายินดีให้บริการปรึกษาและวางแผนการเดินทางระดับพรีเมียมสำหรับคุณ
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative h-full backdrop-blur-xl bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 rounded-3xl p-8 border border-[#FFD700]/20 transition-all duration-500 hover:border-[#FFD700]/60 hover:shadow-2xl hover:shadow-[#FFD700]/20">
                  {/* Contact Icon */}
                  <div className="relative mb-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#FFD700] via-[#FFED4E] to-[#B8860B] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#FFD700]/30">
                      <div className="text-black">
                        {method.icon}
                      </div>
                    </div>
                  </div>

                  {/* Contact Content */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-2">
                      {method.title}
                    </h3>

                    <h4 className="text-sm text-[#B8860B] mb-4 font-light uppercase tracking-wider">
                      {method.subtitle}
                    </h4>

                    <a
                      href={method.action}
                      className="block text-lg text-[#FFD700] hover:text-[#FFED4E] transition-colors duration-300 mb-3 font-semibold break-all"
                    >
                      {method.contact}
                    </a>

                    <p className="text-[#cdc08e] text-sm leading-relaxed mb-6">
                      {method.description}
                    </p>

                    {/* CTA */}
                    <a
                      href={method.action}
                      className="inline-block w-full bg-gradient-to-r from-[#FFD700]/10 to-[#FFED4E]/10 border border-[#FFD700]/30 text-[#FFD700] font-semibold py-3 px-6 rounded-xl transition-all duration-500 hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFED4E] hover:text-black hover:border-[#FFD700] hover:shadow-lg hover:shadow-[#FFD700]/30 text-sm"
                    >
                      เชื่อมต่อทันที
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Office Locations */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-4">
                สำนักงานของเรา
              </h3>
              <p className="text-xl text-[#cdc08e] font-light">
                พบเราได้ที่ทั้งสองประเทศ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {offices.map((office, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-gradient-to-br from-black/60 via-[#0a0804]/60 to-black/60 rounded-3xl p-8 border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFED4E] rounded-2xl flex items-center justify-center mr-4">
                      <svg
                        className="w-8 h-8 text-black"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-[#FFD700]">
                        {office.country}
                      </h4>
                      <p className="text-[#FFED4E] font-light">{office.city}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-[#cdc08e]">
                    <p className="flex items-start">
                      <svg
                        className="w-5 h-5 mr-3 mt-1 text-[#FFD700] flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      <span>{office.address}</span>
                    </p>

                    <p className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3 text-[#FFD700]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                      <a
                        href={`tel:${office.phone.replace(/\s/g, "")}`}
                        className="hover:text-[#FFD700] transition-colors"
                      >
                        {office.phone}
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

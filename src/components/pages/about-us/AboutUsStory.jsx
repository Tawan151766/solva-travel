"use client";

export function AboutUsStory() {
  return (
    <section className="relative py-32">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0804] to-black"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[#FFD700] via-[#FFED4E] to-[#FFD700] bg-clip-text text-transparent leading-none mb-8">
            เรื่องราวของเรา
          </h2>

          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent w-32"></div>
            <div className="mx-4 w-3 h-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent w-32"></div>
          </div>
        </div>

        {/* Story Content */}
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-br from-black/60 via-[#0a0804]/60 to-black/60 rounded-3xl p-8 md:p-12 border border-[#FFD700]/20">
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-6 text-center">
              Journey to Excellence
            </h3>

            <div className="space-y-6 text-base md:text-lg text-[#cdc08e] leading-relaxed">
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

            {/* Quote */}
            <div className="mt-8 pt-8 border-t border-[#FFD700]/20">
              <blockquote className="text-lg md:text-xl font-light text-[#FFED4E] italic leading-relaxed text-center">
                "เราเชื่อว่าทุกการเดินทางคือการค้นพบใหม่
                ที่จะเติมเต็มความทรงจำและสร้างแรงบันดาลใจ"
              </blockquote>
              <div className="text-center mt-4">
                <span className="text-[#FFD700] font-semibold">
                  — BANGKOK 18 PLUS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

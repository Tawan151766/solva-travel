"use client";

export function AboutUsHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0804] to-black"></div>
        <div className="absolute inset-0 bg-[url('/robin-noguier-sydwCr54rf0-unsplash.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Typography */}
        <div className="mb-12">
          {/* Brand Title */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-[#FFD700] via-[#FFED4E] to-[#FFD700] bg-clip-text text-transparent leading-none mb-6 tracking-tight">
            BK 18 PLUS
          </h1>

          {/* Subtitle */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-transparent bg-gradient-to-r from-[#cdc08e] via-[#F5F5DC] to-[#cdc08e] bg-clip-text tracking-[0.1em] uppercase mb-4">
              Eazy Travel
            </h2>
            <div className="text-xl md:text-2xl font-thin text-[#B8860B] tracking-[0.15em] uppercase">
              Experience
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent w-32"></div>
          <div className="mx-6 w-3 h-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full"></div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent w-32"></div>
        </div>

        {/* Description */}
        <p className="text-xl md:text-2xl lg:text-3xl text-transparent bg-gradient-to-r from-[#cdc08e] via-[#F5F5DC] to-[#cdc08e] bg-clip-text max-w-5xl mx-auto leading-relaxed mb-16 font-light">
          เดินทางสู่มิติใหม่แห่งความหรูหรา
          <br />
          <span className="text-lg md:text-xl lg:text-2xl text-[#B8860B] font-thin">
            ที่ผสานความสมบูรณ์แบบของการบริการระดับเวิลด์คลาส
          </span>
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {[
            { number: "10+", label: "ปีแห่งความเป็นเลิศ" },
            { number: "5K+", label: "ลูกค้าระดับเอลิต" },
            { number: "500+", label: "เส้นทางสุดพิเศษ" },
            { number: "50+", label: "พันธมิตรหรูหรา" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-4">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-b from-[#FFD700] via-[#FFED4E] to-[#B8860B] bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="w-8 h-1 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full mx-auto mt-2"></div>
              </div>
              <div className="text-[#cdc08e] text-sm md:text-base uppercase tracking-[0.1em] font-light">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

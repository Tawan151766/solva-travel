export function TimelineSection() {
  return (
    <div className="mt-20">
      <div className="text-center mb-16">
        <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-4">
          เส้นทางสู่ความเป็นเลิศ
        </h3>
        <p className="text-xl text-[#cdc08e] font-light">
          จุดสำคัญในการเติบโตของเรา
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#FFD700] via-[#FFED4E] to-[#FFD700] opacity-30"></div>

        <div className="space-y-16">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className={`relative flex items-center ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-6 h-6 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full shadow-lg shadow-[#FFD700]/50 border-4 border-black"></div>
              </div>

              {/* Content */}
              <div
                className={`w-5/12 ${
                  index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                }`}
              >
                <div className="backdrop-blur-xl bg-gradient-to-br from-black/60 via-[#0a0804]/60 to-black/60 rounded-2xl p-6 border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500 transform hover:scale-105">
                  <div className="text-3xl font-bold text-[#FFD700] mb-2">
                    {milestone.year}
                  </div>
                  <h4 className="text-xl font-semibold text-[#FFED4E] mb-3">
                    {milestone.title}
                  </h4>
                  <p className="text-[#cdc08e] leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

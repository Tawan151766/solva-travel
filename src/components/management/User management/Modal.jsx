"use client";

export default function Modal({ open, onClose, title, subtitle, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="relative bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl rounded-3xl border border-[#FFD700]/20 shadow-2xl shadow-black/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 bg-gradient-to-br from-[#FFD700]/20 to-[#FFED4E]/20 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 border border-[#FFD700]/30"
          >
            <svg className="w-4 h-4 text-[#FFD700]" fill="currentColor" viewBox="0 0 256 256">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
            </svg>
          </button>
          <div className="relative p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-2">
                {title}
              </h2>
              {subtitle ? <p className="text-white/70 text-sm">{subtitle}</p> : null}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea(
  { className = "", ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={`flex min-h-[120px] w-full rounded-lg border border-[#FFD700]/30 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-white/50 transition-colors backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700]/70 focus:border-[#FFD700]/80 disabled:cursor-not-allowed disabled:opacity-50 resize-y ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
export { Textarea };
export default Textarea;

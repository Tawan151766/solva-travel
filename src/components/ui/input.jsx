import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { className = "", type = "text", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={`flex h-11 w-full rounded-lg border border-[#FFD700]/30 bg-black/60 px-4 py-2 text-sm text-white placeholder:text-white/50 transition-colors backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700]/70 focus:border-[#FFD700]/80 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";
export { Input };
export default Input;

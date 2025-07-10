"use client";

import React from "react";

export default function ButtonSolva({
  label = "Click",
  onClick,
  iconRight = true,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-medium px-4 py-2 hover:from-[#FFED4E] hover:to-[#FFD700] shadow-lg shadow-[#FFD700]/30 hover:shadow-[#FFD700]/50 transition-all transform hover:scale-105 ${className}`}
    >
      {label}
    </button>
  );
}

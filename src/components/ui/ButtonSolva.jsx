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
      className={`rounded-lg bg-[#efc004] text-[#231f10] font-medium px-4 hover:bg-[#ddb900] transition ${className}`}
    >
      {label}
    </button>
  );
}

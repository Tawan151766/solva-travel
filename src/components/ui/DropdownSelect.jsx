import React, { useState } from "react";

export default function DropdownSelect({ label = "Select", options = [], value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel =
    options.find((opt) => (opt.value ?? opt) === value)?.label ?? label;

  const handleSelect = (option) => {
    setIsOpen(false);
    onChange?.(option.value ?? option);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="flex h-8 items-center gap-x-2 rounded-lg bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 pl-4 pr-2 text-[#FFD700] text-sm font-medium leading-normal hover:bg-gradient-to-r hover:from-[#FFD700]/30 hover:to-[#FFED4E]/30 hover:border-[#FFD700] transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedLabel}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="text-[#FFD700]"
        >
          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-2 w-40 rounded-md bg-gradient-to-b from-black/95 to-[#0a0804]/95 backdrop-blur-xl border border-[#FFD700]/30 shadow-2xl shadow-black/50">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 text-sm text-white hover:bg-[#FFD700]/10 hover:text-[#FFD700] cursor-pointer first:rounded-t-md last:rounded-b-md transition-all"
              onClick={() => handleSelect(option)}
            >
              {option.label ?? option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
        className="flex h-8 items-center gap-x-2 rounded-lg bg-[#4a4221] pl-4 pr-2 text-white text-sm font-medium leading-normal"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedLabel}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="text-white"
        >
          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-2 w-40 rounded-md bg-white shadow-lg border border-gray-300">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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

"use client";

import { createContext, useContext, useState } from "react";

const SelectContext = createContext();

export function Select({ value, onValueChange, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider value={{ 
      isOpen, 
      setIsOpen, 
      selectedValue, 
      handleValueChange 
    }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className = "" }) {
  const { isOpen, setIsOpen } = useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={`
        flex h-10 w-full items-center justify-between rounded-md border border-gray-300 
        bg-white px-3 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
    >
      {children}
      <svg
        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder = "Select..." }) {
  const { selectedValue } = useContext(SelectContext);
  
  return (
    <span className={selectedValue ? "text-gray-900" : "text-gray-400"}>
      {selectedValue || placeholder}
    </span>
  );
}

export function SelectContent({ children, className = "" }) {
  const { isOpen, setIsOpen } = useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-10"
        onClick={() => setIsOpen(false)}
      />
      <div className={`
        absolute top-full left-0 right-0 z-20 mt-1 
        bg-white border border-gray-300 rounded-md shadow-lg
        max-h-60 overflow-y-auto
        ${className}
      `}>
        {children}
      </div>
    </>
  );
}

export function SelectItem({ value, children, className = "" }) {
  const { handleValueChange, selectedValue } = useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <div
      onClick={() => handleValueChange(value)}
      className={`
        px-3 py-2 text-sm cursor-pointer
        ${isSelected ? 'bg-blue-100 text-blue-900' : 'text-gray-900 hover:bg-gray-100'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

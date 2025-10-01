"use client";

import {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const SelectContext = createContext(null);

const getLabelFromChildren = (children) => {
  if (typeof children === "string") return children;

  const arrayChildren = Children.toArray(children);
  const text = arrayChildren
    .map((child) => {
      if (typeof child === "string") return child;
      if (typeof child?.props?.children === "string") return child.props.children;
      return "";
    })
    .join(" ")
    .trim();

  return text || undefined;
};

export function Select({ value, onValueChange, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const contextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      selectedValue,
      setSelectedValue,
      selectedLabel,
      setSelectedLabel,
      onValueChange,
    }),
    [isOpen, onValueChange, selectedLabel, selectedValue]
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

const triggerBaseClasses = `
  flex h-11 w-full items-center justify-between rounded-lg border px-4 py-2 text-sm
  transition-colors backdrop-blur-xl
  border-[#FFD700]/30 bg-black/60 text-white
  focus:outline-none focus:ring-2 focus:ring-[#FFD700]/70 focus:border-[#FFD700]/80
  disabled:cursor-not-allowed disabled:opacity-50
`;

export function SelectTrigger({ children, className = "" }) {
  const { isOpen, setIsOpen } = useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={`${triggerBaseClasses} ${className}`}
    >
      <span className="flex-1 text-left">{children}</span>
      <svg
        className={`ml-2 h-4 w-4 text-[#FFD700] transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder = "Select...", className = "" }) {
  const { selectedValue, selectedLabel } = useContext(SelectContext);
  const display = selectedLabel || selectedValue;

  return (
    <span
      className={`${display ? "text-white" : "text-white/50"} ${className}`}
    >
      {display || placeholder}
    </span>
  );
}

const contentBaseClasses = `
  absolute top-full left-0 right-0 z-20 mt-2 rounded-lg border border-[#FFD700]/30
  bg-black/95 text-white shadow-xl backdrop-blur-xl
  max-h-60 overflow-y-auto
`;

export function SelectContent({ children, className = "" }) {
  const { isOpen, setIsOpen } = useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      <div className={`${contentBaseClasses} ${className}`}>{children}</div>
    </>
  );
}

export function SelectItem({ value, children, className = "" }) {
  const {
    setSelectedValue,
    setSelectedLabel,
    selectedValue,
    onValueChange,
    setIsOpen,
  } = useContext(SelectContext);

  const label = useMemo(
    () => getLabelFromChildren(children) || value,
    [children, value]
  );
  const isSelected = selectedValue === value;

  useEffect(() => {
    if (isSelected) setSelectedLabel(label);
  }, [isSelected, label, setSelectedLabel]);

  const handleSelect = () => {
    setSelectedValue(value);
    setSelectedLabel(label);
    onValueChange?.(value);
    setIsOpen(false);
  };

  return (
    <div
      onClick={handleSelect}
      className={`px-4 py-2 text-sm cursor-pointer transition-colors
        hover:bg-[#FFD700]/10 hover:text-[#FFD700]
        ${isSelected ? "bg-[#FFD700]/15 text-[#FFD700]" : "text-white/90"}
        ${className}`}
      role="option"
      aria-selected={isSelected}
    >
      {children}
    </div>
  );
}

export default { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };

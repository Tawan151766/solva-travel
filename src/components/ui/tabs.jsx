"use client";

import { createContext, useContext, useState } from "react";

const TabsContext = createContext();

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className = "",
}) {
  const [selectedTab, setSelectedTab] = useState(defaultValue || value);

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider
      value={{ selectedTab, setSelectedTab: handleTabChange }}
    >
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }) {
  return (
    <div
      className={`flex space-x-1 border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl p-1 shadow-inner ${className}`}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = "" }) {
  const { selectedTab, setSelectedTab } = useContext(TabsContext);
  const isActive = selectedTab === value;

  return (
    <button
      type="button"
      onClick={() => setSelectedTab(value)}
      aria-selected={isActive}
      className={`inline-flex items-center gap-2 text-sm font-semibold py-2 px-4 transition-all duration-200 focus:outline-none
        ${
          isActive
            ? "bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black shadow-md rounded-lg hover:shadow-[#FFD700]/30"
            : "border border-[#FFD700]/20 text-white/80 hover:text-white bg-black/50 backdrop-blur-xl rounded-lg"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = "" }) {
  const { selectedTab } = useContext(TabsContext);

  if (selectedTab !== value) {
    return null;
  }

  return <div className={`mt-4 text-white ${className}`}>{children}</div>;
}

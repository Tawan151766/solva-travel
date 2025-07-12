"use client";

import { createContext, useContext, useState } from "react";

const TabsContext = createContext();

export function Tabs({ defaultValue, value, onValueChange, children, className = "" }) {
  const [selectedTab, setSelectedTab] = useState(defaultValue || value);

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab: handleTabChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }) {
  return (
    <div className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = "" }) {
  const { selectedTab, setSelectedTab } = useContext(TabsContext);
  const isActive = selectedTab === value;

  return (
    <button
      onClick={() => setSelectedTab(value)}
      className={`
        flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all
        ${isActive 
          ? "bg-white text-gray-900 shadow-sm" 
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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

  return (
    <div className={`mt-4 ${className}`}>
      {children}
    </div>
  );
}

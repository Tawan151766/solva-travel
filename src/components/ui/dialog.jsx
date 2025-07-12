"use client";

import { createContext, useContext, useState, useEffect } from "react";

const DialogContext = createContext();

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => onOpenChange?.(false)}
          />
          {/* Dialog content will be rendered here */}
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, onClick }) {
  const { onOpenChange } = useContext(DialogContext);
  
  const handleClick = () => {
    onOpenChange?.(true);
    onClick?.();
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
}

export function DialogContent({ children, className = "" }) {
  const { open, onOpenChange } = useContext(DialogContext);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onOpenChange?.(false);
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div className={`
        relative z-50 w-full max-w-lg bg-white rounded-lg shadow-lg
        max-h-[90vh] overflow-y-auto
        ${className}
      `}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = "" }) {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
}

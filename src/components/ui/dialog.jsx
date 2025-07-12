"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";

const DialogContext = createContext();

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, asChild = false }) {
  const { onOpenChange } = useContext(DialogContext);
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenChange?.(true);
  };

  if (asChild && children) {
    // Clone the child element and add onClick
    return React.cloneElement(children, { 
      onClick: handleClick,
      style: { cursor: 'pointer', ...children.props.style }
    });
  }

  return (
    <div onClick={handleClick} className="cursor-pointer inline-block">
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

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      {/* Content */}
      <div className={`
        relative z-50 w-full max-w-lg bg-white rounded-lg shadow-xl
        max-h-[90vh] overflow-y-auto
        transform transition-all duration-200 ease-out
        ${className}
      `}>
        {children}
      </div>
    </div>
  );

  // Use portal to render outside component tree
  return typeof window !== 'undefined' ? 
    createPortal(modalContent, document.body) : 
    null;
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

export function DialogDescription({ children, className = "" }) {
  return (
    <p className={`text-sm text-gray-600 ${className}`}>
      {children}
    </p>
  );
}

export function DialogFooter({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 flex justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
}

export function DialogClose({ children, className = "" }) {
  const { onOpenChange } = useContext(DialogContext);
  
  return (
    <button
      onClick={() => onOpenChange?.(false)}
      className={`px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors ${className}`}
    >
      {children || "ปิด"}
    </button>
  );
}

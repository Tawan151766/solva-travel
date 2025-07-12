"use client";

import { forwardRef } from "react";

export const Label = forwardRef(({ className = "", htmlFor, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={`
        text-sm font-medium text-gray-700
        peer-disabled:cursor-not-allowed peer-disabled:opacity-70
        ${className}
      `}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = "Label";

"use client";

import { forwardRef } from "react";

export const Table = forwardRef(({ className = "", ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={`w-full caption-bottom text-sm ${className}`}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

export const TableHeader = forwardRef(({ className = "", ...props }, ref) => (
  <thead
    ref={ref}
    className={`[&_tr]:border-b ${className}`}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef(({ className = "", ...props }, ref) => (
  <tbody
    ref={ref}
    className={`[&_tr:last-child]:border-0 ${className}`}
    {...props}
  />
));
TableBody.displayName = "TableBody";

export const TableFooter = forwardRef(({ className = "", ...props }, ref) => (
  <tfoot
    ref={ref}
    className={`border-t bg-gray-50/50 font-medium [&>tr]:last:border-b-0 ${className}`}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export const TableRow = forwardRef(({ className = "", ...props }, ref) => (
  <tr
    ref={ref}
    className={`
      border-b transition-colors hover:bg-gray-50/50 
      data-[state=selected]:bg-gray-50 
      ${className}
    `}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = forwardRef(({ className = "", ...props }, ref) => (
  <th
    ref={ref}
    className={`
      h-12 px-4 text-left align-middle font-medium text-gray-600 
      [&:has([role=checkbox])]:pr-0
      ${className}
    `}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = forwardRef(({ className = "", ...props }, ref) => (
  <td
    ref={ref}
    className={`
      p-4 align-middle [&:has([role=checkbox])]:pr-0
      ${className}
    `}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export const TableCaption = forwardRef(({ className = "", ...props }, ref) => (
  <caption
    ref={ref}
    className={`mt-4 text-sm text-gray-600 ${className}`}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

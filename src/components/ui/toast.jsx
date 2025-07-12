"use client";

import { useToast } from "@/hooks/use-toast";
import { X, CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

const toastVariants = {
  default: "bg-white border-gray-200",
  destructive: "bg-red-50 border-red-200 text-red-900",
  success: "bg-green-50 border-green-200 text-green-900",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
};

const toastIcons = {
  default: Info,
  destructive: XCircle,
  success: CheckCircle,
  warning: AlertCircle,
};

function Toast({ toast, onDismiss }) {
  const Icon = toastIcons[toast.variant] || toastIcons.default;
  
  return (
    <div className={`
      relative flex w-full items-center space-x-2 overflow-hidden rounded-md border p-4 pr-8 shadow-lg
      transition-all duration-300 ease-in-out
      ${toastVariants[toast.variant] || toastVariants.default}
    `}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <div className="flex-1 space-y-1">
        {toast.title && (
          <div className="text-sm font-semibold">{toast.title}</div>
        )}
        {toast.description && (
          <div className="text-sm opacity-90">{toast.description}</div>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse space-y-2 space-y-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col sm:space-y-2 md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={dismiss}
        />
      ))}
    </div>
  );
}

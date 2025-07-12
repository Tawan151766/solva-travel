"use client";

import { useState, useCallback, useEffect } from "react";

// Toast state management
let toastCount = 0;
let toastSubscribers = new Set();

function notifySubscribers(toasts) {
  toastSubscribers.forEach(callback => callback(toasts));
}

const toastState = {
  toasts: []
};

export function useToast() {
  const [toasts, setToasts] = useState(toastState.toasts);

  // Subscribe to toast updates
  useEffect(() => {
    const callback = (newToasts) => setToasts([...newToasts]);
    toastSubscribers.add(callback);
    
    return () => {
      toastSubscribers.delete(callback);
    };
  }, []);

  const toast = useCallback(({ title, description, variant = "default", duration = 5000 }) => {
    const id = (++toastCount).toString();
    
    const newToast = {
      id,
      title,
      description,
      variant,
      duration
    };

    toastState.toasts.push(newToast);
    notifySubscribers(toastState.toasts);

    // Auto dismiss after duration
    setTimeout(() => {
      dismiss(id);
    }, duration);

    return {
      id,
      dismiss: () => dismiss(id),
      update: (props) => {
        const index = toastState.toasts.findIndex(t => t.id === id);
        if (index > -1) {
          toastState.toasts[index] = { ...toastState.toasts[index], ...props };
          notifySubscribers(toastState.toasts);
        }
      }
    };
  }, []);

  const dismiss = useCallback((toastId) => {
    toastState.toasts = toastState.toasts.filter(t => t.id !== toastId);
    notifySubscribers(toastState.toasts);
  }, []);

  return {
    toast,
    dismiss,
    toasts
  };
}

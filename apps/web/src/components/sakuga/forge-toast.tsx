'use client';

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { SakugaToastElement } from '@/types/sakuga';

interface ToastOptions {
  duration?: number;
  description?: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info', options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export const useForgeToast = () => useContext(ToastContext);

// Global event bus for imperative toast calls outside of React component trees
type ToastListener = (message: string, type: string, options?: ToastOptions) => void;
const listeners = new Set<ToastListener>();

export const forgeToast = {
  success: (message: string, descriptionOrOptions?: string | ToastOptions) => {
    const opts = typeof descriptionOrOptions === 'string' ? { description: descriptionOrOptions } : descriptionOrOptions;
    listeners.forEach((l) => l(message, 'success', opts));
  },
  error: (message: string, descriptionOrOptions?: string | ToastOptions) => {
    const opts = typeof descriptionOrOptions === 'string' ? { description: descriptionOrOptions } : descriptionOrOptions;
    listeners.forEach((l) => l(message, 'error', opts));
  },
  warning: (message: string, descriptionOrOptions?: string | ToastOptions) => {
    const opts = typeof descriptionOrOptions === 'string' ? { description: descriptionOrOptions } : descriptionOrOptions;
    listeners.forEach((l) => l(message, 'warning', opts));
  },
  info: (message: string, descriptionOrOptions?: string | ToastOptions) => {
    const opts = typeof descriptionOrOptions === 'string' ? { description: descriptionOrOptions } : descriptionOrOptions;
    listeners.forEach((l) => l(message, 'info', opts));
  },
  loading: (message: string, descriptionOrOptions?: string | ToastOptions) => {
    const opts = typeof descriptionOrOptions === 'string' ? { description: descriptionOrOptions } : descriptionOrOptions;
    listeners.forEach((l) => l(message, 'info', opts));
  },
};

export const ForgeToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toastRef = useRef<SakugaToastElement | null>(null);
  const [ariaLiveMessage, setAriaLiveMessage] = useState('');

  useEffect(() => {
    const handleToast = (message: string, type: string, options?: ToastOptions) => {
      const prefix = {
        success: '✨ ',
        error: '⚠️ ',
        warning: '⚡ ',
        info: 'ℹ️ ',
      }[type] || '';

      const fullMessage = `${prefix}${message}${options?.description ? ` — ${options.description}` : ''}`;

      // 1. Trigger Sakuga VFX Toast custom element (smear streak + dust cloud + slide sound)
      if (toastRef.current?.show) {
        toastRef.current.show(fullMessage, { duration: options?.duration || 3500 });
      }

      // 2. Announce to screen readers
      setAriaLiveMessage(fullMessage);
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  return (
    <ToastContext.Provider
      value={{
        showToast: (msg, type = 'info', opts) => {
          forgeToast[type](msg, opts);
        },
      }}
    >
      {children}

      {/* Sakuga VFX Toast container - fixed at bottom right with high z-index and pointer-events auto */}
      <div
        className="fixed bottom-6 right-6 z-[9999] pointer-events-auto"
        style={{ isolation: 'isolate' }}
      >
        <sakuga-toast ref={toastRef} class="block" />
      </div>

      {/* Screen reader live region */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {ariaLiveMessage}
      </div>
    </ToastContext.Provider>
  );
};

'use client';

import React from 'react';
import { Toaster, toast } from 'sonner';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';

export const ForgeToaster: React.FC = () => {
  return (
    <Toaster
      position="bottom-right"
      theme="dark"
      toastOptions={{
        style: {
          background: '#12121a',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: '#f0eee9',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          padding: '14px 18px'
        },
        className: 'font-sans text-sm'
      }}
    />
  );
};

export const forgeToast = {
  success: (message: string, description?: string) => {
    toast(message, {
      description,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      style: {
        borderLeft: '4px solid #10b981'
      }
    });
  },
  error: (message: string, description?: string) => {
    toast(message, {
      description,
      icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
      style: {
        borderLeft: '4px solid #ef4444'
      }
    });
  },
  warning: (message: string, description?: string) => {
    toast(message, {
      description,
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      style: {
        borderLeft: '4px solid #f59e0b'
      }
    });
  },
  info: (message: string, description?: string) => {
    toast(message, {
      description,
      icon: <Info className="w-5 h-5 text-violet-400" />,
      style: {
        borderLeft: '4px solid #8b5cf6'
      }
    });
  },
  loading: (message: string) => {
    return toast.loading(message, {
      icon: <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
    });
  },
  dismiss: (id: string | number) => {
    toast.dismiss(id);
  }
};

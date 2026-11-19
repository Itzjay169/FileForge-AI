'use client';

import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks';
import { Check, Loader2 } from 'lucide-react';

export const sakugaButtonVariants = cva(
  'relative inline-flex items-center justify-center font-semibold select-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-primary focus-visible:ring-offset-2 focus-visible:ring-offset-forge-bg disabled:opacity-50 disabled:pointer-events-none cursor-pointer overflow-hidden',
  {
    variants: {
      variant: {
        paper:
          'bg-[#faf9f7] hover:bg-white text-[#09090e] shadow-xl hover:shadow-2xl border border-white/60 font-bold',
        default:
          'bg-gradient-to-r from-violet-600 via-purple-600 to-violet-500 text-white shadow-lg hover:shadow-violet-500/25 border border-violet-400/30',
        secondary:
          'bg-white/5 hover:bg-white/10 text-white border border-white/15 backdrop-blur-md shadow-sm',
        accent:
          'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-lg hover:shadow-pink-500/25 border border-pink-400/30',
        destructive:
          'bg-red-600 hover:bg-red-700 text-white shadow-md border border-red-500/30',
        ghost:
          'text-forge-text hover:bg-white/5 hover:text-white',
        outline:
          'border border-forge-border hover:border-forge-primary/50 text-forge-text hover:text-white bg-transparent'
      },
      size: {
        sm: 'h-9 px-3 text-xs rounded-lg gap-1.5',
        default: 'h-11 px-5 text-sm rounded-xl gap-2',
        lg: 'h-13 px-8 text-base rounded-2xl gap-3',
        icon: 'h-11 w-11 rounded-xl'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface SakugaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sakugaButtonVariants> {
  isLoading?: boolean;
  showSuccessCheck?: boolean;
  onSuccessComplete?: () => void;
}

export const SakugaButton = forwardRef<HTMLButtonElement, SakugaButtonProps>(
  (
    {
      className,
      variant,
      size,
      children,
      isLoading = false,
      showSuccessCheck = false,
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [isImpactActive, setIsImpactActive] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;

      if (!prefersReducedMotion) {
        setIsImpactActive(true);
        setTimeout(() => setIsImpactActive(false), 200);

        if (showSuccessCheck) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 1200);
        }
      }

      onClick?.(e);
    };

    return (
      <motion.button
        ref={ref}
        className={cn(sakugaButtonVariants({ variant, size, className }))}
        onClick={handleClick}
        disabled={disabled || isLoading}
        whileHover={
          prefersReducedMotion
            ? {}
            : {
                scale: 1.025,
                y: -1,
                transition: { type: 'spring', stiffness: 400, damping: 25 }
              }
        }
        whileTap={
          prefersReducedMotion
            ? {}
            : {
                scaleX: 1.08,
                scaleY: 0.88,
                transition: { type: 'spring', stiffness: 500, damping: 15 }
              }
        }
        {...(props as any)}
      >
        {/* Single-frame white impact burst overlay */}
        <AnimatePresence>
          {isImpactActive && !prefersReducedMotion && (
            <motion.span
              className="absolute inset-0 bg-white z-10 pointer-events-none rounded-[inherit]"
              initial={{ opacity: 0.75, scale: 0.95 }}
              animate={{ opacity: 0, scale: 1.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <span className="relative z-0 flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-current" />
              <span>Processing...</span>
            </>
          ) : showSuccess ? (
            <motion.span
              className="flex items-center gap-1.5 text-emerald-300"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Done!</span>
            </motion.span>
          ) : (
            children
          )}
        </span>
      </motion.button>
    );
  }
);

SakugaButton.displayName = 'SakugaButton';

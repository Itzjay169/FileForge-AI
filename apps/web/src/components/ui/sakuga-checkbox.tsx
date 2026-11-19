'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks';

export interface SakugaCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  id?: string;
  className?: string;
}

export const SakugaCheckbox: React.FC<SakugaCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  id,
  className
}) => {
  const prefersReducedMotion = useReducedMotion();

  const handleToggle = () => {
    if (disabled) return;
    onChange(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-start gap-3 cursor-pointer select-none',
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
      onClick={handleToggle}
    >
      <div
        id={id}
        role="checkbox"
        tabIndex={disabled ? -1 : 0}
        aria-checked={checked}
        aria-label={label || 'Checkbox control'}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 mt-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50',
          checked
            ? 'bg-gradient-to-br from-violet-600 to-pink-500 border-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.5)]'
            : 'bg-forge-bg-card border-white/20 hover:border-violet-400/50'
        )}
      >
        {/* Animated Checkmark SVG Path */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5 text-white"
        >
          <motion.path
            d="M20 6L9 17L4 12"
            initial={false}
            animate={{
              pathLength: checked ? 1 : 0,
              opacity: checked ? 1 : 0
            } as any}
            transition={
              prefersReducedMotion
                ? { duration: 0.05 }
                : {
                    type: 'spring',
                    stiffness: 400,
                    damping: 25
                  }
            }
          />
        </svg>

        {/* Impact Frame Ripple */}
        {checked && !prefersReducedMotion && (
          <motion.div
            className="absolute -inset-1 rounded-lg border border-pink-400 pointer-events-none"
            initial={{ opacity: 0.8, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        )}
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-forge-text leading-tight">{label}</span>
          )}
          {description && (
            <span className="text-xs text-forge-text-muted mt-0.5 leading-normal">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

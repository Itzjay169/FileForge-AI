'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks';

export interface SakugaToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: 'sm' | 'default';
  className?: string;
}

export const SakugaToggle: React.FC<SakugaToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  size = 'default',
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

  const isSmall = size === 'sm';
  const trackWidth = isSmall ? 'w-10' : 'w-13';
  const trackHeight = isSmall ? 'h-6' : 'h-7';
  const knobSize = isSmall ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer select-none',
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
      onClick={handleToggle}
    >
      <div
        role="switch"
        tabIndex={disabled ? -1 : 0}
        aria-checked={checked}
        aria-label={label || 'Toggle switch'}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative rounded-full transition-colors duration-300 p-1 flex items-center focus:outline-none focus:ring-2 focus:ring-violet-500/50',
          trackWidth,
          trackHeight,
          checked
            ? 'bg-gradient-to-r from-violet-600 to-pink-500 shadow-[0_0_14px_rgba(139,92,246,0.6)]'
            : 'bg-forge-bg-card border border-white/15'
        )}
      >
        {/* Animated Knob with Squash & Smear */}
        <motion.div
          className={cn(
            'rounded-full bg-white shadow-md flex items-center justify-center pointer-events-none',
            knobSize
          )}
          animate={
            prefersReducedMotion
              ? { x: checked ? (isSmall ? 16 : 24) : 0 }
              : {
                  x: checked ? (isSmall ? 16 : 24) : 0,
                  scaleX: [1, 1.35, 1], // Smear stretch during movement
                  scaleY: [1, 0.75, 1]
                }
          }
          transition={{
            type: 'spring',
            stiffness: 450,
            damping: 24
          }}
        >
          <div
            className={cn(
              'w-1.5 h-1.5 rounded-full transition-colors',
              checked ? 'bg-violet-600' : 'bg-transparent'
            )}
          />
        </motion.div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-medium text-forge-text">{label}</span>}
          {description && (
            <span className="text-xs text-forge-text-muted">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks';

export interface SakugaProgressProps {
  value: number; // 0 - 100
  variant?: 'default' | 'success' | 'warning' | 'error' | 'plasma';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  label?: string;
  stage?: 'Uploading' | 'Validating' | 'Queued' | 'Processing' | 'Optimizing' | 'Finalizing' | 'Ready' | string;
  elapsedSeconds?: number;
  remainingSeconds?: number;
  animated?: boolean;
  showPercentage?: boolean;
  className?: string;
}

export const SakugaProgress: React.FC<SakugaProgressProps> = ({
  value,
  variant = 'default',
  size = 'default',
  showLabel = false,
  label,
  stage,
  elapsedSeconds,
  remainingSeconds,
  animated = true,
  showPercentage = true,
  className
}) => {
  const prefersReducedMotion = useReducedMotion();
  const clamped = Math.min(100, Math.max(0, value));
  const isComplete = clamped >= 100;

  const sizeClasses = {
    sm: 'h-1.5',
    default: 'h-2.5',
    lg: 'h-4'
  };

  const gradientClasses = {
    default: 'from-violet-600 via-purple-500 to-violet-400',
    success: 'from-emerald-500 via-teal-400 to-emerald-300',
    warning: 'from-amber-500 via-orange-400 to-amber-300',
    error: 'from-rose-600 via-red-500 to-pink-500',
    plasma: 'from-pink-500 via-purple-500 to-cyan-400'
  };

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || showPercentage || stage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium">
          <div className="flex items-center gap-2">
            {showLabel && <span className="text-forge-text">{label || 'Progress'}</span>}
            {stage && (
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-950/60 text-violet-300 border border-violet-500/20">
                {stage}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {elapsedSeconds !== undefined && (
              <span className="text-[11px] font-mono text-gray-500">
                {elapsedSeconds}s elapsed
              </span>
            )}
            {remainingSeconds !== undefined && remainingSeconds > 0 && (
              <span className="text-[11px] font-mono text-pink-400">
                ~{remainingSeconds}s left
              </span>
            )}
            {showPercentage && (
              <span
                className={cn(
                  'font-mono ml-auto font-bold',
                  isComplete ? 'text-emerald-400' : 'text-violet-400'
                )}
              >
                {Math.round(clamped)}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Progress Track */}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          'relative w-full bg-forge-bg-card border border-white/10 rounded-full overflow-hidden shadow-inner',
          sizeClasses[size]
        )}
      >
        {/* Animated Fill Bar */}
        <motion.div
          className={cn(
            'h-full bg-gradient-to-r relative overflow-hidden rounded-full shadow-[0_0_12px_rgba(139,92,246,0.6)]',
            gradientClasses[isComplete ? 'success' : variant]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={
            prefersReducedMotion
              ? { duration: 0.1 }
              : { type: 'spring', damping: 20, stiffness: 120 }
          }
        >
          {/* Animated Energy Shimmer Stripe */}
          {animated && !isComplete && !prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full"
              animate={{ x: ['-100%', '200%'] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: 'linear'
              }}
            />
          )}

          {/* Completion Impact Sparkle */}
          {isComplete && !prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

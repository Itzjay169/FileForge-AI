'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks';

export interface SakugaSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  unit?: string;
  estimatedSizeLabel?: string;
  variant?: 'default' | 'quality' | 'size' | 'extreme';
  disabled?: boolean;
  className?: string;
}

export const SakugaSlider: React.FC<SakugaSliderProps> = ({
  min = 1,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  showValue = true,
  unit = '%',
  estimatedSizeLabel,
  variant = 'default',
  disabled = false,
  className
}) => {
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragVelocity, setDragVelocity] = useState(0);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const updateFromPointer = useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return;
      const rect = trackRef.current.getBoundingClientRect();
      const rawPos = (clientX - rect.left) / rect.width;
      const clamped = Math.max(0, Math.min(1, rawPos));
      const rawValue = min + clamped * (max - min);
      const stepped = Math.round(rawValue / step) * step;
      const bounded = Math.min(max, Math.max(min, stepped));

      // Calculate drag speed for squash stretch
      const now = performance.now();
      const dt = (now - lastTimeRef.current) / 1000;
      if (dt > 0.016) {
        const dx = clientX - lastXRef.current;
        const v = Math.min(2.5, Math.max(-2.5, dx / (dt * 400)));
        setDragVelocity(v);
        lastXRef.current = clientX;
        lastTimeRef.current = now;
      }

      onChange(bounded);
    },
    [min, max, step, disabled, onChange]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    setIsDragging(true);
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    updateFromPointer(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragVelocity(0);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(max, value + step));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(min, value - step));
    }
  };

  // Gradient styles
  const getFillGradient = () => {
    switch (variant) {
      case 'quality':
        return 'from-amber-500 via-violet-500 to-emerald-400';
      case 'size':
        return 'from-pink-500 via-rose-500 to-violet-500';
      case 'extreme':
        return 'from-red-500 via-orange-500 to-pink-500';
      default:
        return 'from-violet-600 via-purple-500 to-pink-500';
    }
  };

  return (
    <div className={cn('w-full select-none', className)}>
      {(label || showValue || estimatedSizeLabel) && (
        <div className="flex justify-between items-center mb-2.5">
          {label && (
            <span className="text-sm font-medium text-forge-text flex items-center gap-1.5">
              {label}
            </span>
          )}
          <div className="flex items-center gap-2">
            {estimatedSizeLabel && (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                Est: {estimatedSizeLabel}
              </span>
            )}
            {showValue && (
              <span className="text-xs font-mono font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md">
                {value} {unit}
              </span>
            )}
          </div>
        </div>
      )}

      <div
        ref={trackRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label || 'Slider control'}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          'relative h-8 flex items-center cursor-pointer touch-none group focus:outline-none',
          disabled && 'opacity-40 cursor-not-allowed'
        )}
      >
        {/* Track Background */}
        <div className="relative w-full h-2.5 bg-forge-bg-card border border-white/10 rounded-full overflow-hidden">
          {/* Active Fill */}
          <div
            className={cn('h-full bg-gradient-to-r transition-all duration-75', getFillGradient())}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Anime Teardrop Stretching Thumb */}
        <motion.div
          className="absolute top-1/2 -mt-3.5 -ml-3.5 w-7 h-7 flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-none"
          style={{ left: `${percentage}%` }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scaleX: isDragging ? 1.25 + Math.abs(dragVelocity) * 0.15 : 1,
                  scaleY: isDragging ? 0.85 : 1,
                  rotate: isDragging ? dragVelocity * 8 : 0
                }
          }
          transition={{ type: 'spring', damping: 15, stiffness: 350 }}
        >
          {/* Outer glow ring */}
          <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_16px_rgba(139,92,246,0.8)] border-2 border-violet-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
          </div>

          {/* Floating Bubble Label while dragging */}
          <AnimatePresence>
            {isDragging && !prefersReducedMotion && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.8 }}
                animate={{ opacity: 1, y: -26, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.8 }}
                className="absolute font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white shadow-lg shadow-violet-500/30 whitespace-nowrap"
              >
                {value}
                {unit}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

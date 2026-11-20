'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { SakugaSliderElement } from '@/types/sakuga';

export interface ForgeSliderProps {
  label?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  presets?: { label: string; value: number }[];
  estimatedOutput?: {
    size?: string;
    savings?: string;
    time?: string;
  };
  className?: string;
  variant?: string;
}

export const ForgeSlider: React.FC<ForgeSliderProps> = ({
  label,
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
  unit = '%',
  disabled = false,
  presets = [
    { label: 'Low', value: 30 },
    { label: 'Balanced', value: 65 },
    { label: 'High', value: 85 },
    { label: 'Extreme', value: 100 },
  ],
  estimatedOutput,
  className,
}) => {
  const sliderRef = useRef<SakugaSliderElement | null>(null);

  // Sync controlled value to Web Component
  useEffect(() => {
    if (sliderRef.current && sliderRef.current.value !== String(value)) {
      sliderRef.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const handleInput = () => {
      const num = Number(el.value);
      if (!isNaN(num)) onChange(num);
    };

    const handleChange = () => {
      const num = Number(el.value);
      if (!isNaN(num)) onChange(num);
    };

    el.addEventListener('input', handleInput);
    el.addEventListener('change', handleChange);

    return () => {
      el.removeEventListener('input', handleInput);
      el.removeEventListener('change', handleChange);
    };
  }, [onChange]);

  // Derived calculations for estimated size if not provided
  const derivedEstimation = useMemo(() => {
    if (estimatedOutput) return estimatedOutput;
    // Auto-calculate realistic compression estimation
    const savingsPercent = Math.max(10, Math.round(92 - (value / max) * 60));
    const estMb = ((28.4 * (100 - savingsPercent)) / 100).toFixed(1);
    const estSec = Math.max(2, Math.round((value / max) * 14));
    return {
      size: `${estMb} MB`,
      savings: `${savingsPercent}%`,
      time: `${estSec}s`,
    };
  }, [estimatedOutput, value, max]);

  return (
    <div className={cn('space-y-3 p-4 rounded-2xl bg-[var(--sk-surface)] border border-[var(--sk-border)]', className)}>
      {/* Header with Label and Current Value Badge */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-[var(--sk-text)] tracking-tight">
          {label}
        </label>
        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[var(--sk-surface-raised)] border border-[var(--sk-border)] text-[var(--sk-acc)]">
          {value} {unit}
        </span>
      </div>

      {/* Sakuga VFX Custom Slider with spring teardrop thumb */}
      <div className="py-1">
        <sakuga-slider
          ref={sliderRef}
          value={value}
          min={min}
          max={max}
          step={step}
          label={label}
          disabled={disabled ? true : undefined}
          class="w-full cursor-pointer"
        />
      </div>

      {/* Preset Buttons */}
      {presets && presets.length > 0 && (
        <div className="flex items-center gap-1.5 pt-1">
          {presets.map((preset) => {
            const isActive = value === preset.value;
            return (
              <button
                key={preset.label}
                type="button"
                disabled={disabled}
                onClick={() => onChange(preset.value)}
                className={cn(
                  'flex-1 py-1 px-2 text-xs font-mono font-semibold rounded-lg transition-all',
                  'border cursor-pointer select-none active:scale-95',
                  isActive
                    ? 'bg-[var(--sk-acc)] text-white border-[var(--sk-acc)] shadow-sm'
                    : 'bg-white/5 border-[var(--sk-border)] text-[var(--sk-text-muted)] hover:text-[var(--sk-text)] hover:bg-white/10'
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Live Estimated Metrics */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--sk-border)] text-center font-mono">
        <div className="p-1.5 rounded-lg bg-black/25">
          <div className="text-[10px] uppercase text-[var(--sk-text-muted)] font-medium">Output Size</div>
          <div className="text-xs font-bold text-[var(--sk-text)] mt-0.5">{derivedEstimation.size}</div>
        </div>
        <div className="p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
          <div className="text-[10px] uppercase text-emerald-400 font-medium">Est. Savings</div>
          <div className="text-xs font-bold text-emerald-300 mt-0.5">−{derivedEstimation.savings}</div>
        </div>
        <div className="p-1.5 rounded-lg bg-black/25">
          <div className="text-[10px] uppercase text-[var(--sk-text-muted)] font-medium">Process Time</div>
          <div className="text-xs font-bold text-violet-300 mt-0.5">~{derivedEstimation.time}</div>
        </div>
      </div>
    </div>
  );
};

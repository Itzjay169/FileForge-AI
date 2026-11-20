'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { SakugaRadioElement } from '@/types/sakuga';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
}

export interface ForgeRadioGroupProps {
  label?: string;
  name?: string;
  value: string;
  onChange: (val: string) => void;
  options: RadioOption[];
  disabled?: boolean;
  className?: string;
}

export const ForgeRadioGroup: React.FC<ForgeRadioGroupProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
  className,
}) => {
  const radioRef = useRef<SakugaRadioElement | null>(null);

  useEffect(() => {
    if (radioRef.current && radioRef.current.value !== value) {
      radioRef.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    const el = radioRef.current;
    if (!el) return;

    const handleChange = () => {
      if (el.value) {
        onChange(el.value);
      }
    };

    el.addEventListener('change', handleChange);
    return () => {
      el.removeEventListener('change', handleChange);
    };
  }, [onChange]);

  return (
    <div className={cn('space-y-2 select-none', className)}>
      {label && (
        <label className="text-sm font-bold text-[var(--sk-text)] tracking-tight block">
          {label}
        </label>
      )}

      {/* Official Sakuga VFX Radio with animated dot spring and burst */}
      <sakuga-radio
        ref={radioRef}
        label={label || 'Select option'}
        name={name}
        disabled={disabled ? true : undefined}
        class="w-full"
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            selected={opt.value === value ? true : undefined}
          >
            {opt.label} {opt.badge ? `(${opt.badge})` : ''}
          </option>
        ))}
      </sakuga-radio>

      {/* Rich option descriptions if provided */}
      {options.some((o) => o.description) && (
        <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--sk-text-muted)] font-mono">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => !disabled && onChange(opt.value)}
              className={cn(
                'p-2.5 rounded-xl border transition-all cursor-pointer',
                opt.value === value
                  ? 'bg-violet-950/30 border-violet-500/50 text-white'
                  : 'bg-black/20 border-[var(--sk-border)] hover:border-white/20'
              )}
            >
              <div className="font-bold flex items-center justify-between">
                <span>{opt.label}</span>
                {opt.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300">
                    {opt.badge}
                  </span>
                )}
              </div>
              {opt.description && <p className="mt-1 text-[11px] opacity-75">{opt.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

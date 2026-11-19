'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { SakugaToggleElement } from '@/types/sakuga';

export interface ForgeToggleProps {
  label?: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  className?: string;
  [key: string]: any;
}

export const ForgeToggle: React.FC<ForgeToggleProps> = ({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  name,
  error,
  ariaLabel,
  className,
}) => {
  const toggleRef = useRef<SakugaToggleElement | null>(null);

  // Sync React controlled checked prop with the Web Component
  useEffect(() => {
    if (toggleRef.current) {
      toggleRef.current.checked = !!checked;
    }
  }, [checked]);

  useEffect(() => {
    const el = toggleRef.current;
    if (!el) return;

    const handleChange = () => {
      onChange?.(el.checked);
    };

    el.addEventListener('change', handleChange);
    return () => {
      el.removeEventListener('change', handleChange);
    };
  }, [onChange]);

  return (
    <div className={cn('flex items-start justify-between gap-4 py-2 select-none', className)}>
      <div className="flex flex-col space-y-0.5">
        <label
          htmlFor={name}
          className={cn(
            'text-sm font-semibold text-[var(--sk-text)] tracking-tight cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-[var(--sk-text-muted)] leading-relaxed max-w-sm">
            {description}
          </p>
        )}
        {error && <p className="text-xs text-[var(--sk-danger)] font-medium mt-1">{error}</p>}
      </div>

      <div className="shrink-0 pt-0.5">
        <sakuga-toggle
          ref={toggleRef as any}
          label={ariaLabel || label}
          checked={checked ? true : undefined}
          disabled={disabled ? true : undefined}
          name={name}
          class="cursor-pointer"
        />
      </div>
    </div>
  );
};

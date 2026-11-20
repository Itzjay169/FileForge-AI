'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { SakugaToggleElement } from '@/types/sakuga';
import { useSakuga } from '@/components/providers/sakuga-provider';

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
  const { loadComponent } = useSakuga();

  // Lazy-load the ~505 KB toggle sprite script only when a ForgeToggle mounts
  useEffect(() => {
    loadComponent('toggle.js');
  }, [loadComponent]);

  // Sync React controlled checked prop with the Web Component only when it actually differs
  useEffect(() => {
    if (toggleRef.current && toggleRef.current.checked !== !!checked) {
      toggleRef.current.checked = !!checked;
    }
  }, [checked]);

  useEffect(() => {
    const el = toggleRef.current;
    if (!el) return;

    // Ensure initial checked state is synchronized on mount
    if (el.checked !== !!checked) {
      el.checked = !!checked;
    }

    const handleChange = () => {
      onChange?.(el.checked);
    };

    el.addEventListener('change', handleChange);
    return () => {
      el.removeEventListener('change', handleChange);
    };
  }, [checked, onChange]);

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
          ref={toggleRef}
          label={ariaLabel || label}
          disabled={disabled ? true : undefined}
          name={name}
          class="cursor-pointer"
        />
      </div>
    </div>
  );
};

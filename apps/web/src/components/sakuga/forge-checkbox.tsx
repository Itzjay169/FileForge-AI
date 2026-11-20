'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { SakugaCheckboxElement } from '@/types/sakuga';

export interface ForgeCheckboxProps {
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  error?: string;
  className?: string;
}

export const ForgeCheckbox: React.FC<ForgeCheckboxProps> = ({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  name,
  error,
  className,
}) => {
  const checkboxRef = useRef<SakugaCheckboxElement | null>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = !!checked;
    }
  }, [checked]);

  useEffect(() => {
    const el = checkboxRef.current;
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
    <div className={cn('flex items-start gap-3 py-1.5 select-none', className)}>
      <div className="shrink-0 pt-0.5">
        <sakuga-checkbox
          ref={checkboxRef}
          checked={checked ? true : undefined}
          disabled={disabled ? true : undefined}
          name={name}
          class="cursor-pointer"
        >
          {label}
        </sakuga-checkbox>
      </div>

      {description && (
        <div className="flex flex-col -mt-0.5">
          <p className="text-xs text-[var(--sk-text-muted)] leading-relaxed">
            {description}
          </p>
          {error && <p className="text-xs text-[var(--sk-danger)] font-medium mt-0.5">{error}</p>}
        </div>
      )}
    </div>
  );
};

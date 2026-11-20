'use client';

import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SakugaInputElement } from '@/types/sakuga';

export interface ForgeInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: { target: { value: string }; currentTarget?: { value: string }; value?: string }) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  name?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  className?: string;
  maxLength?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => void;
}

export const ForgeInput: React.FC<ForgeInputProps> = ({
  label,
  placeholder,
  value = '',
  onChange,
  type = 'text',
  name,
  helperText,
  error,
  disabled = false,
  loading = false,
  leadingIcon,
  trailingIcon,
  className,
    onKeyDown,
}) => {
  const inputRef = useRef<SakugaInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value) {
      inputRef.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const notifyChange = () => {
      const val = el.value;
      const hybrid = Object.assign(new String(val), {
        target: { value: val },
        currentTarget: { value: val },
        value: val,
      });
      if (typeof onChange === 'function') {
        (onChange as (val: unknown) => void)(hybrid);
      }
    };

    const handleInput = () => {
      notifyChange();
    };

    const handleChange = () => {
      notifyChange();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      onKeyDown?.(e);
    };

    el.addEventListener('input', handleInput);
    el.addEventListener('change', handleChange);
    el.addEventListener('keydown', handleKeyDown);

    return () => {
      el.removeEventListener('input', handleInput);
      el.removeEventListener('change', handleChange);
      el.removeEventListener('keydown', handleKeyDown);
    };
  }, [onChange, onKeyDown]);

  return (
    <div className={cn('space-y-1.5 w-full', className)}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--sk-text-muted)] font-mono block">
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leadingIcon && (
          <div className="absolute left-3.5 z-10 pointer-events-none text-[var(--sk-text-muted)]">
            {leadingIcon}
          </div>
        )}

        {/* Sakuga VFX Animated Input with caret dust effects */}
        <sakuga-input
          ref={inputRef}
          label={label || placeholder}
          placeholder={placeholder}
          value={value}
          type={type}
          name={name}
          disabled={disabled || loading ? true : undefined}
          class={cn(
            'w-full cursor-text',
            leadingIcon && '[&_input]:pl-10',
            (trailingIcon || loading) && '[&_input]:pr-10'
          )}
        />

        <div className="absolute right-3.5 z-10 flex items-center gap-1.5 pointer-events-none">
          {loading && <Loader2 className="w-4 h-4 animate-spin text-[var(--sk-acc)]" />}
          {!loading && trailingIcon && <span className="text-[var(--sk-text-muted)]">{trailingIcon}</span>}
        </div>
      </div>

      {helperText && !error && (
        <p className="text-xs text-[var(--sk-text-muted)] font-mono">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-[var(--sk-danger)] font-medium font-mono">{error}</p>
      )}
    </div>
  );
};

'use client';

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SakugaButtonElement } from '@/types/sakuga';

export interface ForgeButtonRef {
  done: () => void;
  focus: () => void;
  blur: () => void;
  element: HTMLElement | null;
}

export interface ForgeButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'paper' | 'default' | 'accent' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  ariaLabel?: string;
}

export const ForgeButton = forwardRef<ForgeButtonRef, ForgeButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      isLoading = false,
      disabled = false,
      icon,
      fullWidth = false,
      type = 'button',
      onClick,
      className,
      ariaLabel,
    },
    ref
  ) => {
    const sakugaRef = useRef<SakugaButtonElement | null>(null);
    const nativeRef = useRef<HTMLButtonElement | null>(null);
    const [, setIsDone] = useState(false);

    const actualLoading = loading || isLoading;
    const actualVariant =
      variant === 'default' || variant === 'accent'
        ? 'primary'
        : variant === 'destructive'
        ? 'danger'
        : variant;

    useImperativeHandle(ref, () => ({
      done: () => {
        setIsDone(true);
        if (sakugaRef.current?.done) {
          sakugaRef.current.done();
        }
        setTimeout(() => setIsDone(false), 2400);
      },
      focus: () => {
        (sakugaRef.current || nativeRef.current)?.focus();
      },
      blur: () => {
        (sakugaRef.current || nativeRef.current)?.blur();
      },
      element: sakugaRef.current || nativeRef.current,
    }));

    const isPrimaryOrSecondary = actualVariant === 'primary' || actualVariant === 'secondary';

    // Size styling
    const sizeMap: Record<string, string> = {
      sm: 'px-3 py-1.5 text-xs rounded-xl min-h-[34px]',
      md: 'px-5 py-2.5 text-sm rounded-2xl min-h-[44px]',
      lg: 'px-7 py-3 text-base rounded-2xl min-h-[52px]',
      icon: 'w-10 h-10 p-0 flex items-center justify-center rounded-xl min-h-[40px]',
    };
    const sizeClasses = sizeMap[size as string] || sizeMap.md;

    // Variant styling for non-custom element variants or fallback
    const variantMap: Record<string, string> = {
      primary: 'bg-[var(--sk-card)] border-2 border-[var(--sk-btn-line)] text-[var(--sk-ink)] shadow-[var(--sk-btn-sh)]',
      secondary: 'bg-[var(--sk-surface)] border-2 border-[var(--sk-alt-line)] text-[var(--sk-text)] shadow-[var(--sk-alt-sh)]',
      ghost: 'bg-transparent border border-transparent text-[var(--sk-text-muted)] hover:text-[var(--sk-text)] hover:bg-white/5',
      danger: 'bg-rose-950/40 border-2 border-rose-500 text-rose-200 hover:bg-rose-900/50 shadow-[4px_5px_0_rgba(244,63,94,0.3)]',
      success: 'bg-emerald-950/40 border-2 border-emerald-500 text-emerald-200 hover:bg-emerald-900/50 shadow-[4px_5px_0_rgba(16,185,129,0.3)]',
      paper: 'bg-[#faf9f7] text-[#09090e] border-2 border-black/10 font-bold shadow-[4px_6px_0_rgba(139,92,246,0.35)] hover:shadow-[2px_3px_0_rgba(139,92,246,0.5)]',
    };
    const variantClasses = variantMap[actualVariant as string] || variantMap.primary;

    // For primary and secondary, we can mount <sakuga-button> directly to let Sakuga's DOM and anime burst fire!
    if (isPrimaryOrSecondary) {
      return (
        <div
          className={cn(
            'inline-flex relative items-center justify-center',
            fullWidth && 'w-full [&>sakuga-button]:w-full',
            className
          )}
        >
          <sakuga-button
            ref={sakugaRef}
            variant={actualVariant === 'secondary' ? 'secondary' : undefined}
            disabled={disabled || actualLoading ? true : undefined}
            type={type}
            aria-label={ariaLabel}
            onClick={onClick}
            class={cn(
              'cursor-pointer select-none transition-all outline-none focus-visible:outline-[var(--sk-acc)]',
              disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
            )}
          >
            <span className="inline-flex items-center justify-center gap-2 font-sans font-bold">
              {actualLoading && <Loader2 className="w-4 h-4 animate-spin text-[var(--sk-acc)]" />}
              {!actualLoading && icon && <span className="inline-flex shrink-0">{icon}</span>}
              <span>{children}</span>
            </span>
          </sakuga-button>
        </div>
      );
    }

    // Extended variants (ghost, danger, success, paper) with tactile squash feedback
    return (
      <button
        ref={nativeRef}
        type={type}
        disabled={disabled || actualLoading}
        onClick={onClick}
        aria-label={ariaLabel}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 font-sans font-bold cursor-pointer select-none',
          'transition-transform duration-100 ease-out active:scale-95 active:translate-y-0.5',
          'outline-none focus-visible:outline-2 focus-visible:outline-[var(--sk-acc)] focus-visible:outline-offset-2',
          sizeClasses,
          variantClasses,
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
      >
        {actualLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!actualLoading && icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

ForgeButton.displayName = 'ForgeButton';

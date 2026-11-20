'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { SakugaRatingElement } from '@/types/sakuga';

export interface ForgeRatingProps {
  label?: string;
  value?: number;
  onChange?: (val: number) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}

export const ForgeRating: React.FC<ForgeRatingProps> = ({
  label = 'Job Feedback',
  value = 5,
  onChange,
  disabled = false,
  name,
  className,
}) => {
  const ratingRef = useRef<SakugaRatingElement | null>(null);

  useEffect(() => {
    if (ratingRef.current && ratingRef.current.value !== value) {
      ratingRef.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    const el = ratingRef.current;
    if (!el) return;

    const handleChange = () => {
      onChange?.(Number(el.value));
    };

    el.addEventListener('change', handleChange);
    return () => {
      el.removeEventListener('change', handleChange);
    };
  }, [onChange]);

  return (
    <div className={cn('flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[var(--sk-surface)] border border-[var(--sk-border)]', className)}>
      {label && (
        <span className="text-xs font-mono font-semibold text-[var(--sk-text-muted)]">
          {label}
        </span>
      )}
      <sakuga-rating
        ref={ratingRef}
        label={label}
        value={value}
        disabled={disabled ? true : undefined}
        name={name}
        class="cursor-pointer"
      />
    </div>
  );
};

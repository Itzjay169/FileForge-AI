'use client';

import React, {
  forwardRef,
  useState,
  useRef,
  useId,
  useImperativeHandle,
  type ReactNode,
  type InputHTMLAttributes,
  type ChangeEvent,
  type FocusEvent,
  type MouseEvent,
} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SakugaInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  variant?: 'default' | 'search';
  containerClassName?: string;
}

export const SakugaInput = forwardRef<HTMLInputElement, SakugaInputProps>(
  (
    {
      label,
      error,
      icon,
      variant = 'default',
      containerClassName,
      className,
      disabled,
      id,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      placeholder,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    const shouldReduceMotion = useReducedMotion();

    // Controlled vs uncontrolled state detection
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<string>(
      defaultValue !== undefined ? String(defaultValue) : ''
    );
    const currentValue = isControlled ? String(value ?? '') : uncontrolledValue;
    const hasValue = currentValue.length > 0;

    const [isFocused, setIsFocused] = useState<boolean>(false);
    const isFloating = isFocused || hasValue;

    // Search variant automatically supplies Search icon if no custom icon passed
    const isSearch = variant === 'search';
    const effectiveLeftIcon = icon ?? (isSearch ? <Search className="w-4 h-4" aria-hidden="true" /> : null);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setUncontrolledValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isControlled) {
        setUncontrolledValue('');
      }

      if (inputRef.current) {
        inputRef.current.value = '';

        // Dispatch synthetic events so React and external libraries receive update
        inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
        inputRef.current.focus();
      }

      if (onChange && inputRef.current) {
        const syntheticEvent = {
          target: inputRef.current,
          currentTarget: inputRef.current,
          nativeEvent: new Event('change'),
          isDefaultPrevented: () => false,
          isPropagationStopped: () => false,
          persist: () => {},
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          eventPhase: 3,
          isTrusted: true,
          preventDefault: () => {},
          stopPropagation: () => {},
          timeStamp: Date.now(),
          type: 'change',
        } as unknown as ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const labelVariants = {
      resting: {
        x: effectiveLeftIcon ? 42 : 16,
        y: 13,
        scale: 1,
        color: 'var(--color-forge-text-dim, #6b7280)',
      },
      floating: {
        x: 2,
        y: -22,
        scale: 0.82,
        color: error
          ? 'var(--color-forge-error, #ef4444)'
          : isFocused
          ? 'var(--color-forge-primary, #8b5cf6)'
          : 'var(--color-forge-text-muted, #9ca3af)',
      },
    };

    return (
      <div className={cn('relative flex flex-col w-full', label && 'pt-5', containerClassName)}>
        <div className="relative flex items-center w-full">
          {/* Optional Left Icon */}
          {effectiveLeftIcon && (
            <div
              className={cn(
                'absolute left-3.5 z-10 flex items-center justify-center pointer-events-none transition-colors duration-200',
                disabled && 'opacity-50',
                error
                  ? 'text-forge-error'
                  : isFocused
                  ? 'text-forge-primary'
                  : 'text-forge-text-muted'
              )}
            >
              {effectiveLeftIcon}
            </div>
          )}

          {/* Floating Animated Label */}
          {label && (
            <motion.label
              htmlFor={inputId}
              initial={false}
              animate={isFloating ? 'floating' : 'resting'}
              variants={labelVariants}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.2, ease: [0.19, 1, 0.22, 1] }
              }
              className={cn(
                'absolute top-0 left-0 select-none font-medium cursor-text origin-top-left z-10',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {label}
            </motion.label>
          )}

          {/* Core Input Field */}
          <input
            ref={inputRef}
            id={inputId}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            placeholder={label ? (isFloating ? placeholder : undefined) : placeholder}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : ariaDescribedBy}
            className={cn(
              'w-full bg-forge-bg-card border rounded-xl px-4 py-3 text-forge-text placeholder:text-forge-text-dim',
              'outline-none transition-all duration-200 ease-out',
              error
                ? 'border-forge-error focus:border-forge-error focus:ring-2 focus:ring-forge-error/20'
                : 'border-forge-border focus:border-forge-primary focus:ring-2 focus:ring-forge-primary/20',
              effectiveLeftIcon ? 'pl-11' : 'pl-4',
              isSearch ? 'pr-11' : 'pr-4',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...restProps}
          />

          {/* Search Clear Button */}
          <AnimatePresence>
            {isSearch && hasValue && !disabled && (
              <motion.button
                type="button"
                onClick={handleClear}
                aria-label="Clear input"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-3 z-10 p-1 rounded-lg text-forge-text-muted hover:text-forge-text hover:bg-forge-bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-primary/40 transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Error Message with Shake Animation */}
        <AnimatePresence>
          {error && (
            <motion.p
              id={errorId}
              role="alert"
              aria-live="polite"
              className="text-forge-error text-sm mt-1.5 ml-0.5"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      x: [0, -8, 8, -6, 6, -3, 3, 0],
                      transition: {
                        x: { duration: 0.35, ease: 'easeInOut' },
                        opacity: { duration: 0.15 },
                      },
                    }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -4, transition: { duration: 0.15 } }
              }
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

SakugaInput.displayName = 'SakugaInput';

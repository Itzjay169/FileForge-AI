'use client';

import React, {
  createContext,
  useContext,
  useState,
  useId,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useReducedMotion,
  type Transition,
} from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// Context & Hook
// ============================================================================

interface SakugaTabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  baseId: string;
}

const SakugaTabsContext = createContext<SakugaTabsContextValue | null>(null);

function useSakugaTabs(): SakugaTabsContextValue {
  const context = useContext(SakugaTabsContext);
  if (!context) {
    throw new Error('SakugaTabs compound components must be rendered within a <SakugaTabs> wrapper.');
  }
  return context;
}

// ============================================================================
// SakugaTabs
// ============================================================================

export interface SakugaTabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
}

export function SakugaTabs({
  defaultValue = '',
  value,
  onValueChange,
  className,
  children,
}: SakugaTabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(defaultValue);
  const baseId = useId();

  const isControlled = value !== undefined;
  const activeTab = isControlled ? value : uncontrolledValue;

  const setActiveTab = useCallback(
    (nextTab: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextTab);
      }
      onValueChange?.(nextTab);
    },
    [isControlled, onValueChange]
  );

  return (
    <LayoutGroup id={baseId}>
      <SakugaTabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
        <div className={cn('flex flex-col w-full', className)}>
          {children}
        </div>
      </SakugaTabsContext.Provider>
    </LayoutGroup>
  );
}

// ============================================================================
// SakugaTabsList
// ============================================================================

export interface SakugaTabsListProps {
  className?: string;
  children: ReactNode;
}

export function SakugaTabsList({ className, children }: SakugaTabsListProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabList = e.currentTarget;
    const tabs = Array.from(
      tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
    );
    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);

    if (currentIndex === -1) return;

    let targetIndex = currentIndex;

    if (e.key === 'ArrowRight') {
      targetIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      targetIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      targetIndex = 0;
    } else if (e.key === 'End') {
      targetIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const targetTab = tabs[targetIndex];
    if (targetTab) {
      targetTab.focus();
      targetTab.click();
    }
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex items-center gap-1 bg-forge-bg-card rounded-xl p-1 overflow-x-auto scrollbar-none border border-forge-border/40 backdrop-blur-md max-w-full',
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================================================
// SakugaTabsTrigger
// ============================================================================

export interface SakugaTabsTriggerProps {
  value: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

const springTransition: Transition = {
  type: 'spring',
  stiffness: 450,
  damping: 32,
  mass: 0.8,
};

export function SakugaTabsTrigger({
  value,
  children,
  icon,
  className,
  disabled = false,
}: SakugaTabsTriggerProps) {
  const { activeTab, setActiveTab, baseId } = useSakugaTabs();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const isSelected = activeTab === value;

  const triggerId = `${baseId}-trigger-${value}`;
  const contentId = `${baseId}-content-${value}`;

  return (
    <motion.button
      type="button"
      role="tab"
      id={triggerId}
      aria-selected={isSelected}
      aria-controls={contentId}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          setActiveTab(value);
        }
      }}
      whileTap={!disabled && !prefersReducedMotion ? { scale: 0.97 } : undefined}
      transition={springTransition}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors select-none outline-none focus-visible:ring-2 focus-visible:ring-forge-primary focus-visible:ring-offset-2 focus-visible:ring-offset-forge-bg disabled:pointer-events-none disabled:opacity-40 cursor-pointer',
        isSelected ? 'text-white' : 'text-forge-text-muted hover:text-forge-text',
        className
      )}
    >
      {isSelected && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 rounded-lg bg-forge-primary/20 border border-forge-primary/30 shadow-[0_0_14px_rgba(139,92,246,0.25)] pointer-events-none"
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : springTransition
          }
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {icon && (
          <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </span>
    </motion.button>
  );
}

// ============================================================================
// SakugaTabsContent
// ============================================================================

export interface SakugaTabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function SakugaTabsContent({
  value,
  children,
  className,
}: SakugaTabsContentProps) {
  const { activeTab, baseId } = useSakugaTabs();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const isSelected = activeTab === value;

  const triggerId = `${baseId}-trigger-${value}`;
  const contentId = `${baseId}-content-${value}`;

  return (
    <AnimatePresence mode="wait">
      {isSelected && (
        <motion.div
          key={value}
          role="tabpanel"
          id={contentId}
          aria-labelledby={triggerId}
          tabIndex={0}
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 8 }
          }
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: prefersReducedMotion ? 0 : 0.2,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              duration: prefersReducedMotion ? 0 : 0.1,
              ease: 'easeOut',
            },
          }}
          className={cn(
            'mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-forge-bg rounded-lg',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

'use client';

import React, { useState, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks';

interface TooltipContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const SakugaTooltip: React.FC<{
  delayMs?: number;
  children: ReactNode;
}> = ({ delayMs = 200, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleOpen = () => {
    timerRef.current = setTimeout(() => setIsOpen(true), delayMs);
  };

  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsOpen(false);
  };

  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen }}>
      <div
        className="relative inline-block"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onFocus={handleOpen}
        onBlur={handleClose}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
};

export const SakugaTooltipTrigger: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn('inline-flex', className)}>{children}</div>;
};

export const SakugaTooltipContent: React.FC<{
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}> = ({ children, side = 'top', className }) => {
  const context = useContext(TooltipContext);
  const prefersReducedMotion = useReducedMotion();

  if (!context) {
    throw new Error('SakugaTooltipContent must be used within SakugaTooltip');
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <AnimatePresence>
      {context.isOpen && (
        <motion.div
          role="tooltip"
          className={cn(
            'absolute z-50 px-2.5 py-1 text-xs font-medium text-foreground bg-card border border-border rounded-lg shadow-xl backdrop-blur-md pointer-events-none whitespace-nowrap',
            positionClasses[side],
            className
          )}
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.85, y: side === 'top' ? 4 : side === 'bottom' ? -4 : 0 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.85 }
          }
          transition={{ type: 'spring', damping: 18, stiffness: 350 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

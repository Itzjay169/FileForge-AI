'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ForgeTooltipProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
}

export const ForgeTooltip: React.FC<ForgeTooltipProps> = ({
  text,
  children,
  className,
}) => {
  return (
    <span className={cn('inline-flex items-center align-middle', className)}>
      <sakuga-tooltip text={text} class="cursor-help">
        {children || <span className="font-bold text-xs">?</span>}
      </sakuga-tooltip>
    </span>
  );
};

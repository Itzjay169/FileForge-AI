'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { SakugaTabsElement } from '@/types/sakuga';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface ForgeTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  queryParam?: string; // Optional: auto-sync with URL query param for deep-linking
  className?: string;
  ariaLabel?: string;
}

export const ForgeTabs: React.FC<ForgeTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  queryParam,
  className,
  ariaLabel = 'File Categories',
}) => {
  const tabsRef = useRef<SakugaTabsElement | null>(null);

  // If queryParam is provided, initialize from URL safely on mount
  useEffect(() => {
    if (queryParam && typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const paramVal = sp.get(queryParam);
      if (paramVal && tabs.some((t) => t.id === paramVal) && paramVal !== activeTab) {
        onChange(paramVal);
      }
    }
  }, [queryParam, tabs, activeTab, onChange]);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    const handleChange = () => {
      const selectedIndex = el.selected;
      if (typeof selectedIndex === 'number' && tabs[selectedIndex]) {
        const nextId = tabs[selectedIndex].id;
        onChange(nextId);

        if (queryParam && typeof window !== 'undefined') {
          const current = new URLSearchParams(window.location.search);
          current.set(queryParam, nextId);
          window.history.replaceState(null, '', `?${current.toString()}`);
        }
      }
    };

    el.addEventListener('change', handleChange);
    return () => {
      el.removeEventListener('change', handleChange);
    };
  }, [tabs, onChange, queryParam]);

  return (
    <div className={cn('w-full overflow-x-auto scrollbar-none py-1 select-none', className)}>
      <sakuga-tabs
        ref={tabsRef as any}
        label={ariaLabel}
        class="inline-flex cursor-pointer"
      >
        {tabs.map((tab) => (
          <option
            key={tab.id}
            value={tab.id}
            selected={tab.id === activeTab ? true : undefined}
          >
            {tab.label}
          </option>
        ))}
      </sakuga-tabs>
    </div>
  );
};

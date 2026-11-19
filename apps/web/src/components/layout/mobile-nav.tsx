'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, RefreshCw, Wand2, FolderClosed, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const tabs = [
    { label: 'Studio', href: '/studio', icon: Zap },
    { label: 'Convert', href: '/convert', icon: RefreshCw },
    { label: 'Editor', href: '/editor', icon: Wand2 },
    { label: 'Library', href: '/dashboard', icon: FolderClosed },
    { label: 'Plans', href: '/pricing', icon: CreditCard }
  ];

  return (
    <nav
      aria-label="Mobile Action Bar"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#09090e]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-2 flex items-center justify-around shadow-2xl safe-area-pb"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl transition-all',
              isActive
                ? 'text-pink-400 font-bold'
                : 'text-gray-400 hover:text-white'
            )}
          >
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                isActive
                  ? 'bg-gradient-to-tr from-violet-600 to-pink-500 text-white shadow-md shadow-pink-500/30'
                  : 'bg-white/5'
              )}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

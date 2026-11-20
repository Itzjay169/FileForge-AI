'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Command,
  Sun,
  Moon,
  User,
  Sparkles,
  ArrowRight,
  Layers,
  Shield,
  FileCode
} from 'lucide-react';
import { ForgeButton } from '@/components/sakuga';
import { cn } from '@/lib/utils';

export interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const pathname = usePathname();

  // Sync theme state with DOM / localStorage on mount and route change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark') ||
        (!document.documentElement.classList.contains('light') && localStorage.getItem('fileforge-theme') !== 'light');
      setIsDarkMode(isDark);
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    try {
      localStorage.setItem('fileforge-theme', nextMode ? 'dark' : 'light');
    } catch (e) {}
    if (nextMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    window.dispatchEvent(new CustomEvent('fileforge:themechange', { detail: { isDark: nextMode } }));
  };

  const navLinks = [
    { label: 'Studio', href: '/studio' },
    { label: 'Queue', href: '/queue' },
    { label: 'Convert', href: '/convert' },
    { label: 'Editor & AI', href: '/editor' },
    { label: 'Transparency', href: '/transparency' },
    { label: 'Library', href: '/dashboard' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Formats', href: '/formats' },
    { label: 'Help', href: '/help' }
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans',
          isScrolled
            ? 'bg-[var(--sk-bg)]/90 backdrop-blur-xl border-b border-[var(--sk-border)] shadow-2xl shadow-black/40 py-3.5'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-2xl overflow-hidden shadow-lg shadow-violet-500/30 group-hover:shadow-pink-500/40 transition-shadow">
              <Image
                src="/app-icon.jpg"
                alt="FileForge AI"
                width={36}
                height={36}
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-[var(--sk-text)]">
                FileForge
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-500/30">
                Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[var(--sk-surface)]/80 border border-[var(--sk-border)] px-3 py-1.5 rounded-full backdrop-blur-xl shadow-lg">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md shadow-violet-950/60'
                      : 'text-[var(--sk-text-muted)] hover:text-[var(--sk-text)] hover:bg-[var(--sk-surface-raised)]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Command Palette Trigger */}
            <button
              onClick={onOpenCommandPalette}
              aria-label="Open Command Palette"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--sk-text-muted)] bg-[var(--sk-surface)] hover:bg-[var(--sk-surface-raised)] border border-[var(--sk-border)] rounded-xl transition-colors cursor-pointer group shadow-sm"
            >
              <Command className="w-3.5 h-3.5 text-violet-400" />
              <span className="hidden xl:inline">Search studio...</span>
              <kbd className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-[var(--sk-text-muted)]">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme mode"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl bg-[var(--sk-surface)] hover:bg-[var(--sk-surface-raised)] border border-[var(--sk-border)] text-[var(--sk-text)] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-violet-500 rotate-0 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* User Account / Workspace */}
            <Link href="/dashboard" className="hidden sm:inline-flex">
              <button
                aria-label="User Workspace"
                className="p-2 rounded-xl bg-[var(--sk-surface)] hover:bg-[var(--sk-surface-raised)] border border-[var(--sk-border)] text-[var(--sk-text)] transition-colors cursor-pointer shadow-sm"
              >
                <User className="w-4 h-4 text-pink-400" />
              </button>
            </Link>

            {/* Launch Studio CTA */}
            <Link href="/studio" className="hidden sm:inline-flex">
              <ForgeButton variant="primary" size="sm">
                <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                <span>Launch Studio</span>
              </ForgeButton>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[var(--sk-text-muted)] hover:text-[var(--sk-text)] bg-[var(--sk-surface)] rounded-xl border border-[var(--sk-border)] cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[68px] z-40 bg-[#09090e]/98 backdrop-blur-2xl border-b border-white/15 px-6 py-6 lg:hidden shadow-2xl flex flex-col gap-4 font-sans"
          >
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <Link
                href="/studio"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <ForgeButton variant="primary" size="md" className="w-full justify-center">
                  <span>Start Compressing</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </ForgeButton>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

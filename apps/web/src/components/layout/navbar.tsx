'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
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
import { SakugaButton } from '@/components/ui/sakuga-button';
import { cn } from '@/lib/utils';

export interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const pathname = usePathname();

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
    if (nextMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const navLinks = [
    { label: 'Studio', href: '/studio' },
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
            ? 'bg-[#09090e]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/60 py-3.5'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-pink-500/40 transition-shadow">
              <Zap className="w-5 h-5 text-white fill-white stroke-none" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">
                FileForge
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-500/30">
                Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#12121c]/80 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-xl shadow-lg">
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
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
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
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 bg-[#12121c] hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer group shadow-sm"
            >
              <Command className="w-3.5 h-3.5 text-violet-400" />
              <span className="hidden xl:inline">Search studio...</span>
              <kbd className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme mode"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-400" />}
            </button>

            {/* User Account / Workspace */}
            <Link href="/dashboard" className="hidden sm:inline-flex">
              <button
                aria-label="User Workspace"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
              >
                <User className="w-4 h-4 text-pink-400" />
              </button>
            </Link>

            {/* Launch Studio CTA */}
            <Link href="/studio" className="hidden sm:inline-flex">
              <SakugaButton variant="default" size="sm">
                <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                <span>Launch Studio</span>
              </SakugaButton>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white bg-white/5 rounded-xl border border-white/10"
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
                <SakugaButton variant="default" size="default" className="w-full justify-center">
                  <span>Start Compressing</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </SakugaButton>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

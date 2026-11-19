'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Menu,
  X,
  Command,
  FileCode,
  Shield,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SakugaButton } from '@/components/ui/sakuga-button';
import { cn } from '@/lib/utils';

export interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Studio', href: '/studio' },
    { label: 'Convert', href: '/convert' },
    { label: 'Editor & AI', href: '/editor' },
    { label: 'Transparency', href: '/transparency' },
    { label: 'Library', href: '/dashboard' },
    { label: 'Supported Formats', href: '/formats' },
    { label: 'Capabilities', href: '#features' },
    { label: 'Workflow', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-[#0a0a0f]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50 py-3.5'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
              <Zap className="w-5 h-5 text-white fill-white stroke-none" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                FileForge
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-violet-300 border border-violet-500/30">
                AI Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Command Palette Trigger */}
            <button
              onClick={onOpenCommandPalette}
              aria-label="Open Command Palette"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer group"
            >
              <Command className="w-3.5 h-3.5 text-violet-400" />
              <span>Search actions...</span>
              <kbd className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
                ⌘K
              </kbd>
            </button>

            {/* Launch App / CTA */}
            <Link href="/studio" className="hidden sm:inline-flex">
              <SakugaButton variant="default" size="sm" showSuccessCheck>
                <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                <span>Launch Studio</span>
              </SakugaButton>
            </Link>

            {/* Mobile menu button */}
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
            className="fixed inset-x-0 top-[68px] z-40 bg-[#0c0c14]/95 backdrop-blur-2xl border-b border-white/15 px-6 py-6 lg:hidden shadow-2xl flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <Link
                href="/formats"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <SakugaButton variant="default" size="default" className="w-full">
                  <span>Explore 200+ Formats</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </SakugaButton>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

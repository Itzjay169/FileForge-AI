'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Home, Layers, HelpCircle, Mail, ArrowRight, Search, FileText } from 'lucide-react';
import { ForgeButton, ForgeInput } from '@/components/sakuga';

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/formats?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Compress', href: '/studio', icon: Sparkles },
    { label: 'Convert', href: '/convert', icon: Layers },
    { label: 'Formats', href: '/formats', icon: FileText },
    { label: 'Help Center', href: '/help', icon: HelpCircle },
    { label: 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[var(--sk-bg)] text-[var(--sk-text)] flex items-center justify-center p-6 selection:bg-pink-500/25 selection:text-pink-300 relative overflow-hidden font-sans">
      {/* Background Anime Burst Glows */}
      <div className="absolute w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-pink-600/15 rounded-full blur-[120px] pointer-events-none translate-x-32 translate-y-32" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-8 bg-[var(--sk-surface)]/90 border border-[var(--sk-border)] rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-400 text-xs font-semibold font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>404 — FRAME NOT FOUND</span>
        </div>

        <div className="text-7xl sm:text-8xl font-black tracking-tighter bg-gradient-to-r from-violet-400 via-pink-500 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dimension Uncharted</h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm mx-auto">
            The page, file, or coordinate you are looking for has either expired, been purged under our 24-hour privacy policy, or was relocated.
          </p>
        </div>

        {/* Search tool */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1">
            <ForgeInput
              placeholder="Search formats or tools (e.g. PDF, WebP, MP4)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leadingIcon={<Search className="w-4 h-4 text-violet-400" />}
            />
          </div>
          <ForgeButton variant="primary" size="md" type="submit">
            Search
          </ForgeButton>
        </form>

        {/* Quick Links Grid */}
        <div className="pt-2">
          <span className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider block mb-3">
            Quick Navigation
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition-all text-left group"
                >
                  <Icon className="w-3.5 h-3.5 text-violet-400 group-hover:text-pink-400 transition-colors" />
                  <span className="font-semibold">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <Link href="/studio">
            <ForgeButton variant="primary" size="md" className="w-full justify-center">
              <span>Return to Creative Studio</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </ForgeButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

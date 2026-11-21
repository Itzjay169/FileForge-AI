'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CommandPalette } from '@/components/layout/command-palette';
import { FormatExplorer } from '@/components/formats/format-explorer';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function FormatsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || undefined;
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200">
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Studio</span>
          </Link>
        </div>

        {/* Page Title & Intro */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-primary mb-3">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Universal File-Type Registry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight font-sans">
            Supported Formats Explorer
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Search any extension across 12 distinct file categories. Inspect supported conversions,
            loss warnings, risk levels, and isolated processor engines.
          </p>
        </div>

        {/* Interactive Explorer Grid */}
        <FormatExplorer initialCategory={categoryParam} />
      </main>

      <Footer />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}

export default function FormatsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center font-mono">Loading registry...</div>}>
      <FormatsContent />
    </Suspense>
  );
}

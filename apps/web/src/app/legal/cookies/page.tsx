import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Cookie, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ForgeButton } from '@/components/sakuga';

export const metadata: Metadata = {
  title: 'Cookie Policy — FileForge AI',
  description: 'Understand how FileForge AI uses local storage and cookies strictly for essential preferences and authentication.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--sk-bg)] text-[var(--sk-text)] font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-10">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono">
            <Cookie className="w-3.5 h-3.5" />
            <span>TRANSPARENCY & STORAGE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Cookie & Local Storage Policy</h1>
          <p className="text-xs text-gray-400 font-mono">Last Updated: November 2026</p>
        </div>

        <div className="p-8 rounded-3xl bg-[var(--sk-surface)] border border-[var(--sk-border)] space-y-6 text-sm text-gray-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Zero Third-Party Advertising Trackers</h2>
            <p>
              FileForge AI does NOT use tracking cookies for marketing, ad networks, or data-brokering. We believe your file operations should remain private and unmonitored.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Essential Cookies & Local Storage</h2>
            <p>
              We utilize minimal client-side Local Storage and secure HTTP-only cookies strictly for essential system functionality:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-400 text-xs sm:text-sm pl-2">
              <li><strong>fileforge-theme:</strong> Preserves your preference between Dark Mode and Light Mode.</li>
              <li><strong>fileforge-motion:</strong> Records reduced motion preferences if toggled manually.</li>
              <li><strong>Auth Token (NextAuth):</strong> Maintains secure session credentials for authenticated workspaces.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Managing Your Browser Storage</h2>
            <p>
              You may clear your browser cookies and Local Storage at any time through your browser settings. Clearing storage will simply reset your theme to dark mode and clear active workspace sessions.
            </p>
          </section>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-gray-400">Questions about our privacy infrastructure?</span>
            <Link href="/contact">
              <ForgeButton variant="primary" size="sm">Contact Privacy Team</ForgeButton>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

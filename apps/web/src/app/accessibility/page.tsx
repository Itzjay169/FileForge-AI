import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Eye, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Accessibility Statement — FileForge AI',
  description: 'FileForge AI accessibility commitments, WCAG 2.1 AA conformance, keyboard navigation, and prefers-reduced-motion support.',
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-[var(--sk-bg)] text-[var(--sk-text)] font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-10">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono">
            <Eye className="w-3.5 h-3.5" />
            <span>INCLUSIVE DESIGN</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Accessibility Statement</h1>
          <p className="text-xs text-gray-400 font-mono">Conformance Target: WCAG 2.1 Level AA</p>
        </div>

        <div className="p-8 rounded-3xl bg-[var(--sk-surface)] border border-[var(--sk-border)] space-y-6 text-sm text-gray-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">Our Commitment</h2>
            <p>
              FileForge AI is dedicated to providing an accessible, usable experience for all creative professionals, developers, and visitors, including those utilizing screen readers, keyboard-only navigation, and assistive technologies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">Accessibility Features Implemented</h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Reduced Motion Support:</strong> The app honors <code>prefers-reduced-motion: reduce</code>. Particle bursts, smoke canvases, and spring physics are deactivated while keeping functional state changes immediate.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Visible Focus Rings:</strong> Every button, link, tab, and slider features a high-contrast 2px focus ring accessible via standard Tab key navigation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Semantic Markup & ARIA:</strong> Landmarks (<code>header</code>, <code>main</code>, <code>nav</code>, <code>footer</code>), labels, and live regions for upload percentages ensure assistive devices announce state updates.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Mobile Tap Targets:</strong> Interactive touch targets meet or exceed 44px by 44px to prevent accidental taps.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">Feedback & Assistance</h2>
            <p>
              If you experience any accessibility barrier while using FileForge AI, please submit a report at our <Link href="/report-bug" className="text-[var(--sk-pri)] hover:underline">Report a Bug</Link> desk or email us at <a href="mailto:support@fileforge.ai" className="text-[var(--sk-pri)] hover:underline">support@fileforge.ai</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

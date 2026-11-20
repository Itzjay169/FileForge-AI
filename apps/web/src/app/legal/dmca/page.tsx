import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Copyright & DMCA Policy — FileForge AI',
  description: 'DMCA copyright enforcement policy, takedown request protocols, and intellectual property protection for FileForge AI.',
};

export default function DmcaPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--sk-bg)] text-[var(--sk-text)] font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-10">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono">
            <Scale className="w-3.5 h-3.5" />
            <span>INTELLECTUAL PROPERTY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">DMCA & Copyright Compliance</h1>
          <p className="text-xs text-gray-400 font-mono">Effective: November 2026</p>
        </div>

        <div className="p-8 rounded-3xl bg-[var(--sk-surface)] border border-[var(--sk-border)] space-y-6 text-sm text-gray-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Ephemeral Processing Architecture</h2>
            <p>
              FileForge AI is a computational file processing toolkit. We do not host public file-sharing directories or search engines for user files. All files uploaded by users are stored ephemerally in isolated memory containers and purged automatically within 24 hours.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Notice and Takedown Procedure</h2>
            <p>
              If you believe content uploaded to a temporary share link on FileForge AI infringes your copyright under the Digital Millennium Copyright Act (17 U.S.C. § 512), please send a formal notice to our designated agent containing:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-400 text-xs sm:text-sm pl-2">
              <li>A physical or electronic signature of the authorized copyright owner.</li>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>The exact FileForge share URL (`/share/[code]`) of the infringing material.</li>
              <li>Your contact information (name, address, telephone number, and email).</li>
              <li>A statement of good faith belief that the use is unauthorized.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Designated DMCA Agent Contact</h2>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono space-y-1 text-gray-300">
              <p><strong>Designated Agent:</strong> Copyright Compliance Officer</p>
              <p><strong>Entity:</strong> Vexora Technology / FileForge AI</p>
              <p><strong>Email:</strong> <a href="mailto:dmca@fileforge.ai" className="text-[var(--sk-pri)] hover:underline">dmca@fileforge.ai</a></p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

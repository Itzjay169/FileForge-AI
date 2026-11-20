import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Wrench, CheckCircle2 } from 'lucide-react';
import { ForgeButton } from '@/components/sakuga';

export const metadata: Metadata = {
  title: 'Scheduled Maintenance — FileForge AI',
  description: 'FileForge AI scheduled maintenance and engine upgrade status.',
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[var(--sk-bg)] text-[var(--sk-text)] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="relative z-10 max-w-md w-full text-center space-y-6 bg-[var(--sk-surface)] border border-[var(--sk-border)] rounded-3xl p-8 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <Wrench className="w-8 h-8 animate-spin" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Scheduled Maintenance</h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Our transcode cluster is currently receiving high-performance kernel updates. All systems will resume normal throughput shortly.
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-emerald-400 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Files in processing will resume automatically</span>
        </div>
        <div className="pt-2">
          <Link href="/status">
            <ForgeButton variant="primary" size="sm">Check Status Dashboard</ForgeButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

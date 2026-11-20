import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { WifiOff, Home } from 'lucide-react';
import { ForgeButton } from '@/components/sakuga';

export const metadata: Metadata = {
  title: 'Offline — FileForge AI',
  description: 'You are currently offline. Check your network connection to resume file processing.',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[var(--sk-bg)] text-[var(--sk-text)] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="relative z-10 max-w-md w-full text-center space-y-6 bg-[var(--sk-surface)] border border-[var(--sk-border)] rounded-3xl p-8 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <WifiOff className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Network Disconnected</h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your device appears to be offline. Reconnect to Wi-Fi or cellular data to resume high-speed uploads and conversions.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <ForgeButton variant="primary" size="sm">
              <Home className="w-3.5 h-3.5 mr-1" /> Return Home
            </ForgeButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

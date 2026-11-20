'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, HelpCircle } from 'lucide-react';
import { SakugaButton } from '@/components/ui/sakuga-button';

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error captured by boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6 selection:bg-pink-500 selection:text-white relative overflow-hidden">
      <div className="absolute w-[450px] h-[450px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-6 bg-[#12121c]/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/50">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Execution Interrupted</h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            A pipeline exception interrupted this render pass. Our automated diagnostic telemetry has logged this event.
          </p>
        </div>

        {(error as Error).message && (
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-rose-300 text-left overflow-x-auto">
            {(error as Error).message}
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <SakugaButton
            variant="default"
            onClick={() => reset()}
            className="w-full sm:w-auto justify-center flex items-center gap-2 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Pipeline</span>
          </SakugaButton>
          <Link href="/studio" className="w-full sm:w-auto">
            <SakugaButton variant="secondary" className="w-full justify-center flex items-center gap-2 text-xs">
              <Home className="w-3.5 h-3.5" />
              <span>Studio Home</span>
            </SakugaButton>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <SakugaButton variant="secondary" className="w-full justify-center flex items-center gap-2 text-xs">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </SakugaButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

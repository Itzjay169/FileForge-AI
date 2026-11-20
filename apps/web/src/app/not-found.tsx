import React from 'react';
import Link from 'next/link';
import {  Sparkles, Home, Layers } from 'lucide-react';
import { SakugaButton } from '@/components/ui/sakuga-button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6 selection:bg-pink-500 selection:text-white relative overflow-hidden">
      {/* Background Anime Burst Glows */}
      <div className="absolute w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-pink-600/15 rounded-full blur-[120px] pointer-events-none translate-x-32 translate-y-32" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Format Not Located</span>
        </div>

        <div className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-r from-violet-400 via-pink-500 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl">
          404
        </div>

        <h1 className="text-2xl font-extrabold text-white">Dimension Uncharted</h1>
        <p className="text-xs text-gray-400 leading-relaxed">
          The file or coordinate you are navigating to has either expired, been purged under our 24-hour privacy policy, or was relocated.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/studio" className="w-full sm:w-auto">
            <SakugaButton variant="default" className="w-full justify-center flex items-center gap-2 text-xs">
              <Home className="w-4 h-4" />
              <span>Return to Studio</span>
            </SakugaButton>
          </Link>
          <Link href="/formats" className="w-full sm:w-auto">
            <SakugaButton variant="secondary" className="w-full justify-center flex items-center gap-2 text-xs">
              <Layers className="w-4 h-4" />
              <span>Explore Formats</span>
            </SakugaButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

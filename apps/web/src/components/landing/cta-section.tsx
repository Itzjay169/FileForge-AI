'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { SakugaButton } from '@/components/ui/sakuga-button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 relative bg-[#07070b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden border border-white/20 bg-gradient-to-tr from-[#1b122c] via-[#140e24] to-[#25102a] shadow-2xl shadow-violet-950/50 flex flex-col items-center text-center">
            {/* Background Light Leaks */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/25 rounded-full blur-[100px] pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-violet-200 mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Ready for Immediate High-Throughput Processing</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans max-w-2xl mb-4">
              Step Into the Future of Creative File Management
            </h2>

            <p className="text-sm sm:text-base text-gray-300 max-w-xl mb-10 leading-relaxed font-sans">
              No credit card. No watermarks on output. No waiting in slow synthetic queues. Experience high-velocity Sakuga responsiveness today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <Link href="#playground">
                <SakugaButton variant="default" size="lg" showSuccessCheck>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Launch FileForge Studio</span>
                </SakugaButton>
              </Link>

              <Link href="/formats">
                <SakugaButton variant="secondary" size="lg">
                  <span>Browse 100+ Formats</span>
                  <ArrowRight className="w-4 h-4" />
                </SakugaButton>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                2 GB Free Uploads
              </span>
              <span>•</span>
              <span>24h Ephemeral Auto-Shred</span>
              <span>•</span>
              <span>C2PA Authenticity Scanner</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { ForgeButton } from '@/components/sakuga';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export const CTASection: React.FC = () => {
  return (
    <section className="py-24 relative bg-[var(--sk-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden border-2 border-[var(--sk-line)] bg-[var(--sk-card)] shadow-[8px_12px_0_rgba(109,90,224,0.4)] flex flex-col items-center text-center">
            
            {/* Background Manga Speedline Texture & Light Leaks */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.035]"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #a78bfa 0, #a78bfa 1px, transparent 0, transparent 32px)'
              }}
            />
            <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Uploaded Icon Showcase Emblem */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-[var(--sk-acc)] shadow-[0_0_25px_rgba(255,95,162,0.5)] p-1 bg-black/60 mx-auto">
                <Image
                  src="/app-icon.jpg"
                  alt="FileForge AI Stamp"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[var(--sk-line)] bg-[var(--sk-surface)] text-xs font-mono font-black text-[var(--sk-acc)] mb-4 shadow-[3px_3px_0_rgba(109,90,224,0.4)]">
              <Flame className="w-3.5 h-3.5" />
              <span>[FINALE // LAUNCH DISPATCH]</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans max-w-2xl mb-4">
              Step Into High-Throughput Creative File Processing
            </h2>

            <p className="text-sm sm:text-base text-[var(--sk-text-muted)] max-w-xl mb-10 leading-relaxed font-sans font-medium">
              No credit card required. Zero watermarks on output. No waiting in synthetic queues. Experience physics-spring responsiveness and anime-grade feedback right now.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <Link href="/studio">
                <ForgeButton variant="primary" size="lg" className="px-8 shadow-[4px_6px_0_rgba(255,95,162,0.4)]">
                  <Zap className="w-4 h-4 fill-current mr-2" />
                  <span>Launch FileForge Studio</span>
                </ForgeButton>
              </Link>

              <Link href="/formats">
                <ForgeButton variant="secondary" size="lg" className="px-7 shadow-[4px_6px_0_rgba(109,90,224,0.3)]">
                  <span>Browse 200+ Formats</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </ForgeButton>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--sk-text-muted)] font-mono font-bold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                2 GB Free Uploads
              </span>
              <span>•</span>
              <span className="text-violet-300">24h Ephemeral Auto-Shred</span>
              <span>•</span>
              <span className="text-pink-400">C2PA Authenticity Scanner</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

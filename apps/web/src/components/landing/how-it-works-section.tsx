'use client';

import React from 'react';
import { UploadCloud, Sliders, Download, CheckCircle2, Flame } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: 'FRAME 01',
      title: 'Drop & Intake',
      description:
        'Drag your assets directly into the studio. Accept files up to 2 GB for free with instantaneous magic-byte validation and anti-malware verification.',
      icon: UploadCloud,
      color: 'from-violet-600 to-purple-600',
      badge: 'Zero Sign-up Required',
      specs: 'Magic-Byte Verified • ClamAV Clean'
    },
    {
      step: 'FRAME 02',
      title: 'Decimate & Forge',
      description:
        'Select Smart Compress for auto-tuned visual preservation, or slide quality, resolution, bitrate, and target size in megabytes with real-time feedback.',
      icon: Sliders,
      color: 'from-purple-600 to-pink-500',
      badge: 'Physics-Spring Sliders',
      specs: 'WebCodecs GPU Boost • CRF 1-100'
    },
    {
      step: 'FRAME 03',
      title: 'Dispatch & Shred',
      description:
        'Download your optimized asset immediately, or generate a password-protected share link with automated expiry and live view analytics.',
      icon: Download,
      color: 'from-pink-500 to-rose-500',
      badge: '24h Ephemeral Auto-Shred',
      specs: 'HMAC Signed URLs • Zero Cloud Audit'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative bg-[var(--sk-bg)] border-b-2 border-[var(--sk-line)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Manga Tag */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[var(--sk-line)] bg-[var(--sk-surface)] text-xs font-mono font-black text-[var(--sk-acc)] mb-3 shadow-[3px_3px_0_rgba(109,90,224,0.4)]">
            <Flame className="w-3.5 h-3.5" />
            <span>[ACT 05 // STORYBOARD TIMELINE]</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans">
            How FileForge Studio Operates
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--sk-text-muted)] font-medium">
            A frictionless three-stage storyboard pipeline designed for minimum latency and maximum transparency.
          </p>
        </div>

        {/* 3 Storyboard Frames */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-stretch">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.step} delay={idx * 0.15}>
                <div className="relative bg-[var(--sk-card)] border-2 border-[var(--sk-line)] rounded-3xl p-7 flex flex-col justify-between h-full shadow-[6px_8px_0_rgba(109,90,224,0.35)] hover:border-[var(--sk-acc)] hover:shadow-[6px_8px_0_rgba(255,95,162,0.4)] transition-all group">
                  
                  {/* Top Frame Tag */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[var(--sk-border)]">
                    <span className="font-mono text-xs font-black text-[var(--sk-acc)] uppercase tracking-wider">
                      [{item.step}]
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950/60 text-violet-300 border border-violet-500/30 font-bold">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    {/* Icon Box */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg shadow-violet-500/30 mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>

                    <h3 className="text-xl font-black text-white uppercase font-sans mb-3">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[var(--sk-text-muted)] leading-relaxed mb-6 font-medium">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Technical Spec Stamp */}
                  <div className="pt-4 border-t-2 border-[var(--sk-border)] flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <span className="truncate">{item.specs}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};

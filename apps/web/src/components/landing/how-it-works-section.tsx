'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Sliders, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Drop & Upload',
      description:
        'Drag your assets into the studio. We accept files up to 2 GB for free with instant magic-byte validation and anti-malware verification.',
      icon: UploadCloud,
      color: 'from-violet-600 to-purple-600',
      badge: 'Zero Sign-up Needed'
    },
    {
      step: '02',
      title: 'Forge & Tune',
      description:
        'Select Smart Compress for auto-tuned visual preservation, or manually slide quality, resolution, bitrate, and target size in megabytes.',
      icon: Sliders,
      color: 'from-purple-600 to-pink-500',
      badge: 'Interactive Sliders'
    },
    {
      step: '03',
      title: 'Download & Share',
      description:
        'Grab your optimized asset instantly. Or generate a password-protected share link with automated expiry and live view analytics.',
      icon: Download,
      color: 'from-pink-500 to-rose-500',
      badge: 'Auto-Shredded After 24h'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative bg-[#07070b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 inline-block mb-3">
            Workflow Precision
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            How FileForge AI Operates
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-400">
            A frictionless three-stage pipeline designed for minimum latency and maximum transparency.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.step} delay={idx * 0.15}>
                <div className="relative bg-[#12121c] border border-white/10 hover:border-violet-500/40 rounded-3xl p-8 flex flex-col justify-between h-full group transition-all duration-300">
                  <div>
                    {/* Top Step Row */}
                    <div className="flex items-center justify-between mb-8">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg shadow-violet-500/30`}>
                        <Icon className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <span className="text-3xl font-extrabold font-mono text-white/20 group-hover:text-violet-400/50 transition-colors">
                        {item.step}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 mb-3 inline-block">
                      {item.badge}
                    </span>

                    <h3 className="text-xl font-bold text-white mb-3 font-sans">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-1.5 text-xs text-gray-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Isolated ephemeral container</span>
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

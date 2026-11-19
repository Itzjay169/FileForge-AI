'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  RefreshCw,
  Eye,
  ShieldCheck,
  Sparkles,
  Users,
  Lock,
  Layers,
  Fingerprint,
  Cpu
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Smart Compression Engine',
      description:
        'AI rate control analyzes entropy, perceptual visual quality, and acoustic dynamics. Save up to 90% without visible artifacts. Low, Balanced, High, Extreme, and Custom sliders.',
      badge: 'Up to 90% Savings',
      badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20'
    },
    {
      icon: RefreshCw,
      title: 'Universal Conversion Matrix',
      description:
        'Cross-convert across 200+ format pairs seamlessly. Clear transparent warnings for lossy conversions (e.g. layers in PSD, macros in DOCM) so you are always in control.',
      badge: '200+ Formats',
      badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20'
    },
    {
      icon: Eye,
      title: 'Studio Preview & Live Editor',
      description:
        'Side-by-side interactive split preview for images, video frames, waveforms, and PDF pages. Crop, trim audio, split/merge PDF pages, and adjust resolution before download.',
      badge: 'Side-by-Side View',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      icon: Fingerprint,
      title: 'AI Content & Watermark Transparency',
      description:
        'Legitimate compliance module. Scans for C2PA provenance credentials, EXIF editing logs, and visible watermarks. Verified owner watermark removal with full audit trails—never evasion.',
      badge: 'C2PA & Provenance',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: Users,
      title: 'Secure Sharing & Collaboration',
      description:
        'Password-protected share links with configurable download ceilings, expiry timestamps, and QR code generations. Real-time approval statuses for creative feedback.',
      badge: 'Team Workspaces',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Trace Ephemeral Security',
      description:
        'Files are scanned for zero-day threats via ClamAV and processed in isolated memory containers. Temporary storage automatically shreds files after 24 hours (configurable for Pro).',
      badge: 'Auto-Shredded',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#07070b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 inline-block mb-3">
            Core Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            Engineered as a Precision Studio Tool
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-400">
            Built from the ground up for designers, developers, videographers, and creators who refuse to settle for generic SaaS limits.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.title} delay={i * 0.1}>
                <div className="h-full bg-gradient-to-b from-[#161622] to-[#0e0e18] border border-white/10 hover:border-violet-500/40 rounded-3xl p-7 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-950/30 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-violet-600/20 group-hover:text-violet-400 transition-all duration-300">
                        <Icon className="w-6 h-6 stroke-[2]" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${feature.badgeColor}`}>
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2.5 font-sans">
                      {feature.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-xs font-semibold text-violet-400 group-hover:text-violet-300 transition-colors">
                    <span>Explore engine capabilities</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
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

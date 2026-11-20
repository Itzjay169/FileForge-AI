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
  Cpu,
  Flame,
  ArrowUpRight,
  TrendingDown,
  Clock,
  SlidersHorizontal
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ForgeButton, ForgeTooltip } from '@/components/sakuga';
import Link from 'next/link';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[var(--sk-bg)]">
      {/* Background Manga Speed Grids */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025] bg-[radial-gradient(#ff5fa2_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Manga Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b-2 border-[var(--sk-line)] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[var(--sk-line)] bg-[var(--sk-surface)] text-xs font-mono font-black text-[var(--sk-acc)] mb-3 shadow-[3px_3px_0_rgba(109,90,224,0.4)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>[ACT 03 // ARCHITECTURE BLUEPRINT]</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans">
              Precision Engineered File Architecture
            </h2>
          </div>
          <p className="text-sm text-[var(--sk-text-muted)] max-w-md font-mono">
            Hand-directed pipeline modules designed for zero artifact degradation and maximum throughput across creative media.
          </p>
        </div>

        {/* Asymmetric Manga Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Panel A: Smart Entropy Decimation Engine (Large Hero Panel, 7 cols) */}
          <div className="lg:col-span-7 bg-[var(--sk-card)] border-2 border-[var(--sk-line)] rounded-3xl p-7 sm:p-9 shadow-[6px_8px_0_rgba(109,90,224,0.4)] flex flex-col justify-between relative group hover:border-[var(--sk-acc)] transition-all">
            <div className="absolute top-0 right-0 bg-[var(--sk-pri)] text-black font-mono font-black text-[10px] px-3.5 py-1 uppercase tracking-wider">
              PANEL 03-A // CORE
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border-2 border-[var(--sk-line)] flex items-center justify-center text-[var(--sk-acc)] mb-6 shadow-md">
                <Zap className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div className="inline-block px-2.5 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 font-mono text-xs font-bold mb-3">
                UP TO 90% BYTE SAVINGS
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-sans mb-3">
                Perceptual Rate Control Decimation
              </h3>

              <p className="text-sm text-[var(--sk-text-muted)] leading-relaxed mb-6 font-medium">
                Our rate-control engine evaluates entropy gradients, psychoacoustic dynamics, and structural color similarities. Eliminate invisible overhead while guaranteeing zero human-perceptible pixel loss.
              </p>

              {/* Visual Entropy Spectrum Graphic */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-gray-300">
                  <span className="text-[11px] uppercase font-bold text-violet-300">AV1 / WebP Rate Compression Curve</span>
                  <span className="text-emerald-400 font-bold">-84.2% Average Reduction</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
                  <div className="w-[15%] bg-emerald-500" title="Retained Perceptual Data" />
                  <div className="w-[85%] bg-rose-500/30 border-l border-rose-500/50" title="Decimated Redundant Bytes" />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Retained Master Fidelity (15.8%)</span>
                  <span>Decimated Redundancy (84.2%)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[var(--sk-border)] flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400">Includes Low, Balanced, High, Extreme, and Custom Presets</span>
              <Link href="/studio">
                <span className="text-xs font-mono font-bold text-[var(--sk-acc)] hover:underline flex items-center gap-1">
                  Launch Console <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* Panel B: Universal Transcoding Matrix (5 cols) */}
          <div className="lg:col-span-5 bg-[var(--sk-card)] border-2 border-[var(--sk-line)] rounded-3xl p-7 sm:p-8 shadow-[6px_8px_0_rgba(109,90,224,0.4)] flex flex-col justify-between relative group hover:border-[var(--sk-acc)] transition-all">
            <div className="absolute top-0 right-0 bg-[var(--sk-acc)] text-black font-mono font-black text-[10px] px-3.5 py-1 uppercase tracking-wider">
              PANEL 03-B // MATRIX
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border-2 border-[var(--sk-line)] flex items-center justify-center text-pink-400 mb-6 shadow-md">
                <RefreshCw className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div className="inline-block px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 font-mono text-xs font-bold mb-3">
                200+ COMPATIBLE PAIRS
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white uppercase font-sans mb-3">
                Cross-Format Transcoder
              </h3>

              <p className="text-sm text-[var(--sk-text-muted)] leading-relaxed mb-6 font-medium">
                Bridge incompatible ecosystems instantly. Transcode raster images to vector shapes, audio stems to compressed streams, and 3D CAD meshes to web-ready models.
              </p>

              {/* Codec Pair Chips */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <span className="text-violet-300 font-bold">RAW → AVIF</span>
                  <span className="text-[10px] text-emerald-400">Lossless</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <span className="text-pink-300 font-bold">WAV → OPUS</span>
                  <span className="text-[10px] text-emerald-400">320kbps</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <span className="text-amber-300 font-bold">DOCX → PDF/A</span>
                  <span className="text-[10px] text-emerald-400">Linear</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <span className="text-sky-300 font-bold">OBJ → GLTF</span>
                  <span className="text-[10px] text-emerald-400">Draco</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[var(--sk-border)]">
              <Link href="/convert">
                <ForgeButton variant="secondary" size="sm" className="w-full">
                  <span>Open Conversion Hub</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </ForgeButton>
              </Link>
            </div>
          </div>

          {/* Panel C: Studio Split Preview & Live Editor (4 cols) */}
          <div className="lg:col-span-4 bg-[var(--sk-card)] border-2 border-[var(--sk-line)] rounded-3xl p-6 sm:p-7 shadow-[6px_8px_0_rgba(109,90,224,0.4)] flex flex-col justify-between group hover:border-[var(--sk-acc)] transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-[var(--sk-line)] flex items-center justify-center text-cyan-400 mb-4">
                <Eye className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="text-lg font-black text-white uppercase font-sans mb-2">Split Inspection Preview</h4>
              <p className="text-xs text-[var(--sk-text-muted)] leading-relaxed font-medium">
                Side-by-side interactive split preview for video frames, waveform transients, and document spreads before saving.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--sk-border)] flex items-center justify-between text-xs font-mono text-cyan-300">
              <span>Interactive Dual Slider</span>
              <span className="font-bold">60 FPS</span>
            </div>
          </div>

          {/* Panel D: C2PA Rights & Authenticity Scanner (4 cols) */}
          <div className="lg:col-span-4 bg-[var(--sk-card)] border-2 border-[var(--sk-line)] rounded-3xl p-6 sm:p-7 shadow-[6px_8px_0_rgba(109,90,224,0.4)] flex flex-col justify-between group hover:border-[var(--sk-acc)] transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-[var(--sk-line)] flex items-center justify-center text-emerald-400 mb-4">
                <Fingerprint className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="text-lg font-black text-white uppercase font-sans mb-2">C2PA & Provenance Scanner</h4>
              <p className="text-xs text-[var(--sk-text-muted)] leading-relaxed font-medium">
                Cryptographic manifest inspection verifies authentic human capture, AI synthesis disclosures, and tamper-evident history.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--sk-border)] flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>SHA-256 Manifest</span>
              <span className="font-bold">GENUINE</span>
            </div>
          </div>

          {/* Panel E: Zero-Trace Ephemeral Shredder (4 cols) */}
          <div className="lg:col-span-4 bg-[var(--sk-card)] border-2 border-[var(--sk-line)] rounded-3xl p-6 sm:p-7 shadow-[6px_8px_0_rgba(109,90,224,0.4)] flex flex-col justify-between group hover:border-[var(--sk-acc)] transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-[var(--sk-line)] flex items-center justify-center text-rose-400 mb-4">
                <Clock className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="text-lg font-black text-white uppercase font-sans mb-2">24h Ephemeral Auto-Shred</h4>
              <p className="text-xs text-[var(--sk-text-muted)] leading-relaxed font-medium">
                Uploaded files exist only in memory sandbox pipelines. Temporary storage automatically shreds files after 24 hours with zero audit trace.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--sk-border)] flex items-center justify-between text-xs font-mono text-rose-400">
              <span>Memory Isolation</span>
              <span className="font-bold">AUTO-PURGE</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

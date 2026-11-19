'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileText,
  Video,
  Image as ImageIcon,
  Archive,
  Layers,
  CheckCircle2,
  Sliders,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import { ForgeButton } from '@/components/sakuga';
import { useReducedMotion } from '@/lib/hooks';
import { springs } from '@/lib/motion';

interface ActiveFileDemo {
  id: string;
  name: string;
  format: string;
  category: string;
  originalSize: string;
  optimizedSize: string;
  savings: string;
  progress: number;
  stage: string;
  details: string;
}

const DEMO_FILES: ActiveFileDemo[] = [
  {
    id: 'f1',
    name: 'cinematic-studio-reel.mp4',
    format: 'MP4',
    category: 'Video',
    originalSize: '48.0 MB',
    optimizedSize: '8.2 MB',
    savings: '-82.9%',
    progress: 100,
    stage: 'Web-Optimized AV1 Stream',
    details: '1920x1080 • 60fps • 2,400 kbps'
  },
  {
    id: 'f2',
    name: 'brand-editorial-raw.jpg',
    format: 'JPG',
    category: 'Image',
    originalSize: '28.4 MB',
    optimizedSize: '2.1 MB',
    savings: '-92.6%',
    progress: 100,
    stage: 'Lossless WebP Quantized',
    details: '6000x4000 • 300 DPI • ICC sRGB'
  },
  {
    id: 'f3',
    name: 'q4-investor-prospectus.pdf',
    format: 'PDF',
    category: 'Document',
    originalSize: '64.2 MB',
    optimizedSize: '6.8 MB',
    savings: '-89.4%',
    progress: 100,
    stage: 'Linearized & OCR Streamed',
    details: '48 Pages • PDF/X-1a • Encrypted'
  },
  {
    id: 'f4',
    name: 'annual-financial-audit.docx',
    format: 'DOCX',
    category: 'Document',
    originalSize: '18.6 MB',
    optimizedSize: '2.4 MB',
    savings: '-87.1%',
    progress: 100,
    stage: 'Deflated XML & Embedded Assets',
    details: 'Clean Formatting • Zero Loss'
  },
  {
    id: 'f5',
    name: 'studio-asset-archive.zip',
    format: 'ZIP',
    category: 'Archive',
    originalSize: '890.0 MB',
    optimizedSize: '245.0 MB',
    savings: '-72.5%',
    progress: 100,
    stage: 'High-Ratio Deflate64 Recompressed',
    details: '142 Files • Solid Container'
  }
];

const TICKER_FORMATS = [
  '.MP4', '.WEBP', '.PDF', '.AVIF', '.PNG', '.DOCX', '.OBJ', '.WAV',
  '.HEIC', '.ZIP', '.STL', '.XLSX', '.PPTX', '.FLAC', '.GLB', '.JSON'
];

export const HeroSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFileIndex((prev) => (prev + 1) % DEMO_FILES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentFile = DEMO_FILES[activeFileIndex];

  return (
    <section className="relative min-h-[96vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#09090e]">
      {/* Cinematic Studio Lighting: Deep Indigo & Charcoal Ambient Atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-violet-900/20 via-purple-800/15 to-pink-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-16 -left-32 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Moving Violet Energy Lines & Ambient Particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-violet-500/15 to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-pink-500/15 to-transparent" />
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-violet-300"
              style={{
                width: i % 2 === 0 ? '3px' : '2px',
                height: i % 2 === 0 ? '3px' : '2px',
                top: `${12 + (i * 11) % 76}%`,
                left: `${8 + (i * 13) % 84}%`,
                boxShadow: i % 2 === 0 ? '0 0 10px #ec4899' : '0 0 10px #8b5cf6'
              }}
              animate={{
                y: [0, -35, 0],
                opacity: [0.15, 0.85, 0.15],
                scale: [0.7, 1.4, 0.7]
              }}
              transition={{
                duration: 3.5 + i * 0.8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        {/* Studio Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/30 backdrop-blur-xl mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
          <span className="text-xs font-semibold tracking-wide text-violet-200">
            Next-Gen Cinematic Creative File Studio • Zero Generic SaaS Vibes
          </span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.06] mb-6 font-sans max-w-4xl"
        >
          Every file. <br />
          <span className="text-gradient-sakuga drop-shadow-sm">
            One creative studio.
          </span>
        </motion.h1>

        {/* Hero Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-xl text-[#9aa1b2] max-w-2xl mx-auto leading-relaxed mb-10 font-sans"
        >
          Compress, convert, optimize, preview, organize, and share files with precision.
        </motion.p>

        {/* CTA Buttons Row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          <Link href="/studio">
            <ForgeButton variant="primary" size="lg" className="px-8 shadow-2xl">
              <Zap className="w-4 h-4 text-[var(--sk-acc)] fill-[var(--sk-acc)]" />
              <span>Start Compressing</span>
            </ForgeButton>
          </Link>

          <Link href="/formats">
            <ForgeButton variant="secondary" size="lg" className="px-7">
              <span>Explore Formats</span>
              <ArrowRight className="w-4 h-4 text-[var(--sk-acc)]" />
            </ForgeButton>
          </Link>
        </motion.div>

        {/* Cinematic Live-Looking File Transformation Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-3xl rounded-3xl p-6 sm:p-8 bg-[#12121c]/95 border border-white/15 backdrop-blur-2xl shadow-2xl shadow-violet-950/60 relative overflow-hidden text-left"
        >
          {/* Top Card Bar: Selector Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {DEMO_FILES.map((file, idx) => {
                const isActive = idx === activeFileIndex;
                return (
                  <button
                    key={file.id}
                    onClick={() => setActiveFileIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg shadow-violet-900/50 scale-105'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    .{file.format}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE TRANSFORM ENGINE</span>
            </div>
          </div>

          {/* Active File Stage Presentation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFile.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-6 space-y-6"
            >
              {/* File Title and Category */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2.5">
                    {currentFile.format === 'MP4' && <Video className="w-5 h-5 text-pink-400" />}
                    {currentFile.format === 'JPG' && <ImageIcon className="w-5 h-5 text-violet-400" />}
                    {currentFile.format === 'PDF' && <FileText className="w-5 h-5 text-amber-400" />}
                    {currentFile.format === 'DOCX' && <FileText className="w-5 h-5 text-blue-400" />}
                    {currentFile.format === 'ZIP' && <Archive className="w-5 h-5 text-emerald-400" />}
                    {currentFile.name}
                  </h3>
                  <div className="text-xs text-gray-400 font-mono mt-1 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-violet-300 font-semibold">
                      {currentFile.category}
                    </span>
                    <span>•</span>
                    <span>{currentFile.details}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-sm shadow-sm shrink-0">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  <span>{currentFile.savings}</span>
                </div>
              </div>

              {/* Animated Before vs After Size Meter */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-500 font-mono">Original</div>
                    <div className="text-lg font-mono font-bold text-gray-400 line-through decoration-rose-500/80">
                      {currentFile.originalSize}
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-pink-500 animate-pulse" />

                  <div>
                    <div className="text-[10px] uppercase font-bold text-emerald-400 font-mono">Optimized</div>
                    <div className="text-xl sm:text-2xl font-mono font-black text-white">
                      {currentFile.optimizedSize}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-violet-300 font-semibold bg-violet-950/60 px-3 py-1 rounded-xl border border-violet-500/30">
                    {currentFile.stage}
                  </span>
                </div>
              </div>

              {/* Kinetic Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Processing Stage: Pipeline Complete</span>
                  <span className="text-pink-400 font-bold">100% Ready</span>
                </div>
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-600 via-pink-500 to-amber-300 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.6)]"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Format Ticker / Animated Marquee */}
        <div className="w-full max-w-4xl mt-12 overflow-hidden relative mask-radial">
          <div className="flex items-center gap-3 justify-center flex-wrap">
            <span className="text-xs text-gray-500 font-mono uppercase tracking-wider font-semibold mr-2">
              Supported Codecs & Containers:
            </span>
            {TICKER_FORMATS.map((ext, i) => (
              <span
                key={i}
                className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#12121c] border border-white/10 text-gray-300 hover:text-pink-400 hover:border-pink-500/40 transition-colors"
              >
                {ext}
              </span>
            ))}
          </div>
        </div>

        {/* Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 mt-16 max-w-3xl w-full text-center">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100+</span>
            <span className="text-xs text-gray-400 mt-1 font-sans">Formats Supported</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-violet-400 font-mono">2 GB</span>
            <span className="text-xs text-gray-400 mt-1 font-sans">Free Upload Ceiling</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-pink-400 font-mono">90%</span>
            <span className="text-xs text-gray-400 mt-1 font-sans">Max Size Savings</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">0.0s</span>
            <span className="text-xs text-gray-400 mt-1 font-sans">Client-side Latency</span>
          </div>
        </div>
      </div>
    </section>
  );
};

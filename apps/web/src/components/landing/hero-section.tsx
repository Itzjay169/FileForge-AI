'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Flame,
  Link2
} from 'lucide-react';
import { ForgeButton, ForgeInput, ForgeToggle, ForgeTooltip, forgeToast } from '@/components/sakuga';
import { useReducedMotion } from '@/lib/hooks';

interface ActiveFileDemo {
  id: string;
  name: string;
  format: string;
  category: string;
  originalSize: string;
  optimizedSize: string;
  savings: string;
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
    stage: 'AV1 Hardware Stream',
    details: '1920x1080 • 60fps • Constant Rate Factor'
  },
  {
    id: 'f2',
    name: 'brand-editorial-raw.jpg',
    format: 'JPG',
    category: 'Image',
    originalSize: '28.4 MB',
    optimizedSize: '2.1 MB',
    savings: '-92.6%',
    stage: 'Lossless WebP Quantized',
    details: '6000x4000 • 300 DPI • ICC Profile Intact'
  },
  {
    id: 'f3',
    name: 'q4-investor-prospectus.pdf',
    format: 'PDF',
    category: 'Document',
    originalSize: '64.2 MB',
    optimizedSize: '6.8 MB',
    savings: '-89.4%',
    stage: 'Linearized Fast Web Stream',
    details: '48 Pages • PDF/X-1a Standard'
  },
  {
    id: 'f4',
    name: 'studio-soundtrack-stem.wav',
    format: 'WAV',
    category: 'Audio',
    originalSize: '124.0 MB',
    optimizedSize: '22.4 MB',
    savings: '-81.9%',
    stage: 'Opus 320k Lossless Container',
    details: '48kHz 24-Bit Stereo Master'
  },
  {
    id: 'f5',
    name: 'studio-asset-archive.zip',
    format: 'ZIP',
    category: 'Archive',
    originalSize: '890.0 MB',
    optimizedSize: '245.0 MB',
    savings: '-72.5%',
    stage: 'Deflate64 Multi-Stream Recompressed',
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
  const [urlInput, setUrlInput] = useState('');
  const [gpuBoost, setGpuBoost] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFileIndex((prev) => (prev + 1) % DEMO_FILES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentFile = DEMO_FILES[activeFileIndex];

  const handleUrlFetch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      forgeToast.warning('URL Required', 'Please enter a valid media or cloud asset URL');
      return;
    }
    forgeToast.info('Asset Ingestion Initiated', `Connecting to ${urlInput.slice(0, 30)}...`);
    setTimeout(() => {
      forgeToast.success('Source Asset Mounted', 'Ready in Studio workspace for optimization');
      router.push('/studio');
    }, 1200);
  };

  // Spring transition definition for anime staged slam-in
  const slamSpring = prefersReducedMotion
    ? { duration: 0.2 }
    : { type: 'spring', stiffness: 380, damping: 22, mass: 0.9 };

  return (
    <section className="relative min-h-[96vh] flex flex-col justify-center pt-28 pb-20 overflow-hidden bg-[var(--sk-bg)]">
      {/* Background Manga Speedline Grids & Film Lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#6d5ae0_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Diagonal Speedline Streaks */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #a78bfa 0, #a78bfa 1px, transparent 0, transparent 40px)'
        }}
      />

      {/* Atmospheric Glow Spheres */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Asymmetric Manga Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Hand-Crafted Studio Typography & Controls (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Manga Scene Tag & Live Telemetry */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={slamSpring}
              className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-none border-2 border-[var(--sk-line)] bg-[var(--sk-surface)] shadow-[4px_4px_0_rgba(109,90,224,0.4)] mb-8"
            >
              <span className="w-2.5 h-2.5 bg-[var(--sk-acc)] animate-ping" />
              <span className="text-xs font-mono font-black tracking-widest text-[var(--sk-text)] uppercase">
                [SCENE 01 // PRODUCTION DISPATCH]
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-[var(--sk-pri)] text-black">
                LATENCY: 0.0s
              </span>
            </motion.div>

            {/* Confident Asymmetric Display Headline */}
            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, x: -40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ ...slamSpring, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white uppercase leading-[0.96] mb-6 font-sans"
            >
              EVERY FILE. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300 drop-shadow-[0_4px_20px_rgba(255,95,162,0.4)]">
                CRUSHED & FORGED.
              </span>
            </motion.h1>

            {/* Editorial Subheadline */}
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...slamSpring, delay: 0.2 }}
              className="text-base sm:text-xl text-[var(--sk-text-muted)] max-w-xl leading-relaxed mb-8 font-sans font-medium"
            >
              Anime-responsive creative file studio. Decimate file weight up to 90%, cross-transcode across 200+ format pairs, and automate pipelines with physics-grade spring dynamics.
            </motion.p>

            {/* Rapid URL Intake Form Using ForgeInput and ForgeButton */}
            <motion.form
              onSubmit={handleUrlFetch}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...slamSpring, delay: 0.25 }}
              className="w-full max-w-lg mb-8 p-3 rounded-2xl bg-[var(--sk-surface)] border-2 border-[var(--sk-line)] shadow-[4px_6px_0_rgba(109,90,224,0.35)] flex flex-col sm:flex-row gap-2.5 items-stretch"
            >
              <div className="flex-1">
                <ForgeInput
                  placeholder="Paste Figma, Drive, or raw media URL..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full text-xs"
                />
              </div>
              <ForgeButton type="submit" variant="primary" size="sm" className="whitespace-nowrap shrink-0">
                <Link2 className="w-3.5 h-3.5 mr-1" />
                <span>Fetch & Forge</span>
              </ForgeButton>
            </motion.form>

            {/* Primary Action Buttons */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...slamSpring, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <Link href="/studio">
                <ForgeButton variant="primary" size="lg" className="px-8 text-base shadow-[4px_6px_0_rgba(255,95,162,0.4)]">
                  <Zap className="w-4 h-4 fill-current mr-2" />
                  <span>Launch File Studio</span>
                </ForgeButton>
              </Link>

              <Link href="/formats">
                <ForgeButton variant="secondary" size="lg" className="px-7 text-base shadow-[4px_6px_0_rgba(109,90,224,0.3)]">
                  <span>Explore 200+ Codecs</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </ForgeButton>
              </Link>
            </motion.div>

            {/* Physical Stamp Highlights */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-5 text-xs font-mono font-bold text-[var(--sk-text-muted)]"
            >
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                2 GB FREE UPLOADS
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-violet-300">
                <Flame className="w-4 h-4 text-pink-400" />
                C2PA PROVENANCE VERIFIED
              </span>
              <span>•</span>
              <span className="text-amber-300">
                24H AUTO-SHRED GUARANTEE
              </span>
            </motion.div>
          </div>

          {/* Right Column: Tilted Manuscript Console with User's Uploaded Icon Emblem (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, rotate: 3, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, rotate: 1.5, scale: 1, y: 0 }}
              whileHover={prefersReducedMotion ? {} : { rotate: 0, scale: 1.02 }}
              transition={{ ...slamSpring, delay: 0.2 }}
              className="relative p-6 sm:p-7 rounded-3xl bg-[var(--sk-card)] border-2 border-[var(--sk-line)] shadow-[8px_10px_0_rgba(109,90,224,0.45)] backdrop-blur-2xl overflow-hidden"
            >
              {/* Corner Manga Tag */}
              <div className="absolute top-0 right-0 bg-[var(--sk-acc)] text-black font-mono font-black text-[10px] px-3 py-1 uppercase tracking-wider transform translate-x-1 -translate-y-0 shadow-md">
                FORGE_CORE // V2.4
              </div>

              {/* Central Graphic Showcase: Featured Uploaded App Icon with Orbiting Format Chips */}
              <div className="relative py-6 flex flex-col items-center justify-center">
                
                {/* Glowing Outer Rings Matching Icon Color Scheme */}
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 opacity-30 blur-2xl animate-pulse" />
                  
                  {/* Neon Framed Icon Container */}
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-[var(--sk-acc)] shadow-[0_0_30px_rgba(255,95,162,0.4)] bg-black/80 p-1">
                    <Image
                      src="/app-icon.jpg"
                      alt="FileForge AI Core Emblem"
                      width={176}
                      height={176}
                      className="w-full h-full object-cover rounded-2xl"
                      priority
                    />
                  </div>

                  {/* Physical Format Badges Orbiting the Central Zip Icon */}
                  {/* PDF Badge (Red) */}
                  <motion.div
                    animate={prefersReducedMotion ? {} : { y: [-3, 3, -3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-2 -right-2 px-2.5 py-1 rounded-xl bg-rose-600 text-white font-mono font-black text-[11px] shadow-lg border border-rose-300"
                  >
                    .PDF
                  </motion.div>

                  {/* Image Badge (Cyan) */}
                  <motion.div
                    animate={prefersReducedMotion ? {} : { y: [3, -3, 3] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/2 -right-5 px-2.5 py-1 rounded-xl bg-sky-500 text-white font-mono font-black text-[11px] shadow-lg border border-sky-200"
                  >
                    .WEBP
                  </motion.div>

                  {/* Video Badge (Green) */}
                  <motion.div
                    animate={prefersReducedMotion ? {} : { y: [-2, 4, -2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -bottom-2 right-4 px-2.5 py-1 rounded-xl bg-emerald-500 text-white font-mono font-black text-[11px] shadow-lg border border-emerald-200"
                  >
                    .AV1
                  </motion.div>

                  {/* Audio Badge (Orange) */}
                  <motion.div
                    animate={prefersReducedMotion ? {} : { y: [2, -3, 2] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -bottom-2 -left-2 px-2.5 py-1 rounded-xl bg-amber-500 text-white font-mono font-black text-[11px] shadow-lg border border-amber-200"
                  >
                    .FLAC
                  </motion.div>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-xs font-mono font-bold text-violet-300">
                    UNIVERSAL FILE PIPELINE MATRIX
                  </span>
                </div>
              </div>

              {/* Interactive Hardware Acceleration Control */}
              <div className="mt-4 pt-4 border-t-2 border-[var(--sk-border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-pink-400" />
                    WebCodecs GPU Acceleration
                  </span>
                  <ForgeTooltip text="Enables direct client-side WebAssembly and GPU shaders to maximize transcode speeds without cloud latency." />
                </div>
                <ForgeToggle
                  checked={gpuBoost}
                  onChange={setGpuBoost}
                />
              </div>

              {/* Live Active File Card Stage */}
              <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-white truncate max-w-[200px]">
                    {currentFile.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                    {currentFile.savings}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-[var(--sk-text-muted)]">
                  <span className="line-through decoration-rose-500/80">{currentFile.originalSize}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--sk-acc)]" />
                  <span className="font-bold text-white">{currentFile.optimizedSize}</span>
                  <span className="text-[10px] text-violet-300 font-semibold">{currentFile.stage}</span>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

        {/* Ticker / Format Matrix Banner */}
        <div className="w-full mt-16 pt-8 border-t-2 border-[var(--sk-border)] flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-mono font-black uppercase tracking-widest text-[var(--sk-text-muted)]">
            READY CONTAINER FORMATS:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {TICKER_FORMATS.map((fmt) => (
              <span
                key={fmt}
                className="font-mono text-xs font-bold px-2.5 py-1 bg-[var(--sk-surface)] border border-[var(--sk-border)] text-[var(--sk-text)] hover:border-[var(--sk-acc)] hover:text-[var(--sk-acc)] transition-colors cursor-default"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

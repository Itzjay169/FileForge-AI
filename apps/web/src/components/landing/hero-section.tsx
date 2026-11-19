'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Zap,
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileCheck,
  CheckCircle,
  Sliders,
  Play
} from 'lucide-react';
import { SakugaButton } from '@/components/ui/sakuga-button';
import { useReducedMotion } from '@/lib/hooks';

export const HeroSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isHoveringDropzone, setIsHoveringDropzone] = useState(false);
  const router = useRouter();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Anime Energy VFX Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-violet-600/20 via-purple-600/15 to-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-pink-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Particle Stars */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-violet-300 rounded-full shadow-[0_0_8px_#c084fc]"
              style={{
                top: `${15 + i * 14}%`,
                left: `${10 + (i * 17) % 80}%`
              }}
              animate={{
                y: [0, -25, 0],
                opacity: [0.2, 0.9, 0.2],
                scale: [0.8, 1.4, 0.8]
              }}
              transition={{
                duration: 3 + i * 0.7,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-violet-500/10 border border-violet-500/30 backdrop-blur-md mb-8 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-xs font-medium text-violet-200">
            Next-Gen Anime-Responsive File Studio • Zero Generic SaaS Vibes
          </span>
        </motion.div>

        {/* Cinematic Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6 font-sans"
        >
          Compress. Convert. <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Forge Any File.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10 font-sans"
        >
          High-performance engine supporting 12 categories and 100+ file extensions.
          Reduce size up to 90%, batch transcode lossless media, and preview assets with Sakuga-inspired impact.
        </motion.p>

        {/* Action Button Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          <Link href="/studio">
            <SakugaButton variant="default" size="lg" showSuccessCheck>
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Studio</span>
            </SakugaButton>
          </Link>

          <Link href="/formats">
            <SakugaButton variant="secondary" size="lg">
              <span>Supported Formats (200+)</span>
              <ArrowRight className="w-4 h-4" />
            </SakugaButton>
          </Link>
        </motion.div>

        {/* Live Dropzone Interactive Teaser Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-violet-950/40 relative group overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHoveringDropzone(true)}
          onMouseLeave={() => setIsHoveringDropzone(false)}
          onClick={() => router.push('/studio')}
        >
          <div className="border-2 border-dashed border-white/20 group-hover:border-violet-400/60 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer bg-black/20">
            <motion.div
              animate={isHoveringDropzone && !prefersReducedMotion ? { y: -5, scale: 1.08 } : { y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/40"
            >
              <UploadCloud className="w-7 h-7 text-white stroke-[2.2]" />
            </motion.div>

            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-base font-semibold text-white">
                Drop your file here, or{' '}
                <span className="text-violet-400 underline underline-offset-4">browse files</span>
              </span>
              <span className="text-xs text-gray-400">
                Supports video, images, audio, docs, 3D meshes & code up to 2 GB for free
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                .MP4
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                .HEIC
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                .PDF
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                .DOCX
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                .OBJ
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                .WAV
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Ticker Counter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 mt-14 max-w-3xl w-full text-center">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100+</span>
            <span className="text-xs text-gray-400 mt-0.5">Formats Supported</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-violet-400 font-mono">2 GB</span>
            <span className="text-xs text-gray-400 mt-0.5">Free Upload Ceiling</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-pink-400 font-mono">90%</span>
            <span className="text-xs text-gray-400 mt-0.5">Max Size Savings</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">0.0s</span>
            <span className="text-xs text-gray-400 mt-0.5">Client-side Latency</span>
          </div>
        </div>
      </div>
    </section>
  );
};

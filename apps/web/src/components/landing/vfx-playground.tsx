'use client';

import { ForgeButton, ForgeCheckbox, ForgeInput, ForgeProgress, ForgeSlider, ForgeTabs, forgeToast, ForgeToggle } from '@/components/sakuga';
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Bell,
  Play,
  Flame,
  FileCode,
  Gauge
} from 'lucide-react';
export const VFXPlayground: React.FC = () => {
  const [quality, setQuality] = useState(82);
  const [targetSize, setTargetSize] = useState(45);
  const [progress, setProgress] = useState(68);
  const [smartCompress, setSmartCompress] = useState(true);
  const [stripMetadata, setStripMetadata] = useState(true);
  const [ocrEnabled, setOcrEnabled] = useState(false);
  const [sampleInput, setSampleInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('images');
  const handleCategoryChange = useCallback((id: string) => setActiveCategory(id), []);

  const simulateProcessing = () => {
    setIsProcessing(true);
    setProgress(15);
    forgeToast.info('Processing Job Initiated', 'Allocating isolated worker container...');

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setProgress(100);
            setIsProcessing(false);
            forgeToast.success('Job Complete! (ドン!)', 'File reduced by 78.4% (14.2 MB -> 3.1 MB)');
          }, 300);
          return 95;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <section id="playground" className="py-24 relative overflow-hidden bg-[#0c0c14] border-y border-white/10">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-medium text-violet-300 mb-3">
            <Flame className="w-3.5 h-3.5 text-pink-400" />
            <span>Interactive VFX Studio Engine</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            Feel the Sakuga-Inspired Control System
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-400">
            Every button squashes on press and explodes on release. Every slider stretches like a teardrop.
            Interact with the live controls below to experience the responsive feedback.
          </p>
        </div>

        {/* Studio Bento Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Compression Studio (Paper-like Card) */}
          <div className="lg:col-span-7 bg-[#141420] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Live Compression Inspector</h3>
                  <p className="text-xs text-gray-400">Configured preset: Smart Lossless Quantization</p>
                </div>
              </div>

              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                ● READY
              </span>
            </div>

            {/* Sliders Area */}
            <div className="space-y-6">
              <div>
                <ForgeSlider
                  label="Visual Quality Preservation (CRF / Bitrate)"
                  value={quality}
                  onChange={setQuality}
                  variant="quality"
                  unit="%"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Estimated output: {Math.max(1, Math.round(18.5 * (quality / 100)))} MB (Savings: ~{100 - quality}%)
                </span>
              </div>

              <div>
                <ForgeSlider
                  label="Target File Size Ceiling"
                  value={targetSize}
                  onChange={setTargetSize}
                  variant="size"
                  unit=" MB"
                />
              </div>

              {/* Progress Bar with Simulation */}
              <div className="pt-2">
                <ForgeProgress
                  value={progress}
                  showLabel
                  label={isProcessing ? 'Transcoding Frames in Worker Sandbox...' : 'Queue Buffer Status'}
                  variant="plasma"
                />
              </div>

              {/* Toggles and Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <ForgeToggle
                  checked={smartCompress}
                  onChange={setSmartCompress}
                  label="Smart Compress"
                  description="Auto-detect perceptual quality"
                />
                <ForgeToggle
                  checked={stripMetadata}
                  onChange={setStripMetadata}
                  label="Strip EXIF & Location"
                  description="Enhance privacy & reduce size"
                />
                <ForgeCheckbox
                  checked={ocrEnabled}
                  onChange={setOcrEnabled}
                  label="Enable OCR Text Extraction"
                  description="Convert scanned images to selectable text"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
                <ForgeButton variant="primary"
                  size="md"
                  isLoading={isProcessing}
                  onClick={simulateProcessing}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Execute Compress (Squash & Burst)</span>
                </ForgeButton>

                <ForgeButton
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setProgress(0);
                    forgeToast.info('Settings Reset', 'Default presets restored');
                  }}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Sliders</span>
                </ForgeButton>
              </div>
            </div>
          </div>

          {/* Right Column: Sakuga Component Showcase */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Tabbed Interactive Control */}
            <div className="bg-[#141420] border border-white/15 rounded-3xl p-6 shadow-xl">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-violet-400" />
                Animated Category Tabs
              </h4>

              <ForgeTabs
                tabs={[
                  { id: 'images', label: 'Images' },
                  { id: 'video', label: 'Video' },
                  { id: 'docs', label: 'Docs' },
                  { id: '3d', label: '3D/CAD' },
                ]}
                activeTab={activeCategory}
                onChange={handleCategoryChange}
                ariaLabel="File Format Categories"
              />

              <div className="mt-4">
                {activeCategory === 'images' && (
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-gray-300 space-y-2">
                    <p className="font-semibold text-white">Sharp Native Image Pipeline</p>
                    <p>Converts HEIC, RAW, AVIF, WebP, PNG, JPG with dynamic color quantization.</p>
                  </div>
                )}
                {activeCategory === 'video' && (
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-gray-300 space-y-2">
                    <p className="font-semibold text-white">FFmpeg 2-Pass Rate Control</p>
                    <p>Hardware-accelerated transcoding for MP4, MOV, MKV, ProRes & WebM.</p>
                  </div>
                )}
                {activeCategory === 'docs' && (
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-gray-300 space-y-2">
                    <p className="font-semibold text-white">Ghostscript & LibreOffice Headless</p>
                    <p>Full PDF linearizing, stream compression, and DOCX/ODT conversion.</p>
                  </div>
                )}
                {activeCategory === '3d' && (
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-gray-300 space-y-2">
                    <p className="font-semibold text-white">Three.js & Mesh Simplification</p>
                    <p>Polygon decimation for OBJ, STL, GLTF, and STEP engineering CAD.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Toast Triggers Test Card */}
            <div className="bg-[#141420] border border-white/15 rounded-3xl p-6 shadow-xl">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Bell className="w-4 h-4 text-pink-400" />
                Animated Toasts Showcase
              </h4>
              <p className="text-xs text-gray-400 mb-4">
                Trigger animated status toasts with custom sound & visual flare.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <ForgeButton
                  variant="secondary"
                  size="sm"
                  onClick={() => forgeToast.success('Compression Finished', 'Saved 12.4 MB (64%)')}
                >
                  Success Toast
                </ForgeButton>
                <ForgeButton
                  variant="secondary"
                  size="sm"
                  onClick={() => forgeToast.error('Corrupted Header Detected', 'Please re-upload original file')}
                >
                  Error Toast
                </ForgeButton>
                <ForgeButton
                  variant="secondary"
                  size="sm"
                  onClick={() => forgeToast.warning('Lossy Conversion Warning', 'VBA macros will be stripped')}
                >
                  Warning Toast
                </ForgeButton>
                <ForgeButton
                  variant="secondary"
                  size="sm"
                  onClick={() => forgeToast.info('Worker Scaling Up', 'Processing assigned to Fast-Lane 03')}
                >
                  Info Toast
                </ForgeButton>
              </div>
            </div>

            {/* Input with Electric Glow */}
            <div className="bg-[#141420] border border-white/15 rounded-3xl p-6 shadow-xl">
              <h4 className="text-sm font-bold text-white mb-2">Animated Input Control</h4>
              <ForgeInput
                label="Watermark Text Embedding"
                placeholder="© 2024 Your Studio Name..."
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

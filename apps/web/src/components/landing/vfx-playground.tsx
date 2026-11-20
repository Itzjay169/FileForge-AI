'use client';

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
  Gauge,
  SlidersHorizontal,
  Shield,
  Layers,
  HelpCircle,
  Star
} from 'lucide-react';
import {
  ForgeButton,
  ForgeCheckbox,
  ForgeInput,
  ForgeProgress,
  ForgeRadioGroup,
  ForgeRating,
  ForgeSlider,
  ForgeTabs,
  ForgeToggle,
  ForgeTooltip,
  forgeToast
} from '@/components/sakuga';

export const VFXPlayground: React.FC = () => {
  const [quality, setQuality] = useState(82);
  const [targetSize, setTargetSize] = useState(45);
  const [progress, setProgress] = useState(68);
  const [smartCompress, setSmartCompress] = useState(true);
  const [stripMetadata, setStripMetadata] = useState(true);
  const [ocrEnabled, setOcrEnabled] = useState(false);
  const [linearizeStream, setLinearizeStream] = useState(true);
  const [profile, setProfile] = useState('balanced');
  const [watermark, setWatermark] = useState('');
  const [studioRating, setStudioRating] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('images');

  const handleCategoryChange = useCallback((id: string) => setActiveCategory(id), []);

  const simulateProcessing = () => {
    setIsProcessing(true);
    setProgress(10);
    forgeToast.info('Processing Pipeline Initiated', 'Allocating isolated worker sandbox container...');

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setProgress(100);
            setIsProcessing(false);
            forgeToast.success('Job Complete!', 'File reduced by 78.4% (14.2 MB -> 3.1 MB)');
          }, 350);
          return 95;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleRatingChange = (val: number) => {
    setStudioRating(val);
    forgeToast.success('Feedback Recorded', `Studio Quality rated ${val} / 5 stars`);
  };

  return (
    <section id="playground" className="py-24 relative overflow-hidden bg-[var(--sk-bg)] border-y-2 border-[var(--sk-line)]">
      {/* Background Manga Grids */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#6d5ae0_1px,transparent_1px)] [background-size:20px_20px]" />
      
      {/* Soft Glow Accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Manga Tag */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[var(--sk-line)] bg-[var(--sk-surface)] text-xs font-mono font-black text-[var(--sk-acc)] mb-4 shadow-[3px_3px_0_rgba(109,90,224,0.4)]">
            <Flame className="w-3.5 h-3.5" />
            <span>[ACT 02 // SAKUGA KINETIC ENGINE]</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans">
            Interactive Transcoding Studio Console
          </h2>
          
          <p className="mt-4 text-sm sm:text-base text-[var(--sk-text-muted)] font-medium">
            Every button squashes on press and explodes on release. Every slider stretches like a teardrop.
            Interact with all 11 live Sakuga VFX components below to feel the physical feedback.
          </p>
        </div>

        {/* Studio Bento Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Compression Controls & Sliders (7 Cols) */}
          <div className="lg:col-span-7 bg-[var(--sk-card)] border-2 border-[var(--sk-line)] rounded-3xl p-6 sm:p-8 shadow-[6px_8px_0_rgba(109,90,224,0.4)] relative">
            
            {/* Header Strip */}
            <div className="flex items-center justify-between pb-6 border-b-2 border-[var(--sk-border)] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-[var(--sk-line)] flex items-center justify-center text-[var(--sk-pri)]">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-sans uppercase">Live Rate Control Console</h3>
                  <p className="text-xs text-[var(--sk-text-muted)] font-mono">Dynamic multi-pass entropy quantization</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2.5 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                  ● PIPELINE ACTIVE
                </span>
                <ForgeTooltip text="Real-time WebAssembly worker running in an isolated secure sandbox." />
              </div>
            </div>

            {/* Transcoding Profile Selector Using ForgeRadioGroup */}
            <div className="mb-6 pb-6 border-b-2 border-[var(--sk-border)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-white uppercase font-sans">Transcoding Profile</span>
                <ForgeTooltip text="Select target profile to automatically calibrate rate-control curves and codec presets." />
              </div>
              <ForgeRadioGroup
                name="transcodeProfile"
                value={profile}
                onChange={setProfile}
                options={[
                  { value: 'balanced', label: 'Balanced Web', description: 'WebP + AV1, fastest decoding speed', badge: 'Recommended' },
                  { value: 'lossless', label: 'Lossless Master', description: 'PNG + FLAC + PDF/A, zero fidelity loss', badge: 'Archival' },
                  { value: 'crush', label: 'Ultra Decimate', description: 'Extreme 90% size reduction for quick mobile delivery', badge: 'Crush' }
                ]}
              />
            </div>

            {/* Sliders Area Using ForgeSlider */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-white">Visual Quality Preservation (CRF)</span>
                    <ForgeTooltip text="Lower CRF produces higher visual fidelity; higher CRF dramatically crushes byte weight." />
                  </div>
                  <span className="text-xs font-mono font-black text-[var(--sk-acc)]">{quality}%</span>
                </div>
                <ForgeSlider
                  label="Quality Preservation Ratio"
                  value={quality}
                  onChange={setQuality}
                  variant="quality"
                  unit="%"
                />
                <span className="text-[11px] text-[var(--sk-text-muted)] font-mono mt-1 block">
                  Estimated output: {Math.max(1, Math.round(18.5 * (quality / 100)))} MB (Savings: ~{100 - quality}%)
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-white">Target File Size Ceiling</span>
                    <ForgeTooltip text="Hard cap on output buffer size. Codec will scale resolution or downsample if needed." />
                  </div>
                  <span className="text-xs font-mono font-black text-violet-400">{targetSize} MB</span>
                </div>
                <ForgeSlider
                  label="Maximum File Size Ceiling"
                  value={targetSize}
                  onChange={setTargetSize}
                  variant="size"
                  unit=" MB"
                />
              </div>

              {/* Progress Bar with Simulation Using ForgeProgress */}
              <div className="pt-2">
                <ForgeProgress
                  value={progress}
                  showLabel
                  label={isProcessing ? 'Transcoding Frames in Worker Sandbox...' : 'Worker Pipeline Buffer'}
                  variant="plasma"
                />
              </div>

              {/* Toggles and Checkboxes Using ForgeToggle & ForgeCheckbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t-2 border-[var(--sk-border)]">
                <ForgeToggle
                  checked={smartCompress}
                  onChange={setSmartCompress}
                  label="Smart Perceptual Mode"
                  description="Auto-detect perceptual entropy"
                />
                <ForgeToggle
                  checked={stripMetadata}
                  onChange={setStripMetadata}
                  label="Strip EXIF & Geo Data"
                  description="Maximize privacy & save header bytes"
                />
                <ForgeCheckbox
                  checked={ocrEnabled}
                  onChange={setOcrEnabled}
                  label="Enable OCR Text Layer"
                  description="Extract searchable text from document scans"
                />
                <ForgeCheckbox
                  checked={linearizeStream}
                  onChange={setLinearizeStream}
                  label="Linearize Fast Streaming"
                  description="Optimize PDF and MP4 for instant browser playback"
                />
              </div>

              {/* Action Buttons Using ForgeButton */}
              <div className="flex flex-wrap items-center gap-3 pt-6 border-t-2 border-[var(--sk-border)]">
                <ForgeButton
                  variant="primary"
                  size="md"
                  isLoading={isProcessing}
                  onClick={simulateProcessing}
                  className="shadow-[3px_4px_0_rgba(255,95,162,0.4)]"
                >
                  <Zap className="w-4 h-4 fill-current mr-1" />
                  <span>Execute Transcoding Pipeline</span>
                </ForgeButton>

                <ForgeButton
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setProgress(0);
                    forgeToast.info('Presets Reset', 'Standard production values restored');
                  }}
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  <span>Reset Controls</span>
                </ForgeButton>
              </div>
            </div>
          </div>

          {/* Right Column: Category Tabs, Toasts, Input, and Rating (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Animated Category Tabs Using ForgeTabs */}
            <div className="bg-[var(--sk-card)] border-2 border-[var(--sk-line)] rounded-3xl p-6 shadow-[6px_8px_0_rgba(109,90,224,0.4)]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black text-white uppercase font-sans flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-violet-400" />
                  Animated Format Tabs
                </h4>
                <ForgeTooltip text="Tab switches trigger fluid smear animations and switch backend transcoding modules." />
              </div>

              <ForgeTabs
                tabs={[
                  { id: 'images', label: 'Images' },
                  { id: 'video', label: 'Video' },
                  { id: 'docs', label: 'Docs' },
                  { id: '3d', label: '3D/CAD' }
                ]}
                activeTab={activeCategory}
                onChange={handleCategoryChange}
                ariaLabel="File Format Categories"
              />

              <div className="mt-4">
                {activeCategory === 'images' && (
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs text-[var(--sk-text-muted)] space-y-1 font-mono">
                    <p className="font-bold text-white uppercase">Sharp Native Image Pipeline</p>
                    <p>Converts HEIC, RAW, AVIF, WebP, PNG, JPG with dynamic color quantization.</p>
                  </div>
                )}
                {activeCategory === 'video' && (
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs text-[var(--sk-text-muted)] space-y-1 font-mono">
                    <p className="font-bold text-white uppercase">FFmpeg 2-Pass Rate Control</p>
                    <p>Hardware-accelerated transcoding for MP4, MOV, MKV, ProRes and WebM.</p>
                  </div>
                )}
                {activeCategory === 'docs' && (
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs text-[var(--sk-text-muted)] space-y-1 font-mono">
                    <p className="font-bold text-white uppercase">Ghostscript & Headless Engine</p>
                    <p>Full PDF linearizing, stream compression, and DOCX/ODT conversion.</p>
                  </div>
                )}
                {activeCategory === '3d' && (
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs text-[var(--sk-text-muted)] space-y-1 font-mono">
                    <p className="font-bold text-white uppercase">Three.js Mesh Decimation</p>
                    <p>Polygon decimation for OBJ, STL, GLTF, and STEP engineering CAD models.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Input with Electric Glow Using ForgeInput */}
            <div className="bg-[var(--sk-card)] border-2 border-[var(--sk-line)] rounded-3xl p-6 shadow-[6px_8px_0_rgba(109,90,224,0.4)]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-black text-white uppercase font-sans">Watermark Text Embedding</h4>
                <ForgeTooltip text="Injects cryptographic copyright and author credentials into media frames." />
              </div>
              <ForgeInput
                label="Custom Watermark Label"
                placeholder="2024 Your Studio Name..."
                value={watermark}
                onChange={(e) => setWatermark(e.target.value)}
              />
            </div>

            {/* Real Sakuga VFX Rating Component Using ForgeRating */}
            <div className="bg-[var(--sk-card)] border-2 border-[var(--sk-line)] rounded-3xl p-6 shadow-[6px_8px_0_rgba(109,90,224,0.4)]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black text-white uppercase font-sans flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  Studio Quality Inspector Rating
                </h4>
                <ForgeTooltip text="Interactive star rating component with five-star animated burst effect." />
              </div>
              <p className="text-xs text-[var(--sk-text-muted)] mb-3 font-mono">
                Click a star to grade transcoding output quality and trigger particle burst:
              </p>
              <ForgeRating
                label="Transcoding Output Fidelity Score"
                value={studioRating}
                onChange={handleRatingChange}
              />
            </div>

            {/* Animated Toast Trigger Deck Using forgeToast */}
            <div className="bg-[var(--sk-card)] border-2 border-[var(--sk-line)] rounded-3xl p-6 shadow-[6px_8px_0_rgba(109,90,224,0.4)]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-black text-white uppercase font-sans flex items-center gap-2">
                  <Bell className="w-4 h-4 text-pink-400" />
                  Animated Toast Deck
                </h4>
                <ForgeTooltip text="Sakuga toasts animate with physical smear entrance, pop sound styling, and auto-dismiss." />
              </div>
              <p className="text-xs text-[var(--sk-text-muted)] mb-4 font-mono">
                Trigger real animated status toasts with smear animation:
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <ForgeButton
                  variant="secondary"
                  size="sm"
                  onClick={() => forgeToast.success('Compression Finished', 'Saved 12.4 MB (64% reduction)')}
                >
                  Success Toast
                </ForgeButton>
                <ForgeButton
                  variant="secondary"
                  size="sm"
                  onClick={() => forgeToast.error('Corrupted Header Detected', 'Please re-upload intact original file')}
                >
                  Error Toast
                </ForgeButton>
                <ForgeButton
                  variant="secondary"
                  size="sm"
                  onClick={() => forgeToast.warning('Lossy Conversion Warning', 'VBA macros will be stripped from container')}
                >
                  Warning Toast
                </ForgeButton>
                <ForgeButton
                  variant="secondary"
                  size="sm"
                  onClick={() => forgeToast.info('Worker Allocated', 'Assigned to High-Throughput Node 07')}
                >
                  Info Toast
                </ForgeButton>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

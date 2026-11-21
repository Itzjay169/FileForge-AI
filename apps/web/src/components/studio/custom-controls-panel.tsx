'use client';

import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Settings2,
  Target,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  Zap,
  Info
} from 'lucide-react';
import { useUploadStore, PLATFORM_PRESETS, PERCENTAGE_REDUCTIONS } from '@/lib/stores/upload-store';
import { useReducedMotion } from '@/lib/hooks';
import { ForgeSlider } from '@/components/sakuga/forge-slider';
import { ForgeToggle } from '@/components/sakuga/forge-toggle';
import { ForgeButton } from '@/components/sakuga/forge-button';
import { ForgeTooltip } from '@/components/sakuga/forge-tooltip';
import { cn, formatFileSize } from '@/lib/utils';

const OUTPUT_FORMATS = [
  { value: '', label: 'Auto (keep original)' },
  { value: 'webp', label: 'WebP (Recommended for images)' },
  { value: 'jpg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
  { value: 'avif', label: 'AVIF (Highest compression)' },
  { value: 'pdf', label: 'PDF' },
  { value: 'mp4', label: 'MP4' },
  { value: 'mp3', label: 'MP3' },
  { value: 'zip', label: 'ZIP' },
] as const;

export const CustomControlsPanel: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const idPrefix = useId();
  const activePreset = useUploadStore((s) => s.activePreset);
  const customOptions = useUploadStore((s) => s.customOptions);
  const updateCustomOptions = useUploadStore((s) => s.updateCustomOptions);

  // Target size store
  const isTargetSizeMode = useUploadStore((s) => s.isTargetSizeMode);
  const targetSizeValue = useUploadStore((s) => s.targetSizeValue);
  const targetSizeUnit = useUploadStore((s) => s.targetSizeUnit);
  const targetMode = useUploadStore((s) => s.targetMode);
  const tolerancePercent = useUploadStore((s) => s.tolerancePercent);
  const maxAttempts = useUploadStore((s) => s.maxAttempts);
  const preserveReadableQuality = useUploadStore((s) => s.preserveReadableQuality);
  const qualityPreference = useUploadStore((s) => s.qualityPreference);
  const selectedPlatformPreset = useUploadStore((s) => s.selectedPlatformPreset);
  const selectedReductionPercent = useUploadStore((s) => s.selectedReductionPercent);
  const activeEstimate = useUploadStore((s) => s.activeEstimate);
  const isEstimating = useUploadStore((s) => s.isEstimating);

  const setTargetSizeMode = useUploadStore((s) => s.setTargetSizeMode);
  const setTargetSize = useUploadStore((s) => s.setTargetSize);
  const setTargetMode = useUploadStore((s) => s.setTargetMode);
  const setTolerancePercent = useUploadStore((s) => s.setTolerancePercent);
  const setMaxAttempts = useUploadStore((s) => s.setMaxAttempts);
  const setPreserveReadableQuality = useUploadStore((s) => s.setPreserveReadableQuality);
  const setQualityPreference = useUploadStore((s) => s.setQualityPreference);
  const applyPlatformPreset = useUploadStore((s) => s.applyPlatformPreset);
  const applyPercentageReduction = useUploadStore((s) => s.applyPercentageReduction);

  const items = useUploadStore((s) => s.items);
  const processAll = useUploadStore((s) => s.processAll);
  const isProcessingBatch = useUploadStore((s) => s.isProcessingBatch);

  const [fineTuneExpanded, setFineTuneExpanded] = useState(false);
  const isCustom = activePreset === 'CUSTOM';
  const isFineTuneOpen = fineTuneExpanded || isCustom;

  // First queued item for context
  const activeItem = items.find((i) => i.status === 'READY' || i.status === 'QUEUED') || items[0];
  const originalSizeBytes = activeItem?.sizeBytes || 1024 * 1024 * 2.5;

  const targetBytes = typeof targetSizeValue === 'number' && targetSizeValue > 0
    ? (targetSizeUnit === 'MB' ? targetSizeValue * 1024 * 1024 : targetSizeValue * 1024)
    : null;

  return (
    <div className="space-y-4">
      {/* -------------------------------------------------------------------- */}
      {/* 1. TARGET OUTPUT SIZE MAIN PANEL */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-card border-2 border-border shadow-sm rounded-2xl p-6 transition-all">
        {/* Header row with toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Target Output Size</h3>
                <ForgeTooltip text="Target size: The maximum output file size you want.">
                  <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
                </ForgeTooltip>
              </div>
              <p className="text-xs text-muted-foreground">
                Automatic multi-pass iterative compression to hit your exact KB or MB goal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ForgeToggle
              checked={isTargetSizeMode}
              onChange={(val) => setTargetSizeMode(val)}
              label="Compress to exact target size"
              description="Iterative feedback loop"
            />
          </div>
        </div>

        {/* Target size active controls */}
        <AnimatePresence initial={false}>
          {isTargetSizeMode && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-6 space-y-6 overflow-hidden"
            >
              {/* Row 1: Target input, unit, and mode */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* Numeric Input */}
                <div className="md:col-span-5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor={`${idPrefix}-target-input`} className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <span>Target File Size</span>
                      <ForgeTooltip text="Target size: The maximum output file size you want.">
                        <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </ForgeTooltip>
                    </label>
                    <span className="text-[11px] font-mono text-muted-foreground">1 MB = 1024 KB</span>
                  </div>

                  <div className="relative flex rounded-xl border border-border bg-muted/40 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary overflow-hidden">
                    <input
                      id={`${idPrefix}-target-input`}
                      type="number"
                      min={1}
                      max={2048}
                      step={targetSizeUnit === 'MB' ? 0.1 : 10}
                      value={targetSizeValue}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setTargetSize(isNaN(val) ? '' : val, targetSizeUnit);
                      }}
                      placeholder={targetSizeUnit === 'MB' ? 'e.g. 2.0' : 'e.g. 500'}
                      className="w-full h-11 px-3 text-sm font-mono font-medium bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />

                    {/* Unit Switcher */}
                    <div className="flex items-center p-1 bg-card border-l border-border">
                      <button
                        type="button"
                        onClick={() => setTargetSize(targetSizeValue, 'KB')}
                        className={cn(
                          'px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer',
                          targetSizeUnit === 'KB'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        KB
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetSize(targetSizeValue, 'MB')}
                        className={cn(
                          'px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer',
                          targetSizeUnit === 'MB'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        MB
                      </button>
                    </div>
                  </div>
                </div>

                {/* Constraint Mode: Under vs Exact */}
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span>Constraint Rule</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/40 rounded-xl border border-border">
                    <button
                      type="button"
                      onClick={() => setTargetMode('under')}
                      className={cn(
                        'py-2 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer truncate',
                        targetMode === 'under'
                          ? 'bg-card text-foreground shadow-sm border border-border'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Under limit (&le; Target)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetMode('exact')}
                      className={cn(
                        'py-2 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer truncate',
                        targetMode === 'exact'
                          ? 'bg-card text-foreground shadow-sm border border-border'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Exact (&plusmn;Tolerance)
                    </button>
                  </div>
                </div>

                {/* Tolerance & Max Attempts */}
                <div className="md:col-span-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <span>Tolerance</span>
                      <ForgeTooltip text="Tolerance: How close to the target size the final file can be.">
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </ForgeTooltip>
                    </label>
                    <span className="text-[11px] text-muted-foreground">Attempts</span>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={tolerancePercent}
                      onChange={(e) => setTolerancePercent(Number(e.target.value))}
                      className="w-1/2 h-11 px-2 rounded-xl text-xs font-semibold bg-muted/40 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value={1}>&plusmn;1%</option>
                      <option value={3}>&plusmn;3%</option>
                      <option value={5}>&plusmn;5% (Default)</option>
                      <option value={10}>&plusmn;10%</option>
                    </select>
                    <select
                      value={maxAttempts}
                      onChange={(e) => setMaxAttempts(Number(e.target.value))}
                      className="w-1/2 h-11 px-2 rounded-xl text-xs font-semibold bg-muted/40 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value={3}>3 passes</option>
                      <option value={5}>5 passes</option>
                      <option value={8}>8 passes</option>
                      <option value={10}>10 passes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 2: Percentage Reduction Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Quick Percentage Reductions</span>
                <div className="flex flex-wrap gap-2">
                  {PERCENTAGE_REDUCTIONS.map((pct) => {
                    const isSelected = selectedReductionPercent === pct;
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => applyPercentageReduction(pct)}
                        className={cn(
                          'px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer',
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                            : 'bg-card border border-border text-foreground hover:bg-muted/50 hover:border-primary/40'
                        )}
                      >
                        Reduce by {pct}%
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: Platform Presets */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Platform Size Presets</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                  {PLATFORM_PRESETS.map((p) => {
                    const isSelected = selectedPlatformPreset === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => applyPlatformPreset(p.id)}
                        className={cn(
                          'p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between',
                          isSelected
                            ? 'bg-primary/15 border-primary text-primary shadow-sm'
                            : 'bg-card border-border text-foreground hover:bg-muted/50 hover:border-primary/30'
                        )}
                      >
                        <span className="text-xs font-bold truncate">{p.label}</span>
                        <span className="text-[11px] font-mono text-muted-foreground mt-1">{p.sizeMB} MB</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Quality Protection & Preferences */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ForgeToggle
                    checked={preserveReadableQuality}
                    onChange={(val) => setPreserveReadableQuality(val)}
                    label="Preserve readable quality"
                    description="Guarantees safe quality floor and prevents severe pixelation"
                  />
                  <ForgeTooltip text="Quality protection: Prevents extreme quality loss.">
                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help shrink-0" />
                  </ForgeTooltip>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">Optimization Goal:</span>
                  <select
                    value={qualityPreference}
                    onChange={(e) => setQualityPreference(e.target.value as 'balanced' | 'best_quality' | 'exact_target')}
                    className="h-9 px-2.5 rounded-lg text-xs font-semibold bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="balanced">Balanced</option>
                    <option value="exact_target">Exact Target Size</option>
                    <option value="best_quality">Best Quality</option>
                  </select>
                </div>
              </div>

              {/* Extreme Mode Warning if Quality Protection is Disabled */}
              {!preserveReadableQuality && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-start gap-2.5 text-xs"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Extreme compression mode active: </span>
                    <span>This may noticeably reduce quality. Some detail, sharpness, audio quality, or formatting may be lost.</span>
                  </div>
                </motion.div>
              )}

              {/* Row 5: Live Estimate Card */}
              {targetBytes && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/5 via-pink-500/5 to-violet-500/5 border border-primary/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">Live Pre-Analysis & Estimate</span>
                    </div>
                    {isEstimating && (
                      <span className="text-xs font-mono text-muted-foreground animate-pulse">Calculating...</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-card border border-border">
                      <span className="block text-[11px] text-muted-foreground">Original File</span>
                      <span className="text-sm font-bold font-mono text-foreground">{formatFileSize(originalSizeBytes)}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-card border border-border">
                      <span className="block text-[11px] text-muted-foreground">Requested Target</span>
                      <span className="text-sm font-bold font-mono text-primary">
                        {targetSizeValue} {targetSizeUnit}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-card border border-border">
                      <span className="block text-[11px] text-muted-foreground">Estimated Output</span>
                      <span className="text-sm font-bold font-mono text-emerald-500">
                        {activeEstimate ? `${activeEstimate.estimatedOutputSizeKB} KB` : `${Math.round(targetBytes / 1024 * 0.96)} KB`}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-card border border-border">
                      <span className="block text-[11px] text-muted-foreground">Estimated Savings</span>
                      <span className="text-sm font-bold font-mono text-pink-500">
                        {activeEstimate ? `-${activeEstimate.estimatedSavingsPercent}%` : `-${Math.max(0, Math.round(((originalSizeBytes - targetBytes) / originalSizeBytes) * 100))}%`}
                      </span>
                    </div>
                  </div>

                  {/* Visual Size Reduction Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                      <span>Size Budget</span>
                      <span>Target: {targetSizeValue} {targetSizeUnit}</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-300 rounded-full"
                        style={{
                          width: `${Math.min(100, Math.max(5, (targetBytes / originalSizeBytes) * 100))}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Warning Messages if target cannot be achieved */}
                  {activeEstimate?.warnings && activeEstimate.warnings.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 space-y-1">
                      {activeEstimate.warnings.map((w, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <ForgeButton
                  variant="primary"
                  size="md"
                  onClick={() => processAll()}
                  disabled={isProcessingBatch || items.length === 0 || !targetBytes}
                  loading={isProcessingBatch}
                  className="w-full sm:w-auto"
                >
                  <Target className="w-4 h-4 mr-2" />
                  <span>Compress to Target ({targetSizeValue || 0} {targetSizeUnit})</span>
                </ForgeButton>

                <ForgeButton
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setTargetSizeMode(false);
                    processAll();
                  }}
                  disabled={isProcessingBatch || items.length === 0}
                  className="w-full sm:w-auto"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  <span>Smart Compress (Quality-First)</span>
                </ForgeButton>

                {items.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Applies to {items.length} file{items.length > 1 ? 's' : ''} in queue
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. ADVANCED FINE-TUNE CONTROLS (Expandable Accordion) */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setFineTuneExpanded((prev) => !prev)}
          className="w-full flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold text-foreground">Advanced Manual Fine-Tune</span>
              <span className="block text-xs text-muted-foreground">
                Manual sliders for quality, dimensions, bitrates, format, and page range
              </span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isFineTuneOpen ? 180 : 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25 }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isFineTuneOpen && (
            <motion.div
              key="fine-tune-body"
              initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border">
                {/* Quality Slider */}
                <div className="space-y-1">
                  <ForgeSlider
                    label="Compression Quality"
                    value={customOptions.quality}
                    onChange={(val) => updateCustomOptions({ quality: val })}
                    min={1}
                    max={100}
                    step={1}
                    unit="%"
                  />
                </div>

                {/* Resolution Scale */}
                <div className="space-y-1">
                  <ForgeSlider
                    label="Resolution Scale"
                    value={customOptions.resolution?.scalePercent ?? 100}
                    onChange={(val) =>
                      updateCustomOptions({
                        resolution: {
                          ...customOptions.resolution,
                          scalePercent: val,
                          maintainAspectRatio: true,
                        },
                      })
                    }
                    min={10}
                    max={100}
                    step={5}
                    unit="%"
                  />
                </div>

                {/* Video Bitrate */}
                <div className="space-y-1">
                  <ForgeSlider
                    label="Video Bitrate"
                    value={customOptions.videoBitrateKbps ?? 2500}
                    onChange={(val) => updateCustomOptions({ videoBitrateKbps: val })}
                    min={100}
                    max={10000}
                    step={100}
                    unit="kbps"
                  />
                </div>

                {/* Audio Bitrate */}
                <div className="space-y-1">
                  <ForgeSlider
                    label="Audio Bitrate"
                    value={customOptions.audioBitrateKbps ?? 128}
                    onChange={(val) => updateCustomOptions({ audioBitrateKbps: val })}
                    min={32}
                    max={320}
                    step={16}
                    unit="kbps"
                  />
                </div>

                {/* Output Format */}
                <div className="space-y-2">
                  <label htmlFor={`${idPrefix}-output-format`} className="text-sm font-medium text-foreground">Output Format</label>
                  <select
                    id={`${idPrefix}-output-format`}
                    value={customOptions.outputFormat || ''}
                    onChange={(e) => updateCustomOptions({ outputFormat: e.target.value || undefined })}
                    className="w-full h-10 px-3 rounded-xl text-sm bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                  >
                    {OUTPUT_FORMATS.map((f) => (
                      <option key={f.value} value={f.value} className="bg-card text-foreground">
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Page Range */}
                <div className="space-y-2">
                  <label htmlFor={`${idPrefix}-page-range`} className="text-sm font-medium text-foreground">Page Range</label>
                  <input
                    id={`${idPrefix}-page-range`}
                    type="text"
                    value={customOptions.pageRange || ''}
                    onChange={(e) => updateCustomOptions({ pageRange: e.target.value || undefined })}
                    placeholder="e.g. 1-5, 8, 12-15"
                    className="w-full h-10 px-3 rounded-xl text-sm font-mono bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                {/* Strip Metadata Toggle */}
                <div className="flex items-center pt-2">
                  <ForgeToggle
                    checked={customOptions.stripMetadata}
                    onChange={(val) => updateCustomOptions({ stripMetadata: val })}
                    label="Strip Metadata"
                    description="Remove EXIF, GPS coordinates, camera specs, and embedded thumbnails"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Settings2 } from 'lucide-react';
import { useUploadStore } from '@/lib/stores/upload-store';
import { useReducedMotion } from '@/lib/hooks';
import { ForgeSlider } from '@/components/sakuga/forge-slider';
import { ForgeToggle } from '@/components/sakuga/forge-toggle';
import { cn } from '@/lib/utils';

const OUTPUT_FORMATS = [
  { value: '', label: 'Auto (keep original)' },
  { value: 'webp', label: 'WebP' },
  { value: 'jpg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
  { value: 'avif', label: 'AVIF' },
  { value: 'pdf', label: 'PDF' },
  { value: 'mp4', label: 'MP4' },
  { value: 'mp3', label: 'MP3' },
  { value: 'zip', label: 'ZIP' },
] as const;

export const CustomControlsPanel: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const activePreset = useUploadStore((s) => s.activePreset);
  const customOptions = useUploadStore((s) => s.customOptions);
  const updateCustomOptions = useUploadStore((s) => s.updateCustomOptions);
  const [expanded, setExpanded] = useState(false);

  // Always allow expand, but auto-open when CUSTOM preset is active
  const isCustom = activePreset === 'CUSTOM';
  const isOpen = expanded || isCustom;

  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className={cn(
          'w-full flex items-center justify-between px-6 py-4 cursor-pointer transition-colors',
          'hover:bg-muted/50',
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <Settings2 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <span className="text-sm font-semibold text-foreground">Fine-Tune Controls</span>
            <span className="block text-xs text-muted-foreground">
              Quality, resolution, bitrate, format, and metadata
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="controls-body"
            initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Target Size */}
              <div className="space-y-2 p-4 rounded-2xl bg-[var(--sk-surface)] border border-[var(--sk-border)]">
                <label className="text-sm font-bold text-[var(--sk-text)] flex items-center justify-between">
                  <span>Target File Size</span>
                  <span className="text-xs font-mono text-[var(--sk-text-muted)]">Max 2,048 MB</span>
                </label>
                <input
                  type="number"
                  min={0.1}
                  max={2048}
                  step={0.1}
                  value={
                    customOptions.targetSizeBytes
                      ? (customOptions.targetSizeBytes / (1024 * 1024)).toFixed(1)
                      : ''
                  }
                  onChange={(e) => {
                    const mb = parseFloat(e.target.value);
                    if (!isNaN(mb) && mb > 0) {
                      updateCustomOptions({ targetSizeBytes: Math.round(mb * 1024 * 1024) });
                    } else {
                      updateCustomOptions({ targetSizeBytes: undefined });
                    }
                  }}
                  placeholder="Leave blank for automatic smart size"
                  className={cn(
                    'w-full h-11 px-3 rounded-xl text-sm font-mono',
                    'bg-muted border border-border text-foreground placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-primary',
                    'transition-all',
                  )}
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
                <label className="text-sm font-medium text-foreground">Output Format</label>
                <select
                  value={customOptions.outputFormat || ''}
                  onChange={(e) => updateCustomOptions({ outputFormat: e.target.value || undefined })}
                  className={cn(
                    'w-full h-10 px-3 rounded-xl text-sm',
                    'bg-card border border-border text-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-primary',
                    'transition-all appearance-none cursor-pointer',
                  )}
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
                <label className="text-sm font-medium text-foreground">Page Range</label>
                <input
                  type="text"
                  value={customOptions.pageRange || ''}
                  onChange={(e) => updateCustomOptions({ pageRange: e.target.value || undefined })}
                  placeholder="e.g. 1-5, 8, 12-15"
                  className={cn(
                    'w-full h-10 px-3 rounded-xl text-sm font-mono',
                    'bg-card border border-border text-foreground placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-primary',
                    'transition-all',
                  )}
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
  );
};

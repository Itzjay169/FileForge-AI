'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  ChevronDown,
  Lock,
  RotateCw,
  Tag,
  FileType,
  Sparkles
} from 'lucide-react';
import { ConversionOptions } from '@fileforge/shared';
import { SakugaSlider } from '@/components/ui/sakuga-slider';
import { SakugaToggle } from '@/components/ui/sakuga-toggle';
import { useReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export interface ConversionOptionsDrawerProps {
  options: ConversionOptions;
  onChange: (options: Partial<ConversionOptions>) => void;
  targetFormat: string;
}

export const ConversionOptionsDrawer: React.FC<ConversionOptionsDrawerProps> = ({
  options,
  onChange,
  targetFormat
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  const t = targetFormat.toLowerCase();
  const isImage = ['webp', 'jpg', 'jpeg', 'png', 'avif', 'tiff', 'ico'].includes(t);
  const isVideo = ['mp4', 'mkv', 'mov', 'webm', 'avi', 'flv'].includes(t);
  const isAudio = ['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg'].includes(t);
  const isDocument = ['pdf', 'docx', 'txt', 'html'].includes(t);

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden mb-6">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center text-violet-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-sm font-semibold text-white/90">
              Advanced Conversion Parameters
            </span>
            <span className="block text-xs text-white/40">
              Page range, orientation, custom naming, metadata, and quality
            </span>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25 }}
        >
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="drawer-body"
            initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5">
              {/* Custom Output Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-violet-400" />
                  Custom Output File Name
                </label>
                <input
                  type="text"
                  value={options.customOutputName || ''}
                  onChange={(e) => onChange({ customOutputName: e.target.value || undefined })}
                  placeholder="e.g. final-converted-document"
                  className="w-full h-10 px-3 rounded-xl text-sm font-sans bg-forge-bg-card border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              {/* Page Range (for Documents/PDF) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                  <FileType className="w-3.5 h-3.5 text-pink-400" />
                  Page Range (Documents & PDFs)
                </label>
                <input
                  type="text"
                  value={options.pageRange || ''}
                  onChange={(e) => onChange({ pageRange: e.target.value || undefined })}
                  placeholder="e.g. 1-5, 8, 12-14"
                  className="w-full h-10 px-3 rounded-xl text-sm font-mono bg-forge-bg-card border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              {/* Quality Slider (for raster images & media) */}
              {(isImage || isVideo) && (
                <div className="space-y-1">
                  <SakugaSlider
                    label="Output Quality"
                    value={options.quality ?? 85}
                    onChange={(val) => onChange({ quality: val })}
                    min={1}
                    max={100}
                    step={1}
                    unit="%"
                    variant="quality"
                  />
                </div>
              )}

              {/* Orientation & Rotation (for Images) */}
              {isImage && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                    Image Orientation
                  </label>
                  <select
                    value={options.orientation || '0'}
                    onChange={(e) => onChange({ orientation: (e.target.value as any) || undefined })}
                    className="w-full h-10 px-3 rounded-xl text-sm bg-forge-bg-card border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer"
                  >
                    <option value="0" className="bg-[#12121a]">Original (0°)</option>
                    <option value="90" className="bg-[#12121a]">Rotate 90° Clockwise</option>
                    <option value="180" className="bg-[#12121a]">Rotate 180°</option>
                    <option value="270" className="bg-[#12121a]">Rotate 270° (90° CCW)</option>
                    <option value="flip_h" className="bg-[#12121a]">Flip Horizontal (Mirror)</option>
                    <option value="flip_v" className="bg-[#12121a]">Flip Vertical</option>
                  </select>
                </div>
              )}

              {/* Password Protection */}
              {isDocument && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    Document Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={options.password || ''}
                    onChange={(e) => onChange({ password: e.target.value || undefined })}
                    placeholder="Enter password to encrypt output"
                    className="w-full h-10 px-3 rounded-xl text-sm bg-forge-bg-card border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>
              )}

              {/* Preserve Metadata Toggle */}
              <div className="flex items-center pt-2">
                <SakugaToggle
                  checked={options.preserveMetadata ?? true}
                  onChange={(val) => onChange({ preserveMetadata: val })}
                  label="Preserve Metadata"
                  description="Maintain EXIF, author tags, and copyright information"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

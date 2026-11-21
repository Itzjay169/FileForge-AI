'use client';

import { ForgeSlider, ForgeToggle } from '@/components/sakuga';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  ChevronDown,
  Lock,
  RotateCw,
  Tag,
  FileType
} from 'lucide-react';
import { ConversionOptions } from '@fileforge/shared';
import { useReducedMotion } from '@/lib/hooks';

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
    const isDocument = ['pdf', 'docx', 'txt', 'html'].includes(t);

  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden mb-6">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-sm font-semibold text-foreground">
              Advanced Conversion Parameters
            </span>
            <span className="block text-xs text-muted-foreground">
              Page range, orientation, custom naming, metadata, and quality
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
            <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border">
              {/* Custom Output Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-primary" />
                  Custom Output File Name
                </label>
                <input
                  type="text"
                  value={options.customOutputName || ''}
                  onChange={(e) => onChange({ customOutputName: e.target.value || undefined })}
                  placeholder="e.g. final-converted-document"
                  className="w-full h-10 px-3 rounded-xl text-sm font-sans bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Page Range (for Documents/PDF) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <FileType className="w-3.5 h-3.5 text-pink-500" />
                  Page Range (Documents & PDFs)
                </label>
                <input
                  type="text"
                  value={options.pageRange || ''}
                  onChange={(e) => onChange({ pageRange: e.target.value || undefined })}
                  placeholder="e.g. 1-5, 8, 12-14"
                  className="w-full h-10 px-3 rounded-xl text-sm font-mono bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Quality Slider (for raster images & media) */}
              {(isImage || isVideo) && (
                <div className="space-y-1">
                  <ForgeSlider
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
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-amber-500" />
                    Image Orientation
                  </label>
                  <select
                    value={options.orientation || '0'}
                    onChange={(e) => onChange({ orientation: (e.target.value as '0' | '90' | '180' | '270' | 'flip_h' | 'flip_v') || undefined })}
                    className="w-full h-10 px-3 rounded-xl text-sm bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <option value="0" className="bg-card text-foreground">Original (0°)</option>
                    <option value="90" className="bg-card text-foreground">Rotate 90° Clockwise</option>
                    <option value="180" className="bg-card text-foreground">Rotate 180°</option>
                    <option value="270" className="bg-card text-foreground">Rotate 270° (90° CCW)</option>
                    <option value="flip_h" className="bg-card text-foreground">Flip Horizontal (Mirror)</option>
                    <option value="flip_v" className="bg-card text-foreground">Flip Vertical</option>
                  </select>
                </div>
              )}

              {/* Password Protection */}
              {isDocument && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-500" />
                    Document Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={options.password || ''}
                    onChange={(e) => onChange({ password: e.target.value || undefined })}
                    placeholder="Enter password to encrypt output"
                    className="w-full h-10 px-3 rounded-xl text-sm bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {/* Preserve Metadata Toggle */}
              <div className="flex items-center pt-2">
                <ForgeToggle
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

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Crop,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Wand2,
  Sliders,
  Check,
  Download,
  Sparkles,
  Layers
} from 'lucide-react';
import { ImageEditOptions } from '@fileforge/shared';
import { SakugaButton } from '@/components/ui/sakuga-button';
import { SakugaSlider } from '@/components/ui/sakuga-slider';
import { SakugaToggle } from '@/components/ui/sakuga-toggle';
import { forgeToast } from '@/components/ui/sakuga-toast';
import { useReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  onSaved?: (result: any) => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  isOpen,
  onClose,
  file,
  onSaved
}) => {
  const prefersReduced = useReducedMotion();
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [invert, setInvert] = useState(false);
  const [sharpen, setSharpen] = useState(false);
  const [brightness, setBrightness] = useState(1.0);
  const [contrast, setContrast] = useState(1.0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'png' | 'webp' | 'jpg' | 'avif'>('png');
  const [quality, setQuality] = useState(85);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !file) return null;

  const objectUrl = URL.createObjectURL(file);

  const handleExecute = async () => {
    setIsProcessing(true);
    try {
      const options: ImageEditOptions = {
        rotate: rotation || undefined,
        flipH,
        flipV,
        filters: {
          grayscale,
          invert,
          sharpen,
          brightness: brightness !== 1.0 ? brightness : undefined,
          contrast: contrast !== 1.0 ? contrast : undefined
        },
        removeBackground,
        outputFormat,
        quality
      };

      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(options));

      const res = await fetch('/api/editor/image', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Editing failed');

      forgeToast.success('Image Edit Applied', json.data.outputName);
      onSaved?.(json.data);
      onClose();
    } catch (err: any) {
      forgeToast.error('Edit Failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-4xl bg-[#12121a] border border-white/15 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-400">
                <Crop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Creative Image Studio</h3>
                <p className="text-xs text-white/40">{file.name}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto py-5 grid grid-cols-1 lg:grid-cols-3 gap-6 scrollbar-thin">
            {/* Visual Canvas Area */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center bg-black/50 border border-white/10 rounded-2xl p-4 min-h-[300px] overflow-hidden relative">
              {/* Checkerboard transparency underlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              />

              <div className="relative max-h-[360px] max-w-full overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={objectUrl}
                  alt="Edit Target"
                  className="max-h-[340px] max-w-full object-contain transition-all duration-200"
                  style={{
                    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                    filter: `grayscale(${grayscale ? 1 : 0}) invert(${invert ? 1 : 0}) brightness(${brightness}) contrast(${contrast})`,
                    opacity: removeBackground ? 0.85 : 1
                  }}
                />
              </div>

              {removeBackground && (
                <div className="absolute bottom-3 left-3 bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-pink-400" />
                  <span>AI Alpha Transparency Enabled</span>
                </div>
              )}
            </div>

            {/* Controls Panel */}
            <div className="space-y-5">
              {/* Transform Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-white/70 block uppercase tracking-wider">
                  Orientation & Mirror
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="flex-1 h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>+90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFlipH(!flipH)}
                    className={cn(
                      'flex-1 h-9 border rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer',
                      flipH ? 'bg-violet-600/30 border-violet-500 text-violet-300' : 'bg-white/5 border-white/10 text-white'
                    )}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                    <span>Flip H</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFlipV(!flipV)}
                    className={cn(
                      'flex-1 h-9 border rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer',
                      flipV ? 'bg-violet-600/30 border-violet-500 text-violet-300' : 'bg-white/5 border-white/10 text-white'
                    )}
                  >
                    <FlipVertical className="w-3.5 h-3.5" />
                    <span>Flip V</span>
                  </button>
                </div>
              </div>

              {/* AI Background Removal Toggle */}
              <div className="p-3 bg-pink-500/10 border border-pink-500/25 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-bold text-pink-200">Remove Background (AI)</span>
                  </div>
                  <SakugaToggle
                    size="sm"
                    checked={removeBackground}
                    onChange={(val) => {
                      setRemoveBackground(val);
                      if (val) setOutputFormat('png');
                    }}
                  />
                </div>
                <p className="text-[11px] text-pink-200/70">
                  Segments foreground subject and exports crisp transparent alpha cutout.
                </p>
              </div>

              {/* Filters */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-white/70 block uppercase tracking-wider">
                  Color Filters
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGrayscale(!grayscale)}
                    className={cn(
                      'h-9 rounded-xl border text-xs flex items-center justify-center cursor-pointer',
                      grayscale ? 'bg-violet-600/30 border-violet-500 text-white' : 'bg-white/5 border-white/10 text-white/60'
                    )}
                  >
                    Grayscale
                  </button>

                  <button
                    type="button"
                    onClick={() => setInvert(!invert)}
                    className={cn(
                      'h-9 rounded-xl border text-xs flex items-center justify-center cursor-pointer',
                      invert ? 'bg-violet-600/30 border-violet-500 text-white' : 'bg-white/5 border-white/10 text-white/60'
                    )}
                  >
                    Invert
                  </button>

                  <button
                    type="button"
                    onClick={() => setSharpen(!sharpen)}
                    className={cn(
                      'h-9 rounded-xl border text-xs flex items-center justify-center cursor-pointer',
                      sharpen ? 'bg-violet-600/30 border-violet-500 text-white' : 'bg-white/5 border-white/10 text-white/60'
                    )}
                  >
                    Sharpen
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBrightness(1.0);
                      setContrast(1.0);
                      setGrayscale(false);
                      setInvert(false);
                      setSharpen(false);
                      setRotation(0);
                      setFlipH(false);
                      setFlipV(false);
                      setRemoveBackground(false);
                    }}
                    className="h-9 rounded-xl bg-white/5 border border-white/10 text-xs text-white/40 hover:text-white"
                  >
                    Reset All
                  </button>
                </div>
              </div>

              {/* Sliders for Brightness & Quality */}
              <div className="space-y-3 pt-1">
                <SakugaSlider
                  label="Brightness"
                  min={0.5}
                  max={1.5}
                  step={0.05}
                  value={brightness}
                  onChange={(val) => setBrightness(val)}
                  unit=""
                />

                <SakugaSlider
                  label="Export Quality"
                  min={10}
                  max={100}
                  step={1}
                  value={quality}
                  onChange={(val) => setQuality(val)}
                  unit="%"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Format:</span>
              {(['png', 'webp', 'jpg', 'avif'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setOutputFormat(fmt)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-mono uppercase font-bold cursor-pointer',
                    outputFormat === fmt
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/5 text-white/50 hover:text-white'
                  )}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <SakugaButton variant="ghost" size="sm" onClick={onClose}>
                <span>Cancel</span>
              </SakugaButton>

              <SakugaButton
                variant="default"
                size="sm"
                onClick={handleExecute}
                isLoading={isProcessing}
                disabled={isProcessing}
                showSuccessCheck
              >
                <Check className="w-4 h-4 mr-1.5" />
                <span>Save Edits</span>
              </SakugaButton>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

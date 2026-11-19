'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileImage,
  Minimize2,
  Maximize2,
  Clock,
  Hash,
  ArrowDownRight,
} from 'lucide-react';
import { type QueueItem } from '@fileforge/shared';
import { formatFileSize, cn } from '@/lib/utils';
import { SakugaButton } from '@/components/ui/sakuga-button';
import { useReducedMotion } from '@/lib/hooks';

export interface BeforeAfterComparatorProps {
  item: QueueItem | null;
  onClose: () => void;
}

export const BeforeAfterComparator: React.FC<BeforeAfterComparatorProps> = ({
  item,
  onClose,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [splitPosition, setSplitPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // ---- Drag logic for split divider ----
  const handlePointerDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(10, Math.min(90, (x / rect.width) * 100));
      setSplitPosition(pct);
    },
    [],
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // If no item, render nothing
  if (!item) return null;

  const result = item.result;
  const hasImagePreview =
    item.previewDataUrl && item.previewDataUrl.startsWith('data:image');
  // We can also try to construct an original preview if the file is an image
  const originalPreviewUrl = item.file
    ? URL.createObjectURL(item.file)
    : undefined;

  const metrics = [
    {
      label: 'Original Size',
      value: formatFileSize(item.sizeBytes),
      icon: <Maximize2 className="w-4 h-4" />,
      color: 'text-white',
    },
    {
      label: 'Output Size',
      value: result ? formatFileSize(result.outputSizeBytes) : '—',
      icon: <Minimize2 className="w-4 h-4" />,
      color: 'text-violet-400',
    },
    {
      label: 'Saved',
      value: result ? formatFileSize(result.savedBytes) : '—',
      icon: <ArrowDownRight className="w-4 h-4" />,
      color: 'text-emerald-400',
    },
    {
      label: 'Savings',
      value: result ? `${result.savingsPercentage}%` : '—',
      icon: <ArrowDownRight className="w-4 h-4" />,
      color: 'text-emerald-400 font-bold',
    },
    {
      label: 'Duration',
      value: result ? `${result.durationMs}ms` : '—',
      icon: <Clock className="w-4 h-4" />,
      color: 'text-amber-400',
    },
    {
      label: 'SHA-256',
      value: result ? result.sha256Hash.slice(0, 16) + '…' : '—',
      icon: <Hash className="w-4 h-4" />,
      color: 'text-white/60 font-mono',
    },
  ];

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-[#12121a] border border-white/15 rounded-3xl p-6 max-w-3xl w-full shadow-2xl shadow-black/60"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 20 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 20 }
            }
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                  <FileImage className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Visual Comparison
                  </h3>
                  <p className="text-xs text-white/40 truncate max-w-[300px]">
                    {item.originalName}
                  </p>
                </div>
              </div>
              <SakugaButton
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </SakugaButton>
            </div>

            {/* Split comparison view */}
            <div
              ref={containerRef}
              className="relative h-[320px] rounded-2xl overflow-hidden bg-black border border-white/10 mb-5 cursor-col-resize touch-none select-none"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {/* Original (left side) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - splitPosition}% 0 0)` }}
              >
                {originalPreviewUrl && hasImagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={originalPreviewUrl}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-white/[0.04] to-white/[0.01]">
                    <FileImage className="w-10 h-10 text-white/15" />
                    <span className="text-xs text-white/30 font-medium uppercase tracking-widest">
                      Original
                    </span>
                    <span className="text-sm font-mono text-white/50">
                      {formatFileSize(item.sizeBytes)}
                    </span>
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 text-[10px] font-bold uppercase tracking-wider text-white/60 backdrop-blur-sm">
                  Before
                </div>
              </div>

              {/* Compressed (right side) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 0 0 ${splitPosition}%)` }}
              >
                {hasImagePreview && item.previewDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.previewDataUrl}
                    alt="Compressed"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-violet-500/[0.04] to-pink-500/[0.04]">
                    <FileImage className="w-10 h-10 text-violet-400/20" />
                    <span className="text-xs text-violet-300/40 font-medium uppercase tracking-widest">
                      Optimized
                    </span>
                    <span className="text-sm font-mono text-violet-400/60">
                      {result ? formatFileSize(result.outputSizeBytes) : '—'}
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-violet-600/60 text-[10px] font-bold uppercase tracking-wider text-violet-200 backdrop-blur-sm">
                  After
                </div>
              </div>

              {/* Draggable divider */}
              <div
                className="absolute top-0 bottom-0 z-10 cursor-col-resize"
                style={{ left: `${splitPosition}%`, transform: 'translateX(-50%)' }}
                onPointerDown={handlePointerDown}
              >
                <div className="w-0.5 h-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]" />
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-violet-600 border-2 border-violet-400 shadow-lg flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-3 rounded-full bg-violet-300" />
                    <div className="w-0.5 h-3 rounded-full bg-violet-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Metric cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-white/[0.04] border border-white/10 rounded-xl p-3 flex items-start gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/40 shrink-0">
                    {m.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-white/40 uppercase tracking-wider">
                      {m.label}
                    </p>
                    <p className={cn('text-sm truncate', m.color)}>{m.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

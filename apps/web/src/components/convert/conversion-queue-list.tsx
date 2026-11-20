'use client';

import { ForgeButton, ForgeProgress } from '@/components/sakuga';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Download,
  RotateCcw,
  X,
  AlertTriangle,
  Play,
  FileQuestion,
  ChevronDown
} from 'lucide-react';
import { ConversionQueueItem } from '@fileforge/shared';
import { useConversionStore } from '@/lib/stores/conversion-store';
import { FormatSelectorModal } from './format-selector-modal';
import { LossyWarningDialog } from './lossy-warning-dialog';
import { formatFileSize, cn, truncate } from '@/lib/utils';

export const ConversionQueueList: React.FC = () => {
  const items = useConversionStore((s) => s.items);
  const processItem = useConversionStore((s) => s.processItem);
  const processAll = useConversionStore((s) => s.processAll);
  const removeItem = useConversionStore((s) => s.removeItem);
  const setItemTargetFormat = useConversionStore((s) => s.setItemTargetFormat);
  const downloadBatchZip = useConversionStore((s) => s.downloadBatchZip);
  const isProcessingBatch = useConversionStore((s) => s.isProcessingBatch);
  const lossyWarningItem = useConversionStore((s) => s.lossyWarningItem);
  const setLossyWarningItem = useConversionStore((s) => s.setLossyWarningItem);
  const confirmLossyAndProceed = useConversionStore((s) => s.confirmLossyAndProceed);

  const [activeModalItem, setActiveModalItem] = useState<ConversionQueueItem | null>(null);

  const readyCount = items.filter((i) => i.status === 'READY' || i.status === 'FAILED').length;
  const completedCount = items.filter((i) => i.status === 'COMPLETED' && i.result).length;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3 bg-white/[0.02] border border-white/5 rounded-3xl">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center text-white/20">
          <FileQuestion className="w-7 h-7" />
        </div>
        <p className="text-sm font-medium text-white/50">Conversion queue is empty</p>
        <p className="text-xs text-white/30">Drop files above or choose from presets to begin</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Batch Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">
            Conversion Queue ({items.length} file{items.length !== 1 ? 's' : ''})
          </span>
          {completedCount > 0 && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {completedCount} Completed
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {readyCount > 0 && (
            <ForgeButton variant="primary"
              size="sm"
              onClick={() => processAll()}
              disabled={isProcessingBatch}
              isLoading={isProcessingBatch}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Convert All ({readyCount})</span>
            </ForgeButton>
          )}

          {completedCount > 0 && (
            <ForgeButton
              variant="accent"
              size="sm"
              onClick={() => downloadBatchZip()}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </ForgeButton>
          )}
        </div>
      </div>

      {/* Item Cards */}
      <AnimatePresence mode="popLayout">
        {items.map((item) => {
          const isCompleted = item.status === 'COMPLETED';
          const isFailed = item.status === 'FAILED';
          const isProcessing = item.status === 'PROCESSING';
          const isReady = item.status === 'READY';

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className={cn(
                'flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 transition-all',
                isCompleted && 'border-l-4 border-l-emerald-500 bg-emerald-500/[0.02]',
                isFailed && 'border-l-4 border-l-rose-500 bg-rose-500/[0.02]'
              )}
            >
              {/* File details & target arrow */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-white truncate max-w-[280px]">
                    {truncate(item.originalName, 32)}
                  </span>
                  <span className="text-xs text-white/40">
                    ({formatFileSize(item.sizeBytes)})
                  </span>

                  {/* Format Transformation Pill Button */}
                  <button
                    type="button"
                    onClick={() => setActiveModalItem(item)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/15 transition-colors cursor-pointer group ml-1"
                  >
                    <span className="font-mono text-[11px] font-bold text-violet-300 uppercase">
                      .{item.sourceExtension}
                    </span>
                    <ArrowRight className="w-3 h-3 text-white/40 group-hover:text-white transition-colors" />
                    <span className="font-mono text-[11px] font-bold text-pink-300 uppercase">
                      .{item.targetExtension}
                    </span>
                    <ChevronDown className="w-3 h-3 text-white/40" />
                  </button>

                  {/* Lossy Warning Chip */}
                  {item.isLossy && (
                    <button
                      type="button"
                      onClick={() => setLossyWarningItem(item)}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg cursor-pointer hover:bg-amber-500/20"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>Lossy</span>
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                {isProcessing && (
                  <ForgeProgress
                    value={item.processProgress}
                    size="sm"
                    variant="plasma"
                    showPercentage
                    showLabel
                    label={item.currentStep}
                  />
                )}

                {/* Error message */}
                {isFailed && item.error && (
                  <p className="text-xs text-rose-400">{item.error}</p>
                )}

                {/* Result output summary */}
                {isCompleted && item.result && (
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <span className="text-emerald-400 font-semibold">
                      {item.result.outputName}
                    </span>
                    <span>•</span>
                    <span>{formatFileSize(item.result.outputSizeBytes)}</span>
                    <span>•</span>
                    <span>{item.result.durationMs}ms</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {isReady && (
                  <ForgeButton variant="primary"
                    size="sm"
                    onClick={() => processItem(item.id)}
                  >
                    <span>Convert</span>
                  </ForgeButton>
                )}

                {isCompleted && item.result?.outputFileUrl && (
                  <a
                    href={item.result.outputFileUrl}
                    download={item.result.outputName}
                    className="inline-flex"
                  >
                    <ForgeButton variant="secondary" size="sm">
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </ForgeButton>
                  </a>
                )}

                {isFailed && (
                  <ForgeButton
                    variant="ghost"
                    size="sm"
                    onClick={() => processItem(item.id)}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </ForgeButton>
                )}

                <ForgeButton
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-lg text-white/40 hover:text-white"
                  onClick={() => removeItem(item.id)}
                >
                  <X className="w-4 h-4" />
                </ForgeButton>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Target Selector Modal */}
      {activeModalItem && (
        <FormatSelectorModal
          isOpen={Boolean(activeModalItem)}
          onClose={() => setActiveModalItem(null)}
          sourceExtension={activeModalItem.sourceExtension}
          currentTarget={activeModalItem.targetExtension}
          onSelectTarget={(target) => {
            setItemTargetFormat(activeModalItem.id, target);
            setActiveModalItem(null);
          }}
        />
      )}

      {/* Lossy Warning Dialog */}
      {lossyWarningItem && (
        <LossyWarningDialog
          item={lossyWarningItem}
          onConfirm={() => confirmLossyAndProceed(lossyWarningItem.id)}
          onCancel={() => setLossyWarningItem(null)}
        />
      )}
    </div>
  );
};

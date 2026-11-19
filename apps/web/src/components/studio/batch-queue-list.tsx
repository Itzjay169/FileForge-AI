'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  FileSpreadsheet,
  FileCode,
  Archive,
  Download,
  RotateCcw,
  X,
  Eye,
  Loader2,
  FileQuestion,
  type LucideIcon,
} from 'lucide-react';
import { type QueueItem } from '@fileforge/shared';
import { useUploadStore } from '@/lib/stores/upload-store';
import { useReducedMotion } from '@/lib/hooks';
import { SakugaProgress } from '@/components/ui/sakuga-progress';
import { SakugaButton } from '@/components/ui/sakuga-button';
import { formatFileSize, cn, truncate } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Category icon resolver
// ---------------------------------------------------------------------------

const IMG_EXTS = new Set(['jpg','jpeg','png','gif','webp','avif','bmp','tiff','tif','heic','heif','svg','psd','ico','xcf','ai','eps','cdr','raw','cr2','cr3','nef','arw','dng','jxl']);
const VID_EXTS = new Set(['mp4','m4v','mkv','mov','avi','wmv','flv','webm','ogv','mpeg','mpg','3gp','3g2','m2ts','mts','vob','divx','ts_stream']);
const AUD_EXTS = new Set(['mp3','wav','aac','flac','m4a','wma','ogg','oga','opus','alac','aiff','aif','mid','midi','amr','ape']);
const SHEET_EXTS = new Set(['csv','xls','xlsx','xlsm','xlsb','xlt','xltx','ods','fods','ots','numbers','tsv','gsheet']);
const CODE_EXTS = new Set(['js','jsx','ts','tsx','py','rb','pl','php','java','c','cpp','h','cs','go','rs','swift','kt','sql','html','htm','xhtml','css','json','xml','yaml','yml','ini','cfg','conf','sh','bat','ps1','cmd']);
const ARCHIVE_EXTS = new Set(['zip','rar','7z','tar','gz','tgz','bz2','xz','iso','img','dmg','cab','jar']);

function getCategoryIcon(ext: string): LucideIcon {
  const e = ext.toLowerCase().replace(/^\./, '');
  if (IMG_EXTS.has(e)) return FileImage;
  if (VID_EXTS.has(e)) return FileVideo;
  if (AUD_EXTS.has(e)) return FileAudio;
  if (SHEET_EXTS.has(e)) return FileSpreadsheet;
  if (CODE_EXTS.has(e)) return FileCode;
  if (ARCHIVE_EXTS.has(e)) return Archive;
  return FileText;
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: QueueItem['status'] }) {
  const map: Record<string, { bg: string; text: string; label: string; pulse?: boolean }> = {
    READY:      { bg: 'bg-violet-500/15', text: 'text-violet-400', label: 'Ready' },
    QUEUED:     { bg: 'bg-violet-500/15', text: 'text-violet-400', label: 'Queued' },
    UPLOADING:  { bg: 'bg-blue-500/15',   text: 'text-blue-400',   label: 'Uploading' },
    ANALYZING:  { bg: 'bg-amber-500/15',  text: 'text-amber-400',  label: 'Analyzing' },
    SCANNING:   { bg: 'bg-amber-500/15',  text: 'text-amber-400',  label: 'Scanning' },
    PROCESSING: { bg: 'bg-amber-500/15',  text: 'text-amber-400',  label: 'Processing', pulse: true },
    COMPLETED:  { bg: 'bg-emerald-500/15',text: 'text-emerald-400',label: 'Done' },
    FAILED:     { bg: 'bg-rose-500/15',   text: 'text-rose-400',   label: 'Failed' },
    CANCELLED:  { bg: 'bg-gray-500/15',   text: 'text-gray-400',   label: 'Cancelled' },
    PAUSED:     { bg: 'bg-gray-500/15',   text: 'text-gray-400',   label: 'Paused' },
  };
  const s = map[status] || map.READY;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider',
        s.bg,
        s.text,
        s.pulse && 'animate-pulse',
      )}
    >
      {s.pulse && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
      {s.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Individual queue card
// ---------------------------------------------------------------------------

function QueueCard({ item }: { item: QueueItem }) {
  const processItem = useUploadStore((s) => s.processItem);
  const cancelItem = useUploadStore((s) => s.cancelItem);
  const retryItem = useUploadStore((s) => s.retryItem);
  const removeItem = useUploadStore((s) => s.removeItem);
  const setComparisonItem = useUploadStore((s) => s.setComparisonItem);

  const Icon = getCategoryIcon(item.extension);
  const isCompleted = item.status === 'COMPLETED';
  const isFailed = item.status === 'FAILED';
  const isProcessing = item.status === 'PROCESSING';
  const isReady = item.status === 'READY' || item.status === 'QUEUED';

  const progressVariant = isFailed
    ? 'error'
    : isCompleted
    ? 'success'
    : isProcessing
    ? 'plasma'
    : 'default';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'flex items-start gap-4 p-4 rounded-2xl transition-all',
        'bg-white/[0.04] border border-white/10 hover:border-white/20',
        isCompleted && 'border-l-2 border-l-emerald-500',
        isFailed && 'border-l-2 border-l-rose-500',
      )}
    >
      {/* File icon */}
      <div
        className={cn(
          'flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center',
          isCompleted
            ? 'bg-emerald-500/10 text-emerald-400'
            : isFailed
            ? 'bg-rose-500/10 text-rose-400'
            : 'bg-white/[0.06] text-white/60',
        )}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Center content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Name + status row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-white truncate">
              {truncate(item.originalName, 32)}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40 border border-white/10 uppercase shrink-0">
              .{item.extension}
            </span>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Size + savings */}
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span>{formatFileSize(item.sizeBytes)}</span>
          {isCompleted && item.result && (
            <>
              <span className="text-white/20">→</span>
              <span className="text-white/60">{formatFileSize(item.result.outputSizeBytes)}</span>
              <span className="font-bold text-emerald-400">
                −{item.result.savingsPercentage}%
              </span>
            </>
          )}
        </div>

        {/* Progress bar (only while processing/uploading) */}
        {(isProcessing || item.status === 'UPLOADING') && (
          <SakugaProgress
            value={item.processProgress}
            variant={progressVariant}
            size="sm"
            showPercentage
            showLabel
            label={item.currentStep}
          />
        )}

        {/* Error message */}
        {isFailed && item.error && (
          <p className="text-xs text-rose-400/80 bg-rose-500/5 px-2 py-1 rounded-lg">
            {item.error}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 pt-1">
          {isReady && (
            <SakugaButton variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
              <X className="w-3.5 h-3.5" />
              <span className="text-xs">Remove</span>
            </SakugaButton>
          )}

          {isProcessing && (
            <SakugaButton variant="ghost" size="sm" onClick={() => cancelItem(item.id)}>
              <X className="w-3.5 h-3.5" />
              <span className="text-xs">Cancel</span>
            </SakugaButton>
          )}

          {isCompleted && (
            <>
              {item.result?.outputFileUrl && (
                <a
                  href={item.result.outputFileUrl}
                  download={item.result.outputName}
                  className="inline-flex"
                >
                  <SakugaButton variant="secondary" size="sm">
                    <Download className="w-3.5 h-3.5" />
                    <span className="text-xs">Download</span>
                  </SakugaButton>
                </a>
              )}
              <SakugaButton
                variant="ghost"
                size="sm"
                onClick={() => setComparisonItem(item)}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="text-xs">Compare</span>
              </SakugaButton>
              <SakugaButton variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                <X className="w-3.5 h-3.5" />
              </SakugaButton>
            </>
          )}

          {isFailed && (
            <>
              <SakugaButton variant="ghost" size="sm" onClick={() => retryItem(item.id)}>
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-xs">Retry</span>
              </SakugaButton>
              <SakugaButton variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                <X className="w-3.5 h-3.5" />
              </SakugaButton>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// BatchQueueList
// ---------------------------------------------------------------------------

export const BatchQueueList: React.FC = () => {
  const items = useUploadStore((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
          <FileQuestion className="w-7 h-7 text-white/20" />
        </div>
        <div className="text-center">
          <p className="text-sm text-white/50 font-medium">No files in queue</p>
          <p className="text-xs text-white/30 mt-1">
            Drop files above to begin compressing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-white/70">
          Queue ({items.length} file{items.length !== 1 ? 's' : ''})
        </h3>
      </div>
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <QueueCard key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </div>
  );
};

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
  FileQuestion,
  CheckCircle2,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';
import { type QueueItem } from '@fileforge/shared';
import { useUploadStore } from '@/lib/stores/upload-store';
import { ForgeProgress } from '@/components/sakuga/forge-progress';
import { ForgeButton } from '@/components/sakuga/forge-button';
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
  const cancelItem = useUploadStore((s) => s.cancelItem);
  const retryItem = useUploadStore((s) => s.retryItem);
  const removeItem = useUploadStore((s) => s.removeItem);
  const setComparisonItem = useUploadStore((s) => s.setComparisonItem);

  const isCompleted = item.status === 'COMPLETED';
  const isFailed = item.status === 'FAILED';
  const isProcessing = item.status === 'PROCESSING';
  const isReady = item.status === 'READY' || item.status === 'QUEUED';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'flex items-start gap-4 p-4 rounded-2xl transition-all shadow-sm',
        'bg-card border border-border hover:border-primary/30',
        isCompleted && 'border-l-2 border-l-emerald-500',
        isFailed && 'border-l-2 border-l-rose-500',
      )}
    >
      {/* File icon */}
      <div
        className={cn(
          'flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center',
          isCompleted
            ? 'bg-emerald-500/10 text-emerald-500'
            : isFailed
            ? 'bg-rose-500/10 text-rose-500'
            : 'bg-muted text-muted-foreground',
        )}
      >
        {React.createElement(getCategoryIcon(item.extension), { className: 'w-5 h-5' })}
      </div>

      {/* Center content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Name + status row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-foreground truncate">
              {truncate(item.originalName, 32)}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border uppercase shrink-0">
              .{item.extension}
            </span>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Size + savings + target status row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          <span>Orig: {formatFileSize(item.sizeBytes)}</span>
          {isCompleted && item.result && (
            <>
              <span className="text-muted-foreground/40">→</span>
              <span className="text-foreground font-semibold">Final: {formatFileSize(item.result.outputSizeBytes)}</span>
              <span className="font-bold text-emerald-500">
                −{item.result.savingsPercentage}%
              </span>

              {/* Target Size Indicators */}
              {item.result.metadata?.targetSizeKB && (
                <span className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                  Target: {item.result.metadata.targetSizeKB} KB
                </span>
              )}

              {item.result.metadata?.targetAchieved === true && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Target achieved
                </span>
              )}

              {item.result.metadata?.targetAchieved === false && item.result.metadata?.qualityWarning && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <AlertTriangle className="w-3 h-3" />
                  Floor reached
                </span>
              )}

              {item.result.metadata?.attemptsUsed && item.result.metadata.attemptsUsed > 1 && (
                <span className="text-[11px] font-mono text-muted-foreground">
                  ({item.result.metadata.attemptsUsed} passes)
                </span>
              )}

              {item.result.metadata?.compressionStrengthUsed && (
                <span className="text-[11px] font-mono text-muted-foreground">
                  [{item.result.metadata.compressionStrengthUsed}]
                </span>
              )}
            </>
          )}
        </div>

        {/* Quality warning if target couldn't be reached without degradation */}
        {isCompleted && item.result?.metadata?.qualityWarning && (
          <p className="text-xs text-amber-500 bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-500/20 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{item.result.metadata.qualityWarning}</span>
          </p>
        )}

        {/* Progress bar (only while processing/uploading) */}
        {(isProcessing || item.status === 'UPLOADING') && (
          <ForgeProgress
            label={item.originalName}
            percentage={item.processProgress}
            stage={item.currentStep || (isProcessing ? 'Processing' : 'Uploading')}
            onCancel={() => cancelItem(item.id)}
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
            <ForgeButton variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
              <X className="w-3.5 h-3.5" />
              <span className="text-xs">Remove</span>
            </ForgeButton>
          )}

          {isProcessing && (
            <ForgeButton variant="ghost" size="sm" onClick={() => cancelItem(item.id)}>
              <X className="w-3.5 h-3.5" />
              <span className="text-xs">Cancel</span>
            </ForgeButton>
          )}

          {isCompleted && (
            <>
              {item.result?.outputFileUrl && (
                <a
                  href={item.result.outputFileUrl}
                  download={item.result.outputName}
                  className="inline-flex"
                >
                  <ForgeButton variant="secondary" size="sm">
                    <Download className="w-3.5 h-3.5" />
                    <span className="text-xs">Download</span>
                  </ForgeButton>
                </a>
              )}
              <ForgeButton
                variant="ghost"
                size="sm"
                onClick={() => setComparisonItem(item)}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="text-xs">Compare</span>
              </ForgeButton>
              <ForgeButton variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                <X className="w-3.5 h-3.5" />
              </ForgeButton>
            </>
          )}

          {isFailed && (
            <>
              <ForgeButton variant="ghost" size="sm" onClick={() => retryItem(item.id)}>
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-xs">Retry</span>
              </ForgeButton>
              <ForgeButton variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                <X className="w-3.5 h-3.5" />
              </ForgeButton>
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
        <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm">
          <FileQuestion className="w-7 h-7 text-muted-foreground/40" />
        </div>
        <div className="text-center">
          <p className="text-sm text-foreground font-medium">No files in queue</p>
          <p className="text-xs text-muted-foreground mt-1">
            Drop files above to begin compressing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">
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

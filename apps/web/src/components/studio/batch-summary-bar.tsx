'use client';

import React, { useMemo } from 'react';
import {
  Play,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Files,
} from 'lucide-react';
import { useUploadStore } from '@/lib/stores/upload-store';
import { ForgeButton } from '@/components/sakuga/forge-button';
import { ForgeProgress } from '@/components/sakuga';
import { formatFileSize, cn } from '@/lib/utils';

export const BatchSummaryBar: React.FC = () => {
  const items = useUploadStore((s) => s.items);
  const isProcessingBatch = useUploadStore((s) => s.isProcessingBatch);
  const processAll = useUploadStore((s) => s.processAll);
  const downloadBatchZip = useUploadStore((s) => s.downloadBatchZip);
  const clearCompleted = useUploadStore((s) => s.clearCompleted);

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((i) => i.status === 'COMPLETED').length;
    const failed = items.filter((i) => i.status === 'FAILED').length;
    const ready = items.filter(
      (i) => i.status === 'READY' || i.status === 'QUEUED',
    ).length;
    const processing = items.filter((i) => i.status === 'PROCESSING').length;

    const totalOriginalBytes = items.reduce((sum, i) => sum + i.sizeBytes, 0);
    const totalCompressedBytes = items
      .filter((i) => i.status === 'COMPLETED' && i.result)
      .reduce((sum, i) => sum + (i.result?.outputSizeBytes ?? 0), 0);
    const totalSavedBytes = items
      .filter((i) => i.status === 'COMPLETED' && i.result)
      .reduce((sum, i) => sum + (i.result?.savedBytes ?? 0), 0);

    const originalOfCompleted = items
      .filter((i) => i.status === 'COMPLETED' && i.result)
      .reduce((sum, i) => sum + i.sizeBytes, 0);

    const savingsPercent =
      originalOfCompleted > 0
        ? Math.round((totalSavedBytes / originalOfCompleted) * 1000) / 10
        : 0;

    const overallProgress =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      failed,
      ready,
      processing,
      totalOriginalBytes,
      totalCompressedBytes,
      totalSavedBytes,
      savingsPercent,
      overallProgress,
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-[#0c0c14]/90 backdrop-blur-xl',
        'border-t border-white/10',
        'shadow-[0_-8px_30px_rgba(0,0,0,0.5)]',
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Stat chips */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <StatChip
              icon={<Files className="w-3.5 h-3.5" />}
              label={`${stats.total} file${stats.total !== 1 ? 's' : ''}`}
              color="text-violet-400"
            />

            {stats.completed > 0 && (
              <StatChip
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                label={`${stats.completed} done`}
                color="text-emerald-400"
              />
            )}

            {stats.failed > 0 && (
              <StatChip
                icon={<AlertCircle className="w-3.5 h-3.5" />}
                label={`${stats.failed} failed`}
                color="text-rose-400"
              />
            )}

            {stats.completed > 0 && (
              <>
                <span className="text-xs text-white/20 hidden sm:inline">•</span>
                <span className="text-xs text-white/50">
                  {formatFileSize(stats.totalOriginalBytes)} →{' '}
                  <span className="text-white/70">
                    {formatFileSize(stats.totalCompressedBytes)}
                  </span>
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  −{stats.savingsPercent}%
                </span>
              </>
            )}
          </div>

          {/* Overall progress */}
          <div className="flex-1 min-w-[120px] max-w-[200px] hidden md:block">
            <ForgeProgress
              value={stats.overallProgress}
              variant={stats.overallProgress >= 100 ? 'success' : 'default'}
              size="sm"
              showPercentage={false}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {stats.ready > 0 && (
              <ForgeButton
                variant="primary"
                size="sm"
                onClick={() => processAll()}
                loading={isProcessingBatch}
                disabled={isProcessingBatch}
              >
                <Play className="w-3.5 h-3.5 text-violet-300" />
                <span>
                  {isProcessingBatch
                    ? 'Processing...'
                    : `Process All (${stats.ready})`}
                </span>
              </ForgeButton>
            )}

            {stats.completed > 0 && (
              <ForgeButton
                variant="success"
                size="sm"
                onClick={() => downloadBatchZip()}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ZIP</span>
              </ForgeButton>
            )}

            {stats.completed > 0 && (
              <ForgeButton
                variant="ghost"
                size="sm"
                onClick={() => clearCompleted()}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Done</span>
              </ForgeButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Stat chip
// ---------------------------------------------------------------------------

function StatChip({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        'bg-white/[0.06] border border-white/10',
        color,
      )}
    >
      {icon}
      {label}
    </span>
  );
}

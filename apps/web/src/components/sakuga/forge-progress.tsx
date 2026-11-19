'use client';

import React, { useEffect, useRef } from 'react';
import { RotateCcw, XCircle, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SakugaProgressElement } from '@/types/sakuga';

export type PipelineStage =
  | 'Uploading'
  | 'Validating'
  | 'Scanning'
  | 'Queued'
  | 'Processing'
  | 'Optimizing'
  | 'Finalizing'
  | 'Ready';

export const PIPELINE_STAGES: PipelineStage[] = [
  'Uploading',
  'Validating',
  'Scanning',
  'Queued',
  'Processing',
  'Optimizing',
  'Finalizing',
  'Ready',
];

export interface ForgeProgressProps {
  label?: string;
  percentage?: number; // 0 to 100
  value?: number; // alias for percentage
  stage?: PipelineStage | string;
  elapsedSeconds?: number;
  remainingSeconds?: number;
  queuePosition?: number;
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string;
  isSuccess?: boolean;
  className?: string;
  size?: string;
  variant?: string;
  showPercentage?: boolean;
  showLabel?: boolean;
  showPipeline?: boolean;
  [key: string]: any;
}

export const ForgeProgress: React.FC<ForgeProgressProps> = ({
  label,
  percentage,
  value,
  stage,
  elapsedSeconds,
  remainingSeconds,
  queuePosition,
  onCancel,
  onRetry,
  error,
  isSuccess = false,
  className,
  size,
  variant,
  showPercentage = true,
  showLabel = true,
  showPipeline,
}) => {
  const progressRef = useRef<SakugaProgressElement | null>(null);
  const currentPercent = Math.min(100, Math.max(0, percentage ?? value ?? 0));

  // Sync percentage to Sakuga progress Web Component (0.0 to 1.0)
  useEffect(() => {
    if (progressRef.current?.set) {
      const normalized = Math.min(1, Math.max(0, currentPercent / 100));
      progressRef.current.set(normalized);
    }
  }, [currentPercent]);

  const effectiveStage = stage || (currentPercent >= 100 ? 'Ready' : 'Processing');
  const currentStageIndex = PIPELINE_STAGES.indexOf(effectiveStage as PipelineStage);
  const displayPipeline = showPipeline ?? (stage !== undefined || elapsedSeconds !== undefined || remainingSeconds !== undefined || queuePosition !== undefined);

  return (
    <div
      className={cn(
        'p-5 rounded-2xl bg-[var(--sk-surface)] border transition-all space-y-3.5',
        error
          ? 'border-rose-500/40 bg-rose-950/20'
          : isSuccess
          ? 'border-emerald-500/40 bg-emerald-950/20'
          : 'border-[var(--sk-border)]',
        className
      )}
    >
      {/* Top Header: Label, Stage pill, and Percentage */}
      {(Boolean(label) || showPercentage) && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {Boolean(label) && <span className="text-sm font-bold text-[var(--sk-text)] truncate">{label}</span>}
            {stage && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[var(--sk-surface-raised)] border border-[var(--sk-border)] text-[var(--sk-pri)] font-semibold shrink-0">
                {stage}
              </span>
            )}
            {typeof queuePosition === 'number' && queuePosition > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                #{queuePosition} in queue
              </span>
            )}
          </div>

          {showPercentage && (
            <div className="text-right shrink-0">
              <span className="font-mono text-sm font-extrabold text-[var(--sk-acc)]">
                {Math.round(currentPercent)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Official Sakuga VFX Progress Bar with storm cloud & ドン! burst */}
      <div className="py-1">
        <sakuga-progress
          ref={progressRef as any}
          label={label || 'Progress'}
          class="w-full"
        />
      </div>

      {/* 8-Stage Real Pipeline Tracker */}
      {displayPipeline && (
        <div className="grid grid-cols-8 gap-1 pt-1">
        {PIPELINE_STAGES.map((stg, idx) => {
          const isDone = currentStageIndex > idx || isSuccess;
          const isCurrent = currentStageIndex === idx && !isSuccess && !error;
          return (
            <div key={stg} className="flex flex-col items-center">
              <div
                className={cn(
                  'h-1.5 w-full rounded-full transition-all duration-300',
                  isDone
                    ? 'bg-emerald-400'
                    : isCurrent
                    ? 'bg-gradient-to-r from-[var(--sk-pri)] to-[var(--sk-acc)] animate-pulse'
                    : 'bg-white/10'
                )}
              />
              <span className="text-[8px] font-mono uppercase text-[var(--sk-text-muted)] mt-1 hidden sm:block truncate">
                {stg.slice(0, 4)}
              </span>
            </div>
          );
        })}
      </div>
      )}

      {/* Bottom Row: Metrics & Controls */}
      <div className="flex items-center justify-between text-xs font-mono text-[var(--sk-text-muted)] pt-1">
        <div className="flex items-center gap-3">
          {typeof elapsedSeconds === 'number' && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              <span>{elapsedSeconds}s elapsed</span>
            </span>
          )}
          {typeof remainingSeconds === 'number' && (
            <span className="text-gray-400">
              ~{remainingSeconds}s remaining
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {error && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}

          {!isSuccess && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}

          {isSuccess && (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </span>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

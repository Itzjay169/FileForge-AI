'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CommandPalette } from '@/components/layout/command-palette';
import { useUploadStore } from '@/lib/stores/upload-store';
import {
  ForgeButton,
  ForgeButtonRef,
  ForgeTabs,
  ForgeProgress,
  ForgeRating,
  forgeToast,
} from '@/components/sakuga';
import {
  Layers,
  Download,
  Trash2,
  RotateCcw,
  UploadCloud,
  FileVideo,
  FileImage,
  FileText,
  Archive,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

export default function QueuePage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const downloadAllBtnRef = useRef<ForgeButtonRef>(null);

  const items = useUploadStore((s) => s.items);
  const cancelItem = useUploadStore((s) => s.cancelItem);
  const retryItem = useUploadStore((s) => s.retryItem);
  const removeItem = useUploadStore((s) => s.removeItem);
  const clearCompleted = useUploadStore((s) => s.clearCompleted);
  const downloadBatchZip = useUploadStore((s) => s.downloadBatchZip);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    if (activeFilter === 'ACTIVE') {
      return items.filter((i) => i.status === 'PROCESSING' || i.status === 'UPLOADING' || i.status === 'QUEUED');
    }
    if (activeFilter === 'COMPLETED') {
      return items.filter((i) => i.status === 'COMPLETED');
    }
    if (activeFilter === 'FAILED') {
      return items.filter((i) => i.status === 'FAILED');
    }
    return items;
  }, [items, activeFilter]);

  const activeCount = items.filter((i) => i.status === 'PROCESSING' || i.status === 'UPLOADING' || i.status === 'QUEUED').length;
  const completedCount = items.filter((i) => i.status === 'COMPLETED').length;
  const failedCount = items.filter((i) => i.status === 'FAILED').length;

  const handleDownloadAll = async () => {
    downloadAllBtnRef.current?.done();
    forgeToast.success('Archiving batch into ZIP package...');
    await downloadBatchZip();
  };

  const getIcon = (ext: string) => {
    const e = ext.toLowerCase();
    if (['mp4', 'mov', 'webm'].includes(e)) return <FileVideo className="w-5 h-5 text-pink-400" />;
    if (['jpg', 'png', 'webp', 'avif'].includes(e)) return <FileImage className="w-5 h-5 text-violet-400" />;
    if (['zip', 'tar', '7z'].includes(e)) return <Archive className="w-5 h-5 text-emerald-400" />;
    return <FileText className="w-5 h-5 text-blue-400" />;
  };

  return (
    <div className="relative min-h-screen bg-[var(--sk-bg)] text-[var(--sk-text)] overflow-x-hidden selection:bg-pink-500/25 selection:text-pink-300">
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      <main className="pt-28 pb-32 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300 mb-3 font-mono">
              <Layers className="w-3.5 h-3.5 text-pink-400" />
              <span>Real-Time Job Orchestration</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
              Processing Queue
            </h1>
            <p className="mt-2 text-sm text-[var(--sk-text-muted)] max-w-xl">
              Inspect active compression pipelines, retry interrupted tasks, and download completed artifacts with Sakuga kinetic feedback.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {completedCount > 0 && (
              <>
                <ForgeButton
                  ref={downloadAllBtnRef}
                  variant="primary"
                  size="md"
                  onClick={handleDownloadAll}
                >
                  <Download className="w-4 h-4 text-[var(--sk-acc)]" />
                  <span>Download All as ZIP</span>
                </ForgeButton>

                <ForgeButton
                  variant="ghost"
                  size="md"
                  onClick={clearCompleted}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Done</span>
                </ForgeButton>
              </>
            )}

            <Link href="/studio">
              <ForgeButton variant="paper" size="md">
                <UploadCloud className="w-4 h-4 text-[#09090e]" />
                <span className="text-[#09090e]">Upload More</span>
              </ForgeButton>
            </Link>
          </div>
        </div>

        {/* Filter Tabs using ForgeTabs */}
        <div className="mb-8">
          <ForgeTabs
            activeTab={activeFilter}
            onChange={(tab) => setActiveFilter(tab)}
            tabs={[
              { id: 'ALL', label: `All Jobs (${items.length})` },
              { id: 'ACTIVE', label: `Active (${activeCount})` },
              { id: 'COMPLETED', label: `Completed (${completedCount})` },
              { id: 'FAILED', label: `Failed (${failedCount})` },
            ]}
          />
        </div>

        {/* Jobs List / Empty State */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-3xl bg-[var(--sk-surface)] border border-[var(--sk-border)] border-dashed">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/30 to-pink-500/30 flex items-center justify-center mx-auto mb-4 border border-violet-500/20">
              <Layers className="w-8 h-8 text-[var(--sk-pri)]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-sans">No jobs in this view</h3>
            <p className="text-sm text-[var(--sk-text-muted)] max-w-md mx-auto mb-6">
              Drop audio, video, images, or documents into the studio to begin processing with up to 90% size reduction.
            </p>
            <Link href="/studio">
              <ForgeButton variant="primary" size="lg">
                <UploadCloud className="w-4 h-4 text-[var(--sk-acc)]" />
                <span>Go to Studio</span>
              </ForgeButton>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const isDone = job.status === 'COMPLETED';
              const isFailed = job.status === 'FAILED';
              const isRunning = job.status === 'PROCESSING' || job.status === 'UPLOADING';

              return (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl bg-[var(--sk-surface)] border border-[var(--sk-border)] hover:border-violet-500/30 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[var(--sk-surface-raised)] flex items-center justify-center shrink-0 border border-[var(--sk-border)]">
                        {getIcon(job.extension)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white truncate">{job.originalName}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[var(--sk-text-muted)] border border-white/10 uppercase shrink-0">
                            .{job.extension}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-[var(--sk-text-muted)] mt-0.5">
                          <span>{formatFileSize(job.sizeBytes)}</span>
                          {isDone && job.result && (
                            <>
                              <span>→</span>
                              <span className="text-white font-bold">{formatFileSize(job.result.outputSizeBytes)}</span>
                              <span className="text-emerald-400 font-extrabold">−{job.result.savingsPercentage}%</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isDone && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </span>

                          {job.result?.outputFileUrl && (
                            <a href={job.result.outputFileUrl} download={job.result.outputName}>
                              <ForgeButton variant="success" size="sm">
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </ForgeButton>
                            </a>
                          )}
                        </div>
                      )}

                      {isFailed && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Failed</span>
                          </span>
                          <ForgeButton variant="secondary" size="sm" onClick={() => retryItem(job.id)}>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Retry</span>
                          </ForgeButton>
                        </div>
                      )}

                      {isRunning && (
                        <ForgeButton variant="ghost" size="sm" onClick={() => cancelItem(job.id)}>
                          <span>Cancel</span>
                        </ForgeButton>
                      )}

                      <button
                        onClick={() => removeItem(job.id)}
                        className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        title="Remove from queue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Active Job Progress */}
                  {isRunning && (
                    <ForgeProgress
                      label={job.originalName}
                      percentage={job.processProgress}
                      stage={job.currentStep || 'Processing'}
                      onCancel={() => cancelItem(job.id)}
                    />
                  )}

                  {/* Completed job rating prompt */}
                  {isDone && (
                    <div className="pt-2 border-t border-[var(--sk-border)]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <span className="text-[var(--sk-text-muted)] font-mono flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                        Rate output quality:
                      </span>
                      <ForgeRating
                        label=""
                        value={5}
                        onChange={(val) => forgeToast.success(`Thank you! Recorded ${val}★ feedback.`)}
                        className="py-1 px-2 bg-transparent border-0"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}

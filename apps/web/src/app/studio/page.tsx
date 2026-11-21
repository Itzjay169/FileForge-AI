'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { CommandPalette } from '@/components/layout/command-palette';
import { StudioDropzone } from '@/components/studio/studio-dropzone';
import { CompressionPresetsBar } from '@/components/studio/compression-presets-bar';
import { CustomControlsPanel } from '@/components/studio/custom-controls-panel';
import { BatchQueueList } from '@/components/studio/batch-queue-list';
import { BatchSummaryBar } from '@/components/studio/batch-summary-bar';
import { BeforeAfterComparator } from '@/components/studio/before-after-comparator';
import { useUploadStore } from '@/lib/stores/upload-store';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function StudioPage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const comparisonItem = useUploadStore((s) => s.comparisonItem);
  const setComparisonItem = useUploadStore((s) => s.setComparisonItem);

  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200">
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-violet-500/10 border border-violet-500/30 backdrop-blur-md mb-4">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-xs font-semibold text-primary">
              Compression Studio
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-2">
            Forge Your Files
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Drop files, select a preset, fine-tune settings, and compress with
            Sakuga-powered precision. Up to 2 GB free.
          </p>
        </motion.div>

        {/* Dropzone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <StudioDropzone />
        </motion.div>

        {/* Presets Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6"
        >
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Compression Presets
          </h3>
          <CompressionPresetsBar />
        </motion.div>

        {/* Custom Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <CustomControlsPanel />
        </motion.div>

        {/* Batch Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <BatchQueueList />
        </motion.div>
      </main>

      {/* Batch Summary Sticky Bar */}
      <BatchSummaryBar />

      {/* Before/After Comparator Modal */}
      <BeforeAfterComparator
        item={comparisonItem}
        onClose={() => setComparisonItem(null)}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}

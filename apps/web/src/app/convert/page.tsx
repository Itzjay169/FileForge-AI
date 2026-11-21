'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { CommandPalette } from '@/components/layout/command-palette';
import { ConversionDropzone } from '@/components/convert/conversion-dropzone';
import { ConversionOptionsDrawer } from '@/components/convert/conversion-options-drawer';
import { ConversionQueueList } from '@/components/convert/conversion-queue-list';
import { ConversionHistoryList } from '@/components/convert/conversion-history-list';
import { useConversionStore } from '@/lib/stores/conversion-store';
import { motion } from 'framer-motion';
import {  RefreshCw } from 'lucide-react';

export default function ConvertPage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const globalOptions = useConversionStore((s) => s.globalOptions);
  const globalTargetFormat = useConversionStore((s) => s.globalTargetFormat);
  
  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200">
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-violet-500/10 border border-violet-500/30 backdrop-blur-md mb-4 shadow-sm">
            <RefreshCw className="w-3.5 h-3.5 text-pink-400 animate-spin-slow" />
            <span className="text-xs font-semibold text-primary">
              Universal Conversion Engine • 100+ Compatible Formats
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            Transcode Any File Format
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Convert documents, spreadsheets, raster/vector images, videos, audio tracks, archives, and 3D meshes with clear compatibility warnings.
          </p>
        </motion.div>

        {/* Dropzone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ConversionDropzone />
        </motion.div>

        {/* Advanced Options Drawer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <ConversionOptionsDrawer
            options={globalOptions}
            targetFormat={globalTargetFormat}
            onChange={(newOpts) => {
              useConversionStore.setState((state) => ({
                globalOptions: { ...state.globalOptions, ...newOpts }
              }));
            }}
          />
        </motion.div>

        {/* Active Conversion Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ConversionQueueList />
        </motion.div>

        {/* Conversion History & Re-download */}
        <ConversionHistoryList />
      </main>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}

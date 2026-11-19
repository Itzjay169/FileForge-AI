'use client';

import { create } from 'zustand';
import {
  ConversionQueueItem,
  ConversionOptions,
  ConversionHistoryItem,
  JobResult
} from '@fileforge/shared';
import { fileRegistry } from '@fileforge/file-registry';
import { forgeToast } from '@/components/ui/sakuga-toast';

interface ConversionStoreState {
  items: ConversionQueueItem[];
  globalTargetFormat: string;
  globalOptions: ConversionOptions;
  lossyWarningItem: ConversionQueueItem | null;
  history: ConversionHistoryItem[];
  isProcessingBatch: boolean;

  // Actions
  addFiles: (files: File[]) => void;
  setGlobalTargetFormat: (format: string) => void;
  setItemTargetFormat: (id: string, format: string) => void;
  setItemOptions: (id: string, options: Partial<ConversionOptions>) => void;
  setLossyWarningItem: (item: ConversionQueueItem | null) => void;
  confirmLossyAndProceed: (id: string) => Promise<void>;
  processItem: (id: string) => Promise<void>;
  processAll: () => Promise<void>;
  removeItem: (id: string) => void;
  clearCompleted: () => void;
  clearHistory: () => void;
  downloadBatchZip: () => Promise<void>;
  loadHistoryFromStorage: () => void;
  reconvertFromHistory: (historyItem: ConversionHistoryItem, newTarget: string) => void;
}

const HISTORY_STORAGE_KEY = 'fileforge_conversion_history_v1';

export const useConversionStore = create<ConversionStoreState>((set, get) => ({
  items: [],
  globalTargetFormat: 'pdf',
  globalOptions: {
    targetFormat: 'pdf',
    quality: 85,
    preserveMetadata: true
  },
  lossyWarningItem: null,
  history: [],
  isProcessingBatch: false,

  loadHistoryFromStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        set({ history: JSON.parse(saved) });
      }
    } catch {}
  },

  addFiles: (files: File[]) => {
    const globalTarget = get().globalTargetFormat;
    const globalOpts = get().globalOptions;

    const newItems: ConversionQueueItem[] = files.map((file) => {
      const parts = file.name.split('.');
      const sourceExt = parts.length > 1 ? parts.pop()!.toLowerCase() : '';

      // Determine default compatible target
      const sourceFormat = fileRegistry.getFormat(sourceExt);
      let targetExt = globalTarget;

      // If global target is not supported for this source, fallback to first supported target
      if (sourceFormat && !sourceFormat.conversionTargets.map(t => t.toLowerCase()).includes(targetExt)) {
        targetExt = sourceFormat.conversionTargets[0] || 'pdf';
      }

      // Check lossiness
      const check = fileRegistry.canConvert(sourceExt, targetExt);

      return {
        id: crypto.randomUUID(),
        file,
        originalName: file.name,
        sizeBytes: file.size,
        sourceExtension: sourceExt,
        targetExtension: targetExt,
        mimeType: file.type || 'application/octet-stream',
        status: 'READY',
        uploadProgress: 100,
        processProgress: 0,
        currentStep: `Ready to convert to .${targetExt.toUpperCase()}`,
        options: { ...globalOpts, targetFormat: targetExt },
        isLossy: check.isLossy,
        lossWarningTitle: check.warning,
        lostAttributes: check.lostAttributes,
        lossRecommendation: check.recommendation,
        createdAt: Date.now()
      };
    });

    set((state) => ({
      items: [...newItems, ...state.items]
    }));

    forgeToast.success(
      `Added ${files.length} file${files.length > 1 ? 's' : ''}`,
      'Select conversion targets or customize format settings.'
    );
  },

  setGlobalTargetFormat: (format: string) => {
    const clean = format.toLowerCase().replace(/^\./, '');
    set({
      globalTargetFormat: clean,
      globalOptions: { ...get().globalOptions, targetFormat: clean }
    });

    // Update compatible queued items
    set((state) => ({
      items: state.items.map((item) => {
        if (item.status === 'READY') {
          const sourceFormat = fileRegistry.getFormat(item.sourceExtension);
          const isAllowed = sourceFormat?.conversionTargets.map(t => t.toLowerCase()).includes(clean);

          if (isAllowed) {
            const check = fileRegistry.canConvert(item.sourceExtension, clean);
            return {
              ...item,
              targetExtension: clean,
              options: { ...item.options, targetFormat: clean },
              isLossy: check.isLossy,
              lossWarningTitle: check.warning,
              lostAttributes: check.lostAttributes,
              lossRecommendation: check.recommendation,
              currentStep: `Ready to convert to .${clean.toUpperCase()}`
            };
          }
        }
        return item;
      })
    }));

    forgeToast.info(`Target Format: .${clean.toUpperCase()}`);
  },

  setItemTargetFormat: (id: string, targetFormat: string) => {
    const clean = targetFormat.toLowerCase().replace(/^\./, '');
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          const check = fileRegistry.canConvert(item.sourceExtension, clean);
          return {
            ...item,
            targetExtension: clean,
            options: { ...item.options, targetFormat: clean },
            isLossy: check.isLossy,
            lossWarningTitle: check.warning,
            lostAttributes: check.lostAttributes,
            lossRecommendation: check.recommendation,
            currentStep: `Ready to convert to .${clean.toUpperCase()}`
          };
        }
        return item;
      })
    }));
  },

  setItemOptions: (id: string, options: Partial<ConversionOptions>) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, options: { ...item.options, ...options } } : item
      )
    }));
  },

  setLossyWarningItem: (item: ConversionQueueItem | null) => {
    set({ lossyWarningItem: item });
  },

  confirmLossyAndProceed: async (id: string) => {
    set({ lossyWarningItem: null });
    await get().processItem(id);
  },

  processItem: async (id: string) => {
    const item = get().items.find((i) => i.id === id);
    if (!item || !item.file) return;

    // Check if lossy and not yet confirmed
    if (item.isLossy && get().lossyWarningItem?.id !== id) {
      set({ lossyWarningItem: item });
      return;
    }

    set((state) => ({
      items: state.items.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'PROCESSING',
              processProgress: 20,
              currentStep: `Initializing ${item.sourceExtension.toUpperCase()} → ${item.targetExtension.toUpperCase()} engine...`
            }
          : i
      )
    }));

    try {
      const formData = new FormData();
      formData.append('file', item.file);
      formData.append('targetFormat', item.targetExtension);
      formData.append('options', JSON.stringify(item.options));

      // Simulate intermediate conversion progress
      setTimeout(() => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.status === 'PROCESSING'
              ? { ...i, processProgress: 65, currentStep: 'Transcoding bitstreams and restructuring container...' }
              : i
          )
        }));
      }, 350);

      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error?.message || 'Conversion failed.');
      }

      const result: JobResult = json.data;

      // Update item
      set((state) => ({
        items: state.items.map((i) =>
          i.id === id
            ? {
                ...i,
                status: 'COMPLETED',
                processProgress: 100,
                currentStep: 'Conversion completed!',
                result,
                previewDataUrl: result.previewUrl
              }
            : i
        )
      }));

      // Add to conversion history
      const historyEntry: ConversionHistoryItem = {
        id: crypto.randomUUID(),
        originalName: item.originalName,
        outputName: result.outputName,
        sourceExtension: item.sourceExtension,
        targetExtension: item.targetExtension,
        inputSizeBytes: result.originalSizeBytes,
        outputSizeBytes: result.outputSizeBytes,
        downloadUrl: result.outputFileUrl,
        previewUrl: result.previewUrl,
        isLossy: !!item.isLossy,
        durationMs: result.durationMs,
        convertedAt: Date.now()
      };

      const updatedHistory = [historyEntry, ...get().history.slice(0, 49)];
      set({ history: updatedHistory });
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
        } catch {}
      }

      forgeToast.success(
        `Converted: ${result.outputName}`,
        `Transcoded from .${item.sourceExtension} to .${item.targetExtension} in ${result.durationMs}ms.`
      );
    } catch (err: any) {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === id
            ? { ...i, status: 'FAILED', error: err.message, currentStep: 'Conversion Failed' }
            : i
        )
      }));
      forgeToast.error(`Failed: ${item.originalName}`, err.message);
    }
  },

  processAll: async () => {
    const readyItems = get().items.filter(
      (i) => i.status === 'READY' || i.status === 'FAILED'
    );

    if (readyItems.length === 0) {
      forgeToast.info('Queue Empty', 'No ready files to convert.');
      return;
    }

    set({ isProcessingBatch: true });
    forgeToast.info('Batch Conversion Started', `Converting ${readyItems.length} files...`);

    const queue = [...readyItems];
    const workers = Array(Math.min(3, queue.length))
      .fill(null)
      .map(async () => {
        while (queue.length > 0) {
          const next = queue.shift();
          if (next) {
            await get().processItem(next.id);
          }
        }
      });

    await Promise.all(workers);
    set({ isProcessingBatch: false });
    forgeToast.success('Batch Complete! (ドン!)', 'All conversion tasks completed.');
  },

  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id)
    }));
  },

  clearCompleted: () => {
    set((state) => ({
      items: state.items.filter((i) => i.status !== 'COMPLETED')
    }));
    forgeToast.info('Queue Cleared', 'Completed items removed from active list.');
  },

  clearHistory: () => {
    set({ history: [] });
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
      } catch {}
    }
    forgeToast.info('History Cleared');
  },

  downloadBatchZip: async () => {
    const completedItems = get().items.filter((i) => i.status === 'COMPLETED' && i.result);
    if (completedItems.length === 0) {
      forgeToast.warning('No completed files', 'Convert files first before downloading batch ZIP.');
      return;
    }

    const toastId = forgeToast.loading('Bundling converted outputs into ZIP archive...');
    try {
      const storageKeys = completedItems
        .map((i) => (i.result as any).storageKey)
        .filter(Boolean);
      const filenames = completedItems.map((i) => i.result!.outputName);

      const res = await fetch('/api/batch/download-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storageKeys, filenames })
      });

      if (!res.ok) throw new Error('Failed to assemble ZIP');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fileforge-converted-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      forgeToast.dismiss(toastId);
      forgeToast.success('Batch Download Ready', 'ZIP bundle downloaded.');
    } catch (err: any) {
      forgeToast.dismiss(toastId);
      forgeToast.error('Batch Download Failed', err.message);
    }
  },

  reconvertFromHistory: (historyItem: ConversionHistoryItem, newTarget: string) => {
    forgeToast.info(
      'Shortcut Activated',
      `Drop your file to convert into .${newTarget.toUpperCase()}.`
    );
    get().setGlobalTargetFormat(newTarget);
  }
}));

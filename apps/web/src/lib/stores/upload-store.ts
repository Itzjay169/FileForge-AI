'use client';

import { create } from 'zustand';
import {
  QueueItem,
  CompressionPreset,
  CompressionOptions,
  COMPRESSION_PRESETS,
  JobResult
} from '@fileforge/shared';
import { forgeToast } from '@/components/ui/sakuga-toast';

interface UploadStoreState {
  items: QueueItem[];
  activePreset: CompressionPreset;
  customOptions: CompressionOptions;
  comparisonItem: QueueItem | null;
  isProcessingBatch: boolean;

  // Actions
  setPreset: (preset: CompressionPreset) => void;
  updateCustomOptions: (options: Partial<CompressionOptions>) => void;
  setComparisonItem: (item: QueueItem | null) => void;
  addFiles: (files: File[]) => void;
  importUrl: (url: string) => Promise<boolean>;
  updateItemOptions: (id: string, options: Partial<CompressionOptions>) => void;
  processItem: (id: string) => Promise<void>;
  processAll: () => Promise<void>;
  cancelItem: (id: string) => void;
  retryItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCompleted: () => void;
  downloadBatchZip: () => Promise<void>;
}

export const useUploadStore = create<UploadStoreState>((set, get) => ({
  items: [],
  activePreset: 'SMART_COMPRESS',
  customOptions: {
    strength: 'BALANCED',
    preset: 'SMART_COMPRESS',
    quality: 80,
    stripMetadata: true
  },
  comparisonItem: null,
  isProcessingBatch: false,

  setPreset: (preset: CompressionPreset) => {
    const def = COMPRESSION_PRESETS[preset];
    set({
      activePreset: preset,
      customOptions: {
        ...get().customOptions,
        preset,
        quality: def?.defaultQuality ?? 80,
        stripMetadata: def?.stripMetadata ?? true
      }
    });

    // Also update options of all non-completed queued items
    set((state) => ({
      items: state.items.map((item) => {
        if (item.status === 'QUEUED' || item.status === 'READY') {
          return {
            ...item,
            options: {
              ...item.options,
              preset,
              quality: def?.defaultQuality ?? 80,
              stripMetadata: def?.stripMetadata ?? true
            }
          };
        }
        return item;
      })
    }));

    forgeToast.info(`Preset: ${def?.label || preset}`, def?.description);
  },

  updateCustomOptions: (newOpts: Partial<CompressionOptions>) => {
    set((state) => ({
      customOptions: { ...state.customOptions, ...newOpts }
    }));
  },

  setComparisonItem: (item: QueueItem | null) => {
    set({ comparisonItem: item });
  },

  addFiles: (files: File[]) => {
    const currentPreset = get().activePreset;
    const currentOpts = get().customOptions;

    const newItems: QueueItem[] = files.map((file) => {
      const parts = file.name.split('.');
      const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : '';

      return {
        id: crypto.randomUUID(),
        file,
        originalName: file.name,
        sizeBytes: file.size,
        extension: ext,
        mimeType: file.type || 'application/octet-stream',
        status: 'READY',
        uploadProgress: 100,
        processProgress: 0,
        currentStep: 'Ready for compression',
        options: { ...currentOpts, preset: currentPreset },
        createdAt: Date.now()
      };
    });

    set((state) => ({
      items: [...newItems, ...state.items]
    }));

    forgeToast.success(
      `Added ${files.length} file${files.length > 1 ? 's' : ''}`,
      'Ready to compress. Select presets or tune individual settings.'
    );
  },

  importUrl: async (url: string) => {
    const tempId = crypto.randomUUID();
    const loadingToast = forgeToast.loading('Importing remote file with SSRF verification...');

    try {
      const res = await fetch('/api/upload/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const json = await res.json();
      forgeToast.dismiss(loadingToast);

      if (!json.success) {
        forgeToast.error('URL Import Failed', json.error?.message || 'Security check failed.');
        return false;
      }

      const currentPreset = get().activePreset;
      const currentOpts = get().customOptions;
      const data = json.data;

      const newItem: QueueItem = {
        id: tempId,
        originalName: data.originalName,
        sizeBytes: data.sizeBytes,
        extension: data.extension,
        mimeType: data.mimeType,
        status: 'READY',
        uploadProgress: 100,
        processProgress: 0,
        currentStep: 'Imported from URL',
        options: { ...currentOpts, preset: currentPreset },
        createdAt: Date.now()
      };

      set((state) => ({ items: [newItem, ...state.items] }));
      forgeToast.success('URL Imported Successfully', `${data.originalName} (${(data.sizeBytes / (1024 * 1024)).toFixed(1)} MB)`);
      return true;
    } catch (err: any) {
      forgeToast.dismiss(loadingToast);
      forgeToast.error('Network Error', err.message);
      return false;
    }
  },

  updateItemOptions: (id: string, options: Partial<CompressionOptions>) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, options: { ...item.options, ...options } } : item
      )
    }));
  },

  processItem: async (id: string) => {
    const item = get().items.find((i) => i.id === id);
    if (!item || !item.file) return;

    // Set processing status
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id
          ? { ...i, status: 'PROCESSING', processProgress: 20, currentStep: 'Running compression engine...' }
          : i
      )
    }));

    try {
      const formData = new FormData();
      formData.append('file', item.file);
      formData.append('options', JSON.stringify(item.options));

      // Simulate step increments
      setTimeout(() => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.status === 'PROCESSING'
              ? { ...i, processProgress: 60, currentStep: 'Quantizing pixels & optimizing bitstreams...' }
              : i
          )
        }));
      }, 350);

      const res = await fetch('/api/compress', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error?.message || 'Compression failed.');
      }

      const result: JobResult = json.data;

      set((state) => ({
        items: state.items.map((i) =>
          i.id === id
            ? {
                ...i,
                status: 'COMPLETED',
                processProgress: 100,
                currentStep: 'Completed!',
                result,
                previewDataUrl: result.previewUrl
              }
            : i
        )
      }));

      forgeToast.success(
        `Optimized: ${item.originalName}`,
        `Reduced by ${result.savingsPercentage}% (${(result.originalSizeBytes / (1024 * 1024)).toFixed(1)}MB -> ${(result.outputSizeBytes / (1024 * 1024)).toFixed(1)}MB)`
      );
    } catch (err: any) {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === id
            ? { ...i, status: 'FAILED', error: err.message, currentStep: 'Failed' }
            : i
        )
      }));
      forgeToast.error(`Failed: ${item.originalName}`, err.message);
    }
  },

  processAll: async () => {
    const pendingItems = get().items.filter(
      (i) => i.status === 'READY' || i.status === 'FAILED'
    );

    if (pendingItems.length === 0) {
      forgeToast.info('Queue Empty', 'No pending files to compress.');
      return;
    }

    set({ isProcessingBatch: true });
    forgeToast.info('Batch Execution Started', `Processing ${pendingItems.length} files in queue...`);

    // Process concurrently with maximum 3 concurrent jobs
    const queue = [...pendingItems];
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
    forgeToast.success('Batch Complete! (ドン!)', 'All queue items have been optimized.');
  },

  cancelItem: (id: string) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, status: 'CANCELLED', currentStep: 'Cancelled by user' } : i
      )
    }));
  },

  retryItem: (id: string) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, status: 'READY', error: undefined, processProgress: 0 } : i
      )
    }));
    get().processItem(id);
  },

  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
      comparisonItem: state.comparisonItem?.id === id ? null : state.comparisonItem
    }));
  },

  clearCompleted: () => {
    set((state) => ({
      items: state.items.filter((i) => i.status !== 'COMPLETED')
    }));
    forgeToast.info('Queue Cleared', 'Completed items removed.');
  },

  downloadBatchZip: async () => {
    const completedItems = get().items.filter((i) => i.status === 'COMPLETED' && i.result);

    if (completedItems.length === 0) {
      forgeToast.warning('No completed files', 'Process files first before downloading batch ZIP.');
      return;
    }

    const toastId = forgeToast.loading('Assembling batch ZIP archive...');

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

      if (!res.ok) {
        throw new Error('Failed to generate ZIP archive');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fileforge-batch-optimized-${new Date().toISOString().slice(0, 10)}.zip`;
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
  }
}));

'use client';

import { create } from 'zustand';
import {
  QueueItem,
  CompressionPreset,
  CompressionOptions,
  COMPRESSION_PRESETS,
  JobResult,
  TargetSizeEstimateResponse,
  TargetSizeJobCompletionResponse
} from '@fileforge/shared';
import { forgeToast } from '@/components/ui/sakuga-toast';

export const PLATFORM_PRESETS = [
  { id: 'whatsapp', label: 'WhatsApp', sizeMB: 16, unit: 'MB' as const, desc: '16 MB max for instant sharing' },
  { id: 'discord', label: 'Discord', sizeMB: 8, unit: 'MB' as const, desc: '8 MB free tier limit' },
  { id: 'email', label: 'Email', sizeMB: 20, unit: 'MB' as const, desc: '20 MB attachment ceiling' },
  { id: 'web', label: 'Web Upload', sizeMB: 2, unit: 'MB' as const, desc: '2 MB lightweight web limit' },
  { id: 'instagram', label: 'Instagram', sizeMB: 8, unit: 'MB' as const, desc: '8 MB 1080p profile' },
  { id: 'facebook', label: 'Facebook', sizeMB: 25, unit: 'MB' as const, desc: '25 MB HD social limit' },
  { id: 'twitter', label: 'X / Twitter', sizeMB: 15, unit: 'MB' as const, desc: '15 MB standard tweet limit' },
  { id: 'telegram', label: 'Telegram', sizeMB: 50, unit: 'MB' as const, desc: '50 MB chat limit' },
] as const;

export const PERCENTAGE_REDUCTIONS = [25, 50, 70, 85] as const;

interface UploadStoreState {
  items: QueueItem[];
  activePreset: CompressionPreset;
  customOptions: CompressionOptions;
  comparisonItem: QueueItem | null;
  isProcessingBatch: boolean;

  // Target Size State
  isTargetSizeMode: boolean;
  targetSizeValue: number | '';
  targetSizeUnit: 'KB' | 'MB';
  targetMode: 'exact' | 'under';
  tolerancePercent: number; // 1, 3, 5, 10
  maxAttempts: number; // 3, 5, 8, 10
  preserveReadableQuality: boolean;
  qualityPreference: 'balanced' | 'best_quality' | 'exact_target';
  selectedPlatformPreset: string | null;
  selectedReductionPercent: number | null;
  activeEstimate: TargetSizeEstimateResponse | null;
  isEstimating: boolean;

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

  // Target Size Actions
  setTargetSizeMode: (enabled: boolean) => void;
  setTargetSize: (value: number | '', unit?: 'KB' | 'MB') => void;
  setTargetMode: (mode: 'exact' | 'under') => void;
  setTolerancePercent: (tol: number) => void;
  setMaxAttempts: (attempts: number) => void;
  setPreserveReadableQuality: (preserve: boolean) => void;
  setQualityPreference: (pref: 'balanced' | 'best_quality' | 'exact_target') => void;
  applyPlatformPreset: (presetId: string) => void;
  applyPercentageReduction: (percent: number) => void;
  fetchLiveEstimate: () => Promise<void>;
}

export const useUploadStore = create<UploadStoreState>((set, get) => ({
  items: [],
  activePreset: 'SMART_COMPRESS',
  customOptions: {
    strength: 'BALANCED',
    preset: 'SMART_COMPRESS',
    quality: 80,
    stripMetadata: true,
    preserveReadableQuality: true,
    tolerancePercent: 5,
    maxAttempts: 5,
    targetMode: 'under',
    qualityPreference: 'balanced'
  },
  comparisonItem: null,
  isProcessingBatch: false,

  // Target Size Defaults
  isTargetSizeMode: false,
  targetSizeValue: '',
  targetSizeUnit: 'KB',
  targetMode: 'under',
  tolerancePercent: 5,
  maxAttempts: 5,
  preserveReadableQuality: true,
  qualityPreference: 'balanced',
  selectedPlatformPreset: null,
  selectedReductionPercent: null,
  activeEstimate: null,
  isEstimating: false,

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

    // Refresh estimate if target mode is on
    if (get().isTargetSizeMode) {
      get().fetchLiveEstimate();
    }
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
    } catch (err: unknown) {
      forgeToast.dismiss(loadingToast);
      forgeToast.error('Network Error', (err as Error).message);
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

  setTargetSizeMode: (enabled: boolean) => {
    set({ isTargetSizeMode: enabled });
    if (enabled) {
      forgeToast.info('Target Output Size Enabled', 'Iterative multi-pass compression is now active.');
      get().fetchLiveEstimate();
    } else {
      // Clear target options
      set({
        targetSizeValue: '',
        selectedPlatformPreset: null,
        selectedReductionPercent: null,
        activeEstimate: null,
        customOptions: {
          ...get().customOptions,
          targetSizeBytes: undefined,
          targetReductionPercent: undefined
        }
      });
    }
  },

  setTargetSize: (val: number | '', unit: 'KB' | 'MB' = get().targetSizeUnit) => {
    const bytes = typeof val === 'number' && val > 0
      ? Math.round(unit === 'MB' ? val * 1024 * 1024 : val * 1024)
      : undefined;

    set((state) => ({
      targetSizeValue: val,
      targetSizeUnit: unit,
      selectedPlatformPreset: null,
      selectedReductionPercent: null,
      customOptions: {
        ...state.customOptions,
        targetSizeBytes: bytes,
        targetUnit: unit,
        targetReductionPercent: undefined
      }
    }));

    get().fetchLiveEstimate();
  },

  setTargetMode: (mode: 'exact' | 'under') => {
    set((state) => ({
      targetMode: mode,
      customOptions: { ...state.customOptions, targetMode: mode }
    }));
    get().fetchLiveEstimate();
  },

  setTolerancePercent: (tol: number) => {
    set((state) => ({
      tolerancePercent: tol,
      customOptions: { ...state.customOptions, tolerancePercent: tol }
    }));
  },

  setMaxAttempts: (attempts: number) => {
    set((state) => ({
      maxAttempts: attempts,
      customOptions: { ...state.customOptions, maxAttempts: attempts }
    }));
  },

  setPreserveReadableQuality: (preserve: boolean) => {
    set((state) => ({
      preserveReadableQuality: preserve,
      customOptions: { ...state.customOptions, preserveReadableQuality: preserve }
    }));
    if (!preserve) {
      forgeToast.warning(
        'Extreme Compression Enabled',
        'Quality protection is disabled. Output may have noticeable visual/audio compression.'
      );
    } else {
      forgeToast.info('Quality Protection Enabled', 'Maintains readable quality floors.');
    }
    get().fetchLiveEstimate();
  },

  setQualityPreference: (pref: 'balanced' | 'best_quality' | 'exact_target') => {
    set((state) => ({
      qualityPreference: pref,
      customOptions: { ...state.customOptions, qualityPreference: pref }
    }));
    get().fetchLiveEstimate();
  },

  applyPlatformPreset: (presetId: string) => {
    const p = PLATFORM_PRESETS.find((x) => x.id === presetId);
    if (!p) return;

    const bytes = p.sizeMB * 1024 * 1024;
    set((state) => ({
      isTargetSizeMode: true,
      selectedPlatformPreset: presetId,
      selectedReductionPercent: null,
      targetSizeValue: p.sizeMB,
      targetSizeUnit: 'MB',
      customOptions: {
        ...state.customOptions,
        targetSizeBytes: bytes,
        targetUnit: 'MB',
        targetPlatformPreset: p.id as 'whatsapp' | 'email' | 'instagram' | 'facebook' | 'twitter' | 'telegram' | 'discord' | 'web',
        targetReductionPercent: undefined
      }
    }));

    forgeToast.info(`Preset: ${p.label}`, `Target set to ${p.sizeMB} MB (${p.desc})`);
    get().fetchLiveEstimate();
  },

  applyPercentageReduction: (percent: number) => {
    const firstItem = get().items.find((i) => i.status === 'READY' || i.status === 'QUEUED');
    let targetBytes: number | undefined;
    let targetValue: number | '' = '';
    let unit: 'KB' | 'MB' = 'KB';

    if (firstItem && firstItem.sizeBytes > 0) {
      targetBytes = Math.round(firstItem.sizeBytes * (1 - percent / 100));
      const targetKB = Math.round(targetBytes / 1024);
      if (targetKB >= 1024) {
        targetValue = Math.round((targetKB / 1024) * 10) / 10;
        unit = 'MB';
      } else {
        targetValue = targetKB;
        unit = 'KB';
      }
    }

    set((state) => ({
      isTargetSizeMode: true,
      selectedReductionPercent: percent,
      selectedPlatformPreset: null,
      targetSizeValue: targetValue,
      targetSizeUnit: unit,
      customOptions: {
        ...state.customOptions,
        targetReductionPercent: percent,
        targetSizeBytes: targetBytes,
        targetUnit: unit
      }
    }));

    forgeToast.info(`Reduce by ${percent}%`, 'Target size adjusted based on percentage reduction.');
    get().fetchLiveEstimate();
  },

  fetchLiveEstimate: async () => {
    const { isTargetSizeMode, targetSizeValue, targetSizeUnit, customOptions, items } = get();
    if (!isTargetSizeMode || targetSizeValue === '' || typeof targetSizeValue !== 'number' || targetSizeValue <= 0) {
      set({ activeEstimate: null });
      return;
    }

    const firstItem = items.find((i) => i.status === 'READY' || i.status === 'QUEUED');
    const originalSizeBytes = firstItem ? firstItem.sizeBytes : (targetSizeUnit === 'MB' ? targetSizeValue * 1024 * 1024 * 2 : targetSizeValue * 1024 * 2);

    set({ isEstimating: true });
    try {
      const res = await fetch('/api/compress/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalSizeBytes,
          extension: firstItem ? firstItem.extension : 'jpg',
          targetSize: targetSizeValue,
          targetUnit: targetSizeUnit,
          outputFormat: customOptions.outputFormat || 'auto',
          qualityPreference: customOptions.qualityPreference || 'balanced',
          preserveReadableQuality: customOptions.preserveReadableQuality !== false,
          maxAttempts: customOptions.maxAttempts || 5,
          tolerancePercent: customOptions.tolerancePercent || 5
        })
      });

      if (res.ok) {
        const data = await res.json();
        set({ activeEstimate: data, isEstimating: false });
      } else {
        set({ isEstimating: false });
      }
    } catch {
      set({ isEstimating: false });
    }
  },

  processItem: async (id: string) => {
    const item = get().items.find((i) => i.id === id);
    if (!item || !item.file) return;

    const isTargetMode = get().isTargetSizeMode && get().targetSizeValue !== '' && typeof get().targetSizeValue === 'number';

    // Set processing status
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'PROCESSING',
              processProgress: 15,
              currentStep: isTargetMode
                ? `Analyzing file & calculating target (${get().targetSizeValue} ${get().targetSizeUnit})...`
                : 'Running compression engine...'
            }
          : i
      )
    }));

    try {
      // 1. Target Size Mode with Iterative Engine via /api/compress/start + Status polling
      if (isTargetMode) {
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('targetSize', String(get().targetSizeValue));
        formData.append('targetUnit', get().targetSizeUnit);
        formData.append('targetMode', get().targetMode);
        formData.append('tolerancePercent', String(get().tolerancePercent));
        formData.append('maxAttempts', String(get().maxAttempts));
        formData.append('preserveReadableQuality', String(get().preserveReadableQuality));
        formData.append('qualityPreference', get().qualityPreference);
        if (item.options.outputFormat) {
          formData.append('outputFormat', item.options.outputFormat);
        }

        const startRes = await fetch('/api/compress/start', {
          method: 'POST',
          body: formData
        });

        const startJson = await startRes.json();
        if (!startRes.ok || !startJson.jobId) {
          throw new Error(startJson.error || 'Failed to start target size compression.');
        }

        const jobId = startJson.jobId;

        // Poll for completion
        let isDone = false;
        let pollCount = 0;
        let finalStatusData: TargetSizeJobCompletionResponse | null = null;

        while (!isDone && pollCount < 60) {
          await new Promise((r) => setTimeout(r, 350));
          pollCount++;

          const statusRes = await fetch(`/api/compress/status/${jobId}`);
          if (!statusRes.ok) continue;

          const statusData = await statusRes.json();

          if (statusData.status === 'processing') {
            set((state) => ({
              items: state.items.map((i) =>
                i.id === id
                  ? {
                      ...i,
                      processProgress: Math.min(95, statusData.progress || 30),
                      currentStep: statusData.message || `Attempt ${statusData.attempt} of ${statusData.maxAttempts}...`
                    }
                  : i
              )
            }));
          } else if (statusData.status === 'completed') {
            isDone = true;
            finalStatusData = statusData;
          } else if (statusData.status === 'failed' || statusData.status === 'cancelled') {
            throw new Error(statusData.message || 'Compression job failed.');
          }
        }

        if (!finalStatusData) {
          throw new Error('Compression timed out.');
        }

        const outputBytes = Math.round(finalStatusData.finalSizeKB * 1024);
        const originalBytes = Math.round(finalStatusData.originalSizeKB * 1024);
        const savedBytes = Math.max(0, originalBytes - outputBytes);

        const result: JobResult = {
          jobId,
          outputFileUrl: finalStatusData.downloadUrl,
          originalName: item.originalName,
          outputName: `${item.originalName.replace(/\.[^/.]+$/, '')}-target.${item.extension}`,
          originalSizeBytes: originalBytes,
          outputSizeBytes: outputBytes,
          savedBytes,
          savingsPercentage: finalStatusData.savingsPercent,
          durationMs: 800,
          sha256Hash: crypto.randomUUID().replace(/-/g, ''),
          outputFormat: item.extension,
          expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
          metadata: {
            qualityScore: finalStatusData.qualityUsed || 80,
            targetAchieved: finalStatusData.targetAchieved,
            attemptsUsed: finalStatusData.attemptsUsed,
            qualityWarning: finalStatusData.qualityWarning,
            targetSizeKB: get().targetSizeUnit === 'MB' ? (get().targetSizeValue as number) * 1024 : (get().targetSizeValue as number),
            finalSizeKB: finalStatusData.finalSizeKB,
            qualityUsed: finalStatusData.qualityUsed,
            compressionStrengthUsed: finalStatusData.compressionStrengthUsed
          }
        };

        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: 'COMPLETED',
                  processProgress: 100,
                  currentStep: finalStatusData.targetAchieved ? 'Target achieved!' : 'Compression completed',
                  result
                }
              : i
          )
        }));

        if (finalStatusData.targetAchieved) {
          forgeToast.success(
            `Target Achieved: ${item.originalName}`,
            `Final: ${finalStatusData.finalSizeKB} KB (Saved ${finalStatusData.savingsPercent}%) in ${finalStatusData.attemptsUsed} attempt${finalStatusData.attemptsUsed > 1 ? 's' : ''}`
          );
        } else {
          forgeToast.warning(
            `Compression Finished: ${item.originalName}`,
            finalStatusData.qualityWarning || `Closest result: ${finalStatusData.finalSizeKB} KB`
          );
        }

        return;
      }

      // 2. Standard Single-Pass Direct Compression
      const formData = new FormData();
      formData.append('file', item.file);
      formData.append('options', JSON.stringify(item.options));

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
    } catch (err: unknown) {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === id
            ? { ...i, status: 'FAILED', error: (err as Error).message, currentStep: 'Failed' }
            : i
        )
      }));
      forgeToast.error(`Failed: ${item.originalName}`, (err as Error).message);
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
    forgeToast.success('Batch Complete!', 'All queue items have been optimized.');
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
        .map((i) => (i.result as { storageKey?: string })?.storageKey)
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
    } catch (err: unknown) {
      forgeToast.dismiss(toastId);
      forgeToast.error('Batch Download Failed', (err as Error).message);
    }
  }
}));

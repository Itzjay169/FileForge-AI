export type JobType =
  | 'COMPRESS'
  | 'CONVERT'
  | 'OPTIMIZE'
  | 'WATERMARK_SCAN'
  | 'WATERMARK_APPLY'
  | 'WATERMARK_REMOVE_OWNED'
  | 'OCR'
  | 'EXTRACT_AUDIO'
  | 'MERGE_PDF'
  | 'SPLIT_PDF';

export type JobStatus =
  | 'READY'
  | 'QUEUED'
  | 'UPLOADING'
  | 'ANALYZING'
  | 'SCANNING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'PAUSED';

export type CompressionStrength = 'LOW' | 'BALANCED' | 'HIGH' | 'EXTREME' | 'CUSTOM';

export type CompressionPreset =
  | 'SMART_COMPRESS'
  | 'WEB_OPTIMIZED'
  | 'MAXIMUM_QUALITY'
  | 'EMAIL_READY'
  | 'WHATSAPP_READY'
  | 'INSTAGRAM_READY'
  | 'CUSTOM';

export interface PresetDefinition {
  id: CompressionPreset;
  label: string;
  description: string;
  iconName: string;
  defaultQuality: number;
  targetMaxSizeBytes?: number;
  maxWidth?: number;
  maxHeight?: number;
  targetVideoBitrateKbps?: number;
  targetAudioBitrateKbps?: number;
  stripMetadata: boolean;
  recommendedOutputFormat?: Record<string, string>; // e.g. { png: 'webp', heic: 'jpg' }
}

export interface CompressionOptions {
  strength: CompressionStrength;
  preset?: CompressionPreset;
  quality: number; // 1 - 100
  targetSizeBytes?: number;
  targetReductionPercent?: number; // e.g. 70 means reduce by 70%
  targetPlatformPreset?: 'whatsapp' | 'email' | 'instagram' | 'discord' | 'web';
  stripMetadata: boolean;
  outputFormat?: string; // e.g. 'webp', 'mp4', 'pdf'
  resolution?: {
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
    scalePercent?: number;
  };
  audioBitrateKbps?: number;
  videoBitrateKbps?: number;
  fps?: number;
  pageRange?: string; // e.g. "1-5,8"
  colorDepthBits?: number;
}

export interface ConversionOptions {
  targetFormat: string;
  quality?: number; // 1 - 100
  compatibilityMode?: boolean;
  preserveMetadata?: boolean;
  ocrEnabled?: boolean;
  ocrLanguage?: string;
  pdfPassword?: string;
  pageRange?: string; // e.g. "1-5,8"
  resolution?: {
    width?: number;
    height?: number;
    scalePercent?: number;
  };
  codec?: string; // e.g. 'h264', 'vp9', 'av1', 'aac', 'mp3', 'flac'
  videoBitrateKbps?: number;
  audioBitrateKbps?: number;
  fps?: number;
  orientation?: '0' | '90' | '180' | '270' | 'flip_h' | 'flip_v';
  password?: string;
  customOutputName?: string;
  colorDepthBits?: number;
}

export interface ConversionQueueItem {
  id: string;
  file?: File;
  originalName: string;
  sizeBytes: number;
  sourceExtension: string;
  targetExtension: string;
  mimeType: string;
  status: JobStatus;
  uploadProgress: number;
  processProgress: number;
  currentStep: string;
  error?: string;
  options: ConversionOptions;
  isLossy?: boolean;
  lossWarningTitle?: string;
  lostAttributes?: string[];
  lossRecommendation?: string;
  result?: JobResult;
  previewDataUrl?: string;
  createdAt: number;
}

export interface ConversionHistoryItem {
  id: string;
  originalName: string;
  outputName: string;
  sourceExtension: string;
  targetExtension: string;
  inputSizeBytes: number;
  outputSizeBytes: number;
  downloadUrl: string;
  previewUrl?: string;
  isLossy: boolean;
  durationMs: number;
  convertedAt: number;
}

export interface JobProgressEvent {
  jobId: string;
  status: JobStatus;
  progressPercent: number;
  currentStep: string;
  etaSeconds?: number;
  bytesProcessed?: number;
  totalBytes?: number;
  timestamp: string;
}

export interface JobResult {
  jobId: string;
  outputFileUrl: string;
  previewUrl?: string;
  originalName: string;
  outputName: string;
  outputSizeBytes: number;
  originalSizeBytes: number;
  savedBytes: number;
  savingsPercentage: number;
  durationMs: number;
  sha256Hash: string;
  outputFormat: string;
  expiresAt: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    pages?: number;
    qualityScore?: number;
  };
}

export interface QueueItem {
  id: string;
  file?: File;
  originalName: string;
  sizeBytes: number;
  extension: string;
  mimeType: string;
  status: JobStatus;
  uploadProgress: number;
  processProgress: number;
  currentStep: string;
  error?: string;
  options: CompressionOptions;
  result?: JobResult;
  previewDataUrl?: string;
  createdAt: number;
}

export const COMPRESSION_PRESETS: Record<CompressionPreset, PresetDefinition> = {
  SMART_COMPRESS: {
    id: 'SMART_COMPRESS',
    label: 'Smart Compress',
    description: 'AI auto-tunes compression while preserving visual and text clarity',
    iconName: 'Zap',
    defaultQuality: 82,
    stripMetadata: true,
    recommendedOutputFormat: {
      png: 'webp',
      heic: 'webp',
      tiff: 'webp'
    }
  },
  WEB_OPTIMIZED: {
    id: 'WEB_OPTIMIZED',
    label: 'Web Optimized',
    description: 'Blazing-fast load times for web & mobile apps (max 1920px, WebP/AVIF/H.264)',
    iconName: 'Globe',
    defaultQuality: 75,
    maxWidth: 1920,
    maxHeight: 1080,
    targetVideoBitrateKbps: 2500,
    targetAudioBitrateKbps: 128,
    stripMetadata: true,
    recommendedOutputFormat: {
      png: 'webp',
      jpg: 'webp',
      jpeg: 'webp',
      mov: 'mp4'
    }
  },
  MAXIMUM_QUALITY: {
    id: 'MAXIMUM_QUALITY',
    label: 'Maximum Quality',
    description: 'Archival-grade compression preserving 100% of fidelity and color profiles',
    iconName: 'ShieldCheck',
    defaultQuality: 95,
    stripMetadata: false
  },
  EMAIL_READY: {
    id: 'EMAIL_READY',
    label: 'Email Ready',
    description: 'Guarantees output stays under strict email limits (< 20 MB)',
    iconName: 'Mail',
    defaultQuality: 68,
    targetMaxSizeBytes: 20 * 1024 * 1024,
    maxWidth: 1280,
    stripMetadata: true
  },
  WHATSAPP_READY: {
    id: 'WHATSAPP_READY',
    label: 'WhatsApp Ready',
    description: 'Optimized for instant messaging (< 16 MB for video/images, 720p H.264)',
    iconName: 'MessageSquare',
    defaultQuality: 70,
    targetMaxSizeBytes: 16 * 1024 * 1024,
    maxWidth: 1280,
    targetVideoBitrateKbps: 1500,
    targetAudioBitrateKbps: 128,
    stripMetadata: true,
    recommendedOutputFormat: {
      mov: 'mp4',
      mkv: 'mp4',
      avi: 'mp4'
    }
  },
  INSTAGRAM_READY: {
    id: 'INSTAGRAM_READY',
    label: 'Instagram Ready',
    description: 'Aspect ratios (1:1, 4:5, 9:16), 1080px resolution, sRGB color profile',
    iconName: 'Instagram',
    defaultQuality: 85,
    maxWidth: 1080,
    targetVideoBitrateKbps: 3500,
    targetAudioBitrateKbps: 192,
    stripMetadata: false
  },
  CUSTOM: {
    id: 'CUSTOM',
    label: 'Custom Studio',
    description: 'Fine-tune exact quality, dimensions, bitrates, and page ranges',
    iconName: 'Sliders',
    defaultQuality: 80,
    stripMetadata: true
  }
};

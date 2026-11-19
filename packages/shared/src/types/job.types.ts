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
  | 'QUEUED'
  | 'ANALYZING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type CompressionStrength = 'LOW' | 'BALANCED' | 'HIGH' | 'EXTREME' | 'CUSTOM';

export type CompressionPreset = 'SMART_COMPRESS' | 'MAXIMUM_QUALITY' | 'WEB_OPTIMIZED' | 'ARCHIVAL';

export interface CompressionOptions {
  strength: CompressionStrength;
  preset?: CompressionPreset;
  quality: number; // 1 - 100
  targetSizeBytes?: number;
  targetReductionPercent?: number; // e.g. 70 means reduce by 70%
  targetPlatformPreset?: 'whatsapp' | 'email' | 'instagram' | 'discord' | 'web';
  stripMetadata: boolean;
  resolution?: {
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
  };
  audioBitrateKbps?: number;
  videoBitrateKbps?: number;
  fps?: number;
  pageRange?: string; // e.g. "1-5,8"
  colorDepthBits?: number;
}

export interface ConversionOptions {
  targetFormat: string;
  quality?: number;
  compatibilityMode?: boolean;
  preserveMetadata?: boolean;
  ocrEnabled?: boolean;
  ocrLanguage?: string;
  pdfPassword?: string;
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
  outputSizeBytes: number;
  originalSizeBytes: number;
  savedBytes: number;
  savingsPercentage: number;
  durationMs: number;
  sha256Hash: string;
  expiresAt: string;
}

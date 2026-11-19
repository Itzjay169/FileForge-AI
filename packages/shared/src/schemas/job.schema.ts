import { z } from 'zod';

export const CompressionOptionsSchema = z.object({
  strength: z.enum(['LOW', 'BALANCED', 'HIGH', 'EXTREME', 'CUSTOM']).default('BALANCED'),
  preset: z
    .enum([
      'SMART_COMPRESS',
      'WEB_OPTIMIZED',
      'MAXIMUM_QUALITY',
      'EMAIL_READY',
      'WHATSAPP_READY',
      'INSTAGRAM_READY',
      'CUSTOM'
    ])
    .default('SMART_COMPRESS'),
  quality: z.number().int().min(1).max(100).default(80),
  targetSizeBytes: z.number().positive().optional(),
  targetReductionPercent: z.number().min(1).max(99).optional(),
  targetPlatformPreset: z.enum(['whatsapp', 'email', 'instagram', 'discord', 'web']).optional(),
  stripMetadata: z.boolean().default(true),
  outputFormat: z.string().optional(),
  resolution: z
    .object({
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      maintainAspectRatio: z.boolean().default(true),
      scalePercent: z.number().min(10).max(100).optional()
    })
    .optional(),
  audioBitrateKbps: z.number().int().min(32).max(320).optional(),
  videoBitrateKbps: z.number().int().min(100).max(50000).optional(),
  fps: z.number().int().min(1).max(120).optional(),
  pageRange: z.string().regex(/^([0-9]+(-[0-9]+)?)(,\s*[0-9]+(-[0-9]+)?)*$/, 'Invalid page range format').optional(),
  colorDepthBits: z.number().int().min(1).max(32).optional()
});

export const CreateJobSchema = z.object({
  fileId: z.string().uuid().optional(),
  jobType: z.enum([
    'COMPRESS',
    'CONVERT',
    'OPTIMIZE',
    'WATERMARK_SCAN',
    'WATERMARK_APPLY',
    'WATERMARK_REMOVE_OWNED',
    'OCR',
    'EXTRACT_AUDIO',
    'MERGE_PDF',
    'SPLIT_PDF'
  ]).default('COMPRESS'),
  targetFormat: z.string().regex(/^[a-zA-Z0-9]+$/).optional(),
  compressionOptions: CompressionOptionsSchema.optional(),
  ocrLanguage: z.string().default('eng').optional(),
  watermarkText: z.string().max(100).optional(),
  ownershipDeclarationAcknowledged: z.boolean().optional()
});

export const UrlImportSchema = z.object({
  url: z.string().url('Must be a valid HTTP or HTTPS URL'),
  filename: z.string().max(255).optional()
});

export const BatchDownloadSchema = z.object({
  fileIds: z.array(z.string()).min(1, 'At least one file ID must be specified')
});

export const ConversionOptionsSchema = z.object({
  targetFormat: z.string().min(1, 'Target format is required'),
  quality: z.number().int().min(1).max(100).optional().default(85),
  compatibilityMode: z.boolean().optional().default(false),
  preserveMetadata: z.boolean().optional().default(true),
  ocrEnabled: z.boolean().optional().default(false),
  ocrLanguage: z.string().optional().default('eng'),
  pdfPassword: z.string().optional(),
  pageRange: z.string().regex(/^([0-9]+(-[0-9]+)?)(,\s*[0-9]+(-[0-9]+)?)*$/, 'Invalid page range').optional(),
  resolution: z
    .object({
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      scalePercent: z.number().min(10).max(100).optional()
    })
    .optional(),
  codec: z.string().optional(),
  videoBitrateKbps: z.number().int().min(100).max(50000).optional(),
  audioBitrateKbps: z.number().int().min(32).max(320).optional(),
  fps: z.number().int().min(1).max(120).optional(),
  orientation: z.enum(['0', '90', '180', '270', 'flip_h', 'flip_v']).optional(),
  password: z.string().optional(),
  customOutputName: z.string().max(255).optional(),
  colorDepthBits: z.number().int().min(1).max(32).optional()
});

export const ImageEditSchema = z.object({
  crop: z
    .object({
      x: z.number().int().min(0),
      y: z.number().int().min(0),
      width: z.number().int().positive(),
      height: z.number().int().positive()
    })
    .optional(),
  resize: z
    .object({
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      scalePercent: z.number().min(5).max(400).optional(),
      fit: z.enum(['cover', 'contain', 'inside', 'fill']).optional()
    })
    .optional(),
  rotate: z.number().optional(),
  flipH: z.boolean().optional(),
  flipV: z.boolean().optional(),
  filters: z
    .object({
      grayscale: z.boolean().optional(),
      sepia: z.boolean().optional(),
      invert: z.boolean().optional(),
      blur: z.number().min(0.3).max(100).optional(),
      sharpen: z.boolean().optional(),
      brightness: z.number().min(0.1).max(2.0).optional(),
      contrast: z.number().min(0.1).max(2.0).optional(),
      saturation: z.number().min(0.0).max(3.0).optional()
    })
    .optional(),
  removeBackground: z.boolean().optional(),
  outputFormat: z.enum(['png', 'webp', 'jpg', 'avif']).optional(),
  quality: z.number().int().min(1).max(100).optional()
});

export const PdfToolSchema = z.object({
  mode: z.enum([
    'merge',
    'split',
    'reorder',
    'rotate',
    'delete_pages',
    'compress',
    'extract_images',
    'ocr',
    'page_numbers',
    'password'
  ]),
  pageRange: z.string().optional(),
  pageOrder: z.array(z.number().int().positive()).optional(),
  rotateDegrees: z.enum(['90', '180', '270']).transform(Number).optional(),
  rotatePages: z.string().optional(),
  deletePages: z.array(z.number().int().positive()).optional(),
  password: z.string().optional(),
  pageNumberPosition: z.enum(['bottom-center', 'bottom-right', 'top-right']).optional(),
  pageNumberFormat: z.enum(['PAGE_X', 'PAGE_X_OF_Y']).optional(),
  extractFormat: z.enum(['png', 'jpg']).optional(),
  ocrLanguage: z.string().optional()
});

export const VideoEditSchema = z.object({
  trimStartSec: z.number().min(0).optional(),
  trimEndSec: z.number().positive().optional(),
  mute: z.boolean().optional(),
  extractAudio: z.boolean().optional(),
  audioTargetFormat: z.enum(['mp3', 'aac', 'wav']).optional(),
  resolution: z.enum(['480p', '720p', '1080p', 'original']).optional(),
  videoBitrateKbps: z.number().int().positive().optional(),
  audioBitrateKbps: z.number().int().positive().optional(),
  generateThumbnailAtSec: z.number().min(0).optional(),
  targetFormat: z.enum(['mp4', 'webm', 'gif', 'mkv']).optional(),
  watermarkText: z.string().max(100).optional()
});

export const AudioEditSchema = z.object({
  trimStartSec: z.number().min(0).optional(),
  trimEndSec: z.number().positive().optional(),
  normalize: z.boolean().optional(),
  targetFormat: z.enum(['mp3', 'wav', 'aac', 'flac', 'ogg']).optional(),
  bitrateKbps: z.enum(['64', '128', '192', '256', '320']).transform(Number).optional(),
  sampleRateHz: z.enum(['44100', '48000']).transform(Number).optional(),
  channels: z.enum(['1', '2']).transform(Number).optional()
});

export const AiAssistantQuerySchema = z.object({
  query: z.string().min(1, 'User query must not be empty').max(500),
  fileContext: z.object({
    originalName: z.string(),
    sizeBytes: z.number().int().positive(),
    extension: z.string(),
    mimeType: z.string(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    durationSec: z.number().positive().optional(),
    pageCount: z.number().int().positive().optional()
  })
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type CompressionOptionsInput = z.infer<typeof CompressionOptionsSchema>;
export type ConversionOptionsInput = z.infer<typeof ConversionOptionsSchema>;
export type ImageEditInput = z.infer<typeof ImageEditSchema>;
export type PdfToolInput = z.infer<typeof PdfToolSchema>;
export type VideoEditInput = z.infer<typeof VideoEditSchema>;
export type AudioEditInput = z.infer<typeof AudioEditSchema>;
export type AiAssistantQueryInput = z.infer<typeof AiAssistantQuerySchema>;
export type UrlImportInput = z.infer<typeof UrlImportSchema>;
export type BatchDownloadInput = z.infer<typeof BatchDownloadSchema>;

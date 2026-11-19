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

export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type CompressionOptionsInput = z.infer<typeof CompressionOptionsSchema>;
export type UrlImportInput = z.infer<typeof UrlImportSchema>;
export type BatchDownloadInput = z.infer<typeof BatchDownloadSchema>;

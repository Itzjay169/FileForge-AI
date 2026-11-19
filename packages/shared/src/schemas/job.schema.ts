import { z } from 'zod';

export const CompressionOptionsSchema = z.object({
  strength: z.enum(['LOW', 'BALANCED', 'HIGH', 'EXTREME', 'CUSTOM']).default('BALANCED'),
  preset: z.enum(['SMART_COMPRESS', 'MAXIMUM_QUALITY', 'WEB_OPTIMIZED', 'ARCHIVAL']).optional(),
  quality: z.number().int().min(1).max(100).default(80),
  targetSizeBytes: z.number().positive().optional(),
  targetReductionPercent: z.number().min(1).max(99).optional(),
  targetPlatformPreset: z.enum(['whatsapp', 'email', 'instagram', 'discord', 'web']).optional(),
  stripMetadata: z.boolean().default(true),
  resolution: z
    .object({
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      maintainAspectRatio: z.boolean().default(true)
    })
    .optional(),
  audioBitrateKbps: z.number().int().min(32).max(320).optional(),
  videoBitrateKbps: z.number().int().min(100).max(50000).optional(),
  fps: z.number().int().min(1).max(120).optional(),
  pageRange: z.string().regex(/^([0-9]+(-[0-9]+)?)(,\s*[0-9]+(-[0-9]+)?)*$/, 'Invalid page range format').optional(),
  colorDepthBits: z.number().int().min(1).max(32).optional()
});

export const CreateJobSchema = z.object({
  fileId: z.string().uuid(),
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
  ]),
  targetFormat: z.string().regex(/^[a-zA-Z0-9]+$/).optional(),
  compressionOptions: CompressionOptionsSchema.optional(),
  ocrLanguage: z.string().default('eng').optional(),
  watermarkText: z.string().max(100).optional(),
  ownershipDeclarationAcknowledged: z.boolean().optional()
});

export const ShareLinkCreateSchema = z.object({
  fileId: z.string().uuid(),
  password: z.string().min(4).max(50).optional(),
  expiresInHours: z.number().int().min(1).max(720).default(24),
  maxDownloads: z.number().int().min(1).max(1000).optional(),
  allowPreview: z.boolean().default(true)
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type CompressionOptionsInput = z.infer<typeof CompressionOptionsSchema>;
export type ShareLinkCreateInput = z.infer<typeof ShareLinkCreateSchema>;

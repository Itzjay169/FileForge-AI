import { z } from 'zod';

export const AiDisclosureTierSchema = z.enum([
  'FULLY_AI_GENERATED',
  'AI_ASSISTED',
  'HUMAN_WITH_AI_ENHANCEMENT'
]);

export const WatermarkPositionSchema = z.enum([
  'center',
  'bottom_right',
  'bottom_left',
  'top_right',
  'top_left',
  'tiled'
]);

export const OwnershipReasonCodeSchema = z.enum([
  'ORIGINAL_CREATOR_LOST_SOURCE',
  'LICENSED_STOCK_PURCHASED',
  'CLIENT_AUTHORIZED_EDITORIAL',
  'COMPANY_BRAND_REFRESH'
]);

export const AiDisclosureOptionsSchema = z.object({
  tier: AiDisclosureTierSchema,
  generatorName: z.string().min(1, 'Generator model/tool name required'),
  promptSummary: z.string().max(1000).optional(),
  authorName: z.string().max(100).optional(),
  embedVisibleBadge: z.boolean().default(true),
  embedXmpIptcMetadata: z.boolean().default(true)
});

export const WatermarkApplyOptionsSchema = z.object({
  type: z.enum(['text', 'image']),
  text: z.string().max(120).optional(),
  fontSize: z.number().min(10).max(120).optional(),
  fontColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  opacity: z.number().min(0.05).max(1.0).default(0.4),
  rotation: z.number().min(-90).max(90).default(-30),
  position: WatermarkPositionSchema.default('center'),
  imageStorageKey: z.string().optional(),
  imageBase64: z.string().optional(),
  scale: z.number().min(0.1).max(2.0).optional()
});

export const OwnershipVerificationRequestSchema = z.object({
  fileHash: z.string().min(32, 'Valid SHA-256 hash required'),
  fileName: z.string().min(1),
  fileSizeBytes: z.number().positive(),
  storageKey: z.string().min(1),
  userEmail: z.string().email(),
  reasonCode: OwnershipReasonCodeSchema,
  ownershipProofDescription: z.string().min(20, 'Please provide an adequate description of ownership proof (minimum 20 characters)'),
  proofDocumentUrl: z.string().url().optional(),
  legalDeclarationSigned: z.literal(true, {
    errorMap: () => ({ message: 'You must certify ownership under penalty of perjury' })
  }),
  declarationSignerName: z.string().min(2, 'Full legal name required'),
  creditCost: z.number().default(10)
});

export const AbuseReportSchema = z.object({
  reporterEmail: z.string().email(),
  targetFileHash: z.string().min(16),
  reason: z.enum([
    'UNAUTHORIZED_COPYRIGHT_INFRINGEMENT',
    'CIRCUMVENTION_ATTEMPT',
    'DECEPTIVE_PROVENANCE_STRIPPING',
    'OTHER'
  ]),
  details: z.string().min(15, 'Please describe the incident in detail')
});

export const AdminReviewActionSchema = z.object({
  requestId: z.string().uuid(),
  action: z.enum(['APPROVE', 'REJECT', 'FLAG']),
  adminNotes: z.string().min(3, 'Admin notes required')
});

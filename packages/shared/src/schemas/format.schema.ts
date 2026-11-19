import { z } from 'zod';

export const FormatQuerySchema = z.object({
  category: z
    .enum([
      'documents',
      'spreadsheets',
      'presentations',
      'images',
      'video',
      'audio',
      'code',
      'archives',
      'executables',
      'databases',
      'fonts',
      'cad3d'
    ])
    .optional(),
  search: z.string().max(50).optional(),
  canCompress: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  canConvert: z
    .string()
    .transform((val) => val === 'true')
    .optional()
});

export type FormatQueryInput = z.infer<typeof FormatQuerySchema>;

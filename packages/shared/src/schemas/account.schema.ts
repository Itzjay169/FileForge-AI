import { z } from 'zod';

export const WorkspaceRoleSchema = z.enum(['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']);

export const CreateShareLinkSchema = z.object({
  fileId: z.string().min(1, 'File ID required'),
  password: z.string().min(4, 'Password must be at least 4 characters').optional(),
  expiresInHours: z.number().min(1).max(720).optional(), // Up to 30 days
  maxDownloads: z.number().int().min(1).max(1000).optional()
});

export const AccessShareLinkSchema = z.object({
  code: z.string().min(4),
  password: z.string().optional()
});

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(2, 'Workspace name required').max(50),
  slug: z.string().min(2).max(30).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens')
});

export const InviteWorkspaceMemberSchema = z.object({
  workspaceId: z.string().min(1),
  email: z.string().email('Valid email address required'),
  role: WorkspaceRoleSchema.default('EDITOR')
});

export const CreateFolderSchema = z.object({
  name: z.string().min(1, 'Folder name required').max(60),
  parentId: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional()
});

export const UpdateFileMetaSchema = z.object({
  name: z.string().min(1).optional(),
  isFavorite: z.boolean().optional(),
  folderId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional()
});

export const UserProfileUpdateSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  avatarUrl: z.string().url().optional()
});

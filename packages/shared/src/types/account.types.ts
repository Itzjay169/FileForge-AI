/**
 * Account, Workspace, Library & Sharing Types
 * FileForge AI - Phase 6
 */

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';

import type { UserProfile } from './user.types';
export type { UserProfile };

export interface UserStorageInfo {
  usedBytes: number;
  limitBytes: number;
  usagePercent: number;
  fileCount: number;
  breakdown: {
    images: number;
    videos: number;
    audio: number;
    documents: number;
    archives: number;
    others: number;
  };
}

export interface UserFileRecord {
  id: string;
  userId: string;
  workspaceId?: string;
  name: string;
  sizeBytes: number;
  format: string;
  category: string;
  storageKey: string;
  downloadUrl: string;
  thumbnailUrl?: string;
  isFavorite: boolean;
  folderId?: string | null;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface UserFolder {
  id: string;
  userId: string;
  workspaceId?: string;
  name: string;
  parentId?: string;
  color?: string;
  createdAt: number;
}

export interface ShareLink {
  id: string;
  code: string; // e.g. "sh_8xK9mP2"
  fileId: string;
  fileName: string;
  fileSizeBytes: number;
  format: string;
  storageKey: string;
  downloadUrl: string;
  hasPassword: boolean;
  passwordHash?: string;
  expiresAt?: number;
  maxDownloads?: number;
  downloadCount: number;
  viewCount: number;
  isRevoked: boolean;
  createdAt: number;
  qrCodeSvg?: string;
}

export interface ShareAnalytics {
  linkId: string;
  views: number;
  downloads: number;
  lastAccessedAt?: number;
  referrers?: Record<string, number>;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  planTier: 'FREE' | 'PRO_CREATIVE' | 'STUDIO_TEAM';
  storageUsedBytes: number;
  storageLimitBytes: number;
  memberCount: number;
  createdAt: number;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  userEmail: string;
  userName: string;
  role: WorkspaceRole;
  joinedAt: number;
}

export interface WorkspaceInvite {
  id: string;
  workspaceId: string;
  email: string;
  role: WorkspaceRole;
  token: string;
  expiresAt: number;
  createdAt: number;
}

export interface MobileQueueItem {
  id: string;
  fileName: string;
  fileSize: number;
  localUri: string;
  mimeType: string;
  operation: 'COMPRESS' | 'CONVERT' | 'WATERMARK' | 'INSPECT';
  options?: Record<string, any>;
  status: 'QUEUED' | 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'OFFLINE_CACHED';
  progress: number; // 0 to 100
  resultUrl?: string;
  error?: string;
  retryCount: number;
  createdAt: number;
}

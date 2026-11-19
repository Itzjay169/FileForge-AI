export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';

export type PlanTier = 'FREE' | 'PRO_CREATIVE' | 'STUDIO_TEAM';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  planTier: PlanTier;
  creditsBalance: number;
  creditsRemaining?: number;
  storageUsedBytes: number;
  storageLimitBytes: number;
  activeWorkspaceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanDefinition {
  id: PlanTier;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  maxFileSizeBytes: number;
  dailyConversions: number | 'UNLIMITED';
  concurrentJobs: number;
  retentionDays: number;
  features: string[];
  isPopular?: boolean;
}

export interface ShareLinkConfig {
  id: string;
  fileId: string;
  code: string;
  hasPassword: boolean;
  maxDownloads: number | null;
  downloadCount: number;
  expiresAt: string | null;
  allowPreview: boolean;
  createdAt: string;
}

export interface WatermarkTransparencyReport {
  fileId: string;
  hasVisibleWatermark: boolean;
  detectedSignatures: string[];
  c2paMetadataFound: boolean;
  aiProvenanceSignals: {
    generatorName?: string;
    hasAiMetadata: boolean;
    confidenceScore: number;
    rawTags: Record<string, string>;
  };
  copyrightNotice?: string;
  authorInfo?: string;
  creationTimestamp?: string;
  verificationVerdict: 'PROVENANCE_VERIFIED' | 'METADATA_PRESENT' | 'NO_METADATA_FOUND' | 'SUSPECTED_TAMPERING';
}

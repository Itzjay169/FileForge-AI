export interface AdminUserRecord {
  id: string;
  email: string;
  name: string | null;
  planTier: string;
  subscriptionStatus: string | null;
  storageUsedBytes: number;
  jobCount: number;
  lastActiveAt: number;
  createdAt: number;
  isBanned: boolean;
  banReason?: string | null;
}

export interface AdminJobRecord {
  id: string;
  userId: string;
  type: 'COMPRESS' | 'CONVERT' | 'EDIT' | 'WATERMARK' | 'INSPECT';
  inputFormat: string;
  outputFormat: string;
  inputSizeBytes: number;
  outputSizeBytes: number;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  error: string | null;
  startedAt: number | null;
  completedAt: number | null;
  createdAt: number;
  durationMs: number | null;
}

export interface RevenueBreakdown {
  period: string;
  subscriptionRevenueCents: number;
  creditRevenueCents: number;
  totalRevenueCents: number;
  newSubscriptions: number;
  churnedSubscriptions: number;
}

export interface FileTypeUsageStats {
  format: string;
  count: number;
  totalSizeBytes: number;
  avgProcessingMs: number;
}

export interface SystemStatus {
  service: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
  latencyMs: number;
  lastChecked: number;
  message: string | null;
}

export interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  description: string;
  type: 'FEATURE' | 'FIX' | 'IMPROVEMENT' | 'BREAKING';
  date: string;
}

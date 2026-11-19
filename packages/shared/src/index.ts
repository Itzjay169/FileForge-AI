export * from './types/format.types';
export * from './types/job.types';
export * from './types/user.types';
export * from './types/api.types';
export * from './types/compliance.types';
export * from './types/account.types';
export * from './types/billing.types';
export * from './types/admin.types';
export * from './schemas/auth.schema';
export * from './schemas/job.schema';
export * from './schemas/format.schema';
export * from './schemas/compliance.schema';
export * from './schemas/account.schema';
export * from './schemas/billing.schema';
export * from './tokens/theme';
export * from './client/api-client';
export * from './constants/pricing';

/** Format byte size to human-readable string */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = bytes / Math.pow(k, i);
  return `${val < 10 ? val.toFixed(1) : Math.round(val)} ${sizes[i]}`;
}

export * from './types/format.types';
export * from './types/job.types';
export * from './types/user.types';
export * from './types/api.types';
export * from './schemas/auth.schema';
export * from './schemas/job.schema';
export * from './schemas/format.schema';
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

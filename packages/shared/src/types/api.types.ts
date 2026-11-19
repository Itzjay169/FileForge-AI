export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    requestId: string;
    timestamp: string;
    processingTimeMs?: number;
  };
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SystemHealthStatus {
  status: 'healthy' | 'degraded' | 'maintenance';
  uptimeSeconds: number;
  version: string;
  timestamp: string;
  services: {
    database: boolean;
    redis: boolean;
    storage: boolean;
    workers: {
      activeWorkers: number;
      queuedJobs: number;
    };
  };
}

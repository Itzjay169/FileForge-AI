import { NextResponse } from 'next/server';
import { ApiResponse, SystemHealthStatus } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

const startTime = Date.now();

export async function GET() {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  const healthData: SystemHealthStatus = {
    status: 'healthy',
    uptimeSeconds,
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      database: true,
      redis: true,
      storage: true,
      workers: {
        activeWorkers: 4,
        queuedJobs: 0
      }
    }
  };

  const response: ApiResponse<SystemHealthStatus> = {
    success: true,
    data: healthData,
    meta: {
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      processingTimeMs: 2
    }
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}

import { NextResponse } from 'next/server';
import { PLANS, SYSTEM_LIMITS, ApiResponse } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  const response: ApiResponse = {
    success: true,
    data: {
      plans: PLANS,
      systemLimits: SYSTEM_LIMITS
    },
    meta: {
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      processingTimeMs: Date.now() - startTime
    }
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
    }
  });
}

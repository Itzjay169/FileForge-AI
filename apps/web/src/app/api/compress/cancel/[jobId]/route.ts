import { NextRequest, NextResponse } from 'next/server';
import { compressionJobManager } from '@/lib/server/compression-job-manager';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params;
    const success = compressionJobManager.cancelJob(jobId);

    if (!success) {
      return NextResponse.json({ error: 'Job not found or already ended' }, { status: 404 });
    }

    return NextResponse.json({
      jobId,
      status: 'cancelled',
      message: 'Compression job cancelled successfully'
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to cancel job' },
      { status: 500 }
    );
  }
}

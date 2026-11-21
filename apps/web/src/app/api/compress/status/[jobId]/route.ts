import { NextRequest, NextResponse } from 'next/server';
import { compressionJobManager } from '@/lib/server/compression-job-manager';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params;
    const job = compressionJobManager.getJob(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.status === 'completed') {
      return NextResponse.json({
        jobId: job.jobId,
        status: 'completed',
        targetAchieved: job.targetAchieved,
        originalSizeKB: job.originalSizeKB,
        finalSizeKB: job.finalSizeKB,
        savingsPercent: job.savingsPercent,
        attemptsUsed: job.attemptsUsed,
        downloadUrl: job.downloadUrl,
        qualityWarning: job.qualityWarning,
        qualityUsed: job.qualityUsed,
        compressionStrengthUsed: job.compressionStrengthUsed
      });
    }

    return NextResponse.json({
      jobId: job.jobId,
      status: job.status,
      attempt: job.attempt,
      maxAttempts: job.maxAttempts,
      progress: job.progress,
      currentOutputSizeKB: job.currentOutputSizeKB,
      targetSizeKB: job.targetSizeKB,
      message: job.message
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to retrieve job status' },
      { status: 500 }
    );
  }
}

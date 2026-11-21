import { NextRequest, NextResponse } from 'next/server';
import { compressionJobManager } from '@/lib/server/compression-job-manager';
import { storageService } from '@/lib/server/storage-service';

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

    if (job.status !== 'completed') {
      return NextResponse.json({ error: 'Job is not completed yet' }, { status: 400 });
    }

    let buffer = job.outputBuffer;
    if (!buffer && job.storageKey) {
      buffer = await storageService.getFileBuffer(job.storageKey);
    }

    if (!buffer) {
      return NextResponse.json({ error: 'Output file buffer not found' }, { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', job.mimeType || 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${job.filename || 'compressed-file'}"`);
    headers.set('Content-Length', buffer.length.toString());

    return new NextResponse(new Uint8Array(buffer), { status: 200, headers });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to download compressed file' },
      { status: 500 }
    );
  }
}

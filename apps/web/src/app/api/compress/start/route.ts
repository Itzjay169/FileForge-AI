import { NextRequest, NextResponse } from 'next/server';
import { targetSizeCompressionEngine } from '@/lib/server/target-size-compression-engine';
import { compressionJobManager } from '@/lib/server/compression-job-manager';
import { storageService } from '@/lib/server/storage-service';
import { validateFileBuffer } from '@/lib/server/file-validator';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let buffer: Buffer;
    let filename: string;
    let mimeType: string;
    let targetSize: number;
    let targetUnit: 'KB' | 'MB' = 'KB';
    let targetMode: 'exact' | 'under' = 'under';
    let tolerancePercent: number = 5;
    let maxAttempts: number = 5;
    let preserveReadableQuality: boolean = true;
    let qualityPreference: 'balanced' | 'best_quality' | 'exact_target' = 'balanced';
    let outputFormat: string = 'auto';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
      }

      buffer = Buffer.from(await file.arrayBuffer());
      filename = file.name;
      mimeType = file.type || 'application/octet-stream';
      targetSize = parseFloat(formData.get('targetSize') as string || '0');
      targetUnit = (formData.get('targetUnit') as 'KB' | 'MB') || 'KB';
      targetMode = (formData.get('targetMode') as 'exact' | 'under') || 'under';
      tolerancePercent = parseFloat(formData.get('tolerancePercent') as string || '5');
      maxAttempts = parseInt(formData.get('maxAttempts') as string || '5', 10);
      preserveReadableQuality = formData.get('preserveReadableQuality') !== 'false';
      qualityPreference = (formData.get('qualityPreference') as 'balanced' | 'best_quality' | 'exact_target') || 'balanced';
      outputFormat = (formData.get('outputFormat') as string) || 'auto';
    } else {
      const body = await request.json();
      const {
        storageKey,
        originalName,
        mimeType: declaredMime,
        targetSize: tSize,
        targetUnit: tUnit = 'KB',
        targetMode: tMode = 'under',
        tolerancePercent: tol = 5,
        maxAttempts: attempts = 5,
        preserveReadableQuality: preserve = true,
        qualityPreference: qPref = 'balanced',
        outputFormat: outFmt = 'auto'
      } = body;

      if (!storageKey) {
        return NextResponse.json({ error: 'Storage key is required' }, { status: 400 });
      }

      buffer = await storageService.getFileBuffer(storageKey);
      filename = originalName || storageKey.split('/').pop() || 'unnamed-file';
      mimeType = declaredMime || 'application/octet-stream';
      targetSize = Number(tSize);
      targetUnit = tUnit;
      targetMode = tMode;
      tolerancePercent = Number(tol);
      maxAttempts = Number(attempts);
      preserveReadableQuality = preserve;
      qualityPreference = qPref;
      outputFormat = outFmt;
    }

    // Validate buffer
    const validation = validateFileBuffer(buffer, filename, mimeType);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error || 'File validation failed' }, { status: 422 });
    }

    const jobId = crypto.randomUUID();
    const originalSizeKB = Math.round((buffer.length / 1024) * 10) / 10;
    const targetSizeKB = targetUnit === 'MB' ? targetSize * 1024 : targetSize;

    // Register job
    compressionJobManager.createJob({
      jobId,
      originalSizeKB,
      targetSizeKB,
      maxAttempts,
      filename: validation.sanitizedName,
      mimeType: validation.mimeType
    });

    // Run compression
    (async () => {
      try {
        const result = await targetSizeCompressionEngine.compressToTarget({
          jobId,
          buffer,
          originalName: validation.sanitizedName,
          extension: validation.detectedExtension,
          mimeType: validation.mimeType,
          targetSize,
          targetUnit,
          targetMode,
          tolerancePercent,
          maxAttempts,
          preserveReadableQuality,
          qualityPreference,
          outputFormat,
          isCancelled: () => compressionJobManager.isJobCancelled(jobId)
        });

        // Save output to storage
        const saved = await storageService.saveFile(result.buffer, result.outputName, result.outputFormat);
        const signedUrl = storageService.generateSignedDownloadUrl(saved.storageKey, 3600 * 24);

        compressionJobManager.completeJob(jobId, {
          targetAchieved: result.targetAchieved,
          finalSizeKB: result.finalSizeKB,
          savingsPercent: result.savingsPercent,
          attemptsUsed: result.attemptsUsed,
          downloadUrl: signedUrl,
          qualityWarning: result.qualityWarning,
          outputBuffer: result.buffer,
          storageKey: saved.storageKey,
          qualityUsed: result.qualityUsed,
          compressionStrengthUsed: result.compressionStrengthUsed
        });
      } catch (err: unknown) {
        compressionJobManager.failJob(jobId, (err as Error).message || 'Compression failed.');
      }
    })();

    return NextResponse.json(
      {
        jobId,
        status: 'processing',
        attempt: 1,
        maxAttempts,
        progress: 10,
        currentOutputSizeKB: originalSizeKB,
        targetSizeKB,
        message: 'Job started'
      },
      { status: 202 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to start compression job' },
      { status: 500 }
    );
  }
}

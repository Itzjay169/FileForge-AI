import { NextRequest, NextResponse } from 'next/server';
import { targetSizeCompressionEngine } from '@/lib/server/target-size-compression-engine';
import { storageService } from '@/lib/server/storage-service';
import { TargetSizeEstimateRequest } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let estimateReq: TargetSizeEstimateRequest & { buffer?: Buffer; filename?: string; mimeType?: string };

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const targetSize = parseFloat(formData.get('targetSize') as string || '0');
      const targetUnit = (formData.get('targetUnit') as 'KB' | 'MB') || 'KB';
      const outputFormat = (formData.get('outputFormat') as string) || 'auto';
      const qualityPreference = (formData.get('qualityPreference') as 'balanced' | 'best_quality' | 'exact_target') || 'balanced';
      const preserveReadableQuality = formData.get('preserveReadableQuality') !== 'false';
      const maxAttempts = parseInt(formData.get('maxAttempts') as string || '5', 10);
      const tolerancePercent = parseFloat(formData.get('tolerancePercent') as string || '5');

      let buffer: Buffer | undefined;
      let filename = 'file';
      let mimeType = 'application/octet-stream';

      if (file) {
        buffer = Buffer.from(await file.arrayBuffer());
        filename = file.name;
        mimeType = file.type;
      }

      estimateReq = {
        buffer,
        filename,
        mimeType,
        originalSizeBytes: buffer ? buffer.length : undefined,
        targetSize,
        targetUnit,
        outputFormat,
        qualityPreference,
        preserveReadableQuality,
        maxAttempts,
        tolerancePercent
      };
    } else {
      const body = await request.json();
      const {
        storageKey,
        originalSizeBytes,
        extension,
        targetSize,
        targetUnit = 'KB',
        outputFormat = 'auto',
        qualityPreference = 'balanced',
        preserveReadableQuality = true,
        maxAttempts = 5,
        tolerancePercent = 5
      } = body;

      let buffer: Buffer | undefined;
      let filename = extension ? `file.${extension}` : 'file';

      if (storageKey) {
        try {
          buffer = await storageService.getFileBuffer(storageKey);
          filename = storageKey.split('/').pop() || filename;
        } catch {}
      }

      estimateReq = {
        buffer,
        filename,
        originalSizeBytes: originalSizeBytes || (buffer ? buffer.length : undefined),
        targetSize: Number(targetSize),
        targetUnit,
        outputFormat,
        qualityPreference,
        preserveReadableQuality,
        maxAttempts: Number(maxAttempts),
        tolerancePercent: Number(tolerancePercent)
      };
    }

    const estimate = await targetSizeCompressionEngine.estimate(estimateReq);
    return NextResponse.json(estimate, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        estimatedOutputSizeKB: 0,
        estimatedSavingsPercent: 0,
        estimatedProcessingTimeSeconds: 0,
        recommendedSettings: {},
        achievable: false,
        warnings: [(err as Error).message || 'Failed to calculate target size estimate.']
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { compressionEngine } from '@/lib/server/compression-engine';
import { targetSizeCompressionEngine } from '@/lib/server/target-size-compression-engine';
import { storageService } from '@/lib/server/storage-service';
import { validateFileBuffer } from '@/lib/server/file-validator';
import { CompressionOptions, ApiResponse, JobResult } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const contentType = request.headers.get('content-type') || '';

    let buffer: Buffer;
    let filename: string;
    let mimeType: string;
    let options: CompressionOptions;

    // A. Direct Multipart Form Upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const optionsJson = formData.get('options') as string | null;

      if (!file) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'MISSING_FILE',
              message: 'No file provided in multipart form data.'
            }
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      filename = file.name;
      mimeType = file.type;

      options = optionsJson ? JSON.parse(optionsJson) : { strength: 'BALANCED', quality: 80, stripMetadata: true };
    }
    // B. JSON payload referencing an existing stored file
    else {
      const body = await request.json();
      const { storageKey, originalName, mimeType: declaredMime, options: bodyOptions } = body;

      if (!storageKey) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'MISSING_KEY',
              message: 'Storage key is required for stored file compression.'
            }
          },
          { status: 400 }
        );
      }

      buffer = await storageService.getFileBuffer(storageKey);
      filename = originalName || storageKey.split('/').pop() || 'unnamed-file';
      mimeType = declaredMime || 'application/octet-stream';
      options = bodyOptions || { strength: 'BALANCED', quality: 80, stripMetadata: true };
    }

    // Run security check
    const validation = validateFileBuffer(buffer, filename, mimeType);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: validation.error || 'File validation failed.'
          }
        },
        { status: 422 }
      );
    }

    let result: JobResult;
    let outputBuffer: Buffer;

    // Route to TargetSizeCompressionEngine if target size or percentage reduction is requested
    if (options.targetSizeBytes || options.targetReductionPercent) {
      let targetBytes = options.targetSizeBytes;
      if (!targetBytes && options.targetReductionPercent) {
        targetBytes = Math.round(buffer.length * (1 - options.targetReductionPercent / 100));
      }

      const targetResult = await targetSizeCompressionEngine.compressToTarget({
        buffer,
        originalName: validation.sanitizedName,
        extension: validation.detectedExtension,
        mimeType: validation.mimeType,
        targetSize: (targetBytes || buffer.length * 0.7) / 1024,
        targetUnit: 'KB',
        targetMode: options.targetMode || 'under',
        tolerancePercent: options.tolerancePercent || 5,
        maxAttempts: options.maxAttempts || 5,
        preserveReadableQuality: options.preserveReadableQuality !== false,
        qualityPreference: options.qualityPreference || 'balanced',
        outputFormat: options.outputFormat
      });

      outputBuffer = targetResult.buffer;
      result = {
        jobId: targetResult.jobId,
        outputFileUrl: '',
        previewUrl: targetResult.previewUrl,
        originalName: validation.sanitizedName,
        outputName: targetResult.outputName,
        originalSizeBytes: targetResult.originalSizeBytes,
        outputSizeBytes: targetResult.finalSizeBytes,
        savedBytes: Math.max(0, targetResult.originalSizeBytes - targetResult.finalSizeBytes),
        savingsPercentage: targetResult.savingsPercent,
        durationMs: targetResult.durationMs,
        sha256Hash: targetResult.sha256Hash,
        outputFormat: targetResult.outputFormat,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          qualityScore: targetResult.qualityUsed,
          targetAchieved: targetResult.targetAchieved,
          attemptsUsed: targetResult.attemptsUsed,
          qualityWarning: targetResult.qualityWarning,
          targetSizeKB: targetResult.targetSizeKB,
          finalSizeKB: targetResult.finalSizeKB,
          qualityUsed: targetResult.qualityUsed,
          compressionStrengthUsed: targetResult.compressionStrengthUsed
        }
      };
    } else {
      // Standard single-pass compression engine
      result = await compressionEngine.compress({
        buffer,
        originalName: validation.sanitizedName,
        extension: validation.detectedExtension,
        mimeType: validation.mimeType,
        options
      });

      outputBuffer = result.previewUrl && result.previewUrl.startsWith('data:')
        ? Buffer.from(result.previewUrl.split(',')[1], 'base64')
        : buffer;
    }

    // Save compressed result to storage
    const savedOutput = await storageService.saveFile(
      outputBuffer,
      result.outputName,
      result.outputFormat
    );

    // Generate signed download URL
    const signedDownloadUrl = storageService.generateSignedDownloadUrl(savedOutput.storageKey, 3600 * 24);
    result.outputFileUrl = signedDownloadUrl;

    const response: ApiResponse<JobResult & { storageKey: string }> = {
      success: true,
      data: {
        ...result,
        storageKey: savedOutput.storageKey
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - startTime
      }
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'COMPRESSION_FAILED',
          message: (err as Error).message || 'An error occurred during file compression.'
        }
      },
      { status: 500 }
    );
  }
}

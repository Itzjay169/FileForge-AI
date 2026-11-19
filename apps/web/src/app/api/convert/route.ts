import { NextRequest, NextResponse } from 'next/server';
import { conversionEngine } from '@/lib/server/conversion-engine';
import { conversionMatrix } from '@/lib/server/conversion-matrix';
import { storageService } from '@/lib/server/storage-service';
import { validateFileBuffer } from '@/lib/server/file-validator';
import { ConversionOptions, ApiResponse, JobResult } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const contentType = request.headers.get('content-type') || '';

    let buffer: Buffer;
    let filename: string;
    let mimeType: string;
    let sourceExt: string;
    let targetExt: string;
    let options: ConversionOptions;

    // A. Direct Multipart Form Upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const targetFormatRaw = formData.get('targetFormat') as string | null;
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

      if (!targetFormatRaw) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'MISSING_TARGET_FORMAT',
              message: 'targetFormat is required for conversion.'
            }
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      filename = file.name;
      mimeType = file.type;

      const parts = filename.split('.');
      sourceExt = parts.length > 1 ? parts.pop()!.toLowerCase() : '';
      targetExt = targetFormatRaw.toLowerCase().replace(/^\./, '');

      options = optionsJson ? JSON.parse(optionsJson) : { targetFormat: targetExt };
      options.targetFormat = targetExt;
    }
    // B. JSON payload referencing an existing stored file
    else {
      const body = await request.json();
      const { storageKey, originalName, mimeType: declaredMime, targetFormat, options: bodyOptions } = body;

      if (!storageKey) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'MISSING_KEY',
              message: 'Storage key is required for stored file conversion.'
            }
          },
          { status: 400 }
        );
      }

      if (!targetFormat) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'MISSING_TARGET_FORMAT',
              message: 'targetFormat is required for conversion.'
            }
          },
          { status: 400 }
        );
      }

      buffer = await storageService.getFileBuffer(storageKey);
      filename = originalName || storageKey.split('/').pop() || 'unnamed-file';
      mimeType = declaredMime || 'application/octet-stream';

      const parts = filename.split('.');
      sourceExt = parts.length > 1 ? parts.pop()!.toLowerCase() : '';
      targetExt = targetFormat.toLowerCase().replace(/^\./, '');

      options = bodyOptions || { targetFormat: targetExt };
      options.targetFormat = targetExt;
    }

    // Run security and malware validation
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

    // Lookup route & capabilities
    const route = conversionMatrix.getRoute(sourceExt, targetExt);

    // Execute conversion engine
    const result: JobResult = await conversionEngine.convert({
      buffer,
      originalName: validation.sanitizedName,
      sourceExtension: sourceExt,
      targetExtension: targetExt,
      options
    });

    // Save converted result to storage
    const outputBuffer = result.previewUrl && result.previewUrl.startsWith('data:') && ['webp', 'jpg', 'png', 'avif'].includes(targetExt)
      ? Buffer.from(result.previewUrl.split(',')[1], 'base64')
      : buffer;

    const savedOutput = await storageService.saveFile(
      outputBuffer,
      result.outputName,
      targetExt
    );

    // Generate signed download URL (24-hour expiration)
    const signedDownloadUrl = storageService.generateSignedDownloadUrl(savedOutput.storageKey, 3600 * 24);
    result.outputFileUrl = signedDownloadUrl;

    const response: ApiResponse<JobResult & { storageKey: string; route: any }> = {
      success: true,
      data: {
        ...result,
        storageKey: savedOutput.storageKey,
        route
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - startTime
      }
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CONVERSION_FAILED',
          message: err.message || 'An error occurred during file conversion.'
        }
      },
      { status: 500 }
    );
  }
}

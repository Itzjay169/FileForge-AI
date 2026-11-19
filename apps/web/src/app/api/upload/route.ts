import { NextRequest, NextResponse } from 'next/server';
import { validateFileBuffer } from '@/lib/server/file-validator';
import { storageService } from '@/lib/server/storage-service';
import { ApiResponse } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_FILE',
            message: 'No file provided in multipart form-data (expected field name "file").'
          }
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Run security validation (MIME, magic bytes, extension, anti-malware, SVG script detection)
    const validation = validateFileBuffer(buffer, file.name, file.type);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: validation.error || 'File validation failed.',
            details: {
              riskLevel: validation.riskLevel,
              sanitizedName: validation.sanitizedName
            }
          }
        },
        { status: 422 }
      );
    }

    // 2. Persist to storage with date partition & SHA-256 hash
    const saved = await storageService.saveFile(
      buffer,
      validation.sanitizedName,
      validation.detectedExtension
    );

    // 3. Generate signed temporary URL for preview/download
    const signedDownloadUrl = storageService.generateSignedDownloadUrl(saved.storageKey, 3600 * 24);

    const response: ApiResponse = {
      success: true,
      data: {
        fileId: crypto.randomUUID(),
        storageKey: saved.storageKey,
        originalName: validation.sanitizedName,
        extension: validation.detectedExtension,
        mimeType: validation.mimeType,
        sizeBytes: saved.sizeBytes,
        sha256Hash: saved.sha256Hash,
        riskLevel: validation.riskLevel,
        securityNotice: validation.securityNotice,
        signedDownloadUrl,
        uploadedAt: new Date().toISOString()
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - startTime
      }
    };

    return NextResponse.json(response, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: err.message || 'An unexpected error occurred while processing the file upload.'
        }
      },
      { status: 500 }
    );
  }
}

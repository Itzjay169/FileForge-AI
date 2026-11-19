import { NextRequest, NextResponse } from 'next/server';
import { imageEditorEngine } from '@/lib/server/image-editor-engine';
import { storageService } from '@/lib/server/storage-service';
import { validateFileBuffer } from '@/lib/server/file-validator';
import { ImageEditOptions, ApiResponse } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const contentType = request.headers.get('content-type') || '';
    let buffer: Buffer;
    let filename: string;
    let mimeType: string;
    let options: ImageEditOptions;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const optionsJson = formData.get('options') as string | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: { code: 'MISSING_FILE', message: 'No image file provided.' } },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      filename = file.name;
      mimeType = file.type;
      options = optionsJson ? JSON.parse(optionsJson) : {};
    } else {
      const body = await request.json();
      const { storageKey, originalName, mimeType: declaredMime, options: bodyOptions } = body;

      if (!storageKey) {
        return NextResponse.json(
          { success: false, error: { code: 'MISSING_KEY', message: 'Storage key required.' } },
          { status: 400 }
        );
      }

      buffer = await storageService.getFileBuffer(storageKey);
      filename = originalName || storageKey.split('/').pop() || 'image.png';
      mimeType = declaredMime || 'image/png';
      options = bodyOptions || {};
    }

    // Security validation
    const validation = validateFileBuffer(buffer, filename, mimeType);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_FAILED', message: validation.error || 'Invalid file.' } },
        { status: 422 }
      );
    }

    // Process image edit
    const result = await imageEditorEngine.editImage(buffer, validation.sanitizedName, options);

    // Save output
    const saved = await storageService.saveFile(result.buffer, result.outputName, result.format);
    const signedDownloadUrl = storageService.generateSignedDownloadUrl(saved.storageKey, 3600 * 24);

    const response: ApiResponse<typeof result & { outputFileUrl: string; storageKey: string }> = {
      success: true,
      data: {
        ...result,
        outputFileUrl: signedDownloadUrl,
        storageKey: saved.storageKey
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - startTime
      }
    };

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'EDIT_FAILED', message: err.message || 'Image editing failed.' } },
      { status: 500 }
    );
  }
}

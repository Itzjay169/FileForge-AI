import { NextRequest, NextResponse } from 'next/server';
import { mediaEditorEngine } from '@/lib/server/media-editor-engine';
import { storageService } from '@/lib/server/storage-service';
import { validateFileBuffer } from '@/lib/server/file-validator';
import { ApiResponse } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const contentType = request.headers.get('content-type') || '';
    let buffer: Buffer;
    let filename: string;
    let mimeType: string;
    let mediaType: 'video' | 'audio' = 'video';
    let options: any;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const mediaTypeRaw = formData.get('mediaType') as string | null;
      const optionsJson = formData.get('options') as string | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: { code: 'MISSING_FILE', message: 'No media file provided.' } },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      filename = file.name;
      mimeType = file.type;
      mediaType = mediaTypeRaw === 'audio' ? 'audio' : 'video';
      options = optionsJson ? JSON.parse(optionsJson) : {};
    } else {
      const body = await request.json();
      const { storageKey, originalName, mimeType: declaredMime, mediaType: bodyMedia, options: bodyOptions } = body;

      if (!storageKey) {
        return NextResponse.json(
          { success: false, error: { code: 'MISSING_KEY', message: 'Storage key required.' } },
          { status: 400 }
        );
      }

      buffer = await storageService.getFileBuffer(storageKey);
      filename = originalName || 'media.mp4';
      mimeType = declaredMime || 'video/mp4';
      mediaType = bodyMedia === 'audio' ? 'audio' : 'video';
      options = bodyOptions || {};
    }

    const validation = validateFileBuffer(buffer, filename, mimeType);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_FAILED', message: validation.error || 'Invalid file.' } },
        { status: 422 }
      );
    }

    const result = mediaType === 'audio'
      ? await mediaEditorEngine.editAudio(buffer, validation.sanitizedName, options)
      : await mediaEditorEngine.editVideo(buffer, validation.sanitizedName, options);

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
      { success: false, error: { code: 'MEDIA_EDIT_FAILED', message: err.message || 'Media edit failed.' } },
      { status: 500 }
    );
  }
}

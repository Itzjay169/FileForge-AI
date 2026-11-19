import { NextRequest, NextResponse } from 'next/server';
import { pdfStudioEngine } from '@/lib/server/pdf-studio-engine';
import { storageService } from '@/lib/server/storage-service';
import { validateFileBuffer } from '@/lib/server/file-validator';
import { PdfToolOptions, ApiResponse } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const contentType = request.headers.get('content-type') || '';
    let buffer: Buffer;
    let filename: string;
    let mimeType: string;
    let options: PdfToolOptions;
    let additionalBuffers: Buffer[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const optionsJson = formData.get('options') as string | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: { code: 'MISSING_FILE', message: 'No primary PDF provided.' } },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      filename = file.name;
      mimeType = file.type || 'application/pdf';
      options = optionsJson ? JSON.parse(optionsJson) : { mode: 'compress' };

      // Optional merge additional files
      const extraFiles = formData.getAll('additionalFiles') as File[];
      for (const extra of extraFiles) {
        const ab = await extra.arrayBuffer();
        additionalBuffers.push(Buffer.from(ab));
      }
    } else {
      const body = await request.json();
      const { storageKey, originalName, options: bodyOptions } = body;

      if (!storageKey) {
        return NextResponse.json(
          { success: false, error: { code: 'MISSING_KEY', message: 'Storage key required.' } },
          { status: 400 }
        );
      }

      buffer = await storageService.getFileBuffer(storageKey);
      filename = originalName || 'document.pdf';
      mimeType = 'application/pdf';
      options = bodyOptions || { mode: 'compress' };
    }

    const validation = validateFileBuffer(buffer, filename, mimeType);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_FAILED', message: validation.error || 'Invalid file.' } },
        { status: 422 }
      );
    }

    const result = await pdfStudioEngine.processPdf(
      buffer,
      validation.sanitizedName,
      options,
      additionalBuffers
    );

    const saved = await storageService.saveFile(
      result.buffer,
      result.outputName,
      options.mode === 'ocr' ? 'txt' : 'pdf'
    );
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
      { success: false, error: { code: 'PDF_TOOL_FAILED', message: err.message || 'PDF processing failed.' } },
      { status: 500 }
    );
  }
}

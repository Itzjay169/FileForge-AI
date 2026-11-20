import { NextRequest, NextResponse } from 'next/server';
import { watermarkTransparencyEngine } from '@/lib/server/watermark-transparency-engine';
import { storageService } from '@/lib/server/storage-service';
import { WatermarkApplyOptionsSchema } from '@fileforge/shared';
import { validateFileBuffer } from '@/lib/server/file-validator';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let buffer: Buffer;
    let filename: string;
    let rawOptions: unknown;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const optionsJson = formData.get('options') as string | null;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      buffer = Buffer.from(await file.arrayBuffer());
      filename = file.name;
      rawOptions = optionsJson ? JSON.parse(optionsJson) : {};
    } else {
      const body = await req.json();
      const { storageKey, originalName, options } = body;
      if (!storageKey) {
        return NextResponse.json({ error: 'storageKey required' }, { status: 400 });
      }

      buffer = await storageService.getFileBuffer(storageKey);
      filename = originalName || storageKey.split('/').pop() || 'document';
      rawOptions = options || {};
    }

    const parseRes = WatermarkApplyOptionsSchema.safeParse(rawOptions);
    if (!parseRes.success) {
      return NextResponse.json(
        { error: 'Invalid watermark options', details: parseRes.error.flatten() },
        { status: 400 }
      );
    }

    const validation = validateFileBuffer(buffer, filename, 'application/octet-stream');
    const result = await watermarkTransparencyEngine.applyWatermark(
      buffer,
      validation.sanitizedName,
      parseRes.data
    );

    // Persist result
    const saved = await storageService.saveFile(result.buffer, result.outputName, result.format);
    const downloadUrl = storageService.generateSignedDownloadUrl(saved.storageKey, 3600 * 24);

    return NextResponse.json({
      success: true,
      filename: result.outputName,
      size: result.sizeBytes,
      durationMs: result.durationMs,
      storageKey: saved.storageKey,
      url: downloadUrl,
      auditRecordId: result.auditRecordId
    });
  } catch (err: unknown) {
    console.error('Watermark API error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Watermarking failed' }, { status: 500 });
  }
}

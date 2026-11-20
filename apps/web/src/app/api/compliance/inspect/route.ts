import { NextRequest, NextResponse } from 'next/server';
import { metadataInspectorEngine } from '@/lib/server/metadata-inspector-engine';
import { storageService } from '@/lib/server/storage-service';
import { validateFileBuffer } from '@/lib/server/file-validator';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let buffer: Buffer;
    let filename: string;
    let mimeType: string;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
      }
      filename = file.name;
      mimeType = file.type || 'application/octet-stream';
      buffer = Buffer.from(await file.arrayBuffer());
    } else {
      const body = await req.json();
      const { storageKey, originalName, mimeType: declaredMime } = body;
      if (!storageKey) {
        return NextResponse.json({ error: 'storageKey required' }, { status: 400 });
      }
      buffer = await storageService.getFileBuffer(storageKey);
      filename = originalName || storageKey.split('/').pop() || 'unknown-file';
      mimeType = declaredMime || 'application/octet-stream';
    }

    // Run security validation
    const validation = validateFileBuffer(buffer, filename, mimeType);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'File rejected by security validation', details: validation.error },
        { status: 422 }
      );
    }

    const report = await metadataInspectorEngine.inspectFile(buffer, validation.sanitizedName, mimeType);
    return NextResponse.json(report, { status: 200 });
  } catch (err: unknown) {
    console.error('Compliance Inspect API error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Inspection failed' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/server/storage-service';
import { fileRegistry } from '@fileforge/file-registry';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const storageKey = searchParams.get('key');
  const expiresStr = searchParams.get('expires');
  const signature = searchParams.get('sig');

  if (!storageKey || !expiresStr || !signature) {
    return NextResponse.json(
      { error: 'Missing required signature parameters (key, expires, sig).' },
      { status: 400 }
    );
  }

  const expires = parseInt(expiresStr, 10);
  const isValid = storageService.verifySignedUrl(storageKey, expires, signature);

  if (!isValid) {
    return NextResponse.json(
      { error: 'Download URL signature is invalid or has expired.' },
      { status: 403 }
    );
  }

  try {
    const buffer = await storageService.getFileBuffer(storageKey);
    const filename = storageKey.split('/').pop() || 'file';
    const ext = filename.split('.').pop() || '';
    const format = fileRegistry.getFormat(ext);
    const contentType = format?.mimeTypes[0] || 'application/octet-stream';

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'private, max-age=3600'
      }
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: `File not found or storage unreadable: ${(err as Error).message}` },
      { status: 404 }
    );
  }
}

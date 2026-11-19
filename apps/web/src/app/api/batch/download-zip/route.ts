import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { storageService } from '@/lib/server/storage-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storageKeys, filenames } = body as {
      storageKeys: string[];
      filenames?: string[];
    };

    if (!storageKeys || !Array.isArray(storageKeys) || storageKeys.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'An array of storage keys is required.'
          }
        },
        { status: 400 }
      );
    }

    const zip = new JSZip();

    for (let i = 0; i < storageKeys.length; i++) {
      const key = storageKeys[i];
      try {
        const fileBuffer = await storageService.getFileBuffer(key);
        const name = (filenames && filenames[i]) || key.split('/').pop() || `file-${i + 1}`;
        zip.file(name, fileBuffer);
      } catch (fileErr) {
        console.warn(`Could not add ${key} to batch ZIP:`, fileErr);
      }
    }

    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });

    const timestamp = new Date().toISOString().slice(0, 10);
    const downloadFilename = `fileforge-batch-optimized-${timestamp}.zip`;

    return new NextResponse(zipBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
        'Content-Length': zipBuffer.length.toString(),
        'Cache-Control': 'no-store'
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ZIP_GENERATION_FAILED',
          message: err.message || 'Failed to assemble batch ZIP archive.'
        }
      },
      { status: 500 }
    );
  }
}

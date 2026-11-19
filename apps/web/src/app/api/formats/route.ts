import { NextRequest, NextResponse } from 'next/server';
import { fileRegistry } from '@fileforge/file-registry';
import { ApiResponse, FileCategory } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get('q') || searchParams.get('search') || undefined;
  const category = (searchParams.get('category') as FileCategory) || undefined;
  const canCompressParam = searchParams.get('canCompress');
  const canConvertParam = searchParams.get('canConvert');

  let formats = fileRegistry.searchFormats(query, category);

  if (canCompressParam === 'true') {
    formats = formats.filter((f) => f.compressionSupported);
  }

  if (canConvertParam === 'true') {
    formats = formats.filter((f) => f.conversionTargets.length > 0);
  }

  const response: ApiResponse = {
    success: true,
    data: {
      total: formats.length,
      formats,
      categories: fileRegistry.getCategories()
    },
    meta: {
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      processingTimeMs: Date.now() - startTime
    }
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}

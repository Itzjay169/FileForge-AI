import { NextResponse } from 'next/server';
import { fileRegistry } from '@fileforge/file-registry';
import { ApiResponse } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const allFormats = fileRegistry.getAllFormats();
  const categories = fileRegistry.getCategories();

  const totalFormats = allFormats.length;
  const compressibleFormats = allFormats.filter((f) => f.compressionSupported).length;
  const convertibleFormats = allFormats.filter((f) => f.conversionTargets.length > 0).length;
  const previewableFormats = allFormats.filter((f) => f.previewSupported).length;

  const response: ApiResponse = {
    success: true,
    data: {
      totalFormatsSupported: totalFormats,
      categoriesCount: categories.length,
      compressibleCount: compressibleFormats,
      convertibleCount: convertibleFormats,
      previewableCount: previewableFormats,
      freeTierMaxFileSizeMb: 2048, // 2 GB
      averageCompressionRatio: 65, // 65% average savings
      communityFilesProcessed: '1,428,950+'
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
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600'
    }
  });
}

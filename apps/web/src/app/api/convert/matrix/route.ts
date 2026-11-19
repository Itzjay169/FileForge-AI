import { NextRequest, NextResponse } from 'next/server';
import { conversionMatrix } from '@/lib/server/conversion-matrix';
import { fileRegistry } from '@fileforge/file-registry';
import { ApiResponse } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');
  const target = searchParams.get('target');

  // Case 1: Specific source and target provided
  if (source && target) {
    const route = conversionMatrix.getRoute(source, target);
    const response: ApiResponse<typeof route> = {
      success: true,
      data: route
    };
    return NextResponse.json(response);
  }

  // Case 2: Source provided, return all compatible target formats
  if (source) {
    const targets = conversionMatrix.getAvailableTargets(source);
    const response: ApiResponse<typeof targets> = {
      success: true,
      data: targets
    };
    return NextResponse.json(response);
  }

  // Case 3: Return all categories and their formats with conversion availability
  const allFormats = fileRegistry.getAllFormats();
  const matrixSummary = allFormats.map(f => ({
    extension: f.extension,
    name: f.name,
    category: f.category,
    targetCount: f.conversionTargets.length,
    targets: f.conversionTargets
  }));

  const response: ApiResponse<typeof matrixSummary> = {
    success: true,
    data: matrixSummary
  };
  return NextResponse.json(response);
}

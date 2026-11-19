import { NextRequest, NextResponse } from 'next/server';
import { fileRegistry } from '@fileforge/file-registry';
import { ApiResponse } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    extension: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const startTime = Date.now();
  const { extension } = await context.params;

  if (!extension) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: 'File extension parameter is required'
        }
      },
      { status: 400 }
    );
  }

  const format = fileRegistry.getFormat(extension);

  if (!format) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FORMAT_NOT_FOUND',
          message: `The file format .${extension} is not recognized or not currently supported.`
        }
      },
      { status: 404 }
    );
  }

  const availableConversions = fileRegistry.getAvailableConversions(extension);

  const response: ApiResponse = {
    success: true,
    data: {
      format,
      availableConversions
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

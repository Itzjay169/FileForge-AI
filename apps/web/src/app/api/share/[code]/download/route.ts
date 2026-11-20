import { NextRequest, NextResponse } from 'next/server';
import { shareService } from '@/lib/server/share-service';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    code: string;
  }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { code } = await context.params;
    const body = await req.json().catch(() => ({}));
    const password = body?.password;

    const downloadInfo = shareService.authorizeDownload(code, password);
    return NextResponse.json({
      success: true,
      downloadUrl: downloadInfo.downloadUrl,
      fileName: downloadInfo.fileName
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

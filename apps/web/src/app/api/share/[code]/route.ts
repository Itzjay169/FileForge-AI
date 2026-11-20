import { NextRequest, NextResponse } from 'next/server';
import { shareService } from '@/lib/server/share-service';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    code: string;
  }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { code } = await context.params;
    const { searchParams } = new URL(req.url);
    const password = searchParams.get('pwd') || undefined;

    const result = shareService.getShareLink(code, password);
    return NextResponse.json({
      link: result.link,
      isPasswordRequired: result.isPasswordRequired,
      isAuthorized: result.isAuthorized
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { code } = await context.params;
    const body = await req.json().catch(() => ({}));
    const password = body?.password;

    const result = shareService.getShareLink(code, password);
    return NextResponse.json({
      link: result.link,
      isPasswordRequired: result.isPasswordRequired,
      isAuthorized: result.isAuthorized
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

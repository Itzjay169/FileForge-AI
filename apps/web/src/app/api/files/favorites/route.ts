import { NextRequest, NextResponse } from 'next/server';
import { accountStore } from '@/lib/server/account-store-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileId } = body;
    if (!fileId) return NextResponse.json({ error: 'fileId required' }, { status: 400 });

    const isFavorite = accountStore.toggleFavorite(fileId);
    return NextResponse.json({ success: true, isFavorite }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

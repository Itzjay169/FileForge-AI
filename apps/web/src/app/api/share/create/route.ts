import { NextRequest, NextResponse } from 'next/server';
import { shareService } from '@/lib/server/share-service';
import { accountStore } from '@/lib/server/account-store-service';
import { CreateShareLinkSchema } from '@fileforge/shared';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseRes = CreateShareLinkSchema.safeParse(body);
    if (!parseRes.success) {
      return NextResponse.json(
        { error: 'Invalid share link parameters', details: parseRes.error.flatten() },
        { status: 400 }
      );
    }

    const { fileId, password, expiresInHours, maxDownloads } = parseRes.data;
    const file = accountStore.getFile(fileId);
    if (!file) {
      return NextResponse.json({ error: `File with ID "${fileId}" not found in library` }, { status: 404 });
    }

    const link = shareService.createShareLink(file, {
      password,
      expiresInHours,
      maxDownloads
    });

    return NextResponse.json({ success: true, link }, { status: 201 });
  } catch (err: unknown) {
    console.error('Create Share Link API error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Failed to create share link' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { accountStore } from '@/lib/server/account-store-service';
import { UpdateFileMetaSchema } from '@fileforge/shared';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const folderId = searchParams.get('folderId') || undefined;
    const favoritesOnly = searchParams.get('favoritesOnly') === 'true';
    const workspaceId = searchParams.get('workspaceId') || undefined;

    const files = accountStore.listFiles('usr_creative_pro_01', {
      search,
      category,
      folderId,
      favoritesOnly,
      workspaceId
    });

    return NextResponse.json({ files }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, sizeBytes, format, category, storageKey, downloadUrl, folderId, tags } = body;

    if (!name || !sizeBytes || !format || !storageKey) {
      return NextResponse.json({ error: 'Missing required file fields' }, { status: 400 });
    }

    const newRecord = accountStore.addFile({
      userId: 'usr_creative_pro_01',
      name,
      sizeBytes,
      format,
      category: category || 'others',
      storageKey,
      downloadUrl: downloadUrl || `/api/files/download?key=${storageKey}`,
      isFavorite: false,
      folderId,
      tags: tags || []
    });

    return NextResponse.json({ file: newRecord }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('id');
    if (!fileId) return NextResponse.json({ error: 'File ID required' }, { status: 400 });

    const body = await req.json();
    const parseRes = UpdateFileMetaSchema.safeParse(body);
    if (!parseRes.success) {
      return NextResponse.json({ error: 'Invalid metadata updates', details: parseRes.error.flatten() }, { status: 400 });
    }

    const updated = accountStore.updateFile(fileId, parseRes.data);
    return NextResponse.json({ file: updated }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('id');
    if (!fileId) return NextResponse.json({ error: 'File ID required' }, { status: 400 });

    const deleted = accountStore.deleteFile(fileId);
    return NextResponse.json({ success: deleted }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

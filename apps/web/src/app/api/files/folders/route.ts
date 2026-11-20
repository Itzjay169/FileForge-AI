import { NextRequest, NextResponse } from 'next/server';
import { accountStore } from '@/lib/server/account-store-service';
import { CreateFolderSchema } from '@fileforge/shared';

export async function GET() {
  try {
    const folders = accountStore.listFolders('usr_creative_pro_01');
    return NextResponse.json({ folders }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseRes = CreateFolderSchema.safeParse(body);
    if (!parseRes.success) {
      return NextResponse.json({ error: 'Invalid folder data', details: parseRes.error.flatten() }, { status: 400 });
    }

    const folder = accountStore.createFolder(
      parseRes.data.name,
      'usr_creative_pro_01',
      parseRes.data.color,
      parseRes.data.parentId
    );

    return NextResponse.json({ folder }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

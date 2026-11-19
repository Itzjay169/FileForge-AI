import { NextRequest, NextResponse } from 'next/server';
import { accountStore } from '@/lib/server/account-store-service';
import { CreateWorkspaceSchema } from '@fileforge/shared';

export async function GET(req: NextRequest) {
  try {
    const workspaces = accountStore.listWorkspaces('usr_creative_pro_01');
    return NextResponse.json({ workspaces }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseRes = CreateWorkspaceSchema.safeParse(body);
    if (!parseRes.success) {
      return NextResponse.json({ error: 'Invalid workspace parameters', details: parseRes.error.flatten() }, { status: 400 });
    }

    const workspace = accountStore.createWorkspace(
      parseRes.data.name,
      parseRes.data.slug,
      'usr_creative_pro_01'
    );

    return NextResponse.json({ workspace }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

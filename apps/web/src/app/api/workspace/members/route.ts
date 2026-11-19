import { NextRequest, NextResponse } from 'next/server';
import { accountStore } from '@/lib/server/account-store-service';
import { InviteWorkspaceMemberSchema } from '@fileforge/shared';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');
    if (!workspaceId) return NextResponse.json({ error: 'workspaceId required' }, { status: 400 });

    const members = accountStore.getWorkspaceMembers(workspaceId);
    return NextResponse.json({ members }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseRes = InviteWorkspaceMemberSchema.safeParse(body);
    if (!parseRes.success) {
      return NextResponse.json({ error: 'Invalid invite parameters', details: parseRes.error.flatten() }, { status: 400 });
    }

    const newMember = accountStore.inviteMember(
      parseRes.data.workspaceId,
      parseRes.data.email,
      parseRes.data.role,
      'usr_creative_pro_01'
    );

    return NextResponse.json({ success: true, member: newMember }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

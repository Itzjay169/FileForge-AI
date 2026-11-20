import { NextRequest, NextResponse } from 'next/server';
import { accountStore } from '@/lib/server/account-store-service';
import { UserProfileUpdateSchema } from '@fileforge/shared';

export async function GET() {
  try {
    const profile = accountStore.getProfile();
    return NextResponse.json({ profile }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parseRes = UserProfileUpdateSchema.safeParse(body);
    if (!parseRes.success) {
      return NextResponse.json({ error: 'Invalid profile data', details: parseRes.error.flatten() }, { status: 400 });
    }

    const updated = accountStore.updateProfile('usr_creative_pro_01', parseRes.data);
    return NextResponse.json({ profile: updated }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

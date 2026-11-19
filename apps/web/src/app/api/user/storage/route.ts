import { NextRequest, NextResponse } from 'next/server';
import { accountStore } from '@/lib/server/account-store-service';

export async function GET(req: NextRequest) {
  try {
    const storage = accountStore.getStorageInfo();
    return NextResponse.json({ storage }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

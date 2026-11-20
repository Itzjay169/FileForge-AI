import { NextResponse } from 'next/server';
import { accountStore } from '@/lib/server/account-store-service';

export async function GET() {
  try {
    const storage = accountStore.getStorageInfo();
    return NextResponse.json({ storage }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

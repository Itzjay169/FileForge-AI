import { NextResponse } from 'next/server';
import { AdminService } from '../../../lib/server/admin-service';

export async function GET() {
  try {
    const changelog = AdminService.getInstance().listChangelog();
    return NextResponse.json({ success: true, changelog });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

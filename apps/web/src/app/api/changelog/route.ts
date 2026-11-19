import { NextResponse } from 'next/server';
import { AdminService } from '../../../lib/server/admin-service';

export async function GET() {
  try {
    const changelog = AdminService.getInstance().listChangelog();
    return NextResponse.json({ success: true, changelog });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

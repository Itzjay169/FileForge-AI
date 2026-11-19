import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '../../../../lib/server/admin-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status') || undefined;
    const type = searchParams.get('type') || undefined;

    const data = AdminService.getInstance().listJobs(page, limit, status, type);
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

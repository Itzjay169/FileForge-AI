import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '../../../../lib/server/admin-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || undefined;

    const data = AdminService.getInstance().listUsers(page, limit, search);
    return NextResponse.json({ success: true, ...data });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, action, reason } = body;

    if (!userId || !action) {
      return NextResponse.json({ success: false, error: 'Missing userId or action' }, { status: 400 });
    }

    const adminService = AdminService.getInstance();
    if (action === 'ban') {
      adminService.banUser(userId, reason);
    } else if (action === 'unban') {
      adminService.unbanUser(userId);
    } else {
      return NextResponse.json({ success: false, error: `Invalid action: ${action}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, action, userId });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

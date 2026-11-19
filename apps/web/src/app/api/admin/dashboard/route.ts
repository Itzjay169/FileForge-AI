import { NextResponse } from 'next/server';
import { AdminService } from '../../../../lib/server/admin-service';

export async function GET() {
  try {
    const stats = AdminService.getInstance().getDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

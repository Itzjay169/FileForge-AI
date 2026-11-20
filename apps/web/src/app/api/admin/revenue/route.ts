import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '../../../../lib/server/admin-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const periods = parseInt(searchParams.get('periods') || '6', 10);

    const breakdown = AdminService.getInstance().getRevenueBreakdown(periods);
    return NextResponse.json({ success: true, periods: breakdown });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

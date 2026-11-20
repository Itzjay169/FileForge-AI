import { NextResponse } from 'next/server';
import { AdminService } from '../../../lib/server/admin-service';

export async function GET() {
  try {
    const statuses = AdminService.getInstance().getSystemStatus();
    const hasDegraded = statuses.some((s) => s.status === 'DEGRADED');
    const hasDown = statuses.some((s) => s.status === 'DOWN');

    const overall = hasDown ? 'DOWN' : hasDegraded ? 'DEGRADED' : 'OPERATIONAL';

    return NextResponse.json({
      success: true,
      overall,
      updatedAt: Date.now(),
      services: statuses
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

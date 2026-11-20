import { NextRequest, NextResponse } from 'next/server';
import { complianceStore } from '@/lib/server/compliance-store-service';
import { AdminReviewActionSchema, OwnershipRequestStatus } from '@fileforge/shared';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');
    const status = statusParam ? (statusParam as OwnershipRequestStatus) : undefined;

    const requests = complianceStore.listVerificationRequests(status);
    const abuseReports = complianceStore.listAbuseReports();
    const auditLogs = complianceStore.listAuditLogs();

    return NextResponse.json({
      requests,
      abuseReports,
      auditLogs,
      stats: {
        pendingCount: requests.filter((r) => r.status === 'PENDING_REVIEW').length,
        approvedCount: requests.filter((r) => r.status === 'APPROVED').length,
        rejectedCount: requests.filter((r) => r.status === 'REJECTED').length,
        flaggedCount: requests.filter((r) => r.status === 'FLAGGED').length,
        abuseReportsCount: abuseReports.length,
        totalAuditRecords: auditLogs.length
      }
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to fetch admin compliance data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseRes = AdminReviewActionSchema.safeParse(body);

    if (!parseRes.success) {
      return NextResponse.json(
        { error: 'Invalid admin action payload', details: parseRes.error.flatten() },
        { status: 400 }
      );
    }

    const { requestId, action, adminNotes } = parseRes.data;

    const updated = complianceStore.reviewVerificationRequest(
      requestId,
      action,
      adminNotes,
      'admin_reviewer_session'
    );

    return NextResponse.json({
      success: true,
      message: `Request ${requestId} status updated to ${updated.status}`,
      request: updated
    });
  } catch (err: unknown) {
    console.error('Admin Review error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Admin review update failed' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { complianceStore } from '@/lib/server/compliance-store-service';
import { AbuseReportSchema } from '@fileforge/shared';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseRes = AbuseReportSchema.safeParse(body);

    if (!parseRes.success) {
      return NextResponse.json(
        { error: 'Invalid abuse report payload', details: parseRes.error.flatten() },
        { status: 400 }
      );
    }

    const report = complianceStore.createAbuseReport({
      reporterEmail: parseRes.data.reporterEmail,
      targetFileHash: parseRes.data.targetFileHash,
      reason: parseRes.data.reason,
      details: parseRes.data.details
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Abuse report logged. Our Trust & Safety and Legal team will review the claim promptly.',
        reportId: report.id
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Abuse Report API error:', err);
    return NextResponse.json({ error: err.message || 'Report submission failed' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { BillingService } from '../../../../lib/server/billing-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const provider = body.provider || 'STRIPE';
    const eventType = body.eventType || 'unknown';
    const payload = body.payload || {};

    const billingService = BillingService.getInstance();
    const event = billingService.processWebhook(provider, eventType, payload);

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { BillingService } from '../../../../lib/server/billing-service';

export async function GET() {
  try {
    const plans = BillingService.getInstance().getPlans();
    return NextResponse.json({ success: true, plans });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

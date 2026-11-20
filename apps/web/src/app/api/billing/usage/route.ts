import { NextResponse } from 'next/server';
import { BillingService } from '../../../../lib/server/billing-service';

const DEFAULT_USER_ID = 'usr_creative_pro_01';

export async function GET() {
  try {
    const meter = BillingService.getInstance().getUsageMeter(DEFAULT_USER_ID);
    return NextResponse.json({ success: true, usage: meter });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

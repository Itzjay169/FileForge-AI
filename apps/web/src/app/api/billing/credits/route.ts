import { NextRequest, NextResponse } from 'next/server';
import { BillingService } from '../../../../lib/server/billing-service';
import { PurchaseCreditsSchema } from '@fileforge/shared';

const DEFAULT_USER_ID = 'usr_creative_pro_01';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PurchaseCreditsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.issues }, { status: 400 });
    }

    const billingService = BillingService.getInstance();
    const purchase = billingService.purchaseCredits(
      DEFAULT_USER_ID,
      parsed.data.credits,
      parsed.data.amountCents,
      parsed.data.paymentProvider
    );

    return NextResponse.json({ success: true, purchase });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

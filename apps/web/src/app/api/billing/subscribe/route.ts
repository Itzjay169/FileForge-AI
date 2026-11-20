import { NextRequest, NextResponse } from 'next/server';
import { BillingService } from '../../../../lib/server/billing-service';
import { CreateSubscriptionSchema, CancelSubscriptionSchema } from '@fileforge/shared';

const DEFAULT_USER_ID = 'usr_creative_pro_01';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateSubscriptionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.issues }, { status: 400 });
    }

    const billingService = BillingService.getInstance();
    const subscription = billingService.createSubscription(
      DEFAULT_USER_ID,
      parsed.data.planTier,
      parsed.data.paymentProvider
    );

    return NextResponse.json({ success: true, subscription });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CancelSubscriptionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.issues }, { status: 400 });
    }

    const billingService = BillingService.getInstance();
    const subscription = billingService.cancelSubscription(
      parsed.data.subscriptionId,
      parsed.data.cancelAtPeriodEnd
    );

    return NextResponse.json({ success: true, subscription });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

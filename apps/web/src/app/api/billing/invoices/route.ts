import { NextRequest, NextResponse } from 'next/server';
import { BillingService } from '../../../../lib/server/billing-service';
import { RefundInvoiceSchema } from '@fileforge/shared';

const DEFAULT_USER_ID = 'usr_creative_pro_01';

export async function GET() {
  try {
    const invoices = BillingService.getInstance().getInvoices(DEFAULT_USER_ID);
    return NextResponse.json({ success: true, invoices });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RefundInvoiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.issues }, { status: 400 });
    }

    const billingService = BillingService.getInstance();
    const invoice = billingService.refundInvoice(parsed.data.invoiceId, parsed.data.reason);

    return NextResponse.json({ success: true, invoice });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

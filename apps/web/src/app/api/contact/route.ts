import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '../../../lib/server/admin-service';
import { ContactFormSchema } from '@fileforge/shared';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ContactFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.issues }, { status: 400 });
    }

    const { name, email, subject, message, category } = parsed.data;

    const ticket = AdminService.getInstance().createSupportTicket({
      userId: `guest_${email.split('@')[0]}`,
      userEmail: email,
      subject: `[${category}] ${subject} (From: ${name})`,
      body: message,
      category,
      priority: category === 'BILLING' || category === 'BUG' ? 'HIGH' : 'LOW'
    });

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been received. Our team will contact you within 24 hours.',
      ticketId: ticket.id
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

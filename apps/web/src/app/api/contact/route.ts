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

    // Dispatch via Webform API if configured
    const webformKey =
      process.env.WEBFORM_API_KEY ||
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.WEBFORM_ACCESS_KEY ||
      process.env.WEB3FORMS_KEY;

    if (webformKey) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            access_key: webformKey,
            subject: `[FileForge AI Contact] [${category}] ${subject}`,
            from_name: 'FileForge AI Contact Desk',
            name: `${name}`,
            email: email,
            category: category,
            message: `New Inquiry via FileForge AI Contact Form\n\nCategory: ${category}\nFrom: ${name} <${email}>\nSubject: ${subject}\n\nMessage:\n${message}`
          })
        });
      } catch (wfErr) {
        console.warn('[Webform API] Contact form dispatch error:', wfErr);
      }
    }

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

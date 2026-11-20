import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '../../../../lib/server/admin-service';
import { CreateSupportTicketSchema } from '@fileforge/shared';

const DEFAULT_USER_ID = 'usr_creative_pro_01';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;

    const tickets = AdminService.getInstance().listSupportTickets(status);
    return NextResponse.json({ success: true, tickets });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateSupportTicketSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.issues }, { status: 400 });
    }

    const ticket = AdminService.getInstance().createSupportTicket({
      userId: DEFAULT_USER_ID,
      ...parsed.data
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing ticket id' }, { status: 400 });
    }

    const ticket = AdminService.getInstance().updateTicket(id, updates);
    return NextResponse.json({ success: true, ticket });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '../../../../lib/server/admin-service';
import { UpdateFeatureFlagSchema } from '@fileforge/shared';

export async function GET() {
  try {
    const flags = AdminService.getInstance().listFeatureFlags();
    return NextResponse.json({ success: true, flags });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing flag id' }, { status: 400 });
    }

    const parsed = UpdateFeatureFlagSchema.safeParse(updates);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.issues }, { status: 400 });
    }

    const updated = AdminService.getInstance().updateFeatureFlag(id, parsed.data);
    return NextResponse.json({ success: true, flag: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

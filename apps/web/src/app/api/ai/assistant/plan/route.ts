import { NextRequest, NextResponse } from 'next/server';
import { aiAssistantEngine } from '@/lib/server/ai-assistant-engine';
import { AiAssistantQuerySchema, ApiResponse, AiAssistantPlan } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = AiAssistantQuerySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: parsed.error.issues[0]?.message || 'Invalid AI prompt format.'
          }
        },
        { status: 400 }
      );
    }

    const { query, fileContext } = parsed.data;
    const plan: AiAssistantPlan = aiAssistantEngine.generatePlan(query, fileContext);

    const response: ApiResponse<AiAssistantPlan> = {
      success: true,
      data: plan
    };

    return NextResponse.json(response);
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'AI_PLAN_FAILED', message: (err as Error).message || 'AI planning failed.' } },
      { status: 500 }
    );
  }
}

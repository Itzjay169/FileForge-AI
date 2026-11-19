import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Session check mock / endpoint for Phase 1
  if (path.endsWith('/session')) {
    return NextResponse.json({
      user: null,
      expires: null
    });
  }

  // Providers list
  if (path.endsWith('/providers')) {
    return NextResponse.json({
      google: {
        id: 'google',
        name: 'Google',
        type: 'oauth',
        signinUrl: '/api/auth/signin/google'
      },
      apple: {
        id: 'apple',
        name: 'Apple',
        type: 'oauth',
        signinUrl: '/api/auth/signin/apple'
      },
      credentials: {
        id: 'credentials',
        name: 'Credentials',
        type: 'credentials'
      }
    });
  }

  // Default CSRF token response
  return NextResponse.json({
    csrfToken: crypto.randomUUID()
  });
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.endsWith('/callback/credentials')) {
    try {
      const body = await request.json();
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
        );
      }

      // Phase 1 demo login
      return NextResponse.json({
        user: {
          id: 'demo-user-1',
          email,
          name: email.split('@')[0],
          role: 'USER',
          planTier: 'PRO_CREATIVE'
        }
      });
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ success: true });
}

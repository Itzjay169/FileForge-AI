import { NextRequest, NextResponse } from 'next/server';
import { complianceStore } from '@/lib/server/compliance-store-service';
import { OwnershipVerificationRequestSchema, OwnershipRequestStatus } from '@fileforge/shared';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseRes = OwnershipVerificationRequestSchema.safeParse(body);

    if (!parseRes.success) {
      return NextResponse.json(
        { error: 'Invalid verification request parameters', details: parseRes.error.flatten() },
        { status: 400 }
      );
    }

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const newRequest = complianceStore.createVerificationRequest({
      fileHash: parseRes.data.fileHash,
      fileName: parseRes.data.fileName,
      fileSizeBytes: parseRes.data.fileSizeBytes,
      storageKey: parseRes.data.storageKey,
      userId: body.userId || 'usr_anonymous_creator',
      userEmail: parseRes.data.userEmail,
      reasonCode: parseRes.data.reasonCode,
      ownershipProofDescription: parseRes.data.ownershipProofDescription,
      proofDocumentUrl: parseRes.data.proofDocumentUrl,
      legalDeclarationSigned: parseRes.data.legalDeclarationSigned,
      declarationSignerName: parseRes.data.declarationSignerName,
      declarationTimestamp: Date.now(),
      ipAddress: clientIp,
      creditCost: parseRes.data.creditCost
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Ownership verification request submitted. Our compliance team will review your proof within 2-4 business hours.',
        request: newRequest
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('Ownership Request API error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Request submission failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');
    const status = statusParam ? (statusParam as OwnershipRequestStatus) : undefined;
    const requests = complianceStore.listVerificationRequests(status);
    return NextResponse.json({ requests }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to list requests' }, { status: 500 });
  }
}

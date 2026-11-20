import { NextRequest, NextResponse } from 'next/server';
import { watermarkTransparencyEngine } from '@/lib/server/watermark-transparency-engine';
import { complianceStore } from '@/lib/server/compliance-store-service';
import { storageService } from '@/lib/server/storage-service';
import { validateFileBuffer } from '@/lib/server/file-validator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requestId, storageKey } = body;

    if (!requestId || !storageKey) {
      return NextResponse.json(
        { error: 'requestId and storageKey are both required' },
        { status: 400 }
      );
    }

    const verificationRequest = complianceStore.getVerificationRequest(requestId);
    if (!verificationRequest) {
      return NextResponse.json(
        { error: `Verification request with ID "${requestId}" not found` },
        { status: 404 }
      );
    }

    // Strict status verification
    if (verificationRequest.status !== 'APPROVED') {
      return NextResponse.json(
        {
          error: 'UNAUTHORIZED_REMOVAL_REQUEST',
          message: `Watermark removal denied. Verification request status is "${verificationRequest.status}". FileForge AI requires an approved verification request and signed declaration to execute watermark removal.`,
          status: verificationRequest.status
        },
        { status: 403 }
      );
    }

    const buffer = await storageService.getFileBuffer(storageKey);
    const validation = validateFileBuffer(buffer, verificationRequest.fileName, 'application/octet-stream');

    const result = await watermarkTransparencyEngine.removeWatermarkVerified(
      buffer,
      validation.sanitizedName,
      verificationRequest
    );

    const saved = await storageService.saveFile(result.buffer, result.outputName, result.format);
    const downloadUrl = storageService.generateSignedDownloadUrl(saved.storageKey, 3600 * 24);

    return NextResponse.json({
      success: true,
      message: 'Verified ownership watermark removal executed successfully. Audit trail logged.',
      filename: result.outputName,
      size: result.sizeBytes,
      durationMs: result.durationMs,
      storageKey: saved.storageKey,
      url: downloadUrl,
      auditRecordId: result.auditRecordId
    });
  } catch (err: unknown) {
    console.error('Verified Removal Execution API error:', err);
    return NextResponse.json(
      { error: (err as Error).message || 'Watermark removal execution failed' },
      { status: 500 }
    );
  }
}

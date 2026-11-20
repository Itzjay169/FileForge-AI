import { NextRequest, NextResponse } from 'next/server';
import { compressionEngine } from '@/lib/server/compression-engine';
import { conversionEngine } from '@/lib/server/conversion-engine';
import { imageEditorEngine } from '@/lib/server/image-editor-engine';
import { storageService } from '@/lib/server/storage-service';
import { validateFileBuffer } from '@/lib/server/file-validator';
import { AiAssistantPlan, ApiResponse, JobResult } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const contentType = request.headers.get('content-type') || '';
    let buffer: Buffer;
    let filename: string;
    let mimeType: string;
    let plan: AiAssistantPlan;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const planJson = formData.get('plan') as string | null;

      if (!file || !planJson) {
        return NextResponse.json(
          { success: false, error: { code: 'MISSING_DATA', message: 'File and AI plan are required.' } },
          { status: 400 }
        );
      }

      const ab = await file.arrayBuffer();
      buffer = Buffer.from(ab);
      filename = file.name;
      mimeType = file.type;
      plan = JSON.parse(planJson);
    } else {
      const body = await request.json();
      const { storageKey, originalName, mimeType: declaredMime, plan: bodyPlan } = body;

      if (!storageKey || !bodyPlan) {
        return NextResponse.json(
          { success: false, error: { code: 'MISSING_DATA', message: 'Storage key and AI plan are required.' } },
          { status: 400 }
        );
      }

      buffer = await storageService.getFileBuffer(storageKey);
      filename = originalName || 'asset';
      mimeType = declaredMime || 'application/octet-stream';
      plan = bodyPlan;
    }

    const validation = validateFileBuffer(buffer, filename, mimeType);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_FAILED', message: validation.error || 'Invalid file.' } },
        { status: 422 }
      );
    }

    let result: JobResult;
    const parts = filename.split('.');
    const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : '';

    if (plan.intent === 'edit_image' && plan.appliedSettings.removeBackground) {
      const editRes = await imageEditorEngine.editImage(buffer, validation.sanitizedName, {
        removeBackground: true,
        outputFormat: 'png'
      });
      const saved = await storageService.saveFile(editRes.buffer, editRes.outputName, 'png');
      result = {
        jobId: crypto.randomUUID(),
        outputFileUrl: storageService.generateSignedDownloadUrl(saved.storageKey, 3600 * 24),
        previewUrl: editRes.previewUrl,
        originalName: filename,
        outputName: editRes.outputName,
        originalSizeBytes: buffer.length,
        outputSizeBytes: editRes.sizeBytes,
        savedBytes: Math.max(0, buffer.length - editRes.sizeBytes),
        savingsPercentage: 0,
        durationMs: editRes.durationMs,
        sha256Hash: editRes.sha256Hash,
        outputFormat: 'png',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
    } else if (plan.intent === 'convert' && plan.targetFormat) {
      result = await conversionEngine.convert({
        buffer,
        originalName: validation.sanitizedName,
        sourceExtension: ext,
        targetExtension: plan.targetFormat,
        options: { targetFormat: plan.targetFormat, ...plan.appliedSettings }
      });
      const saved = await storageService.saveFile(buffer, result.outputName, plan.targetFormat);
      result.outputFileUrl = storageService.generateSignedDownloadUrl(saved.storageKey, 3600 * 24);
    } else {
      // Default: compression / platform optimization
      result = await compressionEngine.compress({
        buffer,
        originalName: validation.sanitizedName,
        extension: ext,
        mimeType: validation.mimeType,
        options: {
          strength: 'BALANCED',
          preset: plan.appliedSettings.preset || 'SMART_COMPRESS',
          quality: plan.appliedSettings.quality || 80,
          stripMetadata: plan.appliedSettings.stripMetadata ?? true,
          outputFormat: plan.targetFormat || ext
        }
      });
      const saved = await storageService.saveFile(buffer, result.outputName, result.outputFormat);
      result.outputFileUrl = storageService.generateSignedDownloadUrl(saved.storageKey, 3600 * 24);
    }

    const response: ApiResponse<JobResult & { plan: AiAssistantPlan }> = {
      success: true,
      data: {
        ...result,
        plan
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - startTime
      }
    };

    return NextResponse.json(response);
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: { code: 'AI_EXECUTE_FAILED', message: (err as Error).message || 'Execution failed.' } },
      { status: 500 }
    );
  }
}

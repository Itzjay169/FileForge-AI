import { NextRequest, NextResponse } from 'next/server';
import { validateUrlForSsrf } from '@/lib/server/ssrf-guard';
import { validateFileBuffer, sanitizeFilename } from '@/lib/server/file-validator';
import { storageService } from '@/lib/server/storage-service';
import { UrlImportSchema } from '@fileforge/shared';
import { ApiResponse } from '@fileforge/shared';

export const dynamic = 'force-dynamic';

const MAX_IMPORT_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB for URL imports
const FETCH_TIMEOUT_MS = 25000; // 25 seconds

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const parsed = UrlImportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: parsed.error.errors[0]?.message || 'Invalid URL import request'
          }
        },
        { status: 400 }
      );
    }

    const { url, filename: customFilename } = parsed.data;

    // 1. Strict SSRF Guard check (DNS lookup, private IP block, cloud metadata block)
    const ssrfCheck = await validateUrlForSsrf(url);
    if (!ssrfCheck.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SSRF_SECURITY_BLOCK',
            message: ssrfCheck.error || 'Requested URL was blocked for security.'
          }
        },
        { status: 403 }
      );
    }

    // 2. Fetch the remote resource with size & timeout limits
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let remoteRes: Response;
    try {
      remoteRes = await fetch(ssrfCheck.sanitizedUrl!.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': 'FileForge-AI-Bot/1.0 (+https://fileforge.ai)'
        }
      });
    } catch (fetchErr: any) {
      clearTimeout(timeout);
      if (fetchErr.name === 'AbortError') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'TIMEOUT',
              message: 'Remote server did not respond within the 25-second limit.'
            }
          },
          { status: 504 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_FAILED',
            message: `Failed to connect to remote host: ${fetchErr.message}`
          }
        },
        { status: 502 }
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!remoteRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'REMOTE_HTTP_ERROR',
            message: `Remote server returned HTTP ${remoteRes.status} (${remoteRes.statusText}).`
          }
        },
        { status: 502 }
      );
    }

    // Check declared Content-Length
    const contentLengthHeader = remoteRes.headers.get('content-length');
    if (contentLengthHeader) {
      const length = parseInt(contentLengthHeader, 10);
      if (length > MAX_IMPORT_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'FILE_TOO_LARGE',
              message: `Remote file size (${(length / (1024 * 1024)).toFixed(1)} MB) exceeds URL import limit of 500 MB.`
            }
          },
          { status: 413 }
        );
      }
    }

    // Read response buffer
    const arrayBuffer = await remoteRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Derive file name from URL path or Content-Disposition
    let filename = customFilename;
    if (!filename) {
      const urlPath = ssrfCheck.sanitizedUrl!.pathname;
      const lastSegment = urlPath.split('/').filter(Boolean).pop();
      filename = lastSegment || 'imported-file';
    }

    filename = sanitizeFilename(filename);

    const declaredMime = remoteRes.headers.get('content-type') || 'application/octet-stream';

    // 3. Run validation on downloaded buffer
    const validation = validateFileBuffer(buffer, filename, declaredMime, MAX_IMPORT_SIZE_BYTES);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: validation.error || 'Downloaded file validation failed.',
            details: { riskLevel: validation.riskLevel }
          }
        },
        { status: 422 }
      );
    }

    // 4. Save to storage
    const saved = await storageService.saveFile(
      buffer,
      validation.sanitizedName,
      validation.detectedExtension
    );

    const signedDownloadUrl = storageService.generateSignedDownloadUrl(saved.storageKey, 3600 * 24);

    const response: ApiResponse = {
      success: true,
      data: {
        fileId: crypto.randomUUID(),
        storageKey: saved.storageKey,
        originalName: validation.sanitizedName,
        extension: validation.detectedExtension,
        mimeType: validation.mimeType,
        sizeBytes: saved.sizeBytes,
        sha256Hash: saved.sha256Hash,
        riskLevel: validation.riskLevel,
        signedDownloadUrl,
        importedFromUrl: url,
        uploadedAt: new Date().toISOString()
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - startTime
      }
    };

    return NextResponse.json(response, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'IMPORT_ERROR',
          message: err.message || 'An unexpected error occurred during URL import.'
        }
      },
      { status: 500 }
    );
  }
}

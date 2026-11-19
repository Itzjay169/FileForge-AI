import crypto from 'crypto';
import sharp from 'sharp';
import {
  WatermarkApplyOptions,
  AiDisclosureOptions,
  OwnershipVerificationRequest,
  WatermarkAuditRecord
} from '@fileforge/shared';
import { complianceStore } from './compliance-store-service';

export interface WatermarkOperationResult {
  buffer: Buffer;
  outputName: string;
  sizeBytes: number;
  durationMs: number;
  format: string;
  auditRecordId?: string;
}

export class WatermarkTransparencyEngine {
  private static instance: WatermarkTransparencyEngine;

  private constructor() {}

  public static getInstance(): WatermarkTransparencyEngine {
    if (!WatermarkTransparencyEngine.instance) {
      WatermarkTransparencyEngine.instance = new WatermarkTransparencyEngine();
    }
    return WatermarkTransparencyEngine.instance;
  }

  // --------------------------------------------------------------------------
  // 1. Apply Visible Watermark (Images & PDFs)
  // --------------------------------------------------------------------------
  public async applyWatermark(
    buffer: Buffer,
    filename: string,
    options: WatermarkApplyOptions
  ): Promise<WatermarkOperationResult> {
    const startTime = performance.now();
    const baseName = filename.replace(/\.[^/.]+$/, '');
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    let outputBuffer: Buffer;
    let format = ext;

    if (ext === 'pdf') {
      outputBuffer = this.applyPdfWatermark(buffer, options);
    } else {
      const res = await this.applyImageWatermark(buffer, options);
      outputBuffer = res.buffer;
      format = res.format;
    }

    const durationMs = Math.round(performance.now() - startTime);
    const outputName = `${baseName}-watermarked.${format}`;

    // Log audit trail
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');
    const audit = complianceStore.logAudit({
      action: 'WATERMARK_APPLIED',
      fileHash,
      details: {
        type: options.type,
        text: options.text,
        position: options.position,
        opacity: options.opacity
      }
    });

    return {
      buffer: outputBuffer,
      outputName,
      sizeBytes: outputBuffer.length,
      durationMs,
      format,
      auditRecordId: audit.id
    };
  }

  private async applyImageWatermark(
    buffer: Buffer,
    options: WatermarkApplyOptions
  ): Promise<{ buffer: Buffer; format: string }> {
    const image = sharp(buffer, { failOn: 'none' });
    const meta = await image.metadata();
    const width = meta.width || 800;
    const height = meta.height || 600;

    const text = options.text || 'FILEFORGE AI • VERIFIED';
    const fontSize = options.fontSize || Math.max(16, Math.round(width / 22));
    const fontColor = options.fontColor || '#ffffff';
    const opacity = Math.max(0.05, Math.min(1.0, options.opacity ?? 0.45));
    const rotation = options.rotation ?? -25;
    const position = options.position || 'center';

    let svgOverlay = '';

    if (position === 'tiled') {
      // Repeat across diagonal grid
      const stepX = Math.round(fontSize * 12);
      const stepY = Math.round(fontSize * 6);
      let patternTexts = '';

      for (let y = -height; y < height * 2; y += stepY) {
        for (let x = -width; x < width * 2; x += stepX) {
          patternTexts += `<text x="${x}" y="${y}" font-family="sans-serif" font-size="${fontSize}" font-weight="bold" fill="${fontColor}" fill-opacity="${opacity}" transform="rotate(${rotation}, ${x}, ${y})">${this.escapeXml(
            text
          )}</text>`;
        }
      }

      svgOverlay = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${patternTexts}</svg>`;
    } else {
      // Single positioned watermark
      let x = width / 2;
      let y = height / 2;
      let textAnchor = 'middle';

      switch (position) {
        case 'bottom_right':
          x = width - 40;
          y = height - 40;
          textAnchor = 'end';
          break;
        case 'bottom_left':
          x = 40;
          y = height - 40;
          textAnchor = 'start';
          break;
        case 'top_right':
          x = width - 40;
          y = 40 + fontSize;
          textAnchor = 'end';
          break;
        case 'top_left':
          x = 40;
          y = 40 + fontSize;
          textAnchor = 'start';
          break;
        case 'center':
        default:
          x = width / 2;
          y = height / 2;
          textAnchor = 'middle';
          break;
      }

      const rotateTransform =
        position === 'center' ? `transform="rotate(${rotation}, ${x}, ${y})"` : '';

      svgOverlay = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <text x="${x}" y="${y}" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="bold" fill="${fontColor}" fill-opacity="${opacity}" text-anchor="${textAnchor}" ${rotateTransform}>
            ${this.escapeXml(text)}
          </text>
        </svg>
      `;
    }

    const processed = await image
      .composite([
        {
          input: Buffer.from(svgOverlay),
          top: 0,
          left: 0
        }
      ])
      .toBuffer();

    return {
      buffer: processed,
      format: meta.format || 'png'
    };
  }

  private applyPdfWatermark(buffer: Buffer, options: WatermarkApplyOptions): Buffer {
    let pdfStr = buffer.toString('latin1');
    const text = options.text || 'CONFIDENTIAL • FILEFORGE VERIFIED';

    // Inject watermark overlay before endstream
    pdfStr = pdfStr.replace(/endstream/g, (match) => {
      const stamp = `
q
/GS0 gs
0.6 0.6 0.6 rg
BT
/F1 32 Tf
1 0 0 1 120 400 Tm
35 rotate
(${this.escapePdf(text)}) Tj
ET
Q
`;
      return stamp + match;
    });

    return Buffer.from(pdfStr, 'latin1');
  }

  // --------------------------------------------------------------------------
  // 2. AI Content Disclosure Embedder
  // --------------------------------------------------------------------------
  public async embedAiDisclosure(
    buffer: Buffer,
    filename: string,
    options: AiDisclosureOptions
  ): Promise<WatermarkOperationResult> {
    const startTime = performance.now();
    const baseName = filename.replace(/\.[^/.]+$/, '');
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    const label =
      options.tier === 'FULLY_AI_GENERATED'
        ? `[AI-GENERATED • ${options.generatorName}]`
        : options.tier === 'AI_ASSISTED'
        ? `[AI-ASSISTED • ${options.generatorName}]`
        : `[HUMAN-AUTHORED WITH AI ENHANCEMENT]`;

    let outputBuffer: Buffer;
    let format = ext;

    if (options.embedVisibleBadge && ext !== 'pdf') {
      const image = sharp(buffer, { failOn: 'none' });
      const meta = await image.metadata();
      const w = meta.width || 800;
      const h = meta.height || 600;

      const badgeSvg = `
        <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
          <rect x="${w - 280}" y="${h - 40}" width="260" height="28" rx="6" fill="#000000" fill-opacity="0.75" stroke="#8b5cf6" stroke-width="1"/>
          <text x="${w - 150}" y="${h - 22}" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#f0eee9" text-anchor="middle">
            ✨ ${this.escapeXml(label)}
          </text>
        </svg>
      `;

      outputBuffer = await image
        .composite([
          {
            input: Buffer.from(badgeSvg),
            top: 0,
            left: 0
          }
        ])
        .toBuffer();
      format = meta.format || 'png';
    } else {
      outputBuffer = buffer;
    }

    const fileHash = crypto.createHash('sha256').update(outputBuffer).digest('hex');
    const audit = complianceStore.logAudit({
      action: 'DISCLOSURE_EMBEDDED',
      fileHash,
      details: {
        tier: options.tier,
        generatorName: options.generatorName,
        embedVisibleBadge: options.embedVisibleBadge,
        embedXmpIptcMetadata: options.embedXmpIptcMetadata
      }
    });

    return {
      buffer: outputBuffer,
      outputName: `${baseName}-ai-disclosed.${format}`,
      sizeBytes: outputBuffer.length,
      durationMs: Math.round(performance.now() - startTime),
      format,
      auditRecordId: audit.id
    };
  }

  // --------------------------------------------------------------------------
  // 3. Verified Ownership Watermark Removal Workflow (Strict Legal Compliance Gate)
  // --------------------------------------------------------------------------
  public async removeWatermarkVerified(
    buffer: Buffer,
    filename: string,
    request: OwnershipVerificationRequest
  ): Promise<WatermarkOperationResult> {
    const startTime = performance.now();
    const currentHash = crypto.createHash('sha256').update(buffer).digest('hex');

    // STRICT COMPLIANCE GATE 1: Request Status Check
    if (request.status !== 'APPROVED') {
      throw new Error(
        `UNAUTHORIZED_WATERMARK_REMOVAL_DENIED: Request ${request.id} has status "${request.status}". ` +
          `FileForge AI strictly enforces DMCA and anti-circumvention protections. ` +
          `Watermark removal is only executed for approved verification requests with certified legal proof of ownership.`
      );
    }

    // STRICT COMPLIANCE GATE 2: Legal Declaration
    if (!request.legalDeclarationSigned || !request.declarationSignerName) {
      throw new Error(
        'LEGAL_DECLARATION_REQUIRED: Watermark removal requires a certified legal statement under penalty of perjury.'
      );
    }

    // STRICT COMPLIANCE GATE 3: Valid Reason Code
    const validReasons = [
      'ORIGINAL_CREATOR_LOST_SOURCE',
      'LICENSED_STOCK_PURCHASED',
      'CLIENT_AUTHORIZED_EDITORIAL',
      'COMPANY_BRAND_REFRESH'
    ];
    if (!validReasons.includes(request.reasonCode)) {
      throw new Error(
        `INVALID_OWNERSHIP_REASON: Reason code "${request.reasonCode}" is not authorized for watermark removal.`
      );
    }

    // Process reconstruction for authorized creator
    const baseName = filename.replace(/\.[^/.]+$/, '');
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    let outputBuffer: Buffer;
    let format = ext;

    if (ext === 'pdf') {
      // In PDF, strip unreferenced watermark text operators
      let pdfStr = buffer.toString('latin1');
      pdfStr = pdfStr.replace(/\([^\)]*(?:CONFIDENTIAL|WATERMARK|SAMPLE|PROOF)[^\)]*\)\s*Tj/gi, '() Tj');
      outputBuffer = Buffer.from(pdfStr, 'latin1');
    } else {
      // In raster images, apply gentle median/noise reduction over composite layers
      const image = sharp(buffer, { failOn: 'none' });
      outputBuffer = await image.median(1).toBuffer();
      const meta = await sharp(outputBuffer).metadata();
      format = meta.format || ext;
    }

    // Log irreversible audit record
    const audit = complianceStore.logAudit({
      action: 'VERIFIED_OWNERSHIP_REMOVAL',
      fileHash: currentHash,
      userId: request.userId,
      ipAddress: request.ipAddress,
      reasonCode: request.reasonCode,
      legalSignature: request.declarationSignerName,
      details: {
        requestId: request.id,
        userEmail: request.userEmail,
        creditCost: request.creditCost
      }
    });

    return {
      buffer: outputBuffer,
      outputName: `${baseName}-owner-verified.${format}`,
      sizeBytes: outputBuffer.length,
      durationMs: Math.round(performance.now() - startTime),
      format,
      auditRecordId: audit.id
    };
  }

  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case '\'':
          return '&apos;';
        case '"':
          return '&quot;';
        default:
          return c;
      }
    });
  }

  private escapePdf(text: string): string {
    return text.replace(/[()\\]/g, '\\$&');
  }
}

export const watermarkTransparencyEngine = WatermarkTransparencyEngine.getInstance();

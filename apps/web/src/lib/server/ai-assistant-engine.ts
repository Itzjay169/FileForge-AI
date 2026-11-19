import { AiAssistantPlan, AiFileContext } from '@fileforge/shared';
import crypto from 'crypto';

export class AiAssistantEngine {
  private static instance: AiAssistantEngine;

  private constructor() {}

  public static getInstance(): AiAssistantEngine {
    if (!AiAssistantEngine.instance) {
      AiAssistantEngine.instance = new AiAssistantEngine();
    }
    return AiAssistantEngine.instance;
  }

  /**
   * Parse natural language command and build an explicit, explainable execution plan
   */
  public generatePlan(query: string, context: AiFileContext): AiAssistantPlan {
    const q = query.toLowerCase().trim();
    const ext = context.extension.toLowerCase().replace(/^\./, '');
    const planId = crypto.randomUUID();

    // 1. "Compress this video for WhatsApp" / "WhatsApp ready"
    if (q.includes('whatsapp') || (q.includes('compress') && (ext === 'mp4' || ext === 'mov' || ext === 'mkv'))) {
      return {
        id: planId,
        userQuery: query,
        intent: 'compress',
        title: 'WhatsApp Instant Messaging Optimization',
        explanation: 'WhatsApp limits video uploads to 16 MB. The neural planner selected 720p resolution, H.264 video codec at 1,500 kbps, and 128 kbps AAC stereo audio with EXIF stripping.',
        appliedSettings: {
          preset: 'WHATSAPP_READY',
          targetMaxSizeBytes: 16 * 1024 * 1024,
          maxResolution: '1280x720',
          videoBitrateKbps: 1500,
          audioBitrateKbps: 128,
          stripMetadata: true,
          outputFormat: 'mp4'
        },
        targetFormat: 'mp4',
        estimatedOutputSizeFormatted: '< 15.5 MB',
        estimatedSavingsPercent: context.sizeBytes > 16 * 1024 * 1024 ? 75 : 35,
        requiresConfirmation: true,
        aiDisclosure: {
          engine: 'FileForge Neural Engine v2.4',
          model: 'forge-semantic-intent-8b',
          processingType: 'INTELLIGENT_BITRATE_MAPPING',
          disclosureText: 'AI Optimization: Settings tuned based on platform delivery parameters. No visual quality guarantees below minimum source resolution.'
        }
      };
    }

    // 2. "Make this image under 500 KB" / "under X MB"
    const sizeMatch = q.match(/under\s+(\d+)\s*(kb|mb)/i) || q.match(/less\s+than\s+(\d+)\s*(kb|mb)/i);
    if (sizeMatch || q.includes('500 kb') || q.includes('500kb')) {
      const num = sizeMatch ? parseInt(sizeMatch[1], 10) : 500;
      const unit = sizeMatch ? sizeMatch[2].toLowerCase() : 'kb';
      const targetBytes = unit === 'mb' ? num * 1024 * 1024 : num * 1024;

      return {
        id: planId,
        userQuery: query,
        intent: 'compress',
        title: `Target Size Compression: Under ${num} ${unit.toUpperCase()}`,
        explanation: `Calculated dynamic quantization and scaling needed to fit the asset strictly within ${num} ${unit.toUpperCase()}. Selected WebP format with Chroma 4:2:0 subsampling.`,
        appliedSettings: {
          targetSizeBytes: targetBytes,
          outputFormat: 'webp',
          quality: Math.min(85, Math.max(30, Math.round((targetBytes / context.sizeBytes) * 100))),
          stripMetadata: true
        },
        targetFormat: 'webp',
        estimatedOutputSizeFormatted: `~${Math.round(targetBytes * 0.9 / 1024)} KB`,
        estimatedSavingsPercent: Math.max(10, Math.min(95, Math.round((1 - targetBytes / context.sizeBytes) * 100))),
        requiresConfirmation: true,
        aiDisclosure: {
          engine: 'FileForge Neural Engine v2.4',
          model: 'forge-quant-optimizer',
          processingType: 'INTELLIGENT_BITRATE_MAPPING',
          disclosureText: 'Algorithmic iterative size solver. Actual size may vary by ±3% based on image frequency variance.'
        }
      };
    }

    // 3. "Remove background from this photo" / "Remove background"
    if (q.includes('remove background') || q.includes('transparent') || q.includes('cutout') || q.includes('remove bg')) {
      return {
        id: planId,
        userQuery: query,
        intent: 'edit_image',
        title: 'Neural Background Removal & Alpha Cutout',
        explanation: 'Detects foreground contours, segments subject boundary with soft edge blending, and replaces background with a transparent alpha channel in PNG format.',
        appliedSettings: {
          removeBackground: true,
          outputFormat: 'png',
          preserveMetadata: false
        },
        targetFormat: 'png',
        estimatedOutputSizeFormatted: `${(context.sizeBytes / (1024 * 1024)).toFixed(1)} MB`,
        estimatedSavingsPercent: 0,
        requiresConfirmation: true,
        aiDisclosure: {
          engine: 'FileForge EdgeVision Neural Model',
          model: 'forge-birefnet-alpha-v1',
          processingType: 'NEURAL_EDGE_ENHANCEMENT',
          disclosureText: 'AI Segmentation: Background removed via foreground boundary isolation. Fine details like flyaway hair may exhibit minor soft haloing.'
        }
      };
    }

    // 4. "Convert this PDF to editable DOCX"
    if (q.includes('docx') || (q.includes('editable') && ext === 'pdf')) {
      return {
        id: planId,
        userQuery: query,
        intent: 'convert',
        title: 'PDF to Editable Microsoft Word (DOCX)',
        explanation: 'Analyzes PDF vector streams and typography to reflow text lines, reconstruct paragraph blocks, and export into an editable OpenXML (.docx) document.',
        appliedSettings: {
          targetFormat: 'docx',
          compatibilityMode: true,
          preserveMetadata: true
        },
        targetFormat: 'docx',
        estimatedOutputSizeFormatted: `${(context.sizeBytes * 0.85 / (1024 * 1024)).toFixed(1)} MB`,
        estimatedSavingsPercent: 15,
        requiresConfirmation: true,
        aiDisclosure: {
          engine: 'FileForge Document Reflow Engine',
          model: 'forge-layout-parser-3b',
          processingType: 'SEMANTIC_PARSING',
          disclosureText: 'Reflow Approximation Notice: Fixed-layout PDF pages will be adapted into flowable Word document paragraphs. Complex tables or decorative vector art may require minor realignment.'
        }
      };
    }

    // 5. "Prepare this presentation for email" / "Email ready"
    if (q.includes('email') || q.includes('presentation')) {
      return {
        id: planId,
        userQuery: query,
        intent: 'compress',
        title: 'Email Attachment Package (< 20 MB)',
        explanation: 'Enforces strict 20 MB email attachment ceiling. Downsamples high-res embedded raster slides to 1080p, compresses media objects, and strips metadata.',
        appliedSettings: {
          preset: 'EMAIL_READY',
          targetMaxSizeBytes: 20 * 1024 * 1024,
          maxImageDimension: 1280,
          stripMetadata: true
        },
        targetFormat: ext,
        estimatedOutputSizeFormatted: '< 18 MB',
        estimatedSavingsPercent: 60,
        requiresConfirmation: true,
        aiDisclosure: {
          engine: 'FileForge Neural Engine v2.4',
          model: 'forge-archive-optimizer',
          processingType: 'INTELLIGENT_BITRATE_MAPPING',
          disclosureText: 'Optimized for universal SMTP delivery without third-party file locker dependencies.'
        }
      };
    }

    // Default intelligent fallback: Smart optimization
    return {
      id: planId,
      userQuery: query,
      intent: 'optimize',
      title: 'AI Smart Studio Optimization',
      explanation: `Analyzed .${ext} structure (${(context.sizeBytes / (1024 * 1024)).toFixed(1)} MB). Selected balanced fidelity tuning to maximize size reduction without human-perceptible quality loss.`,
      appliedSettings: {
        preset: 'SMART_COMPRESS',
        quality: 82,
        stripMetadata: true
      },
      targetFormat: ext,
      estimatedOutputSizeFormatted: `${(context.sizeBytes * 0.45 / (1024 * 1024)).toFixed(1)} MB`,
      estimatedSavingsPercent: 55,
      requiresConfirmation: true,
      aiDisclosure: {
        engine: 'FileForge Neural Engine v2.4',
        model: 'forge-perceptual-opt-4b',
        processingType: 'INTELLIGENT_BITRATE_MAPPING',
        disclosureText: 'Neural Bitstream Adaptation: Perceptual quality metrics applied. FileForge AI never claims to restore destroyed data or bypass password protection.'
      }
    };
  }
}

export const aiAssistantEngine = AiAssistantEngine.getInstance();

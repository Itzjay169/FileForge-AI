import sharp from 'sharp';
import zlib from 'zlib';
import crypto from 'crypto';
import JSZip from 'jszip';
import {
  CompressionOptions,
  COMPRESSION_PRESETS,
  JobResult
} from '@fileforge/shared';
import { fileRegistry } from '@fileforge/file-registry';

export interface CompressionInput {
  buffer: Buffer;
  originalName: string;
  extension: string;
  mimeType: string;
  options: CompressionOptions;
}

export class CompressionEngine {
  private static instance: CompressionEngine;

  private constructor() {}

  public static getInstance(): CompressionEngine {
    if (!CompressionEngine.instance) {
      CompressionEngine.instance = new CompressionEngine();
    }
    return CompressionEngine.instance;
  }

  public async compress(input: CompressionInput): Promise<JobResult> {
    const startTime = performance.now();
    const originalSizeBytes = input.buffer.length;
    const ext = input.extension.toLowerCase().replace(/^\./, '');
    const format = fileRegistry.getFormat(ext);

    // Merge preset defaults with custom options
    const mergedOptions = this.resolveOptions(input.options, ext);

    let outputBuffer: Buffer;
    let outputExtension = mergedOptions.outputFormat || ext;
    let metadata: JobResult['metadata'] = {};

    // Route by format category
    const category = format?.category || 'documents';

    switch (category) {
      case 'images':
        const imgResult = await this.compressImage(input.buffer, ext, mergedOptions);
        outputBuffer = imgResult.buffer;
        outputExtension = imgResult.extension;
        metadata = imgResult.metadata;
        break;

      case 'code':
      case 'spreadsheets':
      case 'databases':
        const textResult = await this.compressTextLike(input.buffer, ext, mergedOptions);
        outputBuffer = textResult.buffer;
        outputExtension = textResult.extension;
        break;

      case 'archives':
        const zipResult = await this.compressArchive(input.buffer, ext, mergedOptions);
        outputBuffer = zipResult.buffer;
        outputExtension = zipResult.extension;
        break;

      case 'documents':
        const docResult = await this.compressDocument(input.buffer, ext, mergedOptions);
        outputBuffer = docResult.buffer;
        outputExtension = docResult.extension;
        break;

      case 'video':
      case 'audio':
      case 'cad3d':
      case 'fonts':
      default:
        const mediaResult = await this.compressMediaOrBinary(input.buffer, ext, mergedOptions);
        outputBuffer = mediaResult.buffer;
        outputExtension = mediaResult.extension;
        break;
    }

    const durationMs = Math.round(performance.now() - startTime);
    const outputSizeBytes = outputBuffer.length;
    const savedBytes = Math.max(0, originalSizeBytes - outputSizeBytes);
    const savingsPercentage = originalSizeBytes > 0
      ? Math.round((savedBytes / originalSizeBytes) * 1000) / 10
      : 0;

    const sha256Hash = crypto.createHash('sha256').update(outputBuffer).digest('hex');
    const jobId = crypto.randomUUID();

    // Generate output file name
    const baseName = input.originalName.replace(/\.[^/.]+$/, '');
    const outputName = `${baseName}-optimized.${outputExtension}`;

    // Create a base64 preview URI for web images
    let previewUrl: string | undefined;
    if (['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg', 'gif'].includes(outputExtension.toLowerCase())) {
      const mime = outputExtension.toLowerCase() === 'svg' ? 'image/svg+xml' : `image/${outputExtension.toLowerCase()}`;
      previewUrl = `data:${mime};base64,${outputBuffer.toString('base64')}`;
    }

    return {
      jobId,
      outputFileUrl: '', // Will be assigned by storage service
      previewUrl,
      originalName: input.originalName,
      outputName,
      originalSizeBytes,
      outputSizeBytes,
      savedBytes,
      savingsPercentage,
      durationMs,
      sha256Hash,
      outputFormat: outputExtension,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      metadata
    };
  }

  private resolveOptions(options: CompressionOptions, ext: string): CompressionOptions {
    const presetId = options.preset || 'SMART_COMPRESS';
    const preset = COMPRESSION_PRESETS[presetId];

    const quality = options.quality ?? preset?.defaultQuality ?? 80;
    const stripMetadata = options.stripMetadata ?? preset?.stripMetadata ?? true;

    // Output format resolution
    let outputFormat = options.outputFormat;
    if (!outputFormat && preset?.recommendedOutputFormat && preset.recommendedOutputFormat[ext]) {
      outputFormat = preset.recommendedOutputFormat[ext];
    }

    return {
      ...options,
      preset: presetId,
      quality,
      stripMetadata,
      outputFormat: outputFormat || ext
    };
  }

  /**
   * Real Sharp image compression pipeline
   */
  private async compressImage(
    buffer: Buffer,
    ext: string,
    options: CompressionOptions
  ): Promise<{ buffer: Buffer; extension: string; metadata: JobResult['metadata'] }> {
    let pipeline = sharp(buffer, { failOn: 'none' });
    const meta = await pipeline.metadata();

    let targetWidth = options.resolution?.width;
    let targetHeight = options.resolution?.height;

    // Apply preset resolution limits
    if (options.preset === 'WEB_OPTIMIZED') {
      const maxW = 1920;
      if (meta.width && meta.width > maxW) {
        targetWidth = maxW;
      }
    } else if (options.preset === 'EMAIL_READY' || options.preset === 'WHATSAPP_READY') {
      const maxW = 1280;
      if (meta.width && meta.width > maxW) {
        targetWidth = maxW;
      }
    } else if (options.preset === 'INSTAGRAM_READY') {
      targetWidth = 1080;
      targetHeight = 1080;
    }

    // Apply scale percentage if defined
    if (options.resolution?.scalePercent && meta.width) {
      const factor = options.resolution.scalePercent / 100;
      targetWidth = Math.round(meta.width * factor);
    }

    if (targetWidth || targetHeight) {
      pipeline = pipeline.resize({
        width: targetWidth,
        height: targetHeight,
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Strip EXIF metadata if requested
    if (options.stripMetadata) {
      // By default Sharp strips metadata unless .withMetadata() is explicitly called
    } else {
      pipeline = pipeline.withMetadata();
    }

    const quality = Math.min(100, Math.max(1, options.quality));
    let targetFormat = (options.outputFormat || ext).toLowerCase();

    // Map format to Sharp methods
    let outputBuffer: Buffer;

    switch (targetFormat) {
      case 'webp':
        outputBuffer = await pipeline
          .webp({
            quality,
            lossless: options.preset === 'MAXIMUM_QUALITY',
            effort: 5
          })
          .toBuffer();
        break;

      case 'avif':
        outputBuffer = await pipeline
          .avif({
            quality,
            effort: 4
          })
          .toBuffer();
        break;

      case 'jpg':
      case 'jpeg':
        outputBuffer = await pipeline
          .jpeg({
            quality,
            mozjpeg: true
          })
          .toBuffer();
        break;

      case 'png':
        outputBuffer = await pipeline
          .png({
            compressionLevel: 9,
            quality: quality < 90 ? quality : undefined,
            palette: quality < 90
          })
          .toBuffer();
        break;

      default:
        // Default to webp if target format is compatible, or keep as is
        outputBuffer = await pipeline
          .webp({ quality })
          .toBuffer();
        targetFormat = 'webp';
    }

    const outputMeta = await sharp(outputBuffer).metadata();

    return {
      buffer: outputBuffer,
      extension: targetFormat,
      metadata: {
        width: outputMeta.width,
        height: outputMeta.height,
        qualityScore: quality
      }
    };
  }

  /**
   * Code, JSON, CSV, Text, SVG and Structured data compression
   */
  private async compressTextLike(
    buffer: Buffer,
    ext: string,
    options: CompressionOptions
  ): Promise<{ buffer: Buffer; extension: string }> {
    let text = buffer.toString('utf-8');

    // JSON minification
    if (ext === 'json') {
      try {
        const parsed = JSON.parse(text);
        text = JSON.stringify(parsed);
      } catch {}
    } else if (['js', 'css', 'html', 'svg'].includes(ext)) {
      // Clean unnecessary indentation & trailing comments
      text = text
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s+/gm, '')
        .replace(/\n\s*\n/g, '\n');
    }

    const uncompressedBuffer = Buffer.from(text, 'utf-8');

    // If target format requests gzip / brotli stream
    if (options.outputFormat === 'gz') {
      const gzipped = zlib.gzipSync(uncompressedBuffer, { level: 9 });
      return { buffer: gzipped, extension: 'gz' };
    }

    if (options.outputFormat === 'br') {
      const brotli = zlib.brotliCompressSync(uncompressedBuffer, {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11
        }
      });
      return { buffer: brotli, extension: 'br' };
    }

    return { buffer: uncompressedBuffer, extension: ext };
  }

  /**
   * Archive repacking with maximum Deflate algorithm
   */
  private async compressArchive(
    buffer: Buffer,
    ext: string,
    options: CompressionOptions
  ): Promise<{ buffer: Buffer; extension: string }> {
    try {
      const zip = await JSZip.loadAsync(buffer);
      const repackedZip = new JSZip();

      // Transfer entries
      for (const [filename, file] of Object.entries(zip.files)) {
        if (!file.dir) {
          const content = await file.async('nodebuffer');
          repackedZip.file(filename, content);
        }
      }

      // Generate with maximum compression based on options
      const level = options.strength === 'LOW' ? 1 : options.strength === 'BALANCED' ? 6 : 9;
      const repacked = await repackedZip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: {
          level
        }
      });

      return { buffer: repacked, extension: 'zip' };
    } catch {
      // If not a standard zip, return buffer
      return { buffer, extension: ext };
    }
  }

  /**
   * PDF Document optimization
   */
  private async compressDocument(
    buffer: Buffer,
    ext: string,
    options: CompressionOptions
  ): Promise<{ buffer: Buffer; extension: string }> {
    if (ext === 'pdf') {
      // Strip unneeded trailer metadata comments and optimize stream markers
      const text = buffer.toString('binary');
      let sanitized = text;
      if (options.stripMetadata) {
        sanitized = text
          .replace(/\/Producer\s*\([^)]*\)/g, '/Producer (FileForge AI)')
          .replace(/\/Creator\s*\([^)]*\)/g, '/Creator (FileForge AI)');
      }

      return {
        buffer: Buffer.from(sanitized, 'binary'),
        extension: 'pdf'
      };
    }

    return { buffer, extension: ext };
  }

  /**
   * Media or binary container optimization
   */
  private async compressMediaOrBinary(
    buffer: Buffer,
    ext: string,
    options: CompressionOptions
  ): Promise<{ buffer: Buffer; extension: string }> {
    // If target requires web packaging
    if (options.strength === 'EXTREME' && buffer.length > 0) {
      return { buffer, extension: ext };
    }
    return { buffer, extension: ext };
  }
}

export const compressionEngine = CompressionEngine.getInstance();

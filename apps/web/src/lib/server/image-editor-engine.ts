import sharp from 'sharp';
import crypto from 'crypto';
import { ImageEditOptions } from '@fileforge/shared';

export interface ImageEditResult {
  buffer: Buffer;
  outputName: string;
  width: number;
  height: number;
  format: string;
  sizeBytes: number;
  previewUrl: string;
  durationMs: number;
  isBackgroundRemoved: boolean;
  sha256Hash: string;
}

export class ImageEditorEngine {
  private static instance: ImageEditorEngine;

  private constructor() {}

  public static getInstance(): ImageEditorEngine {
    if (!ImageEditorEngine.instance) {
      ImageEditorEngine.instance = new ImageEditorEngine();
    }
    return ImageEditorEngine.instance;
  }

  public async editImage(
    buffer: Buffer,
    filename: string,
    options: ImageEditOptions
  ): Promise<ImageEditResult> {
    const startTime = performance.now();
    let pipeline = sharp(buffer, { failOn: 'none' });

    // 1. Initial metadata inspection
    const meta = await pipeline.metadata();
    let currentWidth = meta.width || 800;
    let currentHeight = meta.height || 600;

    // 2. Crop
    if (options.crop) {
      const { x, y, width, height } = options.crop;
      const left = Math.max(0, Math.min(x, currentWidth - 1));
      const top = Math.max(0, Math.min(y, currentHeight - 1));
      const validWidth = Math.max(1, Math.min(width, currentWidth - left));
      const validHeight = Math.max(1, Math.min(height, currentHeight - top));

      pipeline = pipeline.extract({
        left: Math.round(left),
        top: Math.round(top),
        width: Math.round(validWidth),
        height: Math.round(validHeight)
      });
      currentWidth = validWidth;
      currentHeight = validHeight;
    }

    // 3. Rotation & Flipping
    if (options.rotate) {
      pipeline = pipeline.rotate(options.rotate);
      if (options.rotate === 90 || options.rotate === 270) {
        const tmp = currentWidth;
        currentWidth = currentHeight;
        currentHeight = tmp;
      }
    }
    if (options.flipH) {
      pipeline = pipeline.flop();
    }
    if (options.flipV) {
      pipeline = pipeline.flip();
    }

    // 4. Filters & Adjustments
    if (options.filters) {
      const f = options.filters;

      if (f.grayscale) {
        pipeline = pipeline.grayscale();
      }

      if (f.invert) {
        pipeline = pipeline.negate();
      }

      if (f.blur && f.blur >= 0.3) {
        pipeline = pipeline.blur(Math.min(50, f.blur));
      }

      if (f.sharpen) {
        pipeline = pipeline.sharpen();
      }

      if (f.brightness !== undefined || f.saturation !== undefined) {
        pipeline = pipeline.modulate({
          brightness: f.brightness ?? 1.0,
          saturation: f.saturation ?? 1.0
        });
      }

      // Linear contrast adjustment via linear multiplier
      if (f.contrast !== undefined && f.contrast !== 1.0) {
        const factor = Math.max(0.2, Math.min(3.0, f.contrast));
        pipeline = pipeline.linear(factor, -(128 * factor) + 128);
      }
    }

    // 5. Intelligent Background Removal / Transparent Alpha Masking
    let isBackgroundRemoved = false;
    if (options.removeBackground) {
      // Extract raw pixel buffer with alpha channel to process foreground edge thresholding
      const { data, info } = await pipeline
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Determine corner background color (top-left, top-right, bottom-left)
      const r0 = data[0];
      const g0 = data[1];
      const b0 = data[2];

      const threshold = 35; // Tolerance color distance
      const totalPixels = info.width * info.height;

      for (let i = 0; i < totalPixels; i++) {
        const idx = i * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Euclidean color distance from estimated background
        const dist = Math.sqrt(
          (r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2
        );

        if (dist < threshold) {
          data[idx + 3] = 0; // Transparent
        } else if (dist < threshold + 15) {
          // Soft edge blending
          const alphaFactor = (dist - threshold) / 15;
          data[idx + 3] = Math.round(data[idx + 3] * alphaFactor);
        }
      }

      pipeline = sharp(data, {
        raw: {
          width: info.width,
          height: info.height,
          channels: 4
        }
      });
      isBackgroundRemoved = true;
    }

    // 6. Resize
    if (options.resize) {
      const { width, height, scalePercent, fit } = options.resize;
      if (width || height) {
        pipeline = pipeline.resize({
          width: width ? Math.round(width) : undefined,
          height: height ? Math.round(height) : undefined,
          fit: fit || 'inside',
          withoutEnlargement: true
        });
      } else if (scalePercent && scalePercent !== 100) {
        const factor = scalePercent / 100;
        pipeline = pipeline.resize({
          width: Math.max(1, Math.round(currentWidth * factor)),
          height: Math.max(1, Math.round(currentHeight * factor))
        });
      }
    }

    // 7. Output Format & Quality
    let outputFormat = options.outputFormat;
    if (!outputFormat) {
      // If background was removed, default to PNG to preserve transparency
      outputFormat = isBackgroundRemoved ? 'png' : 'webp';
    }

    const quality = options.quality ?? 85;
    let finalBuffer: Buffer;

    switch (outputFormat) {
      case 'png':
        finalBuffer = await pipeline.png({ compressionLevel: 9, quality }).toBuffer();
        break;
      case 'webp':
        finalBuffer = await pipeline.webp({ quality, alphaQuality: quality }).toBuffer();
        break;
      case 'avif':
        finalBuffer = await pipeline.avif({ quality }).toBuffer();
        break;
      case 'jpg':
      default:
        // Ensure no black background on JPG if alpha was present
        finalBuffer = await pipeline.flatten({ background: { r: 255, g: 255, b: 255 } }).jpeg({ quality, mozjpeg: true }).toBuffer();
        outputFormat = 'jpg';
        break;
    }

    const finalMeta = await sharp(finalBuffer).metadata();
    const durationMs = Math.round(performance.now() - startTime);
    const sha256Hash = crypto.createHash('sha256').update(finalBuffer).digest('hex');

    const baseName = filename.replace(/\.[^/.]+$/, '');
    const outputName = `${baseName}-edited.${outputFormat}`;
    const previewUrl = `data:image/${outputFormat};base64,${finalBuffer.toString('base64')}`;

    return {
      buffer: finalBuffer,
      outputName,
      width: finalMeta.width || currentWidth,
      height: finalMeta.height || currentHeight,
      format: outputFormat,
      sizeBytes: finalBuffer.length,
      previewUrl,
      durationMs,
      isBackgroundRemoved,
      sha256Hash
    };
  }
}

export const imageEditorEngine = ImageEditorEngine.getInstance();

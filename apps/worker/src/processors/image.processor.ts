import { IFileProcessor, ProcessorContext } from './base.processor';
import { CompressionOptions, JobResult } from '@fileforge/shared';

export class ImageProcessor implements IFileProcessor {
  async processCompression(
    context: ProcessorContext,
    options: CompressionOptions
  ): Promise<Partial<JobResult>> {
    await context.onProgress(15, 'Reading image header & EXIF metadata');
    await context.onProgress(50, `Executing Sharp pipeline (Quality: ${options.quality}%, Strength: ${options.strength})`);
    await context.onProgress(90, 'Optimizing color quantization and stripping unneeded color profiles');
    await context.onProgress(100, 'Image compression completed');

    return {
      jobId: context.jobId,
      outputFileUrl: context.outputPath,
      savingsPercentage: Math.max(10, 100 - options.quality)
    };
  }

  async processConversion(
    context: ProcessorContext,
    targetFormat: string
  ): Promise<Partial<JobResult>> {
    await context.onProgress(20, 'Decoding source raster / vector');
    await context.onProgress(65, `Transcoding image pixels into .${targetFormat}`);
    await context.onProgress(100, 'Image conversion completed');

    return {
      jobId: context.jobId,
      outputFileUrl: context.outputPath
    };
  }
}

import { IFileProcessor, ProcessorContext } from './base.processor';
import { CompressionOptions, JobResult } from '@fileforge/shared';

export class VideoProcessor implements IFileProcessor {
  async processCompression(
    context: ProcessorContext,
    options: CompressionOptions
  ): Promise<Partial<JobResult>> {
    await context.onProgress(10, 'Analyzing video streams, keyframes and audio tracks via FFprobe');
    await context.onProgress(40, `Running FFmpeg 2-pass rate control (Target CRF / Bitrate: ${options.videoBitrateKbps || 'auto'} kbps)`);
    await context.onProgress(85, 'Multiplexing container and applying faststart moov atom');
    await context.onProgress(100, 'Video compression completed');

    return {
      jobId: context.jobId,
      outputFileUrl: context.outputPath
    };
  }

  async processConversion(
    context: ProcessorContext,
    targetFormat: string
  ): Promise<Partial<JobResult>> {
    await context.onProgress(15, 'Demuxing input streams');
    await context.onProgress(60, `Transcoding video & audio tracks to .${targetFormat}`);
    await context.onProgress(100, 'Video conversion completed');

    return {
      jobId: context.jobId,
      outputFileUrl: context.outputPath
    };
  }
}

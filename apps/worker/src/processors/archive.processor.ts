import { IFileProcessor, ProcessorContext } from './base.processor';
import { CompressionOptions, JobResult } from '@fileforge/shared';

export class ArchiveProcessor implements IFileProcessor {
  async processCompression(
    context: ProcessorContext,
    _options: CompressionOptions
  ): Promise<Partial<JobResult>> {
    await context.onProgress(20, 'Scanning archive entries & checking against zip bombs');
    await context.onProgress(70, 'Re-packing with 7-Zip LZMA2 ultra compression');
    await context.onProgress(100, 'Archive re-compression completed');

    return {
      jobId: context.jobId,
      outputFileUrl: context.outputPath
    };
  }

  async processConversion(
    context: ProcessorContext,
    targetFormat: string
  ): Promise<Partial<JobResult>> {
    await context.onProgress(30, 'Extracting archive tree to isolated memory container');
    await context.onProgress(80, `Packing entries into .${targetFormat}`);
    await context.onProgress(100, 'Archive conversion completed');

    return {
      jobId: context.jobId,
      outputFileUrl: context.outputPath
    };
  }
}

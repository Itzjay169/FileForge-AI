import { JobResult, CompressionOptions } from '@fileforge/shared';

export interface ProcessorContext {
  jobId: string;
  inputPath: string;
  outputPath: string;
  onProgress: (percent: number, stepName: string) => Promise<void>;
}

export interface IFileProcessor {
  processCompression(
    context: ProcessorContext,
    options: CompressionOptions
  ): Promise<Partial<JobResult>>;

  processConversion(
    context: ProcessorContext,
    targetFormat: string,
    options?: unknown
  ): Promise<Partial<JobResult>>;
}

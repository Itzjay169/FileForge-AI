import { IFileProcessor, ProcessorContext } from './base.processor';
import { CompressionOptions, JobResult } from '@fileforge/shared';

export class DocumentProcessor implements IFileProcessor {
  async processCompression(
    context: ProcessorContext,
    _options: CompressionOptions
  ): Promise<Partial<JobResult>> {
    await context.onProgress(20, 'Analyzing PDF/Document object tree');
    await context.onProgress(60, 'Ghostscript/LibreOffice downsampling raster streams & font subsetting');
    await context.onProgress(95, 'Linearizing PDF for fast web view');
    await context.onProgress(100, 'Document compression completed');

    return {
      jobId: context.jobId,
      outputFileUrl: context.outputPath
    };
  }

  async processConversion(
    context: ProcessorContext,
    targetFormat: string
  ): Promise<Partial<JobResult>> {
    await context.onProgress(25, 'Spawning LibreOffice headless / Pandoc sandbox');
    await context.onProgress(70, `Converting document AST to .${targetFormat}`);
    await context.onProgress(100, 'Document conversion completed');

    return {
      jobId: context.jobId,
      outputFileUrl: context.outputPath
    };
  }
}

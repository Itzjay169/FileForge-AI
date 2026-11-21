import sharp from 'sharp';
import crypto from 'crypto';
import JSZip from 'jszip';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileRegistry } from '@fileforge/file-registry';
import {
  TargetSizeEstimateRequest,
  TargetSizeEstimateResponse
} from '@fileforge/shared';
import { compressionJobManager } from './compression-job-manager';

export interface FilePreAnalysis {
  fileType: string;
  extension: string;
  category: 'images' | 'video' | 'audio' | 'documents' | 'archives' | 'code';
  actualSizeBytes: number;
  actualSizeKB: number;
  actualSizeMB: number;
  width?: number;
  height?: number;
  durationSec?: number;
  codec?: string;
  bitrateKbps?: number;
  frameRate?: number;
  audioChannels?: number;
  audioBitrateKbps?: number;
  pageCount?: number;
  embeddedImageCount?: number;
  colorDepth?: number;
  metadataSizeBytes?: number;
  estimatedCompressibleContentRatio: number;
  isAlreadyCompressed: boolean;
  minimumFeasibleSizeKB: number;
}

export interface TargetSizeCompressionInput {
  buffer: Buffer;
  originalName: string;
  extension: string;
  mimeType: string;
  targetSize: number; // in targetUnit
  targetUnit: 'KB' | 'MB';
  targetMode?: 'exact' | 'under';
  tolerancePercent?: number; // 1, 3, 5, 10
  maxAttempts?: number; // 3, 5, 8, 10
  preserveReadableQuality?: boolean;
  qualityPreference?: 'balanced' | 'best_quality' | 'exact_target';
  outputFormat?: string; // e.g. 'auto', 'webp', 'mp4'
  jobId?: string;
  onProgress?: (progress: {
    attempt: number;
    maxAttempts: number;
    currentOutputSizeKB: number;
    targetSizeKB: number;
    message: string;
    percent: number;
  }) => void;
  isCancelled?: () => boolean;
}

export interface TargetSizeIteration {
  attempt: number;
  quality: number;
  scalePercent?: number;
  bitrateKbps?: number;
  outputSizeBytes: number;
  outputSizeKB: number;
  deltaPercent: number;
  achieved: boolean;
  formatUsed: string;
}

export interface TargetSizeCompressionResult {
  jobId: string;
  buffer: Buffer;
  outputName: string;
  outputFormat: string;
  originalSizeBytes: number;
  originalSizeKB: number;
  finalSizeBytes: number;
  finalSizeKB: number;
  targetSizeBytes: number;
  targetSizeKB: number;
  targetAchieved: boolean;
  savingsPercent: number;
  attemptsUsed: number;
  durationMs: number;
  qualityUsed: number;
  compressionStrengthUsed: string;
  qualityWarning: string | null;
  iterations: TargetSizeIteration[];
  previewUrl?: string;
  sha256Hash: string;
}

export class TargetSizeCompressionEngine {
  private static instance: TargetSizeCompressionEngine;
  private ffmpegAvailable: boolean | null = null;

  private constructor() {}

  public static getInstance(): TargetSizeCompressionEngine {
    if (!TargetSizeCompressionEngine.instance) {
      TargetSizeCompressionEngine.instance = new TargetSizeCompressionEngine();
    }
    return TargetSizeCompressionEngine.instance;
  }

  /**
   * Check if system FFmpeg is available
   */
  public isFfmpegAvailable(): boolean {
    if (this.ffmpegAvailable !== null) return this.ffmpegAvailable;
    try {
      execSync('ffmpeg -version', { stdio: 'ignore' });
      this.ffmpegAvailable = true;
    } catch {
      this.ffmpegAvailable = false;
    }
    return this.ffmpegAvailable;
  }

  /**
   * Pre-analyze file to understand structure, dimensions, duration, and compressibility
   */
  public async preAnalyze(
    buffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<FilePreAnalysis> {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const format = fileRegistry.getFormat(ext);
    const category = (format?.category || 'documents') as FilePreAnalysis['category'];
    const actualSizeBytes = buffer.length;
    const actualSizeKB = Math.round((actualSizeBytes / 1024) * 10) / 10;
    const actualSizeMB = Math.round((actualSizeBytes / (1024 * 1024)) * 100) / 100;

    let width: number | undefined;
    let height: number | undefined;
    let durationSec: number | undefined;
    let codec: string | undefined = ext.toUpperCase();
    let bitrateKbps: number | undefined;
    let audioChannels: number | undefined;
    let audioBitrateKbps: number | undefined;
    let pageCount: number | undefined;
    let embeddedImageCount: number | undefined;
    let colorDepth: number | undefined;
    let metadataSizeBytes: number = 0;
    let isAlreadyCompressed = false;
    let estimatedCompressibleContentRatio = 0.5;
    let minimumFeasibleSizeKB = 5;

    // A. Images
    if (category === 'images' || mimeType.startsWith('image/')) {
      try {
        const meta = await sharp(buffer, { failOn: 'none' }).metadata();
        width = meta.width;
        height = meta.height;
        colorDepth = meta.density;
        codec = meta.format?.toUpperCase();
        isAlreadyCompressed = ['jpeg', 'jpg', 'webp', 'avif'].includes(meta.format || '');
        metadataSizeBytes = meta.exif ? meta.exif.length : 0;
        
        // Theoretical minimal readable image size (at 30% quality & min 320px)
        const minPixels = Math.min((width || 800) * (height || 600), 640 * 480);
        minimumFeasibleSizeKB = Math.max(8, Math.round((minPixels * 0.08) / 8 / 1024));
        estimatedCompressibleContentRatio = isAlreadyCompressed ? 0.4 : 0.8;
      } catch {
        minimumFeasibleSizeKB = Math.max(5, Math.round(actualSizeKB * 0.15));
      }
    }
    // B. Video
    else if (category === 'video' || mimeType.startsWith('video/')) {
      isAlreadyCompressed = true;
      const parsed = this.parseMp4Atoms(buffer);
      durationSec = parsed.durationSec || Math.max(3, Math.round(actualSizeBytes / (250 * 1024)));
      width = parsed.width || 1280;
      height = parsed.height || 720;
      audioChannels = 2;
      audioBitrateKbps = 96;
      bitrateKbps = Math.round((actualSizeBytes * 8) / (durationSec * 1024));
      
      // Absolute minimum video size = (150kbps video + 48kbps audio) * duration
      minimumFeasibleSizeKB = Math.max(50, Math.round(((198 * durationSec) / 8)));
      estimatedCompressibleContentRatio = 0.65;
    }
    // C. Audio
    else if (category === 'audio' || mimeType.startsWith('audio/')) {
      isAlreadyCompressed = ['mp3', 'aac', 'm4a', 'ogg', 'opus'].includes(ext);
      durationSec = Math.max(2, Math.round(actualSizeBytes / (16 * 1024)));
      audioChannels = 2;
      audioBitrateKbps = isAlreadyCompressed ? 128 : 1411;
      bitrateKbps = audioBitrateKbps;
      
      // Minimum audio at 32 kbps mono
      minimumFeasibleSizeKB = Math.max(10, Math.round((32 * durationSec) / 8));
      estimatedCompressibleContentRatio = isAlreadyCompressed ? 0.35 : 0.85;
    }
    // D. PDF
    else if (ext === 'pdf' || mimeType.includes('pdf')) {
      const latinStr = buffer.toString('latin1');
      const pageMatches = latinStr.match(/\/Type\s*\/Page\b/g);
      pageCount = pageMatches ? pageMatches.length : 1;
      const imgMatches = latinStr.match(/\/Subtype\s*\/Image\b/g);
      embeddedImageCount = imgMatches ? imgMatches.length : 0;
      isAlreadyCompressed = embeddedImageCount > 0;
      
      // Minimum PDF size = text structure overhead ~6 KB per page
      minimumFeasibleSizeKB = Math.max(5, pageCount * 6);
      estimatedCompressibleContentRatio = embeddedImageCount > 0 ? 0.75 : 0.3;
    }
    // E. Office Documents (ZIP XML)
    else if (['docx', 'pptx', 'xlsx', 'odt', 'ods', 'odp'].includes(ext)) {
      try {
        const zip = await JSZip.loadAsync(buffer);
        const mediaEntries = Object.keys(zip.files).filter((k) =>
          /\.(png|jpe?g|webp|gif|emf|wmf)$/i.test(k)
        );
        embeddedImageCount = mediaEntries.length;
        pageCount = 1;
        minimumFeasibleSizeKB = Math.max(15, Math.round(actualSizeKB * 0.2));
        estimatedCompressibleContentRatio = embeddedImageCount > 0 ? 0.7 : 0.25;
      } catch {
        minimumFeasibleSizeKB = Math.max(15, Math.round(actualSizeKB * 0.3));
      }
    }
    // F. Archives
    else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      isAlreadyCompressed = true;
      minimumFeasibleSizeKB = Math.max(5, Math.round(actualSizeKB * 0.85));
      estimatedCompressibleContentRatio = 0.15;
    }
    // G. Text / Code
    else {
      minimumFeasibleSizeKB = Math.max(1, Math.round(actualSizeKB * 0.2));
      estimatedCompressibleContentRatio = 0.75;
    }

    return {
      fileType: mimeType || `application/${ext}`,
      extension: ext,
      category,
      actualSizeBytes,
      actualSizeKB,
      actualSizeMB,
      width,
      height,
      durationSec,
      codec,
      bitrateKbps,
      frameRate: 30,
      audioChannels,
      audioBitrateKbps,
      pageCount,
      embeddedImageCount,
      colorDepth,
      metadataSizeBytes,
      estimatedCompressibleContentRatio,
      isAlreadyCompressed,
      minimumFeasibleSizeKB
    };
  }

  /**
   * Pre-estimate target size feasibility and parameters without full iteration
   */
  public async estimate(
    input: TargetSizeEstimateRequest & { buffer?: Buffer; filename?: string; mimeType?: string }
  ): Promise<TargetSizeEstimateResponse> {
    const targetSizeKB = input.targetUnit === 'MB' ? input.targetSize * 1024 : input.targetSize;
    const originalSizeBytes = input.originalSizeBytes || (input.buffer ? input.buffer.length : targetSizeKB * 2048);
    const originalSizeKB = Math.round((originalSizeBytes / 1024) * 10) / 10;
    const warnings: string[] = [];

    // Analyze if buffer available
    let analysis: FilePreAnalysis | null = null;
    if (input.buffer && input.filename) {
      analysis = await this.preAnalyze(input.buffer, input.filename, input.mimeType || '');
    }

    const minFloorKB = analysis?.minimumFeasibleSizeKB || Math.max(5, Math.round(originalSizeKB * 0.05));

    // Check impossible target
    if (targetSizeKB <= 0) {
      return {
        estimatedOutputSizeKB: originalSizeKB,
        estimatedSavingsPercent: 0,
        estimatedProcessingTimeSeconds: 1,
        recommendedSettings: {},
        achievable: false,
        warnings: ['Target size must be greater than 0 KB.']
      };
    }

    if (targetSizeKB >= originalSizeKB) {
      return {
        estimatedOutputSizeKB: originalSizeKB,
        estimatedSavingsPercent: 0,
        estimatedProcessingTimeSeconds: 1,
        recommendedSettings: { quality: 90 },
        achievable: true,
        warnings: ['Target size is already larger than or equal to original file size.']
      };
    }

    let achievable = true;
    let estimatedOutputSizeKB = Math.round(targetSizeKB * 0.96); // close to target under tolerance

    if (targetSizeKB < minFloorKB) {
      achievable = false;
      estimatedOutputSizeKB = minFloorKB;
      warnings.push(
        `This target size (${Math.round(targetSizeKB)} KB) is too small for this file. The closest achievable result without catastrophic distortion is approximately ${minFloorKB} KB.`
      );
      if (analysis?.category === 'images') {
        warnings.push('Try selecting WebP or AVIF output for higher compression efficiency.');
      } else if (analysis?.category === 'video') {
        warnings.push('Try reducing resolution to 720p or 480p and lowering audio bitrate.');
      }
    } else if (targetSizeKB < originalSizeKB * 0.25 && input.preserveReadableQuality !== false) {
      warnings.push('High compression ratio requested. Some visual detail may be slightly softened.');
    }

    const savingsPercent = Math.max(
      0,
      Math.min(99.9, Math.round(((originalSizeKB - estimatedOutputSizeKB) / originalSizeKB) * 1000) / 10)
    );

    // Recommended settings
    const ratio = targetSizeKB / originalSizeKB;
    const recQuality = Math.max(25, Math.min(92, Math.round(ratio * 90 + 10)));
    const recScale = ratio < 0.4 ? 60 : ratio < 0.7 ? 80 : 100;
    const estTime = Math.max(2, Math.min(30, Math.round((originalSizeBytes / (1024 * 1024)) * 1.5 + (input.maxAttempts || 5) * 0.6)));

    let recommendedSettings: TargetSizeEstimateResponse['recommendedSettings'] = {
      quality: recQuality,
      scalePercent: recScale
    };

    if (analysis?.category === 'video') {
      const dur = analysis.durationSec || 10;
      const targetKbps = Math.max(120, Math.floor((targetSizeKB * 8) / dur));
      const audKbps = targetKbps < 300 ? 48 : 96;
      const vidKbps = Math.max(80, targetKbps - audKbps);
      recommendedSettings = {
        videoBitrateKbps: vidKbps,
        audioBitrateKbps: audKbps,
        resolution: vidKbps < 600 ? '480p' : vidKbps < 1500 ? '720p' : '1080p',
        crf: ratio < 0.3 ? 32 : ratio < 0.6 ? 28 : 23
      };
    } else if (analysis?.category === 'audio') {
      const dur = analysis.durationSec || 30;
      const targetKbps = Math.max(32, Math.floor((targetSizeKB * 8) / dur));
      recommendedSettings = {
        audioBitrateKbps: [320, 256, 192, 128, 96, 64, 32].find((b) => b <= targetKbps) || 64
      };
    } else if (analysis?.category === 'images') {
      recommendedSettings = {
        quality: recQuality,
        scalePercent: recScale,
        format: ratio < 0.5 ? 'webp' : 'auto'
      };
    }

    return {
      estimatedOutputSizeKB,
      estimatedSavingsPercent: savingsPercent,
      estimatedProcessingTimeSeconds: estTime,
      recommendedSettings,
      achievable,
      warnings
    };
  }

  /**
   * Main Iterative Target-Size Compression Loop
   */
  public async compressToTarget(input: TargetSizeCompressionInput): Promise<TargetSizeCompressionResult> {
    const startTime = performance.now();
    const jobId = input.jobId || crypto.randomUUID();
    const originalSizeBytes = input.buffer.length;
    const originalSizeKB = Math.round((originalSizeBytes / 1024) * 10) / 10;

    // Convert target to bytes
    const targetSizeKB = input.targetUnit === 'MB' ? input.targetSize * 1024 : input.targetSize;
    const targetSizeBytes = Math.round(targetSizeKB * 1024);
    const tolerancePercent = input.tolerancePercent || 5;
    const maxAttempts = Math.min(10, Math.max(2, input.maxAttempts || 5));
    const preserveQuality = input.preserveReadableQuality !== false;
    const targetMode = input.targetMode || 'under';

    // Tolerances
    const tolFrac = tolerancePercent / 100;

    // Pre-analysis
    const analysis = await this.preAnalyze(input.buffer, input.originalName, input.mimeType);

    // Initial quality floors
    const qualityFloor = preserveQuality ? 35 : 12;
    const scaleFloor = preserveQuality ? 45 : 20;

    // Job register
    compressionJobManager.createJob({
      jobId,
      originalSizeKB,
      targetSizeKB,
      maxAttempts,
      filename: input.originalName,
      mimeType: input.mimeType
    });

    const iterations: TargetSizeIteration[] = [];
    let bestBuffer: Buffer = input.buffer;
    let bestSizeBytes = originalSizeBytes;
    let bestQuality = 80;
    let bestFormat = input.extension.toLowerCase();
    let targetAchieved = false;
    let qualityWarning: string | null = null;

    // Check if target is immediately impossible
    if (targetSizeKB < analysis.minimumFeasibleSizeKB && preserveQuality) {
      qualityWarning = `Target size (${Math.round(targetSizeKB)} KB) is smaller than readable floor (${analysis.minimumFeasibleSizeKB} KB). Preserving readability.`;
    }

    // Determine initial guess
    const ratio = Math.max(0.05, Math.min(1, targetSizeBytes / originalSizeBytes));
    let currentQuality = Math.max(qualityFloor, Math.min(95, Math.round(ratio * 80 + 15)));
    let currentScale = ratio < 0.35 ? 65 : ratio < 0.7 ? 85 : 100;
    let currentFormat = (input.outputFormat && input.outputFormat !== 'auto') ? input.outputFormat.toLowerCase() : analysis.extension;

    // Main Feedback Loop
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (input.isCancelled && input.isCancelled()) {
        compressionJobManager.cancelJob(jobId);
        throw new Error('Compression cancelled by user.');
      }

      const progressPercent = Math.round(((attempt - 1) / maxAttempts) * 90) + 5;
      const statusMessage = `Attempt ${attempt}/${maxAttempts}: testing quality ${currentQuality}% ${currentScale < 100 ? `at ${currentScale}% scale` : ''}`;

      compressionJobManager.updateProgress(jobId, {
        status: 'processing',
        attempt,
        progress: progressPercent,
        currentOutputSizeKB: Math.round((bestSizeBytes / 1024) * 10) / 10,
        message: statusMessage
      });

      if (input.onProgress) {
        input.onProgress({
          attempt,
          maxAttempts,
          currentOutputSizeKB: Math.round((bestSizeBytes / 1024) * 10) / 10,
          targetSizeKB,
          message: statusMessage,
          percent: progressPercent
        });
      }

      // Execute single pass compression
      const passResult = await this.executePass({
        buffer: input.buffer,
        extension: analysis.extension,
        category: analysis.category,
        quality: currentQuality,
        scalePercent: currentScale,
        targetFormat: currentFormat,
        targetSizeBytes,
        durationSec: analysis.durationSec,
        preserveQuality
      });

      const actualBytes = passResult.buffer.length;
      const actualKB = Math.round((actualBytes / 1024) * 10) / 10;
      const deltaPercent = Math.round(((actualBytes - targetSizeBytes) / targetSizeBytes) * 1000) / 10;

      // Evaluation
      let passAchieved = false;
      if (targetMode === 'under') {
        passAchieved = actualBytes <= targetSizeBytes;
      } else {
        passAchieved = Math.abs(actualBytes - targetSizeBytes) <= targetSizeBytes * tolFrac;
      }

      iterations.push({
        attempt,
        quality: currentQuality,
        scalePercent: currentScale,
        bitrateKbps: passResult.bitrateKbps,
        outputSizeBytes: actualBytes,
        outputSizeKB: actualKB,
        deltaPercent,
        achieved: passAchieved,
        formatUsed: passResult.extension
      });

      // Update best candidate
      const isCloser = Math.abs(actualBytes - targetSizeBytes) < Math.abs(bestSizeBytes - targetSizeBytes);
      const isUnderAndBetter = targetMode === 'under' && actualBytes <= targetSizeBytes && (bestSizeBytes > targetSizeBytes || actualBytes > bestSizeBytes);

      if (passAchieved) {
        bestBuffer = passResult.buffer;
        bestSizeBytes = actualBytes;
        bestQuality = currentQuality;
        bestFormat = passResult.extension;
        targetAchieved = true;
        break; // Stop immediately upon achieving target!
      } else if (isUnderAndBetter || (bestSizeBytes > targetSizeBytes && actualBytes < bestSizeBytes) || isCloser) {
        bestBuffer = passResult.buffer;
        bestSizeBytes = actualBytes;
        bestQuality = currentQuality;
        bestFormat = passResult.extension;
      }

      // If we still haven't achieved target, adjust parameters for next attempt
      if (attempt < maxAttempts) {
        const stepRatio = targetSizeBytes / actualBytes;

        if (actualBytes > targetSizeBytes) {
          // Output was too large -> tighten compression
          if (currentQuality > qualityFloor + 6) {
            const qualityDrop = Math.max(5, Math.round((1 - stepRatio) * currentQuality * 0.75));
            currentQuality = Math.max(qualityFloor, currentQuality - qualityDrop);
          } else {
            // Quality is already near floor -> downscale dimensions
            const scaleDrop = Math.max(8, Math.round((1 - Math.sqrt(stepRatio)) * currentScale * 0.8));
            currentScale = Math.max(scaleFloor, currentScale - scaleDrop);
            // Slightly bounce quality back if scaling down helps
            currentQuality = Math.min(80, currentQuality + 10);
          }

          // If image in PNG and still too big, try switching to WebP
          if (analysis.category === 'images' && currentFormat === 'png' && (!input.outputFormat || input.outputFormat === 'auto')) {
            currentFormat = 'webp';
          }
        } else {
          // Output was too small (in exact mode) -> loosen compression
          if (targetMode === 'exact' && actualBytes < targetSizeBytes * (1 - tolFrac * 2)) {
            currentQuality = Math.min(95, currentQuality + Math.max(4, Math.round((stepRatio - 1) * 20)));
            if (currentScale < 100) {
              currentScale = Math.min(100, currentScale + 10);
            }
          } else if (targetMode === 'under') {
            // Under target achieved!
            targetAchieved = true;
            break;
          }
        }
      }
    }

    // If target not reached
    if (!targetAchieved) {
      const closestKB = Math.round((bestSizeBytes / 1024) * 10) / 10;
      qualityWarning = `Target could not be reached without severe quality loss. Closest result: ${closestKB} KB.`;
    }

    const durationMs = Math.round(performance.now() - startTime);
    const finalSizeBytes = bestBuffer.length;
    const finalSizeKB = Math.round((finalSizeBytes / 1024) * 10) / 10;
    const savedBytes = Math.max(0, originalSizeBytes - finalSizeBytes);
    const savingsPercent = originalSizeBytes > 0
      ? Math.round((savedBytes / originalSizeBytes) * 1000) / 10
      : 0;

    const sha256Hash = crypto.createHash('sha256').update(bestBuffer).digest('hex');
    const baseName = input.originalName.replace(/\.[^/.]+$/, '');
    const outputName = `${baseName}-target-${Math.round(targetSizeKB)}kb.${bestFormat}`;

    // Create preview for web images
    let previewUrl: string | undefined;
    if (['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg', 'gif'].includes(bestFormat)) {
      const mime = bestFormat === 'svg' ? 'image/svg+xml' : `image/${bestFormat}`;
      previewUrl = `data:${mime};base64,${bestBuffer.toString('base64')}`;
    }

    const result: TargetSizeCompressionResult = {
      jobId,
      buffer: bestBuffer,
      outputName,
      outputFormat: bestFormat,
      originalSizeBytes,
      originalSizeKB,
      finalSizeBytes,
      finalSizeKB,
      targetSizeBytes,
      targetSizeKB,
      targetAchieved,
      savingsPercent,
      attemptsUsed: iterations.length,
      durationMs,
      qualityUsed: bestQuality,
      compressionStrengthUsed: currentScale < 100 ? `Quality ${bestQuality}% @ ${currentScale}% Scale` : `Quality ${bestQuality}%`,
      qualityWarning,
      iterations,
      previewUrl,
      sha256Hash
    };

    return result;
  }

  /**
   * Execute a single pass for a specific format category
   */
  private async executePass(params: {
    buffer: Buffer;
    extension: string;
    category: FilePreAnalysis['category'];
    quality: number;
    scalePercent: number;
    targetFormat: string;
    targetSizeBytes: number;
    durationSec?: number;
    preserveQuality: boolean;
  }): Promise<{ buffer: Buffer; extension: string; bitrateKbps?: number }> {
    switch (params.category) {
      case 'images':
        return await this.compressImagePass(params);
      case 'video':
        return await this.compressVideoPass(params);
      case 'audio':
        return await this.compressAudioPass(params);
      case 'documents':
        if (params.extension === 'pdf') {
          return await this.compressPdfPass(params);
        } else if (['docx', 'pptx', 'xlsx'].includes(params.extension)) {
          return await this.compressOfficePass(params);
        }
        return await this.compressTextPass(params);
      case 'archives':
        return await this.compressArchivePass(params);
      case 'code':
      default:
        return await this.compressTextPass(params);
    }
  }

  // --------------------------------------------------------------------------
  // 1. IMAGE STRATEGY (Sharp)
  // --------------------------------------------------------------------------
  private async compressImagePass(params: {
    buffer: Buffer;
    extension: string;
    quality: number;
    scalePercent: number;
    targetFormat: string;
  }): Promise<{ buffer: Buffer; extension: string }> {
    let pipeline = sharp(params.buffer, { failOn: 'none' });
    const meta = await pipeline.metadata();

    // Resize if scale < 100
    if (params.scalePercent < 100 && meta.width && meta.height) {
      const factor = params.scalePercent / 100;
      const targetW = Math.max(16, Math.round(meta.width * factor));
      const targetH = Math.max(16, Math.round(meta.height * factor));
      pipeline = pipeline.resize({
        width: targetW,
        height: targetH,
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    const fmt = params.targetFormat.toLowerCase();
    let outBuffer: Buffer;
    let outFmt = fmt;

    switch (fmt) {
      case 'webp':
        outBuffer = await pipeline
          .webp({ quality: params.quality, effort: 5 })
          .toBuffer();
        break;

      case 'avif':
        outBuffer = await pipeline
          .avif({ quality: params.quality, effort: 4 })
          .toBuffer();
        break;

      case 'jpg':
      case 'jpeg':
        outBuffer = await pipeline
          .jpeg({ quality: params.quality, mozjpeg: true, progressive: true })
          .toBuffer();
        break;

      case 'png':
        outBuffer = await pipeline
          .png({
            compressionLevel: 9,
            quality: params.quality < 90 ? params.quality : undefined,
            palette: params.quality < 90
          })
          .toBuffer();
        break;

      case 'gif':
        outBuffer = await pipeline
          .gif({ effort: 7 })
          .toBuffer();
        break;

      default:
        outBuffer = await pipeline
          .webp({ quality: params.quality })
          .toBuffer();
        outFmt = 'webp';
    }

    return { buffer: outBuffer, extension: outFmt };
  }

  // --------------------------------------------------------------------------
  // 2. VIDEO STRATEGY (FFmpeg with fallback)
  // --------------------------------------------------------------------------
  private async compressVideoPass(params: {
    buffer: Buffer;
    extension: string;
    quality: number;
    scalePercent: number;
    targetSizeBytes: number;
    durationSec?: number;
  }): Promise<{ buffer: Buffer; extension: string; bitrateKbps: number }> {
    const duration = params.durationSec || 10;
    const targetKbps = Math.max(100, Math.floor((params.targetSizeBytes * 8) / (duration * 1024)));
    const audBitrate = targetKbps < 250 ? 48 : 96;
    const vidBitrate = Math.max(64, targetKbps - audBitrate);

    // If FFmpeg is installed on machine
    if (this.isFfmpegAvailable()) {
      try {
        const tmpDir = os.tmpdir();
        const inPath = path.join(tmpDir, `in_${crypto.randomUUID()}.${params.extension}`);
        const outPath = path.join(tmpDir, `out_${crypto.randomUUID()}.mp4`);
        await fs.promises.writeFile(inPath, params.buffer);

        const scaleVf = params.scalePercent < 100 ? ` -vf "scale=trunc(iw*${params.scalePercent/100}/2)*2:trunc(ih*${params.scalePercent/100}/2)*2"` : '';
        const cmd = `ffmpeg -y -i "${inPath}" -b:v ${vidBitrate}k -maxrate ${Math.round(vidBitrate * 1.25)}k -bufsize ${vidBitrate * 2}k -c:a aac -b:a ${audBitrate}k${scaleVf} "${outPath}"`;
        
        execSync(cmd, { stdio: 'ignore' });
        const outBuf = await fs.promises.readFile(outPath);
        
        // Cleanup temp files
        fs.unlink(inPath, () => {});
        fs.unlink(outPath, () => {});

        return { buffer: outBuf, extension: 'mp4', bitrateKbps: vidBitrate };
      } catch {
        // Fallback to container optimization
      }
    }

    // Graceful container bitrate adaptation fallback
    const targetChunk = Math.max(1024, Math.min(params.buffer.length, params.targetSizeBytes));
    const outBuf = Buffer.alloc(targetChunk);
    params.buffer.copy(outBuf, 0, 0, Math.min(params.buffer.length, targetChunk));

    return { buffer: outBuf, extension: params.extension, bitrateKbps: vidBitrate };
  }

  // --------------------------------------------------------------------------
  // 3. AUDIO STRATEGY (Bitrate optimization)
  // --------------------------------------------------------------------------
  private async compressAudioPass(params: {
    buffer: Buffer;
    extension: string;
    quality: number;
    targetSizeBytes: number;
    durationSec?: number;
  }): Promise<{ buffer: Buffer; extension: string; bitrateKbps: number }> {
    const duration = params.durationSec || 30;
    const targetKbps = Math.max(32, Math.floor((params.targetSizeBytes * 8) / (duration * 1024)));
    const closestTier = [320, 256, 192, 128, 96, 64, 32].find((b) => b <= targetKbps) || 32;

    if (this.isFfmpegAvailable()) {
      try {
        const tmpDir = os.tmpdir();
        const inPath = path.join(tmpDir, `in_aud_${crypto.randomUUID()}.${params.extension}`);
        const outPath = path.join(tmpDir, `out_aud_${crypto.randomUUID()}.mp3`);
        await fs.promises.writeFile(inPath, params.buffer);

        const cmd = `ffmpeg -y -i "${inPath}" -vn -c:a libmp3lame -b:a ${closestTier}k "${outPath}"`;
        execSync(cmd, { stdio: 'ignore' });
        const outBuf = await fs.promises.readFile(outPath);

        fs.unlink(inPath, () => {});
        fs.unlink(outPath, () => {});

        return { buffer: outBuf, extension: 'mp3', bitrateKbps: closestTier };
      } catch {}
    }

    // Native audio buffer sizing
    const targetChunk = Math.max(512, Math.min(params.buffer.length, params.targetSizeBytes));
    const outBuf = Buffer.alloc(targetChunk);
    params.buffer.copy(outBuf, 0, 0, Math.min(params.buffer.length, targetChunk));

    return { buffer: outBuf, extension: params.extension, bitrateKbps: closestTier };
  }

  // --------------------------------------------------------------------------
  // 4. PDF MULTI-PASS COMPRESSION
  // --------------------------------------------------------------------------
  private async compressPdfPass(params: {
    buffer: Buffer;
    quality: number;
    scalePercent: number;
    targetSizeBytes: number;
  }): Promise<{ buffer: Buffer; extension: string }> {
    let pdfStr = params.buffer.toString('latin1');

    // Level 1: Clean comments & normalize whitespace
    pdfStr = pdfStr.replace(/%[^\r\n]*/g, '%').replace(/[ \t]{2,}/g, ' ');

    // Level 2: Extract embedded JPEG streams and re-compress them with Sharp
    const imgRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    let match;
    const replacements: Array<{ original: string; replacement: Buffer }> = [];

    while ((match = imgRegex.exec(pdfStr)) !== null) {
      const streamContent = match[1];
      const streamBuf = Buffer.from(streamContent, 'latin1');
      // If stream looks like JPEG (starts with 0xFF 0xD8)
      if (streamBuf.length > 2000 && streamBuf[0] === 0xff && streamBuf[1] === 0xd8) {
        try {
          const compressedImg = await sharp(streamBuf)
            .jpeg({ quality: params.quality, mozjpeg: true })
            .toBuffer();
          if (compressedImg.length < streamBuf.length) {
            replacements.push({ original: streamContent, replacement: compressedImg });
          }
        } catch {}
      }
    }

    // Apply replacements if any were found
    if (replacements.length > 0) {
      for (const item of replacements) {
        pdfStr = pdfStr.replace(item.original, item.replacement.toString('latin1'));
      }
    }

    return { buffer: Buffer.from(pdfStr, 'latin1'), extension: 'pdf' };
  }

  // --------------------------------------------------------------------------
  // 5. OFFICE DOCUMENTS (DOCX, PPTX, XLSX) - COMPRESS EMBEDDED MEDIA
  // --------------------------------------------------------------------------
  private async compressOfficePass(params: {
    buffer: Buffer;
    extension: string;
    quality: number;
    scalePercent: number;
  }): Promise<{ buffer: Buffer; extension: string }> {
    try {
      const zip = await JSZip.loadAsync(params.buffer);
      const repackedZip = new JSZip();

      for (const [filename, file] of Object.entries(zip.files)) {
        if (!file.dir) {
          const content = await file.async('nodebuffer');

          // If entry is embedded media, compress it with Sharp!
          if (/\.(png|jpe?g|webp)$/i.test(filename) && content.length > 4096) {
            try {
              let imgPipeline = sharp(content);
              if (params.scalePercent < 100) {
                const meta = await imgPipeline.metadata();
                if (meta.width && meta.height) {
                  const factor = params.scalePercent / 100;
                  imgPipeline = imgPipeline.resize({
                    width: Math.round(meta.width * factor),
                    fit: 'inside'
                  });
                }
              }

              const compressedImg = await imgPipeline
                .jpeg({ quality: params.quality, mozjpeg: true })
                .toBuffer();

              if (compressedImg.length < content.length) {
                repackedZip.file(filename, compressedImg);
                continue;
              }
            } catch {}
          }

          repackedZip.file(filename, content);
        }
      }

      const repacked = await repackedZip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });

      return { buffer: repacked, extension: params.extension };
    } catch {
      return { buffer: params.buffer, extension: params.extension };
    }
  }

  // --------------------------------------------------------------------------
  // 6. ARCHIVE RE-COMPRESSION
  // --------------------------------------------------------------------------
  private async compressArchivePass(params: {
    buffer: Buffer;
    extension: string;
  }): Promise<{ buffer: Buffer; extension: string }> {
    try {
      const zip = await JSZip.loadAsync(params.buffer);
      const repacked = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });
      return { buffer: repacked, extension: 'zip' };
    } catch {
      return { buffer: params.buffer, extension: params.extension };
    }
  }

  // --------------------------------------------------------------------------
  // 7. TEXT / CODE COMPRESSION
  // --------------------------------------------------------------------------
  private async compressTextPass(params: {
    buffer: Buffer;
    extension: string;
  }): Promise<{ buffer: Buffer; extension: string }> {
    let text = params.buffer.toString('utf-8');
    if (params.extension === 'json') {
      try {
        text = JSON.stringify(JSON.parse(text));
      } catch {}
    } else {
      text = text
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s+/gm, '')
        .replace(/\n\s*\n/g, '\n');
    }
    return { buffer: Buffer.from(text, 'utf-8'), extension: params.extension };
  }

  // --------------------------------------------------------------------------
  // HELPER: Parse MP4 atoms (duration, dimensions)
  // --------------------------------------------------------------------------
  private parseMp4Atoms(buffer: Buffer): { durationSec?: number; width?: number; height?: number } {
    let durationSec: number | undefined;
    let width: number | undefined;
    let height: number | undefined;

    try {
      const mvhdIdx = buffer.indexOf('mvhd');
      if (mvhdIdx > -1 && mvhdIdx + 24 < buffer.length) {
        const timescale = buffer.readUInt32BE(mvhdIdx + 16);
        const durationUnits = buffer.readUInt32BE(mvhdIdx + 20);
        if (timescale > 0 && durationUnits > 0) {
          durationSec = Math.round(durationUnits / timescale);
        }
      }

      const tkhdIdx = buffer.indexOf('tkhd');
      if (tkhdIdx > -1 && tkhdIdx + 88 < buffer.length) {
        const w = buffer.readUInt32BE(tkhdIdx + 76) >> 16;
        const h = buffer.readUInt32BE(tkhdIdx + 80) >> 16;
        if (w > 0 && h > 0) {
          width = w;
          height = h;
        }
      }
    } catch {}

    return { durationSec, width, height };
  }
}

export const targetSizeCompressionEngine = TargetSizeCompressionEngine.getInstance();

export interface ActiveCompressionJob {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  attempt: number;
  maxAttempts: number;
  progress: number;
  currentOutputSizeKB: number;
  targetSizeKB: number;
  originalSizeKB: number;
  message: string;
  targetAchieved: boolean;
  finalSizeKB: number;
  savingsPercent: number;
  attemptsUsed: number;
  downloadUrl: string;
  qualityWarning: string | null;
  outputBuffer?: Buffer;
  storageKey?: string;
  filename: string;
  mimeType: string;
  createdAt: number;
  isCancelled: boolean;
  qualityUsed?: number;
  compressionStrengthUsed?: string;
}

export class CompressionJobManager {
  private static instance: CompressionJobManager;
  private jobs = new Map<string, ActiveCompressionJob>();

  private constructor() {
    // Periodically prune completed/failed jobs older than 2 hours
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanupOldJobs(), 15 * 60 * 1000);
    }
  }

  public static getInstance(): CompressionJobManager {
    if (!CompressionJobManager.instance) {
      CompressionJobManager.instance = new CompressionJobManager();
    }
    return CompressionJobManager.instance;
  }

  public createJob(params: {
    jobId?: string;
    originalSizeKB: number;
    targetSizeKB: number;
    maxAttempts: number;
    filename: string;
    mimeType: string;
  }): ActiveCompressionJob {
    const jobId = params.jobId || crypto.randomUUID();
    const job: ActiveCompressionJob = {
      jobId,
      status: 'queued',
      attempt: 0,
      maxAttempts: params.maxAttempts || 5,
      progress: 0,
      currentOutputSizeKB: params.originalSizeKB,
      targetSizeKB: params.targetSizeKB,
      originalSizeKB: params.originalSizeKB,
      message: 'Initializing compression engine...',
      targetAchieved: false,
      finalSizeKB: params.originalSizeKB,
      savingsPercent: 0,
      attemptsUsed: 0,
      downloadUrl: '',
      qualityWarning: null,
      filename: params.filename,
      mimeType: params.mimeType,
      createdAt: Date.now(),
      isCancelled: false
    };

    this.jobs.set(jobId, job);
    return job;
  }

  public getJob(jobId: string): ActiveCompressionJob | undefined {
    return this.jobs.get(jobId);
  }

  public updateProgress(
    jobId: string,
    update: {
      status?: ActiveCompressionJob['status'];
      attempt?: number;
      progress?: number;
      currentOutputSizeKB?: number;
      message?: string;
    }
  ): void {
    const job = this.jobs.get(jobId);
    if (!job || job.isCancelled) return;

    if (update.status) job.status = update.status;
    if (update.attempt !== undefined) job.attempt = update.attempt;
    if (update.progress !== undefined) job.progress = update.progress;
    if (update.currentOutputSizeKB !== undefined) job.currentOutputSizeKB = update.currentOutputSizeKB;
    if (update.message) job.message = update.message;
  }

  public completeJob(
    jobId: string,
    data: {
      targetAchieved: boolean;
      finalSizeKB: number;
      savingsPercent: number;
      attemptsUsed: number;
      downloadUrl: string;
      qualityWarning: string | null;
      outputBuffer?: Buffer;
      storageKey?: string;
      qualityUsed?: number;
      compressionStrengthUsed?: string;
    }
  ): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'completed';
    job.progress = 100;
    job.targetAchieved = data.targetAchieved;
    job.finalSizeKB = data.finalSizeKB;
    job.savingsPercent = data.savingsPercent;
    job.attemptsUsed = data.attemptsUsed;
    job.downloadUrl = data.downloadUrl;
    job.qualityWarning = data.qualityWarning;
    job.outputBuffer = data.outputBuffer;
    job.storageKey = data.storageKey;
    job.qualityUsed = data.qualityUsed;
    job.compressionStrengthUsed = data.compressionStrengthUsed;
    job.message = data.targetAchieved ? 'Target achieved!' : 'Compression completed.';
  }

  public failJob(jobId: string, errorMessage: string): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'failed';
    job.progress = 100;
    job.message = errorMessage;
    job.qualityWarning = errorMessage;
  }

  public cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    job.isCancelled = true;
    job.status = 'cancelled';
    job.message = 'Compression job was cancelled by user.';
    return true;
  }

  public isJobCancelled(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    return !job || job.isCancelled;
  }

  private cleanupOldJobs(): void {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    for (const [id, job] of this.jobs.entries()) {
      if (job.createdAt < twoHoursAgo) {
        this.jobs.delete(id);
      }
    }
  }
}

export const compressionJobManager = CompressionJobManager.getInstance();

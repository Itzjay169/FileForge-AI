import { Queue, Worker, QueueEvents } from 'bullmq';
import Redis from 'ioredis';
import { CreateJobInput, JobProgressEvent } from '@fileforge/shared';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true
});

export const FORGE_JOB_QUEUE_NAME = 'fileforge-processing-queue';
export const FORGE_PRIORITY_QUEUE_NAME = 'fileforge-priority-processing-queue';

export interface FileProcessingJobData extends CreateJobInput {
  jobId: string;
  sourceFilePath: string;
  outputDirectory: string;
  originalSizeBytes: number;
  userId?: string;
}

export function createProcessingQueue(isPriority = false) {
  const queueName = isPriority ? FORGE_PRIORITY_QUEUE_NAME : FORGE_JOB_QUEUE_NAME;
  return new Queue<FileProcessingJobData>(queueName, {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      },
      removeOnComplete: {
        age: 3600 * 24, // Keep for 24h
        count: 1000
      },
      removeOnFail: {
        age: 3600 * 48
      }
    }
  });
}

import { PlanDefinition } from '../types/user.types';

export const PLANS: PlanDefinition[] = [
  {
    id: 'FREE',
    name: 'Free Studio',
    tagline: 'Essential file compression and conversions for casual creators',
    priceMonthly: 0,
    priceYearly: 0,
    maxFileSizeBytes: 2 * 1024 * 1024 * 1024, // 2 GB
    dailyConversions: 25,
    concurrentJobs: 2,
    retentionDays: 1, // 24 hours retention
    features: [
      'Universal upload up to 2 GB per file',
      'Lossless & lossy smart compression',
      'Core conversions (Office, Images, Audio, Video)',
      'Side-by-side interactive preview',
      'Client-side instant compression for web images',
      '24-hour secure file retention',
      'No watermarks added to your downloads',
      'Community support'
    ]
  },
  {
    id: 'PRO_CREATIVE',
    name: 'Pro Creative',
    tagline: 'Unlimited power for designers, videographers, and power creators',
    priceMonthly: 12,
    priceYearly: 108, // $9/mo billed annually (25% off)
    maxFileSizeBytes: 10 * 1024 * 1024 * 1024, // 10 GB
    dailyConversions: 'UNLIMITED',
    concurrentJobs: 10,
    retentionDays: 30, // 30 days retention
    isPopular: true,
    features: [
      'Massive 10 GB file size limit',
      'Unlimited daily conversions & compressions',
      'Priority fast-lane processing workers',
      'Batch processing (up to 100 files simultaneously)',
      'AI Transparency Scanner & Provenance verification',
      'Legitimate owned-content watermark removal',
      'Full OCR text extraction & translation',
      'Lossless 4K & RAW photo workflow',
      '30-day extended cloud storage retention',
      'Password-protected branded share links'
    ]
  },
  {
    id: 'STUDIO_TEAM',
    name: 'Studio Team',
    tagline: 'Collaborative workspaces and high-throughput pipelines for studios',
    priceMonthly: 39,
    priceYearly: 348, // $29/mo billed annually
    maxFileSizeBytes: 50 * 1024 * 1024 * 1024, // 50 GB
    dailyConversions: 'UNLIMITED',
    concurrentJobs: 50,
    retentionDays: 90,
    features: [
      'Huge 50 GB single-file ceiling',
      'Dedicated cluster processing workers',
      'Up to 10 team seats with role permissions',
      'Custom webhook integration & REST API keys',
      'Audit log trail & enterprise SSO (SAML/Okta)',
      'Custom watermark & copyright embedding',
      'Client approval portal with live comments',
      '90-day extended storage + archival exports',
      '24/7 dedicated engineering SLA support'
    ]
  }
];

export const SYSTEM_LIMITS = {
  FREE_MAX_FILE_BYTES: 2 * 1024 * 1024 * 1024, // 2GB
  PRO_MAX_FILE_BYTES: 10 * 1024 * 1024 * 1024, // 10GB
  STUDIO_MAX_FILE_BYTES: 50 * 1024 * 1024 * 1024, // 50GB
  MAX_BATCH_FILES_FREE: 5,
  MAX_BATCH_FILES_PRO: 100,
  DEFAULT_RETENTION_HOURS_FREE: 24,
  DEFAULT_RETENTION_HOURS_PRO: 720
};

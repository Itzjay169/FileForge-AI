import crypto from 'crypto';
import {
  AdminDashboardStats,
  AdminUserRecord,
  AdminJobRecord,
  RevenueBreakdown,
  FileTypeUsageStats,
  SystemStatus,
  ChangelogEntry,
  FeatureFlag,
  SupportTicket,
  TicketCategory,
  TicketPriority
} from '@fileforge/shared';

export class AdminService {
  private static instance: AdminService;

  private users: Map<string, AdminUserRecord> = new Map();
  private jobs: Map<string, AdminJobRecord> = new Map();
  private featureFlags: Map<string, FeatureFlag> = new Map();
  private tickets: Map<string, SupportTicket> = new Map();
  private systemStatuses: Map<string, SystemStatus> = new Map();
  private changelogs: ChangelogEntry[] = [];

  private constructor() {
    this.seedDefaultData();
  }

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  private seedDefaultData() {
    // Seed users
    const sampleUsers: AdminUserRecord[] = [
      {
        id: 'usr_creative_pro_01',
        email: 'creator@fileforge.studio',
        name: 'Elena Rostova',
        planTier: 'PRO_CREATIVE',
        subscriptionStatus: 'ACTIVE',
        storageUsedBytes: 425000000,
        jobCount: 196,
        lastActiveAt: Date.now() - 1000 * 60 * 12,
        createdAt: Date.now() - 86400000 * 30,
        isBanned: false
      },
      {
        id: 'usr_dev_02',
        email: 'kenji@sakuga-vfx.org',
        name: 'Kenji Sato',
        planTier: 'STUDIO_TEAM',
        subscriptionStatus: 'ACTIVE',
        storageUsedBytes: 12500000000,
        jobCount: 840,
        lastActiveAt: Date.now() - 1000 * 60 * 45,
        createdAt: Date.now() - 86400000 * 60,
        isBanned: false
      },
      {
        id: 'usr_enterprise_03',
        email: 'it-sec@nexus-multimedia.com',
        name: 'Nexus Multimedia Enterprise',
        planTier: 'ENTERPRISE',
        subscriptionStatus: 'ACTIVE',
        storageUsedBytes: 74200000000,
        jobCount: 4210,
        lastActiveAt: Date.now() - 1000 * 60 * 2,
        createdAt: Date.now() - 86400000 * 90,
        isBanned: false
      },
      {
        id: 'usr_free_04',
        email: 'alex.chen@gmail.com',
        name: 'Alex Chen',
        planTier: 'FREE',
        subscriptionStatus: null,
        storageUsedBytes: 85000000,
        jobCount: 14,
        lastActiveAt: Date.now() - 86400000 * 2,
        createdAt: Date.now() - 86400000 * 10,
        isBanned: false
      },
      {
        id: 'usr_abuser_05',
        email: 'spammer@suspicious-origin.net',
        name: 'Unknown Agent',
        planTier: 'FREE',
        subscriptionStatus: null,
        storageUsedBytes: 1950000000,
        jobCount: 89,
        lastActiveAt: Date.now() - 86400000 * 4,
        createdAt: Date.now() - 86400000 * 5,
        isBanned: true,
        banReason: 'Automated scraping attack / repetitive malware upload detected'
      }
    ];
    for (const u of sampleUsers) {
      this.users.set(u.id, u);
    }

    // Seed jobs
    const sampleJobs: AdminJobRecord[] = [
      {
        id: 'job_8801',
        userId: 'usr_creative_pro_01',
        type: 'COMPRESS',
        inputFormat: 'png',
        outputFormat: 'webp',
        inputSizeBytes: 4200000,
        outputSizeBytes: 390000,
        status: 'COMPLETED',
        error: null,
        startedAt: Date.now() - 1000 * 120,
        completedAt: Date.now() - 1000 * 118,
        createdAt: Date.now() - 1000 * 120,
        durationMs: 2150
      },
      {
        id: 'job_8802',
        userId: 'usr_dev_02',
        type: 'CONVERT',
        inputFormat: 'mp4',
        outputFormat: 'webm',
        inputSizeBytes: 85000000,
        outputSizeBytes: 32000000,
        status: 'COMPLETED',
        error: null,
        startedAt: Date.now() - 1000 * 300,
        completedAt: Date.now() - 1000 * 280,
        createdAt: Date.now() - 1000 * 300,
        durationMs: 19800
      },
      {
        id: 'job_8803',
        userId: 'usr_enterprise_03',
        type: 'WATERMARK',
        inputFormat: 'pdf',
        outputFormat: 'pdf',
        inputSizeBytes: 12000000,
        outputSizeBytes: 12400000,
        status: 'COMPLETED',
        error: null,
        startedAt: Date.now() - 1000 * 500,
        completedAt: Date.now() - 1000 * 498,
        createdAt: Date.now() - 1000 * 500,
        durationMs: 1940
      },
      {
        id: 'job_8804',
        userId: 'usr_free_04',
        type: 'EDIT',
        inputFormat: 'jpg',
        outputFormat: 'png',
        inputSizeBytes: 2100000,
        outputSizeBytes: 1800000,
        status: 'COMPLETED',
        error: null,
        startedAt: Date.now() - 1000 * 800,
        completedAt: Date.now() - 1000 * 797,
        createdAt: Date.now() - 1000 * 800,
        durationMs: 3100
      },
      {
        id: 'job_8805',
        userId: 'usr_creative_pro_01',
        type: 'INSPECT',
        inputFormat: 'png',
        outputFormat: 'json',
        inputSizeBytes: 3500000,
        outputSizeBytes: 4200,
        status: 'COMPLETED',
        error: null,
        startedAt: Date.now() - 1000 * 950,
        completedAt: Date.now() - 1000 * 949,
        createdAt: Date.now() - 1000 * 950,
        durationMs: 820
      },
      {
        id: 'job_8806',
        userId: 'usr_abuser_05',
        type: 'CONVERT',
        inputFormat: 'exe',
        outputFormat: 'pdf',
        inputSizeBytes: 8900000,
        outputSizeBytes: 0,
        status: 'FAILED',
        error: 'Security Gate Block: Executable binary payload rejected by scanner',
        startedAt: Date.now() - 86400000 * 4,
        completedAt: Date.now() - 86400000 * 4,
        createdAt: Date.now() - 86400000 * 4,
        durationMs: 120
      },
      {
        id: 'job_8807',
        userId: 'usr_dev_02',
        type: 'COMPRESS',
        inputFormat: 'mkv',
        outputFormat: 'mp4',
        inputSizeBytes: 420000000,
        outputSizeBytes: 0,
        status: 'PROCESSING',
        error: null,
        startedAt: Date.now() - 1000 * 45,
        completedAt: null,
        createdAt: Date.now() - 1000 * 45,
        durationMs: null
      },
      {
        id: 'job_8808',
        userId: 'usr_enterprise_03',
        type: 'CONVERT',
        inputFormat: 'docx',
        outputFormat: 'pdf',
        inputSizeBytes: 4500000,
        outputSizeBytes: 3800000,
        status: 'COMPLETED',
        error: null,
        startedAt: Date.now() - 1000 * 1200,
        completedAt: Date.now() - 1000 * 1198,
        createdAt: Date.now() - 1000 * 1200,
        durationMs: 2400
      }
    ];
    for (const j of sampleJobs) {
      this.jobs.set(j.id, j);
    }

    // Seed feature flags
    const sampleFlags: FeatureFlag[] = [
      {
        id: 'flag_batch_v2',
        name: 'Parallel Batch Transcoding V2',
        description: 'Enables high-throughput BullMQ worker pool for multi-file conversion',
        enabled: true,
        planTiers: ['PRO_CREATIVE', 'STUDIO_TEAM', 'ENTERPRISE'],
        percentage: 100,
        createdAt: Date.now() - 86400000 * 20
      },
      {
        id: 'flag_ai_bg_neural',
        name: 'Neural AI Background Removal',
        description: 'Server-side deep neural segmenter with sub-pixel alpha matting',
        enabled: true,
        planTiers: ['PRO_CREATIVE', 'STUDIO_TEAM', 'ENTERPRISE'],
        percentage: 100,
        createdAt: Date.now() - 86400000 * 15
      },
      {
        id: 'flag_video_4k_prores',
        name: '4K ProRes & Lossless AV1 Pipeline',
        description: 'High-bitrate archival transcode workers for cinematic footage',
        enabled: false,
        planTiers: ['STUDIO_TEAM', 'ENTERPRISE'],
        percentage: 25,
        createdAt: Date.now() - 86400000 * 5
      }
    ];
    for (const f of sampleFlags) {
      this.featureFlags.set(f.id, f);
    }

    // Seed support tickets
    const sampleTickets: SupportTicket[] = [
      {
        id: 'tkt_101',
        userId: 'usr_creative_pro_01',
        userEmail: 'creator@fileforge.studio',
        subject: 'Inquiry on custom SVG vector color-space conversions',
        body: 'When converting SVG with CMYK embedded tags to PDF/X-1a, how does the color profile match our offset printing proofing standard?',
        category: 'FEATURE',
        status: 'RESOLVED',
        priority: 'MEDIUM',
        assigneeId: 'admin_support_01',
        response: 'Hi Elena, FileForge AI handles CMYK PDF/X-1a preservation natively using embedded ICC profiles. Your profile tags remain intact.',
        createdAt: Date.now() - 86400000 * 3,
        updatedAt: Date.now() - 86400000 * 2
      },
      {
        id: 'tkt_102',
        userId: 'usr_dev_02',
        userEmail: 'kenji@sakuga-vfx.org',
        subject: 'API rate limit increase for studio automation pipeline',
        body: 'We are processing daily 4K dailies render passes and would like to raise the concurrent worker limit from 10 to 50.',
        category: 'BILLING',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assigneeId: 'admin_support_01',
        response: 'Currently reviewing your team throughput logs to apply custom VPC cluster quota.',
        createdAt: Date.now() - 86400000 * 1,
        updatedAt: Date.now() - 1000 * 60 * 30
      },
      {
        id: 'tkt_103',
        userId: 'usr_free_04',
        userEmail: 'alex.chen@gmail.com',
        subject: 'Feedback on mobile camera scan auto-edge crop',
        body: 'The mobile app camera document scanner is super smooth! Would love automatic multi-page PDF stitch from camera burst.',
        category: 'GENERAL',
        status: 'OPEN',
        priority: 'LOW',
        assigneeId: null,
        response: null,
        createdAt: Date.now() - 1000 * 60 * 120,
        updatedAt: Date.now() - 1000 * 60 * 120
      }
    ];
    for (const t of sampleTickets) {
      this.tickets.set(t.id, t);
    }

    // Seed system statuses
    const services = [
      { service: 'API Gateway & Edge Router', status: 'OPERATIONAL' as const, latencyMs: 24, message: 'Normal latency across global edge PoPs' },
      { service: 'Universal Transcoding Cluster (Sharp/FFmpeg)', status: 'OPERATIONAL' as const, latencyMs: 145, message: 'All 32 worker nodes green' },
      { service: 'Document & LibreOffice Headless Daemon', status: 'OPERATIONAL' as const, latencyMs: 310, message: 'Healthy queue throughput' },
      { service: 'AI Vision & C2PA Provenance Engine', status: 'OPERATIONAL' as const, latencyMs: 82, message: 'Model inference cache warmed' },
      { service: 'Distributed Object Storage (S3/R2)', status: 'OPERATIONAL' as const, latencyMs: 42, message: 'Multi-region replica syncd' },
      { service: 'Stripe & Razorpay Billing Webhooks', status: 'OPERATIONAL' as const, latencyMs: 110, message: 'All webhook handlers verified' }
    ];
    for (const s of services) {
      this.systemStatuses.set(s.service, {
        ...s,
        lastChecked: Date.now()
      });
    }

    // Seed changelog
    this.changelogs = [
      {
        id: 'chg_v2_1_0',
        version: 'v2.1.0',
        title: 'Universal Monorepo, Workspaces, and Mobile App',
        description: 'Phase 6 brings full multi-user team workspaces with RBAC, secure expiring share links with QR codes, and our cross-platform Expo mobile client.',
        type: 'FEATURE',
        date: 'November 2026'
      },
      {
        id: 'chg_v2_0_0',
        version: 'v2.0.0',
        title: 'AI Provenance, C2PA Credentials & Watermark Transparency',
        description: 'Phase 5 adds deep EXIF and metadata inspection, cryptographic C2PA content-authenticity detection, and legally verified watermark removal.',
        type: 'FEATURE',
        date: 'November 2026'
      },
      {
        id: 'chg_v1_5_0',
        version: 'v1.5.0',
        title: 'Full Creative Studio, PDF Studio & Natural Language Assistant',
        description: 'Phase 4 introduced interactive raster and vector manipulation, PDF page restructuring/OCR, and conversational AI file operations with explicit user confirmation.',
        type: 'IMPROVEMENT',
        date: 'November 2026'
      },
      {
        id: 'chg_v1_0_0',
        version: 'v1.0.0',
        title: 'Initial Production Launch & Sakuga Design System',
        description: 'High-performance smart compression with SSRF mitigation and universal conversion matrix supporting 100+ multi-media format pairs.',
        type: 'FEATURE',
        date: 'November 2026'
      }
    ];
  }

  public getDashboardStats(): AdminDashboardStats {
    let totalStorage = 0;
    for (const u of this.users.values()) {
      totalStorage += u.storageUsedBytes;
    }

    const activeSubs = Array.from(this.users.values()).filter((u) => u.subscriptionStatus === 'ACTIVE').length;
    const openTickets = Array.from(this.tickets.values()).filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
    const failedJobs = Array.from(this.jobs.values()).filter((j) => j.status === 'FAILED').length;

    return {
      totalUsers: this.users.size,
      activeSubscriptions: activeSubs,
      monthlyRevenueCents: 150000, // $1,500.00
      totalStorageBytes: totalStorage,
      totalJobsProcessed: 5460,
      failedJobsLast24h: failedJobs,
      openTickets,
      openAbuseReports: 1
    };
  }

  public listUsers(page = 1, limit = 10, search?: string) {
    let all = Array.from(this.users.values());
    if (search) {
      const q = search.toLowerCase();
      all = all.filter((u) => u.email.toLowerCase().includes(q) || (u.name && u.name.toLowerCase().includes(q)));
    }
    const total = all.length;
    const start = (page - 1) * limit;
    const users = all.slice(start, start + limit);
    return { users, total };
  }

  public banUser(userId: string, reason?: string): void {
    const user = this.users.get(userId);
    if (!user) throw new Error(`User not found: ${userId}`);
    user.isBanned = true;
    user.banReason = reason || 'Violation of Acceptable Use Policy';
  }

  public unbanUser(userId: string): void {
    const user = this.users.get(userId);
    if (!user) throw new Error(`User not found: ${userId}`);
    user.isBanned = false;
    user.banReason = null;
  }

  public listJobs(page = 1, limit = 10, status?: string, type?: string) {
    let all = Array.from(this.jobs.values());
    if (status) {
      all = all.filter((j) => j.status === status);
    }
    if (type) {
      all = all.filter((j) => j.type === type);
    }
    all.sort((a, b) => b.createdAt - a.createdAt);
    const total = all.length;
    const start = (page - 1) * limit;
    const jobs = all.slice(start, start + limit);
    return { jobs, total };
  }

  public getRevenueBreakdown(periods = 6): RevenueBreakdown[] {
    const months = ['June', 'July', 'August', 'September', 'October', 'November'];
    const results: RevenueBreakdown[] = [];
    const count = Math.min(periods, months.length);

    for (let i = 0; i < count; i++) {
      const baseSub = 85000 + i * 14000;
      const baseCredit = 12000 + i * 3500;
      results.push({
        period: `${months[months.length - count + i]} 2026`,
        subscriptionRevenueCents: baseSub,
        creditRevenueCents: baseCredit,
        totalRevenueCents: baseSub + baseCredit,
        newSubscriptions: 12 + i * 5,
        churnedSubscriptions: Math.max(1, Math.floor(i * 1.2))
      });
    }
    return results;
  }

  public getFileTypeUsage(): FileTypeUsageStats[] {
    return [
      { format: 'PNG', count: 1840, totalSizeBytes: 18400000000, avgProcessingMs: 1420 },
      { format: 'PDF', count: 1420, totalSizeBytes: 42100000000, avgProcessingMs: 2850 },
      { format: 'MP4', count: 860, totalSizeBytes: 98000000000, avgProcessingMs: 14200 },
      { format: 'WEBP', count: 720, totalSizeBytes: 4200000000, avgProcessingMs: 980 },
      { format: 'DOCX', count: 620, totalSizeBytes: 3100000000, avgProcessingMs: 1950 }
    ];
  }

  public getSystemStatus(): SystemStatus[] {
    return Array.from(this.systemStatuses.values());
  }

  public listFeatureFlags(): FeatureFlag[] {
    return Array.from(this.featureFlags.values());
  }

  public updateFeatureFlag(id: string, updates: Partial<FeatureFlag>): FeatureFlag {
    const flag = this.featureFlags.get(id);
    if (!flag) throw new Error(`Feature flag not found: ${id}`);
    Object.assign(flag, updates);
    return flag;
  }

  public createSupportTicket(data: {
    userId: string;
    userEmail: string;
    subject: string;
    body: string;
    category?: TicketCategory;
    priority?: TicketPriority;
  }): SupportTicket {
    const ticket: SupportTicket = {
      id: `tkt_${crypto.randomUUID().slice(0, 8)}`,
      userId: data.userId,
      userEmail: data.userEmail,
      subject: data.subject,
      body: data.body,
      category: data.category || 'GENERAL',
      status: 'OPEN',
      priority: data.priority || 'LOW',
      assigneeId: null,
      response: null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  public listSupportTickets(status?: string): SupportTicket[] {
    let list = Array.from(this.tickets.values());
    if (status) {
      list = list.filter((t) => t.status === status);
    }
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }

  public updateTicket(id: string, updates: Partial<SupportTicket>): SupportTicket {
    const ticket = this.tickets.get(id);
    if (!ticket) throw new Error(`Ticket not found: ${id}`);
    Object.assign(ticket, updates);
    ticket.updatedAt = Date.now();
    return ticket;
  }

  public listChangelog(): ChangelogEntry[] {
    return this.changelogs;
  }
}

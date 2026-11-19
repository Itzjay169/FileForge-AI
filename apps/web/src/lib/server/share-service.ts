import crypto from 'crypto';
import { ShareLink, ShareAnalytics, UserFileRecord } from '@fileforge/shared';
import { storageService } from './storage-service';

export class ShareService {
  private static instance: ShareService;

  private links: Map<string, ShareLink> = new Map(); // code -> ShareLink
  private analytics: Map<string, ShareAnalytics> = new Map(); // linkId -> ShareAnalytics

  private constructor() {
    this.seedSampleShareLink();
  }

  public static getInstance(): ShareService {
    if (!ShareService.instance) {
      ShareService.instance = new ShareService();
    }
    return ShareService.instance;
  }

  private seedSampleShareLink() {
    const code = 'sh_demo2026';
    const id = 'lnk_demo_01';
    const sampleLink: ShareLink = {
      id,
      code,
      fileId: 'fil_101',
      fileName: 'sakuga-impact-keyframe.png',
      fileSizeBytes: 3200000,
      format: 'png',
      storageKey: '2026-11-19/sakuga-keyframe.png',
      downloadUrl: '/api/files/download?key=2026-11-19/sakuga-keyframe.png',
      hasPassword: false,
      expiresAt: Date.now() + 86400000 * 7,
      maxDownloads: 50,
      downloadCount: 3,
      viewCount: 14,
      isRevoked: false,
      createdAt: Date.now() - 86400000,
      qrCodeSvg: this.generateQrCodeSvg(`https://fileforge.studio/share/${code}`)
    };

    this.links.set(code, sampleLink);
    this.analytics.set(id, {
      linkId: id,
      views: 14,
      downloads: 3,
      lastAccessedAt: Date.now() - 3600000 * 4
    });
  }

  /**
   * Create a new secure share link
   */
  public createShareLink(
    file: UserFileRecord,
    options?: {
      password?: string;
      expiresInHours?: number;
      maxDownloads?: number;
    }
  ): ShareLink {
    const code = `sh_${crypto.randomBytes(4).toString('hex')}`;
    const id = `lnk_${crypto.randomUUID().substring(0, 8)}`;
    const now = Date.now();

    let passwordHash: string | undefined;
    if (options?.password) {
      passwordHash = this.hashPassword(options.password);
    }

    const expiresAt = options?.expiresInHours
      ? now + options.expiresInHours * 3600 * 1000
      : undefined;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shareUrl = `${appUrl}/share/${code}`;
    const qrCodeSvg = this.generateQrCodeSvg(shareUrl);

    const link: ShareLink = {
      id,
      code,
      fileId: file.id,
      fileName: file.name,
      fileSizeBytes: file.sizeBytes,
      format: file.format,
      storageKey: file.storageKey,
      downloadUrl: file.downloadUrl,
      hasPassword: Boolean(options?.password),
      passwordHash,
      expiresAt,
      maxDownloads: options?.maxDownloads,
      downloadCount: 0,
      viewCount: 0,
      isRevoked: false,
      createdAt: now,
      qrCodeSvg
    };

    this.links.set(code, link);
    this.analytics.set(id, {
      linkId: id,
      views: 0,
      downloads: 0
    });

    return link;
  }

  /**
   * Retrieve and validate a share link
   */
  public getShareLink(
    code: string,
    passwordAttempt?: string
  ): { link: ShareLink; isPasswordRequired: boolean; isAuthorized: boolean } {
    const link = this.links.get(code);
    if (!link || link.isRevoked) {
      throw new Error('LINK_NOT_FOUND: The requested share link does not exist or has been revoked.');
    }

    // Check expiration
    if (link.expiresAt && Date.now() > link.expiresAt) {
      throw new Error('LINK_EXPIRED: This secure link has expired and is no longer accessible.');
    }

    // Check download limit
    if (link.maxDownloads && link.downloadCount >= link.maxDownloads) {
      throw new Error('DOWNLOAD_LIMIT_REACHED: The maximum allowed download limit for this link has been reached.');
    }

    // Password verification check
    if (link.hasPassword) {
      if (!passwordAttempt) {
        return {
          link: {
            ...link,
            downloadUrl: '' // Do not expose download URL until password verified
          },
          isPasswordRequired: true,
          isAuthorized: false
        };
      }

      const attemptHash = this.hashPassword(passwordAttempt);
      if (attemptHash !== link.passwordHash) {
        throw new Error('INVALID_PASSWORD: Incorrect password provided for this protected link.');
      }
    }

    // Increment view analytics
    link.viewCount++;
    this.links.set(code, link);

    const stat = this.analytics.get(link.id);
    if (stat) {
      stat.views++;
      stat.lastAccessedAt = Date.now();
      this.analytics.set(link.id, stat);
    }

    return {
      link,
      isPasswordRequired: link.hasPassword,
      isAuthorized: true
    };
  }

  /**
   * Authorize and increment download count
   */
  public authorizeDownload(code: string, passwordAttempt?: string): { downloadUrl: string; fileName: string } {
    const { link, isAuthorized } = this.getShareLink(code, passwordAttempt);
    if (!isAuthorized) {
      throw new Error('UNAUTHORIZED: Password required to download this asset.');
    }

    link.downloadCount++;
    this.links.set(code, link);

    const stat = this.analytics.get(link.id);
    if (stat) {
      stat.downloads++;
      this.analytics.set(link.id, stat);
    }

    // Generate fresh HMAC signed download URL
    const signedUrl = storageService.generateSignedDownloadUrl(link.storageKey, 3600);

    return {
      downloadUrl: signedUrl,
      fileName: link.fileName
    };
  }

  public getAnalytics(linkId: string): ShareAnalytics | undefined {
    return this.analytics.get(linkId);
  }

  private hashPassword(password: string): string {
    return crypto
      .createHmac('sha256', process.env.NEXTAUTH_SECRET || 'fileforge-share-secret')
      .update(password)
      .digest('hex');
  }

  /**
   * Generates a clean standalone vector QR Code SVG representation
   */
  private generateQrCodeSvg(url: string): string {
    // Generate high-contrast anime-styled QR pattern matrix placeholder
    const size = 160;
    const modules = 21; // standard version 1 QR matrix
    const step = size / modules;

    let rects = '';
    // Draw positioning corner squares (Top-Left, Top-Right, Bottom-Left)
    const corners = [
      { x: 0, y: 0 },
      { x: (modules - 7) * step, y: 0 },
      { x: 0, y: (modules - 7) * step }
    ];

    corners.forEach((c) => {
      rects += `<rect x="${c.x}" y="${c.y}" width="${7 * step}" height="${7 * step}" fill="#8b5cf6" rx="4"/>`;
      rects += `<rect x="${c.x + step}" y="${c.y + step}" width="${5 * step}" height="${5 * step}" fill="#12121c" rx="2"/>`;
      rects += `<rect x="${c.x + 2 * step}" y="${c.y + 2 * step}" width="${3 * step}" height="${3 * step}" fill="#ec4899" rx="1"/>`;
    });

    // Hash URL to generate deterministic pseudorandom data cells
    const hash = crypto.createHash('md5').update(url).digest();
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Skip corner finder patterns
        const isCorner =
          (r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8);
        if (!isCorner) {
          const bitIdx = (r * modules + c) % (hash.length * 8);
          const byte = hash[Math.floor(bitIdx / 8)];
          const bit = (byte >> (bitIdx % 8)) & 1;
          if (bit === 1) {
            rects += `<rect x="${c * step + 0.5}" y="${r * step + 0.5}" width="${step - 1}" height="${step - 1}" fill="#f0eee9" rx="1"/>`;
          }
        }
      }
    }

    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="background:#12121c; border-radius:12px; padding:10px;">${rects}</svg>`;
  }
}

export const shareService = ShareService.getInstance();

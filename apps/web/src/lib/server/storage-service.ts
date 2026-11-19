import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const STORAGE_ROOT = path.resolve(process.cwd(), '.fileforge_storage');
const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'fileforge-default-signing-secret-key-32chars';

export class StorageService {
  private static instance: StorageService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private async ensureDir() {
    if (!this.isInitialized) {
      await fs.mkdir(STORAGE_ROOT, { recursive: true });
      this.isInitialized = true;
    }
  }

  public async saveFile(
    buffer: Buffer,
    originalName: string,
    extension: string
  ): Promise<{
    storageKey: string;
    sha256Hash: string;
    sizeBytes: number;
    filePath: string;
  }> {
    await this.ensureDir();

    // Compute SHA-256 hash
    const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');

    // Storage key with date partition and UUID
    const datePartition = new Date().toISOString().slice(0, 10);
    const uniqueId = crypto.randomUUID();
    const cleanExt = extension.replace(/^\./, '').toLowerCase();
    const storageKey = `${datePartition}/${uniqueId}.${cleanExt}`;

    const filePath = path.join(STORAGE_ROOT, storageKey);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);

    return {
      storageKey,
      sha256Hash,
      sizeBytes: buffer.length,
      filePath
    };
  }

  public async getFileBuffer(storageKey: string): Promise<Buffer> {
    await this.ensureDir();
    const filePath = path.join(STORAGE_ROOT, storageKey);
    return fs.readFile(filePath);
  }

  public async deleteFile(storageKey: string): Promise<boolean> {
    try {
      const filePath = path.join(STORAGE_ROOT, storageKey);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generates a tamper-proof HMAC-signed temporary download URL
   */
  public generateSignedDownloadUrl(storageKey: string, expiresInSeconds: number = 3600): string {
    const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const dataToSign = `${storageKey}:${expires}`;
    const signature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(dataToSign)
      .digest('hex');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${appUrl}/api/files/download?key=${encodeURIComponent(storageKey)}&expires=${expires}&sig=${signature}`;
  }

  /**
   * Verifies an HMAC-signed temporary download URL
   */
  public verifySignedUrl(storageKey: string, expires: number, signature: string): boolean {
    const now = Math.floor(Date.now() / 1000);
    if (now > expires) {
      return false; // Expired
    }

    const dataToSign = `${storageKey}:${expires}`;
    const expectedSig = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(dataToSign)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSig, 'hex'));
  }
}

export const storageService = StorageService.getInstance();

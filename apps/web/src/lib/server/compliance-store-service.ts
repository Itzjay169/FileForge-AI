import crypto from 'crypto';
import {
  OwnershipVerificationRequest,
  OwnershipReasonCode,
  OwnershipRequestStatus,
  AbuseReport,
  WatermarkAuditRecord
} from '@fileforge/shared';

/**
 * Compliance & Audit Store Service
 * In-memory ledger with database synchronization hooks for ownership verification requests,
 * audit trails, and abuse reporting.
 */
export class ComplianceStoreService {
  private static instance: ComplianceStoreService;

  private ownershipRequests: Map<string, OwnershipVerificationRequest> = new Map();
  private abuseReports: Map<string, AbuseReport> = new Map();
  private auditRecords: WatermarkAuditRecord[] = [];

  private constructor() {
    this.seedInitialMockData();
  }

  public static getInstance(): ComplianceStoreService {
    if (!ComplianceStoreService.instance) {
      ComplianceStoreService.instance = new ComplianceStoreService();
    }
    return ComplianceStoreService.instance;
  }

  private seedInitialMockData() {
    // Seed an initial demo request for admin dashboard preview
    const sampleId = 'req-demo-1001';
    this.ownershipRequests.set(sampleId, {
      id: sampleId,
      fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      fileName: 'studio-branding-proof.jpg',
      fileSizeBytes: 2450000,
      storageKey: '2026-11-19/sample-proof.jpg',
      userId: 'usr_creative_pro_01',
      userEmail: 'creator@fileforge.studio',
      reasonCode: 'ORIGINAL_CREATOR_LOST_SOURCE',
      ownershipProofDescription: 'I am the registered photographer for this campaign. Raw NEF sensor files available upon request; lost original non-watermarked export.',
      proofDocumentUrl: 'https://storage.fileforge.studio/proofs/copyright-reg-2026.pdf',
      legalDeclarationSigned: true,
      declarationSignerName: 'Elena Rostova',
      declarationTimestamp: Date.now() - 3600000 * 2,
      ipAddress: '198.51.100.42',
      status: 'PENDING_REVIEW',
      creditCost: 10,
      createdAt: Date.now() - 3600000 * 2,
      updatedAt: Date.now() - 3600000 * 2
    });

    this.auditRecords.push({
      id: crypto.randomUUID(),
      timestamp: Date.now() - 3600000 * 2,
      action: 'REQUEST_SUBMITTED',
      fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      userId: 'usr_creative_pro_01',
      ipAddress: '198.51.100.42',
      reasonCode: 'ORIGINAL_CREATOR_LOST_SOURCE',
      legalSignature: 'Elena Rostova',
      details: { requestId: sampleId }
    });
  }

  // --- Ownership Verification Requests ---

  public createVerificationRequest(
    data: Omit<OwnershipVerificationRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): OwnershipVerificationRequest {
    const id = crypto.randomUUID();
    const now = Date.now();
    const record: OwnershipVerificationRequest = {
      ...data,
      id,
      status: 'PENDING_REVIEW',
      createdAt: now,
      updatedAt: now
    };

    this.ownershipRequests.set(id, record);

    this.logAudit({
      action: 'REQUEST_SUBMITTED',
      fileHash: record.fileHash,
      userId: record.userId,
      ipAddress: record.ipAddress,
      reasonCode: record.reasonCode,
      legalSignature: record.declarationSignerName,
      details: { requestId: id, userEmail: record.userEmail }
    });

    return record;
  }

  public getVerificationRequest(id: string): OwnershipVerificationRequest | undefined {
    return this.ownershipRequests.get(id);
  }

  public listVerificationRequests(statusFilter?: OwnershipRequestStatus): OwnershipVerificationRequest[] {
    const all = Array.from(this.ownershipRequests.values());
    if (!statusFilter) {
      return all.sort((a, b) => b.createdAt - a.createdAt);
    }
    return all.filter((r) => r.status === statusFilter).sort((a, b) => b.createdAt - a.createdAt);
  }

  public reviewVerificationRequest(
    id: string,
    action: 'APPROVE' | 'REJECT' | 'FLAG',
    adminNotes: string,
    reviewerId = 'admin_sys'
  ): OwnershipVerificationRequest {
    const request = this.ownershipRequests.get(id);
    if (!request) {
      throw new Error(`Verification request with ID "${id}" not found`);
    }

    const statusMap: Record<typeof action, OwnershipRequestStatus> = {
      APPROVE: 'APPROVED',
      REJECT: 'REJECTED',
      FLAG: 'FLAGGED'
    };

    request.status = statusMap[action];
    request.adminNotes = adminNotes;
    request.updatedAt = Date.now();
    this.ownershipRequests.set(id, request);

    this.logAudit({
      action: 'REQUEST_REVIEWED',
      fileHash: request.fileHash,
      userId: reviewerId,
      details: {
        requestId: id,
        decision: action,
        adminNotes
      }
    });

    return request;
  }

  // --- Abuse Reporting ---

  public createAbuseReport(data: Omit<AbuseReport, 'id' | 'status' | 'createdAt'>): AbuseReport {
    const id = crypto.randomUUID();
    const report: AbuseReport = {
      ...data,
      id,
      status: 'OPEN',
      createdAt: Date.now()
    };
    this.abuseReports.set(id, report);
    return report;
  }

  public listAbuseReports(): AbuseReport[] {
    return Array.from(this.abuseReports.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  // --- Audit Trail ---

  public logAudit(record: Omit<WatermarkAuditRecord, 'id' | 'timestamp'>): WatermarkAuditRecord {
    const fullRecord: WatermarkAuditRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    this.auditRecords.push(fullRecord);
    return fullRecord;
  }

  public listAuditLogs(fileHash?: string): WatermarkAuditRecord[] {
    if (fileHash) {
      return this.auditRecords.filter((a) => a.fileHash === fileHash).sort((a, b) => b.timestamp - a.timestamp);
    }
    return [...this.auditRecords].sort((a, b) => b.timestamp - a.timestamp);
  }
}

export const complianceStore = ComplianceStoreService.getInstance();

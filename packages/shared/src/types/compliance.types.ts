/**
 * Compliance, Provenance & Watermark Transparency Types
 * FileForge AI - Phase 5
 */

export type AuthenticityRiskRating =
  | 'VERIFIED_GENUINE'
  | 'AI_GENERATED_DISCLOSED'
  | 'SYNTHETIC_UNDISCLOSED'
  | 'POTENTIALLY_TAMPERED'
  | 'UNPROTECTED_STANDARD';

export type AiDisclosureTier =
  | 'FULLY_AI_GENERATED'
  | 'AI_ASSISTED'
  | 'HUMAN_WITH_AI_ENHANCEMENT';

export type WatermarkPosition =
  | 'center'
  | 'bottom_right'
  | 'bottom_left'
  | 'top_right'
  | 'top_left'
  | 'tiled';

export type OwnershipReasonCode =
  | 'ORIGINAL_CREATOR_LOST_SOURCE'
  | 'LICENSED_STOCK_PURCHASED'
  | 'CLIENT_AUTHORIZED_EDITORIAL'
  | 'COMPANY_BRAND_REFRESH';

export type OwnershipRequestStatus =
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'FLAGGED';

export type AbuseReportStatus =
  | 'OPEN'
  | 'INVESTIGATING'
  | 'RESOLVED'
  | 'DISMISSED';

export interface ExifData {
  make?: string;
  model?: string;
  software?: string;
  dateTimeOriginal?: string;
  modifyDate?: string;
  exposureTime?: string;
  fNumber?: number;
  iso?: number;
  focalLength?: string;
  lensModel?: string;
  gps?: {
    latitude?: number;
    longitude?: number;
  };
}

export interface C2paProvenance {
  hasC2paManifest: boolean;
  issuer?: string;
  claimGenerator?: string;
  signatureValid?: boolean;
  assertions?: Array<{
    label: string;
    data: any;
  }>;
}

export interface AiProvenanceDisclosure {
  isAiGeneratedOrAssisted: boolean;
  confidence: number; // 0 to 1
  disclosureSource: 'METADATA_IPTC' | 'XMP' | 'EXIF_SOFTWARE' | 'USER_DECLARED' | 'HEURISTIC' | 'NONE';
  detectedGenerators: string[];
  declarationNotes?: string;
}

export interface WatermarkDetection {
  detectedVisibleWatermark: boolean;
  confidence: number;
  patternType?: 'TEXT_STAMP' | 'CORNER_BADGE' | 'DIAGONAL_TILED' | 'STOCK_OVERLAY';
  textDetected?: string;
}

export interface DocumentProperties {
  author?: string;
  title?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modDate?: string;
  pageCount?: number;
  isEncrypted: boolean;
  hasDigitalSignature: boolean;
}

export interface MediaProperties {
  durationSec?: number;
  codec?: string;
  bitrateKbps?: number;
  audioChannels?: number;
  sampleRateHz?: number;
  copyrightNotice?: string;
}

export interface MetadataInspectionReport {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  sha256Hash: string;
  timestamp: number;
  riskRating: AuthenticityRiskRating;
  authenticityExplanation: string;
  exif: ExifData;
  c2pa: C2paProvenance;
  aiDisclosure: AiProvenanceDisclosure;
  watermark: WatermarkDetection;
  document: DocumentProperties;
  media: MediaProperties;
  rawTags: Record<string, any>;
}

export interface AiDisclosureOptions {
  tier: AiDisclosureTier;
  generatorName: string;
  promptSummary?: string;
  authorName?: string;
  embedVisibleBadge: boolean;
  embedXmpIptcMetadata: boolean;
}

export interface WatermarkApplyOptions {
  type: 'text' | 'image';
  text?: string;
  fontSize?: number;
  fontColor?: string;
  opacity: number; // 0.05 to 1.0
  rotation?: number; // -90 to 90
  position: WatermarkPosition;
  imageStorageKey?: string;
  imageBase64?: string;
  scale?: number;
}

export interface OwnershipVerificationRequest {
  id: string;
  fileHash: string;
  fileName: string;
  fileSizeBytes: number;
  storageKey: string;
  userId: string;
  userEmail: string;
  reasonCode: OwnershipReasonCode;
  ownershipProofDescription: string;
  proofDocumentUrl?: string;
  legalDeclarationSigned: boolean;
  declarationSignerName: string;
  declarationTimestamp: number;
  ipAddress: string;
  status: OwnershipRequestStatus;
  adminNotes?: string;
  creditCost: number;
  createdAt: number;
  updatedAt: number;
}

export interface AbuseReport {
  id: string;
  reporterEmail: string;
  targetFileHash: string;
  reason:
    | 'UNAUTHORIZED_COPYRIGHT_INFRINGEMENT'
    | 'CIRCUMVENTION_ATTEMPT'
    | 'DECEPTIVE_PROVENANCE_STRIPPING'
    | 'OTHER';
  details: string;
  status: AbuseReportStatus;
  createdAt: number;
}

export interface WatermarkAuditRecord {
  id: string;
  timestamp: number;
  action:
    | 'INSPECTION'
    | 'WATERMARK_APPLIED'
    | 'DISCLOSURE_EMBEDDED'
    | 'VERIFIED_OWNERSHIP_REMOVAL'
    | 'REQUEST_SUBMITTED'
    | 'REQUEST_REVIEWED';
  fileHash: string;
  userId?: string;
  ipAddress?: string;
  reasonCode?: string;
  legalSignature?: string;
  details?: Record<string, any>;
}

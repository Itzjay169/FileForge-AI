export type FileCategory =
  | 'documents'
  | 'spreadsheets'
  | 'presentations'
  | 'images'
  | 'video'
  | 'audio'
  | 'code'
  | 'archives'
  | 'executables'
  | 'databases'
  | 'fonts'
  | 'cad3d';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RequiredProcessor =
  | 'SHARP'
  | 'FFMPEG'
  | 'LIBREOFFICE'
  | 'PANDOC'
  | 'GHOSTSCRIPT'
  | 'P7ZIP'
  | 'THREEJS'
  | 'INTERNAL_PARSER'
  | 'ISOLATED_CONTAINER'
  | 'UNSUPPORTED';

export type ConversionLossWarning = {
  warningTitle: string;
  lostAttributes: string[];
  recommendation: string;
  isLossy: boolean;
};

export interface FileFormatDefinition {
  extension: string; // e.g. "docx", without leading dot
  name: string;
  category: FileCategory;
  mimeTypes: string[];
  magicBytes?: string[]; // hex signatures e.g. ["504B0304"]
  description: string;
  uploadAllowed: boolean;
  previewSupported: boolean;
  compressionSupported: boolean;
  conversionTargets: string[]; // target extensions
  lossWarnings?: Record<string, ConversionLossWarning>; // key: targetExtension
  riskLevel: RiskLevel;
  requiredProcessor: RequiredProcessor;
  isBinary: boolean;
  maxFreeSizeBytes: number; // default limit for free tier
  requiresPremiumWorker: boolean;
  supportedOptimizations: Array<
    | 'lossless'
    | 'lossy'
    | 'resize'
    | 'downsample'
    | 'remove-metadata'
    | 'color-quantization'
    | 'transcode'
    | 'strip-audio'
    | 'pdf-linearize'
    | 'compress-streams'
  >;
}

export interface CategoryInfo {
  id: FileCategory;
  label: string;
  description: string;
  iconName: string;
  badgeColor: string;
}

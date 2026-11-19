import {
  FileCategory,
  FileFormatDefinition,
  CompressionStrength,
  CategoryInfo
} from '@fileforge/shared';
import { FILE_CATEGORIES } from './categories';
import { FILE_FORMAT_DEFINITIONS } from './formats';

export class FileRegistryService {
  private static instance: FileRegistryService;
  private readonly formats: Map<string, FileFormatDefinition>;

  private constructor() {
    this.formats = new Map();
    for (const [key, format] of Object.entries(FILE_FORMAT_DEFINITIONS)) {
      this.formats.set(key.toLowerCase(), format);
    }
  }

  public static getInstance(): FileRegistryService {
    if (!FileRegistryService.instance) {
      FileRegistryService.instance = new FileRegistryService();
    }
    return FileRegistryService.instance;
  }

  public getFormat(extension: string): FileFormatDefinition | null {
    const cleanExt = extension.replace(/^\./, '').toLowerCase().trim();
    return this.formats.get(cleanExt) || null;
  }

  public getAllFormats(): FileFormatDefinition[] {
    return Array.from(this.formats.values());
  }

  public getCategories(): CategoryInfo[] {
    return Object.values(FILE_CATEGORIES);
  }

  public getCategory(category: FileCategory): CategoryInfo | null {
    return FILE_CATEGORIES[category] || null;
  }

  public getFormatsByCategory(category: FileCategory): FileFormatDefinition[] {
    return this.getAllFormats().filter((f) => f.category === category);
  }

  public searchFormats(query?: string, category?: FileCategory): FileFormatDefinition[] {
    let results = this.getAllFormats();

    if (category) {
      results = results.filter((f) => f.category === category);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim().replace(/^\./, '');
      results = results.filter(
        (f) =>
          f.extension.toLowerCase().includes(q) ||
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.mimeTypes.some((m) => m.toLowerCase().includes(q))
      );
    }

    return results;
  }

  public canConvert(
    sourceExt: string,
    targetExt: string
  ): {
    allowed: boolean;
    isLossy: boolean;
    warning?: string;
    lostAttributes?: string[];
    recommendation?: string;
  } {
    const source = this.getFormat(sourceExt);
    const target = this.getFormat(targetExt);

    if (!source || !target) {
      return {
        allowed: false,
        isLossy: false,
        warning: 'Unsupported file extension provided.'
      };
    }

    const cleanTarget = target.extension.toLowerCase();
    const isTargetAllowed = source.conversionTargets.map((t) => t.toLowerCase()).includes(cleanTarget);

    if (!isTargetAllowed) {
      return {
        allowed: false,
        isLossy: false,
        warning: `Direct conversion from .${source.extension} to .${target.extension} is not supported. Try converting to a common intermediate format such as PDF or PNG.`
      };
    }

    const lossWarning = source.lossWarnings?.[cleanTarget];
    if (lossWarning) {
      return {
        allowed: true,
        isLossy: lossWarning.isLossy,
        warning: lossWarning.warningTitle,
        lostAttributes: lossWarning.lostAttributes,
        recommendation: lossWarning.recommendation
      };
    }

    return {
      allowed: true,
      isLossy: false
    };
  }

  public getAvailableConversions(sourceExt: string): Array<{
    target: FileFormatDefinition;
    isLossy: boolean;
    warning?: string;
  }> {
    const source = this.getFormat(sourceExt);
    if (!source) return [];

    const results: Array<{
      target: FileFormatDefinition;
      isLossy: boolean;
      warning?: string;
    }> = [];

    for (const targetExt of source.conversionTargets) {
      const target = this.getFormat(targetExt);
      if (target) {
        const lossWarning = source.lossWarnings?.[targetExt.toLowerCase()];
        results.push({
          target,
          isLossy: !!lossWarning?.isLossy,
          warning: lossWarning?.warningTitle
        });
      }
    }

    return results;
  }

  public validateFileSignature(extension: string, hexSignature: string): boolean {
    const format = this.getFormat(extension);
    if (!format || !format.magicBytes || format.magicBytes.length === 0) {
      // If no magic byte registered, pass validation to secondary scanners
      return true;
    }

    const upperHex = hexSignature.toUpperCase().replace(/\s+/g, '');
    return format.magicBytes.some((sig) => upperHex.startsWith(sig.toUpperCase()));
  }

  public estimateSavings(
    extension: string,
    originalSizeBytes: number,
    strength: CompressionStrength = 'BALANCED',
    quality: number = 80
  ): {
    estimatedSizeBytes: number;
    savedBytes: number;
    savingsPercent: number;
    estimatedDurationSec: number;
  } {
    const format = this.getFormat(extension);
    if (!format || !format.compressionSupported) {
      return {
        estimatedSizeBytes: originalSizeBytes,
        savedBytes: 0,
        savingsPercent: 0,
        estimatedDurationSec: 1
      };
    }

    // Realistic factor model based on category & strength
    let baseRatio = 0.5; // 50% reduction average
    switch (format.category) {
      case 'images':
        baseRatio = 0.4 + (100 - quality) * 0.004; // up to 80% reduction for quality 0
        break;
      case 'video':
        baseRatio = 0.45;
        break;
      case 'audio':
        baseRatio = 0.35;
        break;
      case 'documents':
        baseRatio = 0.55;
        break;
      case 'code':
      case 'spreadsheets':
        baseRatio = 0.65;
        break;
      case 'archives':
        baseRatio = 0.15; // Already compressed
        break;
      default:
        baseRatio = 0.4;
    }

    // Strength modifiers
    const strengthMultiplier: Record<CompressionStrength, number> = {
      LOW: 0.5,
      BALANCED: 1.0,
      HIGH: 1.3,
      EXTREME: 1.6,
      CUSTOM: Math.max(0.2, (100 - quality) / 50)
    };

    const effectiveReduction = Math.min(0.92, Math.max(0.05, baseRatio * (strengthMultiplier[strength] || 1.0)));
    const savedBytes = Math.floor(originalSizeBytes * effectiveReduction);
    const estimatedSizeBytes = Math.max(512, originalSizeBytes - savedBytes);
    const savingsPercent = Math.round((savedBytes / originalSizeBytes) * 100);

    // Duration calculation based on size & processor
    const mb = originalSizeBytes / (1024 * 1024);
    let secondsPerMb = 0.2;
    if (format.category === 'video') secondsPerMb = 1.2;
    if (format.category === 'cad3d') secondsPerMb = 0.8;
    const estimatedDurationSec = Math.max(1, Math.round(mb * secondsPerMb) + 1);

    return {
      estimatedSizeBytes,
      savedBytes,
      savingsPercent,
      estimatedDurationSec
    };
  }
}

export const fileRegistry = FileRegistryService.getInstance();

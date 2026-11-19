import { fileRegistry } from '@fileforge/file-registry';
import { FileFormatDefinition } from '@fileforge/shared';

export type ConversionEngineType =
  | 'sharp'
  | 'libreoffice'
  | 'ffmpeg'
  | 'jszip'
  | 'data_parser'
  | 'pdf_tools'
  | 'mesh_tools'
  | 'font_tools';

export interface ConversionRoute {
  sourceExt: string;
  targetExt: string;
  engine: ConversionEngineType;
  engineDisplayName: string;
  isLossy: boolean;
  lostAttributes: string[];
  warningTitle?: string;
  warningDescription?: string;
  recommendation?: string;
  requiresDedicatedWorker: boolean;
  isSupportedDirectly: boolean;
}

/**
 * Universal Conversion Matrix
 * Computes exact engine routes, capability flags, and lossiness warnings
 * for cross-format transformations across all 12 categories.
 */
export class ConversionMatrix {
  private static instance: ConversionMatrix;

  private constructor() {}

  public static getInstance(): ConversionMatrix {
    if (!ConversionMatrix.instance) {
      ConversionMatrix.instance = new ConversionMatrix();
    }
    return ConversionMatrix.instance;
  }

  /**
   * Determine the conversion route and feasibility between two extensions
   */
  public getRoute(sourceExt: string, targetExt: string): ConversionRoute {
    const s = sourceExt.toLowerCase().replace(/^\./, '');
    const t = targetExt.toLowerCase().replace(/^\./, '');

    const sourceFormat = fileRegistry.getFormat(s);
    const targetFormat = fileRegistry.getFormat(t);

    if (!sourceFormat || !targetFormat) {
      return {
        sourceExt: s,
        targetExt: t,
        engine: 'data_parser',
        engineDisplayName: 'Unknown',
        isLossy: true,
        lostAttributes: ['Format unverified'],
        warningTitle: 'Unrecognized Format',
        warningDescription: `One of the extensions (.${s} or .${t}) is not registered in FileForge AI.`,
        requiresDedicatedWorker: true,
        isSupportedDirectly: false
      };
    }

    // Check fileRegistry canConvert logic
    const registryCheck = fileRegistry.canConvert(s, t);
    const isDirectlyAllowed = registryCheck.allowed;

    const sourceCat = sourceFormat.category;
    const targetCat = targetFormat.category;

    // 1. Image to Image
    if (sourceCat === 'images' && targetCat === 'images') {
      const isVectorToRaster = s === 'svg' && ['png', 'jpg', 'jpeg', 'webp', 'avif', 'ico', 'tiff'].includes(t);
      const isLossyFormat = ['jpg', 'jpeg', 'webp', 'avif'].includes(t);

      return {
        sourceExt: s,
        targetExt: t,
        engine: 'sharp',
        engineDisplayName: 'Sharp High-Fidelity Pixel Engine',
        isLossy: registryCheck.isLossy || isVectorToRaster || (isLossyFormat && s === 'png'),
        lostAttributes: registryCheck.lostAttributes || (isVectorToRaster ? ['Infinite scalability (vector paths)'] : []),
        warningTitle: registryCheck.warning || (isVectorToRaster ? 'Vector Rasterization' : undefined),
        warningDescription: isVectorToRaster
          ? 'Vector paths will be rasterized to a fixed pixel grid. Scalability will be limited.'
          : registryCheck.warning,
        recommendation: registryCheck.recommendation,
        requiresDedicatedWorker: false,
        isSupportedDirectly: true
      };
    }

    // 2. Video & Audio
    if (sourceCat === 'video' || sourceCat === 'audio') {
      const isAudioExtraction = sourceCat === 'video' && targetCat === 'audio';
      const isVideoToGif = sourceCat === 'video' && t === 'gif';

      return {
        sourceExt: s,
        targetExt: t,
        engine: 'ffmpeg',
        engineDisplayName: 'FFmpeg Transcoding Pipeline',
        isLossy: true,
        lostAttributes: isAudioExtraction
          ? ['Video stream', 'Visual frames', 'Subtitles']
          : isVideoToGif
          ? ['Audio track', 'Full 24-bit color depth (reduced to 256 colors)']
          : ['Bitrate quantization'],
        warningTitle: isAudioExtraction
          ? 'Audio Extraction Only'
          : isVideoToGif
          ? 'Color & Audio Reduction'
          : 'Lossy Video Compression',
        warningDescription: isAudioExtraction
          ? 'All video imagery will be discarded. Only the audio soundtrack will be preserved.'
          : isVideoToGif
          ? 'GIF formats do not support audio tracks and only support 256 palette colors.'
          : 'Transcoding between video codecs introduces generational compression loss.',
        requiresDedicatedWorker: true,
        isSupportedDirectly: true
      };
    }

    // 3. Documents & Presentations
    if (sourceCat === 'documents' || sourceCat === 'presentations') {
      const isDocToPdf = t === 'pdf';
      const isDocToText = ['txt', 'md'].includes(t);

      return {
        sourceExt: s,
        targetExt: t,
        engine: isDocToPdf ? 'pdf_tools' : 'libreoffice',
        engineDisplayName: isDocToPdf ? 'Ghostscript & PDF Tooling' : 'LibreOffice Headless Engine',
        isLossy: isDocToText || (!isDocToPdf && s === 'pdf'),
        lostAttributes: isDocToText
          ? ['Visual layouts', 'Embedded fonts', 'Tables', 'Graphics']
          : s === 'pdf' && t === 'docx'
          ? ['Exact glyph kerning', 'Complex vector shapes']
          : [],
        warningTitle: isDocToText
          ? 'Layout and Formatting Loss'
          : s === 'pdf'
          ? 'PDF Reflow Approximation'
          : undefined,
        warningDescription: isDocToText
          ? 'Converting formatted documents to plain text strips all typography, tables, and media.'
          : 'Converting fixed-layout PDFs into editable documents uses algorithmic reflow and may shift margins.',
        requiresDedicatedWorker: !isDocToPdf,
        isSupportedDirectly: isDirectlyAllowed
      };
    }

    // 4. Spreadsheets
    if (sourceCat === 'spreadsheets') {
      const isFlatTarget = ['csv', 'tsv', 'json'].includes(t);
      const isComplexSource = ['xlsx', 'xls', 'xlsm', 'ods'].includes(s);

      return {
        sourceExt: s,
        targetExt: t,
        engine: 'data_parser',
        engineDisplayName: 'Tabular Data Stream Engine',
        isLossy: isComplexSource && isFlatTarget,
        lostAttributes: isComplexSource && isFlatTarget
          ? ['Formulas and functions', 'Cell formatting / colors', 'Multiple sheets (only active sheet preserved)', 'Macros']
          : [],
        warningTitle: isComplexSource && isFlatTarget ? 'Multi-Sheet & Formula Stripping' : undefined,
        warningDescription: isComplexSource && isFlatTarget
          ? 'CSV and TSV formats cannot store formulas, cell colors, or secondary workbook tabs.'
          : undefined,
        requiresDedicatedWorker: false,
        isSupportedDirectly: true
      };
    }

    // 5. Code & Structured Data
    if (sourceCat === 'code' || sourceCat === 'databases') {
      return {
        sourceExt: s,
        targetExt: t,
        engine: 'data_parser',
        engineDisplayName: 'Structured Schema Transformer',
        isLossy: false,
        lostAttributes: [],
        requiresDedicatedWorker: false,
        isSupportedDirectly: isDirectlyAllowed
      };
    }

    // 6. Archives
    if (sourceCat === 'archives') {
      return {
        sourceExt: s,
        targetExt: t,
        engine: 'jszip',
        engineDisplayName: 'JSZip Container Repacker',
        isLossy: false,
        lostAttributes: [],
        requiresDedicatedWorker: false,
        isSupportedDirectly: ['zip', 'tar', 'gz'].includes(t)
      };
    }

    // 7. 3D & CAD Models
    if (sourceCat === 'cad3d') {
      const isStl = t === 'stl';
      return {
        sourceExt: s,
        targetExt: t,
        engine: 'mesh_tools',
        engineDisplayName: 'Three.js / OpenCASCADE Mesh Engine',
        isLossy: isStl,
        lostAttributes: isStl ? ['UV texture maps', 'Material definitions (.mtl)', 'Vertex colors', 'Rigging bones'] : [],
        warningTitle: isStl ? 'Material & Texture Stripping' : undefined,
        warningDescription: isStl
          ? 'STL files only store raw geometric triangle facets. All textures, materials, and colors will be lost.'
          : undefined,
        requiresDedicatedWorker: true,
        isSupportedDirectly: isDirectlyAllowed
      };
    }

    // Default fallback
    return {
      sourceExt: s,
      targetExt: t,
      engine: 'data_parser',
      engineDisplayName: 'Universal Pipeline',
      isLossy: registryCheck.isLossy,
      lostAttributes: registryCheck.lostAttributes || [],
      warningTitle: registryCheck.warning,
      requiresDedicatedWorker: true,
      isSupportedDirectly: isDirectlyAllowed
    };
  }

  /**
   * Get all verified and feasible conversion targets for a source file format
   */
  public getAvailableTargets(sourceExt: string): Array<{
    target: FileFormatDefinition;
    route: ConversionRoute;
  }> {
    const s = sourceExt.toLowerCase().replace(/^\./, '');
    const sourceFormat = fileRegistry.getFormat(s);
    if (!sourceFormat) return [];

    const targets: Array<{
      target: FileFormatDefinition;
      route: ConversionRoute;
    }> = [];

    for (const targetExt of sourceFormat.conversionTargets) {
      const targetFormat = fileRegistry.getFormat(targetExt);
      if (targetFormat) {
        const route = this.getRoute(s, targetExt);
        targets.push({
          target: targetFormat,
          route
        });
      }
    }

    return targets;
  }
}

export const conversionMatrix = ConversionMatrix.getInstance();

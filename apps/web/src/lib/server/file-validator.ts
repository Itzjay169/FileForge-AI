import { fileRegistry } from '@fileforge/file-registry';
import { RiskLevel } from '@fileforge/shared';

export interface FileValidationResult {
  valid: boolean;
  sanitizedName: string;
  detectedExtension: string;
  mimeType: string;
  sizeBytes: number;
  riskLevel: RiskLevel;
  error?: string;
  securityNotice?: string;
}

export function sanitizeFilename(filename: string): string {
  // Remove control characters, path traversal sequences, and dangerous chars
  const baseName = filename.replace(/^.*[\\\/]/, ''); // Strip directory path
  const sanitized = baseName
    .replace(/[^\w\.\-\s\(\)\[\]]/gi, '_') // Replace unusual chars with underscore
    .replace(/\.{2,}/g, '.') // Prevent double dots
    .trim();

  return sanitized || 'unnamed-file';
}

export function validateFileBuffer(
  buffer: Buffer,
  originalFilename: string,
  declaredMimeType: string,
  maxSizeBytes: number = 2 * 1024 * 1024 * 1024 // 2 GB
): FileValidationResult {
  const sizeBytes = buffer.length;

  if (sizeBytes === 0) {
    return {
      valid: false,
      sanitizedName: originalFilename,
      detectedExtension: '',
      mimeType: declaredMimeType,
      sizeBytes: 0,
      riskLevel: 'LOW',
      error: 'Uploaded file is completely empty (0 bytes).'
    };
  }

  if (sizeBytes > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
    return {
      valid: false,
      sanitizedName: originalFilename,
      detectedExtension: '',
      mimeType: declaredMimeType,
      sizeBytes,
      riskLevel: 'HIGH',
      error: `File size (${(sizeBytes / (1024 * 1024)).toFixed(1)} MB) exceeds maximum allowed limit of ${maxMb} MB.`
    };
  }

  const sanitizedName = sanitizeFilename(originalFilename);
  const parts = sanitizedName.split('.');
  const ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';

  const format = fileRegistry.getFormat(ext);
  if (!format) {
    return {
      valid: false,
      sanitizedName,
      detectedExtension: ext,
      mimeType: declaredMimeType,
      sizeBytes,
      riskLevel: 'HIGH',
      error: `The file extension .${ext || 'unknown'} is not supported or recognized.`
    };
  }

  // Magic byte inspection (read first 16 bytes)
  const headerHex = buffer.subarray(0, 16).toString('hex').toUpperCase();

  // 1. ClamAV / Malware Signature Scan (Run first)
  const eicarString = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';
  if (buffer.includes(Buffer.from(eicarString))) {
    return {
      valid: false,
      sanitizedName,
      detectedExtension: ext,
      mimeType: declaredMimeType,
      sizeBytes,
      riskLevel: 'CRITICAL',
      error: 'Security Alert: Malware threat detected in file (EICAR signature). Quarantine action taken.'
    };
  }

  // 2. Disguised Executable Check (MZ header for Windows PE, or ELF header for Linux)
  if (headerHex.startsWith('4D5A') && ext !== 'exe' && ext !== 'dll') {
    return {
      valid: false,
      sanitizedName,
      detectedExtension: 'exe',
      mimeType: 'application/x-msdownload',
      sizeBytes,
      riskLevel: 'CRITICAL',
      error: 'Security Alert: Executable signature (MZ header) disguised with an incompatible extension. Upload quarantined.'
    };
  }

  if (headerHex.startsWith('7F454C46') && ext !== 'so' && ext !== 'bin') {
    return {
      valid: false,
      sanitizedName,
      detectedExtension: 'so',
      mimeType: 'application/x-sharedlib',
      sizeBytes,
      riskLevel: 'CRITICAL',
      error: 'Security Alert: Executable Linux ELF binary signature detected in non-binary file format. Upload blocked.'
    };
  }

  // 3. SVG script injection scan
  if (ext === 'svg' || declaredMimeType === 'image/svg+xml') {
    const textContent = buffer.toString('utf-8', 0, Math.min(buffer.length, 50000)).toLowerCase();
    if (
      textContent.includes('<script') ||
      textContent.includes('onload=') ||
      textContent.includes('onerror=') ||
      textContent.includes('javascript:')
    ) {
      return {
        valid: false,
        sanitizedName,
        detectedExtension: 'svg',
        mimeType: 'image/svg+xml',
        sizeBytes,
        riskLevel: 'CRITICAL',
        error: 'Security Alert: SVG file contains embedded executable script tags or event handlers. Upload rejected.'
      };
    }
  }

  // 4. Validate declared signature matches format definition
  const isSignatureValid = fileRegistry.validateFileSignature(ext, headerHex);
  if (!isSignatureValid) {
    return {
      valid: false,
      sanitizedName,
      detectedExtension: ext,
      mimeType: declaredMimeType,
      sizeBytes,
      riskLevel: 'HIGH',
      error: `File header signature (${headerHex.slice(0, 8)}) does not match expected signature for .${ext}. The file may be corrupted.`
    };
  }

  return {
    valid: true,
    sanitizedName,
    detectedExtension: ext,
    mimeType: format.mimeTypes[0] || declaredMimeType,
    sizeBytes,
    riskLevel: format.riskLevel,
    securityNotice: format.riskLevel === 'CRITICAL' ? 'This file type is strictly quarantined in ephemeral isolation.' : undefined
  };
}

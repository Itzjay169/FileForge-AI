import { validateUrlForSsrf } from '../ssrf-guard';
import { validateFileBuffer } from '../file-validator';
import { storageService } from '../storage-service';
import { compressionEngine } from '../compression-engine';
import sharp from 'sharp';
import JSZip from 'jszip';

async function runTests() {
  console.log('⚡ Starting Phase 2 Engine & Security Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  // ---------------------------------------------------------
  // 1. SSRF Guard Security Tests
  // ---------------------------------------------------------
  console.log('--- 1. Testing SSRF Guard ---');
  try {
    const loopback = await validateUrlForSsrf('http://127.0.0.1:8080/secret');
    assert(!loopback.isValid, 'Blocks 127.0.0.1 loopback access');
  } catch {
    assert(true, 'Blocks loopback access via exception');
  }

  try {
    const awsMetadata = await validateUrlForSsrf('http://169.254.169.254/latest/meta-data/');
    assert(!awsMetadata.isValid, 'Blocks AWS/Cloud metadata IP (169.254.169.254)');
  } catch {
    assert(true, 'Blocks AWS metadata IP via exception');
  }

  try {
    const privateIp = await validateUrlForSsrf('http://192.168.1.1/admin');
    assert(!privateIp.isValid, 'Blocks private subnet 192.168.x.x');
  } catch {
    assert(true, 'Blocks 192.168.x.x');
  }

  try {
    const localhost = await validateUrlForSsrf('http://localhost:3000');
    assert(!localhost.isValid, 'Blocks localhost domain');
  } catch {
    assert(true, 'Blocks localhost domain');
  }

  try {
    const badScheme = await validateUrlForSsrf('file:///etc/passwd');
    assert(!badScheme.isValid, 'Rejects non-HTTP(S) scheme file://');
  } catch {
    assert(true, 'Rejects file://');
  }

  // ---------------------------------------------------------
  // 2. File Validator & Malware Scanner Tests
  // ---------------------------------------------------------
  console.log('\n--- 2. Testing File Validator & Malware Scanner ---');

  // EICAR simulated malware signature test
  const eicarBuffer = Buffer.from('X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*');
  const eicarResult = validateFileBuffer(eicarBuffer, 'test.txt', 'text/plain');
  assert(!eicarResult.valid && Boolean(eicarResult.error?.toLowerCase().includes('malware') || eicarResult.error?.toLowerCase().includes('threat')), 'Blocks EICAR malware test signature');

  // Disguised executable (.exe renamed to .jpg)
  const fakeJpgExe = Buffer.from('MZ\x90\x00\x03\x00\x00\x00fake executable content');
  const fakeJpgResult = validateFileBuffer(fakeJpgExe, 'photo.jpg', 'image/jpeg');
  assert(!fakeJpgResult.valid && Boolean(fakeJpgResult.error?.toLowerCase().includes('executable')), 'Detects MZ executable disguised as JPG');

  // Disguised ELF Linux binary
  const fakePngElf = Buffer.from('\x7FELFfake binary content');
  const fakeElfResult = validateFileBuffer(fakePngElf, 'graphic.png', 'image/png');
  assert(!fakeElfResult.valid && Boolean(fakeElfResult.error?.toLowerCase().includes('executable')), 'Detects ELF binary disguised as PNG');

  // SVG script injection / XSS prevention
  const maliciousSvg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><circle r="10"/></svg>');
  const svgResult = validateFileBuffer(maliciousSvg, 'logo.svg', 'image/svg+xml');
  assert(!svgResult.valid && Boolean(svgResult.error?.toLowerCase().includes('script')), 'Detects and blocks script injection inside SVG');

  // Legitimate file sanitization
  const safeText = Buffer.from('Hello FileForge AI! This is a clean test document.');
  const safeResult = validateFileBuffer(safeText, 'my doc.txt', 'text/plain');
  assert(safeResult.valid, 'Validates safe text document');

  // ---------------------------------------------------------
  // 3. Storage Service & Signed URLs Tests
  // ---------------------------------------------------------
  console.log('\n--- 3. Testing Storage Service & HMAC Signed URLs ---');

  const filePayload = Buffer.from('FileForge secure storage test payload');
  const saved = await storageService.saveFile(filePayload, 'test-asset.txt', 'txt');
  assert(Boolean(saved.storageKey), 'Successfully persists buffer to storageKey: ' + saved.storageKey);

  const retrieved = await storageService.getFileBuffer(saved.storageKey);
  assert(retrieved.toString('utf8') === filePayload.toString('utf8'), 'Retrieved buffer matches original content');

  const signedUrl = storageService.generateSignedDownloadUrl(saved.storageKey, 3600);
  assert(signedUrl.includes('/api/files/download?key=') && signedUrl.includes('&sig='), 'Generates HMAC signed URL');

  const urlParams = new URL(signedUrl, 'http://localhost:3000').searchParams;
  const key = urlParams.get('key') || '';
  const expires = parseInt(urlParams.get('expires') || '0', 10);
  const sig = urlParams.get('sig') || '';

  const isValidSig = storageService.verifySignedUrl(key, expires, sig);
  assert(isValidSig, 'HMAC signature verifies successfully with valid key & expiration');

  const isTamperedSig = storageService.verifySignedUrl(key + 'tampered', expires, sig);
  assert(!isTamperedSig, 'Rejects tampered storage key');

  const isExpiredSig = storageService.verifySignedUrl(key, Math.floor(Date.now() / 1000) - 100, sig);
  assert(!isExpiredSig, 'Rejects expired signature timestamp');

  // ---------------------------------------------------------
  // 4. Real Compression Engine Tests
  // ---------------------------------------------------------
  console.log('\n--- 4. Testing Compression Engine ---');

  // A. Image Compression: Sharp 1000x1000 PNG -> WebP (Quality 75)
  console.log('Generating test image (1000x1000 uncompressed PNG)...');
  const samplePngBuffer = await sharp({
    create: {
      width: 1000,
      height: 1000,
      channels: 4,
      background: { r: 139, g: 92, b: 246, alpha: 1 }
    }
  }).png({ compressionLevel: 0 }).toBuffer();

  console.log(`Original image size: ${(samplePngBuffer.length / 1024).toFixed(1)} KB`);

  const imgJob = await compressionEngine.compress({
    buffer: samplePngBuffer,
    originalName: 'forge-art.png',
    extension: 'png',
    mimeType: 'image/png',
    options: {
      strength: 'BALANCED',
      preset: 'SMART_COMPRESS',
      quality: 75,
      stripMetadata: true
    }
  });

  assert(imgJob.outputFormat === 'webp', `Converted PNG to recommended WebP format (got ${imgJob.outputFormat})`);
  assert(imgJob.savingsPercentage > 50, `Image reduced by ${imgJob.savingsPercentage}% (>50% expected)`);
  assert(Boolean(imgJob.sha256Hash), 'Output has valid SHA-256 fingerprint: ' + imgJob.sha256Hash.slice(0, 16) + '...');
  assert(Boolean(imgJob.previewUrl?.startsWith('data:image/webp')), 'Generates live base64 WebP preview URI');

  // B. Code / Text Compression
  const unminifiedCode = `
    function calculateForgeMetric(a, b, c) {
      // Extensive comment block explaining algorithm
      const intermediateAlpha = a * 100.523;
      const intermediateBeta = b / 2.5;
      /* Multi-line comment block
         describing edge cases */
      return intermediateAlpha + intermediateBeta + c;
    }
    const sampleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  `.repeat(10);

  const codeBuffer = Buffer.from(unminifiedCode, 'utf8');
  const codeJob = await compressionEngine.compress({
    buffer: codeBuffer,
    originalName: 'algorithm.js',
    extension: 'js',
    mimeType: 'text/javascript',
    options: {
      strength: 'HIGH',
      preset: 'WEB_OPTIMIZED',
      quality: 85,
      stripMetadata: true
    }
  });

  assert(codeJob.savingsPercentage > 0, `Code minification reduced size by ${codeJob.savingsPercentage}%`);

  // C. Archive Compression Test
  const testFilesToArchive = [
    { name: 'file1.txt', content: 'Sample text content '.repeat(50) },
    { name: 'file2.json', content: JSON.stringify({ item: 'forge', count: 42 }) }
  ];
  const zip = new JSZip();
  testFilesToArchive.forEach(f => zip.file(f.name, f.content));
  const sampleZipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'STORE' });

  const archiveJob = await compressionEngine.compress({
    buffer: sampleZipBuffer,
    originalName: 'bundle.zip',
    extension: 'zip',
    mimeType: 'application/zip',
    options: {
      strength: 'EXTREME',
      preset: 'SMART_COMPRESS',
      quality: 90,
      stripMetadata: true
    }
  });

  assert(archiveJob.savingsPercentage > 0, `Archive re-compression reduced size by ${archiveJob.savingsPercentage}%`);

  // ---------------------------------------------------------
  // Summary
  // ---------------------------------------------------------
  console.log('\n=============================================');
  console.log(`Phase 2 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});

import sharp from 'sharp';
import crypto from 'crypto';
import { metadataInspectorEngine } from '../metadata-inspector-engine';
import { watermarkTransparencyEngine } from '../watermark-transparency-engine';
import { complianceStore } from '../compliance-store-service';

async function runPhase5Tests() {
  console.log('⚡ Starting Phase 5: AI Content, Provenance & Watermark Transparency Test Suite...\n');
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

  // Helper to create test PNG image
  async function createTestPng(width = 200, height = 150): Promise<Buffer> {
    return sharp({
      create: {
        width,
        height,
        channels: 3,
        background: { r: 35, g: 45, b: 60 }
      }
    }).png().toBuffer();
  }

  // Helper to create minimal test PDF
  function createTestPdf(title = 'Confidential Report'): Buffer {
    const stream = `BT /F1 12 Tf 72 712 Td (${title}) Tj ET`;
    const body = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n5 0 obj\n<< /Title (${title}) /Author (FileForge Creator) /Creator (FileForge Studio) >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000206 00000 n \n0000000290 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R /Info 5 0 R >>\nstartxref\n380\n%%EOF`;
    return Buffer.from(body, 'utf-8');
  }

  // ---------------------------------------------------------
  // 1. Metadata & EXIF Inspector Engine Tests
  // ---------------------------------------------------------
  console.log('--- 1. Testing Metadata & Provenance Inspector ---');

  const baseImage = await createTestPng(300, 200);
  const baseReport = await metadataInspectorEngine.inspectFile(baseImage, 'photo.png', 'image/png');

  assert(baseReport.rawTags.width === 300 && baseReport.rawTags.height === 200, 'Extracts image dimensions accurately');
  assert(Boolean(baseReport.sha256Hash && baseReport.sha256Hash.length === 64), 'Computes cryptographic SHA-256 fingerprint');
  assert(baseReport.riskRating === 'UNPROTECTED_STANDARD', 'Classifies standard image as UNPROTECTED_STANDARD');

  // Test AI Generative Metadata Detection (Midjourney / IPTC trainedAlgorithmicMedia)
  const aiTaggedBuffer = Buffer.concat([
    baseImage,
    Buffer.from('XMP: <dc:description>Prompt: cyberpunk city</dc:description> Software: Midjourney v6 trainedAlgorithmicMedia', 'utf-8')
  ]);
  const aiReport = await metadataInspectorEngine.inspectFile(aiTaggedBuffer, 'ai-art.png', 'image/png');

  assert(aiReport.aiDisclosure.isAiGeneratedOrAssisted === true, 'Detects generative AI metadata signatures');
  assert(aiReport.aiDisclosure.detectedGenerators.includes('Midjourney'), 'Identifies Midjourney generator tag');
  assert(aiReport.riskRating === 'AI_GENERATED_DISCLOSED', 'Flags asset as AI_GENERATED_DISCLOSED');

  // Test C2PA Content Credentials Manifest Detection
  const c2paBuffer = Buffer.concat([
    baseImage,
    Buffer.from('JUMBF c2pa.claim urn:c2pa:assertions:c2pa.actions', 'utf-8')
  ]);
  const c2paReport = await metadataInspectorEngine.inspectFile(c2paBuffer, 'certified.png', 'image/png');

  assert(c2paReport.c2pa.hasC2paManifest === true, 'Identifies embedded C2PA Content Credentials manifest');
  assert(c2paReport.riskRating === 'VERIFIED_GENUINE', 'Elevates trust rating to VERIFIED_GENUINE for C2PA manifest');

  // Test Visible Rights & Stock Watermark Heuristics
  const watermarkTaggedBuffer = Buffer.concat([
    baseImage,
    Buffer.from('Adobe Stock Preview Watermark Overlay (c) All Rights Reserved', 'utf-8')
  ]);
  const wmReport = await metadataInspectorEngine.inspectFile(watermarkTaggedBuffer, 'proof.jpg', 'image/jpeg');

  assert(wmReport.watermark.detectedVisibleWatermark === true, 'Detects visible stock watermark / rights marker');
  assert(wmReport.riskRating === 'POTENTIALLY_TAMPERED', 'Flags rights marker as POTENTIALLY_TAMPERED');

  // Test PDF Metadata Inspection
  const testPdf = createTestPdf('Annual Shareholder Report');
  const pdfReport = await metadataInspectorEngine.inspectFile(testPdf, 'report.pdf', 'application/pdf');

  assert(pdfReport.document.title === 'Annual Shareholder Report', 'Extracts PDF title dictionary');
  assert(pdfReport.document.author === 'FileForge Creator', 'Extracts PDF author metadata');
  assert(pdfReport.document.isEncrypted === false, 'Detects PDF encryption status');

  // ---------------------------------------------------------
  // 2. Watermarking Engine Tests
  // ---------------------------------------------------------
  console.log('\n--- 2. Testing Watermarking & AI Content Disclosure Engine ---');

  // Apply Single Text Watermark
  const wmApplied = await watermarkTransparencyEngine.applyWatermark(baseImage, 'artwork.png', {
    type: 'text',
    text: 'STUDIO PROOF • DO NOT DISTRIBUTE',
    position: 'center',
    opacity: 0.5,
    rotation: -30
  });

  assert(wmApplied.sizeBytes > 0, 'Applies single angled text watermark');
  assert(wmApplied.format === 'png', 'Preserves image container format');
  assert(Boolean(wmApplied.auditRecordId), 'Generates immutable audit trail record');

  // Apply Tiled Grid Watermark
  const tiledWm = await watermarkTransparencyEngine.applyWatermark(baseImage, 'artwork.png', {
    type: 'text',
    text: 'COPYRIGHT FILEFORGE',
    position: 'tiled',
    opacity: 0.3
  });
  assert(tiledWm.sizeBytes > 0, 'Applies repeating tiled watermark pattern grid');

  // Apply Watermark to PDF
  const pdfWm = await watermarkTransparencyEngine.applyWatermark(testPdf, 'document.pdf', {
    type: 'text',
    text: 'CONFIDENTIAL REVIEW ONLY',
    position: 'center',
    opacity: 0.4
  });
  assert(pdfWm.buffer.toString('latin1').includes('CONFIDENTIAL REVIEW ONLY'), 'Injects watermark text stream into PDF pages');

  // Embed AI Content Disclosure Badge
  const aiDisclosed = await watermarkTransparencyEngine.embedAiDisclosure(baseImage, 'concept.png', {
    tier: 'FULLY_AI_GENERATED',
    generatorName: 'Stable Diffusion XL',
    embedVisibleBadge: true,
    embedXmpIptcMetadata: true
  });
  assert(aiDisclosed.outputName.includes('ai-disclosed'), 'Exports asset with -ai-disclosed suffix');
  assert(aiDisclosed.sizeBytes > 0, 'Embeds translucent AI disclosure badge on canvas');

  // ---------------------------------------------------------
  // 3. Verified Ownership Workflow & Legal Compliance Gates
  // ---------------------------------------------------------
  console.log('\n--- 3. Testing Verified Ownership Workflow & Compliance Gates ---');

  const sampleFileHash = crypto.createHash('sha256').update(baseImage).digest('hex');

  // Create Ownership Petition
  const petition = complianceStore.createVerificationRequest({
    fileHash: sampleFileHash,
    fileName: 'original-photo.png',
    fileSizeBytes: baseImage.length,
    storageKey: '2026-11-19/test-photo.png',
    userId: 'usr_verified_artist_42',
    userEmail: 'artist@creative.studio',
    reasonCode: 'ORIGINAL_CREATOR_LOST_SOURCE',
    ownershipProofDescription: 'I am the registered copyright creator of this work with full camera raw negatives.',
    proofDocumentUrl: 'https://cdn.studio.com/proof.pdf',
    legalDeclarationSigned: true,
    declarationSignerName: 'Sarah Connor',
    declarationTimestamp: Date.now(),
    ipAddress: '203.0.113.19',
    creditCost: 10
  });

  assert(petition.status === 'PENDING_REVIEW', 'Creates ownership petition in PENDING_REVIEW state');
  assert(petition.legalDeclarationSigned === true, 'Enforces electronic legal declaration signature');

  // GATE CHECK 1: Attempt removal while status is PENDING_REVIEW (Must Fail)
  let blockedUnauthorized = false;
  try {
    await watermarkTransparencyEngine.removeWatermarkVerified(baseImage, 'original-photo.png', petition);
  } catch (err: unknown) {
    if ((err as Error).message.includes('UNAUTHORIZED_WATERMARK_REMOVAL_DENIED')) {
      blockedUnauthorized = true;
    }
  }
  assert(blockedUnauthorized, 'Strict Gate 1: Rejects watermark removal when status is not APPROVED');

  // GATE CHECK 2: Attempt removal without legal declaration (Must Fail)
  let blockedNoDeclaration = false;
  try {
    const invalidPetition = { ...petition, status: 'APPROVED' as const, legalDeclarationSigned: false };
    await watermarkTransparencyEngine.removeWatermarkVerified(baseImage, 'original-photo.png', invalidPetition);
  } catch (err: unknown) {
    if ((err as Error).message.includes('LEGAL_DECLARATION_REQUIRED')) {
      blockedNoDeclaration = true;
    }
  }
  assert(blockedNoDeclaration, 'Strict Gate 2: Rejects removal if legal declaration is uncertified');

  // Admin Reviews and Approves Petition
  const approvedPetition = complianceStore.reviewVerificationRequest(
    petition.id,
    'APPROVE',
    'Verified artist credentials and matching copyright registration number.',
    'admin_compliance_lead'
  );
  assert(approvedPetition.status === 'APPROVED', 'Admin approves ownership petition with rationale notes');

  // Execute Verified Watermark Removal for Authorized Owner
  const removalResult = await watermarkTransparencyEngine.removeWatermarkVerified(
    baseImage,
    'original-photo.png',
    approvedPetition
  );
  assert(removalResult.sizeBytes > 0, 'Executes verified reconstruction for authenticated owner');
  assert(removalResult.outputName.includes('owner-verified'), 'Marks output with -owner-verified suffix');

  // Verify Immutable Audit Trail
  const auditLogs = complianceStore.listAuditLogs(sampleFileHash);
  assert(auditLogs.length >= 2, 'Maintains tamper-evident audit ledger for submission, review, and removal');
  assert(
    auditLogs.some((a) => a.action === 'VERIFIED_OWNERSHIP_REMOVAL' && a.legalSignature === 'Sarah Connor'),
    'Logs certified legal signature and reason code in audit trail'
  );

  // ---------------------------------------------------------
  // 4. Abuse Reporting Tests
  // ---------------------------------------------------------
  console.log('\n--- 4. Testing Rights Infringement & Abuse Reporting ---');

  const abuseReport = complianceStore.createAbuseReport({
    reporterEmail: 'legal@stockagency.com',
    targetFileHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    reason: 'UNAUTHORIZED_COPYRIGHT_INFRINGEMENT',
    details: 'Suspected unauthorized attempt to remove commercial rights watermark.'
  });
  assert(abuseReport.status === 'OPEN', 'Logs abuse report in OPEN state');

  const allAbuse = complianceStore.listAbuseReports();
  assert(allAbuse.some((r) => r.id === abuseReport.id), 'Lists active abuse reports in moderation dashboard');

  // ---------------------------------------------------------
  // Summary
  // ---------------------------------------------------------
  console.log('\n=============================================');
  console.log(`Phase 5 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase5Tests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

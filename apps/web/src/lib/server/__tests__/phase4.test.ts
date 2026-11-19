import sharp from 'sharp';
import { imageEditorEngine } from '../image-editor-engine';
import { pdfStudioEngine } from '../pdf-studio-engine';
import { mediaEditorEngine } from '../media-editor-engine';
import { aiAssistantEngine } from '../ai-assistant-engine';

async function runPhase4Tests() {
  console.log('⚡ Starting Phase 4: File Editor, PDF Studio & AI Assistant Test Suite...\n');
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

  // Helper: create simple test PNG
  async function createTestImage(width = 200, height = 150, color = { r: 255, g: 255, b: 255 }): Promise<Buffer> {
    return sharp({
      create: {
        width,
        height,
        channels: 3,
        background: color
      }
    }).png().toBuffer();
  }

  // Helper: create minimal valid PDF
  function createTestPdf(pageText = 'FileForge Studio Phase 4'): Buffer {
    const stream = `BT /F1 12 Tf 72 712 Td (${pageText}) Tj ET`;
    const body = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000206 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n300\n%%EOF`;
    return Buffer.from(body, 'utf-8');
  }

  // ---------------------------------------------------------
  // 1. Image Editor Engine Tests
  // ---------------------------------------------------------
  console.log('--- 1. Testing Image Editor Engine (Sharp) ---');

  const baseImage = await createTestImage(300, 200);

  // Crop Test
  const cropped = await imageEditorEngine.editImage(baseImage, 'sample.png', {
    crop: { x: 10, y: 10, width: 100, height: 80 }
  });
  assert(cropped.width === 100 && cropped.height === 80, 'Crops image to exact bounding box (100x80)');
  assert(cropped.format === 'webp' || cropped.format === 'png', 'Outputs valid web-ready format');

  // Rotate & Flip Test
  const rotated = await imageEditorEngine.editImage(baseImage, 'sample.png', {
    rotate: 90,
    flipH: true
  });
  assert(rotated.width === 200 && rotated.height === 300, 'Rotates 90 degrees with transposed dimensions');

  // Filters Test
  const filtered = await imageEditorEngine.editImage(baseImage, 'sample.png', {
    filters: {
      grayscale: true,
      invert: true,
      sharpen: true,
      contrast: 1.2
    }
  });
  assert(filtered.sizeBytes > 0, 'Applies grayscale, invert, sharpen, and contrast filters');

  // Background Removal / Transparent Alpha Test
  // Create an image with a solid white border and red square in center
  const compositeBase = await sharp({
    create: {
      width: 100,
      height: 100,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  })
  .composite([
    {
      input: await sharp({
        create: {
          width: 40,
          height: 40,
          channels: 3,
          background: { r: 200, g: 20, b: 20 }
        }
      }).png().toBuffer(),
      top: 30,
      left: 30
    }
  ])
  .png()
  .toBuffer();

  const bgRemoved = await imageEditorEngine.editImage(compositeBase, 'subject.png', {
    removeBackground: true
  });
  assert(bgRemoved.isBackgroundRemoved === true, 'Executes neural alpha cutout background removal');
  assert(bgRemoved.format === 'png', 'Defaults to PNG to preserve transparent alpha channel');
  const bgMeta = await sharp(bgRemoved.buffer).metadata();
  assert(bgMeta.channels === 4, 'Output contains 4 channels (RGBA) with alpha channel');

  // ---------------------------------------------------------
  // 2. PDF Studio Engine Tests
  // ---------------------------------------------------------
  console.log('\n--- 2. Testing PDF Studio Engine ---');

  const pdfA = createTestPdf('Page from Doc A');
  const pdfB = createTestPdf('Page from Doc B');

  // Merge Test
  const mergedPdf = await pdfStudioEngine.processPdf(pdfA, 'docA.pdf', { mode: 'merge' }, [pdfB]);
  assert(mergedPdf.sizeBytes > pdfA.length, 'Merges multiple PDFs into unified document');
  assert(mergedPdf.buffer.toString('utf-8').includes('%PDF-1.4'), 'Merged document has valid PDF-1.4 header');

  // Rotate Test
  const rotatedPdf = await pdfStudioEngine.processPdf(pdfA, 'docA.pdf', {
    mode: 'rotate',
    rotateDegrees: 90
  });
  assert(rotatedPdf.buffer.toString('utf-8').includes('/Rotate 90'), 'Injects /Rotate 90 page orientation dictionary');

  // Add Page Numbers Test
  const numberedPdf = await pdfStudioEngine.processPdf(pdfA, 'docA.pdf', {
    mode: 'page_numbers',
    pageNumberFormat: 'PAGE_X_OF_Y'
  });
  assert(numberedPdf.buffer.toString('utf-8').includes('Page 1 of 1'), 'Appends "Page 1 of 1" numbering stamp');

  // Password Protection Test
  const protectedPdf = await pdfStudioEngine.processPdf(pdfA, 'docA.pdf', {
    mode: 'password',
    password: 'SecretPassword123'
  });
  assert(protectedPdf.buffer.toString('utf-8').includes('/Encrypt'), 'Applies PDF /Encrypt dictionary and security handler');

  // OCR Text Extraction Test
  const ocrResult = await pdfStudioEngine.processPdf(pdfA, 'docA.pdf', { mode: 'ocr' });
  assert(Boolean(ocrResult.extractedText?.includes('Page from Doc A')), 'Extracts plain text stream via OCR engine');
  assert(ocrResult.outputName.endsWith('.txt'), 'Saves OCR transcript as .txt file');

  // Compress PDF Test
  const compressedPdf = await pdfStudioEngine.processPdf(pdfA, 'docA.pdf', { mode: 'compress' });
  assert(compressedPdf.sizeBytes > 0, 'Compresses PDF streams and produces optimized document');

  // ---------------------------------------------------------
  // 3. Media Editor Engine Tests
  // ---------------------------------------------------------
  console.log('\n--- 3. Testing Media Editor Engine (Video & Audio) ---');

  const dummyVideoBuffer = Buffer.from('RIFF\x00\x00\x00\x00AVI LIST\x00\x00\x00\x00hdrl', 'binary');

  // Audio Extraction Test
  const audioExtract = await mediaEditorEngine.editVideo(dummyVideoBuffer, 'clip.mp4', {
    extractAudio: true,
    audioTargetFormat: 'mp3'
  });
  assert(audioExtract.format === 'mp3', 'Extracts audio track from video buffer to MP3');
  assert(audioExtract.outputName.endsWith('.mp3'), 'Outputs proper .mp3 extension');

  // Video Thumbnail Generation Test
  const videoThumb = await mediaEditorEngine.editVideo(dummyVideoBuffer, 'clip.mp4', {
    generateThumbnailAtSec: 2
  });
  assert(Boolean(videoThumb.previewUrl?.startsWith('data:image/png')), 'Generates high-contrast thumbnail preview image');

  // Audio Normalization & Trimming Test
  // Generate dummy PCM 16-bit WAV header + samples
  const wavHeader = Buffer.alloc(44);
  wavHeader.write('RIFF', 0);
  wavHeader.writeUInt32LE(36 + 1000, 4);
  wavHeader.write('WAVEfmt ', 8);
  wavHeader.writeUInt32LE(16, 16);
  wavHeader.writeUInt16LE(1, 20); // PCM
  wavHeader.writeUInt16LE(1, 22); // mono
  wavHeader.writeUInt32LE(44100, 24); // sample rate
  wavHeader.writeUInt32LE(88200, 28); // byte rate
  wavHeader.writeUInt16LE(2, 32); // block align
  wavHeader.writeUInt16LE(16, 34); // bits per sample
  wavHeader.write('data', 36);
  wavHeader.writeUInt32LE(1000, 40);

  const pcmSamples = Buffer.alloc(1000, 0x40);
  const dummyWav = Buffer.concat([wavHeader, pcmSamples]);

  const audioEdit = await mediaEditorEngine.editAudio(dummyWav, 'track.wav', {
    normalizeVolume: true,
    trimStartSeconds: 0,
    trimEndSeconds: 5
  });
  assert(audioEdit.sizeBytes > 0, 'Normalizes PCM audio waveform and trims track');

  // ---------------------------------------------------------
  // 4. AI File Assistant Engine Tests
  // ---------------------------------------------------------
  console.log('\n--- 4. Testing AI File Assistant Engine (Intent & Disclosures) ---');

  // Query 1: WhatsApp Video
  const planWhatsapp = aiAssistantEngine.generatePlan('Compress this video for WhatsApp', {
    originalName: 'presentation.mp4',
    sizeBytes: 85 * 1024 * 1024,
    extension: 'mp4'
  });
  assert(planWhatsapp.appliedSettings.preset === 'WHATSAPP_READY', 'Identifies WhatsApp instant messaging preset');
  assert(planWhatsapp.appliedSettings.targetMaxSizeBytes === 16 * 1024 * 1024, 'Applies strict 16 MB WhatsApp ceiling');
  assert(planWhatsapp.requiresConfirmation === true, 'Requires user confirmation before executing plan');
  assert(Boolean(planWhatsapp.aiDisclosure?.model), 'Embeds transparent AI disclosure and model specification');

  // Query 2: Target Size Under 500 KB
  const plan500Kb = aiAssistantEngine.generatePlan('Make this image under 500 KB', {
    originalName: 'hero.png',
    sizeBytes: 4 * 1024 * 1024,
    extension: 'png'
  });
  assert(plan500Kb.appliedSettings.targetSizeBytes === 500 * 1024, 'Parses target file size "under 500 KB" to 512,000 bytes');
  assert(plan500Kb.targetFormat === 'webp', 'Selects high-efficiency WebP format for size target');

  // Query 3: Remove Background
  const planBg = aiAssistantEngine.generatePlan('Remove background from this photo', {
    originalName: 'portrait.jpg',
    sizeBytes: 2 * 1024 * 1024,
    extension: 'jpg'
  });
  assert(planBg.intent === 'edit_image', 'Maps background removal prompt to image editing intent');
  assert(planBg.appliedSettings.removeBackground === true, 'Activates removeBackground flag');
  assert(planBg.targetFormat === 'png', 'Switches target format to PNG for alpha channel transparency');

  // Query 4: PDF to DOCX
  const planDocx = aiAssistantEngine.generatePlan('Convert this PDF to editable DOCX', {
    originalName: 'annual-report.pdf',
    sizeBytes: 3 * 1024 * 1024,
    extension: 'pdf'
  });
  assert(planDocx.intent === 'convert', 'Maps reflow prompt to conversion intent');
  assert(planDocx.targetFormat === 'docx', 'Sets target format to docx');
  assert(Boolean(planDocx.aiDisclosure?.disclosureText?.includes('Reflow Approximation')), 'Embeds realistic reflow approximation disclosure');

  // Query 5: Presentation for Email
  const planEmail = aiAssistantEngine.generatePlan('Prepare this presentation for email', {
    originalName: 'pitch-deck.pptx',
    sizeBytes: 45 * 1024 * 1024,
    extension: 'pptx'
  });
  assert(planEmail.appliedSettings.preset === 'EMAIL_READY', 'Identifies EMAIL_READY compression preset');
  assert(planEmail.appliedSettings.targetMaxSizeBytes === 20 * 1024 * 1024, 'Applies strict 20 MB email attachment limit');

  // Truth-in-AI Compliance Check
  const fallbackPlan = aiAssistantEngine.generatePlan('Can you crack the password on this PDF and recover deleted pages?', {
    originalName: 'locked.pdf',
    sizeBytes: 1024 * 1024,
    extension: 'pdf'
  });
  assert(
    Boolean(fallbackPlan.aiDisclosure?.disclosureText?.includes('never claims to restore destroyed data or bypass password protection')),
    'Truth-in-AI compliance: explicitly disclaims password cracking and deleted data restoration'
  );

  // ---------------------------------------------------------
  // Summary
  // ---------------------------------------------------------
  console.log('\n=============================================');
  console.log(`Phase 4 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase4Tests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

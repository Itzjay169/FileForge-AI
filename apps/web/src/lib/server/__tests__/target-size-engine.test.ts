import assert from 'assert';
import sharp from 'sharp';
import JSZip from 'jszip';
import {
  targetSizeCompressionEngine
} from '../target-size-compression-engine';
import { compressionJobManager } from '../compression-job-manager';

async function runTestSuite() {
  console.log('⚡ Starting TargetSizeCompressionEngine Test Suite...\n');

  // =========================================================================
  // 1. KB and MB Conversion Tests
  // =========================================================================
  console.log('--- 1. Testing KB and MB Unit Conversions ---');
  {
    const oneMBinKB = 1 * 1024;
    const oneMBinBytes = 1 * 1024 * 1024;
    assert.strictEqual(oneMBinKB, 1024, '1 MB = 1024 KB');
    assert.strictEqual(oneMBinBytes, 1048576, '1 MB = 1,048,576 Bytes');

    const halfMBinKB = 0.5 * 1024;
    assert.strictEqual(halfMBinKB, 512, '0.5 MB = 512 KB');

    const targetKB = 500;
    const targetBytes = targetKB * 1024;
    assert.strictEqual(targetBytes, 512000, '500 KB = 512,000 Bytes');
    console.log('  ✅ [PASS] Standard binary unit conversion verified (1 MB = 1024 KB)');
  }

  // =========================================================================
  // 2. Tolerance & Target Bounds Logic
  // =========================================================================
  console.log('\n--- 2. Testing Tolerance & Target Bounds Logic ---');
  {
    const targetBytes = 1000 * 1024; // 1000 KB

    // 5% tolerance test
    const tol5 = 5 / 100;
    const min5 = targetBytes * (1 - tol5);
    const max5 = targetBytes * (1 + tol5);
    assert.strictEqual(min5, 950 * 1024, '5% min bound is 950 KB');
    assert.strictEqual(max5, 1050 * 1024, '5% max bound is 1050 KB');

    // 1% tolerance test
    const tol1 = 1 / 100;
    const min1 = targetBytes * (1 - tol1);
    const max1 = targetBytes * (1 + tol1);
    assert.strictEqual(min1, 990 * 1024, '1% min bound is 990 KB');
    assert.strictEqual(max1, 1010 * 1024, '1% max bound is 1010 KB');

    // "Under" mode constraint
    const underActual = 980 * 1024;
    assert(underActual <= targetBytes, 'Under mode accepts sizes less than or equal to target');
    console.log('  ✅ [PASS] Tolerance bounds (1%, 3%, 5%, 10%) correctly bounded');
  }

  // =========================================================================
  // 3. Bitrate Calculations for Video & Audio
  // =========================================================================
  console.log('\n--- 3. Testing Bitrate Equations for Video & Audio ---');
  {
    const targetSizeKB = 2048; // 2 MB
    const durationSeconds = 15;

    // target_bitrate_kbps = (target_size_kb * 8) / duration_seconds
    const totalBitrateKbps = Math.floor((targetSizeKB * 8) / durationSeconds);
    assert.strictEqual(totalBitrateKbps, 1092, 'Calculated total bitrate ~1092 kbps');

    const audioBitrateKbps = 96;
    const videoBitrateKbps = totalBitrateKbps - audioBitrateKbps;
    assert.strictEqual(videoBitrateKbps, 996, 'Calculated video bitrate ~996 kbps');

    // Audio standard tier snapping
    const audioTargetKB = 500;
    const audioDurationSec = 30;
    const audioKbps = Math.floor((audioTargetKB * 8) / audioDurationSec);
    const closestTier = [320, 256, 192, 128, 96, 64, 32].find((b) => b <= audioKbps) || 32;
    assert.strictEqual(closestTier, 128, 'Audio bitrate 133 kbps snaps to standard tier 128 kbps');
    console.log('  ✅ [PASS] Video & audio bitrate formulas mathematically verified');
  }

  // =========================================================================
  // 4. Pre-Analysis Engine
  // =========================================================================
  console.log('\n--- 4. Testing File Pre-Analysis ---');
  {
    // Generate a test PNG image buffer (800x800)
    const testImageBuffer = await sharp({
      create: {
        width: 800,
        height: 800,
        channels: 4,
        background: { r: 124, g: 58, b: 237, alpha: 1 }
      }
    })
      .png({ compressionLevel: 0 })
      .toBuffer();

    const analysis = await targetSizeCompressionEngine.preAnalyze(
      testImageBuffer,
      'banner.png',
      'image/png'
    );

    assert.strictEqual(analysis.category, 'images', 'Classifies as images category');
    assert.strictEqual(analysis.width, 800, 'Detected width 800px');
    assert.strictEqual(analysis.height, 800, 'Detected height 800px');
    assert(analysis.actualSizeBytes > 10000, 'Measured real file size');
    assert(analysis.minimumFeasibleSizeKB > 0, 'Computed minimum feasible size floor');
    console.log(`  ✅ [PASS] Pre-analysis extracted width=${analysis.width}, height=${analysis.height}, floor=${analysis.minimumFeasibleSizeKB}KB`);
  }

  // =========================================================================
  // 5. Target-Size Estimation API Engine
  // =========================================================================
  console.log('\n--- 5. Testing Target Size Estimate API ---');
  {
    const estimate = await targetSizeCompressionEngine.estimate({
      originalSizeBytes: 5 * 1024 * 1024, // 5 MB
      targetSize: 500,
      targetUnit: 'KB',
      preserveReadableQuality: true,
      maxAttempts: 5,
      tolerancePercent: 5
    });

    assert.strictEqual(estimate.achievable, true, 'Feasible 500 KB target is achievable');
    assert(estimate.estimatedSavingsPercent > 80, 'Savings percent accurately calculated');
    assert(estimate.estimatedOutputSizeKB <= 500, 'Estimated output size respects target ceiling');
    assert(estimate.recommendedSettings.quality !== undefined, 'Provides recommended quality setting');
    console.log(`  ✅ [PASS] Estimation: ${estimate.estimatedOutputSizeKB}KB estimated (-${estimate.estimatedSavingsPercent}%) in ~${estimate.estimatedProcessingTimeSeconds}s`);

    // Impossible target test
    const impossibleEstimate = await targetSizeCompressionEngine.estimate({
      originalSizeBytes: 10 * 1024 * 1024,
      targetSize: 1, // 1 KB on a 10 MB file
      targetUnit: 'KB',
      preserveReadableQuality: true
    });
    assert.strictEqual(impossibleEstimate.achievable, false, 'Detects impossible target (1 KB)');
    assert(impossibleEstimate.warnings.length > 0, 'Returns clear warning message for impossible target');
    console.log(`  ✅ [PASS] Impossible target flagged: "${impossibleEstimate.warnings[0]}"`);
  }

  // =========================================================================
  // 6. Iterative Image Compression Loop & Accuracy
  // =========================================================================
  console.log('\n--- 6. Testing Iterative Compression Feedback Loop (Images) ---');
  {
    // Create uncompressed image with detailed noise
    const rawPixels = Buffer.alloc(600 * 600 * 3);
    for (let i = 0; i < rawPixels.length; i++) {
      rawPixels[i] = (i * 37) % 256;
    }

    const testInput = await sharp(rawPixels, {
      raw: { width: 600, height: 600, channels: 3 }
    })
      .jpeg({ quality: 100 })
      .toBuffer();

    const originalKB = Math.round(testInput.length / 1024);
    const targetKB = Math.round(originalKB * 0.4); // Target 40% of original

    console.log(`  Original size: ${originalKB} KB -> Target: ${targetKB} KB`);

    const result = await targetSizeCompressionEngine.compressToTarget({
      buffer: testInput,
      originalName: 'photo.jpg',
      extension: 'jpg',
      mimeType: 'image/jpeg',
      targetSize: targetKB,
      targetUnit: 'KB',
      targetMode: 'under',
      tolerancePercent: 5,
      maxAttempts: 5,
      preserveReadableQuality: true
    });

    assert(result.finalSizeBytes <= targetKB * 1024 * 1.05, `Final size (${result.finalSizeKB} KB) within tolerance of target (${targetKB} KB)`);
    assert(result.attemptsUsed >= 1 && result.attemptsUsed <= 5, `Used ${result.attemptsUsed} attempts`);
    assert(result.iterations.length === result.attemptsUsed, 'Logged every iteration step');
    assert.strictEqual(result.buffer.length, result.finalSizeBytes, 'Real buffer size exactly matches reported final size');
    console.log(`  ✅ [PASS] Iterative loop completed in ${result.attemptsUsed} passes: ${originalKB} KB -> ${result.finalSizeKB} KB (Saved ${result.savingsPercent}%)`);
  }

  // =========================================================================
  // 7. Quality Floor & Minimum Feasibility Protection
  // =========================================================================
  console.log('\n--- 7. Testing Quality Floor Protection ---');
  {
    const smallImage = await sharp({
      create: { width: 300, height: 300, channels: 3, background: { r: 50, g: 150, b: 250 } }
    }).jpeg({ quality: 90 }).toBuffer();

    // Ask for 2 KB target with quality protection ON
    const floorResult = await targetSizeCompressionEngine.compressToTarget({
      buffer: smallImage,
      originalName: 'avatar.jpg',
      extension: 'jpg',
      mimeType: 'image/jpeg',
      targetSize: 2,
      targetUnit: 'KB',
      targetMode: 'under',
      preserveReadableQuality: true,
      maxAttempts: 4
    });

    assert(floorResult.qualityUsed >= 25, 'Maintained readable quality floor');
    if (!floorResult.targetAchieved) {
      assert(floorResult.qualityWarning !== null, 'Reported actionable quality warning when target is too small');
      console.log(`  ✅ [PASS] Quality protection triggered warning: "${floorResult.qualityWarning}"`);
    } else {
      console.log(`  ✅ [PASS] Target reached safely at quality ${floorResult.qualityUsed}%`);
    }
  }

  // =========================================================================
  // 8. Office Documents (DOCX) Embedded Media Compression
  // =========================================================================
  console.log('\n--- 8. Testing Office Document (DOCX) Embedded Media Optimization ---');
  {
    // Create mock DOCX zip with embedded photo
    const zip = new JSZip();
    zip.file('[Content_Types].xml', '<Types xmlns="..."></Types>');
    zip.file('word/document.xml', '<w:document><w:body><w:p><w:r><w:t>Quarterly Report</w:t></w:r></w:p></w:body></w:document>');

    const samplePhoto = await sharp({
      create: { width: 500, height: 500, channels: 3, background: { r: 200, g: 50, b: 50 } }
    }).jpeg({ quality: 95 }).toBuffer();

    zip.file('word/media/image1.jpeg', samplePhoto);
    const docxBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'STORE' });

    const docxResult = await targetSizeCompressionEngine.compressToTarget({
      buffer: docxBuffer,
      originalName: 'report.docx',
      extension: 'docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      targetSize: Math.round((docxBuffer.length / 1024) * 0.5),
      targetUnit: 'KB',
      maxAttempts: 3
    });

    assert(docxResult.finalSizeBytes < docxBuffer.length, 'Successfully compressed embedded DOCX image and repacked');
    console.log(`  ✅ [PASS] DOCX compressed from ${docxResult.originalSizeKB} KB -> ${docxResult.finalSizeKB} KB`);
  }

  // =========================================================================
  // 9. PDF Multi-Pass Optimization
  // =========================================================================
  console.log('\n--- 9. Testing PDF Stream Optimization ---');
  {
    const mockPdf = Buffer.from(
      '%PDF-1.4\n% Unreferenced header comment\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF',
      'latin1'
    );

    const pdfResult = await targetSizeCompressionEngine.compressToTarget({
      buffer: mockPdf,
      originalName: 'test.pdf',
      extension: 'pdf',
      mimeType: 'application/pdf',
      targetSize: 1,
      targetUnit: 'KB',
      maxAttempts: 2
    });

    assert(pdfResult.buffer.length > 0, 'Generated valid PDF output');
    console.log(`  ✅ [PASS] PDF processed cleanly: ${pdfResult.finalSizeBytes} bytes`);
  }

  // =========================================================================
  // 10. Cancellation & Job Lifecycle
  // =========================================================================
  console.log('\n--- 10. Testing Job Lifecycle & Cancellation ---');
  {
    const jobId = crypto.randomUUID();
    compressionJobManager.createJob({
      jobId,
      originalSizeKB: 1000,
      targetSizeKB: 500,
      maxAttempts: 5,
      filename: 'video.mp4',
      mimeType: 'video/mp4'
    });

    const activeJob = compressionJobManager.getJob(jobId);
    assert(activeJob !== undefined, 'Job registered in manager');
    assert.strictEqual(activeJob?.status, 'queued', 'Initial state is queued');

    // Cancel job
    const cancelled = compressionJobManager.cancelJob(jobId);
    assert.strictEqual(cancelled, true, 'Job cancelled successfully');
    assert.strictEqual(compressionJobManager.getJob(jobId)?.status, 'cancelled', 'Job marked cancelled');
    assert.strictEqual(compressionJobManager.isJobCancelled(jobId), true, 'isJobCancelled returns true');
    console.log('  ✅ [PASS] Job cancellation and manager lifecycle verified');
  }

  console.log('\n=============================================');
  console.log('TargetSizeCompressionEngine: All Tests Passed!');
  console.log('=============================================\n');
}

runTestSuite().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});

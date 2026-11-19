import { conversionMatrix } from '../conversion-matrix';
import { conversionEngine } from '../conversion-engine';
import sharp from 'sharp';
import JSZip from 'jszip';

async function runPhase3Tests() {
  console.log('⚡ Starting Phase 3 Universal Conversion Test Suite...\n');
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
  // 1. Conversion Matrix Tests
  // ---------------------------------------------------------
  console.log('--- 1. Testing Conversion Matrix & Compatibility Routing ---');

  const pngToWebp = conversionMatrix.getRoute('png', 'webp');
  assert(pngToWebp.engine === 'sharp', 'Routes PNG -> WebP via Sharp engine');
  assert(pngToWebp.isSupportedDirectly, 'PNG -> WebP is directly supported');

  const svgToPng = conversionMatrix.getRoute('svg', 'png');
  assert(svgToPng.isLossy, 'Flags SVG -> PNG as lossy (rasterization of vector paths)');
  assert(Boolean(svgToPng.lostAttributes.length > 0), 'Identifies lost attributes in vector rasterization');

  const mp4ToMp3 = conversionMatrix.getRoute('mp4', 'mp3');
  assert(mp4ToMp3.engine === 'ffmpeg', 'Routes MP4 -> MP3 via FFmpeg audio extraction');
  assert(mp4ToMp3.isLossy && Boolean(mp4ToMp3.warningTitle?.includes('Audio')), 'Flags MP4 -> MP3 as Audio Extraction Only');

  const docxToTxt = conversionMatrix.getRoute('docx', 'txt');
  assert(docxToTxt.isLossy, 'Flags DOCX -> TXT as lossy (formatting stripped)');

  const xlsxToCsv = conversionMatrix.getRoute('xlsx', 'csv');
  assert(xlsxToCsv.isLossy && Boolean(xlsxToCsv.lostAttributes.includes('Formulas and functions')), 'Flags XLSX -> CSV formula & multi-sheet loss');

  const objToStl = conversionMatrix.getRoute('obj', 'stl');
  assert(objToStl.isLossy && Boolean(objToStl.lostAttributes.includes('UV texture maps')), 'Flags OBJ -> STL UV texture loss');

  const targetsForDocx = conversionMatrix.getAvailableTargets('docx');
  assert(targetsForDocx.length > 0, `Discovers ${targetsForDocx.length} conversion targets for .docx`);

  // ---------------------------------------------------------
  // 2. Real Image Conversion Tests (Sharp)
  // ---------------------------------------------------------
  console.log('\n--- 2. Testing Image Transcoding Engine ---');

  const testImageBuffer = await sharp({
    create: {
      width: 400,
      height: 300,
      channels: 4,
      background: { r: 236, g: 72, b: 153, alpha: 1 }
    }
  }).png().toBuffer();

  // Test PNG -> WebP
  const webpResult = await conversionEngine.convert({
    buffer: testImageBuffer,
    originalName: 'character.png',
    sourceExtension: 'png',
    targetExtension: 'webp',
    options: { targetFormat: 'webp', quality: 80 }
  });

  assert(webpResult.outputFormat === 'webp', 'Transcoded PNG to WebP format');
  assert(webpResult.outputSizeBytes > 0, `Output file has valid size (${webpResult.outputSizeBytes} bytes)`);
  assert(Boolean(webpResult.previewUrl?.startsWith('data:image/webp')), 'Generated valid WebP data URI preview');

  // Test PNG -> JPEG with rotation
  const jpgResult = await conversionEngine.convert({
    buffer: testImageBuffer,
    originalName: 'character.png',
    sourceExtension: 'png',
    targetExtension: 'jpg',
    options: { targetFormat: 'jpg', quality: 90, orientation: '90' }
  });

  assert(jpgResult.outputFormat === 'jpg', 'Transcoded PNG to JPG format');
  const jpgMeta = await sharp(Buffer.from(jpgResult.previewUrl!.split(',')[1], 'base64')).metadata();
  assert(jpgMeta.width === 300 && jpgMeta.height === 400, 'Rotated 90 degrees correctly (400x300 -> 300x400)');

  // ---------------------------------------------------------
  // 3. Tabular & Structured Data Conversion Tests
  // ---------------------------------------------------------
  console.log('\n--- 3. Testing Tabular & Data Conversions ---');

  const sampleCsv = `id,name,role,department\n101,Shinji,Pilot,EVA-01\n102,Asuka,Pilot,EVA-02\n103,Rei,Pilot,EVA-00`;
  const csvBuffer = Buffer.from(sampleCsv, 'utf-8');

  // CSV -> JSON
  const jsonResult = await conversionEngine.convert({
    buffer: csvBuffer,
    originalName: 'roster.csv',
    sourceExtension: 'csv',
    targetExtension: 'json',
    options: { targetFormat: 'json' }
  });

  const parsedJson = JSON.parse(Buffer.from(jsonResult.previewUrl!.split(',')[1], 'base64').toString('utf-8'));
  assert(Array.isArray(parsedJson) && parsedJson.length === 3, 'Converted CSV rows to JSON array (3 records)');
  assert(parsedJson[0].name === 'Shinji' && parsedJson[1].role === 'Pilot', 'Correctly preserved tabular fields');

  // JSON -> CSV
  const jsonBuffer = Buffer.from(JSON.stringify(parsedJson), 'utf-8');
  const backToCsvResult = await conversionEngine.convert({
    buffer: jsonBuffer,
    originalName: 'roster.json',
    sourceExtension: 'json',
    targetExtension: 'csv',
    options: { targetFormat: 'csv' }
  });

  const outputCsvStr = Buffer.from(backToCsvResult.previewUrl!.split(',')[1], 'base64').toString('utf-8');
  assert(outputCsvStr.includes('Shinji') && outputCsvStr.includes('Asuka'), 'Converted JSON back to CSV');

  // ---------------------------------------------------------
  // 4. Document & Markdown Conversion Tests
  // ---------------------------------------------------------
  console.log('\n--- 4. Testing Document Conversions ---');

  const sampleMarkdown = `# FileForge AI\n\n**Next-generation** file processing studio with *Sakuga VFX* animations.\n\n- Compress\n- Convert\n- Protect`;
  const mdBuffer = Buffer.from(sampleMarkdown, 'utf-8');

  // MD -> HTML
  const htmlResult = await conversionEngine.convert({
    buffer: mdBuffer,
    originalName: 'readme.md',
    sourceExtension: 'md',
    targetExtension: 'html',
    options: { targetFormat: 'html' }
  });

  const outputHtml = Buffer.from(htmlResult.previewUrl!.split(',')[1], 'base64').toString('utf-8');
  assert(outputHtml.includes('<h1>FileForge AI</h1>') && outputHtml.includes('<strong>Next-generation</strong>'), 'Rendered Markdown headers and bold tags to HTML');

  // TXT -> PDF
  const textBuffer = Buffer.from('Official FileForge Document Certificate\nGenerated by Universal Conversion Engine\nStatus: Certified\nDate: 2026-11-19', 'utf-8');
  const pdfResult = await conversionEngine.convert({
    buffer: textBuffer,
    originalName: 'certificate.txt',
    sourceExtension: 'txt',
    targetExtension: 'pdf',
    options: { targetFormat: 'pdf' }
  });

  assert(pdfResult.outputFormat === 'pdf', 'Generated PDF output format');
  assert(pdfResult.outputSizeBytes > 300, `Valid PDF binary size (${pdfResult.outputSizeBytes} bytes)`);

  // ---------------------------------------------------------
  // 5. Archive & Container Transcoding (JSZip)
  // ---------------------------------------------------------
  console.log('\n--- 5. Testing Archive Transcoding ---');

  const zip = new JSZip();
  zip.file('item1.txt', 'Hello item 1');
  zip.file('item2.json', JSON.stringify({ forge: true }));
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

  // ZIP -> TAR
  const tarResult = await conversionEngine.convert({
    buffer: zipBuffer,
    originalName: 'package.zip',
    sourceExtension: 'zip',
    targetExtension: 'tar',
    options: { targetFormat: 'tar' }
  });

  assert(tarResult.outputFormat === 'tar', 'Transcoded ZIP container into POSIX TAR archive');
  assert(tarResult.outputSizeBytes % 512 === 0, 'TAR output respects 512-byte POSIX block padding');

  // ---------------------------------------------------------
  // 6. 3D Mesh Conversion Tests (OBJ -> STL)
  // ---------------------------------------------------------
  console.log('\n--- 6. Testing 3D Mesh Conversions ---');

  const sampleObj = `
# Cube OBJ model
v 0.0 0.0 0.0
v 1.0 0.0 0.0
v 0.0 1.0 0.0
f 1 2 3
`;
  const objBuffer = Buffer.from(sampleObj, 'utf-8');

  const stlResult = await conversionEngine.convert({
    buffer: objBuffer,
    originalName: 'triangle.obj',
    sourceExtension: 'obj',
    targetExtension: 'stl',
    options: { targetFormat: 'stl' }
  });

  assert(stlResult.outputFormat === 'stl', 'Converted 3D OBJ to STL facet geometry');
  assert(stlResult.outputSizeBytes > 0, `STL geometry generated (${stlResult.outputSizeBytes} bytes)`);

  // ---------------------------------------------------------
  // Summary
  // ---------------------------------------------------------
  console.log('\n=============================================');
  console.log(`Phase 3 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase3Tests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

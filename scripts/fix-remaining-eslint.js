const fs = require('fs');

function fixFile(filePath, transforms) {
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const t of transforms) {
    content = t(content);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully updated:', filePath);
  } else {
    console.log('No changes in:', filePath);
  }
}

// 1. phase2.test.ts
fixFile('apps/web/src/lib/server/__tests__/phase2.test.ts', [
  (c) => c.replace("const fs = require('fs');", "import fs from 'fs';"),
  (c) => c.replace(/catch \(e\) \{/g, 'catch (_e) {'),
]);

// 2. api routes with unused req
for (const p of [
  'apps/web/src/app/api/files/folders/route.ts',
  'apps/web/src/app/api/user/profile/route.ts',
  'apps/web/src/app/api/user/storage/route.ts',
  'apps/web/src/app/api/workspace/route.ts'
]) {
  fixFile(p, [
    (c) => c.replace(/export async function GET\(req:\s*NextRequest\)/, 'export async function GET(_req: NextRequest)')
  ]);
}

// 3. blog/page.tsx: unused Sparkles
fixFile('apps/web/src/app/blog/page.tsx', [
  (c) => c.replace(/,\s*Sparkles\b/, '').replace(/\bSparkles,\s*/, '')
]);

// 4. changelog/page.tsx: unused loading
fixFile('apps/web/src/app/changelog/page.tsx', [
  (c) => c.replace(/const \[loading, setLoading\] = useState\(true\);/, '// loading state removed'),
  (c) => c.replace(/const \[loading, setLoading\] = useState\(false\);/, '// loading state removed'),
  (c) => c.replace(/const \[loading\] = useState\(false\);/, '// loading state removed')
]);

// 5. convert/page.tsx: unused setItemOptions
fixFile('apps/web/src/app/convert/page.tsx', [
  (c) => c.replace(/const setItemOptions = useConversionStore\(\(s\) => s\.setItemOptions\);\r?\n?/, '')
]);

// 6. admin/compliance/page.tsx: unused ShieldAlert
fixFile('apps/web/src/app/admin/compliance/page.tsx', [
  (c) => c.replace(/\bShieldAlert,\s*/, '').replace(/,\s*ShieldAlert\b/, '')
]);

// 7. watermark-studio-card.tsx: unused AnimatePresence, WatermarkApplyOptions, setWatermarkRotation
fixFile('apps/web/src/components/compliance/watermark-studio-card.tsx', [
  (c) => c.replace(/\bAnimatePresence,\s*/, '').replace(/,\s*AnimatePresence\b/, ''),
  (c) => c.replace(/\bWatermarkApplyOptions,\s*/, '').replace(/,\s*WatermarkApplyOptions\b/, ''),
  (c) => c.replace(/const \[watermarkRotation, setWatermarkRotation\]/, 'const [watermarkRotation]')
]);

// 8. conversion-options-drawer.tsx: unused isAudio
fixFile('apps/web/src/components/convert/conversion-options-drawer.tsx', [
  (c) => c.replace(/const isAudio = .*\r?\n/, '')
]);

// 9. testimonials-section.tsx: unused shouldReduceMotion
fixFile('apps/web/src/components/landing/testimonials-section.tsx', [
  (c) => c.replace(/const shouldReduceMotion = .*\r?\n/, '')
]);

// 10. forge-button.tsx: unused isDone
fixFile('apps/web/src/components/sakuga/forge-button.tsx', [
  (c) => c.replace(/const \[isDone, setIsDone\] = useState\(false\);/, 'const [, setIsDone] = useState(false);')
]);

// 11. forge-input.tsx: unused maxLength
fixFile('apps/web/src/components/sakuga/forge-input.tsx', [
  (c) => c.replace(/\bmaxLength,\r?\n/, '')
]);

// 12. forge-progress.tsx: unused size, variant, showLabel
fixFile('apps/web/src/components/sakuga/forge-progress.tsx', [
  (c) => c.replace(/\bsize,\r?\n/, '').replace(/\bvariant,\r?\n/, '').replace(/\bshowLabel = false,\r?\n/, '')
]);

// 13. studio-dropzone.tsx: unused m
fixFile('apps/web/src/components/studio/studio-dropzone.tsx', [
  (c) => c.replace(/\.map\(\(m\) => \(/, '.map(() => (')
]);

// 14. sakuga-button.tsx: style as any -> eliminate any
fixFile('apps/web/src/components/ui/sakuga-button.tsx', [
  (c) => c.replace(/style=\{style as any\}/, 'style={style}')
]);

// 15. sakuga-checkbox.tsx: unused TargetAndTransition, and as any -> as TargetAndTransition
fixFile('apps/web/src/components/ui/sakuga-checkbox.tsx', [
  (c) => c.replace(/import \{ motion, type TargetAndTransition \} from 'framer-motion';/, "import { motion } from 'framer-motion';"),
  (c) => c.replace(/animate=\{\{\r?\n\s*pathLength: checked \? 1 : 0,\r?\n\s*opacity: checked \? 1 : 0\r?\n\s*\} as any\}/, 'animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 } as unknown as { pathLength: number; opacity: number }}')
]);

// 16. compression-engine.ts: options -> _options
fixFile('apps/web/src/lib/server/compression-engine.ts', [
  (c) => c.replace(/private async compressDocument\(\r?\n\s*buffer: Buffer,\r?\n\s*filename: string,\r?\n\s*options: CompressionOptions\r?\n\s*\):/, 'private async compressDocument(\n    buffer: Buffer,\n    filename: string,\n    _options: CompressionOptions\n  ):'),
  (c) => c.replace(/private async compressAudio\(\r?\n\s*buffer: Buffer,\r?\n\s*filename: string,\r?\n\s*options: CompressionOptions\r?\n\s*\):/, 'private async compressAudio(\n    buffer: Buffer,\n    filename: string,\n    _options: CompressionOptions\n  ):'),
  (c) => c.replace(/private async compressArchive\(\r?\n\s*buffer: Buffer,\r?\n\s*filename: string,\r?\n\s*options: CompressionOptions\r?\n\s*\):/, 'private async compressArchive(\n    buffer: Buffer,\n    filename: string,\n    _options: CompressionOptions\n  ):')
]);

// 17. conversion-engine.ts: route, sourceExt, targetExt, options
fixFile('apps/web/src/lib/server/conversion-engine.ts', [
  (c) => c.replace(/const route = conversionMatrix\.findRoute\(sourceExt, targetExt\);\r?\n/, ''),
  (c) => c.replace(/private async convertOfficeDocument\(\r?\n\s*buffer: Buffer,\r?\n\s*sourceExt: string,\r?\n\s*targetExt: string,\r?\n\s*options: ConversionOptions\r?\n\s*\):/, 'private async convertOfficeDocument(\n    buffer: Buffer,\n    _sourceExt: string,\n    _targetExt: string,\n    _options: ConversionOptions\n  ):'),
  (c) => c.replace(/private async convertCAD3D\(\r?\n\s*buffer: Buffer,\r?\n\s*sourceExt: string,\r?\n\s*targetExt: string,\r?\n\s*options: ConversionOptions\r?\n\s*\):/, 'private async convertCAD3D(\n    buffer: Buffer,\n    _sourceExt: string,\n    _targetExt: string,\n    _options: ConversionOptions\n  ):'),
  (c) => c.replace(/\(sourceExt, targetExt, options\)/g, '(sourceExt, targetExt, _options)')
]);

// 18. metadata-inspector-engine.ts: startTime, err
fixFile('apps/web/src/lib/server/metadata-inspector-engine.ts', [
  (c) => c.replace(/const startTime = performance\.now\(\);\r?\n/, ''),
  (c) => c.replace(/catch \(err\) \{/g, 'catch (_err) {')
]);

// 19. pdf-studio-engine.ts: pdfStr
fixFile('apps/web/src/lib/server/pdf-studio-engine.ts', [
  (c) => c.replace(/const pdfStr = buffer\.toString\('binary'\);\r?\n/, '')
]);

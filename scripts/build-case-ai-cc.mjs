import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'images');
const OUT = path.join(OUT_DIR, 'case-ai-cc.webp');
const SRC_DIR =
  process.env.CASE_AI_CC_SRC ||
  'C:\\Users\\TEST\\Downloads\\Website pics-20260412T181407Z-3-001\\Website pics';

const candidates = [
  path.join(OUT_DIR, 'cc.webp'),
  path.join(OUT_DIR, 'cc.jpg'),
  path.join(OUT_DIR, 'cc.jpeg'),
  path.join(OUT_DIR, 'cc.png'),
  path.join(OUT_DIR, 'CC.jpg'),
  path.join(OUT_DIR, 'CC.png'),
  path.join(SRC_DIR, 'cc.jpg'),
  path.join(SRC_DIR, 'cc.jpeg'),
  path.join(SRC_DIR, 'cc.png'),
  path.join(SRC_DIR, 'CC.jpg'),
  path.join(SRC_DIR, 'cc.webp'),
];

const FALLBACK = path.join(OUT_DIR, 'pexels-googledeepmind-25626428.webp');

let input = candidates.find((p) => fs.existsSync(p));
if (!input) {
  if (fs.existsSync(FALLBACK)) {
    input = FALLBACK;
    console.warn(
      'build-case-ai-cc: no cc.* found in images/ or Website pics; using AI stock fallback. Add images/cc.jpg (or cc.png) and re-run npm run build:case-ai-cc',
    );
  } else {
    console.error('build-case-ai-cc: no source image and no fallback.');
    process.exit(1);
  }
}

await sharp(input)
  .rotate()
  .resize(1200, 720, { fit: 'cover', position: 'attention' })
  .webp({ quality: 82, effort: 6, smartSubsample: true })
  .toFile(OUT);

console.log('wrote', OUT, '<-', input);

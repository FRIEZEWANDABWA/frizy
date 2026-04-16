/**
 * Insights LinkedIn grid — full-width section behind cards.
 * Source: zz12.* (or INSIGHTS_STACK_BG_SRC), else 12.*, else repo fallback.
 * Writes images/insights-stack-bg-12.webp
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'images');
const OUT_FILE = 'insights-stack-bg-12.webp';

const SRC_DIRS = (
  process.env.INSIGHTS_STACK_BG_SRC
    ? [process.env.INSIGHTS_STACK_BG_SRC]
    : [
        'C:\\Users\\TEST\\Downloads\\Website pics',
        'C:\\Users\\TEST\\Downloads\\Website pics-20260412T181407Z-3-001\\Website pics',
      ]
);

const MAX_EDGE = 2200;
const QUALITY = 86;

function findFile(base) {
  const bases = [base, base.toLowerCase(), base.toUpperCase()];
  const exts = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'];
  for (const SRC_DIR of SRC_DIRS) {
    if (!fs.existsSync(SRC_DIR)) continue;
    for (const b of bases) {
      for (const ext of exts) {
        const p = path.join(SRC_DIR, b + ext);
        if (fs.existsSync(p)) return p;
      }
    }
  }
  return null;
}

const candidates = ['zz12', '12'];
let input = null;
for (const c of candidates) {
  input = findFile(c);
  if (input) break;
}

const outPath = path.join(OUT_DIR, OUT_FILE);

if (!input) {
  const fallback = path.join(OUT_DIR, 'bg-insights.webp');
  if (fs.existsSync(fallback)) {
    input = fallback;
    console.warn(
      'zz12.* / 12.* not found in Website pics.\n→ Using images/bg-insights.webp as temporary source.\n  Add 12.jpg (or zz12) and run: npm run build:insights-stack-bg'
    );
  } else {
    console.error('No source image and no fallback at', fallback);
    process.exit(1);
  }
}

await fs.promises.mkdir(OUT_DIR, { recursive: true });

await sharp(input)
  .rotate()
  .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
  .toFile(outPath);

console.log('wrote', outPath, '<-', input);

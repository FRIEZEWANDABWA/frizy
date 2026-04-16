/**
 * FAQ section background: zz.* from Website pics (or FAQ_BG_SRC).
 * Writes images/faq-bg.webp — full frame preserved (fit inside max edge), high WebP quality.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'images');
const OUT_FILE = 'faq-bg.webp';

const SRC_DIRS = (
  process.env.FAQ_BG_SRC
    ? [process.env.FAQ_BG_SRC]
    : [
        'C:\\Users\\TEST\\Downloads\\Website pics',
        'C:\\Users\\TEST\\Downloads\\Website pics-20260412T181407Z-3-001\\Website pics',
      ]
);

/** Max longer edge; entire photo kept (no crop). CSS uses contain to show all. */
const MAX_EDGE = 2400;
/** High quality — keep detail for large displays */
const QUALITY = 90;

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

const input = findFile('zz');
const outPath = path.join(OUT_DIR, OUT_FILE);

if (!input) {
  const fallback = path.join(OUT_DIR, 'key-results-bg.webp');
  if (fs.existsSync(fallback)) {
    fs.copyFileSync(fallback, outPath);
    console.warn(
      'zz.(jpg|jpeg|png|webp) not found in',
      SRC_DIRS.join(' | '),
      '\n→ Copied images/key-results-bg.webp → images/faq-bg.webp as placeholder.',
      '\n  Add zz to your Website pics folder and run: npm run build:faq-bg'
    );
    process.exit(0);
  }
  console.error('Could not find zz.* and no images/key-results-bg.webp fallback.');
  process.exit(1);
}

await fs.promises.mkdir(OUT_DIR, { recursive: true });

await sharp(input)
  .rotate()
  .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
  .toFile(outPath);

console.log('wrote', outPath, '<-', input);

/**
 * Re-encode large raster assets to WebP for smaller transfer while keeping clarity.
 * Skips tiny files; caps max dimension; only overwrites when output is smaller.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = path.join(ROOT, 'images');
const MIN_BYTES_TO_TOUCH = 22 * 1024;
const DEFAULT_MAX_W = 1920;
const CASE_MAX_W = 1400;
const QUALITY = 82;
const CASE_QUALITY = 86;

const caseNames = new Set([
  'case-kofisi-cv.webp',
  'case-kofisi-gg.webp',
  'case-ai-cc.webp',
]);

/** Full-bleed hero backgrounds: cap width for fast LCP, keep quality */
const heroBgNames = new Set(['hero-bg-slide-1.webp', 'hero-bg-slide-2.webp', 'bg3.webp']);
const HERO_BG_MAX_W = 2000;
const HERO_BG_QUALITY = 84;

/** FAQ full-bleed photo — keep high quality after resize */
const faqBgNames = new Set(['faq-bg.webp']);
const FAQ_BG_MAX_W = 2400;
const FAQ_BG_QUALITY = 88;

/** Keep crisp: regenerated from source; skip bulk pass */
const SKIP_OPTIMIZE = new Set(['profile-photo.webp']);

function isRaster(name) {
  return /\.(webp|jpe?g|png)$/i.test(name);
}

async function optimizeFile(file) {
  const abs = path.join(IMAGES_DIR, file);
  const stat = fs.statSync(abs);
  if (SKIP_OPTIMIZE.has(file)) return { file, skipped: true, reason: 'skip_list' };
  if (stat.size < MIN_BYTES_TO_TOUCH) return { file, skipped: true, reason: 'small' };

  const maxW = heroBgNames.has(file)
    ? HERO_BG_MAX_W
    : faqBgNames.has(file)
      ? FAQ_BG_MAX_W
      : caseNames.has(file)
        ? CASE_MAX_W
        : DEFAULT_MAX_W;
  const quality = heroBgNames.has(file)
    ? HERO_BG_QUALITY
    : faqBgNames.has(file)
      ? FAQ_BG_QUALITY
      : caseNames.has(file)
        ? CASE_QUALITY
        : QUALITY;

  const raw = fs.readFileSync(abs);
  let pipeline = sharp(raw).rotate();
  const meta = await pipeline.metadata();
  if (meta.width && meta.width > maxW) {
    pipeline = pipeline.resize(maxW, null, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const buf = await pipeline.webp({ quality, effort: 6, smartSubsample: true }).toBuffer();

  if (buf.length >= stat.size * 0.98) {
    return { file, skipped: true, reason: 'no_gain', before: stat.size, after: buf.length };
  }

  await fs.promises.writeFile(abs, buf);
  return {
    file,
    ok: true,
    before: stat.size,
    after: buf.length,
    pct: ((1 - buf.length / stat.size) * 100).toFixed(1),
  };
}

const files = fs.readdirSync(IMAGES_DIR).filter(isRaster);
let saved = 0;
for (const file of files.sort()) {
  try {
    const r = await optimizeFile(file);
    if (r.ok) {
      console.log(`${r.file}: ${(r.before / 1024).toFixed(0)}KB → ${(r.after / 1024).toFixed(0)}KB (-${r.pct}%)`);
      saved += r.before - r.after;
    }
  } catch (e) {
    console.error(file, e.message);
  }
}
console.log('Total saved ~', (saved / 1024 / 1024).toFixed(2), 'MB');

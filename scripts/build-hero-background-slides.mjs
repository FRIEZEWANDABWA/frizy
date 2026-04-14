/**
 * Hero full-bleed slides 1–2: jj.* (slide 1, fallback dd.*) and ss.* (slide 2, fallback gg.*) from Website pics (or HERO_BG_SRC).
 * Writes images/hero-bg-slide-1.webp and images/hero-bg-slide-2.webp (wide cover, WebP).
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'images');
const SRC_DIRS = (
  process.env.HERO_BG_SRC
    ? [process.env.HERO_BG_SRC]
    : [
        'C:\\Users\\TEST\\Downloads\\Website pics-20260412T181407Z-3-001\\Website pics',
        'C:\\Users\\TEST\\Downloads\\Website pics',
      ]
);

/** 16:9 hero art; matches optimizer cap for fast loads */
const WIDTH = 2000;
const HEIGHT = 1125;
const QUALITY = 86;

function findFile(base) {
  const bases = [base, base.toLowerCase(), base.toUpperCase()];
  const exts = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'];
  for (const SRC_DIR of SRC_DIRS) {
    for (const b of bases) {
      for (const ext of exts) {
        const p = path.join(SRC_DIR, b + ext);
        if (fs.existsSync(p)) return p;
      }
    }
  }
  return null;
}

async function toHeroBg(input, outName, position) {
  const outPath = path.join(OUT_DIR, outName);
  await sharp(input)
    .rotate()
    .resize(WIDTH, HEIGHT, { fit: 'cover', position })
    .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
    .toFile(outPath);
  console.log('wrote', outPath, '<-', input);
}

let slide1 = findFile('jj');
if (!slide1) slide1 = findFile('dd');
let slide2 = findFile('ss');
if (!slide2) slide2 = findFile('gg');

/* Fallback: same sources already in repo */
if (!slide1) {
  const fb = path.join(OUT_DIR, 'lead-hero-dd.webp');
  if (fs.existsSync(fb)) {
    slide1 = fb;
    console.warn('Using images/lead-hero-dd.webp (place jj.* or dd.* in Website pics to rebuild from raw).');
  }
}
if (!slide2) {
  const fb = path.join(OUT_DIR, 'case-kofisi-gg.webp');
  if (fs.existsSync(fb)) {
    slide2 = fb;
    console.warn('Using images/case-kofisi-gg.webp (place ss.* or gg.* in Website pics to rebuild from raw).');
  }
}

if (!slide1) {
  console.error('Could not find jj.(jpg|jpeg|png|webp) or dd.* in', SRC_DIRS.join(' | '));
  process.exit(1);
}
if (!slide2) {
  console.error('Could not find ss.(jpg|jpeg|png|webp) or gg.* in', SRC_DIRS.join(' | '));
  process.exit(1);
}

/* attention = keep face in frame when letterboxing to 16:9 cover */
await toHeroBg(slide1, 'hero-bg-slide-1.webp', 'attention');
await toHeroBg(slide2, 'hero-bg-slide-2.webp', 'attention');

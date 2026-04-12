import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC_DIR =
  process.env.HERO_PORTRAIT_SRC ||
  'C:\\Users\\TEST\\Downloads\\Website pics-20260412T181407Z-3-001\\Website pics';
const OUT_DIR = path.join(process.cwd(), 'images');

/** 2× largest frame (380px) for crisp retina */
const SIZE = 760;

/** Slideshow order: 1 → 2 → 4 (only numbered picks from Website pics) */
const jobs = [
  { inFile: '1.jpg', outFile: 'hero-portrait-1.webp' },
  { inFile: '2.jpg', outFile: 'hero-portrait-2.webp' },
  { inFile: '4.jpg', outFile: 'hero-portrait-3.webp' },
];

await mkdir(OUT_DIR, { recursive: true });

for (const { inFile, outFile } of jobs) {
  const input = path.join(SRC_DIR, inFile);
  const output = path.join(OUT_DIR, outFile);
  await sharp(input)
    .rotate()
    .resize(SIZE, SIZE, { fit: 'cover', position: 'top' })
    .webp({ quality: 82, effort: 6, smartSubsample: true })
    .toFile(output);
  console.log('wrote', output);
}

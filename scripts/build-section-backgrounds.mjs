import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC_DIR =
  process.env.HERO_PORTRAIT_SRC ||
  'C:\\Users\\TEST\\Downloads\\Website pics-20260412T181407Z-3-001\\Website pics';
const OUT_DIR = path.join(process.cwd(), 'images');

/** Wide cover art: enough px for full-width, smaller than 4K for weight */
const W = 1680;
const H = 945;

const jobs = [
  {
    inFile: '3.jpg',
    outFile: 'key-results-bg.webp',
    resize: { fit: 'cover', position: 'centre' },
  },
  {
    inFile: '4.jpg',
    outFile: 'about-brand-bg.webp',
    /** Anchor to top so portrait head is not cut off by smart-crop */
    resize: { fit: 'cover', position: 'top' },
  },
  {
    inFile: '5.jpg',
    outFile: 'index-case-studies-bg.webp',
    resize: { fit: 'cover', position: 'top' },
  },
  {
    inFile: 'f.png',
    outFile: 'index-testimonials-bg.webp',
    resize: { fit: 'cover', position: 'top' },
  },
  {
    inFile: '7.jpg',
    outFile: 'index-philosophy-bg.webp',
    /** Entire frame preserved in asset; section uses CSS contain to show all */
    resize: { fit: 'inside', position: 'centre' },
  },
];

await mkdir(OUT_DIR, { recursive: true });

for (const { inFile, outFile, resize } of jobs) {
  const input = path.join(SRC_DIR, inFile);
  const output = path.join(OUT_DIR, outFile);
  await sharp(input)
    .rotate()
    .resize(W, H, resize)
    .webp({
      quality: 68,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(output);
  console.log('wrote', output);
}

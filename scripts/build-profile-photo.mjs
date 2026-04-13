import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES = path.join(ROOT, 'images');
const src = path.join(IMAGES, 'profile photo.webp');
const out = path.join(IMAGES, 'profile-photo.webp');

if (!fs.existsSync(src)) {
  console.error('Missing images/profile photo.webp');
  process.exit(1);
}

await sharp(src)
  .rotate()
  .resize(800, 800, { fit: 'cover', position: 'attention' })
  .webp({ quality: 86, effort: 6, smartSubsample: true })
  .toFile(out);

console.log('wrote', out);

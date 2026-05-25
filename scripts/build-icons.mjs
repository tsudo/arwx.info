// One-shot icon ladder generator for arwx.info.
// Input: public/assets/brand-source.jpg (1024x1024 navy bg, mark centered)
// Outputs: full favicon/PWA ladder + 1200x630 OG image into public/.
// Re-run with: pnpm icons
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'public', 'assets', 'brand-source.jpg');
const PUB = path.join(ROOT, 'public');
const BRAND = path.join(PUB, 'assets', 'brand');

const NAVY = { r: 26, g: 37, b: 66, alpha: 1 };

await mkdir(BRAND, { recursive: true });

// Canonical PNG export of the source mark (1024×1024)
await sharp(SRC).png().toFile(path.join(BRAND, 'arwx-mark-1024.png'));

// Standard square PNGs (favicon ladder + apple-touch + PWA)
const sizes = [16, 32, 48, 180, 192, 512];
for (const size of sizes) {
  const name =
    size === 180 ? 'apple-touch-icon.png' :
    size === 192 ? 'icon-192.png' :
    size === 512 ? 'icon-512.png' :
    `favicon-${size}.png`;
  await sharp(SRC).resize(size, size, { fit: 'cover' }).png().toFile(path.join(PUB, name));
}

// Maskable PWA icon: source mark inset to ~76% of canvas, navy bg extends to edges.
// 512 × 0.76 = 389; round to even = 388. Margin = (512-388)/2 = 62.
const maskableInner = 388;
const maskableInset = await sharp(SRC).resize(maskableInner, maskableInner, { fit: 'cover' }).toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: NAVY } })
  .composite([{ input: maskableInset, gravity: 'center' }])
  .png()
  .toFile(path.join(PUB, 'icon-maskable-512.png'));

// OG image: 1200×630 navy canvas, mark centered at ~520px height.
const ogMark = await sharp(SRC).resize(520, 520, { fit: 'cover' }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: NAVY } })
  .composite([{ input: ogMark, gravity: 'center' }])
  .png()
  .toFile(path.join(PUB, 'og-image.png'));

// favicon.ico (multi-res: 16, 32, 48)
const icoBuffers = await Promise.all(
  [16, 32, 48].map((s) => sharp(SRC).resize(s, s, { fit: 'cover' }).png().toBuffer())
);
const ico = await pngToIco(icoBuffers);
await writeFile(path.join(PUB, 'favicon.ico'), ico);

console.log('Icon ladder generated:');
console.log('  favicon.ico (16/32/48)');
console.log('  favicon-16.png, favicon-32.png, favicon-48.png');
console.log('  apple-touch-icon.png (180×180)');
console.log('  icon-192.png, icon-512.png');
console.log('  icon-maskable-512.png (76% inset)');
console.log('  og-image.png (1200×630)');
console.log('  assets/brand/arwx-mark-1024.png');

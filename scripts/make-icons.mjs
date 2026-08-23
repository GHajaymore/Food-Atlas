/**
 * Draw the app icons from the mark itself.
 *
 *   node scripts/make-icons.mjs [--dry]
 *
 * `assets/` shipped with Expo's placeholder PNGs, and the mark lives in
 * `src/components/Logo.tsx` as geometry rather than as a picture. This renders that
 * same geometry to the six files `app.json` asks for, so the icon on a home screen
 * and the mark in the header cannot drift apart — there is one description of the
 * shape and this reads it.
 *
 * ## Why there is a rasteriser in here
 *
 * No image library, and none added for six files. The alternative was a dependency
 * (sharp, canvas, resvg — all native builds) for a mark that is four ellipses, four
 * stems and a dot. `node:zlib` already encodes what a PNG needs, the same way it
 * already unzipped the GeoNames towns.
 *
 * The shapes are sampled rather than scan-converted: every pixel takes a 4×4 grid of
 * points, each is tested against the geometry, and the fraction that land inside is
 * the pixel's coverage. That is slower than a real renderer and about fifteen lines,
 * and for shapes defined by an implicit equation it is exact enough that the edges are
 * indistinguishable from an SVG at these sizes.
 *
 * ## The one thing that differs from the component
 *
 * Android's monochrome icon is used as a *mask*: the system throws away the colour and
 * keeps the shape. The mark survives that unchanged because nothing in it is drawn at
 * partial opacity — worth stating, because the mark this replaced had three rings at
 * 45%, 70% and 90% and would have flattened into a smudge.
 */

import { deflateSync } from 'node:zlib';
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ASSET = (name) => resolve(HERE, `../assets/${name}`);

const GOLD = [0xd9, 0xa4, 0x41];
const GROUND = [0x16, 0x18, 0x26];
const WHITE = [0xff, 0xff, 0xff];

// ── PNG ────────────────────────────────────────────────────────────────────────

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let c = ~0;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return ~c >>> 0;
}

function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, crc]);
}

/** 8-bit RGBA, no interlacing. The simplest PNG there is, and all this needs. */
function encodePng(width, height, rgba) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // colour type: truecolour with alpha
  // 10..12 stay zero: deflate, adaptive filtering, no interlace.

  // Every scanline is prefixed with its filter type. Zero — "none" — because the
  // image is a flat mark on a flat ground and the encoder gains nothing from a
  // predictor it would then have to be trusted to undo.
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── The mark, as geometry ──────────────────────────────────────────────────────

/**
 * Approximate signed distance to an ellipse's outline.
 *
 * The exact distance to an ellipse has no closed form worth having. The implicit
 * function divided by the magnitude of its gradient is the standard first-order
 * approximation, and for shapes this close to circular — 8.5 by 11 — the error is far
 * below one sample.
 */
function ellipseEdge(x, y, cx, cy, rx, ry) {
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  const f = dx * dx + dy * dy - 1;
  const gx = (2 * (x - cx)) / (rx * rx);
  const gy = (2 * (y - cy)) / (ry * ry);
  const g = Math.hypot(gx, gy);
  return g === 0 ? Infinity : f / g;
}

const insideEllipse = (x, y, cx, cy, rx, ry) =>
  ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;

/** Distance to a segment, which is what gives the stems their round caps. */
function segment(x, y, x1, y1, x2, y2) {
  const vx = x2 - x1;
  const vy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((x - x1) * vx + (y - y1) * vy) / (vx * vx + vy * vy)));
  return Math.hypot(x - (x1 + t * vx), y - (y1 + t * vy));
}

/**
 * One sample point, in the 0-100 space the component draws in. Ink or not.
 *
 * Inside the disc and not inside the spoon. The whole mark, in one boolean — which is
 * the point of inverting the figure: there is no stroke width to scale, no detail to
 * drop at small sizes, and no separate small-size treatment to keep in step.
 *
 * The numbers are MARK in src/components/Logo.tsx, copied rather than imported because
 * a .tsx module with React imports cannot be read by a plain .mjs script.
 */
const MARK = {
  disc: { cx: 50, cy: 50, r: 46 },
  bowl: { cx: 50, cy: 36, rx: 13, ry: 17 },
  stem: { x: 50, top: 50, bottom: 78, halfWidth: 4.5 },
  tilt: 32,
};

function isInk(x, y) {
  const d = MARK.disc;
  if (Math.hypot(x - d.cx, y - d.cy) > d.r) return false;

  // Rotate the point against the tilt, so the spoon can be tested upright.
  const t = (-MARK.tilt * Math.PI) / 180;
  const cos = Math.cos(t), sin = Math.sin(t);
  const rx = 50 + (x - 50) * cos - (y - 50) * sin;
  const ry = 50 + (x - 50) * sin + (y - 50) * cos;

  const b = MARK.bowl;
  if (insideEllipse(rx, ry, b.cx, b.cy, b.rx, b.ry)) return false;

  const s = MARK.stem;
  if (segment(rx, ry, s.x, s.top, s.x, s.bottom) <= s.halfWidth) return false;

  return true;
}

const SUPERSAMPLE = 4;

/**
 * Render the mark to an RGBA buffer.
 *
 * `fraction` is how much of the canvas the mark fills. Android's adaptive icon crops
 * to a shape the manufacturer chooses, and only the middle two thirds is guaranteed
 * to survive, so the foreground layers are drawn smaller than the iOS icon rather
 * than the same size and hoped for.
 */
function render({ size, fraction, tint, ground }) {
  const rgba = Buffer.alloc(size * size * 4);
  const markSize = size * fraction;
  const origin = (size - markSize) / 2;

  // Stroke weight follows the *rendered* mark, the same rule the component uses: a
  // width in viewBox units shrinks with the drawing and would vanish on a small icon.
  const step = 1 / SUPERSAMPLE;

  for (let py = 0; py < size; py += 1) {
    for (let px = 0; px < size; px += 1) {
      let hits = 0;
      for (let sy = 0; sy < SUPERSAMPLE; sy += 1) {
        for (let sx = 0; sx < SUPERSAMPLE; sx += 1) {
          const x = ((px + (sx + 0.5) * step - origin) / markSize) * 100;
          const y = ((py + (sy + 0.5) * step - origin) / markSize) * 100;
          if (isInk(x, y)) hits += 1;
        }
      }

      const coverage = hits / (SUPERSAMPLE * SUPERSAMPLE);
      const at = (py * size + px) * 4;

      if (ground) {
        // Composited onto the ground, so the file has no transparency to be
        // mishandled by whatever draws it.
        for (let c = 0; c < 3; c += 1) {
          rgba[at + c] = Math.round(ground[c] * (1 - coverage) + tint[c] * coverage);
        }
        rgba[at + 3] = 255;
      } else {
        rgba[at] = tint[0];
        rgba[at + 1] = tint[1];
        rgba[at + 2] = tint[2];
        rgba[at + 3] = Math.round(coverage * 255);
      }
    }
  }

  return rgba;
}

/** A single flat colour, for the adaptive icon's background layer. */
function flat(size, colour) {
  const rgba = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i += 1) {
    rgba[i * 4] = colour[0];
    rgba[i * 4 + 1] = colour[1];
    rgba[i * 4 + 2] = colour[2];
    rgba[i * 4 + 3] = 255;
  }
  return rgba;
}

const FILES = [
  {
    name: 'icon.png',
    size: 1024,
    note: 'iOS and the store. On the ground, because iOS icons are never transparent.',
    draw: () => render({ size: 1024, fraction: 0.6, tint: GOLD, ground: GROUND }),
  },
  {
    name: 'android-icon-foreground.png',
    size: 1024,
    note: 'Adaptive foreground. Smaller, so the manufacturer’s crop cannot cut it.',
    draw: () => render({ size: 1024, fraction: 0.52, tint: GOLD, ground: null }),
  },
  {
    name: 'android-icon-background.png',
    size: 1024,
    note: 'Adaptive background. Flat ground.',
    draw: () => flat(1024, GROUND),
  },
  {
    name: 'android-icon-monochrome.png',
    size: 1024,
    note: 'Themed icons. White on transparent — the system keeps the shape and drops the colour.',
    draw: () => render({ size: 1024, fraction: 0.52, tint: WHITE, ground: null }),
  },
  {
    name: 'splash-icon.png',
    size: 512,
    note: 'Splash. Transparent, since app.json already paints the ground behind it.',
    draw: () => render({ size: 512, fraction: 0.55, tint: GOLD, ground: null }),
  },
  {
    name: 'favicon.png',
    size: 64,
    note: 'Drawn with the solid heads, because a browser shows this at 16px.',
    draw: () => render({ size: 64, fraction: 0.78, tint: GOLD, ground: GROUND }),
  },
];

const main = async () => {
  const dry = process.argv.includes('--dry');

  for (const file of FILES) {
    const png = encodePng(file.size, file.size, file.draw());
    if (!dry) await writeFile(ASSET(file.name), png);
    process.stdout.write(
      `${file.name.padEnd(30)} ${String(file.size).padStart(4)}px  ` +
        `${(png.length / 1024).toFixed(1).padStart(6)} KB   ${file.note}\n`,
    );
  }

  process.stdout.write(dry ? '\n(dry run — nothing written)\n' : '\nWritten to assets/.\n');
};

main().catch((error) => {
  process.stderr.write(`\nIcon generation failed: ${error.message}\n`);
  process.exitCode = 1;
});

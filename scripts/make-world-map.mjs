/**
 * The world map the Food Atlas page draws, prepared once and shipped as plain paths.
 *
 *   node scripts/make-world-map.mjs [110m|50m]
 *
 * Country outlines from Natural Earth (public domain, via the `world-atlas` package),
 * projected with Equal Earth — areas stay honest, so a country's share of the map is its
 * share of the land, and the shape is the one a reader already knows. Projected here,
 * at build time, so the page receives finished SVG paths and needs no projection code:
 * `d3-geo` and `topojson-client` are dev dependencies and never reach a reader.
 *
 * Each country is keyed by its ISO alpha-2 code, which is what `countryCodes.ts` already
 * joins the atlas's country names to. Coordinates are rounded to a tenth of a pixel on a
 * 1000-wide canvas, which is finer than any screen draws it and halves the file.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

const require = createRequire(import.meta.url);
const countries = require('i18n-iso-countries');

const resolution = process.argv[2] ?? "110m";
const topo = JSON.parse(await readFile(require.resolve(`world-atlas/countries-${resolution}.json`), 'utf8'));
/* Antarctica holds no food tradition and would take a sixth of the map's height. */
const all = feature(topo, topo.objects.countries);
const world = { ...all, features: all.features.filter((f) => String(f.id) !== '010') };

const WIDTH = 1000;
const projection = geoEqualEarth().fitWidth(WIDTH, world);
const path = geoPath(projection).digits(1);
const [[, y0], [, y1]] = geoPath(projection).bounds(world);
const HEIGHT = Math.ceil(y1 - y0 + 2);
projection.translate([projection.translate()[0], projection.translate()[1] - y0 + 1]);

const shapes = [];
const unmatched = [];
for (const f of world.features) {
  /* Kosovo has no ISO numeric code, and Natural Earth gives it none; XK is the code
     everyone uses for it, including `countryCodes.ts`. */
  const a2 = f.id ? countries.numericToAlpha2(String(f.id).padStart(3, '0')) : f.properties?.name === 'Kosovo' ? 'XK' : undefined;
  const d = path(f);
  if (!d) continue;
  if (!a2) {
    unmatched.push(f.properties?.name ?? '?');
    continue;
  }
  shapes.push({ a2, d });
}

/*
 * The small states the coarse outlines leave out — Singapore, Malta, Bahrain, Mauritius,
 * most of the Caribbean — come from the finer file as a single point each, drawn as a
 * dot. Measured on 9 October: the coarse file is 42 KB compressed with 175 countries and
 * the fine one 309 KB with 237. A food atlas cannot drop Singapore, and a page cannot
 * carry a third of a megabyte for it; one point per missing state costs almost nothing.
 */
const have = new Set(shapes.map((s) => s.a2));
const fine = JSON.parse(await readFile(require.resolve('world-atlas/countries-50m.json'), 'utf8'));
const dots = [];
for (const f of feature(fine, fine.objects.countries).features) {
  const a2 = f.id ? countries.numericToAlpha2(String(f.id).padStart(3, '0')) : undefined;
  if (!a2 || have.has(a2)) continue;
  const [x, y] = geoPath(projection).centroid(f);
  if (Number.isFinite(x) && Number.isFinite(y)) dots.push({ a2, c: [Math.round(x * 10) / 10, Math.round(y * 10) / 10] });
}

const out = { width: WIDTH, height: HEIGHT, source: 'Natural Earth (public domain), Equal Earth projection', countries: shapes, dots };
const json = JSON.stringify(out);
await writeFile(new URL('../public/data/world-map.json', import.meta.url), json);
console.log(`${resolution}: ${shapes.length} countries, ${(json.length / 1024).toFixed(0)} KB, ${WIDTH}x${HEIGHT}; unmatched: ${unmatched.join(', ') || 'none'}`);

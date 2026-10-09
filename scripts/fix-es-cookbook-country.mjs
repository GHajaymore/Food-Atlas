/**
 * File Spanish-cookbook recipes under the country their own page names.
 *
 *   node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs \
 *     scripts/fix-es-cookbook-country.mjs [--dry] [--cache revs.json]
 *
 * ## What was wrong
 *
 * The multilingual ingest gave every Spanish-language recipe the book's country, Spain —
 * 811 of 836. The book is written across the Spanish-speaking world, and each page says
 * where its dish is from in a category: Bandeja paisa is in "Categoría:Gastronomía de
 * Colombia", Chiles en nogada in "…de México", four kinds of Arroz chaufa in "…de Perú".
 * The ingest read the template and ignored the categories, so all of them were Spanish
 * dishes on the atlas.
 *
 * ## The rule
 *
 * The exact revision each row was read from is fetched, so the page cannot have moved
 * since. A recipe moves only when its page names exactly one country in a
 * "Gastronomía de …" category, that country is not Spain, and the page does not also
 * name Spain — a page in two countries' categories is a shared dish and keeps the
 * book's answer. "Cocina chilota" is Chiloé, and names Chile.
 *
 * The country must be one the atlas files under (`isCountry`). The cookbook builder
 * drops a row it cannot place, and cookbook ids are positions in what it keeps — so a
 * move to anything else would renumber every recipe after it.
 *
 * Rows already placed by `fix-cookbook-origin.mjs` (`countryFromCatalogue`) are left
 * alone. Each moved row records the category that moved it in `countryBy`.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isCountry } from '../src/domain/continents.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(HERE, '../src/data/cookbook.json');
const AGENT = 'WikiFoodia-data-repair/1.0 (https://wikifoodia.ajailabs.app; contact@ajailabs.app)';
const dry = process.argv.includes('--dry');
const cacheAt = process.argv.indexOf('--cache');
const cachePath = cacheAt > -1 ? process.argv[cacheAt + 1] : null;

/** The Spanish names the categories use, to the names the atlas files under. */
const COUNTRY = {
  'España': 'Spain', Guatemala: 'Guatemala', Chile: 'Chile', 'Perú': 'Peru', Colombia: 'Colombia',
  'México': 'Mexico', Italia: 'Italy', Argentina: 'Argentina', Bolivia: 'Bolivia', Uruguay: 'Uruguay',
  Ecuador: 'Ecuador', Francia: 'France', Serbia: 'Serbia', Venezuela: 'Venezuela', Alemania: 'Germany',
  Austria: 'Austria', 'Hungría': 'Hungary', Letonia: 'Latvia', Polonia: 'Poland', Rusia: 'Russia',
  Suiza: 'Switzerland', 'Costa Rica': 'Costa Rica', Macedonia: 'North Macedonia', 'Túnez': 'Tunisia',
  'República Dominicana': 'Dominican Republic', Marruecos: 'Morocco', 'El Salvador': 'El Salvador',
  'Japón': 'Japan', 'Estados Unidos': 'United States', Tailandia: 'Thailand', Cuba: 'Cuba',
  Honduras: 'Honduras', Nicaragua: 'Nicaragua', 'Panamá': 'Panama', Paraguay: 'Paraguay',
  'Puerto Rico': 'Puerto Rico', Filipinas: 'Philippines', 'China': 'China', India: 'India',
};

const rows = JSON.parse(await readFile(SOURCE, 'utf8'));
const work = rows.filter((row) => /^es:/.test(row.title ?? '') && row.rev && !row.countryFromCatalogue);

let pages = cachePath ? (JSON.parse(await readFile(cachePath, 'utf8')).es ?? {}) : {};
const missing = work.filter((row) => !(row.rev in pages)).map((row) => row.rev);
for (let i = 0; i < missing.length; i += 50) {
  const url = `https://es.wikibooks.org/w/api.php?action=query&prop=revisions&revids=${missing.slice(i, i + 50).join('|')}&rvprop=ids|content&rvslots=main&format=json&formatversion=2`;
  const response = await fetch(url, { headers: { 'User-Agent': AGENT } });
  const data = JSON.parse(await response.text());
  for (const page of data.query?.pages ?? []) for (const v of page.revisions ?? []) pages[v.revid] = v.slots?.main?.content ?? '';
  await new Promise((done) => setTimeout(done, 1000));
}

const moved = [];
const skipped = { shared: 0, unknownName: new Set(), notACountry: new Set() };
for (const row of work) {
  const text = pages[row.rev] ?? '';
  const named = new Set();
  for (const m of text.matchAll(/\[\[\s*Categor[ií]a\s*:\s*Gastronom[ií]a de ([^|\]]+?)\s*[|\]]/gi)) {
    const name = m[1].trim();
    if (/^la provincia|^Vizcaya|^Am[ée]rica Latina/i.test(name)) continue; // places within Spain, or a continent
    const country = COUNTRY[name] ?? COUNTRY[name[0].toUpperCase() + name.slice(1)];
    if (!country) {
      skipped.unknownName.add(name);
      continue;
    }
    named.add(country);
  }
  if (/\[\[\s*Categor[ií]a\s*:\s*Cocina chilota/i.test(text)) named.add('Chile');
  if (named.size !== 1) {
    if (named.size > 1) skipped.shared++;
    continue;
  }
  const [country] = named;
  if (country === 'Spain' || country === row.country) continue;
  if (!isCountry(country)) {
    skipped.notACountry.add(country);
    continue;
  }
  moved.push(`${row.name} → ${country}`);
  if (!dry) {
    row.country = country;
    row.countryBy = `Its page is filed under "Gastronomía de" ${country} on Spanish Wikibooks.`;
  }
}

console.log(`${moved.length} moved; ${skipped.shared} shared between countries, left alone.`);
if (skipped.unknownName.size) console.log(`category names not in the table: ${[...skipped.unknownName].join(', ')}`);
if (skipped.notACountry.size) console.log(`not a country the atlas files under: ${[...skipped.notACountry].join(', ')}`);
console.log(moved.join('\n'));
if (!dry && moved.length) {
  /* One-space indent and a closing newline: the file's own format. */
  await writeFile(SOURCE, `${JSON.stringify(rows, null, 1)}\n`, 'utf8');
  console.log(`written: ${SOURCE}`);
}

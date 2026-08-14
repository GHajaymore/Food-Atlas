/**
 * More places, from each article's own categories.
 *
 *   node scripts/enrich-places.mjs [--limit 2000]
 *
 * The infobox pass took distinct places from 69 to 397, but an infobox only helps
 * where an article has one and fills `place_of_origin`. Most do not.
 *
 * An article's *categories* are a second, largely disjoint signal, and a much denser
 * one: a dish sits in "Category:Kerala cuisine", "Category:Cuisine of Hyderabad",
 * "Category:Tamil Nadu cuisine" whether or not anyone wrote an infobox. Categories
 * come back 50 titles per request, so this is cheap.
 *
 * Only categories that name a *place* are used. "Category:Indian breads" and
 * "Category:Vegetarian dishes" describe a kind of food and are ignored — a place
 * has to be somewhere.
 *
 * Existing regions are not overwritten: the infobox states where a dish is from,
 * while a category states where it is eaten or written about, so the infobox is the
 * better claim where both exist.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CUISINES = resolve(HERE, '../src/data/cuisines.json');

const API = 'https://en.wikipedia.org/w/api.php';
const USER_AGENT = 'GlobalTaste/1.0 (food atlas ingest; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params, attempt = 1) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });

  if (res.status === 429 || res.status >= 500) {
    if (attempt > 5) throw new Error(`HTTP ${res.status} after ${attempt} attempts`);
    await sleep(4000 * attempt);
    return api(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Words that mean a category describes a kind of food rather than a place.
 * A category has to name somewhere to be usable as a region.
 */
const NOT_A_PLACE =
  /\b(dish|dishes|cuisine of the|food|foods|bread|breads|dessert|desserts|snack|snacks|soup|soups|stew|stews|sweet|sweets|drink|drinks|beverage|salad|noodle|rice dish|street food|vegetarian|vegan|halal|kosher|breakfast|festival|christmas|ramadan|diwali|stub|wikipedia|articles|pages|category)\b/i;

/**
 * Demonyms naming another country.
 *
 * Cuisine trees cross-list — "Afghan cuisine" sits under Indian cuisine — so without
 * this an Afghan dish arrives labelled as a region *of India*. A record reading
 * "India › Afghan" asserts a geography that does not exist, and wrong geography is
 * worse than none in an atlas whose whole claim is geographic precision.
 */
const FOREIGN_DEMONYM =
  /^(afghan|burmese|bolivian|cambodian|nepalese|nepali|tibetan|thai|chinese|japanese|korean|persian|iranian|arab|arabic|turkish|jewish|portuguese|british|english|french|italian|mexican|caribbean|indo-caribbean|anglo-indian|american|african|european|asian|bangladeshi|pakistani|sri lankan|malaysian|indonesian|filipino|vietnamese|russian|german|spanish|greek)$/i;

/** Category patterns that do name a place. */
const PLACE_PATTERNS = [
  /^(.+?)\s+cuisine$/i, // "Kerala cuisine"
  /^cuisine of (?:the\s+)?(.+)$/i, // "Cuisine of Hyderabad"
  /^(.+?)\s+cuisine by/i,
];

/**
 * Pull a place name out of a category title, or return ''.
 *
 * Conservative on purpose: a wrong region is worse than a missing one, because it
 * asserts a geographic precision the record has not earned.
 */
function placeFromCategory(title, country) {
  const name = title.replace(/^Category:/, '').trim();
  if (NOT_A_PLACE.test(name)) return '';

  for (const pattern of PLACE_PATTERNS) {
    const match = name.match(pattern);
    if (!match) continue;

    const place = match[1].trim();
    if (!place || place.length < 3 || place.length > 40) continue;
    // The country itself is not a region below the country.
    if (place.toLowerCase() === country.toLowerCase()) continue;
    // A demonym names a country, not a region inside the one we filed this under.
    if (FOREIGN_DEMONYM.test(place)) continue;
    // Continents and supra-national regions are not places below a country either.
    if (/^(south|north|east|west|central)?\s*(asia|africa|europe|america|subcontinent)$/i.test(place)) continue;
    return place;
  }
  return '';
}

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

async function mergeWrite(path, updates) {
  let current = [];
  try {
    current = JSON.parse(await readFile(path, 'utf8'));
  } catch {
    current = [];
  }
  const byTitle = new Map(current.map((r) => [r.title, r]));
  for (const [title, patch] of updates) {
    const existing = byTitle.get(title);
    if (existing) Object.assign(existing, patch);
  }
  await writeFile(path, JSON.stringify([...byTitle.values()]), 'utf8');
  return byTitle.size;
}

const main = async () => {
  const limitArg = process.argv.indexOf('--limit');
  const limit = limitArg > -1 ? Number(process.argv[limitArg + 1]) : 0;

  const rows = JSON.parse(await readFile(CUISINES, 'utf8'));
  const byTitle = new Map(rows.map((r) => [r.title, r]));

  // Rows without a region are the ones worth asking about.
  const pending = rows.filter((r) => !r.region && !r.categoriesChecked);
  const targets = limit ? pending.slice(0, limit) : pending;

  process.stdout.write(`${rows.length} rows, ${targets.length} without a place.\n`);

  const updates = new Map();
  let gained = 0;

  const batches = chunk(targets, 50);
  for (const [i, batch] of batches.entries()) {
    try {
      const data = await api({
        action: 'query',
        prop: 'categories',
        cllimit: 'max',
        clshow: '!hidden',
        titles: batch.map((r) => r.title).join('|'),
        redirects: '1',
      });

      for (const page of data?.query?.pages ?? []) {
        const row = byTitle.get(page.title);
        if (!row) continue;

        const patch = { categoriesChecked: true };
        for (const category of page.categories ?? []) {
          const place = placeFromCategory(category.title, row.country);
          if (place) {
            patch.region = place;
            gained += 1;
            break;
          }
        }
        Object.assign(row, patch);
        updates.set(page.title, patch);
      }
    } catch (error) {
      process.stdout.write(`  batch ${i + 1} failed (${error.message})\n`);
    }

    if (i % 10 === 0) {
      process.stdout.write(`  batch ${i + 1}/${batches.length} — ${gained} places found\n`);
      await mergeWrite(CUISINES, updates);
    }
    await sleep(300);
  }

  await mergeWrite(CUISINES, updates);

  const fresh = JSON.parse(await readFile(CUISINES, 'utf8'));
  const places = new Set(fresh.filter((r) => r.region).map((r) => `${r.country}|${r.region}`));
  process.stdout.write(
    `\n${gained} rows gained a place from their categories.\n` +
      `  ${places.size} distinct places now recorded.\n` +
      `  ${fresh.filter((r) => r.region).length} of ${fresh.length} rows are placed below country level.\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nPlace enrichment failed: ${error.message}\n`);
  process.exitCode = 1;
});

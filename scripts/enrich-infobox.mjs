/**
 * Real places, from the article infobox.
 *
 *   node scripts/enrich-infobox.mjs [--limit 2000]
 *
 * The cuisine ingest took each dish's region from the Wikipedia *subcategory* it was
 * found under — "Goan", "Andhra", "Mughlai". Those are cuisine groupings, not places,
 * and most dishes sit in a top-level category with no hint at all: 1,201 Indian
 * dishes yielded 69 distinct regions, which is nothing like the real geography.
 *
 * `{{Infobox food}}` carries the fields that actually answer it:
 *
 *   place_of_origin  → the town or state a dish is from — the depth the atlas wants
 *   region           → the region, where the article distinguishes it from the country
 *   main_ingredient  → traditional ingredients, which the evidence assessment scores
 *   course           → when it is eaten, which feeds the meal occasion
 *
 * All free, all from an API this already talks to. Nothing here invents a method:
 * the infobox says what a dish is made of, not how, so `steps` stays empty and the
 * technique check stays open.
 *
 * Writes back into src/data/cuisines.json and src/data/catalogue.json in place.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CUISINES = resolve(HERE, '../src/data/cuisines.json');
const CATALOGUE = resolve(HERE, '../src/data/catalogue.json');

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

/** Strip wiki markup down to plain text. */
const clean = (value) =>
  value
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\{\{(?:nowrap|nobold|small)\|([^}]*)\}\}/gi, '$1')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<ref[^>]*\/>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/'''?/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Pull the named fields out of an `{{Infobox food}}`.
 *
 * Brace-counted rather than regexed to the closing `}}`, because infobox values
 * routinely contain nested templates and a lazy match stops at the wrong place.
 */
function infobox(wikitext) {
  const start = wikitext.search(/\{\{\s*Infobox\s+(food|prepared food|dish)/i);
  if (start === -1) return null;

  let depth = 0;
  let end = start;
  for (let i = start; i < wikitext.length - 1; i++) {
    if (wikitext[i] === '{' && wikitext[i + 1] === '{') {
      depth += 1;
      i += 1;
    } else if (wikitext[i] === '}' && wikitext[i + 1] === '}') {
      depth -= 1;
      i += 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  const block = wikitext.slice(start, end);
  const fields = {};

  // Split on pipes that sit at the infobox's own depth, so nested templates survive.
  let buffer = '';
  let nest = 0;
  for (let i = 0; i < block.length; i++) {
    const two = block.slice(i, i + 2);
    if (two === '{{' || two === '[[') nest += 1;
    if (two === '}}' || two === ']]') nest -= 1;

    if (block[i] === '|' && nest <= 1) {
      const eq = buffer.indexOf('=');
      if (eq > -1) fields[buffer.slice(0, eq).trim().toLowerCase()] = clean(buffer.slice(eq + 1));
      buffer = '';
    } else {
      buffer += block[i];
    }
  }
  const eq = buffer.indexOf('=');
  if (eq > -1) fields[buffer.slice(0, eq).trim().toLowerCase()] = clean(buffer.slice(eq + 1).replace(/\}\}$/, ''));

  return fields;
}

/** 'Kozhikode, Kerala, India' → the most specific part that is not the country. */
function placeFrom(fields, country) {
  const raw = fields['place_of_origin'] || fields['region'] || '';
  if (!raw) return '';

  const parts = raw
    .split(/[,;/]| and /)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => p.toLowerCase() !== country.toLowerCase())
    .filter((p) => p.length > 2 && p.length < 40)
    .filter((p) => !/^(various|worldwide|global|international|unknown|n\/a)$/i.test(p));

  return parts[0] ?? '';
}

const listFrom = (value) =>
  (value || '')
    .split(/[,;]| and /)
    .map((p) => p.trim())
    .filter((p) => p.length > 1 && p.length < 40)
    .slice(0, 8);

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

/**
 * Merge this pass's findings into whatever is on disk *now*, rather than writing a
 * copy held since startup.
 *
 * The ingest checkpoints to the same file, so a straight write silently discards
 * every row it added in the meantime — which is exactly what happened on the first
 * run of this script, losing 65 places and 82 ingredient lists. Re-reading before
 * each write makes the two safe to overlap.
 */
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
    else byTitle.set(title, patch);
  }

  await writeFile(path, JSON.stringify([...byTitle.values()]), 'utf8');
  return byTitle.size;
}

const main = async () => {
  const limitArg = process.argv.indexOf('--limit');
  const limit = limitArg > -1 ? Number(process.argv[limitArg + 1]) : 0;

  const cuisines = JSON.parse(await readFile(CUISINES, 'utf8'));

  // Only rows that still lack a real place are worth the fetch.
  const pending = cuisines.filter((r) => !r.infobox);
  const targets = limit ? pending.slice(0, limit) : pending;
  process.stdout.write(`${cuisines.length} cuisine rows, ${targets.length} to enrich.\n`);

  const byTitle = new Map(cuisines.map((r) => [r.title, r]));
  /** Only what this pass established, so a merge never rewrites another writer's rows. */
  const updates = new Map();
  let gainedPlace = 0;
  let gainedIngredients = 0;

  const batches = chunk(targets, 20);
  for (const [i, batch] of batches.entries()) {
    try {
      const data = await api({
        action: 'query',
        prop: 'revisions',
        rvprop: 'content',
        rvslots: 'main',
        titles: batch.map((r) => r.title).join('|'),
        redirects: '1',
      });

      for (const page of data?.query?.pages ?? []) {
        const text = page?.revisions?.[0]?.slots?.main?.content;
        const row = byTitle.get(page.title);
        if (!row) continue;

        const patch = { infobox: true }; // fetched, whether or not it had one
        const fields = text ? infobox(text) : null;

        if (fields) {
          const place = placeFrom(fields, row.country);
          if (place && place !== row.region) {
            patch.region = place;
            gainedPlace += 1;
          }

          const ingredients = listFrom(fields['main_ingredient']);
          if (ingredients.length) {
            patch.ingredients = ingredients;
            gainedIngredients += 1;
          }

          const course = fields['course'] || fields['served'] || '';
          if (course) patch.course = course.slice(0, 60);
        }

        Object.assign(row, patch);
        updates.set(page.title, patch);
      }
    } catch (error) {
      process.stdout.write(`  batch ${i + 1} failed (${error.message})\n`);
    }

    if (i % 10 === 0) {
      process.stdout.write(
        `  batch ${i + 1}/${batches.length} — ${gainedPlace} places, ${gainedIngredients} ingredient lists\n`,
      );
      await mergeWrite(CUISINES, updates);
    }
    // Slower than the ingest's own pacing: when both run, they share one quota.
    await sleep(400);
  }

  const finalCount = await mergeWrite(CUISINES, updates);
  process.stdout.write(`\n${finalCount} rows on disk after merge.\n`);

  const places = new Set(cuisines.filter((r) => r.region).map((r) => `${r.country}|${r.region}`));
  process.stdout.write(
    `\nEnriched. ${gainedPlace} rows gained a real place, ${gainedIngredients} gained ingredients.\n` +
      `  ${places.size} distinct places now recorded across the cuisine source.\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nInfobox enrichment failed: ${error.message}\n`);
  process.exitCode = 1;
});

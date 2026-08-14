/**
 * Resolve the things that are not countries.
 *
 *   node scripts/resolve-countries.mjs [--dry]
 *
 * Wikidata's country-of-origin returns whatever the editor put there, so the import
 * arrived with 271 distinct "countries" — including Valencian Community, Vojvodina,
 * Xikou, Wu and Acadia. Those are regions, historical states and towns. Left alone
 * they inflate the country count, land in "Elsewhere" because no continent maps
 * them, and waste real geographic depth that is already sitting in the field.
 *
 * Wikidata knows the answer, so this asks rather than hand-writing 143 mappings:
 * P17 (country) on each entity. Where it resolves, the entity moves down into the
 * region and the parent becomes the country — "Spain › Valencian Community" — which
 * turns noise into exactly the precision the atlas wants.
 *
 * Two categories are deliberately left alone:
 *
 *   - **Supra-national regions** — "Indian subcontinent", "Middle East". They cannot
 *     resolve downward; a dish of the subcontinent is not a dish of one country.
 *   - **Disputed territories** — Taiwan, Palestine, Kosovo, Abkhazia and the like.
 *     Folding these into a parent is a political statement, and this app refuses to
 *     make those elsewhere: its whole Origin & Cultural Attribution model exists to
 *     record competing claims rather than settle them. Auto-resolving here would
 *     contradict the product's own stance, in a way readers from those places would
 *     notice immediately.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CATALOGUE = resolve(HERE, '../src/data/catalogue.json');

const ENDPOINT = 'https://query.wikidata.org/sparql';
const USER_AGENT = 'GlobalTaste/1.0 (food atlas ingest; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Left standing on their own — see the note above. This is a stance, not an oversight. */
const CONTESTED = new Set(
  [
    'Taiwan',
    'Palestine',
    'State of Palestine',
    'Kosovo',
    'Abkhazia',
    'South Ossetia',
    'Northern Cyprus',
    'Western Sahara',
    'Transnistria',
    'Hong Kong',
    'Macau',
    'Tibet',
  ].map((s) => s.toLowerCase()),
);

/** Cannot resolve downward: a dish of a subcontinent is not a dish of one country. */
const SUPRANATIONAL = /(subcontinent|middle east|balkans|caucasus|scandinavia|maghreb|levant|caribbean|africa|asia|europe|america|oceania|mediterranean|arab world|central asia)/i;

async function sparql(query, attempt = 1) {
  const url = `${ENDPOINT}?format=json&query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/sparql-results+json', 'User-Agent': USER_AGENT },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return JSON.parse(await res.text()).results.bindings;
  } catch (error) {
    if (attempt < 3) {
      await sleep(3000 * attempt);
      return sparql(query, attempt + 1);
    }
    throw error;
  }
}

/**
 * For a batch of place labels: is it a sovereign state, and if not, what country is
 * it in? Asking by label rather than by id because the import stored labels.
 */
const resolveQuery = (labels) => `
SELECT ?label ?sovereign ?countryLabel WHERE {
  VALUES ?label { ${labels.map((l) => `"${l.replace(/["\\]/g, '\\$&')}"@en`).join(' ')} }
  ?entity rdfs:label ?label .
  OPTIONAL { ?entity wdt:P31 ?class . BIND(IF(?class = wd:Q3624078, true, false) AS ?sovereign) }
  OPTIONAL { ?entity wdt:P17 ?country . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
`;

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const main = async () => {
  const dry = process.argv.includes('--dry');
  const rows = JSON.parse(await readFile(CATALOGUE, 'utf8'));

  const labels = [...new Set(rows.map((r) => r.country).filter(Boolean))];
  process.stdout.write(`${labels.length} distinct country values to check.\n`);

  const sovereign = new Set();
  const parentOf = new Map();

  for (const [i, batch] of chunk(labels, 40).entries()) {
    try {
      for (const row of await sparql(resolveQuery(batch))) {
        const label = row.label?.value;
        if (!label) continue;
        if (row.sovereign?.value === 'true') sovereign.add(label);
        const parent = row.countryLabel?.value;
        if (parent && parent !== label && !/^Q\d+$/.test(parent) && !parentOf.has(label)) {
          parentOf.set(label, parent);
        }
      }
      process.stdout.write(`  batch ${i + 1}: ${sovereign.size} sovereign, ${parentOf.size} resolvable\n`);
    } catch (error) {
      process.stdout.write(`  batch ${i + 1} failed (${error.message})\n`);
    }
    await sleep(600);
  }

  let moved = 0;
  let leftAlone = 0;

  for (const row of rows) {
    const country = row.country;
    if (!country || sovereign.has(country)) continue;
    if (CONTESTED.has(country.toLowerCase()) || SUPRANATIONAL.test(country)) {
      leftAlone += 1;
      continue;
    }

    const parent = parentOf.get(country);
    if (!parent) continue;

    // The entity was never a country — it is the region, and now it says so.
    if (!row.region) row.region = country;
    row.country = parent;
    moved += 1;
  }

  const after = new Set(rows.map((r) => r.country));
  process.stdout.write(
    `\n${moved} records moved under a real country.\n` +
      `  ${leftAlone} left standing (contested or supra-national).\n` +
      `  distinct countries: ${labels.length} → ${after.size}\n`,
  );

  if (dry) {
    process.stdout.write('\n--dry: nothing written.\n');
    return;
  }
  await writeFile(CATALOGUE, JSON.stringify(rows), 'utf8');
  process.stdout.write('Written.\n');
};

main().catch((error) => {
  process.stderr.write(`\nResolve failed: ${error.message}\n`);
  process.exitCode = 1;
});

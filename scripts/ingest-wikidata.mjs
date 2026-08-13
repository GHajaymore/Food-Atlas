/**
 * Ingest the world's dishes from Wikidata.
 *
 *   node scripts/ingest-wikidata.mjs
 *
 * Six hand-written records is a design fixture, not an atlas. This pulls every item
 * Wikidata classifies as a dish or a food with a country of origin — thousands of
 * them, across every continent — with its place, its Commons photograph and its
 * Wikidata id, and writes them to `src/data/catalogue.json`.
 *
 * What it does NOT do, deliberately:
 *
 *   - It does not invent a recipe. An imported record carries no ingredients, no
 *     equipment and no method, because Wikidata does not carry a reliable
 *     preparation and the brief forbids filling that in by assumption.
 *   - It does not assign an authenticity score. Every import lands as
 *     `unverified` — a valid, publishable state — with the evidence checks still
 *     open. A score is earned by the assessment and community validation, not by
 *     having been imported.
 *   - It does not guess the dietary classification. `unclassified` until the record
 *     describes its preparation.
 *
 * So the atlas becomes global in coverage immediately, and honest about the fact
 * that coverage is not the same as evidence. Community contributions and the
 * evidence pipeline are what turn an import into an authentic record.
 *
 * Licensing: Wikidata is CC0. The photographs are Wikimedia Commons and carry their
 * own licences, several CC BY-SA — which is why every record keeps its credit and
 * the app displays it wherever the image is shown.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../src/data/catalogue.json');

const ENDPOINT = 'https://query.wikidata.org/sparql';
const USER_AGENT = 'GlobalTaste/1.0 (authenticity-first food atlas; contact: via repository)';

/**
 * The root classes to walk. Kept as separate queries rather than one UNION: the
 * public SPARQL endpoint has a 60-second budget, and a UNION across two subclass
 * traversals with several OPTIONALs blows through it and returns a truncated body.
 */
const ROOTS = [
  { qid: 'Q746549', label: 'dish' },
  { qid: 'Q2095', label: 'food' },
];

/**
 * The countries that have any dish recorded. Cheap, and it gives us the partition
 * key for everything that follows.
 */
const COUNTRIES_QUERY = `
SELECT DISTINCT ?country ?countryLabel WHERE {
  { ?item wdt:P31/wdt:P279* wd:Q746549 . } UNION { ?item wdt:P31/wdt:P279* wd:Q2095 . }
  ?item wdt:P495 ?country .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
`;

/**
 * Every dish of one country.
 *
 * Partitioning by country rather than by LIMIT/OFFSET is the whole trick: a deep
 * OFFSET makes the endpoint recompute and re-sort the entire result set for each
 * page, which times out. Anchoring on `wdt:P495 wd:<country>` starts the planner
 * from a small set, so each query returns in well under the 60-second budget.
 *
 * `?itemDescription` comes free from the label service — far cheaper than an
 * OPTIONAL over schema:description. P131 is affordable at this scale.
 */
const countryQuery = (country) => `
SELECT ?item ?itemLabel ?itemDescription ?image ?regionLabel WHERE {
  { ?item wdt:P31/wdt:P279* wd:Q746549 . } UNION { ?item wdt:P31/wdt:P279* wd:Q2095 . }
  ?item wdt:P495 wd:${country} .
  OPTIONAL { ?item wdt:P18 ?image . }
  OPTIONAL { ?item wdt:P131 ?region . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
`;

const CONTINENTS = {
  Asia: [
    'India', 'China', 'Japan', 'South Korea', 'North Korea', 'Thailand', 'Vietnam', 'Indonesia', 'Malaysia',
    'Philippines', 'Singapore', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Myanmar', 'Cambodia', 'Laos',
    'Mongolia', 'Iran', 'Iraq', 'Turkey', 'Israel', 'Lebanon', 'Syria', 'Jordan', 'Saudi Arabia', 'Yemen',
    'United Arab Emirates', 'Kuwait', 'Qatar', 'Oman', 'Afghanistan', 'Uzbekistan', 'Kazakhstan', 'Georgia',
    'Armenia', 'Azerbaijan', 'Taiwan', 'Hong Kong', 'Bhutan', 'Maldives', 'Brunei', 'Kyrgyzstan', 'Tajikistan',
    'Turkmenistan',
  ],
  Europe: [
    'Italy', 'France', 'Spain', 'Portugal', 'Germany', 'United Kingdom', 'England', 'Scotland', 'Wales', 'Ireland',
    'Greece', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Poland', 'Czech Republic', 'Slovakia', 'Hungary',
    'Romania', 'Bulgaria', 'Serbia', 'Croatia', 'Slovenia', 'Bosnia and Herzegovina', 'Montenegro', 'Albania',
    'North Macedonia', 'Greece', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland', 'Estonia', 'Latvia',
    'Lithuania', 'Russia', 'Ukraine', 'Belarus', 'Moldova', 'Malta', 'Cyprus', 'Luxembourg', 'Kosovo',
  ],
  Africa: [
    'Egypt', 'Morocco', 'Algeria', 'Tunisia', 'Libya', 'Sudan', 'Ethiopia', 'Eritrea', 'Somalia', 'Kenya',
    'Tanzania', 'Uganda', 'Rwanda', 'Burundi', 'Nigeria', 'Ghana', 'Senegal', 'Mali', 'Ivory Coast', 'Cameroon',
    'South Africa', 'Zimbabwe', 'Zambia', 'Mozambique', 'Angola', 'Namibia', 'Botswana', 'Madagascar', 'Congo',
    'Democratic Republic of the Congo', 'Benin', 'Burkina Faso', 'Niger', 'Chad', 'Guinea', 'Sierra Leone',
    'Liberia', 'Togo', 'Gambia', 'Mauritania', 'Malawi', 'Lesotho', 'Eswatini', 'Mauritius', 'Tunisia',
  ],
  'North America': [
    'United States', 'United States of America', 'Canada', 'Mexico', 'Guatemala', 'Cuba', 'Jamaica', 'Haiti',
    'Dominican Republic', 'Puerto Rico', 'Costa Rica', 'Panama', 'Honduras', 'El Salvador', 'Nicaragua', 'Belize',
    'Trinidad and Tobago', 'Barbados', 'Bahamas',
  ],
  'South America': [
    'Brazil', 'Argentina', 'Peru', 'Colombia', 'Chile', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay',
    'Guyana', 'Suriname',
  ],
  Oceania: ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Samoa', 'Tonga', 'Vanuatu', 'Solomon Islands'],
};

const continentOf = (country) => {
  for (const [continent, countries] of Object.entries(CONTINENTS)) {
    if (countries.includes(country)) return continent;
  }
  return 'Elsewhere';
};

/** Wikidata labels fall back to the Q-id when a language label is missing. */
const isQid = (value) => /^Q\d+$/.test(value ?? '');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * One SPARQL request. A timed-out query returns a 200 with a truncated body, so a
 * JSON parse failure is treated as a retryable timeout rather than a crash.
 */
async function runQuery(query, attempt = 1) {
  const url = `${ENDPOINT}?format=json&query=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/sparql-results+json', 'User-Agent': USER_AGENT },
    });
    if (response.status === 429) {
      await sleep(5000 * attempt);
      if (attempt < 4) return runQuery(query, attempt + 1);
      throw new Error('rate limited by Wikidata');
    }
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);

    const body = await response.text();
    return JSON.parse(body).results.bindings;
  } catch (error) {
    if (attempt < 3) {
      process.stdout.write(`    retrying (${error.message.slice(0, 60)})\n`);
      await sleep(3000 * attempt);
      return runQuery(query, attempt + 1);
    }
    throw error;
  }
}


/**
 * The compact import row.
 *
 * Every imported record carries the same badge, the same empty method, the same
 * disclaimer and the same "not classified" diet — so storing those 7,900 times would
 * be several megabytes of identical strings shipped in the app bundle. Only the
 * fields that actually differ per dish are written here; `src/data/catalogue.ts`
 * expands each row into a full Dish at load, applying the shared constants once.
 */
function toRecord(row, id, country, regionLabel) {
  const name = row.itemLabel?.value ?? '';
  if (!name || !country || isQid(name)) return null;

  // Region only where Wikidata actually has one, and only where it resolved to a
  // real label. An empty level is normal — the app skips levels that do not apply.
  const region = regionLabel && regionLabel !== country ? regionLabel : '';

  const qid = (row.item?.value ?? '').split('/').pop();
  const breadcrumb = [country, region].filter(Boolean);

  const description = row.itemDescription?.value ?? '';

  return {
    id,
    name,
    country,
    region,
    continent: continentOf(country),
    qid,
    // Wikidata's own one-line description, where it has one.
    blurb: description,
    photo: row.image?.value ?? '',
  };
}

/** What is already on disk, so a re-run tops up rather than starting over. */
async function loadExisting() {
  try {
    const text = await readFile(OUT, 'utf8');
    const rows = JSON.parse(text);
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

const main = async () => {
  // The public endpoint times out on a fraction of countries every run, so the
  // script is resumable: `--missing` re-queries only the countries that produced
  // nothing last time, and results always merge into what is already there.
  const onlyMissing = process.argv.includes('--missing');

  const existing = await loadExisting();
  process.stdout.write(`${existing.length} dishes already on disk.\n`);

  process.stdout.write('Finding countries with recorded dishes…\n');
  const countryRows = await runQuery(COUNTRIES_QUERY);

  const covered = new Set(existing.map((r) => r.country));

  const countries = countryRows
    .map((row) => ({
      qid: (row.country?.value ?? '').split('/').pop(),
      label: row.countryLabel?.value ?? '',
    }))
    .filter((c) => c.qid && c.label && !isQid(c.label))
    .filter((c) => !onlyMissing || !covered.has(c.label))
    .sort((a, b) => a.label.localeCompare(b.label));

  process.stdout.write(
    `${countries.length} countries to fetch${onlyMissing ? ' (missing only)' : ''}. Fetching dishes per country…\n`,
  );

  // One record per Q-id; a row carrying a photograph or a region wins.
  const seen = new Map();
  let failures = 0;

  for (const [index, country] of countries.entries()) {
    try {
      const rows = await runQuery(countryQuery(country.qid));
      for (const row of rows) {
        const qid = (row.item?.value ?? '').split('/').pop();
        if (!qid) continue;
        const score = (row.image ? 2 : 0) + (row.regionLabel ? 1 : 0);
        const existing = seen.get(qid);
        if (!existing || score > existing.score) {
          seen.set(qid, { row, score, country: country.label });
        }
      }
      process.stdout.write(`  [${index + 1}/${countries.length}] ${country.label}: ${rows.length}\n`);
    } catch (error) {
      // One country failing must not lose the other 190.
      failures += 1;
      process.stdout.write(`  [${index + 1}/${countries.length}] ${country.label}: failed (${error.message})\n`);
    }
    await sleep(300); // stay a polite client of a free public endpoint
  }

  // Merge with what was already on disk, keyed by Wikidata id so a re-run updates
  // a record in place rather than duplicating it.
  const merged = new Map(existing.map((row) => [row.qid, row]));
  for (const { row, country } of seen.values()) {
    const region = row.regionLabel?.value;
    // Id is assigned below, once the full set is known.
    const record = toRecord(row, 0, country, isQid(region) ? '' : region);
    if (record) merged.set(record.qid, record);
  }

  const records = [...merged.values()].sort(
    (a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name),
  );

  // Ids start above the curated seed so the two never collide, and are assigned in
  // sorted order so they stay stable between runs.
  records.forEach((record, index) => {
    record.id = 1000 + index;
  });

  const countriesCovered = new Set(records.map((r) => r.country));
  const withPhoto = records.filter((r) => r.photo).length;
  const withRegion = records.filter((r) => r.region).length;

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(records), 'utf8');

  process.stdout.write(
    `\nWrote ${records.length} dishes across ${countriesCovered.size} countries to src/data/catalogue.json\n` +
      `  ${withPhoto} with a photograph\n` +
      `  ${withRegion} with a region below country level\n` +
      `  ${failures} countries failed this run — re-run with --missing to pick them up\n` +
      `  all imported as Unverified: no score, no method, no dietary classification.\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nIngest failed: ${error.message}\n`);
  process.exitCode = 1;
});

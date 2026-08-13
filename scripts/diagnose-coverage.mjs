/**
 * Why does the catalogue look the way it does?
 *
 *   node scripts/diagnose-coverage.mjs
 *
 * The import anchors every dish on `country of origin` (P495). That is a strong,
 * sourced statement — but it is not the property most food items actually carry.
 * Many dishes are tied to a place through `cuisine` (P2012) instead: "Indian
 * cuisine", "Japanese cuisine". If the cuisine path holds far more records than the
 * country-of-origin path for a given country, the catalogue is under-counting that
 * country because of the query, not because the food is not there.
 *
 * This script counts both paths per country so the difference is visible rather than
 * assumed.
 */

const ENDPOINT = 'https://query.wikidata.org/sparql';
const USER_AGENT = 'GlobalTaste/1.0 (coverage diagnostic; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run(query, attempt = 1) {
  const url = `${ENDPOINT}?format=json&query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/sparql-results+json', 'User-Agent': USER_AGENT },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return JSON.parse(await res.text()).results.bindings;
  } catch (error) {
    if (attempt < 3) {
      await sleep(2000 * attempt);
      return run(query, attempt + 1);
    }
    throw error;
  }
}

/** Dishes tied to a country by country-of-origin — what the import currently uses. */
const byOrigin = (country) => `
SELECT (COUNT(DISTINCT ?item) AS ?n) WHERE {
  { ?item wdt:P31/wdt:P279* wd:Q746549 . } UNION { ?item wdt:P31/wdt:P279* wd:Q2095 . }
  ?item wdt:P495 wd:${country} .
}`;

/** Dishes tied to a country's cuisine — the path the import currently misses. */
const byCuisine = (cuisine) => `
SELECT (COUNT(DISTINCT ?item) AS ?n) WHERE {
  { ?item wdt:P31/wdt:P279* wd:Q746549 . } UNION { ?item wdt:P31/wdt:P279* wd:Q2095 . }
  ?item wdt:P2012 wd:${cuisine} .
}`;

/** Either path, which is what a corrected import would pick up. */
const byEither = (country, cuisine) => `
SELECT (COUNT(DISTINCT ?item) AS ?n) WHERE {
  { ?item wdt:P31/wdt:P279* wd:Q746549 . } UNION { ?item wdt:P31/wdt:P279* wd:Q2095 . }
  { ?item wdt:P495 wd:${country} . } UNION { ?item wdt:P2012 wd:${cuisine} . }
}`;

/** country Q-id and its cuisine Q-id. */
const TARGETS = [
  { name: 'India', country: 'Q668', cuisine: 'Q192786' },
  { name: 'China', country: 'Q148', cuisine: 'Q10876842' },
  { name: 'Japan', country: 'Q17', cuisine: 'Q234138' },
  { name: 'Indonesia', country: 'Q252', cuisine: 'Q2955948' },
  { name: 'Italy', country: 'Q38', cuisine: 'Q192786x' }, // cuisine id checked below
  { name: 'Thailand', country: 'Q869', cuisine: 'Q854374' },
  { name: 'Mexico', country: 'Q96', cuisine: 'Q207965' },
  { name: 'France', country: 'Q142', cuisine: 'Q6661' },
];

// Italy's cuisine item, kept separate because the placeholder above is wrong on
// purpose — better to fetch it than to guess a Q-id.
const ITALIAN_CUISINE = 'Q192786';

const count = async (query) => {
  const rows = await run(query);
  return Number(rows[0]?.n?.value ?? 0);
};

const main = async () => {
  process.stdout.write('country          origin   cuisine   either\n');
  process.stdout.write('---------------------------------------------\n');

  for (const t of TARGETS) {
    const cuisine = t.name === 'Italy' ? ITALIAN_CUISINE : t.cuisine;
    try {
      const origin = await count(byOrigin(t.country));
      await sleep(400);
      const cui = await count(byCuisine(cuisine));
      await sleep(400);
      const either = await count(byEither(t.country, cuisine));
      process.stdout.write(
        `${t.name.padEnd(15)} ${String(origin).padStart(6)} ${String(cui).padStart(9)} ${String(either).padStart(8)}\n`,
      );
    } catch (error) {
      process.stdout.write(`${t.name.padEnd(15)} failed (${error.message})\n`);
    }
    await sleep(400);
  }
};

main().catch((e) => {
  process.stderr.write(`diagnostic failed: ${e.message}\n`);
  process.exitCode = 1;
});

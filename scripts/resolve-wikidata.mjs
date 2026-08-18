/**
 * What Wikidata says a record *is*, and where it says the food is from.
 *
 *   node scripts/resolve-wikidata.mjs [--dry] [--limit 500]
 *
 * Two problems the article text could not solve, both answered by the same two
 * statements on the Wikidata item behind each article.
 *
 * **`P31` instance of — is this a food at all?**
 *
 * The most-read record in the catalogue was Yao Ming. He reached an atlas of food
 * because the cuisine walk descended into "Category:Chinese winemakers", and no rule
 * written against his *name* can ever catch him: "Yao Ming" looks exactly like a
 * dish. Wikidata states plainly that he is an instance of human. So do the Portland
 * restaurants and the confectionery brands that arrived the same way.
 *
 * **`P495` country of origin — where is the dish from?**
 *
 * Biryani sat under Indonesia and Baklava under Iran, and neither article fills in
 * an origin field for `fix-origin-country.mjs` to read. The Wikidata item carries
 * the claim as structured data instead of prose.
 *
 * ## The asymmetry, again
 *
 * A record is refused only when Wikidata names a class that is definitively not
 * food — a person, a company, a film, a building. Anything unclassified, or
 * classified as something this script does not recognise, stays. Deleting a real
 * tradition is silent and permanent; keeping a brewery merely looks foolish, and the
 * name-based rules in `isDish.ts` already catch most of those.
 *
 * Origins are treated exactly as `fix-origin-country.mjs` treats them: a single
 * claimed country corrects the record, several are recorded as a contested origin
 * without picking a winner.
 *
 * Free, unauthenticated, fifty items per request against each of two APIs.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = (name) => resolve(HERE, `../src/data/${name}.json`);

/**
 * Both imported sources, and how a row in each finds its Wikidata item.
 *
 * The cuisine rows carry an article URL and the item has to be looked up through it.
 * The Wikidata rows *are* Wikidata — they have carried a Q-number since the day they
 * were imported — so for them the lookup is free, which makes it all the more
 * pointed that they had never been checked: 7,870 records, no country of origin and
 * no test of whether they are food.
 */
const TARGETS = {
  cuisines: { path: DATA('cuisines'), qid: null },
  catalogue: { path: DATA('catalogue'), qid: (row) => row.qid },
};

const WIKIPEDIA = 'https://en.wikipedia.org/w/api.php';
const WIKIDATA = 'https://www.wikidata.org/w/api.php';
const USER_AGENT = 'GlobalTaste/1.0 (food atlas classification; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const retryAfter = (res, attempt) => {
  const header = Number(res.headers.get('retry-after'));
  return Number.isFinite(header) && header > 0 ? header * 1000 + 250 : 2000 * attempt;
};

/**
 * Classes that are definitively not food.
 *
 * Deliberately a list of things to *refuse* rather than a list of foods to accept.
 * Wikidata's food taxonomy is enormous and inconsistent — a dish may be an instance
 * of "food", "dish", "type of food", "stew", "bread" or nothing at all — so an
 * accept-list would silently delete thousands of real records the first time it met
 * an unfamiliar class.
 */
const NOT_FOOD_CLASSES = {
  Q5: 'a person',
  Q4830453: 'a business',
  Q783794: 'a company',
  Q891723: 'a public company',
  Q11707: 'a restaurant',
  Q30022: 'a café',
  Q43229: 'an organisation',
  Q11424: 'a film',
  Q5398426: 'a television series',
  Q215380: 'a musical group',
  Q134556: 'a single',
  Q482994: 'an album',
  Q7889: 'a video game',
  Q571: 'a book',
  Q7725634: 'a literary work',
  Q11032: 'a newspaper',
  Q41298: 'a magazine',
  Q3305213: 'a painting',
  Q41176: 'a building',
  Q33506: 'a museum',
  Q515: 'a city',
  Q6256: 'a country',
  Q3624078: 'a state',
  Q13417114: 'a noble family',
  Q4022: 'a river',
  Q8502: 'a mountain',
  Q16521: 'a taxon',
  Q4167410: 'a disambiguation page',
  Q13406463: 'a list article',
};

/** Wikidata item ids for the articles behind up to fifty rows. */
async function itemsFor(titles, attempt = 1) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    titles: titles.join('|'),
    prop: 'pageprops',
    ppprop: 'wikibase_item',
    redirects: '1',
  });

  try {
    const res = await fetch(`${WIKIPEDIA}?${params}`, { headers: { 'User-Agent': USER_AGENT } });
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 5) return new Map();
      await sleep(retryAfter(res, attempt));
      return itemsFor(titles, attempt + 1);
    }
    if (!res.ok) return new Map();

    const data = await res.json();
    const backToAsked = new Map();
    for (const r of data?.query?.redirects ?? []) backToAsked.set(r.to, r.from);
    for (const n of data?.query?.normalized ?? []) backToAsked.set(n.to, n.from);

    const out = new Map();
    for (const page of data?.query?.pages ?? []) {
      const qid = page?.pageprops?.wikibase_item;
      if (qid) out.set(backToAsked.get(page.title) ?? page.title, qid);
    }
    return out;
  } catch {
    return new Map();
  }
}

/** `instance of` and `country of origin` claims for up to fifty items. */
async function claimsFor(qids, attempt = 1) {
  const params = new URLSearchParams({
    action: 'wbgetentities',
    format: 'json',
    ids: qids.join('|'),
    props: 'claims',
  });

  try {
    const res = await fetch(`${WIKIDATA}?${params}`, { headers: { 'User-Agent': USER_AGENT } });
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 5) return new Map();
      await sleep(retryAfter(res, attempt));
      return claimsFor(qids, attempt + 1);
    }
    if (!res.ok) return new Map();

    const data = await res.json();
    const out = new Map();
    for (const [qid, entity] of Object.entries(data?.entities ?? {})) {
      const idsOf = (property) =>
        (entity?.claims?.[property] ?? [])
          .map((c) => c?.mainsnak?.datavalue?.value?.id)
          .filter(Boolean);
      out.set(qid, { instanceOf: idsOf('P31'), origin: idsOf('P495') });
    }
    return out;
  } catch {
    return new Map();
  }
}

/** English labels for up to fifty items — used to name the origin countries. */
async function labelsFor(qids, attempt = 1) {
  const params = new URLSearchParams({
    action: 'wbgetentities',
    format: 'json',
    ids: qids.join('|'),
    props: 'labels',
    languages: 'en',
  });

  try {
    const res = await fetch(`${WIKIDATA}?${params}`, { headers: { 'User-Agent': USER_AGENT } });
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 5) return new Map();
      await sleep(retryAfter(res, attempt));
      return labelsFor(qids, attempt + 1);
    }
    if (!res.ok) return new Map();

    const data = await res.json();
    const out = new Map();
    for (const [qid, entity] of Object.entries(data?.entities ?? {})) {
      const label = entity?.labels?.en?.value;
      if (label) out.set(qid, label);
    }
    return out;
  } catch {
    return new Map();
  }
}

const titleFrom = (url) => {
  try {
    return decodeURIComponent((url ?? '').split('/wiki/')[1] ?? '').replace(/_/g, ' ');
  } catch {
    return null;
  }
};

const main = async () => {
  const dry = process.argv.includes('--dry');
  const i = process.argv.indexOf('--limit');
  const limit = i > -1 ? Number(process.argv[i + 1]) : 0;

  const fileArg = process.argv.indexOf('--file');
  const name = fileArg > -1 ? process.argv[fileArg + 1] : 'cuisines';
  const target = TARGETS[name];
  if (!target) throw new Error(`unknown --file ${name}; expected ${Object.keys(TARGETS).join(', ')}`);

  const rows = JSON.parse(await readFile(target.path, 'utf8'));
  const pending = rows.filter((r) => (target.qid ? target.qid(r) : r.url) && !r.wikidataChecked);
  const targets = limit ? pending.slice(0, limit) : pending;
  process.stdout.write(`${targets.length} records to classify.\n`);

  // Country labels are looked up once and reused; a few dozen countries cover the
  // whole catalogue, so re-fetching them per batch would be pure waste.
  const countryNames = new Map();
  const refused = [];
  const moved = [];
  const placed = [];
  let classified = 0;

  /**
   * The countries the atlas can actually place.
   *
   * Taken from the data rather than from a list written here: every country already
   * in use has, by construction, survived the continent map that the catalogue
   * filters on. A correction into anything else would trade a wrong country for an
   * unplaceable one.
   */
  const knownCountries = new Set(rows.map((r) => r.country).filter(Boolean));

  for (let start = 0; start < targets.length; start += 50) {
    const batch = targets.slice(start, start + 50);
    const byTitle = new Map();
    for (const row of batch) {
      const key = target.qid ? target.qid(row) : titleFrom(row.url);
      if (key) byTitle.set(key, row);
    }

    // A source that already knows its Q-number does not need the article lookup.
    const items = target.qid
      ? new Map(batch.map((r) => [target.qid(r), target.qid(r)]).filter(([q]) => q))
      : byTitle.size
        ? await itemsFor([...byTitle.keys()])
        : new Map();
    const qids = [...new Set(items.values())];
    const claims = qids.length ? await claimsFor(qids) : new Map();

    // Resolve any origin countries this batch introduced that we cannot yet name.
    const unknown = [
      ...new Set(
        [...claims.values()].flatMap((c) => c.origin).filter((q) => q && !countryNames.has(q)),
      ),
    ];
    for (let j = 0; j < unknown.length; j += 50) {
      for (const [qid, label] of await labelsFor(unknown.slice(j, j + 50))) countryNames.set(qid, label);
    }

    for (const [title, row] of byTitle) {
      row.wikidataChecked = true;
      classified += 1;

      const qid = items.get(title);
      const claim = qid ? claims.get(qid) : null;
      if (!claim) continue;
      if (!dry) row.qid = qid;

      const bad = claim.instanceOf.find((c) => NOT_FOOD_CLASSES[c]);
      if (bad) {
        if (!dry) row.notFood = NOT_FOOD_CLASSES[bad];
        refused.push(`${row.name.slice(0, 34).padEnd(36)} ${NOT_FOOD_CLASSES[bad]}`);
        continue;
      }

      const origins = claim.origin.map((q) => countryNames.get(q)).filter(Boolean);
      if (!origins.length) continue;

      /**
       * `country of origin` frequently is not a country.
       *
       * Wikidata answers with whatever is true: Bengal, the Levant, the Mughal
       * Empire, Jammu and Kashmir, Tibet, the Indian subcontinent. Writing any of
       * those into the country field would put a record somewhere the continent map
       * cannot place and lose it from the atlas entirely.
       *
       * They are not noise, though — they are exactly the sub-country depth this
       * app measures and mostly lacks. So a real country corrects the country, and
       * anything else becomes the region when the record has none.
       */
      const asCountry = origins.filter((o) => knownCountries.has(o));
      const asRegion = origins.filter((o) => !knownCountries.has(o));

      if (asCountry.length > 1) {
        if (!dry) row.originClaims = asCountry;
      } else if (asCountry.length === 1 && asCountry[0] !== row.country) {
        moved.push(`${row.name.slice(0, 30).padEnd(32)} ${String(row.country).padEnd(16)} -> ${asCountry[0]}`);
        if (!dry) row.country = asCountry[0];
      }

      if (asRegion.length && !row.region) {
        if (!dry) row.region = asRegion[0];
        placed.push(`${row.name.slice(0, 30).padEnd(32)} region: ${asRegion[0]}`);
      }
    }

    if (!dry) await writeFile(target.path, JSON.stringify(rows), 'utf8');
    process.stdout.write(`  ${start + batch.length}/${targets.length} — ${refused.length} not food, ${moved.length} moved\n`);
    await sleep(300);
  }

  if (!dry) await writeFile(target.path, JSON.stringify(rows), 'utf8');

  process.stdout.write(
    `\nclassified ${classified}.\n\n${refused.length} are not food:\n` +
      refused.slice(0, 30).join('\n') +
      `\n\n${moved.length} moved to their stated country of origin:\n` +
      moved.slice(0, 25).join('\n') +
      `\n\n${placed.length} gained a region from an origin that is not a country:\n` +
      placed.slice(0, 15).join('\n') +
      '\n',
  );
};

main().catch((error) => {
  process.stderr.write(`\nWikidata classification failed: ${error.message}\n`);
  process.exitCode = 1;
});

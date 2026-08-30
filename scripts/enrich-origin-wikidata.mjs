/**
 * Give a country back to the records whose own article never supported one.
 *
 *   node scripts/audit-origin-support.mjs --mark     # first, to say which rows those are
 *   node scripts/enrich-origin-wikidata.mjs --dry
 *   node scripts/enrich-origin-wikidata.mjs
 *
 * ## What this is fixing
 *
 * The cuisine ingest filed each dish under the cuisine category it was found in. A
 * category says who *eats* a dish, so Jalebi — which appears in Egyptian cuisine because
 * zalabia does — was filed under Egypt, with a photograph taken in Bangalore.
 * `fix-origin-country.mjs` corrects from the article's own infobox and could not help
 * here: Jalebi's `place_of_origin` is empty and its `country` field reads "West Asia",
 * which is not a country. The audit found 3,245 records in that state and 131 filed under
 * a country their article actively contradicts.
 *
 * Wikidata answers the question the infobox did not, in `P495` (country of origin). It is
 * structured, free, already the source of the main catalogue, and needs no key.
 *
 * ## Only the rows that need it
 *
 * Acts solely on rows the audit marked `unsupported` or `unplaceable`. A record whose own
 * article names its country is left alone even when P495 disagrees — the article is the
 * source the atlas cites on the page, and quietly overruling it with a different source
 * would make the citation wrong.
 *
 * ## Three outcomes, and only one of them moves a record
 *
 * **One value, and it is a country the atlas files under → the country is corrected.**
 * Kabsa from India to Yemen, Maldives fish to the Maldives, sixteen Hong Kong dishes off
 * China. 75 records. The previous value is kept in `originWas` so the pass is reversible
 * from the data alone.
 *
 * **One value that is not such a country → recorded as `origin`, and the filing is left
 * alone.** This is the shape Ajay proposed and it resolves a bind the first version could
 * not. P495 frequently answers "Indian subcontinent", "Bengal" or "Mughal Empire", and
 * those are the *true* answers — but none can be a filing country. Writing them into
 * `country` moved 296 records out of country browsing and broke `domain.test.ts`, which
 * requires that an origin the app cannot place carries a translation or it prints English
 * into twelve languages. Naan is filed under India and comes from the Indian subcontinent;
 * both are true and the old shape could hold only one.
 *
 * **More than one value → recorded as `originClaims`, and nothing else changes.** Garam
 * masala's P495 lists India, Pakistan, Bangladesh and Nepal; jalebi's lists Sudan, the
 * Maghreb, the Middle East and Egypt. Picking one would be inventing a finding, and
 * picking the first would be inventing one arbitrarily. The app already renders these as a
 * contested-origin note with every claim sourced.
 *
 * **No P495: nothing is written.** The honest answer stays "we do not know", which is what
 * the atlas says everywhere else it does not know.
 *
 * ## Why it is restricted to countries the atlas knows
 *
 * The first version replaced `country` with whatever P495 returned. Across five thousand
 * records that is not a list of countries: it produced "Qing dynasty", "Georgian SSR",
 * "Korea under Japanese rule", "Eryuan County" and "Association of Southeast Asian
 * Nations", and moved 190 Korean dishes to "Korea", which this atlas does not file under.
 * A 200-record sample looked clean because it was India-heavy. The fault only appeared on
 * the full run — which is the argument for running the full one before believing a sample.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Which source to enrich. `--source catalogue` for the Wikidata import.
 *
 * Both files have to be done, and finding that out cost a run. `origin` was written onto
 * 296 cuisine rows and reached almost none of them on the page: the famous dishes — naan,
 * samosa, roti — also exist in the import, and when two sources carry the same name the
 * import copy wins. So the field was set on the copy that loses.
 *
 * `fix-origin-country.mjs` grew a `--source` flag for exactly this and says so in its own
 * header: *"the cuisine copy of each dish had been corrected while the import copy kept
 * the category's country, and both were in the catalogue at once."* The trap was written
 * down and still caught the next pass, which is worth recording rather than quietly
 * fixing.
 */
const SOURCES = {
  cuisines: resolve(HERE, '../src/data/cuisines.json'),
  catalogue: resolve(HERE, '../src/data/catalogue.json'),
};
const sourceArg = process.argv.indexOf('--source');
const SOURCE_NAME = sourceArg > -1 ? process.argv[sourceArg + 1] : 'cuisines';
const FILE = SOURCES[SOURCE_NAME];
if (!FILE) {
  process.stderr.write(`unknown --source "${SOURCE_NAME}". Use one of: ${Object.keys(SOURCES).join(', ')}\n`);
  process.exit(1);
}
const API = 'https://www.wikidata.org/w/api.php';
const UA = 'WikiFoodia/1.0 (https://wikifoodia.ajailabs.app; origin enrichment)';
const DRY = process.argv.includes('--dry');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Wikidata's English label is not always the name this atlas files countries under.
 *
 * It says "People's Republic of China" where the atlas says "China". Written through
 * unchanged that would not be a cosmetic difference: the atlas is keyed on its own
 * spellings, so a new one matches no filter, `isCountry` returns false and `continentOf`
 * files it as `Elsewhere` — the record would quietly display as "Beyond one country"
 * while looking, in the data, like a perfectly good country.
 *
 * Caught by reading the dry run rather than by the code failing, which is the only way
 * this class of fault ever surfaces.
 */
const KNOWN = new Set();
{
  const table = readFileSync(resolve(HERE, '../src/domain/countryCodes.ts'), 'utf8');
  for (const [, name] of table.matchAll(/"([^"]+)":\s*"[A-Z]{2}"/g)) KNOWN.add(name);
}

const ALIASES = {
  "People's Republic of China": 'China',
  'United States of America': 'United States',
  'Kingdom of the Netherlands': 'Netherlands',
  'Republic of Ireland': 'Ireland',
  'Republic of Korea': 'South Korea',
  "Democratic People's Republic of Korea": 'North Korea',
  'Russian Federation': 'Russia',
  'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
  'Islamic Republic of Iran': 'Iran',
  'Republic of Türkiye': 'Turkey',
  Türkiye: 'Turkey',
  'Federal Republic of Germany': 'Germany',
  'Swiss Confederation': 'Switzerland',
  'Republic of India': 'India',
  'Republic of China': 'Taiwan',
  Burma: 'Myanmar',
  'Czech Republic': 'Czechia',
  'State of Palestine': 'Palestine',
};

/**
 * The atlas's name for a place, or the place as Wikidata named it.
 *
 * A value that is neither a known country nor an alias is left exactly as it came —
 * "Indian subcontinent", "Bengal", "Mughal Empire". Those are the honest coarse answers
 * this pass exists to prefer over a false precise one, and the app renders them as
 * "Beyond one country" by design.
 */
const canonical = (name) => ALIASES[name] ?? name;

async function entities(ids, props, attempt = 1) {
  const params = new URLSearchParams({
    action: 'wbgetentities',
    format: 'json',
    ids: ids.join('|'),
    props,
    languages: 'en',
  });
  try {
    const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': UA } });
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 5) return {};
      await sleep(500 * attempt);
      return entities(ids, props, attempt + 1);
    }
    if (!res.ok) return {};
    return (await res.json())?.entities ?? {};
  } catch {
    return {};
  }
}

const main = async () => {
  const rows = JSON.parse(await readFile(FILE, 'utf8'));

  /*
   * Undo any country this pass wrote before, so it can be re-run after its rules change.
   *
   * `originWas` exists for exactly this. The first run of this script replaced 371
   * countries on rules that turned out to be too loose; without a recorded previous value
   * the only way back would have been a git checkout, which would also have discarded the
   * audit marks and forced another five thousand article reads to rebuild them.
   */
  let restored = 0;
  for (const row of rows) {
    /* An earlier run may have written an origin without touching the country, so this
       cannot key on originWas alone. */
    if (row.originFrom && row.originWas === undefined) {
      delete row.origin;
      delete row.originFrom;
    }
    /*
     * A one-entry claim list is not a dispute, and the app is right to ignore it.
     *
     * An earlier run wrote every single-value P495 answer into `originClaims`. Those can
     * never reach a record — `originClaimsFrom` returns nothing below two — so 371 rows
     * carried a field that was guaranteed to go nowhere, and `plumbing.test.ts`, which
     * traces every written field through to the reader, failed exactly as it should.
     * They are cleared here rather than left, because a field that cannot mean anything
     * is worse than an absent one: the next person reads it as data.
     */
    if (Array.isArray(row.originClaims) && row.originClaims.length < 2) delete row.originClaims;

    if (row.originWas === undefined) continue;
    row.country = row.originWas;
    delete row.originWas;
    delete row.originFrom;
    delete row.origin;
    restored += 1;
  }
  if (restored) process.stderr.write(`restored ${restored} countries written by an earlier run\n`);

  const needsHelp = rows.filter(
    (r) => r.qid && (r.originSupport === 'unsupported' || r.originSupport === 'unplaceable'),
  );
  if (!needsHelp.length) {
    process.stderr.write('No rows marked unsupported or unplaceable. Run the audit with --mark first.\n');
    process.exit(1);
  }
  process.stderr.write(`${needsHelp.length} rows to look up\n`);

  /* 1. Every P495 target, per record. */
  const claims = new Map();
  for (let i = 0; i < needsHelp.length; i += 50) {
    const batch = needsHelp.slice(i, i + 50);
    const got = await entities(batch.map((r) => r.qid), 'claims');
    for (const r of batch) {
      const targets = (got[r.qid]?.claims?.P495 ?? [])
        .map((c) => c?.mainsnak?.datavalue?.value?.id)
        .filter(Boolean);
      claims.set(r.qid, targets);
    }
    process.stderr.write(`  claims ${Math.min(i + 50, needsHelp.length)}/${needsHelp.length}\r`);
  }
  process.stderr.write('\n');

  /* 2. English labels for the places those point at. */
  const targets = [...new Set([...claims.values()].flat())];
  const label = new Map();
  for (let i = 0; i < targets.length; i += 50) {
    const got = await entities(targets.slice(i, i + 50), 'labels');
    for (const [id, e] of Object.entries(got)) {
      const name = e?.labels?.en?.value;
      if (name) label.set(id, name);
    }
    process.stderr.write(`  labels ${Math.min(i + 50, targets.length)}/${targets.length}\r`);
  }
  process.stderr.write('\n');

  /* 3. Decide, and record the decision. */
  let changed = 0;
  let recorded = 0;
  let contested = 0;
  let silent = 0;
  const log = [];

  for (const row of needsHelp) {
    const named = (claims.get(row.qid) ?? [])
      .map((id) => label.get(id))
      .filter(Boolean)
      .map(canonical);

    if (!named.length) {
      silent += 1;
      continue;
    }

    if (named.length > 1) {
      /* Contested. Kept for the dispute model, and the country is not touched. */
      row.originClaims = named;
      contested += 1;
      if (log.length < 40) log.push(`  = ${row.name}: kept ${row.country}, claims ${named.join(' / ')}`);
      continue;
    }

    const [only] = named;
    if (only === row.country) {
      silent += 1;
      continue;
    }

    /*
     * Only a country the atlas already knows. This is the guard the first version of
     * this pass did not have, and it was wrong without it.
     *
     * P495 holds whatever entity an editor linked, and across five thousand records that
     * is not a list of countries. Applied blindly it produced 81 distinct new origins
     * including "Qing dynasty", "Georgian SSR", "Korea under Japanese rule", "Eryuan
     * County", "Tokugawa shogunate" and — genuinely — "Association of Southeast Asian
     * Nations". 190 Korean dishes moved to "Korea", which is not a country this atlas
     * files under, so every one of them would have dropped out of country browsing.
     *
     * A 200-record sample looked clean because it was India-heavy, where P495 mostly
     * returns "Indian subcontinent". The fault only appeared on the full run, which is
     * the argument for running the full one before believing a sample.
     *
     * A wider region is still a better answer than a false country — but only if the app
     * can *say* it, and `domain.test.ts` is explicit that an origin it cannot place in a
     * country must have a translation or it prints English into twelve languages. Those
     * translations do not exist for these 81. Until they do, the honest move is to leave
     * the record alone and record the claim, not to trade one wrong answer for another.
     */
    if (!KNOWN.has(only)) {
      /*
       * Recorded as an origin, not as a claim.
       *
       * The first version wrote it to `originClaims`, and `plumbing.test.ts` caught that:
       * `originClaimsFrom` returns nothing for a list of one, because a single value is
       * not a dispute. So hundreds of rows carried a field that could never reach a
       * record, and the test that traces written fields through to the reader failed
       * exactly as designed.
       *
       * `origin` is Ajay's suggestion and it is the right shape. A dish is *filed* under
       * a country — that is what the atlas navigates by — and it *comes from* somewhere,
       * which may be a region, a former state, or a different country entirely. Naan is
       * filed under India and comes from the Indian subcontinent. Both are true, and the
       * old design could hold only one of them.
       */
      row.origin = only;
      row.originFrom = 'wikidata:P495';
      recorded += 1;
      if (log.length < 40) log.push(`  ~ ${row.name}: filed ${row.country}, origin ${only}`);
      continue;
    }
    if (log.length < 40) log.push(`  → ${row.name}: ${row.country} → ${only}`);
    /* The value being replaced, kept.
     *
     * 371 rows change country in one pass and 296 of them leave a country for a wider
     * region, which is a visible change to how the atlas navigates. Keeping what was
     * there makes the pass reversible from the data alone, rather than from a git diff of
     * a four-megabyte JSON file. It also records what the cuisine category had claimed,
     * which is the thing this pass exists to stop trusting. */
    row.originWas = row.country;
    row.country = only;
    row.originClaims = named;
    row.originFrom = 'wikidata:P495';
    changed += 1;
  }

  process.stdout.write(`\nof ${needsHelp.length} rows with no supported country:\n`);
  process.stdout.write(`  country replaced       ${String(changed).padStart(5)}\n`);
  /* Counted from `originWas`, which only a country replacement writes. An earlier version
     counted `originFrom` and reported 371 country replacements beside "country replaced
     75" in the same block — `originFrom` is set by the origin-only path too. A summary
     that contradicts itself two lines apart is worse than no summary. */
  process.stdout.write(`  origin recorded        ${String(recorded).padStart(5)}   (not a country the atlas files under)\n`);
  process.stdout.write(`  contested claims       ${String(contested).padStart(5)}   (more than one origin)\n`);
  process.stdout.write(`  left alone             ${String(silent).padStart(5)}   (no P495, or already agreed)\n`);
  process.stdout.write(`\n${log.join('\n')}\n`);

  if (!DRY) {
    await writeFile(FILE, `${JSON.stringify(rows, null, 1)}\n`);
    process.stdout.write(`\nwritten to ${FILE.split(/[\\/]/).pop()}\n`);
  } else {
    process.stdout.write('\n--dry: nothing written\n');
  }
};

main();

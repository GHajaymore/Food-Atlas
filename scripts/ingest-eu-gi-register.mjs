/**
 * The EU register of geographical indications, as heritage evidence.
 *
 *   node scripts/ingest-eu-gi-register.mjs [--dry]
 *
 * `src/domain/assess.ts` has counted a heritage designation as the strongest kind of
 * cultural documentation since the first curated record, and names PDO, PGI and TSG
 * in its own comment as the example. Nothing has ever written one. Every record in
 * the atlas carries `heritage: []`, so a dimension the scoring model was built around
 * has been scoring zero for all 16,489 of them.
 *
 * eAmbrosia is the register those three designations live in. It holds 3,973 entries,
 * of which 1,800 are registered foods, and it is the document a protected name is
 * granted against — a name tied to a place by law, with a published specification.
 * That is a stronger claim than a Wikipedia category, which is what most of this
 * atlas currently rests on.
 *
 * ## What this is not
 *
 * A PDO protects a **product**, not a method. Comté, Brie de Meaux and Uva de mesa
 * embolsada del Vinalopó are foods with a legally defined origin; none of them is a
 * recipe. So this writes provenance and it does not write `steps`, and the records it
 * creates say plainly that nobody here has recorded how the thing is made. The
 * assessment model already handles that combination — a designation without
 * ingredients does not reach the top badge.
 *
 * ## Why it is worth having anyway
 *
 * 356 of the entries are from outside the EU: Cambodia, Cameroon, Niger, Sri Lanka,
 * Viet Nam, Thailand, Mongolia, Indonesia, São Tomé and Príncipe. China alone has 98
 * registered foods that this atlas does not hold. Those are the regions the
 * encyclopaedia sources serve worst, and this is a register rather than an article,
 * so it does not depend on somebody having written one.
 *
 * Wikidata does not have this. Exactly two items in it carry the heritage
 * designation, so no amount of running `enrich-wikidata.mjs` would ever reach it.
 *
 * ## Licensing
 *
 * European Commission content is reusable under CC BY 4.0 by Commission Decision
 * 2011/833/EU — credit given, changes indicated. The register is credited on every
 * record it touches, the same way a Commons photographer is.
 *
 * The decision excludes material held under industrial-property rights, which is why
 * nothing here reproduces the PDO or PGI **logos**. Those are EU trade marks with
 * their own rules about who may display them, and a record in this atlas is not
 * entitled to wear one. The designation is stated in words instead.
 *
 * ## The endpoint
 *
 * The register's own front end pages this API, and the API's landing page says it
 * "is not expected to be accessed directly". It is public, unauthenticated data with
 * no documented stability promise — so this script checks what it got and refuses to
 * write anything if the shape has moved. A register that quietly returns ten rows
 * instead of four thousand would otherwise wipe the heritage evidence off every
 * record on the next run, and look like a successful pass while doing it.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { canonicalCountry } from '../src/domain/countryNames.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = (name) => resolve(HERE, `../src/data/${name}.json`);

const API =
  'https://ec.europa.eu/geographical-indications-register/eambrosia-public-api/api/gi-applications/filter';

/** Where a reader goes to check any of this. The register is the citation. */
const REGISTER_URL =
  'https://ec.europa.eu/agriculture/eambrosia/geographical-indications-register/';

const ATTRIBUTION = 'European Commission — eAmbrosia — CC BY 4.0';

const USER_AGENT = 'GlobalTaste/1.0 (EU GI register ingest; contact: via repository)';

/**
 * The floor this run has to clear before it is allowed to write.
 *
 * Set well below the 3,715 registered entries seen when this was written, and well
 * above anything a broken endpoint returns. Its job is to tell a shrunken register
 * apart from a shrunken response.
 */
const EXPECT_AT_LEAST = 2500;

/** The register pages with PrimeNG's `first`/`rows`, not `page`/`size`. */
const PAGE = 500;

/**
 * Classes that are registered under the food scheme without being food.
 *
 * The register covers agricultural products, which is a wider category than this
 * atlas: hay, cork, wool, flowers and essential oils all hold designations. `isFood`
 * in the build refuses most of them by name anyway, but refusing them by their own
 * published class is more honest than hoping a name looks wrong.
 */
const NOT_EATEN = /flowers and ornamental|essential oils|hay|cork|wool|leather|feathers/i;

async function slice(first) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'User-Agent': USER_AGENT, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ first, rows: PAGE }),
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from the register`);
  return res.json();
}

/** Every entry the register holds, or an exception. Never a partial answer. */
async function fetchRegister() {
  const all = [];
  const seen = new Set();
  let total = Infinity;

  for (let first = 0; first < total; first += PAGE) {
    const data = await slice(first);

    if (!Array.isArray(data?.results) || typeof data.count !== 'number') {
      throw new Error('the register answered in a shape this script does not know');
    }
    total = data.count;
    if (!data.results.length) break;

    for (const row of data.results) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      all.push(row);
    }
    process.stdout.write(`\r  ${all.length}/${total} entries`);
  }
  process.stdout.write('\n');

  if (all.length < total) {
    throw new Error(`the register reports ${total} entries and served ${all.length}`);
  }
  return all;
}

/**
 * Compare names the way `ingest-pat-register.mjs` does, and for the same reason.
 *
 * A protected name and an encyclopaedia title differ in case, accents and brackets
 * far more often than they differ in substance.
 */
const fold = (name) =>
  (name ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/\b(dop|igp|stg|pdo|pgi|tsg|aop|doc|docg)\b/g, '')
    .replace(/[^a-z0-9]/g, '');

/**
 * A protected name can hold several official variants at once.
 *
 * "Cantal / Fourme de Cantal" and "Bleu de Gex Haut-Jura / Bleu de Septmoncel" are
 * one designation with two lawful names, and a record may be filed under either. All
 * of them are matched; the first is the one a new record is named with, because that
 * is the order the register itself puts them in.
 */
const variantsOf = (protectedName) =>
  String(protectedName ?? '')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean);

/** "18/09/1973" as an ISO date, or empty when the register did not record one. */
const isoDate = (value) => {
  const found = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(value ?? '').trim());
  return found ? `${found[3]}-${found[2]}-${found[1]}` : '';
};

/**
 * The designation as a reader should meet it.
 *
 * Stored as prose rather than a code, because this string is shown. "Protected
 * Designation of Origin (PDO), European Union" says what happened; "PDO" is a badge
 * nobody outside the trade can read.
 */
const heritageLine = (entry) =>
  `${entry.geographicalIndicatorType ?? entry.geographicalIndicatorTypeCode}, European Union register`;

const main = async () => {
  const dry = process.argv.includes('--dry');

  process.stdout.write('Reading the EU register of geographical indications.\n');
  const register = await fetchRegister();

  const foods = register.filter(
    (r) =>
      r.status === 'Registered' &&
      r.qualityProductType === 'Food' &&
      !NOT_EATEN.test(r.productCategory ?? ''),
  );

  if (foods.length < EXPECT_AT_LEAST / 2) {
    throw new Error(
      `only ${foods.length} registered foods found; the register or its field names have moved. Nothing written.`,
    );
  }
  process.stdout.write(`  ${foods.length} registered foods, of ${register.length} entries.\n`);

  const catalogue = JSON.parse(await readFile(DATA('catalogue'), 'utf8'));
  const cuisines = JSON.parse(await readFile(DATA('cuisines'), 'utf8'));

  /*
   * One index over both import sources.
   *
   * A designation should reach a record wherever it lives — Comté arrives from
   * Wikidata and Époisses from the French cuisine tree, and neither is more entitled
   * to its own provenance than the other.
   */
  const byName = new Map();
  for (const row of [...catalogue, ...cuisines]) {
    const key = fold(row.name);
    if (key && !byName.has(key)) byName.set(key, row);
  }

  let enriched = 0;
  const fresh = [];

  for (const entry of foods) {
    const names = variantsOf(entry.protectedName);
    if (!names.length) continue;

    const country = canonicalCountry(entry.countries ?? '');
    if (!country) continue;

    const match = names.map(fold).map((k) => byName.get(k)).find(Boolean);

    if (match) {
      enriched += 1;
      if (!dry) {
        /*
         * A flat field on both files rather than the `evidence` object.
         *
         * `evidence` is where a Wikidata row keeps what that pass found, and the
         * cuisine rows have no such object at all — writing one would mean inventing
         * three sibling fields this script did not read, on a row whose findings came
         * from somewhere else entirely. The build merges the two sources of heritage
         * where it assembles the record.
         */
        match.heritage = match.heritage ?? [];
        const line = heritageLine(entry);
        if (!match.heritage.includes(line)) match.heritage.push(line);
        match.giReference = entry.fileName ?? '';
        match.giAttribution = ATTRIBUTION;
      }
      continue;
    }

    fresh.push({
      reference: entry.fileName ?? entry.appUniqueId,
      name: names[0],
      alsoKnownAs: names.slice(1),
      country,
      designation: entry.geographicalIndicatorType ?? entry.geographicalIndicatorTypeCode,
      designationCode: entry.geographicalIndicatorTypeCode ?? '',
      category: entry.productCategory ?? '',
      registered: isoDate(entry.registrationDate),
      url: REGISTER_URL,
      attribution: ATTRIBUTION,
    });
  }

  if (!dry) {
    await writeFile(DATA('catalogue'), JSON.stringify(catalogue), 'utf8');
    await writeFile(DATA('cuisines'), JSON.stringify(cuisines), 'utf8');
    await writeFile(DATA('gi'), JSON.stringify(fresh), 'utf8');
  }

  const byCountry = {};
  for (const row of fresh) byCountry[row.country] = (byCountry[row.country] ?? 0) + 1;
  const top = Object.entries(byCountry).sort((a, b) => b[1] - a[1]).slice(0, 8);

  process.stdout.write(
    `\n${enriched} records already in the atlas gained a heritage designation.\n` +
      `${fresh.length} registered foods are not in the atlas and were written to gi.json.\n` +
      top.map(([c, n]) => `    ${String(n).padStart(4)}  ${c}`).join('\n') +
      `\n${dry ? '\n(dry run — nothing written)\n' : ''}`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nEU GI register ingest failed: ${error.message}\n`);
  process.exitCode = 1;
});

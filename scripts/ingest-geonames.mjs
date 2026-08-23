/**
 * Check every region against a gazetteer, and fill in the level above it.
 *
 *   node scripts/ingest-geonames.mjs [--dry]
 *
 * 18,008 records all name a country and 6,737 name anything smaller, so two records
 * in three sit at the coarsest level the atlas has. Depth is most of what separates a
 * record from a headword, and it is the statistic the atlas page reports about
 * itself, so the ones that do name a region had better be naming a real one.
 *
 * Until now nothing could tell. `place.ts` decides with rules — no food words, not a
 * bare nationality, something capitalised — and rules cannot separate "Goa" from
 * "Goan", or notice that "India › Algeria" has a real place under the wrong flag.
 *
 * GeoNames can. Two plain-text files, 51,456 administrative areas, CC BY 4.0.
 *
 * ## What it does
 *
 *   confirms   3,969 regions as a real first-level unit of their own country
 *   deepens       87 whose region is really a district, filling in the state above:
 *                    "India › Hyderabad" → "India › Telangana › Hyderābād"
 *   flags        146 that name a real place in a *different* country
 *
 * ## What it deliberately does not do
 *
 * Delete anything. A name the gazetteer has never heard of is not thereby fake:
 * Bengal, Kashmir and Old Hyderabad State are real answers to "where is this from"
 * and none of them is a current administrative unit. 2,535 regions are in that
 * position and every one of them is left exactly as it was. Absence of evidence is
 * the thing this project keeps refusing to treat as evidence of absence.
 *
 * The wrong-country findings are **reported and not applied**, for the same reason.
 * "India › Algeria" is certainly wrong, but the gazetteer knows which of the two is
 * mistaken no better than the rules do — moving the record to Algeria on the strength
 * of a string match is precisely the "right vocabulary, wrong subject" error that has
 * cost this catalogue more than any other.
 *
 * ## Licensing
 *
 * GeoNames is CC BY 4.0. Attribution is a condition, so a record whose place was
 * confirmed or deepened here carries the credit, exactly as a Commons photograph
 * carries its photographer.
 */

import { inflateRawSync } from 'node:zlib';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { lookUp, placement, foldPlace } from '../src/domain/gazetteer.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = (name) => resolve(HERE, `../src/data/${name}.json`);

const DUMP = 'https://download.geonames.org/export/dump';
const USER_AGENT = 'GlobalTaste/1.0 (GeoNames place check; contact: via repository)';
const ATTRIBUTION = 'GeoNames — CC BY 4.0';

/**
 * Floors, so a truncated download cannot quietly become a small gazetteer.
 *
 * A short file would not error — it would just fail to confirm most regions, and a
 * run that confirms nothing looks exactly like a run against a catalogue that has
 * nothing to confirm.
 */
const EXPECT = { admin1: 3000, admin2: 30000, countries: 200, towns: 20000 };

async function fetchBytes(file) {
  const res = await fetch(`${DUMP}/${file}`, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(180000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${file}`);
  return Buffer.from(await res.arrayBuffer());
}

const asLines = (text) => text.split('\n').filter((line) => line && !line.startsWith('#'));

const fetchLines = async (file) => asLines((await fetchBytes(file)).toString('utf8'));

/**
 * The one entry of a single-file zip, without adding a zip library.
 *
 * GeoNames publishes the admin tables as plain text and the town list only as a zip,
 * so this is thirty lines against a dependency. A zip's local header carries the
 * compressed length, and the payload is a raw deflate stream that `node:zlib` already
 * knows how to read.
 *
 * The fallback matters: an archive written by a streaming writer leaves the length as
 * zero and puts it in a trailer instead. In that case the payload runs to the start of
 * the central directory, whose signature is the marker looked for below. Both shapes
 * appear in the wild and neither is worth a dependency.
 */
function unzipSingle(buffer) {
  if (buffer.readUInt32LE(0) !== 0x04034b50) throw new Error('not a zip archive');

  const method = buffer.readUInt16LE(8);
  if (method !== 8) throw new Error(`unsupported zip compression method ${method}`);

  const compressed = buffer.readUInt32LE(18);
  const start = 30 + buffer.readUInt16LE(26) + buffer.readUInt16LE(28);
  const end = compressed > 0 ? start + compressed : buffer.indexOf('PK\x01\x02', start, 'binary');

  return inflateRawSync(buffer.subarray(start, end > start ? end : undefined)).toString('utf8');
}

const fetchZipLines = async (file) => asLines(unzipSingle(await fetchBytes(file)));

async function buildGazetteer() {
  const [a1, a2, countries, towns] = await Promise.all([
    fetchLines('admin1CodesASCII.txt'),
    fetchLines('admin2Codes.txt'),
    fetchLines('countryInfo.txt'),
    fetchZipLines('cities15000.zip'),
  ]);

  if (
    a1.length < EXPECT.admin1 ||
    a2.length < EXPECT.admin2 ||
    countries.length < EXPECT.countries ||
    towns.length < EXPECT.towns
  ) {
    throw new Error(
      `gazetteer came back short (${a1.length}/${a2.length}/${countries.length}/${towns.length}); nothing written`,
    );
  }

  const byCode = new Map();
  const byName = new Map();
  const countryCode = new Map();

  for (const line of countries) {
    const cols = line.split('\t');
    if (cols[0] && cols[4]) countryCode.set(foldPlace(cols[4]), cols[0]);
  }

  const add = (line, level) => {
    const [code, name, ascii] = line.split('\t');
    if (!code || !name) return;
    const area = { code, name, country: code.split('.')[0], level };
    byCode.set(code, area);
    // Both spellings are indexed: the accented one and GeoNames' own ASCII fold. A
    // catalogue written from an English article usually matches the second.
    for (const key of new Set([foldPlace(name), foldPlace(ascii ?? '')])) {
      if (key) byName.set(key, [...(byName.get(key) ?? []), area]);
    }
  };
  for (const line of a1) add(line, 1);
  for (const line of a2) add(line, 2);

  /*
   * Towns are indexed by the code of the district they sit in, not by one of their
   * own, so `climb` can read the district and the state straight off a town match.
   * They are never put in `byCode`: a town is a leaf, and nothing looks up a place by
   * asking for the town above it.
   */
  let townCount = 0;
  for (const line of towns) {
    const cols = line.split('\t');
    const [name, ascii, cc, adm1, adm2] = [cols[1], cols[2], cols[8], cols[10], cols[11]];
    if (!name || !cc || !adm1) continue;

    const code = [cc, adm1, adm2].filter(Boolean).join('.');
    const area = { code, name, country: cc, level: 3 };
    townCount += 1;
    for (const key of new Set([foldPlace(name), foldPlace(ascii ?? '')])) {
      if (key) byName.set(key, [...(byName.get(key) ?? []), area]);
    }
  }

  process.stdout.write(
    `  ${byCode.size} administrative areas and ${townCount} towns, ${byName.size} distinct names.\n`,
  );
  return { byCode, byName, countryCode };
}

const main = async () => {
  const dry = process.argv.includes('--dry');

  process.stdout.write('Reading the GeoNames administrative gazetteer.\n');
  const gazetteer = await buildGazetteer();

  const files = ['catalogue', 'cuisines'];
  const loaded = Object.fromEntries(
    await Promise.all(files.map(async (name) => [name, JSON.parse(await readFile(DATA(name), 'utf8'))])),
  );

  let confirmed = 0;
  let gainedProvince = 0;
  let gainedCity = 0;
  let ambiguous = 0;
  let unknown = 0;
  const misfiled = [];

  for (const rows of Object.values(loaded)) {
    for (const row of rows) {
      const region = (row.region ?? '').trim();
      if (!region || !row.country) continue;

      const finding = lookUp(region, row.country, gazetteer);

      if (finding.kind === 'unknown') {
        unknown += 1;
        continue;
      }
      if (finding.kind === 'ambiguous') {
        ambiguous += 1;
        continue;
      }
      if (finding.kind === 'elsewhere') {
        /*
         * Only worth reporting when the name is a *state* somewhere else.
         *
         * The first pass reported every match and was mostly noise: there is a
         * Bohemia in Jamaica, a China in Mexico and a Central in five countries, so
         * "Poland › Bohemia" came back as a finding about Jamaica. A hamlet sharing a
         * name with a historical region is a coincidence. A first-level unit of
         * another country is a fact worth someone's attention.
         */
        const states = finding.found.filter((a) => a.level === 1);
        if (states.length) {
          misfiled.push(
            `${row.country} › ${region}  (a first-level unit of ${[...new Set(states.map((a) => a.country))].join(', ')})`,
          );
        } else {
          unknown += 1;
        }
        continue;
      }

      const where = placement(finding);
      confirmed += 1;

      if (!dry) {
        if (where.region) row.region = where.region;
        /*
         * Never overwrites what a record already states. A curated record saying
         * "Malabar" knows something no administrative list does — Malabar is not a
         * district, it is where people say they are from.
         */
        if (where.province && !row.province) {
          row.province = where.province;
          gainedProvince += 1;
        }
        if (where.city && !row.city) {
          row.city = where.city;
          gainedCity += 1;
        }
        row.placeConfirmed = ATTRIBUTION;
      } else {
        if (where.province && !row.province) gainedProvince += 1;
        if (where.city && !row.city) gainedCity += 1;
      }
    }
  }

  if (!dry) {
    for (const [name, rows] of Object.entries(loaded)) {
      await writeFile(DATA(name), JSON.stringify(rows), 'utf8');
    }
  }

  process.stdout.write(
    `\n${confirmed} regions confirmed as a real place in their own country.\n` +
      `  ${gainedProvince} gained a province, ${gainedCity} gained a city.\n` +
      `${unknown} the gazetteer does not hold — left exactly as they were.\n` +
      `${ambiguous} name several places in the country at the same level; refused rather than guessed.\n` +
      `${misfiled.length} name a first-level unit of a different country. Reported, never moved:\n` +
      [...new Set(misfiled)].slice(0, 12).map((e) => `    ${e}`).join('\n') +
      `\n${dry ? '\n(dry run — nothing written)\n' : ''}`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nGeoNames place check failed: ${error.message}\n`);
  process.exitCode = 1;
});

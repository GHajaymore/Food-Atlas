/**
 * Which country a device is in, from the timezone it is set to.
 *
 *   node scripts/ingest-timezones.mjs [--dry]
 *
 * The atlas can only ask a reader for what it needs in general — "record a dish you
 * know" — until it knows where they are. Then it can ask for something specific:
 * *these eleven dishes from your country have no method recorded, and you may be the
 * person who knows.* A general plea is easy to ignore. A list of food from home is
 * not.
 *
 * ## Why the timezone and not geolocation
 *
 * `navigator.geolocation` needs a permission prompt, needs a dependency on native, and
 * sends a precise position somewhere. The front page of this app says "no tracking",
 * and that sentence has to survive being read by somebody who checks.
 *
 * `Intl.DateTimeFormat().resolvedOptions().timeZone` is already available on every
 * platform this runs on, needs no permission, and never leaves the device. It is also
 * a better signal than the locale: an Indian reader who set their phone to English
 * reports `en-US` and `Asia/Kolkata`, and only one of those is true about where they
 * are.
 *
 * It is coarse — a country, not a town — and that is the right grain anyway, because
 * the atlas asks about the food of a place rather than of an address.
 *
 * ## The mapping
 *
 * IANA publishes `zone1970.tab`, which is the authoritative list and is in the public
 * domain. Its first column is the countries a zone covers; where there are several the
 * first is the primary one, and the rest are territories that happen to share the
 * clock — `Asia/Dubai` also serves Oman, Réunion, the Seychelles and the French
 * Southern Territories, and a reader in any of them is best served by the UAE's
 * neighbours rather than by nothing.
 *
 * Country names come from GeoNames so they match what `ingest-geonames.mjs` used, and
 * every one is run through `canonicalCountry` so it matches what the catalogue calls
 * the place. A zone whose country the atlas has never heard of is dropped and
 * reported, because a mapping to a name nothing matches is worse than no mapping.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { canonicalCountry } from '../src/domain/countryNames.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../src/data/timezones.json');
const CATALOGUE = resolve(HERE, '../src/data/catalogue.json');

const USER_AGENT = 'GlobalTaste/1.0 (timezone map; contact: via repository)';

/** Below this many zones the download was truncated and nothing should be written. */
const EXPECT_ZONES = 250;

async function text(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

const main = async () => {
  const dry = process.argv.includes('--dry');

  const [zoneTab, countryInfo, backward] = await Promise.all([
    text('https://data.iana.org/time-zones/tzdb/zone1970.tab'),
    text('https://download.geonames.org/export/dump/countryInfo.txt'),
    /*
     * The aliases, which are not optional.
     *
     * `zone1970.tab` lists only canonical zones, and devices do not. A Windows machine
     * in Indiana reports `America/Indianapolis`, whose canonical name is
     * `America/Indiana/Indianapolis`; Indian phones commonly report `Asia/Calcutta`
     * rather than `Asia/Kolkata`. Without this file the feature silently does nothing
     * for a large share of readers, and silently is the operative word — there is no
     * error, just no shelf.
     *
     * Found by reading the timezone off a real machine rather than trusting the table.
     */
    text('https://data.iana.org/time-zones/tzdb/backward'),
  ]);

  const name = new Map();
  for (const line of countryInfo.split('\n')) {
    if (!line || line.startsWith('#')) continue;
    const cols = line.split('\t');
    if (cols[0] && cols[4]) name.set(cols[0], cols[4]);
  }

  const rows = zoneTab.split('\n').filter((l) => l && !l.startsWith('#'));
  if (rows.length < EXPECT_ZONES) {
    throw new Error(`only ${rows.length} zones in zone1970.tab; nothing written`);
  }

  /** Countries the catalogue actually holds, so a mapping cannot point at nothing. */
  const known = new Set(
    JSON.parse(await readFile(CATALOGUE, 'utf8'))
      .map((row) => canonicalCountry(row.country ?? ''))
      .filter(Boolean),
  );

  const map = {};
  const unmatched = new Set();

  for (const row of rows) {
    const [codes, , zone] = row.split('\t');
    if (!zone) continue;

    /*
     * The first code is the zone's primary country and the rest share its clock. Where
     * the atlas holds nothing for the primary, one of the others will do: `Asia/Dubai`
     * is listed for the UAE, Oman, Réunion, the Seychelles and the French Southern
     * Territories, and a reader in Dubai is better served by Omani food than by being
     * told the atlas has nothing for them.
     *
     * Only ever a country the catalogue can actually fill, which is what stops this
     * degrading into a mapping that points at nothing.
     */
    const candidates = codes
      .split(',')
      .map((iso) => canonicalCountry(name.get(iso) ?? ''))
      .filter(Boolean);

    const country = candidates.find((c) => known.has(c));
    if (country) map[zone.trim()] = country;
    else if (candidates[0]) unmatched.add(`${zone.trim()} -> ${candidates[0]}`);
  }

  /*
   * Every alias inherits its target's country. Lines read:
   *
   *   Link  America/Indiana/Indianapolis  America/Indianapolis
   *
   * target first, alias second. An alias whose target the atlas dropped is skipped
   * rather than guessed at.
   */
  let aliases = 0;
  for (const line of backward.split('\n')) {
    const parts = line.trim().split(/\s+/);
    if (parts[0] !== 'Link' || parts.length < 3) continue;
    const [, target, alias] = parts;
    if (map[target] && !map[alias]) {
      map[alias] = map[target];
      aliases += 1;
    }
  }

  if (!dry) await writeFile(OUT, JSON.stringify(map, null, 0), 'utf8');

  process.stdout.write(
    `${rows.length} zones read.\n` +
      `${Object.keys(map).length} map to a country the atlas holds.\n` +
      `${unmatched.size} dropped — the atlas has no records for them:\n` +
      [...unmatched].slice(0, 10).map((u) => `    ${u}`).join('\n') +
      `\n${dry ? '\n(dry run — nothing written)\n' : ''}`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nTimezone map failed: ${error.message}\n`);
  process.exitCode = 1;
});

/**
 * Move a record whose own region says it belongs on another continent.
 *
 *   node scripts/fix-misfiled-country.mjs [--dry]
 *
 * `fix-origin-country.mjs` corrects a country from what the article states, and refuses
 * where the article says nothing it can read. That leaves a residue this cannot: fifteen
 * unmistakably Korean dishes — anju, namul, sikhye, mulhoe — filed under the United States
 * with `region: "Korea"`, because eight of them have no article at all and the rest name
 * no origin in a field the reader understands.
 *
 * For those the region is the better evidence. The country came from whichever cuisine
 * category the ingest walked — "Korean cuisine in the United States" yields United States
 * — and that is the value this whole exercise has shown to be unreliable. The region
 * carries the name of the cuisine's home.
 *
 * ## Cross-continent only, and that limit is the whole design
 *
 * Run without it, this rule moves `sour rye soup` from Poland to the Czech Republic,
 * `alu tikki` from India to Bangladesh and `matta rice` from India to Sri Lanka. Żurek is
 * Polish and aloo tikki is Indian; those are neighbours sharing a dish, which is a real
 * fact about food and not a filing error. Measured before this limit went in: 46 moves,
 * of which about six were wrong in exactly that way.
 *
 * A country and a region on different continents cannot be that. Korea is not a
 * neighbouring claim on an American dish; it is a record in the wrong place. So the rule
 * fires only across continents, which leaves the plausible disagreements alone — the same
 * discriminator, and the same reasoning, as the card's place line in `domain/place.ts`.
 *
 * ## What it will not touch
 *
 * A record with `originClaims` has a dispute the origin pass recorded from its own
 * article, and that is a finding rather than a mistake.
 *
 * The target must be a country in `fix-origin-country.mjs`'s alias table, which is the
 * curated list of places the atlas can actually file under. Resolving with the app's
 * general country lookup instead moved nine British dishes to a country called "England"
 * and five American ones to a country called "Hawaii" — the atlas files those under the
 * United Kingdom and the United States, and inventing them as countries would have
 * corrupted the coverage figure this project exists to state honestly.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CATALOGUE = resolve(HERE, '../src/data/catalogue.json');
const ORIGIN_SCRIPT = resolve(HERE, 'fix-origin-country.mjs');

/** The alias table, read from the origin script so the two can never disagree. */
async function aliasTable() {
  const src = await readFile(ORIGIN_SCRIPT, 'utf8');
  const start = src.indexOf('const ALIASES = {');
  const end = src.indexOf('\n};', start) + 3;
  if (start < 0 || end < 3) throw new Error('could not read ALIASES from fix-origin-country.mjs');
  const literal = src.slice(start, end).replace('const ALIASES =', '').replace(/;\s*$/, '');
  const table = new Function(`return (${literal})`)();
  const byName = new Map();
  for (const [country, names] of Object.entries(table)) for (const n of names) byName.set(n, country);
  return byName;
}

const main = async () => {
  const dry = process.argv.includes('--dry');
  const byName = await aliasTable();
  const rows = JSON.parse(await readFile(CATALOGUE, 'utf8'));

  /*
   * Which continent each country is on, by majority of the rows that name it.
   *
   * The first version took the last row's word for it, and that is circular: the records
   * this script exists to move are precisely the ones carrying a *correct* continent
   * beside a *wrong* country. "United States" appears in the data against Elsewhere, Asia,
   * Europe and North America, so last-write-wins had the United States in Europe and the
   * cross-continent test silently stopped firing — nine British dishes were skipped and
   * the run looked clean.
   *
   * A majority is not fooled by that: the twenty-two strays cannot outvote the thousands
   * of records that are filed correctly.
   */
  const tally = new Map();
  for (const row of rows) {
    if (!row.country || !row.continent || row.continent === 'Elsewhere') continue;
    if (!tally.has(row.country)) tally.set(row.country, new Map());
    const counts = tally.get(row.country);
    counts.set(row.continent, (counts.get(row.continent) ?? 0) + 1);
  }
  const continents = new Map();
  for (const [country, counts] of tally) {
    const [winner] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    continents.set(country, winner);
  }

  const moves = [];
  for (const row of rows) {
    const target = byName.get((row.region ?? '').trim().toLowerCase());
    if (!target || target === row.country) continue;
    if (row.originClaims?.length) continue;

    const from = continents.get(row.country);
    const to = continents.get(target);
    if (!from || !to || from === to) continue;

    moves.push({ row, from: row.country, to: target });
  }

  for (const { row, to } of moves) {
    if (dry) continue;
    row.country = to;
    row.continent = continents.get(to);
    // The region now repeats the country, which the build would strip anyway.
    if ((row.region ?? '').trim().toLowerCase() === to.toLowerCase()) row.region = '';
    row.misfiledFixed = true;
  }

  if (!dry) await writeFile(CATALOGUE, JSON.stringify(rows), 'utf8');

  const counts = new Map();
  moves.forEach((m) => counts.set(`${m.from} -> ${m.to}`, (counts.get(`${m.from} -> ${m.to}`) ?? 0) + 1));
  process.stdout.write(
    `${dry ? '[dry] ' : ''}${moves.length} records moved to the country their region names.\n\n` +
      [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `  ${String(n).padStart(4)}  ${k}`).join('\n') +
      '\n\n' +
      moves.map((m) => `   ${String(m.row.name).slice(0, 30).padEnd(32)} ${m.from} -> ${m.to}`).join('\n') +
      '\n',
  );
};

await main();

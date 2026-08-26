/**
 * Repair regions that a category name was glued into.
 *
 *   node scripts/fix-glued-region.mjs [--dry]
 *
 * Found on a card, not in the data: the home page showed
 *
 *     Docang
 *     Vegetarianof Indonesia
 *
 * `regionFrom` in `ingest-cuisines.mjs` turns a Wikipedia category into a region by
 * removing the word "cuisine" or "desserts" from it. It removed the spaces on both sides
 * of that word along with it, which is invisible when the word is at the end -- "Indian
 * cuisine" gives "Indian" either way -- and welds the phrase shut when it is in the
 * middle. "Vegetarian cuisine of India" became "Vegetarianof India"; "Indian cuisine in
 * the United Kingdom" became "Indianin the United Kingdom"; "Thai desserts and snacks"
 * became "Thaiand snacks", which is 44 records on its own.
 *
 * The one-character fix is in the ingest. This is the 130 records already carrying the
 * damage.
 *
 * ## Why clearing, and not un-gluing
 *
 * Putting the space back gives "Vegetarian of India" and "Thai and snacks", which are
 * well-formed and still not places. That is the actual problem: the category named a kind
 * of food, and the region field is supposed to name a where. So the region goes, and the
 * country -- which is not in doubt for any of these -- stays. `place.ts` already states
 * the principle for the display side: "the country is the answer that is certainly true,
 * so the country is what shows."
 *
 * ## The nine that are two places, not a category
 *
 * "Central EuropeBalkans", "Ottoman EmpireEastern Mediterranean", "YogyakartaCentral
 * Java" -- these come from a different fault, an infobox field with several values run
 * together, and both halves are real. They keep the first, which is a true statement about
 * the dish rather than an invented one. Keeping both would need a separator the data does
 * not have; picking the second would need a reason there is none for.
 */

import { readFile, writeFile } from 'node:fs/promises';

/**
 * Every glued value in the data, and what to do with it.
 *
 * Written out rather than pattern-matched, because the patterns that catch these also
 * catch "Newfoundland and Labrador" -- which really does end in "land" followed by "and"
 * -- and "Hinterland of Imperia", "Thousand Islands", "KwaZulu-Natal". A list of twenty
 * exact strings cannot make that mistake.
 */
const REPAIR = {
  // A category naming a kind of food. No place in it, so no region.
  'Thaiand snacks': '',
  'Indianin the United Kingdom': '',
  'Japaneseand sweets': '',
  'Vegetarianof Japan': '',
  'Vegetarianof India': '',
  'Sri Lankanand sweets': '',
  'Bangladeshiin the United Kingdom': '',
  'Vegetarianof Indonesia': '',
  'Vegetarianof Ghana': '',
  'Pakistaniin the United Kingdom': '',
  'Vegetarianof China': '',
  'Vegetarianof Iran': '',
  'Vegetarianof Taiwan': '',

  // Two real places with the separator lost. Keep the first.
  'Ottoman EmpireEastern Mediterranean': 'Ottoman Empire',
  'East Asia (Mainland China': 'East Asia',
  'Central EuropeBalkans': 'Central Europe',
  'Bengal regionAssam': 'Bengal region',
  'NagalandKachin stateSagaing Region': 'Nagaland',
  IndonesiaPhilippines: 'Indonesia',
  'YogyakartaCentral Java': 'Yogyakarta',
};

const dry = process.argv.includes('--dry');
const files = ['catalogue', 'cuisines', 'cookbook', 'gi', 'unesco'];

let cleared = 0;
let shortened = 0;
const perValue = new Map();

for (const file of files) {
  const path = `src/data/${file}.json`;
  const rows = JSON.parse(await readFile(path, 'utf8'));
  if (!Array.isArray(rows)) continue;

  let touched = 0;
  for (const row of rows) {
    const was = row.region;
    if (!was || !(was in REPAIR)) continue;
    const now = REPAIR[was];
    if (now) row.region = now;
    else delete row.region;
    touched += 1;
    now ? (shortened += 1) : (cleared += 1);
    perValue.set(was, (perValue.get(was) ?? 0) + 1);
  }

  if (touched && !dry) await writeFile(path, JSON.stringify(rows), 'utf8');
  if (touched) console.log(`${file}: ${touched} records`);
}

console.log(`\n${cleared} regions cleared, ${shortened} shortened to their first place.`);
for (const [was, n] of [...perValue.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(3)}  ${JSON.stringify(was)} -> ${JSON.stringify(REPAIR[was])}`);
}

const missed = Object.keys(REPAIR).filter((k) => !perValue.has(k));
if (missed.length) console.log(`\nlisted but not found (already fixed?): ${missed.join(', ')}`);
if (dry) console.log('\n--dry: nothing written.');

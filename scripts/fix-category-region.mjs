/**
 * Clear regions that name a kind of food or a kind of business, not a place.
 *
 *   node scripts/fix-category-region.mjs [--dry]
 *
 * The cuisine ingest reads a region off a Wikipedia category name. Most of those are
 * places, and a steady minority are not: "Fish of Korea" on sixty records, "Wineries of
 * South Africa" on twenty-three, "Korean soups and stews" on twenty, "Drink companies of
 * China" on twenty-one, and — as far as this goes wrong — "Alcohol-related deaths in
 * China" on three.
 *
 * Each of those prints on a card as though it were where the dish comes from.
 *
 * ## The head noun decides, and nothing else does
 *
 * Every one of these has the shape "<head> of <place>" or "<head> in <place>", and the
 * head is the whole signal. Counted across the data:
 *
 *     province 230   drink companies 100   fish 60   beer 42   wineries 35
 *     companies 31   street food 29        coffee 23  metropolitan city 6
 *
 * "Province of Cagliari" and "Fish of Korea" are the same grammar and opposite things, and
 * the first word is what tells them apart. So the rule is a list of head nouns that are
 * not places, and a value is cleared only when it starts with one.
 *
 * ## Listed, not inferred
 *
 * The alternative — a list of *place* heads, keeping only what matches — is the version
 * that quietly deletes real geography, because the list of ways to name a place has no end
 * and the data holds "Hinterland of Imperia", "Horn of Africa", "Mithila of Nepal",
 * "Terai region of south western Nepal" and "Oshima area of Hokkaidō". Listing the
 * non-places instead under-removes: something new the ingest invents next month is kept
 * until somebody looks.
 *
 * That is the same direction `domain/place.ts` chose for the same reason: "it
 * under-removes ... and that is the direction this file already chose to err in when the
 * alternative is throwing away places that are real."
 *
 * ## What replaces them
 *
 * Nothing. The country is untouched and was never in doubt; a record simply stops claiming
 * a region it never had. That is what `cardPlace` already falls back to.
 */

import { readFile, writeFile } from 'node:fs/promises';

/**
 * Head nouns that name a food, a drink, a trade or an event — never a place.
 *
 * Every entry was read off the data, not imagined. Anchored at the start, so "Province of
 * Cosenza" is untouched by the word "companies" appearing anywhere else.
 */
const NOT_A_PLACE = [
  'fish',
  'drink companies',
  'companies',
  'snack food manufacturers',
  'wineries',
  'winery',
  'wine regions',
  'breweries',
  'brewery',
  'beer',
  'coffee',
  'alcohol',
  'alcohol-related deaths',
  'drinking establishments',
  'mineral water',
  'street food',
  'deep fried foods',
  'gi-tagged mangoes',
  'chinatowns',
  'regionals',
  'history',
  /*
   * Bare plural only. "Regions of Vietnam" is a category page; "Northern Region of
   * Peninsular Malaysia", "Delta Region of Coastal Andhra", "Hilly region of Nepal" and
   * "Terai region of south western Nepal" all name somewhere, and every one of them has a
   * qualifier in front, so anchoring at the start keeps them.
   */
  'regions',
];

/** "Korean soups and stews" — a menu section, with no "of" to hang the rule on. */
const MENU_SECTION = /\bsoups and stews$/i;

/**
 * "Nationwide in Indonesia" says the dish is from the whole country, which is what the
 * country field already says. It is not wrong, only empty, and it reads as a place name
 * on a card when it is not one.
 */
const NATIONWIDE = /^nationwide\b/i;

const HEAD = new RegExp(`^(?:${NOT_A_PLACE.join('|')})\\s+(?:of|in)\\s+`, 'i');

const isCategory = (region) => HEAD.test(region) || MENU_SECTION.test(region) || NATIONWIDE.test(region);

const dry = process.argv.includes('--dry');

let cleared = 0;
const perValue = new Map();
const keptWithPreposition = new Map();

for (const file of ['catalogue', 'cuisines', 'cookbook', 'gi', 'unesco']) {
  const path = `src/data/${file}.json`;
  const rows = JSON.parse(await readFile(path, 'utf8'));
  if (!Array.isArray(rows)) continue;

  let touched = 0;
  for (const row of rows) {
    const region = (row.region ?? '').trim();
    if (!region) continue;
    if (isCategory(region)) {
      delete row.region;
      touched += 1;
      cleared += 1;
      perValue.set(region, (perValue.get(region) ?? 0) + 1);
    } else if (/\s(?:of|in)\s/i.test(region)) {
      keptWithPreposition.set(region, (keptWithPreposition.get(region) ?? 0) + 1);
    }
  }

  if (touched && !dry) await writeFile(path, JSON.stringify(rows), 'utf8');
  if (touched) console.log(`${file}: ${touched} records`);
}

console.log(`\ncleared ${cleared} regions across ${perValue.size} distinct values:`);
for (const [v, n] of [...perValue.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(3)}  ${JSON.stringify(v)}`);
}

/* The important half of a dry run: what the rule chose to keep that looks similar. */
console.log(`\nkept, same grammar (check these are places) — ${keptWithPreposition.size} distinct:`);
for (const [v, n] of [...keptWithPreposition.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(3)}  ${JSON.stringify(v)}`);
}

if (dry) console.log('\n--dry: nothing written.');

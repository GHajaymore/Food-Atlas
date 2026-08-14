/**
 * Remove the things that are not dishes.
 *
 *   node scripts/clean-cuisines.mjs [--dry]
 *
 * The first cuisine run walked into ingredient categories before the filter was
 * tightened, so src/data/cuisines.json still holds rice varieties, vegetables,
 * spices, a cooking stove and the cuisine overview articles themselves. They are
 * real subjects with real articles — they are simply not dishes, and as records they
 * are the empty entries the catalogue was cleaned of once already.
 *
 * They also skew every measurement: "only 6 of 60 rows have a described preparation"
 * was largely an artefact of enriching produce, because a rice cultivar has no
 * preparation section to find.
 *
 * Two signals decide it, both cheap and both conservative — a row is dropped only on
 * a clear match, since wrongly dropping a real dish is the worse error.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CUISINES = resolve(HERE, '../src/data/cuisines.json');

/** Produce, cultivars, equipment and meta-articles. */
const NOT_A_DISH = [
  // Cultivars and produce — usually "<place> <crop>" or "<crop> of <place>".
  /\b(rice|wheat|millet|paddy|mango|banana|onion|brinjal|eggplant|potato|chilli|chili|pepper|turmeric|cardamom|saffron|tea|coffee|cashew|coconut|jaggery|betel|areca|orange|grape|apple|guava|litchi|lychee|pineapple|papaya|jackfruit|tamarind)\b\s*$/i,
  /^(.*\s)?(cultivar|variety|varieties|breed|crop|plantation|orchard)\b/i,
  // Equipment and technique articles.
  /\b(angithi|tandoor oven|chulha|griddle|mortar|pestle|cookware|utensil|stove|oven)\b/i,
  // Meta-articles: the cuisine overview itself, lists, culture pieces.
  /\b(cuisine|gastronomy|culinary|food culture|list of|outline of|history of|index of)\b/i,
  // Drinks that are agricultural products rather than prepared dishes.
  /\bgeographical indication\b/i,
];

/** A GI tag on a raw product is the strongest single signal it is produce. */
const GI_PRODUCE = /\b(gi tag|gi tagged)\b/i;

const isDish = (row) => {
  const name = (row.name || '').trim();
  if (!name) return false;
  if (GI_PRODUCE.test(name)) return false;
  return !NOT_A_DISH.some((pattern) => pattern.test(name));
};

const main = async () => {
  const dry = process.argv.includes('--dry');
  const rows = JSON.parse(await readFile(CUISINES, 'utf8'));

  const kept = rows.filter(isDish);
  const dropped = rows.filter((r) => !isDish(r));

  process.stdout.write(`${rows.length} rows → ${kept.length} kept, ${dropped.length} dropped\n\n`);
  process.stdout.write('dropped sample:\n');
  for (const row of dropped.slice(0, 20)) process.stdout.write(`  ${row.name}\n`);

  if (dry) {
    process.stdout.write('\n--dry: nothing written.\n');
    return;
  }

  await writeFile(CUISINES, JSON.stringify(kept), 'utf8');
  const places = new Set(kept.filter((r) => r.region).map((r) => `${r.country}|${r.region}`));
  process.stdout.write(`\nWrote ${kept.length} dishes. ${places.size} distinct places.\n`);
};

main().catch((error) => {
  process.stderr.write(`\nClean failed: ${error.message}\n`);
  process.exitCode = 1;
});

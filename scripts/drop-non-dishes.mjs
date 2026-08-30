/**
 * Remove records that are not food.
 *
 *   node scripts/drop-non-dishes.mjs [--dry]
 *
 * The cuisine ingest walks Wikipedia's cuisine categories, and those categories contain
 * more than dishes. A category about Japanese cuisine legitimately holds *Beer in Japan*,
 * *Kit Kats in Japan* and a soft-drink company; a category about Indian cuisine holds
 * *Alcohol laws of India*, *Coffee Board of India*, and a 2015 film called *Rasam*. Each
 * is correctly categorised and none of them is a dish.
 *
 * They reach the atlas as records. *Barista (company)* is filed under India with a badge
 * and an authenticity score, which is the atlas making a claim about the traditional
 * preparation of a coffee chain.
 *
 * ## How they are identified, and why the second test matters
 *
 * A title pattern alone is not enough. The first version of this check also flagged
 * *Laung lata* and *Malu mirisata* — real dishes whose names happen to look like plant
 * binomials — so a pattern that reads as decisive on the ten cases you looked at is
 * quietly wrong on the eleventh.
 *
 * So a record has to fail twice: match a title pattern **and** carry no ingredients. Every
 * one of the 57 matches has an empty ingredient list, and every false positive the first
 * pass produced had a full one. A dish without ingredients is a stub; an article about
 * coffee production has none because there is nothing to list.
 *
 * ## What it deliberately leaves
 *
 * Ingredients and plants that really are eaten as they are, drinks, and anything whose
 * title only looks like a topic. This removes articles *about* food and things that are
 * not food; it does not adjudicate what counts as a dish.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes('--dry');

const FILES = ['../src/data/cuisines.json', '../src/data/catalogue.json'].map((f) => resolve(HERE, f));

/** Titles that describe a subject rather than name a dish. */
const NOT_A_DISH = [
  [/^List of /i, 'list article'],
  [/^(Cuisine|Culture|History|Customs and etiquette|Agriculture|Economy|Alcohol laws) (of|in) /i, 'topic article'],
  [
    /^(Beer|Wine|Tea|Coffee|Chocolate|Cocoa|Pork|Alcohol|Dairy|Ramadan|Non-vegetarian food|Kit Kats)\s+(in|of|production in|culture in|Board of)\b/i,
    'topic article',
  ],
  [/\b(production|Board|laws|occupation)\b.*\b(in|of)\b/i, 'topic article'],
  [/\((company|film|song|stone|tool|village|caste|band|TV series)\)/i, 'not food'],
];

const main = async () => {
  let removed = 0;
  const log = [];

  for (const file of FILES) {
    const rows = JSON.parse(await readFile(file, 'utf8'));
    const kept = rows.filter((row) => {
      const name = (row.name ?? '').trim();
      const hit = NOT_A_DISH.find(([pattern]) => pattern.test(name));
      if (!hit) return true;

      /* The second test. A record with ingredients is a dish whose title happened to
         match, and those are exactly the ones a title-only rule gets wrong. */
      const ingredients = Array.isArray(row.ingredients) ? row.ingredients.length : 0;
      if (ingredients > 0) return true;

      log.push(`  ${name} — ${row.country ?? '(no country)'} [${hit[1]}]`);
      removed += 1;
      return false;
    });

    if (!DRY && kept.length !== rows.length) {
      await writeFile(file, `${JSON.stringify(kept, null, 1)}\n`);
    }
    process.stdout.write(`${file.split(/[\\/]/).pop()}: ${rows.length} → ${kept.length}\n`);
  }

  process.stdout.write(`\n${DRY ? 'would remove' : 'removed'} ${removed} records\n`);
  process.stdout.write(`${log.join('\n')}\n`);
};

main();

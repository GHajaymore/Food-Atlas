/**
 * A cookbook says who wrote a recipe down, not where the dish is from.
 *
 *   node scripts/fix-cookbook-origin.mjs [--dry]
 *
 * The multilingual cookbook ingest gave every recipe the country of the cookbook it
 * came from, on the reasoning that it was the honest fallback. It is not: the French
 * cookbook contains Paella, Pad Thai, Pierogi, Goulash, Kluski and Curry japonais,
 * and all of them arrived filed under France.
 *
 * That is precisely the mistake `fix-origin-country.mjs` exists to correct on the
 * other side of the catalogue, where a dish was filed under whichever cuisine
 * category ate it. A cuisine category tells you who eats a dish; a cookbook tells you
 * who wrote it down. Neither tells you where it is from, and the atlas is about the
 * third thing.
 *
 * ## The correction
 *
 * The catalogue already holds 16,645 records whose countries have been through
 * Wikidata's country-of-origin claims, the article infoboxes and the register. If a
 * recipe's name matches one of them, that record knows better than the cookbook does.
 *
 * Where nothing matches, the cookbook's country stands. A recipe with a French name
 * in the French cookbook is most likely French, and the failure this fixes is
 * foreign dishes with foreign names — which is exactly what a name match catches.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = (name) => resolve(HERE, `../src/data/${name}.json`);

/** Compare names ignoring case, accents, punctuation and a trailing number. */
const fold = (name) =>
  (name ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    // "Pizza aux poivrons 2" is the same dish as "Pizza aux poivrons".
    .replace(/\s+\d+\s*$/, '')
    .replace(/[^a-z0-9]/g, '');

const main = async () => {
  const dry = process.argv.includes('--dry');

  const cookbook = JSON.parse(await readFile(DATA('cookbook'), 'utf8'));
  const wikidata = JSON.parse(await readFile(DATA('catalogue'), 'utf8'));
  const cuisines = JSON.parse(await readFile(DATA('cuisines'), 'utf8'));

  /**
   * Countries the researched sources have settled on, by folded name.
   *
   * Cuisine rows first. Both sources have now been through Wikidata's country-of-
   * origin claims, but a cuisine row also carries an article, its infobox and its
   * prose, and its country has additionally been checked against the article's own
   * place-of-origin field. A Wikidata row that never had an article has none of
   * that.
   *
   * The ordering is not academic: both files hold a record for pierogi, the cuisine
   * one says Poland and the Wikidata one says China, and reading them the other way
   * round moved every French cookbook pierogi to China.
   */
  const origin = new Map();
  for (const row of [...cuisines, ...wikidata]) {
    if (!row.name || !row.country) continue;
    const key = fold(row.name);
    if (key.length > 3 && !origin.has(key)) origin.set(key, row.country);
  }
  process.stdout.write(`${origin.size} researched dish names to match against.\n`);

  const moved = [];
  for (const recipe of cookbook) {
    // Only the cookbooks that were given a blanket country by their language.
    if (!recipe.sourceLanguage || recipe.sourceLanguage === 'en') continue;

    const known = origin.get(fold(recipe.name));
    if (!known || known === recipe.country) continue;

    moved.push(`${recipe.name.slice(0, 32).padEnd(34)} ${String(recipe.country).padEnd(10)} -> ${known}`);
    if (!dry) {
      recipe.country = known;
      recipe.countryFromCatalogue = true;
    }
  }

  if (!dry) await writeFile(DATA('cookbook'), JSON.stringify(cookbook), 'utf8');

  process.stdout.write(
    `\n${moved.length} recipes moved to the country the catalogue knows them from.\n\n` +
      moved.slice(0, 30).join('\n') +
      '\n',
  );
};

main().catch((error) => {
  process.stderr.write(`\nCookbook origin correction failed: ${error.message}\n`);
  process.exitCode = 1;
});

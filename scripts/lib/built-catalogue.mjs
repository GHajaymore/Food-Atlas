/**
 * The catalogue as a *reader* eventually sees it, for scripts that run without a browser.
 *
 * Two bodies of text are held back from the first payload and fetched after the paint:
 * cookbook step text, and the written accounts. `src/data/catalogue.ts` patches both into
 * the records a moment later, so by the time anybody reads a screen the records are whole.
 *
 * A build script never runs that second fetch. It calls `buildCatalogue`, gets records
 * whose `steps` and `prepSummary` are empty, and has no way of knowing they are only
 * empty *yet*. That has now produced the same silent failure twice:
 *
 *   - `prerender-records.mjs` wrote recipe markup for **6 records instead of 4,488**,
 *     because every cookbook record looked methodless.
 *   - Deferring the accounts dropped **1,283 records** out of the prerender and the
 *     sitemap, because a record documented only by prose looked like a bare name.
 *
 * Neither failed. Both runs reported success, and the only symptom was a count being
 * smaller than it should have been — which you have to already suspect to check.
 *
 * So the reconstruction lives here, once, and the scripts ask for a finished catalogue
 * rather than a half-loaded one. Anything deferred in future belongs in this function,
 * where it is in front of the next person rather than behind them.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = resolve(HERE, '../../public/data');

const read = (name) => JSON.parse(readFileSync(resolve(DATA, `${name}.json`), 'utf8'));

/** Optional: a detail file is only written for the sources that defer something. */
const readIfPresent = (name) => {
  try {
    return read(name);
  } catch {
    return null;
  }
};

/**
 * Build the catalogue and put the deferred text back.
 *
 * Returns the same shape `buildCatalogue` does, so a caller that needs the row maps for
 * something else still has them.
 */
export async function builtCatalogue() {
  const { buildCatalogue } = await import('../../src/data/build.ts');
  const { recipeLines } = await import('../../src/domain/recipeLines.ts');
  const { decodeEntities } = await import('../../src/domain/text.ts');

  const built = buildCatalogue(read('catalogue'), read('cuisines'), read('cookbook'), read('unesco'), read('gi'));
  const { catalogue, cookbookRows, cuisineRows, importedProseRows } = built;

  const byId = new Map(catalogue.map((dish) => [dish.id, dish]));
  const attached = { steps: 0, prose: 0 };

  /* Cleaned exactly as the loader cleans it, so a method here is the method on the page. */
  const detail = readIfPresent('cookbook-detail');
  if (detail) {
    for (let i = 0; i < cookbookRows.length; i += 1) {
      const steps = detail[cookbookRows[i]]?.steps;
      if (!steps?.length) continue;
      const dish = byId.get(300_000 + i);
      if (!dish) continue;
      dish.steps = recipeLines(steps.map(decodeEntities));
      attached.steps += 1;
    }
  }

  /*
   * The accounts, through the same two mappings the loader uses.
   *
   * Cuisine records are `100_000 + index` over rows that survived a filter, so the map
   * runs record -> row and is inverted here. Imported records carry their row's own id,
   * so that map is simply the id column of `catalogue.json`.
   */
  const proseFrom = (file, idFor) => {
    const rows = readIfPresent(`${file}-detail`);
    if (!rows) return;
    for (let row = 0; row < rows.length; row += 1) {
      const prose = rows[row]?.prepSummary;
      if (!prose) continue;
      const dish = byId.get(idFor(row));
      if (!dish) continue;
      dish.prepSummary = prose;
      attached.prose += 1;
    }
  };

  const cuisineIdFor = new Map();
  for (let i = 0; i < cuisineRows.length; i += 1) cuisineIdFor.set(cuisineRows[i], 100_000 + i);

  proseFrom('cuisines', (row) => cuisineIdFor.get(row));
  proseFrom('catalogue', (row) => importedProseRows[row]);

  process.stderr.write(
    `built-catalogue: ${attached.steps} methods and ${attached.prose} accounts reattached\n`,
  );

  return built;
}

export { read };

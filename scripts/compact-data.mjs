/**
 * Ship the data the app reads, and not the notes the scripts kept.
 *
 *   node scripts/compact-data.mjs [--dry]
 *
 * Every record in this project carries two kinds of field. There is what the app
 * shows a reader — a name, a place, a method, a photograph — and there is what the
 * enrichment passes wrote to themselves so they would not do the same work twice:
 * `imageChecked`, `originChecked`, `wikidataChecked`, `leadFile`, `nativeChecked`,
 * and a dozen more.
 *
 * The second kind is essential and belongs in the repository. It has no business in
 * the app bundle, and it was in it: 1.4 MB of JSON that every reader downloads and
 * nothing ever displays, inside a bundle that reached 25 MB.
 *
 * So the source files keep everything and this writes the reading copy. The scripts
 * go on working against the full files; the app imports the compact ones.
 *
 * ## Why an allow-list
 *
 * The fields to keep are named rather than the fields to drop. A deny-list rots the
 * moment a script invents a new flag — the flag ships silently and nobody notices,
 * which is exactly how this got to 1.4 MB. An allow-list fails the other way: a new
 * field the app genuinely needs is missing and obvious immediately.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = (name) => resolve(HERE, `../src/data/${name}.json`);
const PUBLIC = (name) => resolve(HERE, `../public/data/${name}.json`);

/**
 * What `catalogue.ts` reads out of each source.
 *
 * Kept in step with that file by hand, which is the cost of the allow-list and is
 * worth paying: the failure mode is a missing field, which the typecheck and the
 * screens catch at once.
 */
const KEEP = {
  cuisines: [
    'title', 'name', 'country', 'region', 'url', 'cuisine',
    'ingredients', 'prepSummary', 'course',
    'photo', 'credit', 'licence', 'leadFile',
    'views', 'langs', 'langNames', 'sourceLanguage', 'notFood',
    'atRiskEvidence', 'originClaims',
    'heritage', 'giReference', 'giAttribution',
  ],
  cookbook: [
    'title', 'name', 'ingredients', 'steps', 'url', 'country', 'region',
    'sourceLanguage', 'photo', 'credit', 'licence', 'pageImageChecked',
  ],
  catalogue: [
    'id', 'name', 'country', 'region', 'continent', 'qid', 'blurb',
    'photo', 'credit', 'licence', 'evidence', 'url', 'infobox',
    'ingredients', 'prepSummary', 'course', 'equipment',
    'views', 'langs', 'langNames', 'sourceLanguage', 'notFood',
    'patRegion', 'patAttribution', 'atRiskEvidence', 'originClaims',
    'heritage', 'giReference', 'giAttribution',
  ],
  unesco: ['reference', 'name', 'countries', 'country', 'list', 'url', 'photo', 'credit', 'licence'],
  gi: [
    'reference', 'name', 'alsoKnownAs', 'country',
    'designation', 'designationCode', 'category', 'registered', 'url', 'attribution',
  ],
};

/**
 * Language names beyond the ones the app can label are dead weight.
 *
 * `langNames` arrives with every edition an article exists in — eighty or more per
 * record — and `LocalNames` only renders the languages the app knows. Trimming to
 * that set is the difference between shipping the name of a dish in Cebuano and
 * shipping nothing at all for it.
 */
const OFFERED = new Set(
  (await readFile(resolve(HERE, '../src/domain/language.ts'), 'utf8'))
    .matchAll(/\{\s*code:\s*'([a-z-]+)'/g)
    .map((m) => m[1]),
);

const trim = (row, keep) => {
  const out = {};
  for (const field of keep) {
    const value = row[field];
    if (value === undefined || value === '' || (Array.isArray(value) && !value.length)) continue;

    if (field === 'langNames') {
      const kept = Object.fromEntries(Object.entries(value).filter(([code]) => OFFERED.has(code)));
      if (Object.keys(kept).length) out[field] = kept;
      continue;
    }
    if (field === 'langs') {
      const kept = value.filter((code) => OFFERED.has(code));
      if (kept.length) out[field] = kept;
      continue;
    }
    out[field] = value;
  }
  return out;
};

const main = async () => {
  const dry = process.argv.includes('--dry');
  let before = 0;
  let after = 0;

  for (const [name, keep] of Object.entries(KEEP)) {
    const rows = JSON.parse(await readFile(DATA(name), 'utf8'));
    const compact = rows.map((row) => trim(row, keep));

    const from = JSON.stringify(rows).length;
    const to = JSON.stringify(compact).length;
    before += from;
    after += to;

    /*
     * Written to both places, because there is no third step.
     *
     * `src/data/*.min.json` is the compaction's output and `public/data/*.json` is
     * what the app actually fetches, and until now the second was produced by copying
     * the first by hand. A hand copy that is skipped leaves the app serving the
     * previous run's data while every file on disk says the pass succeeded — the
     * quietest kind of wrong. One write each, same bytes, no step to remember.
     */
    if (!dry) {
      const json = JSON.stringify(compact);
      await writeFile(DATA(`${name}.min`), json, 'utf8');
      await writeFile(PUBLIC(name), json, 'utf8');
    }
    process.stdout.write(
      `${name.padEnd(11)} ${(from / 1048576).toFixed(1)} MB -> ${(to / 1048576).toFixed(1)} MB` +
        `  (${Math.round((1 - to / from) * 100)}% smaller)\n`,
    );
  }

  process.stdout.write(
    `\ntotal ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB, ` +
      `${((before - after) / 1048576).toFixed(1)} MB never sent.\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nCompaction failed: ${error.message}\n`);
  process.exitCode = 1;
});

/**
 * Put `origin` on every copy of a dish, not just the one that happened to be enriched.
 *
 *   node scripts/propagate-origin.mjs [--dry]
 *
 * ## Why this is needed at all
 *
 * The atlas holds the same dish from more than one source. `build.ts` deduplicates by
 * lowercased name and one copy wins — usually the Wikidata import, because it is richer.
 * So a field written onto the cuisine copy of naan is written onto the copy that loses,
 * and reaches no reader.
 *
 * `enrich-origin-wikidata.mjs` was run against both files, which was not enough: it only
 * acts on rows the audit marked as having no supported country, and a dish can be
 * `unplaceable` in one source and `supported` in the other. Naan carries an origin in
 * `cuisines.json` and its import copy — the one that wins — was skipped.
 *
 * `plumbing.test.ts` caught it. That test exists precisely because a field can be written
 * correctly, compacted correctly, shipped correctly and still reach nobody, and counting
 * rows in the source file will happily report success the whole way.
 *
 * ## What it does
 *
 * Matches on the same key `build.ts` deduplicates by — the trimmed, lowercased name — and
 * copies `origin` from any row that has one to every row of that name that does not.
 * Never overwrites an existing value, and never invents one: if no copy of a dish has an
 * origin, none gets one.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes('--dry');

const FILES = ['cuisines', 'catalogue', 'cookbook'].map((n) => ({ name: n, path: resolve(HERE, `../src/data/${n}.json`) }));

/** The key `build.ts` deduplicates on. */
const key = (name) => (name ?? '').trim().toLowerCase();

const main = async () => {
  const loaded = [];
  for (const file of FILES) loaded.push({ ...file, rows: JSON.parse(await readFile(file.path, 'utf8')) });

  /* One origin per name, taken from whichever copy already has one. */
  const origins = new Map();
  for (const { rows } of loaded) {
    for (const row of rows) {
      if (!row.origin) continue;
      const k = key(row.name);
      if (!origins.has(k)) origins.set(k, row.origin);
    }
  }
  process.stdout.write(`${origins.size} distinct dishes carry an origin\n`);

  let added = 0;
  for (const { name, rows, path } of loaded) {
    let here = 0;
    for (const row of rows) {
      if (row.origin) continue;
      const found = origins.get(key(row.name));
      /* Not onto a copy already filed under that place — the field exists to say
         something the filing does not. */
      if (!found || found === row.country) continue;
      row.origin = found;
      here += 1;
    }
    added += here;
    if (!DRY && here) await writeFile(path, `${JSON.stringify(rows, null, 1)}\n`);
    process.stdout.write(`  ${name}: ${here} rows given an origin they were missing\n`);
  }

  process.stdout.write(`\n${DRY ? 'would add' : 'added'} ${added}\n`);
};

main();

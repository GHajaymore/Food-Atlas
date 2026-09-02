/**
 * Prove that deferring the prose changed nothing a reader can see.
 *
 *   node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs \
 *     scripts/verify-prose-split.mjs <before-dir>
 *
 * `prepSummary` moved to a second payload and the facts derived from it — a length that
 * feeds `assess()`, a card's sentence, a decline finding — are now computed once by
 * `compact-data.mjs` instead of on every load. That is a change of *where*, and it is only
 * safe if it is not also a change of *what*.
 *
 * The failure it exists to catch is silent by construction. A length measured on the raw
 * string rather than the cleaned one is out by however many characters `cleanProse`
 * prepends, `extractLength` shifts, and badges move across the atlas with nothing on
 * screen to say so. Nothing throws; the tests still pass; the numbers are simply
 * different from the ones the atlas has been publishing.
 *
 * So this builds the catalogue twice — once from the files as they were, once from the
 * files as they are — and compares the records field by field. The two runs must agree on
 * every score, every badge, every blurb and every at-risk finding.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const before = process.argv[2];
if (!before) {
  process.stderr.write('usage: verify-prose-split.mjs <directory holding the previous files>\n');
  process.exit(2);
}

const { buildCatalogue } = await import('../src/data/build.ts');

const read = (dir, name) => JSON.parse(readFileSync(resolve(dir, `${name}.json`), 'utf8'));

const build = (dir, shared) =>
  buildCatalogue(
    read(dir, 'catalogue'),
    read(dir, 'cuisines'),
    shared.cookbook,
    shared.unesco,
    shared.gi,
  ).catalogue;

const shared = {
  cookbook: read('public/data', 'cookbook'),
  unesco: read('public/data', 'unesco'),
  gi: read('public/data', 'gi'),
};

const old = build(before, shared);
const now = build('public/data', shared);

/* Everything a reader meets that the prose used to decide. `prepSummary` itself is
   deliberately absent: it is empty in the second run by design, which is the change. */
const WATCHED = ['score', 'badgeLevel', 'badgeLabel', 'blurb', 'atRisk', 'atRiskEvidence', 'prepLength'];

if (old.length !== now.length) {
  process.stderr.write(`FAIL  the catalogue changed size: ${old.length} -> ${now.length}\n`);
  process.exit(1);
}

const byId = new Map(now.map((dish) => [dish.id, dish]));
const drift = new Map(WATCHED.map((field) => [field, []]));
let missing = 0;

for (const was of old) {
  const is = byId.get(was.id);
  if (!is) {
    missing += 1;
    continue;
  }
  for (const field of WATCHED) {
    /* `prepLength` is the one field that did not exist before; it is checked against the
       length of the prose that used to be there, which is what it claims to be. */
    const left = field === 'prepLength' ? was.prepSummary.length : was[field];
    if (JSON.stringify(left) !== JSON.stringify(is[field])) {
      drift.get(field).push([was.name, left, is[field]]);
    }
  }
}

let failed = missing > 0;
if (missing) process.stderr.write(`FAIL  ${missing} records vanished from the rebuild\n`);

for (const [field, rows] of drift) {
  if (!rows.length) {
    process.stdout.write(`ok    ${field.padEnd(15)} identical across ${old.length} records\n`);
    continue;
  }
  failed = true;
  process.stderr.write(`FAIL  ${field.padEnd(15)} ${rows.length} records differ\n`);
  for (const [name, was, is] of rows.slice(0, 5)) {
    process.stderr.write(`        ${name}\n          was: ${JSON.stringify(was)?.slice(0, 110)}\n          is : ${JSON.stringify(is)?.slice(0, 110)}\n`);
  }
}

/* The prose must still be reachable, or the split lost it rather than deferring it. */
const held = [
  ['cuisines', read('public/data', 'cuisines-detail')],
  ['catalogue', read('public/data', 'catalogue-detail')],
];
for (const [name, rows] of held) {
  const withProse = rows.filter((row) => row.prepSummary).length;
  process.stdout.write(`ok    ${name}-detail    ${withProse} accounts held back\n`);
  if (!withProse) {
    process.stderr.write(`FAIL  ${name}-detail is empty — the prose was dropped, not deferred\n`);
    failed = true;
  }
}

process.stdout.write(failed ? '\nthe split is NOT safe\n' : '\nnothing a reader can see has changed\n');
process.exitCode = failed ? 1 : 0;

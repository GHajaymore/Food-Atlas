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

import { commonsFile } from '../src/domain/commons.ts';
/*
 * The builder's own cleaners, imported rather than copied.
 *
 * This script now writes numbers the builder used to compute — a prose length that feeds
 * `assess()`, a blurb a card prints, a decline finding a shelf reads. A second
 * implementation of any of them would drift silently, and the drift would show up as
 * badges moving across the atlas with nothing to point at.
 */
import { cleanBlurb, cleanName, cleanProse } from '../src/data/build.ts';
import { detectAtRisk } from '../src/domain/atRisk.ts';
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
/**
 * Fields held back from the first payload and fetched once the app has painted.
 *
 * Measured on the live site: a cold visit is 2.92 MB of brotli and 1,215 ms before anything
 * renders, and `steps` alone is 56% of cookbook.json — 3.84 MB decoded, read by exactly one
 * screen. Holding it back takes the critical path to **2.02 MB, 31% less**. The full
 * measurement, and what was tried and rejected, is in `docs/first-paint.md`.
 *
 * ## Three fields that look identical and cannot move
 *
 * `prepSummary` is 35% of cuisines.json and was on this list until the build was read
 * properly. It is **evidence**: `hasAccount: prepSummary.length > 0` feeds `assess()`, so
 * deferring it would move scores across the catalogue, and `detectAtRisk(prepSummary)`
 * reads the prose itself to decide whether a tradition is declining.
 *
 * `langNames` is 16% of the same file and is not decoration either — `queries.ts` searches
 * it, so a dish can be found by its name in any of 34 languages, and `proposals.ts` uses it
 * to detect duplicates.
 *
 * Which leaves `steps`, where the text really is read by one screen and everything else
 * wants the count. `stepCount` goes in the light row and `methodLength()` reads it.
 *
 * ## `prepSummary` moved too, once it was measured properly
 *
 * The paragraph above says it cannot. That was half right and is corrected here, because
 * the objection was to deferring the *facts*, not the text. Every runtime use of
 * `prepSummary` other than displaying it reduces to something computable now:
 *
 * | read | becomes |
 * |---|---|
 * | `hasAccount: prepSummary.length > 0` | `prepLength > 0` |
 * | `extractLength: prepSummary.length` | `prepLength` |
 * | `registerMethod: patRegion && prepSummary` | `patRegion && prepLength` |
 * | `detectAtRisk(prepSummary)` | `atRiskEvidence`, precomputed below |
 * | `cleanBlurb(prepSummary.slice(0, 220))` | `blurb`, precomputed below |
 * | `prepSummary.trim()` in six screens | `hasProse()` |
 *
 * Which leaves the dish screen, the one place that shows the prose as prose. Exactly the
 * `steps` shape, and without the trap that killed the first attempt: nothing here needs a
 * placeholder, because a length is a number rather than a list of empty strings.
 *
 * **The scalars are computed with the builder's own functions**, imported rather than
 * reimplemented. `cleanProse` prepends the dish name to a sentence that lost its subject,
 * so cleaned and raw lengths differ, and `hasAccount` feeds `assess()` — a length measured
 * the wrong way here would move badges across the atlas and nothing would report it.
 *
 * ## What it is worth, and why it is not double
 *
 * `prepSummary` is 46% of `cuisines.json`, but the card still needs the first 220
 * characters of it, so only the tail can actually go. Measured on the published files:
 * 331 KB of brotli off a 2,583 KB critical path, about 13%. `catalogue.json` gives up
 * more of its share than `cuisines.json` does, because its rows already carry a stored
 * `blurb` and there is nothing to keep back for them.
 */
const DEFER = {
  cookbook: ['steps'],
  cuisines: ['prepSummary'],
  catalogue: ['prepSummary'],
};

const KEEP = {
  cuisines: [
    'title', 'name', 'country', 'region', 'url', 'cuisine',
    'ingredients', 'prepSummary', 'course',
    'photo', 'credit', 'licence', 'leadFile',
    'views', 'langNames', 'sourceLanguage', 'notFood',
    'atRiskEvidence', 'originClaims', 'origin',
    'heritage', 'giReference', 'giAttribution',
    'province', 'city',
  ],
  cookbook: [
    'title', 'name', 'ingredients', 'steps', 'url', 'country', 'region',
    'sourceLanguage', 'photo', 'credit', 'licence', 'pageImageChecked', 'origin',
  ],
  catalogue: [
    'id', 'name', 'country', 'region', 'continent', 'qid', 'blurb',
    'photo', 'credit', 'licence', 'evidence', 'url', 'infobox',
    'ingredients', 'prepSummary', 'course', 'equipment',
    'views', 'langNames', 'sourceLanguage', 'notFood',
    'patRegion', 'patAttribution', 'atRiskEvidence', 'originClaims', 'origin',
    'heritage', 'giReference', 'giAttribution',
    'province', 'city',
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
    /*
     * A photograph is stored as its Commons file name, not its address.
     *
     * Every one of the 10,638 photographs is on Commons, behind one of three URL
     * prefixes repeated over and over — 1.8 MB of them across the published files. The
     * app rebuilds the URL at render time anyway (domain/commons.ts, which asks for the
     * width it will draw at), so the prefix was being shipped to be thrown away.
     *
     * Brotli compresses a repeated prefix to almost nothing, so this is worth only 5% on
     * the wire — and 17% of the JSON a phone has to parse, which is the scarcer resource.
     */
    if (field === 'photo' && typeof value === 'string') {
      const name = commonsFile(value);
      out[field] = name || value;
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
    /*
     * Split into what the first paint needs and what it does not.
     *
     * The two arrays stay index-aligned rather than keyed by id, because ids are assigned
     * later in `build.ts` and nothing at this layer has one. Alignment is the contract; the
     * loader carries a map through the filter that drops a third of the rows, so late text
     * cannot land under another recipe's name.
     */
    const defer = DEFER[name] ?? [];

    /*
     * The prose, cleaned once, and every fact that is derived from it.
     *
     * Cleaned here rather than in the loader because `cleanProse` needs the dish name to
     * repair a sentence that opens "is a flatbread…", and the loader patches text into a
     * record by id without the row in front of it. What ships in the detail file is what
     * `build.ts` would have produced, so the loader assigns it and nothing re-derives.
     */
    const prose = compact.map((row) =>
      typeof row.prepSummary === 'string' ? cleanProse(row.prepSummary, cleanName(row.name ?? '')) : '',
    );

    const light = compact.map((row, i) => {
      const out = { ...row };
      for (const field of defer) delete out[field];
      /* The count survives even though the words do not — see domain/method.ts. */
      if (Array.isArray(row.steps)) out.stepCount = row.steps.length;

      if (defer.includes('prepSummary')) {
        const text = prose[i];
        if (text) out.prepLength = text.length;
        else delete out.prepLength;

        /*
         * The card's sentence — and only for the cuisine file.
         *
         * The two sources answer "what does this card say" in opposite directions, which
         * is easy to miss because the field has the same name in both. A cuisine row has
         * never carried a `blurb`, so its builder cuts one from the account, and with the
         * account deferred that cut has to happen here. An imported row carries Wikidata's
         * own short description — "Variety of corn kernel which expands and puffs up on
         * heating" — and its builder has always preferred that to the article prose.
         *
         * Deriving for both replaced 597 of those descriptions with the opening of a
         * Wikipedia paragraph: Popcorn stopped saying what popcorn is and started saying
         * it can be cooked with butter or oil. `verify-prose-split.mjs` caught it, which
         * is the entire reason that script was written before this line was.
         */
        if (name === 'cuisines') {
          const blurb = text ? cleanBlurb(text.slice(0, 220), cleanName(row.name ?? '')) : '';
          if (blurb) out.blurb = blurb;
          else delete out.blurb;
        }

        /*
         * Decline is read off the prose, so it has to be read before the prose leaves.
         *
         * The builder prefers a stored `atRiskEvidence` and falls back to scanning the
         * text; with the text deferred that scan finds nothing, and the Disappearing shelf
         * would quietly shrink to the eight records an enrichment pass had already
         * flagged. Running the same detector here keeps the finding and its evidence
         * sentence, which is what the shelf actually shows.
         */
        if (!row.atRiskEvidence && text) {
          const risk = detectAtRisk(text);
          if (risk.atRisk) out.atRiskEvidence = risk.evidence;
        }
      }
      return out;
    });

    const detail = defer.length
      ? compact.map((row, i) => {
          const out = {};
          for (const field of defer) {
            if (field === 'prepSummary') {
              if (prose[i]) out.prepSummary = prose[i];
            } else if (row[field] !== undefined) out[field] = row[field];
          }
          return out;
        })
      : null;

    if (!dry) {
      const json = JSON.stringify(light);
      await writeFile(DATA(`${name}.min`), json, 'utf8');
      await writeFile(PUBLIC(name), json, 'utf8');
      if (detail) await writeFile(PUBLIC(`${name}-detail`), JSON.stringify(detail), 'utf8');
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

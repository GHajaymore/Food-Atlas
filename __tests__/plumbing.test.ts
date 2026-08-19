/**
 * Does what the scripts write actually reach the reader?
 *
 * Four times in one day an enrichment pass produced something correct and the app
 * quietly ignored it:
 *
 *   - `sourceLanguage` was hard-coded to 'en' in two mappings, so 5,108 records
 *     whose account is in Hindi or Chinese were presented as English and the
 *     translation layer never offered to translate them.
 *   - Ingredients were read only from `evidence`, so records enriched by the newer
 *     infobox pass looked unassessed purely because they arrived by another route.
 *   - `atRiskEvidence` was written from an article's history and then re-derived
 *     from its recipe instead, and the shelf the atlas is justified by showed six
 *     records while thirty findings sat unused.
 *   - `equipment` and the register's attribution had the same shape of problem.
 *
 * Every one was invisible. A field that never reaches the app looks exactly like a
 * field no script ever filled in, and the counters all say the pass succeeded. The
 * only way to see it is to look at the app and notice something missing, which is
 * luck rather than method.
 *
 * So this asserts the plumbing directly: for each thing a script writes, if the
 * source data has it, the built catalogue must show it. It does not check that the
 * value is *right* — the domain tests do that — only that it arrives.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildCatalogue } from '../src/data/build';
import type { Dish } from '../src/domain/types';

const read = (name: string) =>
  JSON.parse(readFileSync(resolve(__dirname, `../public/data/${name}.json`), 'utf8')) as Record<
    string,
    unknown
  >[];

const sources = {
  catalogue: read('catalogue'),
  cuisines: read('cuisines'),
  cookbook: read('cookbook'),
  unesco: read('unesco'),
};

const { catalogue } = buildCatalogue(
  sources.catalogue,
  sources.cuisines,
  sources.cookbook,
  sources.unesco,
);

const filled = (value: unknown) => {
  if (value === undefined || value === null || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

/** The source rows that carry a field with something in it. */
const rowsWith = (field: string) =>
  Object.values(sources)
    .flat()
    .filter((row) => filled(row[field]));

/**
 * Every record the app built, by name.
 *
 * Names are how a source row and a finished record are matched here. It is not a
 * perfect key — two dishes can share a name — but it is the only one the four
 * sources have in common, and for this purpose a near miss is harmless: the
 * assertion is about a field arriving at all, not about which of two records got it.
 */
const key = (name: unknown) =>
  String(name ?? '')
    .trim()
    .toLowerCase()
    // The build strips the register's tag and the encyclopaedia's disambiguator from
    // a name, so "Anguilla del Trasimeno PAT" on disk is "Anguilla del Trasimeno" in
    // the app. Matching literally reported the register plumbing as broken when it
    // was the test that could not follow the rename.
    .replace(/\s+pat$/, '')
    .replace(/\s*\((food|dish|drink|dessert|bread|cheese|wine|beer|soup|sauce|snack|pastry|sweet)\)$/, '')
    .trim();

const byName = new Map<string, Dish[]>();
for (const dish of catalogue) {
  const k = key(dish.name);
  byName.set(k, [...(byName.get(k) ?? []), dish]);
}

/**
 * Each thing a script writes, and how to see it on a finished record.
 *
 * The reader is deliberately a different expression from the writer. Asserting
 * `dish.sourceLanguage` exists would have passed while the mapping hard-coded it to
 * 'en'; asserting it is ever something *other* than 'en' is what catches that.
 */
const PLUMBING: { field: string; shows: string; reaches: (d: Dish) => boolean }[] = [
  {
    field: 'sourceLanguage',
    shows: 'an account written in a language other than English',
    reaches: (d) => Boolean(d.sourceLanguage && d.sourceLanguage !== 'en'),
  },
  { field: 'prepSummary', shows: 'a described preparation', reaches: (d) => Boolean(d.prepSummary?.trim()) },
  { field: 'ingredients', shows: 'an ingredient list', reaches: (d) => d.ingredients.length > 0 },
  { field: 'steps', shows: 'an ordered method', reaches: (d) => d.steps.length > 0 },
  { field: 'equipment', shows: 'the equipment it is made with', reaches: (d) => d.equipment.length > 0 },
  { field: 'photo', shows: 'a photograph', reaches: (d) => Boolean(d.photo) },
  { field: 'licence', shows: 'the licence beside the photograph', reaches: (d) => d.credit.includes('·') },
  { field: 'views', shows: 'a readership figure', reaches: (d) => Boolean(d.views) },
  { field: 'langNames', shows: 'the dish named in other languages', reaches: (d) => Boolean(d.localNames) },
  { field: 'langs', shows: 'the languages it can be read in', reaches: (d) => Boolean(d.readableIn?.length) },
  {
    field: 'atRiskEvidence',
    shows: 'the sentence that says the tradition is declining',
    reaches: (d) => Boolean(d.atRiskEvidence),
  },
  {
    field: 'patRegion',
    shows: 'the register credited as a source',
    reaches: (d) => d.sources.some((s) => s.title.startsWith('Prodotti Agroalimentari')),
  },
  {
    field: 'originClaims',
    shows: 'every country claiming it, with none picked as the winner',
    reaches: (d) => Boolean(d.originClaims?.length),
  },
];

describe('what the scripts write reaches the reader', () => {
  it.each(PLUMBING)('$field becomes $shows', ({ field, reaches }) => {
    const written = rowsWith(field);
    // A field nothing has written yet cannot be plumbed wrongly, and failing here
    // would only punish a pass that has not been run.
    if (!written.length) return;

    /*
     * Traced per record, not counted across the catalogue.
     *
     * The first version of this asked only whether *any* record showed the field,
     * and that version could not fail. Deleting the at-risk plumbing entirely left
     * it green, because a different code path sets `atRiskEvidence` on six other
     * records and the count stayed above zero. A field has to be followed from the
     * row that carries it to the record built from that row.
     */
    const traced = written.filter((row) => {
      return (byName.get(key(row.name)) ?? []).some(reaches);
    });

    // Not all of them: a source row can be dropped as non-food, deduplicated against
    // another source, or lose to a record of the same name. Most of them must survive.
    const survived = traced.length / written.length;
    expect({ field, written: written.length, survived: survived > 0.5 }).toEqual({
      field,
      written: written.length,
      survived: true,
    });
  });

  it('accounts for every field the sources carry', () => {
    /**
     * Bookkeeping the passes keep for themselves. Named here rather than guessed,
     * so a new flag has to be classified deliberately: the failure this catches is a
     * script inventing a field that should reach the reader and nobody noticing it
     * does not.
     */
    const BOOKKEEPING = new Set([
      'imageChecked', 'leadImageChecked', 'leadFile', 'langsChecked', 'nativeChecked',
      'originChecked', 'wikidataChecked', 'countryChecked', 'urlChecked', 'riskChecked',
      'countryFromTitle', 'countryFromCatalogue', 'placeFromCategory', 'ingredientsLanguage',
      'atRiskStrength', 'notFood', 'infobox',
    ]);

    // Fields the build reads for its own reasons rather than showing directly.
    const STRUCTURAL = new Set([
      'id', 'qid', 'name', 'title', 'country', 'countries', 'region', 'continent',
      'url', 'blurb', 'credit', 'course', 'list', 'reference', 'patAttribution',
    ]);

    const declared = new Set([...PLUMBING.map((p) => p.field), ...BOOKKEEPING, ...STRUCTURAL]);
    const unaccounted = [
      ...new Set(Object.values(sources).flat().flatMap((row) => Object.keys(row))),
    ].filter((field) => !declared.has(field));

    expect(unaccounted).toEqual([]);
  });
});

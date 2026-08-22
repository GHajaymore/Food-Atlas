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

  it("ships no image a browser would refuse to load", () => {
    // Wikidata returns its image property over plain http, so 3,055 photographs were
    // stored as http:// while every other source stored https. It works on the dev
    // server, which is itself http. Served over https -- every real deployment -- a
    // browser blocks an http image as mixed content and renders nothing, so thirty
    // per cent of the atlas would have been blank in production and fine in every
    // check made here.
    const insecure = catalogue.filter((d) => d.photo.startsWith("http://"));
    expect(insecure.map((d) => d.name).slice(0, 5)).toEqual([]);

    // The credit link goes to the same file, and would be flagged the same way.
    expect(catalogue.filter((d) => d.creditHref.startsWith("http://")).length).toBe(0);
  });

  it("tells the reader where a photograph actually came from", () => {
    // Every imported record used to say "Matched by name on Wikimedia Commons — the
    // subject is not confirmed". True of about three thousand photographs, false for
    // the seven thousand attached to the dish’s own Wikidata item or chosen by
    // editors to head its own article. A warning printed on everything stops being
    // read on the records that need it.
    const photographed = catalogue.filter((d) => d.photo);
    const byName = photographed.filter((d) => /matched by name/i.test(d.photoOrigin));
    const chosen = photographed.filter((d) => /own Wikidata entry|own encyclopaedia article|own page/i.test(d.photoOrigin));

    expect(photographed.length).toBeGreaterThan(5000);
    expect(chosen.length).toBeGreaterThan(byName.length);

    // And no *imported* record claims a verified photograph: knowing a picture was
    // attached to the right subject is not knowing it shows the dish as made in the
    // place. The curated records are exempt because somebody actually checked those —
    // "Photographed in Oaxaca, Mexico" is a statement a person stands behind.
    const imported = photographed.filter((d) => d.id >= 1000);
    expect(imported.length).toBeGreaterThan(5000);
    expect(imported.every((d) => d.photoVerified === false)).toBe(true);
  });

  it('accounts for every field the sources carry', () => {
    /**
     * Bookkeeping the passes keep for themselves. Named here rather than guessed,
     * so a new flag has to be classified deliberately: the failure this catches is a
     * script inventing a field that should reach the reader and nobody noticing it
     * does not.
     */
    const BOOKKEEPING = new Set([
      'imageChecked', 'leadImageChecked', 'langsChecked', 'nativeChecked',
      'originChecked', 'wikidataChecked', 'countryChecked', 'urlChecked', 'riskChecked',
      'countryFromTitle', 'countryFromCatalogue', 'placeFromCategory', 'ingredientsLanguage',
      'atRiskStrength', 'notFood', 'infobox',
    ]);

    /**
     * Not bookkeeping any more: these two decide what the reader is told about a
     * photograph.
     *
     * `leadFile` means the picture is the one the article leads with, and
     * `pageImageChecked` means it came off the recipe's own page. Both used to sit in
     * the list above as run-state nobody read, while every photograph in the atlas
     * carried the same "matched by name — the subject is not confirmed" warning,
     * including the seven thousand that were not matched by name at all.
     */
    const PHOTO_PROVENANCE = new Set(['leadFile', 'pageImageChecked']);

    // Fields the build reads for its own reasons rather than showing directly.
    const STRUCTURAL = new Set([
      'id', 'qid', 'name', 'title', 'country', 'countries', 'region', 'continent',
      'url', 'blurb', 'credit', 'course', 'list', 'reference', 'patAttribution',
    ]);

    const declared = new Set([...PLUMBING.map((p) => p.field), ...BOOKKEEPING, ...STRUCTURAL, ...PHOTO_PROVENANCE]);
    const unaccounted = [
      ...new Set(Object.values(sources).flat().flatMap((row) => Object.keys(row))),
    ].filter((field) => !declared.has(field));

    expect(unaccounted).toEqual([]);
  });
});

describe('a recipe says truthfully where it was published', () => {
  const find = (name: string) => catalogue.find((d) => d.name === name);

  it('does not tell a country its own cookbook is foreign to it', () => {
    // The copy was written when the only cookbook was English. Reading five more
    // made it false: the Italian Cookbook's amatriciana told the reader it was
    // 'written for a general audience rather than recorded in Italy', when it was
    // written in Italian, in Italy, by Italians.
    const amatriciana = find('Amatriciana');
    expect(amatriciana?.loc.country).toBe('Italy');
    expect(amatriciana?.blurb).toMatch(/written in Italian in the cookbook of Italy/);
    expect(amatriciana?.blurb).not.toMatch(/rather than recorded in/);
  });

  it('still says so when the cookbook is not the dish s own', () => {
    // A Swiss dish in the French cookbook is exactly the case the original copy
    // was written for, and it has to keep it.
    const foreign = catalogue.find(
      (d) => d.sourceLanguage === 'fr' && d.steps.length > 0 && d.loc.country !== 'France',
    );
    expect(foreign?.blurb).toMatch(/for a general audience rather than recorded in/);
  });

  it('classifies both as Modern Adaptation with no score', () => {
    // Where it was published changes the sentence, never the standing: a published
    // recipe is still not one household's tradition.
    for (const d of catalogue.filter((x) => x.sourceLanguage && x.sourceLanguage !== 'en' && x.steps.length)) {
      expect({ name: d.name, level: d.badgeLevel, score: d.score }).toEqual({
        name: d.name,
        level: 'adaptation',
        score: null,
      });
    }
  });
});

describe('a record never contradicts what it is showing', () => {
  it('does not say nothing documents a dish it is describing', () => {
    // Anguilla del Trasimeno carries 899 characters of the Italian register's own
    // production method and told the reader "Only the name and the place are
    // recorded. Nothing documents how this is made" — directly above the method.
    const contradicting = catalogue.filter(
      (d) => d.prepSummary.trim() && /Nothing documents how this is made/.test(d.disclaimer),
    );
    expect(contradicting.map((d) => d.name)).toEqual([]);
  });

  it('never tells a reader a preparation is recorded when none is', () => {
    /*
     * The inverse of the case above, and the reason the fix had to be narrow.
     *
     * Loosening the 'nothing is documented' branch could easily have made every
     * record claim an account. What matters is not which sentence is used but that
     * no record without a preparation says one exists — the atlas's own measure of
     * itself is the share that has one.
     */
    const claiming = catalogue.filter(
      (d) =>
        !d.prepSummary.trim() &&
        !d.steps.length &&
        /A published account describes how this is made|the method is recorded/i.test(d.disclaimer),
    );
    expect(claiming.map((d) => d.name)).toEqual([]);
  });

  it('never claims an equipment list it does not have', () => {
    for (const d of catalogue) {
      if (/equipment it is made with/.test(d.disclaimer)) expect(d.equipment.length).toBeGreaterThan(0);
    }
  });
});

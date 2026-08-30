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

import { hasMethod } from '../src/domain/method';
import { sizedPhoto } from '../src/domain/commons';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildCatalogue } from '../src/data/build';
import { EN } from '../src/i18n/copy';
import { copyFor, joinOr, UI_LOCALES } from '../src/i18n';
import { cardPlace, isWithin, notAPlaceBelow } from '../src/domain/place';
import { alsoRecordedIn } from '../src/domain/related';
import { CARD_WIDTH, SHELL, type Size } from '../src/theme/layout';
import { PAGE_PADDING } from '../src/theme/tokens';
import { HEADLINE_TYPE } from '../src/components/Mission';
import { continentOf, knownCountry } from '../src/domain/continents';
import { canonicalCountry } from '../src/domain/countryNames';
import type { Confirmation } from '../src/domain/confirmations';
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
  gi: read('gi'),
};

const { catalogue, stats: catalogueStats } = buildCatalogue(
  sources.catalogue,
  sources.cuisines,
  sources.cookbook,
  sources.unesco,
  sources.gi,
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
  /*
   * `stepCount`, not `steps`.
   *
   * The step text is held back from the shipped payload, so no row in `public/data` carries
   * `steps` any more — and the guard above ("a field nothing has written yet cannot be
   * plumbed wrongly") would then skip this case entirely and pass while asserting nothing.
   * The count is what ships, so the count is what this traces.
   */
  { field: 'stepCount', shows: 'an ordered method', reaches: (d) => hasMethod(d) },
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
    field: 'heritage',
    shows: 'the protected designation, credited to the register that holds it',
    reaches: (d) => d.sources.some((s) => s.title.startsWith('EU register of geographical indications')),
  },
  {
    field: 'designation',
    shows: 'a record for a protected name the atlas did not already hold',
    reaches: (d) => d.sources.some((s) => /eAmbrosia/.test(s.publisher)),
  },
  {
    field: 'province',
    shows: 'a breadcrumb that goes below the region',
    reaches: (d) => d.breadcrumb.length >= 3,
  },
  {
    field: 'city',
    shows: 'the town a record names, in its own step of the breadcrumb',
    reaches: (d) => Boolean(d.loc.city),
  },
  {
    field: 'origin',
    shows: 'where the dish is from, when that is not where it is filed',
    reaches: (d) => Boolean(d.origin),
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

  it("ships no name with a bracket left open", () => {
    // Seven Italian register labels are malformed at Wikidata itself -- a bulk import
    // appended " PAT" and lost the closing bracket -- so stripping the suffix left
    // "Coppa (viterbese" on the card.
    const unbalanced = catalogue.filter((d) => {
      const opens = (d.name.match(/[(]/g) ?? []).length;
      const closes = (d.name.match(/[)]/g) ?? []).length;
      return opens !== closes;
    });
    expect(unbalanced.map((d) => d.name).slice(0, 5)).toEqual([]);
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
      // The GI register's own columns. `designation` is the one the reader meets and
      // is asserted above; these are the apparatus around it — the licence credit, the
      // file reference, the class, the date, and the register's other lawful spellings
      // of the same protected name.
      'giReference', 'giAttribution', 'attribution', 'designationCode', 'category',
      'registered', 'alsoKnownAs',
      // The gazetteer's credit. CC BY 4.0 is the licence, so this travels with any
      // record whose place it confirmed.
      'placeConfirmed',
      // How long a cookbook method is, written by compact-data.mjs because the step text
      // itself is held back from the first payload. Read through methodLength(), never
      // shown. See domain/method.ts.
      'stepCount',
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
      // The count, not the array: cookbook step text is fetched after first paint, so in
      // a test with no network the words are absent and the length is still right.
      (d) => d.sourceLanguage === 'fr' && hasMethod(d) && d.loc.country !== 'France',
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

describe('what the reader is shown, as text', () => {
  /**
   * Every string on a record that ends up in front of somebody, paired with the field
   * name so a failure says where to look. Deliberately not the URLs: an `&amp;` inside
   * a query string is part of the address, and "fixing" it would break the link.
   */
  const readable = (d: (typeof catalogue)[number]): [string, string][] => [
    ['name', d.name],
    ['blurb', d.blurb ?? ''],
    ['prepSummary', d.prepSummary],
    ...d.ingredients.map((v, i): [string, string] => [`ingredients[${i}]`, v]),
    ...d.steps.map((v, i): [string, string] => [`steps[${i}]`, v]),
    ...d.equipment.map((v, i): [string, string] => [`equipment[${i}]`, v]),
    ['credit', d.credit],
    ['photoOrigin', d.photoOrigin],
  ];

  it('never prints an HTML entity where a character belongs', () => {
    /*
     * `&frac12;` and `&deg;` reached 320 ingredient and method lines, which is the
     * worst field for it: the entity *is* the quantity. A cook read "&frac34; pounds
     * of apples" and "180&deg;C".
     *
     * The pattern deliberately matches the shape of an entity rather than a list of
     * them, so an entity nobody has seen yet fails here rather than shipping.
     */
    const ENTITY = /&(#\d+|#x[0-9a-f]+|[a-z][a-z0-9]{1,9});/i;

    const found = catalogue.flatMap((d) =>
      readable(d)
        .filter(([, value]) => ENTITY.test(value))
        .map(([field, value]) => `${d.name} · ${field}: ${value.slice(0, 70)}`),
    );

    expect(found).toEqual([]);
  });

  it('never shows a bullet with nothing beside it', () => {
    const blank = catalogue.flatMap((d) =>
      [...d.ingredients, ...d.steps, ...d.equipment].some((line) => !line.trim()) ? [d.name] : [],
    );
    expect(blank).toEqual([]);
  });
});

describe('a confirmation reaches the record', () => {
  const person = (name: string, local: boolean): Confirmation => ({
    name,
    connection: 'Cooks it at home',
    said: 'This is how we make it.',
    local,
    at: '2026-08-22',
  });

  /** A documented record that has not been confirmed by anybody. */
  const subject = catalogue.find(
    (d) => d.badgeLevel === 'variation' && d.ingredients.length >= 3 && d.id < 100_000,
  )!;

  const rebuilt = (people: ReturnType<typeof person>[]) =>
    buildCatalogue(sources.catalogue, sources.cuisines, sources.cookbook, sources.unesco, sources.gi, {
      [String(subject.id)]: { people },
    }).catalogue.find((d) => d.id === subject.id)!;

  it('raises the score it is scored on', () => {
    const after = rebuilt([
      { ...person('A', false), verified: true },
      { ...person('B', false), verified: true },
      { ...person('C', true), verified: true },
    ]);
    expect(after.score!).toBeGreaterThan(subject.score ?? 0);
  });

  it('does NOT raise the score when nobody was signed in', () => {
    /*
     * The whole point of `verified`. Without an account behind it a confirmation is a
     * signed cookie away from being three of them, and a badge earned by opening three
     * private windows is worse than no badge. These are still recorded and still shown —
     * see the test below — they simply do not move the number.
     */
    const after = rebuilt([person('A', false), person('B', false), person('C', true)]);
    expect(after.score).toBe(subject.score);
  });

  it('is shown on the record, not only counted into it', () => {
    /*
     * The reason `Dish.confirmations` is a list. "3 confirmations" is a number a
     * reader has to trust; what somebody said and their connection to the place is
     * evidence a reader can weigh — and a fraud they can see.
     */
    const after = rebuilt([person('Priya', true)]);
    expect(after.confirmations?.map((c) => c.name)).toEqual(['Priya']);
    expect(after.confirmations?.[0].said).toBe('This is how we make it.');
  });

  it('leaves every other record alone', () => {
    const after = buildCatalogue(
      sources.catalogue, sources.cuisines, sources.cookbook, sources.unesco, sources.gi,
      { [String(subject.id)]: { people: [person('A', true)] } },
    ).catalogue;
    const changed = after.filter((d) => d.confirmations?.length && d.id !== subject.id);
    expect(changed.map((d) => d.name)).toEqual([]);
  });

  it('builds an atlas with no confirmations at all, which is today', () => {
    // The state every record is in until the endpoint exists. It must be ordinary.
    expect(catalogue.every((d) => !d.confirmations?.length)).toBe(true);
  });
});

/*
 * A breadcrumb has to be geography.
 *
 * The cuisine source records the branch of Wikipedia's category tree it walked in
 * `region`, and most of the time that is a place — Kerala, Sichuan, Java. Sometimes it
 * is a kind of food, and those printed as "Japan › Wagashi" and, once breadcrumbs became
 * links, offered "everything from Wagashi".
 *
 * Both directions are asserted because the rule that removes them keys off "this string
 * also names a dish", and naming a dish after its place is the normal case in food. The
 * kept cases below are the two that caught the first version of the rule out.
 */
describe('a region is a place, not a branch of a category tree', () => {
  const regionsIn = (name: RegExp) =>
    catalogue.filter((d) => name.test(d.loc.region)).map((d) => d.name);

  it('does not file a dish under a kind of food', () => {
    for (const category of [/^Wagashi$/, /^Sushi$/, /^Tteok$/, /^Ramen$/, /^Dim sum$/, /^Baklava$/]) {
      expect(regionsIn(category)).toEqual([]);
    }
  });

  it('keeps a real place that a dish happens to be named after', () => {
    // Pithiviers is a French town and a pastry; Phú Quốc is a Vietnamese island and a
    // fish sauce. A rule that only asked "is this also a dish name" deleted both.
    expect(catalogue.some((d) => d.loc.region === 'Pithiviers')).toBe(true);
    expect(catalogue.some((d) => d.loc.region === 'Phú Quốc')).toBe(true);
  });

  /*
   * A floor, not a snapshot.
   *
   * This asserted `total === 17_778` and broke the moment a railway service and three
   * fish were removed from the atlas for unrelated and correct reasons. An exact count is
   * a photograph of one afternoon: it fails on every legitimate data change and says
   * nothing about the fault it was written for, which was a repair silently deleting
   * records. A floor catches that — losing a thousand records trips it — without
   * objecting to somebody removing four things that were never food.
   *
   * The country count stays exact, because that one IS an invariant: no repair to how a
   * region is read should ever remove a country from the atlas.
   *
   * 157 became 156 when the origin pass was extended to the Wikidata import. One country
   * left the atlas: **Belize**, whose only record was `chimole`, which moved to Mexico
   * because that is the origin its own article states. Six other values also emptied —
   * Goryeo, the Korean Empire, the Holy Roman Empire, the Kingdom of France, the
   * Sultanate of Maguindanao and the Confederate States of Lanao — and none of those
   * changes this figure, because `isCountry` already excludes historical states.
   *
   * 156 became 161 when Wikidata origins were read across both sources. This time the
   * atlas *gained* five:
   * the pass corrected 75 records whose own article never supported the country they were
   * filed under, and several countries got their first record — Djibouti, Botswana,
   * Burkina Faso and the Seychelles among them. Hong Kong took sixteen records off China
   * and Azerbaijan eight. Some of the 75 moved *between* countries that both already had
   * records, which is why 75 corrections are worth four countries and not seventy-five.
   * Nothing left the atlas.
   *
   * Deliberately still an exact number. It has now failed twice and been read twice,
   * which is the whole point of it: a published coverage figure moved and somebody had to
   * look at why and decide. A floor here would have let the atlas quietly stop covering a
   * country — and would have said nothing when it started covering six.
   */
  it('loses no country, and no large number of records, to the repair', () => {
    expect(catalogueStats.total).toBeGreaterThan(17_000);
    expect(catalogueStats.countries).toBe(161);
  });
});

/**
 * English typed into a screen that already had the sentence translated.
 *
 * `LeadDish` rendered the literal text "photo via" while `copy.photoVia` existed and was
 * used correctly two screens away, so the hero card on the front page was English in all
 * twelve languages. The pantry search had a whole paragraph the same way — and the figure
 * inside it was guessed: it claimed about half the atlas lists no ingredients, where the
 * counted share is 59%.
 *
 * Nothing catches this by construction. `keyof Copy` is a string, so a screen that simply
 * never looks a key up compiles and passes every other test; the only symptom is a reader
 * in another language meeting a sentence of English.
 *
 * So this looks the other way round: for every English value in the catalogue, does that
 * exact text appear in a screen or a component? If it does, either the screen should be
 * reading the key or the key is dead.
 *
 * Deliberately not applied to `src/domain` and `src/data`. Those hold English canonical
 * values on purpose — a dimension is stored as "Traditional technique" and translated at
 * render by `scoreDimensionLabel` — and asserting against them would be asserting the
 * design is wrong.
 */
describe('no screen types out English the catalogue already holds', () => {
  /* Each entry carries the path to read and the name to report, so nothing has to
     un-mangle a Windows separator back into a repo-relative path afterwards. */
  const uiFiles = (() => {
    const out: { path: string; name: string }[] = [];
    const walk = (dir: string, prefix: string) => {
      for (const entry of readdirSync(dir)) {
        const p = join(dir, entry);
        const name = `${prefix}/${entry}`;
        if (statSync(p).isDirectory()) walk(p, name);
        else if (entry.endsWith('.tsx')) out.push({ path: p, name });
      }
    };
    walk(resolve(__dirname, '../app'), 'app');
    walk(resolve(__dirname, '../src/components'), 'src/components');
    return out;
  })();

  /*
   * The admin console's "Source checks" block is English on purpose and is the one
   * exception. It is one person's maintenance screen, it is reached from nowhere in the
   * public navigation, and translating it into twelve languages would be work for an
   * audience of one. Named here rather than left to look like an oversight — if it ever
   * becomes a screen more than one person opens, this entry is the reminder.
   */
  const ALLOWED = new Set(['app/admin.tsx']);

  /*
   * Single words match prose by coincidence — "Stew" appears in any number of sentences —
   * so a value has to be at least two words and six characters to be checked.
   *
   * Six, not twelve. Twelve was the first guess and it let the original defect straight
   * through: "photo via" is nine characters, so the guard written for that bug did not
   * catch that bug. Measured at every floor from six to twelve; six adds exactly two more
   * hits across the whole UI and both are in the allow-listed console, so the strictest
   * useful floor is free.
   */
  const worthChecking = Object.entries(EN).filter(
    ([, v]) => typeof v === 'string' && v.length >= 6 && v.trim().split(/\s+/).length >= 2 && !/[{}]/.test(v),
  ) as [string, string][];

  it('has values long enough to be worth checking', () => {
    expect(worthChecking.length).toBeGreaterThan(100);
  });

  /*
   * The other half of the same question, and the half that was missing.
   *
   * The test below catches a screen typing out a string the catalogue already holds. It
   * cannot see prose that was never extracted at all — and that is what the audit found:
   * eight blocks of English rendering to every reader in every language, including the
   * lead-in above the preparation, the open-disagreement note, and the whole empty state
   * on search. None of them were in `EN`, so none of them were checkable.
   *
   * This reads JSX text nodes — what sits between a `>` and a `<` with no braces in it.
   * Deliberately narrow: it will not see text in attributes or template literals. A
   * narrow test that runs is worth more than a complete one that needs a parser.
   */
  it('finds no screen with English prose that was never extracted', () => {
    const found: string[] = [];

    for (const { path, name } of uiFiles) {
      if (ALLOWED.has(name)) continue;
      let inComment = false;

      readFileSync(path, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          const trimmed = line.trim();
          /* JSX comments open with `{/*`, which is why an earlier version of this scan
             reported every design note in the file as untranslated prose. */
          if (trimmed.startsWith('/*') || trimmed.startsWith('{/*')) inComment = true;
          const wasComment = inComment;
          if (trimmed.includes('*/')) inComment = false;
          if (wasComment || trimmed.startsWith('*') || trimmed.startsWith('//')) return;

          for (const match of line.matchAll(/>([^<>{}]+)</g)) {
            const text = match[1].trim();
            /*
             * `>...<` also spans a TypeScript generic and a comparison: `Record<string,
             * X>`, `ReturnType<...>`, `a.at < b.at`. Those are code, and the tell is that
             * prose does not carry brackets, operators or property access.
             */
            if (/[(){}[\]|&;=]/.test(text) || /\w\.\w/.test(text)) continue;
            const words = text.split(/\s+/).filter((w) => /[A-Za-z]/.test(w));
            if (text.length >= 12 && words.length >= 3 && /[a-z]{3}/.test(text)) {
              found.push(`${name}:${i + 1}  ${text.slice(0, 70)}`);
            }
          }
        });
    }

    expect(found).toEqual([]);
  });

  it('finds no screen rendering a copy value as a literal', () => {
    const found: string[] = [];
    for (const { path, name } of uiFiles) {
      if (ALLOWED.has(name)) continue;
      // A doc comment quoting the copy it documents is not a defect.
      const code = readFileSync(path, 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
      for (const [key, value] of worthChecking) {
        if (code.includes(value)) found.push(`${name} types out copy.${key}: "${value}"`);
      }
    }
    expect(found).toEqual([]);
  });
});

/**
 * The pantry note reports a counted figure, in the reader's own language.
 *
 * It used to say "about half the atlas has no ingredients listed", in English, inside a
 * screen every other line of which was translated. The number was not measured — counted,
 * it is 10,426 of 17,748 — and on a screen whose entire purpose is to explain how little
 * has been recorded, a guessed figure is the one thing it cannot afford. It also moves:
 * every enrichment pass changes it, so any number typed into a sentence goes stale.
 *
 * Both halves are asserted here: the share comes from the catalogue, and the sentence
 * that carries it exists in every language with both placeholders intact.
 */
describe('the pantry note counts rather than estimates', () => {
  const share = Math.round(((catalogueStats.total - catalogueStats.withIngredients) / catalogueStats.total) * 100);

  it('counts records that list an ingredient', () => {
    expect(catalogueStats.withIngredients).toBe(catalogue.filter((d) => (d.ingredients?.length ?? 0) > 0).length);
    expect(catalogueStats.withIngredients).toBeGreaterThan(0);
    expect(catalogueStats.withIngredients).toBeLessThan(catalogueStats.total);
  });

  /* Deliberately a wide band rather than 59. The point is that the sentence reports a
     counted figure, not that the figure holds still — an enrichment pass is supposed to
     move it, and a test pinned to today's value would fail on a successful pass. */
  it('reports a real share, not the "about half" it used to claim', () => {
    expect(share).toBeGreaterThan(50);
    expect(share).toBeLessThan(100);
  });

  it('carries the sentence, with both placeholders, in every language', () => {
    const missing: string[] = [];
    for (const locale of UI_LOCALES) {
      const value = copyFor(locale).pantryNothingUses;
      if (!value) missing.push(`${locale}: absent`);
      else {
        for (const token of ['{list}', '{p}']) {
          if (value.split(token).length - 1 !== 1) missing.push(`${locale}: ${token}`);
        }
        // The figure must arrive through the placeholder, never be baked into a sentence.
        if (/\d/.test(value.replace('{p}', ''))) missing.push(`${locale}: has a typed number`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('joins the reader list with their own conjunction, not "or"', () => {
    expect(joinOr(copyFor('en'), ['rice'])).toBe('rice');
    expect(joinOr(copyFor('en'), ['rice', 'yam'])).toBe('rice or yam');
    expect(joinOr(copyFor('en'), ['rice', 'yam', 'okra'])).toBe('rice, yam or okra');
    expect(joinOr(copyFor('fr'), ['riz', 'igname'])).toBe('riz ou igname');
    expect(joinOr(copyFor('de'), ['Reis', 'Yams'])).toBe('Reis oder Yams');
    expect(joinOr(copyFor('en'), [])).toBe('');
  });
});

/**
 * A card never names a place that contradicts the record it sits on.
 *
 * Ajay sent a screenshot of a rail headed "From United States" whose cards read England,
 * China, Korea and "Japanese cakes". Two faults arrive in the same line of text: a
 * breadcrumb step that is not a place at all, and one that names a different country —
 * true for a contested record, and still the atlas contradicting itself in two lines.
 */
describe('a card names a place that agrees with its record', () => {
  const tail = (d: Dish) => (d.breadcrumb.length ? d.breadcrumb[d.breadcrumb.length - 1] : '');

  /*
   * Deliberately not "never prints another country". Hong Kong under China and England
   * under the United Kingdom are each a country name sitting under a different country
   * name, and each is correct — the first version of this rule stripped both, along with
   * Hawaii, throwing away 43 records' worth of real geography to catch 7 contradictions.
   * The thing worth catching is a place on another continent.
   */
  it('never prints a country on another continent from the record', () => {
    const wrong = catalogue
      .map((d) => ({ name: d.name, country: d.loc.country, shown: cardPlace(d.breadcrumb, d.loc.country) }))
      .filter((r) => {
        if (r.shown === r.country) return false;
        if (isWithin(r.shown, r.country)) return false;
        const named = knownCountry(canonicalCountry(r.shown)) || knownCountry(r.shown);
        if (!named || named === r.country) return false;
        const here = continentOf(r.country);
        const there = continentOf(named);
        if (here === 'Elsewhere' || there === 'Elsewhere') return false;
        return here !== there;
      });
    expect(wrong.slice(0, 5)).toEqual([]);
  });

  it('keeps a territory that really is inside its country', () => {
    const allKept = (place: string, country: string) =>
      catalogue
        .filter((d) => d.breadcrumb[d.breadcrumb.length - 1] === place && d.loc.country === country)
        .every((d) => cardPlace(d.breadcrumb, d.loc.country) === place);
    expect(allKept('Hong Kong', 'China')).toBe(true);
    expect(allKept('England', 'United Kingdom')).toBe(true);
    expect(allKept('Hawaii', 'United States')).toBe(true);
  });

  it('never prints a step the build would refuse to store as a place', () => {
    const wrong = catalogue
      .map((d) => ({ name: d.name, shown: cardPlace(d.breadcrumb, d.loc.country), country: d.loc.country }))
      .filter((r) => r.shown !== r.country && notAPlaceBelow(r.shown, r.country));
    expect(wrong.slice(0, 5)).toEqual([]);
  });

  it('keeps the specific place where it is a real one', () => {
    /* The point of the breadcrumb tail: a card should say New Orleans, not United States.
       Guarding against a fix that simply prints the country for everything. */
    const specific = catalogue.filter((d) => {
      const t = tail(d);
      return t && t !== d.loc.country && cardPlace(d.breadcrumb, d.loc.country) === t;
    });
    expect(specific.length).toBeGreaterThan(1000);
  });

  /*
   * One name, one country, one record.
   *
   * docs/queue.md records the general same-name problem and the rule that was tried and
   * abandoned for it: two records sharing a name where one region names the other country.
   * That rule caught 14 of 163 groups and got several backwards, because geography cannot
   * separate a duplicate from a shared claim. Kabsa under India and Yemen may be a real
   * contested origin and the app models it properly.
   *
   * This is the subset with no second reading. Hakarl was held twice under Iceland — once
   * curated with five method steps and a score of 90, once imported with neither — and no
   * contested-origin story explains that. 148 groups, 152 extra records, all gone.
   *
   * Asserted rather than assumed, because the build is where it is fixed and a later
   * source added to the concat list would reintroduce it silently.
   */
  it('holds no dish twice under the same country', () => {
    const groups = new Map<string, Dish[]>();
    for (const dish of catalogue) {
      const k = `${dish.name.trim().toLowerCase()}::${dish.loc.country}`;
      groups.set(k, [...(groups.get(k) ?? []), dish]);
    }
    const twinned = [...groups.entries()].filter(([, held]) => held.length > 1);
    expect(twinned.map(([k, held]) => `${k} ×${held.length}`)).toEqual([]);
  });

  it('falls back to the country for a record whose origin is contested', () => {
    /*
     * Tofu is the case that has to keep working: filed under the United States, claiming
     * nine countries including China, so its region says China and its card must not.
     *
     * "Chicken à la King" was here too and has been removed on purpose. Its country was
     * United States with region England, and the misfiling repair moved it to the United
     * Kingdom — so its card now reads "England", which is correct, sub-national and the
     * whole reason the breadcrumb exists. It stopped being a fallback case because the
     * data underneath it got fixed, not because the rule changed.
     */
    /*
     * By country, not by name. The atlas still holds two tofu records — one Chinese, one
     * American — which is the unresolved duplicate problem recorded in docs/queue.md, and
     * a plain `find` returns whichever the build happens to order first. This test wants
     * the American one specifically, and said so only after picking up the other by
     * accident.
     */
    /*
     * Tofu was this case and is not any more, for the same reason Chicken a la King
     * stopped being one: the data underneath it got fixed. It was filed under the United
     * States, which nothing supported; Wikidata's country of origin says China, and the
     * origin pass moved it. Both tofu records now sit under China and neither can
     * demonstrate a fallback.
     *
     * So the rule is checked against its own shape rather than against one record's
     * misfiling, over every record that has it.
     *
     * The first attempt asserted this for *any* breadcrumb ending in a different country
     * and failed on Kaymak — filed under India, region Armenia, card reading "Armenia".
     * That is the code being right and the test being wrong: `cardPlace` suppresses a
     * tail only when it names a country on a **different continent**. India and Armenia
     * are both in Asia, so Armenia reads as a plausible place within the record and is
     * shown; the United States and China are not, so China was a contradiction and was
     * suppressed. Narrowed to the rule the function actually implements.
     */
    const chorba = catalogue.find((d) => d.name === 'Chorba' && d.loc.country === 'India');
    expect(chorba?.breadcrumb).toEqual(['India', 'Algeria']);
    expect(chorba && cardPlace(chorba.breadcrumb, chorba.loc.country)).toBe('India');

    /* And the case is not a lone survivor: thirty records currently have a tail
       suppressed this way. A floor rather than an exact count, because unlike the
       coverage figure this number is not published to anybody — it only needs to stay
       non-empty so the assertion above keeps testing something real. */
    const suppressed = catalogue.filter((d) => {
      const tail = d.breadcrumb[d.breadcrumb.length - 1];
      return d.breadcrumb.length > 1 && tail !== d.loc.country && cardPlace(d.breadcrumb, d.loc.country) === d.loc.country;
    });
    expect(suppressed.length).toBeGreaterThan(10);
  });
});

/**
 * The atlas says out loud when it holds the same dish twice.
 *
 * 122 names sit under more than one country. The first reading was "duplicates to merge",
 * and measuring killed it: only six of the 122 share a photograph or a source with their
 * twin, and the rest are pakora under India and Pakistan, pholourie under India and
 * Guyana — diaspora and neighbours, a dish two food cultures genuinely make. Merging would
 * have deleted a cuisine's claim to its own food.
 *
 * So nothing is merged. What is fixed is that each record used to assert one country in
 * the largest text on the page while the atlas held another answer elsewhere.
 */
describe('a second record under another country is surfaced, not merged', () => {
  it('finds the twin from either side', () => {
    const pairs = catalogue.filter((d) => alsoRecordedIn(d, catalogue).length > 0);
    expect(pairs.length).toBeGreaterThan(100);

    /* Symmetric: if A points at B's country, B points back at A's. */
    for (const dish of pairs.slice(0, 40)) {
      for (const other of alsoRecordedIn(dish, catalogue)) {
        expect(alsoRecordedIn(other, catalogue).map((d) => d.loc.country)).toContain(dish.loc.country);
      }
    }
  });

  it('never points a record at its own country, or at itself', () => {
    for (const dish of catalogue.slice(0, 3000)) {
      for (const other of alsoRecordedIn(dish, catalogue)) {
        expect(other.id).not.toBe(dish.id);
        expect(other.loc.country).not.toBe(dish.loc.country);
      }
    }
  });

  it('leaves originClaims alone, because that field is sourced and this is not', () => {
    /*
     * The distinction this whole feature turns on: `originClaims` is what a record's own
     * article names, each entry carrying the publication that says so. "We hold a second
     * record" is a fact about this catalogue and no citation at all, so it must never be
     * written into the sourced field.
     */
    const pakora = catalogue.find((d) => d.name === 'Pakora');
    if (pakora && alsoRecordedIn(pakora, catalogue).length) {
      for (const claim of pakora.originClaims ?? []) {
        expect(claim.source?.url).toBeTruthy();
      }
    }
  });
});

/**
 * No sentence mixes two scripts.
 *
 * Written after shipping "culинарные" into the Russian translation — Latin "cul" spliced
 * onto a Cyrillic word. It reads as a typo to anyone who can read Russian and is invisible
 * to anyone who cannot, which is the whole problem with hand-written translations in
 * twelve languages.
 */
describe('a translation is written in one script', () => {
  it('never splices Latin letters into a Cyrillic word, or the reverse', () => {
    const bad: string[] = [];
    for (const locale of UI_LOCALES) {
      for (const [key, value] of Object.entries(copyFor(locale))) {
        if (typeof value !== 'string') continue;
        // Split on whitespace and punctuation, then look at whole words only.
        for (const word of value.split(/[\s.,;:!?()«»"'—–-]+/)) {
          if (!word || word.length < 2) continue;
          const cyrillic = /[\u0400-\u04FF]/.test(word);
          const latin = /[A-Za-z]/.test(word);
          if (cyrillic && latin) bad.push(`${locale}.${key}: "${word}"`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});

/**
 * The loading skeleton draws the page that replaces it.
 *
 * `FeedSkeleton` states the rule in its own header: "every block is the size of the thing
 * that will land in it, so nothing jumps when the data arrives. A skeleton that reflows is
 * worse than no skeleton." It had drifted out of true on three counts — it drew the
 * headline in Inter at 25px where the page sets Fraunces at 29 (44 wide), it left the gap
 * above the rail at a fixed 22.4 after the rails moved to `sectionGap`, and it drew six
 * cards at every width after the desktop rail went to five.
 *
 * The headline and the card width are shared constants now, so those cannot drift again.
 * The row count is computed, and this pins the arithmetic to the widths it was derived
 * from — the point being that changing `CARD_WIDTH` should fail here rather than quietly
 * make the skeleton a row wider than the rail.
 */
describe('the skeleton is the shape of the page', () => {
  /* The same expression FeedSkeleton uses, kept here so a change to one has to face the other. */
  const perRail = (size: Size) =>
    Math.max(3, Math.floor((SHELL[size] - PAGE_PADDING * 2) / (CARD_WIDTH[size] + 10)));

  it('draws as many cards as the rail it stands in for', () => {
    expect(perRail('desktop')).toBe(5);
    expect(perRail('tablet')).toBe(4);
    // A phone rail scrolls, so the third card is meant to be clipped.
    expect(perRail('phone')).toBe(3);
  });

  it('sizes the headline from the same constant the page uses', () => {
    expect(HEADLINE_TYPE.phone.fontSize).toBeGreaterThan(HEADLINE_TYPE.wide.fontSize / 2);
    expect(HEADLINE_TYPE.wide.fontSize).toBeGreaterThan(HEADLINE_TYPE.phone.fontSize);
    // Line height has to leave room for the face, or the bars under-measure the text.
    expect(HEADLINE_TYPE.phone.lineHeight).toBeGreaterThan(HEADLINE_TYPE.phone.fontSize);
    expect(HEADLINE_TYPE.wide.lineHeight).toBeGreaterThan(HEADLINE_TYPE.wide.fontSize);
  });
});

/**
 * A word may be in any script. It may not be in two.
 *
 * Three strings in the published data had a single letter from the wrong alphabet
 * standing in for its lookalike, and all three were invisible on screen:
 *
 *   - "Georgian сheese"  — Cyrillic с (U+0441) doing the work of Latin c
 *   - "dolmadakiа"       — Cyrillic а (U+0430) ending a record's *name*
 *   - "Νευροκοπίοu"      — Latin u (U+0075) ending a Greek PGI name
 *
 * The damage is search. Nobody types a Cyrillic с when they mean cheese, so that
 * record could not be found by the word it is described by; the third is worse in the
 * other direction, because a Greek reader typing Νευροκοπίου correctly finds nothing.
 * A name that cannot be typed is a record that does not exist to whoever is looking
 * for it, and none of this shows in a screenshot.
 *
 * Restricted to Latin against Cyrillic and Greek deliberately. Those three are
 * alphabets that separate their words with spaces, so a token containing two of them
 * is a defect. CJK, kana and Thai do not, so "Thukpa一词在藏语中" is one token by the
 * same measure and is perfectly correct prose — flagging it would be a false alarm
 * built into the suite.
 */
describe('no word is written in two alphabets at once', () => {
  const LATIN = /[A-Za-z]/;
  const CYRILLIC_OR_GREEK = /[\u0370-\u03FF\u0400-\u04FF]/;

  /** Runs of letters, marks and joiners — a word, by any of these three alphabets. */
  const words = (text: string): string[] =>
    text.split(/[^\p{L}\p{M}\u02BC'’-]+/u).filter(Boolean);

  const mixed = (text: string): string[] =>
    words(text).filter((word) => LATIN.test(word) && CYRILLIC_OR_GREEK.test(word));

  /* Every published file, not just the dish catalogue: the Greek one was in `gi.json`,
     which no test had ever read as text. */
  const published = readdirSync(resolve(__dirname, '..', 'public', 'data')).filter((f) =>
    f.endsWith('.json'),
  );

  it.each(published)('%s writes each word in one alphabet', (file) => {
    const parsed = JSON.parse(
      readFileSync(resolve(__dirname, '..', 'public', 'data', file), 'utf8'),
    );

    const offences: string[] = [];
    const walk = (node: unknown, path: string): void => {
      if (typeof node === 'string') {
        for (const word of mixed(node)) offences.push(`${path}: ${word}`);
        return;
      }
      if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${path}[${i}]`));
      if (node && typeof node === 'object') {
        for (const [k, v] of Object.entries(node)) {
          /* A URL is an address, not prose. Percent-encoding and IDN hosts legitimately
             carry characters that would read as mixing here. */
          if (/^(url|href|photo|link)/i.test(k)) continue;
          walk(v, `${path}.${k}`);
        }
      }
    };
    walk(parsed, file);

    expect(offences).toEqual([]);
  });
});

/**
 * A method never says "heated to ." where a temperature belongs.
 *
 * `clean()` deleted every `{{template}}` whole. Most are citations and deserve it, but
 * `{{convert|375|F|C}}` is an oven temperature and `{{lang|it|…}}` is a name, and
 * deleting those left prose that still read as a sentence having lost the thing that
 * mattered:
 *
 *   "Preheat the oven to ."
 *   "heated in copper cauldrons over a wood fire to about ."
 *   "generally known as ."
 *
 * An oven temperature is the one number in a step nobody can infer — a cook can judge
 * "until golden" but not 175°C against 220°C.
 *
 * Checked on the shape of the wound rather than a list of records, because the same
 * stripper feeds every future import. Only the unambiguous shape: a space before a comma
 * or full stop. The collapsed form ("Preheat an oven to.") is what the repair passes look
 * for, but it cannot be an invariant — "used to rub the bread with." is a whole sentence,
 * and a test that called it a defect would be wrong five times in the catalogue alone.
 *
 * Not `; : ! ?` either: French sets a space before those on purpose.
 */
describe('no value was dropped out of a method', () => {
  const WOUND = /\s[,.](?!\.)/;

  const wounds = (file: string): string[] => {
    const parsed = JSON.parse(readFileSync(resolve(__dirname, '..', 'public', 'data', file), 'utf8'));
    const found: string[] = [];
    const walk = (node: unknown, path: string): void => {
      if (typeof node === 'string') {
        const at = node.search(WOUND);
        if (at >= 0) found.push(`${path}: …${node.slice(Math.max(0, at - 40), at + 15)}…`);
        return;
      }
      if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${path}[${i}]`));
      if (node && typeof node === 'object') {
        for (const [k, v] of Object.entries(node)) {
          /* An address is not prose, and a credit line is a citation. */
          if (/^(url|href|photo|link|credit|licence|giAttribution)/i.test(k)) continue;
          walk(v, `${path}.${k}`);
        }
      }
    };
    walk(parsed, file);
    return found;
  };

  it.each(['catalogue.json', 'cuisines.json', 'gi.json', 'unesco.json'])(
    '%s never leaves a space where a value belongs',
    (file) => {
      expect(wounds(file)).toEqual([]);
    },
  );

  /**
   * Nor two spaces where one belongs.
   *
   * Nine records were named "Fave bianche e  cicorie PAT", "Tagliatelle  all'acciaccata
   * PAT" and so on. Invisible on screen, since HTML collapses the run — but a name is
   * typed to be found, and an exact-match search for the name as written misses it. The
   * register ingest's own `tidy` collapses whitespace, so these came in past it, which is
   * the reason to check the published file rather than trust the writer.
   */
  it.each(['catalogue.json', 'cuisines.json', 'gi.json', 'unesco.json', 'cookbook.json'])(
    '%s writes one space between words',
    (file) => {
      const parsed = JSON.parse(readFileSync(resolve(__dirname, '..', 'public', 'data', file), 'utf8'));
      const doubled: string[] = [];
      const walk = (node: unknown, path: string): void => {
        if (typeof node === 'string') {
          if (/\S {2,}\S/.test(node)) doubled.push(`${path}: ${node.slice(0, 60)}`);
          return;
        }
        if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${path}[${i}]`));
        if (node && typeof node === 'object') {
          for (const [k, v] of Object.entries(node)) {
            if (/^(url|href|photo|link|credit|licence|giAttribution)/i.test(k)) continue;
            walk(v, `${path}.${k}`);
          }
        }
      };
      walk(parsed, file);
      expect(doubled).toEqual([]);
    },
  );

  /**
   * Twenty-two left across the cookbook, and none of them ours to mend.
   *
   * The steps alone were 259. The repair pass reads all six wikis now — en, it, fr, de,
   * pt, es, each through its own book's extractor — and mended 211 recipes across them.
   *
   * What remains is of two kinds, and both are the repair working rather than failing:
   *
   *   - Prose damaged on Wikibooks itself, where a re-fetch returns the same hole.
   *   - Ten recipes refused because their re-derived text came back holding raw markup —
   *     a `{{rec|…}}` template, or a stray `|15px` off an image parameter. A recipe with
   *     a gap already recorded is a better artefact than one showing a reader wikitext,
   *     so the whole list is declined rather than the offending line quietly dropped.
   *
   * Ceilings rather than targets, so the numbers can only fall. If a change repairs more,
   * this fails and the ceiling comes down with it — which is the point.
   */
  it.each([
    ['cookbook.json', 5],
    ['cookbook-detail.json', 17],
  ])('%s carries no more than the %i wounds left upstream', (file, ceiling) => {
    expect(wounds(file as string).length).toBeLessThanOrEqual(ceiling as number);
  });
});

/**
 * Every stored photograph still resolves to a real Commons address.
 *
 * The published files hold a file name rather than a URL now — 1.8 MB of repeated prefix
 * that the app rebuilt at render time anyway. The risk that buys is silent: a name the
 * rebuild cannot use produces a broken image on a card, and nothing in the build would
 * say so.
 *
 * So the rule is checked on the published data rather than trusted to the writer: run
 * every photograph through the same `sizedPhoto` the app uses, and require an absolute
 * Commons URL carrying a width out the other end.
 */
describe('every published photograph can be turned back into an address', () => {
  const published = ['catalogue.json', 'cuisines.json', 'cookbook.json'];

  it.each(published)('%s holds names the app can resolve', (file) => {
    const rows = JSON.parse(
      readFileSync(resolve(__dirname, '..', 'public', 'data', file), 'utf8'),
    ) as { photo?: unknown; name?: string; title?: string }[];

    const broken: string[] = [];
    for (const row of rows) {
      if (typeof row.photo !== 'string' || !row.photo) continue;
      const url = sizedPhoto(row.photo, 400);
      /*
       * Either a Commons address it can ask for at a width, or an absolute URL left
       * exactly as it was. Both are usable; anything else is a name that resolves to
       * nothing, which shows up as a broken card and nowhere else.
       */
      const rebuilt =
        url.startsWith('https://commons.wikimedia.org/wiki/Special:FilePath/') && url.endsWith('?width=400');
      const untouched = url === row.photo && url.startsWith('https://');
      if (!rebuilt && !untouched) broken.push(`${row.name ?? row.title ?? '?'}: ${row.photo}`);
    }
    expect(broken.slice(0, 5)).toEqual([]);
  });

  /**
   * A Commons photograph is stored as a name; anything else keeps its address.
   *
   * One record in 10,638 is the reason this is worded that way rather than "no URLs at
   * all": a Wikibooks recipe illustrated with a file uploaded to `it.wikibooks` rather
   * than to Commons. `Special:FilePath` on commons.wikimedia.org would answer 404 for it,
   * so the full URL is the correct thing to keep — and a test demanding otherwise would
   * have pushed the code into breaking a working photograph for the sake of consistency.
   */
  it.each(published)('%s keeps an address only where the file is not on Commons', (file) => {
    const rows = JSON.parse(
      readFileSync(resolve(__dirname, '..', 'public', 'data', file), 'utf8'),
    ) as { photo?: unknown }[];

    const stillUrls = rows
      .map((r) => r.photo)
      .filter((p): p is string => typeof p === 'string' && p.includes('://'));

    /* None of them may be a Commons URL — those are the ones that should have compacted. */
    expect(stillUrls.filter((u) => /\/wikipedia\/commons\//.test(u))).toEqual([]);
  });
});

/**
 * No screen prints English of its own.
 *
 * Ajay's report was "some dishes show some sections in native language while English is
 * selected and vice versa". Most of that was the translation pipeline, and some of it was
 * this: a handful of labels typed straight into JSX, bypassing the copy system entirely.
 *
 * The worst sat on the record screen, immediately beside a translated sibling:
 *
 *     <T>Traditional: </T>            <- English, always
 *     <T>{copy.commonModernSubstitute}</T>   <- "Substitut moderne courant : "
 *
 * A French reader saw one label in their language and the next in English, in the same
 * block, with nothing to explain the difference.
 *
 * `admin.tsx` is exempt and stays exempt: it is one person's console, it is reached by a
 * link only he has, and translating an operations screen into twelve languages is work
 * that serves nobody. That exemption is listed here rather than assumed, so it stays a
 * decision.
 */
describe('every screen takes its words from the catalogue', () => {
  const EXEMPT = new Set(['admin.tsx']);

  /* Text between JSX tags, and strings handed to props that render as text. */
  const BETWEEN = /}?>\s*([A-Z][A-Za-z][^<>{}\n]{3,})\s*</g;
  const PROPS = /\b(label|placeholder|title|accessibilityLabel)=["']([A-Z][^"'\n]{3,})["']/g;

  const screens = (dir: string): string[] => {
    const out: string[] = [];
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) out.push(...screens(path));
      else if (path.endsWith('.tsx')) out.push(path);
    }
    return out;
  };

  const files = [...screens('app'), ...screens(join('src', 'components'))].filter(
    (f) => ![...EXEMPT].some((name) => f.endsWith(name)),
  );

  it.each(files)('%s prints no English of its own', (file) => {
    const source = readFileSync(file, 'utf8');
    const found: string[] = [];

    for (const match of source.matchAll(BETWEEN)) {
      const text = match[1].trim();
      /* A single capital, or a fragment of code the pattern caught by accident. */
      if (/^[A-Z][a-z]?$/.test(text)) continue;
      if (/[?(){}=]|\bPromise\b/.test(text)) continue;
      found.push(text);
    }
    for (const match of source.matchAll(PROPS)) {
      /*
       * A placeholder holding an example — a dish name, a place, a file name — is a
       * proper noun and does not translate. `contribute.tsx` shows "Kaipola" and
       * "Kaipola.jpg", which read the same in every language.
       */
      if (/\.(jpg|png|jpeg)$/.test(match[2]) || !/\s/.test(match[2])) continue;
      if (match[2].includes('›')) continue;
      found.push(`${match[1]}="${match[2]}"`);
    }

    expect(found).toEqual([]);
  });
});

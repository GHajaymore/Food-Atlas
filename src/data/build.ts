/**
 * The catalogue: the curated records plus the imported ones.
 *
 * Two tiers, deliberately kept distinct rather than blended:
 *
 *   - **Curated records** (`seed.ts`) have been through the evidence assessment. They
 *     carry a method, sources, videos, a confidence score, a dietary reading and the
 *     occasions they are eaten at.
 *   - **Imported records** (`catalogue.json`, from `scripts/ingest-wikidata.mjs`) are
 *     `unverified`. They assert that a dish exists and where it is associated with —
 *     nothing more. No score, no method, no dietary classification, no meal occasion.
 *
 * The import is what makes the atlas global; the tiering is what keeps it honest.
 * Coverage and evidence are not the same thing, and an imported record never borrows
 * the standing of a curated one just by sitting next to it.
 *
 * Rebuild the import with:
 *   node scripts/ingest-wikidata.mjs
 *   node scripts/ingest-wikidata.mjs --missing   # top up countries that timed out
 */

import { assess } from '../domain/assess';
import { detectAtRisk } from '../domain/atRisk';
import { continentOf, registerContinents } from '../domain/continents';
import { isFood } from '../domain/isDish';
import { coverageOf } from '../domain/language';
import { placeBelow } from '../domain/place';
import { findViolations } from '../domain/invariants';
import type { Dish } from '../domain/types';
import { dishes as curated } from './seed';

/**
 * The compact shape the importer writes. Everything shared across all imported
 * records is applied here instead of being repeated 7,900 times in the JSON — that
 * difference is several megabytes of app bundle.
 */

const IMPORT_DIET_BASIS =
  'Imported from Wikidata, which does not record the preparation. No dietary classification can be made until ' +
  'the method is documented.';

/**
 * Wikipedia's parenthetical disambiguator, where it names a kind of food.
 *
 * "Momo (food)" and "Kulfi (dessert)" are titles doing Wikipedia's job of separating
 * an article from a film or a place of the same name. The parenthesis belongs to the
 * encyclopaedia's index, not to the dish — nobody calls it "momo food" — so it comes
 * off for the same reason Italy's " PAT" registry tag does.
 *
 * Only this closed list is removed. Plenty of parentheses in these names are the
 * source explaining itself — "Abacha Mmiri (Soaked Cassava Flakes)", "Aadun
 * (Nigerian Corn Flour with Palm Oil)" — and those are a gloss the reader wants,
 * not an index artefact. Stripping every bracket would delete them.
 */
const FOOD_DISAMBIGUATOR =
  /\s*\((food|dish|drink|beverage|soft drink|bread|pastry|dessert|sweet|snack|soup|sauce|cheese|wine|beer|cocktail|confectionery|candy|cake|biscuit|fruit|vegetable|spice|herb|plant|grain|cuisine)\)\s*$/i;

/**
 * The dish's own name, with the source's indexing artefacts taken off.
 *
 * Wikidata labels sometimes carry a register's tag rather than the food's name —
 * Italy's ~4,400 Prodotti Agroalimentari Tradizionali all end in " PAT". That suffix
 * belongs to the registry, not to the dish, and showing it would put a bureaucratic
 * acronym where the tradition's name should be. The Wikidata link on the record still
 * points at the registered entry, so nothing is lost by dropping it from the label.
 */
const cleanName = (name: string): string => name.replace(/\s+PAT$/, '').replace(FOOD_DISAMBIGUATOR, '').trim();

/** The photograph fields an enrichment pass may have written onto a source row. */
interface PhotoRow {
  photo?: string;
  credit?: string;
  licence?: string;
}

interface ImportedRow extends PhotoRow {
  id: number;
  name: string;
  country: string;
  region: string;
  continent: string;
  qid: string;
  blurb: string;
  photo: string;
  /** Present once `scripts/enrich-wikipedia.mjs` has run over the row. */
  evidence?: {
    ingredients: string[];
    heritage: string[];
    hasArticle: boolean;
    extractLength: number;
  };

  /**
   * Written by `scripts/enrich-infobox.mjs --file catalogue`.
   *
   * These 7,870 records were the emptiest part of the atlas — a name, a country and
   * a Q-number — because this pass had no way to find their articles until
   * `resolve-article-urls.mjs` filled in the URL. The fields sit at the top level
   * rather than under `evidence` because they come from the article's infobox and
   * prose, which is a different reading from the Wikidata claims `evidence` holds.
   */
  url?: string;
  infobox?: boolean;
  ingredients?: string[];
  prepSummary?: string;
  course?: string;
  atRiskEvidence?: string;
  originClaims?: string[];
  langs?: string[];
  langNames?: Record<string, string>;
  views?: number;
  notFood?: string;
  /** Set by scripts/ingest-pat-register.mjs when a regional register supplied the account. */
  patRegion?: string;
  patAttribution?: string;
  equipment?: string;
  sourceLanguage?: string;
}

/**
 * Readership as a display string, or empty for "we do not know".
 *
 * `scripts/ingest-pageviews.mjs` writes a number; absent and zero are different
 * states and stay different, because a record nobody looked up is a fact and a
 * record this pass never reached is not.
 */
function viewsLabel(views: number | undefined): string {
  if (typeof views !== 'number') return '';
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M readers`;
  return `${views.toLocaleString()} readers`;
}

/**
 * The photograph fields for an imported record.
 *
 * Every image on an imported record was found by searching Commons for the dish's
 * name, which returns a plausible match and not a confirmed one — a search for
 * Al-Man'ouche returned an Israeli zaatar manakeesh, a related bread from a
 * different place. So `photoVerified` is false without exception here, and
 * `photoOrigin` says how the picture was found rather than implying it was checked.
 *
 * The artist and licence travel with the image because Commons files carry their own
 * terms, several of them CC BY-SA, and attribution is a condition of use rather than
 * a courtesy.
 */
function photoFields(row: PhotoRow) {
  if (!row.photo) {
    return {
      photo: '',
      credit: '',
      creditHref: '',
      photoOrigin: 'No photograph on record',
      photoVerified: false,
    };
  }

  const artist = row.credit?.trim() || 'Wikimedia Commons';
  return {
    photo: row.photo,
    credit: row.licence ? `${artist} · ${row.licence}` : artist,
    creditHref: row.photo,
    photoOrigin: 'Matched by name on Wikimedia Commons — the subject is not confirmed',
    photoVerified: false,
  };
}

/**
 * A region has to be *below* the country to mean anything.
 *
 * Wikidata's administrative-territory statements sometimes point back at the country
 * itself, or at its formal name — so China arrived carrying "People's Republic of
 * China" as a region, which the atlas then presented as geographic depth it does not
 * have. An empty region is the honest answer there.
 */
const cleanRegion = (region: string, country: string): string => placeBelow(region ?? '', country);

function expand(row: ImportedRow): Dish {
  const region = cleanRegion(row.region ?? '', row.country);
  const breadcrumb = [row.country, region].filter(Boolean);
  const name = cleanName(row.name);

  // The infobox pass reads the article itself; `evidence` holds what Wikidata
  // claimed. Either counts, and a record enriched by the newer pass is not made to
  // look unassessed because it arrived by the other route.
  const ingredients = row.ingredients?.length ? row.ingredients : (row.evidence?.ingredients ?? []);
  const prepSummary = row.prepSummary?.trim() ?? '';

  // Classification is earned from the evidence gathered by the enrichment pass, not
  // assumed. Un-enriched rows have no evidence and stay Unverified with no score.
  const assessment = assess({
    hasCountry: !!row.country,
    hasRegion: !!row.region,
    ingredients,
    heritage: row.evidence?.heritage ?? [],
    // Having read the article is itself the evidence that one exists.
    hasArticle: row.evidence?.hasArticle ?? Boolean(row.infobox && row.url),
    extractLength: row.evidence?.extractLength ?? prepSummary.length,
  });

  // Same rule as the cuisine source: a stored finding came from the article's
  // opening and history, which is where decline is actually stated.
  const risk = row.atRiskEvidence
    ? { atRisk: true, evidence: row.atRiskEvidence }
    : detectAtRisk(prepSummary);

  return {
    id: row.id,
    name,
    category: 'Unclassified',
    diet: { group: 'unclassified', kinds: [], contains: [], basis: IMPORT_DIET_BASIS },
    // Not recorded — never "probably dinner".
    meals: { occasions: [], note: '' },
    loc: { country: row.country, region, province: '', city: '', village: '' },
    breadcrumb,

    badgeLevel: assessment.level,
    badgeIcon: assessment.badgeIcon,
    badgeLabel: assessment.badgeLabel,
    badgeLabelFull: assessment.badgeLabelFull,
    // Never set on an import: it certifies that no modern substitution was found,
    // and nothing here has looked at the preparation.
    traditionalBadge: false,
    atRisk: risk.atRisk,
    atRiskEvidence: risk.evidence || undefined,

    blurb:
      row.blurb ||
      `Recorded in the atlas as a dish of ${breadcrumb.join(' › ')}. How it is traditionally prepared has not been documented here yet.`,

    ...photoFields(row),

    score: assessment.score,
    breakdown: assessment.breakdown,
    views: viewsLabel(row.views),

    readableIn: row.langs,
    localNames: row.langNames,

    prepSummary,
    // From Wikidata's "made from material". Traditional ingredients only — there is
    // no substitute list on an import, so nothing can leak between the two.
    ingredients,
    // The register lists the equipment a product is made with, which no other
    // source here does. Kept as one line because that is how it is published.
    equipment: row.equipment ? [row.equipment] : [],
    steps: [],
    adaptation: null,
    popular: null,
    videos: [],

    sources: [
      {
        // The source keeps the registered label, suffix and all — that is what the
        // reader would find at the other end of the link.
        title: row.name,
        publisher: 'Wikidata',
        url: `https://www.wikidata.org/wiki/${row.qid}`,
        note: row.patRegion
          ? 'Imported record. The account below comes from the regional register, not from here.'
          : 'Imported record. Place and name only — no preparation is claimed.',
      },
      // Attribution is a condition of the CC BY licence these registers carry, not a
      // courtesy, so the region is credited on the record itself rather than in a
      // note somewhere about the project.
      ...(row.patRegion
        ? [
            {
              title: `Prodotti Agroalimentari Tradizionali — ${row.patRegion}`,
              publisher: row.patAttribution ?? row.patRegion,
              url: 'https://www.dati.gov.it/',
              note:
                'The official register entry: what the product is, how it is made and kept, and the ' +
                'equipment it is made with. Published as open data by the region.',
            },
          ]
        : []),
    ],
    disclaimer: assessment.disclaimer,
    originClaims: originClaimsFrom(row.originClaims, row.url),
    sourceLanguage: row.sourceLanguage ?? 'en',
  };
}

/**
 * A dish found by walking a cuisine's Wikipedia category tree.
 *
 * These exist because Wikidata's country-of-origin is a poor census of the world's
 * food — it holds 173 Indian dishes to Wikipedia's 1,200. Every one of these has an
 * encyclopaedia article by construction, which is both why it is worth showing and
 * the only evidence it arrives with.
 */
interface CuisineRow extends PhotoRow {
  /** A sentence from the article stating the tradition is in decline. */
  atRiskEvidence?: string;
  /** Countries the article names as origins, where it names more than one. */
  originClaims?: string[];
  /**
   * The language the account on this record was read in.
   *
   * Most were read in English; 2,253 were read in the language of the place the dish
   * comes from, because that is where the better article usually is. The field is not
   * decoration — the translation layer keys off it, and without it Hindi prose would
   * be presented as though it were the English record.
   */
  sourceLanguage?: string;
  ingredientsLanguage?: string;
  /**
   * Why Wikidata says this is not a food — "a person", "a taxon", "a restaurant".
   *
   * Set by `scripts/resolve-wikidata.mjs` from the item's `instance of` statement.
   * It catches what no rule written against a name can: the most-read record in the
   * catalogue was Yao Ming, who reached an atlas of food through a category of
   * Chinese winemakers and whose name looks exactly like a dish.
   */
  notFood?: string;
  /** Twelve-month English Wikipedia readership, once the pageviews pass has run. */
  views?: number;
  /** Other Wikipedia editions this dish has an article in, and its name in each. */
  langs?: string[];
  langNames?: Record<string, string>;
  title: string;
  name: string;
  country: string;
  region: string;
  url: string;
  /** From `{{Infobox food}}`, once the enrichment pass has run. */
  ingredients?: string[];
  /** The culinary tradition it was found under — "Tamil", "Sichuan". */
  cuisine?: string;
  /**
   * The article's own account of how the dish is made, in prose.
   *
   * Deliberately not `steps`. An encyclopaedia paragraph describes how a dish is
   * generally made; presenting it as an ordered method would claim a precision the
   * source does not have, and would let an import read as a documented tradition.
   */
  prepSummary?: string;
}

/** A Wikibooks Cookbook recipe: a real method, and a country from its categories. */
interface CookbookRow extends PhotoRow {
  title: string;
  name: string;
  ingredients: string[];
  steps: string[];
  url: string;
  /** Derived from "Category:Indian recipes" and the like. */
  country?: string;
  /**
   * The cookbook this recipe was written in.
   *
   * The English Cookbook is not the only one: Italian, French, German, Spanish and
   * Portuguese Wikibooks each keep their own, and a Roman recipe written by Italians
   * is a better record than an English account of it. The method is stored in that
   * language, so the app has to say which — otherwise it presents Italian as English
   * and the translation layer never offers to translate it.
   */
  sourceLanguage?: string;
  /** A region the recipe names for itself, where the cookbook records one. */
  region?: string;
}

/** Match key for reconciling the same dish arriving from different sources. */
const key = (name: string, country = '') => `${name.trim().toLowerCase()}|${country.trim().toLowerCase()}`;

/**
 * Build the catalogue from the four raw sources.
 *
 * Everything above this point is a pure helper. Everything below depends on the
 * data, which is why it lives in a function now: the JSON used to be imported at the
 * top of this file, and Metro answers a static import by inlining the file into the
 * bundle. Sixteen thousand records of prose came to 24 MB of JavaScript that a
 * reader had to download and parse before the first screen could paint.
 */
export function buildCatalogue(
  rawImported: unknown[],
  rawCuisines: unknown[],
  rawCookbook: unknown[],
  rawUnesco: unknown[],
): { catalogue: Dish[]; stats: CatalogueStats } {
/**
 * Cookbook recipes carry a method but no place, so they cannot stand as atlas
 * records of their own — a record with no country has nowhere to sit and nothing to
 * be authentic *to*. They are far more useful reconciled onto dishes already in the
 * catalogue, where they supply the preparation those records lack.
 *
 * What they supply is explicitly *the common recipe*, not the local tradition, which
 * is why a record enriched this way is never promoted by it.
 */
const cookbookByName = new Map<string, CookbookRow>(
  (rawCookbook as CookbookRow[]).map((r) => [r.name.trim().toLowerCase(), r]),
);

const importedRows = rawImported as ImportedRow[];

// The atlas cannot group 240 countries from a six-entry literal, so the import
// supplies the continent for every country it covers.
registerContinents(importedRows.map((row) => [row.country, row.continent] as [string, string]));

/**
 * No empty dishes.
 *
 * A record whose only content is a name and a country tells the reader nothing: no
 * description, no ingredients, no documentation, not even a photograph. Listing it
 * pads the count without adding knowledge, and it is what makes the atlas feel
 * hollow. Those rows are held back until the enrichment pass finds something for
 * them — they are not deleted from `catalogue.json`, so a later run brings them in
 * rather than having to re-fetch.
 *
 * A dish is worth showing when it carries at least one of: a real description, its
 * ingredients, a heritage designation, an encyclopaedia article, or a photograph.
 */
const hasSomethingToShow = (row: ImportedRow): boolean =>
  isFood(cleanName(row.name)) &&
  (!!row.blurb?.trim() ||
    !!row.evidence?.ingredients?.length ||
    !!row.evidence?.heritage?.length ||
    !!row.evidence?.hasArticle ||
    !!row.photo);

const imported: Dish[] = importedRows.filter(hasSomethingToShow).map(expand);

/**
 * Cuisine-tree records, added for the countries the structured sources under-serve.
 *
 * Ids start at 100000 so the three sources never collide. Anything already present
 * from Wikidata under the same name and country is skipped rather than duplicated —
 * the same dish arriving twice is a data bug, not two traditions.
 */
const alreadyPresent = new Set([...curated, ...imported].map((d) => key(d.name, d.loc.country)));

const fromCuisines: Dish[] = (rawCuisines as CuisineRow[])
  .filter(
    (row) =>
      row.name &&
      row.country &&
      // Wikidata's own verdict, where it has one. It outranks the name rules
      // because it is a statement about the subject rather than a reading of its
      // title, and it is the only thing that catches a person named like a dish.
      !row.notFood &&
      isFood(cleanName(row.name)) &&
      !alreadyPresent.has(key(row.name, row.country)),
  )
  .map((row, index) => {
    const region = cleanRegion(row.region ?? '', row.country);
    const breadcrumb = [row.country, region].filter(Boolean);

    // Its Wikipedia article is the one piece of evidence it arrives with.
    const ingredients = row.ingredients ?? [];
    const prepSummary = row.prepSummary ?? '';
    /**
     * Decline is stated in an article's opening and its history, not in its recipe.
     *
     * `enrich-infobox.mjs` reads those sections and stores the sentence it found.
     * This used to ignore that and re-derive the finding from `prepSummary`, which
     * is the preparation — the one section that describes how a dish is made rather
     * than whether anyone still makes it. Thirty records carried real evidence of
     * decline while the shelf showed six.
     *
     * The stored finding wins; the local scan remains for records no pass has read.
     */
    const risk = row.atRiskEvidence
      ? { atRisk: true, evidence: row.atRiskEvidence }
      : detectAtRisk(prepSummary);

    const assessment = assess({
      hasCountry: true,
      hasRegion: !!region,
      ingredients,
      heritage: [],
      hasArticle: true,
      // A described preparation is more of the article than a bare stub, and the
      // assessment reads length as a proxy for how much is actually documented.
      extractLength: prepSummary.length,
    });

    return {
      id: 100_000 + index,
      name: cleanName(row.name),
      category: 'Unclassified',
      // Rows ingested before the cuisine label was recorded fall back to the
      // country's own adjective, which is right for the national cuisines and
      // simply absent for the sub-national ones until they are re-walked.
      cuisine: row.cuisine || '',
      diet: {
        group: 'unclassified' as const,
        kinds: [],
        contains: [],
        basis: IMPORT_DIET_BASIS,
      },
      meals: { occasions: [], note: '' },
      loc: { country: row.country, region, province: '', city: '', village: '' },
      breadcrumb,

      badgeLevel: assessment.level,
      badgeIcon: assessment.badgeIcon,
      badgeLabel: assessment.badgeLabel,
      badgeLabelFull: assessment.badgeLabelFull,
      traditionalBadge: false,
      // Read from the article's own words, with the sentence kept as evidence.
      atRisk: risk.atRisk,
      atRiskEvidence: risk.evidence || undefined,

      blurb: prepSummary
        ? prepSummary.slice(0, 220)
        : `Recorded as a dish of ${breadcrumb.join(' › ')}. How it is traditionally prepared has not been documented here yet.`,

      ...photoFields(row),

      score: assessment.score,
      breakdown: assessment.breakdown,
      views: viewsLabel(row.views),

      readableIn: row.langs,
      localNames: row.langNames,

      prepSummary,
      ingredients,
      equipment: [],
      // Never populated from an article. Prose is a description, not a method.
      steps: [],
      adaptation: null,
      popular: null,
      videos: [],

      sources: [
        {
          title: row.name,
          publisher: 'Wikipedia',
          url: row.url,
          note: prepSummary
            ? 'The preparation below is quoted from this article, not from someone cooking it in the place.'
            : 'Found in this cuisine’s category. Place and name only — no preparation is claimed.',
        },
      ],
      disclaimer: assessment.disclaimer,
      // The article this record's account came from, which is often not the English
      // one: a dish is described best in the language of the people who cook it. The
      // reader is told, and the translation layer is given something true to work from.
      originClaims: originClaimsFrom(row.originClaims, row.url),
      sourceLanguage: row.sourceLanguage ?? 'en',
    } satisfies Dish;
  });

/**
 * Cookbook recipes as records in their own right.
 *
 * These carry the thing the atlas most lacked — an actual preparation, with
 * ingredients and ordered steps — and their categories place them in a country. That
 * makes them records rather than a lookup table matched by name, which reached only
 * 330 of 13,000.
 *
 * **They are Modern Adaptations, and that is not a demotion.** A Cookbook page is a
 * general-audience recipe: it documents how a dish is commonly made today, written
 * for someone anywhere, which is precisely the brief's most-published version. It
 * never becomes the authentic record by default. Holding them at `adaptation` is
 * what lets the app show the modern preparation honestly beside the traditional one
 * rather than quietly passing one off as the other — the comparison the app exists
 * to make.
 */
const fromCookbook: Dish[] = (rawCookbook as CookbookRow[])
  // The country must be a real one. Wikibooks files recipes under "Category:Easy
  // recipes" and "Category:Boiled recipes" as readily as "Category:Indian recipes",
  // so a naive read of the category made "Easy" the largest cuisine in the atlas.
  // The continent map is the whitelist: anything it cannot place is not a country.
  .filter(
    (row) =>
      row.country && row.steps?.length && continentOf(row.country) !== 'Elsewhere' && isFood(cleanName(row.name)),
  )
  .map((row, index) => ({
    id: 300_000 + index,
    name: cleanName(row.name),
    category: 'Unclassified',
    cuisine: '',
    diet: {
      group: 'unclassified' as const,
      kinds: [],
      contains: [],
      basis: 'Recorded from a published recipe, which does not state a dietary classification.',
    },
    meals: { occasions: [], note: '' },
    loc: { country: row.country!, region: row.region ?? '', province: '', city: '', village: '' },
    breadcrumb: [row.country!, row.region ?? ''].filter(Boolean),

    badgeLevel: 'adaptation' as const,
    badgeIcon: '🟠',
    badgeLabel: 'Modern Adaptation',
    badgeLabelFull: 'Modern Adaptation',
    traditionalBadge: false,
    atRisk: false,

    blurb: `A published recipe for ${row.name}, written for a general audience rather than recorded in ${row.country}.`,

    ...photoFields(row),

    // Adaptations are not scored: the confidence score measures evidence that a
    // preparation is the traditional one, and this record does not make that claim.
    score: null,
    breakdown: [],
    views: '',

    prepSummary: `Published method, ${row.steps.length} steps.`,
    ingredients: row.ingredients ?? [],
    equipment: [],
    steps: row.steps,
    adaptation: null,
    popular: null,
    videos: [],

    sources: [
      {
        title: row.name,
        publisher: 'Wikibooks Cookbook',
        url: row.url,
        note: 'A community-written recipe. It documents how the dish is commonly made, not how it is made in its own place.',
      },
    ],
    disclaimer:
      'This is a published recipe, not a record of how the dish is prepared where it comes from. It is classified ' +
      'as a Modern Adaptation for that reason, and it carries no authenticity score — nobody from the place has ' +
      'confirmed that this is how they make it.',
    sourceLanguage: row.sourceLanguage ?? 'en',
  }));

/** A UNESCO Intangible Cultural Heritage inscription. */
interface UnescoRow extends PhotoRow {
  reference: string;
  name: string;
  countries: string[];
  country: string;
  list: 'representative' | 'urgent-safeguarding' | 'best-practice';
  url: string;
}

/**
 * UNESCO inscriptions — the only imported records that reach Authentic.
 *
 * Everything else imported arrives Unclassified, and correctly so: nothing in
 * Wikidata or Wikipedia evidences that a preparation is the traditional one. An ICH
 * inscription is different in kind. An intergovernmental body has documented a
 * living tradition, the community that practises it, and its transmission — which
 * is the brief's "credible documentation" and its "recognised traditional
 * preparation associated with a broader region" in one.
 *
 * They are `regional` rather than `local`: an inscription recognises a tradition
 * across a country or several, not the way one village makes it.
 *
 * The Urgent Safeguarding List is a register of traditions assessed as needing
 * urgent safeguarding — a sourced, authoritative statement of decline, and the only
 * at-risk evidence in the catalogue that did not have to be hand-written.
 */
const fromUnesco: Dish[] = (rawUnesco as UnescoRow[]).filter((row) => isFood(cleanName(row.name))).map((row, index) => {
  const urgent = row.list === 'urgent-safeguarding';
  const shared = row.countries.length > 1;

  return {
    id: 500_000 + index,
    name: cleanName(row.name),
    category: 'Unclassified',
    cuisine: '',
    diet: {
      group: 'unclassified' as const,
      kinds: [],
      contains: [],
      basis: 'An inscription documents a practice, not a recipe, so no dietary classification can be made from it.',
    },
    meals: { occasions: [], note: '' },
    loc: { country: row.country, region: '', province: '', city: '', village: '' },
    breadcrumb: [row.country],

    badgeLevel: 'regional' as const,
    badgeIcon: '🟢',
    badgeLabel: 'Authentic — Regional',
    badgeLabelFull: 'Authentic — Regional',
    // Not set: the inscription evidences the tradition, not the absence of modern
    // substitution in any particular preparation of it.
    traditionalBadge: false,
    atRisk: urgent,
    atRiskEvidence: urgent
      ? 'Inscribed on UNESCO’s List of Intangible Cultural Heritage in Need of Urgent Safeguarding.'
      : undefined,

    blurb: shared
      ? `Inscribed by UNESCO as intangible cultural heritage, submitted jointly by ${row.countries.join(', ')}.`
      : `Inscribed by UNESCO as intangible cultural heritage of ${row.country}.`,

    ...photoFields(row),

    /*
     * Scored on what an inscription actually evidences. Geography and cultural
     * documentation are strong; community validation is real but institutional
     * rather than the app's own three confirmations, so it is credited partially.
     * Ingredients and technique stay at zero — an inscription names a practice, it
     * does not write down the method, and inventing one is the thing the brief
     * forbids most plainly.
     */
    score: 62,
    breakdown: [
      ['Geographic connection', 85],
      ['Traditional ingredients', 0],
      ['Traditional technique', 0],
      ['Local source', 80],
      ['Cultural documentation', 95],
      ['Community validation', 70],
    ],
    views: '',

    prepSummary: '',
    ingredients: [],
    equipment: [],
    steps: [],
    adaptation: null,
    popular: null,
    videos: [],

    sources: [
      {
        title: row.name,
        publisher: 'UNESCO Intangible Cultural Heritage',
        url: row.url,
        note: `Inscription ${row.reference}${urgent ? ' — List in Need of Urgent Safeguarding' : ''}.`,
      },
    ],
    disclaimer:
      `UNESCO has inscribed this as intangible cultural heritage${shared ? `, submitted jointly by ${row.countries.join(', ')}` : ''}, ` +
      'which documents the tradition, the community that practises it and how it is passed on. What the inscription ' +
      'does not do is write down the method — so the ingredients and technique checks are still open, and nobody ' +
      'here has recorded how it is actually cooked.',
    sourceLanguage: 'en',
    // Jointly-submitted inscriptions are one tradition claimed by several countries,
    // which is what the origin model exists for rather than a reason to pick one.
    originClaims: shared
      ? row.countries.slice(0, 4).map((place) => ({
          place,
          claim: 'A submitting state on this joint inscription.',
          source: {
            title: row.name,
            publisher: 'UNESCO Intangible Cultural Heritage',
            url: row.url,
            note: `Inscription ${row.reference}.`,
          },
        }))
      : undefined,
  } satisfies Dish;
});

/**
 * Reconcile Cookbook methods onto records that have none.
 *
 * The method arrives as `popular` — the most-published version — rather than as the
 * record's own steps. A community recipe documents how a dish is commonly made, not
 * how it is made where it comes from, and the brief is explicit that the
 * most-published version never becomes the authentic record by default.
 */
function withCookbookMethod(dish: Dish): Dish {
  if (dish.steps.length || dish.popular) return dish;
  const recipe = cookbookByName.get(dish.name.trim().toLowerCase());
  if (!recipe) return dish;

  return {
    ...dish,
    popular: {
      label: 'The commonly published recipe',
      source: 'Wikibooks Cookbook',
      url: recipe.url,
      level: '🟠 Modern Adaptation',
      changed: [
        'Written for a general audience rather than recorded in the place the dish comes from',
        'No source here states who prepared it, or where',
      ],
    },
  };
}

/** Held back for a later enrichment run, not lost. Surfaced in the coverage stats. */
const withheld = importedRows.length - imported.length;

/**
 * Imported records go through the same invariants as curated ones. A malformed row
 * is dropped rather than taking the whole catalogue down — one bad record from an
 * upstream source should not stop the app from opening.
 */
/**
 * A Cookbook recipe that duplicates a dish already in the atlas is folded onto that
 * record as its `popular` version instead of standing alongside it — the same dish
 * appearing twice is a data bug, not a tradition and its adaptation.
 */
const cookbookDuplicates = new Set(
  [...curated, ...imported, ...fromCuisines].map((d) => d.name.trim().toLowerCase()),
);

const validImported = [...imported, ...fromCuisines]
  .map(withCookbookMethod)
  .concat(fromCookbook.filter((d) => !cookbookDuplicates.has(d.name.trim().toLowerCase())))
  // UNESCO records lead the imported tier: they are the only ones carrying evidence
  // strong enough to be classified, so they should be the first thing a reader meets.
  .concat(fromUnesco)
  .filter((dish) => findViolations(dish).length === 0);

  /** Everything the app can show. Curated records first, so they lead every list. */
  const catalogue: Dish[] = [...curated, ...validImported];

  const stats: CatalogueStats = {
  total: catalogue.length,
  curated: curated.length,
  imported: validImported.length,
  /** Rows on disk with nothing to show yet, awaiting enrichment. */
  withheld,
  countries: new Set(catalogue.map((d) => d.loc.country)).size,
};

  return { catalogue, stats };
}

/** The coverage figures the atlas page reports. */
export interface CatalogueStats {
  total: number;
  curated: number;
  imported: number;
  /** Rows on disk with nothing to show yet, awaiting enrichment. */
  withheld: number;
  countries: number;
}

/**
 * A contested origin, as the correction passes record it.
 *
 * `fix-origin-country.mjs` and `resolve-wikidata.mjs` both refuse to pick a winner
 * when a dish's article names several countries of origin — baklava is claimed by
 * Turkey, Greece, Iran and the Levant, and choosing between them would be inventing
 * a finding. They store every claim instead.
 *
 * Those 118 findings were written and never shown. The app has had a display for a
 * contested origin since the first curated record, and the scripts were writing a
 * plain list of country names into a field typed for sourced claims, so the build
 * dropped them silently.
 *
 * The claim text is deliberately thin. A curated origin claim carries an argument
 * and a citation; this carries only what the article stated, and says so, because
 * the alternative is writing an argument nobody made.
 */
function originClaimsFrom(countries: string[] | undefined, articleUrl: string | undefined) {
  if (!countries || countries.length < 2) return undefined;

  return countries.map((place) => ({
    place,
    claim: `Named as a country of origin by this dish's encyclopaedia entry.`,
    source: {
      title: 'Country of origin',
      publisher: 'Wikipedia / Wikidata',
      url: articleUrl ?? '',
      note: 'Recorded as one of several claims. No source here settles which is first.',
    },
  }));
}

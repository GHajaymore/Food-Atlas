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
import { registerContinents } from '../domain/continents';
import { findViolations } from '../domain/invariants';
import type { Dish } from '../domain/types';
import rawImported from './catalogue.json';
import rawCookbook from './cookbook.json';
import rawCuisines from './cuisines.json';
import { dishes as curated } from './seed';

/**
 * The compact shape the importer writes. Everything shared across all imported
 * records is applied here instead of being repeated 7,900 times in the JSON — that
 * difference is several megabytes of app bundle.
 */
interface ImportedRow {
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
}

const IMPORT_DIET_BASIS =
  'Imported from Wikidata, which does not record the preparation. No dietary classification can be made until ' +
  'the method is documented.';

/**
 * Wikidata labels sometimes carry a register's tag rather than the food's name —
 * Italy's ~4,400 Prodotti Agroalimentari Tradizionali all end in " PAT". That suffix
 * belongs to the registry, not to the dish, and showing it would put a bureaucratic
 * acronym where the tradition's name should be. The Wikidata link on the record still
 * points at the registered entry, so nothing is lost by dropping it from the label.
 */
const cleanName = (name: string): string => name.replace(/\s+PAT$/, '').trim();

/**
 * A region has to be *below* the country to mean anything.
 *
 * Wikidata's administrative-territory statements sometimes point back at the country
 * itself, or at its formal name — so China arrived carrying "People's Republic of
 * China" as a region, which the atlas then presented as geographic depth it does not
 * have. An empty region is the honest answer there.
 */
function cleanRegion(region: string, country: string): string {
  const r = region.trim();
  if (!r) return '';

  const normalise = (s: string) =>
    s
      .toLowerCase()
      .replace(/^(the\s+)?(people's\s+)?(republic|kingdom|state|union|federation)\s+of\s+/, '')
      .replace(/[^a-z]/g, '');

  return normalise(r) === normalise(country) ? '' : r;
}

function expand(row: ImportedRow): Dish {
  const region = cleanRegion(row.region ?? '', row.country);
  const breadcrumb = [row.country, region].filter(Boolean);
  const name = cleanName(row.name);

  // Classification is earned from the evidence gathered by the enrichment pass, not
  // assumed. Un-enriched rows have no evidence and stay Unverified with no score.
  const assessment = assess({
    hasCountry: !!row.country,
    hasRegion: !!row.region,
    ingredients: row.evidence?.ingredients ?? [],
    heritage: row.evidence?.heritage ?? [],
    hasArticle: row.evidence?.hasArticle ?? false,
    extractLength: row.evidence?.extractLength ?? 0,
  });

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
    atRisk: false,

    blurb:
      row.blurb ||
      `Recorded in the atlas as a dish of ${breadcrumb.join(' › ')}. How it is traditionally prepared has not been documented here yet.`,

    photo: row.photo,
    credit: row.photo ? 'Wikimedia Commons' : '',
    creditHref: row.photo,
    photoOrigin: 'Shooting location not recorded in the source',
    photoVerified: false,

    score: assessment.score,
    breakdown: assessment.breakdown,
    views: '',

    prepSummary: '',
    // From Wikidata's "made from material". Traditional ingredients only — there is
    // no substitute list on an import, so nothing can leak between the two.
    ingredients: row.evidence?.ingredients ?? [],
    equipment: [],
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
        note: 'Imported record. Place and name only — no preparation is claimed.',
      },
    ],
    disclaimer: assessment.disclaimer,
    sourceLanguage: 'en',
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
interface CuisineRow {
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

/** A Wikibooks Cookbook recipe: no place, but a real method. */
interface CookbookRow {
  title: string;
  name: string;
  ingredients: string[];
  steps: string[];
  url: string;
}

/** Match key for reconciling the same dish arriving from different sources. */
const key = (name: string, country = '') => `${name.trim().toLowerCase()}|${country.trim().toLowerCase()}`;

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
  !!row.blurb?.trim() ||
  !!row.evidence?.ingredients?.length ||
  !!row.evidence?.heritage?.length ||
  !!row.evidence?.hasArticle ||
  !!row.photo;

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
  .filter((row) => row.name && row.country && !alreadyPresent.has(key(row.name, row.country)))
  .map((row, index) => {
    const region = cleanRegion(row.region ?? '', row.country);
    const breadcrumb = [row.country, region].filter(Boolean);

    // Its Wikipedia article is the one piece of evidence it arrives with.
    const ingredients = row.ingredients ?? [];
    const prepSummary = row.prepSummary ?? '';

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
      name: row.name,
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
      atRisk: false,

      blurb: prepSummary
        ? prepSummary.slice(0, 220)
        : `Recorded as a dish of ${breadcrumb.join(' › ')}. How it is traditionally prepared has not been documented here yet.`,

      photo: '',
      credit: '',
      creditHref: '',
      photoOrigin: 'No photograph on record',
      photoVerified: false,

      score: assessment.score,
      breakdown: assessment.breakdown,
      views: '',

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
      sourceLanguage: 'en',
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
const validImported = [...imported, ...fromCuisines]
  .map(withCookbookMethod)
  .filter((dish) => findViolations(dish).length === 0);

/** Everything the app can show. Curated records first, so they lead every list. */
export const catalogue: Dish[] = [...curated, ...validImported];

export const dishById = (id: number | null | undefined): Dish | undefined =>
  catalogue.find((d) => d.id === id);

export const catalogueStats = {
  total: catalogue.length,
  curated: curated.length,
  imported: validImported.length,
  /** Rows on disk with nothing to show yet, awaiting enrichment. */
  withheld,
  countries: new Set(catalogue.map((d) => d.loc.country)).size,
};

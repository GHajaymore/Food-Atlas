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

import { registerContinents } from '../domain/continents';
import { findViolations } from '../domain/invariants';
import type { Dish } from '../domain/types';
import rawImported from './catalogue.json';
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
}

/** Said once, about every imported record. */
const IMPORT_DISCLAIMER =
  'This record has not been through the evidence assessment. It states that the dish exists and where it is ' +
  'associated with — nothing more. Its ingredients, method and authenticity are undocumented here, and it stays ' +
  'Unverified until someone from the place records them.';

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

function expand(row: ImportedRow): Dish {
  const breadcrumb = [row.country, row.region].filter(Boolean);
  const name = cleanName(row.name);

  return {
    id: row.id,
    name,
    category: 'Unclassified',
    diet: { group: 'unclassified', kinds: [], contains: [], basis: IMPORT_DIET_BASIS },
    // Not recorded — never "probably dinner".
    meals: { occasions: [], note: '' },
    loc: { country: row.country, region: row.region, province: '', city: '', village: '' },
    breadcrumb,

    badgeLevel: 'unverified',
    badgeIcon: '⚪',
    badgeLabel: 'Unverified',
    badgeLabelFull: 'Unverified — insufficient evidence',
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

    // No evidence has been assessed, so there is no score to show and nothing to
    // break down. The app renders this as Unverified rather than as a low score.
    score: null,
    breakdown: [],
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
        // The source keeps the registered label, suffix and all — that is what the
        // reader would find at the other end of the link.
        title: row.name,
        publisher: 'Wikidata',
        url: `https://www.wikidata.org/wiki/${row.qid}`,
        note: 'Imported record. Place and name only — no preparation is claimed.',
      },
    ],
    disclaimer: IMPORT_DISCLAIMER,
    sourceLanguage: 'en',
  };
}

const importedRows = rawImported as ImportedRow[];

// The atlas cannot group 240 countries from a six-entry literal, so the import
// supplies the continent for every country it covers.
registerContinents(importedRows.map((row) => [row.country, row.continent] as [string, string]));

const imported: Dish[] = importedRows.map(expand);

/**
 * Imported records go through the same invariants as curated ones. A malformed row
 * is dropped rather than taking the whole catalogue down — one bad record from an
 * upstream source should not stop the app from opening.
 */
const validImported = imported.filter((dish) => findViolations(dish).length === 0);

/** Everything the app can show. Curated records first, so they lead every list. */
export const catalogue: Dish[] = [...curated, ...validImported];

export const dishById = (id: number | null | undefined): Dish | undefined =>
  catalogue.find((d) => d.id === id);

export const catalogueStats = {
  total: catalogue.length,
  curated: curated.length,
  imported: validImported.length,
  countries: new Set(catalogue.map((d) => d.loc.country)).size,
};

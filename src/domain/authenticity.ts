/**
 * The classification vocabulary and the evidence checks.
 *
 * These are the product's domain rules, lifted out of the UI so that the same
 * definitions serve the screens, the intake pipeline and the tests.
 */

import type { Copy } from '../i18n/copy';
import type { Dish, FilterKey, Level, LevelKey } from './types';

/** The five classification levels, with the glyph and text label the design pairs. */
export const CLASSIFICATIONS: Record<Level, { icon: string; label: keyof Copy; full: keyof Copy }> = {
  local: { icon: '🟢', label: 'levelLocal', full: 'levelLocalFull' },
  regional: { icon: '🟢', label: 'levelRegional', full: 'levelRegional' },
  variation: { icon: '🟡', label: 'levelVariation', full: 'levelVariation' },
  adaptation: { icon: '🟠', label: 'levelAdaptation', full: 'levelAdaptation' },
  fusion: { icon: '🔴', label: 'levelFusion', full: 'levelFusion' },
  unverified: { icon: '⚪', label: 'levelUnverified', full: 'levelUnverifiedFull' },
};

/** What a badge says, in the reader's language. */
export const levelLabel = (copy: Copy, level: Level, form: 'label' | 'full' = 'label'): string =>
  copy[CLASSIFICATIONS[level][form]];

/**
 * Levels that qualify for the primary Authentic Food discovery experience.
 * Source brief: "Only the first three categories should qualify".
 *
 * Note the Feed's `Authentic Only` chip is narrower still — it means local/regional
 * only, and `Traditional Variations` is its own chip. See FILTERS below.
 */
export const DISCOVERY_LEVELS: readonly Level[] = ['local', 'regional', 'variation'];

/** True for the two levels the app calls "authentic" without qualification. */
export const isAuthentic = (level: Level): boolean => level === 'local' || level === 'regional';

/**
 * The authenticity chip row. `test` is the predicate each chip applies to the feed.
 * Order and copy are final.
 */
export const FILTERS: readonly { key: FilterKey; label: keyof Copy; test: (d: Dish) => boolean }[] = [
  { key: 'authentic', label: 'filterAuthenticOnly', test: (d) => isAuthentic(d.badgeLevel) },
  { key: 'variation', label: 'filterTraditionalVariations', test: (d) => d.badgeLevel === 'variation' },
  { key: 'adaptation', label: 'filterModernAdaptations', test: (d) => d.badgeLevel === 'adaptation' },
  { key: 'fusion', label: 'filterFusion', test: (d) => d.badgeLevel === 'fusion' },
  // Added for the imported catalogue: a record that exists but has not been through
  // the evidence assessment yet. `unverified` is a valid, publishable state in the
  // brief, and it needs a way to be browsed — otherwise the only honest place to put
  // thousands of unassessed dishes would be nowhere.
  { key: 'unverified', label: 'filterUnverified', test: (d) => d.badgeLevel === 'unverified' },
  { key: 'all', label: 'filterAll', test: () => true },
];

/** What a chip in the authenticity row says, in the reader's language. */
export const filterLabel = (copy: Copy, key: FilterKey): string => copy[filterDef(key).label];

/**
 * Which browse filter shows everything classified like this record.
 *
 * Not an identity mapping, and that is the whole reason it exists: `local` and
 * `regional` are two *levels* and one *filter*. `FILTERS` deliberately offers
 * "Authentic Only" rather than a chip each, because the distinction a reader is making
 * at that moment is authenticated or not — where the confirmations came from is a
 * question about one record, not a way to browse.
 *
 * So a badge reading "Authentic — Local" has to link to `authentic`. Linking it to a
 * `local` filter that does not exist would give an empty list from a badge that is
 * plainly true, which is the worst possible answer for the one link on the page whose
 * job is to prove the classification means something.
 *
 * Written as an exhaustive map rather than `isAuthentic(level) ? 'authentic' : level`,
 * which does not compile — `Level` and `FilterKey` are different vocabularies and the
 * compiler is right to say so. The map makes that explicit and means a new level cannot
 * be added without deciding where it browses to.
 */
const FILTER_FOR: Record<Level, FilterKey> = {
  local: 'authentic',
  regional: 'authentic',
  variation: 'variation',
  adaptation: 'adaptation',
  fusion: 'fusion',
  unverified: 'unverified',
};

export const filterKeyFor = (level: Level): FilterKey => FILTER_FOR[level];

export const filterDef = (key: FilterKey) => {
  const found = FILTERS.find((f) => f.key === key);
  if (!found) throw new Error(`Unknown filter: ${key}`);
  return found;
};

/** The geographic levels, coarse to fine, with the noun the place picker uses. */
export const GEO_LEVELS: readonly { key: LevelKey; label: keyof Copy; choose: keyof Copy }[] = [
  { key: 'country', label: 'geoCountry', choose: 'chooseCountry' },
  { key: 'region', label: 'geoRegion', choose: 'chooseRegion' },
  { key: 'province', label: 'geoProvince', choose: 'chooseProvince' },
  { key: 'city', label: 'geoCity', choose: 'chooseCity' },
  { key: 'village', label: 'geoVillage', choose: 'chooseVillage' },
];

/**
 * The heading the place picker uses for a level.
 *
 * A whole key per level rather than "Choose a {level}", because the article is gendered
 * in half these languages — Spanish needs *un* país and *una* región from the same
 * template, and there is no way to get that right by substitution.
 */
export const chooseLevel = (copy: Copy, key: LevelKey): string =>
  copy[GEO_LEVELS.find((l) => l.key === key)?.choose ?? 'chooseCountry'];

/**
 * The seven evidence checks from the brief. The intake flow answers each one, or
 * leaves it open — open checks lower confidence and are never filled by assumption.
 */
export const EVIDENCE_CHECKS = [
  'Geographic origin',
  'Local preparation',
  'Traditional ingredients',
  'Traditional technique',
  'Historical or cultural documentation',
  'Local source',
  'Community validation',
] as const;

/**
 * The six dimensions the published confidence score breaks down into. These are the
 * scored view of the seven checks (geographic origin and local preparation fold into
 * "Geographic connection").
 */
export const SCORE_DIMENSIONS = [
  'Geographic connection',
  'Traditional ingredients',
  'Traditional technique',
  'Local source',
  'Cultural documentation',
  'Community validation',
] as const;

/**
 * What a score-dimension row is called, in the reader's language.
 *
 * Takes the English label rather than an index, because a breakdown is data: it is
 * written into the catalogue at build time and a seed record, an older export or a
 * future pipeline change could reorder or omit a row. An index would then quietly put
 * the wrong name on a number; an unmatched label falls through unchanged instead.
 */
export const scoreDimensionLabel = (copy: Copy, english: string): string => {
  const key = (
    {
      'Geographic connection': 'scoreDimGeographic',
      'Traditional ingredients': 'scoreDimIngredients',
      'Traditional technique': 'scoreDimTechnique',
      'Local source': 'scoreDimLocalSource',
      'Cultural documentation': 'scoreDimDocumentation',
      'Community validation': 'scoreDimCommunity',
    } satisfies Record<(typeof SCORE_DIMENSIONS)[number], keyof Copy>
  )[english as (typeof SCORE_DIMENSIONS)[number]];
  return key ? copy[key] : english;
};

/**
 * Video ranking order, from the brief. Videos are ordered by the cook's closeness to
 * the tradition; a highly-viewed international video never outranks a local one on
 * view count alone. Recorded here so the discovery pipeline has one definition to
 * rank against.
 */
export const VIDEO_LOCALITY_ORDER = [
  "Local cook from the dish's community",
  'Traditional cook from the region',
  'Local food historian or cultural expert',
  'Regional culinary expert',
  'Reputable documentary or food organisation',
  'Credible international creator',
] as const;

/** Confirmations from people in the place needed to lift a record out of Unverified. */
export const VALIDATIONS_REQUIRED = 3;

/**
 * Parse a display view count ('2.1M views', '3,400 views') to a number, for sorting
 * the popularity rail only. Never mixed into `score`.
 */
export function viewsNumber(views: string | null | undefined): number {
  if (!views) return 0;
  const m = String(views).replace(/,/g, '').match(/([\d.]+)\s*([MK]?)/i);
  if (!m) return 0;
  const unit = (m[2] || '').toUpperCase();
  const mult = unit === 'M' ? 1e6 : unit === 'K' ? 1e3 : 1;
  return parseFloat(m[1]) * mult;
}

/** Continent lookup for the atlas and the country-level place picker. */
export { continentOf } from './continents';

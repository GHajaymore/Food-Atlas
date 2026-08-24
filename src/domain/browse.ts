/**
 * A filtered view of the atlas, described by a URL.
 *
 * This is the piece that turns the app into a website. Everything on a record — the
 * country, the region, the cuisine, the category, each ingredient, the badge — is a
 * query the app already knows how to run, and until now none of them was a link. A
 * reader could see that Kozhikode Halwa is from Kerala and had no way to ask what else
 * is.
 *
 * ## Nothing new is computed
 *
 * `feedFor` already narrows by place, badge, diet and occasion; `searchResults` already
 * narrows by category, ingredient, cuisine and text. They compose, so this file parses
 * a URL into the arguments those two already take and calls them. No third query
 * engine, no second definition of what "Authentic" filters to — which matters, because
 * a filtered list that disagreed with the feed about what it contains would be worse
 * than no link at all.
 *
 * ## Why the parsing is defensive
 *
 * A URL is typed by strangers and shared by readers, so every value here arrives
 * untrusted. Unknown keys are ignored, unknown filter names fall back to `all` rather
 * than throwing, and lists are capped. The failure mode that matters is not a crash —
 * it is a page that silently shows *everything* while its heading claims to be showing
 * one country, and `describe()` exists so the heading is always built from the filters
 * that were actually applied.
 */

import { FILTERS } from './authenticity';
import { GROUP_LABELS, KIND_LABELS, type DietGroup, type DietKind } from './diet';
import { MEAL_LABELS, type MealOccasion } from './meals';
import { feedFor, searchResults, type SearchFacets } from './queries';
import type { Dish, FilterKey, PathStep } from './types';

/** What a browse URL can say. Every field optional; absent means "do not narrow by it". */
export interface BrowseQuery {
  country?: string;
  region?: string;
  /** Badge level — `FilterKey`, e.g. 'authentic'. */
  level?: string;
  category?: string;
  cuisine?: string;
  ingredient?: string;
  /**
   * A diet group (`vegan`) or one of the kinds under it (`poultry`).
   *
   * One field for both because a reader clicking "Vegan" and a reader clicking
   * "Poultry" are doing the same thing, and asking a URL to distinguish `dietGroup`
   * from `dietKind` would push a detail of the menu's shape into every link that
   * mentions food.
   */
  diet?: string;
  /** A single occasion — `breakfast`, `street-food`, `celebration`. */
  meal?: string;
  /** Free text, matched the way search matches it. */
  q?: string;
}

/** How many list values a single URL may carry, so a link cannot become a denial of service. */
const MAX_VALUES = 12;

const clean = (value: unknown): string =>
  typeof value === 'string' ? value.trim().slice(0, 80) : '';

/**
 * Read a URL's parameters into a query.
 *
 * Accepts whatever expo-router hands over, which is `string | string[] | undefined` per
 * key — a repeated parameter arrives as an array, and taking `[0]` rather than throwing
 * is the right call for something a reader may have edited by hand.
 */
export function parseBrowse(params: Record<string, string | string[] | undefined>): BrowseQuery {
  const one = (key: string): string | undefined => {
    const raw = params[key];
    const value = clean(Array.isArray(raw) ? raw[0] : raw);
    return value || undefined;
  };

  return {
    country: one('country'),
    region: one('region'),
    level: one('level'),
    category: one('category'),
    cuisine: one('cuisine'),
    ingredient: one('ingredient'),
    diet: one('diet'),
    meal: one('meal'),
    q: one('q'),
  };
}

/** The place path a query implies. A region without a country is still a region. */
export function pathOf(query: BrowseQuery): PathStep[] {
  const path: PathStep[] = [];
  if (query.country) path.push({ level: 'country', value: query.country });
  if (query.region) path.push({ level: 'region', value: query.region });
  return path;
}

/**
 * The badge filter, defaulting to everything.
 *
 * An unrecognised level falls back to `all` rather than to an empty list. A URL naming
 * a filter that no longer exists — a renamed level, a typo, a link from two versions
 * ago — should show the reader the atlas, not an empty page implying the atlas holds
 * nothing.
 */
export const levelOf = (query: BrowseQuery): FilterKey =>
  FILTERS.some((f) => f.key === query.level) ? (query.level as FilterKey) : 'all';

/**
 * The diet narrowing a URL asks for, if it names one this app knows.
 *
 * Unknown values narrow by nothing rather than by everything — same stance as
 * `levelOf`, and for the same reason: a link from an older version, or a hand-edited
 * URL, should show the atlas rather than an empty page implying it holds nothing. The
 * difference from `levelOf` is that there is no "all" to fall back to here; an absent
 * diet simply is no diet filter.
 */
export function dietOf(query: BrowseQuery): { groups: DietGroup[]; kinds: DietKind[] } {
  const value = query.diet;
  if (!value) return { groups: [], kinds: [] };
  if (value in GROUP_LABELS) return { groups: [value as DietGroup], kinds: [] };
  if (value in KIND_LABELS) return { groups: [], kinds: [value as DietKind] };
  return { groups: [], kinds: [] };
}

/** The occasion a URL asks for, if it names a real one. */
export const mealsOf = (query: BrowseQuery): MealOccasion[] =>
  query.meal && query.meal in MEAL_LABELS ? [query.meal as MealOccasion] : [];

/** What a diet value should be called, whichever of the two vocabularies it came from. */
const dietLabelOf = (value: string): string =>
  GROUP_LABELS[value as DietGroup] ?? KIND_LABELS[value as DietKind] ?? '';

/**
 * Run the query. Composition of the two existing engines, in that order.
 *
 * `feedFor` first because it is the cheaper filter and narrows hardest — place and
 * badge cut the 18,008 down before the text and facet matching runs over what is left.
 */
export function browse(
  dishes: Dish[],
  query: BrowseQuery,
  /* Default to what the URL says, so a caller that passes nothing gets the query it
     asked for rather than an unfiltered list. Both stay overridable: a screen holding
     its own diet state should be able to say so. */
  diet: { groups: DietGroup[]; kinds: DietKind[] } = dietOf(query),
  meals: MealOccasion[] = mealsOf(query),
): Dish[] {
  const narrowed = feedFor(dishes, levelOf(query), pathOf(query), diet, meals);

  const facets: SearchFacets = {
    query: query.q ?? '',
    levels: [],
    categories: query.category ? [query.category] : [],
    ingredients: query.ingredient ? [query.ingredient] : [],
    cuisines: query.cuisine ? [query.cuisine] : [],
    /* The atlas's own default order. 'relevance' is not one of the sorts this project
       defines — evidence is, and leading with it is the whole editorial stance. */
    sortBy: 'authenticity',
  };

  const needsFacets = Boolean(facets.query || facets.categories.length || facets.ingredients.length || facets.cuisines?.length);
  return needsFacets ? searchResults(narrowed, facets) : narrowed;
}

/**
 * What the page should call itself.
 *
 * Built from the filters that were actually applied rather than from the URL, so a
 * heading can never claim a narrowing that did not happen — the failure this whole file
 * is defensive about. An unrecognised `level` falls back to `all` above, and the
 * heading correspondingly stops mentioning a level.
 */
export function describe(query: BrowseQuery): string {
  const level = levelOf(query);
  const parts: string[] = [];

  if (level !== 'all') parts.push(FILTERS.find((f) => f.key === level)?.label ?? '');
  if (query.cuisine) parts.push(`${query.cuisine} cuisine`);
  if (query.category) parts.push(query.category);
  if (query.ingredient) parts.push(`made with ${query.ingredient}`);
  /* Built from the resolved value rather than the raw one, so a heading cannot announce
     a diet that was not applied — the exact failure this file is defensive about. */
  if (query.diet && dietLabelOf(query.diet)) parts.push(dietLabelOf(query.diet));
  if (mealsOf(query).length) parts.push(MEAL_LABELS[mealsOf(query)[0]]);

  const where = [query.region, query.country].filter(Boolean).join(', ');
  const what = parts.filter(Boolean).join(' · ');

  if (what && where) return `${what} — ${where}`;
  if (what) return what;
  if (where) return where;
  if (query.q) return `“${query.q}”`;
  return 'Everything';
}

/** Whether a query narrows anything at all. An empty one is the whole atlas. */
export const isNarrowed = (query: BrowseQuery): boolean =>
  Object.values(query).some(Boolean);

/**
 * The href for a facet.
 *
 * One place that builds these, so a link's shape cannot drift from what `parseBrowse`
 * reads. Values are encoded — a cuisine like "Côte d'Ivoire" or an ingredient with a
 * space would otherwise produce a URL that reads back as something else.
 */
export function hrefFor(query: BrowseQuery): string {
  const params = Object.entries(query)
    .filter(([, value]) => Boolean(value))
    .slice(0, MAX_VALUES)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`);
  return params.length ? `/browse?${params.join('&')}` : '/browse';
}

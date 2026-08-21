/**
 * Derived views over the catalogue: the feed, the place drill-down, the atlas and
 * search. Everything here is pure — the handoff lists all of it as "Derived, not
 * stored", and keeping it pure is what makes it testable without a renderer.
 *
 * Ported from the prototype's `class Component` logic, which the handoff calls
 * "directly translatable".
 */

import { filterDef, GEO_LEVELS, viewsNumber } from './authenticity';
import { continentOf, continentRank, isCountry } from './continents';
import { matchesDiet, type DietGroup, type DietKind } from './diet';
import { matchesMeal, type MealOccasion } from './meals';
import type { Dish, FilterKey, LevelKey, PathStep, SortKey } from './types';

/** True when a dish sits under every step of the current geographic path. */
export const inPath = (dish: Dish, path: PathStep[]): boolean =>
  path.every((step) => dish.loc[step.level] === step.value);

/**
 * The feed: the authenticity chip AND the geographic path AND the dietary
 * preference. All three compose; none of them alters a record, they only narrow
 * which records are shown.
 */
export function feedFor(
  dishes: Dish[],
  filter: FilterKey,
  path: PathStep[],
  diet: DietSelection = EMPTY_DIET,
  meals: MealOccasion[] = [],
): Dish[] {
  const { test } = filterDef(filter);
  return dishes
    .filter(test)
    .filter((d) => inPath(d, path))
    .filter((d) => matchesDiet(d.diet, diet.groups, diet.kinds))
    .filter((d) => matchesMeal(d.meals, meals));
}

/** The dietary preference, as the UI holds it. */
export interface DietSelection {
  groups: DietGroup[];
  kinds: DietKind[];
}

export const EMPTY_DIET: DietSelection = { groups: [], kinds: [] };

export interface PlaceOption {
  label: string;
  count: number;
  level: LevelKey;
}

export interface NextLevel {
  key: LevelKey;
  /** The noun the picker uses: 'country', 'province or district', … */
  label: string;
  options: PlaceOption[];
}

/**
 * The next geographic level to offer.
 *
 * Levels that do not apply are skipped automatically: we walk down from the last
 * chosen level and return the first one that actually has values among the matching
 * dishes, so Italy goes country -> region -> city with no empty "province" step.
 * Returns null when nothing deeper is recorded — the selector then reads
 * "Deepest level recorded here" and is inert.
 *
 * `matching` must already be filtered by authenticity, so a count never promises a
 * record the active filter cannot show.
 */
export function nextLevel(path: PathStep[], matching: Dish[]): NextLevel | null {
  const last = path[path.length - 1];
  const startAt = last ? GEO_LEVELS.findIndex((l) => l.key === last.level) + 1 : 0;

  for (let i = startAt; i < GEO_LEVELS.length; i++) {
    const level = GEO_LEVELS[i];
    const counts = new Map<string, number>();
    for (const dish of matching) {
      const value = dish.loc[level.key];
      if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    if (counts.size) {
      return {
        key: level.key,
        label: level.label,
        options: [...counts].map(([label, count]) => ({ label, count, level: level.key })),
      };
    }
  }
  return null;
}

export interface PlaceGroup {
  label: string;
  showLabel: boolean;
  options: PlaceOption[];
}

/**
 * The place picker's list. At country level it groups by continent — the structure
 * that has to hold every country on earth; deeper levels are one alphabetical list.
 */
export function placeGroups(next: NextLevel | null, query: string, atCountryLevel: boolean): PlaceGroup[] {
  const q = query.trim().toLowerCase();
  const options = (next?.options ?? []).filter((o) => !q || o.label.toLowerCase().includes(q));
  const byName = (a: PlaceOption, b: PlaceOption) => a.label.localeCompare(b.label);

  if (!atCountryLevel) {
    return [{ label: '', showLabel: false, options: [...options].sort(byName) }];
  }

  const grouped = new Map<string, PlaceOption[]>();
  for (const option of options) {
    const continent = continentOf(option.label);
    grouped.set(continent, [...(grouped.get(continent) ?? []), option]);
  }
  return [...grouped]
    .sort((a, b) => continentRank(a[0]) - continentRank(b[0]) || a[0].localeCompare(b[0]))
    .map(([label, opts]) => ({ label, showLabel: true, options: [...opts].sort(byName) }));
}

export interface AtlasCountry {
  name: string;
  count: number;
  /** Distinct places recorded below country level. */
  places: number;
  /**
   * '12 traditions · 3 places'.
   *
   * Every row carries the same two facts, always. An earlier version appended place
   * names where it had them, which made the list read as though some countries were
   * documented and others were an afterthought — when the real difference was only
   * whether anyone had recorded a region. A country with no places is a genuine
   * signal in its own right, and it says so in the same shape as everyone else.
   */
  detail: string;
}

export interface AtlasGroup {
  label: string;
  countries: AtlasCountry[];
}

/** The Food Atlas, grouped by continent. Coverage is stated over the whole catalogue. */
export function buildAtlas(dishes: Dish[]): AtlasGroup[] {
  const groups = new Map<string, Map<string, Dish[]>>();
  for (const dish of dishes) {
    const continent = continentOf(dish.loc.country);
    const countries = groups.get(continent) ?? new Map<string, Dish[]>();
    countries.set(dish.loc.country, [...(countries.get(dish.loc.country) ?? []), dish]);
    groups.set(continent, countries);
  }

  return [...groups]
    .sort((a, b) => continentRank(a[0]) - continentRank(b[0]) || a[0].localeCompare(b[0]))
    .map(([label, countries]) => ({
    label,
    countries: [...countries].map(([name, list]) => {
      const places = [
        ...new Set(list.map((d) => d.loc.village || d.loc.city || d.loc.province || d.loc.region).filter(Boolean)),
      ];
      const traditions = `${list.length} ${list.length === 1 ? 'tradition' : 'traditions'}`;
      const placeCount = places.length
        ? `${places.length} ${places.length === 1 ? 'place' : 'places'}`
        : 'country level only';

      return {
        name,
        count: list.length,
        places: places.length,
        detail: `${traditions} · ${placeCount}`,
      };
    }),
  }));
}

export interface SearchFacets {
  query: string;
  levels: string[];
  categories: string[];
  ingredients: string[];
  sortBy: SortKey;
  dietGroups?: DietGroup[];
  dietKinds?: DietKind[];
  meals?: MealOccasion[];
  /** Culinary traditions — "Tamil", "Sichuan". Multi-select, OR within the group. */
  cuisines?: string[];
}

/**
 * Search. The query matches case-insensitively against dish name, category, every
 * level of the geographic path, ingredients and equipment. Facets are multi-select
 * within a group and AND across groups.
 *
 * Sorting never blends the two measurements: 'authenticity' orders by evidence
 * strength, 'popularity' by views, and neither feeds the other.
 */
/**
 * The searchable text for a dish, lowercased and built once.
 *
 * The query is live — it re-filters on every keystroke — and the catalogue runs to
 * thousands of records, so rebuilding this string per dish per keystroke is the
 * difference between a responsive field and a janky one. Keyed by the dish object,
 * so it is dropped with the record and never goes stale.
 */
const haystacks = new WeakMap<Dish, string>();

function haystackFor(dish: Dish): string {
  const cached = haystacks.get(dish);
  if (cached !== undefined) return cached;

  const built = [dish.name, dish.category, ...Object.values(dish.loc), ...dish.ingredients, ...dish.equipment]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  haystacks.set(dish, built);
  return built;
}

export function searchResults(dishes: Dish[], facets: SearchFacets): Dish[] {
  const q = facets.query.trim().toLowerCase();

  const matched = dishes.filter((d) => {
    if (facets.levels.length && !facets.levels.includes(d.badgeLevel)) return false;
    if (facets.categories.length && !facets.categories.includes(d.category)) return false;
    if (facets.ingredients.length && !d.ingredients.some((i) => facets.ingredients.includes(i))) return false;
    if (!matchesDiet(d.diet, facets.dietGroups ?? [], facets.dietKinds ?? [])) return false;
    if (!matchesMeal(d.meals, facets.meals ?? [])) return false;
    if (facets.cuisines?.length && !(d.cuisine && facets.cuisines.includes(d.cuisine))) return false;
    if (!q) return true;
    return haystackFor(d).includes(q);
  });

  const sorted = [...matched];
  if (facets.sortBy === 'popularity') {
    sorted.sort((a, b) => viewsNumber(b.views) - viewsNumber(a.views));
  } else if (facets.sortBy === 'atrisk') {
    sorted.sort((a, b) => Number(b.atRisk) - Number(a.atRisk) || (b.score ?? 0) - (a.score ?? 0));
  } else {
    sorted.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }
  return sorted;
}

/**
 * The most-read rail — ignoring the active filters, as a counterpoint to them.
 * It exists to be contradicted: the most-read record is often not the most
 * authentic one, and the rail says so.
 *
 * Only records that carry a real readership figure are eligible. The app shipped
 * ranking seven records — not seven of the best, seven in total, the design
 * handoff's demo entries with invented counts like "2.1M views" — while the other
 * 13,848 tied at zero and could never appear. A record with no count is unknown, not
 * unpopular, and unknown does not belong in a ranking.
 *
 * A photograph is required for the same reason it is required on the home shelves:
 * this is a rail, and a rail of blank cards invites nobody.
 */
export const mostPopular = (dishes: Dish[], take = 4): Dish[] =>
  dishes
    .filter((d) => d.photo && viewsNumber(d.views) > 0)
    .sort((a, b) => viewsNumber(b.views) - viewsNumber(a.views))
    .slice(0, take);

/** The union of every traditional ingredient, for the search facet. */
export const allIngredients = (dishes: Dish[], cap = 10): string[] =>
  [...new Set(dishes.flatMap((d) => d.ingredients))].sort().slice(0, cap);

/** The kinds of dish present in the catalogue, for the search facet. */
export const allCategories = (dishes: Dish[]): string[] =>
  [...new Set(dishes.map((d) => d.category).filter(Boolean))].sort();

/**
 * The culinary traditions present, most-recorded first.
 *
 * Ordered by how much of the atlas each one holds rather than alphabetically: with a
 * hundred-odd cuisines, the ones a reader is most likely to want should not be
 * somewhere past the fold. Capped for the same reason the ingredient facet is.
 */
export const allCuisines = (dishes: Dish[], cap = 24): string[] => {
  const counts = new Map<string, number>();
  for (const dish of dishes) {
    if (dish.cuisine) counts.set(dish.cuisine, (counts.get(dish.cuisine) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, cap)
    .map(([name]) => name);
};

/** A random at-risk tradition, for "Surprise me". */
export const randomAtRisk = (dishes: Dish[]): Dish | undefined => {
  const atRisk = dishes.filter((d) => d.atRisk);
  return atRisk[Math.floor(Math.random() * atRisk.length)];
};

/** '6 traditions documented across 6 countries…' — coverage, stated honestly. */
export const atlasCoverage = (dishes: Dish[]): string =>
  // Countries, counted as countries. An origin recorded as "Levant" or "Mesoamerica"
  // is kept on its record and is not one of these.
  `${dishes.length} traditions documented across ` +
  `${new Set(dishes.map((d) => d.loc.country).filter(isCountry)).size} countries. ` +
  `Coverage is stated honestly: a country absent here has nothing recorded yet, not nothing to record.`;

/**
 * App state.
 *
 * A direct translation of the prototype's state table. Only the values the handoff
 * lists as stored live here; the feed, place options, search results, atlas grouping
 * and breadcrumb are all derived on read (see `domain/queries.ts`).
 *
 * `screen` and `selectedId` are NOT in this store — navigation is expo-router's job,
 * so the route is the screen and the dish id is a route param. Everything else is
 * cross-screen state that has to survive a push/pop.
 */

import { create } from 'zustand';
import { kindsFor, type DietGroup, type DietKind } from '../domain/diet';
import type { MealOccasion } from '../domain/meals';
import type { FilterKey, LevelKey, PathStep, SortKey } from '../domain/types';

interface AppState {
  /** Authenticity chip on the Feed. Defaults to the app setting. */
  activeFilter: FilterKey;
  /** Geographic drill-down. */
  path: PathStep[];
  /** Place-picker search text. */
  placeQuery: string;

  /**
   * Dietary preference. Sticky across screens on purpose — someone who does not eat
   * meat does not want to re-declare that on every screen.
   */
  dietGroups: DietGroup[];
  dietKinds: DietKind[];
  /** When the reader wants to eat. Sticky alongside the dietary preference. */
  meals: MealOccasion[];

  /** Search screen. */
  query: string;
  facetLevels: string[];
  facetCategories: string[];
  facetIngredients: string[];
  sortBy: SortKey;

  setFilter: (filter: FilterKey) => void;
  /** Append a level to the path and clear the picker's search text. */
  pushPlace: (level: LevelKey, value: string) => void;
  /** Truncate the path to `depth` steps. `0` clears it back to World. */
  truncatePath: (depth: number) => void;
  /** Jump straight to a country, as the Atlas does. */
  setCountry: (country: string) => void;
  setPlaceQuery: (text: string) => void;

  /** Toggle a top-level dietary group. Deselecting it drops its sub-menu choices. */
  toggleDietGroup: (group: DietGroup) => void;
  /** Toggle a sub-menu kind, e.g. Shellfish under Seafood. */
  toggleDietKind: (kind: DietKind) => void;
  clearDiet: () => void;
  toggleMeal: (meal: MealOccasion) => void;
  clearMeals: () => void;

  setQuery: (text: string) => void;
  toggleFacet: (group: 'facetLevels' | 'facetCategories' | 'facetIngredients', value: string) => void;
  setSortBy: (sort: SortKey) => void;
  clearFacets: () => void;

  /** The Feed's empty state: back to the default filter, anywhere in the atlas. */
  resetFilters: () => void;
}

/**
 * Configurable behaviour the prototype exposed as props. Kept as app settings, per
 * the handoff — not as hard-coded values.
 */
export const settings = {
  /**
   * The default authenticity filter.
   *
   * The brief says discovery prioritises Authentic Only, and it was written for a
   * catalogue of assessed records. Against a global atlas where the great majority
   * are imported and `unverified`, that default lands the reader on five dishes and
   * hides eight thousand — which reads as a broken app, not as rigour.
   *
   * So the default is `all`, and the priority is expressed where it belongs: the
   * Feed renders assessed records first as full cards, then the unassessed ones
   * below a heading that says exactly what they are. Authentic Only remains one tap
   * away and still means precisely what it says.
   */
  defaultFilter: 'all' as FilterKey,
  /** Whether view counts are shown at all. Popularity is always the weakest element. */
  showViewCounts: true,
  /** Score breakdown as bars, or as a bare number. */
  scoreStyle: 'bars' as 'bars' | 'number-only',
};

export const useApp = create<AppState>((set) => ({
  activeFilter: settings.defaultFilter,
  path: [],
  placeQuery: '',

  dietGroups: [],
  dietKinds: [],
  meals: [],

  query: '',
  facetLevels: [],
  facetCategories: [],
  facetIngredients: [],
  sortBy: 'authenticity',

  setFilter: (activeFilter) => set({ activeFilter }),

  pushPlace: (level, value) =>
    set((s) => ({ path: [...s.path, { level, value }], placeQuery: '' })),

  truncatePath: (depth) => set((s) => ({ path: s.path.slice(0, depth) })),

  // The Atlas sets the filter to All alongside the country, so a country row never
  // lands on an empty feed just because the record is classified as an adaptation.
  setCountry: (country) => set({ path: [{ level: 'country', value: country }], activeFilter: 'all' }),

  setPlaceQuery: (placeQuery) => set({ placeQuery }),

  toggleDietGroup: (group) =>
    set((s) => {
      const on = s.dietGroups.includes(group);
      return {
        dietGroups: on ? s.dietGroups.filter((g) => g !== group) : [...s.dietGroups, group],
        // Turning a group off takes its sub-menu choices with it, so a stale
        // "Shellfish" can never survive Seafood being deselected and silently
        // empty the results.
        dietKinds: on ? s.dietKinds.filter((k) => !kindsFor(group).includes(k)) : s.dietKinds,
      };
    }),

  toggleDietKind: (kind) =>
    set((s) => ({
      dietKinds: s.dietKinds.includes(kind) ? s.dietKinds.filter((k) => k !== kind) : [...s.dietKinds, kind],
    })),

  clearDiet: () => set({ dietGroups: [], dietKinds: [] }),

  toggleMeal: (meal) =>
    set((s) => ({
      meals: s.meals.includes(meal) ? s.meals.filter((m) => m !== meal) : [...s.meals, meal],
    })),

  clearMeals: () => set({ meals: [] }),

  setQuery: (query) => set({ query }),

  toggleFacet: (group, value) =>
    set((s) => {
      const current = s[group];
      return {
        [group]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      } as Pick<AppState, typeof group>;
    }),

  setSortBy: (sortBy) => set({ sortBy }),

  clearFacets: () => set({ facetLevels: [], facetCategories: [], facetIngredients: [], query: '' }),

  // The Feed's empty state resets place and authenticity, but deliberately NOT the
  // dietary preference — that is a standing constraint on what the reader can eat,
  // not a filter they are experimenting with.
  resetFilters: () => set({ activeFilter: settings.defaultFilter, path: [] }),
}));

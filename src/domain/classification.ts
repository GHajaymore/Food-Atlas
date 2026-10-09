/**
 * Whether a filter has enough underneath it to be offered.
 *
 * The diet and meal filters were offered on the front page and in search, and measured
 * over the shipped catalogue, diet is recorded for **6 of 17,358 records** and meal
 * occasion for the same 6 — the hand-curated ones. Everything else is honestly
 * "unclassified", because the atlas refuses to guess a diet from an ingredient list that
 * may be incomplete, and refuses to file a dish under a meal its tradition does not have.
 *
 * So a reader who chose Vegan was shown two dishes, and reasonably concluded the atlas
 * holds two vegan dishes. The count was true and what it implied was false — the same
 * shape as every other fault this project has fixed, and a direct case of its rule that a
 * control which cannot do what it offers is worse than no control.
 *
 * The filters are not deleted. They are offered once enough records are classified for a
 * choice to mean something, and that is decided by measuring the catalogue the reader has,
 * so the day classification lands they come back without anyone remembering to switch them
 * on. A filter a reader has already set stays visible regardless, so it can be cleared.
 */

import type { Dish } from './types';

/**
 * One record in twenty. Below that, a filter's results are a handful of hand-curated
 * records rather than a view of the atlas; at it, a vegan filter would return around 870.
 */
export const MIN_CLASSIFIED_SHARE = 0.05;

interface Coverage {
  diet: number;
  meals: number;
}

const measured = new WeakMap<readonly Dish[], Coverage>();

/** The share of records with a diet, and with a meal occasion, recorded. */
export function classifiedShare(dishes: readonly Dish[]): Coverage {
  const cached = measured.get(dishes);
  if (cached) return cached;
  const total = dishes.length || 1;
  let diet = 0;
  let meals = 0;
  for (const dish of dishes) {
    if (dish.diet && dish.diet.group !== 'unclassified') diet += 1;
    if (dish.meals?.occasions?.length) meals += 1;
  }
  const coverage = { diet: diet / total, meals: meals / total };
  measured.set(dishes, coverage);
  return coverage;
}

export const offersDietFilter = (dishes: readonly Dish[]): boolean =>
  classifiedShare(dishes).diet >= MIN_CLASSIFIED_SHARE;

export const offersMealFilter = (dishes: readonly Dish[]): boolean =>
  classifiedShare(dishes).meals >= MIN_CLASSIFIED_SHARE;

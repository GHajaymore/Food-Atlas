/**
 * When a dish is eaten.
 *
 * A third filter axis, alongside authenticity, place and diet. The trap here is
 * obvious once named: "breakfast, lunch, dinner" is a particular culture's timetable,
 * and forcing every tradition onto it flattens exactly what this app exists to
 * preserve. Ayrag is drunk whenever a guest arrives. Kozhikode halwa is not a course.
 * Hákarl belongs to a midwinter feast.
 *
 * So the axis carries two things: the occasions the dish is actually eaten at — a
 * dish may have several, and `celebration` and `anytime` are first-class answers —
 * and a `note` giving the occasion in its own terms. The filter narrows what is
 * shown. It never relabels a dish to make it fit a slot.
 *
 * Where the record does not say, the dish is simply not classified, and the
 * "Not recorded" chip is how a reader finds those rather than having them silently
 * disappear from every meal filter.
 */

import type { Copy } from '../i18n/copy';

export type MealOccasion =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'supper'
  | 'snack'
  | 'street-food'
  | 'celebration'
  | 'anytime'
  | 'unclassified';

export const MEAL_LABELS: Record<MealOccasion, keyof Copy> = {
  breakfast: 'mealBreakfast',
  lunch: 'mealLunch',
  dinner: 'mealDinner',
  supper: 'mealSupper',
  snack: 'mealSnack',
  'street-food': 'mealStreetFood',
  celebration: 'mealCelebration',
  anytime: 'mealAnytime',
  unclassified: 'mealUnclassified',
};

/** The order the chips appear in: the day, then the occasions outside it. */
export const MEAL_MENU: readonly MealOccasion[] = [
  'breakfast',
  'lunch',
  'dinner',
  'supper',
  'snack',
  'street-food',
  'celebration',
  'anytime',
  'unclassified',
];

export interface Meals {
  /** Empty means not recorded — never assume a dish is "probably dinner". */
  occasions: MealOccasion[];
  /**
   * When it is eaten, in its own terms. This is where the cultural context that a
   * chip cannot hold survives: iftar, Þorrablót, the midday comida.
   */
  note: string;
}

/**
 * Does this dish match the selected occasions?
 *
 * `anytime` is treated as satisfying any specific occasion asked for — a dish eaten
 * at any hour is genuinely available at breakfast. `unclassified` matches only when
 * the reader explicitly asks for unrecorded dishes, so an imported record with no
 * occasion on file never pads out a "breakfast" list it has no claim to.
 */
export function matchesMeal(meals: Meals, selected: MealOccasion[]): boolean {
  if (!selected.length) return true;

  const occasions = meals.occasions.length ? meals.occasions : (['unclassified'] as MealOccasion[]);

  return selected.some((choice) => {
    if (occasions.includes(choice)) return true;
    if (choice === 'unclassified') return false;
    // A dish eaten at any time is available at whatever occasion was asked for.
    return occasions.includes('anytime');
  });
}

/** 'Snack · Celebration & feast' for a card. */
export const mealLabel = (meals: Meals): string =>
  meals.occasions.length
    ? meals.occasions.map((o) => MEAL_LABELS[o]).join(' · ')
    : MEAL_LABELS.unclassified;

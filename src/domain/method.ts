/**
 * How long a record's method is, whether or not the words have arrived.
 *
 * Cookbook step text is 56% of `cookbook.json` and is read by exactly one screen, so it is
 * held back from the first payload and fetched once the app has painted — see
 * `scripts/compact-data.mjs` and `docs/first-paint.md`. Until it lands, those records carry
 * an empty `steps` array and a `stepCount`.
 *
 * Fourteen places in the app ask how long a method is, and every one of them meant the
 * count rather than the words: the front page orders its Disappearing rail by whether a
 * record has a method, `metrics` and `Mission` count documented records, `invariants`
 * checks that a fusion record carries none, the dish screen decides `isDocumented`. Left
 * reading `steps.length`, all fourteen would have silently answered zero for a third of the
 * catalogue during the first moments of every visit — the front page would reorder and the
 * headline figures would drop.
 *
 * ## Why this is not `steps.length` with placeholders
 *
 * The first attempt filled `steps` with the right number of empty strings, so that every
 * `.length` stayed correct with no call site changed. `plumbing.test.ts` rejected it
 * immediately — *"never shows a bullet with nothing beside it"*, 4,595 records — because an
 * empty string is a step as far as a renderer is concerned. The count belongs in its own
 * field, and the array stays honest about what it holds.
 *
 * Three places are deliberately **not** callers of this. `translationProvider.ts` compares a
 * translation's step count against the record's to reject a bad translation, and prompts
 * with it; that has to mean the words actually present, and it only ever runs on the record
 * screen, which waits for them.
 */

import type { Dish } from './types';

/** The number of steps in a record's method, counting ones whose text has not loaded. */
export const methodLength = (dish: Pick<Dish, 'steps' | 'stepCount'>): number =>
  dish.stepCount ?? dish.steps.length;

/** Whether a record documents a method at all. */
export const hasMethod = (dish: Pick<Dish, 'steps' | 'stepCount'>): boolean => methodLength(dish) > 0;

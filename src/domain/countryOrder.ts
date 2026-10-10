/**
 * The order a country's records are listed in — on its page and in its prerendered HTML.
 *
 * It was "best documented first, then by name", and documented meant "has written steps".
 * The imported cookbooks are the records with the most steps, so Brazil's page opened on
 * "Abacaxi de festa" and "Abobrinhas recheadas" — 161 of its 188 records are published
 * recipes in Portuguese — with feijoada somewhere below them. A reader opening a country
 * in a food atlas came for that country's traditions; a recipe someone published is
 * welcome, and second.
 *
 * So: the classification first (the same rank the rails and the hero use), then whether a
 * card can show a photograph somebody chose for the dish, then the score, then how much
 * the record holds, then the name — so the order is the same on every load.
 */

import { listPhoto } from './listPhoto';
import { methodLength } from './method';
import type { Dish, Level } from './types';

/** Mirrors `CLASS_RANK` in shelves.ts and `RANK` in hero.ts. */
const RANK: Record<Level, number> = {
  local: 5,
  regional: 4,
  variation: 3,
  adaptation: 2,
  unverified: 1,
  fusion: 0,
};

const holds = (d: Dish) => methodLength(d) * 2 + d.ingredients.length;

export function countryOrder<T extends Dish>(dishes: readonly T[]): T[] {
  return [...dishes].sort(
    (a, b) =>
      RANK[b.badgeLevel] - RANK[a.badgeLevel] ||
      Number(Boolean(listPhoto(b))) - Number(Boolean(listPhoto(a))) ||
      (b.score ?? 0) - (a.score ?? 0) ||
      holds(b) - holds(a) ||
      a.name.localeCompare(b.name),
  );
}

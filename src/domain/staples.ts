/**
 * The ingredients a dish is *built on*, from a fixed vocabulary.
 *
 * The atlas holds 27,036 distinct ingredient strings, most of them quantities — "½
 * teaspoon salt", "1 egg", "Salt to taste". That is unusable as a list to choose from,
 * which is why the ingredient facet was removed. This is the answer to the question the
 * facet was trying to ask: **not every ingredient, but the fifty-odd a cuisine is
 * founded on.**
 *
 * ## Curated, not derived, and the reason is not taste
 *
 * Counting produces salt, sugar and water. They are the commonest ingredients in the
 * atlas and they discriminate nothing — every cuisine on earth uses all three, so a
 * filter built from frequency sorts nothing into anything.
 *
 * What makes a dish a rice dish is not that rice appears most often in its list. It is
 * that rice is the thing the dish is made *of*, and that is a judgement about food
 * rather than a fact about strings. Fifty terms can be argued with by a person, checked
 * against a region, and translated once. Twenty-seven thousand can be none of those.
 *
 * ## The list is meant to be argued with
 *
 * It is deliberately global rather than complete: staples that anchor a cuisine
 * somewhere, not every food anybody eats. Teff, cassava, plantain and millet are here
 * for the same reason rice and wheat are — a vocabulary that reaches only as far as a
 * European kitchen would quietly make most of the atlas unbrowsable, which is the exact
 * failure this project exists to avoid.
 *
 * Absences worth knowing about: no salt, sugar, water, oil or pepper, because they are
 * everywhere; no spices beyond the few that define a cuisine rather than season a dish.
 *
 * ## Matching is not reimplemented
 *
 * `dishHas` from `pantry.ts` does it, synonyms and word-boundary rule included. Two ways
 * of deciding whether a dish uses rice is two answers to one question, and the day they
 * disagree neither is trustworthy — the same reason `browse.ts` composes the existing
 * query engines instead of writing a third.
 */

import type { Copy } from '../i18n/copy';

import { dishHas, synonymsOf } from './pantry';
import type { Dish } from './types';

/** What a group heading says, in the reader's language. */
export const stapleGroupLabel = (copy: Copy, group: StapleGroup): string =>
  copy[
    ({
      Grains: 'stapleGrains',
      Roots: 'stapleRoots',
      Pulses: 'staplePulses',
      Dairy: 'stapleDairy',
      'Meat & fish': 'stapleMeatFish',
      Vegetables: 'stapleVegetables',
      Aromatics: 'stapleAromatics',
      'Sweet & sour': 'stapleSweetSour',
    } satisfies Record<StapleGroup, keyof Copy>)[group]
  ];

export type StapleGroup =
  | 'Grains'
  | 'Roots'
  | 'Pulses'
  | 'Dairy'
  | 'Meat & fish'
  | 'Vegetables'
  | 'Aromatics'
  | 'Sweet & sour';

export interface Staple {
  /** Stable key, used in URLs. Never translated. */
  key: string;
  /**
   * The English word, used to match a typed term against record ingredient text.
   *
   * Never shown. The atlas's ingredient lists are in English, so the matcher has to
   * speak English even when the reader does not — a Spanish pantry saying "garbanzos"
   * still has to find records whose ingredients say "chickpeas".
   */
  english: string;
  /** The copy key for what a reader sees. */
  label: keyof Copy;
  group: StapleGroup;
  /**
   * Whether this is something a dish is *made of* rather than seasoned with.
   *
   * Ajay's rule for the pantry: a reader says "I have chicken" or "I have aubergines",
   * not "I have cumin". Somebody with garlic and ginger in the cupboard — which is
   * everybody — would otherwise match most of the atlas and learn nothing.
   *
   * Grains, roots, pulses, dairy, meat, fish and vegetables are main. Aromatics and
   * sweeteners are not: they are real staples of a *cuisine*, which is why they stay in
   * the vocabulary for related-dish matching and browsing, but they are not what anybody
   * plans a meal around.
   */
  main: boolean;
}

/**
 * The vocabulary.
 *
 * Ordered within each group by roughly how much of the world eats it, so a list drawn
 * from the front is global rather than alphabetical — the mistake `allIngredients` made
 * when it took the first ten of twenty-seven thousand in alphabetical order.
 */
export const STAPLES: readonly Staple[] = [
  // Half the world's calories, give or take.
  { key: 'rice', english: 'Rice', label: 'stapleRice', group: 'Grains', main: true },
  { key: 'wheat', english: 'Wheat', label: 'stapleWheat', group: 'Grains', main: true },
  { key: 'maize', english: 'Maize', label: 'stapleMaize', group: 'Grains', main: true },
  { key: 'millet', english: 'Millet', label: 'stapleMillet', group: 'Grains', main: true },
  { key: 'sorghum', english: 'Sorghum', label: 'stapleSorghum', group: 'Grains', main: true },
  { key: 'barley', english: 'Barley', label: 'stapleBarley', group: 'Grains', main: true },
  { key: 'oats', english: 'Oats', label: 'stapleOats', group: 'Grains', main: true },
  { key: 'buckwheat', english: 'Buckwheat', label: 'stapleBuckwheat', group: 'Grains', main: true },
  { key: 'teff', english: 'Teff', label: 'stapleTeff', group: 'Grains', main: true },

  { key: 'potato', english: 'Potato', label: 'staplePotato', group: 'Roots', main: true },
  { key: 'cassava', english: 'Cassava', label: 'stapleCassava', group: 'Roots', main: true },
  { key: 'sweet potato', english: 'Sweet potato', label: 'stapleSweetPotato', group: 'Roots', main: true },
  { key: 'yam', english: 'Yam', label: 'stapleYam', group: 'Roots', main: true },
  { key: 'taro', english: 'Taro', label: 'stapleTaro', group: 'Roots', main: true },
  { key: 'plantain', english: 'Plantain', label: 'staplePlantain', group: 'Roots', main: true },

  { key: 'lentil', english: 'Lentils', label: 'stapleLentil', group: 'Pulses', main: true },
  { key: 'chickpea', english: 'Chickpeas', label: 'stapleChickpea', group: 'Pulses', main: true },
  { key: 'soy', english: 'Soy', label: 'stapleSoy', group: 'Pulses', main: true },
  { key: 'tofu', english: 'Tofu', label: 'stapleTofu', group: 'Pulses', main: true },
  { key: 'black bean', english: 'Black beans', label: 'stapleBlackBean', group: 'Pulses', main: true },
  { key: 'mung bean', english: 'Mung beans', label: 'stapleMungBean', group: 'Pulses', main: true },
  { key: 'pigeon pea', english: 'Pigeon peas', label: 'staplePigeonPea', group: 'Pulses', main: true },

  { key: 'milk', english: 'Milk', label: 'stapleMilk', group: 'Dairy', main: true },
  { key: 'yoghurt', english: 'Yoghurt', label: 'stapleYoghurt', group: 'Dairy', main: true },
  { key: 'cheese', english: 'Cheese', label: 'stapleCheese', group: 'Dairy', main: true },
  { key: 'paneer', english: 'Paneer', label: 'staplePaneer', group: 'Dairy', main: true },
  { key: 'ghee', english: 'Ghee', label: 'stapleGhee', group: 'Dairy', main: true },
  { key: 'butter', english: 'Butter', label: 'stapleButter', group: 'Dairy', main: true },
  { key: 'coconut', english: 'Coconut', label: 'stapleCoconut', group: 'Dairy', main: true },

  { key: 'chicken', english: 'Chicken', label: 'stapleChicken', group: 'Meat & fish', main: true },
  { key: 'beef', english: 'Beef', label: 'stapleBeef', group: 'Meat & fish', main: true },
  { key: 'pork', english: 'Pork', label: 'staplePork', group: 'Meat & fish', main: true },
  { key: 'lamb', english: 'Lamb', label: 'stapleLamb', group: 'Meat & fish', main: true },
  { key: 'goat', english: 'Goat', label: 'stapleGoat', group: 'Meat & fish', main: true },
  { key: 'fish', english: 'Fish', label: 'stapleFish', group: 'Meat & fish', main: true },
  { key: 'prawn', english: 'Prawns', label: 'staplePrawn', group: 'Meat & fish', main: true },
  { key: 'egg', english: 'Eggs', label: 'stapleEgg', group: 'Meat & fish', main: true },

  { key: 'onion', english: 'Onion', label: 'stapleOnion', group: 'Aromatics', main: false },
  { key: 'garlic', english: 'Garlic', label: 'stapleGarlic', group: 'Aromatics', main: false },
  { key: 'ginger', english: 'Ginger', label: 'stapleGinger', group: 'Aromatics', main: false },
  { key: 'chilli', english: 'Chilli', label: 'stapleChilli', group: 'Aromatics', main: false },
  { key: 'tomato', english: 'Tomato', label: 'stapleTomato', group: 'Vegetables', main: true },
  { key: 'lemongrass', english: 'Lemongrass', label: 'stapleLemongrass', group: 'Aromatics', main: false },
  { key: 'aubergine', english: 'Aubergine', label: 'stapleAubergine', group: 'Vegetables', main: true },
  { key: 'cabbage', english: 'Cabbage', label: 'stapleCabbage', group: 'Vegetables', main: true },
  { key: 'spinach', english: 'Spinach', label: 'stapleSpinach', group: 'Vegetables', main: true },
  { key: 'okra', english: 'Okra', label: 'stapleOkra', group: 'Vegetables', main: true },

  { key: 'tamarind', english: 'Tamarind', label: 'stapleTamarind', group: 'Sweet & sour', main: false },
  { key: 'honey', english: 'Honey', label: 'stapleHoney', group: 'Sweet & sour', main: false },
  { key: 'jaggery', english: 'Jaggery', label: 'stapleJaggery', group: 'Sweet & sour', main: false },
  { key: 'date', english: 'Dates', label: 'stapleDate', group: 'Sweet & sour', main: false },
  { key: 'lemon', english: 'Lemon', label: 'stapleLemon', group: 'Sweet & sour', main: false },
  { key: 'olive', english: 'Olive', label: 'stapleOlive', group: 'Sweet & sour', main: false },
] as const;

export const stapleByKey = (key: string): Staple | undefined =>
  STAPLES.find((staple) => staple.key === key);

export const STAPLE_GROUPS: readonly StapleGroup[] = [
  'Grains',
  'Roots',
  'Pulses',
  'Dairy',
  'Meat & fish',
  'Vegetables',
  'Aromatics',
  'Sweet & sour',
];

/** The staples a reader plans a meal around. What the pantry search is restricted to. */
export const MAIN_STAPLES: readonly Staple[] = STAPLES.filter((s) => s.main);

/**
 * The staple a reader's word refers to, if it is one we match on.
 *
 * Resolves through the same synonyms the pantry uses, so "eggplant" finds aubergine and
 * "garbanzo" finds chickpeas. Returns nothing for a spice, and nothing for a word the
 * vocabulary has never heard of — the caller reports those differently, because "cumin"
 * and "qwerty" are different kinds of unanswerable.
 */
export function resolveStaple(term: string, mainOnly = true): Staple | undefined {
  const list = mainOnly ? MAIN_STAPLES : STAPLES;
  const wanted = synonymsOf(term);
  return list.find((staple) => {
    const names = [staple.key, staple.english].flatMap((n) => synonymsOf(n));
    return names.some((name) => wanted.includes(name));
  });
}

/**
 * Which staples a dish is built on.
 *
 * Matching delegated to `dishHas`, so "1 whole chicken, jointed" counts as chicken and
 * "dépanner" does not count as paneer. A record with nothing recorded returns nothing,
 * which is correct and is not the same as a record that uses nothing.
 */
export const staplesIn = (dish: Dish): Staple[] =>
  STAPLES.filter((staple) => dishHas(dish, staple.key));

/**
 * How many records use each staple, for offering the vocabulary in a useful order.
 *
 * A full pass over the catalogue, so callers should do it once and keep the result
 * rather than calling it per render — 17,828 records against fifty terms is fifty
 * regex tests per record.
 */
export function stapleCounts(dishes: Dish[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const staple of STAPLES) counts.set(staple.key, 0);

  for (const dish of dishes) {
    if (!dish.ingredients.length) continue;
    for (const staple of STAPLES) {
      if (dishHas(dish, staple.key)) counts.set(staple.key, (counts.get(staple.key) ?? 0) + 1);
    }
  }
  return counts;
}

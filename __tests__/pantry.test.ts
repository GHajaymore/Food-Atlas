/**
 * "I have chicken — what can I make?"
 *
 * The tests are mostly about the two things that separate this from ordinary search:
 * it matches ingredients and never names, and it says which terms it could not find.
 */

import { cookWith, dishHas, parsePantry, synonymsOf } from '../src/domain/pantry';
import type { Dish } from '../src/domain/types';

const dish = (over: Partial<Dish> & { id: number }): Dish =>
  ({
    name: `Dish ${over.id}`,
    ingredients: [],
    steps: [],
    score: 20,
    ...over,
  }) as unknown as Dish;

describe('finding an ingredient in recipe text', () => {
  test('finds a word inside a quantity, which is what recipe lines look like', () => {
    const d = dish({ id: 1, ingredients: ['1 whole chicken, jointed', '½ teaspoon salt'] });
    expect(dishHas(d, 'chicken')).toBe(true);
    expect(dishHas(d, 'salt')).toBe(true);
  });

  test('ignores case and accents', () => {
    expect(dishHas(dish({ id: 1, ingredients: ['Chicken Thighs'] }), 'chicken')).toBe(true);
    expect(dishHas(dish({ id: 1, ingredients: ['Jalapeño'] }), 'jalapeno')).toBe(true);
  });

  test('looks for the reader’s term inside the record, not the reverse', () => {
    // Otherwise a one-letter term matches the entire atlas.
    const d = dish({ id: 1, ingredients: ['chicken'] });
    expect(dishHas(d, 'a')).toBe(false);
    expect(dishHas(d, 'chicken thighs marinated overnight')).toBe(false);
  });

  test('a dish with no ingredients recorded matches nothing', () => {
    expect(dishHas(dish({ id: 1 }), 'chicken')).toBe(false);
  });

  test('finds a plural, because recipe text is written in plurals', () => {
    expect(dishHas(dish({ id: 1, ingredients: ['3 tomatoes, chopped'] }), 'tomato')).toBe(true);
    expect(dishHas(dish({ id: 2, ingredients: ['red lentils'] }), 'lentil')).toBe(true);
  });

  test('does NOT match a word that merely contains the term', () => {
    /*
     * The real one. A French brioche came back for "paneer" because its ingredients
     * include "se dépanner avec de la levure de boulanger" — and "dépanner" contains
     * "panner". Right vocabulary, wrong subject, which is this codebase's commonest bug.
     */
    const fouace = dish({
      id: 1,
      ingredients: ['levain (à défaut, se dépanner avec de la levure de boulanger),', '6 œufs,'],
    });
    expect(dishHas(fouace, 'paneer')).toBe(false);
    expect(dishHas(fouace, 'egg')).toBe(false);
  });

  test('a bracket in the term finds nothing rather than throwing', () => {
    expect(dishHas(dish({ id: 1, ingredients: ['chicken'] }), 'chick(en')).toBe(false);
  });
});

describe('the same ingredient under another name', () => {
  test('British and American names find each other', () => {
    const d = dish({ id: 1, ingredients: ['2 aubergines'] });
    expect(dishHas(d, 'eggplant')).toBe(true);
    expect(dishHas(dish({ id: 2, ingredients: ['Cilantro'] }), 'coriander')).toBe(true);
  });

  test('paneer spellings do not split the results', () => {
    expect(dishHas(dish({ id: 1, ingredients: ['200g panir'] }), 'paneer')).toBe(true);
  });

  test('works in both directions', () => {
    expect(synonymsOf('ghee')).toContain('clarified butter');
    expect(synonymsOf('clarified butter')).toContain('ghee');
  });

  test('a term with no synonyms is just itself', () => {
    expect(synonymsOf('tofu')).toEqual(['tofu']);
  });
});

describe('reading what somebody typed', () => {
  test('splits on commas, "and", and newlines alike', () => {
    expect(parsePantry('chicken, tomatoes and rice')).toEqual(['chicken', 'tomatoes', 'rice']);
    expect(parsePantry('chicken\nrice')).toEqual(['chicken', 'rice']);
  });

  test('drops repeats and stray fragments', () => {
    expect(parsePantry('chicken, Chicken , x')).toEqual(['chicken']);
  });

  test('nothing usable gives nothing', () => {
    expect(parsePantry('   ')).toEqual([]);
    expect(cookWith([dish({ id: 1, ingredients: ['chicken'] })], [])).toEqual({ matches: [], missing: [] });
  });
});

describe('what can be made', () => {
  const chickenRice = dish({ id: 1, ingredients: ['chicken', 'rice'], steps: ['cook'] });
  const chickenOnly = dish({ id: 2, ingredients: ['chicken', 'butter'], steps: ['cook'] });
  const riceOnly = dish({ id: 3, ingredients: ['rice'] });
  const neither = dish({ id: 4, ingredients: ['lentils'] });

  test('a dish using more of the pantry ranks higher', () => {
    const { matches } = cookWith([chickenOnly, riceOnly, chickenRice], ['chicken', 'rice']);
    expect(matches[0].dish.id).toBe(1);
    expect(matches[0].used).toEqual(['chicken', 'rice']);
  });

  test('any match, not all — six ingredients should not return nothing', () => {
    const { matches } = cookWith([chickenOnly, neither], ['chicken', 'rice', 'saffron']);
    expect(matches.map((m) => m.dish.id)).toEqual([2]);
  });

  test('says which terms nothing uses, rather than dropping them silently', () => {
    const { missing } = cookWith([chickenOnly], ['chicken', 'gochujang']);
    expect(missing).toEqual(['gochujang']);
  });

  test('a dish with a recorded method beats one without, all else equal', () => {
    // riceOnly has no steps; a rice dish that can actually be cooked should come first.
    const cookableRice = dish({ id: 5, ingredients: ['rice'], steps: ['boil'] });
    const { matches } = cookWith([riceOnly, cookableRice], ['rice']);
    expect(matches[0].dish.id).toBe(5);
  });

  test('never matches on the dish’s name — the reader said what they have, not what they want', () => {
    const named = dish({ id: 6, name: 'Chicken Tikka Masala', ingredients: ['yoghurt', 'spices'] });
    expect(cookWith([named], ['chicken']).matches).toEqual([]);
  });

  test('respects the limit', () => {
    const many = Array.from({ length: 80 }, (_, i) => dish({ id: i + 10, ingredients: ['rice'] }));
    expect(cookWith(many, ['rice']).matches).toHaveLength(60);
    expect(cookWith(many, ['rice'], 5).matches).toHaveLength(5);
  });
});

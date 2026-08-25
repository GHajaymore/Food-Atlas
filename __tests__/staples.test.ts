/**
 * The staple vocabulary.
 *
 * Mostly guarding the properties that make a curated list better than a derived one:
 * it must be global, it must not contain the ingredients that are everywhere, and it
 * must match through the same rules the pantry search uses.
 */

import { STAPLES, STAPLE_GROUPS, stapleByKey, stapleCounts, staplesIn } from '../src/domain/staples';
import type { Dish } from '../src/domain/types';

const dish = (ingredients: string[]): Dish => ({ id: 1, ingredients } as unknown as Dish);

describe('the vocabulary itself', () => {
  test('keys are unique — a duplicate would double-count a dish', () => {
    expect(new Set(STAPLES.map((s) => s.key)).size).toBe(STAPLES.length);
  });

  test('every staple belongs to a declared group', () => {
    for (const staple of STAPLES) expect(STAPLE_GROUPS).toContain(staple.group);
  });

  test('excludes the ingredients that are everywhere and sort nothing', () => {
    // The whole reason this is curated rather than counted.
    for (const universal of ['salt', 'sugar', 'water', 'oil', 'pepper', 'flour']) {
      expect(STAPLES.map((s) => s.key)).not.toContain(universal);
    }
  });

  test('reaches beyond a European kitchen', () => {
    const keys = STAPLES.map((s) => s.key);
    for (const global of ['teff', 'cassava', 'plantain', 'millet', 'sorghum', 'taro', 'paneer', 'jaggery', 'tamarind']) {
      expect(keys).toContain(global);
    }
  });

  test('is small enough for a person to check', () => {
    expect(STAPLES.length).toBeLessThanOrEqual(60);
  });
});

describe('what a dish is built on', () => {
  test('finds a staple inside recipe text', () => {
    expect(staplesIn(dish(['500g basmati rice', '2 onions'])).map((s) => s.key)).toEqual(
      expect.arrayContaining(['rice', 'onion']),
    );
  });

  test('uses the pantry matcher, so synonyms and word rules carry over', () => {
    expect(staplesIn(dish(['1 eggplant'])).map((s) => s.key)).toContain('aubergine');
    // "dépanner" must not count as paneer — the bug the pantry rule was written for.
    expect(staplesIn(dish(['se dépanner avec de la levure'])).map((s) => s.key)).not.toContain('paneer');
  });

  test('a record with nothing recorded uses nothing', () => {
    expect(staplesIn(dish([]))).toEqual([]);
  });

  test('a lookup by key round-trips', () => {
    expect(stapleByKey('rice')?.english).toBe('Rice');
    expect(stapleByKey('rice')?.label).toBe('stapleRice');
    expect(stapleByKey('nonsense')).toBeUndefined();
  });
});

describe('counting across a catalogue', () => {
  test('reports every staple, including the ones nothing uses', () => {
    const counts = stapleCounts([dish(['rice'])]);
    expect(counts.get('rice')).toBe(1);
    expect(counts.get('teff')).toBe(0);
    expect(counts.size).toBe(STAPLES.length);
  });

  test('counts a dish once per staple, not once per mention', () => {
    expect(stapleCounts([dish(['rice', 'rice flour', 'more rice'])]).get('rice')).toBe(1);
  });
});

/**
 * A filter is offered only when enough records are classified for it to answer anything.
 *
 * Measured on the shipped catalogue: diet is recorded for 6 of 17,358 records and meal
 * occasion for the same 6, so a reader choosing Vegan was shown two dishes and took the
 * atlas to hold two vegan dishes. These tests hold the rule, and hold it against the
 * catalogue as it ships — the day classification lands, the last test is the one to change.
 */

import { catalogue } from './catalogue';
import {
  MIN_CLASSIFIED_SHARE,
  classifiedShare,
  offersDietFilter,
  offersMealFilter,
} from '../src/domain/classification';
import type { Dish } from '../src/domain/types';

const dish = (classified: boolean): Dish =>
  ({
    diet: { group: classified ? 'vegan' : 'unclassified' },
    meals: { occasions: classified ? ['snack'] : [] },
  }) as unknown as Dish;

describe('a filter needs something underneath it', () => {
  test('is offered once one record in twenty is classified', () => {
    const enough = [...Array(5).fill(dish(true)), ...Array(95).fill(dish(false))];
    expect(classifiedShare(enough).diet).toBe(MIN_CLASSIFIED_SHARE);
    expect(offersDietFilter(enough)).toBe(true);
    expect(offersMealFilter(enough)).toBe(true);
  });

  test('is withheld below that', () => {
    const thin = [...Array(4).fill(dish(true)), ...Array(96).fill(dish(false))];
    expect(offersDietFilter(thin)).toBe(false);
    expect(offersMealFilter(thin)).toBe(false);
  });

  test('says nothing about an empty catalogue', () => {
    expect(offersDietFilter([])).toBe(false);
  });

  /* The catalogue as shipped: the curated handful, nothing more. */
  test('is withheld on the catalogue that ships today', () => {
    expect(offersDietFilter(catalogue)).toBe(false);
    expect(offersMealFilter(catalogue)).toBe(false);
  });
});

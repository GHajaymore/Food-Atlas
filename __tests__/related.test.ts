/**
 * Related dishes.
 *
 * The tests are mostly about the reason, because a suggestion without one is a
 * recommendation and this app has no basis for making those.
 */

import { EN } from '../src/i18n/copy';
import { relatedTo } from '../src/domain/related';
import type { Dish } from '../src/domain/types';

const dish = (over: Partial<Dish> & { id: number }): Dish =>
  ({
    name: `Dish ${over.id}`,
    category: 'Unclassified',
    loc: { country: '', region: '', province: '', city: '', village: '' },
    ingredients: [],
    score: 20,
    ...over,
  }) as unknown as Dish;

const KERALA = { country: 'India', region: 'Kerala', province: '', city: '', village: '' };
const PUNJAB = { country: 'India', region: 'Punjab', province: '', city: '', village: '' };
const KANSAI = { country: 'Japan', region: 'Kansai', province: '', city: '', village: '' };

describe('what counts as related', () => {
  const subject = dish({ id: 1, loc: KERALA, ingredients: ['ghee', 'jaggery'], cuisine: 'Malayali' });

  test('a record sharing nothing is not offered at all', () => {
    const unrelated = dish({ id: 2, loc: KANSAI, ingredients: ['dashi'] });
    expect(relatedTo(EN, subject, [unrelated])).toEqual([]);
  });

  test('the dish itself is never related to itself', () => {
    expect(relatedTo(EN, subject, [subject])).toEqual([]);
  });

  test('a region beats a country, because far fewer records share one', () => {
    const sameRegion = dish({ id: 2, loc: KERALA });
    const sameCountry = dish({ id: 3, loc: PUNJAB });
    const [first] = relatedTo(EN, subject, [sameCountry, sameRegion]);
    expect(first.dish.id).toBe(2);
    expect(first.reason).toBe('Also from Kerala');
  });

  test('matching on several counts outranks matching on one strong signal', () => {
    const regionOnly = dish({ id: 2, loc: KERALA });
    const regionAndIngredients = dish({ id: 3, loc: KERALA, ingredients: ['ghee', 'jaggery'] });
    expect(relatedTo(EN, subject, [regionOnly, regionAndIngredients])[0].dish.id).toBe(3);
  });
});

describe('the reason', () => {
  const subject = dish({ id: 1, loc: KERALA, ingredients: ['ghee'], category: 'Sweet' });

  test('every suggestion carries one', () => {
    const results = relatedTo(EN, subject, [
      dish({ id: 2, loc: KERALA }),
      dish({ id: 3, ingredients: ['ghee'] }),
      dish({ id: 4, loc: PUNJAB }),
    ]);
    expect(results).toHaveLength(3);
    for (const r of results) expect(r.reason.trim()).not.toBe('');
  });

  test('names the strongest signal, not the first one tested', () => {
    // Shares country, category and region — the region is what is worth saying.
    const other = dish({ id: 2, loc: KERALA, category: 'Sweet' });
    expect(relatedTo(EN, subject, [other])[0].reason).toBe('Also from Kerala');
  });

  test('names a single shared ingredient, and counts several', () => {
    const one = dish({ id: 2, ingredients: ['ghee'] });
    const many = dish({ id: 3, ingredients: ['ghee', 'jaggery', 'cardamom'] });
    const subjectMany = dish({ id: 1, ingredients: ['ghee', 'jaggery', 'cardamom'] });
    expect(relatedTo(EN, subject, [one])[0].reason).toBe('Also uses ghee');
    expect(relatedTo(EN, subjectMany, [many])[0].reason).toBe('Shares 3 ingredients');
  });

  test('matches an ingredient case-insensitively but reports the other record’s spelling', () => {
    const other = dish({ id: 2, ingredients: ['Ghee'] });
    expect(relatedTo(EN, subject, [other])[0].reason).toBe('Also uses Ghee');
  });

  test('does not offer "also Unclassified" as a reason', () => {
    const plain = dish({ id: 1, loc: KERALA, category: 'Unclassified' });
    const other = dish({ id: 2, loc: PUNJAB, category: 'Unclassified' });
    // Shares only the country, so that is what it must say.
    expect(relatedTo(EN, plain, [other])[0].reason).toBe('Also from India');
  });
});

describe('ordering and limits', () => {
  test('ties break toward the better-documented record', () => {
    const subject = dish({ id: 1, loc: KERALA });
    const thin = dish({ id: 2, loc: KERALA, score: 12 });
    const fuller = dish({ id: 3, loc: KERALA, score: 58 });
    expect(relatedTo(EN, subject, [thin, fuller])[0].dish.id).toBe(3);
  });

  test('respects the limit', () => {
    const subject = dish({ id: 1, loc: KERALA });
    const many = Array.from({ length: 30 }, (_, i) => dish({ id: i + 2, loc: KERALA }));
    expect(relatedTo(EN, subject, many)).toHaveLength(8);
    expect(relatedTo(EN, subject, many, 3)).toHaveLength(3);
  });

  test('an empty place does not relate every unplaced record to every other', () => {
    const nowhere = dish({ id: 1 });
    const alsoNowhere = dish({ id: 2 });
    expect(relatedTo(EN, nowhere, [alsoNowhere])).toEqual([]);
  });
});

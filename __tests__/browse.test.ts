/**
 * Browse — a filtered view of the atlas described by a URL.
 *
 * The tests that matter are about a URL being untrusted input. The failure this guards
 * against is not a crash: it is a page that quietly shows everything while its heading
 * says it is showing one country.
 */

import {
  browse,
  describe as describeQuery,
  hrefFor,
  isNarrowed,
  levelOf,
  parseBrowse,
  pathOf,
} from '../src/domain/browse';
import type { Dish } from '../src/domain/types';

const dish = (over: Partial<Dish>): Dish =>
  ({
    id: 1,
    name: 'Test',
    category: 'Sweet',
    diet: {},
    meals: {},
    loc: { country: 'India', region: 'Kerala', province: '', city: '', village: '' },
    breadcrumb: ['India', 'Kerala'],
    badgeLevel: 'unverified',
    ingredients: [],
    equipment: [],
    steps: [],
    prepSummary: '',
    heritage: [],
    sources: [],
    score: 20,
    ...over,
  }) as unknown as Dish;

describe('parsing a URL', () => {
  test('reads the facets it knows and ignores the rest', () => {
    const q = parseBrowse({ country: 'India', region: 'Kerala', nonsense: 'x', level: 'authentic' });
    expect(q).toEqual({
      country: 'India',
      region: 'Kerala',
      level: 'authentic',
      category: undefined,
      cuisine: undefined,
      ingredient: undefined,
      q: undefined,
    });
  });

  test('a repeated parameter arrives as an array and takes the first', () => {
    expect(parseBrowse({ country: ['India', 'Japan'] }).country).toBe('India');
  });

  test('blank and whitespace values are absent, not empty filters', () => {
    const q = parseBrowse({ country: '   ', cuisine: '' });
    expect(q.country).toBeUndefined();
    expect(q.cuisine).toBeUndefined();
  });

  test('a very long value is capped rather than passed through', () => {
    expect(parseBrowse({ q: 'x'.repeat(500) }).q).toHaveLength(80);
  });
});

describe('an unrecognised level shows the atlas, not an empty page', () => {
  test('falls back to all', () => {
    expect(levelOf({ level: 'nonsense' })).toBe('all');
    expect(levelOf({})).toBe('all');
    expect(levelOf({ level: 'authentic' })).toBe('authentic');
  });

  test('and the heading stops claiming it', () => {
    // The failure this guards: a page filtered to nothing, headed as if it were filtered.
    expect(describeQuery({ level: 'nonsense', country: 'India' })).toBe('India');
  });
});

describe('the heading is built from what was applied', () => {
  test('names the place, the tradition and the ingredient', () => {
    expect(describeQuery({ country: 'India', region: 'Kerala' })).toBe('Kerala, India');
    expect(describeQuery({ cuisine: 'Tamil' })).toBe('Tamil cuisine');
    expect(describeQuery({ ingredient: 'ghee', country: 'India' })).toBe('made with ghee — India');
  });

  test('an empty query is honest about being everything', () => {
    expect(describeQuery({})).toBe('Everything');
    expect(isNarrowed({})).toBe(false);
    expect(isNarrowed({ country: 'India' })).toBe(true);
  });
});

describe('running the query', () => {
  const dishes = [
    dish({ id: 1, loc: { country: 'India', region: 'Kerala', province: '', city: '', village: '' }, ingredients: ['ghee'], cuisine: 'Malayali' }),
    dish({ id: 2, loc: { country: 'India', region: 'Punjab', province: '', city: '', village: '' }, ingredients: ['butter'] }),
    dish({ id: 3, loc: { country: 'Japan', region: 'Kansai', province: '', city: '', village: '' }, ingredients: ['dashi'] }),
  ];

  test('narrows by country', () => {
    expect(browse(dishes, { country: 'India' }).map((d) => d.id).sort()).toEqual([1, 2]);
  });

  test('narrows by region within a country', () => {
    expect(browse(dishes, { country: 'India', region: 'Kerala' }).map((d) => d.id)).toEqual([1]);
  });

  test('narrows by ingredient', () => {
    expect(browse(dishes, { ingredient: 'ghee' }).map((d) => d.id)).toEqual([1]);
  });

  test('ANDs across groups — a country and an ingredient that do not meet is empty', () => {
    expect(browse(dishes, { country: 'Japan', ingredient: 'ghee' })).toEqual([]);
  });

  test('an empty query is the whole atlas', () => {
    expect(browse(dishes, {})).toHaveLength(3);
  });
});

describe('links', () => {
  test('round-trip: what hrefFor writes, parseBrowse reads', () => {
    const original = { country: 'India', ingredient: 'ghee' };
    const href = hrefFor(original);
    const params = Object.fromEntries(new URLSearchParams(href.split('?')[1]));
    expect(parseBrowse(params).country).toBe('India');
    expect(parseBrowse(params).ingredient).toBe('ghee');
  });

  test('encodes values that would otherwise change meaning', () => {
    const href = hrefFor({ cuisine: "Côte d'Ivoire", ingredient: 'olive oil' });
    expect(href).not.toContain(' ');
    const params = Object.fromEntries(new URLSearchParams(href.split('?')[1]));
    expect(parseBrowse(params).cuisine).toBe("Côte d'Ivoire");
    expect(parseBrowse(params).ingredient).toBe('olive oil');
  });

  test('an empty query links to the unfiltered page rather than a stray question mark', () => {
    expect(hrefFor({})).toBe('/browse');
  });

  test('omits absent facets rather than sending empties', () => {
    expect(hrefFor({ country: 'India', cuisine: undefined })).toBe('/browse?country=India');
  });
});

describe('the place path', () => {
  test('country then region, coarse to fine', () => {
    expect(pathOf({ country: 'India', region: 'Kerala' })).toEqual([
      { level: 'country', value: 'India' },
      { level: 'region', value: 'Kerala' },
    ]);
  });

  test('a region with no country is still a region', () => {
    expect(pathOf({ region: 'Kerala' })).toEqual([{ level: 'region', value: 'Kerala' }]);
  });
});

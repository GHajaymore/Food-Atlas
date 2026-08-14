/**
 * Domain tests.
 *
 * These cover the rules the product cannot afford to get wrong — the ones that would
 * mislabel a tradition rather than merely look wrong. The UI is deliberately absent
 * here: every rule below is enforced in the data layer, so it can be tested without
 * a renderer and stays true when the screens change.
 */

import { dishes } from '../src/data/seed';
import { CLASSIFICATIONS, FILTERS, isAuthentic, viewsNumber } from '../src/domain/authenticity';
import { assess } from '../src/domain/assess';
import { dietLabel, traceLabels } from '../src/domain/diet';
import { findCatalogueViolations, findViolations } from '../src/domain/invariants';
import { catalogueMetrics, trendFor } from '../src/domain/metrics';
import { planTranslation, withLanguage } from '../src/domain/language';
import {
  allCuisines,
  allIngredients,
  buildAtlas,
  feedFor,
  mostPopular,
  nextLevel,
  placeGroups,
  searchResults,
} from '../src/domain/queries';
import {
  forkedDisputes,
  isDisputed,
  ORIGIN_DISCLAIMER,
  originAffectsScore,
  routeDispute,
  siblingsOf,
} from '../src/domain/traditions';
import { readDish } from '../src/domain/translate';
import { assertPreserved, buildPrompt, preservedTerms } from '../src/domain/translationProvider';
import type { Dish, DishTranslation } from '../src/domain/types';
import { thumbnailUrl, watchUrl } from '../src/domain/video';
import { isAcceptable, needsDiscovery, searchQuery, searchUrl } from '../src/domain/videoDiscovery';

const byId = (id: number) => dishes.find((d) => d.id === id)!;
const halwa = () => byId(1);
const mole = () => byId(2);
const pizza = () => byId(3);
const hawaiian = () => byId(4);
/** The Thalassery fork of the Malabar halwa — sibling of `halwa()`. */
const thalassery = () => byId(7);

describe('the catalogue holds to the brief', () => {
  it('admits no record that breaks a hard rule', () => {
    for (const dish of dishes) {
      expect({ dish: dish.name, violations: findViolations(dish) }).toEqual({
        dish: dish.name,
        violations: [],
      });
    }
  });

  it('never lets a modern substitute into an authentic ingredient list', () => {
    for (const dish of dishes) {
      if (!dish.adaptation) continue;
      const substitute = dish.adaptation.substitute.toLowerCase();
      for (const ingredient of dish.ingredients) {
        expect(substitute.includes(ingredient.toLowerCase()) && ingredient.length > 3).toBe(false);
      }
    }
  });

  it('rejects a record that merges the substitute into the traditional ingredients', () => {
    const corrupted: Dish = {
      ...pizza(),
      // The adaptation's substitute smuggled into the authentic list.
      ingredients: [...pizza().ingredients, 'Home or electric ovens'],
      adaptation: { traditional: 'Wood-fired oven reaching 430°C+.', substitute: 'Home or electric ovens, common outside Naples.' },
    };
    expect(findViolations(corrupted).join(' ')).toMatch(/No Silent Customization/);
  });
});

describe('fusion is never presented as authentic', () => {
  it('carries no score, no method and no equipment', () => {
    const dish = hawaiian();
    expect(dish.badgeLevel).toBe('fusion');
    expect(dish.score).toBeNull();
    expect(dish.steps).toHaveLength(0);
    expect(dish.equipment).toHaveLength(0);
    expect(dish.videos).toHaveLength(0);
  });

  it('links back to the tradition it borrows from', () => {
    expect(hawaiian().relatedId).toBe(pizza().id);
    expect(isAuthentic(pizza().badgeLevel)).toBe(true);
  });

  it('rejects a fusion record that was given a score', () => {
    const scored: Dish = { ...hawaiian(), score: 80 };
    expect(findViolations(scored).join(' ')).toMatch(/fusion records are not scored/);
  });

  it('is excluded from the Authentic Only filter', () => {
    const authentic = feedFor(dishes, 'authentic', []);
    expect(authentic.map((d) => d.id)).not.toContain(hawaiian().id);
    expect(authentic.every((d) => isAuthentic(d.badgeLevel))).toBe(true);
  });

  it('is reachable through its own filter', () => {
    expect(feedFor(dishes, 'fusion', []).map((d) => d.id)).toEqual([hawaiian().id]);
  });
});

describe('popularity and authenticity stay separate', () => {
  it('ranks the popularity rail by views alone, ignoring classification', () => {
    // The most-viewed record in the catalogue is the fusion invention. That is the
    // point of the rail, and the copy underneath it says so.
    expect(mostPopular(dishes)[0].id).toBe(hawaiian().id);
  });

  it('does not let views influence the default search ordering', () => {
    const byAuthenticity = searchResults(dishes, {
      query: '',
      levels: [],
      categories: [],
      ingredients: [],
      sortBy: 'authenticity',
    });
    const scores = byAuthenticity.map((d) => d.score ?? 0);
    expect([...scores]).toEqual([...scores].sort((a, b) => b - a));
    expect(byAuthenticity[0].id).toBe(halwa().id); // 94, on 3,400 views
  });

  it('orders by views only when popularity is explicitly chosen', () => {
    const byViews = searchResults(dishes, {
      query: '',
      levels: [],
      categories: [],
      ingredients: [],
      sortBy: 'popularity',
    });
    expect(byViews[0].id).toBe(hawaiian().id);
  });

  it('puts at-risk traditions first when asked', () => {
    const atRisk = searchResults(dishes, {
      query: '',
      levels: [],
      categories: [],
      ingredients: [],
      sortBy: 'atrisk',
    });
    expect(atRisk.slice(0, 2).every((d) => d.atRisk)).toBe(true);
  });

  it('parses view counts for sorting without mixing them into the score', () => {
    expect(viewsNumber('2.1M views')).toBe(2_100_000);
    expect(viewsNumber('3,400 views')).toBe(3400);
    expect(viewsNumber('')).toBe(0);
  });
});

describe('videos are ranked by locality, not views', () => {
  it('numbers every video 1..n in locality order', () => {
    for (const dish of dishes) {
      expect(dish.videos.map((v) => v.rank)).toEqual(dish.videos.map((_, i) => i + 1));
    }
  });

  it('stores no engagement figure on any video', () => {
    for (const dish of dishes) {
      for (const video of dish.videos) {
        expect(Object.keys(video)).not.toContain('views');
      }
    }
  });

  it('rejects a video list reordered by something other than locality', () => {
    const reordered: Dish = {
      ...pizza(),
      videos: [pizza().videos[1], pizza().videos[0]],
    };
    expect(findViolations(reordered).join(' ')).toMatch(/Local-First Video Ranking/);
  });

  it('plays at source, never proxied or embedded', () => {
    const video = pizza().videos[0];
    expect(watchUrl(video)).toBe(`https://www.youtube.com/watch?v=${video.id}`);
    expect(thumbnailUrl(video)).toContain('img.youtube.com');
  });

  it('uses the shorts URL for a short', () => {
    const short = byId(6).videos.find((v) => v.short)!;
    expect(watchUrl(short)).toContain('/shorts/');
  });
});

describe('the geographic drill-down', () => {
  it('offers countries first, counted against the active filter', () => {
    const next = nextLevel([], feedFor(dishes, 'authentic', []));
    expect(next?.key).toBe('country');
    // Canada holds only the fusion record, so Authentic Only must not offer it.
    expect(next?.options.map((o) => o.label)).not.toContain('Canada');
  });

  it('skips levels that do not apply, so Italy goes country to region to city', () => {
    const path = [{ level: 'region' as const, value: 'Campania' }];
    const next = nextLevel(path, feedFor(dishes, 'authentic', path));
    expect(next?.key).toBe('city');
    expect(next?.options.map((o) => o.label)).toEqual(['Naples']);
  });

  it('reports no deeper level once the path bottoms out', () => {
    const path = [
      { level: 'country' as const, value: 'Italy' },
      { level: 'region' as const, value: 'Campania' },
      { level: 'city' as const, value: 'Naples' },
    ];
    expect(nextLevel(path, feedFor(dishes, 'authentic', path))).toBeNull();
  });

  it('never offers a place the active filter cannot show', () => {
    const next = nextLevel([], feedFor(dishes, 'authentic', []));
    for (const option of next!.options ?? []) {
      const path = [{ level: 'country' as const, value: option.label }];
      expect(feedFor(dishes, 'authentic', path).length).toBe(option.count);
      expect(option.count).toBeGreaterThan(0);
    }
  });

  it('groups countries by continent at the top level only', () => {
    const top = nextLevel([], dishes);
    expect(placeGroups(top, '', true).map((g) => g.label)).toEqual(['Asia', 'Europe', 'North America']);
    expect(placeGroups(top, '', false)[0].showLabel).toBe(false);
  });

  it('filters the place list by substring', () => {
    const top = nextLevel([], dishes);
    const groups = placeGroups(top, 'ital', true);
    expect(groups.flatMap((g) => g.options).map((o) => o.label)).toEqual(['Italy']);
  });
});

describe('search', () => {
  const base = { query: '', levels: [], categories: [], ingredients: [], sortBy: 'authenticity' as const };

  it('matches on ingredient and on equipment, not just the name', () => {
    expect(searchResults(dishes, { ...base, query: 'metate' }).map((d) => d.id)).toEqual([mole().id]);
    // Both Malabar halwas use coconut oil — the fork shares its ingredients.
    expect(searchResults(dishes, { ...base, query: 'coconut oil' }).map((d) => d.id).sort()).toEqual(
      [halwa().id, thalassery().id].sort(),
    );
  });

  it('matches on any level of the geographic path', () => {
    expect(searchResults(dishes, { ...base, query: 'malabar' }).map((d) => d.id).sort()).toEqual(
      [halwa().id, thalassery().id].sort(),
    );
  });

  it('ANDs across facet groups', () => {
    const results = searchResults(dishes, { ...base, levels: ['local'], categories: ['Bread & baked'] });
    expect(results.map((d) => d.id)).toEqual([pizza().id]);
  });

  it('returns nothing rather than guessing when the query matches nothing', () => {
    expect(searchResults(dishes, { ...base, query: 'tiramisu' })).toEqual([]);
  });

  it('derives the ingredient facet from the traditional ingredients only', () => {
    const facets = allIngredients(dishes, 50);
    expect(facets).toContain('Chilhuacle negro chiles');
    // The substitute must never appear as a searchable traditional ingredient.
    expect(facets).not.toContain('Ancho or pasilla chiles');
  });
});

describe('the atlas states coverage honestly', () => {
  it('groups every country under a continent', () => {
    const atlas = buildAtlas(dishes);
    const countries = atlas.flatMap((g) => g.countries.map((c) => c.name));
    expect(new Set(countries)).toEqual(new Set(dishes.map((d) => d.loc.country)));
    expect(atlas.flatMap((g) => g.countries).reduce((n, c) => n + c.count, 0)).toBe(dishes.length);
  });
});

describe('classification vocabulary', () => {
  it('gives every level a glyph AND a text label, so colour is never the only cue', () => {
    for (const level of Object.values(CLASSIFICATIONS)) {
      expect(level.icon).not.toHaveLength(0);
      expect(level.label).not.toHaveLength(0);
    }
  });

  it('defaults discovery to Authentic Only', () => {
    expect(FILTERS[0].key).toBe('authentic');
  });
});

describe('an imported record earns its classification', () => {
  const base = {
    hasCountry: true,
    hasRegion: false,
    ingredients: [] as string[],
    heritage: [] as string[],
    hasArticle: false,
    extractLength: 0,
  };

  it('stays unscored when only a name and a place are known', () => {
    const a = assess(base);
    expect(a.level).toBe('unverified');
    expect(a.score).toBeNull();
    expect(a.breakdown).toEqual([]);
    expect(a.disclaimer).toMatch(/Only the name and the place are recorded/);
  });

  it('will not call a record authentic on an article alone', () => {
    const a = assess({ ...base, hasArticle: true, extractLength: 900 });
    expect(a.level).toBe('unverified');
    expect(a.score).toBeGreaterThan(0);
  });

  it('reaches Traditional Variation when ingredients and an article are documented', () => {
    const a = assess({ ...base, hasArticle: true, extractLength: 700, ingredients: ['rice', 'coconut'] });
    expect(a.level).toBe('variation');
    expect(a.disclaimer).toMatch(/no one from the place has confirmed it/);
  });

  it('reaches Authentic — Regional only with a heritage designation and ingredients', () => {
    const a = assess({ ...base, hasRegion: true, ingredients: ['pork', 'salt'], heritage: ['PDO'] });
    expect(a.level).toBe('regional');
    expect(a.disclaimer).toMatch(/does not establish the method/);
  });

  it('never infers technique or community validation', () => {
    const a = assess({ ...base, hasRegion: true, ingredients: ['a', 'b', 'c'], heritage: ['PGI'], hasArticle: true, extractLength: 2000 });
    const byName = Object.fromEntries(a.breakdown);
    expect(byName['Traditional technique']).toBe(0);
    expect(byName['Community validation']).toBe(0);
    expect(byName['Local source']).toBe(0);
  });

  it('caps an imported score below every assessed record in the seed', () => {
    const best = assess({
      ...base,
      hasRegion: true,
      ingredients: ['a', 'b', 'c', 'd'],
      heritage: ['PDO', 'PAT'],
      hasArticle: true,
      extractLength: 5000,
    });
    const lowestCurated = Math.min(...dishes.filter((d) => d.score !== null).map((d) => d.score!));
    expect(best.score).toBeLessThan(lowestCurated);
  });

  it('produces records that satisfy the catalogue invariants', () => {
    // A promoted record must still carry all six dimensions, a disclaimer and — via
    // the loader — a source. This is the check that stops a promotion from
    // producing a record the app would refuse to show.
    const a = assess({ ...base, hasRegion: true, ingredients: ['x', 'y'], heritage: ['PDO'] });
    expect(a.breakdown).toHaveLength(6);
    expect(a.disclaimer.trim().length).toBeGreaterThan(0);
  });
});

describe('discovered videos must be high-quality originals', () => {
  const ok = {
    id: 'x',
    title: 'How to make Kozhikode Halwa the traditional way',
    channel: 'A cook',
    views: '10,000 views',
    short: false,
    definition: 'hd',
    durationSeconds: 600,
  };

  it('accepts a full-length HD preparation', () => {
    expect(isAcceptable(ok)).toBe(true);
  });

  it('rejects shorts and clips, which are the most re-uploaded format', () => {
    expect(isAcceptable({ ...ok, short: true })).toBe(false);
    expect(isAcceptable({ ...ok, durationSeconds: 45 })).toBe(false);
  });

  it('rejects standard definition', () => {
    expect(isAcceptable({ ...ok, definition: 'sd' })).toBe(false);
  });

  it('rejects derivative uploads by title', () => {
    for (const bad of ['Top 10 Indian sweets', 'HALWA COMPILATION', 'My reaction to halwa', 'halwa asmr']) {
      expect(isAcceptable({ ...ok, title: bad })).toBe(false);
    }
  });

  it('rejects an hours-long stream rather than a method', () => {
    expect(isAcceptable({ ...ok, durationSeconds: 4 * 60 * 60 })).toBe(false);
  });

  it('builds a search that names the dish and its place', () => {
    const q = searchQuery(halwa());
    expect(q).toContain('Kozhikode Halwa');
    expect(q).toContain('Kozhikode');
    expect(q).toContain('traditional');
    expect(searchUrl(halwa())).toContain('youtube.com/results');
  });

  it('only offers discovery where no locality-ranked video exists', () => {
    expect(needsDiscovery(halwa())).toBe(false);
    expect(needsDiscovery(hawaiian())).toBe(true);
  });
});

describe('disagreement forks the record rather than picking a winner', () => {
  it('routes a challenge from a different place to a fork', () => {
    expect(routeDispute('Kozhikode', 'Thalassery', 'variation')).toBe('fork');
  });

  it('routes a challenge from the same place to adjudication, not a fork', () => {
    expect(routeDispute('Kozhikode', 'kozhikode', 'variation')).toBe('adjudicate');
  });

  it('never settles an origin claim by geography or by counting', () => {
    expect(routeDispute('Mongolia', 'Kazakhstan', 'origin')).toBe('attribute');
    expect(routeDispute('Mongolia', 'Mongolia', 'origin')).toBe('attribute');
    expect(originAffectsScore).toBe(false);
  });

  it('amends rather than forks when the record is simply wrong', () => {
    expect(routeDispute('Kozhikode', 'Kozhikode', 'correction')).toBe('amend');
  });

  it('keeps both accounts as peers, with neither marked canonical', () => {
    const siblings = siblingsOf(halwa(), dishes);
    expect(siblings.map((d) => d.id)).toEqual([thalassery().id]);
    // Symmetry is the point: neither record is the parent of the other.
    expect(siblingsOf(thalassery(), dishes).map((d) => d.id)).toEqual([halwa().id]);
    expect(halwa().traditionId).toBe(thalassery().traditionId);
  });

  it('gives the fork its own place and its own evidence', () => {
    expect(thalassery().loc.city).toBe('Thalassery');
    expect(halwa().loc.city).toBe('Kozhikode');
    expect(thalassery().score).not.toBe(halwa().score);
    expect(thalassery().breakdown).toHaveLength(6);
  });

  it('records what differed, so the fork is traceable to its cause', () => {
    expect(forkedDisputes(halwa())[0].differs).toMatch(/less sugar/i);
    expect(forkedDisputes(halwa())[0].resultingDishId).toBe(thalassery().id);
  });

  it('rejects a challenge with no substance — a bare downvote cannot fork a record', () => {
    const empty: Dish = {
      ...pizza(),
      disputes: [{ id: 'x', from: 'Rome', kind: 'variation', differs: '   ', raisedAt: '2026-01-01', status: 'open' }],
    };
    expect(findViolations(empty).join(' ')).toMatch(/states no substance/);
  });

  it('rejects a challenge that names no place, since routing depends on it', () => {
    const nowhere: Dish = {
      ...pizza(),
      disputes: [{ id: 'x', from: '', kind: 'variation', differs: 'less salt', raisedAt: '2026-01-01', status: 'open' }],
    };
    expect(findViolations(nowhere).join(' ')).toMatch(/names no place/);
  });

  it('requires a forked dispute to point at the record it produced', () => {
    const dangling: Dish = {
      ...pizza(),
      disputes: [{ id: 'x', from: 'Rome', kind: 'variation', differs: 'less salt', raisedAt: '2026-01-01', status: 'forked' }],
    };
    expect(findViolations(dangling).join(' ')).toMatch(/points at no sibling record/);
  });

  it('records contested origins with sources, and refuses to rank them', () => {
    const claims = byId(6).originClaims!;
    expect(claims.length).toBeGreaterThan(1);
    for (const claim of claims) expect(claim.source.url).toMatch(/^https?:\/\//);
    expect(ORIGIN_DISCLAIMER).toMatch(/No claim here is presented as the winner/);
  });

  it('rejects a single origin claim, which is not a dispute', () => {
    const lone: Dish = {
      ...pizza(),
      originClaims: [{ place: 'Naples', claim: 'Invented here.', source: pizza().sources[0] }],
    };
    expect(findViolations(lone).join(' ')).toMatch(/a single origin claim is not a dispute/);
  });

  it('supports any number of peers, not just two', () => {
    // A third and fourth tradition join exactly as the second did — the group is a
    // flat peer set, so nothing about the model caps it.
    const kannur: Dish = { ...thalassery(), id: 91, name: 'Kannur Halwa', loc: { ...thalassery().loc, city: 'Kannur' }, breadcrumb: ['India', 'Kerala', 'Malabar', 'Kannur'] };
    const kochi: Dish = { ...thalassery(), id: 92, name: 'Kochi Halwa', loc: { ...thalassery().loc, city: 'Kochi' }, breadcrumb: ['India', 'Kerala', 'Malabar', 'Kochi'] };
    const pool = [...dishes, kannur, kochi];

    expect(siblingsOf(halwa(), pool).map((d) => d.id).sort()).toEqual([thalassery().id, 91, 92].sort());
    expect(siblingsOf(kannur, pool)).toHaveLength(3);
    expect(findCatalogueViolations(pool)).toEqual([]);
  });

  it('rejects two peers claiming the same place — that is a conflict, not a plurality', () => {
    const duplicate: Dish = { ...thalassery(), id: 93, name: 'Thalassery Halwa (second account)' };
    expect(findCatalogueViolations([...dishes, duplicate]).join(' ')).toMatch(
      /both claim thalassery.*adjudicated, not forked/i,
    );
  });

  it('leaves an open dispute visible without touching the score', () => {
    const challenged: Dish = {
      ...pizza(),
      disputes: [{ id: 'x', from: 'Rome', kind: 'variation', differs: 'thicker base', raisedAt: '2026-01-01', status: 'open' }],
    };
    expect(isDisputed(challenged)).toBe(true);
    expect(challenged.score).toBe(pizza().score);
    expect(findViolations(challenged)).toEqual([]);
  });
});

describe('every atlas row reads the same way', () => {
  it('gives each country the same two facts, whether or not it has places', () => {
    // The earlier version appended place names where it had them, which made some
    // countries look documented and others like an afterthought — when the only
    // difference was whether anyone had recorded a region.
    for (const group of buildAtlas(dishes)) {
      for (const country of group.countries) {
        expect(country.detail).toMatch(/^\d+ traditions? · (\d+ places?|country level only)$/);
      }
    }
  });

  it('counts places consistently with the detail line', () => {
    for (const group of buildAtlas(dishes)) {
      for (const country of group.countries) {
        if (country.places === 0) expect(country.detail).toMatch(/country level only$/);
        else expect(country.detail).toMatch(new RegExp(`· ${country.places} places?$`));
      }
    }
  });
});

describe('cuisine is its own axis, not a synonym for country', () => {
  const base = { query: '', levels: [], categories: [], ingredients: [], sortBy: 'authenticity' as const };

  const pool: Dish[] = [
    { ...halwa(), id: 201, name: 'Tamil dish', cuisine: 'Tamil', loc: { ...halwa().loc, city: 'Madurai' } },
    { ...halwa(), id: 202, name: 'Sichuan dish', cuisine: 'Sichuan', loc: { ...halwa().loc, country: 'China', region: 'Sichuan', province: '', city: '', village: '' }, breadcrumb: ['China', 'Sichuan'] },
    { ...halwa(), id: 203, name: 'Another Tamil dish', cuisine: 'Tamil', loc: { ...halwa().loc, city: 'Chennai' } },
  ];

  it('filters by culinary tradition', () => {
    const tamil = searchResults(pool, { ...base, cuisines: ['Tamil'] });
    expect(tamil.map((d) => d.id).sort()).toEqual([201, 203]);
  });

  it('separates sub-national cuisines that share a country', () => {
    // Both Tamil dishes are Indian; filtering by country could not tell them from
    // any other Indian dish, which is the whole reason this axis exists.
    const tamil = searchResults(pool, { ...base, cuisines: ['Tamil'] });
    expect(tamil.every((d) => d.loc.country === 'India')).toBe(true);
    expect(searchResults(pool, { ...base, cuisines: ['Sichuan'] }).map((d) => d.id)).toEqual([202]);
  });

  it('ORs several cuisines', () => {
    expect(searchResults(pool, { ...base, cuisines: ['Tamil', 'Sichuan'] })).toHaveLength(3);
  });

  it('narrows nothing when no cuisine is chosen', () => {
    expect(searchResults(pool, base)).toHaveLength(3);
  });

  it('excludes records whose tradition is not established', () => {
    const unknown: Dish = { ...halwa(), id: 204, name: 'Unplaced', cuisine: undefined };
    expect(searchResults([...pool, unknown], { ...base, cuisines: ['Tamil'] }).map((d) => d.id)).not.toContain(204);
  });

  it('orders the facet by how much of the atlas each tradition holds', () => {
    expect(allCuisines(pool)[0]).toBe('Tamil');
  });
});

describe('the atlas reports its own gaps', () => {
  const m = () => catalogueMetrics(dishes);

  it('counts what is actually there', () => {
    expect(m().total).toBe(dishes.length);
    expect(m().countries).toBe(new Set(dishes.map((d) => d.loc.country)).size);
  });

  it('measures the number that matters most — how much is documented', () => {
    const documented = m().documented;
    expect(documented.count).toBe(dishes.filter((d) => d.steps.length > 0).length);
    expect(documented.percent).toBe(Math.round((documented.count / documented.total) * 100));
  });

  it('surfaces concentration rather than burying it', () => {
    // The honest headline for a lopsided catalogue: name the country and the share.
    const { country, percent } = m().concentration;
    const counts = new Map<string, number>();
    for (const d of dishes) counts.set(d.loc.country, (counts.get(d.loc.country) ?? 0) + 1);
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    expect(country).toBe(top[0]);
    expect(percent).toBe(Math.round((top[1] / dishes.length) * 100));
  });

  it('bands confidence without double-counting', () => {
    const total = m().confidence.reduce((sum, row) => sum + row.count, 0);
    expect(total).toBe(dishes.length);
  });

  it('accounts for every record across continents', () => {
    expect(m().byContinent.reduce((sum, row) => sum + row.count, 0)).toBe(dishes.length);
  });

  it('counts a tradition as forked only when it has more than one peer', () => {
    // Kozhikode and Thalassery share one traditionId — that is one forked tradition.
    expect(m().forked).toBe(1);
  });

  it('shows no trend from a single snapshot — a point is not a direction', () => {
    expect(trendFor([], 'total')).toBeNull();
    expect(trendFor([{ date: '2026-08-13', total: 10, countries: 2, documented: 1, illustrated: 3, located: 4 }], 'total')).toBeNull();
  });

  it('reads direction, span and history once there are two points', () => {
    const history = [
      { date: '2026-08-01', total: 100, countries: 10, documented: 5, illustrated: 40, located: 50 },
      { date: '2026-08-08', total: 140, countries: 12, documented: 6, illustrated: 55, located: 70 },
      { date: '2026-08-11', total: 150, countries: 12, documented: 9, illustrated: 60, located: 80 },
    ];
    const t = trendFor(history, 'total')!;
    expect(t.points).toEqual([100, 140, 150]);
    expect(t.delta).toBe(10); // since the previous snapshot
    expect(t.sinceStart).toBe(50);
    expect(t.span).toBe(10); // days covered, so a rise is not mistaken for a rate
  });

  it('orders history by date regardless of how it was appended', () => {
    const jumbled = [
      { date: '2026-08-11', total: 150, countries: 12, documented: 9, illustrated: 60, located: 80 },
      { date: '2026-08-01', total: 100, countries: 10, documented: 5, illustrated: 40, located: 50 },
    ];
    expect(trendFor(jumbled, 'total')!.points).toEqual([100, 150]);
  });

  it('reports a fall as a fall', () => {
    const history = [
      { date: '2026-08-01', total: 200, countries: 10, documented: 5, illustrated: 40, located: 50 },
      { date: '2026-08-05', total: 180, countries: 10, documented: 5, illustrated: 40, located: 50 },
    ];
    expect(trendFor(history, 'total')!.delta).toBe(-20);
  });

  it('never divides by zero on an empty catalogue', () => {
    const empty = catalogueMetrics([]);
    expect(empty.documented.percent).toBe(0);
    expect(empty.concentration.percent).toBe(0);
    expect(empty.total).toBe(0);
  });
});

describe('dietary classification', () => {
  const base = { query: '', levels: [], categories: [], ingredients: [], sortBy: 'authenticity' as const };

  it('reads the whole method, not just the ingredient chips', () => {
    // Mole's ingredient list looks vegetarian — chiles, chocolate, sesame, plantain.
    // The method fries in lard and loosens with turkey broth. This is the case the
    // rule exists for.
    expect(mole().ingredients.join(' ').toLowerCase()).not.toMatch(/lard|broth|turkey/);
    expect(mole().diet.group).toBe('meat');
    expect(mole().diet.kinds).toEqual(['pork', 'poultry']);
    expect(mole().diet.basis).toMatch(/lard/);
  });

  it('makes every classification checkable', () => {
    for (const dish of dishes) {
      expect(dish.diet.basis.trim().length).toBeGreaterThan(0);
    }
  });

  it('separates vegan from vegetarian by what the dish actually contains', () => {
    // Kozhikode's halwa uses coconut oil, not ghee.
    expect(halwa().diet.group).toBe('vegan');
    expect(halwa().diet.contains).toEqual([]);
    // Pizza is vegetarian, not vegan — mozzarella.
    expect(pizza().diet.group).toBe('vegetarian');
    expect(pizza().diet.contains).toContain('dairy');
  });

  it('rejects a record calling itself vegan while carrying dairy', () => {
    const wrong: Dish = {
      ...halwa(),
      diet: { group: 'vegan', kinds: [], contains: ['dairy'], basis: 'Cooked in ghee.' },
    };
    expect(findViolations(wrong).join(' ')).toMatch(/classified vegan but records animal products/);
  });

  it('rejects a meat record that does not say which kind', () => {
    const vague: Dish = { ...mole(), diet: { ...mole().diet, kinds: [] } };
    expect(findViolations(vague).join(' ')).toMatch(/must say which kind/);
  });

  it('rejects a classification with no stated basis', () => {
    const unsourced: Dish = { ...pizza(), diet: { ...pizza().diet, basis: '  ' } };
    expect(findViolations(unsourced).join(' ')).toMatch(/records what it was read from/);
  });

  it('includes vegan dishes under a vegetarian preference, but never the reverse', () => {
    const vegetarian = feedFor(dishes, 'all', [], { groups: ['vegetarian'], kinds: [] });
    expect(vegetarian.map((d) => d.id)).toEqual(expect.arrayContaining([halwa().id, pizza().id]));

    const vegan = feedFor(dishes, 'all', [], { groups: ['vegan'], kinds: [] });
    expect(vegan.map((d) => d.id).sort()).toEqual([halwa().id, thalassery().id].sort());
    expect(vegan.map((d) => d.id)).not.toContain(pizza().id);
  });

  it('narrows within a group through the sub-menu', () => {
    const anyMeat = feedFor(dishes, 'all', [], { groups: ['meat'], kinds: [] });
    expect(anyMeat.map((d) => d.id).sort()).toEqual([mole().id, hawaiian().id].sort());

    const poultryOnly = feedFor(dishes, 'all', [], { groups: ['meat'], kinds: ['poultry'] });
    expect(poultryOnly.map((d) => d.id)).toEqual([mole().id]);
  });

  it('ORs several groups, for a household with mixed preferences', () => {
    const mixed = feedFor(dishes, 'all', [], { groups: ['vegan', 'seafood'], kinds: [] });
    expect(mixed.map((d) => d.id).sort()).toEqual([halwa().id, thalassery().id, byId(5).id].sort());
  });

  it('composes with authenticity and place rather than replacing them', () => {
    const both = feedFor(dishes, 'authentic', [{ level: 'country', value: 'Italy' }], {
      groups: ['vegetarian'],
      kinds: [],
    });
    expect(both.map((d) => d.id)).toEqual([pizza().id]);

    // The fusion record is meat, but Authentic Only excludes it regardless.
    const fusionHidden = feedFor(dishes, 'authentic', [], { groups: ['meat'], kinds: ['pork'] });
    expect(fusionHidden.map((d) => d.id)).not.toContain(hawaiian().id);
  });

  it('applies the same preference to search', () => {
    const seafood = searchResults(dishes, { ...base, dietGroups: ['seafood'] });
    expect(seafood.map((d) => d.id)).toEqual([byId(5).id]);
  });

  it('narrows place counts too, so a place never promises a hidden record', () => {
    const diet = { groups: ['vegan' as const], kinds: [] };
    const matching = feedFor(dishes, 'authentic', [], diet);
    const next = nextLevel([], matching);
    expect(next?.options.map((o) => o.label)).toEqual(['India']);
  });

  it('narrows nothing when no preference is set', () => {
    expect(feedFor(dishes, 'all', [], { groups: [], kinds: [] })).toHaveLength(dishes.length);
  });

  it('surfaces alcohol as a trace so a reader avoiding it is told', () => {
    expect(byId(6).diet.contains).toContain('alcohol');
    expect(traceLabels(byId(6).diet)).toContain('Contains alcohol');
  });

  it('labels a dish with its group and kinds', () => {
    expect(dietLabel(mole().diet)).toBe('Non-vegetarian · Pork, Poultry');
    expect(dietLabel(halwa().diet)).toBe('Vegan');
  });
});

describe('meal occasion is recorded in the tradition s own terms', () => {
  const base = { query: '', levels: [], categories: [], ingredients: [], sortBy: 'authenticity' as const };

  it('does not force a dish onto a meal timetable it does not belong to', () => {
    // Ayrag is poured for whoever arrives; it is not a course.
    expect(byId(6).meals.occasions).toEqual(['anytime']);
    expect(byId(6).meals.note).toMatch(/hospitality rather than to a meal/);

    // Halwa is bought by weight and eaten through the day.
    expect(halwa().meals.occasions).toEqual(['snack', 'celebration']);
  });

  it('keeps the local occasion, not just the chip', () => {
    expect(byId(5).meals.note).toMatch(/Þorrablót/);
    expect(mole().meals.note).toMatch(/comida/);
    expect(halwa().meals.note).toMatch(/Ramadan/);
  });

  it('filters by occasion, including the any-time dishes', () => {
    const lunch = feedFor(dishes, 'all', [], undefined, ['lunch']);
    // Ayrag is 'anytime', so it is genuinely available at lunch.
    expect(lunch.map((d) => d.id).sort()).toEqual([mole().id, pizza().id, hawaiian().id, byId(6).id].sort());
  });

  it('treats an any-time dish as available at whatever occasion is asked for', () => {
    const breakfast = feedFor(dishes, 'all', [], undefined, ['breakfast']);
    expect(breakfast.map((d) => d.id)).toEqual([byId(6).id]);
  });

  it('never pads a meal list with dishes whose occasion is unrecorded', () => {
    const unrecorded: Dish = { ...pizza(), id: 99, meals: { occasions: [], note: '' } };
    const pool = [...dishes, unrecorded];
    expect(feedFor(pool, 'all', [], undefined, ['dinner']).map((d) => d.id)).not.toContain(99);
    // …but they are findable on purpose.
    expect(feedFor(pool, 'all', [], undefined, ['unclassified']).map((d) => d.id)).toEqual([99]);
  });

  it('ORs several occasions', () => {
    const either = feedFor(dishes, 'all', [], undefined, ['street-food', 'celebration']);
    expect(either.map((d) => d.id).sort()).toEqual(
      [halwa().id, thalassery().id, mole().id, pizza().id, byId(5).id, byId(6).id].sort(),
    );
  });

  it('composes with diet and authenticity', () => {
    const vegetarianLunch = feedFor(dishes, 'authentic', [], { groups: ['vegetarian'], kinds: [] }, ['lunch']);
    expect(vegetarianLunch.map((d) => d.id).sort()).toEqual([pizza().id, byId(6).id].sort());
  });

  it('applies to search too', () => {
    expect(searchResults(dishes, { ...base, meals: ['celebration'] }).map((d) => d.id).sort()).toEqual(
      [halwa().id, thalassery().id, mole().id, byId(5).id, byId(6).id].sort(),
    );
  });

  it('narrows nothing when no occasion is chosen', () => {
    expect(feedFor(dishes, 'all', [], undefined, [])).toHaveLength(dishes.length);
  });
});

describe('translation preserves the identity of the food', () => {
  it('reads the original when no translation is needed', () => {
    const reading = readDish(pizza(), 'en');
    expect(reading.status).toBe('original');
    expect(reading.steps).toEqual(pizza().steps);
    expect(reading.note).toBe('');
  });

  it('says so, and shows the original, when nothing has been translated yet', () => {
    const reading = readDish(pizza(), 'ja');
    expect(reading.status).toBe('missing');
    expect(reading.steps).toEqual(pizza().steps);
    expect(reading.note).toMatch(/No translation .* has been recorded yet/);
  });

  it('uses a curated translation and credits the translator', () => {
    const reading = readDish(mole(), 'es');
    expect(reading.status).toBe('human');
    expect(reading.translator).toBe('Community translator, Oaxaca');
    expect(reading.steps[0]).toMatch(/comal/);
  });

  it('leaves the dish name, ingredients and equipment untranslated', () => {
    const reading = readDish(mole(), 'es');
    expect(reading.name).toBe(mole().name);
    expect(reading.ingredients).toEqual(mole().ingredients);
    expect(reading.equipment).toEqual(mole().equipment);
  });

  it('keeps the same number of steps across a translation', () => {
    expect(readDish(mole(), 'es').steps).toHaveLength(mole().steps.length);
  });

  it('labels a machine translation as unchecked', () => {
    const machine: DishTranslation = {
      ...mole().translations!.es,
      translator: 'automated translation',
      machine: true,
    };
    const reading = readDish({ ...mole(), translations: { es: machine } }, 'es');
    expect(reading.status).toBe('machine');
    expect(reading.note).toMatch(/No one from the community has checked it/);
  });
});

describe('the translation provider is held to the preservation rules', () => {
  const target = () => ({ ...halwa() });

  it('sends every name as a do-not-translate term', () => {
    const prompt = buildPrompt(target(), 'es');
    for (const term of preservedTerms(target())) {
      expect(prompt).toContain(`"${term}"`);
    }
    expect(prompt).toMatch(/Do NOT change any number, duration, temperature/);
  });

  it('rejects a translation that dropped a step', () => {
    const dish = target();
    const bad: DishTranslation = {
      code: 'es',
      blurb: dish.blurb,
      prepSummary: dish.prepSummary,
      steps: dish.steps.slice(1),
      adaptation: dish.adaptation,
      disclaimer: dish.disclaimer,
      translator: 'automated translation',
      machine: true,
    };
    expect(() => assertPreserved(dish, bad)).toThrow(/method must survive translation intact/);
  });

  it('rejects a translation that changed a duration', () => {
    const dish = target();
    const bad: DishTranslation = {
      code: 'es',
      blurb: dish.blurb,
      // "2-4 hours" quietly becomes "1-2 hours".
      prepSummary: dish.prepSummary,
      steps: dish.steps.map((s) => s.replace('2–4 hours', '1–2 hours')),
      adaptation: dish.adaptation,
      disclaimer: dish.disclaimer,
      translator: 'automated translation',
      machine: true,
    };
    expect(() => assertPreserved(dish, bad)).toThrow(/altered the numbers/);
  });

  it('rejects a translation that renamed a traditional ingredient', () => {
    const dish: Dish = {
      ...target(),
      prepSummary: 'Cooked in Coconut oil until glossy.',
      ingredients: ['Coconut oil'],
      steps: ['Stir in Coconut oil.'],
    };
    const bad: DishTranslation = {
      code: 'es',
      blurb: dish.blurb,
      prepSummary: 'Cocinado en aceite vegetal hasta que brille.',
      steps: ['Incorpora aceite vegetal.'],
      adaptation: dish.adaptation,
      disclaimer: dish.disclaimer,
      translator: 'automated translation',
      machine: true,
    };
    expect(() => assertPreserved(dish, bad)).toThrow(/dropped or renamed the preserved term/);
  });
});

describe('video language handling never dubs over the cook', () => {
  it('leaves the URL alone when the video is already in the reader s language', () => {
    const video = { languageCode: 'it' };
    const plan = planTranslation(video, 'it');
    expect(plan.route).toBe('original');
    expect(withLanguage('https://x/watch?v=1', 'it', plan)).toBe('https://x/watch?v=1');
  });

  it('asks the provider for captions over the original audio by default', () => {
    const plan = planTranslation({ languageCode: 'ml' }, 'en');
    expect(plan.route).toBe('provider-captions');
    expect(plan.note).toMatch(/the cook's voice is not replaced/);
    const url = withLanguage('https://x/watch?v=1', 'en', plan);
    expect(url).toContain('cc_lang_pref=en');
    expect(url).toContain('cc_load_policy=1');
  });

  it('prefers a creator-published audio track and credits it as theirs', () => {
    const plan = planTranslation({ languageCode: 'ml', audioTracks: ['en'] }, 'en');
    expect(plan.route).toBe('creator-audio');
    expect(plan.note).toMatch(/the creator's own, not ours/);
    // A creator track is selected by hl, without forcing captions on top of it.
    expect(withLanguage('https://x/watch?v=1', 'en', plan)).not.toContain('cc_load_policy');
  });

  it('admits it does not know rather than promising a translation', () => {
    const plan = planTranslation({}, 'en');
    expect(plan.route).toBe('unavailable');
    expect(plan.note).toMatch(/we can't promise/);
  });
});

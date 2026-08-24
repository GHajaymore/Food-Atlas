/**
 * Domain tests.
 *
 * These cover the rules the product cannot afford to get wrong — the ones that would
 * mislabel a tradition rather than merely look wrong. The UI is deliberately absent
 * here: every rule below is enforced in the data layer, so it can be tested without
 * a renderer and stays true when the screens change.
 */

import { catalogue } from './catalogue';
import { dishes } from '../src/data/seed';
import {
  CLASSIFICATIONS,
  FILTERS,
  filterKeyFor,
  isAuthentic,
  VALIDATIONS_REQUIRED,
  viewsNumber,
} from '../src/domain/authenticity';
import { assess, AUTHENTIC_AT } from '../src/domain/assess';
import { detectAtRisk } from '../src/domain/atRisk';
import { dietLabel, traceLabels } from '../src/domain/diet';
import {
  EDITORIAL_RULE,
  nearbyNames,
  reviewProse,
  tidyProse,
  tidyTerm,
} from '../src/domain/editorial';
import { findCatalogueViolations, findViolations } from '../src/domain/invariants';
import { notAFood } from '../src/domain/isDish';
import { canonicalCountry } from '../src/domain/countryNames';
import {
  canAcceptDonations,
  DONATION_URL,
  FUNDING_NEEDS,
  LEDGER_URL,
  NOT_FOR_SALE,
  OPEN_COLLECTIVE_SLUG,
} from '../src/domain/support';
import {
  canContribute,
  contributionUrl,
  missingFrom,
  REQUIRED,
  WALKTHROUGH_NOTE,
} from '../src/domain/contribution';
import { continentOf, isCountry, isHistoricalState, placeKind } from '../src/domain/continents';
import { confirmAsk, contestedNote } from '../src/domain/traditions';
import { dishFromInscription, MAX_NAME } from '../src/domain/inscription';
import { isPhotograph, tidyCredit } from '../src/domain/photoProvenance';
import { notAPlaceBelow } from '../src/domain/place';
import { isOpenable } from '../src/domain/video';
import { recipeLines } from '../src/domain/recipeLines';
import { decodeEntities } from '../src/domain/text';
import { negotiateLocale } from '../src/domain/uiLanguage';
import { copyFor, isMachineTranslated, translationCoverage, UI_LOCALES } from '../src/i18n';
import { CATALOGUES } from '../src/i18n/catalogues';
import { EN } from '../src/i18n/copy';
import {
  considerSource,
  describesMethod,
  sourceNote,
  worthCiting,
  FINDER_MAY_WRITE,
  FINDER_MAY_NEVER_WRITE,
  type RecordFacts,
} from '../src/domain/sourceFinding';
import { METRIC_NOTES, metricNote } from '../src/domain/metricNotes';
import { catalogueMetrics, percentLabel, trendFor } from '../src/domain/metrics';
import {
  coverageOf,
  LANGUAGES,
  languageProgress,
  MIN_RECORDS_PER_LANGUAGE,
  offeredLanguages,
  planTranslation,
  withLanguage,
} from '../src/domain/language';
import {
  allCuisines,
  allIngredients,
  buildAtlas,
  feedFor,
  mostPopular,
  narrowingSummary,
  placeChoiceHint,
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
import {
  isFreeLicence,
  isRejection,
  parsePhotoReference,
  type PhotoRejection,
} from '../src/domain/photoSubmission';
import { buildShelves, shelfMatch, shelfTitle, today } from '../src/domain/shelves';
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
  /**
   * Readership on top of the curated records.
   *
   * These tests used to lean on the seed's own view counts, which were the design
   * handoff's invented figures — "2.1M views" on the fusion record. Those are gone,
   * so the numbers a ranking test needs are supplied here, where they are visibly
   * fixtures rather than data the app might ship.
   */
  const read = (counts: Record<number, string>) =>
    dishes.map((d) => ({ ...d, views: counts[d.id] ?? d.views }));

  it('ranks the rail by readership alone, ignoring classification', () => {
    // The most-read record is allowed to be the fusion invention. That is the point
    // of the rail, and the copy underneath it says so.
    const withCounts = read({ [hawaiian().id]: '2,100,000 readers', [halwa().id]: '3,400 readers' });
    expect(mostPopular(withCounts)[0].id).toBe(hawaiian().id);
  });

  it('ranks nothing when nothing has a real readership figure', () => {
    // The app shipped ranking seven records with invented counts while 13,848 others
    // tied at zero. A record with no count is unknown, not unpopular, and the rail
    // shows nothing rather than presenting the fixtures as a chart.
    expect(dishes.every((d) => d.views === '')).toBe(true);
    expect(mostPopular(dishes)).toEqual([]);
  });

  it('will not put a record with no photograph on the rail', () => {
    const blind = read({ [hawaiian().id]: '9,000,000 readers' }).map((d) =>
      d.id === hawaiian().id ? { ...d, photo: '' } : d,
    );
    expect(mostPopular(blind).map((d) => d.id)).not.toContain(hawaiian().id);
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
    expect(byAuthenticity[0].id).toBe(halwa().id); // 94, the strongest evidence
  });

  it('orders by views only when popularity is explicitly chosen', () => {
    const byViews = searchResults(read({ [hawaiian().id]: '2,100,000 readers' }), {
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

  /*
   * The classification badge on a record links to the filter that shows its peers, and
   * the failure mode is silent: a level with no matching filter would send a reader
   * from a badge that is plainly true to a list containing nothing. So every level must
   * name a filter that exists, and the two authentic levels must share one — FILTERS
   * offers "Authentic Only", not a chip per level.
   */
  it('sends every classification to a filter that exists', () => {
    const keys = new Set(FILTERS.map((f) => f.key));

    for (const level of Object.keys(CLASSIFICATIONS) as (keyof typeof CLASSIFICATIONS)[]) {
      expect(keys).toContain(filterKeyFor(level));
    }

    expect(filterKeyFor('local')).toBe('authentic');
    expect(filterKeyFor('regional')).toBe('authentic');
    expect(filterKeyFor('fusion')).toBe('fusion');
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

describe("the line under a dish name", () => {
  const blurbs = catalogue.map((d) => d.blurb).filter(Boolean);

  it("reads as a line, not as a database field", () => {
    // 5,276 blurbs are Wikidata descriptions, lower-case by convention because they
    // are fragments meant to disambiguate a search result. Printed under a heading
    // they read as unfinished.
    const fragments = blurbs.filter((b) => /^\p{Ll}/u.test(b));
    expect(fragments.slice(0, 5)).toEqual([]);
  });

  it("never ends on a dangling separator", () => {
    // "traditional food (soup) in Cameroon," was a real one.
    expect(blurbs.filter((b) => /[,;:]$/.test(b)).slice(0, 5)).toEqual([]);
  });

  it("says nothing rather than repeating the name or the word Food", () => {
    // smazenice was described as "smazenice", and Craquelin as "Food". Saying
    // nothing is better than handing the reader their own question back.
    for (const dish of catalogue) {
      if (!dish.blurb) continue;
      expect(dish.blurb.trim().toLowerCase()).not.toBe(dish.name.trim().toLowerCase());
      expect(/^(food|dish|drink|meal|cuisine)$/i.test(dish.blurb.trim())).toBe(false);
    }
  });
});

describe("a region has to name a place", () => {
  it("refuses a sentence fragment left by a bad cut", () => {
    // "of Odisha" shipped as the region on fourteen Indian dishes.
    expect(notAPlaceBelow("of Odisha", "India")).toMatch(/fragment/);
    expect(notAPlaceBelow("most of Niger", "Nigeria")).toMatch(/fragment/);
    expect(notAPlaceBelow("likely Minnesota", "United States")).toMatch(/fragment/);
    expect(notAPlaceBelow("Nationwide in Malaysia", "Malaysia")).toMatch(/fragment/);
  });

  it("refuses two words run together where a category was stripped", () => {
    // "Indian cuisine in the United Kingdom" minus "cuisine" left this on Vindaloo.
    expect(notAPlaceBelow("Indianin the United Kingdom", "India")).toMatch(/run together/);
  });

  it("refuses a region with no proper noun in it", () => {
    // Khuushuur read "Mongolia > penis", taken from a Wikipedia food category.
    expect(notAPlaceBelow("penis", "Mongolia")).toMatch(/no proper noun/);
    expect(notAPlaceBelow("disputed", "United States")).toMatch(/fragment|no proper noun/);
  });

  it("refuses markup that reached the region", () => {
    expect(notAPlaceBelow("{{ubl", "Iran")).toMatch(/markup/);
    expect(notAPlaceBelow("(Tabriz", "Iran")).toMatch(/markup/);
  });

  it("keeps a place written in a script that has no capitals", () => {
    // Refusing these would delete real places from exactly the countries this atlas
    // is already worst at.
    expect(notAPlaceBelow("四川", "China")).toBeNull();
    expect(notAPlaceBelow("북한", "South Korea")).toBeNull();
  });

  it("keeps the real places these rules sit next to", () => {
    for (const [region, country] of [["Kozhikode", "India"], ["Central Java", "Indonesia"], ["Province of Perugia", "Italy"]]) {
      expect(notAPlaceBelow(region, country)).toBeNull();
    }
  });
});

describe("a language in the picker is a promise", () => {
  const coverage = coverageOf(catalogue);

  it("offers only languages the catalogue can actually meet", () => {
    // "Offering eighty when seventy of them would return the English text unchanged
    // breaks that promise eighty times over." English is exempt: it is the language
    // the catalogue is written in.
    for (const lang of offeredLanguages(coverage)) {
      if (lang.code === "en") continue;
      expect({ code: lang.code, meets: (coverage[lang.code] ?? 0) >= MIN_RECORDS_PER_LANGUAGE }).toEqual({
        code: lang.code,
        meets: true,
      });
    }
  });

  it("reports every language it is not yet offering, and how far off", () => {
    // A reader whose language is missing should see it coming rather than conclude
    // the app does not care about it. The arithmetic is shown on screen -- "Hungarian
    // opens once 21 more records can be read in it" -- so it has to be right.
    const offered = new Set(offeredLanguages(coverage).map((l) => l.code));
    for (const p of languageProgress(coverage)) {
      expect(offered.has(p.language.code)).toBe(false);
      expect(p.records + p.needed).toBe(MIN_RECORDS_PER_LANGUAGE);
    }
  });

  it("accounts for every language exactly once", () => {
    // Offered plus pending must be the whole list: a language in neither would be
    // invisible to a reader and to us.
    const offered = offeredLanguages(coverage).length;
    const pending = languageProgress(coverage).length;
    expect(offered + pending).toBe(LANGUAGES.length);
  });
});

describe("the place selector agrees with the coverage screen", () => {
  const opt = (label: string) => ({ label, count: 1, level: "country" as const });

  it("counts countries as countries, and names the rest", () => {
    // The feed said "Choose a country - 194 recorded" while the coverage screen said
    // "156 countries", from the same catalogue on the same load. Both were right and
    // counting different things; a reader who noticed both could not tell which was
    // wrong.
    expect(placeChoiceHint([opt("France"), opt("Japan"), opt("Levant"), opt("Ottoman Empire")])).toBe(
      "Choose a country · 2 recorded, and 2 broader origins",
    );
  });

  it("says nothing about broader origins when there are none", () => {
    expect(placeChoiceHint([opt("France"), opt("Japan")])).toBe("Choose a country · 2 recorded");
  });

  it("adds up to what the picker will actually list", () => {
    const options = [opt("France"), opt("Levant"), opt("Japan"), opt("Mesoamerica"), opt("Peru")];
    const hint = placeChoiceHint(options);
    const numbers = (hint.match(/[0-9]+/g) ?? []).map(Number);
    expect(numbers.reduce((a, b) => a + b, 0)).toBe(options.length);
  });
});

describe("the front page moves", () => {
  const railFor = (turn: number) => {
    // "cookable" rather than "authentic": the authenticated shelf has only twelve
    // photographed records to draw on, so it cannot rotate and should not pretend to.
    const shelf = buildShelves(catalogue, 12, turn).find((s) => s.id === "cookable");
    return (shelf?.dishes ?? []).map((d) => d.id);
  };

  it("shows a different rail on a different day", () => {
    // Ranking is deterministic, so every visit met the same twelve cards for ever.
    // An atlas of sixteen thousand traditions showing the same three every day is
    // not describing what it holds.
    expect(railFor(0)).not.toEqual(railFor(1));
  });

  it("shows the same rail twice on the same day", () => {
    // The page has to be a stable object while it is being used: reshuffling per
    // render would move the card a reader was about to tap.
    expect(railFor(7)).toEqual(railFor(7));
  });

  it("rotates within a pool of equals, never onto weaker records", () => {
    // Variety bought by showing the second-best of everything is not worth having.
    // Whatever the turn, every card comes from the strongest few railfuls.
    const strongest = new Set(railFor(0).concat(railFor(1), railFor(2), railFor(3)));
    const ranked = buildShelves(catalogue, 12 * 3, 0).find((s) => s.id === "cookable");
    const pool = new Set((ranked?.dishes ?? []).map((d) => d.id));
    for (const id of strongest) expect(pool.has(id)).toBe(true);
  });

  it("counts a turn as a day", () => {
    expect(today()).toBe(Math.floor(Date.now() / 86_400_000));
  });
});

describe("what counts as a photograph of the food", () => {
  it("refuses the placeholder graphics articles use instead of a picture", () => {
    // 220 records shared Noia_64_apps_energy.png, a KDE desktop icon, and 35 shared
    // ChineseDishLogo.png. The ingest took each article’s image without asking what
    // the image was.
    expect(isPhotograph("https://x/Noia_64_apps_energy.png")).toBe(false);
    expect(isPhotograph("https://x/ChineseDishLogo.png")).toBe(false);
    expect(isPhotograph("https://x/960px-Brooke-bond-logo.jpg")).toBe(false);
    expect(isPhotograph("https://x/DO%20Cava%20locator%20map.svg")).toBe(false);
  });

  it("refuses a file a browser cannot show as an image", () => {
    // One of these is a scanned 1936 book called Plenty of Onions.
    expect(isPhotograph("https://x/Braised%20noodles.pdf")).toBe(false);
  });

  it("keeps a real photograph, including the ones saved as png", () => {
    // The extension proves nothing on its own, which is why the rule reads the name.
    expect(isPhotograph("https://x/Kozhikode_Halwa.jpg")).toBe(true);
    expect(isPhotograph("https://x/Baklava(1).png")).toBe(true);
    expect(isPhotograph("https://x/Pizzas%20Buenos%20Aires.png")).toBe(true);
  });
});

describe("the photographer’s credit", () => {
  it("takes the name out of Commons boilerplate", () => {
    // 61 records credited a photographer as "No machine-readable author provided.
    // X assumed (based on copyright claims)" -- apparatus wrapped around a username.
    expect(tidyCredit("No machine-readable author provided. J.P.Lon~commonswiki assumed (based on copyright claims).")).toBe("J.P.Lon~commonswiki");
  });

  it("decodes entities a reader would otherwise see spelled out", () => {
    expect(tidyCredit("Canadian National Collections &amp; Zhaofu Yang")).toBe("Canadian National Collections & Zhaofu Yang");
  });

  it("removes wiki-link residue without removing the words", () => {
    expect(tidyCredit("Raveesh Vyas from [Ahmedabad, Noida], India")).toBe("Raveesh Vyas from Ahmedabad, Noida, India");
  });

  it("takes the name out of the file-history sentences too", () => {
    // 41 records read "Original uploader was Natto at ja.wikipedia".
    expect(tidyCredit("Original uploader was Natto at ja.wikipedia")).toBe("Natto");
    expect(tidyCredit("Transferred from en.wikipedia to Commons. by CommonsHelper. The original uploader was Sjschen at English Wikipedia")).toBe("Sjschen");
  });

  it("leaves a derivative work crediting both people", () => {
    // "Chopstick.JPG: X derivative work: Y" names two contributors -- whoever made
    // the original and whoever altered it. Trimming either to fit a card is not a
    // tidy-up, it is dropping an attribution. 17 records carry this shape.
    const both = "Chopstick.JPG: A derivative work: Richardprins (talk)";
    expect(tidyCredit(both)).toBe(both);
  });

  it("never empties an attribution", () => {
    // Attribution is a condition of these licences. An ugly credit is a licence met;
    // a missing one is not, so a tidy-up that would blank it keeps the original.
    expect(tidyCredit("[]")).toBe("[]");
    expect(tidyCredit("Mx. Granger")).toBe("Mx. Granger");
  });

  it("leaves a bare URL and a long credit exactly as given", () => {
    // All Commons holds for some photographers, and what others asked for. Neither
    // is ours to edit down.
    const url = "https://publicdomainq.net/miso-0018849/";
    expect(tidyCredit(url)).toBe(url);
    const long = "Leela Ram (Almora Lakhori Mirchi grower) from Amel village of Betalghat tehsil, Nainital district";
    expect(tidyCredit(long)).toBe(long);
  });
});

describe("the at-risk flag", () => {
  it("refuses a sentence about a revival", () => {
    // The shelf these records lead is headed "Traditions a source describes as
    // declining". Hoppy carried the badge over "has experienced a retro revival of
    // late", which is the opposite claim shown as its own evidence.
    expect(detectAtRisk("It is still a staple among some Tokyo residents, and has experienced a retro revival of late.", "Hoppy").atRisk).toBe(false);
    expect(detectAtRisk("There has been a revival of this cookery style in the 21st century.", "Korean royal court cuisine").atRisk).toBe(false);
  });

  it("requires weak decline language to be about the dish", () => {
    // Bosnian pot was flagged because fireplaces are in decline; nata de coco because
    // nata de pina is seasonal. Both sentences really do contain decline language.
    expect(detectAtRisk("Today, with the declining availability of fireplaces for cooking, many cooks use a regular pot instead.", "Bosnian pot").atRisk).toBe(false);
    expect(detectAtRisk("The consumption of kompot has been declining since the 1980s.", "Kompot").atRisk).toBe(true);
  });

  it("refuses a claim about where a dish is served", () => {
    // Dhooska was flagged on "rarely found in larger restaurants" -- its own sentence
    // says people enjoy it at market stalls. Orange chicken on "rarely found in
    // Chinese restaurants in China", which is about authenticity, not survival.
    expect(detectAtRisk("Dhooska is mostly made in market-area stalls where people enjoy it as a snack and is rarely found in larger restaurants.", "Dhooska").atRisk).toBe(false);
    expect(detectAtRisk("Orange chicken is rarely found in Chinese restaurants in China.", "Orange chicken").atRisk).toBe(false);
  });

  it("lets a stated claim stand without repeating the name", () => {
    // "Though once common, the knowledge to make the food product is slowly dying
    // out" never says Sendango, and is exactly the record this feature exists for.
    const found = detectAtRisk("Though once common, the knowledge to make the food product is slowly dying out.", "Sendango");
    expect(found.atRisk).toBe(true);
    expect(found.strength).toBe("stated");
  });

  it("keeps the sentence that produced the flag", () => {
    const found = detectAtRisk("In 2009, Balichao is described as an almost extinct condiment, as people look elsewhere.", "Balichao");
    expect(found.evidence).toMatch(/almost extinct/);
  });
});

describe("a record filed under one of several claimed origins", () => {
  it("does not present the filing as the answer", () => {
    // Pierogi read "China" in the largest text on the page, above a section saying
    // no claim here is the winner. A reader who read only the top took the opposite
    // meaning from the one the page intended.
    const note = contestedNote(3);
    expect(note).toMatch(/for navigation/i);
    expect(note).toMatch(/none of them is settled/i);
    expect(note).toMatch(/3 places/);
  });

  it("names no country and ranks nothing", () => {
    // The claims are listed in full lower down, each with its source, in the order
    // the source gave them. This line must not pre-empt that.
    for (const country of ["China", "Poland", "Ukraine"]) {
      expect(contestedNote(3)).not.toContain(country);
    }
  });
});

describe("the sentence shown when nothing matches", () => {
  it("names every constraint, so it is not a false claim about the atlas", () => {
    // Vegan plus breakfast produced "Nothing classified as All and vegan anywhere in
    // the atlas". The occasion was missing, so the sentence said there is no vegan
    // food here at all. There is; none of it is also breakfast.
    expect(narrowingSummary("All", true, ["vegan", "breakfast"])).toBe(
      "Nothing recorded as vegan and breakfast",
    );
    expect(narrowingSummary("Fusion", false, ["vegan", "breakfast"])).toBe(
      "Nothing recorded as Fusion, vegan and breakfast",
    );
  });

  it("does not name the permissive filter as a reason", () => {
    // "Classified as All" is not a classification, and offering it as the reason
    // nothing matched implies a narrowing the reader never applied.
    expect(narrowingSummary("All", true, ["vegan"])).toBe("Nothing recorded as vegan");
    expect(narrowingSummary("All", true, [])).toBe("Nothing recorded");
  });

  it("names the filter when the reader did choose one", () => {
    expect(narrowingSummary("Fusion", false, [])).toBe("Nothing recorded as Fusion");
  });
});

describe("a rounded percentage that hides a real number", () => {
  it("does not print 0% next to a count that is not zero", () => {
    // "0% · 44" reads as a contradiction, and most people take the percentage and
    // conclude there are none. The classified-as-authentic meter is exactly this
    // case, and it is the figure a sceptical reader checks first.
    expect(percentLabel(44, 0)).toBe("<1%");
    expect(percentLabel(5, 0)).toBe("<1%");
  });

  it("keeps zero as zero, because zero is a different fact", () => {
    expect(percentLabel(0, 0)).toBe("0%");
  });

  it("leaves every other percentage alone", () => {
    expect(percentLabel(4621, 28)).toBe("28%");
    expect(percentLabel(16489, 100)).toBe("100%");
  });
});

describe('what counts as a country', () => {
  it('places a dish that outlived its state, and still does not call it a country', () => {
    // Both halves matter. Without a continent an Ottoman dish becomes unreachable;
    // counted as a country it puts fourteen states that no longer exist into a
    // headline whose whole job is to be honest.
    for (const state of ['Ottoman Empire', 'Joseon', 'Soviet Union', 'Byzantine Empire']) {
      expect(continentOf(state)).not.toBe('Elsewhere');
      expect(isHistoricalState(state)).toBe(true);
      expect(isCountry(state)).toBe(false);
    }
  });

  it('keeps the historical list in step with the continent map', () => {
    // The map holds these under a // Historical comment, which is a note to a person.
    // If one is added there and not here it silently becomes a country again.
    for (const state of ['Qing dynasty', 'Czechoslovakia', 'Aztec Empire', 'Inca Empire']) {
      expect(continentOf(state)).not.toBe('Elsewhere');
      expect(isCountry(state)).toBe(false);
    }
  });

  it('still calls a real country a country', () => {
    for (const name of ['India', 'Turkey', 'South Korea', 'Mexico']) {
      expect(isCountry(name)).toBe(true);
    }
  });

  it("names what a picker row is, where it is not a country", () => {
    // The alternative is a list headed "Choose a country" that puts Byzantine Empire
    // between Bulgaria and Croatia and lets the reader work it out.
    expect(placeKind("Byzantine Empire")).toBe("former state");
    expect(placeKind("Levant")).toBe("wider region");
    expect(placeKind("France")).toBe("");
  });

  it("folds a formal state name into the country", () => {
    // Wikidata says "Kingdom of the Netherlands", which listed three Dutch dishes
    // outside the Netherlands and outside Europe.
    expect(canonicalCountry("Kingdom of the Netherlands")).toBe("Netherlands");
    expect(isCountry(canonicalCountry("Kingdom of the Netherlands"))).toBe(true);
  });

  it('is asked about canonical names, which is what the records carry', () => {
    // `isCountry` reads the continent map, and that map is keyed by one spelling per
    // country. "Türkiye" is not in it; `canonicalCountry` turns it into "Turkey"
    // before a record ever stores it, so every caller passes the canonical form. This
    // test exists because the first version of the one above did not, and read like a
    // bug in the atlas rather than in itself.
    expect(isCountry('Türkiye')).toBe(false);
    expect(isCountry(canonicalCountry('Türkiye'))).toBe(true);
    for (const dish of catalogue) {
      expect(dish.loc.country).toBe(canonicalCountry(dish.loc.country));
    }
  });
});

describe('sending a tradition in', () => {
  it('requires only what makes a submission assessable', () => {
    // A dish and a place, because a name with nowhere attached cannot be assessed;
    // and a connection, which is the whole difference between this and copying a
    // recipe off the internet.
    expect(REQUIRED).toEqual(['dish', 'place', 'connection']);
    expect(missingFrom({ dish: '', place: '', cooks: '', ingredients: '', connection: '', photo: '' })).toEqual(['dish', 'place', 'connection']);
    expect(missingFrom({ dish: 'Kaipola', place: 'Kozhikode', cooks: 'households', ingredients: 'nendran banana', connection: 'born there', photo: 'K.jpg' })).toEqual([]);
  });

  it('does not count whitespace as an answer', () => {
    expect(missingFrom({ ...{ dish: 'Kaipola', place: 'Kozhikode', cooks: 'households', ingredients: 'nendran banana', connection: 'born there', photo: 'K.jpg' }, dish: '   ' })).toEqual(['dish']);
  });

  it('builds no link until there is somewhere to send it', () => {
    // The rule the donate button follows: a control that goes nowhere spends a
    // reader's goodwill on a dead link, and this reader has just typed out a recipe.
    if (!canContribute()) {
      expect(contributionUrl({ dish: 'Kaipola', place: 'Kozhikode', cooks: 'households', ingredients: 'nendran banana', connection: 'born there', photo: 'K.jpg' })).toBe('');
      return;
    }
    expect(contributionUrl({ dish: 'Kaipola', place: 'Kozhikode', cooks: 'households', ingredients: 'nendran banana', connection: 'born there', photo: 'K.jpg' })).toContain('Kaipola');
  });

  it('says on the screen that the later steps are an example', () => {
    // Not only in a comment. A worked example presented as a result is the same
    // untruth as a score that does not match its own breakdown.
    expect(WALKTHROUGH_NOTE).toMatch(/worked example/i);
    expect(WALKTHROUGH_NOTE).toMatch(/not from what you have just typed/i);
  });
});

describe('what a reader can honestly be asked', () => {
  it('does not ask a reader to confirm a method that is not there', () => {
    // 12,000 records said "Nobody has recorded how this is made" and then offered a
    // button marked "Yes — this matches". There was nothing to match.
    const blank = confirmAsk(false);
    expect(blank.yes).not.toMatch(/matches/i);
    expect(blank.kicker).toMatch(/from where we say it is/i);
    expect(blank.body).toMatch(/nothing here to agree with/i);
  });

  it('asks about the method where there is one', () => {
    const documented = confirmAsk(true);
    expect(documented.yes).toMatch(/matches/i);
    expect(documented.kicker).toMatch(/how it’s made/i);
  });

  it('always offers a way to disagree', () => {
    // The correction path is the one that actually feeds the pipeline, so it is
    // present whatever the record holds.
    for (const ask of [confirmAsk(true), confirmAsk(false)]) {
      expect(ask.no.length).toBeGreaterThan(0);
      expect(ask.yes.length).toBeGreaterThan(0);
    }
  });
});

describe('a region must name somewhere', () => {
  it('refuses an infobox that hedges instead of naming a place', () => {
    // "Primarily Central Europe" was truncated to "Primarily Central" and printed
    // under Kompot where a reader expects a town.
    expect(notAPlaceBelow('Primarily Central', 'Poland')).toMatch(/hedges/);
    expect(notAPlaceBelow('Various claims', 'China')).toMatch(/hedges/);
    expect(notAPlaceBelow('Throughout Indonesia', 'Indonesia')).toMatch(/hedges/);
  });

  it('still accepts a real place that happens to start with a similar word', () => {
    expect(notAPlaceBelow('Central Java', 'Indonesia')).toBeNull();
    expect(notAPlaceBelow('Kozhikode', 'India')).toBeNull();
  });
});

describe('a UNESCO inscription is not a dish name', () => {
  it('lifts the dish out of the inscription', () => {
    // The listing for ceviche is titled for the practice, which is correct of UNESCO
    // and useless on a card. Nothing is lost: the official title stays as the source.
    expect(dishFromInscription(
      'Practices and meanings associated with the preparation and consumption of ceviche, an expression of Peruvian traditional cuisine',
    )).toEqual({ name: 'ceviche' });
    expect(dishFromInscription('Culture of Ukrainian borscht cooking')).toEqual({ name: 'Ukrainian borscht' });
    expect(dishFromInscription('Al-Mansaf in Jordan, a festive banquet and its social and cultural meanings')).toEqual({
      name: 'Al-Mansaf',
    });
  });

  it('leaves a title that is already a name alone', () => {
    for (const name of ['Commandaria wine', 'Joumou soup', 'Mediterranean diet']) {
      expect(dishFromInscription(name)).toEqual({ name });
    }
  });

  it('refuses the inscriptions that are not food, with the reason', () => {
    // These were all showing as Authentic - Regional at 62/100, which is the slot
    // the atlas reserves for its best evidence. A carillon is a set of church bells.
    expect(dishFromInscription('Safeguarding the carillon culture: preservation, transmission')).toEqual({
      refused: 'NOT_FOOD_AT_ALL',
    });
    expect(dishFromInscription('Transhumance, the seasonal droving of livestock')).toEqual({
      refused: 'A_LIVELIHOOD',
    });
    expect(dishFromInscription('Feast of the Holy Forty Martyrs in Štip')).toEqual({ refused: 'A_GATHERING' });
    expect(dishFromInscription('Italian cooking, between sustainability and biocultural diversity')).toEqual({
      refused: 'A_WHOLE_CUISINE',
    });
  });

  it('does not refuse a dish for a word in its title', () => {
    // Keskek is a wheat and meat dish. A rule that refused it for "Ceremonial" would
    // be the over-reach the module warns about.
    expect(dishFromInscription('Ceremonial Keşkek tradition')).toEqual({ name: 'Keşkek' });
  });

  it('refuses rather than truncating when no shape matches', () => {
    // A truncated paragraph reads as a dish name, which is worse than no record.
    const invented = 'Assorted observances of a kind nobody has written a pattern for anywhere at all';
    expect(dishFromInscription(invented)).toEqual({ refused: 'NO_DISH_NAMED' });
  });

  it('never lets a sentence reach a card', () => {
    for (const dish of catalogue) {
      if (dish.id < 500_000 || dish.id >= 600_000) continue;
      expect(dish.name.length).toBeLessThanOrEqual(MAX_NAME);
    }
  });
});

describe('the real catalogue holds its invariants', () => {
  it('ships no record whose prose still contains wiki markup', () => {
    // Run against the whole catalogue, not a fixture. The 312 records that shipped
    // with "right|thumb|300px|" in their opening sentence were invisible to every
    // test here, because every test built its own two-record pool. A fixture only
    // ever proves the fixture.
    const problems = findCatalogueViolations(catalogue);
    expect(problems.slice(0, 5)).toEqual([]);
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

  it("catches a record that contradicts itself", () => {
    // The two rules here find nothing in the catalogue today, which is only worth
    // knowing if they can find anything at all. This project has shipped a record
    // printing "Nothing documents how this is made" above 899 characters of its own
    // method, so the check exists precisely because the prose and the fields it
    // describes are assembled separately.
    const badged: Dish = { ...halwa(), id: 96, atRisk: true, atRiskEvidence: undefined };
    expect(findCatalogueViolations([badged]).join(" ")).toMatch(/no sentence saying why/);

    const lying: Dish = {
      ...halwa(),
      id: 97,
      disclaimer: "Only the name and the place are recorded.",
    };
    expect(findCatalogueViolations([lying]).join(" ")).toMatch(/says nothing is recorded/);
  });

  it("does not treat a documented substitute as a contradiction", () => {
    // Four curated records carry the traditional badge and an adaptation, and that is
    // correct: the badge describes this record’s method, the adaptation names what
    // other people substitute. A rule pairing them would have deleted true content.
    const withBoth: Dish = { ...halwa(), id: 98 };
    expect(withBoth.traditionalBadge).toBe(true);
    expect(withBoth.adaptation).not.toBeNull();
    expect(findCatalogueViolations([withBoth])).toEqual([]);
  });

  it('catches wiki markup that reached a reader', () => {
    // 312 records shipped with "right|thumb|300px|" at the front of their prose,
    // because the File namespace is called Berkas in Indonesian and Tap tin in
    // Vietnamese and the prefix list only had the editions somebody thought of.
    // Checking the output rather than the stripper catches the next missed alias.
    const soupy: Dish = { ...halwa(), id: 94, prepSummary: 'right|thumb|300px| and then the prose' };
    expect(findCatalogueViolations([soupy]).join(' ')).toMatch(/still contains wiki markup/);

    const linky: Dish = { ...halwa(), id: 95, blurb: 'A sweet from [[Kerala]], made with ghee.' };
    expect(findCatalogueViolations([linky]).join(' ')).toMatch(/still contains wiki markup/);

    expect(findCatalogueViolations([halwa()])).toEqual([]);
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

describe('an untranslated account says which language it is in', () => {
  it('names the language rather than alluding to it', () => {
    // 'Shown in the language it was documented in' was true and useless once the
    // atlas began reading dishes in the language of the place they come from. A
    // reader who cannot read the script cannot tell Hindi from Marathi.
    const foreign: Dish = { ...halwa(), sourceLanguage: 'hi', translations: undefined };
    const reading = readDish(foreign, 'en');
    expect(reading.status).toBe('missing');
    expect(reading.note).toMatch(/shown in Hindi/);
  });

  it('says nothing at all when the reader already has the original', () => {
    const foreign: Dish = { ...halwa(), sourceLanguage: 'hi' };
    const reading = readDish(foreign, 'hi');
    expect(reading.status).toBe('original');
    expect(reading.note).toBe('');
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

describe('the home shelves are doorways, not decoration', () => {
  it('never shows the same tradition twice on one shelf', () => {
    for (const shelf of buildShelves(dishes)) {
      const ids = shelf.dishes.map((d) => d.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('never shows the same tradition on two shelves', () => {
    // The predicates overlap heavily — the best-evidenced photographed records are
    // at risk and authenticated and cookable at once. Without holding them back the
    // top three rails were literally the same three cards.
    const seen = new Set<number>();
    for (const shelf of buildShelves(dishes)) {
      for (const dish of shelf.dishes) {
        expect(seen.has(dish.id)).toBe(false);
        seen.add(dish.id);
      }
    }
  });

  it('never offers a shelf it cannot fill', () => {
    for (const shelf of buildShelves(dishes)) {
      expect(shelf.dishes.length).toBeGreaterThan(0);
      expect(shelf.total).toBeGreaterThanOrEqual(shelf.dishes.length);
    }
  });

  it('leads each rail with the records that have a photograph', () => {
    for (const shelf of buildShelves(dishes)) {
      const photos = shelf.dishes.map((d) => Boolean(d.photo));
      // Once the rail runs out of pictures it must not go back to them.
      expect(photos).toEqual([...photos].sort((a, b) => Number(b) - Number(a)));
    }
  });

  it('orders each rail by classification, never by whatever loaded first', () => {
    // Ordering on score alone left thousands of unscored records tied, so the rail
    // fell back to catalogue order — which is alphabetical, and put "A Nice Cup of
    // Tea" and a Fusion Hawaiian pizza on the front page.
    const rank = (l: string) =>
      ({ local: 5, regional: 4, variation: 3, adaptation: 2, unverified: 1, fusion: 0 })[l] ?? -1;
    for (const shelf of buildShelves(dishes)) {
      // Photographed cards lead the rail, so compare classification within that half.
      const ranks = shelf.dishes.filter((d) => d.photo).map((d) => rank(d.badgeLevel));
      expect(ranks).toEqual([...ranks].sort((a, b) => b - a));
    }
  });

  it('opens the browsing shelf on a different country every card', () => {
    // The imports arrive grouped by country, so ranking alone left this rail showing
    // six dishes from one place — an atlas that looks like it only knows about Canada.
    // Built from a catalogue big enough to reach the shelf: the seven curated
    // records are consumed by the shelves above it, which is the rule working.
    const spread = Array.from({ length: 40 }, (_, i) => ({
      ...dishes[i % dishes.length],
      id: 90_000 + i,
      atRisk: false,
      steps: [],
      badgeLevel: 'unverified' as const,
      // One photograph each. The fixture used to give all sixty the same URL, which
      // the shelves now refuse: two records sharing a picture look like a rendering
      // bug on one rail, so only the first of them is shown.
      photo: `https://example.test/p${i}.jpg`,
      loc: { ...dishes[0].loc, country: `Country ${i % 20}` },
    }));

    const shelf = buildShelves([...dishes, ...spread]).find((s) => s.id === 'illustrated');
    expect(shelf).toBeDefined();
    const countries = shelf!.dishes.map((d) => d.loc.country);
    expect(new Set(countries).size).toBe(countries.length);
  });

  it('never puts a fusion record ahead of a stronger one on the same rail', () => {
    // Not "never shows fusion" — on a small catalogue a shelf can have nothing else
    // left, and one honest card beats an empty rail. The rule is about order.
    for (const shelf of buildShelves(dishes)) {
      if (shelf.id === 'illustrated') continue; // ordered for variety, not rank
      const half = (withPhoto: boolean) => shelf.dishes.filter((d) => Boolean(d.photo) === withPhoto);
      for (const cards of [half(true), half(false)]) {
        const firstFusion = cards.findIndex((d) => d.badgeLevel === 'fusion');
        if (firstFusion === -1) continue;
        expect(cards.slice(firstFusion).every((d) => d.badgeLevel === 'fusion')).toBe(true);
      }
    }
  });

  it('opens a shelf onto exactly what the rail was showing', () => {
    // The count on the shelf header is a promise about the list behind it. This is
    // the check that the two cannot drift apart.
    for (const shelf of buildShelves(dishes)) {
      const match = shelfMatch(shelf.id);
      expect(match).not.toBeNull();
      expect(dishes.filter(match!).length).toBe(shelf.total);
      for (const dish of shelf.dishes) expect(match!(dish)).toBe(true);
    }
  });

  it('widens rather than empties when the shelf is unknown', () => {
    // 'all' and a stale id must both land on the whole catalogue. A doorway that
    // opens onto nothing is worse than one that opens onto everything.
    expect(shelfMatch('all')).toBeNull();
    expect(shelfMatch(null)).toBeNull();
    expect(shelfTitle('all')).toBeNull();
  });

  it('names every shelf it can open', () => {
    for (const shelf of buildShelves(dishes)) {
      expect(shelfTitle(shelf.id)).toBe(shelf.title);
    }
  });
});

describe('contributed photographs stay free and lawful', () => {
  it('refuses a social link and says what to do with it instead', () => {
    // The point is not to reject the paste. It is to tell someone holding their own
    // photograph how to publish it — which is the whole reason this route exists.
    for (const link of [
      'https://www.instagram.com/p/Cabc123/',
      'https://www.tiktok.com/@cook/video/123',
      'https://x.com/cook/status/123',
    ]) {
      const result = parsePhotoReference(link);
      expect(isRejection(result)).toBe(true);
      const rejection = result as PhotoRejection;
      expect(rejection.reason).toMatch(/no right to publish a photograph from there/);
      expect(rejection.fix).toMatch(/upload it to Wikimedia Commons/);
    }
  });

  it('reads a Commons file out of every shape people paste', () => {
    const shapes = [
      'Kaipola.jpg',
      'File:Kaipola.jpg',
      'https://commons.wikimedia.org/wiki/File:Kaipola.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/a/ab/Kaipola.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Kaipola.jpg',
    ];
    for (const shape of shapes) {
      const result = parsePhotoReference(shape);
      expect(isRejection(result)).toBe(false);
      expect((result as { file: string }).file).toBe('Kaipola.jpg');
    }
  });

  it('turns underscores back into spaces, as Commons titles do', () => {
    expect(parsePhotoReference('File:Bowl_of_Ukrainian_Borscht.jpg')).toEqual({
      file: 'Bowl of Ukrainian Borscht.jpg',
    });
  });

  it('refuses a link that is simply not on Commons', () => {
    const result = parsePhotoReference('https://example.com/my-photo.jpg');
    expect(isRejection(result)).toBe(true);
    expect((result as PhotoRejection).reason).toMatch(/not on Wikimedia Commons/);
  });

  it('refuses anything that is not a photograph', () => {
    for (const file of ['Kaipola.svg', 'Kaipola.pdf', 'Kaipola']) {
      expect(isRejection(parsePhotoReference(file))).toBe(true);
    }
  });

  it('accepts the free licences and refuses the ones that only look free', () => {
    for (const free of ['CC BY-SA 4.0', 'CC-BY-3.0', 'CC0', 'Public domain', 'GFDL', 'cc by sa 4.0']) {
      expect(isFreeLicence(free)).toBe(true);
    }
    // NonCommercial and NoDerivatives are not free licences, and both contain a
    // substring that matches the pattern for one that is.
    for (const unfree of ['CC BY-NC 4.0', 'CC BY-NC-SA 3.0', 'CC BY-ND 4.0', 'Fair use', '']) {
      expect(isFreeLicence(unfree)).toBe(false);
    }
  });

  it('refuses a licence it does not recognise rather than assuming it is free', () => {
    expect(isFreeLicence('Some bespoke permission, see talk page')).toBe(false);
  });
});

describe('correcting a contribution never tidies away the food', () => {
  it('strips invisible characters from a name and changes nothing else', () => {
    // A zero-width joiner makes a name unsearchable while looking identical, so it
    // goes. Every visible mark stays exactly as the cook wrote it.
    expect(tidyTerm('Hák\u200Barl')).toBe('Hákarl');
    for (const name of ['Hákarl', "Al-Man'ouché", 'peanut butter', 'Kozhikode Halwa', 'ايس كريم']) {
      expect(tidyTerm(name)).toBe(name);
    }
  });

  it('never strips an accent, changes case, or rewrites an apostrophe', () => {
    // Each of these would look like a tidy-up in a diff and would be a different word.
    expect(tidyTerm('Hákarl')).not.toBe('Hakarl');
    expect(tidyTerm('peanut butter')).not.toBe('Peanut Butter');
    expect(tidyTerm("Al-Man'ouché")).not.toBe('Al-Manouche');
  });

  it('collapses accidental whitespace in prose, which carries no meaning', () => {
    expect(tidyProse('Cooked  slowly\u00A0over\n embers.')).toBe('Cooked slowly over embers.');
  });

  it('asks a human about a near-identical name instead of merging it', () => {
    // The app cannot tell a typo from a second community's spelling, and guessing
    // wrong in the merging direction destroys a tradition silently.
    const advisories = nearbyNames('Kozhikode Halwa', 'India', [
      { ...halwa(), name: 'Kozhikode Halva' },
    ] as Dish[]);
    expect(advisories).toHaveLength(1);
    expect(advisories[0].consider).toMatch(/do not merge the spellings/);
  });

  it('reads a close name in another country as a sibling, not an error', () => {
    const advisories = nearbyNames('Baklawa', 'Lebanon', [
      { ...halwa(), name: 'Baklava', loc: { ...halwa().loc, country: 'Turkey' } },
    ] as Dish[]);
    expect(advisories[0].note).toMatch(/Turkey/);
    expect(advisories[0].consider).toMatch(/siblings rather than choosing one spelling/);
  });

  it('says nothing about names that are merely both food', () => {
    expect(nearbyNames('Kaipola', 'India', [halwa(), pizza(), hawaiian()])).toEqual([]);
  });

  it('flags shouting and stuck keys in prose, and applies neither fix', () => {
    expect(reviewProse('COOKED OVER EMBERS', 'blurb')[0].note).toMatch(/capitals/);
    expect(reviewProse('Cooked over embersssss.', 'blurb')[0].note).toMatch(/repeats/);
    expect(reviewProse('Fry it.', 'method')[0].consider).toMatch(/including the waiting/);
  });

  it('tells the reviewer the rule in the app s own voice', () => {
    expect(EDITORIAL_RULE).toMatch(/Fix our writing freely/);
    expect(EDITORIAL_RULE).toMatch(/accents and all/);
    expect(EDITORIAL_RULE).toMatch(/two communities rather than a mistake/);
  });
});

describe('a language is offered only when the catalogue can fill it', () => {
  it('knows far more languages than it offers', () => {
    // Wide on purpose: a short list tells most of the world their food is welcome
    // but their reading is not.
    expect(LANGUAGES.length).toBeGreaterThan(70);
    expect(offeredLanguages({}).length).toBe(1);
  });

  it('always offers English, which needs no coverage to be honest', () => {
    expect(offeredLanguages({}).map((l) => l.code)).toEqual(['en']);
    expect(offeredLanguages({ ml: 9_999 }).map((l) => l.code)).toContain('en');
  });

  it('opens a language once it clears the floor and not before', () => {
    const justUnder = offeredLanguages({ ml: MIN_RECORDS_PER_LANGUAGE - 1 });
    expect(justUnder.map((l) => l.code)).not.toContain('ml');

    const justOver = offeredLanguages({ ml: MIN_RECORDS_PER_LANGUAGE });
    expect(justOver.map((l) => l.code)).toContain('ml');
  });

  it('lets the floor move, because it is a starting point and not a law', () => {
    expect(offeredLanguages({ ta: 40 }, 25).map((l) => l.code)).toContain('ta');
    expect(offeredLanguages({ ta: 40 }, 500).map((l) => l.code)).not.toContain('ta');
  });

  it('shows a reader their language coming rather than simply missing', () => {
    const progress = languageProgress({ ta: 200, ka: 10 });
    const tamil = progress.find((p) => p.language.code === 'ta');
    expect(tamil).toEqual({ language: expect.objectContaining({ code: 'ta' }), records: 200, needed: 50 });
    // Nearest first, so the next language to open is the one named at the top.
    expect(progress[0].language.code).toBe('ta');
  });

  it('counts an article and a translation alike, and a record only once', () => {
    const coverage = coverageOf([
      { readableIn: ['ml', 'ta'] },
      // Reachable both ways — still one record for Malayalam.
      { readableIn: ['ml'], translations: { ml: {}, fr: {} } },
      {},
    ]);
    expect(coverage).toEqual({ ml: 2, ta: 1, fr: 1 });
  });

  it('carries an endonym for every language it claims a record is readable in', () => {
    // The name in another language is shown beside the original, never instead, so
    // every offered language needs its own script to be recognisable in the picker.
    for (const language of LANGUAGES) {
      expect(language.endonym.trim().length).toBeGreaterThan(0);
      expect(language.label.trim().length).toBeGreaterThan(0);
    }
    expect(new Set(LANGUAGES.map((l) => l.code)).size).toBe(LANGUAGES.length);
  });
});

describe('every headline number can be checked by the reader', () => {
  it('explains each figure the atlas puts on screen', () => {
    // The atlas asks nobody to take a dish's authenticity on trust. It cannot then
    // print a number in large type and decline to say what was counted.
    const shown = [
      'total',
      'countries',
      'atRisk',
      'documented',
      'located',
      'illustrated',
      'filmed',
      'assessed',
      'concentration',
      'confidence',
      'byContinent',
    ];
    for (const key of shown) expect(metricNote(key)).toBeDefined();
  });

  it('gives every figure a unit, a method and a caveat', () => {
    for (const [key, note] of Object.entries(METRIC_NOTES)) {
      expect({ key, title: note.title.length > 0 }).toEqual({ key, title: true });
      expect({ key, counts: note.counts.length > 40 }).toEqual({ key, counts: true });
      expect({ key, method: note.method.length > 40 }).toEqual({ key, method: true });
      // The caveat is the point. A figure that flatters the atlas stops here.
      expect({ key, caveat: note.caveat.length > 40 }).toEqual({ key, caveat: true });
    }
  });

  it('says plainly that the at-risk count is a floor and not a census', () => {
    // This is the number a reader is most likely to misread as reassuring.
    const note = metricNote('atRisk')!;
    expect(note.caveat).toMatch(/floor, not a census/);
    expect(note.caveat).toMatch(/Ark of Taste/);
    expect(note.method).toMatch(/evidence/);
  });

  it('refuses to let the total imply the atlas knows more than it does', () => {
    expect(metricNote('total')!.caveat).toMatch(/not a count of the world/);
    expect(metricNote('countries')!.caveat).toMatch(/Coverage is not depth/);
  });
});

describe('the catalogue holds food, under the names people use', () => {
  it('admits no restaurant, company or film', () => {
    // A category walk through "Indian cuisine" reaches the restaurants that serve it
    // and the films named after it. A record for a restaurant chain in an atlas of
    // how food is made is simply wrong.
    const notFood = catalogue.filter((d) =>
      /\((restaurant|restaurant chain|company|brand|film|movie|TV series|album|song)\)\s*$/i.test(d.name),
    );
    expect(notFood.map((d) => d.name)).toEqual([]);
  });

  it("strips the encyclopaedia's disambiguator but keeps the source's own gloss", () => {
    // "(food)" is Wikipedia separating an article from a film of the same name —
    // nobody calls it "momo food". "(Soaked Cassava Flakes)" is the source telling
    // the reader what the dish is, and that is worth keeping.
    const indexed = catalogue.filter((d) =>
      /\((food|dish|drink|dessert|bread|pastry|snack|soup|cheese|wine)\)\s*$/i.test(d.name),
    );
    expect(indexed.map((d) => d.name)).toEqual([]);

    const glossed = catalogue.filter((d) => /\([^)]{12,}\)\s*$/.test(d.name));
    expect(glossed.length).toBeGreaterThan(0);
  });

  it('leaves every name with something to show', () => {
    for (const dish of catalogue) {
      expect({ id: dish.id, empty: dish.name.trim().length === 0 }).toEqual({ id: dish.id, empty: false });
    }
  });
});

describe('only food reaches the catalogue', () => {
  it('refuses companies, venues, people and reference articles', () => {
    const cases: [string, RegExp][] = [
      ['Kerala State Beverages Corporation', /company/],
      ['Murree Brewery', /company/],
      ['Nine Rivers Distillery', /company/],
      ['Annapurna Cafe', /place that serves food/],
      ['Dindigul Thalappakatti Restaurant', /place that serves food/],
      ['Douglas Wright (cricketer, born 1894)', /labels it as something other than a food/],
      ['Glossary of sake terms', /reference article/],
      ['History of Chinese cuisine', /reference article/],
      ['Hunan cuisine', /whole cuisine/],
      ['Dishoom (restaurant)', /labels it as something other than a food/],
    ];
    for (const [name, reason] of cases) {
      expect({ name, why: notAFood(name) ?? 'kept' }).toEqual({ name, why: expect.stringMatching(reason) });
    }
  });

  it('keeps the foods that look like the things it refuses', () => {
    // Each of these was deleted by an earlier draft of the rules, and each is real.
    const keep = [
      'Simple Restaurant Miso Soup', // "restaurant" mid-name; a Cookbook recipe
      'Chacha (brandy)', // "brand" is a prefix of "brandy"
      'Cod, Olive Oil, and Cream Sauce (Brandade de Morue)',
      'Culture of Ukrainian borscht cooking', // UNESCO phrasing for a real tradition
      'Practices and meanings associated with the preparation and consumption of ceviche, an expression of Peruvian traditional cuisine',
    ];
    for (const name of keep) expect({ name, why: notAFood(name) }).toEqual({ name, why: null });
  });

  it('lets nothing with a method or real evidence be refused', () => {
    // The asymmetry that shapes these rules: deleting a real tradition is silent and
    // permanent, keeping a brewery merely looks foolish.
    for (const dish of catalogue) {
      if (dish.steps.length > 0 || dish.atRisk || isAuthentic(dish.badgeLevel)) {
        expect({ name: dish.name, why: notAFood(dish.name) }).toEqual({ name: dish.name, why: null });
      }
    }
  });
  it("honours Wikidata's verdict on what is not a food", () => {
    // The catch that no rule written against a name can make: the most-read record
    // in the catalogue was a basketball player, reached through a category of
    // Chinese winemakers, whose name looks exactly like a dish.
    for (const forbidden of ['Yao Ming', 'Moringa oleifera', 'Guinea pig', 'Mantis shrimp']) {
      expect({ forbidden, present: catalogue.some((d) => d.name === forbidden) }).toEqual({
        forbidden,
        present: false,
      });
    }
  });

  it('places the best-known dishes where they come from', () => {
    // Each of these was filed under the country that eats it rather than the one it
    // is from, because a dish sits in every cuisine category that serves it.
    const expected: Record<string, string> = {
      Pierogi: 'Poland',
      Borscht: 'Ukraine',
      'Chicken tikka masala': 'United Kingdom',
      Falafel: 'Egypt',
    };
    for (const [name, country] of Object.entries(expected)) {
      const dish = catalogue.find((d) => d.name === name);
      expect({ name, country: dish?.loc.country }).toEqual({ name, country });
    }
  });
});

describe('a region is a place, and a place below its country', () => {
  it('refuses a category label dressed as geography', () => {
    // The cuisine ingest filled this field from Wikipedia subcategories, which are
    // shelves in a library rather than somewhere you can go.
    for (const [region, country] of [
      ['Japanese rice', 'Japan'],
      ['Korean tea', 'South Korea'],
      ['Chinese alcoholic beverages', 'China'],
      ['Indian snack foods', 'India'],
      ['Wineries of South Africa', 'South Africa'],
      ['South Indian cuisine', 'India'],
    ] as const) {
      expect({ region, why: notAPlaceBelow(region, country) }).toEqual({
        region,
        why: expect.stringMatching(/category of food/),
      });
    }
  });

  it('refuses an area that contains the country rather than sitting inside it', () => {
    // "Thailand › Southeast Asia" tells the reader the world is the wrong way round.
    for (const [region, country] of [
      ['Southeast Asia', 'Thailand'],
      ['Indian subcontinent', 'India'],
      ['East Asia', 'China'],
      ['Middle East', 'Lebanon'],
    ] as const) {
      expect({ region, why: notAPlaceBelow(region, country) }).toEqual({
        region,
        why: expect.stringMatching(/larger than the country/),
      });
    }
  });

  it('keeps real places, including the ones named "X of Y"', () => {
    // An earlier draft rejected every "of" phrase as a category title and removed
    // 282 genuine provinces with it. Places are named that way more often than
    // shelves are.
    for (const [region, country] of [
      ['Kerala', 'India'],
      ['Campania', 'Italy'],
      ['Province of Chieti', 'Italy'],
      ['Autonomous Republic of Crimea', 'Ukraine'],
      ['County of Savoy', 'Holy Roman Empire'],
      ['Mar del Plata', 'Argentina'],
    ] as const) {
      expect({ region, why: notAPlaceBelow(region, country) }).toEqual({ region, why: null });
    }
  });

  it('refuses a nationality standing in for a region', () => {
    // The class that survived every other rule. 'Northeastern Chinese' holds no food
    // word and no continent, so it read as a region of Ukraine on the borscht record
    // — one country's nationality filed inside another.
    for (const [region, country] of [
      ['Northeastern Chinese', 'Ukraine'],
      ['American Chinese', 'China'],
      ['South Indian', 'India'],
      ['Kurdish', 'Iran'],
    ]) {
      expect({ region, why: notAPlaceBelow(region, country) }).toEqual({
        region,
        why: expect.stringMatching(/nationality, not a place/),
      });
    }
  });

  it('keeps places that merely contain a nationality', () => {
    // Only a bare nationality is refused. 'Chinese Camp' is a town in California and
    // 'Western Iceland' is a region, because 'camp' and 'Iceland' are not demonyms.
    for (const [region, country] of [
      ['Chinese Camp', 'United States'],
      ['Western Iceland', 'Iceland'],
      ['South Australia', 'Australia'],
    ]) {
      expect({ region, why: notAPlaceBelow(region, country) }).toEqual({ region, why: null });
    }
  });

  it('still refuses a region that merely repeats its country', () => {
    expect(notAPlaceBelow("People's Republic of China", 'China')).toMatch(/repeats the country/);
  });

  it('leaves no category label in any breadcrumb', () => {
    for (const dish of catalogue) {
      if (!dish.loc.region) continue;
      expect({ crumb: `${dish.loc.country} › ${dish.loc.region}`, why: notAPlaceBelow(dish.loc.region, dish.loc.country) }).toEqual(
        { crumb: `${dish.loc.country} › ${dish.loc.region}`, why: null },
      );
    }
  });
});

describe('one country, one name', () => {
  it('merges the conventions the sources disagree on', () => {
    // The picker showed China 705 beside People's Republic of China 120, with no
    // way for a reader to tell the smaller one was not a different country.
    for (const [given, expected] of [
      ["People's Republic of China", 'China'],
      ['Türkiye', 'Turkey'],
      ['Ivory Coast', "Côte d'Ivoire"],
      ['Holland', 'Netherlands'],
      ['Burma', 'Myanmar'],
      ['Kingdom of France', 'France'],
      ['USA', 'United States'],
    ] as const) {
      expect({ given, is: canonicalCountry(given) }).toEqual({ given, is: expected });
    }
  });

  it('keeps Taiwan and North Korea out of their larger neighbours', () => {
    // Any rule that strips "Republic of" folds these onto China and South Korea,
    // which would be a political claim made by accident. The Republic of China is
    // Taiwan's own name, and that is where it goes.
    expect(canonicalCountry('Republic of China')).toBe('Taiwan');
    expect(canonicalCountry("Democratic People's Republic of Korea")).toBe('North Korea');
    expect(canonicalCountry('Taiwan')).not.toBe('China');
    expect(canonicalCountry('North Korea')).not.toBe('South Korea');
  });

  it('leaves a historical state alone', () => {
    // The Byzantine Empire is not modern Turkey, and a dish attributed to it is
    // telling the reader something true.
    for (const name of ['Byzantine Empire', 'Ottoman Empire', 'Czechoslovakia', 'Austrian Empire']) {
      expect(canonicalCountry(name)).toBe(name);
    }
  });

  it('lists no country twice in the catalogue', () => {
    const seen = new Map<string, string>();
    for (const dish of catalogue) {
      const canonical = canonicalCountry(dish.loc.country);
      expect({ country: dish.loc.country, canonical }).toEqual({
        country: dish.loc.country,
        canonical: dish.loc.country,
      });
      seen.set(canonical, dish.loc.country);
    }
    expect(seen.size).toBeGreaterThan(150);
  });
});

describe('the donation page does not invent a budget', () => {
  it('says plainly that most of it costs nothing', () => {
    // "Support our servers" is the standard line and it is false for most small
    // projects. An app that deletes fabricated view counts cannot invent a budget.
    const free = FUNDING_NEEDS.filter((n) => /nothing/i.test(n.cost));
    expect(free.length).toBeGreaterThanOrEqual(2);
    expect(FUNDING_NEEDS.some((n) => /Wikipedia|Wikidata|Commons/.test(n.why))).toBe(true);
  });

  it('names the one thing that actually costs money', () => {
    const translation = FUNDING_NEEDS.find((n) => n.title === 'Translation')!;
    expect(translation.why).toMatch(/only part of this project that costs money/);
    expect(translation.cost).not.toMatch(/nothing/i);
  });

  it('tells a reader what money cannot buy', () => {
    // Said because the product's claim is that classification comes from evidence
    // and from people who cook the food. Somebody just asked for money is entitled
    // to know the money does not move a badge.
    expect(NOT_FOR_SALE.join(' ')).toMatch(/cannot be made Authentic by paying/);
    expect(NOT_FOR_SALE.join(' ')).toMatch(/no reader is tracked/);
  });

  it('builds an Open Collective destination from a slug, not a pasted URL', () => {
    // One place the destination can be wrong, and it is obvious when it is.
    if (!OPEN_COLLECTIVE_SLUG) {
      expect(DONATION_URL).toBe('');
      expect(LEDGER_URL).toBe('');
      return;
    }
    expect(DONATION_URL).toBe(`https://opencollective.com/${OPEN_COLLECTIVE_SLUG}`);
    expect(LEDGER_URL).toBe(`${DONATION_URL}/transactions`);
  });

  it('shows no donate button until there is somewhere to send money', () => {
    // A control pointing nowhere spends a reader's goodwill on a dead link.
    expect(canAcceptDonations()).toBe(DONATION_URL.length > 0);
  });
});

describe('finding sources without judging them', () => {
  const arisa: RecordFacts = {
    name: 'Arisa',
    country: 'Malaysia',
    region: '',
    cuisine: 'Malay',
    ingredients: ['chicken', 'rice'],
  };

  it('refuses the match that actually happened — a dish name that is also a singer', () => {
    // The real failure: searching by name illustrated this Malaysian chicken dish
    // with an Italian singer at Sanremo. The page says "Arisa" and nothing else the
    // record knows, which is two things sharing a word, not a source.
    const sanremo = {
      title: 'Arisa',
      publisher: 'Wikisource',
      url: 'https://example.org/arisa',
      text: 'Arisa is an Italian singer who won the Sanremo Music Festival.',
    };
    expect(considerSource(sanremo, arisa)).toEqual({ refused: 'NO_CORROBORATION' });
  });

  it('accepts a source that corroborates something the record already knows', () => {
    const real = {
      title: 'Malay Cookery',
      publisher: 'Wikisource',
      url: 'https://example.org/malay-cookery',
      text: 'Arisa, as made in Malaysia, is prepared with chicken and rice.',
    };
    const result = considerSource(real, arisa);
    expect('accepted' in result).toBe(true);
    if (!('accepted' in result)) return;
    expect(result.accepted.corroborates).toContain('Malaysia');
    expect(result.accepted.corroborates).toContain('chicken');
  });

  it('refuses a name that is an ordinary English word, however well corroborated', () => {
    // A Victorian cookbook mentions "bread" and "India" on most pages without the
    // two having anything to do with each other. Full-text search cannot identify
    // these records at all, and saying so is better than filtering harder.
    const facts: RecordFacts = {
      name: 'Bread',
      country: 'India',
      region: 'Punjab',
      cuisine: '',
      ingredients: ['flour'],
    };
    const cookbook = {
      title: 'The Book of Household Management',
      publisher: 'Wikisource',
      url: 'https://example.org/beeton',
      text: 'Bread of every kind. Flour from India, Punjab and elsewhere, boiled and baked.',
    };
    expect(considerSource(cookbook, facts)).toEqual({ refused: 'NAME_IS_A_COMMON_WORD' });
  });

  it('does not match a name inside a longer word', () => {
    const facts: RecordFacts = { name: 'Ugali', country: 'Kenya', region: '', cuisine: '', ingredients: [] };
    const wrong = {
      title: 'Elsewhere',
      publisher: 'Wikisource',
      url: 'https://example.org/x',
      text: 'The Ugalimwana river in Kenya.',
    };
    expect(considerSource(wrong, facts)).toEqual({ refused: 'NAME_ABSENT' });
  });

  it('compares across accents, so an unaccented corpus still matches', () => {
    const facts: RecordFacts = {
      name: 'Bánh mì',
      country: 'Vietnam',
      region: '',
      cuisine: '',
      ingredients: [],
    };
    const text = {
      title: 'Indochina',
      publisher: 'Wikisource',
      url: 'https://example.org/i',
      text: 'Banh mi is sold on the streets of Vietnam.',
    };
    expect('accepted' in considerSource(text, facts)).toBe(true);
  });

  it('calls a text a method only when it reads as instructions', () => {
    expect(describesMethod('It is served with rice.')).toBe(false);
    expect(describesMethod('Boil the rice, add salt, stir, and cover for ten minutes.')).toBe(true);
  });

  it('says in the note what it established and what it did not', () => {
    const accepted = {
      candidate: { title: 'T', publisher: 'P', url: 'u', text: 't' },
      corroborates: ['Malaysia'],
      describesMethod: false,
    };
    expect(sourceNote(accepted)).toMatch(/Found by searching open archives/);
    expect(sourceNote(accepted)).toMatch(/does not describe how the dish is made/);
    expect(sourceNote({ ...accepted, describesMethod: true })).toMatch(/nobody has confirmed/);
  });

  it("refuses to cite a source that never describes cooking", () => {
    // Presidential Proclamation 7235, a tariff schedule, was the only candidate
    // Wikisource ever yielded. It names peanut butter and it names the United
    // States, so it passes every corroboration check honestly — and it says nothing
    // about how anyone makes peanut butter, which is what the record is missing.
    const tariff = {
      candidate: { title: "Proclamation 7235", publisher: "Wikisource", url: "u", text: "t" },
      corroborates: ["United States", "Peanuts"],
      describesMethod: false,
    };
    expect(worthCiting(tariff)).toBe(false);
    expect(worthCiting({ ...tariff, describesMethod: true })).toBe(true);
  });

  it('never permits the finder to write a field that would raise a classification', () => {
    // The containment that makes this safe to run at scale. If someone adds
    // 'heritage' to what the finder may write, a book claiming a food is traditional
    // starts producing Authentic — Regional badges, and this test is the tripwire.
    for (const field of ['heritage', 'badgeLevel', 'score', 'breakdown']) {
      expect(FINDER_MAY_WRITE).not.toContain(field);
      expect(FINDER_MAY_NEVER_WRITE).toContain(field);
    }
  });

  it('cannot raise a record above Unverified, even when every check passes', () => {
    // The proof of the paragraph above, run through assess() rather than asserted.
    // An account is the strongest thing a found source can contribute.
    const withAccount = assess({
      hasCountry: true,
      hasRegion: true,
      ingredients: [],
      heritage: [],
      hasArticle: false,
      extractLength: 0,
      hasAccount: true,
    });
    expect(withAccount.level).toBe('unverified');
    expect(withAccount.score).toBeNull();
  });
});

describe('what counts as a line of a recipe', () => {
  it('splits a bullet list that lost its newlines back into ingredients', () => {
    expect(recipeLines(['*Yam *Water'])).toEqual(['Yam', 'Water']);
    expect(recipeLines(['*Ewedu *Gbegiri *Obe ata'])).toEqual(['Ewedu', 'Gbegiri', 'Obe ata']);
    expect(recipeLines(['*sesame *anise seeds *milk *eggs *sugar'])).toEqual([
      'sesame', 'anise seeds', 'milk', 'eggs', 'sugar',
    ]);
  });

  it('leaves an asterisk that is not a bullet exactly as the author wrote it', () => {
    /*
     * Each of these is in the corpus, and each would be mangled by a rule that
     * treated every asterisk as markup. The multiplication is the worst of them:
     * splitting it would turn one correct quantity into two wrong ones.
     */
    const untouched = [
      'versez le riz avec une fois et demi son volume d’eau (150g*1.5=225ml d’eau)',
      'Nudeln und die Soße zusammen in einen Topf geben und anrichten *guten Appetit*',
      '2 blancs de poireaux (facultatif)*,',
      'piquer le à la cuisse, qui est le morceau le plus *long à cuire',
    ];
    expect(recipeLines(untouched)).toEqual(untouched);
  });

  it('strips a single leading bullet without splitting the line', () => {
    expect(recipeLines(['* 1/2 Kg de cebolla'])).toEqual(['1/2 Kg de cebolla']);
    expect(recipeLines(['* Picar a cebola finamente e fritar num tacho com azeite'])).toEqual([
      'Picar a cebola finamente e fritar num tacho com azeite',
    ]);
  });

  it('keeps the instruction and drops the page furniture stuck to its end', () => {
    /*
     * Teurgoule's last step is "serve at room temperature", followed by the article's
     * own interwiki links. Dropping the whole line would take the instruction with it,
     * which is why furniture truncates rather than deletes.
     */
    expect(
      recipeLines(['Servez à température ambiante Fallue Teurgoule Teurgoule en:Cookbook:Teurgoule']),
    ).toEqual(['Servez à température ambiante Fallue Teurgoule Teurgoule']);
  });

  it('drops a line that is nothing but furniture', () => {
    expect(recipeLines(['Kategorie:Kochbuch/ Desserts'])).toEqual([]);
    expect(recipeLines(['Erfasst von: --Ralf Roletschek 22:53, 31.'])).toEqual([]);
    expect(recipeLines(['---- Stammt von Wikipedia, Hauptautor war Choel'])).toEqual([]);
    expect(recipeLines(['= Liens externes = Boule de riz'])).toEqual([]);
    expect(recipeLines(['--marhac 16:07, 8.'])).toEqual([]);
  });

  it('drops a line with nothing a reader can use', () => {
    expect(recipeLines(['...', '', '  ', '----', '•'])).toEqual([]);
  });
});

describe('HTML entities in the fields a cook reads', () => {
  it('decodes the quantity, the temperature and the letter', () => {
    expect(decodeEntities('approx. &frac34; pounds (330 g) apples')).toBe('approx. ¾ pounds (330 g) apples');
    expect(decodeEntities('Bake at 180&deg;C')).toBe('Bake at 180°C');
    expect(decodeEntities('1 large (2.5&nbsp;kg / 5 lb) cabbage')).toBe('1 large (2.5 kg / 5 lb) cabbage');
    expect(decodeEntities('50&ndash;60 g suet')).toBe('50–60 g suet');
    expect(decodeEntities('Roll the Aramba&#353;ici')).toBe('Roll the Arambašici');
    expect(decodeEntities('&#189; cup sugar')).toBe('½ cup sugar');
  });

  it('leaves an entity it does not know as itself, rather than guessing', () => {
    /*
     * A visible fault can be found and fixed. A silent replacement character cannot,
     * and in a quantity it would be a number nobody can recover.
     */
    expect(decodeEntities('&notarealentity; of flour')).toBe('&notarealentity; of flour');
    expect(decodeEntities('&#99999999; of flour')).toBe('&#99999999; of flour');
  });

  it('leaves text with no entity in it untouched', () => {
    expect(decodeEntities('2 cups plain flour')).toBe('2 cups plain flour');
    expect(decodeEntities('salt & pepper')).toBe('salt & pepper');
  });
});

describe('which language the app speaks to the reader in', () => {
  const AVAILABLE = ['en', 'es', 'fr', 'de', 'pt'];

  it('honours the reader’s order, not ours', () => {
    // Someone who lists Catalan before Spanish has said something. Reading the list
    // in their order rather than ours is the difference between hearing it and not.
    expect(negotiateLocale(['ca', 'es', 'en'], AVAILABLE)).toBe('es');
    expect(negotiateLocale(['fr', 'de'], AVAILABLE)).toBe('fr');
    expect(negotiateLocale(['de', 'fr'], AVAILABLE)).toBe('de');
  });

  it('takes an exact match anywhere in the list over a base match earlier in it', () => {
    /*
     * A reader asking for pt-BR and then en should get Portuguese, not English:
     * the second choice is a fallback, not a preference over their own language.
     */
    expect(negotiateLocale(['pt-BR', 'en'], ['en', 'pt-BR', 'pt'])).toBe('pt-BR');
    expect(negotiateLocale(['pt-BR', 'en'], ['en', 'pt'])).toBe('pt');
  });

  it('matches a region to its language', () => {
    expect(negotiateLocale(['en-GB'], AVAILABLE)).toBe('en');
    expect(negotiateLocale(['es-419'], AVAILABLE)).toBe('es');
    expect(negotiateLocale(['de_AT'], AVAILABLE)).toBe('de');
  });

  it('falls back to English rather than to nothing', () => {
    expect(negotiateLocale(['mt', 'is'], AVAILABLE)).toBe('en');
    expect(negotiateLocale([], AVAILABLE)).toBe('en');
    expect(negotiateLocale(['fr'], [])).toBe('en');
  });
});

describe('the chrome in other languages', () => {
  it('offers every catalogue that exists, English first', () => {
    expect(UI_LOCALES[0]).toBe('en');
    expect(UI_LOCALES.length).toBeGreaterThan(1);
  });

  it('puts English behind every key, so a partial catalogue is still usable', () => {
    for (const locale of UI_LOCALES) {
      const copy = copyFor(locale);
      const blank = Object.entries(copy).filter(([, value]) => !String(value).trim());
      expect({ locale, blank }).toEqual({ locale, blank: [] });
    }
  });

  it('never echoes English back as though it were a translation', () => {
    /*
     * A catalogue may be incomplete — the English key set is still growing as strings
     * come out of the screens, and a missing key falls through to English on purpose.
     * What it may not do is *claim* a key and put the English in it, because then the
     * coverage figure below says a language is done when it is not.
     *
     * Missing is honest. Present-but-untranslated is not.
     */
    for (const locale of UI_LOCALES.filter((l) => l !== 'en')) {
      const catalogue = CATALOGUES[locale];
      const echoed = Object.entries(catalogue).filter(
        ([key, value]) => value === EN[key as keyof typeof EN],
      );
      expect({ locale, echoed }).toEqual({ locale, echoed: [] });
    }
  });

  it('reports how much of each language is done', () => {
    // Not an assertion that they are finished — an assertion that we can tell.
    expect(translationCoverage('en')).toBe(1);
    for (const locale of UI_LOCALES.filter((l) => l !== 'en')) {
      expect(translationCoverage(locale)).toBeGreaterThan(0);
      expect(translationCoverage(locale)).toBeLessThanOrEqual(1);
    }
  });

  it('says a machine translated it, in the language it was translated into', () => {
    // The reader is entitled to know who translated what they are reading — the same
    // rule translate.ts applies to a record, for the same reason.
    for (const locale of UI_LOCALES.filter((l) => l !== 'en')) {
      expect(isMachineTranslated(locale)).toBe(true);
      expect(copyFor(locale).interfaceTranslationNote).not.toBe(EN.interfaceTranslationNote);
    }
    expect(isMachineTranslated('en')).toBe(false);
  });
});

describe('a record moves up when the community confirms it', () => {
  /** Everything a published source can possibly supply, and nothing a person can. */
  const bestDocumented = {
    hasCountry: true,
    hasRegion: true,
    ingredients: ['a', 'b', 'c'],
    heritage: ['Protected Designation of Origin (PDO), European Union register'],
    hasArticle: true,
    extractLength: 2000,
    hasAccount: true,
    registerMethod: true,
  };

  it('cannot reach the promotion threshold on documentation, however much there is', () => {
    /*
     * The guarantee the threshold rests on: `localSource` and `community` are both
     * zero without confirmations, so the arithmetic cannot get there. If this ever
     * fails, a record can be promoted without anybody from the place saying a word.
     *
     * It is deliberately *not* an assertion that the record is unauthentic. A
     * heritage designation classifies a record as Authentic — Regional by a separate
     * and older route, because a register tying a product to its place is what the
     * brief calls a recognised traditional preparation. That route is a statement
     * about the kind of evidence, and this one is about the weight of it.
     */
    const best = assess(bestDocumented);
    expect(best.score).toBeLessThan(AUTHENTIC_AT);
  });

  it('leaves a documented-but-unconfirmed record where the evidence puts it', () => {
    // No heritage, no register method: documentation alone, and it stays a version.
    const documented = assess({ ...bestDocumented, heritage: [], registerMethod: false });
    expect(documented.level).toBe('variation');
    expect(isAuthentic(documented.level)).toBe(false);
  });

  it('is promoted once enough people from the place confirm it', () => {
    const before = assess({ ...bestDocumented, heritage: [], registerMethod: false });
    expect(before.level).toBe('variation');

    const after = assess({
      ...bestDocumented,
      heritage: [],
      registerMethod: false,
      validations: VALIDATIONS_REQUIRED,
    });
    expect(after.level).toBe('regional');
    expect(isAuthentic(after.level)).toBe(true);
    expect(after.score!).toBeGreaterThanOrEqual(AUTHENTIC_AT);
  });

  it('is not promoted by a confirmation or two', () => {
    // Partial confirmation is people looking, not people agreeing.
    for (const validations of [1, VALIDATIONS_REQUIRED - 1]) {
      const partial = assess({ ...bestDocumented, heritage: [], registerMethod: false, validations });
      expect({ validations, level: partial.level }).toEqual({ validations, level: 'variation' });
    }
  });

  it('says local when the locality confirmed it, regional when the region did', () => {
    const regional = assess({ ...bestDocumented, validations: VALIDATIONS_REQUIRED });
    const local = assess({ ...bestDocumented, validations: VALIDATIONS_REQUIRED, validatedLocally: true });
    expect(regional.level).toBe('regional');
    expect(local.level).toBe('local');
    // The score does not decide this one — where the people were does.
    expect(local.score).toBe(regional.score);
  });

  it('credits technique only to a register’s own documented method', () => {
    const techniqueOf = (e: Parameters<typeof assess>[0]) =>
      assess(e).breakdown.find(([name]) => name === 'Traditional technique')?.[1];

    // A published account is not evidence of the technique of the place.
    expect(techniqueOf({ ...bestDocumented, registerMethod: false })).toBe(0);
    expect(techniqueOf(bestDocumented)).toBeGreaterThan(0);
  });

  it('is not promoted by one confirmation, however strong the paperwork', () => {
    /*
     * The case that made the score an insufficient gate on its own. A record with a
     * heritage designation and a register-documented method reaches 58 on a single
     * confirmation — comfortably past the threshold — so without the floor one person
     * could authenticate a tradition on the strength of documents that were already
     * there before they arrived.
     */
    const strong = {
      hasCountry: true,
      hasRegion: true,
      ingredients: ['a', 'b', 'c'],
      heritage: ['PDO'],
      hasArticle: true,
      extractLength: 2000,
      registerMethod: true,
      validations: 1,
    };
    expect(assess(strong).score!).toBeGreaterThan(AUTHENTIC_AT);
    expect(assess(strong).disclaimer).not.toMatch(/have confirmed this preparation/);
  });
});

describe('links the app did not write', () => {
  /*
   * Every source URL on a record comes from Wikidata, Wikipedia or Wikibooks, all of
   * which the public can edit. An atlas built out of open wikis has to assume its own
   * data can be hostile.
   */
  it('refuses a scheme that could execute', () => {
    for (const hostile of [
      'javascript:alert(1)',
      'JaVaScript:alert(1)',
      'java\nscript:alert(1)',
      ' javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'blob:https://example.com/abc',
      'file:///etc/passwd',
      'vbscript:msgbox(1)',
    ]) {
      expect({ hostile, openable: isOpenable(hostile) }).toEqual({ hostile, openable: false });
    }
  });

  it('opens the ones a record actually carries', () => {
    for (const real of [
      'https://en.wikipedia.org/wiki/Kozhikode_halwa',
      'http://example.org/a',
      'https://www.wikidata.org/wiki/Q123',
      'mailto:someone@example.org',
    ]) {
      expect({ real, openable: isOpenable(real) }).toEqual({ real, openable: true });
    }
  });

  it('refuses anything it cannot parse, rather than passing it on', () => {
    for (const junk of ['', '   ', 'not a url', '//protocol-relative', 'wiki/Page']) {
      expect({ junk, openable: isOpenable(junk) }).toEqual({ junk, openable: false });
    }
  });

  it('has no record shipping a link it would refuse', () => {
    // The runtime guard is defence in depth. This is the check that the data is clean.
    const bad = catalogue.flatMap((d) => [
      ...d.sources.filter((s) => s.url && !isOpenable(s.url)).map((s) => `${d.name}: ${s.url}`),
      ...(d.popular?.url && !isOpenable(d.popular.url) ? [`${d.name}: ${d.popular.url}`] : []),
      ...(d.originClaims ?? [])
        .filter((c) => c.source.url && !isOpenable(c.source.url))
        .map((c) => `${d.name}: ${c.source.url}`),
    ]);
    expect(bad.slice(0, 10)).toEqual([]);
  });
});

/**
 * How healthy is the atlas?
 *
 * These are the numbers that say whether the app is doing what it exists to do, and
 * every one is a property of the catalogue — nothing here observes a user, so it
 * costs nothing to compute and requires no tracking, no consent banner and no
 * third-party script.
 *
 * They are deliberately the *uncomfortable* numbers. An atlas that reports how much
 * of itself is undocumented, and how lopsided its coverage is, is doing the same
 * thing the confidence score does for a single record: showing its evidence,
 * including where the evidence is thin. Hiding these would be off-mission.
 */

import { continentOf } from './continents';
import { isAuthentic } from './authenticity';
import type { Dish } from './types';

export interface Ratio {
  label: string;
  /** How many records satisfy it. */
  count: number;
  /** Out of how many. */
  total: number;
  /** 0–100, rounded. */
  percent: number;
  /** What the number means, and what it does not. */
  note: string;
}

export interface CoverageRow {
  label: string;
  count: number;
  percent: number;
}

export interface CatalogueMetrics {
  /** Headline counts — the stat tiles. */
  total: number;
  countries: number;
  continents: number;

  /** The meters. */
  documented: Ratio;
  located: Ratio;
  illustrated: Ratio;
  filmed: Ratio;
  assessed: Ratio;

  /** Confidence bands. A distribution, shown as a table rather than a chart. */
  confidence: CoverageRow[];
  /** Records per continent. Seven classes — a table, not seven colours. */
  byContinent: CoverageRow[];

  /**
   * The share held by the single largest country. The honest headline for the
   * skew: at 55% the atlas is describing one country's registry, not the world.
   */
  concentration: { country: string; percent: number };

  atRisk: number;
  /** Dishes recorded in more than one tradition — the fork model working. */
  forked: number;
}

const ratio = (label: string, count: number, total: number, note: string): Ratio => ({
  label,
  count,
  total,
  percent: total ? Math.round((count / total) * 100) : 0,
  note,
});

export function catalogueMetrics(dishes: Dish[]): CatalogueMetrics {
  const total = dishes.length;

  const countries = new Map<string, number>();
  const continents = new Map<string, number>();
  const traditions = new Map<string, number>();

  for (const dish of dishes) {
    countries.set(dish.loc.country, (countries.get(dish.loc.country) ?? 0) + 1);
    const continent = continentOf(dish.loc.country);
    continents.set(continent, (continents.get(continent) ?? 0) + 1);
    if (dish.traditionId) traditions.set(dish.traditionId, (traditions.get(dish.traditionId) ?? 0) + 1);
  }

  const [topCountry, topCount] = [...countries.entries()].sort((a, b) => b[1] - a[1])[0] ?? ['—', 0];

  const scored = dishes.filter((d) => d.score !== null);
  const band = (min: number, max: number) =>
    scored.filter((d) => d.score! >= min && d.score! < max).length;

  const confidence: CoverageRow[] = [
    { label: 'Not scored', count: total - scored.length, percent: 0 },
    { label: 'Under 50', count: band(0, 50), percent: 0 },
    { label: '50 – 74', count: band(50, 75), percent: 0 },
    { label: '75 and above', count: band(75, 101), percent: 0 },
  ].map((row) => ({ ...row, percent: total ? Math.round((row.count / total) * 100) : 0 }));

  const byContinent: CoverageRow[] = [...continents.entries()]
    .map(([label, count]) => ({ label, count, percent: total ? Math.round((count / total) * 100) : 0 }))
    .sort((a, b) => b.count - a.count);

  return {
    total,
    countries: countries.size,
    continents: continents.size,

    documented: ratio(
      'Has a recorded method',
      dishes.filter((d) => d.steps.length > 0).length,
      total,
      'The number that says whether this is an atlas or a list of names. Everything else is secondary to it.',
    ),
    located: ratio(
      'Placed below country level',
      dishes.filter((d) => d.loc.region || d.loc.province || d.loc.city || d.loc.village).length,
      total,
      'Authenticity has geographic depth. “Kozhikode” is a record; “India” is barely a start.',
    ),
    illustrated: ratio(
      'Has a photograph',
      dishes.filter((d) => d.photo).length,
      total,
      'A dish nobody can picture is hard to care about, and harder to recognise.',
    ),
    filmed: ratio(
      'Has a ranked video',
      dishes.filter((d) => d.videos.length > 0).length,
      total,
      'Ranked by the cook’s closeness to the tradition — not a search result.',
    ),
    assessed: ratio(
      'Classified as authentic',
      dishes.filter((d) => isAuthentic(d.badgeLevel)).length,
      total,
      'Earned through the evidence checks. A low share here is honest, not a failure.',
    ),

    confidence,
    byContinent,
    concentration: {
      country: topCountry,
      percent: total ? Math.round((topCount / total) * 100) : 0,
    },

    atRisk: dishes.filter((d) => d.atRisk).length,
    forked: [...traditions.values()].filter((n) => n > 1).length,
  };
}

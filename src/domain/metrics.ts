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

import type { Copy } from '../i18n/copy';
import { continentOf, isCountry } from './continents';
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

/**
 * One dated snapshot of the atlas, written by `scripts/snapshot-metrics.mjs`.
 *
 * Trend needs history, and the app has no storage — so history lives in the repo as
 * an append-only file, one entry per ingest. Git carries the audit trail, it costs
 * nothing to keep, and it cannot drift from what shipped because it ships with it.
 */
export interface Snapshot {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  total: number;
  countries: number;
  documented: number;
  illustrated: number;
  located: number;
}

export interface Trend {
  /** Oldest → newest, for the sparkline. At least two points, or there is no trend. */
  points: number[];
  /** Change since the previous snapshot. */
  delta: number;
  /** Change since the first snapshot on record. */
  sinceStart: number;
  /** Days covered. Stated so a rise is not mistaken for a rate. */
  span: number;
}

/**
 * Derive a trend for one measure.
 *
 * Returns null with fewer than two snapshots. That is the honest answer — a single
 * data point is a value, not a direction, and drawing a flat line through it would
 * imply a stability nobody has observed.
 */
export function trendFor(history: Snapshot[], key: keyof Omit<Snapshot, 'date'>): Trend | null {
  if (history.length < 2) return null;

  const ordered = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const points = ordered.map((s) => s[key]);
  const first = ordered[0];
  const last = ordered[ordered.length - 1];
  const previous = ordered[ordered.length - 2];

  const days = Math.max(
    1,
    Math.round((Date.parse(last.date) - Date.parse(first.date)) / 86_400_000),
  );

  return {
    points,
    delta: last[key] - previous[key],
    sinceStart: last[key] - first[key],
    span: days,
  };
}

/**
 * A percentage as a reader should see it.
 *
 * Rounding turns 44 records out of 16,489 into "0%", and "0% · 44" reads as a
 * contradiction — most people take the percentage and conclude there are none. The
 * classified-as-authentic meter is exactly this case, and it is the one figure on the
 * screen a reader is most likely to be checking.
 *
 * "<1%" is the honest rendering: it is small, it is not zero, and the count beside it
 * says how small. Zero stays "0%", because zero is a different fact.
 */
export const percentLabel = (count: number, percent: number): string =>
  count > 0 && percent === 0 ? '<1%' : `${percent}%`;

const ratio = (label: string, count: number, total: number, note: string): Ratio => ({
  label,
  count,
  total,
  percent: total ? Math.round((count / total) * 100) : 0,
  note,
});

export function catalogueMetrics(copy: Copy, dishes: Dish[]): CatalogueMetrics {
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
    { label: copy.bandNotScored, count: total - scored.length, percent: 0 },
    { label: copy.bandUnder50, count: band(0, 50), percent: 0 },
    { label: copy.band50to74, count: band(50, 75), percent: 0 },
    { label: copy.band75Plus, count: band(75, 101), percent: 0 },
  ].map((row) => ({ ...row, percent: total ? Math.round((row.count / total) * 100) : 0 }));

  const byContinent: CoverageRow[] = [...continents.entries()]
    .map(([label, count]) => ({ label, count, percent: total ? Math.round((count / total) * 100) : 0 }))
    .sort((a, b) => b.count - a.count);

  return {
    total,
    // Only origins that are actually countries. Levant, Mesoamerica, the Maghreb and
    // the Ottoman Empire are origins this atlas records and none of them is a country;
    // counting them added thirty-two to a headline whose whole job is to be honest.
    countries: [...countries.keys()].filter(isCountry).length,
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

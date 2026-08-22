/**
 * The catalogue, fetched rather than compiled in.
 *
 * The four source files used to be `import`ed at the top of this module. Metro
 * answers a static import by inlining the file, so sixteen thousand records of
 * prose, methods and ingredients became 24 MB of JavaScript that every reader had to
 * download and parse before the first screen could paint. On a phone that is twenty
 * to thirty seconds of nothing.
 *
 * They are static files now, fetched once at startup while a loading screen is up.
 * The bundle carries the app; the app carries the data.
 *
 * ## Why the exports still look synchronous
 *
 * Seven screens and a component read `catalogue` as a plain array. Making each of
 * them async would put a loading branch in every one, for a wait that has already
 * happened — the root layout does not render a route until `loadCatalogue` has
 * resolved, so by the time any screen mounts the array is full.
 *
 * These are live bindings: `import { catalogue }` sees the assignment below, and the
 * one rule that comes with that is not to copy them at module scope. Read them
 * inside a component or a function, where the read happens after the load.
 */

import { coverageOf, type LanguageCoverage } from '../domain/language';
import type { Dish } from '../domain/types';
import { buildCatalogue, type CatalogueStats } from './build';

/** Everything the app can show. Empty until `loadCatalogue` has resolved. */
export let catalogue: Dish[] = [];

/** How many records the catalogue can serve in each language. */
export let languageCoverage: LanguageCoverage = {};

export let catalogueStats: CatalogueStats = {
  total: 0,
  curated: 0,
  imported: 0,
  withheld: 0,
  countries: 0,
};

export const dishById = (id: number | null | undefined): Dish | undefined =>
  catalogue.find((d) => d.id === id);

/**
 * Where the data sits.
 *
 * A root-relative path on web, where the files are served next to the app. A native
 * build has no such neighbour, so the origin is read from the environment there.
 */
const BASE = process.env.EXPO_PUBLIC_DATA_URL ?? '';

const SOURCES = ['catalogue', 'cuisines', 'cookbook', 'unesco', 'gi'] as const;

let pending: Promise<void> | null = null;

/**
 * Fetch the sources and build the catalogue.
 *
 * Safe to call more than once: the work happens on the first call and every later
 * caller awaits the same promise, so two screens racing at startup do not fetch
 * fourteen megabytes twice.
 */
export function loadCatalogue(): Promise<void> {
  pending ??= (async () => {
    const [imported, cuisines, cookbook, unesco, gi] = await Promise.all(
      SOURCES.map(async (name) => {
        const response = await fetch(`${BASE}/data/${name}.json`);
        if (!response.ok) throw new Error(`Could not load ${name}.json (${response.status}).`);
        return (await response.json()) as unknown[];
      }),
    );

    const built = buildCatalogue(imported, cuisines, cookbook, unesco, gi);
    catalogue = built.catalogue;
    catalogueStats = built.stats;
    languageCoverage = coverageOf(catalogue);
  })();

  return pending;
}

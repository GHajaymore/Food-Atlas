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

import { CONFIRMATIONS_URL, canConfirm, type ConfirmationIndex } from '../domain/confirmations';
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
/**
 * What people have confirmed, or nothing.
 *
 * Nothing is the honest answer in three cases and they are treated alike: no endpoint
 * configured, an endpoint that failed, and an endpoint that answered with something
 * this does not understand. A record with no confirmations is scored as one nobody has
 * confirmed, which is exactly true in all three.
 */
async function loadConfirmations(): Promise<ConfirmationIndex> {
  if (!canConfirm()) return {};

  try {
    const response = await fetch(CONFIRMATIONS_URL);
    if (!response.ok) return {};
    const body: unknown = await response.json();
    return body && typeof body === 'object' && !Array.isArray(body) ? (body as ConfirmationIndex) : {};
  } catch {
    return {};
  }
}

export function loadCatalogue(): Promise<void> {
  pending ??= (async () => {
    const [imported, cuisines, cookbook, unesco, gi] = await Promise.all(
      SOURCES.map(async (name) => {
        const response = await fetch(`${BASE}/data/${name}.json`);
        if (!response.ok) throw new Error(`Could not load ${name}.json (${response.status}).`);
        return (await response.json()) as unknown[];
      }),
    );

    /*
     * Confirmations are live, not shipped.
     *
     * Every other source here is a file built by a script and served with the app.
     * This one is what people said, and it has to be current — a reader who confirms
     * a record should see the record change, and the next reader should see it too.
     *
     * A failure here is not a failure to load the atlas. If the endpoint is down the
     * app opens with no confirmations, which is the state it has been in since it was
     * written; taking the whole catalogue down because a badge could not be earned
     * would be the wrong trade by a wide margin.
     */
    const confirmations = await loadConfirmations();

    const built = buildCatalogue(imported, cuisines, cookbook, unesco, gi, confirmations);
    catalogue = built.catalogue;
    catalogueStats = built.stats;
    languageCoverage = coverageOf(catalogue);
  })();

  return pending;
}

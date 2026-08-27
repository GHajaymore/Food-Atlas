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
import { recipeLines } from '../domain/recipeLines';
import { decodeEntities } from '../domain/text';
import type { Dish } from '../domain/types';
import { buildCatalogue, type CatalogueStats } from './build';
import { loadSettings, thresholds } from './settings';

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
  withIngredients: 0,
};

export const dishById = (id: number | null | undefined): Dish | undefined =>
  catalogue.find((d) => d.id === id);

/**
 * What share of the atlas lists no ingredients at all, as a whole percentage.
 *
 * The pantry search needs this to explain an empty result honestly, and it was asserting
 * "about half" — a figure nobody counted, and wrong by a factor that mattered. Counted
 * here instead, from the same stats the atlas page reports.
 *
 * Zero before the catalogue has loaded, which is the truthful answer to "what share of
 * nothing": the screens that use it only render after `loadCatalogue` has resolved.
 */
export const shareWithoutIngredients = (): number =>
  catalogueStats.total === 0
    ? 0
    : Math.round(((catalogueStats.total - catalogueStats.withIngredients) / catalogueStats.total) * 100);

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
    /*
     * All three stages at once, because none of them needs another's answer.
     *
     * They used to run strictly in series: the five files, then the confirmations, then
     * the settings. That is three sequential network round trips on the critical path
     * before a reader sees anything, and neither of the last two reads a byte the files
     * produce — the ordering was habit rather than dependency.
     *
     * This removes waiting, not bytes. The payload is unchanged and still the dominant
     * cost; what goes is two round trips, which matters most on a cold worker and a slow
     * connection. No figure is claimed for it, because none has been measured.
     *
     * The one real ordering constraint survives: `loadSettings` writes the module-level
     * settings and `thresholds()` reads them, so that read must still happen after the
     * await — it does, below. Both must finish before `buildCatalogue`, and awaiting them
     * together is exactly that guarantee.
     */
    const [sources, confirmations] = await Promise.all([
      Promise.all(
        SOURCES.map(async (name) => {
          const response = await fetch(`${BASE}/data/${name}.json`);
          if (!response.ok) throw new Error(`Could not load ${name}.json (${response.status}).`);
          return (await response.json()) as unknown[];
        }),
      ),
      /*
       * Confirmations are live, not shipped.
       *
       * Every other source here is a file built by a script and served with the app. This
       * one is what people said, and it has to be current — a reader who confirms a record
       * should see the record change, and the next reader should see it too.
       *
       * A failure here is not a failure to load the atlas: `loadConfirmations` resolves to
       * nothing rather than rejecting, so the app opens with no confirmations, which is the
       * state it has been in since it was written. Taking the whole catalogue down because
       * a badge could not be earned would be the wrong trade by a wide margin.
       *
       * That non-rejecting contract is load-bearing now in a way it was not before: inside
       * `Promise.all`, a rejection here would take the catalogue with it.
       */
      loadConfirmations(),
      /*
       * Settings must land before the build, because two of them decide what Authentic
       * means and every badge is computed once, below. Fetching them afterwards would
       * paint the first screen on one set of thresholds and everything after it on another.
       *
       * Fails to the compiled defaults, deliberately: a network error must never move the
       * meaning of the word Authentic across 18,008 records. Same non-rejecting contract,
       * and same new reason it matters.
       */
      loadSettings(),
    ]);

    const [imported, cuisines, cookbook, unesco, gi] = sources;

    const built = buildCatalogue(imported, cuisines, cookbook, unesco, gi, confirmations, thresholds());
    catalogue = built.catalogue;
    cookbookRows = built.cookbookRows;
    catalogueStats = built.stats;
    languageCoverage = coverageOf(catalogue);
  })();

  /*
   * The step text, started once the build is queued and never awaited here.
   *
   * That is the whole point: `loadCatalogue` resolves when the light payload is built, the
   * app paints, and this fills in behind it.
   */
  void loadCookbookSteps();

  return pending;
}

/** Which source row each cookbook record came from. Filled by the build. */
let cookbookRows: number[] = [];

let stepsPending: Promise<void> | null = null;

/**
 * The half of cookbook.json the first paint does not need.
 *
 * 56% of that file is step text, read by exactly one screen. Holding it back takes a cold
 * visit from 2.92 MB of brotli to 2.02 MB — 31% off the critical path, measured. What could
 * and could not move, and why, is in `docs/first-paint.md`.
 *
 * Every count is already correct by the time this runs: the records carry `stepCount` and
 * the app asks `methodLength()`, so nothing on screen has been waiting for this. It fills
 * in the words.
 *
 * A failure costs the method text and nothing else — the atlas is already readable and
 * every figure already right. Same non-rejecting contract as `loadConfirmations`, and the
 * same reasoning: taking the catalogue down because a second file did not arrive would be
 * the wrong trade by a wide margin.
 */
export function loadCookbookSteps(): Promise<void> {
  stepsPending ??= (async () => {
    /* Nothing to attach to yet. The caller in `loadCatalogue` runs after the build is
       queued, and the dish screen calls this again once it has mounted. */
    await pending;

    try {
      const response = await fetch(`${BASE}/data/cookbook-detail.json`);
      if (!response.ok) return;
      const detail = (await response.json()) as { steps?: string[] }[];
      if (!Array.isArray(detail)) return;

      /*
       * One index, not 6,979 linear scans. `dishById` is a `find` over the whole
       * catalogue — right for the single lookup a screen does, and quadratic here:
       * 6,979 records against 21,688 is about 150 million comparisons on the main
       * thread, to fix a slow first paint.
       */
      const byId = new Map(catalogue.map((dish) => [dish.id, dish]));

      for (let i = 0; i < cookbookRows.length; i += 1) {
        const steps = detail[cookbookRows[i]]?.steps;
        if (!steps?.length) continue;
        const dish = byId.get(300_000 + i);
        /* Cleaned exactly as `build.ts` cleans early text, so a late method is not a
           different shape from an early one. */
        if (dish) dish.steps = recipeLines(steps.map(decodeEntities));
      }
    } catch {
      /* Offline, or the file is not served. The atlas is already on screen. */
    }
  })();

  return stepsPending;
}

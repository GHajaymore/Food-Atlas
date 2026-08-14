/**
 * The home screen as doorways rather than a list.
 *
 * A single feed worked at six records and stopped working somewhere in the low
 * hundreds. At 13,855 it is a dump: the reader scrolls past whatever the catalogue
 * happened to load first, with no sense of what is here or where to start. Paging
 * made it survivable, not navigable — "Show more" is not a way to find anything.
 *
 * So the home becomes a small set of shelves, each answering a question a reader
 * actually arrives with, and each a door into the filtered list that already exists.
 * Nothing here is a new query engine; every shelf is a predicate over the catalogue
 * and hands off to the same feed.
 *
 * The order is the argument the app makes, and it is deliberate:
 *
 *   1. What is disappearing — the reason the atlas exists at all.
 *   2. What is authenticated — the small, hard-won set that carries real evidence.
 *   3. What you can actually cook tonight — records with a method.
 *   4. What has been photographed — the browsable, visual way in.
 *   5. Where in the world — the geographic entry the design has always led with.
 *
 * Popularity is absent, which is the same choice the Feed makes by demoting its
 * views rail to the bottom.
 */

import { isAuthentic } from './authenticity';
import type { Dish, Level } from './types';

export interface Shelf {
  id: string;
  title: string;
  /** What this shelf is for, in the app's voice. */
  note: string;
  /** The records on it, already ordered. */
  dishes: Dish[];
  /** How many exist in total, which is usually more than are shown. */
  total: number;
}

/**
 * How close a record is to the thing the app is actually about.
 *
 * Most of the catalogue is unscored, so ordering on score alone leaves thousands
 * tied at nothing and the rail falls back to whatever order the catalogue loaded —
 * which is alphabetical, and put "A Nice Cup of Tea" on the front page.
 */
const CLASS_RANK: Record<Level, number> = {
  local: 5,
  regional: 4,
  variation: 3,
  adaptation: 2,
  unverified: 1,
  // Last on purpose. A fusion record is a legitimate entry and a poor front page:
  // it is the one thing someone opening an atlas of traditions did not come for.
  fusion: 0,
};

/**
 * How much a record has to say.
 *
 * The last tiebreak, and the one that does the most work: whole shelves are a single
 * classification with no scores, so without it they order alphabetically and open on
 * "A Nice Cup of Tea" and "Acid Drops". Counting what a record actually contains —
 * steps, ingredients, how precisely it is placed — puts a documented dish ahead of a
 * stub with a title. It is a measure of the entry, not a judgement of the food.
 */
const substance = (d: Dish) => d.steps.length * 2 + d.ingredients.length + d.breadcrumb.length;

/**
 * The fewest cards a rail may carry.
 *
 * Below this a shelf reads as broken rather than short — a heading, a sentence of
 * copy and one lonely card is worse than not offering the shelf at all. The records
 * are not lost: they are still in the feed, still counted, still reachable through
 * the filters.
 */
const MIN_RAIL = 4;

/**
 * The order a rail is read in, strongest first.
 *
 * A rail is scanned left to right and only its first few cards are ever seen, so
 * this decides what the app appears to be. Classification leads, because a Fusion
 * record is not what someone opening this app came for; then score; then how much
 * the record actually contains.
 *
 * Only photographed records reach a rail at all. A monogram placeholder is honest in
 * a list, where the name and the place carry the row, but on a browsing shelf it is
 * a card that gives the reader nothing to look at, and a rail of them makes the
 * catalogue look empty when it is not.
 */
const railOrder = (dishes: Dish[], take: number) =>
  dishes
    .filter((d) => d.photo)
    .sort(
      (a, b) =>
        CLASS_RANK[b.badgeLevel] - CLASS_RANK[a.badgeLevel] ||
        (b.score ?? 0) - (a.score ?? 0) ||
        substance(b) - substance(a),
    )
    .slice(0, take);

/**
 * One record per country before any country repeats.
 *
 * For a shelf that exists to be browsed rather than ranked, variety is the ordering.
 * The imported records arrive grouped by country, so ranking them leaves the rail
 * showing six dishes from one place — an atlas that looks like it only knows about
 * Canada. Taking a round of one-per-country first makes the same twelve cards read
 * as the world.
 *
 * Deterministic: it consumes an already-sorted list and preserves that order within
 * each country, so the strongest record still represents its place.
 */
function spreadByPlace(dishes: Dish[], take: number): Dish[] {
  const byCountry = new Map<string, Dish[]>();
  for (const dish of dishes) {
    const key = dish.loc.country;
    const bucket = byCountry.get(key);
    if (bucket) bucket.push(dish);
    else byCountry.set(key, [dish]);
  }

  const out: Dish[] = [];
  const queues = [...byCountry.values()];
  while (out.length < take && queues.some((q) => q.length)) {
    for (const queue of queues) {
      if (out.length >= take) break;
      const next = queue.shift();
      if (next) out.push(next);
    }
  }
  return out;
}

/**
 * The definition of every shelf: its copy and the one predicate that defines it.
 *
 * The predicate lives here rather than in the screen because it does double duty —
 * it picks the handful shown on the rail, and it is the same test the feed applies
 * when the reader opens the shelf in full. One definition means "See all 70" cannot
 * drift away from what the rail was showing.
 */
export const SHELF_DEFS: {
  id: string;
  title: string;
  note: string;
  match: (d: Dish) => boolean;
  /** Order the rail for variety instead of rank. See `spreadByPlace`. */
  spread?: boolean;
}[] = [
  {
    id: 'at-risk',
    title: 'Disappearing',
    note: 'Traditions a source describes as declining. The reason this atlas exists.',
    match: (d) => Boolean(d.atRisk),
  },
  {
    id: 'authentic',
    title: 'Authenticated',
    note: 'The records that carry real evidence of how they are made, and where.',
    match: (d) => isAuthentic(d.badgeLevel),
  },
  {
    id: 'cookable',
    title: 'You could cook this tonight',
    note: 'Records with a written method — traditional where we have one, published where we do not.',
    match: (d) => d.steps.length > 0,
  },
  {
    id: 'illustrated',
    title: 'Worth looking at',
    note: 'Photographed traditions, for browsing rather than searching.',
    match: (d) => Boolean(d.photo),
    spread: true,
  },
];

/**
 * Build the shelves for a catalogue.
 *
 * `perShelf` is small on purpose. A shelf is a doorway, not a list — its job is to
 * show enough to be worth opening and then get out of the way.
 */
export function buildShelves(dishes: Dish[], perShelf = 12): Shelf[] {
  /**
   * A record already shown above is not shown again further down.
   *
   * The shelves overlap heavily — the best-evidenced photographed traditions are at
   * risk *and* authenticated *and* cookable — so without this the top three rails
   * were the same three cards, and four shelves read as one. Holding a record back
   * costs nothing: the shelf's count and the list behind it still include it, so the
   * rail is a sample of what is there rather than the whole of it.
   *
   * SHELF_DEFS runs narrowest first for this reason. The scarce shelves take their
   * best records and the broad ones still have thousands to draw from.
   */
  const shown = new Set<number>();

  return (
    SHELF_DEFS.map((def) => {
      const matching = dishes.filter(def.match);
      const available = matching.filter((d) => !shown.has(d.id));
      const rail = def.spread
        ? spreadByPlace(railOrder(available, available.length), perShelf)
        : railOrder(available, perShelf);
      for (const dish of rail) shown.add(dish.id);

      return {
        id: def.id,
        title: def.title,
        note: def.note,
        dishes: rail,
        // The count is of everything that matches, not of what fits on the rail.
        total: matching.length,
      };
    })
      // A shelf too thin to look like a shelf is a promise the catalogue cannot keep.
      .filter((shelf) => shelf.dishes.length >= MIN_RAIL)
  );
}

/**
 * The test a shelf applies to the feed when opened in full, or `null` for the
 * catalogue at large. Anything unrecognised widens rather than empties: an unknown
 * id should show everything, never nothing.
 */
export function shelfMatch(id: string | null): ((d: Dish) => boolean) | null {
  return SHELF_DEFS.find((def) => def.id === id)?.match ?? null;
}

/** The heading shown once a shelf is opened in full. */
export const shelfTitle = (id: string | null) => SHELF_DEFS.find((def) => def.id === id)?.title ?? null;

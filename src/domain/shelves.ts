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
import type { Dish } from './types';

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

/** Best evidence first, so a shelf leads with its strongest record. */
const byScore = (a: Dish, b: Dish) => (b.score ?? 0) - (a.score ?? 0);

/**
 * Photographed records first, then the rest, each half strongest-first.
 *
 * A rail is read left to right and a card without an image is a weak invitation,
 * so pictures lead — but a shelf that has fewer photographs than slots still fills,
 * because an empty gap says less than a plain card does.
 */
const railOrder = (dishes: Dish[], take: number) =>
  [...dishes].sort((a, b) => Number(Boolean(b.photo)) - Number(Boolean(a.photo)) || byScore(a, b)).slice(0, take);

/**
 * The definition of every shelf: its copy and the one predicate that defines it.
 *
 * The predicate lives here rather than in the screen because it does double duty —
 * it picks the handful shown on the rail, and it is the same test the feed applies
 * when the reader opens the shelf in full. One definition means "See all 70" cannot
 * drift away from what the rail was showing.
 */
export const SHELF_DEFS: { id: string; title: string; note: string; match: (d: Dish) => boolean }[] = [
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
  },
];

/**
 * Build the shelves for a catalogue.
 *
 * `perShelf` is small on purpose. A shelf is a doorway, not a list — its job is to
 * show enough to be worth opening and then get out of the way.
 */
export function buildShelves(dishes: Dish[], perShelf = 12): Shelf[] {
  return (
    SHELF_DEFS.map((def) => {
      const matching = dishes.filter(def.match);
      return {
        id: def.id,
        title: def.title,
        note: def.note,
        dishes: railOrder(matching, perShelf),
        total: matching.length,
      };
    })
      // A shelf with nothing on it is a promise the catalogue cannot keep.
      .filter((shelf) => shelf.dishes.length > 0)
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

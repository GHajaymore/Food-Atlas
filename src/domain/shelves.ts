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

import type { Copy } from '../i18n/copy';
import { isAuthentic } from './authenticity';
import type { Dish, Level } from './types';

export interface Shelf {
  id: string;
  /** The copy key for the shelf's name. Resolved by the screen, not here. */
  titleKey: keyof Copy;
  /** The copy key for what this shelf is for, in the app's voice. */
  noteKey: keyof Copy;
  /** Substituted into {country} for the shelf that names one. See `shelfLabel`. */
  country?: string;
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
 * The front page moves, without getting worse.
 *
 * Ranking is deterministic, so every visit met the same twelve cards for ever. An
 * atlas of sixteen thousand traditions that shows the same three every day is not
 * describing what it holds, and gives a returning reader no reason to come back.
 *
 * The rotation is over a **pool of equals**, never over the whole shelf. Records
 * ranked past the strongest few railfuls are genuinely thinner — unscored, less
 * documented, worse illustrated — and rotating them onto the rail would be variety
 * bought by showing a reader the second-best of everything.
 *
 * Applied to the finished list rather than inside the ranking, because the shelves
 * that spread by country build their order in two steps: rotating before the spread
 * moved the list by one place and the spread put almost the same countries back.
 */
function rotate<T>(pool: T[], take: number, turn: number): T[] {
  if (pool.length <= take) return pool.slice(0, take);
  const offset = ((turn % pool.length) + pool.length) % pool.length;
  return [...pool.slice(offset), ...pool.slice(0, offset)].slice(0, take);
}

/**
 * How many railfuls of equally-strong records the rotation draws from.
 *
 * Three is a compromise with a reason on each side. One is no rotation at all; ten
 * would reach records that are visibly thinner than the ones above them, and the rail
 * would look worse on most days than it does today.
 */
const POOL_RAILS = 3;

/**
 * Which turn it is — the day, counted from the epoch.
 *
 * A day rather than a render, and this is the whole design. Reshuffling on every
 * render would rearrange the page under a reader's thumb as they scrolled, and make
 * the record they were about to tap move; reshuffling per session would mean the back
 * button led somewhere else. A day is long enough that the page is a stable object
 * while you use it, and short enough that coming back tomorrow shows you the atlas
 * again rather than the same twelve cards.
 *
 * It is also why the turn is an argument with a default rather than read inside the
 * ordering: a test can ask for turn 0, 1 and 2 and get three known answers.
 */
export const today = (): number => Math.floor(Date.now() / 86_400_000);

/**
 * The records that most need someone to write them down, first.
 *
 * Every other rail leads with its strongest record, because a rail is a shop window.
 * The Disappearing shelf is not a shop window — it is the argument the atlas is built
 * on — and there the **weakest** record is the most urgent. A tradition a source calls
 * declining, with nothing recorded about how it is made, is the one that actually
 * goes: five of the fifteen are in exactly that state.
 *
 * A record with a method is already saved in the only way this app can save anything.
 * A record without one is the ask, so it leads.
 *
 * Photographed still, like every rail — a card with nothing to look at recruits nobody,
 * and recruiting is the entire point of putting these first.
 */
function urgentOrder(dishes: Dish[], take: number): Dish[] {
  const documented = (d: Dish) => (d.steps.length ? 2 : d.prepSummary.trim() ? 1 : 0);

  return dishes
    .filter((d) => d.photo)
    .sort(
      (a, b) =>
        documented(a) - documented(b) ||
        // Then the usual reading order, so within "equally undocumented" the record
        // that carries the most is still the one shown.
        CLASS_RANK[b.badgeLevel] - CLASS_RANK[a.badgeLevel] ||
        substance(b) - substance(a),
    )
    .slice(0, take);
}

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
export interface ShelfDef {
  id: string;
  titleKey: keyof Copy;
  noteKey: keyof Copy;
  country?: string;
  match: (d: Dish) => boolean;
  /** Order the rail for variety instead of rank. See `spreadByPlace`. */
  spread?: boolean;
  /** Put the records that most need a contribution first. See the at-risk shelf. */
  urgentFirst?: boolean;
}

export const SHELF_DEFS: ShelfDef[] = [
  {
    id: 'at-risk',
    titleKey: 'shelfDisappearing',
    noteKey: 'shelfDisappearingNote',
    match: (d) => Boolean(d.atRisk),
    /*
     * Undocumented first, which is the opposite of every other shelf.
     *
     * Everywhere else the strongest record leads, because a rail is a shop window.
     * This shelf is not a shop window: it is the argument the atlas is built on, and
     * on it the *weakest* record is the most urgent one. A declining tradition whose
     * method nobody has written down is the one that actually disappears — five of
     * the fifteen here have a source saying they are in decline and nothing at all
     * saying how they are made.
     *
     * A record with a method is already saved in the only way this app can save
     * anything. A record without one is the ask.
     */
    urgentFirst: true,
  },
  {
    id: 'authentic',
    titleKey: 'shelfAuthenticated',
    noteKey: 'shelfAuthenticatedNote',
    match: (d) => isAuthentic(d.badgeLevel),
  },
  {
    id: 'cookable',
    titleKey: 'shelfCookable',
    noteKey: 'shelfCookableNote',
    match: (d) => d.steps.length > 0,
  },
  {
    id: 'illustrated',
    titleKey: 'shelfIllustrated',
    noteKey: 'shelfIllustratedNote',
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
/**
 * A shelf for the country the reader is probably in.
 *
 * Built here rather than declared in `SHELF_DEFS` because its title names a place, and
 * the place is not known until the device is asked. See `nearby.ts` for why the guess
 * is a timezone and why it is never used to hide anything.
 *
 * Ranked best-first like every other shelf, and deliberately not urgent-first: this is
 * a welcome, not an ask. A reader who has just been told the atlas knows their country
 * should meet the good records, and the request for the empty ones belongs on the
 * front page where it can be put properly.
 *
 * First in the order, so it is the first thing a returning reader sees.
 */
const nearbyShelf = (country: string): ShelfDef => ({
  id: 'nearby',
  titleKey: 'shelfFromCountry',
  noteKey: 'shelfFromCountryNote',
  country,
  match: (d) => d.loc.country === country,
});

/**
 * @param nearby The country the reader is probably in. Empty to omit the shelf, which
 *   is the honest default: on a device whose zone the atlas does not recognise there
 *   is nothing to say, and a shelf headed "From " would be worse than none.
 */
export function buildShelves(
  dishes: Dish[],
  perShelf = 12,
  turn = today(),
  nearby = '',
): Shelf[] {
  /*
   * The local shelf only earns its place if it can be filled. A rail of two records
   * headed "From Iceland" advertises the atlas's thinness rather than its reach, and
   * MIN_RAIL would drop it anyway — this decides it before the work is done.
   */
  const defs =
    nearby && dishes.filter((d) => d.loc.country === nearby).length >= MIN_RAIL
      ? [nearbyShelf(nearby), ...SHELF_DEFS]
      : SHELF_DEFS;

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

  /**
   * And no photograph twice, which is a different problem from no record twice.
   *
   * Two records can legitimately share a picture — Thalassery Halwa carried
   * Kozhikode's tray, and the two sat side by side on the same rail looking like a
   * rendering bug. Sibling traditions are exactly the records most likely to do this,
   * and exactly the ones a reader is meant to be able to tell apart.
   *
   * A record held back for this keeps its place in the shelf's count and in the list
   * behind it, the same as one held back for having appeared already.
   */
  const shownPhotos = new Set<string>();

  return (
    defs.map((def, index) => {
      const matching = dishes.filter(def.match);
      // Both directions: against what earlier shelves used, and against itself, since
      // two records sharing a picture are just as likely to land on one rail as on two.
      const usedHere = new Set(shownPhotos);
      const available = matching.filter((d) => {
        if (shown.has(d.id)) return false;
        if (!d.photo) return true;
        if (usedHere.has(d.photo)) return false;
        usedHere.add(d.photo);
        return true;
      });
      const pool = def.urgentFirst
        ? urgentOrder(available, perShelf * POOL_RAILS)
        : def.spread
        // A pool of equally strong records, then today's slice of it. Each shelf turns
        // by a different amount so they do not all change together and then all sit
        // still together.
        ? spreadByPlace(railOrder(available, available.length), perShelf * POOL_RAILS)
        : railOrder(available, perShelf * POOL_RAILS);
      const rail = rotate(pool, perShelf, turn + index);

      /*
       * A shelf claims its whole pool, not the twelve records it is showing today.
       *
       * Claiming only the rail made every later shelf's pool depend on what the
       * earlier ones happened to be showing *that day*, and that quantity drifts as
       * they rotate: on one run the shelves above the cookable rail took 4 of its
       * records on day 0, 3 on day 1 and 2 on day 2. So its pool slid forward by one
       * record a day — which is exactly what the rotation was adding — and the two
       * cancelled. The rail sat frozen for three days at a time while every part of
       * the machinery looked correct, which is the kind of fault nobody finds without
       * looking at the front page two days running.
       *
       * Reserving the pool makes what a shelf leaves behind the same on every day, so
       * the rotation is the only thing that moves. It costs the shelves below a few
       * dozen candidates out of thousands, and buys a front page that turns.
       */
      for (const dish of pool) {
        shown.add(dish.id);
        if (dish.photo) shownPhotos.add(dish.photo);
      }

      return {
        id: def.id,
        titleKey: def.titleKey,
        noteKey: def.noteKey,
        country: def.country,
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
/**
 * The name of an opened shelf, in the reader's language.
 *
 * Takes `copy` rather than reaching for it, because this file is domain code and is
 * called from tests and from the intake pipeline as well as from a screen.
 */
export const shelfTitle = (copy: Copy, id: string | null): string | null => {
  const def = SHELF_DEFS.find((d) => d.id === id);
  return def ? copy[def.titleKey] : null;
};

/**
 * A shelf's name and note, with any country substituted in.
 *
 * One function for both so that a caller cannot resolve the title and forget the note,
 * which is exactly how the note kept its English through four translation batches.
 */
export const shelfLabel = (copy: Copy, shelf: Pick<Shelf, 'titleKey' | 'noteKey' | 'country'>) => ({
  title: copy[shelf.titleKey].replace('{country}', shelf.country ?? ''),
  note: copy[shelf.noteKey].replace('{country}', shelf.country ?? ''),
});

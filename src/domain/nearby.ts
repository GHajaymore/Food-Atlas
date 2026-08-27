/**
 * Where the reader is, and what the atlas wants from them because of it.
 *
 * The ask on the front page is general — *record a dish you know* — and a general ask
 * is easy to decline. The same request aimed at a place is a different proposition:
 * **these eleven dishes from your country have no method recorded, and you may be one
 * of the few people who could write one.** Nobody feels responsible for 10,197
 * records. Somebody might feel responsible for the food of their own town.
 *
 * ## Why the timezone rather than geolocation
 *
 * `navigator.geolocation` needs a permission prompt, a dependency on native, and sends
 * a precise position somewhere. The front page of this app says "no tracking", and
 * that sentence has to survive being read by somebody who checks it.
 *
 * `Intl.DateTimeFormat().resolvedOptions().timeZone` is already available on every
 * platform this runs on, costs nothing, needs no permission, and **never leaves the
 * device**. Nothing here is sent, stored or derived beyond a country name held in
 * memory for the length of a session.
 *
 * It is also the better signal. A reader in Chennai with an English phone reports
 * `en-US` as their locale and `Asia/Kolkata` as their zone, and only one of those is
 * true about where they are. `uiLanguage.ts` asks what somebody *reads*; this asks
 * where they *are*, and they are different questions with different right answers.
 *
 * ## Coarse on purpose
 *
 * A country, not a town. That is all a timezone can honestly support — `Asia/Kolkata`
 * covers a billion and a half people — and it is the right grain anyway, because the
 * atlas asks about the food of a place rather than of an address.
 *
 * ## It is a guess, and the app says so
 *
 * A traveller, a VPN, or a laptop that never left the last time zone it was set in
 * will all be wrong. So this is never used to filter anything away: it *adds* a shelf
 * and orders one list. Everything the atlas holds stays exactly as reachable as it was,
 * and the shelf names the country out loud so a reader can see the guess and ignore it.
 */

import { hasMethod } from './method';
import type { Dish } from './types';
import zones from '../data/timezones.json';

/** IANA zone to the country the atlas files it under. Built by `ingest-timezones.mjs`. */
const ZONE_TO_COUNTRY = zones as Readonly<Record<string, string>>;

/**
 * The device's time zone, or empty.
 *
 * Wrapped because `Intl` is absent or throws on some older runtimes, and failing to
 * work out where somebody is must never be the thing that stops the app opening.
 */
export function deviceZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    return '';
  }
}

/**
 * The country a zone sits in, or empty where the atlas holds nothing for it.
 *
 * Empty is a real answer and the common one for a reader in Andorra or Antarctica.
 * The caller shows nothing rather than guessing at a neighbour.
 */
export const countryOfZone = (zone: string): string => ZONE_TO_COUNTRY[zone] ?? '';

/** Where the reader probably is. Empty when it cannot be told. */
export const likelyCountry = (): string => countryOfZone(deviceZone());

/**
 * Records from a country that nobody has written down.
 *
 * The point of the whole module. A record with neither an ordered method nor a
 * described preparation is one where the atlas knows the dish exists and knows where
 * it is from, and nothing else — which is exactly the gap a person from that place can
 * close and nobody else can.
 *
 * Ordered by what the record already has, so the ones nearest to being complete come
 * first: a dish with a photograph and its ingredients needs one more thing, and asking
 * for that is a smaller favour than asking somebody to write a record from nothing.
 */
export function unwrittenIn(dishes: readonly Dish[], country: string): Dish[] {
  if (!country) return [];

  return dishes
    .filter((d) => d.loc.country === country && !hasMethod(d) && !d.prepSummary.trim())
    .sort((a, b) => nearlyThere(b) - nearlyThere(a));
}

/** How close a record is to being complete, for ordering the ask. */
const nearlyThere = (d: Dish): number =>
  (d.ingredients.length ? 2 : 0) + (d.photo ? 1 : 0) + (d.loc.region ? 1 : 0);

/**
 * Everything the atlas holds from one country, best first.
 *
 * Used for the shelf rather than the ask: a reader who has just been told the atlas
 * knows their country should be able to see what it knows, not only what it is missing.
 */
export function fromCountry(dishes: readonly Dish[], country: string): Dish[] {
  if (!country) return [];
  return dishes.filter((d) => d.loc.country === country);
}

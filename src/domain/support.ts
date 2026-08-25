/**
 * What money would actually pay for.
 *
 * A donation page is where a free project usually starts lying. "Support our
 * servers" is the standard line and it is false for most small projects, which run
 * on a free hosting tier and spend nothing. This app deletes fabricated view counts
 * and refuses photographs it cannot place; it cannot then invent a budget.
 *
 * So the figures here are the real ones, and one of them is zero. Everything the
 * atlas is built from is free and unauthenticated — Wikipedia, Wikidata, Wikimedia
 * Commons, Wikibooks, and Italy's regional open data — and no key is needed for any
 * of it. That is a fact worth stating on the page rather than hiding, because it is
 * the reason the ask is small and specific instead of open-ended.
 *
 * The one thing that does cost money is named, with what it would take, and it is
 * genuinely blocked on it.
 */

/**
 * The currency every figure on this page is quoted in.
 *
 * Named once rather than written into each sentence, so a page about being honest
 * with money cannot end up quoting two currencies and meaning neither. US dollars,
 * which is also what Open Collective will report the ledger in.
 */
export const CURRENCY = 'USD';

/**
 * Where to give: an Open Collective.
 *
 * Chosen for the reason the rest of this page exists. Open Collective publishes the
 * ledger — every contribution received and every expense paid, itemised and public —
 * so the promise this page makes about naming what was actually spent is kept by the
 * platform rather than by us remembering to update a paragraph.
 *
 * A slug rather than a URL, so there is one place the destination can be wrong and
 * it is obvious when it is.
 */
export const OPEN_COLLECTIVE_SLUG = process.env.EXPO_PUBLIC_OPENCOLLECTIVE ?? '';

export const DONATION_URL = OPEN_COLLECTIVE_SLUG
  ? `https://opencollective.com/${OPEN_COLLECTIVE_SLUG}`
  : '';

/** The public ledger, which is the point of choosing this platform. */
export const LEDGER_URL = OPEN_COLLECTIVE_SLUG
  ? `https://opencollective.com/${OPEN_COLLECTIVE_SLUG}/transactions`
  : '';

/**
 * True when there is somewhere real to send a reader.
 *
 * Deliberately false until a collective exists. An app that shows a donate button
 * pointing nowhere is worse than one that shows none: it takes a reader's goodwill
 * and spends it on a dead link.
 */
export const canAcceptDonations = (): boolean => DONATION_URL.length > 0;

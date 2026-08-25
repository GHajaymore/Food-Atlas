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

/**
 * A finished link to wherever donations actually go.
 *
 * Any platform: Ko-fi, GitHub Sponsors, Liberapay, Buy Me a Coffee, PayPal. The button
 * was previously reachable only through an Open Collective, which meant the page said
 * "not open for donations yet" whenever that one platform had not been set up — a
 * sentence about a platform, read as a sentence about the project.
 *
 * The Open Collective slug still works and takes precedence, so anything already
 * configured keeps working untouched.
 */
const DONATE_URL = (process.env.EXPO_PUBLIC_DONATE_URL ?? '').trim();

export const DONATION_URL = OPEN_COLLECTIVE_SLUG
  ? `https://opencollective.com/${OPEN_COLLECTIVE_SLUG}`
  : /^https:\/\//i.test(DONATE_URL)
    ? DONATE_URL
    : '';

/**
 * The public ledger — and empty for every platform that does not publish one.
 *
 * This page tells a reader they can read the ledger, and the reason that promise is safe
 * is that the platform keeps it rather than us remembering to. Most donation services
 * publish nothing at all, so a link here for one of those would be a claim about
 * transparency the project could not honour. Better a donate button with no ledger than a
 * ledger button with no ledger.
 */
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

/** True only where the platform publishes what was received and spent. */
export const hasPublicLedger = (): boolean => LEDGER_URL.length > 0;

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

/** Something money would change, and what it costs. Nothing here is aspirational. */
export interface FundingNeed {
  title: string;
  /** What it would do for a reader, in the app's own voice. */
  what: string;
  /** Why it is not already done. Honest, including when the answer is "nothing". */
  why: string;
  /** Roughly what it costs, or that it costs nothing. */
  cost: string;
}

export const FUNDING_NEEDS: FundingNeed[] = [
  {
    title: 'Translation',
    what:
      'Five thousand records describe a dish in the language of the place it comes from — Hindi, Korean, ' +
      'Indonesian, Chinese. A reader who does not speak it is shown the original and told which language it is, ' +
      'which is honest and not much use to them.',
    why:
      'It is the only part of this project that costs money. Translating on demand needs a model behind a key, ' +
      'and the rules it has to follow are already written and tested: no ingredient renamed, no number altered, ' +
      'and the result labelled as machine-made until somebody from the place checks it.',
    cost: 'Tens of pounds a month at real usage, because a translation is done once and then kept.',
  },
  {
    title: 'Hosting',
    what: 'The app and its fourteen megabytes of records, served to anyone who opens it.',
    why: 'It fits inside a free tier today. It would stop fitting if enough people used it.',
    cost: 'Nothing so far.',
  },
  {
    title: 'The sources',
    what: 'Every photograph, article, recipe and register entry in the atlas.',
    why:
      'Wikipedia, Wikidata, Wikimedia Commons, Wikibooks and Italy’s regional open data are free to read and ' +
      'openly licensed. No key, no tier, no bill.',
    cost: 'Nothing, and it will stay nothing.',
  },
];

/**
 * What a donation explicitly does not buy.
 *
 * Stated because the product's whole claim is that its classifications come from
 * evidence and from people who cook the food. A reader who has just been asked for
 * money is entitled to know that the money does not move a badge, and saying it
 * plainly costs nothing.
 */
export const NOT_FOR_SALE = [
  'A record cannot be made Authentic by paying for it. That comes from evidence and from people who cook the dish.',
  'No dish is promoted, ranked higher, or featured because somebody paid.',
  'Nothing here is advertising, and no reader is tracked.',
];

/**
 * Where to give.
 *
 * Deliberately empty until a real destination exists. An app that shows a donate
 * button pointing nowhere is worse than one that shows none: it takes a reader's
 * goodwill and spends it on a dead link.
 */
export const DONATION_URL = process.env.EXPO_PUBLIC_DONATION_URL ?? '';

/** True when there is somewhere real to send a reader. */
export const canAcceptDonations = (): boolean => DONATION_URL.length > 0;

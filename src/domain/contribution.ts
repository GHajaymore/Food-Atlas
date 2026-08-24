/**
 * Sending a tradition in.
 *
 * The atlas has run out of things it can scrape. Every free corpus it can reach has
 * been walked: the Wikidata rows, the cuisine trees, five Wikibooks cookbooks, Italy's
 * regional register, UNESCO's inscriptions, and every article those link to in eighty
 * languages. What is left — 883 records with no article anywhere, and thousands more
 * with a name and a place and nothing else — is food nobody has written down. No
 * scraper reaches it, because the thing that would be scraped does not exist.
 *
 * So contribution is not a nice-to-have here; it is the only remaining way the atlas
 * grows. Which makes it worth being exact about what the app does and does not do
 * today: the four-step flow on `/contribute` is a **walkthrough** of what happens to a
 * submission, with example content from step two on. It does not send anything, and a
 * reader who reached the end saw "Published with its evidence visible" — a sentence
 * about a record that was never created.
 *
 * ## Why a form at source rather than a backend
 *
 * Storing submissions means a server, a database and a monthly bill, on a project that
 * collects no money. `requests.ts` already made this trade for missing-dish requests
 * and the reasoning is identical: a pre-filled form opened at its source costs
 * nothing, needs no API key, and needs no account from the person submitting. It is a
 * worse experience than capturing in-app. It is also the difference between a feature
 * that exists and one that is switched off.
 *
 * Point `EXPO_PUBLIC_CONTRIBUTION_FORM_URL` at a form and the fields below at its
 * fields. Until then `canContribute()` is false and the app says submissions are not
 * open yet — the same rule the donate button follows, for the same reason: a control
 * that goes nowhere spends a reader's goodwill on a dead link.
 */

/** What a contributor tells us. Every field is theirs, in their words. */
export interface Contribution {
  /** The dish, written the way they write it. Never corrected on the way in. */
  dish: string;
  place: string;
  /** Who makes it, and on what occasions. */
  cooks: string;
  /** Ingredients and equipment, as one piece of prose. */
  ingredients: string;
  /** Their relationship to the place. This is what makes the account evidence. */
  connection: string;
  /** A Wikimedia Commons file name, where they published one. */
  photo: string;
}

export const CONTRIBUTION_FORM = process.env.EXPO_PUBLIC_CONTRIBUTION_FORM_URL ?? '';

/**
 * The pre-filled entry ids, from the form's own "Get pre-filled link".
 *
 * Defaults are placeholders, not working ids. With no form configured nothing is ever
 * built from them, so a wrong default cannot send anyone anywhere.
 */
const FIELD: Record<keyof Contribution, string> = {
  dish: process.env.EXPO_PUBLIC_CONTRIB_FIELD_DISH ?? 'entry.2000001',
  place: process.env.EXPO_PUBLIC_CONTRIB_FIELD_PLACE ?? 'entry.2000002',
  cooks: process.env.EXPO_PUBLIC_CONTRIB_FIELD_COOKS ?? 'entry.2000003',
  ingredients: process.env.EXPO_PUBLIC_CONTRIB_FIELD_INGREDIENTS ?? 'entry.2000004',
  connection: process.env.EXPO_PUBLIC_CONTRIB_FIELD_CONNECTION ?? 'entry.2000005',
  photo: process.env.EXPO_PUBLIC_CONTRIB_FIELD_PHOTO ?? 'entry.2000006',
};

export const canContribute = (): boolean => CONTRIBUTION_FORM.length > 0;

/**
 * The least a submission needs to be worth reading.
 *
 * A dish and a place, because a name with nowhere attached cannot be assessed against
 * anything — and a connection to the place, because that is the whole difference
 * between this and copying a recipe off the internet, which the atlas already refuses
 * to do. Ingredients and a photograph are wanted and not required: somebody who knows
 * where a food is from and that nobody has written it down has already told us
 * something no source here holds.
 *
 * Written as a map of field to the words the form puts on the box, with the list derived
 * from its keys — see the same note on `REQUIRED_LABELS` in `proposals.ts`. A field
 * cannot become required without somebody deciding what to call it.
 */
export const REQUIRED_LABELS = {
  dish: 'the dish',
  place: 'where it is from',
  connection: 'your connection to the place',
} satisfies Partial<Record<keyof Contribution, string>>;

export const REQUIRED = Object.keys(REQUIRED_LABELS) as (keyof typeof REQUIRED_LABELS)[];

export function missingFrom(entry: Contribution): (keyof Contribution)[] {
  return REQUIRED.filter((field) => !entry[field]?.trim());
}

/**
 * The pre-filled link, or empty where there is nowhere to send it.
 *
 * Blank fields are left out of the query string rather than sent as empty values, so
 * the form's own "required" marks still mean something at the other end.
 */
export function contributionUrl(entry: Contribution): string {
  if (!canContribute()) return '';

  const params = new URLSearchParams({ usp: 'pp_url' });
  for (const [field, id] of Object.entries(FIELD) as [keyof Contribution, string][]) {
    const value = entry[field]?.trim();
    if (value) params.set(id, value);
  }
  return `${CONTRIBUTION_FORM}?${params.toString()}`;
}

/**
 * What the walkthrough's later steps are.
 *
 * Said in the app rather than only in a comment, because the findings and the seven
 * checks shown from step two on are example content — they describe how an assessment
 * works, not what this reader's entry scored. Presenting a worked example as a result
 * is the same category of untruth as a confidence score that does not match its own
 * breakdown, and this app has just fixed one of those.
 */
export const WALKTHROUGH_NOTE =
  'What follows is a worked example of what happens to a submission — the findings, the checks and the draft ' +
  'score below are from a record already in the atlas, not from what you have just typed. Your entry is not ' +
  'assessed here; it is assessed by people, after it is sent.';

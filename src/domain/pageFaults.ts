/**
 * What a reader would notice is wrong with a rendered page.
 *
 * Pure: it takes the page's visible text and title and returns the faults, so the rules
 * can be tested on the exact strings that once shipped. `scripts/check-pages.mjs` runs it
 * against every kind of screen in a real browser; `__tests__/page-faults.test.ts` proves
 * each rule still catches the fault it was written for. A check that has never failed is
 * not known to work.
 *
 * Every rule is here because its fault reached the live site while the unit tests were
 * green. Narrow a rule or allowlist a word, with the reason beside it — never delete one.
 */

export interface PageUnderCheck {
  /** The front page, where "submissions are not open" was printed under the main ask. */
  home?: boolean;
  /** The not-found screen, which is allowed the bare brand as its title. */
  notFound?: boolean;
  /** A record page, where an authenticity claim must agree with the badge. */
  record?: string;
}

/**
 * Words that look like a copy key and are not one.
 *
 * Empty until a real name trips the rule. Each addition needs the reason it is safe,
 * because this rule exists to catch `mealSnack` and must not learn to ignore it.
 */
const CAMEL_ALLOWED = new Set<string>([]);

export function faultsIn(page: PageUnderCheck, text: string, title: string, isEnglish: boolean): string[] {
  const faults: string[] = [];

  // A copy key printed as a word: "Vegan · mealSnack · mealCelebration", in all twelve
  // languages, because a label function returned the key instead of looking it up.
  for (const word of text.match(/\b[a-z]+[A-Z][a-zA-Z]{2,}\b/g) ?? []) {
    if (!CAMEL_ALLOWED.has(word)) faults.push(`copy key printed as a word: "${word}"`);
  }

  // A placeholder nobody filled: "{place}", "{n}".
  for (const hole of text.match(/\{[a-zA-Z]+\}/g) ?? []) {
    faults.push(`unfilled placeholder: "${hole}"`);
  }

  // A value that never arrived.
  for (const bad of text.match(/\b(undefined|NaN)\b|\[object Object\]/g) ?? []) {
    faults.push(`missing value printed as "${bad}"`);
  }

  // Two sentences with nothing between them: "…the dish that cook made.Engagement figures…".
  for (const joined of text.match(/\b[a-z]{2,}\.[A-Z][a-z]{2,}\b/g) ?? []) {
    faults.push(`sentences run together: "${joined}"`);
  }

  // The same long sentence more than once on one screen: thirty words about a video's
  // language, printed under each of three videos.
  const seen = new Map<string, number>();
  for (const line of text.split('\n')) {
    for (const sentence of line.split(/(?<=[.!?。！？])\s+/)) {
      const s = sentence.trim();
      if (s.split(/\s+/).length < 12) continue;
      seen.set(s, (seen.get(s) ?? 0) + 1);
    }
  }
  for (const [sentence, count] of seen) {
    if (count > 1) faults.push(`printed ${count} times: "${sentence.slice(0, 90)}…"`);
  }

  // "Authentic Version" heading the method of a record scored 27/100. 🟢 is the Authentic
  // badge; a record without it must not claim authenticity anywhere on the page.
  if (page.record && isEnglish && !text.includes('🟢')) {
    for (const claim of ['Authentic Version', 'considered authentic?']) {
      if (text.includes(claim)) faults.push(`"${claim}" on a record not badged Authentic`);
    }
  }

  // "Submissions are not open yet — there is nowhere to send them", under the main ask on
  // the front page, while /propose was accepting them.
  if (page.home && /not open yet/i.test(text)) {
    faults.push('home page says submissions are not open, and /propose is open');
  }

  // Every tab reading "WikiFoodia" whatever it was showing.
  if (!page.home && !page.notFound && title.trim() === 'WikiFoodia') {
    faults.push('document title is the bare brand');
  }

  return faults;
}

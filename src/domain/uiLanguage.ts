/**
 * Which language the app speaks to the reader in.
 *
 * Distinct from `language.ts`, and the distinction is the whole point of this file.
 * That module decides what language a **record** can be read in — the food, the
 * method, somebody's tradition — and it is hedged about with rules, because a
 * mistranslated fermentation time is a corrupted record and a substituted ingredient
 * name is the silent customisation the brief forbids.
 *
 * This is the app's own chrome: "Search", "Go back", "Nothing recorded here yet".
 * Those are our sentences about our software. Getting one slightly wrong is a typo,
 * not a falsified record, so it does not need `translate.ts`'s guarantees and should
 * not be gated behind them. A reader should not have to read English to find the
 * button, and they certainly should not have to read English to be told the atlas
 * holds nothing for their country yet.
 *
 * ## What is deliberately not here
 *
 * The evidence prose — disclaimers, score explanations, the sentence that says
 * nobody from the place has confirmed a record. Those make precise claims about what
 * is and is not known, and a loose translation of "nobody has confirmed this" is not
 * a typo; it misstates the record's standing, which is the one thing this atlas is
 * for. They stay in English until somebody who speaks the language checks them, and
 * the fallback below makes that visible rather than hiding it.
 *
 * ## Fallback, not failure
 *
 * A catalogue may be partial. A missing key falls through to English rather than
 * rendering a key name or an empty string, so a half-translated interface is a
 * usable interface with English patches — which is honest about how much has been
 * done, and is what lets a language ship before it is finished.
 */

export const DEFAULT_LOCALE = 'en';

/** "en-GB" → "en". Also tolerates the underscore form some platforms report. */
export const baseOf = (tag: string): string =>
  (tag ?? '').trim().toLowerCase().replace(/_/g, '-').split('-')[0] ?? '';

/**
 * The best available locale for a reader, or English.
 *
 * `preferred` is the reader's list in their own order of preference — the browser
 * and both mobile platforms all supply one, and the order is a real preference
 * rather than a formality: someone who lists Catalan before Spanish has said
 * something, and honouring the order is the difference between reading it and
 * ignoring it.
 *
 * An exact match wins over a base-language match across the *whole* list before any
 * base match is considered, so a reader asking for `pt-BR` then `en` gets Brazilian
 * Portuguese if we have it, and European Portuguese — not English — if we do not.
 */
export function negotiateLocale(
  preferred: readonly string[],
  available: readonly string[],
): string {
  const offered = available.filter(Boolean);
  if (!offered.length) return DEFAULT_LOCALE;

  const wanted = (preferred ?? []).filter(Boolean).map((tag) => tag.trim().toLowerCase().replace(/_/g, '-'));

  /*
   * One preference at a time, narrowed before moving on — the lookup RFC 4647
   * describes, and the only order that respects what the reader said.
   *
   * Two passes over the whole list would be easier to write and wrong: a reader
   * asking for `pt-BR` and then `en` would get English from the exact-match pass
   * before `pt` was ever considered. Their second choice is a fallback, not a
   * preference over their own language.
   */
  for (const tag of wanted) {
    const exact = offered.find((code) => code.toLowerCase() === tag);
    if (exact) return exact;

    const base = baseOf(tag);
    const related = base && offered.find((code) => baseOf(code) === base);
    if (related) return related;
  }

  return offered.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : offered[0];
}

/**
 * What the platform says the reader prefers.
 *
 * Three sources, tried in order, and no new dependency for any of them:
 *
 *   - `navigator.languages` — the browser's ordered list, which is the good one.
 *   - `navigator.language` — one tag, on older browsers and some webviews.
 *   - `Intl.DateTimeFormat().resolvedOptions().locale` — the device locale on
 *     React Native, where Hermes ships a full ICU.
 *
 * Wrapped because every one of them is absent somewhere, and a crash while working
 * out which language to say "Search" in would take the whole app down with it.
 */
export function devicePreferences(): string[] {
  const found: string[] = [];

  try {
    const nav = (globalThis as { navigator?: { languages?: readonly string[]; language?: string } }).navigator;
    if (Array.isArray(nav?.languages)) found.push(...nav.languages.filter((l) => typeof l === 'string'));
    if (typeof nav?.language === 'string') found.push(nav.language);
  } catch {
    // A platform without `navigator`. The next source may still answer.
  }

  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions().locale;
    if (typeof resolved === 'string') found.push(resolved);
  } catch {
    // No ICU. English it is.
  }

  return [...new Set(found)];
}

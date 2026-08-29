/**
 * Reading the app in the reader's own language.
 *
 * Three pieces, kept apart so the one that can be wrong is the one that can be
 * tested: `uiLanguage.ts` negotiates a locale and is pure, `catalogues.ts` holds the
 * words, and this assembles them.
 *
 * The store below is a `zustand` store like the rest of the app's state, and the
 * locale is chosen once at startup rather than read on every render. A reader can
 * override it — the device is a good guess and not an instruction, and someone
 * reading in their second language on a borrowed phone should not have to change the
 * phone.
 */

import { create } from 'zustand';

import { negotiateLocale, devicePreferences, DEFAULT_LOCALE } from '../domain/uiLanguage';
import { EN, type Copy } from './copy';
import { COVERAGE, LOCALE_CODES } from './manifest';

export type { Copy } from './copy';

/** Every locale the chrome exists in, English first. */
export const UI_LOCALES: readonly string[] = [DEFAULT_LOCALE, ...LOCALE_CODES];

/**
 * The catalogues that have actually arrived.
 *
 * Twelve languages of chrome are 895 KB of source and about 15% of the bundle on the
 * wire, and every reader was downloading all of them in order to read in one. They are
 * fetched per locale now; English is compiled in because it is the fallback behind every
 * key and has to exist before anything can render.
 *
 * A locale that has not arrived is not an error state — `copyFor` returns English, which
 * is exactly what a missing key already did. That keeps the failure mode of a network
 * problem identical to the failure mode of an unfinished translation, which is one this
 * app already handles honestly.
 */
const arrived = new Map<string, Partial<Copy>>();

/** In flight, so eight components asking at once ask the network once. */
const asking = new Map<string, Promise<void>>();

/**
 * Put a catalogue in place without going to the network.
 *
 * The seam the tests use, and the one a native build would use if it ever bundles its
 * catalogues rather than fetching them. Without it every test that checks a translation
 * would be asserting against the English fallback and passing for the wrong reason —
 * which is a worse outcome than failing, because it looks like coverage.
 */
export function installCatalogue(locale: string, catalogue: Partial<Copy>): void {
  arrived.set(locale, catalogue);
}

/**
 * Fetch one locale's chrome.
 *
 * Never rejects. A reader whose catalogue does not arrive gets English — the same thing
 * they got before this file changed, and better than a blank page for the sake of a
 * language file.
 */
export function loadCopy(locale: string): Promise<void> {
  if (locale === DEFAULT_LOCALE || arrived.has(locale)) return Promise.resolve();

  const already = asking.get(locale);
  if (already) return already;

  const base = process.env.EXPO_PUBLIC_DATA_URL ?? '';
  const request = (async () => {
    try {
      const response = await fetch(`${base}/data/copy/${locale}.json`);
      if (!response.ok) return;
      const catalogue = (await response.json()) as Partial<Copy>;
      /* An empty or malformed body would replace the chrome with nothing. English is a
         better answer than a page of blanks. */
      if (catalogue && typeof catalogue === 'object' && Object.keys(catalogue).length) {
        arrived.set(locale, catalogue);
      }
    } catch {
      /* Offline, or the file is not served. English is already behind every key. */
    }
  })();

  asking.set(locale, request);
  return request;
}

/**
 * The chrome in one language, with English behind every key.
 *
 * Built by spreading rather than by lookup-with-fallback at the call site, so a
 * component reads `copy.search` and cannot forget the fallback. A partial catalogue
 * therefore renders as a mostly-translated screen with English patches, which is
 * what a half-finished translation honestly looks like.
 */
export function copyFor(locale: string): Copy {
  const catalogue = arrived.get(locale);
  /* `locale` last so it always describes what was actually built, never what a
     catalogue might claim. */
  return catalogue ? { ...EN, ...catalogue, locale } : EN;
}

/** True when this locale's chrome was translated by machine rather than by a person. */
export const isMachineTranslated = (locale: string): boolean => locale !== DEFAULT_LOCALE;

/**
 * How much of a locale's chrome has actually been translated, 0 to 1.
 *
 * Exists because the English catalogue is expected to grow for a while yet: the
 * strings are still being lifted out of the screens, and until that is finished the
 * key set is a moving target. Translating twelve languages against a moving target
 * means retranslating twelve languages every time a key is added, so the order of
 * work is English first, everything else after.
 *
 * That makes partial catalogues normal rather than a fault, and the fallback already
 * handles them — but "normal" must not mean "invisible". This is the number that says
 * how much is left, so a language can be reported as 60% done instead of quietly
 * serving English under its own flag.
 */
/*
 * Read from the manifest rather than counted here, because the catalogue being counted
 * may not have arrived — and the language picker shows this figure for *every* locale,
 * including the eleven a reader has not chosen. Counting what is in memory would report
 * 0% for every language on offer, which is a confident wrong number rather than a slow
 * one. `scripts/split-catalogues.mjs` computes it from the real catalogues at build time
 * and a test asserts the two still agree.
 */
export function translationCoverage(locale: string): number {
  if (locale === DEFAULT_LOCALE) return 1;
  return COVERAGE[locale] ?? 0;
}

interface LocaleState {
  locale: string;
  copy: Copy;
  /** Whether the locale came from the device or the reader chose it. */
  chosen: boolean;
  setLocale: (locale: string) => void;
}

/**
 * Where a reader's choice is kept between visits.
 *
 * Only a *chosen* locale is stored, never a detected one, and the distinction is the
 * whole point. A reader whose browser is set to Spanish should keep getting Spanish
 * even if that guess improves later; a reader who explicitly picked Japanese on an
 * English machine must not have that overridden on the next load. Storing the guess
 * would freeze it and make the two indistinguishable.
 *
 * `localStorage` directly rather than a storage library, because the web build is what
 * is launching and this needs no dependency at all. Every access is guarded: Safari in
 * private mode throws on write, and a locale is not worth a blank page.
 *
 * Native (the App Store / Play Store build) has no `localStorage`, so the choice lasts
 * only as long as the process. Fixing that properly needs AsyncStorage — one small free
 * dependency — and is queued rather than added here.
 */
const CHOICE = 'wikifoodia.locale';

const storedChoice = (): string | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(CHOICE);
  } catch {
    return null;
  }
};

const rememberChoice = (locale: string): void => {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(CHOICE, locale);
  } catch {
    /* A reader who cannot be remembered still gets the language they just picked. */
  }
};

export const useLocale = create<LocaleState>((set) => {
  /* The stored choice wins over the device, but only if it is still a language we
     have — a catalogue removed in a later release must not strand a reader. */
  const remembered = storedChoice();
  const chosen = remembered !== null && UI_LOCALES.includes(remembered);
  const locale = chosen ? remembered : negotiateLocale(devicePreferences(), UI_LOCALES);

  return {
    locale,
    copy: copyFor(locale),
    chosen,
    /*
     * The choice is remembered at once; the page changes language when the words for it
     * have arrived.
     *
     * Switching first and swapping the words in afterwards would show the reader a page
     * of English on the way to the language they just asked for — a flash of the one
     * thing they were trying to get away from. Waiting is a few hundred milliseconds on
     * an 18 KB file, and nothing on the second visit to a language.
     *
     * `locale` is set alongside `copy` rather than before it, so the two can never
     * disagree: no render sees a Japanese locale with English copy.
     */
    setLocale: (next) => {
      rememberChoice(next);
      void loadCopy(next).then(() => set({ locale: next, copy: copyFor(next), chosen: true }));
    },
  };
});

/**
 * The chrome, for a component.
 *
 * `useCopy()` rather than `useLocale().copy` at every call site: the selector keeps a
 * component from re-rendering when the locale is set to what it already was.
 */
/**
 * Tell the document which language it is in.
 *
 * Expo emits `<html lang="en">` and nothing changed it, so a reader who chose Japanese
 * got a page of Japanese inside a document still declaring itself English. A screen
 * reader takes the voice and the pronunciation rules from that attribute: the text was
 * read out with English phonetics, which is closer to noise than to a translation.
 *
 * WCAG 3.1.1 (Language of Page) is a Level A criterion, and this is the whole of it.
 *
 * Subscribed rather than set inside `setLocale`, so it also covers the language chosen
 * before the first render — the case that matters most, because it is every returning
 * reader who ever picked one.
 */
const declareLanguage = (locale: string): void => {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
};

declareLanguage(useLocale.getState().locale);
useLocale.subscribe((state) => declareLanguage(state.locale));

export const useCopy = (): Copy => useLocale((state) => state.copy);

/**
 * Join a list with the reader's own conjunction.
 *
 * Three places built a list by hand, and one of them joined with a literal `' or '` — so
 * the single word holding a French reader's ingredients together was English. The
 * conjunction is the part of a list that has to be translated, which makes it exactly the
 * part that should not be typed at a call site.
 *
 * Everything before the final pair is comma-joined; only the last join takes the word.
 * That is wrong for a handful of languages that punctuate lists differently, and right for
 * the twelve shipped here — a real list formatter is `Intl.ListFormat`, which is worth
 * moving to if the locale set ever grows past what these catalogues cover.
 */
function join(pattern: string, items: string[]): string {
  const parts = items.filter(Boolean);
  if (parts.length <= 1) return parts[0] ?? '';
  return pattern
    .replace('{list}', parts.slice(0, -1).join(', '))
    .replace('{last}', parts[parts.length - 1]);
}

/** "a, b and c". */
export const joinAnd = (copy: Copy, items: string[]): string => join(copy.listAnd, items);

/** "a, b or c" — for a list of things any one of which would do. */
export const joinOr = (copy: Copy, items: string[]): string => join(copy.listOr, items);

/**
 * A number written the way the reader's language writes numbers.
 *
 * `value.toLocaleString()` with no argument formats in the *device's* locale, not the
 * one the reader picked in this app. Those are usually the same and occasionally not,
 * and when they differ the page mixes conventions: the atlas shipped "17,740
 * Traditionen" to a German reader, who writes 17.740.
 *
 * There are 29 bare `toLocaleString()` calls in this codebase and this fixes one of
 * them — the rest are listed in the commit that added this. It exists so the correct
 * form is available at the next call site rather than being rediscovered.
 */
export const formatNumber = (value: number, locale: string): string => {
  try {
    return value.toLocaleString(locale);
  } catch {
    /* An unknown locale must not cost the reader the number. */
    return value.toLocaleString();
  }
};

/**
 * A number formatter bound to the language this reader chose.
 *
 * The hook form exists because almost every call site is inside a component that already
 * has to reach the locale for nothing else. `const n = useNumber()` then reads the way the
 * bare `toLocaleString()` it replaces did, which is what makes the sweep safe to do in one
 * pass — the diff is the argument, never the shape of the call.
 */
export const useNumber = (): ((value: number) => string) => {
  const locale = useLocale((state) => state.locale);
  return (value: number) => formatNumber(value, locale);
};

/**
 * A counted noun in the form the reader's language actually uses.
 *
 * English has two: one tradition, {n} traditions. Russian and Polish have three, and the
 * third is not an edge case — Russian wants "2 традиции" and "5 традиций", and it wants
 * "21 традиция" as well, because the rule reads the last digit rather than the size of
 * the number. The two-form catalogue printed "21 традиций", which is wrong in a way a
 * Russian reader notices immediately.
 *
 * `Intl.PluralRules` knows every one of these and is already in the browser, so the
 * categories cost nothing. What costs something is the copy, and the shape here keeps that
 * additive: the existing `one`/`other` keys stay exactly as they are, and a language that
 * needs more supplies `{key}Few` or `{key}Many` beside them. A language that does not need
 * them adds nothing and behaves as before.
 *
 * Falls back to `other` whenever a form is missing, which is what the catalogue held
 * before this existed — worse grammar, never a missing sentence.
 */
export const pluralOf = (
  copy: Copy,
  locale: string,
  oneKey: keyof Copy,
  otherKey: keyof Copy,
  count: number,
): string => {
  const table = copy as unknown as Record<string, string>;
  let category = count === 1 ? 'one' : 'other';
  try {
    category = new Intl.PluralRules(locale).select(count);
  } catch {
    /* No Intl.PluralRules here; one-or-other is the honest fallback. */
  }

  const suffixed = (name: string) => table[`${String(otherKey)}${name}`];
  const chosen =
    category === 'one'
      ? table[String(oneKey)]
      : category === 'few'
        ? (suffixed('Few') ?? table[String(otherKey)])
        : category === 'many'
          ? (suffixed('Many') ?? table[String(otherKey)])
          : table[String(otherKey)];

  return (chosen ?? table[String(otherKey)] ?? '').replace('{n}', formatNumber(count, locale));
};

/** `pluralOf` bound to this reader's language, for a component. */
export const usePlural = (): ((oneKey: keyof Copy, otherKey: keyof Copy, count: number) => string) => {
  const locale = useLocale((state) => state.locale);
  const copy = useCopy();
  return (oneKey, otherKey, count) => pluralOf(copy, locale, oneKey, otherKey, count);
};

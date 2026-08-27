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
import { CATALOGUES } from './catalogues';

export type { Copy } from './copy';

/** Every locale the chrome exists in, English first. */
export const UI_LOCALES: readonly string[] = [DEFAULT_LOCALE, ...Object.keys(CATALOGUES)];

/**
 * The chrome in one language, with English behind every key.
 *
 * Built by spreading rather than by lookup-with-fallback at the call site, so a
 * component reads `copy.search` and cannot forget the fallback. A partial catalogue
 * therefore renders as a mostly-translated screen with English patches, which is
 * what a half-finished translation honestly looks like.
 */
export function copyFor(locale: string): Copy {
  const catalogue = CATALOGUES[locale];
  return catalogue ? { ...EN, ...catalogue } : EN;
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
export function translationCoverage(locale: string): number {
  const catalogue = CATALOGUES[locale];
  if (!catalogue) return locale === DEFAULT_LOCALE ? 1 : 0;

  const keys = Object.keys(EN) as (keyof Copy)[];
  const done = keys.filter((key) => {
    const value = catalogue[key];
    return typeof value === 'string' && value.trim() !== '' && value !== EN[key];
  });
  return done.length / keys.length;
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
    setLocale: (next) => {
      rememberChoice(next);
      set({ locale: next, copy: copyFor(next), chosen: true });
    },
  };
});

/**
 * The chrome, for a component.
 *
 * `useCopy()` rather than `useLocale().copy` at every call site: the selector keeps a
 * component from re-rendering when the locale is set to what it already was.
 */
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

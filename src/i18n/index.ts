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

export const useLocale = create<LocaleState>((set) => {
  const detected = negotiateLocale(devicePreferences(), UI_LOCALES);

  return {
    locale: detected,
    copy: copyFor(detected),
    chosen: false,
    setLocale: (locale) => set({ locale, copy: copyFor(locale), chosen: true }),
  };
});

/**
 * The chrome, for a component.
 *
 * `useCopy()` rather than `useLocale().copy` at every call site: the selector keeps a
 * component from re-rendering when the locale is set to what it already was.
 */
export const useCopy = (): Copy => useLocale((state) => state.copy);

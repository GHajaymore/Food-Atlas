/**
 * Translation state: the reader's language, and the cache of translations fetched
 * for it.
 *
 * A fetched translation is held in memory alongside the record's curated ones, but
 * never merged into the record — it stays flagged `machine: true` so the UI keeps
 * labelling it, and it never affects the confidence score. Community validation is
 * what would promote it, exactly as it is for the record itself.
 */

import type { Copy } from '../i18n/copy';
import { create } from 'zustand';
import { useLocale } from '../i18n';
import { readDish, type ReadableDish } from '../domain/translate';
import { PreservationError, translationProvider } from '../domain/translationProvider';
import type { Dish, DishTranslation } from '../domain/types';

type Status = 'idle' | 'loading' | 'error';

/**
 * Why a translation is not on screen — in a form the UI can put words to.
 *
 * `service` carries the endpoint's own sentence, which is written for a reader and is
 * shown as it arrived. `refused` carries none: the record broke a preservation rule,
 * and the reason is a diagnostic in English that belongs in the log rather than under
 * a Japanese heading. The screen says so in the reader's language instead.
 */
export type TranslationFailure = { kind: 'refused' } | { kind: 'service'; text: string };

interface TranslationState {
  /** The reader's preferred language, BCP-47. Applies to records and to video. */
  language: string;
  /** Fetched translations, keyed `${dishId}:${code}`. */
  cache: Record<string, DishTranslation>;
  status: Record<string, Status>;
  errors: Record<string, TranslationFailure>;

  setLanguage: (code: string) => void;
  /**
   * Fetch a translation for a record. No-op if one is already present.
   * `auto` marks the pass that fires on language change, so a failed request is not
   * retried on every render — only an explicit retry clears the error.
   */
  requestTranslation: (dish: Dish, options?: { auto?: boolean }) => Promise<void>;
  /** Clear a failed attempt and try again, on the reader's explicit request. */
  retryTranslation: (dish: Dish) => Promise<void>;
  /** Resolve a record for reading, preferring curated then fetched translations. */
  /** Takes copy because the notes it builds are prose, not data. */
  read: (copy: Copy, dish: Dish) => ReadableDish;
  statusFor: (dish: Dish) => Status;
  errorFor: (dish: Dish) => TranslationFailure | undefined;
  /** False when no translation service is wired up; the UI then says so plainly. */
  canTranslate: () => boolean;
  /**
   * Whether the reader has chosen a record language separately from the app's.
   *
   * The record language follows the app's until they do. After that it is theirs, and the
   * two are allowed to differ — reading the chrome in English and the record in Tamil is a
   * legitimate thing to want, and `LanguageBar` exists to make it possible.
   */
  languageChosen: boolean;
}

const key = (dishId: number, code: string) => `${dishId}:${code}`;

/** The app's current language, read once at startup. */
const readerLocale = () => useLocale.getState().locale;

export const useTranslations = create<TranslationState>((set, get) => ({
  /*
   * The language the reader picked for the app, not English.
   *
   * This was hard-coded to 'en' and is the reason Ajay saw a Japanese page with an English
   * record on it. Two pieces of state name a language: the chrome's, in `useLocale`, and
   * the record's, here. They were never connected, so choosing Japanese translated the
   * furniture and left every record in the language it was written in — and
   * `requestTranslation` returns early when the record is already in the target language,
   * so nothing was even requested. Nothing failed; nothing was asked for.
   *
   * Kozhikode Halwa is written in English, so with this at 'en' the record screen asked
   * for no translation at all and reported no error, on a page that was otherwise entirely
   * Japanese.
   */
  language: readerLocale(),
  /** True once the reader has picked a record language of their own. See the subscription. */
  languageChosen: false,
  cache: {},
  status: {},
  errors: {},

  setLanguage: (language) => set({ language, languageChosen: true }),

  canTranslate: () => translationProvider.isConfigured(),

  requestTranslation: async (dish, options) => {
    const { language, cache } = get();
    const cacheKey = key(dish.id, language);

    if (dish.sourceLanguage === language) return;
    if (dish.translations?.[language] || cache[cacheKey]) return;
    if (get().status[cacheKey] === 'loading') return;
    // An automatic pass does not retry a request that already failed — otherwise a
    // failing provider would re-fire on every render. An explicit retry clears it.
    if (options?.auto && get().status[cacheKey] === 'error') return;
    if (!translationProvider.isConfigured()) return;

    set((s) => ({ status: { ...s.status, [cacheKey]: 'loading' } }));

    try {
      const translation = await translationProvider.translate({ dish, target: language });
      set((s) => ({
        cache: { ...s.cache, [cacheKey]: translation },
        status: { ...s.status, [cacheKey]: 'idle' },
      }));
    } catch (error) {
      /* The service's own words reach the reader; a broken rule does not. See
         `TranslationFailure` and `PreservationError`. */
      if (error instanceof PreservationError) console.warn('[translation]', error.message);
      const failure: TranslationFailure =
        error instanceof PreservationError
          ? { kind: 'refused' }
          : { kind: 'service', text: error instanceof Error ? error.message : 'Translation failed.' };
      set((s) => ({
        status: { ...s.status, [cacheKey]: 'error' },
        errors: { ...s.errors, [cacheKey]: failure },
      }));
    }
  },

  retryTranslation: async (dish) => {
    const cacheKey = key(dish.id, get().language);
    const errors = { ...get().errors };
    delete errors[cacheKey];
    set((s) => ({ status: { ...s.status, [cacheKey]: 'idle' }, errors }));
    await get().requestTranslation(dish);
  },

  read: (copy, dish) => {
    const { language, cache } = get();
    const fetched = cache[key(dish.id, language)];

    // A fetched translation is layered on for reading only; the record on disk is
    // untouched, and a curated translation always wins over a machine one.
    const forReading: Dish =
      fetched && !dish.translations?.[language]
        ? { ...dish, translations: { ...(dish.translations ?? {}), [language]: fetched } }
        : dish;

    return readDish(copy, forReading, language);
  },

  statusFor: (dish) => get().status[key(dish.id, get().language)] ?? 'idle',
  errorFor: (dish) => get().errors[key(dish.id, get().language)],
}));

/*
 * The record language follows the app's, until the reader says otherwise.
 *
 * Subscribed rather than wired into `setLocale`, so `i18n` does not have to know that a
 * translation store exists — the dependency runs one way, and this file is the one that
 * cares.
 */
useLocale.subscribe((state) => {
  if (useTranslations.getState().languageChosen) return;
  useTranslations.setState({ language: state.locale });
});

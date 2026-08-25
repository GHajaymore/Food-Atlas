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
import { readDish, type ReadableDish } from '../domain/translate';
import { translationProvider } from '../domain/translationProvider';
import type { Dish, DishTranslation } from '../domain/types';

type Status = 'idle' | 'loading' | 'error';

interface TranslationState {
  /** The reader's preferred language, BCP-47. Applies to records and to video. */
  language: string;
  /** Fetched translations, keyed `${dishId}:${code}`. */
  cache: Record<string, DishTranslation>;
  status: Record<string, Status>;
  errors: Record<string, string>;

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
  errorFor: (dish: Dish) => string | undefined;
  /** False when no translation service is wired up; the UI then says so plainly. */
  canTranslate: () => boolean;
}

const key = (dishId: number, code: string) => `${dishId}:${code}`;

export const useTranslations = create<TranslationState>((set, get) => ({
  language: 'en',
  cache: {},
  status: {},
  errors: {},

  setLanguage: (language) => set({ language }),

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
      // Surfaced verbatim: a rejected translation says which rule it broke.
      set((s) => ({
        status: { ...s.status, [cacheKey]: 'error' },
        errors: { ...s.errors, [cacheKey]: error instanceof Error ? error.message : 'Translation failed.' },
      }));
    }
  },

  retryTranslation: async (dish) => {
    const cacheKey = key(dish.id, get().language);
    set((s) => ({
      status: { ...s.status, [cacheKey]: 'idle' },
      errors: { ...s.errors, [cacheKey]: '' },
    }));
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

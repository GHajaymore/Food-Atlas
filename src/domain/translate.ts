/**
 * Reading a record in another language.
 *
 * The brief lists "Reinterpreted by AI" among the things the platform must not do,
 * and requires that the identity of the food be preserved. Translation is compatible
 * with that only under three rules, which this module enforces:
 *
 *   1. **Names are preserved.** The dish name, the traditional ingredients and the
 *      traditional equipment are never translated. "Nendran banana" does not become
 *      "plantain"; "khökhüür" does not become "leather bag"; "metate" does not become
 *      "grinder". A gloss may sit ALONGSIDE the original term — never in place of it.
 *      Substituting a familiar local equivalent for a traditional ingredient name is
 *      the same silent customization the brief forbids, just performed by a dictionary.
 *
 *   2. **Provenance is stated.** Every translated view says who translated it and
 *      whether a human checked it. A machine translation is labelled as one.
 *
 *   3. **Absence is stated, not filled.** Where no translation has been recorded, the
 *      app says so and offers the contribution route. It does not quietly machine-
 *      translate the method — a mistranslated fermentation time or technique is a
 *      corrupted record, not a rough edge.
 */

import type { Dish, DishTranslation } from './types';

export type TranslationStatus = 'original' | 'human' | 'machine' | 'missing';

export interface ReadableDish {
  /** The text to render, already resolved to the requested language where possible. */
  blurb: string;
  prepSummary: string;
  steps: string[];
  adaptation: Dish['adaptation'];
  disclaimer: string;

  /** Never translated — rule 1. */
  name: string;
  ingredients: string[];
  equipment: string[];
  /** Gloss for preserved terms, shown next to the original. */
  glossary: Record<string, string>;

  status: TranslationStatus;
  /** Who produced the translation, when there is one. */
  translator?: string;
  /** The one-line provenance banner. Empty when reading the original. */
  note: string;
}

/**
 * Resolve a record for display in `preferred`.
 *
 * Falls back to the original text — never to a different translation and never to a
 * machine translation the record does not actually carry.
 */
export function readDish(dish: Dish, preferred: string): ReadableDish {
  const preserved = {
    name: dish.name,
    ingredients: dish.ingredients,
    equipment: dish.equipment,
  };

  // Already in the reader's language.
  if (dish.sourceLanguage === preferred) {
    return {
      ...preserved,
      blurb: dish.blurb,
      prepSummary: dish.prepSummary,
      steps: dish.steps,
      adaptation: dish.adaptation,
      disclaimer: dish.disclaimer,
      glossary: {},
      status: 'original',
      note: '',
    };
  }

  const translation: DishTranslation | undefined = dish.translations?.[preferred];

  if (!translation) {
    return {
      ...preserved,
      blurb: dish.blurb,
      prepSummary: dish.prepSummary,
      steps: dish.steps,
      adaptation: dish.adaptation,
      disclaimer: dish.disclaimer,
      glossary: {},
      status: 'missing',
      note:
        'No translation of this method has been recorded yet, so it is shown in the language it was documented ' +
        "in. We'd rather show you the original than a machine's guess at a fermentation time.",
    };
  }

  return {
    ...preserved,
    blurb: translation.blurb,
    prepSummary: translation.prepSummary,
    steps: translation.steps,
    adaptation: translation.adaptation,
    disclaimer: translation.disclaimer,
    glossary: translation.glossary ?? {},
    status: translation.machine ? 'machine' : 'human',
    translator: translation.translator,
    note: translation.machine
      ? `Machine translation by ${translation.translator}. No one from the community has checked it — ` +
        'ingredient and equipment names are left in the original.'
      : `Translated by ${translation.translator}. Ingredient and equipment names are left in the original.`,
  };
}

/** The languages a record can actually be read in, original first. */
export const availableLanguages = (dish: Dish): string[] => [
  dish.sourceLanguage,
  ...Object.keys(dish.translations ?? {}),
];

/** True when the record carries a translation into `code`. */
export const hasTranslation = (dish: Dish, code: string): boolean =>
  dish.sourceLanguage === code || !!dish.translations?.[code];

/**
 * The sentence a card prints under a dish's name, in the reader's language where the
 * build wrote it.
 *
 * Most card text is an account quoted from a source and stays as written. But about
 * 7,000 cookbook records carry a sentence the build composes — "A published recipe for
 * Agedashi Tofu, written for a general audience rather than recorded in Japan" — and that
 * one was English on all twelve language versions. Worse, a recipe from the Portuguese
 * cookbook was labelled "Português" above it, because the card took the template for
 * the source's own words. Found on 9 October by loading every screen in Japanese.
 *
 * The language name comes from the browser's own list (`Intl.DisplayNames`), so it is
 * "francés" in Spanish and "フランス語" in Japanese without anything here guessing; the
 * English name the build stored is the fallback.
 */

import type { Copy } from '../i18n/copy';
import { placeName } from './continents';
import type { Dish } from './types';

export interface CardText {
  text: string;
  /** True when the text is the reader's own language, whatever the source was. */
  translated: boolean;
}

const languageName = (code: string, locale: string, fallback: string): string => {
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(code) ?? fallback;
  } catch {
    return fallback;
  }
};

export function cardText(dish: Dish, copy: Copy, locale: string): CardText {
  const key = dish.blurbKey as keyof Copy | undefined;
  const template = key ? (copy[key] as unknown) : undefined;
  if (typeof template !== 'string' || !dish.blurbParams) return { text: dish.blurb, translated: false };
  const { dish: name, country, language, languageName: english } = dish.blurbParams;
  const text = template
    .replace('{dish}', name ?? dish.name)
    .replace('{country}', placeName(country ?? dish.loc.country, copy, locale))
    .replace('{language}', language ? languageName(language, locale, english ?? language) : '');
  return { text, translated: true };
}

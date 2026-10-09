/**
 * A card's composed sentence reads in the reader's language.
 *
 * About 7,000 cookbook cards carried "A published recipe for …" in English on every
 * language version, and a Portuguese-cookbook card was labelled "Português" above it.
 * These run the real shipped catalogues, so a missing translation or an unfilled
 * placeholder fails here rather than on somebody's phone.
 */

import { cardText } from '../src/domain/cardText';
import type { Dish } from '../src/domain/types';
import { CATALOGUES } from '../src/i18n/catalogues';
import { EN, type Copy } from '../src/i18n/copy';

const copyFor = (locale: string): Copy => ({ ...EN, ...(CATALOGUES[locale] ?? {}) }) as Copy;

const abacaxi = {
  name: 'Abacaxi grelhado',
  loc: { country: 'Portugal', region: '', province: '', city: '', village: '' },
  blurb: 'A published recipe for Abacaxi grelhado, written in Portuguese in the cookbook of Portugal — a common version rather than one household\'s.',
  blurbKey: 'blurbCookbookNative',
  blurbParams: { dish: 'Abacaxi grelhado', country: 'Portugal', language: 'pt', languageName: 'Portuguese' },
} as unknown as Dish;

test('English keeps the sentence the build wrote', () => {
  expect(cardText(abacaxi, copyFor('en'), 'en')).toEqual({ text: abacaxi.blurb, translated: true });
});

test.each(['es', 'fr', 'de', 'it', 'pt', 'nl', 'pl', 'tr', 'ru', 'hi', 'zh', 'ja'])(
  'in %s it is translated, names the dish, and leaves no placeholder',
  (locale) => {
    const { text, translated } = cardText(abacaxi, copyFor(locale), locale);
    expect(translated).toBe(true);
    expect(text).toContain('Abacaxi grelhado');
    expect(text).not.toMatch(/\{[a-z]+\}/i);
    expect(text).not.toContain('A published recipe');
  },
);

test('the language is named in the reader’s language, not the stored English', () => {
  expect(cardText(abacaxi, copyFor('es'), 'es').text).toContain('portugués');
  expect(cardText(abacaxi, copyFor('ja'), 'ja').text).toContain('ポルトガル語');
});

test('a record with a quoted account is left exactly as written', () => {
  const quoted = { ...abacaxi, blurbKey: undefined, blurbParams: undefined, blurb: 'Pineapple grilled with rum.' } as unknown as Dish;
  expect(cardText(quoted, copyFor('ja'), 'ja')).toEqual({ text: 'Pineapple grilled with rum.', translated: false });
});

describe('which ingredient lists read as recipe lines', () => {
  const { listsRecipeLines } = jest.requireActual('../src/domain/method') as typeof import('../src/domain/method');
  test('a published recipe’s lines do', () => {
    expect(listsRecipeLines(['1 abacaxi, cortado em fatias de 2 centímetros;', '3 colheres (sopa) de rum;', 'Sorvete de abacaxi.'])).toBe(true);
  });
  test('names do not, even long ones', () => {
    expect(listsRecipeLines(['Wheat starch or maida', 'Coconut oil', 'Sugar or jaggery', 'Cashews', 'Cardamom'])).toBe(false);
    expect(listsRecipeLines(['Greenland shark'])).toBe(false);
  });
});

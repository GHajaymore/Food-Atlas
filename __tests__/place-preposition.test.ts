/**
 * Country names inside German and Dutch sentences.
 *
 * "wie es in Vereinigte Staaten zubereitet wird" was on every German record filed under
 * the United States. The last test runs the real catalogue strings.
 */
import { fillPlace } from '../src/domain/placeArticle';
import { CATALOGUES } from '../src/i18n/catalogues';

const de = CATALOGUES.de as Record<string, string>;
const nl = CATALOGUES.nl as Record<string, string>;

test('German takes the dative article, and contracts it where German does', () => {
  expect(fillPlace('wie es in {place} zubereitet wird', '{place}', 'Vereinigte Staaten', 'de')).toBe('wie es in den Vereinigten Staaten zubereitet wird');
  expect(fillPlace('wie es in {place} zubereitet wird', '{place}', 'Iran', 'de')).toBe('wie es im Iran zubereitet wird');
  expect(fillPlace('Menschen mit Bezug zu {place}', '{place}', 'Schweiz', 'de')).toBe('Menschen mit Bezug zur Schweiz');
  expect(fillPlace('Alles aus {place}', '{place}', 'Türkei', 'de')).toBe('Alles aus der Türkei');
});

test('a country that takes no article, and a region, are left as they are', () => {
  expect(fillPlace('wie es in {place} zubereitet wird', '{place}', 'Indien', 'de')).toBe('wie es in Indien zubereitet wird');
  expect(fillPlace('wie es in {place} zubereitet wird', '{place}', 'Kerala', 'de')).toBe('wie es in Kerala zubereitet wird');
});

test('a relative clause elsewhere in the sentence is not contracted', () => {
  expect(fillPlace('der Ort, in dem man kocht, liegt in {place}', '{place}', 'Iran', 'de')).toBe('der Ort, in dem man kocht, liegt im Iran');
});

test('Dutch takes its article', () => {
  expect(fillPlace('uit {place}', '{place}', 'Verenigde Staten', 'nl')).toBe('uit de Verenigde Staten');
  expect(fillPlace('in {place}', '{place}', 'Verenigd Koninkrijk', 'nl')).toBe('in het Verenigd Koninkrijk');
});

test('English keeps its own article rule, and other languages are untouched', () => {
  expect(fillPlace('prepared in {place}', '{place}', 'United States', 'en')).toBe('prepared in the United States');
  expect(fillPlace('preparado en {place}', '{place}', 'Estados Unidos', 'es')).toBe('preparado en Estados Unidos');
});

test('the real German and Dutch sentences that take a place read correctly', () => {
  for (const key of ['adaptationLeadIn', 'everythingFrom', 'videoSearchNote', 'inPlace', 'quotedFromSource']) {
    expect(fillPlace(de[key], '{place}', 'Vereinigte Staaten', 'de')).not.toMatch(/\b(in|aus) Vereinigte Staaten/);
    expect(fillPlace(nl[key], '{place}', 'Verenigde Staten', 'nl')).not.toMatch(/\b(in|uit) Verenigde Staten/);
  }
});

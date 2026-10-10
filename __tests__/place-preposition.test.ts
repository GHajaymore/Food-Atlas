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

describe('French and Italian', () => {
  const fr = CATALOGUES.fr as Record<string, string>;
  const it = CATALOGUES.it as Record<string, string>;
  test('French merges the preposition with the article the country takes', () => {
    expect(fillPlace('se fait à {place}', '{place}', 'Inde', 'fr')).toBe('se fait en Inde');
    expect(fillPlace('se fait à {place}', '{place}', 'Japon', 'fr')).toBe('se fait au Japon');
    expect(fillPlace('se fait à {place}', '{place}', 'États-Unis', 'fr')).toBe('se fait aux États-Unis');
    expect(fillPlace('se fait à {place}', '{place}', 'Cuba', 'fr')).toBe('se fait à Cuba');
    expect(fillPlace('se fait à {place}', '{place}', 'Mexique', 'fr')).toBe('se fait au Mexique');
    expect(fillPlace('vient de {place}', '{place}', 'Japon', 'fr')).toBe('vient du Japon');
    expect(fillPlace('vient de {place}', '{place}', 'Italie', 'fr')).toBe('vient d’Italie');
    expect(fillPlace('vient de {place}', '{place}', 'France', 'fr')).toBe('vient de France');
    expect(fillPlace('vient de {place}', '{place}', 'États-Unis', 'fr')).toBe('vient des États-Unis');
  });
  test('"liées à" takes the relation form, not the place-where form', () => {
    expect(fillPlace('3 personnes liées à {place}', '{place}', 'France', 'fr')).toBe('3 personnes liées à la France');
    expect(fillPlace('3 personnes liées à {place}', '{place}', 'Japon', 'fr')).toBe('3 personnes liées au Japon');
    expect(fillPlace('3 personnes liées à {place}', '{place}', 'Inde', 'fr')).toBe('3 personnes liées à l’Inde');
  });
  test('a French city or region is left as it is', () => {
    expect(fillPlace('se fait à {place}', '{place}', 'Naples', 'fr')).toBe('se fait à Naples');
  });
  test('Italian: in Italia, negli Stati Uniti, a Cuba; a city keeps its "a"', () => {
    expect(fillPlace('si prepara in {place}', '{place}', 'India', 'it')).toBe('si prepara in India');
    expect(fillPlace('si prepara in {place}', '{place}', 'Stati Uniti', 'it')).toBe('si prepara negli Stati Uniti');
    expect(fillPlace('si fa a {place}', '{place}', 'Regno Unito', 'it')).toBe('si fa nel Regno Unito');
    expect(fillPlace('si fa a {place}', '{place}', 'Cuba', 'it')).toBe('si fa a Cuba');
    expect(fillPlace('si fa a {place}', '{place}', 'Napoli', 'it')).toBe('si fa a Napoli');
  });
  test('no real French or Italian sentence puts a bare country after a bare preposition', () => {
    for (const key of ['adaptationLeadIn', 'quotedFromSource', 'everythingFrom', 'videoSearchNote', 'inPlace', 'standingMet', 'standingNeed']) {
      expect(fillPlace(fr[key], '{place}', 'États-Unis', 'fr')).not.toMatch(/\b(à|de) États-Unis/);
      expect(fillPlace(it[key], '{place}', 'Stati Uniti', 'it')).not.toMatch(/\b(in|a|da|di) Stati Uniti/);
    }
  });
});

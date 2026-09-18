/**
 * Does searching in the plural find what the singular finds?
 *
 * Readers type "tacos" and "curries"; records are named "Taco" and "Curry". Before
 * `singularForms`, a plural query was a substring search for a word the catalogue does
 * not contain — "curries" reached 15 records where "curry" reached 177.
 */

import { matchesAllTerms, singularForms, terms } from '../src/domain/fold';

const finds = (haystack: string, query: string) => matchesAllTerms(haystack, terms(query));

describe('a plural search reaches the singular record', () => {
  it.each([
    ['taco', 'tacos'],
    ['samosa', 'samosas'],
    ['dumpling', 'dumplings'],
    ['curry', 'curries'],
    ['empanada', 'empanadas'],
    ['sandwich', 'sandwiches'],
  ])('"%s" is found by "%s"', (name, query) => {
    expect(finds(name, query)).toBe(true);
  });

  it('still finds a record that is itself named in the plural', () => {
    expect(finds('fish and chips', 'chips')).toBe(true);
    expect(finds('hummus', 'hummus')).toBe(true);
  });

  it('applies to each word of a multi-word query', () => {
    expect(finds('pork dumpling', 'pork dumplings')).toBe(true);
    expect(finds('pork dumpling', 'beef dumplings')).toBe(false);
  });
});

describe('another spelling of the same dish reaches it', () => {
  it.each([
    ['chicken biryani', 'biriyani'],
    ['lamb kebab', 'kabob'],
    ['chicken shawarma', 'shwarma'],
    ['greek yoghurt', 'yogurt'],
    ['vegetable pulao', 'pilaf'],
    ['kebabs', 'kabobs'],
  ])('"%s" is found by "%s"', (name, query) => {
    expect(finds(name, query)).toBe(true);
  });

  it('never treats a country as a spelling of a food', () => {
    /* "chile" was left out of the chili group for exactly this. */
    expect(finds('pastel de choclo — Chile', 'chili')).toBe(false);
  });
});

describe('it does not invent matches', () => {
  /* Every form offered is the typed word or a prefix of it, so the rule can only add
     results; these are the places a careless stemmer would add wrong ones. */
  it('offers no stem shorter than four letters', () => {
    expect(singularForms('peas')).toEqual(['peas']);
    expect(finds('pear tart', 'peas')).toBe(false);
  });

  it('does not turn "cookies" into a prefix of "cooking"', () => {
    /* The first version stripped "-es" from every word, and a search for cookies
       returned 106 records instead of 39 — everything mentioning cooking. */
    expect(singularForms('cookies')).not.toContain('cooki');
    expect(finds('slow cooking', 'cookies')).toBe(false);
    expect(finds('tomato', 'tomatoes')).toBe(true);
  });

  it('leaves a double s alone', () => {
    expect(singularForms('swiss')).toEqual(['swiss']);
  });

  it('never drops a result the typed word already reached', () => {
    for (const word of ['tacos', 'curries', 'noodles', 'couscous', 'hummus']) {
      expect(singularForms(word)[0]).toBe(word);
    }
  });
});

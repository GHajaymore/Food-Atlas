/**
 * What a person types is tidied the same way everywhere.
 *
 * The fault this guards against is not a crash — it is a contributed record that looks
 * scruffier than an imported one sitting beside it, and a proposal filed under a country
 * name the atlas does not navigate by. Three screens each had their own idea of what to
 * do with a typed value; these assert the one rule they now share.
 */

import { tidyCountry, tidyLines, tidyName, tidyPlace, tidyText } from '../src/domain/entry';

describe('typed values get the treatment imported ones get', () => {
  test('collapses the whitespace a keyboard produces, not only the ends', () => {
    // A double space in the middle is invisible on the page and different in every index.
    expect(tidyText('  Born in   Kozhikode ')).toBe('Born in Kozhikode');
    expect(tidyText('Malabar\nhouseholds')).toBe('Malabar households');
    expect(tidyText('')).toBe('');
  });

  test('cases a name the way the import cases a label', () => {
    expect(tidyName('  kozhikode halwa ')).toBe('Kozhikode halwa');
    // Only the first letter. Title-casing would corrupt more names than it tidied.
    expect(tidyName('pane di Santeramo in Colle')).toBe('Pane di Santeramo in Colle');
    // A script with no case is returned untouched.
    expect(tidyName('ম্রেচ কম্পোট')).toBe('ম্রেচ কম্পোট');
  });

  test('resolves a country to the name the atlas files records under', () => {
    // This is the one that decides whether a proposal is reachable from its own country.
    expect(tidyCountry(' india ')).toBe('India');
    expect(tidyCountry('USA')).toBe('United States');
  });

  test('leaves an unrecognised place alone rather than arguing with it', () => {
    // A person naming a place the atlas has not heard of is the case this project is
    // for. Rejecting it would only accept food somebody already catalogued.
    expect(tidyCountry('Sápmi')).toBe('Sápmi');
    expect(tidyPlace('  kozhikode ')).toBe('Kozhikode');
  });

  test('reads a typed list as the lines somebody meant', () => {
    expect(tidyLines('- 2 eggs\n\n* 100g  ghee\n1. Soak the rice')).toEqual([
      '2 eggs',
      '100g ghee',
      'Soak the rice',
    ]);
  });
});

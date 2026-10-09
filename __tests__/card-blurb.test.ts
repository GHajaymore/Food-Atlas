/**
 * A card's sentence ends where a sentence does.
 *
 * It was the first 220 characters of the account, cut wherever the knife fell, and 2,339
 * cards ended mid-word — Balchão's read "…the spice-vinegar paste, sugar, and s". These
 * hold the rule on the exact text that shipped, and in the scripts it has to work in.
 */

import { cardBlurb } from '../src/data/build';

const balchao =
  'Ginger, garlic and roasted spices are ground into a paste with the vinegar. The prawns are fried in oil until opaque and removed from the pan. Then onions and tomatoes are fried, and the spice-vinegar paste, sugar, and salt are added and cooked down until thick.';

describe('a card ends where a sentence does', () => {
  test('cuts back to the last complete sentence in the window', () => {
    expect(cardBlurb(balchao, 'Balchão')).toBe(
      'Ginger, garlic and roasted spices are ground into a paste with the vinegar. The prawns are fried in oil until opaque and removed from the pan.',
    );
  });

  test('marks the cut at a whole word when no sentence ends late enough', () => {
    const runOn = `Bulgur is ${'a cracked wheat food eaten across the region and '.repeat(6)}more.`;
    const card = cardBlurb(runOn, 'Bulgur');
    expect(card.endsWith('…')).toBe(true);
    expect(card.length).toBeLessThanOrEqual(221);
    /* The word before the mark is whole: the cut fell on a space, not inside a word. */
    expect(runOn).toContain(card.slice(0, -1).trim());
    expect(runOn.charAt(card.length - 1)).toBe(' ');
  });

  test('leaves an account that fits alone', () => {
    expect(cardBlurb('A dense, glossy halwa cooked for hours in copper vessels.', 'Kozhikode Halwa')).toBe(
      'A dense, glossy halwa cooked for hours in copper vessels.',
    );
  });

  test('knows the Hindi danda as a sentence end', () => {
    const hindi =
      'अप्पम चावल के घोल और नारियल के दूध से बनाया जाता है। यह किनारों पर कुरकुरा और बीच में नरम होता है, और इसका स्वाद हल्का मीठा होता है। इसे पारंपरिक रूप से अप्पचट्टी नाम के बर्तन में पकाया जाता है और नाश्ते में स्टू या करी के साथ परोसा जाता है जो केरल में बहुत लोकप्रिय है और घर घर में बनता है।';
    const card = cardBlurb(hindi, 'Appam');
    expect(card.endsWith('।')).toBe(true);
    expect(card.length).toBeLessThan(hindi.length);
  });

  test('marks a script without spaces where it stops', () => {
    const chinese = '這是一道傳統的菜'.repeat(40);
    expect(cardBlurb(chinese, 'X').endsWith('…')).toBe(true);
  });
});

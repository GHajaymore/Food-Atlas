/**
 * The page check catches what it says it catches.
 *
 * `scripts/check-pages.mjs` reads every kind of screen in a real browser and fails on what
 * a reader would notice. A check that has never failed is not known to work, so each rule
 * is fed here the exact text that once reached the live site — and a clean page is fed
 * through to prove the rules do not fire on ordinary prose.
 */

import { faultsIn } from '../src/domain/pageFaults';

const record = { record: 'Kozhikode Halwa' };
const home = { home: true };
const screen = {};

describe('each rule catches the fault it was written for', () => {
  test('a copy key printed as a word', () => {
    expect(faultsIn(record, 'Vegan · mealSnack · mealCelebration', 'X · WikiFoodia', true)).toEqual([
      'copy key printed as a word: "mealSnack"',
      'copy key printed as a word: "mealCelebration"',
    ]);
  });

  test('a placeholder nobody filled', () => {
    expect(faultsIn(screen, 'connected to {place} would meet it', 'X · WikiFoodia', true)).toEqual([
      'unfilled placeholder: "{place}"',
    ]);
  });

  test('a value that never arrived', () => {
    expect(faultsIn(screen, 'Scored undefined of 100', 'X · WikiFoodia', true)).toEqual([
      'missing value printed as "undefined"',
    ]);
  });

  test('two sentences run together', () => {
    const text = 'Still frames come from the videos, so the dish you see is the dish that cook made.Engagement figures are not shown.';
    expect(faultsIn(screen, text, 'X · WikiFoodia', true)).toContain('sentences run together: "made.Engagement"');
  });

  test('the same long sentence twice on one screen', () => {
    const note = 'Opens with machine-translated English captions over the original audio — the cook’s voice is not replaced.';
    const faults = faultsIn(record, `Spoken in Malayalam. ${note}\nSpoken in Tamil. ${note}`, 'X · WikiFoodia', true);
    expect(faults.some((f) => f.startsWith('printed 2 times'))).toBe(true);
  });

  /*
   * The same fault in scripts the first version of this rule could not read: the Hindi
   * danda was not a sentence end, and Chinese and Japanese have no spaces to count words
   * by. Both strings are what the live record page printed, in each language.
   */
  test('the same sentence twice in Hindi, which ends sentences with a danda', () => {
    const note =
      'मूल ऑडियो के ऊपर मशीन से अनूदित हिन्दी उपशीर्षकों के साथ खुलता है — पकाने वाले की आवाज़ बदली नहीं जाती, और अनुवाद वीडियो मंच का है, किसी व्यक्ति का नहीं।';
    const text = `मलयालम में बोला गया। ${note}\nअंग्रेज़ी में बोला गया। ${note}`;
    expect(faultsIn(record, text, 'X · WikiFoodia', false).some((f) => f.startsWith('printed 2 times'))).toBe(true);
  });

  test('the same sentence twice in Japanese, which has no spaces to count', () => {
    const note =
      '元の音声の上に、機械翻訳された日本語の字幕を載せて開きます。作る人の声は差し替えず、訳は動画プラットフォームのもので、人によるものではありません。';
    const text = `マラヤーラム語で話されています。${note}\n英語で話されています。${note}`;
    expect(faultsIn(record, text, 'X · WikiFoodia', false).some((f) => f.startsWith('printed 2 times'))).toBe(true);
  });

  test('and in Chinese', () => {
    const note = '打开时会在原声之上叠加机器翻译的中文字幕 — 做菜的人的声音没有被替换，翻译来自视频平台，不是人做的。';
    const text = `讲的是马拉雅拉姆语。${note}\n讲的是英语。${note}`;
    expect(faultsIn(record, text, 'X · WikiFoodia', false).some((f) => f.startsWith('printed 2 times'))).toBe(true);
  });

  test('a claim of authenticity on a record without the badge', () => {
    const text = '🟡 Traditional Variation\n27 /100\nAuthentic Version\nCooked for hours…';
    expect(faultsIn(record, text, 'Kozhikode Halwa · WikiFoodia', true)).toEqual([
      '"Authentic Version" on a record not badged Authentic',
    ]);
  });

  test('the front page saying submissions are closed', () => {
    const text = 'Record a dish you know\nSubmissions are not open yet — there is nowhere to send them.';
    expect(faultsIn(home, text, 'WikiFoodia', true)).toEqual([
      'home page says submissions are not open, and /propose is open',
    ]);
  });

  test('a tab that does not say what it shows', () => {
    expect(faultsIn(screen, 'Food Atlas', 'WikiFoodia', true)).toEqual(['document title is the bare brand']);
  });
});

describe('and stays quiet on a page that is fine', () => {
  test('ordinary prose, a real badge, and the brand on its own page', () => {
    const text = [
      '🟡 Traditional Variation',
      'Kozhikode Halwa',
      'India › Kerala › Kozhikode',
      'The version recorded here',
      'Cooked for hours over direct heat in a wide copper pan with coconut oil.',
      'See wikifoodia.ajailabs.app for the rest, e.g. the sitemap.',
    ].join('\n');
    expect(faultsIn(record, text, 'Kozhikode Halwa — Kozhikode, Kerala, India · WikiFoodia', true)).toEqual([]);
  });

  test('the authentic heading is allowed under the authentic badge', () => {
    expect(faultsIn(record, '🟢 Authentic — Local\nAuthentic Version', 'X · WikiFoodia', true)).toEqual([]);
  });

  test('the home page and the not-found page may carry the bare brand', () => {
    expect(faultsIn(home, 'Every dish here shows its evidence.', 'WikiFoodia', true)).toEqual([]);
    expect(faultsIn({ notFound: true }, 'Not a page here', 'WikiFoodia', true)).toEqual([]);
  });
});

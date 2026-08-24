/**
 * Translating evidence without replacing it.
 *
 * The rules live in `domain/testimony.ts` and the reason they are tested rather than
 * merely written down is that each one fails silently: a translation shown instead of an
 * original still looks like a confirmation, and a translated confirmation counted toward
 * a badge still shows a number.
 */

import { canOfferTranslation, testimonyNote, testimonyPrompt } from '../src/domain/testimony';
import { validationsOf } from '../src/domain/confirmations';

const said = 'We use ghee, not oil — and it is made at Eid, not year round.';

describe('a translation is offered, never imposed', () => {
  test('is not offered when there is no provider, or nothing to translate', () => {
    expect(canOfferTranslation(said, false)).toBe(false);
    expect(canOfferTranslation('   ', true)).toBe(false);
    expect(canOfferTranslation(said, true)).toBe(true);
  });

  test('the instruction forbids the helpfulness that would corrupt the evidence', () => {
    const prompt = testimonyPrompt(said, 'es');
    // The account itself must reach the translator intact.
    expect(prompt).toContain(said);
    expect(prompt).toContain('es');
    // The failure that matters is a tidied sentence, not a clumsy one.
    expect(prompt).toMatch(/Do not correct, tidy, shorten or complete it/);
    expect(prompt).toMatch(/Do not translate the name of any dish, ingredient/);
    expect(prompt).toMatch(/Do not substitute a local equivalent/);
    expect(prompt).toMatch(/Do not add anything that is not there/);
  });

  test('the note says the original is what counts', () => {
    const note = testimonyNote('automated translation');
    expect(note).toContain('automated translation');
    expect(note).toMatch(/original is shown above it and is what counts/);
  });
});

describe('a translation cannot become evidence', () => {
  /*
   * The rule that a future edit is most likely to break without noticing. `validationsOf`
   * counts verified PEOPLE — it never reads what anybody said, so translating a sentence
   * cannot move a badge. Asserted rather than assumed, because wiring translation into
   * scoring would be a one-line change that no other test would catch.
   */
  test('counting reads who confirmed, never what they wrote', () => {
    const people = [
      { name: 'Priya', connection: 'Born in Kozhikode', said, local: true, verified: true, at: '2026-08-24' },
      { name: 'Anil', connection: 'Cooks in Thalassery', said: '', local: false, verified: true, at: '2026-08-24' },
      { name: 'Guest', connection: 'Visited once', said, local: false, verified: false, at: '2026-08-24' },
    ];

    const count = validationsOf({ people });
    // Two verified, whatever they said or did not say, in whatever language.
    expect(count).toBe(2);

    const translatedToSpanish = {
      people: people.map((p) => ({ ...p, said: p.said ? 'Usamos ghee, no aceite.' : '' })),
    };
    expect(validationsOf(translatedToSpanish)).toBe(count);
  });
});

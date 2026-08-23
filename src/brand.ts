/**
 * Brand identity.
 *
 * The design handoff ships this product as "Provenance"; the name and tagline below
 * are the ones chosen for the build. Everything else in the app's copy — the
 * disclaimers, the empty states, the evidence language — stays verbatim from the
 * handoff, because it carries the product's editorial stance and several
 * legally and ethically load-bearing statements.
 */

export const BRAND = {
  name: 'WikiFoodia',
  /**
   * The Feed subtitle, under the title.
   *
   * The name already says open, collective and encyclopaedic, so the tagline does not
   * repeat it. What it has to earn is why a reader should trust this over a recipe
   * site — and the answer is not that the food here is better described. It is that
   * every claim can be checked. Each record shows its sources and the six figures its
   * confidence is the mean of, and a reader who does not believe the number can add
   * it up. No competitor says this, because none of them can.
   *
   * So the second half is the whole product: **showing our work**.
   *
   * ## Why "keeping"
   *
   * Because preservation is the honest case for this existing, once it is argued from
   * the right number. Leading with endangerment was rejected twice and rightly: only
   * **15** records of 18,008 carry evidence of decline, and "before it's lost" made a
   * claim about the atlas that four hundredths of one percent of it supported.
   *
   * The real number is the other one. **10,197 records — 57% — have nothing recorded
   * about how they are made.** Not endangered, just unwritten, which is the larger
   * and quieter problem and is what the atlas is actually for. "Keeping" states that
   * purpose without claiming it is finished, and without the drama of "saving".
   *
   * It stops short of saying *community*, deliberately. There are still zero
   * contributions, and a line about people writing their food down would be a
   * promise, not a description. When submissions start arriving that changes, and the
   * line should be revisited then rather than now.
   *
   * ## What it replaced, and why
   *
   * "How the world actually cooks." carried the trust argument in one word —
   * *actually* — against food writing that gives you the convenient version. A good
   * line, and it described the catalogue rather than what makes the catalogue worth
   * believing.
   *
   * "The world's food, and how we know." was the evidence half alone. Correct, and
   * colder than this project deserves — it said what the app is careful about and
   * nothing about what it is for.
   *
   * ## What it must never say
   *
   * Anything about being automatic. `assess.ts` makes it arithmetic that no published
   * source can authenticate a dish: with no confirmations the ceiling is 43 and
   * promotion starts at 55, so three of the six dimensions are answerable only by
   * people from the place. A tagline advertising automation would be advertising the
   * one thing this app refuses to do — and in a market where every food site is
   * suspected of generating its content, it would hand a reader the exact objection
   * the evidence model exists to answer.
   *
   * ## The rule that has survived every revision
   *
   * A tagline must not promise what the atlas has not got. "Written down by the
   * people who cook it" describes the community model, and there are still zero
   * contributions; "before it's lost" leads with preservation, which is 15 records of
   * 18,008. Both stay rejected on the same grounds as before.
   */
  tagline: 'Keeping the world’s food, and showing our work.',
  /** The positioning line from the source brief. */
  positioning: 'Authentic Food. From Where It Belongs.',
} as const;

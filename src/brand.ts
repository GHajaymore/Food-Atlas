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
   * The name already says open, collective and encyclopaedic, so the tagline does
   * not repeat it. What the name does not say is why a reader should trust this over
   * a recipe site, and "actually" is the word carrying that: most food writing gives
   * you a convenient version, and this one tries to give you what people really do.
   *
   * It is also the only line here that stays true as the app grows. "Written down by
   * the people who cook it" describes the community model, which has no contributions
   * yet; "before it's lost" leads with preservation, which is 31 records of 16,550.
   * A tagline should not promise what the atlas has not got.
   */
  tagline: 'How the world actually cooks.',
  /** The positioning line from the source brief. */
  positioning: 'Authentic Food. From Where It Belongs.',
} as const;

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
   * ## It states the rule, which is what makes it honest
   *
   * The distinction every earlier draft missed: **claiming an achievement is not the
   * same as stating a rule.** "Confirmed by the people who cook it" claims something
   * that has not happened — there are zero confirmations. This claims nothing. It
   * says who is *entitled* to authenticate a dish, and that is true today and
   * enforced in arithmetic: `assess.ts` caps published documentation at 43 and starts
   * promotion at 55, so the gap can only ever be closed by people from the place.
   *
   * It recruits without asking. A reader who makes the dish reads "local cooks" and
   * works out that it means them, which hands them authority instead of asking for a
   * favour — stronger than any plea, and it costs no honesty.
   *
   * ## Both of those words are load-bearing
   *
   * **local**, because the rule is not "a cook". A chef in London making Kozhikode
   * halwa does not authenticate it; `validatedLocally` is a real field and it decides
   * between Authentic — Local and Authentic — Regional. An earlier draft said "the
   * cook" and quietly dropped that.
   *
   * **cooks**, plural, because `VALIDATIONS_REQUIRED` is 3. One person never
   * authenticates anything here, and the singular said they could. The plural is also
   * the only honest way this line can carry *community*: it describes what the rule
   * requires, not a community that has turned up — there are still zero confirmations.
   *
   * It also explains the badge. The green chip says *Authentic*; this says who is
   * allowed to put it there, so the tagline and the classification stop being two
   * separate vocabularies.
   *
   * ## What was cut on the way, and what each cut bought
   *
   *   We don't decide what's authentic. The people who cook it do.  (10 words)
   *     — dropped "we": a tagline should not be about the company
   *   Nothing is authentic until someone from there says so.        (9, negative-led)
   *     — dropped the negative: it opened on a disclaimer
   *   Authentic is theirs to say, not ours.                         (7, "theirs" is nobody)
   *     — named them: an abstraction became a person
   *   Only the cook can call it authentic.                          (7, imprecise)
   *     — local, and plural: the rule needs three people, from the place
   *   Only local cooks can call it authentic.                       (7)
   *
   * ## The candidates this replaced, and why each failed
   *
   * "How the world actually cooks." carried the trust argument in one word —
   * *actually*, against food writing that gives you the convenient version. It
   * described the catalogue rather than what makes the catalogue worth believing.
   *
   * "The world's food, and how we know." was the evidence half alone: correct, and
   * colder than this project deserves.
   *
   * "Keeping the world's food, and showing our work." was warmer and argued
   * preservation from the right number — not the 15 records carrying evidence of
   * decline, but the **10,197 (57%) with nothing recorded about how they are made**.
   * It still described what the atlas holds rather than how anything in it becomes
   * trustworthy, which is the goal.
   *
   * "The world's food. Room for yours." invited contribution. The goal is not more
   * dishes; it is dishes that have been *authenticated*, and those are different
   * verbs.
   *
   * ## What it must never say
   *
   * Anything about being automatic. No published source can authenticate a dish here
   * — that is the arithmetic above, not an aspiration. A tagline advertising
   * automation would advertise the one thing this app refuses to do, and in a market
   * where every food site is suspected of generating its content it would hand a
   * reader the exact objection the evidence model exists to answer.
   *
   * ## The rule that has survived every revision
   *
   * A tagline must not promise what the atlas has not got. "Written down by the
   * people who cook it" describes a community model with zero contributions;
   * "before it's lost" leads with preservation, which is 15 records of 18,008.
   *
   * ## The ask does not live here
   *
   * It lives on the 10,197 records with nothing recorded about how they are made,
   * where the reader is looking at a specific gap they might personally fill — see
   * the undocumented card in the dish screen, which names the dish and the place. A
   * general plea under a logo is easy to ignore; one naming a dish from your own town
   * is not.
   */
  tagline: 'Only local cooks and their community can call it authentic.',
  /** The positioning line from the source brief. */
  positioning: 'Authentic Food. From Where It Belongs.',
} as const;

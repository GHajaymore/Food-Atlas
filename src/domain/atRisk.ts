/**
 * Deciding whether a tradition is at risk.
 *
 * This was a hand-set flag on two seed records, which meant the atlas claimed the
 * world holds two endangered food traditions. It holds thousands, and the register
 * of the ones disappearing is the most valuable thing this app could carry.
 *
 * The rule, and the reason it can be trusted: **a tradition is at risk when a source
 * says so.** Never inferred from a low score, a small country, or an absent photo —
 * those measure how well we have documented a dish, not whether anyone still cooks
 * it, and conflating the two would let a gap in our records masquerade as a dying
 * tradition. That is the exact error the confidence model exists to prevent.
 *
 * Every flag keeps the sentence that produced it. A reader can check the claim, and
 * a wrong one is visibly wrong rather than an unexplained badge — the same standard
 * every other claim in the app is held to.
 */

/** How strongly the language supports the claim. */
export type RiskStrength = 'stated' | 'implied';

export interface RiskFinding {
  atRisk: boolean;
  /** The sentence that produced the flag, so the claim can be checked. */
  evidence: string;
  strength: RiskStrength | null;
  /** Which phrase matched, for auditing the rules themselves. */
  matched: string;
}

/**
 * Language that states a tradition is disappearing.
 *
 * These are decisive: a source using them is making the claim directly, so the
 * record can carry it without further evidence.
 */
const STATED = [
  'at risk of disappearing',
  'risk of being lost',
  'risk of dying out',
  'verge of extinction',
  'brink of extinction',
  'nearly extinct',
  'almost extinct',
  'dying out',
  'died out',
  'dying tradition',
  'endangered tradition',
  'no longer made',
  'no longer produced',
  'no longer prepared',
  'threatened with extinction',
  'in danger of disappearing',
  'largely forgotten',
  'nearly forgotten',
  'fallen out of use',
];

/**
 * Language that implies decline without asserting it.
 *
 * Weaker, and deliberately kept separate: "increasingly rare" is a real signal, but
 * it also shows up about an ingredient's price or a restaurant's menu. These still
 * set the flag — with the sentence attached — but the strength is recorded so the
 * two can be told apart, and so a reviewer can audit the softer half first.
 */
const IMPLIED = [
  // Counts, moved down from STATED. "Few remaining" is not decline language at all
  // on its own: it flagged an article on wartime Japan over "the few remaining items
  // on the bookshelf". Down here it has to be shown to be about the dish.
  'last remaining',
  'few remaining',
  'only a handful',
  'increasingly rare',
  'becoming rare',
  'now rare',
  'rarely made',
  'rarely prepared',
  'rarely found',
  'seldom made',
  'seldom prepared',
  'in decline',
  'declining',
  'fewer and fewer',
  'fewer households',
  'once common',
  'once widespread',
  'no longer common',
  'no longer widely',
];

/**
 * Phrases that look like decline but are about something else.
 *
 * "Endangered species" is the important one: the Greenland shark in hákarl is
 * endangered, which is a fact about the animal, not about whether anyone still cures
 * it. They are different claims and the app should not silently merge them.
 */
const FALSE_FRIENDS = [
  // The animal, not the craft. The Greenland shark in hákarl is endangered; that is
  // a fact about the shark, and merging it with "is anyone still curing it?" would
  // answer a question nobody asked.
  'endangered species',
  'endangered animal',
  'endangered fish',
  'critically endangered species',
  'declining population of',
  // A business closing is not a tradition ending. "Fish and chips" was flagged
  // because a restaurant chain had shrunk — the dish is in no danger whatsoever.
  'still in business',
  'went out of business',
  'chain',
  'franchise',
  'outlets',
  'branches',
  'restaurants remain',
  'stores remain',
  // Sales and market talk describes a product's commerce, not its practice.
  'declining sales',
  'sales declined',
  'market share',

  /*
   * A revival is the opposite of the claim the badge makes.
   *
   * "being revived" and "revival of" used to sit in IMPLIED, on the reasoning that
   * something revived must first have declined. Perhaps — but the sentence is then
   * shown to the reader as the evidence, and it said the opposite of the badge above
   * it. Hoppy carried 🕯️ At-Risk Tradition over "it is still a staple among some Tokyo
   * residents, and has experienced a retro revival of late"; Korean royal court cuisine
   * over "there has been a revival of this cookery style in the 21st century"; dalgona
   * over a sentence about a television show making it internationally popular.
   *
   * The shelf these records lead is headed "Traditions a source describes as
   * declining". None of those sources does. If a tradition is both revived and still
   * fragile, the decline has its own sentence, and that sentence is what should carry
   * the badge.
   */
  'revival',
  'revived',
  'reviving',
  'renewed interest',
  'renewed popularity',
  'regained popularity',
  'growing popularity',
  'rise in popularity',
  'increasingly popular',

  /*
   * Counting premises is counting businesses, which the block above already refuses
   * for chains and franchises. "Only a handful of restaurants still serve it" is a
   * fact about menus; almond pressed duck was flagged on exactly that sentence.
   */
  'handful of restaurants',
  'handful of shops',
  'handful of establishments',
];

/**
 * Where a dish is *served*, which is a fact about menus.
 *
 * Kept apart from the list above because it is a shape rather than a phrase.
 * "Rarely found in larger restaurants" was flagged for Dhooska, whose own sentence
 * says people enjoy it at market stalls — it is sold somewhere else, not vanishing.
 * "Rarely found in Chinese restaurants in China" was flagged for orange chicken,
 * where the claim is about authenticity and geography and the dish is in no danger at
 * all.
 *
 * Deliberately narrow: it needs the preposition, so "virtual disappearance from
 * present-day restaurants" — a real decline stated through restaurants — is only
 * matched by the "from" case, which is why that record is caught by the count rule
 * above instead and not by this one.
 */
const A_MENU_CLAIM = /\b(?:in|at) (?:[a-z-]+ ){0,2}restaurants\b/i;

/**
 * Whether a sentence is talking about this dish.
 *
 * Every significant word of the name has to appear, prefix-tolerant, so "kippers"
 * answers for "Kipper" — but a sentence about *nata de piña* no longer answers for
 * "nata de coco". Short words are ignored and a parenthetical qualifier is dropped
 * first, because the article about "Hoppy (drink)" never writes the bracket.
 */
function mentions(sentence: string, subject: string): boolean {
  const words = subject
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 3);

  if (!words.length) return true;

  /*
   * Every significant word, not any one of them.
   *
   * "Nata de coco" was flagged on a sentence about *nata de piña* being seasonal,
   * because "nata" was enough. Requiring "coco" too costs nothing here and is the
   * difference between a sentence that mentions the dish and one that mentions its
   * cousin.
   *
   * Prefix-tolerant on each word, since plurals and inflections are the common case —
   * "kippers" has to answer for "Kipper" — and the four-character floor keeps that
   * from matching everything.
   */
  return words.every((w) => sentence.includes(w) || sentence.includes(w.slice(0, -1)));
}

/** Split on sentence ends, keeping enough context to be readable as evidence. */
const sentences = (text: string): string[] =>
  text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * Look for a claim of decline in a source text.
 *
 * Returns the first sentence that makes one. Stated language wins over implied, so
 * the strongest available evidence is what the record carries.
 */
export function detectAtRisk(text: string, subject = ''): RiskFinding {
  const none: RiskFinding = { atRisk: false, evidence: '', strength: null, matched: '' };
  if (!text || text.length < 40) return none;

  const found = sentences(text);

  for (const [phrases, strength] of [
    [STATED, 'stated'],
    [IMPLIED, 'implied'],
  ] as const) {
    for (const sentence of found) {
      const lower = sentence.toLowerCase();

      // A sentence about an endangered animal is not a sentence about a dying craft.
      if (FALSE_FRIENDS.some((f) => lower.includes(f))) continue;
      if (A_MENU_CLAIM.test(lower)) continue;

      const matched = phrases.find((phrase) => lower.includes(phrase));

      /*
       * Weak language has to be shown to be about *this* dish.
       *
       * The recurring failure was never the vocabulary, it was the subject. Bosnian
       * pot was flagged because fireplaces are in decline; nata de coco because
       * pineapples are seasonal; Reblochon because an Italian imitation sold in
       * declining quantities. Each sentence really does contain decline language, and
       * none of them is about the food the badge was attached to.
       *
       * Stated language is exempt. "Almost extinct", "dying out" and "no longer made"
       * are assertions somebody wrote deliberately, and requiring them to repeat the
       * dish's name would lose Sendango — "though once common, the knowledge to make
       * the food product is slowly dying out" — which is exactly the record this
       * feature exists for.
       */
      if (matched && strength === 'implied' && subject && !mentions(lower, subject)) continue;

      if (matched) {
        return {
          atRisk: true,
          // Trimmed, because this is shown on a card, not read as an article.
          evidence: sentence.length > 300 ? `${sentence.slice(0, 297)}…` : sentence,
          strength,
          matched,
        };
      }
    }
  }

  return none;
}

/** The line shown wherever the flag appears, so the badge is never bare. */
export const AT_RISK_NOTE =
  'Flagged because a source describes this tradition as declining — the sentence is shown with the record. ' +
  'It is never inferred from how little we have documented: a gap in our records is not evidence that anyone ' +
  'has stopped cooking.';

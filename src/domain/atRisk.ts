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
  'last remaining',
  'few remaining',
  'only a handful',
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
  'being revived',
  'revival of',
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
];

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
export function detectAtRisk(text: string): RiskFinding {
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

      const matched = phrases.find((phrase) => lower.includes(phrase));
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

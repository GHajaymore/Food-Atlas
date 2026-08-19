/**
 * The evidence assessment, applied to imported records.
 *
 * This is the module that decides how an imported dish earns a classification better
 * than `unverified`, and it is deliberately conservative: a record is promoted only
 * by evidence that actually speaks to the thing being claimed.
 *
 * The brief's seven checks, and what an import can genuinely answer:
 *
 *   1. Geographic origin      — Wikidata's country of origin is a sourced statement.
 *   2. Local preparation      — partial where an administrative region is recorded;
 *                               it locates the dish, it does not witness the cooking.
 *   3. Traditional ingredients— Wikidata's "made from material" (P186), where present.
 *   4. Traditional technique  — almost never available. Left open, and that openness
 *                               is what keeps the ceiling low.
 *   5. Cultural documentation — a heritage designation (PDO/PGI/TSG, Italy's PAT,
 *                               and equivalents) is a register of traditional
 *                               products maintained by an institution. A Wikipedia
 *                               article is weaker documentation, and counts less.
 *   6. Local source           — nothing in an import speaks to who wrote it. Open.
 *   7. Community validation   — no one from the place has confirmed anything. Open.
 *
 * Two rules keep this honest:
 *
 *   - **Technique and community validation are never inferred.** They stay open, so
 *     no imported record can reach the score of an assessed one.
 *   - **A record is only called authentic where a documented tradition is attested.**
 *     A heritage designation is exactly "a recognised traditional preparation
 *     associated with a broader region" — the brief's definition of Authentic —
 *     Regional. Without one, the best an import reaches is Traditional Variation.
 */

import { SCORE_DIMENSIONS } from './authenticity';
import type { BreakdownRow, Level } from './types';

/** What the enrichment pass found for one dish. */
export interface Evidence {
  /** Country of origin is recorded. True for every import by construction. */
  hasCountry: boolean;
  /** An administrative region below country level. */
  hasRegion: boolean;
  /** Ingredients from Wikidata's "made from material". */
  ingredients: string[];
  /**
   * Heritage designations — PDO, PGI, TSG, Italy's PAT, and national equivalents.
   * An institutional register of traditional products.
   */
  heritage: string[];
  /** The dish has an encyclopaedia article. Weak documentation, but documentation. */
  hasArticle: boolean;
  /** Length of the article extract, as a crude proxy for how much is documented. */
  extractLength: number;
  /**
   * Some source describes how this is made, even where no encyclopaedia does.
   *
   * Added for Italy's PAT register, which publishes an official production method
   * for products that have no article anywhere. Without it those records were told
   * "only the name and the place are recorded" on a page that was displaying the
   * method directly underneath — a statement the reader could see was false.
   */
  hasAccount?: boolean;
}

export interface Assessment {
  level: Level;
  badgeIcon: string;
  badgeLabel: string;
  badgeLabelFull: string;
  /** null where nothing beyond a name and a place is known. */
  score: number | null;
  breakdown: BreakdownRow[];
  /** Says what the score rests on and, more importantly, what it does not. */
  disclaimer: string;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/**
 * Score the six published dimensions from the evidence.
 *
 * The zeros are the point. Traditional technique and community validation are
 * unanswerable from an import, and leaving them at zero is what stops a
 * well-documented import scoring like a record someone actually cooked.
 */
function scoreDimensions(e: Evidence): BreakdownRow[] {
  const geographic = e.hasRegion ? 70 : 45;
  const ingredients = e.ingredients.length >= 3 ? 65 : e.ingredients.length ? 45 : 0;
  const technique = 0;
  const localSource = 0;
  const documentation = e.heritage.length ? 75 : e.hasArticle ? (e.extractLength > 600 ? 40 : 25) : 0;
  const community = 0;

  return [
    [SCORE_DIMENSIONS[0], geographic],
    [SCORE_DIMENSIONS[1], ingredients],
    [SCORE_DIMENSIONS[2], technique],
    [SCORE_DIMENSIONS[3], localSource],
    [SCORE_DIMENSIONS[4], documentation],
    [SCORE_DIMENSIONS[5], community],
  ];
}

const CLASSIFICATION: Record<Exclude<Level, 'fusion' | 'adaptation'>, Omit<Assessment, 'score' | 'breakdown' | 'disclaimer'>> = {
  local: { level: 'local', badgeIcon: '🟢', badgeLabel: 'Authentic — Local', badgeLabelFull: 'Authentic — Local/Traditional' },
  regional: { level: 'regional', badgeIcon: '🟢', badgeLabel: 'Authentic — Regional', badgeLabelFull: 'Authentic — Regional' },
  variation: { level: 'variation', badgeIcon: '🟡', badgeLabel: 'Traditional Variation', badgeLabelFull: 'Traditional Variation' },
  unverified: { level: 'unverified', badgeIcon: '⚪', badgeLabel: 'Unverified', badgeLabelFull: 'Unverified — insufficient evidence' },
};

/**
 * Classify and score an imported record.
 *
 * The ceiling is deliberate: with technique and community validation open, the
 * arithmetic cannot exceed the low 40s, so no import ever outranks an assessed
 * record — the ordering on every screen stays truthful without special-casing.
 */
export function assess(e: Evidence): Assessment {
  const breakdown = scoreDimensions(e);
  const score = clamp(breakdown.reduce((sum, [, v]) => sum + v, 0) / breakdown.length);

  // Nothing but a name and a place: no score at all, rather than a misleading number.
  if (!e.ingredients.length && !e.heritage.length && !e.hasArticle && !e.hasAccount) {
    return {
      ...CLASSIFICATION.unverified,
      score: null,
      breakdown: [],
      disclaimer:
        'Only the name and the place are recorded. Nothing documents how this is made, so it carries no score and ' +
        'stays Unverified until someone from the place records the preparation.',
    };
  }

  // An account of the preparation and nothing else. True of the register records,
  // whose official sheet describes the method for products no encyclopaedia covers.
  if (!e.ingredients.length && !e.heritage.length && !e.hasArticle) {
    return {
      ...CLASSIFICATION.unverified,
      score: null,
      breakdown: [],
      disclaimer:
        'A published account describes how this is made, but nothing here confirms it is how the people of the ' +
        'place make it. No ingredients are recorded and nobody from the community has checked it, so it carries ' +
        'no score and stays Unverified.',
    };
  }

  // A heritage designation is an institution's register of traditional products
  // tied to a place — the brief's "recognised traditional preparation associated
  // with a broader region".
  if (e.heritage.length && e.ingredients.length) {
    return {
      ...CLASSIFICATION.regional,
      score,
      breakdown,
      disclaimer:
        `Listed as a protected or registered traditional product (${e.heritage.slice(0, 2).join(', ')}), with its ` +
        `ingredients recorded. That establishes the tradition and its region. It does not establish the method: ` +
        `the traditional technique and community validation checks are both still open, which is why the ` +
        `confidence is this low.`,
    };
  }

  // Documented ingredients, no register: a legitimate traditional version is
  // attested, but nothing distinguishes it as *the* preparation of a place.
  if (e.ingredients.length && e.hasArticle) {
    return {
      ...CLASSIFICATION.variation,
      score,
      breakdown,
      disclaimer:
        'The ingredients and the place are documented, so this is recorded as a traditional version rather than ' +
        'an authenticated local preparation. No source here describes the technique, and no one from the place ' +
        'has confirmed it.',
    };
  }

  return {
    ...CLASSIFICATION.unverified,
    score,
    breakdown,
    disclaimer:
      'Some documentation exists, but not enough to classify the preparation. The ingredients, the technique and ' +
      'community confirmation are all missing — the score reflects that, and the record stays Unverified.',
  };
}

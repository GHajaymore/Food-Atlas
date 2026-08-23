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

import { SCORE_DIMENSIONS, VALIDATIONS_REQUIRED } from './authenticity';
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

  /**
   * A heritage body's own documented production method.
   *
   * The distinction this rests on is narrow and load-bearing. *A recipe* is not
   * evidence of traditional technique — a community cookbook page proves that
   * somebody published a method, not that it is the method of the place. But the
   * production method a register documents **in order to protect the name** is
   * exactly that: Italy's PAT sheets carry `metodiche di lavorazione e
   * conservazione`, and a PDO is granted against a specification describing how the
   * product must be made.
   *
   * So this is set by the register ingests and by nothing else. `hasAccount` is the
   * weaker sibling — some source describes the preparation — and it stays weaker.
   *
   * It is not set by the EU GI ingest: that reads the register's index, which names
   * the designation and not the specification behind it. Crediting technique for it
   * would be crediting a document nobody here has read.
   */
  registerMethod?: boolean;

  /**
   * Confirmations from people who stated a connection to the place.
   *
   * The dimension the whole model was shaped around and the one nothing has ever
   * been able to fill. `VALIDATIONS_REQUIRED` of them is what lifts a record out of
   * being merely well-documented.
   */
  validations?: number;

  /**
   * Whether those confirmations came from the locality rather than the wider region.
   *
   * Decides between Authentic — Local and Authentic — Regional. Someone from
   * Kozhikode confirming a Kozhikode dish is a different claim from someone in
   * Kerala confirming it, and the badge says which happened.
   */
  validatedLocally?: boolean;
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
  const validations = e.validations ?? 0;

  const geographic = e.hasRegion ? 70 : 45;
  const ingredients = e.ingredients.length >= 3 ? 65 : e.ingredients.length ? 45 : 0;
  /*
   * Two things evidence a traditional technique, and the community one is the better
   * of the two.
   *
   * A register's documented method is institutional: the region wrote down how the
   * product must be made in order to protect the name. Real evidence, and secondhand.
   *
   * A described preparation that people from the place have confirmed is the thing
   * itself — someone saying *this is how we make it*. Crediting only the register was
   * backwards, and it had a consequence that gave the game away: a dish with its
   * ingredients recorded and three confirmations from its own village scored 49 and
   * stayed Unverified, because no institution had ever written it down. That is
   * precisely the dish this atlas exists for, and the model was refusing it.
   *
   * A published account on its own still counts for nothing here. A cookbook page
   * proves somebody published a method, not that it is the method of the place — the
   * confirmations are what turn an account into evidence of technique.
   */
  const communityMethod = validations > 0 && Boolean(e.hasAccount);
  const technique = e.registerMethod || communityMethod ? 50 : 0;
  // Somebody who says they are from the place is a local source; that is what makes
  // their confirmation worth more than another citation.
  const localSource = validations > 0 ? 60 : 0;
  const documentation = e.heritage.length ? 75 : e.hasArticle ? (e.extractLength > 600 ? 40 : 25) : 0;
  // Full marks only at the number the brief asks for. Below it the record has been
  // looked at, not confirmed, and partial confirmation must not read as agreement.
  const community =
    validations >= VALIDATIONS_REQUIRED ? 100 : Math.min(90, validations * 30);

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
 * The authenticity score at which a record stops being a documented version and
 * becomes an authenticated one.
 *
 * Set at 55 for a reason that is arithmetic rather than editorial. With no
 * confirmations, `localSource` and `community` are both zero, so the best a record
 * can reach on published data alone is
 *
 *   (70 geography + 65 ingredients + 50 technique + 0 + 75 documentation + 0) / 6 = 43
 *
 * — and 43 is below 55. **No amount of documentation can promote a record.** The
 * threshold is only reachable once people from the place have confirmed it: the
 * thinnest record that clears it carries three confirmations, an article and its
 * ingredients, and lands on 56.
 *
 * That is why this is a number and not a rule. A reader can add up the six figures
 * printed on the card and see for themselves why a record is classified as it is,
 * which is the claim this atlas makes about all of its numbers.
 *
 * ## Why the score is not the only gate
 *
 * `VALIDATIONS_REQUIRED` is checked as well, and the first draft did not check it.
 * A record with a heritage designation *and* a register-documented method reaches 58
 * on **one** confirmation — so a single person could have authenticated a tradition,
 * because strong paperwork had already carried the score most of the way there.
 *
 * Three confirmations is not a proxy for confidence that a high enough score can
 * stand in for. It is the brief's own answer to a different question — how many
 * people have to agree — and a number cannot buy its way around it.
 */
export const AUTHENTIC_AT = 55;

/**
 * Classify and score an imported record.
 *
 * The ceiling is deliberate: with a local source and community validation open, the
 * arithmetic cannot exceed the low 40s, so no import ever outranks an assessed
 * record — the ordering on every screen stays truthful without special-casing.
 */
export function assess(e: Evidence): Assessment {
  const breakdown = scoreDimensions(e);
  const score = clamp(breakdown.reduce((sum, [, v]) => sum + v, 0) / breakdown.length);

  /*
   * The two "nothing is documented" branches below must not fire once somebody has
   * confirmed the record, because both of them say so out loud — one tells the reader
   * "nothing documents how this is made" and the other "nobody from the community has
   * checked it". A record with three confirmations was being told both.
   *
   * A confirmation is documentation: it is a person from the place saying this is how
   * it is made, which is the strongest kind the atlas recognises. Where there are
   * confirmations the record falls through to be scored on what it actually has.
   */
  const confirmed = (e.validations ?? 0) > 0;

  // Nothing but a name and a place: no score at all, rather than a misleading number.
  if (!confirmed && !e.ingredients.length && !e.heritage.length && !e.hasArticle && !e.hasAccount) {
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
  if (!confirmed && !e.ingredients.length && !e.heritage.length && !e.hasArticle) {
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

  /*
   * Promotion, and the only route to it.
   *
   * A record that clears `AUTHENTIC_AT` has been confirmed by people from the place,
   * because the arithmetic makes the threshold unreachable any other way — see the
   * note there. So this branch runs before the evidence-shaped ones below: once
   * somebody who cooks it has said so, how the record was originally documented
   * stops being what classifies it.
   *
   * Local against regional is decided by where the confirmations came from, not by
   * the score. A higher number does not make a dish more local; being confirmed by
   * the town rather than the state does.
   */
  if (score >= AUTHENTIC_AT && (e.validations ?? 0) >= VALIDATIONS_REQUIRED && e.ingredients.length) {
    const local = e.validatedLocally === true;
    const people = e.validations ?? 0;
    return {
      ...(local ? CLASSIFICATION.local : CLASSIFICATION.regional),
      score,
      breakdown,
      disclaimer:
        `${people} ${people === 1 ? 'person' : 'people'} with a stated connection to the place ` +
        `${people === 1 ? 'has' : 'have'} confirmed this preparation, which is what lifts it above a documented ` +
        `version. ${
          local
            ? 'The confirmations name the locality itself, so it is recorded as a local tradition.'
            : 'The confirmations speak for the wider region rather than one town, so it is recorded as regional.'
        } The score is the mean of the six checks below and can be added up.`,
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

/**
 * Proposing a dish the atlas does not have.
 *
 * `contribution.ts` already sends a tradition in, and deliberately does it the cheapest
 * way there is: a pre-filled form opened at its source, no backend, no account. That
 * trade was right for what it does, and it has one consequence that is now the
 * problem — **a submission goes to one person's inbox and stops there.** Nobody else
 * sees it, nobody can agree with it, and the person who knows the dish best has no way
 * to say so. It is a private channel wearing a community feature's clothes.
 *
 * A proposal is the same act with the loop closed. It is public from the moment it is
 * made, it is confirmed by the same people through the same mechanism as any record in
 * the atlas, and it enters the catalogue only when they have.
 *
 * ## The same process, not a parallel one
 *
 * There is no separate scoring path here and that is the single most important thing
 * about this file. A proposal is scored by `assess()` on the same six dimensions as
 * all 18,008 existing records, using the same `Evidence` shape, and it is confirmed by
 * the same `Confirmation` type that `confirmations.ts` defines — the same required
 * `connection`, the same required `said`, the same one-per-person index.
 *
 * A second, gentler ladder for new submissions would have been easy to write and would
 * have quietly destroyed the badge: "Authentic" has to mean the same thing on a record
 * that arrived from UNESCO and on one that arrived from a reader, or it means nothing
 * on either. So a proposal starts where the evidence puts it, which for a dish nobody
 * has written down is Unverified with a low score, and it climbs the way everything
 * else climbs.
 *
 * ## Why the submitter does not confirm their own proposal
 *
 * Their account is what the proposal *is*; counting it as a confirmation would let one
 * person supply both the claim and the agreement, and `PROPOSAL_CONFIRMATIONS` would
 * mean two strangers rather than three. So the submitter is shown as the source and
 * `confirmationsOf` never includes them.
 *
 * This is enforced by identity at the server, not here — the same unique index the
 * confirmation badge already rests on. See `docs/proposals-api.md`.
 *
 * ## The bar, and the tension in it
 *
 * `PROPOSAL_CONFIRMATIONS` is 3, matching `VALIDATIONS_REQUIRED`, so there is one
 * number to explain rather than two.
 *
 * The tension is real and worth stating rather than discovering: a genuinely obscure
 * dish — which is precisely what this feature exists to capture — may be known to four
 * people in one village, none of whom use the app. A high bar keeps spam out and keeps
 * that dish out with it. A low bar admits the dish and admits invention alongside it.
 *
 * Three is a starting position, not a finding. It is a single named constant here so
 * it can be moved on evidence once there are real proposals to look at, and moving it
 * changes admission only — it can never change what `AUTHENTIC_AT` means.
 *
 * ## Until it is switched on
 *
 * Same rule as the donate button, the contribution form and confirmations: with no
 * endpoint configured `canPropose()` is false and the app says proposals are not open
 * yet, rather than offering a control that goes nowhere.
 */

import type { Copy } from '../i18n/copy';
import { assess, type Assessment, type Evidence } from './assess';
import { VALIDATIONS_REQUIRED } from './authenticity';
import type { Confirmation } from './confirmations';
import type { Dish } from './types';

/**
 * A dish somebody says exists, which the atlas has no record of.
 *
 * Shaped to become a `Dish` rather than to be convenient to submit, because the whole
 * value of it is that it enters the catalogue on the same terms as everything else.
 */
export interface Proposal {
  /** Assigned by the server. Never derived from the name — names are edited. */
  id: string;
  /** The dish, as the person who knows it writes it. Never corrected on the way in. */
  name: string;
  /** Country, canonical where it could be resolved, as written where it could not. */
  country: string;
  /** Anything below country level — the state, district, town. Often the whole point. */
  region: string;
  /** Who makes it, and on what occasions. Prose, in their words. */
  cooks: string;
  ingredients: string[];
  /** The method, one step per line, where they gave one. */
  steps: string[];
  /** How the submitter is shown. Their name, as they gave it. */
  submitter: string;
  /**
   * The submitter's relationship to the place, in their words.
   *
   * Required for exactly the reason it is required on a confirmation: it is the whole
   * difference between this and copying a recipe off the internet.
   */
  connection: string;
  /** A Wikimedia Commons file name, where they published one. Never a hotlink. */
  photo: string;
  /** ISO date. */
  at: string;
  /**
   * Where it is in the process.
   *
   * `proposed` is public and confirmable. `published` has met the bar and been written
   * into a source file by `scripts/promote-proposals.mjs`; it is a record now, and the
   * proposal stays only as provenance. `declined` was rejected and is kept so the same
   * thing is not proposed and re-proposed for ever.
   */
  status: 'proposed' | 'published' | 'declined';
  /**
   * Who has confirmed it. Never includes the submitter — see the note above.
   *
   * The same type the atlas uses everywhere else, deliberately.
   */
  people: Confirmation[];
}

/**
 * Where the proposals API lives.
 *
 * Defaults to `/api` rather than to empty, which is the opposite of how
 * `CONFIRMATIONS_URL` and the donate link work — and the difference is that those point
 * at somewhere else. This API ships in the same repository, deploys in the same build,
 * and is served from the same origin by `functions/api`. There is nothing to configure
 * and nowhere else it could be.
 *
 * Found by discovering that `.env` is gitignored, as it should be: had this stayed
 * env-driven, every deploy would have shipped with proposals silently switched off and
 * the app cheerfully explaining that submissions were not open yet.
 *
 * Still overridable, for the one case that is real: pointing a local app at a deployed
 * API while working on the client.
 */
export const PROPOSALS_URL = process.env.EXPO_PUBLIC_PROPOSALS_URL ?? '/api';

export const canPropose = (): boolean => PROPOSALS_URL.trim().length > 0;

/**
 * Confirmations needed before a proposal becomes a record.
 *
 * Matched to `VALIDATIONS_REQUIRED` on purpose so the app has one number to explain.
 * Admission only — see the header. It cannot move what `AUTHENTIC_AT` means.
 */
export const PROPOSAL_CONFIRMATIONS = VALIDATIONS_REQUIRED;

/**
 * The least a proposal needs to be worth showing to anybody.
 *
 * A name and a place, because a dish with nowhere attached cannot be confirmed by
 * people from that place — which is the entire mechanism. A connection, because
 * without it this is an anonymous assertion and the atlas already refuses those.
 *
 * Ingredients, method and photograph are wanted and not required. Somebody who knows a
 * dish exists and where it is from has already told us something no source here holds,
 * and demanding a full recipe up front loses exactly the people worth hearing from.
 *
 * ## The list is the labels
 *
 * Written as a map of field to the words the form puts on the box, with `REQUIRED`
 * derived from its keys — rather than a list of keys and a separate map beside it, which
 * is two things that can disagree. They already had: `/propose` labelled a box "Your
 * name", stored it as `submitter`, and told anybody who left it empty *"Still needed:
 * submitter."* Deriving one from the other means a field cannot become required without
 * somebody deciding what to call it.
 */
export const requiredLabels = (copy: Copy) =>
  ({
    name: copy.requiredDishName,
    country: copy.requiredCountry,
    submitter: copy.requiredYourName,
    connection: copy.requiredYourConnection,
  }) satisfies Partial<Record<keyof Proposal, string>>;

/* Listed rather than derived from `requiredLabels`. Which fields are required has
   nothing to do with language, and deriving these would mean calling that function with
   some locale just to learn the field names. */
export const REQUIRED = ['name', 'country', 'submitter', 'connection'] as const;

export const missingFrom = (p: Partial<Proposal>): (keyof Proposal)[] =>
  REQUIRED.filter((field) => !String(p[field] ?? '').trim());

/**
 * Fold a dish name down to the thing two spellings of it have in common.
 *
 * Duplicate detection is the point of this function, and it has to be more aggressive
 * than search is. `queries.ts` lowercases and stops, which is right for search — a
 * reader typing "halwa" should not also get "halva" ranked above what they asked for.
 * It is wrong here, because "Kozhikodé Halva" and "Kozhikode Halwa" are one dish and
 * admitting both as separate records is the failure this check exists to prevent.
 *
 * So: strip accents via NFD, drop everything that is not a letter, a digit or a space,
 * and collapse whitespace. Deliberately *not* stemming or transliterating — those need
 * a language, and the atlas holds names in eighty of them.
 */
export function fold(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number} ]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Records that might already be the dish being proposed.
 *
 * Checked against `localNames` as well as `name`, because the atlas displays records in
 * up to eighty languages and a proposal written in one of them would otherwise sail
 * past a record it duplicates. This is the same gap that made search miss records for
 * months.
 *
 * **Returned, not enforced.** The caller shows these to the submitter and asks; it does
 * not silently reject. A fold collision is evidence of a duplicate, not proof of one —
 * two genuinely different dishes can share a name across two countries, which is why
 * `country` is compared but a mismatch does not veto the match. Deciding for the
 * submitter would lose real dishes to a string comparison.
 */
export function possibleDuplicates(catalogue: Dish[], name: string, limit = 5): Dish[] {
  const target = fold(name);
  if (!target) return [];

  return catalogue
    .filter((dish) => {
      if (fold(dish.name) === target) return true;
      return Object.values(dish.localNames ?? {}).some((local) => fold(local) === target);
    })
    .slice(0, limit);
}

/**
 * A proposal expressed as evidence, so `assess()` can score it unchanged.
 *
 * The mapping is where a proposal could quietly cheat, so each line is deliberate:
 *
 * - `hasAccount` is true only where the submitter actually described something. A name
 *   and a place is not an account of how a dish is made.
 * - `hasArticle` is **always false**. A proposal is a dish nobody has written down;
 *   that is the definition. Claiming an article would credit the documentation
 *   dimension for a document that does not exist.
 * - `heritage` is **always empty**. Heritage is an institutional register saying this
 *   name belongs to this place, and no submitter can assert one about themselves. This
 *   matters more than it looks: heritage plus ingredients classifies Authentic-Regional
 *   through a separate branch of `assess`, so letting a proposal declare its own
 *   heritage would hand it the badge with nobody having confirmed anything.
 * - `registerMethod` is **always false**, for the same reason — it is a heritage body's
 *   documented method, and a proposal has no heritage body.
 *
 * What is left is what a proposal genuinely brings: a place, ingredients, a firsthand
 * account, and whatever people confirm. Which is exactly the ladder in `assess`.
 */
export function evidenceOf(p: Proposal): Evidence {
  const account = [p.cooks, ...p.steps].join(' ').trim();

  return {
    hasCountry: Boolean(p.country.trim()),
    hasRegion: Boolean(p.region.trim()),
    ingredients: p.ingredients,
    heritage: [],
    hasArticle: false,
    extractLength: account.length,
    hasAccount: account.length > 0,
    registerMethod: false,
    validations: p.people.length,
    validatedLocally: p.people.some((person) => person.local),
  };
}

/** What a proposal would score today, on the same six dimensions as every record. */
export const assessProposal = (p: Proposal): Assessment => assess(evidenceOf(p));

/**
 * Whether a proposal has met the bar to enter the catalogue.
 *
 * Confirmations only. Deliberately **not** also gated on the score: admission and
 * authentication are different questions, and conflating them would mean the atlas
 * could only accept dishes that were already well documented — excluding precisely the
 * undocumented food this whole feature exists to reach.
 *
 * A published proposal enters at whatever badge its evidence earns, which for most will
 * be well short of Authentic. That is the honest outcome and the same one 9,680
 * existing records live with.
 */
export const isPublishable = (p: Proposal): boolean =>
  p.status === 'proposed' && p.people.length >= PROPOSAL_CONFIRMATIONS;

/**
 * What a proposal still needs, said to the person reading it.
 *
 * Phrased as an ask rather than a verdict, for the same reason `whatItNeeds` is: the
 * reader who knows this dish is the one person who can move it, and "2 of 3" tells them
 * nothing about what to do.
 */
export function whatItNeeds(copy: Copy, p: Proposal): string {
  if (p.status === 'published') return '';
  const have = p.people.length;
  const short = PROPOSAL_CONFIRMATIONS - have;
  if (short <= 0) return copy.proposalConfirmed;
  if (have === 0) {
    return copy.proposalNobodyYet.replace('{n}', String(PROPOSAL_CONFIRMATIONS));
  }
  return copy.proposalSoFar
    .replace('{have}', String(have))
    .replace('{n}', String(PROPOSAL_CONFIRMATIONS))
    .replace('{short}', String(short));
}

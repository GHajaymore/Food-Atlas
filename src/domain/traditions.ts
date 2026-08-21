/**
 * Disagreement, and what to do with it.
 *
 * The brief's position is unusual and worth restating, because everything here
 * follows from it: when two people describe a dish differently, the platform does not
 * pick a winner. "Conflicting accounts are both kept. The record splits into the
 * traditions people actually described — one per region or community — and no version
 * is declared the true one."
 *
 * So a fork is a success, not a failure. Two records for one dish means the atlas has
 * learned that a dish is made two ways — which is more true than either record alone.
 *
 * Three kinds of disagreement resolve three different ways, which is why the app asks
 * the challenger what differs and where they cook, rather than offering a downvote:
 *
 *   correction → the record is wrong. Amend it and re-run the evidence checks.
 *   variation  → both are true, in different places. Fork into sibling records.
 *   origin     → who the dish belongs to. Never forked, never settled by counting.
 */

import type { Dish, Dispute, DisputeKind } from './types';

/** How a raised challenge should be handled. */
export type Resolution =
  /** Split into sibling records, one per place or community. */
  | 'fork'
  /** Same place, conflicting accounts — needs more validators from that place. */
  | 'adjudicate'
  /** Record both claims side by side; the score is untouched. */
  | 'attribute'
  /** A factual error both sides would agree on. */
  | 'amend';

/**
 * Route a challenge.
 *
 * The comparison that does the work is the challenger's place against the record's.
 * Somebody from Thalassery saying "we use less sugar" is not contradicting a record
 * about Kozhikode — it was never a claim about their town. That is a fork, and
 * treating it as a conflict would be the mistake.
 */
export function routeDispute(recordPlace: string, challengerPlace: string, kind: DisputeKind): Resolution {
  // Ownership is never resolved by geography or by headcount.
  if (kind === 'origin') return 'attribute';
  if (kind === 'correction') return 'amend';

  const samePlace = recordPlace.trim().toLowerCase() === challengerPlace.trim().toLowerCase();
  return samePlace ? 'adjudicate' : 'fork';
}

/**
 * Sibling records — the same dish as made elsewhere.
 *
 * Peers, deliberately: there is no parent and no canonical version, so the UI can
 * only ever present them as "other traditions of this dish".
 */
export const siblingsOf = (dish: Dish, all: Dish[]): Dish[] =>
  dish.traditionId ? all.filter((d) => d.traditionId === dish.traditionId && d.id !== dish.id) : [];

export const openDisputes = (dish: Dish): Dispute[] => (dish.disputes ?? []).filter((d) => d.status === 'open');

/**
 * A record with an open challenge is marked, not hidden, and its score is not
 * quietly reduced. Concealing a live disagreement would be the same failure as
 * claiming a certainty the evidence does not support.
 */
export const isDisputed = (dish: Dish): boolean => openDisputes(dish).length > 0;

/** Disputes that were resolved by keeping both accounts — the fork outcome. */
export const forkedDisputes = (dish: Dish): Dispute[] =>
  (dish.disputes ?? []).filter((d) => d.status === 'forked' || d.status === 'kept');

/**
 * An origin dispute never moves the authenticity score.
 *
 * Authenticity here answers "is this how the dish is made in this place?" — a
 * question that stands whoever invented it. Letting a contested origin drag the score
 * down would punish exactly the dishes with the richest history, and would drag the
 * app into arguments it has no business adjudicating.
 */
export const originAffectsScore = false;

/**
 * The line shown on a record whose origin is contested. Neutral by construction: it
 * names the claims and refuses to rank them.
 */
export const ORIGIN_DISCLAIMER =
  'This dish has more than one documented historical claim. The traditions below are recorded as they are ' +
  'described by each place, with their sources. No claim here is presented as the winner, and none of this ' +
  'affects the authenticity score — that measures how the dish is made in a place, not who first made it.';

/** The prompt that turns a reader into a validator. Two taps, not a form. */
export const CONFIRM_PROMPT = 'Is this how it’s made where you’re from?';

/**
 * What to ask a reader about *this* record, given what it actually contains.
 *
 * The prompt above assumes there is a method on the page to agree or disagree with.
 * On most records there is not: 12,000 of them say "Nobody has recorded how this is
 * made" and then asked "Is this how it's made where you're from?" with a button
 * marked **Yes — this matches**. There was nothing to match. A reader who tapped it
 * would be confirming a blank.
 *
 * So where no method is recorded, the question moves to the thing the record does
 * assert — the place — which a reader from Charente can answer about cagouilles even
 * though nobody has written the recipe down. It is a real question with a real answer,
 * and answering it is worth something: place is one of the six evidence dimensions.
 */
export interface ConfirmAsk {
  kicker: string;
  body: string;
  /** The affirmative. Never offered where there is nothing to affirm. */
  yes: string;
  no: string;
}

export function confirmAsk(hasMethod: boolean): ConfirmAsk {
  if (hasMethod) {
    return {
      kicker: CONFIRM_PROMPT,
      body:
        'If you cook this where it comes from, confirming or correcting it is what moves a record out of ' +
        'Unverified. Where your version differs, it is recorded alongside — not instead of — this one.',
      yes: 'Yes — this matches',
      no: 'It’s made differently where I’m from',
    };
  }

  return {
    kicker: 'Is this dish from where we say it is?',
    body:
      'Nobody has written down how this one is made, so there is nothing here to agree with yet. The place is ' +
      'what this record claims, and that is worth confirming on its own — it is one of the six evidence checks.',
    yes: 'Yes — it’s from here',
    no: 'No — it’s from somewhere else',
  };
}

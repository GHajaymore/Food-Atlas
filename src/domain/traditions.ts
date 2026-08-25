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

import type { Copy } from '../i18n/copy';
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
export const originDisclaimer = (copy: Copy): string => copy.originDisclaimer;

/** The prompt that turns a reader into a validator. Two taps, not a form. */


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
  /**
   * What this particular record still needs, named and counted.
   *
   * Empty where the record has no place worth naming, because "two more people from
   * somewhere" is not an ask.
   */
  standing: string;
}

/**
 * How far this record is from the badge, stated exactly.
 *
 * The positioning brief asks for the ask to be *specific and near* — "3 people from
 * Kerala can authenticate this" beats a general plea, because a reader from Kerala
 * recognises themselves in the first sentence and nobody recognises themselves in the
 * second.
 *
 * ## What it must not say
 *
 * It must not promise the badge. Promotion needs `validations >= validationsRequired`
 * **and** `score >= authenticAt`, so "two more people will make this Authentic" is
 * false for any record whose score is short — and the app cannot know that a
 * confirmation will close the gap, because the confirmations themselves feed the score.
 *
 * So this states the **necessary** condition and never the sufficient one: how many
 * confirmations the badge requires, how many the record has, and from where. That is
 * checkable on the page — the count is printed beside it — which is the only kind of
 * claim this project makes.
 */
export function confirmStanding(copy: Copy, place: string, have: number, need: number): string {
  if (!place) return '';

  const remaining = Math.max(0, need - have);
  if (remaining === 0) {
    return copy.standingMet.replace('{n}', String(need)).replace('{place}', place);
  }

  /* Separate keys per count rather than a number and a suffix. Polish and Russian have
     three plural classes, and gluing a plural noun onto a figure reads as broken to a
     native speaker on most of the numbers this renders. */
  const people = remaining === 1 ? copy.onePersonMore : copy.morePeople.replace('{n}', String(remaining));
  const soFar =
    have === 0 ? copy.standingNobody : have === 1 ? copy.standingOne : copy.standingMany.replace('{n}', String(have));

  return copy.standingNeed
    .replace('{soFar}', soFar)
    .replace('{need}', String(need))
    .replace('{people}', people)
    .replace('{place}', place);
}

export function confirmAsk(copy: Copy, hasMethod: boolean, standing = ''): ConfirmAsk {
  if (hasMethod) {
    return {
      kicker: copy.confirmPrompt,
      body: copy.confirmAskBody,
      yes: copy.confirmYes,
      no: copy.confirmNo,
      standing,
    };
  }

  return {
    kicker: copy.confirmPlacePrompt,
    body: copy.confirmPlaceBody,
    yes: copy.confirmPlaceYes,
    no: copy.confirmPlaceNo,
    standing,
  };
}

/**
 * The line under a contested record's place.
 *
 * A record with several documented origins still has to be filed under one country,
 * because the atlas is navigated by place and a record with nowhere is a record nobody
 * finds. What it must not do is present that filing as the answer. "Pierogi / China"
 * sat in the largest text on the page above a section explaining that no claim here is
 * the winner, and a reader who read only the top of the screen took the opposite
 * meaning from the one the page intended.
 *
 * Deliberately does not name which country the record is filed under, or rank the
 * claims: they are listed in full lower down, each with its source, in the order the
 * source gave them.
 */
export const contestedNote = (copy: Copy, claims: number): string =>
  copy.contestedNote.replace('{n}', String(claims));

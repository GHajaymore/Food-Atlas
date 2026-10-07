/**
 * How many proposals are waiting for somebody to recognise them.
 *
 * The atlas has one bottleneck and it is not submissions: a proposal needs three people
 * who know the dish before it can enter, and a reader who never opens `/proposals` has
 * no way of learning that anything is waiting there. Nothing notifies anyone — a
 * proposal lands in the database and sits until a person goes looking for it. Email
 * would mean another service and another secret; this is the free half of the same job,
 * and it points every visitor at the queue rather than only whoever holds the token.
 *
 * ## Cached for the session, and never on the critical path
 *
 * One request per visit, shared by the header and the phone colophon through a
 * module-level promise, so mounting both does not fetch twice and moving between screens
 * does not fetch again. The count starts at 0 and moves when the answer arrives: the
 * nav renders immediately either way, and `loadProposals` already returns `[]` on every
 * failure, so an endpoint that is down shows the header exactly as it looked before this
 * existed.
 *
 * Deliberately not live. A number that is a few minutes old is right for "something is
 * waiting"; polling for it would spend a request a minute to be no more useful.
 */

import { useEffect, useState } from 'react';
import { loadProposals } from './proposals';
import { PROPOSAL_CONFIRMATIONS } from '../domain/proposals';

let counted: Promise<number> | null = null;

/**
 * Proposals still short of their confirmations.
 *
 * Not every open proposal — one that already has its three is waiting on a publish, not
 * on a reader, and counting it would send somebody to the queue to do a thing that is
 * already done.
 */
const countWaiting = (): Promise<number> =>
  (counted ??= loadProposals()
    .then((list) =>
      list.filter((p) => p.status === 'proposed' && p.people.length < PROPOSAL_CONFIRMATIONS).length,
    )
    .catch(() => 0));

export function usePendingProposals(): number {
  const [waiting, setWaiting] = useState(0);

  useEffect(() => {
    let live = true;
    void countWaiting().then((n) => {
      if (live) setWaiting(n);
    });
    return () => {
      live = false;
    };
  }, []);

  return waiting;
}

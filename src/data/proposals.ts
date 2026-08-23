/**
 * Talking to the proposals endpoint.
 *
 * `src/domain/proposals.ts` holds the rules and knows nothing about the network; this
 * is the other half. Kept apart because the rules are the valuable part and they should
 * outlive whatever is serving them — the domain layer has no `fetch` in it anywhere, and
 * `docs/architecture.md` makes that a long-term commitment rather than a habit.
 *
 * ## Reads degrade, writes do not
 *
 * `loadProposals` swallows every failure and returns an empty list, exactly as
 * `loadConfirmations` does: if the endpoint is down, the atlas opens with no proposals
 * showing, which is the state it has been in since it was written. Taking the app down
 * because a list could not be fetched would be the wrong trade by a wide margin.
 *
 * `submitProposal` and `confirmProposal` do the opposite and report every failure to the
 * caller, because they carry something a person just wrote. A read that fails silently
 * costs a reader nothing; a write that fails silently costs somebody the ten minutes
 * they spent describing their grandmother's dish, and tells them it worked. That is the
 * one failure this app must never produce.
 */

import {
  PROPOSALS_URL,
  canPropose,
  missingFrom,
  type Proposal,
} from '../domain/proposals';

/** What the caller needs to know about a write that did not happen. */
export type Sent = { ok: true; proposal?: Proposal } | { ok: false; error: string };

const TIMEOUT = 15000;

const base = () => PROPOSALS_URL.replace(/\/+$/, '');

/**
 * Everything open for confirmation.
 *
 * Returns `[]` rather than throwing on any failure — see the header. An unparseable or
 * non-array body is treated as empty for the same reason: a malformed response is a
 * failure, and it should look like one rather than like a crash.
 */
export async function loadProposals(): Promise<Proposal[]> {
  if (!canPropose()) return [];
  try {
    const response = await fetch(`${base()}/proposals`, { signal: AbortSignal.timeout(TIMEOUT) });
    if (!response.ok) return [];
    const body: unknown = await response.json();
    return Array.isArray(body) ? (body as Proposal[]) : [];
  } catch {
    return [];
  }
}

/**
 * Turn whatever went wrong into a sentence somebody can act on.
 *
 * Deliberately not the raw error. "TypeError: Failed to fetch" tells a cook nothing and
 * reads as though they broke something; what they need to know is whether to try again
 * and whether their work is lost.
 */
function failed(error: unknown): Sent {
  const message =
    error instanceof DOMException && error.name === 'TimeoutError'
      ? 'The server took too long to answer.'
      : 'Could not reach the server.';
  return { ok: false, error: `${message} Your entry has not been sent — nothing you typed is lost, try again in a moment.` };
}

/**
 * Send a new proposal.
 *
 * Required fields are checked here as well as in the form, because this is the last
 * place that can stop an incomplete record reaching the database — and because a
 * proposal missing its `connection` is not a weaker submission, it is a different kind
 * of thing entirely. See `REQUIRED` in the domain layer for why those four.
 */
export async function submitProposal(entry: Partial<Proposal>): Promise<Sent> {
  if (!canPropose()) return { ok: false, error: 'Proposals are not open yet.' };

  const missing = missingFrom(entry);
  if (missing.length) return { ok: false, error: `Still needed: ${missing.join(', ')}.` };

  try {
    const response = await fetch(`${base()}/proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
      signal: AbortSignal.timeout(TIMEOUT),
    });

    if (response.status === 409) {
      return { ok: false, error: 'This dish has already been proposed. Open it and confirm it instead — that is what moves it.' };
    }
    if (!response.ok) return { ok: false, error: `The server refused it (${response.status}).` };

    return { ok: true, proposal: (await response.json()) as Proposal };
  } catch (error) {
    return failed(error);
  }
}

/**
 * Every proposal including declined ones. Administrator only.
 *
 * A separate function rather than a flag on `loadProposals`, because the two fail
 * differently and should: a reader's list degrades to empty on any error, while a
 * moderator who cannot load the queue needs to be told, not shown an empty screen that
 * looks like there is nothing to moderate.
 */
export async function loadAllProposals(token: string): Promise<Proposal[] | { error: string }> {
  if (!token.trim()) return { error: 'No administrator token.' };
  try {
    const response = await fetch(`${base()}/proposals?include=all`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (response.status === 401) return { error: 'That token was not accepted.' };
    if (response.status === 503) return { error: 'No administrator is configured on the server.' };
    if (!response.ok) return { error: `The server refused it (${response.status}).` };
    const body: unknown = await response.json();
    return Array.isArray(body) ? (body as Proposal[]) : [];
  } catch {
    return { error: 'Could not reach the server.' };
  }
}

/** Decline a proposal, or put a declined one back. Administrator only. */
export async function setProposalStatus(
  token: string,
  id: string,
  status: 'declined' | 'proposed',
  note = '',
): Promise<Sent> {
  if (!token.trim()) return { ok: false, error: 'No administrator token.' };
  try {
    const response = await fetch(`${base()}/proposals/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status, note }),
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (response.status === 401) return { ok: false, error: 'That token was not accepted.' };
    if (response.status === 409) {
      return { ok: false, error: 'That is already in the atlas and cannot be changed here.' };
    }
    if (!response.ok) return { ok: false, error: `The server refused it (${response.status}).` };
    return { ok: true };
  } catch (error) {
    return failed(error);
  }
}

/**
 * Confirm somebody else's proposal.
 *
 * The two rejections worth naming are the ones the badge rests on, and both are
 * enforced by an index at the server rather than by anything here: a person cannot
 * confirm twice, and a submitter cannot confirm their own. The client cannot check
 * either, because it never sees an identity — see `docs/proposals-api.md`.
 */
export async function confirmProposal(
  id: string,
  said: { name: string; connection: string; said: string; local: boolean },
): Promise<Sent> {
  if (!canPropose()) return { ok: false, error: 'Confirmations are not open yet.' };

  for (const field of ['name', 'connection', 'said'] as const) {
    if (!said[field]?.trim()) return { ok: false, error: `Still needed: ${field}.` };
  }

  try {
    const response = await fetch(`${base()}/proposals/${encodeURIComponent(id)}/confirmations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(said),
      signal: AbortSignal.timeout(TIMEOUT),
    });

    if (response.status === 409) {
      return { ok: false, error: 'You have already confirmed this one.' };
    }
    if (response.status === 403) {
      return { ok: false, error: 'You proposed this dish, so it needs somebody else to confirm it.' };
    }
    if (!response.ok) return { ok: false, error: `The server refused it (${response.status}).` };

    return { ok: true };
  } catch (error) {
    return failed(error);
  }
}

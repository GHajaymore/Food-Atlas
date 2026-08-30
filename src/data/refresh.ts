/**
 * Asking for a source check, from the app.
 *
 * The atlas was scraped from wikis and wikis are edited, so a record's prose can be
 * years out of date with nothing here noticing. `scripts/check-sources.mjs` notices —
 * and needs a laptop and a typed dish name. This is the half that lets somebody reading
 * a record on a phone say *check this one* and have it remembered.
 *
 * Nothing here performs a check. The queue is a list of questions; `drain-refresh.mjs`
 * answers them and writes the answer back. See `functions/api/refresh.ts` for why the
 * work cannot happen on the server at all.
 */

import { adminHeaders } from './adminAuth';
import { PROPOSALS_URL } from '../domain/proposals';

export interface RefreshRequest {
  id: string;
  kind: 'dish' | 'country' | 'all';
  target: string;
  requestedAt: string;
  status: 'queued' | 'done' | 'failed';
  doneAt: string | null;
  /** What the drain found, in one line. Empty until it has run. */
  result: string;
}

const base = () => PROPOSALS_URL.replace(/\/+$/, '');

const TIMEOUT = 15000;

export async function loadRefreshQueue(token: string): Promise<RefreshRequest[] | { error: string }> {
  try {
    const response = await fetch(`${base()}/refresh`, {
      credentials: 'include',
      headers: adminHeaders(token),
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (response.status === 401) return { error: 'Not authorised. Sign in as an administrator, or enter the token.' };
    if (!response.ok) return { error: `The server refused it (${response.status}).` };
    const body: unknown = await response.json();
    return Array.isArray(body) ? (body as RefreshRequest[]) : [];
  } catch {
    return { error: 'Could not reach the server.' };
  }
}

export async function queueRefresh(
  token: string,
  kind: RefreshRequest['kind'],
  target: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!token.trim()) return { ok: false, error: 'No administrator token.' };
  if (kind !== 'all' && !target.trim()) return { ok: false, error: `A ${kind} name is needed.` };

  try {
    const response = await fetch(`${base()}/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: adminHeaders(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ kind, target: target.trim() }),
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (response.status === 401) return { ok: false, error: 'That token was not accepted.' };
    /* Already waiting. Not a failure — the queue doing its job. */
    if (response.status === 409) return { ok: false, error: 'That is already queued.' };
    if (!response.ok) return { ok: false, error: `The server refused it (${response.status}).` };
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not reach the server.' };
  }
}

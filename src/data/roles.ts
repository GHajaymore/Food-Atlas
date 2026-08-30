/**
 * Who runs this site: reading the list, and changing it.
 *
 * Thin on purpose. Every rule about who may appoint whom lives at
 * `functions/api/admin/roles.ts` and is enforced there — this module asks and reports.
 * A client that also knew the rules would be a second copy of them, and the copy that
 * drifts is always the one nobody thought was authoritative.
 *
 * What it does carry is `mayAppoint`, straight from the server's answer, so the screen
 * can decline to draw controls that would only ever return 403. That is presentation,
 * not authority: hiding the button stops a pointless click and stops nothing else.
 */

import { adminHeaders } from './adminAuth';
import { PROPOSALS_URL } from '../domain/proposals';

export interface RoleHolder {
  id: string;
  role: string;
  granted_by: string;
  granted: string;
}

export interface Roster {
  /** The reader's own account id, so their own row can be marked. */
  you: string;
  /** Which credential got them in — a session, or the break-glass token. */
  via: 'session' | 'token';
  mayAppoint: boolean;
  people: RoleHolder[];
}

const base = () => PROPOSALS_URL.replace(/\/+$/, '');
const TIMEOUT = 15000;

type Result<T> = { data: T } | { error: string };

async function ask<T>(path: string, init: RequestInit): Promise<Result<T>> {
  try {
    const response = await fetch(`${base()}${path}`, {
      credentials: 'include',
      signal: AbortSignal.timeout(TIMEOUT),
      ...init,
    });
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      /* The server's own sentence, where it wrote one. These refusals are the rules made
         visible — "only the owner can appoint an administrator" tells somebody what the
         system is, and replacing it with a generic failure would waste that. */
      return { error: body.error || `That did not work (${response.status}).` };
    }
    return { data: body as T };
  } catch {
    return { error: 'Could not reach the server.' };
  }
}

export const loadRoster = (token: string): Promise<Result<Roster>> =>
  ask<Roster>('/admin/roles', { headers: adminHeaders(token) });

/**
 * Claim the owner seat, on a database that has none.
 *
 * Sends no account id: the server promotes whoever the session cookie says is asking,
 * and will not be told otherwise. That is the whole safety property of bootstrap — the
 * token proves the authority, the cookie names the person, and neither alone is enough.
 */
export const claimOwner = (token: string): Promise<Result<{ granted: string; role: string }>> =>
  ask('/admin/roles', {
    method: 'POST',
    headers: adminHeaders(token, { 'Content-Type': 'application/json' }),
    body: '{}',
  });

export const appointAdmin = (token: string, account: string): Promise<Result<{ granted: string }>> =>
  ask('/admin/roles', {
    method: 'POST',
    headers: adminHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ account: account.trim().toLowerCase() }),
  });

export const removeAdmin = (token: string, account: string): Promise<Result<{ revoked: string }>> =>
  ask(`/admin/roles?account=${encodeURIComponent(account.trim().toLowerCase())}`, {
    method: 'DELETE',
    headers: adminHeaders(token),
  });

/**
 * Confirming a record that is already in the atlas.
 *
 * The other half of `src/domain/confirmations.ts`, which holds the rules and knows
 * nothing about the network. Same split as proposals, and the same reason: the rules are
 * the valuable part and should outlive whatever is serving them.
 *
 * Reads live in `data/catalogue.ts`, beside the files they arrive with, and degrade to
 * nothing on any failure. This file is the write, and a write reports every failure to
 * the caller — somebody has just told us what their grandmother did differently, and a
 * silent failure would tell them it worked.
 */

import { adminHeaders } from './adminAuth';
import { EN, type Copy } from '../i18n/copy';
import { CONFIRMATIONS_URL, canConfirm } from '../domain/confirmations';
import { saidLabels, SAID_REQUIRED } from '../domain/confirmations';
import { stillNeeded } from '../domain/entry';

/**
 * What the caller needs to know about a write.
 *
 * `verified` is whether this confirmation counted toward the badge — which only the
 * server can answer, because the session is an HttpOnly cookie the page cannot read. The
 * record page needs it: a line saying two more people would meet the bar is false if the
 * one just written was anonymous and therefore moved nothing.
 */
export type Sent = { ok: true; verified?: boolean } | { ok: false; error: string };

/** One row as the moderator's view returns it — with its id, and its status. */
export interface ModeratedConfirmation {
  id: string;
  dishId: number;
  name: string;
  connection: string;
  said: string;
  local: boolean;
  verified: boolean;
  at: string;
  status: string;
}

const TIMEOUT = 15000;

function failed(copy: Copy, error: unknown): Sent {
  const message =
    error instanceof DOMException && error.name === 'TimeoutError'
      ? copy.serverTookTooLong
      : copy.couldNotReachServer;
  return { ok: false, error: copy.nothingYouTypedIsLost.replace('{message}', message) };
}

/**
 * Confirm one record.
 *
 * The three rejections worth naming are the ones the badge rests on. A person cannot
 * confirm the same record twice — enforced by an index at the server, because the client
 * never sees an identity — and the endpoint answers 503 while the table is still waiting
 * for its migration, which is a different thing from a refusal and says so.
 */
export async function submitConfirmation(
  copy: Copy,
  dishId: number,
  said: { name: string; connection: string; said: string; local: boolean },
): Promise<Sent> {
  if (!canConfirm()) return { ok: false, error: copy.confirmationsNotOpen };

  const incomplete = SAID_REQUIRED.filter((field) => !said[field]?.trim());
  if (incomplete.length) {
    return { ok: false, error: stillNeeded(copy, incomplete.map((f) => saidLabels(copy)[f])) };
  }

  try {
    const response = await fetch(CONFIRMATIONS_URL, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dishId, ...said }),
      signal: AbortSignal.timeout(TIMEOUT),
    });

    if (response.status === 409) return { ok: false, error: copy.alreadyConfirmed };
    if (response.status === 503) return { ok: false, error: copy.confirmationsNotOpen };
    if (!response.ok) {
      return { ok: false, error: copy.serverRefused.replace('{status}', String(response.status)) };
    }

    const body = (await response.json().catch(() => ({}))) as { verified?: boolean };
    return { ok: true, verified: body.verified === true };
  } catch (error) {
    return failed(copy ?? EN, error);
  }
}

/**
 * Every confirmation on a record, including the removed ones. Administrator only.
 *
 * A separate function rather than a flag on the read the app makes, because the two fail
 * differently and should: a reader's index degrades to empty on any error, while a
 * moderator who cannot load the list needs to be told rather than shown an empty screen
 * that looks like there is nothing to moderate.
 */
export async function loadAllConfirmations(token: string): Promise<ModeratedConfirmation[] | { error: string }> {
  try {
    const response = await fetch(`${CONFIRMATIONS_URL}?include=all`, {
      credentials: 'include',
      headers: adminHeaders(token),
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (response.status === 401) return { error: 'Not authorised. Sign in as an administrator, or enter the token.' };
    if (response.status === 503) return { error: 'No administrator is configured on the server.' };
    if (!response.ok) return { error: `The server refused it (${response.status}).` };
    const body: unknown = await response.json();
    return Array.isArray(body) ? (body as ModeratedConfirmation[]) : [];
  } catch {
    return { error: 'Could not reach the server.' };
  }
}

/**
 * Take a confirmation down, or put it back. Administrator only.
 *
 * Removing is reversible and the row stays: the unique index is scoped to published, so a
 * removal also frees that person to write a better one rather than locking them out of
 * the record for good.
 */
export async function setConfirmationStatus(
  token: string,
  id: string,
  status: 'published' | 'removed',
): Promise<Sent> {
  if (!token.trim()) return { ok: false, error: 'No administrator token.' };
  try {
    const response = await fetch(`${CONFIRMATIONS_URL}/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      credentials: 'include',
      headers: adminHeaders(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status }),
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (response.status === 401) return { ok: false, error: 'That token was not accepted.' };
    if (response.status === 404) return { ok: false, error: 'No confirmation with that id.' };
    if (!response.ok) return { ok: false, error: `The server refused it (${response.status}).` };
    return { ok: true };
  } catch (error) {
    return failed(EN, error);
  }
}

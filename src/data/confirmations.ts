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

import { EN, type Copy } from '../i18n/copy';
import { CONFIRMATIONS_URL, canConfirm } from '../domain/confirmations';
import { saidLabels, SAID_REQUIRED } from '../domain/confirmations';
import { stillNeeded } from '../domain/entry';

/** What the caller needs to know about a write that did not happen. */
export type Sent = { ok: true } | { ok: false; error: string };

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

    return { ok: true };
  } catch (error) {
    return failed(copy ?? EN, error);
  }
}

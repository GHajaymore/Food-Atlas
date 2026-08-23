/**
 * Reading and writing the settings an administrator controls.
 *
 * A module-level value rather than a store, because these are read during
 * `buildCatalogue` — before React renders anything — and a hook cannot be called from
 * there. `loadSettings()` runs once, ahead of the catalogue, and everything downstream
 * reads `settings` synchronously.
 *
 * ## What happens when this fails
 *
 * `DEFAULTS`, which are the numbers that were compiled in before settings existed. An
 * atlas that cannot reach its settings behaves exactly as it did rather than as
 * something new and unpredictable at the moment it can least explain itself — and,
 * more importantly, no badge changes. A network failure must never be able to move the
 * meaning of the word Authentic.
 */

import { DEFAULTS, readSettings, type Settings } from '../domain/settings';
import { PROPOSALS_URL, canPropose } from '../domain/proposals';
import type { Thresholds } from '../domain/assess';

/** What the app is running on. Replaced once, by `loadSettings`. */
export let settings: Settings = DEFAULTS;

/** The two that `assess()` needs, in the shape it wants them. */
export const thresholds = (): Thresholds => ({
  authenticAt: settings.authenticAt,
  validationsRequired: settings.validationsRequired,
});

const base = () => PROPOSALS_URL.replace(/\/+$/, '');

export async function loadSettings(): Promise<Settings> {
  if (!canPropose()) return settings;
  try {
    const response = await fetch(`${base()}/settings`, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return settings;
    settings = readSettings(await response.json());
  } catch {
    /* Defaults. See the header — this is deliberate, not a swallowed bug. */
  }
  return settings;
}

export type Saved =
  | { ok: true; applied: Partial<Settings>; refused: { key: string; said: unknown; why: string }[] }
  | { ok: false; error: string };

/**
 * Change settings. Administrator only.
 *
 * The token is sent, never stored by this module — `app/admin.tsx` holds it for the
 * length of a session and nothing writes it to disk. A bearer token in local storage is
 * readable by any script that ever runs on the page, and this one can re-badge 18,008
 * records.
 */
export async function saveSettings(token: string, changes: Partial<Settings>): Promise<Saved> {
  if (!token.trim()) return { ok: false, error: 'No administrator token.' };

  try {
    const response = await fetch(`${base()}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(changes),
      signal: AbortSignal.timeout(15000),
    });

    if (response.status === 401) return { ok: false, error: 'That token was not accepted.' };
    if (response.status === 503) return { ok: false, error: 'No administrator is configured on the server.' };

    const body = (await response.json()) as {
      applied?: Partial<Settings>;
      refused?: { key: string; said: unknown; why: string }[];
      error?: string;
    };

    if (!response.ok && body.error) return { ok: false, error: body.error };

    /* Reflect what the server actually accepted, not what was asked for. */
    settings = readSettings({ ...settings, ...(body.applied ?? {}) });
    return { ok: true, applied: body.applied ?? {}, refused: body.refused ?? [] };
  } catch {
    return { ok: false, error: 'Could not reach the server. Nothing was changed.' };
  }
}

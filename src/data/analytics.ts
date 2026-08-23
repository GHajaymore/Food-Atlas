/**
 * Reading what the atlas is being used for.
 *
 * Everything here is a count of events. Nothing is a count of people, and the naming
 * keeps saying so — `events`, `opens`, `searches` rather than `visits` or `users` —
 * because a label is where an honest number quietly becomes a dishonest one. See
 * `migrations/0005_analytics.sql`.
 */

import { PROPOSALS_URL } from '../domain/proposals';

export interface Tally {
  target: string;
  n: number;
}

export interface Analytics {
  days: number;
  totals: { kind: string; n: number }[];
  byDay: { day: string; n: number }[];
  topDishes: Tally[];
  topSearches: Tally[];
  topScreens: Tally[];
  topShelves: Tally[];
}

const base = () => PROPOSALS_URL.replace(/\/+$/, '');

export async function loadAnalytics(
  token: string,
  days = 30,
): Promise<Analytics | { error: string }> {
  if (!token.trim()) return { error: 'No administrator token.' };
  try {
    const response = await fetch(`${base()}/analytics?days=${days}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15000),
    });
    if (response.status === 401) return { error: 'That token was not accepted.' };
    if (!response.ok) return { error: `The server refused it (${response.status}).` };
    return (await response.json()) as Analytics;
  } catch {
    return { error: 'Could not reach the server.' };
  }
}

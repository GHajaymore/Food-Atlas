/**
 * Whether the reader is signed in, and how to change that.
 *
 * The app holds no account, no profile and no name from the provider — there is nothing
 * to keep, because nothing beyond "is there a session" is needed or collected. This
 * module is two booleans and two links.
 *
 * ## Why the app has to ask the server
 *
 * The session cookie is `HttpOnly`, so no script can read it. That is the point: a
 * cookie a script can read is a cookie an injected script can steal, and this one
 * decides whether a confirmation counts toward a badge. The cost is one small request.
 *
 * ## Why it matters before the form, not after
 *
 * A reader who writes three sentences about their grandmother's halwa and then discovers
 * it did not count has been wasted, and will reasonably not come back. `ConfirmForm`
 * asks this first so it can say, before anybody types, whether what they are about to
 * write will move the badge or sit beside it.
 */

import { PROPOSALS_URL } from '../domain/proposals';

export interface Session {
  /** Whether sign-in is configured on this deployment at all. */
  available: boolean;
  signedIn: boolean;
}

/** Nothing configured: the app behaves exactly as it did before accounts existed. */
export const NO_SESSION: Session = { available: false, signedIn: false };

const base = () => PROPOSALS_URL.replace(/\/+$/, '');

export async function loadSession(): Promise<Session> {
  try {
    const response = await fetch(`${base()}/auth/me`, {
      /* The whole question is about a cookie, so it has to be sent. */
      credentials: 'include',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return NO_SESSION;
    const body = (await response.json()) as Partial<Session>;
    return { available: body.available === true, signedIn: body.signedIn === true };
  } catch {
    /* Unreachable means unsigned-in, which is the safe direction: a confirmation made
       now is recorded as unverified rather than wrongly counted. */
    return NO_SESSION;
  }
}

/**
 * Full-page navigations, not fetches.
 *
 * OAuth is a redirect dance through a domain we do not control; it cannot happen inside
 * an XHR. Returning URLs rather than performing the navigation keeps this module free of
 * anything platform-specific.
 */
export const signInUrl = (): string => `${base()}/auth/google`;
export const signOutUrl = (): string => `${base()}/auth/google?logout=1`;

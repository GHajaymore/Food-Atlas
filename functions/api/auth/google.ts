/**
 * `GET /api/auth/google` — begin signing in.
 * `GET /api/auth/google?logout=1` — sign out.
 *
 * Redirects to Google, which sends the reader back to `/api/auth/callback`.
 *
 * ## The state parameter is not optional
 *
 * It is a random value put in a cookie and in the URL, and checked to match on the way
 * back. Without it, anybody can send somebody a crafted callback link and have their
 * browser complete a sign-in to an account the attacker controls — the reader then
 * confirms dishes as somebody else, and on this site a confirmation moves a badge.
 *
 * ## Scope is the minimum Google offers
 *
 * `openid` alone. Not email, not profile, not a name or a picture. All this needs is a
 * stable subject id to tell one account from another; asking for an address the app
 * would then have to store, protect and delete on request would be asking for a
 * liability in exchange for nothing.
 */

import { SESSION_COOKIE, clearedCookie, type AuthEnv } from './_session';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const STATE_COOKIE = 'wf_oauth';

export const onRequestGet: PagesFunction<AuthEnv> = async ({ request, env }) => {
  const url = new URL(request.url);

  if (url.searchParams.get('logout')) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/', 'Set-Cookie': clearedCookie() },
    });
  }

  if (!env.GOOGLE_CLIENT_ID || !env.IDENTITY_SECRET) {
    return json({ error: 'Sign-in is not configured on this site.' }, 503);
  }

  const state = crypto.randomUUID();
  const redirect = `${url.origin}/api/auth/callback`;

  const authorise = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authorise.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
  authorise.searchParams.set('redirect_uri', redirect);
  authorise.searchParams.set('response_type', 'code');
  authorise.searchParams.set('scope', 'openid');
  authorise.searchParams.set('state', state);
  /* No refresh token wanted: the session is thirty days and then they sign in again.
     A token we never use is a credential we would be storing for no reason. */
  authorise.searchParams.set('access_type', 'online');

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorise.toString(),
      /* Ten minutes — long enough to finish signing in, short enough that an abandoned
         attempt does not leave a usable state lying around. */
      'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/api/auth; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
    },
  });
};

/** Re-exported so the callback and the middleware agree on the name. */
export { SESSION_COOKIE };

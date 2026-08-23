/**
 * `GET /api/auth/callback` — Google sends the reader back here.
 *
 * Exchanges the one-time code for an id token, takes the subject out of it, and sets a
 * signed session cookie holding a salted hash of that subject. Nothing else from Google
 * is read and nothing else is kept.
 *
 * ## What is checked, and why each one matters
 *
 * - **The state cookie matches the state parameter.** Without it a crafted link signs a
 *   reader into somebody else's account, and on this site that means confirming dishes
 *   as them.
 * - **The token came from Google's token endpoint**, over TLS, in a server-to-server
 *   request carrying the client secret. That is what makes the response trustworthy; it
 *   is why the id token is not re-verified against Google's public keys here, which
 *   would be belt and braces on a direct exchange.
 * - **The issuer and audience inside the token.** Cheap, and it catches a
 *   misconfiguration where the credentials belong to a different project.
 *
 * ## The id token is decoded, not trusted blindly
 *
 * A JWT payload is base64url, not encryption. It is read for `sub`, `iss` and `aud` and
 * nothing else — no email, no name, no picture, because none was asked for and none
 * would be stored.
 */

import { accountIdFor, sessionCookie, sign, type AuthEnv } from './_session';
import { STATE_COOKIE } from './google';

const readCookie = (header: string | null, name: string): string => {
  for (const part of (header ?? '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return '';
};

/** A page rather than JSON: a person is looking at this, having just left Google. */
const say = (message: string, status = 400) =>
  new Response(
    `<!doctype html><meta charset="utf-8"><title>Sign in</title>` +
      `<body style="background:#161826;color:#e9e9ed;font:15px/1.5 system-ui;padding:48px">` +
      `<p>${message}</p><p><a style="color:#d9a441" href="/">Back to the atlas</a></p>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );

/** The payload of a JWT, without verifying it — see the header for why that is enough. */
function payloadOf(idToken: string): Record<string, unknown> | null {
  const part = idToken.split('.')[1];
  if (!part) return null;
  try {
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export const onRequestGet: PagesFunction<AuthEnv> = async ({ request, env }) => {
  const secret = env.IDENTITY_SECRET;
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !secret) {
    return say('Sign-in is not configured on this site.', 503);
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expected = readCookie(request.headers.get('Cookie'), STATE_COOKIE);

  if (url.searchParams.get('error')) return say('Sign-in was cancelled.');
  if (!code || !state || !expected || state !== expected) {
    return say('That sign-in link did not come from here. Nothing was changed.');
  }

  const body = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: `${url.origin}/api/auth/callback`,
    grant_type: 'authorization_code',
  });

  let idToken = '';
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return say('Google refused the sign-in. Nothing was changed.');
    idToken = String(((await response.json()) as { id_token?: unknown }).id_token ?? '');
  } catch {
    return say('Could not reach Google. Nothing was changed.', 502);
  }

  const payload = payloadOf(idToken);
  const subject = String(payload?.sub ?? '');
  const issuer = String(payload?.iss ?? '');
  const audience = String(payload?.aud ?? '');

  if (!subject) return say('Google did not identify the account. Nothing was changed.');
  if (!/^(https:\/\/)?accounts\.google\.com$/.test(issuer)) {
    return say('That token was not issued by Google. Nothing was changed.');
  }
  if (audience !== env.GOOGLE_CLIENT_ID) {
    return say('That token was issued for a different site. Nothing was changed.');
  }

  const account = await accountIdFor(subject, secret);
  const signature = await sign(account, secret);

  const headers = new Headers({ Location: '/' });
  headers.append('Set-Cookie', sessionCookie(account, signature));
  /* The state has done its job; leaving it usable would leave a replay available. */
  headers.append('Set-Cookie', `${STATE_COOKIE}=; Path=/api/auth; Max-Age=0; HttpOnly; Secure; SameSite=Lax`);

  return new Response(null, { status: 302, headers });
};

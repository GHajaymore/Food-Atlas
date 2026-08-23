/**
 * `GET /api/auth/me` — is this reader signed in?
 *
 * The session cookie is `HttpOnly`, which is what stops a script on the page reading it,
 * and also means the app cannot tell whether it exists. So it asks.
 *
 * Returns a boolean and nothing else. Not the account id, not a hash of it, not a
 * display name — there is no display name to return, because none was ever collected.
 * The client needs exactly one fact: whether a confirmation made now would count toward
 * a badge, so that the form can say so before somebody writes a paragraph.
 *
 * `available` says whether sign-in is configured at all, so the app can offer the
 * control only when it leads somewhere — the same rule the donate button and the
 * contribution form follow.
 */

import { accountFrom, type AuthEnv } from './_session';

export const onRequestGet: PagesFunction<AuthEnv> = async ({ request, env }) => {
  const available = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.IDENTITY_SECRET);
  const signedIn = available && Boolean(await accountFrom(request, env.IDENTITY_SECRET ?? ''));

  return new Response(JSON.stringify({ available, signedIn }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};

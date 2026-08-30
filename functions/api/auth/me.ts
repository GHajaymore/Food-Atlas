/**
 * `GET /api/auth/me` — is this reader signed in, and what may they do?
 *
 * The session cookie is `HttpOnly`, which is what stops a script on the page reading it,
 * and also means the app cannot tell whether it exists. So it asks.
 *
 * `available` says whether sign-in is configured at all, so the app can offer the
 * control only when it leads somewhere — the same rule the contribution form follows.
 *
 * ## Why it now returns more than a boolean
 *
 * It used to return `{available, signedIn}` and the header explained, at some length,
 * that returning anything else would be a profile the app had promised not to keep. Two
 * things changed that, and neither is a profile:
 *
 * **`role`.** Administration used to be a shared token, unrelated to being signed in.
 * Now it is a role on an account, so the app has to know whether *this* reader may see
 * the console — otherwise the only way to find out is to open it and be refused, which
 * is how a screen ends up showing an error to every ordinary reader who wanders in.
 *
 * **`account`.** Returned to the reader it belongs to, and to nobody else. There is no
 * email address in this system to invite somebody by, so the only handle an
 * administrator can be given is this hash: a person who wants access signs in, reads it
 * off `/admin`, and sends it over. Handing somebody their own identifier is not a
 * disclosure — it is the value already sitting in their own cookie.
 *
 * `role` is read from `account_role`, which holds a row only for administrators. An
 * ordinary reader signing in still creates no record anywhere; this endpoint asks a
 * question about them and stores nothing.
 */

import { roleOf } from '../_admin';
import { accountFrom, type AuthEnv } from './_session';

interface Env extends AuthEnv {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const available = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.IDENTITY_SECRET);
  const account = available ? await accountFrom(request, env.IDENTITY_SECRET ?? '') : '';
  const signedIn = Boolean(account);

  return new Response(
    JSON.stringify({
      available,
      signedIn,
      account,
      role: signedIn ? await roleOf(env.DB, account) : 'user',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    },
  );
};

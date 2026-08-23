/**
 * Who is asking.
 *
 * Every endpoint under `/api` runs through this first. Its whole job is to put a stable
 * `personId` on the request, because the two indexes the Authentic badge rests on —
 * one confirmation per person, and no confirming your own proposal — are meaningless
 * without one.
 *
 * ## What this identity is actually worth, stated plainly
 *
 * It is a signed cookie. The server mints a random id, HMACs it so it cannot be forged
 * or guessed, and sets it `HttpOnly` so no script on the page can read or change it.
 *
 * That stops the things people do by accident and the things they do casually: a
 * double-tap, a refresh, an enthusiastic supporter confirming the same dish three times
 * from the same browser, and anyone editing a cookie by hand. It does **not** stop
 * somebody who opens a private window three times. Clearing storage issues a new
 * identity, and nothing here can tell that apart from a new person.
 *
 * That limit is deliberate rather than unfinished, and it is the same trade
 * `confirmations.ts` already documents: the alternative is an account, and requiring
 * one excludes precisely the people this depends on — a grandmother in Kozhikode is not
 * creating a login to confirm a halwa. The atlas would gain a defensible number and
 * lose the person who knows the dish.
 *
 * **So the real defence is not this file.** It is that every confirmation is displayed
 * with the connection its author claimed, so three fabrications have to be three
 * convincing pieces of writing rather than three clicks — and a reader can weigh them.
 * `docs/proposals-api.md` says the same thing about what identity does not solve.
 *
 * If the badge ever needs to be defensible against somebody determined, the seam is
 * here and nowhere else: replace `personId` with a subject from an OAuth provider and
 * every index above keeps working unchanged. Google sign-in is free and would do it.
 * It is not done today because the cost is paid by the contributor, not by us.
 */

interface Env {
  DB: D1Database;
  /** Signing key. `npx wrangler secret put IDENTITY_SECRET`. Never in the repo. */
  IDENTITY_SECRET?: string;
}

/**
 * What the middleware puts on every request under `/api`.
 *
 * Extends `Record<string, unknown>` because that is what `PagesFunction` requires of its
 * data parameter — Cloudflare treats `context.data` as an open bag that any middleware
 * in the chain may add to, and a closed interface cannot satisfy it.
 */
export interface Identity extends Record<string, unknown> {
  personId: string;
}

const COOKIE = 'wf_id';
/** A year. Long enough that a returning reader is still the same person to us. */
const MAX_AGE = 60 * 60 * 24 * 365;

const enc = new TextEncoder();

const hex = (buffer: ArrayBuffer): string =>
  [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
  return hex(await crypto.subtle.sign('HMAC', key, enc.encode(value)));
}

/**
 * Compare without leaking where two strings first differ.
 *
 * A plain `===` on an HMAC returns fractionally sooner on a wrong first byte, and that
 * is enough to forge a signature one byte at a time given enough attempts. Cheap to
 * avoid, unbounded to get wrong.
 */
function sameSignature(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const readCookie = (header: string | null, name: string): string => {
  for (const part of (header ?? '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return '';
};

export const onRequest: PagesFunction<Env, string, Identity> = async (context) => {
  const secret = context.env.IDENTITY_SECRET;

  /*
   * No secret, no writes. Falling back to an unsigned id would mean anyone could hand
   * us any identity, which quietly turns both unique indexes into decoration — the
   * failure would be invisible and the badge would keep displaying. Refusing loudly is
   * the only safe direction to fail in.
   */
  if (!secret) {
    return new Response(JSON.stringify({ error: 'Server is not configured for writes.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const raw = readCookie(context.request.headers.get('Cookie'), COOKIE);
  const [id, signature] = raw.split('.');

  let personId = '';
  if (id && signature && sameSignature(await sign(id, secret), signature)) {
    personId = id;
  }

  const minted = !personId;
  if (minted) personId = crypto.randomUUID();

  context.data.personId = personId;

  const response = await context.next();

  if (minted) {
    const value = `${personId}.${await sign(personId, secret)}`;
    /*
     * Scoped to `/api/proposals`, not to `/`.
     *
     * This middleware used to sit at `functions/api/` and the cookie was set on the
     * whole site, so every request the app ever made — including the analytics beacon
     * added later — carried an identifier the server could have correlated against.
     * Nothing did correlate them, but "nothing does" is a promise about today's code,
     * and the app tells readers in four places that it does not track them.
     *
     * Moved here, the guarantee is structural instead: an event request is not under
     * this path, so the browser does not send the cookie, so no code that might be
     * written later can join a page view to a person. The only requests that carry an
     * identity are the two that genuinely need one — confirming, and proposing — where
     * the whole authenticity model rests on one-person-one-confirmation.
     */
    response.headers.append(
      'Set-Cookie',
      `${COOKIE}=${value}; Path=/api/proposals; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
    );
  }

  return response;
};

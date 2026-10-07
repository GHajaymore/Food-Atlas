/**
 * One identity, two places that need one.
 *
 * `proposals/_middleware.ts` has minted and verified a signed browser identity since
 * proposals shipped, and record confirmations need exactly the same thing for exactly
 * the same reason — the unique index that makes "3 confirmations" mean three people.
 * The crypto is here so there is one copy of it: a second hand-written HMAC is a second
 * chance to get a signature comparison subtly wrong, and that failure is silent.
 *
 * ## What this identity is worth, stated plainly
 *
 * It is a signed cookie. The server mints a random id, HMACs it so it cannot be forged
 * or guessed, and sets it `HttpOnly` so no script on the page can read or change it.
 * That stops a double-tap, a refresh, an enthusiastic reader confirming the same dish
 * three times from one browser, and anyone editing a cookie by hand. It does **not**
 * stop somebody opening three private windows, and nothing here pretends otherwise —
 * see `docs/confirmations-api.md` and the note in `domain/confirmations.ts`.
 *
 * ## Why the path matters
 *
 * Each caller passes its own cookie name and path, and both are narrow on purpose. An
 * identity cookie scoped to `/` would ride along on every request the app makes,
 * including the analytics beacon, and the app tells readers in four places that it does
 * not track them. Scoped to the one path that needs it, the browser simply does not send
 * it anywhere else, which makes the promise structural rather than a description of
 * today's code.
 */

import { accountFrom } from './auth/_session';

export interface IdentityEnv {
  /** Signing key. `npx wrangler pages secret put IDENTITY_SECRET`. Never in the repo. */
  IDENTITY_SECRET?: string;
}

/**
 * What the middleware puts on every request beneath it.
 *
 * Extends `Record<string, unknown>` because that is what `PagesFunction` requires of its
 * data parameter — Cloudflare treats `context.data` as an open bag any middleware in the
 * chain may add to, and a closed interface cannot satisfy it.
 */
export interface Identity extends Record<string, unknown> {
  personId: string;
  /**
   * The signed-in account, or empty.
   *
   * Separate from personId rather than replacing it, because they answer different
   * questions: personId stops the same browser confirming twice, and this decides
   * whether a confirmation counts toward a badge at all. A reader may have one, both or
   * neither, and a confirmation endpoint needs to know which.
   */
  accountId: string;
}

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

/**
 * The middleware itself, bound to one cookie on one path.
 *
 * Refuses loudly with a 503 when no secret is configured. Falling back to an unsigned id
 * would mean anyone could hand us any identity, which quietly turns the unique index
 * into decoration — the failure would be invisible and the badge would keep displaying.
 */
export const identityOn = <Env extends IdentityEnv>(cookie: string, path: string): PagesFunction<Env, string, Identity> =>
  async (context) => {
    const secret = context.env.IDENTITY_SECRET;

    if (!secret) {
      return new Response(JSON.stringify({ error: 'Server is not configured for writes.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const raw = readCookie(context.request.headers.get('Cookie'), cookie);
    const [id, signature] = raw.split('.');

    let personId = '';
    if (id && signature && sameSignature(await sign(id, secret), signature)) {
      personId = id;
    }

    const minted = !personId;
    if (minted) personId = crypto.randomUUID();

    context.data.personId = personId;
    context.data.accountId = await accountFrom(context.request, secret);

    const response = await context.next();

    if (minted) {
      const value = `${personId}.${await sign(personId, secret)}`;
      response.headers.append(
        'Set-Cookie',
        `${cookie}=${value}; Path=${path}; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
      );
    }

    return response;
  };

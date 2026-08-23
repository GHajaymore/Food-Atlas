/**
 * Is this request from the administrator?
 *
 * Extracted when a second endpoint needed it. Two copies of an authorisation check is
 * how one of them ends up subtly weaker than the other — usually the one added later,
 * usually by someone in a hurry, and the failure is silent because both keep returning
 * 200 to the person holding the token.
 */

export interface AdminEnv {
  /** `npx wrangler pages secret put ADMIN_TOKEN`. Never in the repo. */
  ADMIN_TOKEN?: string;
}

/**
 * Compare without leaking where two strings first differ.
 *
 * A plain `===` returns fractionally sooner on a wrong first byte, which is enough to
 * recover a secret one byte at a time given enough attempts. Cheap to avoid, unbounded
 * to get wrong.
 */
function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * A short, stable fingerprint of the token, for the audit trail.
 *
 * The token itself must never be written anywhere — an audit log that leaks the
 * credential it audits is worse than no audit log. Eight hex characters distinguishes
 * two administrators and reconstructs nothing.
 */
export async function fingerprint(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return [...new Uint8Array(digest)]
    .slice(0, 4)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export type Admin = { ok: true; token: string; by: string } | { ok: false; response: Response };

const refuse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/**
 * Authorise, or hand back the refusal to return.
 *
 * With `ADMIN_TOKEN` unset every administrative write is refused rather than allowed.
 * The opposite — treating "no token configured" as "no authorisation required" — is the
 * classic way a staging default reaches production, and it fails open: the endpoint
 * looks like it is working right up until somebody finds it.
 */
export async function admin(request: Request, env: AdminEnv): Promise<Admin> {
  if (!env.ADMIN_TOKEN) {
    return { ok: false, response: refuse({ error: 'No administrator is configured.' }, 503) };
  }

  const offered = (request.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!offered || !same(offered, env.ADMIN_TOKEN)) {
    return { ok: false, response: refuse({ error: 'Not authorised.' }, 401) };
  }

  return { ok: true, token: offered, by: await fingerprint(offered) };
}

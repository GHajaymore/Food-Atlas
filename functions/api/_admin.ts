/**
 * Is this request from an administrator?
 *
 * Extracted when a second endpoint needed it. Two copies of an authorisation check is
 * how one of them ends up subtly weaker than the other — usually the one added later,
 * usually by someone in a hurry, and the failure is silent because both keep returning
 * 200 to the person holding the token.
 *
 * ## Two ways in, and they are not equals
 *
 * **A signed-in account holding `owner` or `admin`.** The ordinary path, and the one
 * Ajay asked for: authority belongs to a person who signed in, can be granted, and can
 * be withdrawn. The audit trail then records *which* administrator acted rather than
 * that somebody holding the shared string did. This function does not separate the two
 * tiers — both may use the console — and hands back `role` for the one endpoint where
 * the difference decides the answer.
 *
 * **`ADMIN_TOKEN`.** Kept, deliberately, and reduced to two jobs: claiming the owner
 * seat on a database where `account_role` is empty, and getting back into the console if
 * the owner account is ever lost. Removing it entirely would make a lost Google account
 * an unrecoverable outage; leaving it as an everyday credential would make the roles
 * beside it decorative. So it stays, it cannot appoint anybody once an owner exists, and
 * `via` records which door was used.
 *
 * Note the order below: the session is tried first. A request that carries both a
 * session and a token is attributed to the person, not the secret, because that is the
 * more specific fact and the more useful audit line.
 */

import { accountFrom } from './auth/_session';

export interface AdminEnv {
  /** `npx wrangler pages secret put ADMIN_TOKEN`. Never in the repo. */
  ADMIN_TOKEN?: string;
  /** Signs the session cookie. Without it a session cannot be verified at all. */
  IDENTITY_SECRET?: string;
  /** Roles live in `account_role`. */
  DB: D1Database;
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

/**
 * The three tiers. `user` is the absence of a row, not a row saying so.
 *
 * Ordered by authority and not by name: owner appoints, admin operates, user reads. The
 * gap that matters is between `user` and the other two — that is the one the console
 * turns on — and the gap between owner and admin decides exactly one thing, which is who
 * may hand the role to somebody else.
 */
export type Role = 'owner' | 'admin' | 'user';

/**
 * What this account may do.
 *
 * Exported because the roles endpoint and `/api/auth/me` both need the answer without
 * wanting the refusal machinery around it.
 */

export async function roleOf(db: D1Database, account: string): Promise<Role> {
  if (!account) return 'user';
  const row = await db.prepare(`select role from account_role where id = ?`).bind(account).first<{ role: string }>();
  /* Matched against the two known strings rather than cast. A value that is neither —
     from a hand-edited row, or a tier some later migration adds that this build has
     never heard of — must read as 'user'. Unknown means unprivileged, in that direction
     only. */
  return row?.role === 'owner' ? 'owner' : row?.role === 'admin' ? 'admin' : 'user';
}

/** The owner's account id, or empty on a database where the seat is unclaimed. */
export async function ownerId(db: D1Database): Promise<string> {
  const row = await db.prepare(`select id from account_role where role = 'owner'`).first<{ id: string }>();
  return row?.id ?? '';
}

export type Admin =
  | { ok: true; by: string; via: 'session' | 'token'; account: string; role: Role }
  | { ok: false; response: Response };

const refuse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/**
 * Authorise, or hand back the refusal to return.
 *
 * With nothing configured every administrative write is refused rather than allowed. The
 * opposite — treating "no administrator configured" as "no authorisation required" — is
 * the classic way a staging default reaches production, and it fails open: the endpoint
 * looks like it is working right up until somebody finds it.
 */
export async function admin(request: Request, env: AdminEnv): Promise<Admin> {
  /* The person, if there is one. */
  if (env.IDENTITY_SECRET) {
    const account = await accountFrom(request, env.IDENTITY_SECRET);
    const role = account ? await roleOf(env.DB, account) : 'user';
    if (role !== 'user') {
      /* Eight characters of the account id, for the same reason the token is
         fingerprinted rather than logged: enough to tell two administrators apart in the
         moderation record, not enough to be a credential if that record is ever read. */
      return { ok: true, by: account.slice(0, 8), via: 'session', account, role };
    }
  }

  /* Otherwise the secret, which is bootstrap and break-glass rather than a login. */
  const offered = (request.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (env.ADMIN_TOKEN && offered && same(offered, env.ADMIN_TOKEN)) {
    /* The token reaches the console; it is not the owner and does not claim to be.
       What it may additionally do is settled at the roles endpoint, which is the only
       place the distinction decides anything. */
    return { ok: true, by: await fingerprint(offered), via: 'token', account: '', role: 'admin' };
  }

  if (!env.ADMIN_TOKEN && !env.IDENTITY_SECRET) {
    return { ok: false, response: refuse({ error: 'No administrator is configured.' }, 503) };
  }
  return { ok: false, response: refuse({ error: 'Not authorised.' }, 401) };
}

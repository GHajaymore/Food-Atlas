/**
 * `GET    /api/admin/roles` — who runs this site.
 * `POST   /api/admin/roles` — appoint an administrator. Owner only.
 * `DELETE /api/admin/roles` — remove one. Owner only.
 *
 * ## Who has the authority to create a role
 *
 * The chain starts outside the database and ends inside it.
 *
 * **Whoever can set `ADMIN_TOKEN`** — one person, holding a Cloudflare secret — is the
 * root of it. On a database where the owner seat is empty, that token is the only thing
 * that can fill it, and it can only fill it with *the account making the request*: sign
 * in, then `POST` with the token from the same browser. It cannot appoint a third party,
 * because at bootstrap there is nobody to vouch for one.
 *
 * **After that the owner appoints administrators**, and nobody else can. An admin may
 * use the console — settings, moderation, the refresh queue, analytics — and may not
 * pass the role on. That restriction is the entire reason the two tiers are separate; if
 * an admin could appoint admins, there would be one tier wearing two names.
 *
 * **The token stops being able to appoint** the moment an owner exists. It still reaches
 * the console, because losing the owner account should be recoverable, but an
 * appointment ought to appear in `granted_by` as the act of a person rather than of a
 * shared string.
 *
 * Three rules are enforced here rather than trusted to good behaviour:
 *
 *   * **No self-promotion.** A `user` cannot leave `user`, with or without a session.
 *     The only path from nothing to something is the owner, or the token at bootstrap.
 *   * **The owner cannot be removed.** Not by an admin, and not by the owner. Handing the
 *     seat on is a transfer, not a deletion followed by hope.
 *   * **Only the owner writes.** Read is open to anybody who may use the console, so an
 *     admin can see who else has access; writing is the owner's alone.
 *
 * ## Why an account id and not an email address
 *
 * There is no email address to use. The app asks Google for `openid` and nothing else,
 * and keeps a salted one-way hash — so the only handle somebody can be appointed by is
 * that hash. A person wanting access signs in, reads their account id off `/admin`, and
 * sends it over. Clumsier than an invitation email, and it is the price of a database
 * that cannot identify anybody it has not been told to.
 */

import { admin, ownerId, roleOf, type AdminEnv } from '../_admin';
import { accountFrom } from '../auth/_session';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** The shape `accountIdFor` produces: 32 lowercase hex characters, and nothing else. */
const ACCOUNT_ID = /^[0-9a-f]{32}$/;

export const onRequestGet: PagesFunction<AdminEnv> = async ({ request, env }) => {
  const who = await admin(request, env);
  if (!who.ok) return who.response;

  const rows = await env.DB.prepare(
    `select id, role, granted_by, granted from account_role order by role asc, granted asc`,
  ).all<{ id: string; role: string; granted_by: string; granted: string }>();

  return json({
    /* `you` lets the screen mark the reader's own row, so a removal aimed at somebody
       else cannot be aimed at yourself by accident. Empty when the break-glass token was
       used, which is honest: the token is not an account. */
    you: who.account,
    via: who.via,
    /* What the screen needs to decide whether to draw the appointment controls at all. A
       button that exists only to return 403 is a worse answer than no button. */
    mayAppoint: who.role === 'owner',
    people: rows.results ?? [],
  });
};

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  const who = await admin(request, env);
  if (!who.ok) return who.response;

  let body: { account?: unknown };
  try {
    body = (await request.json()) as { account?: unknown };
  } catch {
    return json({ error: 'Could not read that.' }, 400);
  }

  const owner = await ownerId(env.DB);

  /*
   * Bootstrap: the token claims the owner seat for the requester, and only the requester.
   *
   * `who.account` is empty when the token was used, so the session is read here rather
   * than taken from the guard — the token proves authority, the cookie says who is
   * claiming it, and both are needed. Without a session there is nothing to promote, and
   * a request that would silently do nothing is worth refusing loudly.
   */
  if (!owner) {
    if (who.via !== 'token') {
      /* Unreachable while the table is empty — with no owner there is no privileged
         session to arrive with — and stated anyway, because "unreachable" is a property
         of today's code and this is a property of the rule. */
      return json({ error: 'The owner seat is claimed with the administrator token.' }, 403);
    }
    const self = env.IDENTITY_SECRET ? await accountFrom(request, env.IDENTITY_SECRET) : '';
    if (!self) {
      return json(
        { error: 'Sign in first, then claim the owner seat with the token in the same browser.' },
        409,
      );
    }
    await env.DB.prepare(`insert into account_role (id, role, granted_by) values (?, 'owner', 'bootstrap')`)
      .bind(self)
      .run();
    return json({ granted: self, role: 'owner', by: 'bootstrap' }, 201);
  }

  if (who.role !== 'owner') {
    return json({ error: 'Only the owner can appoint an administrator.' }, 403);
  }

  const account = String(body.account ?? '').trim().toLowerCase();
  if (!ACCOUNT_ID.test(account)) {
    return json({ error: 'That is not an account id.' }, 400);
  }
  if (account === owner) {
    return json({ error: 'That is the owner, who already has everything an admin has.' }, 409);
  }
  if ((await roleOf(env.DB, account)) === 'admin') {
    return json({ error: 'That account is already an administrator.' }, 409);
  }

  await env.DB.prepare(`insert into account_role (id, role, granted_by) values (?, 'admin', ?)`)
    .bind(account, who.account)
    .run();

  return json({ granted: account, role: 'admin', by: who.account }, 201);
};

export const onRequestDelete: PagesFunction<AdminEnv> = async ({ request, env }) => {
  const who = await admin(request, env);
  if (!who.ok) return who.response;

  if (who.role !== 'owner') {
    return json({ error: 'Only the owner can remove an administrator.' }, 403);
  }

  const account = String(new URL(request.url).searchParams.get('account') ?? '')
    .trim()
    .toLowerCase();
  if (!ACCOUNT_ID.test(account)) return json({ error: 'That is not an account id.' }, 400);

  const role = await roleOf(env.DB, account);

  /* Checked before the not-an-administrator case, so that trying to remove the owner
     says why rather than reporting them as missing. */
  if (role === 'owner') {
    return json({ error: 'The owner cannot be removed.' }, 409);
  }
  if (role !== 'admin') {
    return json({ error: 'That account is not an administrator.' }, 404);
  }

  await env.DB.prepare(`delete from account_role where id = ? and role = 'admin'`).bind(account).run();
  return json({ revoked: account, by: who.account });
};

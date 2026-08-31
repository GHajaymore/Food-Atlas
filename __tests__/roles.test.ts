/**
 * Who may do what, asserted against the real guard and the real endpoint.
 *
 * Authorisation is the one part of this app where being *nearly* right is
 * indistinguishable from being right until somebody finds the gap. Every rule below is
 * one sentence in a comment somewhere; a comment does not fail when the code stops
 * matching it, and these do.
 *
 * ## The fake database
 *
 * D1 is not available in Jest, so `db()` is a small stand-in that understands only the
 * handful of statements these modules actually issue, matched on their text. That is
 * brittle by construction and deliberately so: a query that changes shape stops being
 * recognised and the test fails loudly, rather than a mock quietly answering something
 * plausible to a statement nobody re-read.
 */

import { admin, ownerId, roleOf, type AdminEnv } from '../functions/api/_admin';
import { onRequestDelete, onRequestPost, onRequestPut } from '../functions/api/admin/roles';
import { newSessionCookie } from '../functions/api/auth/_session';

const SECRET = 'a-test-secret-that-is-not-the-real-one';
const TOKEN = 'a-test-admin-token';

const OWNER = 'a'.repeat(32);
const ADMIN = 'b'.repeat(32);
const STRANGER = 'c'.repeat(32);

type Row = { id: string; role: string; granted_by: string; granted: string };

/** Just enough D1 to run `account_role`, and no more. */
function db(rows: Row[] = []) {
  const store = [...rows];
  const database = {
    rows: store,
    async batch(statements: { run(): Promise<unknown> }[]) {
      const out = [];
      for (const statement of statements) out.push(await statement.run());
      return out;
    },
    prepare(sql: string) {
      const text = sql.replace(/\s+/g, ' ').trim();
      let args: unknown[] = [];
      const statement = {
        bind(...values: unknown[]) {
          args = values;
          return statement;
        },
        async first<T>(): Promise<T | null> {
          if (text.startsWith('select role from account_role where id = ?')) {
            return (store.find((r) => r.id === args[0]) as T) ?? null;
          }
          if (text.startsWith("select id from account_role where role = 'owner'")) {
            return (store.find((r) => r.role === 'owner') as T) ?? null;
          }
          throw new Error('unrecognised first(): ' + text);
        },
        async all<T>(): Promise<{ results: T[] }> {
          if (text.startsWith('select id, role, granted_by, granted from account_role')) {
            return { results: store as T[] };
          }
          throw new Error('unrecognised all(): ' + text);
        },
        async run() {
          if (text.startsWith('update account_role set role')) {
            const [grantedBy, id] = args as string[];
            const row = store.find((r) => r.id === id);
            if (row) {
              row.role = 'admin';
              row.granted_by = grantedBy;
            }
            return { meta: { changes: row ? 1 : 0 } };
          }
          if (text.startsWith('insert into account_role') && text.includes('on conflict')) {
            const [id, grantedBy] = args as string[];
            const existing = store.find((r) => r.id === id);
            if (existing) {
              existing.role = 'owner';
              existing.granted_by = grantedBy;
            } else {
              store.push({ id, role: 'owner', granted_by: grantedBy, granted: '2026-08-30 00:00:00' });
            }
            return { meta: { changes: 1 } };
          }
          if (text.startsWith('insert into account_role')) {
            const [id, second] = args as string[];
            const role = text.includes("'owner'") ? 'owner' : 'admin';
            const grantedBy = text.includes("'bootstrap'") ? 'bootstrap' : second;
            if (store.some((r) => r.id === id)) throw new Error('primary key conflict');
            if (role === 'owner' && store.some((r) => r.role === 'owner')) {
              throw new Error('unique index account_role_one_owner');
            }
            store.push({ id, role, granted_by: grantedBy, granted: '2026-08-29 00:00:00' });
            return { meta: { changes: 1 } };
          }
          if (text.startsWith('delete from account_role where id = ?')) {
            const at = store.findIndex((r) => r.id === args[0] && r.role === 'admin');
            if (at >= 0) store.splice(at, 1);
            return { meta: { changes: at >= 0 ? 1 : 0 } };
          }
          throw new Error('unrecognised run(): ' + text);
        },
      };
      return statement;
    },
  };
  return database as unknown as D1Database & { rows: Row[] };
}

const env = (database: D1Database, over: Partial<AdminEnv> = {}): AdminEnv =>
  ({ DB: database, ADMIN_TOKEN: TOKEN, IDENTITY_SECRET: SECRET, ...over }) as AdminEnv;

/** A request signed in as `account`, optionally also carrying the break-glass token. */
async function as(account: string, extra: { token?: string; method?: string; body?: unknown; url?: string } = {}) {
  const headers: Record<string, string> = {};
  if (account) {
    const cookie = await newSessionCookie(account, SECRET);
    headers.Cookie = cookie.split(';')[0];
  }
  if (extra.token) headers.Authorization = `Bearer ${extra.token}`;
  if (extra.body !== undefined) headers['Content-Type'] = 'application/json';
  return new Request(extra.url ?? 'https://example.test/api/admin/roles', {
    method: extra.method ?? 'GET',
    headers,
    body: extra.body === undefined ? undefined : JSON.stringify(extra.body),
  });
}

const owned = () => db([{ id: OWNER, role: 'owner', granted_by: 'bootstrap', granted: '2026-08-01 00:00:00' }]);

describe('a role is what the database says, and nothing else', () => {
  it('calls an account with no row a user', async () => {
    expect(await roleOf(db(), STRANGER)).toBe('user');
  });

  it('reads owner and admin back', async () => {
    const store = db([
      { id: OWNER, role: 'owner', granted_by: 'bootstrap', granted: '' },
      { id: ADMIN, role: 'admin', granted_by: OWNER, granted: '' },
    ]);
    expect(await roleOf(store, OWNER)).toBe('owner');
    expect(await roleOf(store, ADMIN)).toBe('admin');
    expect(await ownerId(store)).toBe(OWNER);
  });

  /*
   * The direction that matters. A role this build has never heard of — a hand-edited row,
   * or a tier some later migration adds — has to read as `user`. Anything else means a
   * future migration could grant privilege to a string nobody checked.
   */
  it('treats a role it does not recognise as a user, not as privilege', async () => {
    const store = db([{ id: STRANGER, role: 'superuser', granted_by: OWNER, granted: '' }]);
    expect(await roleOf(store, STRANGER)).toBe('user');
  });

  it('has no owner on a database where the seat was never claimed', async () => {
    expect(await ownerId(db())).toBe('');
  });
});

describe('the guard lets in exactly two kinds of request', () => {
  it('admits a signed-in owner, and says it was the session', async () => {
    const result = await admin(await as(OWNER), env(owned()));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.via).toBe('session');
      expect(result.role).toBe('owner');
      expect(result.account).toBe(OWNER);
    }
  });

  it('admits a signed-in admin', async () => {
    const store = db([{ id: ADMIN, role: 'admin', granted_by: OWNER, granted: '' }]);
    const result = await admin(await as(ADMIN), env(store));
    expect(result.ok && result.role).toBe('admin');
  });

  it('refuses a signed-in reader with no role', async () => {
    const result = await admin(await as(STRANGER), env(owned(), { ADMIN_TOKEN: undefined }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.response.status).toBe(401);
  });

  it('admits the break-glass token', async () => {
    const result = await admin(await as('', { token: TOKEN }), env(owned()));
    expect(result.ok && result.via).toBe('token');
  });

  it('refuses a wrong token', async () => {
    const result = await admin(await as('', { token: 'not-it' }), env(owned()));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.response.status).toBe(401);
  });

  /* Misconfiguration fails closed. The opposite — no administrator configured meaning no
     authorisation required — is how a staging default reaches production. */
  it('refuses everything when nothing is configured', async () => {
    const result = await admin(await as('', { token: TOKEN }), {
      DB: db(),
      ADMIN_TOKEN: undefined,
      IDENTITY_SECRET: undefined,
    } as AdminEnv);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.response.status).toBe(503);
  });

  /* Attribution: a request carrying both is the person, because that is the more specific
     fact and the more useful line in the moderation record. */
  it('attributes a request carrying both to the person, not the secret', async () => {
    const result = await admin(await as(OWNER, { token: TOKEN }), env(owned()));
    expect(result.ok && result.via).toBe('session');
  });
});

describe('who may create a role', () => {
  const call = async (request: Request, database: D1Database) =>
    (await onRequestPost({ request, env: env(database) } as never)) as Response;

  it('lets the token claim the owner seat for the account it is signed in as', async () => {
    const store = db();
    const response = await call(await as(OWNER, { token: TOKEN, method: 'POST', body: {} }), store);
    expect(response.status).toBe(201);
    expect(await roleOf(store, OWNER)).toBe('owner');
  });

  /* The token proves authority; the cookie says who is claiming it. Neither alone is
     enough, or the secret would be an account rather than a key. */
  it('will not claim the seat for nobody', async () => {
    const store = db();
    const response = await call(await as('', { token: TOKEN, method: 'POST', body: {} }), store);
    expect(response.status).toBe(409);
    expect(await ownerId(store)).toBe('');
  });

  it('will not let the token appoint anybody once an owner exists', async () => {
    const store = owned();
    const response = await call(
      await as('', { token: TOKEN, method: 'POST', body: { account: STRANGER } }),
      store,
    );
    expect(response.status).toBe(403);
    expect(await roleOf(store, STRANGER)).toBe('user');
  });

  it('lets the owner appoint an administrator', async () => {
    const store = owned();
    const response = await call(await as(OWNER, { method: 'POST', body: { account: ADMIN } }), store);
    expect(response.status).toBe(201);
    expect(await roleOf(store, ADMIN)).toBe('admin');
  });

  /* The entire reason the two tiers are separate. If an admin could appoint admins there
     would be one tier wearing two names. */
  it('does not let an administrator appoint another administrator', async () => {
    const store = db([
      { id: OWNER, role: 'owner', granted_by: 'bootstrap', granted: '' },
      { id: ADMIN, role: 'admin', granted_by: OWNER, granted: '' },
    ]);
    const response = await call(await as(ADMIN, { method: 'POST', body: { account: STRANGER } }), store);
    expect(response.status).toBe(403);
    expect(await roleOf(store, STRANGER)).toBe('user');
  });

  it('does not let a reader promote themselves', async () => {
    const store = owned();
    const response = await call(await as(STRANGER, { method: 'POST', body: { account: STRANGER } }), store);
    expect(response.status).toBe(401);
    expect(await roleOf(store, STRANGER)).toBe('user');
  });

  it('refuses anything that is not an account id', async () => {
    const store = owned();
    for (const account of ['', 'nope', OWNER.slice(0, 31), OWNER + 'd', 'Z'.repeat(32)]) {
      const response = await call(await as(OWNER, { method: 'POST', body: { account } }), store);
      expect(response.status).toBe(400);
    }
  });
});

describe('who may remove one', () => {
  const call = async (request: Request, database: D1Database) =>
    (await onRequestDelete({ request, env: env(database) } as never)) as Response;

  const url = (account: string) => `https://example.test/api/admin/roles?account=${account}`;

  const withAdmin = () =>
    db([
      { id: OWNER, role: 'owner', granted_by: 'bootstrap', granted: '' },
      { id: ADMIN, role: 'admin', granted_by: OWNER, granted: '' },
    ]);

  it('lets the owner remove an administrator', async () => {
    const store = withAdmin();
    const response = await call(await as(OWNER, { method: 'DELETE', url: url(ADMIN) }), store);
    expect(response.status).toBe(200);
    expect(await roleOf(store, ADMIN)).toBe('user');
  });

  /* Handing the seat on is a transfer, not a deletion followed by hope. Without this rule
     one careless click leaves a console reachable only by whoever can edit Cloudflare
     secrets, which is recovery by outage. */
  it('will not remove the owner, even at the owner’s own request', async () => {
    const store = withAdmin();
    const response = await call(await as(OWNER, { method: 'DELETE', url: url(OWNER) }), store);
    expect(response.status).toBe(409);
    expect(await roleOf(store, OWNER)).toBe('owner');
  });

  it('does not let an administrator remove anybody', async () => {
    const store = withAdmin();
    const response = await call(await as(ADMIN, { method: 'DELETE', url: url(ADMIN) }), store);
    expect(response.status).toBe(403);
    expect(await roleOf(store, ADMIN)).toBe('admin');
  });

  it('says so when the target holds no role', async () => {
    const store = withAdmin();
    const response = await call(await as(OWNER, { method: 'DELETE', url: url(STRANGER) }), store);
    expect(response.status).toBe(404);
  });
});

describe('handing the owner seat on', () => {
  const call = async (request: Request, database: D1Database) =>
    (await onRequestPut({ request, env: env(database) } as never)) as Response;

  const withAdmin = () =>
    db([
      { id: OWNER, role: 'owner', granted_by: 'bootstrap', granted: '' },
      { id: ADMIN, role: 'admin', granted_by: OWNER, granted: '' },
    ]);

  /*
   * The reason this endpoint exists. The seat was a dead end — the owner could not be
   * removed and the token could not appoint once one existed — so an owner who lost or
   * left their Google account took the atlas's only appointing authority with them.
   */
  it('moves the seat, and keeps the outgoing owner as an administrator', async () => {
    const store = withAdmin();
    const response = await call(await as(OWNER, { method: 'PUT', body: { account: STRANGER } }), store);
    expect(response.status).toBe(200);
    expect(await roleOf(store, STRANGER)).toBe('owner');
    expect(await roleOf(store, OWNER)).toBe('admin');
    expect(await ownerId(store)).toBe(STRANGER);
  });

  it('promotes an existing administrator without leaving a second row', async () => {
    const store = withAdmin();
    await call(await as(OWNER, { method: 'PUT', body: { account: ADMIN } }), store);
    expect(await roleOf(store, ADMIN)).toBe('owner');
    expect(store.rows.filter((r) => r.id === ADMIN)).toHaveLength(1);
  });

  /* One owner is a schema guarantee, not an endpoint promise. If this ever counts two,
     the partial unique index is the thing that has been broken. */
  it('never leaves the atlas with two owners or none', async () => {
    const store = withAdmin();
    await call(await as(OWNER, { method: 'PUT', body: { account: STRANGER } }), store);
    expect(store.rows.filter((r) => r.role === 'owner')).toHaveLength(1);
  });

  it('does not let an administrator hand on a seat they do not hold', async () => {
    const store = withAdmin();
    const response = await call(await as(ADMIN, { method: 'PUT', body: { account: STRANGER } }), store);
    expect(response.status).toBe(403);
    expect(await ownerId(store)).toBe(OWNER);
  });

  it('does not let the break-glass token hand the seat on', async () => {
    const store = withAdmin();
    const response = await call(
      await as('', { token: TOKEN, method: 'PUT', body: { account: STRANGER } }),
      store,
    );
    expect(response.status).toBe(403);
    expect(await ownerId(store)).toBe(OWNER);
  });

  it('refuses a handover to the account already holding it', async () => {
    const store = withAdmin();
    const response = await call(await as(OWNER, { method: 'PUT', body: { account: OWNER } }), store);
    expect(response.status).toBe(409);
    expect(await ownerId(store)).toBe(OWNER);
  });

  it('refuses anything that is not an account id', async () => {
    const store = withAdmin();
    for (const account of ['', 'nope', OWNER.slice(0, 31), 'Z'.repeat(32)]) {
      const response = await call(await as(OWNER, { method: 'PUT', body: { account } }), store);
      expect(response.status).toBe(400);
    }
    expect(await ownerId(store)).toBe(OWNER);
  });
});

-- Roles: who may change the atlas, tied to an account rather than to a shared secret.
--
-- ## What was wrong with the token
--
-- Authority was `ADMIN_TOKEN` — one string, held in a Cloudflare secret, typed into
-- `/admin` by hand. It works, and it has three properties nobody wants for long:
--
--   * It is not a person. The moderation audit trail records an eight-character
--     fingerprint of *the token*, so two administrators sharing it are indistinguishable
--     in the record of who rejected what.
--   * It cannot be granted or withdrawn. Giving somebody the ability to moderate means
--     giving them the ability to redefine what Authentic means, for ever, with the only
--     revocation being to change the secret and re-tell everybody else.
--   * It has nothing to do with signing in. The app grew Google sign-in and the two
--     systems never met: being signed in said nothing about what you could do.
--
-- ## Three tiers
--
-- **user** — everybody, and the absence of a row. No row is written when an ordinary
-- reader signs in, so `user` is not a record: it is what you are when this table has
-- never heard of you. That is the default, and it is the floor.
--
-- **admin** — the console: thresholds, moderation, the refresh queue, analytics.
-- Appointed by the owner and removed by the owner. An admin cannot pass the role on,
-- which is the whole reason the tier exists rather than everyone privileged being equal.
--
-- **owner** — one account. Everything an admin can do, plus the authority to appoint and
-- remove them. Exactly one exists, enforced by the unique index below rather than by an
-- endpoint remembering to check.
--
-- ## Only privileged accounts get a row
--
-- This is the part worth keeping when the table is next changed. An ordinary reader who
-- signs in still has **no record anywhere** — no row here, no profile, nothing. A row is
-- written only when somebody is given a role, so the table is a list of the privileged
-- rather than a list of users.
--
-- That is what lets the privacy page go on saying almost everything it said. It has to
-- change — "no user table anywhere in this database" stops being true the moment this
-- migration runs — but it changes to "the only accounts recorded are the ones that run
-- the site", which is a far smaller statement than an account system would have forced.
--
-- ## Who may create a role
--
-- The chain starts outside the database and ends inside it. Whoever can set
-- `ADMIN_TOKEN` — one person, holding a Cloudflare secret — claims the owner seat on a
-- table that has none. After that the token is break-glass only: it can still reach the
-- console if the owner account is ever lost, and it can no longer appoint anybody,
-- because an appointment should appear in `granted_by` as the act of a person.
--
-- Two rules are enforced in `functions/api/admin/roles.ts` rather than trusted to good
-- behaviour: nobody can promote themselves out of `user`, and the owner cannot be
-- removed. Without the second, one careless revocation leaves a console reachable only
-- by whoever can edit Cloudflare secrets, which is recovery by outage.

create table if not exists account_role (
  -- The salted one-way hash from `accountIdFor` — the same value the session cookie
  -- carries. Not a Google subject id, and not reversible into one.
  id text primary key,

  -- Constrained in the schema rather than in the endpoint. An endpoint check is a
  -- promise; this is a guarantee, and it holds for the next endpoint too.
  role text not null check (role in ('owner', 'admin')),

  -- Who granted it: an account id, or the literal 'bootstrap' for the owner, who by
  -- definition was appointed by nobody.
  granted_by text not null,
  granted text not null default (datetime('now'))
);

-- Looked up on every grant and every revocation.
create index if not exists account_role_by_role on account_role (role);

-- There is exactly one owner, and the schema is what says so.
--
-- Partial, so it constrains the owner row without limiting administrators to one. Here
-- rather than in the endpoint deliberately: an endpoint check is a promise kept by
-- whoever writes the next endpoint, and "two owners" is the one state from which this
-- authority model cannot be reasoned about at all.
create unique index if not exists account_role_one_owner
  on account_role (role) where role = 'owner';

-- Asking for a source check from the app.
--
-- `scripts/check-sources.mjs` already does the work and needs a laptop and a typed dish
-- name. This table is the bridge: an administrator reading a record on a phone can mark
-- it worth checking, and the drain picks it up later.
--
-- ## Why a queue and not a job
--
-- Because the catalogue is files. Nothing running on Cloudflare can update a record —
-- an edge function cannot rewrite `src/data/*.json`, commit it and rebuild the site, and
-- giving it the ability to would mean handing a repository token to a public endpoint.
-- So the server's only possible role is to remember what was asked for, and it is the
-- whole of what this table does.
--
-- That constraint is also a safeguard rather than only a limitation. A person runs the
-- drain, reads what changed and decides — which is exactly the review step that stops a
-- vandalised Wikipedia edit propagating into the atlas unseen.

create table if not exists refresh_request (
  id           text primary key,
  -- 'dish' names one record, 'country' a group, 'all' the whole atlas.
  kind         text not null check (kind in ('dish', 'country', 'all')),
  -- The dish or country. Empty for 'all'.
  target       text not null default '',
  requested_by text not null default '',
  requested_at text not null default (datetime('now')),
  status       text not null default 'queued'
               check (status in ('queued', 'done', 'failed')),
  done_at      text,
  -- What the drain found, in one line, so the answer is visible where the question was
  -- asked. Without it an administrator queues a check and never learns the outcome
  -- unless they happen to be reading the terminal it ran in.
  result       text not null default ''
);

-- The same thing queued twice is one request.
--
-- Scoped to queued, so a dish checked last month can be asked for again — but tapping
-- "check this" three times on a slow connection does not create three identical jobs.
create unique index if not exists refresh_not_duplicated
  on refresh_request (kind, target) where status = 'queued';

create index if not exists refresh_by_status on refresh_request (status, requested_at desc);

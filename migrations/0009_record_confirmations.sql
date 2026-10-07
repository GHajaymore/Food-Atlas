-- Confirmations on records that are already in the atlas.
--
-- Run with:  npx wrangler d1 migrations apply wikifoodia --remote
--
-- The table `docs/confirmations-api.md` has specified since before there was a server.
-- `proposal_confirmation` (0001) is its sibling and does the same job for a dish nobody
-- has published yet; this one is for the 17,358 records that exist, where the whole
-- authenticity model has been waiting for a door.
--
-- Three differences from the spec, all because D1 is SQLite:
--   - `uuid` is `text`, `timestamptz` is `text` holding an ISO date;
--   - `boolean` is `integer`;
--   - no subquery in a CHECK, which costs nothing here because the rule that needs one
--     — a submitter cannot confirm their own proposal — has no equivalent for a record
--     nobody submitted.

create table if not exists record_confirmation (
  id            text primary key,
  -- The catalogue id. Deliberately not a foreign key: the catalogue is a set of JSON
  -- files rebuilt by a script and has no table here, so there is nothing to reference.
  -- The endpoint checks the id is a positive integer and nothing else can.
  dish_id       integer not null,

  -- The identity. Never returned by any endpoint.
  person_id     text not null,
  -- The signed-in account, where there was one. Never returned either; its only job is
  -- `verified`, which is what a badge counts. See validationsOf().
  account_id    text not null default '',

  -- All three are shown on the record, exactly as written.
  name          text not null,
  connection    text not null,
  said          text not null,

  local         integer not null default 0,
  at            text not null default (datetime('now')),
  status        text not null default 'published'
                check (status in ('published', 'withdrawn', 'removed'))
);

-- ONE PERSON, ONE CONFIRMATION.
--
-- The line "3 confirmations" actually rests on. Everything else in the authenticity
-- model is arithmetic over evidence; this is the only thing that stops one person
-- supplying all of it. If it is ever dropped, the badge stops meaning anything and no
-- test in the app would notice.
create unique index if not exists record_one_per_person
  on record_confirmation (dish_id, person_id) where status = 'published';

-- And one per account, where there is one. A reader who clears their cookies gets a new
-- person_id; this is what stops that becoming a second counted confirmation, because a
-- counted confirmation is precisely one tied to an account.
create unique index if not exists record_one_per_account
  on record_confirmation (dish_id, account_id) where status = 'published' and account_id <> '';

create index if not exists record_confirmation_by_dish
  on record_confirmation (dish_id) where status = 'published';

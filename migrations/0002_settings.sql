-- Settings an administrator can change without a deploy.
--
-- One row per setting rather than one row with a column each, so adding a setting is an
-- insert rather than a migration. The values are small and read once per page load, so
-- the usual argument against key-value tables — that you cannot query across them —
-- costs nothing here, because nothing ever queries across them.

create table if not exists setting (
  key        text primary key,
  -- JSON, so a boolean and a number can live in one column without a type tag.
  value      text not null,
  updated_at text not null default (datetime('now'))
);

-- Deliberately NOT seeded with defaults.
--
-- An absent row means "use the compiled default", which is what src/domain/settings.ts
-- falls back to. Seeding would freeze today's values into the database, so a later
-- change to a default would apply to every new deployment except the ones that had run
-- this migration — the surprising case, and the one nobody would think to check.

-- Every change, kept.
--
-- Two of these settings re-badge all 18,008 records retroactively, and a change that
-- large should never be untraceable. This is the only place the app records who did
-- what: `by` is the admin token's fingerprint, never the token.
create table if not exists setting_change (
  key        text not null,
  was        text,
  now        text not null,
  by         text not null default '',
  at         text not null default (datetime('now'))
);

create index if not exists setting_change_by_time on setting_change (at desc);

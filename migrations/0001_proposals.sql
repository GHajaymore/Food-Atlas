-- Proposals and their confirmations.
--
-- Run with:  npx wrangler d1 migrations apply wikifoodia
--
-- D1 is SQLite, so the schema in docs/proposals-api.md — written against Postgres —
-- needed three changes, all of them noted where they occur: no jsonb, no timestamptz,
-- and no subquery inside a CHECK. The last one is not cosmetic; it is the constraint
-- the Authentic badge rests on, and it moves to a trigger rather than disappearing.

create table if not exists proposal (
  id            text primary key,
  name          text not null,
  -- Folded name (accents stripped, punctuation dropped, case flattened). Stored rather
  -- than computed so the duplicate index below can exist at all — SQLite will not index
  -- an expression it cannot prove deterministic across versions. Written by the endpoint
  -- using the same fold() the client uses, which is what keeps the two agreeing.
  fold          text not null,
  country       text not null,
  region        text not null default '',
  cooks         text not null default '',
  -- JSON arrays as text. D1 has json_extract() when it is needed, and nothing here
  -- queries inside these — they are read whole and handed to the client.
  ingredients   text not null default '[]',
  steps         text not null default '[]',
  -- The identity. Never returned by any endpoint.
  submitter_id  text not null,
  -- The display name they chose. Returned.
  submitter     text not null,
  connection    text not null,
  photo         text not null default '',
  at            text not null default (datetime('now')),
  status        text not null default 'proposed'
                check (status in ('proposed', 'published', 'declined'))
);

-- The same dish proposed twice in the same country is one dish. Scoped to open
-- proposals so a declined one does not block somebody proposing it properly later.
create unique index if not exists proposal_not_duplicated
  on proposal (fold, country) where status = 'proposed';

create index if not exists proposal_by_status on proposal (status);

create table if not exists proposal_confirmation (
  proposal_id   text not null references proposal(id),
  -- The identity. Never returned by any endpoint.
  person_id     text not null,
  name          text not null,
  connection    text not null,
  said          text not null,
  local         integer not null default 0,
  at            text not null default (datetime('now')),
  status        text not null default 'published'
);

-- ONE PERSON, ONE CONFIRMATION.
--
-- This index is what the number "3 confirmations" actually means. Everything else in
-- the authenticity model is arithmetic over evidence; this is the only line that stops
-- one person supplying all of it. If it is ever dropped, the badge stops meaning
-- anything and no test in the app would notice.
create unique index if not exists proposal_one_per_person
  on proposal_confirmation (proposal_id, person_id) where status = 'published';

create index if not exists confirmation_by_proposal on proposal_confirmation (proposal_id);

-- A SUBMITTER CANNOT CONFIRM THEIR OWN PROPOSAL.
--
-- Postgres would want a CHECK here and cannot have one either — CHECK may not subquery
-- in any engine. Without this, one person supplies both the claim and the agreement,
-- and a bar of three means two strangers rather than three.
--
-- The endpoint refuses this case as well, and returns a clearer message than a
-- constraint violation. Both exist on purpose: the endpoint is the explanation, the
-- trigger is the guarantee.
create trigger if not exists confirmation_not_own_proposal
before insert on proposal_confirmation
for each row
when new.person_id = (select submitter_id from proposal where id = new.proposal_id)
begin
  select raise(abort, 'a submitter cannot confirm their own proposal');
end;

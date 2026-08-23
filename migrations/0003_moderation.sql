-- Declining a proposal.
--
-- The schema has allowed `status = 'declined'` since 0001 and nothing could set it, so
-- a proposal — public the moment it is made, by design — could never be taken down.
-- Somebody posting abuse, spam or nonsense left it on the site permanently, and the
-- only remedy was a hand-written SQL statement against production.
--
-- That is a moderation gap rather than a missing preference, which is why it comes
-- before any further setting.

alter table proposal add column decided_by text not null default '';
alter table proposal add column decided_at text;

-- Why it was declined.
--
-- Kept, and kept private. It is written for the next administrator rather than for the
-- person who proposed the dish: "duplicate of Kaipola" and "not food" are notes about a
-- decision, and a proposal is not a submission to be marked. `GET /proposals` never
-- returns it.
alter table proposal add column decided_note text not null default '';

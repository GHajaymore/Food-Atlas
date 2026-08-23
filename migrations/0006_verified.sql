-- Whether the person confirming was signed in.
--
-- The badge rests on "three confirmations", and until now that could mean three people
-- or one person with three private windows — the identity was a cookie, and a cookie is
-- free to mint. `validationsOf` now counts only verified confirmations, so this column
-- is what the Authentic badge actually stands on.
--
-- Unverified confirmations are kept and displayed. Requiring an account to *speak* would
-- exclude exactly the people this depends on; requiring one to *move a badge* is what
-- makes the number defensible. Both facts live on the same row.

alter table proposal_confirmation add column verified integer not null default 0;

-- The account that confirmed it, where there was one. Never returned by any endpoint —
-- the client sees `verified: true` and no identity, the same rule person_id follows.
alter table proposal_confirmation add column account_id text;

-- One account, one confirmation.
--
-- The existing index is on (proposal_id, person_id), where person_id is the cookie. That
-- still stops the ordinary double-tap. This one is the real constraint: a Google subject
-- is issued by somebody else and cannot be minted by clearing site data.
--
-- Partial, so the unlimited anonymous rows — which all have a NULL account — do not
-- collide with one another.
create unique index if not exists confirmation_one_per_account
  on proposal_confirmation (proposal_id, account_id) where account_id is not null;

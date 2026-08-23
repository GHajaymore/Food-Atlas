# Proposals API

A proposal is a dish a reader says exists and the atlas has no record of. It is public
from the moment it is made, confirmed by the same people through the same mechanism as
any record, and it enters the catalogue only when they have.

This extends `docs/confirmations-api.md` and shares its database, its identity model and
its single reason for existing. **Read that first** — everything it says about why a
form cannot replace a server applies here unchanged, and more sharply: a confirmation
moves a badge, and a proposal creates a record.

---

## The two tables

```sql
create table proposal (
  id            text primary key,
  name          text not null,
  country       text not null,
  region        text not null default '',
  cooks         text not null default '',
  ingredients   jsonb not null default '[]',
  steps         jsonb not null default '[]',
  submitter_id  text not null,          -- the identity, never displayed
  submitter     text not null,          -- the display name they chose
  connection    text not null,
  photo         text not null default '',
  at            timestamptz not null default now(),
  status        text not null default 'proposed'
                check (status in ('proposed', 'published', 'declined'))
);

create table proposal_confirmation (
  proposal_id   text not null references proposal(id),
  person_id     text not null,          -- the identity, never displayed
  name          text not null,
  connection    text not null,
  said          text not null,
  local         boolean not null default false,
  at            timestamptz not null default now(),
  status        text not null default 'published'
);
```

### The two indexes the whole thing rests on

```sql
-- One person, one confirmation. This is what "3 confirmations" actually means.
create unique index proposal_one_per_person
  on proposal_confirmation (proposal_id, person_id) where status = 'published';
```

```sql
-- A submitter cannot confirm their own proposal.
--
-- Without this, one person supplies both the claim and the agreement, and the bar of
-- three means two strangers rather than three. Enforced here rather than in the client
-- because the client is not where trust lives.
create unique index proposal_not_self_confirmed
  on proposal_confirmation (proposal_id, person_id);
```

The second is not really a unique index — it is a constraint, and Postgres wants it
written as one:

```sql
alter table proposal_confirmation add constraint not_own_proposal
  check (person_id <> (select submitter_id from proposal where id = proposal_id));
```

`CHECK` cannot subquery, so in practice this is a trigger or is enforced in the endpoint.
**However it is written, it must exist server-side.** `src/domain/proposals.ts` documents
the rule and cannot enforce it; the client never sees `submitter_id` or `person_id` at
all, by design.

---

## Endpoints

### `GET /proposals`

Everything with `status = 'proposed'`, plus anything published in the last 30 days so a
reader who confirmed something can see it landed.

```json
[
  {
    "id": "p_8f2a",
    "name": "Kaipola",
    "country": "India",
    "region": "Kerala",
    "cooks": "Made at home for Eid, by the grandmothers.",
    "ingredients": ["ripe plantain", "egg", "ghee", "cardamom"],
    "steps": ["Mash the plantain.", "Fold through beaten egg."],
    "submitter": "Ajay",
    "connection": "Grew up in Malabar",
    "photo": "",
    "at": "2026-08-23",
    "status": "proposed",
    "people": [
      { "name": "Priya", "connection": "Born in Kozhikode", "said": "We use ghee, not oil.", "local": true, "at": "2026-08-23" }
    ]
  }
]
```

Matches the `Proposal` interface exactly. **No identity fields are ever returned** —
`submitter_id` and `person_id` stay in the database.

### `POST /proposals`

Creates one. Requires `name`, `country`, `submitter`, `connection` — the same list
`missingFrom()` enforces in the client, checked again here because a client check is a
courtesy and a server check is a rule.

The endpoint should reject a proposal whose folded name already matches a published
proposal from the same country. It should **not** reject one that matches a catalogue
record — the client shows those to the submitter and lets them decide, because two
genuinely different dishes can share a name across two places and a string comparison
is not entitled to that call. See `possibleDuplicates()`.

### `POST /proposals/{id}/confirmations`

Requires `name`, `connection`, `said`. Rejects the submitter, and rejects a second
confirmation from the same person — the two indexes above.

---

## Promotion, and why it is a build step

When a proposal reaches `PROPOSAL_CONFIRMATIONS`, it does **not** become a record by
itself. `scripts/promote-proposals.mjs` pulls everything publishable, writes it into a
source file, and the next build turns it into a page.

That looks like unnecessary friction and is the opposite. The catalogue is 18,008 static
records built by scripts and served as files; that is what makes the atlas free, fast and
indexable, and a record that appeared in a database but not in `public/data` would exist
in the app and nowhere else — not in the counts, not in search, not on a page Google can
find. Promotion through the build is what makes a proposal into a *real* record rather
than a second-class one.

It also puts a person between a confirmed proposal and the published atlas, which is the
right place for one.

```
proposal confirmed → node scripts/promote-proposals.mjs → git commit → push
                                                                        ↓
                                                    Cloudflare rebuilds (~2-5 min)
                                                                        ↓
                                                              the dish has a page
```

---

## What this does not solve

Identity stops one person confirming three times. **It does not stop three people being
wrong, or three friends agreeing with each other.** `confirmations.ts` says this about
the existing badge and it is more exposed here, because a proposal has no external
source to contradict it — there is no Wikipedia article, no register, nothing but what
people said.

The defence is the same one the rest of the atlas uses and it is not verification: every
confirmation is displayed with its stated connection, so a reader meets the evidence
rather than a count. Three vague connections read differently from three specific ones.

The consequence is worth stating plainly rather than discovering later: a determined
group could put a dish in this atlas that nobody outside it has heard of. What they
cannot do is make it *look* documented, because the score is computed from the six
dimensions and a proposal can never claim heritage, an article, or a register method.
It will sit in the atlas as a thinly-evidenced record, which is what it is.

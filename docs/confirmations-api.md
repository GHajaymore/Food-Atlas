# Confirmations — schema and endpoints

The only mechanism in WikiFoodia that can authenticate a record, and the only part of
it that needs a server.

Everything else the app does is static: `build.ts` transforms JSON, `catalogue.ts`
fetches it, and nothing is ever written. Submissions and missing-dish requests both
deliberately avoid a backend — a form opened at its source costs nothing and needs no
account, and nobody gains anything by faking an offer of work that a person reads
before it becomes a record.

A confirmation is different because **a confirmation moves the badge**. Three of them
promote a record from Variation to Authentic. A form cannot tell three people from one
person submitting three times, and a badge that can be faked is worse than no badge,
because it is the one claim this atlas makes that nobody else makes.

So identity is not a feature of this design. It is the reason it exists.

## The rule this has to defend

From `src/domain/assess.ts`:

- Promotion needs `score >= 55` **and** `validations >= VALIDATIONS_REQUIRED` (3).
- With no confirmations, `localSource` and `community` are both 0, so the ceiling on
  published data alone is 43. Documentation cannot promote a record.
- Therefore the integrity of every 🟢 badge earned this way rests on one thing: that
  three confirmations means three people.

That is enforced in one line — the unique index below. Everything else is plumbing.

## Schema

Portable SQL; adjust types to the engine. `uuid` can be `text`, `timestamptz` can be
`timestamp`.

```sql
create table confirmation (
  id           uuid primary key,

  -- What was confirmed
  dish_id      integer not null,
  said         text    not null,     -- "We use ghee, not oil"
  claim_kind   text    not null      -- what part of the record it speaks to
               check (claim_kind in ('method', 'ingredient', 'place', 'whole')),

  -- Who confirmed it. `person_id` comes from the auth provider and is never shown.
  person_id    text    not null,
  display_name text    not null,     -- shown on the record
  connection   text    not null,     -- "Born and cooking in Kozhikode" — shown
  locality     text,                 -- the place they speak for, if narrower
  is_local     boolean not null default false,

  created_at   timestamptz not null default now(),
  status       text    not null default 'published'
               check (status in ('published', 'withdrawn', 'removed'))
);

-- The line the badge rests on: one published confirmation per person per dish.
create unique index confirmation_one_per_person
  on confirmation (dish_id, person_id)
  where status = 'published';

create index confirmation_by_dish on confirmation (dish_id) where status = 'published';
```

### Notes on the columns

- **`said` is required.** A confirmation with nothing said is a vote, and a vote is
  what this design exists to avoid: the most popular version must never become the
  authentic record. Requiring a sentence also makes fraud expensive — writing a
  plausible claim about a dish you have never cooked is harder than clicking.
- **`connection` is required and displayed.** It is the whole of what makes a
  confirmation evidence. An anonymous confirmation is worth nothing here and should
  not be storable.
- **`claim_kind`** lets someone confirm the method without vouching for the origin
  story. Somebody from Kozhikode can tell you how it is made and know nothing about
  where it started; forcing one answer makes them overclaim or say nothing.
- **`is_local`** decides Authentic — Local against Authentic — Regional. It is not a
  measure of strength.
- **`person_id` is never returned** by the read endpoint. It exists to enforce the
  index, not to be shown.
- **`status`** rather than deletion, so a withdrawn confirmation stops counting
  without vanishing from the record's history.

## Endpoints

Two. The app is a static client, so the read is a whole-index fetch alongside the
other data files rather than a per-dish call.

### `GET /confirmations`

Returns every published confirmation, keyed by dish id. Small: a few hundred bytes
each, so 100,000 of them is about 50 MB and the realistic figure for a long time is
kilobytes. Cache it.

```json
{
  "1042": {
    "people": [
      {
        "name": "Priya",
        "connection": "Born and cooking in Kozhikode",
        "said": "We use ghee, not oil. Anyone using oil is making something else.",
        "local": true,
        "at": "2026-08-22"
      }
    ]
  }
}
```

`person_id` is absent by design. `name`, `connection` and `said` are user text and are
rendered as text — never as markup.

### `POST /confirmations`

Authenticated. Body:

```json
{
  "dishId": 1042,
  "said": "We use ghee, not oil.",
  "claimKind": "ingredient",
  "connection": "Born and cooking in Kozhikode",
  "locality": "Kozhikode",
  "isLocal": true
}
```

- `409` when this person has already confirmed this dish. That is the unique index
  doing its job, and it should be reported to the reader as *"you have already
  confirmed this"*, not as an error.
- `401` when unauthenticated.
- `422` when `said` or `connection` is empty.

## Identity

Does not need passwords, and should not have them. An email magic-link or a single
OAuth provider is enough, because the only question being asked is *are these three
people three people*. The app never sees a credential either way — see the client
rule: this project does not handle passwords.

## Cost

The shared database is no new spend. The API needs somewhere to run; free tiers cover
this scale comfortably (Cloudflare Workers at 100k requests/day, or Supabase, which
brings the database, the auth and the API together).

**Flag, per the project's standing rule:** this is the first recurring-cost surface
the app has ever had. Free tiers cover it now, but it stops being structurally free
the way static files are, and moderation is ongoing work that falls on a person.

## Sequencing

- **Submissions** — someone recording how a dish is made — can go through the free
  form today. Low incentive to fake, high value, no identity needed. This is what
  grows the catalogue.
- **Confirmations** — the thing that moves the badge — wait for this endpoint and for
  identity.

Content starts growing immediately; the part that must be trustworthy waits for the
thing that makes it trustworthy.

## Client wiring

Set `EXPO_PUBLIC_CONFIRMATIONS_URL` to the read endpoint. Until it is set,
`canConfirm()` is false, nothing is fetched, every record carries zero confirmations,
and the app says confirmation is not open yet — the same rule the donate button and
the contribution form follow.

# The contribution form

Ten minutes, free, and it is the only thing standing between the atlas and growing.

Every free corpus this project can reach has been walked — Wikidata, five Wikibooks
cookbooks, the cuisine trees, Italy's PAT register, UNESCO's inscriptions, the EU
geographical-indications register, GeoNames. What is left is food nobody has written
down: 883 records with no article in any language, and thousands more with a name, a
place and nothing else. No scraper reaches those, because the thing that would be
scraped does not exist.

`/contribute` is built and has been a walkthrough with nowhere to send anything since
it was written, because `EXPO_PUBLIC_CONTRIBUTION_FORM_URL` has never been set.

## 1. Make the form

Any form service works; these instructions are for Google Forms because it is free and
needs nothing from the person submitting. Create six questions, all **paragraph /
long answer**, in this order:

| # | Question | Required |
|---|---|---|
| 1 | Dish, in its own language if possible | **yes** |
| 2 | Where is it made this way? | **yes** |
| 3 | Who prepares it | no |
| 4 | Traditional ingredients and equipment | no |
| 5 | Your connection to the place | **yes** |
| 6 | Commons file name or link | no |

The wording is the app's own, so a contributor meets the same sentence twice rather
than two versions of a question. Copy it verbatim.

**Do not add an email question or turn on "Collect email addresses".** The app promises
a route that needs no account, and asking for an email quietly makes that false.

### Why those three are required

`dish`, `place` and `connection` — from `REQUIRED` in `src/domain/contribution.ts`.
A name with nowhere attached cannot be assessed against anything, and the connection is
the whole difference between this and copying a recipe off the internet, which the
atlas already refuses to do. Ingredients and a photograph are wanted, not required:
somebody who knows where a food is from and that nobody has written it down has
already told us something no source here holds.

## 2. Get the pre-filled link

Google will not show you the field ids. To get them:

1. Open the form's **⋮ menu → Get pre-filled link**.
2. Type the **marker word** into each question — exactly these, in capitals:

   ```
   DISH   PLACE   COOKS   INGREDIENTS   CONNECTION   PHOTO
   ```

3. Press **Get link**, then **Copy link**.

The result looks like:

```
https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform?usp=pp_url&entry.1845678=DISH&entry.9021334=PLACE&…
```

## 3. Hand it to the setup script

```bash
node scripts/setup-contribution-form.mjs "<paste the link>"
```

It reads the ids back out by matching the marker words, writes them to `.env`, and
prints what it found:

```
  ok  DISH         entry.1845678      Dish, in its own language if possible
  ok  PLACE        entry.9021334      Where is it made this way?
  --  COOKS        not found          Who prepares it
```

It refuses to write if a **required** field is missing, rather than configuring a form
that silently drops the dish name. Optional fields left unset are fine — those answers
simply are not pre-filled.

`.env` is merged, not overwritten, so the donation slug and the confirmations URL
survive. `.env` is gitignored, which is correct: the form URL is not a secret, but the
file it lives in is where secrets would go.

Add `--dry` to see the mapping without writing.

## 4. Restart

Expo reads `EXPO_PUBLIC_*` at build time, not per request. Stop the dev server and
start it again, or the app will go on saying submissions are not open.

## What changes when it is set

`canContribute()` turns true, and `/contribute` stops being a walkthrough: the button
opens the form with everything the reader typed already filled in, so they are not
asked for it twice. Blank fields are left out of the query string rather than sent as
empty values, so the form's own "required" marks still mean something at the other end.

## What this deliberately does *not* do

Collect confirmations. A submission is an offer of work that a person reads before it
becomes a record, and nobody gains by faking one. A **confirmation** moves the badge —
three of them promote a record to Authentic — and a form cannot tell three people from
one person submitting three times. That needs identity, and it is specified separately
in `docs/confirmations-api.md`.

Start here anyway. Submissions grow the catalogue and need no server; confirmations can
wait for the database.

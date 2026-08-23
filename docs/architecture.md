# Architecture — where this goes next, and why

Written 2026-08-23, against a working app: 18,008 records, 321 tests, one page.

This is a plan for the shape the project should hold for years, not a rewrite. Each
stage is independently useful and nothing built in one is thrown away by the next — if
you stop after stage 1 you are better off than today, and stage 4 does not require
stage 3 to have happened.

---

## The one thing to get right

**The content is static. Only the confirmations are not.**

18,008 records change when a script runs, not when a reader arrives. That is a
publishing problem, not a database problem, and treating it as one is what keeps this
free, fast and durable. Most food sites are dynamic because their content is; yours is
not, and the architecture should take the win.

So the long-term shape is:

```
  content   generated ahead of time, served as files          free, cacheable, indexable
  domain    pure TypeScript, no framework                     portable, tested, outlives the UI
  writes    one small API over one small table                the only server, and only for confirmations
```

Everything below follows from that sentence.

---

## What the single page actually costs today

Measured, not assumed:

| | |
|---|---|
| downloaded before first paint | **14.7 MB** of JSON |
| indexable pages | **1** |
| shareable record URLs | **0** |
| records Google can find | **0 of 18,008** |
| server needed for writes | none, so confirmations cannot exist |

The last two are the ones that matter. An atlas that cannot be found by somebody
searching a dish name is invisible to precisely the people who could authenticate it —
and authentication is the product. The 14.7 MB is a performance problem; the missing
URLs are an *existence* problem.

---

## Stage 0 — split the data

**Nothing about the framework changes.** `compact-data.mjs` gains a sibling that emits:

```
  public/data/index.json        id, name, country, badge, photo, score      ~1.5 MB
  public/data/dish/{id}.json    the full record                             ~2 KB each
```

The app fetches the index at startup and a record when one is opened. Search, shelves
and filters all run on the index, which already carries every field they read.

- **Wins** first paint drops from 14.7 MB to about 1.5 MB; a record costs 2 KB.
- **Risk** low. `catalogue.ts` changes; the domain layer does not.
- **Throwaway** none — every later stage wants per-record files.

## Stage 1 — make the domain a package

`src/domain` is already pure TypeScript with no React import and 321 tests over it.
Moving it to `packages/domain` and importing it by name makes that explicit and
enforceable.

This is the stage that makes the architecture long-term rather than a stack choice.
`assess`, `shelves`, `queries`, `place`, `gazetteer`, `recipeLines`, `confirmations` —
the rules that took months to get right — become independent of what renders them. Any
frontend, any generator, any future rewrite keeps them.

- **Wins** the valuable half of the codebase stops depending on Expo.
- **Risk** very low; mechanical.
- **Throwaway** none.

## Stage 2 — real pages, generated

A build step that renders one HTML file per record using the domain layer, plus a page
per country and per shelf. Hosted free on Cloudflare Pages or GitHub Pages.

```
  /                       the atlas
  /dish/kozhikode-halwa   a record — real HTML, real title, real description
  /place/india            everything from a country
  /disappearing           the at-risk shelf
```

This is the stage that changes the project's prospects. 18,008 pages that Google can
index, each with the dish's name in the title and its evidence in the body. Somebody
searching *"how is kozhikode halwa made"* can arrive at the exact record that says
nobody has written it down — which is the best possible moment to ask them.

- **Wins** discovery, shareable links, and pages that work with no JavaScript at all.
- **Risk** medium — a new build step and a routing scheme. Slugs must be stable for
  ever, so they are generated once and stored on the record.
- **Throwaway** none. The app keeps working; these pages sit alongside it.

**Why generated files rather than a server framework.** Next.js would do this well and
it would also make the project depend on a hosting model. Files on a CDN have no
runtime, no cold start, no vendor, no bill, and will still serve in ten years. For
content that changes when a script runs, a server is a liability rather than a feature.

## Stage 3 — confirmations

The only server. One table, two endpoints, already specified in
`docs/confirmations-api.md`, and the reason it needs to exist is identity: a form cannot
tell three people from one person submitting three times, and the entire badge rests on
the unique index.

- **Wins** the authentication model stops being inert. This is the product.
- **Risk** medium, and it is the first recurring-cost surface the project has ever had.
- **Throwaway** none.

## Stage 4 — the app shell

Only after the above. Code-splitting, route-level data loading, and a decision about
whether the mobile app stays Expo or becomes a thin client over the same content.

Deliberately last: it is the stage with the most visible churn and the least effect on
whether the project succeeds.

---

## What this is not

**Not a migration to Next.js.** It would solve stage 2 and introduce a runtime the
project does not need. Revisit only if server-side personalisation ever becomes real.

**Not a database for the catalogue.** 18,008 records that change on a script run belong
in files. A database would add a dependency, a cost and a backup problem in exchange for
queries that a 1.5 MB index answers in memory.

**Not a rewrite.** Stages 0–2 leave the existing screens running throughout.

---

## The order, and why

1. **Stage 0** first because it is cheap, invisible and makes everything after it easier.
2. **Stage 1** next because it is nearly true already and it protects the valuable part.
3. **Stage 2** next because discovery is the binding constraint on a project whose growth
   depends on people arriving.
4. **Stage 3** when there is somewhere to put it, and when there are readers to confirm
   anything.
5. **Stage 4** whenever it becomes annoying not to have done it.

Stage 3 can be brought forward if the shared database appears sooner — nothing in stages
0–2 blocks it.

---

## The rule that should survive all of it

Every figure the app shows is computed from the data it ships, and every claim on a
record names its source. That property is why the scoring can be checked by a reader
adding up six numbers, and it is worth more than any framework decision in this
document. Whatever renders the atlas next must keep it.

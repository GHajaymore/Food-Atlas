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

Measured in the browser on 2026-08-23, not assumed:

| | |
|---|---|
| JSON fetched before the atlas can render | 14.71 MB **uncompressed** |
| the same bytes under brotli | **2.92 MB** |
| time to parse all of it | **133 ms** |
| JS heap once built | **122.3 MB** |
| indexable pages | **1** |
| shareable record URLs | **0** |
| records Google can find | **0 of 18,008** |
| server needed for writes | none, so confirmations cannot exist |

**An earlier draft of this document led with "14.7 MB before first paint" and drew the
wrong conclusion from it.** That number is real but it is a *dev-server* measurement:
Metro sends no `Content-Encoding`, which was confirmed by reading `transferSize`
against `decodedBodySize` in the page. Every static host worth using — Cloudflare
Pages, GitHub Pages, Netlify — compresses automatically, so the same payload arrives
as **2.92 MB**. Roughly four fifths of the download problem is solved by deploying,
before a line of code is written.

Two things follow, and they reverse the priorities the plan was built on.

**Parsing was never the cost.** 133 ms for the whole catalogue. Any plan justified by
parse time is solving nothing.

**Memory is the cost.** 14.71 MB of JSON becomes a **122.3 MB heap** — an eight-fold
expansion, and it is not waste: it is 18,008 records' worth of objects, arrays and
strings, each one small and each one carrying its own overhead. That figure is
comfortable on a desktop and genuinely dangerous on a phone, where iOS Safari starts
discarding tabs somewhere in the low hundreds of megabytes. It is also the number
nothing in the original plan addressed.

One more measurement worth recording, because it kills an idea that looks obvious: the
**built catalogue serialises to 35.83 MB**, against 15.68 MB of sources on disk.
Shipping pre-built records would more than double the download. The current design —
ship compact sources and expand the boilerplate in the client — *is* the compression,
and it was a deliberate choice rather than an oversight.

---

## Stage 0 — a slim index, justified by memory

The mechanism the original plan proposed is still right. The reason it gave was wrong,
and the expected win was overstated.

**Nothing about the framework changes.** `compact-data.mjs` gains a sibling that emits:

```
  public/data/index.json        what browsing needs: id, name, place,
                                badge, score, photo, ingredients, localNames   ~5.1 MB raw
  public/data/dish/{id}.json    the long-form text a record page needs         ~2 KB each
```

5.1 MB rather than the 1.5 MB first guessed, because search reads `ingredients` and
`localNames` and shelves read `breadcrumb` — the index cannot be as thin as it looked
until those consumers were listed.

The deferrable half is specific and was measured: **`steps` is 3.89 MB and
`prepSummary` 2.00 MB**, and both are read only when a record is opened. Everything
else that touches them — `shelves`, `metrics`, `nearby`, `Mission`, `invariants` —
wants a *count*, not the text, so the index carries `stepCount` and `proseLength` and
those call sites read the number instead of measuring the string.

- **Wins** roughly 40% off the heap and off the transfer; a record costs 2 KB. Not the
  order-of-magnitude the first draft implied.
- **Risk** moderate, and higher than first stated: six call sites in a domain layer
  with 321 tests over it change from reading text to reading counts.
- **Throwaway** none — every later stage wants per-record files.

**Do this after deploying, not before.** Compression is free and larger; measure again
on the real host before spending the refactor, because it may turn out to be enough.

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
queries that a 5 MB index answers in memory.

**Not a rewrite.** Stages 0–2 leave the existing screens running throughout.

---

## The order, and why

**Stage 2 should now come first.** Measuring stage 0 is what changed the order: the
download problem it was written to solve is mostly a hosting setting, and deploying is
also what stage 2 needs. One action retires the largest part of stage 0 *and* unblocks
the stage that actually decides whether the project succeeds.

1. **Deploy** — free, and worth more than any code in this document: 14.71 MB becomes
   2.92 MB because the host compresses. Do it before writing anything else.
2. **Stage 2** next because discovery is the binding constraint on a project whose growth
   depends on people arriving, and because a record with a URL is what makes a
   confirmation askable.
3. **Stage 1** alongside it — nearly true already, and it protects the valuable part.
4. **Stage 0** once there are real numbers from the real host. It is a memory fix, and
   memory is a phone problem that a desktop measurement will keep hiding.
5. **Stage 3** when there is somewhere to put it, and when there are readers to confirm
   anything.
6. **Stage 4** whenever it becomes annoying not to have done it.

Stage 3 can be brought forward if the shared database appears sooner — nothing in stages
0–2 blocks it.

---

## The rule that should survive all of it

Every figure the app shows is computed from the data it ships, and every claim on a
record names its source. That property is why the scoring can be checked by a reader
adding up six numbers, and it is worth more than any framework decision in this
document. Whatever renders the atlas next must keep it.

# The first paint, measured

Ajay, on the live site: *"why is the rendering so slow?"*

This is the answer, the size of the prize, and what happened when it was built. It was
attempted on 2026-08-27 and reverted the same day; everything below is what that
established, so the next attempt starts from evidence rather than from the same guesses.

## What a cold visit actually costs

Measured on `wikifoodia.ajailabs.app`, 2026-08-27, fetching with `cache: 'reload'` so the
numbers are a first visit rather than a warm one. The first reading was misleading —
`transferSize: 0` across the board, because it was a repeat visit — and that is worth
knowing before trusting any figure here.

| | transfer (brotli) | decoded |
|---|---|---|
| `cookbook.json` | 1,475 KB | 7.5 MB |
| `cuisines.json` | 1,152 KB | 5.3 MB |
| `catalogue.json` | 322 KB | 2.2 MB |
| `gi.json` | 33 KB | 0.6 MB |
| `unesco.json` | 5 KB | 0.02 MB |
| **total** | **2.92 MB** | **15.6 MB** |

Plus 8.2 MB of decoded JavaScript. The data alone took **1,215 ms** on a desktop
connection, and nothing renders until all five files land *and* the fonts load —
`app/_layout.tsx` returns `<FeedSkeleton>` until `fontsLoaded`.

## Where the bytes are

Two fields are most of the payload, and neither is needed to paint the home screen.

| file | field | share of that file |
|---|---|---|
| `cookbook.json` | `steps` | **56%** — 3.84 MB decoded |
| `cuisines.json` | `prepSummary` | 35% — 1.30 MB |
| `cuisines.json` | `langNames` | 16% — 0.60 MB |
| `catalogue.json` | `prepSummary` | 19% — 0.29 MB |

Splitting those into a second, deferred payload:

```
brotli on the critical path:  2.92 MB  ->  1.11 MB   (62% less)
deferred, after first paint:  1.78 MB
```

**62%** on paper. The section below is why the real figure is **31%**, and how that was
found out the hard way.

## Two traps, and they are why this is not a small change

**`steps.length` is read in ten places, and none of them wants the text.** `shelves.ts`
orders the Disappearing rail by whether a record has a method; `metrics.ts` and
`Mission.tsx` count documented records; `pantry.ts`, `nearby.ts` and `invariants.ts` all
branch on it; the dish screen decides `isDocumented` from it. Ship the steps late and every
one of those silently reads zero — the front page reorders, the headline counts drop, and
badges would be wrong if scoring read it too.

*It does not.* `assess()` takes an `Evidence` record of booleans and lengths, never the
step text, so **scoring is safe**. That was checked, not assumed.

The obvious fix is to keep the *length* honest from the first frame — build
`steps: new Array(stepCount).fill('')` and swap the contents in later. **That was tried and
it does not work**; see below.

**`langNames` is not dish-screen decoration.** `queries.ts` searches it, so a record can be
found by its name in any of 34 languages — a gap this project deliberately closed once
already — and `proposals.ts` uses it to detect duplicates. Defer it naively and
multilingual search quietly stops working. It needs the same treatment as `steps` or none
at all.

## It was attempted, and the test suite refused it

Built end to end on 2026-08-27 and reverted the same day. Worth writing down, because the
attempt narrowed the problem considerably and two of the findings were only visible from
inside it.

**Half the prize is not available.** `prepSummary` was in the deferral list until the build
was read properly, and it cannot go: `hasAccount: prepSummary.length > 0` feeds straight
into `assess()`, so holding it back would have moved scores, and `detectAtRisk(prepSummary)`
reads the prose itself to decide whether a tradition is declining. A boolean cannot stand in
for either. With `prepSummary` and `langNames` both immovable, the realistic prize is
**31%** — 2.92 MB to 2.02 MB — not 62%.

**The placeholder trick produces invalid records.** Filling `steps` with empty strings of
the right length keeps every `.length` correct, which was the whole idea, and
`plumbing.test.ts` failed immediately: *"never shows a bullet with nothing beside it"*,
**4,595 records**. An empty string is a step as far as the renderer is concerned. The test
was right and the design was wrong.

**The honest version costs more than it looks.** Doing it properly means `steps: []` plus a
`stepCount` on the record, and then updating **20 call sites** — and they are not uniform.
`translationProvider.ts` compares a translation's step count against the record's to reject
a bad translation; `invariants.ts` gates the no-fusion-method rule on it; `shelves.ts`
weights `substance` by it. Each needs reading, not replacing.

Everything else worked: the split writes index-aligned files, `cookbookRows` carries the
mapping through the filter that drops a third of the rows, and the loader patches in place
after paint. That part is sound and can be lifted from git history at `0188bc3..`.

## The shape of the change, corrected

1. `scripts/compact-data.mjs` writes `cookbook.json` (light, plus `stepCount`) and
   `cookbook-detail.json` (a parallel array of just the steps). Only cookbook: the other
   heavy fields cannot move.
2. `src/data/build.ts` sets `steps: []` and carries `stepCount` on the record. **Not**
   placeholder strings.
3. The 20 places that read `steps.length` move to the count. Each needs reading — three of
   them mean something other than "how long is the list".
4. `src/data/catalogue.ts` awaits only the light files, builds, paints, then fetches the
   detail and patches in place, keyed through `cookbookRows`.
5. `app/dish/[id].tsx` waits for the text, because mutating an array does not re-render a
   screen that is already open.

Steps 1, 4 and 5 are written and working in the reverted attempt. Steps 2 and 3 are the
work.

## Two cheaper ideas, both measured and both dead

These looked like the easy win. They are written up as failures so nobody spends an
afternoon rediscovering them.

**Stop gating the render on fonts.** `_layout.tsx` shows a skeleton until all five faces
load, and each is ~342 KB, so this looked like the long pole. It is not: one font fetched
cold takes **127 ms** against **302 ms** for `cookbook.json` alone, and the five load in
parallel while the data does. Removing the gate buys a font swap and almost no time.

**Shorten the photo URLs.** `photo` is 10% of `cookbook.json` and 22% of `cuisines.json`,
all of them `https://upload.wikimedia.org/wikipedia/commons/…`, which looks like an obvious
prefix table. Measured over the three big files:

```
brotli 2,949 KB -> 2,943 KB   (0% less)
```

Brotli already models the repeated prefix perfectly. The win would be in decoded size and
heap, not in transfer, and transfer is what the 1,215 ms is made of.

Which leaves the heavy-field split as the only real lever, at **31%** rather than the 62%
it looked like on paper — still worth having, and worth doing in one deliberate sitting
rather than at the end of a long one.

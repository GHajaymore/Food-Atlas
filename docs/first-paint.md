# The first paint, measured

Ajay, on the live site: *"why is the rendering so slow?"*

This is the answer, the size of the prize, and the two traps that make the obvious fix
wrong. Nothing here is built yet — it is written down so the next attempt starts from
measurements rather than from the same guesses.

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

**62%.** That is the prize, and it is large enough to be worth doing properly.

## Two traps, and they are why this is not a small change

**`steps.length` is read in ten places, and none of them wants the text.** `shelves.ts`
orders the Disappearing rail by whether a record has a method; `metrics.ts` and
`Mission.tsx` count documented records; `pantry.ts`, `nearby.ts` and `invariants.ts` all
branch on it; the dish screen decides `isDocumented` from it. Ship the steps late and every
one of those silently reads zero — the front page reorders, the headline counts drop, and
badges would be wrong if scoring read it too.

*It does not.* `assess()` takes an `Evidence` record of booleans and lengths, never the
step text, so **scoring is safe**. That was checked, not assumed.

The fix for the rest is to keep the *length* honest from the first frame: build
`steps: new Array(stepCount).fill('')` and replace the contents when the detail file
arrives. Every `.length` check then reads correctly from the start, and only rendered text
is late.

**`langNames` is not dish-screen decoration.** `queries.ts` searches it, so a record can be
found by its name in any of 34 languages — a gap this project deliberately closed once
already — and `proposals.ts` uses it to detect duplicates. Defer it naively and
multilingual search quietly stops working. It needs the same treatment as `steps` or none
at all.

## The shape of the change

1. `scripts/compact-data.mjs` writes `X.json` (light, plus `stepCount` and `hasPrep`) and
   `X-detail.json` (a parallel array of just the heavy fields).
2. `src/data/catalogue.ts` awaits only the light files, builds, and lets the app paint;
   then fetches the detail files and patches the built records in place.
3. `src/data/build.ts` fills `steps` with placeholders so lengths are right immediately.
4. `app/dish/[id].tsx` awaits the detail promise, since it is the one screen that needs
   the text.

The risky part is step 2 — mutating a module-level catalogue that React already holds
references to. That deserves its own session and its own verification, not the tail of a
long one.

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

Which leaves the heavy-field split as the only real lever, and 62% is a good enough prize
to do it carefully rather than quickly.

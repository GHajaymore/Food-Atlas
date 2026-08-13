# Global Taste

**Taste the world, authentically.**

A phone-first app for discovering traditional food *as it is actually prepared in the place it comes from*. Built from the `design_handoff_provenance` bundle (the design ships under the working name "Provenance") and the `authenticity-first-food-standard` brief.

The organising principle: **authenticity and popularity are separate measurements, and popularity never stands in for authenticity.** The product rule underneath it: **preserve first, adapt second.**

---

## Running it

```bash
npm install
```

```bash
npm run web
```

Then `npm run android` / `npm run ios`, or scan the QR from `npm start` with Expo Go.

```bash
npm test
```

```bash
npm run typecheck
```

## Stack

Expo SDK 57 · React Native 0.86 · TypeScript (strict) · expo-router · zustand · Phosphor icons · Inter.

## Layout

```
app/                     expo-router — one file per screen
  index.tsx              Feed
  dish/[id].tsx          Detail — the authenticity dossier
  search.tsx             Search
  place.tsx              Place picker
  atlas.tsx              Food Atlas
  contribute.tsx         Add a tradition (4 steps)
src/
  domain/                pure, testable, no React
    types.ts             the data model
    authenticity.ts      classification levels, filters, evidence checks
    diet.ts              dietary taxonomy and the two-level menu
    meals.ts             meal occasions, in the tradition's own terms
    continents.ts        country → continent, extended by the import
    invariants.ts        the brief's hard rules, enforced
    queries.ts           feed, drill-down, atlas, search
    translate.ts         reading a record in another language
    translationProvider.ts   on-demand translation + preservation checks
    language.ts          video language routing
    video.ts             play-at-source links
  components/            Nocturne primitives
  theme/tokens.ts        the design system, ported from styles.css
  data/seed.ts           the six curated records
  data/catalogue.ts      curated + imported, gated through the invariants
  data/catalogue.json    the Wikidata import (compact rows)
scripts/
  ingest-wikidata.mjs    build the global catalogue
  compact-catalogue.mjs  one-off migration for older catalogue files
__tests__/domain.test.ts 70 tests over the rules above
```

## The rules, and where they live

The handoff is explicit that the brief's rules belong in the data layer, not only in the UI. `src/domain/invariants.ts` is the boundary every record crosses before a screen can show it — `assertDishes` runs over the seed at import, and a violating record throws rather than rendering.

| Rule | Enforced by |
| --- | --- |
| A modern substitute never enters the authentic ingredient list | `findViolations` — cross-checks `adaptation.substitute` against `ingredients` |
| Fusion carries no score, no method, no equipment, and links back to the tradition it borrows from | `findViolations`, and the `isFusion` branch in `dish/[id].tsx` that renders *only* the explanation |
| Popularity and authenticity are never combined into one ranking | `score` and `views` are separate fields; `searchResults` sorts by one or the other, never a blend |
| Videos are ranked by the cook's closeness to the tradition, not by views | rank must be a clean 1..n; no engagement figure is stored on a video at all |
| Where evidence is thin, the record says so | a scored record must carry all six evidence dimensions, a disclaimer and at least one source |
| Absence is stated, not filled | every empty state is worded as an absence of *records*, not of food |
| A dietary classification is checkable and never overclaims | `basis` is required; a "vegan" record carrying dairy is rejected; meat and seafood must name their kind |

## Translation

The atlas is global, so a record has to be readable in the reader's language. Three things make that compatible with the brief rather than a violation of it:

1. **Names are never translated.** The dish name, every traditional ingredient and every piece of equipment are preserved verbatim — `chilhuacle negro` does not become `poblano`, `khökhüür` does not become `leather bag`. A gloss may sit *alongside* the original term. Swapping in a locally familiar equivalent is the same silent customization the brief forbids, just performed by a dictionary.
2. **Provenance is always stated.** Every translated view says who translated it and whether a human checked it. Machine translations are labelled as such and the original is one tap away.
3. **Absence is stated, not filled.** With no translation service connected, the app shows the original and says so, rather than quietly guessing at a fermentation time.

Translations are checked before they are shown (`assertPreserved`): a response that dropped a step, renamed a preserved term, or altered a number is rejected, not displayed.

### Connecting a translation service

Real-time translation needs one environment variable:

```bash
EXPO_PUBLIC_TRANSLATION_ENDPOINT=https://your-api.example.com/translate
```

Point it at **your own backend route**, not directly at a model provider — `EXPO_PUBLIC_*` values ship inside the app bundle, so an API key placed there is readable by anyone who downloads the app. The route should accept `{ prompt, target }` and return `{ text }`; `buildPrompt` in `translationProvider.ts` carries the preservation rules and is worth reading before you swap providers.

Without it, everything else works and the translation UI says honestly that no service is connected.

### Video

Videos always open **at their source** — no embedding, no proxying, no autoplay, and no synthetic dub over the cook's voice. The language preference is passed to the provider, which serves, in order: a creator-published audio track, the provider's auto-dub, auto-translated captions over the original audio, or nothing. The card states which one you are getting.

## Design system

Nocturne, ported to `src/theme/tokens.ts` — every colour, size, radius and shadow traces to a `--token` in the handoff's `styles.css`. Nothing hard-codes a hex.

Two behaviours need real CSS on web (`src/theme/webStyles.ts`): the page ground, and `mix-blend-mode: lighten` on photographs, which react-native-web drops from its style resolver. On native both are style props.

Classification colour is carried by the emoji glyph only (🟢🟡🟠🔴⚪) — the chips stay neutral or accent, and every classification is conveyed by text as well as glyph, so colour is never the sole cue. Icon buttons are padded to a 44px tap target (the prototype draws 36px).

## Data — two tiers, kept distinct

The catalogue is **~7,900 dishes across 240+ countries**, in two tiers that never blend. Coverage and evidence are not the same thing, and the tiering is what stops an imported record borrowing the standing of an assessed one just by sitting next to it.

**Curated** (`src/data/seed.ts`) — six records that have been through the evidence assessment: Kozhikode Halwa, Oaxacan Mole Negro, Neapolitan Pizza Margherita, Hawaiian Pizza (Fusion), Hákarl and Ayrag. Real sources, real videos, Wikimedia photographs, a confidence score, a dietary reading and the occasions they're eaten at. Several photos are CC BY-SA, so **attribution is displayed wherever the image appears**.

Per the handoff, **confidence scores in the seed are illustrative**; in production they come from the seven evidence checks and community validation. The translator credit on the Spanish mole translation is illustrative in the same way.

**Imported** (`src/data/catalogue.json`) — everything Wikidata classifies as a dish or food with a country of origin. Every one lands as `⚪ Unverified`: it asserts that the dish exists and where it's associated with, and nothing else. No score, no method, no ingredients, no dietary classification, no meal occasion. Browsable through the **Unverified** and **All** chips.

```bash
node scripts/ingest-wikidata.mjs
```

The public SPARQL endpoint times out on a fraction of countries each run, so the importer is resumable — results merge by Wikidata id, and this tops up whatever was missed:

```bash
node scripts/ingest-wikidata.mjs --missing
```

Rows are stored compact and expanded by `src/data/catalogue.ts`; the shared boilerplate is applied once at load rather than repeated ~7,900 times, which is the difference between a 1.5 MB and an 11 MB app bundle.

## Filtering

Four axes, all composing, none of them altering a record:

- **Authenticity** — the chip row from the brief, plus `Unverified` for the import.
- **Place** — the country → region → province → city → village drill-down.
- **Diet** — Vegan / Vegetarian / Seafood / Non-vegetarian / Not classified, with a sub-menu (poultry, pork, beef, lamb & goat, game; fish, shellfish, other).
- **Meal occasion** — breakfast, lunch, dinner, supper, snack, street food, celebration & feast, any time, not recorded.

Two rules hold these honest:

**Diet is read from the whole preparation, not the ingredient list.** Oaxacan Mole Negro's chips read vegetarian; its method fries in lard and uses turkey broth. Every classification carries a `basis` string naming what it was read from, shown on the detail screen. Someone keeps halal, kosher or a vow on the strength of this field, so `unclassified` is always available and a guess never is. Choosing Vegetarian includes vegan dishes; choosing Vegan never returns a dish with dairy.

**Meal occasion is recorded in the tradition's own terms.** "Breakfast, lunch, dinner" is one culture's timetable, and forcing every tradition onto it flattens what the app exists to preserve — so `celebration` and `any time` are first-class answers, and each record keeps a note giving the occasion as it actually is: iftar, Þorrablót, the midday comida. A dish whose occasion isn't recorded never pads out a "breakfast" list.

Neither filter ever offers to substitute an ingredient so a dish fits a preference. They narrow what you're shown; the record is untouched.

## Not yet built

**A backend.** The catalogue currently ships inside the app bundle, which works at ~7,900 records and will not at ten times that. A real deployment wants the catalogue in a database behind a search API, with the import running as a scheduled job rather than a local script. Everything in `src/domain` is pure and has no idea where the data came from, so moving the source is a change to `src/data/`, not to the app.

**The evidence pipeline** the screens are the front end for: recipe discovery, video discovery and locality re-ranking, evidence scoring, community-validation routing, and dispute forking. `src/domain` holds the vocabulary these need (`EVIDENCE_CHECKS`, `SCORE_DIMENSIONS`, `VIDEO_LOCALITY_ORDER`, `VALIDATIONS_REQUIRED`) so the rules stay in one place when the backend arrives. This is what turns an `Unverified` import into a classified record.

Also stubbed: bookmarking, the "capture the ingredients from this video" action, and the contribute form's submit (the flow is a walkthrough, as in the design).

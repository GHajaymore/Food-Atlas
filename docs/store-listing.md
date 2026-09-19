# Store listing — App Store and Google Play

Drafted 2026-09-18 for version 1 (browse-only). Every figure below was measured from the
catalogue on that date; re-measure before submitting if the data has changed:

```bash
npm run verify:prerender
```

Rules the copy follows, because the stores publish it word for word:

- **No figure that has not been measured.** 17,362 dishes, 161 countries, 4,480 with a
  written method, 7,749 photographed, 13 interface languages.
- **Half the atlas is a name and a place**, and the copy does not pretend otherwise.
- **Nothing is called authentic** — the app's own rule is that only people from the place
  can make that claim, and nobody has yet.
- **No feature the phone app does not have.** Proposing a dish is on the website.

Character limits are checked by `scripts/check-store-listing.mjs`.

---

## App Store (Apple)

### Name — 30 max
```text
WikiFoodia
```

### Subtitle — 30 max
```text
Traditional food, with sources
```

### Promotional text — 170 max
```text
17,362 dishes from 161 countries. Every record shows where it is from, who says so, and how much has actually been established. Free, no ads, no account.
```

### Keywords — 100 max, comma-separated, no spaces after commas
```text
recipes,food,cuisine,dishes,traditional,world food,heritage,culture,cooking,atlas,regional,history
```

### Description — 4000 max
```text
WikiFoodia is a free atlas of traditional dishes: where each one comes from, and who vouches for it.

It holds 17,362 dishes from 161 countries. For each one it tells you where it is from and what is actually known about it, and it says just as plainly what is not.

WHAT YOU CAN DO
• Browse the world by continent, country and region, down to the town where a dish is from.
• Search by dish, place or ingredient — in the plural, with or without accents, and under the spellings people actually use.
• Read 4,480 written methods, and look through 7,749 photographs.
• See the dishes that sources describe as declining, and the traditions still waiting for someone to write them down.
• Use the app in 13 languages.

EVIDENCE, NOT OPINION
Where there is something to measure, a dish carries a score out of 100, built from six checks you can read on the record: its place, its ingredients, its technique, a local source, its documentation and community confirmation. The number is there to be added up, not trusted. Where there is nothing to measure yet, no score is shown at all.

Published sources can take a record only so far. The top level, Authentic, is reserved for dishes that people from the place have confirmed — so for now nothing in the atlas is called authentic, and it says so.

HONEST ABOUT WHAT IS MISSING
About half of the atlas is a name and a place, and nothing more. Those records are shown as they are, with a note that nobody has written them down yet. If you know how one is made, you can propose it on the website.

WHERE IT COMES FROM
Records are drawn from Wikipedia, Wikidata, Wikibooks, UNESCO's lists of intangible cultural heritage and the European Union's register of protected food names. Every record names its sources and links to them. Photographs come from Wikimedia Commons and carry their credit and licence.

FREE, AND STAYING THAT WAY
No ads. No account. No in-app purchases. The app collects no data about you.

WikiFoodia is made by AjAi Labs.
```

### What's new — version 1.0
```text
The first release of WikiFoodia on your phone: the whole atlas, search, and all 13 languages.
```

### Other fields

| Field | Value |
|---|---|
| Primary category | Food & Drink |
| Secondary category | Reference |
| Age rating | 4+ — no user-generated content in the app, no ads, no purchases. Answer "No" to unrestricted web access: a link opens that one page in the system’s in-app browser (Safari View on iPhone, a Custom Tab on Android), which shows the address but has no way to type one. |
| Price | Free |
| Support URL | https://wikifoodia.ajailabs.app/support |
| Marketing URL | https://wikifoodia.ajailabs.app |
| Privacy policy URL | https://wikifoodia.ajailabs.app/privacy |
| Copyright | 2026 AjAi Labs |
| App Privacy | **Data Not Collected** |
| Sign-in required for review | No |

### Notes for the reviewer
```text
WikiFoodia is a free reference atlas of traditional dishes. It has no accounts, no sign-in, no purchases and no user-generated content in the app. It downloads the atlas's data from https://wikifoodia.ajailabs.app on launch, so the first open needs a network connection. Proposing a new dish is done on the website and is not part of this app.
```

---

## Google Play

### App name — 30 max
```text
WikiFoodia
```

### Short description — 80 max
```text
A free atlas of 17,362 traditional dishes from 161 countries, with sources.
```

### Full description — 4000 max

Same text as the App Store description above.

### Other fields

| Field | Value |
|---|---|
| Category | Food & Drink |
| Tags | Food, Reference, Culture |
| Contains ads | No |
| In-app purchases | No |
| Content rating | Everyone (complete the IARC questionnaire: no violence, no user interaction, no purchases, no location) |
| Target audience | 13+ — keeps the app outside the Families policy, which it has no reason to be in |
| Data safety | **No data collected. No data shared.** Data is encrypted in transit (HTTPS). |
| Privacy policy | https://wikifoodia.ajailabs.app/privacy |
| Contact email | contact@ajailabs.app |
| Website | https://wikifoodia.ajailabs.app |

---

## Screenshots — still to capture

They need the device build from step 2 of `docs/app-stores.md`. What to show, in order:

1. A photographed record with its six checks — the thing that makes the app different.
2. Search, mid-query.
3. The Food Atlas, grouped by continent.
4. A record that is only a name and a place, with its note — the honesty is the point.
5. The language picker.

Sizes: iPhone 6.9-inch (1320 × 2868) and Android phone (1080 × 1920 or larger).

## Why the privacy answers are "nothing collected"

The phone builds leave the proposals address empty (`eas.json`), which switches off
sign-in, proposing and the anonymous view counter together. The only requests the app
makes are for the atlas's own data files and for photographs from Wikimedia Commons, and
neither carries anything about the reader. If a later version adds sign-in, both answers
change and must be updated before that version is submitted.

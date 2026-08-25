# Queue

What has been asked for and not yet done. Newest requests at the top of each section;
anything finished moves out rather than getting a tick, because a list of completed work
is what git log is for.

---

## Waiting on Ajay — nothing else can happen until these do

**Deploy to Cloudflare Pages.** Everything built since 2026-08-23 runs only on a laptop
until this happens. `docs/deploy.md` has the three build settings. Then:

```
  npx wrangler d1 create wikifoodia          # paste the id into wrangler.toml
  npx wrangler d1 migrations apply wikifoodia --remote
  npx wrangler pages secret put IDENTITY_SECRET
  npx wrangler pages secret put ADMIN_TOKEN
```

**Cloudflare Web Analytics**, if visitor counts are wanted. Free, cookieless, and the
only honest way to answer "how many people" — see the foot of `functions/api/events.ts`.

**Donations on "Keeping it free" — already built, switched off.** Ajay asked for this on
2026-08-23, and it is worth knowing it needs no code: `src/domain/support.ts` already has
`OPEN_COLLECTIVE_SLUG`, `DONATION_URL`, `LEDGER_URL` and `canAcceptDonations()`, and
`app/support.tsx` already renders either the donate and ledger buttons or an honest
"Not open for donations yet" card. Everything is behind one environment variable:

```
  EXPO_PUBLIC_OPENCOLLECTIVE=<the collective's slug>
```

**Only Ajay can supply it** — it means creating an Open Collective, which is free for
open projects and takes a fiscal host. The platform was chosen deliberately over a
payment link: every contribution and every expense is published, so the page's claims can
be checked against a public ledger rather than believed. That is the same stance the
badges take, applied to money.

Worth deciding at the same time: the app currently says *"no money collected"* on the
front page. The moment donations open, that sentence needs the same treatment "no
accounts" got — narrowed to what remains true, rather than left to rot.

---

## Decisions only Ajay can make

**User logins — still open, and raised again 2026-08-23.** Ajay asked how we can know the
same person is not confirming a dish twice under two names, and the honest answer is
**we cannot.** Identity today is a signed HttpOnly cookie: it stops a double-tap, a
refresh and a hand-edited cookie, and it does not stop three private windows. That is
documented in `functions/api/proposals/_middleware.ts` and it is the weakest point in the
authenticity model, which is the one claim this project makes that nobody else does.

He has said he has no objection in principle. What is needed is a decision on shape,
because the three options are not equivalent:

1. **Sign-in required to confirm.** Strongest, and it puts a Google account between the
   grandmother in Kozhikode and the dish she has cooked for fifty years. The people this
   feature exists to reach are the least likely to have one.
2. **Sign-in optional; only signed-in confirmations count toward the badge.** The
   recommendation. Anonymous confirmations still display — they are evidence a reader can
   weigh — but `validationsOf()` counts only verified ones, so the number the badge rests
   on is defensible while the door stays open. `assess()` is untouched; one function
   changes.
3. **Leave it.** Defensible only if the badge is understood as "three people said so",
   not "three different people said so", and the app should then say that plainly.

Whichever is chosen, **the front page says "no accounts" in four places** and that
wording has to change with it. That sentence is why this is a decision rather than a
task.

Google sign-in is free and needs no billing account. The seam is one file: replace
`personId` in the middleware and every index keeps working unchanged.

**The heritage branch gives Authentic at score 35.** A heritage designation plus
ingredients classifies Authentic — Regional through a branch that never reads the score,
so the same badge appears on a record scoring 35 and one scoring 58. Defensible — a PDO
*is* institutional recognition — and confusing. Verified by tracing the real ladder.

**`PROPOSAL_CONFIRMATIONS = 3`.** A dish known to four people in one village, none of
whom use the app, will never get in. Three is a starting position, not a finding.

---

## The positioning, which most of the design work should serve

Ajay, 2026-08-23: *"We need to differentiate from social media or any other food website
and highlight the authenticity of the content, the food and the source. Also ask help
from the community to come together and save the authenticity and confirmation of the
tradition."*

This is the brief the rest of the redesign should be measured against, so it goes above
the screen-by-screen work rather than beside it.

**What actually makes this different, stated as things no competitor can copy cheaply:**

Every food site on the internet shows a photograph, a name and a recipe. So does this
one, and if that is what a reader sees first there is no reason to choose it. The
differences are all things the app currently *has* and does not *lead with*:

- **A score anybody can check.** Six dimensions, printed on the record, adding to a
  number. No other food site shows its working, because no other food site has any. A
  reader who doubts 58 can add up 70, 65, 50, 60, 0, 100 themselves.
- **A ceiling on what documents can prove.** Published sources cannot pass 43; the badge
  starts at 55. That gap is arithmetic, not policy, and it is the single most unusual
  claim here: *we will not call a dish authentic because a book said so.*
- **Confirmations that are shown, not counted.** "Priya, born in Kozhikode — we use ghee,
  not oil" is evidence a reader can weigh. A star rating is not.
- **10,197 records that say nobody has written this down.** Every other site hides its
  gaps. This one leads with them, because the gap is the reason to help.
- **Every source named and linked.** Wikidata, UNESCO, the EU register — a reader can
  leave and check.

**What the app does with that today: not enough.** The front page says "Every dish here
shows its evidence" and then shows a grid of photographs that looks like any food site.
The badges are small, the score is a number in the corner of a card, and a first-time
visitor has no idea that the scale is the product.

**Concretely, for the design pass:**

- ~~The **badge and score belong on the card**~~ **Done, 2026-08-24.** `EvidenceBadge` on
  every density — rails, rows and the full card. The full card was the last holdout,
  printing "Authenticity 94/100" as a 12px accent sentence in the weakest position, in
  the same register as a view count.
- **A first-run explanation of the scale** — what the six dimensions are and why a
  document cannot pass 43 — shown once, not buried in a disclosure.
- ~~**The ask should be specific and near.**~~ **Done, 2026-08-24.** A record now reads
  "Nobody has yet. The badge requires 3, so 3 more people connected to Kozhikode would
  meet it." It states the **necessary** condition and never the sufficient one —
  promotion needs the score too, so "two more people will make this Authentic" would be
  false, and tests assert the line never says "will" and never says Authentic.
- **Show the ladder moving.** A record that gained a confirmation this week, a dish that
  reached Authentic — proof that participation does something. Requires the deployment
  before it can be real, and must never be faked.
- ~~**Name what this is not**~~ **Done, 2026-08-24**, on the front page. Worth knowing
  what it does *not* say: "nothing here measures your attention" was written first and is
  **false** — `events.ts` counts a dish opening. The shipped line is narrower and true:
  openings are counted as a dish and a date, never as a person.

---

## Next up

**Sub-grouping a country's traditions, not a continent's.** Ajay asked whether continents
should hold regions. Measured before answering: the largest continent group is Europe at
51 origins, which is about seventeen rows across three columns — already scannable in a
glance, and the collapse added on 2026-08-24 solves the long-page problem more cheaply.

Two reasons not to do it at continent level:

- **Nothing needs dividing.** A heading layer costs vertical space and a click to split
  something that fits.
- **Which scheme?** "Southeast Asia", "the Levant", "the Middle East" are contested, and
  the atlas would be asserting a taxonomy it cannot cite. `Elsewhere` already records
  what that costs: origins like Levant and Mesoamerica were kept out of the country count
  because calling them countries put thirty-two imaginary ones on screen. UN M49 is the
  defensible standard and it files Iran under Southern Asia and Cyprus under Western
  Asia, both of which will read as errors to plenty of readers.

**Where it would earn its place is one level down.** India holds 1,014 traditions and
Italy thousands; those are the lists that are genuinely hard to scan. And the labels there
come from the records themselves — `loc.region` — rather than from a scheme imposed on
them, so the atlas would be grouping by what it was told rather than by what it decided.

Worth checking first: how many of a large country's records actually carry a region.
Grouping on a field that is empty for most of them would produce one enormous "elsewhere"
pile and prove nothing.

---

## Next up (previously)

**The body prose, which is still English in every language.** Ajay, 2026-08-24: *"Some
portion of the screens still show some sections in English when another language is
selected."* He is right, and it is a line I drew too conservatively rather than an
oversight.

Measured with Español selected, counting blocks of visible English longer than 30
characters:

```
  /how          21        /propose       6
  /support      17        /proposals     5
  /atlas        13        /search        3
```

**What was translated and what was not.** The chrome pass took headings, buttons, labels
and placeholders — 139 keys — and deliberately left the *arguments*: "That is the rule
this atlas is built on, and it is arithmetic rather than a policy", the coverage
paragraph, the funding explanation. The reasoning was `copy.ts`'s rule that a loose
translation of evidence misstates a record's standing.

**On reflection that rule does not reach this text.** It protects claims about *a
particular record* — a disclaimer, a score, "nobody has confirmed this". The paragraphs
above are the app explaining its own model, which is the app's own words about its own
software, and the whole interface already carries `interfaceTranslationNote` saying it
was machine-translated and unchecked. The same disclosure covers these.

**So they should be translated**, with two exceptions that keep the original rule:

- Anything rendered from a **record** — disclaimers, score explanations, the confirmation
  ask. Those come from the data layer, not from these screens.
- The **example placeholders** made of dish names, places and ingredients.

Roughly 65 blocks × 12 languages. Long prose is also where a machine translation does the
most damage, so it is worth doing in batches with the arithmetic-bearing sentences —
the 43 ceiling, the three confirmations — checked hardest.

---

## Next up (previously)

**A translation provider that is free at this volume.** Ajay, 2026-08-24. Everything else
is built and switched off behind `EXPO_PUBLIC_TRANSLATION_ENDPOINT`; this is the last
missing piece for records and confirmations.

**Recommendation: Cloudflare Workers AI, because the atlas is already deploying there.**
Checked against Cloudflare's own pricing page, 2026-08-24:

```
  free allocation      10,000 Neurons per day, resetting 00:00 UTC
  beyond it            $0.011 per 1,000 Neurons
  @cf/meta/m2m100-1.2b 31,050 Neurons per million tokens, input and output
```

What that buys, at roughly 500 tokens in and 500 out for a record's prose:

```
  one record        ~31 Neurons     →  ~320 records a day, free
  one confirmation   ~2.5 Neurons   →  ~4,000 a day, free
```

Translate-on-read and cache never needs more than that: only records somebody opens get
translated, each is translated once, and the whole catalogue would take about eight weeks
of ordinary reading to cover at zero cost.

**The part that matters for [[wikifoodia-free-constraint]]:** stay on the Workers **Free**
plan. With no payment method the allocation is a hard stop rather than a bill — which is
the property this project needs, and it should be confirmed before switching on rather
than assumed. It also fits the existing design: `translationProvider` already expects
"your own backend route that holds the API key", and a Pages Function is exactly that, so
no key ever reaches the bundle and no second vendor is involved.

**The alternatives, for the record:**

| | free allowance | why not first choice |
|---|---|---|
| Microsoft Translator | 2M chars/month | a second vendor and a billing account |
| Google Cloud Translation | 500k chars/month | same, and a card on file |
| DeepL | no renewable free tier as of 2026 — Developer is a one-off 1M chars | not a standing free tier |
| MyMemory | 5k chars/day, 50k with an email | mixes crowdsourced memory; not for production |
| LibreTranslate | free to self-host | a server is $20–50/month, so not free at all |

**Measure this before switching anything on:** how many records carry `sourceLanguage`.
It is what stops the app translating English into English, and if most records lack it the
first thing a provider does is spend the allocation on no-ops.

---

## Next up (previously)

**Reading a proposal or a record written in another language.** Ajay, 2026-08-24: *"How
can the English or Hindi user read if someone proposed in a different language? Or the
original recipe is in a different language."*

The right question, and the honest answer today is **they cannot**, in two different ways
with two different fixes.

**A proposal or confirmation.** `Testimony` already offers a translation beside the
original and refuses to replace it — built 2026-08-24 — but it is inert because
`EXPO_PUBLIC_TRANSLATION_ENDPOINT` is unset. Setting that switches it on. The design
question is settled; only the provider is missing.

**A record's own prose.** Worse, because there is no per-record control at all: a record
imported from the Malayalam or Japanese Wikipedia shows its account in that language and
the reader gets no offer. `translate.ts` and `state/translations.ts` already do this
properly — `readDish` resolves a record into the reader's language, states who translated
it, and refuses to touch names, ingredients and equipment — and it is wired into
`/dish`. So the machinery exists and is off for the same reason.

**What is actually missing is a provider that is free at this volume.** Full DeepL was
priced at $8,700 for the catalogue, which [[wikifoodia-free-constraint]] rules out.
Translate-on-read and cache changes the shape: only records somebody opens get
translated, and each is translated once. That is the version worth pricing.

**One thing to check before switching it on:** `sourceLanguage` is what stops the app
translating English into English. Worth measuring how many records actually carry it —
if most do not, the first thing a provider would do is waste requests.

---

## Next up (previously)

**Everything in the chosen language, proposals included.** Ajay, 2026-08-24: *"If user
selects a language, I would like entire website or all content shown in that language
including proposal."*

Three separate jobs wearing one sentence, and they are not equally easy or equally safe.

**1. The rest of the chrome — straightforward, just unfinished.** `/how`, `/support`,
`/contribute`, `/propose`, `/browse`, `/place` and `/admin` still hold their sentences
inline. Same work as the nav: extract, translate, wire. No decision needed.

**2. The 17,774 records — the expensive one.** Their prose is not ours; it is Wikipedia's,
Wikibooks', UNESCO's. Full machine translation of the catalogue was priced at
**347M characters ≈ $8,700 with DeepL**, which [[wikifoodia-free-constraint]] rules out.
The only shape compatible with collecting no money is translate-on-read and cache, behind
`EXPO_PUBLIC_TRANSLATION_ENDPOINT` — already built, already switched off, still needs a
provider that is free at this volume. `translate.ts` already refuses to touch dish names,
ingredients and equipment, which is correct and must survive whatever is chosen.

**3. Proposals — needs a decision, and the default answer is no.**

A proposal is somebody's testimony about their own food: *"we use ghee, not oil — my
grandmother made it at Eid."* Machine-translating that and showing it to a reader as the
record's evidence is the thing this project refuses everywhere else. `copy.ts` states the
rule in its own header — *a loose translation of "nobody has confirmed this" misstates a
record's standing* — and a confirmation is the strongest evidence the atlas holds.

There is also a fairness problem in the other direction: leaving proposals in the
submitter's language means a Spanish reader cannot judge a Malayalam confirmation, which
is the same exclusion viewed from the other end.

~~**Recommended shape**~~ **Agreed by Ajay and built, 2026-08-24.** `domain/testimony.ts`
holds the three rules, `Testimony` renders them, and `/proposals` uses it. The original is
rendered first and unconditionally — not in a branch — so a later edit cannot swap it out
without deleting the line. A translation is offered rather than automatic: a record
translates on arrival because the words are the atlas's own, a confirmation waits to be
asked because they are not.

**Still switched off**, like the other metered features: it needs
`EXPO_PUBLIC_TRANSLATION_ENDPOINT`, so the control does not render and the quote shows
alone. That also means the translated path has not been exercised against a real provider
— only the rules have, which is the honest limit of what could be checked here.

**Parts 1 and 2 remain open**: the rest of the chrome, and the 17,774 records.

---

## Next up (previously)

~~**Dish photographs that are not photographs of the dish.**~~ **Done, 2026-08-24.** The
croissant carried `Croissant_(linguistique).png` — a map of the Croissant dialect area of
France, on the recipe for the pastry. `isPhotograph` asks whether a file is a *graphic*;
this needed a different question, what the picture is **of**.

Two rules measured and rejected before the third was written: the file extension (539 of
10,638 photographs are PNG and they are pizza, cheese, agnolotti — it would delete five
hundred real photographs), and any parenthetical in the name (1,291 carry one, mostly
"(cropped)" and "(Madrid)", and a keyword list inside them false-positived on *Sosis
Bandari* and *Gonja (plantain)*).

What works is the vocabulary of the thing itself — map, carte, mapa, chart, diagram,
blason — anchored as whole words including against brackets. Measured across all 10,638:
**10 matches, no false positives.** A dialect map, a railway route map, a species range
map, an 18th-century land plan, a microwave cooking chart, and a football club's
performance chart on the Hamburger record.

---

## Next up (previously)

**A complete audit, and a real navigational and functional test.** Ajay, 2026-08-24:
*"I still see some screens of the website are still having mobile style behavior. Need a
complete audit and real navigational and functional test. I need a real good rich
website."*

This supersedes screen-by-screen patching. What has been done so far is a **technical**
sweep — twelve routes checked for console errors, horizontal overflow and missing
content, all clean — and that is not what he is asking for. Clean of errors and *reading
as a website* are different questions, and only the first has been answered.

What the audit has to cover, and be able to show evidence for:

1. **Every screen at desktop width, looked at.** Not fetched, not measured — looked at.
   The screens that never had a desktop pass are the likely offenders: `/how`,
   `/contribute`, `/propose`, `/proposals`, `/place`, `/dish/[id]`, and the search and
   browse results at wide widths.
2. **Every navigation path walked.** Every link in the header, the footer, the
   breadcrumbs, the facets and the cards, followed to see where it actually lands.
3. **Every flow exercised.** Propose, confirm, contribute, admin, search, pantry, the
   place picker, the language selector.
4. **A written finding per screen** — what is still phone-shaped and what to do — rather
   than a claim that it was checked.

The phone must not regress. That has been the rule through the whole desktop pass and it
still is.

### Findings so far — measured at 1440, 2026-08-24

Measured rather than eyeballed: for each route, the longest line of running text, whether
anything is arranged side by side, the width of every form field, and the page height.
The Browser pane was not displaying, so this is geometry rather than screenshots — which
is the more precise instrument for this particular question anyway.

| screen | finding | verdict |
|---|---|---|
| `/place` | **201 full-width rows, page 9,578px tall** | **fixed** → 2,960px, three columns |
| `/propose` | 8 fields, every one 640px, stacked | **fixed** → pairs at 304px, guidance in a rail, 1,359→1,066px |
| `/contribute` | 6 fields, same | **fixed** → two pairs at 314px, 1,363→1,211px |
| `/how` | 640px column, nothing beside it | **fixed** → prose 720 + rail 320, dimensions in a grid, 1,661→1,330px |
| `/dish/[id]` | two columns, 752px dossier lines | healthy |
| `/proposals` | almost empty — no backend to list | blocked, cannot judge |
| `/`, `/atlas`, `/browse`, `/search`, `/admin`, `/support` | have had a desktop pass | healthy |

**What the two forms need.** Not a second column of fields — a form is not improved by
being made two — but *pairing what belongs together*: Country beside Region, your name
beside your connection. Everything else stays one column at a readable width. The
distinction matters: `/dish` is two columns because identity and dossier are two jobs;
a form is one job with related parts.

**What `/how` needs.** It is a reading page and 640px lines are right. What is missing is
anything in the other half — the six dimensions as a figure, or the score ladder, beside
the prose that explains them.

### Navigation and flows, walked 2026-08-24

Every path clicked as a reader would, and the destination read off the page rather than
off the code.

**Navigation — all correct.** Six header links, eight footer links, each landing on its
route and `back` returning to where it started. Record facets: Kerala → 40 records,
the classification badge → Authentic Only, 46; Vegan → 2; Snack → 4; Cashews → 4.

**Flows — all work.** Atlas → Ghana → the feed filtered to Ghana, 11 recorded. Feed →
place control → picker → Japan → back to the feed, 70 recorded. Search "halwa" → 14
matches → open a record → **back preserves the query and the results**. Pantry "chicken"
→ 60 traditions, most of your list first. Propose with empty fields → *"Still needed: the
dish's name, the country, your name and your connection to the place."* Typing "kozhikode
halwa" in lower case → the duplicate warning offers the existing record. Admin without a
token → "No administrator token." on both the queue and the save; no crash, no silence.

**One defect, fixed.** The breadcrumb's deepest step announced *"Everything from
Kozhikode"* and landed on a page headed "Kerala, India". The destination is deliberate —
a town narrows to its region, because a village page would hold one record — but the
promise was not. Now announces where it goes.

**One thing that is not a bug and reads like one.** The language selector works and
**the result looks broken**: on `/search` it correctly shows "Buscar" and a Spanish
placeholder beside "Find a dish", "Cook with what I have" and "DIETARY PREFERENCE" still
in English, and on the front page nothing visible changes at all. That is the known
half-finished extraction — `useCopy` is wired into NavRow, the feed and search, and
nothing else. **A screen showing two languages at once is worse than one showing the
wrong language**, because the first reads as a fault and the second reads as a limit. It
should be finished or the selector should be hidden until it is; it should not ship as it
stands.

**Not walkable without the backend:** actually submitting a proposal, actually confirming
one, and any admin write. Each can be driven as far as the request and no further.
## Next up (previously)

**User logins.** Ajay: *"if allowing user logins is helpful and may add more value, then
I have no issue"* (2026-08-23). This is the answer to *how do we know the same person is
not confirming twice under different names* — today the defence is a signed cookie, which
stops a double-tap and does not stop three private windows.

Recommended shape rather than a straight login wall:

- Google sign-in (free, no billing) as the identity, replacing `personId` in
  `functions/api/proposals/_middleware.ts`. That file is the only seam that changes.
- **Signed-in confirmations count toward the badge; anonymous ones display but do not.**
  This keeps the door open for the grandmother in Kozhikode who will not create an
  account, while making the number the badge rests on defensible. `validationsOf()`
  filters; `assess()` is untouched.
- The front page says "no accounts" in four places. **That wording has to change**, and
  it is the reason this is a decision rather than a task.

**The website redesign.** Ajay, 2026-08-23: *"Website needs redesign, it still behaves
like an app. Need clickable from everywhere to list the filtered information, nice and
rich content, better look and feel, user friendly."*

**Status, 2026-08-24 — reconciled against the code rather than remembered.** This list
had drifted badly enough to waste time four separate times: hover states, the two-column
record page and search's filter sidebar were all written here as outstanding and were
already built. Anything below is claimed only where it was checked in a browser.

Done: the responsive shell, wrapping grids, a masthead, a two-column hero, larger cards,
a two-column record page (`RecordColumns`) and search sidebar (`SearchColumns`), the Food
Atlas as a real directory (`AtlasColumns`/`AtlasDirectory`), a two-column admin console,
a full-width site footer on every page, the `measure` cap on the five prose and form
screens, hover states on cards, the score on the card at the weight it deserves, and
motion — press, caret, rails rising, photographs fading in.

Verified end to end on 2026-08-24 after all of it: twelve routes at 1440 and five at 375,
no console errors, no horizontal overflow, no missing content.

Still outstanding, and the difference between fitting a desktop and behaving like a
website is mostly one thing:

**Everything shown should be a link to the list it belongs to.** This is what makes a
reference site feel like one, and its absence is why the app still feels like an app. A
country, a region, a cuisine, a category, an ingredient, a badge, a heritage designation
— each is currently *text*, and each is a query the app already knows how to run. On a
record for Kozhikode Halwa, "Kerala" should open every Kerala dish, "ghee" every dish
made with it, "Authentic — Local" every record at that level. The domain layer already
supports all of it: `feedFor` takes a place path, a filter, a diet and meals, and
`searchResults` takes facets. Nothing new has to be computed — the links simply do not
exist.

That also answers "rich content" more cheaply than writing any: a page becomes rich when
everything on it leads somewhere, not when more is added to it.

The rest, in the order it is worth doing:

- **Linkable facets — the record page is done, cards and breadcrumbs are not.** The
  breadcrumb, every ingredient and now **the classification badge** all open the list
  they belong to; the badge was the last fact on the record that led nowhere, and it is
  the product's central claim. `filterKeyFor` maps a level to a filter and is tested,
  because the failure mode is silent — a level with no matching filter sends a reader
  from a badge that is plainly true to an empty list.

  Two things left, and both need a decision rather than just typing:

  - ~~**Diet and occasion cannot be linked yet.**~~ **Done, 2026-08-23.**
    `/browse?diet=vegan&meal=snack` heads itself "Vegan · Snack" and returns 2 records.
    One `diet` field carries both a group and a kind, because a reader clicking "Vegan"
    and one clicking "Poultry" are doing the same thing. Unknown values narrow by
    *nothing* rather than by everything — `?diet=pescatarian-ish` gives "Everything,
    17,828 records" rather than a heading claiming a filter that was never applied.
  - ~~**Facets on cards.**~~ **Decided against, by Ajay, 2026-08-24.** A card stays one
    link to the dish. A link *inside* it means a nested pressable, and on the web a tap
    on the country fires both — so the options were a place link below the card's tap
    area, which adds a row of height to every tile in a grid of 36, or stopping
    propagation, which is fragile on native and makes the targets small on a phone.

    The reason it is safe to close rather than defer: the record page now carries every
    facet — classification, four breadcrumb levels, diet, occasions, ingredients — one
    tap away. A card is a summary, not a dossier. **Do not reopen this by adding a link
    inside a card;** if it ever comes back, it comes back as a row underneath.
- ~~**A record page that is two columns on desktop**~~ and ~~**search with its filters in
  a sidebar**~~ — **both already done**, by `RecordColumns` and `SearchColumns`. Verified
  in the browser at 1440 rather than assumed: search renders facets left and results
  right. This list was stale, not the code.
- ~~**Every remaining screen**~~ **Done, 2026-08-23.** The Food Atlas got `AtlasColumns`
  and `AtlasDirectory`; the admin console got `AdminColumns`; the five prose and form
  screens got the `measure` cap they should always have had. `/contribute` deliberately
  stays a single column — a form is not improved by being made two.
- ~~**A real site footer**~~ **Done, 2026-08-23.** `SiteFooter` — identity, three link
  columns, and the source and licence line — rendered by `Screen`, so no page can be
  missing one. `SiteNav` keeps the phone; the footer returns null there rather than
  printing the same destinations twice.

  It forced a fix to `Screen` worth knowing about: the shell used to cap the whole
  scroll container, which made the footer a child of the reading measure and squeezed the
  site map into 640px on `/support`. The cap now sits on the columns *inside* the
  container, so a page whose article is narrow still has a full-width foot — which is
  true of every publication and could not be expressed while one cap governed the page.
- ~~**Hover states.**~~ **Done, 2026-08-23 — and this entry was wrong.** It claimed there
  were none anywhere. There were: `Pressable` has tinted on hover all along, and every
  element in the app goes through it. Checked with a real pointer rather than by reading
  the code — a directory row, a nav item and a rail card each pick up
  `rgba(233, 233, 237, 0.05)`, and everything carries `cursor: pointer`.

  The real gap was narrower and invisible from the source: **cards**. `Pressable` paints
  its tint on its own background, and a `Card` lays an opaque surface directly on top of
  it — so the dish cards, the main thing anybody clicks, were the one surface that
  swallowed the feedback. They now take a 1px accent outline and a 2px lift. An outline
  rather than a border because a border would shift the layout by a pixel on hover.

  The ring sits outside the `prefers-reduced-motion` guard and only the easing and the
  lift sit inside it: a hover state is not motion, and somebody who asked for less
  movement still needs to know what is clickable.
- **Related dishes on a record** — same country, same cuisine, same ingredient. The
  strongest "rich content" available, and it is all query, no writing.

Worth doing as one focused piece of work rather than appended to a long session: it
touches every screen, and half a redesign looks worse than none.

---

## Done 2026-08-24

**Thirty regions that were not places.** The cuisine source records the branch of
Wikipedia's category tree it walked in `region`, and most of the time that is genuinely a
place — Kerala, Sichuan, Guangdong, Java. Sometimes it is a kind of food, so ~200 records
were filed under **Japan › Wagashi**, **Japan › Sushi**, **South Korea › Tteok** — and
once breadcrumbs became facet links, that breadcrumb offered "everything from Wagashi".

The rule needs three conditions, and the first one alone is dangerous:

1. The string also names a food the atlas holds.
2. **No source other than the cuisine tree calls it a place.** Naming a dish after its
   place is the normal case in food, so condition 1 alone flags *Pithiviers* (a French
   town) and *Phú Quốc* (a Vietnamese island). Corroboration rescues Pithiviers.
3. **It groups at least two records.** A category groups; a town that names one pastry
   does not. This rescues Phú Quốc, the last false positive, at the cost of leaving four
   single-record categories alone — under-removal, the safe direction.

Applied in `build.ts` **before** assessment, not after: `assess` reads `hasRegion`, and
stripping a region afterwards would leave a record scored for a geographic connection it
no longer shows. This app prints the six dimensions and invites readers to add them up.

Still there: **"Japaneseterms"**, a mangled category on 27 Japanese records. It is not a
dish name, so corroboration cannot see it. Left rather than special-cased.

**The cuisine facet is still empty and this did not fix it.** `d.cuisine` is populated on
zero records because `build.ts` reads `row.cuisine`, which the source does not have — the
label lives in `region`. Turning that into a facet needs curation, not a rename: the raw
field holds 1,101 distinct values mixing real adjectives (Cantonese, Sichuan, Peruvian)
with tree artefacts (Japaneseterms, Thaiand snacks, Fish of Korea, Regionals of China).
That is the 27,036-ingredients problem in a different shape, and shipping it raw would put
"Japaneseterms" in a facet.

---

## Done 2026-08-24 (earlier)

**Encyclopaedia articles removed — 50 records.** "Beer in India", "Coffee production in
Vietnam", "Dog meat consumption in South Korea", "Delivery culture in South Korea". These
survived the drinks pass because each names a real food or drink and none is a cuisine
label: they are articles about a country's relationship with a commodity, and there is no
method, no ingredients and nobody who could ever confirm one.

The rule is `<topic of at most three words> in <a country the atlas recognises>`, and both
halves are load-bearing:

- **The tail must be a recognised place.** "X in Y" is how half the cookbook names a
  sauce — "Mussels in Onion and Butter Sauce", "West Lake Fish in Vinegar Gravy". Checking
  the tail against `continentOf` rather than trusting the shape of the string is the same
  instinct that saved the apple and the cheese from the drinks rule.
- **The head must be short.** UNESCO titles are long and several end in a country:
  "Traditional knowledge and skills of sake-making with koji mold in Japan" is an
  inscription, not an article.

Dry-run across all 21,202 records that pass every other rule before the rule was written:
51 caught, and **zero from the cookbook, the catalogue or the EU register** — the three
sources where a false positive deletes real food. That number is what made it safe to
apply. 17,828 → 17,778 live, countries unchanged at 157.

---

## Asked for 2026-08-23, needing a decision before anything is built

**"Remove anything not related to food, like beer, wine etc." — and "one more like
chakna".** Measured before touching anything, and the measurement says a keyword sweep
would be destructive. Of 20,105 rows, 188 have a name matching an alcohol word and 298
match a drink word. But look at what those matches actually are:

```
  Reinette de Champagne              an APPLE variety
  Formaggio bastardo del Grappa PAT  a CHEESE, from Monte Grappa — a mountain
  Penne alla vodka                   a PASTA DISH
  Beaujolais wine                    actually wine
```

Three of the first ten are food that would be deleted by the rule that removes wine.
This is the failure mode this codebase hits more than any other — *right vocabulary,
wrong subject* — the one that put an Italian singer on a Malaysian dish and a tariff
schedule on peanut butter. Any pass here has to corroborate against something the record
already knows, and must be dry-run first: an earlier "X of Y" rule would have deleted 282
real provinces.

**Chakna is food.** One record, from India — a Hyderabadi offal curry. It is eaten *with*
drinks, which is presumably why it came to mind, but it is a cooked traditional dish and
deleting it would remove exactly the kind of regional food this atlas exists for. So the
rule Ajay wants is not "remove chakna": **it needs stating before it can be applied.**
Three candidate rules, which cut very differently:

1. *Remove drinks* — beer, wine, tea, coffee, juice. Would take ~486 records including
   Earl Grey and Libyan tea. Defensible: the app says it is about recipes.
2. *Remove alcohol only* — leaves tea and coffee, takes actual wines and beers.
3. *Remove things eaten with alcohol* — would take chakna, and is not a category any
   source records, so it cannot be applied automatically at all.

Worth noting `isDish.ts` already exists and already refuses non-food; whatever the rule
is, it belongs there rather than in a one-off script.

**The language selector "does nothing" — and that is nearly true.** Diagnosed properly
on the third report, by switching to Hindi and diffing the page. Selecting a language
changes **four lines out of about three hundred**:

```
  Worldwide        → पूरी दुनिया
  MOST LOOKED UP   → सबसे ज़्यादा देखे गए
  Wikipedia readers → विकिपीडिया पाठक
  English          → हिन्दी
```

The picker works. The strings were never extracted. Everything a reader actually
sees — the headline, the five stat labels, the ask, every nav item, the shelf titles,
the whole of `/how`, `/browse`, `/propose` and the record page — is hardcoded English
rather than `copy.*`. Ajay is right to call it broken; from where he is standing it does
nothing.

**Two jobs, and the second is a real decision.**

1. **Extraction** — mechanical, safe, large. Every user-facing string moves into the
   English catalogue. This is the work Ajay parked earlier, and his reasoning was sound:
   each new key means twelve retranslations, so extracting piecemeal is the expensive
   order to do it in.
2. **Translation** — extraction alone makes coverage *worse*, because the twelve
   catalogues sit at roughly 42% of the keys that exist *today*. Adding two hundred keys
   with no translations drops every language to near zero. So the two have to land
   together, and how the translating happens is unresolved: machine translation costs
   money, which [[wikifoodia-free-constraint]] rules out by default, and the existing
   catalogues are already machine-produced and say so.

Until both are done, honesty is the interim answer: the picker already shows a coverage
percentage per language, which is why nobody can pick Hindi and be surprised twice.

**"Desktop still feels like a mobile version. Revisit all the screens and make it more of
a website. The UI doesn't look modern."** Broader than the linkability work above, and
about *look* rather than structure. The record, search, atlas, contribute, support and
admin screens have had no desktop pass at all — only the feed has. Beyond making each
two-column, this is asking for a visual language that reads as current: spacing, type
scale, density, and what a card looks like. Best treated as a design pass over the whole
app rather than screen-by-screen patching.

---

**The mobile app must not be left behind.** Ajay, 2026-08-23: *"I know we are focusing on
improving the website but let's not lose focus on the mobile app. We need to remove that
initial HTML static page behaviour and make it more good looking, attractive."*

Worth being precise about what "static HTML page behaviour" is, because the cause is not
the same as the symptom:

- **The opening screen is a wall of text and controls.** The feed leads with a mission
  block, then a disclosure, then a place selector, then five filter chips, then a diet
  row — a reader meets six rows of chrome before a photograph. On a phone that reads as
  a document rather than an app.
- ~~**Nothing moves.**~~ **Mostly done, 2026-08-23.** The cause was that the only animation
  in the app was three `LayoutAnimation` calls, and `LayoutAnimation` is a no-op on
  react-native-web — so the deployed site had literally none. Now, all in CSS guarded by
  `prefers-reduced-motion: no-preference` and with no new dependency: a press response,
  the disclosure caret turning, rails rising in on arrival, the skeleton's pulse, and
  photographs fading up as they land rather than popping in.

  **Still open:** the disclosure *body* appears instantly, because `LayoutAnimation`
  cannot expand it on web and doing it properly needs a measured height.
- **Photographs are small and secondary.** Cards are 132px thumbnails beside text. The
  atlas has 3,055 photographs and shows them at the size of a favicon.
- ~~**The 14.7 MB wait is unmasked.**~~ **Done, 2026-08-23,** in two halves. `FeedSkeleton`
  replaced the spinner and the blank font hold with one appearance that grows into the
  page — the wordmark, tagline and headline are real from the moment Inter lands, because
  none of them needs a downloaded byte. Then `scripts/inject-preload.mjs` removed most of
  the wait itself rather than dressing it: measured on the built site, against the same
  server with and without the injected links,

  ```
                       no preload      preload
    data fetch starts      892 ms       334 ms
    all five complete    1,721 ms     1,342 ms
  ```

  The cause was that the JSON URLs live inside the bundle, so nothing could ask for them
  until it had downloaded *and executed* — half a second of idle connection on a fast
  local server, and proportionally worse on a real one. Verified there is exactly one
  request per file with `initiatorType: "link"`, i.e. the preload is claimed by the app's
  own fetch rather than downloaded twice.

None of that is fixed by the desktop work — `RecordColumns` and `SearchColumns`
deliberately leave the phone path exactly as it was. This is its own design pass.

---

**The ingredient facet on search, and the cuisine facet that is empty.** Ajay asked
whether search really needs ingredients, since there could be more than the page can
hold, and whether cuisine would be better. Measured:

```
  distinct ingredients   27,036     more values than the atlas has records
  shown in the facet         10     the first ten ALPHABETICALLY
  most common               sugar (340), Salt (177), salt (153), water (152),
                            Salt to taste (148), eggs (131), Flour (125), Sal (122)

  distinct cuisines           0     the facet renders nothing at all
  records with a cuisine      0
```

**He is right, and it is worse than "too many".** Three separate faults:

1. **27,036 options is not a facet**, it is the catalogue again. `allIngredients` caps at
   10 and sorts *alphabetically*, so the search offers ten arbitrary strings beginning
   with a digit or an "A" out of twenty-seven thousand.
2. **The values are not clean.** "Salt" and "salt" are counted separately, "Sal" is
   Spanish, and "Salt to taste" is a quantity phrase. The commonest ingredients are salt,
   sugar and water, which discriminate nothing — every cuisine uses all three.
3. **Cuisine cannot replace it, because no record has one.** `d.cuisine` is populated on
   zero of 17,828 records, so that facet is already present and already renders empty.
   `FacetGroup` hides itself when it has no options, which is why nobody noticed.

**Recommendation.** Drop the ingredient facet from search. Ingredients are still reachable
— and better reached — from a record, where `FacetLink` opens everything made with that
ingredient. Arriving at "everything with ghee" from a dish that uses ghee is a real
journey; picking ghee out of a list of 27,036 is not.

Then populate `cuisine`, which is the facet worth having: Wikidata records it, the field
and the filter already exist, and it is how people actually arrive — *"I want Thai
food"*. That is an ingest, not a UI change.

Worth doing alongside: normalising ingredient strings (case, "to taste", language) would
improve the record pages and the related-dish matching regardless of the facet.

### Browsing by main ingredient — the recommendation

Ajay asked how a reader would see options for the main ingredient. Measured per source,
which locates the problem exactly:

```
  source              rows    distinct    typical values
  Wikidata           1,119       1,834    sugar, eggs, onions, garlic
  Wikipedia infobox  2,418       3,107    Rice, Rice flour, spices
  cookbook recipes   6,336      33,890    "Salt to taste", "1 egg", "½ teaspoon salt", "Sal"
```

**The recipe text is the entire problem.** 33,890 of the 27,036 distinct values come from
cookbook lines, and they are not ingredients — they are quantities, instructions and
translations of "salt". The Wikidata and infobox ingredients are already usable.

**Recommended: a curated staple vocabulary, not a derived list.** Thirty to sixty
defining ingredients — rice, wheat, maize, millet, coconut, chickpea, lentil, cassava,
plantain, potato, fish, lamb, goat, beef, pork, chicken, yoghurt, ghee, olive oil, chilli,
tamarind, and so on — matched against each record's ingredients, case- and plural-folded.

Why curated rather than counted:

- **Frequency gives the wrong answer.** The commonest ingredients are salt, sugar and
  water. Nobody browses for those, and every dish has them.
- **"Main ingredient" is a judgement, not a count.** What makes a dish a rice dish is not
  that rice appears most often in its list.
- **A fixed vocabulary is checkable and translatable.** Sixty terms can be reviewed by a
  person and translated once; 27,036 strings can be neither.
- **It is a real category.** These are the world's staples, which is the same idea
  `tokens.ts` already invokes — the accent colour is described there as "the colour of
  the world's staple ingredient, rice and wheat".

It also improves things beyond the facet: a staple is a far better `related.ts` signal
than a shared "salt", and it gives country pages something to group by.

**Cheap and worth doing first:** normalise before matching — lowercase, strip quantities
and "to taste", trim plurals. That alone collapses "Salt", "salt", "Salt to taste" and
"½ teaspoon salt" into one thing, and it is needed by the record pages regardless.

---

## Smaller, and worth doing

**Indian-language Wikipedias are unread, and there is a lot there.** No Indian-language
wiki is cited anywhere in the atlas: every source is English Wikipedia or a
European-language Wikibooks. Sampling 50 Indian dishes against Wikidata, **80% have at
least one Indian-language Wikipedia article** — 177 articles across those 50, in Tamil,
Hindi, Bengali, Kannada, Odia, Punjabi, Assamese, Gujarati, Urdu, Marathi, Malayalam and
Telugu. None has been read.

`scripts/enrich-native-language.mjs` already handles this and already lists all eleven
Indian languages, correctly preferring a language of the place over a merely large one.
It has simply never been run against these records: **0 India records have
`sourceLanguage` set**, and 120 of 157 in `catalogue.json` have no preparation at all.
Running it is free and is the largest single source of new content available.

**Analytics: only dish opens are counted.** `count()` is wired into the record screen
and nowhere else. Searches, shelves and screens are all in the endpoint's allow-list and
nothing sends them.

**i18n coverage.** Twelve chrome translations exist and the picker now reaches them, but
Ajay's rule stands: finish extracting strings into the English catalogue across every
screen before translating anything else, or each new key means twelve retranslations.
`translationCoverage()` reports where each language stands.

**Stage 0.** A memory fix, not a bandwidth one — 122 MB heap, and the shipped payload is
mostly solved by compression at the host. `docs/architecture.md` says to measure again on
the real host before spending the refactor.

## Design: it reads as generic, and the reason is measurable

Ajay, 2026-08-24: *"give me a proposal of website/app design because I do not want it to
look like build by Claude. need a real good design"*. A proposal was written; nothing has
been changed yet.

The diagnosis is not the colour. `#161826` ground with `#d9a441` grain gold is an
unusual, warm pairing and is one of the better things about the app. The problem is
**type size and the absence of contrast**, and it can be measured rather than argued:

At a 1440px viewport, on the front page:
- **84% of the 442 text nodes render below 14px.** 63 of them are 9px.
- The largest thing on the whole page is 44px, and there is exactly one of it.
- `tokens.ts` defines h1 42 / h2 32 / h3 25 / h4 20 / h5 16 — **h2, h3 and h4 barely
  appear**. The scale exists and is not used.
- `space` tops out at 22.4px (`space[8]`, density 0.70x). There is no large spacing token
  at all, so a desktop page has a phone's rhythm.
- One typeface, Inter, at two weights. Inter is the single most common typeface in
  software built in the last five years, which is most of why the app reads as generic.

`PHONE_WIDTH = 430` is still exported and still describes the design's intent even though
the responsive components now override it per screen.

The proposal, in priority order: a display face paired with Inter (Fraunces or Instrument
Serif, both free on Google Fonts, and `@expo-google-fonts` is already a dependency);
restore the type scale on desktop; add spacing steps above 22px; let the photographs be
large; and make the six-dimension evidence breakdown the app's signature element rather
than a list of numbers.

**Cost: zero.** Google Fonts are free and self-hosted through the existing dependency.

## Translation: the chrome is finished

Batches 1–16 are done. 680 keys across twelve languages, every one rendered by a screen
except two orphans (`traditionalIngredient`, `loadingAtlas`) that have no English twin in
the app and should probably be deleted.

**What the audit reports and what it means.** `audit-v2.mjs` in the scratchpad finds 322
English strings. Almost none of it is chrome:

| where | count | what it is |
|---|---|---|
| `continents.ts`, `countryNames.ts`, `language.ts` | ~130 | country and language names — data |
| `invariants.ts` | 41 | build-time developer assertions, never rendered |
| `admin.tsx` + admin-token errors in `data/` | ~45 | one person's console, English on purpose |
| `assess.ts`, `isDish.ts`, `videoDiscovery.ts`, `photoProvenance` matchers | ~60 | pipeline internals |
| `translationProvider.ts`, `testimony.ts` | 33 | LLM prompts — must stay English |
| `editorial.ts`, `place.ts` | 8 | review and pipeline output, no screen consumer |

**Two things a future batch should know.**

The first scanner only matched JSX text between tags and a fixed list of props. It could
not see strings in ternaries, JSX text spanning two lines, or template literals — it
reported `Metrics.tsx` as containing no English at all. Four gaps were found by reading
the rendered page instead. Use `audit-v2.mjs`, and still check the browser.

Three classes of string are baked into `catalogue.json` at build time and carry English
for all 17,774 records: `badgeLabel`, `photoOrigin`, and the six score-dimension names in
`breakdown`. All three are resolved by matching the English text on the way to the
screen, never by index — a breakdown is data, and an index would silently put the wrong
name on a number.

**Still English and genuinely reader-facing:** nothing known. Record prose — the dish
descriptions, method steps and source notes — is data and still needs the translation
provider (Cloudflare Workers AI recommended, free tier).

## 2026-08-25 — the evidence panel, four English leaks, and the desktop photographs

### The evidence breakdown is now the signature element

`ScoreBreakdown` was six labelled bars in a flat list, and every number on it was true
while the panel said nothing. It now renders a 0–100 track with the documented ceiling
(43) and the Authentic threshold marked on it, then splits the six dimensions into
"documents can answer these" and "only people can answer these", drawing the
people-answered bars outlined rather than filled. The split comes from `answeredBy()` in
the domain so the panel and `/how` cannot drift; both marks are read from settings.

The two tick labels took four attempts and the failures are the useful part. The marks
sit about 25px apart on a real column, so sharing one line put the labels 27px into each
other. A downward offset on the second did not fix it — the first label wraps to two
lines at a readable width and its second line landed on the second label. A row of fixed
height still left 3px, because an absolutely positioned label is outside its row's flow
and `wideType` scales the text but not a number typed into a stylesheet. What works uses
no measured constant at all: a spacer takes the same percentage as the tick, the label
flows after it, and each row is as tall as the label it holds. Verified at 1440 and 375
in English, French and Polish.

### Four screens rendered English the catalogue already held

`keyof Copy` is a string, so a screen that never looks a key up compiles and passes every
test. Found: `LeadDish` printed "photo via" while `copy.photoVia` existed and was used
correctly on the dish screen — the hero card, in all twelve languages; `contribute`
printed its example badge as a literal, inside the screen explaining what badges mean;
the pantry search printed a whole paragraph; `admin` passed an English accessibility
label two lines under the translated label for the same field.

There is now a check in `plumbing.test.ts` that runs the other way round — for every
English value in the catalogue, does that text appear in a screen? **It is proven to fail
on the defect that prompted it**, which the first version was not: the floor was twelve
characters and "photo via" is nine, so the guard written for the bug missed the bug.
Measured at every floor down to six; six costs two extra hits, both in the allow-listed
console. Write the guard, then break the code and watch it fail.

The admin console's Source checks block stays English and is named in the allow-list
rather than left looking like an oversight.

### A figure nobody had counted

The pantry note claimed "about half the atlas has no ingredients listed". Counted, it is
10,429 of 17,774 — **59%** — and it is derived from `catalogueStats` now.

Worth recording how the number was got wrong twice. The first count said 86%, taken from
`public/data/catalogue.json`, which is one of five source files and is read *before*
`buildCatalogue` enriches ingredients from the cookbook. Only the built catalogue is what
a reader sees. The test asserts a wide band rather than 59, because an enrichment pass is
*supposed* to move it and a test pinned to today's value would fail on success.

### Desktop photographs

Measured at 1440x900 first: the desktop opening screen held no photograph at all — the
first sat at y=951, and all 63 images were 176x176 in a 1,160px column. `FeedOrder`'s
wide branch asserted the opposite in a comment. The first rail now sits above the
controls, and cards follow the phone's own rule applied to the real width — pick how many
a row should hold, and the arithmetic gives the card: five across 1,160 is 220, four
across a tablet's 820 is 192. At 1440x1080 five photographs are fully above the fold
where there were none.

### Open, and needing a decision rather than a fix

**The top navigation overflows at 768.** It needs 683px for its links and gets 569, so
the page scrolls 74px sideways at iPad-portrait width. Pre-existing — confirmed present
with the old card sizes — and left alone because the fix is choosing which links give way
at that width, which is a design decision rather than a bug fix.

Still queued and unchanged: the Cloudflare deploy, Google OAuth, `EXPO_PUBLIC_DONATE_URL`
and the Workers AI binding all wait on Ajay; native locale persistence needs AsyncStorage,
which is a new dependency and should be flagged before it is added.

### The type scale, actually used

Re-measuring after the five proposal moves showed one of the three original numbers had
not moved: "h2, h3 and h4 barely appear. The scale exists and is not used." At 1440 the
front page ran a 71px headline, five 37px figures, and then **nothing at all until 19px**.
The whole middle of the scale was empty.

Two causes, both found by looking at what was in each band rather than at the totals:

**Section headings were eyebrows.** Every rail title used `H6` — the 13px uppercase
tracked label — which put the page's structural headings below its body text. The rails
are the spine of the front page, so their titles are how a reader moves down it. They are
`H4` now: 20 on a phone, 25.6 once `wideType` opens the scale. That also removes the last
uppercase-tracked eyebrow from the front page, which is worth losing on its own — the
device is one of the house styles the brief asked this app not to resemble.

**The display face had almost nothing to do.** Fraunces was on 6 of 437 nodes: one
headline and a wordmark. The dish names on rails were the interface face, though
`tokens.ts` has always said Fraunces is for "anything that names or argues — headings,
dish names", and the grid's `DishCard` already did it. The five figures were too, though
in this app the numbers *are* the argument. Both take the display face now, and Fraunces
went from 6 nodes to 75.

Setting both in one face exposed a hierarchy inversion that had been invisible while they
were different: the phone headline was 25 and the figures 26, so five numbers outranked
the sentence they are evidence for. The headline went to 29 rather than the figures down,
because the figures are also the desktop's 37px band and that one is right.

**Card type follows the card.** `CARD_TYPE` sits beside `CARD_WIDTH` in `layout.ts` so a
card and its name cannot be resized independently — the cards had gone 176 → 220 while
their type stayed where it was chosen for a 132px card.

| | before | after |
|---|---|---|
| nodes in the display face | 6 | 75 |
| text below 14px | 80% | 67% |
| desktop bands ≥ 19px | 71, 37, then nothing | 71, 37.4, 25.6, 19 |
| rail dish name | Inter 13 | Fraunces 15.1 |

**On the 80% figure.** It was 84% in the original diagnosis and is a weaker number than it
looks: of 350 nodes under 14px, about 99 are badge glyphs and photograph credits, which
are correctly small. Counting those as text inflated it. The useful reading was never the
percentage but what sat in the band — which turned out to be dish names and card labels.

Verified at 1440, 768 and 375: no name clamped at any size (the longest in the catalogue,
"Torta di ciliegie della Foresta Nera", still shows whole in two lines on a 152px phone
card), every rail row keeps one distinct y for its place line and its badge, and no page
scrolls sideways.

### The record page

Same measurement, applied to `/dish/[id]` rather than the front page. Two findings.

**The score outranked the dish.** At 36 declared it rendered 51.8 on a desktop, making it
the largest thing on a record page — larger than "Fricot" at 46.1 — and in the two-column
layout the right column starts higher, so it sat 360px *above* the name. A reader arriving
at a record met "27" before they met the dish. The same inversion on a phone: 36 against a
32 title. It is 28 now — 40.3 wide, 28 narrow — which keeps the name ahead by the same
ratio at both sizes and still leaves the score the second-largest thing on the page. It
also takes the display face, for the reason the front page's figures did: in this app the
numbers are the argument.

**One section heading out of four was an eyebrow.** "Related traditions" was `H6` — 13px
uppercase — while "Watch it being made", "Where the method comes from" and "What this
record is" are all `H5`. Now `H5` too.

The four remaining uppercase labels on the page are all the legitimate use of the device:
two card kickers, and the two group labels inside the evidence panel. They label, they do
not announce a section.

| /dish at 1440 | before | after |
|---|---|---|
| largest element | score, 51.8, Inter | dish name, 46.1, display |
| score | 51.8 Inter | 40.3 display |
| section headings | three at 18.2, one at 13 uppercase | four at 18.2 |

### The other nine screens

Running the same measurement across `/atlas`, `/search`, `/how` and `/support` found one
thing wrong everywhere rather than four things wrong separately.

**A page title was smaller than the numbers printed on it.** `NavRow` set every screen
title in `H4` — 25.6 on a desktop — on the ten screens that pass one. `/atlas` therefore
announced itself at 25.6 above three 40.3 figures. Meanwhile the record screen sets its
subject in `H2` at 46.1, so the app named one dish at nearly twice the size it named a
whole section of itself. `NavRow` uses `H2` now. The record screen passes no title to it —
its `H2` is the dish name — so nothing gets two.

That is the same inversion the record page had, fixed from the other end: there the number
came down, here the title goes up. The difference is which one was wrong. A score of 27 has
no business being the largest thing on a page about Fricot; "Food Atlas" has every business
being the largest thing on the Food Atlas.

**`Metrics` figures took the display face**, the third and last place numbers were still
set in the interface face, after the front page's figures and a record's score.

| screen | title before | title after |
|---|---|---|
| /atlas | 25.6, under its own 40.3 figures | 46.1, above them |
| /search, /how, /support, /propose, /proposals, /browse, /place, /contribute, /admin | 25.6 | 46.1 |

**Uppercase labels were left alone where they are doing their job.** `/search` has six —
"Dietary preference", "Sort results by" — and they label control groups rather than
announce sections, which is what the device is for. Same for the two card kickers on
`/how`. The ones worth removing were the ones standing in for headings, and those are gone.

Checked for the case a bigger title breaks: the longest page title in any of the twelve
languages is Portuguese "Acrescentar uma tradição" on `/contribute`, then Hindi on
`/propose`. At 375 the Portuguese one wraps to two lines and is not clipped; the Hindi one
holds one line. Neither scrolls the page sideways.

### The spacing steps, finally used

The third of the proposal's five moves was "add spacing steps above 22px, because a
desktop page has a phone's rhythm". The steps were added to `tokens.ts` — 33.6, 44.8, 67.2
— with a header explaining what they were for, and then **nothing used them**. Zero
references to `space[12]`, `space[16]` or `space[24]` anywhere in the app.

Measured on the front page at 1440 to see what that cost: five rails, each about 1,040px
tall, separated by 26px — two and a half per cent of a section's own height. The dominant
margin on the whole page was 6px, sixty-four times over. All the type work landed on a
page still keeping a phone's rhythm.

`SECTION_GAP` now sits beside `CARD_WIDTH` and `CARD_TYPE` in `layout.ts`, so the three
numbers that change with the window are declared together:

| | phone | tablet | desktop |
|---|---|---|---|
| gap between rails | 26 (unchanged) | 33.6 | 44.8 |

The phone keeps 26 deliberately. It has no room to spend and its rhythm was never the
complaint — the large steps exist for a window with room, which is the whole reason they
are separate steps rather than a bigger scale everywhere.

**The lesson worth keeping is the failure mode, not the numbers.** A token added and never
referenced looks exactly like a token that is working: the file reads as though the job
was done, the diff is green, and the page is unchanged. This is the same shape as the
`photoVia` key that existed while a screen typed out the English, and the same shape as
the four features `SiteNav.tsx` was written to fix. Adding the thing is not wiring the
thing, and only a measurement of the rendered page tells the two apart.

### Contrast, which had never been measured

The design work so far had measured type and spacing and never colour. Every text node in
the app was checked against its real composited background — walking up the tree for the
first ancestor that actually paints, and flattening the alpha, because almost every colour
here is `rgba` over a `#161826` ground and the declared value is not the rendered one.

Six failures, all one token. `color.faint` at 45% alpha measured **3.91** where WCAG AA
asks 4.5 for text at these sizes, and it had exactly three consumers:

- `Mission.free` and `Mission.pending` — "Free, and staying free. No advertising, no
  tracking", and the note that submissions are not open. These are the promises the
  project makes, and they were the lowest-contrast text on the front page: the claims a
  reader has to take on trust, set in the colour reserved for steps you have not reached.
- `contribute`'s intake rail — the labels for steps not yet reached, which is the use
  `tokens.ts` documented the token for.

The first two are now `muted`, which is the token for a secondary line still meant to be
read. The third is `meta`. WCAG exempts inactive controls and the step labels arguably
qualify, but a step rail is wayfinding — its job is telling a reader what is coming, and
there is no point making that too quiet to read.

`color.faint` is deleted. Raising it to a passing alpha would have made it identical to
`meta`, and the app does not need two names for one colour.

| screen | text nodes | failing AA |
|---|---|---|
| / | 437 | 0 |
| /dish | 125 | 0 |
| /atlas | 520 | 0 |
| /contribute | 48 | 0 |

**One thing to keep an eye on:** `color.meta` at 50% measures **4.52** against a required
4.5. It passes by two hundredths. Any darkening of the ground or lightening of the text
token flips a good part of the app's secondary text to failing, and nothing would report
it. If the palette is ever touched, re-run this measurement rather than reasoning about it.

### Unused theme tokens, after all of the above

`space[24]`, `type.h1`, `type.h3`, `font.bold` and `elevation.md` are referenced nowhere.
None is a defect — they are scale steps kept for completeness — but they are recorded here
because `space[12]`/`[16]` sat in exactly that state while the page kept a phone's rhythm,
and the only thing that distinguished "spare step" from "forgotten wiring" was measuring
the rendered page.

### The motion pass

The entrance animation was firing on page load. Measured at 1440: all five rails' rises
were **finished** while four of them were still below the fold — tops at 1,966, 3,051,
4,135 and 5,213 against a fold at 839. Every rail past the first performed its arrival to
an empty room and was sitting still by the time anyone scrolled to it. The six-step
stagger went with it: sections now arrive one at a time, and staggering things already
separated in time only delays them.

`theme/reveal.ts` is written defensively because this is the fourth encounter with the
same failure. It degrades in four steps and the worst one is imperceptible:

1. a frame after mount, anything already on screen reveals on a position check;
2. otherwise an `IntersectionObserver` reveals it on arrival;
3. otherwise a 3s failsafe, created in the same statement that arms the element;
4. and if all three fail, the section is **fully visible, ten pixels low**.

**The animation moves and never fades**, which is what makes step 4 possible — and the
earlier note in `webStyles.ts` was wrong about why. It claimed that omitting the fill mode
made the natural state visible. It does not: a *running* animation renders its own value,
so an animation stuck at currentTime 0 shows opacity 0 with no fill mode anywhere. That is
measured, not theorised — in an embedded browser view whose `document.timeline` never
advanced, every animation reported `running` at time 0 and all 63 photographs were
invisible. `photo-veil` still fades, because a fade is the point there and a real browser
advances its timeline whether or not a tab is focused; the reveal does not, because
movement is the point and there is no reason to pay that risk for it.

**What is verified and what is not.** Verified: nothing is ever hidden, in any state, at
any point; the failsafe reveals everything; the text is readable throughout. **Not
verified: the scroll reveal itself.** The browser pane available here has `document.hidden`
true, a `document.timeline` frozen at 0, and an `IntersectionObserver` that reports nothing
at all — so the happy path could not be observed, only the degradations. It wants a look in
a real browser.

Two false starts, both caught by measuring rather than reading:

- The first version skipped the gate for anything already on screen, measured in the ref
  callback. A ref runs *before* layout, so all five rails reported a top near zero and
  revealed at once — the mount-time behaviour this file exists to replace, wearing a new
  attribute.
- Backticks inside a CSS comment closed the stylesheet's template literal again, reporting
  the error three lines further on. Second time in this session; there is now a note in the
  file saying so.

### Option A applied — the two palette values that were wrong

Ajay chose option A from the colour proposal: keep the theme, fix what measures badly.

**The card surface, #232532 → #2a2d43.** 1.16:1 becomes 1.30:1. Hue 233 either way, so this
is the surface lifted rather than tinted — lightness 21 against the ground's 12. Cards,
form fields, the language dropdown and the feed's tinted panel all draw from this token, so
all four were previously an outline with the page showing through.

**The secondary-text ladder, 55/50 → 64/58.** The old pair measured 5.19 and 4.52 on the
page. On a *card* they measured 4.83 and **4.25** — so `meta` was already failing AA
wherever it sat on a surface, which is most of where card metadata lives. The earlier
contrast sweep missed it because the pages it checked happened to render few cards. The new
pair measures 6.59 / 5.63 on the page and 5.54 / 4.84 on the new card, which is the
tightest ground either lands on.

Two steps, not the three the proposal sketched: the third would have had no consumer, and a
token with no consumer is the failure this file has hosted twice already.

| | before | after |
|---|---|---|
| card against the page | 1.16:1 | 1.30:1 |
| worst text node in the app | 4.52:1 | 5.54:1 |
| text nodes failing AA | 0 on the pages sampled, but `meta` on any card was 4.25 | 0, verified on /, /how, /dish |

**A correction worth recording.** The proposal named **#1f2233** for the new surface and
claimed 1.30:1 for it. That hex measures **1.12** — *darker* than the value it was replacing,
so shipping it would have made the exact problem it was meant to fix slightly worse. The
1.30 belonged to a different candidate in the working notes and was quoted against the wrong
colour. Caught by computing the value before writing it into the token rather than trusting
the proposal it came from.

## The "From United States" rail is showing Korean and Chinese food

Ajay, 2026-08-25, with a screenshot of the front page: *"is this correct?"* No. The rail
headed **From United States** was showing Beef Wellington, Parmo, four Korean dishes and a
breakfast burrito, each card's own place line naming a country other than the heading
above it.

### It is not the shelf, and it is not the origin script

The shelf filter is `d.loc.country === country` and it is doing exactly that: built and
inspected, **0 of the 12 records on the rail have a country other than "United States"**.
Every card genuinely carries that country.

`scripts/fix-origin-country.mjs` exists for the neighbouring problem — the cuisine ingest
assigning a country from the category an article sits under, so pierogi came out Georgian.
A dry run reports **0 records to check**: all 5,256 rows of `cuisines.json` are already
`originChecked`, with 178 contested origins recorded. That pass is finished and it worked.

### It is a duplicate that was never merged

The catalogue holds the same dish twice, under two different countries:

```
Hotteok     South Korea/Korea    |  United States/Korea
Ulmyeon     South Korea/-        |  United States/Korea
Douzhi      China/Beijing        |  United States/China
Huangjiu    China/-              |  United States/China
```

**142 names are held under more than one country.** The origin script corrected one twin
and the other — imported by a different route, never origin-checked — kept the category's
country. `isVaguerDuplicate` did not recognise the pair, so both survive into the
catalogue, and the country rail picks up whichever half matches it. The bad halves all
match "United States", which is why they arrive in a heap on that one rail.

This is the same shape as the fault already recorded in `build.ts`: *"the ordering became
visible when names were sentence-cased and 'pierogi' met 'Pierogi': the atlas held both."*
That was fixed for casing. This pair differs by country, not by name.

### What it costs beyond the rail

- The catalogue total (17,774) counts duplicates, so every coverage figure the atlas
  publishes is overstated by an unknown amount.
- A reader can meet the same dish twice with two different origins and two scores, which
  is precisely the claim the project exists to make carefully.

### What to decide before fixing

Not every same-name pair is a duplicate, and the difference matters here more than most
places. `kabsa` sits under India and Yemen; `fish and chips` under the United Kingdom and
the United States. One of those is a duplicate to merge and the other may be a genuinely
contested origin, which the app already models properly with `originClaims` and must not
resolve by picking a winner. A merge rule that cannot tell them apart would replace a
visible error with an invisible one.

Proposed, not done:

1. Extend the origin check to `catalogue.json` — 2,063 rows carry a URL and none has ever
   been origin-checked. That is where 8 of the 12 rail records come from.
2. Teach `isVaguerDuplicate` the case where two records share a name and one record's
   *region* names the other's *country* — that is the signature of this pair, and it is
   distinguishable from a real contested origin.
3. Re-run coverage after both, since the published totals move.

### The origin pass, extended to the import — and why the dedupe rule was abandoned

**Done: the import is origin-checked.** `fix-origin-country.mjs` took a `--source` and now
runs over `catalogue.json` as well as `cuisines.json`. 2,062 rows checked, 199 contested
origins recorded rather than resolved. The records from Ajay's screenshot moved to where
their own articles say they come from:

```
Beef Wellington    United States -> United Kingdom
Marie Rose sauce   United States -> United Kingdom
Parmo              United States -> United Kingdom
choklate ball      United States -> Sweden
âng-ku-kóe         United States -> China
baozi              United States -> China
```

The rail reads as an American rail now: Po' boy, muffuletta, St. Paul sandwich, sloppy
joe, Bananas Foster, jambalaya, poke, Sno-ball.

**Abandoned: the dedupe rule as specified.** The plan was to teach `isVaguerDuplicate` that
two records sharing a name, where one's *region* names the other's *country*, are a
duplicate. Tested against all 163 groups before writing it, and it is wrong:

```
Pierogi      Poland,  region=People's Republic of China  -> would DELETE the Polish record
Nyama choma  Kenya/region=Tanzania AND Tanzania/region=Kenya -> would delete BOTH
Arepa        Venezuela, region=Colombia -> a real shared claim
Banku        Ghana, region=Benin        -> and the origin pass moves Benin->Ghana anyway
```

It catches 14 of 163 and gets several backwards, because geography cannot tell a
misfiling from a dispute. `build.ts` already says as much: *"where the same dish is
recorded in two countries both records stay, both origin claims stay visible, and nothing
here settles which is first."* That was a deliberate decision and the rule would have
overturned it blind. **Written, measured, rejected, not shipped.**

133 names remain under more than one country, and **0 of them carry recorded origin
claims** — so they are cross-source disagreements, not disputes the pass found. Both files
are now origin-checked, which means each twin's country came from its own article. The
honest resolution is to merge such a pair into one record carrying *both* claims, which is
what `originClaims` already models — not to delete either. That is a design change and it
needs deciding, not guessing.

**Done: the figures.** Every rendered figure derives from `catalogueStats`, so nothing
needed changing in the app. The stale numbers were all in comments and are corrected:
total 17,774 -> 17,748, ingredients 10,429 -> 10,426 of them, share still 59%.

**One country left the atlas: 157 -> 156.** Belize's only record, `chimole`, moved to
Mexico because that is the origin its article states. Six other values also emptied —
Goryeo, the Korean Empire, the Holy Roman Empire, the Kingdom of France, the Sultanate of
Maguindanao, the Confederate States of Lanao — and none of those counts, because
`isCountry` excludes historical states. The exact-count test failed and was meant to: a
published coverage figure moved and a person had to look at why.

**Still visibly odd, and now a display question rather than a data one.** A contested
record keeps the country it was filed under and shows its region on the card, so the US
rail still shows "Tofu — China" and "Chicken à la King — England". The data is right and
says so; the card just puts a place under a heading that contradicts it.

### The card's place line

A card printed the last step of its breadcrumb — the most specific place, which is usually
right: New Orleans beats United States. Under a rail headed **From United States** it was
printing *England*, *China*, *Korea* and *Japanese cakes*.

Two faults in one line of text, and `cardPlace` in `domain/place.ts` handles both:

- **A step that is not a place.** "Japanese cakes", "Anglo-Indian", "Korean pork" are
  branches of a category tree that reached `region`. `notAPlaceBelow` already knows how to
  spot those and is reused rather than re-guessed.
- **A step naming a country somewhere else.** For a contested record this is true and
  recorded honestly — tofu is filed under the United States and claims both China and the
  United States — and still wrong to print under a heading saying United States, because a
  card has no room to explain itself.

In both cases the country is the answer that is certainly true, so the country shows. The
dispute is not hidden; the record page carries every claim.

**The first rule was wrong and the measurement caught it.** "Names a different country"
suppressed 218 records — including **Hong Kong under China**, **England under the United
Kingdom** and **Hawaii under the United States**, 43 records of correct and useful detail,
because each of those is also a country the atlas files under. A card saying England
beneath a heading about the United Kingdom is not a contradiction; it is the reason the
breadcrumb exists.

The test is a different continent, which keeps every sub-national case and catches the
real ones. It under-removes on purpose — Bangladesh under India still shows — and that is
the direction `place.ts` already chose: *"under-removal, which is the safe direction when
the alternative is deleting real geography."* 48 records now, all of them genuine
contradictions.

`WITHIN` handles the handful where a territory sits on a different landmass from the
country it belongs to: Hawaii, Puerto Rico, Guam, Abkhazia, Greenland, Zanzibar. Every
entry was found by running the rule over the catalogue and reading what it removed, not by
trying to recall world geography.

**Still showing: "Bap — Korea" under United States.** That one is data, not display. `Bap`
was origin-checked and deliberately left alone, because its article says "Korea" and the
atlas knows South Korea and North Korea but not a bare "Korea" — and the script's rule is
that a wrong country is worse than a coarse one. Folding bare "Korea" onto South Korea is
an inference the project should make deliberately or not at all; `countryNames.ts` already
warns against exactly that fold for the North.

### Bap, and the fifteen dishes behind it

`Bap` was showing "Korea" under a rail headed *From United States*. It was origin-checked
and deliberately left, and finding out why turned up two real gaps in the reader rather
than one stubborn record.

**The infobox reader could not see a templated field.** It took everything up to the first
newline, which is right for `| country = Japan` and useless for what a well-maintained
article actually has:

```
| country = {{Flatlist|
  * [[North Korea]]
  * [[South Korea]]
  }}
```

It captured the literal text `{{Flatlist` and matched no country at all. The pass reported
those records checked and it had checked them — it looked in the right field and honestly
found nothing it could read. Reading a templated value to the end of its template fixed
`bap` and `bossam`, and incidentally found tofu's full nine origin claims where it had
previously seen two.

**"Korean Peninsula" was not an alias.** Several articles say that rather than naming a
state. The atlas files Korean cuisine under South Korea — its own existing convention,
visible in the 22 records already there — so that is where the alias points.

`--recheck` re-runs rows already marked, which is what a better reader needs.

**Fifteen were left, and needed a different kind of evidence.** Eight have no article at
all and the rest name no origin in a field the reader understands, so `fix-origin-country`
could never reach them. Their `region` says "Korea" while their country says United States
— and the country is the category-derived value this whole exercise has shown to be
unreliable. `scripts/fix-misfiled-country.mjs` promotes the region where the two are on
different continents. 31 records moved: 15 Korean, 9 British, 6 Chinese, 1 Czech.

**Cross-continent is the whole design of that script.** Without the limit it also moves
`sour rye soup` from Poland to the Czech Republic, `alu tikki` from India to Bangladesh and
`matta rice` from India to Sri Lanka. Żurek is Polish and aloo tikki is Indian; those are
neighbours sharing a dish, which is a fact about food rather than a filing error. Korea is
not a neighbouring claim on an American dish. Same discriminator as the card's place line,
and the same reasoning.

Two bugs in that script were caught by measuring rather than reading:

- Resolving the target with the app's general country lookup moved nine British dishes to
  a country called **"England"** and five American ones to a country called **"Hawaii"**.
  The atlas files those under the United Kingdom and the United States, and inventing them
  as countries would have corrupted the coverage figure. It uses `fix-origin-country`'s
  curated alias table instead, read from that file so the two cannot drift.
- The continent map took the last row's word for each country, which is circular: the
  records this script exists to move are the ones carrying a correct continent beside a
  wrong country. "United States" appears against Elsewhere, Asia, Europe and North America,
  so the United States came out in Europe and the cross-continent test silently stopped
  firing. Nine British dishes were skipped and the run looked clean. A majority vote is not
  fooled by twenty-two strays.

The rail now reads: peanut butter and jelly, muffuletta, St. Paul sandwich, chow mein
sandwich (Fall River), yaka mein, fortune cookie, Bananas Foster (New Orleans).

Total 17,740, countries 156. Two records with region "Korea" remain elsewhere and are
correct to: they carry recorded origin claims, so a dispute rather than a misfiling.

### The 122 twins: surfaced, not merged

The recommendation was to merge each cross-source twin into one record carrying both
claims. **Tested before doing it, and it is wrong.**

Only **6 of 122** pairs share a photograph or a source url with their twin. The other 116
have nothing in common that proves they are one record — and the sample is not a list of
mistakes:

```
Pakora       India / Pakistan      Pholourie   India / Guyana
Gulab jamun  India / Pakistan      Pelau       India / Dominica
Kabsa        India / Yemen         Ayran       Pakistan / Iran
```

Those are diaspora and neighbours: a dish two food cultures genuinely make. Merging would
delete a cuisine's claim to its own food, and it would do it irreversibly on the basis of a
shared name. Pakora is Indian **and** Pakistani, and an atlas of the world's food ought to
be able to hold that.

So neither record is deleted and neither is corrected. What was actually wrong is narrower:
each record asserted one country in the largest text on the screen while the atlas quietly
held a different answer on the next page. `alsoRecordedIn` surfaces that, and the record
page now reads:

> **Also recorded under Pakistan** → *The atlas holds a separate record for this dish
> there. Neither is a correction of the other — a dish two food cultures make is not a
> mistake in one of them.*

**Derived, never stored, and deliberately kept out of `originClaims`.** That field means
something narrower and better evidenced: the countries a record's *own article* names,
each carrying the publication that says so. "We hold a second record" is a fact about this
catalogue and no citation at all, and writing it into the sourced field would quietly
weaken a thing the record page presents as sourced.

The 122 remain in the totals. That is a real cost and it is the lesser one: an inflated
count is visible and arguable, a deleted tradition is neither.

**A translation bug came out of the same work.** "culинарные" shipped into the Russian
copy — Latin "cul" spliced onto a Cyrillic word, invisible to anyone who cannot read
Russian and obviously wrong to anyone who can. The prose script's own validator missed it,
because it checked for Cyrillic in non-Russian strings and not the reverse. There is a test
now that refuses any word mixing the two scripts, in any of the twelve languages.

### The record page on a phone: three caveats ahead of the name

The record screen had never been measured at phone size. At 375 a reader met, in order:

```
  63  [photograph]
 322  "Matched by name on Wikimedia Commons — the subject may differ · photo via …"
 372  "⚪ Unverified — insufficient evidence"
 401  "Photo origin unverified"
 429  Pakora
```

Three disclaimers before the name of the thing. This is the same fault as the score
outranking the dish on the desktop record, in a different costume.

The provenance sentence was there because it carried the attribution in full, which is why
the photograph had `hideCredit`. Letting the image carry its own credit — the overlay every
other photograph in the app already uses — satisfies the licence where the licence wants
it, beside the picture, and frees the sentence to move below the title.

```
  63  [photograph]
 291  Rajeeb Dutta · CC BY-SA 4.0      (inside the image, 63–314)
 344  Pakora
 390  ⚪ Unverified — insufficient evidence
```

The name moves 429 → 344 and is the first text after the photograph rather than the
fourth. Desktop keeps its order and its 46px title. Nothing fails AA on either.

**A note on the measurement, not the page.** A probe reported five contrast failures and
they were `<title>`, `<style>` and `<noscript>` — head content, picked up because that
version of the probe had dropped the `getBoundingClientRect()` visibility filter the
earlier audits used. Worth recording because it is the shape of a false alarm that wastes a
morning: the tool changed, not the app.

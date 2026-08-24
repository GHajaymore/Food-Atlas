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

- The **badge and score belong on the card**, at a size that reads as the point, not as
  metadata. A grid where every tile carries "⚪ 12/100" and "🟢 58/100" *is* the
  differentiator, visible before anybody clicks.
- **A first-run explanation of the scale** — what the six dimensions are and why a
  document cannot pass 43 — shown once, not buried in a disclosure.
- **The ask should be specific and near.** "3 people from Kerala can authenticate this"
  on a record beats a general plea on the front page. `nearby.ts` already knows the
  reader's country and `unwrittenIn()` already lists what is unrecorded there.
- **Show the ladder moving.** A record that gained a confirmation this week, a dish that
  reached Authentic — proof that participation does something. Requires the deployment
  before it can be real, and must never be faked.
- **Name what this is not**, once, plainly: no ratings, no comments, no algorithm, no
  advertising, nobody's engagement being farmed.

---

## Next up

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

Done so far: responsive shell, wrapping grids, a masthead, a two-column hero, larger
cards, no duplicated wordmark. That made it *fit* a desktop. It has not yet made it
behave like a website, and the difference is mostly one thing:

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

- **Linkable facets everywhere** — record page first, then cards, then breadcrumbs.
  Needs routes that accept a filter in the URL, which is also what makes a filtered view
  shareable and, later, indexable.
- **A record page that is two columns on desktop**, not one long scroll: photograph and
  facts on one side, method and evidence on the other.
- **Search with its filters in a sidebar** rather than stacked above the results, so a
  reader can see what they are filtering while they read what they got.
- **A real site footer** — the colophon is a phone pattern; a website's foot carries the
  whole map of the site.
- **Hover states.** There are none anywhere. On a mouse that reads as a dead page, and
  it is the cheapest single change on this list.
- **Related dishes on a record** — same country, same cuisine, same ingredient. The
  strongest "rich content" available, and it is all query, no writing.

Worth doing as one focused piece of work rather than appended to a long session: it
touches every screen, and half a redesign looks worse than none.

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
- **Nothing moves.** There are no transitions, no press animation beyond a tint, no
  skeletons while the catalogue loads — just a spinner and then everything at once.
  `Stack` is on the platform default and no screen animates its own content.
- **Photographs are small and secondary.** Cards are 132px thumbnails beside text. The
  atlas has 3,055 photographs and shows them at the size of a favicon.
- **The 14.7 MB wait is unmasked.** A spinner for several seconds on a phone connection
  is the most static thing the app does. Progressive rendering or a first-paint subset
  would change the whole impression, and connects to Stage 0.

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

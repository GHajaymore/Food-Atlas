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

**The heritage branch gives Authentic at score 35.** A heritage designation plus
ingredients classifies Authentic — Regional through a branch that never reads the score,
so the same badge appears on a record scoring 35 and one scoring 58. Defensible — a PDO
*is* institutional recognition — and confusing. Verified by tracing the real ladder.

**`PROPOSAL_CONFIRMATIONS = 3`.** A dish known to four people in one village, none of
whom use the app, will never get in. Three is a starting position, not a finding.

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

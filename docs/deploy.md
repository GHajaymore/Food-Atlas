# Deploying

The atlas is a pile of files. There is no server, no runtime and no database, so
deploying it means copying `dist/` onto a CDN and nothing else.

```bash
npm run build
```

That runs `expo export --platform web --output-dir dist` and produces:

```
  dist/index.html          the single page
  dist/_expo/static/…      the JS bundle, filenames fingerprinted
  dist/assets/…            fonts and icons, filenames fingerprinted
  dist/data/*.json         the catalogue — 14.7 MB, and the whole point
  dist/_headers            cache and security policy      (Cloudflare reads this)
  dist/_redirects          the single-page-app fallback   (Cloudflare reads this)
```

Everything under `public/` is copied to the root of `dist/` verbatim. **That makes
`public/` the published surface** — anything left there is on the public internet.
Four `logo-options*.html` scratch files were found sitting there and reachable on
the live site; working files belong in `docs/` instead.

---

## Cloudflare Pages — recommended

**Because bandwidth is uncapped on the free plan, and this app is unusually heavy
for its size.** Every first-time reader downloads the entire catalogue: 14.7 MB
raw, 2.92 MB after the compression Cloudflare applies automatically. That is fine
for the reader and expensive in the wrong billing model.

| | free-plan bandwidth | visits before it costs money |
|---|---|---|
| **Cloudflare Pages** | **unlimited** | **no limit** |
| Vercel | 100 GB / month | ~34,000 |

At 2.92 MB a visit, Vercel's free tier runs out somewhere around thirty-four
thousand monthly visits. For a project that collects no money, a hosting bill that
arrives *because the atlas got popular* is the worst possible failure mode —
success turning into an invoice. Cloudflare removes that ceiling entirely.

**Setup**, once, in the Cloudflare dashboard — Workers & Pages → Create → Pages →
Connect to Git → `GHajaymore/Food-Atlas`:

```
  Framework preset    None
  Build command       npm run build
  Output directory    dist
```

Nothing else. `_headers` and `_redirects` are already in the build output and
Cloudflare picks them up on its own. Every push to `main` redeploys.

---

## The runbook, in the order that works

Everything below needs a Cloudflare login, which is a browser flow — so these are for
Ajay to run, not for an assistant. **The order matters**: two of these fail if done early.

```bash
npx wrangler login                              # opens a browser
npx wrangler d1 create wikifoodia               # prints database_id
```

**Paste that id into `wrangler.toml` and commit it before connecting the repo.** It ships
today as `REPLACE_WITH_ID_FROM_WRANGLER_D1_CREATE`, and Pages reads `wrangler.toml` for
its bindings — connect Git first and the first build fails on a database that does not
exist. The id is safe to commit: it names the database, it authorises nothing.

```bash
npx wrangler d1 migrations apply wikifoodia --remote
```

Six migrations. Verified against a local D1 on 2026-08-24 — they apply cleanly in order
and produce nine tables, so nothing here should surprise you remotely.

Then create the Pages project (dashboard → Workers & Pages → Create → Pages → Connect to
Git → `GHajaymore/Food-Atlas`) with the three settings above.

**The secrets come after the project exists**, because `pages secret put` writes to a
project and there is nothing to write to before that:

```bash
npx wrangler pages secret put IDENTITY_SECRET   # paste a long random string
npx wrangler pages secret put ADMIN_TOKEN       # paste another
```

Generate them rather than inventing them, and do not reuse one for the other:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Missing either is not a soft failure. Every write endpoint returns 503 rather than
falling back to an unsigned identity — `functions/api/_middleware.ts` explains why
failing loudly is the only safe direction, and it means a half-configured deploy cannot
quietly accept confirmations nobody can trust.

### What works the moment it is live, and what still will not

Live immediately: the whole atlas, search, the pantry, browse, every facet link, the
language selector, and the admin console's read-only views.

Still switched off until their own variables are set, each saying so on screen rather
than offering a dead control:

| variable | what it turns on |
|---|---|
| `EXPO_PUBLIC_OPENCOLLECTIVE` | donations on "Keeping it free" |
| `EXPO_PUBLIC_CONTRIBUTION_FORM_URL` | the `/contribute` submission |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | sign-in, and confirmations counting toward a badge |

**Set any of those and check the value actually reached the bundle** — see the Metro cache
trap below, which cost three rebuilds to find.

---

## Vercel — also configured

`vercel.json` carries the same settings and works today. Keep it: it costs nothing
to leave in place, it makes preview deploys easy, and it means the project is never
captive to one host.

The two configurations must be kept in step. They express the same three decisions
in different dialects:

| decision | `vercel.json` | `public/_headers`, `public/_redirects` |
|---|---|---|
| fingerprinted assets cached for a year | `headers` | `/_expo/static/*`, `/assets/*` |
| catalogue cached an hour, stale for a week | `headers` | `/data/*` |
| every unknown path renders the app | `rewrites` | `/*  /index.html  200` |

---

## Why the catalogue is not `immutable`

It is 14.7 MB behind four filenames that never change, which makes a one-year cache
look obviously correct. It is not. The *content* changes whenever an ingest script
runs, and `immutable` tells the browser never to ask again — pinning a reader to
whatever version they first downloaded, potentially for a year.

`max-age=3600, stale-while-revalidate=604800` is the right shape: a repeat visit
paints from cache with no wait, the new copy downloads in the background, and an
ingest run reaches everybody within the hour.

The JS bundle and fonts *are* `immutable`, and correctly so — Metro puts a content
hash in those filenames, so a changed file is a changed URL.

---

## What deploying fixes on its own

Measured in the browser on 2026-08-23 (see `docs/architecture.md`):

```
  dev server   14.71 MB   Metro sends no Content-Encoding
  any real CDN  2.92 MB   brotli, automatic, free
```

Roughly four fifths of the download cost disappears at deploy time, before any code
changes. This is why the architecture plan now puts deploying ahead of stage 0
rather than after it.

---

## A trap when you set any `EXPO_PUBLIC_*` variable

**Metro caches the inlined value, so changing one and rebuilding can silently do
nothing.** Found the hard way while testing the contribution form locally: setting
`EXPO_PUBLIC_CONTRIBUTION_FORM_URL` and running `npm run build` produced a bundle that
did not contain the URL at all, three times — first passing it on the command line, then
in `.env.local`, then in `.env`. The app went on saying submissions were not open, which
is exactly what it says when the variable is unset, so there was nothing to suggest the
build had ignored it.

```bash
npx expo export --platform web --output-dir dist --clear && node scripts/inject-preload.mjs
```

`--clear` is the difference. Verify rather than trust it — the value is inlined as a
plain string, so it is greppable:

```bash
grep -c "your-collective-slug" dist/_expo/static/js/web/*.js
```

A hosted build on Cloudflare Pages starts from a clean container and does not hit this.
It matters when checking locally that a variable did what you expected, and the failure
mode is the worst kind: the feature stays switched off and the app's honest "not open
yet" message makes it look intentional.

---

## What is not yet set up

**A custom domain.** Both hosts give a free subdomain; a real one is the only part
of this that has ever needed to cost anything, and it is optional.

**`EXPO_PUBLIC_CONFIRMATIONS_URL`.** Until it points at a database, `canConfirm()`
returns false and the confirmation UI stays hidden — the app deploys and works
without it. Set it in the host's environment variables when the shared database
exists. See `docs/confirmations-api.md`.

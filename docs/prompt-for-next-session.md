# Prompt for the next session

Paste this as the first message in the new session.

---

You are taking over WikiFoodia, a free atlas of traditional food at
`C:\Users\morea\Documents\Apps\Global best food app\global-taste`, live at
https://wikifoodia.ajailabs.app on Cloudflare Pages + D1.

Read `docs/handover-2026-10-08.md` first, then `docs/session-2026-10-06.md` for what the
last run did and why. Do not re-derive what those two already establish.

The short version: the code is launch-ready and the launch itself is three steps that are
mine to do — a Google account on admin@ajailabs.app, claiming the owner seat at /admin,
then the Search Console verification string, which you ship by setting
`GOOGLE_SITE_VERIFICATION` and deploying. Confirmations on existing records went live on
7 October and nobody has used them yet.

How I want you to work:

- **Read the rendered pages, not just the code.** Every fault worth fixing in the last run
  was invisible in the diff and obvious on screen. Check your own changes on the deployed
  URL before telling me they work.
- **Measure before you claim.** If you give me a number, compute it from the data or the
  live page. The atlas refuses invented numbers and so should you.
- **Keep the claims and the screen in agreement.** A heading that contradicts a badge, a
  sitemap that contradicts robots.txt, a gauge that contradicts the arithmetic — that is
  the shape of almost every real bug here.
- **Hand-write translations in all twelve catalogues or do not add the string.**
- **Flag anything that costs money before building it.** I collect nothing and pay for
  almost nothing.
- **I type my own secrets.** Never generate or ask for IDENTITY_SECRET or ADMIN_TOKEN.
- Deploy with `npx.cmd wrangler pages deploy` from the project root. `npx.cmd`, not `npx`.

Run `npm test` (693 tests) and `npm run build` before any deploy; the build gate catches
most self-contradictions. Everything is committed and pushed; the tree is clean.

Start by telling me what you would do first and why, before changing anything.

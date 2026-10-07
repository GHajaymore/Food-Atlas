/**
 * Read the output, so nobody has to remember to.
 *
 *   node scripts/verify-prerender.mjs
 *
 * Runs last in `npm run build` and fails it.
 *
 * ## Why this exists
 *
 * Every fault `prerender-records.mjs` has shipped produced a **successful run and a wrong
 * file**. Not one of them threw, and not one changed a count that anybody was watching:
 *
 *   - Recipe markup on **6 records instead of 4,488**, because the step text is fetched
 *     after the first paint and a build script never runs that fetch.
 *   - **8,890 pages falling to 7,607** when the written accounts were deferred too, taking
 *     the sitemap down with them so the two still agreed.
 *   - **5,547 card images reading `Popcorn%209.jpg`** — a stored Commons file name where a
 *     URL belongs, so every link shared into a chat previewed as a blank square.
 *
 * Each was found by hand, late, while looking at something else. The pattern is specific
 * enough to assert: this file makes claims about the records it wrote, and those claims
 * are checkable by opening the files it just wrote.
 *
 * ## What it does not do
 *
 * It does not check that a description is well written or that a photograph shows the
 * right dish — the atlas is careful to say it cannot establish the second. It checks the
 * things that have actually broken: a tag present but holding a value of the wrong kind,
 * a count that quietly halved, two files that should agree and no longer do.
 */

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HERE, '../dist');
const DISHES = resolve(DIST, 'dish');

const problems = [];
const notes = [];

/** Cloudflare Pages refuses a deployment over this, and the atlas is not far under it. */
const FILE_CAP = 20_000;

if (!existsSync(DISHES)) {
  process.stderr.write('verify-prerender: dist/dish does not exist — did prerender-records run?\n');
  process.exit(1);
}

const files = readdirSync(DISHES).filter((name) => name.endsWith('.html'));

const count = {
  pages: files.length,
  title: 0,
  description: 0,
  canonical: 0,
  ogImage: 0,
  twitterImage: 0,
  siteName: 0,
  recipe: 0,
  trail: 0,
  recipeImage: 0,
  article: 0,
  photo: 0,
};

/** A value that is a URL, rather than merely a value. */
const isUrl = (value) => /^https:\/\/[^"\s]+$/.test(value);

const sample = (list, value) => {
  if (list.length < 3) list.push(value);
  return list;
};

/** Record ids these pages link to, so a link into a page that was never written shows up. */
const linkTargets = new Map();
let pagesWithLinks = 0;

const badOgImage = [];
const badTwitterImage = [];
const badCanonical = [];
const badRecipeImage = [];
const emptyAlt = [];
const unparseable = [];

for (const name of files) {
  const html = readFileSync(resolve(DISHES, name), 'utf8');

  if (/<title>[^<]{4,}<\/title>/.test(html)) count.title += 1;
  if (/<meta name="description" content="[^"]{10,}"/.test(html)) count.description += 1;
  if (/<meta property="og:site_name"/.test(html)) count.siteName += 1;
  if (/<div id="root"><article>/.test(html)) count.article += 1;

  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (canonical) {
    count.canonical += 1;
    if (!isUrl(canonical)) sample(badCanonical, `${name}: ${canonical}`);
  }

  /*
   * The three that have actually been wrong. A stored photograph is a Commons file name,
   * and every one of these is a place a file name would look plausible and behave as a
   * broken image everywhere the page is shared.
   */
  const og = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1];
  if (og) {
    count.ogImage += 1;
    if (!isUrl(og.replace(/&amp;/g, '&'))) sample(badOgImage, `${name}: ${og}`);
  }

  const tw = html.match(/<meta name="twitter:image" content="([^"]*)"/)?.[1];
  if (tw) {
    count.twitterImage += 1;
    if (!isUrl(tw.replace(/&amp;/g, '&'))) sample(badTwitterImage, `${name}: ${tw}`);
  }

  const img = html.match(/<img src="([^"]*)"([^>]*)>/);
  if (img) {
    count.photo += 1;
    if (!isUrl(img[1].replace(/&amp;/g, '&'))) sample(badOgImage, `${name}: <img> ${img[1]}`);
    if (!/alt="[^"]{3,}"/.test(img[2])) sample(emptyAlt, name);
  }

  /*
   * The link graph. Each page links to other records so a crawler can walk the atlas
   * rather than reaching 8,883 dead ends and relying on the sitemap alone. A link to a
   * record that was not written here resolves to the SPA fallback — a 200 carrying the
   * wrong page, which is the failure this whole file exists to catch.
   */
  const self = name.replace('.html', '');
  const targets = [...html.matchAll(/href="https:\/\/[^"]*\/dish\/(\d+)"/g)]
    .map((m) => m[1])
    .filter((id) => id !== self);
  if (targets.length) pagesWithLinks += 1;
  for (const id of targets) linkTargets.set(id, (linkTargets.get(id) ?? 0) + 1);

  /*
   * Every JSON-LD block on the page, by its type — a record now carries two: the recipe
   * where there is a method, and the breadcrumb that places it under its country. Reading
   * only the first and assuming Recipe reported 8,858 recipes with no method the moment
   * the trail was added, which is the right failure for the wrong reason.
   */
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const [, json] of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(json);
    } catch {
      sample(unparseable, `${name}: ld+json does not parse`);
      continue;
    }

    if (parsed['@type'] === 'Recipe') {
      count.recipe += 1;
      if (parsed.image) {
        count.recipeImage += 1;
        if (!isUrl(parsed.image)) sample(badRecipeImage, `${name}: ${parsed.image}`);
      }
      /* The one promise `Recipe` makes that this atlas can fail to keep. */
      if (!parsed.recipeInstructions?.length) sample(unparseable, `${name}: Recipe with no method`);
      continue;
    }

    if (parsed['@type'] === 'BreadcrumbList') {
      count.trail += 1;
      const steps = parsed.itemListElement ?? [];
      /* The atlas and the dish, at least; the country sits between them where it has a
         page. A trail whose last step carries an `item` is pointing the page at itself. */
      if (steps.length < 2) sample(unparseable, `${name}: breadcrumb with ${steps.length} step(s)`);
      if (steps[steps.length - 1]?.item) sample(unparseable, `${name}: breadcrumb ends with a link`);
      for (const step of steps) {
        if (step.item && !isUrl(step.item)) sample(unparseable, `${name}: breadcrumb step ${step.item}`);
      }
      continue;
    }

    sample(unparseable, `${name}: unexpected ld+json type ${parsed['@type']}`);
  }
}

const fail = (message) => problems.push(message);

/* Every page must be findable and previewable. These are per-page and absolute. */
if (count.title !== count.pages) fail(`${count.pages - count.title} pages have no real <title>`);
if (count.canonical !== count.pages) fail(`${count.pages - count.canonical} pages have no canonical link`);
if (count.article !== count.pages) fail(`${count.pages - count.article} pages have no prerendered article`);
if (count.siteName !== count.pages) fail(`${count.pages - count.siteName} pages have no og:site_name`);

/* A photograph must appear in all three places or none — they are written together. */
if (count.ogImage !== count.photo || count.twitterImage !== count.photo) {
  fail(
    `the card and the article disagree about the photograph: ` +
      `og:image ${count.ogImage}, twitter:image ${count.twitterImage}, <img> ${count.photo}`,
  );
}

for (const [what, bad] of [
  ['og:image', badOgImage],
  ['twitter:image', badTwitterImage],
  ['canonical', badCanonical],
  ['Recipe image', badRecipeImage],
]) {
  if (bad.length) fail(`${what} is not a URL on at least ${bad.length} page(s): ${bad.join(' | ')}`);
}

/*
 * Every internal link must land on a file that exists. A dangling one does not 404 — the
 * SPA catch-all answers it with index.html and a 200, so it is invisible from the outside.
 */
{
  const written = new Set(files.map((name) => name.replace('.html', '')));
  const dangling = [...linkTargets.keys()].filter((id) => !written.has(id));
  if (dangling.length) {
    fail(`${dangling.length} internal link target(s) have no page: ${dangling.slice(0, 5).join(', ')}`);
  } else {
    const total = [...linkTargets.values()].reduce((a, b) => a + b, 0);
    notes.push(`link graph: ${total} internal links, none dangling, on ${pagesWithLinks} of ${count.pages} pages`);
  }
  /* A record with no neighbours in its own country is legitimate — 32 of them, mostly the
     sole record filed under a continent. A collapse to nothing is not. */
  if (pagesWithLinks < count.pages * 0.9) {
    fail(`only ${pagesWithLinks} of ${count.pages} pages link anywhere — the link graph has collapsed`);
  }
}

if (emptyAlt.length) fail(`a photograph has no alt text on at least ${emptyAlt.length} page(s): ${emptyAlt.join(' | ')}`);
if (unparseable.length) fail(`bad recipe markup on at least ${unparseable.length} page(s): ${unparseable.join(' | ')}`);

/*
 * The sitemap and the pages are written by two scripts from one rule. When the accounts
 * moved they fell to 7,607 together, which is exactly why agreeing is not sufficient on
 * its own — but disagreeing is still a certain fault, and it is free to check.
 */
const sitemap = resolve(DIST, 'sitemap.xml');
if (!existsSync(sitemap)) fail('dist/sitemap.xml is missing');
else {
  const listed = (readFileSync(sitemap, 'utf8').match(/\/dish\//g) ?? []).length;
  if (listed !== count.pages) fail(`the sitemap lists ${listed} records and ${count.pages} were written`);
  else notes.push(`sitemap agrees: ${listed} records`);
}

/*
 * Nothing in the sitemap may be disallowed in robots.txt.
 *
 * The two files are written by different hands for different reasons and nothing made
 * them agree: `/propose` was added to the sitemap the day it got its own prerendered
 * page, and `robots.txt` had disallowed it since before that page existed. Search Console
 * reports that pair as "submitted URL blocked by robots.txt" — a self-inflicted error on
 * the one report the launch is being judged by, found here instead.
 */
{
  const robotsFile = resolve(DIST, 'robots.txt');
  const sitemapText = existsSync(sitemap) ? readFileSync(sitemap, 'utf8') : '';
  const listed = [...sitemapText.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1]);

  if (!existsSync(robotsFile)) fail('dist/robots.txt is missing');
  else {
    const disallowed = [...readFileSync(robotsFile, 'utf8').matchAll(/^\s*Disallow:\s*(\S+)\s*$/gim)]
      .map((m) => m[1])
      .filter((path) => path !== '/');
    const blocked = listed.filter((loc) => disallowed.some((rule) => loc === rule || loc.startsWith(`${rule}/`)));
    if (blocked.length) {
      fail(`the sitemap lists ${blocked.length} URL(s) robots.txt disallows: ${[...new Set(blocked)].slice(0, 5).join(' | ')}`);
    } else if (disallowed.length) {
      notes.push(`robots.txt disallows ${disallowed.length} paths, none of them listed`);
    }
  }
}

/*
 * Every country page in the sitemap must exist, and must link somewhere.
 *
 * A country page whose list is empty is the thin page this project refuses to publish
 * anywhere else, and one the sitemap names but nobody wrote is the disagreement the
 * record pages are already checked for. Both are silent faults: the build succeeds and
 * the page serves the app shell.
 */
{
  const sitemapText = existsSync(sitemap) ? readFileSync(sitemap, 'utf8') : '';
  const listed = [...sitemapText.matchAll(/<loc>[^<]*\/country\/([a-z0-9-]+)<\/loc>/g)].map((m) => m[1]);
  let links = 0;
  for (const slug of listed) {
    const file = resolve(DIST, 'country', `${slug}.html`);
    if (!existsSync(file)) {
      fail(`/country/${slug} is in the sitemap and was never written`);
      continue;
    }
    const html = readFileSync(file, 'utf8');
    const found = (html.match(/href="https:\/\/[^"]*\/dish\/\d+"/g) ?? []).length;
    if (!found) fail(`/country/${slug} lists no records`);
    if (!html.includes(`/country/${slug}"`)) fail(`/country/${slug} does not point its canonical at itself`);
    links += found;
  }
  if (listed.length) notes.push(`${listed.length} country pages carrying ${links} record links`);
}

/*
 * Every screen in the sitemap must be a page of its own.
 *
 * The failure this catches is silent and was live until it was measured: an export shape
 * change makes `prerender-screens.mjs` write nothing, Pages falls back to index.html, and
 * seven URLs quietly go back to sharing one title. Checked against the sitemap rather than
 * a list kept here, so adding a screen there cannot leave this behind.
 */
{
  const sitemapText = existsSync(sitemap) ? readFileSync(sitemap, 'utf8') : '';
  const screens = [...sitemapText.matchAll(/<loc>https:\/\/[^<]*?\.app(\/[a-z-]*)<\/loc>/g)]
    .map((m) => m[1])
    .filter((path) => path !== '/' && !path.startsWith('/dish'));
  const titles = new Map();
  for (const path of screens) {
    const file = resolve(DIST, `${path.slice(1)}.html`);
    if (!existsSync(file)) {
      fail(`${path} is in the sitemap and has no HTML file of its own`);
      continue;
    }
    const html = readFileSync(file, 'utf8');
    const title = (html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? '';
    const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) ?? [])[1] ?? '';
    if (!title || title === 'WikiFoodia') fail(`${path} has no title of its own`);
    if (!canonical.endsWith(path)) fail(`${path} does not point its canonical at itself (${canonical || 'none'})`);
    if (titles.has(title)) fail(`${path} and ${titles.get(title)} share the title "${title}"`);
    titles.set(title, path);
  }
  if (screens.length) notes.push(`${screens.length} screens, each with its own title and canonical`);
}

/*
 * The data version in the bundle must match the data actually being shipped.
 *
 * `/data/*` is served `immutable` for a year, which is only safe because the app asks for
 * `?v=<hash of the data>`. If the data changed and the stamp did not — a build that skipped
 * `stamp-data-version`, or a hand-edited JSON file dropped into `dist` — readers would be
 * pinned to the old copy for a year with no way to notice. That is the failure the old
 * `stale-while-revalidate` note was trying to avoid, made worse, so it is checked.
 */
{
  const dataDir = resolve(DIST, 'data');
  const stamped = (readFileSync(resolve(HERE, '../src/data/version.ts'), 'utf8').match(/'([0-9a-f]{12})'/) ?? [])[1];
  const hash = createHash('sha256');
  for (const name of readdirSync(dataDir).filter((n) => n.endsWith('.json')).sort()) {
    hash.update(name);
    hash.update(readFileSync(resolve(dataDir, name)));
  }
  const copyDir = resolve(dataDir, 'copy');
  let copies = [];
  try {
    copies = readdirSync(copyDir).filter((n) => n.endsWith('.json')).sort();
  } catch {
    /* No per-locale copy in this build. */
  }
  for (const name of copies) {
    hash.update(`copy/${name}`);
    hash.update(readFileSync(resolve(copyDir, name)));
  }
  const actual = hash.digest('hex').slice(0, 12);

  if (!stamped) fail('src/data/version.ts has no DATA_VERSION to read');
  else if (stamped !== actual) {
    fail(`the data in dist hashes to ${actual} but the bundle asks for ${stamped} — run npm run stamp:data`);
  } else {
    const bundles = readdirSync(resolve(DIST, '_expo/static/js/web')).filter((n) => n.endsWith('.js'));
    const carried = bundles.some((n) => readFileSync(resolve(DIST, '_expo/static/js/web', n), 'utf8').includes(stamped));
    if (carried) notes.push(`data version ${stamped} matches the shipped data and is in the bundle`);
    else fail(`data version ${stamped} is not in any shipped bundle — the app would ask for unversioned data`);

    /*
     * And the preloads must ask for the same URL the app does. A preload whose href does
     * not match is not a head start, it is a second copy: shipping the version stamp
     * without it downloaded all five sources twice, 2,143 KB wasted on the first paint.
     */
    const shell = readFileSync(resolve(DIST, 'index.html'), 'utf8');
    const preloads = [...shell.matchAll(/<link rel="preload"[^>]*href="([^"]*\/data\/[^"]*)"/g)].map((m) => m[1]);
    const unversioned = preloads.filter((href) => !href.includes(`v=${stamped}`));
    if (unversioned.length) {
      fail(`${unversioned.length} data preload(s) do not carry v=${stamped}, so each file downloads twice: ${unversioned.slice(0, 3).join(', ')}`);
    } else if (preloads.length) {
      notes.push(`${preloads.length} data preloads carry the version`);
    }
  }
}

/* Silence here would be the deployment simply beginning to fail one day. */
const total = files.length + readdirSync(DIST).length;
if (total > FILE_CAP * 0.9) {
  notes.push(`WARNING: about ${total} files against Cloudflare's ${FILE_CAP} cap`);
}

process.stdout.write(
  `verify-prerender: ${count.pages} pages · ${count.description} described · ${count.photo} illustrated · ` +
    `${count.recipe} with a method (${count.recipeImage} of those illustrated) · ${count.trail} with a breadcrumb
`,
);
for (const note of notes) process.stdout.write(`  ${note}\n`);

if (problems.length) {
  process.stderr.write('\nverify-prerender FAILED\n');
  for (const problem of problems) process.stderr.write(`  - ${problem}\n`);
  process.exitCode = 1;
}

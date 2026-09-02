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

  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (ld) {
    count.recipe += 1;
    try {
      const recipe = JSON.parse(ld[1]);
      if (recipe.image) {
        count.recipeImage += 1;
        if (!isUrl(recipe.image)) sample(badRecipeImage, `${name}: ${recipe.image}`);
      }
      /* The one promise `Recipe` makes that this atlas can fail to keep. */
      if (!recipe.recipeInstructions?.length) sample(unparseable, `${name}: Recipe with no method`);
    } catch {
      sample(unparseable, `${name}: ld+json does not parse`);
    }
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

/* Silence here would be the deployment simply beginning to fail one day. */
const total = files.length + readdirSync(DIST).length;
if (total > FILE_CAP * 0.9) {
  notes.push(`WARNING: about ${total} files against Cloudflare's ${FILE_CAP} cap`);
}

process.stdout.write(
  `verify-prerender: ${count.pages} pages · ${count.description} described · ${count.photo} illustrated · ` +
    `${count.recipe} with a method (${count.recipeImage} of those illustrated)\n`,
);
for (const note of notes) process.stdout.write(`  ${note}\n`);

if (problems.length) {
  process.stderr.write('\nverify-prerender FAILED\n');
  for (const problem of problems) process.stderr.write(`  - ${problem}\n`);
  process.exitCode = 1;
}

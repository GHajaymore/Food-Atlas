/**
 * Give the app's own screens a page each, instead of seven copies of one.
 *
 *   node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/prerender-screens.mjs
 *
 * `prerender-records.mjs` fixed this for records and left the screens behind. The export
 * is one `index.html` and `_redirects` serves it for every unmatched path, so /atlas,
 * /search, /how, /support and /privacy all arrived as the same file — same <title>, same
 * description, same canonical — while the sitemap listed them as seven URLs. Measured on
 * the live site: `document.title` was "WikiFoodia" on every one of them. To a crawler
 * that is seven duplicates of the home page, and to a reader it is a row of browser tabs
 * that cannot be told apart.
 *
 * ## How it works
 *
 * Each screen gets a real file at `dist/<name>.html`, copied from the finished
 * `index.html` with its head rewritten. Cloudflare Pages matches `/atlas` to `atlas.html`
 * before it reaches the SPA fallback — the same precedence `/dish/1` → `dish/1.html`
 * already relies on — and because the body is untouched, the app boots and routes exactly
 * as it did. Nothing here renders the screen's content: that is still the client's job.
 * What changes is the first thing a crawler, a chat preview and a bookmark see.
 *
 * ## The numbers in the descriptions
 *
 * Counted from the catalogue at build time rather than typed in, because a description
 * that says 17,358 after the next ingest would be the one lie on the page nobody would
 * think to check. Each sentence is the screen's own opening line, which is written and
 * reviewed where the screen is.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { builtCatalogue } from './lib/built-catalogue.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HERE, '../dist');
const SITE = 'https://wikifoodia.ajailabs.app';

const { catalogue } = await builtCatalogue();
const records = catalogue.length.toLocaleString('en-GB');
const countries = new Set(catalogue.map((dish) => dish.loc.country).filter(Boolean)).size;

/**
 * One entry per screen with a page of its own.
 *
 * `/proposals` is deliberately absent. It is a queue: today it is empty, next week it is
 * three dishes, and a description either way would be wrong half the time. It stays
 * reachable from every nav and out of the sitemap.
 */
const SCREENS = [
  {
    path: '/atlas',
    title: 'Food Atlas',
    description:
      `Every country the atlas has a record for: ${records} traditions across ${countries} countries. ` +
      'A country absent here has nothing recorded yet, not nothing to record.',
  },
  {
    path: '/browse',
    title: 'Browse the atlas',
    description:
      `Filter ${records} traditions by country, occasion, diet and how well documented each one is. ` +
      'Every record shows the evidence behind it.',
  },
  {
    path: '/search',
    title: 'Search the atlas',
    description:
      `Search ${records} traditional dishes by name, place or ingredient — local names and other ` +
      'spellings are searched too.',
  },
  {
    path: '/how',
    title: 'How it works',
    description:
      'A document cannot make a dish authentic. Every record is scored on the same six kinds of ' +
      'evidence, and all six are printed on the record itself, so you can check it rather than trust it.',
  },
  {
    path: '/propose',
    title: 'Propose a dish',
    description:
      'Food the atlas has no record of starts here. Describe a dish you know, and three people who ' +
      'know it have to confirm it before it enters the atlas.',
  },
  {
    path: '/support',
    title: 'Keeping it free',
    description:
      `${records} traditions, built entirely from sources that are free to read and openly licensed. ` +
      'No advertising, no tracking, and nothing behind a payment.',
  },
  {
    path: '/privacy',
    title: 'What this site knows about you',
    description:
      'Almost nothing, and this page says exactly what. No advertising, no analytics service, and no ' +
      'profile of you anywhere — every line can be checked against the public source code.',
  },
];

const index = readFileSync(resolve(DIST, 'index.html'), 'utf8');

/* Fail rather than write seven files with a head this script does not recognise — the
   same rule inject-meta follows when Expo's output changes shape. */
for (const needed of ['<title>', 'name="description"', 'property="og:title"', 'name="twitter:title"']) {
  if (!index.includes(needed)) {
    throw new Error(`dist/index.html has no ${needed} — run inject-meta.mjs first; nothing written.`);
  }
}

const escape = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

let written = 0;
for (const screen of SCREENS) {
  const title = `${screen.title} · WikiFoodia`;
  const url = `${SITE}${screen.path}`;
  const description = escape(screen.description);

  const page = index
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escape(title)}" />`)
    .replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${description}" />`,
    )
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${escape(title)}" />`)
    .replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${description}" />`,
    )
    /* Its own canonical, so the duplicate it used to be is now a page in its own right. */
    .replace('</head>', `    <link rel="canonical" href="${url}" />\n  </head>`);

  writeFileSync(resolve(DIST, `${screen.path.slice(1)}.html`), page);
  written += 1;
}

process.stdout.write(`prerender-screens: ${written} screens written with their own title, description and canonical\n`);

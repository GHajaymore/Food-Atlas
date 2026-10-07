/**
 * Tell a search engine what this site is, and how to search it.
 *
 *   node scripts/inject-website.mjs        (runs as part of `npm run build`)
 *
 * One `WebSite` entity on the home page: the name a result should carry, and the address
 * that runs a search. Google uses the second to offer a search box under the result —
 * which for an atlas whose whole value is a lookup of 17,358 dishes is the single most
 * useful thing a result can have.
 *
 * `/browse?q=` rather than `/search`, because that is the one that works from a URL: the
 * search screen keeps its query in the app's own state and has nothing to read a term out
 * of an address, while `browse.tsx` parses `q` and has done since it was written. A
 * machine-readable promise has to be a promise the site keeps.
 *
 * ## Why it runs last, and only here
 *
 * `prerender-records.mjs`, `prerender-countries.mjs` and `prerender-screens.mjs` all copy
 * `index.html`, so anything added before them is repeated on 9,000 pages. A `WebSite`
 * belongs to the site once. Running after them puts it on the home page — and on the SPA
 * fallback, which is the same file — and nowhere else.
 *
 * Nothing here is a claim: the name, the address and the search URL are facts about this
 * deployment. No `aggregateRating`, no `author`, no `publisher` with a logo the project
 * does not have.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const INDEX = resolve(HERE, '../dist/index.html');
const SITE = 'https://wikifoodia.ajailabs.app';

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'WikiFoodia',
  url: `${SITE}/`,
  inLanguage: 'en',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE}/browse?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const html = await readFile(INDEX, 'utf8');

if (html.includes('"@type":"WebSite"')) {
  process.stdout.write('inject-website: already present, nothing to do.\n');
} else {
  if (!html.includes('</head>')) throw new Error('No </head> in dist/index.html — nothing written.');
  const tag = `<script type="application/ld+json">${JSON.stringify(website).replace(/<\//g, '<\/')}</script>`;
  await writeFile(INDEX, html.replace('</head>', `    ${tag}\n  </head>`), 'utf8');
  process.stdout.write('inject-website: WebSite and SearchAction written to the home page.\n');
}

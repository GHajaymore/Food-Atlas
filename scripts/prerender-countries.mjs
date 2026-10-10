/**
 * A page per country, which the atlas has never had.
 *
 *   node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/prerender-countries.mjs
 *
 * The atlas is organised by place and had no address for a place. `/browse?country=Morocco`
 * is a query string: it is served the same `index.html` as every other query, carries the
 * same canonical, and cannot be a file — which is exactly why `prerender-records.mjs`
 * refuses to point 8,858 record pages at those URLs. So the one hierarchy a reader and a
 * crawler would both expect — atlas → country → dish — stopped at the first step.
 *
 * Each country with something to show now has `dist/country/<slug>.html`: its own title,
 * its own description with its own two numbers, its own canonical, and a list of its
 * records as real links. `app/country/[slug].tsx` renders the same thing for the reader
 * once React boots, in the same order, so the page does not reorganise itself on arrival.
 *
 * ## Which countries get one
 *
 * Those holding at least one record that was itself written as a page. A country whose
 * records are all bare would be a list of links into pages with nothing on them, which is
 * the fault this project has avoided everywhere else, and the page would be thin in the
 * precise sense Google means. They stay reachable through the atlas and the feed.
 *
 * ## Why the list is capped
 *
 * France holds 1,151. All of them is 90 KB of links on a page a reader waits for, and a
 * crawler needs a path to a record far more than it needs all of them on one page — every
 * record also links to six of its neighbours. The cap is generous enough that no country
 * below it loses anything: it affects 12 of 155.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { builtCatalogue } from './lib/built-catalogue.mjs';
import { countryPages } from './lib/country-pages.mjs';
import { countryOrder } from '../src/domain/countryOrder.ts';
import { listPhoto } from '../src/domain/listPhoto.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HERE, '../dist');
const SITE = 'https://wikifoodia.ajailabs.app';
const LINKS = 250;

const { catalogue } = await builtCatalogue();

const escape = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Which countries get a page is decided in scripts/lib/country-pages.mjs, because the
   sitemap has to make the same decision and the two must not drift. */
const { pages: eligible, countries } = countryPages(catalogue);

const shell = readFileSync(resolve(DIST, 'index.html'), 'utf8');
mkdirSync(resolve(DIST, 'country'), { recursive: true });


export const countrySlugs = [];
let capped = 0;

for (const { country, slug, records, linkable: pages } of eligible) {
  const url = `${SITE}/country/${slug}`;
  const title = `${country} · WikiFoodia`;

  /*
   * Two true numbers and nothing else. The second is the part a reader can act on — an
   * undocumented record is an invitation, and `whyThisRecordIsEmpty` says the same thing
   * on the record itself.
   */
  const waiting = records.length - pages.length;
  const description =
    `${records.length.toLocaleString('en-GB')} ${records.length === 1 ? 'tradition' : 'traditions'} recorded from ${country}` +
    (waiting
      ? `, ${pages.length.toLocaleString('en-GB')} with a written method or ingredients. ` +
        (waiting === 1
          ? 'The other one is waiting for someone who knows it.'
          : `The other ${waiting.toLocaleString('en-GB')} are waiting for someone who knows them.`)
      : ', each with the evidence behind it.');

  const head = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}"/>`,
    `<link rel="canonical" href="${escape(url)}"/>`,
    `<meta property="og:site_name" content="WikiFoodia"/>`,
    `<meta property="og:type" content="website"/>`,
    `<meta property="og:title" content="${escape(title)}"/>`,
    `<meta property="og:description" content="${escape(description)}"/>`,
    `<meta property="og:url" content="${escape(url)}"/>`,
    `<meta name="twitter:card" content="summary"/>`,
    `<meta name="twitter:title" content="${escape(title)}"/>`,
    `<meta name="twitter:description" content="${escape(description)}"/>`,
  ].join('\n    ');

  /* The order the screen lists them in: photographed first, each list by countryOrder.ts. */
  const ordered = countryOrder(pages);
  const listed = [...ordered.filter((d) => listPhoto(d)), ...ordered.filter((d) => !listPhoto(d))].slice(0, LINKS);
  if (pages.length > LINKS) capped += 1;

  const body = [
    '<article>',
    `<h1>${escape(country)}</h1>`,
    `<p>${escape(description)}</p>`,
    `<ul>${listed
      .map((dish) => {
        const where = [dish.loc.city, dish.loc.region].filter(Boolean).join(', ');
        return (
          `<li><a href="${escape(`${SITE}/dish/${dish.id}`)}">${escape(dish.name)}</a>` +
          `${where ? ` — ${escape(where)}` : ''}</li>`
        );
      })
      .join('')}</ul>`,
    listed.length < pages.length
      ? `<p>${escape(`${listed.length} of ${pages.length} shown. The rest open in the atlas.`)}</p>`
      : '',
    `<p><a href="${escape(url)}">Open ${escape(country)} in the atlas</a></p>`,
    '</article>',
  ]
    .filter(Boolean)
    .join('');

  /* The shell's site-wide tags come off first, exactly as prerender-records.mjs does it —
     doing it the other way round deletes the tags just written. */
  const stripped = shell
    .replace(/\n?\s*<meta name="description"[^>]*>/g, '')
    .replace(/\n?\s*<link rel="canonical"[^>]*>/g, '')
    .replace(/\n?\s*<meta property="og:[^"]*"[^>]*>/g, '')
    .replace(/\n?\s*<meta name="twitter:[^"]*"[^>]*>/g, '');

  const page = stripped
    .replace(/<title>[\s\S]*?<\/title>/, head)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  writeFileSync(resolve(DIST, 'country', `${slug}.html`), page);
  countrySlugs.push({ slug, country, records: records.length });
}

process.stdout.write(
  `prerender-countries: ${countrySlugs.length} country pages written ` +
    `(${countries - countrySlugs.length} origins have no page: not a country, or nothing worth linking to; ${capped} capped at ${LINKS} links)\n`,
);

/**
 * Write a real HTML file for every record worth indexing.
 *
 *   node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/prerender-records.mjs
 *
 * ## What this fixes
 *
 * The web build is a single-page app: one `index.html`, and `_redirects` rewrites every
 * other URL onto it. So every one of the atlas's records — the entire product — is one
 * page to a crawler, with one title and one description. Google cannot rank a dish,
 * because as far as it can see there are no dishes. A link shared into a chat previews as
 * the site rather than the food.
 *
 * `sitemap.xml` says the same thing from the other side, and says why it lists six URLs
 * instead of thousands: *"they resolve on the client from one index.html, so every one of
 * them would offer a crawler the same title and the same description."* This is the fix
 * that comment was waiting for.
 *
 * ## Only records that have something to index
 *
 * A record with no method, no ingredients and no description has nothing for a search
 * engine to rank and nothing worth previewing. Half the atlas is in that state — that is
 * honest, and it is said plainly on those pages — so they keep the client-rendered route
 * and are left out of here.
 *
 * That is not only editorial. Cloudflare Pages caps a deployment at **20,000 files** and
 * the atlas holds 17,477 records; one file each would leave under 2,500 records of
 * headroom before deploys start failing outright. Indexing what has substance keeps the
 * count around 9,000 and the cliff out of sight.
 *
 * ## Why it imports the app's own builder
 *
 * Record ids come from `buildCatalogue` — `100_000 + index` over the rows that survive
 * deduplication. Re-deriving them here would mean re-implementing the dedup, and the day
 * the two disagree, `/dish/4821.html` describes a different dish than the app renders at
 * `/dish/4821`. See `scripts/lib/ts-resolve.mjs` for how a plain script imports TypeScript.
 *
 * ## Where it goes in the build
 *
 * Last, after `inject-csp`. Each file is the finished shell with its head rewritten, so
 * every record inherits the same policy, the same preloads and the same inline-script
 * hash — nothing here adds a script, so the hash stays valid.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HERE, '../dist');
const SITE = 'https://wikifoodia.ajailabs.app';

/*
 * A finished catalogue, not a half-loaded one.
 *
 * Both the step text and the written accounts are held back from the first payload, and a
 * build script never runs the fetch that brings them in. Reconstructing that here is what
 * `scripts/lib/built-catalogue.mjs` is for, and it exists because this file got it wrong
 * twice: first writing recipe markup for 6 records instead of 4,488, then dropping 1,283
 * prose-documented records out of the index when the accounts moved too.
 */
import { builtCatalogue } from './lib/built-catalogue.mjs';
import { sizedPhoto } from '../src/domain/commons.ts';

const { catalogue } = await builtCatalogue();

/**
 * A photograph's address, which is not what the record stores.
 *
 * `compact-data.mjs` keeps the Commons *file name* and `sizedPhoto` rebuilds the URL at
 * render time, because the three repeated prefixes were 1.8 MB of JSON nobody needed.
 * Every screen in the app goes through that function. This file did not, and wrote the
 * stored value straight into `og:image` and into the recipe markup — so every record
 * published `<meta property="og:image" content="Popcorn%209.jpg">`.
 *
 * Nothing failed. The tag was present, the value was non-empty, and the checks that
 * counted how many records carried an image counted these. What it cost is invisible from
 * inside the atlas: a link shared into WhatsApp, Slack or a group chat previewed as a
 * title with a blank square, and word of mouth is half of how this thing travels.
 *
 * 1200px because that is what the card scrapers ask for; Commons resizes on request, so
 * this costs nothing to store.
 */
const photoUrl = (dish, width = 1200) => (dish.photo ? sizedPhoto(dish.photo, width) : '');

/**
 * What the picture can honestly be said to show.
 *
 * `photoVerified` is false on every built record and true only on the three curated ones
 * — `build.ts` says why: *"knowing a picture was attached to the right subject is not
 * knowing it shows the dish as made in the place."* The record screen prints that
 * qualification beside the photograph.
 *
 * Alt text is the one place it would be easy to drop, because "a photograph of Jalebi" is
 * the obvious phrasing and reads perfectly well. It would also be the atlas asserting, to
 * the readers least able to check it, exactly the thing it tells everybody else it has not
 * established. So an unverified picture is described as what it verifiably is: a file
 * filed under this name on Commons.
 */
const photoAlt = (dish) =>
  dish.photoVerified ? dish.name : `Photograph filed under “${dish.name}” on Wikimedia Commons`;

/** Text safe to drop between tags or inside a double-quoted attribute. */
const escape = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** One sentence about the dish, at a length a search result will actually show. */
const describe = (dish) => {
  const source = (dish.prepSummary || dish.blurb || '').replace(/\s+/g, ' ').trim();
  if (source.length <= 155) return source;
  const cut = source.slice(0, 155);
  return `${cut.slice(0, cut.lastIndexOf(' ')) || cut}…`;
};

/**
 * The record as `schema.org/Recipe`, or nothing.
 *
 * This is what lets a search engine show a dish as a dish — with its picture, its
 * ingredients and its method — rather than as a blue link among blue links. For an atlas
 * whose entire distribution is search and word of mouth, that is the difference between
 * being found by somebody who cooks this food and not being found at all.
 *
 * ## Only where there is a method
 *
 * `Recipe` promises `recipeInstructions`. 4,488 records have a real method and can make
 * that promise; 3,119 more have an ingredient list and no method and cannot. Marking those
 * up as recipes would be a lie told in a machine-readable format, which is the worst place
 * to tell one — it is also exactly what Google's own validator flags, so it would not even
 * work. They get no markup rather than a hollow claim.
 *
 * ## What is deliberately absent
 *
 * No `cookTime`, no `recipeYield`, no `nutrition`, no `aggregateRating`. Rich results
 * reward every one of those and the atlas does not hold a single one of them. Inventing a
 * cooking time to win a star rating is the precise failure this project exists not to
 * commit, and it would be committed here in a form no reader could see.
 *
 * `citation` carries the source instead. The atlas did not write these methods down —
 * Wikipedia, Wikibooks and the registers did — and the markup says so.
 */
const recipeMarkup = (dish, url) => {
  if (!dish.steps.length) return '';

  const recipe = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: dish.name,
    url,
    inLanguage: dish.sourceLanguage || 'en',
    description: describe(dish) || undefined,
    image: photoUrl(dish) || undefined,
    recipeCuisine: dish.cuisine || undefined,
    recipeCategory: dish.category || undefined,
    recipeIngredient: dish.ingredients.length ? dish.ingredients : undefined,
    recipeInstructions: dish.steps.map((step) => ({ '@type': 'HowToStep', text: step })),
    /* Who actually recorded it. The atlas is the publisher of the page, never the author
       of the method. */
    citation: (dish.sources ?? [])
      .filter((source) => source.url)
      .map((source) => ({ '@type': 'CreativeWork', name: source.title, url: source.url })),
  };

  for (const [key, value] of Object.entries(recipe)) {
    if (value === undefined || (Array.isArray(value) && !value.length)) delete recipe[key];
  }

  /*
   * `</` is escaped because a step containing it would otherwise close the script tag and
   * spill the rest of the record into the page as markup.
   */
  return `<script type="application/ld+json">${JSON.stringify(recipe).replace(/<\//g, '<\\/')}</script>`;
};

const shell = readFileSync(resolve(DIST, 'index.html'), 'utf8');

const worthIndexing = catalogue.filter(
  (dish) => dish.steps.length > 0 || dish.ingredients.length > 0 || (dish.prepSummary ?? '').trim(),
);

mkdirSync(resolve(DIST, 'dish'), { recursive: true });

let written = 0;
for (const dish of worthIndexing) {
  const place = [dish.loc.city, dish.loc.region, dish.loc.country].filter(Boolean).join(', ');
  const title = `${dish.name}${place ? ` — ${place}` : ''} · WikiFoodia`;
  const description = describe(dish);
  const url = `${SITE}/dish/${dish.id}`;

  const head = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}"/>`,
    `<link rel="canonical" href="${escape(url)}"/>`,
    /*
     * Both namespaces, in full, because the strip below removes both in full.
     *
     * `inject-meta.mjs` writes a complete card for the site and says why it writes the
     * Twitter tags separately: *"Twitter/X reads its own namespace and falls back to Open
     * Graph inconsistently."* This file removed every `og:` and `twitter:` tag the shell
     * carried — it has to, or each record would hold two of each — and then rewrote only
     * the Open Graph half. So the one page type that ever gets shared was the one relying
     * on the fallback that comment warns about, and it also lost `og:site_name`, which is
     * the word "WikiFoodia" under the preview.
     */
    `<meta property="og:site_name" content="WikiFoodia"/>`,
    `<meta property="og:type" content="article"/>`,
    `<meta property="og:title" content="${escape(title)}"/>`,
    `<meta property="og:description" content="${escape(description)}"/>`,
    `<meta property="og:url" content="${escape(url)}"/>`,
    dish.photo ? `<meta property="og:image" content="${escape(photoUrl(dish))}"/>` : '',
    dish.photo ? `<meta property="og:image:alt" content="${escape(photoAlt(dish))}"/>` : '',
    `<meta name="twitter:card" content="${dish.photo ? 'summary_large_image' : 'summary'}"/>`,
    `<meta name="twitter:title" content="${escape(title)}"/>`,
    `<meta name="twitter:description" content="${escape(description)}"/>`,
    dish.photo ? `<meta name="twitter:image" content="${escape(photoUrl(dish))}"/>` : '',
    recipeMarkup(dish, url),
  ]
    .filter(Boolean)
    .join('\n    ');

  /*
   * Rendered inside `#root`, and a reader does see it.
   *
   * The comment here used to say the opposite — that `createRoot().render()` replaces the
   * container's children on the first frame, so this was for crawlers only. Measured on
   * the live site, sampling `#root` every 16 ms: on `/dish/1020` this markup is on screen
   * from the first paint until **1,275 ms**, when the built record replaces it. The
   * loading skeleton never appears on a record page at all. React does not commit until
   * the catalogue is built, so whatever the file already holds simply stays up.
   *
   * That makes this the page for the whole of a search visitor's wait, not a fallback for
   * robots — which is why it now carries the photograph. An atlas of food that shows no
   * food for a second and a half is failing the only reader it has at that moment, and the
   * picture is the fastest true thing it can put on screen.
   *
   * Still only what the record actually holds: no invented summary, the same ingredient
   * names the app shows, and the photograph credited exactly as the app credits it,
   * because these licences require attribution wherever the image appears.
   */
  const photo = photoUrl(dish, 800);
  const body = [
    `<article>`,
    photo
      ? `<img src="${escape(photo)}" alt="${escape(photoAlt(dish))}" width="800" style="max-width:100%;height:auto"/>`
      : '',
    `<h1>${escape(dish.name)}</h1>`,
    place ? `<p>${escape(place)}</p>` : '',
    description ? `<p>${escape(description)}</p>` : '',
    dish.ingredients.length
      ? `<h2>Ingredients</h2><ul>${dish.ingredients.map((i) => `<li>${escape(i)}</li>`).join('')}</ul>`
      : '',
    photo && dish.credit ? `<p><small>${escape(dish.credit)}</small></p>` : '',
    `<p><a href="${escape(url)}">Open this record in the atlas</a></p>`,
    `</article>`,
  ]
    .filter(Boolean)
    .join('');

  /*
   * Strip the shell's own tags first, then inject.
   *
   * Doing it the other way round removed the tags this had just written — the same
   * expressions match both — and every record shipped with a correct title and no
   * description, canonical or card at all. Visible only by reading the output, since
   * nothing failed.
   *
   * These are `inject-meta`'s work, describing the site as a whole. Left in place a
   * record would carry two of each and a crawler would pick whichever it preferred.
   */
  const stripped = shell
    .replace(/\n?\s*<meta name="description"[^>]*>/g, '')
    .replace(/\n?\s*<link rel="canonical"[^>]*>/g, '')
    .replace(/\n?\s*<meta property="og:[^"]*"[^>]*>/g, '')
    .replace(/\n?\s*<meta name="twitter:[^"]*"[^>]*>/g, '');

  const page = stripped
    .replace(/<title>[\s\S]*?<\/title>/, head)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  writeFileSync(resolve(DIST, 'dish', `${dish.id}.html`), page);
  written += 1;
}

process.stdout.write(
  `prerender-records: ${written} of ${catalogue.length} records written to dist/dish/ ` +
    `(${catalogue.length - written} have nothing to index and stay client-rendered)\n`,
);

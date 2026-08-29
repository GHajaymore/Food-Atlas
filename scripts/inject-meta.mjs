/**
 * Give a shared link something to show.
 *
 *   node scripts/inject-meta.mjs        (runs as part of `npm run build`)
 *
 * The served page carried three meta tags — charset, X-UA-Compatible, viewport — and
 * nothing else. No description, no Open Graph, no Twitter card. So every link to this
 * atlas pasted into WhatsApp, Slack, Signal, Mastodon or a group chat rendered as a bare
 * URL with no title, no summary and no picture.
 *
 * For a free atlas with no advertising, word of mouth is the whole distribution strategy,
 * and a link that looks like nothing does not get opened.
 *
 * ## The picture is ours, deliberately
 *
 * The obvious social card is a photograph of food, and this atlas has 10,638 of them.
 * Nearly all are CC BY-SA, which requires attribution *wherever the work is shown* — and
 * a link preview has nowhere to put a credit line. `SiteFooter` says exactly this about
 * the footer having no copyright line: the atlas does not own this material. Putting an
 * unattributed photograph on every share would be the same mistake in the other
 * direction, so the card is the app's own mark, which we do own.
 *
 * ## What this does not attempt
 *
 * Per-record cards. `/dish/1` and `/atlas` get the same title and description here,
 * because the export is one `index.html` and the routes are resolved on the client —
 * there is no per-path HTML to write a per-path tag into. Doing it properly means
 * prerendering, which is a real piece of work rather than a build step, and is noted in
 * the session record rather than half-done here.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const INDEX = resolve(HERE, '../dist/index.html');

const SITE = 'https://wikifoodia.ajailabs.app';
const MARKER = '<!-- wikifoodia-meta -->';

/**
 * What the atlas says it is, in one sentence a stranger can act on.
 *
 * States the rule rather than claiming an achievement, for the same reason `BRAND`
 * does: no record has been confirmed by a reader yet, so "authenticated by the
 * community" would be a claim about something that has not happened. This says who
 * decides and what the reader gets, both of which are true today.
 */
const DESCRIPTION =
  'A free atlas of traditional food, where every dish shows its evidence and the ' +
  'community decides what counts as authentic. No advertising, and nothing tracked.';

const TITLE = 'WikiFoodia — the community decides what’s authentic';

const main = async () => {
  let html;
  try {
    html = await readFile(INDEX, 'utf8');
  } catch {
    throw new Error('dist/index.html not found — run `expo export` first.');
  }

  if (html.includes(MARKER)) {
    process.stdout.write('inject-meta: already present, nothing to do.\n');
    return;
  }

  /* Fail loudly rather than write something that cannot work — the same rule the
     preload injector follows. */
  if (!html.includes('</head>')) {
    throw new Error('No </head> in dist/index.html — Expo’s output has changed shape; nothing written.');
  }

  const tags = [
    `    <meta name="description" content="${DESCRIPTION}" />`,
    /* Open Graph: WhatsApp, Signal, Slack, Facebook, LinkedIn, Discord, Mastodon. */
    `    <meta property="og:site_name" content="WikiFoodia" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:title" content="${TITLE}" />`,
    `    <meta property="og:description" content="${DESCRIPTION}" />`,
    `    <meta property="og:url" content="${SITE}/" />`,
    `    <meta property="og:image" content="${SITE}/icon.png" />`,
    `    <meta property="og:image:alt" content="The WikiFoodia mark: a ring with an open centre." />`,
    /* Twitter/X reads its own namespace and falls back to Open Graph inconsistently. */
    `    <meta name="twitter:card" content="summary" />`,
    `    <meta name="twitter:title" content="${TITLE}" />`,
    `    <meta name="twitter:description" content="${DESCRIPTION}" />`,
    `    <meta name="twitter:image" content="${SITE}/icon.png" />`,
  ].join('\n');

  html = html.replace('</head>', `${MARKER}\n${tags}\n  </head>`);
  await writeFile(INDEX, html, 'utf8');

  process.stdout.write('inject-meta: description, Open Graph and Twitter card written.\n');
};

main().catch((error) => {
  process.stderr.write(`\nMeta injection failed: ${error.message}\n`);
  process.exitCode = 1;
});

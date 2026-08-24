/**
 * Start the catalogue downloading before the bundle has finished thinking.
 *
 *   node scripts/inject-preload.mjs        (runs as part of `npm run build`)
 *
 * Measured on the built site, from the browser's own resource timing:
 *
 *   HTML delivered            326 ms
 *   JS bundle downloads   347–611 ms
 *   data fetches start        888 ms   ← 562 ms after the HTML arrived
 *   data complete           1,619 ms
 *
 * Nothing can request the catalogue until the bundle has downloaded *and executed*,
 * because the URLs live inside it. So the connection sits idle for more than half a
 * second on a fast local server, and proportionally longer on a real one, where the
 * bundle takes longer to arrive and longer to parse.
 *
 * A `<link rel="preload">` in the served HTML lets the browser start all five files at
 * about 330 ms instead of 888 ms — the two downloads overlap rather than queue. It buys
 * nothing on a warm cache and a great deal on a first visit, which is the visit that
 * decides whether anybody comes back.
 *
 * ## Why this rewrites the built file rather than adding `+html.tsx`
 *
 * Expo Router does have a document hook, and using it would mean replacing Expo's default
 * document with a hand-maintained copy — which is a file that silently rots when Expo
 * changes what it emits, and whose failure mode is a web build that does not run at all.
 *
 * This appends to whatever Expo generated and refuses to write if the shape moved. The
 * same instinct as `ingest-eu-gi-register.mjs`, which will not write if the endpoint's
 * response changed shape: a build step that guesses is worse than one that stops.
 *
 * ## The trap this is written around
 *
 * `as="fetch"` preloads are only reused if the preload's CORS mode matches the later
 * request's. A mismatch does not warn — it silently downloads everything **twice**, which
 * on a 16 MB payload would be far worse than the problem being solved. That is why the
 * result is measured in a browser rather than assumed, and why this script is easy to
 * remove: one line out of `package.json`.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const INDEX = resolve(HERE, '../dist/index.html');

/** Exactly what `src/data/catalogue.ts` fetches, in the order it asks for them. */
const SOURCES = ['catalogue', 'cuisines', 'cookbook', 'unesco', 'gi'];

/*
 * The same base `catalogue.ts` builds its URLs from, read the same way.
 *
 * A preload only helps if its href is the URL the app later requests. If this hard-coded
 * `/data/` while the app had been built against an `EXPO_PUBLIC_DATA_URL` pointing
 * elsewhere, every file would be fetched twice — once for the preload nobody claims, then
 * again for real. Reading the variable rather than assuming its default is what stops the
 * two drifting apart silently.
 */
const BASE = process.env.EXPO_PUBLIC_DATA_URL ?? '';

const MARKER = '<!-- wikifoodia-preload -->';

const main = async () => {
  let html;
  try {
    html = await readFile(INDEX, 'utf8');
  } catch {
    throw new Error('dist/index.html not found — run `expo export` first.');
  }

  if (html.includes(MARKER)) {
    process.stdout.write('Preload links already present; nothing to do.\n');
    return;
  }

  /*
   * Fail loudly rather than write something that cannot work. If Expo ever emits a
   * document without a head, silently producing a file with no preloads would look
   * exactly like success.
   */
  if (!html.includes('</head>')) {
    throw new Error('No </head> in dist/index.html — Expo’s output has changed shape; nothing written.');
  }

  /*
   * `crossorigin` is required on an `as="fetch"` preload for the browser to hand it to a
   * later `fetch()`, even same-origin. Omitting it is the mismatch that downloads
   * everything twice.
   */
  const links = SOURCES.map(
    (name) => `    <link rel="preload" as="fetch" crossorigin href="${BASE}/data/${name}.json" />`,
  ).join('\n');

  html = html.replace('</head>', `${MARKER}\n${links}\n  </head>`);
  await writeFile(INDEX, html, 'utf8');

  process.stdout.write(
    `Preloading ${SOURCES.length} sources from dist/index.html.\n` +
      'Verify in a browser that each file appears ONCE in resource timing — a CORS\n' +
      'mismatch on an as="fetch" preload downloads everything twice, silently.\n',
  );
};

main().catch((error) => {
  process.stderr.write(`\nPreload injection failed: ${error.message}\n`);
  process.exitCode = 1;
});

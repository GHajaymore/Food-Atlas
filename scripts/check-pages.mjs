/**
 * Read the built site the way a reader meets it, and fail on what a reader would notice.
 *
 *   npm run build && npm run check:pages
 *
 * (Runs under --experimental-strip-types with scripts/lib/ts-resolve.mjs, like the other
 * build scripts that read src/domain.)
 *
 * ## Why this exists
 *
 * In the October run, 693 unit tests stayed green while the live site:
 *
 * - printed copy keys as words — "Vegan · mealSnack · mealCelebration" — in twelve languages;
 * - told every visitor "Submissions are not open yet" while /propose was accepting them;
 * - headed a record scored 27/100 "Authentic Version";
 * - printed the same thirty-word sentence three times on one record;
 * - ran two sentences together: "…the dish that cook made.Engagement figures are…".
 *
 * Every one was found by a person reading the rendered page, which is a habit and not a
 * check: it happens when somebody remembers. The unit tests cover the logic underneath the
 * screen; nothing covered the screen. This does — it opens the real static build in a real
 * browser, waits for the app to render, and asserts on what is visible.
 *
 * ## What it does not touch
 *
 * Production. `dist/` is served locally, the app's own API is answered by fixed stubs, and
 * every request to another host — Wikimedia photographs, YouTube stills — is refused, so a
 * run is fast, repeatable and offline, and reads nothing from anybody's server.
 *
 * ## When it fails
 *
 * It prints the page, the language, the width and the exact text. A false alarm is fixed
 * by narrowing the rule or adding to an allowlist below with a reason beside it — never by
 * deleting the rule, because each one is here because the fault it catches shipped.
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { faultsIn } from '../src/domain/pageFaults.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HERE, '../dist');
const PORT = 8790;
const ORIGIN = `http://localhost:${PORT}`;

/* ------------------------------------------------------------------ server */

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const isFile = async (path) => {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
};

/**
 * The app's API, answered the way production answers it with nothing in it.
 *
 * Proposals open and empty, confirmations open and empty, no session, settings absent so
 * the compiled defaults apply. Fixed rather than live, because this checks the screen and
 * not the database — and it must never write to one.
 */
const api = (path, res) => {
  const send = (status, body, headers = {}) => {
    res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
    res.end(body === undefined ? '' : JSON.stringify(body));
  };
  if (path === '/api/proposals') return send(200, []);
  if (path === '/api/confirmations') return send(200, {}, { 'X-Confirmations': 'open' });
  if (path === '/api/events') return send(204);
  return send(404, { error: 'not stubbed' });
};

/** Cloudflare Pages' resolution: the exact file, then `<path>.html`, then the app shell. */
const serve = () =>
  new Promise((done) => {
    const server = createServer(async (req, res) => {
      const url = new URL(req.url, ORIGIN);
      if (url.pathname.startsWith('/api/')) return api(url.pathname, res);
      const direct = join(DIST, decodeURIComponent(url.pathname));
      const target =
        ((await isFile(direct)) && direct) ||
        ((await isFile(`${direct}.html`)) && `${direct}.html`) ||
        ((await isFile(join(direct, 'index.html'))) && join(direct, 'index.html')) ||
        join(DIST, 'index.html');
      res.writeHead(200, { 'Content-Type': TYPES[extname(target)] ?? 'application/octet-stream' });
      res.end(await readFile(target));
    });
    server.listen(PORT, () => done(server));
  });

/* ------------------------------------------------------------------- pages */

/**
 * One of each kind of screen a reader can land on.
 *
 * `expect` is text that proves the page actually rendered, in English. Without it a blank
 * screen would pass every other check here by having nothing on it to fail.
 */
const PAGES = [
  { path: '/', expect: 'Every dish here shows its evidence', home: true },
  { path: '/how', expect: 'A document cannot make a dish authentic' },
  { path: '/atlas', expect: 'traditions documented across' },
  { path: '/browse', expect: 'traditions' },
  { path: '/search', expect: 'Search' },
  { path: '/propose', expect: 'Propose a dish' },
  { path: '/proposals', expect: 'proposals' },
  { path: '/privacy', expect: 'What this site knows about you' },
  { path: '/support', expect: 'Keeping it free' },
  { path: '/dish/1', expect: 'Kozhikode Halwa', record: 'Kozhikode Halwa' },
  { path: '/dish/100000', expect: 'Agsechi Vayingim', record: 'Agsechi Vayingim' },
  { path: '/dish/300000', expect: 'Acid Drops', record: 'Acid Drops' },
  { path: '/dish/5', expect: 'Hákarl', record: 'Hákarl' },
  { path: '/country/japan', expect: 'Japan' },
  /* The filtered states, where label maps render: a level chip printed "variation ×"
     under a heading reading "Traditional Variations" until this was read. */
  { path: '/browse?q=halwa', expect: 'halwa' },
  { path: '/browse?level=variation', expect: 'Traditional Variations' },
  { path: '/browse?ingredient=ghee', expect: 'ghee' },
  { path: '/place', expect: 'Choose a country' },
  { path: '/not-a-page', expect: 'Not a page here', notFound: true },
];

/**
 * English everywhere at two widths, German at phone width.
 *
 * German because its labels are the longest of the twelve — it is the language that found
 * the masthead overflowing at 768px — and phone width because that is where length breaks
 * things. A record page proves it rendered by its name, which is never translated.
 */
const RUNS = [
  { locale: 'en', width: 1280, height: 900, pages: PAGES },
  { locale: 'en', width: 375, height: 812, pages: PAGES },
  {
    locale: 'de',
    width: 375,
    height: 812,
    pages: PAGES.filter((p) => p.record || p.home || p.path === '/how' || p.path === '/country/japan'),
  },
  /*
   * And every other language once, on the two screens a reader is likeliest to land on.
   *
   * Ten of the twelve had never been opened by anything — not a test, not a person. A
   * missing key falls back to English silently and a long label overflows silently, so a
   * language nobody reads is a language nobody would hear about. Phone width, where length
   * breaks things; the record proves it rendered by its untranslated name.
   */
  ...['es', 'fr', 'it', 'pt', 'nl', 'pl', 'tr', 'ru', 'hi', 'zh', 'ja'].map((locale) => ({
    locale,
    width: 375,
    height: 812,
    pages: PAGES.filter((p) => p.home || p.path === '/dish/1'),
  })),
];

/* ------------------------------------------------------------------ checks */

/* The rules live in src/domain/pageFaults.ts, where __tests__/page-faults.test.ts proves
   each one still catches the exact string that once shipped. */

/* --------------------------------------------------------------------- run */

const server = await serve();
const browser = await chromium.launch();
const failures = [];
let checked = 0;

try {
  for (const run of RUNS) {
    const context = await browser.newContext({ viewport: { width: run.width, height: run.height } });

    /* The reader's language, set the way the picker sets it, before the app reads it. */
    await context.addInitScript((locale) => {
      try {
        localStorage.setItem('wikifoodia.locale', locale);
      } catch {
        /* Storage refused: the app falls back to English, and so does the check. */
      }
    }, run.locale);

    /* Nothing leaves this machine. Photographs and video stills are other people's
       servers; the screen around them is what is being checked. */
    await context.route('**/*', (route) =>
      route.request().url().startsWith(ORIGIN) ? route.continue() : route.abort(),
    );

    for (const page of run.pages) {
      const tab = await context.newPage();
      const scriptErrors = [];
      tab.on('pageerror', (error) => scriptErrors.push(error.message));

      const label = `${page.path} [${run.locale}, ${run.width}px]`;
      try {
        await tab.goto(`${ORIGIN}${page.path}`, { waitUntil: 'networkidle', timeout: 60_000 });

        const proof = run.locale === 'en' ? page.expect : page.record;
        if (proof) {
          await tab.getByText(proof, { exact: false }).first().waitFor({ timeout: 30_000 });
        } else {
          /* No untranslated text to wait for, so wait for the app to have said a lot: the
             loading skeleton is a few dozen characters, a rendered screen is thousands. A
             fixed pause passed on a page that had not finished building its catalogue. */
          await tab.waitForFunction(() => document.body.innerText.length > 1500, null, { timeout: 30_000 });
        }

        const text = await tab.evaluate(() => document.body.innerText);
        const title = await tab.title();
        const overflow = await tab.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );

        const faults = faultsIn(page, text, title, run.locale === 'en');
        if (overflow > 1) faults.push(`page scrolls sideways by ${overflow}px`);
        for (const message of scriptErrors) faults.push(`script error: ${message.slice(0, 140)}`);

        for (const fault of faults) failures.push(`${label}  ${fault}`);
      } catch (error) {
        failures.push(`${label}  did not render: ${String(error.message ?? error).split('\n')[0]}`);
      } finally {
        checked += 1;
        await tab.close();
      }
    }

    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  process.stderr.write(`\ncheck-pages: ${failures.length} fault(s) across ${checked} page loads\n\n`);
  for (const failure of failures) process.stderr.write(`  ${failure}\n`);
  process.stderr.write('\n');
  process.exitCode = 1;
} else {
  process.stdout.write(`check-pages: ${checked} page loads, nothing a reader would notice\n`);
}

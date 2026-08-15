/**
 * Readership, from Wikimedia's pageviews API.
 *
 *   node scripts/ingest-pageviews.mjs [--limit 500]
 *
 * The app shipped with a "Most popular worldwide" rail ranking seven records. Not
 * seven of the best — seven in total, the hand-written demo records from the design
 * handoff, carrying invented figures like "2.1M views". The other 13,848 records had
 * no number at all, so they all tied at zero and never appeared. The rail was not
 * ranking the catalogue badly; it was ranking the mock data perfectly.
 *
 * Fabricated numbers are the one thing this app must never show. Every other figure
 * on screen is either evidence or an admission that there is none, and a made-up
 * view count sitting beside a real confidence score borrows credibility it has not
 * earned.
 *
 * So the counts come from somewhere real: Wikimedia's pageviews API, which reports
 * how many people read an article each month. It is free, needs no key and no
 * account, and every record ingested from a Wikipedia category already carries the
 * article's URL.
 *
 * **What this measures, precisely.** How many people looked up an article in English
 * Wikipedia over the last twelve months. That is readership, not consumption — it
 * says nothing about how many people cook or eat a dish, and it will favour foods
 * that English speakers read about. The app has to say that where the number is
 * shown; calling it "popularity" without qualification would be the same dishonesty
 * in a new form.
 *
 * `views: 0` and "no data" are different states and are kept different. A record
 * whose article genuinely had no readers is not the same as one this pass never
 * reached, and only the first should ever be ranked.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CUISINES = resolve(HERE, '../src/data/cuisines.json');

const API = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user';
const USER_AGENT = 'GlobalTaste/1.0 (food atlas readership ingest; contact: via repository)';

/** Twelve whole months back from the start of this month. */
const WINDOW = (() => {
  const end = new Date();
  end.setUTCDate(1);
  const start = new Date(end);
  start.setUTCFullYear(start.getUTCFullYear() - 1);
  const stamp = (d) => `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}0100`;
  return { start: stamp(start), end: stamp(end) };
})();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * How long to wait after being throttled — as the server states it, not as we guess.
 *
 * Wikimedia answers a 429 with `Retry-After`, and it is typically four seconds. An
 * escalating backoff invented locally turned that four-second pause into what looked
 * like a permanent cooldown and stalled an entire run.
 */
const retryAfter = (res, attempt) => {
  const header = Number(res.headers.get('retry-after'));
  return Number.isFinite(header) && header > 0 ? header * 1000 + 250 : 2000 * attempt;
};

/** The article title out of a Wikipedia URL, still percent-encoded as the API wants. */
function titleFrom(url) {
  const match = /\/wiki\/(.+)$/.exec(url ?? '');
  return match ? match[1] : null;
}

/**
 * Twelve months of readership for one article.
 *
 * Returns `null` for "we do not know" — a network failure, a rate limit we gave up
 * on, or a title the API does not recognise. A 404 means the article has no recorded
 * views, which is a real zero and returned as one.
 */
async function readership(title, attempt = 1) {
  const url = `${API}/${title}/monthly/${WINDOW.start}/${WINDOW.end}`;

  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });

    // Wikimedia's limit is shared across every script pointed at it. Backing off
    // hard is cheaper than being throttled for the rest of the run.
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 5) return null;
      await sleep(retryAfter(res, attempt));
      return readership(title, attempt + 1);
    }
    if (res.status === 404) return 0;
    if (!res.ok) return null;

    const data = await res.json();
    return (data.items ?? []).reduce((sum, item) => sum + (item.views ?? 0), 0);
  } catch {
    return null;
  }
}

/** Re-read, apply, write — see the note in enrich-images.mjs. */
async function mergeWrite(path, updates) {
  const current = JSON.parse(await readFile(path, 'utf8'));
  const byTitle = new Map(current.map((r) => [r.title, r]));
  for (const [title, patch] of updates) {
    const existing = byTitle.get(title);
    if (existing) Object.assign(existing, patch);
  }
  await writeFile(path, JSON.stringify([...byTitle.values()]), 'utf8');
}

const main = async () => {
  const i = process.argv.indexOf('--limit');
  const limit = i > -1 ? Number(process.argv[i + 1]) : 0;

  const rows = JSON.parse(await readFile(CUISINES, 'utf8'));
  const byTitle = new Map(rows.map((r) => [r.title, r]));

  const pending = rows.filter((r) => r.url && r.views === undefined);
  const targets = limit ? pending.slice(0, limit) : pending;
  process.stdout.write(
    `${rows.length} rows, ${targets.length} without readership.\n` +
      `window: ${WINDOW.start.slice(0, 6)} to ${WINDOW.end.slice(0, 6)}\n`,
  );

  const updates = new Map();
  let known = 0;

  for (const [n, row] of targets.entries()) {
    const title = titleFrom(row.url);
    const views = title ? await readership(title) : null;

    // Only a real answer is recorded. Leaving the field absent means the next run
    // retries it, rather than freezing a failure in as a zero.
    if (views !== null) {
      const patch = { views };
      Object.assign(byTitle.get(row.title) ?? {}, patch);
      updates.set(row.title, patch);
      known += 1;
    }

    if (n % 100 === 0) {
      process.stdout.write(`  ${n}/${targets.length} — ${known} with a count\n`);
      await mergeWrite(CUISINES, updates);
    }
    await sleep(150);
  }

  await mergeWrite(CUISINES, updates);

  const fresh = JSON.parse(await readFile(CUISINES, 'utf8'));
  const counted = fresh.filter((r) => typeof r.views === 'number');
  const top = [...counted].sort((a, b) => b.views - a.views).slice(0, 10);
  process.stdout.write(
    `\n${known} counts this run. ${counted.length} of ${fresh.length} rows now have one.\n\nMost read:\n` +
      top.map((r) => `  ${String(r.views).padStart(9)}  ${r.name}`).join('\n') +
      '\n',
  );
};

main().catch((error) => {
  process.stderr.write(`\nReadership ingest failed: ${error.message}\n`);
  process.exitCode = 1;
});

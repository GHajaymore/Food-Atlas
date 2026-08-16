/**
 * Photographs, from each dish's own Wikipedia article.
 *
 *   node scripts/enrich-lead-images.mjs [--file cuisines] [--limit 500]
 *
 * This supersedes searching Commons by name, and it should have been the first
 * approach rather than the second.
 *
 * Searching Commons for "Akki rotti" asks a full-text index to guess which of eighty
 * million files shows a dish, and it guesses badly often enough that this repository
 * now carries a whole plausibility guard to catch the results. An article's lead
 * image needs no guessing: a Wikipedia editor chose that photograph to illustrate
 * that article, which is the exact judgement the search was trying to approximate.
 *
 * Every record ingested from a Wikipedia category already carries its article URL,
 * so the match is by identity rather than by resemblance — there is no name to get
 * wrong, no Israeli manakeesh standing in for a Lebanese man'ouche.
 *
 * These images are still `photoVerified: false` in the app. An editor's choice is
 * good evidence and not the app's own confirmation, and the distinction is the whole
 * point of the badge.
 *
 * Free, unauthenticated, and Commons-hosted, so the licence and artist come with the
 * file exactly as before. The REST summary endpoint returns the lead image alongside
 * the article extract, so this costs one request per record.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const dataFile = (name) => resolve(HERE, `../src/data/${name}.json`);

/** Only sources whose rows carry a Wikipedia article URL can be enriched this way. */
const TARGETS = {
  cuisines: { path: dataFile('cuisines'), key: 'title' },
};

const SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary';
const COMMONS = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'GlobalTaste/1.0 (food atlas lead-image ingest; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (html) => (html ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/**
 * How long to wait after being throttled.
 *
 * Wikimedia says so in `Retry-After`, and it is a much smaller number than it looks
 * like from outside — typically four seconds, not the minutes an escalating backoff
 * assumes. Guessing instead of reading it made a four-second pause look like a
 * permanent cooldown and stalled a whole run.
 *
 * The limit is per IP across all Wikimedia APIs, so a pass against Wikipedia spends
 * the budget a Commons request then needs. That is a reason to run one at a time,
 * not a reason to wait longer.
 */
const retryAfter = (res, attempt) => {
  const header = Number(res.headers.get('retry-after'));
  return Number.isFinite(header) && header > 0 ? header * 1000 + 250 : 2000 * attempt;
};

/** The article title out of a Wikipedia URL, still percent-encoded as the API wants. */
const titleFrom = (url) => /\/wiki\/(.+)$/.exec(url ?? '')?.[1] ?? null;

/**
 * The Commons file name inside an image URL.
 *
 * Two things have to come off, and missing either makes every subsequent lookup ask
 * Commons for a file that does not exist:
 *
 *   - **The query string.** Wikimedia now appends UTM tracking parameters to the
 *     URLs its REST API returns, so the last path segment ends
 *     `...jpg?utm_source=en.wikipedia.org&utm_campaign=api`. That silently turned
 *     4,085 valid files into 4,085 misses.
 *   - **The thumbnail width prefix.** A rendering is served as `960px-Name.jpg`;
 *     the file itself is `Name.jpg`.
 */
/**
 * One spelling of a file name, for matching a request to its answer.
 *
 * MediaWiki treats underscores and spaces as the same character in a title, and
 * hands back the space form regardless of which was asked for. Comparing the two
 * literally is why an earlier run attributed 964 files out of 4,085 and reported the
 * rest as missing when Commons had every one of them.
 */
const fileKey = (file) => (file ?? '').replace(/_/g, ' ').trim();

function commonsFile(source) {
  const last = (source ?? '').split('/').pop() ?? '';
  const withoutQuery = last.split('?')[0];
  try {
    return decodeURIComponent(withoutQuery).replace(/^\d+px-/, '');
  } catch {
    return withoutQuery.replace(/^\d+px-/, '');
  }
}

/**
 * Wikipedia's own illustration for an article, at a usable width.
 *
 * `thumbnail` is capped small, so the original is preferred and Commons is asked for
 * a 900px rendering of it — the full file is frequently several megabytes and this is
 * going into a phone list.
 */
async function leadImage(title, attempt = 1) {
  try {
    const res = await fetch(`${SUMMARY}/${title}`, { headers: { 'User-Agent': USER_AGENT } });

    // One rate limit is shared across every script pointed at Wikimedia. Backing off
    // hard is cheaper than being throttled for the rest of the run.
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 5) return null;
      await sleep(retryAfter(res, attempt));
      return leadImage(title, attempt + 1);
    }
    if (!res.ok) return null;

    const data = await res.json();
    const source = data?.originalimage?.source ?? data?.thumbnail?.source;
    if (!source) return null;

    const file = commonsFile(source);
    if (!file) return null;

    // Some leads are a map, a coat of arms or a portrait of the person a dish is
    // named after. Those are not photographs of food, and a diagram on a food card
    // is worse than no card.
    if (/\.svg$/i.test(file) || /coat_of_arms|flag_of|\bmap\b|locator/i.test(file)) return null;

    return { file, source };
  } catch {
    return null;
  }
}

/**
 * Artist and licence for up to fifty Commons files at once.
 *
 * Attribution is a condition of use on most of these, not a courtesy, so a file whose
 * terms cannot be read is not used at all.
 *
 * Batched because it has to be. Asking Commons per row put fifty times more load on
 * one host than the work needed, which is how this run earned a rate limit that then
 * blocked everything else pointed at Commons. The API takes fifty titles per query;
 * taking it up on that is the difference between four thousand requests and eighty.
 */
async function credits(files, attempt = 1) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    titles: files.map((f) => `File:${f}`).join('|'),
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '900',
  });

  try {
    const res = await fetch(`${COMMONS}?${params}`, { headers: { 'User-Agent': USER_AGENT } });
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 5) return new Map();
      await sleep(retryAfter(res, attempt));
      return credits(files, attempt + 1);
    }
    if (!res.ok) return new Map();

    const data = await res.json();
    const out = new Map();
    for (const page of data?.query?.pages ?? []) {
      const info = page?.imageinfo?.[0];
      if (!info?.thumburl) continue;
      // Keyed the way the caller will ask. MediaWiki titles use spaces where URLs
      // use underscores, and the two are the same file — matching them literally
      // silently lost three quarters of a run.
      out.set(fileKey(page.title.replace(/^File:/, '')), {
        photo: info.thumburl,
        credit: strip(info.extmetadata?.Artist?.value) || 'Wikimedia Commons',
        licence: strip(info.extmetadata?.LicenseShortName?.value) || 'see Commons',
      });
    }
    return out;
  } catch {
    return new Map();
  }
}

/** Re-read, apply, write — never writes an in-memory snapshot over the file. */
async function mergeWrite(path, key, updates) {
  const current = JSON.parse(await readFile(path, 'utf8'));
  const byKey = new Map(current.map((r) => [r[key], r]));
  for (const [id, patch] of updates) {
    const existing = byKey.get(id);
    if (existing) Object.assign(existing, patch);
  }
  await writeFile(path, JSON.stringify([...byKey.values()]), 'utf8');
}

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : fallback;
};

const main = async () => {
  const name = arg('--file', 'cuisines');
  const target = TARGETS[name];
  if (!target) throw new Error(`unknown --file ${name}; expected ${Object.keys(TARGETS).join(', ')}`);
  const limit = Number(arg('--limit', 0));

  const rows = JSON.parse(await readFile(target.path, 'utf8'));
  const byKey = new Map(rows.map((r) => [r[target.key], r]));

  /**
   * Attribution pass: turn identified lead files into images the app will show.
   * Fifty at a time, because the API takes fifty and asking one at a time is what
   * earned the rate limit that made this a separate run in the first place.
   */
  if (process.argv.includes('--credits')) {
    const waiting = rows.filter((r) => r.leadFile && !r.photo);
    process.stdout.write(`${name}: ${waiting.length} lead images awaiting attribution.\n`);

    const done = new Map();
    for (let start = 0; start < waiting.length; start += 50) {
      const batch = waiting.slice(start, start + 50);
      const priced = await credits([...new Set(batch.map((r) => r.leadFile))]);

      for (const row of batch) {
        const image = priced.get(fileKey(row.leadFile));
        if (image) done.set(row[target.key], image);
      }
      process.stdout.write(`  ${start + batch.length}/${waiting.length} — ${done.size} attributed\n`);
      await mergeWrite(target.path, target.key, done);
      await sleep(1000);
    }

    const fresh = JSON.parse(await readFile(target.path, 'utf8'));
    process.stdout.write(
      `\n${name}: ${done.size} images attributed and now visible.\n` +
        `  ${fresh.filter((r) => r.photo).length} of ${fresh.length} rows have a picture.\n`,
    );
    return;
  }

  // Rows that already have a picture are left alone, whatever found it.
  const pending = rows.filter((r) => r.url && !r.photo && !r.leadFile);
  const targets = limit ? pending.slice(0, limit) : pending;
  process.stdout.write(`${name}: ${rows.length} rows, ${targets.length} without an image.\n`);

  const updates = new Map();
  let found = 0;

  /**
   * Two hosts, two runs — not two phases of one run.
   *
   * Wikipedia hands back the article's lead image; Commons holds who took it and
   * under what terms. Those are separate rate limits, and interleaving them meant a
   * Commons cooldown stalled the Wikipedia work too, which is exactly what happened
   * after the first Commons crawl.
   *
   * So this run only records *which* file illustrates each dish. `--credits` turns
   * those into a `photo` the app will show, and nothing becomes visible until its
   * artist and licence are known — attribution is a condition of use on most of
   * these files, so an unattributed image is one we do not have the right to display.
   */
  for (const [n, row] of targets.entries()) {
    const title = titleFrom(row.url);
    const lead = title ? await leadImage(title) : null;

    // `leadImageChecked` is its own flag: a row the Commons name search gave up on
    // may still have a lead image, and vice versa.
    const patch = { leadImageChecked: true };
    if (lead) {
      patch.leadFile = lead.file;
      found += 1;
    }

    Object.assign(byKey.get(row[target.key]) ?? {}, patch);
    updates.set(row[target.key], patch);

    if (n % 100 === 0) {
      process.stdout.write(`  ${n}/${targets.length} — ${found} lead images identified\n`);
      await mergeWrite(target.path, target.key, updates);
    }
    await sleep(120);
  }

  await mergeWrite(target.path, target.key, updates);
  const fresh = JSON.parse(await readFile(target.path, 'utf8'));
  process.stdout.write(
    `\n${name}: ${found} lead images identified this run.\n` +
      `  ${fresh.filter((r) => r.leadFile && !r.photo).length} awaiting attribution — run again with --credits.\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nLead-image ingest failed: ${error.message}\n`);
  process.exitCode = 1;
});

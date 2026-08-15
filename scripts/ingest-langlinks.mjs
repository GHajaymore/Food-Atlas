/**
 * Which languages each dish can already be read in, from Wikipedia's own editions.
 *
 *   node scripts/ingest-langlinks.mjs [--limit 500]
 *
 * This is the backbone of the app's translation, and it is deliberately not machine
 * translation.
 *
 * Most records here came from an English Wikipedia article, and a great many of
 * those articles already exist in other languages — written by people who speak
 * them, usually by people who eat the food. Ukrainian borscht has a Ukrainian
 * article. Akki rotti has a Kannada one. Those are better than anything a model
 * would produce for us, they carry the dish's real name in that language rather than
 * a transliteration we invented, and they cost nothing at all.
 *
 * `langlinks` returns, for one article, every other edition it exists in, with the
 * title in each. Fifty articles per request, one request per fifty records, no key.
 *
 * ## What this does and does not claim
 *
 * A langlink means a reader of that language has somewhere real to go, and it gives
 * us the endonym — what that language actually calls the dish. It does not mean our
 * record has been translated: the other article is its own text, written by its own
 * editors, and may say different things. So the app links to it and names the dish
 * in that language; it does not silently swap our prose for theirs.
 *
 * The names are stored beside the original, never instead of it, which is the same
 * rule the glossary already follows. A Malayalam reader seeing "ഹാകാർൽ" next to
 * "Hákarl" gains something; seeing it replace "Hákarl" loses the identity of the
 * food, and that is the one thing this app will not trade.
 *
 * The counts this produces drive `offeredLanguages`: a language is put in the picker
 * once enough records can actually be read in it, so the list is never a promise the
 * catalogue cannot keep.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CUISINES = resolve(HERE, '../src/data/cuisines.json');

const API = 'https://en.wikipedia.org/w/api.php';
const USER_AGENT = 'GlobalTaste/1.0 (food atlas language coverage; contact: via repository)';

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

/** The article title out of a Wikipedia URL, decoded — the API wants plain text here. */
function titleFrom(url) {
  const match = /\/wiki\/(.+)$/.exec(url ?? '');
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]).replace(/_/g, ' ');
  } catch {
    return null;
  }
}

/**
 * Language editions for up to fifty articles at once.
 *
 * Returns a Map of article title to `{ lang: title }`. Titles are normalised by the
 * API — a redirect resolves to its target — so the response is keyed back through
 * `normalized` rather than assumed to match what was asked for.
 */
async function langlinks(titles, attempt = 1) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    titles: titles.join('|'),
    prop: 'langlinks',
    lllimit: 'max',
    redirects: '1',
  });

  try {
    const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': USER_AGENT } });
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 5) return new Map();
      await sleep(retryAfter(res, attempt));
      return langlinks(titles, attempt + 1);
    }
    if (!res.ok) return new Map();

    const data = await res.json();

    // A redirect means the article we asked for is filed under another title, so map
    // the answer back to the name the caller knows.
    const backToAsked = new Map();
    for (const r of data?.query?.redirects ?? []) backToAsked.set(r.to, r.from);
    for (const n of data?.query?.normalized ?? []) backToAsked.set(n.to, n.from);

    const out = new Map();
    for (const page of data?.query?.pages ?? []) {
      if (!page.langlinks?.length) continue;
      const asked = backToAsked.get(page.title) ?? page.title;
      const names = {};
      for (const link of page.langlinks) names[link.lang] = link.title;
      out.set(asked, names);
    }
    return out;
  } catch {
    return new Map();
  }
}

/** Re-read, apply, write — never writes an in-memory snapshot over the file. */
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
  const pending = rows.filter((r) => r.url && !r.langsChecked);
  const targets = limit ? pending.slice(0, limit) : pending;
  process.stdout.write(`${rows.length} rows, ${targets.length} without language coverage.\n`);

  const updates = new Map();
  const counts = new Map();
  let linked = 0;

  for (let start = 0; start < targets.length; start += 50) {
    const batch = targets.slice(start, start + 50);
    const byArticle = new Map();
    for (const row of batch) {
      const title = titleFrom(row.url);
      if (title) byArticle.set(title, row);
    }

    const found = byArticle.size ? await langlinks([...byArticle.keys()]) : new Map();

    for (const [title, row] of byArticle) {
      const names = found.get(title);
      const patch = { langsChecked: true };
      if (names && Object.keys(names).length) {
        // Both halves are kept: the codes drive the coverage counts, the titles are
        // the dish's real name in that language and are shown beside the original.
        patch.langs = Object.keys(names).sort();
        patch.langNames = names;
        linked += 1;
        for (const code of patch.langs) counts.set(code, (counts.get(code) ?? 0) + 1);
      }
      updates.set(row.title, patch);
    }

    process.stdout.write(`  ${start + batch.length}/${targets.length} — ${linked} with other editions\n`);
    await mergeWrite(CUISINES, updates);
    await sleep(400);
  }

  await mergeWrite(CUISINES, updates);

  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25);
  process.stdout.write(
    `\n${linked} records readable in at least one other language.\n\nBest covered:\n` +
      top.map(([code, n]) => `  ${code.padEnd(6)} ${String(n).padStart(6)}`).join('\n') +
      '\n',
  );
};

main().catch((error) => {
  process.stderr.write(`\nLanguage coverage ingest failed: ${error.message}\n`);
  process.exitCode = 1;
});

/**
 * The Wikipedia article behind each Wikidata record.
 *
 *   node scripts/resolve-article-urls.mjs [--limit 500]
 *
 * 7,870 records — 59% of the catalogue — came from Wikidata carrying a name, a
 * country and a Q-number, and nothing else. Not one has an ingredient, a
 * preparation, or an article this project has ever read. They are the reason two
 * fifths of the atlas is a name and a place.
 *
 * The enrichment that fixed exactly this for the cuisine records reads a Wikipedia
 * article and pulls the infobox, the ingredients and the article's own account of
 * how the dish is made. It needs one thing these rows do not have: the article's
 * URL. Wikidata knows it — every item lists its sitelinks — so this fills the field
 * in and hands the rows to the pass that already works.
 *
 * Nothing is interpreted here. It resolves an identifier to a URL and stops; whether
 * a record gains evidence is decided by `enrich-infobox.mjs` reading the article.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CATALOGUE = resolve(HERE, '../src/data/catalogue.json');

const WIKIDATA = 'https://www.wikidata.org/w/api.php';
const USER_AGENT = 'GlobalTaste/1.0 (food atlas article resolution; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const retryAfter = (res, attempt) => {
  const header = Number(res.headers.get('retry-after'));
  return Number.isFinite(header) && header > 0 ? header * 1000 + 250 : 2000 * attempt;
};

/** English Wikipedia titles for up to fifty items. */
async function titlesFor(qids, attempt = 1) {
  const params = new URLSearchParams({
    action: 'wbgetentities',
    format: 'json',
    ids: qids.join('|'),
    props: 'sitelinks',
    sitefilter: 'enwiki',
  });

  try {
    const res = await fetch(`${WIKIDATA}?${params}`, { headers: { 'User-Agent': USER_AGENT } });
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 5) return new Map();
      await sleep(retryAfter(res, attempt));
      return titlesFor(qids, attempt + 1);
    }
    if (!res.ok) return new Map();

    const data = await res.json();
    const out = new Map();
    for (const [qid, entity] of Object.entries(data?.entities ?? {})) {
      const title = entity?.sitelinks?.enwiki?.title;
      if (title) out.set(qid, title);
    }
    return out;
  } catch {
    return new Map();
  }
}

const main = async () => {
  const i = process.argv.indexOf('--limit');
  const limit = i > -1 ? Number(process.argv[i + 1]) : 0;

  const rows = JSON.parse(await readFile(CATALOGUE, 'utf8'));
  const pending = rows.filter((r) => r.qid && !r.url && !r.urlChecked);
  const targets = limit ? pending.slice(0, limit) : pending;
  process.stdout.write(`${rows.length} rows, ${targets.length} without an article URL.\n`);

  let found = 0;

  for (let start = 0; start < targets.length; start += 50) {
    const batch = targets.slice(start, start + 50);
    const byQid = new Map(batch.map((r) => [r.qid, r]));
    const titles = await titlesFor([...byQid.keys()]);

    for (const [qid, row] of byQid) {
      row.urlChecked = true;
      const title = titles.get(qid);
      if (!title) continue;
      row.url = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;
      found += 1;
    }

    await writeFile(CATALOGUE, JSON.stringify(rows), 'utf8');
    process.stdout.write(`  ${start + batch.length}/${targets.length} — ${found} articles found\n`);
    await sleep(300);
  }

  const fresh = JSON.parse(await readFile(CATALOGUE, 'utf8'));
  process.stdout.write(
    `\n${found} articles resolved this run.\n` +
      `  ${fresh.filter((r) => r.url).length} of ${fresh.length} rows now have one.\n` +
      `  Run enrich-infobox.mjs --file catalogue next.\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nArticle resolution failed: ${error.message}\n`);
  process.exitCode = 1;
});

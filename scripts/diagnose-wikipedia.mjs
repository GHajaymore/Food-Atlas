/**
 * Is Wikipedia a better source than Wikidata for under-covered cuisines?
 *
 *   node scripts/diagnose-wikipedia.mjs
 *
 * Wikidata's `country of origin` turns out to reflect which national projects have
 * run bulk imports, not where the world's food is: 4,693 Italian items against 173
 * Indian. Wikipedia's category trees are maintained by a much broader set of editors,
 * so this counts articles under each cuisine's category tree to see whether the
 * coverage is there after all, just not as structured statements.
 *
 * Counting only — nothing is written.
 */

const API = 'https://en.wikipedia.org/w/api.php';
const USER_AGENT = 'GlobalTaste/1.0 (coverage diagnostic; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * `origin=*` is for browsers; server-side it forces anonymous handling and a much
 * tighter rate limit. Dropped, with backoff on 429 — this is a free public API and
 * being a polite client is the price of using it.
 */
async function api(params, attempt = 1) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, 'Accept-Encoding': 'gzip' } });

  if (res.status === 429 || res.status >= 500) {
    if (attempt > 4) throw new Error(`HTTP ${res.status} after ${attempt} attempts`);
    await sleep(3000 * attempt);
    return api(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Walk a category tree, counting article pages (namespace 0).
 * Depth-limited: cuisine trees fan out into ingredients and restaurants otherwise.
 */
async function countTree(root, maxDepth = 2) {
  const seenCats = new Set();
  const articles = new Set();
  let queue = [{ title: root, depth: 0 }];

  while (queue.length) {
    const { title, depth } = queue.shift();
    if (seenCats.has(title) || depth > maxDepth) continue;
    seenCats.add(title);

    let cont;
    do {
      const data = await api({
        action: 'query',
        list: 'categorymembers',
        cmtitle: title,
        cmlimit: '500',
        cmtype: 'page|subcat',
        ...(cont ? { cmcontinue: cont } : {}),
      });

      for (const m of data?.query?.categorymembers ?? []) {
        if (m.ns === 0) articles.add(m.title);
        else if (m.ns === 14 && depth < maxDepth) queue.push({ title: m.title, depth: depth + 1 });
      }
      cont = data?.continue?.cmcontinue;
      await sleep(400);
    } while (cont);
  }

  return { articles: articles.size, categories: seenCats.size };
}

const TARGETS = [
  'Category:Indian cuisine',
  'Category:Chinese cuisine',
  'Category:Japanese cuisine',
  'Category:Indonesian cuisine',
  'Category:Thai cuisine',
  'Category:Italian cuisine',
  'Category:Mexican cuisine',
  'Category:Nigerian cuisine',
];

const main = async () => {
  process.stdout.write('category                       articles  subcats\n');
  process.stdout.write('------------------------------------------------\n');
  for (const t of TARGETS) {
    try {
      const { articles, categories } = await countTree(t);
      process.stdout.write(
        `${t.replace('Category:', '').padEnd(28)} ${String(articles).padStart(8)} ${String(categories).padStart(8)}\n`,
      );
    } catch (error) {
      process.stdout.write(`${t.padEnd(28)} failed (${error.message})\n`);
    }
    await sleep(1500);
  }
};

main().catch((e) => {
  process.stderr.write(`diagnostic failed: ${e.message}\n`);
  process.exitCode = 1;
});

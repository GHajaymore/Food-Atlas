/**
 * Enrich the imported catalogue, so records can earn a classification.
 *
 *   node scripts/enrich-wikipedia.mjs
 *   node scripts/enrich-wikipedia.mjs --missing   # only rows not yet enriched
 *
 * Every imported record arrives Unverified, because the first pass fetched a name
 * and a place and nothing that speaks to how the dish is made. This pass gathers the
 * evidence that can actually answer some of the brief's seven checks:
 *
 *   - **Ingredients** — Wikidata P186 "made from material".
 *   - **Heritage designation** — P1435 (PDO, PGI, TSG, Italy's PAT and national
 *     equivalents). An institutional register of traditional products.
 *   - **An encyclopaedia article** — the Wikipedia sitelink, and its intro extract,
 *     which also gives the record a real description instead of a stub line.
 *
 * What it deliberately does NOT do: invent a method. Wikipedia prose is unreliable to
 * parse into steps, and a wrong fermentation time is a corrupted record. Traditional
 * technique stays an open check, which is what keeps every imported score below that
 * of a record someone actually documented. See src/domain/assess.ts for the rules.
 *
 * Output is merged into src/data/catalogue.json by Wikidata id; re-running is
 * additive and safe.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../src/data/catalogue.json');

const SPARQL = 'https://query.wikidata.org/sparql';
const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const USER_AGENT = 'GlobalTaste/1.0 (authenticity-first food atlas; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sparql(query, attempt = 1) {
  const url = `${SPARQL}?format=json&query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/sparql-results+json', 'User-Agent': USER_AGENT },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return JSON.parse(await res.text()).results.bindings;
  } catch (error) {
    if (attempt < 3) {
      await sleep(2500 * attempt);
      return sparql(query, attempt + 1);
    }
    throw error;
  }
}

/**
 * Ingredients, heritage designation and the English Wikipedia title, for the dishes
 * of one country. Partitioned by country for the same reason the import is: a deep
 * OFFSET times the endpoint out.
 */
const evidenceQuery = (country) => `
SELECT ?item ?ingredientLabel ?heritageLabel ?article WHERE {
  { ?item wdt:P31/wdt:P279* wd:Q746549 . } UNION { ?item wdt:P31/wdt:P279* wd:Q2095 . }
  ?item wdt:P495 wd:${country} .
  OPTIONAL { ?item wdt:P186 ?ingredient . }
  OPTIONAL { ?item wdt:P1435 ?heritage . }
  OPTIONAL { ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
`;

/** Countries present in the catalogue, mapped back to their Wikidata ids. */
const countryIdQuery = `
SELECT DISTINCT ?country ?countryLabel WHERE {
  { ?item wdt:P31/wdt:P279* wd:Q746549 . } UNION { ?item wdt:P31/wdt:P279* wd:Q2095 . }
  ?item wdt:P495 ?country .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
`;

/** Intro extracts, 20 titles per request — the MediaWiki API's batch limit. */
async function fetchExtracts(titles) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    prop: 'extracts',
    exintro: '1',
    explaintext: '1',
    exlimit: '20',
    redirects: '1',
    titles: titles.join('|'),
    origin: '*',
  });

  try {
    const res = await fetch(`${WIKI_API}?${params}`, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return {};
    const data = await res.json();
    const pages = data?.query?.pages ?? {};
    const out = {};
    for (const page of Object.values(pages)) {
      if (page.title && page.extract) out[page.title] = page.extract;
    }
    return out;
  } catch {
    return {};
  }
}

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const main = async () => {
  const onlyMissing = process.argv.includes('--missing');
  const rows = JSON.parse(await readFile(OUT, 'utf8'));
  const byQid = new Map(rows.map((r) => [r.qid, r]));

  process.stdout.write(`${rows.length} records on disk. Finding countries…\n`);
  const countryRows = await sparql(countryIdQuery);

  const present = new Set(rows.map((r) => r.country));
  const countries = countryRows
    .map((r) => ({ qid: (r.country?.value ?? '').split('/').pop(), label: r.countryLabel?.value ?? '' }))
    .filter((c) => c.qid && c.label && present.has(c.label))
    .sort((a, b) => a.label.localeCompare(b.label));

  process.stdout.write(`${countries.length} countries to enrich.\n`);

  // Pass 1 — structured evidence from Wikidata.
  const articles = new Map(); // qid -> wikipedia title
  let enriched = 0;

  for (const [index, country] of countries.entries()) {
    const already = rows.filter((r) => r.country === country.label && r.evidence);
    if (onlyMissing && already.length && already.length === rows.filter((r) => r.country === country.label).length) {
      process.stdout.write(`  [${index + 1}/${countries.length}] ${country.label}: already enriched\n`);
      continue;
    }

    try {
      const found = await sparql(evidenceQuery(country.qid));
      const perItem = new Map();

      for (const row of found) {
        const qid = (row.item?.value ?? '').split('/').pop();
        if (!qid || !byQid.has(qid)) continue;
        const entry = perItem.get(qid) ?? { ingredients: new Set(), heritage: new Set(), article: null };

        const ing = row.ingredientLabel?.value;
        if (ing && !/^Q\d+$/.test(ing)) entry.ingredients.add(ing);

        const her = row.heritageLabel?.value;
        if (her && !/^Q\d+$/.test(her)) entry.heritage.add(her);

        if (row.article?.value) {
          entry.article = decodeURIComponent(row.article.value.split('/wiki/').pop() ?? '').replace(/_/g, ' ');
        }
        perItem.set(qid, entry);
      }

      for (const [qid, entry] of perItem) {
        const record = byQid.get(qid);
        record.evidence = {
          ingredients: [...entry.ingredients].slice(0, 8),
          heritage: [...entry.heritage].slice(0, 3),
          hasArticle: !!entry.article,
          extractLength: record.evidence?.extractLength ?? 0,
        };
        if (entry.article) articles.set(qid, entry.article);
        enriched += 1;
      }

      process.stdout.write(`  [${index + 1}/${countries.length}] ${country.label}: ${perItem.size} enriched\n`);
    } catch (error) {
      process.stdout.write(`  [${index + 1}/${countries.length}] ${country.label}: failed (${error.message})\n`);
    }
    await sleep(300);
  }

  // Pass 2 — Wikipedia intro extracts, for a real description.
  const titles = [...articles.entries()];
  process.stdout.write(`\nFetching ${titles.length} Wikipedia extracts…\n`);

  const byTitle = new Map(titles.map(([qid, title]) => [title, qid]));
  const batches = chunk([...byTitle.keys()], 20);

  for (const [i, batch] of batches.entries()) {
    const extracts = await fetchExtracts(batch);
    for (const [title, extract] of Object.entries(extracts)) {
      const qid = byTitle.get(title);
      const record = qid && byQid.get(qid);
      if (!record) continue;
      const clean = extract.replace(/\s+/g, ' ').trim();
      record.evidence.extractLength = clean.length;
      // A real first sentence beats the generated stub line.
      if (clean.length > 40) record.blurb = clean.slice(0, 400);
    }
    if (i % 20 === 0) process.stdout.write(`  batch ${i + 1}/${batches.length}\n`);
    await sleep(150);
  }

  await writeFile(OUT, JSON.stringify(rows), 'utf8');

  const withIngredients = rows.filter((r) => r.evidence?.ingredients?.length).length;
  const withHeritage = rows.filter((r) => r.evidence?.heritage?.length).length;
  const withArticle = rows.filter((r) => r.evidence?.hasArticle).length;

  process.stdout.write(
    `\nEnriched ${enriched} records.\n` +
      `  ${withIngredients} with ingredients\n` +
      `  ${withHeritage} with a heritage designation\n` +
      `  ${withArticle} with a Wikipedia article\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nEnrichment failed: ${error.message}\n`);
  process.exitCode = 1;
});

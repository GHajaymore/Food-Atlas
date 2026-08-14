/**
 * Third source: Wikipedia cuisine category trees.
 *
 *   node scripts/ingest-cuisines.mjs [--limit 40]
 *
 * Wikidata's `country of origin` describes which national projects ran bulk imports,
 * not where the world's food is: 4,693 Italian items against 173 Indian and 139
 * Chinese. That is the wrong shape for an atlas whose subject is the world's oldest
 * living food traditions.
 *
 * Wikipedia's category trees are maintained by a far broader set of editors, and a
 * dish gets categorised as Indian or Sichuan or Levantine long before anyone writes
 * a structured country-of-origin statement for it. So this walks the cuisine trees
 * directly, and the list below is deliberately weighted towards Asia and the oldest
 * continuous food cultures rather than towards whoever has the tidiest database.
 *
 * Records land as `unverified` with their cuisine's place attached, exactly like the
 * Wikidata import: a category membership says where a dish belongs, not how it is
 * made. The enrichment pass is what gives them substance.
 *
 * Output merges into src/data/cuisines.json by article title; re-running is additive.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../src/data/cuisines.json');

const API = 'https://en.wikipedia.org/w/api.php';
const USER_AGENT = 'GlobalTaste/1.0 (food atlas ingest; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * The cuisines to walk, and the place each maps to.
 *
 * Weighted to Asia and to the oldest continuous traditions — the Indian
 * subcontinent, China, Persia, the Levant, Anatolia, Egypt, Ethiopia, Mesoamerica
 * and the Andes — because those are the cultures the structured sources under-serve
 * most badly, and the ones this atlas exists for.
 */
const CUISINES = [
  // South Asia
  { cat: 'Category:Indian cuisine', country: 'India', region: '' },
  { cat: 'Category:Indian cuisine by state or union territory', country: 'India', region: '' },
  { cat: 'Category:Pakistani cuisine', country: 'Pakistan', region: '' },
  { cat: 'Category:Bangladeshi cuisine', country: 'Bangladesh', region: '' },
  { cat: 'Category:Sri Lankan cuisine', country: 'Sri Lanka', region: '' },
  { cat: 'Category:Nepalese cuisine', country: 'Nepal', region: '' },
  { cat: 'Category:Afghan cuisine', country: 'Afghanistan', region: '' },
  // East Asia
  { cat: 'Category:Chinese cuisine', country: 'China', region: '' },
  { cat: 'Category:Chinese cuisine by region', country: 'China', region: '' },
  { cat: 'Category:Japanese cuisine', country: 'Japan', region: '' },
  { cat: 'Category:Korean cuisine', country: 'South Korea', region: '' },
  { cat: 'Category:Taiwanese cuisine', country: 'Taiwan', region: '' },
  { cat: 'Category:Mongolian cuisine', country: 'Mongolia', region: '' },
  // Southeast Asia
  { cat: 'Category:Thai cuisine', country: 'Thailand', region: '' },
  { cat: 'Category:Vietnamese cuisine', country: 'Vietnam', region: '' },
  { cat: 'Category:Indonesian cuisine', country: 'Indonesia', region: '' },
  { cat: 'Category:Malaysian cuisine', country: 'Malaysia', region: '' },
  { cat: 'Category:Filipino cuisine', country: 'Philippines', region: '' },
  { cat: 'Category:Burmese cuisine', country: 'Myanmar', region: '' },
  { cat: 'Category:Cambodian cuisine', country: 'Cambodia', region: '' },
  { cat: 'Category:Lao cuisine', country: 'Laos', region: '' },
  // West and Central Asia — among the oldest continuous traditions
  { cat: 'Category:Iranian cuisine', country: 'Iran', region: '' },
  { cat: 'Category:Turkish cuisine', country: 'Turkey', region: '' },
  { cat: 'Category:Lebanese cuisine', country: 'Lebanon', region: '' },
  { cat: 'Category:Syrian cuisine', country: 'Syria', region: '' },
  { cat: 'Category:Iraqi cuisine', country: 'Iraq', region: '' },
  { cat: 'Category:Israeli cuisine', country: 'Israel', region: '' },
  { cat: 'Category:Palestinian cuisine', country: 'Palestine', region: '' },
  { cat: 'Category:Uzbek cuisine', country: 'Uzbekistan', region: '' },
  { cat: 'Category:Georgian cuisine', country: 'Georgia', region: '' },
  { cat: 'Category:Armenian cuisine', country: 'Armenia', region: '' },
  // Africa
  { cat: 'Category:Egyptian cuisine', country: 'Egypt', region: '' },
  { cat: 'Category:Ethiopian cuisine', country: 'Ethiopia', region: '' },
  { cat: 'Category:Moroccan cuisine', country: 'Morocco', region: '' },
  { cat: 'Category:Nigerian cuisine', country: 'Nigeria', region: '' },
  { cat: 'Category:Ghanaian cuisine', country: 'Ghana', region: '' },
  { cat: 'Category:Kenyan cuisine', country: 'Kenya', region: '' },
  { cat: 'Category:Senegalese cuisine', country: 'Senegal', region: '' },
  { cat: 'Category:South African cuisine', country: 'South Africa', region: '' },
  // The Americas — Mesoamerica and the Andes
  { cat: 'Category:Mexican cuisine', country: 'Mexico', region: '' },
  { cat: 'Category:Peruvian cuisine', country: 'Peru', region: '' },
  { cat: 'Category:Bolivian cuisine', country: 'Bolivia', region: '' },
  { cat: 'Category:Guatemalan cuisine', country: 'Guatemala', region: '' },
  { cat: 'Category:Brazilian cuisine', country: 'Brazil', region: '' },
  // Europe, for balance rather than emphasis
  { cat: 'Category:Greek cuisine', country: 'Greece', region: '' },
  { cat: 'Category:Portuguese cuisine', country: 'Portugal', region: '' },
];

/**
 * Categories that lead away from dishes.
 *
 * Two kinds are excluded. The first is the obvious drift into people, businesses and
 * media. The second matters more: **raw ingredients**. A cuisine tree contains
 * "Indian spices" and "GI Tagged Rice varieties", and walking into them yields
 * asafoetida and Navara rice — real subjects, but not dishes. They would enter the
 * atlas as records with no preparation and nothing to show, which is precisely the
 * emptiness the catalogue was just cleaned of.
 */
const SKIP_CATEGORY = new RegExp(
  [
    // Drift into people, businesses and media.
    'restaurant|chef|company|brand|writer|book|film|television|award|museum|festival|stub',
    // Raw ingredients and produce — real subjects, but not dishes.
    'spice|herb|ingredient|condiment|varieties|cultivar|crop|grain|flour|legume|fruit|vegetable',
    'gi tagged|geographical indication|nut|seed|edible oil|salt|sweetener|utensil|cookware',
  ].join('|'),
  'i',
);

/** Articles that are clearly not a dish. */
const SKIP_ARTICLE =
  /(cuisine of|list of|category:|template:|culture of|agriculture|industry|hub$|museum|festival)/i;

async function api(params, attempt = 1) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });

  if (res.status === 429 || res.status >= 500) {
    if (attempt > 5) throw new Error(`HTTP ${res.status} after ${attempt} attempts`);
    await sleep(5000 * attempt);
    return api(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Walk one cuisine tree to a bounded depth, collecting article titles.
 *
 * Depth 2 is the sweet spot: deep enough to reach "Category:Indian cuisine" ->
 * "Category:Kerala cuisine" -> the dishes, shallow enough not to wander into
 * agriculture and restaurant chains.
 */
async function walk(root, maxDepth = 2) {
  const seen = new Set();
  const articles = new Map();
  const queue = [{ title: root, depth: 0 }];

  while (queue.length) {
    const { title, depth } = queue.shift();
    if (seen.has(title) || depth > maxDepth) continue;
    seen.add(title);

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
        if (m.ns === 0) {
          if (!SKIP_ARTICLE.test(m.title)) {
            // The subcategory a dish was found under is its best region hint.
            articles.set(m.title, depth > 0 ? title.replace(/^Category:/, '') : '');
          }
        } else if (m.ns === 14 && depth < maxDepth && !SKIP_CATEGORY.test(m.title)) {
          queue.push({ title: m.title, depth: depth + 1 });
        }
      }
      cont = data?.continue?.cmcontinue;
      await sleep(600);
    } while (cont);
  }

  return articles;
}

/** 'Kerala cuisine' -> 'Kerala'. Empty when the hint is not a place. */
const regionFrom = (hint) => {
  if (!hint) return '';
  const cleaned = hint
    .replace(/\s*cuisine\s*/i, '')
    .replace(/\s*(dishes|desserts|breads|snacks|sweets|confectionery)\s*/i, '')
    .trim();

  // A category name is only a useful region if it names a place or a community.
  // "Indian spices" and "Indian confectionery" describe a kind of food, not a where.
  if (SKIP_CATEGORY.test(cleaned)) return '';
  if (!cleaned || cleaned.length < 3 || cleaned.length > 40) return '';
  return /^(indian|chinese|japanese|pakistani|thai|korean)$/i.test(cleaned) ? '' : cleaned;
};

const main = async () => {
  const limitArg = process.argv.indexOf('--limit');
  const limit = limitArg > -1 ? Number(process.argv[limitArg + 1]) : CUISINES.length;

  let existing = [];
  try {
    existing = JSON.parse(await readFile(OUT, 'utf8'));
  } catch {
    existing = [];
  }
  const byTitle = new Map(existing.map((r) => [r.title, r]));
  process.stdout.write(`${existing.length} cuisine records on disk.\n`);

  const targets = CUISINES.slice(0, limit);
  for (const [i, cuisine] of targets.entries()) {
    try {
      const found = await walk(cuisine.cat);
      let added = 0;
      for (const [title, hint] of found) {
        if (byTitle.has(title)) continue;
        byTitle.set(title, {
          title,
          name: title,
          country: cuisine.country,
          region: regionFrom(hint),
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
        });
        added += 1;
      }
      process.stdout.write(
        `  [${i + 1}/${targets.length}] ${cuisine.cat.replace('Category:', '').padEnd(38)} found ${String(found.size).padStart(5)}  new ${added}\n`,
      );
    } catch (error) {
      process.stdout.write(`  [${i + 1}/${targets.length}] ${cuisine.cat}: failed (${error.message})\n`);
    }

    // Checkpoint every cuisine — this run is long and network-bound.
    await mkdir(dirname(OUT), { recursive: true });
    await writeFile(OUT, JSON.stringify([...byTitle.values()]), 'utf8');
    await sleep(1200);
  }

  const records = [...byTitle.values()];
  const byCountry = {};
  for (const r of records) byCountry[r.country] = (byCountry[r.country] || 0) + 1;

  process.stdout.write(`\nWrote ${records.length} dishes to src/data/cuisines.json\n`);
  for (const [country, n] of Object.entries(byCountry).sort((a, b) => b[1] - a[1]).slice(0, 15)) {
    process.stdout.write(`  ${country.padEnd(16)} ${n}\n`);
  }
};

main().catch((error) => {
  process.stderr.write(`\nCuisine ingest failed: ${error.message}\n`);
  process.exitCode = 1;
});

/**
 * UNESCO Intangible Cultural Heritage — the evidence the atlas was missing.
 *
 *   node scripts/ingest-unesco.mjs [--dry]
 *
 * Almost every record in the catalogue is Unclassified, and no amount of extra
 * dishes fixes that: the bottleneck is evidence, not volume. Wikidata carries 36
 * heritage designations across all food, most of them listed buildings attached to
 * miscategorised items. The official geographical-indication registers have no
 * public APIs.
 *
 * UNESCO's ICH lists are the exception, and they are the strongest free evidence
 * available for both of the app's hardest questions:
 *
 *   - **Authenticity.** An inscription is an intergovernmental body documenting a
 *     living tradition, its community and its practice. That is exactly the brief's
 *     "credible documentation" and "recognised traditional preparation associated
 *     with a broader region" — evidence for a real classification rather than a
 *     guess. These are the only imported records that reach Authentic — Regional.
 *
 *   - **At risk.** The Urgent Safeguarding List (/USL/) is a register of traditions
 *     assessed as *in need of urgent safeguarding*. That is a sourced, authoritative
 *     statement of decline, which is precisely what the at-risk rule requires and
 *     what text-mining Wikipedia could not supply.
 *
 * Only the food-related elements are taken; ICH covers dance, weaving and ritual too.
 * The filter is keyword-based and deliberately generous, because a missed tradition
 * is worse here than one to review — and every record carries its inscription link,
 * so a wrong one is visible rather than buried.
 *
 * Licensing note: this reads UNESCO's published lists. Each record links back to its
 * inscription page and names UNESCO as the source. Worth confirming their terms
 * before this becomes a shipped dependency rather than a one-off enrichment.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../src/data/unesco.json');

const LISTS_URL = 'https://ich.unesco.org/en/lists';
const USER_AGENT = 'GlobalTaste/1.0 (heritage research; contact: via repository)';

/**
 * Food-related keywords.
 *
 * Generous on purpose: ICH inscriptions are phrased as practices — "knowledge,
 * know-how and practices pertaining to…" — so the food word can sit anywhere in a
 * long title.
 */
const FOOD = new RegExp(
  [
    'food', 'cuisine', 'culinary', 'dish', 'gastronom', 'cook', 'kitchen', 'meal', 'diet',
    'bread', 'flatbread', 'lavash', 'pizza', 'pasta', 'noodle', 'rice', 'couscous', 'porridge',
    'cheese', 'butter', 'yoghurt', 'yogurt', 'milk', 'dairy',
    'coffee', 'tea', 'beer', 'wine', 'mead', 'brew', 'ferment', 'distil', 'liquor', 'sake',
    'kimchi', 'kimjang', 'washoku', 'dolma', 'keskek', 'keşkek', 'pilaf', 'palav', 'ceviche',
    'harissa', 'nsima', 'ugali', 'injera', 'hummus', 'baklava', 'halva', 'honey',
    'olive oil', 'salt', 'sugar', 'spice', 'pepper', 'chilli', 'saffron',
    'fish', 'seafood', 'shellfish', 'oyster', 'smoking of', 'curing', 'preserv',
    'harvest', 'vine', 'orchard', 'beekeep', 'apicultur', 'pastoral', 'transhumance',
    'banquet', 'feast', 'festive meal', 'hawker', 'market', 'soup', 'stew', 'sauce', 'cake',
    'confection', 'sweet', 'pastry', 'grill', 'barbec', 'roast',
  ].join('|'),
  'i',
);

/** Categories that use a food word but are not about preparing food. */
const NOT_FOOD = /(dance|music|song|puppet|weav|carpet|embroider|pottery only|falconry|horse|wrestl|calligraph|theatre|epic|poetry|carnival|procession)/i;

const listOf = (href) => {
  if (href.includes('/USL/')) return 'urgent-safeguarding';
  if (href.includes('/BSP/')) return 'best-practice';
  return 'representative';
};

const clean = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const main = async () => {
  const dry = process.argv.includes('--dry');

  process.stdout.write('Fetching UNESCO ICH lists…\n');
  const response = await fetch(LISTS_URL, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();

  /*
   * Each element is one flex-table row: a titled link to its inscription page,
   * followed by a meta cell naming the countries that submitted it. Parsed as a
   * pair so an element without a country is skipped rather than half-recorded.
   */
  const rowPattern =
    /<a class="link" href="(https:\/\/ich\.unesco\.org\/en\/(?:RL|USL|BSP)\/[^"]+)"[^>]*title="Reference: (\d+)"[^>]*>([\s\S]*?)<\/a>[\s\S]{0,200}?<div class="flex-table-cell-meta">([\s\S]*?)<\/div>/g;

  const records = [];
  const seen = new Set();

  for (const match of html.matchAll(rowPattern)) {
    const [, url, reference, rawTitle, rawCountries] = match;
    const title = clean(rawTitle);
    const countries = clean(rawCountries)
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (!title || !countries.length || seen.has(reference)) continue;
    if (!FOOD.test(title) || NOT_FOOD.test(title)) continue;
    seen.add(reference);

    records.push({
      reference,
      name: title,
      countries,
      /** The submitting country the record is filed under; the rest are co-claims. */
      country: countries[0],
      list: listOf(url),
      url,
    });
  }

  const urgent = records.filter((r) => r.list === 'urgent-safeguarding');

  process.stdout.write(`\n${records.length} food-related inscriptions found.\n`);
  process.stdout.write(`  ${urgent.length} on the Urgent Safeguarding List — authoritative at-risk evidence.\n`);
  process.stdout.write(`  ${new Set(records.flatMap((r) => r.countries)).size} countries represented.\n\n`);

  for (const r of records.slice(0, 15)) {
    process.stdout.write(`  [${r.list === 'urgent-safeguarding' ? 'URGENT' : 'repr. '}] ${r.name.slice(0, 72)}\n`);
  }

  if (dry) {
    process.stdout.write('\n--dry: nothing written.\n');
    return;
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(records, null, 0), 'utf8');
  process.stdout.write(`\nWrote ${records.length} inscriptions to src/data/unesco.json\n`);
};

main().catch((error) => {
  process.stderr.write(`\nUNESCO ingest failed: ${error.message}\n`);
  process.exitCode = 1;
});

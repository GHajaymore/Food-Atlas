/**
 * Stop printing one country's region inside another country.
 *
 *   node scripts/fix-cross-border-regions.mjs [--dry]
 *
 * ## What was wrong
 *
 * The record page's title is "dish — region, country", and for about thirty records the
 * region is a first-level unit of a *different* country: "Sarapatel — Goa, Portugal",
 * "Weisswurst — Bavaria, Poland", "Nasi kandar — Penang, India", "Imagawayaki — Taiwan,
 * Japan", and five Tibetan dishes under India, Nepal and Mongolia as "Tibet". Every rule
 * in `place.ts` passes those strings, because the fault is not in the words.
 * `ingest-geonames.mjs` has reported them since it was written — "Reported, never moved"
 * — and nothing read the report. Found on 9 October by reading Sarapatel's title.
 *
 * ## Why a reviewed table and not a rule
 *
 * The same report also lists "Belgium › Limburg", "Slovenia › Styria", "France ›
 * Réunion" and "Ghana › Western Region", which are all right — GeoNames simply files
 * them differently — and a rule cannot tell those from Goa. Each entry below was read
 * against its article on 9 October.
 *
 * ## Two actions, and which one each gets
 *
 * - **Drop the region, keep the country** — the default. It removes the false statement
 *   and asserts nothing new. Every record with `originClaims` gets this and only this:
 *   its country is a recorded dispute, and `fix-misfiled-country.mjs` already refuses to
 *   move those for the same reason.
 * - **Correct the place** — only where the article's own lead names the home in plain
 *   words, and no dispute is recorded. "Nasi kandar is a popular northern Malaysian dish
 *   from Penang"; "Manapua is the Hawaiian adaptation of the Chinese bun"; Hodge-podge "is
 *   particularly associated with Scotland" — so the United Kingdom, not China, and not
 *   the Nova Scotia this table first guessed before the article was read.
 *
 * A record matches on name, country *and* region together, so a re-run, or a later
 * edit that already fixed one, changes nothing.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const dry = process.argv.includes('--dry');

const DROP = 'drop';

/** `[name, country, region, action, why]`. */
const FIXES = [
  // Recorded origin disputes: the region goes, the country stays with the dispute.
  ['Sarapatel', 'Portugal', 'Goa', DROP, 'Portuguese in origin and cooked in Goa; Goa is in India.'],
  ['Weisswurst', 'Poland', 'Bavaria', DROP, 'Bavaria is in Germany; the country is a recorded dispute.'],
  ['Chunga Pitha', 'Bangladesh', 'Assam', DROP, 'Assam is in India; the country is a recorded dispute.'],
  ['Sunga pitha', 'Bangladesh', 'Assam', DROP, 'Assam is in India; the country is a recorded dispute.'],
  ['Ayam pansuh', 'Malaysia', 'West Kalimantan', DROP, 'Cooked either side of the Borneo border; West Kalimantan is in Indonesia.'],
  ['Chháu-á-kóe', 'China', 'Fujian', DROP, 'A recorded dispute between China and Taiwan; not this table’s to settle.'],
  ['Chháu-á-kóe', 'Taiwan', 'Fujian', DROP, 'Fujian is a province of China; printing it under Taiwan takes a side.'],
  ['Oyster omelette', 'Taiwan', 'Fujian', DROP, 'Fujian is a province of China; printing it under Taiwan takes a side.'],

  // Shared across a border, with no single home the article names.
  ['Lyangcha', 'Bangladesh', 'Jharkhand', DROP, 'Jharkhand is in India.'],
  ['Akhni', 'India', 'Chittagong', DROP, 'Chittagong is in Bangladesh.'],
  ['Aabhoon', 'India', 'Sindh', DROP, 'Sindh is in Pakistan.'],
  ['Bhakkha', 'Nepal', 'West Bengal', DROP, 'West Bengal is in India.'],
  ['Alouettes sans tête', 'Switzerland', "Provence-Alpes-Côte d'Azur", DROP, 'Provence-Alpes-Côte d’Azur is in France.'],
  ['Baozhong', 'Taiwan', 'Fujian', DROP, 'Fujian is a province of China; printing it under Taiwan takes a side.'],
  ['Kefessia', 'Russia', 'Crimea', DROP, 'Crimea’s status is contested; the atlas prints neither claim.'],
  ['sugarcane honey', 'United States', 'Madeira', DROP, 'Madeira is in Portugal.'],
  ['Sungeo-guk', 'South Korea', 'Pyongyang', DROP, 'Pyongyang is in North Korea.'],

  // Tibet: the same call `plumbing.test.ts` made for "China › Tibet" — drop, never translate.
  ['Sha phaley', 'India', 'Tibet', DROP, 'Tibetan; Tibet is not a region of India.'],
  ['Tsampa', 'Mongolia', 'Tibet', DROP, 'Tibetan; Tibet is not a region of Mongolia.'],
  ['Laping', 'Nepal', 'Tibet', DROP, 'Tibetan; Tibet is not a region of Nepal.'],
  ['Thenthuk', 'Nepal', 'Tibet', DROP, 'Tibetan; Tibet is not a region of Nepal.'],
  ['Thukpa bhatuk', 'Nepal', 'Tibet', DROP, 'Tibetan; Tibet is not a region of Nepal.'],

  // Ingredient articles that mention somewhere the ingredient is also eaten.
  ['Adzuki bean', 'Japan', 'Yunnan', DROP, 'Yunnan is in China.'],
  ['Konnyaku', 'Japan', 'Sichuan', DROP, 'Sichuan is in China.'],
  ['Calabash', 'Japan', 'Hawaii', DROP, 'Hawaii is in the United States.'],
  ['Teriyaki', 'Japan', 'Hawaii', DROP, 'Japanese; Hawaii is where one variant is eaten.'],
  ['Whale meat', 'Japan', 'Alaska', DROP, 'Alaska is in the United States.'],
  ['Imagawayaki', 'Japan', 'Taiwan', DROP, 'Taiwan is not a region of Japan.'],
  ['Dried shredded squid', 'China', 'Hawaii', DROP, 'Hawaii is in the United States.'],
  ['Fish maw', 'China', 'Newfoundland and Labrador', DROP, 'Newfoundland and Labrador is in Canada.'],
  ['Taro', 'Lebanon', 'Hawaii', DROP, 'Hawaii is in the United States.'],

  // The article's lead names the home in plain words.
  ['Nasi kandar', 'India', 'Penang', { country: 'Malaysia' }, '"A popular northern Malaysian dish from Penang."'],
  ['Pasembur', 'India', 'Penang', { country: 'Malaysia' }, '"Pasembur is a Malaysian salad."'],
  ['Manapua', 'China', 'Hawaii', { country: 'United States' }, '"The Hawaiian adaptation of the Chinese bun."'],
  ['Taegu (Hawaiian dish)', 'South Korea', 'Hawaii', { country: 'United States' }, '"A popular side dish in Hawaii."'],
  ['Hodge-Podge (soup)', 'China', 'Scotland', { country: 'United Kingdom' }, '"Particularly associated with Scotland."'],
  ['breakfast burrito', 'United States', 'Mexico', { region: 'New Mexico' }, '"Most notably originating in New Mexican cuisine."'],
  ['Egg tart', 'United Kingdom', 'Guangzhou', { country: 'China' }, '"A kind of tart found in Cantonese cuisine, derived from the English custard tart."'],

  /*
   * A city of another country, not a state — which is why the GeoNames report, looking
   * only for first-level units, never listed them. Found on 9 October by asking instead
   * for every region whose name exists in exactly one other country, then reading what
   * the built pages print. "Kottu — Batticaloa, India" was one.
   */
  ['Kottu', 'India', 'Batticaloa', { country: 'Sri Lanka' }, '"A Sri Lankan dish … originated in the Eastern regions of Sri Lanka, particularly Batticaloa."'],
  ['Hutki shira', 'India', 'Sylhet', { country: 'Bangladesh' }, '"Popularly eaten in Bangladesh, particularly in the Sylhet Division."'],
  ['Tusha shinni', 'India', 'Sylhet', { country: 'Bangladesh' }, '"A halwa dessert from the Sylhet region of Bangladesh."'],
  ['Milkfish congee', 'Japan', 'Tainan', { country: 'Taiwan' }, '"A Taiwanese breakfast dish … originating from Tainan."'],
  ['Jar jow', 'China', 'East London', { country: 'United Kingdom' }, '"A dish from British Chinese cuisine … strongly associated with East London."'],
  ['Egg roll', 'Vietnam', 'New York City', { country: 'United States', region: null }, '"Served in American Chinese restaurants"; no city named.'],
  ['Hunan dumplings', 'China', 'Montreal', { country: 'Canada', region: 'Quebec', city: 'Montreal' }, '"A dish from Canadian Chinese cuisine … invented in Montreal."'],
  ['Thunder Bay bon bons', 'China', 'Thunder Bay', { country: 'Canada', region: 'Ontario', city: 'Thunder Bay' }, '"A dish from Canadian Chinese cuisine."'],
  ["Rumford's Soup", 'Italy', 'Munich', { country: 'Germany', region: 'Bavaria', city: 'Munich' }, '"Consumed in Munich and greater Bavaria."'],
  ['Malay sponge cake', 'China', 'China (Guangdong)', { region: 'Guangdong' }, '"Popular in Guangdong and Hong Kong"; the region read "China (Guangdong)".'],
  ['Squid as food', 'Japan', 'New York City', DROP, 'Eaten in many cuisines; New York City is in the United States.'],
  ['Shaved ice', 'Malaysia', 'Baltimore', DROP, 'A family of desserts; Baltimore is in the United States.'],
  ['Khachapuri', 'Georgia', 'New York City', DROP, 'Georgian; New York City is in the United States.'],
  ['Ful medames', 'Egypt', 'MENA', DROP, '"MENA" is not a region of Egypt.'],

  /*
   * Inside the right country, at the wrong place. The GeoNames pass matched a region
   * string to a *town* of that name and filed the record under the town's state: the
   * cultural region Jiangnan became a Jiangnan in Chongqing, 1,500 km up the Yangtze;
   * Ore-Ida's Ontario, Oregon, became Ontario, California; La Paz in Iloilo City became
   * a La Paz in Tarlac. `null` clears a level. Each is marked `placeByHand`, which that
   * pass now leaves alone — otherwise its next run would make the same match again.
   */
  ['Pear-syrup candy', 'China', 'Chongqing', { region: 'Jiangnan', province: null, city: null }, '"From eastern area of the Jiangnan region of China."'],
  ['Yanduxian', 'China', 'Chongqing', { region: 'Jiangnan', province: null, city: null }, '"A Chinese soup dish from Shanghai and Jiangsu."'],
  ['Batchoy', 'Philippines', 'Central Luzon', { region: 'Western Visayas', province: 'Iloilo', city: 'Iloilo City' }, '"Traces its roots to the Iloilo City district of La Paz."'],
  ['Mache', 'Philippines', 'Calabarzon', { city: null }, '"From the province of Laguna" — no town named, so none is printed.'],
  ['Tater Tots', 'United States', 'California', { region: null, province: null, city: null }, 'Ore-Ida’s Ontario is in Oregon; the article names no place, so none is printed.'],
];

let changed = 0;
const unmatched = new Set(FIXES.map((_, i) => i));
for (const file of ['catalogue', 'cuisines']) {
  const path = resolve(HERE, `../src/data/${file}.json`);
  const rows = JSON.parse(await readFile(path, 'utf8'));
  let here = 0;
  for (const row of rows) {
    FIXES.forEach(([name, country, region, action, why], i) => {
      if (row.name !== name || row.country !== country || row.region !== region) return;
      unmatched.delete(i);
      if (action === DROP) {
        delete row.region;
        delete row.province;
        delete row.placeConfirmed;
      } else {
        for (const [field, value] of Object.entries(action)) {
          if (value === null) delete row[field];
          else row[field] = value;
        }
        if ('province' in action || 'city' in action) {
          delete row.placeConfirmed;
          row.placeByHand = why;
        }
      }
      here++;
      console.log(`${file}: ${name} — ${country} › ${region} → ${action === DROP ? `${country}, no region` : JSON.stringify(action)}  (${why})`);
    });
  }
  changed += here;
  /* One-space indent and a closing newline: the file's own format. */
  if (here && !dry) await writeFile(path, `${JSON.stringify(rows, null, 1)}\n`, 'utf8');
}
console.log(`${changed} records changed${dry ? ' (dry run — nothing written)' : ''}.`);
if (unmatched.size) console.log(`not found, already fixed or edited since: ${[...unmatched].map((i) => FIXES[i][0]).join(', ')}`);

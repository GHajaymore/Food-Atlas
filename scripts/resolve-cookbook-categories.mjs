/**
 * The community a published recipe is filed under on Wikibooks.
 *
 *   node scripts/resolve-cookbook-categories.mjs [--limit 500]
 *
 * The Cookbook is the app's richest source of written methods and its poorest source
 * of places: 2,043 recipes still have a full method and nowhere to put it. Reading
 * the recipe titles recovered 340. This reads the categories, which carry something
 * the titles usually do not.
 *
 * Wikibooks files recipes by community as often as by country:
 *
 *   Cookbook:Abacha Mmiri        Igbo recipes
 *   Cookbook:Akki rotti          Kannada recipes
 *   Cookbook:Cholent             Jewish recipes
 *
 * An ethnic or regional cuisine is *better* provenance than a country, not worse.
 * "Igbo" names the people who cook the dish; "Nigeria" names the state they happen
 * to live in, and the app's own premise is that a tradition belongs to a community
 * rather than to a border. So the category becomes the region and its country the
 * country, which also gives these records the geographic depth the atlas measures —
 * they arrive placed below country level rather than at it.
 *
 * ## What is refused
 *
 * Wikibooks categorises by difficulty, method, cost and ingredient far more often
 * than by place: "Easy recipes", "Boiled recipes", "Recipes using garlic". An
 * earlier ingest took the first category that matched and made "Easy" the largest
 * cuisine in the atlas. Only categories on the map below are read, and everything
 * else is ignored rather than guessed at.
 *
 * Continental categories — "North American recipes", "African recipes" — are refused
 * too. They are true and they are not a country, and narrowing one to a country
 * would be inventing the very thing this record admits it does not know.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const COOKBOOK = resolve(HERE, '../src/data/cookbook.json');

const API = 'https://en.wikibooks.org/w/api.php';
const USER_AGENT = 'GlobalTaste/1.0 (food atlas place resolution; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const retryAfter = (res, attempt) => {
  const header = Number(res.headers.get('retry-after'));
  return Number.isFinite(header) && header > 0 ? header * 1000 + 250 : 2000 * attempt;
};

/**
 * Cuisine categories, to the place they name.
 *
 * `region` is filled where the category names a people or a province rather than a
 * state, because that is the more precise fact and the app has a level for it.
 */
const CUISINES = {
  // Communities and regions of South Asia
  Igbo: { country: 'Nigeria', region: 'Igbo' },
  Yoruba: { country: 'Nigeria', region: 'Yoruba' },
  Hausa: { country: 'Nigeria', region: 'Hausa' },
  Tamil: { country: 'India', region: 'Tamil Nadu' },
  Kannada: { country: 'India', region: 'Karnataka' },
  Telugu: { country: 'India', region: 'Andhra Pradesh' },
  Malayali: { country: 'India', region: 'Kerala' },
  Keralan: { country: 'India', region: 'Kerala' },
  Kerala: { country: 'India', region: 'Kerala' },
  Punjabi: { country: 'India', region: 'Punjab' },
  Bengali: { country: 'India', region: 'Bengal' },
  Gujarati: { country: 'India', region: 'Gujarat' },
  Marathi: { country: 'India', region: 'Maharashtra' },
  Rajasthani: { country: 'India', region: 'Rajasthan' },
  Kashmiri: { country: 'India', region: 'Kashmir' },
  Goan: { country: 'India', region: 'Goa' },
  Assamese: { country: 'India', region: 'Assam' },
  Odia: { country: 'India', region: 'Odisha' },
  Sindhi: { country: 'Pakistan', region: 'Sindh' },

  // Communities and regions of East and Southeast Asia
  Sichuan: { country: 'China', region: 'Sichuan' },
  Szechuan: { country: 'China', region: 'Sichuan' },
  Cantonese: { country: 'China', region: 'Guangdong' },
  Hunan: { country: 'China', region: 'Hunan' },
  Shandong: { country: 'China', region: 'Shandong' },
  Fujian: { country: 'China', region: 'Fujian' },
  Hakka: { country: 'China', region: 'Hakka' },
  Uyghur: { country: 'China', region: 'Xinjiang' },
  Tibetan: { country: 'China', region: 'Tibet' },
  Okinawan: { country: 'Japan', region: 'Okinawa' },
  Javanese: { country: 'Indonesia', region: 'Java' },
  Balinese: { country: 'Indonesia', region: 'Bali' },
  Sundanese: { country: 'Indonesia', region: 'West Java' },
  Padang: { country: 'Indonesia', region: 'West Sumatra' },

  // Communities and regions of Europe
  Sicilian: { country: 'Italy', region: 'Sicily' },
  Tuscan: { country: 'Italy', region: 'Tuscany' },
  Neapolitan: { country: 'Italy', region: 'Campania' },
  Venetian: { country: 'Italy', region: 'Veneto' },
  Sardinian: { country: 'Italy', region: 'Sardinia' },
  Lombard: { country: 'Italy', region: 'Lombardy' },
  Basque: { country: 'Spain', region: 'Basque Country' },
  Catalan: { country: 'Spain', region: 'Catalonia' },
  Andalusian: { country: 'Spain', region: 'Andalusia' },
  Galician: { country: 'Spain', region: 'Galicia' },
  Valencian: { country: 'Spain', region: 'Valencia' },
  Bavarian: { country: 'Germany', region: 'Bavaria' },
  Provencal: { country: 'France', region: 'Provence' },
  Breton: { country: 'France', region: 'Brittany' },
  Alsatian: { country: 'France', region: 'Alsace' },
  Corsican: { country: 'France', region: 'Corsica' },
  Cornish: { country: 'United Kingdom', region: 'Cornwall' },
  Yorkshire: { country: 'United Kingdom', region: 'Yorkshire' },

  // Communities and regions of the Americas
  Cajun: { country: 'United States', region: 'Louisiana' },
  Creole: { country: 'United States', region: 'Louisiana' },
  Tex: { country: 'United States', region: 'Texas' },
  Hawaiian: { country: 'United States', region: 'Hawaii' },
  Oaxacan: { country: 'Mexico', region: 'Oaxaca' },
  Yucatecan: { country: 'Mexico', region: 'Yucatán' },
  Quebecois: { country: 'Canada', region: 'Quebec' },
  Acadian: { country: 'Canada', region: 'Acadia' },

  // Communities and regions of Africa and the Middle East
  Amazigh: { country: 'Morocco', region: 'Amazigh' },
  Berber: { country: 'Morocco', region: 'Amazigh' },
  Nubian: { country: 'Sudan', region: 'Nubia' },
  Swahili: { country: 'Tanzania', region: 'Swahili Coast' },
  Zulu: { country: 'South Africa', region: 'KwaZulu-Natal' },
  Akan: { country: 'Ghana', region: 'Akan' },
  Ashanti: { country: 'Ghana', region: 'Ashanti' },
  Kurdish: { country: 'Iraq', region: 'Kurdistan' },
  Levantine: { country: 'Lebanon', region: 'Levant' },
};

/** National categories: "Nigerian recipes" gives a country and no region. */
const NATIONAL = {
  Afghan: 'Afghanistan',
  Albanian: 'Albania',
  Algerian: 'Algeria',
  American: 'United States',
  Argentine: 'Argentina',
  Armenian: 'Armenia',
  Australian: 'Australia',
  Austrian: 'Austria',
  Azerbaijani: 'Azerbaijan',
  Bangladeshi: 'Bangladesh',
  Belarusian: 'Belarus',
  Belgian: 'Belgium',
  Bolivian: 'Bolivia',
  Bosnian: 'Bosnia and Herzegovina',
  Brazilian: 'Brazil',
  British: 'United Kingdom',
  Bulgarian: 'Bulgaria',
  Burmese: 'Myanmar',
  Cambodian: 'Cambodia',
  Cameroonian: 'Cameroon',
  Canadian: 'Canada',
  Chilean: 'Chile',
  Chinese: 'China',
  Colombian: 'Colombia',
  Croatian: 'Croatia',
  Cuban: 'Cuba',
  Cypriot: 'Cyprus',
  Czech: 'Czech Republic',
  Danish: 'Denmark',
  Dutch: 'Netherlands',
  Ecuadorian: 'Ecuador',
  Egyptian: 'Egypt',
  English: 'United Kingdom',
  Eritrean: 'Eritrea',
  Estonian: 'Estonia',
  Ethiopian: 'Ethiopia',
  Filipino: 'Philippines',
  Finnish: 'Finland',
  French: 'France',
  Georgian: 'Georgia',
  German: 'Germany',
  Ghanaian: 'Ghana',
  Greek: 'Greece',
  Guatemalan: 'Guatemala',
  Haitian: 'Haiti',
  Hungarian: 'Hungary',
  Icelandic: 'Iceland',
  Indian: 'India',
  Indonesian: 'Indonesia',
  Iranian: 'Iran',
  Iraqi: 'Iraq',
  Irish: 'Ireland',
  Israeli: 'Israel',
  Italian: 'Italy',
  Jamaican: 'Jamaica',
  Japanese: 'Japan',
  Jewish: 'Israel',
  Jordanian: 'Jordan',
  Kazakh: 'Kazakhstan',
  Kenyan: 'Kenya',
  Korean: 'South Korea',
  Latvian: 'Latvia',
  Lebanese: 'Lebanon',
  Liberian: 'Liberia',
  Libyan: 'Libya',
  Lithuanian: 'Lithuania',
  Malaysian: 'Malaysia',
  Maltese: 'Malta',
  Mexican: 'Mexico',
  Moldovan: 'Moldova',
  Mongolian: 'Mongolia',
  Moroccan: 'Morocco',
  Nepalese: 'Nepal',
  Nigerian: 'Nigeria',
  Norwegian: 'Norway',
  Pakistani: 'Pakistan',
  Palestinian: 'Palestine',
  Peruvian: 'Peru',
  Polish: 'Poland',
  Portuguese: 'Portugal',
  Romanian: 'Romania',
  Russian: 'Russia',
  Rwandan: 'Rwanda',
  Saudi: 'Saudi Arabia',
  Scottish: 'United Kingdom',
  Senegalese: 'Senegal',
  Serbian: 'Serbia',
  Singaporean: 'Singapore',
  Slovak: 'Slovakia',
  Slovenian: 'Slovenia',
  Somali: 'Somalia',
  Spanish: 'Spain',
  Sudanese: 'Sudan',
  Swedish: 'Sweden',
  Swiss: 'Switzerland',
  Syrian: 'Syria',
  Taiwanese: 'Taiwan',
  Tanzanian: 'Tanzania',
  Thai: 'Thailand',
  Trinidadian: 'Trinidad and Tobago',
  Tunisian: 'Tunisia',
  Turkish: 'Turkey',
  Ugandan: 'Uganda',
  Ukrainian: 'Ukraine',
  Uruguayan: 'Uruguay',
  Uzbek: 'Uzbekistan',
  Venezuelan: 'Venezuela',
  Vietnamese: 'Vietnam',
  Welsh: 'United Kingdom',
  Yemeni: 'Yemen',
  Zambian: 'Zambia',
  Zimbabwean: 'Zimbabwe',
};

/**
 * The place a category names, or null.
 *
 * Only "X recipes" is read. "Recipes using X" and "X Difficulty recipes" name an
 * ingredient and an effort level, and both have been mistaken for cuisines before.
 */
export function placeFromCategory(category) {
  const name = category.replace(/^Category:/, '').trim();
  const match = /^([A-Za-zÀ-ÿ-]+)\s+recipes$/i.exec(name);
  if (!match) return null;

  const word = match[1];
  const capitalised = word[0].toUpperCase() + word.slice(1).toLowerCase();

  if (CUISINES[capitalised]) return CUISINES[capitalised];
  if (NATIONAL[capitalised]) return { country: NATIONAL[capitalised], region: '' };
  return null;
}

/** Categories for up to fifty pages at once. */
async function categoriesFor(titles, attempt = 1) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    titles: titles.join('|'),
    prop: 'categories',
    cllimit: 'max',
  });

  try {
    const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': USER_AGENT } });
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 5) return new Map();
      await sleep(retryAfter(res, attempt));
      return categoriesFor(titles, attempt + 1);
    }
    if (!res.ok) return new Map();

    const data = await res.json();
    const backToAsked = new Map();
    for (const n of data?.query?.normalized ?? []) backToAsked.set(n.to, n.from);

    const out = new Map();
    for (const page of data?.query?.pages ?? []) {
      const asked = backToAsked.get(page.title) ?? page.title;
      out.set(asked, (page.categories ?? []).map((c) => c.title));
    }
    return out;
  } catch {
    return new Map();
  }
}

const titleFrom = (url) => {
  try {
    return decodeURIComponent(url.split('/wiki/')[1] ?? '').replace(/_/g, ' ');
  } catch {
    return null;
  }
};

const main = async () => {
  const i = process.argv.indexOf('--limit');
  const limit = i > -1 ? Number(process.argv[i + 1]) : 0;

  const rows = JSON.parse(await readFile(COOKBOOK, 'utf8'));
  const pending = rows.filter((r) => !r.country && r.steps?.length && r.url);
  const targets = limit ? pending.slice(0, limit) : pending;
  process.stdout.write(`${targets.length} recipes with a method and no place.\n`);

  const tally = new Map();
  let placed = 0;

  for (let start = 0; start < targets.length; start += 50) {
    const batch = targets.slice(start, start + 50);
    const byTitle = new Map();
    for (const row of batch) {
      const title = titleFrom(row.url);
      if (title) byTitle.set(title, row);
    }

    const found = byTitle.size ? await categoriesFor([...byTitle.keys()]) : new Map();

    for (const [title, row] of byTitle) {
      for (const category of found.get(title) ?? []) {
        const place = placeFromCategory(category);
        if (!place) continue;
        row.country = place.country;
        if (place.region) row.region = place.region;
        row.placeFromCategory = category.replace(/^Category:/, '');
        placed += 1;
        tally.set(place.region || place.country, (tally.get(place.region || place.country) ?? 0) + 1);
        break;
      }
    }

    process.stdout.write(`  ${start + batch.length}/${targets.length} — ${placed} placed\n`);
    await writeFile(COOKBOOK, JSON.stringify(rows), 'utf8');
    await sleep(400);
  }

  const top = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
  process.stdout.write(
    `\n${placed} recipes placed from their categories.\n` +
      `${targets.length - placed} name no place anywhere and stay out.\n\n` +
      top.map(([p, n]) => `  ${String(n).padStart(4)}  ${p}`).join('\n') +
      '\n',
  );
};

main().catch((error) => {
  process.stderr.write(`\nCategory resolution failed: ${error.message}\n`);
  process.exitCode = 1;
});

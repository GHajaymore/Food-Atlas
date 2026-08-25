/**
 * Put each dish in the country its own article says it comes from.
 *
 *   node scripts/fix-origin-country.mjs [--dry] [--limit 500]
 *
 * The cuisine ingest assigned a country by which cuisine category it found an
 * article under. That is a reasonable first guess and it is wrong far more often
 * than it looks, because a dish appears in every cuisine that eats it:
 *
 *   Pierogi        filed under Georgia
 *   Baklava        filed under Iran
 *   Borscht        filed under China
 *   Biryani        filed under Indonesia
 *   French fries   filed under South Africa
 *
 * None of those is a typo. Borscht really is eaten in Harbin and there really is a
 * Kurdish baklava, so each article really does sit in that cuisine's category. The
 * category says who eats a dish; it does not say where the dish is from, and an
 * atlas that confuses the two is telling readers that pierogi are Georgian.
 *
 * `{{Infobox food}}` answers the actual question in `place_of_origin`. The enrichment
 * pass already read that field — and then wrote it only into `region`, which is why
 * French fries carried "South Africa" as its country and "France" as its region at
 * the same time. This corrects the country from the same field.
 *
 * ## What it will not do
 *
 * Where the article names more than one country of origin, nothing is changed. A
 * contested origin is a real fact about the food — baklava is claimed by Turkey,
 * Greece, Iran and the Levant — and picking a winner would be inventing a finding.
 * Those records keep the category's country and are listed at the end so the dispute
 * model can take them properly later.
 *
 * Where the field names no country the app knows, nothing is changed either. "Levant"
 * and "Ottoman Empire" are true answers that the continent map cannot place, and a
 * wrong country is worse than a coarse one.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Which source to correct. `--source catalogue` for the Wikidata import.
 *
 * This read `cuisines.json` and nothing else, because the cuisine tree was where the
 * category-derived country came from. The import has the same fault by a different route
 * and was never checked: 2,063 of its rows carry an article URL and none of them had
 * `originChecked`. That is what put Beef Wellington, Marie Rose sauce and a Hokkien rice
 * cake on a rail headed "From United States" — the cuisine copy of each dish had been
 * corrected while the import copy kept the category's country, and both were in the
 * catalogue at once.
 *
 * Both files carry `name`, `country`, `region` and `url`, which is everything this pass
 * reads, so the only thing that had to change is which one it opens.
 */
const SOURCES = {
  cuisines: resolve(HERE, '../src/data/cuisines.json'),
  catalogue: resolve(HERE, '../src/data/catalogue.json'),
};

const sourceArg = process.argv.indexOf('--source');
const SOURCE_NAME = sourceArg > -1 ? process.argv[sourceArg + 1] : 'cuisines';
const CUISINES = SOURCES[SOURCE_NAME];
if (!CUISINES) {
  process.stderr.write(`unknown --source "${SOURCE_NAME}". Use one of: ${Object.keys(SOURCES).join(', ')}\n`);
  process.exit(1);
}

const API = 'https://en.wikipedia.org/w/api.php';
const USER_AGENT = 'GlobalTaste/1.0 (food atlas origin correction; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const retryAfter = (res, attempt) => {
  const header = Number(res.headers.get('retry-after'));
  return Number.isFinite(header) && header > 0 ? header * 1000 + 250 : 2000 * attempt;
};

/**
 * Countries the app can actually place, with the aliases articles use for them.
 *
 * Built from the countries already in the data so a correction can never move a
 * record to a country the continent map does not know — that would trade a wrong
 * country for an unplaceable one.
 */
const ALIASES = {
  'United States': ['united states', 'usa', 'u.s.', 'us', 'america', 'united states of america'],
  'United Kingdom': ['united kingdom', 'uk', 'britain', 'great britain', 'england', 'scotland', 'wales'],
  /*
   * "Korean Peninsula" is what several articles say, and the atlas files Korean cuisine
   * under South Korea — that is this project's existing convention, visible in the 22
   * records already there, rather than a claim about the peninsula. Without this entry
   * bossam read as unresolvable and stayed American.
   */
  'South Korea': ['south korea', 'korea', 'republic of korea', 'korean peninsula'],
  'North Korea': ['north korea'],
  Russia: ['russia', 'russian empire', 'soviet union', 'ussr'],
  'Czech Republic': ['czech republic', 'czechia', 'bohemia'],
  Netherlands: ['netherlands', 'holland'],
  Turkey: ['turkey', 'türkiye'],
  Iran: ['iran', 'persia'],
  India: ['india', 'indian subcontinent'],
  China: ['china', "people's republic of china"],
  Myanmar: ['myanmar', 'burma'],
  Vietnam: ['vietnam', 'viet nam'],
  Mexico: ['mexico'],
  Ukraine: ['ukraine'],
  Poland: ['poland'],
  Belgium: ['belgium'],
  France: ['france'],
  Italy: ['italy'],
  Spain: ['spain'],
  Germany: ['germany'],
  Greece: ['greece'],
  Japan: ['japan'],
  Thailand: ['thailand', 'siam'],
  Indonesia: ['indonesia'],
  Philippines: ['philippines'],
  Malaysia: ['malaysia'],
  Portugal: ['portugal'],
  Peru: ['peru'],
  Brazil: ['brazil'],
  Argentina: ['argentina'],
  Lebanon: ['lebanon'],
  Israel: ['israel'],
  Egypt: ['egypt'],
  Morocco: ['morocco'],
  Nigeria: ['nigeria'],
  Ethiopia: ['ethiopia'],
  Pakistan: ['pakistan'],
  Bangladesh: ['bangladesh'],
  'Sri Lanka': ['sri lanka', 'ceylon'],
  Nepal: ['nepal'],
  Georgia: ['georgia'],
  Armenia: ['armenia'],
  Austria: ['austria'],
  Hungary: ['hungary'],
  Switzerland: ['switzerland'],
  Sweden: ['sweden'],
  Denmark: ['denmark'],
  Norway: ['norway'],
  Finland: ['finland'],
  Ireland: ['ireland'],
  Romania: ['romania'],
  Bulgaria: ['bulgaria'],
  Serbia: ['serbia'],
  Croatia: ['croatia'],
  Iraq: ['iraq', 'mesopotamia'],
  Syria: ['syria'],
  Afghanistan: ['afghanistan'],
  Uzbekistan: ['uzbekistan'],
  Mongolia: ['mongolia'],
  Taiwan: ['taiwan'],
  'South Africa': ['south africa'],
  Australia: ['australia'],
  'New Zealand': ['new zealand'],
  Canada: ['canada'],
  Cuba: ['cuba'],
  Jamaica: ['jamaica'],
  Colombia: ['colombia'],
  Venezuela: ['venezuela'],
  Chile: ['chile'],
  Tunisia: ['tunisia'],
  Algeria: ['algeria'],
  Kenya: ['kenya'],
  Ghana: ['ghana'],
  Senegal: ['senegal'],
  Cambodia: ['cambodia'],
  Laos: ['laos'],
  Singapore: ['singapore'],
  Malta: ['malta'],
  Cyprus: ['cyprus'],
  Iceland: ['iceland'],
};

const LOOKUP = new Map();
for (const [country, names] of Object.entries(ALIASES)) {
  for (const n of names) LOOKUP.set(n, country);
}

/** Every country named in a place-of-origin field, de-duplicated, in order. */
function countriesIn(raw) {
  const found = [];
  for (const part of (raw ?? '').split(/[,;/()[\]|]|\band\b|\bor\b|<br\s*\/?>/i)) {
    const key = part
      .replace(/\[\[|\]\]/g, '')
      .replace(/[^A-Za-zÀ-ÿ' .]/g, ' ')
      .trim()
      .toLowerCase();
    const hit = LOOKUP.get(key);
    if (hit && !found.includes(hit)) found.push(hit);
  }
  return found;
}

/** The raw wikitext of up to fifty articles. */
async function wikitext(titles, attempt = 1) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    titles: titles.join('|'),
    prop: 'revisions',
    rvprop: 'content',
    rvslots: 'main',
    redirects: '1',
  });

  try {
    const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': USER_AGENT } });
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 5) return new Map();
      await sleep(retryAfter(res, attempt));
      return wikitext(titles, attempt + 1);
    }
    if (!res.ok) return new Map();

    const data = await res.json();
    const backToAsked = new Map();
    for (const r of data?.query?.redirects ?? []) backToAsked.set(r.to, r.from);
    for (const n of data?.query?.normalized ?? []) backToAsked.set(n.to, n.from);

    const out = new Map();
    for (const page of data?.query?.pages ?? []) {
      const text = page?.revisions?.[0]?.slots?.main?.content;
      if (text) out.set(backToAsked.get(page.title) ?? page.title, text);
    }
    return out;
  } catch {
    return new Map();
  }
}

/**
 * What an infobox says about where a dish is from.
 *
 * Both fields, because `{{Infobox food}}` uses them interchangeably and `country` is
 * the more common of the two — Borscht states `country = Ukraine` and Pierogi
 * `country = Poland`, while neither fills in `place_of_origin`. Reading only
 * `place_of_origin` found one correction in three hundred records and left borscht
 * filed under China.
 */
/**
 * Read an infobox field, including the templated kind that runs over several lines.
 *
 * This took everything up to the first newline or pipe, which is right for
 * `| country = Japan` and useless for the form a well-maintained food article uses:
 *
 *     | country = {{Flatlist|
 *       * [[North Korea]]
 *       * [[South Korea]]
 *       }}
 *
 * The old expression captured the literal text "{{Flatlist" and matched no country at
 * all — so seventeen unmistakably Korean dishes (bap, bossam, namul, sikhye) sat under
 * the United States while their own articles named Korea one line further down. The pass
 * reported them checked, and it had checked them: it looked in the right field and
 * honestly found nothing it could read.
 *
 * A templated value is now read to the end of its template. Everything else is unchanged,
 * and `countriesIn` still decides what any of it means.
 */
function fieldValue(source, name) {
  const at = new RegExp(`\\|\\s*${name}\\s*=`, 'i').exec(source);
  if (!at) return '';
  const rest = source.slice(at.index + at[0].length);
  const firstLine = rest.split('\n', 1)[0];
  if (!firstLine.includes('{{')) return firstLine.split('|')[0];

  // Templated: read to the closing braces, or to the next field at this level.
  const end = rest.search(/\n\s*\}\}|\n\s*\|\s*\w+\s*=/);
  return end === -1 ? rest.slice(0, 400) : rest.slice(0, end);
}

function originFields(text) {
  const source = text ?? '';
  return `${fieldValue(source, 'place_of_origin')} , ${fieldValue(source, 'country')}`;
}

const titleFrom = (url) => {
  try {
    return decodeURIComponent((url ?? '').split('/wiki/')[1] ?? '').replace(/_/g, ' ');
  } catch {
    return null;
  }
};

const main = async () => {
  const dry = process.argv.includes('--dry');
  const i = process.argv.indexOf('--limit');
  const limit = i > -1 ? Number(process.argv[i + 1]) : 0;

  /* --recheck re-reads rows already marked, for when the reader itself gets better. */
  const recheck = process.argv.includes('--recheck');
  const rows = JSON.parse(await readFile(CUISINES, 'utf8'));
  const pending = rows.filter((r) => r.url && (recheck || !r.originChecked));
  const targets = limit ? pending.slice(0, limit) : pending;
  process.stdout.write(`${targets.length} records to check.\n`);

  const corrections = [];
  const contested = [];
  let checked = 0;

  for (let start = 0; start < targets.length; start += 50) {
    const batch = targets.slice(start, start + 50);
    const byTitle = new Map();
    for (const row of batch) {
      const title = titleFrom(row.url);
      if (title) byTitle.set(title, row);
    }

    const texts = byTitle.size ? await wikitext([...byTitle.keys()]) : new Map();

    for (const [title, row] of byTitle) {
      row.originChecked = true;
      checked += 1;

      const found = countriesIn(originFields(texts.get(title)));
      if (!found.length) continue;

      if (found.length > 1) {
        // A contested origin is a finding, not a defect. Recorded, not resolved —
        // choosing between Italy and France for the macaroon is not ours to do.
        if (!dry) row.originClaims = found;

        // But a record filed under a country that is not even one of the claims is
        // not contested, it is misplaced: the macaroon was in India and the
        // California roll in Japan. Those move to the first claim, and every claim
        // travels with them so the dispute stays visible.
        if (!found.includes(row.country)) {
          corrections.push(
            `${row.name.slice(0, 30).padEnd(32)} ${String(row.country).padEnd(16)} -> ${found[0]}  (contested: ${found.join('/')})`,
          );
          if (!dry) row.country = found[0];
        } else {
          contested.push(`${row.name}: ${found.join(' / ')} (filed under ${row.country})`);
        }
        continue;
      }

      if (found[0] !== row.country) {
        corrections.push(`${row.name.slice(0, 30).padEnd(32)} ${String(row.country).padEnd(16)} -> ${found[0]}`);
        if (!dry) {
          // The category's country becomes the region only if it said something the
          // new country does not — otherwise it is noise, not depth.
          row.country = found[0];
          if (row.region === found[0]) row.region = '';
        }
      }
    }

    if (!dry) await writeFile(CUISINES, JSON.stringify(rows), 'utf8');
    process.stdout.write(`  ${start + batch.length}/${targets.length} — ${corrections.length} corrections\n`);
    await sleep(400);
  }

  if (!dry) await writeFile(CUISINES, JSON.stringify(rows), 'utf8');

  process.stdout.write(
    `\nchecked ${checked}. ${corrections.length} records moved to the country their article names.\n\n` +
      corrections.slice(0, 40).join('\n') +
      `\n\n${contested.length} have a contested origin and were left where they are:\n` +
      contested.slice(0, 15).join('\n') +
      '\n',
  );
};

main().catch((error) => {
  process.stderr.write(`\nOrigin correction failed: ${error.message}\n`);
  process.exitCode = 1;
});

/**
 * How many records assert a country their own article never supports?
 *
 *   node scripts/audit-origin-support.mjs [--source cuisines|catalogue] [--limit N]
 *
 * Read-only. Writes nothing, corrects nothing, and exists to put a number on a thing that
 * was previously a shrug.
 *
 * ## Why this is not the same question `fix-origin-country.mjs` asks
 *
 * That pass asks "does the article name a country I can use?" and, when the answer is no,
 * leaves the record alone — which is right, because a wrong country is worse than a coarse
 * one. But it then marks the row `originChecked: true`, and from that moment the atlas
 * cannot tell two very different records apart:
 *
 *   * one whose country the article confirms, and
 *   * one whose country came from a **cuisine category** and was never confirmable.
 *
 * A category says who *eats* a dish. Ajay found the case that makes this concrete: Jalebi
 * filed under **Egypt**, with a photograph taken in Bangalore. Its infobox has an empty
 * `place_of_origin`, a `country` of "West Asia" — not a country — and a `region` of "West
 * Asia, Indian subcontinent, Africa". There is no single country to correct it to. Egypt
 * is there because *zalabia* sits in the Egyptian cuisine category, and nothing has ever
 * said otherwise.
 *
 * So this asks the third question: of the rows already marked checked, how many carry a
 * country the article's own origin fields do not mention at all? That set is where an
 * atlas built on evidence is asserting something it cannot show.
 *
 * ## What a "supported" country means here
 *
 * The country appears in `place_of_origin`, `country` or `region` of the article's own
 * infobox, read with the same field reader and the same country lookup the correction
 * pass uses — deliberately, so the two agree about what a country is and this cannot
 * report a disagreement that is really a parsing difference.
 *
 * Three outcomes, and the middle one is the finding:
 *
 *   supported   the article names this country
 *   unsupported the article names one or more countries and this is not among them
 *   unplaceable the article names no country at all — nothing to check against
 */

import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const API = 'https://en.wikipedia.org/w/api.php';
const USER_AGENT = 'WikiFoodia/1.0 (https://wikifoodia.ajailabs.app; audit) node-fetch';

const SOURCES = {
  cuisines: resolve(HERE, '../src/data/cuisines.json'),
  catalogue: resolve(HERE, '../src/data/catalogue.json'),
};

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : fallback;
};

const SOURCE_NAME = arg('--source', 'cuisines');
const FILE = SOURCES[SOURCE_NAME];
if (!FILE) {
  process.stderr.write(`unknown --source "${SOURCE_NAME}". Use one of: ${Object.keys(SOURCES).join(', ')}\n`);
  process.exit(1);
}
const LIMIT = Number(arg('--limit', '0'));

/*
 * Every country the app knows, read out of `countryCodes.ts` as text.
 *
 * Parsed rather than imported: that module is TypeScript and imports its way into the
 * rest of the domain, which Node will not load from a script. The shape it is parsed
 * from — `"Afghanistan": "AF",` — is generated, so this reads a table rather than
 * guessing at source code.
 *
 * Deliberately wider than the hand-written alias list in `fix-origin-country.mjs`. That
 * list decides what to *write*, where being conservative is right. This one decides only
 * whether the article named a country at all, and a narrow list here would report honest
 * records as unplaceable.
 */
const LOOKUP = new Map();
{
  const table = readFileSync(resolve(HERE, '../src/domain/countryCodes.ts'), 'utf8');
  for (const [, name] of table.matchAll(/"([^"]+)":\s*"[A-Z]{2}"/g)) LOOKUP.set(name.toLowerCase(), name);
  /* Names the atlas uses that no alpha-2 table carries. Without them an article saying
     "England" reads as naming no country, which is a different claim. */
  for (const extra of ['England', 'Scotland', 'Wales', 'Tibet', 'Zanzibar', 'Palestine']) {
    LOOKUP.set(extra.toLowerCase(), extra);
  }
}

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

function fieldValue(source, name) {
  const at = new RegExp(`\\|\\s*${name}\\s*=`, 'i').exec(source);
  if (!at) return '';
  const rest = source.slice(at.index + at[0].length);
  const firstLine = rest.split('\n', 1)[0];
  if (!firstLine.includes('{{')) return firstLine.split('|')[0];
  const end = rest.search(/\n\s*\}\}|\n\s*\|\s*\w+\s*=/);
  return end === -1 ? rest.slice(0, 400) : rest.slice(0, end);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
      await sleep(500 * attempt);
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

const titleFrom = (url) => {
  try {
    return decodeURIComponent((url ?? '').split('/wiki/')[1] ?? '').replace(/_/g, ' ');
  } catch {
    return null;
  }
};

const main = async () => {
  const rows = JSON.parse(await readFile(FILE, 'utf8'));
  const withUrl = rows.filter((r) => r.url && titleFrom(r.url));
  const targets = LIMIT ? withUrl.slice(0, LIMIT) : withUrl;

  process.stderr.write(`${SOURCE_NAME}: reading ${targets.length} articles\n`);

  const tally = { supported: 0, unsupported: 0, unplaceable: 0, unread: 0 };
  const unsupported = [];
  const unplaceable = [];

  for (let i = 0; i < targets.length; i += 50) {
    const batch = targets.slice(i, i + 50);
    const byTitle = await wikitext(batch.map((r) => titleFrom(r.url)));

    for (const row of batch) {
      const text = byTitle.get(titleFrom(row.url));
      if (!text) {
        tally.unread += 1;
        continue;
      }
      /*
       * `place_of_origin` and `country`, and deliberately not `region`.
       *
       * The first version of this read `region` too and reported a larger number, which
       * was wrong in the exact way this whole area of the code exists to guard against:
       * region is where a dish is *eaten*, and treating it as an origin claim is the same
       * mistake as reading a cuisine category as an origin — the mistake that filed
       * pierogi under Georgia and Jalebi under Egypt. An audit that repeats the bug it is
       * measuring cannot be trusted about its size.
       *
       * These are the two fields `fix-origin-country.mjs` corrects from, so "supported"
       * here means supported by the same evidence the corrector would act on.
       */
      const named = countriesIn(`${fieldValue(text, 'place_of_origin')} , ${fieldValue(text, 'country')}`);
      if (!named.length) {
        tally.unplaceable += 1;
        unplaceable.push({ name: row.name, country: row.country });
      } else if (named.includes(row.country)) {
        tally.supported += 1;
      } else {
        tally.unsupported += 1;
        unsupported.push({ name: row.name, filed: row.country, article: named.slice(0, 4) });
      }
    }
    process.stderr.write(`  ${Math.min(i + 50, targets.length)}/${targets.length}\r`);
  }

  const total = targets.length;
  const pct = (n) => `${((n / total) * 100).toFixed(1)}%`;
  process.stderr.write('\n');
  console.log(`\n${SOURCE_NAME}: ${total} records with an article\n`);
  console.log(`  supported    ${String(tally.supported).padStart(5)}  ${pct(tally.supported)}`);
  console.log(`  unsupported  ${String(tally.unsupported).padStart(5)}  ${pct(tally.unsupported)}   <- asserts a country the article does not name`);
  console.log(`  unplaceable  ${String(tally.unplaceable).padStart(5)}  ${pct(tally.unplaceable)}   <- article names no country at all`);
  console.log(`  unread       ${String(tally.unread).padStart(5)}  ${pct(tally.unread)}`);

  console.log('\nFirst 40 unsupported:');
  for (const u of unsupported.slice(0, 40)) {
    console.log(`  ${u.name} — filed ${u.filed}, article says ${u.article.join(' / ') || '(none)'}`);
  }
  console.log('\nFirst 20 unplaceable:');
  for (const u of unplaceable.slice(0, 20)) console.log(`  ${u.name} — filed ${u.country}`);
};

main();

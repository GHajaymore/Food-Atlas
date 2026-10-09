/**
 * Put back the words the cookbook imports lost inside templates — in all five
 * non-English books, ingredients and method alike.
 *
 *   node scripts/repair-wikibooks-templates.mjs [--dry] [--cache revs.json]
 *
 * ## What was wrong
 *
 * Every Wikibooks cookbook writes some words through templates, and the imports deleted
 * the templates they did not know, words and all. `repair-fr-cookbook.mjs` mended the
 * French ingredient lists; a census of the five books on 9 October found the same fault
 * everywhere else, and in the methods too:
 *
 *   - Portuguese links its ingredients with `{{w|açúcar}}` — 284 times on 20 pages.
 *     Abacaxi grelhado read "1, cortado em de 2 ;" and "1 lata de ;".
 *   - Spanish writes oven settings and times as `{{temperatura|170}}`, `{{tiempo|45}}`,
 *     `{{min|5}}`: Bizcocho integral de yogur read "El horno lo tendremos precalentado
 *     a ." and "Ponemos la bandeja en el horno durante .", the two numbers a cook cannot
 *     guess. It also names techniques (`{{coc|hervir}}`), pressure-cooker settings
 *     (`{{presión|1}}`, `{{válvula|abierta}}`) and measures (`{{vaso|1}}`).
 *   - French methods name utensils and ingredients the way its lists do: "Dans une
 *     {{ustensile|cocotte}} à fond épais".
 *
 * ## Why Wikibooks renders them, not this script
 *
 * Several of these are lookup tables, not text: `{{menú|vapor}}` renders "Menú Cocina a
 * vapor", `{{presión|1}}` "1 (22 kPa)", `{{vaso|1}}` "1 vaso medidor (125 ml)". Guessing a
 * rule per template would be wrong in ways nobody would notice. So every distinct
 * template call that appears in a page's text is sent to the wiki's own `expandtemplates`
 * — the exact output a reader of that page sees — with the template's icon images,
 * category links and maintenance brackets removed. A call whose expansion is a link to a
 * template that does not exist (`{{azúcar}}` → ":Plantilla:Azúcar") is left alone.
 *
 * ## Then the import's own readers
 *
 * The expanded text is substituted into the page and the ingredients and method are read
 * again by the extractors `ingest-cookbooks-multilingual.mjs` exports — imported, not
 * copied, so this cannot drift from what a fresh import would produce.
 *
 * ## When it refuses
 *
 * Line by line, never list by list (see `mend` for why). A stored line is replaced only
 * by a freshly read line that keeps every word and number of it, in order, adds at most
 * a dozen, and holds no markup or link. No line is added, dropped or moved, and a line
 * with no such partner stays exactly as it was.
 *
 * Measured on 9 October: 553 lines on 265 recipes — 243 Spanish, 167 French (almost all
 * in methods; the lists were mended before), 138 Portuguese, 4 German, 1 Italian.
 *
 * Fifty revisions a request and a hundred template calls a request, one request a second,
 * a User-Agent that says who is asking. Read-only against Wikibooks.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COOKBOOKS, prosePreparation, section, templateField } from './ingest-cookbooks-multilingual.mjs';
import { stripImageLinks } from './lib/mediawiki.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(HERE, '../src/data/cookbook.json');
const AGENT = 'WikiFoodia-data-repair/1.0 (https://wikifoodia.ajailabs.app; contact@ajailabs.app)';
const LANGS = ['fr', 'pt', 'es', 'it', 'de'];
const dry = process.argv.includes('--dry');
const cacheAt = process.argv.indexOf('--cache');
const cachePath = cacheAt > -1 ? process.argv[cacheAt + 1] : null;

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

/** A body that is not JSON is a rate limit to wait out, not an empty answer to believe. */
async function call(lang, params, post = false) {
  const url = `https://${lang}.wikibooks.org/w/api.php`;
  for (let attempt = 1; ; attempt++) {
    const response = post
      ? await fetch(url, { method: 'POST', body: new URLSearchParams(params), headers: { 'User-Agent': AGENT } })
      : await fetch(`${url}?${new URLSearchParams(params)}`, { headers: { 'User-Agent': AGENT } });
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      await sleep(1000);
      return data;
    } catch {
      if (attempt > 4) throw new Error(`${lang}: ${response.status} ${text.slice(0, 80)} — nothing written.`);
      await sleep(5000 * attempt);
    }
  }
}

const rows = JSON.parse(await readFile(SOURCE, 'utf8'));
const langOf = (row) => /^(fr|pt|es|it|de):/.exec(row.title ?? '')?.[1];
const work = rows.map((row, index) => ({ row, index, lang: langOf(row) })).filter((w) => w.lang && w.row.rev);

/* 1. The exact revisions each row was read from. */
const pages = cachePath ? JSON.parse(await readFile(cachePath, 'utf8').catch(() => '{}')) : {};
for (const lang of LANGS) {
  pages[lang] ??= {};
  const missing = work.filter((w) => w.lang === lang && !(w.row.rev in pages[lang])).map((w) => w.row.rev);
  for (let i = 0; i < missing.length; i += 50) {
    const data = await call(lang, {
      action: 'query', prop: 'revisions', revids: missing.slice(i, i + 50).join('|'),
      rvprop: 'ids|content', rvslots: 'main', format: 'json', formatversion: '2',
    });
    for (const page of data.query?.pages ?? []) {
      for (const v of page.revisions ?? []) pages[lang][v.revid] = v.slots?.main?.content ?? '';
    }
  }
}
if (cachePath) await writeFile(cachePath, JSON.stringify(pages));

/*
 * 2. Every distinct innermost template call on a line of text.
 *
 * Not headings, not lines that open or continue a template's own parameters, and not
 * calls whose name has a slash — `{{Artes culinarias/Datos de receta` is the frame that
 * holds the Spanish recipe, not words in it.
 */
const CALL = /\{\{\s*([^{}|/]+?)\s*(?:\|[^{}]*)?\}\}/g;
const TEXT_LINE = /^\s*(?:[*#:]+\s*)?[^=|{\s]/;
const callsIn = (wikitext) => {
  const found = new Set();
  for (const line of wikitext.split('\n')) {
    if (!TEXT_LINE.test(line) && !/^\s*[*#]/.test(line)) continue;
    for (const m of line.matchAll(CALL)) found.add(m[0]);
  }
  return found;
};

const ENTITIES = {
  nbsp: ' ', thinsp: ' ', ensp: ' ', emsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>',
  ndash: '–', mdash: '—', deg: '°', frac12: '½', frac14: '¼', frac34: '¾',
};
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z0-9]+);/gi, (whole, name) => ENTITIES[name.toLowerCase()] ?? whole);

/** What a reader sees of one expanded call, or null when it is not words. */
const CATEGORY = /\[\[\s*(?:Category|Categoria|Categoría|Kategorie|Catégorie)\s*:[^\]]*\]\]/gi;
function shown(expanded) {
  if (/\[\[\s*:/.test(expanded)) return null; // a red link to a template that does not exist
  const text = decode(
    stripImageLinks(expanded)
      .replace(CATEGORY, '')
      .replace(/&#91;[^&]*&#93;/g, '') // {{chiarire}}'s "[temperatura?]" maintenance note
      .replace(/<ref[^>]*>[\s\S]*?<\/ref>|<ref[^>]*\/>/g, '')
      .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/'{2,}/g, ''),
  )
    .replace(/\s+/g, ' ')
    .trim();
  return /[{}|[\]]/.test(text) ? null : text;
}

const rendered = {};
for (const lang of LANGS) {
  const calls = new Set();
  for (const w of work.filter((x) => x.lang === lang)) {
    for (const c of callsIn(pages[lang][w.row.rev] ?? '')) calls.add(c);
  }
  const list = [...calls];
  rendered[lang] = new Map();
  /*
   * Expanded twice, under two different page titles, and kept only where both agree.
   * {{SUBPAGENAME}} and its relatives print the title of the page they sit on — the
   * first run printed the stand-in title into a method, "Ciambotta lucana X". What
   * depends on the page cannot be rendered away from it, so it is left as it was.
   */
  const expand = async (batch, title) => {
    const text = batch.map((c, k) => `@@${k}@@${c}`).join('\n');
    const data = await call(
      lang,
      { action: 'expandtemplates', text, prop: 'wikitext', title, format: 'json', formatversion: '2' },
      true,
    );
    const parts = String(data.expandtemplates?.wikitext ?? '').split(/@@(\d+)@@/);
    const out = new Map();
    for (let p = 1; p < parts.length; p += 2) out.set(batch[Number(parts[p])], shown(parts[p + 1]));
    return out;
  };
  for (let i = 0; i < list.length; i += 100) {
    const batch = list.slice(i, i + 100);
    const one = await expand(batch, 'Alpha');
    const two = await expand(batch, 'Beta/Gamma');
    for (const c of batch) {
      const value = one.get(c);
      if (value != null && value === two.get(c)) rendered[lang].set(c, value);
    }
  }
  console.log(`${lang}: ${list.length} distinct template calls, ${rendered[lang].size} render as words`);
}

/* 3. Substitute, read again with the import's own readers, and judge each field. */
const ingredientsFrom = (lang, wikitext) => {
  const book = COOKBOOKS[lang];
  const found = book.template ? templateField(wikitext, book.ingredients) : section(wikitext, book.ingredients);
  return found.slice(0, 20);
};
const stepsFrom = (lang, wikitext) => {
  const book = COOKBOOKS[lang];
  if (book.template) return templateField(wikitext, book.steps);
  const listed = section(wikitext, book.steps);
  return listed.length ? listed : prosePreparation(wikitext, book.steps);
};

const words = (lines) => lines.join(' ').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
/**
 * Every word the old list kept is in the new one, in order.
 *
 * Single letters are not held to it — they are the fragments a deleted template left,
 * "2 ou 3 s rouges" from "2 ou 3 {{i|piment}}s rouges" — but single digits are. Letting
 * them go too matched the stored "3 tomates" to "1 cuiller à soupe de tomates concentre",
 * a different ingredient sharing one word with it.
 */
function onlyAdds(oldLines, newLines) {
  const have = words(newLines);
  let at = 0;
  for (const word of words(oldLines).filter((w) => w.length > 1 || /\d/.test(w))) {
    while (at < have.length && have[at] !== word) at++;
    if (at === have.length) return false;
    at++;
  }
  return true;
}

/*
 * Mend the stored lines in place, one at a time; never re-take the whole list.
 *
 * The first version took the freshly read list whenever it only added words, and the
 * fresh list is not what is stored: later passes removed reference URLs and link
 * syntax from these methods, and the import's reader brings both back — Chamoyadas
 * regained three lines of "[http://… Video de como preparar una chamoyada.]", and
 * Ensaladilla's steps were reshuffled by four lines the stored copy had never had.
 * Appended lines passed the word check, because adding is all it forbids.
 *
 * So each stored line keeps its place and may only be swapped for the fresh line that
 * holds every word of it, in order, plus the words that were lost — at most a dozen of
 * them, so a short stored line cannot be matched to some longer sentence that happens to
 * contain its words. No line is added, dropped or moved. A stored line with no such
 * partner stays exactly as it is.
 */
const plainText = (line) => !/[{}|[\]]|https?:\/\//.test(line);
/*
 * Two seams the substitution itself makes. Spanish times render with their own full
 * stop, "20 min.", which met the sentence's and printed "durante 20 min.. De esta
 * forma". And the Spanish temperature templates print the ordinal indicator, "170ºC",
 * where a degree sign is meant — the one character this changes from what the page
 * shows, because a screen reader says "170 ordinal C".
 */
const tidy = (line) => line.replace(/(?<!\.)\.\.(?!\.)/g, '.').replace(/(\d)\s*º\s*([CF])\b/g, '$1 °$2');

function mend(before, fresh) {
  let at = 0;
  let changed = false;
  const after = before.map((line) => {
    for (let j = at; j < fresh.length; j++) {
      const candidate = tidy(fresh[j]);
      const gained = words([candidate]).length - words([line]).length;
      if (candidate === line) {
        at = j + 1;
        return line;
      }
      if (gained > 0 && gained <= 12 && plainText(candidate) && onlyAdds([line], [candidate])) {
        at = j + 1;
        changed = true;
        return candidate;
      }
    }
    return line;
  });
  return changed ? after : null;
}

const outcome = {};
const examples = [];
for (const { row, index, lang } of work) {
  const source = pages[lang][row.rev];
  const tally = (outcome[lang] ??= { rows: 0, ingredients: 0, steps: 0, lines: 0 });
  if (!source) continue;
  const table = rendered[lang];
  let text = source;
  for (let pass = 0; pass < 4; pass++) {
    const next = text.replace(CALL, (whole) => (table.has(whole) ? table.get(whole) : whole));
    if (next === text) break;
    text = next;
  }
  if (text === source) continue;

  const next = { ...row };
  for (const [field, read] of [['ingredients', ingredientsFrom], ['steps', stepsFrom]]) {
    const before = row[field] ?? [];
    const fresh = read(lang, text);
    const after = mend(before, fresh);
    if (!after) continue;
    next[field] = after;
    tally[field]++;
    tally.lines += after.filter((line, k) => line !== before[k]).length;
    if (process.argv.includes('--explain')) {
      console.log(`${row.name} (${lang}, ${field})`);
      after.forEach((line, k) => {
        if (line !== before[k]) console.log(`    - ${before[k]}\n    + ${line}`);
      });
    }
    if (examples.length < 8) {
      const k = after.findIndex((line, i) => line !== before[i]);
      examples.push(`${row.name} (${lang}, ${field})\n    was: ${before[k]}\n    now: ${after[k]}`);
    }
  }
  if (next.ingredients !== row.ingredients || next.steps !== row.steps) {
    rows[index] = next;
    tally.rows++;
  }
}

console.log(JSON.stringify(outcome));
console.log(examples.join('\n'));
if (!dry) {
  /* One-space indent and a closing newline: the file's own format, so the diff is the
     mended lines and nothing else. */
  await writeFile(SOURCE, `${JSON.stringify(rows, null, 1)}\n`, 'utf8');
  console.log(`written: ${SOURCE}`);
}

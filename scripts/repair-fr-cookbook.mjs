/**
 * Put back the ingredient names the French Wikibooks import lost.
 *
 *   node scripts/repair-fr-cookbook.mjs [--dry]
 *
 * ## What was wrong
 *
 * French Wikibooks writes an ingredient through a template — `400 g de {{i|poireau|poireaux}}`
 * renders "400 g de poireaux" — and the import that built `src/data/cookbook.json` deleted
 * every template, so it kept the text around the ingredient and lost the ingredient. Gratin
 * de poireaux read "400 g de", "100 g d'", "sel,"; Paella végétalienne read "250 g de de
 * Paris" and "2 rouges". Measured over the built catalogue on 8 October: 1,024 ingredient
 * lines on 436 records, nearly half of the French recipes that carry a list. Where a line
 * was nothing but a template — "1 {{i|'=oui|oignon}}" — it vanished entirely.
 *
 * ## What this does
 *
 * Every French row records the revision it was read from (`rev`). This asks Wikibooks for
 * exactly those revisions — so the text cannot have moved since — renders the templates the
 * way the page does, and rebuilds the ingredient lines from the page's own "Ingrédients"
 * section. Nothing is paraphrased, translated or tidied beyond what the page itself shows.
 *
 * ## When it refuses
 *
 * A row is only rewritten if every word its old lines kept is still present in the new
 * ones, in order — the repair may *add* the missing names, never change what was there. A
 * row that fails that, or whose revision or section cannot be found, is left exactly as it
 * was and listed, so a person can look.
 *
 * ## Being a polite client
 *
 * Fifty revisions a request, one request a second, a User-Agent that says who is asking.
 * About twenty-three requests for the whole French cookbook. Read-only.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(HERE, '../src/data/cookbook.json');
const API = 'https://fr.wikibooks.org/w/api.php';
const AGENT = 'WikiFoodia-data-repair/1.0 (https://wikifoodia.ajailabs.app; contact@ajailabs.app)';
const dry = process.argv.includes('--dry');

/** The positional arguments of a template, without its named ones (`'=oui`, `lien=non`). */
const positional = (args) => args.filter((arg) => !/^\s*[^=|]+=/.test(arg)).map((arg) => arg.trim());

/**
 * Render one template the way French Wikibooks does in an ingredient list.
 *
 * `{{i|page|shown}}` shows its second positional argument when there is one — the plural
 * or inflected form — and otherwise its first. `{{Ustensile}}` follows the same rule.
 * `{{Unité|250|g}}` is a quantity and its unit. Layout templates render nothing.
 * Anything unknown renders its positional text joined by spaces, and is counted, so a
 * template this has never met is visible in the report rather than silently mangled.
 */
const unknown = new Map();
function renderTemplate(name, args, subpage) {
  const key = name.trim().toLowerCase();
  const pos = positional(args);
  /* Each of these was expanded by Wikibooks' own API to see what it shows, rather than
     guessed: `i'` is the elided form of `i`, `ingrédient` its long name, `w` a Wikipedia
     link — all show their second argument when they have one. */
  if (['i', "i'", 'ingrédient', 'ingredient', 'ustensile', 'w'].includes(key)) return pos[1] || pos[0] || '';
  if (key === 'unité' || key === 'unite') return pos.filter(Boolean).join(' ');
  /* "1 cuillère à soupe" with no argument, as the page shows it. */
  if (key === 'càs' || key === 'càc') {
    const n = pos[0] || '1';
    return `${n} ${n === '1' ? 'cuillère' : 'cuillères'} à ${key === 'càs' ? 'soupe' : 'café'}`;
  }
  /* Colour and technique templates show their first argument. */
  if (key === 'rouge' || key === 'techniquecuisine') return pos[0] || '';
  /* A box warning that the dish may contain gluten, and layout: not ingredients. */
  if (key === 'gluten' || key === 'clr' || key === 'clear') return '';
  if (key === 'subpagename') return subpage;
  unknown.set(name.trim(), (unknown.get(name.trim()) ?? 0) + 1);
  return pos.join(' ');
}

/** Templates first (innermost out), then links, then the bold and italic marks. */
function renderWikitext(text, subpage) {
  let out = text.replace(/<!--[\s\S]*?-->/g, '').replace(/<ref[^>]*>[\s\S]*?<\/ref>|<ref[^>]*\/>/g, '');
  for (let guard = 0; guard < 10 && /\{\{[^{}]*\}\}/.test(out); guard++) {
    out = out.replace(/\{\{([^{}|]+)((?:\|[^{}]*)?)\}\}/g, (_, name, rest) =>
      renderTemplate(name, rest ? rest.slice(1).split('|') : [], subpage),
    );
  }
  out = out
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1')
    .replace(/'{2,}/g, '')
    .replace(/<[^>]+>/g, '');
  /*
   * The one piece of typography this changes: no space before a comma or full stop, and
   * no comma left dangling at the end of a line. Editors typed "2 échalotes , 2 gousses"
   * and "Huile d'olive ,", and a space before a comma is the exact shape the catalogue's
   * own invariant reads as a value dropped out of a sentence — five of them appeared the
   * first time this ran. Not ; : ! ? — French sets a space before those on purpose.
   */
  return out
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.])(?!\.)/g, '$1')
    .replace(/,\s*$/, '')
    .trim();
}

/**
 * The bullet lines of the page's own ingredient section, and nothing after it.
 *
 * The section ends at the next heading of the same level or higher, and always at a
 * heading about preparing the dish. The first version looked only for level-2 headings,
 * and pages that put "=== Ingrédients ===" at level 3 ran straight on into
 * "=== Préparation ===" — Beignet aux pommes gained its whole method as ingredients. The
 * safety rule below caught that one only because something else on the page had also
 * changed; appending steps on their own would have passed it, so the boundary has to be
 * right rather than relying on the check. Deeper headings inside the section — "Pour la
 * pâte", "Pour la garniture" — are ingredient groups and are read through.
 */
function ingredientLines(wikitext, subpage) {
  const all = wikitext.split('\n');
  const heading = (line) => line.trim().match(/^(=+)\s*(.*?)\s*\1$/);
  const start = all.findIndex((line) => {
    const h = heading(line);
    return h && /^ingr[ée]dients?\b/i.test(h[2]);
  });
  if (start === -1) return null;
  const level = heading(all[start])[1].length;

  const lines = [];
  for (const raw of all.slice(start + 1)) {
    const h = heading(raw);
    if (h && (h[1].length <= level || /pr[ée]paration|recette|[ée]tape|cuisson|r[ée]alisation|instruction|m[ée]thode|finition/i.test(h[2]))) break;
    const bullet = raw.match(/^\s*[*#:]+\s*(.*)$/);
    if (!bullet) continue;
    const line = renderWikitext(bullet[1], subpage);
    if (line) lines.push(line);
  }
  return lines;
}

/** The words of a line, for checking the repair only ever added to what was there. */
const words = (line) => line.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

/**
 * Every word the old list kept appears in the new one, in the same order.
 *
 * Single letters are not checked: they are the fragments the template-deleting import left
 * behind — "2 ou 3 s rouges séchés" was "2 ou 3 {{i|piment}}s rouges séchés", whose "s"
 * now belongs to "piments" and is not a word of its own.
 */
function onlyAdds(oldLines, newLines) {
  const have = words(newLines.join(' '));
  let at = 0;
  for (const word of words(oldLines.join(' ')).filter((w) => w.length > 1)) {
    while (at < have.length && have[at] !== word) at++;
    if (at === have.length) return false;
    at++;
  }
  return true;
}

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

const rows = JSON.parse(await readFile(SOURCE, 'utf8'));
const french = rows.map((row, index) => ({ row, index })).filter(({ row }) => /^fr:/.test(row.title ?? '') && row.rev);

const content = new Map();
for (let i = 0; i < french.length; i += 50) {
  const batch = french.slice(i, i + 50);
  const url = `${API}?action=query&prop=revisions&revids=${batch.map(({ row }) => row.rev).join('|')}&rvprop=ids|content&rvslots=main&format=json&formatversion=2`;
  const response = await fetch(url, { headers: { 'User-Agent': AGENT } });
  if (!response.ok) throw new Error(`Wikibooks answered ${response.status} on batch ${i / 50 + 1}; nothing written.`);
  const data = await response.json();
  for (const page of data.query?.pages ?? []) {
    for (const revision of page.revisions ?? []) {
      content.set(String(revision.revid), revision.slots?.main?.content ?? '');
    }
  }
  process.stdout.write(`fetched ${Math.min(i + 50, french.length)}/${french.length}\r`);
  await sleep(1000);
}
process.stdout.write('\n');

const outcome = { repaired: 0, unchanged: 0, noRevision: 0, noSection: 0, refused: 0 };
const refusedNames = [];
let linesBefore = 0;
let linesAfter = 0;

for (const { row, index } of french) {
  const wikitext = content.get(String(row.rev));
  if (!wikitext) {
    outcome.noRevision++;
    continue;
  }
  const subpage = String(row.title).split('/').pop();
  const rebuilt = ingredientLines(wikitext, subpage);
  if (!rebuilt || !rebuilt.length) {
    outcome.noSection++;
    continue;
  }
  const old = row.ingredients ?? [];
  if (JSON.stringify(old) === JSON.stringify(rebuilt)) {
    outcome.unchanged++;
    continue;
  }
  if (!onlyAdds(old, rebuilt)) {
    outcome.refused++;
    refusedNames.push(row.name);
    if (process.argv.includes('--explain') && refusedNames.length <= 4) {
      console.log(`\n${row.name}\n  old: ${JSON.stringify(old)}\n  new: ${JSON.stringify(rebuilt)}`);
    }
    continue;
  }
  linesBefore += old.length;
  linesAfter += rebuilt.length;
  rows[index] = { ...row, ingredients: rebuilt };
  outcome.repaired++;
}

console.log(JSON.stringify(outcome));
console.log(`lines on repaired rows: ${linesBefore} -> ${linesAfter}`);
if (refusedNames.length) console.log(`left alone, for a person to look at: ${refusedNames.slice(0, 15).join(' | ')}${refusedNames.length > 15 ? ' …' : ''}`);
if (unknown.size) console.log(`templates met and rendered as plain text: ${JSON.stringify([...unknown])}`);

if (!dry && outcome.repaired) {
  /* One-space indent and a closing newline: the file's own format, so the diff is the
     repaired lines and nothing else. */
  await writeFile(SOURCE, `${JSON.stringify(rows, null, 1)}\n`, 'utf8');
  console.log(`written: ${SOURCE}`);
}

/**
 * Re-read the recipes whose ingredients or steps carry wiki markup.
 *
 *   node scripts/repair-cookbook-markup.mjs [--dry] [--limit 200]
 *
 * `[[File:x.jpg|thumb|Caption]]` was rewritten to "thumb|Caption" by a rule meant for
 * `[[Link|text]]`, and the leftover was glued onto the end of whatever step preceded
 * it. 1,158 recipes shipped with lines like "…lumps start to form in the smooth
 * cream.thumb|Overwhipped cream—note the graininess". Alongside it: bare reference
 * URLs, `[https://… label]` link syntax, and an unclosed `{{Recipe summary` that the
 * old template rule could not match for want of a closing brace.
 *
 * The caption's original boundary is gone from the stored text — the brackets that
 * marked it were removed — so this cannot be repaired by cleaning what is on disk. It
 * has to be read again from the source with the fixed parser, which is what this does.
 *
 * **Only `ingredients` and `steps` are touched.** The ingest itself replaces whole
 * records, so re-running it would have deleted the country, the photograph, its credit
 * and its licence for every recipe re-read — six later passes' work. (That is fixed
 * now too, but the narrow repair is still the right shape: it changes the two fields
 * that are wrong and nothing else.)
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../src/data/cookbook.json');

const apiFor = (host) => `https://${host}.wikibooks.org/w/api.php`;
const UA = 'WikiFoodia/1.0 (open food atlas; markup repair; github.com/GHajaymore/Food-Atlas)';

const DRY = process.argv.includes('--dry');
const limitArg = process.argv.indexOf('--limit');
const LIMIT = limitArg > -1 ? Number(process.argv[limitArg + 1]) : 0;

/** Markup that must never reach a reader. The same shape the invariant checks for. */
const RESIDUE = /[|{}]|https?:\/\//;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chunk = (xs, n) => {
  const out = [];
  for (let i = 0; i < xs.length; i += n) out.push(xs.slice(i, i + n));
  return out;
};

/**
 * The fixed line cleaner.
 *
 * Kept identical to `ingest-wikibooks.mjs`. Two copies of a parsing rule is how this
 * project got five fields that a script wrote and the app ignored, so if either side
 * changes, change both — or better, the day this needs a third caller, lift it into
 * `src/domain` where a test can reach it.
 */
const cleanLine = (line) =>
  line
    .replace(/^[*#]+\s*/, '')
    .replace(/\[\[[^\]]*\.(?:jpe?g|png|svg|gif|webp)[^\]]*\]\]/gi, '')
    .replace(/\[\[([^\]]*)\]\]/g, (_, inner) => inner.split('|').pop())
    .replace(/\[(?:https?:)\/\/\S+\s+([^\]]*)\]/gi, '$1')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\{\{[\s\S]*$/, '')
    .replace(/'''?/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+([,.])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

function section(wikitext, headings) {
  const pattern = new RegExp(`^==+\\s*(${headings.join('|')})\\s*==+\\s*$`, 'im');
  const start = wikitext.search(pattern);
  if (start === -1) return [];

  const after = wikitext.slice(start);
  const body = after.slice(after.indexOf('\n') + 1);
  const end = body.search(/^==+[^=]+==+\s*$/m);
  const block = end === -1 ? body : body.slice(0, end);

  return block
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^[*#]\s*\S/.test(l))
    .map(cleanLine)
    .filter((l) => l.length > 2 && l.length < 400 && !RESIDUE.test(l));
}

/**
 * What each cookbook calls its two sections.
 *
 * Mirrors `COOKBOOKS` in `ingest-cookbooks-multilingual.mjs`. Without it this repair
 * fetched the German and French pages perfectly well and then found no method in any
 * of them, because it was looking for a heading called "Procedure" in a book that
 * calls it "Zubereitung" — and reported them as recipes whose method had vanished.
 *
 * Spanish is deliberately absent: that cookbook has no headings at all — every recipe
 * is one template whose named parameters hold the ingredients and the method — so a
 * section reader cannot repair it and would silently empty it instead.
 */
const SECTIONS = {
  en: {
    ingredients: ['Ingredients'],
    steps: ['Procedure', 'Directions', 'Method', 'Preparation'],
  },
  it: {
    ingredients: ['Ingredienti'],
    steps: ['Preparazione', 'Procedimento', 'Esecuzione', 'Preparazione e cottura'],
  },
  fr: {
    ingredients: ['Ingrédients', 'Ingrédients nécessaires', 'Ingrédients pour .*'],
    steps: ['Préparation', 'Réalisation', 'Recette', 'Préparation de la recette'],
  },
  de: {
    ingredients: ['Zutaten'],
    steps: ['Zubereitung', 'Zubereitungsart', 'Anleitung'],
  },
  pt: {
    ingredients: ['Ingredientes'],
    steps: ['Modo de preparo', 'Preparo', 'Preparação', 'Modo de fazer'],
  },
};

/**
 * Which wiki a title lives on.
 *
 * The multilingual ingest stored its titles with the edition in front —
 * `de:Kochbuch/ Apfelstreuselkuchen`, `it:Libro di cucina/Ricette/Ragù bolognese`.
 * Asked of en.wikibooks those are interwiki links, not pages, so they come back with
 * no content and no error: the first run of this repair silently skipped a quarter of
 * its targets and reported the rest as a success.
 */
function hostFor(title) {
  const m = /^([a-z]{2,3}(?:-[a-z]+)?):(.+)$/i.exec(title);
  // `Cookbook:` is a namespace on en.wikibooks, not a language.
  if (!m || m[1].toLowerCase() === 'cookbook') return { host: 'en', page: title };
  return { host: m[1].toLowerCase(), page: m[2] };
}

async function fetchWikitext(host, pages) {
  const url = `${apiFor(host)}?${new URLSearchParams({
    action: 'query',
    prop: 'revisions',
    rvprop: 'content',
    rvslots: 'main',
    format: 'json',
    formatversion: '2',
    titles: pages.join('|'),
  })}`;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429 || res.status === 503) {
      // Wikimedia says four seconds and means four seconds. Read the header.
      await sleep(Number(res.headers.get('retry-after') ?? 4) * 1000);
      continue;
    }
    if (!res.ok) return new Map();
    const data = await res.json();
    return new Map(
      (data?.query?.pages ?? [])
        .filter((p) => p?.revisions?.[0]?.slots?.main?.content)
        .map((p) => [p.title, p.revisions[0].slots.main.content]),
    );
  }
  return new Map();
}

const dirty = (row) =>
  ['ingredients', 'steps'].some((k) => (row[k] ?? []).some((v) => RESIDUE.test(v)));

const main = async () => {
  const rows = JSON.parse(await readFile(OUT, 'utf8'));
  const byTitle = new Map(rows.map((r) => [r.title, r]));

  const affected = rows.filter(dirty);
  const targets = LIMIT ? affected.slice(0, LIMIT) : affected;
  console.log(`${affected.length} of ${rows.length} recipes carry markup. Re-reading ${targets.length}.\n`);

  let repaired = 0;
  let lostMethod = 0;

  // Grouped by wiki, because a batch can only ask one host at a time. The page name
  // is what goes on the wire; the prefixed title is what the record is keyed by, so
  // both are carried and the answer is mapped back through `pageToTitle`.
  const byHost = new Map();
  const pageToTitle = new Map();
  const unrepairable = [];
  for (const row of targets) {
    const { host, page } = hostFor(row.title);
    // No section names for this edition means no way to read it back. Named rather
    // than attempted, so it cannot be mistaken for a page that simply failed.
    if (!SECTIONS[host]) {
      unrepairable.push(row.title);
      continue;
    }
    byHost.set(host, [...(byHost.get(host) ?? []), page]);
    pageToTitle.set(`${host}:${page}`, row.title);
  }
  if (unrepairable.length) {
    console.log(`${unrepairable.length} cannot be re-read — no section names for their edition.`);
  }
  console.log(`Across ${byHost.size} wikis: ${[...byHost].map(([h, p]) => `${h} ${p.length}`).join(', ')}\n`);

  const batches = [...byHost].flatMap(([host, pages]) =>
    chunk(pages, 20).map((batch) => ({ host, batch })),
  );

  for (const [i, { host, batch }] of batches.entries()) {
    const texts = await fetchWikitext(host, batch);
    for (const [returned, wikitext] of texts) {
      const title = pageToTitle.get(`${host}:${returned}`);
      const row = title ? byTitle.get(title) : undefined;
      if (!row) continue;

      const names = SECTIONS[host];
      const ingredients = section(wikitext, names.ingredients);
      const steps = section(wikitext, names.steps);

      // A repair that empties the method has not repaired anything — it has deleted a
      // recipe. Leave the record alone and count it, so the number is visible rather
      // than absorbed into a success total.
      if (!steps.length) {
        lostMethod += 1;
        continue;
      }

      row.ingredients = ingredients.slice(0, 20);
      row.steps = steps.slice(0, 25);
      repaired += 1;
    }

    if (i % 10 === 0) {
      console.log(`  batch ${i + 1}/${batches.length} — ${repaired} repaired`);
      if (!DRY) await writeFile(OUT, JSON.stringify([...byTitle.values()], null, 1), 'utf8');
    }
    await sleep(350);
  }

  if (!DRY) await writeFile(OUT, JSON.stringify([...byTitle.values()], null, 1), 'utf8');

  const left = [...byTitle.values()].filter(dirty).length;
  console.log(`\n${repaired} recipes re-read and cleaned.`);
  if (lostMethod) console.log(`${lostMethod} left untouched — re-reading produced no method at all.`);
  console.log(`${left} still carrying markup.`);
  if (DRY) console.log('Dry run. Nothing written.');
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Recipes from the cookbooks other languages wrote.
 *
 *   node scripts/ingest-cookbooks-multilingual.mjs [--lang it] [--limit 400] [--dry]
 *
 * The English Wikibooks Cookbook gave this project 3,442 recipes, and they are the
 * only records in the catalogue with an ordered method — the thing the app is
 * actually for. Every one of them is written in English, and most describe food
 * from somewhere else.
 *
 * Italian, French, German, Spanish and Portuguese Wikibooks each have a cookbook of
 * their own, each with hundreds of recipes, none of them read here. An Italian
 * recipe for a Roman dish written by Italians is a better record than an English
 * one, and it is the same licence and the same API.
 *
 * ## Steps, this time
 *
 * Unlike every other enrichment in this project, this produces an ordered method
 * rather than prose. A cookbook page is a recipe: a list of ingredients and a
 * numbered procedure. That is why it is worth the work — the app can say "you could
 * cook this tonight" about a record from here, and cannot about one from an
 * encyclopaedia.
 *
 * The method is stored in its own language with `sourceLanguage` set. It is not
 * translated on the way in: the translation layer already refuses to rename an
 * ingredient or alter a number, and it needs a true original to work from.
 *
 * ## Naming the sections
 *
 * Each cookbook names its own headings — Ingredienti/Preparazione,
 * Zutaten/Zubereitung, Ingredientes/Modo de preparo. Those are listed per language
 * rather than guessed, because a heading that matches nothing yields a recipe with
 * no method, which is exactly the kind of empty record this project keeps deleting.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const COOKBOOK = resolve(HERE, '../src/data/cookbook.json');

const USER_AGENT = 'GlobalTaste/1.0 (multilingual cookbook ingest; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const retryAfter = (res, attempt) => {
  const header = Number(res.headers.get('retry-after'));
  return Number.isFinite(header) && header > 0 ? header * 1000 + 250 : 2000 * attempt;
};

/**
 * The cookbooks, and what each calls its sections.
 *
 * `country` is the default place for a recipe from that cookbook — not because a
 * French cookbook only holds French food, but because it is the honest fallback
 * when the page says nothing: the recipe is at least documented there. Anything the
 * page states about origin wins over it.
 */
const COOKBOOKS = {
  it: {
    root: 'Libro di cucina/Ricette',
    country: 'Italy',
    ingredients: ['Ingredienti'],
    steps: ['Preparazione', 'Procedimento', 'Esecuzione', 'Preparazione e cottura'],
  },
  fr: {
    // Recipes sit directly under the book, not under a "Recettes" shelf: the pages
    // are "Livre de cuisine/Kluski", "Livre de cuisine/Mousse au chocolat". Guessing
    // the shelf found exactly one page.
    root: 'Livre de cuisine',
    country: 'France',
    ingredients: ['Ingrédients', 'Ingrédients nécessaires', 'Ingrédients pour .*'],
    steps: ['Préparation', 'Réalisation', 'Recette', 'Préparation de la recette'],
  },
  de: {
    root: 'Kochbuch',
    country: 'Germany',
    ingredients: ['Zutaten'],
    steps: ['Zubereitung', 'Zubereitungsart', 'Anleitung'],
  },
  es: {
    root: 'Artes culinarias/Recetas',
    country: 'Spain',
    // The Spanish cookbook has no headings at all. Every recipe is one
    // {{Datos de receta}} template and the ingredients and method are its named
    // parameters, which is why reading sections found 22 recipes in 1,083 pages.
    template: true,
    ingredients: ['ingredientes'],
    steps: ['procedimiento', 'preparación', 'elaboración', 'preparacion'],
  },
  pt: {
    root: 'Livro de receitas',
    country: 'Portugal',
    ingredients: ['Ingredientes'],
    steps: ['Modo de preparo', 'Preparo', 'Preparação', 'Modo de fazer'],
  },
};

async function api(lang, params, attempt = 1) {
  const query = new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  const res = await fetch(`https://${lang}.wikibooks.org/w/api.php?${query}`, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(30000),
  });

  if (res.status === 429 || res.status >= 500) {
    if (attempt > 5) throw new Error(`HTTP ${res.status}`);
    await sleep(retryAfter(res, attempt));
    return api(lang, params, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Every page under the cookbook's root, following continuations. */
async function listRecipes(lang, root, limit) {
  const pages = [];
  let from;

  do {
    const data = await api(lang, {
      action: 'query',
      list: 'allpages',
      apprefix: `${root}/`,
      aplimit: '500',
      ...(from ? { apcontinue: from } : {}),
    });
    pages.push(...(data?.query?.allpages ?? []).map((p) => p.title));
    from = data?.continue?.apcontinue;
    await sleep(300);
  } while (from && (!limit || pages.length < limit));

  return limit ? pages.slice(0, limit) : pages;
}

/**
 * Turn one line of wikitext into the line a cook reads.
 *
 * The ingredient templates have to be expanded before templates are stripped, and
 * that ordering is the whole point. French writes an ingredient as
 * `{{i|pomme de terre|pommes de terre}}` and Spanish as `{{ing|Pepino}}`; deleting
 * templates first left "1,5 kg de épluchées et coupées en gros morceaux" — a
 * quantity, a preparation, and no food.
 *
 * The display text is the last positional parameter. Named ones are skipped, since
 * `{{i|'=oui|ail}}` carries a flag before the word.
 */
function cleanLine(line) {
  return line
    .replace(/^[*#]+\s*/, '')
    // The last line of a template's final field carries its closing braces.
    .replace(/\}\}\s*$/, '')
    .replace(/\{\{\s*i(?:ng)?\s*\|([^}]*)\}\}/gi, (_, params) => {
      const positional = params.split('|').filter((p) => !p.includes('='));
      return (positional[positional.length - 1] ?? '').trim();
    })
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/'''?/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The listed lines under a named heading. Ported from the English ingest. */
function section(wikitext, names) {
  const pattern = new RegExp(`^==+\\s*(${names.join('|')})\\s*:?\\s*==+\\s*$`, 'im');
  const start = wikitext.search(pattern);
  if (start === -1) return [];

  const after = wikitext.slice(start);
  const body = after.slice(after.indexOf('\n') + 1);
  const end = body.search(/^==+[^=]+==+\s*$/m);
  const block = end === -1 ? body : body.slice(0, end);

  return block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[*#]\s*\S/.test(line))
    .map(cleanLine)
    .filter((line) => line.length > 2 && line.length < 400);
}

/**
 * A method written as paragraphs rather than a list.
 *
 * Several of these cookbooks write the procedure as prose. Sentences are a
 * reasonable proxy for steps there, and better than discarding the recipe — but
 * only when the section is clearly a procedure, which is why it is a fallback and
 * not the primary read.
 */
function prosePreparation(wikitext, names) {
  const pattern = new RegExp(`^==+\\s*(${names.join('|')})\\s*:?\\s*==+\\s*$`, 'im');
  const start = wikitext.search(pattern);
  if (start === -1) return [];

  const after = wikitext.slice(start);
  const body = after.slice(after.indexOf('\n') + 1);
  const end = body.search(/^==+[^=]+==+\s*$/m);
  const block = (end === -1 ? body : body.slice(0, end))
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/'''?/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();

  return block
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s.length > 15 && s.length < 400)
    .slice(0, 20);
}

/**
 * The listed lines in a named template parameter.
 *
 * `|ingredientes = * Pepino\n* anís dulce` — the Spanish cookbook keeps a whole
 * recipe this way, with no headings anywhere on the page. The parameter runs to the
 * next `|` that starts a line, or to the end of the template.
 */
function templateField(wikitext, names) {
  /*
   * The field runs to the next parameter, or to the end of the page.
   *
   * Not to the closing braces: the method is the last parameter and the template
   * closes on the same line as its final sentence — "...digestiones pesadas.}}" —
   * with category links after it. Requiring "}}" at the end of the string matched
   * nothing, so every Spanish recipe came back with ingredients and no method.
   * Matching "}}" anywhere is worse still, because an ingredient line contains
   * {{ing|Pepino}} and the field would stop at the first ingredient.
   */
  const pattern = new RegExp(`\\|\\s*(${names.join('|')})\\s*=\\s*([\\s\\S]*?)(?=\\n\\s*\\||$)`, 'i');
  const match = pattern.exec(wikitext ?? '');
  if (!match) return [];

  return match[2]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[*#]\s*\S/.test(line))
    .map(cleanLine)
    .filter((line) => line.length > 2 && line.length < 400);
}

/** Wikitext for up to 20 pages. */
async function fetchWikitext(lang, titles) {
  const data = await api(lang, {
    action: 'query',
    prop: 'revisions',
    rvprop: 'content',
    rvslots: 'main',
    titles: titles.join('|'),
  });

  const out = new Map();
  for (const page of data?.query?.pages ?? []) {
    const text = page?.revisions?.[0]?.slots?.main?.content;
    if (text) out.set(page.title, text);
  }
  return out;
}

/** The dish's name: the last path segment, which is what the cookbook calls it. */
const nameFrom = (title) => (title.split('/').pop() ?? title).replace(/_/g, ' ').trim();

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : fallback;
};

const main = async () => {
  const dry = process.argv.includes('--dry');
  const only = arg('--lang', '');
  const limit = Number(arg('--limit', 0));

  const rows = JSON.parse(await readFile(COOKBOOK, 'utf8'));
  const known = new Set(rows.map((r) => r.title));
  process.stdout.write(`${rows.length} recipes already held.\n`);

  let added = 0;

  for (const [lang, book] of Object.entries(COOKBOOKS)) {
    if (only && lang !== only) continue;

    let titles;
    try {
      titles = await listRecipes(lang, book.root, limit);
    } catch (error) {
      process.stdout.write(`\n${lang}: could not be listed (${error.message})\n`);
      continue;
    }

    const fresh = titles.filter((t) => !known.has(`${lang}:${t}`));
    process.stdout.write(`\n${lang}: ${titles.length} pages, ${fresh.length} not yet held\n`);

    for (let i = 0; i < fresh.length; i += 20) {
      const batch = fresh.slice(i, i + 20);
      let texts;
      try {
        texts = await fetchWikitext(lang, batch);
      } catch (error) {
        process.stdout.write(`  batch failed (${error.message})\n`);
        continue;
      }

      for (const [title, wikitext] of texts) {
        // Two shapes of cookbook: headed sections, or one template holding the whole
        // recipe in its parameters. Which one is a property of the book, not of the
        // page, so it is declared rather than sniffed.
        const ingredients = book.template
          ? templateField(wikitext, book.ingredients)
          : section(wikitext, book.ingredients);

        const steps = book.template
          ? templateField(wikitext, book.steps)
          : section(wikitext, book.steps).length
            ? section(wikitext, book.steps)
            : prosePreparation(wikitext, book.steps);

        // A recipe with no method is not a recipe. This project has spent the day
        // deleting records that were only a name; it is not going to import more.
        if (steps.length < 2) continue;

        const row = {
          // Namespaced so an Italian and an English page of the same name are two
          // records rather than one overwriting the other.
          title: `${lang}:${title}`,
          name: nameFrom(title),
          ingredients,
          steps,
          url: `https://${lang}.wikibooks.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
          country: book.country,
          countryChecked: true,
          sourceLanguage: lang,
        };

        if (!dry) rows.push(row);
        known.add(row.title);
        added += 1;
      }

      if (!dry) await writeFile(COOKBOOK, JSON.stringify(rows), 'utf8');
      process.stdout.write(`  ${Math.min(i + 20, fresh.length)}/${fresh.length} — ${added} recipes\n`);
      await sleep(400);
    }
  }

  process.stdout.write(`\n${added} recipes added, each with an ordered method in its own language.\n`);
};

main().catch((error) => {
  process.stderr.write(`\nCookbook ingest failed: ${error.message}\n`);
  process.exitCode = 1;
});

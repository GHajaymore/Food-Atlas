/**
 * Second source: the Wikibooks Cookbook.
 *
 *   node scripts/ingest-wikibooks.mjs [--limit 500]
 *
 * Wikidata turned out to be a poor primary source for a world atlas — it holds 4,693
 * Italian food items against 173 Indian, which describes which national projects ran
 * bulk imports rather than where the world's food is. It also carries no methods, so
 * most imported records have nothing to show.
 *
 * The Wikibooks Cookbook is a genuinely separate corpus: ~3,800 recipes, CC BY-SA,
 * each with an ingredient list and a procedure. That fills the gap Wikidata cannot.
 *
 * **How these records are classified, and why it matters.** A Cookbook page is a
 * general-audience recipe written by a contributor. It is documentation of *how a
 * dish is commonly made*, not evidence of how it is made in the place it comes from
 * — which is precisely the brief's "most-published version": taken as the popular
 * candidate, classified as an adaptation, and never promoted to the authentic record
 * by default. So every record from this source lands as `🟠 Modern Adaptation` with
 * its method attributed to Wikibooks, and it takes locality evidence — not more
 * recipe text — to move it.
 *
 * That is also what makes these records useful to the product's argument: they are
 * the "how it's made today" against which a documented tradition can be compared.
 *
 * Output merges into src/data/cookbook.json by page title; re-running is additive.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { renderInlineTemplates, requestedTitles } from './lib/mediawiki.mjs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../src/data/cookbook.json');

const API = 'https://en.wikibooks.org/w/api.php';
const USER_AGENT = 'GlobalTaste/1.0 (food atlas ingest; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * How long to wait after being throttled — as the server states it, not as we guess.
 *
 * Wikimedia answers a 429 with `Retry-After`, and it is typically four seconds. An
 * escalating backoff invented locally turns that into what looks like a permanent
 * cooldown: it cost this repository six lost batches and an hour of misdiagnosis.
 */
const retryAfter = (res, attempt) => {
  const header = Number(res.headers.get('retry-after'));
  return Number.isFinite(header) && header > 0 ? header * 1000 + 250 : 2000 * attempt;
};


/** Polite client: back off on 429 and 5xx, which this API applies readily. */
async function api(params, attempt = 1) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });

  if (res.status === 429 || res.status >= 500) {
    if (attempt > 5) throw new Error(`HTTP ${res.status} after ${attempt} attempts`);
    await sleep(retryAfter(res, attempt));
    return api(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Every page under Category:Recipes. */
async function listRecipes(limit) {
  const titles = [];
  let cont;
  do {
    const data = await api({
      action: 'query',
      list: 'categorymembers',
      cmtitle: 'Category:Recipes',
      cmlimit: '500',
      cmtype: 'page',
      ...(cont ? { cmcontinue: cont } : {}),
    });
    for (const m of data?.query?.categorymembers ?? []) titles.push(m.title);
    cont = data?.continue?.cmcontinue;
    process.stdout.write(`  listed ${titles.length}\n`);
    await sleep(400);
  } while (cont && (!limit || titles.length < limit));

  return limit ? titles.slice(0, limit) : titles;
}

/**
 * Pull a named section's list items out of wikitext.
 *
 * Deliberately conservative: it reads bullet and numbered lines under a heading and
 * strips markup. Anything it cannot parse cleanly is left out rather than guessed at
 * — a half-parsed instruction is worse than a missing one.
 */
export function section(wikitext, names) {
  const pattern = new RegExp(`^==+\\s*(${names.join('|')})\\s*==+\\s*$`, 'im');
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
    .map((line) =>
      line
        .replace(/^[*#]+\s*/, '')
        // Templates that carry words are rendered before the rest are stripped. A step
        // read "Preheat the oven to ." because {{convert|375|F|C}} was deleted whole —
        // 241 recipes had lost an oven temperature, the one number nobody can guess.
        .replace(/[\s\S]*/, renderInlineTemplates)
        // Image links go entirely, caption and all. `[[File:x.jpg|thumb|Caption]]`
        // used to be rewritten to "thumb|Caption" by the rule below, which then got
        // glued onto the end of the previous step: 1,158 recipes carried lines like
        // "...lumps start to form in the smooth cream.thumb|Overwhipped cream". The
        // file extension identifies these in every language, unlike the namespace
        // prefix, which each Wikibooks edition names for itself.
        .replace(/\[\[[^\]]*\.(?:jpe?g|png|svg|gif|webp)[^\]]*\]\]/gi, '')
        // Then the LAST pipe segment, not the first. A surviving multi-pipe link is
        // an image with parameters, and keeping the first segment kept the parameters.
        .replace(/\[\[([^\]]*)\]\]/g, (_, inner) => inner.split('|').pop())
        // External links: `[https://url label]` keeps the label, a bare URL goes.
        .replace(/\[(?:https?:)\/\/\S+\s+([^\]]*)\]/gi, '$1')
        .replace(/https?:\/\/\S+/gi, '')
        // Templates, including an unclosed `{{Recipe summary` at the end of a step,
        // which the old `\{\{[^}]*\}\}` could not match for want of a closing brace.
        .replace(/\{\{[^}]*\}\}/g, '')
        .replace(/\{\{[\s\S]*$/, '')
        .replace(/'''?/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+([,.])/g, '$1')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    // A line still carrying a pipe or a brace is markup this did not understand, and
    // a reader should not be the one to discover that. Dropped rather than shipped.
    .filter((line) => line.length > 2 && line.length < 400 && !/[|{}]/.test(line));
}

/** Wikitext for up to 20 pages per request. */
async function fetchWikitext(titles) {
  const data = await api({
    action: 'query',
    prop: 'revisions',
    rvprop: 'content',
    rvslots: 'main',
    titles: titles.join('|'),
    redirects: '1',
  });

  // Keyed by the title that was ASKED for, not the one that came back. With
  // redirects=1 those differ, and a caller looking up its own title finds nothing —
  // which here would silently create a second record under the redirect's target
  // rather than fill in the one that already exists.
  const out = new Map();
  for (const page of data?.query?.pages ?? []) {
    const text = page?.revisions?.[0]?.slots?.main?.content;
    if (!page.title || !text) continue;
    for (const asked of requestedTitles(data).get(page.title) ?? [page.title]) out.set(asked, text);
  }
  return out;
}

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

/** 'Cookbook:Chicken Tikka Masala' -> 'Chicken Tikka Masala' */
const displayName = (title) => title.replace(/^Cookbook:/, '').trim();

/**
 * Give each recipe a place, from its Cookbook categories.
 *
 * A recipe with a method but no country cannot be an atlas record — it has nowhere
 * to sit and nothing to be authentic *to*. Wikibooks files recipes under
 * "Category:Indian recipes", "Category:Cuisine of Japan" and the like, which is
 * exactly the missing half. With it, 3,400 recipes that carry a real preparation
 * become placed records rather than a lookup table matched by name.
 */
const CATEGORY_COUNTRY = [
  [/^Category:(.+?) recipes$/i, 1],
  [/^Category:Cuisine of (?:the\s+)?(.+)$/i, 1],
  [/^Category:(.+?) cuisine$/i, 1],
];

/** Demonym to country, for the categories that name a people rather than a state. */
const DEMONYM = {
  Indian: 'India', Chinese: 'China', Japanese: 'Japan', Korean: 'South Korea', Thai: 'Thailand',
  Vietnamese: 'Vietnam', Indonesian: 'Indonesia', Malaysian: 'Malaysia', Filipino: 'Philippines',
  Pakistani: 'Pakistan', Bangladeshi: 'Bangladesh', 'Sri Lankan': 'Sri Lanka', Nepalese: 'Nepal',
  Afghan: 'Afghanistan', Iranian: 'Iran', Persian: 'Iran', Turkish: 'Turkey', Lebanese: 'Lebanon',
  Syrian: 'Syria', Iraqi: 'Iraq', Israeli: 'Israel', Egyptian: 'Egypt', Moroccan: 'Morocco',
  Ethiopian: 'Ethiopia', Nigerian: 'Nigeria', Ghanaian: 'Ghana', Kenyan: 'Kenya', Senegalese: 'Senegal',
  'South African': 'South Africa', Mexican: 'Mexico', Peruvian: 'Peru', Brazilian: 'Brazil',
  Argentine: 'Argentina', Argentinian: 'Argentina', Colombian: 'Colombia', Chilean: 'Chile',
  Cuban: 'Cuba', Jamaican: 'Jamaica', American: 'United States', Canadian: 'Canada', Italian: 'Italy',
  French: 'France', Spanish: 'Spain', Portuguese: 'Portugal', German: 'Germany', Greek: 'Greece',
  British: 'United Kingdom', English: 'United Kingdom', Scottish: 'United Kingdom', Irish: 'Ireland',
  Polish: 'Poland', Russian: 'Russia', Ukrainian: 'Ukraine', Hungarian: 'Hungary', Romanian: 'Romania',
  Swedish: 'Sweden', Norwegian: 'Norway', Danish: 'Denmark', Finnish: 'Finland', Dutch: 'Netherlands',
  Belgian: 'Belgium', Austrian: 'Austria', Swiss: 'Switzerland', Australian: 'Australia',
  'New Zealand': 'New Zealand', Icelandic: 'Iceland', Mongolian: 'Mongolia', Georgian: 'Georgia',
  Armenian: 'Armenia', Uzbek: 'Uzbekistan', Kazakh: 'Kazakhstan',
};

function countryFromCategories(categories) {
  for (const category of categories) {
    for (const [pattern] of CATEGORY_COUNTRY) {
      const match = category.match(pattern);
      if (!match) continue;
      const raw = match[1].trim();
      const country = DEMONYM[raw] ?? raw;

      /*
       * Wikibooks files a recipe under its difficulty, its technique and its course
       * as readily as under its cuisine — "Category:Easy recipes",
       * "Category:Boiled recipes", "Category:Appetizer recipes" all match the same
       * pattern. Read naively, "Easy" became the largest cuisine in the atlas with
       * 883 dishes. Only a name that is actually a country or a known demonym is
       * accepted; everything else is discarded rather than guessed at.
       */
      const known = new Set(Object.values(DEMONYM));
      if (!known.has(country)) continue;
      return country;
    }
  }
  return '';
}

/** Categories for up to 50 pages per request. */
async function fetchCategories(titles) {
  const data = await api({
    action: 'query',
    prop: 'categories',
    cllimit: 'max',
    clshow: '!hidden',
    titles: titles.join('|'),
    redirects: '1',
  });

  const out = new Map();
  for (const page of data?.query?.pages ?? []) {
    if (!page.title) continue;
    const cats = (page.categories ?? []).map((c) => c.title);
    for (const asked of requestedTitles(data).get(page.title) ?? [page.title]) out.set(asked, cats);
  }
  return out;
}

const main = async () => {
  const limitArg = process.argv.indexOf('--limit');
  const limit = limitArg > -1 ? Number(process.argv[limitArg + 1]) : 0;

  let existing = [];
  try {
    existing = JSON.parse(await readFile(OUT, 'utf8'));
  } catch {
    existing = [];
  }
  const byTitle = new Map(existing.map((r) => [r.title, r]));
  process.stdout.write(`${existing.length} cookbook records on disk.\nListing recipes…\n`);

  const titles = await listRecipes(limit);
  process.stdout.write(`${titles.length} recipe pages. Fetching wikitext…\n`);

  let withMethod = 0;
  const batches = chunk(titles, 20);

  for (const [i, batch] of batches.entries()) {
    try {
      const texts = await fetchWikitext(batch);
      for (const [title, wikitext] of texts) {
        const ingredients = section(wikitext, ['Ingredients']);
        const steps = section(wikitext, ['Procedure', 'Directions', 'Method', 'Preparation']);

        // A page with no method is just a name we already have from Wikidata.
        if (!steps.length) continue;

        // Merged onto whatever is already there, not written over it. A plain
        // `set` here would silently drop the country, the photograph, its credit and
        // its licence every time this script was re-run — six later passes' work,
        // deleted by re-reading the same page.
        byTitle.set(title, {
          ...(byTitle.get(title) ?? {}),
          title,
          name: displayName(title),
          ingredients: ingredients.slice(0, 20),
          steps: steps.slice(0, 25),
          url: `https://en.wikibooks.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
        });
        withMethod += 1;
      }
    } catch (error) {
      process.stdout.write(`  batch ${i + 1} failed (${error.message})\n`);
    }

    if (i % 10 === 0) {
      process.stdout.write(`  batch ${i + 1}/${batches.length} — ${withMethod} with a method\n`);
      // Checkpoint, so a long run that dies still leaves progress behind.
      await mkdir(dirname(OUT), { recursive: true });
      await writeFile(OUT, JSON.stringify([...byTitle.values()]), 'utf8');
    }
    await sleep(350);
  }

  // Second pass: give each recipe a place, so it can be a record rather than a
  // lookup table entry matched by name.
  const needCountry = [...byTitle.values()].filter((r) => !r.countryChecked);
  process.stdout.write(`\nPlacing ${needCountry.length} recipes from their categories…\n`);

  let placed = 0;
  for (const [i, batch] of chunk(needCountry, 50).entries()) {
    try {
      const categories = await fetchCategories(batch.map((r) => r.title));
      for (const [title, cats] of categories) {
        const row = byTitle.get(title);
        if (!row) continue;
        row.countryChecked = true;
        const country = countryFromCategories(cats);
        if (country) {
          row.country = country;
          placed += 1;
        }
      }
    } catch (error) {
      process.stdout.write(`  batch ${i + 1} failed (${error.message})\n`);
    }
    if (i % 10 === 0) {
      process.stdout.write(`  batch ${i + 1}/${Math.ceil(needCountry.length / 50)} — ${placed} placed\n`);
      await writeFile(OUT, JSON.stringify([...byTitle.values()]), 'utf8');
    }
    await sleep(300);
  }

  const records = [...byTitle.values()];
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(records), 'utf8');
  process.stdout.write(`  ${placed} recipes placed in a country.\n`);

  process.stdout.write(
    `\nWrote ${records.length} cookbook recipes to src/data/cookbook.json\n` +
      `  ${records.filter((r) => r.ingredients.length).length} with an ingredient list\n` +
      `  every one classified as a Modern Adaptation until locality evidence says otherwise.\n`,
  );
};

/*
 * Only when run as a command.
 *
 * section() is exported so a repair pass can re-derive steps through the same code
 * that first wrote them. Without this guard, importing it started a full cookbook
 * ingest as a side effect — which is exactly what happened: the import rewrote
 * src/data/cookbook.json underneath the repair that was trying to read it, and the
 * file had to be restored from git. An import must not have a side effect this large.
 */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`\nCookbook ingest failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}

/**
 * Put the oven temperatures back into the recipes.
 *
 * Both cookbook ingests deleted every {{template}} whole, so {{convert|375|F|C}} vanished
 * and recipes carried a step reading
 *
 *   "Preheat the oven to ."
 *
 * An oven temperature is the one number in a step that cannot be guessed. A cook can
 * judge "until golden" but not 175°C against 220°C — and the step still read as a
 * sentence, so nothing looked broken enough to check.
 *
 * The strippers are fixed. This repairs the recipes already written, re-deriving the
 * steps through the same extractors the ingests use — imported, not copied, so a repair
 * cannot drift from what the next ingest would produce.
 *
 * ## Six wikis, not one
 *
 * The cookbook is drawn from en, it, fr, de, pt and es Wikibooks. They name a method
 * differently — Procedure, Preparazione, Préparation, Zubereitung, Modo de preparo — and
 * the Spanish book has no headings at all, keeping each recipe in the parameters of a
 * {{Datos de receta}} template.
 *
 * An earlier version of this pass asked en.wikibooks.org for every title. A Portuguese
 * page answers "missing" there, which the loop counted as a skip, so 190 repairable
 * recipes were reported as unrepairable — a number that read as a fact about Wikibooks
 * rather than a bug in the client. The language is in each row's own URL and never
 * needed guessing.
 *
 * A recipe is only rewritten when the new steps are the same method, mended. Anything
 * else is reported and skipped: replacing one recipe's method with another's is far
 * worse than the gap it was fixing.
 *
 *   node scripts/repair-cookbook-values.mjs            # report only
 *   node scripts/repair-cookbook-values.mjs --write    # apply
 */

import { readFile, writeFile } from 'node:fs/promises';
import { section } from './ingest-wikibooks.mjs';
import {
  COOKBOOKS,
  prosePreparation,
  section as sectionIn,
  templateField,
} from './ingest-cookbooks-multilingual.mjs';
import { VALUE_DROPPED, requestedTitles, writeRows } from './lib/mediawiki.mjs';

const PATH = 'src/data/cookbook.json';
const WOUND = VALUE_DROPPED;

/** The English book predates the multilingual one and names its sections its own way. */
const EN_HEADINGS = ['Procedure', 'Directions', 'Instructions', 'Method', 'Preparation', 'Steps'];

/** Which wiki a recipe came from. It is in the row's own URL. */
const langOf = (row) => {
  const host = (row?.url ?? '').match(/https?:\/\/([a-z-]+)\.wikibooks\.org/i);
  return host ? host[1].toLowerCase() : '';
};

const apiFor = (lang) => `https://${lang}.wikibooks.org/w/api.php`;

const titleOf = (row) => {
  const slug = (row?.url ?? '').split('/wiki/')[1];
  if (!slug) return row?.title ?? '';
  try {
    return decodeURIComponent(slug).replace(/_/g, ' ');
  } catch {
    return slug.replace(/_/g, ' ');
  }
};

/**
 * The method, read the way that book writes one.
 *
 * Which shape applies is a property of the book rather than the page, so it is declared
 * in COOKBOOKS rather than sniffed — exactly as the ingest declares it.
 */
const stepsFrom = (lang, wikitext) => {
  if (lang === 'en') return section(wikitext, EN_HEADINGS);
  const book = COOKBOOKS[lang];
  if (!book) return [];
  if (book.template) return templateField(wikitext, book.steps);
  const listed = sectionIn(wikitext, book.steps);
  return listed.length ? listed : prosePreparation(wikitext, book.steps);
};

/**
 * The ingredients, read the same way.
 *
 * Repairing only the method left 54 recipes with a wounded ingredient line — "pure water,
 * such as , orange blossom water" — which is the same fault in the list a cook shops
 * from. The English ingest caps this list at 20, so the cap is applied here too rather
 * than letting a repair quietly lengthen it.
 */
const ingredientsFrom = (lang, wikitext) => {
  if (lang === 'en') return section(wikitext, ['Ingredients']).slice(0, 20);
  const book = COOKBOOKS[lang];
  if (!book) return [];
  const found = book.template
    ? templateField(wikitext, book.ingredients)
    : sectionIn(wikitext, book.ingredients);
  return found.slice(0, 20);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Wait between requests, and back off when told to.
 *
 * Firing batches back to back earned "You are making too many requests to the API" — in
 * plain text, not JSON. Read as an empty answer that looked like a missing page. A body
 * that is not JSON is an error worth retrying, not a fact worth believing.
 */
const api = async (endpoint, params, attempt = 1) => {
  const url = endpoint + '?' + new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  const response = await fetch(url, {
    headers: { 'User-Agent': 'WikiFoodia/1.0 (https://wikifoodia.ajailabs.app) data repair' },
  });
  const body = await response.text();
  try {
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return JSON.parse(body);
  } catch (error) {
    if (attempt > 4) throw new Error('gave up after ' + attempt + ' tries: ' + body.slice(0, 80));
    await sleep(2000 * 2 ** (attempt - 1));
    return api(endpoint, params, attempt + 1);
  }
};

const chunk = (list, size) =>
  Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, i * size + size));

/**
 * Is this the same method, only mended?
 *
 * Word overlap rather than a line or character comparison, because the repair adds words
 * by design — a temperature that was not there before. A method sharing most of its
 * vocabulary with the old one is the same method; one that does not is a different
 * recipe, and taking it would be a silent swap rather than a repair.
 */
/**
 * Markup a stripper did not understand, which a reader must never be the one to find.
 *
 * The English ingest already refuses a line holding a brace or a pipe, and it is right
 * to: this pass accepted 22 lines like "Podemos combinarlo con una {{rec|salsa de cebolla"
 * because the multilingual reader has no such rule. The catalogue's own invariant caught
 * them, and a repair that trades a missing word for raw wikitext is not a repair.
 *
 * Refusing the whole list rather than dropping the line: a method with a step quietly
 * removed is a worse artefact than one with a gap that is already recorded.
 */
const holdsMarkup = (list) => list.some((line) => /[|{}]/.test(line));

const sameMethod = (before, after) => {
  const words = (list) => new Set(list.join(' ').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);
  const old = words(before);
  if (!old.size) return false;
  const fresh = words(after);
  let shared = 0;
  for (const word of old) if (fresh.has(word)) shared += 1;
  return shared / old.size >= 0.6;
};

const main = async () => {
  const write = process.argv.includes('--write');
  const rows = JSON.parse(await readFile(PATH, 'utf8'));

  /* A wound in either list is worth a fetch: the ingredients are what a cook shops from. */
  const isWounded = (list) => Array.isArray(list) && list.some((s) => WOUND.test(s));
  const wounded = rows.filter(
    (r) => (isWounded(r.steps) || isWounded(r.ingredients)) && titleOf(r) && langOf(r),
  );

  const byLang = new Map();
  for (const row of wounded) {
    const lang = langOf(row);
    if (!byLang.has(lang)) byLang.set(lang, []);
    byLang.get(lang).push(row);
  }

  process.stdout.write(
    wounded.length + ' recipes with a wounded step across ' + byLang.size + ' wikis: ' +
      [...byLang].map(([l, r]) => l + ' ' + r.length).join(', ') + '\n',
  );

  let repaired = 0;
  let stillWounded = 0;
  let skipped = 0;
  let unreadable = 0;

  for (const [lang, group] of byLang) {
    const byTitle = new Map();
    for (const row of group) {
      const title = titleOf(row);
      if (!byTitle.has(title)) byTitle.set(title, []);
      byTitle.get(title).push(row);
    }

    for (const batch of chunk([...byTitle.keys()], 20)) {
      await sleep(1000);
      const data = await api(apiFor(lang), {
        action: 'query',
        prop: 'revisions',
        rvprop: 'content',
        rvslots: 'main',
        redirects: '1',
        titles: batch.join('|'),
      });

      /* The title that comes back is not the title asked for: MediaWiki normalises
         capitalisation, then follows redirects, and reports both. */
      const asked = requestedTitles(data);

      for (const page of data?.query?.pages ?? []) {
        const wikitext = page?.revisions?.[0]?.slots?.main?.content;
        const targets = (asked.get(page.title) ?? [page.title]).flatMap((t) => byTitle.get(t) ?? []);

        if (!wikitext) {
          unreadable += targets.length;
          for (const row of targets) process.stdout.write('  gone from ' + lang + '  ' + row.name + '\n');
          continue;
        }

        const freshSteps = stepsFrom(lang, wikitext);
        const freshIngredients = ingredientsFrom(lang, wikitext);

        for (const row of targets) {
          /*
           * Each list is judged on its own.
           *
           * A recipe can have a mended method and an ingredient list that came back as a
           * different shape, and taking one is no reason to take the other. Both are held
           * to the same rule: the same list, mended — never a different one.
           */
          let mended = false;

          for (const [field, next] of [['steps', freshSteps], ['ingredients', freshIngredients]]) {
            const current = row[field];
            if (!isWounded(current)) continue;
            if (!next.length || !sameMethod(current, next)) {
              skipped += 1;
              process.stdout.write('  skip (' + field + ' differ)  ' + row.name + '\n');
              continue;
            }
            if (holdsMarkup(next)) {
              skipped += 1;
              process.stdout.write('  skip (' + field + ' hold markup)  ' + row.name + '\n');
              continue;
            }
            if (next.some((s) => WOUND.test(s))) {
              stillWounded += 1;
              continue;
            }
            const before = current.find((s) => WOUND.test(s)) ?? '';
            const after = next[current.indexOf(before)] ?? '';
            process.stdout.write(
              '  repaired  [' + lang + '] ' + row.name + ' (' + field + ')\n      ' +
                JSON.stringify(before.slice(0, 56)) + '\n   -> ' + JSON.stringify(after.slice(0, 56)) + '\n',
            );
            if (write) row[field] = next;
            mended = true;
          }

          if (mended) repaired += 1;
        }
      }
    }
  }

  process.stdout.write(
    '\n' + repaired + ' repaired, ' + stillWounded + ' still wounded upstream, ' +
      skipped + ' skipped, ' + unreadable + ' no longer on the wiki\n',
  );

  if (write && repaired) {
    await writeFile(PATH, writeRows(rows), 'utf8');
    process.stdout.write('wrote ' + PATH + '\n');
  }
  if (!write) process.stdout.write('\nReport only. Re-run with --write to apply.\n');
};

main().catch((error) => {
  process.stderr.write('\nCookbook repair failed: ' + error.message + '\n');
  process.exitCode = 1;
});

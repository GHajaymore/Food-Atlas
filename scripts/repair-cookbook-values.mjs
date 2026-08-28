/**
 * Put the oven temperatures back into the recipes.
 *
 * `section()` in `ingest-wikibooks.mjs` deleted every `{{template}}` whole, so
 * `{{convert|375|F|C}}` vanished and 241 recipes carried a step reading
 *
 *   "Preheat the oven to ."
 *
 * An oven temperature is the one number in a step that cannot be guessed or inferred
 * from context — a cook can judge "until golden" but not 175°C against 220°C. And the
 * step still read as a sentence, so nothing looked broken enough to check.
 *
 * The stripper is fixed. This repairs the recipes already written, re-deriving the
 * steps through the same `section()` the ingest uses — imported, not copied.
 *
 * A recipe is only rewritten when the new steps are the same method, mended: the same
 * number of steps, and no wound left. Anything else is reported and skipped, because
 * replacing one recipe's method with another's is far worse than the gap.
 *
 *   node scripts/repair-cookbook-values.mjs            # report only
 *   node scripts/repair-cookbook-values.mjs --write    # apply
 */

import { readFile, writeFile } from 'node:fs/promises';
import { section } from './ingest-wikibooks.mjs';
import { VALUE_DROPPED, requestedTitles, writeRows } from './lib/mediawiki.mjs';

const PATH = 'src/data/cookbook.json';
const API = 'https://en.wikibooks.org/w/api.php';
const WOUND = VALUE_DROPPED;
const STEP_HEADINGS = ['Procedure', 'Directions', 'Instructions', 'Method', 'Preparation', 'Steps'];

/**
 * Wait between requests, and back off when told to.
 *
 * Without this the run fired thirteen batches back to back and Wikibooks answered
 * "You are making too many requests to the API" — in plain text, not JSON. The script
 * read that as "no wikitext" and reported 190 of 256 recipes as skipped, which looked
 * like 190 unrepairable recipes and was in fact one impolite client.
 *
 * A body that is not JSON is now an error worth retrying rather than an empty answer
 * worth believing.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const api = async (params, attempt = 1) => {
  const url = API + "?" + new URLSearchParams({ format: "json", formatversion: "2", ...params });
  const response = await fetch(url, {
    headers: { "User-Agent": "WikiFoodia/1.0 (https://wikifoodia.ajailabs.app) data repair" },
  });
  const body = await response.text();
  try {
    if (!response.ok) throw new Error("HTTP " + response.status);
    return JSON.parse(body);
  } catch (error) {
    if (attempt > 4) throw new Error("gave up after " + attempt + " tries: " + body.slice(0, 80));
    /* Exponential, starting at two seconds. The limit is theirs to set, not ours. */
    await sleep(2000 * 2 ** (attempt - 1));
    return api(params, attempt + 1);
  }
};

const chunk = (list, size) =>
  Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, i * size + size));

const titleOf = (row) => {
  const slug = (row?.url ?? '').split('/wiki/')[1];
  if (!slug) return row?.title ?? '';
  try { return decodeURIComponent(slug).replace(/_/g, ' '); } catch { return slug.replace(/_/g, ' '); }
};

/**
 * Is this the same method, only mended?
 *
 * Word overlap rather than a line or character comparison, because the repair adds
 * words by design — a temperature that was not there before. A method sharing most of
 * its vocabulary with the old one is the same method; one that does not is a different
 * recipe, and taking it would be a silent swap rather than a repair.
 */
const sameMethod = (before, after) => {
  const words = (list) => new Set(list.join(" ").toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);
  const old = words(before);
  if (!old.size) return false;
  const fresh = words(after);
  let shared = 0;
  for (const w of old) if (fresh.has(w)) shared += 1;
  return shared / old.size >= 0.6;
};

const main = async () => {
  const write = process.argv.includes('--write');
  const rows = JSON.parse(await readFile(PATH, 'utf8'));

  /*
   * English recipes only, and said out loud rather than left to look like a skip.
   *
   * This cookbook is five wikis: en, it, fr, de, pt and es. They use different section
   * headings for a method — Preparazione, Préparation, Zubereitung, Modo de preparo —
   * and the Spanish book has no headings at all, its recipes being the parameters of a
   * {{Datos de receta}} template. Re-deriving those steps needs the extractor in
   * ingest-cookbooks-multilingual.mjs, not this one.
   *
   * Asking en.wikibooks.org for a Portuguese title answers "missing", which this pass
   * counted as a skip — so 190 repairable recipes read as unrepairable ones. Counting
   * them separately is the difference between a limit and a silent failure.
   */
  const isEnglish = (row) => (row?.url ?? "").includes("//en.wikibooks.org/");
  const allWounded = rows.filter(
    (r) => Array.isArray(r.steps) && r.steps.some((s) => WOUND.test(s)) && titleOf(r),
  );
  const wounded = allWounded.filter(isEnglish);
  const otherWikis = allWounded.length - wounded.length;
  process.stdout.write(`${wounded.length} English recipes with a wounded step, ${otherWikis} on other-language wikis this pass cannot read
`);

  const byTitle = new Map();
  for (const row of wounded) {
    const t = titleOf(row);
    if (!byTitle.has(t)) byTitle.set(t, []);
    byTitle.get(t).push(row);
  }

  let repaired = 0, stillWounded = 0, skipped = 0;

  for (const batch of chunk([...byTitle.keys()], 20)) {
    await sleep(1000);
    const data = await api({
      action: 'query', prop: 'revisions', rvprop: 'content', rvslots: 'main', redirects: '1', titles: batch.join('|'),
    });

    const asked = requestedTitles(data);

    for (const page of data?.query?.pages ?? []) {
      const wikitext = page?.revisions?.[0]?.slots?.main?.content;
      /*
       * The title that comes back is not the title asked for. MediaWiki normalises
       * capitalisation and underscores and then follows redirects, and reports both —
       * so filing the answer under page.title missed the row that asked the question
       * and reported it as "no wikitext". 190 of 241 recipes were skipped that way,
       * every one of them repairable. The same bug lib/mediawiki.mjs was written for.
       */
      const targets = (asked.get(page.title) ?? [page.title]).flatMap((t) => byTitle.get(t) ?? []);
      if (!wikitext) { skipped += targets.length; continue; }

      const fresh = section(wikitext, STEP_HEADINGS);
      for (const row of targets) {
        /*
         * Not "the same number of steps".
         *
         * Rendering the templates means a line that used to be dropped for holding a
         * brace now survives, so the count legitimately changes — and requiring it to
         * match skipped 190 of 241 recipes, most of them repairable. What must hold is
         * that this is the same method, so the words are compared instead: the repair
         * may add back a step it had lost, but may not swap in a different recipe.
         */
        if (!sameMethod(row.steps, fresh)) {
          skipped += 1;
          process.stdout.write("  skip (different method)  " + row.name + "\n");
          continue;
        }
        if (fresh.some((s) => WOUND.test(s))) { stillWounded += 1; continue; }
        const before = row.steps.find((s) => WOUND.test(s)) ?? '';
        const after = fresh[row.steps.indexOf(before)] ?? '';
        process.stdout.write(`  repaired  ${row.name}\n      ${JSON.stringify(before.slice(0, 58))}\n   -> ${JSON.stringify(after.slice(0, 58))}\n`);
        if (write) row.steps = fresh;
        repaired += 1;
      }
    }
  }

  process.stdout.write(`\n${repaired} repaired, ${stillWounded} still wounded upstream, ${skipped} skipped\n`);
  if (write && repaired) {
    await writeFile(PATH, writeRows(rows), 'utf8');
    process.stdout.write(`wrote ${PATH}\n`);
  }
  if (!write) process.stdout.write('\nReport only. Re-run with --write to apply.\n');
};

main().catch((error) => {
  process.stderr.write(`\nCookbook repair failed: ${error.message}\n`);
  process.exitCode = 1;
});

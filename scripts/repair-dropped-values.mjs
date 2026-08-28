/**
 * Put back the numbers and names the template stripper threw away.
 *
 * `clean()` in `enrich-infobox.mjs` deleted every `{{template}}` whole. Most of them
 * are citations and deserve it, but two kinds carry the words themselves:
 *
 *   - `{{convert|39|C}}` — a temperature, a capacity, an area. Erasing it turned a
 *     method into "heated in copper cauldrons over a wood fire to about ."
 *   - `{{lang|it|…}}`, `{{ill|…}}`, `{{tlit|…}}` — a name. Erasing it turned a cheese
 *     into "generally known as ." and a producer into "made by the , since 1990".
 *
 * A number that carries the technique and a name that carries the identity are the two
 * things this atlas is least able to lose, and it was losing both silently: the prose
 * still read as a sentence, so nothing looked broken enough to check.
 *
 * The stripper is fixed in `lib/mediawiki.mjs`. This pass repairs the records already
 * written, by fetching the wikitext again and re-running the *same* `preparationProse`
 * the enrichment uses — imported, not copied, so the repaired text cannot drift from
 * what a future enrichment run would produce.
 *
 * A record is only rewritten when the new summary is genuinely better: it must have no
 * gap left, and it must still be recognisably the same passage. Anything else is
 * reported and skipped, because a repair that quietly replaces one record's method with
 * another's is worse than the gap it was fixing.
 *
 *   node scripts/repair-dropped-values.mjs            # report only
 *   node scripts/repair-dropped-values.mjs --write    # apply
 */

import { readFile, writeFile } from 'node:fs/promises';
import { preparationProse } from './enrich-infobox.mjs';
import { VALUE_DROPPED, requestedTitles, writeRows } from './lib/mediawiki.mjs';

const FILES = ['catalogue.json', 'cuisines.json'];
const API = 'https://en.wikipedia.org/w/api.php';
const GAP = VALUE_DROPPED;

const titleOf = (row) => {
  const url = row?.url ?? '';
  const slug = url.split('/wiki/')[1];
  if (!slug) return '';
  try {
    return decodeURIComponent(slug).replace(/_/g, ' ');
  } catch {
    return slug.replace(/_/g, ' ');
  }
};

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

/**
 * Is this the same passage, only mended?
 *
 * Compared on words rather than characters, because the repair legitimately adds them.
 * A summary that shares most of its vocabulary with the old one is the same paragraph;
 * one that does not is a different section of the article, and taking it would be a
 * silent content swap rather than a repair.
 */
const samePassage = (before, after) => {
  const words = (t) => new Set(t.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);
  const old = words(before);
  if (!old.size) return false;
  const fresh = words(after);
  let shared = 0;
  for (const w of old) if (fresh.has(w)) shared += 1;
  return shared / old.size >= 0.6;
};

const main = async () => {
  const write = process.argv.includes('--write');

  for (const file of FILES) {
    const path = `src/data/${file}`;
    const rows = JSON.parse(await readFile(path, 'utf8'));

    const broken = rows.filter((r) => typeof r?.prepSummary === 'string' && GAP.test(r.prepSummary) && titleOf(r));
    process.stdout.write(`\n${file}: ${broken.length} summaries with a gap\n`);
    if (!broken.length) continue;

    const byTitle = new Map();
    for (const row of broken) {
      const title = titleOf(row);
      if (!byTitle.has(title)) byTitle.set(title, []);
      byTitle.get(title).push(row);
    }

    let repaired = 0, unchanged = 0, skipped = 0;

    for (const batch of chunk([...byTitle.keys()], 20)) {
    await sleep(1000);
      const data = await api({
        action: 'query', prop: 'revisions', rvprop: 'content', rvslots: 'main',
        redirects: '1', titles: batch.join('|'),
      });
      /* Redirects mean the answer's title is not always the title asked for. */
      const asked = requestedTitles(data);

      for (const page of data?.query?.pages ?? []) {
        const wikitext = page?.revisions?.[0]?.slots?.main?.content;
        if (!wikitext) continue;
        const targets = (asked.get(page.title) ?? [page.title]).flatMap((t) => byTitle.get(t) ?? []);

        const fresh = preparationProse(wikitext);
        for (const row of targets) {
          if (!fresh) { skipped += 1; process.stdout.write(`  skip (no prose)   ${row.name}\n`); continue; }
          if (GAP.test(fresh)) { unchanged += 1; process.stdout.write(`  still gapped      ${row.name}\n`); continue; }
          if (!samePassage(row.prepSummary, fresh)) { skipped += 1; process.stdout.write(`  skip (different)  ${row.name}\n`); continue; }
          process.stdout.write(`  repaired          ${row.name}\n`);
          const gapAt = row.prepSummary.search(GAP);
          process.stdout.write(`      was: …${row.prepSummary.slice(Math.max(0, gapAt - 40), gapAt + 12)}…\n`);
          if (write) row.prepSummary = fresh;
          repaired += 1;
        }
      }
    }

    process.stdout.write(`  ${repaired} repaired, ${unchanged} still gapped upstream, ${skipped} skipped\n`);
    if (write && repaired) {
      await writeFile(path, writeRows(rows), 'utf8');
      process.stdout.write(`  wrote ${path}\n`);
    }
  }

  if (!write) process.stdout.write('\nReport only. Re-run with --write to apply.\n');
};

main().catch((error) => {
  process.stderr.write(`\nRepair failed: ${error.message}\n`);
  process.exitCode = 1;
});

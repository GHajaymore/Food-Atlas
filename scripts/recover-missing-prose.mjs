/**
 * Fetch the method again for records that ended up with none.
 *
 * 9,219 records carry no `prepSummary`. Most of them honestly have none — a GI or PAT
 * register entry is a name, a place and a legal reference, with no article behind it, and
 * 5,713 of those have no URL to re-read at all.
 *
 * The rest are worth asking about again, because three faults in `clean()` were throwing
 * whole passages away rather than damaging them:
 *
 *   - templates stripped with a regex that cannot see a template inside a template,
 *     leaving a bare `}}`; prose holding a stray brace is then rejected entirely
 *   - image links matched with a negated class, so a caption containing a link of its own
 *     ended the match early and left a pipe behind
 *   - `<gallery>` blocks, whose files are listed bare with no brackets to count
 *
 * Parmesan lost a 3,277-character production section to the last of those and showed no
 * method at all. All three are fixed; this asks the questions again.
 *
 * ## What it will not do
 *
 * Only ever *adds*. A record that already has a summary is never touched, so this cannot
 * overwrite anything a person or an earlier pass got right — the worst case is that it
 * finds nothing and writes nothing.
 *
 * Prose is accepted only if `preparationProse` returns it, which already refuses anything
 * under 120 characters or holding markup it did not understand. Nothing here relaxes that.
 *
 *   node scripts/recover-missing-prose.mjs --limit 60     # sample, report only
 *   node scripts/recover-missing-prose.mjs --write        # the whole run
 */

import { readFile, writeFile } from 'node:fs/promises';
import { preparationProse } from './enrich-infobox.mjs';
import { requestedTitles, writeRows } from './lib/mediawiki.mjs';

const FILES = ['catalogue.json', 'cuisines.json'];
const API = 'https://en.wikipedia.org/w/api.php';

const titleOf = (row) => {
  const slug = (row?.url ?? '').split('/wiki/')[1];
  if (!slug) return '';
  try {
    return decodeURIComponent(slug).replace(/_/g, ' ');
  } catch {
    return slug.replace(/_/g, ' ');
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Polite, and treating a non-JSON body as an error rather than as an empty answer. */
const api = async (params, attempt = 1) => {
  const url = API + '?' + new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  const response = await fetch(url, {
    headers: { 'User-Agent': 'WikiFoodia/1.0 (https://wikifoodia.ajailabs.app) prose recovery' },
  });
  const body = await response.text();
  try {
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return JSON.parse(body);
  } catch (error) {
    if (attempt > 4) throw new Error('gave up after ' + attempt + ' tries: ' + body.slice(0, 80));
    await sleep(2000 * 2 ** (attempt - 1));
    return api(params, attempt + 1);
  }
};

const chunk = (list, size) =>
  Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, i * size + size));

const main = async () => {
  const write = process.argv.includes('--write');
  const limitAt = process.argv.indexOf('--limit');
  const limit = limitAt > -1 ? Number(process.argv[limitAt + 1]) : 0;

  let asked = 0;
  let found = 0;

  for (const file of FILES) {
    const path = 'src/data/' + file;
    const rows = JSON.parse(await readFile(path, 'utf8'));

    const missing = rows.filter((r) => (!r.prepSummary || !String(r.prepSummary).trim()) && titleOf(r));
    const targets = limit ? missing.slice(0, limit) : missing;
    process.stdout.write(
      '\n' + file + ': ' + missing.length + ' records with no method and an article to read' +
        (limit ? ' (sampling ' + targets.length + ')' : '') + '\n',
    );
    if (!targets.length) continue;

    const byTitle = new Map();
    for (const row of targets) {
      const title = titleOf(row);
      if (!byTitle.has(title)) byTitle.set(title, []);
      byTitle.get(title).push(row);
    }

    let recovered = 0;
    let batches = 0;

    for (const batch of chunk([...byTitle.keys()], 20)) {
      await sleep(700);
      batches += 1;
      if (batches % 25 === 0) process.stdout.write('  …' + batches + ' batches, ' + recovered + ' recovered\n');

      let data;
      try {
        data = await api({
          action: 'query',
          prop: 'revisions',
          rvprop: 'content',
          rvslots: 'main',
          redirects: '1',
          titles: batch.join('|'),
        });
      } catch (error) {
        process.stdout.write('  batch failed (' + error.message + ')\n');
        continue;
      }

      /* The title that comes back is not the title asked for: MediaWiki normalises
         capitalisation, then follows redirects, and reports both. */
      const answered = requestedTitles(data);

      for (const page of data?.query?.pages ?? []) {
        const wikitext = page?.revisions?.[0]?.slots?.main?.content;
        if (!wikitext) continue;
        const owners = (answered.get(page.title) ?? [page.title]).flatMap((t) => byTitle.get(t) ?? []);

        const prose = preparationProse(wikitext);
        if (!prose) continue;

        for (const row of owners) {
          /* Never overwrite. This pass exists to fill holes, not to revise anything. */
          if (row.prepSummary && String(row.prepSummary).trim()) continue;
          if (recovered < 8) {
            process.stdout.write('  recovered  ' + (row.name ?? row.title) + '\n      ' + JSON.stringify(prose.slice(0, 90)) + '\n');
          }
          if (write) row.prepSummary = prose;
          recovered += 1;
        }
      }
    }

    asked += targets.length;
    found += recovered;
    process.stdout.write('  ' + recovered + ' of ' + targets.length + ' recovered\n');

    if (write && recovered) {
      await writeFile(path, writeRows(rows), 'utf8');
      process.stdout.write('  wrote ' + path + '\n');
    }
  }

  const rate = asked ? Math.round((found / asked) * 100) : 0;
  process.stdout.write('\n' + found + ' of ' + asked + ' asked (' + rate + '%)\n');
  if (!write) process.stdout.write('Report only. Re-run with --write to apply.\n');
};

main().catch((error) => {
  process.stderr.write('\nProse recovery failed: ' + error.message + '\n');
  process.exitCode = 1;
});

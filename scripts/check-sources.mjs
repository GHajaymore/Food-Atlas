/**
 * Has anything changed at the source?
 *
 *   node scripts/check-sources.mjs --country India
 *   node scripts/check-sources.mjs --dish "Kozhikode Halwa"
 *   node scripts/check-sources.mjs --all --limit 500
 *   node scripts/check-sources.mjs --all --baseline      # first run only
 *
 * The atlas was built by scraping wikis, and wikis are edited. 13,000 of its records
 * point at a Wikipedia or Wikibooks page whose content has moved on since the day it was
 * read, and nothing here has ever noticed. This is the cheap half of noticing.
 *
 * ## Why revision ids rather than re-reading the articles
 *
 * Re-fetching 13,000 extracts to find the fifty that changed is thousands of requests
 * for an answer that is almost entirely "no". MediaWiki's `prop=info` returns
 * `lastrevid` for **50 titles in one request**, so asking the whole atlas what it is
 * currently at costs a few hundred requests and a couple of minutes. Only what actually
 * moved needs its content read, and that is a different script.
 *
 * ## It reports. It does not apply.
 *
 * Nothing here rewrites a record's prose, and that is deliberate rather than
 * unfinished. **A Wikipedia edit can be vandalism**, and an atlas whose whole value is
 * that it does not propagate garbage cannot have a job that pulls whatever a page says
 * today straight into 18,008 records overnight. What it writes is the *revision number*
 * so drift is visible; a person decides what to do about it.
 *
 * ## The baseline is approximate exactly once, and says so
 *
 * No source file records which revision its content came from — the ingests never
 * stored it. So the first run has nothing to compare against and records whatever the
 * page is at now, which silently accepts any edit made between the original ingest and
 * that run. That inaccuracy is one-time and bounded, it is the only way to start
 * without re-reading everything, and `--baseline` is required to make it happen so
 * nobody does it by accident on a file that already has revisions.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { requestedTitles, writeRows } from './lib/mediawiki.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * `src/data`, not `public/data`.
 *
 * The distinction cost nothing to find and would have cost the whole pass: `public/data`
 * is *generated*. `compact-data.mjs` reads `src/data/*.json`, strips it to the fields the
 * app reads, and writes the result to both `src/data/*.min.json` and `public/data`. A
 * revision written to the published copy survives exactly until the next compaction and
 * then vanishes, with every run reporting success.
 *
 * `rev` is bookkeeping, so it belongs here alongside `urlChecked`, `imageChecked` and
 * `countryChecked` — and the `KEEP` filter in `compact-data.mjs` drops it from what the
 * app fetches, which is right. A reader has no use for a revision id.
 */
const DATA = resolve(HERE, '../src/data');

const USER_AGENT = 'WikiFoodia/1.0 (source freshness check; contact: via repository)';

/** MediaWiki's own cap for a multi-title query without an API allowance. */
const PER_REQUEST = 50;

/**
 * Where each source's rows point, and how to read a title out of one.
 *
 * `cuisines` and `cookbook` carry the wiki title verbatim, which is the identifier and
 * is what should be asked with. `catalogue` carries only a URL, so its title is decoded
 * out of the path — and decoding matters: `Cookbook%3AA_Nice_Cup_of_Tea` is one page and
 * `Cookbook%253A...` is a request for a page that does not exist.
 */
const SOURCES = [
  { file: 'catalogue', title: (row) => titleFromUrl(row.url) },
  { file: 'cuisines', title: (row) => row.title || titleFromUrl(row.url) },
  { file: 'cookbook', title: (row) => row.title || titleFromUrl(row.url) },
];

function titleFromUrl(url) {
  if (!url) return '';
  try {
    const path = new URL(url).pathname;
    const slug = path.startsWith('/wiki/') ? path.slice(6) : '';
    return slug ? decodeURIComponent(slug).replace(/_/g, ' ') : '';
  } catch {
    return '';
  }
}

const hostOf = (url) => {
  try {
    return new URL(url).host;
  } catch {
    return '';
  }
};

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? null : (process.argv[i + 1] ?? '');
};
const has = (name) => process.argv.includes(`--${name}`);

/**
 * Ask one wiki what fifty pages are currently at.
 *
 * `Retry-After` is obeyed as given rather than escalated. Inventing exponential backoff
 * against Wikimedia once turned a four-second pause into an hour-long stall and cost six
 * batches — they publish the number they want and they mean it.
 */
async function currentRevisions(host, titles) {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'info',
    titles: titles.join('|'),
    redirects: '1',
    format: 'json',
    formatversion: '1',
  });

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(`https://${host}/w/api.php?${params}`, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(60000),
    });

    if (response.status === 429 || response.status === 503) {
      const wait = Number(response.headers.get('Retry-After') ?? 5);
      process.stdout.write(`  rate limited, waiting ${wait}s\n`);
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status} from ${host}`);

    const data = await response.json();
    const back = requestedTitles(data);
    const out = new Map();

    for (const page of Object.values(data?.query?.pages ?? {})) {
      /* A page that has been deleted or moved without a redirect. Reported, never
       * treated as unchanged — a record pointing at nothing is worth knowing about. */
      const revision = page.missing !== undefined ? 'missing' : String(page.lastrevid ?? '');
      for (const asked of back.get(page.title) ?? [page.title]) out.set(asked, revision);
    }
    return out;
  }
  throw new Error(`${host} kept rate limiting; stopping rather than hammering it`);
}

const chunk = (list, size) =>
  Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, i * size + size));

/**
 * Check a scope and report what moved.
 *
 * Exported so `drain-refresh.mjs` can run exactly this rather than a second
 * implementation of it. Two ways to decide whether a record is stale is two answers to
 * the same question, and the day they disagree neither is trustworthy.
 *
 * Returns the counts and the lines rather than printing them, so the caller decides
 * whether they go to a terminal or back to the queue.
 */
export async function checkSources({ dish = '', country = '', all = false, baseline = false, limit = Infinity } = {}) {
  if (!country && !dish && !all) {
    throw new Error('Pick a scope: dish, country, or all.');
  }

  const fold = (s) => (s ?? '').toLowerCase().trim();
  let checked = 0;
  let changed = 0;
  let recorded = 0;
  let missing = 0;
  /*
   * Rows with nothing to compare against.
   *
   * Counted separately because folding them into "unchanged" reports a clean bill of
   * health for records that were never actually checked. The first run of this script
   * printed "0 have been edited" for a record it had skipped entirely, which is the one
   * kind of lie it exists to prevent.
   */
  let unbaselined = 0;
  const report = [];

  for (const source of SOURCES) {
    const path = resolve(DATA, `${source.file}.json`);
    const rows = JSON.parse(await readFile(path, 'utf8'));

    const selected = rows.filter((row) => {
      if (dish && fold(row.name) !== fold(dish)) return false;
      if (country && fold(row.country) !== fold(country)) return false;
      return Boolean(source.title(row)) && Boolean(hostOf(row.url));
    });

    if (!selected.length) continue;

    /* Grouped by wiki, because a title is only meaningful to the wiki it came from and
     * a batch may not mix them. */
    const byHost = new Map();
    for (const row of selected.slice(0, limit)) {
      const host = hostOf(row.url);
      byHost.set(host, [...(byHost.get(host) ?? []), row]);
    }

    let touched = false;

    for (const [host, hostRows] of byHost) {
      const byTitle = new Map();
      for (const row of hostRows) {
        const title = source.title(row);
        byTitle.set(title, [...(byTitle.get(title) ?? []), row]);
      }

      const titles = [...byTitle.keys()];
      process.stdout.write(`${source.file}: ${titles.length} pages at ${host}\n`);

      for (const batch of chunk(titles, PER_REQUEST)) {
        const now = await currentRevisions(host, batch);

        for (const [title, revision] of now) {
          for (const row of byTitle.get(title) ?? []) {
            checked += 1;

            if (revision === 'missing') {
              missing += 1;
              report.push(`  GONE     ${row.name} — ${title} no longer exists at ${host}`);
              continue;
            }
            if (!row.rev) {
              if (baseline) {
                row.rev = revision;
                recorded += 1;
                touched = true;
              } else {
                unbaselined += 1;
              }
              continue;
            }
            if (row.rev !== revision) {
              changed += 1;
              report.push(`  CHANGED  ${row.name} — https://${host}/wiki/${encodeURIComponent(title)}`);
            }
          }
        }
      }
    }

    if (touched) await writeFile(path, writeRows(rows), 'utf8');
  }

  return { checked, changed, missing, unbaselined, recorded, report };
}

/** One line, for the queue. What an administrator needs to know without a terminal. */
export const summarise = (r) =>
  r.checked === 0
    ? 'Nothing matched — no record of that name with a wiki article.'
    : `${r.checked} checked, ${r.changed} edited since the atlas read them` +
      (r.missing ? `, ${r.missing} now missing` : '') +
      (r.unbaselined ? `, ${r.unbaselined} with no baseline to compare` : '') +
      '.';

const main = async () => {
  const result = await checkSources({
    dish: arg('dish') ?? '',
    country: arg('country') ?? '',
    all: has('all'),
    baseline: has('baseline'),
    limit: Number(arg('limit') ?? 0) || Infinity,
  });

  const { checked, changed, missing, unbaselined, recorded, report } = result;

  process.stdout.write(
    `\n${checked} records checked.\n` +
      (has('baseline') ? `${recorded} revisions recorded as the baseline.\n` : '') +
      `${changed} have been edited since the atlas read them.\n` +
      `${missing} point at a page that no longer exists.\n` +
      (unbaselined
        ? `${unbaselined} could not be checked — no recorded revision to compare against.\n`
        : '') +
      (report.length ? `\n${report.slice(0, 60).join('\n')}\n` : '') +
      (report.length > 60 ? `  …and ${report.length - 60} more\n` : '') +
      (!has('baseline') && checked && unbaselined === checked
        ? '\nNone of these has a baseline. Run once with --baseline to record where they are now.\n'
        : '') +
      '\nNothing was rewritten. This reports drift; what to do about it is a decision.\n',
  );
};

/*
 * Only when run directly. Importing this file — which `drain-refresh.mjs` does — must
 * not kick off a scan of the whole atlas as a side effect.
 */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`\nSource check failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}

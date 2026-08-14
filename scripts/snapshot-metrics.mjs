/**
 * Record where the atlas stands today.
 *
 *   node scripts/snapshot-metrics.mjs
 *
 * Trend needs history, and the app has no database. So each run appends one dated
 * entry to src/data/metrics-history.json, which ships with the app and is versioned
 * by git. No server, no storage bill, and the history cannot drift from the build it
 * describes because it travels inside it.
 *
 * Run it after an ingest or an enrichment pass — those are the moments the numbers
 * actually move. Running it twice in a day overwrites that day's entry rather than
 * stacking duplicates, so a trend line always means one point per day.
 *
 * The counts here are deliberately the primitive ones, computed straight from the
 * catalogue files. `__tests__` asserts they agree with `catalogueMetrics`, so the
 * script and the app cannot quietly diverge on what "documented" means.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CATALOGUE = resolve(HERE, '../src/data/catalogue.json');
const CUISINES = resolve(HERE, '../src/data/cuisines.json');
const COOKBOOK = resolve(HERE, '../src/data/cookbook.json');
const HISTORY = resolve(HERE, '../src/data/metrics-history.json');

const readJson = async (path) => {
  try {
    const parsed = JSON.parse(await readFile(path, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Mirrors `hasSomethingToShow` in src/data/catalogue.ts — held-back rows are not shown. */
const isShown = (row) =>
  !!(row.blurb && row.blurb.trim()) ||
  !!(row.evidence && row.evidence.ingredients && row.evidence.ingredients.length) ||
  !!(row.evidence && row.evidence.heritage && row.evidence.heritage.length) ||
  !!(row.evidence && row.evidence.hasArticle) ||
  !!row.photo;

/** The six curated records carry a method; imported ones do not until enriched. */
const CURATED_COUNT = 7;

const main = async () => {
  // The catalogue is three sources now, and counting only the first made the
  // snapshot report 7,877 while the app showed 13,791.
  const wikidata = (await readJson(CATALOGUE)).filter(isShown);
  const cuisines = await readJson(CUISINES);
  const cookbook = (await readJson(COOKBOOK)).filter((r) => r.country && r.steps?.length);

  const rows = [...wikidata, ...cuisines, ...cookbook];
  const countries = new Set(rows.map((r) => r.country).filter(Boolean));

  const snapshot = {
    date: new Date().toISOString().slice(0, 10),
    total: rows.length + CURATED_COUNT,
    countries: countries.size,
    // Cookbook recipes carry ordered steps; the other sources carry prose at best.
    documented: cookbook.length + CURATED_COUNT,
    illustrated: rows.filter((r) => r.photo).length + CURATED_COUNT,
    located: rows.filter((r) => r.region).length + CURATED_COUNT,
  };

  let history = [];
  try {
    history = JSON.parse(await readFile(HISTORY, 'utf8'));
    if (!Array.isArray(history)) history = [];
  } catch {
    history = [];
  }

  // One point per day: re-running replaces today rather than stacking duplicates.
  const kept = history.filter((h) => h.date !== snapshot.date);
  kept.push(snapshot);
  kept.sort((a, b) => a.date.localeCompare(b.date));

  await writeFile(HISTORY, JSON.stringify(kept, null, 2) + '\n', 'utf8');

  process.stdout.write(`Snapshot ${snapshot.date}\n`);
  for (const [k, v] of Object.entries(snapshot)) {
    if (k !== 'date') process.stdout.write(`  ${k.padEnd(12)} ${v}\n`);
  }
  process.stdout.write(
    kept.length < 2
      ? '\nOne snapshot on record — no trend yet. A direction needs two points.\n'
      : `\n${kept.length} snapshots on record.\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nSnapshot failed: ${error.message}\n`);
  process.exitCode = 1;
});

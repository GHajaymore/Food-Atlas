/**
 * The photograph on the recipe's own page.
 *
 *   node scripts/enrich-recipe-images.mjs [--dry] [--limit 500]
 *
 * 4,320 recipes have a method and no picture, and searching Commons for their names
 * has already been tried on every one of them. That pass is finished; re-running it
 * would find nothing.
 *
 * This asks a different question. A Commons search guesses which of eighty million
 * files might show a dish. A recipe page either has a photograph on it or does not,
 * and if it does, somebody put it there to illustrate *that recipe*. It is the same
 * argument that made an article's lead image better than a name search, applied to
 * the cookbooks: identity rather than resemblance.
 *
 * The rate is lower — 18 in 100 pages carry one, against roughly 40 for a search —
 * and that is the trade. Fewer pictures, and no need for the plausibility guard that
 * the search results require, because there is nothing to be plausible about.
 *
 * ## What is refused
 *
 * A recipe page carries more than photographs: navigation icons, licence badges,
 * flags, the wiki's own logos. Those are filtered by name, and anything that is not
 * a bitmap is refused outright — a diagram of a knife cut is not a picture of dinner.
 *
 * Licensing is unchanged: the artist and licence are read from the file's own page
 * and stored with it, because attribution is a condition of use on most of them.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const COOKBOOK = resolve(HERE, '../src/data/cookbook.json');

const USER_AGENT = 'GlobalTaste/1.0 (recipe page images; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const retryAfter = (res, attempt) => {
  const header = Number(res.headers.get('retry-after'));
  return Number.isFinite(header) && header > 0 ? header * 1000 + 250 : 2000 * attempt;
};

const strip = (html) => (html ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/**
 * Files that are furniture rather than food.
 *
 * Every wiki decorates its pages with the same handful of icons, and a recipe whose
 * "photograph" is a padlock or a licence badge is worse than one with no picture at
 * all — the shelves would show it as though it were dinner.
 */
const FURNITURE =
  /wiki|commons-logo|crystal|nuvola|gnome|ambox|symbol|icon|emblem|flag[ _]of|padlock|edit-|question|information|disambig|stub|cscr|featured|printer|nopage|translation|speaker|loudspeaker|star|arrow/i;

/** Only raster photographs. A diagram of a knife cut is not a picture of dinner. */
const PHOTOGRAPH = /\.(jpe?g|png|webp|tiff?)$/i;

/**
 * The images on up to twenty pages, with each file's URL, artist and licence.
 *
 * `generator=images` resolves through to the file itself, which matters because a
 * cookbook page may use a file hosted on its own wiki or one on Commons, and the
 * caller should not have to know which.
 */
async function pageImages(lang, titles, attempt = 1) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    titles: titles.join('|'),
    prop: 'images',
    imlimit: '30',
  });

  try {
    const res = await fetch(`https://${lang}.wikibooks.org/w/api.php?${params}`, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(30000),
    });
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 5) return new Map();
      await sleep(retryAfter(res, attempt));
      return pageImages(lang, titles, attempt + 1);
    }
    if (!res.ok) return new Map();

    const data = await res.json();
    const out = new Map();
    for (const page of data?.query?.pages ?? []) {
      const files = (page.images ?? [])
        .map((i) => i.title)
        .filter((t) => PHOTOGRAPH.test(t) && !FURNITURE.test(t));
      if (files.length) out.set(page.title, files[0]);
    }
    return out;
  } catch {
    return new Map();
  }
}

/** URL, artist and licence for up to fifty files, from the wiki that resolves them. */
async function fileDetails(lang, files, attempt = 1) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    titles: files.join('|'),
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '900',
  });

  try {
    const res = await fetch(`https://${lang}.wikibooks.org/w/api.php?${params}`, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(30000),
    });
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 5) return new Map();
      await sleep(retryAfter(res, attempt));
      return fileDetails(lang, files, attempt + 1);
    }
    if (!res.ok) return new Map();

    const data = await res.json();
    const out = new Map();
    for (const page of data?.query?.pages ?? []) {
      const info = page?.imageinfo?.[0];
      if (!info?.thumburl) continue;
      out.set(page.title, {
        photo: info.thumburl,
        credit: strip(info.extmetadata?.Artist?.value) || 'Wikimedia',
        licence: strip(info.extmetadata?.LicenseShortName?.value) || 'see file page',
      });
    }
    return out;
  } catch {
    return new Map();
  }
}

/** Re-read, apply, write — never writes an in-memory snapshot over the file. */
async function mergeWrite(path, updates) {
  const current = JSON.parse(await readFile(path, 'utf8'));
  const byTitle = new Map(current.map((r) => [r.title, r]));
  for (const [title, patch] of updates) {
    const existing = byTitle.get(title);
    if (existing) Object.assign(existing, patch);
  }
  await writeFile(path, JSON.stringify([...byTitle.values()]), 'utf8');
}

const titleFrom = (url) => {
  try {
    return decodeURIComponent((url ?? '').split('/wiki/')[1] ?? '').replace(/_/g, ' ');
  } catch {
    return null;
  }
};

const main = async () => {
  const dry = process.argv.includes('--dry');
  const i = process.argv.indexOf('--limit');
  const limit = i > -1 ? Number(process.argv[i + 1]) : 0;

  const rows = JSON.parse(await readFile(COOKBOOK, 'utf8'));
  const pending = rows.filter((r) => !r.photo && r.url && !r.pageImageChecked);
  const targets = limit ? pending.slice(0, limit) : pending;
  process.stdout.write(`${targets.length} recipes with a method and no picture.\n`);

  const byLanguage = new Map();
  for (const row of targets) {
    const lang = row.sourceLanguage || 'en';
    if (!byLanguage.has(lang)) byLanguage.set(lang, []);
    byLanguage.get(lang).push(row);
  }

  const updates = new Map();
  let found = 0;

  for (const [lang, group] of byLanguage) {
    process.stdout.write(`\n${lang}: ${group.length} recipes\n`);

    for (let start = 0; start < group.length; start += 20) {
      const batch = group.slice(start, start + 20);
      const byPage = new Map();
      for (const row of batch) {
        const title = titleFrom(row.url);
        if (title) byPage.set(title, row);
      }

      const images = byPage.size ? await pageImages(lang, [...byPage.keys()]) : new Map();
      const details = images.size ? await fileDetails(lang, [...new Set(images.values())]) : new Map();

      for (const [page, row] of byPage) {
        const patch = { pageImageChecked: true };
        const file = images.get(page);
        const detail = file ? details.get(file) : null;

        if (detail) {
          Object.assign(patch, detail);
          found += 1;
        }
        if (!dry) Object.assign(row, patch);
        updates.set(row.title, patch);
      }

      if (!dry) await mergeWrite(COOKBOOK, updates);
      process.stdout.write(`  ${Math.min(start + 20, group.length)}/${group.length} — ${found} photographs\n`);
      await sleep(400);
    }
  }

  if (!dry) await mergeWrite(COOKBOOK, updates);
  const fresh = JSON.parse(await readFile(COOKBOOK, 'utf8'));
  process.stdout.write(
    `\n${found} photographs taken from the recipes' own pages.\n` +
      `  ${fresh.filter((r) => r.photo).length} of ${fresh.length} recipes now have one.\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nRecipe image pass failed: ${error.message}\n`);
  process.exitCode = 1;
});

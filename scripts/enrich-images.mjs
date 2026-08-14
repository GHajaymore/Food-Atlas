/**
 * Photographs, from Wikimedia Commons.
 *
 *   node scripts/enrich-images.mjs [--limit 2000]
 *
 * Roughly 10,800 of 13,855 records have no image. Food is a visual subject, and a
 * long list of text rows is unbrowsable no matter how it is laid out — the missing
 * pictures are a navigation problem as much as an aesthetic one.
 *
 * Wikidata only surfaces an image where someone attached one to the item. Commons
 * itself holds far more: a search for each dish by name hit on 10 of 10 in testing,
 * every result openly licensed.
 *
 * **Every image found this way is marked unverified, and that is not a formality.**
 * A search returns a plausible match, not a confirmed one — "Al-Man'ouché" returned
 * an Israeli zaatar manakeesh, which is a related bread from a different place. In
 * an app whose subject is provenance, a picture that is nearly right is a claim that
 * is wrong, so the record says the photo's origin is unconfirmed and the attribution
 * travels with it.
 *
 * Licensing: Commons files carry their own terms, several CC BY-SA, so the artist
 * and licence are stored and displayed wherever the image appears.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CUISINES = resolve(HERE, '../src/data/cuisines.json');

const API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'GlobalTaste/1.0 (food atlas ingest; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const strip = (html) => (html ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/**
 * Find one image for a dish.
 *
 * `filetype:bitmap` keeps out diagrams and svg logos; namespace 6 is the File space.
 * One result only — a second-choice image is a worse guess, not a better one.
 */
async function findImage(name, country, attempt = 1) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    generator: 'search',
    // The country narrows a generic dish name towards the right tradition.
    gsrsearch: `${name} ${country} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '1',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '900',
  });

  try {
    const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': USER_AGENT } });
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 4) return null;
      await sleep(4000 * attempt);
      return findImage(name, country, attempt + 1);
    }
    if (!res.ok) return null;

    const data = await res.json();
    const page = data?.query?.pages?.[0];
    const info = page?.imageinfo?.[0];
    if (!info?.thumburl) return null;

    return {
      photo: info.thumburl,
      credit: strip(info.extmetadata?.Artist?.value) || 'Wikimedia Commons',
      licence: strip(info.extmetadata?.LicenseShortName?.value) || 'see Commons',
      file: page.title,
    };
  } catch {
    return null;
  }
}

async function mergeWrite(path, updates) {
  let current = [];
  try {
    current = JSON.parse(await readFile(path, 'utf8'));
  } catch {
    current = [];
  }
  const byTitle = new Map(current.map((r) => [r.title, r]));
  for (const [title, patch] of updates) {
    const existing = byTitle.get(title);
    if (existing) Object.assign(existing, patch);
  }
  await writeFile(path, JSON.stringify([...byTitle.values()]), 'utf8');
  return byTitle.size;
}

const main = async () => {
  const limitArg = process.argv.indexOf('--limit');
  const limit = limitArg > -1 ? Number(process.argv[limitArg + 1]) : 0;

  const rows = JSON.parse(await readFile(CUISINES, 'utf8'));
  const byTitle = new Map(rows.map((r) => [r.title, r]));

  const pending = rows.filter((r) => !r.photo && !r.imageChecked);
  const targets = limit ? pending.slice(0, limit) : pending;
  process.stdout.write(`${rows.length} rows, ${targets.length} without an image.\n`);

  const updates = new Map();
  let found = 0;

  for (const [i, row] of targets.entries()) {
    const image = await findImage(row.name, row.country ?? '');
    const patch = { imageChecked: true };

    if (image) {
      patch.photo = image.photo;
      patch.credit = image.credit;
      patch.licence = image.licence;
      found += 1;
    }

    Object.assign(byTitle.get(row.title) ?? {}, patch);
    updates.set(row.title, patch);

    if (i % 100 === 0) {
      process.stdout.write(`  ${i}/${targets.length} — ${found} images found\n`);
      await mergeWrite(CUISINES, updates);
    }
    await sleep(350);
  }

  await mergeWrite(CUISINES, updates);
  const fresh = JSON.parse(await readFile(CUISINES, 'utf8'));
  process.stdout.write(
    `\n${found} images found this run.\n` +
      `  ${fresh.filter((r) => r.photo).length} of ${fresh.length} rows now have one.\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nImage enrichment failed: ${error.message}\n`);
  process.exitCode = 1;
});

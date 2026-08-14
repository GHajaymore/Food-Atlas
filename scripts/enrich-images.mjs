/**
 * Photographs, from Wikimedia Commons.
 *
 *   node scripts/enrich-images.mjs [--file cuisines|cookbook|unesco|catalogue] [--limit 2000]
 *
 * Roughly 10,800 of 13,855 records have no image. Food is a visual subject, and a
 * long list of text rows is unbrowsable no matter how it is laid out — the missing
 * pictures are a navigation problem as much as an aesthetic one.
 *
 * Since the home screen stopped showing records without a picture, this is no longer
 * only a matter of polish: an unphotographed record cannot reach a shelf at all, so
 * whole shelves disappear until their sources are enriched. The Cookbook file is the
 * one to care about — it holds every record with a written method, which is to say
 * every recipe, which is the thing the app is for.
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
const dataFile = (name) => resolve(HERE, `../src/data/${name}.json`);

/**
 * The four sources, each with the field that identifies a row uniquely.
 *
 * They were ingested by different scripts and never agreed on a key, so rather than
 * migrate them the merge just needs to be told which field to match on.
 */
const TARGETS = {
  cuisines: { path: dataFile('cuisines'), key: 'title' },
  cookbook: { path: dataFile('cookbook'), key: 'title' },
  unesco: { path: dataFile('unesco'), key: 'reference' },
  catalogue: { path: dataFile('catalogue'), key: 'id' },
};

const API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'GlobalTaste/1.0 (food atlas ingest; contact: via repository)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const strip = (html) => (html ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/**
 * Words that describe a heritage listing rather than a food, and so must never be
 * the thing a filename is matched on. UNESCO titles are sentences — "Artisanal
 * know-how and culture of baguette bread" — and without this the shared word is
 * "culture" and every inscription matches every other one.
 */
const STOPWORDS = new Set([
  'and', 'the', 'of', 'in', 'its', 'associated', 'practices', 'practice', 'traditional', 'traditions',
  'knowledge', 'know', 'how', 'skills', 'culture', 'cultural', 'social', 'making', 'preparation',
  'related', 'techniques', 'craft', 'art', 'artisanal', 'culinary', 'festive', 'meanings', 'processing',
  'cultivating', 'consumption', 'emblematic', 'food', 'dish', 'cooking', 'cuisine', 'recipe',
]);

/** Distinctive words in a name, lowercased and stripped of accents and punctuation. */
const tokens = (text) =>
  new Set(
    (text ?? '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 4 && !STOPWORDS.has(w)),
  );

/**
 * Does this file plausibly show this dish?
 *
 * Commons search will always return *something*, and for a record whose name is a
 * sentence rather than a dish it returns nonsense with confidence: a French baguette
 * inscription came back illustrated with Macedonian ajvar, and Al-Man'ouché with an
 * Israeli zaatar manakeesh. In an app about provenance a picture that is nearly right
 * is a claim that is wrong, and `photoVerified: false` in small text does not undo a
 * photograph of the wrong country's food.
 *
 * So the filename has to share a distinctive word with the record. This rejects good
 * matches too — a correct Arabic-titled harissa photograph does not share a Latin
 * word with "Harissa" — and that trade is deliberate. A missing picture costs a card;
 * a confidently wrong one costs the reader's trust in every other card.
 */
function plausible(name, fileTitle) {
  const wanted = tokens(name);
  if (!wanted.size) return false;
  const found = tokens(fileTitle);
  for (const word of wanted) if (found.has(word)) return true;
  return false;
}

/**
 * Find one image for a dish.
 *
 * `filetype:bitmap` keeps out diagrams and svg logos; namespace 6 is the File space.
 *
 * Several results are asked for, not one, because the first hit is often the least
 * plausible: the search ranks on the whole descriptive phrase, so an inscription
 * title matches an essay about culture before it matches a photograph of the food.
 * The first candidate whose filename actually names the dish is taken, and if none
 * do, none is taken.
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
    gsrlimit: '8',
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
    // `generator=search` does not preserve rank in the page list, so restore it.
    const pages = [...(data?.query?.pages ?? [])].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    const page = pages.find((p) => p?.imageinfo?.[0]?.thumburl && plausible(name, p.title));
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

/**
 * Re-read, apply, write.
 *
 * Never writes an in-memory snapshot over the file. Two enrichment passes have been
 * lost that way already: a script held the whole array from startup, another script
 * added fields meanwhile, and the first one's write erased them. Re-reading here
 * costs a few hundred milliseconds every hundred rows and makes concurrent passes
 * safe, which is the only reason several can run against different files at once.
 */
async function mergeWrite(path, key, updates) {
  let current = [];
  try {
    current = JSON.parse(await readFile(path, 'utf8'));
  } catch {
    current = [];
  }
  const byKey = new Map(current.map((r) => [r[key], r]));
  for (const [id, patch] of updates) {
    const existing = byKey.get(id);
    if (existing) Object.assign(existing, patch);
  }
  await writeFile(path, JSON.stringify([...byKey.values()]), 'utf8');
  return byKey.size;
}

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : fallback;
};

const main = async () => {
  const name = arg('--file', 'cuisines');
  const target = TARGETS[name];
  if (!target) {
    throw new Error(`unknown --file ${name}; expected one of ${Object.keys(TARGETS).join(', ')}`);
  }
  const limit = Number(arg('--limit', 0));

  const rows = JSON.parse(await readFile(target.path, 'utf8'));
  const byKey = new Map(rows.map((r) => [r[target.key], r]));

  /**
   * Re-judge images written before the plausibility guard existed, and drop the ones
   * that fail it. Runs offline — the filename is already on the row, so no request
   * is needed to decide a picture never belonged there.
   */
  if (process.argv.includes('--recheck')) {
    const cleared = new Map();
    for (const row of rows.filter((r) => r.photo)) {
      const file = decodeURIComponent(row.photo.split('/').pop() ?? '').replace(/^\d+px-/, '');
      if (plausible(row.name, file)) continue;
      cleared.set(row[target.key], { photo: '', credit: '', licence: '', imageChecked: true });
      process.stdout.write(`  dropped  ${row.name.slice(0, 44).padEnd(46)} ${file.slice(0, 46)}\n`);
    }
    await mergeWrite(target.path, target.key, cleared);
    process.stdout.write(`\n${name}: dropped ${cleared.size} implausible images.\n`);
    return;
  }

  const pending = rows.filter((r) => !r.photo && !r.imageChecked);
  const targets = limit ? pending.slice(0, limit) : pending;
  process.stdout.write(`${name}: ${rows.length} rows, ${targets.length} without an image.\n`);

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

    Object.assign(byKey.get(row[target.key]) ?? {}, patch);
    updates.set(row[target.key], patch);

    if (i % 100 === 0) {
      process.stdout.write(`  ${i}/${targets.length} — ${found} images found\n`);
      await mergeWrite(target.path, target.key, updates);
    }
    await sleep(350);
  }

  await mergeWrite(target.path, target.key, updates);
  const fresh = JSON.parse(await readFile(target.path, 'utf8'));
  process.stdout.write(
    `\n${name}: ${found} images found this run.\n` +
      `  ${fresh.filter((r) => r.photo).length} of ${fresh.length} rows now have one.\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nImage enrichment failed: ${error.message}\n`);
  process.exitCode = 1;
});

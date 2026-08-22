/**
 * Real places, from the article infobox.
 *
 *   node scripts/enrich-infobox.mjs [--limit 2000]
 *
 * The cuisine ingest took each dish's region from the Wikipedia *subcategory* it was
 * found under — "Goan", "Andhra", "Mughlai". Those are cuisine groupings, not places,
 * and most dishes sit in a top-level category with no hint at all: 1,201 Indian
 * dishes yielded 69 distinct regions, which is nothing like the real geography.
 *
 * `{{Infobox food}}` carries the fields that actually answer it:
 *
 *   place_of_origin  → the town or state a dish is from — the depth the atlas wants
 *   region           → the region, where the article distinguishes it from the country
 *   main_ingredient  → traditional ingredients, which the evidence assessment scores
 *   course           → when it is eaten, which feeds the meal occasion
 *
 * All free, all from an API this already talks to. Nothing here invents a method:
 * the infobox says what a dish is made of, not how, so `steps` stays empty and the
 * technique check stays open.
 *
 * Writes back into src/data/cuisines.json and src/data/catalogue.json in place.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { requestedTitles } from './lib/mediawiki.mjs';
import { detectAtRisk } from '../src/domain/atRisk.ts';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CUISINES = resolve(HERE, '../src/data/cuisines.json');
const CATALOGUE = resolve(HERE, '../src/data/catalogue.json');

/**
 * The two sources this pass can read, and how a row in each names its article.
 *
 * The cuisine rows were walked out of Wikipedia categories and carry the article
 * title as their identity. The Wikidata rows carry a Q-number, and their article
 * URL is filled in by resolve-article-urls.mjs — which is why 59% of the catalogue
 * had no ingredients and no preparation until now: this pass had no way to find
 * their articles, so it never read one.
 */
const articleTitle = (url) => {
  try {
    return decodeURIComponent((url ?? '').split('/wiki/')[1] ?? '').replace(/_/g, ' ');
  } catch {
    return '';
  }
};

const TARGETS = {
  cuisines: {
    path: CUISINES,
    key: (r) => r.title,
    title: (r) => r.title,
    pending: (r) => !r.infobox || !r.riskChecked,
  },
  catalogue: {
    path: CATALOGUE,
    key: (r) => r.id,
    title: (r) => articleTitle(r.url),
    pending: (r) => r.url && !r.infobox,
  },
};

const API = 'https://en.wikipedia.org/w/api.php';
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

/** Strip wiki markup down to plain text. */
const clean = (value) =>
  value
    // Image links go whole. `[[File:Sheet pan.jpg|thumb|Large Sheet pan|baking...]]`
    // through the old rule below became "thumb|Large Sheet pan|baking..." and opened
    // Baklava's blurb with it. The file extension identifies these in every language;
    // the namespace prefix does not.
    .replace(/\[\[[^\]]*\.(?:jpe?g|png|svg|gif|webp)[^\]]*\]\]/gi, '')
    // Then the LAST pipe segment. Keeping everything after the first was the bug.
    .replace(/\[\[([^\]]*)\]\]/g, (_, inner) => inner.split('|').pop())
    .replace(/\{\{(?:nowrap|nobold|small)\|([^}]*)\}\}/gi, '$1')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<ref[^>]*\/>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/'''?/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Pull the named fields out of an `{{Infobox food}}`.
 *
 * Brace-counted rather than regexed to the closing `}}`, because infobox values
 * routinely contain nested templates and a lazy match stops at the wrong place.
 */
function infobox(wikitext) {
  const start = wikitext.search(/\{\{\s*Infobox\s+(food|prepared food|dish)/i);
  if (start === -1) return null;

  let depth = 0;
  let end = start;
  for (let i = start; i < wikitext.length - 1; i++) {
    if (wikitext[i] === '{' && wikitext[i + 1] === '{') {
      depth += 1;
      i += 1;
    } else if (wikitext[i] === '}' && wikitext[i + 1] === '}') {
      depth -= 1;
      i += 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  const block = wikitext.slice(start, end);
  const fields = {};

  // Split on pipes that sit at the infobox's own depth, so nested templates survive.
  let buffer = '';
  let nest = 0;
  for (let i = 0; i < block.length; i++) {
    const two = block.slice(i, i + 2);
    if (two === '{{' || two === '[[') nest += 1;
    if (two === '}}' || two === ']]') nest -= 1;

    if (block[i] === '|' && nest <= 1) {
      const eq = buffer.indexOf('=');
      if (eq > -1) fields[buffer.slice(0, eq).trim().toLowerCase()] = clean(buffer.slice(eq + 1));
      buffer = '';
    } else {
      buffer += block[i];
    }
  }
  const eq = buffer.indexOf('=');
  if (eq > -1) fields[buffer.slice(0, eq).trim().toLowerCase()] = clean(buffer.slice(eq + 1).replace(/\}\}$/, ''));

  return fields;
}

/** 'Kozhikode, Kerala, India' → the most specific part that is not the country. */
function placeFrom(fields, country) {
  const raw = fields['place_of_origin'] || fields['region'] || '';
  if (!raw) return '';

  const parts = raw
    .split(/[,;/]| and /)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => p.toLowerCase() !== country.toLowerCase())
    .filter((p) => p.length > 2 && p.length < 40)
    .filter((p) => !/^(various|worldwide|global|international|unknown|n\/a)$/i.test(p));

  return parts[0] ?? '';
}

/**
 * The article's own account of how the dish is made.
 *
 * Every food article sampled carried a section of this kind — Preparation,
 * Production, "Ingredients and preparation", "Composition and cooking method" — and
 * this is what turns thousands of name-and-place records into records that say
 * something.
 *
 * It is captured as **prose, attributed to the article**, and never as numbered
 * steps. That distinction is the whole point: an encyclopaedia paragraph describes
 * how a dish is generally made, and rewriting it into an ordered method would
 * manufacture a precision the source does not have — and would let an imported
 * record pass for a documented tradition. `steps` stays empty and the traditional
 * technique check stays open.
 */
function preparationProse(wikitext) {
  const heading = /^==+\s*([^=\n]*(preparation|cooking|method|making|production|recipe)[^=\n]*)==+\s*$/im;
  const start = wikitext.search(heading);
  if (start === -1) return '';

  const after = wikitext.slice(start);
  const body = after.slice(after.indexOf('\n') + 1);
  const end = body.search(/^==+[^=\n]+==+\s*$/m);
  const block = end === -1 ? body : body.slice(0, end);

  const prose = clean(
    block
      .replace(/\{\|[\s\S]*?\|\}/g, '') // tables
      .replace(/^[*#:;].*$/gm, '') // lists — prose only
      .replace(/^\s*\[\[File:[\s\S]*?\]\]\s*$/gim, ''),
  );

  // Too short to be an account of anything; too long to belong on a card.
  if (prose.length < 120) return '';

  // The structural guard, checked on the output rather than trusted to the stripper
  // above. Running prose has no pipe, bracket, brace or bare URL — in any language,
  // which is the point: enumerating what each edition calls "thumb" is a list of the
  // editions somebody thought of, and there are three hundred of them.
  if (/[|[\]{}]|https?:\/\//.test(prose)) return '';
  const trimmed = prose.slice(0, 700);
  const lastStop = trimmed.lastIndexOf('. ');
  return lastStop > 200 ? trimmed.slice(0, lastStop + 1) : trimmed;
}

/**
 * The article's intro and history, which is where decline is actually described.
 *
 * The preparation section says how a dish is cooked; whether anyone still cooks it
 * belongs to the lead paragraph or a History section. Scanning the preparation text
 * for it found nothing across 472 records, which was a bug in where I looked rather
 * than a fact about the world.
 */
function narrativeText(wikitext) {
  const firstHeading = wikitext.search(/^==+[^=\n]+==+\s*$/m);
  const intro = firstHeading === -1 ? wikitext.slice(0, 4000) : wikitext.slice(0, firstHeading);

  const historyMatch = wikitext.match(
    /^==+\s*[^=\n]*(history|origin|origins|background|tradition|decline)[^=\n]*==+\s*$/im,
  );
  let history = '';
  if (historyMatch) {
    const start = wikitext.indexOf(historyMatch[0]);
    const body = wikitext.slice(start + historyMatch[0].length);
    const end = body.search(/^==+[^=\n]+==+\s*$/m);
    history = end === -1 ? body.slice(0, 4000) : body.slice(0, end);
  }

  return clean(`${intro}\n${history}`.replace(/\{\|[\s\S]*?\|\}/g, ''));
}

/**
 * At-risk detection — imported, not copied.
 *
 * This file used to hold its own STATED / IMPLIED / FALSE_FRIENDS lists, kept in step
 * with  by hand. They drifted, which is how records reached the
 * app flagged 🕯️ At-Risk Tradition over sentences about a revival. Node strips the
 * types, so the script now runs the same rules the app is tested against.
 */
const detectRisk = (text, subject) => {
  const found = detectAtRisk(text, subject);
  return found.atRisk ? { evidence: found.evidence, strength: found.strength } : null;
};

const listFrom = (value) =>
  (value || '')
    .split(/[,;]| and /)
    .map((p) => p.trim())
    .filter((p) => p.length > 1 && p.length < 40)
    .slice(0, 8);

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

/**
 * Merge this pass's findings into whatever is on disk *now*, rather than writing a
 * copy held since startup.
 *
 * The ingest checkpoints to the same file, so a straight write silently discards
 * every row it added in the meantime — which is exactly what happened on the first
 * run of this script, losing 65 places and 82 ingredient lists. Re-reading before
 * each write makes the two safe to overlap.
 */
async function mergeWrite(path, updates, target) {
  let current = [];
  try {
    current = JSON.parse(await readFile(path, 'utf8'));
  } catch {
    current = [];
  }

  const byKey = new Map(current.map((r) => [target.key(r), r]));
  for (const [id, patch] of updates) {
    const existing = byKey.get(id);
    // Never invent a row: a patch whose row has gone is dropped, not appended.
    if (existing) Object.assign(existing, patch);
  }

  await writeFile(path, JSON.stringify([...byKey.values()]), 'utf8');
  return byKey.size;
}

const main = async () => {
  const limitArg = process.argv.indexOf('--limit');
  const limit = limitArg > -1 ? Number(process.argv[limitArg + 1]) : 0;

  const fileArg = process.argv.indexOf('--file');
  const name = fileArg > -1 ? process.argv[fileArg + 1] : 'cuisines';
  const target = TARGETS[name];
  if (!target) throw new Error(`unknown --file ${name}; expected ${Object.keys(TARGETS).join(', ')}`);

  const rows = JSON.parse(await readFile(target.path, 'utf8'));

  // Only rows that still lack a real place are worth the fetch. `riskChecked` was
  // added after the first pass, so rows enriched before it still need fetching even
  // though they already have an infobox.
  const pending = rows.filter(target.pending).filter((r) => target.title(r));
  const targets = limit ? pending.slice(0, limit) : pending;
  process.stdout.write(`${name}: ${rows.length} rows, ${targets.length} to enrich.\n`);

  // Keyed by article title, which is how the API answers. The patch is then filed
  // under the row's own key so the merge can find it again.
  const byTitle = new Map(rows.map((r) => [target.title(r), r]));
  /** Only what this pass established, so a merge never rewrites another writer's rows. */
  const updates = new Map();
  let gainedPlace = 0;
  let gainedIngredients = 0;
  let gainedPrep = 0;
  let gainedRisk = 0;

  const batches = chunk(targets, 20);
  for (const [i, batch] of batches.entries()) {
    try {
      const data = await api({
        action: 'query',
        prop: 'revisions',
        rvprop: 'content',
        rvslots: 'main',
        titles: batch.map(target.title).join('|'),
        redirects: '1',
      });

      // The title that comes back is not always the title asked for. `redirects=1`
      // means "Curry leaves" is answered as "Curry tree", and looking the row up by
      // the answer misses it — so the row was never marked, and was re-fetched on
      // every run since. 145 rows had been in that loop, spending requests forever
      // and reporting as "still pending" rather than as an error.
      const asked = requestedTitles(data);

      for (const page of data?.query?.pages ?? []) {
        const text = page?.revisions?.[0]?.slots?.main?.content;
        // Every row that asked for this page, not just the first. The place is read
        // per row because `placeFrom` weighs the infobox against that row's own
        // country, and two records sharing an article need not share a country.
        const rows = (asked.get(page.title) ?? [page.title])
          .map((title) => byTitle.get(title))
          .filter(Boolean);

        for (const row of rows) {
        const patch = { infobox: true }; // fetched, whether or not it had one

        if (text) {
          const prose = preparationProse(text);
          if (prose) {
            patch.prepSummary = prose;
            gainedPrep += 1;
          }

          // Decline is described in the lead and the history, not in the recipe.
          // The dish name goes in, so weak decline language has to be shown to be
          // about this food rather than about fireplaces, pineapples or a bookshelf.
          const risk = detectRisk(narrativeText(text), row.name || '');
          patch.riskChecked = true;
          if (risk) {
            patch.atRiskEvidence = risk.evidence;
            patch.atRiskStrength = risk.strength;
            gainedRisk += 1;
          }
        }

        const fields = text ? infobox(text) : null;

        if (fields) {
          const place = placeFrom(fields, row.country);
          if (place && place !== row.region) {
            patch.region = place;
            gainedPlace += 1;
          }

          const ingredients = listFrom(fields['main_ingredient']);
          if (ingredients.length) {
            patch.ingredients = ingredients;
            gainedIngredients += 1;
          }

          const course = fields['course'] || fields['served'] || '';
          if (course) patch.course = course.slice(0, 60);
        }

        Object.assign(row, patch);
        updates.set(target.key(row), patch);
        }
      }
    } catch (error) {
      process.stdout.write(`  batch ${i + 1} failed (${error.message})\n`);
    }

    if (i % 10 === 0) {
      process.stdout.write(
        `  batch ${i + 1}/${batches.length} — ${gainedPrep} preparations, ${gainedPlace} places, ${gainedIngredients} ingredients\n`,
      );
      await mergeWrite(target.path, updates, target);
    }
    // Slower than the ingest's own pacing: when both run, they share one quota.
    await sleep(400);
  }

  const finalCount = await mergeWrite(target.path, updates, target);
  process.stdout.write(`\n${finalCount} rows on disk after merge.\n`);

  const places = new Set(rows.filter((r) => r.region).map((r) => `${r.country}|${r.region}`));
  process.stdout.write(
    `\nEnriched. ${gainedPrep} rows gained a described preparation, ` +
      `${gainedPlace} a real place, ${gainedIngredients} ingredients.\n` +
      `  ${places.size} distinct places now recorded across the cuisine source.\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`\nInfobox enrichment failed: ${error.message}\n`);
  process.exitCode = 1;
});

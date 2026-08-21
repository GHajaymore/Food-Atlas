/**
 * Find real documentation for records that have none — and the measurement saying
 * this particular corpus does not have it.
 *
 * Most of this catalogue is a name and a place. The hope was that public-domain
 * cookbooks on English Wikisource — free, openly licensed, no key — would describe
 * how some of those foods are made.
 *
 * ## What it actually returned
 *
 * Of 77 records searched, **one** candidate survived every rule, and that one was
 * Presidential Proclamation 7235 — a tariff schedule — offered as a source for peanut
 * butter. It named the dish and it named the United States, so it corroborated
 * honestly; it simply had nothing to do with cooking. `worthCiting` now refuses it,
 * which takes the yield to zero.
 *
 * So this script is kept as the evidence, not as an enrichment. **Do not run it with
 * `--apply` expecting results.** The finding it records is the useful part: English
 * Wikisource is a library of English-language literature, and the foods this atlas is
 * thinnest on are not in it. Pointing a different corpus at these rules is a change of
 * two constants; believing a corpus without measuring it is the mistake.
 *
 * The route that does work has no name-matching in it at all: a record's Wikidata item
 * links to articles about *the same entity* in other languages, so there is no chance
 * of matching a different thing that shares a word. That is
 * `enrich-native-language.mjs`, and it is now exhausted — of 1,800 records with no
 * preparation, 1,047 have no article in any language for it to read.
 *
 * **The rules live in `src/domain/sourceFinding.ts`, not here.** Node strips the types
 * and imports it directly, so the script and the app apply the same acceptance test
 * to the byte. That matters more than it sounds: five separate times in this project
 * a script wrote a field the app then ignored, because the two held their own copies
 * of a rule. There is one copy now.
 *
 * **This measures accuracy, not availability.** The earlier photo probe reported how
 * often a search *returned something*, called it a success rate, and hid the fact
 * that half the matches were wrong — an Italian singer illustrating a Malaysian
 * chicken dish. So the default run writes proposals to a file and prints a sample to
 * read, and the counts it prints are counts of refusals by rule. Nothing is written
 * to the catalogue without `--apply`.
 *
 * Usage:
 *   node scripts/find-sources.mjs --limit 200          # dry run, writes proposals
 *   node scripts/find-sources.mjs --limit 200 --sample 15
 *   node scripts/find-sources.mjs --apply              # would write; yields nothing today
 *
 * Wikimedia: one rate limit per IP across every API, and it says `Retry-After: 4`.
 * Read the header. Guessing an escalating backoff once turned a four-second pause
 * into an apparent hour-long outage and cost six batches.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { considerSource, sourceNote, worthCiting } from '../src/domain/sourceFinding.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = (f) => resolve(HERE, '../src/data/', f);
const PROPOSALS = resolve(HERE, '../src/data/source-proposals.json');

const API = 'https://en.wikisource.org/w/api.php';
const UA = 'WikiFoodia/1.0 (open food atlas; contact via github.com/GHajaymore/Food-Atlas)';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const flag = (name) => process.argv.includes(`--${name}`);

const LIMIT = Number(arg('limit', 150));
const SAMPLE = Number(arg('sample', 10));
const APPLY = flag('apply');

/** One request, honouring whatever Wikimedia asks for. */
async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429 || res.status === 503) {
      // The header is the answer. Four seconds means four seconds.
      const wait = Number(res.headers.get('retry-after') ?? 4) * 1000;
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    if (!res.ok) return null;
    return res.json();
  }
  return null;
}

/**
 * Search the corpus for the dish alongside something the record already knows.
 *
 * The conjunction is in the query so the corpus does the narrowing, but it proves
 * nothing on its own — search matches loosely, and `considerSource` re-checks the
 * returned text for the corroboration rather than trusting the query that found it.
 */
async function search(name, corroborant) {
  const srsearch = corroborant ? `"${name}" ${corroborant}` : `"${name}"`;
  const data = await api({ action: 'query', list: 'search', srsearch, srlimit: '4', srnamespace: '0' });
  return data?.query?.search ?? [];
}

/**
 * The readable text of a page, which is what the acceptance rules are applied to.
 *
 * Not `prop=extracts`. TextExtracts is a Wikipedia extension and Wikisource does not
 * have it: every call returns an empty string, and the first run of this script duly
 * reported 22 records as having no text when what had no text was my request. That
 * is the shape of the bug this project keeps finding — a plumbing failure wearing the
 * costume of an empty corpus — so the raw wikitext is read instead, which every
 * MediaWiki serves.
 */
async function extract(title) {
  const data = await api({
    action: 'query',
    prop: 'revisions',
    rvprop: 'content',
    rvslots: 'main',
    titles: title,
  });
  const raw = data?.query?.pages?.[0]?.revisions?.[0]?.slots?.main?.content ?? '';
  // Enough of the markup removed that prose reads as prose. Templates are stripped
  // by counting braces rather than by regex — a regex cannot handle the nesting, and
  // when one was used for this before it left 75 records full of parameter soup.
  return stripMarkup(raw).slice(0, 4000);
}

/** Remove templates, tables and link syntax, leaving readable prose. */
function stripMarkup(text) {
  let out = '';
  let depth = 0;
  for (let i = 0; i < text.length; i += 1) {
    const two = text.slice(i, i + 2);
    if (two === '{{' || two === '{|') {
      depth += 1;
      i += 1;
      continue;
    }
    if (two === '}}' || two === '|}') {
      if (depth > 0) depth -= 1;
      i += 1;
      continue;
    }
    if (depth === 0) out += text[i];
  }
  return out
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/'{2,}/g, '')
    .replace(/^[=*#:;]+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const main = async () => {
  const [catalogue, cuisines, cookbook] = await Promise.all(
    ['catalogue.json', 'cuisines.json', 'cookbook.json'].map(async (f) =>
      JSON.parse(await readFile(DATA(f), 'utf8')),
    ),
  );

  // Only records with nothing describing the preparation. A record that already has
  // a method does not need a worse source for one.
  const cookbookNames = new Set(cookbook.map((r) => (r.name ?? '').toLowerCase()));
  const targets = [
    ...catalogue.map((r) => ({ ...r, from: 'wikidata' })),
    ...cuisines.map((r) => ({ ...r, from: 'cuisine' })),
  ].filter((r) => r.name && !r.foundSource && !cookbookNames.has(r.name.toLowerCase()));

  console.log(`${targets.length.toLocaleString()} records with no recorded method.`);
  console.log(`Walking ${Math.min(LIMIT, targets.length)} of them.\n`);

  const refusals = {};
  const accepted = [];
  let searched = 0;

  for (const row of targets.slice(0, LIMIT)) {
    const facts = {
      name: row.name,
      country: row.country ?? '',
      region: row.region ?? '',
      cuisine: row.cuisine ?? '',
      ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
    };

    // Refusals that need no network. Checking them first keeps a run from spending
    // its rate limit on names the rules will reject whatever comes back.
    const preflight = considerSource({ title: '', publisher: '', url: '', text: facts.name }, facts);
    if ('refused' in preflight && preflight.refused !== 'NO_CORROBORATION') {
      refusals[preflight.refused] = (refusals[preflight.refused] ?? 0) + 1;
      continue;
    }

    searched += 1;
    const hits = await search(facts.name, facts.country);
    if (!hits.length) {
      refusals.NOTHING_FOUND = (refusals.NOTHING_FOUND ?? 0) + 1;
      continue;
    }

    let took = false;
    for (const hit of hits) {
      const text = await extract(hit.title);
      const candidate = {
        title: hit.title,
        publisher: 'Wikisource',
        url: `https://en.wikisource.org/wiki/${encodeURIComponent(hit.title.replace(/ /g, '_'))}`,
        text,
      };
      const verdict = considerSource(candidate, facts);
      if ('refused' in verdict) {
        refusals[verdict.refused] = (refusals[verdict.refused] ?? 0) + 1;
        continue;
      }
      if (!worthCiting(verdict.accepted)) {
        refusals.NO_METHOD_DESCRIBED = (refusals.NO_METHOD_DESCRIBED ?? 0) + 1;
        continue;
      }
      accepted.push({
        id: row.id,
        from: row.from,
        name: row.name,
        country: facts.country,
        source: {
          title: candidate.title,
          publisher: candidate.publisher,
          url: candidate.url,
          note: sourceNote(verdict.accepted),
        },
        corroborates: verdict.accepted.corroborates,
        describesMethod: verdict.accepted.describesMethod,
        // Kept so a person can read what the rule accepted and judge it themselves.
        excerpt: text.slice(0, 400).replace(/\s+/g, ' '),
      });
      took = true;
      break;
    }
    if (!took) refusals.NO_CANDIDATE_SURVIVED = (refusals.NO_CANDIDATE_SURVIVED ?? 0) + 1;
  }

  console.log(`Searched ${searched}. Accepted ${accepted.length}.\n`);
  console.log('Refused by rule:');
  for (const [reason, n] of Object.entries(refusals).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(5)}  ${reason}`);
  }

  console.log(`\n--- ${Math.min(SAMPLE, accepted.length)} accepted, to be read rather than counted ---\n`);
  for (const a of accepted.slice(0, SAMPLE)) {
    console.log(`${a.name} (${a.country})`);
    console.log(`  -> ${a.source.title}`);
    console.log(`  corroborates: ${a.corroborates.join(', ')} | method: ${a.describesMethod}`);
    console.log(`  "${a.excerpt.slice(0, 220)}..."\n`);
  }

  await writeFile(PROPOSALS, JSON.stringify(accepted, null, 1));
  console.log(`Proposals written to src/data/source-proposals.json`);
  if (!APPLY) console.log('Dry run. Nothing written to the catalogue. Re-run with --apply to keep them.');
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

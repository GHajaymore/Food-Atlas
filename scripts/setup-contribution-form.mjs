/**
 * Turn a Google Forms pre-filled link into the app's configuration.
 *
 *   node scripts/setup-contribution-form.mjs "<pre-filled link>"
 *   node scripts/setup-contribution-form.mjs "<pre-filled link>" --dry
 *
 * `/contribute` has been a walkthrough with nowhere to send anything since it was
 * built, because `EXPO_PUBLIC_CONTRIBUTION_FORM_URL` has never been set. The atlas has
 * run out of things it can scrape — every free corpus has been walked — so this is the
 * only way it grows, and the only thing standing in the way is six field ids.
 *
 * Those ids are the fiddly part. Google does not show them: you fill each question
 * with a marker, take "Get pre-filled link", and read `entry.1234567` out of the query
 * string by hand, six times, without transposing a digit. Getting one wrong does not
 * error — it silently drops that answer, and nobody finds out until a submission
 * arrives with no dish name in it.
 *
 * So this reads them instead. Fill each question with its marker word, paste the link
 * here, and the mapping is done by matching the markers rather than by counting.
 *
 * See `docs/contribution-form.md` for the six questions and the markers.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ENV = resolve(HERE, '../.env');

/**
 * The marker typed into each question, and the variable it configures.
 *
 * Markers are single words in capitals because they have to survive being typed into
 * a form by a person and read back out of a URL — anything with a space or an accent
 * arrives percent-encoded and stops matching what is written here.
 */
const FIELDS = [
  { marker: 'DISH', env: 'EXPO_PUBLIC_CONTRIB_FIELD_DISH', question: 'Dish, in its own language if possible', required: true },
  { marker: 'PLACE', env: 'EXPO_PUBLIC_CONTRIB_FIELD_PLACE', question: 'Where is it made this way?', required: true },
  { marker: 'COOKS', env: 'EXPO_PUBLIC_CONTRIB_FIELD_COOKS', question: 'Who prepares it', required: false },
  { marker: 'INGREDIENTS', env: 'EXPO_PUBLIC_CONTRIB_FIELD_INGREDIENTS', question: 'Traditional ingredients and equipment', required: false },
  { marker: 'CONNECTION', env: 'EXPO_PUBLIC_CONTRIB_FIELD_CONNECTION', question: 'Your connection to the place', required: true },
  { marker: 'PHOTO', env: 'EXPO_PUBLIC_CONTRIB_FIELD_PHOTO', question: 'Commons file name or link', required: false },
];

/**
 * Merge into whatever is already in `.env` rather than writing a fresh one.
 *
 * The file also holds the donation slug, the translation endpoint and the
 * confirmations URL. Overwriting it to configure a form would switch those off, and
 * the app would report them as "not open yet" — which is exactly the failure this
 * script exists to end, arriving from the other direction.
 */
async function mergeEnv(values) {
  let existing = '';
  try {
    existing = await readFile(ENV, 'utf8');
  } catch {
    // No .env yet. The ordinary case the first time this is run.
  }

  const lines = existing.split('\n');
  const kept = lines.filter((line) => {
    const key = line.split('=')[0]?.trim();
    return !(key in values);
  });

  const added = Object.entries(values).map(([key, value]) => `${key}=${value}`);
  const body = [...kept.filter((l) => l.trim()), ...added].join('\n');
  return `${body}\n`;
}

const main = async () => {
  const dry = process.argv.includes('--dry');
  const link = process.argv.slice(2).find((a) => a.startsWith('http'));

  if (!link) {
    process.stderr.write(
      'Paste the form\'s pre-filled link:\n\n' +
        '  node scripts/setup-contribution-form.mjs "https://docs.google.com/forms/d/e/.../viewform?usp=pp_url&entry.123=DISH&..."\n\n' +
        'See docs/contribution-form.md for how to get one.\n',
    );
    process.exitCode = 1;
    return;
  }

  let url;
  try {
    url = new URL(link);
  } catch {
    process.stderr.write('That is not a URL.\n');
    process.exitCode = 1;
    return;
  }

  /*
   * The form's own address is the link without its answers. `contributionUrl()`
   * appends its own query string, so anything left here would be sent twice — once as
   * the marker word and once as the contributor's real answer.
   */
  const formUrl = `${url.origin}${url.pathname}`;

  // Marker to entry id, by reading the answers back out.
  const found = new Map();
  for (const [key, value] of url.searchParams) {
    if (!key.startsWith('entry.')) continue;
    const marker = value.trim().toUpperCase();
    if (marker) found.set(marker, key);
  }

  const values = { EXPO_PUBLIC_CONTRIBUTION_FORM_URL: formUrl };
  const missing = [];

  for (const field of FIELDS) {
    const entry = found.get(field.marker);
    if (entry) values[field.env] = entry;
    else missing.push(field);
  }

  process.stdout.write(`\nForm: ${formUrl}\n\n`);
  for (const field of FIELDS) {
    const entry = found.get(field.marker);
    const mark = entry ? '  ok ' : field.required ? '  !! ' : '  -- ';
    process.stdout.write(
      `${mark}${field.marker.padEnd(12)} ${entry ? entry.padEnd(18) : 'not found'.padEnd(18)} ${field.question}\n`,
    );
  }

  const missingRequired = missing.filter((f) => f.required);
  if (missingRequired.length) {
    process.stderr.write(
      `\n${missingRequired.length} required field${missingRequired.length === 1 ? '' : 's'} not found in that link. ` +
        'Nothing written.\n' +
        'Check each question was filled with its marker word exactly, then take the pre-filled link again.\n',
    );
    process.exitCode = 1;
    return;
  }

  if (!dry) await writeFile(ENV, await mergeEnv(values), 'utf8');

  process.stdout.write(
    `\n${Object.keys(values).length} settings ${dry ? 'would be written' : 'written'} to .env` +
      `${missing.length ? `, ${missing.length} optional field${missing.length === 1 ? '' : 's'} left unset` : ''}.\n` +
      (dry ? '\n(dry run — nothing written)\n' : '\nRestart the dev server: the app reads these at build time, not per request.\n'),
  );
};

main().catch((error) => {
  process.stderr.write(`\nSetup failed: ${error.message}\n`);
  process.exitCode = 1;
});

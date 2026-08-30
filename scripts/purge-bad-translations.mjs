/**
 * Delete cached translations no reader can use.
 *
 *   node scripts/purge-bad-translations.mjs [--apply]
 *
 * The translate endpoint used to store whatever the model returned, on the reasoning that
 * a second call would send the same prompt to the same model and pay twice for the same
 * answer. That is right for a translation the *app* later rejects — the preserved-term
 * check needs the record's ingredient list, which the endpoint does not have — and wrong
 * for a response that is not even parseable, which it can see perfectly well.
 *
 * So some rows hold truncated JSON: a small model asked to fill a `steps` array for a
 * record with no method repeated one invented sentence until it hit `max_tokens`, and the
 * response was cut off mid-array and cached. Every later reader got the same unusable text
 * back marked `cached: true`, and the record stayed unreadable in that language for good.
 *
 * The endpoint no longer stores those. This clears the ones already stored, so the next
 * reader gets a fresh attempt rather than a permanent failure.
 *
 * Prints what it would delete and changes nothing without `--apply`.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const run = promisify(execFile);
const APPLY = process.argv.includes('--apply');

/*
 * Through a file rather than --command.
 *
 * Passing SQL inline needed a shell to find npx on Windows, and the shell then split the
 * statement on its spaces: wrangler saw "Unknown arguments: dish_id,, lang,, body". A
 * file has no quoting for a shell to get wrong.
 */
const d1 = async (sql) => {
  const file = join(tmpdir(), `wikifoodia-purge-${process.pid}.sql`);
  writeFileSync(file, sql);
  try {
    /* `shell: true` is needed to find npx on Windows. It was safe to drop the inline SQL
       and keep the shell: the only argument the shell now sees is a temp file path, which
       has no spaces or quotes for it to split. */
    const { stdout } = await run(
      'npx',
      ['wrangler', 'd1', 'execute', 'wikifoodia', '--remote', '--json', '--file', file],
      { shell: true, maxBuffer: 64 * 1024 * 1024 },
    );
    const at = stdout.indexOf('[');
    return JSON.parse(stdout.slice(at));
  } finally {
    try { unlinkSync(file); } catch {}
  }
};

const rows = (await d1('select dish_id, lang, body from translation'))[0]?.results ?? [];
console.log(`${rows.length} cached translations`);

const bad = [];
for (const row of rows) {
  let why = '';
  let parsed = null;
  try {
    parsed = JSON.parse(row.body);
  } catch {
    why = 'not parseable';
  }

  if (!why && parsed) {
    const steps = Array.isArray(parsed.steps) ? parsed.steps.map(String) : [];
    /* The degeneration signature: the model stopped translating and repeated itself. */
    if (steps.length > 2 && new Set(steps).size === 1) why = `${steps.length} identical steps`;
  }

  if (why) bad.push({ ...row, why });
}

console.log(`${bad.length} unusable:`);
for (const b of bad) console.log(`  dish ${b.dish_id} / ${b.lang} — ${b.why} (${b.body.length} bytes)`);

if (!bad.length) process.exit(0);

if (!APPLY) {
  console.log('\n--apply to delete them');
  process.exit(0);
}

for (const b of bad) {
  await d1(`delete from translation where dish_id = ${Number(b.dish_id)} and lang = '${String(b.lang).replace(/'/g, "''")}'`);
  console.log(`deleted dish ${b.dish_id} / ${b.lang}`);
}
console.log(`\ndeleted ${bad.length}`);

/**
 * Check the store listing against each field's character limit.
 *
 *   node scripts/check-store-listing.mjs
 *
 * The stores reject a field over its limit at submission, after the build has been
 * uploaded and the reviewer queue joined — the slowest possible place to find out that a
 * subtitle is two characters long. Every field in `docs/store-listing.md` names its limit
 * in its heading ("### Subtitle — 30 max"); this reads the fenced text under each such
 * heading and counts it.
 *
 * Apple counts keywords in bytes, not characters, so that field is measured as UTF-8.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(resolve(HERE, '../docs/store-listing.md'), 'utf8').replace(/\r\n/g, '\n');

const fields = [...text.matchAll(/^### (.+?) — (\d+) max[^\n]*\n```text\n([\s\S]*?)\n```/gm)];

let failed = false;
for (const [, name, max, body] of fields) {
  const limit = Number(max);
  const size = /keyword/i.test(name) ? Buffer.byteLength(body, 'utf8') : [...body].length;
  const ok = size <= limit;
  if (!ok) failed = true;
  process.stdout.write(`${ok ? 'ok  ' : 'OVER'}  ${String(size).padStart(4)} / ${String(limit).padEnd(4)}  ${name}\n`);
  if (/keyword/i.test(name) && /,\s/.test(body)) {
    failed = true;
    process.stdout.write('      keywords must be comma-separated with no spaces after the commas\n');
  }
}

if (!fields.length) {
  process.stderr.write('check-store-listing: no "— N max" fields found; has the heading format changed?\n');
  failed = true;
}
process.exitCode = failed ? 1 : 0;

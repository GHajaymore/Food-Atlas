/**
 * Write the Content-Security-Policy, with the inline script's hash in it.
 *
 *   node scripts/inject-csp.mjs        (runs as part of `npm run build`)
 *
 * `public/_headers` already sets nosniff, frame options, referrer policy and a
 * permissions policy, and explains each one. The two it could not carry are here because
 * one of them cannot be written by hand.
 *
 * ## Why this is generated rather than typed
 *
 * A useful `script-src` names what may run. This site has exactly one inline script —
 * the canonical-link injector `inject-canonical.mjs` writes — and allowing it means
 * either `'unsafe-inline'`, which permits *any* injected script and gives up most of what
 * a CSP is for, or its SHA-256. The hash changes whenever that script changes, so a
 * hand-written one would silently stop matching and the canonical tag would stop running:
 * a failure that shows up in search results weeks later, not in the build.
 *
 * So it is computed from the file that was actually built, every time.
 *
 * ## What each source is for, and why it is not narrower
 *
 * `img-src` — Commons serves the photographs, and redirects to `upload.wikimedia.org`, so
 * both hosts are needed for a single image. `img.youtube.com` is the still frame on a
 * video card. `data:` because react-native-web inlines small shapes.
 *
 * `style-src` needs `'unsafe-inline'` and there is no way around it: react-native-web
 * builds its stylesheet at runtime through the CSSOM, so there is no file to name and no
 * stable hash to pin. It is the known cost of this renderer, and it is worth being
 * explicit that it is a cost rather than leaving it unremarked.
 *
 * `connect-src` is self only — the API, the catalogue and the per-locale chrome all come
 * from this origin. Nothing here talks to a third party.
 *
 * `frame-ancestors 'none'` says what `X-Frame-Options: SAMEORIGIN` says, to browsers that
 * prefer the newer spelling. `object-src 'none'` and `base-uri 'self'` close two openings
 * that nothing in this app uses.
 */

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const INDEX = resolve(HERE, '../dist/index.html');
const HEADERS = resolve(HERE, '../dist/_headers');

const MARKER = '# wikifoodia-csp';

const main = async () => {
  const html = await readFile(INDEX, 'utf8');

  /* Every inline script, so a second one added later is covered rather than blocked. */
  const inline = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const hashes = inline
    .filter((body) => body.trim())
    .map((body) => `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);

  const policy = [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(' ')}`.trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://commons.wikimedia.org https://upload.wikimedia.org https://img.youtube.com",
    "font-src 'self'",
    "connect-src 'self'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
  ].join('; ');

  let headers = await readFile(HEADERS, 'utf8');
  if (headers.includes(MARKER)) {
    process.stdout.write('inject-csp: already present, nothing to do.\n');
    return;
  }

  /*
   * Appended under the existing `/*` block rather than in a new one. Cloudflare applies
   * every matching rule, but keeping one block for site-wide headers means the next
   * person reads them in one place instead of discovering a second set further down.
   */
  if (!headers.includes('/*')) {
    throw new Error('No /* block in dist/_headers — nothing written.');
  }

  headers = headers.trimEnd() + '\n' + [
    '',
    `  ${MARKER}: the script hash is computed at build time from the file that shipped.`,
    `  Content-Security-Policy: ${policy}`,
    '',
    '  # HTTPS only, from the second visit onward. Deliberately without',
    '  # includeSubDomains: ajailabs.app carries other projects, and this deployment has',
    '  # no business making a promise on their behalf.',
    '  Strict-Transport-Security: max-age=31536000',
    '',
  ].join('\n');

  await writeFile(HEADERS, headers, 'utf8');
  process.stdout.write(`inject-csp: policy written with ${hashes.length} inline script hash(es).\n`);
};

main().catch((error) => {
  process.stderr.write(`\nCSP injection failed: ${error.message}\n`);
  process.exitCode = 1;
});

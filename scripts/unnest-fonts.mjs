/**
 * Move the fonts out of a path Cloudflare Pages refuses to upload.
 *
 * Run automatically as the last step of `npm run build`.
 *
 * ## The failure this exists for
 *
 * Expo exports bundled fonts to `dist/assets/node_modules/@expo-google-fonts/...`, keeping
 * the source path. Cloudflare Pages skips any file under a directory called
 * `node_modules` -- it is on its ignore list alongside `.git` -- and says nothing about it.
 * The first deploy of this app reported
 *
 *     ✨ Success! Uploaded 9 files
 *
 * out of the 34 in `dist`. The 23 missing ones were every font, and nothing in the deploy
 * output named them.
 *
 * What that looked like in the browser: `_redirects` ends with the single-page-app
 * catch-all `/*  /index.html  200`, so a request for a missing font is not a 404. It is
 * index.html, served with status 200, and the browser tries to parse HTML as a typeface:
 *
 *     OTS parsing error: invalid sfntVersion: 1008813135
 *
 * 1008813135 is 0x3C21444F, which is the bytes `<!DO`.
 *
 * And `app/_layout.tsx` holds the render until the fonts arrive -- `if (!fontsLoaded)
 * return <FeedSkeleton fonts={false} />` -- so they never arrived and production showed a
 * loading skeleton, pulsing, forever. Every network request returned 200. The site was
 * broken in a way that nothing but looking at it would have found.
 *
 * ## What this does
 *
 * Moves `dist/assets/node_modules/**` to `dist/assets/vendor/**` and rewrites the 17
 * references in the JS bundle. Nothing in the app names these paths -- they are generated
 * by the exporter and read only by the font loader -- so renaming the directory is
 * invisible to everything except the uploader that was refusing it.
 *
 * ## And then re-fingerprints the bundle, which is not optional
 *
 * `dist/_headers` sends `/_expo/static/*` with `max-age=31536000, immutable`, and says
 * why: *"Metro fingerprints these filenames, so the content behind a given URL can never
 * change."* Editing the bundle after Metro has hashed it makes that sentence false --
 * same filename, different bytes, cached for a year without revalidation. Anybody who
 * loaded the broken deploy would keep it until 2027.
 *
 * That was not hypothetical. It is how the first attempt at this fix appeared to fail:
 * production had the corrected bundle, and the browser went on requesting
 * `assets/node_modules` from the copy it already had.
 *
 * So the rewritten bundle is renamed to a hash of its new contents and the reference in
 * index.html is updated to match, which puts the invariant back the way `_headers`
 * describes it.
 */

import { createHash } from 'node:crypto';
import { readdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';

const FROM = 'assets/node_modules';
const TO = 'assets/vendor';

const exists = async (path) => {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
};

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else out.push(path);
  }
  return out;
};

const nested = join('dist', FROM);
if (!(await exists(nested))) {
  /* Nothing to do is a legitimate outcome: a future exporter may stop nesting them. */
  console.log('unnest-fonts: no assets/node_modules in dist, nothing to move.');
} else {
  const moved = (await walk(nested)).length;
  await rename(nested, join('dist', TO));

  let rewritten = 0;
  const renames = [];
  for (const file of await walk(join('dist', '_expo'))) {
    if (!file.endsWith('.js')) continue;
    const before = await readFile(file, 'utf8');
    if (!before.includes(FROM)) continue;
    const after = before.split(FROM).join(TO);
    await writeFile(file, after, 'utf8');
    rewritten += before.split(FROM).length - 1;

    /* Re-fingerprint: same shape Metro uses, so nothing downstream has to care. */
    const was = basename(file);
    const hash = createHash('sha256').update(after).digest('hex').slice(0, 32);
    const now = was.replace(/-[a-f0-9]{32}\.js$/, `-${hash}.js`);
    if (now === was) throw new Error(`unnest-fonts: cannot re-fingerprint ${was}`);
    await rename(file, join(dirname(file), now));
    renames.push([was, now]);
  }

  const indexPath = join('dist', 'index.html');
  let index = await readFile(indexPath, 'utf8');
  for (const [was, now] of renames) {
    if (!index.includes(was)) throw new Error(`unnest-fonts: index.html never referenced ${was}`);
    index = index.split(was).join(now);
  }
  await writeFile(indexPath, index, 'utf8');

  /* Loud, because a silent partial move is the failure mode this file is about. */
  const left = (await walk('dist')).filter((f) => f.includes('node_modules')).length;
  if (left) throw new Error(`unnest-fonts: ${left} files still under a node_modules path`);
  if (!rewritten) throw new Error('unnest-fonts: moved the fonts but rewrote no references');

  console.log(`unnest-fonts: moved ${moved} files to ${TO}, rewrote ${rewritten} references, re-fingerprinted ${renames.length} bundle(s).`);
}

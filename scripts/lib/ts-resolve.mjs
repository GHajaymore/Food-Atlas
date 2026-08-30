/**
 * Let a build script import the app's own TypeScript.
 *
 *   node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/whatever.mjs
 *
 * Node 24 strips types by itself, so `import('./fold.ts')` already works. What it will not
 * do is guess an extension: the app writes `from './types'`, which is how every bundler in
 * this project resolves it and is not a thing Node ESM does. One resolve hook closes that
 * gap, and nothing is installed to get it.
 *
 * ## Why a script wants the app's code at all
 *
 * Record ids are assigned inside `buildCatalogue` — `100_000 + index` over the rows that
 * survive deduplication and validation. Re-deriving them in a script means re-implementing
 * the dedup, and the moment the two disagree the prerendered page for `/dish/4821` is
 * about a different dish than the app shows there. Importing the real builder is the only
 * version of this that cannot drift.
 */

import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register(new URL('./ts-resolve-hooks.mjs', import.meta.url), pathToFileURL('./'));

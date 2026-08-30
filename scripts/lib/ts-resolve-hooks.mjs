/**
 * The resolve hook itself. See `ts-resolve.mjs` for why this exists.
 *
 * Tries the extensions a bundler would, in the order the app's own imports expect, and
 * otherwise hands the specifier straight back to Node. Deliberately narrow: it only fires
 * for relative specifiers that failed normal resolution, so nothing about package
 * resolution changes.
 */

import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve as resolvePath } from 'node:path';

const TRIED = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

/*
 * The app imports its data as `import rows from './catalogue.min.json'`, which every
 * bundler here accepts and Node does not: ESM wants `with { type: 'json' }`, and without
 * it the file is parsed as JavaScript and fails on its first brace. Supplying the
 * attribute during resolution keeps the app's source untouched.
 */
const asJson = (resolved) =>
  resolved?.url?.endsWith('.json')
    ? { ...resolved, importAttributes: { ...resolved.importAttributes, type: 'json' } }
    : resolved;

export async function resolve(specifier, context, nextResolve) {
  try {
    return asJson(await nextResolve(specifier, context));
  } catch (error) {
    if (!specifier.startsWith('.') || !context.parentURL) throw error;

    const from = dirname(fileURLToPath(context.parentURL));
    for (const extension of TRIED) {
      const candidate = resolvePath(from, specifier + extension);
      if (existsSync(candidate)) {
        /* No `format`. Declaring 'module' told Node the file was plain JavaScript, so it
           skipped type stripping and the first `interface` failed to parse — reported as
           an unexpected brace, several modules away from the cause. Letting Node infer
           from the extension is what makes the stripping happen. */
        return { url: pathToFileURL(candidate).href, shortCircuit: true };
      }
    }
    throw error;
  }
}

/**
 * The catalogue, built from disk for the tests.
 *
 * The app fetches its four sources over HTTP so they stay out of the JavaScript
 * bundle. Tests have no server and want no network, but they do want the real
 * catalogue — several assert over all sixteen thousand records, and a fixture would
 * only prove the fixture.
 *
 * So they read the same files the app fetches, straight off disk, and hand them to
 * the same builder. What is under test is the build, which is the part that can be
 * wrong.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildCatalogue } from '../src/data/build';

const read = (name: string) =>
  JSON.parse(readFileSync(resolve(__dirname, `../public/data/${name}.json`), 'utf8')) as unknown[];

const built = buildCatalogue(read('catalogue'), read('cuisines'), read('cookbook'), read('unesco'));

export const catalogue = built.catalogue;
export const catalogueStats = built.stats;

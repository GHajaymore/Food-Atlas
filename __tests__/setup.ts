/**
 * The twelve catalogues, installed before any test runs.
 *
 * Eleven of them are fetched at runtime now rather than compiled into the bundle, so a
 * test that calls `copyFor('fr')` would otherwise be handed the English fallback and pass
 * for the wrong reason — asserting that French copy exists while reading English. That is
 * worse than a failure, because it looks like coverage.
 *
 * Installing them here keeps every existing test asserting what it was written to assert,
 * and keeps the production path — fetch, then install — the same code either way.
 */

import { CATALOGUES } from '../src/i18n/catalogues';
import { installCatalogue } from '../src/i18n';

for (const [locale, catalogue] of Object.entries(CATALOGUES)) {
  installCatalogue(locale, catalogue);
}

/**
 * Which countries have a page, in one place.
 *
 * `prerender-countries.mjs` writes them and `emit-sitemap.mjs` lists them, and a sitemap
 * that names a file nobody wrote — or misses one that exists — is the exact disagreement
 * `built-catalogue.mjs` exists to prevent between the record pages and their sitemap. So
 * the rule lives here and both import it.
 */

import { isCountry } from '../../src/domain/continents.ts';
import { slugFor } from '../../src/domain/countrySlug.ts';

/** The same test prerender-records.mjs uses to decide a record is worth a page. */
export const worthLinkingTo = (dish) =>
  dish.steps.length > 0 || dish.ingredients.length > 0 || (dish.prepSummary ?? '').trim();

/**
 * Every country with at least one record worth linking to, alphabetically.
 *
 * A country whose records are all bare gets nothing: the page would be a list of links
 * into pages with nothing on them. One whose name does not fold to a slug gets nothing
 * either — see `src/domain/countrySlug.ts`.
 *
 * And an origin that is not a country gets nothing, by the atlas's own test. "Levant",
 * "Mesoamerica", "the Maghreb" and the Ottoman Empire are origins this catalogue records
 * and none of them is a place with a flag; `catalogueMetrics` leaves them out of the
 * headline for exactly that reason, and a page at `/country/levant` would put them back
 * in by the back door. Their records stay reachable through the feed and `/browse`.
 */
export function countryPages(catalogue) {
  const byCountry = new Map();
  for (const dish of catalogue) {
    const country = dish.loc.country;
    if (!country) continue;
    if (!byCountry.has(country)) byCountry.set(country, []);
    byCountry.get(country).push(dish);
  }

  const pages = [];
  for (const [country, records] of [...byCountry].sort((a, b) => a[0].localeCompare(b[0]))) {
    const slug = slugFor(country);
    const linkable = records.filter(worthLinkingTo);
    if (!slug || !linkable.length || !isCountry(country)) continue;
    pages.push({ country, slug, records, linkable });
  }
  return { pages, countries: byCountry.size };
}

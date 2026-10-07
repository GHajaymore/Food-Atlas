/**
 * A country's address.
 *
 * `/browse?country=Morocco` is a query string, and a query string cannot be a file: every
 * one of them answers with the same `index.html`, which is why `prerender-records.mjs`
 * refuses to point 8,858 record pages at them. So a country that is worth landing on needs
 * a path of its own, and a path needs a slug.
 *
 * ## The rules, and what they are for
 *
 * Accents are folded (Côte d'Ivoire → cote-divoire), everything that is not a letter or a
 * digit becomes a single hyphen, and the result is lower case. Two different countries must
 * never fold onto one slug — `countryFor` resolves a slug by comparing slugs rather than by
 * un-slugging, so the catalogue itself decides what exists and a name the import carries
 * tomorrow needs no table here.
 *
 * Non-Latin names are the case this cannot serve: a country recorded only in its own script
 * folds to an empty slug and simply has no page, rather than one at `/country/`. Every
 * country in the atlas today is carried in Latin script — `scripts/prerender-countries.mjs`
 * skips anything that is not, and says so.
 */

/** Fold to ASCII letters and digits; everything else becomes a hyphen. */
export function slugFor(country: string): string {
  return country
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    /* Not a letter, not a digit: a space, an apostrophe, a bracket, a dash. */
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/** The country a slug names, decided by the names the catalogue actually holds. */
export function countryFor(slug: string, countries: Iterable<string>): string | undefined {
  const wanted = slug.toLowerCase();
  for (const country of countries) if (slugFor(country) === wanted) return country;
  return undefined;
}

/**
 * "prepared in United Kingdom".
 *
 * Every sentence on a record that names a place does it by substitution — `{place}` — and
 * a handful of English country names are ungrammatical without an article. A reader in the
 * United States met "What the atlas holds from United States", "it is not a record of how
 * it is prepared in United States", and "3 people connected to United States would meet
 * it". Roughly 1,400 records sit under one of these names.
 *
 * ## Only English, and only in a sentence
 *
 * The rule is a fact about English, not about the places: Spanish says "en Reino Unido" and
 * Japanese adds nothing at all. So this returns the name untouched for every other
 * language, which is exactly what happens today — no translation can be made worse by it.
 *
 * And only where the name sits inside prose. A heading, a breadcrumb, a card's place line
 * and the atlas directory are labels, and a label is "United Kingdom" in English as surely
 * as it is 英国 in Japanese.
 *
 * The list is the names this catalogue actually files records under, checked against it
 * rather than copied from a style guide: a name nobody uses is a line nobody can verify.
 */

const TAKES_THE = new Set([
  'Bahamas',
  'Central African Republic',
  'Czech Republic',
  'Czechoslovakia',
  'Democratic Republic of the Congo',
  'Dominican Republic',
  'Gambia',
  'Maldives',
  'Netherlands',
  'Philippines',
  'Seychelles',
  'Sudan',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
]);

/**
 * The place as it belongs in a sentence.
 *
 * Takes the name already chosen for display, so a caller that has translated it keeps
 * whatever `placeName` returned; the article is added only when the language is English
 * and the name is one of the few that needs it.
 */
export const placeInSentence = (place: string, locale?: string): string => {
  const name = place.trim();
  if (!name) return place;
  if (locale && !locale.toLowerCase().startsWith('en')) return place;
  return TAKES_THE.has(name) ? `the ${name}` : place;
};

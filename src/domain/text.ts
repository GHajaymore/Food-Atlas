/**
 * HTML entities, decoded — because in a recipe they are not cosmetic.
 *
 * 320 ingredient and method lines carry them, and the ones that appear are exactly the
 * characters a cook needs to read correctly:
 *
 *   &frac12; &frac14; &frac34; &frac13;   — quantities. "&frac12; tsp" is half a
 *                                            teaspoon, and a reader is entitled to see
 *                                            it as one.
 *   &deg;                                  — oven temperatures. "180&deg;C".
 *   &nbsp; &thinsp;                        — the space inside "2.5&nbsp;kg".
 *   &#189; &#8531; &#8532;                 — the same fractions written numerically.
 *   &eacute; &#353; &#322;                 — letters, in the names of foods.
 *
 * A dish's method is the product, and "&frac12; tsp" in it is worse than untidy: it is
 * the one field where being unreadable changes what somebody cooks.
 *
 * ## Why a table rather than the DOM
 *
 * `innerHTML` would decode all of these and is not available here — this code runs on
 * a phone as well as in a browser, and the build that produces the catalogue runs in
 * neither. A table is also auditable: what is on it is what gets decoded, and an entity
 * nobody has seen stays visible as itself rather than turning into something silently.
 */

/**
 * Named entities, kept to the ones this catalogue actually contains plus the five
 * every HTML text carries. Adding to it is cheap; guessing at it is not.
 */
const NAMED: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  thinsp: ' ',
  ensp: ' ',
  emsp: ' ',
  ndash: '–',
  mdash: '—',
  deg: '°',
  times: '×',
  rarr: '→',
  larr: '←',
  hellip: '…',
  frac12: '½',
  frac13: '⅓',
  frac23: '⅔',
  frac14: '¼',
  frac34: '¾',
  frac18: '⅛',
  eacute: 'é',
  egrave: 'è',
  agrave: 'à',
  ccedil: 'ç',
  uuml: 'ü',
  ouml: 'ö',
  auml: 'ä',
  ntilde: 'ñ',
  szlig: 'ß',
};

/**
 * `&#189;` and `&#x2153;`.
 *
 * Decoded arithmetically rather than from a table, since the numeric form covers every
 * character there is. Anything that does not resolve to a real code point is left
 * exactly as written — a mangled entity shown as itself is a visible fault, and one
 * silently replaced by a replacement character is not.
 */
function numeric(body: string): string | null {
  const hex = /^x([0-9a-f]+)$/i.exec(body);
  const code = hex ? Number.parseInt(hex[1], 16) : /^\d+$/.test(body) ? Number(body) : NaN;
  if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff) return null;
  try {
    return String.fromCodePoint(code);
  } catch {
    return null;
  }
}

export function decodeEntities(text: string): string {
  if (!text || !text.includes('&')) return text;

  return text.replace(/&(#?[a-z0-9]+);/gi, (whole, body: string) => {
    if (body.startsWith('#')) return numeric(body.slice(1)) ?? whole;
    return NAMED[body.toLowerCase()] ?? whole;
  });
}

/**
 * Sentence-case a name that arrives lowercase.
 *
 * Wikidata labels common nouns in lower case — "popcorn", "pea soup", "chimichurri" —
 * and UNESCO writes its dish inside a sentence, so "ceviche" and "tea" came out of the
 * inscriptions in lower case too. 1,368 records were affected, and on a shelf beside
 * "Kozhikode Halwa" and "Neapolitan Pizza Margherita" they read as a mistake rather
 * than as a convention.
 *
 * Only the first letter, and only when it is a lower-case letter: nothing else about
 * the name is touched. "il-Ftira" becomes "Il-Ftira"; a name in a non-Latin script has
 * no case and is returned unchanged.
 *
 * Lives here rather than in `build.ts` because what a person types now gets the same
 * treatment as what the import reads — see `domain/entry.ts`. Two copies of this rule
 * would be two rules the moment either was edited.
 */
export const sentenceCase = (name: string): string =>
  /^\p{Ll}/u.test(name) ? name[0].toUpperCase() + name.slice(1) : name;

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

/**
 * A country after a preposition, in German and Dutch, as those languages say it.
 *
 * German readers met "nicht, wie es in Vereinigte Staaten zubereitet wird" and Dutch
 * ones "uit Verenigde Staten": the name was dropped bare into a sentence that wants an
 * article and, in German, a case. Every German sentence here that takes a place puts it
 * after in, aus, zu, unter or von — all dative — so one dative form per country serves
 * them all, and Dutch needs only the article. Keyed by the name `Intl.DisplayNames` gives,
 * which is what `placeName` hands over; regions and cities need nothing and are not here.
 *
 * French and Italian are not here, and that is deliberate: their preposition merges with
 * the article ("aux États-Unis", "negli Stati Uniti", "dall'Italia") and depends on each
 * country's gender, so they need the sentence rebuilt rather than a name swapped.
 */
const AFTER_PREPOSITION: Record<string, Record<string, string>> = {
  de: {
    'Vereinigte Staaten': 'den Vereinigten Staaten',
    'Vereinigtes Königreich': 'dem Vereinigten Königreich',
    Schweiz: 'der Schweiz',
    Türkei: 'der Türkei',
    Iran: 'dem Iran',
    Irak: 'dem Irak',
    Libanon: 'dem Libanon',
    Sudan: 'dem Sudan',
    Südsudan: 'dem Südsudan',
    Jemen: 'dem Jemen',
    Tschad: 'dem Tschad',
    Niger: 'dem Niger',
    Mongolei: 'der Mongolei',
    Slowakei: 'der Slowakei',
    Ukraine: 'der Ukraine',
    Niederlande: 'den Niederlanden',
    Philippinen: 'den Philippinen',
    Malediven: 'den Malediven',
    Seychellen: 'den Seychellen',
    Bahamas: 'den Bahamas',
    Komoren: 'den Komoren',
    'Vereinigte Arabische Emirate': 'den Vereinigten Arabischen Emiraten',
    'Dominikanische Republik': 'der Dominikanischen Republik',
    'Zentralafrikanische Republik': 'der Zentralafrikanischen Republik',
  },
  nl: {
    'Verenigde Staten': 'de Verenigde Staten',
    'Verenigd Koninkrijk': 'het Verenigd Koninkrijk',
    Filipijnen: 'de Filipijnen',
    Maldiven: 'de Maldiven',
    Seychellen: 'de Seychellen',
    'Bahama’s': 'de Bahama’s',
    Comoren: 'de Comoren',
    'Verenigde Arabische Emiraten': 'de Verenigde Arabische Emiraten',
    'Dominicaanse Republiek': 'de Dominicaanse Republiek',
    'Centraal-Afrikaanse Republiek': 'de Centraal-Afrikaanse Republiek',
  },
};

/** The place as it reads after a preposition in the reader's language. */
export const placeAfterPreposition = (place: string, locale?: string): string => {
  const lang = (locale ?? 'en').toLowerCase().slice(0, 2);
  if (lang === 'en') return placeInSentence(place, locale);
  return AFTER_PREPOSITION[lang]?.[place.trim()] ?? place;
};

/*
 * German contracts a preposition with the dative article: in dem → im, zu dem → zum,
 * zu der → zur, von dem → vom. Only where the preposition stands right before the place —
 * so a relative clause elsewhere in the sentence ("der Ort, in dem …") is never touched.
 */
const DE_CONTRACT: Record<string, string> = {
  'in dem': 'im',
  'zu dem': 'zum',
  'zu der': 'zur',
  'von dem': 'vom',
  'an dem': 'am',
};

/** Put a place into a sentence where `token` stands, with the article and case it needs. */
export function fillPlace(template: string, token: string, place: string, locale?: string): string {
  const inserted = placeAfterPreposition(place, locale);
  if (!(locale ?? '').toLowerCase().startsWith('de') || inserted === place) {
    return template.split(token).join(inserted);
  }
  const article = inserted.split(' ')[0];
  const rest = inserted.slice(article.length + 1);
  const escaped = token.replace(/[{}]/g, '\\$&');
  return template
    .replace(new RegExp(`(\\S+)\\s+${escaped}`, 'g'), (_whole, preposition: string) => {
      const merged = DE_CONTRACT[`${preposition.toLowerCase()} ${article}`];
      if (!merged) return `${preposition} ${inserted}`;
      const cased = preposition[0] === preposition[0].toUpperCase() ? merged[0].toUpperCase() + merged.slice(1) : merged;
      return `${cased} ${rest}`;
    })
    .split(token)
    .join(inserted);
}

import { COUNTRY_CODE } from './countryCodes';

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

/*
 * French: the preposition merges with the country's article, so the form depends on
 * gender, number and first letter — en Inde, au Japon, aux États-Unis, à Cuba; d'Inde,
 * du Japon, des États-Unis. "à" has two senses in these sentences: where something is
 * made (en/au/aux) and what people are tied to — "liées à" (à la/au/aux). Keyed by the
 * names `Intl.DisplayNames` gives in French; a region or a city is left as it is.
 */
const FR_PLURAL = new Set(['Bahamas', 'Bermudes', 'Comores', 'Émirats arabes unis', 'États-Unis', 'Maldives', 'Pays-Bas', 'Philippines', 'Seychelles', 'Îles Marshall', 'Îles Salomon', 'Territoires palestiniens', 'Fidji']);
const FR_NO_ARTICLE = new Set(['Aruba', 'Bahreïn', 'Chypre', 'Cuba', 'Curaçao', 'Djibouti', 'Guam', 'Kiribati', 'Madagascar', 'Malte', 'Maurice', 'Monaco', 'Nauru', 'Oman', 'Porto Rico', 'Saint-Christophe-et-Niévès', 'Saint-Marin', 'Saint-Vincent-et-les Grenadines', 'Sainte-Lucie', 'Sao Tomé-et-Principe', 'Singapour', 'Taïwan', 'Tonga', 'Trinité-et-Tobago', 'Tuvalu', 'Antigua-et-Barbuda', 'La Réunion', 'R.A.S. chinoise de Hong Kong', 'R.A.S. chinoise de Macao', 'Samoa', 'Palaos']);
/* Islands whose name keeps its article: à la Grenade, de la Dominique. */
const FR_ISLAND_FEMININE = new Set(['Grenade', 'Dominique', 'Barbade']);
/* Countries named without an article that still say "en": en Israël, en Haïti. */
const FR_EN_NO_ARTICLE = new Set(['Israël', 'Haïti']);
/* Masculine although the name ends in -e. */
const FR_MASCULINE_E = new Set(['Mexique', 'Cambodge', 'Mozambique', 'Zimbabwe', 'Belize', 'Suriname']);
const FR_FEMININE_EXTRA = new Set(['Sierra Leone']);

const frVowel = (s: string) => /^[aeiouâàéèêëîïôöûüAEIOUÂÀÉÈÊËÎÏÔÖÛÜ]/.test(s);

/** The French forms of a country, or null for a name that is not one. */
function frenchForms(name: string, countries: Set<string>): { loc: string; de: string; rel: string } | null {
  if (!countries.has(name) || name.startsWith('État de la Cité')) return null;
  if (FR_PLURAL.has(name)) return { loc: `aux ${name}`, de: `des ${name}`, rel: `aux ${name}` };
  if (FR_ISLAND_FEMININE.has(name)) return { loc: `à la ${name}`, de: `de la ${name}`, rel: `à la ${name}` };
  if (FR_EN_NO_ARTICLE.has(name)) return { loc: `en ${name}`, de: `d’${name}`, rel: `à ${name}` };
  if (FR_NO_ARTICLE.has(name)) return { loc: `à ${name}`, de: frVowel(name) ? `d’${name}` : `de ${name}`, rel: `à ${name}` };
  const first = name.split(/[\s-]/)[0];
  const feminine = FR_FEMININE_EXTRA.has(name) || (/e$/.test(first) && !FR_MASCULINE_E.has(first));
  if (frVowel(name)) return { loc: `en ${name}`, de: `d’${name}`, rel: `à l’${name}` };
  if (feminine) return { loc: `en ${name}`, de: `de ${name}`, rel: `à la ${name}` };
  return { loc: `au ${name}`, de: `du ${name}`, rel: `au ${name}` };
}

/*
 * Italian, for where something is made — "in {place}" and "a {place}": in Italia, but
 * negli Stati Uniti, nel Regno Unito, and a Cuba. The sentences that would need da, di
 * or "legate a" with a country's article ("dall'Italia", "al Giappone") are worded in
 * the catalogue so the place stands after a neutral noun instead: a gender table for 212
 * countries, with Italian's exceptions, would be a new source of exactly this fault.
 */
const IT_ARTICLE: Record<string, string> = {
  'Stati Uniti': 'negli', 'Emirati Arabi Uniti': 'negli', 'Paesi Bassi': 'nei', 'Territori Palestinesi': 'nei',
  Filippine: 'nelle', Maldive: 'nelle', Seychelles: 'nelle', Comore: 'nelle', Bahamas: 'nelle', Bermuda: 'nelle',
  'Isole Marshall': 'nelle', 'Isole Salomone': 'nelle', 'Regno Unito': 'nel', 'Repubblica Centrafricana': 'nella',
  'Repubblica Dominicana': 'nella', 'Città del Vaticano': 'nella',
};
const IT_ISLAND = new Set(['Cuba', 'Malta', 'Cipro', 'Singapore', 'Taiwan', 'Haiti', 'Mauritius', 'Monaco', 'San Marino', 'Portorico', 'Aruba', 'Curaçao', 'Guam', 'Samoa', 'Tonga', 'Nauru', 'Tuvalu', 'Palau', 'Kiribati', 'Trinidad e Tobago', 'Saint Lucia', 'Saint Kitts e Nevis', 'Saint Vincent e Grenadine', 'São Tomé e Príncipe', 'Antigua e Barbuda', 'Barbados', 'Grenada', 'Dominica', 'Bahrein', 'RAS di Hong Kong', 'RAS di Macao']);

/** Every country name `Intl.DisplayNames` gives in a language, so a region is never mistaken for one. */
const countryNamesCache = new Map<string, Set<string>>();
function countryNames(lang: string): Set<string> {
  let names = countryNamesCache.get(lang);
  if (!names) {
    names = new Set<string>();
    try {
      const display = new Intl.DisplayNames([lang], { type: 'region' });
      for (const code of new Set(Object.values(COUNTRY_CODE))) {
        const name = display.of(code);
        if (name) names.add(name);
      }
    } catch {
      /* No Intl.DisplayNames: nothing is treated as a country, and the name goes in as given. */
    }
    countryNamesCache.set(lang, names);
  }
  return names;
}

/** Put a place into a sentence where `token` stands, with the article and case it needs. */
export function fillPlace(template: string, token: string, place: string, locale?: string): string {
  const lang = (locale ?? 'en').toLowerCase().slice(0, 2);
  const escapedToken = token.replace(/[{}]/g, '\\$&');
  if (lang === 'fr') {
    const forms = frenchForms(place.trim(), countryNames('fr'));
    if (!forms) return template.split(token).join(place);
    return template
      .replace(new RegExp(`(\\S+\\s+)?(à|À|de|De)\\s+${escapedToken}`, 'g'), (_w, before: string | undefined, prep: string) => {
        const lead = before ?? '';
        const relation = /li[ée]e?s?\s+$/i.test(lead);
        const form = /^[àÀ]$/.test(prep) ? (relation ? forms.rel : forms.loc) : forms.de;
        return lead + (prep[0] === prep[0].toUpperCase() ? form[0].toUpperCase() + form.slice(1) : form);
      })
      .split(token)
      .join(place);
  }
  if (lang === 'it') {
    const name = place.trim();
    if (!countryNames('it').has(name)) return template.split(token).join(place);
    const form = IT_ISLAND.has(name) ? `a ${name}` : IT_ARTICLE[name] ? `${IT_ARTICLE[name]} ${name}` : `in ${name}`;
    return template
      .replace(new RegExp(`\\b(in|a)\\s+${escapedToken}`, 'g'), form)
      .split(token)
      .join(place);
  }
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

/**
 * One country, one name.
 *
 * The four sources name places in whatever form their editors used, and the country
 * picker showed the results side by side:
 *
 *   China 705   +   People's Republic of China 120
 *   Turkey 230  +   Türkiye 2
 *   Côte d'Ivoire 2  +  Ivory Coast 3
 *
 * A reader browsing by place found 825 Chinese traditions split across two entries,
 * with no way to tell that the smaller one was not a different country.
 *
 * ## What is deliberately not merged
 *
 * "Republic of China" is Taiwan and "Democratic People's Republic of Korea" is North
 * Korea. Both fold onto their larger neighbour under any rule that strips
 * "Republic of", and merging either would be a political claim this app has no
 * business making — the first draft of this did exactly that before the names were
 * read rather than pattern-matched.
 *
 * So the map is a written list of synonyms, not a normalisation. Every entry is two
 * names for one state. Historical states are absent for the same reason: the
 * Byzantine Empire is not modern Turkey and a dish attributed to it is telling the
 * reader something true.
 */

/** Alternate name → the name this atlas uses. */
const ALIASES: Record<string, string> = {
  // China.
  "People's Republic of China": 'China',
  'Peoples Republic of China': 'China',
  'PR China': 'China',
  'Mainland China': 'China',

  /*
   * The Republic of China is Taiwan — its official name beside its common one, the
   * same relation "Republic of Korea" has to South Korea. That is a fact about
   * naming and it belongs here.
   *
   * What does not belong here is folding either of them into China. Whether Taiwan
   * is a separate state is a question this app has no business answering, and a rule
   * that stripped "Republic of" would have answered it by accident.
   */
  'Republic of China': 'Taiwan',
  'Chinese Taipei': 'Taiwan',
  "Democratic People's Republic of Korea": 'North Korea',

  // Renamings the sources have not caught up with.
  Türkiye: 'Turkey',
  Turkiye: 'Turkey',
  Burma: 'Myanmar',
  Swaziland: 'Eswatini',
  Czechia: 'Czech Republic',
  'Cabo Verde': 'Cape Verde',
  'Timor-Leste': 'East Timor',
  Macedonia: 'North Macedonia',
  'Republic of Macedonia': 'North Macedonia',

  // Same state, different convention.
  'Ivory Coast': "Côte d'Ivoire",
  Holland: 'Netherlands',
  'The Netherlands': 'Netherlands',
  'United States of America': 'United States',
  USA: 'United States',
  'U.S.': 'United States',
  'Great Britain': 'United Kingdom',
  Britain: 'United Kingdom',
  UK: 'United Kingdom',
  'Republic of Ireland': 'Ireland',
  'Republic of Korea': 'South Korea',
  'Kingdom of France': 'France',
  'Russian Federation': 'Russia',
  'Viet Nam': 'Vietnam',
  'Kingdom of Spain': 'Spain',
  'Kingdom of Thailand': 'Thailand',
  'State of Israel': 'Israel',
  'Arab Republic of Egypt': 'Egypt',
  'Federal Republic of Germany': 'Germany',
  'Republic of India': 'India',
  'Republic of the Philippines': 'Philippines',
  'Bolivarian Republic of Venezuela': 'Venezuela',
  'United Republic of Tanzania': 'Tanzania',
  'Republic of South Africa': 'South Africa',
};

/** Case- and accent-insensitive lookup, so a source's capitalisation cannot defeat it. */
const LOOKUP = new Map(
  Object.entries(ALIASES).map(([from, to]) => [
    from
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z]/g, ''),
    to,
  ]),
);

/** The name this atlas uses for a country, or the name given if it knows no other. */
export function canonicalCountry(name: string): string {
  const given = (name ?? '').trim();
  if (!given) return given;

  const key = given
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');

  return LOOKUP.get(key) ?? given;
}

/** True when two names are the same country under different conventions. */
export const sameCountry = (a: string, b: string): boolean =>
  canonicalCountry(a).toLowerCase() === canonicalCountry(b).toLowerCase();

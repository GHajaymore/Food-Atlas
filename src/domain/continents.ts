/**
 * Country to continent.
 *
 * The atlas groups by continent and the country-level place picker does too, so
 * every country in the catalogue needs one. With six seed records a literal map was
 * enough; with a couple of hundred countries it is not, so the imported catalogue
 * registers its own mapping at load and this module holds the merged result.
 *
 * A country with no mapping falls to 'Elsewhere' rather than being dropped — a
 * missing continent should never make a tradition unreachable.
 */

/**
 * Country to continent, covering the whole catalogue.
 *
 * This started as six entries for the seed and left 81 real countries sitting in
 * "Elsewhere" once the atlas went global — which read as a bug rather than as a
 * geography. Historical states and empires are mapped too, because Wikidata's
 * country-of-origin cheerfully returns Ottoman Empire and Joseon, and a dish is no
 * less placed for having outlived its state.
 */
const build = (continent: string, countries: string[]): [string, string][] =>
  countries.map((country) => [country, continent]);

const CONTINENTS = new Map<string, string>([
  ...build('Asia', [
    'India', 'Mongolia', 'China', "People's Republic of China", 'Japan', 'South Korea', 'North Korea', 'Taiwan',
    'Thailand', 'Vietnam', 'Indonesia', 'Malaysia', 'Philippines', 'Singapore', 'Myanmar', 'Burma', 'Cambodia',
    'Laos', 'Brunei', 'East Timor', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives',
    'Afghanistan', 'Iran', 'Iraq', 'Turkey', 'Israel', 'Lebanon', 'Syria', 'Jordan', 'Saudi Arabia', 'Yemen',
    'Oman', 'Kuwait', 'Qatar', 'Bahrain', 'United Arab Emirates', 'Uzbekistan', 'Kazakhstan', 'Kyrgyzstan',
    'Tajikistan', 'Turkmenistan', 'Georgia', 'Armenia', 'Azerbaijan', 'Hong Kong', 'Macau', 'Tibet',
    'Palestine', 'State of Palestine', 'Palestinian National Authority', 'Northern Cyprus', 'Cyprus',
    // Historical
    'Ottoman Empire', 'Joseon', 'Goryeo', 'Yuan dynasty', 'Ming dynasty', 'Qing dynasty', 'Song dynasty',
    'Tang dynasty', 'Han dynasty', 'Mughal Empire', 'Persia', 'Safavid Iran', 'Abbasid Caliphate', 'Silla',
    'Ryukyu Kingdom', 'Siam', 'Ceylon',
  ]),
  ...build('Europe', [
    'Italy', 'Iceland', 'France', 'Spain', 'Portugal', 'Germany', 'United Kingdom', 'England', 'Scotland',
    'Wales', 'Northern Ireland', 'Ireland', 'Greece', 'Netherlands', 'Belgium', 'Luxembourg', 'Switzerland',
    'Austria', 'Poland', 'Czech Republic', 'Czechia', 'Slovakia', 'Hungary', 'Romania', 'Bulgaria', 'Serbia',
    'Croatia', 'Slovenia', 'Bosnia and Herzegovina', 'Montenegro', 'Albania', 'North Macedonia', 'Kosovo',
    'Sweden', 'Norway', 'Denmark', 'Finland', 'Estonia', 'Latvia', 'Lithuania', 'Russia', 'Ukraine', 'Belarus',
    'Moldova', 'Malta', 'Andorra', 'Monaco', 'San Marino', 'Liechtenstein', 'Vatican City', 'Abkhazia',
    'South Ossetia', 'Transnistria',
    // Historical
    'Soviet Union', 'Czechoslovakia', 'Yugoslavia', 'Holy Roman Empire', 'Austrian Empire', 'Austria-Hungary',
    'Ancient Rome', 'Ancient Greece', 'Kievan Rus\'', 'Grand Duchy of Lithuania', 'Prussia', 'East Germany',
    'Republic of Venice', 'Kingdom of Naples', 'Byzantine Empire', 'Roman Empire',
  ]),
  ...build('Africa', [
    'Egypt', 'Morocco', 'Algeria', 'Tunisia', 'Libya', 'Sudan', 'South Sudan', 'Ethiopia', 'Eritrea', 'Somalia',
    'Djibouti', 'Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Burundi', 'Nigeria', 'Ghana', 'Senegal', 'Mali',
    'Ivory Coast', "Côte d'Ivoire", 'Cameroon', 'South Africa', 'Zimbabwe', 'Zambia', 'Mozambique', 'Angola',
    'Namibia', 'Botswana', 'Madagascar', 'Congo', 'Republic of the Congo', 'Democratic Republic of the Congo',
    'Benin', 'Burkina Faso', 'Niger', 'Chad', 'Guinea', 'Guinea-Bissau', 'Sierra Leone', 'Liberia', 'Togo',
    'Gambia', 'Mauritania', 'Malawi', 'Lesotho', 'Eswatini', 'Swaziland', 'Mauritius', 'Seychelles',
    'Cape Verde', 'Comoros', 'Gabon', 'Equatorial Guinea', 'Central African Republic', 'São Tomé and Príncipe',
    'Western Sahara', 'Réunion', 'Zanzibar',
  ]),
  ...build('North America', [
    'Mexico', 'Canada', 'United States', 'United States of America', 'Guatemala', 'Belize', 'Honduras',
    'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic',
    'Puerto Rico', 'Trinidad and Tobago', 'Barbados', 'Bahamas', 'Dominica', 'Grenada', 'Saint Lucia',
    'Antigua and Barbuda', 'Saint Kitts and Nevis', 'Saint Vincent and the Grenadines', 'Aruba', 'Curaçao',
    'Martinique', 'Guadeloupe', 'Bermuda', 'Greenland', 'Aztec Empire', 'Maya civilization', 'New France',
  ]),
  ...build('South America', [
    'Brazil', 'Argentina', 'Peru', 'Colombia', 'Chile', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay',
    'Uruguay', 'Guyana', 'Suriname', 'French Guiana', 'Inca Empire',
  ]),
  ...build('Oceania', [
    'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Samoa', 'Tonga', 'Vanuatu', 'Solomon Islands',
    'Kiribati', 'Micronesia', 'Palau', 'Marshall Islands', 'Nauru', 'Tuvalu', 'Hawaii', 'New Caledonia',
    'French Polynesia', 'Guam',
  ]),
]);

/** Merge in mappings discovered by the importer. Existing entries win. */
export function registerContinents(entries: Iterable<[string, string]>): void {
  for (const [country, continent] of entries) {
    if (country && continent && !CONTINENTS.has(country)) CONTINENTS.set(country, continent);
  }
}

export const continentOf = (country: string): string => CONTINENTS.get(country) ?? 'Elsewhere';

/**
 * Whether this origin is a country, as opposed to something broader or older.
 *
 * Wikidata's "country of origin" is not always a country. Seventy-nine records in this
 * atlas are filed under Levant, Asia, Mesoamerica, the Maghreb, the Ottoman Empire,
 * the Polish–Lithuanian Commonwealth and twenty-seven more of the same kind. Each was
 * being counted as a country, which put "32 countries" in the Elsewhere group and
 * added them to the headline: the atlas claimed 202 countries and had about 170.
 *
 * That number is the one the coverage screen exists to state honestly, so it is the
 * one that must not be inflated by a value that is not a country.
 *
 * The records themselves are kept and so is the origin as the source states it. Sixty
 * of them are the only record of that dish — gefilte fish, kugel, aşure, popcorn — and
 * a broader origin is a fact about the dish, not a reason to delete it. Nor is one
 * guessed at: "Levant" is not narrowed to a country here, because choosing which one
 * is exactly the argument this atlas refuses to settle on a reader's behalf.
 *
 * Tested by whether the origin sits on a continent, **not** by whether the map has
 * heard of it. `registerContinents` adds every pair the import carries, and the import
 * carries `["Levant", "Elsewhere"]` — so a membership test says yes to exactly the
 * values this is meant to exclude. That is the shape of the first attempt, and it
 * changed nothing on the screen.
 */
export const isCountry = (country: string): boolean => {
  const continent = CONTINENTS.get(country);
  return Boolean(continent) && continent !== 'Elsewhere';
};

/** Continent display order — the atlas reads better geographically than alphabetically. */
export const CONTINENT_ORDER = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
  'Elsewhere',
];

export const continentRank = (label: string): number => {
  const index = CONTINENT_ORDER.indexOf(label);
  return index === -1 ? CONTINENT_ORDER.length : index;
};

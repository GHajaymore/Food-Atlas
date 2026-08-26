import type { Copy } from '../i18n/copy';
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

/**
 * States that no longer exist.
 *
 * Every one of these is deliberately in the map above, and should stay there: a dish
 * recorded as Ottoman or Joseon needs a continent or it becomes unreachable, and it is
 * no less placed for having outlived its state.
 *
 * What they are not is countries, and the atlas counts countries. Fourteen of them
 * carry records, so the headline said 170 while the honest figure was 156. Listed
 * again rather than parsed out of the map because a comment reading `// Historical`
 * is a note to a person; this is the same knowledge in a form the code can use, and
 * the test below keeps the two from drifting apart.
 */
const HISTORICAL = new Set([
  // Asia
  'Ottoman Empire', 'Joseon', 'Goryeo', 'Yuan dynasty', 'Ming dynasty', 'Qing dynasty', 'Song dynasty',
  'Tang dynasty', 'Han dynasty', 'Mughal Empire', 'Persia', 'Safavid Iran', 'Abbasid Caliphate', 'Silla',
  'Ryukyu Kingdom', 'Siam', 'Ceylon',
  // Europe
  'Soviet Union', 'Czechoslovakia', 'Yugoslavia', 'Holy Roman Empire', 'Austrian Empire', 'Austria-Hungary',
  'Ancient Rome', 'Ancient Greece', "Kievan Rus'", 'Grand Duchy of Lithuania', 'Prussia', 'East Germany',
  'Republic of Venice', 'Kingdom of Naples', 'Byzantine Empire', 'Roman Empire',
  // The Americas
  'Aztec Empire', 'Maya civilization', 'New France', 'Inca Empire',
]);

/** Whether an origin names a state that has since ended. */
export const isHistoricalState = (country: string): boolean => HISTORICAL.has(country);

/**
 * What an origin is, where it is not a country — three words for a list row.
 *
 * Said rather than hidden. The alternative is a country picker that lists Byzantine
 * Empire between Bulgaria and Croatia and lets the reader work it out.
 */
export function placeKind(origin: string): string {
  if (isHistoricalState(origin)) return 'former state';
  if (isCountry(origin)) return '';
  return 'wider region';
}

/**
 * Merge in mappings discovered by the importer. Existing entries win.
 *
 * A continent is refused as a country. Nine records do carry a continent in the country
 * field — "Africa", "Asia", "Europe", "North America", "South America" — and they are
 * already handled correctly without this line: the import files each of them as
 * `Elsewhere`, so the pair registered is `Africa → Elsewhere`, `isCountry` is already
 * false, and the row already shows under "Beyond one country".
 *
 * So this guard is belt to an existing pair of braces, and it is recorded as such rather
 * than dressed up as a fix. I found the nine records while translating the continent
 * headings, saw "Africa · 2" sitting under a Japanese heading, and concluded the importer
 * had registered `Africa → Africa` — without checking the value it actually registers.
 * The comment on `isCountry` below already warns about precisely this: the import carries
 * `["Levant", "Elsewhere"]`, so reasoning about membership without reading the value is
 * how you get an answer that "changed nothing on the screen". It changed nothing here
 * either.
 *
 * It stays because the invariant is worth stating — a continent is not a country under
 * any import — and because the test beside it fails loudly if a future import ever does
 * send `Africa → Africa`. It is not load-bearing today.
 */
export function registerContinents(entries: Iterable<[string, string]>): void {
  for (const [country, continent] of entries) {
    if (!country || !continent) continue;
    if (CONTINENT_ORDER.includes(country)) continue;
    if (!CONTINENTS.has(country)) CONTINENTS.set(country, continent);
  }
}

export const continentOf = (country: string): string => CONTINENTS.get(country) ?? 'Elsewhere';

/**
 * The atlas's own spelling of a country, matched without regard to case or accents.
 *
 * Needed because `canonicalCountry` only knows *aliases* — "USA", "Republic of India" —
 * so a country typed in the atlas's own words but in lower case came back unchanged, and
 * "india" is a different country from "India" to every index in the app. The set of
 * countries the atlas actually files under is exactly what is registered here by the
 * import, which makes this the only place that can answer it.
 *
 * Returns empty when nothing matches, so a caller can tell "the atlas knows this place"
 * from "the atlas has never heard of it" — and a person naming somewhere unrecorded is
 * the case this project exists for, never an error.
 */
export function knownCountry(name: string): string {
  const wanted = fold(name);
  if (!wanted) return '';
  for (const country of CONTINENTS.keys()) if (fold(country) === wanted) return country;
  return '';
}

const fold = (value: string): string =>
  (value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');

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
  if (isHistoricalState(country)) return false;
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

/**
 * Every country the atlas can actually file a record under, alphabetically.
 *
 * For choosers rather than for prose. A proposal typed as free text arrives as "USA",
 * "Untied States" or somewhere the continent map has never heard of, and the record then
 * cannot be placed — which is the same fault, entered by hand, that this session spent a
 * long time repairing in the imported data.
 *
 * `isCountry` rather than every key, so the list offers only places a record can sit on:
 * "Levant" and "Ottoman Empire" are true answers to where a food comes from and are not
 * countries, and a chooser that offers them would be inviting a record it cannot file.
 *
 * Empty until `registerContinents` has run, which the import does at build time — so this
 * is only meaningful once the catalogue has loaded, and every screen that offers it renders
 * after that.
 */
export const filableCountries = (): string[] =>
  [...CONTINENTS.keys()].filter(isCountry).sort((a, b) => a.localeCompare(b));

/**
 * What to call a continent group on screen.
 *
 * Only one name changes: **Elsewhere**. It is the bucket `continentOf` falls back to, and
 * `isCountry` tests against it, so the value is load-bearing and stays exactly as it is —
 * this renames the label a reader sees and nothing else.
 *
 * Measured before renaming it: 53 records across 29 origins, and not one of them is a
 * country the atlas failed to place. They are Levant (8), "Croatia, Slovenia" (5), Eastern
 * Europe, Latin America, the Maghreb, the Indian subcontinent, the Middle East — origins
 * genuinely wider than a country, which is precisely what `isCountry` says they are.
 *
 * "Elsewhere" tells a reader those are the leftovers. On a project whose claim is that
 * coverage is stated honestly, it was the one heading on the page that misdescribed what
 * sat under it.
 *
 * The six real continents still come through untranslated, which is a separate and larger
 * gap recorded in docs/queue.md: they are data, not chrome.
 */
/**
 * Which copy key names each continent.
 *
 * The values on the left are the ones `continentOf` produces and `isCountry` tests
 * against; nothing here changes them. This maps them to the words a reader sees.
 *
 * These six were the last reader-facing English in the chrome — the atlas directory and
 * the coverage table printed "Africa" and "Europe" to a Japanese reader. They had been
 * recorded as data rather than chrome, which was true of where they come from and not of
 * where they are shown.
 */
const CONTINENT_KEYS: Record<string, keyof Copy> = {
  Africa: 'continentAfrica',
  Asia: 'continentAsia',
  Europe: 'continentEurope',
  'North America': 'continentNorthAmerica',
  'South America': 'continentSouthAmerica',
  Oceania: 'continentOceania',
  Elsewhere: 'continentBeyondOneCountry',
};

export const continentLabel = (continent: string, copy: Copy): string => {
  const key = CONTINENT_KEYS[continent];
  /* Unmapped is possible — the import registers whatever the sources carry — and the
     honest answer there is the value itself rather than a blank heading. */
  return key ? copy[key] : continent;
};

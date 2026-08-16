/**
 * The country a published recipe already names in its own title.
 *
 *   node scripts/resolve-cookbook-countries.mjs [--dry]
 *
 * The Cookbook holds 3,442 recipes and every one of them has a written method, which
 * makes it the single richest source of the thing this app is actually for. Only
 * 1,059 reached the catalogue. The other 2,383 were dropped for having no country,
 * because a record with no place cannot go in an atlas of where food comes from.
 *
 * Most of them do have a place. It is in the title:
 *
 *   Aadun (Nigerian Corn Flour with Palm Oil)
 *   Akabenz (Rwandan Fried Chicken)
 *   Albanian Fried Meatballs
 *   Accra Cassava (Cameroonian Cassava Fritters)
 *
 * The Wikibooks ingest read categories, where the country is often absent, and never
 * looked at the name.
 *
 * ## Why reading the title is honest and guessing is not
 *
 * "Nigerian" in a recipe's title is the recipe author's own statement about the food.
 * Taking it is reading a source, which is what every other ingest here does.
 *
 * What this deliberately will not do is infer. Beef Stroganoff is Russian and
 * Stroganoff is not a demonym, so it stays unresolved; a dish named only "Acorn
 * Crusted Salmon" has no place and is not given one. The moment this starts applying
 * culinary knowledge rather than reading text, it is inventing provenance — and
 * these records are Modern Adaptations precisely because nobody has confirmed where
 * or how they are really made.
 *
 * Continental adjectives are refused for the same reason: "African Cabbage Stew"
 * names no country, and picking one would be a fabrication rather than a reading.
 *
 * A demonym is only accepted as a whole word, so "Turkey" the bird does not become
 * Türkiye and "Chile" the pepper does not become the country. Those two are the
 * reason this is a word-boundary match against a curated list rather than a substring
 * scan.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const COOKBOOK = resolve(HERE, '../src/data/cookbook.json');

/**
 * Demonym to country.
 *
 * The country names must match what the continent map already knows, since that map
 * is the whitelist the catalogue filters on — a country spelled differently here
 * would resolve and then be dropped again downstream.
 */
const DEMONYMS = {
  Afghan: 'Afghanistan',
  Albanian: 'Albania',
  Algerian: 'Algeria',
  American: 'United States',
  Angolan: 'Angola',
  Argentine: 'Argentina',
  Argentinian: 'Argentina',
  Armenian: 'Armenia',
  Australian: 'Australia',
  Austrian: 'Austria',
  Azerbaijani: 'Azerbaijan',
  Bahamian: 'Bahamas',
  Bahraini: 'Bahrain',
  Bangladeshi: 'Bangladesh',
  Barbadian: 'Barbados',
  Belarusian: 'Belarus',
  Belgian: 'Belgium',
  Belizean: 'Belize',
  Beninese: 'Benin',
  Bhutanese: 'Bhutan',
  Bolivian: 'Bolivia',
  Bosnian: 'Bosnia and Herzegovina',
  Botswanan: 'Botswana',
  Brazilian: 'Brazil',
  British: 'United Kingdom',
  Bruneian: 'Brunei',
  Bulgarian: 'Bulgaria',
  Burkinabe: 'Burkina Faso',
  Burmese: 'Myanmar',
  Burundian: 'Burundi',
  Cambodian: 'Cambodia',
  Cameroonian: 'Cameroon',
  Canadian: 'Canada',
  Chadian: 'Chad',
  Chilean: 'Chile',
  Chinese: 'China',
  Colombian: 'Colombia',
  Congolese: 'Democratic Republic of the Congo',
  Croatian: 'Croatia',
  Cuban: 'Cuba',
  Cypriot: 'Cyprus',
  Czech: 'Czech Republic',
  Danish: 'Denmark',
  Dominican: 'Dominican Republic',
  Dutch: 'Netherlands',
  Ecuadorian: 'Ecuador',
  Egyptian: 'Egypt',
  Emirati: 'United Arab Emirates',
  English: 'United Kingdom',
  Eritrean: 'Eritrea',
  Estonian: 'Estonia',
  Ethiopian: 'Ethiopia',
  Fijian: 'Fiji',
  Filipino: 'Philippines',
  Finnish: 'Finland',
  French: 'France',
  Gabonese: 'Gabon',
  Gambian: 'Gambia',
  Georgian: 'Georgia',
  German: 'Germany',
  Ghanaian: 'Ghana',
  Greek: 'Greece',
  Guatemalan: 'Guatemala',
  Guinean: 'Guinea',
  Guyanese: 'Guyana',
  Haitian: 'Haiti',
  Honduran: 'Honduras',
  Hungarian: 'Hungary',
  Icelandic: 'Iceland',
  Indian: 'India',
  Indonesian: 'Indonesia',
  Iranian: 'Iran',
  Iraqi: 'Iraq',
  Irish: 'Ireland',
  Israeli: 'Israel',
  Italian: 'Italy',
  Ivorian: "Côte d'Ivoire",
  Jamaican: 'Jamaica',
  Japanese: 'Japan',
  Jordanian: 'Jordan',
  Kazakh: 'Kazakhstan',
  Kenyan: 'Kenya',
  Korean: 'South Korea',
  Kuwaiti: 'Kuwait',
  Kyrgyz: 'Kyrgyzstan',
  Laotian: 'Laos',
  Latvian: 'Latvia',
  Lebanese: 'Lebanon',
  Liberian: 'Liberia',
  Libyan: 'Libya',
  Lithuanian: 'Lithuania',
  Luxembourgish: 'Luxembourg',
  Macedonian: 'North Macedonia',
  Malagasy: 'Madagascar',
  Malawian: 'Malawi',
  Malaysian: 'Malaysia',
  Maldivian: 'Maldives',
  Malian: 'Mali',
  Maltese: 'Malta',
  Mauritanian: 'Mauritania',
  Mauritian: 'Mauritius',
  Mexican: 'Mexico',
  Moldovan: 'Moldova',
  Mongolian: 'Mongolia',
  Montenegrin: 'Montenegro',
  Moroccan: 'Morocco',
  Mozambican: 'Mozambique',
  Namibian: 'Namibia',
  Nepalese: 'Nepal',
  Nepali: 'Nepal',
  Nicaraguan: 'Nicaragua',
  Nigerian: 'Nigeria',
  Nigerien: 'Niger',
  Norwegian: 'Norway',
  Omani: 'Oman',
  Pakistani: 'Pakistan',
  Palestinian: 'Palestine',
  Panamanian: 'Panama',
  Paraguayan: 'Paraguay',
  Peruvian: 'Peru',
  Polish: 'Poland',
  Portuguese: 'Portugal',
  Puerto: 'Puerto Rico',
  Qatari: 'Qatar',
  Romanian: 'Romania',
  Russian: 'Russia',
  Rwandan: 'Rwanda',
  Salvadoran: 'El Salvador',
  Saudi: 'Saudi Arabia',
  Scottish: 'United Kingdom',
  Senegalese: 'Senegal',
  Serbian: 'Serbia',
  Seychellois: 'Seychelles',
  Singaporean: 'Singapore',
  Slovak: 'Slovakia',
  Slovenian: 'Slovenia',
  Somali: 'Somalia',
  Spanish: 'Spain',
  Sudanese: 'Sudan',
  Surinamese: 'Suriname',
  Swazi: 'Eswatini',
  Swedish: 'Sweden',
  Swiss: 'Switzerland',
  Syrian: 'Syria',
  Taiwanese: 'Taiwan',
  Tajik: 'Tajikistan',
  Tanzanian: 'Tanzania',
  Thai: 'Thailand',
  Togolese: 'Togo',
  Trinidadian: 'Trinidad and Tobago',
  Tunisian: 'Tunisia',
  Turkish: 'Turkey',
  Turkmen: 'Turkmenistan',
  Ugandan: 'Uganda',
  Ukrainian: 'Ukraine',
  Uruguayan: 'Uruguay',
  Uzbek: 'Uzbekistan',
  Venezuelan: 'Venezuela',
  Vietnamese: 'Vietnam',
  Welsh: 'United Kingdom',
  Yemeni: 'Yemen',
  Zambian: 'Zambia',
  Zimbabwean: 'Zimbabwe',
};

/**
 * Country names that appear in titles directly — "Cookbook:Pad Thai (Thailand)".
 *
 * Kept separate from the demonyms because these are the words that clash with food:
 * Turkey, Chile, Georgia and Jordan are all a bird, a pepper, a US state and a name
 * before they are countries, so a bare country word is only accepted inside brackets
 * where it is unambiguously a label.
 */
const AMBIGUOUS = new Set(['Turkey', 'Chile', 'Georgia', 'Jordan', 'Guinea', 'Malta', 'Mali', 'Chad']);

/** Continental and regional adjectives: real words, but not a country. */
const NOT_A_COUNTRY = new Set([
  'African',
  'Asian',
  'European',
  'Caribbean',
  'Mediterranean',
  'Latin',
  'Middle',
  'Scandinavian',
  'Nordic',
  'Balkan',
  'Creole',
  'Cajun',
  'Continental',
  'Oriental',
  'Western',
  'Eastern',
  'Southern',
  'Northern',
]);

/**
 * The country a title states, or null.
 *
 * Whole words only, and the first match wins so that "Indian-style Chinese Chicken"
 * is filed under the cuisine it leads with.
 */
export function countryFromTitle(name, countries) {
  const words = (name ?? '').split(/[^A-Za-zÀ-ÿ']+/).filter(Boolean);

  for (const word of words) {
    const capitalised = word[0].toUpperCase() + word.slice(1).toLowerCase();
    if (NOT_A_COUNTRY.has(capitalised)) continue;

    const byDemonym = DEMONYMS[capitalised];
    if (byDemonym) return byDemonym;
  }

  // A bare country name, only where it is not also a food word.
  for (const word of words) {
    const capitalised = word[0].toUpperCase() + word.slice(1).toLowerCase();
    if (AMBIGUOUS.has(capitalised) || NOT_A_COUNTRY.has(capitalised)) continue;
    if (countries.has(capitalised)) return capitalised;
  }

  return null;
}

const main = async () => {
  const dry = process.argv.includes('--dry');
  const rows = JSON.parse(await readFile(COOKBOOK, 'utf8'));

  // The catalogue only admits countries its continent map knows, and every value in
  // DEMONYMS was written to match that map — resolving to anything else would just
  // move a record from one drop pile to another.
  const known = new Set(Object.values(DEMONYMS));

  const pending = rows.filter((r) => !r.country && r.steps?.length);
  let resolved = 0;
  const tally = new Map();

  for (const row of pending) {
    const country = countryFromTitle(row.name, known);
    if (!country) continue;
    if (!dry) row.country = country;
    row.countryFromTitle = true;
    resolved += 1;
    tally.set(country, (tally.get(country) ?? 0) + 1);
  }

  if (!dry) await writeFile(COOKBOOK, JSON.stringify(rows), 'utf8');

  const top = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
  process.stdout.write(
    `${pending.length} recipes had a method but no country.\n` +
      `${resolved} name their country in their own title.\n` +
      `${pending.length - resolved} still have no place and stay out of the atlas.\n\n` +
      top.map(([c, n]) => `  ${String(n).padStart(4)}  ${c}`).join('\n') +
      '\n',
  );
};

main().catch((error) => {
  process.stderr.write(`\nCountry resolution failed: ${error.message}\n`);
  process.exitCode = 1;
});

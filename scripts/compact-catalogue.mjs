/**
 * One-off: rewrite a catalogue.json produced by an earlier, verbose version of the
 * importer into the compact row shape that `src/data/catalogue.ts` expands.
 *
 *   node scripts/compact-catalogue.mjs
 *
 * Safe to run repeatedly — rows already in the compact shape pass through unchanged.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/catalogue.json');

const CONTINENTS = {
  Asia: ['India', 'China', 'Japan', 'South Korea', 'Thailand', 'Vietnam', 'Indonesia', 'Malaysia', 'Philippines', 'Singapore', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Myanmar', 'Cambodia', 'Laos', 'Mongolia', 'Iran', 'Iraq', 'Turkey', 'Israel', 'Lebanon', 'Syria', 'Jordan', 'Saudi Arabia', 'Yemen', 'United Arab Emirates', 'Kuwait', 'Qatar', 'Oman', 'Afghanistan', 'Uzbekistan', 'Kazakhstan', 'Georgia', 'Armenia', 'Azerbaijan', 'Taiwan', 'Hong Kong', 'Bhutan', 'Maldives', 'Brunei', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan'],
  Europe: ['Italy', 'France', 'Spain', 'Portugal', 'Germany', 'United Kingdom', 'England', 'Scotland', 'Wales', 'Ireland', 'Greece', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Poland', 'Czech Republic', 'Slovakia', 'Hungary', 'Romania', 'Bulgaria', 'Serbia', 'Croatia', 'Slovenia', 'Bosnia and Herzegovina', 'Montenegro', 'Albania', 'North Macedonia', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland', 'Estonia', 'Latvia', 'Lithuania', 'Russia', 'Ukraine', 'Belarus', 'Moldova', 'Malta', 'Cyprus', 'Luxembourg', 'Kosovo'],
  Africa: ['Egypt', 'Morocco', 'Algeria', 'Tunisia', 'Libya', 'Sudan', 'Ethiopia', 'Eritrea', 'Somalia', 'Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Burundi', 'Nigeria', 'Ghana', 'Senegal', 'Mali', 'Ivory Coast', 'Cameroon', 'South Africa', 'Zimbabwe', 'Zambia', 'Mozambique', 'Angola', 'Namibia', 'Botswana', 'Madagascar', 'Congo', 'Democratic Republic of the Congo', 'Benin', 'Burkina Faso', 'Niger', 'Chad', 'Guinea', 'Sierra Leone', 'Liberia', 'Togo', 'Gambia', 'Mauritania', 'Malawi', 'Lesotho', 'Eswatini', 'Mauritius'],
  'North America': ['United States', 'United States of America', 'Canada', 'Mexico', 'Guatemala', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Puerto Rico', 'Costa Rica', 'Panama', 'Honduras', 'El Salvador', 'Nicaragua', 'Belize', 'Trinidad and Tobago', 'Barbados', 'Bahamas'],
  'South America': ['Brazil', 'Argentina', 'Peru', 'Colombia', 'Chile', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay', 'Guyana', 'Suriname'],
  Oceania: ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Samoa', 'Tonga', 'Vanuatu', 'Solomon Islands'],
};

const continentOf = (country) => {
  for (const [continent, list] of Object.entries(CONTINENTS)) {
    if (list.includes(country)) return continent;
  }
  return 'Elsewhere';
};

const rows = JSON.parse(await readFile(OUT, 'utf8'));

const compact = rows.map((row, index) => {
  if (row.country !== undefined && row.qid !== undefined) return { ...row, id: 1000 + index };

  const country = row.loc?.country ?? '';
  const qid = (row.sources?.[0]?.url ?? '').split('/').pop() ?? '';
  const generatedBlurb = /^Recorded in the atlas as a dish of/.test(row.blurb ?? '');

  return {
    id: 1000 + index,
    name: row.name ?? '',
    country,
    region: row.loc?.region ?? '',
    continent: row.continent && row.continent !== 'Elsewhere' ? row.continent : continentOf(country),
    qid,
    // Drop the generated fallback text — the loader regenerates it from the place.
    blurb: generatedBlurb ? '' : (row.blurb ?? ''),
    photo: row.photo ?? '',
  };
});

const usable = compact.filter((row) => row.name && row.country && row.qid);
await writeFile(OUT, JSON.stringify(usable), 'utf8');

process.stdout.write(
  `Compacted ${rows.length} rows to ${usable.length} usable records ` +
    `across ${new Set(usable.map((r) => r.country)).size} countries.\n`,
);

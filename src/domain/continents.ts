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

const CONTINENTS = new Map<string, string>([
  ['India', 'Asia'],
  ['Mongolia', 'Asia'],
  ['Italy', 'Europe'],
  ['Iceland', 'Europe'],
  ['Mexico', 'North America'],
  ['Canada', 'North America'],
]);

/** Merge in mappings discovered by the importer. Existing entries win. */
export function registerContinents(entries: Iterable<[string, string]>): void {
  for (const [country, continent] of entries) {
    if (country && continent && !CONTINENTS.has(country)) CONTINENTS.set(country, continent);
  }
}

export const continentOf = (country: string): string => CONTINENTS.get(country) ?? 'Elsewhere';

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

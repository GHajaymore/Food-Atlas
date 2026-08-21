/**
 * Whether a region is a place, and whether it is a place *below* its country.
 *
 * The region field exists to give a record geographic depth — "Kozhikode" under
 * India, "Campania" under Italy. That depth is what the atlas measures and most of
 * what separates a record from a headword.
 *
 * The cuisine ingest filled it from whichever Wikipedia subcategory an article was
 * found in, and Wikipedia's subcategories are mostly not places:
 *
 *   Japan › Japanese rice
 *   South Korea › Korean tea
 *   China › Chinese alcoholic beverages
 *   India › Indian snack foods
 *   South Africa › Wineries of South Africa
 *
 * None of those is somewhere. They are shelves in a library, and reading them as
 * geography produced 1,144 records claiming a depth they do not have — inflating the
 * one statistic on the atlas page that is supposed to be hard to inflate.
 *
 * A second kind is a real place and still wrong:
 *
 *   Thailand › Southeast Asia
 *   India › Indian subcontinent
 *   China › East Asia
 *
 * Southeast Asia is a place, and it *contains* Thailand rather than sitting inside
 * it. A breadcrumb reading "Thailand › Southeast Asia" tells the reader the world is
 * arranged the wrong way round.
 *
 * Both are refused, and the record keeps its country. Losing a fake region costs
 * nothing; keeping one costs the meaning of every breadcrumb that has a real one.
 */

/** Areas larger than a country, which can never sit beneath one. */
const SUPRA_NATIONAL =
  /\b(asia|europe|africa|america|americas|oceania|caribbean|middle east|levant|maghreb|balkans?|scandinavia|nordic|mediterranean|subcontinent|west indies|central asia|south asia|east asia|southeast asia|western asia|north africa|sub-saharan|latin america|eurasia|arab world|indian ocean|far east|orient|occident)\b/i;

/**
 * Words that mean the label is a library shelf rather than a location.
 *
 * A place name does not contain the word "beverages". Where one legitimately might —
 * a town called Butter, say — it would still be refused, and that is the right trade:
 * these are 1,144 records against a hypothetical one.
 */
const CATEGORY_WORDS =
  /\b(cuisine|cuisines|dishes|dish|foods?|drinks?|beverages?|snacks?|desserts?|sweets?|soups?|stews?|breads?|noodles?|rice|tea|coffee|wine|wineries|winery|beer|breweries|brewery|spirits?|liquors?|cheeses?|seafoods?|meats?|vegetables?|fruits?|chocolate|confectionery|pastr(y|ies)|sauces?|spices?|condiments?|salads?|street food|fast food|cooking|cookery|recipes?|restaurants?|culture|traditions?|products?|brands?|companies|manufacturers?)\b/i;

/*
 * There was a rule here rejecting any "X of Y" phrase, on the theory that category
 * titles read that way — "Wineries of South Africa", "Cuisine of Kerala". It was
 * deleted after a dry run showed what it actually removed: the Province of Chieti,
 * the Province of Reggio Emilia, the Autonomous Republic of Crimea, the County of
 * Savoy. 282 records would have lost a real province to catch category titles that
 * `CATEGORY_WORDS` already catches by their first word. Places are named that way
 * far more often than shelves are.
 */

/** Compass words, which qualify a place without being one. */
const DIRECTIONS = new Set([
  'north', 'south', 'east', 'west', 'central', 'northern', 'southern', 'eastern', 'western',
  'northeast', 'northwest', 'southeast', 'southwest', 'northeastern', 'northwestern',
  'southeastern', 'southwestern', 'upper', 'lower', 'inner', 'outer', 'greater',
]);

/**
 * Nationality adjectives. A cuisine has one; a place does not.
 *
 * This is the class that survived every other rule: "Northeastern Chinese" contains
 * no food word and no continent, so it read as a region of Ukraine on the borscht
 * record — a nationality of one country filed inside another.
 *
 * Only the adjective forms are listed. Country *nouns* are deliberately absent,
 * because "Western Iceland" and "South Australia" are real regions and must survive.
 */
const DEMONYMS = new Set([
  'afghan', 'albanian', 'algerian', 'american', 'arab', 'argentine', 'argentinian', 'armenian',
  'australian', 'austrian', 'azerbaijani', 'bangladeshi', 'belarusian', 'belgian', 'bengali',
  'bolivian', 'bosnian', 'brazilian', 'british', 'bulgarian', 'burmese', 'cambodian', 'cameroonian',
  'canadian', 'chilean', 'chinese', 'colombian', 'croatian', 'cuban', 'cypriot', 'czech', 'danish',
  'dutch', 'ecuadorian', 'egyptian', 'english', 'eritrean', 'estonian', 'ethiopian', 'filipino',
  'finnish', 'french', 'georgian', 'german', 'ghanaian', 'greek', 'guatemalan', 'haitian',
  'hungarian', 'icelandic', 'indian', 'indonesian', 'iranian', 'iraqi', 'irish', 'israeli',
  'italian', 'jamaican', 'japanese', 'jewish', 'jordanian', 'kazakh', 'kenyan', 'korean', 'kurdish',
  'latvian', 'lebanese', 'liberian', 'libyan', 'lithuanian', 'malay', 'malaysian', 'maltese',
  'mexican', 'moldovan', 'mongolian', 'moroccan', 'nepalese', 'nepali', 'nigerian', 'norwegian',
  'pakistani', 'palestinian', 'persian', 'peruvian', 'polish', 'portuguese', 'romanian', 'russian',
  'rwandan', 'saudi', 'scottish', 'senegalese', 'serbian', 'singaporean', 'slovak', 'slovenian',
  'somali', 'spanish', 'sudanese', 'swedish', 'swiss', 'syrian', 'taiwanese', 'tajik', 'tanzanian',
  'thai', 'tunisian', 'turkish', 'ugandan', 'ukrainian', 'uruguayan', 'uzbek', 'venezuelan',
  'vietnamese', 'welsh', 'yemeni', 'zambian', 'zimbabwean',
]);

/**
 * True when every word is a compass direction or a nationality — "Northeastern
 * Chinese", "American Chinese", "South Indian".
 *
 * A nationality has to be the whole of it. "Chinese Camp" is a town in California
 * and survives, because "camp" is neither.
 */
function isBareDemonym(value: string): boolean {
  const words = value.toLowerCase().split(/[^a-zà-ÿ]+/).filter(Boolean);
  if (!words.length) return false;
  if (!words.some((w) => DEMONYMS.has(w))) return false;
  return words.every((w) => DEMONYMS.has(w) || DIRECTIONS.has(w));
}

/**
 * An infobox field that hedges instead of naming somewhere.
 *
 * These come out of `place_of_origin` when the article is honest about not knowing:
 * "Various claims", "Various places", "Throughout Indonesia", "Primarily Central
 * Europe" — which the infobox reader then truncated to "Primarily Central" and printed
 * under Kompot as though it were a region.
 *
 * The hedge is the useful part of what the source said, and dropping it is right: the
 * app already has a way to say a dish's place is not recorded, and it does not involve
 * putting the word "Various" where a reader expects a town.
 */
const HEDGED = /^(various|primarily|mainly|mostly|widely|throughout|across|all over|worldwide|global)\b/i;

/**
 * Why this region is not a place beneath that country, or null if it is fine.
 *
 * Returns the reason rather than a boolean so a rejection can be explained and
 * argued with, the same as `notAFood`.
 */
export function notAPlaceBelow(region: string, country: string): string | null {
  const value = (region ?? '').trim();
  if (!value) return null;

  const normalise = (s: string) =>
    s
      .toLowerCase()
      .replace(/^(the\s+)?(people's\s+)?(republic|kingdom|state|union|federation)\s+of\s+/, '')
      .replace(/[^a-z]/g, '');

  if (normalise(value) === normalise(country)) return 'repeats the country';
  if (isBareDemonym(value)) return 'names a nationality, not a place';

  // Category first: "Wineries of South Africa" contains a continent and is still a
  // shelf rather than a region, and the reason a record was refused should be the
  // true one — it is shown to whoever comes to argue with it.
  if (CATEGORY_WORDS.test(value)) return 'names a category of food, not a place';
  if (SUPRA_NATIONAL.test(value)) return 'names an area larger than the country';
  if (HEDGED.test(value)) return 'hedges rather than naming a place';

  return null;
}

/** The region to store: the given one, or empty where it is not a place below. */
export const placeBelow = (region: string, country: string): string =>
  notAPlaceBelow(region, country) ? '' : (region ?? '').trim();

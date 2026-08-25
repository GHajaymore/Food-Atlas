import { continentOf, knownCountry } from './continents';
import { canonicalCountry } from './countryNames';
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
 * A sentence fragment where a place name should be.
 *
 * These are what is left when a category title was cut in the wrong spot, or when an
 * article hedged: "of Odisha" on fourteen Indian dishes, "of Karachi", "most of Niger",
 * "likely Minnesota", "disputed" under Pickle pizza. "Nationwide" is the same shape
 * from the other direction — a real answer to "where is this eaten" and no answer at
 * all to "which region is this from".
 */
const FRAGMENT =
  /^(of|most of|mostly|likely|probably|possibly|disputed|unknown|various|nationwide)\b/i;

/**
 * Two words run together where a category word was removed.
 *
 * "Indian cuisine in the United Kingdom" minus "cuisine" left **"Indianin the United
 * Kingdom"**, which shipped as the region on Vindaloo, Kedgeree and ten others. The
 * missing space is the tell, and it is a reliable one: no place is written that way.
 */
const GLUED = /[a-z](in|of|at) the /;

/** Markup that reached the region field — `{{ubl` and `(Tabriz` both did. */
const BROKEN_MARKUP = /[{}]|\[\[/;

const unbalancedBrackets = (value: string): boolean =>
  (value.match(/\(/g) ?? []).length !== (value.match(/\)/g) ?? []).length;

/**
 * Whether anything in this string is a proper noun.
 *
 * A place is named, and a name is capitalised. Without this the region on Khuushuur
 * was the word **"penis"** — taken from a Wikipedia food category and printed on the
 * card as "Mongolia › penis".
 *
 * Scripts without letter case are exempt rather than refused: Chinese, Japanese,
 * Korean, Arabic and Hebrew place names cannot satisfy a capitalisation test, and
 * rejecting them would delete real places from exactly the countries this atlas is
 * least good at already.
 */
function hasProperNoun(value: string): boolean {
  const letters = value.match(/\p{L}/gu) ?? [];
  const hasCase = letters.some((c) => c.toLowerCase() !== c.toUpperCase());
  if (!hasCase) return true;
  return /(^|\s)\p{Lu}/u.test(value);
}

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
  if (FRAGMENT.test(value)) return 'reads as a fragment of a sentence, not a place name';
  if (GLUED.test(value)) return 'is two words run together where a category was stripped';
  if (BROKEN_MARKUP.test(value) || unbalancedBrackets(value)) return 'still carries markup from its source';
  if (!hasProperNoun(value)) return 'has no proper noun in it, so it names no particular place';

  return null;
}

/** The region to store: the given one, or empty where it is not a place below. */
export const placeBelow = (region: string, country: string): string =>
  notAPlaceBelow(region, country) ? '' : (region ?? '').trim();

/**
 * The place to print on a card, which is not always the last step of the breadcrumb.
 *
 * Cards showed `breadcrumb.slice(-1)[0]` — the most specific step, which is usually
 * exactly right: New Orleans beats United States, Teesside beats United Kingdom. Ajay
 * sent a screenshot of a rail headed **From United States** where the cards read
 * *England*, *China*, *Korea* and *Japanese cakes*, each one contradicting the heading
 * directly above it.
 *
 * Two different faults land in the same line of text:
 *
 * **A step that is not a place.** "Japanese cakes", "Anglo-Indian", "Korean pork" are
 * branches of a category tree that arrived in `region`. `notAPlaceBelow` already knows
 * how to recognise those and is reused here rather than re-guessed — it is the same
 * judgement, applied at the other end of the pipeline, and it explains itself.
 *
 * **A step that names a different country.** For a record whose origin is contested this
 * is a true fact recorded honestly: tofu is filed under the United States and its claims
 * are China and the United States, so its region says China. True, and still wrong to
 * print under a heading that says United States, because a card has no room to explain
 * itself and a reader sees the atlas contradicting itself in two lines.
 *
 * In both cases the country is the answer that is certainly true, so the country is what
 * shows. The dispute is not hidden — the record page carries every claim — it is simply
 * not something a card can say in one word.
 */
export function placeLabel(
  breadcrumb: readonly string[],
  country: string,
  contradicts: (tail: string, country: string) => boolean,
): string {
  const tail = breadcrumb.length ? breadcrumb[breadcrumb.length - 1] : '';
  if (!tail) return country;
  if (tail === country) return country;

  // Not a place at all, by the same test the build uses when storing one.
  if (notAPlaceBelow(tail, country)) return country;

  /*
   * Names a country somewhere else entirely.
   *
   * The predicate is injected rather than imported so this module keeps its one useful
   * property — it depends on nothing — and so a caller resolves geography however it
   * already does.
   *
   * The first version asked only "does this name a different country", and that deletes
   * real geography: it suppressed **Hong Kong under China**, **England under the United
   * Kingdom** and **Hawaii under the United States**, 43 records of correct and useful
   * detail, because each of those is also a country the atlas files under. A card saying
   * "England" beneath a heading about the United Kingdom is not a contradiction; it is
   * the reason the breadcrumb exists.
   *
   * So the caller decides, and the caller's test is a different *continent* — which
   * catches England under the United States and China under the United States, and keeps
   * every sub-national case above. It under-removes: Bangladesh under India still shows,
   * and that is the direction this file already chose to err in when the alternative is
   * throwing away places that are real.
   */
  if (contradicts(tail, country)) return country;

  return tail;
}

/**
 * `placeLabel` with the atlas's own country resolver supplied.
 *
 * Every card wants the same answer, so the resolver is bound once here rather than passed
 * at four call sites that would then be four chances to pass a different one.
 */
/**
 * Territories the atlas files under a parent country, where a continent test gets it
 * wrong.
 *
 * The continent rule handles almost everything: England under the United States is a
 * contradiction, England under the United Kingdom is not, and the two are told apart by
 * Europe against North America. It fails where a territory sits on a different landmass
 * from the country it belongs to. **Hawaii** is Oceania and is a state of the United
 * States; **Abkhazia** is filed under Georgia. Both were being stripped off cards that
 * were entirely correct.
 *
 * Every entry here was found by running the rule over the whole catalogue and reading
 * what it removed, not by trying to remember world geography. Anything not on the list
 * still gets the continent test, so a missing entry costs a card its detail and never
 * prints something false.
 */
export const WITHIN: Record<string, string> = {
  hawaii: 'United States',
  'puerto rico': 'United States',
  guam: 'United States',
  abkhazia: 'Georgia',
  greenland: 'Denmark',
  zanzibar: 'Tanzania',
};

export const cardPlace = (breadcrumb: readonly string[], country: string): string =>
  placeLabel(breadcrumb, country, (tail, of) => {
    if (WITHIN[tail.trim().toLowerCase()] === of) return false;
    const named = knownCountry(canonicalCountry(tail)) || knownCountry(tail);
    if (!named || named === of) return false;
    const here = continentOf(of);
    const there = continentOf(named);
    // Unknown either side is not evidence of a contradiction, so it shows.
    if (!here || !there || here === 'Elsewhere' || there === 'Elsewhere') return false;
    return here !== there;
  });

/** True where a place is a territory the atlas files under that country. */
export const isWithin = (place: string, country: string): boolean =>
  WITHIN[(place ?? '').trim().toLowerCase()] === country;

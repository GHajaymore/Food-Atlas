/**
 * Whether a record is a food at all.
 *
 * The imported sources are built by walking Wikipedia's food categories, and a
 * category tree does not only contain food. "Category:Indian cuisine" reaches the
 * restaurants that serve it, the corporations that bottle it, the festivals that
 * celebrate it, the museums that exhibit it and — through one bad link — a cricketer
 * born in 1894. Wikidata's "food" class similarly holds brands and companies.
 *
 * Every one of those arrives looking exactly like a dish: a name, a country, often a
 * photograph. Nothing downstream can tell them apart, so they reach the shelves and
 * the search results as though the app believed Kirin Company were something you
 * could cook.
 *
 * ## The rule
 *
 * A record is refused when its **name** says it is something other than a food. Not
 * its content, not a guess about the subject — the name, because that is the one
 * field every source fills in and the one a reader judges the record by.
 *
 * ## Why each test is anchored
 *
 * Every pattern here is anchored to the start or end of the name, and that is not
 * fussiness. "Simple Restaurant Miso Soup" is a real recipe in the Cookbook; a test
 * for the word "restaurant" anywhere would delete it. "Chicken company pie" would go
 * the same way. A business is named *X Restaurant* or *X Corporation* — the word
 * lands at the end, where a dish name never puts it.
 *
 * The cost of being wrong runs both ways and is not symmetric: deleting a real dish
 * removes a tradition from the atlas silently, while keeping a brewery merely looks
 * foolish. So the rules are narrow, and anything ambiguous stays.
 */

/**
 * Business entities. Anchored to the end, where a company name carries its type.
 *
 * Beverage corporations and breweries dominate the imports because Wikidata files
 * them under drinks — a brewery is not a drink any more than a bakery is a loaf.
 */
const BUSINESS =
  /\b(corporation|corp\.?|company|companies|co\.,? ?ltd\.?|ltd\.?|limited|inc\.?|plc|gmbh|brewery|brewing (company|group)|distillery|winery|joint venture|beverages?)$/i;

/** Places that serve food, as opposed to food. Anchored for the same reason. */
const VENUE = /\b(restaurant|café|cafe|bistro|diner|tavern|brasserie|canteen|food court)$/i;

/**
 * Reference articles: an index of a subject rather than an instance of it.
 *
 * "History of Chinese cuisine" is an essay, "Glossary of sake terms" is a word list.
 * Both are about food and neither is one.
 *
 * "Culture of…" is deliberately absent. It reads like the same kind of article and
 * is not: UNESCO inscribes food traditions under exactly that phrasing, so "Culture
 * of Ukrainian borscht cooking" is a record of how a soup is made and one of the few
 * things here with real heritage evidence behind it.
 */
const REFERENCE = /^(list|index|outline|glossary|timeline|history|cuisine|overview|types|etymology) of\b/i;

/**
 * A cuisine, which is a category of dishes and not a dish.
 *
 * "Hunan cuisine" and "American Chinese cuisine" describe a whole tradition. They
 * are the right *filter* for this app and the wrong *record* — a reader who opens
 * one expects to be told how to make something, and there is nothing to make.
 */
const CUISINE = /\b(cuisine|gastronomy|food and drink|culinary tradition|cookery)$/i;

/**
 * How many words a name may have and still be read as a bare cuisine label.
 *
 * "American Chinese cuisine" is three words and an overview. UNESCO's inscription
 * for ceviche is eighteen and ends "…an expression of Peruvian traditional cuisine"
 * — a record about one dish, wearing a long official title. Length is what separates
 * them, and without this the app's only Peruvian Authentic record was deleted as a
 * category page.
 */
const CUISINE_LABEL_WORDS = 4;

/**
 * Wikipedia's parenthetical disambiguator, where it names something that is not food.
 *
 * The clearest signal any source gives us: the encyclopaedia itself has stated the
 * subject's kind in order to separate it from an article of the same name.
 *
 * The `\b` after the group is load-bearing. Without it "brand" matched the opening
 * of "(Brandade de Morue)" and "(brandy)", which deleted a salt-cod recipe and a
 * Georgian grape spirit — two real foods lost to a prefix.
 */
const NOT_FOOD_KIND =
  /\((restaurant|restaurant chain|company|brand|band|film|movie|song|album|TV series|television series|book|novel|video game|magazine|newspaper|hotel|supermarket|retailer|cricketer|footballer|politician|singer|actor|musician|writer|painter)\b[^)]*\)\s*$/i;

/** A person, where the source labelled them as one. */
const PERSON = /\((?:[^)]*\b)?born \d{4}[^)]*\)|\b\(\d{4}[-–]\d{4}\)/i;

/** Anything left with no name to show. */
const EMPTY = /^\s*$/;

const REFUSALS: { test: (name: string) => boolean; reason: string }[] = [
  { test: (n) => EMPTY.test(n), reason: 'has no name' },
  { test: (n) => NOT_FOOD_KIND.test(n), reason: 'the source labels it as something other than a food' },
  { test: (n) => PERSON.test(n), reason: 'is a person' },
  { test: (n) => BUSINESS.test(n), reason: 'is a company' },
  { test: (n) => VENUE.test(n), reason: 'is a place that serves food, not a food' },
  { test: (n) => REFERENCE.test(n), reason: 'is a reference article about food, not a food' },
  {
    test: (n) => CUISINE.test(n) && n.split(/\s+/).length <= CUISINE_LABEL_WORDS,
    reason: 'is a whole cuisine rather than a dish',
  },
];

/**
 * Why this record is not a food, or null if it is one.
 *
 * Returns the reason rather than a boolean so the exclusion can be reported and
 * argued with. A filter that silently drops 200 records is a filter nobody will ever
 * check.
 */
export function notAFood(name: string): string | null {
  const trimmed = (name ?? '').trim();
  for (const { test, reason } of REFUSALS) {
    if (test(trimmed)) return reason;
  }
  return null;
}

/** True when the record names something a person could cook or eat. */
export const isFood = (name: string): boolean => notAFood(name) === null;

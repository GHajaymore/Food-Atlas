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
  /\b(corporation|corp\.?|company|companies|co\.,? ?ltd\.?|ltd\.?|limited|inc\.?|plc|gmbh|brewery|brewing (company|group)|distillery|winery|joint venture|beverages?|group|group of industries|holdings|industries|enterprises)$/i;

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

/**
 * A drink. Ajay's call, 2026-08-23: the atlas is about food, so drinks come out.
 *
 * ## Why this is not a word list
 *
 * A word list was measured first and it deletes food. Of the first ten records whose
 * name contains an alcohol word, three are not drinks at all:
 *
 *   Reinette de Champagne              an apple variety
 *   Formaggio bastardo del Grappa PAT  a cheese, from a mountain called Grappa
 *   Penne alla vodka                   a pasta dish
 *
 * This file already carries the same scar from the other direction: `brand` once matched
 * "Brandade de Morue" and "(brandy)", losing a salt-cod recipe and a Georgian spirit. A
 * bare keyword is the wrong instrument.
 *
 * ## The two things that make a drink word mean a drink
 *
 * **Position.** A drink is usually named by its kind — "Beaujolais wine", "ginger beer",
 * "Earl Grey tea". The kind is the head of the name, so the word sits at the end or
 * stands alone. `Penne alla vodka` also ends in a drink word, which is why position
 * alone is not enough.
 *
 * **The preposition before it.** In "Reinette de Champagne", "del Grappa" and "alla
 * vodka", the drink word is the object of a preposition — naming where a thing is from
 * or what it was cooked with, never what it is. A romance preposition immediately before
 * the word is therefore a veto, and it is the single check that saves the apple, the
 * cheese and the pasta.
 *
 * A food-form word anywhere in the name vetoes too, because "wine cake" and "beer bread"
 * are things you eat.
 *
 * ## It excludes rather than deletes
 *
 * `isFood` is used by `build.ts` to filter rows into the catalogue, so a record refused
 * here stays in `src/data` untouched and simply stops being built. Reversible by editing
 * this rule, which is the right property for a judgement call about 500 records.
 */
const DRINK_KIND =
  /(wine|beer|ale|lager|stout|porter|cider|perry|mead|whisky|whiskey|bourbon|vodka|gin|rum|brandy|liqueur|cocktail|tea|coffee|juice|soda|lemonade|smoothie|milkshake|cordial|kvass|kombucha|sake|soju|schnapps|vermouth|absinthe|ouzo|grappa|arrack|raki|tequila|mezcal|champagne)/i;

/** The drink word as the head of the name — at the end, or the whole of it. */
const DRINK_HEAD = new RegExp(`\\b${DRINK_KIND.source}s?\\s*$`, 'i');

/**
 * A preposition immediately before the drink word: it names an origin or a flavouring.
 *
 * "de Champagne", "del Grappa", "alla vodka", "au vin", "with wine". Without this the
 * rule deletes an apple, a cheese and a pasta.
 */
const OF_A_PLACE = new RegExp(
  `\\b(de|del|della|di|du|des|da|do|dos|al|alla|allo|au|aux|com|con|with|in|and)\\s+${DRINK_KIND.source}s?\\s*$`,
  'i',
);

/** Something you eat, named anywhere in the string. A drink word cannot outvote these. */
const FOOD_FORM =
  /\b(cheese|formaggio|queso|fromage|cake|torta|bread|pane|pasta|penne|rigatoni|risotto|soup|stew|curry|pie|tart|biscuit|cookie|jam|jelly|marmalade|sauce|salsa|sausage|salami|ham|pâté|pate|terrine|mustard|vinegar|sorbet|ice cream|gelato|pudding|apple|pear|grape|cherry|olive|bean|rice|fish|beef|pork|chicken|lamb|goat|duck|snail|truffle|mushroom|reinette|braise|braised|marinated|glazed|poached)\b/i;

const isDrink = (name: string): boolean =>
  DRINK_HEAD.test(name) && !OF_A_PLACE.test(name) && !FOOD_FORM.test(name);

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
  { test: isDrink, reason: 'is a drink rather than a food' },
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

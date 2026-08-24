import { continentOf } from './continents';

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

/**
 * An article *about* eating something somewhere, rather than a thing you can eat.
 *
 * "Beer in India", "Coffee production in Vietnam", "Dog meat consumption in South Korea",
 * "Delivery culture in South Korea". These survived every rule above because each names a
 * real food or drink and none is a cuisine label, a venue or a person — they are
 * encyclopaedia entries about a country's relationship with a commodity, and an atlas of
 * dishes cannot show one as a dish. There is no method, no ingredients and nobody who
 * could ever confirm it.
 *
 * ## The two ways this rule could delete real food, and what stops each
 *
 * **"X in Y" is how half the cookbook names a sauce.** "Mussels in Onion and Butter
 * Sauce", "Rice Balls in Sweet Coconut Milk", "West Lake Fish in Vinegar Gravy". So the
 * tail must be a place the atlas actually recognises, checked against `continentOf` —
 * the same instinct as everywhere else here: make the match corroborate something the
 * data already knows rather than trusting the shape of a string. "Vinegar Gravy" is not a
 * country, so the dish survives.
 *
 * **UNESCO titles are long and descriptive, and several end in a country.** "Traditional
 * knowledge and skills of sake-making with koji mold in Japan" is an inscription, not an
 * article. So the head is capped at three words: an article is "Beer", "Tea culture",
 * "Dog meat consumption", while an inscription is a sentence.
 *
 * Dry-run before it was written, across all 21,202 records that pass every other rule: it
 * removes 51. Fifty are Wikipedia cuisine articles. The fifty-first is "Beer culture in
 * Belgium", which is a genuine UNESCO inscription and also a beer record, so it goes
 * under the same instruction that removed the other 239 drinks.
 *
 * **Zero come from the cookbook, the catalogue or the EU register** — the three sources
 * where a false positive would delete real food. That is the number that made this safe
 * to apply, and it is worth re-running if the rule is ever widened.
 */
const TOPIC_WORDS = 3;

const aboutFoodSomewhere = (name: string): boolean => {
  const match = /^(.+?)\s+in\s+(.+)$/.exec(name.trim());
  if (!match) return false;
  const [, topic, place] = match;
  if (topic.split(/\s+/).length > TOPIC_WORDS) return false;
  return continentOf(place.trim()) !== 'Elsewhere';
};

/**
 * Articles judged one at a time, because no pattern reaches them safely.
 *
 * Ajay found two while looking at photographs: *Tea Garden Express*, an Indian railway
 * service, and *Northern snakehead*, a fish. Both were walked out of a cuisine category
 * tree, both are real Wikipedia articles, and neither is a food.
 *
 * ## Why a list and not a rule
 *
 * Every pattern that reaches them takes real food with it, which was measured rather than
 * feared:
 *
 *   "express"  would delete **Bicol Express**, a Filipino pork stew, and
 *              *Espaguettis express*, and *Taiwan Railway Bento*
 *   "carp"     would delete *Roasted Carp*, *Christmas carp* and *catfish pepper soup*
 *
 * That is this file's own rule from its header — *the cost of being wrong runs both ways
 * and is not symmetric* — reaching the point where the honest instrument is a list of
 * names somebody checked, each with a reason, rather than a regular expression that is
 * wrong about a stew in Bicol.
 *
 * ## What is on it, and what was taken off
 *
 * Three fish species, one railway service, three trade bodies and a college. Every one
 * was opened and read before being added.
 *
 * *Sweet Society* was on the first draft and is not here: its blurb says "Apple cultivar.
 * Eating apple." It is a variety of apple, and the name only looks like an organisation.
 * The check that caught it is the same one that should be run before adding anything
 * else — read the record, not the name.
 *
 * A list is a maintenance cost and is worth it only while it stays short. If it starts
 * growing, that is evidence a pattern exists and has not been found yet.
 */
const NOT_FOOD_TITLES = new Set(
  [
    // A railway service between Guwahati and Dibrugarh.
    'Tea Garden Express',
    // Fish, not dishes. The atlas holds preparations, and a species article has no
    // method, no place and nobody who could confirm one.
    'Northern snakehead',
    'Grass carp',
    'Common carp',
    // Trade bodies and a college. Organisations that exist because of food are not food,
    // the same distinction `BUSINESS` and `VENUE` draw at the end of a name.
    'Coffee Board of India',
    'Bangladesh Caterers Association UK',
    'Specialty Coffee Association of Indonesia',
    'Tatung Institute of Commerce and Technology',
  ].map((title) => title.toLowerCase()),
);

/** Anything left with no name to show. */
const EMPTY = /^\s*$/;

const REFUSALS: { test: (name: string) => boolean; reason: string }[] = [
  { test: (n) => EMPTY.test(n), reason: 'has no name' },
  { test: (n) => NOT_FOOD_TITLES.has(n.trim().toLowerCase()), reason: 'was read and is not a food' },
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
  { test: aboutFoodSomewhere, reason: 'is an article about a food in a place, not a food' },
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

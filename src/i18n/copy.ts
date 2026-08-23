/**
 * The app's own words, in English.
 *
 * This object is both the English catalogue and the type every other catalogue is
 * checked against, so a key that exists here and nowhere else is a compile-time fact
 * rather than a runtime surprise. Adding a string means adding it here first.
 *
 * ## What belongs in here
 *
 * Chrome: the words a reader needs to work the app. Buttons, labels, headings,
 * placeholders, empty states. Sentences we wrote about our software.
 *
 * ## What does not
 *
 * Anything that makes a claim about a record. The disclaimers, the score
 * explanations, the sentence saying nobody from the place has confirmed a dish —
 * those are the atlas's evidence, and a loose translation of "nobody has confirmed
 * this" misstates a record's standing rather than merely reading badly. They stay in
 * English until a speaker checks them. See `domain/uiLanguage.ts`.
 *
 * Nothing here interpolates a dish name, an ingredient or a place. Those are the
 * words `translate.ts` refuses to touch, and they must not be smuggled into a
 * sentence that gets rewritten per language.
 */

export interface Copy {
  /** Navigation and shared controls. */
  goBack: string;
  search: string;
  backToShelves: string;
  seeAll: string;

  /** The feed. */
  worldwide: string;
  world: string;
  chooseCountry: string;
  nothingRecordedHere: string;
  resetFilters: string;
  recordedNotAssessed: string;
  mostLookedUp: string;
  wikipediaReaders: string;
  deepestLevelRecorded: string;

  /** Search. */
  searchPlaceholder: string;
  filters: string;
  nothingApplied: string;
  results: string;
  matches: string;
  noMatch: string;
  authenticityLevel: string;
  cuisine: string;
  kindOfDish: string;
  traditionalIngredient: string;
  sortResultsBy: string;
  authenticityConfidence: string;
  atRiskFirst: string;
  notClassified: string;
  askForItInstead: string;
  surpriseMe: string;
  browseTheAtlas: string;

  /** Said about the interface itself, not about any record. */
  interfaceTranslationNote: string;
}

export const EN: Copy = {
  goBack: 'Go back',
  search: 'Search',
  backToShelves: 'Back to the shelves',
  seeAll: 'See all',

  worldwide: 'Worldwide',
  world: 'World',
  chooseCountry: 'Choose a country',
  nothingRecordedHere: 'Nothing recorded here yet',
  resetFilters: 'Reset the filters',
  recordedNotAssessed: 'Recorded, not yet assessed',
  mostLookedUp: 'Most looked up',
  wikipediaReaders: 'Wikipedia readers',
  deepestLevelRecorded: 'Deepest level recorded here',

  searchPlaceholder: 'Dish, country, region, city or ingredient',
  filters: 'Filters',
  nothingApplied: 'nothing applied',
  results: 'Results',
  matches: 'matches',
  noMatch: 'No match',
  authenticityLevel: 'Authenticity level',
  cuisine: 'Cuisine',
  kindOfDish: 'Kind of dish',
  traditionalIngredient: 'Traditional ingredient',
  sortResultsBy: 'Sort results by',
  authenticityConfidence: 'Authenticity confidence',
  atRiskFirst: 'At risk first',
  notClassified: 'Not classified',
  askForItInstead: 'Ask for it instead',
  surpriseMe: 'Surprise me with an at-risk tradition',
  browseTheAtlas: 'Browse the world atlas',

  interfaceTranslationNote:
    'This interface was translated by machine and has not been checked by a speaker. The records themselves are unaffected. Corrections are welcome.',
};

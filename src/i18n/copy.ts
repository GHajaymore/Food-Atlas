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

  clearAll: string;
  none: string;
  video: string;
  iKnowHowItsMade: string;

  /** Startup. The first words a reader can possibly see, and sometimes the only ones. */
  loadingAtlas: string;
  couldNotLoad: string;

  /**
   * The shelves on the feed.
   *
   * The titles and their one-line notes describe what a shelf holds. They are not
   * claims about any particular record — the record's own disclaimer does that — so
   * they translate.
   */
  shelfDisappearing: string;
  shelfDisappearingNote: string;
  shelfAuthenticated: string;
  shelfAuthenticatedNote: string;
  shelfCookable: string;
  shelfCookableNote: string;
  shelfIllustrated: string;
  shelfIllustratedNote: string;

  /** The atlas screen. */
  foodAtlas: string;
  howComplete: string;
  traditionsRecorded: string;
  countries: string;
  atRiskTraditions: string;
  whereTheRecordsAre: string;
  confidence: string;
  growTheAtlas: string;
  addATradition: string;
  keepingItFree: string;
  whatItCostsToRun: string;
  anywhere: string;

  /** The dish screen's section headings and controls. */
  noRecord: string;
  backToTheFeed: string;
  bookmarkThis: string;
  photoOriginUnverified: string;
  whyFlaggedAtRisk: string;
  openDisagreement: string;
  ingredientsNamedInAccount: string;
  methodStillOpen: string;
  notDocumentedYet: string;
  recordHowItsMade: string;
  traditionalEquipment: string;
  mostPopularVersion: string;
  watchItBeingMade: string;
  findPreparationVideos: string;
  whereTheMethodComesFrom: string;
  alsoMadeThisWay: string;

  /**
   * The site's own navigation — the header, the phone colophon and the footer.
   *
   * Left until last, and it should not have been: these are the words on every screen,
   * so a reader who chose another language met the whole site in English whichever page
   * they were on. Nine labels doing more work than any nine others in this file.
   */
  howItWorks: string;
  proposeADish: string;
  confirm: string;
  confirmAProposal: string;
  everyRecord: string;
  addATraditionShort: string;
  navExplore: string;
  navContribute: string;
  navAbout: string;

  /** Said about the interface itself, not about any record. */
  theGapThatCannotBeClosed: string;
  aDocumentCannotMakeAuthentic: string;
  sixThingsScoredSeparately: string;
  whatClosesIt: string;
  whatThisIsNot: string;
  whichIsWhereYouComeIn: string;
  confirmADishYouKnow: string;
  proposeOneMissing: string;
  whatItDoesNotBuy: string;
  contributeOnOpenCollective: string;
  readTheLedger: string;
  notOpenForDonationsYet: string;
  browse: string;
  startAgain: string;
  openProposals: string;
  whatTheseAre: string;
  proposed: string;
  seeOpenProposals: string;
  beforeYouStart: string;
  theDish: string;
  writtenTheWayYouWriteIt: string;
  country: string;
  regionDistrictOrTown: string;
  whoMakesItAndWhen: string;
  ingredientsOnePerLine: string;
  howItIsMadeOnePerLine: string;
  yourName: string;
  shownOnTheProposal: string;
  yourConnectionToThePlace: string;
  proposeThisDish: string;
  dishInItsOwnLanguage: string;
  whereIsItMadeThisWay: string;
  whoPreparesIt: string;
  traditionalIngredientsAndEquipment: string;
  publishAPhotographOnCommons: string;
  commonsFileNameOrLink: string;
  checkWhatExistsOnline: string;
  whatTheInternetAlreadyHas: string;
  runTheEvidenceAssessment: string;
  evidenceAssessment: string;
  sendForCommunityValidation: string;
  communityValidation: string;
  ifTheyDisagree: string;
  nowSendYours: string;
  sendThisTradition: string;
  submissionsNotOpenYet: string;
  backToTheAtlas: string;
  settingsTitle: string;
  whatThisChanges: string;
  administratorToken: string;
  tokenNotStored: string;
  queueThisCheck: string;
  loadAnalytics: string;
  mostOpenedDishes: string;
  mostSearchedFor: string;
  mostUsedShelves: string;
  screens: string;
  oftenTheWholePoint: string;
  grewUpInMalabar: string;
  whatTheseAreBody: string;
  proposalsNotOpenYet: string;
  proposalsNotOpenNote: string;
  nothingIsWaiting: string;
  nothingIsWaitingNote: string;
  loading: string;
  proposedBy: string;
  beforeYouStartBody: string;
  notPublishedBySending: string;
  atlasMayAlreadyHaveThis: string;
  duplicateNote: string;
  connectionRequiredNote: string;
  proposeClosedNote: string;
  pantryNoMatches: string;
  pantryPrompt: string;
  requestsNotOpenNote: string;
  footerHolding: string;
  footerSources: string;
  atlasCoverageLine: string;
  concentrationNote: string;
  growTheAtlasBody: string;
  keepingItFreeBody: string;
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

  clearAll: 'Clear all',
  none: 'None',
  video: '▶ Video',
  iKnowHowItsMade: 'I know how it’s made — record it',

  loadingAtlas: 'Reading the atlas…',
  couldNotLoad: 'The atlas could not be loaded.',

  shelfDisappearing: 'Disappearing',
  shelfDisappearingNote:
    'Traditions a source describes as declining — the undocumented ones first, because those are the ones that go.',
  shelfAuthenticated: 'Authenticated',
  shelfAuthenticatedNote: 'The records that carry real evidence of how they are made, and where.',
  shelfCookable: 'You could cook this tonight',
  shelfCookableNote:
    'Records with a written method — traditional where we have one, published where we do not.',
  shelfIllustrated: 'Worth looking at',
  shelfIllustratedNote: 'Photographed traditions, for browsing rather than searching.',

  foodAtlas: 'Food Atlas',
  howComplete: 'How complete is this atlas?',
  traditionsRecorded: 'traditions recorded',
  countries: 'countries',
  atRiskTraditions: 'at-risk traditions',
  whereTheRecordsAre: 'Where the records are',
  confidence: 'Confidence',
  growTheAtlas: 'Grow the atlas',
  addATradition: 'Add a tradition from your area',
  keepingItFree: 'Keeping it free',
  whatItCostsToRun: 'What it costs to run',
  anywhere: 'Anywhere',

  noRecord: 'No record',
  backToTheFeed: 'Back to the feed',
  bookmarkThis: 'Bookmark this tradition',
  photoOriginUnverified: 'Photo origin unverified',
  whyFlaggedAtRisk: 'Why this is flagged as at risk',
  openDisagreement: 'Open disagreement',
  ingredientsNamedInAccount: 'Ingredients named in that account',
  methodStillOpen: 'The method is still open',
  notDocumentedYet: 'Not documented yet',
  recordHowItsMade: 'Record how it’s made',
  traditionalEquipment: 'Traditional Equipment',
  mostPopularVersion: 'Most popular version online',
  watchItBeingMade: 'Watch it being made',
  findPreparationVideos: 'Find preparation videos ↗',
  whereTheMethodComesFrom: 'Where the method comes from',
  alsoMadeThisWay: 'Also made this way',

  howItWorks: 'How it works',
  proposeADish: 'Propose a dish',
  confirm: 'Confirm',
  confirmAProposal: 'Confirm a proposal',
  everyRecord: 'Every record',
  addATraditionShort: 'Add a tradition',
  navExplore: 'Explore',
  navContribute: 'Contribute',
  navAbout: 'About',
  theGapThatCannotBeClosed: 'The gap that cannot be closed by reading',
  aDocumentCannotMakeAuthentic: 'A document cannot make a dish authentic.',
  sixThingsScoredSeparately: 'Six things, scored separately',
  whatClosesIt: 'What closes it',
  whatThisIsNot: 'What this is not',
  whichIsWhereYouComeIn: 'Which is where you come in',
  confirmADishYouKnow: 'Confirm a dish you know',
  proposeOneMissing: 'Propose one the atlas is missing',
  whatItDoesNotBuy: 'What it does not buy',
  contributeOnOpenCollective: 'Contribute on Open Collective',
  readTheLedger: 'Read the ledger — every contribution and expense',
  notOpenForDonationsYet: 'Not open for donations yet',
  browse: 'Browse',
  startAgain: 'Start again',
  openProposals: 'Open proposals',
  whatTheseAre: 'What these are',
  proposed: 'Proposed',
  seeOpenProposals: 'See open proposals',
  beforeYouStart: 'Before you start',
  theDish: 'The dish',
  writtenTheWayYouWriteIt: 'Written the way you write it',
  country: 'Country',
  regionDistrictOrTown: 'Region, district or town',
  whoMakesItAndWhen: 'Who makes it, and when',
  ingredientsOnePerLine: 'Ingredients — one per line',
  howItIsMadeOnePerLine: 'How it is made — one step per line',
  yourName: 'Your name',
  shownOnTheProposal: 'Shown on the proposal',
  yourConnectionToThePlace: 'Your connection to the place',
  proposeThisDish: 'Propose this dish',
  dishInItsOwnLanguage: 'Dish, in its own language if possible',
  whereIsItMadeThisWay: 'Where is it made this way?',
  whoPreparesIt: 'Who prepares it',
  traditionalIngredientsAndEquipment: 'Traditional ingredients and equipment',
  publishAPhotographOnCommons: 'Publish a photograph on Commons',
  commonsFileNameOrLink: 'Commons file name or link',
  checkWhatExistsOnline: 'Check what already exists online',
  whatTheInternetAlreadyHas: 'What the internet already has',
  runTheEvidenceAssessment: 'Run the evidence assessment',
  evidenceAssessment: 'Evidence assessment',
  sendForCommunityValidation: 'Send for community validation',
  communityValidation: 'Community validation',
  ifTheyDisagree: 'If they disagree',
  nowSendYours: 'Now send yours',
  sendThisTradition: 'Send this tradition',
  submissionsNotOpenYet: 'Submissions are not open yet',
  backToTheAtlas: 'Back to the atlas',
  settingsTitle: 'Settings',
  whatThisChanges: 'What this changes',
  administratorToken: 'Administrator token',
  tokenNotStored: 'Not stored — retyped each session',
  queueThisCheck: 'Queue this check',
  loadAnalytics: 'Load analytics',
  mostOpenedDishes: 'Most opened dishes',
  mostSearchedFor: 'Most searched for',
  mostUsedShelves: 'Most used shelves',
  screens: 'Screens',
  oftenTheWholePoint: 'Often the whole point — optional',
  grewUpInMalabar: 'Grew up in Malabar',
  whatTheseAreBody:
    'Dishes people say exist that the atlas has no record of. Each needs {n} confirmations from people who know it before it enters the atlas — judged on the same six dimensions as every other record here.',
  proposalsNotOpenYet:
    'Proposals are not open yet',
  proposalsNotOpenNote:
    'This needs somewhere to store what people send. Until it exists the app says so, rather than showing an empty list as though nobody had anything to add.',
  nothingIsWaiting:
    'Nothing is waiting',
  nothingIsWaitingNote:
    'Every proposal has been decided. If you know a dish the atlas does not have, it starts here.',
  loading:
    'Loading…',
  proposedBy:
    'Proposed by',
  beforeYouStartBody:
    'This is for food the atlas does not have — usually because nobody has written it down. You do not need a full recipe. A name, where it is from, and your connection to the place is enough to open it for confirmation.',
  notPublishedBySending:
    'It is not published by sending it. {n} people who know the dish confirm it first, and it enters the atlas at whatever its evidence earns — the same way every other record here is judged.',
  atlasMayAlreadyHaveThis:
    'The atlas may already have this',
  duplicateNote:
    'If one of these is your dish, confirming it is what moves it — that is worth more than a second record. If none of them is, carry on; two dishes can share a name.',
  connectionRequiredNote:
    'Required, and displayed. It is the whole difference between this and a recipe copied off the internet — which the atlas already refuses to hold.',
  proposeClosedNote:
    'This needs somewhere to store what people send, and that is not set up. Nothing you type here would go anywhere, so the app is saying so rather than taking it.',
  pantryNoMatches:
    'Nothing recorded uses those together. Try one at a time — or propose the dish you had in mind, if the atlas does not have it.',
  pantryPrompt:
    'Name what is in your kitchen. Only about half the atlas has its ingredients recorded, so a dish missing here may simply be one nobody has written down yet.',
  requestsNotOpenNote:
    'Requests aren’t open yet, so the only way a dish enters the atlas is someone recording it.',
  footerHolding:
    '{n} traditions from {c} countries. Free to read, no advertising, and nothing tracked.',
  footerSources:
    'Built from Wikipedia, Wikidata, Wikimedia Commons, Wikibooks and Italy’s regional open data — all free to read and openly licensed. Photographs are credited to their authors on every record that carries one.',
  atlasCoverageLine:
    '{n} traditions documented across {c} countries. Coverage is stated honestly: a country absent here has nothing recorded yet, not nothing to record.',
  concentrationNote:
    '{p}% of the catalogue comes from {country} alone. That reflects which countries have been catalogued in the open sources this is built from — not where the world’s food is.',
  growTheAtlasBody:
    'For each dish the atlas first pulls the most widely published recipe on the internet and classifies it. Where nothing exists online, a submission from the community becomes the record.',
  keepingItFreeBody:
    'Everything here is built from sources that cost nothing and stay that way. One thing does cost money, and it is switched off until it can be paid for.',
  interfaceTranslationNote:
    'This interface was translated by machine and has not been checked by a speaker. The records themselves are unaffected. Corrections are welcome.',
};

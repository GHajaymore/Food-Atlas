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
  meterDocumented: string;
  meterDocumentedNote: string;
  meterLocated: string;
  meterLocatedNote: string;
  meterIllustrated: string;
  meterIllustratedNote: string;
  meterFilmed: string;
  meterFilmedNote: string;
  meterAssessed: string;
  meterAssessedNote: string;
  supportLead: string;
  notForSaleAuthentic: string;
  notForSalePromotion: string;
  notForSaleAdvertising: string;
  donationFootnote: string;
  donationsPendingBody: string;
  mostUsefulThing: string;
  administration: string;
  administrationNote: string;
  needTranslationTitle: string;
  needTranslationWhat: string;
  needTranslationWhy: string;
  needTranslationCost: string;
  needHostingTitle: string;
  needHostingWhat: string;
  needHostingWhy: string;
  needHostingCost: string;
  needSourcesTitle: string;
  needSourcesWhat: string;
  needSourcesWhy: string;
  needSourcesCost: string;
  howLead: string;
  sixDimensionsBody: string;
  ceilingBody: string;
  thresholdBody: string;
  whatClosesItBody: string;
  accountsBody: string;
  whichIsWhereYouComeInBody: string;
  notRatings: string;
  notComments: string;
  notAlgorithm: string;
  notAdvertising: string;
  notPopularity: string;
  dimensionOrigin: string;
  dimensionIngredients: string;
  dimensionTechnique: string;
  dimensionLocalSource: string;
  dimensionDocumentation: string;
  dimensionCommunity: string;
  fromDocuments: string;
  fromPeople: string;
  contributeLead: string;
  writeItTheWayYouWriteIt: string;
  editorialRuleBody: string;
  photographTitle: string;
  photographBody: string;
  walkthroughNoteBody: string;
  examplePreparedBy: string;
  exampleConnection: string;
  exampleIngredients: string;
  shelfFromCountry: string;
  shelfFromCountryNote: string;
  sending: string;
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
  meterDocumented:
    'Has a recorded method',
  meterDocumentedNote:
    'The number that says whether this is an atlas or a list of names. Everything else is secondary to it.',
  meterLocated:
    'Placed below country level',
  meterLocatedNote:
    'Authenticity has geographic depth. “Kozhikode” is a record; “India” is barely a start.',
  meterIllustrated:
    'Has a photograph',
  meterIllustratedNote:
    'A dish nobody can picture is hard to care about, and harder to recognise.',
  meterFilmed:
    'Has a ranked video',
  meterFilmedNote:
    'Ranked by the cook’s closeness to the tradition — not a search result.',
  meterAssessed:
    'Classified as authentic',
  meterAssessedNote:
    'Earned through the evidence checks. A low share here is honest, not a failure.',
  supportLead:
    '{n} traditions, built entirely from sources that are free to read and openly licensed. No advertising, no tracking, and nothing behind a payment. Here is what that actually costs, including the parts that cost nothing. Figures are in {currency}.',
  notForSaleAuthentic:
    'A record cannot be made Authentic by paying for it. That comes from evidence and from people who cook the dish.',
  notForSalePromotion:
    'No dish is promoted, ranked higher, or featured because somebody paid.',
  notForSaleAdvertising:
    'Nothing here is advertising, and no reader is tracked.',
  donationFootnote:
    'Opens at Open Collective. Nothing is collected here — this app holds no payment details of yours and never will.',
  donationsPendingBody:
    'There is nowhere to send money to. It will be an Open Collective when there is, so that every contribution and every expense is public and anyone can check this page against the ledger.',
  mostUsefulThing:
    'The most useful thing anyone can give this atlas is not money. Most of it is a name and a place because nobody has written down how the food is made.',
  administration:
    'Administration',
  administrationNote:
    'Thresholds, moderation, source checks and usage. Needs a token.',
  needTranslationTitle:
    'Translation',
  needTranslationWhat:
    'Five thousand records describe a dish in the language of the place it comes from — Hindi, Korean, Indonesian, Chinese. A reader who does not speak it is shown the original and told which language it is, which is honest and not much use to them.',
  needTranslationWhy:
    'It is the only part of this project that costs money. Translating on demand needs a model behind a key, and the rules it has to follow are already written and tested: no ingredient renamed, no number altered, and the result labelled as machine-made until somebody from the place checks it.',
  needTranslationCost:
    'Tens of dollars a month at real usage, because a translation is done once and then kept.',
  needHostingTitle:
    'Hosting',
  needHostingWhat:
    'The app and its fourteen megabytes of records, served to anyone who opens it.',
  needHostingWhy:
    'It fits inside a free tier today. It would stop fitting if enough people used it.',
  needHostingCost:
    'Nothing so far.',
  needSourcesTitle:
    'The sources',
  needSourcesWhat:
    'Every photograph, article, recipe and register entry in the atlas.',
  needSourcesWhy:
    'Wikipedia, Wikidata, Wikimedia Commons, Wikibooks and Italy’s regional open data are free to read and openly licensed. No key, no tier, no bill.',
  needSourcesCost:
    'Nothing, and it will stay nothing.',
  howLead:
    'That is the rule this atlas is built on, and it is arithmetic rather than a policy — which means you can check it rather than trust it.',
  sixDimensionsBody:
    'Every record is scored on the same six dimensions, and all six are printed on the record itself. The score is their average, so a reader who doubts it can add up the numbers.',
  ceilingBody:
    'Three of those six cannot be answered by any document ever written. No encyclopaedia knows whether a method is the method of a place; no register is a person from the town. With those three empty, the best a record can score on published sources alone is {ceiling}.',
  thresholdBody:
    'A record is called Authentic at {threshold}. The distance between those two numbers is deliberate, and it is the entire argument: it is closable only by people who know the dish.',
  whatClosesItBody:
    '{n} confirmations from people who state their connection to the place — and who say what they are confirming, not merely that they approve. Both are shown on the record, because a sentence like “born in Kozhikode — we use ghee, not oil” is evidence a reader can weigh, and “{n} confirmations” is a number they have to trust.',
  accountsBody:
    'Those {n} have to be {n} different people, so a confirmation counts toward the badge only when the person was signed in. An anonymous one is still recorded and still shown on the record — what somebody knows is worth having whether or not they hold an account — it simply does not move the number. Reading the atlas never requires signing in.',
  whichIsWhereYouComeInBody:
    'Most of the atlas has nobody speaking for it. If you know how a dish is made where you are from, that is the one thing no source can supply and no amount of scraping can reach.',
  notRatings:
    'No ratings. Nobody scores a dish out of five.',
  notComments:
    'No comments, and no feed. There is nothing here to engage with.',
  notAlgorithm:
    'No algorithm deciding what you see. The order is evidence, and you can change it.',
  notAdvertising:
    'No advertising, and no reader is tracked.',
  notPopularity:
    'Popularity is recorded and kept apart. The most-published version of a dish never becomes the authentic one.',
  dimensionOrigin:
    'Where the dish is from, and how precisely. A town beats a country.',
  dimensionIngredients:
    'What it is made of, as the tradition makes it.',
  dimensionTechnique:
    'How it is made — not that somebody published a recipe, but that this is the method of the place.',
  dimensionLocalSource:
    'Somebody with a stated connection to the place has spoken for it.',
  dimensionDocumentation:
    'A register, an inscription or an encyclopaedia has recorded it.',
  dimensionCommunity:
    'People from the place have confirmed it, and said what they are confirming.',
  fromDocuments:
    'documents can',
  fromPeople:
    'only people',
  contributeLead:
    'Record it as it is made where you are. Nothing is published from this form alone — it goes through assessment and community validation first.',
  writeItTheWayYouWriteIt:
    'Write the food’s name the way you write it',
  editorialRuleBody:
    'Fix our writing freely — spelling, grammar, anything that reads badly. Do not tidy the food itself. A dish name, an ingredient, a piece of equipment and a place stay exactly as the people who cook it write them, accents and all. If two spellings disagree, that is usually two communities rather than a mistake, and both are kept.',
  photographTitle:
    'A photograph of it, if you have one',
  photographBody:
    'Publish your own photograph to Wikimedia Commons, then paste its file name here. It stays yours, you are credited everywhere it appears, and it costs neither of us anything. We cannot take one from Instagram or TikTok — a photograph there is its author’s copyright, and a credit line is not permission.',
  walkthroughNoteBody:
    'What follows is a worked example of what happens to a submission — the findings, the checks and the draft score below are from a record already in the atlas, not from what you have just typed. Your entry is not assessed here; it is assessed by people, after it is sent.',
  examplePreparedBy:
    'Malabar households, made for iftar and family occasions',
  exampleConnection:
    'Born and cooking in Kozhikode',
  exampleIngredients:
    'Ripe nendran banana, eggs, ghee, sugar, cashews, raisins; cooked in a heavy pan over low charcoal or gas flame, covered with a lid weighted with embers',
  shelfFromCountry:
    'From {country}',
  shelfFromCountryNote:
    'What the atlas holds from {country}. Its accuracy here is worth more to you than anywhere else — you can tell whether it is right.',
  sending:
    'Sending…',
  interfaceTranslationNote:
    'This interface was translated by machine and has not been checked by a speaker. The records themselves are unaffected. Corrections are welcome.',
};

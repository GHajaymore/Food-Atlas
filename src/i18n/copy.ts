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
  /** The unmatched-route screen. See app/+not-found.tsx. */
  pageNotFound: string;
  pageNotFoundBody: string;
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
  missionHeadline: string;
  missionStakes: string;
  statDishes: string;
  statCountries: string;
  statDocumented: string;
  statRegistered: string;
  statAuthentic: string;
  missionAsk: string;
  missionAskBody: string;
  recordADishYouKnow: string;
  howItGetsAuthenticated: string;
  submissionsNotOpen: string;
  freeAndStayingFree: string;
  noRatingsNoComments: string;
  whyASourceCannot: string;
  whyASourceCannotBody: string;
  whyTheAtlasStops: string;
  levelLocal: string;
  levelLocalFull: string;
  levelRegional: string;
  levelVariation: string;
  levelAdaptation: string;
  levelFusion: string;
  levelUnverified: string;
  levelUnverifiedFull: string;
  filterAuthenticOnly: string;
  filterTraditionalVariations: string;
  filterModernAdaptations: string;
  filterFusion: string;
  filterUnverified: string;
  filterAll: string;
  geoCountry: string;
  geoRegion: string;
  geoProvince: string;
  geoCity: string;
  geoVillage: string;
  chooseRegion: string;
  chooseProvince: string;
  chooseCity: string;
  chooseVillage: string;
  typeToSearchLevel: string;
  browseAllTraditions: string;
  geoPlace: string;
  noLevelRecorded: string;
  browseCuisine: string;
  browseMadeWith: string;
  browseEverything: string;
  within: string;
  chooseCountryHint: string;
  chooseCountryHintBroader: string;
  noRecordUnderThatReference: string;
  tagTraditionalPreparation: string;
  tagAtRiskTradition: string;
  notEligibleForAuthentic: string;
  lookingForWhatItBorrows: string;
  howItsDescribed: string;
  howItsMade: string;
  originAndAttribution: string;
  nobodyRecordedTechnique: string;
  nobodyHasRecorded: string;
  ifIngredientUnavailable: string;
  traditionalLabel: string;
  ingredientsHeading: string;
  methodHeading: string;
  commonModernSubstitute: string;
  adaptationNotAuthentic: string;
  whatTheInternetServes: string;
  popularNotAuthentic: string;
  videosRankedByCloseness: string;
  stillFramesFromVideos: string;
  noVideoRecordedYet: string;
  findOneFromThePlace: string;
  siblingsNeitherIsReal: string;
  doYouKnow: string;
  confirmWhatYouKnow: string;
  recordedThankYou: string;
  shownWithYourConnection: string;
  signedInCounts: string;
  notSignedInNote: string;
  signInSoItCounts: string;
  shownOnTheRecord: string;
  whatCanYouConfirm: string;
  exampleSaid: string;
  fromTheTownItself: string;
  fromTheTownItselfLabel: string;
  exampleWhoMakesIt: string;
  exampleIngredientLines: string;
  exampleMethodLines: string;
  inPlace: string;
  tagAtRiskShort: string;
  readThisIn: string;
  communityTranslation: string;
  machineTranslation: string;
  /**
   * Which locale this vocabulary is. Set by `copyFor`, not declared by a catalogue.
   *
   * Prose built from these strings sometimes has to name a language inside itself —
   * "shown in English", "subtitles in French". Those names were taken from the static
   * English label list, so a French page read "affiché en English", which is exactly the
   * mixed-language section Ajay reported. Naming the sentence own locale lets the
   * builder ask for the name in the language the sentence is written in.
   */
  locale: string;
  notTranslatedYet: string;
  /** Shown when a translation arrived but broke a preservation rule. See PreservationError. */
  translationRefused: string;
  aDotMarks: string;
  opensOnceMoreRecords: string;
  noTranslationService: string;
  whatTheseTermsMean: string;
  signedIn: string;
  signOut: string;
  signedInSignOut: string;
  confirmationsCount: string;
  signIn: string;
  signInSoConfirmationsCount: string;
  onlySignedInMovesBadge: string;
  watchAtSource: string;
  originalAudio: string;
  creatorsOwnTranslation: string;
  translatedCaptions: string;
  languageUnknown: string;
  ingredientsInThisVideo: string;
  weDontInventOne: string;
  captureFromVideo: string;
  dietaryPreference: string;
  narrowItDown: string;
  anyDiet: string;
  whenItsEaten: string;
  anyOccasion: string;
  alsoCalled: string;
  notATranslationOfOurs: string;
  relatedTraditions: string;
  relatedTraditionsNote: string;
  scoreCannotSettle: string;
  notScored: string;
  navAtlasNote: string;
  navProposeNote: string;
  navConfirmNote: string;
  navSupportNote: string;
  confirmPrompt: string;
  confirmAskBody: string;
  confirmYes: string;
  confirmNo: string;
  confirmPlacePrompt: string;
  confirmPlaceBody: string;
  confirmPlaceYes: string;
  confirmPlaceNo: string;
  standingMet: string;
  standingNobody: string;
  standingOne: string;
  standingMany: string;
  standingNeed: string;
  onePersonMore: string;
  morePeople: string;
  contestedNote: string;
  relatedAlsoFrom: string;
  relatedAlsoCuisine: string;
  relatedSharesIngredients: string;
  relatedAlsoUses: string;
  relatedAlsoCategory: string;
  authenticVersion: string;
  thePublishedRecipe: string;
  whyThisIsAnAdaptation: string;
  whyConsideredAuthentic: string;
  whatThisRecordIs: string;
  stepSubmit: string;
  stepWhatExists: string;
  stepAssessment: string;
  stepValidation: string;
  findingAggregatorTitle: string;
  findingAggregatorTag: string;
  findingAggregatorNote: string;
  findingVideoTitle: string;
  findingVideoTag: string;
  findingVideoNote: string;
  findingGapTitle: string;
  findingGapTag: string;
  findingGapNote: string;
  checkOriginLabel: string;
  checkOriginNote: string;
  checkLocalPrepLabel: string;
  checkLocalPrepNote: string;
  checkIngredientsLabel: string;
  checkIngredientsNote: string;
  checkTechniqueLabel: string;
  checkTechniqueNote: string;
  checkDocumentationLabel: string;
  checkDocumentationNote: string;
  checkLocalSourceLabel: string;
  checkLocalSourceNote: string;
  checkCommunityLabel: string;
  checkCommunityNote: string;
  validatorHomeCook: string;
  validatorHomeCookSaid: string;
  validatorBakery: string;
  validatorBakerySaid: string;
  validatorWriter: string;
  validatorWriterSaid: string;
  validatorPending: string;
  validatorPendingSaid: string;
  photoCheckedNote: string;
  mostPublishedNote: string;
  sevenChecksNote: string;
  draftConfidence: string;
  unverifiedPendingTag: string;
  oneSubmitterNote: string;
  threeConfirmationsNote: string;
  conflictingAccountsNote: string;
  nowhereToSendNote: string;
  whereTheExampleEndsUp: string;
  confirmedBy: string;
  nothingMatchesAll: string;
  mostOfYourListFirst: string;
  translatesTheAppsWords: string;
  byNameAndPlaceOnly: string;
  wikipediaViewsNote: string;
  requiredDishName: string;
  requiredCountry: string;
  requiredYourName: string;
  requiredYourConnection: string;
  requiredWhatYouConfirm: string;
  bandNotScored: string;
  bandUnder50: string;
  band50to74: string;
  band75Plus: string;
  reviewCapitals: string;
  reviewCapitalsConsider: string;
  reviewRepeats: string;
  reviewRepeatsConsider: string;
  reviewShort: string;
  reviewShortConsider: string;
  groupSummaryCountries: string;
  groupSummaryOrigins: string;
  metricTotalTitle: string;
  metricTotalCounts: string;
  metricTotalMethod: string;
  metricTotalCaveat: string;
  metricCountriesTitle: string;
  metricCountriesCounts: string;
  metricCountriesMethod: string;
  metricCountriesCaveat: string;
  metricAtRiskTitle: string;
  metricAtRiskCounts: string;
  metricAtRiskMethod: string;
  metricAtRiskCaveat: string;
  metricDocumentedTitle: string;
  metricDocumentedCounts: string;
  metricDocumentedMethod: string;
  metricDocumentedCaveat: string;
  metricLocatedTitle: string;
  metricLocatedCounts: string;
  metricLocatedMethod: string;
  metricLocatedCaveat: string;
  metricIllustratedTitle: string;
  metricIllustratedCounts: string;
  metricIllustratedMethod: string;
  metricIllustratedCaveat: string;
  metricFilmedTitle: string;
  metricFilmedCounts: string;
  metricFilmedMethod: string;
  metricFilmedCaveat: string;
  metricAssessedTitle: string;
  metricAssessedCounts: string;
  metricAssessedMethod: string;
  metricAssessedCaveat: string;
  metricConcentrationTitle: string;
  metricConcentrationCounts: string;
  metricConcentrationMethod: string;
  metricConcentrationCaveat: string;
  metricConfidenceTitle: string;
  metricConfidenceCounts: string;
  metricConfidenceMethod: string;
  metricConfidenceCaveat: string;
  metricByContinentTitle: string;
  metricByContinentCounts: string;
  metricByContinentMethod: string;
  metricByContinentCaveat: string;
  howIsThisCounted: string;
  hideHowThisIsCounted: string;
  stapleGrains: string;
  stapleRoots: string;
  staplePulses: string;
  stapleDairy: string;
  stapleMeatFish: string;
  stapleVegetables: string;
  stapleAromatics: string;
  stapleSweetSour: string;
  stapleRice: string;
  stapleWheat: string;
  stapleMaize: string;
  stapleMillet: string;
  stapleSorghum: string;
  stapleBarley: string;
  stapleOats: string;
  stapleBuckwheat: string;
  stapleTeff: string;
  staplePotato: string;
  stapleCassava: string;
  stapleSweetPotato: string;
  stapleYam: string;
  stapleTaro: string;
  staplePlantain: string;
  stapleLentil: string;
  stapleChickpea: string;
  stapleSoy: string;
  stapleTofu: string;
  stapleBlackBean: string;
  stapleMungBean: string;
  staplePigeonPea: string;
  stapleMilk: string;
  stapleYoghurt: string;
  stapleCheese: string;
  staplePaneer: string;
  stapleGhee: string;
  stapleButter: string;
  stapleCoconut: string;
  stapleChicken: string;
  stapleBeef: string;
  staplePork: string;
  stapleLamb: string;
  stapleGoat: string;
  stapleFish: string;
  staplePrawn: string;
  stapleEgg: string;
  stapleOnion: string;
  stapleGarlic: string;
  stapleGinger: string;
  stapleChilli: string;
  stapleLemongrass: string;
  stapleTomato: string;
  stapleAubergine: string;
  stapleCabbage: string;
  stapleSpinach: string;
  stapleOkra: string;
  stapleTamarind: string;
  stapleHoney: string;
  stapleJaggery: string;
  stapleDate: string;
  stapleLemon: string;
  stapleOlive: string;
  dietVegan: string;
  dietVegetarian: string;
  dietSeafood: string;
  dietMeat: string;
  dietUnclassified: string;
  dietPoultry: string;
  dietPork: string;
  dietBeef: string;
  dietLambGoat: string;
  dietGame: string;
  dietFish: string;
  dietShellfish: string;
  dietOtherSeafood: string;
  dietDairy: string;
  dietEgg: string;
  dietHoney: string;
  mealBreakfast: string;
  mealLunch: string;
  mealDinner: string;
  mealSupper: string;
  mealSnack: string;
  mealStreetFood: string;
  mealCelebration: string;
  mealAnytime: string;
  mealUnclassified: string;
  searchModeFind: string;
  searchModePantry: string;
  ingredientsYouHave: string;
  nTraditions: string;
  nothingYet: string;
  methodRecorded: string;
  noMethodYet: string;
  showMoreLeft: string;
  showNMore: string;
  methodAsPublished: string;
  methodTraditional: string;
  everythingClassified: string;
  everythingFrom: string;
  everythingRecordedAs: string;
  everythingMadeWith: string;
  seeEverything: string;
  noPhotographOnRecord: string;
  scoreOutOf100: string;
  removeFilter: string;
  anywhereInTheAtlas: string;
  absenceOfRecords: string;
  narrowToA: string;
  fromTheTown: string;
  showFewer: string;
  readAboutOnWikipedia: string;
  languageChangeIt: string;
  perCentTranslated: string;
  translateThisRecord: string;
  translating: string;
  translate: string;
  translateThisConfirmation: string;
  couldNotTranslate: string;
  howThisIsCountedFor: string;
  countOfTotal: string;
  watchAtSourceCreator: string;
  stillFromCreator: string;
  thatDidNotSend: string;
  containsAlcohol: string;
  nothingElseRequired: string;
  opensTheFormPrefilled: string;
  scoreDimGeographic: string;
  scoreDimIngredients: string;
  scoreDimTechnique: string;
  scoreDimLocalSource: string;
  scoreDimDocumentation: string;
  scoreDimCommunity: string;
  photoFromWikidata: string;
  photoFromArticle: string;
  photoFromRecipe: string;
  photoFromSearch: string;
  photoFromUnknown: string;
  noTranslationRecorded: string;
  machineTranslationBy: string;
  translatedBy: string;
  videoOriginalAudio: string;
  videoCreatorTrack: string;
  videoPlatformCaptions: string;
  videoLanguageUnknown: string;
  figureDocumented: string;
  figureDocumentedNote: string;
  figureLocated: string;
  figureLocatedNote: string;
  figureIllustrated: string;
  figureIllustratedNote: string;
  figureFilmed: string;
  figureFilmedNote: string;
  figureAssessed: string;
  figureAssessedNote: string;
  atlasSummary: string;
  nothingRecorded: string;
  nothingRecordedAs: string;
  nothingRecordedAsAnd: string;
  photoVia: string;
  photoNothingEntered: string;
  photoNothingEnteredFix: string;
  photoWrongHost: string;
  photoWrongHostFix: string;
  photoNotCommons: string;
  photoNotCommonsFix: string;
  photoNoFileName: string;
  photoNoFileNameFix: string;
  photoNotAPhotograph: string;
  photoNotAPhotographFix: string;
  photoIsADrawing: string;
  photoIsADrawingFix: string;
  serverRefused: string;
  serverTookTooLong: string;
  couldNotReachServer: string;
  nothingYouTypedIsLost: string;
  proposalsNotOpen: string;
  confirmationsNotOpen: string;
  alreadyProposed: string;
  alreadyConfirmed: string;
  youProposedThis: string;
  stillNeededList: string;
  listAnd: string;
  listOr: string;
  proposalConfirmed: string;
  proposalNobodyYet: string;
  proposalSoFar: string;
  recordNobodyYet: string;
  recordSoFar: string;
  atRiskNote: string;
  originDisclaimer: string;
  supportRunsOn: string;
  contributeToTheAtlas: string;
  answeredByDocuments: string;
  answeredByPeople: string;
  scaleDocumentsStop: string;
  scaleAuthenticBegins: string;
  pantryNothingUses: string;
  alsoRecordedIn: string;
  alsoRecordedNote: string;
  chooseACountry: string;
  filterTheList: string;
  showingFirstNOfM: string;
  nothingMatchesThat: string;
  continentBeyondOneCountry: string;
  beyondOneCountryNote: string;
  connectionGrewUpThere: string;
  connectionLiveThere: string;
  connectionFamilyFrom: string;
  connectionLearnedThere: string;
  connectionCookProfessionally: string;
  chooseYourConnection: string;
  connectionInYourWords: string;
  connectionDetailPlaceholder: string;
  dictateSpeak: string;
  dictateListening: string;
  dictateStop: string;
  dictateSendsAudio: string;
  dictateNotAllowed: string;
  dictateDidNotWork: string;
  polishTidyThis: string;
  polishWorking: string;
  polishMachineMade: string;
  polishUseThis: string;
  polishKeepMine: string;
  polishOnlyTyping: string;
  polishFoundNothing: string;
  polishDidNotWork: string;
  continentAfrica: string;
  continentAsia: string;
  continentEurope: string;
  continentNorthAmerica: string;
  continentSouthAmerica: string;
  continentOceania: string;
  regionLevant: string;
  regionLatinAmerica: string;
  regionMiddleEast: string;
  regionMaghreb: string;
  regionCentralEurope: string;
  regionEasternEurope: string;
  regionSouthernEurope: string;
  regionCentralAsia: string;
  regionIndianSubcontinent: string;
  regionNorthAfrica: string;
  regionAmericas: string;
  regionAncientNearEast: string;
  regionBalkans: string;
  regionCaribbean: string;
  regionLowCountries: string;
  regionMesoamerica: string;
  regionMiddleEasternEmpires: string;
  regionPolishLithuanianCommonwealth: string;
  regionQajarIran: string;
  regionRussianEmpire: string;
  regionSouthCaucasus: string;
  regionSovietCentralAsia: string;
  regionWu: string;
  regionArtsakh: string;
  refineDietOccasion: string;
  refineAny: string;
  placeKindWiderRegion: string;
  placeKindFormerState: string;
  oneTradition: string;
  onePlace: string;
  nPlaces: string;
  countryLevelOnly: string;
  summaryWorldwide: string;
  nRecorded: string;
  writtenInLanguage: string;
  whatThisIs: string;
  atlasDefinition: string;
  traditionsLabel: string;
  freeNoAds: string;
  quotedFromSource: string;
  adaptationLeadIn: string;
  openDisagreementBody: string;
  engagementNotShown: string;
  videoSearchNote: string;
  nowOpenForConfirmation: string;
  proposalOpenBody: string;
  nothingMatchesBody: string;
  thatWord: string;
  disclaimerNameAndPlaceOnly: string;
  disclaimerPublishedAccountOnly: string;
  disclaimerHeritageNoMethod: string;
  disclaimerIngredientsAndPlace: string;
  disclaimerSomeDocumentation: string;
  dietBasisImported: string;
  disclaimerConfirmedOne: string;
  disclaimerConfirmedMany: string;
  disclaimerConfirmedLocal: string;
  disclaimerConfirmedRegional: string;
  disclaimerScoreIsMean: string;
  oneCountry: string;
  nCountries: string;
  oneOrigin: string;
  nOrigins: string;
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

  pageNotFound: "Not a page here",
  pageNotFoundBody:
    "That address is not one of ours. The atlas is still here — start from a place, or look for a dish by name.",
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
    '{n} traditions, built entirely from sources that are free to read and openly licensed. No advertising, no tracking, and nothing behind a payment. What it takes to run is met by that choice of sources rather than by anybody paying to be here.',
  notForSaleAuthentic:
    'A record cannot be made Authentic by paying for it. That comes from evidence and from people who cook the dish.',
  notForSalePromotion:
    'No dish is promoted, ranked higher, or featured because somebody paid.',
  notForSaleAdvertising:
    'Nothing here is advertising, and no reader is tracked.',
  donationFootnote:
    'Opens at Open Collective. Nothing is collected here — this app holds no payment details of yours and never will.',
  donationsPendingBody:
    'There is nowhere to send money to yet. Nothing about the atlas depends on there being one — it is built on sources that are free to read, and that does not change.',
  mostUsefulThing:
    'The most useful thing anyone can give this atlas is not money. Most of it is a name and a place because nobody has written down how the food is made.',
  administration:
    'Administration',
  administrationNote:
    'Thresholds, moderation, source checks and usage. Needs a token.',
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
  missionHeadline:
    'Every dish here shows its evidence.',
  missionStakes:
    'Where it came from, who says so, and how much has actually been established — printed on every record, and checkable by anybody who doubts it.',
  statDishes:
    'dishes',
  statCountries:
    'countries',
  statDocumented:
    'documented',
  statRegistered:
    'registered',
  statAuthentic:
    'authentic',
  missionAsk:
    '{n} of these have no method recorded. {people} people from a place can fix one for good.',
  missionAskBody:
    'Nobody has set down how they are made — not in English, not in any language, nowhere a machine can reach. No archive, no encyclopaedia and nothing automatic can authenticate them instead; that is arithmetic in the scoring, not a policy. If you cook one, you are the only person who can.',
  recordADishYouKnow:
    'Record a dish you know',
  howItGetsAuthenticated:
    'How it gets authenticated',
  submissionsNotOpen:
    'Submissions are not open yet — there is nowhere to send them. The route above explains what happens when they are.',
  freeAndStayingFree:
    'Free, and staying free. No advertising, no tracking, no money collected. An account is needed only to confirm a dish — never to read one.',
  noRatingsNoComments:
    'No ratings, no comments, and no algorithm deciding what you see — lists lead with evidence rather than with popularity. Openings are counted as a dish and a date, never as a person.',
  whyASourceCannot:
    'Why a source cannot authenticate a dish',
  whyASourceCannotBody:
    'Published documentation cannot score above {ceiling} here, and a record becomes Authentic at {threshold}. The gap is closable only by people connected to the place. The six figures behind every score are printed on the record, so a reader who doubts the number can add it up.',
  whyTheAtlasStops:
    'It is also why the atlas stops where it does. Every free source has been read — encyclopaedias, cookbooks, heritage registers, gazetteers — and {n} records still have nothing recorded about how they are made. What is left was never written down.',
  levelLocal:
    'Authentic — Local',
  levelLocalFull:
    'Authentic — Local/Traditional',
  levelRegional:
    'Authentic — Regional',
  levelVariation:
    'Traditional Variation',
  levelAdaptation:
    'Modern Adaptation',
  levelFusion:
    'Fusion',
  levelUnverified:
    'Unverified',
  levelUnverifiedFull:
    'Unverified — insufficient evidence',
  filterAuthenticOnly:
    'Authentic Only',
  filterTraditionalVariations:
    'Traditional Variations',
  filterModernAdaptations:
    'Modern Adaptations',
  filterFusion:
    'Fusion',
  filterUnverified:
    'Unverified',
  filterAll:
    'All',
  geoCountry:
    'country',
  geoRegion:
    'region',
  geoProvince:
    'province or district',
  geoCity:
    'city or town',
  geoVillage:
    'village or community',
  chooseRegion:
    'Choose a region',
  chooseProvince:
    'Choose a province or district',
  chooseCity:
    'Choose a city or town',
  chooseVillage:
    'Choose a village or community',
  typeToSearchLevel:
    'Type to search…',
  browseAllTraditions:
    'Browse all {n} traditions',
  geoPlace:
    'place',
  noLevelRecorded:
    'No {level} recorded under that name yet. Absence here means no record, not no food.',
  browseCuisine:
    '{cuisine} cuisine',
  browseMadeWith:
    'made with {ingredient}',
  browseEverything:
    'Everything',
  within:
    'Within {path}',
  chooseCountryHint:
    'Choose a country · {c} recorded',
  chooseCountryHintBroader:
    'Choose a country · {c} recorded, and {b} broader origins',
  noRecordUnderThatReference:
    'Nothing in the atlas is recorded under that reference. Absence here means no record, not no food.',
  tagTraditionalPreparation:
    '🏺 Traditional Preparation',
  tagAtRiskTradition:
    '🕯️ At-Risk Tradition',
  notEligibleForAuthentic:
    'Not eligible for authentic classification',
  lookingForWhatItBorrows:
    'Looking for the tradition it borrows from?',
  howItsDescribed:
    'How it’s described',
  howItsMade:
    'How it’s made',
  originAndAttribution:
    'Origin & cultural attribution',
  nobodyRecordedTechnique:
    'Nobody has recorded the technique — the timings, the vessel, the order things happen in. That is what would lift this record out of Unverified, and it takes someone who cooks it.',
  nobodyHasRecorded:
    'Nobody has recorded how {dish} is made{place}. We could copy the most-published recipe from the internet and call it authentic, but that is the thing this atlas exists not to do — so the record stays as it is until someone who cooks it fills it in. If you do, you would be the first to write it down.',
  ifIngredientUnavailable:
    'If the traditional ingredient is unavailable',
  traditionalLabel: "Traditional: ",
  ingredientsHeading: "Ingredients",
  methodHeading: "Method",
  commonModernSubstitute:
    'Common modern substitute: ',
  adaptationNotAuthentic:
    'This is an adaptation and should not be considered the authentic preparation.',
  whatTheInternetServes:
    'What the internet mostly serves for this dish, and how it departs from the tradition above.',
  popularNotAuthentic:
    'Popular, but not the authentic preparation. The version above remains the reference.',
  videosRankedByCloseness:
    'Real videos, ranked by how close the cook is to the tradition — not by view count.',
  stillFramesFromVideos:
    'Still frames are taken from the videos themselves, so the dish you see is the dish that cook made.',
  noVideoRecordedYet:
    'No video from the tradition has been recorded for this dish yet.',
  findOneFromThePlace:
    'If you find one made by someone from the place, it can be added through Add a tradition — that is what would give this dish a ranked video.',
  siblingsNeitherIsReal:
    'The same dish, recorded separately where it is made differently. Neither is the real one.',
  doYouKnow:
    'Do you know {subject}?',
  confirmWhatYouKnow:
    'Confirm what you actually know. You do not have to vouch for the whole record — one specific thing from somebody who cooks it is worth more than general agreement.',
  recordedThankYou:
    'Recorded. Thank you.',
  shownWithYourConnection:
    'It is shown on the record with your connection beside it, so readers can weigh it themselves.',
  signedInCounts:
    'Signed in — this will count toward the badge.',
  notSignedInNote:
    'Not signed in. What you write will be shown on the record with your connection, and it will not move the badge — that count only rises for signed-in people, so one person cannot be three of them.',
  signInSoItCounts:
    'Sign in, so it counts',
  shownOnTheRecord:
    'Shown on the record',
  whatCanYouConfirm:
    'What can you confirm?',
  exampleSaid:
    'We use ghee, not oil — and it is made at Eid, not year round.',
  fromTheTownItself:
    'I am from the town or village itself, not just the wider region',
  fromTheTownItselfLabel:
    'I am from the town or village itself, not the wider region',
  exampleWhoMakesIt:
    'Made at home for Eid, by the grandmothers — optional',
  exampleIngredientLines:
    'ripe plantain\negg\nghee',
  exampleMethodLines:
    'Mash the plantain.\nFold through beaten egg.',
  inPlace:
    ' in {place}',
  tagAtRiskShort:
    '🕯️ At risk',
  readThisIn:
    'Read this in',
  communityTranslation:
    'Community translation',
  machineTranslation:
    'Machine translation — not yet checked by anyone from the community',
  locale: 'en',
  notTranslatedYet:
    'Not translated yet',
  translationRefused:
    'An automatic translation came back altered, so it was not shown. This is the original record.',
  aDotMarks:
    'A dot marks a language this record has already been translated into.',
  opensOnceMoreRecords:
    '{language} opens once {n} more records can be read in it.',
  noTranslationService:
    'No translation service is connected to this build, so nothing can be translated automatically. A translation from someone who cooks this dish is worth more than one anyway — it can be contributed through Add a tradition.',
  whatTheseTermsMean:
    'What these terms mean',
  signedIn:
    'Signed in',
  signOut:
    'Sign out',
  signedInSignOut:
    'Signed in. Sign out.',
  confirmationsCount:
    'Your confirmations count toward the badge.',
  signIn:
    'Sign in',
  signInSoConfirmationsCount:
    'Sign in, so your confirmations count',
  onlySignedInMovesBadge:
    'Only signed-in confirmations move a badge.',
  watchAtSource:
    'Watch at source ↗',
  originalAudio:
    'Original audio',
  creatorsOwnTranslation:
    'Creator’s own translation',
  translatedCaptions:
    'Translated captions',
  languageUnknown:
    'Language unknown',
  ingredientsInThisVideo:
    'Ingredients used in this video',
  weDontInventOne:
    'This creator published no ingredient list or written method with the video, and we don’t invent one. The traditional method above comes from the documented sources below.',
  captureFromVideo:
    'Capture the ingredients and steps from this video →',
  dietaryPreference:
    'Dietary preference',
  narrowItDown:
    'Narrow it down',
  anyDiet:
    'Any diet',
  whenItsEaten:
    'When it’s eaten',
  anyOccasion:
    'Any occasion',
  alsoCalled:
    'Also called',
  notATranslationOfOurs:
    'Each is the name used in that language’s own encyclopaedia article — not a translation of ours, and never a replacement for the name above. Tap one to read it there.',
  relatedTraditions:
    'Related traditions',
  relatedTraditionsNote:
    'Records sharing a place, a tradition or an ingredient with this one. Each says which.',
  scoreCannotSettle:
    'An estimate of how strong the evidence is — not a claim that a score can settle cultural truth.',
  notScored:
    'Not scored',
  navAtlasNote:
    'What is covered, and how confident it is',
  navProposeNote:
    'Food the atlas has no record of',
  navConfirmNote:
    'Dishes waiting for someone who knows them',
  navSupportNote:
    'What it costs to run, and who pays',
  confirmPrompt:
    'Is this how it’s made where you’re from?',
  confirmAskBody:
    'If you cook this where it comes from, confirming or correcting it is what moves a record out of Unverified. Where your version differs, it is recorded alongside — not instead of — this one.',
  confirmYes:
    'Yes — this matches',
  confirmNo:
    'It’s made differently where I’m from',
  confirmPlacePrompt:
    'Is this dish from where we say it is?',
  confirmPlaceBody:
    'Nobody has written down how this one is made, so there is nothing here to agree with yet. The place is what this record claims, and that is worth confirming on its own — it is one of the six evidence checks.',
  confirmPlaceYes:
    'Yes — it’s from here',
  confirmPlaceNo:
    'No — it’s from somewhere else',
  standingMet:
    '{n} people connected to {place} have confirmed this — the number the badge requires.',
  standingNobody:
    'Nobody has yet',
  standingOne:
    'One person has so far',
  standingMany:
    '{n} people have so far',
  standingNeed:
    '{soFar}. The badge requires {need}, so {people} connected to {place} would meet it.',
  onePersonMore:
    'one more person',
  morePeople:
    '{n} more people',
  contestedNote:
    'Filed here for navigation. {n} places have a documented claim to this dish — none of them is settled, and they are all listed below.',
  relatedAlsoFrom:
    'Also from {place}',
  relatedAlsoCuisine:
    'Also {cuisine}',
  relatedSharesIngredients:
    'Shares {n} ingredients',
  relatedAlsoUses:
    'Also uses {ingredient}',
  relatedAlsoCategory:
    'Also {category}',
  authenticVersion:
    'Authentic Version',
  thePublishedRecipe:
    'The published recipe',
  whyThisIsAnAdaptation:
    'Why this is an adaptation',
  whyConsideredAuthentic:
    'Why is this considered authentic?',
  whatThisRecordIs:
    'What this record is',
  stepSubmit:
    'Submit',
  stepWhatExists:
    'What exists',
  stepAssessment:
    'Assessment',
  stepValidation:
    'Validation',
  findingAggregatorTitle:
    'Recipe aggregator page',
  findingAggregatorTag:
    'Popular candidate',
  findingAggregatorNote:
    'Highest-ranked result. Author gives no connection to Malabar; uses butter in place of ghee.',
  findingVideoTitle:
    'Malayalam cooking channel video',
  findingVideoTag:
    'Local source',
  findingVideoNote:
    'Filmed in Kerala, spoken in Malayalam, ghee and nendran banana as described.',
  findingGapTitle:
    'No village-level record found',
  findingGapTag:
    'Gap',
  findingGapNote:
    'Nothing documents how it is made in Kozhikode specifically. This submission would be the first.',
  checkOriginLabel:
    'Geographic origin',
  checkOriginNote:
    'Malabar, Kozhikode — stated by the submitter and consistent with the video source.',
  checkLocalPrepLabel:
    'Local preparation',
  checkLocalPrepNote:
    'Described as household cooking for iftar and family occasions.',
  checkIngredientsLabel:
    'Traditional ingredients',
  checkIngredientsNote:
    'Nendran banana, eggs, ghee — matches the local-source video.',
  checkTechniqueLabel:
    'Traditional technique',
  checkTechniqueNote:
    'Low flame, lid weighted with embers.',
  checkDocumentationLabel:
    'Historical or cultural documentation',
  checkDocumentationNote:
    'Thin. No scholarship or archive record located.',
  checkLocalSourceLabel:
    'Local source',
  checkLocalSourceNote:
    'Submitter reports being born and cooking in Kozhikode.',
  checkCommunityLabel:
    'Community validation',
  checkCommunityNote:
    'Not yet sought. This is why the record cannot be called authentic yet.',
  validatorHomeCook:
    'Home cook, Kozhikode',
  validatorHomeCookSaid:
    'Confirmed the ingredients and the embers-on-the-lid method.',
  validatorBakery:
    'Bakery owner, Thalassery',
  validatorBakerySaid:
    'Confirmed, notes their version adds less sugar.',
  validatorWriter:
    'Food writer, Kerala',
  validatorWriterSaid:
    'Confirmed as a Malabar household dish; documentation is genuinely scarce.',
  validatorPending:
    'Two more reviewers invited',
  validatorPendingSaid:
    'Awaiting response — the record publishes without them.',
  photoCheckedNote:
    'Checked against Commons when the record is submitted, and shown with its photographer and licence. It stays Unverified until the community confirms it, exactly as the method does.',
  mostPublishedNote:
    'The most-published version is taken as the popular candidate. It does not become the authentic record.',
  sevenChecksNote:
    'Seven checks, each answered or left open. Open checks lower confidence — they are never filled in by assumption.',
  draftConfidence:
    '/100 draft confidence',
  unverifiedPendingTag:
    '⚪ Unverified — pending community validation',
  oneSubmitterNote:
    'One submitter from the place is evidence, not proof. The record stays Unverified until people from the community confirm it.',
  threeConfirmationsNote:
    'Three confirmations from people who live or cook in the place lift a record out of Unverified.',
  conflictingAccountsNote:
    'Conflicting accounts are both kept. The record splits into the traditions people actually described — one per region or community — and no version is declared the true one.',
  nowhereToSendNote:
    'There is nowhere to send this to. The atlas has read everything the free sources hold, so what is missing now is food nobody has written down — which means this form is how it grows, and it will be switched on as soon as there is somewhere for it to go.',
  whereTheExampleEndsUp:
    'That is where the example record ends up: published with its evidence visible, its open checks named, and every claim traceable to who said it.',
  confirmedBy:
    'Confirmed by',
  nothingMatchesAll:
    'Nothing matches all of these at once.',
  mostOfYourListFirst:
    'Most of your list first',
  translatesTheAppsWords:
    'Translates the app’s own words. Dishes stay in the language they were recorded in — a record has its own translation controls.',
  byNameAndPlaceOnly:
    'These are in the atlas by name and place only. Nobody has documented how they are made, so they carry no method and no score.',
  wikipediaViewsNote:
    'How many people read about each dish on English Wikipedia over the last year. That is interest, not authenticity and not how widely a dish is eaten — and it favours what English speakers look up. Tap through for each one’s classification.',
  requiredDishName:
    'the dish’s name',
  requiredCountry:
    'the country',
  requiredYourName:
    'your name',
  requiredYourConnection:
    'your connection to the place',
  requiredWhatYouConfirm:
    'what you can confirm',
  bandNotScored:
    'Not scored',
  bandUnder50:
    'Under 50',
  band50to74:
    '50 – 74',
  band75Plus:
    '75 and above',
  reviewCapitals:
    'This is written in capitals throughout.',
  reviewCapitalsConsider:
    'Sentence case reads better and is easier to translate. The dish name keeps whatever case you gave it.',
  reviewRepeats:
    'A character repeats several times over.',
  reviewRepeatsConsider:
    'Check it is not a stuck key.',
  reviewShort:
    'The method is very short.',
  reviewShortConsider:
    'Write what someone would have to do to make it, including the waiting. A record without a method cannot reach the recipe shelves.',
  groupSummaryCountries:
    '{c} countries · {n} traditions',
  groupSummaryOrigins:
    '{c} origins · {n} traditions',
  metricTotalTitle:
    'Traditions recorded',
  metricTotalCounts:
    'A tradition is one way of making a food in one place. The same dish made differently in two regions is two traditions, and both are kept.',
  metricTotalMethod:
    'Every record from the curated set and the four imported sources that has something to show — a place and a name at minimum. Rows still awaiting enrichment are held back and not counted.',
  metricTotalCaveat:
    'This is not a count of the world’s distinct foods, and it is not a measure of how much the atlas knows. Most of these records carry a name and a country and nothing else. The share with a written method is the number that says whether this is an atlas or a list of names.',
  metricCountriesTitle:
    'Countries',
  metricCountriesCounts:
    'Distinct countries named across all records, after the import’s place names are resolved.',
  metricCountriesMethod:
    'The country field of every record, de-duplicated, counting only origins that are countries. Historical and supra-national entries a source used — the Ottoman Empire, the Levant, Mesoamerica — are kept on their records rather than reassigned to a modern state we would have to guess at, and they are not counted here. Counting them added thirty-two to this figure and every one of them was imaginary.',
  metricCountriesCaveat:
    'Coverage is not depth. A country appears here on the strength of a single record, so this counts where the atlas has been rather than where it is any good. Read it next to the concentration figure below, which says how lopsided the total is.',
  metricAtRiskTitle:
    'At-risk traditions',
  metricAtRiskCounts:
    'Records where a source’s own words describe the tradition as declining, disappearing or no longer practised.',
  metricAtRiskMethod:
    'Detected by reading each article’s introduction and history for stated decline — "now rarely made", "the last remaining producer" — and rejecting near-misses that mean something else, such as an endangered species used as an ingredient or a closed restaurant chain. The sentence that triggered it is stored on the record as evidence and is shown with it.',
  metricAtRiskCaveat:
    'This is a floor, not a census, and it is far below the truth. It can only find decline that somebody already wrote down in a text we have read; a tradition held by four families and never documented registers as nothing at all. Slow Food’s Ark of Taste alone lists roughly six thousand endangered foods, which is a thousand times this figure.',
  metricDocumentedTitle:
    'Has a recorded method',
  metricDocumentedCounts:
    'Records carrying an ordered method — the steps someone would follow to make it.',
  metricDocumentedMethod:
    'Curated records have a method written and checked with the community. Imported ones have it only where a published recipe exists for them; an encyclopaedia paragraph describing how a dish is generally made is stored as prose and deliberately not promoted to steps, because presenting a description as a method claims a precision it does not have.',
  metricDocumentedCaveat:
    'A method being present says nothing about whether it is the traditional one. That is what the confidence score is for, and most records with a method are classified Modern Adaptation.',
  metricLocatedTitle:
    'Placed below country level',
  metricLocatedCounts:
    'Records that name a region, province, city or village, not only a country.',
  metricLocatedMethod:
    'Any record whose place has a level filled in beneath the country.',
  metricLocatedCaveat:
    'Authenticity has geographic depth, and a country is barely a start — "Kozhikode" is a record, "India" is a heading. A high total with a low share here describes an atlas that is wide and shallow.',
  metricIllustratedTitle:
    'Has a photograph',
  metricIllustratedCounts:
    'Records with an image the app has the right to display.',
  metricIllustratedMethod:
    'From Wikidata, from the dish’s own Wikipedia article, or contributed by a cook through Wikimedia Commons. Every one is stored with its photographer and licence, and none is marked verified: an image found by name or chosen by an editor is good evidence that it shows the dish, not this app’s confirmation of it.',
  metricIllustratedCaveat:
    'A photograph is not evidence of authenticity. It shows a plate somebody cooked, which may or may not be the tradition the record describes.',
  metricFilmedTitle:
    'Has a ranked video',
  metricFilmedCounts:
    'Records with at least one video, ordered by how close the cook is to the tradition.',
  metricFilmedMethod:
    'Ranked by locality — where the cook is, what language they speak in, whether the ingredients and equipment match the record. Never by views, likes or subscribers.',
  metricFilmedCaveat:
    'The ranking is about proximity to the tradition, not quality of filming, and the top video is often the least polished one.',
  metricAssessedTitle:
    'Classified as authentic',
  metricAssessedCounts:
    'Records that reached Authentic — Local or Authentic — Regional through the evidence checks.',
  metricAssessedMethod:
    'Seven checks, each answered or left open, with open checks lowering confidence rather than being filled in by assumption. Technique and community validation are never inferred from an import, which caps what an imported record can reach on its own.',
  metricAssessedCaveat:
    'A low share here is honest rather than a failure. Most of the catalogue is imported and unassessed, and calling those records authentic because they came from a reputable source is exactly the shortcut this scale exists to refuse.',
  metricConcentrationTitle:
    'Concentration',
  metricConcentrationCounts:
    'The share of the whole catalogue held by its single largest country.',
  metricConcentrationMethod:
    'Records in the most-represented country, over the total.',
  metricConcentrationCaveat:
    'This reflects which countries keep open food registries, not where the world’s food is. Italy alone publishes roughly 4,400 registered traditional products; most countries publish none, and their absence here is an absence of paperwork rather than of cooking.',
  metricConfidenceTitle:
    'Confidence',
  metricConfidenceCounts:
    'How the catalogue is distributed across the 0–100 evidence score.',
  metricConfidenceMethod:
    'Curated records are scored by the evidence checks. Imported records are scored only where enrichment found evidence to score, and are otherwise left unscored rather than given a default.',
  metricConfidenceCaveat:
    '"Not scored" is by far the largest band and will stay that way. It means nobody has assessed the record yet — not that it scored badly, and not that the food is doubtful.',
  metricByContinentTitle:
    'Where the records are',
  metricByContinentCounts:
    'Records per continent, counting every record once. A tradition sits on the continent of the country it is recorded in, not the one it may have travelled from.',
  metricByContinentMethod:
    'From each record’s country, through a country-to-continent map that covers around 200 states including historical ones. Supra-national and disputed entries are grouped rather than forced into a continent.',
  metricByContinentCaveat:
    'This is a map of the sources, not of the world’s cooking. Europe leads because European registries are online and open, which is a fact about archives.',
  howIsThisCounted:
    'How is this counted?',
  hideHowThisIsCounted:
    'Hide how this is counted',
  stapleGrains: 'Grains',
  stapleRoots: 'Roots',
  staplePulses: 'Pulses',
  stapleDairy: 'Dairy',
  stapleMeatFish: 'Meat & fish',
  stapleVegetables: 'Vegetables',
  stapleAromatics: 'Aromatics',
  stapleSweetSour: 'Sweet & sour',
  stapleRice: 'Rice',
  stapleWheat: 'Wheat',
  stapleMaize: 'Maize',
  stapleMillet: 'Millet',
  stapleSorghum: 'Sorghum',
  stapleBarley: 'Barley',
  stapleOats: 'Oats',
  stapleBuckwheat: 'Buckwheat',
  stapleTeff: 'Teff',
  staplePotato: 'Potato',
  stapleCassava: 'Cassava',
  stapleSweetPotato: 'Sweet potato',
  stapleYam: 'Yam',
  stapleTaro: 'Taro',
  staplePlantain: 'Plantain',
  stapleLentil: 'Lentils',
  stapleChickpea: 'Chickpeas',
  stapleSoy: 'Soy',
  stapleTofu: 'Tofu',
  stapleBlackBean: 'Black beans',
  stapleMungBean: 'Mung beans',
  staplePigeonPea: 'Pigeon peas',
  stapleMilk: 'Milk',
  stapleYoghurt: 'Yoghurt',
  stapleCheese: 'Cheese',
  staplePaneer: 'Paneer',
  stapleGhee: 'Ghee',
  stapleButter: 'Butter',
  stapleCoconut: 'Coconut',
  stapleChicken: 'Chicken',
  stapleBeef: 'Beef',
  staplePork: 'Pork',
  stapleLamb: 'Lamb',
  stapleGoat: 'Goat',
  stapleFish: 'Fish',
  staplePrawn: 'Prawns',
  stapleEgg: 'Eggs',
  stapleOnion: 'Onion',
  stapleGarlic: 'Garlic',
  stapleGinger: 'Ginger',
  stapleChilli: 'Chilli',
  stapleLemongrass: 'Lemongrass',
  stapleTomato: 'Tomato',
  stapleAubergine: 'Aubergine',
  stapleCabbage: 'Cabbage',
  stapleSpinach: 'Spinach',
  stapleOkra: 'Okra',
  stapleTamarind: 'Tamarind',
  stapleHoney: 'Honey',
  stapleJaggery: 'Jaggery',
  stapleDate: 'Dates',
  stapleLemon: 'Lemon',
  stapleOlive: 'Olive',
  dietVegan: 'Vegan',
  dietVegetarian: 'Vegetarian',
  dietSeafood: 'Seafood',
  dietMeat: 'Non-vegetarian',
  dietUnclassified: 'Not classified',
  dietPoultry: 'Poultry',
  dietPork: 'Pork',
  dietBeef: 'Beef & red meat',
  dietLambGoat: 'Lamb & goat',
  dietGame: 'Game',
  dietFish: 'Fish',
  dietShellfish: 'Shellfish',
  dietOtherSeafood: 'Other seafood',
  dietDairy: 'Contains dairy',
  dietEgg: 'Contains egg',
  dietHoney: 'Contains honey',
  mealBreakfast: 'Breakfast',
  mealLunch: 'Lunch',
  mealDinner: 'Dinner',
  mealSupper: 'Supper',
  mealSnack: 'Snack',
  mealStreetFood: 'Street food',
  mealCelebration: 'Celebration & feast',
  mealAnytime: 'Any time',
  mealUnclassified: 'Not recorded',
  searchModeFind:
    'Find a dish',
  searchModePantry:
    'Cook with what I have',
  ingredientsYouHave:
    'Ingredients you have',
  nTraditions:
    '{n} traditions',
  nothingYet:
    'Nothing yet',
  methodRecorded:
    ' · method recorded',
  noMethodYet:
    ' · no method yet',
  showMoreLeft:
    'Show more — {n} left',
  showNMore:
    'Show {n} more',
  methodAsPublished:
    'The method as published. Modern equipment and shortcuts are part of it.',
  methodTraditional:
    'The traditional method, with no modern shortcuts substituted in.',
  everythingClassified:
    'Everything classified {what}',
  everythingFrom:
    'Everything from {place}',
  everythingRecordedAs:
    'Everything recorded as {what}',
  everythingMadeWith:
    'Everything made with {ingredient}',
  seeEverything:
    '{label} — see everything',
  noPhotographOnRecord:
    '{label} — no photograph on record',
  scoreOutOf100:
    '{label}: {value} out of 100',
  removeFilter:
    'Remove the {key} filter',
  anywhereInTheAtlas:
    ' anywhere in the atlas',
  absenceOfRecords:
    '. That is an absence of records, not an absence of food — we’d rather say we don’t know.',
  narrowToA:
    'Narrow to a {level} · {n} recorded',
  fromTheTown:
    ' — from the town',
  showFewer:
    'Show fewer',
  readAboutOnWikipedia:
    'Read about {name} in {language} on Wikipedia',
  languageChangeIt:
    'Language: {language}. Change it.',
  perCentTranslated:
    '{language}, {n} per cent translated',
  translateThisRecord:
    'Translate this record',
  translating:
    'Translating…',
  translate:
    'Translate',
  translateThisConfirmation:
    'Translate this confirmation into {language}',
  couldNotTranslate:
    'Could not translate — try again',
  howThisIsCountedFor:
    'How {figure} is counted',
  countOfTotal:
    '{label}: {count} of {total}',
  watchAtSourceCreator:
    'Watch {creator} at source',
  stillFromCreator:
    'Still from {creator}',
  thatDidNotSend:
    'That did not send.',
  containsAlcohol:
    'Contains alcohol',
  nothingElseRequired:
    'Everything else is welcome and none of it is required — knowing where a food is from and that nobody has written it down is already more than any source here holds.',
  opensTheFormPrefilled:
    'It opens the form at its source with what you have written already filled in. Nothing about you is collected by this app, and nothing is published until people from the place confirm it.',
  scoreDimGeographic:
    'Geographic connection',
  scoreDimIngredients:
    'Traditional ingredients',
  scoreDimTechnique:
    'Traditional technique',
  scoreDimLocalSource:
    'Local source',
  scoreDimDocumentation:
    'Cultural documentation',
  scoreDimCommunity:
    'Community validation',
  photoFromWikidata:
    'Attached to this dish’s own Wikidata entry — not matched by name',
  photoFromArticle:
    'The lead image of this dish’s own encyclopaedia article',
  photoFromRecipe:
    'Published on this recipe’s own page',
  photoFromSearch:
    'Matched by name on Wikimedia Commons — the subject is not confirmed',
  photoFromUnknown:
    'Source not recorded — treat the subject as unconfirmed',
  noTranslationRecorded:
    'No translation of this account has been recorded yet, so it is shown in {language}, the language it was documented in. We’d rather show you the original than a machine’s guess at a fermentation time.',
  machineTranslationBy:
    'Machine translation by {translator}. No one from the community has checked it — ingredient and equipment names are left in the original.',
  translatedBy:
    'Translated by {translator}. Ingredient and equipment names are left in the original.',
  videoOriginalAudio:
    'Spoken in {language} — the cook’s own language. Nothing is translated.',
  videoCreatorTrack:
    'The creator published an audio track in {language}. It opens in that track at the source — the translation is the creator’s own, not ours.',
  videoPlatformCaptions:
    'Spoken in {spoken}. Opens with machine-translated {preferred} captions over the original audio — the cook’s voice is not replaced, and the translation is the video platform’s, not a human one.',
  videoLanguageUnknown:
    'We don’t have this video’s spoken language on record, so we can’t promise {language}. It opens at the source, where the platform’s own caption options apply.',
  figureDocumented:
    'Has a recorded method',
  figureDocumentedNote:
    'The number that says whether this is an atlas or a list of names. Everything else is secondary to it.',
  figureLocated:
    'Placed below country level',
  figureLocatedNote:
    'Authenticity has geographic depth. “Kozhikode” is a record; “India” is barely a start.',
  figureIllustrated:
    'Has a photograph',
  figureIllustratedNote:
    'A dish nobody can picture is hard to care about, and harder to recognise.',
  figureFilmed:
    'Has a ranked video',
  figureFilmedNote:
    'Ranked by the cook’s closeness to the tradition — not a search result.',
  figureAssessed:
    'Classified as authentic',
  figureAssessedNote:
    'Earned through the evidence checks. A low share here is honest, not a failure.',
  atlasSummary:
    '{n} traditions documented across {c} countries. Coverage is stated honestly: a country absent here has nothing recorded yet, not nothing to record.',
  nothingRecorded:
    'Nothing recorded',
  nothingRecordedAs:
    'Nothing recorded as {what}',
  nothingRecordedAsAnd:
    'Nothing recorded as {list} and {last}',
  photoVia:
    'photo via',
  photoNothingEntered:
    'Nothing entered yet.',
  photoNothingEnteredFix:
    'Paste the Commons file name or the link to its file page.',
  photoWrongHost:
    'That link goes to {host}, and we have no right to publish a photograph from there.',
  photoWrongHostFix:
    'If the photograph is yours, upload it to Wikimedia Commons under a free licence and paste the file name here. It stays yours, you are credited wherever it appears, and it costs nothing.',
  photoNotCommons:
    'That link is not on Wikimedia Commons.',
  photoNotCommonsFix:
    'Only Commons files can be published here, because only they carry a licence that lets us show them.',
  photoNoFileName:
    'No file name found in that.',
  photoNoFileNameFix:
    'Paste the file name, for example Kaipola.jpg.',
  photoNotAPhotograph:
    'That is not a photograph file.',
  photoNotAPhotographFix:
    'Commons photographs end in .jpg, .png or .webp. Diagrams and logos are not used here.',
  photoIsADrawing:
    'That is a drawing, not a photograph.',
  photoIsADrawingFix:
    'Use a photograph of the food as it was made.',
  serverRefused:
    'The server refused it ({status}).',
  serverTookTooLong:
    'The server took too long to answer.',
  couldNotReachServer:
    'Could not reach the server.',
  nothingYouTypedIsLost:
    '{message} Your entry has not been sent — nothing you typed is lost, try again in a moment.',
  proposalsNotOpen:
    'Proposals are not open yet.',
  confirmationsNotOpen:
    'Confirmations are not open yet.',
  alreadyProposed:
    'This dish has already been proposed. Open it and confirm it instead — that is what moves it.',
  alreadyConfirmed:
    'You have already confirmed this one.',
  youProposedThis:
    'You proposed this dish, so it needs somebody else to confirm it.',
  stillNeededList:
    'Still needed: {list}.',
  listAnd:
    '{list} and {last}',
  listOr:
    '{list} or {last}',
  proposalConfirmed:
    'Confirmed. This enters the atlas at the next update.',
  proposalNobodyYet:
    'Nobody has confirmed this yet. {n} people who know the dish would bring it into the atlas.',
  proposalSoFar:
    '{have} of {n} confirmations. {short} more from people who know the dish would bring it in.',
  recordNobodyYet:
    'Nobody from the place has confirmed this yet. {n} confirmations would authenticate it.',
  recordSoFar:
    '{have} of {n} confirmations. {short} more from people who know the dish would authenticate it.',
  atRiskNote:
    'Flagged because a source describes this tradition as declining — the sentence is shown with the record. It is never inferred from how little we have documented: a gap in our records is not evidence that anyone has stopped cooking.',
  originDisclaimer:
    'This dish has more than one documented historical claim. The traditions below are recorded as they are described by each place, with their sources. No claim here is presented as the winner, and none of this affects the authenticity score — that measures how the dish is made in a place, not who first made it.',
  supportRunsOn:
    'Everything in the atlas comes from Wikipedia, Wikidata, Wikimedia Commons, Wikibooks and open regional registers. They are free to read, openly licensed, and credited on every record that uses them. That is the whole basis of the project staying free, and it is a decision rather than a stage.',
  contributeToTheAtlas:
    'Contribute to the atlas',
  answeredByDocuments:
    'Documents can answer these',
  answeredByPeople:
    'Only people can answer these',
  scaleDocumentsStop:
    'documents stop here',
  scaleAuthenticBegins:
    'Authentic begins',
  pantryNothingUses:
    'Nothing recorded uses {list}. That may mean nobody has written down a dish that does — {p}% of the atlas has no ingredients listed at all.',
  alsoRecordedIn:
    'Also recorded under {list}',
  alsoRecordedNote:
    'The atlas holds a separate record for this dish there. Neither is a correction of the other — a dish two food cultures make is not a mistake in one of them.',
  chooseACountry:
    'Choose a country',
  filterTheList:
    'Type to narrow the list',
  showingFirstNOfM:
    'Showing the first {n} of {m}. Keep typing to narrow it.',
  nothingMatchesThat:
    'Nothing in the list matches that.',
  continentBeyondOneCountry:
    'Beyond one country',
  beyondOneCountryNote:
    'Origins the sources record as wider than a single country — a region, a shared culinary area, or a state that no longer exists. They are kept as the source states them rather than narrowed to a country nobody chose.',
  connectionGrewUpThere:
    'I grew up there',
  connectionLiveThere:
    'I live there',
  connectionFamilyFrom:
    'My family is from there',
  connectionLearnedThere:
    'I learned to make it there',
  connectionCookProfessionally:
    'I cook it there professionally',
  chooseYourConnection:
    'Choose what applies',
  connectionInYourWords:
    'Anything you want to add, in your own words',
  connectionDetailPlaceholder:
    'My grandmother made it every Eid in Kozhikode',
  dictateSpeak:
    'Speak instead',
  dictateListening:
    'Listening — tap to stop',
  dictateStop:
    'Stop listening',
  dictateSendsAudio:
    'Your browser does the listening, and most browsers send the audio to their own servers to do it. What you say is added to the box above, where you can correct it.',
  dictateNotAllowed:
    'The browser did not give permission for the microphone.',
  dictateDidNotWork:
    'That did not work. You can still type it.',
  polishTidyThis:
    'Tidy up my typing',
  polishWorking:
    'Tidying…',
  polishMachineMade:
    'Suggested by machine — your words are still above',
  polishUseThis:
    'Use this',
  polishKeepMine:
    'Keep mine',
  polishOnlyTyping:
    'Only spelling, punctuation and spacing are touched. Nothing is added, removed or reworded, and no name is changed.',
  polishFoundNothing:
    'Nothing to fix — what you wrote reads fine.',
  polishDidNotWork:
    'That did not work. What you wrote is unchanged.',
  continentAfrica:
    'Africa',
  continentAsia:
    'Asia',
  continentEurope:
    'Europe',
  continentNorthAmerica:
    'North America',
  continentSouthAmerica:
    'South America',
  continentOceania:
    'Oceania',
  regionLevant:
    'Levant',
  regionLatinAmerica:
    'Latin America',
  regionMiddleEast:
    'Middle East',
  regionMaghreb:
    'Maghreb',
  regionCentralEurope:
    'Central Europe',
  regionEasternEurope:
    'Eastern Europe',
  regionSouthernEurope:
    'Southern Europe',
  regionCentralAsia:
    'Central Asia',
  regionIndianSubcontinent:
    'Indian subcontinent',
  regionNorthAfrica:
    'North Africa',
  regionAmericas:
    'Americas',
  regionAncientNearEast:
    'ancient Near East',
  regionBalkans:
    'Balkans',
  regionCaribbean:
    'Caribbean',
  regionLowCountries:
    'Low Countries',
  regionMesoamerica:
    'Mesoamerica',
  regionMiddleEasternEmpires:
    'Middle Eastern empires',
  regionPolishLithuanianCommonwealth:
    'Polish–Lithuanian Commonwealth',
  regionQajarIran:
    'Qajar Iran',
  regionRussianEmpire:
    'Russian Empire',
  regionSouthCaucasus:
    'South Caucasus',
  regionSovietCentralAsia:
    'Soviet Central Asia',
  regionWu:
    'Wu',
  regionArtsakh:
    'Republic of Artsakh',
  refineDietOccasion:
    'Diet & occasion',
  refineAny:
    'Any',
  placeKindWiderRegion:
    'wider region',
  placeKindFormerState:
    'former state',
  oneTradition:
    '{n} tradition',
  onePlace:
    '{n} place',
  nPlaces:
    '{n} places',
  countryLevelOnly:
    'country level only',
  summaryWorldwide:
    ' worldwide',
  nRecorded:
    '{n} recorded',
  writtenInLanguage:
    'Written in {language}',
  whatThisIs:
    'What this is',
  atlasDefinition:
    'A free atlas of traditional dishes — where each one comes from, and who vouches for it.',
  traditionsLabel:
    'traditions',
  freeNoAds:
    'Free, no ads',
  quotedFromSource:
    'Quoted from the source below — a general account of how the dish is made, not a record of how it is made in {place}.',
  adaptationLeadIn:
    'How this dish is commonly made today. It is not a record of how it is prepared in {place}, and nobody from there has confirmed it.',
  openDisagreementBody:
    'Someone who cooks this in {place} says it is made differently: {differs} Nothing has been removed while this is looked at, and the confidence below is unchanged — if both accounts hold, the record will split rather than one being overruled.',
  engagementNotShown:
    'Engagement figures are deliberately not shown — they don’t measure authenticity.',
  videoSearchNote:
    'You can search for one at the source. Results come back ordered by view count, which measures reach and nothing else — the cook may or may not be from {place}. Nothing found this way affects this record’s classification.',
  nowOpenForConfirmation:
    '{name} is now open for confirmation.',
  proposalOpenBody:
    '{n} people who know the dish have to confirm it before it enters the atlas. Anyone can see it and confirm it from now on — including people you tell about it, which is usually how a dish nobody has written down gets confirmed.',
  nothingMatchesBody:
    'Nothing in the atlas matches {query} yet. Absence here means no record, not no food — we’d rather say we don’t know than guess.',
  thatWord:
    'that',
  disclaimerNameAndPlaceOnly:
    'Only the name and the place are recorded. Nothing documents how this is made, so it carries no score and stays Unverified until someone from the place records the preparation.',
  disclaimerPublishedAccountOnly:
    'A published account describes how this is made, but nothing here confirms it is how the people of the place make it. No ingredients are recorded and nobody from the community has checked it, so it carries no score and stays Unverified.',
  disclaimerHeritageNoMethod:
    'Listed as a protected or registered traditional product ({list}), with its ingredients recorded. That establishes the tradition and its region. It does not establish the method: the traditional technique and community validation checks are both still open, which is why the confidence is this low.',
  disclaimerIngredientsAndPlace:
    'The ingredients and the place are documented, so this is recorded as a traditional version rather than an authenticated local preparation. No source here describes the technique, and no one from the place has confirmed it.',
  disclaimerSomeDocumentation:
    'Some documentation exists, but not enough to classify the preparation. The ingredients, the technique and community confirmation are all missing — the score reflects that, and the record stays Unverified.',
  dietBasisImported:
    'Imported from Wikidata, which does not record the preparation. No dietary classification can be made until the method is documented.',
  disclaimerConfirmedOne:
    '{n} person with a stated connection to the place has confirmed this preparation, which is what lifts it above a documented version.',
  disclaimerConfirmedMany:
    '{n} people with a stated connection to the place have confirmed this preparation, which is what lifts it above a documented version.',
  disclaimerConfirmedLocal:
    'The confirmations name the locality itself, so it is recorded as a local tradition.',
  disclaimerConfirmedRegional:
    'The confirmations speak for the wider region rather than one town, so it is recorded as regional.',
  disclaimerScoreIsMean:
    'The score is the mean of the six checks below and can be added up.',
  oneCountry:
    '{n} country',
  nCountries:
    '{n} countries',
  oneOrigin:
    '{n} origin',
  nOrigins:
    '{n} origins',
  interfaceTranslationNote:
    'This interface was translated by machine and has not been checked by a speaker. The records themselves are unaffected. Corrections are welcome.',
};

/**
 * Plural forms beyond `one` and `other`, for the languages that have them.
 *
 * Kept off `Copy` on purpose, and the first attempt proves why: adding them there as
 * optional members widened `keyof Copy`, so every dynamic `copy[key]` lookup in the app
 * became `string | undefined` and `shelves.ts` stopped compiling. The extras are read by
 * `pluralOf` and nothing else, so they do not belong in the type every screen indexes.
 *
 * Named by convention rather than declared one by one: `{otherKey}Few`, `{otherKey}Many`.
 */
export type PluralExtras = Record<`${string}Few` | `${string}Many`, string>;

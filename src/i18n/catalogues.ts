/**
 * The chrome in the languages the app has been translated into so far.
 *
 * Twelve, and the choice is not a ranking of anybody's food. It is where the largest
 * numbers of readers are, minus the right-to-left languages: Arabic, Hebrew and
 * Persian are all on the reading list and all need mirrored layout rather than
 * swapped strings, which is a separate job and a real one. Shipping them as
 * left-to-right text would look broken and read worse than English.
 *
 * `Partial<Copy>` is deliberate. A catalogue may be incomplete and still ship — a
 * missing key falls through to English, so a language can arrive the day somebody
 * translates half of it instead of waiting to be finished. It also means adding a
 * language is one entry in this object and nothing else.
 *
 * That matters right now more than it will later: the English catalogue is still
 * growing as strings are lifted out of the screens, so these are all partial by
 * construction. `translationCoverage` reports how much of each is done. English
 * first, then translate once against a key set that has stopped moving.
 *
 * ## A word that is the same in both languages is omitted
 *
 * The French for "Cuisine" is "Cuisine" and the Dutch for "Filters" is "Filters".
 * Writing those in would be indistinguishable from forgetting to translate them, and
 * a catalogue that claims a key it has not translated makes the coverage figure lie.
 * Leaving them out renders exactly the same word through the fallback and understates
 * coverage by a key or two, which is the error worth having.
 *
 * ## These are machine translations
 *
 * Written without a speaker checking them, and the app says so through
 * `interfaceTranslationNote` rather than letting a reader assume otherwise. That is
 * the same rule `translate.ts` applies to a translated record, for the same reason:
 * the reader is entitled to know who translated what they are reading. The
 * difference is only in the stakes — these are our own words about our own buttons,
 * so a clumsy one is a clumsy button and not a corrupted record.
 */

import type { Copy } from './copy';

export const CATALOGUES: Readonly<Record<string, Partial<Copy>>> = {
  es: {
    goBack: 'Volver',
    search: 'Buscar',
    backToShelves: 'Volver a los estantes',
    seeAll: 'Ver todo',
    worldwide: 'Todo el mundo',
    world: 'Mundo',
    chooseCountry: 'Elegir un país',
    nothingRecordedHere: 'Aquí no hay nada registrado todavía',
    resetFilters: 'Restablecer los filtros',
    recordedNotAssessed: 'Registrado, aún sin evaluar',
    mostLookedUp: 'Lo más consultado',
    wikipediaReaders: 'Lectores de Wikipedia',
    deepestLevelRecorded: 'Nivel más detallado registrado aquí',
    searchPlaceholder: 'Plato, país, región, ciudad o ingrediente',
    filters: 'Filtros',
    nothingApplied: 'ninguno aplicado',
    results: 'Resultados',
    matches: 'coincidencias',
    noMatch: 'Sin coincidencias',
    authenticityLevel: 'Nivel de autenticidad',
    cuisine: 'Cocina',
    kindOfDish: 'Tipo de plato',
    traditionalIngredient: 'Ingrediente tradicional',
    sortResultsBy: 'Ordenar resultados por',
    authenticityConfidence: 'Confianza en la autenticidad',
    atRiskFirst: 'En riesgo primero',
    notClassified: 'Sin clasificar',
    askForItInstead: 'Pedirlo en su lugar',
    surpriseMe: 'Sorpréndeme con una tradición en riesgo',
    browseTheAtlas: 'Explorar el atlas del mundo',
    clearAll: 'Borrar todo',
    none: 'Ninguno',
    video: '▶ Vídeo',
    iKnowHowItsMade: 'Sé cómo se prepara — regístralo',
    loadingAtlas: 'Leyendo el atlas…',
    couldNotLoad: 'No se pudo cargar el atlas.',
    shelfDisappearing: 'En desaparición',
    shelfDisappearingNote: 'Tradiciones que una fuente describe en declive — primero las no documentadas, porque son las que se pierden.',
    shelfAuthenticated: 'Autenticadas',
    shelfAuthenticatedNote: 'Los registros que llevan pruebas reales de cómo se preparan, y dónde.',
    shelfCookable: 'Podrías cocinar esto esta noche',
    shelfCookableNote: 'Registros con un método escrito — tradicional cuando lo tenemos, publicado cuando no.',
    shelfIllustrated: 'Merece la pena verlo',
    shelfIllustratedNote: 'Tradiciones fotografiadas, para hojear más que para buscar.',
    foodAtlas: 'Atlas gastronómico',
    howComplete: '¿Qué tan completo está este atlas?',
    traditionsRecorded: 'tradiciones registradas',
    countries: 'países',
    atRiskTraditions: 'tradiciones en riesgo',
    whereTheRecordsAre: 'Dónde están los registros',
    confidence: 'Confianza',
    growTheAtlas: 'Haz crecer el atlas',
    addATradition: 'Añade una tradición de tu zona',
    keepingItFree: 'Mantenerlo gratis',
    whatItCostsToRun: 'Lo que cuesta mantenerlo',
    anywhere: 'En cualquier lugar',
    noRecord: 'Sin registro',
    backToTheFeed: 'Volver al inicio',
    bookmarkThis: 'Guardar esta tradición',
    photoOriginUnverified: 'Origen de la foto sin verificar',
    whyFlaggedAtRisk: 'Por qué está marcada en riesgo',
    openDisagreement: 'Desacuerdo abierto',
    ingredientsNamedInAccount: 'Ingredientes citados en ese relato',
    methodStillOpen: 'El método sigue abierto',
    notDocumentedYet: 'Aún sin documentar',
    recordHowItsMade: 'Registra cómo se prepara',
    traditionalEquipment: 'Utensilios tradicionales',
    mostPopularVersion: 'Versión más popular en internet',
    watchItBeingMade: 'Míralo preparar',
    findPreparationVideos: 'Buscar vídeos de preparación ↗',
    whereTheMethodComesFrom: 'De dónde viene el método',
    alsoMadeThisWay: 'También se prepara así',
    howItWorks: 'Cómo funciona',
    proposeADish: 'Proponer un plato',
    confirm: 'Confirmar',
    confirmAProposal: 'Confirmar una propuesta',
    everyRecord: 'Todos los registros',
    addATraditionShort: 'Añadir una tradición',
    navExplore: 'Explorar',
    navContribute: 'Contribuir',
    navAbout: 'Acerca de',
    theGapThatCannotBeClosed: 'La distancia que no se cierra leyendo',
    aDocumentCannotMakeAuthentic: 'Un documento no puede hacer auténtico un plato.',
    sixThingsScoredSeparately: 'Seis cosas, puntuadas por separado',
    whatClosesIt: 'Qué la cierra',
    whatThisIsNot: 'Lo que esto no es',
    whichIsWhereYouComeIn: 'Y ahí entras tú',
    confirmADishYouKnow: 'Confirma un plato que conozcas',
    proposeOneMissing: 'Propón uno que falte en el atlas',
    whatItDoesNotBuy: 'Lo que no compra',
    contributeOnOpenCollective: 'Contribuir en Open Collective',
    readTheLedger: 'Ver el libro de cuentas — cada aporte y cada gasto',
    notOpenForDonationsYet: 'Aún no abierto a donaciones',
    browse: 'Explorar',
    startAgain: 'Empezar de nuevo',
    openProposals: 'Propuestas abiertas',
    whatTheseAre: 'Qué son estas',
    proposed: 'Propuesto',
    seeOpenProposals: 'Ver propuestas abiertas',
    beforeYouStart: 'Antes de empezar',
    theDish: 'El plato',
    writtenTheWayYouWriteIt: 'Escrito como tú lo escribes',
    country: 'País',
    regionDistrictOrTown: 'Región, comarca o pueblo',
    whoMakesItAndWhen: 'Quién lo hace, y cuándo',
    ingredientsOnePerLine: 'Ingredientes — uno por línea',
    howItIsMadeOnePerLine: 'Cómo se hace — un paso por línea',
    yourName: 'Tu nombre',
    shownOnTheProposal: 'Se muestra en la propuesta',
    yourConnectionToThePlace: 'Tu vínculo con el lugar',
    proposeThisDish: 'Proponer este plato',
    dishInItsOwnLanguage: 'Plato, en su propia lengua si es posible',
    whereIsItMadeThisWay: '¿Dónde se hace así?',
    whoPreparesIt: 'Quién lo prepara',
    traditionalIngredientsAndEquipment: 'Ingredientes y utensilios tradicionales',
    publishAPhotographOnCommons: 'Publicar una foto en Commons',
    commonsFileNameOrLink: 'Nombre de archivo o enlace de Commons',
    checkWhatExistsOnline: 'Ver qué existe ya en internet',
    whatTheInternetAlreadyHas: 'Lo que ya hay en internet',
    runTheEvidenceAssessment: 'Ejecutar la evaluación de pruebas',
    evidenceAssessment: 'Evaluación de pruebas',
    sendForCommunityValidation: 'Enviar a validación de la comunidad',
    communityValidation: 'Validación de la comunidad',
    ifTheyDisagree: 'Si no están de acuerdo',
    nowSendYours: 'Ahora envía el tuyo',
    sendThisTradition: 'Enviar esta tradición',
    submissionsNotOpenYet: 'Los envíos aún no están abiertos',
    backToTheAtlas: 'Volver al atlas',
    settingsTitle: 'Ajustes',
    whatThisChanges: 'Qué cambia esto',
    administratorToken: 'Token de administrador',
    tokenNotStored: 'No se guarda — se escribe cada sesión',
    queueThisCheck: 'Poner esta comprobación en cola',
    loadAnalytics: 'Cargar analíticas',
    mostOpenedDishes: 'Platos más abiertos',
    mostSearchedFor: 'Lo más buscado',
    mostUsedShelves: 'Estantes más usados',
    screens: 'Pantallas',
    oftenTheWholePoint: 'A menudo es lo esencial — opcional',
    grewUpInMalabar: 'Crecí en Malabar',
    whatTheseAreBody:
      'Platos que alguien dice que existen y de los que el atlas no tiene registro. Cada uno necesita {n} confirmaciones de personas que lo conocen antes de entrar en el atlas, juzgado por las mismas seis dimensiones que cualquier otro registro.',
    proposalsNotOpenYet:
      'Las propuestas aún no están abiertas',
    proposalsNotOpenNote:
      'Esto necesita un sitio donde guardar lo que la gente envía. Hasta que exista, la app lo dice en vez de mostrar una lista vacía como si nadie tuviera nada que aportar.',
    nothingIsWaiting:
      'No hay nada pendiente',
    nothingIsWaitingNote:
      'Todas las propuestas han sido resueltas. Si conoces un plato que el atlas no tiene, empieza aquí.',
    loading:
      'Cargando…',
    proposedBy:
      'Propuesto por',
    beforeYouStartBody:
      'Esto es para comida que el atlas no tiene, normalmente porque nadie la ha escrito. No hace falta una receta completa. Un nombre, de dónde es y tu vínculo con el lugar bastan para abrirla a confirmación.',
    notPublishedBySending:
      'Enviarla no la publica. Primero {n} personas que conocen el plato lo confirman, y entra en el atlas con lo que sus pruebas merezcan, igual que cualquier otro registro.',
    atlasMayAlreadyHaveThis:
      'El atlas quizá ya lo tenga',
    duplicateNote:
      'Si alguno de estos es tu plato, confirmarlo es lo que lo mueve, y vale más que un segundo registro. Si ninguno lo es, sigue adelante; dos platos pueden compartir nombre.',
    connectionRequiredNote:
      'Obligatorio, y se muestra. Es toda la diferencia entre esto y una receta copiada de internet, que el atlas ya se niega a guardar.',
    proposeClosedNote:
      'Esto necesita un sitio donde guardar lo que la gente envía, y no está configurado. Nada de lo que escribas aquí llegaría a ninguna parte, así que la app lo dice en vez de aceptarlo.',
    pantryNoMatches:
      'Nada de lo registrado usa esos juntos. Prueba de uno en uno, o propón el plato que tenías en mente si el atlas no lo tiene.',
    pantryPrompt:
      'Di qué hay en tu cocina. Solo la mitad del atlas tiene sus ingredientes registrados, así que un plato que falte aquí puede ser simplemente uno que nadie ha escrito todavía.',
    requestsNotOpenNote:
      'Las peticiones aún no están abiertas, así que la única forma de que un plato entre en el atlas es que alguien lo registre.',
    footerHolding:
      '{n} tradiciones de {c} países. Gratis de leer, sin publicidad y sin rastrear nada.',
    footerSources:
      'Construido a partir de Wikipedia, Wikidata, Wikimedia Commons, Wikibooks y los datos abiertos regionales de Italia, todos libres de leer y con licencia abierta. Las fotografías se acreditan a sus autores en cada registro que lleva una.',
    atlasCoverageLine:
      '{n} tradiciones documentadas en {c} países. La cobertura se declara con honestidad: un país ausente aquí no tiene nada registrado todavía, no es que no haya nada que registrar.',
    concentrationNote:
      'El {p}% del catálogo viene solo de {country}. Eso refleja qué países se han catalogado en las fuentes abiertas de las que parte esto, no dónde está la comida del mundo.',
    growTheAtlasBody:
      'Para cada plato, el atlas primero toma la receta más publicada de internet y la clasifica. Donde no existe nada en línea, una aportación de la comunidad se convierte en el registro.',
    keepingItFreeBody:
      'Todo lo de aquí está construido con fuentes que no cuestan nada y siguen así. Una sola cosa cuesta dinero, y está apagada hasta que se pueda pagar.',
    meterDocumented:
      'Tiene un método registrado',
    meterDocumentedNote:
      'La cifra que dice si esto es un atlas o una lista de nombres. Todo lo demás es secundario.',
    meterLocated:
      'Situado por debajo del país',
    meterLocatedNote:
      'La autenticidad tiene profundidad geográfica. “Kozhikode” es un registro; “India” apenas es un comienzo.',
    meterIllustrated:
      'Tiene fotografía',
    meterIllustratedNote:
      'Un plato que nadie puede imaginar es difícil de querer, y más difícil de reconocer.',
    meterFilmed:
      'Tiene vídeo ordenado',
    meterFilmedNote:
      'Ordenado por la cercanía del cocinero a la tradición, no por un resultado de búsqueda.',
    meterAssessed:
      'Clasificado como auténtico',
    meterAssessedNote:
      'Ganado con las comprobaciones de pruebas. Una proporción baja aquí es honesta, no un fracaso.',
    supportLead:
      '{n} tradiciones, construidas enteramente con fuentes libres de leer y con licencia abierta. Sin publicidad, sin rastreo y nada tras un pago. Esto es lo que cuesta de verdad, incluidas las partes que no cuestan nada. Las cifras están en {currency}.',
    notForSaleAuthentic:
      'Un registro no puede volverse Auténtico pagando. Eso viene de las pruebas y de las personas que cocinan el plato.',
    notForSalePromotion:
      'Ningún plato se promociona, se sitúa más arriba ni se destaca porque alguien haya pagado.',
    notForSaleAdvertising:
      'Aquí no hay publicidad, y no se rastrea a ningún lector.',
    donationFootnote:
      'Se abre en Open Collective. Aquí no se cobra nada: esta app no guarda datos de pago tuyos y nunca lo hará.',
    donationsPendingBody:
      'No hay adónde enviar dinero. Cuando lo haya, será un Open Collective, para que cada aporte y cada gasto sean públicos y cualquiera pueda contrastar esta página con el libro de cuentas.',
    mostUsefulThing:
      'Lo más útil que alguien puede dar a este atlas no es dinero. La mayor parte es un nombre y un lugar porque nadie ha escrito cómo se hace la comida.',
    administration:
      'Administración',
    administrationNote:
      'Umbrales, moderación, comprobación de fuentes y uso. Requiere un token.',
    interfaceTranslationNote:
      'Esta interfaz se tradujo automáticamente y ningún hablante la ha revisado. Los registros en sí no están afectados. Se agradecen las correcciones.',
  },

  fr: {
    goBack: 'Retour',
    search: 'Rechercher',
    backToShelves: 'Retour aux rayons',
    seeAll: 'Tout voir',
    worldwide: 'Monde entier',
    world: 'Monde',
    chooseCountry: 'Choisir un pays',
    nothingRecordedHere: 'Rien n’est encore enregistré ici',
    resetFilters: 'Réinitialiser les filtres',
    recordedNotAssessed: 'Enregistré, pas encore évalué',
    mostLookedUp: 'Les plus consultés',
    wikipediaReaders: 'Lecteurs de Wikipédia',
    deepestLevelRecorded: 'Niveau le plus précis enregistré ici',
    searchPlaceholder: 'Plat, pays, région, ville ou ingrédient',
    filters: 'Filtres',
    nothingApplied: 'aucun appliqué',
    results: 'Résultats',
    matches: 'résultats',
    noMatch: 'Aucun résultat',
    authenticityLevel: 'Niveau d’authenticité',
    // `cuisine` omitted: the French for it is "Cuisine". See the note above.
    kindOfDish: 'Type de plat',
    traditionalIngredient: 'Ingrédient traditionnel',
    sortResultsBy: 'Trier les résultats par',
    authenticityConfidence: 'Confiance dans l’authenticité',
    atRiskFirst: 'En péril d’abord',
    notClassified: 'Non classé',
    askForItInstead: 'Le demander à la place',
    surpriseMe: 'Surprenez-moi avec une tradition en péril',
    browseTheAtlas: 'Parcourir l’atlas du monde',
    clearAll: 'Tout effacer',
    none: 'Aucun',
    video: '▶ Vidéo',
    iKnowHowItsMade: 'Je sais comment on la prépare — enregistrez-la',
    loadingAtlas: 'Lecture de l\'atlas…',
    couldNotLoad: 'L\'atlas n\'a pas pu être chargé.',
    shelfDisappearing: 'En voie de disparition',
    shelfDisappearingNote: 'Des traditions qu\'une source décrit comme déclinantes — les non documentées d\'abord, car ce sont celles qui disparaissent.',
    shelfAuthenticated: 'Authentifiées',
    shelfAuthenticatedNote: 'Les fiches qui portent de vraies preuves de la façon dont elles sont préparées, et où.',
    shelfCookable: 'Vous pourriez cuisiner cela ce soir',
    shelfCookableNote: 'Des fiches avec une méthode écrite — traditionnelle quand nous l\'avons, publiée sinon.',
    shelfIllustrated: 'À regarder',
    shelfIllustratedNote: 'Traditions photographiées, à parcourir plutôt qu’à chercher.',
    foodAtlas: 'Atlas culinaire',
    howComplete: 'Cet atlas est-il complet ?',
    traditionsRecorded: 'traditions enregistrées',
    countries: 'pays',
    atRiskTraditions: 'traditions menacées',
    whereTheRecordsAre: 'Où se trouvent les fiches',
    confidence: 'Confiance',
    growTheAtlas: 'Enrichir l\'atlas',
    addATradition: 'Ajoutez une tradition de votre région',
    keepingItFree: 'Le garder gratuit',
    whatItCostsToRun: 'Ce que coûte son fonctionnement',
    anywhere: 'N\'importe où',
    noRecord: 'Aucune fiche',
    backToTheFeed: 'Retour à l\'accueil',
    bookmarkThis: 'Mettre cette tradition en favori',
    photoOriginUnverified: 'Origine de la photo non vérifiée',
    whyFlaggedAtRisk: 'Pourquoi elle est signalée comme menacée',
    openDisagreement: 'Désaccord ouvert',
    ingredientsNamedInAccount: 'Ingrédients cités dans ce récit',
    methodStillOpen: 'La méthode reste ouverte',
    notDocumentedYet: 'Pas encore documenté',
    recordHowItsMade: 'Enregistrez comment on la prépare',
    traditionalEquipment: 'Ustensiles traditionnels',
    mostPopularVersion: 'Version la plus populaire en ligne',
    watchItBeingMade: 'Regardez-la se préparer',
    findPreparationVideos: 'Trouver des vidéos de préparation ↗',
    whereTheMethodComesFrom: 'D\'où vient la méthode',
    alsoMadeThisWay: 'Préparée aussi de cette façon',
    howItWorks: 'Comment ça marche',
    proposeADish: 'Proposer un plat',
    confirm: 'Confirmer',
    confirmAProposal: 'Confirmer une proposition',
    everyRecord: 'Toutes les fiches',
    addATraditionShort: 'Ajouter une tradition',
    navExplore: 'Explorer',
    navContribute: 'Contribuer',
    navAbout: 'À propos',
    theGapThatCannotBeClosed: 'L’écart que la lecture ne comble pas',
    aDocumentCannotMakeAuthentic: 'Un document ne peut pas rendre un plat authentique.',
    sixThingsScoredSeparately: 'Six éléments, notés séparément',
    whatClosesIt: 'Ce qui le comble',
    whatThisIsNot: 'Ce que ceci n’est pas',
    whichIsWhereYouComeIn: 'C’est là que vous intervenez',
    confirmADishYouKnow: 'Confirmez un plat que vous connaissez',
    proposeOneMissing: 'Proposez-en un qui manque à l’atlas',
    whatItDoesNotBuy: 'Ce que cela n’achète pas',
    contributeOnOpenCollective: 'Contribuer sur Open Collective',
    readTheLedger: 'Consulter le registre — chaque contribution et chaque dépense',
    notOpenForDonationsYet: 'Pas encore ouvert aux dons',
    browse: 'Parcourir',
    startAgain: 'Recommencer',
    openProposals: 'Propositions ouvertes',
    whatTheseAre: 'De quoi il s’agit',
    proposed: 'Proposé',
    seeOpenProposals: 'Voir les propositions ouvertes',
    beforeYouStart: 'Avant de commencer',
    theDish: 'Le plat',
    writtenTheWayYouWriteIt: 'Écrit comme vous l’écrivez',
    country: 'Pays',
    regionDistrictOrTown: 'Région, canton ou ville',
    whoMakesItAndWhen: 'Qui le prépare, et quand',
    ingredientsOnePerLine: 'Ingrédients — un par ligne',
    howItIsMadeOnePerLine: 'Comment on le prépare — une étape par ligne',
    yourName: 'Votre nom',
    shownOnTheProposal: 'Affiché sur la proposition',
    yourConnectionToThePlace: 'Votre lien avec ce lieu',
    proposeThisDish: 'Proposer ce plat',
    dishInItsOwnLanguage: 'Plat, dans sa propre langue si possible',
    whereIsItMadeThisWay: 'Où le prépare-t-on ainsi ?',
    whoPreparesIt: 'Qui le prépare',
    traditionalIngredientsAndEquipment: 'Ingrédients et ustensiles traditionnels',
    publishAPhotographOnCommons: 'Publier une photo sur Commons',
    commonsFileNameOrLink: 'Nom de fichier ou lien Commons',
    checkWhatExistsOnline: 'Voir ce qui existe déjà en ligne',
    whatTheInternetAlreadyHas: 'Ce que l’internet a déjà',
    runTheEvidenceAssessment: 'Lancer l’évaluation des preuves',
    evidenceAssessment: 'Évaluation des preuves',
    sendForCommunityValidation: 'Envoyer à la validation communautaire',
    communityValidation: 'Validation communautaire',
    ifTheyDisagree: 'S’ils ne sont pas d’accord',
    nowSendYours: 'Envoyez la vôtre',
    sendThisTradition: 'Envoyer cette tradition',
    submissionsNotOpenYet: 'Les envois ne sont pas encore ouverts',
    backToTheAtlas: 'Retour à l’atlas',
    settingsTitle: 'Réglages',
    whatThisChanges: 'Ce que cela change',
    administratorToken: 'Jeton d’administrateur',
    tokenNotStored: 'Non enregistré — à retaper chaque session',
    queueThisCheck: 'Mettre cette vérification en file',
    loadAnalytics: 'Charger les statistiques',
    mostOpenedDishes: 'Plats les plus ouverts',
    mostSearchedFor: 'Les plus recherchés',
    mostUsedShelves: 'Rayons les plus utilisés',
    screens: 'Écrans',
    oftenTheWholePoint: 'Souvent l’essentiel — facultatif',
    grewUpInMalabar: 'J’ai grandi au Malabar',
    whatTheseAreBody:
      'Des plats dont on affirme l’existence et dont l’atlas n’a aucune trace. Chacun demande {n} confirmations de personnes qui le connaissent avant d’entrer dans l’atlas, jugé sur les mêmes six dimensions que toute autre fiche.',
    proposalsNotOpenYet:
      'Les propositions ne sont pas encore ouvertes',
    proposalsNotOpenNote:
      'Il faut un endroit où stocker ce que les gens envoient. En attendant, l’application le dit plutôt que d’afficher une liste vide comme si personne n’avait rien à ajouter.',
    nothingIsWaiting:
      'Rien en attente',
    nothingIsWaitingNote:
      'Toutes les propositions ont été tranchées. Si vous connaissez un plat que l’atlas n’a pas, cela commence ici.',
    loading:
      'Chargement…',
    proposedBy:
      'Proposé par',
    beforeYouStartBody:
      'Ceci est pour une nourriture que l’atlas n’a pas, le plus souvent parce que personne ne l’a écrite. Une recette complète n’est pas nécessaire. Un nom, sa provenance et votre lien avec ce lieu suffisent à l’ouvrir à confirmation.',
    notPublishedBySending:
      'L’envoyer ne la publie pas. {n} personnes qui connaissent le plat la confirment d’abord, et elle entre dans l’atlas selon ce que ses preuves valent, comme toute autre fiche.',
    atlasMayAlreadyHaveThis:
      'L’atlas l’a peut-être déjà',
    duplicateNote:
      'Si l’un d’eux est votre plat, le confirmer est ce qui le fait avancer, et cela vaut mieux qu’une seconde fiche. Si aucun ne l’est, continuez ; deux plats peuvent porter le même nom.',
    connectionRequiredNote:
      'Obligatoire, et affiché. C’est toute la différence entre ceci et une recette recopiée sur internet, que l’atlas refuse déjà de conserver.',
    proposeClosedNote:
      'Il faut un endroit où stocker ce que les gens envoient, et il n’est pas en place. Rien de ce que vous écrivez ici n’irait nulle part, alors l’application le dit plutôt que de le prendre.',
    pantryNoMatches:
      'Rien d’enregistré n’utilise ces ingrédients ensemble. Essayez-en un à la fois, ou proposez le plat que vous aviez en tête si l’atlas ne l’a pas.',
    pantryPrompt:
      'Dites ce qu’il y a dans votre cuisine. Environ la moitié de l’atlas seulement a ses ingrédients enregistrés, donc un plat absent ici est peut-être simplement un plat que personne n’a encore écrit.',
    requestsNotOpenNote:
      'Les demandes ne sont pas encore ouvertes ; la seule façon qu’un plat entre dans l’atlas est que quelqu’un l’enregistre.',
    footerHolding:
      '{n} traditions de {c} pays. Libre à lire, sans publicité, et rien n’est pisté.',
    footerSources:
      'Construit à partir de Wikipédia, Wikidata, Wikimedia Commons, Wikibooks et des données ouvertes régionales italiennes, toutes libres à lire et sous licence ouverte. Les photographies sont créditées à leurs auteurs sur chaque fiche qui en porte une.',
    atlasCoverageLine:
      '{n} traditions documentées dans {c} pays. La couverture est annoncée honnêtement : un pays absent ici n’a encore rien d’enregistré, ce n’est pas qu’il n’y ait rien à enregistrer.',
    concentrationNote:
      '{p} % du catalogue vient de {country} à lui seul. Cela reflète quels pays ont été catalogués dans les sources ouvertes dont ceci part, et non où se trouve la nourriture du monde.',
    growTheAtlasBody:
      'Pour chaque plat, l’atlas prend d’abord la recette la plus publiée sur internet et la classe. Là où rien n’existe en ligne, une contribution de la communauté devient la fiche.',
    keepingItFreeBody:
      'Tout ici est construit à partir de sources qui ne coûtent rien et le restent. Une seule chose coûte de l’argent, et elle est désactivée tant qu’elle ne peut pas être payée.',
    meterDocumented:
      'A une méthode enregistrée',
    meterDocumentedNote:
      'Le chiffre qui dit si ceci est un atlas ou une liste de noms. Tout le reste lui est secondaire.',
    meterLocated:
      'Situé sous le niveau du pays',
    meterLocatedNote:
      'L’authenticité a une profondeur géographique. « Kozhikode » est une fiche ; « Inde » est à peine un début.',
    meterIllustrated:
      'A une photographie',
    meterIllustratedNote:
      'Un plat que personne ne peut se représenter est difficile à aimer, et plus difficile à reconnaître.',
    meterFilmed:
      'A une vidéo classée',
    meterFilmedNote:
      'Classée selon la proximité du cuisinier avec la tradition — pas selon un résultat de recherche.',
    meterAssessed:
      'Classé comme authentique',
    meterAssessedNote:
      'Obtenu par les vérifications de preuves. Une faible part ici est honnête, pas un échec.',
    supportLead:
      '{n} traditions, construites entièrement à partir de sources libres à lire et sous licence ouverte. Pas de publicité, pas de pistage, et rien derrière un paiement. Voici ce que cela coûte réellement, y compris les parties qui ne coûtent rien. Les chiffres sont en {currency}.',
    notForSaleAuthentic:
      'Une fiche ne peut pas devenir Authentique en payant. Cela vient des preuves et des gens qui cuisinent le plat.',
    notForSalePromotion:
      'Aucun plat n’est mis en avant, mieux classé ni mis en vedette parce que quelqu’un a payé.',
    notForSaleAdvertising:
      'Rien ici n’est de la publicité, et aucun lecteur n’est pisté.',
    donationFootnote:
      'S’ouvre sur Open Collective. Rien n’est encaissé ici — cette application ne détient aucune de vos coordonnées de paiement et n’en détiendra jamais.',
    donationsPendingBody:
      'Il n’y a nulle part où envoyer de l’argent. Ce sera un Open Collective quand ce sera le cas, afin que chaque contribution et chaque dépense soit publique et que chacun puisse vérifier cette page contre le registre.',
    mostUsefulThing:
      'La chose la plus utile que l’on puisse donner à cet atlas n’est pas de l’argent. L’essentiel se résume à un nom et un lieu, parce que personne n’a écrit comment le plat se prépare.',
    administration:
      'Administration',
    administrationNote:
      'Seuils, modération, vérification des sources et usage. Nécessite un jeton.',
    interfaceTranslationNote:
      'Cette interface a été traduite automatiquement et n’a pas été vérifiée par un locuteur. Les fiches elles-mêmes ne sont pas concernées. Les corrections sont bienvenues.',
  },

  de: {
    goBack: 'Zurück',
    search: 'Suchen',
    backToShelves: 'Zurück zu den Regalen',
    seeAll: 'Alle ansehen',
    worldwide: 'Weltweit',
    world: 'Welt',
    chooseCountry: 'Land auswählen',
    nothingRecordedHere: 'Hier ist noch nichts erfasst',
    resetFilters: 'Filter zurücksetzen',
    recordedNotAssessed: 'Erfasst, noch nicht bewertet',
    mostLookedUp: 'Am häufigsten nachgeschlagen',
    wikipediaReaders: 'Wikipedia-Leser',
    deepestLevelRecorded: 'Genaueste hier erfasste Ebene',
    searchPlaceholder: 'Gericht, Land, Region, Stadt oder Zutat',
    filters: 'Filter',
    nothingApplied: 'keine angewendet',
    results: 'Ergebnisse',
    matches: 'Treffer',
    noMatch: 'Kein Treffer',
    authenticityLevel: 'Authentizitätsstufe',
    cuisine: 'Küche',
    kindOfDish: 'Art des Gerichts',
    traditionalIngredient: 'Traditionelle Zutat',
    sortResultsBy: 'Ergebnisse sortieren nach',
    authenticityConfidence: 'Verlässlichkeit der Authentizität',
    atRiskFirst: 'Gefährdete zuerst',
    notClassified: 'Nicht eingestuft',
    askForItInstead: 'Stattdessen anfragen',
    surpriseMe: 'Überrasche mich mit einer gefährdeten Tradition',
    browseTheAtlas: 'Den Weltatlas durchstöbern',
    clearAll: 'Alles zurücksetzen',
    none: 'Keine',
    iKnowHowItsMade: 'Ich weiß, wie es zubereitet wird — aufnehmen',
    loadingAtlas: 'Atlas wird gelesen…',
    couldNotLoad: 'Der Atlas konnte nicht geladen werden.',
    shelfDisappearing: 'Im Verschwinden',
    shelfDisappearingNote: 'Traditionen, die eine Quelle als rückläufig beschreibt — die undokumentierten zuerst, denn sie gehen verloren.',
    shelfAuthenticated: 'Bestätigt',
    shelfAuthenticatedNote: 'Die Einträge mit echten Belegen dafür, wie und wo sie zubereitet werden.',
    shelfCookable: 'Das könnten Sie heute Abend kochen',
    shelfCookableNote: 'Einträge mit schriftlicher Zubereitung — traditionell, wo wir sie haben, veröffentlicht, wo nicht.',
    shelfIllustrated: 'Sehenswert',
    shelfIllustratedNote: 'Fotografierte Traditionen, zum Stöbern statt zum Suchen.',
    foodAtlas: 'Kulinarischer Atlas',
    howComplete: 'Wie vollständig ist dieser Atlas?',
    traditionsRecorded: 'Traditionen erfasst',
    countries: 'Länder',
    atRiskTraditions: 'gefährdete Traditionen',
    whereTheRecordsAre: 'Wo die Einträge liegen',
    confidence: 'Verlässlichkeit',
    growTheAtlas: 'Den Atlas erweitern',
    addATradition: 'Fügen Sie eine Tradition aus Ihrer Gegend hinzu',
    keepingItFree: 'Kostenfrei halten',
    whatItCostsToRun: 'Was der Betrieb kostet',
    anywhere: 'Überall',
    noRecord: 'Kein Eintrag',
    backToTheFeed: 'Zurück zur Übersicht',
    bookmarkThis: 'Diese Tradition merken',
    photoOriginUnverified: 'Herkunft des Fotos ungeprüft',
    whyFlaggedAtRisk: 'Warum dies als gefährdet gilt',
    openDisagreement: 'Offener Widerspruch',
    ingredientsNamedInAccount: 'In dieser Darstellung genannte Zutaten',
    methodStillOpen: 'Die Zubereitung ist noch offen',
    notDocumentedYet: 'Noch nicht dokumentiert',
    recordHowItsMade: 'Halten Sie fest, wie es zubereitet wird',
    traditionalEquipment: 'Traditionelles Gerät',
    mostPopularVersion: 'Beliebteste Version im Netz',
    watchItBeingMade: 'Bei der Zubereitung zusehen',
    findPreparationVideos: 'Zubereitungsvideos finden ↗',
    whereTheMethodComesFrom: 'Woher die Zubereitung stammt',
    alsoMadeThisWay: 'Wird auch so zubereitet',
    howItWorks: 'Wie es funktioniert',
    proposeADish: 'Gericht vorschlagen',
    confirm: 'Bestätigen',
    confirmAProposal: 'Vorschlag bestätigen',
    everyRecord: 'Alle Einträge',
    addATraditionShort: 'Tradition hinzufügen',
    navExplore: 'Entdecken',
    navContribute: 'Mitmachen',
    navAbout: 'Über',
    theGapThatCannotBeClosed: 'Der Abstand, den Lesen nicht schließt',
    aDocumentCannotMakeAuthentic: 'Ein Dokument kann ein Gericht nicht echt machen.',
    sixThingsScoredSeparately: 'Sechs Dinge, einzeln bewertet',
    whatClosesIt: 'Was ihn schließt',
    whatThisIsNot: 'Was dies nicht ist',
    whichIsWhereYouComeIn: 'Und hier kommen Sie ins Spiel',
    confirmADishYouKnow: 'Bestätigen Sie ein Gericht, das Sie kennen',
    proposeOneMissing: 'Schlagen Sie eines vor, das dem Atlas fehlt',
    whatItDoesNotBuy: 'Was es nicht kauft',
    contributeOnOpenCollective: 'Auf Open Collective beitragen',
    readTheLedger: 'Das Kassenbuch lesen — jeder Beitrag und jede Ausgabe',
    notOpenForDonationsYet: 'Noch nicht für Spenden geöffnet',
    browse: 'Stöbern',
    startAgain: 'Neu beginnen',
    openProposals: 'Offene Vorschläge',
    whatTheseAre: 'Was das hier ist',
    proposed: 'Vorgeschlagen',
    seeOpenProposals: 'Offene Vorschläge ansehen',
    beforeYouStart: 'Bevor Sie beginnen',
    theDish: 'Das Gericht',
    writtenTheWayYouWriteIt: 'So geschrieben, wie Sie es schreiben',
    country: 'Land',
    regionDistrictOrTown: 'Region, Bezirk oder Ort',
    whoMakesItAndWhen: 'Wer es macht, und wann',
    ingredientsOnePerLine: 'Zutaten — eine pro Zeile',
    howItIsMadeOnePerLine: 'Zubereitung — ein Schritt pro Zeile',
    yourName: 'Ihr Name',
    shownOnTheProposal: 'Wird am Vorschlag angezeigt',
    yourConnectionToThePlace: 'Ihre Verbindung zu dem Ort',
    proposeThisDish: 'Dieses Gericht vorschlagen',
    dishInItsOwnLanguage: 'Gericht, möglichst in seiner eigenen Sprache',
    whereIsItMadeThisWay: 'Wo wird es so zubereitet?',
    whoPreparesIt: 'Wer es zubereitet',
    traditionalIngredientsAndEquipment: 'Traditionelle Zutaten und Geräte',
    publishAPhotographOnCommons: 'Ein Foto auf Commons veröffentlichen',
    commonsFileNameOrLink: 'Commons-Dateiname oder Link',
    checkWhatExistsOnline: 'Nachsehen, was online schon existiert',
    whatTheInternetAlreadyHas: 'Was das Internet schon hat',
    runTheEvidenceAssessment: 'Belegprüfung ausführen',
    evidenceAssessment: 'Belegprüfung',
    sendForCommunityValidation: 'Zur Bestätigung durch die Gemeinschaft senden',
    communityValidation: 'Bestätigung durch die Gemeinschaft',
    ifTheyDisagree: 'Wenn sie widersprechen',
    nowSendYours: 'Nun senden Sie Ihre',
    sendThisTradition: 'Diese Tradition senden',
    submissionsNotOpenYet: 'Einsendungen sind noch nicht offen',
    backToTheAtlas: 'Zurück zum Atlas',
    settingsTitle: 'Einstellungen',
    whatThisChanges: 'Was das ändert',
    administratorToken: 'Administrator-Token',
    tokenNotStored: 'Nicht gespeichert — jede Sitzung neu eingeben',
    queueThisCheck: 'Diese Prüfung einreihen',
    loadAnalytics: 'Statistiken laden',
    mostOpenedDishes: 'Am häufigsten geöffnete Gerichte',
    mostSearchedFor: 'Am häufigsten gesucht',
    mostUsedShelves: 'Meistgenutzte Regale',
    screens: 'Bildschirme',
    oftenTheWholePoint: 'Oft das Entscheidende — optional',
    grewUpInMalabar: 'In Malabar aufgewachsen',
    whatTheseAreBody:
      'Gerichte, deren Existenz behauptet wird und von denen der Atlas nichts weiß. Jedes braucht {n} Bestätigungen von Menschen, die es kennen, bevor es in den Atlas kommt — bewertet nach denselben sechs Dimensionen wie jeder andere Eintrag.',
    proposalsNotOpenYet:
      'Vorschläge sind noch nicht offen',
    proposalsNotOpenNote:
      'Dafür braucht es einen Ort, an dem gespeichert wird, was Menschen senden. Bis es ihn gibt, sagt die App das, statt eine leere Liste zu zeigen, als hätte niemand etwas beizutragen.',
    nothingIsWaiting:
      'Nichts wartet',
    nothingIsWaitingNote:
      'Über jeden Vorschlag ist entschieden. Wenn Sie ein Gericht kennen, das der Atlas nicht hat, beginnt es hier.',
    loading:
      'Wird geladen…',
    proposedBy:
      'Vorgeschlagen von',
    beforeYouStartBody:
      'Dies ist für Essen, das der Atlas nicht hat — meist, weil es niemand aufgeschrieben hat. Ein vollständiges Rezept ist nicht nötig. Ein Name, woher es kommt, und Ihre Verbindung zu dem Ort genügen, um es zur Bestätigung zu öffnen.',
    notPublishedBySending:
      'Absenden veröffentlicht es nicht. Zuerst bestätigen {n} Menschen, die das Gericht kennen, und es kommt mit dem in den Atlas, was seine Belege wert sind — wie jeder andere Eintrag hier.',
    atlasMayAlreadyHaveThis:
      'Der Atlas hat das vielleicht schon',
    duplicateNote:
      'Wenn eines davon Ihr Gericht ist, bringt es eine Bestätigung weiter, und das ist mehr wert als ein zweiter Eintrag. Wenn keines es ist, machen Sie weiter; zwei Gerichte dürfen einen Namen teilen.',
    connectionRequiredNote:
      'Erforderlich, und wird angezeigt. Das ist der ganze Unterschied zwischen dem hier und einem aus dem Internet abgeschriebenen Rezept, das der Atlas ohnehin ablehnt.',
    proposeClosedNote:
      'Dafür braucht es einen Speicherort für das, was Menschen senden, und der ist nicht eingerichtet. Nichts, was Sie hier schreiben, käme irgendwo an — also sagt die App es, statt es anzunehmen.',
    pantryNoMatches:
      'Nichts Erfasstes verwendet diese zusammen. Versuchen Sie es einzeln — oder schlagen Sie das Gericht vor, an das Sie gedacht haben, falls der Atlas es nicht hat.',
    pantryPrompt:
      'Nennen Sie, was in Ihrer Küche ist. Nur etwa die Hälfte des Atlas hat ihre Zutaten erfasst, ein hier fehlendes Gericht ist also vielleicht nur eines, das niemand aufgeschrieben hat.',
    requestsNotOpenNote:
      'Anfragen sind noch nicht offen; ein Gericht kommt also nur in den Atlas, wenn jemand es festhält.',
    footerHolding:
      '{n} Traditionen aus {c} Ländern. Frei zu lesen, ohne Werbung, und nichts wird verfolgt.',
    footerSources:
      'Aufgebaut aus Wikipedia, Wikidata, Wikimedia Commons, Wikibooks und Italiens regionalen offenen Daten — alle frei zu lesen und offen lizenziert. Fotografien werden ihren Urhebern auf jedem Eintrag zugeschrieben, der eine trägt.',
    atlasCoverageLine:
      '{n} Traditionen aus {c} Ländern erfasst. Die Abdeckung wird ehrlich benannt: Ein hier fehlendes Land hat noch nichts Erfasstes, nicht nichts zu erfassen.',
    concentrationNote:
      '{p} % des Katalogs stammen allein aus {country}. Das zeigt, welche Länder in den offenen Quellen erfasst wurden, aus denen dies aufgebaut ist — nicht, wo das Essen der Welt ist.',
    growTheAtlasBody:
      'Für jedes Gericht holt der Atlas zuerst das im Internet meistveröffentlichte Rezept und ordnet es ein. Wo online nichts existiert, wird ein Beitrag aus der Gemeinschaft zum Eintrag.',
    keepingItFreeBody:
      'Alles hier ist aus Quellen gebaut, die nichts kosten und das bleiben. Eine einzige Sache kostet Geld, und sie ist abgeschaltet, bis sie bezahlt werden kann.',
    meterDocumented:
      'Hat eine erfasste Zubereitung',
    meterDocumentedNote:
      'Die Zahl, die sagt, ob dies ein Atlas ist oder eine Namensliste. Alles andere ist ihr nachgeordnet.',
    meterLocated:
      'Unterhalb der Landesebene verortet',
    meterLocatedNote:
      'Echtheit hat geografische Tiefe. „Kozhikode“ ist ein Eintrag; „Indien“ ist kaum ein Anfang.',
    meterIllustrated:
      'Hat ein Foto',
    meterIllustratedNote:
      'Ein Gericht, das sich niemand vorstellen kann, ist schwer zu mögen und schwerer zu erkennen.',
    meterFilmed:
      'Hat ein eingeordnetes Video',
    meterFilmedNote:
      'Geordnet nach der Nähe des Kochs zur Tradition — nicht nach einem Suchergebnis.',
    meterAssessed:
      'Als echt eingestuft',
    meterAssessedNote:
      'Durch die Belegprüfungen erreicht. Ein niedriger Anteil ist hier ehrlich, kein Versagen.',
    supportLead:
      '{n} Traditionen, vollständig aus Quellen gebaut, die frei zu lesen und offen lizenziert sind. Keine Werbung, kein Verfolgen, und nichts hinter einer Bezahlung. Hier steht, was das tatsächlich kostet, einschließlich der Teile, die nichts kosten. Beträge in {currency}.',
    notForSaleAuthentic:
      'Ein Eintrag kann nicht durch Bezahlen echt werden. Das kommt aus Belegen und von Menschen, die das Gericht kochen.',
    notForSalePromotion:
      'Kein Gericht wird beworben, höher gereiht oder hervorgehoben, weil jemand bezahlt hat.',
    notForSaleAdvertising:
      'Nichts hier ist Werbung, und kein Lesender wird verfolgt.',
    donationFootnote:
      'Öffnet bei Open Collective. Hier wird nichts eingezogen — diese App hält keine Ihrer Zahlungsdaten und wird das nie tun.',
    donationsPendingBody:
      'Es gibt keinen Ort, an den Geld gehen könnte. Sobald es ihn gibt, wird es ein Open Collective sein, damit jeder Beitrag und jede Ausgabe öffentlich ist und jeder diese Seite gegen das Kassenbuch prüfen kann.',
    mostUsefulThing:
      'Das Nützlichste, das jemand diesem Atlas geben kann, ist kein Geld. Das meiste davon ist ein Name und ein Ort, weil niemand aufgeschrieben hat, wie das Essen gemacht wird.',
    administration:
      'Verwaltung',
    administrationNote:
      'Schwellenwerte, Moderation, Quellenprüfungen und Nutzung. Erfordert ein Token.',
    interfaceTranslationNote:
      'Diese Oberfläche wurde maschinell übersetzt und von keiner Sprecherin und keinem Sprecher geprüft. Die Einträge selbst sind davon nicht betroffen. Korrekturen sind willkommen.',
  },

  it: {
    goBack: 'Indietro',
    search: 'Cerca',
    backToShelves: 'Torna agli scaffali',
    seeAll: 'Vedi tutto',
    worldwide: 'Tutto il mondo',
    world: 'Mondo',
    chooseCountry: 'Scegli un paese',
    nothingRecordedHere: 'Qui non è ancora registrato nulla',
    resetFilters: 'Azzera i filtri',
    recordedNotAssessed: 'Registrato, non ancora valutato',
    mostLookedUp: 'I più consultati',
    wikipediaReaders: 'Lettori di Wikipedia',
    deepestLevelRecorded: 'Livello più dettagliato registrato qui',
    searchPlaceholder: 'Piatto, paese, regione, città o ingrediente',
    filters: 'Filtri',
    nothingApplied: 'nessuno applicato',
    results: 'Risultati',
    matches: 'risultati',
    noMatch: 'Nessun risultato',
    authenticityLevel: 'Livello di autenticità',
    cuisine: 'Cucina',
    kindOfDish: 'Tipo di piatto',
    traditionalIngredient: 'Ingrediente tradizionale',
    sortResultsBy: 'Ordina i risultati per',
    authenticityConfidence: 'Affidabilità dell’autenticità',
    atRiskFirst: 'Prima quelli a rischio',
    notClassified: 'Non classificato',
    askForItInstead: 'Richiedilo invece',
    surpriseMe: 'Sorprendimi con una tradizione a rischio',
    browseTheAtlas: 'Sfoglia l’atlante del mondo',
    clearAll: 'Cancella tutto',
    none: 'Nessuno',
    iKnowHowItsMade: 'So come si prepara — registralo',
    loadingAtlas: 'Lettura dell\'atlante…',
    couldNotLoad: 'Non è stato possibile caricare l\'atlante.',
    shelfDisappearing: 'In via di scomparsa',
    shelfDisappearingNote: 'Tradizioni che una fonte descrive in declino — prima quelle non documentate, perché sono quelle che si perdono.',
    shelfAuthenticated: 'Autenticate',
    shelfAuthenticatedNote: 'Le schede che portano prove reali di come vengono preparate, e dove.',
    shelfCookable: 'Potresti cucinarlo stasera',
    shelfCookableNote: 'Schede con un metodo scritto — tradizionale dove lo abbiamo, pubblicato dove no.',
    shelfIllustrated: 'Da guardare',
    shelfIllustratedNote: 'Tradizioni fotografate, da sfogliare più che da cercare.',
    foodAtlas: 'Atlante gastronomico',
    howComplete: 'Quanto è completo questo atlante?',
    traditionsRecorded: 'tradizioni registrate',
    countries: 'paesi',
    atRiskTraditions: 'tradizioni a rischio',
    whereTheRecordsAre: 'Dove sono le schede',
    confidence: 'Affidabilità',
    growTheAtlas: 'Fai crescere l\'atlante',
    addATradition: 'Aggiungi una tradizione della tua zona',
    keepingItFree: 'Mantenerlo gratuito',
    whatItCostsToRun: 'Quanto costa mantenerlo',
    anywhere: 'Ovunque',
    noRecord: 'Nessuna scheda',
    backToTheFeed: 'Torna alla home',
    bookmarkThis: 'Salva questa tradizione',
    photoOriginUnverified: 'Origine della foto non verificata',
    whyFlaggedAtRisk: 'Perché è segnalata a rischio',
    openDisagreement: 'Disaccordo aperto',
    ingredientsNamedInAccount: 'Ingredienti citati in quel racconto',
    methodStillOpen: 'Il metodo è ancora aperto',
    notDocumentedYet: 'Non ancora documentato',
    recordHowItsMade: 'Registra come si prepara',
    traditionalEquipment: 'Attrezzi tradizionali',
    mostPopularVersion: 'Versione più diffusa online',
    watchItBeingMade: 'Guarda come si prepara',
    findPreparationVideos: 'Trova video di preparazione ↗',
    whereTheMethodComesFrom: 'Da dove viene il metodo',
    alsoMadeThisWay: 'Si prepara anche così',
    howItWorks: 'Come funziona',
    proposeADish: 'Proponi un piatto',
    confirm: 'Conferma',
    confirmAProposal: 'Conferma una proposta',
    everyRecord: 'Tutte le schede',
    addATraditionShort: 'Aggiungi una tradizione',
    navExplore: 'Esplora',
    navContribute: 'Contribuisci',
    navAbout: 'Informazioni',
    theGapThatCannotBeClosed: 'La distanza che leggere non colma',
    aDocumentCannotMakeAuthentic: 'Un documento non può rendere autentico un piatto.',
    sixThingsScoredSeparately: 'Sei elementi, valutati separatamente',
    whatClosesIt: 'Che cosa la colma',
    whatThisIsNot: 'Che cosa non è',
    whichIsWhereYouComeIn: 'Ed è qui che entri tu',
    confirmADishYouKnow: 'Conferma un piatto che conosci',
    proposeOneMissing: 'Proponine uno che manca all’atlante',
    whatItDoesNotBuy: 'Che cosa non compra',
    contributeOnOpenCollective: 'Contribuisci su Open Collective',
    readTheLedger: 'Leggi il registro — ogni contributo e ogni spesa',
    notOpenForDonationsYet: 'Non ancora aperto alle donazioni',
    browse: 'Sfoglia',
    startAgain: 'Ricomincia',
    openProposals: 'Proposte aperte',
    whatTheseAre: 'Che cosa sono',
    proposed: 'Proposto',
    seeOpenProposals: 'Vedi le proposte aperte',
    beforeYouStart: 'Prima di cominciare',
    theDish: 'Il piatto',
    writtenTheWayYouWriteIt: 'Scritto come lo scrivi tu',
    country: 'Paese',
    regionDistrictOrTown: 'Regione, distretto o paese',
    whoMakesItAndWhen: 'Chi lo fa, e quando',
    ingredientsOnePerLine: 'Ingredienti — uno per riga',
    howItIsMadeOnePerLine: 'Come si prepara — un passaggio per riga',
    yourName: 'Il tuo nome',
    shownOnTheProposal: 'Mostrato sulla proposta',
    yourConnectionToThePlace: 'Il tuo legame con il luogo',
    proposeThisDish: 'Proponi questo piatto',
    dishInItsOwnLanguage: 'Piatto, nella sua lingua se possibile',
    whereIsItMadeThisWay: 'Dove si prepara così?',
    whoPreparesIt: 'Chi lo prepara',
    traditionalIngredientsAndEquipment: 'Ingredienti e attrezzi tradizionali',
    publishAPhotographOnCommons: 'Pubblica una foto su Commons',
    commonsFileNameOrLink: 'Nome file o link di Commons',
    checkWhatExistsOnline: 'Guarda che cosa esiste già online',
    whatTheInternetAlreadyHas: 'Che cosa ha già internet',
    runTheEvidenceAssessment: 'Esegui la valutazione delle prove',
    evidenceAssessment: 'Valutazione delle prove',
    sendForCommunityValidation: 'Invia alla convalida della comunità',
    communityValidation: 'Convalida della comunità',
    ifTheyDisagree: 'Se non sono d’accordo',
    nowSendYours: 'Ora invia la tua',
    sendThisTradition: 'Invia questa tradizione',
    submissionsNotOpenYet: 'Gli invii non sono ancora aperti',
    backToTheAtlas: 'Torna all’atlante',
    settingsTitle: 'Impostazioni',
    whatThisChanges: 'Che cosa cambia',
    administratorToken: 'Token amministratore',
    tokenNotStored: 'Non salvato — da riscrivere ogni sessione',
    queueThisCheck: 'Metti in coda questo controllo',
    loadAnalytics: 'Carica le statistiche',
    mostOpenedDishes: 'Piatti più aperti',
    mostSearchedFor: 'I più cercati',
    mostUsedShelves: 'Scaffali più usati',
    screens: 'Schermate',
    oftenTheWholePoint: 'Spesso è il punto — facoltativo',
    grewUpInMalabar: 'Cresciuto in Malabar',
    whatTheseAreBody:
      'Piatti che qualcuno dice esistano e di cui l’atlante non ha traccia. Ciascuno richiede {n} conferme da persone che lo conoscono prima di entrare nell’atlante, valutato sulle stesse sei dimensioni di ogni altra scheda.',
    proposalsNotOpenYet:
      'Le proposte non sono ancora aperte',
    proposalsNotOpenNote:
      'Serve un posto dove conservare ciò che le persone inviano. Finché non c’è, l’app lo dice invece di mostrare una lista vuota come se nessuno avesse nulla da aggiungere.',
    nothingIsWaiting:
      'Non c’è nulla in attesa',
    nothingIsWaitingNote:
      'Ogni proposta è stata decisa. Se conosci un piatto che l’atlante non ha, si comincia da qui.',
    loading:
      'Caricamento…',
    proposedBy:
      'Proposto da',
    beforeYouStartBody:
      'Questo è per cibo che l’atlante non ha, di solito perché nessuno l’ha scritto. Non serve una ricetta completa. Un nome, da dove viene e il tuo legame con il luogo bastano per aprirlo alla conferma.',
    notPublishedBySending:
      'Inviarlo non lo pubblica. Prima {n} persone che conoscono il piatto lo confermano, e entra nell’atlante per quanto valgono le sue prove, come ogni altra scheda.',
    atlasMayAlreadyHaveThis:
      'L’atlante potrebbe già averlo',
    duplicateNote:
      'Se uno di questi è il tuo piatto, confermarlo è ciò che lo fa avanzare, e vale più di una seconda scheda. Se nessuno lo è, prosegui; due piatti possono avere lo stesso nome.',
    connectionRequiredNote:
      'Obbligatorio, e mostrato. È tutta la differenza fra questo e una ricetta copiata da internet, che l’atlante già rifiuta di tenere.',
    proposeClosedNote:
      'Serve un posto dove conservare ciò che le persone inviano, e non è predisposto. Nulla di ciò che scrivi qui arriverebbe da qualche parte, quindi l’app lo dice invece di accettarlo.',
    pantryNoMatches:
      'Nulla di registrato li usa insieme. Prova uno alla volta, oppure proponi il piatto che avevi in mente se l’atlante non ce l’ha.',
    pantryPrompt:
      'Di’ che cosa hai in cucina. Solo circa metà dell’atlante ha gli ingredienti registrati, quindi un piatto che manca qui può essere semplicemente uno che nessuno ha ancora scritto.',
    requestsNotOpenNote:
      'Le richieste non sono ancora aperte, quindi l’unico modo perché un piatto entri nell’atlante è che qualcuno lo registri.',
    footerHolding:
      '{n} tradizioni da {c} paesi. Libero da leggere, senza pubblicità, e nulla viene tracciato.',
    footerSources:
      'Costruito da Wikipedia, Wikidata, Wikimedia Commons, Wikibooks e i dati aperti regionali italiani, tutti liberi da leggere e con licenza aperta. Le fotografie sono attribuite ai loro autori su ogni scheda che ne porta una.',
    atlasCoverageLine:
      '{n} tradizioni documentate in {c} paesi. La copertura è dichiarata con onestà: un paese assente qui non ha ancora nulla di registrato, non che non ci sia nulla da registrare.',
    concentrationNote:
      'Il {p}% del catalogo viene dalla sola {country}. Questo riflette quali paesi sono stati catalogati nelle fonti aperte da cui parte, non dove si trova il cibo del mondo.',
    growTheAtlasBody:
      'Per ogni piatto l’atlante prende prima la ricetta più pubblicata su internet e la classifica. Dove online non esiste nulla, un contributo della comunità diventa la scheda.',
    keepingItFreeBody:
      'Tutto qui è costruito con fonti che non costano nulla e restano così. Una sola cosa costa denaro, ed è spenta finché non potrà essere pagata.',
    meterDocumented:
      'Ha un metodo registrato',
    meterDocumentedNote:
      'La cifra che dice se questo è un atlante o un elenco di nomi. Tutto il resto viene dopo.',
    meterLocated:
      'Collocato sotto il livello del paese',
    meterLocatedNote:
      'L’autenticità ha profondità geografica. “Kozhikode” è una scheda; “India” è appena un inizio.',
    meterIllustrated:
      'Ha una fotografia',
    meterIllustratedNote:
      'Un piatto che nessuno riesce a immaginare è difficile da amare, e più difficile da riconoscere.',
    meterFilmed:
      'Ha un video ordinato',
    meterFilmedNote:
      'Ordinato per vicinanza del cuoco alla tradizione, non per risultato di ricerca.',
    meterAssessed:
      'Classificato come autentico',
    meterAssessedNote:
      'Ottenuto con le verifiche delle prove. Una quota bassa qui è onesta, non un fallimento.',
    supportLead:
      '{n} tradizioni, costruite interamente da fonti libere da leggere e con licenza aperta. Nessuna pubblicità, nessun tracciamento e nulla dietro un pagamento. Ecco quanto costa davvero, comprese le parti che non costano nulla. Le cifre sono in {currency}.',
    notForSaleAuthentic:
      'Una scheda non può diventare Autentica pagando. Questo viene dalle prove e dalle persone che cucinano il piatto.',
    notForSalePromotion:
      'Nessun piatto viene promosso, messo più in alto o messo in evidenza perché qualcuno ha pagato.',
    notForSaleAdvertising:
      'Qui non c’è pubblicità, e nessun lettore viene tracciato.',
    donationFootnote:
      'Si apre su Open Collective. Qui non si incassa nulla: questa app non conserva alcun tuo dato di pagamento e non lo farà mai.',
    donationsPendingBody:
      'Non c’è dove mandare denaro. Quando ci sarà, sarà un Open Collective, così che ogni contributo e ogni spesa siano pubblici e chiunque possa confrontare questa pagina con il registro.',
    mostUsefulThing:
      'La cosa più utile che si possa dare a questo atlante non è il denaro. Gran parte di esso è un nome e un luogo perché nessuno ha scritto come si prepara il cibo.',
    administration:
      'Amministrazione',
    administrationNote:
      'Soglie, moderazione, controllo delle fonti e utilizzo. Richiede un token.',
    interfaceTranslationNote:
      'Questa interfaccia è stata tradotta automaticamente e non è stata verificata da un parlante. Le schede non sono interessate. Le correzioni sono benvenute.',
  },

  pt: {
    goBack: 'Voltar',
    search: 'Pesquisar',
    backToShelves: 'Voltar às prateleiras',
    seeAll: 'Ver tudo',
    worldwide: 'Mundo inteiro',
    world: 'Mundo',
    chooseCountry: 'Escolher um país',
    nothingRecordedHere: 'Ainda não há nada registado aqui',
    resetFilters: 'Repor os filtros',
    recordedNotAssessed: 'Registado, ainda não avaliado',
    mostLookedUp: 'Mais consultados',
    wikipediaReaders: 'Leitores da Wikipédia',
    deepestLevelRecorded: 'Nível mais detalhado registado aqui',
    searchPlaceholder: 'Prato, país, região, cidade ou ingrediente',
    filters: 'Filtros',
    nothingApplied: 'nenhum aplicado',
    results: 'Resultados',
    matches: 'resultados',
    noMatch: 'Sem resultados',
    authenticityLevel: 'Nível de autenticidade',
    cuisine: 'Cozinha',
    kindOfDish: 'Tipo de prato',
    traditionalIngredient: 'Ingrediente tradicional',
    sortResultsBy: 'Ordenar resultados por',
    authenticityConfidence: 'Confiança na autenticidade',
    atRiskFirst: 'Em risco primeiro',
    notClassified: 'Não classificado',
    askForItInstead: 'Pedir em vez disso',
    surpriseMe: 'Surpreenda-me com uma tradição em risco',
    browseTheAtlas: 'Explorar o atlas do mundo',
    clearAll: 'Limpar tudo',
    none: 'Nenhum',
    video: '▶ Vídeo',
    iKnowHowItsMade: 'Sei como se prepara — registe',
    loadingAtlas: 'A ler o atlas…',
    couldNotLoad: 'Não foi possível carregar o atlas.',
    shelfDisappearing: 'A desaparecer',
    shelfDisappearingNote: 'Tradições que uma fonte descreve em declínio — primeiro as não documentadas, porque são essas que se perdem.',
    shelfAuthenticated: 'Autenticadas',
    shelfAuthenticatedNote: 'Os registos que trazem provas reais de como são preparados, e onde.',
    shelfCookable: 'Podia cozinhar isto hoje à noite',
    shelfCookableNote: 'Registos com método escrito — tradicional quando o temos, publicado quando não.',
    shelfIllustrated: 'Vale a pena ver',
    shelfIllustratedNote: 'Tradições fotografadas, para folhear mais do que para procurar.',
    foodAtlas: 'Atlas gastronómico',
    howComplete: 'Quão completo está este atlas?',
    traditionsRecorded: 'tradições registadas',
    countries: 'países',
    atRiskTraditions: 'tradições em risco',
    whereTheRecordsAre: 'Onde estão os registos',
    confidence: 'Confiança',
    growTheAtlas: 'Faça crescer o atlas',
    addATradition: 'Acrescente uma tradição da sua zona',
    keepingItFree: 'Mantê-lo gratuito',
    whatItCostsToRun: 'O que custa mantê-lo',
    anywhere: 'Em qualquer lugar',
    noRecord: 'Sem registo',
    backToTheFeed: 'Voltar ao início',
    bookmarkThis: 'Guardar esta tradição',
    photoOriginUnverified: 'Origem da foto não verificada',
    whyFlaggedAtRisk: 'Porque está assinalada em risco',
    openDisagreement: 'Desacordo em aberto',
    ingredientsNamedInAccount: 'Ingredientes citados nesse relato',
    methodStillOpen: 'O método continua em aberto',
    notDocumentedYet: 'Ainda não documentado',
    recordHowItsMade: 'Registe como se prepara',
    traditionalEquipment: 'Utensílios tradicionais',
    mostPopularVersion: 'Versão mais popular online',
    watchItBeingMade: 'Veja a ser preparado',
    findPreparationVideos: 'Encontrar vídeos de preparação ↗',
    whereTheMethodComesFrom: 'De onde vem o método',
    alsoMadeThisWay: 'Também se prepara assim',
    howItWorks: 'Como funciona',
    proposeADish: 'Propor um prato',
    confirm: 'Confirmar',
    confirmAProposal: 'Confirmar uma proposta',
    everyRecord: 'Todos os registos',
    addATraditionShort: 'Acrescentar uma tradição',
    navExplore: 'Explorar',
    navContribute: 'Contribuir',
    navAbout: 'Sobre',
    theGapThatCannotBeClosed: 'A distância que a leitura não fecha',
    aDocumentCannotMakeAuthentic: 'Um documento não pode tornar um prato autêntico.',
    sixThingsScoredSeparately: 'Seis coisas, pontuadas em separado',
    whatClosesIt: 'O que a fecha',
    whatThisIsNot: 'O que isto não é',
    whichIsWhereYouComeIn: 'E é aqui que entra você',
    confirmADishYouKnow: 'Confirme um prato que conheça',
    proposeOneMissing: 'Proponha um que falte ao atlas',
    whatItDoesNotBuy: 'O que não compra',
    contributeOnOpenCollective: 'Contribuir no Open Collective',
    readTheLedger: 'Ler o livro de contas — cada contributo e cada despesa',
    notOpenForDonationsYet: 'Ainda não aberto a donativos',
    browse: 'Explorar',
    startAgain: 'Começar de novo',
    openProposals: 'Propostas abertas',
    whatTheseAre: 'O que são estas',
    proposed: 'Proposto',
    seeOpenProposals: 'Ver propostas abertas',
    beforeYouStart: 'Antes de começar',
    theDish: 'O prato',
    writtenTheWayYouWriteIt: 'Escrito como você escreve',
    country: 'País',
    regionDistrictOrTown: 'Região, distrito ou vila',
    whoMakesItAndWhen: 'Quem o faz, e quando',
    ingredientsOnePerLine: 'Ingredientes — um por linha',
    howItIsMadeOnePerLine: 'Como se faz — um passo por linha',
    yourName: 'O seu nome',
    shownOnTheProposal: 'Mostrado na proposta',
    yourConnectionToThePlace: 'A sua ligação ao lugar',
    proposeThisDish: 'Propor este prato',
    dishInItsOwnLanguage: 'Prato, na sua própria língua se possível',
    whereIsItMadeThisWay: 'Onde se faz assim?',
    whoPreparesIt: 'Quem o prepara',
    traditionalIngredientsAndEquipment: 'Ingredientes e utensílios tradicionais',
    publishAPhotographOnCommons: 'Publicar uma foto no Commons',
    commonsFileNameOrLink: 'Nome de ficheiro ou link do Commons',
    checkWhatExistsOnline: 'Ver o que já existe online',
    whatTheInternetAlreadyHas: 'O que a internet já tem',
    runTheEvidenceAssessment: 'Executar a avaliação de provas',
    evidenceAssessment: 'Avaliação de provas',
    sendForCommunityValidation: 'Enviar para validação da comunidade',
    communityValidation: 'Validação da comunidade',
    ifTheyDisagree: 'Se discordarem',
    nowSendYours: 'Agora envie a sua',
    sendThisTradition: 'Enviar esta tradição',
    submissionsNotOpenYet: 'Os envios ainda não estão abertos',
    backToTheAtlas: 'Voltar ao atlas',
    settingsTitle: 'Definições',
    whatThisChanges: 'O que isto muda',
    administratorToken: 'Token de administrador',
    tokenNotStored: 'Não guardado — escrito a cada sessão',
    queueThisCheck: 'Pôr esta verificação em fila',
    loadAnalytics: 'Carregar estatísticas',
    mostOpenedDishes: 'Pratos mais abertos',
    mostSearchedFor: 'Mais procurados',
    mostUsedShelves: 'Prateleiras mais usadas',
    screens: 'Ecrãs',
    oftenTheWholePoint: 'Muitas vezes é o essencial — opcional',
    grewUpInMalabar: 'Cresci em Malabar',
    whatTheseAreBody:
      'Pratos que alguém diz existirem e de que o atlas não tem registo. Cada um precisa de {n} confirmações de pessoas que o conhecem antes de entrar no atlas, avaliado pelas mesmas seis dimensões que qualquer outro registo.',
    proposalsNotOpenYet:
      'As propostas ainda não estão abertas',
    proposalsNotOpenNote:
      'Isto precisa de um sítio onde guardar o que as pessoas enviam. Até existir, a aplicação di-lo em vez de mostrar uma lista vazia como se ninguém tivesse nada a acrescentar.',
    nothingIsWaiting:
      'Nada está à espera',
    nothingIsWaitingNote:
      'Todas as propostas foram decididas. Se conhece um prato que o atlas não tem, começa aqui.',
    loading:
      'A carregar…',
    proposedBy:
      'Proposto por',
    beforeYouStartBody:
      'Isto é para comida que o atlas não tem, normalmente porque ninguém a escreveu. Não é preciso uma receita completa. Um nome, de onde é, e a sua ligação ao lugar bastam para a abrir a confirmação.',
    notPublishedBySending:
      'Enviá-la não a publica. Primeiro {n} pessoas que conhecem o prato confirmam-na, e entra no atlas conforme as suas provas valerem, tal como qualquer outro registo.',
    atlasMayAlreadyHaveThis:
      'O atlas pode já ter isto',
    duplicateNote:
      'Se um destes for o seu prato, confirmá-lo é o que o faz avançar, e vale mais do que um segundo registo. Se nenhum for, continue; dois pratos podem ter o mesmo nome.',
    connectionRequiredNote:
      'Obrigatório, e mostrado. É toda a diferença entre isto e uma receita copiada da internet, que o atlas já recusa guardar.',
    proposeClosedNote:
      'Isto precisa de um sítio onde guardar o que as pessoas enviam, e não está montado. Nada do que escrever aqui iria a lado nenhum, por isso a aplicação di-lo em vez de o aceitar.',
    pantryNoMatches:
      'Nada do que está registado usa esses em conjunto. Experimente um de cada vez, ou proponha o prato que tinha em mente se o atlas não o tiver.',
    pantryPrompt:
      'Diga o que tem na cozinha. Só cerca de metade do atlas tem os ingredientes registados, por isso um prato que falte aqui pode ser apenas um que ninguém escreveu ainda.',
    requestsNotOpenNote:
      'Os pedidos ainda não estão abertos, por isso a única forma de um prato entrar no atlas é alguém registá-lo.',
    footerHolding:
      '{n} tradições de {c} países. Livre de ler, sem publicidade, e nada é rastreado.',
    footerSources:
      'Construído a partir da Wikipédia, Wikidata, Wikimedia Commons, Wikibooks e dos dados abertos regionais de Itália, todos livres de ler e com licença aberta. As fotografias são creditadas aos seus autores em cada registo que traz uma.',
    atlasCoverageLine:
      '{n} tradições documentadas em {c} países. A cobertura é declarada com honestidade: um país ausente aqui não tem ainda nada registado, não é que não haja nada a registar.',
    concentrationNote:
      '{p}% do catálogo vem só de {country}. Isso reflete que países foram catalogados nas fontes abertas de que isto parte, não onde está a comida do mundo.',
    growTheAtlasBody:
      'Para cada prato, o atlas puxa primeiro a receita mais publicada na internet e classifica-a. Onde não existe nada em linha, uma contribuição da comunidade passa a ser o registo.',
    keepingItFreeBody:
      'Tudo aqui é construído com fontes que não custam nada e assim continuam. Uma única coisa custa dinheiro, e está desligada até poder ser paga.',
    meterDocumented:
      'Tem método registado',
    meterDocumentedNote:
      'O número que diz se isto é um atlas ou uma lista de nomes. Tudo o resto lhe é secundário.',
    meterLocated:
      'Situado abaixo do nível do país',
    meterLocatedNote:
      'A autenticidade tem profundidade geográfica. “Kozhikode” é um registo; “Índia” é apenas um começo.',
    meterIllustrated:
      'Tem fotografia',
    meterIllustratedNote:
      'Um prato que ninguém consegue imaginar é difícil de estimar, e mais difícil de reconhecer.',
    meterFilmed:
      'Tem vídeo ordenado',
    meterFilmedNote:
      'Ordenado pela proximidade de quem cozinha à tradição, não por um resultado de pesquisa.',
    meterAssessed:
      'Classificado como autêntico',
    meterAssessedNote:
      'Conquistado pelas verificações de provas. Uma percentagem baixa aqui é honesta, não um fracasso.',
    supportLead:
      '{n} tradições, construídas inteiramente a partir de fontes livres de ler e com licença aberta. Sem publicidade, sem rastreio e nada atrás de um pagamento. Aqui está o que isso custa de facto, incluindo as partes que não custam nada. Os valores são em {currency}.',
    notForSaleAuthentic:
      'Um registo não pode tornar-se Autêntico pagando. Isso vem das provas e das pessoas que cozinham o prato.',
    notForSalePromotion:
      'Nenhum prato é promovido, colocado acima ou destacado porque alguém pagou.',
    notForSaleAdvertising:
      'Nada aqui é publicidade, e nenhum leitor é rastreado.',
    donationFootnote:
      'Abre no Open Collective. Aqui não se cobra nada — esta aplicação não guarda dados de pagamento seus e nunca guardará.',
    donationsPendingBody:
      'Não há para onde enviar dinheiro. Quando houver, será um Open Collective, para que cada contributo e cada despesa sejam públicos e qualquer pessoa possa conferir esta página com o livro de contas.',
    mostUsefulThing:
      'A coisa mais útil que alguém pode dar a este atlas não é dinheiro. A maior parte dele é um nome e um lugar porque ninguém escreveu como a comida se faz.',
    administration:
      'Administração',
    administrationNote:
      'Limiares, moderação, verificação de fontes e utilização. Precisa de um token.',
    interfaceTranslationNote:
      'Esta interface foi traduzida automaticamente e não foi verificada por um falante. Os registos em si não são afetados. Correções são bem-vindas.',
  },

  nl: {
    goBack: 'Terug',
    search: 'Zoeken',
    backToShelves: 'Terug naar de schappen',
    seeAll: 'Alles bekijken',
    worldwide: 'Wereldwijd',
    world: 'Wereld',
    chooseCountry: 'Kies een land',
    nothingRecordedHere: 'Hier is nog niets vastgelegd',
    resetFilters: 'Filters wissen',
    recordedNotAssessed: 'Vastgelegd, nog niet beoordeeld',
    mostLookedUp: 'Meest opgezocht',
    wikipediaReaders: 'Wikipedia-lezers',
    deepestLevelRecorded: 'Meest gedetailleerde niveau hier vastgelegd',
    searchPlaceholder: 'Gerecht, land, regio, stad of ingrediënt',
    // `filters` omitted: the Dutch for it is "Filters". See the note above.
    nothingApplied: 'geen toegepast',
    results: 'Resultaten',
    matches: 'resultaten',
    noMatch: 'Geen resultaat',
    authenticityLevel: 'Authenticiteitsniveau',
    cuisine: 'Keuken',
    kindOfDish: 'Soort gerecht',
    traditionalIngredient: 'Traditioneel ingrediënt',
    sortResultsBy: 'Resultaten sorteren op',
    authenticityConfidence: 'Vertrouwen in de authenticiteit',
    atRiskFirst: 'Bedreigde eerst',
    notClassified: 'Niet ingedeeld',
    askForItInstead: 'Vraag er in plaats daarvan om',
    surpriseMe: 'Verras me met een bedreigde traditie',
    browseTheAtlas: 'Blader door de wereldatlas',
    clearAll: 'Alles wissen',
    none: 'Geen',
    iKnowHowItsMade: 'Ik weet hoe het gemaakt wordt — leg het vast',
    loadingAtlas: 'De atlas wordt gelezen…',
    couldNotLoad: 'De atlas kon niet worden geladen.',
    shelfDisappearing: 'Verdwijnend',
    shelfDisappearingNote: 'Tradities die een bron als teruglopend beschrijft — de ongedocumenteerde eerst, want die verdwijnen.',
    shelfAuthenticated: 'Bevestigd',
    shelfAuthenticatedNote: 'De records met echt bewijs van hoe ze worden gemaakt, en waar.',
    shelfCookable: 'Dit zou u vanavond kunnen koken',
    shelfCookableNote: 'Records met een beschreven bereiding — traditioneel waar we die hebben, gepubliceerd waar niet.',
    shelfIllustrated: 'De moeite van het bekijken waard',
    shelfIllustratedNote: 'Gefotografeerde tradities, om te bladeren in plaats van te zoeken.',
    foodAtlas: 'Culinaire atlas',
    howComplete: 'Hoe volledig is deze atlas?',
    traditionsRecorded: 'tradities vastgelegd',
    countries: 'landen',
    atRiskTraditions: 'bedreigde tradities',
    whereTheRecordsAre: 'Waar de records zijn',
    confidence: 'Betrouwbaarheid',
    growTheAtlas: 'Laat de atlas groeien',
    addATradition: 'Voeg een traditie uit uw streek toe',
    keepingItFree: 'Gratis houden',
    whatItCostsToRun: 'Wat het kost om te draaien',
    anywhere: 'Overal',
    noRecord: 'Geen record',
    backToTheFeed: 'Terug naar het overzicht',
    bookmarkThis: 'Deze traditie bewaren',
    photoOriginUnverified: 'Herkomst van de foto niet geverifieerd',
    whyFlaggedAtRisk: 'Waarom dit als bedreigd geldt',
    openDisagreement: 'Open meningsverschil',
    ingredientsNamedInAccount: 'Ingrediënten genoemd in dat verslag',
    methodStillOpen: 'De bereiding staat nog open',
    notDocumentedYet: 'Nog niet gedocumenteerd',
    recordHowItsMade: 'Leg vast hoe het gemaakt wordt',
    traditionalEquipment: 'Traditioneel gerei',
    mostPopularVersion: 'Populairste versie online',
    watchItBeingMade: 'Bekijk de bereiding',
    findPreparationVideos: 'Bereidingsvideo’s zoeken ↗',
    whereTheMethodComesFrom: 'Waar de bereiding vandaan komt',
    alsoMadeThisWay: 'Wordt ook zo gemaakt',
    howItWorks: 'Hoe het werkt',
    proposeADish: 'Een gerecht voorstellen',
    confirm: 'Bevestigen',
    confirmAProposal: 'Een voorstel bevestigen',
    everyRecord: 'Alle records',
    addATraditionShort: 'Een traditie toevoegen',
    navExplore: 'Ontdekken',
    navContribute: 'Bijdragen',
    navAbout: 'Over',
    theGapThatCannotBeClosed: 'Het gat dat lezen niet dicht',
    aDocumentCannotMakeAuthentic: 'Een document kan een gerecht niet echt maken.',
    sixThingsScoredSeparately: 'Zes dingen, apart beoordeeld',
    whatClosesIt: 'Wat het dicht',
    whatThisIsNot: 'Wat dit niet is',
    whichIsWhereYouComeIn: 'En daar komt u binnen',
    confirmADishYouKnow: 'Bevestig een gerecht dat u kent',
    proposeOneMissing: 'Stel er een voor die de atlas mist',
    whatItDoesNotBuy: 'Wat het niet koopt',
    contributeOnOpenCollective: 'Bijdragen via Open Collective',
    readTheLedger: 'Lees het kasboek — elke bijdrage en elke uitgave',
    notOpenForDonationsYet: 'Nog niet open voor donaties',
    browse: 'Bladeren',
    startAgain: 'Opnieuw beginnen',
    openProposals: 'Open voorstellen',
    whatTheseAre: 'Wat dit zijn',
    proposed: 'Voorgesteld',
    seeOpenProposals: 'Bekijk open voorstellen',
    beforeYouStart: 'Voordat u begint',
    theDish: 'Het gerecht',
    writtenTheWayYouWriteIt: 'Geschreven zoals u het schrijft',
    country: 'Land',
    regionDistrictOrTown: 'Regio, streek of plaats',
    whoMakesItAndWhen: 'Wie het maakt, en wanneer',
    ingredientsOnePerLine: 'Ingrediënten — één per regel',
    howItIsMadeOnePerLine: 'Hoe het gemaakt wordt — één stap per regel',
    yourName: 'Uw naam',
    shownOnTheProposal: 'Wordt bij het voorstel getoond',
    yourConnectionToThePlace: 'Uw band met die plek',
    proposeThisDish: 'Dit gerecht voorstellen',
    dishInItsOwnLanguage: 'Gerecht, zo mogelijk in de eigen taal',
    whereIsItMadeThisWay: 'Waar wordt het zo gemaakt?',
    whoPreparesIt: 'Wie het bereidt',
    traditionalIngredientsAndEquipment: 'Traditionele ingrediënten en gerei',
    publishAPhotographOnCommons: 'Publiceer een foto op Commons',
    commonsFileNameOrLink: 'Commons-bestandsnaam of link',
    checkWhatExistsOnline: 'Kijk wat er al online staat',
    whatTheInternetAlreadyHas: 'Wat het internet al heeft',
    runTheEvidenceAssessment: 'Voer de bewijstoets uit',
    evidenceAssessment: 'Bewijstoets',
    sendForCommunityValidation: 'Naar bevestiging door de gemeenschap sturen',
    communityValidation: 'Bevestiging door de gemeenschap',
    ifTheyDisagree: 'Als zij het oneens zijn',
    nowSendYours: 'Stuur nu die van u',
    sendThisTradition: 'Deze traditie versturen',
    submissionsNotOpenYet: 'Inzendingen zijn nog niet open',
    backToTheAtlas: 'Terug naar de atlas',
    settingsTitle: 'Instellingen',
    whatThisChanges: 'Wat dit verandert',
    administratorToken: 'Beheerderstoken',
    tokenNotStored: 'Niet bewaard — elke sessie opnieuw',
    queueThisCheck: 'Deze controle in de wachtrij',
    loadAnalytics: 'Statistieken laden',
    mostOpenedDishes: 'Meest geopende gerechten',
    mostSearchedFor: 'Meest gezocht',
    mostUsedShelves: 'Meest gebruikte planken',
    screens: 'Schermen',
    oftenTheWholePoint: 'Vaak juist het belangrijkste — optioneel',
    grewUpInMalabar: 'Opgegroeid in Malabar',
    whatTheseAreBody:
      'Gerechten waarvan mensen zeggen dat ze bestaan en waarvan de atlas niets heeft. Elk heeft {n} bevestigingen nodig van mensen die het kennen voordat het in de atlas komt — beoordeeld op dezelfde zes dimensies als elk ander record.',
    proposalsNotOpenYet:
      'Voorstellen zijn nog niet open',
    proposalsNotOpenNote:
      'Hiervoor is een plek nodig om te bewaren wat mensen sturen. Tot die er is zegt de app dat, in plaats van een lege lijst te tonen alsof niemand iets bij te dragen had.',
    nothingIsWaiting:
      'Er wacht niets',
    nothingIsWaitingNote:
      'Over elk voorstel is beslist. Kent u een gerecht dat de atlas niet heeft, dan begint het hier.',
    loading:
      'Laden…',
    proposedBy:
      'Voorgesteld door',
    beforeYouStartBody:
      'Dit is voor eten dat de atlas niet heeft, meestal omdat niemand het heeft opgeschreven. Een volledig recept is niet nodig. Een naam, waar het vandaan komt, en uw band met die plek zijn genoeg om het open te stellen voor bevestiging.',
    notPublishedBySending:
      'Versturen publiceert het niet. Eerst bevestigen {n} mensen die het gerecht kennen het, en het komt in de atlas met wat zijn bewijs waard is — net als elk ander record hier.',
    atlasMayAlreadyHaveThis:
      'De atlas heeft dit misschien al',
    duplicateNote:
      'Als een hiervan uw gerecht is, brengt bevestigen het verder, en dat is meer waard dan een tweede record. Is het geen van deze, ga dan door; twee gerechten mogen een naam delen.',
    connectionRequiredNote:
      'Verplicht, en wordt getoond. Het is het hele verschil tussen dit en een van internet overgeschreven recept, dat de atlas al weigert te bewaren.',
    proposeClosedNote:
      'Hiervoor is een plek nodig om te bewaren wat mensen sturen, en die is er niet. Niets van wat u hier schrijft zou ergens aankomen, dus zegt de app het in plaats van het aan te nemen.',
    pantryNoMatches:
      'Niets in de atlas gebruikt die samen. Probeer er één tegelijk — of stel het gerecht voor dat u in gedachten had, als de atlas het niet heeft.',
    pantryPrompt:
      'Noem wat er in uw keuken ligt. Van ongeveer de helft van de atlas zijn de ingrediënten vastgelegd, dus een gerecht dat hier ontbreekt kan er simpelweg een zijn dat niemand heeft opgeschreven.',
    requestsNotOpenNote:
      'Verzoeken zijn nog niet open, dus een gerecht komt alleen in de atlas als iemand het vastlegt.',
    footerHolding:
      '{n} tradities uit {c} landen. Vrij te lezen, geen reclame, en niets wordt gevolgd.',
    footerSources:
      'Gebouwd op Wikipedia, Wikidata, Wikimedia Commons, Wikibooks en de regionale open data van Italië — alle vrij te lezen en open gelicentieerd. Foto’s worden toegeschreven aan hun makers op elk record dat er een draagt.',
    atlasCoverageLine:
      '{n} tradities vastgelegd in {c} landen. De dekking wordt eerlijk benoemd: een land dat hier ontbreekt heeft nog niets vastgelegd, niet niets vast te leggen.',
    concentrationNote:
      '{p}% van de catalogus komt alleen uit {country}. Dat laat zien welke landen zijn vastgelegd in de open bronnen waarop dit is gebouwd — niet waar het eten van de wereld is.',
    growTheAtlasBody:
      'Voor elk gerecht haalt de atlas eerst het meest gepubliceerde recept van internet en deelt het in. Waar online niets bestaat, wordt een bijdrage uit de gemeenschap het record.',
    keepingItFreeBody:
      'Alles hier is gebouwd op bronnen die niets kosten en dat blijven. Eén ding kost wel geld, en het staat uit tot het betaald kan worden.',
    meterDocumented:
      'Heeft een vastgelegde bereiding',
    meterDocumentedNote:
      'Het getal dat zegt of dit een atlas is of een namenlijst. Al het andere is daaraan ondergeschikt.',
    meterLocated:
      'Geplaatst onder landniveau',
    meterLocatedNote:
      'Echtheid heeft geografische diepte. “Kozhikode” is een record; “India” is nauwelijks een begin.',
    meterIllustrated:
      'Heeft een foto',
    meterIllustratedNote:
      'Een gerecht dat niemand voor zich ziet is moeilijk te waarderen, en moeilijker te herkennen.',
    meterFilmed:
      'Heeft een geordende video',
    meterFilmedNote:
      'Geordend naar hoe dicht de kok bij de traditie staat — niet naar een zoekresultaat.',
    meterAssessed:
      'Ingedeeld als echt',
    meterAssessedNote:
      'Verdiend via de bewijstoetsen. Een laag aandeel is hier eerlijk, geen falen.',
    supportLead:
      '{n} tradities, volledig gebouwd op bronnen die vrij te lezen en open gelicentieerd zijn. Geen reclame, geen volgen, en niets achter een betaling. Dit is wat het werkelijk kost, inclusief de delen die niets kosten. Bedragen in {currency}.',
    notForSaleAuthentic:
      'Een record kan niet Echt worden door ervoor te betalen. Dat komt uit bewijs en van mensen die het gerecht koken.',
    notForSalePromotion:
      'Geen gerecht wordt gepromoot, hoger gezet of uitgelicht omdat iemand betaald heeft.',
    notForSaleAdvertising:
      'Niets hier is reclame, en geen lezer wordt gevolgd.',
    donationFootnote:
      'Opent bij Open Collective. Hier wordt niets geïnd — deze app bewaart geen betaalgegevens van u en zal dat nooit doen.',
    donationsPendingBody:
      'Er is nergens om geld heen te sturen. Als dat er is, wordt het een Open Collective, zodat elke bijdrage en elke uitgave openbaar is en iedereen deze pagina tegen het kasboek kan houden.',
    mostUsefulThing:
      'Het nuttigste dat iemand deze atlas kan geven is geen geld. Het meeste ervan is een naam en een plek, omdat niemand heeft opgeschreven hoe het eten gemaakt wordt.',
    administration:
      'Beheer',
    administrationNote:
      'Drempels, moderatie, broncontroles en gebruik. Vereist een token.',
    interfaceTranslationNote:
      'Deze interface is machinaal vertaald en niet door een spreker gecontroleerd. De vermeldingen zelf zijn niet aangepast. Correcties zijn welkom.',
  },

  pl: {
    goBack: 'Wstecz',
    search: 'Szukaj',
    backToShelves: 'Powrót do półek',
    seeAll: 'Zobacz wszystko',
    worldwide: 'Cały świat',
    world: 'Świat',
    chooseCountry: 'Wybierz kraj',
    nothingRecordedHere: 'Nic tu jeszcze nie zapisano',
    resetFilters: 'Wyczyść filtry',
    recordedNotAssessed: 'Zapisane, jeszcze nieocenione',
    mostLookedUp: 'Najczęściej wyszukiwane',
    wikipediaReaders: 'Czytelnicy Wikipedii',
    deepestLevelRecorded: 'Najdokładniejszy zapisany tu poziom',
    searchPlaceholder: 'Potrawa, kraj, region, miasto lub składnik',
    filters: 'Filtry',
    nothingApplied: 'żaden nie zastosowany',
    results: 'Wyniki',
    matches: 'wyników',
    noMatch: 'Brak wyników',
    authenticityLevel: 'Poziom autentyczności',
    cuisine: 'Kuchnia',
    kindOfDish: 'Rodzaj potrawy',
    traditionalIngredient: 'Tradycyjny składnik',
    sortResultsBy: 'Sortuj wyniki według',
    authenticityConfidence: 'Pewność autentyczności',
    atRiskFirst: 'Najpierw zagrożone',
    notClassified: 'Niesklasyfikowane',
    askForItInstead: 'Poproś o to zamiast tego',
    surpriseMe: 'Zaskocz mnie zagrożoną tradycją',
    browseTheAtlas: 'Przeglądaj atlas świata',
    clearAll: 'Wyczyść wszystko',
    none: 'Brak',
    video: '▶ Wideo',
    iKnowHowItsMade: 'Wiem, jak się to przyrządza — zapisz to',
    loadingAtlas: 'Wczytywanie atlasu…',
    couldNotLoad: 'Nie udało się wczytać atlasu.',
    shelfDisappearing: 'Zanikające',
    shelfDisappearingNote: 'Tradycje, które źródło opisuje jako zanikające — najpierw nieudokumentowane, bo to one przepadają.',
    shelfAuthenticated: 'Uwierzytelnione',
    shelfAuthenticatedNote: 'Wpisy z rzeczywistymi dowodami na to, jak i gdzie są przyrządzane.',
    shelfCookable: 'To mógłbyś ugotować dziś wieczorem',
    shelfCookableNote: 'Wpisy ze spisanym sposobem przyrządzania — tradycyjnym, jeśli go mamy, opublikowanym, jeśli nie.',
    shelfIllustrated: 'Warto zobaczyć',
    shelfIllustratedNote: 'Sfotografowane tradycje, do przeglądania raczej niż do wyszukiwania.',
    foodAtlas: 'Atlas kulinarny',
    howComplete: 'Jak kompletny jest ten atlas?',
    traditionsRecorded: 'zapisanych tradycji',
    countries: 'kraje',
    atRiskTraditions: 'zagrożone tradycje',
    whereTheRecordsAre: 'Gdzie są wpisy',
    confidence: 'Wiarygodność',
    growTheAtlas: 'Rozwijaj atlas',
    addATradition: 'Dodaj tradycję ze swojej okolicy',
    keepingItFree: 'Utrzymanie za darmo',
    whatItCostsToRun: 'Ile kosztuje utrzymanie',
    anywhere: 'Gdziekolwiek',
    noRecord: 'Brak wpisu',
    backToTheFeed: 'Powrót do strony głównej',
    bookmarkThis: 'Zapisz tę tradycję',
    photoOriginUnverified: 'Pochodzenie zdjęcia niezweryfikowane',
    whyFlaggedAtRisk: 'Dlaczego oznaczono to jako zagrożone',
    openDisagreement: 'Otwarty spór',
    ingredientsNamedInAccount: 'Składniki wymienione w tym opisie',
    methodStillOpen: 'Sposób przyrządzania pozostaje otwarty',
    notDocumentedYet: 'Jeszcze nieudokumentowane',
    recordHowItsMade: 'Zapisz, jak się to przyrządza',
    traditionalEquipment: 'Tradycyjne przybory',
    mostPopularVersion: 'Najpopularniejsza wersja w sieci',
    watchItBeingMade: 'Zobacz, jak powstaje',
    findPreparationVideos: 'Znajdź filmy z przygotowaniem ↗',
    whereTheMethodComesFrom: 'Skąd pochodzi sposób przyrządzania',
    alsoMadeThisWay: 'Przyrządzane także tak',
    howItWorks: 'Jak to działa',
    proposeADish: 'Zaproponuj potrawę',
    confirm: 'Potwierdź',
    confirmAProposal: 'Potwierdź propozycję',
    everyRecord: 'Wszystkie wpisy',
    addATraditionShort: 'Dodaj tradycję',
    navExplore: 'Przeglądaj',
    navContribute: 'Współtwórz',
    navAbout: 'O projekcie',
    theGapThatCannotBeClosed: 'Różnica, której nie zniweluje czytanie',
    aDocumentCannotMakeAuthentic: 'Dokument nie uczyni potrawy autentyczną.',
    sixThingsScoredSeparately: 'Sześć rzeczy, ocenianych osobno',
    whatClosesIt: 'Co ją zamyka',
    whatThisIsNot: 'Czym to nie jest',
    whichIsWhereYouComeIn: 'I tu wchodzisz ty',
    confirmADishYouKnow: 'Potwierdź potrawę, którą znasz',
    proposeOneMissing: 'Zaproponuj tę, której brakuje w atlasie',
    whatItDoesNotBuy: 'Czego to nie kupuje',
    contributeOnOpenCollective: 'Wesprzyj przez Open Collective',
    readTheLedger: 'Przeczytaj księgę — każdą wpłatę i każdy wydatek',
    notOpenForDonationsYet: 'Jeszcze nie otwarte na wpłaty',
    browse: 'Przeglądaj',
    startAgain: 'Zacznij od nowa',
    openProposals: 'Otwarte propozycje',
    whatTheseAre: 'Czym one są',
    proposed: 'Zaproponowano',
    seeOpenProposals: 'Zobacz otwarte propozycje',
    beforeYouStart: 'Zanim zaczniesz',
    theDish: 'Potrawa',
    writtenTheWayYouWriteIt: 'Zapisana tak, jak ją zapisujesz',
    country: 'Kraj',
    regionDistrictOrTown: 'Region, powiat lub miejscowość',
    whoMakesItAndWhen: 'Kto ją robi i kiedy',
    ingredientsOnePerLine: 'Składniki — po jednym w wierszu',
    howItIsMadeOnePerLine: 'Jak się ją robi — jeden krok w wierszu',
    yourName: 'Twoje imię',
    shownOnTheProposal: 'Widoczne przy propozycji',
    yourConnectionToThePlace: 'Twój związek z tym miejscem',
    proposeThisDish: 'Zaproponuj tę potrawę',
    dishInItsOwnLanguage: 'Potrawa, w miarę możliwości w jej własnym języku',
    whereIsItMadeThisWay: 'Gdzie robi się ją w ten sposób?',
    whoPreparesIt: 'Kto ją przyrządza',
    traditionalIngredientsAndEquipment: 'Tradycyjne składniki i przybory',
    publishAPhotographOnCommons: 'Opublikuj zdjęcie na Commons',
    commonsFileNameOrLink: 'Nazwa pliku lub link Commons',
    checkWhatExistsOnline: 'Sprawdź, co już jest w sieci',
    whatTheInternetAlreadyHas: 'Co internet już ma',
    runTheEvidenceAssessment: 'Uruchom ocenę dowodów',
    evidenceAssessment: 'Ocena dowodów',
    sendForCommunityValidation: 'Wyślij do potwierdzenia przez społeczność',
    communityValidation: 'Potwierdzenie przez społeczność',
    ifTheyDisagree: 'Jeśli się nie zgodzą',
    nowSendYours: 'Teraz wyślij swoją',
    sendThisTradition: 'Wyślij tę tradycję',
    submissionsNotOpenYet: 'Zgłoszenia nie są jeszcze otwarte',
    backToTheAtlas: 'Powrót do atlasu',
    settingsTitle: 'Ustawienia',
    whatThisChanges: 'Co to zmienia',
    administratorToken: 'Token administratora',
    tokenNotStored: 'Niezapisywany — wpisywany co sesję',
    queueThisCheck: 'Dodaj to sprawdzenie do kolejki',
    loadAnalytics: 'Wczytaj statystyki',
    mostOpenedDishes: 'Najczęściej otwierane potrawy',
    mostSearchedFor: 'Najczęściej wyszukiwane',
    mostUsedShelves: 'Najczęściej używane półki',
    screens: 'Ekrany',
    oftenTheWholePoint: 'Często najważniejsze — opcjonalne',
    grewUpInMalabar: 'Dorastałem w Malabarze',
    whatTheseAreBody:
      'Potrawy, o których ktoś mówi, że istnieją, a atlas nie ma po nich śladu. Każda potrzebuje {n} potwierdzeń od osób, które ją znają, zanim trafi do atlasu — oceniana według tych samych sześciu wymiarów co każdy inny wpis.',
    proposalsNotOpenYet:
      'Propozycje nie są jeszcze otwarte',
    proposalsNotOpenNote:
      'Potrzebne jest miejsce, w którym zapisze się to, co ludzie przysyłają. Dopóki go nie ma, aplikacja mówi to wprost, zamiast pokazywać pustą listę, jakby nikt nie miał nic do dodania.',
    nothingIsWaiting:
      'Nic nie czeka',
    nothingIsWaitingNote:
      'Każda propozycja została rozstrzygnięta. Jeśli znasz potrawę, której atlas nie ma, zaczyna się tutaj.',
    loading:
      'Wczytywanie…',
    proposedBy:
      'Zaproponowane przez',
    beforeYouStartBody:
      'To jest dla jedzenia, którego atlas nie ma — zwykle dlatego, że nikt go nie zapisał. Pełny przepis nie jest potrzebny. Nazwa, skąd pochodzi i twój związek z tym miejscem wystarczą, by otworzyć ją do potwierdzenia.',
    notPublishedBySending:
      'Wysłanie jej nie publikuje. Najpierw potwierdza ją {n} osób, które znają tę potrawę, i trafia do atlasu z tym, na co zasłużyły jej dowody — tak jak każdy inny wpis.',
    atlasMayAlreadyHaveThis:
      'Atlas może już to mieć',
    duplicateNote:
      'Jeśli któraś z nich jest twoją potrawą, to potwierdzenie ją posuwa i jest warte więcej niż drugi wpis. Jeśli żadna nie jest, idź dalej; dwie potrawy mogą nosić tę samą nazwę.',
    connectionRequiredNote:
      'Wymagane i pokazywane. To cała różnica między tym a przepisem przepisanym z internetu, którego atlas i tak nie przyjmuje.',
    proposeClosedNote:
      'Potrzebne jest miejsce na to, co ludzie przysyłają, a nie zostało przygotowane. Nic z tego, co tu napiszesz, nigdzie by nie dotarło, więc aplikacja mówi to wprost, zamiast to przyjmować.',
    pantryNoMatches:
      'Nic z zapisanych potraw nie łączy tych składników. Spróbuj po jednym — albo zaproponuj potrawę, o której myślisz, jeśli atlas jej nie ma.',
    pantryPrompt:
      'Podaj, co masz w kuchni. Tylko mniej więcej połowa atlasu ma zapisane składniki, więc brakująca tu potrawa może być po prostu taką, której nikt jeszcze nie zapisał.',
    requestsNotOpenNote:
      'Prośby nie są jeszcze otwarte, więc potrawa trafia do atlasu tylko wtedy, gdy ktoś ją zapisze.',
    footerHolding:
      '{n} tradycji z {c} krajów. Za darmo do czytania, bez reklam i bez śledzenia.',
    footerSources:
      'Zbudowane na Wikipedii, Wikidanych, Wikimedia Commons, Wikibooks i regionalnych danych otwartych Włoch — wszystkie darmowe do czytania i na otwartej licencji. Zdjęcia są przypisane ich autorom przy każdym wpisie, który je ma.',
    atlasCoverageLine:
      '{n} tradycji zapisanych w {c} krajach. Zasięg podajemy uczciwie: kraj, którego tu nie ma, nie ma jeszcze nic zapisanego — a nie nic do zapisania.',
    concentrationNote:
      '{p}% katalogu pochodzi z samych {country}. To pokazuje, które kraje opisano w otwartych źródłach, na których to powstało, a nie gdzie jest jedzenie świata.',
    growTheAtlasBody:
      'Dla każdej potrawy atlas najpierw bierze najczęściej publikowany przepis z internetu i go klasyfikuje. Tam, gdzie w sieci nie ma nic, wpisem staje się zgłoszenie od społeczności.',
    keepingItFreeBody:
      'Wszystko tutaj powstało ze źródeł, które nic nie kosztują i takie zostaną. Jedna rzecz kosztuje pieniądze i jest wyłączona, dopóki nie będzie za co jej opłacić.',
    meterDocumented:
      'Ma zapisany sposób przyrządzania',
    meterDocumentedNote:
      'Liczba, która mówi, czy to atlas, czy lista nazw. Wszystko inne jest wobec niej wtórne.',
    meterLocated:
      'Umiejscowione poniżej poziomu kraju',
    meterLocatedNote:
      'Autentyczność ma głębię geograficzną. „Kozhikode” to wpis; „Indie” to ledwie początek.',
    meterIllustrated:
      'Ma zdjęcie',
    meterIllustratedNote:
      'Potrawę, której nikt nie potrafi sobie wyobrazić, trudno pokochać i jeszcze trudniej rozpoznać.',
    meterFilmed:
      'Ma uszeregowane wideo',
    meterFilmedNote:
      'Uszeregowane według bliskości gotującego do tradycji — nie według wyniku wyszukiwania.',
    meterAssessed:
      'Sklasyfikowane jako autentyczne',
    meterAssessedNote:
      'Zdobyte w ocenie dowodów. Niski udział jest tu uczciwy, a nie porażką.',
    supportLead:
      '{n} tradycji, zbudowanych w całości ze źródeł darmowych do czytania i na otwartej licencji. Bez reklam, bez śledzenia i bez niczego za opłatą. Oto ile to naprawdę kosztuje, łącznie z tym, co nie kosztuje nic. Kwoty w {currency}.',
    notForSaleAuthentic:
      'Wpisu nie da się uczynić Autentycznym przez zapłatę. To bierze się z dowodów i od ludzi, którzy tę potrawę gotują.',
    notForSalePromotion:
      'Żadna potrawa nie jest promowana, wyżej pozycjonowana ani wyróżniana dlatego, że ktoś zapłacił.',
    notForSaleAdvertising:
      'Nic tutaj nie jest reklamą i żaden czytelnik nie jest śledzony.',
    donationFootnote:
      'Otwiera się w Open Collective. Tutaj nic nie jest pobierane — ta aplikacja nie przechowuje żadnych twoich danych płatniczych i nigdy nie będzie.',
    donationsPendingBody:
      'Nie ma dokąd wysłać pieniędzy. Gdy będzie, będzie to Open Collective, żeby każda wpłata i każdy wydatek były jawne i każdy mógł zestawić tę stronę z księgą.',
    mostUsefulThing:
      'Najbardziej przydatną rzeczą, jaką można dać temu atlasowi, nie są pieniądze. Większość z niego to nazwa i miejsce, bo nikt nie zapisał, jak tę potrawę się robi.',
    administration:
      'Administracja',
    administrationNote:
      'Progi, moderacja, sprawdzanie źródeł i użycie. Wymaga tokenu.',
    interfaceTranslationNote:
      'Ten interfejs przetłumaczono maszynowo i nie sprawdził go native speaker. Same wpisy pozostają bez zmian. Poprawki mile widziane.',
  },

  tr: {
    goBack: 'Geri',
    search: 'Ara',
    backToShelves: 'Raflara dön',
    seeAll: 'Tümünü gör',
    worldwide: 'Dünya geneli',
    world: 'Dünya',
    chooseCountry: 'Bir ülke seçin',
    nothingRecordedHere: 'Burada henüz bir kayıt yok',
    resetFilters: 'Filtreleri sıfırla',
    recordedNotAssessed: 'Kaydedildi, henüz değerlendirilmedi',
    mostLookedUp: 'En çok bakılanlar',
    wikipediaReaders: 'Vikipedi okurları',
    deepestLevelRecorded: 'Burada kayıtlı en ayrıntılı düzey',
    searchPlaceholder: 'Yemek, ülke, bölge, şehir veya malzeme',
    filters: 'Filtreler',
    nothingApplied: 'hiçbiri uygulanmadı',
    results: 'Sonuçlar',
    matches: 'sonuç',
    noMatch: 'Sonuç yok',
    authenticityLevel: 'Özgünlük düzeyi',
    cuisine: 'Mutfak',
    kindOfDish: 'Yemek türü',
    traditionalIngredient: 'Geleneksel malzeme',
    sortResultsBy: 'Sonuçları şuna göre sırala',
    authenticityConfidence: 'Özgünlük güveni',
    atRiskFirst: 'Önce risk altındakiler',
    notClassified: 'Sınıflandırılmamış',
    askForItInstead: 'Bunun yerine talep edin',
    surpriseMe: 'Risk altındaki bir gelenekle beni şaşırt',
    browseTheAtlas: 'Dünya atlasına göz atın',
    clearAll: 'Tümünü temizle',
    none: 'Yok',
    iKnowHowItsMade: 'Nasıl yapıldığını biliyorum — kaydedin',
    loadingAtlas: 'Atlas okunuyor…',
    couldNotLoad: 'Atlas yüklenemedi.',
    shelfDisappearing: 'Kaybolmakta',
    shelfDisappearingNote: 'Bir kaynağın azalmakta olarak tanımladığı gelenekler — önce belgelenmemiş olanlar, çünkü kaybolanlar onlar.',
    shelfAuthenticated: 'Doğrulanmış',
    shelfAuthenticatedNote: 'Nasıl ve nerede yapıldığına dair gerçek kanıt taşıyan kayıtlar.',
    shelfCookable: 'Bunu bu akşam pişirebilirsiniz',
    shelfCookableNote: 'Yazılı yöntemi olan kayıtlar — elimizde varsa geleneksel, yoksa yayımlanmış olan.',
    shelfIllustrated: 'Görmeye değer',
    shelfIllustratedNote: 'Fotoğraflanmış gelenekler, aramaktan çok göz atmak için.',
    foodAtlas: 'Yemek Atlası',
    howComplete: 'Bu atlas ne kadar tamamlandı?',
    traditionsRecorded: 'kayıtlı gelenek',
    countries: 'ülke',
    atRiskTraditions: 'risk altındaki gelenek',
    whereTheRecordsAre: 'Kayıtlar nerede',
    confidence: 'Güvenilirlik',
    growTheAtlas: 'Atlası büyütün',
    addATradition: 'Yörenizden bir gelenek ekleyin',
    keepingItFree: 'Ücretsiz tutmak',
    whatItCostsToRun: 'İşletmenin maliyeti',
    anywhere: 'Her yer',
    noRecord: 'Kayıt yok',
    backToTheFeed: 'Akışa dön',
    bookmarkThis: 'Bu geleneği kaydet',
    photoOriginUnverified: 'Fotoğrafın kaynağı doğrulanmadı',
    whyFlaggedAtRisk: 'Neden risk altında işaretlendi',
    openDisagreement: 'Açık anlaşmazlık',
    ingredientsNamedInAccount: 'O anlatımda geçen malzemeler',
    methodStillOpen: 'Yöntem hâlâ açık',
    notDocumentedYet: 'Henüz belgelenmedi',
    recordHowItsMade: 'Nasıl yapıldığını kaydedin',
    traditionalEquipment: 'Geleneksel gereçler',
    mostPopularVersion: 'İnternetteki en yaygın sürüm',
    watchItBeingMade: 'Yapılışını izleyin',
    findPreparationVideos: 'Hazırlık videoları bul ↗',
    whereTheMethodComesFrom: 'Yöntem nereden geliyor',
    alsoMadeThisWay: 'Şöyle de yapılıyor',
    howItWorks: 'Nasıl çalışır',
    proposeADish: 'Bir yemek öner',
    confirm: 'Doğrula',
    confirmAProposal: 'Bir öneriyi doğrula',
    everyRecord: 'Tüm kayıtlar',
    addATraditionShort: 'Bir gelenek ekle',
    navExplore: 'Keşfet',
    navContribute: 'Katkıda bulun',
    navAbout: 'Hakkında',
    theGapThatCannotBeClosed: 'Okuyarak kapanmayan aralık',
    aDocumentCannotMakeAuthentic: 'Bir belge bir yemeği otantik yapamaz.',
    sixThingsScoredSeparately: 'Altı şey, ayrı ayrı puanlanır',
    whatClosesIt: 'Onu ne kapatır',
    whatThisIsNot: 'Bu ne değildir',
    whichIsWhereYouComeIn: 'İşte burada siz devreye giriyorsunuz',
    confirmADishYouKnow: 'Bildiğiniz bir yemeği doğrulayın',
    proposeOneMissing: 'Atlasta eksik olan birini önerin',
    whatItDoesNotBuy: 'Neyi satın almaz',
    contributeOnOpenCollective: 'Open Collective üzerinden katkıda bulunun',
    readTheLedger: 'Defteri okuyun — her katkı ve her gider',
    notOpenForDonationsYet: 'Bağışlara henüz açık değil',
    browse: 'Göz at',
    startAgain: 'Yeniden başla',
    openProposals: 'Açık öneriler',
    whatTheseAre: 'Bunlar nedir',
    proposed: 'Önerildi',
    seeOpenProposals: 'Açık önerileri gör',
    beforeYouStart: 'Başlamadan önce',
    theDish: 'Yemek',
    writtenTheWayYouWriteIt: 'Sizin yazdığınız gibi',
    country: 'Ülke',
    regionDistrictOrTown: 'Bölge, ilçe veya kasaba',
    whoMakesItAndWhen: 'Kim yapıyor, ne zaman',
    ingredientsOnePerLine: 'Malzemeler — her satıra bir tane',
    howItIsMadeOnePerLine: 'Nasıl yapılır — her satıra bir adım',
    yourName: 'Adınız',
    shownOnTheProposal: 'Öneride görünür',
    yourConnectionToThePlace: 'O yerle bağınız',
    proposeThisDish: 'Bu yemeği öner',
    dishInItsOwnLanguage: 'Yemek, mümkünse kendi dilinde',
    whereIsItMadeThisWay: 'Bu şekilde nerede yapılıyor?',
    whoPreparesIt: 'Kim hazırlıyor',
    traditionalIngredientsAndEquipment: 'Geleneksel malzemeler ve gereçler',
    publishAPhotographOnCommons: 'Commons’a bir fotoğraf yükleyin',
    commonsFileNameOrLink: 'Commons dosya adı veya bağlantısı',
    checkWhatExistsOnline: 'İnternette hâlihazırda ne var, bakın',
    whatTheInternetAlreadyHas: 'İnternette zaten olanlar',
    runTheEvidenceAssessment: 'Kanıt değerlendirmesini çalıştır',
    evidenceAssessment: 'Kanıt değerlendirmesi',
    sendForCommunityValidation: 'Topluluk doğrulamasına gönder',
    communityValidation: 'Topluluk doğrulaması',
    ifTheyDisagree: 'Katılmazlarsa',
    nowSendYours: 'Şimdi kendinizinkini gönderin',
    sendThisTradition: 'Bu geleneği gönder',
    submissionsNotOpenYet: 'Gönderimler henüz açık değil',
    backToTheAtlas: 'Atlasa dön',
    settingsTitle: 'Ayarlar',
    whatThisChanges: 'Bu neyi değiştirir',
    administratorToken: 'Yönetici belirteci',
    tokenNotStored: 'Saklanmaz — her oturumda yeniden yazılır',
    queueThisCheck: 'Bu denetimi sıraya al',
    loadAnalytics: 'İstatistikleri yükle',
    mostOpenedDishes: 'En çok açılan yemekler',
    mostSearchedFor: 'En çok aranan',
    mostUsedShelves: 'En çok kullanılan raflar',
    screens: 'Ekranlar',
    oftenTheWholePoint: 'Çoğu zaman asıl mesele — isteğe bağlı',
    grewUpInMalabar: 'Malabar’da büyüdüm',
    whatTheseAreBody:
      'İnsanların var olduğunu söylediği, atlasta kaydı bulunmayan yemekler. Her biri atlasa girmeden önce onu bilen kişilerden {n} doğrulama ister — buradaki her kayıt gibi aynı altı boyutta değerlendirilir.',
    proposalsNotOpenYet:
      'Öneriler henüz açık değil',
    proposalsNotOpenNote:
      'Bunun için gönderilenleri saklayacak bir yer gerekiyor. O olana kadar uygulama bunu söylüyor; kimsenin ekleyecek bir şeyi yokmuş gibi boş bir liste göstermek yerine.',
    nothingIsWaiting:
      'Bekleyen bir şey yok',
    nothingIsWaitingNote:
      'Her öneri karara bağlandı. Atlasta olmayan bir yemek biliyorsanız, başlangıç burası.',
    loading:
      'Yükleniyor…',
    proposedBy:
      'Öneren',
    beforeYouStartBody:
      'Bu, atlasta olmayan yemekler içindir — çoğu zaman kimse yazmadığı için. Tam bir tarif gerekmez. Bir ad, nereden geldiği ve o yerle bağınız, doğrulamaya açmak için yeter.',
    notPublishedBySending:
      'Göndermek onu yayımlamaz. Önce yemeği bilen {n} kişi doğrular ve kanıtı ne kadarsa o değerle atlasa girer — buradaki her kayıt gibi.',
    atlasMayAlreadyHaveThis:
      'Atlasta bu zaten olabilir',
    duplicateNote:
      'Bunlardan biri sizin yemeğinizse, onu doğrulamak ilerleten şeydir ve ikinci bir kayıttan değerlidir. Hiçbiri değilse devam edin; iki yemek aynı adı taşıyabilir.',
    connectionRequiredNote:
      'Zorunlu ve gösteriliyor. Bununla internetten kopyalanmış bir tarif arasındaki bütün fark budur — atlasın zaten kabul etmediği şey.',
    proposeClosedNote:
      'Gönderilenleri saklayacak bir yer gerekiyor ve kurulmuş değil. Buraya yazdığınız hiçbir şey bir yere gitmezdi, bu yüzden uygulama almak yerine bunu söylüyor.',
    pantryNoMatches:
      'Kayıtlı hiçbir şey bunları birlikte kullanmıyor. Teker teker deneyin — ya da aklınızdaki yemeği önerin, atlasta yoksa.',
    pantryPrompt:
      'Mutfağınızda ne olduğunu yazın. Atlasın ancak yarısının malzemeleri kayıtlı, bu yüzden burada çıkmayan bir yemek, sadece kimsenin yazmadığı bir yemek olabilir.',
    requestsNotOpenNote:
      'İstekler henüz açık değil; bir yemeğin atlasa girmesinin tek yolu birinin onu kaydetmesi.',
    footerHolding:
      '{c} ülkeden {n} gelenek. Okuması ücretsiz, reklam yok, hiçbir şey izlenmiyor.',
    footerSources:
      'Wikipedia, Wikidata, Wikimedia Commons, Wikibooks ve İtalya’nın bölgesel açık verilerinden kuruldu — hepsi okuması serbest ve açık lisanslı. Fotoğraflar, taşıyan her kayıtta yazarlarına atfedilir.',
    atlasCoverageLine:
      '{c} ülkede {n} gelenek kayıtlı. Kapsam dürüstçe belirtiliyor: burada olmayan bir ülkenin henüz kaydı yoktur, kaydedilecek şeyi yok değildir.',
    concentrationNote:
      'Kataloğun %{p}’i tek başına {country} kaynaklı. Bu, hangi ülkelerin dayandığımız açık kaynaklarda kayda geçtiğini gösterir — dünyanın yemeğinin nerede olduğunu değil.',
    growTheAtlasBody:
      'Atlas her yemek için önce internette en çok yayımlanmış tarifi alır ve sınıflandırır. Çevrimiçi hiçbir şey yoksa, topluluktan gelen bir katkı kaydın kendisi olur.',
    keepingItFreeBody:
      'Buradaki her şey hiçbir şeye mal olmayan ve öyle kalan kaynaklardan kuruldu. Tek bir şey para tutuyor ve karşılanabilene kadar kapalı.',
    meterDocumented:
      'Kayıtlı yapılışı var',
    meterDocumentedNote:
      'Bunun bir atlas mı yoksa bir adlar listesi mi olduğunu söyleyen sayı. Geri kalan her şey ikincildir.',
    meterLocated:
      'Ülke düzeyinin altına yerleştirilmiş',
    meterLocatedNote:
      'Otantikliğin coğrafi derinliği vardır. “Kozhikode” bir kayıttır; “Hindistan” ancak bir başlangıçtır.',
    meterIllustrated:
      'Fotoğrafı var',
    meterIllustratedNote:
      'Kimsenin gözünde canlandıramadığı bir yemeği sevmek zordur, tanımak daha da zor.',
    meterFilmed:
      'Sıralanmış videosu var',
    meterFilmedNote:
      'Yemeği yapanın geleneğe yakınlığına göre sıralanır — arama sonucuna göre değil.',
    meterAssessed:
      'Otantik olarak sınıflandırılmış',
    meterAssessedNote:
      'Kanıt denetimleriyle kazanılır. Buradaki düşük oran dürüsttür, başarısızlık değil.',
    supportLead:
      '{n} gelenek, tamamı okuması serbest ve açık lisanslı kaynaklardan kuruldu. Reklam yok, izleme yok ve ödeme duvarı yok. Bunun gerçekte neye mal olduğu burada — hiçbir şeye mal olmayan kısımlar dâhil. Rakamlar {currency} cinsinden.',
    notForSaleAuthentic:
      'Bir kayıt para ödeyerek Otantik yapılamaz. Bu, kanıttan ve o yemeği pişiren insanlardan gelir.',
    notForSalePromotion:
      'Biri ödedi diye hiçbir yemek öne çıkarılmaz, üst sıraya alınmaz veya vitrine konmaz.',
    notForSaleAdvertising:
      'Burada hiçbir şey reklam değildir ve hiçbir okur izlenmez.',
    donationFootnote:
      'Open Collective’te açılır. Burada hiçbir tahsilat yapılmaz — bu uygulama ödeme bilgilerinizi tutmaz ve hiçbir zaman tutmayacak.',
    donationsPendingBody:
      'Para gönderilecek bir yer yok. Olduğunda bir Open Collective olacak; böylece her katkı ve her gider açık olur ve herkes bu sayfayı defterle karşılaştırabilir.',
    mostUsefulThing:
      'Bu atlasa verilebilecek en yararlı şey para değildir. Atlasın çoğu bir ad ve bir yerden ibaret, çünkü kimse yemeğin nasıl yapıldığını yazmamış.',
    administration:
      'Yönetim',
    administrationNote:
      'Eşikler, denetim, kaynak kontrolleri ve kullanım. Bir belirteç gerektirir.',
    interfaceTranslationNote:
      'Bu arayüz makineyle çevrildi ve bir anadili konuşuru tarafından denetlenmedi. Kayıtların kendisi etkilenmedi. Düzeltmeler memnuniyetle karşılanır.',
  },

  ru: {
    goBack: 'Назад',
    search: 'Поиск',
    backToShelves: 'Вернуться к полкам',
    seeAll: 'Показать всё',
    worldwide: 'Весь мир',
    world: 'Мир',
    chooseCountry: 'Выбрать страну',
    nothingRecordedHere: 'Здесь пока ничего не записано',
    resetFilters: 'Сбросить фильтры',
    recordedNotAssessed: 'Записано, ещё не оценено',
    mostLookedUp: 'Чаще всего смотрят',
    wikipediaReaders: 'Читатели Википедии',
    deepestLevelRecorded: 'Самый подробный записанный здесь уровень',
    searchPlaceholder: 'Блюдо, страна, регион, город или ингредиент',
    filters: 'Фильтры',
    nothingApplied: 'ничего не применено',
    results: 'Результаты',
    matches: 'совпадений',
    noMatch: 'Ничего не найдено',
    authenticityLevel: 'Уровень подлинности',
    cuisine: 'Кухня',
    kindOfDish: 'Вид блюда',
    traditionalIngredient: 'Традиционный ингредиент',
    sortResultsBy: 'Сортировать результаты по',
    authenticityConfidence: 'Уверенность в подлинности',
    atRiskFirst: 'Сначала под угрозой',
    notClassified: 'Не классифицировано',
    askForItInstead: 'Запросить вместо этого',
    surpriseMe: 'Удиви меня традицией под угрозой',
    browseTheAtlas: 'Открыть атлас мира',
    clearAll: 'Очистить всё',
    none: 'Нет',
    video: '▶ Видео',
    iKnowHowItsMade: 'Я знаю, как это готовят — запишите',
    loadingAtlas: 'Читаем атлас…',
    couldNotLoad: 'Не удалось загрузить атлас.',
    shelfDisappearing: 'Исчезающие',
    shelfDisappearingNote: 'Традиции, которые источник описывает как угасающие — сначала недокументированные, потому что именно они исчезают.',
    shelfAuthenticated: 'Подтверждённые',
    shelfAuthenticatedNote: 'Записи с настоящими свидетельствами того, как и где их готовят.',
    shelfCookable: 'Это можно приготовить сегодня вечером',
    shelfCookableNote: 'Записи с описанным способом приготовления — традиционным, если он у нас есть, и опубликованным, если нет.',
    shelfIllustrated: 'Стоит посмотреть',
    shelfIllustratedNote: 'Сфотографированные традиции — чтобы разглядывать, а не искать.',
    foodAtlas: 'Кулинарный атлас',
    howComplete: 'Насколько полон этот атлас?',
    traditionsRecorded: 'записанных традиций',
    countries: 'стран',
    atRiskTraditions: 'традиций под угрозой',
    whereTheRecordsAre: 'Где находятся записи',
    confidence: 'Достоверность',
    growTheAtlas: 'Пополните атлас',
    addATradition: 'Добавьте традицию своего края',
    keepingItFree: 'Оставить бесплатным',
    whatItCostsToRun: 'Во что обходится работа',
    anywhere: 'Где угодно',
    noRecord: 'Записи нет',
    backToTheFeed: 'Вернуться на главную',
    bookmarkThis: 'Сохранить эту традицию',
    photoOriginUnverified: 'Происхождение фото не проверено',
    whyFlaggedAtRisk: 'Почему отмечено как под угрозой',
    openDisagreement: 'Открытое расхождение',
    ingredientsNamedInAccount: 'Ингредиенты, названные в этом описании',
    methodStillOpen: 'Способ приготовления пока открыт',
    notDocumentedYet: 'Пока не задокументировано',
    recordHowItsMade: 'Запишите, как это готовят',
    traditionalEquipment: 'Традиционная утварь',
    mostPopularVersion: 'Самая распространённая версия в сети',
    watchItBeingMade: 'Посмотрите, как готовят',
    findPreparationVideos: 'Найти видео приготовления ↗',
    whereTheMethodComesFrom: 'Откуда взят способ приготовления',
    alsoMadeThisWay: 'Готовят и так',
    howItWorks: 'Как это работает',
    proposeADish: 'Предложить блюдо',
    confirm: 'Подтвердить',
    confirmAProposal: 'Подтвердить предложение',
    everyRecord: 'Все записи',
    addATraditionShort: 'Добавить традицию',
    navExplore: 'Обзор',
    navContribute: 'Участвовать',
    navAbout: 'О проекте',
    theGapThatCannotBeClosed: 'Разрыв, который не закрыть чтением',
    aDocumentCannotMakeAuthentic: 'Документ не может сделать блюдо аутентичным.',
    sixThingsScoredSeparately: 'Шесть вещей, оцениваемых отдельно',
    whatClosesIt: 'Что его закрывает',
    whatThisIsNot: 'Чем это не является',
    whichIsWhereYouComeIn: 'И вот здесь нужны вы',
    confirmADishYouKnow: 'Подтвердите блюдо, которое знаете',
    proposeOneMissing: 'Предложите то, чего в атласе нет',
    whatItDoesNotBuy: 'Что на это не купить',
    contributeOnOpenCollective: 'Поддержать через Open Collective',
    readTheLedger: 'Открыть книгу учёта — каждый взнос и каждый расход',
    notOpenForDonationsYet: 'Приём пожертвований пока не открыт',
    browse: 'Обзор',
    startAgain: 'Начать заново',
    openProposals: 'Открытые предложения',
    whatTheseAre: 'Что это такое',
    proposed: 'Предложено',
    seeOpenProposals: 'Смотреть открытые предложения',
    beforeYouStart: 'Прежде чем начать',
    theDish: 'Блюдо',
    writtenTheWayYouWriteIt: 'Записано так, как пишете вы',
    country: 'Страна',
    regionDistrictOrTown: 'Регион, район или город',
    whoMakesItAndWhen: 'Кто готовит и когда',
    ingredientsOnePerLine: 'Ингредиенты — по одному в строке',
    howItIsMadeOnePerLine: 'Как готовят — по шагу в строке',
    yourName: 'Ваше имя',
    shownOnTheProposal: 'Показывается в предложении',
    yourConnectionToThePlace: 'Ваша связь с этим местом',
    proposeThisDish: 'Предложить это блюдо',
    dishInItsOwnLanguage: 'Блюдо, по возможности на своём языке',
    whereIsItMadeThisWay: 'Где готовят именно так?',
    whoPreparesIt: 'Кто готовит',
    traditionalIngredientsAndEquipment: 'Традиционные ингредиенты и утварь',
    publishAPhotographOnCommons: 'Опубликовать фото на Commons',
    commonsFileNameOrLink: 'Имя файла или ссылка на Commons',
    checkWhatExistsOnline: 'Посмотреть, что уже есть в сети',
    whatTheInternetAlreadyHas: 'Что уже есть в интернете',
    runTheEvidenceAssessment: 'Запустить оценку свидетельств',
    evidenceAssessment: 'Оценка свидетельств',
    sendForCommunityValidation: 'Отправить на подтверждение сообществом',
    communityValidation: 'Подтверждение сообществом',
    ifTheyDisagree: 'Если они не согласны',
    nowSendYours: 'Теперь отправьте своё',
    sendThisTradition: 'Отправить эту традицию',
    submissionsNotOpenYet: 'Приём пока не открыт',
    backToTheAtlas: 'Вернуться к атласу',
    settingsTitle: 'Настройки',
    whatThisChanges: 'Что это меняет',
    administratorToken: 'Токен администратора',
    tokenNotStored: 'Не сохраняется — вводится каждый сеанс',
    queueThisCheck: 'Поставить проверку в очередь',
    loadAnalytics: 'Загрузить статистику',
    mostOpenedDishes: 'Чаще всего открываемые блюда',
    mostSearchedFor: 'Чаще всего искали',
    mostUsedShelves: 'Чаще всего используемые полки',
    screens: 'Экраны',
    oftenTheWholePoint: 'Часто это самое главное — необязательно',
    grewUpInMalabar: 'Вырос в Малабаре',
    whatTheseAreBody:
      'Блюда, о существовании которых говорят, но записи о которых в атласе нет. Каждому нужно {n} подтверждений от людей, которые его знают, прежде чем оно войдёт в атлас, — по тем же шести измерениям, что и любая другая запись.',
    proposalsNotOpenYet:
      'Предложения пока не открыты',
    proposalsNotOpenNote:
      'Для этого нужно место, где хранить присланное. Пока его нет, приложение так и говорит, вместо того чтобы показывать пустой список, будто никому нечего добавить.',
    nothingIsWaiting:
      'Ничего не ждёт',
    nothingIsWaitingNote:
      'По каждому предложению принято решение. Если вы знаете блюдо, которого нет в атласе, всё начинается здесь.',
    loading:
      'Загрузка…',
    proposedBy:
      'Предложил',
    beforeYouStartBody:
      'Это для еды, которой нет в атласе, — обычно потому, что её никто не записал. Полный рецепт не нужен. Название, откуда оно, и ваша связь с этим местом — этого достаточно, чтобы открыть его для подтверждения.',
    notPublishedBySending:
      'Отправка не публикует его. Сначала {n} человек, знающих блюдо, подтверждают его, и оно входит в атлас с тем, чего стоят его свидетельства, — как и любая другая запись.',
    atlasMayAlreadyHaveThis:
      'В атласе это, возможно, уже есть',
    duplicateNote:
      'Если одно из них — ваше блюдо, подтверждение продвигает его, и это ценнее второй записи. Если ни одно, продолжайте: два блюда могут носить одно имя.',
    connectionRequiredNote:
      'Обязательно и показывается. В этом вся разница между этим и рецептом, переписанным из интернета, который атлас и так не принимает.',
    proposeClosedNote:
      'Нужно место, где хранить присланное, и оно не настроено. Ничто из написанного здесь никуда бы не дошло, поэтому приложение говорит об этом, а не принимает.',
    pantryNoMatches:
      'Ни одна запись не использует их вместе. Попробуйте по одному — или предложите блюдо, которое имели в виду, если его нет в атласе.',
    pantryPrompt:
      'Назовите, что есть у вас на кухне. Ингредиенты записаны примерно у половины атласа, поэтому отсутствующее здесь блюдо может быть просто тем, которое никто ещё не записал.',
    requestsNotOpenNote:
      'Запросы пока не открыты, поэтому блюдо попадает в атлас только если кто-то его запишет.',
    footerHolding:
      '{n} традиций из {c} стран. Читать бесплатно, без рекламы, ничего не отслеживается.',
    footerSources:
      'Построено на Википедии, Викиданных, Викискладе, Викиучебниках и региональных открытых данных Италии — всё свободно для чтения и под открытой лицензией. Фотографии подписаны именами авторов на каждой записи, где они есть.',
    atlasCoverageLine:
      '{n} традиций записано в {c} странах. Охват назван честно: у страны, которой здесь нет, пока ничего не записано — а не нечего записывать.',
    concentrationNote:
      '{p}% каталога приходится на одну {country}. Это говорит о том, какие страны описаны в открытых источниках, из которых всё построено, а не о том, где находится еда мира.',
    growTheAtlasBody:
      'Для каждого блюда атлас сначала берёт самый публикуемый в интернете рецепт и классифицирует его. Там, где в сети нет ничего, записью становится присланное сообществом.',
    keepingItFreeBody:
      'Всё здесь построено на источниках, которые ничего не стоят и такими остаются. Одна вещь стоит денег, и она выключена, пока её нечем оплатить.',
    meterDocumented:
      'Есть записанный способ приготовления',
    meterDocumentedNote:
      'Число, которое говорит, атлас это или список названий. Всё остальное вторично.',
    meterLocated:
      'Указано ниже уровня страны',
    meterLocatedNote:
      'У подлинности есть географическая глубина. «Кожикоде» — это запись; «Индия» — едва начало.',
    meterIllustrated:
      'Есть фотография',
    meterIllustratedNote:
      'Блюдо, которое никто не может себе представить, трудно полюбить и ещё труднее узнать.',
    meterFilmed:
      'Есть упорядоченное видео',
    meterFilmedNote:
      'Упорядочено по близости готовящего к традиции, а не по результату поиска.',
    meterAssessed:
      'Отнесено к подлинным',
    meterAssessedNote:
      'Заслужено проверками свидетельств. Низкая доля здесь честна, а не провальна.',
    supportLead:
      '{n} традиций, полностью построенных на источниках, свободных для чтения и с открытой лицензией. Без рекламы, без слежки и без платного доступа. Вот во что это действительно обходится, включая то, что не стоит ничего. Суммы в {currency}.',
    notForSaleAuthentic:
      'Запись нельзя сделать подлинной, заплатив за это. Подлинность идёт от свидетельств и от людей, которые готовят это блюдо.',
    notForSalePromotion:
      'Ни одно блюдо не продвигается, не поднимается выше и не выделяется потому, что кто-то заплатил.',
    notForSaleAdvertising:
      'Здесь нет рекламы, и ни за одним читателем не следят.',
    donationFootnote:
      'Откроется на Open Collective. Здесь ничего не принимается — приложение не хранит ваших платёжных данных и не будет.',
    donationsPendingBody:
      'Отправлять деньги некуда. Когда будет куда, это будет Open Collective, чтобы каждый взнос и каждый расход были открыты и любой мог сверить эту страницу с книгой учёта.',
    mostUsefulThing:
      'Самое полезное, что можно дать этому атласу, — не деньги. Большая его часть — это название и место, потому что никто не записал, как эту еду готовят.',
    administration:
      'Администрирование',
    administrationNote:
      'Пороги, модерация, проверка источников и использование. Нужен токен.',
    interfaceTranslationNote:
      'Этот интерфейс переведён машиной и не проверен носителем языка. Самих записей это не касается. Исправления приветствуются.',
  },

  hi: {
    goBack: 'वापस',
    search: 'खोजें',
    backToShelves: 'अलमारियों पर लौटें',
    seeAll: 'सब देखें',
    worldwide: 'पूरी दुनिया',
    world: 'दुनिया',
    chooseCountry: 'देश चुनें',
    nothingRecordedHere: 'यहाँ अभी कुछ दर्ज नहीं है',
    resetFilters: 'फ़िल्टर हटाएँ',
    recordedNotAssessed: 'दर्ज है, अभी आकलन नहीं हुआ',
    mostLookedUp: 'सबसे ज़्यादा देखे गए',
    wikipediaReaders: 'विकिपीडिया पाठक',
    deepestLevelRecorded: 'यहाँ दर्ज सबसे विस्तृत स्तर',
    searchPlaceholder: 'व्यंजन, देश, क्षेत्र, शहर या सामग्री',
    filters: 'फ़िल्टर',
    nothingApplied: 'कोई लागू नहीं',
    results: 'परिणाम',
    matches: 'मिलान',
    noMatch: 'कोई मिलान नहीं',
    authenticityLevel: 'प्रामाणिकता स्तर',
    cuisine: 'पाक-परंपरा',
    kindOfDish: 'व्यंजन का प्रकार',
    traditionalIngredient: 'पारंपरिक सामग्री',
    sortResultsBy: 'परिणाम इससे क्रमबद्ध करें',
    authenticityConfidence: 'प्रामाणिकता का भरोसा',
    atRiskFirst: 'पहले संकटग्रस्त',
    notClassified: 'वर्गीकृत नहीं',
    askForItInstead: 'इसके बदले माँगें',
    surpriseMe: 'किसी संकटग्रस्त परंपरा से चौंकाइए',
    browseTheAtlas: 'विश्व एटलस देखें',
    clearAll: 'सब हटाएँ',
    none: 'कोई नहीं',
    video: '▶ वीडियो',
    iKnowHowItsMade: 'मुझे पता है यह कैसे बनता है — दर्ज करें',
    loadingAtlas: 'एटलस पढ़ा जा रहा है…',
    couldNotLoad: 'एटलस लोड नहीं हो सका।',
    shelfDisappearing: 'लुप्त होती',
    shelfDisappearingNote: 'वे परंपराएँ जिन्हें कोई स्रोत घटती हुई बताता है — पहले वे जो दर्ज नहीं हैं, क्योंकि वही खोती हैं।',
    shelfAuthenticated: 'प्रमाणित',
    shelfAuthenticatedNote: 'वे रिकॉर्ड जिनके पास सचमुच प्रमाण है कि वे कैसे और कहाँ बनते हैं।',
    shelfCookable: 'यह आज रात बना सकते हैं',
    shelfCookableNote: 'लिखी हुई विधि वाले रिकॉर्ड — जहाँ हमारे पास पारंपरिक है वहाँ पारंपरिक, वरना प्रकाशित।',
    shelfIllustrated: 'देखने लायक',
    shelfIllustratedNote: 'तस्वीरों वाली परंपराएँ — खोजने से ज़्यादा देखने के लिए।',
    foodAtlas: 'खाद्य एटलस',
    howComplete: 'यह एटलस कितना पूरा है?',
    traditionsRecorded: 'परंपराएँ दर्ज',
    countries: 'देश',
    atRiskTraditions: 'संकटग्रस्त परंपराएँ',
    whereTheRecordsAre: 'रिकॉर्ड कहाँ हैं',
    confidence: 'विश्वसनीयता',
    growTheAtlas: 'एटलस बढ़ाएँ',
    addATradition: 'अपने क्षेत्र की परंपरा जोड़ें',
    keepingItFree: 'इसे मुफ़्त रखना',
    whatItCostsToRun: 'इसे चलाने में क्या लगता है',
    anywhere: 'कहीं भी',
    noRecord: 'कोई रिकॉर्ड नहीं',
    backToTheFeed: 'मुख्य पृष्ठ पर लौटें',
    bookmarkThis: 'इस परंपरा को सहेजें',
    photoOriginUnverified: 'तस्वीर का स्रोत अपुष्ट',
    whyFlaggedAtRisk: 'इसे संकटग्रस्त क्यों बताया गया',
    openDisagreement: 'खुला मतभेद',
    ingredientsNamedInAccount: 'उस विवरण में बताई गई सामग्री',
    methodStillOpen: 'विधि अभी खुली है',
    notDocumentedYet: 'अभी दर्ज नहीं',
    recordHowItsMade: 'दर्ज करें कि यह कैसे बनता है',
    traditionalEquipment: 'पारंपरिक बर्तन',
    mostPopularVersion: 'इंटरनेट पर सबसे प्रचलित रूप',
    watchItBeingMade: 'बनते हुए देखें',
    findPreparationVideos: 'बनाने के वीडियो खोजें ↗',
    whereTheMethodComesFrom: 'विधि कहाँ से आई',
    alsoMadeThisWay: 'ऐसे भी बनाया जाता है',
    howItWorks: 'यह कैसे काम करता है',
    proposeADish: 'एक व्यंजन प्रस्तावित करें',
    confirm: 'पुष्टि करें',
    confirmAProposal: 'प्रस्ताव की पुष्टि करें',
    everyRecord: 'सभी रिकॉर्ड',
    addATraditionShort: 'परंपरा जोड़ें',
    navExplore: 'खोजें',
    navContribute: 'योगदान करें',
    navAbout: 'परिचय',
    theGapThatCannotBeClosed: 'वह दूरी जो पढ़ने से नहीं भरती',
    aDocumentCannotMakeAuthentic: 'कोई दस्तावेज़ किसी व्यंजन को प्रामाणिक नहीं बना सकता।',
    sixThingsScoredSeparately: 'छह बातें, अलग-अलग आँकी गईं',
    whatClosesIt: 'इसे कौन भरता है',
    whatThisIsNot: 'यह क्या नहीं है',
    whichIsWhereYouComeIn: 'और यहीं आपकी बारी है',
    confirmADishYouKnow: 'जिस व्यंजन को आप जानते हैं उसकी पुष्टि करें',
    proposeOneMissing: 'जो एटलस में नहीं है, वह प्रस्तावित करें',
    whatItDoesNotBuy: 'इससे क्या नहीं मिलता',
    contributeOnOpenCollective: 'Open Collective पर योगदान करें',
    readTheLedger: 'लेखा-जोखा देखें — हर योगदान और हर ख़र्च',
    notOpenForDonationsYet: 'अभी दान के लिए खुला नहीं',
    browse: 'देखें',
    startAgain: 'फिर से शुरू करें',
    openProposals: 'खुले प्रस्ताव',
    whatTheseAre: 'ये क्या हैं',
    proposed: 'प्रस्तावित',
    seeOpenProposals: 'खुले प्रस्ताव देखें',
    beforeYouStart: 'शुरू करने से पहले',
    theDish: 'व्यंजन',
    writtenTheWayYouWriteIt: 'जैसे आप लिखते हैं वैसे ही',
    country: 'देश',
    regionDistrictOrTown: 'क्षेत्र, ज़िला या कस्बा',
    whoMakesItAndWhen: 'कौन बनाता है, और कब',
    ingredientsOnePerLine: 'सामग्री — हर पंक्ति में एक',
    howItIsMadeOnePerLine: 'कैसे बनता है — हर पंक्ति में एक चरण',
    yourName: 'आपका नाम',
    shownOnTheProposal: 'प्रस्ताव पर दिखेगा',
    yourConnectionToThePlace: 'उस जगह से आपका नाता',
    proposeThisDish: 'यह व्यंजन प्रस्तावित करें',
    dishInItsOwnLanguage: 'व्यंजन, हो सके तो उसकी अपनी भाषा में',
    whereIsItMadeThisWay: 'यह इस तरह कहाँ बनता है?',
    whoPreparesIt: 'कौन बनाता है',
    traditionalIngredientsAndEquipment: 'पारंपरिक सामग्री और बर्तन',
    publishAPhotographOnCommons: 'Commons पर एक तस्वीर प्रकाशित करें',
    commonsFileNameOrLink: 'Commons फ़ाइल नाम या लिंक',
    checkWhatExistsOnline: 'देखें इंटरनेट पर पहले से क्या है',
    whatTheInternetAlreadyHas: 'इंटरनेट के पास पहले से क्या है',
    runTheEvidenceAssessment: 'प्रमाण मूल्यांकन चलाएँ',
    evidenceAssessment: 'प्रमाण मूल्यांकन',
    sendForCommunityValidation: 'समुदाय की पुष्टि के लिए भेजें',
    communityValidation: 'समुदाय की पुष्टि',
    ifTheyDisagree: 'यदि वे असहमत हों',
    nowSendYours: 'अब अपना भेजें',
    sendThisTradition: 'यह परंपरा भेजें',
    submissionsNotOpenYet: 'भेजना अभी शुरू नहीं हुआ',
    backToTheAtlas: 'एटलस पर लौटें',
    settingsTitle: 'सेटिंग्स',
    whatThisChanges: 'इससे क्या बदलता है',
    administratorToken: 'प्रशासक टोकन',
    tokenNotStored: 'सहेजा नहीं जाता — हर सत्र में दोबारा',
    queueThisCheck: 'यह जाँच कतार में डालें',
    loadAnalytics: 'आँकड़े लोड करें',
    mostOpenedDishes: 'सबसे ज़्यादा खोले गए व्यंजन',
    mostSearchedFor: 'सबसे ज़्यादा खोजे गए',
    mostUsedShelves: 'सबसे ज़्यादा इस्तेमाल हुए खाने',
    screens: 'स्क्रीन',
    oftenTheWholePoint: 'अक्सर यही असली बात है — वैकल्पिक',
    grewUpInMalabar: 'मालाबार में पला-बढ़ा',
    whatTheseAreBody:
      'ऐसे व्यंजन जिनके होने की बात लोग कहते हैं पर एटलस के पास उनका कोई रिकॉर्ड नहीं। एटलस में आने से पहले हर एक को उसे जानने वाले {n} लोगों की पुष्टि चाहिए — उन्हीं छह आयामों पर आँका जाता है जिन पर बाकी हर रिकॉर्ड।',
    proposalsNotOpenYet:
      'प्रस्ताव अभी खुले नहीं हैं',
    proposalsNotOpenNote:
      'इसके लिए एक जगह चाहिए जहाँ लोगों का भेजा हुआ रखा जा सके। जब तक वह नहीं है, ऐप यही कहता है — खाली सूची दिखाने के बजाय, मानो किसी के पास कुछ जोड़ने को न हो।',
    nothingIsWaiting:
      'कुछ भी लंबित नहीं',
    nothingIsWaitingNote:
      'हर प्रस्ताव पर निर्णय हो चुका है। अगर आप कोई ऐसा व्यंजन जानते हैं जो एटलस में नहीं है, शुरुआत यहीं से है।',
    loading:
      'लोड हो रहा है…',
    proposedBy:
      'प्रस्तावक',
    beforeYouStartBody:
      'यह उस भोजन के लिए है जो एटलस के पास नहीं है — अक्सर इसलिए कि किसी ने उसे लिखा ही नहीं। पूरी विधि ज़रूरी नहीं। एक नाम, वह कहाँ का है, और उस जगह से आपका नाता — पुष्टि के लिए खोलने को इतना काफ़ी है।',
    notPublishedBySending:
      'भेजने से यह प्रकाशित नहीं होता। पहले व्यंजन को जानने वाले {n} लोग इसकी पुष्टि करते हैं, और यह अपने प्रमाणों के अनुसार एटलस में आता है — ठीक वैसे ही जैसे यहाँ का हर रिकॉर्ड।',
    atlasMayAlreadyHaveThis:
      'यह एटलस में पहले से हो सकता है',
    duplicateNote:
      'अगर इनमें से कोई आपका व्यंजन है, तो उसकी पुष्टि ही उसे आगे बढ़ाती है — यह दूसरे रिकॉर्ड से ज़्यादा क़ीमती है। अगर कोई नहीं है, आगे बढ़िए; दो व्यंजनों का नाम एक हो सकता है।',
    connectionRequiredNote:
      'अनिवार्य, और दिखाया जाता है। इसी से यह इंटरनेट से नक़ल की गई विधि से अलग होता है — जिसे एटलस पहले ही रखने से इनकार करता है।',
    proposeClosedNote:
      'इसके लिए भेजी गई बातें रखने की जगह चाहिए, और वह तैयार नहीं है। यहाँ लिखा कुछ भी कहीं नहीं पहुँचेगा, इसलिए ऐप उसे लेने के बजाय यह बता रहा है।',
    pantryNoMatches:
      'दर्ज किसी भी व्यंजन में ये साथ नहीं आते। एक-एक करके आज़माएँ — या जो व्यंजन मन में था वह प्रस्तावित करें, अगर एटलस के पास नहीं है।',
    pantryPrompt:
      'बताइए आपकी रसोई में क्या है। एटलस के लगभग आधे हिस्से की ही सामग्री दर्ज है, इसलिए यहाँ न मिलने वाला व्यंजन शायद वही हो जिसे किसी ने अब तक लिखा नहीं।',
    requestsNotOpenNote:
      'अनुरोध अभी खुले नहीं हैं, इसलिए किसी व्यंजन के एटलस में आने का एकमात्र रास्ता यही है कि कोई उसे दर्ज करे।',
    footerHolding:
      '{c} देशों की {n} परंपराएँ। पढ़ना मुफ़्त, कोई विज्ञापन नहीं, और कुछ भी ट्रैक नहीं होता।',
    footerSources:
      'विकिपीडिया, विकिडेटा, विकिमीडिया कॉमन्स, विकिबुक्स और इटली के क्षेत्रीय खुले डेटा से बना — सभी पढ़ने को स्वतंत्र और खुली लाइसेंस वाले। जिस भी रिकॉर्ड में तस्वीर है, उसमें फ़ोटोग्राफ़र का श्रेय दिया गया है।',
    atlasCoverageLine:
      '{c} देशों में {n} परंपराएँ दर्ज। कवरेज ईमानदारी से बताई गई है: यहाँ जो देश नहीं है, उसका अभी कुछ दर्ज नहीं हुआ — ऐसा नहीं कि दर्ज करने को कुछ है ही नहीं।',
    concentrationNote:
      'कैटलॉग का {p}% अकेले {country} से आता है। यह दिखाता है कि जिन खुले स्रोतों पर यह बना है उनमें कौन से देश दर्ज हुए — यह नहीं कि दुनिया का खाना कहाँ है।',
    growTheAtlasBody:
      'हर व्यंजन के लिए एटलस पहले इंटरनेट पर सबसे ज़्यादा प्रकाशित विधि लेता है और उसे वर्गीकृत करता है। जहाँ ऑनलाइन कुछ नहीं है, वहाँ समुदाय से आया योगदान ही रिकॉर्ड बनता है।',
    keepingItFreeBody:
      'यहाँ सब कुछ ऐसे स्रोतों से बना है जिनकी कोई क़ीमत नहीं और आगे भी नहीं होगी। एक चीज़ में पैसे लगते हैं, और जब तक उसका ख़र्च न उठाया जा सके वह बंद है।',
    meterDocumented:
      'दर्ज विधि है',
    meterDocumentedNote:
      'वह संख्या जो बताती है कि यह एटलस है या नामों की सूची। बाकी सब उसके बाद आता है।',
    meterLocated:
      'देश से नीचे के स्तर पर स्थित',
    meterLocatedNote:
      'प्रामाणिकता की भौगोलिक गहराई होती है। “कोझिकोड” एक रिकॉर्ड है; “भारत” मुश्किल से एक शुरुआत।',
    meterIllustrated:
      'तस्वीर है',
    meterIllustratedNote:
      'जिस व्यंजन की कल्पना कोई न कर सके, उससे लगाव कठिन है और पहचान और भी कठिन।',
    meterFilmed:
      'क्रमित वीडियो है',
    meterFilmedNote:
      'पकाने वाले की परंपरा से निकटता के क्रम में — खोज परिणाम के क्रम में नहीं।',
    meterAssessed:
      'प्रामाणिक के रूप में वर्गीकृत',
    meterAssessedNote:
      'प्रमाण जाँचों से अर्जित। यहाँ कम हिस्सा ईमानदारी है, असफलता नहीं।',
    supportLead:
      '{n} परंपराएँ, पूरी तरह ऐसे स्रोतों से बनी जो पढ़ने को मुफ़्त और खुली लाइसेंस वाले हैं। कोई विज्ञापन नहीं, कोई ट्रैकिंग नहीं, और कुछ भी भुगतान के पीछे नहीं। यह रहा असल ख़र्च — उन हिस्सों समेत जिनका कोई ख़र्च नहीं। आँकड़े {currency} में हैं।',
    notForSaleAuthentic:
      'पैसे देकर किसी रिकॉर्ड को प्रामाणिक नहीं बनाया जा सकता। वह प्रमाणों से आता है और उन लोगों से जो यह व्यंजन बनाते हैं।',
    notForSalePromotion:
      'किसी ने भुगतान किया, इसलिए किसी व्यंजन को बढ़ावा, ऊँची जगह या विशेष स्थान नहीं मिलता।',
    notForSaleAdvertising:
      'यहाँ कुछ भी विज्ञापन नहीं है, और किसी पाठक को ट्रैक नहीं किया जाता।',
    donationFootnote:
      'Open Collective पर खुलता है। यहाँ कुछ भी वसूला नहीं जाता — यह ऐप आपके भुगतान विवरण नहीं रखता और कभी नहीं रखेगा।',
    donationsPendingBody:
      'पैसे भेजने की कोई जगह नहीं है। जब होगी, तब वह Open Collective होगी, ताकि हर योगदान और हर ख़र्च सार्वजनिक हो और कोई भी इस पन्ने को लेखा-जोखा से मिला सके।',
    mostUsefulThing:
      'इस एटलस को कोई जो सबसे उपयोगी चीज़ दे सकता है वह पैसा नहीं है। इसका ज़्यादातर हिस्सा बस एक नाम और एक जगह है, क्योंकि किसी ने लिखा ही नहीं कि वह खाना कैसे बनता है।',
    administration:
      'प्रशासन',
    administrationNote:
      'सीमाएँ, मॉडरेशन, स्रोत जाँच और उपयोग। टोकन चाहिए।',
    interfaceTranslationNote:
      'यह इंटरफ़ेस मशीन से अनूदित है और किसी भाषा-भाषी ने इसे जाँचा नहीं है। प्रविष्टियाँ स्वयं अप्रभावित हैं। सुधार सादर आमंत्रित हैं।',
  },

  zh: {
    goBack: '返回',
    search: '搜索',
    backToShelves: '返回书架',
    seeAll: '查看全部',
    worldwide: '全世界',
    world: '世界',
    chooseCountry: '选择国家',
    nothingRecordedHere: '这里还没有记录',
    resetFilters: '重置筛选',
    recordedNotAssessed: '已记录，尚未评估',
    mostLookedUp: '查阅最多',
    wikipediaReaders: '维基百科读者',
    deepestLevelRecorded: '此处记录的最详细层级',
    searchPlaceholder: '菜肴、国家、地区、城市或食材',
    filters: '筛选',
    nothingApplied: '未应用',
    results: '结果',
    matches: '条结果',
    noMatch: '没有结果',
    authenticityLevel: '真确性等级',
    cuisine: '菜系',
    kindOfDish: '菜肴类型',
    traditionalIngredient: '传统食材',
    sortResultsBy: '结果排序方式',
    authenticityConfidence: '真确性可信度',
    atRiskFirst: '濒危优先',
    notClassified: '未分类',
    askForItInstead: '改为请求收录',
    surpriseMe: '随机看一项濒危传统',
    browseTheAtlas: '浏览世界地图集',
    clearAll: '全部清除',
    none: '无',
    video: '▶ 视频',
    iKnowHowItsMade: '我知道它怎么做 — 记录下来',
    loadingAtlas: '正在读取图谱…',
    couldNotLoad: '无法加载图谱。',
    shelfDisappearing: '正在消失',
    shelfDisappearingNote: '有来源称正在式微的传统 — 未被记录的排在前面，因为消失的正是它们。',
    shelfAuthenticated: '已认证',
    shelfAuthenticatedNote: '这些记录有真凭实据，说明它们怎么做、在哪里做。',
    shelfCookable: '今晚就能做',
    shelfCookableNote: '有书面做法的记录 — 有传统做法的用传统做法，没有的用已发表的。',
    shelfIllustrated: '值得一看',
    shelfIllustratedNote: '有照片的传统，适合浏览而非搜索。',
    foodAtlas: '美食图谱',
    howComplete: '这份图谱有多完整？',
    traditionsRecorded: '项传统已记录',
    countries: '个国家',
    atRiskTraditions: '项濒危传统',
    whereTheRecordsAre: '记录分布在哪里',
    confidence: '可信度',
    growTheAtlas: '扩充图谱',
    addATradition: '添加你家乡的一项传统',
    keepingItFree: '保持免费',
    whatItCostsToRun: '运营成本',
    anywhere: '任何地方',
    noRecord: '没有记录',
    backToTheFeed: '返回首页',
    bookmarkThis: '收藏这项传统',
    photoOriginUnverified: '照片来源未经核实',
    whyFlaggedAtRisk: '为何标记为濒危',
    openDisagreement: '尚有分歧',
    ingredientsNamedInAccount: '该记述中提到的食材',
    methodStillOpen: '做法仍未定论',
    notDocumentedYet: '尚未记录',
    recordHowItsMade: '记录它是怎么做的',
    traditionalEquipment: '传统器具',
    mostPopularVersion: '网上最流行的版本',
    watchItBeingMade: '观看制作过程',
    findPreparationVideos: '查找制作视频 ↗',
    whereTheMethodComesFrom: '做法的出处',
    alsoMadeThisWay: '也有这样做的',
    howItWorks: '运作方式',
    proposeADish: '提议一道菜',
    confirm: '确认',
    confirmAProposal: '确认一项提议',
    everyRecord: '全部记录',
    addATraditionShort: '添加一项传统',
    navExplore: '探索',
    navContribute: '参与',
    navAbout: '关于',
    theGapThatCannotBeClosed: '读书填不上的差距',
    aDocumentCannotMakeAuthentic: '文献无法让一道菜成为正宗。',
    sixThingsScoredSeparately: '六项，分别评分',
    whatClosesIt: '什么能填上',
    whatThisIsNot: '这不是什么',
    whichIsWhereYouComeIn: '而这正需要你',
    confirmADishYouKnow: '确认一道你熟悉的菜',
    proposeOneMissing: '提议一道图谱里没有的菜',
    whatItDoesNotBuy: '这笔钱买不到什么',
    contributeOnOpenCollective: '在 Open Collective 上支持',
    readTheLedger: '查看账本 — 每一笔收入与支出',
    notOpenForDonationsYet: '尚未开放捐助',
    browse: '浏览',
    startAgain: '重新开始',
    openProposals: '待确认的提议',
    whatTheseAre: '这些是什么',
    proposed: '已提议',
    seeOpenProposals: '查看待确认的提议',
    beforeYouStart: '开始之前',
    theDish: '这道菜',
    writtenTheWayYouWriteIt: '按你平常的写法',
    country: '国家',
    regionDistrictOrTown: '地区、县或城镇',
    whoMakesItAndWhen: '谁做，什么时候做',
    ingredientsOnePerLine: '食材 — 每行一项',
    howItIsMadeOnePerLine: '做法 — 每行一步',
    yourName: '你的名字',
    shownOnTheProposal: '会显示在提议上',
    yourConnectionToThePlace: '你与这个地方的关系',
    proposeThisDish: '提议这道菜',
    dishInItsOwnLanguage: '菜名，尽量用它本来的语言',
    whereIsItMadeThisWay: '哪里是这样做的？',
    whoPreparesIt: '谁来做',
    traditionalIngredientsAndEquipment: '传统食材与器具',
    publishAPhotographOnCommons: '把照片发布到 Commons',
    commonsFileNameOrLink: 'Commons 文件名或链接',
    checkWhatExistsOnline: '看看网上已经有什么',
    whatTheInternetAlreadyHas: '网上已有的内容',
    runTheEvidenceAssessment: '运行证据评估',
    evidenceAssessment: '证据评估',
    sendForCommunityValidation: '送交社区确认',
    communityValidation: '社区确认',
    ifTheyDisagree: '如果他们不同意',
    nowSendYours: '现在提交你的',
    sendThisTradition: '提交这项传统',
    submissionsNotOpenYet: '尚未开放提交',
    backToTheAtlas: '返回图谱',
    settingsTitle: '设置',
    whatThisChanges: '这会改变什么',
    administratorToken: '管理员令牌',
    tokenNotStored: '不保存 — 每次登录重新输入',
    queueThisCheck: '把这项检查排入队列',
    loadAnalytics: '加载统计',
    mostOpenedDishes: '打开最多的菜',
    mostSearchedFor: '搜索最多的',
    mostUsedShelves: '使用最多的栏目',
    screens: '页面',
    oftenTheWholePoint: '往往正是关键 — 可不填',
    grewUpInMalabar: '在马拉巴尔长大',
    whatTheseAreBody:
      '有人说存在、但图谱没有记录的菜。每一道在进入图谱之前，需要 {n} 位了解它的人确认 — 与这里其他记录一样，按同样的六个维度评判。',
    proposalsNotOpenYet:
      '提议尚未开放',
    proposalsNotOpenNote:
      '这需要一个地方来存放大家提交的内容。在有之前，应用会如实说明，而不是显示一份空列表，好像没人有话要说。',
    nothingIsWaiting:
      '没有待处理的',
    nothingIsWaitingNote:
      '每一条提议都已有结论。如果你知道图谱里没有的菜，就从这里开始。',
    loading:
      '加载中…',
    proposedBy:
      '提议者',
    beforeYouStartBody:
      '这是给图谱里没有的食物 — 通常是因为没有人写下来。不需要完整食谱。一个名字、它来自哪里，以及你与那个地方的关系，就足以让它进入确认。',
    notPublishedBySending:
      '提交并不等于发布。先由 {n} 位了解这道菜的人确认，然后它按自身证据所值进入图谱 — 和这里其他记录一样。',
    atlasMayAlreadyHaveThis:
      '图谱可能已经有了',
    duplicateNote:
      '如果其中一条就是你的菜，确认它才是推动它的方式，比再写一条更有价值。如果都不是，请继续；两道菜可以同名。',
    connectionRequiredNote:
      '必填，并且会显示。这就是它与从网上抄来的食谱之间的全部区别 — 后者图谱本来就不收。',
    proposeClosedNote:
      '这需要一个地方存放大家提交的内容，而它还没有配置。你在这里写的任何内容都不会送到任何地方，所以应用如实说明，而不是收下。',
    pantryNoMatches:
      '没有一条记录同时用到这些。试着一次用一样 — 或者提议你心里想的那道菜，如果图谱没有的话。',
    pantryPrompt:
      '写下你厨房里有什么。图谱只有大约一半记录了食材，所以这里没出现的菜，可能只是还没有人写下来。',
    requestsNotOpenNote:
      '请求尚未开放，所以一道菜进入图谱的唯一途径，是有人把它记录下来。',
    footerHolding:
      '来自 {c} 个国家的 {n} 项传统。免费阅读，没有广告，不追踪任何内容。',
    footerSources:
      '取材自维基百科、维基数据、维基共享资源、维基教科书，以及意大利的地区开放数据 — 全部可自由阅读且采用开放许可。凡带照片的记录，都注明了拍摄者。',
    atlasCoverageLine:
      '在 {c} 个国家记录了 {n} 项传统。覆盖范围如实说明：这里没有的国家，是还没有记录，而不是没有可记录的。',
    concentrationNote:
      '图谱有 {p}% 来自 {country} 一国。这反映的是哪些国家在本项目所依据的开放资料中被记录过，而不是世界的食物在哪里。',
    growTheAtlasBody:
      '每一道菜，图谱先取网上流传最广的食谱并加以分类。网上什么都没有的，社区提交的内容就成为该记录。',
    keepingItFreeBody:
      '这里的一切都建立在不花钱、且会继续不花钱的资料之上。只有一件事需要花钱，在能够支付之前它是关闭的。',
    meterDocumented:
      '有记录的做法',
    meterDocumentedNote:
      '这个数字说明这里是一份图谱还是一串名字。其余一切都次于它。',
    meterLocated:
      '定位到国家以下',
    meterLocatedNote:
      '正宗有地理上的深浅。“科泽科德”是一条记录；“印度”只是个开头。',
    meterIllustrated:
      '有照片',
    meterIllustratedNote:
      '想象不出样子的菜，难以喜欢，更难以认出。',
    meterFilmed:
      '有排序过的视频',
    meterFilmedNote:
      '按做菜的人与传统的远近排序 — 不是按搜索结果。',
    meterAssessed:
      '被判定为正宗',
    meterAssessedNote:
      '靠证据核查取得。这里比例低是诚实，不是失败。',
    supportLead:
      '{n} 项传统，全部建立在可自由阅读、采用开放许可的资料之上。没有广告，不做追踪，也没有任何内容需要付费。下面是它真正的花费，包括那些不花钱的部分。金额以 {currency} 计。',
    notForSaleAuthentic:
      '一条记录不会因为付钱而被判定为正宗。那来自证据，以及做这道菜的人。',
    notForSalePromotion:
      '不会因为有人付钱，就推广、提高排名或特别展示任何一道菜。',
    notForSaleAdvertising:
      '这里没有任何广告，也不追踪任何读者。',
    donationFootnote:
      '在 Open Collective 打开。这里不收取任何款项 — 本应用不保存你的支付信息，将来也不会。',
    donationsPendingBody:
      '目前没有可以汇款的地方。有了以后会是一个 Open Collective，让每一笔收入和支出都公开，任何人都能拿这一页对照账本。',
    mostUsefulThing:
      '能给这份图谱最有用的东西不是钱。它大部分只有一个名字和一个地方，因为没有人写下这道菜怎么做。',
    administration:
      '管理',
    administrationNote:
      '阈值、审核、来源检查与使用情况。需要令牌。',
    interfaceTranslationNote:
      '此界面由机器翻译，未经母语者校对。条目本身不受影响。欢迎指正。',
  },

  ja: {
    goBack: '戻る',
    search: '検索',
    backToShelves: '棚に戻る',
    seeAll: 'すべて見る',
    worldwide: '世界全体',
    world: '世界',
    chooseCountry: '国を選ぶ',
    nothingRecordedHere: 'ここにはまだ記録がありません',
    resetFilters: '絞り込みを解除',
    recordedNotAssessed: '記録済み、評価はまだ',
    mostLookedUp: 'よく調べられている',
    wikipediaReaders: 'ウィキペディアの読者',
    deepestLevelRecorded: 'ここに記録された最も詳しい階層',
    searchPlaceholder: '料理、国、地方、都市、食材',
    filters: '絞り込み',
    nothingApplied: '未設定',
    results: '結果',
    matches: '件',
    noMatch: '該当なし',
    authenticityLevel: '真正性のレベル',
    cuisine: '料理の系統',
    kindOfDish: '料理の種類',
    traditionalIngredient: '伝統的な食材',
    sortResultsBy: '並び替え',
    authenticityConfidence: '真正性の確度',
    atRiskFirst: '消えかけているものから',
    notClassified: '未分類',
    askForItInstead: '代わりに収録を依頼する',
    surpriseMe: '消えかけている伝統をひとつ見せて',
    browseTheAtlas: '世界の地図帳を見る',
    clearAll: 'すべて解除',
    none: 'なし',
    video: '▶ 動画',
    iKnowHowItsMade: '作り方を知っています — 記録する',
    loadingAtlas: 'アトラスを読み込み中…',
    couldNotLoad: 'アトラスを読み込めませんでした。',
    shelfDisappearing: '失われつつある',
    shelfDisappearingNote: '衰退していると資料が伝える伝統 — 記録のないものから。失われるのはそれらだからです。',
    shelfAuthenticated: '認証済み',
    shelfAuthenticatedNote: 'どこでどう作られるかの確かな裏づけがある記録。',
    shelfCookable: '今夜つくれます',
    shelfCookableNote: '作り方が書かれた記録 — 伝統的なものがあればそれを、なければ公表されたものを。',
    shelfIllustrated: '見る価値あり',
    shelfIllustratedNote: '写真のある伝統。探すためではなく、眺めるために。',
    foodAtlas: '食のアトラス',
    howComplete: 'このアトラスはどこまで揃っているか',
    traditionsRecorded: '件の伝統を記録',
    countries: 'か国',
    atRiskTraditions: '件の危機にある伝統',
    whereTheRecordsAre: '記録の分布',
    confidence: '確かさ',
    growTheAtlas: 'アトラスを育てる',
    addATradition: 'あなたの土地の伝統を加える',
    keepingItFree: '無料であり続けるために',
    whatItCostsToRun: '運営にかかる費用',
    anywhere: 'どこでも',
    noRecord: '記録なし',
    backToTheFeed: 'ホームに戻る',
    bookmarkThis: 'この伝統を保存',
    photoOriginUnverified: '写真の出所は未確認',
    whyFlaggedAtRisk: '危機とされる理由',
    openDisagreement: '未解決の相違',
    ingredientsNamedInAccount: 'その記述にある材料',
    methodStillOpen: '作り方はまだ定まっていません',
    notDocumentedYet: 'まだ記録されていません',
    recordHowItsMade: '作り方を記録する',
    traditionalEquipment: '伝統的な道具',
    mostPopularVersion: 'ネット上で最も多い版',
    watchItBeingMade: '作るところを見る',
    findPreparationVideos: '作り方の動画を探す ↗',
    whereTheMethodComesFrom: '作り方の出どころ',
    alsoMadeThisWay: 'こうも作られます',
    howItWorks: 'しくみ',
    proposeADish: '料理を提案する',
    confirm: '確認する',
    confirmAProposal: '提案を確認する',
    everyRecord: 'すべての記録',
    addATraditionShort: '伝統を加える',
    navExplore: '見てまわる',
    navContribute: '参加する',
    navAbout: 'このサイトについて',
    theGapThatCannotBeClosed: '読んでも埋まらない差',
    aDocumentCannotMakeAuthentic: '文献が料理を本物にすることはできません。',
    sixThingsScoredSeparately: '六つの項目を別々に採点',
    whatClosesIt: '何がそれを埋めるか',
    whatThisIsNot: 'これは何ではないか',
    whichIsWhereYouComeIn: 'そこであなたの出番です',
    confirmADishYouKnow: '知っている料理を確認する',
    proposeOneMissing: 'アトラスにない料理を提案する',
    whatItDoesNotBuy: 'それで買えないもの',
    contributeOnOpenCollective: 'Open Collective で支援する',
    readTheLedger: '会計を見る — すべての寄付と支出',
    notOpenForDonationsYet: '寄付はまだ受け付けていません',
    browse: '見てまわる',
    startAgain: 'やり直す',
    openProposals: '確認待ちの提案',
    whatTheseAre: 'これは何か',
    proposed: '提案済み',
    seeOpenProposals: '確認待ちの提案を見る',
    beforeYouStart: 'はじめる前に',
    theDish: 'その料理',
    writtenTheWayYouWriteIt: 'あなたの書き方のままで',
    country: '国',
    regionDistrictOrTown: '地方・郡・町',
    whoMakesItAndWhen: '誰が、いつ作るか',
    ingredientsOnePerLine: '材料 — 一行に一つ',
    howItIsMadeOnePerLine: '作り方 — 一行に一手順',
    yourName: 'お名前',
    shownOnTheProposal: '提案に表示されます',
    yourConnectionToThePlace: 'その土地とのつながり',
    proposeThisDish: 'この料理を提案する',
    dishInItsOwnLanguage: '料理名。できればその土地の言語で',
    whereIsItMadeThisWay: 'この作り方はどこのものですか',
    whoPreparesIt: '誰が作るか',
    traditionalIngredientsAndEquipment: '伝統的な材料と道具',
    publishAPhotographOnCommons: 'Commons に写真を公開する',
    commonsFileNameOrLink: 'Commons のファイル名またはリンク',
    checkWhatExistsOnline: 'ネット上に既にあるものを見る',
    whatTheInternetAlreadyHas: 'ネット上に既にあるもの',
    runTheEvidenceAssessment: '根拠の評価を実行する',
    evidenceAssessment: '根拠の評価',
    sendForCommunityValidation: '地域の確認に送る',
    communityValidation: '地域による確認',
    ifTheyDisagree: '意見が食い違う場合',
    nowSendYours: 'あなたのものを送ってください',
    sendThisTradition: 'この伝統を送る',
    submissionsNotOpenYet: '受付はまだ始まっていません',
    backToTheAtlas: 'アトラスに戻る',
    settingsTitle: '設定',
    whatThisChanges: 'これが変えるもの',
    administratorToken: '管理者トークン',
    tokenNotStored: '保存されません — 毎回入力します',
    queueThisCheck: 'この確認を順番に入れる',
    loadAnalytics: '統計を読み込む',
    mostOpenedDishes: 'よく開かれた料理',
    mostSearchedFor: 'よく検索された語',
    mostUsedShelves: 'よく使われた棚',
    screens: '画面',
    oftenTheWholePoint: 'ここが肝心なことも — 任意',
    grewUpInMalabar: 'マラバールで育ちました',
    whatTheseAreBody:
      '存在すると言われながら、アトラスに記録のない料理です。アトラスに入るには、それを知る人による確認が {n} 件必要で、ほかのすべての記録と同じ六つの観点で判断されます。',
    proposalsNotOpenYet:
      '提案はまだ受け付けていません',
    proposalsNotOpenNote:
      '送られたものを保管する場所が必要です。それができるまでは、誰も付け加えるものがないかのように空の一覧を見せるのではなく、その旨をお伝えします。',
    nothingIsWaiting:
      '待っているものはありません',
    nothingIsWaitingNote:
      'すべての提案に結論が出ています。アトラスにない料理をご存じなら、ここから始まります。',
    loading:
      '読み込み中…',
    proposedBy:
      '提案者',
    beforeYouStartBody:
      'これはアトラスにない食べもののためのものです — たいていは誰も書き留めなかったからです。完全なレシピは要りません。名前、どこのものか、そしてその土地とのつながりがあれば、確認に開くには十分です。',
    notPublishedBySending:
      '送っても公開はされません。まずその料理を知る {n} 人が確認し、根拠に見合っただけの評価でアトラスに入ります — ほかのすべての記録と同じです。',
    atlasMayAlreadyHaveThis:
      'アトラスにすでにあるかもしれません',
    duplicateNote:
      'このうちのどれかがあなたの料理なら、確認することがそれを前に進めます。二つ目の記録より価値があります。どれでもなければ、そのまま進めてください。同じ名前の料理は二つあり得ます。',
    connectionRequiredNote:
      '必須で、表示されます。これがインターネットから写したレシピとの違いのすべてです — アトラスがそもそも受け取らないものです。',
    proposeClosedNote:
      '送られたものを保管する場所が必要ですが、用意されていません。ここに書いたものはどこにも届かないので、受け取るのではなく、その旨をお伝えしています。',
    pantryNoMatches:
      '記録のどれもこれらを一緒には使っていません。ひとつずつ試すか、思い浮かべた料理がアトラスになければ提案してください。',
    pantryPrompt:
      '台所にあるものを書いてください。材料が記録されているのはアトラスの半分ほどなので、ここに出てこない料理は、まだ誰も書き留めていないだけかもしれません。',
    requestsNotOpenNote:
      'リクエストはまだ受け付けていないため、料理がアトラスに入る道は、誰かが記録することだけです。',
    footerHolding:
      '{c} か国の {n} 件の伝統。読むのは無料、広告なし、何も追跡しません。',
    footerSources:
      'ウィキペディア、ウィキデータ、ウィキメディア・コモンズ、ウィキブックス、そしてイタリアの地域オープンデータから構築 — いずれも自由に読め、オープンライセンスです。写真のある記録には、すべて撮影者を明記しています。',
    atlasCoverageLine:
      '{c} か国で {n} 件の伝統を記録。網羅の度合いは正直に述べます。ここにない国は、まだ記録がないという意味であり、記録するものがないという意味ではありません。',
    concentrationNote:
      '目録の {p}% が {country} 一国からのものです。これは、もとにした公開資料でどの国が記録されてきたかを示すもので、世界の食べものがどこにあるかを示すものではありません。',
    growTheAtlasBody:
      'それぞれの料理について、アトラスはまずネット上で最も多く公開されているレシピを取り、分類します。ネットに何もない場合は、地域からの投稿がその記録になります。',
    keepingItFreeBody:
      'ここにあるものはすべて、費用がかからず今後もかからない資料から作られています。ひとつだけ費用のかかるものがあり、支払えるようになるまで止めてあります。',
    meterDocumented:
      '作り方の記録がある',
    meterDocumentedNote:
      'ここがアトラスか、ただの名前の一覧かを決める数字です。ほかはすべてその次です。',
    meterLocated:
      '国より下の地域まで特定',
    meterLocatedNote:
      '本物さには地理的な深さがあります。「コーリコード」は記録であり、「インド」はまだ入口です。',
    meterIllustrated:
      '写真がある',
    meterIllustratedNote:
      '姿を思い浮かべられない料理は、好きになりにくく、見分けるのはもっと難しい。',
    meterFilmed:
      '順位づけされた動画がある',
    meterFilmedNote:
      '作り手が伝統にどれだけ近いかで並べています — 検索結果の順ではありません。',
    meterAssessed:
      '本物と分類',
    meterAssessedNote:
      '根拠の確認を経て得られます。ここの割合が低いのは正直さであって、失敗ではありません。',
    supportLead:
      '{n} 件の伝統。すべて、自由に読めてオープンライセンスの資料から作られています。広告なし、追跡なし、有料の壁もありません。以下が実際にかかる費用です — かからない部分も含めて。金額は {currency} です。',
    notForSaleAuthentic:
      'お金を払って記録を「本物」にすることはできません。それは根拠と、その料理を作る人たちから来ます。',
    notForSalePromotion:
      '誰かが払ったからという理由で、料理が宣伝されたり、順位を上げられたり、特集されたりすることはありません。',
    notForSaleAdvertising:
      'ここに広告はありません。読む人が追跡されることもありません。',
    donationFootnote:
      'Open Collective で開きます。ここでは何も受け取りません — このアプリはあなたの支払い情報を保持しませんし、今後も保持しません。',
    donationsPendingBody:
      'お金を送る先がありません。できたときには Open Collective にします。寄付も支出もすべて公開され、誰でもこのページを帳簿と突き合わせられるように。',
    mostUsefulThing:
      'このアトラスに差し出せるいちばん役に立つものは、お金ではありません。その大半は名前と場所だけです。誰もその料理の作り方を書き留めなかったからです。',
    administration:
      '管理',
    administrationNote:
      'しきい値、モデレーション、出典の確認、利用状況。トークンが必要です。',
    interfaceTranslationNote:
      'この画面表示は機械翻訳で、話者による確認を経ていません。記録そのものには影響しません。訂正を歓迎します。',
  },
};

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
      '{n} tradiciones, construidas por completo con fuentes libres de leer y con licencia abierta. Sin publicidad, sin rastreo y nada tras un pago. Lo que cuesta mantenerlo lo cubre esa elección de fuentes, no que alguien pague por estar aquí.',
    notForSaleAuthentic:
      'Un registro no puede volverse Auténtico pagando. Eso viene de las pruebas y de las personas que cocinan el plato.',
    notForSalePromotion:
      'Ningún plato se promociona, se sitúa más arriba ni se destaca porque alguien haya pagado.',
    notForSaleAdvertising:
      'Aquí no hay publicidad, y no se rastrea a ningún lector.',
    donationFootnote:
      'Se abre en Open Collective. Aquí no se cobra nada: esta app no guarda datos de pago tuyos y nunca lo hará.',
    donationsPendingBody:
      'Todavía no hay adónde enviar dinero. Nada del atlas depende de que lo haya: está construido con fuentes libres de leer, y eso no cambia.',
    mostUsefulThing:
      'Lo más útil que alguien puede dar a este atlas no es dinero. La mayor parte es un nombre y un lugar porque nadie ha escrito cómo se hace la comida.',
    administration:
      'Administración',
    administrationNote:
      'Umbrales, moderación, comprobación de fuentes y uso. Requiere un token.',
    howLead:
      'Esa es la regla sobre la que está construido este atlas, y es aritmética, no una política, lo que significa que puedes comprobarla en vez de confiar en ella.',
    sixDimensionsBody:
      'Cada registro se puntúa en las mismas seis dimensiones, y las seis se imprimen en el propio registro. La puntuación es su media, así que quien dude puede sumar las cifras.',
    ceilingBody:
      'Tres de esas seis no puede responderlas ningún documento jamás escrito. Ninguna enciclopedia sabe si un método es el método de un lugar; ningún registro es una persona del pueblo. Con esas tres vacías, lo máximo que un registro puede puntuar solo con fuentes publicadas es {ceiling}.',
    thresholdBody:
      'Un registro se llama Auténtico a partir de {threshold}. La distancia entre esas dos cifras es deliberada, y es todo el argumento: solo pueden cerrarla quienes conocen el plato.',
    whatClosesItBody:
      '{n} confirmaciones de personas que declaran su vínculo con el lugar, y que dicen qué están confirmando, no solo que lo aprueban. Ambas cosas se muestran en el registro, porque una frase como “nací en Kozhikode: usamos ghee, no aceite” es una prueba que se puede sopesar, y “{n} confirmaciones” es un número en el que hay que confiar.',
    accountsBody:
      'Esas {n} tienen que ser {n} personas distintas, así que una confirmación cuenta para la insignia solo si la persona había iniciado sesión. Una anónima se registra igual y se muestra igual en el registro — lo que alguien sabe vale la pena tenerlo, tenga cuenta o no — simplemente no mueve el número. Leer el atlas nunca exige iniciar sesión.',
    whichIsWhereYouComeInBody:
      'La mayor parte del atlas no tiene a nadie que hable por ella. Si sabes cómo se hace un plato donde tú eres, eso es lo único que ninguna fuente puede aportar y ningún rastreo puede alcanzar.',
    notRatings:
      'Sin valoraciones. Nadie puntúa un plato sobre cinco.',
    notComments:
      'Sin comentarios y sin muro. Aquí no hay nada con lo que interactuar.',
    notAlgorithm:
      'Ningún algoritmo decide lo que ves. El orden son las pruebas, y puedes cambiarlo.',
    notAdvertising:
      'Sin publicidad, y ningún lector es rastreado.',
    notPopularity:
      'La popularidad se registra y se mantiene aparte. La versión más publicada de un plato nunca se convierte en la auténtica.',
    dimensionOrigin:
      'De dónde es el plato, y con cuánta precisión. Un pueblo vale más que un país.',
    dimensionIngredients:
      'De qué está hecho, tal como lo hace la tradición.',
    dimensionTechnique:
      'Cómo se hace: no que alguien publicara una receta, sino que este es el método del lugar.',
    dimensionLocalSource:
      'Alguien con un vínculo declarado con el lugar ha hablado por él.',
    dimensionDocumentation:
      'Un registro, una inscripción o una enciclopedia lo ha recogido.',
    dimensionCommunity:
      'Gente del lugar lo ha confirmado, y ha dicho qué confirma.',
    fromDocuments:
      'los documentos pueden',
    fromPeople:
      'solo las personas',
    contributeLead:
      'Regístralo tal como se hace donde tú estás. Nada se publica solo con este formulario: primero pasa por la evaluación y por la validación de la comunidad.',
    writeItTheWayYouWriteIt:
      'Escribe el nombre de la comida como tú lo escribes',
    editorialRuleBody:
      'Corrige nuestra redacción con libertad: ortografía, gramática, cualquier cosa que se lea mal. No arregles la comida en sí. El nombre de un plato, un ingrediente, un utensilio y un lugar se quedan exactamente como los escribe la gente que lo cocina, con sus tildes y todo. Si dos grafías no coinciden, eso suele ser dos comunidades y no un error, y se conservan las dos.',
    photographTitle:
      'Una fotografía, si tienes alguna',
    photographBody:
      'Publica tu propia fotografía en Wikimedia Commons y luego pega aquí su nombre de archivo. Sigue siendo tuya, se te acredita en todas partes donde aparezca, y no nos cuesta nada ni a ti ni a nosotros. No podemos tomar una de Instagram o TikTok: allí la fotografía es propiedad intelectual de su autor, y una línea de crédito no es un permiso.',
    walkthroughNoteBody:
      'Lo que sigue es un ejemplo resuelto de lo que le ocurre a un envío: los hallazgos, las comprobaciones y la puntuación provisional de abajo son de un registro que ya está en el atlas, no de lo que acabas de escribir. Tu entrada no se evalúa aquí; la evalúan personas, después de enviarla.',
    examplePreparedBy:
      'Hogares de Malabar, preparado para el iftar y para ocasiones familiares',
    exampleConnection:
      'Nacido y cocinando en Kozhikode',
    exampleIngredients:
      'Plátano nendran maduro, huevos, ghee, azúcar, anacardos, pasas; cocinado en una sartén gruesa a fuego bajo de carbón o de gas, tapado con una tapa cargada con brasas',
    shelfFromCountry:
      'De {country}',
    shelfFromCountryNote:
      'Lo que el atlas tiene de {country}. Que aquí sea exacto vale más para ti que en ningún otro sitio: tú puedes saber si está bien.',
    sending:
      'Enviando…',
    missionHeadline:
      'Cada plato de aquí muestra sus pruebas.',
    missionStakes:
      'De dónde viene, quién lo dice y cuánto se ha establecido realmente: impreso en cada registro, y comprobable por cualquiera que lo dude.',
    statDishes:
      'platos',
    statCountries:
      'países',
    statDocumented:
      'documentados',
    statRegistered:
      'registrados',
    statAuthentic:
      'auténticos',
    missionAsk:
      '{n} de estos no tienen ningún método registrado. {people} personas de un lugar pueden arreglar uno para siempre.',
    missionAskBody:
      'Nadie ha dejado escrito cómo se hacen: ni en inglés, ni en ningún idioma, en ningún sitio al que llegue una máquina. Ningún archivo, ninguna enciclopedia y nada automático puede autenticarlos en su lugar; eso es aritmética de la puntuación, no una política. Si tú lo cocinas, eres la única persona que puede.',
    recordADishYouKnow:
      'Registra un plato que conozcas',
    howItGetsAuthenticated:
      'Cómo se autentica',
    submissionsNotOpen:
      'Los envíos aún no están abiertos: no hay adónde mandarlos. La ruta de arriba explica qué pasará cuando lo estén.',
    freeAndStayingFree:
      'Gratis, y seguirá siéndolo. Sin publicidad, sin rastreo, sin dinero de por medio. Solo hace falta una cuenta para confirmar un plato, nunca para leer uno.',
    noRatingsNoComments:
      'Sin valoraciones, sin comentarios y sin ningún algoritmo que decida lo que ves: las listas encabezan por pruebas, no por popularidad. Las aperturas se cuentan como un plato y una fecha, nunca como una persona.',
    whyASourceCannot:
      'Por qué una fuente no puede autenticar un plato',
    whyASourceCannotBody:
      'La documentación publicada no puede pasar de {ceiling} aquí, y un registro se vuelve Auténtico a partir de {threshold}. Esa distancia solo pueden cerrarla personas vinculadas al lugar. Las seis cifras que hay detrás de cada puntuación están impresas en el registro, así que quien dude del número puede sumarlo.',
    whyTheAtlasStops:
      'Es también por lo que el atlas se detiene donde se detiene. Se han leído todas las fuentes libres — enciclopedias, recetarios, registros de patrimonio, nomenclátores — y {n} registros siguen sin nada anotado sobre cómo se hacen. Lo que queda nunca se escribió.',
    levelLocal:
      'Auténtico — Local',
    levelLocalFull:
      'Auténtico — Local/Tradicional',
    levelRegional:
      'Auténtico — Regional',
    levelVariation:
      'Variación tradicional',
    levelAdaptation:
      'Adaptación moderna',
    levelFusion:
      'Fusión',
    levelUnverified:
      'Sin verificar',
    levelUnverifiedFull:
      'Sin verificar — pruebas insuficientes',
    filterAuthenticOnly:
      'Solo auténticos',
    filterTraditionalVariations:
      'Variaciones tradicionales',
    filterModernAdaptations:
      'Adaptaciones modernas',
    filterFusion:
      'Fusión',
    filterUnverified:
      'Sin verificar',
    filterAll:
      'Todos',
    geoCountry:
      'país',
    geoRegion:
      'región',
    geoProvince:
      'provincia o distrito',
    geoCity:
      'ciudad o pueblo',
    geoVillage:
      'aldea o comunidad',
    chooseRegion:
      'Elige una región',
    chooseProvince:
      'Elige una provincia o distrito',
    chooseCity:
      'Elige una ciudad o pueblo',
    chooseVillage:
      'Elige una aldea o comunidad',
    typeToSearchLevel:
      'Escribe para buscar…',
    browseAllTraditions:
      'Ver las {n} tradiciones',
    geoPlace:
      'lugar',
    noLevelRecorded:
      'Todavía no hay ningún {level} registrado con ese nombre. Que no esté aquí significa que no hay registro, no que no haya comida.',
    browseCuisine:
      'cocina de {cuisine}',
    browseMadeWith:
      'hecho con {ingredient}',
    browseEverything:
      'Todo',
    within:
      'Dentro de {path}',
    chooseCountryHint:
      'Elige un país · {c} registrados',
    chooseCountryHintBroader:
      'Elige un país · {c} registrados, y {b} orígenes más amplios',
    noRecordUnderThatReference:
      'No hay nada registrado en el atlas con esa referencia. Que falte aquí significa que no hay registro, no que no haya comida.',
    tagTraditionalPreparation:
      '🏺 Preparación tradicional',
    tagAtRiskTradition:
      '🕯️ Tradición en riesgo',
    notEligibleForAuthentic:
      'No puede optar a la clasificación de auténtico',
    lookingForWhatItBorrows:
      '¿Buscas la tradición de la que toma prestado?',
    howItsDescribed:
      'Cómo se describe',
    howItsMade:
      'Cómo se hace',
    originAndAttribution:
      'Origen y atribución cultural',
    nobodyRecordedTechnique:
      'Nadie ha registrado la técnica: los tiempos, el recipiente, el orden en que ocurren las cosas. Eso es lo que sacaría a este registro de Sin verificar, y hace falta alguien que lo cocine.',
    nobodyHasRecorded:
      'Nadie ha registrado cómo se hace {dish}{place}. Podríamos copiar la receta más publicada de internet y llamarla auténtica, pero eso es justo lo que este atlas existe para no hacer, así que el registro se queda como está hasta que alguien que lo cocine lo complete. Si lo haces tú, serías la primera persona en escribirlo.',
    ifIngredientUnavailable:
      'Si el ingrediente tradicional no está disponible',
    commonModernSubstitute:
      'Sustituto moderno habitual: ',
    adaptationNotAuthentic:
      'Esto es una adaptación y no debe considerarse la preparación auténtica.',
    whatTheInternetServes:
      'Lo que internet sirve mayoritariamente para este plato, y en qué se aparta de la tradición de arriba.',
    popularNotAuthentic:
      'Popular, pero no es la preparación auténtica. La versión de arriba sigue siendo la referencia.',
    videosRankedByCloseness:
      'Vídeos reales, ordenados por lo cerca que está quien cocina de la tradición, no por número de visitas.',
    stillFramesFromVideos:
      'Los fotogramas se toman de los propios vídeos, así que el plato que ves es el plato que hizo esa persona.',
    noVideoRecordedYet:
      'Todavía no se ha registrado ningún vídeo de la tradición para este plato.',
    findOneFromThePlace:
      'Si encuentras uno hecho por alguien del lugar, se puede añadir desde Añadir una tradición: eso es lo que le daría a este plato un vídeo ordenado.',
    siblingsNeitherIsReal:
      'El mismo plato, registrado aparte allí donde se hace de otra manera. Ninguno es el verdadero.',
    doYouKnow:
      '¿Conoces {subject}?',
    confirmWhatYouKnow:
      'Confirma lo que sabes de verdad. No tienes que responder por todo el registro: una cosa concreta de alguien que lo cocina vale más que un acuerdo general.',
    recordedThankYou:
      'Registrado. Gracias.',
    shownWithYourConnection:
      'Se muestra en el registro con tu vínculo al lado, para que quien lea pueda valorarlo por sí mismo.',
    signedInCounts:
      'Sesión iniciada: esto contará para la insignia.',
    notSignedInNote:
      'Sin sesión iniciada. Lo que escribas se mostrará en el registro con tu vínculo, y no moverá la insignia: esa cuenta solo sube con personas que han iniciado sesión, para que una persona no pueda ser tres.',
    signInSoItCounts:
      'Inicia sesión para que cuente',
    shownOnTheRecord:
      'Se muestra en el registro',
    whatCanYouConfirm:
      '¿Qué puedes confirmar?',
    exampleSaid:
      'Usamos ghee, no aceite, y se hace en Eid, no todo el año.',
    fromTheTownItself:
      'Soy del pueblo o la aldea en sí, no solo de la región más amplia',
    fromTheTownItselfLabel:
      'Soy del pueblo o la aldea en sí, no de la región más amplia',
    exampleWhoMakesIt:
      'Se hace en casa para Eid, por las abuelas — opcional',
    exampleIngredientLines:
      'plátano maduro\nhuevo\nghee',
    exampleMethodLines:
      'Machaca el plátano.\nIncorpora el huevo batido.',
    inPlace:
      ' en {place}',
    tagAtRiskShort:
      '🕯️ En riesgo',
    readThisIn:
      'Léelo en',
    communityTranslation:
      'Traducción de la comunidad',
    machineTranslation:
      'Traducción automática — todavía sin revisar por nadie de la comunidad',
    notTranslatedYet:
      'Sin traducir todavía',
    aDotMarks:
      'Un punto marca un idioma al que ya se ha traducido este registro.',
    opensOnceMoreRecords:
      '{language} se abrirá cuando {n} registros más se puedan leer en ese idioma.',
    noTranslationService:
      'No hay ningún servicio de traducción conectado a esta versión, así que nada se puede traducir automáticamente. De todos modos, la traducción de alguien que cocina este plato vale más: se puede aportar desde Añadir una tradición.',
    whatTheseTermsMean:
      'Qué significan estos términos',
    signedIn:
      'Sesión iniciada',
    signOut:
      'Cerrar sesión',
    signedInSignOut:
      'Sesión iniciada. Cerrar sesión.',
    confirmationsCount:
      'Tus confirmaciones cuentan para la insignia.',
    signIn:
      'Iniciar sesión',
    signInSoConfirmationsCount:
      'Inicia sesión para que tus confirmaciones cuenten',
    onlySignedInMovesBadge:
      'Solo las confirmaciones con sesión iniciada mueven una insignia.',
    watchAtSource:
      'Ver en el origen ↗',
    originalAudio:
      'Audio original',
    creatorsOwnTranslation:
      'Traducción del propio autor',
    translatedCaptions:
      'Subtítulos traducidos',
    languageUnknown:
      'Idioma desconocido',
    ingredientsInThisVideo:
      'Ingredientes usados en este vídeo',
    weDontInventOne:
      'Quien hizo este vídeo no publicó lista de ingredientes ni método escrito, y nosotros no lo inventamos. El método tradicional de arriba viene de las fuentes documentadas de abajo.',
    captureFromVideo:
      'Recoge los ingredientes y los pasos de este vídeo →',
    dietaryPreference:
      'Preferencia alimentaria',
    narrowItDown:
      'Afina la búsqueda',
    anyDiet:
      'Cualquier dieta',
    whenItsEaten:
      'Cuándo se come',
    anyOccasion:
      'Cualquier ocasión',
    alsoCalled:
      'También llamado',
    notATranslationOfOurs:
      'Cada uno es el nombre que usa el artículo enciclopédico en ese idioma: no es una traducción nuestra, y nunca sustituye al nombre de arriba. Toca uno para leerlo allí.',
    relatedTraditions:
      'Tradiciones relacionadas',
    relatedTraditionsNote:
      'Registros que comparten con este un lugar, una tradición o un ingrediente. Cada uno dice cuál.',
    scoreCannotSettle:
      'Una estimación de la solidez de las pruebas, no una afirmación de que una puntuación pueda zanjar la verdad cultural.',
    notScored:
      'Sin puntuar',
    navAtlasNote:
      'Qué está cubierto y con cuánta confianza',
    navProposeNote:
      'Comida de la que el atlas no tiene registro',
    navConfirmNote:
      'Platos que esperan a alguien que los conozca',
    navSupportNote:
      'Lo que cuesta mantenerlo y quién lo paga',
    confirmPrompt:
      '¿Se hace así de donde tú eres?',
    confirmAskBody:
      'Si cocinas esto donde nació, confirmarlo o corregirlo es lo que saca un registro de Sin verificar. Cuando tu versión sea distinta, se registra al lado — no en lugar — de esta.',
    confirmYes:
      'Sí, coincide',
    confirmNo:
      'Donde yo soy se hace de otra manera',
    confirmPlacePrompt:
      '¿Este plato es de donde decimos que es?',
    confirmPlaceBody:
      'Nadie ha escrito cómo se hace este, así que todavía no hay nada con lo que estar de acuerdo. El lugar es lo que este registro afirma, y eso ya merece confirmarse por sí solo: es una de las seis comprobaciones de prueba.',
    confirmPlaceYes:
      'Sí, es de aquí',
    confirmPlaceNo:
      'No, es de otro sitio',
    standingMet:
      '{n} personas vinculadas a {place} lo han confirmado: la cifra que exige la insignia.',
    standingNobody:
      'Todavía nadie',
    standingOne:
      'Hasta ahora una persona',
    standingMany:
      'Hasta ahora {n} personas',
    standingNeed:
      '{soFar}. La insignia exige {need}, así que {people} vinculadas a {place} cumplirían el requisito.',
    onePersonMore:
      'una persona más',
    morePeople:
      '{n} personas más',
    contestedNote:
      'Archivado aquí para poder navegar. {n} lugares tienen una reivindicación documentada de este plato: ninguna está zanjada, y todas se enumeran abajo.',
    relatedAlsoFrom:
      'También de {place}',
    relatedAlsoCuisine:
      'También {cuisine}',
    relatedSharesIngredients:
      'Comparte {n} ingredientes',
    relatedAlsoUses:
      'También usa {ingredient}',
    relatedAlsoCategory:
      'También {category}',
    authenticVersion:
      'Versión auténtica',
    thePublishedRecipe:
      'La receta publicada',
    whyThisIsAnAdaptation:
      'Por qué esto es una adaptación',
    whyConsideredAuthentic:
      '¿Por qué se considera auténtico?',
    whatThisRecordIs:
      'Qué es este registro',
    stepSubmit:
      'Enviar',
    stepWhatExists:
      'Qué existe',
    stepAssessment:
      'Evaluación',
    stepValidation:
      'Validación',
    findingAggregatorTitle:
      'Página agregadora de recetas',
    findingAggregatorTag:
      'Candidata popular',
    findingAggregatorNote:
      'Resultado mejor posicionado. Quien lo firma no declara vínculo con Malabar; usa mantequilla en lugar de ghee.',
    findingVideoTitle:
      'Vídeo de un canal de cocina en malayalam',
    findingVideoTag:
      'Fuente local',
    findingVideoNote:
      'Grabado en Kerala, hablado en malayalam, con ghee y plátano nendran tal como se describe.',
    findingGapTitle:
      'Sin registro a nivel de localidad',
    findingGapTag:
      'Vacío',
    findingGapNote:
      'Nada documenta cómo se hace concretamente en Kozhikode. Este envío sería el primero.',
    checkOriginLabel:
      'Origen geográfico',
    checkOriginNote:
      'Malabar, Kozhikode: declarado por quien lo envía y coherente con la fuente en vídeo.',
    checkLocalPrepLabel:
      'Preparación local',
    checkLocalPrepNote:
      'Descrito como cocina doméstica para el iftar y para ocasiones familiares.',
    checkIngredientsLabel:
      'Ingredientes tradicionales',
    checkIngredientsNote:
      'Plátano nendran, huevos, ghee: coincide con el vídeo de fuente local.',
    checkTechniqueLabel:
      'Técnica tradicional',
    checkTechniqueNote:
      'Fuego bajo, tapa cargada con brasas.',
    checkDocumentationLabel:
      'Documentación histórica o cultural',
    checkDocumentationNote:
      'Escasa. No se ha localizado estudio ni registro de archivo.',
    checkLocalSourceLabel:
      'Fuente local',
    checkLocalSourceNote:
      'Quien lo envía dice haber nacido y cocinar en Kozhikode.',
    checkCommunityLabel:
      'Validación de la comunidad',
    checkCommunityNote:
      'Todavía no solicitada. Por eso el registro aún no puede llamarse auténtico.',
    validatorHomeCook:
      'Cocinera de casa, Kozhikode',
    validatorHomeCookSaid:
      'Confirmó los ingredientes y el método de las brasas sobre la tapa.',
    validatorBakery:
      'Dueño de una pastelería, Thalassery',
    validatorBakerySaid:
      'Confirma, y señala que su versión lleva menos azúcar.',
    validatorWriter:
      'Periodista gastronómica, Kerala',
    validatorWriterSaid:
      'Confirmado como plato doméstico de Malabar; la documentación es realmente escasa.',
    validatorPending:
      'Dos revisores más invitados',
    validatorPendingSaid:
      'A la espera de respuesta: el registro se publica sin ellos.',
    photoCheckedNote:
      'Se comprueba contra Commons cuando se envía el registro, y se muestra con su autoría y su licencia. Sigue Sin verificar hasta que la comunidad lo confirme, igual que el método.',
    mostPublishedNote:
      'La versión más publicada se toma como candidata popular. No se convierte en el registro auténtico.',
    sevenChecksNote:
      'Siete comprobaciones, cada una respondida o dejada abierta. Las abiertas bajan la confianza; nunca se rellenan por suposición.',
    draftConfidence:
      '/100 de confianza provisional',
    unverifiedPendingTag:
      '⚪ Sin verificar — pendiente de validación de la comunidad',
    oneSubmitterNote:
      'Una sola persona del lugar es una prueba, no una demostración. El registro sigue Sin verificar hasta que lo confirme gente de la comunidad.',
    threeConfirmationsNote:
      'Tres confirmaciones de personas que viven o cocinan en el lugar sacan un registro de Sin verificar.',
    conflictingAccountsNote:
      'Los relatos que no coinciden se conservan los dos. El registro se divide en las tradiciones que la gente describió realmente — una por región o comunidad — y no se declara verdadera ninguna versión.',
    nowhereToSendNote:
      'No hay adónde mandar esto. El atlas ya ha leído todo lo que tienen las fuentes libres, así que lo que falta ahora es comida que nadie ha escrito — lo que significa que este formulario es como crece, y se activará en cuanto haya un sitio al que enviarlo.',
    whereTheExampleEndsUp:
      'Ahí es donde acaba el registro de ejemplo: publicado con sus pruebas a la vista, sus comprobaciones abiertas nombradas y cada afirmación rastreable hasta quien la dijo.',
    confirmedBy:
      'Confirmado por',
    nothingMatchesAll:
      'Nada coincide con todo esto a la vez.',
    mostOfYourListFirst:
      'Primero lo que más coincide con tu lista',
    translatesTheAppsWords:
      'Traduce las palabras de la propia aplicación. Los platos siguen en el idioma en que se registraron: cada registro tiene sus propios controles de traducción.',
    byNameAndPlaceOnly:
      'Estos están en el atlas solo por nombre y lugar. Nadie ha documentado cómo se hacen, así que no llevan método ni puntuación.',
    wikipediaViewsNote:
      'Cuánta gente leyó sobre cada plato en la Wikipedia en inglés durante el último año. Eso es interés, no autenticidad, y tampoco indica cuánto se come un plato: favorece lo que buscan los angloparlantes. Entra en cada uno para ver su clasificación.',
    requiredDishName:
      'el nombre del plato',
    requiredCountry:
      'el país',
    requiredYourName:
      'tu nombre',
    requiredYourConnection:
      'tu vínculo con el lugar',
    requiredWhatYouConfirm:
      'qué puedes confirmar',
    bandNotScored:
      'Sin puntuar',
    bandUnder50:
      'Menos de 50',
    band50to74:
      '50 – 74',
    band75Plus:
      '75 o más',
    reviewCapitals:
      'Esto está escrito todo en mayúsculas.',
    reviewCapitalsConsider:
      'En minúsculas se lee mejor y es más fácil de traducir. El nombre del plato conserva las mayúsculas que le hayas puesto.',
    reviewRepeats:
      'Un carácter se repite varias veces seguidas.',
    reviewRepeatsConsider:
      'Comprueba que no sea una tecla atascada.',
    reviewShort:
      'El método es muy corto.',
    reviewShortConsider:
      'Escribe lo que habría que hacer para prepararlo, incluidas las esperas. Un registro sin método no puede llegar a los estantes de recetas.',
    groupSummaryCountries:
      '{c} países · {n} tradiciones',
    groupSummaryOrigins:
      '{c} orígenes · {n} tradiciones',
    metricTotalTitle:
      'Tradiciones registradas',
    metricTotalCounts:
      'Una tradición es una manera de hacer un alimento en un lugar. El mismo plato hecho de otra forma en dos regiones son dos tradiciones, y se conservan las dos.',
    metricTotalMethod:
      'Todo registro del conjunto curado y de las cuatro fuentes importadas que tenga algo que mostrar: como mínimo un lugar y un nombre. Las filas que aún esperan enriquecimiento se retienen y no se cuentan.',
    metricTotalCaveat:
      'Esto no es un recuento de los alimentos distintos del mundo, ni una medida de cuánto sabe el atlas. La mayoría de estos registros llevan un nombre y un país y nada más. La proporción con método escrito es la cifra que dice si esto es un atlas o una lista de nombres.',
    metricCountriesTitle:
      'Países',
    metricCountriesCounts:
      'Países distintos nombrados en todos los registros, una vez resueltos los topónimos de la importación.',
    metricCountriesMethod:
      'El campo de país de cada registro, sin duplicados, contando solo los orígenes que son países. Las entradas históricas y supranacionales que usó alguna fuente — el Imperio otomano, el Levante, Mesoamérica — se conservan en sus registros en lugar de reasignarse a un Estado moderno que tendríamos que adivinar, y aquí no se cuentan. Contarlas añadía treinta y dos a esta cifra, y todas eran imaginarias.',
    metricCountriesCaveat:
      'La cobertura no es profundidad. Un país aparece aquí con la fuerza de un solo registro, así que esto cuenta dónde ha estado el atlas, no dónde es bueno. Léelo junto a la cifra de concentración de abajo, que dice cuán desequilibrado está el total.',
    metricAtRiskTitle:
      'Tradiciones en riesgo',
    metricAtRiskCounts:
      'Registros donde las propias palabras de una fuente describen la tradición como en declive, desapareciendo o ya no practicada.',
    metricAtRiskMethod:
      'Se detecta leyendo la introducción y la historia de cada artículo en busca de un declive declarado — "hoy rara vez se hace", "el último productor que queda" — y descartando casi-coincidencias que significan otra cosa, como una especie amenazada usada de ingrediente o una cadena de restaurantes cerrada. La frase que lo activó se guarda en el registro como prueba y se muestra con él.',
    metricAtRiskCaveat:
      'Esto es un suelo, no un censo, y está muy por debajo de la verdad. Solo puede encontrar el declive que alguien ya escribió en un texto que hemos leído; una tradición que mantienen cuatro familias y que nadie ha documentado no registra absolutamente nada. Solo el Arca del Gusto de Slow Food enumera unos seis mil alimentos en peligro, mil veces esta cifra.',
    metricDocumentedTitle:
      'Tiene un método registrado',
    metricDocumentedCounts:
      'Registros que llevan un método ordenado: los pasos que alguien seguiría para hacerlo.',
    metricDocumentedMethod:
      'Los registros curados tienen un método escrito y contrastado con la comunidad. Los importados lo tienen solo cuando existe una receta publicada para ellos; un párrafo de enciclopedia que describe cómo se hace un plato en general se guarda como prosa y deliberadamente no se asciende a pasos, porque presentar una descripción como método reclama una precisión que no tiene.',
    metricDocumentedCaveat:
      'Que haya un método no dice nada sobre si es el tradicional. Para eso está la puntuación de confianza, y la mayoría de los registros con método están clasificados como Adaptación moderna.',
    metricLocatedTitle:
      'Situado por debajo del país',
    metricLocatedCounts:
      'Registros que nombran una región, provincia, ciudad o aldea, y no solo un país.',
    metricLocatedMethod:
      'Cualquier registro cuyo lugar tenga algún nivel relleno por debajo del país.',
    metricLocatedCaveat:
      'La autenticidad tiene profundidad geográfica, y un país es apenas un comienzo: "Kozhikode" es un registro, "India" es un encabezado. Un total alto con una proporción baja aquí describe un atlas ancho y poco profundo.',
    metricIllustratedTitle:
      'Tiene fotografía',
    metricIllustratedCounts:
      'Registros con una imagen que la aplicación tiene derecho a mostrar.',
    metricIllustratedMethod:
      'De Wikidata, del propio artículo de Wikipedia del plato, o aportada por alguien que cocina a través de Wikimedia Commons. Cada una se guarda con su autoría y su licencia, y ninguna se marca como verificada: una imagen encontrada por el nombre o elegida por un editor es buena prueba de que muestra el plato, no la confirmación de esta aplicación.',
    metricIllustratedCaveat:
      'Una fotografía no es prueba de autenticidad. Muestra un plato que alguien cocinó, que puede ser o no la tradición que describe el registro.',
    metricFilmedTitle:
      'Tiene vídeo ordenado',
    metricFilmedCounts:
      'Registros con al menos un vídeo, ordenados por lo cerca que está quien cocina de la tradición.',
    metricFilmedMethod:
      'Ordenados por localidad: dónde está quien cocina, en qué idioma habla, si los ingredientes y los utensilios coinciden con el registro. Nunca por visualizaciones, me gusta o suscriptores.',
    metricFilmedCaveat:
      'El orden trata de la cercanía a la tradición, no de la calidad de la filmación, y el primer vídeo suele ser el menos pulido.',
    metricAssessedTitle:
      'Clasificados como auténticos',
    metricAssessedCounts:
      'Registros que llegaron a Auténtico — Local o Auténtico — Regional a través de las comprobaciones de pruebas.',
    metricAssessedMethod:
      'Siete comprobaciones, cada una respondida o dejada abierta, y las abiertas bajan la confianza en lugar de rellenarse por suposición. La técnica y la validación de la comunidad nunca se infieren de una importación, lo que pone un techo a lo que un registro importado puede alcanzar por sí solo.',
    metricAssessedCaveat:
      'Que esta proporción sea baja es honesto, no un fracaso. La mayor parte del catálogo está importada y sin evaluar, y llamar auténticos a esos registros porque vienen de una fuente respetable es justo el atajo que esta escala existe para rechazar.',
    metricConcentrationTitle:
      'Concentración',
    metricConcentrationCounts:
      'La proporción de todo el catálogo que ocupa su país más grande.',
    metricConcentrationMethod:
      'Registros del país más representado, sobre el total.',
    metricConcentrationCaveat:
      'Esto refleja qué países mantienen registros alimentarios abiertos, no dónde está la comida del mundo. Solo Italia publica unos 4.400 productos tradicionales registrados; la mayoría de los países no publica ninguno, y su ausencia aquí es una ausencia de papeleo, no de cocina.',
    metricConfidenceTitle:
      'Confianza',
    metricConfidenceCounts:
      'Cómo se reparte el catálogo a lo largo de la puntuación de pruebas de 0 a 100.',
    metricConfidenceMethod:
      'Los registros curados se puntúan con las comprobaciones de pruebas. Los importados se puntúan solo donde el enriquecimiento encontró pruebas que puntuar, y en los demás casos se dejan sin puntuar en vez de darles un valor por defecto.',
    metricConfidenceCaveat:
      '"Sin puntuar" es con diferencia la franja más grande y seguirá siéndolo. Significa que nadie ha evaluado todavía el registro: no que haya puntuado mal, ni que la comida sea dudosa.',
    metricByContinentTitle:
      'Dónde están los registros',
    metricByContinentCounts:
      'Registros por continente, contando cada registro una vez. Una tradición se sitúa en el continente del país donde está registrada, no en aquel del que pueda haber viajado.',
    metricByContinentMethod:
      'A partir del país de cada registro, mediante un mapa de país a continente que cubre unos 200 Estados, incluidos históricos. Las entradas supranacionales y disputadas se agrupan en vez de forzarse dentro de un continente.',
    metricByContinentCaveat:
      'Este es un mapa de las fuentes, no de la cocina del mundo. Europa encabeza porque los registros europeos están en línea y abiertos, lo cual es un hecho sobre archivos.',
    howIsThisCounted:
      '¿Cómo se cuenta esto?',
    hideHowThisIsCounted:
      'Ocultar cómo se cuenta',
    stapleGrains: 'Cereales',
    stapleRoots: 'Raíces',
    staplePulses: 'Legumbres',
    stapleDairy: 'Lácteos',
    stapleMeatFish: 'Carne y pescado',
    stapleVegetables: 'Verduras',
    stapleAromatics: 'Aromáticos',
    stapleSweetSour: 'Dulce y ácido',
    stapleRice: 'Arroz',
    stapleWheat: 'Trigo',
    stapleMaize: 'Maíz',
    stapleMillet: 'Mijo',
    stapleSorghum: 'Sorgo',
    stapleBarley: 'Cebada',
    stapleOats: 'Avena',
    stapleBuckwheat: 'Trigo sarraceno',
    stapleTeff: 'Teff',
    staplePotato: 'Patata',
    stapleCassava: 'Yuca',
    stapleSweetPotato: 'Boniato',
    stapleYam: 'Ñame',
    stapleTaro: 'Taro',
    staplePlantain: 'Plátano macho',
    stapleLentil: 'Lentejas',
    stapleChickpea: 'Garbanzos',
    stapleSoy: 'Soja',
    stapleTofu: 'Tofu',
    stapleBlackBean: 'Frijoles negros',
    stapleMungBean: 'Judías mungo',
    staplePigeonPea: 'Gandules',
    stapleMilk: 'Leche',
    stapleYoghurt: 'Yogur',
    stapleCheese: 'Queso',
    staplePaneer: 'Paneer',
    stapleGhee: 'Ghee',
    stapleButter: 'Mantequilla',
    stapleCoconut: 'Coco',
    stapleChicken: 'Pollo',
    stapleBeef: 'Ternera',
    staplePork: 'Cerdo',
    stapleLamb: 'Cordero',
    stapleGoat: 'Cabra',
    stapleFish: 'Pescado',
    staplePrawn: 'Gambas',
    stapleEgg: 'Huevos',
    stapleOnion: 'Cebolla',
    stapleGarlic: 'Ajo',
    stapleGinger: 'Jengibre',
    stapleChilli: 'Chile',
    stapleLemongrass: 'Hierba limón',
    stapleTomato: 'Tomate',
    stapleAubergine: 'Berenjena',
    stapleCabbage: 'Repollo',
    stapleSpinach: 'Espinaca',
    stapleOkra: 'Okra',
    stapleTamarind: 'Tamarindo',
    stapleHoney: 'Miel',
    stapleJaggery: 'Panela',
    stapleDate: 'Dátiles',
    stapleLemon: 'Limón',
    stapleOlive: 'Aceituna',
    dietVegan: 'Vegano',
    dietVegetarian: 'Vegetariano',
    dietSeafood: 'Marisco y pescado',
    dietMeat: 'No vegetariano',
    dietUnclassified: 'Sin clasificar',
    dietPoultry: 'Aves',
    dietPork: 'Cerdo',
    dietBeef: 'Ternera y carne roja',
    dietLambGoat: 'Cordero y cabra',
    dietGame: 'Caza',
    dietFish: 'Pescado',
    dietShellfish: 'Mariscos',
    dietOtherSeafood: 'Otros productos del mar',
    dietDairy: 'Contiene lácteos',
    dietEgg: 'Contiene huevo',
    dietHoney: 'Contiene miel',
    mealBreakfast: 'Desayuno',
    mealLunch: 'Comida',
    mealDinner: 'Cena',
    mealSupper: 'Cena ligera',
    mealSnack: 'Tentempié',
    mealStreetFood: 'Comida callejera',
    mealCelebration: 'Celebración y fiesta',
    mealAnytime: 'A cualquier hora',
    mealUnclassified: 'No registrado',
    searchModeFind:
      'Buscar un plato',
    searchModePantry:
      'Cocinar con lo que tengo',
    ingredientsYouHave:
      'Ingredientes que tienes',
    nTraditions:
      '{n} tradiciones',
    nothingYet:
      'Nada todavía',
    methodRecorded:
      ' · con método registrado',
    noMethodYet:
      ' · sin método todavía',
    showMoreLeft:
      'Ver más — quedan {n}',
    showNMore:
      'Ver {n} más',
    methodAsPublished:
      'El método tal como se publicó. Los utensilios modernos y los atajos forman parte de él.',
    methodTraditional:
      'El método tradicional, sin atajos modernos sustituidos.',
    everythingClassified:
      'Todo lo clasificado como {what}',
    everythingFrom:
      'Todo lo de {place}',
    everythingRecordedAs:
      'Todo lo registrado como {what}',
    everythingMadeWith:
      'Todo lo hecho con {ingredient}',
    seeEverything:
      '{label} — verlo todo',
    noPhotographOnRecord:
      '{label} — sin fotografía en el registro',
    scoreOutOf100:
      '{label}: {value} sobre 100',
    removeFilter:
      'Quitar el filtro {key}',
    anywhereInTheAtlas:
      ' en cualquier parte del atlas',
    absenceOfRecords:
      '. Eso es una ausencia de registros, no una ausencia de comida: preferimos decir que no lo sabemos.',
    narrowToA:
      'Afinar a {level} · {n} registrados',
    fromTheTown:
      ' — del pueblo mismo',
    showFewer:
      'Ver menos',
    readAboutOnWikipedia:
      'Leer sobre {name} en {language} en Wikipedia',
    languageChangeIt:
      'Idioma: {language}. Cámbialo.',
    perCentTranslated:
      '{language}, {n} por ciento traducido',
    translateThisRecord:
      'Traducir este registro',
    translating:
      'Traduciendo…',
    translate:
      'Traducir',
    translateThisConfirmation:
      'Traducir esta confirmación al {language}',
    couldNotTranslate:
      'No se pudo traducir: inténtalo otra vez',
    howThisIsCountedFor:
      'Cómo se cuenta {figure}',
    countOfTotal:
      '{label}: {count} de {total}',
    watchAtSourceCreator:
      'Ver a {creator} en el origen',
    stillFromCreator:
      'Fotograma de {creator}',
    thatDidNotSend:
      'No se ha enviado.',
    containsAlcohol:
      'Contiene alcohol',
    nothingElseRequired:
      'Todo lo demás es bienvenido y nada es obligatorio: saber de dónde es una comida y que nadie la ha escrito ya es más de lo que tiene cualquier fuente de aquí.',
    opensTheFormPrefilled:
      'Abre el formulario en su origen con lo que ya has escrito relleno. Esta aplicación no recoge nada sobre ti, y nada se publica hasta que gente del lugar lo confirme.',
    scoreDimGeographic:
      'Vínculo geográfico',
    scoreDimIngredients:
      'Ingredientes tradicionales',
    scoreDimTechnique:
      'Técnica tradicional',
    scoreDimLocalSource:
      'Fuente local',
    scoreDimDocumentation:
      'Documentación cultural',
    scoreDimCommunity:
      'Validación de la comunidad',
    photoFromWikidata:
      'Adjunta a la propia entrada de Wikidata de este plato — no encontrada por el nombre',
    photoFromArticle:
      'La imagen principal del propio artículo enciclopédico de este plato',
    photoFromRecipe:
      'Publicada en la página de esta misma receta',
    photoFromSearch:
      'Encontrada por el nombre en Wikimedia Commons — el motivo no está confirmado',
    photoFromUnknown:
      'Origen no registrado — trata el motivo como no confirmado',
    noTranslationRecorded:
      'Todavía no se ha registrado ninguna traducción de este relato, así que se muestra en {language}, el idioma en que se documentó. Preferimos enseñarte el original antes que la conjetura de una máquina sobre un tiempo de fermentación.',
    machineTranslationBy:
      'Traducción automática de {translator}. Nadie de la comunidad la ha revisado; los nombres de ingredientes y utensilios se dejan en el original.',
    translatedBy:
      'Traducido por {translator}. Los nombres de ingredientes y utensilios se dejan en el original.',
    videoOriginalAudio:
      'Hablado en {language}: el propio idioma de quien cocina. No se traduce nada.',
    videoCreatorTrack:
      'Quien lo hizo publicó una pista de audio en {language}. Se abre en esa pista en el origen: la traducción es suya, no nuestra.',
    videoPlatformCaptions:
      'Hablado en {spoken}. Se abre con subtítulos en {preferred} traducidos automáticamente sobre el audio original: la voz de quien cocina no se sustituye, y la traducción es de la plataforma de vídeo, no de una persona.',
    videoLanguageUnknown:
      'No tenemos registrado el idioma hablado de este vídeo, así que no podemos prometer {language}. Se abre en el origen, donde se aplican las opciones de subtítulos de la propia plataforma.',
    figureDocumented:
      'Tiene método registrado',
    figureDocumentedNote:
      'La cifra que dice si esto es un atlas o una lista de nombres. Todo lo demás es secundario.',
    figureLocated:
      'Situado por debajo del país',
    figureLocatedNote:
      'La autenticidad tiene profundidad geográfica. “Kozhikode” es un registro; “India” es apenas un comienzo.',
    figureIllustrated:
      'Tiene fotografía',
    figureIllustratedNote:
      'Un plato que nadie puede imaginarse cuesta que importe, y cuesta más reconocerlo.',
    figureFilmed:
      'Tiene vídeo ordenado',
    figureFilmedNote:
      'Ordenado por lo cerca que está quien cocina de la tradición, no por resultado de búsqueda.',
    figureAssessed:
      'Clasificados como auténticos',
    figureAssessedNote:
      'Ganado con las comprobaciones de pruebas. Que esta proporción sea baja es honesto, no un fracaso.',
    atlasSummary:
      '{n} tradiciones documentadas en {c} países. La cobertura se declara con honestidad: un país ausente aquí no tiene nada registrado todavía, no es que no haya nada que registrar.',
    nothingRecorded:
      'Nada registrado',
    nothingRecordedAs:
      'Nada registrado como {what}',
    nothingRecordedAsAnd:
      'Nada registrado como {list} y {last}',
    photoVia:
      'foto vía',
    photoNothingEntered:
      'Todavía no has escrito nada.',
    photoNothingEnteredFix:
      'Pega el nombre del archivo de Commons o el enlace a su página.',
    photoWrongHost:
      'Ese enlace lleva a {host}, y no tenemos derecho a publicar una fotografía de ahí.',
    photoWrongHostFix:
      'Si la fotografía es tuya, súbela a Wikimedia Commons con una licencia libre y pega aquí el nombre del archivo. Sigue siendo tuya, se te acredita allí donde aparezca, y no cuesta nada.',
    photoNotCommons:
      'Ese enlace no está en Wikimedia Commons.',
    photoNotCommonsFix:
      'Aquí solo se pueden publicar archivos de Commons, porque solo ellos llevan una licencia que nos permite mostrarlos.',
    photoNoFileName:
      'No se ha encontrado ningún nombre de archivo ahí.',
    photoNoFileNameFix:
      'Pega el nombre del archivo, por ejemplo Kaipola.jpg.',
    photoNotAPhotograph:
      'Eso no es un archivo de fotografía.',
    photoNotAPhotographFix:
      'Las fotografías de Commons terminan en .jpg, .png o .webp. Los diagramas y logotipos no se usan aquí.',
    photoIsADrawing:
      'Eso es un dibujo, no una fotografía.',
    photoIsADrawingFix:
      'Usa una fotografía de la comida tal como se hizo.',
    serverRefused:
      'El servidor lo ha rechazado ({status}).',
    serverTookTooLong:
      'El servidor ha tardado demasiado en responder.',
    couldNotReachServer:
      'No se ha podido contactar con el servidor.',
    nothingYouTypedIsLost:
      '{message} Tu entrada no se ha enviado; nada de lo que escribiste se pierde, inténtalo de nuevo en un momento.',
    proposalsNotOpen:
      'Las propuestas todavía no están abiertas.',
    confirmationsNotOpen:
      'Las confirmaciones todavía no están abiertas.',
    alreadyProposed:
      'Este plato ya se ha propuesto. Ábrelo y confírmalo: eso es lo que lo hace avanzar.',
    alreadyConfirmed:
      'Ya has confirmado este.',
    youProposedThis:
      'Tú propusiste este plato, así que necesita que lo confirme otra persona.',
    stillNeededList:
      'Todavía falta: {list}.',
    listAnd:
      '{list} y {last}',
    listOr:
      '{list} o {last}',
    proposalConfirmed:
      'Confirmado. Entra en el atlas en la próxima actualización.',
    proposalNobodyYet:
      'Todavía no lo ha confirmado nadie. {n} personas que conozcan el plato lo traerían al atlas.',
    proposalSoFar:
      '{have} de {n} confirmaciones. {short} más de gente que conozca el plato lo traerían.',
    recordNobodyYet:
      'Todavía no lo ha confirmado nadie del lugar. {n} confirmaciones lo autenticarían.',
    recordSoFar:
      '{have} de {n} confirmaciones. {short} más de gente que conozca el plato lo autenticarían.',
    atRiskNote:
      'Marcado porque una fuente describe esta tradición en declive; la frase se muestra con el registro. Nunca se deduce de lo poco que hayamos documentado: un vacío en nuestros registros no es prueba de que nadie haya dejado de cocinar.',
    originDisclaimer:
      'Este plato tiene más de una reivindicación histórica documentada. Las tradiciones de abajo se recogen tal como las describe cada lugar, con sus fuentes. Ninguna se presenta aquí como la ganadora, y nada de esto afecta a la puntuación de autenticidad: esa mide cómo se hace el plato en un lugar, no quién lo hizo primero.',
    supportRunsOn:
      'Todo lo que hay en el atlas viene de Wikipedia, Wikidata, Wikimedia Commons, Wikibooks y registros regionales abiertos. Son libres de leer, tienen licencia abierta y se acreditan en cada registro que las usa. Esa es toda la base de que el proyecto siga siendo gratuito, y es una decisión, no una etapa.',
    contributeToTheAtlas:
      'Contribuir al atlas',
    answeredByDocuments:
      'Los documentos pueden responder a estas',
    answeredByPeople:
      'Solo las personas pueden responder a estas',
    scaleDocumentsStop:
      'aquí paran los documentos',
    scaleAuthenticBegins:
      'empieza Auténtico',
    pantryNothingUses:
      'Nada de lo registrado usa {list}. Puede que nadie haya escrito un plato que lo haga: el {p}% del atlas no tiene ningún ingrediente anotado.',
    alsoRecordedIn:
      'También registrado en {list}',
    alsoRecordedNote:
      'El atlas guarda un registro aparte de este plato allí. Ninguno corrige al otro: un plato que hacen dos culturas no es un error de ninguna.',
    chooseACountry:
      'Elige un país',
    filterTheList:
      'Escribe para filtrar la lista',
    showingFirstNOfM:
      'Mostrando los primeros {n} de {m}. Sigue escribiendo para acotar.',
    nothingMatchesThat:
      'Nada de la lista coincide con eso.',
    continentBeyondOneCountry:
      'Más allá de un país',
    beyondOneCountryNote:
      'Orígenes que las fuentes registran como más amplios que un solo país: una región, un área culinaria compartida o un estado que ya no existe. Se conservan tal como los indica la fuente, sin reducirlos a un país que nadie eligió.',
    connectionGrewUpThere:
      'Crecí allí',
    connectionLiveThere:
      'Vivo allí',
    connectionFamilyFrom:
      'Mi familia es de allí',
    connectionLearnedThere:
      'Aprendí a hacerlo allí',
    connectionCookProfessionally:
      'Lo cocino allí profesionalmente',
    chooseYourConnection:
      'Elige lo que corresponda',
    connectionInYourWords:
      'Lo que quieras añadir, con tus palabras',
    connectionDetailPlaceholder:
      'Mi abuela lo hacía cada Eid en Kozhikode',
    dictateSpeak:
      'Hablar en vez de escribir',
    dictateListening:
      'Escuchando — toca para parar',
    dictateStop:
      'Dejar de escuchar',
    dictateSendsAudio:
      'La escucha la hace tu navegador, y la mayoría envía el audio a sus propios servidores para ello. Lo que digas se añade al cuadro de arriba, donde puedes corregirlo.',
    dictateNotAllowed:
      'El navegador no dio permiso para el micrófono.',
    dictateDidNotWork:
      'Eso no funcionó. Aún puedes escribirlo.',
    polishTidyThis:
      'Corrige mi escritura',
    polishWorking:
      'Corrigiendo…',
    polishMachineMade:
      'Sugerido por una máquina: tus palabras siguen arriba',
    polishUseThis:
      'Usar esto',
    polishKeepMine:
      'Quedarme con lo mío',
    polishOnlyTyping:
      'Solo se tocan la ortografía, la puntuación y los espacios. No se añade, quita ni reformula nada, y no se cambia ningún nombre.',
    polishFoundNothing:
      'Nada que corregir: lo que escribiste se lee bien.',
    polishDidNotWork:
      'Eso no funcionó. Lo que escribiste no ha cambiado.',
    continentAfrica:
      'África',
    continentAsia:
      'Asia',
    continentEurope:
      'Europa',
    continentNorthAmerica:
      'América del Norte',
    continentSouthAmerica:
      'América del Sur',
    continentOceania:
      'Oceanía',
    regionLevant:
      'Levante',
    regionLatinAmerica:
      'América Latina',
    regionMiddleEast:
      'Oriente Medio',
    regionMaghreb:
      'Magreb',
    regionCentralEurope:
      'Europa Central',
    regionEasternEurope:
      'Europa del Este',
    regionSouthernEurope:
      'Europa del Sur',
    regionCentralAsia:
      'Asia Central',
    regionIndianSubcontinent:
      'subcontinente indio',
    regionNorthAfrica:
      'África del Norte',
    regionAmericas:
      'América',
    regionAncientNearEast:
      'antiguo Oriente Próximo',
    regionBalkans:
      'Balcanes',
    regionCaribbean:
      'Caribe',
    regionLowCountries:
      'Países Bajos históricos',
    regionMesoamerica:
      'Mesoamérica',
    regionMiddleEasternEmpires:
      'imperios de Oriente Medio',
    regionPolishLithuanianCommonwealth:
      'República de las Dos Naciones',
    regionQajarIran:
      'Irán qayar',
    regionRussianEmpire:
      'Imperio ruso',
    regionSouthCaucasus:
      'Cáucaso Sur',
    regionSovietCentralAsia:
      'Asia Central soviética',
    regionWu:
      'Wu',
    regionArtsakh:
      'República de Artsaj',
    refineDietOccasion:
      'Dieta y ocasión',
    refineAny:
      'Cualquiera',
    placeKindWiderRegion:
      'región amplia',
    placeKindFormerState:
      'estado histórico',
    oneTradition:
      '1 tradición',
    onePlace:
      '1 lugar',
    nPlaces:
      '{n} lugares',
    countryLevelOnly:
      'sólo a nivel de país',
    summaryWorldwide:
      ' en todo el mundo',
    nRecorded:
      '{n} registradas',
    writtenInLanguage:
      'Escrito en {language}',
    whatThisIs:
      'Qué es esto',
    atlasDefinition:
      'Un atlas gratuito de platos tradicionales: de dónde viene cada uno y quién lo respalda.',
    traditionsLabel:
      'tradiciones',
    freeNoAds:
      'Gratis, sin anuncios',
    quotedFromSource:
      'Citado de la fuente siguiente: un relato general de cómo se hace el plato, no un registro de cómo se hace en {place}.',
    adaptationLeadIn:
      'Cómo se prepara este plato hoy en día. No es un registro de cómo se prepara en {place}, y nadie de allí lo ha confirmado.',
    openDisagreementBody:
      'Alguien que cocina esto en {place} dice que se hace de otra manera: {differs} No se ha eliminado nada mientras se revisa, y la confianza siguiente no cambia: si ambos relatos se sostienen, el registro se dividirá en lugar de imponerse uno sobre otro.',
    engagementNotShown:
      'Las cifras de interacción no se muestran a propósito: no miden la autenticidad.',
    videoSearchNote:
      'Puedes buscar uno en la fuente. Los resultados llegan ordenados por número de visitas, que mide alcance y nada más: quien cocina puede ser o no de {place}. Nada de lo que se encuentre así afecta a la clasificación de este registro.',
    nowOpenForConfirmation:
      '{name} ya está abierto a confirmación.',
    proposalOpenBody:
      '{n} personas que conozcan el plato deben confirmarlo antes de que entre en el atlas. Cualquiera puede verlo y confirmarlo desde ahora, incluidas las personas a quienes se lo cuentes, que suele ser cómo se confirma un plato que nadie había escrito.',
    nothingMatchesBody:
      'Nada en el atlas coincide con {query} todavía. Una ausencia aquí significa que no hay registro, no que no haya comida: preferimos decir que no lo sabemos antes que adivinar.',
    thatWord:
      'eso',
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
      '{n} traditions, bâties entièrement sur des sources libres de lecture et sous licence ouverte. Aucune publicité, aucun pistage, rien derrière un paiement. Ce que cela coûte à faire tourner est couvert par ce choix de sources, pas par quelqu’un qui paierait pour y figurer.',
    notForSaleAuthentic:
      'Une fiche ne peut pas devenir Authentique en payant. Cela vient des preuves et des gens qui cuisinent le plat.',
    notForSalePromotion:
      'Aucun plat n’est mis en avant, mieux classé ni mis en vedette parce que quelqu’un a payé.',
    notForSaleAdvertising:
      'Rien ici n’est de la publicité, et aucun lecteur n’est pisté.',
    donationFootnote:
      'S’ouvre sur Open Collective. Rien n’est encaissé ici — cette application ne détient aucune de vos coordonnées de paiement et n’en détiendra jamais.',
    donationsPendingBody:
      'Il n’y a encore nulle part où envoyer de l’argent. Rien dans l’atlas n’en dépend : il est bâti sur des sources libres de lecture, et cela ne change pas.',
    mostUsefulThing:
      'La chose la plus utile que l’on puisse donner à cet atlas n’est pas de l’argent. L’essentiel se résume à un nom et un lieu, parce que personne n’a écrit comment le plat se prépare.',
    administration:
      'Administration',
    administrationNote:
      'Seuils, modération, vérification des sources et usage. Nécessite un jeton.',
    howLead:
      'C’est la règle sur laquelle cet atlas est bâti, et c’est de l’arithmétique et non une politique — ce qui veut dire que vous pouvez la vérifier plutôt que la croire.',
    sixDimensionsBody:
      'Chaque fiche est notée sur les mêmes six dimensions, et les six sont imprimées sur la fiche elle-même. La note est leur moyenne, si bien que qui en doute peut additionner les chiffres.',
    ceilingBody:
      'Trois de ces six ne peuvent être établies par aucun document jamais écrit. Aucune encyclopédie ne sait si une méthode est la méthode d’un lieu ; aucun registre n’est une personne du village. Ces trois-là vides, le mieux qu’une fiche puisse obtenir sur des sources publiées seules est {ceiling}.',
    thresholdBody:
      'Une fiche est dite Authentique à partir de {threshold}. L’écart entre ces deux chiffres est délibéré, et c’est tout l’argument : seules les personnes qui connaissent le plat peuvent le combler.',
    whatClosesItBody:
      '{n} confirmations de personnes qui déclarent leur lien avec le lieu — et qui disent ce qu’elles confirment, pas seulement qu’elles approuvent. Les deux figurent sur la fiche, car une phrase comme « né à Kozhikode — nous utilisons du ghee, pas de l’huile » est une preuve que l’on peut peser, tandis que « {n} confirmations » est un chiffre qu’il faut croire.',
    accountsBody:
      'Ces {n} doivent être {n} personnes différentes ; une confirmation ne compte donc pour le badge que si la personne était connectée. Une confirmation anonyme est tout de même enregistrée et affichée sur la fiche — ce que quelqu’un sait vaut d’être recueilli, qu’il ait un compte ou non — elle ne fait simplement pas bouger le chiffre. Lire l’atlas n’exige jamais de se connecter.',
    whichIsWhereYouComeInBody:
      'La plus grande partie de l’atlas n’a personne pour parler en son nom. Si vous savez comment un plat se prépare là d’où vous venez, c’est la seule chose qu’aucune source ne peut fournir et qu’aucun moissonnage ne peut atteindre.',
    notRatings:
      'Pas de notes. Personne ne note un plat sur cinq.',
    notComments:
      'Pas de commentaires, pas de fil. Il n’y a rien ici avec quoi interagir.',
    notAlgorithm:
      'Aucun algorithme ne décide de ce que vous voyez. L’ordre, ce sont les preuves, et vous pouvez le changer.',
    notAdvertising:
      'Pas de publicité, et aucun lecteur n’est pisté.',
    notPopularity:
      'La popularité est enregistrée et tenue à part. La version la plus publiée d’un plat ne devient jamais l’authentique.',
    dimensionOrigin:
      'D’où vient le plat, et avec quelle précision. Une ville vaut mieux qu’un pays.',
    dimensionIngredients:
      'Ce dont il est fait, tel que la tradition le fait.',
    dimensionTechnique:
      'Comment il se prépare — non pas que quelqu’un ait publié une recette, mais que ce soit la méthode du lieu.',
    dimensionLocalSource:
      'Quelqu’un ayant déclaré un lien avec le lieu a parlé en son nom.',
    dimensionDocumentation:
      'Un registre, une inscription ou une encyclopédie l’a consigné.',
    dimensionCommunity:
      'Des gens du lieu l’ont confirmé, et ont dit ce qu’ils confirment.',
    fromDocuments:
      'les documents peuvent',
    fromPeople:
      'seules les personnes',
    contributeLead:
      'Enregistrez-le tel qu’il se fait là où vous êtes. Rien n’est publié à partir de ce seul formulaire : cela passe d’abord par l’évaluation et par la validation de la communauté.',
    writeItTheWayYouWriteIt:
      'Écrivez le nom du plat comme vous l’écrivez',
    editorialRuleBody:
      'Corrigez librement notre texte : orthographe, grammaire, tout ce qui se lit mal. Ne corrigez pas le plat lui-même. Un nom de plat, un ingrédient, un ustensile et un lieu restent exactement comme les écrivent celles et ceux qui le cuisinent, accents compris. Si deux graphies divergent, ce sont généralement deux communautés plutôt qu’une faute, et les deux sont conservées.',
    photographTitle:
      'Une photographie, si vous en avez une',
    photographBody:
      'Publiez votre propre photographie sur Wikimedia Commons, puis collez ici son nom de fichier. Elle reste la vôtre, vous êtes crédité partout où elle paraît, et cela ne coûte rien ni à vous ni à nous. Nous ne pouvons pas en prendre une sur Instagram ou TikTok : là-bas, la photographie relève du droit d’auteur de celui qui l’a prise, et une ligne de crédit n’est pas une autorisation.',
    walkthroughNoteBody:
      'Ce qui suit est un exemple traité de ce qui arrive à une proposition : les constats, les vérifications et la note provisoire ci-dessous proviennent d’une fiche déjà présente dans l’atlas, pas de ce que vous venez de saisir. Votre saisie n’est pas évaluée ici ; elle est évaluée par des personnes, après envoi.',
    examplePreparedBy:
      'Foyers du Malabar, préparé pour l’iftar et les occasions familiales',
    exampleConnection:
      'Né à Kozhikode et j’y cuisine',
    exampleIngredients:
      'Banane nendran mûre, œufs, ghee, sucre, noix de cajou, raisins secs ; cuit dans une poêle épaisse sur feu doux de charbon ou de gaz, couvert d’un couvercle chargé de braises',
    shelfFromCountry:
      'Du {country}',
    shelfFromCountryNote:
      'Ce que l’atlas contient pour {country}. Sa justesse ici vaut plus pour vous que partout ailleurs : vous, vous pouvez savoir si c’est exact.',
    sending:
      'Envoi…',
    missionHeadline:
      'Chaque plat ici montre ses preuves.',
    missionStakes:
      'D’où il vient, qui l’affirme et ce qui a réellement été établi : imprimé sur chaque fiche, et vérifiable par quiconque en doute.',
    statDishes:
      'plats',
    statCountries:
      'pays',
    statDocumented:
      'documentés',
    statRegistered:
      'inscrits',
    statAuthentic:
      'authentiques',
    missionAsk:
      '{n} d’entre eux n’ont aucune méthode consignée. {people} personnes d’un lieu peuvent en régler un pour de bon.',
    missionAskBody:
      'Personne n’a écrit comment on les prépare — ni en anglais, ni dans aucune langue, nulle part où une machine puisse aller. Aucune archive, aucune encyclopédie et rien d’automatique ne peut les authentifier à leur place ; c’est de l’arithmétique dans la notation, pas une règle. Si vous en cuisinez un, vous êtes la seule personne qui le puisse.',
    recordADishYouKnow:
      'Consignez un plat que vous connaissez',
    howItGetsAuthenticated:
      'Comment se fait l’authentification',
    submissionsNotOpen:
      'Les envois ne sont pas encore ouverts : il n’y a nulle part où les adresser. Le parcours ci-dessus explique ce qui se passera alors.',
    freeAndStayingFree:
      'Gratuit, et cela le restera. Aucune publicité, aucun pistage, aucun argent collecté. Un compte ne sert qu’à confirmer un plat — jamais à en lire un.',
    noRatingsNoComments:
      'Pas de notes, pas de commentaires, aucun algorithme pour décider de ce que vous voyez — les listes commencent par les preuves, pas par la popularité. Les ouvertures sont comptées comme un plat et une date, jamais comme une personne.',
    whyASourceCannot:
      'Pourquoi une source ne peut pas authentifier un plat',
    whyASourceCannotBody:
      'La documentation publiée ne peut pas dépasser {ceiling} ici, et une fiche devient Authentique à {threshold}. Cet écart n’est comblé que par des personnes liées au lieu. Les six chiffres derrière chaque note sont imprimés sur la fiche, si bien que qui doute du total peut l’additionner.',
    whyTheAtlasStops:
      'C’est aussi pourquoi l’atlas s’arrête là où il s’arrête. Toutes les sources libres ont été lues — encyclopédies, livres de cuisine, inventaires du patrimoine, dictionnaires géographiques — et {n} fiches n’ont toujours rien de consigné sur leur préparation. Ce qui reste n’a jamais été écrit.',
    levelLocal:
      'Authentique — Local',
    levelLocalFull:
      'Authentique — Local/Traditionnel',
    levelRegional:
      'Authentique — Régional',
    levelVariation:
      'Variante traditionnelle',
    levelAdaptation:
      'Adaptation moderne',
    levelFusion:
      'Fusion',
    levelUnverified:
      'Non vérifié',
    levelUnverifiedFull:
      'Non vérifié — preuves insuffisantes',
    filterAuthenticOnly:
      'Authentiques seulement',
    filterTraditionalVariations:
      'Variantes traditionnelles',
    filterModernAdaptations:
      'Adaptations modernes',
    filterFusion:
      'Fusion',
    filterUnverified:
      'Non vérifiés',
    filterAll:
      'Tous',
    geoCountry:
      'pays',
    geoRegion:
      'région',
    geoProvince:
      'province ou département',
    geoCity:
      'ville ou commune',
    geoVillage:
      'village ou communauté',
    chooseRegion:
      'Choisissez une région',
    chooseProvince:
      'Choisissez une province ou un département',
    chooseCity:
      'Choisissez une ville ou une commune',
    chooseVillage:
      'Choisissez un village ou une communauté',
    typeToSearchLevel:
      'Tapez pour chercher…',
    browseAllTraditions:
      'Voir les {n} traditions',
    geoPlace:
      'lieu',
    noLevelRecorded:
      'Aucun {level} enregistré sous ce nom pour l’instant. Une absence ici signifie pas de fiche, pas pas de plat.',
    browseCuisine:
      'cuisine {cuisine}',
    browseMadeWith:
      'préparé avec {ingredient}',
    browseEverything:
      'Tout',
    within:
      'Dans {path}',
    chooseCountryHint:
      'Choisissez un pays · {c} enregistrés',
    chooseCountryHintBroader:
      'Choisissez un pays · {c} enregistrés, et {b} origines plus larges',
    noRecordUnderThatReference:
      'Rien n’est enregistré dans l’atlas sous cette référence. Une absence ici signifie pas de fiche, pas pas de plat.',
    tagTraditionalPreparation:
      '🏺 Préparation traditionnelle',
    tagAtRiskTradition:
      '🕯️ Tradition menacée',
    notEligibleForAuthentic:
      'Ne peut pas prétendre au classement authentique',
    lookingForWhatItBorrows:
      'Vous cherchez la tradition dont il s’inspire ?',
    howItsDescribed:
      'Comment on le décrit',
    howItsMade:
      'Comment on le prépare',
    originAndAttribution:
      'Origine et attribution culturelle',
    nobodyRecordedTechnique:
      'Personne n’a consigné la technique — les durées, le récipient, l’ordre des gestes. C’est cela qui sortirait cette fiche de Non vérifié, et il faut quelqu’un qui le cuisine.',
    nobodyHasRecorded:
      'Personne n’a consigné comment se prépare {dish}{place}. Nous pourrions copier la recette la plus publiée d’internet et la dire authentique, mais c’est précisément ce que cet atlas existe pour ne pas faire — la fiche reste donc en l’état jusqu’à ce que quelqu’un qui le cuisine la remplisse. Si vous le faites, vous seriez la première personne à l’écrire.',
    ifIngredientUnavailable:
      'Si l’ingrédient traditionnel est introuvable',
    commonModernSubstitute:
      'Substitut moderne courant : ',
    adaptationNotAuthentic:
      'Il s’agit d’une adaptation et elle ne doit pas être prise pour la préparation authentique.',
    whatTheInternetServes:
      'Ce qu’internet sert le plus souvent pour ce plat, et en quoi cela s’écarte de la tradition ci-dessus.',
    popularNotAuthentic:
      'Populaire, mais ce n’est pas la préparation authentique. La version ci-dessus reste la référence.',
    videosRankedByCloseness:
      'De vraies vidéos, classées selon la proximité de la personne qui cuisine avec la tradition — pas selon le nombre de vues.',
    stillFramesFromVideos:
      'Les images fixes sont tirées des vidéos elles-mêmes : le plat que vous voyez est le plat que cette personne a fait.',
    noVideoRecordedYet:
      'Aucune vidéo issue de la tradition n’a encore été enregistrée pour ce plat.',
    findOneFromThePlace:
      'Si vous en trouvez une faite par quelqu’un du lieu, elle peut être ajoutée via Ajouter une tradition — c’est cela qui donnerait à ce plat une vidéo classée.',
    siblingsNeitherIsReal:
      'Le même plat, consigné séparément là où il se fait autrement. Aucun des deux n’est le vrai.',
    doYouKnow:
      'Connaissez-vous {subject} ?',
    confirmWhatYouKnow:
      'Confirmez ce que vous savez réellement. Vous n’avez pas à répondre de toute la fiche : une chose précise, dite par quelqu’un qui le cuisine, vaut mieux qu’un accord général.',
    recordedThankYou:
      'Enregistré. Merci.',
    shownWithYourConnection:
      'C’est affiché sur la fiche avec votre lien au lieu, pour que chacun puisse en juger.',
    signedInCounts:
      'Connecté — cela comptera pour le badge.',
    notSignedInNote:
      'Non connecté. Ce que vous écrivez sera affiché sur la fiche avec votre lien au lieu, et ne fera pas bouger le badge : ce compte ne monte que pour les personnes connectées, afin qu’une seule personne ne puisse pas en valoir trois.',
    signInSoItCounts:
      'Connectez-vous pour que cela compte',
    shownOnTheRecord:
      'Affiché sur la fiche',
    whatCanYouConfirm:
      'Que pouvez-vous confirmer ?',
    exampleSaid:
      'On met du ghee, pas de l’huile — et cela se fait à l’Aïd, pas toute l’année.',
    fromTheTownItself:
      'Je suis de la ville ou du village même, pas seulement de la région',
    fromTheTownItselfLabel:
      'Je suis de la ville ou du village même, pas de la région',
    exampleWhoMakesIt:
      'Préparé à la maison pour l’Aïd, par les grand-mères — facultatif',
    exampleIngredientLines:
      'banane plantain mûre\nœuf\nghee',
    exampleMethodLines:
      'Écrasez la banane plantain.\nIncorporez l’œuf battu.',
    inPlace:
      ' à {place}',
    tagAtRiskShort:
      '🕯️ Menacé',
    readThisIn:
      'Lire ceci en',
    communityTranslation:
      'Traduction de la communauté',
    machineTranslation:
      'Traduction automatique — pas encore vérifiée par quelqu’un de la communauté',
    notTranslatedYet:
      'Pas encore traduit',
    aDotMarks:
      'Un point signale une langue dans laquelle cette fiche est déjà traduite.',
    opensOnceMoreRecords:
      '{language} s’ouvrira quand {n} fiches de plus pourront s’y lire.',
    noTranslationService:
      'Aucun service de traduction n’est relié à cette version, rien ne peut donc être traduit automatiquement. De toute façon, une traduction faite par quelqu’un qui cuisine ce plat vaut mieux : elle peut être proposée via Ajouter une tradition.',
    whatTheseTermsMean:
      'Ce que ces termes veulent dire',
    signedIn:
      'Connecté',
    signOut:
      'Se déconnecter',
    signedInSignOut:
      'Connecté. Se déconnecter.',
    confirmationsCount:
      'Vos confirmations comptent pour le badge.',
    signIn:
      'Se connecter',
    signInSoConfirmationsCount:
      'Connectez-vous pour que vos confirmations comptent',
    onlySignedInMovesBadge:
      'Seules les confirmations faites en étant connecté font bouger un badge.',
    watchAtSource:
      'Voir à la source ↗',
    originalAudio:
      'Audio d’origine',
    creatorsOwnTranslation:
      'Traduction faite par l’auteur',
    translatedCaptions:
      'Sous-titres traduits',
    languageUnknown:
      'Langue inconnue',
    ingredientsInThisVideo:
      'Ingrédients utilisés dans cette vidéo',
    weDontInventOne:
      'La personne qui a fait cette vidéo n’a publié ni liste d’ingrédients ni méthode écrite, et nous n’en inventons pas. La méthode traditionnelle ci-dessus vient des sources documentées ci-dessous.',
    captureFromVideo:
      'Relever les ingrédients et les étapes de cette vidéo →',
    dietaryPreference:
      'Préférence alimentaire',
    narrowItDown:
      'Affiner',
    anyDiet:
      'Tous régimes',
    whenItsEaten:
      'Quand on le mange',
    anyOccasion:
      'Toutes occasions',
    alsoCalled:
      'Aussi appelé',
    notATranslationOfOurs:
      'Chacun est le nom employé par l’article d’encyclopédie dans cette langue — ce n’est pas une traduction de notre fait, et cela ne remplace jamais le nom ci-dessus. Touchez-en un pour le lire là-bas.',
    relatedTraditions:
      'Traditions apparentées',
    relatedTraditionsNote:
      'Des fiches qui partagent avec celle-ci un lieu, une tradition ou un ingrédient. Chacune dit lequel.',
    scoreCannotSettle:
      'Une estimation de la solidité des preuves — pas la prétention qu’une note puisse trancher une vérité culturelle.',
    notScored:
      'Non noté',
    navAtlasNote:
      'Ce qui est couvert, et avec quelle confiance',
    navProposeNote:
      'Des plats dont l’atlas n’a aucune fiche',
    navConfirmNote:
      'Des plats qui attendent quelqu’un qui les connaît',
    navSupportNote:
      'Ce que cela coûte à faire tourner, et qui paie',
    confirmPrompt:
      'Est-ce ainsi qu’on le prépare chez vous ?',
    confirmAskBody:
      'Si vous cuisinez ce plat là d’où il vient, le confirmer ou le corriger est ce qui sort une fiche de Non vérifié. Là où votre version diffère, elle est consignée à côté de celle-ci — et non à sa place.',
    confirmYes:
      'Oui, cela correspond',
    confirmNo:
      'Chez moi, on le fait autrement',
    confirmPlacePrompt:
      'Ce plat vient-il bien de là où nous le disons ?',
    confirmPlaceBody:
      'Personne n’a écrit comment celui-ci se prépare, il n’y a donc encore rien avec quoi être d’accord. Le lieu est ce que cette fiche affirme, et cela vaut d’être confirmé en soi : c’est l’une des six vérifications de preuve.',
    confirmPlaceYes:
      'Oui, c’est d’ici',
    confirmPlaceNo:
      'Non, cela vient d’ailleurs',
    standingMet:
      '{n} personnes liées à {place} l’ont confirmé — le nombre qu’exige le badge.',
    standingNobody:
      'Personne pour l’instant',
    standingOne:
      'Une personne jusqu’ici',
    standingMany:
      '{n} personnes jusqu’ici',
    standingNeed:
      '{soFar}. Le badge exige {need}, donc {people} liées à {place} y suffiraient.',
    onePersonMore:
      'une personne de plus',
    morePeople:
      '{n} personnes de plus',
    contestedNote:
      'Classé ici pour la navigation. {n} lieux revendiquent ce plat avec des sources — aucune revendication n’est tranchée, et toutes sont listées ci-dessous.',
    relatedAlsoFrom:
      'Aussi de {place}',
    relatedAlsoCuisine:
      'Aussi {cuisine}',
    relatedSharesIngredients:
      'Partage {n} ingrédients',
    relatedAlsoUses:
      'Utilise aussi {ingredient}',
    relatedAlsoCategory:
      'Aussi {category}',
    authenticVersion:
      'Version authentique',
    thePublishedRecipe:
      'La recette publiée',
    whyThisIsAnAdaptation:
      'Pourquoi c’est une adaptation',
    whyConsideredAuthentic:
      'Pourquoi est-ce considéré comme authentique ?',
    whatThisRecordIs:
      'Ce qu’est cette fiche',
    stepSubmit:
      'Envoyer',
    stepWhatExists:
      'Ce qui existe',
    stepAssessment:
      'Évaluation',
    stepValidation:
      'Validation',
    findingAggregatorTitle:
      'Page d’agrégateur de recettes',
    findingAggregatorTag:
      'Candidate populaire',
    findingAggregatorNote:
      'Résultat le mieux classé. L’auteur ne déclare aucun lien avec le Malabar ; utilise du beurre à la place du ghee.',
    findingVideoTitle:
      'Vidéo d’une chaîne de cuisine en malayalam',
    findingVideoTag:
      'Source locale',
    findingVideoNote:
      'Filmée au Kerala, parlée en malayalam, avec le ghee et la banane nendran tels que décrits.',
    findingGapTitle:
      'Aucun document à l’échelle de la ville',
    findingGapTag:
      'Lacune',
    findingGapNote:
      'Rien ne documente la façon dont on le prépare précisément à Kozhikode. Cet envoi serait le premier.',
    checkOriginLabel:
      'Origine géographique',
    checkOriginNote:
      'Malabar, Kozhikode — indiqué par la personne qui soumet et cohérent avec la source vidéo.',
    checkLocalPrepLabel:
      'Préparation locale',
    checkLocalPrepNote:
      'Décrit comme une cuisine de maison, pour l’iftar et les occasions familiales.',
    checkIngredientsLabel:
      'Ingrédients traditionnels',
    checkIngredientsNote:
      'Banane nendran, œufs, ghee — correspond à la vidéo de source locale.',
    checkTechniqueLabel:
      'Technique traditionnelle',
    checkTechniqueNote:
      'Feu doux, couvercle chargé de braises.',
    checkDocumentationLabel:
      'Documentation historique ou culturelle',
    checkDocumentationNote:
      'Mince. Aucun travail savant ni document d’archive trouvé.',
    checkLocalSourceLabel:
      'Source locale',
    checkLocalSourceNote:
      'La personne qui soumet indique être née à Kozhikode et y cuisiner.',
    checkCommunityLabel:
      'Validation par la communauté',
    checkCommunityNote:
      'Pas encore sollicitée. C’est pourquoi la fiche ne peut pas encore être dite authentique.',
    validatorHomeCook:
      'Cuisinière à la maison, Kozhikode',
    validatorHomeCookSaid:
      'A confirmé les ingrédients et la méthode des braises sur le couvercle.',
    validatorBakery:
      'Pâtissier, Thalassery',
    validatorBakerySaid:
      'Confirme, et note que sa version met moins de sucre.',
    validatorWriter:
      'Journaliste culinaire, Kerala',
    validatorWriterSaid:
      'Confirmé comme un plat de maison du Malabar ; la documentation est vraiment rare.',
    validatorPending:
      'Deux autres relecteurs invités',
    validatorPendingSaid:
      'En attente de réponse — la fiche paraît sans eux.',
    photoCheckedNote:
      'Vérifiée sur Commons au moment de l’envoi de la fiche, et affichée avec son auteur et sa licence. Elle reste Non vérifiée jusqu’à ce que la communauté la confirme, exactement comme la méthode.',
    mostPublishedNote:
      'La version la plus publiée est retenue comme candidate populaire. Elle ne devient pas la fiche authentique.',
    sevenChecksNote:
      'Sept vérifications, chacune répondue ou laissée ouverte. Les vérifications ouvertes abaissent la confiance ; elles ne sont jamais comblées par supposition.',
    draftConfidence:
      '/100 de confiance provisoire',
    unverifiedPendingTag:
      '⚪ Non vérifié — validation par la communauté en attente',
    oneSubmitterNote:
      'Une seule personne du lieu est une preuve, pas une démonstration. La fiche reste Non vérifiée tant que des membres de la communauté ne l’ont pas confirmée.',
    threeConfirmationsNote:
      'Trois confirmations de personnes qui vivent ou cuisinent sur place sortent une fiche de Non vérifié.',
    conflictingAccountsNote:
      'Les témoignages qui divergent sont tous les deux conservés. La fiche se scinde selon les traditions réellement décrites — une par région ou communauté — et aucune version n’est déclarée la vraie.',
    nowhereToSendNote:
      'Il n’y a nulle part où envoyer cela. L’atlas a lu tout ce que contiennent les sources libres ; ce qui manque désormais, c’est la nourriture que personne n’a écrite — ce formulaire est donc la façon dont il grandit, et il sera activé dès qu’il y aura une destination.',
    whereTheExampleEndsUp:
      'Voilà où aboutit la fiche donnée en exemple : publiée avec ses preuves visibles, ses vérifications restées ouvertes nommées, et chaque affirmation traçable jusqu’à qui l’a dite.',
    confirmedBy:
      'Confirmé par',
    nothingMatchesAll:
      'Rien ne correspond à tout cela à la fois.',
    mostOfYourListFirst:
      'Ce qui recoupe le plus votre liste d’abord',
    translatesTheAppsWords:
      'Traduit les mots de l’application elle-même. Les plats restent dans la langue où ils ont été consignés — chaque fiche a ses propres commandes de traduction.',
    byNameAndPlaceOnly:
      'Ceux-ci ne figurent dans l’atlas que par leur nom et leur lieu. Personne n’a consigné leur préparation, ils n’ont donc ni méthode ni note.',
    wikipediaViewsNote:
      'Combien de personnes ont lu sur chaque plat dans la Wikipédia anglophone au cours de l’année écoulée. C’est de l’intérêt, pas de l’authenticité, et ce n’est pas non plus la mesure de ce qu’on mange — cela favorise ce que cherchent les anglophones. Ouvrez chacun pour voir son classement.',
    requiredDishName:
      'le nom du plat',
    requiredCountry:
      'le pays',
    requiredYourName:
      'votre nom',
    requiredYourConnection:
      'votre lien avec le lieu',
    requiredWhatYouConfirm:
      'ce que vous pouvez confirmer',
    bandNotScored:
      'Non noté',
    bandUnder50:
      'Moins de 50',
    band50to74:
      '50 – 74',
    band75Plus:
      '75 et plus',
    reviewCapitals:
      'Ceci est écrit tout en capitales.',
    reviewCapitalsConsider:
      'La casse normale se lit mieux et se traduit plus facilement. Le nom du plat garde la casse que vous lui avez donnée.',
    reviewRepeats:
      'Un caractère se répète plusieurs fois de suite.',
    reviewRepeatsConsider:
      'Vérifiez qu’une touche n’est pas restée enfoncée.',
    reviewShort:
      'La méthode est très courte.',
    reviewShortConsider:
      'Écrivez ce qu’il faudrait faire pour le préparer, temps d’attente compris. Une fiche sans méthode ne peut pas atteindre les rayons de recettes.',
    groupSummaryCountries:
      '{c} pays · {n} traditions',
    groupSummaryOrigins:
      '{c} origines · {n} traditions',
    metricTotalTitle:
      'Traditions consignées',
    metricTotalCounts:
      'Une tradition est une façon de préparer un aliment en un lieu. Le même plat préparé autrement dans deux régions fait deux traditions, et les deux sont conservées.',
    metricTotalMethod:
      'Toute fiche issue de l’ensemble constitué à la main et des quatre sources importées qui a quelque chose à montrer — au minimum un lieu et un nom. Les lignes en attente d’enrichissement sont retenues et non comptées.',
    metricTotalCaveat:
      'Ce n’est pas un décompte des aliments distincts du monde, ni une mesure de ce que l’atlas sait. La plupart de ces fiches portent un nom et un pays, et rien d’autre. La part qui a une méthode écrite est le chiffre qui dit s’il s’agit d’un atlas ou d’une liste de noms.',
    metricCountriesTitle:
      'Pays',
    metricCountriesCounts:
      'Pays distincts nommés dans l’ensemble des fiches, une fois les toponymes de l’import résolus.',
    metricCountriesMethod:
      'Le champ pays de chaque fiche, dédoublonné, en ne comptant que les origines qui sont des pays. Les entités historiques et supranationales employées par une source — l’Empire ottoman, le Levant, la Mésoamérique — restent sur leurs fiches au lieu d’être réattribuées à un État moderne qu’il faudrait deviner, et elles ne sont pas comptées ici. Les compter ajoutait trente-deux à ce chiffre, et chacune était imaginaire.',
    metricCountriesCaveat:
      'La couverture n’est pas la profondeur. Un pays figure ici sur la foi d’une seule fiche : cela compte donc où l’atlas est passé, pas où il est bon. À lire avec le chiffre de concentration ci-dessous, qui dit à quel point le total est déséquilibré.',
    metricAtRiskTitle:
      'Traditions menacées',
    metricAtRiskCounts:
      'Fiches dont une source décrit elle-même la tradition comme en déclin, en train de disparaître ou n’étant plus pratiquée.',
    metricAtRiskMethod:
      'Repéré en lisant l’introduction et l’historique de chaque article à la recherche d’un déclin explicite — "aujourd’hui rarement préparé", "le dernier producteur restant" — et en écartant les quasi-correspondances qui veulent dire autre chose, comme une espèce menacée servant d’ingrédient ou une chaîne de restaurants fermée. La phrase qui l’a déclenché est conservée sur la fiche comme preuve et affichée avec elle.',
    metricAtRiskCaveat:
      'C’est un plancher, pas un recensement, et c’est très en deçà de la réalité. Cela ne peut trouver que le déclin que quelqu’un a déjà écrit dans un texte que nous avons lu ; une tradition tenue par quatre familles et jamais documentée n’enregistre rien du tout. La seule Arche du Goût de Slow Food recense environ six mille aliments menacés, soit mille fois ce chiffre.',
    metricDocumentedTitle:
      'A une méthode consignée',
    metricDocumentedCounts:
      'Fiches portant une méthode ordonnée — les étapes que quelqu’un suivrait pour la préparer.',
    metricDocumentedMethod:
      'Les fiches constituées à la main ont une méthode écrite et vérifiée avec la communauté. Les fiches importées n’en ont une que lorsqu’il existe une recette publiée ; un paragraphe d’encyclopédie décrivant comment un plat se prépare en général est conservé comme prose et délibérément non promu en étapes, car présenter une description comme une méthode revendique une précision qu’elle n’a pas.',
    metricDocumentedCaveat:
      'La présence d’une méthode ne dit rien sur le fait qu’elle soit la méthode traditionnelle. C’est à cela que sert la note de confiance, et la plupart des fiches ayant une méthode sont classées Adaptation moderne.',
    metricLocatedTitle:
      'Situé en dessous du pays',
    metricLocatedCounts:
      'Fiches qui nomment une région, une province, une ville ou un village, et pas seulement un pays.',
    metricLocatedMethod:
      'Toute fiche dont le lieu comporte un niveau renseigné sous le pays.',
    metricLocatedCaveat:
      'L’authenticité a une profondeur géographique, et un pays est à peine un début : "Kozhikode" est une fiche, "Inde" est un titre. Un total élevé avec une part faible ici décrit un atlas large et peu profond.',
    metricIllustratedTitle:
      'A une photographie',
    metricIllustratedCounts:
      'Fiches disposant d’une image que l’application a le droit d’afficher.',
    metricIllustratedMethod:
      'Depuis Wikidata, depuis l’article Wikipédia du plat, ou apportée par une personne qui cuisine via Wikimedia Commons. Chacune est conservée avec son auteur et sa licence, et aucune n’est marquée vérifiée : une image trouvée par le nom ou choisie par un éditeur est une bonne indication qu’elle montre le plat, pas une confirmation de cette application.',
    metricIllustratedCaveat:
      'Une photographie n’est pas une preuve d’authenticité. Elle montre une assiette que quelqu’un a cuisinée, qui peut correspondre ou non à la tradition que décrit la fiche.',
    metricFilmedTitle:
      'A une vidéo classée',
    metricFilmedCounts:
      'Fiches disposant d’au moins une vidéo, classées selon la proximité de la personne qui cuisine avec la tradition.',
    metricFilmedMethod:
      'Classées par localité : où se trouve la personne qui cuisine, dans quelle langue elle parle, si les ingrédients et le matériel correspondent à la fiche. Jamais par vues, mentions j’aime ou abonnés.',
    metricFilmedCaveat:
      'Le classement porte sur la proximité avec la tradition, pas sur la qualité du tournage, et la première vidéo est souvent la moins soignée.',
    metricAssessedTitle:
      'Classés authentiques',
    metricAssessedCounts:
      'Fiches ayant atteint Authentique — Local ou Authentique — Régional au terme des vérifications de preuves.',
    metricAssessedMethod:
      'Sept vérifications, chacune répondue ou laissée ouverte, celles qui restent ouvertes abaissant la confiance au lieu d’être comblées par supposition. La technique et la validation par la communauté ne sont jamais déduites d’un import, ce qui plafonne ce qu’une fiche importée peut atteindre seule.',
    metricAssessedCaveat:
      'Une part faible ici est honnête, pas un échec. L’essentiel du catalogue est importé et non évalué, et déclarer ces fiches authentiques parce qu’elles viennent d’une source respectable est exactement le raccourci que cette échelle existe pour refuser.',
    metricConcentrationTitle:
      'Concentration',
    metricConcentrationCounts:
      'La part du catalogue entier détenue par son seul pays le plus représenté.',
    metricConcentrationMethod:
      'Les fiches du pays le plus représenté, rapportées au total.',
    metricConcentrationCaveat:
      'Cela reflète quels pays tiennent des registres alimentaires ouverts, pas où se trouve la nourriture du monde. L’Italie à elle seule publie environ 4 400 produits traditionnels enregistrés ; la plupart des pays n’en publient aucun, et leur absence ici est une absence de paperasse, pas de cuisine.',
    metricConfidenceTitle:
      'Confiance',
    metricConfidenceCounts:
      'Comment le catalogue se répartit sur la note de preuves de 0 à 100.',
    metricConfidenceMethod:
      'Les fiches constituées à la main sont notées par les vérifications de preuves. Les fiches importées ne le sont que là où l’enrichissement a trouvé de quoi noter, et sont sinon laissées sans note plutôt que de recevoir une valeur par défaut.',
    metricConfidenceCaveat:
      '"Non noté" est de loin la tranche la plus large et le restera. Cela veut dire que personne n’a encore évalué la fiche — pas qu’elle a mal noté, ni que l’aliment est douteux.',
    metricByContinentTitle:
      'Où sont les fiches',
    metricByContinentCounts:
      'Fiches par continent, chaque fiche comptée une fois. Une tradition se place sur le continent du pays où elle est consignée, pas sur celui d’où elle a pu voyager.',
    metricByContinentMethod:
      'À partir du pays de chaque fiche, via une table pays-continent couvrant environ 200 États, y compris historiques. Les entités supranationales et contestées sont regroupées plutôt que forcées dans un continent.',
    metricByContinentCaveat:
      'Ceci est une carte des sources, pas de la cuisine du monde. L’Europe est en tête parce que les registres européens sont en ligne et ouverts, ce qui est un fait sur les archives.',
    howIsThisCounted:
      'Comment est-ce compté ?',
    hideHowThisIsCounted:
      'Masquer le mode de calcul',
    stapleGrains: 'Céréales',
    stapleRoots: 'Racines',
    staplePulses: 'Légumineuses',
    stapleDairy: 'Produits laitiers',
    stapleMeatFish: 'Viande et poisson',
    stapleVegetables: 'Légumes',
    stapleAromatics: 'Aromates',
    stapleSweetSour: 'Sucré et acide',
    stapleRice: 'Riz',
    stapleWheat: 'Blé',
    stapleMaize: 'Maïs',
    stapleMillet: 'Millet',
    stapleSorghum: 'Sorgho',
    stapleBarley: 'Orge',
    stapleOats: 'Avoine',
    stapleBuckwheat: 'Sarrasin',
    stapleTeff: 'Teff',
    staplePotato: 'Pomme de terre',
    stapleCassava: 'Manioc',
    stapleSweetPotato: 'Patate douce',
    stapleYam: 'Igname',
    stapleTaro: 'Taro',
    staplePlantain: 'Plantain',
    stapleLentil: 'Lentilles',
    stapleChickpea: 'Pois chiches',
    stapleSoy: 'Soja',
    stapleTofu: 'Tofu',
    stapleBlackBean: 'Haricots noirs',
    stapleMungBean: 'Haricots mungo',
    staplePigeonPea: 'Pois d’Angole',
    stapleMilk: 'Lait',
    stapleYoghurt: 'Yaourt',
    stapleCheese: 'Fromage',
    staplePaneer: 'Paneer',
    stapleGhee: 'Ghee',
    stapleButter: 'Beurre',
    stapleCoconut: 'Noix de coco',
    stapleChicken: 'Poulet',
    stapleBeef: 'Bœuf',
    staplePork: 'Porc',
    stapleLamb: 'Agneau',
    stapleGoat: 'Chèvre',
    stapleFish: 'Poisson',
    staplePrawn: 'Crevettes',
    stapleEgg: 'Œufs',
    stapleOnion: 'Oignon',
    stapleGarlic: 'Ail',
    stapleGinger: 'Gingembre',
    stapleChilli: 'Piment',
    stapleLemongrass: 'Citronnelle',
    stapleTomato: 'Tomate',
    stapleAubergine: 'Aubergine',
    stapleCabbage: 'Chou',
    stapleSpinach: 'Épinard',
    stapleOkra: 'Gombo',
    stapleTamarind: 'Tamarin',
    stapleHoney: 'Miel',
    stapleJaggery: 'Jaggery',
    stapleDate: 'Dattes',
    stapleLemon: 'Citron',
    stapleOlive: 'Olive',
    dietVegan: 'Végétalien',
    dietVegetarian: 'Végétarien',
    dietSeafood: 'Produits de la mer',
    dietMeat: 'Non végétarien',
    dietUnclassified: 'Non classé',
    dietPoultry: 'Volaille',
    dietPork: 'Porc',
    dietBeef: 'Bœuf et viande rouge',
    dietLambGoat: 'Agneau et chèvre',
    dietGame: 'Gibier',
    dietFish: 'Poisson',
    dietShellfish: 'Crustacés et coquillages',
    dietOtherSeafood: 'Autres produits de la mer',
    dietDairy: 'Contient des produits laitiers',
    dietEgg: 'Contient des œufs',
    dietHoney: 'Contient du miel',
    mealBreakfast: 'Petit-déjeuner',
    mealLunch: 'Déjeuner',
    mealDinner: 'Dîner',
    mealSupper: 'Souper',
    mealSnack: 'En-cas',
    mealStreetFood: 'Cuisine de rue',
    mealCelebration: 'Fête et banquet',
    mealAnytime: 'À toute heure',
    mealUnclassified: 'Non consigné',
    searchModeFind:
      'Trouver un plat',
    searchModePantry:
      'Cuisiner avec ce que j’ai',
    ingredientsYouHave:
      'Les ingrédients que vous avez',
    nTraditions:
      '{n} traditions',
    nothingYet:
      'Rien pour l’instant',
    methodRecorded:
      ' · méthode consignée',
    noMethodYet:
      ' · pas encore de méthode',
    showMoreLeft:
      'Voir plus — il en reste {n}',
    showNMore:
      'Voir {n} de plus',
    methodAsPublished:
      'La méthode telle qu’elle a été publiée. Le matériel moderne et les raccourcis en font partie.',
    methodTraditional:
      'La méthode traditionnelle, sans aucun raccourci moderne substitué.',
    everythingClassified:
      'Tout ce qui est classé {what}',
    everythingFrom:
      'Tout ce qui vient de {place}',
    everythingRecordedAs:
      'Tout ce qui est consigné comme {what}',
    everythingMadeWith:
      'Tout ce qui est préparé avec {ingredient}',
    seeEverything:
      '{label} — tout voir',
    noPhotographOnRecord:
      '{label} — aucune photographie au dossier',
    scoreOutOf100:
      '{label} : {value} sur 100',
    removeFilter:
      'Retirer le filtre {key}',
    anywhereInTheAtlas:
      ' partout dans l’atlas',
    absenceOfRecords:
      '. C’est une absence de fiches, pas une absence de plats — nous préférons dire que nous ne savons pas.',
    narrowToA:
      'Affiner à {level} · {n} consignés',
    fromTheTown:
      ' — de la ville même',
    showFewer:
      'Voir moins',
    readAboutOnWikipedia:
      'Lire sur {name} en {language} sur Wikipédia',
    languageChangeIt:
      'Langue : {language}. La changer.',
    perCentTranslated:
      '{language}, traduit à {n} pour cent',
    translateThisRecord:
      'Traduire cette fiche',
    translating:
      'Traduction…',
    translate:
      'Traduire',
    translateThisConfirmation:
      'Traduire cette confirmation en {language}',
    couldNotTranslate:
      'Traduction impossible — réessayez',
    howThisIsCountedFor:
      'Comment {figure} est compté',
    countOfTotal:
      '{label} : {count} sur {total}',
    watchAtSourceCreator:
      'Voir {creator} à la source',
    stillFromCreator:
      'Image tirée de {creator}',
    thatDidNotSend:
      'L’envoi n’a pas abouti.',
    containsAlcohol:
      'Contient de l’alcool',
    nothingElseRequired:
      'Tout le reste est bienvenu et rien n’est obligatoire — savoir d’où vient un plat et que personne ne l’a écrit, c’est déjà plus que ce que contient n’importe quelle source ici.',
    opensTheFormPrefilled:
      'Cela ouvre le formulaire à sa source avec ce que vous avez déjà écrit prérempli. Cette application ne recueille rien sur vous, et rien n’est publié tant que des gens du lieu ne l’ont pas confirmé.',
    scoreDimGeographic:
      'Lien géographique',
    scoreDimIngredients:
      'Ingrédients traditionnels',
    scoreDimTechnique:
      'Technique traditionnelle',
    scoreDimLocalSource:
      'Source locale',
    scoreDimDocumentation:
      'Documentation culturelle',
    scoreDimCommunity:
      'Validation par la communauté',
    photoFromWikidata:
      'Jointe à la fiche Wikidata de ce plat — pas trouvée par le nom',
    photoFromArticle:
      'L’image principale de l’article d’encyclopédie de ce plat',
    photoFromRecipe:
      'Publiée sur la page de cette recette',
    photoFromSearch:
      'Trouvée par le nom sur Wikimedia Commons — le sujet n’est pas confirmé',
    photoFromUnknown:
      'Provenance non consignée — considérez le sujet comme non confirmé',
    noTranslationRecorded:
      'Aucune traduction de ce témoignage n’a encore été consignée ; il est donc affiché en {language}, la langue dans laquelle il a été consigné. Nous préférons vous montrer l’original que la supposition d’une machine sur un temps de fermentation.',
    machineTranslationBy:
      'Traduction automatique par {translator}. Personne de la communauté ne l’a vérifiée — les noms d’ingrédients et d’ustensiles restent dans l’original.',
    translatedBy:
      'Traduit par {translator}. Les noms d’ingrédients et d’ustensiles restent dans l’original.',
    videoOriginalAudio:
      'Parlé en {language} — la langue de la personne qui cuisine. Rien n’est traduit.',
    videoCreatorTrack:
      'L’auteur a publié une piste audio en {language}. La vidéo s’ouvre sur cette piste à la source — la traduction est la sienne, pas la nôtre.',
    videoPlatformCaptions:
      'Parlé en {spoken}. S’ouvre avec des sous-titres en {preferred} traduits automatiquement par-dessus l’audio d’origine — la voix de la personne qui cuisine n’est pas remplacée, et la traduction est celle de la plateforme vidéo, pas celle d’un humain.',
    videoLanguageUnknown:
      'Nous n’avons pas la langue parlée de cette vidéo, nous ne pouvons donc pas promettre {language}. Elle s’ouvre à la source, où s’appliquent les options de sous-titres de la plateforme.',
    figureDocumented:
      'A une méthode consignée',
    figureDocumentedNote:
      'Le chiffre qui dit s’il s’agit d’un atlas ou d’une liste de noms. Tout le reste lui est secondaire.',
    figureLocated:
      'Situé en dessous du pays',
    figureLocatedNote:
      'L’authenticité a une profondeur géographique. « Kozhikode » est une fiche ; « Inde » est à peine un début.',
    figureIllustrated:
      'A une photographie',
    figureIllustratedNote:
      'Un plat que personne ne peut se représenter est difficile à aimer, et plus difficile encore à reconnaître.',
    figureFilmed:
      'A une vidéo classée',
    figureFilmedNote:
      'Classée selon la proximité de la personne qui cuisine avec la tradition — pas un résultat de recherche.',
    figureAssessed:
      'Classés authentiques',
    figureAssessedNote:
      'Obtenu par les vérifications de preuves. Une part faible ici est honnête, pas un échec.',
    atlasSummary:
      '{n} traditions consignées dans {c} pays. La couverture est annoncée honnêtement : un pays absent ici n’a encore rien de consigné, ce n’est pas qu’il n’y ait rien à consigner.',
    nothingRecorded:
      'Rien de consigné',
    nothingRecordedAs:
      'Rien de consigné comme {what}',
    nothingRecordedAsAnd:
      'Rien de consigné comme {list} et {last}',
    photoVia:
      'photo via',
    photoNothingEntered:
      'Rien n’a encore été saisi.',
    photoNothingEnteredFix:
      'Collez le nom du fichier Commons ou le lien vers sa page.',
    photoWrongHost:
      'Ce lien mène à {host}, et nous n’avons pas le droit d’y publier une photographie.',
    photoWrongHostFix:
      'Si la photographie est la vôtre, déposez-la sur Wikimedia Commons sous licence libre et collez ici le nom du fichier. Elle reste la vôtre, vous êtes crédité partout où elle paraît, et cela ne coûte rien.',
    photoNotCommons:
      'Ce lien n’est pas sur Wikimedia Commons.',
    photoNotCommonsFix:
      'Seuls les fichiers de Commons peuvent être publiés ici, car eux seuls portent une licence qui nous permet de les montrer.',
    photoNoFileName:
      'Aucun nom de fichier trouvé là-dedans.',
    photoNoFileNameFix:
      'Collez le nom du fichier, par exemple Kaipola.jpg.',
    photoNotAPhotograph:
      'Ce n’est pas un fichier de photographie.',
    photoNotAPhotographFix:
      'Les photographies de Commons finissent en .jpg, .png ou .webp. Les schémas et les logos ne sont pas utilisés ici.',
    photoIsADrawing:
      'C’est un dessin, pas une photographie.',
    photoIsADrawingFix:
      'Utilisez une photographie du plat tel qu’il a été préparé.',
    serverRefused:
      'Le serveur l’a refusé ({status}).',
    serverTookTooLong:
      'Le serveur a mis trop de temps à répondre.',
    couldNotReachServer:
      'Impossible de joindre le serveur.',
    nothingYouTypedIsLost:
      '{message} Votre saisie n’a pas été envoyée — rien de ce que vous avez tapé n’est perdu, réessayez dans un instant.',
    proposalsNotOpen:
      'Les propositions ne sont pas encore ouvertes.',
    confirmationsNotOpen:
      'Les confirmations ne sont pas encore ouvertes.',
    alreadyProposed:
      'Ce plat a déjà été proposé. Ouvrez-le et confirmez-le : c’est cela qui le fait avancer.',
    alreadyConfirmed:
      'Vous avez déjà confirmé celui-ci.',
    youProposedThis:
      'Vous avez proposé ce plat, il faut donc que quelqu’un d’autre le confirme.',
    stillNeededList:
      'Il manque encore : {list}.',
    listAnd:
      '{list} et {last}',
    listOr:
      '{list} ou {last}',
    proposalConfirmed:
      'Confirmé. Entre dans l’atlas à la prochaine mise à jour.',
    proposalNobodyYet:
      'Personne ne l’a encore confirmé. {n} personnes qui connaissent le plat le feraient entrer dans l’atlas.',
    proposalSoFar:
      '{have} confirmations sur {n}. {short} de plus, venant de gens qui connaissent le plat, le feraient entrer.',
    recordNobodyYet:
      'Personne du lieu ne l’a encore confirmé. {n} confirmations l’authentifieraient.',
    recordSoFar:
      '{have} confirmations sur {n}. {short} de plus, venant de gens qui connaissent le plat, l’authentifieraient.',
    atRiskNote:
      'Signalé parce qu’une source décrit cette tradition comme en déclin ; la phrase est affichée avec la fiche. Cela ne se déduit jamais du peu que nous avons consigné : un vide dans nos fiches n’est pas la preuve que quiconque a cessé de cuisiner.',
    originDisclaimer:
      'Ce plat fait l’objet de plusieurs revendications historiques documentées. Les traditions ci-dessous sont consignées telles que chaque lieu les décrit, avec leurs sources. Aucune revendication n’est présentée ici comme la gagnante, et rien de tout cela n’affecte la note d’authenticité : celle-ci mesure comment le plat est préparé dans un lieu, pas qui l’a fait en premier.',
    supportRunsOn:
      'Tout ce que contient l’atlas vient de Wikipédia, Wikidata, Wikimedia Commons, Wikibooks et de registres régionaux ouverts. Ces sources sont libres de lecture, sous licence ouverte, et créditées sur chaque fiche qui les utilise. C’est là toute la raison pour laquelle le projet reste gratuit, et c’est une décision, pas une étape.',
    contributeToTheAtlas:
      'Contribuer à l’atlas',
    answeredByDocuments:
      'Les documents peuvent y répondre',
    answeredByPeople:
      'Seules des personnes peuvent y répondre',
    scaleDocumentsStop:
      'les documents s’arrêtent ici',
    scaleAuthenticBegins:
      'Authentique commence',
    pantryNothingUses:
      'Rien de ce qui est consigné n’utilise {list}. Cela peut vouloir dire que personne n’a noté un plat qui le fasse : {p}% de l’atlas n’a aucun ingrédient renseigné.',
    alsoRecordedIn:
      'Également enregistré sous {list}',
    alsoRecordedNote:
      'L’atlas conserve une fiche distincte pour ce plat là-bas. Aucune ne corrige l’autre : un plat que deux cultures préparent n’est une erreur dans aucune des deux.',
    chooseACountry:
      'Choisissez un pays',
    filterTheList:
      'Tapez pour filtrer la liste',
    showingFirstNOfM:
      'Affichage des {n} premiers sur {m}. Continuez à taper pour affiner.',
    nothingMatchesThat:
      'Rien dans la liste ne correspond.',
    continentBeyondOneCountry:
      'Au-delà d’un seul pays',
    beyondOneCountryNote:
      'Des origines que les sources enregistrent comme plus larges qu’un seul pays : une région, une aire culinaire partagée ou un État qui n’existe plus. Elles sont conservées telles que la source les énonce, sans être réduites à un pays que personne n’a choisi.',
    connectionGrewUpThere:
      'J’y ai grandi',
    connectionLiveThere:
      'J’y habite',
    connectionFamilyFrom:
      'Ma famille en est originaire',
    connectionLearnedThere:
      'J’ai appris à le faire là-bas',
    connectionCookProfessionally:
      'Je le cuisine là-bas professionnellement',
    chooseYourConnection:
      'Choisissez ce qui s’applique',
    connectionInYourWords:
      'Ce que vous voulez ajouter, avec vos mots',
    connectionDetailPlaceholder:
      'Ma grand-mère le faisait chaque Aïd à Kozhikode',
    dictateSpeak:
      'Parler plutôt qu’écrire',
    dictateListening:
      'À l’écoute — touchez pour arrêter',
    dictateStop:
      'Arrêter l’écoute',
    dictateSendsAudio:
      'C’est votre navigateur qui écoute, et la plupart envoient l’audio à leurs propres serveurs pour le faire. Ce que vous dites est ajouté dans le champ ci-dessus, où vous pouvez le corriger.',
    dictateNotAllowed:
      'Le navigateur n’a pas autorisé le microphone.',
    dictateDidNotWork:
      'Cela n’a pas marché. Vous pouvez toujours l’écrire.',
    polishTidyThis:
      'Corriger ma frappe',
    polishWorking:
      'Correction…',
    polishMachineMade:
      'Proposé par une machine — vos mots restent au-dessus',
    polishUseThis:
      'Utiliser ceci',
    polishKeepMine:
      'Garder les miens',
    polishOnlyTyping:
      'Seules l’orthographe, la ponctuation et les espaces sont touchées. Rien n’est ajouté, retiré ni reformulé, et aucun nom n’est changé.',
    polishFoundNothing:
      'Rien à corriger : ce que vous avez écrit se lit bien.',
    polishDidNotWork:
      'Cela n’a pas marché. Ce que vous avez écrit est inchangé.',
    continentAfrica:
      'Afrique',
    continentAsia:
      'Asie',
    continentEurope:
      'Europe',
    continentNorthAmerica:
      'Amérique du Nord',
    continentSouthAmerica:
      'Amérique du Sud',
    continentOceania:
      'Océanie',
    regionLevant:
      'Levant',
    regionLatinAmerica:
      'Amérique latine',
    regionMiddleEast:
      'Moyen-Orient',
    regionMaghreb:
      'Maghreb',
    regionCentralEurope:
      'Europe centrale',
    regionEasternEurope:
      'Europe de l’Est',
    regionSouthernEurope:
      'Europe du Sud',
    regionCentralAsia:
      'Asie centrale',
    regionIndianSubcontinent:
      'sous-continent indien',
    regionNorthAfrica:
      'Afrique du Nord',
    regionAmericas:
      'Amériques',
    regionAncientNearEast:
      'Proche-Orient ancien',
    regionBalkans:
      'Balkans',
    regionCaribbean:
      'Caraïbes',
    regionLowCountries:
      'Pays-Bas historiques',
    regionMesoamerica:
      'Mésoamérique',
    regionMiddleEasternEmpires:
      'empires du Moyen-Orient',
    regionPolishLithuanianCommonwealth:
      'République des Deux Nations',
    regionQajarIran:
      'Iran qajar',
    regionRussianEmpire:
      'Empire russe',
    regionSouthCaucasus:
      'Caucase du Sud',
    regionSovietCentralAsia:
      'Asie centrale soviétique',
    regionWu:
      'Wu',
    regionArtsakh:
      'République d’Artsakh',
    refineDietOccasion:
      'Régime et occasion',
    refineAny:
      'Tous',
    placeKindWiderRegion:
      'région étendue',
    placeKindFormerState:
      'état historique',
    oneTradition:
      '1 tradition',
    onePlace:
      '1 lieu',
    nPlaces:
      '{n} lieux',
    countryLevelOnly:
      'au niveau du pays uniquement',
    summaryWorldwide:
      ' dans le monde entier',
    nRecorded:
      '{n} enregistrées',
    writtenInLanguage:
      'Écrit en {language}',
    whatThisIs:
      'Ce que c’est',
    atlasDefinition:
      'Un atlas gratuit des plats traditionnels : d’où vient chacun, et qui s’en porte garant.',
    traditionsLabel:
      'traditions',
    freeNoAds:
      'Gratuit, sans publicité',
    quotedFromSource:
      'Cité de la source ci-dessous — un compte rendu général de la préparation du plat, et non un relevé de la façon dont il se fait à {place}.',
    adaptationLeadIn:
      'Comment ce plat se prépare couramment aujourd’hui. Ce n’est pas un relevé de sa préparation à {place}, et personne de là-bas ne l’a confirmé.',
    openDisagreementBody:
      'Quelqu’un qui cuisine ce plat à {place} dit qu’il se fait autrement : {differs} Rien n’a été retiré pendant l’examen, et l’indice de confiance ci-dessous reste inchangé — si les deux récits tiennent, la fiche se scindera plutôt que l’un ne l’emporte.',
    engagementNotShown:
      'Les chiffres d’audience ne sont volontairement pas affichés : ils ne mesurent pas l’authenticité.',
    videoSearchNote:
      'Vous pouvez en chercher une à la source. Les résultats arrivent classés par nombre de vues, ce qui mesure la portée et rien d’autre — la personne aux fourneaux peut venir de {place} ou non. Rien de ce qui est trouvé ainsi n’affecte le classement de cette fiche.',
    nowOpenForConfirmation:
      '{name} est maintenant ouvert à confirmation.',
    proposalOpenBody:
      'Il faut que {n} personnes qui connaissent le plat le confirment avant qu’il entre dans l’atlas. Tout le monde peut le voir et le confirmer dès maintenant — y compris les personnes à qui vous en parlez, ce qui est souvent ainsi qu’un plat que personne n’avait noté finit par être confirmé.',
    nothingMatchesBody:
      'Rien dans l’atlas ne correspond à {query} pour l’instant. Une absence ici signifie qu’il n’y a pas de fiche, pas qu’il n’y a pas de plat — nous préférons dire que nous ne savons pas plutôt que de deviner.',
    thatWord:
      'cela',
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
      '{n} Traditionen, vollständig aus Quellen gebaut, die frei zu lesen und offen lizenziert sind. Keine Werbung, kein Tracking, nichts hinter einer Bezahlschranke. Was der Betrieb verlangt, deckt diese Wahl der Quellen — nicht jemand, der dafür zahlt, hier zu stehen.',
    notForSaleAuthentic:
      'Ein Eintrag kann nicht durch Bezahlen echt werden. Das kommt aus Belegen und von Menschen, die das Gericht kochen.',
    notForSalePromotion:
      'Kein Gericht wird beworben, höher gereiht oder hervorgehoben, weil jemand bezahlt hat.',
    notForSaleAdvertising:
      'Nichts hier ist Werbung, und kein Lesender wird verfolgt.',
    donationFootnote:
      'Öffnet bei Open Collective. Hier wird nichts eingezogen — diese App hält keine Ihrer Zahlungsdaten und wird das nie tun.',
    donationsPendingBody:
      'Es gibt noch keinen Ort, an den Geld gehen könnte. Nichts am Atlas hängt davon ab — er steht auf frei lesbaren Quellen, und daran ändert sich nichts.',
    mostUsefulThing:
      'Das Nützlichste, das jemand diesem Atlas geben kann, ist kein Geld. Das meiste davon ist ein Name und ein Ort, weil niemand aufgeschrieben hat, wie das Essen gemacht wird.',
    administration:
      'Verwaltung',
    administrationNote:
      'Schwellenwerte, Moderation, Quellenprüfungen und Nutzung. Erfordert ein Token.',
    howLead:
      'Das ist die Regel, auf der dieser Atlas gebaut ist, und sie ist Arithmetik statt Politik — Sie können sie also prüfen, statt ihr zu glauben.',
    sixDimensionsBody:
      'Jeder Eintrag wird nach denselben sechs Dimensionen bewertet, und alle sechs stehen auf dem Eintrag selbst. Der Wert ist ihr Durchschnitt, wer ihn also bezweifelt, kann die Zahlen zusammenzählen.',
    ceilingBody:
      'Drei dieser sechs kann kein jemals geschriebenes Dokument beantworten. Keine Enzyklopädie weiß, ob eine Zubereitung die Zubereitung eines Ortes ist; kein Register ist ein Mensch aus dem Ort. Sind diese drei leer, ist das Beste, was ein Eintrag allein aus veröffentlichten Quellen erreichen kann, {ceiling}.',
    thresholdBody:
      'Ein Eintrag heißt ab {threshold} echt. Der Abstand zwischen diesen beiden Zahlen ist Absicht und ist das ganze Argument: Schließen können ihn nur Menschen, die das Gericht kennen.',
    whatClosesItBody:
      '{n} Bestätigungen von Menschen, die ihre Verbindung zu dem Ort angeben — und die sagen, was sie bestätigen, nicht bloß, dass sie zustimmen. Beides steht auf dem Eintrag, denn ein Satz wie „in Kozhikode geboren — wir nehmen Ghee, nicht Öl“ ist ein Beleg, den man abwägen kann, während „{n} Bestätigungen“ eine Zahl ist, der man glauben muss.',
    accountsBody:
      'Diese {n} müssen {n} verschiedene Menschen sein, deshalb zählt eine Bestätigung nur dann für das Abzeichen, wenn die Person angemeldet war. Eine anonyme wird dennoch erfasst und auf dem Eintrag gezeigt — was jemand weiß, ist es wert, festgehalten zu werden, ob mit Konto oder ohne — sie bewegt nur die Zahl nicht. Zum Lesen des Atlas ist nie eine Anmeldung nötig.',
    whichIsWhereYouComeInBody:
      'Für den größten Teil des Atlas spricht niemand. Wenn Sie wissen, wie ein Gericht dort gemacht wird, wo Sie herkommen, ist das das Einzige, was keine Quelle liefern und kein Sammeln erreichen kann.',
    notRatings:
      'Keine Bewertungen. Niemand gibt einem Gericht Sterne.',
    notComments:
      'Keine Kommentare und kein Feed. Es gibt hier nichts, womit man interagieren soll.',
    notAlgorithm:
      'Kein Algorithmus entscheidet, was Sie sehen. Die Reihenfolge sind die Belege, und Sie können sie ändern.',
    notAdvertising:
      'Keine Werbung, und kein Lesender wird verfolgt.',
    notPopularity:
      'Beliebtheit wird erfasst und getrennt gehalten. Die meistveröffentlichte Fassung eines Gerichts wird nie die echte.',
    dimensionOrigin:
      'Woher das Gericht kommt, und wie genau. Ein Ort schlägt ein Land.',
    dimensionIngredients:
      'Woraus es besteht, so wie die Tradition es macht.',
    dimensionTechnique:
      'Wie es gemacht wird — nicht dass jemand ein Rezept veröffentlicht hat, sondern dass dies die Zubereitung des Ortes ist.',
    dimensionLocalSource:
      'Jemand mit angegebener Verbindung zu dem Ort hat dafür gesprochen.',
    dimensionDocumentation:
      'Ein Register, eine Inschrift oder eine Enzyklopädie hat es festgehalten.',
    dimensionCommunity:
      'Menschen von dort haben es bestätigt und gesagt, was sie bestätigen.',
    fromDocuments:
      'Dokumente können',
    fromPeople:
      'nur Menschen',
    contributeLead:
      'Halten Sie es so fest, wie es dort gemacht wird, wo Sie sind. Aus diesem Formular allein wird nichts veröffentlicht — es geht zuerst durch die Bewertung und durch die Bestätigung der Gemeinschaft.',
    writeItTheWayYouWriteIt:
      'Schreiben Sie den Namen des Gerichts so, wie Sie ihn schreiben',
    editorialRuleBody:
      'Bessern Sie unseren Text frei aus — Rechtschreibung, Grammatik, alles, was sich schlecht liest. Bessern Sie das Gericht selbst nicht aus. Ein Gerichtsname, eine Zutat, ein Gerät und ein Ort bleiben genau so, wie die Menschen sie schreiben, die es kochen, samt aller Zeichen. Wenn zwei Schreibweisen auseinandergehen, sind das meist zwei Gemeinschaften und kein Fehler, und beide bleiben stehen.',
    photographTitle:
      'Ein Foto davon, falls Sie eines haben',
    photographBody:
      'Veröffentlichen Sie Ihr eigenes Foto auf Wikimedia Commons und fügen Sie hier den Dateinamen ein. Es bleibt Ihres, Sie werden überall genannt, wo es erscheint, und es kostet weder Sie noch uns etwas. Von Instagram oder TikTok dürfen wir keines nehmen — ein Foto dort steht unter dem Urheberrecht seines Urhebers, und eine Namenszeile ist keine Erlaubnis.',
    walkthroughNoteBody:
      'Was folgt, ist ein durchgerechnetes Beispiel dafür, was mit einer Einreichung geschieht — die Befunde, die Prüfungen und die vorläufige Punktzahl unten stammen aus einem Eintrag, der bereits im Atlas steht, nicht aus dem, was Sie gerade eingegeben haben. Ihre Eingabe wird hier nicht bewertet; sie wird von Menschen bewertet, nachdem sie abgeschickt wurde.',
    examplePreparedBy:
      'Haushalte in Malabar, zubereitet zum Iftar und zu Familienanlässen',
    exampleConnection:
      'In Kozhikode geboren und dort am Herd',
    exampleIngredients:
      'Reife Nendran-Banane, Eier, Ghee, Zucker, Cashewkerne, Rosinen; in einer schweren Pfanne bei niedriger Kohle- oder Gasflamme gegart, mit einem Deckel bedeckt, der mit Glut beschwert ist',
    shelfFromCountry:
      'Aus {country}',
    shelfFromCountryNote:
      'Was der Atlas aus {country} hat. Dass es hier stimmt, ist für Sie mehr wert als irgendwo sonst — Sie können beurteilen, ob es richtig ist.',
    sending:
      'Wird gesendet…',
    missionHeadline:
      'Jedes Gericht hier zeigt seine Belege.',
    missionStakes:
      'Woher es kommt, wer das sagt und wie viel tatsächlich belegt ist — auf jedem Eintrag abgedruckt und von jedem nachprüfbar, der daran zweifelt.',
    statDishes:
      'Gerichte',
    statCountries:
      'Länder',
    statDocumented:
      'belegt',
    statRegistered:
      'eingetragen',
    statAuthentic:
      'authentisch',
    missionAsk:
      'Bei {n} davon ist keine Zubereitung festgehalten. {people} Menschen von einem Ort können eines davon dauerhaft schließen.',
    missionAskBody:
      'Niemand hat aufgeschrieben, wie sie gemacht werden — nicht auf Englisch, in keiner Sprache, nirgends, wo eine Maschine hinkommt. Kein Archiv, keine Enzyklopädie und nichts Automatisches kann sie stattdessen bestätigen; das ist Arithmetik in der Bewertung, keine Vorschrift. Wenn Sie eines kochen, sind Sie die einzige Person, die es kann.',
    recordADishYouKnow:
      'Halten Sie ein Gericht fest, das Sie kennen',
    howItGetsAuthenticated:
      'Wie ein Gericht bestätigt wird',
    submissionsNotOpen:
      'Einreichungen sind noch nicht offen — es gibt keinen Ort, an den sie gehen könnten. Der Weg oben erklärt, was dann geschieht.',
    freeAndStayingFree:
      'Kostenlos, und das bleibt so. Keine Werbung, kein Tracking, kein eingesammeltes Geld. Ein Konto braucht es nur, um ein Gericht zu bestätigen — nie, um eines zu lesen.',
    noRatingsNoComments:
      'Keine Bewertungen, keine Kommentare und kein Algorithmus, der entscheidet, was Sie sehen — Listen beginnen mit Belegen, nicht mit Beliebtheit. Aufrufe werden als Gericht und Datum gezählt, nie als Person.',
    whyASourceCannot:
      'Warum eine Quelle ein Gericht nicht bestätigen kann',
    whyASourceCannotBody:
      'Veröffentlichte Belege kommen hier über {ceiling} nicht hinaus, und ein Eintrag gilt ab {threshold} als authentisch. Diesen Abstand schließen nur Menschen, die mit dem Ort verbunden sind. Die sechs Zahlen hinter jeder Bewertung stehen auf dem Eintrag, sodass jeder, der der Zahl misstraut, sie nachrechnen kann.',
    whyTheAtlasStops:
      'Deshalb hört der Atlas auch dort auf, wo er aufhört. Jede freie Quelle wurde gelesen — Enzyklopädien, Kochbücher, Denkmalregister, Ortsverzeichnisse — und bei {n} Einträgen ist immer noch nichts darüber festgehalten, wie sie gemacht werden. Was übrig ist, wurde nie aufgeschrieben.',
    levelLocal:
      'Authentisch — lokal',
    levelLocalFull:
      'Authentisch — lokal/traditionell',
    levelRegional:
      'Authentisch — regional',
    levelVariation:
      'Traditionelle Variante',
    levelAdaptation:
      'Moderne Abwandlung',
    levelFusion:
      'Fusion',
    levelUnverified:
      'Ungeprüft',
    levelUnverifiedFull:
      'Ungeprüft — zu wenig Belege',
    filterAuthenticOnly:
      'Nur authentische',
    filterTraditionalVariations:
      'Traditionelle Varianten',
    filterModernAdaptations:
      'Moderne Abwandlungen',
    filterFusion:
      'Fusion',
    filterUnverified:
      'Ungeprüfte',
    filterAll:
      'Alle',
    geoCountry:
      'Land',
    geoRegion:
      'Region',
    geoProvince:
      'Provinz oder Bezirk',
    geoCity:
      'Stadt oder Ort',
    geoVillage:
      'Dorf oder Gemeinschaft',
    chooseRegion:
      'Region wählen',
    chooseProvince:
      'Provinz oder Bezirk wählen',
    chooseCity:
      'Stadt oder Ort wählen',
    chooseVillage:
      'Dorf oder Gemeinschaft wählen',
    typeToSearchLevel:
      'Tippen, um zu suchen…',
    browseAllTraditions:
      'Alle {n} Traditionen ansehen',
    geoPlace:
      'Ort',
    noLevelRecorded:
      'Unter diesem Namen ist noch kein {level} erfasst. Was hier fehlt, fehlt im Verzeichnis — nicht in der Küche.',
    browseCuisine:
      '{cuisine} Küche',
    browseMadeWith:
      'mit {ingredient} gemacht',
    browseEverything:
      'Alles',
    within:
      'Innerhalb von {path}',
    chooseCountryHint:
      'Land wählen · {c} erfasst',
    chooseCountryHintBroader:
      'Land wählen · {c} erfasst, dazu {b} weiter gefasste Herkünfte',
    noRecordUnderThatReference:
      'Unter dieser Kennung ist im Atlas nichts erfasst. Was hier fehlt, fehlt im Verzeichnis — nicht in der Küche.',
    tagTraditionalPreparation:
      '🏺 Traditionelle Zubereitung',
    tagAtRiskTradition:
      '🕯️ Bedrohte Tradition',
    notEligibleForAuthentic:
      'Kommt für die Einstufung als authentisch nicht in Frage',
    lookingForWhatItBorrows:
      'Suchen Sie die Tradition, bei der es sich bedient?',
    howItsDescribed:
      'Wie es beschrieben wird',
    howItsMade:
      'Wie es gemacht wird',
    originAndAttribution:
      'Herkunft und kulturelle Zuordnung',
    nobodyRecordedTechnique:
      'Die Technik hat niemand festgehalten — die Zeiten, das Gefäß, die Reihenfolge der Handgriffe. Genau das würde diesen Eintrag aus Ungeprüft herausholen, und dafür braucht es jemanden, der es kocht.',
    nobodyHasRecorded:
      'Niemand hat festgehalten, wie {dish} gemacht wird{place}. Wir könnten das meistveröffentlichte Rezept aus dem Internet übernehmen und es authentisch nennen, aber genau dafür gibt es diesen Atlas nicht — also bleibt der Eintrag, wie er ist, bis jemand ihn ausfüllt, der es kocht. Wenn Sie das tun, wären Sie die erste Person, die es aufschreibt.',
    ifIngredientUnavailable:
      'Wenn die traditionelle Zutat nicht zu bekommen ist',
    commonModernSubstitute:
      'Üblicher moderner Ersatz: ',
    adaptationNotAuthentic:
      'Das ist eine Abwandlung und sollte nicht für die authentische Zubereitung gehalten werden.',
    whatTheInternetServes:
      'Was das Internet für dieses Gericht meist auftischt, und worin es von der Tradition oben abweicht.',
    popularNotAuthentic:
      'Beliebt, aber nicht die authentische Zubereitung. Maßgeblich bleibt die Fassung darüber.',
    videosRankedByCloseness:
      'Echte Videos, sortiert danach, wie nah die kochende Person an der Tradition ist — nicht nach Aufrufen.',
    stillFramesFromVideos:
      'Die Standbilder stammen aus den Videos selbst, das gezeigte Gericht ist also das Gericht dieser Person.',
    noVideoRecordedYet:
      'Für dieses Gericht ist noch kein Video aus der Tradition erfasst.',
    findOneFromThePlace:
      'Wenn Sie eines finden, das jemand von dort gemacht hat, lässt es sich über Eine Tradition hinzufügen ergänzen — das wäre es, was diesem Gericht ein eingestuftes Video gäbe.',
    siblingsNeitherIsReal:
      'Dasselbe Gericht, getrennt erfasst, wo es anders gemacht wird. Keines davon ist das echte.',
    doYouKnow:
      'Kennen Sie {subject}?',
    confirmWhatYouKnow:
      'Bestätigen Sie, was Sie wirklich wissen. Sie müssen nicht für den ganzen Eintrag geradestehen — eine bestimmte Sache von jemandem, der es kocht, wiegt mehr als allgemeine Zustimmung.',
    recordedThankYou:
      'Erfasst. Danke.',
    shownWithYourConnection:
      'Es steht auf dem Eintrag, mit Ihrer Verbindung daneben, damit Lesende selbst abwägen können.',
    signedInCounts:
      'Angemeldet — das zählt für das Abzeichen.',
    notSignedInNote:
      'Nicht angemeldet. Was Sie schreiben, steht mit Ihrer Verbindung auf dem Eintrag und bewegt das Abzeichen nicht: Diese Zahl steigt nur für angemeldete Menschen, damit eine Person nicht drei sein kann.',
    signInSoItCounts:
      'Anmelden, damit es zählt',
    shownOnTheRecord:
      'Steht auf dem Eintrag',
    whatCanYouConfirm:
      'Was können Sie bestätigen?',
    exampleSaid:
      'Wir nehmen Ghee, kein Öl — und es wird zum Eid gemacht, nicht das ganze Jahr.',
    fromTheTownItself:
      'Ich komme aus dem Ort oder Dorf selbst, nicht nur aus der weiteren Region',
    fromTheTownItselfLabel:
      'Ich komme aus dem Ort oder Dorf selbst, nicht aus der weiteren Region',
    exampleWhoMakesIt:
      'Zu Hause zum Eid gemacht, von den Großmüttern — optional',
    exampleIngredientLines:
      'reife Kochbanane\nEi\nGhee',
    exampleMethodLines:
      'Die Kochbanane zerdrücken.\nDas verquirlte Ei unterheben.',
    inPlace:
      ' in {place}',
    tagAtRiskShort:
      '🕯️ Bedroht',
    readThisIn:
      'Lesen auf',
    communityTranslation:
      'Übersetzung aus der Gemeinschaft',
    machineTranslation:
      'Maschinelle Übersetzung — noch von niemandem aus der Gemeinschaft geprüft',
    notTranslatedYet:
      'Noch nicht übersetzt',
    aDotMarks:
      'Ein Punkt kennzeichnet eine Sprache, in die dieser Eintrag schon übersetzt ist.',
    opensOnceMoreRecords:
      '{language} öffnet sich, sobald {n} weitere Einträge darin lesbar sind.',
    noTranslationService:
      'An diesen Build ist kein Übersetzungsdienst angeschlossen, es kann also nichts automatisch übersetzt werden. Eine Übersetzung von jemandem, der dieses Gericht kocht, ist ohnehin mehr wert — sie lässt sich über Eine Tradition hinzufügen beitragen.',
    whatTheseTermsMean:
      'Was diese Begriffe bedeuten',
    signedIn:
      'Angemeldet',
    signOut:
      'Abmelden',
    signedInSignOut:
      'Angemeldet. Abmelden.',
    confirmationsCount:
      'Ihre Bestätigungen zählen für das Abzeichen.',
    signIn:
      'Anmelden',
    signInSoConfirmationsCount:
      'Melden Sie sich an, damit Ihre Bestätigungen zählen',
    onlySignedInMovesBadge:
      'Nur Bestätigungen im angemeldeten Zustand bewegen ein Abzeichen.',
    watchAtSource:
      'An der Quelle ansehen ↗',
    originalAudio:
      'Originalton',
    creatorsOwnTranslation:
      'Übersetzung der Urheberin oder des Urhebers',
    translatedCaptions:
      'Übersetzte Untertitel',
    languageUnknown:
      'Sprache unbekannt',
    ingredientsInThisVideo:
      'In diesem Video verwendete Zutaten',
    weDontInventOne:
      'Die Person, die dieses Video gemacht hat, hat weder Zutatenliste noch schriftliche Anleitung veröffentlicht, und wir erfinden keine. Die traditionelle Zubereitung oben stammt aus den belegten Quellen unten.',
    captureFromVideo:
      'Zutaten und Schritte aus diesem Video festhalten →',
    dietaryPreference:
      'Ernährungsweise',
    narrowItDown:
      'Weiter eingrenzen',
    anyDiet:
      'Beliebige Ernährung',
    whenItsEaten:
      'Wann es gegessen wird',
    anyOccasion:
      'Beliebiger Anlass',
    alsoCalled:
      'Auch genannt',
    notATranslationOfOurs:
      'Jeder Name stammt aus dem Enzyklopädieartikel in der jeweiligen Sprache — er ist nicht von uns übersetzt und ersetzt nie den Namen darüber. Tippen Sie einen an, um ihn dort zu lesen.',
    relatedTraditions:
      'Verwandte Traditionen',
    relatedTraditionsNote:
      'Einträge, die mit diesem einen Ort, eine Tradition oder eine Zutat teilen. Jeder sagt, welches.',
    scoreCannotSettle:
      'Eine Schätzung, wie stark die Belege sind — keine Behauptung, dass eine Zahl kulturelle Wahrheit entscheiden könnte.',
    notScored:
      'Nicht bewertet',
    navAtlasNote:
      'Was erfasst ist, und wie sicher',
    navProposeNote:
      'Essen, zu dem der Atlas keinen Eintrag hat',
    navConfirmNote:
      'Gerichte, die auf jemanden warten, der sie kennt',
    navSupportNote:
      'Was der Betrieb kostet, und wer zahlt',
    confirmPrompt:
      'Wird es bei Ihnen so gemacht?',
    confirmAskBody:
      'Wenn Sie das dort kochen, wo es herkommt, ist Bestätigen oder Berichtigen genau das, was einen Eintrag aus Ungeprüft herausholt. Wo Ihre Fassung abweicht, wird sie neben dieser festgehalten — nicht an ihrer Stelle.',
    confirmYes:
      'Ja, das stimmt so',
    confirmNo:
      'Bei mir zu Hause macht man es anders',
    confirmPlacePrompt:
      'Stammt dieses Gericht von dort, wo wir es angeben?',
    confirmPlaceBody:
      'Niemand hat aufgeschrieben, wie dieses gemacht wird, also gibt es hier noch nichts, dem man zustimmen könnte. Der Ort ist das, was dieser Eintrag behauptet, und das allein ist eine Bestätigung wert — er ist eine der sechs Belegprüfungen.',
    confirmPlaceYes:
      'Ja, es ist von hier',
    confirmPlaceNo:
      'Nein, es kommt von woanders',
    standingMet:
      '{n} Menschen mit Verbindung zu {place} haben das bestätigt — die Zahl, die das Abzeichen verlangt.',
    standingNobody:
      'Bisher niemand',
    standingOne:
      'Bisher eine Person',
    standingMany:
      'Bisher {n} Menschen',
    standingNeed:
      '{soFar}. Das Abzeichen verlangt {need}, also würden {people} mit Verbindung zu {place} dafür reichen.',
    onePersonMore:
      'eine Person mehr',
    morePeople:
      '{n} Menschen mehr',
    contestedNote:
      'Hier eingeordnet, damit man es findet. {n} Orte haben einen belegten Anspruch auf dieses Gericht — keiner davon ist entschieden, und alle stehen unten.',
    relatedAlsoFrom:
      'Auch aus {place}',
    relatedAlsoCuisine:
      'Auch {cuisine}',
    relatedSharesIngredients:
      'Teilt {n} Zutaten',
    relatedAlsoUses:
      'Nutzt auch {ingredient}',
    relatedAlsoCategory:
      'Auch {category}',
    authenticVersion:
      'Authentische Fassung',
    thePublishedRecipe:
      'Das veröffentlichte Rezept',
    whyThisIsAnAdaptation:
      'Warum das eine Abwandlung ist',
    whyConsideredAuthentic:
      'Warum gilt das als authentisch?',
    whatThisRecordIs:
      'Was dieser Eintrag ist',
    stepSubmit:
      'Einreichen',
    stepWhatExists:
      'Was es gibt',
    stepAssessment:
      'Bewertung',
    stepValidation:
      'Bestätigung',
    findingAggregatorTitle:
      'Rezeptsammel-Seite',
    findingAggregatorTag:
      'Beliebte Kandidatin',
    findingAggregatorNote:
      'Bestplatziertes Ergebnis. Die Autorin nennt keine Verbindung zu Malabar; nimmt Butter statt Ghee.',
    findingVideoTitle:
      'Video eines Kochkanals auf Malayalam',
    findingVideoTag:
      'Örtliche Quelle',
    findingVideoNote:
      'In Kerala gefilmt, auf Malayalam gesprochen, mit Ghee und Nendran-Banane wie beschrieben.',
    findingGapTitle:
      'Kein Beleg auf Ortsebene gefunden',
    findingGapTag:
      'Lücke',
    findingGapNote:
      'Nichts belegt, wie es speziell in Kozhikode gemacht wird. Diese Einreichung wäre die erste.',
    checkOriginLabel:
      'Geografische Herkunft',
    checkOriginNote:
      'Malabar, Kozhikode — von der einreichenden Person angegeben und mit der Videoquelle stimmig.',
    checkLocalPrepLabel:
      'Örtliche Zubereitung',
    checkLocalPrepNote:
      'Beschrieben als Hausmannskost zum Iftar und zu Familienanlässen.',
    checkIngredientsLabel:
      'Traditionelle Zutaten',
    checkIngredientsNote:
      'Nendran-Banane, Eier, Ghee — stimmt mit dem Video der örtlichen Quelle überein.',
    checkTechniqueLabel:
      'Traditionelle Technik',
    checkTechniqueNote:
      'Niedrige Flamme, Deckel mit Glut beschwert.',
    checkDocumentationLabel:
      'Historische oder kulturelle Belege',
    checkDocumentationNote:
      'Dünn. Weder Forschung noch Archivbeleg gefunden.',
    checkLocalSourceLabel:
      'Örtliche Quelle',
    checkLocalSourceNote:
      'Die einreichende Person gibt an, in Kozhikode geboren zu sein und dort zu kochen.',
    checkCommunityLabel:
      'Bestätigung durch die Gemeinschaft',
    checkCommunityNote:
      'Noch nicht eingeholt. Deshalb kann der Eintrag noch nicht authentisch heißen.',
    validatorHomeCook:
      'Hausköchin, Kozhikode',
    validatorHomeCookSaid:
      'Hat die Zutaten und die Methode mit der Glut auf dem Deckel bestätigt.',
    validatorBakery:
      'Bäckereibesitzer, Thalassery',
    validatorBakerySaid:
      'Bestätigt, merkt an, dass seine Fassung weniger Zucker nimmt.',
    validatorWriter:
      'Gastronomiejournalistin, Kerala',
    validatorWriterSaid:
      'Als Hausgericht aus Malabar bestätigt; die Belegdichte ist wirklich dünn.',
    validatorPending:
      'Zwei weitere Prüfende eingeladen',
    validatorPendingSaid:
      'Antwort steht aus — der Eintrag erscheint auch ohne sie.',
    photoCheckedNote:
      'Wird beim Einreichen gegen Commons geprüft und mit Urheberin und Lizenz gezeigt. Es bleibt Ungeprüft, bis die Gemeinschaft es bestätigt, genau wie die Zubereitung.',
    mostPublishedNote:
      'Die meistveröffentlichte Fassung gilt als beliebte Kandidatin. Sie wird dadurch nicht zum authentischen Eintrag.',
    sevenChecksNote:
      'Sieben Prüfungen, jede beantwortet oder offen gelassen. Offene Prüfungen senken die Belegstärke — ausgefüllt wird nie nach Vermutung.',
    draftConfidence:
      '/100 vorläufige Belegstärke',
    unverifiedPendingTag:
      '⚪ Ungeprüft — Bestätigung der Gemeinschaft steht aus',
    oneSubmitterNote:
      'Eine einreichende Person von dort ist ein Beleg, kein Beweis. Der Eintrag bleibt Ungeprüft, bis Menschen aus der Gemeinschaft ihn bestätigen.',
    threeConfirmationsNote:
      'Drei Bestätigungen von Menschen, die dort leben oder kochen, holen einen Eintrag aus Ungeprüft heraus.',
    conflictingAccountsNote:
      'Widersprechende Schilderungen bleiben beide stehen. Der Eintrag teilt sich in die Traditionen, die Menschen tatsächlich beschrieben haben — eine je Region oder Gemeinschaft — und keine Fassung wird zur wahren erklärt.',
    nowhereToSendNote:
      'Es gibt keinen Ort, an den das gehen könnte. Der Atlas hat alles gelesen, was die freien Quellen hergeben; was jetzt fehlt, ist Essen, das niemand aufgeschrieben hat — dieses Formular ist also der Weg, wie er wächst, und es wird freigeschaltet, sobald es ein Ziel dafür gibt.',
    whereTheExampleEndsUp:
      'Dort landet der Beispieleintrag: veröffentlicht, mit sichtbaren Belegen, benannten offenen Prüfungen und jeder Aussage rückverfolgbar bis zu der Person, die sie gemacht hat.',
    confirmedBy:
      'Bestätigt von',
    nothingMatchesAll:
      'Nichts passt auf all das zugleich.',
    mostOfYourListFirst:
      'Zuerst, was am meisten aus Ihrer Liste enthält',
    translatesTheAppsWords:
      'Übersetzt die Worte der App selbst. Gerichte bleiben in der Sprache, in der sie erfasst wurden — jeder Eintrag hat seine eigenen Übersetzungsschalter.',
    byNameAndPlaceOnly:
      'Diese stehen im Atlas nur mit Namen und Ort. Wie sie gemacht werden, hat niemand festgehalten, also tragen sie weder Zubereitung noch Bewertung.',
    wikipediaViewsNote:
      'Wie viele Menschen im letzten Jahr in der englischsprachigen Wikipedia über das jeweilige Gericht gelesen haben. Das ist Interesse, nicht Authentizität, und auch kein Maß dafür, wie verbreitet ein Gericht ist — es begünstigt, wonach Englischsprachige suchen. Tippen Sie eines an, um seine Einstufung zu sehen.',
    requiredDishName:
      'den Namen des Gerichts',
    requiredCountry:
      'das Land',
    requiredYourName:
      'Ihren Namen',
    requiredYourConnection:
      'Ihre Verbindung zu dem Ort',
    requiredWhatYouConfirm:
      'was Sie bestätigen können',
    bandNotScored:
      'Nicht bewertet',
    bandUnder50:
      'Unter 50',
    band50to74:
      '50 – 74',
    band75Plus:
      '75 und mehr',
    reviewCapitals:
      'Das ist durchgehend in Großbuchstaben geschrieben.',
    reviewCapitalsConsider:
      'Normale Schreibung liest sich besser und lässt sich leichter übersetzen. Der Gerichtsname behält die Schreibung, die Sie ihm gegeben haben.',
    reviewRepeats:
      'Ein Zeichen wiederholt sich mehrfach hintereinander.',
    reviewRepeatsConsider:
      'Prüfen Sie, ob eine Taste geklemmt hat.',
    reviewShort:
      'Die Zubereitung ist sehr kurz.',
    reviewShortConsider:
      'Schreiben Sie, was jemand tun müsste, um es zu machen, samt der Wartezeiten. Ein Eintrag ohne Zubereitung kann die Rezeptregale nicht erreichen.',
    groupSummaryCountries:
      '{c} Länder · {n} Traditionen',
    groupSummaryOrigins:
      '{c} Herkünfte · {n} Traditionen',
    metricTotalTitle:
      'Erfasste Traditionen',
    metricTotalCounts:
      'Eine Tradition ist eine Art, ein Essen an einem Ort zu machen. Dasselbe Gericht, in zwei Regionen anders gemacht, sind zwei Traditionen, und beide bleiben.',
    metricTotalMethod:
      'Jeder Eintrag aus dem kuratierten Bestand und den vier importierten Quellen, der etwas zu zeigen hat — mindestens einen Ort und einen Namen. Zeilen, die noch auf Anreicherung warten, werden zurückgehalten und nicht gezählt.',
    metricTotalCaveat:
      'Das ist keine Zählung der verschiedenen Speisen der Welt und kein Maß dafür, wie viel der Atlas weiß. Die meisten dieser Einträge tragen einen Namen und ein Land und sonst nichts. Der Anteil mit geschriebener Zubereitung ist die Zahl, die sagt, ob dies ein Atlas ist oder eine Namensliste.',
    metricCountriesTitle:
      'Länder',
    metricCountriesCounts:
      'Verschiedene Länder, die über alle Einträge hinweg genannt werden, nachdem die Ortsnamen des Imports aufgelöst wurden.',
    metricCountriesMethod:
      'Das Länderfeld jedes Eintrags, ohne Dopplungen, wobei nur Herkünfte gezählt werden, die Länder sind. Historische und überstaatliche Einträge, die eine Quelle verwendet hat — das Osmanische Reich, die Levante, Mesoamerika — bleiben auf ihren Einträgen, statt einem modernen Staat zugeschlagen zu werden, den wir raten müssten, und werden hier nicht gezählt. Sie mitzuzählen erhöhte diese Zahl um zweiunddreißig, und jede einzelne davon war erfunden.',
    metricCountriesCaveat:
      'Abdeckung ist nicht Tiefe. Ein Land steht hier auf der Kraft eines einzigen Eintrags, das zählt also, wo der Atlas war, nicht wo er etwas taugt. Lesen Sie es neben der Konzentrationszahl darunter, die sagt, wie schief die Summe ist.',
    metricAtRiskTitle:
      'Bedrohte Traditionen',
    metricAtRiskCounts:
      'Einträge, in denen eine Quelle mit eigenen Worten die Tradition als schwindend, verschwindend oder nicht mehr geübt beschreibt.',
    metricAtRiskMethod:
      'Erkannt, indem Einleitung und Geschichte jedes Artikels auf ausdrücklichen Rückgang gelesen werden — "wird heute selten gemacht", "der letzte verbliebene Hersteller" — und Beinahe-Treffer verworfen werden, die etwas anderes meinen, etwa eine bedrohte Art als Zutat oder eine geschlossene Restaurantkette. Der auslösende Satz wird als Beleg auf dem Eintrag gespeichert und mit ihm gezeigt.',
    metricAtRiskCaveat:
      'Das ist eine Untergrenze, keine Erhebung, und liegt weit unter der Wahrheit. Es kann nur Rückgang finden, den jemand bereits in einem Text aufgeschrieben hat, den wir gelesen haben; eine Tradition, die vier Familien halten und die nie dokumentiert wurde, schlägt überhaupt nicht zu Buche. Allein die Arche des Geschmacks von Slow Food listet rund sechstausend bedrohte Lebensmittel, das Tausendfache dieser Zahl.',
    metricDocumentedTitle:
      'Hat eine festgehaltene Zubereitung',
    metricDocumentedCounts:
      'Einträge mit einer geordneten Zubereitung — den Schritten, denen jemand folgen würde.',
    metricDocumentedMethod:
      'Kuratierte Einträge haben eine Zubereitung, die geschrieben und mit der Gemeinschaft geprüft wurde. Importierte haben sie nur dort, wo ein veröffentlichtes Rezept vorliegt; ein Enzyklopädieabsatz, der beschreibt, wie ein Gericht im Allgemeinen gemacht wird, wird als Prosa gespeichert und bewusst nicht zu Schritten erhoben, denn eine Beschreibung als Zubereitung auszugeben beansprucht eine Genauigkeit, die sie nicht hat.',
    metricDocumentedCaveat:
      'Dass eine Zubereitung vorhanden ist, sagt nichts darüber, ob es die traditionelle ist. Dafür ist die Belegstärke da, und die meisten Einträge mit Zubereitung sind als Moderne Abwandlung eingestuft.',
    metricLocatedTitle:
      'Unterhalb der Landesebene verortet',
    metricLocatedCounts:
      'Einträge, die eine Region, Provinz, Stadt oder ein Dorf nennen, nicht nur ein Land.',
    metricLocatedMethod:
      'Jeder Eintrag, dessen Ort unterhalb des Landes eine gefüllte Ebene hat.',
    metricLocatedCaveat:
      'Authentizität hat geografische Tiefe, und ein Land ist kaum ein Anfang — "Kozhikode" ist ein Eintrag, "Indien" ist eine Überschrift. Eine hohe Gesamtzahl mit einem niedrigen Anteil hier beschreibt einen Atlas, der breit und flach ist.',
    metricIllustratedTitle:
      'Hat ein Foto',
    metricIllustratedCounts:
      'Einträge mit einem Bild, das die App zeigen darf.',
    metricIllustratedMethod:
      'Aus Wikidata, aus dem Wikipedia-Artikel des Gerichts selbst, oder von einer kochenden Person über Wikimedia Commons beigetragen. Jedes wird mit Urheberin und Lizenz gespeichert, und keines gilt als geprüft: ein über den Namen gefundenes oder von einer Redaktion gewähltes Bild ist ein guter Beleg dafür, dass es das Gericht zeigt, nicht die Bestätigung dieser App.',
    metricIllustratedCaveat:
      'Ein Foto ist kein Beleg für Authentizität. Es zeigt einen Teller, den jemand gekocht hat, und der kann die im Eintrag beschriebene Tradition sein oder auch nicht.',
    metricFilmedTitle:
      'Hat ein eingestuftes Video',
    metricFilmedCounts:
      'Einträge mit mindestens einem Video, sortiert danach, wie nah die kochende Person an der Tradition ist.',
    metricFilmedMethod:
      'Sortiert nach Örtlichkeit — wo die kochende Person ist, in welcher Sprache sie spricht, ob Zutaten und Geräte zum Eintrag passen. Nie nach Aufrufen, Likes oder Abos.',
    metricFilmedCaveat:
      'Die Reihung betrifft die Nähe zur Tradition, nicht die Qualität der Aufnahme, und das oberste Video ist oft das am wenigsten aufwendige.',
    metricAssessedTitle:
      'Als authentisch eingestuft',
    metricAssessedCounts:
      'Einträge, die über die Belegprüfungen Authentisch — lokal oder Authentisch — regional erreicht haben.',
    metricAssessedMethod:
      'Sieben Prüfungen, jede beantwortet oder offen gelassen, wobei offene die Belegstärke senken statt nach Vermutung gefüllt zu werden. Technik und Bestätigung durch die Gemeinschaft werden nie aus einem Import abgeleitet, was begrenzt, wie weit ein importierter Eintrag allein kommen kann.',
    metricAssessedCaveat:
      'Ein niedriger Anteil hier ist ehrlich und kein Versagen. Der Großteil des Bestands ist importiert und ungeprüft, und diese Einträge authentisch zu nennen, weil sie aus einer angesehenen Quelle stammen, ist genau die Abkürzung, die diese Skala verweigern soll.',
    metricConcentrationTitle:
      'Konzentration',
    metricConcentrationCounts:
      'Der Anteil am gesamten Bestand, den sein größtes einzelnes Land hält.',
    metricConcentrationMethod:
      'Einträge im am stärksten vertretenen Land, geteilt durch die Gesamtzahl.',
    metricConcentrationCaveat:
      'Das spiegelt wider, welche Länder offene Lebensmittelregister führen, nicht wo das Essen der Welt ist. Italien allein veröffentlicht rund 4.400 eingetragene traditionelle Erzeugnisse; die meisten Länder veröffentlichen keine, und ihr Fehlen hier ist ein Fehlen von Papieren, nicht von Küche.',
    metricConfidenceTitle:
      'Belegstärke',
    metricConfidenceCounts:
      'Wie sich der Bestand über die Belegskala von 0 bis 100 verteilt.',
    metricConfidenceMethod:
      'Kuratierte Einträge werden über die Belegprüfungen bewertet. Importierte nur dort, wo die Anreicherung etwas zu bewerten gefunden hat, und bleiben sonst unbewertet, statt einen Standardwert zu bekommen.',
    metricConfidenceCaveat:
      '"Nicht bewertet" ist mit Abstand das größte Band und wird es bleiben. Es heißt, dass den Eintrag noch niemand geprüft hat — nicht, dass er schlecht abgeschnitten hat, und nicht, dass das Essen zweifelhaft ist.',
    metricByContinentTitle:
      'Wo die Einträge sind',
    metricByContinentCounts:
      'Einträge je Kontinent, jeder Eintrag einmal gezählt. Eine Tradition sitzt auf dem Kontinent des Landes, in dem sie erfasst ist, nicht auf dem, von dem sie gereist sein mag.',
    metricByContinentMethod:
      'Aus dem Land jedes Eintrags, über eine Land-zu-Kontinent-Zuordnung für rund 200 Staaten, historische eingeschlossen. Überstaatliche und umstrittene Einträge werden gruppiert statt in einen Kontinent gezwungen.',
    metricByContinentCaveat:
      'Das ist eine Karte der Quellen, nicht der Küchen der Welt. Europa führt, weil europäische Register online und offen sind — eine Tatsache über Archive.',
    howIsThisCounted:
      'Wie wird das gezählt?',
    hideHowThisIsCounted:
      'Zählweise ausblenden',
    stapleGrains: 'Getreide',
    stapleRoots: 'Wurzeln',
    staplePulses: 'Hülsenfrüchte',
    stapleDairy: 'Milchprodukte',
    stapleMeatFish: 'Fleisch & Fisch',
    stapleVegetables: 'Gemüse',
    stapleAromatics: 'Aromaten',
    stapleSweetSour: 'Süß & sauer',
    stapleRice: 'Reis',
    stapleWheat: 'Weizen',
    stapleMaize: 'Mais',
    stapleMillet: 'Hirse',
    stapleSorghum: 'Sorghum',
    stapleBarley: 'Gerste',
    stapleOats: 'Hafer',
    stapleBuckwheat: 'Buchweizen',
    stapleTeff: 'Teff',
    staplePotato: 'Kartoffel',
    stapleCassava: 'Maniok',
    stapleSweetPotato: 'Süßkartoffel',
    stapleYam: 'Yamswurzel',
    stapleTaro: 'Taro',
    staplePlantain: 'Kochbanane',
    stapleLentil: 'Linsen',
    stapleChickpea: 'Kichererbsen',
    stapleSoy: 'Soja',
    stapleTofu: 'Tofu',
    stapleBlackBean: 'Schwarze Bohnen',
    stapleMungBean: 'Mungbohnen',
    staplePigeonPea: 'Straucherbsen',
    stapleMilk: 'Milch',
    stapleYoghurt: 'Joghurt',
    stapleCheese: 'Käse',
    staplePaneer: 'Paneer',
    stapleGhee: 'Ghee',
    stapleButter: 'Butter',
    stapleCoconut: 'Kokosnuss',
    stapleChicken: 'Hähnchen',
    stapleBeef: 'Rindfleisch',
    staplePork: 'Schweinefleisch',
    stapleLamb: 'Lamm',
    stapleGoat: 'Ziege',
    stapleFish: 'Fisch',
    staplePrawn: 'Garnelen',
    stapleEgg: 'Eier',
    stapleOnion: 'Zwiebel',
    stapleGarlic: 'Knoblauch',
    stapleGinger: 'Ingwer',
    stapleChilli: 'Chili',
    stapleLemongrass: 'Zitronengras',
    stapleTomato: 'Tomate',
    stapleAubergine: 'Aubergine',
    stapleCabbage: 'Kohl',
    stapleSpinach: 'Spinat',
    stapleOkra: 'Okra',
    stapleTamarind: 'Tamarinde',
    stapleHoney: 'Honig',
    stapleJaggery: 'Jaggery',
    stapleDate: 'Datteln',
    stapleLemon: 'Zitrone',
    stapleOlive: 'Olive',
    dietVegan: 'Vegan',
    dietVegetarian: 'Vegetarisch',
    dietSeafood: 'Meeresfrüchte',
    dietMeat: 'Nicht vegetarisch',
    dietUnclassified: 'Nicht eingeordnet',
    dietPoultry: 'Geflügel',
    dietPork: 'Schweinefleisch',
    dietBeef: 'Rind & rotes Fleisch',
    dietLambGoat: 'Lamm & Ziege',
    dietGame: 'Wild',
    dietFish: 'Fisch',
    dietShellfish: 'Schalentiere',
    dietOtherSeafood: 'Andere Meeresfrüchte',
    dietDairy: 'Enthält Milchprodukte',
    dietEgg: 'Enthält Ei',
    dietHoney: 'Enthält Honig',
    mealBreakfast: 'Frühstück',
    mealLunch: 'Mittagessen',
    mealDinner: 'Abendessen',
    mealSupper: 'Spätmahlzeit',
    mealSnack: 'Snack',
    mealStreetFood: 'Streetfood',
    mealCelebration: 'Fest & Feier',
    mealAnytime: 'Zu jeder Zeit',
    mealUnclassified: 'Nicht erfasst',
    searchModeFind:
      'Ein Gericht finden',
    searchModePantry:
      'Kochen mit dem, was da ist',
    ingredientsYouHave:
      'Zutaten, die Sie haben',
    nTraditions:
      '{n} Traditionen',
    nothingYet:
      'Noch nichts',
    methodRecorded:
      ' · Zubereitung festgehalten',
    noMethodYet:
      ' · noch keine Zubereitung',
    showMoreLeft:
      'Mehr zeigen — {n} übrig',
    showNMore:
      '{n} weitere zeigen',
    methodAsPublished:
      'Die Zubereitung, wie sie veröffentlicht wurde. Moderne Geräte und Abkürzungen gehören dazu.',
    methodTraditional:
      'Die traditionelle Zubereitung, ohne moderne Abkürzungen als Ersatz.',
    everythingClassified:
      'Alles, was als {what} eingestuft ist',
    everythingFrom:
      'Alles aus {place}',
    everythingRecordedAs:
      'Alles, was als {what} erfasst ist',
    everythingMadeWith:
      'Alles, was mit {ingredient} gemacht wird',
    seeEverything:
      '{label} — alles ansehen',
    noPhotographOnRecord:
      '{label} — kein Foto erfasst',
    scoreOutOf100:
      '{label}: {value} von 100',
    removeFilter:
      'Filter {key} entfernen',
    anywhereInTheAtlas:
      ' irgendwo im Atlas',
    absenceOfRecords:
      '. Das ist ein Fehlen von Einträgen, kein Fehlen von Essen — wir sagen lieber, dass wir es nicht wissen.',
    narrowToA:
      'Auf {level} eingrenzen · {n} erfasst',
    fromTheTown:
      ' — aus dem Ort selbst',
    showFewer:
      'Weniger zeigen',
    readAboutOnWikipedia:
      'Über {name} auf {language} in der Wikipedia lesen',
    languageChangeIt:
      'Sprache: {language}. Ändern.',
    perCentTranslated:
      '{language}, zu {n} Prozent übersetzt',
    translateThisRecord:
      'Diesen Eintrag übersetzen',
    translating:
      'Wird übersetzt…',
    translate:
      'Übersetzen',
    translateThisConfirmation:
      'Diese Bestätigung ins {language} übersetzen',
    couldNotTranslate:
      'Übersetzen ging nicht — noch einmal versuchen',
    howThisIsCountedFor:
      'Wie {figure} gezählt wird',
    countOfTotal:
      '{label}: {count} von {total}',
    watchAtSourceCreator:
      '{creator} an der Quelle ansehen',
    stillFromCreator:
      'Standbild von {creator}',
    thatDidNotSend:
      'Das wurde nicht gesendet.',
    containsAlcohol:
      'Enthält Alkohol',
    nothingElseRequired:
      'Alles andere ist willkommen und nichts davon ist Pflicht — zu wissen, woher ein Essen kommt und dass es niemand aufgeschrieben hat, ist bereits mehr, als hier irgendeine Quelle hat.',
    opensTheFormPrefilled:
      'Es öffnet das Formular an seiner Quelle, mit dem bereits Geschriebenen ausgefüllt. Diese App sammelt nichts über Sie, und nichts wird veröffentlicht, bevor Menschen von dort es bestätigt haben.',
    scoreDimGeographic:
      'Geografische Verbindung',
    scoreDimIngredients:
      'Traditionelle Zutaten',
    scoreDimTechnique:
      'Traditionelle Technik',
    scoreDimLocalSource:
      'Örtliche Quelle',
    scoreDimDocumentation:
      'Kulturelle Belege',
    scoreDimCommunity:
      'Bestätigung durch die Gemeinschaft',
    photoFromWikidata:
      'Am Wikidata-Eintrag dieses Gerichts selbst hinterlegt — nicht über den Namen gefunden',
    photoFromArticle:
      'Das Titelbild des Enzyklopädieartikels dieses Gerichts',
    photoFromRecipe:
      'Auf der Seite dieses Rezepts veröffentlicht',
    photoFromSearch:
      'Über den Namen auf Wikimedia Commons gefunden — das Motiv ist nicht bestätigt',
    photoFromUnknown:
      'Herkunft nicht erfasst — behandeln Sie das Motiv als unbestätigt',
    noTranslationRecorded:
      'Für diese Schilderung ist noch keine Übersetzung erfasst, sie steht daher auf {language}, in der Sprache, in der sie festgehalten wurde. Wir zeigen Ihnen lieber das Original als die Vermutung einer Maschine über eine Gärzeit.',
    machineTranslationBy:
      'Maschinelle Übersetzung von {translator}. Niemand aus der Gemeinschaft hat sie geprüft — Namen von Zutaten und Geräten bleiben im Original.',
    translatedBy:
      'Übersetzt von {translator}. Namen von Zutaten und Geräten bleiben im Original.',
    videoOriginalAudio:
      'Gesprochen auf {language} — der eigenen Sprache der kochenden Person. Es wird nichts übersetzt.',
    videoCreatorTrack:
      'Die Urheberin hat eine Tonspur auf {language} veröffentlicht. Das Video öffnet an der Quelle in dieser Spur — die Übersetzung ist ihre, nicht unsere.',
    videoPlatformCaptions:
      'Gesprochen auf {spoken}. Öffnet mit maschinell übersetzten Untertiteln auf {preferred} über dem Originalton — die Stimme der kochenden Person wird nicht ersetzt, und die Übersetzung stammt von der Videoplattform, nicht von einem Menschen.',
    videoLanguageUnknown:
      'Uns liegt die gesprochene Sprache dieses Videos nicht vor, wir können {language} also nicht zusagen. Es öffnet an der Quelle, wo die Untertiteloptionen der Plattform gelten.',
    figureDocumented:
      'Hat eine festgehaltene Zubereitung',
    figureDocumentedNote:
      'Die Zahl, die sagt, ob dies ein Atlas ist oder eine Namensliste. Alles andere ist ihr nachgeordnet.',
    figureLocated:
      'Unterhalb der Landesebene verortet',
    figureLocatedNote:
      'Authentizität hat geografische Tiefe. „Kozhikode“ ist ein Eintrag; „Indien“ ist kaum ein Anfang.',
    figureIllustrated:
      'Hat ein Foto',
    figureIllustratedNote:
      'Ein Gericht, das sich niemand vorstellen kann, liegt einem schwerer am Herzen und ist noch schwerer wiederzuerkennen.',
    figureFilmed:
      'Hat ein eingestuftes Video',
    figureFilmedNote:
      'Sortiert nach der Nähe der kochenden Person zur Tradition — kein Suchergebnis.',
    figureAssessed:
      'Als authentisch eingestuft',
    figureAssessedNote:
      'Über die Belegprüfungen erreicht. Ein niedriger Anteil hier ist ehrlich, kein Versagen.',
    atlasSummary:
      '{n} Traditionen aus {c} Ländern erfasst. Die Abdeckung wird ehrlich angegeben: Ein Land, das hier fehlt, hat noch nichts Erfasstes — nicht nichts zu erfassen.',
    nothingRecorded:
      'Nichts erfasst',
    nothingRecordedAs:
      'Nichts erfasst als {what}',
    nothingRecordedAsAnd:
      'Nichts erfasst als {list} und {last}',
    photoVia:
      'Foto über',
    photoNothingEntered:
      'Noch nichts eingegeben.',
    photoNothingEnteredFix:
      'Fügen Sie den Commons-Dateinamen oder den Link zu seiner Dateiseite ein.',
    photoWrongHost:
      'Dieser Link führt zu {host}, und wir dürfen von dort kein Foto veröffentlichen.',
    photoWrongHostFix:
      'Wenn das Foto Ihres ist, laden Sie es unter einer freien Lizenz zu Wikimedia Commons hoch und fügen Sie den Dateinamen hier ein. Es bleibt Ihres, Sie werden überall genannt, wo es erscheint, und es kostet nichts.',
    photoNotCommons:
      'Dieser Link liegt nicht auf Wikimedia Commons.',
    photoNotCommonsFix:
      'Hier können nur Commons-Dateien veröffentlicht werden, weil nur sie eine Lizenz tragen, die uns das Zeigen erlaubt.',
    photoNoFileName:
      'Darin war kein Dateiname zu finden.',
    photoNoFileNameFix:
      'Fügen Sie den Dateinamen ein, zum Beispiel Kaipola.jpg.',
    photoNotAPhotograph:
      'Das ist keine Fotodatei.',
    photoNotAPhotographFix:
      'Fotos auf Commons enden auf .jpg, .png oder .webp. Diagramme und Logos werden hier nicht verwendet.',
    photoIsADrawing:
      'Das ist eine Zeichnung, kein Foto.',
    photoIsADrawingFix:
      'Nehmen Sie ein Foto des Essens, so wie es gemacht wurde.',
    serverRefused:
      'Der Server hat es abgelehnt ({status}).',
    serverTookTooLong:
      'Der Server hat zu lange für die Antwort gebraucht.',
    couldNotReachServer:
      'Der Server war nicht erreichbar.',
    nothingYouTypedIsLost:
      '{message} Ihre Eingabe wurde nicht gesendet — nichts von dem, was Sie getippt haben, ist verloren, versuchen Sie es gleich noch einmal.',
    proposalsNotOpen:
      'Einreichungen sind noch nicht offen.',
    confirmationsNotOpen:
      'Bestätigungen sind noch nicht offen.',
    alreadyProposed:
      'Dieses Gericht wurde bereits eingereicht. Öffnen Sie es und bestätigen Sie es stattdessen — das bringt es weiter.',
    alreadyConfirmed:
      'Sie haben dieses hier schon bestätigt.',
    youProposedThis:
      'Sie haben dieses Gericht eingereicht, es braucht also jemand anderen zur Bestätigung.',
    stillNeededList:
      'Es fehlt noch: {list}.',
    listAnd:
      '{list} und {last}',
    listOr:
      '{list} oder {last}',
    proposalConfirmed:
      'Bestätigt. Kommt beim nächsten Update in den Atlas.',
    proposalNobodyYet:
      'Das hat noch niemand bestätigt. {n} Menschen, die das Gericht kennen, würden es in den Atlas bringen.',
    proposalSoFar:
      '{have} von {n} Bestätigungen. {short} weitere von Menschen, die das Gericht kennen, würden es hineinbringen.',
    recordNobodyYet:
      'Von dort hat das noch niemand bestätigt. {n} Bestätigungen würden es beglaubigen.',
    recordSoFar:
      '{have} von {n} Bestätigungen. {short} weitere von Menschen, die das Gericht kennen, würden es beglaubigen.',
    atRiskNote:
      'Gekennzeichnet, weil eine Quelle diese Tradition als schwindend beschreibt — der Satz wird mit dem Eintrag gezeigt. Es wird nie daraus abgeleitet, wie wenig wir festgehalten haben: eine Lücke in unseren Einträgen ist kein Beleg dafür, dass jemand aufgehört hat zu kochen.',
    originDisclaimer:
      'Für dieses Gericht gibt es mehr als einen belegten historischen Anspruch. Die Traditionen unten stehen so, wie jeder Ort sie beschreibt, mit ihren Quellen. Kein Anspruch wird hier als Sieger dargestellt, und nichts davon wirkt sich auf die Belegstärke aus — die misst, wie das Gericht an einem Ort gemacht wird, nicht wer es zuerst gemacht hat.',
    supportRunsOn:
      'Alles im Atlas stammt aus Wikipedia, Wikidata, Wikimedia Commons, Wikibooks und offenen regionalen Registern. Sie sind frei zu lesen, offen lizenziert und auf jedem Eintrag genannt, der sie verwendet. Das ist die ganze Grundlage dafür, dass das Projekt kostenlos bleibt, und es ist eine Entscheidung, kein Zwischenstand.',
    contributeToTheAtlas:
      'Zum Atlas beitragen',
    answeredByDocuments:
      'Das können Belege beantworten',
    answeredByPeople:
      'Das können nur Menschen beantworten',
    scaleDocumentsStop:
      'hier enden die Belege',
    scaleAuthenticBegins:
      'ab hier authentisch',
    pantryNothingUses:
      'Nichts im Bestand verwendet {list}. Vielleicht hat nur niemand ein Gericht aufgeschrieben, das es tut — bei {p}% des Atlas ist überhaupt keine Zutat vermerkt.',
    alsoRecordedIn:
      'Auch verzeichnet unter {list}',
    alsoRecordedNote:
      'Der Atlas führt dort einen eigenen Eintrag zu diesem Gericht. Keiner korrigiert den anderen — ein Gericht, das zwei Esskulturen kochen, ist in keiner von beiden ein Fehler.',
    chooseACountry:
      'Land auswählen',
    filterTheList:
      'Tippen, um die Liste einzugrenzen',
    showingFirstNOfM:
      'Die ersten {n} von {m} werden gezeigt. Weiter tippen, um einzugrenzen.',
    nothingMatchesThat:
      'Nichts in der Liste passt dazu.',
    continentBeyondOneCountry:
      'Über ein Land hinaus',
    beyondOneCountryNote:
      'Herkünfte, die die Quellen weiter fassen als ein einzelnes Land — eine Region, ein gemeinsamer Küchenraum oder ein Staat, den es nicht mehr gibt. Sie bleiben so stehen, wie die Quelle sie nennt, statt auf ein Land verengt zu werden, das niemand gewählt hat.',
    connectionGrewUpThere:
      'Ich bin dort aufgewachsen',
    connectionLiveThere:
      'Ich lebe dort',
    connectionFamilyFrom:
      'Meine Familie stammt von dort',
    connectionLearnedThere:
      'Ich habe es dort kochen gelernt',
    connectionCookProfessionally:
      'Ich koche es dort beruflich',
    chooseYourConnection:
      'Wählen Sie, was zutrifft',
    connectionInYourWords:
      'Was Sie ergänzen möchten, in Ihren Worten',
    connectionDetailPlaceholder:
      'Meine Großmutter machte es jedes Eid in Kozhikode',
    dictateSpeak:
      'Sprechen statt tippen',
    dictateListening:
      'Hört zu — zum Beenden tippen',
    dictateStop:
      'Zuhören beenden',
    dictateSendsAudio:
      'Das Zuhören übernimmt Ihr Browser, und die meisten senden den Ton dafür an ihre eigenen Server. Was Sie sagen, wird oben in das Feld eingefügt, wo Sie es korrigieren können.',
    dictateNotAllowed:
      'Der Browser hat das Mikrofon nicht freigegeben.',
    dictateDidNotWork:
      'Das hat nicht geklappt. Sie können es weiterhin tippen.',
    polishTidyThis:
      'Meine Tippfehler glätten',
    polishWorking:
      'Wird geglättet…',
    polishMachineMade:
      'Maschinell vorgeschlagen — Ihre Worte stehen weiter oben',
    polishUseThis:
      'Das übernehmen',
    polishKeepMine:
      'Meines behalten',
    polishOnlyTyping:
      'Angefasst werden nur Rechtschreibung, Zeichensetzung und Abstände. Nichts wird ergänzt, entfernt oder umformuliert, und kein Name wird geändert.',
    polishFoundNothing:
      'Nichts zu korrigieren — was Sie geschrieben haben, liest sich gut.',
    polishDidNotWork:
      'Das hat nicht geklappt. Ihr Text ist unverändert.',
    continentAfrica:
      'Afrika',
    continentAsia:
      'Asien',
    continentEurope:
      'Europa',
    continentNorthAmerica:
      'Nordamerika',
    continentSouthAmerica:
      'Südamerika',
    continentOceania:
      'Ozeanien',
    regionLevant:
      'Levante',
    regionLatinAmerica:
      'Lateinamerika',
    regionMiddleEast:
      'Naher Osten',
    regionMaghreb:
      'Maghreb',
    regionCentralEurope:
      'Mitteleuropa',
    regionEasternEurope:
      'Osteuropa',
    regionSouthernEurope:
      'Südeuropa',
    regionCentralAsia:
      'Zentralasien',
    regionIndianSubcontinent:
      'Indischer Subkontinent',
    regionNorthAfrica:
      'Nordafrika',
    regionAmericas:
      'Amerika',
    regionAncientNearEast:
      'Alter Orient',
    regionBalkans:
      'Balkan',
    regionCaribbean:
      'Karibik',
    regionLowCountries:
      'Niedere Lande',
    regionMesoamerica:
      'Mesoamerika',
    regionMiddleEasternEmpires:
      'Reiche des Nahen Ostens',
    regionPolishLithuanianCommonwealth:
      'Polen-Litauen',
    regionQajarIran:
      'Kadscharen-Iran',
    regionRussianEmpire:
      'Russisches Kaiserreich',
    regionSouthCaucasus:
      'Südkaukasus',
    regionSovietCentralAsia:
      'Sowjetisch-Mittelasien',
    regionWu:
      'Wu',
    regionArtsakh:
      'Republik Arzach',
    refineDietOccasion:
      'Ernährung und Anlass',
    refineAny:
      'Alle',
    placeKindWiderRegion:
      'weitere Region',
    placeKindFormerState:
      'historischer Staat',
    oneTradition:
      '1 Tradition',
    onePlace:
      '1 Ort',
    nPlaces:
      '{n} Orte',
    countryLevelOnly:
      'nur auf Landesebene',
    summaryWorldwide:
      ' weltweit',
    nRecorded:
      '{n} erfasst',
    writtenInLanguage:
      'Verfasst auf {language}',
    whatThisIs:
      'Was das hier ist',
    atlasDefinition:
      'Ein kostenloser Atlas traditioneller Gerichte — woher jedes stammt und wer dafür bürgt.',
    traditionsLabel:
      'Traditionen',
    freeNoAds:
      'Kostenlos, ohne Werbung',
    quotedFromSource:
      'Zitiert aus der Quelle unten — eine allgemeine Beschreibung der Zubereitung, kein Beleg dafür, wie das Gericht in {place} gemacht wird.',
    adaptationLeadIn:
      'Wie dieses Gericht heute üblicherweise zubereitet wird. Es ist kein Beleg dafür, wie man es in {place} macht, und niemand von dort hat es bestätigt.',
    openDisagreementBody:
      'Jemand, der das in {place} kocht, sagt, es werde anders gemacht: {differs} Während der Prüfung wurde nichts entfernt, und der Vertrauenswert unten bleibt unverändert — halten beide Darstellungen stand, wird der Eintrag geteilt, statt eine zu überstimmen.',
    engagementNotShown:
      'Reichweitenzahlen werden bewusst nicht gezeigt — sie messen keine Authentizität.',
    videoSearchNote:
      'Sie können an der Quelle danach suchen. Die Ergebnisse kommen nach Aufrufen sortiert, was allein Reichweite misst — die kochende Person kann aus {place} stammen oder nicht. Nichts davon beeinflusst die Einstufung dieses Eintrags.',
    nowOpenForConfirmation:
      '{name} ist jetzt zur Bestätigung offen.',
    proposalOpenBody:
      '{n} Menschen, die das Gericht kennen, müssen es bestätigen, bevor es in den Atlas kommt. Ab sofort kann es jede und jeder sehen und bestätigen — auch die Leute, denen Sie davon erzählen, und genau so wird ein Gericht bestätigt, das niemand aufgeschrieben hatte.',
    nothingMatchesBody:
      'Nichts im Atlas passt bisher zu {query}. Eine Lücke hier heißt: kein Eintrag, nicht kein Gericht — wir sagen lieber, dass wir es nicht wissen, als zu raten.',
    thatWord:
      'das',
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
      '{n} tradizioni, costruite interamente su fonti libere da leggere e con licenza aperta. Nessuna pubblicità, nessun tracciamento, niente dietro un pagamento. Quel che serve per tenerlo in piedi lo copre questa scelta di fonti, non qualcuno che paga per esserci.',
    notForSaleAuthentic:
      'Una scheda non può diventare Autentica pagando. Questo viene dalle prove e dalle persone che cucinano il piatto.',
    notForSalePromotion:
      'Nessun piatto viene promosso, messo più in alto o messo in evidenza perché qualcuno ha pagato.',
    notForSaleAdvertising:
      'Qui non c’è pubblicità, e nessun lettore viene tracciato.',
    donationFootnote:
      'Si apre su Open Collective. Qui non si incassa nulla: questa app non conserva alcun tuo dato di pagamento e non lo farà mai.',
    donationsPendingBody:
      'Non c’è ancora dove mandare del denaro. Niente dell’atlante dipende da questo: è costruito su fonti libere da leggere, e questo non cambia.',
    mostUsefulThing:
      'La cosa più utile che si possa dare a questo atlante non è il denaro. Gran parte di esso è un nome e un luogo perché nessuno ha scritto come si prepara il cibo.',
    administration:
      'Amministrazione',
    administrationNote:
      'Soglie, moderazione, controllo delle fonti e utilizzo. Richiede un token.',
    howLead:
      'È la regola su cui questo atlante è costruito, ed è aritmetica e non una politica — il che significa che puoi verificarla invece di fidarti.',
    sixDimensionsBody:
      'Ogni scheda è valutata sulle stesse sei dimensioni, e tutte e sei sono stampate sulla scheda stessa. Il punteggio è la loro media, così chi ne dubita può sommare i numeri.',
    ceilingBody:
      'Tre di quelle sei non possono essere risolte da nessun documento mai scritto. Nessuna enciclopedia sa se un metodo è il metodo di un luogo; nessun registro è una persona del paese. Con quelle tre vuote, il massimo che una scheda può ottenere con le sole fonti pubblicate è {ceiling}.',
    thresholdBody:
      'Una scheda si dice Autentica a {threshold}. La distanza fra quei due numeri è voluta ed è tutto l’argomento: può colmarla solo chi conosce il piatto.',
    whatClosesItBody:
      '{n} conferme da persone che dichiarano il proprio legame con il luogo — e che dicono che cosa stanno confermando, non solo che approvano. Entrambe compaiono sulla scheda, perché una frase come “nato a Kozhikode: usiamo ghee, non olio” è una prova che si può soppesare, mentre “{n} conferme” è un numero di cui bisogna fidarsi.',
    accountsBody:
      'Quelle {n} devono essere {n} persone diverse, quindi una conferma vale per il distintivo solo se la persona aveva effettuato l’accesso. Una anonima viene comunque registrata e mostrata sulla scheda — ciò che qualcuno sa vale la pena averlo, con o senza account — semplicemente non muove il numero. Leggere l’atlante non richiede mai di accedere.',
    whichIsWhereYouComeInBody:
      'Per gran parte dell’atlante non parla nessuno. Se sai come si prepara un piatto da dove vieni, quella è l’unica cosa che nessuna fonte può fornire e che nessuna raccolta automatica può raggiungere.',
    notRatings:
      'Niente valutazioni. Nessuno dà voti a un piatto.',
    notComments:
      'Niente commenti e niente feed. Qui non c’è nulla con cui interagire.',
    notAlgorithm:
      'Nessun algoritmo decide che cosa vedi. L’ordine sono le prove, e puoi cambiarlo.',
    notAdvertising:
      'Niente pubblicità, e nessun lettore viene tracciato.',
    notPopularity:
      'La popolarità è registrata e tenuta separata. La versione più pubblicata di un piatto non diventa mai quella autentica.',
    dimensionOrigin:
      'Da dove viene il piatto, e con quanta precisione. Un paese vale più di una nazione.',
    dimensionIngredients:
      'Di che cosa è fatto, come lo fa la tradizione.',
    dimensionTechnique:
      'Come si prepara — non che qualcuno abbia pubblicato una ricetta, ma che questo sia il metodo del luogo.',
    dimensionLocalSource:
      'Qualcuno con un legame dichiarato con il luogo ha parlato per esso.',
    dimensionDocumentation:
      'Un registro, un’iscrizione o un’enciclopedia lo ha annotato.',
    dimensionCommunity:
      'Gente del posto lo ha confermato, e ha detto che cosa conferma.',
    fromDocuments:
      'i documenti possono',
    fromPeople:
      'solo le persone',
    contributeLead:
      'Registralo com’è fatto dove sei tu. Da questo modulo da solo non viene pubblicato nulla: prima passa dalla valutazione e dalla conferma della comunità.',
    writeItTheWayYouWriteIt:
      'Scrivi il nome del piatto come lo scrivi tu',
    editorialRuleBody:
      'Correggi liberamente il nostro testo: ortografia, grammatica, tutto ciò che si legge male. Non sistemare il piatto in sé. Il nome di un piatto, un ingrediente, un attrezzo e un luogo restano esattamente come li scrive chi lo cucina, accenti compresi. Se due grafie non coincidono, di solito sono due comunità e non un errore, e si tengono entrambe.',
    photographTitle:
      'Una fotografia, se ne hai una',
    photographBody:
      'Pubblica la tua fotografia su Wikimedia Commons, poi incolla qui il nome del file. Resta tua, sei accreditato ovunque compaia, e non costa nulla né a te né a noi. Non possiamo prenderne una da Instagram o TikTok: lì la fotografia è sotto il diritto d’autore di chi l’ha scattata, e una riga di credito non è un permesso.',
    walkthroughNoteBody:
      'Quello che segue è un esempio svolto di cosa succede a una proposta: i riscontri, le verifiche e il punteggio provvisorio qui sotto vengono da una scheda già presente nell’atlante, non da ciò che hai appena scritto. La tua voce non viene valutata qui; la valutano delle persone, dopo l’invio.',
    examplePreparedBy:
      'Case del Malabar, preparato per l’iftar e per le occasioni di famiglia',
    exampleConnection:
      'Nato a Kozhikode e cucino lì',
    exampleIngredients:
      'Banana nendran matura, uova, ghee, zucchero, anacardi, uvetta; cotto in una padella pesante su fiamma bassa di carbone o di gas, coperto con un coperchio caricato di braci',
    shelfFromCountry:
      'Da {country}',
    shelfFromCountryNote:
      'Quello che l’atlante ha da {country}. Che qui sia esatto vale per te più che altrove: tu puoi capire se è giusto.',
    sending:
      'Invio…',
    missionHeadline:
      'Ogni piatto qui mostra le sue prove.',
    missionStakes:
      'Da dove viene, chi lo dice e quanto è stato davvero accertato: stampato su ogni scheda, e verificabile da chiunque ne dubiti.',
    statDishes:
      'piatti',
    statCountries:
      'paesi',
    statDocumented:
      'documentati',
    statRegistered:
      'iscritti',
    statAuthentic:
      'autentici',
    missionAsk:
      'Di questi, {n} non hanno alcun metodo registrato. {people} persone di un luogo possono sistemarne uno per sempre.',
    missionAskBody:
      'Nessuno ha messo per iscritto come si fanno — non in inglese, in nessuna lingua, in nessun posto dove arrivi una macchina. Nessun archivio, nessuna enciclopedia e niente di automatico può autenticarli al loro posto; è aritmetica del punteggio, non una regola. Se lo cucini tu, sei l’unica persona che può.',
    recordADishYouKnow:
      'Registra un piatto che conosci',
    howItGetsAuthenticated:
      'Come viene autenticato',
    submissionsNotOpen:
      'Gli invii non sono ancora aperti: non c’è dove mandarli. Il percorso qui sopra spiega cosa succederà quando lo saranno.',
    freeAndStayingFree:
      'Gratis, e resterà così. Nessuna pubblicità, nessun tracciamento, nessun denaro raccolto. Un account serve solo per confermare un piatto — mai per leggerne uno.',
    noRatingsNoComments:
      'Niente voti, niente commenti e nessun algoritmo che decide cosa vedi: gli elenchi partono dalle prove, non dalla popolarità. Le aperture si contano come un piatto e una data, mai come una persona.',
    whyASourceCannot:
      'Perché una fonte non può autenticare un piatto',
    whyASourceCannotBody:
      'La documentazione pubblicata qui non può superare {ceiling}, e una scheda diventa Autentica a {threshold}. Quella distanza la colmano solo persone legate al luogo. Le sei cifre dietro ogni punteggio sono stampate sulla scheda, così chi dubita del numero può rifare la somma.',
    whyTheAtlasStops:
      'È anche il motivo per cui l’atlante si ferma dove si ferma. Ogni fonte libera è stata letta — enciclopedie, ricettari, registri del patrimonio, dizionari geografici — e {n} schede non hanno ancora nulla di annotato su come si fanno. Quel che resta non è mai stato scritto.',
    levelLocal:
      'Autentico — locale',
    levelLocalFull:
      'Autentico — locale/tradizionale',
    levelRegional:
      'Autentico — regionale',
    levelVariation:
      'Variante tradizionale',
    levelAdaptation:
      'Adattamento moderno',
    levelFusion:
      'Fusione',
    levelUnverified:
      'Non verificato',
    levelUnverifiedFull:
      'Non verificato — prove insufficienti',
    filterAuthenticOnly:
      'Solo autentici',
    filterTraditionalVariations:
      'Varianti tradizionali',
    filterModernAdaptations:
      'Adattamenti moderni',
    filterFusion:
      'Fusione',
    filterUnverified:
      'Non verificati',
    filterAll:
      'Tutti',
    geoCountry:
      'paese',
    geoRegion:
      'regione',
    geoProvince:
      'provincia o distretto',
    geoCity:
      'città o paese',
    geoVillage:
      'villaggio o comunità',
    chooseRegion:
      'Scegli una regione',
    chooseProvince:
      'Scegli una provincia o un distretto',
    chooseCity:
      'Scegli una città o un paese',
    chooseVillage:
      'Scegli un villaggio o una comunità',
    typeToSearchLevel:
      'Scrivi per cercare…',
    browseAllTraditions:
      'Vedi tutte le {n} tradizioni',
    geoPlace:
      'luogo',
    noLevelRecorded:
      'Nessun {level} registrato con quel nome, per ora. Un vuoto qui vuol dire nessuna scheda, non nessun piatto.',
    browseCuisine:
      'cucina {cuisine}',
    browseMadeWith:
      'fatto con {ingredient}',
    browseEverything:
      'Tutto',
    within:
      'Dentro {path}',
    chooseCountryHint:
      'Scegli un paese · {c} registrati',
    chooseCountryHintBroader:
      'Scegli un paese · {c} registrati, e {b} origini più ampie',
    noRecordUnderThatReference:
      'Nell’atlante non c’è nulla registrato con quel riferimento. Un vuoto qui vuol dire nessuna scheda, non nessun piatto.',
    tagTraditionalPreparation:
      '🏺 Preparazione tradizionale',
    tagAtRiskTradition:
      '🕯️ Tradizione a rischio',
    notEligibleForAuthentic:
      'Non può rientrare nella classificazione di autentico',
    lookingForWhatItBorrows:
      'Cerchi la tradizione da cui prende?',
    howItsDescribed:
      'Come viene descritto',
    howItsMade:
      'Come si fa',
    originAndAttribution:
      'Origine e attribuzione culturale',
    nobodyRecordedTechnique:
      'Nessuno ha registrato la tecnica: i tempi, il recipiente, l’ordine delle cose. È questo che porterebbe la scheda fuori da Non verificato, e serve qualcuno che lo cucini.',
    nobodyHasRecorded:
      'Nessuno ha registrato come si fa {dish}{place}. Potremmo copiare la ricetta più pubblicata di internet e chiamarla autentica, ma è esattamente ciò che questo atlante esiste per non fare — quindi la scheda resta com’è finché non la compila qualcuno che lo cucina. Se lo fai tu, saresti la prima persona a scriverlo.',
    ifIngredientUnavailable:
      'Se l’ingrediente tradizionale non si trova',
    commonModernSubstitute:
      'Sostituto moderno comune: ',
    adaptationNotAuthentic:
      'Questo è un adattamento e non va considerato la preparazione autentica.',
    whatTheInternetServes:
      'Quello che internet serve di solito per questo piatto, e in cosa si allontana dalla tradizione qui sopra.',
    popularNotAuthentic:
      'Popolare, ma non è la preparazione autentica. Resta di riferimento la versione qui sopra.',
    videosRankedByCloseness:
      'Video veri, ordinati per quanto chi cucina è vicino alla tradizione, non per numero di visualizzazioni.',
    stillFramesFromVideos:
      'I fermi immagine sono presi dai video stessi, quindi il piatto che vedi è il piatto che quella persona ha fatto.',
    noVideoRecordedYet:
      'Per questo piatto non è ancora stato registrato nessun video della tradizione.',
    findOneFromThePlace:
      'Se ne trovi uno fatto da qualcuno del posto, si può aggiungere da Aggiungi una tradizione: è questo che darebbe a questo piatto un video ordinato.',
    siblingsNeitherIsReal:
      'Lo stesso piatto, registrato a parte dove si fa diversamente. Nessuno dei due è quello vero.',
    doYouKnow:
      'Conosci {subject}?',
    confirmWhatYouKnow:
      'Conferma quello che sai davvero. Non devi rispondere di tutta la scheda: una cosa precisa detta da chi lo cucina vale più di un consenso generico.',
    recordedThankYou:
      'Registrato. Grazie.',
    shownWithYourConnection:
      'Compare sulla scheda con accanto il tuo legame, così chi legge può valutarlo da sé.',
    signedInCounts:
      'Hai effettuato l’accesso: questo conterà per il distintivo.',
    notSignedInNote:
      'Non hai effettuato l’accesso. Quello che scrivi comparirà sulla scheda con il tuo legame, e non muoverà il distintivo: quel conteggio sale solo per chi ha effettuato l’accesso, così una persona non può valerne tre.',
    signInSoItCounts:
      'Accedi, così conta',
    shownOnTheRecord:
      'Compare sulla scheda',
    whatCanYouConfirm:
      'Cosa puoi confermare?',
    exampleSaid:
      'Usiamo ghee, non olio — e si fa per l’Eid, non tutto l’anno.',
    fromTheTownItself:
      'Sono del paese o del villaggio stesso, non solo della regione',
    fromTheTownItselfLabel:
      'Sono del paese o del villaggio stesso, non della regione',
    exampleWhoMakesIt:
      'Fatto in casa per l’Eid, dalle nonne — facoltativo',
    exampleIngredientLines:
      'banana da cuocere matura\nuovo\nghee',
    exampleMethodLines:
      'Schiaccia la banana.\nIncorpora l’uovo sbattuto.',
    inPlace:
      ' a {place}',
    tagAtRiskShort:
      '🕯️ A rischio',
    readThisIn:
      'Leggilo in',
    communityTranslation:
      'Traduzione della comunità',
    machineTranslation:
      'Traduzione automatica — non ancora controllata da nessuno della comunità',
    notTranslatedYet:
      'Non ancora tradotto',
    aDotMarks:
      'Un punto segnala una lingua in cui questa scheda è già tradotta.',
    opensOnceMoreRecords:
      '{language} si aprirà quando altre {n} schede saranno leggibili in quella lingua.',
    noTranslationService:
      'A questa build non è collegato nessun servizio di traduzione, quindi non si può tradurre nulla automaticamente. Del resto una traduzione di chi cucina questo piatto vale di più: si può proporre da Aggiungi una tradizione.',
    whatTheseTermsMean:
      'Cosa vogliono dire questi termini',
    signedIn:
      'Accesso effettuato',
    signOut:
      'Esci',
    signedInSignOut:
      'Accesso effettuato. Esci.',
    confirmationsCount:
      'Le tue conferme contano per il distintivo.',
    signIn:
      'Accedi',
    signInSoConfirmationsCount:
      'Accedi, così le tue conferme contano',
    onlySignedInMovesBadge:
      'Solo le conferme fatte da chi ha effettuato l’accesso muovono un distintivo.',
    watchAtSource:
      'Guarda alla fonte ↗',
    originalAudio:
      'Audio originale',
    creatorsOwnTranslation:
      'Traduzione di chi ha fatto il video',
    translatedCaptions:
      'Sottotitoli tradotti',
    languageUnknown:
      'Lingua sconosciuta',
    ingredientsInThisVideo:
      'Ingredienti usati in questo video',
    weDontInventOne:
      'Chi ha fatto questo video non ha pubblicato né lista di ingredienti né metodo scritto, e noi non ce li inventiamo. Il metodo tradizionale qui sopra viene dalle fonti documentate qui sotto.',
    captureFromVideo:
      'Raccogli ingredienti e passaggi da questo video →',
    dietaryPreference:
      'Preferenza alimentare',
    narrowItDown:
      'Restringi',
    anyDiet:
      'Qualsiasi dieta',
    whenItsEaten:
      'Quando si mangia',
    anyOccasion:
      'Qualsiasi occasione',
    alsoCalled:
      'Detto anche',
    notATranslationOfOurs:
      'Ognuno è il nome usato dalla voce enciclopedica in quella lingua: non è una traduzione nostra e non sostituisce mai il nome qui sopra. Toccane uno per leggerlo lì.',
    relatedTraditions:
      'Tradizioni collegate',
    relatedTraditionsNote:
      'Schede che condividono con questa un luogo, una tradizione o un ingrediente. Ognuna dice quale.',
    scoreCannotSettle:
      'Una stima di quanto siano solide le prove, non la pretesa che un punteggio possa decidere una verità culturale.',
    notScored:
      'Senza punteggio',
    navAtlasNote:
      'Cosa c’è, e con quanta affidabilità',
    navProposeNote:
      'Cibo di cui l’atlante non ha scheda',
    navConfirmNote:
      'Piatti che aspettano qualcuno che li conosca',
    navSupportNote:
      'Quanto costa tenerlo in piedi, e chi paga',
    confirmPrompt:
      'Da te si fa così?',
    confirmAskBody:
      'Se lo cucini là da dove viene, confermarlo o correggerlo è ciò che porta una scheda fuori da Non verificato. Dove la tua versione è diversa, viene registrata accanto a questa — non al suo posto.',
    confirmYes:
      'Sì, corrisponde',
    confirmNo:
      'Da me si fa diversamente',
    confirmPlacePrompt:
      'Questo piatto viene davvero da dove diciamo?',
    confirmPlaceBody:
      'Nessuno ha scritto come si fa questo, quindi non c’è ancora nulla con cui essere d’accordo. Il luogo è ciò che questa scheda afferma, e vale la pena confermarlo di per sé: è una delle sei verifiche di prova.',
    confirmPlaceYes:
      'Sì, è di qui',
    confirmPlaceNo:
      'No, viene da un altro posto',
    standingMet:
      '{n} persone legate a {place} lo hanno confermato: il numero che il distintivo richiede.',
    standingNobody:
      'Ancora nessuno',
    standingOne:
      'Finora una persona',
    standingMany:
      'Finora {n} persone',
    standingNeed:
      '{soFar}. Il distintivo richiede {need}, quindi {people} legate a {place} basterebbero.',
    onePersonMore:
      'una persona in più',
    morePeople:
      '{n} persone in più',
    contestedNote:
      'Collocato qui per poterlo trovare. {n} luoghi hanno una rivendicazione documentata su questo piatto: nessuna è risolta, e sono tutte elencate sotto.',
    relatedAlsoFrom:
      'Anche da {place}',
    relatedAlsoCuisine:
      'Anche {cuisine}',
    relatedSharesIngredients:
      'Condivide {n} ingredienti',
    relatedAlsoUses:
      'Usa anche {ingredient}',
    relatedAlsoCategory:
      'Anche {category}',
    authenticVersion:
      'Versione autentica',
    thePublishedRecipe:
      'La ricetta pubblicata',
    whyThisIsAnAdaptation:
      'Perché questo è un adattamento',
    whyConsideredAuthentic:
      'Perché è considerato autentico?',
    whatThisRecordIs:
      'Cos’è questa scheda',
    stepSubmit:
      'Invia',
    stepWhatExists:
      'Cosa esiste',
    stepAssessment:
      'Valutazione',
    stepValidation:
      'Conferma',
    findingAggregatorTitle:
      'Pagina aggregatrice di ricette',
    findingAggregatorTag:
      'Candidata popolare',
    findingAggregatorNote:
      'Risultato in cima. Chi firma non dichiara alcun legame col Malabar; usa burro al posto del ghee.',
    findingVideoTitle:
      'Video di un canale di cucina in malayalam',
    findingVideoTag:
      'Fonte locale',
    findingVideoNote:
      'Girato in Kerala, parlato in malayalam, con ghee e banana nendran come descritto.',
    findingGapTitle:
      'Nessuna testimonianza a livello di città',
    findingGapTag:
      'Vuoto',
    findingGapNote:
      'Niente documenta come si faccia proprio a Kozhikode. Questo invio sarebbe il primo.',
    checkOriginLabel:
      'Origine geografica',
    checkOriginNote:
      'Malabar, Kozhikode — indicato da chi invia e coerente con la fonte video.',
    checkLocalPrepLabel:
      'Preparazione locale',
    checkLocalPrepNote:
      'Descritto come cucina di casa, per l’iftar e per le occasioni di famiglia.',
    checkIngredientsLabel:
      'Ingredienti tradizionali',
    checkIngredientsNote:
      'Banana nendran, uova, ghee — coincide con il video di fonte locale.',
    checkTechniqueLabel:
      'Tecnica tradizionale',
    checkTechniqueNote:
      'Fiamma bassa, coperchio caricato di braci.',
    checkDocumentationLabel:
      'Documentazione storica o culturale',
    checkDocumentationNote:
      'Scarsa. Nessuno studio né documento d’archivio reperito.',
    checkLocalSourceLabel:
      'Fonte locale',
    checkLocalSourceNote:
      'Chi invia dichiara di essere nato a Kozhikode e di cucinarlo lì.',
    checkCommunityLabel:
      'Conferma della comunità',
    checkCommunityNote:
      'Non ancora richiesta. È per questo che la scheda non può ancora dirsi autentica.',
    validatorHomeCook:
      'Cuoca di casa, Kozhikode',
    validatorHomeCookSaid:
      'Ha confermato gli ingredienti e il metodo delle braci sul coperchio.',
    validatorBakery:
      'Titolare di pasticceria, Thalassery',
    validatorBakerySaid:
      'Conferma, e segnala che la sua versione mette meno zucchero.',
    validatorWriter:
      'Giornalista gastronomica, Kerala',
    validatorWriterSaid:
      'Confermato come piatto di casa del Malabar; la documentazione è davvero scarsa.',
    validatorPending:
      'Invitati altri due revisori',
    validatorPendingSaid:
      'In attesa di risposta: la scheda esce anche senza di loro.',
    photoCheckedNote:
      'Viene verificata su Commons quando la scheda è inviata, e mostrata con l’autore e la licenza. Resta Non verificata finché la comunità non la conferma, esattamente come il metodo.',
    mostPublishedNote:
      'La versione più pubblicata è presa come candidata popolare. Non diventa per questo la scheda autentica.',
    sevenChecksNote:
      'Sette verifiche, ciascuna con risposta o lasciata aperta. Quelle aperte abbassano l’affidabilità: non si riempiono mai per supposizione.',
    draftConfidence:
      '/100 di affidabilità provvisoria',
    unverifiedPendingTag:
      '⚪ Non verificato — in attesa della conferma della comunità',
    oneSubmitterNote:
      'Una sola persona del posto è una prova, non una dimostrazione. La scheda resta Non verificata finché non la confermano persone della comunità.',
    threeConfirmationsNote:
      'Tre conferme da persone che vivono o cucinano sul posto portano una scheda fuori da Non verificato.',
    conflictingAccountsNote:
      'I racconti che non coincidono si tengono entrambi. La scheda si divide nelle tradizioni che le persone hanno davvero descritto — una per regione o comunità — e nessuna versione viene dichiarata quella vera.',
    nowhereToSendNote:
      'Non c’è dove mandarlo. L’atlante ha letto tutto quello che le fonti libere contengono, quindi quello che manca adesso è il cibo che nessuno ha scritto — vuol dire che questo modulo è il modo in cui cresce, e verrà attivato appena ci sarà una destinazione.',
    whereTheExampleEndsUp:
      'È lì che finisce la scheda d’esempio: pubblicata con le prove in vista, le verifiche rimaste aperte dichiarate, e ogni affermazione riconducibile a chi l’ha fatta.',
    confirmedBy:
      'Confermato da',
    nothingMatchesAll:
      'Non c’è niente che corrisponda a tutto questo insieme.',
    mostOfYourListFirst:
      'Prima quello che usa di più la tua lista',
    translatesTheAppsWords:
      'Traduce le parole dell’applicazione stessa. I piatti restano nella lingua in cui sono stati registrati: ogni scheda ha i suoi comandi di traduzione.',
    byNameAndPlaceOnly:
      'Questi stanno nell’atlante solo con nome e luogo. Come si facciano non l’ha documentato nessuno, quindi non hanno né metodo né punteggio.',
    wikipediaViewsNote:
      'Quante persone hanno letto di ciascun piatto sulla Wikipedia in inglese nell’ultimo anno. È interesse, non autenticità, e non dice nemmeno quanto un piatto sia mangiato: favorisce ciò che cercano gli anglofoni. Apri ciascuno per vederne la classificazione.',
    requiredDishName:
      'il nome del piatto',
    requiredCountry:
      'il paese',
    requiredYourName:
      'il tuo nome',
    requiredYourConnection:
      'il tuo legame con il luogo',
    requiredWhatYouConfirm:
      'cosa puoi confermare',
    bandNotScored:
      'Senza punteggio',
    bandUnder50:
      'Sotto 50',
    band50to74:
      '50 – 74',
    band75Plus:
      '75 e oltre',
    reviewCapitals:
      'Questo è scritto tutto in maiuscolo.',
    reviewCapitalsConsider:
      'Il minuscolo si legge meglio ed è più facile da tradurre. Il nome del piatto mantiene le maiuscole che gli hai dato.',
    reviewRepeats:
      'Un carattere si ripete più volte di seguito.',
    reviewRepeatsConsider:
      'Controlla che non sia un tasto rimasto premuto.',
    reviewShort:
      'Il metodo è molto corto.',
    reviewShortConsider:
      'Scrivi cosa dovrebbe fare qualcuno per prepararlo, attese comprese. Una scheda senza metodo non può arrivare agli scaffali delle ricette.',
    groupSummaryCountries:
      '{c} paesi · {n} tradizioni',
    groupSummaryOrigins:
      '{c} origini · {n} tradizioni',
    metricTotalTitle:
      'Tradizioni registrate',
    metricTotalCounts:
      'Una tradizione è un modo di fare un cibo in un luogo. Lo stesso piatto fatto diversamente in due regioni sono due tradizioni, e si tengono entrambe.',
    metricTotalMethod:
      'Ogni scheda dell’insieme curato e delle quattro fonti importate che abbia qualcosa da mostrare: come minimo un luogo e un nome. Le righe che aspettano ancora l’arricchimento restano fuori e non si contano.',
    metricTotalCaveat:
      'Questo non è un conteggio dei cibi distinti del mondo, né una misura di quanto l’atlante sappia. La maggior parte di queste schede porta un nome e un paese e nulla più. La quota con un metodo scritto è la cifra che dice se questo è un atlante o un elenco di nomi.',
    metricCountriesTitle:
      'Paesi',
    metricCountriesCounts:
      'Paesi distinti nominati in tutte le schede, una volta risolti i toponimi dell’importazione.',
    metricCountriesMethod:
      'Il campo paese di ogni scheda, senza doppioni, contando solo le origini che sono paesi. Le voci storiche e sovranazionali usate da una fonte — l’Impero ottomano, il Levante, la Mesoamerica — restano sulle loro schede invece di essere riassegnate a uno stato moderno che dovremmo indovinare, e qui non si contano. Contarle aggiungeva trentadue a questa cifra, e ognuna era immaginaria.',
    metricCountriesCaveat:
      'La copertura non è profondità. Un paese compare qui sulla forza di una sola scheda, quindi questo conta dove l’atlante è passato, non dove è buono. Leggilo accanto alla cifra di concentrazione qui sotto, che dice quanto è sbilanciato il totale.',
    metricAtRiskTitle:
      'Tradizioni a rischio',
    metricAtRiskCounts:
      'Schede in cui una fonte, con parole sue, descrive la tradizione come in declino, in via di scomparsa o non più praticata.',
    metricAtRiskMethod:
      'Rilevato leggendo l’introduzione e la storia di ogni voce in cerca di un declino dichiarato — "oggi si fa raramente", "l’ultimo produttore rimasto" — e scartando i quasi-riscontri che vogliono dire altro, come una specie a rischio usata come ingrediente o una catena di ristoranti chiusa. La frase che l’ha fatto scattare è conservata sulla scheda come prova e mostrata con essa.',
    metricAtRiskCaveat:
      'Questo è un pavimento, non un censimento, ed è molto al di sotto della verità. Può trovare solo il declino che qualcuno ha già scritto in un testo che abbiamo letto; una tradizione tenuta da quattro famiglie e mai documentata non registra proprio nulla. Solo l’Arca del Gusto di Slow Food elenca circa seimila cibi in pericolo, mille volte questa cifra.',
    metricDocumentedTitle:
      'Ha un metodo registrato',
    metricDocumentedCounts:
      'Schede che portano un metodo ordinato: i passaggi che qualcuno seguirebbe per farlo.',
    metricDocumentedMethod:
      'Le schede curate hanno un metodo scritto e verificato con la comunità. Quelle importate ce l’hanno solo dove esiste una ricetta pubblicata; un paragrafo d’enciclopedia che descrive come si fa un piatto in generale è conservato come prosa e volutamente non promosso a passaggi, perché presentare una descrizione come metodo rivendica una precisione che non ha.',
    metricDocumentedCaveat:
      'Che ci sia un metodo non dice nulla su se sia quello tradizionale. A questo serve il punteggio di affidabilità, e la maggior parte delle schede con metodo è classificata Adattamento moderno.',
    metricLocatedTitle:
      'Collocato sotto il livello del paese',
    metricLocatedCounts:
      'Schede che nominano una regione, una provincia, una città o un villaggio, non solo un paese.',
    metricLocatedMethod:
      'Qualsiasi scheda il cui luogo abbia un livello compilato sotto il paese.',
    metricLocatedCaveat:
      'L’autenticità ha profondità geografica, e un paese è appena un inizio: "Kozhikode" è una scheda, "India" è un titolo. Un totale alto con una quota bassa qui descrive un atlante largo e poco profondo.',
    metricIllustratedTitle:
      'Ha una fotografia',
    metricIllustratedCounts:
      'Schede con un’immagine che l’applicazione ha il diritto di mostrare.',
    metricIllustratedMethod:
      'Da Wikidata, dalla voce di Wikipedia del piatto stesso, oppure portata da chi cucina attraverso Wikimedia Commons. Ognuna è conservata con l’autore e la licenza, e nessuna è marcata verificata: un’immagine trovata per nome o scelta da una redazione è una buona prova che mostri il piatto, non la conferma di questa applicazione.',
    metricIllustratedCaveat:
      'Una fotografia non è prova di autenticità. Mostra un piatto che qualcuno ha cucinato, che può essere o non essere la tradizione descritta dalla scheda.',
    metricFilmedTitle:
      'Ha un video ordinato',
    metricFilmedCounts:
      'Schede con almeno un video, ordinate per quanto chi cucina è vicino alla tradizione.',
    metricFilmedMethod:
      'Ordinati per località: dove si trova chi cucina, in che lingua parla, se ingredienti e attrezzi coincidono con la scheda. Mai per visualizzazioni, mi piace o iscritti.',
    metricFilmedCaveat:
      'L’ordine riguarda la vicinanza alla tradizione, non la qualità delle riprese, e il primo video è spesso il meno curato.',
    metricAssessedTitle:
      'Classificati come autentici',
    metricAssessedCounts:
      'Schede che hanno raggiunto Autentico — locale o Autentico — regionale attraverso le verifiche di prova.',
    metricAssessedMethod:
      'Sette verifiche, ciascuna con risposta o lasciata aperta, e quelle aperte abbassano l’affidabilità invece di essere riempite per supposizione. Tecnica e conferma della comunità non si deducono mai da un’importazione, il che pone un tetto a quanto una scheda importata può raggiungere da sola.',
    metricAssessedCaveat:
      'Una quota bassa qui è onesta, non un fallimento. Gran parte del catalogo è importata e non valutata, e chiamare autentiche quelle schede perché vengono da una fonte rispettabile è esattamente la scorciatoia che questa scala esiste per rifiutare.',
    metricConcentrationTitle:
      'Concentrazione',
    metricConcentrationCounts:
      'La quota dell’intero catalogo tenuta dal suo singolo paese più grande.',
    metricConcentrationMethod:
      'Le schede del paese più rappresentato, sul totale.',
    metricConcentrationCaveat:
      'Questo riflette quali paesi tengono registri alimentari aperti, non dove sta il cibo del mondo. La sola Italia pubblica circa 4.400 prodotti tradizionali registrati; la maggior parte dei paesi non ne pubblica nessuno, e la loro assenza qui è un’assenza di scartoffie, non di cucina.',
    metricConfidenceTitle:
      'Affidabilità',
    metricConfidenceCounts:
      'Come il catalogo si distribuisce sul punteggio di prova da 0 a 100.',
    metricConfidenceMethod:
      'Le schede curate sono valutate dalle verifiche di prova. Quelle importate lo sono solo dove l’arricchimento ha trovato prove da valutare, e altrimenti restano senza punteggio invece di riceverne uno predefinito.',
    metricConfidenceCaveat:
      '"Senza punteggio" è di gran lunga la fascia più ampia e lo resterà. Vuol dire che nessuno ha ancora valutato la scheda: non che abbia ottenuto un punteggio basso, né che il cibo sia dubbio.',
    metricByContinentTitle:
      'Dove stanno le schede',
    metricByContinentCounts:
      'Schede per continente, contando ogni scheda una volta. Una tradizione sta sul continente del paese in cui è registrata, non su quello da cui può essere arrivata.',
    metricByContinentMethod:
      'Dal paese di ogni scheda, attraverso una mappa paese-continente che copre circa 200 stati, storici compresi. Le voci sovranazionali e contese sono raggruppate invece di essere forzate dentro un continente.',
    metricByContinentCaveat:
      'Questa è una mappa delle fonti, non della cucina del mondo. L’Europa è in testa perché i registri europei sono online e aperti, il che è un fatto sugli archivi.',
    howIsThisCounted:
      'Come si conta questo?',
    hideHowThisIsCounted:
      'Nascondi come si conta',
    stapleGrains: 'Cereali',
    stapleRoots: 'Radici',
    staplePulses: 'Legumi',
    stapleDairy: 'Latticini',
    stapleMeatFish: 'Carne e pesce',
    stapleVegetables: 'Verdure',
    stapleAromatics: 'Aromi',
    stapleSweetSour: 'Dolce e acido',
    stapleRice: 'Riso',
    stapleWheat: 'Grano',
    stapleMaize: 'Mais',
    stapleMillet: 'Miglio',
    stapleSorghum: 'Sorgo',
    stapleBarley: 'Orzo',
    stapleOats: 'Avena',
    stapleBuckwheat: 'Grano saraceno',
    stapleTeff: 'Teff',
    staplePotato: 'Patata',
    stapleCassava: 'Manioca',
    stapleSweetPotato: 'Patata dolce',
    stapleYam: 'Igname',
    stapleTaro: 'Taro',
    staplePlantain: 'Banana da cuocere',
    stapleLentil: 'Lenticchie',
    stapleChickpea: 'Ceci',
    stapleSoy: 'Soia',
    stapleTofu: 'Tofu',
    stapleBlackBean: 'Fagioli neri',
    stapleMungBean: 'Fagioli mung',
    staplePigeonPea: 'Piselli del tropico',
    stapleMilk: 'Latte',
    stapleYoghurt: 'Yogurt',
    stapleCheese: 'Formaggio',
    staplePaneer: 'Paneer',
    stapleGhee: 'Ghee',
    stapleButter: 'Burro',
    stapleCoconut: 'Cocco',
    stapleChicken: 'Pollo',
    stapleBeef: 'Manzo',
    staplePork: 'Maiale',
    stapleLamb: 'Agnello',
    stapleGoat: 'Capra',
    stapleFish: 'Pesce',
    staplePrawn: 'Gamberi',
    stapleEgg: 'Uova',
    stapleOnion: 'Cipolla',
    stapleGarlic: 'Aglio',
    stapleGinger: 'Zenzero',
    stapleChilli: 'Peperoncino',
    stapleLemongrass: 'Citronella',
    stapleTomato: 'Pomodoro',
    stapleAubergine: 'Melanzana',
    stapleCabbage: 'Cavolo',
    stapleSpinach: 'Spinaci',
    stapleOkra: 'Okra',
    stapleTamarind: 'Tamarindo',
    stapleHoney: 'Miele',
    stapleJaggery: 'Jaggery',
    stapleDate: 'Datteri',
    stapleLemon: 'Limone',
    stapleOlive: 'Oliva',
    dietVegan: 'Vegano',
    dietVegetarian: 'Vegetariano',
    dietSeafood: 'Pesce e frutti di mare',
    dietMeat: 'Non vegetariano',
    dietUnclassified: 'Non classificato',
    dietPoultry: 'Pollame',
    dietPork: 'Maiale',
    dietBeef: 'Manzo e carne rossa',
    dietLambGoat: 'Agnello e capra',
    dietGame: 'Selvaggina',
    dietFish: 'Pesce',
    dietShellfish: 'Crostacei e molluschi',
    dietOtherSeafood: 'Altri frutti di mare',
    dietDairy: 'Contiene latticini',
    dietEgg: 'Contiene uova',
    dietHoney: 'Contiene miele',
    mealBreakfast: 'Colazione',
    mealLunch: 'Pranzo',
    mealDinner: 'Cena',
    mealSupper: 'Cena leggera',
    mealSnack: 'Spuntino',
    mealStreetFood: 'Cibo di strada',
    mealCelebration: 'Festa e banchetto',
    mealAnytime: 'A qualsiasi ora',
    mealUnclassified: 'Non registrato',
    searchModeFind:
      'Trova un piatto',
    searchModePantry:
      'Cucinare con quello che ho',
    ingredientsYouHave:
      'Gli ingredienti che hai',
    nTraditions:
      '{n} tradizioni',
    nothingYet:
      'Ancora niente',
    methodRecorded:
      ' · metodo registrato',
    noMethodYet:
      ' · ancora nessun metodo',
    showMoreLeft:
      'Mostra altri — ne restano {n}',
    showNMore:
      'Mostra altri {n}',
    methodAsPublished:
      'Il metodo così com’è stato pubblicato. Attrezzi moderni e scorciatoie ne fanno parte.',
    methodTraditional:
      'Il metodo tradizionale, senza scorciatoie moderne al posto di nulla.',
    everythingClassified:
      'Tutto ciò che è classificato {what}',
    everythingFrom:
      'Tutto quello che viene da {place}',
    everythingRecordedAs:
      'Tutto ciò che è registrato come {what}',
    everythingMadeWith:
      'Tutto ciò che si fa con {ingredient}',
    seeEverything:
      '{label} — vedi tutto',
    noPhotographOnRecord:
      '{label} — nessuna fotografia in scheda',
    scoreOutOf100:
      '{label}: {value} su 100',
    removeFilter:
      'Togli il filtro {key}',
    anywhereInTheAtlas:
      ' in qualsiasi punto dell’atlante',
    absenceOfRecords:
      '. Questa è un’assenza di schede, non un’assenza di cibo: preferiamo dire che non lo sappiamo.',
    narrowToA:
      'Restringi a {level} · {n} registrati',
    fromTheTown:
      ' — del paese stesso',
    showFewer:
      'Mostra meno',
    readAboutOnWikipedia:
      'Leggi di {name} in {language} su Wikipedia',
    languageChangeIt:
      'Lingua: {language}. Cambiala.',
    perCentTranslated:
      '{language}, tradotto al {n} per cento',
    translateThisRecord:
      'Traduci questa scheda',
    translating:
      'Traduzione…',
    translate:
      'Traduci',
    translateThisConfirmation:
      'Traduci questa conferma in {language}',
    couldNotTranslate:
      'Non è stato possibile tradurre — riprova',
    howThisIsCountedFor:
      'Come si conta {figure}',
    countOfTotal:
      '{label}: {count} su {total}',
    watchAtSourceCreator:
      'Guarda {creator} alla fonte',
    stillFromCreator:
      'Fermo immagine di {creator}',
    thatDidNotSend:
      'Non è stato inviato.',
    containsAlcohol:
      'Contiene alcol',
    nothingElseRequired:
      'Tutto il resto è benvenuto e niente è obbligatorio: sapere da dove viene un cibo e che nessuno l’ha scritto è già più di quanto abbia qualsiasi fonte qui.',
    opensTheFormPrefilled:
      'Apre il modulo alla sua fonte con quello che hai già scritto compilato. Questa applicazione non raccoglie niente su di te, e niente viene pubblicato finché non lo confermano persone del posto.',
    scoreDimGeographic:
      'Legame geografico',
    scoreDimIngredients:
      'Ingredienti tradizionali',
    scoreDimTechnique:
      'Tecnica tradizionale',
    scoreDimLocalSource:
      'Fonte locale',
    scoreDimDocumentation:
      'Documentazione culturale',
    scoreDimCommunity:
      'Conferma della comunità',
    photoFromWikidata:
      'Allegata alla voce Wikidata di questo piatto — non trovata per nome',
    photoFromArticle:
      'L’immagine di apertura della voce enciclopedica di questo piatto',
    photoFromRecipe:
      'Pubblicata sulla pagina di questa ricetta',
    photoFromSearch:
      'Trovata per nome su Wikimedia Commons — il soggetto non è confermato',
    photoFromUnknown:
      'Provenienza non registrata — considera il soggetto non confermato',
    noTranslationRecorded:
      'Di questo racconto non è ancora registrata nessuna traduzione, quindi compare in {language}, la lingua in cui è stato documentato. Preferiamo mostrarti l’originale piuttosto che l’ipotesi di una macchina su un tempo di fermentazione.',
    machineTranslationBy:
      'Traduzione automatica di {translator}. Nessuno della comunità l’ha controllata: i nomi di ingredienti e attrezzi restano nell’originale.',
    translatedBy:
      'Tradotto da {translator}. I nomi di ingredienti e attrezzi restano nell’originale.',
    videoOriginalAudio:
      'Parlato in {language}: la lingua di chi cucina. Non si traduce nulla.',
    videoCreatorTrack:
      'Chi l’ha fatto ha pubblicato una traccia audio in {language}. Si apre su quella traccia alla fonte: la traduzione è sua, non nostra.',
    videoPlatformCaptions:
      'Parlato in {spoken}. Si apre con sottotitoli in {preferred} tradotti automaticamente sopra l’audio originale: la voce di chi cucina non viene sostituita, e la traduzione è della piattaforma video, non di una persona.',
    videoLanguageUnknown:
      'Non abbiamo agli atti la lingua parlata di questo video, quindi non possiamo promettere {language}. Si apre alla fonte, dove valgono le opzioni di sottotitoli della piattaforma.',
    figureDocumented:
      'Ha un metodo registrato',
    figureDocumentedNote:
      'La cifra che dice se questo è un atlante o un elenco di nomi. Tutto il resto le è secondario.',
    figureLocated:
      'Collocato sotto il livello del paese',
    figureLocatedNote:
      'L’autenticità ha profondità geografica. “Kozhikode” è una scheda; “India” è appena un inizio.',
    figureIllustrated:
      'Ha una fotografia',
    figureIllustratedNote:
      'Un piatto che nessuno riesce a immaginare è difficile da amare, e più difficile da riconoscere.',
    figureFilmed:
      'Ha un video ordinato',
    figureFilmedNote:
      'Ordinato per quanto chi cucina è vicino alla tradizione, non per risultato di ricerca.',
    figureAssessed:
      'Classificati come autentici',
    figureAssessedNote:
      'Ottenuto tramite le verifiche di prova. Una quota bassa qui è onesta, non un fallimento.',
    atlasSummary:
      '{n} tradizioni registrate in {c} paesi. La copertura è dichiarata onestamente: un paese assente qui non ha ancora nulla di registrato, non è che non ci sia nulla da registrare.',
    nothingRecorded:
      'Niente registrato',
    nothingRecordedAs:
      'Niente registrato come {what}',
    nothingRecordedAsAnd:
      'Niente registrato come {list} e {last}',
    photoVia:
      'foto via',
    photoNothingEntered:
      'Non hai ancora scritto niente.',
    photoNothingEnteredFix:
      'Incolla il nome del file di Commons o il link alla sua pagina.',
    photoWrongHost:
      'Quel link porta a {host}, e non abbiamo il diritto di pubblicare una fotografia presa da lì.',
    photoWrongHostFix:
      'Se la fotografia è tua, caricala su Wikimedia Commons con una licenza libera e incolla qui il nome del file. Resta tua, sei accreditato ovunque compaia, e non costa nulla.',
    photoNotCommons:
      'Quel link non è su Wikimedia Commons.',
    photoNotCommonsFix:
      'Qui si possono pubblicare solo file di Commons, perché solo loro hanno una licenza che ci permette di mostrarli.',
    photoNoFileName:
      'Lì dentro non si trova nessun nome di file.',
    photoNoFileNameFix:
      'Incolla il nome del file, per esempio Kaipola.jpg.',
    photoNotAPhotograph:
      'Quello non è un file di fotografia.',
    photoNotAPhotographFix:
      'Le fotografie di Commons finiscono in .jpg, .png o .webp. Diagrammi e loghi qui non si usano.',
    photoIsADrawing:
      'Quello è un disegno, non una fotografia.',
    photoIsADrawingFix:
      'Usa una fotografia del cibo com’è stato fatto.',
    serverRefused:
      'Il server lo ha rifiutato ({status}).',
    serverTookTooLong:
      'Il server ci ha messo troppo a rispondere.',
    couldNotReachServer:
      'Non si è riusciti a raggiungere il server.',
    nothingYouTypedIsLost:
      '{message} La tua voce non è stata inviata: niente di quello che hai scritto va perso, riprova tra un momento.',
    proposalsNotOpen:
      'Le proposte non sono ancora aperte.',
    confirmationsNotOpen:
      'Le conferme non sono ancora aperte.',
    alreadyProposed:
      'Questo piatto è già stato proposto. Aprilo e confermalo: è questo che lo fa muovere.',
    alreadyConfirmed:
      'Questo l’hai già confermato.',
    youProposedThis:
      'Questo piatto l’hai proposto tu, quindi serve che lo confermi qualcun altro.',
    stillNeededList:
      'Manca ancora: {list}.',
    listAnd:
      '{list} e {last}',
    listOr:
      '{list} o {last}',
    proposalConfirmed:
      'Confermato. Entra nell’atlante al prossimo aggiornamento.',
    proposalNobodyYet:
      'Non l’ha ancora confermato nessuno. {n} persone che conoscono il piatto lo porterebbero nell’atlante.',
    proposalSoFar:
      '{have} conferme su {n}. Altre {short} da chi conosce il piatto lo porterebbero dentro.',
    recordNobodyYet:
      'Non l’ha ancora confermato nessuno del posto. {n} conferme lo autenticherebbero.',
    recordSoFar:
      '{have} conferme su {n}. Altre {short} da chi conosce il piatto lo autenticherebbero.',
    atRiskNote:
      'Segnalato perché una fonte descrive questa tradizione in declino: la frase è mostrata insieme alla scheda. Non si deduce mai da quanto poco abbiamo documentato: un vuoto nelle nostre schede non è prova che qualcuno abbia smesso di cucinare.',
    originDisclaimer:
      'Questo piatto ha più di una rivendicazione storica documentata. Le tradizioni qui sotto sono registrate come le descrive ciascun luogo, con le loro fonti. Nessuna rivendicazione è presentata come vincitrice, e niente di tutto ciò incide sul punteggio di autenticità: quello misura come il piatto si fa in un luogo, non chi l’ha fatto per primo.',
    supportRunsOn:
      'Tutto quello che c’è nell’atlante viene da Wikipedia, Wikidata, Wikimedia Commons, Wikibooks e registri regionali aperti. Sono libere da leggere, con licenza aperta, e accreditate su ogni scheda che le usa. È tutta qui la base per cui il progetto resta gratuito, ed è una decisione, non una fase.',
    contributeToTheAtlas:
      'Contribuisci all’atlante',
    answeredByDocuments:
      'A queste può rispondere un documento',
    answeredByPeople:
      'A queste possono rispondere solo le persone',
    scaleDocumentsStop:
      'qui finiscono i documenti',
    scaleAuthenticBegins:
      'inizia Autentico',
    pantryNothingUses:
      'Niente di registrato usa {list}. Può darsi che nessuno abbia scritto un piatto che lo faccia: il {p}% dell’atlante non ha alcun ingrediente annotato.',
    alsoRecordedIn:
      'Registrato anche sotto {list}',
    alsoRecordedNote:
      'L’atlante tiene lì una scheda separata per questo piatto. Nessuna corregge l’altra: un piatto che due culture preparano non è un errore in nessuna delle due.',
    chooseACountry:
      'Scegli un paese',
    filterTheList:
      'Scrivi per filtrare la lista',
    showingFirstNOfM:
      'Mostrati i primi {n} di {m}. Continua a scrivere per restringere.',
    nothingMatchesThat:
      'Nella lista non corrisponde nulla.',
    continentBeyondOneCountry:
      'Oltre un solo paese',
    beyondOneCountryNote:
      'Origini che le fonti registrano come più ampie di un singolo paese: una regione, un’area culinaria condivisa o uno stato che non esiste più. Restano come le indica la fonte, senza essere ristrette a un paese che nessuno ha scelto.',
    connectionGrewUpThere:
      'Sono cresciuto lì',
    connectionLiveThere:
      'Vivo lì',
    connectionFamilyFrom:
      'La mia famiglia è di lì',
    connectionLearnedThere:
      'Ho imparato a farlo lì',
    connectionCookProfessionally:
      'Lo cucino lì per lavoro',
    chooseYourConnection:
      'Scegli quello che vale per te',
    connectionInYourWords:
      'Quello che vuoi aggiungere, con parole tue',
    connectionDetailPlaceholder:
      'Mia nonna lo faceva ogni Eid a Kozhikode',
    dictateSpeak:
      'Parla invece di scrivere',
    dictateListening:
      'In ascolto — tocca per fermare',
    dictateStop:
      'Smetti di ascoltare',
    dictateSendsAudio:
      'Ad ascoltare è il tuo browser, e la maggior parte invia l’audio ai propri server per farlo. Quello che dici viene aggiunto nel campo qui sopra, dove puoi correggerlo.',
    dictateNotAllowed:
      'Il browser non ha dato il permesso per il microfono.',
    dictateDidNotWork:
      'Non ha funzionato. Puoi comunque scriverlo.',
    polishTidyThis:
      'Sistema la mia scrittura',
    polishWorking:
      'Sto sistemando…',
    polishMachineMade:
      'Suggerito da una macchina: le tue parole restano sopra',
    polishUseThis:
      'Usa questo',
    polishKeepMine:
      'Tengo il mio',
    polishOnlyTyping:
      'Si toccano solo ortografia, punteggiatura e spazi. Niente viene aggiunto, tolto o riformulato, e nessun nome viene cambiato.',
    polishFoundNothing:
      'Niente da correggere: quello che hai scritto si legge bene.',
    polishDidNotWork:
      'Non ha funzionato. Quello che hai scritto è invariato.',
    continentAfrica:
      'Africa',
    continentAsia:
      'Asia',
    continentEurope:
      'Europa',
    continentNorthAmerica:
      'America del Nord',
    continentSouthAmerica:
      'America del Sud',
    continentOceania:
      'Oceania',
    regionLevant:
      'Levante',
    regionLatinAmerica:
      'America Latina',
    regionMiddleEast:
      'Medio Oriente',
    regionMaghreb:
      'Maghreb',
    regionCentralEurope:
      'Europa centrale',
    regionEasternEurope:
      'Europa orientale',
    regionSouthernEurope:
      'Europa meridionale',
    regionCentralAsia:
      'Asia centrale',
    regionIndianSubcontinent:
      'subcontinente indiano',
    regionNorthAfrica:
      'Nordafrica',
    regionAmericas:
      'Americhe',
    regionAncientNearEast:
      'antico Vicino Oriente',
    regionBalkans:
      'Balcani',
    regionCaribbean:
      'Caraibi',
    regionLowCountries:
      'Paesi Bassi storici',
    regionMesoamerica:
      'Mesoamerica',
    regionMiddleEasternEmpires:
      'imperi mediorientali',
    regionPolishLithuanianCommonwealth:
      'Confederazione polacco-lituana',
    regionQajarIran:
      'Iran qajar',
    regionRussianEmpire:
      'Impero russo',
    regionSouthCaucasus:
      'Caucaso meridionale',
    regionSovietCentralAsia:
      'Asia centrale sovietica',
    regionWu:
      'Wu',
    regionArtsakh:
      'Repubblica di Artsakh',
    refineDietOccasion:
      'Dieta e occasione',
    refineAny:
      'Tutti',
    placeKindWiderRegion:
      'regione ampia',
    placeKindFormerState:
      'stato storico',
    oneTradition:
      '1 tradizione',
    onePlace:
      '1 luogo',
    nPlaces:
      '{n} luoghi',
    countryLevelOnly:
      'solo a livello di paese',
    summaryWorldwide:
      ' in tutto il mondo',
    nRecorded:
      '{n} registrate',
    writtenInLanguage:
      'Scritto in {language}',
    whatThisIs:
      'Che cos’è',
    atlasDefinition:
      'Un atlante gratuito di piatti tradizionali: da dove viene ciascuno e chi lo garantisce.',
    traditionsLabel:
      'tradizioni',
    freeNoAds:
      'Gratis, senza pubblicità',
    quotedFromSource:
      'Citato dalla fonte qui sotto — un resoconto generale di come si prepara il piatto, non una testimonianza di come lo si prepara in {place}.',
    adaptationLeadIn:
      'Come si prepara comunemente questo piatto oggi. Non è una testimonianza di come lo si prepara in {place}, e nessuno di là lo ha confermato.',
    openDisagreementBody:
      'Qualcuno che lo cucina in {place} dice che si fa diversamente: {differs} Nulla è stato rimosso durante la verifica e l’attendibilità qui sotto resta invariata — se entrambe le versioni reggono, la scheda si dividerà invece che prevalere una sola.',
    engagementNotShown:
      'I dati di visualizzazione non vengono mostrati di proposito: non misurano l’autenticità.',
    videoSearchNote:
      'Puoi cercarne uno alla fonte. I risultati arrivano ordinati per visualizzazioni, che misurano la diffusione e nient’altro — chi cucina può essere di {place} oppure no. Nulla di ciò che trovi così incide sulla classificazione di questa scheda.',
    nowOpenForConfirmation:
      '{name} è ora aperto alla conferma.',
    proposalOpenBody:
      'Servono {n} persone che conoscano il piatto per confermarlo prima che entri nell’atlante. Da ora chiunque può vederlo e confermarlo — comprese le persone a cui ne parli, ed è di solito così che viene confermato un piatto che nessuno aveva scritto.',
    nothingMatchesBody:
      'Nell’atlante non c’è ancora nulla che corrisponda a {query}. Un’assenza qui significa nessuna scheda, non nessun piatto — preferiamo dire che non lo sappiamo piuttosto che tirare a indovinare.',
    thatWord:
      'quello',
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
      '{n} tradições, construídas inteiramente a partir de fontes livres de ler e com licença aberta. Sem publicidade, sem rastreio e nada atrás de um pagamento. O que é preciso para o manter é coberto por essa escolha de fontes, não por alguém pagar para aqui estar.',
    notForSaleAuthentic:
      'Um registo não pode tornar-se Autêntico pagando. Isso vem das provas e das pessoas que cozinham o prato.',
    notForSalePromotion:
      'Nenhum prato é promovido, colocado acima ou destacado porque alguém pagou.',
    notForSaleAdvertising:
      'Nada aqui é publicidade, e nenhum leitor é rastreado.',
    donationFootnote:
      'Abre no Open Collective. Aqui não se cobra nada — esta aplicação não guarda dados de pagamento seus e nunca guardará.',
    donationsPendingBody:
      'Ainda não há para onde enviar dinheiro. Nada no atlas depende disso — está construído sobre fontes livres de ler, e isso não muda.',
    mostUsefulThing:
      'A coisa mais útil que alguém pode dar a este atlas não é dinheiro. A maior parte dele é um nome e um lugar porque ninguém escreveu como a comida se faz.',
    administration:
      'Administração',
    administrationNote:
      'Limiares, moderação, verificação de fontes e utilização. Precisa de um token.',
    howLead:
      'É a regra sobre a qual este atlas é construído, e é aritmética e não uma política — o que significa que a pode verificar em vez de confiar nela.',
    sixDimensionsBody:
      'Cada registo é pontuado nas mesmas seis dimensões, e as seis estão impressas no próprio registo. A pontuação é a sua média, por isso quem duvidar pode somar os números.',
    ceilingBody:
      'Três dessas seis não podem ser respondidas por nenhum documento alguma vez escrito. Nenhuma enciclopédia sabe se um método é o método de um lugar; nenhum registo é uma pessoa da aldeia. Com essas três vazias, o máximo que um registo pode pontuar só com fontes publicadas é {ceiling}.',
    thresholdBody:
      'Um registo é chamado Autêntico a partir de {threshold}. A distância entre esses dois números é deliberada e é todo o argumento: só pode ser fechada por quem conhece o prato.',
    whatClosesItBody:
      '{n} confirmações de pessoas que declaram a sua ligação ao lugar — e que dizem o que estão a confirmar, não apenas que aprovam. Ambas aparecem no registo, porque uma frase como “nasci em Kozhikode — usamos ghee, não óleo” é uma prova que se pode pesar, e “{n} confirmações” é um número em que é preciso confiar.',
    accountsBody:
      'Essas {n} têm de ser {n} pessoas diferentes, por isso uma confirmação só conta para o distintivo se a pessoa tiver iniciado sessão. Uma anónima é na mesma registada e mostrada no registo — o que alguém sabe vale a pena ter, tenha conta ou não — apenas não mexe no número. Ler o atlas nunca exige iniciar sessão.',
    whichIsWhereYouComeInBody:
      'A maior parte do atlas não tem ninguém a falar por ela. Se sabe como um prato se faz no sítio de onde é, isso é a única coisa que nenhuma fonte pode fornecer e nenhuma recolha automática alcança.',
    notRatings:
      'Sem classificações. Ninguém dá nota a um prato.',
    notComments:
      'Sem comentários e sem mural. Não há aqui nada com que interagir.',
    notAlgorithm:
      'Nenhum algoritmo decide o que vê. A ordem são as provas, e pode mudá-la.',
    notAdvertising:
      'Sem publicidade, e nenhum leitor é rastreado.',
    notPopularity:
      'A popularidade é registada e mantida à parte. A versão mais publicada de um prato nunca se torna a autêntica.',
    dimensionOrigin:
      'De onde é o prato, e com que precisão. Uma vila vale mais do que um país.',
    dimensionIngredients:
      'De que é feito, tal como a tradição o faz.',
    dimensionTechnique:
      'Como se faz — não que alguém tenha publicado uma receita, mas que este é o método do lugar.',
    dimensionLocalSource:
      'Alguém com ligação declarada ao lugar falou por ele.',
    dimensionDocumentation:
      'Um registo, uma inscrição ou uma enciclopédia registou-o.',
    dimensionCommunity:
      'Gente do lugar confirmou-o, e disse o que está a confirmar.',
    fromDocuments:
      'os documentos podem',
    fromPeople:
      'só as pessoas',
    contributeLead:
      'Registe-o tal como é feito onde você está. Nada é publicado só com este formulário — passa primeiro pela avaliação e pela validação da comunidade.',
    writeItTheWayYouWriteIt:
      'Escreva o nome do prato como você o escreve',
    editorialRuleBody:
      'Corrija o nosso texto à vontade — ortografia, gramática, tudo o que se leia mal. Não arrume o prato em si. O nome de um prato, um ingrediente, um utensílio e um lugar ficam exatamente como os escreve quem o cozinha, com acentos e tudo. Se duas grafias divergirem, isso costuma ser duas comunidades e não um erro, e ambas se mantêm.',
    photographTitle:
      'Uma fotografia, se tiver alguma',
    photographBody:
      'Publique a sua própria fotografia no Wikimedia Commons e depois cole aqui o nome do ficheiro. Continua a ser sua, é creditado em todo o lado onde apareça, e não custa nada nem a si nem a nós. Não podemos tirar uma do Instagram ou do TikTok — ali a fotografia é direito de autor de quem a fez, e uma linha de crédito não é uma autorização.',
    walkthroughNoteBody:
      'O que se segue é um exemplo resolvido do que acontece a uma submissão — os achados, as verificações e a pontuação provisória abaixo são de um registo que já está no atlas, não do que acabou de escrever. A sua entrada não é avaliada aqui; é avaliada por pessoas, depois de enviada.',
    examplePreparedBy:
      'Casas do Malabar, feito para o iftar e para ocasiões de família',
    exampleConnection:
      'Nascido em Kozhikode e a cozinhar lá',
    exampleIngredients:
      'Banana nendran madura, ovos, ghee, açúcar, castanhas de caju, passas; cozinhado numa frigideira pesada em lume brando de carvão ou de gás, tapado com uma tampa carregada de brasas',
    shelfFromCountry:
      'De {country}',
    shelfFromCountryNote:
      'O que o atlas tem de {country}. A exatidão aqui vale-lhe mais do que em qualquer outro lado — você consegue perceber se está certo.',
    sending:
      'A enviar…',
    missionHeadline:
      'Cada prato aqui mostra as suas provas.',
    missionStakes:
      'De onde veio, quem o diz e quanto foi realmente estabelecido — impresso em cada registo, e verificável por qualquer pessoa que duvide.',
    statDishes:
      'pratos',
    statCountries:
      'países',
    statDocumented:
      'documentados',
    statRegistered:
      'inscritos',
    statAuthentic:
      'autênticos',
    missionAsk:
      '{n} destes não têm método nenhum registado. {people} pessoas de um lugar podem resolver um de vez.',
    missionAskBody:
      'Ninguém deixou escrito como se fazem — nem em inglês, nem em língua nenhuma, em lado nenhum onde uma máquina chegue. Nenhum arquivo, nenhuma enciclopédia e nada automático os pode autenticar em vez disso; isso é aritmética da pontuação, não uma política. Se você cozinha um, é a única pessoa que o pode fazer.',
    recordADishYouKnow:
      'Registe um prato que conhece',
    howItGetsAuthenticated:
      'Como é autenticado',
    submissionsNotOpen:
      'As submissões ainda não estão abertas — não há para onde as enviar. O percurso acima explica o que acontece quando estiverem.',
    freeAndStayingFree:
      'Gratuito, e vai continuar. Sem publicidade, sem rastreio, sem dinheiro recolhido. Só é preciso conta para confirmar um prato — nunca para ler um.',
    noRatingsNoComments:
      'Sem classificações, sem comentários e sem algoritmo nenhum a decidir o que vê — as listas começam pelas provas, não pela popularidade. As aberturas são contadas como um prato e uma data, nunca como uma pessoa.',
    whyASourceCannot:
      'Porque é que uma fonte não pode autenticar um prato',
    whyASourceCannotBody:
      'A documentação publicada não passa de {ceiling} aqui, e um registo torna-se Autêntico a partir de {threshold}. Essa distância só é fechada por pessoas ligadas ao lugar. Os seis números por trás de cada pontuação estão impressos no registo, por isso quem duvide do total pode somá-lo.',
    whyTheAtlasStops:
      'É também por isso que o atlas para onde para. Todas as fontes livres foram lidas — enciclopédias, livros de cozinha, registos de património, dicionários geográficos — e {n} registos continuam sem nada anotado sobre como se fazem. O que resta nunca foi escrito.',
    levelLocal:
      'Autêntico — local',
    levelLocalFull:
      'Autêntico — local/tradicional',
    levelRegional:
      'Autêntico — regional',
    levelVariation:
      'Variação tradicional',
    levelAdaptation:
      'Adaptação moderna',
    levelFusion:
      'Fusão',
    levelUnverified:
      'Por verificar',
    levelUnverifiedFull:
      'Por verificar — provas insuficientes',
    filterAuthenticOnly:
      'Só autênticos',
    filterTraditionalVariations:
      'Variações tradicionais',
    filterModernAdaptations:
      'Adaptações modernas',
    filterFusion:
      'Fusão',
    filterUnverified:
      'Por verificar',
    filterAll:
      'Todos',
    geoCountry:
      'país',
    geoRegion:
      'região',
    geoProvince:
      'província ou distrito',
    geoCity:
      'cidade ou vila',
    geoVillage:
      'aldeia ou comunidade',
    chooseRegion:
      'Escolha uma região',
    chooseProvince:
      'Escolha uma província ou distrito',
    chooseCity:
      'Escolha uma cidade ou vila',
    chooseVillage:
      'Escolha uma aldeia ou comunidade',
    typeToSearchLevel:
      'Escreva para procurar…',
    browseAllTraditions:
      'Ver as {n} tradições',
    geoPlace:
      'lugar',
    noLevelRecorded:
      'Ainda não há nenhum {level} registado com esse nome. A ausência aqui quer dizer que não há registo, não que não haja comida.',
    browseCuisine:
      'cozinha {cuisine}',
    browseMadeWith:
      'feito com {ingredient}',
    browseEverything:
      'Tudo',
    within:
      'Dentro de {path}',
    chooseCountryHint:
      'Escolha um país · {c} registados',
    chooseCountryHintBroader:
      'Escolha um país · {c} registados, e {b} origens mais amplas',
    noRecordUnderThatReference:
      'Não há nada registado no atlas com essa referência. A ausência aqui quer dizer que não há registo, não que não haja comida.',
    tagTraditionalPreparation:
      '🏺 Preparação tradicional',
    tagAtRiskTradition:
      '🕯️ Tradição em risco',
    notEligibleForAuthentic:
      'Não pode ser classificado como autêntico',
    lookingForWhatItBorrows:
      'Procura a tradição de que isto se serve?',
    howItsDescribed:
      'Como é descrito',
    howItsMade:
      'Como se faz',
    originAndAttribution:
      'Origem e atribuição cultural',
    nobodyRecordedTechnique:
      'Ninguém registou a técnica — os tempos, o recipiente, a ordem das coisas. É isso que tiraria este registo de Por verificar, e é preciso alguém que o cozinhe.',
    nobodyHasRecorded:
      'Ninguém registou como se faz {dish}{place}. Podíamos copiar a receita mais publicada da internet e chamar-lhe autêntica, mas é exatamente isso que este atlas existe para não fazer — por isso o registo fica como está até que alguém que o cozinhe o preencha. Se o fizer, seria a primeira pessoa a escrevê-lo.',
    ifIngredientUnavailable:
      'Se o ingrediente tradicional não se encontrar',
    commonModernSubstitute:
      'Substituto moderno habitual: ',
    adaptationNotAuthentic:
      'Isto é uma adaptação e não deve ser tomado como a preparação autêntica.',
    whatTheInternetServes:
      'O que a internet serve mais para este prato, e em que se afasta da tradição acima.',
    popularNotAuthentic:
      'Popular, mas não é a preparação autêntica. A versão acima continua a ser a referência.',
    videosRankedByCloseness:
      'Vídeos reais, ordenados pela proximidade de quem cozinha à tradição — não por número de visualizações.',
    stillFramesFromVideos:
      'As imagens fixas saem dos próprios vídeos, por isso o prato que vê é o prato que aquela pessoa fez.',
    noVideoRecordedYet:
      'Ainda não há nenhum vídeo da tradição registado para este prato.',
    findOneFromThePlace:
      'Se encontrar um feito por alguém do lugar, pode ser acrescentado em Adicionar uma tradição — é isso que daria a este prato um vídeo ordenado.',
    siblingsNeitherIsReal:
      'O mesmo prato, registado à parte onde é feito de outra maneira. Nenhum é o verdadeiro.',
    doYouKnow:
      'Conhece {subject}?',
    confirmWhatYouKnow:
      'Confirme o que sabe mesmo. Não tem de responder pelo registo todo — uma coisa concreta de quem o cozinha vale mais do que uma concordância geral.',
    recordedThankYou:
      'Registado. Obrigado.',
    shownWithYourConnection:
      'Aparece no registo com a sua ligação ao lado, para que quem lê possa avaliar por si.',
    signedInCounts:
      'Sessão iniciada — isto vai contar para o distintivo.',
    notSignedInNote:
      'Sem sessão iniciada. O que escrever aparece no registo com a sua ligação, e não mexe no distintivo: essa contagem só sobe com pessoas com sessão iniciada, para que uma pessoa não possa valer três.',
    signInSoItCounts:
      'Inicie sessão para contar',
    shownOnTheRecord:
      'Aparece no registo',
    whatCanYouConfirm:
      'O que pode confirmar?',
    exampleSaid:
      'Usamos ghee, não óleo — e faz-se no Eid, não o ano todo.',
    fromTheTownItself:
      'Sou da vila ou da aldeia em si, não só da região mais ampla',
    fromTheTownItselfLabel:
      'Sou da vila ou da aldeia em si, não da região mais ampla',
    exampleWhoMakesIt:
      'Feito em casa para o Eid, pelas avós — opcional',
    exampleIngredientLines:
      'banana-pão madura\novo\nghee',
    exampleMethodLines:
      'Esmague a banana.\nEnvolva o ovo batido.',
    inPlace:
      ' em {place}',
    tagAtRiskShort:
      '🕯️ Em risco',
    readThisIn:
      'Leia isto em',
    communityTranslation:
      'Tradução da comunidade',
    machineTranslation:
      'Tradução automática — ainda não verificada por ninguém da comunidade',
    notTranslatedYet:
      'Ainda por traduzir',
    aDotMarks:
      'Um ponto marca uma língua para a qual este registo já foi traduzido.',
    opensOnceMoreRecords:
      '{language} abre quando mais {n} registos puderem ser lidos nessa língua.',
    noTranslationService:
      'Não há nenhum serviço de tradução ligado a esta versão, por isso nada pode ser traduzido automaticamente. De qualquer forma, uma tradução de quem cozinha este prato vale mais — pode ser dada em Adicionar uma tradição.',
    whatTheseTermsMean:
      'O que estes termos querem dizer',
    signedIn:
      'Sessão iniciada',
    signOut:
      'Terminar sessão',
    signedInSignOut:
      'Sessão iniciada. Terminar sessão.',
    confirmationsCount:
      'As suas confirmações contam para o distintivo.',
    signIn:
      'Iniciar sessão',
    signInSoConfirmationsCount:
      'Inicie sessão para as suas confirmações contarem',
    onlySignedInMovesBadge:
      'Só as confirmações com sessão iniciada mexem num distintivo.',
    watchAtSource:
      'Ver na origem ↗',
    originalAudio:
      'Áudio original',
    creatorsOwnTranslation:
      'Tradução de quem fez o vídeo',
    translatedCaptions:
      'Legendas traduzidas',
    languageUnknown:
      'Língua desconhecida',
    ingredientsInThisVideo:
      'Ingredientes usados neste vídeo',
    weDontInventOne:
      'Quem fez este vídeo não publicou lista de ingredientes nem método escrito, e nós não inventamos nenhum. O método tradicional acima vem das fontes documentadas abaixo.',
    captureFromVideo:
      'Recolher os ingredientes e os passos deste vídeo →',
    dietaryPreference:
      'Preferência alimentar',
    narrowItDown:
      'Afinar',
    anyDiet:
      'Qualquer dieta',
    whenItsEaten:
      'Quando se come',
    anyOccasion:
      'Qualquer ocasião',
    alsoCalled:
      'Também chamado',
    notATranslationOfOurs:
      'Cada um é o nome usado pelo artigo enciclopédico nessa língua — não é uma tradução nossa, e nunca substitui o nome acima. Toque num para o ler lá.',
    relatedTraditions:
      'Tradições relacionadas',
    relatedTraditionsNote:
      'Registos que partilham com este um lugar, uma tradição ou um ingrediente. Cada um diz qual.',
    scoreCannotSettle:
      'Uma estimativa da força das provas — não a pretensão de que uma pontuação possa resolver a verdade cultural.',
    notScored:
      'Sem pontuação',
    navAtlasNote:
      'O que está coberto, e com que confiança',
    navProposeNote:
      'Comida de que o atlas não tem registo',
    navConfirmNote:
      'Pratos à espera de alguém que os conheça',
    navSupportNote:
      'O que custa manter, e quem paga',
    confirmPrompt:
      'É assim que se faz na sua terra?',
    confirmAskBody:
      'Se cozinha isto no lugar de onde vem, confirmá-lo ou corrigi-lo é o que tira um registo de Por verificar. Onde a sua versão for diferente, fica registada ao lado desta — não no lugar dela.',
    confirmYes:
      'Sim, corresponde',
    confirmNo:
      'Na minha terra faz-se de outra maneira',
    confirmPlacePrompt:
      'Este prato é mesmo de onde dizemos?',
    confirmPlaceBody:
      'Ninguém escreveu como este se faz, por isso ainda não há nada com que concordar. O lugar é o que este registo afirma, e isso vale ser confirmado por si só — é uma das seis verificações de prova.',
    confirmPlaceYes:
      'Sim, é daqui',
    confirmPlaceNo:
      'Não, vem de outro sítio',
    standingMet:
      '{n} pessoas ligadas a {place} confirmaram isto — o número que o distintivo exige.',
    standingNobody:
      'Ainda ninguém',
    standingOne:
      'Até agora uma pessoa',
    standingMany:
      'Até agora {n} pessoas',
    standingNeed:
      '{soFar}. O distintivo exige {need}, por isso {people} ligadas a {place} chegariam.',
    onePersonMore:
      'mais uma pessoa',
    morePeople:
      'mais {n} pessoas',
    contestedNote:
      'Arquivado aqui para se poder navegar. {n} lugares têm uma reivindicação documentada deste prato — nenhuma está resolvida, e estão todas listadas abaixo.',
    relatedAlsoFrom:
      'Também de {place}',
    relatedAlsoCuisine:
      'Também {cuisine}',
    relatedSharesIngredients:
      'Partilha {n} ingredientes',
    relatedAlsoUses:
      'Também usa {ingredient}',
    relatedAlsoCategory:
      'Também {category}',
    authenticVersion:
      'Versão autêntica',
    thePublishedRecipe:
      'A receita publicada',
    whyThisIsAnAdaptation:
      'Porque é que isto é uma adaptação',
    whyConsideredAuthentic:
      'Porque é que isto é considerado autêntico?',
    whatThisRecordIs:
      'O que é este registo',
    stepSubmit:
      'Enviar',
    stepWhatExists:
      'O que existe',
    stepAssessment:
      'Avaliação',
    stepValidation:
      'Validação',
    findingAggregatorTitle:
      'Página agregadora de receitas',
    findingAggregatorTag:
      'Candidata popular',
    findingAggregatorNote:
      'Resultado mais bem posicionado. Quem assina não declara ligação ao Malabar; usa manteiga em vez de ghee.',
    findingVideoTitle:
      'Vídeo de um canal de cozinha em malaiala',
    findingVideoTag:
      'Fonte local',
    findingVideoNote:
      'Filmado no Kerala, falado em malaiala, com ghee e banana nendran tal como descrito.',
    findingGapTitle:
      'Sem registo ao nível da cidade',
    findingGapTag:
      'Lacuna',
    findingGapNote:
      'Nada documenta como se faz especificamente em Kozhikode. Esta submissão seria a primeira.',
    checkOriginLabel:
      'Origem geográfica',
    checkOriginNote:
      'Malabar, Kozhikode — indicado por quem submete e coerente com a fonte em vídeo.',
    checkLocalPrepLabel:
      'Preparação local',
    checkLocalPrepNote:
      'Descrito como cozinha de casa, para o iftar e para ocasiões de família.',
    checkIngredientsLabel:
      'Ingredientes tradicionais',
    checkIngredientsNote:
      'Banana nendran, ovos, ghee — coincide com o vídeo de fonte local.',
    checkTechniqueLabel:
      'Técnica tradicional',
    checkTechniqueNote:
      'Lume brando, tampa carregada de brasas.',
    checkDocumentationLabel:
      'Documentação histórica ou cultural',
    checkDocumentationNote:
      'Escassa. Não se localizou estudo nem registo de arquivo.',
    checkLocalSourceLabel:
      'Fonte local',
    checkLocalSourceNote:
      'Quem submete diz ter nascido em Kozhikode e cozinhar lá.',
    checkCommunityLabel:
      'Validação da comunidade',
    checkCommunityNote:
      'Ainda não pedida. É por isso que o registo ainda não pode ser chamado autêntico.',
    validatorHomeCook:
      'Cozinheira de casa, Kozhikode',
    validatorHomeCookSaid:
      'Confirmou os ingredientes e o método das brasas sobre a tampa.',
    validatorBakery:
      'Dono de pastelaria, Thalassery',
    validatorBakerySaid:
      'Confirma, e nota que a versão dele leva menos açúcar.',
    validatorWriter:
      'Jornalista de gastronomia, Kerala',
    validatorWriterSaid:
      'Confirmado como prato de casa do Malabar; a documentação é mesmo escassa.',
    validatorPending:
      'Convidados mais dois revisores',
    validatorPendingSaid:
      'A aguardar resposta — o registo publica-se sem eles.',
    photoCheckedNote:
      'É verificada no Commons quando o registo é submetido, e mostrada com o autor e a licença. Fica Por verificar até a comunidade a confirmar, tal como o método.',
    mostPublishedNote:
      'A versão mais publicada é tomada como candidata popular. Não passa por isso a ser o registo autêntico.',
    sevenChecksNote:
      'Sete verificações, cada uma respondida ou deixada em aberto. As que ficam em aberto baixam a confiança — nunca se preenchem por suposição.',
    draftConfidence:
      '/100 de confiança provisória',
    unverifiedPendingTag:
      '⚪ Por verificar — à espera de validação da comunidade',
    oneSubmitterNote:
      'Uma só pessoa do lugar é prova, não demonstração. O registo fica Por verificar até que pessoas da comunidade o confirmem.',
    threeConfirmationsNote:
      'Três confirmações de pessoas que vivem ou cozinham no lugar tiram um registo de Por verificar.',
    conflictingAccountsNote:
      'Os relatos que divergem guardam-se os dois. O registo divide-se nas tradições que as pessoas realmente descreveram — uma por região ou comunidade — e nenhuma versão é declarada a verdadeira.',
    nowhereToSendNote:
      'Não há para onde enviar isto. O atlas já leu tudo o que as fontes livres têm, por isso o que falta agora é comida que ninguém escreveu — o que quer dizer que este formulário é como ele cresce, e será ligado assim que houver para onde enviar.',
    whereTheExampleEndsUp:
      'É aí que o registo de exemplo acaba: publicado com as provas à vista, as verificações em aberto nomeadas, e cada afirmação rastreável até quem a fez.',
    confirmedBy:
      'Confirmado por',
    nothingMatchesAll:
      'Nada corresponde a tudo isto ao mesmo tempo.',
    mostOfYourListFirst:
      'Primeiro o que usa mais da sua lista',
    translatesTheAppsWords:
      'Traduz as palavras da própria aplicação. Os pratos ficam na língua em que foram registados — cada registo tem os seus próprios controlos de tradução.',
    byNameAndPlaceOnly:
      'Estes estão no atlas só por nome e lugar. Ninguém documentou como se fazem, por isso não têm método nem pontuação.',
    wikipediaViewsNote:
      'Quantas pessoas leram sobre cada prato na Wikipédia em inglês no último ano. Isso é interesse, não autenticidade, e também não diz o quanto um prato é comido — favorece o que os falantes de inglês procuram. Abra cada um para ver a sua classificação.',
    requiredDishName:
      'o nome do prato',
    requiredCountry:
      'o país',
    requiredYourName:
      'o seu nome',
    requiredYourConnection:
      'a sua ligação ao lugar',
    requiredWhatYouConfirm:
      'o que pode confirmar',
    bandNotScored:
      'Sem pontuação',
    bandUnder50:
      'Abaixo de 50',
    band50to74:
      '50 – 74',
    band75Plus:
      '75 ou mais',
    reviewCapitals:
      'Isto está escrito todo em maiúsculas.',
    reviewCapitalsConsider:
      'Em minúsculas lê-se melhor e traduz-se mais facilmente. O nome do prato mantém as maiúsculas que lhe deu.',
    reviewRepeats:
      'Um carácter repete-se várias vezes seguidas.',
    reviewRepeatsConsider:
      'Verifique se não foi uma tecla presa.',
    reviewShort:
      'O método é muito curto.',
    reviewShortConsider:
      'Escreva o que alguém teria de fazer para o preparar, incluindo as esperas. Um registo sem método não chega às prateleiras de receitas.',
    groupSummaryCountries:
      '{c} países · {n} tradições',
    groupSummaryOrigins:
      '{c} origens · {n} tradições',
    metricTotalTitle:
      'Tradições registadas',
    metricTotalCounts:
      'Uma tradição é uma maneira de fazer um alimento num lugar. O mesmo prato feito de outra forma em duas regiões são duas tradições, e guardam-se as duas.',
    metricTotalMethod:
      'Todo o registo do conjunto curado e das quatro fontes importadas que tenha algo para mostrar — no mínimo um lugar e um nome. As linhas ainda à espera de enriquecimento ficam retidas e não são contadas.',
    metricTotalCaveat:
      'Isto não é uma contagem dos alimentos distintos do mundo, nem uma medida do que o atlas sabe. A maioria destes registos traz um nome e um país e mais nada. A parcela com método escrito é o número que diz se isto é um atlas ou uma lista de nomes.',
    metricCountriesTitle:
      'Países',
    metricCountriesCounts:
      'Países distintos nomeados em todos os registos, depois de resolvidos os topónimos da importação.',
    metricCountriesMethod:
      'O campo país de cada registo, sem duplicados, contando só as origens que são países. As entradas históricas e supranacionais que alguma fonte usou — o Império Otomano, o Levante, a Mesoamérica — ficam nos seus registos em vez de serem reatribuídas a um Estado moderno que teríamos de adivinhar, e aqui não são contadas. Contá-las acrescentava trinta e duas a este número, e todas elas eram imaginárias.',
    metricCountriesCaveat:
      'Cobertura não é profundidade. Um país aparece aqui pela força de um único registo, por isso isto conta onde o atlas esteve, não onde é bom. Leia-o ao lado do número de concentração abaixo, que diz o quão desequilibrado o total está.',
    metricAtRiskTitle:
      'Tradições em risco',
    metricAtRiskCounts:
      'Registos em que as próprias palavras de uma fonte descrevem a tradição como em declínio, a desaparecer ou já não praticada.',
    metricAtRiskMethod:
      'Detetado lendo a introdução e a história de cada artigo à procura de declínio declarado — "hoje raramente se faz", "o último produtor que resta" — e descartando quase-coincidências que querem dizer outra coisa, como uma espécie ameaçada usada como ingrediente ou uma cadeia de restaurantes fechada. A frase que o desencadeou fica guardada no registo como prova e é mostrada com ele.',
    metricAtRiskCaveat:
      'Isto é um chão, não um censo, e está muito abaixo da verdade. Só consegue encontrar o declínio que alguém já escreveu num texto que lemos; uma tradição mantida por quatro famílias e nunca documentada não regista absolutamente nada. Só a Arca do Gosto da Slow Food lista cerca de seis mil alimentos em perigo, mil vezes este número.',
    metricDocumentedTitle:
      'Tem método registado',
    metricDocumentedCounts:
      'Registos com um método ordenado — os passos que alguém seguiria para o fazer.',
    metricDocumentedMethod:
      'Os registos curados têm um método escrito e verificado com a comunidade. Os importados só o têm quando existe uma receita publicada; um parágrafo de enciclopédia que descreve como um prato se faz em geral fica guardado como prosa e deliberadamente não é promovido a passos, porque apresentar uma descrição como método reclama uma precisão que não tem.',
    metricDocumentedCaveat:
      'Haver um método não diz nada sobre se é o tradicional. É para isso que serve a pontuação de confiança, e a maioria dos registos com método está classificada como Adaptação moderna.',
    metricLocatedTitle:
      'Situado abaixo do nível do país',
    metricLocatedCounts:
      'Registos que nomeiam uma região, província, cidade ou aldeia, e não apenas um país.',
    metricLocatedMethod:
      'Qualquer registo cujo lugar tenha um nível preenchido abaixo do país.',
    metricLocatedCaveat:
      'A autenticidade tem profundidade geográfica, e um país é apenas um começo — "Kozhikode" é um registo, "Índia" é um cabeçalho. Um total alto com uma parcela baixa aqui descreve um atlas largo e pouco profundo.',
    metricIllustratedTitle:
      'Tem fotografia',
    metricIllustratedCounts:
      'Registos com uma imagem que a aplicação tem o direito de mostrar.',
    metricIllustratedMethod:
      'Do Wikidata, do próprio artigo da Wikipédia do prato, ou dada por quem cozinha através do Wikimedia Commons. Cada uma fica guardada com o autor e a licença, e nenhuma é marcada como verificada: uma imagem encontrada pelo nome ou escolhida por um editor é boa prova de que mostra o prato, não a confirmação desta aplicação.',
    metricIllustratedCaveat:
      'Uma fotografia não é prova de autenticidade. Mostra um prato que alguém cozinhou, que pode ou não ser a tradição que o registo descreve.',
    metricFilmedTitle:
      'Tem vídeo ordenado',
    metricFilmedCounts:
      'Registos com pelo menos um vídeo, ordenados pela proximidade de quem cozinha à tradição.',
    metricFilmedMethod:
      'Ordenados por localidade: onde está quem cozinha, em que língua fala, se os ingredientes e o equipamento coincidem com o registo. Nunca por visualizações, gostos ou subscritores.',
    metricFilmedCaveat:
      'A ordem é sobre a proximidade da tradição, não sobre a qualidade da filmagem, e o primeiro vídeo é muitas vezes o menos polido.',
    metricAssessedTitle:
      'Classificados como autênticos',
    metricAssessedCounts:
      'Registos que chegaram a Autêntico — local ou Autêntico — regional através das verificações de prova.',
    metricAssessedMethod:
      'Sete verificações, cada uma respondida ou deixada em aberto, e as que ficam em aberto baixam a confiança em vez de serem preenchidas por suposição. A técnica e a validação da comunidade nunca são inferidas de uma importação, o que limita o que um registo importado pode alcançar sozinho.',
    metricAssessedCaveat:
      'Uma parcela baixa aqui é honesta, não um fracasso. A maior parte do catálogo é importada e não avaliada, e chamar autênticos a esses registos por virem de uma fonte respeitável é exatamente o atalho que esta escala existe para recusar.',
    metricConcentrationTitle:
      'Concentração',
    metricConcentrationCounts:
      'A parcela de todo o catálogo detida pelo seu maior país isolado.',
    metricConcentrationMethod:
      'Os registos do país mais representado, a dividir pelo total.',
    metricConcentrationCaveat:
      'Isto reflete que países mantêm registos alimentares abertos, não onde está a comida do mundo. Só a Itália publica cerca de 4.400 produtos tradicionais registados; a maioria dos países não publica nenhum, e a sua ausência aqui é uma ausência de papelada, não de cozinha.',
    metricConfidenceTitle:
      'Confiança',
    metricConfidenceCounts:
      'Como o catálogo se distribui pela pontuação de prova de 0 a 100.',
    metricConfidenceMethod:
      'Os registos curados são pontuados pelas verificações de prova. Os importados só são pontuados onde o enriquecimento encontrou provas para pontuar, e nos restantes casos ficam sem pontuação em vez de receberem um valor por omissão.',
    metricConfidenceCaveat:
      '"Sem pontuação" é de longe a maior faixa e vai continuar a sê-lo. Quer dizer que ninguém avaliou ainda o registo — não que tenha pontuado mal, nem que a comida seja duvidosa.',
    metricByContinentTitle:
      'Onde estão os registos',
    metricByContinentCounts:
      'Registos por continente, contando cada registo uma vez. Uma tradição fica no continente do país onde está registada, não naquele de onde possa ter viajado.',
    metricByContinentMethod:
      'A partir do país de cada registo, através de um mapa país-continente que cobre cerca de 200 Estados, incluindo históricos. As entradas supranacionais e disputadas são agrupadas em vez de forçadas para dentro de um continente.',
    metricByContinentCaveat:
      'Este é um mapa das fontes, não da cozinha do mundo. A Europa lidera porque os registos europeus estão em linha e abertos, o que é um facto sobre arquivos.',
    howIsThisCounted:
      'Como é que isto é contado?',
    hideHowThisIsCounted:
      'Esconder como é contado',
    stapleGrains: 'Cereais',
    stapleRoots: 'Raízes',
    staplePulses: 'Leguminosas',
    stapleDairy: 'Lacticínios',
    stapleMeatFish: 'Carne e peixe',
    stapleVegetables: 'Legumes',
    stapleAromatics: 'Aromáticos',
    stapleSweetSour: 'Doce e ácido',
    stapleRice: 'Arroz',
    stapleWheat: 'Trigo',
    stapleMaize: 'Milho',
    stapleMillet: 'Milhete',
    stapleSorghum: 'Sorgo',
    stapleBarley: 'Cevada',
    stapleOats: 'Aveia',
    stapleBuckwheat: 'Trigo-sarraceno',
    stapleTeff: 'Teff',
    staplePotato: 'Batata',
    stapleCassava: 'Mandioca',
    stapleSweetPotato: 'Batata-doce',
    stapleYam: 'Inhame',
    stapleTaro: 'Taro',
    staplePlantain: 'Banana-pão',
    stapleLentil: 'Lentilhas',
    stapleChickpea: 'Grão-de-bico',
    stapleSoy: 'Soja',
    stapleTofu: 'Tofu',
    stapleBlackBean: 'Feijão-preto',
    stapleMungBean: 'Feijão-mungo',
    staplePigeonPea: 'Feijão-guandu',
    stapleMilk: 'Leite',
    stapleYoghurt: 'Iogurte',
    stapleCheese: 'Queijo',
    staplePaneer: 'Paneer',
    stapleGhee: 'Ghee',
    stapleButter: 'Manteiga',
    stapleCoconut: 'Coco',
    stapleChicken: 'Frango',
    stapleBeef: 'Carne de vaca',
    staplePork: 'Porco',
    stapleLamb: 'Borrego',
    stapleGoat: 'Cabra',
    stapleFish: 'Peixe',
    staplePrawn: 'Camarões',
    stapleEgg: 'Ovos',
    stapleOnion: 'Cebola',
    stapleGarlic: 'Alho',
    stapleGinger: 'Gengibre',
    stapleChilli: 'Malagueta',
    stapleLemongrass: 'Capim-limão',
    stapleTomato: 'Tomate',
    stapleAubergine: 'Beringela',
    stapleCabbage: 'Repolho',
    stapleSpinach: 'Espinafre',
    stapleOkra: 'Quiabo',
    stapleTamarind: 'Tamarindo',
    stapleHoney: 'Mel',
    stapleJaggery: 'Rapadura',
    stapleDate: 'Tâmaras',
    stapleLemon: 'Limão',
    stapleOlive: 'Azeitona',
    dietVegan: 'Vegano',
    dietVegetarian: 'Vegetariano',
    dietSeafood: 'Peixe e marisco',
    dietMeat: 'Não vegetariano',
    dietUnclassified: 'Não classificado',
    dietPoultry: 'Aves',
    dietPork: 'Porco',
    dietBeef: 'Vaca e carne vermelha',
    dietLambGoat: 'Borrego e cabra',
    dietGame: 'Caça',
    dietFish: 'Peixe',
    dietShellfish: 'Marisco',
    dietOtherSeafood: 'Outros produtos do mar',
    dietDairy: 'Contém lacticínios',
    dietEgg: 'Contém ovo',
    dietHoney: 'Contém mel',
    mealBreakfast: 'Pequeno-almoço',
    mealLunch: 'Almoço',
    mealDinner: 'Jantar',
    mealSupper: 'Ceia',
    mealSnack: 'Lanche',
    mealStreetFood: 'Comida de rua',
    mealCelebration: 'Celebração e festa',
    mealAnytime: 'A qualquer hora',
    mealUnclassified: 'Não registado',
    searchModeFind:
      'Encontrar um prato',
    searchModePantry:
      'Cozinhar com o que tenho',
    ingredientsYouHave:
      'Os ingredientes que tem',
    nTraditions:
      '{n} tradições',
    nothingYet:
      'Ainda nada',
    methodRecorded:
      ' · com método registado',
    noMethodYet:
      ' · ainda sem método',
    showMoreLeft:
      'Ver mais — faltam {n}',
    showNMore:
      'Ver mais {n}',
    methodAsPublished:
      'O método tal como foi publicado. Equipamento moderno e atalhos fazem parte dele.',
    methodTraditional:
      'O método tradicional, sem atalhos modernos substituídos.',
    everythingClassified:
      'Tudo o que está classificado como {what}',
    everythingFrom:
      'Tudo o que vem de {place}',
    everythingRecordedAs:
      'Tudo o que está registado como {what}',
    everythingMadeWith:
      'Tudo o que se faz com {ingredient}',
    seeEverything:
      '{label} — ver tudo',
    noPhotographOnRecord:
      '{label} — sem fotografia no registo',
    scoreOutOf100:
      '{label}: {value} em 100',
    removeFilter:
      'Retirar o filtro {key}',
    anywhereInTheAtlas:
      ' em qualquer parte do atlas',
    absenceOfRecords:
      '. Isso é uma ausência de registos, não uma ausência de comida — preferimos dizer que não sabemos.',
    narrowToA:
      'Afinar para {level} · {n} registados',
    fromTheTown:
      ' — da própria vila',
    showFewer:
      'Ver menos',
    readAboutOnWikipedia:
      'Ler sobre {name} em {language} na Wikipédia',
    languageChangeIt:
      'Língua: {language}. Mudar.',
    perCentTranslated:
      '{language}, {n} por cento traduzido',
    translateThisRecord:
      'Traduzir este registo',
    translating:
      'A traduzir…',
    translate:
      'Traduzir',
    translateThisConfirmation:
      'Traduzir esta confirmação para {language}',
    couldNotTranslate:
      'Não foi possível traduzir — tente outra vez',
    howThisIsCountedFor:
      'Como se conta {figure}',
    countOfTotal:
      '{label}: {count} de {total}',
    watchAtSourceCreator:
      'Ver {creator} na origem',
    stillFromCreator:
      'Imagem de {creator}',
    thatDidNotSend:
      'Não foi enviado.',
    containsAlcohol:
      'Contém álcool',
    nothingElseRequired:
      'Tudo o resto é bem-vindo e nada é obrigatório — saber de onde é uma comida e que ninguém a escreveu já é mais do que qualquer fonte daqui tem.',
    opensTheFormPrefilled:
      'Abre o formulário na origem com o que já escreveu preenchido. Esta aplicação não recolhe nada sobre si, e nada é publicado até que pessoas do lugar o confirmem.',
    scoreDimGeographic:
      'Ligação geográfica',
    scoreDimIngredients:
      'Ingredientes tradicionais',
    scoreDimTechnique:
      'Técnica tradicional',
    scoreDimLocalSource:
      'Fonte local',
    scoreDimDocumentation:
      'Documentação cultural',
    scoreDimCommunity:
      'Validação da comunidade',
    photoFromWikidata:
      'Anexada à própria entrada do Wikidata deste prato — não encontrada pelo nome',
    photoFromArticle:
      'A imagem principal do próprio artigo enciclopédico deste prato',
    photoFromRecipe:
      'Publicada na página desta mesma receita',
    photoFromSearch:
      'Encontrada pelo nome no Wikimedia Commons — o motivo não está confirmado',
    photoFromUnknown:
      'Origem não registada — trate o motivo como não confirmado',
    noTranslationRecorded:
      'Ainda não há nenhuma tradução registada deste relato, por isso é mostrado em {language}, a língua em que foi documentado. Preferimos mostrar-lhe o original do que o palpite de uma máquina sobre um tempo de fermentação.',
    machineTranslationBy:
      'Tradução automática de {translator}. Ninguém da comunidade a verificou — os nomes de ingredientes e utensílios ficam no original.',
    translatedBy:
      'Traduzido por {translator}. Os nomes de ingredientes e utensílios ficam no original.',
    videoOriginalAudio:
      'Falado em {language} — a própria língua de quem cozinha. Nada é traduzido.',
    videoCreatorTrack:
      'Quem o fez publicou uma faixa de áudio em {language}. Abre nessa faixa na origem — a tradução é dele, não nossa.',
    videoPlatformCaptions:
      'Falado em {spoken}. Abre com legendas em {preferred} traduzidas automaticamente por cima do áudio original — a voz de quem cozinha não é substituída, e a tradução é da plataforma de vídeo, não de uma pessoa.',
    videoLanguageUnknown:
      'Não temos registada a língua falada deste vídeo, por isso não podemos prometer {language}. Abre na origem, onde se aplicam as opções de legendas da própria plataforma.',
    figureDocumented:
      'Tem método registado',
    figureDocumentedNote:
      'O número que diz se isto é um atlas ou uma lista de nomes. Tudo o resto lhe é secundário.',
    figureLocated:
      'Situado abaixo do nível do país',
    figureLocatedNote:
      'A autenticidade tem profundidade geográfica. “Kozhikode” é um registo; “Índia” é apenas um começo.',
    figureIllustrated:
      'Tem fotografia',
    figureIllustratedNote:
      'Um prato que ninguém consegue imaginar custa a interessar, e custa mais a reconhecer.',
    figureFilmed:
      'Tem vídeo ordenado',
    figureFilmedNote:
      'Ordenado pela proximidade de quem cozinha à tradição — não é um resultado de pesquisa.',
    figureAssessed:
      'Classificados como autênticos',
    figureAssessedNote:
      'Conseguido através das verificações de prova. Uma parcela baixa aqui é honesta, não um fracasso.',
    atlasSummary:
      '{n} tradições registadas em {c} países. A cobertura é declarada com honestidade: um país ausente aqui ainda não tem nada registado, não é que não haja nada para registar.',
    nothingRecorded:
      'Nada registado',
    nothingRecordedAs:
      'Nada registado como {what}',
    nothingRecordedAsAnd:
      'Nada registado como {list} e {last}',
    photoVia:
      'foto via',
    photoNothingEntered:
      'Ainda não escreveu nada.',
    photoNothingEnteredFix:
      'Cole o nome do ficheiro do Commons ou o link para a sua página.',
    photoWrongHost:
      'Esse link vai para {host}, e não temos direito a publicar uma fotografia de lá.',
    photoWrongHostFix:
      'Se a fotografia é sua, carregue-a no Wikimedia Commons com uma licença livre e cole aqui o nome do ficheiro. Continua a ser sua, é creditado onde quer que apareça, e não custa nada.',
    photoNotCommons:
      'Esse link não está no Wikimedia Commons.',
    photoNotCommonsFix:
      'Aqui só podem ser publicados ficheiros do Commons, porque só eles têm uma licença que nos deixa mostrá-los.',
    photoNoFileName:
      'Não se encontrou nenhum nome de ficheiro nisso.',
    photoNoFileNameFix:
      'Cole o nome do ficheiro, por exemplo Kaipola.jpg.',
    photoNotAPhotograph:
      'Isso não é um ficheiro de fotografia.',
    photoNotAPhotographFix:
      'As fotografias do Commons acabam em .jpg, .png ou .webp. Diagramas e logótipos não são usados aqui.',
    photoIsADrawing:
      'Isso é um desenho, não uma fotografia.',
    photoIsADrawingFix:
      'Use uma fotografia da comida tal como foi feita.',
    serverRefused:
      'O servidor recusou ({status}).',
    serverTookTooLong:
      'O servidor demorou demasiado a responder.',
    couldNotReachServer:
      'Não foi possível chegar ao servidor.',
    nothingYouTypedIsLost:
      '{message} A sua entrada não foi enviada — nada do que escreveu se perde, tente outra vez daqui a pouco.',
    proposalsNotOpen:
      'As propostas ainda não estão abertas.',
    confirmationsNotOpen:
      'As confirmações ainda não estão abertas.',
    alreadyProposed:
      'Este prato já foi proposto. Abra-o e confirme-o: é isso que o faz avançar.',
    alreadyConfirmed:
      'Já confirmou este.',
    youProposedThis:
      'Foi você que propôs este prato, por isso precisa que outra pessoa o confirme.',
    stillNeededList:
      'Ainda falta: {list}.',
    listAnd:
      '{list} e {last}',
    listOr:
      '{list} ou {last}',
    proposalConfirmed:
      'Confirmado. Entra no atlas na próxima atualização.',
    proposalNobodyYet:
      'Ainda ninguém confirmou isto. {n} pessoas que conheçam o prato trá-lo-iam para o atlas.',
    proposalSoFar:
      '{have} de {n} confirmações. Mais {short} de quem conheça o prato trá-lo-iam.',
    recordNobodyYet:
      'Ainda ninguém do lugar confirmou isto. {n} confirmações autenticá-lo-iam.',
    recordSoFar:
      '{have} de {n} confirmações. Mais {short} de quem conheça o prato autenticá-lo-iam.',
    atRiskNote:
      'Assinalado porque uma fonte descreve esta tradição como em declínio — a frase é mostrada com o registo. Nunca é deduzido do pouco que documentámos: uma falha nos nossos registos não é prova de que alguém deixou de cozinhar.',
    originDisclaimer:
      'Este prato tem mais do que uma reivindicação histórica documentada. As tradições abaixo estão registadas tal como cada lugar as descreve, com as suas fontes. Nenhuma reivindicação é aqui apresentada como vencedora, e nada disto afeta a pontuação de autenticidade: essa mede como o prato é feito num lugar, não quem o fez primeiro.',
    supportRunsOn:
      'Tudo o que está no atlas vem da Wikipédia, Wikidata, Wikimedia Commons, Wikibooks e de registos regionais abertos. São livres de ler, têm licença aberta e são creditadas em cada registo que as usa. É essa toda a base para o projeto continuar gratuito, e é uma decisão, não uma fase.',
    contributeToTheAtlas:
      'Contribuir para o atlas',
    answeredByDocuments:
      'Os documentos conseguem responder a estas',
    answeredByPeople:
      'Só as pessoas conseguem responder a estas',
    scaleDocumentsStop:
      'aqui param os documentos',
    scaleAuthenticBegins:
      'começa Autêntico',
    pantryNothingUses:
      'Nada do que está registado usa {list}. Pode ser que ninguém tenha escrito um prato que use: {p}% do atlas não tem qualquer ingrediente anotado.',
    alsoRecordedIn:
      'Também registado em {list}',
    alsoRecordedNote:
      'O atlas guarda ali um registo separado deste prato. Nenhum corrige o outro — um prato que duas culturas fazem não é um erro em nenhuma delas.',
    chooseACountry:
      'Escolha um país',
    filterTheList:
      'Escreva para filtrar a lista',
    showingFirstNOfM:
      'A mostrar os primeiros {n} de {m}. Continue a escrever para restringir.',
    nothingMatchesThat:
      'Nada na lista corresponde a isso.',
    continentBeyondOneCountry:
      'Para lá de um país',
    beyondOneCountryNote:
      'Origens que as fontes registam como mais amplas do que um único país: uma região, uma área culinária partilhada ou um estado que já não existe. São mantidas tal como a fonte as indica, sem serem reduzidas a um país que ninguém escolheu.',
    connectionGrewUpThere:
      'Cresci lá',
    connectionLiveThere:
      'Vivo lá',
    connectionFamilyFrom:
      'A minha família é de lá',
    connectionLearnedThere:
      'Aprendi a fazê-lo lá',
    connectionCookProfessionally:
      'Cozinho-o lá profissionalmente',
    chooseYourConnection:
      'Escolha o que se aplica',
    connectionInYourWords:
      'O que quiser acrescentar, nas suas palavras',
    connectionDetailPlaceholder:
      'A minha avó fazia-o em cada Eid em Kozhikode',
    dictateSpeak:
      'Falar em vez de escrever',
    dictateListening:
      'A ouvir — toque para parar',
    dictateStop:
      'Parar de ouvir',
    dictateSendsAudio:
      'Quem ouve é o seu navegador, e a maioria envia o áudio para os próprios servidores para o fazer. O que disser é acrescentado à caixa acima, onde pode corrigir.',
    dictateNotAllowed:
      'O navegador não deu permissão para o microfone.',
    dictateDidNotWork:
      'Não resultou. Pode escrever à mesma.',
    polishTidyThis:
      'Corrigir a minha escrita',
    polishWorking:
      'A corrigir…',
    polishMachineMade:
      'Sugerido por uma máquina — as suas palavras continuam acima',
    polishUseThis:
      'Usar isto',
    polishKeepMine:
      'Ficar com o meu',
    polishOnlyTyping:
      'Só se mexe na ortografia, na pontuação e nos espaços. Nada é acrescentado, retirado ou reescrito, e nenhum nome é alterado.',
    polishFoundNothing:
      'Nada a corrigir — o que escreveu lê-se bem.',
    polishDidNotWork:
      'Não resultou. O que escreveu está inalterado.',
    continentAfrica:
      'África',
    continentAsia:
      'Ásia',
    continentEurope:
      'Europa',
    continentNorthAmerica:
      'América do Norte',
    continentSouthAmerica:
      'América do Sul',
    continentOceania:
      'Oceania',
    regionLevant:
      'Levante',
    regionLatinAmerica:
      'América Latina',
    regionMiddleEast:
      'Oriente Médio',
    regionMaghreb:
      'Magrebe',
    regionCentralEurope:
      'Europa Central',
    regionEasternEurope:
      'Europa Oriental',
    regionSouthernEurope:
      'Europa do Sul',
    regionCentralAsia:
      'Ásia Central',
    regionIndianSubcontinent:
      'subcontinente indiano',
    regionNorthAfrica:
      'África do Norte',
    regionAmericas:
      'Américas',
    regionAncientNearEast:
      'Antigo Oriente Próximo',
    regionBalkans:
      'Balcãs',
    regionCaribbean:
      'Caribe',
    regionLowCountries:
      'Países Baixos históricos',
    regionMesoamerica:
      'Mesoamérica',
    regionMiddleEasternEmpires:
      'impérios do Oriente Médio',
    regionPolishLithuanianCommonwealth:
      'República das Duas Nações',
    regionQajarIran:
      'Irã Qajar',
    regionRussianEmpire:
      'Império Russo',
    regionSouthCaucasus:
      'Cáucaso do Sul',
    regionSovietCentralAsia:
      'Ásia Central Soviética',
    regionWu:
      'Wu',
    regionArtsakh:
      'República de Artsakh',
    refineDietOccasion:
      'Dieta e ocasião',
    refineAny:
      'Todos',
    placeKindWiderRegion:
      'região ampla',
    placeKindFormerState:
      'estado histórico',
    oneTradition:
      '1 tradição',
    onePlace:
      '1 lugar',
    nPlaces:
      '{n} lugares',
    countryLevelOnly:
      'apenas ao nível do país',
    summaryWorldwide:
      ' em todo o mundo',
    nRecorded:
      '{n} registadas',
    writtenInLanguage:
      'Escrito em {language}',
    whatThisIs:
      'O que é isto',
    atlasDefinition:
      'Um atlas gratuito de pratos tradicionais — de onde vem cada um e quem responde por ele.',
    traditionsLabel:
      'tradições',
    freeNoAds:
      'Grátis, sem anúncios',
    quotedFromSource:
      'Citado da fonte abaixo — um relato geral de como o prato é feito, não um registo de como se faz em {place}.',
    adaptationLeadIn:
      'Como este prato é normalmente feito hoje. Não é um registo de como se prepara em {place}, e ninguém de lá o confirmou.',
    openDisagreementBody:
      'Alguém que cozinha isto em {place} diz que se faz de outra forma: {differs} Nada foi removido enquanto isto é analisado, e a confiança abaixo mantém-se — se ambos os relatos se sustentarem, o registo divide-se em vez de um prevalecer.',
    engagementNotShown:
      'Números de audiência não são mostrados de propósito: não medem autenticidade.',
    videoSearchNote:
      'Pode procurar um na fonte. Os resultados vêm ordenados por visualizações, o que mede alcance e mais nada — quem cozinha pode ser ou não de {place}. Nada encontrado assim afeta a classificação deste registo.',
    nowOpenForConfirmation:
      '{name} está agora aberto a confirmação.',
    proposalOpenBody:
      '{n} pessoas que conheçam o prato têm de o confirmar antes de entrar no atlas. A partir de agora qualquer pessoa pode vê-lo e confirmá-lo — incluindo aquelas a quem contar, que é normalmente como se confirma um prato que ninguém tinha escrito.',
    nothingMatchesBody:
      'Nada no atlas corresponde a {query} ainda. Uma ausência aqui significa nenhum registo, não nenhuma comida — preferimos dizer que não sabemos a adivinhar.',
    thatWord:
      'isso',
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
      '{n} tradities, volledig gebouwd op bronnen die vrij te lezen en open gelicentieerd zijn. Geen advertenties, geen tracking en niets achter een betaling. Wat het draaien vraagt, wordt gedekt door die keuze van bronnen — niet doordat iemand betaalt om hier te staan.',
    notForSaleAuthentic:
      'Een record kan niet Echt worden door ervoor te betalen. Dat komt uit bewijs en van mensen die het gerecht koken.',
    notForSalePromotion:
      'Geen gerecht wordt gepromoot, hoger gezet of uitgelicht omdat iemand betaald heeft.',
    notForSaleAdvertising:
      'Niets hier is reclame, en geen lezer wordt gevolgd.',
    donationFootnote:
      'Opent bij Open Collective. Hier wordt niets geïnd — deze app bewaart geen betaalgegevens van u en zal dat nooit doen.',
    donationsPendingBody:
      'Er is nog nergens om geld heen te sturen. Niets aan de atlas hangt daarvan af — hij staat op bronnen die vrij te lezen zijn, en dat verandert niet.',
    mostUsefulThing:
      'Het nuttigste dat iemand deze atlas kan geven is geen geld. Het meeste ervan is een naam en een plek, omdat niemand heeft opgeschreven hoe het eten gemaakt wordt.',
    administration:
      'Beheer',
    administrationNote:
      'Drempels, moderatie, broncontroles en gebruik. Vereist een token.',
    howLead:
      'Dat is de regel waarop deze atlas is gebouwd, en het is rekenkunde en geen beleid — u kunt haar dus controleren in plaats van erop te vertrouwen.',
    sixDimensionsBody:
      'Elk record wordt op dezelfde zes dimensies beoordeeld, en alle zes staan op het record zelf. De score is hun gemiddelde, dus wie eraan twijfelt kan de getallen optellen.',
    ceilingBody:
      'Drie van die zes kunnen door geen enkel ooit geschreven document worden beantwoord. Geen encyclopedie weet of een bereiding de bereiding van een plek is; geen register is een mens uit het dorp. Met die drie leeg is het hoogste dat een record op alleen gepubliceerde bronnen kan halen {ceiling}.',
    thresholdBody:
      'Een record heet Echt vanaf {threshold}. De afstand tussen die twee getallen is bewust en is het hele argument: alleen mensen die het gerecht kennen kunnen hem dichten.',
    whatClosesItBody:
      '{n} bevestigingen van mensen die hun band met de plek noemen — en die zeggen wát ze bevestigen, niet alleen dat ze het eens zijn. Beide staan op het record, want een zin als “geboren in Kozhikode — wij gebruiken ghee, geen olie” is bewijs dat je kunt wegen, terwijl “{n} bevestigingen” een getal is dat je moet geloven.',
    accountsBody:
      'Die {n} moeten {n} verschillende mensen zijn, dus een bevestiging telt alleen mee voor het kenmerk als de persoon was ingelogd. Een anonieme wordt evengoed vastgelegd en op het record getoond — wat iemand weet is het waard, met of zonder account — het verzet alleen het getal niet. De atlas lezen vraagt nooit om inloggen.',
    whichIsWhereYouComeInBody:
      'Voor het grootste deel van de atlas spreekt niemand. Als u weet hoe een gerecht wordt gemaakt waar u vandaan komt, is dat het enige dat geen bron kan leveren en geen verzameling kan bereiken.',
    notRatings:
      'Geen beoordelingen. Niemand geeft een gerecht een cijfer.',
    notComments:
      'Geen reacties en geen feed. Er is hier niets om mee te interacteren.',
    notAlgorithm:
      'Geen algoritme bepaalt wat u ziet. De volgorde is het bewijs, en u kunt haar veranderen.',
    notAdvertising:
      'Geen reclame, en geen lezer wordt gevolgd.',
    notPopularity:
      'Populariteit wordt vastgelegd en apart gehouden. De meest gepubliceerde versie van een gerecht wordt nooit de echte.',
    dimensionOrigin:
      'Waar het gerecht vandaan komt, en hoe precies. Een dorp wint van een land.',
    dimensionIngredients:
      'Waarvan het gemaakt is, zoals de traditie het maakt.',
    dimensionTechnique:
      'Hoe het gemaakt wordt — niet dat iemand een recept publiceerde, maar dat dit de bereiding van die plek is.',
    dimensionLocalSource:
      'Iemand met een genoemde band met de plek heeft ervoor gesproken.',
    dimensionDocumentation:
      'Een register, een inschrijving of een encyclopedie heeft het vastgelegd.',
    dimensionCommunity:
      'Mensen van die plek hebben het bevestigd, en gezegd wát ze bevestigen.',
    fromDocuments:
      'documenten kunnen',
    fromPeople:
      'alleen mensen',
    contributeLead:
      'Leg het vast zoals het gemaakt wordt waar u bent. Uit dit formulier alleen wordt niets gepubliceerd — het gaat eerst door de beoordeling en door de bevestiging van de gemeenschap.',
    writeItTheWayYouWriteIt:
      'Schrijf de naam van het gerecht zoals u hem schrijft',
    editorialRuleBody:
      'Verbeter onze tekst gerust — spelling, grammatica, alles wat slecht leest. Verbeter het gerecht zelf niet. Een gerechtsnaam, een ingrediënt, een stuk gereedschap en een plaats blijven precies zoals de mensen die het koken ze schrijven, accenten en al. Als twee spellingen van elkaar afwijken, zijn dat meestal twee gemeenschappen en geen fout, en beide blijven staan.',
    photographTitle:
      'Een foto ervan, als u er een hebt',
    photographBody:
      'Publiceer uw eigen foto op Wikimedia Commons en plak hier de bestandsnaam. Hij blijft van u, u wordt overal genoemd waar hij verschijnt, en het kost u noch ons iets. Van Instagram of TikTok mogen we er geen nemen — een foto daar valt onder het auteursrecht van de maker, en een naamsvermelding is geen toestemming.',
    walkthroughNoteBody:
      'Wat volgt is een uitgewerkt voorbeeld van wat er met een inzending gebeurt — de bevindingen, de controles en de voorlopige score hieronder komen van een record dat al in de atlas staat, niet van wat u zojuist hebt getypt. Uw inzending wordt hier niet beoordeeld; die wordt door mensen beoordeeld, nadat ze verstuurd is.',
    examplePreparedBy:
      'Huishoudens in Malabar, gemaakt voor de iftar en voor familiegelegenheden',
    exampleConnection:
      'Geboren in Kozhikode en kook daar',
    exampleIngredients:
      'Rijpe nendran-banaan, eieren, ghee, suiker, cashewnoten, rozijnen; gegaard in een zware pan op een lage houtskool- of gasvlam, afgedekt met een deksel dat met gloeiende kolen is verzwaard',
    shelfFromCountry:
      'Uit {country}',
    shelfFromCountryNote:
      'Wat de atlas uit {country} heeft. Dat het hier klopt, is voor u meer waard dan waar ook — u kunt beoordelen of het juist is.',
    sending:
      'Versturen…',
    missionHeadline:
      'Elk gerecht hier laat zijn bewijs zien.',
    missionStakes:
      'Waar het vandaan komt, wie dat zegt en hoeveel er werkelijk is vastgesteld — op elk record afgedrukt, en na te rekenen door iedereen die eraan twijfelt.',
    statDishes:
      'gerechten',
    statCountries:
      'landen',
    statDocumented:
      'gedocumenteerd',
    statRegistered:
      'ingeschreven',
    statAuthentic:
      'authentiek',
    missionAsk:
      'Van {n} hiervan is geen bereidingswijze vastgelegd. {people} mensen uit een plaats kunnen er één voorgoed oplossen.',
    missionAskBody:
      'Niemand heeft opgeschreven hoe ze gemaakt worden — niet in het Engels, in geen enkele taal, nergens waar een machine bij kan. Geen archief, geen encyclopedie en niets automatisch kan ze in plaats daarvan bevestigen; dat is rekenwerk in de score, geen beleid. Als u er een kookt, bent u de enige die het kan.',
    recordADishYouKnow:
      'Leg een gerecht vast dat u kent',
    howItGetsAuthenticated:
      'Hoe iets bevestigd wordt',
    submissionsNotOpen:
      'Inzendingen staan nog niet open — er is nergens om ze heen te sturen. De route hierboven legt uit wat er gebeurt als dat wel zo is.',
    freeAndStayingFree:
      'Gratis, en dat blijft zo. Geen advertenties, geen tracking, geen geld ingezameld. Een account is alleen nodig om een gerecht te bevestigen — nooit om er een te lezen.',
    noRatingsNoComments:
      'Geen beoordelingen, geen reacties en geen algoritme dat bepaalt wat u ziet — lijsten beginnen met bewijs, niet met populariteit. Openingen worden geteld als een gerecht en een datum, nooit als een persoon.',
    whyASourceCannot:
      'Waarom een bron een gerecht niet kan bevestigen',
    whyASourceCannotBody:
      'Gepubliceerde documentatie komt hier niet boven {ceiling}, en een record heet Authentiek vanaf {threshold}. Dat gat wordt alleen gedicht door mensen die met de plaats verbonden zijn. De zes cijfers achter elke score staan op het record, zodat wie het getal wantrouwt het kan natellen.',
    whyTheAtlasStops:
      'Het is ook waarom de atlas ophoudt waar hij ophoudt. Elke vrije bron is gelezen — encyclopedieën, kookboeken, erfgoedregisters, plaatsnaamlijsten — en bij {n} records staat nog steeds niets over hoe ze gemaakt worden. Wat overblijft is nooit opgeschreven.',
    levelLocal:
      'Authentiek — lokaal',
    levelLocalFull:
      'Authentiek — lokaal/traditioneel',
    levelRegional:
      'Authentiek — regionaal',
    levelVariation:
      'Traditionele variant',
    levelAdaptation:
      'Moderne bewerking',
    levelFusion:
      'Fusion',
    levelUnverified:
      'Niet geverifieerd',
    levelUnverifiedFull:
      'Niet geverifieerd — te weinig bewijs',
    filterAuthenticOnly:
      'Alleen authentiek',
    filterTraditionalVariations:
      'Traditionele varianten',
    filterModernAdaptations:
      'Moderne bewerkingen',
    filterFusion:
      'Fusion',
    filterUnverified:
      'Niet geverifieerd',
    filterAll:
      'Alles',
    geoCountry:
      'land',
    geoRegion:
      'regio',
    geoProvince:
      'provincie of district',
    geoCity:
      'stad of plaats',
    geoVillage:
      'dorp of gemeenschap',
    chooseRegion:
      'Kies een regio',
    chooseProvince:
      'Kies een provincie of district',
    chooseCity:
      'Kies een stad of plaats',
    chooseVillage:
      'Kies een dorp of gemeenschap',
    typeToSearchLevel:
      'Typ om te zoeken…',
    browseAllTraditions:
      'Bekijk alle {n} tradities',
    geoPlace:
      'plaats',
    noLevelRecorded:
      'Nog geen {level} onder die naam vastgelegd. Wat hier ontbreekt, ontbreekt in het register — niet in de keuken.',
    browseCuisine:
      '{cuisine} keuken',
    browseMadeWith:
      'gemaakt met {ingredient}',
    browseEverything:
      'Alles',
    within:
      'Binnen {path}',
    chooseCountryHint:
      'Kies een land · {c} vastgelegd',
    chooseCountryHintBroader:
      'Kies een land · {c} vastgelegd, en {b} bredere herkomsten',
    noRecordUnderThatReference:
      'Onder die verwijzing staat niets in de atlas. Wat hier ontbreekt, ontbreekt in het register — niet in de keuken.',
    tagTraditionalPreparation:
      '🏺 Traditionele bereiding',
    tagAtRiskTradition:
      '🕯️ Bedreigde traditie',
    notEligibleForAuthentic:
      'Komt niet in aanmerking voor de classificatie authentiek',
    lookingForWhatItBorrows:
      'Zoekt u de traditie waaraan dit ontleend is?',
    howItsDescribed:
      'Hoe het beschreven wordt',
    howItsMade:
      'Hoe het gemaakt wordt',
    originAndAttribution:
      'Herkomst en culturele toeschrijving',
    nobodyRecordedTechnique:
      'Niemand heeft de techniek vastgelegd — de tijden, de pan, de volgorde van de handelingen. Juist dat zou dit record uit Niet geverifieerd halen, en daar is iemand voor nodig die het kookt.',
    nobodyHasRecorded:
      'Niemand heeft vastgelegd hoe {dish} gemaakt wordt{place}. We zouden het meest gepubliceerde recept van internet kunnen overnemen en authentiek noemen, maar dat is precies wat deze atlas bestaat om niet te doen — dus het record blijft zoals het is tot iemand die het kookt het invult. Doet u dat, dan bent u de eerste die het opschrijft.',
    ifIngredientUnavailable:
      'Als het traditionele ingrediënt niet te krijgen is',
    commonModernSubstitute:
      'Gangbare moderne vervanger: ',
    adaptationNotAuthentic:
      'Dit is een bewerking en moet niet voor de authentieke bereiding worden gehouden.',
    whatTheInternetServes:
      'Wat het internet meestal opdient voor dit gerecht, en waarin het afwijkt van de traditie hierboven.',
    popularNotAuthentic:
      'Populair, maar niet de authentieke bereiding. De versie hierboven blijft de maatstaf.',
    videosRankedByCloseness:
      'Echte video’s, gerangschikt naar hoe dicht de kok bij de traditie staat — niet naar aantal weergaven.',
    stillFramesFromVideos:
      'De stilstaande beelden komen uit de video’s zelf, dus het gerecht dat u ziet is het gerecht dat die kok maakte.',
    noVideoRecordedYet:
      'Voor dit gerecht is nog geen video uit de traditie vastgelegd.',
    findOneFromThePlace:
      'Vindt u er een die gemaakt is door iemand uit die plaats, dan kan die via Een traditie toevoegen erbij — dat is wat dit gerecht een gerangschikte video zou geven.',
    siblingsNeitherIsReal:
      'Hetzelfde gerecht, apart vastgelegd waar het anders gemaakt wordt. Geen van beide is de echte.',
    doYouKnow:
      'Kent u {subject}?',
    confirmWhatYouKnow:
      'Bevestig wat u werkelijk weet. U hoeft niet voor het hele record in te staan — één specifiek ding van iemand die het kookt weegt zwaarder dan algemene instemming.',
    recordedThankYou:
      'Vastgelegd. Dank u.',
    shownWithYourConnection:
      'Het staat op het record met uw band ernaast, zodat lezers het zelf kunnen wegen.',
    signedInCounts:
      'Aangemeld — dit telt mee voor het insigne.',
    notSignedInNote:
      'Niet aangemeld. Wat u schrijft komt met uw band op het record te staan en verandert het insigne niet: die telling stijgt alleen voor aangemelde mensen, zodat één persoon er niet drie kan zijn.',
    signInSoItCounts:
      'Meld u aan, dan telt het',
    shownOnTheRecord:
      'Staat op het record',
    whatCanYouConfirm:
      'Wat kunt u bevestigen?',
    exampleSaid:
      'Wij nemen ghee, geen olie — en het wordt met Eid gemaakt, niet het hele jaar.',
    fromTheTownItself:
      'Ik kom uit de stad of het dorp zelf, niet alleen uit de bredere regio',
    fromTheTownItselfLabel:
      'Ik kom uit de stad of het dorp zelf, niet uit de bredere regio',
    exampleWhoMakesIt:
      'Thuis gemaakt met Eid, door de grootmoeders — optioneel',
    exampleIngredientLines:
      'rijpe bakbanaan\nei\nghee',
    exampleMethodLines:
      'Pureer de bakbanaan.\nSpatel het geklopte ei erdoor.',
    inPlace:
      ' in {place}',
    tagAtRiskShort:
      '🕯️ Bedreigd',
    readThisIn:
      'Lees dit in',
    communityTranslation:
      'Vertaling uit de gemeenschap',
    machineTranslation:
      'Machinevertaling — nog door niemand uit de gemeenschap nagekeken',
    notTranslatedYet:
      'Nog niet vertaald',
    aDotMarks:
      'Een punt markeert een taal waarin dit record al vertaald is.',
    opensOnceMoreRecords:
      '{language} gaat open zodra er {n} records meer in te lezen zijn.',
    noTranslationService:
      'Aan deze build is geen vertaaldienst gekoppeld, dus er kan niets automatisch vertaald worden. Een vertaling van iemand die dit gerecht kookt is sowieso meer waard — die kan via Een traditie toevoegen worden aangeleverd.',
    whatTheseTermsMean:
      'Wat deze termen betekenen',
    signedIn:
      'Aangemeld',
    signOut:
      'Afmelden',
    signedInSignOut:
      'Aangemeld. Afmelden.',
    confirmationsCount:
      'Uw bevestigingen tellen mee voor het insigne.',
    signIn:
      'Aanmelden',
    signInSoConfirmationsCount:
      'Meld u aan, dan tellen uw bevestigingen mee',
    onlySignedInMovesBadge:
      'Alleen bevestigingen van aangemelde mensen laten een insigne bewegen.',
    watchAtSource:
      'Bekijk bij de bron ↗',
    originalAudio:
      'Oorspronkelijk geluid',
    creatorsOwnTranslation:
      'Vertaling van de maker zelf',
    translatedCaptions:
      'Vertaalde ondertitels',
    languageUnknown:
      'Taal onbekend',
    ingredientsInThisVideo:
      'Ingrediënten in deze video',
    weDontInventOne:
      'De maker van deze video heeft geen ingrediëntenlijst en geen geschreven werkwijze gepubliceerd, en wij verzinnen er geen. De traditionele werkwijze hierboven komt uit de gedocumenteerde bronnen hieronder.',
    captureFromVideo:
      'Leg de ingrediënten en stappen uit deze video vast →',
    dietaryPreference:
      'Dieetvoorkeur',
    narrowItDown:
      'Verder verfijnen',
    anyDiet:
      'Elk dieet',
    whenItsEaten:
      'Wanneer het gegeten wordt',
    anyOccasion:
      'Elke gelegenheid',
    alsoCalled:
      'Ook genoemd',
    notATranslationOfOurs:
      'Elke naam komt uit het encyclopedie-artikel in die taal — het is geen vertaling van ons en vervangt nooit de naam hierboven. Tik er een aan om hem daar te lezen.',
    relatedTraditions:
      'Verwante tradities',
    relatedTraditionsNote:
      'Records die met dit record een plaats, een traditie of een ingrediënt delen. Elk zegt welke.',
    scoreCannotSettle:
      'Een schatting van hoe sterk het bewijs is — geen bewering dat een cijfer culturele waarheid kan beslechten.',
    notScored:
      'Niet beoordeeld',
    navAtlasNote:
      'Wat erin staat, en hoe zeker',
    navProposeNote:
      'Eten waarvan de atlas geen record heeft',
    navConfirmNote:
      'Gerechten die wachten op iemand die ze kent',
    navSupportNote:
      'Wat het kost om te draaien, en wie betaalt',
    confirmPrompt:
      'Wordt het bij u zo gemaakt?',
    confirmAskBody:
      'Als u dit kookt op de plek waar het vandaan komt, is bevestigen of corrigeren precies wat een record uit Niet geverifieerd haalt. Waar uw versie afwijkt, wordt die naast deze vastgelegd — niet in plaats ervan.',
    confirmYes:
      'Ja, dit klopt',
    confirmNo:
      'Bij ons wordt het anders gemaakt',
    confirmPlacePrompt:
      'Komt dit gerecht echt van waar wij zeggen?',
    confirmPlaceBody:
      'Niemand heeft opgeschreven hoe dit gemaakt wordt, dus er is nog niets om het mee eens te zijn. De plaats is wat dit record beweert, en dat is op zichzelf al de moeite van het bevestigen waard — het is een van de zes bewijscontroles.',
    confirmPlaceYes:
      'Ja, het is van hier',
    confirmPlaceNo:
      'Nee, het komt ergens anders vandaan',
    standingMet:
      '{n} mensen met een band met {place} hebben dit bevestigd — het aantal dat het insigne vraagt.',
    standingNobody:
      'Nog niemand',
    standingOne:
      'Tot nu toe één persoon',
    standingMany:
      'Tot nu toe {n} mensen',
    standingNeed:
      '{soFar}. Het insigne vraagt {need}, dus {people} met een band met {place} zouden voldoen.',
    onePersonMore:
      'één persoon meer',
    morePeople:
      '{n} mensen meer',
    contestedNote:
      'Hier ondergebracht om het te kunnen vinden. {n} plaatsen hebben een gedocumenteerde aanspraak op dit gerecht — geen enkele is beslecht, en ze staan hieronder allemaal.',
    relatedAlsoFrom:
      'Ook uit {place}',
    relatedAlsoCuisine:
      'Ook {cuisine}',
    relatedSharesIngredients:
      'Deelt {n} ingrediënten',
    relatedAlsoUses:
      'Gebruikt ook {ingredient}',
    relatedAlsoCategory:
      'Ook {category}',
    authenticVersion:
      'Authentieke versie',
    thePublishedRecipe:
      'Het gepubliceerde recept',
    whyThisIsAnAdaptation:
      'Waarom dit een bewerking is',
    whyConsideredAuthentic:
      'Waarom geldt dit als authentiek?',
    whatThisRecordIs:
      'Wat dit record is',
    stepSubmit:
      'Insturen',
    stepWhatExists:
      'Wat er bestaat',
    stepAssessment:
      'Beoordeling',
    stepValidation:
      'Bevestiging',
    findingAggregatorTitle:
      'Receptenverzamelsite',
    findingAggregatorTag:
      'Populaire kandidaat',
    findingAggregatorNote:
      'Hoogst geplaatste resultaat. De auteur noemt geen band met Malabar; gebruikt boter in plaats van ghee.',
    findingVideoTitle:
      'Video van een kookkanaal in het Malayalam',
    findingVideoTag:
      'Lokale bron',
    findingVideoNote:
      'Gefilmd in Kerala, gesproken in het Malayalam, met ghee en nendran-banaan zoals beschreven.',
    findingGapTitle:
      'Geen vastlegging op plaatsniveau gevonden',
    findingGapTag:
      'Gat',
    findingGapNote:
      'Niets documenteert hoe het juist in Kozhikode gemaakt wordt. Deze inzending zou de eerste zijn.',
    checkOriginLabel:
      'Geografische herkomst',
    checkOriginNote:
      'Malabar, Kozhikode — opgegeven door de inzender en in lijn met de videobron.',
    checkLocalPrepLabel:
      'Lokale bereiding',
    checkLocalPrepNote:
      'Beschreven als thuiskoken, voor de iftar en voor familiegelegenheden.',
    checkIngredientsLabel:
      'Traditionele ingrediënten',
    checkIngredientsNote:
      'Nendran-banaan, eieren, ghee — komt overeen met de video van de lokale bron.',
    checkTechniqueLabel:
      'Traditionele techniek',
    checkTechniqueNote:
      'Laag vuur, deksel verzwaard met gloeiende kolen.',
    checkDocumentationLabel:
      'Historische of culturele documentatie',
    checkDocumentationNote:
      'Mager. Geen studie of archiefstuk gevonden.',
    checkLocalSourceLabel:
      'Lokale bron',
    checkLocalSourceNote:
      'De inzender geeft aan in Kozhikode geboren te zijn en daar te koken.',
    checkCommunityLabel:
      'Bevestiging door de gemeenschap',
    checkCommunityNote:
      'Nog niet gevraagd. Daarom mag het record nog niet authentiek heten.',
    validatorHomeCook:
      'Thuiskok, Kozhikode',
    validatorHomeCookSaid:
      'Bevestigde de ingrediënten en de methode met kolen op het deksel.',
    validatorBakery:
      'Bakkerijeigenaar, Thalassery',
    validatorBakerySaid:
      'Bevestigt, en merkt op dat zijn versie minder suiker gebruikt.',
    validatorWriter:
      'Culinair journalist, Kerala',
    validatorWriterSaid:
      'Bevestigd als een huisgerecht uit Malabar; de documentatie is werkelijk schaars.',
    validatorPending:
      'Nog twee beoordelaars uitgenodigd',
    validatorPendingSaid:
      'Wachten op antwoord — het record verschijnt ook zonder hen.',
    photoCheckedNote:
      'Wordt bij het insturen tegen Commons gecontroleerd en getoond met fotograaf en licentie. Het blijft Niet geverifieerd tot de gemeenschap het bevestigt, net als de werkwijze.',
    mostPublishedNote:
      'De meest gepubliceerde versie geldt als populaire kandidaat. Daarmee wordt zij nog niet het authentieke record.',
    sevenChecksNote:
      'Zeven controles, elk beantwoord of opengelaten. Open controles verlagen de bewijskracht — ze worden nooit op aanname ingevuld.',
    draftConfidence:
      '/100 voorlopige bewijskracht',
    unverifiedPendingTag:
      '⚪ Niet geverifieerd — wacht op bevestiging door de gemeenschap',
    oneSubmitterNote:
      'Eén inzender van die plek is bewijs, geen bewijsvoering. Het record blijft Niet geverifieerd tot mensen uit de gemeenschap het bevestigen.',
    threeConfirmationsNote:
      'Drie bevestigingen van mensen die er wonen of koken halen een record uit Niet geverifieerd.',
    conflictingAccountsNote:
      'Tegenstrijdige verhalen blijven allebei staan. Het record splitst zich in de tradities die mensen werkelijk beschreven — één per streek of gemeenschap — en geen enkele versie wordt de ware genoemd.',
    nowhereToSendNote:
      'Er is nergens om dit heen te sturen. De atlas heeft alles gelezen wat de vrije bronnen bevatten, dus wat nu ontbreekt is eten dat niemand heeft opgeschreven — dit formulier is dus hoe hij groeit, en het gaat aan zodra er een bestemming voor is.',
    whereTheExampleEndsUp:
      'Daar komt het voorbeeldrecord uit: gepubliceerd, met het bewijs zichtbaar, de openstaande controles benoemd, en elke bewering herleidbaar tot wie haar deed.',
    confirmedBy:
      'Bevestigd door',
    nothingMatchesAll:
      'Niets voldoet aan dit alles tegelijk.',
    mostOfYourListFirst:
      'Eerst wat het meest van uw lijst gebruikt',
    translatesTheAppsWords:
      'Vertaalt de woorden van de app zelf. Gerechten blijven in de taal waarin ze zijn vastgelegd — elk record heeft zijn eigen vertaalknoppen.',
    byNameAndPlaceOnly:
      'Deze staan alleen met naam en plaats in de atlas. Niemand heeft vastgelegd hoe ze gemaakt worden, dus ze dragen geen werkwijze en geen score.',
    wikipediaViewsNote:
      'Hoeveel mensen het afgelopen jaar over elk gerecht lazen op de Engelstalige Wikipedia. Dat is belangstelling, geen authenticiteit, en het zegt ook niet hoeveel een gerecht gegeten wordt — het bevoordeelt wat Engelstaligen opzoeken. Tik er een aan voor de classificatie.',
    requiredDishName:
      'de naam van het gerecht',
    requiredCountry:
      'het land',
    requiredYourName:
      'uw naam',
    requiredYourConnection:
      'uw band met de plaats',
    requiredWhatYouConfirm:
      'wat u kunt bevestigen',
    bandNotScored:
      'Niet beoordeeld',
    bandUnder50:
      'Onder 50',
    band50to74:
      '50 – 74',
    band75Plus:
      '75 en hoger',
    reviewCapitals:
      'Dit is helemaal in hoofdletters geschreven.',
    reviewCapitalsConsider:
      'Gewone schrijfwijze leest beter en is makkelijker te vertalen. De naam van het gerecht houdt de schrijfwijze die u gaf.',
    reviewRepeats:
      'Een teken herhaalt zich een aantal keer achter elkaar.',
    reviewRepeatsConsider:
      'Controleer of er geen toets bleef hangen.',
    reviewShort:
      'De werkwijze is erg kort.',
    reviewShortConsider:
      'Schrijf wat iemand zou moeten doen om het te maken, wachttijden inbegrepen. Een record zonder werkwijze haalt de receptenplanken niet.',
    groupSummaryCountries:
      '{c} landen · {n} tradities',
    groupSummaryOrigins:
      '{c} herkomsten · {n} tradities',
    metricTotalTitle:
      'Vastgelegde tradities',
    metricTotalCounts:
      'Een traditie is één manier om een gerecht op één plek te maken. Hetzelfde gerecht dat in twee streken anders gemaakt wordt, zijn twee tradities, en beide blijven bewaard.',
    metricTotalMethod:
      'Elk record uit de samengestelde set en de vier geïmporteerde bronnen dat iets te tonen heeft — minimaal een plaats en een naam. Rijen die nog op verrijking wachten worden achtergehouden en niet meegeteld.',
    metricTotalCaveat:
      'Dit is geen telling van de verschillende gerechten ter wereld, en geen maat voor hoeveel de atlas weet. De meeste van deze records dragen een naam en een land en verder niets. Het aandeel met een geschreven werkwijze is het getal dat zegt of dit een atlas is of een namenlijst.',
    metricCountriesTitle:
      'Landen',
    metricCountriesCounts:
      'Verschillende landen die over alle records heen genoemd worden, nadat de plaatsnamen uit de import zijn opgelost.',
    metricCountriesMethod:
      'Het landveld van elk record, ontdubbeld, waarbij alleen herkomsten worden geteld die landen zijn. Historische en bovenstatelijke ingangen die een bron gebruikte — het Ottomaanse Rijk, de Levant, Meso-Amerika — blijven op hun records staan in plaats van te worden toegewezen aan een moderne staat die we zouden moeten raden, en ze worden hier niet geteld. Ze meetellen voegde tweeëndertig aan dit getal toe, en elk daarvan was verzonnen.',
    metricCountriesCaveat:
      'Dekking is geen diepte. Een land komt hier op de kracht van één enkel record, dus dit telt waar de atlas is geweest, niet waar hij iets waard is. Lees het naast het concentratiegetal hieronder, dat zegt hoe scheef het totaal is.',
    metricAtRiskTitle:
      'Bedreigde tradities',
    metricAtRiskCounts:
      'Records waarin een bron met eigen woorden de traditie beschrijft als teruglopend, verdwijnend of niet meer beoefend.',
    metricAtRiskMethod:
      'Opgespoord door de inleiding en de geschiedenis van elk artikel te lezen op uitgesproken achteruitgang — "wordt tegenwoordig zelden gemaakt", "de laatst overgebleven producent" — en bijna-treffers te verwerpen die iets anders betekenen, zoals een bedreigde soort als ingrediënt of een gesloten restaurantketen. De zin die het aanzette wordt als bewijs op het record bewaard en ermee getoond.',
    metricAtRiskCaveat:
      'Dit is een ondergrens, geen telling, en het ligt ver onder de waarheid. Het kan alleen achteruitgang vinden die iemand al opschreef in een tekst die wij gelezen hebben; een traditie die vier families in stand houden en die nooit is vastgelegd, telt helemaal niet mee. De Ark van de Smaak van Slow Food alleen al noemt zo’n zesduizend bedreigde producten, duizend keer dit getal.',
    metricDocumentedTitle:
      'Heeft een vastgelegde werkwijze',
    metricDocumentedCounts:
      'Records met een geordende werkwijze — de stappen die iemand zou volgen om het te maken.',
    metricDocumentedMethod:
      'Samengestelde records hebben een werkwijze die geschreven en met de gemeenschap nagelopen is. Geïmporteerde hebben er alleen een waar een gepubliceerd recept bestaat; een encyclopedie-alinea die beschrijft hoe een gerecht in het algemeen gemaakt wordt, wordt als proza bewaard en bewust niet tot stappen verheven, want een beschrijving als werkwijze presenteren claimt een precisie die zij niet heeft.',
    metricDocumentedCaveat:
      'Dat er een werkwijze is, zegt niets over de vraag of het de traditionele is. Daar is de bewijskracht voor, en de meeste records met een werkwijze zijn geclassificeerd als Moderne bewerking.',
    metricLocatedTitle:
      'Geplaatst onder landniveau',
    metricLocatedCounts:
      'Records die een streek, provincie, stad of dorp noemen, en niet alleen een land.',
    metricLocatedMethod:
      'Elk record waarvan de plaats onder het land een ingevuld niveau heeft.',
    metricLocatedCaveat:
      'Authenticiteit heeft geografische diepte, en een land is nauwelijks een begin — "Kozhikode" is een record, "India" is een kop. Een hoog totaal met een laag aandeel hier beschrijft een atlas die breed en ondiep is.',
    metricIllustratedTitle:
      'Heeft een foto',
    metricIllustratedCounts:
      'Records met een afbeelding die de app mag tonen.',
    metricIllustratedMethod:
      'Uit Wikidata, uit het eigen Wikipedia-artikel van het gerecht, of aangeleverd door iemand die kookt via Wikimedia Commons. Elke foto wordt met fotograaf en licentie bewaard, en geen enkele is als geverifieerd gemarkeerd: een afbeelding die op naam gevonden of door een redacteur gekozen is, is goed bewijs dát zij het gerecht toont, niet de bevestiging van deze app.',
    metricIllustratedCaveat:
      'Een foto is geen bewijs van authenticiteit. Zij toont een bord dat iemand gekookt heeft, dat de traditie in het record kan zijn maar ook niet.',
    metricFilmedTitle:
      'Heeft een gerangschikte video',
    metricFilmedCounts:
      'Records met ten minste één video, geordend naar hoe dicht de kok bij de traditie staat.',
    metricFilmedMethod:
      'Geordend op plaatsgebondenheid — waar de kok is, in welke taal die spreekt, of ingrediënten en gereedschap met het record overeenkomen. Nooit op weergaven, likes of abonnees.',
    metricFilmedCaveat:
      'De rangschikking gaat over nabijheid tot de traditie, niet over filmkwaliteit, en de bovenste video is vaak de minst verzorgde.',
    metricAssessedTitle:
      'Als authentiek geclassificeerd',
    metricAssessedCounts:
      'Records die via de bewijscontroles Authentiek — lokaal of Authentiek — regionaal bereikten.',
    metricAssessedMethod:
      'Zeven controles, elk beantwoord of opengelaten, waarbij open controles de bewijskracht verlagen in plaats van op aanname te worden ingevuld. Techniek en bevestiging door de gemeenschap worden nooit uit een import afgeleid, wat begrenst hoe ver een geïmporteerd record op eigen kracht komt.',
    metricAssessedCaveat:
      'Een laag aandeel hier is eerlijk, geen falen. Het grootste deel van de catalogus is geïmporteerd en niet beoordeeld, en die records authentiek noemen omdat ze uit een gerespecteerde bron komen is precies de kortere weg die deze schaal moet weigeren.',
    metricConcentrationTitle:
      'Concentratie',
    metricConcentrationCounts:
      'Het aandeel van de hele catalogus dat het grootste enkele land inneemt.',
    metricConcentrationMethod:
      'Records in het sterkst vertegenwoordigde land, gedeeld door het totaal.',
    metricConcentrationCaveat:
      'Dit weerspiegelt welke landen open voedselregisters bijhouden, niet waar het eten van de wereld is. Italië alleen publiceert ongeveer 4.400 geregistreerde traditionele producten; de meeste landen publiceren er geen, en hun afwezigheid hier is een afwezigheid van papierwerk, niet van koken.',
    metricConfidenceTitle:
      'Bewijskracht',
    metricConfidenceCounts:
      'Hoe de catalogus verdeeld is over de bewijsscore van 0 tot 100.',
    metricConfidenceMethod:
      'Samengestelde records worden door de bewijscontroles beoordeeld. Geïmporteerde alleen waar verrijking iets vond om te beoordelen, en blijven anders onbeoordeeld in plaats van een standaardwaarde te krijgen.',
    metricConfidenceCaveat:
      '"Niet beoordeeld" is veruit de grootste band en dat blijft zo. Het betekent dat nog niemand het record beoordeeld heeft — niet dat het slecht scoorde, en niet dat het gerecht twijfelachtig is.',
    metricByContinentTitle:
      'Waar de records zitten',
    metricByContinentCounts:
      'Records per werelddeel, elk record één keer geteld. Een traditie hoort bij het werelddeel van het land waarin ze is vastgelegd, niet bij dat waar ze vandaan gereisd kan zijn.',
    metricByContinentMethod:
      'Vanuit het land van elk record, via een land-naar-werelddeel-tabel die zo’n 200 staten dekt, historische inbegrepen. Bovenstatelijke en betwiste ingangen worden gegroepeerd in plaats van in een werelddeel geduwd.',
    metricByContinentCaveat:
      'Dit is een kaart van de bronnen, niet van de keukens van de wereld. Europa staat voorop omdat Europese registers online en open zijn, en dat is een feit over archieven.',
    howIsThisCounted:
      'Hoe wordt dit geteld?',
    hideHowThisIsCounted:
      'Verberg hoe dit geteld wordt',
    stapleGrains: 'Granen',
    stapleRoots: 'Wortels',
    staplePulses: 'Peulvruchten',
    stapleDairy: 'Zuivel',
    stapleMeatFish: 'Vlees & vis',
    stapleVegetables: 'Groenten',
    stapleAromatics: 'Aromaten',
    stapleSweetSour: 'Zoet & zuur',
    stapleRice: 'Rijst',
    stapleWheat: 'Tarwe',
    stapleMaize: 'Maïs',
    stapleMillet: 'Gierst',
    stapleSorghum: 'Sorghum',
    stapleBarley: 'Gerst',
    stapleOats: 'Haver',
    stapleBuckwheat: 'Boekweit',
    stapleTeff: 'Teff',
    staplePotato: 'Aardappel',
    stapleCassava: 'Cassave',
    stapleSweetPotato: 'Zoete aardappel',
    stapleYam: 'Yam',
    stapleTaro: 'Taro',
    staplePlantain: 'Bakbanaan',
    stapleLentil: 'Linzen',
    stapleChickpea: 'Kikkererwten',
    stapleSoy: 'Soja',
    stapleTofu: 'Tofu',
    stapleBlackBean: 'Zwarte bonen',
    stapleMungBean: 'Mungbonen',
    staplePigeonPea: 'Duivenerwten',
    stapleMilk: 'Melk',
    stapleYoghurt: 'Yoghurt',
    stapleCheese: 'Kaas',
    staplePaneer: 'Paneer',
    stapleGhee: 'Ghee',
    stapleButter: 'Boter',
    stapleCoconut: 'Kokosnoot',
    stapleChicken: 'Kip',
    stapleBeef: 'Rundvlees',
    staplePork: 'Varkensvlees',
    stapleLamb: 'Lamsvlees',
    stapleGoat: 'Geit',
    stapleFish: 'Vis',
    staplePrawn: 'Garnalen',
    stapleEgg: 'Eieren',
    stapleOnion: 'Ui',
    stapleGarlic: 'Knoflook',
    stapleGinger: 'Gember',
    stapleChilli: 'Chilipeper',
    stapleLemongrass: 'Citroengras',
    stapleTomato: 'Tomaat',
    stapleAubergine: 'Aubergine',
    stapleCabbage: 'Kool',
    stapleSpinach: 'Spinazie',
    stapleOkra: 'Okra',
    stapleTamarind: 'Tamarinde',
    stapleHoney: 'Honing',
    stapleJaggery: 'Jaggery',
    stapleDate: 'Dadels',
    stapleLemon: 'Citroen',
    stapleOlive: 'Olijf',
    dietVegan: 'Veganistisch',
    dietVegetarian: 'Vegetarisch',
    dietSeafood: 'Vis en zeevruchten',
    dietMeat: 'Niet-vegetarisch',
    dietUnclassified: 'Niet ingedeeld',
    dietPoultry: 'Gevogelte',
    dietPork: 'Varkensvlees',
    dietBeef: 'Rund & rood vlees',
    dietLambGoat: 'Lam & geit',
    dietGame: 'Wild',
    dietFish: 'Vis',
    dietShellfish: 'Schaal- en schelpdieren',
    dietOtherSeafood: 'Overige zeevruchten',
    dietDairy: 'Bevat zuivel',
    dietEgg: 'Bevat ei',
    dietHoney: 'Bevat honing',
    mealBreakfast: 'Ontbijt',
    mealLunch: 'Lunch',
    mealDinner: 'Avondeten',
    mealSupper: 'Late maaltijd',
    mealSnack: 'Tussendoortje',
    mealStreetFood: 'Streetfood',
    mealCelebration: 'Feest & festijn',
    mealAnytime: 'Op elk moment',
    mealUnclassified: 'Niet vastgelegd',
    searchModeFind:
      'Een gerecht vinden',
    searchModePantry:
      'Koken met wat ik heb',
    ingredientsYouHave:
      'Ingrediënten die u hebt',
    nTraditions:
      '{n} tradities',
    nothingYet:
      'Nog niets',
    methodRecorded:
      ' · werkwijze vastgelegd',
    noMethodYet:
      ' · nog geen werkwijze',
    showMoreLeft:
      'Meer tonen — nog {n}',
    showNMore:
      '{n} meer tonen',
    methodAsPublished:
      'De werkwijze zoals gepubliceerd. Modern gereedschap en kortere wegen horen erbij.',
    methodTraditional:
      'De traditionele werkwijze, zonder moderne kortere wegen als vervanging.',
    everythingClassified:
      'Alles wat als {what} geclassificeerd is',
    everythingFrom:
      'Alles uit {place}',
    everythingRecordedAs:
      'Alles wat als {what} is vastgelegd',
    everythingMadeWith:
      'Alles wat met {ingredient} gemaakt wordt',
    seeEverything:
      '{label} — alles bekijken',
    noPhotographOnRecord:
      '{label} — geen foto vastgelegd',
    scoreOutOf100:
      '{label}: {value} van 100',
    removeFilter:
      'Filter {key} verwijderen',
    anywhereInTheAtlas:
      ' ergens in de atlas',
    absenceOfRecords:
      '. Dat is een gebrek aan records, geen gebrek aan eten — we zeggen liever dat we het niet weten.',
    narrowToA:
      'Verfijnen tot {level} · {n} vastgelegd',
    fromTheTown:
      ' — uit de plaats zelf',
    showFewer:
      'Minder tonen',
    readAboutOnWikipedia:
      'Lees over {name} in het {language} op Wikipedia',
    languageChangeIt:
      'Taal: {language}. Wijzigen.',
    perCentTranslated:
      '{language}, {n} procent vertaald',
    translateThisRecord:
      'Dit record vertalen',
    translating:
      'Bezig met vertalen…',
    translate:
      'Vertalen',
    translateThisConfirmation:
      'Deze bevestiging naar het {language} vertalen',
    couldNotTranslate:
      'Vertalen lukte niet — probeer opnieuw',
    howThisIsCountedFor:
      'Hoe {figure} geteld wordt',
    countOfTotal:
      '{label}: {count} van {total}',
    watchAtSourceCreator:
      '{creator} bij de bron bekijken',
    stillFromCreator:
      'Beeld uit {creator}',
    thatDidNotSend:
      'Dat is niet verstuurd.',
    containsAlcohol:
      'Bevat alcohol',
    nothingElseRequired:
      'Al het andere is welkom en niets ervan is verplicht — weten waar een gerecht vandaan komt en dat niemand het heeft opgeschreven, is al meer dan welke bron hier ook heeft.',
    opensTheFormPrefilled:
      'Het opent het formulier bij de bron met wat u al geschreven hebt ingevuld. Deze app verzamelt niets over u, en er wordt niets gepubliceerd tot mensen uit die plaats het bevestigen.',
    scoreDimGeographic:
      'Geografische band',
    scoreDimIngredients:
      'Traditionele ingrediënten',
    scoreDimTechnique:
      'Traditionele techniek',
    scoreDimLocalSource:
      'Lokale bron',
    scoreDimDocumentation:
      'Culturele documentatie',
    scoreDimCommunity:
      'Bevestiging door de gemeenschap',
    photoFromWikidata:
      'Bij het eigen Wikidata-item van dit gerecht gevoegd — niet op naam gevonden',
    photoFromArticle:
      'De hoofdafbeelding van het eigen encyclopedie-artikel van dit gerecht',
    photoFromRecipe:
      'Gepubliceerd op de pagina van dit recept',
    photoFromSearch:
      'Op naam gevonden op Wikimedia Commons — het onderwerp is niet bevestigd',
    photoFromUnknown:
      'Herkomst niet vastgelegd — beschouw het onderwerp als onbevestigd',
    noTranslationRecorded:
      'Van dit verhaal is nog geen vertaling vastgelegd, dus het staat er in het {language}, de taal waarin het is vastgelegd. We laten u liever het origineel zien dan de gok van een machine over een fermentatietijd.',
    machineTranslationBy:
      'Machinevertaling door {translator}. Niemand uit de gemeenschap heeft haar nagekeken — namen van ingrediënten en gereedschap blijven in het origineel.',
    translatedBy:
      'Vertaald door {translator}. Namen van ingrediënten en gereedschap blijven in het origineel.',
    videoOriginalAudio:
      'Gesproken in het {language} — de eigen taal van de kok. Er wordt niets vertaald.',
    videoCreatorTrack:
      'De maker heeft een audiospoor gepubliceerd in het {language}. Het opent bij de bron in dat spoor — de vertaling is die van de maker, niet die van ons.',
    videoPlatformCaptions:
      'Gesproken in het {spoken}. Opent met machinaal vertaalde ondertitels in het {preferred} over het oorspronkelijke geluid — de stem van de kok wordt niet vervangen, en de vertaling is van het videoplatform, niet van een mens.',
    videoLanguageUnknown:
      'We hebben de gesproken taal van deze video niet vastgelegd, dus we kunnen {language} niet beloven. Hij opent bij de bron, waar de ondertitelopties van het platform zelf gelden.',
    figureDocumented:
      'Heeft een vastgelegde werkwijze',
    figureDocumentedNote:
      'Het getal dat zegt of dit een atlas is of een namenlijst. Al het andere komt daarna.',
    figureLocated:
      'Geplaatst onder landniveau',
    figureLocatedNote:
      'Authenticiteit heeft geografische diepte. “Kozhikode” is een record; “India” is nauwelijks een begin.',
    figureIllustrated:
      'Heeft een foto',
    figureIllustratedNote:
      'Een gerecht dat niemand voor zich ziet, gaat je moeilijk aan het hart en is nog moeilijker te herkennen.',
    figureFilmed:
      'Heeft een gerangschikte video',
    figureFilmedNote:
      'Gerangschikt naar hoe dicht de kok bij de traditie staat — geen zoekresultaat.',
    figureAssessed:
      'Als authentiek geclassificeerd',
    figureAssessedNote:
      'Verdiend via de bewijscontroles. Een laag aandeel hier is eerlijk, geen falen.',
    atlasSummary:
      '{n} tradities vastgelegd in {c} landen. De dekking wordt eerlijk vermeld: een land dat hier ontbreekt, heeft nog niets vastgelegd — niet niets om vast te leggen.',
    nothingRecorded:
      'Niets vastgelegd',
    nothingRecordedAs:
      'Niets vastgelegd als {what}',
    nothingRecordedAsAnd:
      'Niets vastgelegd als {list} en {last}',
    photoVia:
      'foto via',
    photoNothingEntered:
      'Nog niets ingevuld.',
    photoNothingEnteredFix:
      'Plak de Commons-bestandsnaam of de link naar de bestandspagina.',
    photoWrongHost:
      'Die link gaat naar {host}, en wij hebben geen recht om daar een foto van te publiceren.',
    photoWrongHostFix:
      'Is de foto van u, zet hem dan onder een vrije licentie op Wikimedia Commons en plak hier de bestandsnaam. Hij blijft van u, u wordt genoemd waar hij ook verschijnt, en het kost niets.',
    photoNotCommons:
      'Die link staat niet op Wikimedia Commons.',
    photoNotCommonsFix:
      'Hier kunnen alleen Commons-bestanden gepubliceerd worden, omdat alleen die een licentie hebben die ons toestaat ze te tonen.',
    photoNoFileName:
      'Daar zat geen bestandsnaam in.',
    photoNoFileNameFix:
      'Plak de bestandsnaam, bijvoorbeeld Kaipola.jpg.',
    photoNotAPhotograph:
      'Dat is geen fotobestand.',
    photoNotAPhotographFix:
      'Foto’s op Commons eindigen op .jpg, .png of .webp. Diagrammen en logo’s worden hier niet gebruikt.',
    photoIsADrawing:
      'Dat is een tekening, geen foto.',
    photoIsADrawingFix:
      'Gebruik een foto van het gerecht zoals het gemaakt is.',
    serverRefused:
      'De server heeft het geweigerd ({status}).',
    serverTookTooLong:
      'De server deed er te lang over om te antwoorden.',
    couldNotReachServer:
      'De server was niet bereikbaar.',
    nothingYouTypedIsLost:
      '{message} Uw inzending is niet verstuurd — niets van wat u getypt hebt is kwijt, probeer het zo dadelijk opnieuw.',
    proposalsNotOpen:
      'Inzendingen staan nog niet open.',
    confirmationsNotOpen:
      'Bevestigingen staan nog niet open.',
    alreadyProposed:
      'Dit gerecht is al ingezonden. Open het en bevestig het — dat is wat het verder helpt.',
    alreadyConfirmed:
      'U hebt deze al bevestigd.',
    youProposedThis:
      'U hebt dit gerecht ingezonden, dus iemand anders moet het bevestigen.',
    stillNeededList:
      'Nog nodig: {list}.',
    listAnd:
      '{list} en {last}',
    listOr:
      '{list} of {last}',
    proposalConfirmed:
      'Bevestigd. Komt bij de volgende bijwerking in de atlas.',
    proposalNobodyYet:
      'Nog niemand heeft dit bevestigd. {n} mensen die het gerecht kennen zouden het in de atlas brengen.',
    proposalSoFar:
      '{have} van {n} bevestigingen. {short} meer van mensen die het gerecht kennen zouden het erin brengen.',
    recordNobodyYet:
      'Nog niemand uit die plaats heeft dit bevestigd. {n} bevestigingen zouden het staven.',
    recordSoFar:
      '{have} van {n} bevestigingen. {short} meer van mensen die het gerecht kennen zouden het staven.',
    atRiskNote:
      'Gemarkeerd omdat een bron deze traditie als teruglopend beschrijft — die zin wordt bij het record getoond. Het wordt nooit afgeleid uit hoe weinig wij hebben vastgelegd: een gat in onze records is geen bewijs dat iemand is gestopt met koken.',
    originDisclaimer:
      'Dit gerecht kent meer dan één gedocumenteerde historische aanspraak. De tradities hieronder staan zoals elke plaats ze beschrijft, met hun bronnen. Geen enkele aanspraak wordt hier als winnaar gepresenteerd, en niets hiervan raakt de bewijskracht — die meet hoe het gerecht op een plek gemaakt wordt, niet wie het als eerste maakte.',
    supportRunsOn:
      'Alles in de atlas komt uit Wikipedia, Wikidata, Wikimedia Commons, Wikibooks en open regionale registers. Ze zijn vrij te lezen, open gelicentieerd en vermeld op elk record dat ze gebruikt. Dat is de hele grondslag waarop het project gratis blijft, en het is een besluit, geen tussenfase.',
    contributeToTheAtlas:
      'Bijdragen aan de atlas',
    answeredByDocuments:
      'Dit kunnen bronnen beantwoorden',
    answeredByPeople:
      'Dit kunnen alleen mensen beantwoorden',
    scaleDocumentsStop:
      'hier houden bronnen op',
    scaleAuthenticBegins:
      'vanaf hier authentiek',
    pantryNothingUses:
      'Niets in de atlas gebruikt {list}. Misschien heeft alleen niemand een gerecht opgeschreven dat het doet — bij {p}% staat helemaal geen ingrediënt vermeld.',
    alsoRecordedIn:
      'Ook vastgelegd onder {list}',
    alsoRecordedNote:
      'De atlas houdt daar een apart record voor dit gerecht bij. Geen van beide corrigeert de ander — een gerecht dat twee eetculturen maken is in geen van beide een fout.',
    chooseACountry:
      'Kies een land',
    filterTheList:
      'Typ om de lijst te beperken',
    showingFirstNOfM:
      'De eerste {n} van {m} worden getoond. Typ door om te beperken.',
    nothingMatchesThat:
      'Niets in de lijst komt daarmee overeen.',
    continentBeyondOneCountry:
      'Voorbij één land',
    beyondOneCountryNote:
      'Herkomsten die de bronnen ruimer vastleggen dan één land — een regio, een gedeeld culinair gebied of een staat die niet meer bestaat. Ze blijven staan zoals de bron ze noemt, in plaats van te worden versmald tot een land dat niemand koos.',
    connectionGrewUpThere:
      'Ik ben daar opgegroeid',
    connectionLiveThere:
      'Ik woon daar',
    connectionFamilyFrom:
      'Mijn familie komt daarvandaan',
    connectionLearnedThere:
      'Ik heb het daar leren maken',
    connectionCookProfessionally:
      'Ik kook het daar beroepsmatig',
    chooseYourConnection:
      'Kies wat van toepassing is',
    connectionInYourWords:
      'Wat u wilt toevoegen, in uw eigen woorden',
    connectionDetailPlaceholder:
      'Mijn oma maakte het elk Eid in Kozhikode',
    dictateSpeak:
      'Spreken in plaats van typen',
    dictateListening:
      'Luistert — tik om te stoppen',
    dictateStop:
      'Stoppen met luisteren',
    dictateSendsAudio:
      'Uw browser doet het luisteren, en de meeste sturen de audio daarvoor naar hun eigen servers. Wat u zegt komt in het vak hierboven, waar u het kunt verbeteren.',
    dictateNotAllowed:
      'De browser gaf geen toestemming voor de microfoon.',
    dictateDidNotWork:
      'Dat werkte niet. U kunt het nog steeds typen.',
    polishTidyThis:
      'Mijn typwerk opschonen',
    polishWorking:
      'Bezig…',
    polishMachineMade:
      'Voorgesteld door een machine — uw woorden staan er nog boven',
    polishUseThis:
      'Dit gebruiken',
    polishKeepMine:
      'Die van mij houden',
    polishOnlyTyping:
      'Alleen spelling, leestekens en spaties worden aangeraakt. Er wordt niets toegevoegd, weggehaald of anders geformuleerd, en geen naam wordt veranderd.',
    polishFoundNothing:
      'Niets te verbeteren — wat u schreef leest prima.',
    polishDidNotWork:
      'Dat werkte niet. Wat u schreef is onveranderd.',
    continentAfrica:
      'Afrika',
    continentAsia:
      'Azië',
    continentEurope:
      'Europa',
    continentNorthAmerica:
      'Noord-Amerika',
    continentSouthAmerica:
      'Zuid-Amerika',
    continentOceania:
      'Oceanië',
    regionLevant:
      'Levant',
    regionLatinAmerica:
      'Latijns-Amerika',
    regionMiddleEast:
      'Midden-Oosten',
    regionMaghreb:
      'Maghreb',
    regionCentralEurope:
      'Midden-Europa',
    regionEasternEurope:
      'Oost-Europa',
    regionSouthernEurope:
      'Zuid-Europa',
    regionCentralAsia:
      'Centraal-Azië',
    regionIndianSubcontinent:
      'Indisch subcontinent',
    regionNorthAfrica:
      'Noord-Afrika',
    regionAmericas:
      'Amerika',
    regionAncientNearEast:
      'oude Nabije Oosten',
    regionBalkans:
      'Balkan',
    regionCaribbean:
      'Caraïben',
    regionLowCountries:
      'de Lage Landen',
    regionMesoamerica:
      'Meso-Amerika',
    regionMiddleEasternEmpires:
      'rijken van het Midden-Oosten',
    regionPolishLithuanianCommonwealth:
      'Pools-Litouwse Gemenebest',
    regionQajarIran:
      'Qajarenrijk',
    regionRussianEmpire:
      'Russische Rijk',
    regionSouthCaucasus:
      'Zuidelijke Kaukasus',
    regionSovietCentralAsia:
      'Sovjet-Centraal-Azië',
    regionWu:
      'Wu',
    regionArtsakh:
      'Republiek Artsach',
    refineDietOccasion:
      'Dieet en gelegenheid',
    refineAny:
      'Alle',
    placeKindWiderRegion:
      'ruimere regio',
    placeKindFormerState:
      'historische staat',
    oneTradition:
      '1 traditie',
    onePlace:
      '1 plaats',
    nPlaces:
      '{n} plaatsen',
    countryLevelOnly:
      'alleen op landniveau',
    summaryWorldwide:
      ' wereldwijd',
    nRecorded:
      '{n} vastgelegd',
    writtenInLanguage:
      'Geschreven in het {language}',
    whatThisIs:
      'Wat dit is',
    atlasDefinition:
      'Een gratis atlas van traditionele gerechten — waar elk vandaan komt en wie ervoor instaat.',
    traditionsLabel:
      'tradities',
    freeNoAds:
      'Gratis, geen advertenties',
    quotedFromSource:
      'Geciteerd uit de bron hieronder — een algemene beschrijving van de bereiding, geen vastlegging van hoe het in {place} wordt gemaakt.',
    adaptationLeadIn:
      'Hoe dit gerecht tegenwoordig meestal wordt gemaakt. Het is geen vastlegging van hoe het in {place} wordt bereid, en niemand daarvandaan heeft het bevestigd.',
    openDisagreementBody:
      'Iemand die dit in {place} kookt zegt dat het anders gaat: {differs} Er is niets verwijderd zolang hiernaar wordt gekeken, en de betrouwbaarheid hieronder blijft gelijk — houden beide verhalen stand, dan splitst het record zich in plaats van dat er één wordt overruled.',
    engagementNotShown:
      'Kijkcijfers worden bewust niet getoond: ze meten geen authenticiteit.',
    videoSearchNote:
      'U kunt er bij de bron naar zoeken. Resultaten komen gesorteerd op weergaven, wat alleen bereik meet — wie kookt kan wel of niet uit {place} komen. Niets wat zo gevonden wordt, verandert de classificatie van dit record.',
    nowOpenForConfirmation:
      '{name} staat nu open voor bevestiging.',
    proposalOpenBody:
      '{n} mensen die het gerecht kennen moeten het bevestigen voordat het in de atlas komt. Vanaf nu kan iedereen het zien en bevestigen — ook de mensen aan wie u het vertelt, en zo wordt een gerecht dat niemand had opgeschreven meestal bevestigd.',
    nothingMatchesBody:
      'Niets in de atlas komt nog overeen met {query}. Afwezigheid betekent hier geen record, niet geen gerecht — we zeggen liever dat we het niet weten dan dat we gokken.',
    thatWord:
      'dat',
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
      'Tradycje: {n}, zbudowane w całości ze źródeł wolnych do czytania i na otwartej licencji. Bez reklam, bez śledzenia i bez niczego za opłatą. To, czego wymaga utrzymanie, pokrywa właśnie ten wybór źródeł, a nie ktoś płacący za to, żeby tu być.',
    notForSaleAuthentic:
      'Wpisu nie da się uczynić Autentycznym przez zapłatę. To bierze się z dowodów i od ludzi, którzy tę potrawę gotują.',
    notForSalePromotion:
      'Żadna potrawa nie jest promowana, wyżej pozycjonowana ani wyróżniana dlatego, że ktoś zapłacił.',
    notForSaleAdvertising:
      'Nic tutaj nie jest reklamą i żaden czytelnik nie jest śledzony.',
    donationFootnote:
      'Otwiera się w Open Collective. Tutaj nic nie jest pobierane — ta aplikacja nie przechowuje żadnych twoich danych płatniczych i nigdy nie będzie.',
    donationsPendingBody:
      'Nie ma jeszcze dokąd wysłać pieniędzy. Nic w atlasie od tego nie zależy — stoi na źródłach wolnych do czytania, a to się nie zmienia.',
    mostUsefulThing:
      'Najbardziej przydatną rzeczą, jaką można dać temu atlasowi, nie są pieniądze. Większość z niego to nazwa i miejsce, bo nikt nie zapisał, jak tę potrawę się robi.',
    administration:
      'Administracja',
    administrationNote:
      'Progi, moderacja, sprawdzanie źródeł i użycie. Wymaga tokenu.',
    howLead:
      'To reguła, na której zbudowany jest ten atlas, i jest arytmetyką, a nie polityką — czyli możesz ją sprawdzić, zamiast w nią wierzyć.',
    sixDimensionsBody:
      'Każdy wpis oceniany jest w tych samych sześciu wymiarach, a wszystkie sześć wydrukowane są na samym wpisie. Wynik to ich średnia, więc kto w niego wątpi, może dodać liczby.',
    ceilingBody:
      'Na trzy z tych sześciu nie odpowie żaden kiedykolwiek napisany dokument. Żadna encyklopedia nie wie, czy dany sposób jest sposobem danego miejsca; żaden rejestr nie jest człowiekiem z tej wsi. Przy tych trzech pustych, najwięcej, co wpis może uzyskać z samych publikacji, to {ceiling}.',
    thresholdBody:
      'Wpis nazywa się Autentycznym od {threshold}. Odstęp między tymi dwiema liczbami jest zamierzony i jest całym argumentem: zamknąć go mogą tylko ludzie, którzy znają tę potrawę.',
    whatClosesItBody:
      '{n} potwierdzeń od osób, które podają swój związek z tym miejscem — i mówią, co potwierdzają, a nie tylko że się zgadzają. Oba są pokazane przy wpisie, bo zdanie w rodzaju „urodzony w Kozhikode — używamy ghee, nie oleju” to dowód, który można zważyć, a „{n} potwierdzeń” to liczba, w którą trzeba uwierzyć.',
    accountsBody:
      'Te {n} musi być {n} różnymi osobami, więc potwierdzenie liczy się do odznaki tylko wtedy, gdy osoba była zalogowana. Anonimowe i tak jest zapisywane i pokazywane przy wpisie — to, co ktoś wie, warto mieć, z kontem czy bez — po prostu nie rusza liczby. Czytanie atlasu nigdy nie wymaga logowania.',
    whichIsWhereYouComeInBody:
      'Za większość atlasu nikt nie mówi. Jeśli wiesz, jak przyrządza się potrawę tam, skąd jesteś, to jedyna rzecz, której nie dostarczy żadne źródło i nie sięgnie żadne zbieranie danych.',
    notRatings:
      'Bez ocen. Nikt nie wystawia potrawie gwiazdek.',
    notComments:
      'Bez komentarzy i bez tablicy. Nie ma tu z czym wchodzić w interakcję.',
    notAlgorithm:
      'Żaden algorytm nie decyduje, co widzisz. Kolejnością są dowody, i możesz ją zmienić.',
    notAdvertising:
      'Bez reklam, i żaden czytelnik nie jest śledzony.',
    notPopularity:
      'Popularność jest zapisywana i trzymana osobno. Najczęściej publikowana wersja potrawy nigdy nie staje się tą autentyczną.',
    dimensionOrigin:
      'Skąd potrawa pochodzi i jak dokładnie. Miasteczko bije kraj.',
    dimensionIngredients:
      'Z czego jest zrobiona, tak jak robi ją tradycja.',
    dimensionTechnique:
      'Jak się ją robi — nie to, że ktoś opublikował przepis, ale że to jest sposób tego miejsca.',
    dimensionLocalSource:
      'Ktoś z zadeklarowanym związkiem z tym miejscem przemówił w jej sprawie.',
    dimensionDocumentation:
      'Rejestr, wpis na listę lub encyklopedia to odnotowały.',
    dimensionCommunity:
      'Ludzie z tego miejsca to potwierdzili i powiedzieli, co potwierdzają.',
    fromDocuments:
      'dokumenty mogą',
    fromPeople:
      'tylko ludzie',
    contributeLead:
      'Zapisz to tak, jak robi się to tam, gdzie jesteś. Z samego tego formularza nic nie zostaje opublikowane — najpierw przechodzi przez ocenę i przez potwierdzenie społeczności.',
    writeItTheWayYouWriteIt:
      'Zapisz nazwę potrawy tak, jak sam ją zapisujesz',
    editorialRuleBody:
      'Poprawiaj nasz tekst swobodnie — ortografię, gramatykę, wszystko, co źle się czyta. Nie poprawiaj samej potrawy. Nazwa dania, składnik, sprzęt i miejsce zostają dokładnie tak, jak zapisują je ludzie, którzy to gotują, ze wszystkimi znakami. Jeśli dwie pisownie się różnią, to zwykle dwie społeczności, a nie błąd, i zostają obie.',
    photographTitle:
      'Zdjęcie, jeśli je masz',
    photographBody:
      'Opublikuj własne zdjęcie w Wikimedia Commons, a potem wklej tutaj nazwę pliku. Zostaje twoje, jesteś podpisany wszędzie, gdzie się pojawi, i nie kosztuje to ani ciebie, ani nas. Nie możemy wziąć zdjęcia z Instagrama ani TikToka — tam zdjęcie objęte jest prawem autorskim tego, kto je zrobił, a wiersz z podpisem nie jest zgodą.',
    walkthroughNoteBody:
      'To, co następuje, jest przerobionym przykładem tego, co dzieje się ze zgłoszeniem — ustalenia, sprawdzenia i wstępna punktacja poniżej pochodzą z wpisu, który już jest w atlasie, a nie z tego, co przed chwilą wpisałeś. Twój wpis nie jest tutaj oceniany; oceniają go ludzie, po wysłaniu.',
    examplePreparedBy:
      'Domy w Malabarze, przygotowywane na iftar i na okazje rodzinne',
    exampleConnection:
      'Urodzony w Kozhikode i tam gotuję',
    exampleIngredients:
      'Dojrzały banan nendran, jajka, ghee, cukier, nerkowce, rodzynki; smażone na ciężkiej patelni na małym ogniu z węgla lub gazu, przykryte pokrywką obciążoną żarem',
    shelfFromCountry:
      'Z: {country}',
    shelfFromCountryNote:
      'To, co atlas ma z kraju {country}. To, że tutaj jest dokładnie, znaczy dla ciebie więcej niż gdziekolwiek indziej — ty potrafisz ocenić, czy się zgadza.',
    sending:
      'Wysyłanie…',
    missionHeadline:
      'Każda potrawa tutaj pokazuje swoje dowody.',
    missionStakes:
      'Skąd pochodzi, kto tak mówi i ile naprawdę udało się ustalić — wydrukowane na każdym wpisie i możliwe do sprawdzenia przez każdego, kto wątpi.',
    statDishes:
      'potraw',
    statCountries:
      'krajów',
    statDocumented:
      'udokumentowanych',
    statRegistered:
      'wpisanych',
    statAuthentic:
      'autentycznych',
    missionAsk:
      'W {n} z nich nie zapisano żadnego sposobu przygotowania. {people} osoby z danego miejsca mogą naprawić jeden raz na zawsze.',
    missionAskBody:
      'Nikt nie zapisał, jak się je robi — ani po angielsku, ani w żadnym języku, nigdzie, dokąd sięga maszyna. Żadne archiwum, żadna encyklopedia ani nic automatycznego nie potwierdzi ich zamiast tego; to arytmetyka punktacji, a nie polityka. Jeśli któreś gotujesz, jesteś jedyną osobą, która może.',
    recordADishYouKnow:
      'Zapisz potrawę, którą znasz',
    howItGetsAuthenticated:
      'Jak potrawa jest uwierzytelniana',
    submissionsNotOpen:
      'Zgłoszenia nie są jeszcze otwarte — nie ma dokąd ich wysłać. Powyższa ścieżka wyjaśnia, co się stanie, gdy będą.',
    freeAndStayingFree:
      'Za darmo i tak zostanie. Bez reklam, bez śledzenia, bez zbierania pieniędzy. Konto jest potrzebne tylko po to, by potwierdzić potrawę — nigdy po to, by ją przeczytać.',
    noRatingsNoComments:
      'Bez ocen, bez komentarzy i bez algorytmu decydującego, co widzisz — listy zaczynają się od dowodów, a nie od popularności. Otwarcia liczy się jako potrawa i data, nigdy jako osoba.',
    whyASourceCannot:
      'Dlaczego źródło nie może uwierzytelnić potrawy',
    whyASourceCannotBody:
      'Opublikowana dokumentacja nie przekroczy tutaj {ceiling}, a wpis staje się Autentyczny od {threshold}. Tę różnicę zamykają wyłącznie ludzie związani z danym miejscem. Sześć liczb stojących za każdą punktacją jest wydrukowanych na wpisie, więc kto nie wierzy w wynik, może go zsumować.',
    whyTheAtlasStops:
      'To także powód, dla którego atlas kończy się tam, gdzie się kończy. Przeczytano każde wolne źródło — encyklopedie, książki kucharskie, rejestry dziedzictwa, słowniki geograficzne — a przy {n} wpisach wciąż nie ma nic o tym, jak się je robi. To, co zostało, nigdy nie zostało zapisane.',
    levelLocal:
      'Autentyczne — lokalne',
    levelLocalFull:
      'Autentyczne — lokalne/tradycyjne',
    levelRegional:
      'Autentyczne — regionalne',
    levelVariation:
      'Wariant tradycyjny',
    levelAdaptation:
      'Adaptacja współczesna',
    levelFusion:
      'Fusion',
    levelUnverified:
      'Niesprawdzone',
    levelUnverifiedFull:
      'Niesprawdzone — za mało dowodów',
    filterAuthenticOnly:
      'Tylko autentyczne',
    filterTraditionalVariations:
      'Warianty tradycyjne',
    filterModernAdaptations:
      'Adaptacje współczesne',
    filterFusion:
      'Fusion',
    filterUnverified:
      'Niesprawdzone',
    filterAll:
      'Wszystko',
    geoCountry:
      'kraj',
    geoRegion:
      'region',
    geoProvince:
      'województwo lub powiat',
    geoCity:
      'miasto lub miejscowość',
    geoVillage:
      'wieś lub społeczność',
    chooseRegion:
      'Wybierz region',
    chooseProvince:
      'Wybierz województwo lub powiat',
    chooseCity:
      'Wybierz miasto lub miejscowość',
    chooseVillage:
      'Wybierz wieś lub społeczność',
    typeToSearchLevel:
      'Wpisz, aby szukać…',
    browseAllTraditions:
      'Przejrzyj wszystkie tradycje: {n}',
    geoPlace:
      'miejsce',
    noLevelRecorded:
      'Pod tą nazwą nie zapisano jeszcze żadnego takiego miejsca ({level}). Brak tutaj znaczy brak wpisu, a nie brak potrawy.',
    browseCuisine:
      'kuchnia: {cuisine}',
    browseMadeWith:
      'z składnikiem {ingredient}',
    browseEverything:
      'Wszystko',
    within:
      'W obrębie: {path}',
    chooseCountryHint:
      'Wybierz kraj · zapisanych: {c}',
    chooseCountryHintBroader:
      'Wybierz kraj · zapisanych: {c}, oraz {b} szerszych pochodzeń',
    noRecordUnderThatReference:
      'Pod tym odnośnikiem w atlasie nic nie jest zapisane. Brak tutaj znaczy brak wpisu, a nie brak potrawy.',
    tagTraditionalPreparation:
      '🏺 Przygotowanie tradycyjne',
    tagAtRiskTradition:
      '🕯️ Tradycja zagrożona',
    notEligibleForAuthentic:
      'Nie kwalifikuje się do klasyfikacji jako autentyczne',
    lookingForWhatItBorrows:
      'Szukasz tradycji, z której to czerpie?',
    howItsDescribed:
      'Jak się to opisuje',
    howItsMade:
      'Jak się to robi',
    originAndAttribution:
      'Pochodzenie i przypisanie kulturowe',
    nobodyRecordedTechnique:
      'Nikt nie zapisał techniki — czasów, naczynia, kolejności czynności. To właśnie wyciągnęłoby ten wpis z Niesprawdzonych, a potrzeba do tego kogoś, kto to gotuje.',
    nobodyHasRecorded:
      'Nikt nie zapisał, jak się robi {dish}{place}. Moglibyśmy skopiować z internetu najczęściej publikowany przepis i nazwać go autentycznym, ale właśnie po to ten atlas istnieje, żeby tego nie robić — więc wpis zostaje taki, jaki jest, dopóki nie uzupełni go ktoś, kto to gotuje. Jeśli zrobisz to ty, będziesz pierwszą osobą, która to spisze.',
    ifIngredientUnavailable:
      'Jeśli tradycyjnego składnika nie da się zdobyć',
    commonModernSubstitute:
      'Częsty współczesny zamiennik: ',
    adaptationNotAuthentic:
      'To jest adaptacja i nie należy jej brać za autentyczne przygotowanie.',
    whatTheInternetServes:
      'To, co internet najczęściej podaje jako tę potrawę, i czym odbiega od tradycji powyżej.',
    popularNotAuthentic:
      'Popularne, ale to nie jest autentyczne przygotowanie. Punktem odniesienia pozostaje wersja powyżej.',
    videosRankedByCloseness:
      'Prawdziwe nagrania, uszeregowane według tego, jak blisko tradycji jest osoba gotująca — nie według liczby wyświetleń.',
    stillFramesFromVideos:
      'Kadry pochodzą z samych nagrań, więc potrawa, którą widzisz, to potrawa, którą ta osoba zrobiła.',
    noVideoRecordedYet:
      'Do tej potrawy nie zapisano jeszcze żadnego nagrania z tradycji.',
    findOneFromThePlace:
      'Jeśli znajdziesz nagranie zrobione przez kogoś z tego miejsca, można je dodać przez Dodaj tradycję — to właśnie dałoby tej potrawie uszeregowane nagranie.',
    siblingsNeitherIsReal:
      'Ta sama potrawa, zapisana osobno tam, gdzie robi się ją inaczej. Żadna z nich nie jest tą prawdziwą.',
    doYouKnow:
      'Znasz {subject}?',
    confirmWhatYouKnow:
      'Potwierdź to, co naprawdę wiesz. Nie musisz ręczyć za cały wpis — jedna konkretna rzecz od kogoś, kto to gotuje, waży więcej niż ogólna zgoda.',
    recordedThankYou:
      'Zapisane. Dziękujemy.',
    shownWithYourConnection:
      'Pokazuje się na wpisie z twoim związkiem z miejscem obok, żeby czytający mogli sami to ocenić.',
    signedInCounts:
      'Zalogowano — to policzy się do odznaki.',
    notSignedInNote:
      'Nie zalogowano. To, co napiszesz, pokaże się na wpisie razem z twoim związkiem z miejscem i nie ruszy odznaki: ten licznik rośnie tylko dla osób zalogowanych, żeby jedna osoba nie mogła być trzema.',
    signInSoItCounts:
      'Zaloguj się, żeby to się liczyło',
    shownOnTheRecord:
      'Pokazuje się na wpisie',
    whatCanYouConfirm:
      'Co możesz potwierdzić?',
    exampleSaid:
      'Używamy ghee, nie oleju — i robi się to na Eid, a nie przez cały rok.',
    fromTheTownItself:
      'Jestem z samego miasta lub wsi, a nie tylko z szerszego regionu',
    fromTheTownItselfLabel:
      'Jestem z samego miasta lub wsi, a nie z szerszego regionu',
    exampleWhoMakesIt:
      'Robione w domu na Eid, przez babcie — opcjonalnie',
    exampleIngredientLines:
      'dojrzały platan\njajko\nghee',
    exampleMethodLines:
      'Rozgnieć platana.\nWmieszaj roztrzepane jajko.',
    inPlace:
      ' w miejscowości {place}',
    tagAtRiskShort:
      '🕯️ Zagrożone',
    readThisIn:
      'Przeczytaj to po',
    communityTranslation:
      'Tłumaczenie społeczności',
    machineTranslation:
      'Tłumaczenie maszynowe — jeszcze przez nikogo ze społeczności niesprawdzone',
    notTranslatedYet:
      'Jeszcze nieprzetłumaczone',
    aDotMarks:
      'Kropka oznacza język, na który ten wpis jest już przetłumaczony.',
    opensOnceMoreRecords:
      '{language} otworzy się, gdy da się w nim przeczytać jeszcze {n} wpisów.',
    noTranslationService:
      'Do tej wersji nie podłączono żadnej usługi tłumaczenia, więc nic nie da się przetłumaczyć automatycznie. I tak tłumaczenie od kogoś, kto gotuje tę potrawę, jest warte więcej — można je przekazać przez Dodaj tradycję.',
    whatTheseTermsMean:
      'Co znaczą te określenia',
    signedIn:
      'Zalogowano',
    signOut:
      'Wyloguj',
    signedInSignOut:
      'Zalogowano. Wyloguj.',
    confirmationsCount:
      'Twoje potwierdzenia liczą się do odznaki.',
    signIn:
      'Zaloguj się',
    signInSoConfirmationsCount:
      'Zaloguj się, żeby twoje potwierdzenia się liczyły',
    onlySignedInMovesBadge:
      'Odznaką ruszają tylko potwierdzenia osób zalogowanych.',
    watchAtSource:
      'Obejrzyj u źródła ↗',
    originalAudio:
      'Oryginalny dźwięk',
    creatorsOwnTranslation:
      'Tłumaczenie samego autora',
    translatedCaptions:
      'Przetłumaczone napisy',
    languageUnknown:
      'Język nieznany',
    ingredientsInThisVideo:
      'Składniki użyte w tym nagraniu',
    weDontInventOne:
      'Autor tego nagrania nie opublikował ani listy składników, ani spisanego sposobu, a my ich nie wymyślamy. Tradycyjny sposób powyżej pochodzi z udokumentowanych źródeł poniżej.',
    captureFromVideo:
      'Spisz składniki i kroki z tego nagrania →',
    dietaryPreference:
      'Preferencje żywieniowe',
    narrowItDown:
      'Zawęź',
    anyDiet:
      'Dowolna dieta',
    whenItsEaten:
      'Kiedy się to je',
    anyOccasion:
      'Dowolna okazja',
    alsoCalled:
      'Zwane też',
    notATranslationOfOurs:
      'Każda to nazwa użyta w artykule encyklopedycznym w tym języku — nie jest naszym tłumaczeniem i nigdy nie zastępuje nazwy powyżej. Dotknij jednej, żeby przeczytać ją tam.',
    relatedTraditions:
      'Powiązane tradycje',
    relatedTraditionsNote:
      'Wpisy, które dzielą z tym miejsce, tradycję albo składnik. Każdy mówi, co dokładnie.',
    scoreCannotSettle:
      'Oszacowanie tego, jak mocne są dowody — a nie twierdzenie, że liczba może rozstrzygnąć prawdę kulturową.',
    notScored:
      'Bez oceny',
    navAtlasNote:
      'Co jest objęte i z jaką pewnością',
    navProposeNote:
      'Jedzenie, którego atlas nie ma',
    navConfirmNote:
      'Potrawy czekające na kogoś, kto je zna',
    navSupportNote:
      'Ile kosztuje utrzymanie i kto płaci',
    confirmPrompt:
      'Czy u ciebie robi się to tak?',
    confirmAskBody:
      'Jeśli gotujesz to tam, skąd pochodzi, potwierdzenie albo poprawienie jest tym, co wyciąga wpis z Niesprawdzonych. Tam, gdzie twoja wersja się różni, zostaje zapisana obok tej — a nie zamiast niej.',
    confirmYes:
      'Tak, zgadza się',
    confirmNo:
      'U mnie robi się to inaczej',
    confirmPlacePrompt:
      'Czy ta potrawa naprawdę pochodzi stamtąd, gdzie podajemy?',
    confirmPlaceBody:
      'Nikt nie zapisał, jak się to robi, więc nie ma tu jeszcze z czym się zgadzać. Miejsce jest tym, co ten wpis twierdzi, i samo w sobie warto je potwierdzić — to jedna z sześciu kontroli dowodowych.',
    confirmPlaceYes:
      'Tak, jest stąd',
    confirmPlaceNo:
      'Nie, pochodzi skądinąd',
    standingMet:
      'Potwierdziło to {n} osób związanych z miejscem {place} — tyle, ile wymaga odznaka.',
    standingNobody:
      'Na razie nikt',
    standingOne:
      'Jak dotąd jedna osoba',
    standingMany:
      'Jak dotąd osób: {n}',
    standingNeed:
      '{soFar}. Odznaka wymaga {need}, więc {people} związanych z miejscem {place} by wystarczyło.',
    onePersonMore:
      'jeszcze jedna osoba',
    morePeople:
      'jeszcze {n} osób',
    contestedNote:
      'Umieszczone tutaj, żeby dało się to znaleźć. Udokumentowane roszczenie do tej potrawy ma {n} miejsc — żadne nie jest rozstrzygnięte, a wszystkie wymieniono poniżej.',
    relatedAlsoFrom:
      'Też z: {place}',
    relatedAlsoCuisine:
      'Też {cuisine}',
    relatedSharesIngredients:
      'Wspólnych składników: {n}',
    relatedAlsoUses:
      'Też używa: {ingredient}',
    relatedAlsoCategory:
      'Też {category}',
    authenticVersion:
      'Wersja autentyczna',
    thePublishedRecipe:
      'Opublikowany przepis',
    whyThisIsAnAdaptation:
      'Dlaczego to jest adaptacja',
    whyConsideredAuthentic:
      'Dlaczego uznaje się to za autentyczne?',
    whatThisRecordIs:
      'Czym jest ten wpis',
    stepSubmit:
      'Wyślij',
    stepWhatExists:
      'Co istnieje',
    stepAssessment:
      'Ocena',
    stepValidation:
      'Potwierdzenie',
    findingAggregatorTitle:
      'Strona zbierająca przepisy',
    findingAggregatorTag:
      'Kandydat popularny',
    findingAggregatorNote:
      'Najwyżej wyświetlany wynik. Autor nie podaje żadnego związku z Malabarem; używa masła zamiast ghee.',
    findingVideoTitle:
      'Nagranie z kanału kulinarnego po malajalam',
    findingVideoTag:
      'Źródło miejscowe',
    findingVideoNote:
      'Nakręcone w Kerali, mówione po malajalam, z ghee i bananem nendran zgodnie z opisem.',
    findingGapTitle:
      'Brak zapisu na poziomie miejscowości',
    findingGapTag:
      'Luka',
    findingGapNote:
      'Nic nie dokumentuje, jak robi się to akurat w Kozhikode. To zgłoszenie byłoby pierwsze.',
    checkOriginLabel:
      'Pochodzenie geograficzne',
    checkOriginNote:
      'Malabar, Kozhikode — podane przez zgłaszającego i zgodne ze źródłem wideo.',
    checkLocalPrepLabel:
      'Miejscowe przygotowanie',
    checkLocalPrepNote:
      'Opisane jako gotowanie domowe, na iftar i na okazje rodzinne.',
    checkIngredientsLabel:
      'Składniki tradycyjne',
    checkIngredientsNote:
      'Banan nendran, jajka, ghee — zgadza się z nagraniem ze źródła miejscowego.',
    checkTechniqueLabel:
      'Technika tradycyjna',
    checkTechniqueNote:
      'Mały ogień, pokrywka obciążona żarem.',
    checkDocumentationLabel:
      'Dokumentacja historyczna lub kulturowa',
    checkDocumentationNote:
      'Uboga. Nie znaleziono opracowania ani zapisu archiwalnego.',
    checkLocalSourceLabel:
      'Źródło miejscowe',
    checkLocalSourceNote:
      'Zgłaszający podaje, że urodził się w Kozhikode i tam gotuje.',
    checkCommunityLabel:
      'Potwierdzenie społeczności',
    checkCommunityNote:
      'Jeszcze nieszukane. Dlatego wpisu nie można jeszcze nazwać autentycznym.',
    validatorHomeCook:
      'Domowa kucharka, Kozhikode',
    validatorHomeCookSaid:
      'Potwierdziła składniki i sposób z żarem na pokrywce.',
    validatorBakery:
      'Właściciel cukierni, Thalassery',
    validatorBakerySaid:
      'Potwierdza, zaznacza, że u niego jest mniej cukru.',
    validatorWriter:
      'Dziennikarka kulinarna, Kerala',
    validatorWriterSaid:
      'Potwierdzone jako danie domowe z Malabaru; dokumentacja naprawdę uboga.',
    validatorPending:
      'Zaproszono jeszcze dwoje recenzentów',
    validatorPendingSaid:
      'Czekamy na odpowiedź — wpis ukazuje się i bez nich.',
    photoCheckedNote:
      'Sprawdzane w Commons przy wysłaniu wpisu i pokazywane z autorem i licencją. Zostaje Niesprawdzone, dopóki społeczność tego nie potwierdzi, dokładnie tak jak sposób przygotowania.',
    mostPublishedNote:
      'Najczęściej publikowana wersja jest brana jako kandydat popularny. Nie staje się przez to wpisem autentycznym.',
    sevenChecksNote:
      'Siedem kontroli, każda z odpowiedzią albo zostawiona otwarta. Otwarte obniżają pewność — nigdy nie uzupełnia się ich domysłem.',
    draftConfidence:
      '/100 wstępnej pewności',
    unverifiedPendingTag:
      '⚪ Niesprawdzone — oczekuje na potwierdzenie społeczności',
    oneSubmitterNote:
      'Jedna osoba stamtąd to dowód, a nie rozstrzygnięcie. Wpis zostaje Niesprawdzony, dopóki nie potwierdzą go ludzie ze społeczności.',
    threeConfirmationsNote:
      'Trzy potwierdzenia od osób, które tam mieszkają albo gotują, wyciągają wpis z Niesprawdzonych.',
    conflictingAccountsNote:
      'Sprzeczne relacje zachowuje się obie. Wpis dzieli się na tradycje, które ludzie naprawdę opisali — po jednej na region albo społeczność — i żadnej wersji nie ogłasza się prawdziwą.',
    nowhereToSendNote:
      'Nie ma dokąd tego wysłać. Atlas przeczytał wszystko, co mają wolne źródła, więc brakuje teraz jedzenia, którego nikt nie spisał — to znaczy, że ten formularz jest sposobem, w jaki atlas rośnie, i zostanie włączony, gdy tylko będzie dokąd wysyłać.',
    whereTheExampleEndsUp:
      'Tam kończy przykładowy wpis: opublikowany, z widocznymi dowodami, z nazwanymi otwartymi kontrolami i z każdym twierdzeniem dającym się przypisać temu, kto je wypowiedział.',
    confirmedBy:
      'Potwierdzone przez',
    nothingMatchesAll:
      'Nic nie pasuje do tego wszystkiego naraz.',
    mostOfYourListFirst:
      'Najpierw to, co najbardziej korzysta z twojej listy',
    translatesTheAppsWords:
      'Tłumaczy własne słowa aplikacji. Potrawy zostają w języku, w którym je zapisano — każdy wpis ma swoje osobne sterowanie tłumaczeniem.',
    byNameAndPlaceOnly:
      'Te są w atlasie tylko z nazwy i miejsca. Nikt nie udokumentował, jak się je robi, więc nie mają ani sposobu przygotowania, ani punktacji.',
    wikipediaViewsNote:
      'Ile osób czytało o każdej potrawie w anglojęzycznej Wikipedii przez ostatni rok. To zainteresowanie, a nie autentyczność, i nie mówi też, jak często coś się je — sprzyja temu, czego szukają osoby anglojęzyczne. Wejdź w każdą, żeby zobaczyć jej klasyfikację.',
    requiredDishName:
      'nazwy potrawy',
    requiredCountry:
      'kraju',
    requiredYourName:
      'twojego imienia',
    requiredYourConnection:
      'twojego związku z miejscem',
    requiredWhatYouConfirm:
      'co możesz potwierdzić',
    bandNotScored:
      'Bez oceny',
    bandUnder50:
      'Poniżej 50',
    band50to74:
      '50 – 74',
    band75Plus:
      '75 i więcej',
    reviewCapitals:
      'To jest napisane w całości wielkimi literami.',
    reviewCapitalsConsider:
      'Zwykły zapis czyta się lepiej i łatwiej go przetłumaczyć. Nazwa potrawy zachowuje taki zapis, jaki jej nadano.',
    reviewRepeats:
      'Jeden znak powtarza się kilka razy pod rząd.',
    reviewRepeatsConsider:
      'Sprawdź, czy nie zaciął się klawisz.',
    reviewShort:
      'Opis sposobu jest bardzo krótki.',
    reviewShortConsider:
      'Napisz, co trzeba by zrobić, żeby to przygotować, razem z czekaniem. Wpis bez sposobu przygotowania nie trafi na półki z przepisami.',
    groupSummaryCountries:
      'kraje: {c} · tradycje: {n}',
    groupSummaryOrigins:
      'pochodzenia: {c} · tradycje: {n}',
    metricTotalTitle:
      'Zapisane tradycje',
    metricTotalCounts:
      'Tradycja to jeden sposób robienia potrawy w jednym miejscu. Ta sama potrawa robiona inaczej w dwóch regionach to dwie tradycje i obie się zachowuje.',
    metricTotalMethod:
      'Każdy wpis ze zbioru opracowanego ręcznie i z czterech importowanych źródeł, który ma co pokazać — co najmniej miejsce i nazwę. Wiersze czekające jeszcze na wzbogacenie są wstrzymane i nieliczone.',
    metricTotalCaveat:
      'To nie jest spis odrębnych potraw świata ani miara tego, ile atlas wie. Większość tych wpisów ma nazwę i kraj i nic więcej. To udział wpisów ze spisanym sposobem przygotowania mówi, czy to atlas, czy lista nazw.',
    metricCountriesTitle:
      'Kraje',
    metricCountriesCounts:
      'Odrębne kraje wymienione we wszystkich wpisach, po rozwiązaniu nazw miejsc z importu.',
    metricCountriesMethod:
      'Pole kraju każdego wpisu, bez powtórzeń, licząc tylko te pochodzenia, które są krajami. Historyczne i ponadpaństwowe pozycje użyte przez źródło — Imperium Osmańskie, Lewant, Mezoameryka — zostają przy swoich wpisach zamiast być przypisywane do współczesnego państwa, które musielibyśmy zgadywać, i tutaj nie są liczone. Liczenie ich dodawało trzydzieści dwa do tej liczby, a każde z nich było wyimaginowane.',
    metricCountriesCaveat:
      'Zasięg to nie głębia. Kraj pojawia się tu na sile jednego wpisu, więc to liczy, gdzie atlas był, a nie gdzie jest coś wart. Czytaj to razem z liczbą koncentracji poniżej, która mówi, jak przechylona jest całość.',
    metricAtRiskTitle:
      'Tradycje zagrożone',
    metricAtRiskCounts:
      'Wpisy, w których źródło własnymi słowami opisuje tradycję jako zanikającą, ginącą albo już nieuprawianą.',
    metricAtRiskMethod:
      'Wykrywane przez czytanie wstępu i historii każdego artykułu w poszukiwaniu wyraźnego zaniku — "dziś robi się to rzadko", "ostatni pozostały wytwórca" — i odrzucanie prawie-trafień, które znaczą co innego, jak zagrożony gatunek użyty jako składnik albo zamknięta sieć restauracji. Zdanie, które to uruchomiło, jest przechowywane przy wpisie jako dowód i pokazywane razem z nim.',
    metricAtRiskCaveat:
      'To jest dolna granica, a nie spis, i jest znacznie poniżej prawdy. Może znaleźć tylko taki zanik, który ktoś już zapisał w tekście, który przeczytaliśmy; tradycja trzymana przez cztery rodziny i nigdy nieudokumentowana nie zaznacza się wcale. Sama Arka Smaku Slow Food wymienia około sześciu tysięcy zagrożonych produktów, tysiąc razy tyle co ta liczba.',
    metricDocumentedTitle:
      'Ma zapisany sposób przygotowania',
    metricDocumentedCounts:
      'Wpisy z uporządkowanym sposobem przygotowania — krokami, które ktoś by wykonał.',
    metricDocumentedMethod:
      'Wpisy opracowane ręcznie mają sposób spisany i sprawdzony ze społecznością. Importowane mają go tylko tam, gdzie istnieje opublikowany przepis; akapit encyklopedyczny opisujący, jak ogólnie robi się potrawę, przechowuje się jako prozę i celowo nie awansuje na kroki, bo podanie opisu jako sposobu przypisuje mu dokładność, której nie ma.',
    metricDocumentedCaveat:
      'To, że sposób przygotowania jest, nie mówi nic o tym, czy jest tradycyjny. Od tego jest punktacja pewności, a większość wpisów ze sposobem jest sklasyfikowana jako Adaptacja współczesna.',
    metricLocatedTitle:
      'Umiejscowione poniżej poziomu kraju',
    metricLocatedCounts:
      'Wpisy, które wymieniają region, województwo, miasto albo wieś, a nie tylko kraj.',
    metricLocatedMethod:
      'Każdy wpis, którego miejsce ma wypełniony poziom poniżej kraju.',
    metricLocatedCaveat:
      'Autentyczność ma głębię geograficzną, a kraj to ledwie początek — "Kozhikode" to wpis, "Indie" to nagłówek. Wysoka suma przy niskim udziale tutaj opisuje atlas szeroki i płytki.',
    metricIllustratedTitle:
      'Ma zdjęcie',
    metricIllustratedCounts:
      'Wpisy z obrazem, który aplikacja ma prawo pokazać.',
    metricIllustratedMethod:
      'Z Wikidanych, z własnego artykułu potrawy w Wikipedii albo przekazane przez kogoś, kto gotuje, przez Wikimedia Commons. Każde przechowuje się z autorem i licencją, i żadne nie jest oznaczone jako zweryfikowane: obraz znaleziony po nazwie albo wybrany przez redaktora jest dobrym dowodem, że pokazuje tę potrawę, a nie potwierdzeniem ze strony tej aplikacji.',
    metricIllustratedCaveat:
      'Zdjęcie nie jest dowodem autentyczności. Pokazuje talerz, który ktoś ugotował, a to może być tradycja opisana we wpisie albo nie.',
    metricFilmedTitle:
      'Ma uszeregowane nagranie',
    metricFilmedCounts:
      'Wpisy z przynajmniej jednym nagraniem, uszeregowane według tego, jak blisko tradycji jest osoba gotująca.',
    metricFilmedMethod:
      'Szeregowane według miejsca — gdzie jest osoba gotująca, w jakim języku mówi, czy składniki i sprzęt zgadzają się z wpisem. Nigdy według wyświetleń, polubień czy subskrypcji.',
    metricFilmedCaveat:
      'Kolejność dotyczy bliskości tradycji, a nie jakości filmowania, i pierwsze nagranie bywa najmniej dopracowane.',
    metricAssessedTitle:
      'Sklasyfikowane jako autentyczne',
    metricAssessedCounts:
      'Wpisy, które przez kontrole dowodowe osiągnęły Autentyczne — lokalne albo Autentyczne — regionalne.',
    metricAssessedMethod:
      'Siedem kontroli, każda z odpowiedzią albo zostawiona otwarta, przy czym otwarte obniżają pewność, zamiast być uzupełniane domysłem. Techniki ani potwierdzenia społeczności nigdy nie wnioskuje się z importu, co ogranicza to, co importowany wpis może osiągnąć sam.',
    metricAssessedCaveat:
      'Niski udział tutaj jest uczciwy, a nie jest porażką. Większość katalogu jest importowana i nieoceniona, a nazywanie tych wpisów autentycznymi dlatego, że pochodzą z szanowanego źródła, to dokładnie ta droga na skróty, której ta skala ma odmawiać.',
    metricConcentrationTitle:
      'Koncentracja',
    metricConcentrationCounts:
      'Udział całego katalogu przypadający na jego jeden największy kraj.',
    metricConcentrationMethod:
      'Wpisy z kraju najliczniej reprezentowanego, podzielone przez całość.',
    metricConcentrationCaveat:
      'To odzwierciedla, które kraje prowadzą otwarte rejestry żywności, a nie gdzie jest jedzenie świata. Sama Italia publikuje około 4400 zarejestrowanych produktów tradycyjnych; większość krajów nie publikuje żadnych, a ich nieobecność tutaj to brak papierów, a nie brak gotowania.',
    metricConfidenceTitle:
      'Pewność',
    metricConfidenceCounts:
      'Jak katalog rozkłada się na skali dowodowej od 0 do 100.',
    metricConfidenceMethod:
      'Wpisy opracowane ręcznie są punktowane przez kontrole dowodowe. Importowane tylko tam, gdzie wzbogacanie znalazło co punktować, a poza tym zostają bez punktacji, zamiast dostawać wartość domyślną.',
    metricConfidenceCaveat:
      '"Bez oceny" to zdecydowanie największy przedział i taki pozostanie. Znaczy to, że nikt jeszcze wpisu nie ocenił — a nie że wypadł źle ani że jedzenie jest wątpliwe.',
    metricByContinentTitle:
      'Gdzie są wpisy',
    metricByContinentCounts:
      'Wpisy na kontynent, licząc każdy wpis raz. Tradycja siedzi na kontynencie kraju, w którym ją zapisano, a nie tego, z którego mogła przywędrować.',
    metricByContinentMethod:
      'Z kraju każdego wpisu, przez mapę kraj–kontynent obejmującą około 200 państw, w tym historyczne. Pozycje ponadpaństwowe i sporne są grupowane, a nie wciskane do kontynentu.',
    metricByContinentCaveat:
      'To mapa źródeł, a nie gotowania świata. Europa prowadzi, bo europejskie rejestry są w sieci i otwarte, a to fakt o archiwach.',
    howIsThisCounted:
      'Jak się to liczy?',
    hideHowThisIsCounted:
      'Ukryj, jak się to liczy',
    stapleGrains: 'Zboża',
    stapleRoots: 'Korzenie',
    staplePulses: 'Rośliny strączkowe',
    stapleDairy: 'Nabiał',
    stapleMeatFish: 'Mięso i ryby',
    stapleVegetables: 'Warzywa',
    stapleAromatics: 'Aromaty',
    stapleSweetSour: 'Słodkie i kwaśne',
    stapleRice: 'Ryż',
    stapleWheat: 'Pszenica',
    stapleMaize: 'Kukurydza',
    stapleMillet: 'Proso',
    stapleSorghum: 'Sorgo',
    stapleBarley: 'Jęczmień',
    stapleOats: 'Owies',
    stapleBuckwheat: 'Gryka',
    stapleTeff: 'Teff',
    staplePotato: 'Ziemniak',
    stapleCassava: 'Maniok',
    stapleSweetPotato: 'Tatlı patates',
    stapleYam: 'Pochrzyn',
    stapleTaro: 'Taro',
    staplePlantain: 'Platan',
    stapleLentil: 'Soczewica',
    stapleChickpea: 'Ciecierzyca',
    stapleSoy: 'Soja',
    stapleTofu: 'Tofu',
    stapleBlackBean: 'Czarna fasola',
    stapleMungBean: 'Fasola mung',
    staplePigeonPea: 'Groch gołębi',
    stapleMilk: 'Mleko',
    stapleYoghurt: 'Jogurt',
    stapleCheese: 'Ser',
    staplePaneer: 'Paneer',
    stapleGhee: 'Ghee',
    stapleButter: 'Masło',
    stapleCoconut: 'Kokos',
    stapleChicken: 'Kurczak',
    stapleBeef: 'Wołowina',
    staplePork: 'Wieprzowina',
    stapleLamb: 'Jagnięcina',
    stapleGoat: 'Koza',
    stapleFish: 'Ryba',
    staplePrawn: 'Krewetki',
    stapleEgg: 'Jajka',
    stapleOnion: 'Cebula',
    stapleGarlic: 'Czosnek',
    stapleGinger: 'Imbir',
    stapleChilli: 'Chili',
    stapleLemongrass: 'Trawa cytrynowa',
    stapleTomato: 'Pomidor',
    stapleAubergine: 'Bakłażan',
    stapleCabbage: 'Kapusta',
    stapleSpinach: 'Szpinak',
    stapleOkra: 'Okra',
    stapleTamarind: 'Tamaryndowiec',
    stapleHoney: 'Miód',
    stapleJaggery: 'Jaggery',
    stapleDate: 'Daktyle',
    stapleLemon: 'Cytryna',
    stapleOlive: 'Oliwka',
    dietVegan: 'Wegański',
    dietVegetarian: 'Wegetariański',
    dietSeafood: 'Owoce morza',
    dietMeat: 'Niewegetariański',
    dietUnclassified: 'Niesklasyfikowane',
    dietPoultry: 'Drób',
    dietPork: 'Wieprzowina',
    dietBeef: 'Wołowina i czerwone mięso',
    dietLambGoat: 'Jagnięcina i koza',
    dietGame: 'Dziczyzna',
    dietFish: 'Ryba',
    dietShellfish: 'Skorupiaki i mięczaki',
    dietOtherSeafood: 'Inne owoce morza',
    dietDairy: 'Zawiera nabiał',
    dietEgg: 'Zawiera jajko',
    dietHoney: 'Zawiera miód',
    mealBreakfast: 'Śniadanie',
    mealLunch: 'Obiad',
    mealDinner: 'Kolacja',
    mealSupper: 'Późna kolacja',
    mealSnack: 'Przekąska',
    mealStreetFood: 'Jedzenie uliczne',
    mealCelebration: 'Święto i uczta',
    mealAnytime: 'O każdej porze',
    mealUnclassified: 'Niezapisane',
    searchModeFind:
      'Znajdź potrawę',
    searchModePantry:
      'Gotuj z tego, co mam',
    ingredientsYouHave:
      'Składniki, które masz',
    nTraditions:
      'Tradycje: {n}',
    nothingYet:
      'Na razie nic',
    methodRecorded:
      ' · sposób zapisany',
    noMethodYet:
      ' · jeszcze bez sposobu',
    showMoreLeft:
      'Pokaż więcej — zostało {n}',
    showNMore:
      'Pokaż jeszcze {n}',
    methodAsPublished:
      'Sposób taki, jaki opublikowano. Współczesny sprzęt i skróty są jego częścią.',
    methodTraditional:
      'Sposób tradycyjny, bez podstawiania współczesnych skrótów.',
    everythingClassified:
      'Wszystko sklasyfikowane jako {what}',
    everythingFrom:
      'Wszystko z: {place}',
    everythingRecordedAs:
      'Wszystko zapisane jako {what}',
    everythingMadeWith:
      'Wszystko robione z: {ingredient}',
    seeEverything:
      '{label} — zobacz wszystko',
    noPhotographOnRecord:
      '{label} — brak zdjęcia we wpisie',
    scoreOutOf100:
      '{label}: {value} na 100',
    removeFilter:
      'Usuń filtr {key}',
    anywhereInTheAtlas:
      ' gdziekolwiek w atlasie',
    absenceOfRecords:
      '. To brak wpisów, a nie brak jedzenia — wolimy powiedzieć, że nie wiemy.',
    narrowToA:
      'Zawęź do: {level} · zapisanych: {n}',
    fromTheTown:
      ' — z samego miasta',
    showFewer:
      'Pokaż mniej',
    readAboutOnWikipedia:
      'Przeczytaj o {name} po {language} w Wikipedii',
    languageChangeIt:
      'Język: {language}. Zmień.',
    perCentTranslated:
      '{language}, przetłumaczone w {n} procentach',
    translateThisRecord:
      'Przetłumacz ten wpis',
    translating:
      'Tłumaczenie…',
    translate:
      'Przetłumacz',
    translateThisConfirmation:
      'Przetłumacz to potwierdzenie na {language}',
    couldNotTranslate:
      'Nie udało się przetłumaczyć — spróbuj jeszcze raz',
    howThisIsCountedFor:
      'Jak liczy się {figure}',
    countOfTotal:
      '{label}: {count} z {total}',
    watchAtSourceCreator:
      'Obejrzyj {creator} u źródła',
    stillFromCreator:
      'Kadr z: {creator}',
    thatDidNotSend:
      'To się nie wysłało.',
    containsAlcohol:
      'Zawiera alkohol',
    nothingElseRequired:
      'Wszystko inne jest mile widziane i nic nie jest wymagane — wiedza o tym, skąd jest potrawa i że nikt jej nie zapisał, to już więcej, niż ma jakiekolwiek źródło tutaj.',
    opensTheFormPrefilled:
      'Otwiera formularz u źródła z wypełnionym tym, co już napisałeś. Ta aplikacja nie zbiera o tobie niczego, a nic nie zostaje opublikowane, dopóki nie potwierdzą tego ludzie z tego miejsca.',
    scoreDimGeographic:
      'Związek geograficzny',
    scoreDimIngredients:
      'Składniki tradycyjne',
    scoreDimTechnique:
      'Technika tradycyjna',
    scoreDimLocalSource:
      'Źródło miejscowe',
    scoreDimDocumentation:
      'Dokumentacja kulturowa',
    scoreDimCommunity:
      'Potwierdzenie społeczności',
    photoFromWikidata:
      'Dołączone do własnego wpisu tego dania w Wikidanych — nie znalezione po nazwie',
    photoFromArticle:
      'Główna ilustracja własnego artykułu encyklopedycznego tego dania',
    photoFromRecipe:
      'Opublikowane na stronie tego przepisu',
    photoFromSearch:
      'Znalezione po nazwie w Wikimedia Commons — temat niepotwierdzony',
    photoFromUnknown:
      'Pochodzenie niezapisane — traktuj temat jako niepotwierdzony',
    noTranslationRecorded:
      'Do tej relacji nie zapisano jeszcze żadnego tłumaczenia, więc pokazana jest w języku {language}, w którym ją udokumentowano. Wolimy pokazać ci oryginał niż zgadywanie maszyny co do czasu fermentacji.',
    machineTranslationBy:
      'Tłumaczenie maszynowe: {translator}. Nikt ze społeczności go nie sprawdził — nazwy składników i sprzętu zostają w oryginale.',
    translatedBy:
      'Tłumaczenie: {translator}. Nazwy składników i sprzętu zostają w oryginale.',
    videoOriginalAudio:
      'Mówione w języku {language} — własnym języku osoby gotującej. Nic nie jest tłumaczone.',
    videoCreatorTrack:
      'Autor opublikował ścieżkę dźwiękową w języku {language}. Otwiera się u źródła na tej ścieżce — tłumaczenie jest jego, nie nasze.',
    videoPlatformCaptions:
      'Mówione w języku {spoken}. Otwiera się z maszynowo przetłumaczonymi napisami w języku {preferred} na oryginalnym dźwięku — głos osoby gotującej nie jest zastępowany, a tłumaczenie pochodzi od platformy wideo, a nie od człowieka.',
    videoLanguageUnknown:
      'Nie mamy zapisanego języka mówionego tego nagrania, więc nie możemy obiecać języka {language}. Otwiera się u źródła, gdzie działają opcje napisów samej platformy.',
    figureDocumented:
      'Ma zapisany sposób przygotowania',
    figureDocumentedNote:
      'Liczba, która mówi, czy to atlas, czy lista nazw. Wszystko inne jest wobec niej wtórne.',
    figureLocated:
      'Umiejscowione poniżej poziomu kraju',
    figureLocatedNote:
      'Autentyczność ma głębię geograficzną. „Kozhikode” to wpis; „Indie” to ledwie początek.',
    figureIllustrated:
      'Ma zdjęcie',
    figureIllustratedNote:
      'O potrawę, której nikt sobie nie wyobraża, trudno się troszczyć, a jeszcze trudniej ją rozpoznać.',
    figureFilmed:
      'Ma uszeregowane nagranie',
    figureFilmedNote:
      'Uszeregowane według bliskości osoby gotującej do tradycji — to nie wynik wyszukiwania.',
    figureAssessed:
      'Sklasyfikowane jako autentyczne',
    figureAssessedNote:
      'Zdobyte przez kontrole dowodowe. Niski udział tutaj jest uczciwy, a nie jest porażką.',
    atlasSummary:
      'Zapisanych tradycji: {n}, z {c} krajów. Zasięg podajemy uczciwie: kraj, którego tu nie ma, nie ma jeszcze nic zapisanego — a nie nic do zapisania.',
    nothingRecorded:
      'Nic nie zapisano',
    nothingRecordedAs:
      'Nic nie zapisano jako {what}',
    nothingRecordedAsAnd:
      'Nic nie zapisano jako {list} i {last}',
    photoVia:
      'zdjęcie przez',
    photoNothingEntered:
      'Jeszcze nic nie wpisano.',
    photoNothingEnteredFix:
      'Wklej nazwę pliku z Commons albo link do jego strony.',
    photoWrongHost:
      'Ten odnośnik prowadzi do: {host}, a my nie mamy prawa publikować stamtąd zdjęcia.',
    photoWrongHostFix:
      'Jeśli zdjęcie jest twoje, wgraj je do Wikimedia Commons na wolnej licencji i wklej tutaj nazwę pliku. Zostaje twoje, jesteś podpisany wszędzie, gdzie się pojawi, i nic to nie kosztuje.',
    photoNotCommons:
      'Ten odnośnik nie jest w Wikimedia Commons.',
    photoNotCommonsFix:
      'Publikować można tu tylko pliki z Commons, bo tylko one mają licencję pozwalającą nam je pokazywać.',
    photoNoFileName:
      'Nie znaleziono w tym nazwy pliku.',
    photoNoFileNameFix:
      'Wklej nazwę pliku, na przykład Kaipola.jpg.',
    photoNotAPhotograph:
      'To nie jest plik ze zdjęciem.',
    photoNotAPhotographFix:
      'Zdjęcia w Commons kończą się na .jpg, .png albo .webp. Schematów i logotypów tu nie używamy.',
    photoIsADrawing:
      'To jest rysunek, a nie zdjęcie.',
    photoIsADrawingFix:
      'Użyj zdjęcia potrawy takiej, jaką zrobiono.',
    serverRefused:
      'Serwer to odrzucił ({status}).',
    serverTookTooLong:
      'Serwer odpowiadał za długo.',
    couldNotReachServer:
      'Nie udało się połączyć z serwerem.',
    nothingYouTypedIsLost:
      '{message} Twój wpis nie został wysłany — nic z tego, co napisałeś, nie przepadło, spróbuj za chwilę jeszcze raz.',
    proposalsNotOpen:
      'Zgłoszenia nie są jeszcze otwarte.',
    confirmationsNotOpen:
      'Potwierdzenia nie są jeszcze otwarte.',
    alreadyProposed:
      'Ta potrawa została już zgłoszona. Otwórz ją i potwierdź — to jest to, co ją posuwa.',
    alreadyConfirmed:
      'Tę już potwierdziłeś.',
    youProposedThis:
      'To ty zgłosiłeś tę potrawę, więc potrzeba, żeby potwierdził ją ktoś inny.',
    stillNeededList:
      'Brakuje jeszcze: {list}.',
    listAnd:
      '{list} i {last}',
    listOr:
      '{list} lub {last}',
    proposalConfirmed:
      'Potwierdzone. Trafi do atlasu przy najbliższej aktualizacji.',
    proposalNobodyYet:
      'Nikt jeszcze tego nie potwierdził. {n} osób znających tę potrawę wprowadziłoby ją do atlasu.',
    proposalSoFar:
      'Potwierdzeń: {have} z {n}. Jeszcze {short} od osób znających tę potrawę by ją wprowadziło.',
    recordNobodyYet:
      'Nikt z tego miejsca jeszcze tego nie potwierdził. {n} potwierdzenia uwierzytelniłyby to.',
    recordSoFar:
      'Potwierdzeń: {have} z {n}. Jeszcze {short} od osób znających tę potrawę by to uwierzytelniło.',
    atRiskNote:
      'Oznaczone, bo źródło opisuje tę tradycję jako zanikającą — to zdanie pokazujemy przy wpisie. Nigdy nie wnioskujemy tego z tego, jak mało udokumentowaliśmy: luka w naszych zapisach nie jest dowodem, że ktokolwiek przestał gotować.',
    originDisclaimer:
      'Ta potrawa ma więcej niż jedno udokumentowane roszczenie historyczne. Tradycje poniżej zapisano tak, jak opisuje je każde miejsce, wraz ze źródłami. Żadnego roszczenia nie przedstawia się tu jako zwycięskiego i nic z tego nie wpływa na punktację autentyczności — ta mierzy, jak potrawę robi się w danym miejscu, a nie kto zrobił ją pierwszy.',
    supportRunsOn:
      'Wszystko w atlasie pochodzi z Wikipedii, Wikidanych, Wikimedia Commons, Wikibooks i otwartych rejestrów regionalnych. Są wolne do czytania, na otwartej licencji i wymienione przy każdym wpisie, który z nich korzysta. To cała podstawa tego, że projekt zostaje darmowy — i jest to decyzja, a nie etap.',
    contributeToTheAtlas:
      'Wesprzyj atlas',
    answeredByDocuments:
      'Na te odpowiedzą dokumenty',
    answeredByPeople:
      'Na te odpowiedzą tylko ludzie',
    scaleDocumentsStop:
      'tu kończą się dokumenty',
    scaleAuthenticBegins:
      'tu zaczyna się Autentyczne',
    pantryNothingUses:
      'Nic z zapisanego nie używa {list}. Może po prostu nikt nie zapisał dania, które używa — przy {p}% atlasu nie ma podanego żadnego składnika.',
    alsoRecordedIn:
      'Zapisane także pod {list}',
    alsoRecordedNote:
      'Atlas prowadzi tam osobny wpis dla tej potrawy. Żaden nie poprawia drugiego — potrawa, którą gotują dwie kultury, nie jest błędem w żadnej z nich.',
    chooseACountry:
      'Wybierz kraj',
    filterTheList:
      'Wpisz, aby zawęzić listę',
    showingFirstNOfM:
      'Pokazano pierwsze {n} z {m}. Pisz dalej, aby zawęzić.',
    nothingMatchesThat:
      'Nic na liście nie pasuje.',
    continentBeyondOneCountry:
      'Poza jednym krajem',
    beyondOneCountryNote:
      'Pochodzenie, które źródła zapisują szerzej niż jeden kraj — region, wspólny obszar kulinarny albo państwo, które już nie istnieje. Zostaje tak, jak podaje je źródło, zamiast być zawężone do kraju, którego nikt nie wybrał.',
    connectionGrewUpThere:
      'Tam dorastałem',
    connectionLiveThere:
      'Tam mieszkam',
    connectionFamilyFrom:
      'Moja rodzina stamtąd pochodzi',
    connectionLearnedThere:
      'Tam nauczyłem się to robić',
    connectionCookProfessionally:
      'Gotuję to tam zawodowo',
    chooseYourConnection:
      'Wybierz, co pasuje',
    connectionInYourWords:
      'Cokolwiek chcesz dodać, własnymi słowami',
    connectionDetailPlaceholder:
      'Moja babcia robiła to na każdy Eid w Kozhikode',
    dictateSpeak:
      'Powiedz zamiast pisać',
    dictateListening:
      'Słucham — dotknij, aby zatrzymać',
    dictateStop:
      'Przestań słuchać',
    dictateSendsAudio:
      'Słucha twoja przeglądarka, a większość wysyła w tym celu dźwięk na własne serwery. To, co powiesz, trafia do pola powyżej, gdzie możesz to poprawić.',
    dictateNotAllowed:
      'Przeglądarka nie dała dostępu do mikrofonu.',
    dictateDidNotWork:
      'Nie udało się. Nadal możesz to napisać.',
    polishTidyThis:
      'Popraw moje literówki',
    polishWorking:
      'Poprawiam…',
    polishMachineMade:
      'Propozycja maszyny — twoje słowa są powyżej',
    polishUseThis:
      'Użyj tego',
    polishKeepMine:
      'Zostaw moje',
    polishOnlyTyping:
      'Ruszana jest tylko pisownia, interpunkcja i odstępy. Nic nie jest dodawane, usuwane ani przeformułowane, i żadna nazwa nie jest zmieniana.',
    polishFoundNothing:
      'Nie ma czego poprawiać — to, co napisałeś, czyta się dobrze.',
    polishDidNotWork:
      'Nie udało się. To, co napisałeś, pozostaje bez zmian.',
    continentAfrica:
      'Afryka',
    continentAsia:
      'Azja',
    continentEurope:
      'Europa',
    continentNorthAmerica:
      'Ameryka Północna',
    continentSouthAmerica:
      'Ameryka Południowa',
    continentOceania:
      'Oceania',
    regionLevant:
      'Lewant',
    regionLatinAmerica:
      'Ameryka Łacińska',
    regionMiddleEast:
      'Bliski Wschód',
    regionMaghreb:
      'Maghreb',
    regionCentralEurope:
      'Europa Środkowa',
    regionEasternEurope:
      'Europa Wschodnia',
    regionSouthernEurope:
      'Europa Południowa',
    regionCentralAsia:
      'Azja Środkowa',
    regionIndianSubcontinent:
      'subkontynent indyjski',
    regionNorthAfrica:
      'Afryka Północna',
    regionAmericas:
      'Ameryki',
    regionAncientNearEast:
      'starożytny Bliski Wschód',
    regionBalkans:
      'Bałkany',
    regionCaribbean:
      'Karaiby',
    regionLowCountries:
      'Niderlandy',
    regionMesoamerica:
      'Mezoameryka',
    regionMiddleEasternEmpires:
      'imperia Bliskiego Wschodu',
    regionPolishLithuanianCommonwealth:
      'Rzeczpospolita Obojga Narodów',
    regionQajarIran:
      'Iran Kadżarów',
    regionRussianEmpire:
      'Imperium Rosyjskie',
    regionSouthCaucasus:
      'Kaukaz Południowy',
    regionSovietCentralAsia:
      'radziecka Azja Środkowa',
    regionWu:
      'Wu',
    regionArtsakh:
      'Republika Arcachu',
    refineDietOccasion:
      'Dieta i okazja',
    refineAny:
      'Wszystkie',
    placeKindWiderRegion:
      'szerszy region',
    placeKindFormerState:
      'dawne państwo',
    oneTradition:
      '1 tradycja',
    onePlace:
      '1 miejsce',
    nPlaces:
      '{n} miejsc',
    countryLevelOnly:
      'tylko na poziomie kraju',
    summaryWorldwide:
      ' na całym świecie',
    nRecorded:
      '{n} zapisanych',
    writtenInLanguage:
      'Napisane w języku {language}',
    whatThisIs:
      'Czym to jest',
    atlasDefinition:
      'Bezpłatny atlas tradycyjnych potraw — skąd pochodzi każda z nich i kto za nią ręczy.',
    traditionsLabel:
      'tradycji',
    freeNoAds:
      'Za darmo, bez reklam',
    quotedFromSource:
      'Cytat ze źródła poniżej — ogólny opis przygotowania potrawy, a nie zapis tego, jak robi się ją w {place}.',
    adaptationLeadIn:
      'Jak tę potrawę przyrządza się dziś najczęściej. To nie jest zapis tego, jak robi się ją w {place}, i nikt stamtąd tego nie potwierdził.',
    openDisagreementBody:
      'Ktoś, kto gotuje to w {place}, mówi, że robi się to inaczej: {differs} Nic nie zostało usunięte na czas sprawdzania, a wiarygodność poniżej pozostaje bez zmian — jeśli obie wersje się obronią, wpis zostanie podzielony, zamiast jednej z nich unieważnić.',
    engagementNotShown:
      'Liczby wyświetleń celowo nie są pokazywane: nie mierzą autentyczności.',
    videoSearchNote:
      'Możesz poszukać go u źródła. Wyniki przychodzą posortowane według liczby wyświetleń, co mierzy zasięg i nic więcej — osoba gotująca może, ale nie musi pochodzić z {place}. Nic znalezionego w ten sposób nie wpływa na klasyfikację tego wpisu.',
    nowOpenForConfirmation:
      '{name} jest teraz otwarte do potwierdzenia.',
    proposalOpenBody:
      'Potrawa musi zostać potwierdzona przez {n} osób, które ją znają, zanim trafi do atlasu. Od teraz każdy może ją zobaczyć i potwierdzić — także osoby, którym o niej powiesz, i zwykle w ten sposób potwierdza się potrawę, której nikt nie zapisał.',
    nothingMatchesBody:
      'Nic w atlasie nie pasuje jeszcze do {query}. Brak oznacza tu brak wpisu, a nie brak potrawy — wolimy powiedzieć, że nie wiemy, niż zgadywać.',
    thatWord:
      'to',
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
      '{n} gelenek; tamamı okunması serbest ve açık lisanslı kaynaklardan kuruldu. Reklam yok, izleme yok, ödeme duvarının ardında hiçbir şey yok. İşletmenin gerektirdiğini bu kaynak tercihi karşılıyor; burada yer almak için para ödeyen biri değil.',
    notForSaleAuthentic:
      'Bir kayıt para ödeyerek Otantik yapılamaz. Bu, kanıttan ve o yemeği pişiren insanlardan gelir.',
    notForSalePromotion:
      'Biri ödedi diye hiçbir yemek öne çıkarılmaz, üst sıraya alınmaz veya vitrine konmaz.',
    notForSaleAdvertising:
      'Burada hiçbir şey reklam değildir ve hiçbir okur izlenmez.',
    donationFootnote:
      'Open Collective’te açılır. Burada hiçbir tahsilat yapılmaz — bu uygulama ödeme bilgilerinizi tutmaz ve hiçbir zaman tutmayacak.',
    donationsPendingBody:
      'Henüz para gönderilecek bir yer yok. Atlasta hiçbir şey buna bağlı değil; okunması serbest kaynaklar üzerine kurulu ve bu değişmiyor.',
    mostUsefulThing:
      'Bu atlasa verilebilecek en yararlı şey para değildir. Atlasın çoğu bir ad ve bir yerden ibaret, çünkü kimse yemeğin nasıl yapıldığını yazmamış.',
    administration:
      'Yönetim',
    administrationNote:
      'Eşikler, denetim, kaynak kontrolleri ve kullanım. Bir belirteç gerektirir.',
    howLead:
      'Bu atlasın kurulduğu kural budur ve bir politika değil, aritmetiktir — yani ona güvenmek yerine denetleyebilirsiniz.',
    sixDimensionsBody:
      'Her kayıt aynı altı boyutta puanlanır ve altısı da kaydın kendisinde yazar. Puan bunların ortalamasıdır; kuşku duyan sayıları toplayabilir.',
    ceilingBody:
      'Bu altıdan üçü, şimdiye kadar yazılmış hiçbir belgeyle yanıtlanamaz. Hiçbir ansiklopedi bir yapılışın o yerin yapılışı olup olmadığını bilmez; hiçbir sicil o kasabadan bir insan değildir. O üçü boşken, bir kaydın yalnızca yayımlanmış kaynaklarla alabileceği en yüksek puan {ceiling}.',
    thresholdBody:
      'Bir kayda {threshold} puandan itibaren Otantik denir. Bu iki sayı arasındaki mesafe bilinçlidir ve bütün mesele odur: onu ancak yemeği bilenler kapatabilir.',
    whatClosesItBody:
      'O yerle bağını belirten kişilerden {n} doğrulama — ve yalnızca onayladıklarını değil, neyi doğruladıklarını söyleyen kişilerden. İkisi de kayıtta görünür; çünkü “Kozhikode doğumluyum — yağ değil, sadeyağ kullanırız” gibi bir cümle tartılabilecek bir kanıttır, “{n} doğrulama” ise inanılması gereken bir sayıdır.',
    accountsBody:
      'O {n} kişinin {n} farklı kişi olması gerekir; bu yüzden bir doğrulama, ancak kişi oturum açmışsa rozete sayılır. Anonim olan yine de kaydedilir ve kayıtta gösterilir — birinin bildiği şey, hesabı olsun olmasın, edinilmeye değer — yalnızca sayıyı oynatmaz. Atlası okumak hiçbir zaman oturum açmayı gerektirmez.',
    whichIsWhereYouComeInBody:
      'Atlasın çoğu için konuşan kimse yok. Bir yemeğin, geldiğiniz yerde nasıl yapıldığını biliyorsanız, bu hiçbir kaynağın sağlayamayacağı ve hiçbir taramanın ulaşamayacağı tek şeydir.',
    notRatings:
      'Puanlama yok. Kimse bir yemeğe beş üzerinden not vermiyor.',
    notComments:
      'Yorum yok, akış yok. Burada etkileşime girilecek bir şey yok.',
    notAlgorithm:
      'Ne göreceğinize bir algoritma karar vermiyor. Sıralama kanıttır ve onu değiştirebilirsiniz.',
    notAdvertising:
      'Reklam yok ve hiçbir okur izlenmiyor.',
    notPopularity:
      'Popülerlik kaydedilir ve ayrı tutulur. Bir yemeğin en çok yayımlanan sürümü asla otantik olan hâline gelmez.',
    dimensionOrigin:
      'Yemeğin nereden geldiği ve ne kadar kesin olarak. Bir kasaba, bir ülkeyi geçer.',
    dimensionIngredients:
      'Neyden yapıldığı — geleneğin yaptığı biçimiyle.',
    dimensionTechnique:
      'Nasıl yapıldığı — birinin tarif yayımlamış olması değil, bunun o yerin yöntemi olması.',
    dimensionLocalSource:
      'O yerle bağını belirten biri onun için konuşmuş.',
    dimensionDocumentation:
      'Bir sicil, bir tescil ya da bir ansiklopedi onu kaydetmiş.',
    dimensionCommunity:
      'O yerden insanlar doğrulamış ve neyi doğruladıklarını söylemiş.',
    fromDocuments:
      'belgeler yapabilir',
    fromPeople:
      'yalnızca insanlar',
    contributeLead:
      'Bulunduğunuz yerde nasıl yapılıyorsa öyle kaydedin. Yalnızca bu formdan hiçbir şey yayımlanmaz — önce değerlendirmeden ve topluluk doğrulamasından geçer.',
    writeItTheWayYouWriteIt:
      'Yemeğin adını siz nasıl yazıyorsanız öyle yazın',
    editorialRuleBody:
      'Bizim yazdığımızı gönlünüzce düzeltin — yazım, dilbilgisi, kötü okunan her şey. Yemeğin kendisini düzeltmeyin. Bir yemek adı, bir malzeme, bir alet ve bir yer, onu pişiren insanlar nasıl yazıyorsa tam olarak öyle kalır, işaretleriyle birlikte. İki yazım birbirini tutmuyorsa, bu genellikle bir hata değil iki topluluktur ve ikisi de saklanır.',
    photographTitle:
      'Varsa bir fotoğrafı',
    photographBody:
      'Kendi fotoğrafınızı Wikimedia Commons’a yükleyin, sonra dosya adını buraya yapıştırın. Fotoğraf sizin kalır, göründüğü her yerde adınız yazılır ve ne size ne bize bir şeye mal olur. Instagram’dan ya da TikTok’tan alamayız — oradaki bir fotoğraf, onu çekenin telif hakkındadır ve bir künye satırı izin demek değildir.',
    walkthroughNoteBody:
      'Aşağıdaki, bir gönderiye ne olduğunu gösteren çözülmüş bir örnektir — bulgular, denetimler ve taslak puan, az önce yazdığınızdan değil, atlasta zaten bulunan bir kayıttan gelir. Girdiğiniz burada değerlendirilmez; gönderildikten sonra insanlar değerlendirir.',
    examplePreparedBy:
      'Malabar evleri, iftar için ve aile günleri için yapılır',
    exampleConnection:
      'Kozhikode doğumluyum ve orada pişiriyorum',
    exampleIngredients:
      'Olgun nendran muzu, yumurta, sadeyağ, şeker, kaju, kuru üzüm; ağır bir tavada kısık kömür ya da gaz ateşinde, korla ağırlaştırılmış bir kapakla örtülerek pişirilir',
    shelfFromCountry:
      '{country} mutfağından',
    shelfFromCountryNote:
      'Atlasın {country} için tuttukları. Burada doğru olması sizin için başka her yerden daha değerli — doğru olup olmadığını siz anlayabilirsiniz.',
    sending:
      'Gönderiliyor…',
    missionHeadline:
      'Buradaki her yemek kanıtını gösterir.',
    missionStakes:
      'Nereden geldiği, bunu kimin söylediği ve gerçekte ne kadarının saptandığı — her kaydın üzerinde yazılı ve kuşkulanan herkesin denetleyebileceği biçimde.',
    statDishes:
      'yemek',
    statCountries:
      'ülke',
    statDocumented:
      'belgelenmiş',
    statRegistered:
      'tescilli',
    statAuthentic:
      'özgün',
    missionAsk:
      'Bunlardan {n} tanesinin yapılışı hiç kayda geçmemiş. Bir yerden {people} kişi, birini kalıcı olarak tamamlayabilir.',
    missionAskBody:
      'Nasıl yapıldıklarını kimse yazmamış — ne İngilizce, ne başka bir dilde, bir makinenin ulaşabileceği hiçbir yerde. Hiçbir arşiv, hiçbir ansiklopedi ve hiçbir otomatik yöntem onların yerine doğrulayamaz; bu, puanlamanın aritmetiğidir, bir kural değil. Birini siz pişiriyorsanız, bunu yapabilecek tek kişi sizsiniz.',
    recordADishYouKnow:
      'Bildiğiniz bir yemeği kaydedin',
    howItGetsAuthenticated:
      'Bir yemek nasıl doğrulanır',
    submissionsNotOpen:
      'Gönderiler henüz açık değil — gönderilecek bir yer yok. Yukarıdaki yol, açıldığında ne olacağını anlatıyor.',
    freeAndStayingFree:
      'Ücretsiz ve öyle kalacak. Reklam yok, izleme yok, toplanan para yok. Hesap yalnızca bir yemeği doğrulamak için gerekir — okumak için asla.',
    noRatingsNoComments:
      'Puan yok, yorum yok ve ne göreceğinize karar veren bir algoritma yok — listeler popülerlikle değil kanıtla başlar. Açılışlar bir yemek ve bir tarih olarak sayılır, asla bir kişi olarak değil.',
    whyASourceCannot:
      'Bir kaynak bir yemeği neden doğrulayamaz',
    whyASourceCannotBody:
      'Yayımlanmış belgeler burada {ceiling} puanı geçemez ve bir kayıt {threshold} puandan itibaren Özgün sayılır. Bu aradaki farkı yalnızca o yerle bağı olan insanlar kapatabilir. Her puanın arkasındaki altı sayı kaydın üzerinde yazılıdır, böylece sayıdan kuşkulanan onu toplayabilir.',
    whyTheAtlasStops:
      'Atlasın bittiği yerde bitmesinin nedeni de budur. Serbest kaynakların hepsi okundu — ansiklopediler, yemek kitapları, miras kayıtları, yer adları sözlükleri — ve {n} kaydın nasıl yapıldığına dair hâlâ hiçbir şey yok. Geriye kalan hiç yazılmamış olandır.',
    levelLocal:
      'Özgün — yerel',
    levelLocalFull:
      'Özgün — yerel/geleneksel',
    levelRegional:
      'Özgün — bölgesel',
    levelVariation:
      'Geleneksel çeşitleme',
    levelAdaptation:
      'Modern uyarlama',
    levelFusion:
      'Fusion',
    levelUnverified:
      'Doğrulanmamış',
    levelUnverifiedFull:
      'Doğrulanmamış — kanıt yetersiz',
    filterAuthenticOnly:
      'Yalnızca özgün',
    filterTraditionalVariations:
      'Geleneksel çeşitlemeler',
    filterModernAdaptations:
      'Modern uyarlamalar',
    filterFusion:
      'Fusion',
    filterUnverified:
      'Doğrulanmamış',
    filterAll:
      'Hepsi',
    geoCountry:
      'ülke',
    geoRegion:
      'bölge',
    geoProvince:
      'il ya da ilçe',
    geoCity:
      'şehir ya da kasaba',
    geoVillage:
      'köy ya da topluluk',
    chooseRegion:
      'Bir bölge seçin',
    chooseProvince:
      'Bir il ya da ilçe seçin',
    chooseCity:
      'Bir şehir ya da kasaba seçin',
    chooseVillage:
      'Bir köy ya da topluluk seçin',
    typeToSearchLevel:
      'Aramak için yazın…',
    browseAllTraditions:
      '{n} geleneğin tamamına göz atın',
    geoPlace:
      'yer',
    noLevelRecorded:
      'Bu adla kayıtlı bir {level} henüz yok. Burada olmaması kayıt yok demektir, yemek yok demek değil.',
    browseCuisine:
      '{cuisine} mutfağı',
    browseMadeWith:
      '{ingredient} ile yapılan',
    browseEverything:
      'Hepsi',
    within:
      '{path} içinde',
    chooseCountryHint:
      'Bir ülke seçin · {c} kayıtlı',
    chooseCountryHintBroader:
      'Bir ülke seçin · {c} kayıtlı, ayrıca {b} daha geniş köken',
    noRecordUnderThatReference:
      'Atlasta bu künyeyle kayıtlı bir şey yok. Burada olmaması kayıt yok demektir, yemek yok demek değil.',
    tagTraditionalPreparation:
      '🏺 Geleneksel hazırlık',
    tagAtRiskTradition:
      '🕯️ Tehlikedeki gelenek',
    notEligibleForAuthentic:
      'Özgün sınıflandırmasına giremez',
    lookingForWhatItBorrows:
      'Ödünç aldığı geleneği mi arıyorsunuz?',
    howItsDescribed:
      'Nasıl anlatılıyor',
    howItsMade:
      'Nasıl yapılıyor',
    originAndAttribution:
      'Köken ve kültürel atıf',
    nobodyRecordedTechnique:
      'Tekniği kimse kaydetmemiş — süreleri, kabı, işlerin sırasını. Bu kaydı Doğrulanmamış olmaktan çıkaracak olan tam da budur ve bunun için onu pişiren birine ihtiyaç var.',
    nobodyHasRecorded:
      '{dish} nasıl yapılır{place}, kimse kaydetmemiş. İnternette en çok yayımlanan tarifi kopyalayıp özgün diyebilirdik, ama bu atlas tam da bunu yapmamak için var — bu yüzden kayıt, onu pişiren biri dolduruncaya kadar olduğu gibi kalıyor. Siz doldurursanız, bunu yazan ilk kişi olursunuz.',
    ifIngredientUnavailable:
      'Geleneksel malzeme bulunamıyorsa',
    commonModernSubstitute:
      'Yaygın modern karşılığı: ',
    adaptationNotAuthentic:
      'Bu bir uyarlamadır ve özgün hazırlık sayılmamalıdır.',
    whatTheInternetServes:
      'İnternetin bu yemek için çoğunlukla önüne koyduğu şey ve yukarıdaki gelenekten nerede ayrıldığı.',
    popularNotAuthentic:
      'Yaygın, ama özgün hazırlık değil. Ölçüt yukarıdaki sürüm olmaya devam ediyor.',
    videosRankedByCloseness:
      'Gerçek videolar, izlenme sayısına göre değil, pişiren kişinin geleneğe ne kadar yakın olduğuna göre sıralanmış.',
    stillFramesFromVideos:
      'Kareler videoların kendisinden alınıyor, yani gördüğünüz yemek o kişinin yaptığı yemek.',
    noVideoRecordedYet:
      'Bu yemek için gelenekten gelen bir video henüz kaydedilmedi.',
    findOneFromThePlace:
      'Oradan birinin yaptığı bir video bulursanız, Bir gelenek ekleyin üzerinden eklenebilir — bu yemeğe sıralanmış bir video kazandıracak olan budur.',
    siblingsNeitherIsReal:
      'Aynı yemek, farklı yapıldığı yerde ayrıca kaydedilmiş. İkisinden hiçbiri gerçek olan değil.',
    doYouKnow:
      '{subject} biliyor musunuz?',
    confirmWhatYouKnow:
      'Gerçekten bildiğinizi doğrulayın. Kaydın tamamına kefil olmanız gerekmez — onu pişiren birinden gelen belirli bir şey, genel bir onaydan daha değerlidir.',
    recordedThankYou:
      'Kaydedildi. Teşekkürler.',
    shownWithYourConnection:
      'Kayıtta, yanında sizin bağınızla birlikte görünür; böylece okuyanlar kendileri tartabilir.',
    signedInCounts:
      'Oturum açık — bu, işaret için sayılacak.',
    notSignedInNote:
      'Oturum açık değil. Yazdıklarınız bağınızla birlikte kayıtta görünecek ama işareti oynatmayacak: o sayı yalnızca oturum açmış kişilerle yükselir, böylece bir kişi üç kişi olamaz.',
    signInSoItCounts:
      'Sayılması için oturum açın',
    shownOnTheRecord:
      'Kayıtta görünür',
    whatCanYouConfirm:
      'Neyi doğrulayabilirsiniz?',
    exampleSaid:
      'Biz sadeyağ kullanırız, yağ değil — ve yıl boyu değil, Ramazan Bayramı’nda yapılır.',
    fromTheTownItself:
      'Ben kasabanın ya da köyün kendisindenim, yalnızca geniş bölgeden değil',
    fromTheTownItselfLabel:
      'Ben kasabanın ya da köyün kendisindenim, geniş bölgeden değil',
    exampleWhoMakesIt:
      'Bayramda evde, büyükanneler yapar — isteğe bağlı',
    exampleIngredientLines:
      'olgun muz\nyumurta\nsadeyağ',
    exampleMethodLines:
      'Muzu ezin.\nÇırpılmış yumurtayı katın.',
    inPlace:
      ' {place} bölgesinde',
    tagAtRiskShort:
      '🕯️ Tehlikede',
    readThisIn:
      'Şu dilde okuyun',
    communityTranslation:
      'Topluluk çevirisi',
    machineTranslation:
      'Makine çevirisi — topluluktan henüz kimse denetlemedi',
    notTranslatedYet:
      'Henüz çevrilmedi',
    aDotMarks:
      'Nokta, bu kaydın hâlihazırda çevrildiği bir dili gösterir.',
    opensOnceMoreRecords:
      '{language}, o dilde {n} kayıt daha okunabilir olduğunda açılacak.',
    noTranslationService:
      'Bu sürüme bağlı bir çeviri hizmeti yok, bu yüzden hiçbir şey kendiliğinden çevrilemiyor. Zaten bu yemeği pişiren birinin çevirisi daha değerlidir — Bir gelenek ekleyin üzerinden verilebilir.',
    whatTheseTermsMean:
      'Bu terimler ne demek',
    signedIn:
      'Oturum açık',
    signOut:
      'Çıkış yap',
    signedInSignOut:
      'Oturum açık. Çıkış yap.',
    confirmationsCount:
      'Doğrulamalarınız işaret için sayılır.',
    signIn:
      'Oturum aç',
    signInSoConfirmationsCount:
      'Doğrulamalarınızın sayılması için oturum açın',
    onlySignedInMovesBadge:
      'Bir işareti yalnızca oturum açmış kişilerin doğrulamaları oynatır.',
    watchAtSource:
      'Kaynağında izleyin ↗',
    originalAudio:
      'Özgün ses',
    creatorsOwnTranslation:
      'Videoyu yapanın kendi çevirisi',
    translatedCaptions:
      'Çevrilmiş altyazı',
    languageUnknown:
      'Dil bilinmiyor',
    ingredientsInThisVideo:
      'Bu videoda kullanılan malzemeler',
    weDontInventOne:
      'Bu videoyu yapan kişi ne malzeme listesi ne de yazılı bir yöntem yayımlamış; biz de uydurmuyoruz. Yukarıdaki geleneksel yöntem, aşağıdaki belgelenmiş kaynaklardan geliyor.',
    captureFromVideo:
      'Bu videodaki malzeme ve adımları kaydedin →',
    dietaryPreference:
      'Beslenme tercihi',
    narrowItDown:
      'Daraltın',
    anyDiet:
      'Herhangi bir beslenme',
    whenItsEaten:
      'Ne zaman yenir',
    anyOccasion:
      'Herhangi bir durum',
    alsoCalled:
      'Şöyle de denir',
    notATranslationOfOurs:
      'Her biri, o dildeki ansiklopedi maddesinde kullanılan addır — bizim çevirimiz değildir ve yukarıdaki adın yerini asla almaz. Orada okumak için birine dokunun.',
    relatedTraditions:
      'İlgili gelenekler',
    relatedTraditionsNote:
      'Bununla bir yeri, bir geleneği ya da bir malzemeyi paylaşan kayıtlar. Her biri hangisi olduğunu söyler.',
    scoreCannotSettle:
      'Kanıtın ne kadar güçlü olduğuna dair bir tahmin — bir puanın kültürel doğruyu karara bağlayabileceği iddiası değil.',
    notScored:
      'Puanlanmadı',
    navAtlasNote:
      'Neler kapsanıyor ve ne kadar güvenle',
    navProposeNote:
      'Atlasta kaydı olmayan yemekler',
    navConfirmNote:
      'Kendini bilen birini bekleyen yemekler',
    navSupportNote:
      'İşletmesi ne tutuyor ve kim ödüyor',
    confirmPrompt:
      'Sizin oralarda böyle mi yapılır?',
    confirmAskBody:
      'Bunu geldiği yerde pişiriyorsanız, doğrulamanız ya da düzeltmeniz bir kaydı Doğrulanmamış olmaktan çıkaran şeydir. Sizin yaptığınızın farklı olduğu yerlerde, bunun yerine değil, bunun yanına kaydedilir.',
    confirmYes:
      'Evet, uyuyor',
    confirmNo:
      'Bizim oralarda başka türlü yapılır',
    confirmPlacePrompt:
      'Bu yemek gerçekten söylediğimiz yerden mi?',
    confirmPlaceBody:
      'Bunun nasıl yapıldığını kimse yazmamış, dolayısıyla henüz katılınacak bir şey yok. Yer, bu kaydın ileri sürdüğü şeydir ve tek başına doğrulanmaya değer — altı kanıt denetiminden biridir.',
    confirmPlaceYes:
      'Evet, buranın',
    confirmPlaceNo:
      'Hayır, başka bir yerden',
    standingMet:
      '{place} ile bağı olan {n} kişi bunu doğruladı — işaretin istediği sayı.',
    standingNobody:
      'Henüz kimse',
    standingOne:
      'Şimdiye kadar bir kişi',
    standingMany:
      'Şimdiye kadar {n} kişi',
    standingNeed:
      '{soFar}. İşaret {need} istiyor, yani {place} ile bağı olan {people} bunu karşılardı.',
    onePersonMore:
      'bir kişi daha',
    morePeople:
      '{n} kişi daha',
    contestedNote:
      'Bulunabilsin diye buraya yerleştirildi. Bu yemek üzerinde belgelenmiş iddiası olan {n} yer var — hiçbiri karara bağlanmış değil ve hepsi aşağıda sıralı.',
    relatedAlsoFrom:
      'Yine {place} kökenli',
    relatedAlsoCuisine:
      'Yine {cuisine}',
    relatedSharesIngredients:
      '{n} ortak malzeme',
    relatedAlsoUses:
      'Bunda da {ingredient} var',
    relatedAlsoCategory:
      'Yine {category}',
    authenticVersion:
      'Özgün sürüm',
    thePublishedRecipe:
      'Yayımlanmış tarif',
    whyThisIsAnAdaptation:
      'Bu neden bir uyarlama',
    whyConsideredAuthentic:
      'Bu neden özgün sayılıyor?',
    whatThisRecordIs:
      'Bu kayıt nedir',
    stepSubmit:
      'Gönder',
    stepWhatExists:
      'Var olanlar',
    stepAssessment:
      'Değerlendirme',
    stepValidation:
      'Doğrulama',
    findingAggregatorTitle:
      'Tarif toplayıcı sayfa',
    findingAggregatorTag:
      'Yaygın aday',
    findingAggregatorNote:
      'En üstteki sonuç. Yazarı Malabar ile herhangi bir bağ belirtmiyor; sadeyağ yerine tereyağı kullanıyor.',
    findingVideoTitle:
      'Malayalam yemek kanalı videosu',
    findingVideoTag:
      'Yerel kaynak',
    findingVideoNote:
      'Kerala’da çekilmiş, Malayalam konuşuluyor, anlatıldığı gibi sadeyağ ve nendran muzuyla.',
    findingGapTitle:
      'Kasaba düzeyinde kayıt bulunamadı',
    findingGapTag:
      'Boşluk',
    findingGapNote:
      'Özellikle Kozhikode’de nasıl yapıldığını belgeleyen bir şey yok. Bu gönderi ilk olurdu.',
    checkOriginLabel:
      'Coğrafi köken',
    checkOriginNote:
      'Malabar, Kozhikode — gönderen kişinin belirttiği gibi ve video kaynağıyla tutarlı.',
    checkLocalPrepLabel:
      'Yerel hazırlık',
    checkLocalPrepNote:
      'Ev yemeği olarak, iftar ve aile günleri için anlatılıyor.',
    checkIngredientsLabel:
      'Geleneksel malzemeler',
    checkIngredientsNote:
      'Nendran muzu, yumurta, sadeyağ — yerel kaynak videosuyla örtüşüyor.',
    checkTechniqueLabel:
      'Geleneksel teknik',
    checkTechniqueNote:
      'Kısık ateş, korla ağırlaştırılmış kapak.',
    checkDocumentationLabel:
      'Tarihsel ya da kültürel belge',
    checkDocumentationNote:
      'Zayıf. Ne bir çalışma ne de bir arşiv kaydı bulunabildi.',
    checkLocalSourceLabel:
      'Yerel kaynak',
    checkLocalSourceNote:
      'Gönderen kişi Kozhikode doğumlu olduğunu ve orada pişirdiğini bildiriyor.',
    checkCommunityLabel:
      'Topluluk doğrulaması',
    checkCommunityNote:
      'Henüz istenmedi. Kaydın şimdilik özgün denememesinin nedeni bu.',
    validatorHomeCook:
      'Ev aşçısı, Kozhikode',
    validatorHomeCookSaid:
      'Malzemeleri ve kapağın üstündeki kor yöntemini doğruladı.',
    validatorBakery:
      'Tatlıcı sahibi, Thalassery',
    validatorBakerySaid:
      'Doğruluyor, kendi yaptıklarında daha az şeker olduğunu belirtiyor.',
    validatorWriter:
      'Yemek yazarı, Kerala',
    validatorWriterSaid:
      'Malabar ev yemeği olarak doğrulandı; belge gerçekten az.',
    validatorPending:
      'İki inceleyici daha çağrıldı',
    validatorPendingSaid:
      'Yanıt bekleniyor — kayıt onlarsız da yayımlanır.',
    photoCheckedNote:
      'Kayıt gönderildiğinde Commons ile karşılaştırılır ve çekenin adı ve lisansıyla birlikte gösterilir. Yöntemde olduğu gibi, topluluk doğrulayana kadar Doğrulanmamış kalır.',
    mostPublishedNote:
      'En çok yayımlanan sürüm yaygın aday sayılır. Bu, onu özgün kayıt yapmaz.',
    sevenChecksNote:
      'Yedi denetim; her biri ya yanıtlanır ya açık bırakılır. Açık kalanlar güveni düşürür — asla varsayımla doldurulmaz.',
    draftConfidence:
      '/100 taslak güven',
    unverifiedPendingTag:
      '⚪ Doğrulanmamış — topluluk doğrulaması bekleniyor',
    oneSubmitterNote:
      'Oradan tek bir gönderen kanıttır, ispat değil. Topluluktan insanlar doğrulayana kadar kayıt Doğrulanmamış kalır.',
    threeConfirmationsNote:
      'Orada yaşayan ya da pişiren üç kişinin doğrulaması, bir kaydı Doğrulanmamış olmaktan çıkarır.',
    conflictingAccountsNote:
      'Çelişen anlatıların ikisi de saklanır. Kayıt, insanların gerçekten anlattığı geleneklere ayrılır — bölge ya da topluluk başına bir tane — ve hiçbir sürüm doğru ilan edilmez.',
    nowhereToSendNote:
      'Bunu gönderecek bir yer yok. Atlas serbest kaynakların elindeki her şeyi okudu, dolayısıyla şimdi eksik olan, kimsenin yazmadığı yemekler — yani bu form atlasın büyüme yolu ve gidecek bir yer olur olmaz açılacak.',
    whereTheExampleEndsUp:
      'Örnek kayıt oraya varır: kanıtları görünür, açık kalan denetimleri adlarıyla belirtilmiş ve her iddiası onu söyleyene kadar izlenebilir biçimde yayımlanmış olarak.',
    confirmedBy:
      'Doğrulayan',
    nothingMatchesAll:
      'Bunların hepsine birden uyan bir şey yok.',
    mostOfYourListFirst:
      'Önce listenizden en çok kullananlar',
    translatesTheAppsWords:
      'Uygulamanın kendi sözlerini çevirir. Yemekler kaydedildikleri dilde kalır — her kaydın kendi çeviri düğmeleri vardır.',
    byNameAndPlaceOnly:
      'Bunlar atlasta yalnızca adı ve yeriyle var. Nasıl yapıldıklarını kimse belgelememiş, bu yüzden ne yapılışları ne de puanları var.',
    wikipediaViewsNote:
      'Geçen yıl her yemek hakkında İngilizce Vikipedi’de kaç kişinin okuduğu. Bu ilgidir; özgünlük değildir ve bir yemeğin ne kadar yendiğini de göstermez — İngilizce konuşanların aradıklarını öne çıkarır. Sınıflandırmasını görmek için her birine dokunun.',
    requiredDishName:
      'yemeğin adı',
    requiredCountry:
      'ülke',
    requiredYourName:
      'adınız',
    requiredYourConnection:
      'o yerle bağınız',
    requiredWhatYouConfirm:
      'neyi doğrulayabildiğiniz',
    bandNotScored:
      'Puanlanmadı',
    bandUnder50:
      '50’nin altı',
    band50to74:
      '50 – 74',
    band75Plus:
      '75 ve üzeri',
    reviewCapitals:
      'Bu, baştan sona büyük harfle yazılmış.',
    reviewCapitalsConsider:
      'Normal yazım daha kolay okunur ve çevrilmesi daha kolaydır. Yemeğin adı, siz nasıl yazdıysanız öyle kalır.',
    reviewRepeats:
      'Bir karakter arka arkaya birkaç kez yineleniyor.',
    reviewRepeatsConsider:
      'Bir tuşun takılı kalmadığından emin olun.',
    reviewShort:
      'Yapılışı çok kısa.',
    reviewShortConsider:
      'Birinin bunu yapmak için ne yapması gerektiğini, beklemeler dahil, yazın. Yapılışı olmayan bir kayıt tarif raflarına ulaşamaz.',
    groupSummaryCountries:
      '{c} ülke · {n} gelenek',
    groupSummaryOrigins:
      '{c} köken · {n} gelenek',
    metricTotalTitle:
      'Kayda geçmiş gelenekler',
    metricTotalCounts:
      'Gelenek, bir yemeği bir yerde yapmanın bir yoludur. Aynı yemek iki bölgede farklı yapılıyorsa iki gelenektir ve ikisi de saklanır.',
    metricTotalMethod:
      'Derlenmiş kümeden ve dört içe aktarılmış kaynaktan gelen, gösterecek bir şeyi olan her kayıt — en azından bir yer ve bir ad. Zenginleştirme bekleyen satırlar tutulur ve sayılmaz.',
    metricTotalCaveat:
      'Bu, dünyadaki farklı yemeklerin sayımı değildir ve atlasın ne kadar bildiğinin ölçüsü de değildir. Bu kayıtların çoğu bir ad ve bir ülke taşır, başka bir şey değil. Yazılı yapılışı olanların oranı, bunun bir atlas mı yoksa bir ad listesi mi olduğunu söyleyen sayıdır.',
    metricCountriesTitle:
      'Ülkeler',
    metricCountriesCounts:
      'İçe aktarımın yer adları çözüldükten sonra, tüm kayıtlarda adı geçen farklı ülkeler.',
    metricCountriesMethod:
      'Her kaydın ülke alanı, yinelenenler ayıklanarak ve yalnızca ülke olan kökenler sayılarak. Bir kaynağın kullandığı tarihsel ve devletler üstü girdiler — Osmanlı İmparatorluğu, Levant, Mezoamerika — tahmin etmemiz gereken modern bir devlete atanmak yerine kendi kayıtlarında bırakılır ve burada sayılmaz. Onları saymak bu sayıya otuz iki ekliyordu ve her biri hayaliydi.',
    metricCountriesCaveat:
      'Kapsam derinlik demek değildir. Bir ülke buraya tek bir kaydın gücüyle girer; yani bu, atlasın nerelere uğradığını sayar, nerede iyi olduğunu değil. Aşağıdaki yoğunlaşma sayısıyla birlikte okuyun; o, toplamın ne kadar dengesiz olduğunu söyler.',
    metricAtRiskTitle:
      'Tehlikedeki gelenekler',
    metricAtRiskCounts:
      'Bir kaynağın kendi sözleriyle geleneği gerilemekte, yok olmakta ya da artık sürdürülmüyor diye tanımladığı kayıtlar.',
    metricAtRiskMethod:
      'Her maddenin girişi ve tarihçesi, açıkça belirtilen bir gerileme için okunarak bulunur — "artık nadiren yapılır", "kalan son üretici" — ve başka bir şey demek olan yakın eşleşmeler elenir; örneğin malzeme olarak kullanılan tehlikedeki bir tür ya da kapanmış bir restoran zinciri. Bunu tetikleyen cümle kanıt olarak kayıtta saklanır ve onunla birlikte gösterilir.',
    metricAtRiskCaveat:
      'Bu bir alt sınırdır, sayım değil ve gerçeğin çok altındadır. Yalnızca birinin okuduğumuz bir metinde zaten yazmış olduğu gerilemeyi bulabilir; dört ailenin sürdürdüğü ve hiç belgelenmemiş bir gelenek hiç görünmez. Yalnızca Slow Food’un Tat Gemisi yaklaşık altı bin tehlikedeki gıdayı listeler; bu sayının bin katı.',
    metricDocumentedTitle:
      'Kayıtlı bir yapılışı var',
    metricDocumentedCounts:
      'Sıralı bir yapılışı olan kayıtlar — birinin yapmak için izleyeceği adımlar.',
    metricDocumentedMethod:
      'Derlenmiş kayıtların yapılışı yazılmış ve toplulukla denetlenmiştir. İçe aktarılanlarda ise yalnızca yayımlanmış bir tarif varsa bulunur; bir yemeğin genel olarak nasıl yapıldığını anlatan ansiklopedi paragrafı düzyazı olarak saklanır ve bilerek adımlara yükseltilmez, çünkü bir betimlemeyi yapılış diye sunmak, onda olmayan bir kesinliği iddia etmektir.',
    metricDocumentedCaveat:
      'Bir yapılışın bulunması, onun geleneksel olan olup olmadığı hakkında bir şey söylemez. Güven puanı bunun içindir ve yapılışı olan kayıtların çoğu Modern uyarlama olarak sınıflandırılmıştır.',
    metricLocatedTitle:
      'Ülke düzeyinin altında konumlanmış',
    metricLocatedCounts:
      'Yalnızca bir ülkeyi değil, bir bölgeyi, ili, şehri ya da köyü adlandıran kayıtlar.',
    metricLocatedMethod:
      'Yerinde ülkenin altında doldurulmuş bir düzey bulunan her kayıt.',
    metricLocatedCaveat:
      'Özgünlüğün coğrafi bir derinliği vardır ve bir ülke ancak bir başlangıçtır — "Kozhikode" bir kayıttır, "Hindistan" bir başlıktır. Yüksek bir toplamla buradaki düşük bir oran, geniş ve sığ bir atlası anlatır.',
    metricIllustratedTitle:
      'Fotoğrafı var',
    metricIllustratedCounts:
      'Uygulamanın gösterme hakkına sahip olduğu bir görseli olan kayıtlar.',
    metricIllustratedMethod:
      'Wikidata’dan, yemeğin kendi Vikipedi maddesinden ya da pişiren birinin Wikimedia Commons üzerinden katkısıyla. Her biri çekeni ve lisansıyla saklanır ve hiçbiri doğrulanmış diye işaretlenmez: adla bulunmuş ya da bir editörce seçilmiş bir görsel, o yemeği gösterdiğine dair iyi bir kanıttır; bu uygulamanın onayı değil.',
    metricIllustratedCaveat:
      'Fotoğraf özgünlüğün kanıtı değildir. Birinin pişirdiği bir tabağı gösterir; bu, kaydın anlattığı gelenek olabilir de olmayabilir de.',
    metricFilmedTitle:
      'Sıralanmış videosu var',
    metricFilmedCounts:
      'En az bir videosu olan, pişiren kişinin geleneğe yakınlığına göre sıralanmış kayıtlar.',
    metricFilmedMethod:
      'Yerelliğe göre sıralanır — pişiren kişi nerede, hangi dilde konuşuyor, malzeme ve gereçler kayıtla uyuşuyor mu. Asla izlenme, beğeni ya da abone sayısına göre değil.',
    metricFilmedCaveat:
      'Sıralama geleneğe yakınlıkla ilgilidir, çekim kalitesiyle değil; en üstteki video çoğu zaman en özensiz görünenidir.',
    metricAssessedTitle:
      'Özgün olarak sınıflandırılmış',
    metricAssessedCounts:
      'Kanıt denetimleri sonucunda Özgün — yerel ya da Özgün — bölgesel düzeyine ulaşan kayıtlar.',
    metricAssessedMethod:
      'Yedi denetim; her biri yanıtlanır ya da açık bırakılır ve açık kalanlar varsayımla doldurulmak yerine güveni düşürür. Teknik ve topluluk doğrulaması bir içe aktarımdan asla çıkarsanmaz; bu da içe aktarılmış bir kaydın tek başına ulaşabileceği düzeye tavan koyar.',
    metricAssessedCaveat:
      'Buradaki oranın düşük olması dürüstlüktür, başarısızlık değil. Kataloğun çoğu içe aktarılmış ve değerlendirilmemiştir; o kayıtlara saygın bir kaynaktan geldikleri için özgün demek, tam da bu ölçeğin reddetmek için var olduğu kestirme yoldur.',
    metricConcentrationTitle:
      'Yoğunlaşma',
    metricConcentrationCounts:
      'Tüm kataloğun, en büyük tek ülkesine düşen payı.',
    metricConcentrationMethod:
      'En çok temsil edilen ülkedeki kayıtların toplama oranı.',
    metricConcentrationCaveat:
      'Bu, hangi ülkelerin açık gıda kayıtları tuttuğunu yansıtır; dünyanın yemeğinin nerede olduğunu değil. Yalnızca İtalya, tescilli geleneksel ürün olarak yaklaşık 4.400 kalem yayımlar; çoğu ülke hiç yayımlamaz ve buradaki yoklukları, mutfağın değil evrakın yokluğudur.',
    metricConfidenceTitle:
      'Güven',
    metricConfidenceCounts:
      'Kataloğun 0–100 kanıt puanı boyunca nasıl dağıldığı.',
    metricConfidenceMethod:
      'Derlenmiş kayıtlar kanıt denetimleriyle puanlanır. İçe aktarılanlar yalnızca zenginleştirmenin puanlanacak kanıt bulduğu yerde puanlanır; bunun dışında varsayılan bir değer verilmek yerine puansız bırakılır.',
    metricConfidenceCaveat:
      '"Puanlanmadı" açık ara en büyük dilimdir ve öyle kalacaktır. Bu, kaydı henüz kimsenin değerlendirmediği anlamına gelir — kötü puan aldığı ya da yemeğin şüpheli olduğu anlamına değil.',
    metricByContinentTitle:
      'Kayıtlar nerede',
    metricByContinentCounts:
      'Kıta başına kayıtlar; her kayıt bir kez sayılır. Bir gelenek, gelmiş olabileceği kıtaya değil, kayda geçtiği ülkenin kıtasına oturur.',
    metricByContinentMethod:
      'Her kaydın ülkesinden, tarihsel olanlar dahil yaklaşık 200 devleti kapsayan bir ülke-kıta eşlemesi üzerinden. Devletler üstü ve tartışmalı girdiler bir kıtaya zorlanmak yerine gruplanır.',
    metricByContinentCaveat:
      'Bu, kaynakların haritasıdır; dünyanın mutfağının değil. Avrupa önde, çünkü Avrupa kayıtları çevrimiçi ve açık — bu, arşivlerle ilgili bir olgudur.',
    howIsThisCounted:
      'Bu nasıl sayılıyor?',
    hideHowThisIsCounted:
      'Nasıl sayıldığını gizle',
    stapleGrains: 'Tahıllar',
    stapleRoots: 'Kökler',
    staplePulses: 'Baklagiller',
    stapleDairy: 'Süt ürünleri',
    stapleMeatFish: 'Et ve balık',
    stapleVegetables: 'Sebzeler',
    stapleAromatics: 'Baharatlıklar',
    stapleSweetSour: 'Tatlı ve ekşi',
    stapleRice: 'Pirinç',
    stapleWheat: 'Buğday',
    stapleMaize: 'Mısır',
    stapleMillet: 'Darı',
    stapleSorghum: 'Sorgum',
    stapleBarley: 'Arpa',
    stapleOats: 'Yulaf',
    stapleBuckwheat: 'Karabuğday',
    stapleTeff: 'Teff',
    staplePotato: 'Patates',
    stapleCassava: 'Manyok',
    stapleSweetPotato: 'Tatlı patates',
    stapleYam: 'Yam kökü',
    stapleTaro: 'Gölevez',
    staplePlantain: 'Yemeklik muz',
    stapleLentil: 'Mercimek',
    stapleChickpea: 'Nohut',
    stapleSoy: 'Soya',
    stapleTofu: 'Tofu',
    stapleBlackBean: 'Siyah fasulye',
    stapleMungBean: 'Maş fasulyesi',
    staplePigeonPea: 'Güvercin bezelyesi',
    stapleMilk: 'Süt',
    stapleYoghurt: 'Yoğurt',
    stapleCheese: 'Peynir',
    staplePaneer: 'Paneer',
    stapleGhee: 'Sadeyağ',
    stapleButter: 'Tereyağı',
    stapleCoconut: 'Hindistan cevizi',
    stapleChicken: 'Tavuk',
    stapleBeef: 'Sığır eti',
    staplePork: 'Domuz eti',
    stapleLamb: 'Kuzu',
    stapleGoat: 'Keçi',
    stapleFish: 'Balık',
    staplePrawn: 'Karides',
    stapleEgg: 'Yumurta',
    stapleOnion: 'Soğan',
    stapleGarlic: 'Sarımsak',
    stapleGinger: 'Zencefil',
    stapleChilli: 'Acı biber',
    stapleLemongrass: 'Limon otu',
    stapleTomato: 'Domates',
    stapleAubergine: 'Patlıcan',
    stapleCabbage: 'Lahana',
    stapleSpinach: 'Ispanak',
    stapleOkra: 'Bamya',
    stapleTamarind: 'Demirhindi',
    stapleHoney: 'Bal',
    stapleJaggery: 'Jaggery',
    stapleDate: 'Hurma',
    stapleLemon: 'Limon',
    stapleOlive: 'Zeytin',
    dietVegan: 'Vegan',
    dietVegetarian: 'Vejetaryen',
    dietSeafood: 'Deniz ürünleri',
    dietMeat: 'Vejetaryen değil',
    dietUnclassified: 'Sınıflandırılmamış',
    dietPoultry: 'Kümes hayvanı',
    dietPork: 'Domuz eti',
    dietBeef: 'Sığır ve kırmızı et',
    dietLambGoat: 'Kuzu ve keçi',
    dietGame: 'Av eti',
    dietFish: 'Balık',
    dietShellfish: 'Kabuklu deniz ürünleri',
    dietOtherSeafood: 'Diğer deniz ürünleri',
    dietDairy: 'Süt ürünü içerir',
    dietEgg: 'Yumurta içerir',
    dietHoney: 'Bal içerir',
    mealBreakfast: 'Kahvaltı',
    mealLunch: 'Öğle yemeği',
    mealDinner: 'Akşam yemeği',
    mealSupper: 'Gece yemeği',
    mealSnack: 'Atıştırmalık',
    mealStreetFood: 'Sokak yemeği',
    mealCelebration: 'Kutlama ve ziyafet',
    mealAnytime: 'Her zaman',
    mealUnclassified: 'Kaydedilmemiş',
    searchModeFind:
      'Bir yemek bul',
    searchModePantry:
      'Evdekilerle pişir',
    ingredientsYouHave:
      'Elinizdeki malzemeler',
    nTraditions:
      '{n} gelenek',
    nothingYet:
      'Henüz bir şey yok',
    methodRecorded:
      ' · yapılışı kayıtlı',
    noMethodYet:
      ' · henüz yapılışı yok',
    showMoreLeft:
      'Daha fazla göster — {n} kaldı',
    showNMore:
      '{n} tane daha göster',
    methodAsPublished:
      'Yayımlandığı hâliyle yapılışı. Modern gereçler ve kestirmeler de bunun parçası.',
    methodTraditional:
      'Geleneksel yapılışı; yerine konmuş modern kestirmeler yok.',
    everythingClassified:
      '{what} olarak sınıflandırılan her şey',
    everythingFrom:
      '{place} kökenli her şey',
    everythingRecordedAs:
      '{what} olarak kaydedilen her şey',
    everythingMadeWith:
      '{ingredient} ile yapılan her şey',
    seeEverything:
      '{label} — hepsini gör',
    noPhotographOnRecord:
      '{label} — kayıtta fotoğraf yok',
    scoreOutOf100:
      '{label}: 100 üzerinden {value}',
    removeFilter:
      '{key} süzgecini kaldır',
    anywhereInTheAtlas:
      ' atlasın herhangi bir yerinde',
    absenceOfRecords:
      '. Bu, kayıt yokluğudur; yemek yokluğu değil — bilmediğimizi söylemeyi yeğleriz.',
    narrowToA:
      '{level} düzeyine indir · {n} kayıtlı',
    fromTheTown:
      ' — kasabanın kendisinden',
    showFewer:
      'Daha az göster',
    readAboutOnWikipedia:
      '{name} hakkında {language} Vikipedi’de okuyun',
    languageChangeIt:
      'Dil: {language}. Değiştir.',
    perCentTranslated:
      '{language}, yüzde {n} çevrildi',
    translateThisRecord:
      'Bu kaydı çevir',
    translating:
      'Çevriliyor…',
    translate:
      'Çevir',
    translateThisConfirmation:
      'Bu doğrulamayı {language} diline çevir',
    couldNotTranslate:
      'Çevrilemedi — yeniden deneyin',
    howThisIsCountedFor:
      '{figure} nasıl sayılıyor',
    countOfTotal:
      '{label}: {total} içinde {count}',
    watchAtSourceCreator:
      '{creator} içeriğini kaynağında izleyin',
    stillFromCreator:
      '{creator} videosundan bir kare',
    thatDidNotSend:
      'Bu gönderilemedi.',
    containsAlcohol:
      'Alkol içerir',
    nothingElseRequired:
      'Geri kalan her şey memnuniyetle karşılanır ve hiçbiri zorunlu değil — bir yemeğin nereden geldiğini ve kimsenin bunu yazmadığını bilmek, buradaki herhangi bir kaynağın elindekinden zaten fazlasıdır.',
    opensTheFormPrefilled:
      'Formu, yazdıklarınız önceden doldurulmuş hâlde kendi kaynağında açar. Bu uygulama sizinle ilgili hiçbir şey toplamaz ve oradan insanlar doğrulayana kadar hiçbir şey yayımlanmaz.',
    scoreDimGeographic:
      'Coğrafi bağ',
    scoreDimIngredients:
      'Geleneksel malzemeler',
    scoreDimTechnique:
      'Geleneksel teknik',
    scoreDimLocalSource:
      'Yerel kaynak',
    scoreDimDocumentation:
      'Kültürel belge',
    scoreDimCommunity:
      'Topluluk doğrulaması',
    photoFromWikidata:
      'Bu yemeğin kendi Wikidata kaydına eklenmiş — adla bulunmuş değil',
    photoFromArticle:
      'Bu yemeğin kendi ansiklopedi maddesinin ana görseli',
    photoFromRecipe:
      'Bu tarifin kendi sayfasında yayımlanmış',
    photoFromSearch:
      'Wikimedia Commons’ta adla bulunmuş — konusu doğrulanmadı',
    photoFromUnknown:
      'Kaynağı kaydedilmemiş — konusunu doğrulanmamış sayın',
    noTranslationRecorded:
      'Bu anlatının henüz kaydedilmiş bir çevirisi yok; bu yüzden belgelendiği dil olan {language} dilinde gösteriliyor. Size bir makinenin mayalanma süresi hakkındaki tahminini göstermektense aslını göstermeyi yeğleriz.',
    machineTranslationBy:
      '{translator} tarafından makine çevirisi. Topluluktan kimse denetlemedi — malzeme ve gereç adları aslında bırakılmıştır.',
    translatedBy:
      '{translator} tarafından çevrildi. Malzeme ve gereç adları aslında bırakılmıştır.',
    videoOriginalAudio:
      '{language} konuşuluyor — pişiren kişinin kendi dili. Hiçbir şey çevrilmiyor.',
    videoCreatorTrack:
      'Videoyu yapan kişi {language} dilinde bir ses parçası yayımlamış. Kaynağında o parçayla açılıyor — çeviri ona ait, bize değil.',
    videoPlatformCaptions:
      '{spoken} konuşuluyor. Özgün sesin üzerine makineyle çevrilmiş {preferred} altyazılarla açılıyor — pişiren kişinin sesi değiştirilmiyor ve çeviri video platformuna ait, bir insana değil.',
    videoLanguageUnknown:
      'Bu videonun konuşulan dili kayıtlarımızda yok, bu yüzden {language} sözü veremeyiz. Kaynağında açılır; orada platformun kendi altyazı seçenekleri geçerlidir.',
    figureDocumented:
      'Kayıtlı bir yapılışı var',
    figureDocumentedNote:
      'Bunun bir atlas mı yoksa bir ad listesi mi olduğunu söyleyen sayı. Geri kalan her şey ona göre ikincildir.',
    figureLocated:
      'Ülke düzeyinin altında konumlanmış',
    figureLocatedNote:
      'Özgünlüğün coğrafi derinliği vardır. “Kozhikode” bir kayıttır; “Hindistan” ancak bir başlangıçtır.',
    figureIllustrated:
      'Fotoğrafı var',
    figureIllustratedNote:
      'Kimsenin gözünde canlandıramadığı bir yemeği önemsemek de tanımak da zordur.',
    figureFilmed:
      'Sıralanmış videosu var',
    figureFilmedNote:
      'Pişiren kişinin geleneğe yakınlığına göre sıralanır — arama sonucu değildir.',
    figureAssessed:
      'Özgün olarak sınıflandırılmış',
    figureAssessedNote:
      'Kanıt denetimleriyle kazanılır. Buradaki oranın düşük olması dürüstlüktür, başarısızlık değil.',
    atlasSummary:
      '{c} ülkeden {n} gelenek kayda geçti. Kapsam dürüstçe belirtilir: burada olmayan bir ülkenin henüz kaydı yoktur, kaydedecek şeyi yok demek değildir.',
    nothingRecorded:
      'Kayıt yok',
    nothingRecordedAs:
      '{what} olarak kayıt yok',
    nothingRecordedAsAnd:
      '{list} ve {last} olarak kayıt yok',
    photoVia:
      'fotoğraf:',
    photoNothingEntered:
      'Henüz bir şey girilmedi.',
    photoNothingEnteredFix:
      'Commons dosya adını ya da dosya sayfasının bağlantısını yapıştırın.',
    photoWrongHost:
      'Bu bağlantı {host} adresine gidiyor ve oradan bir fotoğrafı yayımlama hakkımız yok.',
    photoWrongHostFix:
      'Fotoğraf sizinse, onu özgür bir lisansla Wikimedia Commons’a yükleyin ve dosya adını buraya yapıştırın. Sizin kalır, göründüğü her yerde adınız yazılır ve hiçbir şeye mal olmaz.',
    photoNotCommons:
      'Bu bağlantı Wikimedia Commons’ta değil.',
    photoNotCommonsFix:
      'Burada yalnızca Commons dosyaları yayımlanabilir, çünkü göstermemize izin veren lisans yalnızca onlarda var.',
    photoNoFileName:
      'Bunun içinde bir dosya adı bulunamadı.',
    photoNoFileNameFix:
      'Dosya adını yapıştırın, örneğin Kaipola.jpg.',
    photoNotAPhotograph:
      'Bu bir fotoğraf dosyası değil.',
    photoNotAPhotographFix:
      'Commons fotoğrafları .jpg, .png ya da .webp ile biter. Şemalar ve logolar burada kullanılmaz.',
    photoIsADrawing:
      'Bu bir çizim, fotoğraf değil.',
    photoIsADrawingFix:
      'Yemeğin yapıldığı hâliyle bir fotoğrafını kullanın.',
    serverRefused:
      'Sunucu bunu geri çevirdi ({status}).',
    serverTookTooLong:
      'Sunucu yanıt vermekte fazla gecikti.',
    couldNotReachServer:
      'Sunucuya ulaşılamadı.',
    nothingYouTypedIsLost:
      '{message} Girdiğiniz gönderilmedi — yazdıklarınızdan hiçbiri kaybolmadı, birazdan yeniden deneyin.',
    proposalsNotOpen:
      'Gönderiler henüz açık değil.',
    confirmationsNotOpen:
      'Doğrulamalar henüz açık değil.',
    alreadyProposed:
      'Bu yemek daha önce gönderilmiş. Onu açıp doğrulayın — asıl ilerleten budur.',
    alreadyConfirmed:
      'Bunu zaten doğruladınız.',
    youProposedThis:
      'Bu yemeği siz gönderdiniz, bu yüzden başka birinin doğrulaması gerekir.',
    stillNeededList:
      'Hâlâ gereken: {list}.',
    listAnd:
      '{list} ve {last}',
    listOr:
      '{list} ya da {last}',
    proposalConfirmed:
      'Doğrulandı. Bir sonraki güncellemede atlasa girer.',
    proposalNobodyYet:
      'Bunu henüz kimse doğrulamadı. Yemeği bilen {n} kişi onu atlasa sokardı.',
    proposalSoFar:
      '{n} doğrulamadan {have} tanesi tamam. Yemeği bilenlerden {short} tane daha onu içeri alırdı.',
    recordNobodyYet:
      'Oradan bunu henüz kimse doğrulamadı. {n} doğrulama bunu özgün kılardı.',
    recordSoFar:
      '{n} doğrulamadan {have} tanesi tamam. Yemeği bilenlerden {short} tane daha bunu özgün kılardı.',
    atRiskNote:
      'Bir kaynak bu geleneği gerilemekte diye tanımladığı için işaretlendi — o cümle kayıtla birlikte gösterilir. Ne kadar az belgelediğimizden asla çıkarsanmaz: kayıtlarımızdaki bir boşluk, kimsenin pişirmeyi bıraktığının kanıtı değildir.',
    originDisclaimer:
      'Bu yemeğin belgelenmiş birden çok tarihsel iddiası var. Aşağıdaki gelenekler, her yerin anlattığı gibi, kaynaklarıyla birlikte kaydedilmiştir. Burada hiçbir iddia kazanan olarak sunulmaz ve bunların hiçbiri özgünlük puanını etkilemez — o puan, yemeğin bir yerde nasıl yapıldığını ölçer, onu ilk kimin yaptığını değil.',
    supportRunsOn:
      'Atlastaki her şey Vikipedi, Wikidata, Wikimedia Commons, Wikibooks ve açık bölgesel kayıtlardan gelir. Okunması serbesttir, açık lisanslıdır ve onları kullanan her kayıtta adı geçer. Projenin ücretsiz kalmasının bütün dayanağı budur ve bu bir karardır, bir aşama değil.',
    contributeToTheAtlas:
      'Atlasa katkıda bulunun',
    answeredByDocuments:
      'Bunları belgeler yanıtlayabilir',
    answeredByPeople:
      'Bunları yalnızca insanlar yanıtlayabilir',
    scaleDocumentsStop:
      'belgeler burada biter',
    scaleAuthenticBegins:
      'Özgün burada başlar',
    pantryNothingUses:
      'Kayıtlı hiçbir şey {list} kullanmıyor. Bunu kullanan bir yemeği kimsenin yazmamış olması da olabilir — atlasın {p}% kadarında hiçbir malzeme yazılı değil.',
    alsoRecordedIn:
      'Şurada da kayıtlı: {list}',
    alsoRecordedNote:
      'Atlas bu yemek için orada ayrı bir kayıt tutuyor. Hiçbiri diğerini düzeltmiyor; iki mutfak kültürünün yaptığı bir yemek ikisinde de hata değildir.',
    chooseACountry:
      'Bir ülke seçin',
    filterTheList:
      'Listeyi daraltmak için yazın',
    showingFirstNOfM:
      '{m} içinden ilk {n} gösteriliyor. Daraltmak için yazmaya devam edin.',
    nothingMatchesThat:
      'Listede bununla eşleşen bir şey yok.',
    continentBeyondOneCountry:
      'Tek bir ülkenin ötesinde',
    beyondOneCountryNote:
      'Kaynakların tek bir ülkeden geniş kaydettiği kökenler: bir bölge, ortak bir mutfak alanı ya da artık var olmayan bir devlet. Kimsenin seçmediği bir ülkeye daraltılmak yerine kaynağın belirttiği hâliyle korunuyorlar.',
    connectionGrewUpThere:
      'Orada büyüdüm',
    connectionLiveThere:
      'Orada yaşıyorum',
    connectionFamilyFrom:
      'Ailem oralı',
    connectionLearnedThere:
      'Yapmayı orada öğrendim',
    connectionCookProfessionally:
      'Orada meslek olarak pişiriyorum',
    chooseYourConnection:
      'Size uyanı seçin',
    connectionInYourWords:
      'Eklemek istediğiniz her şey, kendi sözlerinizle',
    connectionDetailPlaceholder:
      'Babaannem her Ramazan Bayramı Kozhikode’de yapardı',
    dictateSpeak:
      'Yazmak yerine konuş',
    dictateListening:
      'Dinliyor — durdurmak için dokunun',
    dictateStop:
      'Dinlemeyi durdur',
    dictateSendsAudio:
      'Dinlemeyi tarayıcınız yapar ve çoğu bunun için sesi kendi sunucularına gönderir. Söyledikleriniz yukarıdaki kutuya eklenir, orada düzeltebilirsiniz.',
    dictateNotAllowed:
      'Tarayıcı mikrofon için izin vermedi.',
    dictateDidNotWork:
      'Bu işe yaramadı. Yine de yazabilirsiniz.',
    polishTidyThis:
      'Yazımımı düzelt',
    polishWorking:
      'Düzeltiliyor…',
    polishMachineMade:
      'Makine önerisi — sizin sözleriniz yukarıda duruyor',
    polishUseThis:
      'Bunu kullan',
    polishKeepMine:
      'Benimki kalsın',
    polishOnlyTyping:
      'Yalnızca yazım, noktalama ve boşluklara dokunulur. Hiçbir şey eklenmez, çıkarılmaz, yeniden ifade edilmez ve hiçbir isim değiştirilmez.',
    polishFoundNothing:
      'Düzeltilecek bir şey yok — yazdığınız iyi okunuyor.',
    polishDidNotWork:
      'Bu işe yaramadı. Yazdığınız değişmedi.',
    continentAfrica:
      'Afrika',
    continentAsia:
      'Asya',
    continentEurope:
      'Avrupa',
    continentNorthAmerica:
      'Kuzey Amerika',
    continentSouthAmerica:
      'Güney Amerika',
    continentOceania:
      'Okyanusya',
    regionLevant:
      'Levant',
    regionLatinAmerica:
      'Latin Amerika',
    regionMiddleEast:
      'Orta Doğu',
    regionMaghreb:
      'Mağrip',
    regionCentralEurope:
      'Orta Avrupa',
    regionEasternEurope:
      'Doğu Avrupa',
    regionSouthernEurope:
      'Güney Avrupa',
    regionCentralAsia:
      'Orta Asya',
    regionIndianSubcontinent:
      'Hint alt kıtası',
    regionNorthAfrica:
      'Kuzey Afrika',
    regionAmericas:
      'Amerika kıtası',
    regionAncientNearEast:
      'Eski Yakın Doğu',
    regionBalkans:
      'Balkanlar',
    regionCaribbean:
      'Karayipler',
    regionLowCountries:
      'Aşağı Ülkeler',
    regionMesoamerica:
      'Mezoamerika',
    regionMiddleEasternEmpires:
      'Orta Doğu imparatorlukları',
    regionPolishLithuanianCommonwealth:
      'Lehistan–Litvanya Birliği',
    regionQajarIran:
      'Kaçar İranı',
    regionRussianEmpire:
      'Rus İmparatorluğu',
    regionSouthCaucasus:
      'Güney Kafkasya',
    regionSovietCentralAsia:
      'Sovyet Orta Asyası',
    regionWu:
      'Wu',
    regionArtsakh:
      'Artsah Cumhuriyeti',
    refineDietOccasion:
      'Beslenme ve vesile',
    refineAny:
      'Tümü',
    placeKindWiderRegion:
      'geniş bölge',
    placeKindFormerState:
      'tarihi devlet',
    oneTradition:
      '1 gelenek',
    onePlace:
      '1 yer',
    nPlaces:
      '{n} yer',
    countryLevelOnly:
      'yalnızca ülke düzeyinde',
    summaryWorldwide:
      ' dünya genelinde',
    nRecorded:
      '{n} kayıt',
    writtenInLanguage:
      '{language} dilinde yazılmış',
    whatThisIs:
      'Bu nedir',
    atlasDefinition:
      'Geleneksel yemeklerin ücretsiz atlası — her birinin nereden geldiği ve kimin kefil olduğu.',
    traditionsLabel:
      'gelenek',
    freeNoAds:
      'Ücretsiz, reklamsız',
    quotedFromSource:
      'Aşağıdaki kaynaktan alıntı — yemeğin nasıl yapıldığına dair genel bir anlatım, {place} içinde nasıl yapıldığının kaydı değil.',
    adaptationLeadIn:
      'Bu yemeğin bugün yaygın olarak nasıl yapıldığı. {place} içinde nasıl hazırlandığının kaydı değildir ve oradan kimse doğrulamamıştır.',
    openDisagreementBody:
      '{place} içinde bunu pişiren biri farklı yapıldığını söylüyor: {differs} İnceleme sürerken hiçbir şey kaldırılmadı ve aşağıdaki güven değeri değişmedi — iki anlatım da geçerliyse kayıt biri diğerini geçersiz kılmak yerine ikiye ayrılır.',
    engagementNotShown:
      'İzlenme sayıları bilerek gösterilmiyor: özgünlüğü ölçmezler.',
    videoSearchNote:
      'Kaynakta arayabilirsiniz. Sonuçlar izlenme sayısına göre sıralı gelir; bu yalnızca erişimi ölçer — pişiren kişi {place} içinden olabilir de olmayabilir de. Böyle bulunan hiçbir şey bu kaydın sınıflandırmasını etkilemez.',
    nowOpenForConfirmation:
      '{name} artık doğrulamaya açık.',
    proposalOpenBody:
      'Yemeği bilen {n} kişinin doğrulaması gerekiyor; ancak ondan sonra atlasa girer. Bundan sonra herkes onu görebilir ve doğrulayabilir — anlattığınız kişiler dahil, ki kimsenin yazmadığı bir yemek genellikle böyle doğrulanır.',
    nothingMatchesBody:
      'Atlasta henüz {query} ile eşleşen bir şey yok. Buradaki yokluk kayıt yok demektir, yemek yok demek değil — tahmin etmektense bilmediğimizi söylemeyi tercih ederiz.',
    thatWord:
      'bunu',
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
      'Традиций: {n}, и все они собраны из источников, свободных для чтения и с открытой лицензией. Ни рекламы, ни слежки, ничего за плату. То, чего требует работа проекта, покрывает именно этот выбор источников, а не чья-то плата за присутствие здесь.',
    notForSaleAuthentic:
      'Запись нельзя сделать подлинной, заплатив за это. Подлинность идёт от свидетельств и от людей, которые готовят это блюдо.',
    notForSalePromotion:
      'Ни одно блюдо не продвигается, не поднимается выше и не выделяется потому, что кто-то заплатил.',
    notForSaleAdvertising:
      'Здесь нет рекламы, и ни за одним читателем не следят.',
    donationFootnote:
      'Откроется на Open Collective. Здесь ничего не принимается — приложение не хранит ваших платёжных данных и не будет.',
    donationsPendingBody:
      'Отправлять деньги пока некуда. Ничто в атласе от этого не зависит — он построен на источниках, свободных для чтения, и это не меняется.',
    mostUsefulThing:
      'Самое полезное, что можно дать этому атласу, — не деньги. Большая его часть — это название и место, потому что никто не записал, как эту еду готовят.',
    administration:
      'Администрирование',
    administrationNote:
      'Пороги, модерация, проверка источников и использование. Нужен токен.',
    howLead:
      'Это правило, на котором построен атлас, и это арифметика, а не политика — значит, его можно проверить, а не принимать на веру.',
    sixDimensionsBody:
      'Каждая запись оценивается по одним и тем же шести измерениям, и все шесть напечатаны на самой записи. Оценка — их среднее, так что сомневающийся может сложить числа сам.',
    ceilingBody:
      'На три из этих шести не ответит ни один когда-либо написанный документ. Ни одна энциклопедия не знает, является ли способ приготовления способом данного места; ни один реестр не человек из этого посёлка. При этих трёх пустых максимум, который запись может набрать на одних опубликованных источниках, — {ceiling}.',
    thresholdBody:
      'Запись называется подлинной начиная с {threshold}. Расстояние между этими двумя числами задумано намеренно, и в нём весь смысл: закрыть его могут только люди, которые знают это блюдо.',
    whatClosesItBody:
      '{n} подтверждений от людей, которые называют свою связь с этим местом, — и говорят, что именно они подтверждают, а не просто что одобряют. И то и другое показано на записи, потому что фраза вроде «родился в Кожикоде — мы берём гхи, а не масло» — это свидетельство, которое можно взвесить, а «{n} подтверждения» — число, которому приходится верить.',
    accountsBody:
      'Эти {n} должны быть {n} разными людьми, поэтому подтверждение засчитывается к значку только если человек вошёл в систему. Анонимное всё равно записывается и показывается на записи — то, что человек знает, стоит сохранить, есть у него учётная запись или нет, — просто оно не двигает число. Чтобы читать атлас, вход не нужен никогда.',
    whichIsWhereYouComeInBody:
      'За большую часть атласа не говорит никто. Если вы знаете, как готовят блюдо там, откуда вы, — это единственное, чего не даст ни один источник и до чего не дотянется никакой сбор данных.',
    notRatings:
      'Никаких оценок. Никто не ставит блюду баллы.',
    notComments:
      'Никаких комментариев и никакой ленты. Здесь не с чем взаимодействовать.',
    notAlgorithm:
      'Никакой алгоритм не решает, что вы видите. Порядок — это свидетельства, и вы можете его изменить.',
    notAdvertising:
      'Никакой рекламы, и ни за одним читателем не следят.',
    notPopularity:
      'Популярность записывается и держится отдельно. Самая публикуемая версия блюда никогда не становится подлинной.',
    dimensionOrigin:
      'Откуда блюдо и насколько точно. Город весомее страны.',
    dimensionIngredients:
      'Из чего оно сделано — так, как делает традиция.',
    dimensionTechnique:
      'Как его готовят — не то, что кто-то опубликовал рецепт, а то, что это способ данного места.',
    dimensionLocalSource:
      'Кто-то с заявленной связью с этим местом высказался за него.',
    dimensionDocumentation:
      'Реестр, запись в списке или энциклопедия это зафиксировали.',
    dimensionCommunity:
      'Люди оттуда подтвердили это и сказали, что именно подтверждают.',
    fromDocuments:
      'документы могут',
    fromPeople:
      'только люди',
    contributeLead:
      'Запишите так, как это делают там, где вы находитесь. Из одной этой формы ничего не публикуется — сначала идёт оценка и подтверждение сообществом.',
    writeItTheWayYouWriteIt:
      'Пишите название блюда так, как пишете его вы',
    editorialRuleBody:
      'Правьте наш текст свободно — орфографию, грамматику, всё, что плохо читается. Само блюдо не правьте. Название блюда, ингредиент, посуда и место остаются ровно такими, как их пишут те, кто это готовит, со всеми знаками. Если два написания расходятся, это обычно две общины, а не ошибка, и сохраняются оба.',
    photographTitle:
      'Фотография, если она у вас есть',
    photographBody:
      'Опубликуйте свою фотографию на Wikimedia Commons, а затем вставьте сюда имя файла. Она остаётся вашей, ваше имя указано везде, где она появляется, и это ничего не стоит ни вам, ни нам. Взять фотографию из Instagram или TikTok мы не можем — там она принадлежит автору по авторскому праву, а строка с указанием имени — не разрешение.',
    walkthroughNoteBody:
      'Ниже — разобранный пример того, что происходит с присланной записью: находки, проверки и черновая оценка взяты из записи, которая уже есть в атласе, а не из того, что вы только что набрали. Ваша запись здесь не оценивается; её оценивают люди, после отправки.',
    examplePreparedBy:
      'Дома Малабара, готовят на ифтар и к семейным поводам',
    exampleConnection:
      'Родился в Кожикоде и готовлю там',
    exampleIngredients:
      'Спелый банан нендран, яйца, топлёное масло гхи, сахар, кешью, изюм; готовится в тяжёлой сковороде на слабом угольном или газовом огне, под крышкой, придавленной углями',
    shelfFromCountry:
      'Из страны {country}',
    shelfFromCountryNote:
      'То, что атлас содержит по стране {country}. Точность именно здесь для вас важнее, чем где бы то ни было: вы можете судить, верно ли это.',
    sending:
      'Отправляется…',
    missionHeadline:
      'Каждое блюдо здесь показывает свои доказательства.',
    missionStakes:
      'Откуда оно, кто это утверждает и что на самом деле установлено — напечатано на каждой записи и доступно для проверки любому, кто сомневается.',
    statDishes:
      'блюд',
    statCountries:
      'стран',
    statDocumented:
      'задокументировано',
    statRegistered:
      'внесено в реестр',
    statAuthentic:
      'подлинных',
    missionAsk:
      'У {n} из них не записан ни один способ приготовления. {people} человека из того места могут закрыть один раз и навсегда.',
    missionAskBody:
      'Никто не записал, как их готовят, — ни по-английски, ни на одном языке, нигде, куда дотягивается машина. Ни архив, ни энциклопедия и ничто автоматическое не подтвердит их вместо людей; это арифметика оценки, а не правило. Если вы готовите такое блюдо, вы единственный, кто может.',
    recordADishYouKnow:
      'Запишите блюдо, которое знаете',
    howItGetsAuthenticated:
      'Как блюдо подтверждают',
    submissionsNotOpen:
      'Приём пока не открыт — отправлять некуда. Путь выше объясняет, что произойдёт, когда откроется.',
    freeAndStayingFree:
      'Бесплатно и останется бесплатным. Без рекламы, без слежки, без сбора денег. Учётная запись нужна только чтобы подтвердить блюдо — никогда чтобы прочитать о нём.',
    noRatingsNoComments:
      'Ни оценок, ни комментариев, ни алгоритма, решающего, что вам показать: списки начинаются с доказательств, а не с популярности. Открытия считаются как блюдо и дата, никогда как человек.',
    whyASourceCannot:
      'Почему источник не может подтвердить блюдо',
    whyASourceCannotBody:
      'Опубликованные материалы здесь не могут набрать больше {ceiling}, а Подлинной запись становится с {threshold}. Этот разрыв закрывают только люди, связанные с местом. Шесть чисел, из которых складывается каждая оценка, напечатаны на записи, так что усомнившийся может сложить их сам.',
    whyTheAtlasStops:
      'По той же причине атлас кончается там, где кончается. Прочитан каждый свободный источник — энциклопедии, кулинарные книги, реестры наследия, географические словари, — и у {n} записей по-прежнему нет ничего о том, как их готовят. То, что осталось, никогда не было записано.',
    levelLocal:
      'Подлинное — местное',
    levelLocalFull:
      'Подлинное — местное/традиционное',
    levelRegional:
      'Подлинное — региональное',
    levelVariation:
      'Традиционный вариант',
    levelAdaptation:
      'Современная адаптация',
    levelFusion:
      'Фьюжн',
    levelUnverified:
      'Не проверено',
    levelUnverifiedFull:
      'Не проверено — недостаточно данных',
    filterAuthenticOnly:
      'Только подлинные',
    filterTraditionalVariations:
      'Традиционные варианты',
    filterModernAdaptations:
      'Современные адаптации',
    filterFusion:
      'Фьюжн',
    filterUnverified:
      'Непроверенные',
    filterAll:
      'Все',
    geoCountry:
      'страна',
    geoRegion:
      'регион',
    geoProvince:
      'провинция или район',
    geoCity:
      'город или посёлок',
    geoVillage:
      'село или община',
    chooseRegion:
      'Выберите регион',
    chooseProvince:
      'Выберите провинцию или район',
    chooseCity:
      'Выберите город или посёлок',
    chooseVillage:
      'Выберите село или общину',
    typeToSearchLevel:
      'Начните вводить…',
    browseAllTraditions:
      'Посмотреть все традиции: {n}',
    geoPlace:
      'место',
    noLevelRecorded:
      'Под таким названием пока нет ни одного объекта уровня «{level}». Отсутствие здесь означает отсутствие записи, а не блюда.',
    browseCuisine:
      'кухня: {cuisine}',
    browseMadeWith:
      'с ингредиентом {ingredient}',
    browseEverything:
      'Всё',
    within:
      'Внутри: {path}',
    chooseCountryHint:
      'Выберите страну · записано: {c}',
    chooseCountryHintBroader:
      'Выберите страну · записано: {c}, и ещё {b} более широких источников',
    noRecordUnderThatReference:
      'В атласе ничего не записано под этой ссылкой. Отсутствие здесь означает отсутствие записи, а не блюда.',
    tagTraditionalPreparation:
      '🏺 Традиционное приготовление',
    tagAtRiskTradition:
      '🕯️ Традиция под угрозой',
    notEligibleForAuthentic:
      'Не может претендовать на статус подлинного',
    lookingForWhatItBorrows:
      'Ищете традицию, у которой это заимствовано?',
    howItsDescribed:
      'Как это описывают',
    howItsMade:
      'Как это готовят',
    originAndAttribution:
      'Происхождение и культурная принадлежность',
    nobodyRecordedTechnique:
      'Технику никто не записал — время, посуду, порядок действий. Именно это вывело бы запись из Не проверено, и для этого нужен человек, который это готовит.',
    nobodyHasRecorded:
      'Никто не записал, как готовят {dish}{place}. Мы могли бы скопировать самый растиражированный рецепт из интернета и назвать его подлинным, но именно ради того, чтобы этого не делать, атлас и существует, — поэтому запись остаётся как есть, пока её не заполнит тот, кто это готовит. Если это сделаете вы, вы будете первым человеком, который это записал.',
    ifIngredientUnavailable:
      'Если традиционного ингредиента не достать',
    commonModernSubstitute:
      'Обычная современная замена: ',
    adaptationNotAuthentic:
      'Это адаптация, и её не следует считать подлинным приготовлением.',
    whatTheInternetServes:
      'То, что интернет чаще всего подаёт под этим названием, и чем оно расходится с традицией выше.',
    popularNotAuthentic:
      'Популярно, но это не подлинное приготовление. Ориентиром остаётся версия выше.',
    videosRankedByCloseness:
      'Настоящие видео, упорядоченные по тому, насколько готовящий близок к традиции, а не по числу просмотров.',
    stillFramesFromVideos:
      'Кадры взяты из самих видео, так что блюдо, которое вы видите, — это блюдо, которое приготовил тот человек.',
    noVideoRecordedYet:
      'Для этого блюда пока не записано ни одного видео из традиции.',
    findOneFromThePlace:
      'Если вы найдёте видео, снятое человеком оттуда, его можно добавить через Добавить традицию — именно это дало бы блюду упорядоченное видео.',
    siblingsNeitherIsReal:
      'То же блюдо, записанное отдельно там, где его готовят иначе. Ни одно из них не является настоящим.',
    doYouKnow:
      'Вы знаете {subject}?',
    confirmWhatYouKnow:
      'Подтвердите то, что вы действительно знаете. Ручаться за всю запись не нужно: одна конкретная вещь от человека, который это готовит, весит больше, чем общее согласие.',
    recordedThankYou:
      'Записано. Спасибо.',
    shownWithYourConnection:
      'Это показывается в записи вместе с вашей связью с местом, чтобы читатель мог взвесить сам.',
    signedInCounts:
      'Вы вошли — это будет засчитано к знаку.',
    notSignedInNote:
      'Вы не вошли. Написанное вами появится в записи вместе с вашей связью с местом, но знак не сдвинет: этот счёт растёт только за счёт вошедших, чтобы один человек не мог быть тремя.',
    signInSoItCounts:
      'Войдите, чтобы это засчиталось',
    shownOnTheRecord:
      'Показывается в записи',
    whatCanYouConfirm:
      'Что вы можете подтвердить?',
    exampleSaid:
      'Мы кладём гхи, а не масло, и делают это на Ид, а не круглый год.',
    fromTheTownItself:
      'Я из самого города или села, а не только из более широкого региона',
    fromTheTownItselfLabel:
      'Я из самого города или села, а не из более широкого региона',
    exampleWhoMakesIt:
      'Готовят дома на Ид, бабушки — необязательно',
    exampleIngredientLines:
      'спелый плантан\nяйцо\nгхи',
    exampleMethodLines:
      'Разомните плантан.\nВмешайте взбитое яйцо.',
    inPlace:
      ' в месте {place}',
    tagAtRiskShort:
      '🕯️ Под угрозой',
    readThisIn:
      'Читать на',
    communityTranslation:
      'Перевод сообщества',
    machineTranslation:
      'Машинный перевод — пока никем из сообщества не проверен',
    notTranslatedYet:
      'Ещё не переведено',
    aDotMarks:
      'Точка отмечает язык, на который эта запись уже переведена.',
    opensOnceMoreRecords:
      '{language} откроется, когда на нём можно будет прочесть ещё {n} записей.',
    noTranslationService:
      'К этой сборке не подключён сервис перевода, поэтому автоматически ничего перевести нельзя. Перевод от того, кто готовит это блюдо, всё равно ценнее — его можно передать через Добавить традицию.',
    whatTheseTermsMean:
      'Что означают эти слова',
    signedIn:
      'Вы вошли',
    signOut:
      'Выйти',
    signedInSignOut:
      'Вы вошли. Выйти.',
    confirmationsCount:
      'Ваши подтверждения засчитываются к знаку.',
    signIn:
      'Войти',
    signInSoConfirmationsCount:
      'Войдите, чтобы ваши подтверждения засчитывались',
    onlySignedInMovesBadge:
      'Знак сдвигают только подтверждения от вошедших.',
    watchAtSource:
      'Смотреть в источнике ↗',
    originalAudio:
      'Оригинальный звук',
    creatorsOwnTranslation:
      'Перевод самого автора',
    translatedCaptions:
      'Переведённые субтитры',
    languageUnknown:
      'Язык неизвестен',
    ingredientsInThisVideo:
      'Ингредиенты в этом видео',
    weDontInventOne:
      'Автор этого видео не опубликовал ни списка ингредиентов, ни письменного способа, а мы их не выдумываем. Традиционный способ выше взят из документированных источников ниже.',
    captureFromVideo:
      'Записать ингредиенты и шаги из этого видео →',
    dietaryPreference:
      'Пищевые предпочтения',
    narrowItDown:
      'Уточнить',
    anyDiet:
      'Любое питание',
    whenItsEaten:
      'Когда это едят',
    anyOccasion:
      'Любой повод',
    alsoCalled:
      'Также называется',
    notATranslationOfOurs:
      'Каждое — это название из энциклопедической статьи на том языке, а не наш перевод, и оно никогда не заменяет название выше. Нажмите на любое, чтобы прочесть его там.',
    relatedTraditions:
      'Связанные традиции',
    relatedTraditionsNote:
      'Записи, у которых с этой общее место, традиция или ингредиент. Каждая говорит, что именно.',
    scoreCannotSettle:
      'Оценка того, насколько сильны доказательства, а не утверждение, что число может решить вопрос культурной правды.',
    notScored:
      'Без оценки',
    navAtlasNote:
      'Что охвачено и с какой уверенностью',
    navProposeNote:
      'Еда, записи о которой в атласе нет',
    navConfirmNote:
      'Блюда, ждущие того, кто их знает',
    navSupportNote:
      'Сколько стоит содержание и кто платит',
    confirmPrompt:
      'У вас его готовят так?',
    confirmAskBody:
      'Если вы готовите это там, откуда оно родом, ваше подтверждение или поправка — именно то, что выводит запись из состояния «Не проверено». Там, где ваш вариант отличается, он записывается рядом с этим, а не вместо него.',
    confirmYes:
      'Да, совпадает',
    confirmNo:
      'У нас готовят иначе',
    confirmPlacePrompt:
      'Это блюдо действительно оттуда, откуда мы указываем?',
    confirmPlaceBody:
      'Никто не записал, как готовят именно это, так что соглашаться пока не с чем. Место — это то, что утверждает запись, и его стоит подтвердить само по себе: это одна из шести проверок доказательств.',
    confirmPlaceYes:
      'Да, оно отсюда',
    confirmPlaceNo:
      'Нет, оно из другого места',
    standingMet:
      'Это подтвердили {n} человек, связанных с местом {place}, — столько и требует знак.',
    standingNobody:
      'Пока никто',
    standingOne:
      'Пока один человек',
    standingMany:
      'Пока подтвердивших: {n}',
    standingNeed:
      '{soFar}. Знак требует {need}, так что {people}, связанных с местом {place}, хватило бы.',
    onePersonMore:
      'ещё один человек',
    morePeople:
      'ещё {n} человек',
    contestedNote:
      'Помещено сюда, чтобы его можно было найти. Задокументированные права на это блюдо есть у {n} мест — ни одни из них не решены, и все перечислены ниже.',
    relatedAlsoFrom:
      'Тоже из места {place}',
    relatedAlsoCuisine:
      'Тоже {cuisine}',
    relatedSharesIngredients:
      'Общих ингредиентов: {n}',
    relatedAlsoUses:
      'Тоже с ингредиентом {ingredient}',
    relatedAlsoCategory:
      'Тоже {category}',
    authenticVersion:
      'Подлинный вариант',
    thePublishedRecipe:
      'Опубликованный рецепт',
    whyThisIsAnAdaptation:
      'Почему это адаптация',
    whyConsideredAuthentic:
      'Почему это считается подлинным?',
    whatThisRecordIs:
      'Что это за запись',
    stepSubmit:
      'Отправить',
    stepWhatExists:
      'Что уже есть',
    stepAssessment:
      'Оценка',
    stepValidation:
      'Подтверждение',
    findingAggregatorTitle:
      'Сайт-сборник рецептов',
    findingAggregatorTag:
      'Популярный кандидат',
    findingAggregatorNote:
      'Результат на первом месте. Автор не указывает связи с Малабаром; берёт масло вместо гхи.',
    findingVideoTitle:
      'Видео кулинарного канала на малаялам',
    findingVideoTag:
      'Местный источник',
    findingVideoNote:
      'Снято в Керале, речь на малаялам, гхи и банан нендран — как и описано.',
    findingGapTitle:
      'Записи на уровне города не найдено',
    findingGapTag:
      'Пробел',
    findingGapNote:
      'Ничто не описывает, как это делают именно в Кожикоде. Эта присланная запись стала бы первой.',
    checkOriginLabel:
      'Географическое происхождение',
    checkOriginNote:
      'Малабар, Кожикоде — указано приславшим и согласуется с видеоисточником.',
    checkLocalPrepLabel:
      'Местное приготовление',
    checkLocalPrepNote:
      'Описано как домашняя готовка — на ифтар и к семейным поводам.',
    checkIngredientsLabel:
      'Традиционные ингредиенты',
    checkIngredientsNote:
      'Банан нендран, яйца, гхи — совпадает с видео местного источника.',
    checkTechniqueLabel:
      'Традиционная техника',
    checkTechniqueNote:
      'Слабый огонь, крышка, придавленная углями.',
    checkDocumentationLabel:
      'Историческая или культурная документация',
    checkDocumentationNote:
      'Скудная. Ни исследования, ни архивной записи не найдено.',
    checkLocalSourceLabel:
      'Местный источник',
    checkLocalSourceNote:
      'Приславший сообщает, что родился в Кожикоде и готовит там.',
    checkCommunityLabel:
      'Подтверждение сообществом',
    checkCommunityNote:
      'Пока не запрашивалось. Именно поэтому запись ещё нельзя назвать подлинной.',
    validatorHomeCook:
      'Домашняя кухарка, Кожикоде',
    validatorHomeCookSaid:
      'Подтвердила ингредиенты и способ с углями на крышке.',
    validatorBakery:
      'Владелец кондитерской, Талассери',
    validatorBakerySaid:
      'Подтверждает, отмечает, что в его версии меньше сахара.',
    validatorWriter:
      'Гастрономический журналист, Керала',
    validatorWriterSaid:
      'Подтверждено как домашнее малабарское блюдо; документации действительно мало.',
    validatorPending:
      'Приглашены ещё двое',
    validatorPendingSaid:
      'Ответа пока нет — запись публикуется и без них.',
    photoCheckedNote:
      'При отправке записи сверяется с Commons и показывается с автором съёмки и лицензией. Остаётся Не проверенной, пока сообщество её не подтвердит, ровно как и способ приготовления.',
    mostPublishedNote:
      'Самая растиражированная версия берётся как популярный кандидат. Подлинной записью она от этого не становится.',
    sevenChecksNote:
      'Семь проверок, каждая либо отвечена, либо оставлена открытой. Открытые снижают уверенность — их никогда не заполняют по предположению.',
    draftConfidence:
      '/100 черновой уверенности',
    unverifiedPendingTag:
      '⚪ Не проверено — ждёт подтверждения сообществом',
    oneSubmitterNote:
      'Один человек оттуда — это доказательство, а не решение вопроса. Запись остаётся Не проверенной, пока её не подтвердят люди из сообщества.',
    threeConfirmationsNote:
      'Три подтверждения от людей, которые там живут или готовят, выводят запись из состояния «Не проверено».',
    conflictingAccountsNote:
      'Расходящиеся рассказы сохраняются оба. Запись делится на традиции, которые люди действительно описали — по одной на регион или общину, — и ни одна версия не объявляется настоящей.',
    nowhereToSendNote:
      'Отправлять это некуда. Атлас прочитал всё, что есть в свободных источниках, поэтому не хватает теперь той еды, которую никто не записал, — а значит, эта форма и есть то, за счёт чего атлас растёт, и она будет включена, как только появится куда отправлять.',
    whereTheExampleEndsUp:
      'Вот чем заканчивается запись из примера: она опубликована, доказательства видны, оставшиеся открытыми проверки названы, а каждое утверждение прослеживается до того, кто его высказал.',
    confirmedBy:
      'Подтвердили',
    nothingMatchesAll:
      'Ничего не подходит подо всё это сразу.',
    mostOfYourListFirst:
      'Сначала то, что берёт из вашего списка больше всего',
    translatesTheAppsWords:
      'Переводит собственные слова приложения. Блюда остаются на том языке, на котором их записали, — у каждой записи свои средства перевода.',
    byNameAndPlaceOnly:
      'Эти есть в атласе только по названию и месту. Как их готовят, никто не записал, поэтому у них нет ни способа приготовления, ни оценки.',
    wikipediaViewsNote:
      'Сколько людей читали о каждом блюде в англоязычной Википедии за последний год. Это интерес, а не подлинность, и не мера того, насколько блюдо распространено: показатель смещён в сторону того, что ищут англоязычные. Откройте любое, чтобы увидеть его классификацию.',
    requiredDishName:
      'название блюда',
    requiredCountry:
      'страна',
    requiredYourName:
      'ваше имя',
    requiredYourConnection:
      'ваша связь с этим местом',
    requiredWhatYouConfirm:
      'что вы можете подтвердить',
    bandNotScored:
      'Без оценки',
    bandUnder50:
      'Меньше 50',
    band50to74:
      '50 – 74',
    band75Plus:
      '75 и выше',
    reviewCapitals:
      'Это написано целиком заглавными буквами.',
    reviewCapitalsConsider:
      'Обычная запись читается лучше и легче переводится. Название блюда сохраняет тот регистр, который вы ему задали.',
    reviewRepeats:
      'Один символ повторяется несколько раз подряд.',
    reviewRepeatsConsider:
      'Проверьте, не залипла ли клавиша.',
    reviewShort:
      'Описание способа очень короткое.',
    reviewShortConsider:
      'Напишите, что нужно сделать, чтобы это приготовить, включая ожидание. Запись без способа приготовления не попадёт на полки с рецептами.',
    groupSummaryCountries:
      'стран: {c} · традиций: {n}',
    groupSummaryOrigins:
      'источников: {c} · традиций: {n}',
    metricTotalTitle:
      'Записанных традиций',
    metricTotalCounts:
      'Традиция — это один способ готовить блюдо в одном месте. Одно и то же блюдо, приготовленное в двух областях по-разному, — это две традиции, и сохраняются обе.',
    metricTotalMethod:
      'Каждая запись из отобранного вручную набора и четырёх импортированных источников, которой есть что показать, — как минимум место и название. Строки, ещё ожидающие обогащения, придерживаются и не считаются.',
    metricTotalCaveat:
      'Это не подсчёт различных блюд мира и не мера того, сколько атлас знает. У большинства этих записей есть название и страна, и больше ничего. Доля тех, у кого записан способ приготовления, — вот число, которое говорит, атлас это или список названий.',
    metricCountriesTitle:
      'Страны',
    metricCountriesCounts:
      'Различные страны, названные во всех записях, после разрешения географических названий из импорта.',
    metricCountriesMethod:
      'Поле страны каждой записи, без повторов, считая только те источники происхождения, которые являются странами. Исторические и наднациональные записи, которые использовал источник, — Османская империя, Левант, Мезоамерика — остаются на своих записях, а не переносятся на современное государство, которое пришлось бы угадывать, и здесь не считаются. Их подсчёт добавлял к этой цифре тридцать две, и каждая из них была вымышленной.',
    metricCountriesCaveat:
      'Охват — это не глубина. Страна попадает сюда на основании одной-единственной записи, так что это считает, где атлас побывал, а не где он чего-то стоит. Читайте это рядом с показателем концентрации ниже, который говорит, насколько перекошен итог.',
    metricAtRiskTitle:
      'Традиции под угрозой',
    metricAtRiskCounts:
      'Записи, где источник своими словами описывает традицию как угасающую, исчезающую или больше не практикуемую.',
    metricAtRiskMethod:
      'Находится чтением вступления и истории каждой статьи в поисках прямо заявленного угасания — «сейчас делают редко», «последний оставшийся производитель» — и отбрасыванием почти-совпадений, которые значат другое: например, вымирающий вид, используемый как ингредиент, или закрывшаяся сеть ресторанов. Фраза, которая это вызвала, хранится в записи как доказательство и показывается вместе с ней.',
    metricAtRiskCaveat:
      'Это нижняя граница, а не перепись, и она намного ниже правды. Найти можно только то угасание, которое кто-то уже записал в тексте, который мы прочитали; традиция, которую держат четыре семьи и которую никто не задокументировал, не даёт вообще ничего. Один только «Ковчег вкуса» Slow Food перечисляет около шести тысяч продуктов под угрозой — в тысячу раз больше этой цифры.',
    metricDocumentedTitle:
      'Есть записанный способ приготовления',
    metricDocumentedCounts:
      'Записи с упорядоченным способом приготовления — шагами, которым человек следовал бы, чтобы это сделать.',
    metricDocumentedMethod:
      'У записей, отобранных вручную, способ приготовления написан и выверен с сообществом. У импортированных он есть только там, где для них существует опубликованный рецепт; энциклопедический абзац, описывающий, как блюдо готовят вообще, хранится как проза и намеренно не повышается до шагов, потому что выдавать описание за способ приготовления — значит заявлять точность, которой у него нет.',
    metricDocumentedCaveat:
      'Наличие способа приготовления ничего не говорит о том, традиционный ли он. Для этого есть оценка уверенности, и большинство записей со способом приготовления отнесены к Современным адаптациям.',
    metricLocatedTitle:
      'Указано точнее страны',
    metricLocatedCounts:
      'Записи, называющие область, провинцию, город или село, а не только страну.',
    metricLocatedMethod:
      'Любая запись, у места которой заполнен уровень ниже страны.',
    metricLocatedCaveat:
      'У подлинности есть географическая глубина, и страна — это едва начало: «Кожикоде» — это запись, «Индия» — это заголовок. Большой итог при малой доле здесь описывает атлас широкий и мелкий.',
    metricIllustratedTitle:
      'Есть фотография',
    metricIllustratedCounts:
      'Записи с изображением, которое приложение имеет право показывать.',
    metricIllustratedMethod:
      'Из Wikidata, из собственной статьи блюда в Википедии или переданное готовящим человеком через Wikimedia Commons. Каждое хранится с автором съёмки и лицензией, и ни одно не помечено как проверенное: изображение, найденное по названию или выбранное редактором, — это хорошее свидетельство того, что на нём это блюдо, а не подтверждение со стороны приложения.',
    metricIllustratedCaveat:
      'Фотография не является доказательством подлинности. На ней тарелка, которую кто-то приготовил, и это может быть описанная в записи традиция, а может и не быть.',
    metricFilmedTitle:
      'Есть упорядоченное видео',
    metricFilmedCounts:
      'Записи, у которых есть хотя бы одно видео, упорядоченные по тому, насколько готовящий близок к традиции.',
    metricFilmedMethod:
      'Упорядочено по местности — где находится готовящий, на каком языке говорит, совпадают ли ингредиенты и посуда с записью. Никогда по просмотрам, лайкам или подписчикам.',
    metricFilmedCaveat:
      'Порядок — о близости к традиции, а не о качестве съёмки, и первое видео часто самое непричёсанное.',
    metricAssessedTitle:
      'Отнесены к подлинным',
    metricAssessedCounts:
      'Записи, дошедшие по проверкам доказательств до «Подлинное — местное» или «Подлинное — региональное».',
    metricAssessedMethod:
      'Семь проверок, каждая либо отвечена, либо оставлена открытой, причём открытые снижают уверенность, а не заполняются по предположению. Техника и подтверждение сообществом никогда не выводятся из импорта, что ограничивает то, чего импортированная запись может достичь сама по себе.',
    metricAssessedCaveat:
      'Низкая доля здесь — это честность, а не неудача. Большая часть каталога импортирована и не оценена, и называть эти записи подлинными на том основании, что они пришли из уважаемого источника, — ровно та срезка пути, ради отказа от которой эта шкала и существует.',
    metricConcentrationTitle:
      'Концентрация',
    metricConcentrationCounts:
      'Доля всего каталога, приходящаяся на одну самую большую страну.',
    metricConcentrationMethod:
      'Записи наиболее представленной страны, делённые на общее число.',
    metricConcentrationCaveat:
      'Это отражает, какие страны ведут открытые продовольственные реестры, а не то, где находится еда мира. Одна только Италия публикует около 4400 зарегистрированных традиционных продуктов; большинство стран не публикует ни одного, и их отсутствие здесь — отсутствие бумаг, а не готовки.',
    metricConfidenceTitle:
      'Уверенность',
    metricConfidenceCounts:
      'Как каталог распределён по шкале доказательств от 0 до 100.',
    metricConfidenceMethod:
      'Отобранные вручную записи оцениваются по проверкам доказательств. Импортированные — только там, где обогащение нашло что оценивать, а в остальных случаях остаются без оценки, а не получают значение по умолчанию.',
    metricConfidenceCaveat:
      '«Без оценки» — с большим отрывом самая крупная полоса, и такой она и останется. Это значит, что запись ещё никто не оценивал, — а не что она набрала мало и не что еда сомнительна.',
    metricByContinentTitle:
      'Где находятся записи',
    metricByContinentCounts:
      'Записи по частям света, каждая запись считается один раз. Традиция относится к части света той страны, в которой она записана, а не той, откуда могла прийти.',
    metricByContinentMethod:
      'По стране каждой записи, через таблицу «страна — часть света», охватывающую около 200 государств, включая исторические. Наднациональные и спорные записи группируются, а не втискиваются в часть света.',
    metricByContinentCaveat:
      'Это карта источников, а не кухонь мира. Европа впереди потому, что европейские реестры выложены в сеть и открыты, — это факт об архивах.',
    howIsThisCounted:
      'Как это подсчитано?',
    hideHowThisIsCounted:
      'Скрыть, как это считается',
    stapleGrains: 'Злаки',
    stapleRoots: 'Корнеплоды',
    staplePulses: 'Бобовые',
    stapleDairy: 'Молочное',
    stapleMeatFish: 'Мясо и рыба',
    stapleVegetables: 'Овощи',
    stapleAromatics: 'Ароматы',
    stapleSweetSour: 'Сладкое и кислое',
    stapleRice: 'Рис',
    stapleWheat: 'Пшеница',
    stapleMaize: 'Кукуруза',
    stapleMillet: 'Просо',
    stapleSorghum: 'Сорго',
    stapleBarley: 'Ячмень',
    stapleOats: 'Овёс',
    stapleBuckwheat: 'Гречиха',
    stapleTeff: 'Тефф',
    staplePotato: 'Картофель',
    stapleCassava: 'Маниок',
    stapleSweetPotato: 'Батат',
    stapleYam: 'Ямс',
    stapleTaro: 'Таро',
    staplePlantain: 'Плантан',
    stapleLentil: 'Чечевица',
    stapleChickpea: 'Нут',
    stapleSoy: 'Соя',
    stapleTofu: 'Тофу',
    stapleBlackBean: 'Чёрная фасоль',
    stapleMungBean: 'Маш',
    staplePigeonPea: 'Голубиный горох',
    stapleMilk: 'Молоко',
    stapleYoghurt: 'Йогурт',
    stapleCheese: 'Сыр',
    staplePaneer: 'Панир',
    stapleGhee: 'Гхи',
    stapleButter: 'Сливочное масло',
    stapleCoconut: 'Кокос',
    stapleChicken: 'Курица',
    stapleBeef: 'Говядина',
    staplePork: 'Свинина',
    stapleLamb: 'Баранина',
    stapleGoat: 'Козлятина',
    stapleFish: 'Рыба',
    staplePrawn: 'Креветки',
    stapleEgg: 'Яйца',
    stapleOnion: 'Лук',
    stapleGarlic: 'Чеснок',
    stapleGinger: 'Имбирь',
    stapleChilli: 'Чили',
    stapleLemongrass: 'Лемонграсс',
    stapleTomato: 'Помидор',
    stapleAubergine: 'Баклажан',
    stapleCabbage: 'Капуста',
    stapleSpinach: 'Шпинат',
    stapleOkra: 'Окра',
    stapleTamarind: 'Тамаринд',
    stapleHoney: 'Мёд',
    stapleJaggery: 'Джаггери',
    stapleDate: 'Финики',
    stapleLemon: 'Лимон',
    stapleOlive: 'Оливка',
    dietVegan: 'Веганское',
    dietVegetarian: 'Вегетарианское',
    dietSeafood: 'Морепродукты',
    dietMeat: 'Невегетарианское',
    dietUnclassified: 'Не отнесено',
    dietPoultry: 'Птица',
    dietPork: 'Свинина',
    dietBeef: 'Говядина и красное мясо',
    dietLambGoat: 'Баранина и козлятина',
    dietGame: 'Дичь',
    dietFish: 'Рыба',
    dietShellfish: 'Моллюски и ракообразные',
    dietOtherSeafood: 'Другие морепродукты',
    dietDairy: 'Содержит молочное',
    dietEgg: 'Содержит яйцо',
    dietHoney: 'Содержит мёд',
    mealBreakfast: 'Завтрак',
    mealLunch: 'Обед',
    mealDinner: 'Ужин',
    mealSupper: 'Поздний ужин',
    mealSnack: 'Перекус',
    mealStreetFood: 'Уличная еда',
    mealCelebration: 'Праздник и застолье',
    mealAnytime: 'В любое время',
    mealUnclassified: 'Не записано',
    searchModeFind:
      'Найти блюдо',
    searchModePantry:
      'Готовить из того, что есть',
    ingredientsYouHave:
      'Ингредиенты, которые у вас есть',
    nTraditions:
      'Традиций: {n}',
    nothingYet:
      'Пока ничего',
    methodRecorded:
      ' · способ записан',
    noMethodYet:
      ' · способа пока нет',
    showMoreLeft:
      'Показать ещё — осталось {n}',
    showNMore:
      'Показать ещё {n}',
    methodAsPublished:
      'Способ приготовления в том виде, как он опубликован. Современная техника и упрощения — его часть.',
    methodTraditional:
      'Традиционный способ, без подстановки современных упрощений.',
    everythingClassified:
      'Всё, отнесённое к «{what}»',
    everythingFrom:
      'Всё из места {place}',
    everythingRecordedAs:
      'Всё, записанное как «{what}»',
    everythingMadeWith:
      'Всё, что готовят с ингредиентом {ingredient}',
    seeEverything:
      '{label} — посмотреть всё',
    noPhotographOnRecord:
      '{label} — фотографии в записи нет',
    scoreOutOf100:
      '{label}: {value} из 100',
    removeFilter:
      'Убрать фильтр {key}',
    anywhereInTheAtlas:
      ' где угодно в атласе',
    absenceOfRecords:
      '. Это отсутствие записей, а не отсутствие еды: мы предпочитаем сказать, что не знаем.',
    narrowToA:
      'Сузить до уровня «{level}» · записано: {n}',
    fromTheTown:
      ' — из самого города',
    showFewer:
      'Показать меньше',
    readAboutOnWikipedia:
      'Прочитать о {name} на языке {language} в Википедии',
    languageChangeIt:
      'Язык: {language}. Изменить.',
    perCentTranslated:
      '{language}, переведено на {n} процентов',
    translateThisRecord:
      'Перевести эту запись',
    translating:
      'Перевод…',
    translate:
      'Перевести',
    translateThisConfirmation:
      'Перевести это подтверждение на язык {language}',
    couldNotTranslate:
      'Перевести не удалось — попробуйте ещё раз',
    howThisIsCountedFor:
      'Как считается «{figure}»',
    countOfTotal:
      '{label}: {count} из {total}',
    watchAtSourceCreator:
      'Смотреть {creator} в источнике',
    stillFromCreator:
      'Кадр из видео {creator}',
    thatDidNotSend:
      'Отправить не удалось.',
    containsAlcohol:
      'Содержит алкоголь',
    nothingElseRequired:
      'Всё остальное приветствуется, и ничего из этого не обязательно: знать, откуда блюдо и что его никто не записал, — уже больше, чем есть у любого здешнего источника.',
    opensTheFormPrefilled:
      'Откроется форма в её источнике с уже заполненным тем, что вы написали. Это приложение ничего о вас не собирает, и ничего не публикуется, пока это не подтвердят люди из того места.',
    scoreDimGeographic:
      'Географическая связь',
    scoreDimIngredients:
      'Традиционные ингредиенты',
    scoreDimTechnique:
      'Традиционная техника',
    scoreDimLocalSource:
      'Местный источник',
    scoreDimDocumentation:
      'Культурная документация',
    scoreDimCommunity:
      'Подтверждение сообществом',
    photoFromWikidata:
      'Приложено к собственной записи этого блюда в Wikidata — не найдено по названию',
    photoFromArticle:
      'Заглавное изображение собственной энциклопедической статьи этого блюда',
    photoFromRecipe:
      'Опубликовано на странице самого этого рецепта',
    photoFromSearch:
      'Найдено по названию на Wikimedia Commons — сюжет не подтверждён',
    photoFromUnknown:
      'Источник не записан — считайте сюжет неподтверждённым',
    noTranslationRecorded:
      'Перевода этого рассказа пока не записано, поэтому он показан на языке {language}, на котором его задокументировали. Мы предпочитаем показать вам оригинал, а не догадку машины о времени брожения.',
    machineTranslationBy:
      'Машинный перевод: {translator}. Никто из сообщества его не проверял — названия ингредиентов и посуды оставлены в оригинале.',
    translatedBy:
      'Перевод: {translator}. Названия ингредиентов и посуды оставлены в оригинале.',
    videoOriginalAudio:
      'Говорят на языке {language} — родном языке готовящего. Ничего не переводится.',
    videoCreatorTrack:
      'Автор опубликовал звуковую дорожку на языке {language}. В источнике открывается именно она — перевод его, а не наш.',
    videoPlatformCaptions:
      'Говорят на языке {spoken}. Открывается с машинно переведёнными субтитрами на языке {preferred} поверх оригинального звука: голос готовящего не заменяется, а перевод сделан видеоплатформой, а не человеком.',
    videoLanguageUnknown:
      'Разговорный язык этого видео у нас не записан, поэтому обещать {language} мы не можем. Оно открывается в источнике, где действуют настройки субтитров самой платформы.',
    figureDocumented:
      'Есть записанный способ приготовления',
    figureDocumentedNote:
      'Число, которое говорит, атлас это или список названий. Всё остальное по отношению к нему второстепенно.',
    figureLocated:
      'Указано точнее страны',
    figureLocatedNote:
      'У подлинности есть географическая глубина. «Кожикоде» — это запись; «Индия» — едва начало.',
    figureIllustrated:
      'Есть фотография',
    figureIllustratedNote:
      'Блюдо, которое никто не может себе представить, труднее полюбить и ещё труднее узнать.',
    figureFilmed:
      'Есть упорядоченное видео',
    figureFilmedNote:
      'Упорядочено по близости готовящего к традиции, а не по выдаче поиска.',
    figureAssessed:
      'Отнесены к подлинным',
    figureAssessedNote:
      'Заработано через проверки доказательств. Низкая доля здесь — это честность, а не неудача.',
    atlasSummary:
      'Записано традиций: {n}, из {c} стран. Охват указан честно: у страны, которой здесь нет, пока ничего не записано, а не нечего записывать.',
    nothingRecorded:
      'Ничего не записано',
    nothingRecordedAs:
      'Ничего не записано как «{what}»',
    nothingRecordedAsAnd:
      'Ничего не записано как «{list}» и «{last}»',
    photoVia:
      'фото через',
    photoNothingEntered:
      'Пока ничего не введено.',
    photoNothingEnteredFix:
      'Вставьте имя файла на Commons или ссылку на страницу файла.',
    photoWrongHost:
      'Эта ссылка ведёт на {host}, и мы не вправе публиковать оттуда фотографию.',
    photoWrongHostFix:
      'Если фотография ваша, загрузите её на Wikimedia Commons под свободной лицензией и вставьте сюда имя файла. Она останется вашей, ваше имя будет указано везде, где она появится, и это ничего не стоит.',
    photoNotCommons:
      'Эта ссылка не на Wikimedia Commons.',
    photoNotCommonsFix:
      'Публиковать здесь можно только файлы с Commons, потому что лицензия, позволяющая нам их показывать, есть только у них.',
    photoNoFileName:
      'Имени файла в этом не нашлось.',
    photoNoFileNameFix:
      'Вставьте имя файла, например Kaipola.jpg.',
    photoNotAPhotograph:
      'Это не файл фотографии.',
    photoNotAPhotographFix:
      'Фотографии на Commons оканчиваются на .jpg, .png или .webp. Схемы и логотипы здесь не используются.',
    photoIsADrawing:
      'Это рисунок, а не фотография.',
    photoIsADrawingFix:
      'Возьмите фотографию блюда таким, каким его приготовили.',
    serverRefused:
      'Сервер отклонил это ({status}).',
    serverTookTooLong:
      'Сервер слишком долго не отвечал.',
    couldNotReachServer:
      'Не удалось связаться с сервером.',
    nothingYouTypedIsLost:
      '{message} Ваша запись не отправлена — ничего из набранного не потеряно, попробуйте через минуту.',
    proposalsNotOpen:
      'Приём предложений пока не открыт.',
    confirmationsNotOpen:
      'Приём подтверждений пока не открыт.',
    alreadyProposed:
      'Это блюдо уже предлагали. Откройте его и подтвердите — именно это двигает дело.',
    alreadyConfirmed:
      'Вы это уже подтверждали.',
    youProposedThis:
      'Это блюдо предложили вы, поэтому подтвердить его должен кто-то другой.',
    stillNeededList:
      'Ещё нужно: {list}.',
    listAnd:
      '{list} и {last}',
    listOr:
      '{list} или {last}',
    proposalConfirmed:
      'Подтверждено. Попадёт в атлас при следующем обновлении.',
    proposalNobodyYet:
      'Это ещё никто не подтвердил. {n} человека, знающих блюдо, ввели бы его в атлас.',
    proposalSoFar:
      'Подтверждений: {have} из {n}. Ещё {short} от знающих блюдо ввели бы его.',
    recordNobodyYet:
      'Из того места это ещё никто не подтвердил. {n} подтверждения удостоверили бы это.',
    recordSoFar:
      'Подтверждений: {have} из {n}. Ещё {short} от знающих блюдо удостоверили бы это.',
    atRiskNote:
      'Отмечено потому, что источник описывает эту традицию как угасающую, — эта фраза показана вместе с записью. Это никогда не выводится из того, как мало мы задокументировали: пробел в наших записях не доказывает, что кто-то перестал готовить.',
    originDisclaimer:
      'У этого блюда больше одного задокументированного исторического притязания. Традиции ниже записаны так, как их описывает каждое место, с их источниками. Ни одно притязание здесь не подаётся как победившее, и ничто из этого не влияет на оценку подлинности — она измеряет, как блюдо готовят в том или ином месте, а не кто приготовил его первым.',
    supportRunsOn:
      'Всё в атласе взято из Википедии, Викиданных, Викисклада, Викиучебника и открытых региональных реестров. Они свободны для чтения, имеют открытую лицензию и указаны в каждой записи, которая их использует. В этом вся основа того, что проект остаётся бесплатным, и это решение, а не промежуточный этап.',
    contributeToTheAtlas:
      'Поддержать атлас',
    answeredByDocuments:
      'На это могут ответить документы',
    answeredByPeople:
      'На это могут ответить только люди',
    scaleDocumentsStop:
      'здесь документы кончаются',
    scaleAuthenticBegins:
      'начинается Подлинное',
    pantryNothingUses:
      'Ничто из записанного не использует {list}. Возможно, просто никто не записал такое блюдо — у {p}% атласа не указано ни одного ингредиента.',
    alsoRecordedIn:
      'Также записано в {list}',
    alsoRecordedNote:
      'В атласе есть отдельная запись об этом блюде там. Ни одна не исправляет другую — блюдо, которое готовят две кулинарные традиции, не ошибка ни в одной из них.',
    chooseACountry:
      'Выберите страну',
    filterTheList:
      'Введите, чтобы сузить список',
    showingFirstNOfM:
      'Показаны первые {n} из {m}. Продолжайте вводить, чтобы сузить.',
    nothingMatchesThat:
      'В списке нет ничего подходящего.',
    continentBeyondOneCountry:
      'Шире одной страны',
    beyondOneCountryNote:
      'Происхождение, которое источники записывают шире одной страны: регион, общая кулинарная область или государство, которого больше нет. Оно сохраняется так, как его называет источник, а не сужается до страны, которую никто не выбирал.',
    connectionGrewUpThere:
      'Я там вырос',
    connectionLiveThere:
      'Я там живу',
    connectionFamilyFrom:
      'Моя семья оттуда',
    connectionLearnedThere:
      'Я научился готовить это там',
    connectionCookProfessionally:
      'Я готовлю это там профессионально',
    chooseYourConnection:
      'Выберите подходящее',
    connectionInYourWords:
      'Всё, что хотите добавить, своими словами',
    connectionDetailPlaceholder:
      'Моя бабушка готовила это каждый Ид в Кожикоде',
    dictateSpeak:
      'Сказать вместо набора',
    dictateListening:
      'Слушаю — нажмите, чтобы остановить',
    dictateStop:
      'Перестать слушать',
    dictateSendsAudio:
      'Слушает ваш браузер, и большинство браузеров отправляют для этого звук на свои серверы. Сказанное добавляется в поле выше, где это можно поправить.',
    dictateNotAllowed:
      'Браузер не дал доступ к микрофону.',
    dictateDidNotWork:
      'Не получилось. Можно набрать текстом.',
    polishTidyThis:
      'Поправить опечатки',
    polishWorking:
      'Правлю…',
    polishMachineMade:
      'Предложено машиной — ваши слова остаются выше',
    polishUseThis:
      'Взять это',
    polishKeepMine:
      'Оставить своё',
    polishOnlyTyping:
      'Затрагиваются только орфография, пунктуация и пробелы. Ничего не добавляется, не удаляется и не переформулируется, и ни одно название не меняется.',
    polishFoundNothing:
      'Править нечего — написанное читается хорошо.',
    polishDidNotWork:
      'Не получилось. Написанное осталось прежним.',
    continentAfrica:
      'Африка',
    continentAsia:
      'Азия',
    continentEurope:
      'Европа',
    continentNorthAmerica:
      'Северная Америка',
    continentSouthAmerica:
      'Южная Америка',
    continentOceania:
      'Океания',
    regionLevant:
      'Левант',
    regionLatinAmerica:
      'Латинская Америка',
    regionMiddleEast:
      'Ближний Восток',
    regionMaghreb:
      'Магриб',
    regionCentralEurope:
      'Центральная Европа',
    regionEasternEurope:
      'Восточная Европа',
    regionSouthernEurope:
      'Южная Европа',
    regionCentralAsia:
      'Центральная Азия',
    regionIndianSubcontinent:
      'Индийский субконтинент',
    regionNorthAfrica:
      'Северная Африка',
    regionAmericas:
      'Америка',
    regionAncientNearEast:
      'Древний Ближний Восток',
    regionBalkans:
      'Балканы',
    regionCaribbean:
      'Карибы',
    regionLowCountries:
      'Нижние Земли',
    regionMesoamerica:
      'Мезоамерика',
    regionMiddleEasternEmpires:
      'империи Ближнего Востока',
    regionPolishLithuanianCommonwealth:
      'Речь Посполитая',
    regionQajarIran:
      'Каджарский Иран',
    regionRussianEmpire:
      'Российская империя',
    regionSouthCaucasus:
      'Южный Кавказ',
    regionSovietCentralAsia:
      'Советская Средняя Азия',
    regionWu:
      'Wu',
    regionArtsakh:
      'Республика Арцах',
    refineDietOccasion:
      'Питание и повод',
    refineAny:
      'Любые',
    placeKindWiderRegion:
      'широкий регион',
    placeKindFormerState:
      'историческое государство',
    oneTradition:
      '1 традиция',
    onePlace:
      '1 место',
    nPlaces:
      '{n} мест',
    countryLevelOnly:
      'только на уровне страны',
    summaryWorldwide:
      ' по всему миру',
    nRecorded:
      '{n} записей',
    writtenInLanguage:
      'Написано на языке: {language}',
    whatThisIs:
      'Что это такое',
    atlasDefinition:
      'Бесплатный атлас традиционных блюд — откуда каждое и кто за него ручается.',
    traditionsLabel:
      'традиций',
    freeNoAds:
      'Бесплатно, без рекламы',
    quotedFromSource:
      'Цитата из источника ниже — общее описание того, как готовят это блюдо, а не запись о том, как его готовят в {place}.',
    adaptationLeadIn:
      'Как это блюдо готовят сегодня чаще всего. Это не запись о том, как его готовят в {place}, и никто оттуда этого не подтвердил.',
    openDisagreementBody:
      'Тот, кто готовит это в {place}, говорит, что делают иначе: {differs} Ничего не удалено на время разбора, и оценка достоверности ниже не изменилась — если обе версии верны, запись разделится, а не одна отменит другую.',
    engagementNotShown:
      'Цифры просмотров намеренно не показаны: они не измеряют подлинность.',
    videoSearchNote:
      'Можно поискать в источнике. Результаты приходят по числу просмотров, а это мера охвата и только — тот, кто готовит, может быть из {place}, а может и нет. Ничто найденное так не влияет на классификацию этой записи.',
    nowOpenForConfirmation:
      '{name} теперь открыто для подтверждения.',
    proposalOpenBody:
      'Подтвердить блюдо должны {n} человек, которые его знают, и только потом оно попадёт в атлас. С этого момента его видит и может подтвердить кто угодно — включая тех, кому вы расскажете, и именно так обычно подтверждают блюдо, которое никто не записал.',
    nothingMatchesBody:
      'В атласе пока нет ничего, что совпадает с {query}. Отсутствие здесь означает, что нет записи, а не что нет еды — мы лучше скажем, что не знаем, чем станем гадать.',
    thatWord:
      'это',
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
      '{n} परंपराएँ, पूरी तरह ऐसे स्रोतों से बनीं जो पढ़ने के लिए मुफ़्त हैं और खुले लाइसेंस पर हैं। कोई विज्ञापन नहीं, कोई ट्रैकिंग नहीं, और भुगतान के पीछे कुछ भी नहीं। इसे चलाने में जो लगता है, वह स्रोतों के इसी चुनाव से पूरा होता है — इसलिए नहीं कि कोई यहाँ रहने के लिए पैसे देता है।',
    notForSaleAuthentic:
      'पैसे देकर किसी रिकॉर्ड को प्रामाणिक नहीं बनाया जा सकता। वह प्रमाणों से आता है और उन लोगों से जो यह व्यंजन बनाते हैं।',
    notForSalePromotion:
      'किसी ने भुगतान किया, इसलिए किसी व्यंजन को बढ़ावा, ऊँची जगह या विशेष स्थान नहीं मिलता।',
    notForSaleAdvertising:
      'यहाँ कुछ भी विज्ञापन नहीं है, और किसी पाठक को ट्रैक नहीं किया जाता।',
    donationFootnote:
      'Open Collective पर खुलता है। यहाँ कुछ भी वसूला नहीं जाता — यह ऐप आपके भुगतान विवरण नहीं रखता और कभी नहीं रखेगा।',
    donationsPendingBody:
      'पैसे भेजने की अभी कोई जगह नहीं है। एटलस में कुछ भी इस पर निर्भर नहीं है — यह पढ़ने के लिए मुफ़्त स्रोतों पर बना है, और वह नहीं बदलता।',
    mostUsefulThing:
      'इस एटलस को कोई जो सबसे उपयोगी चीज़ दे सकता है वह पैसा नहीं है। इसका ज़्यादातर हिस्सा बस एक नाम और एक जगह है, क्योंकि किसी ने लिखा ही नहीं कि वह खाना कैसे बनता है।',
    administration:
      'प्रशासन',
    administrationNote:
      'सीमाएँ, मॉडरेशन, स्रोत जाँच और उपयोग। टोकन चाहिए।',
    howLead:
      'यही वह नियम है जिस पर यह एटलस टिका है, और यह नीति नहीं, अंकगणित है — यानी आप इस पर भरोसा करने के बजाय इसे जाँच सकते हैं।',
    sixDimensionsBody:
      'हर रिकॉर्ड उन्हीं छह आयामों पर आँका जाता है, और छहों रिकॉर्ड पर ही छपे होते हैं। अंक उनका औसत है, इसलिए जिसे संदेह हो वह संख्याएँ जोड़ सकता है।',
    ceilingBody:
      'उन छह में से तीन का उत्तर आज तक लिखा गया कोई दस्तावेज़ नहीं दे सकता। कोई विश्वकोश नहीं जानता कि कोई विधि उस जगह की विधि है या नहीं; कोई रजिस्टर उस कस्बे का व्यक्ति नहीं होता। वे तीन खाली होने पर, केवल प्रकाशित स्रोतों से कोई रिकॉर्ड अधिकतम {ceiling} तक ही पहुँच सकता है।',
    thresholdBody:
      'किसी रिकॉर्ड को {threshold} पर प्रामाणिक कहा जाता है। इन दो संख्याओं की दूरी जान-बूझकर है, और यही पूरा तर्क है: इसे केवल वही लोग पाट सकते हैं जो उस व्यंजन को जानते हैं।',
    whatClosesItBody:
      'उन लोगों से {n} पुष्टियाँ जो उस जगह से अपना नाता बताते हैं — और जो कहते हैं कि वे क्या पुष्ट कर रहे हैं, केवल यह नहीं कि वे सहमत हैं। दोनों रिकॉर्ड पर दिखते हैं, क्योंकि “कोझिकोड में जन्मा — हम तेल नहीं, घी डालते हैं” जैसा वाक्य ऐसा प्रमाण है जिसे तौला जा सकता है, जबकि “{n} पुष्टियाँ” वह संख्या है जिस पर भरोसा करना पड़ता है।',
    accountsBody:
      'वे {n} पुष्टियाँ {n} अलग-अलग लोगों की होनी चाहिए, इसलिए कोई पुष्टि बैज की ओर तभी गिनी जाती है जब व्यक्ति साइन इन था। गुमनाम पुष्टि फिर भी दर्ज होती है और रिकॉर्ड पर दिखती है — किसी की जानकारी रखने योग्य है, खाता हो या न हो — बस वह संख्या नहीं बढ़ाती। एटलस पढ़ने के लिए साइन इन कभी ज़रूरी नहीं।',
    whichIsWhereYouComeInBody:
      'एटलस के अधिकांश हिस्से के लिए कोई नहीं बोलता। अगर आप जानते हैं कि आपके यहाँ कोई व्यंजन कैसे बनता है, तो वही एक चीज़ है जो कोई स्रोत नहीं दे सकता और कोई स्क्रैपिंग नहीं पहुँच सकती।',
    notRatings:
      'कोई रेटिंग नहीं। कोई किसी व्यंजन को पाँच में से अंक नहीं देता।',
    notComments:
      'कोई टिप्पणी नहीं, कोई फ़ीड नहीं। यहाँ जुड़ने-भिड़ने को कुछ नहीं है।',
    notAlgorithm:
      'कोई एल्गोरिदम तय नहीं करता कि आप क्या देखें। क्रम प्रमाण है, और आप उसे बदल सकते हैं।',
    notAdvertising:
      'कोई विज्ञापन नहीं, और किसी पाठक को ट्रैक नहीं किया जाता।',
    notPopularity:
      'लोकप्रियता दर्ज होती है और अलग रखी जाती है। किसी व्यंजन का सबसे ज़्यादा प्रकाशित रूप कभी प्रामाणिक नहीं बनता।',
    dimensionOrigin:
      'व्यंजन कहाँ का है, और कितनी बारीकी से। कस्बा देश से बेहतर है।',
    dimensionIngredients:
      'वह किस चीज़ से बनता है, जैसा परंपरा बनाती है।',
    dimensionTechnique:
      'वह कैसे बनता है — यह नहीं कि किसी ने विधि छापी, बल्कि यह कि यही उस जगह की विधि है।',
    dimensionLocalSource:
      'उस जगह से घोषित नाता रखने वाले किसी व्यक्ति ने उसके लिए कहा है।',
    dimensionDocumentation:
      'किसी रजिस्टर, सूची या विश्वकोश ने उसे दर्ज किया है।',
    dimensionCommunity:
      'उस जगह के लोगों ने उसकी पुष्टि की है, और बताया है कि वे क्या पुष्ट कर रहे हैं।',
    fromDocuments:
      'दस्तावेज़ बता सकते हैं',
    fromPeople:
      'केवल लोग',
    contributeLead:
      'जहाँ आप हैं वहाँ जैसे बनता है, वैसे ही दर्ज करें। सिर्फ़ इस फ़ॉर्म से कुछ भी प्रकाशित नहीं होता — पहले आकलन और समुदाय की पुष्टि से गुज़रता है।',
    writeItTheWayYouWriteIt:
      'खाने का नाम वैसे ही लिखें जैसे आप लिखते हैं',
    editorialRuleBody:
      'हमारी लिखावट को बेझिझक सुधारें — वर्तनी, व्याकरण, जो कुछ भी ठीक से नहीं पढ़ा जाता। खाने को ही मत सुधारिए। व्यंजन का नाम, कोई सामग्री, कोई बर्तन और कोई जगह ठीक वैसे ही रहते हैं जैसे उन्हें वे लोग लिखते हैं जो उसे पकाते हैं, मात्राओं समेत। अगर दो वर्तनियाँ अलग हैं, तो वह आम तौर पर दो समुदाय होते हैं, ग़लती नहीं, और दोनों रखी जाती हैं।',
    photographTitle:
      'उसकी एक तस्वीर, अगर आपके पास हो',
    photographBody:
      'अपनी तस्वीर Wikimedia Commons पर प्रकाशित करें, फिर उसका फ़ाइल नाम यहाँ चिपकाएँ। वह आपकी ही रहती है, जहाँ भी दिखे वहाँ आपका नाम रहता है, और इसमें न आपका कुछ ख़र्च होता है न हमारा। हम Instagram या TikTok से कोई तस्वीर नहीं ले सकते — वहाँ तस्वीर उसके बनाने वाले के कॉपीराइट में है, और नाम की एक पंक्ति अनुमति नहीं है।',
    walkthroughNoteBody:
      'आगे जो है वह एक हल किया हुआ उदाहरण है कि भेजी गई प्रविष्टि के साथ क्या होता है — नीचे दिए निष्कर्ष, जाँचें और कच्चा अंक एटलस में पहले से मौजूद एक रिकॉर्ड के हैं, उसके नहीं जो आपने अभी लिखा। आपकी प्रविष्टि यहाँ नहीं आँकी जाती; भेजे जाने के बाद उसे लोग आँकते हैं।',
    examplePreparedBy:
      'मालाबार के घर, इफ़्तार और पारिवारिक अवसरों के लिए बनाया जाता है',
    exampleConnection:
      'कोझिकोड में जन्मा और वहीं पकाता हूँ',
    exampleIngredients:
      'पका नेंद्रन केला, अंडे, घी, चीनी, काजू, किशमिश; भारी कड़ाही में कोयले या गैस की धीमी आँच पर, अंगारों से दबाए ढक्कन से ढककर पकाया जाता है',
    shelfFromCountry:
      '{country} से',
    shelfFromCountryNote:
      'एटलस के पास {country} से जो कुछ है। यहाँ का सही होना आपके लिए और कहीं से ज़्यादा मायने रखता है — आप बता सकते हैं कि यह ठीक है या नहीं।',
    sending:
      'भेजा जा रहा है…',
    missionHeadline:
      'यहाँ हर व्यंजन अपने सबूत दिखाता है।',
    missionStakes:
      'वह कहाँ से आया, यह कौन कहता है, और सचमुच कितना स्थापित हुआ है — हर रिकॉर्ड पर छपा हुआ, और संदेह करने वाले किसी भी व्यक्ति के जाँचने लायक।',
    statDishes:
      'व्यंजन',
    statCountries:
      'देश',
    statDocumented:
      'प्रलेखित',
    statRegistered:
      'पंजीकृत',
    statAuthentic:
      'प्रामाणिक',
    missionAsk:
      'इनमें से {n} का कोई तरीक़ा दर्ज ही नहीं है। किसी जगह के {people} लोग एक को हमेशा के लिए ठीक कर सकते हैं।',
    missionAskBody:
      'किसी ने नहीं लिखा कि वे कैसे बनते हैं — न अंग्रेज़ी में, न किसी भाषा में, कहीं भी नहीं जहाँ मशीन पहुँच सके। न कोई अभिलेखागार, न कोई विश्वकोश और न कोई स्वचालित चीज़ उनकी जगह प्रमाणित कर सकती है; यह अंक-गणित है, कोई नीति नहीं। अगर आप इनमें से कोई पकाते हैं, तो यह कर सकने वाले आप अकेले हैं।',
    recordADishYouKnow:
      'जो व्यंजन आप जानते हैं उसे दर्ज करें',
    howItGetsAuthenticated:
      'प्रमाणन कैसे होता है',
    submissionsNotOpen:
      'भेजना अभी खुला नहीं है — भेजने की कोई जगह ही नहीं। ऊपर का रास्ता बताता है कि खुलने पर क्या होगा।',
    freeAndStayingFree:
      'मुफ़्त, और मुफ़्त ही रहेगा। कोई विज्ञापन नहीं, कोई ट्रैकिंग नहीं, कोई पैसा नहीं लिया जाता। खाता सिर्फ़ किसी व्यंजन की पुष्टि के लिए चाहिए — पढ़ने के लिए कभी नहीं।',
    noRatingsNoComments:
      'कोई रेटिंग नहीं, कोई टिप्पणी नहीं, और कोई एल्गोरिद्म यह तय नहीं करता कि आप क्या देखें — सूचियाँ लोकप्रियता से नहीं, सबूत से शुरू होती हैं। खोले जाने को एक व्यंजन और एक तारीख़ के रूप में गिना जाता है, कभी किसी व्यक्ति के रूप में नहीं।',
    whyASourceCannot:
      'कोई स्रोत किसी व्यंजन को प्रमाणित क्यों नहीं कर सकता',
    whyASourceCannotBody:
      'प्रकाशित प्रलेखन यहाँ {ceiling} से ऊपर नहीं जा सकता, और रिकॉर्ड {threshold} पर प्रामाणिक कहलाता है। यह फ़ासला सिर्फ़ उस जगह से जुड़े लोग ही पाट सकते हैं। हर अंक के पीछे के छह आँकड़े रिकॉर्ड पर छपे होते हैं, ताकि संख्या पर संदेह करने वाला उसे जोड़कर देख सके।',
    whyTheAtlasStops:
      'यही वजह है कि एटलस वहीं रुकता है जहाँ रुकता है। हर मुफ़्त स्रोत पढ़ा जा चुका है — विश्वकोश, पाककला की किताबें, धरोहर रजिस्टर, भू-नाम कोश — और {n} रिकॉर्ड में अब भी यह दर्ज नहीं है कि वे कैसे बनते हैं। जो बचा है वह कभी लिखा ही नहीं गया।',
    levelLocal:
      'प्रामाणिक — स्थानीय',
    levelLocalFull:
      'प्रामाणिक — स्थानीय/पारंपरिक',
    levelRegional:
      'प्रामाणिक — क्षेत्रीय',
    levelVariation:
      'पारंपरिक रूपभेद',
    levelAdaptation:
      'आधुनिक रूपांतर',
    levelFusion:
      'फ़्यूज़न',
    levelUnverified:
      'असत्यापित',
    levelUnverifiedFull:
      'असत्यापित — पर्याप्त प्रमाण नहीं',
    filterAuthenticOnly:
      'केवल प्रामाणिक',
    filterTraditionalVariations:
      'पारंपरिक रूपभेद',
    filterModernAdaptations:
      'आधुनिक रूपांतर',
    filterFusion:
      'फ़्यूज़न',
    filterUnverified:
      'असत्यापित',
    filterAll:
      'सभी',
    geoCountry:
      'देश',
    geoRegion:
      'क्षेत्र',
    geoProvince:
      'प्रांत या ज़िला',
    geoCity:
      'शहर या क़स्बा',
    geoVillage:
      'गाँव या समुदाय',
    chooseRegion:
      'कोई क्षेत्र चुनें',
    chooseProvince:
      'कोई प्रांत या ज़िला चुनें',
    chooseCity:
      'कोई शहर या क़स्बा चुनें',
    chooseVillage:
      'कोई गाँव या समुदाय चुनें',
    typeToSearchLevel:
      'खोजने के लिए लिखें…',
    browseAllTraditions:
      'सभी {n} परंपराएँ देखें',
    geoPlace:
      'जगह',
    noLevelRecorded:
      'उस नाम से अभी कोई {level} दर्ज नहीं है। यहाँ न होने का मतलब है कोई रिकॉर्ड नहीं, यह नहीं कि खाना नहीं।',
    browseCuisine:
      '{cuisine} खानपान',
    browseMadeWith:
      '{ingredient} से बना',
    browseEverything:
      'सब कुछ',
    within:
      '{path} के भीतर',
    chooseCountryHint:
      'कोई देश चुनें · {c} दर्ज',
    chooseCountryHintBroader:
      'कोई देश चुनें · {c} दर्ज, और {b} व्यापक मूल',
    noRecordUnderThatReference:
      'उस संदर्भ से एटलस में कुछ भी दर्ज नहीं है। यहाँ न होने का मतलब है कोई रिकॉर्ड नहीं, यह नहीं कि खाना नहीं।',
    tagTraditionalPreparation:
      '🏺 पारंपरिक विधि',
    tagAtRiskTradition:
      '🕯️ ख़तरे में परंपरा',
    notEligibleForAuthentic:
      'प्रामाणिक वर्गीकरण के योग्य नहीं',
    lookingForWhatItBorrows:
      'जिस परंपरा से यह लिया गया है, वह ढूँढ रहे हैं?',
    howItsDescribed:
      'इसका वर्णन कैसे है',
    howItsMade:
      'यह कैसे बनता है',
    originAndAttribution:
      'मूल और सांस्कृतिक श्रेय',
    nobodyRecordedTechnique:
      'तकनीक किसी ने दर्ज नहीं की — समय, बर्तन, चीज़ों का क्रम। यही इस रिकॉर्ड को असत्यापित से बाहर निकालेगा, और इसके लिए कोई ऐसा चाहिए जो इसे पकाता हो।',
    nobodyHasRecorded:
      'किसी ने दर्ज नहीं किया कि {dish} कैसे बनता है{place}। हम इंटरनेट से सबसे ज़्यादा छपी विधि उठाकर उसे प्रामाणिक कह सकते थे, पर यह एटलस ठीक यही न करने के लिए है — इसलिए रिकॉर्ड वैसा ही रहता है जब तक कोई इसे पकाने वाला इसे न भरे। अगर आप भरें, तो इसे लिखने वाले पहले व्यक्ति आप होंगे।',
    ifIngredientUnavailable:
      'अगर पारंपरिक सामग्री न मिले',
    commonModernSubstitute:
      'आम आधुनिक विकल्प: ',
    adaptationNotAuthentic:
      'यह एक रूपांतर है और इसे प्रामाणिक विधि नहीं माना जाना चाहिए।',
    whatTheInternetServes:
      'इस व्यंजन के लिए इंटरनेट पर ज़्यादातर जो परोसा जाता है, और वह ऊपर की परंपरा से कहाँ हटता है।',
    popularNotAuthentic:
      'लोकप्रिय, पर प्रामाणिक विधि नहीं। ऊपर वाला रूप ही संदर्भ बना रहता है।',
    videosRankedByCloseness:
      'असली वीडियो, इस क्रम में कि पकाने वाला परंपरा के कितने क़रीब है — व्यू की गिनती से नहीं।',
    stillFramesFromVideos:
      'तस्वीरें वीडियो से ही ली गई हैं, इसलिए जो व्यंजन आप देखते हैं वही उस व्यक्ति ने बनाया था।',
    noVideoRecordedYet:
      'इस व्यंजन के लिए परंपरा का कोई वीडियो अभी दर्ज नहीं है।',
    findOneFromThePlace:
      'अगर आपको उस जगह के किसी व्यक्ति का बनाया वीडियो मिले, तो उसे परंपरा जोड़ें से जोड़ा जा सकता है — यही इस व्यंजन को क्रमित वीडियो देगा।',
    siblingsNeitherIsReal:
      'वही व्यंजन, वहाँ अलग से दर्ज जहाँ वह अलग तरह बनता है। इनमें से कोई भी असली नहीं है।',
    doYouKnow:
      'क्या आप {subject} जानते हैं?',
    confirmWhatYouKnow:
      'वही पुष्टि करें जो आप सचमुच जानते हैं। आपको पूरे रिकॉर्ड की ज़िम्मेदारी नहीं लेनी — इसे पकाने वाले किसी व्यक्ति की एक ठोस बात, आम सहमति से ज़्यादा क़ीमती है।',
    recordedThankYou:
      'दर्ज हो गया। धन्यवाद।',
    shownWithYourConnection:
      'यह रिकॉर्ड पर आपके जुड़ाव के साथ दिखता है, ताकि पढ़ने वाले ख़ुद तौल सकें।',
    signedInCounts:
      'साइन इन है — यह बैज के लिए गिना जाएगा।',
    notSignedInNote:
      'साइन इन नहीं है। आप जो लिखेंगे वह आपके जुड़ाव के साथ रिकॉर्ड पर दिखेगा, पर बैज नहीं हिलाएगा: वह गिनती सिर्फ़ साइन इन लोगों से बढ़ती है, ताकि एक व्यक्ति तीन न बन सके।',
    signInSoItCounts:
      'साइन इन करें, ताकि गिना जाए',
    shownOnTheRecord:
      'रिकॉर्ड पर दिखता है',
    whatCanYouConfirm:
      'आप क्या पुष्टि कर सकते हैं?',
    exampleSaid:
      'हम घी डालते हैं, तेल नहीं — और यह ईद पर बनता है, साल भर नहीं।',
    fromTheTownItself:
      'मैं ख़ुद उसी क़स्बे या गाँव से हूँ, सिर्फ़ बड़े इलाक़े से नहीं',
    fromTheTownItselfLabel:
      'मैं ख़ुद उसी क़स्बे या गाँव से हूँ, बड़े इलाक़े से नहीं',
    exampleWhoMakesIt:
      'ईद पर घर में, दादी-नानी बनाती हैं — वैकल्पिक',
    exampleIngredientLines:
      'पका केला\nअंडा\nघी',
    exampleMethodLines:
      'केले को मसल लें।\nफेंटा हुआ अंडा मिलाएँ।',
    inPlace:
      ' {place} में',
    tagAtRiskShort:
      '🕯️ ख़तरे में',
    readThisIn:
      'इसे इस भाषा में पढ़ें',
    communityTranslation:
      'समुदाय का अनुवाद',
    machineTranslation:
      'मशीनी अनुवाद — समुदाय के किसी व्यक्ति ने अभी जाँचा नहीं है',
    notTranslatedYet:
      'अभी अनूदित नहीं',
    aDotMarks:
      'बिंदु उस भाषा को दर्शाता है जिसमें यह रिकॉर्ड पहले ही अनूदित है।',
    opensOnceMoreRecords:
      '{language} तब खुलेगी जब उसमें {n} और रिकॉर्ड पढ़े जा सकेंगे।',
    noTranslationService:
      'इस बिल्ड से कोई अनुवाद सेवा जुड़ी नहीं है, इसलिए कुछ भी अपने आप अनूदित नहीं हो सकता। वैसे भी जो इस व्यंजन को पकाता है, उसका अनुवाद ज़्यादा क़ीमती है — वह परंपरा जोड़ें से दिया जा सकता है।',
    whatTheseTermsMean:
      'इन शब्दों का मतलब',
    signedIn:
      'साइन इन है',
    signOut:
      'साइन आउट',
    signedInSignOut:
      'साइन इन है। साइन आउट करें।',
    confirmationsCount:
      'आपकी पुष्टियाँ बैज के लिए गिनी जाती हैं।',
    signIn:
      'साइन इन',
    signInSoConfirmationsCount:
      'साइन इन करें, ताकि आपकी पुष्टियाँ गिनी जाएँ',
    onlySignedInMovesBadge:
      'बैज सिर्फ़ साइन इन लोगों की पुष्टियों से हिलता है।',
    watchAtSource:
      'स्रोत पर देखें ↗',
    originalAudio:
      'मूल ऑडियो',
    creatorsOwnTranslation:
      'बनाने वाले का अपना अनुवाद',
    translatedCaptions:
      'अनूदित उपशीर्षक',
    languageUnknown:
      'भाषा अज्ञात',
    ingredientsInThisVideo:
      'इस वीडियो में इस्तेमाल सामग्री',
    weDontInventOne:
      'इस वीडियो को बनाने वाले ने न सामग्री की सूची छापी न लिखी हुई विधि, और हम गढ़ते नहीं। ऊपर की पारंपरिक विधि नीचे दिए प्रलेखित स्रोतों से आती है।',
    captureFromVideo:
      'इस वीडियो से सामग्री और चरण दर्ज करें →',
    dietaryPreference:
      'आहार वरीयता',
    narrowItDown:
      'और छाँटें',
    anyDiet:
      'कोई भी आहार',
    whenItsEaten:
      'यह कब खाया जाता है',
    anyOccasion:
      'कोई भी अवसर',
    alsoCalled:
      'इसे यह भी कहते हैं',
    notATranslationOfOurs:
      'हर नाम उस भाषा के अपने विश्वकोश लेख में इस्तेमाल हुआ नाम है — हमारा अनुवाद नहीं, और ऊपर वाले नाम की जगह कभी नहीं लेता। वहाँ पढ़ने के लिए किसी एक पर टैप करें।',
    relatedTraditions:
      'संबंधित परंपराएँ',
    relatedTraditionsNote:
      'ऐसे रिकॉर्ड जिनकी इसके साथ जगह, परंपरा या कोई सामग्री साझा है। हर एक बताता है कि कौन-सी।',
    scoreCannotSettle:
      'प्रमाण कितने मज़बूत हैं इसका अनुमान — यह दावा नहीं कि कोई अंक सांस्कृतिक सच्चाई तय कर सकता है।',
    notScored:
      'अंक नहीं',
    navAtlasNote:
      'क्या शामिल है, और कितने भरोसे के साथ',
    navProposeNote:
      'ऐसा खाना जिसका एटलस में रिकॉर्ड नहीं',
    navConfirmNote:
      'ऐसे व्यंजन जो किसी जानने वाले का इंतज़ार कर रहे हैं',
    navSupportNote:
      'चलाने में क्या ख़र्च होता है, और कौन देता है',
    confirmPrompt:
      'क्या आपके यहाँ इसे ऐसे ही बनाते हैं?',
    confirmAskBody:
      'अगर आप इसे वहीं पकाते हैं जहाँ से यह आता है, तो आपका पुष्टि करना या सुधारना ही वह चीज़ है जो किसी रिकॉर्ड को असत्यापित से बाहर निकालती है। जहाँ आपका तरीक़ा अलग हो, वह इसके साथ दर्ज होता है — इसकी जगह नहीं।',
    confirmYes:
      'हाँ, यही मेल खाता है',
    confirmNo:
      'मेरे यहाँ इसे अलग तरह बनाते हैं',
    confirmPlacePrompt:
      'क्या यह व्यंजन सचमुच वहीं का है जहाँ का हम बता रहे हैं?',
    confirmPlaceBody:
      'यह कैसे बनता है, किसी ने लिखा ही नहीं, इसलिए अभी सहमत होने के लिए कुछ है ही नहीं। जगह वह है जो यह रिकॉर्ड दावा करता है, और उसकी पुष्टि अपने आप में क़ीमती है — यह छह प्रमाण-जाँचों में से एक है।',
    confirmPlaceYes:
      'हाँ, यह यहीं का है',
    confirmPlaceNo:
      'नहीं, यह कहीं और का है',
    standingMet:
      '{place} से जुड़े {n} लोगों ने इसकी पुष्टि की — बैज के लिए यही संख्या चाहिए।',
    standingNobody:
      'अभी तक कोई नहीं',
    standingOne:
      'अब तक एक व्यक्ति',
    standingMany:
      'अब तक {n} लोग',
    standingNeed:
      '{soFar}। बैज के लिए {need} चाहिए, यानी {place} से जुड़े {people} इसे पूरा कर देंगे।',
    onePersonMore:
      'एक व्यक्ति और',
    morePeople:
      '{n} लोग और',
    contestedNote:
      'ढूँढ़ने की सुविधा के लिए यहाँ रखा गया। {n} जगहों का इस व्यंजन पर प्रलेखित दावा है — इनमें से कोई तय नहीं हुआ, और सब नीचे दिए हैं।',
    relatedAlsoFrom:
      'यह भी {place} से',
    relatedAlsoCuisine:
      'यह भी {cuisine}',
    relatedSharesIngredients:
      '{n} सामग्रियाँ समान',
    relatedAlsoUses:
      'इसमें भी {ingredient}',
    relatedAlsoCategory:
      'यह भी {category}',
    authenticVersion:
      'प्रामाणिक रूप',
    thePublishedRecipe:
      'प्रकाशित विधि',
    whyThisIsAnAdaptation:
      'यह रूपांतर क्यों है',
    whyConsideredAuthentic:
      'इसे प्रामाणिक क्यों माना जाता है?',
    whatThisRecordIs:
      'यह रिकॉर्ड क्या है',
    stepSubmit:
      'भेजें',
    stepWhatExists:
      'क्या मौजूद है',
    stepAssessment:
      'आकलन',
    stepValidation:
      'पुष्टि',
    findingAggregatorTitle:
      'विधियाँ जुटाने वाला पन्ना',
    findingAggregatorTag:
      'लोकप्रिय दावेदार',
    findingAggregatorNote:
      'सबसे ऊपर आने वाला नतीजा। लिखने वाला मालाबार से कोई जुड़ाव नहीं बताता; घी की जगह मक्खन डालता है।',
    findingVideoTitle:
      'मलयालम रसोई चैनल का वीडियो',
    findingVideoTag:
      'स्थानीय स्रोत',
    findingVideoNote:
      'केरल में फ़िल्माया, मलयालम में बोला गया, घी और नेंद्रन केला — जैसा बताया गया है।',
    findingGapTitle:
      'क़स्बे के स्तर का कोई रिकॉर्ड नहीं मिला',
    findingGapTag:
      'कमी',
    findingGapNote:
      'ख़ास कोझिकोड में यह कैसे बनता है, इसका कोई प्रलेख नहीं। यह प्रविष्टि पहली होगी।',
    checkOriginLabel:
      'भौगोलिक मूल',
    checkOriginNote:
      'मालाबार, कोझिकोड — भेजने वाले ने बताया और वीडियो स्रोत से मेल खाता है।',
    checkLocalPrepLabel:
      'स्थानीय विधि',
    checkLocalPrepNote:
      'घर की रसोई के रूप में बताया गया — इफ़्तार और पारिवारिक अवसरों के लिए।',
    checkIngredientsLabel:
      'पारंपरिक सामग्री',
    checkIngredientsNote:
      'नेंद्रन केला, अंडे, घी — स्थानीय स्रोत वाले वीडियो से मेल खाता है।',
    checkTechniqueLabel:
      'पारंपरिक तकनीक',
    checkTechniqueNote:
      'धीमी आँच, अंगारों से दबा हुआ ढक्कन।',
    checkDocumentationLabel:
      'ऐतिहासिक या सांस्कृतिक प्रलेखन',
    checkDocumentationNote:
      'बहुत कम। न कोई अध्ययन मिला, न अभिलेख।',
    checkLocalSourceLabel:
      'स्थानीय स्रोत',
    checkLocalSourceNote:
      'भेजने वाला बताता है कि वह कोझिकोड में जन्मा है और वहीं पकाता है।',
    checkCommunityLabel:
      'समुदाय की पुष्टि',
    checkCommunityNote:
      'अभी माँगी नहीं गई। इसीलिए रिकॉर्ड को अभी प्रामाणिक नहीं कहा जा सकता।',
    validatorHomeCook:
      'घर की रसोइया, कोझिकोड',
    validatorHomeCookSaid:
      'सामग्री और ढक्कन पर अंगारे वाली विधि की पुष्टि की।',
    validatorBakery:
      'बेकरी के मालिक, तलश्शेरी',
    validatorBakerySaid:
      'पुष्टि करते हैं, बताते हैं कि उनके यहाँ चीनी कम पड़ती है।',
    validatorWriter:
      'खानपान पत्रकार, केरल',
    validatorWriterSaid:
      'मालाबार के घरेलू व्यंजन के रूप में पुष्ट; प्रलेखन सचमुच बहुत कम है।',
    validatorPending:
      'दो और समीक्षक बुलाए गए',
    validatorPendingSaid:
      'उत्तर की प्रतीक्षा — रिकॉर्ड उनके बिना भी प्रकाशित होता है।',
    photoCheckedNote:
      'रिकॉर्ड भेजे जाने पर Commons से मिलान किया जाता है, और छायाकार तथा लाइसेंस के साथ दिखाया जाता है। जब तक समुदाय पुष्टि न करे यह असत्यापित ही रहती है — ठीक जैसे विधि रहती है।',
    mostPublishedNote:
      'सबसे ज़्यादा छपा रूप लोकप्रिय दावेदार माना जाता है। इससे वह प्रामाणिक रिकॉर्ड नहीं बन जाता।',
    sevenChecksNote:
      'सात जाँचें, हर एक या तो उत्तरित या खुली छोड़ी हुई। खुली जाँचें भरोसा घटाती हैं — उन्हें अनुमान से कभी नहीं भरा जाता।',
    draftConfidence:
      '/100 कच्चा भरोसा',
    unverifiedPendingTag:
      '⚪ असत्यापित — समुदाय की पुष्टि बाक़ी',
    oneSubmitterNote:
      'उस जगह का एक भेजने वाला प्रमाण है, सबूत नहीं। जब तक समुदाय के लोग पुष्टि न करें, रिकॉर्ड असत्यापित ही रहता है।',
    threeConfirmationsNote:
      'उस जगह रहने या पकाने वाले तीन लोगों की पुष्टि किसी रिकॉर्ड को असत्यापित से बाहर ले आती है।',
    conflictingAccountsNote:
      'आपस में न मिलने वाले विवरण दोनों रखे जाते हैं। रिकॉर्ड उन परंपराओं में बँट जाता है जिन्हें लोगों ने सचमुच बताया — हर क्षेत्र या समुदाय की एक — और किसी रूप को सच्चा घोषित नहीं किया जाता।',
    nowhereToSendNote:
      'इसे भेजने की कोई जगह ही नहीं है। मुफ़्त स्रोतों में जो कुछ था, एटलस सब पढ़ चुका है, इसलिए अब जो कमी है वह ऐसा खाना है जिसे किसी ने लिखा ही नहीं — यानी यह फ़ॉर्म ही वह रास्ता है जिससे यह बढ़ेगा, और जैसे ही भेजने की जगह होगी, इसे चालू कर दिया जाएगा।',
    whereTheExampleEndsUp:
      'उदाहरण वाला रिकॉर्ड यहीं पहुँचता है: प्रकाशित, अपने प्रमाण सामने रखते हुए, खुली जाँचें नाम लेकर बताते हुए, और हर दावा उस तक पहुँचाने योग्य जिसने वह कहा।',
    confirmedBy:
      'पुष्टि करने वाले',
    nothingMatchesAll:
      'इन सबसे एक साथ कुछ भी मेल नहीं खाता।',
    mostOfYourListFirst:
      'पहले वे जिनमें आपकी सूची सबसे ज़्यादा लगती है',
    translatesTheAppsWords:
      'ऐप के अपने शब्दों का अनुवाद करता है। व्यंजन उसी भाषा में रहते हैं जिसमें वे दर्ज हुए — हर रिकॉर्ड के अपने अनुवाद नियंत्रण हैं।',
    byNameAndPlaceOnly:
      'ये एटलस में सिर्फ़ नाम और जगह के साथ हैं। ये कैसे बनते हैं यह किसी ने दर्ज नहीं किया, इसलिए इनके पास न विधि है न अंक।',
    wikipediaViewsNote:
      'पिछले एक साल में अंग्रेज़ी विकिपीडिया पर हर व्यंजन के बारे में कितने लोगों ने पढ़ा। यह रुचि है — न प्रामाणिकता, न यह कि कोई व्यंजन कितना खाया जाता है — और इसका झुकाव उसी ओर है जो अंग्रेज़ी बोलने वाले खोजते हैं। हर एक का वर्गीकरण देखने के लिए उस पर जाएँ।',
    requiredDishName:
      'व्यंजन का नाम',
    requiredCountry:
      'देश',
    requiredYourName:
      'आपका नाम',
    requiredYourConnection:
      'उस जगह से आपका जुड़ाव',
    requiredWhatYouConfirm:
      'आप क्या पुष्टि कर सकते हैं',
    bandNotScored:
      'अंक नहीं',
    bandUnder50:
      '50 से कम',
    band50to74:
      '50 – 74',
    band75Plus:
      '75 और ऊपर',
    reviewCapitals:
      'यह पूरा बड़े अक्षरों में लिखा है।',
    reviewCapitalsConsider:
      'सामान्य लेखन पढ़ने में बेहतर है और अनुवाद में आसान। व्यंजन का नाम वैसा ही रहेगा जैसा आपने लिखा।',
    reviewRepeats:
      'एक ही अक्षर लगातार कई बार आया है।',
    reviewRepeatsConsider:
      'देख लें कि कोई कुंजी अटकी तो नहीं थी।',
    reviewShort:
      'विधि बहुत छोटी है।',
    reviewShortConsider:
      'लिखें कि इसे बनाने के लिए किसी को क्या करना पड़ेगा, इंतज़ार समेत। बिना विधि वाला रिकॉर्ड विधियों की शेल्फ़ तक नहीं पहुँच सकता।',
    groupSummaryCountries:
      '{c} देश · {n} परंपराएँ',
    groupSummaryOrigins:
      '{c} मूल · {n} परंपराएँ',
    metricTotalTitle:
      'दर्ज परंपराएँ',
    metricTotalCounts:
      'परंपरा यानी किसी एक जगह पर किसी खाने को बनाने का एक तरीक़ा। वही व्यंजन दो क्षेत्रों में अलग-अलग बनता है तो वे दो परंपराएँ हैं, और दोनों रखी जाती हैं।',
    metricTotalMethod:
      'चुने हुए संग्रह और चार आयातित स्रोतों का हर वह रिकॉर्ड जिसके पास दिखाने को कुछ है — कम से कम एक जगह और एक नाम। जो पंक्तियाँ अभी संवर्धन की प्रतीक्षा में हैं, उन्हें रोका जाता है और गिना नहीं जाता।',
    metricTotalCaveat:
      'यह दुनिया के अलग-अलग खानों की गिनती नहीं है, और न ही इस बात का माप कि एटलस कितना जानता है। इनमें से ज़्यादातर रिकॉर्ड के पास एक नाम और एक देश है, बस। जिनके पास लिखी हुई विधि है उनका अनुपात ही वह संख्या है जो बताती है कि यह एटलस है या नामों की सूची।',
    metricCountriesTitle:
      'देश',
    metricCountriesCounts:
      'सभी रिकॉर्डों में नामित अलग-अलग देश, आयात के स्थान-नामों को सुलझाने के बाद।',
    metricCountriesMethod:
      'हर रिकॉर्ड का देश-क्षेत्र, दोहराव हटाकर, केवल उन्हीं मूलों को गिनते हुए जो देश हैं। किसी स्रोत ने जिन ऐतिहासिक और राष्ट्र-से-ऊपर की प्रविष्टियों का इस्तेमाल किया — उस्मानी साम्राज्य, लेवांट, मेसोअमेरिका — वे अपने रिकॉर्डों पर ही रहती हैं, उन्हें किसी आधुनिक राज्य को नहीं सौंपा जाता जिसका अनुमान लगाना पड़ता, और यहाँ उन्हें नहीं गिना जाता। उन्हें गिनने से इस संख्या में बत्तीस जुड़ते थे, और उनमें से हर एक काल्पनिक था।',
    metricCountriesCaveat:
      'व्याप्ति गहराई नहीं है। एक ही रिकॉर्ड के बल पर कोई देश यहाँ आ जाता है, इसलिए यह गिनता है कि एटलस कहाँ-कहाँ पहुँचा, यह नहीं कि वह कहाँ अच्छा है। इसे नीचे की संकेंद्रण संख्या के साथ पढ़ें, जो बताती है कि कुल कितना एकतरफ़ा है।',
    metricAtRiskTitle:
      'ख़तरे में परंपराएँ',
    metricAtRiskCounts:
      'वे रिकॉर्ड जिनमें किसी स्रोत के अपने शब्द परंपरा को घटती, मिटती या अब न चलती हुई बताते हैं।',
    metricAtRiskMethod:
      'हर लेख की भूमिका और इतिहास पढ़कर स्पष्ट गिरावट खोजी जाती है — "अब कम ही बनता है", "बचा हुआ आख़िरी उत्पादक" — और वे लगभग-मेल छोड़ दिए जाते हैं जिनका मतलब कुछ और है, जैसे सामग्री के रूप में इस्तेमाल कोई संकटग्रस्त प्रजाति या बंद हो चुकी रेस्तराँ शृंखला। जिस वाक्य से यह पकड़ा गया, वह प्रमाण के तौर पर रिकॉर्ड में रखा जाता है और उसी के साथ दिखाया जाता है।',
    metricAtRiskCaveat:
      'यह एक निचली सीमा है, जनगणना नहीं, और सच्चाई से बहुत नीचे है। यह सिर्फ़ वही गिरावट पकड़ सकता है जो किसी ने पहले से ऐसे पाठ में लिखी हो जिसे हमने पढ़ा है; चार परिवारों की सँभाली और कभी दर्ज न हुई परंपरा यहाँ कुछ भी दर्ज नहीं होती। अकेले Slow Food के आर्क ऑफ़ टेस्ट में लगभग छह हज़ार संकटग्रस्त खाद्य सूचीबद्ध हैं — इस संख्या का एक हज़ार गुना।',
    metricDocumentedTitle:
      'दर्ज विधि है',
    metricDocumentedCounts:
      'वे रिकॉर्ड जिनमें क्रमबद्ध विधि है — वे चरण जिनका कोई पालन करके इसे बनाए।',
    metricDocumentedMethod:
      'चुने हुए रिकॉर्डों की विधि लिखी गई है और समुदाय के साथ जाँची गई है। आयातित रिकॉर्डों में यह तभी है जब उनके लिए कोई प्रकाशित विधि मौजूद हो; विश्वकोश का वह अनुच्छेद जो बताता है कि कोई व्यंजन आम तौर पर कैसे बनता है, गद्य के रूप में रखा जाता है और जानबूझकर चरणों में नहीं बदला जाता, क्योंकि किसी वर्णन को विधि बताना उसमें ऐसी सटीकता का दावा है जो उसमें नहीं है।',
    metricDocumentedCaveat:
      'विधि का होना यह नहीं बताता कि वह पारंपरिक है या नहीं। उसी के लिए भरोसे का अंक है, और विधि वाले ज़्यादातर रिकॉर्ड आधुनिक रूपांतर में वर्गीकृत हैं।',
    metricLocatedTitle:
      'देश से नीचे के स्तर पर रखा गया',
    metricLocatedCounts:
      'वे रिकॉर्ड जो सिर्फ़ देश नहीं, बल्कि कोई क्षेत्र, प्रांत, शहर या गाँव बताते हैं।',
    metricLocatedMethod:
      'ऐसा कोई भी रिकॉर्ड जिसकी जगह में देश के नीचे कोई स्तर भरा हुआ हो।',
    metricLocatedCaveat:
      'प्रामाणिकता की भौगोलिक गहराई होती है, और देश तो बस एक शुरुआत है — "कोझिकोड" एक रिकॉर्ड है, "भारत" एक शीर्षक। ऊँचा कुल और यहाँ कम अनुपात मिलकर एक चौड़े और उथले एटलस का वर्णन करते हैं।',
    metricIllustratedTitle:
      'तस्वीर है',
    metricIllustratedCounts:
      'वे रिकॉर्ड जिनके पास ऐसी छवि है जिसे दिखाने का ऐप को अधिकार है।',
    metricIllustratedMethod:
      'Wikidata से, व्यंजन के अपने विकिपीडिया लेख से, या पकाने वाले किसी व्यक्ति द्वारा Wikimedia Commons के ज़रिए दी गई। हर एक अपने छायाकार और लाइसेंस के साथ रखी जाती है, और किसी को सत्यापित नहीं ठहराया जाता: नाम से मिली या संपादक की चुनी हुई छवि इस बात का अच्छा प्रमाण है कि वह वही व्यंजन दिखाती है — यह इस ऐप की पुष्टि नहीं है।',
    metricIllustratedCaveat:
      'तस्वीर प्रामाणिकता का प्रमाण नहीं है। वह किसी के पकाए हुए एक थाल को दिखाती है, जो रिकॉर्ड में बताई परंपरा हो भी सकती है और नहीं भी।',
    metricFilmedTitle:
      'क्रमित वीडियो है',
    metricFilmedCounts:
      'ऐसे रिकॉर्ड जिनके पास कम से कम एक वीडियो है, इस क्रम में कि पकाने वाला परंपरा के कितने क़रीब है।',
    metricFilmedMethod:
      'स्थानीयता से क्रम — पकाने वाला कहाँ है, किस भाषा में बोलता है, सामग्री और बर्तन रिकॉर्ड से मेल खाते हैं या नहीं। कभी भी व्यू, लाइक या सब्सक्राइबर से नहीं।',
    metricFilmedCaveat:
      'यह क्रम परंपरा से नज़दीकी का है, फ़िल्मांकन की गुणवत्ता का नहीं, और सबसे ऊपर वाला वीडियो अक्सर सबसे कम चमकदार होता है।',
    metricAssessedTitle:
      'प्रामाणिक के रूप में वर्गीकृत',
    metricAssessedCounts:
      'वे रिकॉर्ड जो प्रमाण-जाँचों से होकर प्रामाणिक — स्थानीय या प्रामाणिक — क्षेत्रीय तक पहुँचे।',
    metricAssessedMethod:
      'सात जाँचें, हर एक या तो उत्तरित या खुली छोड़ी हुई, और खुली जाँचें अनुमान से भरी जाने के बजाय भरोसा घटाती हैं। तकनीक और समुदाय की पुष्टि किसी आयात से कभी अनुमानित नहीं की जातीं, जिससे कोई आयातित रिकॉर्ड अपने बल पर जितना पहुँच सकता है, उस पर सीमा लग जाती है।',
    metricAssessedCaveat:
      'यहाँ का अनुपात कम होना ईमानदारी है, विफलता नहीं। सूची का बड़ा हिस्सा आयातित और बिना आकलन का है, और उन रिकॉर्डों को इसलिए प्रामाणिक कहना कि वे किसी प्रतिष्ठित स्रोत से आए हैं — ठीक वही छोटा रास्ता है जिसे नकारने के लिए यह पैमाना बना है।',
    metricConcentrationTitle:
      'संकेंद्रण',
    metricConcentrationCounts:
      'पूरी सूची का वह हिस्सा जो उसके सबसे बड़े अकेले देश के पास है।',
    metricConcentrationMethod:
      'सबसे ज़्यादा प्रतिनिधित्व वाले देश के रिकॉर्ड, कुल से भाग देकर।',
    metricConcentrationCaveat:
      'यह दर्शाता है कि कौन-से देश खुले खाद्य रजिस्टर रखते हैं, यह नहीं कि दुनिया का खाना कहाँ है। अकेला इटली लगभग 4,400 पंजीकृत पारंपरिक उत्पाद प्रकाशित करता है; ज़्यादातर देश एक भी नहीं करते, और यहाँ उनकी अनुपस्थिति काग़ज़ात की कमी है, पकाने की नहीं।',
    metricConfidenceTitle:
      'भरोसा',
    metricConfidenceCounts:
      'सूची 0–100 के प्रमाण अंक पर कैसे बँटी है।',
    metricConfidenceMethod:
      'चुने हुए रिकॉर्ड प्रमाण-जाँचों से अंकित होते हैं। आयातित रिकॉर्ड सिर्फ़ वहीं अंकित होते हैं जहाँ संवर्धन को अंक देने लायक़ प्रमाण मिला, और बाक़ी जगह उन्हें कोई डिफ़ॉल्ट देने के बजाय बिना अंक छोड़ दिया जाता है।',
    metricConfidenceCaveat:
      '"अंक नहीं" कहीं आगे सबसे बड़ी पट्टी है और वैसी ही रहेगी। इसका मतलब है कि रिकॉर्ड का अभी किसी ने आकलन नहीं किया — यह नहीं कि उसे कम अंक मिले, और न यह कि खाना संदिग्ध है।',
    metricByContinentTitle:
      'रिकॉर्ड कहाँ हैं',
    metricByContinentCounts:
      'महाद्वीप के हिसाब से रिकॉर्ड, हर रिकॉर्ड एक बार। कोई परंपरा उस देश के महाद्वीप पर बैठती है जहाँ वह दर्ज है, उस पर नहीं जहाँ से वह सफ़र करके आई हो।',
    metricByContinentMethod:
      'हर रिकॉर्ड के देश से, एक देश-से-महाद्वीप मानचित्र के ज़रिए जो लगभग 200 राज्यों को समेटता है, ऐतिहासिक समेत। राष्ट्र-से-ऊपर और विवादित प्रविष्टियाँ किसी महाद्वीप में ठूँसने के बजाय समूहित की जाती हैं।',
    metricByContinentCaveat:
      'यह स्रोतों का नक़्शा है, दुनिया के पाककर्म का नहीं। यूरोप आगे इसलिए है क्योंकि यूरोपीय रजिस्टर ऑनलाइन और खुले हैं — यह अभिलेखों के बारे में एक तथ्य है।',
    howIsThisCounted:
      'यह कैसे गिना जाता है?',
    hideHowThisIsCounted:
      'गिनने का तरीक़ा छिपाएँ',
    stapleGrains: 'अनाज',
    stapleRoots: 'कंद',
    staplePulses: 'दालें',
    stapleDairy: 'दुग्ध',
    stapleMeatFish: 'मांस और मछली',
    stapleVegetables: 'सब्ज़ियाँ',
    stapleAromatics: 'सुगंधी',
    stapleSweetSour: 'मीठा और खट्टा',
    stapleRice: 'चावल',
    stapleWheat: 'गेहूँ',
    stapleMaize: 'मक्का',
    stapleMillet: 'बाजरा',
    stapleSorghum: 'ज्वार',
    stapleBarley: 'जौ',
    stapleOats: 'जई',
    stapleBuckwheat: 'कुट्टू',
    stapleTeff: 'तेफ़',
    staplePotato: 'आलू',
    stapleCassava: 'कसावा',
    stapleSweetPotato: 'शकरकंद',
    stapleYam: 'रतालू',
    stapleTaro: 'अरबी',
    staplePlantain: 'कच्चा केला',
    stapleLentil: 'मसूर',
    stapleChickpea: 'चना',
    stapleSoy: 'सोया',
    stapleTofu: 'टोफ़ू',
    stapleBlackBean: 'काली फलियाँ',
    stapleMungBean: 'मूँग',
    staplePigeonPea: 'अरहर',
    stapleMilk: 'दूध',
    stapleYoghurt: 'दही',
    stapleCheese: 'चीज़',
    staplePaneer: 'पनीर',
    stapleGhee: 'घी',
    stapleButter: 'मक्खन',
    stapleCoconut: 'नारियल',
    stapleChicken: 'चिकन',
    stapleBeef: 'गोमांस',
    staplePork: 'सूअर का मांस',
    stapleLamb: 'भेड़ का मांस',
    stapleGoat: 'बकरी',
    stapleFish: 'मछली',
    staplePrawn: 'झींगा',
    stapleEgg: 'अंडे',
    stapleOnion: 'प्याज़',
    stapleGarlic: 'लहसुन',
    stapleGinger: 'अदरक',
    stapleChilli: 'मिर्च',
    stapleLemongrass: 'लेमनग्रास',
    stapleTomato: 'टमाटर',
    stapleAubergine: 'बैंगन',
    stapleCabbage: 'पत्तागोभी',
    stapleSpinach: 'पालक',
    stapleOkra: 'भिंडी',
    stapleTamarind: 'इमली',
    stapleHoney: 'शहद',
    stapleJaggery: 'गुड़',
    stapleDate: 'खजूर',
    stapleLemon: 'नींबू',
    stapleOlive: 'जैतून',
    dietVegan: 'वीगन',
    dietVegetarian: 'शाकाहारी',
    dietSeafood: 'समुद्री भोजन',
    dietMeat: 'मांसाहारी',
    dietUnclassified: 'वर्गीकृत नहीं',
    dietPoultry: 'मुर्गी',
    dietPork: 'सूअर',
    dietBeef: 'गोमांस और लाल मांस',
    dietLambGoat: 'भेड़ और बकरी',
    dietGame: 'शिकार का मांस',
    dietFish: 'मछली',
    dietShellfish: 'शंख-मछली',
    dietOtherSeafood: 'अन्य समुद्री भोजन',
    dietDairy: 'दुग्ध पदार्थ है',
    dietEgg: 'अंडा है',
    dietHoney: 'शहद है',
    mealBreakfast: 'नाश्ता',
    mealLunch: 'दोपहर का खाना',
    mealDinner: 'रात का खाना',
    mealSupper: 'हल्का रात्रिभोज',
    mealSnack: 'नाश्ता-हल्का',
    mealStreetFood: 'सड़क का खाना',
    mealCelebration: 'उत्सव और भोज',
    mealAnytime: 'किसी भी समय',
    mealUnclassified: 'दर्ज नहीं',
    searchModeFind:
      'कोई व्यंजन खोजें',
    searchModePantry:
      'जो है उसी से पकाएँ',
    ingredientsYouHave:
      'आपके पास मौजूद सामग्री',
    nTraditions:
      '{n} परंपराएँ',
    nothingYet:
      'अभी कुछ नहीं',
    methodRecorded:
      ' · विधि दर्ज',
    noMethodYet:
      ' · अभी विधि नहीं',
    showMoreLeft:
      'और दिखाएँ — {n} बचे',
    showNMore:
      '{n} और दिखाएँ',
    methodAsPublished:
      'विधि जैसी प्रकाशित हुई। आधुनिक उपकरण और शॉर्टकट भी उसी का हिस्सा हैं।',
    methodTraditional:
      'पारंपरिक विधि, जिसमें कोई आधुनिक शॉर्टकट नहीं बिठाया गया।',
    everythingClassified:
      '{what} में वर्गीकृत सब कुछ',
    everythingFrom:
      '{place} का सब कुछ',
    everythingRecordedAs:
      '{what} के रूप में दर्ज सब कुछ',
    everythingMadeWith:
      '{ingredient} से बना सब कुछ',
    seeEverything:
      '{label} — सब देखें',
    noPhotographOnRecord:
      '{label} — रिकॉर्ड में कोई तस्वीर नहीं',
    scoreOutOf100:
      '{label}: 100 में से {value}',
    removeFilter:
      '{key} फ़िल्टर हटाएँ',
    anywhereInTheAtlas:
      ' एटलस में कहीं भी',
    absenceOfRecords:
      '। यह रिकॉर्ड की अनुपस्थिति है, खाने की नहीं — हम अनुमान लगाने के बजाय कहना पसंद करते हैं कि हमें नहीं पता।',
    narrowToA:
      '{level} तक सीमित करें · {n} दर्ज',
    fromTheTown:
      ' — उसी क़स्बे से',
    showFewer:
      'कम दिखाएँ',
    readAboutOnWikipedia:
      '{name} के बारे में {language} विकिपीडिया पर पढ़ें',
    languageChangeIt:
      'भाषा: {language}। बदलें।',
    perCentTranslated:
      '{language}, {n} प्रतिशत अनूदित',
    translateThisRecord:
      'इस रिकॉर्ड का अनुवाद करें',
    translating:
      'अनुवाद हो रहा है…',
    translate:
      'अनुवाद करें',
    translateThisConfirmation:
      'इस पुष्टि का {language} में अनुवाद करें',
    couldNotTranslate:
      'अनुवाद नहीं हो सका — फिर कोशिश करें',
    howThisIsCountedFor:
      '{figure} कैसे गिना जाता है',
    countOfTotal:
      '{label}: {total} में से {count}',
    watchAtSourceCreator:
      '{creator} को स्रोत पर देखें',
    stillFromCreator:
      '{creator} के वीडियो से तस्वीर',
    thatDidNotSend:
      'यह भेजा नहीं जा सका।',
    containsAlcohol:
      'इसमें शराब है',
    nothingElseRequired:
      'बाक़ी सब कुछ स्वागत योग्य है और कुछ भी ज़रूरी नहीं — यह जानना कि कोई खाना कहाँ का है और उसे किसी ने लिखा नहीं, यहाँ के किसी भी स्रोत के पास जितना है उससे पहले ही ज़्यादा है।',
    opensTheFormPrefilled:
      'यह फ़ॉर्म को उसके स्रोत पर खोलता है, आपके लिखे हुए के साथ पहले से भरा हुआ। यह ऐप आपके बारे में कुछ नहीं जुटाता, और जब तक उस जगह के लोग पुष्टि न करें तब तक कुछ प्रकाशित नहीं होता।',
    scoreDimGeographic:
      'भौगोलिक जुड़ाव',
    scoreDimIngredients:
      'पारंपरिक सामग्री',
    scoreDimTechnique:
      'पारंपरिक तकनीक',
    scoreDimLocalSource:
      'स्थानीय स्रोत',
    scoreDimDocumentation:
      'सांस्कृतिक प्रलेखन',
    scoreDimCommunity:
      'समुदाय की पुष्टि',
    photoFromWikidata:
      'इस व्यंजन की अपनी Wikidata प्रविष्टि से जुड़ी — नाम से खोजी हुई नहीं',
    photoFromArticle:
      'इस व्यंजन के अपने विश्वकोश लेख की मुख्य तस्वीर',
    photoFromRecipe:
      'इसी विधि के अपने पन्ने पर प्रकाशित',
    photoFromSearch:
      'Wikimedia Commons पर नाम से मिली — विषय की पुष्टि नहीं है',
    photoFromUnknown:
      'स्रोत दर्ज नहीं — विषय को अपुष्ट ही मानें',
    noTranslationRecorded:
      'इस विवरण का अभी कोई अनुवाद दर्ज नहीं है, इसलिए यह {language} में दिख रहा है — उसी भाषा में जिसमें इसे दर्ज किया गया। किण्वन के समय पर मशीन के अनुमान से बेहतर हमें आपको मूल दिखाना लगता है।',
    machineTranslationBy:
      '{translator} द्वारा मशीनी अनुवाद। समुदाय के किसी व्यक्ति ने इसे जाँचा नहीं — सामग्री और बर्तनों के नाम मूल रूप में ही रखे गए हैं।',
    translatedBy:
      '{translator} द्वारा अनूदित। सामग्री और बर्तनों के नाम मूल रूप में ही रखे गए हैं।',
    videoOriginalAudio:
      '{language} में बोला गया — पकाने वाले की अपनी भाषा। कुछ भी अनूदित नहीं है।',
    videoCreatorTrack:
      'बनाने वाले ने {language} में एक ऑडियो ट्रैक प्रकाशित किया है। यह स्रोत पर उसी ट्रैक में खुलता है — अनुवाद उन्हीं का है, हमारा नहीं।',
    videoPlatformCaptions:
      '{spoken} में बोला गया। मूल ऑडियो के ऊपर मशीन से अनूदित {preferred} उपशीर्षकों के साथ खुलता है — पकाने वाले की आवाज़ बदली नहीं जाती, और अनुवाद वीडियो मंच का है, किसी व्यक्ति का नहीं।',
    videoLanguageUnknown:
      'इस वीडियो की बोली जाने वाली भाषा हमारे पास दर्ज नहीं है, इसलिए हम {language} का वादा नहीं कर सकते। यह स्रोत पर खुलता है, जहाँ मंच के अपने उपशीर्षक विकल्प लागू होते हैं।',
    figureDocumented:
      'दर्ज विधि है',
    figureDocumentedNote:
      'वह संख्या जो बताती है कि यह एटलस है या नामों की सूची। बाक़ी सब उसके बाद आता है।',
    figureLocated:
      'देश से नीचे के स्तर पर रखा गया',
    figureLocatedNote:
      'प्रामाणिकता की भौगोलिक गहराई होती है। "कोझिकोड" एक रिकॉर्ड है; "भारत" तो बस एक शुरुआत है।',
    figureIllustrated:
      'तस्वीर है',
    figureIllustratedNote:
      'जिस व्यंजन की कोई कल्पना ही न कर सके, उसकी परवाह करना कठिन है और पहचानना उससे भी कठिन।',
    figureFilmed:
      'क्रमित वीडियो है',
    figureFilmedNote:
      'पकाने वाले की परंपरा से नज़दीकी के क्रम में — यह खोज का परिणाम नहीं है।',
    figureAssessed:
      'प्रामाणिक के रूप में वर्गीकृत',
    figureAssessedNote:
      'प्रमाण-जाँचों से अर्जित। यहाँ का अनुपात कम होना ईमानदारी है, विफलता नहीं।',
    atlasSummary:
      '{c} देशों से {n} परंपराएँ दर्ज। व्याप्ति ईमानदारी से बताई जाती है: यहाँ अनुपस्थित देश का अभी कुछ दर्ज नहीं है — यह नहीं कि दर्ज करने को कुछ है ही नहीं।',
    nothingRecorded:
      'कुछ दर्ज नहीं',
    nothingRecordedAs:
      '{what} के रूप में कुछ दर्ज नहीं',
    nothingRecordedAsAnd:
      '{list} और {last} के रूप में कुछ दर्ज नहीं',
    photoVia:
      'तस्वीर स्रोत',
    photoNothingEntered:
      'अभी कुछ नहीं भरा गया।',
    photoNothingEnteredFix:
      'Commons का फ़ाइल नाम या उसके पन्ने का लिंक चिपकाएँ।',
    photoWrongHost:
      'वह लिंक {host} पर जाता है, और वहाँ से कोई तस्वीर प्रकाशित करने का हमें अधिकार नहीं है।',
    photoWrongHostFix:
      'अगर तस्वीर आपकी है, तो उसे मुक्त लाइसेंस के साथ Wikimedia Commons पर चढ़ाएँ और फ़ाइल नाम यहाँ चिपकाएँ। वह आपकी ही रहती है, जहाँ भी दिखे वहाँ आपका नाम रहता है, और इसमें कुछ ख़र्च नहीं होता।',
    photoNotCommons:
      'वह लिंक Wikimedia Commons पर नहीं है।',
    photoNotCommonsFix:
      'यहाँ सिर्फ़ Commons की फ़ाइलें प्रकाशित हो सकती हैं, क्योंकि दिखाने की अनुमति देने वाला लाइसेंस सिर्फ़ उन्हीं पर है।',
    photoNoFileName:
      'उसमें कोई फ़ाइल नाम नहीं मिला।',
    photoNoFileNameFix:
      'फ़ाइल नाम चिपकाएँ, जैसे Kaipola.jpg।',
    photoNotAPhotograph:
      'वह तस्वीर की फ़ाइल नहीं है।',
    photoNotAPhotographFix:
      'Commons की तस्वीरें .jpg, .png या .webp पर ख़त्म होती हैं। आरेख और लोगो यहाँ इस्तेमाल नहीं होते।',
    photoIsADrawing:
      'वह चित्र है, तस्वीर नहीं।',
    photoIsADrawingFix:
      'खाने की वैसी ही तस्वीर लें जैसा वह बना था।',
    serverRefused:
      'सर्वर ने इसे अस्वीकार कर दिया ({status})।',
    serverTookTooLong:
      'सर्वर ने जवाब देने में बहुत देर लगाई।',
    couldNotReachServer:
      'सर्वर तक नहीं पहुँचा जा सका।',
    nothingYouTypedIsLost:
      '{message} आपकी प्रविष्टि भेजी नहीं गई — आपने जो लिखा उसमें से कुछ भी नहीं खोया, थोड़ी देर में फिर कोशिश करें।',
    proposalsNotOpen:
      'प्रस्ताव अभी खुले नहीं हैं।',
    confirmationsNotOpen:
      'पुष्टियाँ अभी खुली नहीं हैं।',
    alreadyProposed:
      'यह व्यंजन पहले ही प्रस्तावित है। उसे खोलकर पुष्टि करें — यही उसे आगे बढ़ाता है।',
    alreadyConfirmed:
      'आप इसकी पुष्टि पहले ही कर चुके हैं।',
    youProposedThis:
      'यह व्यंजन आपने प्रस्तावित किया था, इसलिए इसकी पुष्टि किसी और को करनी होगी।',
    stillNeededList:
      'अब भी चाहिए: {list}।',
    listAnd:
      '{list} और {last}',
    listOr:
      '{list} या {last}',
    proposalConfirmed:
      'पुष्ट। अगली बार अद्यतन होने पर यह एटलस में आ जाएगा।',
    proposalNobodyYet:
      'अभी तक इसकी किसी ने पुष्टि नहीं की। व्यंजन को जानने वाले {n} लोग इसे एटलस में ले आएँगे।',
    proposalSoFar:
      '{n} में से {have} पुष्टियाँ। व्यंजन को जानने वालों की {short} और इसे भीतर ले आएँगी।',
    recordNobodyYet:
      'उस जगह के किसी व्यक्ति ने अभी इसकी पुष्टि नहीं की। {n} पुष्टियाँ इसे प्रमाणित कर देंगी।',
    recordSoFar:
      '{n} में से {have} पुष्टियाँ। व्यंजन को जानने वालों की {short} और इसे प्रमाणित कर देंगी।',
    atRiskNote:
      'इसलिए चिह्नित क्योंकि कोई स्रोत इस परंपरा को घटती हुई बताता है — वह वाक्य रिकॉर्ड के साथ दिखाया जाता है। यह कभी इस बात से नहीं निकाला जाता कि हमने कितना कम दर्ज किया है: हमारे रिकॉर्ड में कमी इस बात का प्रमाण नहीं कि किसी ने पकाना छोड़ दिया।',
    originDisclaimer:
      'इस व्यंजन पर एक से ज़्यादा प्रलेखित ऐतिहासिक दावे हैं। नीचे की परंपराएँ वैसे ही दर्ज हैं जैसे हर जगह उन्हें बताती है, अपने स्रोतों समेत। यहाँ किसी दावे को विजेता की तरह पेश नहीं किया जाता, और इसमें से कुछ भी प्रामाणिकता के अंक को प्रभावित नहीं करता — वह मापता है कि किसी जगह व्यंजन कैसे बनता है, यह नहीं कि सबसे पहले किसने बनाया।',
    supportRunsOn:
      'एटलस में जो कुछ है वह विकिपीडिया, विकिडेटा, विकिमीडिया कॉमन्स, विकिबुक्स और खुले क्षेत्रीय रजिस्टरों से आता है। ये पढ़ने के लिए मुफ़्त हैं, खुले लाइसेंस पर हैं, और जिस भी रिकॉर्ड में इस्तेमाल होते हैं वहाँ इनका श्रेय दिया जाता है। परियोजना के मुफ़्त बने रहने का पूरा आधार यही है, और यह एक निर्णय है, कोई पड़ाव नहीं।',
    contributeToTheAtlas:
      'एटलस में योगदान दें',
    answeredByDocuments:
      'इनका उत्तर दस्तावेज़ दे सकते हैं',
    answeredByPeople:
      'इनका उत्तर सिर्फ़ लोग दे सकते हैं',
    scaleDocumentsStop:
      'यहाँ दस्तावेज़ रुक जाते हैं',
    scaleAuthenticBegins:
      'यहाँ से प्रामाणिक',
    pantryNothingUses:
      'दर्ज किसी भी चीज़ में {list} नहीं है। हो सकता है किसी ने ऐसा व्यंजन लिखा ही न हो — एटलस के {p}% हिस्से में कोई सामग्री दर्ज ही नहीं है।',
    alsoRecordedIn:
      '{list} में भी दर्ज',
    alsoRecordedNote:
      'एटलस में इस व्यंजन का वहाँ एक अलग रिकॉर्ड है। कोई भी दूसरे को सुधारता नहीं — जिस व्यंजन को दो खान-पान संस्कृतियाँ बनाती हैं, वह किसी में भी ग़लती नहीं है।',
    chooseACountry:
      'देश चुनें',
    filterTheList:
      'सूची छाँटने के लिए लिखें',
    showingFirstNOfM:
      '{m} में से पहले {n} दिखाए जा रहे हैं। छाँटने के लिए लिखते रहें।',
    nothingMatchesThat:
      'सूची में इससे कुछ मेल नहीं खाता।',
    continentBeyondOneCountry:
      'एक देश से परे',
    beyondOneCountryNote:
      'ऐसे मूल जिन्हें स्रोत किसी एक देश से बड़ा दर्ज करते हैं — कोई क्षेत्र, कोई साझा पाक-क्षेत्र, या कोई ऐसा राज्य जो अब नहीं रहा। इन्हें किसी ऐसे देश तक सीमित करने के बजाय, जिसे किसी ने चुना ही नहीं, स्रोत के कथन के अनुसार रखा जाता है।',
    connectionGrewUpThere:
      'मैं वहीं बड़ा हुआ',
    connectionLiveThere:
      'मैं वहीं रहता हूँ',
    connectionFamilyFrom:
      'मेरा परिवार वहीं का है',
    connectionLearnedThere:
      'मैंने इसे बनाना वहीं सीखा',
    connectionCookProfessionally:
      'मैं इसे वहाँ पेशेवर रूप से बनाता हूँ',
    chooseYourConnection:
      'जो लागू हो वह चुनें',
    connectionInYourWords:
      'जो कुछ आप जोड़ना चाहें, अपने शब्दों में',
    connectionDetailPlaceholder:
      'मेरी दादी हर ईद पर कोझिकोड में यह बनाती थीं',
    dictateSpeak:
      'लिखने के बजाय बोलें',
    dictateListening:
      'सुन रहा है — रोकने के लिए दबाएँ',
    dictateStop:
      'सुनना बंद करें',
    dictateSendsAudio:
      'सुनने का काम आपका ब्राउज़र करता है, और ज़्यादातर ब्राउज़र इसके लिए आवाज़ अपने सर्वर पर भेजते हैं। आप जो कहेंगे वह ऊपर वाले बॉक्स में जुड़ जाएगा, जहाँ आप उसे ठीक कर सकते हैं।',
    dictateNotAllowed:
      'ब्राउज़र ने माइक्रोफ़ोन की अनुमति नहीं दी।',
    dictateDidNotWork:
      'यह काम नहीं आया। आप इसे लिख भी सकते हैं।',
    polishTidyThis:
      'मेरी टाइपिंग सुधारें',
    polishWorking:
      'सुधारा जा रहा है…',
    polishMachineMade:
      'मशीन का सुझाव — आपके शब्द ऊपर ही हैं',
    polishUseThis:
      'यह इस्तेमाल करें',
    polishKeepMine:
      'मेरा ही रहने दें',
    polishOnlyTyping:
      'सिर्फ़ वर्तनी, विराम-चिह्न और जगह छुई जाती है। कुछ जोड़ा, हटाया या दोबारा नहीं लिखा जाता, और कोई नाम नहीं बदला जाता।',
    polishFoundNothing:
      'सुधारने को कुछ नहीं — आपने जो लिखा वह ठीक पढ़ा जाता है।',
    polishDidNotWork:
      'यह काम नहीं आया। आपने जो लिखा वह वैसा ही है।',
    continentAfrica:
      'अफ़्रीका',
    continentAsia:
      'एशिया',
    continentEurope:
      'यूरोप',
    continentNorthAmerica:
      'उत्तर अमेरिका',
    continentSouthAmerica:
      'दक्षिण अमेरिका',
    continentOceania:
      'ओशिनिया',
    regionLevant:
      'लेवंत',
    regionLatinAmerica:
      'लैटिन अमेरिका',
    regionMiddleEast:
      'मध्य पूर्व',
    regionMaghreb:
      'माघरेब',
    regionCentralEurope:
      'मध्य यूरोप',
    regionEasternEurope:
      'पूर्वी यूरोप',
    regionSouthernEurope:
      'दक्षिणी यूरोप',
    regionCentralAsia:
      'मध्य एशिया',
    regionIndianSubcontinent:
      'भारतीय उपमहाद्वीप',
    regionNorthAfrica:
      'उत्तरी अफ़्रीका',
    regionAmericas:
      'अमेरिका',
    regionAncientNearEast:
      'प्राचीन निकट पूर्व',
    regionBalkans:
      'बाल्कन',
    regionCaribbean:
      'कैरिबियन',
    regionLowCountries:
      'निचले देश',
    regionMesoamerica:
      'मेसोअमेरिका',
    regionMiddleEasternEmpires:
      'मध्य पूर्वी साम्राज्य',
    regionPolishLithuanianCommonwealth:
      'पोलिश–लिथुआनी राष्ट्रमंडल',
    regionQajarIran:
      'क़ाजार ईरान',
    regionRussianEmpire:
      'रूसी साम्राज्य',
    regionSouthCaucasus:
      'दक्षिण काकेशस',
    regionSovietCentralAsia:
      'सोवियत मध्य एशिया',
    regionWu:
      'वू',
    regionArtsakh:
      'आर्ट्सख गणराज्य',
    refineDietOccasion:
      'आहार और अवसर',
    refineAny:
      'कोई भी',
    placeKindWiderRegion:
      'व्यापक क्षेत्र',
    placeKindFormerState:
      'पूर्व राज्य',
    oneTradition:
      '1 परंपरा',
    onePlace:
      '1 स्थान',
    nPlaces:
      '{n} स्थान',
    countryLevelOnly:
      'केवल देश स्तर पर',
    summaryWorldwide:
      ' दुनिया भर में',
    nRecorded:
      '{n} दर्ज',
    writtenInLanguage:
      '{language} में लिखा गया',
    whatThisIs:
      'यह क्या है',
    atlasDefinition:
      'पारंपरिक व्यंजनों का मुफ़्त एटलस — हर एक कहाँ से आया, और उसकी पुष्टि कौन करता है।',
    traditionsLabel:
      'परंपराएँ',
    freeNoAds:
      'मुफ़्त, बिना विज्ञापन',
    quotedFromSource:
      'नीचे दिए गए स्रोत से उद्धृत — यह बताता है कि यह व्यंजन आमतौर पर कैसे बनता है, न कि {place} में कैसे बनता है।',
    adaptationLeadIn:
      'यह व्यंजन आज आमतौर पर कैसे बनाया जाता है। यह {place} में इसे बनाने का रिकॉर्ड नहीं है, और वहाँ से किसी ने इसकी पुष्टि नहीं की।',
    openDisagreementBody:
      '{place} में इसे बनाने वाले किसी व्यक्ति का कहना है कि यह अलग तरीके से बनता है: {differs} जाँच के दौरान कुछ भी हटाया नहीं गया है, और नीचे दिया गया भरोसा अपरिवर्तित है — यदि दोनों बातें सही हुईं, तो रिकॉर्ड दो भागों में बँट जाएगा, किसी एक को खारिज नहीं किया जाएगा।',
    engagementNotShown:
      'व्यू की संख्या जानबूझकर नहीं दिखाई जाती: वह प्रामाणिकता नहीं मापती।',
    videoSearchNote:
      'आप स्रोत पर खोज सकते हैं। परिणाम व्यू के क्रम में आते हैं, जो केवल पहुँच मापते हैं — बनाने वाला {place} से हो भी सकता है और नहीं भी। इस तरह मिली कोई भी चीज़ इस रिकॉर्ड के वर्गीकरण को नहीं बदलती।',
    nowOpenForConfirmation:
      '{name} अब पुष्टि के लिए खुला है।',
    proposalOpenBody:
      'इस व्यंजन को जानने वाले {n} लोगों को इसकी पुष्टि करनी होगी, तभी यह एटलस में आएगा। अब से कोई भी इसे देख और पुष्ट कर सकता है — उन लोगों समेत जिन्हें आप बताएं, और बिना लिखे गए व्यंजन की पुष्टि आमतौर पर इसी तरह होती है।',
    nothingMatchesBody:
      'एटलस में अभी {query} से मेल खाता कुछ नहीं है। यहाँ अनुपस्थिति का अर्थ है रिकॉर्ड नहीं, भोजन नहीं — अनुमान लगाने से बेहतर हम यह कहेंगे कि हमें पता नहीं।',
    thatWord:
      'उस',
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
      '{n} 项传统，全部建立在可自由阅读、开放许可的来源之上。没有广告，没有追踪，也没有任何东西藏在付费之后。运行所需，由这个来源的选择来承担 — 而不是靠谁付钱换取出现在这里。',
    notForSaleAuthentic:
      '一条记录不会因为付钱而被判定为正宗。那来自证据，以及做这道菜的人。',
    notForSalePromotion:
      '不会因为有人付钱，就推广、提高排名或特别展示任何一道菜。',
    notForSaleAdvertising:
      '这里没有任何广告，也不追踪任何读者。',
    donationFootnote:
      '在 Open Collective 打开。这里不收取任何款项 — 本应用不保存你的支付信息，将来也不会。',
    donationsPendingBody:
      '目前还没有可以汇款的地方。图册里没有任何东西依赖于此 — 它建立在可自由阅读的来源之上，而这一点不会变。',
    mostUsefulThing:
      '能给这份图谱最有用的东西不是钱。它大部分只有一个名字和一个地方，因为没有人写下这道菜怎么做。',
    administration:
      '管理',
    administrationNote:
      '阈值、审核、来源检查与使用情况。需要令牌。',
    howLead:
      '这就是这份图谱赖以建立的规则，它是算术而不是政策 — 也就是说你可以核对它，而不必相信它。',
    sixDimensionsBody:
      '每条记录都按同样的六个维度评分，六项都印在记录本身上。总分是它们的平均值，所以怀疑的人可以自己把数字加起来。',
    ceilingBody:
      '这六项中有三项，是任何写下来的文献都回答不了的。没有哪部百科全书知道某种做法是不是某地的做法；没有哪份登记簿是那个镇上的一个人。这三项空着时，一条记录仅凭已发表的资料最高只能得到 {ceiling}。',
    thresholdBody:
      '一条记录达到 {threshold} 才被称为正宗。这两个数字之间的距离是刻意的，也正是全部论点所在：只有了解这道菜的人才能把它补上。',
    whatClosesItBody:
      '来自说明自己与当地关系的人的 {n} 条确认 — 而且要说出他们确认的是什么，而不只是表示赞同。两者都会显示在记录上，因为“我在科泽科德出生 — 我们用酥油，不用油”这样的句子是可以掂量的证据，而“{n} 条确认”只是一个你不得不相信的数字。',
    accountsBody:
      '这 {n} 条必须来自 {n} 个不同的人，所以只有当事人已登录时，确认才计入标记。匿名的确认照样记录、照样显示在记录上 — 一个人知道的事情值得留下，无论他有没有账号 — 只是不会改变那个数字。阅读图谱从不需要登录。',
    whichIsWhereYouComeInBody:
      '图谱的大部分没有人为它发声。如果你知道你家乡的一道菜是怎么做的，那正是任何资料都提供不了、任何抓取都触及不到的东西。',
    notRatings:
      '没有评分。没有人给一道菜打五分制的分数。',
    notComments:
      '没有评论，也没有信息流。这里没有什么可供你互动。',
    notAlgorithm:
      '没有算法决定你看到什么。顺序就是证据，而且你可以改变它。',
    notAdvertising:
      '没有广告，也不追踪任何读者。',
    notPopularity:
      '热度会被记录并单独存放。一道菜流传最广的版本，永远不会因此成为正宗的那一个。',
    dimensionOrigin:
      '这道菜来自哪里，以及有多精确。一个镇胜过一个国家。',
    dimensionIngredients:
      '它用什么做成 — 按传统的做法。',
    dimensionTechnique:
      '它怎么做 — 不是有人发表过食谱，而是这就是当地的做法。',
    dimensionLocalSource:
      '一位说明了与当地关系的人为它作了证。',
    dimensionDocumentation:
      '有登记簿、名录或百科全书记载过它。',
    dimensionCommunity:
      '当地的人确认过它，并说明了他们确认的是什么。',
    fromDocuments:
      '文献可以',
    fromPeople:
      '只有人可以',
    contributeLead:
      '按你所在地的做法记录下来。仅凭这份表格不会发布任何内容 — 它要先经过评估和社区确认。',
    writeItTheWayYouWriteIt:
      '这道菜的名字，你怎么写就怎么写',
    editorialRuleBody:
      '请随意修改我们的文字 — 拼写、语法、任何读起来不顺的地方。但不要去修正这道菜本身。菜名、食材、器具和地名，一律保持做这道菜的人所写的样子，连符号也不动。如果两种写法不一致，那通常是两个地方的人，而不是错误，两种都保留。',
    photographTitle:
      '如果你有，一张它的照片',
    photographBody:
      '把你自己拍的照片发布到 Wikimedia Commons，然后把文件名粘贴到这里。照片仍然是你的，凡是出现的地方都会署你的名，而且对你我都不花钱。我们不能从 Instagram 或 TikTok 上取用 — 那里的照片归拍摄者著作权所有，一行署名不等于许可。',
    walkthroughNoteBody:
      '下面是一个做完的示例，说明一份提交会经历什么 — 下方的发现、核查和草拟分数来自图册中已有的一条记录，而不是你刚才输入的内容。你的条目不在这里评定；发送之后由人来评定。',
    examplePreparedBy:
      '马拉巴尔的家庭，为开斋饭和家庭场合而做',
    exampleConnection:
      '生在科泽科德，也在那里做菜',
    exampleIngredients:
      '熟的 nendran 香蕉、鸡蛋、酥油、糖、腰果、葡萄干；用厚底锅在炭火或煤气小火上烹制，盖上压了炭火的锅盖',
    shelfFromCountry:
      '来自{country}',
    shelfFromCountryNote:
      '图册中来自{country}的内容。这里准不准，对你比别处更要紧 — 因为你分得出对错。',
    sending:
      '发送中…',
    missionHeadline:
      '这里的每一道菜都亮出它的依据。',
    missionStakes:
      '它从哪里来、谁这么说、真正查实了多少 — 都印在每一条记录上，任何有疑问的人都能自己核。',
    statDishes:
      '道菜',
    statCountries:
      '个国家',
    statDocumented:
      '有文献',
    statRegistered:
      '已登录',
    statAuthentic:
      '已认证',
    missionAsk:
      '其中 {n} 道没有记下任何做法。来自同一个地方的 {people} 个人就能把一道彻底补上。',
    missionAskBody:
      '没有人写下它们怎么做 — 英文里没有，任何语言里都没有，机器能到的地方都没有。没有档案、没有百科、也没有任何自动的东西能代替人来认证；这是评分里的算术，不是规定。如果你会做其中一道，你就是唯一能做这件事的人。',
    recordADishYouKnow:
      '记下你知道的一道菜',
    howItGetsAuthenticated:
      '认证是怎么进行的',
    submissionsNotOpen:
      '投稿还没有开放 — 目前没有地方可以送。上面那条路径说明了开放后会发生什么。',
    freeAndStayingFree:
      '免费，而且会一直免费。没有广告，没有追踪，不收任何钱。只有确认一道菜才需要账号 — 阅读从来不需要。',
    noRatingsNoComments:
      '没有评分，没有评论，也没有算法替你决定看什么 — 列表以依据排前，而不是以人气。打开次数只记成一道菜和一个日期，绝不记成一个人。',
    whyASourceCannot:
      '为什么资料本身无法认证一道菜',
    whyASourceCannotBody:
      '已发表的文献在这里最高只能到 {ceiling} 分，而记录要到 {threshold} 分才算认证。这段差距只有与当地有关系的人才能补上。每个分数背后的六项数字都印在记录上，怀疑这个数的人可以自己加一遍。',
    whyTheAtlasStops:
      '这也是图册止步于此的原因。所有免费来源都已读过 — 百科、食谱书、遗产名录、地名录 — 仍有 {n} 条记录完全没有关于做法的记载。剩下的，从来就没有被写下来过。',
    levelLocal:
      '本真 — 本地',
    levelLocalFull:
      '本真 — 本地/传统',
    levelRegional:
      '本真 — 地区',
    levelVariation:
      '传统变体',
    levelAdaptation:
      '现代改良',
    levelFusion:
      '融合菜',
    levelUnverified:
      '未核实',
    levelUnverifiedFull:
      '未核实 — 证据不足',
    filterAuthenticOnly:
      '仅本真',
    filterTraditionalVariations:
      '传统变体',
    filterModernAdaptations:
      '现代改良',
    filterFusion:
      '融合菜',
    filterUnverified:
      '未核实',
    filterAll:
      '全部',
    geoCountry:
      '国家',
    geoRegion:
      '地区',
    geoProvince:
      '省或专区',
    geoCity:
      '城市或城镇',
    geoVillage:
      '村庄或社区',
    chooseRegion:
      '选择一个地区',
    chooseProvince:
      '选择一个省或专区',
    chooseCity:
      '选择一个城市或城镇',
    chooseVillage:
      '选择一个村庄或社区',
    typeToSearchLevel:
      '输入以搜索…',
    browseAllTraditions:
      '浏览全部 {n} 项传统',
    geoPlace:
      '地方',
    noLevelRecorded:
      '还没有以这个名字登记的{level}。这里没有，意思是没有记录，不是没有这道菜。',
    browseCuisine:
      '{cuisine}菜系',
    browseMadeWith:
      '用{ingredient}做的',
    browseEverything:
      '全部',
    within:
      '在{path}之内',
    chooseCountryHint:
      '选择一个国家 · 已记录 {c} 个',
    chooseCountryHintBroader:
      '选择一个国家 · 已记录 {c} 个，另有 {b} 个更宽泛的来源',
    noRecordUnderThatReference:
      '图册里没有以这个编号登记的内容。这里没有，意思是没有记录，不是没有这道菜。',
    tagTraditionalPreparation:
      '🏺 传统做法',
    tagAtRiskTradition:
      '🕯️ 濒危传统',
    notEligibleForAuthentic:
      '不具备评为本真的资格',
    lookingForWhatItBorrows:
      '在找它借鉴的那个传统吗？',
    howItsDescribed:
      '别人怎么描述它',
    howItsMade:
      '它怎么做',
    originAndAttribution:
      '来源与文化归属',
    nobodyRecordedTechnique:
      '没有人记下做法 — 火候、器具、先后次序。正是这些才能让这条记录脱离未核实，而这需要一个真正做这道菜的人。',
    nobodyHasRecorded:
      '没有人记下 {dish} 怎么做{place}。我们大可以把网上流传最广的食谱抄过来，称它本真，但这份图册存在的意义恰恰是不这么做 — 所以这条记录就这样留着，等一个会做的人来填。如果那个人是你，你就是第一个把它写下来的人。',
    ifIngredientUnavailable:
      '如果买不到传统的那种食材',
    commonModernSubstitute:
      '常见的现代替代品：',
    adaptationNotAuthentic:
      '这是改良做法，不应当作本真做法看待。',
    whatTheInternetServes:
      '网上多数情况下拿来当这道菜的东西，以及它与上面那个传统的出入。',
    popularNotAuthentic:
      '流行，但不是本真做法。上面那个版本仍然是标准。',
    videosRankedByCloseness:
      '真实的视频，按做菜的人离传统有多近排序 — 不按播放量。',
    stillFramesFromVideos:
      '截图取自视频本身，所以你看到的这道菜，就是那个人做的那道菜。',
    noVideoRecordedYet:
      '这道菜还没有登记任何来自传统的视频。',
    findOneFromThePlace:
      '如果你找到当地人做的视频，可以通过添加一项传统加进来 — 这才能让这道菜有一个排过序的视频。',
    siblingsNeitherIsReal:
      '同一道菜，在做法不同的地方分开登记。哪一个都不是"真的那个"。',
    doYouKnow:
      '你了解{subject}吗？',
    confirmWhatYouKnow:
      '只确认你真正知道的。你不必为整条记录背书 — 一个做这道菜的人说出的一件具体的事，比笼统的赞同更有分量。',
    recordedThankYou:
      '已记录。谢谢。',
    shownWithYourConnection:
      '它会连同你与当地的关系一起显示在记录上，让读的人自己掂量。',
    signedInCounts:
      '已登录 — 这会计入徽章。',
    notSignedInNote:
      '未登录。你写的内容会连同你与当地的关系显示在记录上，但不会推动徽章：那个数字只因登录的人而上升，这样一个人就不能顶三个人。',
    signInSoItCounts:
      '登录，让它算数',
    shownOnTheRecord:
      '显示在记录上',
    whatCanYouConfirm:
      '你能确认什么？',
    exampleSaid:
      '我们用酥油，不用油 — 而且是开斋节做的，不是一年到头都做。',
    fromTheTownItself:
      '我就是那个镇或村的人，不只是那一片大区域的',
    fromTheTownItselfLabel:
      '我就是那个镇或村的人，不是那一片大区域的',
    exampleWhoMakesIt:
      '开斋节在家做，由祖母们做 — 可不填',
    exampleIngredientLines:
      '熟的大蕉\n鸡蛋\n酥油',
    exampleMethodLines:
      '把大蕉压成泥。\n拌入打散的鸡蛋。',
    inPlace:
      '（在{place}）',
    tagAtRiskShort:
      '🕯️ 濒危',
    readThisIn:
      '用这个语言阅读',
    communityTranslation:
      '社区翻译',
    machineTranslation:
      '机器翻译 — 社区里还没有人核对过',
    notTranslatedYet:
      '尚未翻译',
    aDotMarks:
      '带点的语言表示这条记录已经译成了那种语言。',
    opensOnceMoreRecords:
      '当有 {n} 条记录能用{language}阅读时，它就会开放。',
    noTranslationService:
      '这个版本没有接入任何翻译服务，所以无法自动翻译任何内容。何况，会做这道菜的人给的翻译更有价值 — 可以通过添加一项传统提供。',
    whatTheseTermsMean:
      '这些说法是什么意思',
    signedIn:
      '已登录',
    signOut:
      '退出登录',
    signedInSignOut:
      '已登录。退出登录。',
    confirmationsCount:
      '你的确认会计入徽章。',
    signIn:
      '登录',
    signInSoConfirmationsCount:
      '登录，让你的确认算数',
    onlySignedInMovesBadge:
      '只有登录后的确认才会推动徽章。',
    watchAtSource:
      '到原处观看 ↗',
    originalAudio:
      '原声',
    creatorsOwnTranslation:
      '作者自己的翻译',
    translatedCaptions:
      '翻译字幕',
    languageUnknown:
      '语言不明',
    ingredientsInThisVideo:
      '这段视频里用到的食材',
    weDontInventOne:
      '拍这段视频的人没有发布食材清单，也没有写下做法，我们也不去编造。上面的传统做法来自下面那些有据可查的来源。',
    captureFromVideo:
      '把这段视频里的食材和步骤记下来 →',
    dietaryPreference:
      '饮食偏好',
    narrowItDown:
      '再筛一层',
    anyDiet:
      '不限饮食',
    whenItsEaten:
      '什么时候吃',
    anyOccasion:
      '不限场合',
    alsoCalled:
      '也叫',
    notATranslationOfOurs:
      '每一个都是该语言自己的百科条目里用的名字 — 不是我们翻的，也绝不取代上面那个名字。点一下就能在那里读到。',
    relatedTraditions:
      '相关传统',
    relatedTraditionsNote:
      '与这条记录共享地方、传统或食材的记录。每一条都会说明是哪一样。',
    scoreCannotSettle:
      '这是对证据强弱的估计 — 并不是说一个分数就能判定文化上的真伪。',
    notScored:
      '未评分',
    navAtlasNote:
      '收录了什么，把握有多大',
    navProposeNote:
      '图册里没有记录的食物',
    navConfirmNote:
      '等着懂行的人来看的菜',
    navSupportNote:
      '运行的花费，以及谁在出',
    confirmPrompt:
      '你们那儿也是这么做的吗？',
    confirmAskBody:
      '如果你就在这道菜的原产地做它，你的确认或更正正是让一条记录脱离未核实的东西。你的做法不同的地方，会记在这条旁边 — 而不是取代它。',
    confirmYes:
      '是的，一样',
    confirmNo:
      '我们那儿做法不一样',
    confirmPlacePrompt:
      '这道菜真的来自我们标注的地方吗？',
    confirmPlaceBody:
      '没有人写下这一道怎么做，所以现在还没有可以认同的内容。地方是这条记录所主张的，光是这一点就值得确认 — 它是六项证据核查之一。',
    confirmPlaceYes:
      '是的，就是这儿的',
    confirmPlaceNo:
      '不是，来自别处',
    standingMet:
      '已有 {n} 位与{place}有关系的人确认过 — 正是徽章所要求的数目。',
    standingNobody:
      '还没有人',
    standingOne:
      '目前有一位',
    standingMany:
      '目前有 {n} 位',
    standingNeed:
      '{soFar}。徽章需要 {need} 位，所以再有 {people} 位与{place}有关系的人就够了。',
    onePersonMore:
      '一位',
    morePeople:
      '{n} 位',
    contestedNote:
      '归在这里是为了便于查找。有 {n} 个地方对这道菜提出了有据可查的主张 — 没有一个是定论，下面全部列出。',
    relatedAlsoFrom:
      '同样来自{place}',
    relatedAlsoCuisine:
      '同样是{cuisine}',
    relatedSharesIngredients:
      '有 {n} 种食材相同',
    relatedAlsoUses:
      '同样用到{ingredient}',
    relatedAlsoCategory:
      '同样是{category}',
    authenticVersion:
      '本真做法',
    thePublishedRecipe:
      '已发表的食谱',
    whyThisIsAnAdaptation:
      '为什么这算改良',
    whyConsideredAuthentic:
      '为什么这被认为是本真的？',
    whatThisRecordIs:
      '这条记录是什么',
    stepSubmit:
      '提交',
    stepWhatExists:
      '现有什么',
    stepAssessment:
      '评估',
    stepValidation:
      '确认',
    findingAggregatorTitle:
      '食谱聚合网页',
    findingAggregatorTag:
      '流行候选',
    findingAggregatorNote:
      '排在最前的结果。作者没有说明与马拉巴尔的任何关系；用黄油代替了酥油。',
    findingVideoTitle:
      '马拉雅拉姆语烹饪频道视频',
    findingVideoTag:
      '本地来源',
    findingVideoNote:
      '在喀拉拉拍摄，讲马拉雅拉姆语，用酥油和 nendran 香蕉，与描述一致。',
    findingGapTitle:
      '没有找到镇一级的记载',
    findingGapTag:
      '空白',
    findingGapNote:
      '没有任何资料记载它在科泽科德具体怎么做。这份提交会是第一份。',
    checkOriginLabel:
      '地理来源',
    checkOriginNote:
      '马拉巴尔、科泽科德 — 提交者所述，且与视频来源一致。',
    checkLocalPrepLabel:
      '本地做法',
    checkLocalPrepNote:
      '被描述为家庭烹饪，用于开斋饭和家庭场合。',
    checkIngredientsLabel:
      '传统食材',
    checkIngredientsNote:
      'nendran 香蕉、鸡蛋、酥油 — 与本地来源的视频吻合。',
    checkTechniqueLabel:
      '传统技法',
    checkTechniqueNote:
      '小火，锅盖上压着炭火。',
    checkDocumentationLabel:
      '历史或文化文献',
    checkDocumentationNote:
      '薄弱。没有找到研究，也没有档案记载。',
    checkLocalSourceLabel:
      '本地来源',
    checkLocalSourceNote:
      '提交者称自己生在科泽科德，并在那里做这道菜。',
    checkCommunityLabel:
      '社区确认',
    checkCommunityNote:
      '尚未征询。这就是这条记录目前还不能称为本真的原因。',
    validatorHomeCook:
      '家庭厨师，科泽科德',
    validatorHomeCookSaid:
      '确认了食材和锅盖压炭火的做法。',
    validatorBakery:
      '糕饼店老板，特拉瑟里',
    validatorBakerySaid:
      '确认，并指出他们那边糖放得少些。',
    validatorWriter:
      '美食记者，喀拉拉',
    validatorWriterSaid:
      '确认为马拉巴尔的家常菜；相关文献确实很少。',
    validatorPending:
      '又邀请了两位评审',
    validatorPendingSaid:
      '等待回复 — 没有他们这条记录也会发布。',
    photoCheckedNote:
      '提交记录时会与 Commons 核对，并连同拍摄者和许可一起显示。在社区确认之前它一直是未核实，和做法一样。',
    mostPublishedNote:
      '流传最广的版本被当作流行候选。它并不因此成为本真记录。',
    sevenChecksNote:
      '七项核查，每一项要么有答案，要么留空。留空会降低信心 — 绝不靠猜测填上。',
    draftConfidence:
      '/100 草拟信心',
    unverifiedPendingTag:
      '⚪ 未核实 — 等待社区确认',
    oneSubmitterNote:
      '一位当地提交者是证据，不是定论。在社区里的人确认之前，记录一直是未核实。',
    threeConfirmationsNote:
      '三位住在当地或在当地做这道菜的人确认，就能让一条记录脱离未核实。',
    conflictingAccountsNote:
      '互相矛盾的说法两边都保留。记录会拆成人们实际描述的那些传统 — 每个地区或群体一条 — 并且不宣布哪个版本是真的。',
    nowhereToSendNote:
      '目前没有地方可以送。免费来源里有的，图册都已读过，所以现在缺的是没有人写下来的食物 — 也就是说，这份表格正是它生长的方式，一旦有了去处就会开放。',
    whereTheExampleEndsUp:
      '这就是那条示例记录的归宿：公开发布，证据可见，未答的核查一一列明，每一项说法都能追溯到是谁说的。',
    confirmedBy:
      '确认者',
    nothingMatchesAll:
      '没有同时符合这一切的。',
    mostOfYourListFirst:
      '用到你清单最多的排在前面',
    translatesTheAppsWords:
      '翻译的是这个应用自己的用语。菜品仍保持记录时所用的语言 — 每条记录有自己的翻译选项。',
    byNameAndPlaceOnly:
      '这些在图册里只有名字和地方。没有人记载过它们怎么做，所以它们既没有做法也没有分数。',
    wikipediaViewsNote:
      '过去一年里有多少人在英文维基百科上读过每道菜。这是关注度，不是本真度，也不代表一道菜吃的人有多少 — 它偏向英语使用者会去查的东西。点进去看各自的分类。',
    requiredDishName:
      '菜名',
    requiredCountry:
      '国家',
    requiredYourName:
      '你的名字',
    requiredYourConnection:
      '你与当地的关系',
    requiredWhatYouConfirm:
      '你能确认什么',
    bandNotScored:
      '未评分',
    bandUnder50:
      '低于 50',
    band50to74:
      '50 – 74',
    band75Plus:
      '75 及以上',
    reviewCapitals:
      '这一段通篇都是大写。',
    reviewCapitalsConsider:
      '按正常大小写更好读，也更容易翻译。菜名会保留你给的写法。',
    reviewRepeats:
      '有一个字符连续重复了好几次。',
    reviewRepeatsConsider:
      '看看是不是按键卡住了。',
    reviewShort:
      '做法写得很短。',
    reviewShortConsider:
      '写下别人要做这道菜得做些什么，包括等待的时间。没有做法的记录进不了食谱那几排。',
    groupSummaryCountries:
      '{c} 个国家 · {n} 项传统',
    groupSummaryOrigins:
      '{c} 个来源 · {n} 项传统',
    metricTotalTitle:
      '已记录的传统',
    metricTotalCounts:
      '一项传统，是在一个地方做一种食物的一种方式。同一道菜在两个地区做法不同，就是两项传统，两者都保留。',
    metricTotalMethod:
      '来自人工整理的集合和四个导入来源、有东西可展示的每一条记录 — 至少要有一个地方和一个名字。仍在等待补充的行会被扣住，不计入。',
    metricTotalCaveat:
      '这不是世界上不同食物的清点，也不是图册知道多少的度量。这些记录大多只有一个名字和一个国家，别无其他。有书面做法的比例，才是说明这究竟是图册还是名单的那个数字。',
    metricCountriesTitle:
      '国家',
    metricCountriesCounts:
      '在导入的地名解析之后，所有记录中出现的不同国家。',
    metricCountriesMethod:
      '每条记录的国家字段，去重，只计算属于国家的来源。来源用到的历史性和跨国实体 — 奥斯曼帝国、黎凡特、中美洲 — 保留在各自记录上，而不是改派给一个我们只能猜测的现代国家，这里也不计入。把它们算进去会给这个数字加上三十二个，而每一个都是虚构的。',
    metricCountriesCaveat:
      '覆盖不等于深度。一个国家只凭一条记录就会出现在这里，所以这数的是图册到过哪里，而不是它在哪里够好。请连同下面的集中度一起读，那个数字说明总量有多偏。',
    metricAtRiskTitle:
      '濒危传统',
    metricAtRiskCounts:
      '来源用自己的话把这项传统描述为衰退、正在消失或已不再实行的记录。',
    metricAtRiskMethod:
      '通过阅读每篇文章的导言和历史部分，寻找明确写出的衰退 — "如今已很少制作"、"最后一家尚存的作坊" — 并剔除意思不同的近似情形，比如作为食材的濒危物种，或已停业的连锁餐厅。触发判定的那句话作为证据存在记录上，并随记录一同显示。',
    metricAtRiskCaveat:
      '这是下限，不是普查，而且远低于实情。它只能找到已经有人写进我们读过的文本里的衰退；由四户人家维系、从未被记载的传统，在这里完全不显示。仅慢食协会的"味觉方舟"就列出约六千种濒危食物，是这个数字的一千倍。',
    metricDocumentedTitle:
      '有记录在案的做法',
    metricDocumentedCounts:
      '带有分步做法的记录 — 别人照着就能做出来的步骤。',
    metricDocumentedMethod:
      '人工整理的记录，做法是写下来并与当地人核对过的。导入的记录只有在存在已发表食谱时才有；百科条目里描述一道菜大致怎么做的段落，会作为文字保存，并且刻意不提升为步骤，因为把描述当成做法，是在宣称一种它并不具备的精确。',
    metricDocumentedCaveat:
      '有做法这件事，并不说明那是不是传统的做法。那是信心分数的用处，而且有做法的记录大多被归为现代改良。',
    metricLocatedTitle:
      '定位到国家以下',
    metricLocatedCounts:
      '不只写出国家，还写出地区、省份、城市或村庄的记录。',
    metricLocatedMethod:
      '任何在国家之下还填有层级的记录。',
    metricLocatedCaveat:
      '本真是有地理纵深的，一个国家几乎只是个开头 — "科泽科德"是一条记录，"印度"是一个标题。总数高而这里比例低，描述的是一部又宽又浅的图册。',
    metricIllustratedTitle:
      '有照片',
    metricIllustratedCounts:
      '拥有本应用有权展示的图像的记录。',
    metricIllustratedMethod:
      '来自 Wikidata、来自这道菜自己的维基百科条目，或由会做这道菜的人通过 Wikimedia Commons 提供。每一张都连同拍摄者和许可一起保存，且没有一张被标为已核实：按名字找到或由编辑选定的图像，是它展示这道菜的良好证据，而不是本应用对此的确认。',
    metricIllustratedCaveat:
      '照片不是本真的证据。它显示的是某人做出来的一盘菜，可能是记录所描述的那项传统，也可能不是。',
    metricFilmedTitle:
      '有排过序的视频',
    metricFilmedCounts:
      '至少有一段视频的记录，按做菜的人离传统有多近排序。',
    metricFilmedMethod:
      '按在地性排序 — 做菜的人在哪里、讲什么语言、食材和器具是否与记录相符。绝不按播放量、点赞或订阅数。',
    metricFilmedCaveat:
      '这个排序讲的是离传统有多近，不是拍摄质量，排在最前的视频往往是最不讲究的那一段。',
    metricAssessedTitle:
      '被判定为本真',
    metricAssessedCounts:
      '经过证据核查、达到"本真 — 本地"或"本真 — 地区"的记录。',
    metricAssessedMethod:
      '七项核查，每一项要么有答案要么留空，留空会降低信心，而不是靠猜测填上。技法和社区确认绝不从导入数据里推断，这就给一条导入记录单靠自己能达到的高度设了上限。',
    metricAssessedCaveat:
      '这里比例低是诚实，而不是失败。图册的大部分是导入且未经评估的；因为它们来自可敬的来源就称其本真，恰恰是这套标准存在的意义所要拒绝的那条捷径。',
    metricConcentrationTitle:
      '集中度',
    metricConcentrationCounts:
      '整部图册中，最大的单一国家所占的比例。',
    metricConcentrationMethod:
      '记录最多的那个国家的条数，除以总数。',
    metricConcentrationCaveat:
      '这反映的是哪些国家有公开的食品登记制度，而不是世界的食物在哪里。光是意大利就公布了约 4,400 项注册传统产品；多数国家一项也没有，它们在这里的缺席是文书的缺席，不是烹饪的缺席。',
    metricConfidenceTitle:
      '信心',
    metricConfidenceCounts:
      '图册在 0–100 证据分数上的分布情况。',
    metricConfidenceMethod:
      '人工整理的记录由证据核查打分。导入的记录只有在补充过程中找到可评的证据时才打分，其余情况留作未评分，而不是给一个默认值。',
    metricConfidenceCaveat:
      '"未评分"是遥遥领先的最大一档，而且会一直如此。它的意思是还没有人评估过这条记录 — 不是它分数低，也不是这道食物可疑。',
    metricByContinentTitle:
      '记录分布在哪里',
    metricByContinentCounts:
      '按大洲统计的记录数，每条记录只算一次。一项传统归在它被记录的那个国家所在的大洲，而不是它可能迁徙自的那个。',
    metricByContinentMethod:
      '依据每条记录的国家，通过一张覆盖约 200 个国家（含历史国家）的国家—大洲对照表。跨国和有争议的条目会归成一组，而不是硬塞进某个大洲。',
    metricByContinentCaveat:
      '这是一张来源的地图，不是世界烹饪的地图。欧洲领先，是因为欧洲的登记资料在网上而且开放 — 这是关于档案的事实。',
    howIsThisCounted:
      '这是怎么数出来的？',
    hideHowThisIsCounted:
      '收起计数方式',
    stapleGrains: '谷物',
    stapleRoots: '根茎',
    staplePulses: '豆类',
    stapleDairy: '乳制品',
    stapleMeatFish: '肉与鱼',
    stapleVegetables: '蔬菜',
    stapleAromatics: '香辛料',
    stapleSweetSour: '甜与酸',
    stapleRice: '大米',
    stapleWheat: '小麦',
    stapleMaize: '玉米',
    stapleMillet: '小米',
    stapleSorghum: '高粱',
    stapleBarley: '大麦',
    stapleOats: '燕麦',
    stapleBuckwheat: '荞麦',
    stapleTeff: '苔麸',
    staplePotato: '马铃薯',
    stapleCassava: '木薯',
    stapleSweetPotato: '红薯',
    stapleYam: '山药',
    stapleTaro: '芋头',
    staplePlantain: '大蕉',
    stapleLentil: '扁豆',
    stapleChickpea: '鹰嘴豆',
    stapleSoy: '大豆',
    stapleTofu: '豆腐',
    stapleBlackBean: '黑豆',
    stapleMungBean: '绿豆',
    staplePigeonPea: '木豆',
    stapleMilk: '牛奶',
    stapleYoghurt: '酸奶',
    stapleCheese: '奶酪',
    staplePaneer: '印度奶酪',
    stapleGhee: '酥油',
    stapleButter: '黄油',
    stapleCoconut: '椰子',
    stapleChicken: '鸡肉',
    stapleBeef: '牛肉',
    staplePork: '猪肉',
    stapleLamb: '羊肉',
    stapleGoat: '山羊肉',
    stapleFish: '鱼',
    staplePrawn: '虾',
    stapleEgg: '鸡蛋',
    stapleOnion: '洋葱',
    stapleGarlic: '大蒜',
    stapleGinger: '生姜',
    stapleChilli: '辣椒',
    stapleLemongrass: '香茅',
    stapleTomato: '番茄',
    stapleAubergine: '茄子',
    stapleCabbage: '卷心菜',
    stapleSpinach: '菠菜',
    stapleOkra: '秋葵',
    stapleTamarind: '罗望子',
    stapleHoney: '蜂蜜',
    stapleJaggery: '粗糖',
    stapleDate: '椰枣',
    stapleLemon: '柠檬',
    stapleOlive: '橄榄',
    dietVegan: '纯素',
    dietVegetarian: '素食',
    dietSeafood: '海鲜',
    dietMeat: '非素食',
    dietUnclassified: '未分类',
    dietPoultry: '禽肉',
    dietPork: '猪肉',
    dietBeef: '牛肉与红肉',
    dietLambGoat: '羊肉与山羊肉',
    dietGame: '野味',
    dietFish: '鱼',
    dietShellfish: '贝甲类',
    dietOtherSeafood: '其他海产',
    dietDairy: '含乳制品',
    dietEgg: '含蛋',
    dietHoney: '含蜂蜜',
    mealBreakfast: '早餐',
    mealLunch: '午餐',
    mealDinner: '晚餐',
    mealSupper: '宵夜',
    mealSnack: '小吃',
    mealStreetFood: '街头小吃',
    mealCelebration: '节庆宴席',
    mealAnytime: '任何时候',
    mealUnclassified: '未记录',
    searchModeFind:
      '找一道菜',
    searchModePantry:
      '用手边的东西做菜',
    ingredientsYouHave:
      '你手边的食材',
    nTraditions:
      '{n} 项传统',
    nothingYet:
      '还没有',
    methodRecorded:
      ' · 有做法记录',
    noMethodYet:
      ' · 还没有做法',
    showMoreLeft:
      '显示更多 — 还剩 {n}',
    showNMore:
      '再显示 {n} 条',
    methodAsPublished:
      '按发表时的做法。现代器具和省事的办法也是其中一部分。',
    methodTraditional:
      '传统做法，没有用现代的省事办法顶替。',
    everythingClassified:
      '所有归为{what}的',
    everythingFrom:
      '所有来自{place}的',
    everythingRecordedAs:
      '所有记录为{what}的',
    everythingMadeWith:
      '所有用{ingredient}做的',
    seeEverything:
      '{label} — 全部查看',
    noPhotographOnRecord:
      '{label} — 记录中没有照片',
    scoreOutOf100:
      '{label}：100 分中的 {value}',
    removeFilter:
      '移除{key}筛选',
    anywhereInTheAtlas:
      '图册中的任何地方',
    absenceOfRecords:
      '。这是记录的缺席，不是食物的缺席 — 我们宁可说不知道。',
    narrowToA:
      '缩小到{level} · 已记录 {n}',
    fromTheTown:
      ' — 就是本地人',
    showFewer:
      '收起',
    readAboutOnWikipedia:
      '在{language}维基百科上阅读关于{name}的条目',
    languageChangeIt:
      '语言：{language}。可更改。',
    perCentTranslated:
      '{language}，已翻译 {n}%',
    translateThisRecord:
      '翻译这条记录',
    translating:
      '翻译中…',
    translate:
      '翻译',
    translateThisConfirmation:
      '把这条确认翻译成{language}',
    couldNotTranslate:
      '翻译失败 — 请再试一次',
    howThisIsCountedFor:
      '{figure}是怎么数的',
    countOfTotal:
      '{label}：{total} 中的 {count}',
    watchAtSourceCreator:
      '到原处观看 {creator}',
    stillFromCreator:
      '取自 {creator} 的画面',
    thatDidNotSend:
      '没有发送成功。',
    containsAlcohol:
      '含酒精',
    nothingElseRequired:
      '其余的都欢迎，而且没有一样是必填的 — 知道一道菜出自哪里、而且没有人写下过它，这已经比这里任何来源掌握的都多。',
    opensTheFormPrefilled:
      '它会在原处打开表单，并把你已经写的内容预先填好。这个应用不收集任何关于你的信息，在当地人确认之前也不会发布任何内容。',
    scoreDimGeographic:
      '地理关联',
    scoreDimIngredients:
      '传统食材',
    scoreDimTechnique:
      '传统技法',
    scoreDimLocalSource:
      '本地来源',
    scoreDimDocumentation:
      '文化文献',
    scoreDimCommunity:
      '社区确认',
    photoFromWikidata:
      '附在这道菜自己的 Wikidata 条目上 — 不是按名字找到的',
    photoFromArticle:
      '这道菜自己的百科条目的首图',
    photoFromRecipe:
      '发表在这份食谱自己的页面上',
    photoFromSearch:
      '在 Wikimedia Commons 上按名字匹配到 — 拍的是不是它，尚未确认',
    photoFromUnknown:
      '来源未记录 — 请把拍摄内容当作未确认',
    noTranslationRecorded:
      '这段讲述还没有登记过任何译文，所以按记录时所用的{language}显示。比起机器对发酵时间的猜测，我们宁愿给你看原文。',
    machineTranslationBy:
      '由 {translator} 机器翻译。社区里还没有人核对过 — 食材和器具的名字保留原文。',
    translatedBy:
      '由 {translator} 翻译。食材和器具的名字保留原文。',
    videoOriginalAudio:
      '讲的是{language} — 做菜的人自己的语言。没有翻译任何内容。',
    videoCreatorTrack:
      '作者发布了{language}的音轨。在原处会以该音轨打开 — 那是作者自己的翻译，不是我们的。',
    videoPlatformCaptions:
      '讲的是{spoken}。打开时会在原声之上叠加机器翻译的{preferred}字幕 — 做菜的人的声音没有被替换，翻译来自视频平台，不是人做的。',
    videoLanguageUnknown:
      '我们没有这段视频所讲语言的记录，所以无法保证{language}。它会在原处打开，那里适用平台自己的字幕选项。',
    figureDocumented:
      '有记录在案的做法',
    figureDocumentedNote:
      '这个数字说明这究竟是图册还是名单。其余一切都排在它之后。',
    figureLocated:
      '定位到国家以下',
    figureLocatedNote:
      '本真是有地理纵深的。"科泽科德"是一条记录；"印度"几乎只是个开头。',
    figureIllustrated:
      '有照片',
    figureIllustratedNote:
      '一道谁都想象不出来的菜，很难让人上心，更难让人认出来。',
    figureFilmed:
      '有排过序的视频',
    figureFilmedNote:
      '按做菜的人离传统有多近排序 — 不是搜索结果。',
    figureAssessed:
      '被判定为本真',
    figureAssessedNote:
      '通过证据核查取得。这里比例低是诚实，不是失败。',
    atlasSummary:
      '已记录 {n} 项传统，来自 {c} 个国家。覆盖范围如实说明：这里没有的国家，是还没有记录，不是没有可记录的。',
    nothingRecorded:
      '没有记录',
    nothingRecordedAs:
      '没有记录为{what}的',
    nothingRecordedAsAnd:
      '没有记录为{list}和{last}的',
    photoVia:
      '照片来自',
    photoNothingEntered:
      '还什么都没填。',
    photoNothingEnteredFix:
      '粘贴 Commons 的文件名，或指向该文件页面的链接。',
    photoWrongHost:
      '这个链接指向{host}，我们没有权利从那里发布照片。',
    photoWrongHostFix:
      '如果照片是你拍的，请以自由许可上传到 Wikimedia Commons，再把文件名粘贴到这里。照片仍然是你的，凡是出现的地方都会署你的名，而且不花一分钱。',
    photoNotCommons:
      '这个链接不在 Wikimedia Commons 上。',
    photoNotCommonsFix:
      '这里只能发布 Commons 上的文件，因为只有它们带着允许我们展示的许可。',
    photoNoFileName:
      '在这里面没找到文件名。',
    photoNoFileNameFix:
      '请粘贴文件名，例如 Kaipola.jpg。',
    photoNotAPhotograph:
      '那不是照片文件。',
    photoNotAPhotographFix:
      'Commons 的照片以 .jpg、.png 或 .webp 结尾。这里不使用图示和标志。',
    photoIsADrawing:
      '那是画，不是照片。',
    photoIsADrawingFix:
      '请用这道菜做出来时的照片。',
    serverRefused:
      '服务器拒绝了（{status}）。',
    serverTookTooLong:
      '服务器回应得太慢了。',
    couldNotReachServer:
      '联系不上服务器。',
    nothingYouTypedIsLost:
      '{message} 你的条目没有送出 — 你打的字一个都没丢，过一会儿再试一次。',
    proposalsNotOpen:
      '投稿还没有开放。',
    confirmationsNotOpen:
      '确认还没有开放。',
    alreadyProposed:
      '这道菜已经有人提过了。把它打开并确认 — 那才是推动它的办法。',
    alreadyConfirmed:
      '这一条你已经确认过了。',
    youProposedThis:
      '这道菜是你提的，所以需要别人来确认。',
    stillNeededList:
      '还需要：{list}。',
    listAnd:
      '{list}和{last}',
    listOr:
      '{list} 或 {last}',
    proposalConfirmed:
      '已确认。下次更新时会进入图册。',
    proposalNobodyYet:
      '还没有人确认过。{n} 位懂这道菜的人就能把它带进图册。',
    proposalSoFar:
      '{n} 个确认里已有 {have} 个。再有 {short} 位懂这道菜的人就能把它带进来。',
    recordNobodyYet:
      '当地还没有人确认过。{n} 个确认就能让它通过认证。',
    recordSoFar:
      '{n} 个确认里已有 {have} 个。再有 {short} 位懂这道菜的人就能让它通过认证。',
    atRiskNote:
      '标记是因为有来源把这项传统描述为正在衰退 — 那句话会随记录一同显示。它绝不是从我们记载得多少推断出来的：我们记录里的空白，不能证明有谁停止了烹饪。',
    originDisclaimer:
      '这道菜有不止一项有据可查的历史主张。下面的传统按各地自己的说法记录，并附上来源。这里不把任何一项主张当作胜出者，而且这些都不影响本真度分数 — 那个分数衡量的是这道菜在某地怎么做，而不是谁最先做出来。',
    supportRunsOn:
      '图册里的一切都来自维基百科、维基数据、维基共享资源、维基教科书，以及开放的地区登记资料。它们可自由阅读、采用开放许可，并在每一条用到它们的记录上署名。这就是这个项目保持免费的全部依据，而且这是一个决定，不是一个阶段。',
    contributeToTheAtlas:
      '支持这部图册',
    answeredByDocuments:
      '这些文献可以回答',
    answeredByPeople:
      '这些只有人能回答',
    scaleDocumentsStop:
      '文献到此为止',
    scaleAuthenticBegins:
      '本真从这里开始',
    pantryNothingUses:
      '已记录的条目都没有用到 {list}。也可能只是没人写下用它的菜——图册里有 {p}% 根本没有列出任何食材。',
    alsoRecordedIn:
      '也收录于 {list}',
    alsoRecordedNote:
      '图册在那里另有一条关于这道菜的记录。两者互不纠正——两种饮食文化都做的一道菜，在哪一方都不是错误。',
    chooseACountry:
      '选择一个国家',
    filterTheList:
      '输入以缩小列表',
    showingFirstNOfM:
      '显示 {m} 项中的前 {n} 项。继续输入以缩小范围。',
    nothingMatchesThat:
      '列表中没有匹配项。',
    continentBeyondOneCountry:
      '不止一个国家',
    beyondOneCountryNote:
      '来源记载中比单一国家更广的出处——一个地区、一片共同的饮食区域，或一个已不存在的政权。它们按来源的说法保留，而不是被收窄到某个无人选定的国家。',
    connectionGrewUpThere:
      '我在那里长大',
    connectionLiveThere:
      '我住在那里',
    connectionFamilyFrom:
      '我家就是那里的',
    connectionLearnedThere:
      '我在那里学会做的',
    connectionCookProfessionally:
      '我在那里以此为业',
    chooseYourConnection:
      '选择符合你的一项',
    connectionInYourWords:
      '你想补充的任何话，用你自己的话',
    connectionDetailPlaceholder:
      '我祖母每年开斋节都在科泽科德做这道菜',
    dictateSpeak:
      '用说的代替打字',
    dictateListening:
      '正在聆听——点按停止',
    dictateStop:
      '停止聆听',
    dictateSendsAudio:
      '聆听由你的浏览器完成，多数浏览器会为此把音频送到自家服务器。你说的话会加到上面的框里，你可以在那里修改。',
    dictateNotAllowed:
      '浏览器没有允许使用麦克风。',
    dictateDidNotWork:
      '这次没有成功。你仍然可以打字。',
    polishTidyThis:
      '整理我的错字',
    polishWorking:
      '整理中…',
    polishMachineMade:
      '机器建议——你的原话仍在上面',
    polishUseThis:
      '用这个',
    polishKeepMine:
      '保留我的',
    polishOnlyTyping:
      '只会改动拼写、标点和空格。不增、不删、不改说法，也不更改任何名称。',
    polishFoundNothing:
      '没有需要改的——你写的读起来没问题。',
    polishDidNotWork:
      '这次没有成功。你写的内容没有改变。',
    continentAfrica:
      '非洲',
    continentAsia:
      '亚洲',
    continentEurope:
      '欧洲',
    continentNorthAmerica:
      '北美洲',
    continentSouthAmerica:
      '南美洲',
    continentOceania:
      '大洋洲',
    regionLevant:
      '黎凡特',
    regionLatinAmerica:
      '拉丁美洲',
    regionMiddleEast:
      '中东',
    regionMaghreb:
      '马格里布',
    regionCentralEurope:
      '中欧',
    regionEasternEurope:
      '东欧',
    regionSouthernEurope:
      '南欧',
    regionCentralAsia:
      '中亚',
    regionIndianSubcontinent:
      '印度次大陆',
    regionNorthAfrica:
      '北非',
    regionAmericas:
      '美洲',
    regionAncientNearEast:
      '古代近东',
    regionBalkans:
      '巴尔干',
    regionCaribbean:
      '加勒比',
    regionLowCountries:
      '低地国家',
    regionMesoamerica:
      '中部美洲',
    regionMiddleEasternEmpires:
      '中东帝国',
    regionPolishLithuanianCommonwealth:
      '波兰立陶宛联邦',
    regionQajarIran:
      '卡扎尔王朝',
    regionRussianEmpire:
      '俄罗斯帝国',
    regionSouthCaucasus:
      '南高加索',
    regionSovietCentralAsia:
      '苏联中亚',
    regionWu:
      '吴',
    regionArtsakh:
      '阿尔察赫共和国',
    refineDietOccasion:
      '饮食与场合',
    refineAny:
      '全部',
    placeKindWiderRegion:
      '广域地区',
    placeKindFormerState:
      '历史国家',
    oneTradition:
      '1 项传统',
    onePlace:
      '1 个地方',
    nPlaces:
      '{n} 个地方',
    countryLevelOnly:
      '仅到国家层级',
    summaryWorldwide:
      '（全球）',
    nRecorded:
      '已收录 {n} 项',
    writtenInLanguage:
      '以{language}写成',
    whatThisIs:
      '这是什么',
    atlasDefinition:
      '一部免费的传统菜肴图鉴——每道菜来自哪里，又由谁作证。',
    traditionsLabel:
      '项传统',
    freeNoAds:
      '免费，无广告',
    quotedFromSource:
      '引自下方来源——这是对该菜制作方式的泛泛而谈，而非{place}当地做法的记录。',
    adaptationLeadIn:
      '这道菜如今的常见做法。它不是{place}当地做法的记录，也没有当地人作过证。',
    openDisagreementBody:
      '有在{place}做这道菜的人表示做法不同：{differs} 核实期间未删除任何内容，下方的可信度也不变——若两种说法都成立，记录会拆分，而不是否定其中一方。',
    engagementNotShown:
      '播放数据有意不予显示：它不度量真实性。',
    videoSearchNote:
      '你可以到来源处搜索。结果按播放量排序，而那只衡量传播广度——下厨的人未必来自{place}。这样找到的内容不会影响本条记录的分类。',
    nowOpenForConfirmation:
      '{name} 现已开放待证。',
    proposalOpenBody:
      '需要 {n} 位熟悉这道菜的人作证，它才能进入图鉴。从现在起任何人都可以看到并作证——包括你告诉的人，而一道无人记载的菜通常正是这样得到作证的。',
    nothingMatchesBody:
      '图鉴中尚无与{query}相符的内容。这里的空白意味着没有记录，而不是没有这道菜——与其猜测，我们宁愿说不知道。',
    thatWord:
      '那个',
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
      '{n} 件の伝統。すべて、自由に読めて開かれたライセンスの資料だけで組み立てています。広告はなく、追跡もなく、支払いの向こう側に置いたものもありません。運営に要るものは、この資料の選び方でまかなっています。ここに載るために誰かが払っているのではありません。',
    notForSaleAuthentic:
      'お金を払って記録を「本物」にすることはできません。それは根拠と、その料理を作る人たちから来ます。',
    notForSalePromotion:
      '誰かが払ったからという理由で、料理が宣伝されたり、順位を上げられたり、特集されたりすることはありません。',
    notForSaleAdvertising:
      'ここに広告はありません。読む人が追跡されることもありません。',
    donationFootnote:
      'Open Collective で開きます。ここでは何も受け取りません — このアプリはあなたの支払い情報を保持しませんし、今後も保持しません。',
    donationsPendingBody:
      'お金を送る先はまだありません。アトラスの何もそれに依存していません。自由に読める資料の上に成り立っていて、そこは変わりません。',
    mostUsefulThing:
      'このアトラスに差し出せるいちばん役に立つものは、お金ではありません。その大半は名前と場所だけです。誰もその料理の作り方を書き留めなかったからです。',
    administration:
      '管理',
    administrationNote:
      'しきい値、モデレーション、出典の確認、利用状況。トークンが必要です。',
    howLead:
      'これがこのアトラスの土台にある規則です。方針ではなく算術なので、信じるのではなく確かめられます。',
    sixDimensionsBody:
      'どの記録も同じ六つの観点で採点され、六つとも記録そのものに印刷されています。点数はその平均なので、疑う人は数字を足してみればわかります。',
    ceilingBody:
      'この六つのうち三つは、これまでに書かれたどんな文献でも答えられません。ある作り方がその土地の作り方かどうかを知っている百科事典はなく、登録簿がその町の人であることもありません。その三つが空のままなら、公表された資料だけで記録が届く上限は {ceiling} です。',
    thresholdBody:
      '記録が本物と呼ばれるのは {threshold} からです。この二つの数字の隔たりは意図されたもので、それこそが論の全部です。埋められるのは、その料理を知る人だけです。',
    whatClosesItBody:
      'その土地との関わりを述べた人による {n} 件の確認 — しかも、賛成だというだけでなく、何を確認しているのかを述べたもの。どちらも記録に表示されます。「コーリコード生まれ — うちは油ではなくギーです」という一文は重みを量れる根拠ですが、「{n} 件の確認」は信じるしかない数字だからです。',
    accountsBody:
      'その {n} 件は {n} 人の別々の人でなければならないので、確認が印に数えられるのは、その人がサインインしていたときだけです。匿名のものも記録され、記録上に表示されます — 誰かが知っていることは、アカウントの有無にかかわらず得るに値します — ただ数字を動かさないだけです。アトラスを読むのにサインインは決して要りません。',
    whichIsWhereYouComeInBody:
      'アトラスの大半には、代わりに語る人がいません。あなたの土地でその料理がどう作られるかを知っているなら、それはどんな資料にも出せず、どれだけ収集しても届かない唯一のものです。',
    notRatings:
      '評価はありません。料理に五段階の点をつける人はいません。',
    notComments:
      'コメントもフィードもありません。ここに「反応する」対象はありません。',
    notAlgorithm:
      '何を見るかをアルゴリズムが決めることはありません。並び順は根拠であり、変えられます。',
    notAdvertising:
      '広告はなく、読む人が追跡されることもありません。',
    notPopularity:
      '人気は記録され、別に扱われます。最も多く公開された版が、そのために本物になることはありません。',
    dimensionOrigin:
      'その料理がどこのものか、そしてどこまで細かく特定できるか。町は国に勝ります。',
    dimensionIngredients:
      '何から作られるか — 伝統が作るとおりに。',
    dimensionTechnique:
      'どう作るか — 誰かがレシピを公開したことではなく、これがその土地の作り方であること。',
    dimensionLocalSource:
      'その土地との関わりを述べた人が、それについて語っている。',
    dimensionDocumentation:
      '登録簿、登録、あるいは百科事典がそれを記している。',
    dimensionCommunity:
      'その土地の人が確認し、何を確認しているかを述べている。',
    fromDocuments:
      '文献でわかる',
    fromPeople:
      '人だけがわかる',
    contributeLead:
      'あなたのいる土地での作り方のまま記録してください。この用紙だけで公開されるものはありません — まず評価と、地域の人による確認を通ります。',
    writeItTheWayYouWriteIt:
      '料理の名前は、あなたが書くとおりに書いてください',
    editorialRuleBody:
      '私たちの文章は自由に直してください — 表記、文法、読みにくいところは何でも。ただし料理そのものは直さないでください。料理名、材料、道具、地名は、それを作る人が書くとおりにそのまま残します。符号もそのままです。二つの表記が食い違うなら、たいていは誤りではなく二つの土地なので、両方を残します。',
    photographTitle:
      '写真があれば、その一枚',
    photographBody:
      'ご自分で撮った写真を Wikimedia Commons に公開し、そのファイル名をここに貼ってください。写真はあなたのもののままで、出るところすべてにあなたの名前が載り、あなたにも私たちにも費用はかかりません。Instagram や TikTok から取ることはできません — そこにある写真は撮った人の著作権のもとにあり、クレジット一行は許可ではないからです。',
    walkthroughNoteBody:
      '以下は、送られた内容がどう扱われるかを示した記入済みの例です — 下に出る所見、確認、暫定の点数は、すでにアトラスにある記録のもので、あなたが今入力したものではありません。あなたの入力はここでは評価されません。送信されたあと、人が評価します。',
    examplePreparedBy:
      'マラバールの家庭で、イフタールや家の行事のために作られる',
    exampleConnection:
      'コーリコード生まれ、そこで作っています',
    exampleIngredients:
      '熟したネンドラン バナナ、卵、ギー、砂糖、カシューナッツ、レーズン。厚手の鍋で炭火かガスの弱火にかけ、熾火を載せた蓋をして火を通す',
    shelfFromCountry:
      '{country}から',
    shelfFromCountryNote:
      'このアトラスが{country}について持っているもの。ここが正しいかどうかは、ほかのどこよりもあなたにとって値打ちがあります。正しいかどうかを見分けられるのは、あなただからです。',
    sending:
      '送信中…',
    missionHeadline:
      'ここにある料理は、どれも根拠を示します。',
    missionStakes:
      'どこから来たのか、誰がそう言っているのか、実際にどこまで確かめられたのか — どの記録にも印刷され、疑う人が自分で確かめられます。',
    statDishes:
      '品',
    statCountries:
      'か国',
    statDocumented:
      '文献あり',
    statRegistered:
      '登録済み',
    statAuthentic:
      '本物',
    missionAsk:
      'このうち {n} 件は作り方が何も記録されていません。その土地の {people} 人がいれば、一件を確かなものにできます。',
    missionAskBody:
      'どう作るのかを誰も書き残していません。英語にもなく、どの言語にもなく、機械が届くどこにもありません。文書館も百科事典も、自動的な何かも、人の代わりに裏づけることはできません。それは方針ではなく、採点上の算術です。あなたが作れるなら、できるのはあなただけです。',
    recordADishYouKnow:
      '知っている料理を記録する',
    howItGetsAuthenticated:
      'どう裏づけられるのか',
    submissionsNotOpen:
      '投稿はまだ開いていません。送る先がないからです。上の道筋が、開いたときに何が起きるかを説明しています。',
    freeAndStayingFree:
      '無料で、これからも無料です。広告はなく、追跡もなく、お金も集めません。アカウントが要るのは料理を確認するときだけで、読むのに要ることはありません。',
    noRatingsNoComments:
      '評価もコメントもなく、何を見せるかを決めるアルゴリズムもありません。一覧は人気ではなく根拠から並びます。閲覧は料理と日付として数え、人としては数えません。',
    whyASourceCannot:
      '資料だけでは料理を裏づけられない理由',
    whyASourceCannotBody:
      '公表された資料だけでは、ここでは {ceiling} を超えられません。記録が本物と呼ばれるのは {threshold} からです。この隔たりを埋められるのは、その土地とつながりのある人だけです。どの点数もその内訳の六つの数字が記録に印刷されているので、数字を疑う人は自分で足せます。',
    whyTheAtlasStops:
      'アトラスがここで止まっている理由も同じです。自由に使える資料はすべて読みました。百科事典、料理書、文化財の登録簿、地名辞典 — それでも {n} 件は、どう作るのかについて何も残っていません。残っているのは、書かれたことのないものです。',
    levelLocal:
      '本物 — 地元',
    levelLocalFull:
      '本物 — 地元/伝統',
    levelRegional:
      '本物 — 地方',
    levelVariation:
      '伝統的な変種',
    levelAdaptation:
      '現代のアレンジ',
    levelFusion:
      'フュージョン',
    levelUnverified:
      '未確認',
    levelUnverifiedFull:
      '未確認 — 根拠が足りません',
    filterAuthenticOnly:
      '本物のみ',
    filterTraditionalVariations:
      '伝統的な変種',
    filterModernAdaptations:
      '現代のアレンジ',
    filterFusion:
      'フュージョン',
    filterUnverified:
      '未確認',
    filterAll:
      'すべて',
    geoCountry:
      '国',
    geoRegion:
      '地方',
    geoProvince:
      '州・県',
    geoCity:
      '市・町',
    geoVillage:
      '村・集落',
    chooseRegion:
      '地方を選ぶ',
    chooseProvince:
      '州・県を選ぶ',
    chooseCity:
      '市・町を選ぶ',
    chooseVillage:
      '村・集落を選ぶ',
    typeToSearchLevel:
      '入力して検索…',
    browseAllTraditions:
      '{n} 件の伝統をすべて見る',
    geoPlace:
      '場所',
    noLevelRecorded:
      'その名前で登録された{level}はまだありません。ここに無いのは記録が無いということで、料理が無いということではありません。',
    browseCuisine:
      '{cuisine}料理',
    browseMadeWith:
      '{ingredient}を使ったもの',
    browseEverything:
      'すべて',
    within:
      '{path} の中',
    chooseCountryHint:
      '国を選ぶ · {c} か国',
    chooseCountryHintBroader:
      '国を選ぶ · {c} か国、ほかに広い範囲の出自が {b} 件',
    noRecordUnderThatReference:
      'その参照でアトラスに記録されているものはありません。ここに無いのは記録が無いということで、料理が無いということではありません。',
    tagTraditionalPreparation:
      '🏺 伝統の作り方',
    tagAtRiskTradition:
      '🕯️ 途絶えかけている伝統',
    notEligibleForAuthentic:
      '本物の区分には入りません',
    lookingForWhatItBorrows:
      '元になった伝統をお探しですか。',
    howItsDescribed:
      'どう説明されているか',
    howItsMade:
      'どう作るか',
    originAndAttribution:
      '由来と文化的な帰属',
    nobodyRecordedTechnique:
      '作り方を誰も書き残していません。時間も、道具も、手順の順序も。それこそがこの記録を未確認から引き上げるものであり、そのためには実際に作る人が要ります。',
    nobodyHasRecorded:
      '{dish} の作り方{place}を、誰も記録していません。インターネットでいちばん多く公開されているレシピを写して本物と呼ぶこともできますが、このアトラスはまさにそれをしないために在ります。ですから、作る人が書き入れるまで記録はこのままです。あなたが書けば、それを書き留めた最初の人になります。',
    ifIngredientUnavailable:
      '伝統の材料が手に入らないとき',
    commonModernSubstitute:
      'よくある現代の代用品：',
    adaptationNotAuthentic:
      'これはアレンジであり、本物の作り方とみなすべきものではありません。',
    whatTheInternetServes:
      'この料理としてインターネットが出してくるものと、それが上の伝統からどう離れているか。',
    popularNotAuthentic:
      '広まってはいますが、本物の作り方ではありません。基準は上の版のままです。',
    videosRankedByCloseness:
      '本物の動画を、再生数ではなく、作る人が伝統にどれだけ近いかで並べています。',
    stillFramesFromVideos:
      '静止画は動画そのものから取っているので、見えている料理はその人が作った料理です。',
    noVideoRecordedYet:
      'この料理には、伝統からの動画がまだ記録されていません。',
    findOneFromThePlace:
      'その土地の人が作った動画を見つけたら、伝統を追加するから加えられます。それがこの料理に順位のついた動画をもたらします。',
    siblingsNeitherIsReal:
      '同じ料理を、作り方が違う土地ごとに別々に記録したものです。どちらかが本物というわけではありません。',
    doYouKnow:
      '{subject} をご存じですか。',
    confirmWhatYouKnow:
      '本当に知っていることだけを確認してください。記録の全体を保証する必要はありません。作っている人が挙げる具体的な一点は、全体としての同意より重みがあります。',
    recordedThankYou:
      '記録しました。ありがとうございます。',
    shownWithYourConnection:
      'あなたとその土地とのつながりを添えて記録に表示されるので、読む人が自分で重みを量れます。',
    signedInCounts:
      'サインイン済みです。これは印に数えられます。',
    notSignedInNote:
      'サインインしていません。書いた内容はつながりとともに記録に表示されますが、印は動きません。その数はサインインした人の分しか増えないからで、一人が三人になれないようにするためです。',
    signInSoItCounts:
      '数えられるようにサインインする',
    shownOnTheRecord:
      '記録に表示されます',
    whatCanYouConfirm:
      '何を確認できますか。',
    exampleSaid:
      'うちは油ではなくギーです。それに、一年中ではなくイードのときに作ります。',
    fromTheTownItself:
      '広い地域というだけでなく、その町や村そのものの出身です',
    fromTheTownItselfLabel:
      '広い地域ではなく、その町や村そのものの出身です',
    exampleWhoMakesIt:
      'イードに家で、祖母たちが作ります — 任意',
    exampleIngredientLines:
      '熟したプランテン\n卵\nギー',
    exampleMethodLines:
      'プランテンをつぶす。\n溶いた卵を混ぜ込む。',
    inPlace:
      '（{place}での）',
    tagAtRiskShort:
      '🕯️ 途絶えかけ',
    readThisIn:
      'この言語で読む',
    communityTranslation:
      '地域の人による翻訳',
    machineTranslation:
      '機械翻訳 — その土地の人による確認はまだありません',
    notTranslatedYet:
      'まだ翻訳されていません',
    aDotMarks:
      '点の付いた言語は、この記録がすでに訳されている言語です。',
    opensOnceMoreRecords:
      '{language}は、あと {n} 件の記録が読めるようになると開きます。',
    noTranslationService:
      'このビルドには翻訳サービスがつながっていないので、自動で訳せるものはありません。そもそも、この料理を作る人による翻訳のほうが値打ちがあります。伝統を追加するから寄せられます。',
    whatTheseTermsMean:
      'これらの言葉の意味',
    signedIn:
      'サインイン中',
    signOut:
      'サインアウト',
    signedInSignOut:
      'サインイン中。サインアウトします。',
    confirmationsCount:
      'あなたの確認は印に数えられます。',
    signIn:
      'サインイン',
    signInSoConfirmationsCount:
      '確認が数えられるようにサインインする',
    onlySignedInMovesBadge:
      '印を動かせるのは、サインインした状態での確認だけです。',
    watchAtSource:
      '元の場所で見る ↗',
    originalAudio:
      '元の音声',
    creatorsOwnTranslation:
      '作った人自身による翻訳',
    translatedCaptions:
      '翻訳された字幕',
    languageUnknown:
      '言語不明',
    ingredientsInThisVideo:
      'この動画で使われている材料',
    weDontInventOne:
      'この動画を作った人は、材料の一覧も文章の作り方も公開していません。こちらで作ることもしません。上の伝統的な作り方は、下の裏づけのある出典から来ています。',
    captureFromVideo:
      'この動画から材料と手順を書き取る →',
    dietaryPreference:
      '食のきまり',
    narrowItDown:
      'さらに絞る',
    anyDiet:
      'きまりなし',
    whenItsEaten:
      'いつ食べるか',
    anyOccasion:
      '場面を問わない',
    alsoCalled:
      '別の呼び名',
    notATranslationOfOurs:
      'どれもその言語の百科事典の記事で使われている名前で、こちらが訳したものではなく、上の名前に取って代わるものでもありません。触れるとそちらで読めます。',
    relatedTraditions:
      '関わりのある伝統',
    relatedTraditionsNote:
      'この記録と土地・伝統・材料のどれかを共有する記録です。どれを共有しているかは各項に書いてあります。',
    scoreCannotSettle:
      '根拠がどれだけ強いかの見積もりであって、点数が文化的な正しさを決められるという主張ではありません。',
    notScored:
      '採点なし',
    navAtlasNote:
      '何が入っていて、どれだけ確かか',
    navProposeNote:
      'アトラスに記録のない料理',
    navConfirmNote:
      '知っている人を待っている料理',
    navSupportNote:
      '運営にかかる費用と、その出どころ',
    confirmPrompt:
      'あなたの土地でも、こう作りますか。',
    confirmAskBody:
      'この料理の生まれた土地であなたが作っているなら、その確認や訂正こそが、記録を未確認から動かすものです。あなたのやり方が違うところは、この記録の代わりにではなく、隣に書き留めます。',
    confirmYes:
      'はい、これで合っています',
    confirmNo:
      'うちの土地では作り方が違います',
    confirmPlacePrompt:
      'この料理は、こちらの示した土地のものですか。',
    confirmPlaceBody:
      'これがどう作られるかは誰も書き残していないので、まだ同意する対象がありません。土地はこの記録が主張していることであり、それだけでも確かめる値打ちがあります。六つの根拠の確認のひとつです。',
    confirmPlaceYes:
      'はい、ここのものです',
    confirmPlaceNo:
      'いいえ、よその土地のものです',
    standingMet:
      '{place}にゆかりのある {n} 人が確認しました。印に必要な人数です。',
    standingNobody:
      'まだ誰もいません',
    standingOne:
      'これまでに一人',
    standingMany:
      'これまでに {n} 人',
    standingNeed:
      '{soFar}。印には {need} 人が必要なので、{place}にゆかりのある{people}で届きます。',
    onePersonMore:
      'あと一人',
    morePeople:
      'あと {n} 人',
    contestedNote:
      '見つけられるようにここに置いています。この料理には {n} か所が裏づけのある由来を主張しており、どれも決着していません。すべて下に挙げてあります。',
    relatedAlsoFrom:
      '同じく{place}から',
    relatedAlsoCuisine:
      '同じく{cuisine}',
    relatedSharesIngredients:
      '材料が {n} 品共通',
    relatedAlsoUses:
      '同じく{ingredient}を使う',
    relatedAlsoCategory:
      '同じく{category}',
    authenticVersion:
      '本物の作り方',
    thePublishedRecipe:
      '公開されているレシピ',
    whyThisIsAnAdaptation:
      'これがアレンジである理由',
    whyConsideredAuthentic:
      'これが本物とされる理由',
    whatThisRecordIs:
      'この記録が何であるか',
    stepSubmit:
      '送信',
    stepWhatExists:
      '今あるもの',
    stepAssessment:
      '評価',
    stepValidation:
      '確認',
    findingAggregatorTitle:
      'レシピまとめサイトのページ',
    findingAggregatorTag:
      '広まっている候補',
    findingAggregatorNote:
      '検索の最上位。書き手はマラバールとのつながりを示しておらず、ギーの代わりにバターを使っています。',
    findingVideoTitle:
      'マラヤーラム語の料理チャンネルの動画',
    findingVideoTag:
      'その土地の情報源',
    findingVideoNote:
      'ケーララで撮影、マラヤーラム語、ギーとネンドラン バナナも説明のとおり。',
    findingGapTitle:
      '町の単位での記録は見つからず',
    findingGapTag:
      '欠落',
    findingGapNote:
      'コーリコードで具体的にどう作るのかを記した資料はありません。この投稿が最初になります。',
    checkOriginLabel:
      '地理的な由来',
    checkOriginNote:
      'マラバール、コーリコード — 投稿者の申告で、動画の出典とも一致。',
    checkLocalPrepLabel:
      'その土地の作り方',
    checkLocalPrepNote:
      'イフタールや家の行事のための家庭料理として説明されています。',
    checkIngredientsLabel:
      '伝統的な材料',
    checkIngredientsNote:
      'ネンドラン バナナ、卵、ギー — 現地の動画と一致します。',
    checkTechniqueLabel:
      '伝統的な技法',
    checkTechniqueNote:
      '弱火、熾火を載せた蓋。',
    checkDocumentationLabel:
      '歴史的・文化的な記録',
    checkDocumentationNote:
      '乏しい。研究も文書館の記録も見つかりませんでした。',
    checkLocalSourceLabel:
      'その土地の情報源',
    checkLocalSourceNote:
      '投稿者はコーリコード生まれで、そこで作っていると述べています。',
    checkCommunityLabel:
      '地域の人による確認',
    checkCommunityNote:
      'まだ求めていません。この記録がまだ本物と呼べないのはそのためです。',
    validatorHomeCook:
      '家庭で作る人、コーリコード',
    validatorHomeCookSaid:
      '材料と、蓋に熾火を載せる方法を確認しました。',
    validatorBakery:
      '菓子店の主人、タラッシェリ',
    validatorBakerySaid:
      '確認。自分のところは砂糖が少なめだと述べています。',
    validatorWriter:
      '食の書き手、ケーララ',
    validatorWriterSaid:
      'マラバールの家庭料理として確認。資料は実際にごくわずかです。',
    validatorPending:
      'さらに二人に確認を依頼',
    validatorPendingSaid:
      '返答待ち — 記録はこの二人がなくても公開されます。',
    photoCheckedNote:
      '記録が送られた時点で Commons と照合し、撮影者とライセンスとともに表示します。作り方と同じく、地域の人が確認するまでは未確認のままです。',
    mostPublishedNote:
      'いちばん多く公開されている版を、広まっている候補として扱います。それで本物の記録になるわけではありません。',
    sevenChecksNote:
      '七つの確認があり、それぞれ答えが付くか、空のまま残ります。空のままだと確からしさは下がります。推測で埋めることは決してありません。',
    draftConfidence:
      '/100 暫定の確からしさ',
    unverifiedPendingTag:
      '⚪ 未確認 — 地域の人による確認待ち',
    oneSubmitterNote:
      'その土地の投稿者が一人いることは根拠であって、証明ではありません。地域の人たちが確認するまで、記録は未確認のままです。',
    threeConfirmationsNote:
      'その土地に住む人、あるいはそこで作る人による三件の確認が、記録を未確認から引き上げます。',
    conflictingAccountsNote:
      '食い違う証言はどちらも残します。記録は、人が実際に語った伝統ごとに — 地域や集団ごとに一つずつ — 分かれ、どれかが本当のものだと宣言されることはありません。',
    nowhereToSendNote:
      '今のところ送り先がありません。自由に使える資料が持っているものはすべて読み終えたので、これから足りないのは、誰も書き残していない料理です。つまりこの用紙こそがアトラスの育ち方であり、送り先ができ次第、開きます。',
    whereTheExampleEndsUp:
      '例に挙げた記録は、こうして落ち着きます。根拠が見える形で公開され、空のままの確認は名指しされ、どの主張も誰が言ったのかまでたどれます。',
    confirmedBy:
      '確認した人',
    nothingMatchesAll:
      'これらすべてに同時に当てはまるものはありません。',
    mostOfYourListFirst:
      '手持ちの材料をいちばん使うものから',
    translatesTheAppsWords:
      '訳すのはこのアプリ自身の言葉です。料理は記録された言語のまま残ります。記録ごとに翻訳の操作があります。',
    byNameAndPlaceOnly:
      'これらは名前と土地だけでアトラスに入っています。どう作るのかを誰も記録していないので、作り方も点数もありません。',
    wikipediaViewsNote:
      'この一年に英語版ウィキペディアで各料理について読んだ人の数です。これは関心であって、本物かどうかでも、どれだけ食べられているかでもありません。英語話者が調べるものに偏ります。それぞれの区分は開いて確かめてください。',
    requiredDishName:
      '料理の名前',
    requiredCountry:
      '国',
    requiredYourName:
      'あなたの名前',
    requiredYourConnection:
      'その土地とのつながり',
    requiredWhatYouConfirm:
      '確認できること',
    bandNotScored:
      '採点なし',
    bandUnder50:
      '50 未満',
    band50to74:
      '50 – 74',
    band75Plus:
      '75 以上',
    reviewCapitals:
      'これは全体が大文字で書かれています。',
    reviewCapitalsConsider:
      '通常の書き方のほうが読みやすく、訳しやすくなります。料理名は書いたとおりの形が残ります。',
    reviewRepeats:
      '同じ文字が続けて何度も出ています。',
    reviewRepeatsConsider:
      'キーが押されたままになっていないか確かめてください。',
    reviewShort:
      '作り方がとても短いです。',
    reviewShortConsider:
      '作るために何をすればよいかを、待ち時間も含めて書いてください。作り方のない記録は、レシピの棚には並びません。',
    groupSummaryCountries:
      '{c} か国 · {n} 件の伝統',
    groupSummaryOrigins:
      '{c} の出自 · {n} 件の伝統',
    metricTotalTitle:
      '記録された伝統',
    metricTotalCounts:
      '伝統とは、ある土地でのある食べ物の作り方ひとつです。同じ料理が二つの地方で違う作り方をされていれば、それは二つの伝統で、どちらも残します。',
    metricTotalMethod:
      '手作業でそろえた分と四つの取り込み元のうち、見せるものがある記録すべて。少なくとも土地と名前があるものです。補強待ちの行は保留し、数えません。',
    metricTotalCaveat:
      'これは世界の異なる食べ物の数え上げではなく、アトラスがどれだけ知っているかの尺度でもありません。これらの記録の多くは、名前と国だけで、ほかには何もありません。作り方が書かれているものの割合こそが、これがアトラスなのか名前の一覧なのかを言い当てる数字です。',
    metricCountriesTitle:
      '国',
    metricCountriesCounts:
      '取り込み元の地名を解決したうえで、全記録に現れる異なる国の数。',
    metricCountriesMethod:
      '各記録の国の欄を重複なく、国であるものだけを数えます。ある資料が用いた歴史的・超国家的な項目 — オスマン帝国、レヴァント、メソアメリカ — は、こちらが推測するしかない近代国家に割り当てず、その記録に残したままにし、ここでは数えません。それらを数えるとこの数字が三十二増えましたが、そのどれもが実在しないものでした。',
    metricCountriesCaveat:
      '網羅は深さではありません。ある国は記録一件の力でここに現れるので、これはアトラスがどこに行ったかを数えるのであって、どこで役に立つかではありません。下の集中度の数字と並べて読んでください。全体がどれだけ偏っているかを示します。',
    metricAtRiskTitle:
      '途絶えかけている伝統',
    metricAtRiskCounts:
      '資料自身の言葉で、その伝統が衰えつつある、消えつつある、あるいはもう行われていないと述べている記録。',
    metricAtRiskMethod:
      '各項目の導入部と歴史を読み、はっきり述べられた衰退を探します — 「今ではめったに作られない」「最後に残った作り手」 — そして別の意味になる紛らわしい一致は退けます。材料に使われる絶滅危惧種や、閉店した飲食チェーンなどです。判定のもとになった一文は根拠として記録に保存し、記録とともに示します。',
    metricAtRiskCaveat:
      'これは下限であって調査ではなく、実際よりはるかに小さい数字です。見つけられるのは、私たちが読んだ文章に誰かがすでに書き残した衰退だけです。四つの家族が守り、一度も書き残されていない伝統は、まったく数に現れません。スローフードの味の箱船だけでも、危機にある食べ物をおよそ六千件挙げています。この数字の千倍です。',
    metricDocumentedTitle:
      '作り方が記録されている',
    metricDocumentedCounts:
      '順を追った作り方がある記録 — 作るときに人がたどる手順です。',
    metricDocumentedMethod:
      '手作業でそろえた記録は、作り方が書かれ、その土地の人と突き合わせてあります。取り込んだ記録では、公開されたレシピがある場合にだけあります。ある料理が一般にどう作られるかを述べた百科事典の段落は文章として保存し、あえて手順には格上げしません。説明を作り方として示すことは、それが持たない精密さを主張することだからです。',
    metricDocumentedCaveat:
      '作り方があること自体は、それが伝統の作り方かどうかを何も語りません。そのために確からしさの点数があり、作り方のある記録の多くは現代のアレンジに分類されています。',
    metricLocatedTitle:
      '国より細かい場所が入っている',
    metricLocatedCounts:
      '国だけでなく、地方・州・市・村を挙げている記録。',
    metricLocatedMethod:
      '場所に、国より下の階層が埋まっている記録すべて。',
    metricLocatedCaveat:
      '本物かどうかには地理的な深さがあり、国はまだ入り口にすぎません。「コーリコード」は記録で、「インド」は見出しです。総数が大きいのにここの割合が低ければ、それは広くて浅いアトラスです。',
    metricIllustratedTitle:
      '写真がある',
    metricIllustratedCounts:
      'このアプリに表示する権利がある画像を持つ記録。',
    metricIllustratedMethod:
      'Wikidata から、料理自身のウィキペディア記事から、あるいは作る人が Wikimedia Commons を通じて寄せたものです。どれも撮影者とライセンスとともに保存し、確認済みとは記しません。名前で見つけた画像や編集者が選んだ画像は、その料理を写しているという良い根拠ではありますが、このアプリによる確認ではないからです。',
    metricIllustratedCaveat:
      '写真は本物であることの根拠にはなりません。誰かが作った一皿を写しているだけで、それが記録の述べる伝統かどうかは別の話です。',
    metricFilmedTitle:
      '順位のついた動画がある',
    metricFilmedCounts:
      '動画が少なくとも一つあり、作る人が伝統にどれだけ近いかで並べてある記録。',
    metricFilmedMethod:
      '土地との近さで並べます — 作る人がどこにいるか、何語で話しているか、材料と道具が記録と合っているか。再生数や高評価、登録者数では決して並べません。',
    metricFilmedCaveat:
      'この順は伝統への近さについてのもので、撮影の出来ではありません。いちばん上の動画は、たいてい最も飾り気のないものです。',
    metricAssessedTitle:
      '本物と判定されたもの',
    metricAssessedCounts:
      '根拠の確認を経て「本物 — 地元」または「本物 — 地方」に達した記録。',
    metricAssessedMethod:
      '七つの確認があり、それぞれ答えが付くか空のまま残ります。空のものは推測で埋めるのではなく、確からしさを下げます。技法と地域の人による確認が取り込みから推測されることは決してなく、それが取り込んだ記録の単独で届く上限になります。',
    metricAssessedCaveat:
      'ここの割合が低いのは、失敗ではなく正直さです。目録の大半は取り込みで未評価であり、信頼できる出典から来たからという理由でそれらを本物と呼ぶことこそ、この尺度が拒むために存在している近道です。',
    metricConcentrationTitle:
      '偏り',
    metricConcentrationCounts:
      '目録全体のうち、いちばん大きな一国が占める割合。',
    metricConcentrationMethod:
      '最も多く載っている国の記録数を、全体で割ったもの。',
    metricConcentrationCaveat:
      'これはどの国が公開の食品登録簿を持っているかを映すもので、世界の食べ物がどこにあるかではありません。イタリアだけで登録された伝統産品を約 4,400 件公開しています。多くの国は一件も公開しておらず、ここでの不在は台所ではなく書類の不在です。',
    metricConfidenceTitle:
      '確からしさ',
    metricConfidenceCounts:
      '目録が 0〜100 の根拠の点数の上でどう分かれているか。',
    metricConfidenceMethod:
      '手作業でそろえた記録は根拠の確認によって採点します。取り込んだ記録は、補強で採点できる根拠が見つかった場合にだけ採点し、それ以外は既定値を与えず未採点のままにします。',
    metricConfidenceCaveat:
      '「採点なし」が群を抜いて大きな帯で、これからもそうです。まだ誰もその記録を評価していない、という意味であって、点が低かったということでも、その食べ物が怪しいということでもありません。',
    metricByContinentTitle:
      '記録がどこにあるか',
    metricByContinentCounts:
      '大陸ごとの記録数で、どの記録も一度だけ数えます。伝統は、旅してきたかもしれない大陸ではなく、記録された国の大陸に置かれます。',
    metricByContinentMethod:
      '各記録の国から、歴史上のものを含めおよそ 200 の国を網羅した国と大陸の対応表を通して。超国家的な項目や係争中の項目は、無理に大陸へ入れずにまとめます。',
    metricByContinentCaveat:
      'これは出典の地図であって、世界の料理の地図ではありません。ヨーロッパが多いのは、ヨーロッパの登録簿がネット上にあり公開されているからで、これは文書館についての事実です。',
    howIsThisCounted:
      'これはどう数えていますか。',
    hideHowThisIsCounted:
      '数え方を閉じる',
    stapleGrains: '穀物',
    stapleRoots: '根菜',
    staplePulses: '豆類',
    stapleDairy: '乳製品',
    stapleMeatFish: '肉と魚',
    stapleVegetables: '野菜',
    stapleAromatics: '香味野菜',
    stapleSweetSour: '甘味と酸味',
    stapleRice: '米',
    stapleWheat: '小麦',
    stapleMaize: 'とうもろこし',
    stapleMillet: 'キビ',
    stapleSorghum: 'ソルガム',
    stapleBarley: '大麦',
    stapleOats: 'オーツ麦',
    stapleBuckwheat: 'そば',
    stapleTeff: 'テフ',
    staplePotato: 'じゃがいも',
    stapleCassava: 'キャッサバ',
    stapleSweetPotato: 'さつまいも',
    stapleYam: 'ヤムイモ',
    stapleTaro: 'タロイモ',
    staplePlantain: 'プランテン',
    stapleLentil: 'レンズ豆',
    stapleChickpea: 'ひよこ豆',
    stapleSoy: '大豆',
    stapleTofu: '豆腐',
    stapleBlackBean: '黒豆',
    stapleMungBean: '緑豆',
    staplePigeonPea: 'キマメ',
    stapleMilk: '牛乳',
    stapleYoghurt: 'ヨーグルト',
    stapleCheese: 'チーズ',
    staplePaneer: 'パニール',
    stapleGhee: 'ギー',
    stapleButter: 'バター',
    stapleCoconut: 'ココナッツ',
    stapleChicken: '鶏肉',
    stapleBeef: '牛肉',
    staplePork: '豚肉',
    stapleLamb: '子羊肉',
    stapleGoat: 'ヤギ肉',
    stapleFish: '魚',
    staplePrawn: 'エビ',
    stapleEgg: '卵',
    stapleOnion: '玉ねぎ',
    stapleGarlic: 'にんにく',
    stapleGinger: 'しょうが',
    stapleChilli: '唐辛子',
    stapleLemongrass: 'レモングラス',
    stapleTomato: 'トマト',
    stapleAubergine: 'なす',
    stapleCabbage: 'キャベツ',
    stapleSpinach: 'ほうれん草',
    stapleOkra: 'オクラ',
    stapleTamarind: 'タマリンド',
    stapleHoney: 'はちみつ',
    stapleJaggery: '粗糖',
    stapleDate: 'ナツメヤシ',
    stapleLemon: 'レモン',
    stapleOlive: 'オリーブ',
    dietVegan: 'ヴィーガン',
    dietVegetarian: 'ベジタリアン',
    dietSeafood: '魚介',
    dietMeat: '肉あり',
    dietUnclassified: '分類なし',
    dietPoultry: '鶏・鳥',
    dietPork: '豚肉',
    dietBeef: '牛肉・赤身肉',
    dietLambGoat: '子羊・山羊',
    dietGame: 'ジビエ',
    dietFish: '魚',
    dietShellfish: '甲殻類・貝',
    dietOtherSeafood: 'そのほかの魚介',
    dietDairy: '乳製品を含む',
    dietEgg: '卵を含む',
    dietHoney: 'はちみつを含む',
    mealBreakfast: '朝食',
    mealLunch: '昼食',
    mealDinner: '夕食',
    mealSupper: '夜食',
    mealSnack: '軽食',
    mealStreetFood: '屋台の食べ物',
    mealCelebration: '祝いの席・ごちそう',
    mealAnytime: 'いつでも',
    mealUnclassified: '記録なし',
    searchModeFind:
      '料理を探す',
    searchModePantry:
      '家にあるもので作る',
    ingredientsYouHave:
      '手元にある材料',
    nTraditions:
      '{n} 件の伝統',
    nothingYet:
      'まだありません',
    methodRecorded:
      ' · 作り方あり',
    noMethodYet:
      ' · 作り方はまだ',
    showMoreLeft:
      'もっと見る — 残り {n} 件',
    showNMore:
      'さらに {n} 件を見る',
    methodAsPublished:
      '公開されたままの作り方です。現代の道具や手早いやり方もその一部です。',
    methodTraditional:
      '伝統の作り方です。現代の近道を置き換えたところはありません。',
    everythingClassified:
      '{what}に分類されたものすべて',
    everythingFrom:
      '{place}のものすべて',
    everythingRecordedAs:
      '{what}として記録されたものすべて',
    everythingMadeWith:
      '{ingredient}を使うものすべて',
    seeEverything:
      '{label} — すべて見る',
    noPhotographOnRecord:
      '{label} — 記録に写真はありません',
    scoreOutOf100:
      '{label}：100 点中 {value} 点',
    removeFilter:
      '{key}の絞り込みを外す',
    anywhereInTheAtlas:
      'アトラスのどこでも',
    absenceOfRecords:
      '。これは記録が無いということで、料理が無いということではありません。分からないと言うほうを選びます。',
    narrowToA:
      '{level}まで絞る · {n} 件',
    fromTheTown:
      ' — その町の出身',
    showFewer:
      '表示を減らす',
    readAboutOnWikipedia:
      '{language}版ウィキペディアで{name}について読む',
    languageChangeIt:
      '言語：{language}。変更できます。',
    perCentTranslated:
      '{language}、{n} パーセント翻訳済み',
    translateThisRecord:
      'この記録を訳す',
    translating:
      '翻訳中…',
    translate:
      '訳す',
    translateThisConfirmation:
      'この確認を{language}に訳す',
    couldNotTranslate:
      '翻訳できませんでした — もう一度お試しください',
    howThisIsCountedFor:
      '{figure}の数え方',
    countOfTotal:
      '{label}：{total} 件中 {count} 件',
    watchAtSourceCreator:
      '{creator} を元の場所で見る',
    stillFromCreator:
      '{creator} の動画からの一場面',
    thatDidNotSend:
      '送信できませんでした。',
    containsAlcohol:
      'アルコールを含む',
    nothingElseRequired:
      'ほかは何でも歓迎で、必須のものはありません。ある料理がどこのもので、それを誰も書き残していないと分かること自体が、ここにあるどの資料が持っているものより多いのです。',
    opensTheFormPrefilled:
      'すでに書いた内容を入れた状態で、元の場所にある用紙を開きます。このアプリはあなたについて何も集めず、その土地の人が確認するまで何も公開されません。',
    scoreDimGeographic:
      '土地とのつながり',
    scoreDimIngredients:
      '伝統的な材料',
    scoreDimTechnique:
      '伝統的な技法',
    scoreDimLocalSource:
      'その土地の情報源',
    scoreDimDocumentation:
      '文化的な記録',
    scoreDimCommunity:
      '地域の人による確認',
    photoFromWikidata:
      'この料理自身の Wikidata 項目に添えられたもの — 名前で探して見つけたものではありません',
    photoFromArticle:
      'この料理自身の百科事典記事の先頭画像',
    photoFromRecipe:
      'このレシピ自身のページに掲載されたもの',
    photoFromSearch:
      'Wikimedia Commons で名前が一致したもの — 写っているものは未確認です',
    photoFromUnknown:
      '出どころは記録されていません — 写っているものは未確認として扱ってください',
    noTranslationRecorded:
      'この語りの訳はまだ記録されていないので、記録された言語である{language}のまま表示しています。発酵時間について機械が当てずっぽうを言うより、原文をお見せするほうを選びます。',
    machineTranslationBy:
      '{translator} による機械翻訳です。地域の人による確認はまだありません。材料と道具の名前は原文のままです。',
    translatedBy:
      '{translator} による翻訳です。材料と道具の名前は原文のままです。',
    videoOriginalAudio:
      '{language}で話されています。作る人自身の言葉なので、訳しているものはありません。',
    videoCreatorTrack:
      '作った人が{language}の音声を公開しています。元の場所ではその音声で開きます。訳はその人自身のもので、こちらのものではありません。',
    videoPlatformCaptions:
      '{spoken}で話されています。元の音声の上に、機械翻訳された{preferred}の字幕を載せて開きます。作る人の声は差し替えず、訳は動画プラットフォームのもので、人によるものではありません。',
    videoLanguageUnknown:
      'この動画で話されている言語は記録にないので、{language}をお約束できません。元の場所で開き、そこではプラットフォーム自身の字幕設定が使えます。',
    figureDocumented:
      '作り方が記録されている',
    figureDocumentedNote:
      'これがアトラスなのか名前の一覧なのかを言い当てる数字です。ほかはすべてこれに次ぎます。',
    figureLocated:
      '国より細かい場所が入っている',
    figureLocatedNote:
      '本物かどうかには地理的な深さがあります。「コーリコード」は記録で、「インド」はまだ入り口です。',
    figureIllustrated:
      '写真がある',
    figureIllustratedNote:
      '思い浮かべられない料理は、心にかけるのも難しく、見分けるのはもっと難しいものです。',
    figureFilmed:
      '順位のついた動画がある',
    figureFilmedNote:
      '作る人が伝統にどれだけ近いかで並べています。検索結果ではありません。',
    figureAssessed:
      '本物と判定されたもの',
    figureAssessedNote:
      '根拠の確認を経て得られます。ここの割合が低いのは正直さであって、失敗ではありません。',
    atlasSummary:
      '{c} か国から {n} 件の伝統を記録しています。網羅の度合いは正直に述べます。ここに無い国は、まだ何も記録されていないということで、記録するものが無いということではありません。',
    nothingRecorded:
      '記録はありません',
    nothingRecordedAs:
      '{what}としての記録はありません',
    nothingRecordedAsAnd:
      '{list}と{last}としての記録はありません',
    photoVia:
      '写真提供',
    photoNothingEntered:
      'まだ何も入力されていません。',
    photoNothingEnteredFix:
      'Commons のファイル名か、そのファイルページへのリンクを貼ってください。',
    photoWrongHost:
      'そのリンクは{host}に向いています。そこから写真を公開する権利は、こちらにはありません。',
    photoWrongHostFix:
      'その写真がご自分のものなら、自由なライセンスで Wikimedia Commons に上げ、ファイル名をここに貼ってください。写真はあなたのもののままで、出るところすべてに名前が載り、費用もかかりません。',
    photoNotCommons:
      'そのリンクは Wikimedia Commons のものではありません。',
    photoNotCommonsFix:
      'ここで公開できるのは Commons のファイルだけです。表示を許すライセンスが付いているのはそれだけだからです。',
    photoNoFileName:
      'その中にファイル名が見つかりませんでした。',
    photoNoFileNameFix:
      'ファイル名を貼ってください。たとえば Kaipola.jpg です。',
    photoNotAPhotograph:
      'それは写真のファイルではありません。',
    photoNotAPhotographFix:
      'Commons の写真は .jpg、.png、.webp で終わります。図やロゴはここでは使いません。',
    photoIsADrawing:
      'それは絵であって、写真ではありません。',
    photoIsADrawingFix:
      '作られたままの料理の写真を使ってください。',
    serverRefused:
      'サーバーに断られました（{status}）。',
    serverTookTooLong:
      'サーバーの応答に時間がかかりすぎました。',
    couldNotReachServer:
      'サーバーに接続できませんでした。',
    nothingYouTypedIsLost:
      '{message} 入力は送信されていません。書いたものは何も失われていないので、少ししてからもう一度お試しください。',
    proposalsNotOpen:
      '投稿はまだ開いていません。',
    confirmationsNotOpen:
      '確認はまだ開いていません。',
    alreadyProposed:
      'この料理はすでに投稿されています。それを開いて確認してください。動くのはそちらです。',
    alreadyConfirmed:
      'これはすでに確認済みです。',
    youProposedThis:
      'この料理はあなたが投稿したものなので、確認は別の人が行う必要があります。',
    stillNeededList:
      'あと必要なもの：{list}。',
    listAnd:
      '{list}と{last}',
    listOr:
      '{list} か {last}',
    proposalConfirmed:
      '確認されました。次の更新でアトラスに入ります。',
    proposalNobodyYet:
      'まだ誰も確認していません。この料理を知る {n} 人がいれば、アトラスに入ります。',
    proposalSoFar:
      '{n} 件中 {have} 件の確認。この料理を知る人があと {short} 人いれば入ります。',
    recordNobodyYet:
      'その土地の人からの確認はまだありません。{n} 件の確認があれば裏づけになります。',
    recordSoFar:
      '{n} 件中 {have} 件の確認。この料理を知る人があと {short} 人いれば裏づけになります。',
    atRiskNote:
      'ある資料がこの伝統を衰えつつあると述べているために印を付けています。その一文は記録とともに示します。こちらの記録が少ないことから推し量ることは決してありません。こちらの記録の空白は、誰かが作るのをやめた証拠ではないからです。',
    originDisclaimer:
      'この料理には、裏づけのある歴史的な由来の主張が複数あります。下の伝統は、それぞれの土地が述べるとおりに、出典とともに記録しています。どの主張も勝ったものとしては示しませんし、これらが本物らしさの点数に影響することもありません。点数が測るのは、ある土地でその料理がどう作られるかであって、誰が最初に作ったかではありません。',
    supportRunsOn:
      'アトラスにあるものはすべて、ウィキペディア、ウィキデータ、ウィキメディア・コモンズ、ウィキブックス、そして公開されている地域の登録簿から来ています。どれも自由に読めて、開かれたライセンスで、使った記録ごとに出典を示しています。この企てが無料であり続ける根拠はこれがすべてで、これは段階ではなく決定です。',
    contributeToTheAtlas:
      'アトラスを支える',
    answeredByDocuments:
      'これは資料が答えられます',
    answeredByPeople:
      'これは人しか答えられません',
    scaleDocumentsStop:
      '資料はここまで',
    scaleAuthenticBegins:
      'ここから本物',
    pantryNothingUses:
      '記録のあるものに {list} を使うものはありません。使う料理を誰も書き残していないだけかもしれません。アトラスの {p}% には材料が一つも記載されていません。',
    alsoRecordedIn:
      '{list} にも記録あり',
    alsoRecordedNote:
      'アトラスはそちらにもこの料理の別の記録を持っています。どちらかがもう一方を訂正するものではありません。二つの食文化がつくる料理は、どちらにとっても誤りではありません。',
    chooseACountry:
      '国を選ぶ',
    filterTheList:
      '入力して一覧を絞り込む',
    showingFirstNOfM:
      '{m} 件中 {n} 件を表示しています。入力を続けると絞り込めます。',
    nothingMatchesThat:
      '一覧に一致するものがありません。',
    continentBeyondOneCountry:
      '一国にとどまらない',
    beyondOneCountryNote:
      '出典が一つの国より広く記録している由来です。地域、共有された食文化圏、あるいはすでに存在しない国家など。誰も選んでいない国に狭めるのではなく、出典の記述のまま残しています。',
    connectionGrewUpThere:
      'そこで育ちました',
    connectionLiveThere:
      'そこに住んでいます',
    connectionFamilyFrom:
      '家族がそこの出身です',
    connectionLearnedThere:
      'そこで作り方を覚えました',
    connectionCookProfessionally:
      'そこで仕事として作っています',
    chooseYourConnection:
      '当てはまるものを選んでください',
    connectionInYourWords:
      '付け加えたいことがあれば、ご自身の言葉で',
    connectionDetailPlaceholder:
      '祖母が毎年イードにコジコードで作っていました',
    dictateSpeak:
      '入力の代わりに話す',
    dictateListening:
      '聞いています — 押すと停止',
    dictateStop:
      '聞き取りを止める',
    dictateSendsAudio:
      '聞き取りはブラウザが行い、多くのブラウザはそのために音声を自社のサーバーへ送ります。話した内容は上の欄に追加され、そこで直せます。',
    dictateNotAllowed:
      'ブラウザがマイクを許可しませんでした。',
    dictateDidNotWork:
      'うまくいきませんでした。入力でも大丈夫です。',
    polishTidyThis:
      '打ち間違いを直す',
    polishWorking:
      '直しています…',
    polishMachineMade:
      '機械による提案です。あなたの言葉は上に残っています',
    polishUseThis:
      'これを使う',
    polishKeepMine:
      '自分のままにする',
    polishOnlyTyping:
      '触れるのは表記、句読点、空白だけです。何も足さず、削らず、言い換えず、名前も変えません。',
    polishFoundNothing:
      '直すところはありません。書かれたままで読めます。',
    polishDidNotWork:
      'うまくいきませんでした。書いた内容はそのままです。',
    continentAfrica:
      'アフリカ',
    continentAsia:
      'アジア',
    continentEurope:
      'ヨーロッパ',
    continentNorthAmerica:
      '北アメリカ',
    continentSouthAmerica:
      '南アメリカ',
    continentOceania:
      'オセアニア',
    regionLevant:
      'レヴァント',
    regionLatinAmerica:
      'ラテンアメリカ',
    regionMiddleEast:
      '中東',
    regionMaghreb:
      'マグリブ',
    regionCentralEurope:
      '中央ヨーロッパ',
    regionEasternEurope:
      '東ヨーロッパ',
    regionSouthernEurope:
      '南ヨーロッパ',
    regionCentralAsia:
      '中央アジア',
    regionIndianSubcontinent:
      'インド亜大陸',
    regionNorthAfrica:
      '北アフリカ',
    regionAmericas:
      'アメリカ大陸',
    regionAncientNearEast:
      '古代オリエント',
    regionBalkans:
      'バルカン半島',
    regionCaribbean:
      'カリブ海',
    regionLowCountries:
      '低地諸国',
    regionMesoamerica:
      'メソアメリカ',
    regionMiddleEasternEmpires:
      '中東の帝国',
    regionPolishLithuanianCommonwealth:
      'ポーランド・リトアニア共和国',
    regionQajarIran:
      'ガージャール朝',
    regionRussianEmpire:
      'ロシア帝国',
    regionSouthCaucasus:
      '南カフカス',
    regionSovietCentralAsia:
      'ソビエト中央アジア',
    regionWu:
      '呉',
    regionArtsakh:
      'アルツァフ共和国',
    refineDietOccasion:
      '食事の制限と場面',
    refineAny:
      'すべて',
    placeKindWiderRegion:
      '広域の地域',
    placeKindFormerState:
      'かつての国',
    oneTradition:
      '1 件の伝統',
    onePlace:
      '1 か所',
    nPlaces:
      '{n} か所',
    countryLevelOnly:
      '国単位のみ',
    summaryWorldwide:
      '（世界全体）',
    nRecorded:
      '{n} 件収録',
    writtenInLanguage:
      '{language}で書かれています',
    whatThisIs:
      'これは何か',
    atlasDefinition:
      '伝統料理の無料アトラス。それぞれがどこのもので、誰が保証しているのか。',
    traditionsLabel:
      '件の伝統',
    freeNoAds:
      '無料、広告なし',
    quotedFromSource:
      '下記の出典からの引用です。一般的な作り方の説明であり、{place}での作り方の記録ではありません。',
    adaptationLeadIn:
      'この料理が現在一般的にどう作られているかです。{place}での作り方の記録ではなく、現地の人の確認もありません。',
    openDisagreementBody:
      '{place}でこれを作っている人から、作り方が違うとの声がありました：{differs} 確認中も何も削除されておらず、下の信頼度も変わりません。両方が成り立てば、どちらかを否定するのではなく記録が分かれます。',
    engagementNotShown:
      '再生数はあえて表示していません。本物かどうかを測るものではないからです。',
    videoSearchNote:
      '出典先で検索できます。結果は再生数順で戻りますが、それは広まりを示すだけです——作り手が{place}の人とは限りません。こうして見つかったものは、この記録の分類に影響しません。',
    nowOpenForConfirmation:
      '{name} は確認待ちとなりました。',
    proposalOpenBody:
      'アトラスに入るには、この料理を知る {n} 人の確認が必要です。今から誰でも見て確認できます——あなたが伝えた人も含めて。記録のなかった料理は、たいていそうして確認されます。',
    nothingMatchesBody:
      'アトラスにはまだ{query}に一致するものがありません。ここでの不在は記録がないということであって、料理がないということではありません——推測するより、わからないと言います。',
    thatWord:
      'それ',
    interfaceTranslationNote:
      'この画面表示は機械翻訳で、話者による確認を経ていません。記録そのものには影響しません。訂正を歓迎します。',
  },
};

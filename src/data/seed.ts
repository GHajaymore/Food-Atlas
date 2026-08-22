/**
 * The six-record development seed.
 *
 * The handoff is explicit that this is fixture data, not a database: "dish data is a
 * six-record seed... Confidence scores in the seed are illustrative. In production
 * they must be computed from the evidence checks and community validation."
 *
 * Kept as fixtures on purpose — the set exercises the branches that matter:
 *   - Hawaiian Pizza is Fusion, unscored, and must never render as a version of the
 *     Neapolitan record it links back to.
 *   - Hákarl and Ayrag are at-risk traditions.
 *   - Every record carries real sources, real videos and a real photograph with its
 *     Wikimedia attribution, several under CC BY-SA — so credit is displayed
 *     wherever the image is shown.
 */

import { assertDishes } from '../domain/invariants';
import type { Dish } from '../domain/types';

const commons = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=900`;
const commonsPage = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

const SEED: Dish[] = [
  {
    id: 1,
    name: 'Kozhikode Halwa',
    category: 'Sweet',
    // Kozhikode's halwa is made with coconut oil, not ghee — which is what makes
    // this one vegan where the same sweet elsewhere in Kerala is not.
    diet: {
      group: 'vegan',
      kinds: [],
      contains: [],
      basis:
        'The Kozhikode preparation is cooked in coconut oil rather than ghee, and the method uses no dairy, egg or honey.',
    },
    // Not a course. Sold by weight on Halwa Street, eaten through the day, and taken
    // away as a gift — which is why it carries no meal slot.
    meals: {
      occasions: ['snack', 'celebration'],
      note: 'Bought by weight along Kozhikode’s Halwa Street and eaten through the day; taken as a gift and served at Ramadan and at family occasions.',
    },
    sourceLanguage: 'en',
    loc: { country: 'India', region: 'Kerala', province: 'Malabar', city: 'Kozhikode', village: '' },
    breadcrumb: ['India', 'Kerala', 'Malabar', 'Kozhikode'],
    badgeLevel: 'local',
    badgeIcon: '🟢',
    badgeLabel: 'Authentic — Local',
    badgeLabelFull: 'Authentic — Local/Traditional',
    traditionalBadge: true,
    atRisk: false,
    blurb: "A dense, glossy halwa cooked for hours in copper vessels along Kozhikode's Halwa Street.",
    photo: commons('Kozhikode_Halwa.jpg'),
    credit: 'Wikimedia Commons',
    creditHref: commonsPage('Kozhikode_Halwa.jpg'),
    photoOrigin: 'Kozhikode halwa — shooting location not recorded in the source',
    photoVerified: false,
    score: 94,
    views: '',
    breakdown: [
      ['Geographic connection', 98],
      ['Traditional ingredients', 95],
      ['Traditional technique', 96],
      ['Local source', 100],
      ['Cultural documentation', 87],
      ['Community validation', 90],
    ],
    prepSummary:
      'Cooked for hours over direct heat in a wide copper pan with coconut oil, stirred continuously until the mixture turns dark and glossy.',
    ingredients: ['Wheat starch or maida', 'Coconut oil', 'Sugar or jaggery', 'Cashews', 'Cardamom'],
    equipment: ['Wide copper or bronze pan', 'Long-handled wooden stirrer'],
    steps: [
      'Soak raw rice or wheat overnight, grind it, and strain to extract the starch milk; let it settle and pour off the water.',
      'Melt sugar into a syrup in the wide copper pan over a steady flame.',
      'Pour in the starch milk and stir without stopping — over 2–4 hours it thickens and darkens.',
      "Add coconut oil a ladle at a time — Kozhikode's halwa is made with coconut oil, not ghee — only as the mixture absorbs the last one.",
      'Stir in roasted cashews and cardamom near the end.',
      'It is done when the halwa leaves the sides of the pan cleanly and takes on a glassy sheen.',
      'Pour into greased trays, level it, and cool for several hours before cutting.',
    ],
    adaptation: {
      traditional: 'Starch extracted and washed by hand, cooked in pure coconut oil.',
      substitute: 'Cornstarch, and ghee or refined vegetable oil, used in some export-market versions.',
    },
    popular: {
      label: 'The home-kitchen version most widely shared',
      source: "Kozhikode halwa recipe video (creator's own ingredient list)",
      url: 'https://www.youtube.com/watch?v=gkHGf2u_iwc',
      level: '🟠 Modern Adaptation',
      changed: [
        "Refined flour (maida) in place of hand-extracted wheat or rice starch — per the video's own ingredient list",
        "Made in a home kitchen rather than in the city's halwa workshops",
      ],
    },
    videos: [
      {
        rank: 1,
        creator: 'Indian Street Food',
        role: 'Full making process filmed at a Kozhikode halwa shop',
        id: 'XoqbHcBDtdg',
        short: false,
        languageCode: 'ml',
      },
      {
        rank: 2,
        creator: 'Pachamulak',
        role: 'Malayalam local-television segment on Kozhikodan halwa',
        id: 'BGovY3E6Dj4',
        short: false,
        languageCode: 'ml',
      },
      {
        rank: 3,
        creator: 'Kozhikode Halwa — UNESCO City of Literature',
        role: 'Wheat, coconut oil and jaggery, as made in the city',
        id: 'mmzXqIH9R5I',
        short: false,
        languageCode: 'en',
      },
    ],
    sources: [
      {
        title: 'Kozhikode Halwa — process documented in the city',
        publisher: 'Sahapedia',
        url: 'http://www.sahapedia.org/kozhikode-halwa',
        note: 'Filmed in Kozhikode, 2017. Records the coconut-oil method.',
      },
    ],
    disclaimer:
      "Kozhikode's halwa-making families have documented, multi-generational records of this recipe, and the preparation is consistently described the same way across independent local sources.",
    // Peer of the Thalassery record below. Neither is the canonical halwa.
    traditionId: 'malabar-halwa',
    disputes: [
      {
        id: 'halwa-thalassery',
        from: 'Thalassery',
        kind: 'variation',
        differs: 'Less sugar, and the halwa is set thinner and cut smaller.',
        raisedAt: '2026-05-02',
        // Kept, not overruled: the Thalassery account was true about Thalassery.
        status: 'forked',
        resultingDishId: 7,
      },
    ],
  },
  {
    /**
     * The fork, worked through.
     *
     * A bakery owner in Thalassery said their version uses less sugar. That was not a
     * contradiction of the Kozhikode record — it was never a claim about Thalassery —
     * so the record split rather than one account being overruled. Both are published,
     * both carry their own evidence, and neither is presented as the real one.
     */
    id: 7,
    name: 'Thalassery Halwa',
    category: 'Sweet',
    sourceLanguage: 'en',
    diet: {
      group: 'vegan',
      kinds: [],
      contains: [],
      basis: 'Coconut oil, as in the Kozhikode preparation. No dairy, egg or honey in the method described.',
    },
    meals: {
      occasions: ['snack', 'celebration'],
      note: 'Cut smaller than the Kozhikode version and eaten with tea, and at Ramadan and family occasions.',
    },
    loc: { country: 'India', region: 'Kerala', province: 'Malabar', city: 'Thalassery', village: '' },
    breadcrumb: ['India', 'Kerala', 'Malabar', 'Thalassery'],
    badgeLevel: 'local',
    badgeIcon: '🟢',
    badgeLabel: 'Authentic — Local',
    badgeLabelFull: 'Authentic — Local/Traditional',
    traditionalBadge: true,
    atRisk: false,
    blurb: 'The Malabar halwa as set in Thalassery — less sugar, cut thinner, eaten with tea.',
    /*
     * No photograph, deliberately.
     *
     * This record used Kozhikode_Halwa.jpg — the same file as the Kozhikode record,
     * which sits directly beside it on the front page. Two cards, one picture, and the
     * record's own `photoOrigin` admitted the shot was "Malabar halwa" with no location
     * recorded.
     *
     * It undercuts the thing this record exists to say. Thalassery's halwa is *less
     * sugar, set thinner, cut smaller* — that is the whole reason it is a sibling
     * tradition rather than a duplicate — and illustrating it with Kozhikode's tray
     * shows a reader the opposite. The monogram says "no photograph on record", which
     * is true, and is what 49% of the atlas already says.
     */
    photo: '',
    credit: '',
    creditHref: '',
    photoOrigin: 'No photograph on record',
    photoVerified: false,
    // Lower than Kozhikode's 94: fewer independent sources describe this version,
    // and the fork is recent. The number reflects the evidence, not the ranking.
    score: 81,
    views: '',
    breakdown: [
      ['Geographic connection', 92],
      ['Traditional ingredients', 88],
      ['Traditional technique', 85],
      ['Local source', 90],
      ['Cultural documentation', 62],
      ['Community validation', 70],
    ],
    prepSummary:
      'Cooked as in Kozhikode — coconut oil, a wide pan, hours of stirring — but with noticeably less sugar and set in a thinner tray.',
    ingredients: ['Wheat starch or maida', 'Coconut oil', 'Sugar or jaggery', 'Cashews', 'Cardamom'],
    equipment: ['Wide copper or bronze pan', 'Long-handled wooden stirrer'],
    steps: [
      'Extract the starch milk as for the Kozhikode preparation and let it settle.',
      'Melt sugar into a syrup — Thalassery bakers use noticeably less than Kozhikode.',
      'Pour in the starch milk and stir without stopping until it thickens and darkens.',
      'Add coconut oil a ladle at a time, only as the mixture takes up the last one.',
      'Stir in roasted cashews and cardamom near the end.',
      'Pour into a shallow tray so it sets thinner, cool, and cut into small pieces.',
    ],
    adaptation: {
      traditional: 'Starch extracted by hand and cooked in coconut oil.',
      substitute: 'Cornstarch and refined vegetable oil, used in some commercial bakery versions.',
    },
    popular: null,
    videos: [],
    sources: [
      {
        title: 'Kozhikode Halwa — process documented in the city',
        publisher: 'Sahapedia',
        url: 'http://www.sahapedia.org/kozhikode-halwa',
        note: 'Documents the shared Malabar method the Thalassery version varies from.',
      },
    ],
    disclaimer:
      'Recorded from a Thalassery bakery owner during the validation of the Kozhikode record, and consistent with the ' +
      'shared Malabar method. Fewer independent sources describe this version specifically, which is why its ' +
      'cultural-documentation score is lower — not because it is less traditional.',
    traditionId: 'malabar-halwa',
    disputes: [
      {
        id: 'halwa-thalassery',
        from: 'Thalassery',
        kind: 'variation',
        differs: 'Less sugar, and the halwa is set thinner and cut smaller.',
        raisedAt: '2026-05-02',
        status: 'kept',
      },
    ],
  },
  {
    id: 2,
    name: 'Oaxacan Mole Negro',
    category: 'Sauce',
    // The ingredient chips read vegetarian; the method does not. This record is the
    // reason dietary classification is never derived from the ingredient list alone.
    diet: {
      group: 'meat',
      kinds: ['pork', 'poultry'],
      contains: [],
      basis:
        'The traditional method fries the paste in lard and loosens it with turkey or chicken broth, though neither appears in the ingredient list.',
    },
    meals: {
      occasions: ['lunch', 'celebration'],
      note: 'Served at the midday comida, and central to weddings, funerals and Day of the Dead — it is cooked in quantity for a gathering, rarely for one household.',
    },
    sourceLanguage: 'en',
    loc: { country: 'Mexico', region: 'Oaxaca', province: '', city: '', village: '' },
    breadcrumb: ['Mexico', 'Oaxaca'],
    badgeLevel: 'regional',
    badgeIcon: '🟢',
    badgeLabel: 'Authentic — Regional',
    badgeLabelFull: 'Authentic — Regional',
    traditionalBadge: false,
    atRisk: false,
    blurb: 'A dark, complex sauce built from charred chiles and chocolate, central to Oaxacan celebrations.',
    photo: commons('Mole_negro_de_Oaxaca_con_arroz.jpg'),
    credit: 'Wikimedia Commons',
    creditHref: commonsPage('Mole_negro_de_Oaxaca_con_arroz.jpg'),
    photoOrigin: 'Photographed in Oaxaca, Mexico',
    photoVerified: true,
    score: 88,
    views: '',
    breakdown: [
      ['Geographic connection', 92],
      ['Traditional ingredients', 90],
      ['Traditional technique', 88],
      ['Local source', 82],
      ['Cultural documentation', 85],
      ['Community validation', 89],
    ],
    prepSummary:
      'Dozens of charred chiles, nuts, spices and chocolate are ground on a stone metate and simmered for hours.',
    ingredients: ['Chilhuacle negro chiles', 'Mexican chocolate', 'Toasted sesame', 'Plantain'],
    equipment: ['Metate (stone grinder)', 'Clay cooking pot', 'Comal'],
    steps: [
      'Char chilhuacle negro, pasilla and mulato chiles on the comal until nearly black, then soak them.',
      'Toast sesame, almonds, peanuts, pumpkin seeds and spices separately on the comal.',
      'Burn a tortilla and the chile seeds to ash — this is what makes the mole black.',
      'Grind everything on the metate, in stages, until smooth.',
      'Fry the paste in lard in a clay pot, stirring, until it darkens and thickens.',
      'Loosen with turkey or chicken broth and simmer for hours, adding Oaxacan chocolate near the end.',
      'Season and let it rest; it tastes better the following day.',
    ],
    adaptation: {
      traditional: 'Chilhuacle negro chiles, grown only in Oaxaca.',
      substitute: 'Ancho or pasilla chiles, used outside Mexico when chilhuacle is unavailable.',
    },
    popular: {
      label: 'The version most recipe sites publish',
      source: 'MexConnect',
      url: 'https://www.mexconnect.com/articles/2027-oaxacan-black-mole-mole-negro-oaxaqueno/',
      level: '🟠 Modern Adaptation',
      changed: [
        'Blender or food processor in place of the metate or the town molino',
        'Substitute chiles where chilhuacle negro is unavailable',
        'Shortened simmer',
      ],
    },
    videos: [
      {
        rank: 1,
        creator: 'Mole negro de Oaxaca',
        role: 'Traditional Mexican heritage-kitchen preparation, step by step',
        id: 'FuHHhpNN9DM',
        short: false,
        languageCode: 'es',
      },
    ],
    sources: [
      {
        title: 'Oaxacan black mole: mole negro oaxaqueño',
        publisher: 'MexConnect',
        url: 'https://www.mexconnect.com/articles/2027-oaxacan-black-mole-mole-negro-oaxaqueno/',
        note: 'Documents the metate grinding and the molino practice.',
      },
    ],
    disclaimer:
      "Mole negro's ingredients and grinding method are well documented across Oaxacan communities, though exact spice ratios vary by family.",
    // A community translation into the language the tradition is actually cooked in.
    // Note what is NOT translated: the chile, the chocolate, the metate and the comal
    // keep their names. Rendering "metate" as "grinder" or "comal" as "griddle" would
    // erase the equipment the technique depends on.
    translations: {
      es: {
        code: 'es',
        blurb:
          'Una salsa oscura y compleja construida a partir de chiles quemados y chocolate, central en las celebraciones oaxaqueñas.',
        prepSummary:
          'Decenas de chiles quemados, nueces, especias y chocolate se muelen en un metate de piedra y se cuecen a fuego lento durante horas.',
        steps: [
          'Quema los chiles chilhuacle negro, pasilla y mulato en el comal hasta que estén casi negros, luego remójalos.',
          'Tuesta el ajonjolí, las almendras, los cacahuates, las pepitas y las especias por separado en el comal.',
          'Quema una tortilla y las semillas de chile hasta hacerlas ceniza — esto es lo que vuelve negro al mole.',
          'Muele todo en el metate, por etapas, hasta que quede terso.',
          'Fríe la pasta en manteca en una olla de barro, moviendo, hasta que se oscurezca y espese.',
          'Aflójala con caldo de guajolote o de pollo y deja hervir a fuego lento durante horas, agregando chocolate oaxaqueño casi al final.',
          'Sazona y déjalo reposar; sabe mejor al día siguiente.',
        ],
        adaptation: {
          traditional: 'Chiles chilhuacle negro, que se cultivan únicamente en Oaxaca.',
          substitute: 'Chiles ancho o pasilla, usados fuera de México cuando no se consigue el chilhuacle.',
        },
        disclaimer:
          'Los ingredientes y el método de molienda del mole negro están bien documentados en las comunidades oaxaqueñas, aunque las proporciones exactas de especias varían de familia en familia.',
        glossary: {
          'Metate (stone grinder)': 'Piedra de moler inclinada, usada con su mano de metate.',
          Comal: 'Plancha lisa de barro o metal para tostar y quemar.',
        },
        translator: 'Community translator, Oaxaca',
        machine: false,
      },
    },
  },
  {
    id: 3,
    name: 'Neapolitan Pizza Margherita',
    category: 'Bread & baked',
    diet: {
      group: 'vegetarian',
      kinds: [],
      contains: ['dairy'],
      basis: 'Fior di latte or buffalo mozzarella. No meat or fish in the traditional preparation.',
    },
    meals: {
      occasions: ['lunch', 'dinner', 'street-food'],
      note: 'Eaten at either main meal, and folded into four as a portafoglio to eat walking.',
    },
    sourceLanguage: 'en',
    loc: { country: 'Italy', region: 'Campania', province: '', city: 'Naples', village: '' },
    breadcrumb: ['Italy', 'Campania', 'Naples'],
    badgeLevel: 'local',
    badgeIcon: '🟢',
    badgeLabel: 'Authentic — Local',
    badgeLabelFull: 'Authentic — Local/Traditional',
    traditionalBadge: true,
    atRisk: false,
    blurb: 'Thin, soft-crust pizza baked briefly in a wood-fired oven — the benchmark for the style.',
    photo: commons('Napoli,_pizza.JPG'),
    credit: 'MOs810 / Wikimedia Commons',
    creditHref: commonsPage('Napoli,_pizza.JPG'),
    photoOrigin: 'Photographed in Naples, Italy',
    photoVerified: true,
    score: 91,
    views: '',
    breakdown: [
      ['Geographic connection', 95],
      ['Traditional ingredients', 93],
      ['Traditional technique', 94],
      ['Local source', 88],
      ['Cultural documentation', 90],
      ['Community validation', 86],
    ],
    prepSummary: 'Hand-stretched dough baked for under 90 seconds in a wood-fired oven above 430°C (800°F).',
    ingredients: ['San Marzano tomatoes', 'Fior di latte / buffalo mozzarella', 'Fresh basil', '00 flour'],
    equipment: ['Wood-fired oven', 'Wooden pizza peel'],
    steps: [
      'Mix 00 flour, water, salt and fresh yeast, and knead by hand.',
      'Rest the mass about 2 hours, divide into 250 g balls, and prove 6–8 hours at room temperature.',
      'Open each ball by hand from the centre outward, pushing the gas into the rim — never a rolling pin.',
      'Dress with hand-crushed peeled tomatoes, torn fior di latte, basil and olive oil.',
      'Slide onto the oven floor at 430–485°C and bake 60–90 seconds, turning once.',
      'Serve immediately, while the base is still soft enough to fold.',
    ],
    adaptation: {
      traditional: 'Wood-fired oven reaching 430°C+.',
      substitute: 'Home or electric ovens, common outside Naples.',
    },
    popular: {
      label: 'The version most recipe sites publish',
      source: 'Cooking Sessions — Neapolitan Pizza Margherita',
      url: 'https://cookingsessions.com/neapolitan-pizza-margherita/',
      level: '🟠 Modern Adaptation',
      changed: [
        'Stand mixer with a dough hook instead of hand kneading',
        'Cold proof in the refrigerator instead of room-temperature proving',
        'Home or electric oven instead of a wood-fired oven above 430°C',
      ],
    },
    videos: [
      {
        rank: 1,
        creator: 'Enzo Coccia — Pizzeria La Notizia',
        role: "Naples pizzaiolo, one of the style's recognised authorities",
        id: 'mDUjsK_cX8U',
        short: false,
        languageCode: 'it',
      },
      {
        rank: 2,
        creator: 'Maestro pizzaiolo Daniele',
        role: 'Filmed in Naples, Italy',
        id: 'mWubtD2dEdQ',
        short: false,
        languageCode: 'it',
      },
    ],
    sources: [
      {
        title: 'Pizza Margherita',
        publisher: 'Wikipedia',
        url: 'https://en.wikipedia.org/wiki/Pizza_Margherita',
        note: 'Records the ingredients and the raised cornicione.',
      },
    ],
    disclaimer:
      "Naples' pizzaiolo guilds maintain a documented standard for ingredients, dough handling and oven temperature.",
  },
  {
    // The record that exercises the rule: Fusion carries no score, no traditional
    // method and no equipment, and links back to the tradition it borrows from.
    id: 4,
    name: 'Hawaiian Pizza',
    category: 'Bread & baked',
    diet: {
      group: 'meat',
      kinds: ['pork'],
      contains: ['dairy'],
      basis: 'Ham and cheese are the defining toppings of the style.',
    },
    meals: {
      occasions: ['lunch', 'dinner'],
      note: 'A takeaway and restaurant pizza, eaten at either main meal.',
    },
    sourceLanguage: 'en',
    loc: { country: 'Canada', region: 'Ontario', province: '', city: 'Chatham', village: '' },
    breadcrumb: ['Canada', 'Ontario', 'Chatham'],
    badgeLevel: 'fusion',
    badgeIcon: '🔴',
    badgeLabel: 'Fusion',
    badgeLabelFull: 'Fusion',
    traditionalBadge: false,
    atRisk: false,
    blurb:
      'Ham-and-pineapple pizza topping, created in Ontario and marketed under a Polynesian name it has no origin in.',
    photo: commons('Hawaiian_pizza_1.jpg'),
    credit: 'Wikimedia Commons',
    creditHref: commonsPage('Hawaiian_pizza_1.jpg'),
    photoOrigin: 'Shooting location not recorded in the source',
    photoVerified: false,
    score: null,
    views: '',
    breakdown: [],
    prepSummary: '',
    ingredients: [],
    equipment: [],
    steps: [],
    adaptation: null,
    popular: null,
    videos: [],
    sources: [],
    disclaimer: '',
    fusionNote:
      'Hawaiian pizza was created in the 1960s in Chatham, Ontario, Canada, combining Italian-American pizza with canned pineapple. It has no traditional link to Hawaii or to Neapolitan pizza-making, and is classified as Fusion — not as a version of authentic Neapolitan pizza.',
    relatedId: 3,
  },
  {
    id: 5,
    name: 'Hákarl',
    category: 'Cured & fermented',
    diet: {
      group: 'seafood',
      kinds: ['fish'],
      contains: [],
      basis: 'Greenland shark, cured whole. Served with brennivín, which is not part of the preparation.',
    },
    meals: {
      occasions: ['snack', 'celebration'],
      note: 'Eaten in small cubes on toothpicks, and above all at Þorrablót, the midwinter feast — not as a course at a daily meal.',
    },
    sourceLanguage: 'en',
    loc: { country: 'Iceland', region: 'Western Iceland', province: 'Snæfellsnes', city: '', village: 'Bjarnarhöfn' },
    breadcrumb: ['Iceland', 'Western Iceland', 'Snæfellsnes', 'Bjarnarhöfn'],
    badgeLevel: 'local',
    badgeIcon: '🟢',
    badgeLabel: 'Authentic — Local',
    badgeLabelFull: 'Authentic — Local/Traditional',
    traditionalBadge: true,
    atRisk: true,
    blurb: 'Greenland shark fermented for months and hung to dry — a tradition fewer farms still keep.',
    atRiskEvidence:
      'Only a handful of family farms in the Westfjords and Snæfellsnes still cure hákarl the traditional way.',
    photo: commons('Hakarl_near_Bjarnah%C3%B6fn_in_Iceland.JPG'),
    credit: 'Wikimedia Commons',
    creditHref: commonsPage('Hakarl_near_Bjarnah%C3%B6fn_in_Iceland.JPG'),
    photoOrigin: 'Photographed at Bjarnarhöfn, Iceland',
    photoVerified: true,
    score: 90,
    views: '',
    breakdown: [
      ['Geographic connection', 94],
      ['Traditional ingredients', 92],
      ['Traditional technique', 93],
      ['Local source', 85],
      ['Cultural documentation', 88],
      ['Community validation', 84],
    ],
    prepSummary:
      'Shark meat is pressed to purge toxins, fermented for 6–12 weeks, then air-dried for months in an open shed.',
    ingredients: ['Greenland shark'],
    equipment: ['Gravel curing bed or pressing box', 'Drying shed (hjallur)'],
    steps: [
      'Gut and behead the Greenland shark and cut it into large pieces.',
      'Press the meat in a shallow gravel bed or box for 6–12 weeks so the fluids drain out.',
      'Wash it, then hang it in an open shed for 4–5 months, exposed to the wind.',
      'Trim away the brown crust that forms on the outside.',
      'Cut into small cubes and serve on toothpicks, usually with a shot of brennivín.',
    ],
    adaptation: {
      traditional: 'Months-long fermentation and open-air drying at a working shark farm.',
      substitute: 'Vacuum-packed, pre-fermented hákarl sold in supermarkets, cured faster and less pungent.',
    },
    popular: {
      label: 'The version now most commonly described',
      source: 'Wikipedia — Hákarl',
      url: 'https://en.wikipedia.org/wiki/H%C3%A1karl',
      level: '🟠 Modern Adaptation',
      changed: [
        'Pressed in a large plastic container with drain holes instead of a gravel bed',
        'Sold vacuum-packed and cured faster',
      ],
    },
    videos: [
      {
        rank: 1,
        creator: 'Regional Eats — Food Insider',
        role: 'How the shark is pressed, hung and cured, filmed on site',
        id: 'QnjtnzyTNoQ',
        short: false,
        languageCode: 'en',
      },
      {
        rank: 2,
        creator: 'Bjarnarhöfn Shark Museum visit',
        role: 'Tasting at the farm that still cures it traditionally',
        id: 'JtB6LtSiGB8',
        short: false,
        languageCode: 'en',
      },
    ],
    sources: [
      {
        title: 'Hákarl',
        publisher: 'Wikipedia',
        url: 'https://en.wikipedia.org/wiki/H%C3%A1karl',
        note: 'Curing period, drying months and the crust that is trimmed.',
      },
    ],
    disclaimer:
      'Only a handful of family farms in the Westfjords and Snæfellsnes still cure hákarl the traditional way; their process is documented directly by the farms and by Icelandic heritage archives.',
  },
  {
    id: 6,
    name: 'Ayrag',
    category: 'Fermented drink',
    // Vegetarian, not vegan: mare's milk is dairy. Fermentation takes it to roughly
    // 2% alcohol, which a reader avoiding alcohol needs told.
    diet: {
      group: 'vegetarian',
      kinds: [],
      contains: ['dairy', 'alcohol'],
      basis: "Raw mare's milk, fermented. Lightly alcoholic by the time it reaches drinking strength.",
    },
    // The clearest case for not forcing a meal slot: it is offered whenever someone
    // arrives, all summer long.
    meals: {
      occasions: ['anytime'],
      note: 'Poured for anyone who enters the ger, at any hour through the summer months. It belongs to hospitality rather than to a meal.',
    },
    sourceLanguage: 'en',
    loc: { country: 'Mongolia', region: 'Khövsgöl', province: '', city: '', village: 'Nomadic herding camps' },
    breadcrumb: ['Mongolia', 'Khövsgöl', 'Nomadic herding camps'],
    badgeLevel: 'regional',
    badgeIcon: '🟢',
    badgeLabel: 'Authentic — Regional',
    badgeLabelFull: 'Authentic — Regional',
    traditionalBadge: false,
    atRisk: true,
    blurb:
      "Fermented mare's milk churned by hand through the day — tied to a herding life fewer families still lead.",
    atRiskEvidence:
      'The method is consistent across herding families, though fewer households now keep mares for it.',
    photo: commons('Airag_1.JPG'),
    credit: 'Wikimedia Commons',
    creditHref: commonsPage('Airag_1.JPG'),
    photoOrigin: 'Photographed in Mongolia',
    photoVerified: true,
    score: 85,
    views: '',
    breakdown: [
      ['Geographic connection', 88],
      ['Traditional ingredients', 90],
      ['Traditional technique', 87],
      ['Local source', 80],
      ['Cultural documentation', 78],
      ['Community validation', 82],
    ],
    prepSummary:
      "Fresh mare's milk is churned in a leather vessel for hours through the day, fermenting slightly sour and lightly carbonated.",
    ingredients: ["Raw mare's milk"],
    equipment: ['Leather churning vessel (khökhüür)', 'Wooden paddle'],
    steps: [
      'Milk the mares several times a day through summer and strain the fresh milk into the khökhüür.',
      'Add a starter from an existing batch of ayrag.',
      'Churn with the wooden paddle a thousand strokes and more across the day — anyone passing through the ger takes a turn.',
      'Keep adding fresh milk daily and keep churning; fermentation runs one to three days to drinking strength.',
      'Serve from the vessel into a bowl, taken with both hands.',
    ],
    adaptation: {
      traditional: 'Hand-churned in a leather vessel over a full day, tied to seasonal herding routes.',
      substitute: 'Machine-churned cow-milk versions sold in Ulaanbaatar markets.',
    },
    popular: {
      label: 'The version most easily found',
      source: 'View Mongolia',
      url: 'https://www.viewmongolia.com/mongolian-horse-milk-beverage-airag.html',
      level: '🟠 Modern Adaptation',
      changed: [
        "Cow's milk in place of mare's milk in western Mongolia",
        'Bottled and refrigerated for sale in Ulaanbaatar rather than drunk from the fermentation sack',
      ],
    },
    videos: [
      {
        rank: 1,
        creator: "Nargie's Mongolian Cuisine (Artger)",
        role: 'Mongolian channel, airag made in a herding household',
        id: 'gilGPDAfeCU',
        short: false,
        languageCode: 'mn',
      },
      {
        rank: 2,
        creator: 'Mongolian fermented horse milk',
        role: 'Short — the churning and the pour',
        id: 'uoK0Hh12zZc',
        short: true,
        languageCode: 'mn',
      },
    ],
    sources: [
      {
        title: "The link between climate and Mongolia's thirst for fermented horse milk",
        publisher: 'Scientific American Custom Media',
        url: 'https://www.scientificamerican.com/custom-media/the-link-between-climate-and-mongolias-thirst-for-fermented-horse-milk/',
        note: 'Research on airag production in herding households.',
      },
    ],
    disclaimer:
      'Airag is made by herding households across Mongolia; this record is pinned to Khövsgöl because that is where the preparation behind it was documented. The method is consistent across herding families, though fewer households now keep mares for it.',
    /**
     * A genuinely contested origin, and the reason origin is kept away from the
     * score: fermented mare's milk is claimed across the steppe, and the app has no
     * business ruling on it. The claims are recorded, sourced, and left standing.
     */
    originClaims: [
      {
        place: 'Mongolia',
        claim: 'Known as airag and central to herding life; Mongolia treats it as a national drink.',
        source: {
          title: "The link between climate and Mongolia's thirst for fermented horse milk",
          publisher: 'Scientific American Custom Media',
          url: 'https://www.scientificamerican.com/custom-media/the-link-between-climate-and-mongolias-thirst-for-fermented-horse-milk/',
          note: 'Research on airag production in herding households.',
        },
      },
      {
        place: 'Kazakhstan and Kyrgyzstan',
        claim: 'Known as kumis, with its own continuous herding tradition and preparation across the steppe.',
        source: {
          title: 'Kumis',
          publisher: 'Wikipedia',
          url: 'https://en.wikipedia.org/wiki/Kumis',
          note: 'Records the drink across Central Asia under its Turkic name.',
        },
      },
    ],
  },
];

/**
 * The catalogue, gated through the invariants. A record that breaks one of the
 * brief's hard rules never reaches a screen.
 */
export const dishes: Dish[] = assertDishes(SEED);

export const dishById = (id: number | null | undefined): Dish | undefined =>
  dishes.find((d) => d.id === id);

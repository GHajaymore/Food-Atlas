/**
 * Turning a UNESCO inscription title into a dish name — or refusing it.
 *
 * UNESCO inscribes *practices*, and titles them accordingly. The heritage listing for
 * ceviche is called "Practices and meanings associated with the preparation and
 * consumption of ceviche, an expression of Peruvian traditional cuisine". That is the
 * correct name of the inscription and a terrible name for a card. Used as a dish name
 * it filled the front page with paragraphs, and the dish — ceviche — was the one word
 * a reader had to hunt for.
 *
 * Nothing is lost by shortening it: the full inscription title is already kept as the
 * record's `Source.title`, which is what a reader follows to UNESCO, and it is the
 * official name at the other end of that link.
 *
 * ## The harder half: some inscriptions are not food
 *
 * These records are the only imports that reach Authentic — Regional, so they lead
 * every shelf on the front page. Among the sixty-four are a livestock market, a
 * seasonal cattle drive, several saints' feasts, a fishing rite, and the preservation
 * of **carillon** culture, which is church bells. Shown as authenticated food at
 * 62/100, they are not a cosmetic problem: they are the atlas asserting something
 * false in the position it reserves for its best evidence.
 *
 * So a title that names no food is refused with a reason, in the shape `isDish` and
 * `place` already use — the refusals are the interesting output, and a rule that can
 * only say "no" teaches nobody which case it got wrong.
 *
 * ## Why patterns and a list, rather than cleverness
 *
 * Sixty-four rows is small enough to be honest about. The patterns below cover the
 * shapes UNESCO actually uses; anything they do not reduce to a short name is refused
 * rather than guessed at, because the failure mode of guessing here is a confident
 * wrong dish name on the most prominent card in the app.
 */

/** Why an inscription yields no dish. */
export type InscriptionRefusal =
  | 'A_GATHERING'
  | 'A_LIVELIHOOD'
  | 'NOT_FOOD_AT_ALL'
  | 'A_WHOLE_CUISINE'
  | 'NO_DISH_NAMED';

/**
 * The longest a dish name may be before it stops being a name.
 *
 * Forty characters holds "Practices and meanings associated with" and nothing useful,
 * which is the point: anything longer than this is a sentence, and a sentence that
 * survived every pattern below is one the patterns did not understand.
 */
export const MAX_NAME = 40;

/**
 * Inscriptions about an event rather than a food.
 *
 * A feast, a fair, a festival or a rite is a date in a calendar. Some of them centre
 * on food and all of them are worth knowing about; none of them is a dish, and this
 * atlas is a list of dishes.
 *
 * Matched on the whole title, and deliberately *not* on the word "ceremonial" alone —
 * "Ceremonial Keşkek tradition" is keşkek, a wheat and meat dish, and a rule that
 * refused it for its first word would be exactly the over-reach this file warns about.
 */
const GATHERING =
  /\b(festivity|festival|jaarmarkt|winter fair|feast of|commemoration feast|folk feast|fire feast|annual .*fair|market at|feast and its vows)\b/i;

/** Inscriptions about how food is *obtained*, which is a living, not a dish. */
const LIVELIHOOD =
  /\b(transhumance|droving|beekeeping|fishing (rite|festival)|charfia fishing|summer farming|cultivating the|head-trained|grazing of outlying|ritual of transplanting|retreats centered)\b/i;

/** Inscriptions with no food in them at all. */
const NOT_FOOD_AT_ALL = /\b(carillon|parachicos)\b/i;

/**
 * A whole cuisine, or a country's way of eating.
 *
 * Real and important, and not a dish: "Italian cooking, between sustainability and
 * biocultural diversity" cannot be cooked. The atlas has a separate notion of cuisine
 * and this is not the place to smuggle one in as a record.
 *
 * The Mediterranean diet is deliberately absent from this rule. It is the same kind of
 * thing, but it is inscribed under exactly that name, it is two words, and a reader
 * looking for it will look for it.
 */
const WHOLE_CUISINE =
  /^(italian cooking|traditional mexican cuisine|hawker culture|success story of promoting|gastronomic meal of the french)/i;

/**
 * A pattern, or a pattern paired with how to rebuild the name from it.
 *
 * Almost every title contains its dish as one contiguous run of words, so a capture
 * is enough. One does not, and rather than bend the others around it the exception
 * carries its own replacement.
 */
type Shape = RegExp | readonly [RegExp, string];

/**
 * The shapes UNESCO titles take, in the order they must be tried.
 *
 * Order is load-bearing throughout. "Culture of X cooking" has to come before
 * "Culture of X" or Ukrainian borscht arrives as "Ukrainian borscht cooking"; the
 * flatbread shape has to come before the generic "X culture" or it stops at
 * "Flatbread making and sharing" and calls that a dish.
 */
const SHAPES: Shape[] = [
  // "Culture of Ukrainian borscht cooking" | "Culture of Sumanak/Sumalak cooking"
  /^culture of (.+?) (?:cooking|making)$/i,
  // "Traditional knowledge and skills of sake-making with koji mold in Japan"
  /\bknowledge and skills of (.+?)-making\b/i,
  // "Traditional ways of making Artisan Minas Cheese in Minas Gerais"
  /\bways of making (.+?)(?: in .+)?$/i,
  // "...for the making and consumption of cassava bread"
  /\b(?:making and consumption|production and consumption|preparation and consumption) of (.+?)(?:,.*)?$/i,
  // "Cooking and eating Mulgi puder, traditional mashed potato..."
  /^cooking and eating (.+?),/i,
  // "Artisanal know-how and culture of baguette bread"
  /^artisanal know-how and culture of (.+)$/i,
  // "Harees dish: know-how, skills and practices"
  /^(.+?) dish:/i,
  // "Art of Neapolitan ‘Pizzaiuolo’"
  /^art of (.+)$/i,
  // "Ancient Georgian traditional Qvevri wine-making method" -> Qvevri wine
  /^ancient .*?(\S+ wine)-making method$/i,
  // "The practice of making Asin Tibuok, the artisanal sea salt..."
  /^the practice of making (.+?),/i,
  // "Tradition of kimchi-making in the..." | "Kimjang, making and sharing kimchi in..."
  /^tradition of (.+?)-making\b/i,
  // "Dolma making and sharing tradition, a marker of..."
  /^(.+?) making and sharing tradition\b/i,
  // "Flatbread making and sharing culture: Lavash, Katyrma, Jupka, Yufka" — ahead of
  // the generic "X culture" shape below, which would otherwise stop at "Flatbread
  // making and sharing" and call that a dish.
  /^(.+?) making and sharing culture\b/i,
  // "Ceremonial Keşkek tradition"
  /^ceremonial (.+?) tradition$/i,
  // "Nsima, culinary tradition of Malawi" | "Koshary, daily life dish and..."
  // | "Al-Mansaf in Jordan, a festive banquet..." | "Arabic coffee, a symbol of..."
  /^(.+?),/,
  // "Beer culture in Belgium" | "Turkish coffee culture and tradition"
  /^(.+?) culture\b/i,
  // "Tandir craftsmanship and bread baking in Azerbaijan" — the tandir is the oven and
  // the bread is the food, and the two words are not adjacent in the title. This is
  // the one shape that has to build a name rather than lift one out.
  [/^(\S+) craftsmanship and bread baking\b/i, '$1 bread'],
  // "Gingerbread craft from Northern Croatia" — the place is the record's own.
  /^(.+?) craft from\b/i,
  // "Traditional tea processing techniques and associated social practices in China"
  /^traditional (.+?) processing techniques\b/i,
];

/**
 * Scaffolding that survives the shapes and is not part of the name.
 *
 * "Al-Mansaf in Jordan" is Al-Mansaf; the country is already the record's country and
 * printing it twice on one card is noise. Applied repeatedly, because these stack:
 * "Georgian traditional Qvevri wine-making method" sheds both a trailing word and a
 * leading one before it is a name.
 */
const TRAILING_NOISE = /\s+(?:in (?:the )?[A-Z][\wʼ’' -]*|tradition|method|craft|culture)$/;
const LEADING_NOISE = /^(?:the|traditional|ancient|artisanal|ceremonial|culture of)\s+/i;

const tidy = (raw: string): string => {
  let name = raw.replace(/\s+/g, ' ').trim();
  for (let pass = 0; pass < 3; pass += 1) {
    name = name.replace(LEADING_NOISE, '').replace(TRAILING_NOISE, '').trim();
  }
  return name.replace(/[.,;:]$/, '').trim();
};

/**
 * The dish an inscription is about, or why there is not one.
 *
 * @param title the inscription's official name, exactly as UNESCO records it
 */
export function dishFromInscription(title: string): { name: string } | { refused: InscriptionRefusal } {
  const full = title.trim();
  if (!full) return { refused: 'NO_DISH_NAMED' };

  if (NOT_FOOD_AT_ALL.test(full)) return { refused: 'NOT_FOOD_AT_ALL' };
  if (GATHERING.test(full)) return { refused: 'A_GATHERING' };
  if (LIVELIHOOD.test(full)) return { refused: 'A_LIVELIHOOD' };
  if (WHOLE_CUISINE.test(full)) return { refused: 'A_WHOLE_CUISINE' };

  // Shapes first, even for a title already short enough to use. "Culture of Ukrainian
  // borscht cooking" is thirty-five characters and passes any length test, and the
  // dish is still Ukrainian borscht — a short title is not the same as a name.
  for (const shape of SHAPES) {
    const [pattern, template] = Array.isArray(shape) ? shape : [shape, '$1'];
    const match = (pattern as RegExp).exec(full);
    if (!match?.[1]) continue;
    const name = tidy(match[0].replace(pattern as RegExp, template));
    if (name.length && name.length <= MAX_NAME) return { name };
  }

  // No shape matched. "Commandaria wine", "Joumou soup" and "Mediterranean diet" land
  // here: they are already names, which is why nothing needed to be stripped off them.
  if (full.length <= MAX_NAME) return { name: full };

  // Nothing matched, and the title is a sentence. Refused rather than shortened to
  // whatever the first forty characters happen to be — a truncated paragraph reads as
  // a dish name, which is worse than an absent record.
  return { refused: 'NO_DISH_NAMED' };
}

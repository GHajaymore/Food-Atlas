/**
 * What counts as a line of a recipe.
 *
 * An ingredient list and a method arrive as arrays of strings, and the app renders
 * each string as a bullet or a numbered step. Whatever is in the array is therefore a
 * promise: *this is one thing you need*, or *this is one thing you do*. Several kinds
 * of line break that promise.
 *
 * ## A line that is not an instruction
 *
 * Wikibooks pages carry furniture — category links, interwiki links, a horizontal
 * rule, the "recorded by" credit German recipes end with, a talk-page signature. The
 * strippers took the markup off and left the words, so the words became steps:
 *
 *   Schokokuss              step: "Kategorie:Kochbuch/ Desserts"
 *   Käsekuchen              step: "Erfasst von: --Ralf Roletschek 22:53, 31."
 *   Glarner Pastete         step: "---- Stammt von Wikipedia, Hauptautor war Choel…"
 *   Boule de riz            step: "= Liens externes = Boule de riz Boule de riz…"
 *
 * These are **truncated rather than dropped**, because the furniture is usually stuck
 * to the end of a real instruction. Teurgoule's last step reads "Servez à température
 * ambiante Fallue Teurgoule Teurgoule en:Cookbook:Teurgoule" — dropping the line
 * would take "serve at room temperature" with it, which is the actual last thing a
 * cook does. What is left after the cut is kept; a line left with nothing goes.
 *
 * ## A line that is several lines
 *
 * A bullet list that lost its newlines is one string holding a whole ingredient list:
 *
 *   Pounded yam    "*Yam *Water"
 *   Nsala soup     "*Yam *Uziza leaves *Uziza seeds"
 *   Abula          "*Ewedu *Gbegiri *Obe ata"
 *   Qrashel        "*sesame *anise seeds *milk *eggs *sugar"
 *
 * The reader sees one bullet reading "*Yam *Water" and the record counts one
 * ingredient where it has two. Splitting recovers them. Nearly all of these are
 * Nigerian and Moroccan dishes, which is to say the split gives content back to
 * exactly the cuisines this atlas holds least of.
 *
 * ## Why the split is narrow
 *
 * `*` is not always markup, and the counter-examples are in the same corpus:
 *
 *   Zembrocal        "…son volume d'eau (150g*1.5=225ml d'eau)…"   — multiplication
 *   Sahnehack        "…in einen Topf geben und anrichten *guten Appetit*"  — emphasis
 *   Baeckeoffe       "2 blancs de poireaux (facultatif)*,"          — a footnote mark
 *   Poulet rôti      "…le morceau le plus *long à cuire"            — emphasis
 *
 * So a split needs **two or more** markers, each one at a word's start with space
 * before it — the shape a bullet list has and a multiplication sign never does. A
 * single leading marker is stripped without splitting, which is the "* 1/2 Kg de
 * cebolla" case. Everything else is left exactly as written: an asterisk that might
 * be a footnote is the author's, and guessing wrong turns one ingredient into two
 * that do not exist.
 */

/** Page furniture, and where a real instruction stops. */
const FURNITURE: RegExp[] = [
  /----+/,
  /\bErfasst von\s*:/i,
  /\bStammt von Wikipedia\b/i,
  /\bHauptautor\b/i,
  /\b(Kategorie|Catégorie|Categoría|Categoria|Category)\s*:/,
  /\b[a-z]{2,3}:(Cookbook|Kochbuch|Kokebok|Livre[_ ]de[_ ]cuisine|Kogebog|Receptenboek)\b/i,
  /--\s*\S+\s+\d{1,2}:\d{2}/, // a talk-page signature: "--Ralf Roletschek 22:53"
];

/** A section heading that survived as a step: "= Links =", "== Siehe auch ==". */
const HEADING = /^=+\s*[^=]*=+/;

/** Nothing a reader can use — an ellipsis, a rule, a stray bullet. */
const NO_CONTENT = /^[.\-–—_·•*~=\s]*$/;

/**
 * Two or more bullet markers, each opening a word.
 *
 * `\s\*\S` is the second marker and is what makes this a list rather than a stray
 * asterisk. See the note above for the four things this deliberately does not match.
 */
const GLUED_LIST = /^\*\s*\S.*\s\*\s*\S/;

/** Cut a line at the first piece of furniture in it. */
function beforeFurniture(line: string): string {
  let cut = line.length;
  for (const shape of FURNITURE) {
    const found = shape.exec(line);
    if (found && found.index < cut) cut = found.index;
  }
  return line.slice(0, cut).trim();
}

/**
 * One source line, as zero or more lines a reader can use.
 *
 * Zero is a real answer: a line that was only furniture has nothing left after the
 * cut, and printing an empty bullet is worse than printing no bullet.
 */
function readableLine(raw: string): string[] {
  const line = raw.replace(/\s+/g, ' ').trim();
  if (!line || HEADING.test(line) || NO_CONTENT.test(line)) return [];

  const kept = beforeFurniture(line);
  if (!kept || NO_CONTENT.test(kept)) return [];

  if (GLUED_LIST.test(kept)) {
    return kept
      .split(/\s*\*\s*/)
      .map((part) => part.trim())
      .filter((part) => part && !NO_CONTENT.test(part));
  }

  // A single leading marker, with no list behind it, is just a bullet written out.
  return [kept.replace(/^\*\s*/, '').trim()].filter(Boolean);
}

export const recipeLines = (lines: readonly string[] | undefined): string[] =>
  (lines ?? []).flatMap(readableLine);

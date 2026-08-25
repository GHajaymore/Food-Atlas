/**
 * What a person types, tidied the same way everywhere.
 *
 * The atlas puts contributed records next to imported ones and asks a reader to judge
 * them on the same terms, so they have to *look* like the same kind of thing. They did
 * not. Every field the import writes goes through `cleanName`, `sentenceCase` and
 * `canonicalCountry`; what a person typed went through whatever the screen happened to
 * do, which was three different things:
 *
 *   /propose      trimmed each field, and canonicalised nothing
 *   ConfirmForm   trimmed only to test whether a field was empty, then sent it raw
 *   /contribute   trimmed the photo reference and nothing else
 *
 * So a proposal for "kozhikode halwa" from "india" would sit in the same list as
 * "Kozhikode Halwa" from "India", a confirmation could be signed "  Priya  ", and a
 * reader would reasonably conclude the second kind of record is sloppier than the first
 * — when the only difference is which code path wrote it.
 *
 * ## The rule: entered data gets the same treatment as imported data
 *
 * Not a stricter one and not a looser one. `sentenceCase` is what the import applies to
 * a Wikidata label, so it is what a typed name gets; `canonicalCountry` is what the
 * import applies to a country, so it is what a typed country gets. Matching the existing
 * rule is the whole point — a second, different normalisation would just be a fourth
 * inconsistency.
 *
 * ## What it deliberately does not do
 *
 * **No title-casing.** "Kozhikode Halwa" is title case because that is the name; "pane
 * di Santeramo in Colle" is not, and neither is "sarmale cu carne de porc". Capitalising
 * every word would corrupt more names than it tidied, in exactly the languages this
 * atlas exists to carry. First letter only, which is what `sentenceCase` does and what
 * the import has always done.
 *
 * **No rejection.** Nothing here refuses a value or corrects a spelling. An unrecognised
 * country falls through `canonicalCountry` unchanged, because a person naming a place
 * the atlas has not heard of is the case this project is *for* — a form that argued with
 * them would be a form that only accepts food somebody has already catalogued.
 */

import type { Copy } from '../i18n/copy';
import { knownCountry } from './continents';
import { canonicalCountry } from './countryNames';
import { sentenceCase } from './text';

/**
 * One value, with the whitespace a keyboard produces taken out.
 *
 * Collapsing runs rather than only trimming the ends, because a pasted value routinely
 * carries a double space or a stray newline in the middle, and "Born in  Kozhikode"
 * differs from "Born in Kozhikode" in every index and every comparison while looking
 * identical on the page. That is the worst kind of difference to leave in.
 */
export const tidyText = (raw: string): string => (raw ?? '').replace(/\s+/g, ' ').trim();

/** A dish's name, cased the way the import cases a label it was given in lower case. */
export const tidyName = (raw: string): string => sentenceCase(tidyText(raw));

/**
 * A country, resolved to the name the atlas files records under.
 *
 * This is the one that actually matters for navigation: a proposal filed under "usa"
 * or "Republic of India" is invisible from the country it belongs to, because every
 * list, count and breadcrumb in the app keys on the canonical name.
 */
export function tidyCountry(raw: string): string {
  const given = tidyText(raw);
  const alias = canonicalCountry(given);
  /*
   * Two steps, because they answer different questions and neither covers the other.
   *
   * `canonicalCountry` knows *aliases* — "USA", "Republic of India" — and returns
   * anything else untouched. So a country typed in the atlas's own words but in lower
   * case came back as "india", which is a different country from "India" to every list,
   * count and breadcrumb in the app. That is the exact failure this file exists to stop,
   * and it survived the obvious one-line version of this function.
   *
   * `knownCountry` answers the other half: is this the atlas's own spelling, ignoring
   * case and accents. Nothing matched falls through unchanged, on purpose.
   */
  return knownCountry(alias) || alias;
}

/** A region, town or village. Cased like a name; never canonicalised, as no map covers them. */
export const tidyPlace = (raw: string): string => sentenceCase(tidyText(raw));

/**
 * A textarea split into the lines somebody meant, with their list markers removed.
 *
 * People type ingredients as "- 2 eggs" or "1. Soak the rice" because that is what a
 * list looks like, and the marker is punctuation about the list rather than part of the
 * step. Lifted from `/propose`, which is where it was written, so the other forms stop
 * having their own idea of what a line is.
 */
export const tidyLines = (raw: string): string[] =>
  (raw ?? '')
    .split('\n')
    .map((line) => tidyText(line.replace(LIST_MARKER, '')))
    .filter(Boolean);

/**
 * What is still missing, in the words the form used for it.
 *
 * All three forms wrote `Still needed: ${missing.join(', ')}` over a list of **field
 * keys**, so a reader who left the last box empty was told *"Still needed: said."* — a
 * database column they have never seen. `/propose` was worse in a quieter way: it asked
 * for **submitter** while the box above it was labelled "Your name", so the error named
 * a field the form did not.
 *
 * Keeping the labels beside `REQUIRED` in each domain module rather than in the screens
 * is what stops that happening again: a field cannot become required without someone
 * writing down what to call it.
 *
 * The conjunction is worth the four lines. "name, connection" reads as a machine listing
 * columns; "your name and your connection to the place" reads as a sentence, and this is
 * the one moment in the app where a contributor has been stopped and is being asked to
 * do more work.
 */
export function stillNeeded(copy: Copy, labels: string[]): string {
  const wanted = labels.filter(Boolean);
  if (!wanted.length) return '';

  const listed =
    wanted.length === 1
      ? wanted[0]
      : copy.listAnd.replace('{list}', wanted.slice(0, -1).join(', ')).replace('{last}', wanted[wanted.length - 1]);

  return copy.stillNeededList.replace('{list}', listed);
}

/**
 * A bullet, or a number that is numbering the list — and nothing else.
 *
 * The version this replaces was `/^[-*•\d.)\s]+/`, a character class, which ate **every**
 * leading digit. "2 eggs" was submitted as "eggs" and "100g ghee" as "g ghee": a
 * contributor typing an ingredient list the normal way had their quantities silently
 * deleted on the way in.
 *
 * That is the same class of fault as the HTML entities in `text.ts` — in an ingredient
 * list the quantity *is* the information, and losing it is a recipe defect rather than an
 * untidy string. It was found by writing "- 2 eggs" into a test, which is the first thing
 * anybody would actually type.
 *
 * So a number only counts as a marker when something marks it as one: a dot or a bracket
 * straight after it. "1." and "2)" are numbering; "2 eggs" and "100g" are the recipe.
 */
const LIST_MARKER = /^(?:[-*•–—]|\d+[.)])\s*/;

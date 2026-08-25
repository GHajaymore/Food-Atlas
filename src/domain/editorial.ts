/**
 * What may be corrected in a contribution, and what may never be.
 *
 * "Consistency" is the word under which this app would most easily destroy the thing
 * it exists to protect. A copy editor tidying the catalogue would standardise
 * "Kozhikode Halwa", "Calicut Halwa" and "Kozhikodan Halva" to one spelling, strip
 * the accent from "Hákarl" because the rest of the list has none, title-case
 * "peanut butter", and Anglicise "Al-Man'ouché" — and every one of those edits
 * would look like an improvement in a diff.
 *
 * They are not improvements. A variant spelling is usually evidence rather than an
 * error: it records that a different community calls the dish something different,
 * which is the exact distinction `traditions.ts` exists to keep, and flattening it is
 * how an atlas of traditions becomes a list of headwords. This module is the same
 * rule the translation layer already enforces — the identity of the food survives
 * every process it passes through — applied to human editing instead of machine
 * translation.
 *
 * So the text in a record splits in two, and the split is the whole design:
 *
 *   **The app's prose.** Blurbs, notes, the method written out in sentences,
 *   anything the project wrote about the food. Ordinary editorial standards apply.
 *   Spelling and grammar can be fixed freely; nobody's tradition lives here.
 *
 *   **The record's own terms.** The dish name, its traditional ingredients and
 *   equipment, the places, and anything quoted from the cook. These are data. They
 *   are never normalised, never corrected, never made consistent with each other.
 *   A difference between two of them is a finding to be routed, not a defect to be
 *   repaired.
 *
 * Everything mechanical below is confined to the first kind of text. Everything that
 * touches the second kind produces an advisory for a person to judge, and applies
 * nothing.
 */

import type { Copy } from '../i18n/copy';
import type { Dish } from './types';

/**
 * Characters that occupy no width: zero-width space and joiners, the bidirectional
 * overrides, the word joiner, and the byte-order mark.
 *
 * Written as escapes rather than the characters themselves, because a source file
 * containing invisible characters is a source file nobody can review.
 */
const INVISIBLE = /[\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g;

/** Unicode combining marks — the accents, folded only for comparison. */
const COMBINING_MARKS = /[\u0300-\u036f]/g;

/**
 * Fields a contributor may edit whose text is the record's own, not the app's.
 *
 * Named explicitly rather than inferred, because the cost of getting the list wrong
 * in the permissive direction is silent and permanent.
 */
export const PRESERVED_FIELDS = ['name', 'ingredients', 'equipment', 'loc', 'breadcrumb'] as const;

/**
 * Mechanical cleanup that cannot change meaning.
 *
 * Every rule here is about characters a keyboard or a paste produced by accident:
 * doubled spaces, a non-breaking space from a web page, a stray control character, a
 * line break in the middle of a sentence. None of them touch a word.
 *
 * Deliberately absent: case changes, punctuation style, spelling, and anything that
 * would need a dictionary. A dictionary is how "nendran" becomes "plantain".
 */
export function tidyProse(text: string): string {
  return (
    (text ?? '')
      // Zero-width and bidi control characters, which paste in invisibly and then
      // break search and sorting in ways nobody can see to debug.
      .replace(INVISIBLE, '')
      // Every kind of space, including the non-breaking one, collapsed to one.
      .replace(/[\s ]+/g, ' ')
      .trim()
  );
}

/**
 * The only normalisation applied to a preserved term: invisible characters, and
 * nothing else.
 *
 * Not a tidy-up — a safety measure. A zero-width joiner inside a dish name makes it
 * unfindable and unmatchable while looking identical on screen, so removing it
 * changes no letter a reader could ever see. Spacing, case, accents, apostrophes and
 * transliteration are all left exactly as the contributor wrote them.
 */
export function tidyTerm(term: string): string {
  return (term ?? '').replace(INVISIBLE, '').trim();
}

/** Something a human should look at, with the reason and what it might mean. */
export interface Advisory {
  field: string;
  note: string;
  /** What a reviewer should consider doing — never done automatically. */
  consider: string;
}

/**
 * Compare two names ignoring only what is genuinely presentational.
 *
 * Used to *find* near-matches, never to replace one with the other. Accents and case
 * are folded here because a comparison needs a common ground; the stored terms keep
 * every mark exactly as written.
 */
const foldForComparison = (name: string) =>
  name
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/** Levenshtein distance, capped — only small distances are interesting here. */
function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return 99;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const row = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      row[j] = Math.min(
        prev[j] + 1,
        row[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    for (let j = 0; j <= b.length; j += 1) prev[j] = row[j];
  }
  return prev[b.length];
}

/**
 * Records whose names are close enough that a reviewer should decide what the
 * relationship is.
 *
 * This is the one place where a spelling difference matters, and the point is that
 * the app cannot tell which of two things it means:
 *
 *   - a typo, in which case the submission should be corrected; or
 *   - a different community's name for a related tradition, in which case it is a
 *     sibling and belongs in the fork model, not merged away.
 *
 * Only a person who knows the food can tell those apart, so this returns a question
 * and never an answer. Same-country matches lean towards the first reading and
 * cross-country ones towards the second, and the advisory says so.
 */
export function nearbyNames(name: string, country: string, catalogue: Dish[], take = 5): Advisory[] {
  const folded = foldForComparison(name);
  if (folded.length < 4) return [];

  const near = catalogue
    .filter((d) => {
      const other = foldForComparison(d.name);
      return other !== folded && editDistance(folded, other) <= 2;
    })
    .slice(0, take);

  return near.map((d) => {
    const sameCountry = d.loc.country === country;
    return {
      field: 'name',
      note: `"${d.name}" is already recorded${sameCountry ? '' : ` in ${d.loc.country}`}, and the two names differ by very little.`,
      consider: sameCountry
        ? 'If this is the same tradition, correct the submission. If two communities here genuinely spell it differently, keep both and record them as siblings — do not merge the spellings.'
        : 'Names this close across two countries usually mean a shared tradition with local variants. Record them as siblings rather than choosing one spelling.',
    };
  });
}

/**
 * Editorial problems in a contribution that are safe to state plainly.
 *
 * These are about the app's own prose only, and none of them is applied
 * automatically — a contributor is told, and decides.
 */
export function reviewProse(copy: Copy, text: string, field: string): Advisory[] {
  const out: Advisory[] = [];
  const clean = tidyProse(text);
  if (!clean) return out;

  if (clean === clean.toUpperCase() && /[A-Z]{4,}/.test(clean)) {
    out.push({
      field,
      note: copy.reviewCapitals,
      consider: copy.reviewCapitalsConsider,
    });
  }

  if (/(.)\1{3,}/.test(clean)) {
    out.push({ field, note: copy.reviewRepeats, consider: copy.reviewRepeatsConsider });
  }

  // The method is the product. A one-line "how to make it" is a description.
  if (field === 'method' && clean.length < 40) {
    out.push({
      field,
      note: copy.reviewShort,
      consider: copy.reviewShortConsider,
    });
  }

  return out;
}


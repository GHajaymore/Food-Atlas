/**
 * What each number on the atlas page actually means.
 *
 * A number on a screen is a claim, and a claim without its method is a claim the
 * reader has to take on trust. This app asks its readers not to take a dish's
 * authenticity on trust — it shows the evidence and names the gaps — so it cannot
 * then put "13,855 traditions" in large type and decline to say what was counted.
 *
 * Three parts to every entry, and the third is the one that matters:
 *
 *   `counts`  — what a single unit is. Almost every misreading starts here.
 *   `method`  — how the figure is derived, in enough detail to be checked.
 *   `caveat`  — what the number does **not** mean. Written to disappoint: if a
 *               figure flatters the atlas, this line is where it stops.
 *
 * These are deliberately data rather than prose in a component, so that the same
 * words appear wherever a figure does and cannot drift apart from each other.
 */

import type { Copy } from '../i18n/copy';

export interface MetricNote {
  /** The figure's name, as shown beside it. */
  title: string;
  counts: string;
  method: string;
  caveat: string;
}

/**
 * Built per render rather than once at import.
 *
 * The words come from `copy`, so this cannot be a module-level constant: a table
 * evaluated when the module first loads would hold whichever language was current then
 * and never change. Same reason the shelves and the contribute walkthrough became
 * functions.
 */
export const metricNotesFor = (copy: Copy): Record<string, MetricNote> => ({
  total: {
    title: copy.metricTotalTitle,
    counts: copy.metricTotalCounts,
    method: copy.metricTotalMethod,
    caveat: copy.metricTotalCaveat,
  },
  countries: {
    title: copy.metricCountriesTitle,
    counts: copy.metricCountriesCounts,
    method: copy.metricCountriesMethod,
    caveat: copy.metricCountriesCaveat,
  },
  atRisk: {
    title: copy.metricAtRiskTitle,
    counts: copy.metricAtRiskCounts,
    method: copy.metricAtRiskMethod,
    caveat: copy.metricAtRiskCaveat,
  },
  documented: {
    title: copy.metricDocumentedTitle,
    counts: copy.metricDocumentedCounts,
    method: copy.metricDocumentedMethod,
    caveat: copy.metricDocumentedCaveat,
  },
  located: {
    title: copy.metricLocatedTitle,
    counts: copy.metricLocatedCounts,
    method: copy.metricLocatedMethod,
    caveat: copy.metricLocatedCaveat,
  },
  illustrated: {
    title: copy.metricIllustratedTitle,
    counts: copy.metricIllustratedCounts,
    method: copy.metricIllustratedMethod,
    caveat: copy.metricIllustratedCaveat,
  },
  filmed: {
    title: copy.metricFilmedTitle,
    counts: copy.metricFilmedCounts,
    method: copy.metricFilmedMethod,
    caveat: copy.metricFilmedCaveat,
  },
  assessed: {
    title: copy.metricAssessedTitle,
    counts: copy.metricAssessedCounts,
    method: copy.metricAssessedMethod,
    caveat: copy.metricAssessedCaveat,
  },
  concentration: {
    title: copy.metricConcentrationTitle,
    counts: copy.metricConcentrationCounts,
    method: copy.metricConcentrationMethod,
    caveat: copy.metricConcentrationCaveat,
  },
  confidence: {
    title: copy.metricConfidenceTitle,
    counts: copy.metricConfidenceCounts,
    method: copy.metricConfidenceMethod,
    caveat: copy.metricConfidenceCaveat,
  },
  byContinent: {
    title: copy.metricByContinentTitle,
    counts: copy.metricByContinentCounts,
    method: copy.metricByContinentMethod,
    caveat: copy.metricByContinentCaveat,
  },
});

/** The note for a figure, or undefined where none has been written. */
export const metricNote = (copy: Copy, key: string): MetricNote | undefined => metricNotesFor(copy)[key];

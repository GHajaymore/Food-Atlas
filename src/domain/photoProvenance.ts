/**
 * Where a photograph came from, said accurately.
 *
 * Every imported record carried the same line: *"Matched by name on Wikimedia Commons
 * — the subject is not confirmed."* It is a good warning and it was true of about
 * three thousand photographs. The atlas has ten thousand, and for the other seven
 * thousand it is simply false.
 *
 * The distinction is the one this project already makes everywhere else — identity
 * against resemblance. A Commons search for "Al-Man'ouché" returned an Israeli zaatar
 * manakeesh: a related bread from a different country, and exactly the kind of
 * plausible wrong answer a name match produces. But an image attached to a dish's own
 * Wikidata item, or chosen by editors to head its own article, was not matched to it —
 * somebody put it there to illustrate *that* subject.
 *
 * ## Why this is worth fixing rather than leaving conservative
 *
 * Under-claiming looks harmless and is not. A warning printed on every photograph
 * stops being read, and the three thousand where it genuinely applies are the ones
 * that need it. Crying unverified on a picture the encyclopaedia chose for the article
 * trains a reader to ignore the label on the picture a search guessed at.
 *
 * ## What none of these mean
 *
 * `photoVerified` stays false throughout, for every source. Knowing an image was
 * attached to the right subject is not knowing it shows the dish *as made in the
 * place* — the standard the rest of the record is held to. These lines say where a
 * picture came from, which is a different and smaller claim than saying it is right.
 */

/** How a photograph came to be on a record. */
export type PhotoSource =
  /** The image property of the dish's own Wikidata item. */
  | 'wikidata'
  /** The lead image of the dish's own encyclopaedia article. */
  | 'article'
  /** An image on the recipe's own Wikibooks page. */
  | 'recipe'
  /** A Commons search for the dish's name. Plausible, not confirmed. */
  | 'search'
  /** Provenance not recorded. Older rows, and the honest answer for them. */
  | 'unknown';

const LINES: Record<PhotoSource, string> = {
  wikidata: 'Attached to this dish’s own Wikidata entry — not matched by name',
  article: 'The lead image of this dish’s own encyclopaedia article',
  recipe: 'Published on this recipe’s own page',
  search: 'Matched by name on Wikimedia Commons — the subject is not confirmed',
  unknown: 'Source not recorded — treat the subject as unconfirmed',
};

export const photoOriginLine = (source: PhotoSource): string => LINES[source];

/**
 * Whether the picture was chosen for this subject or found by resembling its name.
 *
 * The one distinction worth drawing, and the one the warning above turns on. It is
 * deliberately not called "verified": see the note at the top of this file.
 */
export const wasChosenForThisSubject = (source: PhotoSource): boolean =>
  source === 'wikidata' || source === 'article' || source === 'recipe';

/**
 * Finding real documentation for a dish, without letting the finder judge it.
 *
 * Most records in this atlas are a name and a place. Somewhere in the open corpora —
 * public-domain cookbooks on Wikisource, digitised books, national registers — there
 * is a published account of how many of them are made. Finding it is the single most
 * valuable thing that can be done to this catalogue, because the recipe is the
 * product.
 *
 * The danger is equally clear, and this file exists to contain it. A search engine
 * asked "find a source for Arisa" returns a source *about something called Arisa* —
 * and this project has already paid for that lesson twice. Searching Commons by dish
 * name illustrated a Malaysian chicken dish with an Italian singer at Sanremo, a
 * Croatian dish with a Turkish one, and a Maltese dish with French aioli via a
 * redirect. Roughly half of what name-matching returned was wrong, and it looked
 * completely fine until each one was opened. The probe that produced those numbers
 * measured *availability*, not accuracy, which is exactly the mistake a confident
 * finder invites.
 *
 * So the rules here are built around one idea: **a candidate must corroborate, not
 * merely match.** The record already knows things — a country, sometimes a region or
 * a cuisine, sometimes a list of ingredients. A real source for this dish will
 * independently mention at least one of them. A book that names the dish and nothing
 * else the record knows is not evidence that it is the same dish; it is evidence that
 * two things share a word.
 *
 * ## What a found source is allowed to contribute
 *
 * An allow-list, because a deny-list rots silently as the code around it grows:
 *
 *   - a **citation** — title, publisher, URL, so a reader can go and check;
 *   - that a **published account of the method exists** (`hasAccount`);
 *   - **ingredients named in the text**, as text.
 *
 * And what it may never contribute, whatever it appears to say:
 *
 *   - a **heritage designation**. Those come from institutional registers, and a book
 *     claiming a food is traditional is not a register.
 *   - the **traditional technique** or **community validation** dimensions. `assess()`
 *     leaves both at zero on principle: nobody in the sourcing chain watched anyone
 *     cook, and no one from the place has confirmed anything. A finder cannot supply
 *     what a search cannot witness.
 *
 * That containment has a property worth stating plainly, because it is the reason
 * this is safe to run at scale: the strongest thing a found source can do is set
 * `hasAccount`, and a record with an account and nothing else is classified by
 * `assess()` as **Unverified with no score at all**. So even a false positive that
 * survives every check below cannot inflate a dish's authenticity. It can add a
 * wrong citation — which is a real fault, and what the corroboration rule is for —
 * but it cannot make the atlas claim a food is authentic.
 */

/** A candidate returned by a search of some open corpus, before any of it is believed. */
export interface CandidateSource {
  /** The work's title, as the corpus records it. */
  title: string;
  /** Who published it — the corpus, or the original publisher where known. */
  publisher: string;
  url: string;
  /**
   * The text the corpus matched on: a snippet, an extract, or the page. Everything
   * decided below is decided from this, so an empty one can only ever be refused.
   */
  text: string;
  /** Year of publication where the corpus records it. Used only for display. */
  year?: string;
}

/** What the record already knows, and therefore what a real source can corroborate. */
export interface RecordFacts {
  name: string;
  country: string;
  /** Empty where the record has no depth below country. */
  region: string;
  /** The culinary tradition — "Tamil", "Sichuan". Empty where not established. */
  cuisine: string;
  /** Traditional ingredients already recorded, where any are. */
  ingredients: string[];
}

/**
 * Why a candidate was refused. A reason rather than a boolean, following
 * `isDish.notAFood`: the refusals are the interesting output of a run, and a run that
 * can only say "no" teaches nobody which rule is too strict.
 */
export type Refusal =
  | 'NO_TEXT'
  | 'NAME_ABSENT'
  | 'NO_CORROBORATION'
  | 'NAME_TOO_SHORT'
  | 'NAME_IS_A_COMMON_WORD';

/** An accepted candidate, carrying the reason it was accepted. */
export interface AcceptedSource {
  candidate: CandidateSource;
  /** The record's own facts the text independently mentioned. Never empty. */
  corroborates: string[];
  /** True where the text reads as an account of making something. */
  describesMethod: boolean;
}

/**
 * Dish names that are ordinary words in an English corpus.
 *
 * "Bread", "Cake", "Punch", "Toast" and their like match everything ever written, and
 * a corroborating country does not save them: a nineteenth-century English cookbook
 * mentions both "bread" and "India" on most pages without the two having anything to
 * do with each other. These are refused outright rather than filtered harder, because
 * the honest position is that full-text search cannot identify these records at all.
 *
 * Anchored whole-word at the point of use — the `\b` lesson from `brand`, which
 * prefix-matched "(Brandade de Morue)" and "(brandy)" before it was anchored.
 */
const COMMON_WORD_NAMES = new Set([
  'bread', 'cake', 'punch', 'toast', 'stew', 'soup', 'pie', 'roll', 'rolls', 'bun',
  'buns', 'pudding', 'porridge', 'pancake', 'pancakes', 'biscuit', 'biscuits',
  'dumpling', 'dumplings', 'noodle', 'noodles', 'rice', 'salad', 'sauce', 'curry',
  'tea', 'coffee', 'beer', 'wine', 'cheese', 'butter', 'honey', 'jam', 'pickle',
  'pickles', 'sausage', 'ham', 'bacon', 'crisps', 'chips', 'fries', 'wrap', 'cream',
]);

/**
 * A name short enough that it appears inside other words and other languages.
 *
 * Three characters matches too much to mean anything — and the cost of refusing a
 * genuine three-letter dish is one missing citation, against a false one that a
 * reader would have to open the book to catch.
 */
const MIN_NAME_LENGTH = 4;

// Built from a string rather than written as a regex literal, so the file stays
// plain ASCII — a literal range of combining marks is invisible in most editors and
// silently destroyed by anything that touches the file's encoding. This project has
// already repaired one double-encoded data file and corrupted a set of smart quotes
// cleaning up after it.
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

/** Strip accents and case so "Bánh mì" and "banh mi" compare equal. */
const fold = (s: string): string =>
  s
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase();

/** Whole-word search, so "ugali" does not match inside a longer word. */
function mentions(haystack: string, needle: string): boolean {
  const n = fold(needle).trim();
  if (n.length < 2) return false;
  const escaped = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Word boundaries fail against non-Latin scripts, where \w matches nothing. There,
  // fall back to a plain containment test — the script itself is already a strong
  // enough discriminator that a substring match is not the risk it is in English.
  const latin = /^[\x20-\x7f]+$/.test(n);
  const pattern = latin ? new RegExp(`\\b${escaped}\\b`) : new RegExp(escaped);
  return pattern.test(fold(haystack));
}

/**
 * Verbs that make a text an account of cooking rather than a mention of a food.
 *
 * A mechanical test on the words present, not a judgement about the food. It decides
 * only whether to set `hasAccount`, and a record with an account and nothing else is
 * Unverified with no score — so being wrong here costs a misleading note, never a
 * misleading badge.
 */
const METHOD_VERBS = [
  'boil', 'simmer', 'fry', 'roast', 'bake', 'steam', 'grill', 'knead', 'ferment',
  'grind', 'pound', 'soak', 'marinate', 'stir', 'whisk', 'chop', 'mince', 'sift',
  'season', 'stew', 'braise', 'toast', 'blanch', 'strain', 'cure', 'smoke', 'dry',
  'mix', 'pour', 'add', 'cover', 'serve', 'cool', 'heat',
];

/**
 * How many method verbs make a text a method.
 *
 * One verb is a sentence about food ("served with rice"). Three is somebody being
 * told what to do in order.
 */
const METHOD_VERBS_REQUIRED = 3;

export function describesMethod(text: string): boolean {
  const folded = fold(text);
  const hit = METHOD_VERBS.filter((v) => new RegExp(`\\b${v}(s|es|ed|ing)?\\b`).test(folded));
  return hit.length >= METHOD_VERBS_REQUIRED;
}

/**
 * Everything in the text that independently corroborates the record.
 *
 * Ingredients count individually, because three matching ingredients is a far
 * stronger signal than a country: half a cookbook can mention India, but a text
 * naming the dish alongside its recorded ingredients is describing that dish.
 */
export function corroborationsIn(text: string, facts: RecordFacts): string[] {
  const found: string[] = [];
  if (facts.country && mentions(text, facts.country)) found.push(facts.country);
  if (facts.region && mentions(text, facts.region)) found.push(facts.region);
  if (facts.cuisine && mentions(text, facts.cuisine)) found.push(facts.cuisine);
  for (const ingredient of facts.ingredients) {
    if (mentions(text, ingredient)) found.push(ingredient);
  }
  return found;
}

/**
 * Accept a candidate, or say why not.
 *
 * Deliberately shaped like `notAFood`: the caller gets a reason it can count and
 * print, so a run reports which rule did the work rather than only a survival rate.
 */
export function considerSource(
  candidate: CandidateSource,
  facts: RecordFacts,
): { accepted: AcceptedSource } | { refused: Refusal } {
  const name = facts.name.trim();

  if (fold(name).length < MIN_NAME_LENGTH) return { refused: 'NAME_TOO_SHORT' };
  if (COMMON_WORD_NAMES.has(fold(name))) return { refused: 'NAME_IS_A_COMMON_WORD' };
  if (!candidate.text.trim()) return { refused: 'NO_TEXT' };
  if (!mentions(candidate.text, name)) return { refused: 'NAME_ABSENT' };

  const corroborates = corroborationsIn(candidate.text, facts);
  if (!corroborates.length) return { refused: 'NO_CORROBORATION' };

  return {
    accepted: {
      candidate,
      corroborates,
      describesMethod: describesMethod(candidate.text),
    },
  };
}

/**
 * Whether an accepted source is worth putting on the record at all.
 *
 * Acceptance says the text is about this dish. This says the text is about *cooking*
 * it, which is a different question and the one that matters: the gap these records
 * have is the method, and a source that never describes a preparation does not fill
 * it. Citing one anyway adds a footnote that looks like documentation and is not.
 *
 * The rule was written after the only candidate ever accepted from Wikisource turned
 * out to be Presidential Proclamation 7235 — a tariff schedule — cited as a source
 * for peanut butter. It named the dish and it named the United States, so it passed
 * every corroboration check honestly. What it does not do is say how anybody makes
 * peanut butter, and that is what a reader following the link would be looking for.
 */
export function worthCiting(accepted: AcceptedSource): boolean {
  return accepted.describesMethod;
}

/**
 * The note that goes on the record beside the citation.
 *
 * It states what the finder actually established and what it did not, in the same
 * voice the rest of the app uses for weak evidence — because a citation added by a
 * machine, presented without that qualification, reads to a reader exactly like one
 * checked by a person.
 */
export function sourceNote(accepted: AcceptedSource): string {
  const what = accepted.corroborates.slice(0, 3).join(', ');
  const found = `Found by searching open archives; it names the dish alongside ${what}.`;
  return accepted.describesMethod
    ? `${found} It describes a preparation, but nobody has confirmed this is how the dish is made in the place.`
    : `${found} It does not describe how the dish is made.`;
}

/**
 * The fields a found source is permitted to write.
 *
 * Named as data so the restriction can be asserted in a test rather than trusted to
 * survive the next person who edits the ingest. Everything absent from this list is
 * refused by construction — including `heritage`, and the technique and community
 * dimensions, which no search can witness.
 */
export const FINDER_MAY_WRITE = ['sources', 'hasAccount', 'ingredients'] as const;
export const FINDER_MAY_NEVER_WRITE = [
  'heritage',
  'badgeLevel',
  'score',
  'breakdown',
  'traditionalBadge',
  'atRisk',
] as const;

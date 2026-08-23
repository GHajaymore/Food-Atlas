/**
 * "I have chicken and tomatoes — what can I make?"
 *
 * The question people actually ask a cookbook, and the one this atlas could never
 * answer. It is worth being clear about why it is now answerable, because the same data
 * was just declared unusable for the ingredient facet:
 *
 * **Matching is a much easier problem than listing.** Offering ingredients as options
 * needs a clean, finite, translatable vocabulary, and the atlas has 27,036 raw strings —
 * "Salt to taste", "½ teaspoon salt", "Sal" — which is why that facet was removed. But a
 * reader who types "chicken" does not need the list to be clean. "1 chicken breast",
 * "Chicken thighs, bone in" and "chicken (whole)" all contain the word, and a substring
 * match over messy strings finds every one of them.
 *
 * So the mess that made the facet useless costs almost nothing here.
 *
 * ## Ingredients only, never the name
 *
 * Searching the whole record for "chicken" returns Chicken Tikka Masala first, which is
 * the wrong answer to "I have chicken" — the reader is telling you what is in their
 * kitchen, not what they want to eat. `searchResults` deliberately matches names,
 * places, categories and ingredients together; this deliberately does not.
 *
 * ## Ranked by how much of the pantry a dish uses, not by how well it scores
 *
 * A dish using three of the reader's four things beats one using one, even if the second
 * is better documented. Evidence breaks ties, because between two dishes that both use
 * chicken and tomatoes, the one with a recorded method is the more useful answer.
 *
 * ## It says what it could not find
 *
 * `missing` names the terms that matched nothing at all. Somebody who types "chicken,
 * gochujang" and gets chicken dishes should be told the gochujang was ignored, rather
 * than left assuming the atlas holds Korean food it does not.
 */

import type { Dish } from './types';

/**
 * Ingredient names that mean the same thing.
 *
 * Deliberately small and hand-written. The atlas spans eighty languages and this is not
 * an attempt to translate anything — it is the short list of cases where two spellings
 * of one ingredient would otherwise split a reader's results in half, drawn from what is
 * actually in the data: British against American English, and the common transliteration
 * variants of South Asian dairy.
 *
 * Every entry is bidirectional: whichever the reader types, the other is searched too.
 */
const SAME: string[][] = [
  ['aubergine', 'eggplant', 'brinjal'],
  ['courgette', 'zucchini'],
  ['coriander', 'cilantro'],
  ['chickpea', 'garbanzo', 'chana'],
  ['paneer', 'panir', 'panner'],
  ['yoghurt', 'yogurt', 'curd', 'dahi'],
  ['spring onion', 'scallion', 'green onion'],
  ['prawn', 'shrimp'],
  ['minced beef', 'ground beef', 'beef mince'],
  ['maize', 'corn', 'sweetcorn'],
  ['groundnut', 'peanut'],
  ['okra', 'ladies finger', 'bhindi'],
  ['clarified butter', 'ghee'],
  ['bell pepper', 'capsicum', 'sweet pepper'],
  ['swede', 'rutabaga'],
  ['plantain', 'cooking banana'],
];

const fold = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    /* Quantities and packaging, which is most of what a recipe line is made of.
       "½ teaspoon salt" and "Salt to taste" both have to reduce to something "salt"
       can be found inside. */
    .replace(/[^\p{Letter}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Every spelling worth searching for one the reader typed. */
export function synonymsOf(term: string): string[] {
  const folded = fold(term);
  const group = SAME.find((set) => set.some((word) => fold(word) === folded));
  return group ? group.map(fold) : [folded];
}

/**
 * Whether a dish uses this ingredient.
 *
 * ## Matched at a word start, which is neither of the two obvious rules
 *
 * A plain substring match is what this did first, and it produced exactly the bug this
 * codebase produces more than any other — right vocabulary, wrong subject. A French
 * brioche came back for "paneer", because its ingredients include *"se dépanner avec de
 * la levure"* and "dépanner" contains "panner".
 *
 * Requiring a whole word fixes that and breaks something more common: the haystack is
 * recipe text, so "tomato" has to find "tomatoes" and "lentil" has to find "lentils".
 *
 * So the term must begin a word and may run into anything: `tomato` matches "tomatoes",
 * `chicken` matches "chicken," and "Chicken Thighs", and `panner` no longer matches
 * "depanner" because there is no word boundary in front of it.
 *
 * The direction matters too — the reader's term is looked for inside the record's
 * ingredient, never the reverse — so typing one letter does not return the atlas.
 */
export function dishHas(dish: Dish, term: string): boolean {
  const wanted = synonymsOf(term).filter((w) => w.length >= 2);
  if (!wanted.length) return false;

  /* Escaped: an ingredient a reader types is untrusted input, and "(" would otherwise
     throw rather than simply find nothing. */
  const patterns = wanted.map(
    (want) => new RegExp(`(^|\\P{Letter})${want.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'u'),
  );

  return dish.ingredients.some((ingredient) => {
    const hay = fold(ingredient);
    return patterns.some((pattern) => pattern.test(hay));
  });
}

export interface PantryMatch {
  dish: Dish;
  /** Which of the reader's terms this dish uses. Shown, so a match is never unexplained. */
  used: string[];
}

export interface PantryResult {
  matches: PantryMatch[];
  /** Terms nothing in the atlas uses. Reported rather than silently dropped. */
  missing: string[];
}

/** Split what somebody typed. Commas, "and", and newlines all mean the same thing. */
export const parsePantry = (input: string): string[] => {
  const parts = input
    .split(/[,;\n]|\band\b|\+/i)
    .map((part) => part.trim())
    .filter((part) => part.length >= 2);
  /* Deduplicated after folding, so "Chicken" and "chicken " are one term. */
  const seen = new Set<string>();
  return parts.filter((part) => {
    const f = fold(part);
    if (!f || seen.has(f)) return false;
    seen.add(f);
    return true;
  });
};

/**
 * What can be made from these ingredients.
 *
 * Any-match rather than all-match: somebody with six things in their kitchen should not
 * be shown nothing because no single dish uses all six. The ranking does the work — the
 * dish using five of them is at the top, and the reader can see how many each one used.
 */
export function cookWith(dishes: Dish[], terms: string[], limit = 60): PantryResult {
  const wanted = terms.filter((t) => t.trim().length >= 2);
  if (!wanted.length) return { matches: [], missing: [] };

  const matches: PantryMatch[] = [];
  const everUsed = new Set<string>();

  for (const dish of dishes) {
    if (!dish.ingredients.length) continue;

    const used = wanted.filter((term) => dishHas(dish, term));
    if (!used.length) continue;

    for (const term of used) everUsed.add(term);
    matches.push({ dish, used });
  }

  matches.sort(
    (a, b) =>
      b.used.length - a.used.length ||
      /* Between two dishes using the same number of the reader's ingredients, the
         better-documented one is the more useful answer — and a dish with no method
         recorded cannot actually be cooked from this atlas at all. */
      (b.dish.steps.length > 0 ? 1 : 0) - (a.dish.steps.length > 0 ? 1 : 0) ||
      (b.dish.score ?? -1) - (a.dish.score ?? -1),
  );

  return {
    matches: matches.slice(0, limit),
    missing: wanted.filter((term) => !everUsed.has(term)),
  };
}

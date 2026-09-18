/**
 * Match a word the way somebody is going to type it.
 *
 * Search compared lowercased strings and nothing else, so a name carrying a mark could
 * only be found by reproducing the mark exactly. **1,957 records — one name in ten — were
 * effectively unreachable**: Bagòss, crème brûlée, aşure, Erdäpfelknödel, niño envuelto,
 * rødgrød. A reader who knows the dish well enough to look it up is usually the one least
 * able to type it, and on a phone keyboard "ö" is a long press and "ş" is a different
 * keyboard altogether.
 *
 * This is the same failure as the Cyrillic *с* inside "cheese", from the other side: there
 * the data held a character nobody would type, here the reader is asked to type one they
 * cannot reach. Both end with a record that exists and cannot be found.
 *
 * ## What it does, and what it deliberately does not
 *
 * Marks that Unicode can take apart are taken apart — `é` is `e` plus an accent, so the
 * accent is dropped. A handful of letters are *not* decomposable, because they are letters
 * in their own right rather than a base plus a mark: ø, ß, æ, œ, ł, đ, ı, þ, ð. Those are
 * mapped by hand to what a reader reaches for instead, which is how they are conventionally
 * romanised — ß to "ss", æ to "ae".
 *
 * Nothing outside the Latin alphabet is touched. Devanagari and Arabic marks sit in their
 * own blocks and are not combining marks in this sense; folding them would merge letters
 * that are not the same letter. Korean decomposes into jamo here, which is harmless because
 * both sides of every comparison are folded and so agree with each other.
 *
 * It is not a collation and does not try to be. It answers one question: would a reader
 * typing plain letters expect this to match?
 */

/** Letters that are not a base plus a mark, and so survive decomposition. */
const INDIVISIBLE: Record<string, string> = {
  ø: 'o', Ø: 'o',
  ß: 'ss', ẞ: 'ss',
  æ: 'ae', Æ: 'ae',
  œ: 'oe', Œ: 'oe',
  ł: 'l', Ł: 'l',
  đ: 'd', Đ: 'd',
  ð: 'd', Ð: 'd',
  þ: 'th', Þ: 'th',
  ı: 'i', İ: 'i',
  ŋ: 'n', Ŋ: 'n',
};

/**
 * The comparable form of a piece of text: lowercase, and without Latin marks.
 *
 * Apply it to both sides of a comparison, never to one. Folding only the query would
 * make "creme" miss "crème" exactly as before.
 */
export const fold = (value: string): string =>
  value
    .normalize('NFD')
    /* Combining marks, which is what NFD has just separated out. */
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[øØßẞæÆœŒłŁđĐðÐþÞıİŋŊ]/g, (letter) => INDIVISIBLE[letter] ?? letter)
    .toLowerCase();

/**
 * A query as a set of terms, folded — because a reader does not know what order the
 * record puts its words in.
 *
 * Search matched the whole query as one substring, so word order was load-bearing:
 * "pizza margherita" found the Neapolitan record and "margherita pizza" found nothing.
 * "halwa kozhikode" found nothing while "kozhikode halwa" found the record. "mole
 * oaxacan" found nothing at all, with Oaxacan Mole Negro sitting in the catalogue.
 *
 * Nobody types a record's title in its stored order except by accident.
 *
 * Every term must appear, so this stays a narrowing search rather than a fuzzy one —
 * a misspelling still finds nothing — but the terms may appear anywhere, in any order,
 * and across different fields: "kerala halwa" may take the place from the breadcrumb and
 * the name from the title.
 */
export const terms = (query: string): string[] => fold(query).split(/\s+/).filter(Boolean);

/**
 * The forms a searched word might be filed under, the plural first.
 *
 * Readers search in the plural — "tacos", "dumplings", "curries" — and records are
 * named in the singular, so a substring match on the word as typed could never find
 * them. Measured over the whole catalogue before this existed: "curry" found 177
 * records and "curries" 15; "samosa" found 1 and "samosas" none; "empanadas" found 2
 * of the 7.
 *
 * Every candidate is the typed word or a shorter prefix of it, so matching on any of
 * them can only ever *add* results — a record the plural already reached is still
 * reached. The one cost is noise from a short stem ("peas" would reach "pear"), which
 * is why a stem is only offered at four letters or more, and why a double "s" is left
 * alone: "swiss" is not the plural of "swis".
 *
 * English only, on purpose. The records a reader is most likely to search in the
 * plural are named in English, and a rule for every language would be a morphology
 * engine wearing a regular expression — wrong more often than it helped.
 */
export function singularForms(term: string): string[] {
  const forms = [term];
  const offer = (stem: string) => {
    if (stem.length >= 4 && !forms.includes(stem)) forms.push(stem);
  };
  if (term.endsWith('ies')) offer(`${term.slice(0, -3)}y`);
  /* "-es" is a plural ending only after a sibilant or an o — sandwiches, boxes,
     tomatoes. Stripping it everywhere turned "cookies" into "cooki", which is a prefix
     of "cooking", and a search for cookies returned 106 records instead of 39. */
  if (/(s|x|z|ch|sh|o)es$/.test(term)) offer(term.slice(0, -2));
  if (term.endsWith('s') && !term.endsWith('ss')) offer(term.slice(0, -1));
  return forms;
}

/**
 * Spellings of one dish, any of which a reader might type.
 *
 * Transliteration has no single answer: the same word reaches English as biryani,
 * biriyani and biriani, depending on who wrote it down. Measured before this list:
 * "biriyani" found 2 of the 11 biryani records, "kabob" 4 of 23, "shwarma" none.
 *
 * Hand-written and deliberately short. Every entry is one dish under several
 * spellings — not related dishes, which would be the atlas quietly deciding that two
 * traditions are the same thing, the precise judgement it exists not to make. And no
 * spelling is included that could reach something else: not "chile", which is a
 * country; not "dal" or "ghi", which sit inside unrelated words.
 */
const SPELLINGS: string[][] = [
  ['biryani', 'biriyani', 'biriani', 'beriani'],
  ['kebab', 'kabob', 'kebap', 'kabab'],
  ['shawarma', 'shwarma', 'shawerma', 'shoarma'],
  ['yogurt', 'yoghurt', 'yoghourt'],
  ['chili', 'chilli'],
  ['doughnut', 'donut'],
  ['hummus', 'houmous', 'hommus'],
  ['falafel', 'felafel'],
  ['kofta', 'kufta', 'kofte'],
  ['pilaf', 'pilau', 'pulao', 'pilav'],
  ['tzatziki', 'tsatsiki'],
  ['baklava', 'baklawa'],
  ['chapati', 'chapatti', 'chappati'],
  ['paratha', 'parantha', 'parotta', 'porotta'],
];

const SPELLING_OF = new Map<string, string[]>();
for (const group of SPELLINGS) for (const spelling of group) SPELLING_OF.set(spelling, group);

/* Asked once per record per keystroke — 17,000 times for one query — so each word's forms
   are worked out once and kept. The vocabulary a reader types is small; this stays small. */
const formsOf = new Map<string, string[]>();

/** Every form a searched word could match: its singulars, and the other spellings of each. */
export function termForms(term: string): string[] {
  const known = formsOf.get(term);
  if (known) return known;
  const forms = new Set<string>();
  for (const form of singularForms(term)) {
    forms.add(form);
    for (const other of SPELLING_OF.get(form) ?? []) forms.add(other);
  }
  const list = [...forms];
  formsOf.set(term, list);
  return list;
}

/** True when every term appears in an already-folded haystack, in any of its forms. Fold both sides. */
export const matchesAllTerms = (haystack: string, queryTerms: string[]): boolean =>
  queryTerms.every((term) => termForms(term).some((form) => haystack.includes(form)));

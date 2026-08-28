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

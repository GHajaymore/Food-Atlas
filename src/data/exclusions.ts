/**
 * Records that are not food traditions, each read and excluded by name.
 *
 * `scripts/drop-non-dishes.mjs` removes most of these at the source, by rule. What is left
 * here is what the rules cannot reach, for one of two reasons:
 *
 *   - **No source description to read.** The brand rule reads Wikidata's one-line
 *     classification — "brand of chewing gum". Records from the cuisine categories and
 *     the Wikibooks cookbook have no such line; their only text is prose or a method, and
 *     prose that merely mentions a brand is often a real dish (Nom yen names the
 *     condensed milk it is made with).
 *
 *   - **Deleting the source row would renumber the atlas.** A cuisine or cookbook record's
 *     id is its position among the rows that survive filtering, so removing a row from
 *     `cuisines.json` or `cookbook.json` shifts the id — and the address — of every record
 *     after it. These are dropped from the built catalogue instead, after every id is
 *     fixed, so nothing else moves.
 *
 * Every entry was read before it was listed, from the record's own text, and the reason
 * says what that text showed. Nothing is here on recollection alone: GABA, whose record
 * says only "Japanese chocolate", stays, because the record does not say it is a product
 * and the atlas does not remove things on a hunch.
 *
 * Name and country together, so a real dish of the same name elsewhere is never caught.
 */
export const NOT_TRADITIONS: { name: string; country: string; why: string }[] = [
  { name: 'Modjo', country: 'Denmark', why: 'An energy drink, "manufactured by Cult".' },
  { name: 'Mokaï', country: 'Denmark', why: 'A cider, "manufactured by Cult".' },
  { name: 'Coca-Cola Plus', country: 'Japan', why: 'A health drink "manufactured by Coca-Cola".' },
  { name: 'SOYJOY', country: 'Japan', why: 'A snack bar brand.' },
  { name: 'KYOTO WHOPPER', country: 'Japan', why: 'A Burger King menu item.' },
  { name: 'Maltesers', country: 'Malta', why: 'A confectionery product "manufactured by Mars".' },
  { name: 'Charms Blow Pops', country: 'United States', why: 'A confectionery product of Charms Candy Company.' },
  { name: 'Carabao Energy Drink', country: 'Thailand', why: 'An energy drink "manufactured by Carabao Tawandang Co., Ltd."' },
  { name: 'Maggi', country: 'Switzerland', why: 'A brand of recipe mixes and seasonings.' },
  { name: 'Weet-Bix', country: 'Australia', why: 'A breakfast product of the Sanitarium Health Food Company.' },
  { name: 'Jiangxiaobai', country: 'China', why: 'One distillery’s brand of baijiu, not baijiu itself.' },
  {
    name: 'Prawn soup',
    country: 'Canada',
    why: 'Everything on the record describes a mass-produced canned soup from Campbell’s.',
  },
  { name: 'B-52', country: 'France', why: 'A modern mixed drink recipe, not a food tradition.' },
  { name: '007', country: 'France', why: 'A modern mixed drink recipe, not a food tradition.' },
  { name: 'S.L.Y', country: 'France', why: 'A modern mixed drink recipe, not a food tradition.' },
  {
    name: 'East German coffee crisis',
    country: 'Vietnam',
    why: 'A historical event in the coffee trade, not a dish.',
  },
];

const excluded = new Set(NOT_TRADITIONS.map((entry) => `${entry.name}|${entry.country}`));

export const isExcluded = (name: string, country: string): boolean => excluded.has(`${name}|${country}`);

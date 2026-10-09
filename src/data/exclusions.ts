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
  {
    name: 'Sichuan Food (restaurant)',
    country: 'Netherlands',
    why: '"A Sichuan cuisine restaurant in Amsterdam" — a restaurant, filed as a dish under the Netherlands › Sichuan.',
  },
  {
    name: 'British and Canadian School Building',
    country: 'China',
    why: '"An historic building, former English-language school and Chinese food products factory" in Montreal.',
  },
  /*
   * Found on 9 October by asking every record's name whether it reads like a dish, then
   * reading each suspect's article lead. Kept: "Festival" (Jamaica), which sounded like an
   * event and is "a type of deep-fried bread, typical of Jamaican cuisine".
   */
  { name: 'Mowgli Street Food', country: 'India', why: '"A restaurant chain in the United Kingdom that serves Indian cuisine."' },
  { name: "Curry in the Crown: The Story of Britain's Favourite Dish", country: 'India', why: 'A book about curry, not a dish.' },
  { name: 'Good Curry Guide', country: 'India', why: 'A restaurant guide, not a dish.' },
  { name: 'Fort Road Food Street', country: 'Pakistan', why: 'A street in Lahore, not a dish.' },
  { name: 'Gawalmandi Food Street', country: 'Pakistan', why: 'A street in Lahore, not a dish.' },
  { name: 'Just One Cookbook', country: 'Japan', why: 'A recipe website, not a dish.' },
  { name: 'Kweilin Street Night Market', country: 'China', why: 'A night market, not a dish.' },
  { name: "Eddy's Bar", country: 'China', why: '"A gay bar in Shanghai."' },
  { name: 'Omar (whisky brand)', country: 'Taiwan', why: 'A whisky brand of the Taiwan Tobacco and Liquor Corporation.' },
  { name: 'Tea Research and Extension Station', country: 'Taiwan', why: '"The research and development center of Taiwan tea."' },
  { name: 'Hàng Bông Street', country: 'Vietnam', why: 'A street in Hanoi, not a dish.' },
  { name: 'Longevity Brand', country: 'Vietnam', why: '"A brand of canned condensed milk, registered by FrieslandCampina."' },
  { name: '2007 Vietnam food scare', country: 'Vietnam', why: 'An event, not a dish.' },
  { name: 'Bar One', country: 'South Africa', why: 'A chocolate bar "manufactured in South Africa by Nestlé" — a brand, like Maltesers.' },
  { name: '5 Star (chocolate bar)', country: 'India', why: 'A chocolate bar "produced by Cadbury" — a brand, like Maltesers.' },
  { name: 'Black Thunder (chocolate bar)', country: 'Japan', why: 'A chocolate bar of the Yuraku Confectionery Company — a brand.' },
  { name: 'Dilly Bar', country: 'United States', why: 'A Dairy Queen menu item, like the Burger King one above.' },
  {
    name: 'Heinz Mustaaaaaard Chipotle Honey Flavored Mustard with Other Natural Flavors',
    country: 'United States',
    why: 'One product of one manufacturer, named as it is sold.',
  },
  { name: 'Vorlage:Rezept', country: 'Germany', why: 'The German Wikibooks recipe template itself, read in as a recipe.' },
  { name: 'Street food of Chennai', country: 'India', why: 'An overview of a city’s street food, not one dish.' },
  { name: 'Street food of Thailand', country: 'Thailand', why: 'An overview of a country’s street food, not one dish.' },
  { name: 'Street food of Indonesia', country: 'Indonesia', why: 'An overview of a country’s street food, not one dish.' },
  { name: 'Hong Kong street food', country: 'China', why: 'An overview of a city’s street food, not one dish.' },
  { name: 'B-52', country: 'France', why: 'A modern mixed drink recipe, not a food tradition.' },
  { name: '007', country: 'France', why: 'A modern mixed drink recipe, not a food tradition.' },
  { name: 'S.L.Y', country: 'France', why: 'A modern mixed drink recipe, not a food tradition.' },
  {
    name: 'East German coffee crisis',
    country: 'Vietnam',
    why: 'A historical event in the coffee trade, not a dish.',
  },

  /*
   * Found on 2026-10-05 by asking a different question: which records are *named* for a
   * country they are not filed under. Most answers were honest — "Japanese style peanuts"
   * really is a Mexican snack, "Swiss wing" is a Hong Kong dish whose own account says it
   * is not Swiss — but these seven were not dishes at all.
   *
   * The three works are the gap in `drop-non-dishes`'s title rule, which matches a
   * parenthetical of exactly "(film)" and not "(1973 film)". Excluded here rather than
   * widening that rule and re-running it, because that script deletes rows from
   * `cuisines.json` and a deleted row renumbers every record after it.
   */
  { name: 'Turkish Delight (1973 film)', country: 'Netherlands', why: 'Paul Verhoeven’s 1973 drama, not a confection.' },
  { name: 'The Banquet (1991 film)', country: 'Hong Kong', why: 'A 1991 film.' },
  { name: 'Tiffin (book)', country: 'India', why: 'A book about food, not a food.' },
  { name: 'Burger King French Toast Sticks', country: 'United States', why: 'A Burger King menu item — its own description says so.' },
  { name: 'Cheetos Mexican Street Corn', country: 'United States', why: 'A Cheetos flavour variant, by its own description.' },
  { name: "Fry's Turkish Delight", country: 'United Kingdom', why: 'A branded confectionery bar, not the confection itself — which the atlas holds separately.' },
  { name: 'Black russian', country: 'France', why: 'A modern mixed drink recipe, like the three cocktails above it.' },
];

const excluded = new Set(NOT_TRADITIONS.map((entry) => `${entry.name}|${entry.country}`));

export const isExcluded = (name: string, country: string): boolean => excluded.has(`${name}|${country}`);

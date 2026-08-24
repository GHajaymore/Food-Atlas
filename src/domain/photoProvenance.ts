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

import { decodeEntities } from './text';

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

/**
 * The photographer's name, as a reader should see it.
 *
 * Commons author fields are free text and arrive in several unhelpful shapes. These
 * are shown under every photograph in the atlas, and attribution is a **condition of
 * the licence** rather than a courtesy — so this tidies presentation and never drops
 * a name.
 *
 * What it fixes, with counts from the catalogue as it stands:
 *
 *   - **61** read "No machine-readable author provided. J.P.Lon~commonswiki assumed
 *     (based on copyright claims)." That is Commons boilerplate wrapped around a real
 *     username; the username is the attribution and the rest is apparatus.
 *   - **29** carry undecoded HTML entities, so a reader sees "Canadian National
 *     Collections &amp; Zhaofu Yang" with the ampersand spelled out.
 *   - **17** carry wiki-link residue — "Raveesh Vyas from [Ahmedabad, Noida], India",
 *     and one Korean credit ending in a stray `]` where `[url name]` was half-stripped.
 *
 * What it deliberately does not do: shorten a long credit, or replace a bare URL with
 * a domain. 105 credits are over eighty characters and some of them are a paragraph,
 * which is ugly and is what the photographer asked for. Seventeen are nothing but a
 * URL, which is all Commons holds for them. Neither is ours to edit down.
 */
/** "No machine-readable author provided. X assumed (based on copyright claims)." */
const COMMONS_BOILERPLATE =
  /^no machine-readable author provided\.\s*(.+?)\s*assumed\s*\(based on copyright claims\)\.?$/i;

/**
 * The other shapes Commons wraps a username in.
 *
 * Each keeps the name and drops the file-history sentence around it:
 *
 *   "Original uploader was Natto at ja.wikipedia"          → Natto        (41 records)
 *   "Transferred from en.wikipedia … original uploader was Sjschen at …"  → Sjschen
 *   "Chmouel at French Wikipedia Later versions were uploaded by Greudin" → Chmouel
 *
 * `derivative work:` is deliberately absent. "Chopstick.JPG: 毛抜き derivative work:
 * Richardprins (talk)" names **two** contributors — whoever made the original and
 * whoever altered it — and both are owed the credit. Seventeen records carry it, and
 * trimming either name to fit a card is not a tidy-up, it is dropping an attribution.
 */
const UPLOADER_SHAPES: [RegExp, number][] = [
  [/original uploader was\s+(.+?)\s+at\s+\S+/i, 1],
  [/^(.+?)\s+later versions? (?:were|was) uploaded by/i, 1],
];

export function tidyCredit(raw: string): string {
  const original = (raw ?? '').trim();
  if (!original) return '';

  let credit = decodeEntities(original);

  const boilerplate = COMMONS_BOILERPLATE.exec(credit);
  if (boilerplate?.[1]) credit = boilerplate[1];

  for (const [shape, group] of UPLOADER_SHAPES) {
    const found = shape.exec(credit);
    if (found?.[group]) {
      credit = found[group];
      break;
    }
  }

  credit = credit
    // Brackets only — whatever was inside them is part of the name or the place.
    .replace(/[[\]]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.])/g, '$1')
    .trim()
    // A trailing separator left by the bracket strip.
    .replace(/[,;]$/, '')
    .trim();

  // Never lose an attribution to a tidy-up. If the rules above emptied it, the
  // original stands — an ugly credit is a licence met, and a missing one is not.
  return credit || original;
}

/**
 * Whether a file is a photograph of the food, or something else entirely.
 *
 * 283 records were illustrated with something that is not a picture of a dish, and
 * two of those files accounted for most of it: **220 records shared
 * `Noia_64_apps_energy.png`**, which is a KDE desktop icon, and 35 shared
 * `ChineseDishLogo.png`. Both come from articles that use a placeholder graphic where
 * a photograph would go, and the ingest took the article's image without asking what
 * the image was.
 *
 * The rest are the same mistake in smaller numbers: company logos (Brooke Bond,
 * Bombay Sweets, Mavalli Tiffin Room), a wine-region locator map, and two PDFs — one
 * of them a scanned 1936 book called *Plenty of Onions* — which a browser cannot
 * render as an image at all.
 *
 * A record refused here shows the monogram instead, which says "no photograph on
 * record". That is true, and it is what 49% of the atlas already says. An icon of a
 * lightning bolt captioned as Andalusian olives is not a photograph the reader is
 * better off having.
 *
 * Matched on the file name because that is all we hold. Deliberately narrow: real
 * photographs are saved as png often enough that the extension alone proves nothing,
 * so only formats a browser will not show as a photo are refused outright, and the
 * name has to actually say logo, icon, map or one of the icon-set prefixes.
 */
const NOT_AN_IMAGE = /\.(pdf|svgz?|tiff?|djvu|ogv|webm)$/i;

const A_GRAPHIC_NOT_A_PHOTOGRAPH =
  /(^|[_\- ])(noia|nuvola|crystal|gnome|oxygen|tango|emblem|symbol)[_\- ]|logo|icon|_map\b|flag[_ ]of|placeholder|no[_ ]image/i;

/**
 * A picture *of* something that is not the food — a map, a chart, a plan.
 *
 * Ajay, 2026-08-24: *"Croissant picture is not correct, it's showing a map."* It was:
 * `Croissant_(linguistique).png`, a map of the Croissant dialect area of France, on the
 * recipe for the pastry. Wikipedia disambiguates two subjects that share a name and the
 * image pass took the wrong one.
 *
 * The rule above could not catch it. That one asks whether a file is a *graphic* — an
 * icon set, a logo, a flag — and this file is a genuine PNG image with none of those
 * words in it. The question this asks is different and harder: what is the picture **of**.
 *
 * ## Two rules that were measured and rejected first
 *
 * **The file extension.** Maps are usually PNG, so refusing PNG looks tempting: 539 of
 * the 10,638 photographs are PNG and a sample of them is Argentinian pizza, Bosnian
 * cheese, agnolotti and a bombe glacée. It would delete about five hundred real
 * photographs to catch a handful of maps. The existing comment on `NOT_AN_IMAGE` already
 * said this and it was right.
 *
 * **Any parenthetical in the file name.** 1,291 photographs carry one and they are
 * overwhelmingly "(cropped)", "(1)", "(Madrid)", "(fromage)". Worse, a keyword list
 * inside parentheses false-positives the way this codebase's keyword lists always do:
 * "band" matched *Sosis Bandari* and "plant" matched *Gonja (plantain)*.
 *
 * ## What is left is the vocabulary of the thing itself
 *
 * A map says map, carte, mapa, karte; a chart says chart or diagram; a coat of arms says
 * blason or wappen. Anchored as whole words — including against brackets, which is what
 * the croissant needed — so "plantain" and "Bandari" cannot match.
 *
 * Measured across all 10,638: it matches **10**, and every one is a picture of something
 * other than food — a dialect map, a railway route map, a species range map, a land plan
 * from the 1700s, a microwave cooking chart, and a football club's performance chart on
 * the Hamburger record. **No false positives**, which is the number that made it safe to
 * apply; re-run it if the list is ever widened.
 */
const A_PICTURE_OF_SOMETHING_ELSE =
  /(^|[_\-. (])(carte|mapa|karte|mappa|kaart|map|maps|diagram|diagramme|schema|chart|graph|plan|blason|armoiries|wappen|escudo|drapeau|bandera|flagge|timeline|distribution|repartition|dialect|linguistique|linguistic|sprachkarte)([_\-. )]|$)/i;

export function isPhotograph(url: string): boolean {
  const file = decodeURIComponent((url ?? '').split('/').pop() ?? '').split('?')[0];
  if (!file) return false;
  if (NOT_AN_IMAGE.test(file)) return false;
  if (A_PICTURE_OF_SOMETHING_ELSE.test(file)) return false;
  return !A_GRAPHIC_NOT_A_PHOTOGRAPH.test(file);
}

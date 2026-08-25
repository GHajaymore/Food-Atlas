import type { Copy } from '../i18n/copy';

/**
 * Photographs contributed by the people who cooked the food.
 *
 * The reason this exists: roughly ten thousand records still have no picture, and
 * since the home screen stopped showing unphotographed records, a missing photograph
 * is the difference between a tradition being browsable and being invisible. The
 * automated sources — Wikidata's images, an article's lead image, a Commons search —
 * only reach food that someone has already documented. The food this app most wants
 * to show is precisely the food nobody has documented.
 *
 * ## Why not simply accept a link to a social post
 *
 * Three reasons, and each one is fatal on its own.
 *
 * **Licence.** A photograph in a social post is its author's copyright, all rights
 * reserved by default. Labelling it "from Instagram" is an attribution, not a
 * permission — a credit line has never been a licence. Displaying it would be
 * infringement no matter how carefully it were captioned.
 *
 * **Cost.** Reading those posts programmatically means a paid API on every major
 * platform, and this app is not collecting money from anyone. Scraping instead of
 * paying breaks their terms rather than the budget.
 *
 * **Provenance.** A photograph tagged with a dish name carries no evidence that it
 * shows that dish, from that place, made that way — which is the only thing this app
 * is actually for.
 *
 * ## What is done instead
 *
 * The contributor publishes their own photograph to Wikimedia Commons, and gives us
 * the file name. That single decision answers all three:
 *
 *   - **Legal by construction.** Commons will not accept a file until the uploader
 *     affirms they made it and chooses a free licence. The permission is granted
 *     through Wikimedia's own process, recorded on the file page, and verifiable by
 *     anyone — it is not a checkbox on our form that we would then have to defend.
 *   - **Free by construction.** Wikimedia hosts the file, forever, at no cost to
 *     this project. Accepting uploads ourselves would mean storage and bandwidth
 *     bills that grow with success, which is the wrong shape of cost for an app that
 *     takes no money.
 *   - **Provenance preserved.** The file page carries the author, the date, the
 *     licence and often the camera and place, and it outlives this app.
 *
 * It also means the contributor's photograph helps every other project that needs
 * one, which is a better outcome for them than a picture locked inside our database.
 *
 * The friction is real and is not hidden: making a Commons account is a step, and
 * some people will stop there. That is the price of the only route that is both free
 * and lawful, and a smaller price than publishing pictures we have no right to.
 */

/** Where the contributor goes to publish their photograph. */
export const COMMONS_UPLOAD_URL = 'https://commons.wikimedia.org/wiki/Special:UploadWizard';

/**
 * Licences that permit display with attribution.
 *
 * Commons is a free-media repository, so in practice everything on it qualifies —
 * but "in practice" is not a legal basis. The licence is checked explicitly against
 * this list, and an unrecognised one is refused rather than assumed, because the
 * cost of being wrong is publishing someone's work without the right to.
 *
 * Matched loosely against Commons' `LicenseShortName`, which is free text and varies
 * in punctuation and version ("CC BY-SA 4.0", "CC-BY-SA-3.0", "cc by sa 4.0").
 */
const FREE_LICENCE_PATTERNS: RegExp[] = [
  /\bcc[\s-]?0\b/i,
  /public[\s-]?domain/i,
  /\bpd\b/i,
  /\bcc[\s-]?by\b/i,
  /\bcc[\s-]?by[\s-]?sa\b/i,
  /\bfal\b/i, // Free Art License
  /\bgfdl\b/i,
];

/**
 * Licences that are refused outright even where they look permissive.
 *
 * NonCommercial and NoDerivatives are not free licences: they forbid uses this app
 * cannot rule out, and Commons occasionally carries a file tagged with one through
 * an error or a legacy import. Checked before the allow-list, because "CC BY-NC"
 * matches the pattern for "CC BY".
 */
const REFUSED_LICENCE_PATTERNS: RegExp[] = [/\bnc\b|noncommercial|non-commercial/i, /\bnd\b|noderiv/i, /fair[\s-]?use/i];

/** True when a Commons licence string permits display with attribution. */
export function isFreeLicence(shortName: string): boolean {
  const text = (shortName ?? '').trim();
  if (!text) return false;
  if (REFUSED_LICENCE_PATTERNS.some((p) => p.test(text))) return false;
  return FREE_LICENCE_PATTERNS.some((p) => p.test(text));
}

/** Why a submitted reference was not accepted, in words meant for the contributor. */
export interface PhotoRejection {
  reason: string;
  /** What the contributor should do about it. */
  fix: string;
}

export type PhotoReference = { file: string } | PhotoRejection;

export const isRejection = (result: PhotoReference): result is PhotoRejection => 'reason' in result;

/** Hosts whose links people will paste, with the reason each cannot be used. */
const KNOWN_HOSTS: { pattern: RegExp; reason: string }[] = [
  { pattern: /instagram\.com/i, reason: 'Instagram' },
  { pattern: /tiktok\.com/i, reason: 'TikTok' },
  { pattern: /facebook\.com|fb\.watch/i, reason: 'Facebook' },
  { pattern: /(twitter|x)\.com/i, reason: 'X' },
  { pattern: /pinterest\./i, reason: 'Pinterest' },
  { pattern: /youtube\.com|youtu\.be/i, reason: 'YouTube' },
];

/**
 * Read a Commons file name out of whatever the contributor pasted.
 *
 * People paste the file page, the mobile file page, the direct upload URL, the
 * `File:` title, or just the file name, and all five mean the same thing. Anything
 * that is not on Commons is refused with the reason and the way forward, because
 * "invalid input" tells someone who pasted their own Instagram post nothing about
 * what to do next — and what they should do is upload that same photograph, which
 * is theirs, to Commons.
 */
export function parsePhotoReference(copy: Copy, input: string): PhotoReference {
  const text = (input ?? '').trim();
  if (!text) {
    return { reason: copy.photoNothingEntered, fix: copy.photoNothingEnteredFix };
  }

  const host = KNOWN_HOSTS.find((h) => h.pattern.test(text));
  if (host) {
    return {
      // Phrased around the host name rather than before it: the list runs from
      // "Instagram" to "X", and no single article fits them all.
      reason: copy.photoWrongHost.replace('{host}', host.reason),
      fix: copy.photoWrongHostFix,
    };
  }

  // upload.wikimedia.org/wikipedia/commons/a/ab/Kaipola.jpg — the file is last, and
  // may be preceded by a thumbnail width segment.
  const upload = /upload\.wikimedia\.org\/wikipedia\/commons\/(?:thumb\/)?[^/]+\/[^/]+\/([^/?#]+)/i.exec(text);
  if (upload) return validateFile(copy, decodeURIComponent(upload[1]));

  // commons.wikimedia.org/wiki/File:Kaipola.jpg, desktop or mobile.
  const page = /commons\.m?\.?wikimedia\.org\/wiki\/(?:File|Image):([^?#]+)/i.exec(text);
  if (page) return validateFile(copy, decodeURIComponent(page[1]));

  if (/^https?:\/\//i.test(text)) {
    return {
      reason: copy.photoNotCommons,
      fix: copy.photoNotCommonsFix,
    };
  }

  return validateFile(copy, text.replace(/^(File|Image):/i, ''));
}

/** The file name itself has to name an image we can actually display. */
function validateFile(copy: Copy, raw: string): PhotoReference {
  const file = raw.replace(/_/g, ' ').trim();

  if (!file) {
    return { reason: copy.photoNoFileName, fix: copy.photoNoFileNameFix };
  }
  if (!/\.(jpe?g|png|webp|tiff?|gif)$/i.test(file)) {
    return {
      reason: copy.photoNotAPhotograph,
      fix: copy.photoNotAPhotographFix,
    };
  }
  if (/\.svg$/i.test(file)) {
    return { reason: copy.photoIsADrawing, fix: copy.photoIsADrawingFix };
  }

  return { file };
}

/**
 * A contributed photograph, once Commons has confirmed it exists and is free.
 *
 * `photoVerified` stays false, as it does for every image in the catalogue. A
 * contributor saying "this is my Kaipola" is good evidence and not the app's own
 * confirmation, and the badge means the second thing. It is the community validation
 * step that changes it, exactly as it does for the record's method.
 */
export interface ContributedPhoto {
  file: string;
  photo: string;
  credit: string;
  licence: string;
}

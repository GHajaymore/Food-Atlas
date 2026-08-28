/**
 * Ask Wikimedia for a photograph the size it is going to be shown at.
 *
 * The atlas requested full-resolution originals and displayed them in a 192px card.
 * Measured on the live home page: **8.9 MB of photographs for 63 thumbnails**, one of
 * them 1,645 KB on its own, and the largest arriving at 2269×1856 to be drawn at
 * 192×192. That is most of the page weight, and it is the answer to "why is rendering so
 * slow" for anybody not on a fast connection.
 *
 * Commons will scale on request. `Special:FilePath/NAME?width=N` returns a thumbnail
 * generated on demand, and the saving is not marginal:
 *
 *   1,684,377 -> 127,813 bytes   (a 1.6 MB JPEG at width=400)
 *   1,217,764 ->  38,978 bytes
 *   1,454,187 -> 433,791 bytes   (a PNG, which compresses less well)
 *
 * ## Why every URL is rewritten into this one form
 *
 * The catalogue holds three shapes, none of them width-limited — 3,055 `Special:FilePath`,
 * 5,998 `upload.../thumb/...`, 1,585 `upload/...` originals. The obvious repair for the
 * middle one is to edit the `960px-` in the path down to `400px-`, and it does not work:
 * Commons answered **HTTP 400** for the rewritten thumbnail, so every one of those 5,998
 * photographs would have become a broken image. Tested before writing, not after.
 *
 * The filename is recoverable from all three shapes, and `Special:FilePath` accepts it and
 * scales reliably — so all three are normalised to that rather than each being patched in
 * its own way.
 *
 * ## What it will not touch
 *
 * Anything that is not a Wikimedia URL is returned exactly as given. A photograph from
 * somewhere else is somebody else's server, and guessing at a resizing convention it may
 * not have is how you turn a working image into a 404.
 */

/** The file name inside a Wikimedia URL, still percent-encoded, or '' if this is not one. */
function commonsFile(uri: string): string {
  /* Already the form we want: everything after the marker, minus any query. */
  const direct = uri.match(/\/Special:FilePath\/([^?#]+)/);
  if (direct) return direct[1];

  /* A thumbnail: .../thumb/a/ab/NAME.jpg/960px-NAME.jpg — the original is the segment
     before the rendered one, not the rendered one. */
  const thumb = uri.match(/\/wikipedia\/[^/]+\/thumb\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)\//);
  if (thumb) return thumb[1];

  /* An original: .../wikipedia/commons/a/ab/NAME.jpg */
  const original = uri.match(/\/wikipedia\/[^/]+\/[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)/);
  if (original) return original[1];

  return '';
}

/**
 * The same photograph, asked for at a sensible width.
 *
 * `width` is the widest it will be drawn, in device pixels — so a 192px card on a 2x
 * screen wants 400, not 192. Commons caps generation at the original's own width, so
 * asking for more than exists costs nothing and returns the original.
 */
export function sizedPhoto(uri: string, width: number): string {
  if (!uri || !/wikimedia\.org|wikipedia\.org/.test(uri)) return uri;

  const file = commonsFile(uri);
  if (!file) return uri;

  return `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`;
}

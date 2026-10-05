/**
 * Tell a search engine not to index the page it is looking at.
 *
 * The web build is a single-page app and `_redirects` answers every unmatched URL with
 * `index.html` and a **200**. That is right for the reader — a shared link to
 * `/dish/4821` has to reach the app rather than a 404 — and wrong for a crawler, which
 * cannot tell "here is the page" from "here is the app, apologising". Every typo, every
 * stale link and every dead record id is, to Google, a real page returning 200: a soft
 * 404. Indexed, they dilute a site whose entire distribution is search.
 *
 * A status code cannot fix it, because the server does not know which paths the client
 * router will recognise. The screen does, so the screen says so: `robots: noindex` is
 * honoured when it arrives through JavaScript, which is also how the canonical tag is
 * written here (`scripts/inject-canonical.mjs`).
 *
 * Removed again on unmount, because the app keeps running: a reader who lands on a broken
 * link and then opens a real record must not leave that record marked unindexable.
 */

import { useEffect } from 'react';
import { Platform } from 'react-native';

const ID = 'wikifoodia-noindex';

/**
 * Mark this screen as one a search engine should not keep.
 *
 * Takes a condition rather than being called conditionally, because the screen that needs
 * it most — the record page, when the id matches nothing — decides that after its hooks
 * have run, and a hook cannot be called inside an `if`.
 */
export function useNoIndex(active = true): void {
  useEffect(() => {
    if (!active || Platform.OS !== 'web' || typeof document === 'undefined') return undefined;
    if (document.getElementById(ID)) return undefined;

    const tag = document.createElement('meta');
    tag.id = ID;
    tag.name = 'robots';
    tag.content = 'noindex';
    document.head.appendChild(tag);

    return () => tag.remove();
  }, [active]);
}

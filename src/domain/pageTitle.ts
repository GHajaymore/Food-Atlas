/**
 * What the browser tab says.
 *
 * `prerender-screens.mjs` gives every screen a title in its HTML, which is what a crawler
 * and a shared link see. It is not what a *reader* sees after the first click: this is a
 * single-page app, so moving from /how to a dish changes the URL and the page and leaves
 * the title exactly as it was. Four tabs open on four different screens all read
 * "How it works · WikiFoodia", and a bookmark saves the name of whatever page the reader
 * happened to land on first.
 *
 * So the title is also set on the client, from the reader's own language — the prerendered
 * one is English, because the HTML is. The two agree on shape (`<page> · WikiFoodia`) so a
 * tab does not visibly rewrite itself on arrival.
 *
 * Record pages are not here. A dish page knows its dish and sets its own title; a map in
 * this file would have to repeat the naming rule that `prerender-records.mjs` already owns.
 */

import { useEffect } from 'react';
import { Platform } from 'react-native';

import type { Copy } from '../i18n/copy';
import { BRAND } from '../brand';

/** Static screens, by the section they belong to rather than by exact path. */
const TITLES: { of: string; label: (copy: Copy) => string }[] = [
  { of: '/how', label: (copy) => copy.howItWorks },
  { of: '/atlas', label: (copy) => copy.foodAtlas },
  /* The longer phrase, because it is the one the prerendered HTML carries and a tab
     that rewrites itself from "Browse the world atlas" to "Browse" on arrival looks
     like a bug. `copy.browse` is the chip on the screen, not its name. */
  { of: '/browse', label: (copy) => copy.browseTheAtlas },
  { of: '/place', label: (copy) => copy.foodAtlas },
  { of: '/search', label: (copy) => copy.search },
  { of: '/propose', label: (copy) => copy.proposeADish },
  { of: '/contribute', label: (copy) => copy.proposeADish },
  { of: '/proposals', label: (copy) => copy.confirmAProposal },
  { of: '/support', label: (copy) => copy.keepingItFree },
  { of: '/privacy', label: (copy) => copy.privacyTitle },
];

/** `<page> · WikiFoodia`, or the brand alone on the home page and anything unlisted. */
export function titleFor(copy: Copy, path: string): string {
  const match = TITLES.find((entry) => path === entry.of || path.startsWith(entry.of + '/'));
  return match ? `${match.label(copy)} · ${BRAND.name}` : BRAND.name;
}

/**
 * Keep the tab's title matching the page under it.
 *
 * Web only, and silent everywhere else: on a phone build there is no document and no tab,
 * and the native header is set by the navigator. Takes the finished string rather than a
 * path so the record page — the one screen whose title is a dish's name — can use the
 * same hook as the rest.
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined' || !title) return;
    document.title = title;
  }, [title]);
}

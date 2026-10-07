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
 * Two kinds of screen name themselves — a record is its dish, a country is its country —
 * and both are listed in `SELF_NAMED` so this returns nothing for them. That is not tidiness:
 * React runs a child's effects before its parent's, so the layout's title is written *after*
 * the screen's and would overwrite it. Measured, after this file first claimed the opposite:
 * clicking Japan on the atlas left the tab reading "WikiFoodia".
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

/** The screens that set their own title from the thing they are showing. */
const SELF_NAMED = ['/dish', '/country'];

/**
 * `<page> · WikiFoodia`, the brand alone on the home page and anything unlisted, and an
 * empty string for a screen that names itself — which `useDocumentTitle` ignores.
 */
export function titleFor(copy: Copy, path: string): string {
  if (SELF_NAMED.some((base) => path === base || path.startsWith(base + '/'))) return '';
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

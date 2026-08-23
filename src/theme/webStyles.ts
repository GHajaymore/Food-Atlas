/**
 * Web-only style shims.
 *
 * Two Nocturne behaviours have no react-native-web style equivalent, so they are
 * injected as real CSS on web and expressed as native style props elsewhere:
 *
 *   - `mix-blend-mode: lighten` on photographs (the `.lighten` treatment). RNW's
 *     style resolver drops `mixBlendMode`, so the Image carries `data-lighten` and
 *     the rule below does the work. It blends against whatever the page paints
 *     behind it — the card surface, or the page ground — exactly as the design does.
 *   - The document ground. The app's screens paint `--color-bg`, but the page behind
 *     them is transparent by default, which shows through as white around the app
 *     and, more importantly, is the backdrop the blend above composites against.
 */

import { Platform } from 'react-native';
import { color } from './tokens';

const CSS = `
html, body, #root { background-color: ${color.bg}; }
body { margin: 0; overscroll-behavior: none; }
[data-lighten="true"] { mix-blend-mode: lighten; }
/*
 * Scrollbars: hidden on a phone, present and styled on anything wider.
 *
 * The blanket rule this replaces hid every scrollbar at every size, which is right for
 * the phone design — the gesture is direct, a bar would cover content, and the shelves
 * are meant to look like rails rather than like scrolling panes. It also silently
 * overrode ScrollView's own showsVerticalScrollIndicator, so setting that prop on
 * desktop did nothing at all and the page looked like a short one that had stopped.
 *
 * On a desktop the bar is the only thing that says how much more there is, and the only
 * way to drag to the bottom of eighteen thousand records. So it comes back above the
 * tablet breakpoint — painted to match the ground rather than left as the browser's
 * default grey slab on a dark page.
 *
 * Horizontal bars stay hidden at every size: the rails they belong to become grids on
 * wide screens anyway, so a horizontal bar on a desktop is always something that has
 * gone wrong rather than something to look at.
 */
@media (max-width: 759px) {
  ::-webkit-scrollbar { display: none; }
  * { scrollbar-width: none; }
}
@media (min-width: 760px) {
  * { scrollbar-width: thin; scrollbar-color: ${color.neutral[700]} transparent; }
  ::-webkit-scrollbar { width: 10px; height: 0; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: ${color.neutral[700]};
    border-radius: 5px;
    border: 2px solid ${color.bg};
  }
  ::-webkit-scrollbar-thumb:hover { background: ${color.neutral[600]}; }
}
`;

let injected = false;

export function installWebStyles(): void {
  if (Platform.OS !== 'web' || injected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-nocturne', 'true');
  style.textContent = CSS;
  document.head.appendChild(style);
  injected = true;
}
